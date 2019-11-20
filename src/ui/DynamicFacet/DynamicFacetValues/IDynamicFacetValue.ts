import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { IRangeValue } from '../../../rest/RangeValue';
import { IDynamicFacet } from '../IDynamicFacet';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { IAnalyticsFacetState } from '../../Analytics/IAnalyticsFacetState';
import { IAnalyticsFacetMeta } from '../../Analytics/AnalyticsActionListMeta';

export interface IValueCreator {
  createFromResponse(facetValue: IFacetResponseValue, index: number): IDynamicFacetValue;
  createFromValue(value: string): IDynamicFacetValue;
  createFromRange(range: IRangeValue, index: number): IDynamicFacetValue;
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
  preventAutoSelect?: boolean;
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

  select():void;
  toggleSelect():void;
  deselect():void;
  equals(arg: string | IDynamicFacetValue): boolean;

  logSelectActionToAnalytics(): void;
}
