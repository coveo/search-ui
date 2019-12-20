import { FacetType, IFacetRequest } from '../rest/Facet/FacetRequest';
import { FacetSortCriteria } from '../rest/Facet/FacetSortCriteria';
import { IQuery } from '../rest/Query';
import { Utils } from '../utils/Utils';

export interface IBasicFacetRequestParameters {
  facetId: string;
  field: string;
  type: FacetType;
  injectionDepth: number;
  sortCriteria?: FacetSortCriteria;
  delimitingCharacter?: string;
  filterFacetCount?: boolean;
}

export class DynamicFacetRequestBuilder {
  constructor(private options: IBasicFacetRequestParameters) {}

  public buildRequestForQuery(query: IQuery): IFacetRequest {
    return {
      ...this.options,
      filterFacetCount: this.getFilterFacetCount(!!query.filterField)
    };
  }

  private getFilterFacetCount(isFoldingEnabled: boolean) {
    if (Utils.isUndefined(this.options.filterFacetCount)) {
      return !isFoldingEnabled;
    }

    return this.options.filterFacetCount;
  }
}
