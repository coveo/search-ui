import { DynamicFacet } from '../DynamicFacet';
import { FacetUtils } from '../../Facet/FacetUtils';
import { ValueCreator } from './DynamicFacetValues';
import { DynamicFacetValue } from './DynamicFacetValue';
import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';

export class DynamicFacetValueCreator implements ValueCreator {
  constructor(private facet: DynamicFacet) { }

  public createFromResponse(facetValue: IFacetResponseValue, index: number) {
    return new DynamicFacetValue(
      {
        value: facetValue.value,
        displayValue: FacetUtils.getDisplayValueFromValueCaption(
          facetValue.value,
          this.facet.options.field as string,
          this.facet.options.valueCaption
        ),
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
    const displayValue = FacetUtils.getDisplayValueFromValueCaption(
      value,
      this.facet.options.field as string,
      this.facet.options.valueCaption
    );
    return new DynamicFacetValue({ value, displayValue, state, numberOfResults: 0, position }, this.facet);
  }
}
