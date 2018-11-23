import {
  ExecutionReportAuthenticationSection,
  IExecutionReportAuthenticationSection
} from '../../../src/ui/RelevanceInspector/ExecutionReportAuthenticationSection';
import { EXECUTION_REPORT_SECTION, IExecutionReport } from '../../../src/ui/RelevanceInspector/ExecutionReport';

export function ExecutionReportAuthenticationSectionTest() {
  const getExecutionReportSection = (): IExecutionReport => {
    return {
      duration: 123,
      children: [
        <IExecutionReportAuthenticationSection>{
          name: EXECUTION_REPORT_SECTION.PERFORM_AUTHENTICATION,
          duration: 456,
          configured: {
            primary: 'CloudToken',
            secondary: ['sso'],
            mandatory: []
          },
          result: {
            userIds: [
              {
                name: 'bob',
                provider: 'email',
                info: {},
                kind: 'User'
              }
            ],
            userGroups: [],
            queryRestrictions: {
              pipeline: 'a pipeline',
              filter: 'a filter'
            },
            roles: ['queryExecutor']
          },
          description: 'Perform Authentication'
        }
      ]
    };
  };

  describe('ExecutionReportAuthenticationSection', () => {
    it('should output an ag grid element as a container', async done => {
      const { container } = await new ExecutionReportAuthenticationSection().build(getExecutionReportSection());
      expect(container.find('ag-grid-fresh')).toBeDefined();
      done();
    });

    it('should ouput a valid underlying ag grid data structure for each user ids', async done => {
      const { gridOptions } = await new ExecutionReportAuthenticationSection().build(getExecutionReportSection());
      const usersIdsColumn = gridOptions.columnDefs[3]['children'][0];
      expect(usersIdsColumn.children.length).toBe(1);
      expect(usersIdsColumn.children[0].headerName).toBe('bob');
      expect(usersIdsColumn.children[0].children[0].headerName).toBe('Kind');
      expect(usersIdsColumn.children[0].children[1].headerName).toBe('Provider');
      expect(usersIdsColumn.children[0].children[2].headerName).toBe('Info');
      done();
    });

    it('should output a valid underlying ag grid data structure for the query restriction', async done => {
      const { gridOptions } = await new ExecutionReportAuthenticationSection().build(getExecutionReportSection());
      const pipelineRestrictionColumn = gridOptions.columnDefs[3]['children'][1];
      expect(pipelineRestrictionColumn.headerName).toBe('Query restriction');
      expect(pipelineRestrictionColumn.children.length).toBe(2);
      expect(pipelineRestrictionColumn.children[0].headerName).toBe('pipeline');
      expect(pipelineRestrictionColumn.children[0].content).toBe('a pipeline');
      expect(pipelineRestrictionColumn.children[1].headerName).toBe('filter');
      expect(pipelineRestrictionColumn.children[1].content).toBe('a filter');
      done();
    });
  });
}
