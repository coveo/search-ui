import { IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { IQueryResult } from '../../rest/QueryResult';
import { ITopQueries } from '../../rest/TopQueries';
import { Promise } from 'es6-promise';
import { PendingSearchEvent } from './PendingSearchEvent';

/**
 * The IAnalyticsClient interface describes an analytics client that can log events to, or return information from the
 * usage analytics service.
 *
 * See also the {@link Analytics} component.
 */
export interface IAnalyticsClient {
  isContextual: boolean;

  /**
   * Indicates whether there is an {@link Analytics} component in your page. Returns `true` if an Analytics component
   * is present and `false` otherwise.
   */
  isActivated(): boolean;
  getCurrentEventCause(): string;
  getCurrentEventMeta(): { [key: string]: any };

  /**
   * Logs a Search event on the service, using an [AnalyticsActionCause]({@link IAnalyticsActionCause}) and a meta
   * object.
   *
   * Note that the search event is sent to the service when a query successfully returns, not immediately after calling
   * this method.
   *
   * Normally, you should call this method using the following "format":
   *
   * ```
   * usageAnalytics.logSearchEvent<SomeMeta>({name: 'foo', type: 'bar'}, <SomeMeta>{'key':'value'});
   * this.queryController.executeQuery();
   * ```
   *
   * This queues up an analytics search event. Then, the query executes itself. The search event is sent to the service
   * when the query successfully returns.
   *
   * @param actionCause Describes the cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each values must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   */
  logSearchEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta): void;

  /**
   * Logs a SearchAsYouType event on the service, using an {@link IAnalyticsActionCause} and a meta object.
   *
   * This method is very similar to the {@link logSearchEvent} method, except that logSearchAsYouType is, by definition,
   * more frequently called.
   *
   * The `PendingSearchAsYouTypeEvent` takes care of logging only the "relevant" last event: an event that occurs after
   * 5 seconds elapse without any event being logged, or an event that occurs after another part of the interface
   * triggers a search event.
   *
   * This avoids logging every single partial query, which would make the reporting very confusing.
   *
   * @param actionCause Describes the cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each values must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   */
  logSearchAsYouType<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta): void;

  /**
   * Logs a Click event. You can understand click events as document views (e.g., clicking on a {@link ResultLink} or
   * opening a {@link Quickview}).
   *
   * This event is logged immediately on the service.
   *
   * @param actionCause Describes the cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each values must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   * @param result The result that the user has clicked.
   * @param element The HTMLElement that the user has clicked in the interface.
   */
  logClickEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta, result: IQueryResult, element: HTMLElement): void;

  /**
   * Logs a Custom event on the service. You can use custom events to create custom reports, or to track events
   * that are not queries or document views.
   *
   * @param actionCause Describes the cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each values must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   * @param element The HTMLElement that the user has interacted with for this custom event.
   */
  logCustomEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta, element: HTMLElement): void;

  /**
   * Gets suggested queries from the Coveo Usage Analytics service.
   * @param params
   */
  getTopQueries(params: ITopQueries): Promise<string[]>;
  getCurrentVisitId(): string;

  /**
   * Gets the current visitor ID for tracking purpose in the Coveo Usage Analytics service.
   */
  getCurrentVisitIdPromise(): Promise<string>;
  cancelAllPendingEvents(): void;
  getPendingSearchEvent(): PendingSearchEvent;
  sendAllPendingEvents(): void;
  warnAboutSearchEvent(): void;
}
