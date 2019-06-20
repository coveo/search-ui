import { IFacetSearchRequest } from '../rest/Facet/FacetSearchRequest';
import { DynamicFacet } from '../ui/DynamicFacet/DynamicFacet';

export class FacetSearchController {
  constructor(private facet: DynamicFacet) {}

  public search(query?: string) {
    const request: IFacetSearchRequest = {
      field: this.facet.fieldName,
      numberOfValues: this.facet.options.numberOfValues,
      ignoreValues: this.facet.values.allValues,
      captions: this.facet.options.valueCaption,
      searchContext: this.facet.queryController.getLastQuery(),
      query
    };

    return this.facet.queryController.getEndpoint().facetSearch(request);
  }
}
