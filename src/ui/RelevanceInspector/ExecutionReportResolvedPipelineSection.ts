import {
  IExecutionReportSection,
  IExecutionReport,
  EXECUTION_REPORT_SECTION,
  IExecutionReportSectionBuilder,
  ExecutionReport
} from './ExecutionReport';
import { find } from 'underscore';
import { ExecutionReportGenericSection } from './ExecutionReportGenericSection';
import { TableBuilder } from './TableBuilder';
import { GenericValueOutput } from './GenericValueOutput';
import agGridModule = require('ag-grid/main');
import { Dom } from '../../utils/Dom';

export interface IExecutionReportResolvePipelineSection extends IExecutionReportSection {
  result: {
    pipeline: string;
    splitTest: {
      name: string;
      ratio: number;
    };
  };
}

export class ExecutionReportResolvedPipelineSection implements IExecutionReportSectionBuilder {
  public async build(executionReport: IExecutionReport): Promise<{ container: Dom; gridOptions: agGridModule.GridOptions }> {
    const { container, agGridElement } = ExecutionReport.standardSectionHeader('Pipeline');
    let gridOptions: agGridModule.GridOptions;

    const resolvedPipelineSection = find(executionReport.children, child => child.name == EXECUTION_REPORT_SECTION.RESOLVE_PIPELINE) as
      | IExecutionReportResolvePipelineSection
      | undefined;

    if (resolvedPipelineSection) {
      const dataSource = [
        {
          ...new ExecutionReportGenericSection().build(resolvedPipelineSection),
          ...{ Pipeline: new GenericValueOutput().output(resolvedPipelineSection.result.pipeline) },
          ...{ 'Split Test': new GenericValueOutput().output(resolvedPipelineSection.result.splitTest) }
        }
      ];

      const tableBuilder = await new TableBuilder().build(dataSource, agGridElement);
      gridOptions = tableBuilder.gridOptions;
    }

    return { container, gridOptions };
  }
}
