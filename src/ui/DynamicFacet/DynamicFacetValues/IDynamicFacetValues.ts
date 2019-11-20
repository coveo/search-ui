import { IFacetResponse } from '../../../rest/Facet/FacetResponse';
import { IRangeValue } from '../../../rest/RangeValue';
import { IDynamicFacetValue } from './IDynamicFacetValue';

export interface IDynamicFacetValues {
  createFromResponse(response: IFacetResponse): void;
  createFromRanges(ranges: IRangeValue[]): void;
  resetValues(): void;
  clearAll(): void;
  hasSelectedValue(arg: string | IDynamicFacetValue): boolean;
  get(arg: string | IDynamicFacetValue): IDynamicFacetValue;
  render(): HTMLElement;
  
  allValues: string[];
  selectedValues: string[];

  allFacetValues: IDynamicFacetValue[];
  activeValues: IDynamicFacetValue[];

  hasSelectedValues: boolean;
  hasActiveValues: boolean;
  hasIdleValues: boolean;
  hasDisplayedValues: boolean;
  hasValues: boolean;
}
