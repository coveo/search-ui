/// <reference path="../ui/FacetSlider/FacetSlider.ts" />

import { FacetSlider } from '../ui/FacetSlider/FacetSlider';
import { QueryEvents, IQuerySuccessEventArgs } from '../events/QueryEvents';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { IGroupByRequest } from '../rest/GroupByRequest';
import { ExpressionBuilder } from '../ui/Base/ExpressionBuilder';
import { IRangeValue } from '../rest/RangeValue';
import { DateUtils } from '../utils/DateUtils';
import { Logger } from '../misc/Logger';
import { QueryUtils } from '../utils/QueryUtils';
import * as _ from 'underscore';

export class FacetSliderQueryController {
  public graphGroupByQueriesIndex: number;
  private rangeValuesForGraphToUse: { start: any; end: any }[];
  public lastGroupByRequestIndex: number;
  public groupByRequestForFullRange: number;

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

  private createBasicGroupByRequest() {
    const groupByQuery: IGroupByRequest = {
      field: <string>this.facet.options.field,
      completeFacetWithStandardValues: true,
      allowedValues: undefined
    };
    return groupByQuery;
  }

  public computeOurFilterExpression(boundary = [this.facet.startOfSlider, this.facet.endOfSlider]) {
    const builder = new ExpressionBuilder();
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
    if (!this.isAValidRangeResponse(args)) {
      const logger = new Logger(this);
      logger.error(
        `Cannot instantiate FacetSlider for this field : ${this.facet.options
          .field}. It needs to be configured as a numerical field in the index`
      );
      logger.error(`Disabling the FacetSlider`, this.facet);
      this.facet.disable();
      return;
    }

    if (this.facet.options && this.facet.options.graph && this.rangeValuesForGraphToUse == undefined) {
      this.rangeValuesForGraphToUse = [];
      const rawValues = args.results.groupByResults[this.graphGroupByQueriesIndex].values;
      _.each(rawValues, rawValue => {
        const rawSplit = rawValue.value.split('..');
        this.rangeValuesForGraphToUse.push({
          start: this.facet.options.dateField ? this.getISOFormat(rawSplit[0].replace('@', ' ')) : parseInt(rawSplit[0], 10),
          end: this.facet.options.dateField ? this.getISOFormat(rawSplit[1].replace('@', ' ')) : parseInt(rawSplit[1], 10)
        });
      });
    }
  }

  private isAValidRangeResponse(args: IQuerySuccessEventArgs) {
    if (this.lastGroupByRequestIndex != undefined && args.results.groupByResults[this.lastGroupByRequestIndex]) {
      const firstValue = args.results.groupByResults[this.lastGroupByRequestIndex].values[0];
      if (firstValue && !QueryUtils.isRangeString(firstValue.value)) {
        return false;
      }
    }
    return true;
  }

  private addFilterExpressionWithOuterBoundsIncluded(start: any, end: any, builder: ExpressionBuilder) {
    if (start != this.facet.options.start || end != this.facet.options.end) {
      if (this.facet.options.dateField) {
        start = this.getFilterDateFormat(start);
        end = this.getFilterDateFormat(end);
      }
      builder.addFieldExpression(<string>this.facet.options.field, '==', [start + '..' + end]);
    }
  }

  private addFilterExpressionWithOuterBoundsExcluded(start: any, end: any, builder: ExpressionBuilder) {
    let startCompare = this.facet.options.start;
    let endCompare = this.facet.options.end;
    let startCompared = start;
    let endCompared = end;
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
      builder.addFieldExpression(<string>this.facet.options.field, '>=', [startCompared]);
    } else if (startCompared == startCompare && endCompared != endCompare) {
      builder.addFieldExpression(<string>this.facet.options.field, '<=', [endCompared]);
    } else {
      this.addFilterExpressionWithOuterBoundsIncluded(start, end, builder);
    }
  }

  private putGroupByForGraphIntoQueryBuilder(queryBuilder: QueryBuilder) {
    this.graphGroupByQueriesIndex = queryBuilder.groupByRequests.length;
    const basicGroupByRequestForGraph = this.createBasicGroupByRequest();

    if (this.facet.isSimpleSliderConfig()) {
      basicGroupByRequestForGraph.rangeValues = this.createRangeValuesForGraphUsingStartAndEnd();
      basicGroupByRequestForGraph.generateAutomaticRanges = false;
    } else {
      basicGroupByRequestForGraph.generateAutomaticRanges = true;
    }

    const filter = this.computeOurFilterExpression(this.facet.getSliderBoundaryForQuery());
    this.processQueryOverride(filter, basicGroupByRequestForGraph, queryBuilder);

    basicGroupByRequestForGraph.sortCriteria = 'nosort';
    basicGroupByRequestForGraph.maximumNumberOfValues = this.facet.options.graph.steps;
    queryBuilder.groupByRequests.push(basicGroupByRequestForGraph);
  }

  private putGroupByForSliderIntoQueryBuilder(queryBuilder: QueryBuilder) {
    this.lastGroupByRequestIndex = queryBuilder.groupByRequests.length;

    let maximumNumberOfValues = 1;
    if (this.facet.hasAGraph()) {
      maximumNumberOfValues = this.facet.options.graph.steps;
    }

    let rangeValues = undefined;
    const { start, end } = this.formatStartAndEnd();
    if (this.facet.isSimpleSliderConfig()) {
      rangeValues = [
        {
          start: start,
          end: end,
          label: 'slider',
          endInclusive: false
        }
      ];
    }

    // A basic group by request that takes into account the current query
    // This one will determine if the facet is empty for the current query
    const basicGroupByRequestForSlider = this.createBasicGroupByRequest();
    basicGroupByRequestForSlider.maximumNumberOfValues = maximumNumberOfValues;
    basicGroupByRequestForSlider.sortCriteria = 'nosort';
    basicGroupByRequestForSlider.generateAutomaticRanges = !this.facet.isSimpleSliderConfig();
    basicGroupByRequestForSlider.rangeValues = rangeValues;
    const filter = this.computeOurFilterExpression(this.facet.getSliderBoundaryForQuery());
    this.processQueryOverride(filter, basicGroupByRequestForSlider, queryBuilder);

    queryBuilder.groupByRequests.push(basicGroupByRequestForSlider);

    // We need a group by request for the "full range" that does not take into account the current query
    // This will determine the full range of the query so that the X range of the slider is static
    this.groupByRequestForFullRange = queryBuilder.groupByRequests.length;
    const groupByRequestForFullRange = _.clone(basicGroupByRequestForSlider);
    groupByRequestForFullRange.queryOverride = this.facet.options.queryOverride || '@uri';
    delete groupByRequestForFullRange.constantQueryOverride;
    delete groupByRequestForFullRange.advancedQueryOverride;

    queryBuilder.groupByRequests.push(groupByRequestForFullRange);
  }

  private processQueryOverride(filter: string, groupByRequest: IGroupByRequest, queryBuilder: QueryBuilder) {
    if (filter != undefined) {
      const queryOverrideObject = queryBuilder.computeCompleteExpressionPartsExcept(filter);
      groupByRequest.queryOverride = queryOverrideObject.basic;
      groupByRequest.advancedQueryOverride = queryOverrideObject.advanced;
      groupByRequest.constantQueryOverride = queryOverrideObject.constant;
      if (groupByRequest.queryOverride == undefined) {
        groupByRequest.queryOverride = this.facet.options.queryOverride || '@uri';
      } else {
        groupByRequest.queryOverride += this.facet.options.queryOverride ? ' ' + this.facet.options.queryOverride : '';
      }
    } else if (this.facet.options.queryOverride != null) {
      const completeExpression = queryBuilder.computeCompleteExpression();
      groupByRequest.queryOverride = (completeExpression != null ? completeExpression + ' ' : '') + this.facet.options.queryOverride;
    }
  }

  private createRangeValuesForGraphUsingStartAndEnd() {
    const { start, end } = this.formatStartAndEnd();
    const oneRange: IRangeValue = {
      start: start,
      end: end,
      endInclusive: true,
      label: 'Slider'
    };

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
      return this.usePrebuiltRange(oneRange);
    } else {
      return this.buildRange(oneRange);
    }
  }

  private usePrebuiltRange(basicRangeRequest: IRangeValue) {
    return _.map(this.rangeValuesForGraphToUse, value => {
      return {
        start: value.start,
        end: value.end,
        endInclusive: basicRangeRequest.endInclusive,
        label: basicRangeRequest.label
      };
    });
  }

  private buildRange(basicRangeRequest: IRangeValue) {
    const start = this.facet.options.start;
    const oneStep = (this.facet.options.end - this.facet.options.start) / this.facet.options.graph.steps;
    return _.map(_.range(0, this.facet.options.graph.steps, 1), step => {
      let newStart = start + step * oneStep;
      let newEnd = start + (step + 1) * oneStep;
      if (this.facet.options.dateField) {
        newStart = this.getISOFormat(newStart);
        newEnd = this.getISOFormat(newEnd);
      }
      return {
        endInclusive: basicRangeRequest.endInclusive,
        label: basicRangeRequest.label,
        start: newStart,
        end: newEnd
      };
    });
  }

  private formatStartAndEnd() {
    let start = this.facet.options.start;
    let end = this.facet.options.end;
    if (this.facet.options.dateField) {
      start = this.getISOFormat(start);
      end = this.getISOFormat(end);
    }
    return {
      start: start,
      end: end
    };
  }

  private getISOFormat(value: any) {
    if (value) {
      if (!isNaN(value)) {
        value = Number(value);
      }
      let date = new Date(value);
      if (!DateUtils.isValid(date)) {
        date = new Date(this.getBrowserCompatibleFormat(value));
        if (!DateUtils.isValid(date)) {
          // If we get here, we'll probably get an error further down the line when querying the index anyway ...
          this.facet.logger.error('Cannot parse this date format.', value, new Date(value));
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
      return this.getISOFormat(rawValue)
        .replace('T', '@')
        .replace('.000Z', '')
        .replace(/-/g, '/');
    } else {
      return undefined;
    }
  }

  private getBrowserCompatibleFormat(value: string) {
    return value.replace('@', 'T').replace(/\//g, '-');
  }
}
