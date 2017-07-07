import { IAnalyticsClient } from './AnalyticsClient';
import { IAnalyticsActionCause } from './AnalyticsActionListMeta';
import { IQueryResult } from '../../rest/QueryResult';
import { ITopQueries } from '../../rest/TopQueries';
import { IStringMap } from '../../rest/GenericParam';

export class NoopAnalyticsClient implements IAnalyticsClient {
  public isContextual: boolean = false;

  private currentEventCause: string;
  private currentEventMeta: IStringMap<any>;

  isActivated() {
    return false;
  }

  getCurrentEventCause(): string {
    return this.currentEventCause;
  }

  getCurrentEventMeta(): IStringMap<any> {
    return this.currentEventMeta;
  }

  logSearchEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta) {
    this.setNoopCauseAndMeta(actionCause.name, meta);
  }

  logSearchAsYouType<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta) {
    this.setNoopCauseAndMeta(actionCause.name, meta);
  }

  logClickEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta, result?: IQueryResult, element?: HTMLElement): Promise<any> {
    return new Promise((resolve, reject) => {
      this.setNoopCauseAndMeta(actionCause.name, meta);
      resolve(null);
    });
  }

  logCustomEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta, element?: HTMLElement): Promise<any> {
    return new Promise((resolve, reject) => {
      this.setNoopCauseAndMeta(actionCause.name, meta);
      resolve(null);
    });
  }

  getTopQueries(params: ITopQueries): Promise<string[]> {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }

  getCurrentVisitIdPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }

  getCurrentVisitId(): string {
    return null;
  }

  sendAllPendingEvents() {
  }

  cancelAllPendingEvents() {
  }

  warnAboutSearchEvent() {
  }

  getPendingSearchEvent() {
    return null;
  }

  setOriginContext(originContext: string) {
  }

  private setNoopCauseAndMeta(cause: string, meta: IStringMap<any>) {
    this.currentEventCause = cause;
    this.currentEventMeta = meta;
  }
}
