import { ExecutionReport, IExecutionReport } from '../../../src/ui/RelevanceInspector/ExecutionReport';
import { IComponentBindings } from '../../../src/ui/Base/ComponentBindings';
import { IQueryResults } from '../../../src/rest/QueryResults';
import { MockEnvironmentBuilder } from '../../MockEnvironment';
import { FakeResults } from '../../Fake';

export function ExecutionReportTest() {
  describe('ExecutionReport', () => {
    let bindings: IComponentBindings;
    let results: IQueryResults;

    const getExecutionReport = (): IExecutionReport => {
      return {
        children: [],
        duration: 123
      };
    };

    beforeEach(() => {
      bindings = new MockEnvironmentBuilder().build();
      results = FakeResults.createFakeResults();
      results.executionReport = getExecutionReport();
    });

    it('should be able to build a standard section header element', () => {
      const { agGridElement, container } = ExecutionReport.standardSectionHeader('foo');
      expect(container.find('h4').textContent).toBe('foo');
      expect(agGridElement.hasClass('ag-theme-fresh')).toBeTruthy();
    });

    it('should build a top level container', async done => {
      const built = await new ExecutionReport(results, bindings).build();
      expect(built.hasClass('execution-report-debug')).toBeTruthy();
      done();
    });

    it('should not throw if there is no execution report available on the results', done => {
      delete results.executionReport;
      expect(async () => await new ExecutionReport(results, bindings).build()).not.toThrow();
      done();
    });

    it('should expose a grid option with an API to resize all the child grids at the same time', async done => {
      const execReport = new ExecutionReport(results, bindings);
      await execReport.build();
      expect(execReport.gridOptions.api).toBeDefined();
      expect(() => execReport.gridOptions.api.sizeColumnsToFit()).not.toThrow();
      done();
    });
  });
}
