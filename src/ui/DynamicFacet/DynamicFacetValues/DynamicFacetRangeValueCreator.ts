import { DynamicFacetRange } from '../DynamicFacetRange';
import { ValueCreator } from './DynamicFacetValues';
import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { DynamicFacetValue } from './DynamicFacetValue';
import { IRangeValue } from '../../../rest/RangeValue';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { DynamicFacetRangeValueUtils as RangeUtils } from './DynamicFacetRangeValueUtils';

export class DynamicFacetRangeValueCreator implements ValueCreator {
  constructor(private facet: DynamicFacetRange) {}

  private get valueFormat() {
    return this.facet.options.valueFormat;
  }

  public createFromRange(unvalidatedRange: IRangeValue, index: number) {
    const range = RangeUtils.parseRange(unvalidatedRange, this.valueFormat);
    if (!range) {
      this.facet.logger.error(`Unvalid range for ${this.valueFormat} format`, unvalidatedRange);
      return null;
    }

    const displayValue = range.label
      ? range.label
      : RangeUtils.formatRangeDisplayValue(range, this.valueFormat, this.facet.options.valueSeparator);

    return new DynamicFacetValue(
      {
        displayValue,
        value: RangeUtils.createValueFromRange(range),
        start: range.start,
        end: range.end,
        endInclusive: !!range.endInclusive,
        numberOfResults: 0,
        state: FacetValueState.idle,
        position: index + 1
      },
      this.facet
    );
  }

  public createFromResponse(responseValue: IFacetResponseValue, index: number) {
    const value = RangeUtils.createValueFromRange(responseValue);
    const { displayValue } = this.facet.values.get(value);

    return new DynamicFacetValue(
      {
        ...responseValue,
        value,
        displayValue,
        position: index + 1
      },
      this.facet
    );
  }

  public createFromValue(value: string) {
    const range = RangeUtils.createRangeFromValue(value, this.valueFormat);
    if (!range) {
      this.facet.logger.error('Facet range value invalid', value);
      return null;
    }

    return this.createFromRange(range, this.facet.values.allFacetValues.length);
  }
}
