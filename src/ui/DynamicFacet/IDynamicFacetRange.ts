import { IDynamicFacetOptions, IDynamicFacet } from './IDynamicFacet';
import { IRangeValue } from '../../rest/RangeValue';
import { FacetRangeSortOrder } from '../../rest/Facet/FacetRangeSortOrder';

/**
 * The allowed values for the [`valueFormat`]{@link DynamicFacetRange.options.valueFormat} option
 * of the [`DynamicFacetRange`]{@link DynamicFacetRange} component.
 */
export enum DynamicFacetRangeValueFormat {
  /**
   * Format range values as localized currency strings.
   */
  currency = 'currency',
  /**
   * Format range values as localized numeric strings.
   */
  number = 'number',
  /**
   * Format range values as localized date strings.
   */
  date = 'date'
}

export function isFacetRangeValueFormat(rangeValueFormat: string) {
  return !!DynamicFacetRangeValueFormat[rangeValueFormat];
}

export interface IDynamicFacetRangeOptions extends IDynamicFacetOptions {
  valueSeparator?: string;
  valueFormat?: DynamicFacetRangeValueFormat;
  ranges?: IRangeValue[];
  numberOfDecimals?: number;
  currencySymbol?: string;
  sortOrder?: FacetRangeSortOrder;
}

export interface IDynamicFacetRange extends IDynamicFacet {
  options: IDynamicFacetRangeOptions;
}
