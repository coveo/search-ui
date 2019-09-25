import { IFieldOption } from '../Base/ComponentOptions';
import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';

export interface IDynamicFacetCommonOptions extends IResponsiveComponentOptions {
  id?: string;
  title?: string;
  field?: IFieldOption;
  numberOfValues?: number;
  enableCollapse?: boolean;
  enableScrollToTop?: boolean;
  collapsedByDefault?: boolean;
  includeInBreadcrumb?: boolean;
  numberOfValuesInBreadcrumb?: number;
}
