import { ISubscription } from '../rest/Subscription';

export interface ISearchAlertsEventArgs {
  subscription: ISubscription;
  dom?: HTMLElement;
}

export interface ISearchAlertsFailEventArgs {
  dom?: HTMLElement;
}

export interface ISearchAlertsPopulateMessageEventArgs {
  text: Array<string | ISearchAlertsPopulateMessageText>;
}

export interface ISearchAlertsPopulateMessageText {
  lineThrough: boolean;
  value: string;
}

export class SearchAlertsEvents {
  public static searchAlertsCreated = 'searchAlertsCreated';
  public static searchAlertsDeleted = 'searchAlertsDeleted';
  public static searchAlertsFail = 'searchAlertsFail';
  public static searchAlertsPopulateMessage = 'searchAlertsPopulateMessage';
}
