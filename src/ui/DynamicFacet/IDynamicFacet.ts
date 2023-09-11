import { IAutoLayoutAdjustableInsideFacetColumn } from '../SearchInterface/FacetColumnAutoLayoutAdjustment';
import { IFieldOption } from '../Base/IComponentOptions';
import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { IDynamicManagerCompatibleFacet } from '../DynamicFacetManager/DynamicFacetManager';
import { DynamicFacetQueryController } from '../../controllers/DynamicFacetQueryController';
import { FacetType } from '../../rest/Facet/FacetRequest';
import { IAnalyticsFacetMeta, IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IAnalyticsFacetState } from '../Analytics/IAnalyticsFacetState';
import { IFacetResponseValue, IFacetResponse } from '../../rest/Facet/FacetResponse';
import { IRangeValue } from '../../rest/RangeValue';
import { FacetValueState } from '../../rest/Facet/FacetValueState';
import { DynamicFacetHeader } from './DynamicFacetHeader/DynamicFacetHeader';
import { FacetSortCriteria } from '../../rest/Facet/FacetSortCriteria';
import { DependsOnManager, IDependsOnCompatibleFacetOptions } from '../../utils/DependsOnManager';
import { IFieldValueCompatibleFacet } from '../FieldValue/IFieldValueCompatibleFacet';

export interface IDynamicFacetOptions extends IResponsiveComponentOptions, IDependsOnCompatibleFacetOptions {
  title?: string;
  field?: IFieldOption;
  sortCriteria?: FacetSortCriteria;
  customSort?: string[];
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
  injectionDepth?: number;
  filterFacetCount?: boolean;
  headingLevel?: number;
}

export interface IDynamicFacet
  extends Component,
    IDynamicManagerCompatibleFacet,
    IAutoLayoutAdjustableInsideFacetColumn,
    IFieldValueCompatibleFacet {
  header: DynamicFacetHeader;
  options: IDynamicFacetOptions;
  dependsOnManager: DependsOnManager;
  dynamicFacetQueryController: DynamicFacetQueryController;
  values: IDynamicFacetValues;
  position: number;
  moreValuesAvailable: boolean;
  isCollapsed: boolean;

  fieldName: string;
  facetType: FacetType;
  analyticsFacetState: IAnalyticsFacetState[];
  basicAnalyticsFacetState: IAnalyticsFacetState;
  basicAnalyticsFacetMeta: IAnalyticsFacetMeta;

  isCurrentlyDisplayed(): boolean;
  selectValue(value: string): void;
  selectMultipleValues(values: string[]): void;
  deselectValue(value: string): void;
  deselectMultipleValues(values: string[]): void;
  toggleSelectValue(value: string): void;
  focusValueAfterRerender(value: string): void;
  showMoreValues(additionalNumberOfValues?: number): void;
  showLessValues(): void;
  reset(): void;
  toggleCollapse(): void;
  enableFreezeCurrentValuesFlag(): void;
  enableFreezeFacetOrderFlag(): void;
  enablePreventAutoSelectionFlag(): void;
  scrollToTop(): void;
  logAnalyticsEvent(actionCause: IAnalyticsActionCause, facetMeta: IAnalyticsFacetMeta): void;
  triggerNewQuery(beforeExecuteQuery?: () => void): void;
  triggerNewIsolatedQuery(beforeExecuteQuery?: () => void): void;
}

export interface IValueCreator {
  createFromResponse(facetValue: IFacetResponseValue, index: number): IDynamicFacetValue;
  createFromValue(value: string): IDynamicFacetValue;
  getDefaultValues(): IDynamicFacetValue[];
}

export interface IValueRenderer {
  render(): HTMLElement;
}

export interface IValueRendererKlass {
  new (facetValue: IDynamicFacetValueProperties, facet: IDynamicFacet): IValueRenderer;
}

export interface IDynamicFacetValueProperties extends IRangeValue {
  value: string;
  displayValue: string;
  state: FacetValueState;
  numberOfResults: number;
  position: number;
}

export interface IDynamicFacetValue extends IDynamicFacetValueProperties {
  renderer: IValueRenderer;
  isSelected: boolean;
  isIdle: boolean;
  formattedCount: string;
  selectAriaLabel: string;
  renderedElement: HTMLElement;
  analyticsFacetState: IAnalyticsFacetState;
  analyticsFacetMeta: IAnalyticsFacetMeta;

  select(): void;
  toggleSelect(): void;
  deselect(): void;
  equals(arg: string | IDynamicFacetValue): boolean;
  focus(): void;

  logSelectActionToAnalytics(): void;
}

export interface IDynamicFacetValues {
  createFromResponse(response: IFacetResponse): void;
  resetValues(): void;
  clearAll(): void;
  hasSelectedValue(arg: string | IDynamicFacetValue): boolean;
  get(arg: string | IDynamicFacetValue): IDynamicFacetValue;
  focus(value: string): void;
  render(): HTMLElement;

  allValues: string[];
  selectedValues: string[];

  allFacetValues: IDynamicFacetValue[];
  activeValues: IDynamicFacetValue[];

  hasSelectedValues: boolean;
  hasActiveValues: boolean;
  hasIdleValues: boolean;
  hasValues: boolean;
}
