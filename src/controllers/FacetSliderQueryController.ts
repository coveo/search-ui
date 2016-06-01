/// <reference path="../ui/FacetSlider/FacetSlider.ts" />

import {FacetSlider} from '../ui/FacetSlider/FacetSlider';
import {QueryEvents, IQuerySuccessEventArgs} from '../events/QueryEvents';
import {QueryBuilder} from '../ui/Base/QueryBuilder';
import {IGroupByRequest} from '../rest/GroupByRequest';
import {ExpressionBuilder} from '../ui/Base/ExpressionBuilder';
import {IRangeValue} from '../rest/RangeValue';
import {DateUtils} from '../utils/DateUtils';

export class FacetSliderQueryController {
  public graphGroupByQueriesIndex: number;
  private rangeValuesForGraphToUse: { start: any; end: any }[];
  public lastGroupByRequestIndex: number;

  constructor(public facet: FacetSlider) {
    this.facet.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
  }

  public prepareForNewQuery() {
    this.lastGroupByRequestIndex = undefined;
  }

  public putGroupByIntoQueryBuilder(queryBuilder: QueryBuilder) {
    if (this.facet.options.graph) {
      this.putGroupByForGraphIntoQueryBuilder(queryBuilder);
    }
    this.putGroupByForSliderIntoQueryBuilder(queryBuilder);
  }

  public createBasicGroupByRequest(allowedValues?: string[], addComputedField: boolean = true) {
    var groupByQuery: IGroupByRequest = {
      field: this.facet.options.field,
      completeFacetWithStandardValues: true
    };
    groupByQuery.allowedValues = undefined;
    if (this.facet.options.graph) {
      groupByQuery = this.buildGroupByQueryForSlider(groupByQuery);
    } else {
      groupByQuery = this.buildGroupByQueryForAutomaticRanges(groupByQuery);
    }
    return groupByQuery;
  }

  public computeOurFilterExpression(boundary = [this.facet.startOfSlider, this.facet.endOfSlider]) {
    var builder = new ExpressionBuilder();
    if (boundary[0] != undefined && boundary[1] != undefined) {
      if (this.facet.options.excludeOuterBounds) {
        this.addFilterExpressionWithOuterBoundsExcluded(boundary[0], boundary[1], builder);
      } else {
        this.addFilterExpressionWithOuterBoundsIncluded(boundary[0], boundary[1], builder);
      }
    }
    return builder.build();
  }

  private handleQuerySuccess(args: IQuerySuccessEventArgs) {
    if (this.facet.options && this.facet.options.graph && this.rangeValuesForGraphToUse == undefined) {
      this.rangeValuesForGraphToUse = [];
      var rawValues = args.results.groupByResults[this.graphGroupByQueriesIndex].values;
      _.each(rawValues, (rawValue) => {
        var rawSplit = rawValue.value.split('..');
        this.rangeValuesForGraphToUse.push({
          start: this.facet.options.dateField ? this.getISOFormat(rawSplit[0].replace('@', ' ')) : parseInt(rawSplit[0], 10),
          end: this.facet.options.dateField ? this.getISOFormat(rawSplit[1].replace('@', ' ')) : parseInt(rawSplit[1], 10)
        })
      })
    }
  }

  private addFilterExpressionWithOuterBoundsIncluded(start: any, end: any, builder: ExpressionBuilder) {
    if (start != this.facet.options.start || end != this.facet.options.end) {
      if (this.facet.options.dateField) {
        start = this.getFilterDateFormat(start);
        end = this.getFilterDateFormat(end);
      }
      builder.addFieldExpression(this.facet.options.field, '==', [start + '..' + end]);
    }
  }

  private addFilterExpressionWithOuterBoundsExcluded(start: any, end: any, builder: ExpressionBuilder) {
    var startCompare = this.facet.options.start;
    var endCompare = this.facet.options.end;
    var startCompared = start;
    var endCompared = end;
    if (this.facet.options.dateField) {
      startCompared = this.getFilterDateFormat(start);
      endCompared = this.getFilterDateFormat(end);
      startCompare = this.getFilterDateFormat(startCompare);
      endCompare = this.getFilterDateFormat(endCompare);
    } else {
      startCompared += '';
      endCompared += '';
      startCompare += '';
      endCompare += '';
    }
    if (startCompared != startCompare && endCompared == endCompare) {
      builder.addFieldExpression(this.facet.options.field, '>=', [startCompared]);
    } else if (startCompared == startCompare && endCompared != endCompare) {
      builder.addFieldExpression(this.facet.options.field, '<=', [endCompared]);
    } else {
      this.addFilterExpressionWithOuterBoundsIncluded(start, end, builder);
    }
  }

  private buildGroupByQueryForSlider(groupByQuery: IGroupByRequest) {
    if (this.facet.options.start != undefined && this.facet.options.end != undefined) {
      var start = this.facet.options.start;
      var end = this.facet.options.end;
      if (this.facet.options.dateField || this.facet.options.dateField) {
        start = this.getISOFormat(start);
        end = this.getISOFormat(end);
      }
      groupByQuery.rangeValues = [{
        start: start,
        end: end,
        endInclusive: true,
        label: 'Slider'
      }];
      return groupByQuery;
    } else {
      return this.buildGroupByQueryForAutomaticRanges(groupByQuery);
    }
  }

  private buildGroupByQueryForAutomaticRanges(groupByQuery: IGroupByRequest) {
    groupByQuery.generateAutomaticRanges = true;
    return groupByQuery;
  }

  private putGroupByForGraphIntoQueryBuilder(queryBuilder: QueryBuilder) {
    this.graphGroupByQueriesIndex = queryBuilder.groupByRequests.length;
    var basicGroupByRequestForGraph = this.createBasicGroupByRequest();
    if (basicGroupByRequestForGraph.rangeValues) {
      var basicRangeRequest = basicGroupByRequestForGraph.rangeValues[0];
      basicGroupByRequestForGraph.rangeValues = this.createRangeValuesForGraph(basicRangeRequest);
    }
    var filter = this.computeOurFilterExpression(this.facet.getSliderBoundaryForQuery());
    if (filter != undefined) {
      var queryOverrideObject = queryBuilder.computeCompleteExpressionPartsExcept(filter);
      basicGroupByRequestForGraph.queryOverride = queryOverrideObject.basic;
      basicGroupByRequestForGraph.advancedQueryOverride = queryOverrideObject.advanced;
      basicGroupByRequestForGraph.constantQueryOverride = queryOverrideObject.constant;
      if (basicGroupByRequestForGraph.queryOverride == undefined) {
        basicGroupByRequestForGraph.queryOverride = this.facet.options.queryOverride || '@uri';
      } else {
        basicGroupByRequestForGraph.queryOverride += (this.facet.options.queryOverride ? ' ' + this.facet.options.queryOverride : '');
      }
    } else if (this.facet.options.queryOverride != null) {
      var completeExpression = queryBuilder.computeCompleteExpression();
      basicGroupByRequestForGraph.queryOverride = (completeExpression != null ? completeExpression + ' ' : '') + this.facet.options.queryOverride;
    }

    basicGroupByRequestForGraph.sortCriteria = 'nosort';
    basicGroupByRequestForGraph.maximumNumberOfValues = this.facet.options.graph.steps;
    queryBuilder.groupByRequests.push(basicGroupByRequestForGraph);
  }

  private putGroupByForSliderIntoQueryBuilder(queryBuilder: QueryBuilder) {
    this.lastGroupByRequestIndex = queryBuilder.groupByRequests.length;
    var basicGroupByRequestForSlider = this.createBasicGroupByRequest();
    basicGroupByRequestForSlider.maximumNumberOfValues = this.facet.options.graph != null ? this.facet.options.graph.steps || 1 : 1;
    basicGroupByRequestForSlider.queryOverride = this.facet.options.queryOverride || '@uri';
    basicGroupByRequestForSlider.sortCriteria = 'nosort';
    basicGroupByRequestForSlider.generateAutomaticRanges = true;
    basicGroupByRequestForSlider.rangeValues = undefined;
    queryBuilder.groupByRequests.push(basicGroupByRequestForSlider);
  }

  private createRangeValuesForGraph(basicRangeRequest: IRangeValue) {
    if (this.facet.options.graph.steps == undefined) {
      this.facet.options.graph.steps = 10;
    }
    if (this.facet.options.dateField && isNaN(this.facet.options.start)) {
      this.facet.options.start = new Date(this.facet.options.start).getTime();
    }
    if (this.facet.options.dateField && isNaN(this.facet.options.end)) {
      this.facet.options.end = new Date(this.facet.options.end).getTime();
    }
    if (this.rangeValuesForGraphToUse != undefined) {
      return this.usePrebuiltRange(basicRangeRequest);
    } else {
      return this.buildRange(basicRangeRequest);
    }
  }

  private usePrebuiltRange(basicRangeRequest: IRangeValue) {
    return _.map(this.rangeValuesForGraphToUse, (value) => {
      return {
        start: value.start,
        end: value.end,
        endInclusive: basicRangeRequest.endInclusive,
        label: basicRangeRequest.label
      }
    })
  }

  private buildRange(basicRangeRequest: IRangeValue) {
    var start = this.facet.options.start;
    var end = this.facet.options.end;
    var oneStep = (this.facet.options.end - this.facet.options.start) / this.facet.options.graph.steps;
    return _.map(_.range(0, this.facet.options.graph.steps, 1), (step) => {
      var newStart = start + (step * oneStep);
      var newEnd = start + ((step + 1) * oneStep);
      if (this.facet.options.dateField) {
        newStart = this.getISOFormat(newStart);
        newEnd = this.getISOFormat(newEnd);
      }
      return {
        endInclusive: basicRangeRequest.endInclusive,
        label: basicRangeRequest.label,
        start: newStart,
        end: newEnd
      }
    })
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

  private getFilterDateFormat(rawValue: any) {
    if (rawValue) {
      return this.getISOFormat(rawValue).replace('T', '@').replace('.000Z', '').replace(/-/g, '/');
    } else {
      return undefined;
    }
  }

  private getBrowserCompatibleFormat(value: string) {
    return value.replace('@', 'T').replace(/\//g, '-')
  }
}
