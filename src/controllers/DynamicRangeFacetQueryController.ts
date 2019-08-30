import { DynamicFacetQueryController } from './DynamicFacetQueryController';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { DynamicRangeFacet } from '../ui/DynamicFacet/DynamicRangeFacet';

export class DynamicRangeFacetQueryController extends DynamicFacetQueryController {
  protected facet: DynamicRangeFacet;

  private get hasValues() {
    return !this.facet.values.isEmpty;
  }

  public get facetRequest(): IFacetRequest {
    return {
      facetId: this.facet.options.id,
      field: this.facet.fieldName,
      type: this.facet.facetType,
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      freezeCurrentValues: this.hasValues,
      generateAutomaticRanges: !this.hasValues
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
