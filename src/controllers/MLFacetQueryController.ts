import { MLFacet } from '../ui/MLFacet/MLFacet';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { Assert } from '../misc/Assert';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { FacetSortCriteria } from '../rest/Facet/FacetSortCriteria';
import { QueryEvents } from '../events/QueryEvents';

export class MLFacetQueryController {
  private numberOfValuesToRequest: number;
  private freezeCurrentValues = false;

  constructor(private facet: MLFacet) {
    this.resetNumberOfValuesToRequest();
    this.resetFreezeCurrentValuesDuringQuery();
  }

  private resetFreezeCurrentValuesDuringQuery() {
    this.facet.bind.onRootElement(QueryEvents.duringQuery, () => (this.freezeCurrentValues = false));
  }

  public increaseNumberOfValuesToRequest(additionalNumberOfValues: number) {
    this.numberOfValuesToRequest += additionalNumberOfValues;
  }

  public resetNumberOfValuesToRequest() {
    this.numberOfValuesToRequest = this.facet.options.numberOfValues;
  }

  public enableFreezeCurrentValuesFlag() {
    this.freezeCurrentValues = true;
  }

  /**
   * Build the facets request for the MLFacet, and insert it in the query builder
   * @param queryBuilder
   */
  public putFacetIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);

    const facetRequest: IFacetRequest = {
      facetId: this.facet.options.id,
      field: this.facet.fieldName,
      sortCriteria: this.facet.options.sortCriteria as FacetSortCriteria,
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      freezeCurrentValues: this.freezeCurrentValues,
      isFieldExpanded: this.numberOfValuesToRequest > this.facet.options.numberOfValues
    };

    queryBuilder.facetRequests.push(facetRequest);
  }

  private get currentValues(): IFacetRequestValue[] {
    return this.facet.values.allFacetValues.map(({ value, state }) => ({
      value,
      state
    }));
  }

  private get numberOfValues() {
    if (this.freezeCurrentValues) {
      return this.currentValues.length;
    }

    return Math.max(this.numberOfValuesToRequest, this.facet.values.activeFacetValues.length);
  }
}
