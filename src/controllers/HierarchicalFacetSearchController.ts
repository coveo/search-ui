import { IDynamicHierarchicalFacet, IDynamicHierarchicalFacetValue } from '../ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { FacetSearchType, IFacetSearchRequest } from '../rest/Facet/FacetSearchRequest';
import { IFacetSearchResponse } from '../rest/Facet/FacetSearchResponse';
import { flatten } from 'underscore';

type Path = string[];

export class HierarchicalFacetSearchController {
  constructor(private facet: IDynamicHierarchicalFacet) {}

  private getAllPaths(value: IDynamicHierarchicalFacetValue): Path[] {
    return [value.path, ...this.flattenPaths(value.children.map(child => this.getAllPaths(child)))];
  }

  private flattenPaths(value: Path[][]): Path[] {
    return flatten(value, true);
  }

  public search(terms?: string): Promise<IFacetSearchResponse> {
    const request: IFacetSearchRequest = {
      field: this.facet.fieldName,
      type: FacetSearchType.hierarchical,
      numberOfValues: this.facet.options.numberOfValues,
      basePath: this.facet.options.basePath,
      captions: this.facet.options.valueCaption,
      searchContext: this.facet.queryController.getLastQuery(),
      delimitingCharacter: this.facet.options.delimitingCharacter,
      query: terms.length ? `*${terms}*` : '*'
    };

    return this.facet.queryController.getEndpoint().facetSearch(request);
  }
}
