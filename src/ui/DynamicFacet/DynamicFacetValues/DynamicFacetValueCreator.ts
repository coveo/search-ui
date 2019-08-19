import { DynamicFacet } from '../DynamicFacet';
import { FacetUtils } from '../../Facet/FacetUtils';
import { ValueCreator } from './DynamicFacetValues';
import { DynamicFacetValue } from './DynamicFacetValue';
import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';

export class DynamicFacetValueCreator implements ValueCreator {
  constructor(private facet: DynamicFacet) {}

  private formatValue(value: string) {
    let returnValue = FacetUtils.tryToGetTranslatedCaption(<string>this.facet.options.field, value);

    if (this.facet.options.valueCaption && typeof this.facet.options.valueCaption === 'object') {
      returnValue = this.facet.options.valueCaption[value] || returnValue;
    }

    return returnValue;
  }

  public createFromResponse(facetValue: IFacetResponseValue, index: number) {
    return new DynamicFacetValue(
      {
        value: facetValue.value,
        displayValue: this.formatValue(facetValue.value),
        numberOfResults: facetValue.numberOfResults,
        state: facetValue.state,
        position: index + 1
      },
      this.facet
    );
  }

  public createFromValue(value: string) {
    const position = this.facet.values.allFacetValues.length + 1;
    const state = FacetValueState.idle;
    const displayValue = this.formatValue(value);
    return new DynamicFacetValue({ value, displayValue, state, numberOfResults: 0, position }, this.facet);
  }
}
