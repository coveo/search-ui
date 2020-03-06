import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { Assert } from '../misc/Assert';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { QueryEvents } from '../events/QueryEvents';
import { findIndex } from 'underscore';
import { IQueryResults } from '../rest/QueryResults';
import { IDynamicFacet } from '../ui/DynamicFacet/IDynamicFacet';
import { DynamicFacetRequestBuilder } from './DynamicFacetRequestBuilder';
import { IQuery } from '../rest/Query';

export class DynamicFacetQueryController {
  protected requestBuilder: DynamicFacetRequestBuilder;
  private numberOfValuesToRequest: number;
  protected freezeCurrentValues = false;
  private freezeFacetOrder = false;
  protected preventAutoSelection = false;

  constructor(protected facet: IDynamicFacet) {
    this.requestBuilder = new DynamicFacetRequestBuilder({
      facetId: this.facet.options.id,
      field: this.facet.fieldName,
      type: this.facet.facetType,
      sortCriteria: this.facet.options.sortCriteria,
      injectionDepth: this.facet.options.injectionDepth,
      filterFacetCount: this.facet.options.filterFacetCount
    });
    this.resetNumberOfValuesToRequest();
    this.resetFlagsDuringQuery();
  }

  private resetFlagsDuringQuery() {
    this.facet.bind.onRootElement(QueryEvents.duringQuery, () => {
      this.freezeCurrentValues = false;
      this.freezeFacetOrder = false;
      this.preventAutoSelection = false;
    });
  }

  public increaseNumberOfValuesToRequest(additionalNumberOfValues: number) {
    this.numberOfValuesToRequest += additionalNumberOfValues;
  }

  public resetNumberOfValuesToRequest() {
    this.numberOfValuesToRequest = this.facet.options.numberOfValues;
  }

  public enablePreventAutoSelectionFlag() {
    this.preventAutoSelection = true;
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

    queryBuilder.facetRequests.push(this.buildFacetRequest(queryBuilder.build()));
    if (this.freezeFacetOrder) {
      queryBuilder.facetOptions.freezeFacetOrder = true;
    }
  }

  public buildFacetRequest(query: IQuery): IFacetRequest {
    return {
      ...this.requestBuilder.buildBaseRequestForQuery(query),
      currentValues: this.currentValues,
      numberOfValues: this.numberOfValues,
      freezeCurrentValues: this.freezeCurrentValues,
      preventAutoSelect: this.preventAutoSelection,
      isFieldExpanded: this.numberOfValuesToRequest > this.facet.options.numberOfValues
    };
  }

  public getQueryResults(): Promise<IQueryResults> {
    const query = this.facet.queryController.getLastQuery();
    // Specifying a numberOfResults of 0 will not log the query as a full fledged query in the API
    // it will also alleviate the load on the index
    query.numberOfResults = 0;

    const previousFacetRequestIndex = findIndex(query.facets, { facetId: this.facet.options.id });
    if (previousFacetRequestIndex !== -1) {
      query.facets[previousFacetRequestIndex] = this.buildFacetRequest(query);
    } else if (query.facets) {
      query.facets.push(this.buildFacetRequest(query));
    } else {
      query.facets = [this.buildFacetRequest(query)];
    }

    return this.facet.queryController.getEndpoint().search(query);
  }

  protected get currentValues(): IFacetRequestValue[] {
    return this.facet.values.allFacetValues.map(({ value, state }) => ({
      value,
      state,
      // TODO: remove after SEARCHAPI-4233 is completed
      preventAutoSelect: this.preventAutoSelection
    }));
  }

  protected get numberOfValues() {
    if (this.freezeCurrentValues) {
      return this.currentValues.length;
    }

    return Math.max(this.numberOfValuesToRequest, this.facet.values.activeValues.length);
  }
}
