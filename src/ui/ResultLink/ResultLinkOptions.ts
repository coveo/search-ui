import { IQueryResult } from '../../rest/QueryResult';
import { IFieldOption } from '../Base/IComponentOptions';

export interface IResultLinkOptions {
  onClick?: (e: Event, result: IQueryResult) => any;
  field?: IFieldOption;
  openInOutlook?: boolean;
  openQuickview?: boolean;
  alwaysOpenInNewWindow?: boolean;
  hrefTemplate?: string;
  titleTemplate?: string;
}
