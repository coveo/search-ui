import {
  IExecutionReport,
  EXECUTION_REPORT_SECTION,
  IExecutionReportSection,
  IExecutionReportSectionBuilder,
  ExecutionReport
} from './ExecutionReport';
import { TableBuilder } from './TableBuilder';
import { find, map } from 'underscore';
import { ExecutionReportGenericSection } from './ExecutionReportGenericSection';
import { GenericValueOutput, GenericValueOutputType } from './GenericValueOutput';
import agGridModule = require('ag-grid/main');
import { Dom } from '../../utils/Dom';

export interface IUserIDExecutionReport {
  name: string;
  kind: string;
  provider: string;
  info: Record<string, string>;
}

export interface IExecutionReportAuthenticationSection extends IExecutionReportSection {
  name: 'PerformAuthentication';
  configured: {
    primary: string;
    secondary: string[];
    mandatory: string[];
  };
  result: {
    userIds: IUserIDExecutionReport[];
    queryRestrictions: Record<string, string>;
    roles: string[];
    userGroups: string[];
  };
}

export class ExecutionReportAuthenticationSection implements IExecutionReportSectionBuilder {
  public async build(executionReport: IExecutionReport): Promise<{ container: Dom; gridOptions: agGridModule.GridOptions }> {
    const { container, agGridElement } = ExecutionReport.standardSectionHeader('Authentication');
    let gridOptions: agGridModule.GridOptions;
    const authenticationSection = find(executionReport.children, child => child.name == EXECUTION_REPORT_SECTION.PERFORM_AUTHENTICATION) as
      | IExecutionReportAuthenticationSection
      | undefined;

    if (authenticationSection) {
      const dataSource = [
        {
          ...new ExecutionReportGenericSection().build(authenticationSection),
          ...this.configurationSection(authenticationSection),
          ...this.pipelineOuputSection(authenticationSection)
        }
      ];

      const tableBuilder = await new TableBuilder().build(dataSource, agGridElement, {
        rowHeight: 150
      });
      gridOptions = tableBuilder.gridOptions;
    }

    return { container, gridOptions };
  }

  private configurationSection(authenticationSection: IExecutionReportAuthenticationSection) {
    return {
      Configured: {
        children: [
          {
            Primary: this.genericOutput(authenticationSection.configured.primary),
            Secondary: this.genericOutput(authenticationSection.configured.secondary),
            Mandatory: this.genericOutput(authenticationSection.configured.mandatory)
          }
        ]
      }
    };
  }

  private pipelineOuputSection(authenticationSection: IExecutionReportAuthenticationSection) {
    return {
      'Pipeline Output': {
        children: [
          {
            'User ids': {
              children: this.usersIds(authenticationSection.result.userIds)
            },
            'Query restriction': {
              children: this.queryRestrictions(authenticationSection.result.queryRestrictions)
            },
            Roles: { ...this.genericOutput(authenticationSection.result.roles), width: 200 },
            'User groups': this.genericOutput(authenticationSection.result.userGroups)
          }
        ]
      }
    };
  }

  private usersIds(userIds: IUserIDExecutionReport[]) {
    return map(userIds, userId => {
      return {
        [userId.name]: {
          children: [
            {
              Kind: this.genericOutput(userId.kind),
              Provider: { ...this.genericOutput(userId.provider), width: 150 },
              Info: { content: userId.info }
            }
          ]
        }
      };
    });
  }

  private genericOutput(section: GenericValueOutputType) {
    return new GenericValueOutput().output(section);
  }

  private queryRestrictions(queryRestrictions: Record<string, string>) {
    return map(queryRestrictions, (value, key) => {
      return {
        [key]: this.genericOutput(value)
      };
    });
  }
}
