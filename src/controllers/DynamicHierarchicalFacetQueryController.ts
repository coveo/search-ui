import { Assert } from '../misc/Assert';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { QueryEvents } from '../events/QueryEvents';
import { FacetValueState } from '../rest/Facet/FacetValueState';
import { IQueryResults } from '../rest/QueryResults';
import { findIndex } from 'underscore';
import { IDynamicHierarchicalFacet, IDynamicHierarchicalFacetValue } from '../ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { Utils } from '../utils/Utils';

export class DynamicHierarchicalFacetQueryController {
  private numberOfValuesToRequest: number;
  private freezeFacetOrder = false;
  private hasFolding = false;

  constructor(private facet: IDynamicHierarchicalFacet) {
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

  public enableFreezeFacetOrderFlag() {
    this.freezeFacetOrder = true;
  }

  public putFacetIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);

    this.hasFolding = !!queryBuilder.filterField;

    queryBuilder.facetRequests.push(this.facetRequest);
    if (this.freezeFacetOrder) {
      queryBuilder.facetOptions.freezeFacetOrder = this.freezeFacetOrder;
    }
  }

  public get facetRequest(): IFacetRequest {
    return {
      facetId: this.facet.options.id,
      field: this.facet.fieldName,
      type: this.facet.facetType,
      currentValues: this.currentValues,
      numberOfValues: this.facet.values.hasSelectedValue ? 1 : this.numberOfValuesToRequest,
      delimitingCharacter: this.facet.options.delimitingCharacter,
      isFieldExpanded: this.numberOfValuesToRequest > this.facet.options.numberOfValues,
      injectionDepth: this.facet.options.injectionDepth,
      filterFacetCount: this.filterFacetCount
    };
  }

  public getQueryResults(): Promise<IQueryResults> {
    const query = this.facet.queryController.getLastQuery();
    // Specifying a numberOfResults of 0 will not log the query as a full fledged query in the API
    // it will also alleviate the load on the index
    query.numberOfResults = 0;

    this.hasFolding = !!query.filterField;

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

  protected get filterFacetCount() {
    if (Utils.isUndefined(this.facet.options.filterFacetCount)) {
      return !this.hasFolding;
    }

    return this.facet.options.filterFacetCount;
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
      preventAutoSelect: facetValue.preventAutoSelect,
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
