import { LiveAnalyticsClient } from './LiveAnalyticsClient';
import { IAnalyticsActionCause, analyticsActionCauseList } from './AnalyticsActionListMeta';
import { IQueryResult } from '../../rest/QueryResult';
import { AnalyticsEndpoint } from '../../rest/AnalyticsEndpoint';
import { IAPIAnalyticsEventResponse } from '../../rest/APIAnalyticsEventResponse';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Recommendation } from '../Recommendation/Recommendation';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import * as _ from 'underscore';
export class RecommendationAnalyticsClient extends LiveAnalyticsClient {
  private recommendation: Recommendation;

  constructor(
    public endpoint: AnalyticsEndpoint,
    public rootElement: HTMLElement,
    public userId: string,
    public userDisplayName: string,
    public anonymous: boolean,
    public splitTestRunName: string,
    public splitTestRunVersion: string,
    public originLevel1: string,
    public sendToCloud: boolean,
    public bindings: IComponentBindings
  ) {
    super(endpoint, rootElement, userId, userDisplayName, anonymous, splitTestRunName, splitTestRunVersion, originLevel1, sendToCloud);
    this.recommendation = <Recommendation>this.bindings.searchInterface;
  }

  public logSearchEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta) {
    if (actionCause == analyticsActionCauseList.interfaceLoad) {
      actionCause = analyticsActionCauseList.recommendationInterfaceLoad;
    }
    super.logSearchEvent(actionCause, meta);
  }

  public logClickEvent<TMeta>(
    actionCause: IAnalyticsActionCause,
    meta: TMeta,
    result: IQueryResult,
    element: HTMLElement
  ): Promise<IAPIAnalyticsEventResponse> {
    if (actionCause == analyticsActionCauseList.documentOpen) {
      actionCause = analyticsActionCauseList.recommendationOpen;
    }

    const promises = [super.logClickEvent(actionCause, meta, result, element)];

    if (this.recommendation.mainQuerySearchUID && this.recommendation.mainQueryPipeline != null) {
      // We log a second click associated with the main interface query to tell the analytics that the query was a success.
      let mainInterface = <SearchInterface>Component.get(this.recommendation.options.mainSearchInterface, SearchInterface);
      result.queryUid = this.recommendation.mainQuerySearchUID;
      result.pipeline = this.recommendation.mainQueryPipeline;
      promises.push(mainInterface.usageAnalytics.logClickEvent(actionCause, meta, result, element));
    }
    return Promise.all(promises).then(responses => _.first(responses));
  }

  protected getOriginLevel2(element: HTMLElement): string {
    return this.recommendation.getId();
  }
}
