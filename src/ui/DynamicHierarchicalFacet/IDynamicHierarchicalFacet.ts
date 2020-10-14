import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { IFieldOption } from '../Base/IComponentOptions';
import { IStringMap } from '../../rest/GenericParam';
import { Component } from '../Base/Component';
import { IAutoLayoutAdjustableInsideFacetColumn } from '../SearchInterface/FacetColumnAutoLayoutAdjustment';
import { DependsOnManager, IDependsOnCompatibleFacetOptions } from '../../utils/DependsOnManager';
import { DynamicFacetHeader } from '../DynamicFacet/DynamicFacetHeader/DynamicFacetHeader';
import { DynamicHierarchicalFacetQueryController } from '../../controllers/DynamicHierarchicalFacetQueryController';
import { FacetType } from '../../rest/Facet/FacetRequest';
import { IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { IFacetResponse } from '../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../rest/Facet/FacetValueState';
import { IDynamicManagerCompatibleFacet } from '../DynamicFacetManager/DynamicFacetManager';

export type HierarchicalFacetSortCriteria = 'alphanumeric' | 'occurrences';

export interface IDynamicHierarchicalFacetOptions extends IResponsiveComponentOptions, IDependsOnCompatibleFacetOptions {
  field: IFieldOption;
  title?: string;
  enableCollapse?: boolean;
  collapsedByDefault?: boolean;
  enableScrollToTop?: boolean;
  numberOfValues?: number;
  sortCriteria?: HierarchicalFacetSortCriteria;
  injectionDepth?: number;
  enableMoreLess?: boolean;
  enableFacetSearch?: boolean;
  delimitingCharacter?: string;
  valueCaption?: IStringMap<string>;
  includeInBreadcrumb?: boolean;
  filterFacetCount?: boolean;
  clearLabel?: string;
  basePath?: string[];
}

export interface IDynamicHierarchicalFacet extends Component, IDynamicManagerCompatibleFacet, IAutoLayoutAdjustableInsideFacetColumn {
  header: DynamicFacetHeader;
  options: IDynamicHierarchicalFacetOptions;
  dependsOnManager: DependsOnManager;
  dynamicHierarchicalFacetQueryController: DynamicHierarchicalFacetQueryController;
  isCollapsed: boolean;
  values: IDynamicHierarchicalFacetValues;
  moreValuesAvailable: boolean;
  position: number;

  fieldName: string;
  facetType: FacetType;

  isCurrentlyDisplayed(): boolean;
  scrollToTop(): void;
  triggerNewQuery(beforeExecuteQuery?: () => void): void;
  triggerNewIsolatedQuery(beforeExecuteQuery?: () => void): void;
  showMoreValues(additionalNumberOfValues?: number): void;
  showLessValues(): void;
  selectPath(path: string[]): void;
  reset(): void;
  toggleCollapse(): void;
  getCaption(value: string): string;
  logAnalyticsEvent(eventName: IAnalyticsActionCause): void;
  enableFreezeFacetOrderFlag(): void;
  enablePreventAutoSelectionFlag(): void;
}

export interface IDynamicHierarchicalFacetSearchValueProperties {
  fullPath: string[];
  displayValue: string;
  numberOfResults: number;
}

export interface IDynamicHierarchicalFacetValueProperties {
  value: string;
  path: string[];
  displayValue: string;
  state: FacetValueState;
  numberOfResults: number;
  moreValuesAvailable: boolean;
  children: IDynamicHierarchicalFacetValue[];
  isLeafValue: boolean;
}

export interface IDynamicHierarchicalFacetValue extends IDynamicHierarchicalFacetValueProperties {
  retrieveCount: number;
  isIdle: boolean;
  isSelected: boolean;
  selectAriaLabel: string;
  formattedCount: string;

  select(): void;
  render(fragement: DocumentFragment): HTMLElement;
  logSelectActionToAnalytics(): void;
}

export interface IDynamicHierarchicalFacetValues {
  resetValues(): void;
  clearPath(): void;
  createFromResponse(response: IFacetResponse): void;
  selectPath(path: string[]): void;
  render(): HTMLElement;

  hasSelectedValue: boolean;
  selectedPath: string[];

  allFacetValues: IDynamicHierarchicalFacetValue[];
}
