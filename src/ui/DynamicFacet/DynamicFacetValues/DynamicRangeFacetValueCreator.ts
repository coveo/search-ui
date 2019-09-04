import * as Globalize from 'globalize';
import { DynamicRangeFacet } from '../DynamicRangeFacet';
import { ValueCreator } from './DynamicFacetValues';
import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { DynamicFacetValue } from './DynamicFacetValue';
import { RangeType, IRangeValue, RangeEndScope } from '../../../rest/RangeValue';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';

export class DynamicRangeFacetValueCreator implements ValueCreator {
  constructor(private facet: DynamicRangeFacet) {}

  private formatValue(value: RangeType) {
    // TODO: Manage different value formats
    return Globalize.format(value, 'n0');
  }

  private formatRangeValue(range: IRangeValue) {
    const formattedStart = this.formatValue(range.start);
    const formattedEnd = this.formatValue(range.end);

    return `${formattedStart} ${this.facet.options.valueSeparator} ${formattedEnd}`;
  }

  private valueFromRange(range: IRangeValue) {
    const scope = range.endInclusive ? RangeEndScope.Inclusive : RangeEndScope.Exclusive;
    // TODO: Manage different value formats
    return `${range.start}..${range.end}${scope}`;
  }

  public createFromRange(range: IRangeValue, index: number) {
    const displayValue = range.label ? range.label : this.formatRangeValue(range);

    return new DynamicFacetValue(
      {
        displayValue,
        value: this.valueFromRange(range),
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
    const value = this.valueFromRange(responseValue);
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

    // TODO: Manage different value formats
    return {
      start: Number(startAndEnd[1]),
      end: Number(startAndEnd[2]),
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
