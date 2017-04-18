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
   * Note that the search event is only sent to the service when the query successfully returns, not immediately after
   * calling this method. Therefore, it is important to call this method before executing the query. Otherwise the
   * service will log no Search event and you will get a warning message in the console.
   *
   * See [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause Describes the cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
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
   * triggers a search event. This avoids logging every single partial query, which would make the reporting very
   * confusing.
   *
   * It is important to call this method before executing the query. Otherwise the service will log no SearchAsYouType
   * event and you will get a warning message in the console.
   *
   * See [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause Describes the cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
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
   * API automatically converts uppercase characters to lowercase characters in key names. Each value must be a simple
   * string. You do not have to pass an {@link IAnalyticsDocumentViewMeta} as meta when logging a custom Click event.
   * You can actually send any arbitrary meta. If you do not need to log metadata, you can simply pass an empty JSON
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
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
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

  /**
   * Sets the Origin Context dimension on the analytic events.
   *
   * You can use this dimension to specify the context of your application.
   * Suggested values are "Search", "InternalSearch" and "CommunitySearch"
   *
   * Default value is `Search`.
   *
   * @param originContext The origin context value
   */
  setOriginContext(originContext: string);
}
