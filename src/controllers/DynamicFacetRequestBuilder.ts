import { FacetType, IFacetRequest } from '../rest/Facet/FacetRequest';
import { FacetSortCriteria } from '../rest/Facet/FacetSortCriteria';
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

  public buildBaseRequestForQuery(): IFacetRequest {
    return {
      ...this.request,
      filterFacetCount: determineFilterFacetCount(this.request)
    };
  }
}

export function determineFilterFacetCount(options: { filterFacetCount?: boolean }) {
  const { filterFacetCount } = options;
  return Utils.isUndefined(filterFacetCount) ? true : filterFacetCount;
}
