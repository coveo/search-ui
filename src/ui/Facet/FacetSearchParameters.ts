/// <reference path="Facet.ts" />

import {Facet} from './Facet';
import {Utils} from '../../utils/Utils';
import {FacetUtils} from './FacetUtils';
import {IGroupByRequest} from '../../rest/GroupByRequest';
import {IQuery} from '../../rest/Query';
import {QueryBuilder} from '../Base/QueryBuilder';
import {$$} from '../../utils/Dom';

export class FacetSearchParameters {
  public searchEvenIfEmpty: boolean;
  public nbResults: number;
  public ignoreAccents: boolean;
  public valueToSearch: string = '';
  public alwaysInclude: string[] = [];
  public alwaysExclude: string[] = [];
  public sortCriteria = 'occurrences';
  public fetchMore = false;

  constructor(public facet: Facet) {
    this.nbResults = facet.options.numberOfValuesInFacetSearch;
    this.ignoreAccents = facet.options.facetSearchIgnoreAccents;
    this.searchEvenIfEmpty = facet.searchInterface.isNewDesign();
  }

  public setValueToSearch(value: string) {
    this.valueToSearch = value;
    if (Utils.isNonEmptyString(value)) {
      this.alwaysInclude = this.alwaysInclude.concat(FacetUtils.getValuesToUseForSearchInFacet(this.valueToSearch, this.facet));
    }
    return this;
  }

  public excludeCurrentlyDisplayedValuesInSearch(searchResults: HTMLElement) {
    _.each(this.getCurrentlyShowedValueInSearch(searchResults), (v) => {
      var expandedValues = FacetUtils.getValuesToUseForSearchInFacet(v, this.facet);
      _.each(expandedValues, (expanded) => {
        this.alwaysExclude.push(expanded)
      })
    });
    _.each(this.facet.getDisplayedFacetValues(), (v) => {
      var expandedValues = FacetUtils.getValuesToUseForSearchInFacet(v.value, this.facet);
      _.each(expandedValues, (expanded) => {
        this.alwaysExclude.push(expanded);
      })
    })
  }

  public getGroupByRequest(): IGroupByRequest {
    this.lowerCaseAll();
    var nbResults = this.nbResults;
    if (this.facet.searchInterface.isNewDesign()) {
      nbResults += this.alwaysExclude.length;
    }

    var typedByUser = [];
    if (this.valueToSearch) {
      typedByUser = ['*' + this.valueToSearch + '*']
    }

    var request: IGroupByRequest = {
      allowedValues: typedByUser.concat(this.alwaysInclude).concat(this.alwaysExclude),
      maximumNumberOfValues: nbResults,
      completeFacetWithStandardValues: this.facet.options.lookupField ? false : true, // See : https://coveord.atlassian.net/browse/JSUI-728
      field: this.facet.options.field,
      sortCriteria: this.facet.options.sortCriteria || this.sortCriteria,
      injectionDepth: this.facet.options.injectionDepth,
    }

    if (this.facet.options.lookupField) {
      request.lookupField = this.facet.options.lookupField;
    }

    if (this.facet.options.computedField) {
      request.computedFields = [{
        field: this.facet.options.computedField,
        operation: this.facet.options.computedFieldOperation
      }]
    }
    return request;
  }

  public getQuery(): IQuery {
    var lastQuery = _.clone(this.facet.queryController.getLastQuery());
    if (!lastQuery) {
      // There should normally always be a last query available
      // If not, just create en empty one.
      lastQuery = new QueryBuilder().build();
    }
    lastQuery.q = this.facet.facetQueryController.expressionToUseForFacetSearch;
    lastQuery.cq = this.facet.facetQueryController.constantExpressionToUseForFacetSearch;
    lastQuery.aq = null;
    lastQuery.enableDidYouMean = false;
    lastQuery.firstResult = 0;
    lastQuery.numberOfResults = 0;
    lastQuery.fieldsToInclude = [];
    lastQuery.groupBy = [this.getGroupByRequest()];
    return lastQuery;
  }

  private getCurrentlyShowedValueInSearch(searchResults: HTMLElement) {
    return _.map($$(searchResults).findAll('.coveo-facet-value-caption'), (val) => {
      return $$(val).text();
    })
  }

  private lowerCaseAll() {
    this.alwaysExclude = _.chain(this.alwaysExclude)
      .map((v) => {
        return v.toLowerCase()
      })
      .uniq()
      .value();

    this.alwaysInclude = _.chain(this.alwaysInclude)
      .map((v) => {
        return v.toLowerCase()
      })
      .uniq()
      .value();
  }
}
