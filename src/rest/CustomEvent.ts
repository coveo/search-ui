import { IAnalyticsEvent } from './AnalyticsEvent';

export interface ICustomEvent extends IAnalyticsEvent {
  eventType: string;
  eventValue: string;
}
