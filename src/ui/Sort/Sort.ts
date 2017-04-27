import {Component} from '../Base/Component';
import {SortCriteria} from './SortCriteria.ts';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Assert} from '../../misc/Assert';
import {Utils} from '../../utils/Utils';
import {$$} from '../../utils/Dom';
import {Model, IAttributesChangedEventArg} from '../../models/Model';
import {QueryStateModel} from '../../models/QueryStateModel';
import {QueryEvents, IQuerySuccessEventArgs, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {Initialization} from '../Base/Initialization';
import {analyticsActionCauseList, IAnalyticsResultsSortMeta} from '../Analytics/AnalyticsActionListMeta';

export interface ISortOptions {
  sortCriteria?: SortCriteria[];
  caption?: string;
}
/**
 * This component displays a sort criteria for searching.
 */
export class Sort extends Component {
  static ID = 'Sort';
  /**
   * Options for the component
   * @componentOptions
   */
  static options: ISortOptions = {
    /**
     * The criteria for sorting<br/>
     * The available criteria are:
     * <ul>
     *   <li><code>relevancy</code></li>
     *   <li><code>Date</code></li>
     *   <li><code>qre</code></li>
     *   <li><code>@fieldname</code> (replace fieldname with an actual field name (e.g. <code>@syssize</code>)</li>
     * </ul>
     *
     * A direction (ascending or descending) can be specified, for example "date ascending"<br/>
     * A Sort component can have multiple criteria, passed as a list<br/>
     * This option is required.
     */
    sortCriteria: ComponentOptions.buildCustomListOption((values: string[] | SortCriteria[]) => {
      return _.map(<any>values, (criteria) => { // 'any' because Underscore won't accept the union type as an argument.
        if (typeof criteria === 'string') {
          return SortCriteria.parse(criteria);
        } else {
          return <SortCriteria>criteria;
        }
      })
    }, { required: true }),
    /**
     * The caption to display on the element<br/>
     * If not specified, the component will use the tag's body
     */
    caption: ComponentOptions.buildLocalizedStringOption({ required: true })
  };

  private currentCriteria: SortCriteria;

  /**
   * Create a new Sort component.
   * @param element
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options?: ISortOptions, bindings?: IComponentBindings) {
    super(element, Sort.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Sort, options);

    Assert.isLargerOrEqualsThan(1, this.options.sortCriteria.length);

    var eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne) + QueryStateModel.attributesEnum.sort;
    this.bind.onRootElement(eventName, (args: IAttributesChangedEventArg) => this.handleQueryStateChanged(args))
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args))
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.on(this.element, 'click', () => this.handleClick());

    if (Utils.isNonEmptyString(this.options.caption)) {
      $$(this.element).text(this.options.caption);
    }

    if (this.isToggle()) {
      this.element.innerHTML += '<span class="coveo-icon" />';
    }

    this.updateAppearance();
  }

  /**
   * Select the Sort component.
   * @param direction The sort direction (e.g. ascending, descending)<br/>
   * Will trigger a query if the selection made the criteria change (if it was toggled)
   */
  public select(direction?: string) {
    if (direction) {
      this.currentCriteria = _.find(this.options.sortCriteria, (criteria: SortCriteria) => {
        return criteria.direction == direction
      })
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
    super.enable();
  }

  public disable() {
    $$(this.element).addClass('coveo-tab-disabled');
    super.disable();
  }

  /**
   * Get the current SortCriteria.
   */
  public getCurrentCriteria(): SortCriteria {
    return this.currentCriteria;
  }

  /**
   * Returns true if one of the sort criterias matches the passed argument.
   * @param sortId The sort criteria to verify with (e.g. 'date descending')
   */
  public match(sortId: string) {
    return _.any(this.options.sortCriteria, (sortCriteria: SortCriteria) => sortId == sortCriteria.toString())
  }

  private handleQueryStateChanged(data: IAttributesChangedEventArg) {
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
      $$(this.element).addClass('coveo-sort-hidden')
    } else {
      $$(this.element).removeClass('coveo-sort-hidden');
    }
  }

  private handleClick() {
    var oldCriteria = this.currentCriteria;
    this.select();
    if (oldCriteria != this.currentCriteria) {
      this.queryController.deferExecuteQuery({
        beforeExecuteQuery: () => this.usageAnalytics.logSearchEvent<IAnalyticsResultsSortMeta>(analyticsActionCauseList.resultsSort,
          { resultsSortBy: this.currentCriteria.sort + this.currentCriteria.direction })
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
      $$(this.element).toggleClass('coveo-ascending', direction == 'ascending');
    }
  }

}

Initialization.registerAutoCreateComponent(Sort);
