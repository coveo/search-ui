import { DynamicRangeFacet } from '../DynamicRangeFacet';
import { ValueCreator } from './DynamicFacetValues';
import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { DynamicFacetValue } from './DynamicFacetValue';
import { IRangeValue, RangeEndScope } from '../../../rest/RangeValue';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { DynamicRangeFacetValueUtils as RangeUtils } from './DynamicRangeFacetValueUtils';

export class DynamicRangeFacetValueCreator implements ValueCreator {
  constructor(private facet: DynamicRangeFacet) {}

  public createFromRange(unvalidatedRange: IRangeValue, index: number) {
    const range = RangeUtils.validateRange(unvalidatedRange, this.facet.options.valueFormat);
    if (!range) {
      this.facet.logger.error(`Unvalid range for ${this.facet.options.valueFormat} format`, unvalidatedRange);
      return null;
    }

    const displayValue = range.label
      ? range.label
      : RangeUtils.formatRangeValue(range, this.facet.options.valueFormat, this.facet.options.valueSeparator);

    return new DynamicFacetValue(
      {
        displayValue,
        value: RangeUtils.valueFromRange(range),
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
    const value = RangeUtils.valueFromRange(responseValue);
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

  private extractRangeFromValue(value: string): IRangeValue {
    const valueRegex = new RegExp(`^(.+)\\.\\.(.+)(${RangeEndScope.Inclusive}|${RangeEndScope.Exclusive})$`);
    const startAndEnd = valueRegex.exec(value);
    if (!startAndEnd) {
      this.facet.logger.error('Facet range value invalid', value);
      return null;
    }

    return {
      start: RangeUtils.validateRangeValue(startAndEnd[1], this.facet.options.valueFormat),
      end: RangeUtils.validateRangeValue(startAndEnd[2], this.facet.options.valueFormat),
      endInclusive: startAndEnd[3] === RangeEndScope.Inclusive
    };
  }

  public createFromValue(value: string) {
    const range = this.extractRangeFromValue(value);
    if (!range) {
      return null;
    }

    return this.createFromRange(range, this.facet.values.allFacetValues.length);
  }
}
