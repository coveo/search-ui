import { IDynamicHierarchicalFacet } from '../ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { FacetSearchType, IFacetSearchRequest } from '../rest/Facet/FacetSearchRequest';
import { flatten } from 'underscore';
import { IFacetSearchResponse } from '../rest/Facet/FacetSearchResponse';
import { determineFilterFacetCount } from './DynamicFacetRequestBuilder';

export class HierarchicalFacetSearchController {
  private terms = '';
  private pageCount = 1;
  private numberOfValuesMultiplier = 2;

  public moreValuesAvailable = true;

  constructor(private facet: IDynamicHierarchicalFacet) {}

  private get ignoredPaths() {
    return [flatten(this.facet.values.selectedPath, true)];
  }

  private get numberOfValues() {
    return this.facet.options.numberOfValues * this.numberOfValuesMultiplier * this.pageCount;
  }

  private get request(): IFacetSearchRequest {
    return {
      field: this.facet.fieldName,
      filterFacetCount: determineFilterFacetCount(this.facet.options),
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

  private async triggerRequest() {
    const response = await this.facet.queryController.getEndpoint().facetSearch(this.request);
    this.moreValuesAvailable = response.moreValuesAvailable;
    return response;
  }

  public search(terms: string): Promise<IFacetSearchResponse> {
    this.terms = terms;
    this.pageCount = 1;
    return this.triggerRequest();
  }

  public fetchMoreResults(): Promise<IFacetSearchResponse> {
    this.pageCount++;
    return this.triggerRequest();
  }
}
