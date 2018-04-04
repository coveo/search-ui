import { IExecutionReportSection } from './ExecutionReport';
import { GenericValueOutput } from './GenericValueOutput';
import { ITableDataSource } from './TableBuilder';

export class ExecutionReportGenericSection {
  public build(executionReportSection: IExecutionReportSection): Record<string, ITableDataSource> {
    return {
      ...this.descriptionSection(executionReportSection),
      ...this.durationSection(executionReportSection)
    };
  }

  private descriptionSection(executionReportSection: IExecutionReportSection): Record<string, ITableDataSource> {
    return {
      Description: new GenericValueOutput().output(executionReportSection.description)
    };
  }

  private durationSection(executionReportSection: IExecutionReportSection): Record<string, ITableDataSource> {
    return {
      Duration: new GenericValueOutput().output(`${executionReportSection.duration} ms`)
    };
  }
}
