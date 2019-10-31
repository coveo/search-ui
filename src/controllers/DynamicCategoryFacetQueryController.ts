import { CategoryFacet } from '../ui/CategoryFacet/CategoryFacet';
import { Assert } from '../misc/Assert';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { IFacetRequest, IFacetRequestValue } from '../rest/Facet/FacetRequest';
import { QueryEvents } from '../events/QueryEvents';
import { FacetValueState } from '../rest/Facet/FacetValueState';

// TODO: Create a real class and move in a separate file
export type CategoryFacetValue = {
  value: string;
  displayValue: string;
  state: FacetValueState;
  numberOfResults: number;
  moreValuesAvailable: boolean;
  preventAutoSelect: boolean;
  children: CategoryFacetValue[];
}

// TODO: rename to simply CategoryFacetQueryController
export class DynamicCategoryFacetQueryController {
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

  public putFacetIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);

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
      numberOfValues: this.numberOfValuesToRequest,
      delimitingCharacter: this.facet.options.delimitingCharacter,
      isFieldExpanded: this.numberOfValuesToRequest > this.facet.options.numberOfValues
    };
  }

  public get currentValues(): IFacetRequestValue[] {
    return this.facet.values.allFacetValues.map(requestValue => this.buildRequestValue(requestValue));
  }

  private buildRequestValue(facetValue: CategoryFacetValue): IFacetRequestValue {
    return {
      value: facetValue.value,
      state: facetValue.state,
      preventAutoSelect: facetValue.preventAutoSelect,
      children: facetValue.children.map(requestValue => this.buildRequestValue(requestValue)),
      retrieveChildren: this.shouldRetrieveChildren(facetValue),
      retrieveCount: 3, // TODO: Move numberOfValuesToRequest to every child values
    }
  }

  private shouldRetrieveChildren(facetValue: CategoryFacetValue) {
    return !facetValue.children.length && facetValue.state === FacetValueState.selected;
  }
}
