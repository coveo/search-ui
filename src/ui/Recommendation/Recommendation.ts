import {SearchInterface, ISearchInterfaceOptions} from '../SearchInterface/SearchInterface';
import {ComponentOptions} from '../Base/ComponentOptions';
import {QueryEvents, IQuerySuccessEventArgs, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {OmniboxEvents} from '../../events/OmniboxEvents';
import {ResultListEvents} from '../../events/ResultListEvents';
import {SettingsEvents} from '../../events/SettingsEvents';
import {PreferencesPanelEvents} from '../../events/PreferencesPanelEvents';
import {AnalyticsEvents} from '../../events/AnalyticsEvents';
import {analyticsActionCauseList, IAnalyticsNoMeta} from '../Analytics/AnalyticsActionListMeta'
import {BreadcrumbEvents} from '../../events/BreadcrumbEvents';
import {QuickviewEvents} from '../../events/QuickviewEvents';
import {QUERY_STATE_ATTRIBUTES} from '../../models/QueryStateModel';
import {Model} from '../../models/Model';
import {IQueryResult} from '../../rest/QueryResult';
import {Utils} from '../../utils/Utils';
import {$$} from '../../utils/Dom';

declare var coveoanalytics: CoveoAnalytics.CoveoUA;

export interface IRecommendationOptions extends ISearchInterfaceOptions {
  mainSearchInterface?: HTMLElement;
  userContext?: string;
  id?: string;
  optionsToUse?: string[];
  sendActionsHistory?: boolean;
  hideIfNoResults?: boolean;
}

/**
 * This component is a {@link SearchInterface} that will display recommendations based on the user history.
 * To get recommendations, the page view script must also be included in the page. View: https://github.com/coveo/coveo.analytics.js
 * This component listens when the main search interface generates a query and it generates another to get the recommendations at the same time.
 *
 * This component can be included in another SearchInterface, but you need to initialize the recommendation component with Coveo('initRecommendation'), before
 * the parent SearchInterface.
 */
export class Recommendation extends SearchInterface {
  static ID = 'Recommendation';
  private static NEXT_ID = 1;

  /**
   * The options for the recommendation component
   * @componentOptions
   */
  static options: IRecommendationOptions = {
    /**
     * Specifies the main {@link SearchInterface} to listen to.
     */
    mainSearchInterface: ComponentOptions.buildSelectorOption(),

    /**
     * Specifies the user context to send to Coveo analytics.
     * It will be sent with the query alongside the user history to get the recommendations.
     */
    userContext: ComponentOptions.buildJsonOption(),

    /**
     * Specifies the id of the inteface.
     * It is used by the analytics to know which recommendation interface was selected.
     * The default value is "Recommendation" for the first one and "Recommendation_{number}" where {number} depends on the number of recommendation interface with default ids in the page for the others. 
     */
    id: ComponentOptions.buildStringOption(),

    /**
     * Specifies which options from the main {@link QueryBuilder} to use in the triggered query.
     * Ex: <code data-options-to-use="expression, advancedExpression"></code> would add the expression and the advanced expression parts from the main query in the triggered query.
     * The default value is undefined.
     */
    optionsToUse: ComponentOptions.buildListOption(),

    /**
     * Specifies whether or not to send the actions history along with the triggered query.
     * Disabling this option means this component won't be able to get Reveal recommendations.
     * However, it could be useful to display side results in a search page.
     * The default value is true.
     */
    sendActionsHistory: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Hides the component if there a no results / recommendations.
     * The default value is false.
     */
    hideIfNoResults: ComponentOptions.buildBooleanOption({ defaultValue: true })

  };

  private mainInterfaceQuery: IQuerySuccessEventArgs;
  public mainQuerySearchUID: string;
  private displayStyle: string;

  constructor(public element: HTMLElement, public options: IRecommendationOptions = {}, public analyticsOptions = {}, _window = window) {
    super(element, ComponentOptions.initComponentOptions(element, Recommendation, options), analyticsOptions, _window);

    if (!this.options.id) {
      this.generateDefaultId();
    }

    if (this.options.mainSearchInterface) {
      this.bindToMainSearchInterface();
    }

    $$(this.element).on(QueryEvents.buildingQuery, (e: Event, args: IBuildingQueryEventArgs) => this.handleRecommendationBuildingQuery(args));
    $$(this.element).on(QueryEvents.querySuccess, (e: Event, args: IQuerySuccessEventArgs) => this.handleRecommendationQuerySuccess(args));

    // This is done to allow the component to be included in another search interface without triggering the parent events.
    this.preventEventPropagation();

  }

  public getId(): string {
    return this.options.id;
  }

  private bindToMainSearchInterface() {
    $$(this.options.mainSearchInterface).on(QueryEvents.querySuccess, (e: Event, args: IQuerySuccessEventArgs) => {
      this.mainInterfaceQuery = args;
      this.mainQuerySearchUID = args.results.searchUid;
      this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.recommendation, {});
      this.queryController.executeQuery();
    })
  }

  private handleRecommendationBuildingQuery(data: IBuildingQueryEventArgs) {
    this.modifyQueryForRecommendation(data);
    this.addRecommendationInfoInQuery(data);
  }

  private handleRecommendationQuerySuccess(data: IQuerySuccessEventArgs) {
    if (this.options.hideIfNoResults) {
      if (data.results.totalCount === 0) {
        this.displayStyle = this.element.style.display;
        $$(this.element).hide();
      } else {
        this.element.style.display = this.displayStyle;
      }
    }
  }

  private modifyQueryForRecommendation(data: IBuildingQueryEventArgs) {
    if (this.mainInterfaceQuery) {
      Utils.copyObjectAttributes(data.queryBuilder, this.mainInterfaceQuery.queryBuilder, this.options.optionsToUse);
    }
  }

  private addRecommendationInfoInQuery(data: IBuildingQueryEventArgs) {
    if (!_.isEmpty(this.options.userContext)) {
      data.queryBuilder.addContext(JSON.parse(this.options.userContext));
    }
    if (this.options.sendActionsHistory) {
      data.queryBuilder.actionsHistory = this.getHistory();
    }

    data.queryBuilder.recommendation = this.options.id;
  }

  private getHistory(): string {
    if (typeof coveoanalytics != 'undefined') {
      var store = new coveoanalytics.history.HistoryStore();
      return JSON.stringify(store.getHistory());
    } else {
      return '[]';
    }
  }

  private preventEventPropagation() {
    this.preventEventPropagationOn(QueryEvents);
    this.preventEventPropagationOn(OmniboxEvents);
    this.preventEventPropagationOn(ResultListEvents);
    this.preventEventPropagationOn(SettingsEvents);
    this.preventEventPropagationOn(PreferencesPanelEvents);
    this.preventEventPropagationOn(AnalyticsEvents);
    this.preventEventPropagationOn(BreadcrumbEvents);
    this.preventEventPropagationOn(QuickviewEvents);
    this.preventEventPropagationOn(this.getAllModelEvents());
  }

  private preventEventPropagationOn(eventType, eventName = (event: string) => { return event }) {
    for (let event in eventType) {
      $$(this.root).on(eventName(event), (e: Event) => { e.stopPropagation() });
    }
  }

  private getAllModelEvents() {
    let events = {};
    _.each(_.values(Model.eventTypes), (event) => {
      _.each(_.values(QUERY_STATE_ATTRIBUTES), (attribute) => {
        let eventName = this.getBindings().queryStateModel.getEventName(event + attribute);
        events[eventName] = eventName;
      })
    })
    return events;
  }

  private generateDefaultId() {
    let id = 'Recommendation';
    if (Recommendation.NEXT_ID !== 1) {
      this.logger.warn('Generating another recommendation default id', 'Consider configuring a human friendly / meaningful id for this interface')
      id = id + '_' + Recommendation.NEXT_ID;
    }
    Recommendation.NEXT_ID++;
    this.options.id = id;
  }

}
// We do not register the Recommendation component since it is done with .coveo('initRecommendation')
