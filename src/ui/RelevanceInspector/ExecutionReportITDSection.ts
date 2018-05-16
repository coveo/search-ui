import agGridModule = require('ag-grid/main');
import {
  IExecutionReportSectionBuilder,
  IExecutionReport,
  ExecutionReport,
  EXECUTION_REPORT_SECTION,
  IExecutionReportSection
} from './ExecutionReport';
import { find, chain, each } from 'underscore';
import { TableBuilder, ITableDataSource, GenericHtmlRenderer } from './TableBuilder';
import { Dom, $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { StreamHighlightUtils } from '../../utils/StreamHighlightUtils';
import { ExecutionReportSimpleSection } from './ExecutionReportSimpleSection';

export type IRefinedQueriesFromTopClicks = { q: string; score: number };

export interface IExecutionReportITDSection extends IExecutionReportSection {
  refinedQueries: IRefinedQueriesFromTopClicks[];
}

export interface IExecutionReportMLTopClicksInput extends IExecutionReportSection {
  largeQueryKeywords: string[];
}

export class ExecutionReportITDSection implements IExecutionReportSectionBuilder {
  public async build(executionReport: IExecutionReport): Promise<{ container: Dom; gridOptions: agGridModule.GridOptions }> {
    const preprocessQuerySection = find(executionReport.children, child => child.name == EXECUTION_REPORT_SECTION.PREPROCESS_QUERY);
    if (!preprocessQuerySection) {
      return this.buildFallbackEmptyTable(executionReport);
    }

    const originalLongQuery = preprocessQuerySection.result.in.lq;
    const topClicksSection = find(preprocessQuerySection.children, child => child.name == EXECUTION_REPORT_SECTION.TOP_CLICKS) as
      | IExecutionReportITDSection
      | undefined;

    if (!topClicksSection || !originalLongQuery) {
      return this.buildFallbackEmptyTable(executionReport);
    }

    const { container, agGridElement } = ExecutionReport.standardSectionHeader('Large Query Intelligent Term Detection (ITD)');
    let gridOptions: agGridModule.GridOptions;

    const dataSource = [
      {
        'Original large query': this.buildOriginalLongQueryCell(originalLongQuery, topClicksSection.refinedQueries),
        'Keyword(s) extracted': this.buildRefinedQueryCell(executionReport, topClicksSection.refinedQueries, preprocessQuerySection)
      }
    ];

    const tableBuilder = await new TableBuilder().build(dataSource, agGridElement, {
      rowHeight: 300
    });
    gridOptions = tableBuilder.gridOptions;

    return { container, gridOptions };
  }

  private doHighlights(originalLongQuery: string, refinedQueries: IRefinedQueriesFromTopClicks[]) {
    const termsToHighlight = {};
    each(refinedQueries, refined => {
      termsToHighlight[refined.q] = [];
    });
    return StreamHighlightUtils.highlightStreamText(originalLongQuery, termsToHighlight, {});
  }

  private buildOriginalLongQueryCell(originalLongQuery: string, refinedQueries: IRefinedQueriesFromTopClicks[]): ITableDataSource {
    return {
      content: this.doHighlights(originalLongQuery, refinedQueries),
      cellRenderer: GenericHtmlRenderer
    };
  }

  private buildRefinedQueryCell(
    executionReport: IExecutionReport,
    refinedQueries: IRefinedQueriesFromTopClicks[],
    preprocessSection: IExecutionReportSection
  ): ITableDataSource {
    if (Utils.isNonEmptyArray(refinedQueries)) {
      return this.buildRefinedQueryByMLCell(refinedQueries);
    }

    const fallbackIndexPartialMatch = find(preprocessSection.children, child => child.name == EXECUTION_REPORT_SECTION.PARTIAL_MATCH);
    const isUsingPartialMatch = fallbackIndexPartialMatch ? fallbackIndexPartialMatch.result.out.match(/^PartialMatch/) : false;
    if (isUsingPartialMatch) {
      return this.buildRefinedQueryByPartialMatchCell(fallbackIndexPartialMatch);
    }

    return this.buildRefinedQueryNoExtraction();
  }

  private buildRefinedQueryByMLCell(refinedQueries: IRefinedQueriesFromTopClicks[]): ITableDataSource {
    const topLevelContainer = $$('div', undefined, $$('h2', undefined, 'Extraction and scoring performed using Coveo Machine Learning:'));

    const keywordsList = $$('ul');
    topLevelContainer.append(keywordsList.el);

    chain(refinedQueries)
      .map(refinedQuery => {
        const content = this.doHighlights(`Keyword: ${refinedQuery.q} ==> Score: ${refinedQuery.score}`, [refinedQuery]);
        const container = $$('li', null, content);
        return container;
      })
      .each(refinedQueryContainer => {
        keywordsList.append(refinedQueryContainer.el);
      });

    return {
      content: topLevelContainer,
      cellRenderer: GenericHtmlRenderer
    };
  }

  private buildRefinedQueryByPartialMatchCell(partialMatch: IExecutionReportSection) {
    const topLevelContainer = $$('div');
    topLevelContainer.append($$('h2', undefined, 'Coveo Machine learning was unable to suggest any refined keywords').el);
    topLevelContainer.append($$('h4', undefined, 'Fallback on Coveo Index partial match feature').el);
    const content = $$('code', undefined, partialMatch.result.out);
    topLevelContainer.append(content.el);
    return {
      content: topLevelContainer,
      cellRenderer: GenericHtmlRenderer
    };
  }

  private buildRefinedQueryNoExtraction(): ITableDataSource {
    const topLevelContainer = $$('div');
    topLevelContainer.append($$('h2', undefined, 'No keywords were extracted').el);
    topLevelContainer.append(
      $$('h4', undefined, 'The query is probably too small, or Coveo is lacking usage analytics data to return any meaningful suggestions.')
        .el
    );
    return {
      content: topLevelContainer,
      cellRenderer: GenericHtmlRenderer
    };
  }

  private buildFallbackEmptyTable(executionReport: IExecutionReport) {
    return new ExecutionReportSimpleSection(
      EXECUTION_REPORT_SECTION.NONE,
      EXECUTION_REPORT_SECTION.NONE,
      'Large Query Intelligent Term Detection (ITD)'
    ).build(executionReport);
  }
}
