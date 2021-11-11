import { isUndefined } from 'underscore';
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
  constructor(private request: IFacetRequest) {}

  public buildBaseRequestForQuery(query: IQuery): IFacetRequest {
    return {
      ...this.request,
      filterFacetCount: this.getFilterFacetCount(!!query.filterField)
    };
  }

  private getFilterFacetCount(isFoldingEnabled: boolean) {
    if (Utils.isUndefined(this.request.filterFacetCount)) {
      return !isFoldingEnabled;
    }

    return this.request.filterFacetCount;
  }
}

export function determineFilterFacetCount(options: { filterFacetCount?: boolean }) {
  const { filterFacetCount } = options;
  return isUndefined(filterFacetCount) ? true : filterFacetCount;
}
