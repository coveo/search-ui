/// <reference path="../ui/FacetRange/FacetRange.ts" />

import {FacetQueryController} from './FacetQueryController';
import {FacetRange} from '../ui/FacetRange/FacetRange';
import {Utils} from '../utils/Utils';
import {IGroupByRequest} from '../rest/GroupByRequest';
import {IRangeValue} from '../rest/RangeValue';
import {DateUtils} from '../utils/DateUtils';

export class FacetRangeQueryController extends FacetQueryController {
  public graphGroupByQueriesIndex: number;

  constructor(public facet: FacetRange) {
    super(facet);
  }

  protected createBasicGroupByRequest(allowedValues?: string[], addComputedField: boolean = true) {
    var groupByQuery = super.createBasicGroupByRequest(null, addComputedField);
    groupByQuery.allowedValues = undefined;
    if (Utils.isNonEmptyArray(this.facet.options.ranges)) {
      groupByQuery = this.buildGroupByQueryForPredefinedRanges(groupByQuery);
    } else {
      groupByQuery = this.buildGroupByQueryForAutomaticRanges(groupByQuery);
    }
    return groupByQuery;
  }

  protected createGroupByAllowedValues(): string[] {
    return undefined;
  }

  private buildGroupByQueryForAutomaticRanges(groupByQuery: IGroupByRequest) {
    groupByQuery.generateAutomaticRanges = true;
    return groupByQuery;
  }

  private buildGroupByQueryForPredefinedRanges(groupByQuery: IGroupByRequest) {
    groupByQuery.rangeValues = this.facet.options.ranges;
    groupByQuery.maximumNumberOfValues = this.facet.options.ranges.length;
    return groupByQuery;
  }

  private buildGroupByQueryForSelectedAndExcludedValues(groupByQuery: IGroupByRequest) {
    groupByQuery.rangeValues = _.map(this.facet.values.getAll(), (value) => {
      var startEnd = value.value.split('..');
      var start = startEnd[0];
      var end = startEnd[1];
      if (this.facet.options.dateField) {
        start = this.getISOFormat(start);
        end = this.getISOFormat(end);
      }
      return <IRangeValue>{
        start: start,
        end: end,
        endInclusive: true,
        label: value.lookupValue
      }
    });
    return groupByQuery;
  }

  private getISOFormat(value: any) {
    if (value) {
      if (!isNaN(value)) {
        value = Number(value);
      }
      var date = new Date(value);
      if (!DateUtils.isValid(date)) {
        date = new Date(this.getBrowserCompatibleFormat(value))
        if (!DateUtils.isValid(date)) {
          // If we get here, we'll probably get an error further down the line when querying the index anyway ...
          this.facet.logger.error('Cannot parse this date format.', value, new Date(value))
          return undefined;
        }
      }
      return date.toISOString();
    } else {
      return undefined;
    }
  }

  private getBrowserCompatibleFormat(value: string) {
    return value.replace('@', 'T').replace(/\//g, '-')
  }
}
