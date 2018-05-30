import { ExecutionReportGenericSection } from '../../../src/ui/RelevanceInspector/ExecutionReportGenericSection';
import { IExecutionReportSection } from '../../../src/ui/RelevanceInspector/ExecutionReport';

export function ExecutionReportGenericSectionTest() {
  describe('ExecutionReportGenericSection', () => {
    const getExecutionReportSection = (): IExecutionReportSection => {
      return {
        description: 'a description',
        name: 'a name',
        duration: 123,
        result: { 'a result': 'foo' }
      };
    };

    it('should output a description section', () => {
      const { Description } = new ExecutionReportGenericSection().build(getExecutionReportSection());
      expect(Description.content).toBe('a description');
    });

    it('should output a duration section', () => {
      const { Duration } = new ExecutionReportGenericSection().build(getExecutionReportSection());
      expect(Duration.content).toBe('123 ms');
    });
  });
}
