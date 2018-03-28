import {
  IExecutionReportSection,
  IExecutionReportSectionBuilder,
  IExecutionReport,
  EXECUTION_REPORT_SECTION,
  ExecutionReport
} from './ExecutionReport';
import { find } from 'underscore';
import { ExecutionReportGenericSection } from './ExecutionReportGenericSection';
import { TableBuilder } from './TableBuilder';
import { GenericValueOutput } from './GenericValueOutput';
import agGridModule = require('ag-grid/main');
import { Dom } from '../../utils/Dom';

export interface IExecutionReportQueryOverrideSection extends IExecutionReportSection {
  applied: string[];
}

export class ExecutionReportQueryOverrideSection implements IExecutionReportSectionBuilder {
  public async build(executionReport: IExecutionReport): Promise<{ container: Dom; gridOptions: agGridModule.GridOptions }> {
    const { container, agGridElement } = ExecutionReport.standardSectionHeader('Query Params Override');
    let gridOptions: agGridModule.GridOptions;

    const queryOverrideSection = find(executionReport.children, child => child.name == EXECUTION_REPORT_SECTION.QUERY_PARAM_OVERRIDE) as
      | IExecutionReportQueryOverrideSection
      | undefined;

    if (queryOverrideSection) {
      const dataSource = [
        {
          ...new ExecutionReportGenericSection().build(queryOverrideSection),
          Applied: new GenericValueOutput().output(queryOverrideSection.applied)
        }
      ];

      const tableBuilder = await new TableBuilder().build(dataSource, agGridElement);
      gridOptions = tableBuilder.gridOptions;
    }

    return { container, gridOptions };
  }
}
