import * as Mock from '../MockEnvironment';
import { ExportToExcel } from '../../src/ui/ExportToExcel/ExportToExcel';
import { IExportToExcelOptions } from '../../src/ui/ExportToExcel/ExportToExcel';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import _ = require('underscore');

export function ExportToExcelTest() {
  describe('ExportToExcel', function() {
    let test: Mock.IBasicComponentSetup<ExportToExcel>;

    beforeEach(function() {
      test = Mock.basicComponentSetup<ExportToExcel>(ExportToExcel);
      test.cmp._window = Mock.mockWindow();
    });

    describe('exposes options', function() {
      it('numberOfResults calls search endpoint with appropriate number of results', function() {
        test = Mock.optionsComponentSetup<ExportToExcel, IExportToExcelOptions>(ExportToExcel, <IExportToExcelOptions>{
          numberOfResults: 200
        });
        test.cmp._window = Mock.mockWindow();
        const searchEndpointSpy = jasmine.createSpy('searchEndpoint');
        test.env.searchEndpoint.getExportToExcelLink = searchEndpointSpy;
        const fakeQuery = new QueryBuilder().build();
        test.env.queryController.getLastQuery = () => fakeQuery;
        test.cmp.download();
        expect(searchEndpointSpy).toHaveBeenCalledWith(_.omit(fakeQuery, ['numberOfResults', 'fieldsToInclude']), 200);
      });

      it('fieldsToInclude allows to specify the needed fields to download', () => {
        test = Mock.optionsComponentSetup<ExportToExcel, IExportToExcelOptions>(ExportToExcel, <IExportToExcelOptions>{
          fieldsToInclude: ['@foo', '@bar']
        });
        test.cmp._window = Mock.mockWindow();
        const searchEndpointSpy = jasmine.createSpy('searchEndpoint');
        test.env.searchEndpoint.getExportToExcelLink = searchEndpointSpy;
        const fakeQuery = new QueryBuilder().build();
        test.env.queryController.getLastQuery = () => fakeQuery;
        test.cmp.download();
        expect(searchEndpointSpy).toHaveBeenCalledWith(
          jasmine.objectContaining({
            fieldsToInclude: jasmine.arrayContaining(['@foo', '@bar'])
          }),
          100
        );
      });

      it('fieldsToInclude not being specified means the fields to include will be "null" in the query', () => {
        test = Mock.optionsComponentSetup<ExportToExcel, IExportToExcelOptions>(ExportToExcel, <IExportToExcelOptions>{
          fieldsToInclude: null
        });
        test.cmp._window = Mock.mockWindow();
        const searchEndpointSpy = jasmine.createSpy('searchEndpoint');
        test.env.searchEndpoint.getExportToExcelLink = searchEndpointSpy;
        const fakeQuery = new QueryBuilder().build();
        test.env.queryController.getLastQuery = () => fakeQuery;
        test.cmp.download();
        expect(searchEndpointSpy).not.toHaveBeenCalledWith(
          jasmine.objectContaining({
            fieldsToInclude: jasmine.anything()
          }),
          100
        );
      });
    });

    describe('when query was made', function() {
      beforeEach(function() {
        test.env.queryController.getLastQuery = () => new QueryBuilder().build();
        test.env.searchEndpoint.getExportToExcelLink = () => 'http://www.excellink.com';
      });

      it('download should call exportToExcel event if query was made', function() {
        const excelSpy = jasmine.createSpy('excelSpy');
        test.env.usageAnalytics.logCustomEvent = excelSpy;
        test.cmp.download();
        expect(excelSpy).toHaveBeenCalledWith(analyticsActionCauseList.exportToExcel, {}, test.env.element);
      });

      it('download should redirect to the link provided by the search endpoint', function() {
        const windowLocationReplaceSpy = jasmine.createSpy('windowLocationReplaceSpy');
        test.cmp._window.location.replace = windowLocationReplaceSpy;
        test.cmp.download();
        expect(test.cmp._window.location.replace).toHaveBeenCalledWith('http://www.excellink.com');
      });
    });
  });
}
