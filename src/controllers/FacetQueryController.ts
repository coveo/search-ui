/// <reference path='../ui/Facet/Facet.ts' />

import { Facet } from '../ui/Facet/Facet';
import { IGroupByRequest } from '../rest/GroupByRequest';
import { IGroupByResult } from '../rest/GroupByResult';
import { ExpressionBuilder } from '../ui/Base/ExpressionBuilder';
import { FacetValue } from '../ui/Facet/FacetValues';
import { Utils } from '../utils/Utils';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { FacetSearchParameters } from '../ui/Facet/FacetSearchParameters';
import { Assert } from '../misc/Assert';
import { IIndexFieldValue } from '../rest/FieldValue';
import { FacetUtils } from '../ui/Facet/FacetUtils';
import { IQueryResults } from '../rest/QueryResults';
import { IGroupByValue } from '../rest/GroupByValue';
import { IEndpointError } from '../rest/EndpointError';
import { IQueryBuilderExpression } from '../ui/Base/QueryBuilder';
import * as _ from 'underscore';

export class FacetQueryController {
  public expressionToUseForFacetSearch: string;
  public basicExpressionToUseForFacetSearch: string;
  public advancedExpressionToUseForFacetSearch: string;
  public constantExpressionToUseForFacetSearch: string;
  public lastGroupByRequestIndex: number;
  public lastGroupByRequest: IGroupByRequest;
  public lastGroupByResult: IGroupByResult;

  private currentSearchPromise: Promise<IQueryResults>;

  constructor(public facet: Facet) {}

  /**
   * Reset the expression for the facet search, used when a new query is triggered
   */
  public prepareForNewQuery() {
    this.lastGroupByRequestIndex = undefined;
    this.expressionToUseForFacetSearch = undefined;
    this.constantExpressionToUseForFacetSearch = undefined;
  }

  /**
   * Compute the filter expression that the facet needs to output for the query
   * @returns {string}
   */
  public computeOurFilterExpression(): string {
    const builder = new ExpressionBuilder();
    const selected = this.facet.values.getSelected();
    if (selected.length > 0) {
      if (this.facet.options.useAnd) {
        _.each(selected, (value: FacetValue) => {
          builder.addFieldExpression(<string>this.facet.options.field, '==', [value.value]);
        });
      } else {
        builder.addFieldExpression(<string>this.facet.options.field, '==', _.map(selected, (value: FacetValue) => value.value));
      }
    }
    const excluded = this.facet.values.getExcluded();
    if (excluded.length > 0) {
      builder.addFieldNotEqualExpression(<string>this.facet.options.field, _.map(excluded, (value: FacetValue) => value.value));
    }
    if (Utils.isNonEmptyString(this.facet.options.additionalFilter)) {
      builder.add(this.facet.options.additionalFilter);
    }
    return builder.build();
  }

  /**
   * Build the group by request for the facet, and insert it in the query builder
   * @param queryBuilder
   */
  public putGroupByIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);

    const allowedValues = this.createGroupByAllowedValues();
    const groupByRequest = this.createBasicGroupByRequest(allowedValues);

    const queryOverrideObject = this.createGroupByQueryOverride(queryBuilder);
    if (!Utils.isNullOrUndefined(queryOverrideObject)) {
      groupByRequest.queryOverride = queryOverrideObject.basic;
      groupByRequest.advancedQueryOverride = queryOverrideObject.advanced;
      groupByRequest.constantQueryOverride = queryOverrideObject.constant;
      this.expressionToUseForFacetSearch = queryOverrideObject.withoutConstant;
      this.basicExpressionToUseForFacetSearch = queryOverrideObject.basic;
      this.advancedExpressionToUseForFacetSearch = queryOverrideObject.advanced;
      this.constantExpressionToUseForFacetSearch = queryOverrideObject.constant;
    } else {
      const parts = queryBuilder.computeCompleteExpressionParts();
      this.expressionToUseForFacetSearch = parts.withoutConstant == null ? '@uri' : parts.withoutConstant;
      this.basicExpressionToUseForFacetSearch = parts.basic == null ? '@uri' : parts.basic;
      this.advancedExpressionToUseForFacetSearch = parts.advanced;
      this.constantExpressionToUseForFacetSearch = parts.constant;
    }
    this.lastGroupByRequestIndex = queryBuilder.groupByRequests.length;
    this.lastGroupByRequest = groupByRequest;
    queryBuilder.groupByRequests.push(groupByRequest);
  }

  /**
   * Search inside the facet, using a group by request
   * @param params
   * @param oldLength Optional params, used by the search method to call itself recursively to fetch all required values
   * @returns {Promise|Promise<T>}
   */
  public search(params: FacetSearchParameters, oldLength = params.nbResults): Promise<IIndexFieldValue[]> {
    // For search, we want to retrieve the exact values we requested, and not additional ones
    params.completeFacetWithStandardValues = false;
    return new Promise((resolve, reject) => {
      const onResult = (fieldValues?: IIndexFieldValue[]) => {
        const newLength = fieldValues.length;
        fieldValues = this.checkForFacetSearchValuesToRemove(fieldValues, params.valueToSearch);
        if (FacetUtils.needAnotherFacetSearch(fieldValues.length, newLength, oldLength, 5)) {
          // This means that we removed enough values from the returned one that we need to perform a new search with more values requested.
          params.nbResults += 5;
          return this.search(params, fieldValues.length);
        } else {
          resolve(fieldValues);
        }
      };

      const searchPromise = this.facet.getEndpoint().search(params.getQuery());
      this.currentSearchPromise = searchPromise;

      searchPromise
        .then((queryResults: IQueryResults) => {
          if (this.currentSearchPromise == searchPromise) {
            // params.getQuery() will generate a query for all excluded values + some new values
            // there is no clean way to do a group by and remove some values
            // so instead we request more values than we need, and crop all the one we don't want
            const valuesCropped: IGroupByValue[] = [];
            if (queryResults.groupByResults && queryResults.groupByResults[0]) {
              _.each(queryResults.groupByResults[0].values, (v: IGroupByValue) => {
                if (v.lookupValue) {
                  if (!_.contains(params.alwaysExclude, v.lookupValue.toLowerCase())) {
                    valuesCropped.push(v);
                  }
                } else {
                  if (!_.contains(params.alwaysExclude, v.value.toLowerCase())) {
                    valuesCropped.push(v);
                  }
                }
              });
            }
            onResult(_.first(valuesCropped, params.nbResults));
          } else {
            reject();
          }
        })
        .catch((error: IEndpointError) => {
          reject(error);
        });
    });
  }

  public fetchMore(numberOfValuesToFetch: number): Promise<IQueryResults> {
    const params = new FacetSearchParameters(this.facet);
    params.alwaysInclude = this.facet.options.allowedValues || _.pluck(this.facet.values.getAll(), 'value');
    params.nbResults = numberOfValuesToFetch;
    return this.facet
      .getEndpoint()
      .search(params.getQuery())
      .then((results: IQueryResults) => {
        if (this.facet.options.allowedValues && results && results.groupByResults && results.groupByResults[0]) {
          results.groupByResults[0].values = this.filterByAllowedValueOption(results.groupByResults[0].values);
        }
        return results;
      });
  }

  public searchInFacetToUpdateDelta(facetValues: FacetValue[]): Promise<IQueryResults> {
    const params = new FacetSearchParameters(this.facet);
    const query = params.getQuery();
    query.aq = this.computeOurFilterExpression();
    _.each(facetValues, (facetValue: FacetValue) => {
      facetValue.waitingForDelta = true;
    });
    query.groupBy = [this.createBasicGroupByRequest(_.map(facetValues, (facetValue: FacetValue) => facetValue.value))];
    query.groupBy[0].completeFacetWithStandardValues = false;
    return this.facet.getEndpoint().search(query);
  }

  protected createGroupByAllowedValues() {
    // if you want to keep displayed values next time, take all current values as allowed values
    // otherwise take only the selected value
    if (this.facet.options.allowedValues != undefined) {
      return this.facet.options.allowedValues;
    } else if (this.facet.options.customSort != undefined) {
      // If there is a custom sort, we still need to add selectedValues to the group by
      // Filter out duplicates with a lower case comparison on the value
      return this.getUnionWithCustomSortLowercase(this.facet.options.customSort, this.getAllowedValuesFromSelected());
    } else {
      return _.map(this.getAllowedValuesFromSelected(), (facetValue: FacetValue) => facetValue.value);
    }
  }

  private getUnionWithCustomSortLowercase(customSort: string[], facetValues: FacetValue[]) {
    // This will take the custom sort, compare it against the passed in facetValues
    // The comparison is lowercase.
    // The union of the 2 arrays with duplicated filtered out is returned.

    const toCompare = _.map(customSort, (val: string) => {
      return val.toLowerCase();
    });
    const filtered = _.chain(facetValues)
      .filter((facetValue: FacetValue) => {
        return !_.contains(toCompare, facetValue.value.toLowerCase());
      })
      .map((facetValue: FacetValue) => {
        return facetValue.value;
      })
      .value();
    return _.compact(customSort.concat(filtered));
  }

  protected getAllowedValuesFromSelected() {
    let facetValues: FacetValue[] = [];
    if (this.facet.options.useAnd || !this.facet.keepDisplayedValuesNextTime) {
      const selected = this.facet.values.getSelected();
      if (selected.length == 0) {
        return undefined;
      }
      facetValues = this.facet.values.getSelected();
    } else {
      facetValues = this.facet.values.getAll();
    }
    return facetValues;
  }

  private createGroupByQueryOverride(queryBuilder: QueryBuilder): IQueryBuilderExpression {
    const additionalFilter = this.facet.options.additionalFilter ? this.facet.options.additionalFilter : '';
    let queryOverrideObject: IQueryBuilderExpression = undefined;

    if (this.facet.options.useAnd || (this.facet.options.isMultiValueField && this.facet.values.hasSelectedAndExcludedValues())) {
      if (Utils.isNonEmptyString(additionalFilter)) {
        queryOverrideObject = queryBuilder.computeCompleteExpressionParts();
        if (Utils.isEmptyString(queryOverrideObject.basic)) {
          queryOverrideObject.basic = '@uri';
        }
      }
    } else {
      if (this.facet.values.hasSelectedOrExcludedValues()) {
        queryOverrideObject = queryBuilder.computeCompleteExpressionPartsExcept(this.computeOurFilterExpression());
        if (Utils.isEmptyString(queryOverrideObject.basic)) {
          queryOverrideObject.basic = '@uri';
        }
      } else {
        if (Utils.isNonEmptyString(additionalFilter)) {
          queryOverrideObject = queryBuilder.computeCompleteExpressionParts();
          if (Utils.isEmptyString(queryOverrideObject.basic)) {
            queryOverrideObject.basic = '@uri';
          }
        }
      }
    }

    if (queryOverrideObject) {
      if (Utils.isNonEmptyString(additionalFilter)) {
        queryOverrideObject.constant = queryOverrideObject.constant
          ? queryOverrideObject.constant + ' ' + additionalFilter
          : additionalFilter;
      }
    }
    _.each(_.keys(queryOverrideObject), k => {
      if (Utils.isEmptyString(queryOverrideObject[k]) || Utils.isNullOrUndefined(queryOverrideObject[k])) {
        delete queryOverrideObject[k];
      }
    });
    if (_.keys(queryOverrideObject).length == 0) {
      queryOverrideObject = undefined;
    }
    return queryOverrideObject;
  }

  protected createBasicGroupByRequest(allowedValues?: string[], addComputedField: boolean = true): IGroupByRequest {
    let nbOfRequestedValues = this.facet.numberOfValues;
    if (this.facet.options.customSort != null) {
      // If we have a custom sort, we need to make sure that we always request at least enough values to always receive them
      const usedValues = this.getUnionWithCustomSortLowercase(
        this.facet.options.customSort,
        this.facet.values.getSelected().concat(this.facet.values.getExcluded())
      );
      nbOfRequestedValues = Math.max(nbOfRequestedValues, usedValues.length);
    }
    const groupByRequest: IGroupByRequest = {
      field: <string>this.facet.options.field,
      maximumNumberOfValues: nbOfRequestedValues + (this.facet.options.enableMoreLess ? 1 : 0),
      sortCriteria: this.facet.options.sortCriteria,
      injectionDepth: this.facet.options.injectionDepth,
      completeFacetWithStandardValues: this.facet.options.allowedValues == undefined ? true : false
    };
    if (this.facet.options.lookupField) {
      groupByRequest.lookupField = <string>this.facet.options.lookupField;
    }
    if (allowedValues != null) {
      groupByRequest.allowedValues = allowedValues;
    }

    if (addComputedField && Utils.isNonEmptyString(<string>this.facet.options.computedField)) {
      groupByRequest.computedFields = [
        {
          field: <string>this.facet.options.computedField,
          operation: this.facet.options.computedFieldOperation
        }
      ];
    }
    return groupByRequest;
  }

  private checkForFacetSearchValuesToRemove(fieldValues: IIndexFieldValue[], valueToCheckAgainst: string) {
    const regex = FacetUtils.getRegexToUseForFacetSearch(valueToCheckAgainst, this.facet.options.facetSearchIgnoreAccents);

    return _.filter<IIndexFieldValue>(fieldValues, fieldValue => {
      const isAllowed = _.isEmpty(this.facet.options.allowedValues) || this.isValueAllowedByAllowedValueOption(fieldValue.value);
      const value = this.facet.getValueCaption(fieldValue);
      return isAllowed && regex.test(value);
    });
  }

  private filterByAllowedValueOption(values: IGroupByValue[]): IGroupByValue[] {
    return _.filter(values, (value: IGroupByValue) => this.isValueAllowedByAllowedValueOption(value.value));
  }

  private isValueAllowedByAllowedValueOption(value: string): boolean {
    // Allowed value option on the facet should support * (wildcard searches)
    // We need to filter values client side the index will completeWithStandardValues
    // Replace the wildcard (*) for a regex match (.*)
    // Also replace the (?) with "any character once" since it is also supported by the index
    return _.some(this.facet.options.allowedValues, allowedValue => {
      const regex = new RegExp(`^${allowedValue.replace(/\*/g, '.*').replace(/\?/g, '.')}$`, 'gi');
      return regex.test(value);
    });
  }
}
