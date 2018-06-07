import { ExecutionReportEffectiveIndexQuerySection } from '../../../src/ui/RelevanceInspector/ExecutionReportEffectiveIndexQuerySection';
import { IExecutionReport, EXECUTION_REPORT_SECTION } from '../../../src/ui/RelevanceInspector/ExecutionReport';

export function ExecutionReportEffectiveIndexQueryTest() {
  describe('ExecutionReportEffectiveIndex', () => {
    const getExecutionReportSection = (): IExecutionReport => {
      return {
        duration: 999,
        children: [
          {
            name: 'Send Query To Index',
            duration: 123,
            result: {
              in: {
                'Step 1': 'foo',
                'Step 2': ['bar', 'buzz'],
                RankingOverrides: [{ override: 'one' }, { override: 'two' }],
                Facets: [{ facet: 'one' }, { facet: 'two' }],
                RankingExpressions: [{ expression: 'one' }, { expression: 'two' }]
              }
            },
            description: EXECUTION_REPORT_SECTION.INDEX_QUERY
          }
        ]
      };
    };

    it('should build the output as a table', async done => {
      const built = await new ExecutionReportEffectiveIndexQuerySection().build(getExecutionReportSection());
      expect(built.container.find('table')).toBeDefined();
      done();
    });

    it('should output different rows for each section of the index execution report', async done => {
      const built = await new ExecutionReportEffectiveIndexQuerySection().build(getExecutionReportSection());
      expect(built.container.findAll('tr').length).toBe(Object.keys(getExecutionReportSection().children[0].result.in).length);
      done();
    });

    it('should output a button that will allow to toggle collapse for specific section of the report', async done => {
      const built = await new ExecutionReportEffectiveIndexQuerySection().build(getExecutionReportSection());
      const allButtons = built.container.findAll('button');
      expect(allButtons.length).toBe(3);
      expect(allButtons[0].textContent).toBe('RankingOverrides');
      expect(allButtons[1].textContent).toBe('Facets');
      expect(allButtons[2].textContent).toBe('RankingExpressions');
      done();
    });
  });
}
