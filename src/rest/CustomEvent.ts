import { IAnalyticsEvent } from './AnalyticsEvent';

/**
 * Describes a Coveo Cloud usage analytics _custom_ event.
 */
export interface ICustomEvent extends IAnalyticsEvent {
  /**
   * A name describing the category of actions to which the action that triggered the event belongs.
   *
   * **Note:** Normally, this field is set to the same value as [`actionType`]{@link IAnalyticsEvent.actionType}.
   *
   * **Example:** `getMoreResults`
   */
  eventType: string;
  /**
   * A unique name describing the action that triggered the event.
   *
   * **Note:** Normally, this field is set to the same value as [`actionCause`]{@link IAnalyticsEvent.actionCause}.
   *
   * **Example:** `pagerNext`
   */
  eventValue: string;

  /**
   * The searchQueryUid of the last search event that occurred before this event.
   *
   * **Example:** `74682726-0e20-46eb-85ac-f37259346f57`
   */
  lastSearchQueryUid: string;
}
