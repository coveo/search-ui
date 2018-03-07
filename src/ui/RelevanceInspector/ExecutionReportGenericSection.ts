import { IExecutionReportSection } from './ExecutionReport';
import { GenericValueOutput } from './GenericValueOutput';

export class ExecutionReportGenericSection {
  public build(executionReportSection: IExecutionReportSection) {
    return {
      ...this.descriptionSection(executionReportSection),
      ...this.durationSection(executionReportSection)
    };
  }

  private descriptionSection(executionReportSection: IExecutionReportSection) {
    return {
      Description: new GenericValueOutput().output(executionReportSection.description)
    };
  }

  private durationSection(executionReportSection: IExecutionReportSection) {
    return {
      Duration: new GenericValueOutput().output(`${executionReportSection.duration} ms`)
    };
  }
}
