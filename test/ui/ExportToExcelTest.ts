import * as Mock from '../MockEnvironment';
import { ExportToExcel } from '../../src/ui/ExportToExcel/ExportToExcel';
import { IExportToExcelOptions } from '../../src/ui/ExportToExcel/ExportToExcel';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import _ = require('underscore');

export function ExportToExcelTest() {
  describe('ExportToExcel', function() {
    var test: Mock.IBasicComponentSetup<ExportToExcel>;

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
        var searchEndpointSpy = jasmine.createSpy('searchEndpoint');
        test.env.searchEndpoint.getExportToExcelLink = searchEndpointSpy;
        var fakeQuery = new QueryBuilder().build();
        test.env.queryController.getLastQuery = () => fakeQuery;
        test.cmp.download();
        expect(searchEndpointSpy).toHaveBeenCalledWith(_.omit(fakeQuery, 'numberOfResults'), 200);
      });

      it('fieldsToInclude allows to specify the needed fields to download', () => {
        test = Mock.optionsComponentSetup<ExportToExcel, IExportToExcelOptions>(ExportToExcel, <IExportToExcelOptions>{
          fieldsToInclude: ['@foo', '@bar']
        });
        test.cmp._window = Mock.mockWindow();
        var searchEndpointSpy = jasmine.createSpy('searchEndpoint');
        test.env.searchEndpoint.getExportToExcelLink = searchEndpointSpy;
        var fakeQuery = new QueryBuilder().build();
        test.env.queryController.getLastQuery = () => fakeQuery;
        test.cmp.download();
        expect(searchEndpointSpy).toHaveBeenCalledWith(
          jasmine.objectContaining({
            fieldsToInclude: jasmine.arrayContaining(['@foo', '@bar'])
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
        var excelSpy = jasmine.createSpy('excelSpy');
        test.env.usageAnalytics.logCustomEvent = excelSpy;
        test.cmp.download();
        expect(excelSpy).toHaveBeenCalledWith(analyticsActionCauseList.exportToExcel, {}, test.env.element);
      });

      it('download should redirect to the link provided by the search endpoint', function() {
        var windowLocationReplaceSpy = jasmine.createSpy('windowLocationReplaceSpy');
        test.cmp._window.location.replace = windowLocationReplaceSpy;
        test.cmp.download();
        expect(test.cmp._window.location.replace).toHaveBeenCalledWith('http://www.excellink.com');
      });
    });
  });
}
