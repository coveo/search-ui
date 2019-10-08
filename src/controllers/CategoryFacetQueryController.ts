import { CategoryFacet } from '../ui/CategoryFacet/CategoryFacet';
import { Assert } from '../misc/Assert';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { IFacetRequest } from '../rest/Facet/FacetRequest';
import { QueryEvents } from '../events/QueryEvents';

// IDEA: maybe this could simply extend the DynamicFacetQueryController with only a few modifications
export class CategoryFacetQueryController {
  private numberOfValuesToRequest: number;
  private freezeFacetOrder = false;

  constructor(private facet: CategoryFacet) {
    this.resetNumberOfValuesToRequest();
    this.resetFreezeCurrentValuesDuringQuery();
  }

  private resetFreezeCurrentValuesDuringQuery() {
    this.facet.bind.onRootElement(QueryEvents.duringQuery, () => {
      this.freezeFacetOrder = false;
    });
  }

  public increaseNumberOfValuesToRequest(additionalNumberOfValues: number) {
    this.numberOfValuesToRequest += additionalNumberOfValues;
  }

  public resetNumberOfValuesToRequest() {
    this.numberOfValuesToRequest = this.facet.options.numberOfValues;
  }

  /**
   * Build the facets request for the CategoryFacet, and insert it in the query builder
   * @param queryBuilder
   */
  public putFacetIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);

    queryBuilder.facetRequests.push(this.facetRequest);
    if (this.freezeFacetOrder) {
      queryBuilder.facetOptions.freezeFacetOrder = true;
    }
  }

  public get facetRequest(): IFacetRequest {
    return {
      facetId: this.facet.options.id,
      field: this.facet.fieldName,
      type: this.facet.facetType,
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      delimitingCharacter: this.facet.options.delimitingCharacter,
      isFieldExpanded: this.numberOfValuesToRequest > this.facet.options.numberOfValues
    };
  }

  public get currentValues() {
    // TODO: map current values
    return [];
  }

  private get numberOfValues() {
    // TODO: consider current facet values
    return this.numberOfValuesToRequest;
  }
}
