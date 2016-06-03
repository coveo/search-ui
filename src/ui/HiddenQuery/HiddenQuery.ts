import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {l} from '../../strings/Strings';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {BreadcrumbEvents, IPopulateBreadcrumbEventArgs} from '../../events/BreadcrumbEvents';
import {analyticsActionCauseList, IAnalyticsContextRemoveMeta} from '../Analytics/AnalyticsActionListMeta';
import {QUERY_STATE_ATTRIBUTES, QueryStateModel} from '../../models/QueryStateModel';
import {$$} from '../../utils/Dom';
import {Utils} from '../../utils/Utils';
import {Initialization} from '../Base/Initialization';
import {Assert} from '../../misc/Assert';

export interface IHiddenQueryOptions {
  maximumDescriptionLength: number;
  title: string;
}

/**
 * This component job is to handle an 'hidden' query parameter.<br/>
 * Concretely, this means that a search interface loaded with #hq=foo&hd=bar will add 'foo' as an expression to the query ('hq'=> hidden query) and render 'bar' in the {@link Breadcrumb}<br/>
 */
export class HiddenQuery extends Component {
  static ID = 'HiddenQuery';
  /**
   * Possible options for the HiddenQuery component
   * @componentOptions
   */
  static options: IHiddenQueryOptions = {
    /**
     * Specifies a maximum character length for a description.<br/>
     * After this length, the component will slice the descrption and add [...].<br/>
     * Default value is 100
     */
    maximumDescriptionLength: ComponentOptions.buildNumberOption({ min: 0, defaultValue: 100 }),
    /**
     * Specifies a title that will appear in the {@link Breadcrumb} when it is populated by the HiddenQuery component.<br/>
     * By default, it is a localized string for 'Additional filters :'
     */
    title: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('AdditionalFilters') + ' : ' })
  };

  /**
   * Create a new HiddenQuery component, which bind multiple events (building query as well as {@link Breadcrumb} events
   * @param element
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options?: IHiddenQueryOptions, bindings?: IComponentBindings) {

    super(element, HiddenQuery.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, HiddenQuery, options);

    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) => this.handlePopulateBreadcrumb(args));
    this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.setStateEmpty());
  }

  /**
   * Clear any hd or hq set in the {@link QueryStateModel}, log an analytics event and trigger a new query.
   */
  public clear() {
    this.setStateEmpty();
    let hiddenDescriptionRemoved = this.getDescription();
    this.usageAnalytics.logSearchEvent<IAnalyticsContextRemoveMeta>(analyticsActionCauseList.contextRemove, { contextName: hiddenDescriptionRemoved });
    this.queryController.executeQuery();
  }

  private setStateEmpty() {
    this.queryStateModel.set(QUERY_STATE_ATTRIBUTES.HD, '');
    this.queryStateModel.set(QUERY_STATE_ATTRIBUTES.HQ, '');
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);
    let hiddenQuery = this.queryStateModel.get(QUERY_STATE_ATTRIBUTES.HQ);
    if (Utils.isNonEmptyString(hiddenQuery)) {
      data.queryBuilder.advancedExpression.add(hiddenQuery);
    }
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    let description = this.getDescription();
    if (!_.isEmpty(description) && !_.isEmpty(this.queryStateModel.get(QUERY_STATE_ATTRIBUTES.HQ))) {
      let elem = document.createElement('div');
      $$(elem).addClass('coveo-hidden-query-breadcrumb');

      let title = document.createElement('span');
      $$(title).addClass('coveo-hidden-query-breadcrumb-title');
      $$(title).text(this.options.title);
      elem.appendChild(title);

      let values = document.createElement('span');
      $$(values).addClass('coveo-hidden-query-breadcrumb-values');
      elem.appendChild(values);

      let value = document.createElement('span');
      $$(value).addClass('coveo-hidden-query-breadcrumb-value');
      $$(value).text(description);
      values.appendChild(value);

      let clear = document.createElement('span');
      $$(clear).addClass('coveo-hidden-query-breadcrumb-clear');
      elem.appendChild(clear);

      $$(elem).on('click', () => this.clear());

      args.breadcrumbs.push({
        element: elem
      })
    }
  }

  private getDescription() {
    let description = this.queryStateModel.get(QueryStateModel.attributesEnum.hd);
    if (_.isEmpty(description)) {
      description = this.queryStateModel.get(QueryStateModel.attributesEnum.hq);
    }
    if (!_.isEmpty(description)) {
      if (description.length > this.options.maximumDescriptionLength) {
        description = description.slice(0, this.options.maximumDescriptionLength) + ' ...';
      }
    }
    return description;
  }
}
Initialization.registerAutoCreateComponent(HiddenQuery);
