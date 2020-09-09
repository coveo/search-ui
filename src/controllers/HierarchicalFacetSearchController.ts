import { IDynamicHierarchicalFacet } from '../ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { FacetSearchType, IFacetSearchRequest } from '../rest/Facet/FacetSearchRequest';
import { flatten } from 'underscore';

export class HierarchicalFacetSearchController {
  private page = 1;
  private terms = '';
  private numberOfValuesMultiplier = 2;

  constructor(private facet: IDynamicHierarchicalFacet) {}

  private get ignoredPaths() {
    return [flatten(this.facet.values.selectedPath, true)];
  }

  private get numberOfValues() {
    return this.facet.values.allFacetValues.length * this.numberOfValuesMultiplier * this.page;
  }

  private get request(): IFacetSearchRequest {
    return {
      field: this.facet.fieldName,
      type: FacetSearchType.hierarchical,
      numberOfValues: this.numberOfValues,
      ignorePaths: this.ignoredPaths,
      basePath: this.facet.options.basePath,
      captions: this.facet.options.valueCaption,
      searchContext: this.facet.queryController.getLastQuery(),
      delimitingCharacter: this.facet.options.delimitingCharacter,
      query: this.terms.length ? `*${this.terms}*` : '*'
    };
  }

  public moreValuesAvailable = true;

  public async search(terms: string) {
    this.terms = terms;
    this.page = 1;

    const response = await this.facet.queryController.getEndpoint().facetSearch(this.request);
    this.moreValuesAvailable = response.moreValuesAvailable;
    return response;
  }

  public async fetchMoreResults() {
    this.page++;

    const response = await this.facet.queryController.getEndpoint().facetSearch(this.request);
    this.moreValuesAvailable = response.moreValuesAvailable;
    return response;
  }
}
