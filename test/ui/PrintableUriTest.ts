import * as Mock from '../MockEnvironment';
import {IPrintableUriOptions, PrintableUri} from '../../src/ui/PrintableUri/PrintableUri';
import { IQueryResult } from '../../src/rest/QueryResult';
import { $$ } from '../../src/utils/Dom';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { FakeResults } from '../Fake';

export function PrintableUriTest() {
  describe('PrintableUri', function () {
    let test: Mock.IBasicComponentSetup<PrintableUri>;
    let fakeResult: IQueryResult;

    beforeEach(() => {
      fakeResult = initFakeResult();
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      spyOn(test.cmp, 'openLink');
      spyOn(window, 'open');
    });

    afterEach(function () {
      test = null;
      fakeResult = null;
    });

    it('should have its tabindex value set to 0', () => {
      expect(test.cmp.element.getAttribute('tabindex')).toBe('0');
    });

    it('should display the XML correctly if the result has a non-null parents field', () => {
      fakeResult.raw.parents = '<?xml version="1.0" encoding="utf-16"?><parents><parent name="My Drive" uri="https://drive.google.com/#my-drive" /></parents>';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect($$(test.cmp.element).find('span').innerText).toEqual('My Drive');
    });

    it('should display the XML correctly if the result has a very long parents field', () => {
      fakeResult.raw.parents = '<?xml version="1.0" encoding="utf-16"?><parents><parent name="Organization" uri="https://na17.salesforce.com/home/home.jsp" />`' +
          '<parent name="Technical_Article__ka" uri="http://www.salesforce.com/org:organization/articletype:Technical_Article" />`' +
          '<parent name="Generator became sentient and refuses to cut power"`' +
          ' uri="https://na17.salesforce.com/kA0o00000003Wpk" /><parent name="un autre test" uri="http//:google.ca" /></parents>';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect($$(test.cmp.element).findAll('span.coveo-printable-uri-part')[0].innerText).toEqual('Organization');
      expect($$(test.cmp.element).findAll('span.coveo-printable-uri-part')[1].innerText).toEqual('Technical_Article__ka');

    });

    it('should shorten the printable uri correctly if the title is not a uri', () => {
      fakeResult.printableUri = 'This is not a Uri';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect($$(test.cmp.element).find('div').innerText).toEqual('This is not a ...');
    });

    it('should shorten the printable uri correctly if the title is a single character', () => {
      fakeResult.printableUri = 'z';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect($$(test.cmp.element).find('div').innerText).toEqual('...');
    });

    it('should shorten the printable uri correctly', () => {
      fakeResult.printableUri = 'http://a.very.very.very.very.very.very.very.very.very.very.long.printable.uri';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect($$(test.cmp.element).find('div').innerText).toEqual('http://a.very.very.very.very.very.very.very.very.very.very.long.printable....');
    });

    it('should shorten the printable uri correctly if title template is an empty string', () => {
      test.cmp.options.titleTemplate = '';
      fakeResult.printableUri = 'http://a.very.very.very.very.very.very.very.very.very.very.long.printable.uri';
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, undefined);
      expect($$(test.cmp.element).find('div').innerText).toEqual('http://a.very.very.very.very.very.very.very.very.very.very.long.printable....');
    });

    it('can receive an onClick option to execute', (done) => {
      test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, new Mock.AdvancedComponentSetupOptions($$('div').el, {
        onClick: () => {
          expect(true).toBe(true);
          done();
        }
      }));
      $$(test.cmp.element).trigger('click');
    });

    it('sends an analytic event on click', () => {
      $$(test.cmp.element).trigger('click');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    });

    describe('exposes hrefTemplate', () => {

      it('should not modify the href template if there are no field specified', () => {
        let hrefTemplate = 'test';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(hrefTemplate, jasmine.anything());
      });

      it('should replace fields in the href template by the results equivalent', () => {
        let hrefTemplate = '${title}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(fakeResult.title, jasmine.anything());
      });

      it('should support nested values in result', () => {
        let hrefTemplate = '${raw.number}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(fakeResult.raw['number'].toString(), jasmine.anything());
      });

      it('should not parse standalone accolades', () => {
        let hrefTemplate = '${raw.number}{test}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(fakeResult.raw['number'] + '{test}', jasmine.anything());
      });

      it('should support external fields', () => {
        window['Coveo']['test'] = 'testExternal';
        let hrefTemplate = '${Coveo.test}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith('testExternal', jasmine.anything());
        window['Coveo']['test'] = undefined;
      });

      it('should support nested external fields with more than 2 keys', () => {
        window['Coveo']['test'] = { key: 'testExternal' };
        let hrefTemplate = '${Coveo.test.key}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith('testExternal', jasmine.anything());
        window['Coveo']['test'] = undefined;
      });

    });

    describe('exposes the titleTemplate', () => {

      it('should replace fields in the title template by the results equivalent', () => {
        let titleTemplate = '${clickUri}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { titleTemplate: titleTemplate }, fakeResult);
        expect($$(test.cmp.element).text()).toEqual(fakeResult.clickUri);
      });

      it('should support nested values in result', () => {
        let titleTemplate = '${raw.number}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { titleTemplate: titleTemplate }, fakeResult);
        expect(test.cmp.element.innerHTML).toEqual(fakeResult.raw['number'].toString());
      });

      it('should not parse standalone accolades', () => {
        let titleTemplate = '${raw.number}{test}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { titleTemplate: titleTemplate }, fakeResult);
        expect(test.cmp.element.innerHTML).toEqual(fakeResult.raw['number'].toString() + '{test}');
      });

      it('should support external fields', () => {
        window['Coveo']['test'] = 'testExternal';
        let titleTemplate = '${Coveo.test}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { titleTemplate: titleTemplate }, fakeResult);
        expect(test.cmp.element.innerHTML).toEqual('testExternal');
        window['Coveo']['test'] = undefined;
      });

      it('should support external fields with more than 2 keys', () => {
        window['Coveo']['test'] = { key: 'testExternal' };
        let titleTemplate = '${Coveo.test.key}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { titleTemplate: titleTemplate }, fakeResult);
        expect(test.cmp.element.innerHTML).toEqual('testExternal');
        window['Coveo']['test'] = undefined;
      });

      it('should print the template if the key used in the template is undefined', () => {
        let titleTemplate = '${doesNotExist}';
        test = Mock.optionsResultComponentSetup<PrintableUri, IPrintableUriOptions>(PrintableUri, { titleTemplate: titleTemplate }, fakeResult);
        expect($$(test.cmp.element).text()).toEqual('${doesNotExist}');
      });

    });

    it('sends an analytics event on context menu', () => {
      $$(test.cmp.element).trigger('contextmenu');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    });

    describe('when logging the analytic event', () => {
      it('should use the href if set', () => {
        let element = $$('a');
        let href = 'javascript:void(0)';
        element.setAttribute('href', href);
        test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, new Mock.AdvancedComponentSetupOptions(element.el));
        spyOn(test.cmp, 'openLink');

        $$(test.cmp.element).trigger('click');

        expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledWith(analyticsActionCauseList.documentOpen, jasmine.objectContaining({ documentURL: href }), fakeResult, test.cmp.root);
      });

      it('should use the clickUri if the href is empty', () => {
        $$(test.cmp.element).trigger('click');

        expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledWith(analyticsActionCauseList.documentOpen, jasmine.objectContaining({ documentURL: fakeResult.clickUri }), fakeResult, test.cmp.root);
      });
    });

    describe('when the element is a hyperlink', () => {

      beforeEach(() => {
        test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, new Mock.AdvancedComponentSetupOptions($$('a').el));
      });

      it('should set the href to the result click uri', () => {
        expect(test.cmp.element.getAttribute('href')).toEqual(fakeResult.clickUri);
      });

      it('should not override the href if it is set before the initialization', () => {
        let element = $$('a');
        let href = 'javascript:void(0)';
        element.setAttribute('href', href);
        test = Mock.advancedResultComponentSetup<PrintableUri>(PrintableUri, fakeResult, new Mock.AdvancedComponentSetupOptions(element.el));

        expect(test.cmp.element.getAttribute('href')).toEqual(href);
      });
    });
  });

  function initFakeResult(): IQueryResult {
    let fakeResult = FakeResults.createFakeResult();
    return fakeResult;
  }
}
