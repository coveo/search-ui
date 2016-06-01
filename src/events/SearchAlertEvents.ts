import {ISubscription} from '../rest/Subscription';

export interface ISearchAlertsEventArgs {
  subscription: ISubscription;
  dom?: HTMLElement;
}

export interface ISearchAlertsFailEventArgs {
  dom?: HTMLElement;
}

export class SearchAlertsEvents {
  public static searchAlertsCreated = 'searchAlertsCreated';
  public static searchAlertsDeleted = 'searchAlertsDeleted';
  public static searchAlertsFail = 'searchAlertsFail';
}
