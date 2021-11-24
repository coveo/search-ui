import { IExecutionReport, IExecutionReportSectionBuilder, EXECUTION_REPORT_SECTION, ExecutionReport } from './ExecutionReport';
import { findWhere, each, contains } from 'underscore';
import { GenericValueOutput } from './GenericValueOutput';
import { $$, Dom } from '../../utils/Dom';

export interface IExecutionReportEffectiveIndexQuerySection {
  result: {
    in: Record<string, any>;
  };
}

const collapsibleSectionsInReport: string[] = ['Facets', 'RankingOverrides', 'RankingExpressions'];

export class ExecutionReportEffectiveIndexQuerySection implements IExecutionReportSectionBuilder {
  public async build(executionReport: IExecutionReport): Promise<{ container: Dom }> {
    const { container } = ExecutionReport.standardSectionHeader('Query sent to index');

    const table = $$('table', {
      className: 'coveo-relevance-inspector-table'
    });

    container.append(table.el);

    const indexQuerySection = findWhere(executionReport.children, { description: EXECUTION_REPORT_SECTION.INDEX_QUERY });

    if (indexQuerySection) {
      each(indexQuerySection.result.in, (paramValue: string, paramKey: string) => {
        const row = $$('tr');
        table.append(row.el);

        const id = `executionReportIndexExecution${paramKey}`;

        if (contains(collapsibleSectionsInReport, paramKey) && paramValue) {
          const btn = $$(
            'button',
            {
              className: 'coveo-button',
              type: 'button'
            },
            paramKey
          );

          const tdTarget = $$(
            'td',
            {
              id,
              className: 'coveo-relevance-inspector-effective-query-collapsible'
            },
            new GenericValueOutput().output(paramValue).content
          );

          btn.on('click', () => {
            tdTarget.toggleClass('coveo-active');
          });

          row.append($$('td', undefined, btn).el);
          row.append(tdTarget.el);
        } else {
          row.append($$('td', undefined, paramKey).el);
          row.append($$('td', undefined, new GenericValueOutput().output(paramValue).content).el);
        }
      });
    }
    return { container };
  }
}
