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
}
