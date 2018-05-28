import { ExecutionReportQueryOverrideSection } from '../../../src/ui/RelevanceInspector/ExecutionReportQueryOverrideSection';
import { EXECUTION_REPORT_SECTION, IExecutionReport } from '../../../src/ui/RelevanceInspector/ExecutionReport';

export function ExecutionReportQueryOverrideSectionTest() {
  describe('ExecutionReportQueryOverrideSection', () => {
    const getExecutionReportSection = (): IExecutionReport => {
      return {
        duration: 123,
        children: [
          {
            name: EXECUTION_REPORT_SECTION.QUERY_PARAM_OVERRIDE,
            duration: 456,
            applied: ['The first override', 'The second override'],
            result: {},
            description: 'A Query Override was applied'
          }
        ]
      };
    };

    it('should output an ag grid element as a container', async done => {
      const { container } = await new ExecutionReportQueryOverrideSection().build(getExecutionReportSection());
      expect(container.find('ag-grid-fresh')).toBeDefined();
      done();
    });

    it('should output a valid underlying ag grid data structure', async done => {
      const { gridOptions } = await new ExecutionReportQueryOverrideSection().build(getExecutionReportSection());
      expect(gridOptions.rowData[0].Applied).toContain('The first override');
      expect(gridOptions.rowData[0].Applied).toContain('The second override');
      expect(gridOptions.rowData[0].Description).toBe('A Query Override was applied');
      done();
    });
  });
}
