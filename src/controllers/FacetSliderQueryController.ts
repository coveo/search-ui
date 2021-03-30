/// <reference path="../ui/FacetSlider/FacetSlider.ts" />

import { clone, each, map, range } from 'underscore';
import { IQuerySuccessEventArgs, QueryEvents } from '../events/QueryEvents';
import { Logger } from '../misc/Logger';
import { IGroupByRequest } from '../rest/GroupByRequest';
import { IRangeValue } from '../rest/RangeValue';
import { ExpressionBuilder } from '../ui/Base/ExpressionBuilder';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { FacetSlider } from '../ui/FacetSlider/FacetSlider';
import { DateUtils } from '../utils/DateUtils';
import { QueryUtils } from '../utils/QueryUtils';
import { QueryBuilderExpression } from '../ui/Base/QueryBuilderExpression';
import { Utils } from '../utils/Utils';

export class FacetSliderQueryController {
  public graphGroupByQueriesIndex: number;
  private rangeValuesForGraphToUse: { start: any; end: any }[];
  public lastGroupByRequestIndex: number;
  public lastGroupByRequestForFullRangeIndex: number;

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
        `Cannot instantiate FacetSlider for this field : ${this.facet.options.field}. It needs to be configured as a numerical field in the index`
      );
      logger.error(`Disabling the FacetSlider`, this.facet);
      this.facet.disable();
      return;
    }

    if (this.facet.options && this.facet.options.graph && this.rangeValuesForGraphToUse == undefined) {
      this.rangeValuesForGraphToUse = [];
      const groupByResult = args.results.groupByResults[this.graphGroupByQueriesIndex];
      const rawValues = groupByResult ? groupByResult.values : [];
      each(rawValues, rawValue => {
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

    if (this.facet.isSimpleSliderConfig) {
      basicGroupByRequestForGraph.rangeValues = this.createRangeValuesForGraphUsingStartAndEnd();
      basicGroupByRequestForGraph.generateAutomaticRanges = false;
    } else {
      basicGroupByRequestForGraph.generateAutomaticRanges = true;
    }

    this.addExpressionToExcludeInvalidDates(basicGroupByRequestForGraph);

    const filter = this.computeOurFilterExpression(this.facet.getSliderBoundaryForQuery());
    this.processQueryOverride(filter, basicGroupByRequestForGraph, queryBuilder);

    basicGroupByRequestForGraph.sortCriteria = 'nosort';
    basicGroupByRequestForGraph.maximumNumberOfValues = this.facet.options.graph.steps;
    queryBuilder.groupByRequests.push(basicGroupByRequestForGraph);
  }

  private putGroupByForSliderIntoQueryBuilder(queryBuilder: QueryBuilder) {
    this.lastGroupByRequestIndex = queryBuilder.groupByRequests.length;

    const basicGroupByRequestForSlider = this.putGroupByBasicSliderIntoQueryBuilder(queryBuilder);
    this.putGroupByForFullRangeSliderIntoQueryBuilder(queryBuilder, basicGroupByRequestForSlider);
  }

  private processQueryOverride(filter: string, groupByRequest: IGroupByRequest, queryBuilder: QueryBuilder) {
    let expression: QueryBuilderExpression;
    if (filter != undefined) {
      expression = queryBuilder.computeCompleteExpressionPartsExcept(filter);
    } else {
      expression = queryBuilder.computeCompleteExpressionParts();
    }

    const queryOverrideFromOptions = this.facet.options.queryOverride || '@uri';

    groupByRequest.queryOverride = this.appendOrSetGroupByOverrideParam(groupByRequest.queryOverride, expression.basic);
    groupByRequest.advancedQueryOverride = this.appendOrSetGroupByOverrideParam(groupByRequest.advancedQueryOverride, expression.advanced);
    groupByRequest.constantQueryOverride = this.appendOrSetGroupByOverrideParam(groupByRequest.constantQueryOverride, expression.constant);
    groupByRequest.advancedQueryOverride = this.appendOrSetGroupByOverrideParam(
      groupByRequest.advancedQueryOverride,
      queryOverrideFromOptions
    );
  }

  private createRangeValuesForGraphUsingStartAndEnd() {
    const { start, end } = this.getFormattedStartAndEnd();
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
    return map(this.rangeValuesForGraphToUse, value => {
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
    return map(range(0, this.facet.options.graph.steps, 1), step => {
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

  private getFormattedStartAndEnd() {
    let start = this.facet.options.start;
    let end = this.facet.options.end;
    if (this.facet.options.dateField) {
      start = this.getISOFormat(start);
      end = this.getISOFormat(end);
    }
    return {
      start,
      end
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
      return this.getISOFormat(rawValue).replace('T', '@').replace('.000Z', '').replace(/-/g, '/');
    } else {
      return undefined;
    }
  }

  private getBrowserCompatibleFormat(value: string) {
    return value.replace('@', 'T').replace(/\//g, '-');
  }

  private putGroupByForFullRangeSliderIntoQueryBuilder(queryBuilder: QueryBuilder, basicGroupByRequest: IGroupByRequest) {
    // We need a group by request for the "full range" that does not take into account the current query (query override)
    // The goal is to obtain a query wich return the whole range of results without taking into account what the users typed in the search box,
    // so that the X range of the slider is static between each queries.

    this.lastGroupByRequestForFullRangeIndex = queryBuilder.groupByRequests.length;
    const groupByRequestForFullRange = clone(basicGroupByRequest);

    // This removes the "basic" query override. ie: user input
    delete groupByRequestForFullRange.queryOverride;
    // This removes any current filter in the facet caused by a selection
    delete groupByRequestForFullRange.advancedQueryOverride;
    // We keep the "constantQueryOverride", since it normally contains static filter always applied no matter what.

    if (this.facet.options.queryOverride) {
      groupByRequestForFullRange.advancedQueryOverride = this.facet.options.queryOverride;
    }

    this.addExpressionToExcludeInvalidDates(groupByRequestForFullRange);

    // If, after the above treatment, * all * parts of the group by request override are still empty,
    // we need to add at least one override for it to be able to actually "disregard" the current filters of the interface, and retrieve the full range from the index.
    // If all query override parts stays empty, we end up with a useless query that is affected by any other filters in the interface
    if (
      groupByRequestForFullRange.queryOverride === undefined &&
      groupByRequestForFullRange.advancedQueryOverride === undefined &&
      groupByRequestForFullRange.constantQueryOverride === undefined
    ) {
      groupByRequestForFullRange.advancedQueryOverride = '@uri';
    }

    queryBuilder.groupByRequests.push(groupByRequestForFullRange);
  }

  private putGroupByBasicSliderIntoQueryBuilder(queryBuilder: QueryBuilder): IGroupByRequest {
    let maximumNumberOfValues = 1;

    if (this.facet.hasAGraph()) {
      maximumNumberOfValues = this.facet.options.graph.steps;
    }

    let rangeValues: IRangeValue[];
    if (this.facet.isSimpleSliderConfig) {
      rangeValues = [
        {
          ...this.getFormattedStartAndEnd(),
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
    basicGroupByRequestForSlider.generateAutomaticRanges = !this.facet.isSimpleSliderConfig;
    basicGroupByRequestForSlider.rangeValues = rangeValues;
    const filter = this.computeOurFilterExpression(this.facet.getSliderBoundaryForQuery());
    this.processQueryOverride(filter, basicGroupByRequestForSlider, queryBuilder);
    this.addExpressionToExcludeInvalidDates(basicGroupByRequestForSlider);

    queryBuilder.groupByRequests.push(basicGroupByRequestForSlider);

    return basicGroupByRequestForSlider;
  }

  private addExpressionToExcludeInvalidDates(groupByRequest: IGroupByRequest) {
    if (this.facet.options.dateField) {
      // When a connector sets an invalid or un-existing date,
      // the Coveo index will automatically set its value to 1400/01/01 (the "minimum" value in the Boost C++ library).
      // Here, we try to always force those values out,
      // by putting a filter on dates above Unix epoch, otherwise all kinds of weird stuff will happen for the end users
      // For example :
      // - We'll get extremely huge range of dates, all with no values
      //   (because it turns out not many document were actually produced in the medieval ages).
      // - Graphs might get all out of bound, with very tiny slices.
      // - Moment js will incorrectly evaluate the date.
      // - You cannot actually query for those invalid document using date queries anyway,
      //   meaning playing with the slider will always return "no results" if you try and filter on those invalid documents.
      // Instead of taking the approach of garbage in/garbage out, this tries to do something a bit more sane for end users ...

      const builderToRemoveInvalidRange = new QueryBuilder();
      builderToRemoveInvalidRange.expression.addFieldExpression(this.facet.options.field as string, '>', [
        this.getFilterDateFormat(new Date(0))
      ]);
      if (groupByRequest.constantQueryOverride) {
        groupByRequest.constantQueryOverride += ` ${builderToRemoveInvalidRange.expression.build()}`;
      } else {
        groupByRequest.constantQueryOverride = builderToRemoveInvalidRange.expression.build();
      }
    }
  }

  private appendOrSetGroupByOverrideParam(param: string, value: string) {
    if (Utils.isNullOrUndefined(value)) {
      return param;
    }

    if (Utils.isNullOrUndefined(param)) {
      return value || '';
    } else {
      return param + ' ' + (value || '');
    }
  }
}
