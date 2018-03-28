import { MockEnvironmentBuilder, IMockEnvironment } from '../../MockEnvironment';
import { AvailableFieldsTable } from '../../../src/ui/RelevanceInspector/AvailableFieldsTable';
import { IFieldDescription } from '../../../src/rest/FieldDescription';
import { findWhere } from 'underscore';

export function AvailableFieldsTableTest() {
  describe('AvailableFieldsTable', () => {
    let bindings: IMockEnvironment;
    let spy: jasmine.Spy;

    beforeEach(() => {
      bindings = new MockEnvironmentBuilder().build();
      const fieldsDescription: IFieldDescription[] = [
        {
          name: 'foo',
          defaultValue: null,
          description: 'foo',
          fieldSourceType: null,
          fieldType: 'String',
          groupByField: true,
          includeInQuery: true,
          includeInResults: true,
          sortByField: true,
          splitGroupByField: true,
          type: 'String'
        },
        {
          name: 'bar',
          defaultValue: null,
          description: 'bar',
          fieldSourceType: null,
          fieldType: 'Double',
          groupByField: false,
          includeInQuery: false,
          includeInResults: false,
          sortByField: false,
          splitGroupByField: false,
          type: 'Double'
        }
      ];

      spy = jasmine.createSpy('listFields');
      spy.and.returnValue(fieldsDescription);
      bindings.searchEndpoint.listFields = spy;
    });

    it('should return an element for ag-grid', async done => {
      const built = await new AvailableFieldsTable(bindings).build();
      expect(built.find('ag-theme-fresh')).toBeDefined();
      done();
    });

    it('should call list fields value', async done => {
      await new AvailableFieldsTable(bindings).build();
      expect(spy).toHaveBeenCalled();
      done();
    });

    it('should build the proper underlying ag grid structure', async done => {
      const fieldTable = new AvailableFieldsTable(bindings);
      await fieldTable.build();
      ['Name', 'Description', 'Include In Query', 'Group By Field'].forEach(headerName => {
        expect(findWhere(fieldTable.gridOptions.columnDefs, { headerName })).toBeDefined();
      });
      expect(fieldTable.gridOptions.rowData[0].Name).toBe('foo');
      expect(fieldTable.gridOptions.rowData[1].Name).toBe('bar');
      done();
    });
  });
}
