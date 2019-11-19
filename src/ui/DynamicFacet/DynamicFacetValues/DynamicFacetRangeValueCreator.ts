import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { DynamicFacetValue, ValueCreator } from './DynamicFacetValue';
import { IRangeValue } from '../../../rest/RangeValue';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { DynamicFacetRangeValueParser } from './DynamicFacetRangeValueParser';
import { IDynamicFacetRange } from '../DynamicFacetRangeInterface';
import { DynamicFacetValueRenderer } from './DynamicFacetValueRenderer';

export class DynamicFacetRangeValueCreator implements ValueCreator {
  private parser: DynamicFacetRangeValueParser;

  constructor(private facet: IDynamicFacetRange) {
    this.parser = new DynamicFacetRangeValueParser(this.facet);
  }

  public createFromRange(unvalidatedRange: IRangeValue, index: number) {
    const range = this.parser.validate(unvalidatedRange);
    if (!range) {
      this.facet.logger.error(`Unvalid range for ${this.facet.options.valueFormat} format`, unvalidatedRange);
      return null;
    }

    const displayValue = range.label ? range.label : this.parser.formatDisplayValue(range);

    return new DynamicFacetValue(
      {
        displayValue,
        value: this.parser.formatValue(range),
        start: range.start,
        end: range.end,
        endInclusive: !!range.endInclusive,
        numberOfResults: 0,
        state: FacetValueState.idle,
        position: index + 1
      },
      this.facet,
      DynamicFacetValueRenderer
    );
  }

  public createFromResponse(responseValue: IFacetResponseValue, index: number) {
    const value = this.parser.formatValue(responseValue);
    // SEARCHAPI-3887 will return displayValue in the response
    const { displayValue } = this.facet.values.get(value);

    return new DynamicFacetValue(
      {
        ...responseValue,
        value,
        displayValue,
        position: index + 1
      },
      this.facet,
      DynamicFacetValueRenderer
    );
  }

  public createFromValue(value: string) {
    const range = this.parser.parse(value);
    if (!range) {
      this.facet.logger.error('Facet range value invalid', value);
      return null;
    }

    return this.createFromRange(range, this.facet.values.allFacetValues.length);
  }
}
