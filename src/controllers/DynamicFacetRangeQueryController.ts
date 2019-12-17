import { DynamicFacetQueryController } from './DynamicFacetQueryController';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { IDynamicFacet } from '../ui/DynamicFacet/IDynamicFacet';

export class DynamicFacetRangeQueryController extends DynamicFacetQueryController {
  protected facet: IDynamicFacet;

  public get facetRequest(): IFacetRequest {
    return {
      facetId: this.facet.options.id,
      field: this.facet.fieldName,
      type: this.facet.facetType,
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      freezeCurrentValues: this.facet.values.hasValues,
      injectionDepth: this.facet.options.injectionDepth
    };
  }

  protected get numberOfValues() {
    return this.facet.values.hasValues ? this.currentValues.length : this.facet.options.numberOfValues;
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
