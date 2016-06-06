import {IAPIDocumentViewEvent} from '../rest/APIDocumentViewEvent';
import {IAPISearchEvent} from '../rest/APISearchEvent';
import {IAPICustomEvent} from '../rest/APICustomEvent';

export interface IAnalyticsSearchEventsArgs {
  searchEvents: IAPISearchEvent[];
}

export interface IAnalyticsDocumentViewEventArgs {
  documentViewEvent: IAPIDocumentViewEvent;
}

export interface IAnalyticsCustomEventArgs {
  customEvent: IAPICustomEvent;
}

export interface IChangeAnalyticsCustomDataEventArgs extends IChangeableAnalyticsDataObject {
  type: string;
  metaObject: IChangeableAnalyticsMetaObject;
  actionType: string;
  actionCause: string;
}

export interface IChangeableAnalyticsMetaObject {
  [name: string]: string;
}

export interface IChangeableAnalyticsDataObject {
  originLevel1: string;
  originLevel2: string;
  originLevel3: string;
  language: string;
}

export class AnalyticsEvents {
  public static searchEvent = 'analyticsSearchEvent';
  public static documentViewEvent = 'analyticsDocumentViewEvent';
  public static customEvent = 'analyticsCustomEvent';
  public static changeAnalyticsCustomData = 'changeAnalyticsCustomData';
}
