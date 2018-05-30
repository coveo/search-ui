import { IExecutionReport, EXECUTION_REPORT_SECTION } from '../../../src/ui/RelevanceInspector/ExecutionReport';
import { ExecutionReportResolvedPipelineSection } from '../../../src/ui/RelevanceInspector/ExecutionReportResolvedPipelineSection';

export function ExecutionReportResolvedPipelineSectionTest() {
  describe('ExecutionReportResolvedPipeline', () => {
    const getExecutionReportSection = (): IExecutionReport => {
      return {
        duration: 123,
        children: [
          {
            name: EXECUTION_REPORT_SECTION.RESOLVE_PIPELINE,
            duration: 456,
            result: {
              pipeline: 'A Pipeline',
              splitTest: 'A Split Test'
            },
            description: 'A pipeline was resolved'
          }
        ]
      };
    };

    it('should output an ag grid element as a container', async done => {
      const { container } = await new ExecutionReportResolvedPipelineSection().build(getExecutionReportSection());
      expect(container.find('ag-grid-fresh')).toBeDefined();
      done();
    });

    it('should output a valid underlying data structure for ag grid', async done => {
      const { gridOptions } = await new ExecutionReportResolvedPipelineSection().build(getExecutionReportSection());

      expect(gridOptions.rowData[0].Description).toBe('A pipeline was resolved');
      expect(gridOptions.rowData[0].Duration).toBe('456 ms');
      expect(gridOptions.rowData[0].Pipeline).toBe('A Pipeline');
      expect(gridOptions.rowData[0]['Split Test']).toBe('A Split Test');
      done();
    });
  });
}
