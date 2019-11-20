import { FacetUtils } from '../../Facet/FacetUtils';
import { DynamicFacetValue } from './DynamicFacetValue';
import { IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { IDynamicFacet } from '../IDynamicFacet';
import { DynamicFacetValueRenderer } from './DynamicFacetValueRenderer';
import { IValueCreator } from './IDynamicFacetValue';

export class DynamicFacetValueCreator implements IValueCreator {
  constructor(private facet: IDynamicFacet) { }

  private formatDisplayValue(value: string) {
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
        displayValue: this.formatDisplayValue(facetValue.value),
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
    const displayValue = this.formatDisplayValue(value);
    return new DynamicFacetValue(
      { value, displayValue, state, numberOfResults: 0, position },
      this.facet,
      DynamicFacetValueRenderer
    );
  }

  public createFromRange() {
    return null;
  }
}
