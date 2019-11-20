import { IAutoLayoutAdjustableInsideFacetColumn } from '../SearchInterface/FacetColumnAutoLayoutAdjustment';
import { IFieldOption } from '../Base/ComponentOptions';
import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { IDynamicManagerCompatibleFacet } from '../DynamicFacetManager/DynamicFacetManager';
import { DependsOnManager } from '../../utils/DependsOnManager';
import { DynamicFacetQueryController } from '../../controllers/DynamicFacetQueryController';
import { IDynamicFacetValues } from './DynamicFacetValues/IDynamicFacetValues';
import { FacetType } from '../../rest/Facet/FacetRequest';
import { IAnalyticsFacetMeta, IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IAnalyticsFacetState } from '../Analytics/IAnalyticsFacetState';

export interface IDynamicFacetOptions extends IResponsiveComponentOptions {
  id?: string;
  title?: string;
  field?: IFieldOption;
  sortCriteria?: string;
  numberOfValues?: number;
  enableCollapse?: boolean;
  enableScrollToTop?: boolean;
  enableMoreLess?: boolean;
  enableFacetSearch?: boolean;
  useLeadingWildcardInFacetSearch?: boolean;
  collapsedByDefault?: boolean;
  includeInBreadcrumb?: boolean;
  numberOfValuesInBreadcrumb?: number;
  valueCaption?: Record<string, string>;
  dependsOn?: string;
}

export interface IDynamicFacet extends Component, IDynamicManagerCompatibleFacet, IAutoLayoutAdjustableInsideFacetColumn {
  options: IDynamicFacetOptions;
  dependsOnManager: DependsOnManager;
  dynamicFacetQueryController: DynamicFacetQueryController;
  values: IDynamicFacetValues;
  position: number;
  moreValuesAvailable: boolean;
  isCollapsed: boolean;

  fieldName: string;
  facetType: FacetType;
  analyticsFacetState: IAnalyticsFacetState[]
  basicAnalyticsFacetState: IAnalyticsFacetState;
  basicAnalyticsFacetMeta: IAnalyticsFacetMeta;

  selectValue(value: string): void;
  selectMultipleValues(values: string[]): void;
  deselectValue(value: string): void;
  deselectMultipleValues(values: string[]): void;
  toggleSelectValue(value: string): void;
  showMoreValues(additionalNumberOfValues?: number): void;
  showLessValues(): void;
  reset(): void;
  toggleCollapse(): void;
  enableFreezeCurrentValuesFlag(): void;
  enableFreezeFacetOrderFlag(): void;
  scrollToTop(): void;
  logAnalyticsEvent(actionCause: IAnalyticsActionCause, facetMeta: IAnalyticsFacetMeta): void;
  triggerNewQuery(beforeExecuteQuery?: () => void): void;
  triggerNewIsolatedQuery(beforeExecuteQuery?: () => void): void;
}
