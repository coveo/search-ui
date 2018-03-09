import { ExecutionReport } from './ExecutionReport';
import { TableBuilder, ITableDataSource } from './TableBuilder';
import { IQueryResult } from '../../rest/QueryResult';
import { IRankingExpression } from '../../rest/RankingExpression';
import { map, find } from 'underscore';
import { GenericValueOutput } from './GenericValueOutput';
import { QueryUtils, IResultsComponentBindings, QueryBuilder } from '../../Core';

export class ExecutionReportRankingModifiers {
  public async build(results: IQueryResult[], rankingExpressions: IRankingExpression[], bindings: IResultsComponentBindings) {
    const { container, agGridElement } = ExecutionReport.standardSectionHeader('Ranking Modifiers & Machine Learning Boosts');
    const dataSourcePromises = map(rankingExpressions, async rankingExpression => {
      const isMLBoostRegex = /^@permanentid=([a-z0-9]+)$/;

      let thumbnailPreview: Record<string, ITableDataSource> = {
        Document: new GenericValueOutput().output('-- N.A --')
      };

      let returnedByIndexForCurrentQuery = '-- N.A --';
      let result: IQueryResult = null;

      const isMLBoost = rankingExpression.expression.match(isMLBoostRegex);
      if (isMLBoost) {
        const extracted = await this.extractDocumentInfoFromMLBoost(results, isMLBoost[1], rankingExpression, bindings);
        thumbnailPreview = TableBuilder.thumbnailCell(extracted.result, bindings);
        result = extracted.result;
        returnedByIndexForCurrentQuery = extracted.returnedByIndexForCurrentQuery.toString();
      }

      return {
        ...thumbnailPreview,
        ReturnedByIndexForCurrentQuery: new GenericValueOutput().output(returnedByIndexForCurrentQuery),
        IsRecommendation: new GenericValueOutput().output(result ? result.isRecommendation : '-- N.A --'),
        Expression: new GenericValueOutput().output(rankingExpression.expression),
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

  private async extractDocumentInfoFromMLBoost(
    results: IQueryResult[],
    permanentID: string,
    rankingExpression: IRankingExpression,
    bindings: IResultsComponentBindings
  ) {
    let matchingResult = {
      result: null,
      returnedByIndexForCurrentQuery: false
    };

    const resultInResultSet = find(results, result => {
      return QueryUtils.getPermanentId(result).fieldValue == permanentID;
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
