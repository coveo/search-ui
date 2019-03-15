import { MLFacet } from '../ui/MLFacet/MLFacet';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { Assert } from '../misc/Assert';
import { IFacetRequest } from '../rest/Facet/FacetRequest';

export class MLFacetQueryController {
  constructor(public facet: MLFacet) {}

  /**
   * Build the facets request for the MLFacet, and insert it in the query builder
   * @param queryBuilder
   */
  public putFacetsIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);

    const facets: IFacetRequest = {
      field: this.facet.options.field as string
      // TODO: Add more parameters
    };

    queryBuilder.facets.push(facets);
  }
}
