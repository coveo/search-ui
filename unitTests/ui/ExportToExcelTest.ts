import * as Mock from '../MockEnvironment';
import { ExportToExcel, setCreateAnchor } from '../../src/ui/ExportToExcel/ExportToExcel';
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

    function buildAnchorWithClickSpy() {
      const a = document.createElement('a');
      spyOn(a, 'click');
      return a;
    }

    beforeEach(function() {
      options = {};
      setCreateAnchor(() => buildAnchorWithClickSpy());

      initExportToExcel();
    });

    describe('calling #download', () => {
      it(`calls fetchBinary with format set to 'xlsx'`, () => {
        test.cmp.download();

        expect(test.env.searchEndpoint.fetchBinary).toHaveBeenCalledWith(jasmine.objectContaining({ format: 'xlsx' }));
      });

      it('calls fetchBinary with the default number of results', () => {
        test.cmp.download();

        expect(test.env.searchEndpoint.fetchBinary).toHaveBeenCalledWith(jasmine.objectContaining({ numberOfResults: 100 }));
      });

      it('should call exportToExcel event if query was made', () => {
        const excelSpy = jasmine.createSpy('excelSpy');
        test.env.usageAnalytics.logCustomEvent = excelSpy;
        test.cmp.download();
        expect(excelSpy).toHaveBeenCalledWith(analyticsActionCauseList.exportToExcel, {}, test.env.element);
      });

      it('sets on an achor element href attribute the blob url', async done => {
        const a = buildAnchorWithClickSpy();
        setCreateAnchor(() => a);

        test.cmp.download();
        await Promise.resolve({});

        expect(a.href).toContain('blob:http://localhost');
        done();
      });

      it('sets on an achor element the download attribute', async done => {
        const a = buildAnchorWithClickSpy();
        setCreateAnchor(() => a);

        test.cmp.download();
        await Promise.resolve({});

        expect(a.download).toBeTruthy();
        done();
      });

      it('clicks the anchor element', async done => {
        const a = buildAnchorWithClickSpy();
        setCreateAnchor(() => a);

        test.cmp.download();
        await Promise.resolve({});

        expect(a.click).toHaveBeenCalledTimes(1);
        done();
      });

      it('revokes the blob object url', async done => {
        const spy = jasmine.createSpy('revokeObjectUrl');

        window.URL.revokeObjectURL = spy;

        test.cmp.download();
        await Promise.resolve({});

        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
    });

    describe('exposes options', function() {
      it('numberOfResults calls search endpoint with appropriate number of results', function() {
        options.numberOfResults = 200;
        initExportToExcel();

        test.cmp.download();

        expect(test.env.searchEndpoint.fetchBinary).toHaveBeenCalledWith(jasmine.objectContaining({ numberOfResults: 200 }));
      });

      it('fieldsToInclude allows to specify the needed fields to download', () => {
        options.fieldsToInclude = ['@foo', '@bar'];
        initExportToExcel();

        test.cmp.download();

        expect(test.env.searchEndpoint.fetchBinary).toHaveBeenCalledWith(
          jasmine.objectContaining({
            fieldsToInclude: jasmine.arrayContaining(['@foo', '@bar'])
          })
        );
      });

      it('fieldsToInclude not being specified means the fields to include will be "null" in the query', () => {
        options.fieldsToInclude = null;
        initExportToExcel();

        test.cmp.download();

        expect(test.env.searchEndpoint.fetchBinary).not.toHaveBeenCalledWith(
          jasmine.objectContaining({
            fieldsToInclude: jasmine.anything()
          })
        );
      });
    });
  });
}
