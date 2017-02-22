import { IAPIDocumentViewEvent } from '../rest/APIDocumentViewEvent';
import { IAPISearchEvent } from '../rest/APISearchEvent';
import { IAPICustomEvent } from '../rest/APICustomEvent';

export interface IAnalyticsSearchEventsArgs {
  searchEvents: IAPISearchEvent[];
}

export interface IAnalyticsDocumentViewEventArgs {
  documentViewEvent: IAPIDocumentViewEvent;
}

export interface IAnalyticsCustomEventArgs {
  customEvent: IAPICustomEvent;
}

/**
 * Argument sent to all handlers bound on {@link AnalyticsEvents.changeAnalyticsCustomData}.
 *
 * It extends the {@link IChangeableAnalyticsDataObject} interface.
 *
 * Take note that only the attributes described by {@link IChangeableAnalyticsDataObject} can be modified by external code.
 */
export interface IChangeAnalyticsCustomDataEventArgs extends IChangeableAnalyticsDataObject {
  /**
   * The type of the event that was just triggered.
   *
   * This can help external code to discriminate the event that it wishes to modify.
   */
  type: 'SearchEvent' | 'CustomEvent' | 'ClickEvent';
  /**
   * The type of the event.
   *
   * The type is normally a generic string that regroups all events triggered by the same feature or component.
   *
   * For example, all analytics events related to the Searchbox will all use the same actionType.
   *
   * Analytics events related to Facets, on the other hand, would use a different actionType.
   */
  actionType: string;
  /**
   * The cause of the event.
   *
   * All analytics events triggered by a different component will use a different action cause.
   *
   * For example, triggering a query by using the search box will send a `searchBoxSubmit` actionCause.
   *
   * Triggering a query with a facet selection, on the other hand, will send a `facetSelect`.
   */
  actionCause: string;
}

/**
 * The interface that describe the metadata for every analytics event.
 */
export interface IChangeableAnalyticsMetaObject {
  /**
   * The metadata for every analytics event is a simple key value pair, where the value has to be a simple string.
   *
   * The value cannot be a complex object.
   */
  [name: string]: string;
}

/**
 * The interface that describe part of the analytics event that can be modified.
 */
export interface IChangeableAnalyticsDataObject {
  /**
   * The metadata for the current event.
   *
   * External code can modify an existing value, or add a new key - value pair.
   */
  metaObject: IChangeableAnalyticsMetaObject;
  /**
   * The originLevel1 property can be used to describe the high level origin of the event.
   *
   * For example, this can be the location of the search page, or any name that allows you to uniquely identify a search interface.
   *
   * If not provided, this value will be `default`.
   */
  originLevel1: string;
  /**
   * The originLevel2 property can be used to describe the mid level origin of the event.
   *
   * By default, the framework will populate this with the currently selected tab.
   */
  originLevel2: string;
  /**
   * The originLevel3 property can be used to describe the low level origin of the event.
   *
   * By default, this property will be left empty.
   */
  originLevel3: string;
  /**
   * The language of the search interface.
   *
   * By default, this will be populated by the currently loaded localization and culture file for the search interface.
   */
  language: string;
}

/**
 * This static class is there to contains the different string definition for all the events related to analytics.
 */
export class AnalyticsEvents {
  public static searchEvent = 'analyticsSearchEvent';
  public static documentViewEvent = 'analyticsDocumentViewEvent';
  public static customEvent = 'analyticsCustomEvent';
  /**
   * Triggered whenever an analytics event is logged. This event allows external code to modify the analytics data.
   *
   * All bound handlers will receive {@link IChangeAnalyticsCustomDataEventArgs} as an argument.
   *
   * The string value is `changeAnalyticsCustomData`.
   */
  public static changeAnalyticsCustomData = 'changeAnalyticsCustomData';
}
