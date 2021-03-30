/// <reference path="Facet.ts" />

import { Facet } from './Facet';
import { Utils } from '../../utils/Utils';
import { FacetUtils } from './FacetUtils';
import { IGroupByRequest } from '../../rest/GroupByRequest';
import { IQuery } from '../../rest/Query';
import { QueryBuilder } from '../Base/QueryBuilder';
import { $$ } from '../../utils/Dom';
import { chain, map, uniq, each, compact, clone } from 'underscore';
import { AllowedValuesPatternType } from '../../rest/AllowedValuesPatternType';

export class FacetSearchParameters {
  public nbResults: number;
  public ignoreAccents: boolean;
  public valueToSearch: string = '';
  public alwaysInclude: string[] = [];
  public alwaysExclude: string[] = [];
  public sortCriteria = 'occurrences';
  public fetchMore = false;
  public completeFacetWithStandardValues = true;

  constructor(public facet: Facet) {
    this.nbResults = facet.options.numberOfValuesInFacetSearch;
    this.ignoreAccents = facet.options.facetSearchIgnoreAccents;
  }

  public setValueToSearch(value: string) {
    this.valueToSearch = value;
    if (Utils.isNonEmptyString(value)) {
      this.valueToSearch = this.valueToSearch.trim();
      this.alwaysInclude = this.alwaysInclude.concat(FacetUtils.getValuesToUseForSearchInFacet(this.valueToSearch, this.facet));
    }
    return this;
  }

  public excludeCurrentlyDisplayedValuesInSearch(searchResults: HTMLElement) {
    each(this.getCurrentlyShowedValueInSearch(searchResults), v => {
      const expandedValues = FacetUtils.getValuesToUseForSearchInFacet(v, this.facet);
      each(expandedValues, expanded => {
        this.alwaysExclude.push(expanded);
      });
    });
    each(this.facet.getDisplayedFacetValues(), v => {
      this.alwaysExclude.push(v.value);
    });
  }

  public getGroupByRequest(): IGroupByRequest {
    this.lowerCaseAll();
    let nbResults = this.nbResults;
    nbResults += this.alwaysExclude.length;

    let typedByUser = [];
    if (this.valueToSearch) {
      typedByUser = ['*' + this.valueToSearch + '*'];
    }

    let allowedValues;
    if (this.valueToSearch) {
      allowedValues = typedByUser.concat(this.alwaysInclude).concat(this.alwaysExclude);
    } else {
      allowedValues = compact(typedByUser.concat(this.alwaysInclude).concat(this.facet.options.allowedValues));
    }

    let completeFacetWithStandardValues = this.completeFacetWithStandardValues;
    if (this.facet.options.lookupField != null) {
      completeFacetWithStandardValues = false;
    }

    const request: IGroupByRequest = {
      allowedValues,
      allowedValuesPatternType: this.facet.options.useWildcardsInFacetSearch
        ? AllowedValuesPatternType.Wildcards
        : AllowedValuesPatternType.Legacy,
      maximumNumberOfValues: nbResults,
      completeFacetWithStandardValues: completeFacetWithStandardValues,
      field: <string>this.facet.options.field,
      sortCriteria: this.facet.options.sortCriteria || this.sortCriteria,
      injectionDepth: this.facet.options.injectionDepth
    };

    if (this.facet.options.lookupField) {
      request.lookupField = <string>this.facet.options.lookupField;
    }

    if (this.facet.options.computedField) {
      request.computedFields = [
        {
          field: <string>this.facet.options.computedField,
          operation: this.facet.options.computedFieldOperation
        }
      ];
    }
    return request;
  }

  public getQuery(): IQuery {
    let lastQuery = clone(this.facet.queryController.getLastQuery());
    if (!lastQuery) {
      // There should normally always be a last query available
      // If not, just create an empty one.
      lastQuery = new QueryBuilder().build();
    }
    // We want to always force query syntax to true for a facet search,
    // but arrange for the basic expression to adapt itself with no syntax block
    if (lastQuery.enableQuerySyntax) {
      lastQuery.q = this.facet.facetQueryController.basicExpressionToUseForFacetSearch;
    } else if (Utils.isNonEmptyString(this.facet.facetQueryController.basicExpressionToUseForFacetSearch)) {
      lastQuery.q = `<@- ${this.facet.facetQueryController.basicExpressionToUseForFacetSearch} -@>`;
    } else {
      lastQuery.q = '';
    }

    lastQuery.enableQuerySyntax = true;
    lastQuery.cq = this.facet.facetQueryController.constantExpressionToUseForFacetSearch;
    lastQuery.aq = this.facet.facetQueryController.advancedExpressionToUseForFacetSearch;
    lastQuery.enableDidYouMean = false;
    lastQuery.firstResult = 0;
    lastQuery.numberOfResults = 0;
    lastQuery.fieldsToInclude = [];
    lastQuery.groupBy = [this.getGroupByRequest()];
    return lastQuery;
  }

  private getCurrentlyShowedValueInSearch(searchResults: HTMLElement) {
    return map($$(searchResults).findAll('.coveo-facet-value-caption'), val => {
      return $$(val).getAttribute('data-original-value') || $$(val).text();
    });
  }

  private lowerCaseAll() {
    this.alwaysExclude = this.convertToLowercase(this.alwaysExclude);
    this.alwaysInclude = this.convertToLowercase(this.alwaysInclude);
  }

  private convertToLowercase(arr: string[]) {
    const lowercase = chain(arr)
      .map(v => v.toLowerCase())
      .value();
    return uniq(lowercase);
  }
}
