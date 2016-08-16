import {IAnalyticsActionCause} from '../Analytics/AnalyticsActionListMeta';
import {IQueryResult} from '../../rest/QueryResult';
import {ITopQueries} from '../../rest/TopQueries';
import {Promise} from 'es6-promise';
import {PendingSearchEvent} from './PendingSearchEvent';

/**
 * Describe an analytics client, that can log events or return information from the service
 */
export interface IAnalyticsClient {
  isContextual: boolean;
  /**
   * Return false if there is no {@link Analytics} component in your page.
   */
  isActivated(): boolean;
  getCurrentEventCause(): string;
  getCurrentEventMeta(): { [key: string]: any };
  /**
   * Log a search event on the service, using a cause and a meta object.<br/>
   * Note that the event will be sent on the service when a query successfully return, not immediately after calling this method.<br/>
   * Normally, this should be called using the following "format" : <br/>
   * this.usageAnalytics.logSearchEvent<SomeMeta>({name : 'foo', type : 'bar'}, <SomeMeta>{'key':'value'});<br/>
   * this.queryController.executeQuery();<br/>
   * This will queue up an analytics search event. Then the query is executed. The search event will be sent to the service when the query successfully complete.<br/>
   * @param actionCause
   * @param meta Can be an empty object ( {} )
   */
  logSearchEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta): void;
  /**
   * Log a search as you type event on the service, using a cause and a meta object.<br/>
   * This is extremely similar to a search event, except that search as you type, by definition, will be frequently called.<br/>
   * The {@link PendingSearchAsYouTypeEvent} will take care of logging only the "relevant" last event : After 5 seconds of no event logged, or after another search event is triggered somewhere else in the interface.<br/>
   * This is to ensure that we do not needlessly log every single partial query, which would make the reporting very confusing.
   * @param actionCause
   * @param meta Can be an empty object ( {} )
   */
  logSearchAsYouType<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta): void;
  /**
   * Log a click event. A click event can be understood as a document view.<br/>
   * eg : Clicking on a result link of opening a quickview.<br/>
   * This event will be logged immediately on the service.
   * @param actionCause
   * @param meta Can be an empty object ( {} )
   * @param result The result that was clicked
   * @param element The HTMLElement that was clicked in the interface
   */
  logClickEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta, result: IQueryResult, element: HTMLElement): void;
  /**
   * Log a custom event on the service. A custom event can be used to create customized report, or to track events which are not queries or document view.
   * @param actionCause
   * @param meta
   * @param element The HTMLElement that was interacted with for this custom event.
   */
  logCustomEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta, element: HTMLElement): void;
  /**
   * Get suggested queries from the Coveo analytics service.
   * @param params
   */
  getTopQueries(params: ITopQueries): Promise<string[]>;
  getCurrentVisitId(): string;
  /**
   * Get the current visitor id, for tracking purpose in the Coveo Analytics service
   */
  getCurrentVisitIdPromise(): Promise<string>;
  cancelAllPendingEvents(): void;
  getPendingSearchEvent(): PendingSearchEvent;
  sendAllPendingEvents(): void;
  warnAboutSearchEvent(): void;
}
