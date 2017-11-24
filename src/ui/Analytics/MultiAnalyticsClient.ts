import { IAnalyticsClient } from './AnalyticsClient';
import { PendingSearchEvent } from './PendingSearchEvent';
import { IAnalyticsActionCause } from './AnalyticsActionListMeta';
import { IQueryResult } from '../../rest/QueryResult';
import { ITopQueries } from '../../rest/TopQueries';
import { IAPIAnalyticsEventResponse } from '../../rest/APIAnalyticsEventResponse';
import * as _ from 'underscore';

export class MultiAnalyticsClient implements IAnalyticsClient {
  public isContextual = false;

  constructor(private analyticsClients: IAnalyticsClient[] = []) {}

  public isActivated(): boolean {
    return _.some(this.analyticsClients, (analyticsClient: IAnalyticsClient) => analyticsClient.isActivated());
  }

  public getCurrentEventCause(): string {
    return _.find(
      _.map(this.analyticsClients, (analyticsClient: IAnalyticsClient) => analyticsClient.getCurrentEventCause()),
      (currentEventCause: string) => currentEventCause != null
    );
  }

  public getCurrentEventMeta(): { [key: string]: any } {
    return _.find(
      _.map(this.analyticsClients, (analyticsClient: IAnalyticsClient) => analyticsClient.getCurrentEventMeta()),
      (currentEventMeta: { [key: string]: any }) => currentEventMeta != null
    );
  }

  public logSearchEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta) {
    _.each(this.analyticsClients, (analyticsClient: IAnalyticsClient) => analyticsClient.logSearchEvent<TMeta>(actionCause, meta));
  }

  public logSearchAsYouType<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta) {
    _.each(this.analyticsClients, (analyticsClient: IAnalyticsClient) => analyticsClient.logSearchEvent<TMeta>(actionCause, meta));
  }

  public logClickEvent<TMeta>(
    actionCause: IAnalyticsActionCause,
    meta: TMeta,
    result: IQueryResult,
    element: HTMLElement
  ): Promise<IAPIAnalyticsEventResponse> {
    return Promise.all(
      _.map(this.analyticsClients, (analyticsClient: IAnalyticsClient) => {
        return analyticsClient.logClickEvent(actionCause, meta, result, element);
      })
    ).then(responses => _.first(responses));
  }

  public logCustomEvent<TMeta>(
    actionCause: IAnalyticsActionCause,
    meta?: TMeta,
    element?: HTMLElement
  ): Promise<IAPIAnalyticsEventResponse> {
    return Promise.all(
      _.map(this.analyticsClients, (analyticsClient: IAnalyticsClient) => {
        return analyticsClient.logCustomEvent<TMeta>(actionCause, meta, element);
      })
    ).then(responses => _.first(responses));
  }

  public getTopQueries(params: ITopQueries): Promise<string[]> {
    return Promise.all(
      _.map(this.analyticsClients, client => {
        return client.getTopQueries(params);
      })
    ).then((values: string[][]) => {
      return this.mergeTopQueries(values, params.pageSize);
    });
  }

  public getCurrentVisitIdPromise(): Promise<string> {
    return _.first(this.analyticsClients).getCurrentVisitIdPromise();
  }

  public getCurrentVisitId(): string {
    return _.first(this.analyticsClients).getCurrentVisitId();
  }

  public sendAllPendingEvents(): void {
    _.each(this.analyticsClients, (analyticsClient: IAnalyticsClient) => analyticsClient.sendAllPendingEvents());
  }

  public warnAboutSearchEvent(): void {
    _.each(this.analyticsClients, (analyticsClient: IAnalyticsClient) => analyticsClient.warnAboutSearchEvent());
  }

  public cancelAllPendingEvents(): void {
    _.each(this.analyticsClients, (analyticsClient: IAnalyticsClient) => analyticsClient.cancelAllPendingEvents());
  }

  public getPendingSearchEvent(): PendingSearchEvent {
    return _.first(this.analyticsClients).getPendingSearchEvent();
  }

  public setOriginContext(originContext: string) {
    _.each(this.analyticsClients, (analyticsClient: IAnalyticsClient) => analyticsClient.setOriginContext(originContext));
  }

  private mergeTopQueries(values: string[][], pageSize: number = 5) {
    return _.chain(values)
      .flatten()
      .first(pageSize)
      .value();
  }
}
