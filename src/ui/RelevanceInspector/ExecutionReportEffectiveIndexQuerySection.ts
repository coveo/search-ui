import { IExecutionReport, IExecutionReportSectionBuilder, EXECUTION_REPORT_SECTION, ExecutionReport } from './ExecutionReport';
import { findWhere, each, contains } from 'underscore';
import { GenericValueOutput } from './GenericValueOutput';
import { $$ } from '../../UtilsModules';

export interface IExecutionReportEffectiveIndexQuerySection {
  result: {
    in: Record<string, any>;
  };
}

const collapsibleSectionsInReport: string[] = ['Facets', 'RankingOverrides', 'RankingExpressions'];

export class ExecutionReportEffectiveIndexQuerySection implements IExecutionReportSectionBuilder {
  public async build(executionReport: IExecutionReport) {
    const { container } = ExecutionReport.standardSectionHeader('Query sent to index');

    const table = $$('table', { className: 'table' });

    container.append(table.el);

    const indexQuerySection = findWhere(executionReport.children, { description: EXECUTION_REPORT_SECTION.INDEX_QUERY });

    if (indexQuerySection) {
      each(indexQuerySection.result.in, (paramValue: string, paramKey: string) => {
        const row = $$('tr');
        table.append(row.el);

        const id = `executionReportIndexExecution${paramKey}`;

        if (contains(collapsibleSectionsInReport, paramKey)) {
          row.append(
            $$(
              'td',
              undefined,
              $$('button', { className: 'btn btn-primary', 'data-toggle': 'collapse', 'data-target': `#${id}` }, paramKey)
            ).el
          );
          row.append($$('td', { id, className: 'collapse multi-collapse' }, new GenericValueOutput().output(paramValue).content).el);
        } else {
          row.append($$('td', undefined, paramKey).el);
          row.append($$('td', undefined, new GenericValueOutput().output(paramValue).content).el);
        }
      });
    }
    return { container };
  }
}
