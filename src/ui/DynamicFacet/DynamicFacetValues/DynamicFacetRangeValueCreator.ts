import { DynamicFacetRange } from '../DynamicFacetRange';
import { ValueCreator } from './DynamicFacetValues';
import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { DynamicFacetValue } from './DynamicFacetValue';
import { IRangeValue } from '../../../rest/RangeValue';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { DynamicFacetRangeValueParser } from './DynamicFacetRangeValueParser';

export class DynamicFacetRangeValueCreator implements ValueCreator {
  private parser: DynamicFacetRangeValueParser;

  constructor(private facet: DynamicFacetRange) {
    this.parser = new DynamicFacetRangeValueParser(this.facet.options.valueFormat);
  }

  public createFromRange(unvalidatedRange: IRangeValue, index: number) {
    const range = this.parser.parseRange(unvalidatedRange);
    if (!range) {
      this.facet.logger.error(`Unvalid range for ${this.facet.options.valueFormat} format`, unvalidatedRange);
      return null;
    }

    const displayValue = range.label ? range.label : this.parser.parseRangeDisplayValue(range, this.facet.options.valueSeparator);

    return new DynamicFacetValue(
      {
        displayValue,
        value: this.parser.createValueFromRange(range),
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
    const value = this.parser.createValueFromRange(responseValue);
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
    const range = this.parser.createRangeFromValue(value);
    if (!range) {
      this.facet.logger.error('Facet range value invalid', value);
      return null;
    }

    return this.createFromRange(range, this.facet.values.allFacetValues.length);
  }
}
