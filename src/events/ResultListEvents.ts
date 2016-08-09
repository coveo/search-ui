import {IQueryResult} from '../rest/QueryResult';

export interface IDisplayedNewResultEventArgs {
  result: IQueryResult;
  item: HTMLElement;
}

export interface IDisplayedNewResultsEventArgs {
}

export interface IOpenQuickviewEventArgs {
  termsToHighlight: any;
}

export interface IChangeLayoutEventArgs {
  layout: string;
}

export class ResultListEvents {
  public static newResultsDisplayed = 'newResultsDisplayed';
  public static newResultDisplayed = 'newResultDisplayed';
  public static openQuickview = 'openQuickview';
  public static changeLayout = 'changeLayout';
}
