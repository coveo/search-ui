import { MLFacet } from '../ui/MLFacet/MLFacet';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { Assert } from '../misc/Assert';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { FacetSortCriteria } from '../rest/Facet/FacetSortCriteria';

export class MLFacetQueryController {
  constructor(public facet: MLFacet) {}

  /**
   * Build the facets request for the MLFacet, and insert it in the query builder
   * @param queryBuilder
   */
  public putFacetIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);

    const facetRequest: IFacetRequest = {
      field: this.facet.fieldName,
      sortCriteria: this.facet.options.sortCriteria as FacetSortCriteria,
      currentValues: this.currentValues,
      numberOfValues: this.facet.options.numberOfValues, // TODO: manage more/less
      isSticky: false // TODO: manage isSticky
    };

    queryBuilder.facetRequests.push(facetRequest);
  }

  private get currentValues(): IFacetRequestValue[] {
    return this.facet.values.allFacetValues.map(({ value, state }) => ({
      value,
      state
    }));
  }
}
