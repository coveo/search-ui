import {ISubscription} from '../rest/Subscription';

export interface ISearchAlertEventArgs {
  subscription: ISubscription;
  dom?: HTMLElement;
}

export interface ISearchAlertsFailEventArgs {
  dom?: HTMLElement;
}

export class SearchAlertEvents {
  public static searchAlertCreated = 'searchAlertCreated';
  public static searchAlertDeleted = 'searchAlertDeleted';
  public static searchAlertsFail = 'SearchAlertsFail';
}
