import { IAutoLayoutAdjustableInsideFacetColumn } from '../SearchInterface/FacetColumnAutoLayoutAdjustment';
import { IFieldOption } from '../Base/ComponentOptions';
import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { DynamicFacetManager } from '../DynamicFacetManager/DynamicFacetManager';
import { DependsOnManager } from '../../utils/DependsOnManager';
import { DynamicFacetQueryController } from '../../controllers/DynamicFacetQueryController';
import { DynamicFacetValues } from './DynamicFacetValues/DynamicFacetValues';
import { FacetType } from '../../rest/Facet/FacetRequest';
import { IAnalyticsDynamicFacetMeta, IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { QueryBuilder } from '../Base/QueryBuilder';
import { Component } from '../Base/Component';

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
  valueCaption?: any;
  dependsOn?: string;
}

export interface IDynamicFacet extends Component, IAutoLayoutAdjustableInsideFacetColumn {
  options: IDynamicFacetOptions;
  dynamicFacetManager: DynamicFacetManager;
  dependsOnManager: DependsOnManager;
  dynamicFacetQueryController: DynamicFacetQueryController;
  values: DynamicFacetValues;
  position: number;
  moreValuesAvailable: boolean;
  isCollapsed: boolean;

  fieldName: string;
  facetType: FacetType;
  analyticsFacetState: IAnalyticsDynamicFacetMeta[]
  basicAnalyticsFacetState: IAnalyticsDynamicFacetMeta;
  hasDisplayedValues: boolean;
  hasActiveValues: boolean;

  selectValue(value: string): void;
  selectMultipleValues(values: string[]): void;
  deselectValue(value: string): void;
  deselectMultipleValues(values: string[]): void;
  toggleSelectValue(value: string): void;
  showMoreValues(additionalNumberOfValues?: number): void;
  showLessValues(): void;
  reset(): void;
  toggleCollapse(): void;
  expand(): void;
  collapse(): void;
  enableFreezeCurrentValuesFlag(): void;
  enableFreezeFacetOrderFlag(): void;
  scrollToTop(): void;
  logAnalyticsEvent(actionCause: IAnalyticsActionCause, facetMeta: IAnalyticsDynamicFacetMeta): void;
  putStateIntoQueryBuilder(queryBuilder: QueryBuilder): void;
  putStateIntoAnalytics(): void;
  triggerNewQuery(beforeExecuteQuery?: () => void): void;
  triggerNewIsolatedQuery(beforeExecuteQuery?: () => void): void;
}
