import { IDynamicHierarchicalFacet } from '../ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { FacetSearchType, IFacetSearchRequest } from '../rest/Facet/FacetSearchRequest';
import { IFacetSearchResponse } from '../rest/Facet/FacetSearchResponse';
import { flatten } from 'underscore';

export class HierarchicalFacetSearchController {
  constructor(private facet: IDynamicHierarchicalFacet) {}

  private get ignoredPaths() {
    return [flatten(this.facet.values.selectedPath, true)];
  }

  public search(terms?: string): Promise<IFacetSearchResponse> {
    const request: IFacetSearchRequest = {
      field: this.facet.fieldName,
      type: FacetSearchType.hierarchical,
      numberOfValues: this.facet.options.numberOfValues,
      ignorePaths: this.ignoredPaths,
      basePath: this.facet.options.basePath,
      captions: this.facet.options.valueCaption,
      searchContext: this.facet.queryController.getLastQuery(),
      delimitingCharacter: this.facet.options.delimitingCharacter,
      query: terms.length ? `*${terms}*` : '*'
    };

    return this.facet.queryController.getEndpoint().facetSearch(request);
  }
}
