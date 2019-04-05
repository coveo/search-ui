import { MLFacet } from '../ui/MLFacet/MLFacet';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { Assert } from '../misc/Assert';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { FacetSortCriteria } from '../rest/Facet/FacetSortCriteria';

export class MLFacetQueryController {
  private numberOfValues: number;
  private freezeCurrentValues = false;

  constructor(private facet: MLFacet) {
    this.resetNumberOfValues();
  }

  public increaseNumberOfValues(additionalNumberOfValues: number) {
    this.numberOfValues += additionalNumberOfValues;
  }

  public resetNumberOfValues() {
    this.numberOfValues = this.facet.options.numberOfValues;
  }

  /**
   * Tells the API that the current facet values should be returned in the same order or not.
   * For usability purposes, the facet values will not move when interacted with.
   */
  public setFreezeCurrentValuesFlag(freezeCurrentValues: boolean) {
    this.freezeCurrentValues = freezeCurrentValues;
  }

  private get numberOfValuesToRequest() {
    if (this.freezeCurrentValues) {
      return this.currentValues.length;
    }

    // TODO: Put this back?
    // return Math.max(this.numberOfValues, this.facet.values.selectedValues.length);
    return this.numberOfValues;
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
      numberOfValues: this.numberOfValuesToRequest,
      freezeCurrentValues: this.freezeCurrentValues
    };

    queryBuilder.facetRequests.push(facetRequest);
    this.setFreezeCurrentValuesFlag(false);
  }

  private get currentValues(): IFacetRequestValue[] {
    return this.facet.values.allFacetValues.map(({ value, state }) => ({
      value,
      state
    }));
  }
}
