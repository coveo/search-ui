import { IDynamicFacetOptions, IDynamicFacet } from './IDynamicFacet';
import { IRangeValue } from '../../rest/RangeValue';

/**
 * The allowed values for the [`valueFormat`]{@link DynamicFacetRange.options.valueFormat} option
 * of the [`DynamicFacetRange`]{@link DynamicFacetRange} component.
 */
export enum DynamicFacetRangeValueFormat {
  /**
   * Format range values as localized currency strings.
   *
   * By default, the component uses the currency associated with the currently loaded culture file
   * (see [Changing the Language of Your Search Interface](https://docs.coveo.com/421/)).
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

export interface IDynamicFacetRangeOptions extends IDynamicFacetOptions {
  valueSeparator?: string;
  valueFormat?: DynamicFacetRangeValueFormat;
  ranges?: IRangeValue[];
}

export interface IDynamicFacetRange extends IDynamicFacet {
  options: IDynamicFacetRangeOptions;
}
