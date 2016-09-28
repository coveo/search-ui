import {IQueryResult} from '../../rest/QueryResult';
import {FieldOption} from "../Base/ComponentOptions";

export interface IResultLinkOptions {
  onClick?: (e: Event, result: IQueryResult) => any;
  field?: FieldOption;
  openInOutlook?: boolean;
  openQuickview?: boolean;
  alwaysOpenInNewWindow?: boolean;
  hrefTemplate?: string;
}
