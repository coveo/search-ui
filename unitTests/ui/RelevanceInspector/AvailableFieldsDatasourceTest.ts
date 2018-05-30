import { ITableDataSource } from '../../../src/ui/RelevanceInspector/TableBuilder';
import { range } from 'underscore';
import { AvailableFieldsDatasource } from '../../../src/ui/RelevanceInspector/AvailableFieldsTable';
import agGridModule = require('ag-grid/main');

export function AvailableFieldsDatasourceTest() {
  describe('AvailableFieldsDatasource', () => {
    let dataSource: Record<string, ITableDataSource>[];
    let successSpy: jasmine.Spy;
    let failSpy: jasmine.Spy;
    let fieldsDataSource: AvailableFieldsDatasource;

    const getDefaultRowsFiltering = (): agGridModule.IGetRowsParams => {
      return {
        startRow: 0,
        endRow: 50,
        successCallback: successSpy,
        failCallback: failSpy,
        sortModel: null,
        filterModel: null,
        context: null
      };
    };

    beforeEach(() => {
      dataSource = range(0, 50).map(iterator => {
        return {
          value: {
            content: iterator.toString()
          }
        };
      });

      successSpy = jasmine.createSpy('successSpy');
      failSpy = jasmine.createSpy('failSpy');
      fieldsDataSource = new AvailableFieldsDatasource(dataSource);
    });

    it('should be able to filter rows with an end row parameter', () => {
      fieldsDataSource.getRows({ ...getDefaultRowsFiltering(), startRow: 0, endRow: 10 });
      const args = successSpy.calls.mostRecent().args[0];
      expect(args[0]).toEqual({ value: '0' });
      expect(args[9]).toEqual({ value: '9' });
      expect(args.length).toBe(10);
    });

    it('should be able to filter rows with a start row parameter', () => {
      fieldsDataSource.getRows({ ...getDefaultRowsFiltering(), startRow: 40, endRow: 50 });
      const args = successSpy.calls.mostRecent().args[0];
      expect(args[0]).toEqual({ value: '40' });
      expect(args[9]).toEqual({ value: '49' });
      expect(args.length).toBe(10);
    });

    it('should be able to sort', () => {
      fieldsDataSource.getRows({ ...getDefaultRowsFiltering(), sortModel: [{ colId: 'value', sort: 'desc' }] });
      const args = successSpy.calls.mostRecent().args[0];
      expect(args[0]).toEqual({ value: '49' });
      expect(args[49]).toEqual({ value: '0' });
      expect(args.length).toBe(50);
    });

    it('should be able to filter on equals', () => {
      fieldsDataSource.getRows({ ...getDefaultRowsFiltering(), filterModel: { value: { type: 'equals', filter: '0' } } });
      const args = successSpy.calls.mostRecent().args[0];
      expect(args[0]).toEqual({ value: '0' });
      expect(args.length).toBe(1);
    });

    it('should be able to filter on notEqual', () => {
      fieldsDataSource.getRows({ ...getDefaultRowsFiltering(), filterModel: { value: { type: 'notEqual', filter: '0' } } });
      const args = successSpy.calls.mostRecent().args[0];
      expect(args[0]).not.toEqual({ value: '0' });
      expect(args.length).toBe(49);
    });

    it('should be able to filter on startsWith', () => {
      fieldsDataSource.getRows({ ...getDefaultRowsFiltering(), filterModel: { value: { type: 'startsWith', filter: '0' } } });
      const args = successSpy.calls.mostRecent().args[0];
      expect(args[0]).toEqual({ value: '0' });
      expect(args.length).toBe(1);
    });

    it('should be able to filter on endsWith', () => {
      fieldsDataSource.getRows({ ...getDefaultRowsFiltering(), filterModel: { value: { type: 'endsWith', filter: '0' } } });
      const args = successSpy.calls.mostRecent().args[0];
      expect(args[0]).toEqual({ value: '0' });
      expect(args[1]).toEqual({ value: '10' });
      expect(args[2]).toEqual({ value: '20' });
    });

    it('should be able to filter on contains', () => {
      fieldsDataSource.getRows({ ...getDefaultRowsFiltering(), filterModel: { value: { type: 'contains', filter: '0' } } });
      const args = successSpy.calls.mostRecent().args[0];
      expect(args[0]).toEqual({ value: '0' });
      expect(args[1]).toEqual({ value: '10' });
      expect(args[2]).toEqual({ value: '20' });
    });

    it('should be able to filter on notContains', () => {
      fieldsDataSource.getRows({ ...getDefaultRowsFiltering(), filterModel: { value: { type: 'notContains', filter: '0' } } });
      const args = successSpy.calls.mostRecent().args[0];
      expect(args[0]).not.toEqual({ value: '0' });
      expect(args[1]).toEqual({ value: '2' });
      expect(args[2]).toEqual({ value: '3' });
    });
  });
}
