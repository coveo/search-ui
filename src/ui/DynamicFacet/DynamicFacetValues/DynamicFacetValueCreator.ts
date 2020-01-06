import { FacetUtils } from '../../Facet/FacetUtils';
import { IDynamicFacet, IValueCreator } from '../IDynamicFacet';
import { DynamicFacetValue } from './DynamicFacetValue';
import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { DynamicFacetValueRenderer } from './DynamicFacetValueRenderer';

export class DynamicFacetValueCreator implements IValueCreator {
  constructor(private facet: IDynamicFacet) {}

  private getDisplayValue(value: string) {
    return FacetUtils.getDisplayValueFromValueCaption(value, this.facet.options.field as string, this.facet.options.valueCaption);
  }

  public createFromResponse(facetValue: IFacetResponseValue, index: number) {
    return new DynamicFacetValue(
      {
        value: facetValue.value,
        displayValue: this.getDisplayValue(facetValue.value),
        numberOfResults: facetValue.numberOfResults,
        state: facetValue.state,
        position: index + 1
      },
      this.facet,
      DynamicFacetValueRenderer
    );
  }

  public createFromValue(value: string) {
    const position = this.facet.values.allFacetValues.length + 1;
    const state = FacetValueState.idle;
    const displayValue = this.getDisplayValue(value);
    return new DynamicFacetValue({ value, displayValue, state, numberOfResults: 0, position }, this.facet, DynamicFacetValueRenderer);
  }

  public createFromRange() {
    return null;
  }
}
