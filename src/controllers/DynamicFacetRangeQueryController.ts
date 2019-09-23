import { DynamicFacetQueryController } from './DynamicFacetQueryController';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { DynamicFacetRange } from '../ui/DynamicFacet/DynamicFacetRange';

export class DynamicFacetRangeQueryController extends DynamicFacetQueryController {
  protected facet: DynamicFacetRange;

  private get hasValues() {
    return !!this.facet.values.allFacetValues.length;
  }

  public get facetRequest(): IFacetRequest {
    return {
      facetId: this.facet.options.id,
      field: this.facet.fieldName,
      type: this.facet.facetType,
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      freezeCurrentValues: this.hasValues
    };
  }

  protected get numberOfValues() {
    return this.hasValues ? this.currentValues.length : this.facet.options.numberOfValues;
  }

  protected get currentValues(): IFacetRequestValue[] {
    return this.facet.values.allFacetValues.map(({ start, end, endInclusive, state }) => ({
      start,
      end,
      endInclusive,
      state
    }));
  }
}
