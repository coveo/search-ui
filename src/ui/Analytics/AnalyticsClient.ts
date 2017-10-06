import { IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { IAPIAnalyticsEventResponse } from '../../rest/APIAnalyticsEventResponse';
import { IQueryResult } from '../../rest/QueryResult';
import { ITopQueries } from '../../rest/TopQueries';
import { PendingSearchEvent } from './PendingSearchEvent';

/**
 * The `IAnalyticsClient` interface describes an analytics client that can log events to, or return information from the
 * usage analytics service.
 *
 * See also the [`Analytics`]{@link Analytics} component.
 */
export interface IAnalyticsClient {
  isContextual: boolean;

  /**
   * Indicates whether there is an [`Analytics`]{@link Analytics} component in the search page. Returns `true` if an
   * `Analytics` component is present, and `false` otherwise.
   */
  isActivated(): boolean;
  getCurrentEventCause(): string;
  getCurrentEventMeta(): { [key: string]: any };

  /**
   * Logs a `Search` usage analytics event.
   *
   * A `Search` event is actually sent to the Coveo Usage Analytics service only after the query successfully returns
   * (not immediately after calling this method). Therefore, it is important to call this method **before** executing
   * the query. Otherwise, the `Search` event will not be logged, and you will get a warning message in the console.
   *
   * **Note:**
   *
   * > When logging custom `Search` events, you should use the `Coveo.logSearchEvent` top-level function rather than
   * > calling this method directly from the analytics client. See
   * > [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause The cause of the event.
   * @param meta The metadata you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * service automatically converts white spaces to underscores, and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   */
  logSearchEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta): void;

  /**
   * Logs a `SearchAsYouType` usage analytics event.
   *
   * This method is very similar to the [`logSearchEvent`]{@link AnalyticsClient.logSearchEvent} method, except that
   * `logSearchAsYouType` should, by definition, be called more frequently. Consequently, in order to avoid logging
   * every single partial query, the `PendingSearchAsYouTypeEvent` takes care of logging only the "relevant" last event:
   * an event that occurs after 5 seconds have elapsed without any event being logged, or an event that occurs after
   * another part of the interface triggers a search event.
   *
   * It is important to call this method **before** executing the query. Otherwise, no `SearchAsYouType` event will be
   * logged, and you will get a warning message in the console.
   *
   * **Note:**
   *
   * > When logging custom `SearchAsYouType` events, you should use the `Coveo.logSearchAsYouTypeEvent` top-level
   * > function rather than calling this method directly from the analytics client. See
   * > [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause The cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * service automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   */
  logSearchAsYouType<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta): void;

  /**
   * Logs a `Click` usage analytics event.
   *
   * A `Click` event corresponds to an item view (e.g., clicking on a {@link ResultLink} or opening a
   * {@link Quickview}).
   *
   * `Click` events are immediately sent to the Coveo Usage Analytics service.
   *
   * **Note:**
   * > When logging custom `Click` events, you should use the `Coveo.logClickEvent` top-level function rather than
   * > calling this method directly from the analytics client. See
   * > [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause The cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * service automatically converts uppercase characters to lowercase characters in key names. Each value must be a simple
   * string. You do not have to pass an {@link IAnalyticsDocumentViewMeta} as meta when logging a `Click` event. You can
   * actually send any arbitrary meta. If you do not need to log metadata, you can simply pass an empty JSON ( `{}` ).
   * @param result The result that was clicked.
   * @param element The HTMLElement that the user has clicked in the interface. Default value is the element on which
   * the `Analytics` component is bound.
   */
  logClickEvent<TMeta>(
    actionCause: IAnalyticsActionCause,
    meta: TMeta,
    result: IQueryResult,
    element: HTMLElement
  ): Promise<IAPIAnalyticsEventResponse>;

  /**
   * Logs a `Custom` usage analytics event on the service.
   *
   * You can use `Custom` events to create custom reports, or to track events which are neither queries (see
   * [`logSearchEvent`]{@link AnalyticsClient.logSearchEvent} and
   * [`logSearchAsYouType`]{@link AnalyticsClient.logSearchAsYouType}), nor item views (see
   * [`logClickEvent`]{@link AnalyticsClient.logClickEvent}).
   *
   * **Note:**
   * > When logging `Custom` events, you should use the `Coveo.logClickEvent` top-level function rather than calling
   * > this method directly from the analytics client. See
   * > [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
   *
   * @param actionCause The cause of the event.
   * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
   * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
   * service automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
   * ( `{}` ).
   * @param element The HTMLElement that the user has interacted with for this custom event. Default value is the
   * element on which the `Analytics` component is bound.
   */
  logCustomEvent<TMeta>(actionCause: IAnalyticsActionCause, meta: TMeta, element: HTMLElement): Promise<IAPIAnalyticsEventResponse>;

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
   *
   * Suggested values are `Search`, `InternalSearch`, or `CommunitySearch`.
   *
   * Default value is `Search`.
   *
   * @param originContext The origin context value.
   */
  setOriginContext(originContext: string);
}
