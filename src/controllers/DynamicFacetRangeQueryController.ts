import { DynamicFacetQueryController } from './DynamicFacetQueryController';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { IQuery } from '../rest/Query';
import { IDynamicFacetRange } from '../ui/DynamicFacet/IDynamicFacetRange';

export class DynamicFacetRangeQueryController extends DynamicFacetQueryController {
  protected facet: IDynamicFacetRange;

  public buildFacetRequest(query: IQuery): IFacetRequest {
    return {
      ...this.requestBuilder.buildBaseRequestForQuery(query),
      preventAutoSelect: this.preventAutoSelection,
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      freezeCurrentValues: false,
      generateAutomaticRanges: !this.areRangesDefined
    };
  }

  protected get numberOfValues() {
    return this.areRangesDefined ? this.facet.options.ranges.length : this.facet.options.numberOfValues;
  }

  private get areRangesDefined() {
    return !!this.facet.options.ranges.length;
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
