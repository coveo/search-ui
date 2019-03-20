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

    const facetState: IFacetRequest = {
      field: this.facet.options.field.slice(1) as string,
      sortCriteria: this.facet.options.sortCriteria as FacetSortCriteria,
      currentValues: this.currentValues,
      numberOfValues: this.facet.options.numberOfValues, // TODO: manage more/less
      isSticky: false // TODO: manage isSticky
    };

    queryBuilder.facets.push(facetState);
  }

  private get currentValues(): IFacetRequestValue[] {
    return this.facet.values.allFacetValues.map(({ value, state }) => ({
      value,
      state
    }));
  }
}
