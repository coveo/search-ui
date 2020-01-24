import { DynamicFacetQueryController } from './DynamicFacetQueryController';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { IDynamicFacet } from '../ui/DynamicFacet/IDynamicFacet';
import { IQuery } from '../rest/Query';

export class DynamicFacetRangeQueryController extends DynamicFacetQueryController {
  protected facet: IDynamicFacet;

  public buildFacetRequest(query: IQuery): IFacetRequest {
    return {
      ...this.requestBuilder.buildBaseRequestForQuery(query),
      preventAutoSelect: this.preventAutoSelection,
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      freezeCurrentValues: this.facet.values.hasValues
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
      state,
      // TODO: remove after SEARCHAPI-4233 is completed
      preventAutoSelect: this.preventAutoSelection
    }));
  }
}
