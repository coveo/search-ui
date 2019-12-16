import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { Assert } from '../misc/Assert';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { FacetSortCriteria } from '../rest/Facet/FacetSortCriteria';
import { QueryEvents } from '../events/QueryEvents';
import { findIndex } from 'underscore';
import { IQueryResults } from '../rest/QueryResults';
import { IDynamicFacet } from '../ui/DynamicFacet/IDynamicFacet';

export class DynamicFacetQueryController {
  private numberOfValuesToRequest: number;
  private freezeCurrentValues = false;
  private freezeFacetOrder = false;

  constructor(protected facet: IDynamicFacet) {
    this.resetNumberOfValuesToRequest();
    this.resetFreezeCurrentValuesDuringQuery();
  }

  private resetFreezeCurrentValuesDuringQuery() {
    this.facet.bind.onRootElement(QueryEvents.duringQuery, () => {
      this.freezeCurrentValues = false;
      this.freezeFacetOrder = false;
    });
  }

  public increaseNumberOfValuesToRequest(additionalNumberOfValues: number) {
    this.numberOfValuesToRequest += additionalNumberOfValues;
  }

  public resetNumberOfValuesToRequest() {
    this.numberOfValuesToRequest = this.facet.options.numberOfValues;
  }

  public enableFreezeCurrentValuesFlag() {
    if (this.areValuesIncorrectlyAffectedByDependsOn) {
      return;
    }

    this.freezeCurrentValues = true;
  }

  public enableFreezeFacetOrderFlag() {
    this.freezeFacetOrder = true;
  }

  private get areValuesIncorrectlyAffectedByDependsOn() {
    if (!this.facet.dependsOnManager.hasDependentFacets) {
      return false;
    }

    if (this.facet.dependsOnManager.dependentFacetsHaveSelectedValues) {
      return false;
    }

    return this.currentValues.length < this.numberOfValuesToRequest;
  }

  /**
   * Build the facets request for the DynamicFacet, and insert it in the query builder
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
      sortCriteria: this.facet.options.sortCriteria as FacetSortCriteria,
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      freezeCurrentValues: this.freezeCurrentValues,
      isFieldExpanded: this.numberOfValuesToRequest > this.facet.options.numberOfValues,
      injectionDepth: this.facet.options.injectionDepth
    };
  }

  public getQueryResults(): Promise<IQueryResults> {
    const query = this.facet.queryController.getLastQuery();
    // Specifying a numberOfResults of 0 will not log the query as a full fledged query in the API
    // it will also alleviate the load on the index
    query.numberOfResults = 0;

    const previousFacetRequestIndex = findIndex(query.facets, { facetId: this.facet.options.id });
    if (previousFacetRequestIndex !== -1) {
      query.facets[previousFacetRequestIndex] = this.facetRequest;
    } else if (query.facets) {
      query.facets.push(this.facetRequest);
    } else {
      query.facets = [this.facetRequest];
    }

    return this.facet.queryController.getEndpoint().search(query);
  }

  protected get currentValues(): IFacetRequestValue[] {
    return this.facet.values.allFacetValues.map(({ value, state, preventAutoSelect }) => ({
      value,
      state,
      preventAutoSelect
    }));
  }

  protected get numberOfValues() {
    if (this.freezeCurrentValues) {
      return this.currentValues.length;
    }

    return Math.max(this.numberOfValuesToRequest, this.facet.values.activeValues.length);
  }
}
