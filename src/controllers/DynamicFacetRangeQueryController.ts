import { DynamicFacetQueryController } from './DynamicFacetQueryController';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { IQuery } from '../rest/Query';
import { IDynamicFacetRange } from '../ui/DynamicFacet/IDynamicFacetRange';

export class DynamicFacetRangeQueryController extends DynamicFacetQueryController {
  protected facet: IDynamicFacetRange;

  public buildFacetRequest(query: IQuery): IFacetRequest {
    return {
      ...this.requestBuilder.buildBaseRequestForQuery(query),
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      freezeCurrentValues: false,
      generateAutomaticRanges: this.shouldGenerateAutomaticRanges
    };
  }

  protected get numberOfValues() {
    return this.shouldGenerateAutomaticRanges ? this.facet.options.numberOfValues : this.facet.options.ranges.length;
  }

  private get shouldGenerateAutomaticRanges() {
    return !this.facet.options.ranges.length;
  }

  protected get currentValues(): IFacetRequestValue[] {
    if (this.shouldGenerateAutomaticRanges && !this.facet.hasActiveValues) {
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
