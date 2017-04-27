import {IAnalyticsClient} from './AnalyticsClient';
import {IAnalyticsActionCause} from './AnalyticsActionListMeta';
import {IQueryResult} from '../../rest/QueryResult';
import {ITopQueries} from '../../rest/TopQueries';
import {Promise} from 'es6-promise';

export class NoopAnalyticsClient implements IAnalyticsClient {
  public isContextual: boolean = false;

  isActivated() {
    return false;
  }

  getCurrentEventCause(): string {
    return null;
  }

  getCurrentEventMeta(): { [key: string]: any } {
    return {};
  }

  logSearchEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta) {
  }

  logSearchAsYouType<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta) {
  }

  logClickEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta, result?: IQueryResult, element?: HTMLElement) {
  }

  logCustomEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta, element?: HTMLElement) {
  }

  getTopQueries(params: ITopQueries): Promise<string[]> {
    return new Promise((resolve, reject) => {
      resolve([]);
    })
  }

  getCurrentVisitIdPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(null);
    })
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
}
