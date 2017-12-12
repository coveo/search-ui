import { Component } from '../Base/Component';
import { SortCriteria } from './SortCriteria';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { $$ } from '../../utils/Dom';
import { IAttributesChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { QueryStateModel, QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { QueryEvents, IQuerySuccessEventArgs, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { Initialization } from '../Base/Initialization';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import { IQueryErrorEventArgs } from '../../events/QueryEvents';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

import 'styling/_Sort';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { logSortEvent } from '../Analytics/SharedAnalyticsCalls';

export interface ISortOptions {
  sortCriteria?: SortCriteria[];
  caption?: string;
}
/**
 * The Sort component renders a widget that the end user can interact with to sort query results according to a single
 * criterion or list of criteria.
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
     * Specifies the criterion (or criteria) for sorting.
     *
     * The possible criteria are:
     * - `relevancy`
     * - `date`
     * - `qre`
     * - `@fieldname` (replace `fieldname` with an actual field name (e.g., `@size`)
     *
     * You can also specify a direction (`ascending` or `descending`), for example `date ascending`.
     *
     * You can pass an array containing multiple criteria to the Sort component.
     * If you specify multiple criteria, all criteria must have the same direction (either `ascending` or
     * `descending`).
     * You can only use the `date` and `@fieldname` criteria when specifying multiple criteria.
     * Multiple criteria are evaluated in the order you specify them.
     *
     * It is necessary to specify a value for this option in order for this component to work.
     */
    sortCriteria: ComponentOptions.buildCustomListOption(
      (values: string[] | SortCriteria[]) => {
        return _.map(<any>values, criteria => {
          // 'any' because Underscore won't accept the union type as an argument.
          if (typeof criteria === 'string') {
            return SortCriteria.parse(criteria);
          } else {
            return <SortCriteria>criteria;
          }
        });
      },
      { required: true }
    ),

    /**
     * Specifies the caption to display on the element.
     *
     * If you do not specify a value for this option, the component uses the tag body of the element.
     */
    caption: ComponentOptions.buildLocalizedStringOption({ required: true })
  };

  private currentCriteria: SortCriteria;

  private icon: HTMLElement;

  /**
   * Creates a new Sort component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Sort component.
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
    const clickAction = () => this.handleClick();
    this.bind.on(this.element, 'click', clickAction);
    this.bind.on(this.element, 'keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, clickAction));

    this.element.setAttribute('tabindex', '0');
    if (Utils.isNonEmptyString(this.options.caption)) {
      $$(this.element).text(this.options.caption);
    }

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
   * Selects the Sort component. Triggers a new query if selecting the component changes the current
   * {@link Sort.options.sortCriteria} (if it is toggled).
   * @param direction The sort direction. Can be either `ascending` or `descending`.
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
   * Gets the current {@link Sort.options.sortCriteria}.
   * @returns {SortCriteria}
   */
  public getCurrentCriteria(): SortCriteria {
    return this.currentCriteria;
  }

  /**
   * Indicates whether the name of any of the {@link Sort.options.sortCriteria} matches the argument.
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
    var oldCriteria = this.currentCriteria;
    this.select();
    if (oldCriteria != this.currentCriteria) {
      this.queryController.deferExecuteQuery({
        beforeExecuteQuery: () => logSortEvent(this.usageAnalytics, this.currentCriteria.sort + this.currentCriteria.direction)
      });
    }
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
      var direction = this.currentCriteria ? this.currentCriteria.direction : this.options.sortCriteria[0].direction;
      $$(this.element).removeClass('coveo-ascending');
      $$(this.element).removeClass('coveo-descending');
      if (this.isSelected()) {
        $$(this.element).addClass(direction === 'ascending' ? 'coveo-ascending' : 'coveo-descending');
      }
    }
  }
}

Initialization.registerAutoCreateComponent(Sort);
