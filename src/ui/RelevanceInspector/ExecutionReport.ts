import { ExecutionReportAuthenticationSection } from './ExecutionReportAuthenticationSection';
import { ExecutionReportResolvedPipelineSection } from './ExecutionReportResolvedPipelineSection';
import { ExecutionReportQueryOverrideSection } from './ExecutionReportQueryOverrideSection';
import { ExecutionReportSimpleSection } from './ExecutionReportSimpleSection';
import { ExecutionReportEffectiveIndexQuerySection } from './ExecutionReportEffectiveIndexQuerySection';
import { IQueryResults } from '../../rest/QueryResults';
import { $$, Dom } from '../../UtilsModules';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IRelevanceInspectorTab } from './RelevanceInspector';
import agGridModule = require('ag-grid/main');

export interface IExecutionReport {
  duration: number;
  children: IExecutionReportSection[];
}

export enum EXECUTION_REPORT_SECTION {
  PERFORM_AUTHENTICATION = 'PerformAuthentication',
  RESOLVE_PIPELINE = 'ResolvePipeline',
  QUERY_PARAM_OVERRIDE = 'ApplyQueryParamOverrideFeature',
  THESAURUS = 'ApplyThesaurusFeature',
  PREPROCESS_QUERY_EXPRESSION = 'PreprocessQueryExpression',
  PREPROCESS_QUERY = 'PreprocessQuery',
  STOP_WORDS = 'ApplyStopWordFeature',
  FILTERS = 'ApplyFilterFeature',
  RANKING = 'ApplyRankingFeature',
  TOP_RESULT = 'ApplyTopResultFeature',
  RANKING_WEIGHT = 'ApplyRankingWeightFeature',
  INDEX_QUERY = 'Send query to index'
}

export interface IExecutionReportSection {
  name: string;
  duration: number;
  result: Record<string, any>;
  description: string;
  children?: IExecutionReportSection[];
}

export interface IExecutionReportSectionBuilder {
  build(executionReport: IExecutionReport): Promise<{ container: Dom; gridOptions?: agGridModule.GridOptions }>;
}

export class ExecutionReport implements IRelevanceInspectorTab {
  public gridOptions: agGridModule.GridOptions;
  constructor(public results: IQueryResults, public bindings: IComponentBindings) {}

  public static standardSectionHeader(title: string) {
    const container = $$('div', { className: 'card' });

    const containerBody = $$(
      'div',
      {
        className: 'card-body'
      },
      $$(
        'h4',
        {
          className: 'card-title'
        },
        title
      )
    );

    const agGridElement = $$('div', {
      className: 'ag-theme-fresh'
    });

    container.append(containerBody.el);
    containerBody.append(agGridElement.el);
    return {
      container,
      containerBody,
      agGridElement
    };
  }

  public async build() {
    const container = $$('div', {
      className: 'execution-report-debug'
    });

    const gridOptions: agGridModule.GridOptions[] = [];

    const authenticationSection = await new ExecutionReportAuthenticationSection().build(this.results.executionReport);
    container.append(authenticationSection.container.el);
    if (authenticationSection.gridOptions) {
      gridOptions.push(authenticationSection.gridOptions);
    }

    const resolvedPipelineSection = await new ExecutionReportResolvedPipelineSection().build(this.results.executionReport);
    container.append(resolvedPipelineSection.container.el);
    if (resolvedPipelineSection.gridOptions) {
      gridOptions.push(resolvedPipelineSection.gridOptions);
    }

    const queryParamOverrideSection = await new ExecutionReportQueryOverrideSection().build(this.results.executionReport);
    container.append(queryParamOverrideSection.container.el);
    if (queryParamOverrideSection.gridOptions) {
      gridOptions.push(queryParamOverrideSection.gridOptions);
    }

    const thesaurusSection = await new ExecutionReportSimpleSection(
      EXECUTION_REPORT_SECTION.PREPROCESS_QUERY_EXPRESSION,
      EXECUTION_REPORT_SECTION.THESAURUS,
      'Thesaurus'
    ).build(this.results.executionReport);

    container.append(thesaurusSection.container.el);
    if (thesaurusSection.gridOptions) {
      gridOptions.push(thesaurusSection.gridOptions);
    }

    const stopWordsSection = await new ExecutionReportSimpleSection(
      EXECUTION_REPORT_SECTION.PREPROCESS_QUERY_EXPRESSION,
      EXECUTION_REPORT_SECTION.STOP_WORDS,
      'Stop words'
    ).build(this.results.executionReport);
    container.append(stopWordsSection.container.el);
    if (stopWordsSection.gridOptions) {
      gridOptions.push(stopWordsSection.gridOptions);
    }

    const filtersSection = await new ExecutionReportSimpleSection(
      EXECUTION_REPORT_SECTION.PREPROCESS_QUERY,
      EXECUTION_REPORT_SECTION.FILTERS,
      'Filters'
    ).build(this.results.executionReport);
    container.append(filtersSection.container.el);
    if (filtersSection.gridOptions) {
      gridOptions.push(filtersSection.gridOptions);
    }

    const rankingSection = await new ExecutionReportSimpleSection(
      EXECUTION_REPORT_SECTION.PREPROCESS_QUERY,
      EXECUTION_REPORT_SECTION.RANKING,
      'Ranking'
    ).build(this.results.executionReport);
    container.append(rankingSection.container.el);
    if (rankingSection.gridOptions) {
      gridOptions.push(rankingSection.gridOptions);
    }

    const topResultsSection = await new ExecutionReportSimpleSection(
      EXECUTION_REPORT_SECTION.PREPROCESS_QUERY,
      EXECUTION_REPORT_SECTION.TOP_RESULT,
      'Featured Results'
    ).build(this.results.executionReport);
    container.append(topResultsSection.container.el);
    if (topResultsSection.gridOptions) {
      gridOptions.push(topResultsSection.gridOptions);
    }

    const rankingWeightsSection = await new ExecutionReportSimpleSection(
      EXECUTION_REPORT_SECTION.PREPROCESS_QUERY,
      EXECUTION_REPORT_SECTION.RANKING_WEIGHT,
      'Ranking weights'
    ).build(this.results.executionReport);
    container.append(rankingWeightsSection.container.el);
    if (rankingWeightsSection.gridOptions) {
      gridOptions.push(rankingWeightsSection.gridOptions);
    }

    const indexQuerySection = await new ExecutionReportEffectiveIndexQuerySection().build(this.results.executionReport);
    container.append(indexQuerySection.container.el);

    this.gridOptions = {
      api: {
        sizeColumnsToFit: () => {
          gridOptions.forEach(option => (option.api ? option.api.sizeColumnsToFit() : null));
        }
      }
    } as any;

    return container;
  }
}
