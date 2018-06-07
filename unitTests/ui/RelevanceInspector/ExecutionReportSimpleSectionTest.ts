import { EXECUTION_REPORT_SECTION, IExecutionReport } from '../../../src/ui/RelevanceInspector/ExecutionReport';
import { ExecutionReportSimpleSection } from '../../../src/ui/RelevanceInspector/ExecutionReportSimpleSection';

export function ExecutionReportSimpleSectionTest() {
  describe('ExecutionReportSimpleSection', () => {
    const getExecutionReportSection = (): IExecutionReport => {
      return {
        duration: 123,
        children: [
          {
            name: EXECUTION_REPORT_SECTION.PREPROCESS_QUERY_EXPRESSION,
            duration: 456,
            result: {},
            description: EXECUTION_REPORT_SECTION.PREPROCESS_QUERY_EXPRESSION,
            children: [
              {
                name: EXECUTION_REPORT_SECTION.THESAURUS,
                duration: 789,
                description: 'Thesaurus',
                result: {},
                applied: ['foo', 'bar', 'expand foo to bar']
              }
            ]
          }
        ]
      };
    };

    it('should be able to build a simple table using the specified section of the report', async done => {
      const { container } = await new ExecutionReportSimpleSection(
        EXECUTION_REPORT_SECTION.PREPROCESS_QUERY_EXPRESSION,
        EXECUTION_REPORT_SECTION.THESAURUS,
        'Thesaurus'
      ).build(getExecutionReportSection());

      expect(container.find('ag-grid-fresh')).toBeDefined();
      done();
    });

    it('should be able to build the correct underlying ag grid structure using the specified section of the report', async done => {
      const { gridOptions } = await new ExecutionReportSimpleSection(
        EXECUTION_REPORT_SECTION.PREPROCESS_QUERY_EXPRESSION,
        EXECUTION_REPORT_SECTION.THESAURUS,
        'Thesaurus'
      ).build(getExecutionReportSection());

      expect(gridOptions.rowData[0].Description).toBe('Thesaurus');
      expect(gridOptions.rowData[0].Duration).toBe('789 ms');
      done();
    });

    it('should be able to output a generic message if a section is not found in the report', async done => {
      const { gridOptions } = await new ExecutionReportSimpleSection(
        EXECUTION_REPORT_SECTION.PREPROCESS_QUERY,
        EXECUTION_REPORT_SECTION.STOP_WORDS,
        'Stop Words'
      ).build(getExecutionReportSection());

      expect(gridOptions.rowData[0]['Stop Words']).toContain('NO DATA AVAILABLE');
      done();
    });
  });
}
