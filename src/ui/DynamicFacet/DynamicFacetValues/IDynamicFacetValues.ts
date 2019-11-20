import { IFacetResponse } from '../../../rest/Facet/FacetResponse';
import { IRangeValue } from '../../../rest/RangeValue';
import { DynamicFacetValue } from './DynamicFacetValue';

export interface IDynamicFacetValues {
  createFromResponse(response: IFacetResponse): void;
  createFromRanges(ranges: IRangeValue[]): void;
  resetValues(): void;
  clearAll(): void;
  hasSelectedValue(arg: string | DynamicFacetValue): boolean;
  get(arg: string | DynamicFacetValue): DynamicFacetValue;
  render(): HTMLElement;
  
  allValues: string[];
  selectedValues: string[];

  allFacetValues: DynamicFacetValue[];
  activeValues: DynamicFacetValue[];

  hasSelectedValues: boolean;
  hasActiveValues: boolean;
  hasIdleValues: boolean;
  hasDisplayedValues: boolean;
  hasValues: boolean;
}
