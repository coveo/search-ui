import agGridModule = require('ag-grid/main');
import {
  IExecutionReportSectionBuilder,
  IExecutionReport,
  ExecutionReport,
  EXECUTION_REPORT_SECTION,
  IExecutionReportSection
} from './ExecutionReport';
import { find } from 'underscore';
import { ExecutionReportGenericSection } from './ExecutionReportGenericSection';
import { GenericValueOutput } from './GenericValueOutput';
import { TableBuilder } from './TableBuilder';
import { Dom } from '../../utils/Dom';

export interface IExecutionReportITDSection extends IExecutionReportSection {
  refinedQueries: string[];
}

export interface IExecutionReportMLTopClicksInput extends IExecutionReportSection {
  largeQueryKeywords: string[];
}

export class ExecutionReportITDSection implements IExecutionReportSectionBuilder {
  public async build(executionReport: IExecutionReport): Promise<{ container: Dom; gridOptions: agGridModule.GridOptions }> {
    const { container, agGridElement } = ExecutionReport.standardSectionHeader('Large Query Intelligent Term Detection (ITD)');
    let gridOptions: agGridModule.GridOptions;

    const preprocessQuerySection = find(executionReport.children, child => child.name == EXECUTION_REPORT_SECTION.PREPROCESS_QUERY);

    if (preprocessQuerySection) {
      const originalLongQuery = preprocessQuerySection.result.in.lq;
      const topClicksSection = find(preprocessQuerySection.children, child => child.name == EXECUTION_REPORT_SECTION.TOP_CLICKS) as
        | IExecutionReportITDSection
        | undefined;
      if (topClicksSection) {
        const dataSource = [
          {
            ...new ExecutionReportGenericSection().build(topClicksSection),
            'Original large query': new GenericValueOutput().output(originalLongQuery),
            'Keyword(s) extracted by machine learning': new GenericValueOutput().output(topClicksSection.refinedQueries)
          }
        ];

        const tableBuilder = await new TableBuilder().build(dataSource, agGridElement);
        gridOptions = tableBuilder.gridOptions;
      }
    }

    return { container, gridOptions };
  }
}
