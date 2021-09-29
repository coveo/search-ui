import { IQueryResult } from '../../rest/QueryResult';
import { IFieldOption } from '../Base/IComponentOptions';

export interface IResultLinkOptions {
  logAnalytics?: (href: string) => void;
  onClick?: (e: Event, result: IQueryResult) => any;
  field?: IFieldOption;
  openInOutlook?: boolean;
  openQuickview?: boolean;
  alwaysOpenInNewWindow?: boolean;
  hrefTemplate?: string;
  titleTemplate?: string;
}
