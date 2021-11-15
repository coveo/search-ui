import { DynamicFacetQueryController } from './DynamicFacetQueryController';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { IDynamicFacetRange } from '../ui/DynamicFacet/IDynamicFacetRange';

export class DynamicFacetRangeQueryController extends DynamicFacetQueryController {
  protected facet: IDynamicFacetRange;

  public buildFacetRequest(): IFacetRequest {
    return {
      ...this.requestBuilder.buildBaseRequestForQuery(),
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      freezeCurrentValues: false,
      sortCriteria: this.facet.options.sortOrder,
      generateAutomaticRanges: !this.manualRangesAreDefined
    };
  }

  protected get numberOfValues() {
    return this.manualRangesAreDefined ? this.facet.options.ranges.length : this.facet.options.numberOfValues;
  }

  private get manualRangesAreDefined() {
    return !!this.facet.options.ranges.length;
  }

  protected get currentValues(): IFacetRequestValue[] {
    if (!this.manualRangesAreDefined && !this.facet.hasActiveValues) {
      return [];
    }

    return this.facet.values.allFacetValues.map(({ start, end, endInclusive, state }) => ({
      start,
      end,
      endInclusive,
      state
    }));
  }
}
