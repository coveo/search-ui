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
      generateAutomaticRanges: !this.isRangesOptionDefined
    };
  }

  protected get numberOfValues() {
    return this.isRangesOptionDefined ? this.facet.options.ranges.length : this.facet.options.numberOfValues;
  }

  private get isRangesOptionDefined() {
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
