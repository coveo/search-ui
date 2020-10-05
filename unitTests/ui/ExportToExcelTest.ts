import * as Mock from '../MockEnvironment';
import { ExportToExcel } from '../../src/ui/ExportToExcel/ExportToExcel';
import { IExportToExcelOptions } from '../../src/ui/ExportToExcel/ExportToExcel';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function ExportToExcelTest() {
  describe('ExportToExcel', function() {
    let options: IExportToExcelOptions = {};
    let test: Mock.IBasicComponentSetup<ExportToExcel>;

    function initExportToExcel() {
      test = Mock.optionsComponentSetup<ExportToExcel, IExportToExcelOptions>(ExportToExcel, options);
      test.cmp._window = Mock.mockWindow();
    }

    function buildDownloadBinarySpy() {
      const spy = jasmine.createSpy('searchEndpoint');
      spy.and.returnValue(Promise.resolve(new ArrayBuffer(0)));
      return spy;
    }

    beforeEach(function() {
      options = {};
      initExportToExcel();
    });

    describe('exposes options', function() {
      it('numberOfResults calls search endpoint with appropriate number of results', function() {
        options.numberOfResults = 200;
        initExportToExcel();

        const spy = buildDownloadBinarySpy();
        test.env.searchEndpoint.downloadBinary = spy;

        test.cmp.download();

        expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ numberOfResults: 200 }));
      });

      it('fieldsToInclude allows to specify the needed fields to download', () => {
        options.fieldsToInclude = ['@foo', '@bar'];
        initExportToExcel();

        const spy = buildDownloadBinarySpy();
        test.env.searchEndpoint.downloadBinary = spy;

        test.cmp.download();

        expect(spy).toHaveBeenCalledWith(
          jasmine.objectContaining({
            fieldsToInclude: jasmine.arrayContaining(['@foo', '@bar'])
          })
        );
      });

      it('fieldsToInclude not being specified means the fields to include will be "null" in the query', () => {
        options.fieldsToInclude = null;
        initExportToExcel();

        const spy = buildDownloadBinarySpy();
        test.env.searchEndpoint.downloadBinary = spy;

        test.cmp.download();

        expect(spy).not.toHaveBeenCalledWith(
          jasmine.objectContaining({
            fieldsToInclude: jasmine.anything()
          })
        );
      });
    });

    describe('when query was made', function() {
      beforeEach(function() {
        test.env.queryController.getLastQuery = () => new QueryBuilder().build();
        test.env.searchEndpoint.downloadBinary = buildDownloadBinarySpy();
      });

      it('download should call exportToExcel event if query was made', function() {
        const excelSpy = jasmine.createSpy('excelSpy');
        test.env.usageAnalytics.logCustomEvent = excelSpy;
        test.cmp.download();
        expect(excelSpy).toHaveBeenCalledWith(analyticsActionCauseList.exportToExcel, {}, test.env.element);
      });

      it('download should create an object url and revoke it', async () => {
        const createObjectUrlSpy = jasmine.createSpy('createObjectUrl');
        const revokeObjectUrlSpy = jasmine.createSpy('revokeObjectUrl');

        window.URL.createObjectURL = createObjectUrlSpy;
        window.URL.revokeObjectURL = revokeObjectUrlSpy;

        test.cmp.download();

        await Promise.resolve({});

        expect(createObjectUrlSpy).toHaveBeenCalled();
        expect(revokeObjectUrlSpy).toHaveBeenCalled();
      });
    });
  });
}
