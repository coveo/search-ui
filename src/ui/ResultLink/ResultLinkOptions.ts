import {IQueryResult} from '../../rest/QueryResult'

export interface IResultLinkOptions {
  onClick?: (e: Event, result: IQueryResult) => any;
  field?: string;
  openInOutlook?: boolean;
  openQuickview?: boolean;
  alwaysOpenInNewWindow?: boolean;
  hrefTemplate?: string;
}
