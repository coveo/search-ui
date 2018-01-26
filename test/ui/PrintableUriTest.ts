/// <reference path="../../lib/jasmine/index.d.ts" />
import * as Mock from '../MockEnvironment';
import { IPrintableUriOptions, PrintableUri } from '../../src/ui/PrintableUri/PrintableUri';
import { IQueryResult } from '../../src/rest/QueryResult';
import { $$ } from '../../src/utils/Dom';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { FakeResults } from '../Fake';

export function PrintableUriTest() {
  describe('PrintableUri', function() {
    let test: Mock.IBasicComponentSetup<PrintableUri>;
    let fakeResult: IQueryResult;

    const getFirstResultLinkElement = (cmp: PrintableUri): HTMLElement => {
      return $$(cmp.element).find('.CoveoResultLink');
    };

    beforeEach(() => {
      fakeResult = initFakeResult();
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      spyOn(test.cmp, 'openLink');
      spyOn(window, 'open');
    });

    afterEach(function() {
      test = null;
      fakeResult = null;
    });

    it('should display the XML correctly if the result has a non-null parents field', () => {
      fakeResult.raw.parents =
        '<?xml version="1.0" encoding="utf-16"?><parents><parent name="My Drive" uri="https://drive.google.com/#my-drive" /></parents>';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect($$(test.cmp.element).find('.CoveoResultLink').innerText).toEqual('My Drive');
    });

    it('should display the XML correctly if the result has a very long parents field', () => {
      fakeResult.raw.parents =
        '<?xml version="1.0" encoding="utf-16"?><parents><parent name="Organization" uri="https://na17.salesforce.com/home/home.jsp" />`' +
        '<parent name="Technical_Article__ka" uri="http://www.salesforce.com/org:organization/articletype:Technical_Article" />`' +
        '<parent name="Generator became sentient and refuses to cut power"`' +
        ' uri="https://na17.salesforce.com/kA0o00000003Wpk" /><parent name="un autre test" uri="http//:google.ca" /></parents>';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect($$(test.cmp.element).findAll('.CoveoResultLink.coveo-printable-uri-part')[0].innerText).toEqual('Organization');
      expect($$(test.cmp.element).findAll('.CoveoResultLink.coveo-printable-uri-part')[1].innerText).toEqual('Technical_Article__ka');
    });

    it('should shorten the printable uri correctly if the title is not a uri', () => {
      fakeResult.printableUri = 'This is not a Uri';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect(getFirstResultLinkElement(test.cmp).innerText).toEqual('This is not a ...');
    });

    it('should shorten the printable uri correctly if the title is a single character', () => {
      fakeResult.printableUri = 'z';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect(getFirstResultLinkElement(test.cmp).innerText).toEqual('...');
    });

    it('should shorten the printable uri correctly', () => {
      fakeResult.printableUri = 'http://a.very.very.very.very.very.very.very.very.very.very.long.printable.uri';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect(getFirstResultLinkElement(test.cmp).innerText).toEqual(
        'http://a.very.very.very.very.very.very.very.very.very.very.long.printable....'
      );
    });

    it('should shorten the printable uri correctly if title template is an empty string', () => {
      test.cmp.options.titleTemplate = '';
      fakeResult.printableUri = 'http://a.very.very.very.very.very.very.very.very.very.very.long.printable.uri';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect(getFirstResultLinkElement(test.cmp).innerText).toEqual(
        'http://a.very.very.very.very.very.very.very.very.very.very.long.printable....'
      );
    });

    it('can receive an onClick option to execute', done => {
      test = Mock.advancedResultComponentSetup<PrintableUri>(
        PrintableUri,
        fakeResult,
        new Mock.AdvancedComponentSetupOptions($$('div').el, {
          onClick: () => {
            expect(true).toBe(true);
            done();
          }
        })
      );

      $$(getFirstResultLinkElement(test.cmp)).trigger('click');
    });

    it('sends an analytic event on click', () => {
      $$(getFirstResultLinkElement(test.cmp)).trigger('click');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    });

    describe('exposes hrefTemplate', () => {
      it('should not modify the href template if there are no field specified', () => {
        let hrefTemplate = 'test';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { hrefTemplate: hrefTemplate },
          fakeResult
        );
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(hrefTemplate, jasmine.anything());
      });

      it('should replace fields in the href template by the results equivalent', () => {
        let hrefTemplate = '${summary}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { hrefTemplate: hrefTemplate },
          fakeResult
        );
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(fakeResult.summary, jasmine.anything());
      });

      it('should support nested values in result', () => {
        let hrefTemplate = '${raw.number}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { hrefTemplate: hrefTemplate },
          fakeResult
        );
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(fakeResult.raw['number'].toString(), jasmine.anything());
      });

      it('should not parse standalone accolades', () => {
        let hrefTemplate = '${raw.number}{test}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { hrefTemplate: hrefTemplate },
          fakeResult
        );
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(fakeResult.raw['number'] + '{test}', jasmine.anything());
      });

      it('should support external fields', () => {
        window['Coveo']['test'] = 'testExternal';
        let hrefTemplate = '${Coveo.test}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { hrefTemplate: hrefTemplate },
          fakeResult
        );
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith('testExternal', jasmine.anything());
        window['Coveo']['test'] = undefined;
      });

      it('should support nested external fields with more than 2 keys', () => {
        window['Coveo']['test'] = { key: 'testExternal' };
        let hrefTemplate = '${Coveo.test.key}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { hrefTemplate: hrefTemplate },
          fakeResult
        );
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith('testExternal', jasmine.anything());
        window['Coveo']['test'] = undefined;
      });
    });

    describe('exposes the titleTemplate', () => {
      it('should replace fields in the title template by the results equivalent', () => {
        let titleTemplate = '${clickUri}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { titleTemplate: titleTemplate },
          fakeResult
        );
        expect($$(test.cmp.element).text()).toEqual(fakeResult.clickUri);
      });

      it('should support nested values in result', () => {
        let titleTemplate = '${raw.number}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { titleTemplate: titleTemplate },
          fakeResult
        );
        expect(getFirstResultLinkElement(test.cmp).innerHTML).toEqual(fakeResult.raw['number'].toString());
      });

      it('should not parse standalone accolades', () => {
        let titleTemplate = '${raw.number}{test}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { titleTemplate: titleTemplate },
          fakeResult
        );
        expect(getFirstResultLinkElement(test.cmp).innerHTML).toEqual(fakeResult.raw['number'].toString() + '{test}');
      });

      it('should support external fields', () => {
        window['Coveo']['test'] = 'testExternal';
        let titleTemplate = '${Coveo.test}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { titleTemplate: titleTemplate },
          fakeResult
        );
        expect(getFirstResultLinkElement(test.cmp).innerHTML).toEqual('testExternal');
        window['Coveo']['test'] = undefined;
      });

      it('should support external fields with more than 2 keys', () => {
        window['Coveo']['test'] = { key: 'testExternal' };
        let titleTemplate = '${Coveo.test.key}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { titleTemplate: titleTemplate },
          fakeResult
        );
        expect(getFirstResultLinkElement(test.cmp).innerHTML).toEqual('testExternal');
        window['Coveo']['test'] = undefined;
      });

      it('should print the template if the key used in the template is undefined', () => {
        let titleTemplate = '${doesNotExist}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(
          PrintableUri,
          { titleTemplate: titleTemplate },
          fakeResult
        );
        expect($$(getFirstResultLinkElement(test.cmp)).text()).toEqual('${doesNotExist}');
      });
    });

    it('sends an analytics event on context menu', () => {
      $$(getFirstResultLinkElement(test.cmp)).trigger('contextmenu');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    });

    describe('when logging the analytic event', () => {
      it('should use the clickUri if the href is empty', () => {
        $$(getFirstResultLinkElement(test.cmp)).trigger('click');

        expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.documentOpen,
          jasmine.objectContaining({ documentURL: fakeResult.clickUri }),
          jasmine.objectContaining({
            uniqueId: fakeResult.uniqueId
          }),
          test.cmp.root
        );
      });
    });
  });

  function initFakeResult(): IQueryResult {
    let fakeResult = FakeResults.createFakeResult();
    return fakeResult;
  }
}
