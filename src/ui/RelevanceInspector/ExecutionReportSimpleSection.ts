import {
  IExecutionReportSectionBuilder,
  EXECUTION_REPORT_SECTION,
  IExecutionReportSection,
  IExecutionReport,
  ExecutionReport
} from './ExecutionReport';
import { findWhere, find } from 'underscore';
import { ExecutionReportGenericSection } from './ExecutionReportGenericSection';
import { GenericValueOutput } from './GenericValueOutput';
import { TableBuilder } from './TableBuilder';
import agGridModule = require('ag-grid/main');
import { Dom } from '../../Core';

export interface IExecutionReportSimpleSection extends IExecutionReportSection {
  applied: string[];
}

export class ExecutionReportSimpleSection implements IExecutionReportSectionBuilder {
  public constructor(
    public topLevelProperty: EXECUTION_REPORT_SECTION,
    public secondLevelProperty: EXECUTION_REPORT_SECTION,
    public sectionTitle: string
  ) {}

  public async build(executionReport: IExecutionReport): Promise<{ container: Dom; gridOptions: agGridModule.GridOptions }> {
    const { container, agGridElement } = ExecutionReport.standardSectionHeader(this.sectionTitle);
    let gridOptions: agGridModule.GridOptions;
    const topLevelProperty = find(executionReport.children, child => {
      return child.name == this.topLevelProperty && child.children && !!findWhere(child.children, { name: this.secondLevelProperty });
    });

    if (topLevelProperty && topLevelProperty.children) {
      const secondLevelProperty = findWhere(topLevelProperty.children, { name: this.secondLevelProperty }) as
        | IExecutionReportSimpleSection
        | undefined;

      if (secondLevelProperty) {
        const dataSource = [
          {
            ...new ExecutionReportGenericSection().build(secondLevelProperty),
            ...{ Applied: new GenericValueOutput().output(secondLevelProperty.applied) }
          }
        ];

        const tableBuilder = await new TableBuilder().build(dataSource, agGridElement);
        gridOptions = tableBuilder.gridOptions;
      }
    } else {
      const tableBuilder = await new TableBuilder().build(
        [
          {
            [`${this.sectionTitle}`]: {
              content: `NO DATA AVAILABLE FOR ${this.sectionTitle} IN CURRENT EXECUTION REPORT`
            }
          }
        ],
        agGridElement
      );

      gridOptions = tableBuilder.gridOptions;
    }

    return { container, gridOptions };
  }
}
