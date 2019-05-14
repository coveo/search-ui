import { IAPIDocumentViewEvent } from '../rest/APIDocumentViewEvent';
import { IAPISearchEvent } from '../rest/APISearchEvent';
import { IAPICustomEvent } from '../rest/APICustomEvent';

export interface IAnalyticsSearchEventsArgs {
  searchEvents: IAPISearchEvent[];
}

/**
 * The `IAnalyticsDocumentViewEventArgs` interface describes the object that all
 * [`documentViewEvent`]{@link AnalyticsEvents.documentViewEvent} handlers receive as an argument.
 */
export interface IAnalyticsDocumentViewEventArgs {
  /**
   * The data to send in the request body of the Usage Analytics Write REST API call that logs the `click` event.
   */
  documentViewEvent: IAPIDocumentViewEvent;
}

export interface IAnalyticsCustomEventArgs {
  customEvent: IAPICustomEvent;
}

/**
 * The `IChangeAnalyticsCustomDataEventArgs` interface describes the object that all
 * [`changeAnalyticsCustomData`]{@link AnalyticsEvents.changeAnalyticsCustomData} event handlers receive as an argument.
 *
 * This interface extends the [`IChangeableAnalyticsDataObject`]{@link IChangeableAnalyticsDataObject} interface.
 *
 * **Notes:**
 * > * External code can only modify the attributes described by the `IChangeableAnalyticsDataObject` interface.
 * > * When the analytics event being logged is a `ClickEvent`, the `ChangeAnalyticsCustomDataEventArgs` object also
 * > contains a `resultData` attribute, which describes the [`QueryResult`]{@link IQueryResult} that was clicked.
 * > External code **cannot** modify this object.
 */
export interface IChangeAnalyticsCustomDataEventArgs extends IChangeableAnalyticsDataObject {
  /**
   * The type of the usage analytics event.
   *
   * **Note:**
   * > External code **cannot** modify the value of this attribute.
   */
  type: 'SearchEvent' | 'CustomEvent' | 'ClickEvent';

  /**
   * The generic action type of the usage analytics event.
   *
   * All analytics events that strongly relate to a certain feature or component usually share the same `actionType`.
   *
   * For instance, all usage analytics events relating to the [`Facet`]{@link Facet} component have `facet` as their
   * `actionType`, whereas all usage analytics events relating to the [`Breadcrumb`]{@link Breadcrumb} component have
   * `breadcrumb` as their `actionType`.
   *
   * **Note:**
   * > External code **cannot** modify the value of this attribute.
   */
  actionType: string;

  /**
   * The cause of the usage analytics event.
   *
   * For instance, triggering a query using the search box logs a usage analytics event with `searchBoxSubmit` as its
   * `actionCause`, whereas triggering a query by selecting a facet value logs a usage analytics event with
   * `facetSelect` as its `actionCause`.
   *
   * **Note:**
   * > External code **cannot** modify the value of this attribute.
   */
  actionCause: string;
}

/**
 * The `IChangeableAnalyticsMetaObject` interface describes the metadata which can be sent along with any usage
 * analytics event.
 */
export interface IChangeableAnalyticsMetaObject {
  /**
   * A metadata key-value pair to send along with the usage analytics event.
   *
   * **Notes:**
   * > * A metadata key must contain only alphanumeric characters and underscores (the Coveo Usage Analytics REST
   * > service automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
   * > names).
   * > * A metadata value must be a simple string (no other type is allowed).
   */
  [name: string]: string;
}

/**
 * The `IChangeableAnalyticsDataObject` interface describes the modifiable part of the object that all
 * [`changeAnalyticsCustomData`]{@link AnalyticsEvents.changeAnalyticsCustomData} event handlers receive as an argument.
 */
export interface IChangeableAnalyticsDataObject {
  /**
   * The metadata to send along with the usage analytics event.
   *
   * **Note:**
   * > External code **can** modify existing values, or add new key-value pairs in this attribute.
   */
  metaObject: IChangeableAnalyticsMetaObject;

  /**
   * The high-level origin of the usage analytics event.
   *
   * For instance, this could be the name of the search hub, or a name that can uniquely identify the search page from
   * which the usage analytics event originates.
   *
   * Default value is `default`.
   *
   * **Note:**
   * > External code **can** modify the value of this attribute.
   */
  originLevel1: string;

  /**
   * The mid-level origin of the usage analytics event.
   *
   * By default, the framework populates this attribute with the `data-id` of the currently selected tab in the search
   * interface from which the usage analytics event originates.
   *
   * **Note:**
   * > External code **can** modify the value of this attribute.
   */
  originLevel2: string;

  /**
   * The low-level origin of the usage analytics event.
   *
   * For instance, this could be the HTTP identifier of the page from which the usage analytics event originates.
   *
   * Default value is the empty string.
   *
   * **Note:**
   * > External code **can** modify the value of this attribute.
   */
  originLevel3: string;

  /**
   * The language of the search interface from which the usage analytics event originates.
   *
   * By default, the framework populates this attribute with the currently loaded localization and culture file of the
   * search interface from which the usage analytics event originates.
   *
   * **Note:**
   * > External code **can** modify the value of this attribute.
   */
  language: string;
}

/**
 * The `AnalyticsEvents` static class contains the string definitions of all events that strongly relate to usage
 * analytics.
 *
 * See [Events](https://developers.coveo.com/x/bYGfAQ).
 */
export class AnalyticsEvents {
  public static searchEvent = 'analyticsSearchEvent';

  /**
   * Triggered when a `click` analytics event is logged (e.g., when the end user clicks a
   * [`ResultLink`]{@link ResultLink} or [`Quickview`]{@link Quickview} to open a query result item).
   *
   * All `documentViewEvent` event handlers receive an
   * [`AnalyticsDocumentViewEventArgs`]{@link IAnalyticsDocumentViewEventArgs} object as an argument.
   *
   * @type {string} The string value is `documentViewEvent`.
   */
  public static documentViewEvent = 'analyticsDocumentViewEvent';
  public static customEvent = 'analyticsCustomEvent';

  /**
   * Triggered whenever an analytics event is about to be logged.
   *
   * This event allows external code to modify the analytics data before it is sent to the Coveo Usage Analytics REST
   * service.
   *
   * All `changeAnalyticsCustomData` event handlers receive a
   * [`ChangeAnalyticsCustomDataEventArgs`]{@link IChangeAnalyticsCustomDataEventArgs} object as an argument.
   *
   * @type {string} The string value is `changeAnalyticsCustomData`.
   */
  public static changeAnalyticsCustomData = 'changeAnalyticsCustomData';
}
