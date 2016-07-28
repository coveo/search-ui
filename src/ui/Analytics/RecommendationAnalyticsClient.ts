import {LiveAnalyticsClient} from './LiveAnalyticsClient';
import {IAnalyticsActionCause, analyticsActionCauseList} from './AnalyticsActionListMeta';
import {IQueryResult} from '../../rest/QueryResult';
import {AnalyticsEndpoint} from '../../rest/AnalyticsEndpoint';
import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Recommendation} from '../Recommendation/Recommendation';
import {SearchInterface} from '../SearchInterface/SearchInterface';

export class RecommendationAnalyticsClient extends LiveAnalyticsClient {

  private recommendation: Recommendation;

  constructor(public endpoint: AnalyticsEndpoint,
    public rootElement: HTMLElement,
    public userId: string,
    public userDisplayName: string,
    public anonymous: boolean,
    public splitTestRunName: string,
    public splitTestRunVersion: string,
    public originLevel1: string,
    public sendToCloud: boolean,
    public bindings: IComponentBindings) {
    super(endpoint, rootElement, userId, userDisplayName, anonymous, splitTestRunName, splitTestRunVersion, originLevel1, sendToCloud);
    this.recommendation = <Recommendation>this.bindings.searchInterface;
  }

  public logSearchEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta) {
    if (actionCause == analyticsActionCauseList.interfaceLoad) {
      actionCause = analyticsActionCauseList.recommendationInterfaceLoad;
    }
    super.logSearchEvent(actionCause, meta);
  }

  public logClickEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta, result: IQueryResult, element: HTMLElement) {
    if (actionCause == analyticsActionCauseList.documentOpen) {
      actionCause = analyticsActionCauseList.recommendationOpen;
    }

    super.logClickEvent(actionCause, meta, result, element);

    if (this.recommendation.mainQuerySearchUID) {
      // We log a second click associated with the main interface query to tell the analytics that the query was a success.
      let mainInterface = <SearchInterface>Component.get(this.recommendation.options.mainSearchInterface, SearchInterface);
      result.queryUid = this.recommendation.mainQuerySearchUID;
      mainInterface.usageAnalytics.logClickEvent(actionCause, meta, result, element);
    }
  }

  protected getOriginLevel2(element: HTMLElement): string {
    return this.recommendation.getId();
  }
}
