import { parseRankingInfo, IRankingInfo, buildListOfTermsElement } from './RankingInfoParser';
import { each, uniq, contains } from 'underscore';
import { TableBuilder, ITableDataSource, GenericHtmlRenderer } from './TableBuilder';
import { $$ } from '../../utils/Dom';
import { IQueryResult } from '../../rest/QueryResult';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { IRelevanceInspectorTab } from './RelevanceInspector';
import agGridModule = require('ag-grid/main');

export class RankingInfoTable implements IRelevanceInspectorTab {
  public gridOptions: agGridModule.GridOptions;
  constructor(public results: IQueryResult[], public bindings: IComponentBindings) {}

  public async build() {
    const container = $$('div');

    const agGridElement = $$('div', {
      className: 'ag-theme-fresh'
    });
    container.append(agGridElement.el);

    let topLevelInfoThatHaveAtLeastANonZeroValue: string[] = [];
    let containsKeywordRankingInfo = false;

    this.results.forEach(result => {
      const rankingInfo = parseRankingInfo(result.rankingInfo);
      containsKeywordRankingInfo = rankingInfo.termsWeight != null;
      if (rankingInfo && rankingInfo.documentWeights) {
        each(rankingInfo.documentWeights, (value: number, key: string) => {
          if (value != 0) {
            topLevelInfoThatHaveAtLeastANonZeroValue.push(key);
          }
        });
      }
    });

    topLevelInfoThatHaveAtLeastANonZeroValue = uniq(topLevelInfoThatHaveAtLeastANonZeroValue);

    const data = this.results.map(result => {
      const rankingInfo = parseRankingInfo(result.rankingInfo);

      if (rankingInfo) {
        const documentsWeights = this.buildTopLevelDocumentsWeights(rankingInfo, topLevelInfoThatHaveAtLeastANonZeroValue);
        const breakdownPerTerm: Record<string, ITableDataSource> = {};

        each(rankingInfo.termsWeight || {}, (value, key) => {
          const builtKey = `Keyword: ${key}`;
          breakdownPerTerm[builtKey] = {
            content: buildListOfTermsElement(value.Weights).el.outerHTML,
            cellRenderer: GenericHtmlRenderer,
            width: 200
          };
        });

        const totalContent = rankingInfo.totalWeight ? rankingInfo.totalWeight : 0;
        return {
          ...TableBuilder.thumbnailCell(result, this.bindings as IResultsComponentBindings),
          ...documentsWeights,
          ...breakdownPerTerm,
          ...{ Total: { content: totalContent || 0 } }
        };
      }
      return {};
    });

    const { gridOptions } = await new TableBuilder().build(data, agGridElement, {
      getRowHeight: () => {
        return containsKeywordRankingInfo ? 400 : 250;
      },
      onGridReady: params => {
        setTimeout(() => {
          params ? params.api.sizeColumnsToFit() : null;
          params ? params.api.setSortModel([{ colId: 'Total', sort: 'desc' }]) : null;
        }, 0);
      }
    });

    this.gridOptions = gridOptions;

    return container;
  }

  private buildTopLevelDocumentsWeights(rankingInfo: IRankingInfo, hasAtLeastOneNonZeroValue: string[]): Record<string, ITableDataSource> {
    const documentWeights: Record<string, ITableDataSource> = {};
    each(rankingInfo.documentWeights || {}, (value, key) => {
      if (contains(hasAtLeastOneNonZeroValue, key)) documentWeights[key] = { content: value || 0 };
    });
    return documentWeights;
  }
}
