import { Assert } from '../misc/Assert';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { QueryEvents } from '../events/QueryEvents';
import { FacetValueState } from '../rest/Facet/FacetValueState';
import { IQueryResults } from '../rest/QueryResults';
import { findIndex } from 'underscore';
import { IDynamicHierarchicalFacet, IDynamicHierarchicalFacetValue } from '../ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { DynamicFacetRequestBuilder } from './DynamicFacetRequestBuilder';
import { IQuery } from '../rest/Query';
import { FacetSortCriteria } from '../rest/Facet/FacetSortCriteria';

export class DynamicHierarchicalFacetQueryController {
  private requestBuilder: DynamicFacetRequestBuilder;
  private numberOfValuesToRequest: number;
  private freezeFacetOrder = false;
  private preventAutoSelection = false;

  constructor(private facet: IDynamicHierarchicalFacet) {
    this.requestBuilder = new DynamicFacetRequestBuilder({
      facetId: this.facet.options.id,
      field: this.facet.fieldName,
      type: this.facet.facetType,
      sortCriteria: <FacetSortCriteria>this.facet.options.sortCriteria,
      injectionDepth: this.facet.options.injectionDepth,
      delimitingCharacter: this.facet.options.delimitingCharacter,
      filterFacetCount: this.facet.options.filterFacetCount,
      basePath: this.facet.options.basePath,
      // TODO: add configurable option when API has fixed the facet value issue
      filterByBasePath: false
    });
    this.resetNumberOfValuesToRequest();
    this.resetFlagsDuringQuery();
  }

  private resetFlagsDuringQuery() {
    this.facet.bind.onRootElement(QueryEvents.duringQuery, () => {
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

  public enableFreezeFacetOrderFlag() {
    this.freezeFacetOrder = true;
  }

  public enablePreventAutoSelectionFlag() {
    this.preventAutoSelection = true;
  }

  public putFacetIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);

    queryBuilder.facetRequests.push(this.buildFacetRequest(queryBuilder.build()));
    if (this.freezeFacetOrder) {
      queryBuilder.facetOptions.freezeFacetOrder = this.freezeFacetOrder;
    }
  }

  public buildFacetRequest(query: IQuery): IFacetRequest {
    return {
      ...this.requestBuilder.buildBaseRequestForQuery(query),
      currentValues: this.currentValues,
      preventAutoSelect: this.preventAutoSelection,
      numberOfValues: this.facet.values.hasSelectedValue ? 1 : this.numberOfValuesToRequest,
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

  private get currentValues(): IFacetRequestValue[] {
    return this.facet.values.hasSelectedValue
      ? this.facet.values.allFacetValues.map(requestValue => this.buildRequestValue(requestValue))
      : [];
  }

  private buildRequestValue(facetValue: IDynamicHierarchicalFacetValue): IFacetRequestValue {
    return {
      value: facetValue.value,
      state: facetValue.state,
      children: this.childrenForFacetValue(facetValue),
      retrieveChildren: this.shouldRetrieveChildren(facetValue),
      retrieveCount: facetValue.retrieveCount
    };
  }

  private childrenForFacetValue(facetValue: IDynamicHierarchicalFacetValue) {
    return this.shouldRetrieveChildren(facetValue) ? [] : facetValue.children.map(requestValue => this.buildRequestValue(requestValue));
  }

  private shouldRetrieveChildren(facetValue: IDynamicHierarchicalFacetValue) {
    return facetValue.state === FacetValueState.selected;
  }
}
