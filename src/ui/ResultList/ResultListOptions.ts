import { IFieldOption } from '../Base/ComponentOptions';
import { Template } from '../Templates/Template';

export interface IResultListOptions {
  resultContainer?: HTMLElement;
  resultTemplate?: Template;
  resultOptions?: {};
  waitAnimationContainer?: HTMLElement;
  enableInfiniteScroll?: boolean;
  infiniteScrollPageSize?: number;
  infiniteScrollContainer?: HTMLElement | Window;
  waitAnimation?: string;
  mobileScrollContainer?: HTMLElement;
  enableInfiniteScrollWaitingAnimation?: boolean;
  fieldsToInclude?: IFieldOption[];
  autoSelectFieldsToInclude?: boolean;
  layout?: string;
}
