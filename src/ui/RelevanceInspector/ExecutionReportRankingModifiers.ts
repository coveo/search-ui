import { ExecutionReport } from './ExecutionReport';
import { TableBuilder, ITableDataSource } from './TableBuilder';
import { IQueryResult } from '../../rest/QueryResult';
import { IRankingExpression } from '../../rest/RankingExpression';
import { map, find } from 'underscore';
import { GenericValueOutput } from './GenericValueOutput';
import { Dom } from '../../utils/Dom';
import { IComponentBindings } from '../Base/ComponentBindings';
import agGridModule = require('ag-grid/main');
import { QueryBuilder } from '../Base/QueryBuilder';

export class ExecutionReportRankingModifiers {
  public async build(
    results: IQueryResult[],
    rankingExpressions: IRankingExpression[],
    bindings: IComponentBindings
  ): Promise<{ container: Dom; gridOptions: agGridModule.GridOptions }> {
    const { container, agGridElement } = ExecutionReport.standardSectionHeader('Ranking Modifiers & Machine Learning Boosts');

    const dataSourcePromises = map(rankingExpressions, async rankingExpression => {
      const isAutomaticBoostRegex = /^(@permanentid|@urihash)="?([a-zA-Z0-9]+)"?$/;

      let thumbnailPreview: Record<string, ITableDataSource> = TableBuilder.thumbnailCell(null, null);
      let returnedByIndexForCurrentQuery = '-- NULL --';
      let result: IQueryResult = null;

      const isAutomaticBoost = rankingExpression.expression.match(isAutomaticBoostRegex);
      if (isAutomaticBoost) {
        const permanentIDUsedInAutomaticBoost = isAutomaticBoost[2];
        const extracted = await this.extractDocumentInfoFromBoost(results, permanentIDUsedInAutomaticBoost, rankingExpression, bindings);
        thumbnailPreview = TableBuilder.thumbnailCell(extracted.result, bindings);
        result = extracted.result;
        returnedByIndexForCurrentQuery = extracted.returnedByIndexForCurrentQuery.toString();
      }

      return {
        ...thumbnailPreview,
        ReturnedByIndexForCurrentQuery: new GenericValueOutput().output(returnedByIndexForCurrentQuery),
        IsRecommendation: new GenericValueOutput().output(result ? result.isRecommendation : '-- NULL --'),
        Expression: { ...new GenericValueOutput().output(rankingExpression.expression), width: 150 },
        Modifier: new GenericValueOutput().output(rankingExpression.modifier)
      };
    });

    const dataSource = await Promise.all(dataSourcePromises);

    const { gridOptions } = await new TableBuilder().build(dataSource, agGridElement, {
      rowHeight: 150
    });

    return {
      container,
      gridOptions
    };
  }

  private async extractDocumentInfoFromBoost(
    results: IQueryResult[],
    permanentID: string,
    rankingExpression: IRankingExpression,
    bindings: IComponentBindings
  ) {
    let matchingResult = {
      result: null,
      returnedByIndexForCurrentQuery: false
    };

    const resultInResultSet = find(results, result => {
      return result.raw.permanentid == permanentID || result.raw.urihash == permanentID;
    });

    if (resultInResultSet) {
      matchingResult = {
        result: resultInResultSet,
        returnedByIndexForCurrentQuery: true
      };
      return matchingResult;
    }

    const queryBuilder = new QueryBuilder();
    queryBuilder.advancedExpression.add(rankingExpression.expression);
    const resultsFromIndex = await bindings.queryController.getEndpoint().search(queryBuilder.build());
    matchingResult = {
      result: resultsFromIndex.results[0],
      returnedByIndexForCurrentQuery: false
    };

    return matchingResult;
  }
}
