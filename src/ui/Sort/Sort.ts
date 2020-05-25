import 'styling/_Sort';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { IBuildingQueryEventArgs, IQueryErrorEventArgs, IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { Assert } from '../../misc/Assert';
import { IAttributesChangedEventArg, MODEL_EVENTS } from '../../models/Model';
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
import { SortCriteria } from './SortCriteria';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { l } from '../../strings/Strings';

export interface ISortOptions {
  sortCriteria?: SortCriteria[];
  caption?: string;
}
/**
 * The `Sort` component renders a widget that the end user can interact with to select the criterion to use when sorting query results.
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
        return _.map(values, criteria => {
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

  private icon: HTMLElement;

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

    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.SORT, (args: IAttributesChangedEventArg) =>
      this.handleQueryStateChanged(args)
    );
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.queryError, (args: IQueryErrorEventArgs) => this.handleQueryError(args));
    this.setTextToCaptionIfDefined();
    this.addAccessiblityAttributes();

    if (this.isToggle()) {
      this.icon = $$('span', { className: 'coveo-icon' }).el;
      const iconAscending = $$('span', { className: 'coveo-sort-icon-ascending' }, SVGIcons.icons.arrowUp);
      SVGDom.addClassToSVGInContainer(iconAscending.el, 'coveo-sort-icon-ascending-svg');
      const iconDescending = $$('span', { className: 'coveo-sort-icon-descending' }, SVGIcons.icons.arrowDown);
      SVGDom.addClassToSVGInContainer(iconDescending.el, 'coveo-sort-icon-descending-svg');
      this.icon.appendChild(iconAscending.el);
      this.icon.appendChild(iconDescending.el);
      this.element.appendChild(this.icon);
    }

    this.update();
    this.updateAppearance();
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
      this.currentCriteria = _.find(this.options.sortCriteria, (criteria: SortCriteria) => {
        return criteria.direction == direction;
      });
    } else if (Utils.exists(this.currentCriteria)) {
      var indexOfCurrentCriteria = _.indexOf(this.options.sortCriteria, this.currentCriteria);
      Assert.check(indexOfCurrentCriteria >= 0);
      this.currentCriteria = this.options.sortCriteria[(indexOfCurrentCriteria + 1) % this.options.sortCriteria.length];
    } else {
      this.currentCriteria = this.options.sortCriteria[0];
    }

    this.queryStateModel.set(QueryStateModel.attributesEnum.sort, this.currentCriteria.toString());
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
      this.queryController.deferExecuteQuery({
        beforeExecuteQuery: () => logSortEvent(this.usageAnalytics, this.currentCriteria.sort + this.currentCriteria.direction)
      });
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
    return _.any(this.options.sortCriteria, (sortCriteria: SortCriteria) => sortId == sortCriteria.toString());
  }

  private handleQueryStateChanged(data: IAttributesChangedEventArg) {
    this.update();
  }

  private update() {
    // Basically, if the criteria in the model fits with one of ours, it'll become our active criteria
    var sortCriteria = <string>this.queryStateModel.get(QueryStateModel.attributesEnum.sort);
    if (Utils.isNonEmptyString(sortCriteria)) {
      var criteriaFromModel = SortCriteria.parse(sortCriteria);
      this.currentCriteria = _.find(this.options.sortCriteria, (criteria: SortCriteria) => criteriaFromModel.equals(criteria));
    } else {
      this.currentCriteria = null;
    }
    this.updateAppearance();
    this.updateAccessibilityProperties();
  }

  private setTextToCaptionIfDefined() {
    this.captionIsDefined && $$(this.element).text(this.options.caption);
  }

  private get captionIsDefined() {
    return Utils.isNonEmptyString(this.options.caption);
  }

  private get currentDirection() {
    return this.currentCriteria ? this.currentCriteria.direction : this.options.sortCriteria[0].direction;
  }

  private addAccessiblityAttributes() {
    new AccessibleButton()
      .withElement(this.element)
      .withSelectAction(() => this.handleClick())
      .withLabel(this.getAccessibleLabel())
      .build();
    this.updateAccessibleSelectedState();
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

  private handleClick() {
    this.selectAndExecuteQuery();
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
    this.updateAccessibleSelectedState();
    this.updateAccessibleLabel();
  }

  private updateAccessibleSelectedState() {
    this.element.setAttribute('aria-pressed', this.isSelected().toString());
  }

  private updateAccessibleLabel() {
    this.element.setAttribute('aria-label', this.getAccessibleLabel());
  }

  private getAccessibleLabel() {
    return this.isToggle() ? this.getAccessibleLabelWithSort() : this.getAccessibleLabelWithoutSort();
  }

  private getAccessibleLabelWithSort(): string {
    const localizedCaption = l(this.displayedSortText);
    if (this.isSelected()) {
      if (this.currentDirection === 'ascending') {
        return l('SortResultsByDescending', localizedCaption);
      } else {
        return l('SortResultsByAscending', localizedCaption);
      }
    }

    if (this.currentDirection === 'ascending') {
      return l('SortResultsByAscending', localizedCaption);
    }

    return l('SortResultsByDescending', localizedCaption);
  }

  private getAccessibleLabelWithoutSort(): string {
    const localizedCaption = l(this.displayedSortText);
    return l('SortResultsBy', localizedCaption);
  }
}

Initialization.registerAutoCreateComponent(Sort);
