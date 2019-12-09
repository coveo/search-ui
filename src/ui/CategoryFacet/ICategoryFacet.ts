import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { IFieldOption } from '../Base/IComponentOptions';
import { IStringMap } from '../../rest/GenericParam';
import { Component } from '../Base/Component';
import { IAutoLayoutAdjustableInsideFacetColumn } from '../SearchInterface/FacetColumnAutoLayoutAdjustment';
import { DependsOnManager } from '../../utils/DependsOnManager';
import { DynamicFacetHeader } from '../DynamicFacet/DynamicFacetHeader/DynamicFacetHeader';
import { CategoryFacetQueryController } from '../../controllers/DynamicCategoryFacetQueryController';
import { FacetType } from '../../rest/Facet/FacetRequest';
import { IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { ISearchEndpoint } from '../../rest/SearchEndpointInterface';
import { IFacetResponse } from '../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../rest/Facet/FacetValueState';
import { IDynamicManagerCompatibleFacet } from '../DynamicFacetManager/DynamicFacetManager';

export interface ICategoryFacetOptions extends IResponsiveComponentOptions {
  id?: string;
  field: IFieldOption;
  title?: string;
  enableCollapse?: boolean;
  collapsedByDefault?: boolean;
  enableScrollToTop?: boolean;
  enableFacetSearch?: boolean;
  facetSearchDelay?: number;
  numberOfResultsInFacetSearch?: number;
  numberOfValues?: number;
  injectionDepth?: number;
  enableMoreLess?: boolean;
  pageSize?: number;
  delimitingCharacter?: string;
  debug?: boolean;
  basePath?: string[];
  maximumDepth?: number;
  valueCaption?: IStringMap<string>;
  dependsOn?: string;
  includeInBreadcrumb?: boolean;
}

export type CategoryValueDescriptor = {
  value: string;
  count: number;
  path: string[];
};

export interface ICategoryFacet extends Component, IDynamicManagerCompatibleFacet, IAutoLayoutAdjustableInsideFacetColumn {
  header: DynamicFacetHeader;
  options: ICategoryFacetOptions;
  dependsOnManager: DependsOnManager;
  categoryFacetQueryController: CategoryFacetQueryController;
  isCollapsed: boolean;
  values: ICategoryFacetValues;
  moreValuesAvailable: boolean;
  position: number;

  fieldName: string;
  facetType: FacetType;
  activePath: string[];

  isCurrentlyDisplayed(): boolean;
  scrollToTop(): void;
  triggerNewQuery(beforeExecuteQuery?: () => void): void;
  triggerNewIsolatedQuery(beforeExecuteQuery?: () => void): void;
  changeActivePath(path: string[]): void;
  reload(): void;
  getVisibleParentValues(): CategoryValueDescriptor[];
  getAvailableValues(): CategoryValueDescriptor[];
  showMore(additionalNumberOfValues?: number): void;
  showLess(): void;
  selectValue(value: string): void;
  deselectCurrentValue(): void;
  selectPath(path: string[]): void;
  reset(): void;
  clear(): void;
  hide(): void;
  show(): void;
  toggleCollapse(): void;
  getCaption(value: string): string;
  logAnalyticsEvent(eventName: IAnalyticsActionCause, path?: string[]): void;
  enableFreezeFacetOrderFlag(): void;
  getEndpoint(): ISearchEndpoint;
}

export interface ICategoryFacetValueProperties {
  value: string;
  path: string[];
  displayValue: string;
  state: FacetValueState;
  numberOfResults: number;
  moreValuesAvailable: boolean;
  preventAutoSelect: boolean;
  children: ICategoryFacetValue[];
}

export interface ICategoryFacetValue extends ICategoryFacetValueProperties {
  retrieveCount: number;
  isIdle: boolean;
  isSelected: boolean;
  selectAriaLabel: string;
  formattedCount: string;

  select(): void;
  render(fragement: DocumentFragment): HTMLElement;
  logSelectActionToAnalytics(): void;
}

export interface ICategoryFacetValues {
  clear(): void;
  createFromResponse(response: IFacetResponse): void;
  selectPath(path: string[]): void;
  render(): HTMLElement;

  hasSelectedValue: boolean;
  selectedPath: string[];

  allFacetValues: ICategoryFacetValue[];
  visibleParentValues: ICategoryFacetValue[];
  availableValues: ICategoryFacetValue[];
}
