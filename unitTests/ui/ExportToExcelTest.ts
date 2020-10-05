import * as Mock from '../MockEnvironment';
import { ExportToExcel } from '../../src/ui/ExportToExcel/ExportToExcel';
import { IExportToExcelOptions } from '../../src/ui/ExportToExcel/ExportToExcel';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function ExportToExcelTest() {
  describe('ExportToExcel', function() {
    let options: IExportToExcelOptions = {};
    let test: Mock.IBasicComponentSetup<ExportToExcel>;

    function initExportToExcel() {
      test = Mock.optionsComponentSetup<ExportToExcel, IExportToExcelOptions>(ExportToExcel, options);
      test.cmp._window = Mock.mockWindow();
    }

    beforeEach(function() {
      options = {};
      initExportToExcel();
    });

    describe('calling #download', () => {
      it(`calls downloadBinary with format set to 'xlsx'`, () => {
        test.cmp.download();

        expect(test.env.searchEndpoint.downloadBinary).toHaveBeenCalledWith(jasmine.objectContaining({ format: 'xlsx' }));
      });

      it('calls downloadBinary with the default number of results', () => {
        test.cmp.download();

        expect(test.env.searchEndpoint.downloadBinary).toHaveBeenCalledWith(jasmine.objectContaining({ numberOfResults: 100 }));
      });

      it('should call exportToExcel event if query was made', () => {
        const excelSpy = jasmine.createSpy('excelSpy');
        test.env.usageAnalytics.logCustomEvent = excelSpy;
        test.cmp.download();
        expect(excelSpy).toHaveBeenCalledWith(analyticsActionCauseList.exportToExcel, {}, test.env.element);
      });

      it('download should create an object url and revoke it', async done => {
        const createObjectUrlSpy = jasmine.createSpy('createObjectUrl');
        const revokeObjectUrlSpy = jasmine.createSpy('revokeObjectUrl');

        window.URL.createObjectURL = createObjectUrlSpy;
        window.URL.revokeObjectURL = revokeObjectUrlSpy;

        test.cmp.download();
        await Promise.resolve({});

        expect(createObjectUrlSpy).toHaveBeenCalled();
        expect(revokeObjectUrlSpy).toHaveBeenCalled();
        done();
      });
    });

    describe('exposes options', function() {
      it('numberOfResults calls search endpoint with appropriate number of results', function() {
        options.numberOfResults = 200;
        initExportToExcel();

        test.cmp.download();

        expect(test.env.searchEndpoint.downloadBinary).toHaveBeenCalledWith(jasmine.objectContaining({ numberOfResults: 200 }));
      });

      it('fieldsToInclude allows to specify the needed fields to download', () => {
        options.fieldsToInclude = ['@foo', '@bar'];
        initExportToExcel();

        test.cmp.download();

        expect(test.env.searchEndpoint.downloadBinary).toHaveBeenCalledWith(
          jasmine.objectContaining({
            fieldsToInclude: jasmine.arrayContaining(['@foo', '@bar'])
          })
        );
      });

      it('fieldsToInclude not being specified means the fields to include will be "null" in the query', () => {
        options.fieldsToInclude = null;
        initExportToExcel();

        test.cmp.download();

        expect(test.env.searchEndpoint.downloadBinary).not.toHaveBeenCalledWith(
          jasmine.objectContaining({
            fieldsToInclude: jasmine.anything()
          })
        );
      });
    });
  });
}
