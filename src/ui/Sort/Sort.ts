import 'styling/_Sort';
import { exportGlobally } from '../../GlobalExports';
import { IBuildingQueryEventArgs, IQueryErrorEventArgs, IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { Assert } from '../../misc/Assert';
import { MODEL_EVENTS } from '../../models/Model';
import { QUERY_STATE_ATTRIBUTES, QueryStateModel } from '../../models/QueryStateModel';
import { $$ } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Utils } from '../../utils/Utils';
import { logSortEvent } from '../Analytics/SharedAnalyticsCalls';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { SortCriteria, VALID_DIRECTION } from './SortCriteria';
import { AccessibleButton, ArrowDirection } from '../../utils/AccessibleButton';
import { l } from '../../strings/Strings';
import { findIndex, find, any } from 'underscore';

export interface ISortOptions {
  sortCriteria?: SortCriteria[];
  caption?: string;
}
/**
 * The `Sort` component renders a widget that the end user can interact with to select the criterion to use when sorting query results.
 *
 * To improve accessibility, it's recommended to group `Sort` components in a container with `role="radiogroup"`.
 */
export class Sort extends Component {
  static ID = 'Sort';

  static doExport = () => {
    exportGlobally({
      Sort: Sort,
      SortCriteria: SortCriteria
    });
  };

  /**
   * Options for the component
   * @componentOptions
   */
  static options: ISortOptions = {
    /**
     * The sort criterion/criteria the end user can select/toggle between when interacting with this component instance.
     *
     * The available sort criteria are:
     * - `relevancy`
     * - `date ascending`/`date descending`
     * - `qre`
     * - `@field ascending`/`@field descending`, where you must replace `field` with the name of a sortable field in your index (e.g., `data-sort-criteria="@size ascending"`).
     *
     * You can specify a comma separated list of sort criteria to toggle between when interacting with this component instance (e.g., `data-sort-criteria="date descending,date ascending"`).
     *
     * You can specify multiple sort criteria to be used in the same request by separating them with a semicolon (e.g., `data-sort-criteria="@size ascending;date ascending"` ).
     *
     * Interacting with this component instance will cycle through those criteria in the order they are listed in.
     * Typically, you should only specify a list of sort criteria when you want the end user to be able to to toggle the direction of a `date` or `@field` sort criteria.
     * Otherwise, you should configure a distinct `Sort` component instance for each sort criterion you want to make available in your search page.
     *
     * You must specify a valid value for this option in order for this component instance to work correctly.
     *
     * Examples:
     *
     * - `data-sort-criteria="date ascending"` createes a Sort component that allows to sort on `date ascending`, without being able to toggle the order.
     * - `data-sort-criteria="date ascending, date descending"` creates a Sort component that allows end users to toggle between `date ascending` and `date descending` on click.
     * - `data-sort-criteria="@size ascending; date descending"` creates a Sort component that only allows end users to sort on `@size ascending`. The index then applies a second sort on `date descending` when two items are of equal value.
     * - `data-sort-criteria="@size ascending; date descending, @size descending; date descending"` creates a Sort component that allows end users to toggle between `@size ascending` and `@size descending`. For each value, the index applies a second sort on `date descending` when two items are of equal value.
     */
    sortCriteria: ComponentOptions.buildCustomListOption(
      values => {
        return values.map(criteria => {
          // 'any' because Underscore won't accept the union type as an argument.
          if (typeof criteria === 'string') {
            return new SortCriteria(criteria);
          } else {
            return criteria as SortCriteria;
          }
        });
      },
      { required: true }
    ),

    /**
     * The caption to display on this component instance.
     *
     * By default, the component uses the text content of the element it is instanciated on.
     */
    caption: ComponentOptions.buildLocalizedStringOption({ required: true })
  };

  private currentCriteria: SortCriteria;

  private sortButton: HTMLElement;
  private directionButton: HTMLElement;
  private radioGroup: HTMLElement;

  /**
   * Creates a new `Sort` component instance.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for this component instance.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: ISortOptions, bindings?: IComponentBindings) {
    super(element, Sort.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Sort, options);

    Assert.isLargerOrEqualsThan(1, this.options.sortCriteria.length);

    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.SORT, () => this.handleQueryStateChanged());
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.queryError, (args: IQueryErrorEventArgs) => this.handleQueryError(args));
    this.ensureDom();
  }

  public createDom() {
    const el = $$(this.element);
    el.on('click', () => this.selectAndExecuteQuery());
    const innerText = el.text();
    el.empty();

    this.findOrCreateRadioGroup();
    this.createSortButton(innerText);
    if (this.isToggle()) {
      this.createDirectionButton();
    }

    this.update();
  }

  /**
   * Selects this `Sort` component.
   *
   * Updates the state model if selecting this component toggles its current [`sortCriteria`]{@link Sort.options.sortCriteria}.
   *
   * @param direction The sort direction. Can be one of: `ascending`, `descending`.
   */
  public select(direction?: string) {
    if (direction) {
      this.currentCriteria = find(this.options.sortCriteria, (criteria: SortCriteria) => {
        return criteria.direction == direction;
      });
      this.updateQueryStateModel();
    } else if (Utils.exists(this.currentCriteria)) {
      this.selectNextCriteria();
    } else {
      this.selectFirstCriteria();
    }
  }

  /**
   * Selects this `Sort` component, then triggers a query if selecting this component toggles its current [`sortCriteria`]{@link Sort.options.sortCriteria}.
   *
   * Also logs an event in the usage analytics with the new current sort criteria.
   */

  public selectAndExecuteQuery() {
    var oldCriteria = this.currentCriteria;
    this.select();
    if (oldCriteria != this.currentCriteria) {
      this.executeSearchQuery();
    }
  }

  public enable() {
    $$(this.element).removeClass('coveo-tab-disabled');
    this.update();
    super.enable();
  }

  public disable() {
    $$(this.element).addClass('coveo-tab-disabled');
    super.disable();
  }

  /**
   * Gets the current [`sortCriteria`]{@link Sort.options.sortCriteria} of this `Sort` component.
   * @returns {SortCriteria}
   */
  public getCurrentCriteria(): SortCriteria {
    return this.currentCriteria;
  }

  /**
   * Indicates whether the name of any of the available [`sortCriteria`]{@link Sort.options.sortCriteria} of this `Sort` component matches the argument.
   * @param sortId The sort criteria name to look for (e.g., `date descending`).
   */
  public match(sortId: string) {
    return any(this.options.sortCriteria, (sortCriteria: SortCriteria) => sortId == sortCriteria.toString());
  }

  private findOrCreateRadioGroup() {
    this.radioGroup = this.findRadioGroup();
    if (!this.radioGroup) {
      this.element.setAttribute('role', 'radiogroup');
      this.radioGroup = this.element;
    }
  }

  private createSortButton(innerText?: string) {
    this.sortButton = $$('span').el;
    this.sortButton.innerText = this.options.caption || innerText;
    new AccessibleButton()
      .withElement(this.sortButton)
      .withEnterKeyboardAction(() => this.selectAndExecuteQuery())
      .withArrowsAction((direction, e) => this.onArrowPressed(direction, e))
      .withLabel(this.isToggle() ? this.getDirectionalLabel(this.initialDirection as VALID_DIRECTION) : this.getOmnidirectionalLabel())
      .withRole('radio')
      .build();
    this.element.appendChild(this.sortButton);
  }

  private createDirectionButton() {
    this.directionButton = $$('span', { className: 'coveo-icon' }, ...this.createIcons()).el;
    new AccessibleButton()
      .withElement(this.directionButton)
      .withSelectAction(e => {
        e.stopPropagation();
        this.selectNextCriteriaAndExecuteQuery();
      })
      .withArrowsAction((direction, e) => this.onArrowPressed(direction, e))
      .withLabel(
        this.getDirectionalLabel(
          this.initialDirection === VALID_DIRECTION.DESCENDING ? VALID_DIRECTION.ASCENDING : VALID_DIRECTION.DESCENDING
        )
      )
      .withRole('radio')
      .build();
    this.element.appendChild(this.directionButton);
  }

  private onArrowPressed(direction: ArrowDirection, e: Event) {
    this.selectNextRadioButton(direction === ArrowDirection.RIGHT || direction === ArrowDirection.DOWN ? 1 : -1);
    e.stopPropagation();
  }

  private createIcons() {
    const iconAscending = $$('span', { className: 'coveo-sort-icon-ascending' }, SVGIcons.icons.arrowUp);
    SVGDom.addClassToSVGInContainer(iconAscending.el, 'coveo-sort-icon-ascending-svg');
    const iconDescending = $$('span', { className: 'coveo-sort-icon-descending' }, SVGIcons.icons.arrowDown);
    SVGDom.addClassToSVGInContainer(iconDescending.el, 'coveo-sort-icon-descending-svg');
    return [iconAscending, iconDescending];
  }

  private findRadioGroup(element = this.element) {
    if (!element || element === document.body) {
      return null;
    }
    if (element.getAttribute('role') === 'radiogroup') {
      return element;
    }
    return this.findRadioGroup(element.parentElement);
  }

  private selectNextRadioButton(direction = 1) {
    const radioButtons = $$(this.radioGroup).findAll('[role="radio"]');
    const currentIndex = findIndex(radioButtons, radio => radio.getAttribute('aria-checked') === 'true');
    let indexToSelect: number;
    const isAnythingSelected = currentIndex !== -1;
    if (isAnythingSelected) {
      indexToSelect = (currentIndex + direction + radioButtons.length) % radioButtons.length;
    } else {
      if (direction >= 0) {
        indexToSelect = 0;
      } else {
        indexToSelect = radioButtons.length - 1;
      }
    }
    const radioToSelect = radioButtons[indexToSelect];
    radioToSelect.focus();
    radioToSelect.click();
  }

  private executeSearchQuery() {
    this.queryController.deferExecuteQuery({
      beforeExecuteQuery: () => logSortEvent(this.usageAnalytics, this.currentCriteria.sort + this.currentCriteria.direction)
    });
  }

  private selectFirstCriteria() {
    this.currentCriteria = this.options.sortCriteria[0];
    this.updateQueryStateModel();
  }

  private selectNextCriteria() {
    const indexOfCurrentCriteria = this.currentCriteria ? this.options.sortCriteria.indexOf(this.currentCriteria) : 0;
    this.currentCriteria = this.options.sortCriteria[(indexOfCurrentCriteria + 1) % this.options.sortCriteria.length];
    this.updateQueryStateModel();
  }

  private selectNextCriteriaAndExecuteQuery() {
    const oldCriteria = this.currentCriteria;
    this.selectNextCriteria();
    if (oldCriteria != this.currentCriteria) {
      this.executeSearchQuery();
    }
  }

  private handleQueryStateChanged() {
    this.update();
  }

  private update() {
    // Basically, if the criteria in the model fits with one of ours, it'll become our active criteria
    var sortCriteria = <string>this.queryStateModel.get(QueryStateModel.attributesEnum.sort);
    if (Utils.isNonEmptyString(sortCriteria)) {
      var criteriaFromModel = SortCriteria.parse(sortCriteria);
      this.currentCriteria = find(this.options.sortCriteria, (criteria: SortCriteria) => criteriaFromModel.equals(criteria));
    } else {
      this.currentCriteria = null;
    }
    this.updateAppearance();
    this.updateAccessibilityProperties();
  }

  private get captionIsDefined() {
    return Utils.isNonEmptyString(this.options.caption);
  }

  private get currentDirection() {
    return this.currentCriteria ? this.currentCriteria.direction : this.initialDirection;
  }

  private get initialDirection() {
    return this.options.sortCriteria[0].direction;
  }

  private get displayedSortText() {
    return this.captionIsDefined ? this.options.caption : this.element.textContent;
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);

    var sort = this.queryStateModel.get(QueryStateModel.attributesEnum.sort);
    if (sort == QueryStateModel.defaultAttributes.sort || this.isSelected()) {
      if (this.currentCriteria) {
        this.currentCriteria.putInQueryBuilder(data.queryBuilder);
      }
    }
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    if (data.results.results.length == 0) {
      $$(this.element).addClass('coveo-sort-hidden');
    } else {
      $$(this.element).removeClass('coveo-sort-hidden');
    }
  }

  private handleQueryError(data: IQueryErrorEventArgs) {
    $$(this.element).addClass('coveo-sort-hidden');
  }

  private isToggle(): boolean {
    return this.options.sortCriteria.length > 1;
  }

  private isSelected(): boolean {
    return Utils.exists(this.currentCriteria);
  }

  private updateAppearance() {
    $$(this.element).toggleClass('coveo-selected', this.isSelected());
    if (this.isToggle()) {
      $$(this.element).removeClass('coveo-ascending');
      $$(this.element).removeClass('coveo-descending');
      if (this.isSelected()) {
        $$(this.element).addClass(this.currentDirection === 'ascending' ? 'coveo-ascending' : 'coveo-descending');
      }
    }
  }

  private updateAccessibilityProperties() {
    const directionIsInitial = this.currentDirection === this.initialDirection;
    this.sortButton.setAttribute('aria-checked', `${this.isSelected() && directionIsInitial}`);
    if (this.isToggle()) {
      this.directionButton.setAttribute('aria-checked', `${this.isSelected() && !directionIsInitial}`);
    }
  }

  private getDirectionalLabel(direction: VALID_DIRECTION) {
    const localizedCaption = l(this.displayedSortText);
    return direction === VALID_DIRECTION.DESCENDING
      ? l('SortResultsByDescending', localizedCaption)
      : l('SortResultsByAscending', localizedCaption);
  }

  private getOmnidirectionalLabel(): string {
    const localizedCaption = l(this.displayedSortText);
    return l('SortResultsBy', localizedCaption);
  }

  private updateQueryStateModel() {
    this.queryStateModel.set(QueryStateModel.attributesEnum.sort, this.currentCriteria.toString());
  }
}

Initialization.registerAutoCreateComponent(Sort);
