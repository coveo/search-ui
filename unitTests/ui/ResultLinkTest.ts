import * as Mock from '../MockEnvironment';
import { ResultLink } from '../../src/ui/ResultLink/ResultLink';
import { IQueryResult } from '../../src/rest/QueryResult';
import { HighlightUtils } from '../../src/utils/HighlightUtils';
import { $$ } from '../../src/utils/Dom';
import { IResultLinkOptions } from '../../src/ui/ResultLink/ResultLinkOptions';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { OS_NAME } from '../../src/utils/OSUtils';
import { FakeResults } from '../Fake';
import { Initialization } from '../../src/Core';

export function ResultLinkTest() {
  describe('ResultLink', function() {
    let test: Mock.IBasicComponentSetup<ResultLink>;
    let fakeResult: IQueryResult;

    function buildFakeResult(): IQueryResult {
      let fakeResult = FakeResults.createFakeResult();
      fakeResult.title = 'A test title';
      fakeResult.titleHighlights = [{ offset: 2, length: 4 }];
      fakeResult.clickUri = 'uri';
      return fakeResult;
    }

    function initResultLink() {
      test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult, undefined);
    }

    function htmlContainingXSS() {
      return '<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>';
    }

    beforeEach(() => {
      fakeResult = buildFakeResult();
      initResultLink();
      spyOn(test.cmp, 'openLink');
      spyOn(window, 'open');
    });

    afterEach(function() {
      test = null;
      fakeResult = null;
    });

    it('should have its tabindex value set to 0', () => {
      expect(test.cmp.element.getAttribute('tabindex')).toBe('0');
    });

    describe(`when the template contains two ${ResultLink.ID} elements`, () => {
      let template: HTMLElement;

      function buildResultWithTwoResultLinks() {
        const result = $$('div', { className: 'CoveoResult' }).el;
        $$(result).append(buildResultLink());
        $$(result).append(buildResultLink());

        return result;
      }

      function buildResultLink() {
        return $$('div', { className: 'CoveoResultLink' }).el;
      }

      beforeEach(() => {
        template = buildResultWithTwoResultLinks();
        const result = FakeResults.createFakeResult();
        Initialization.automaticallyCreateComponentsInsideResult(template, result);
      });
    });

    it('should hightlight the result title', () => {
      expect(test.cmp.element.innerHTML).toEqual(
        HighlightUtils.highlightString(fakeResult.title, fakeResult.titleHighlights, null, 'coveo-highlight')
      );
    });

    it(`when the title contains a html element, it does not render the element to prevent XSS`, () => {
      fakeResult.title = htmlContainingXSS();
      initResultLink();

      expect(test.cmp.element.innerHTML).toBe(
        '&lt;I<span class="coveo-highlight">MG S</span>RC=/ onerror="alert(String.fromCharCode(88,83,83))"&gt;&lt;/img&gt;'
      );
    });

    it('should set the title attribute to the displayed title', () => {
      expect(test.cmp.element.title).toEqual(
        HighlightUtils.highlightString(fakeResult.title, fakeResult.titleHighlights, null, 'coveo-highlight')
      );
    });

    it('should contain the clickUri if the result has no title', () => {
      fakeResult.title = undefined;
      fakeResult.clickUri = 'https://www.google.com?q=hello&geo=world';
      initResultLink();

      const encodedUri = fakeResult.clickUri.replace('&', '&amp;');
      expect(test.cmp.element.innerHTML).toEqual(encodedUri);
    });

    it(`when the title is empty and the clickuri contains a html element,
    it does not render the element to prevent XSS`, () => {
      fakeResult.title = '';
      fakeResult.clickUri = htmlContainingXSS();
      initResultLink();

      expect(test.cmp.element.children.length).toBe(0);
      expect(test.cmp.element.innerHTML).toBe('&lt;IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"&gt;&lt;/img&gt;');
    });

    it('can receive an onClick option to execute', done => {
      test = Mock.advancedResultComponentSetup<ResultLink>(
        ResultLink,
        fakeResult,
        new Mock.AdvancedComponentSetupOptions($$('div').el, {
          onClick: () => {
            expect(true).toBe(true);
            done();
          }
        })
      );
      $$(test.cmp.element).trigger('click');
    });

    it('sends an analytic event on click', () => {
      $$(test.cmp.element).trigger('click');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    });

    describe('exposes hrefTemplate', () => {
      it('should not modify the href template if there are no field specified', () => {
        let hrefTemplate = 'test';
        test = Mock.optionsResultComponentSetup<ResultLink, IResultLinkOptions>(ResultLink, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(hrefTemplate, jasmine.anything());
      });

      it('should replace fields in the href template by the results equivalent', () => {
        let hrefTemplate = '${title}';
        test = Mock.optionsResultComponentSetup<ResultLink, IResultLinkOptions>(ResultLink, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(fakeResult.title, jasmine.anything());
      });

      it('should support nested values in result', () => {
        let hrefTemplate = '${raw.number}';
        test = Mock.optionsResultComponentSetup<ResultLink, IResultLinkOptions>(ResultLink, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(fakeResult.raw['number'].toString(), jasmine.anything());
      });

      it('should not parse standalone accolades', () => {
        let hrefTemplate = '${raw.number}{test}';
        test = Mock.optionsResultComponentSetup<ResultLink, IResultLinkOptions>(ResultLink, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith(fakeResult.raw['number'] + '{test}', jasmine.anything());
      });

      it('should support external fields', () => {
        window['Coveo']['test'] = 'testExternal';
        let hrefTemplate = '${Coveo.test}';
        test = Mock.optionsResultComponentSetup<ResultLink, IResultLinkOptions>(ResultLink, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith('testExternal', jasmine.anything());
        window['Coveo']['test'] = undefined;
      });

      it('should support nested external fields with more than 2 keys', () => {
        window['Coveo']['test'] = { key: 'testExternal' };
        let hrefTemplate = '${Coveo.test.key}';
        test = Mock.optionsResultComponentSetup<ResultLink, IResultLinkOptions>(ResultLink, { hrefTemplate: hrefTemplate }, fakeResult);
        test.cmp.openLinkInNewWindow();
        expect(window.open).toHaveBeenCalledWith('testExternal', jasmine.anything());
        window['Coveo']['test'] = undefined;
      });
    });

    describe('exposes the titleTemplate', () => {
      let titleTemplate = '';

      afterEach(() => {
        titleTemplate = '';
      });

      function initResultLinkWithTitleTemplate() {
        test = Mock.optionsResultComponentSetup<ResultLink, IResultLinkOptions>(ResultLink, { titleTemplate }, fakeResult);
      }

      it('should replaces fields in the title template by the results equivalent', () => {
        titleTemplate = '${clickUri}';
        initResultLinkWithTitleTemplate();

        expect($$(test.cmp.element).text()).toEqual(fakeResult.clickUri);
      });

      it(`when the field referenced in the title template contains XSS html,
      it escapes the html to prevent XSS`, () => {
        titleTemplate = '${clickUri}';
        fakeResult.clickUri = htmlContainingXSS();
        initResultLinkWithTitleTemplate();

        expect(test.cmp.element.innerHTML).toEqual('&lt;IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"&gt;&lt;/img&gt;');
      });

      it('should support nested values in result', () => {
        titleTemplate = '${raw.number}';
        initResultLinkWithTitleTemplate();

        expect(test.cmp.element.innerHTML).toEqual(fakeResult.raw['number'].toString());
      });

      it('should not parse standalone accolades', () => {
        titleTemplate = '${raw.number}{test}';
        initResultLinkWithTitleTemplate();

        expect(test.cmp.element.innerHTML).toEqual(fakeResult.raw['number'].toString() + '{test}');
      });

      it('should support external fields', () => {
        window['Coveo']['test'] = 'testExternal';
        titleTemplate = '${Coveo.test}';
        initResultLinkWithTitleTemplate();

        expect(test.cmp.element.innerHTML).toEqual('testExternal');
        window['Coveo']['test'] = undefined;
      });

      it('should support external fields with more than 2 keys', () => {
        window['Coveo']['test'] = { key: 'testExternal' };
        titleTemplate = '${Coveo.test.key}';
        initResultLinkWithTitleTemplate();

        expect(test.cmp.element.innerHTML).toEqual('testExternal');
        window['Coveo']['test'] = undefined;
      });

      it('should print the title if the option is set but the template is empty', () => {
        titleTemplate = '';
        initResultLinkWithTitleTemplate();

        expect($$(test.cmp.element).text()).toEqual(fakeResult.title);
      });

      it('should print the template if the key used in the template is undefined', () => {
        titleTemplate = '${doesNotExist}';
        initResultLinkWithTitleTemplate();

        expect($$(test.cmp.element).text()).toEqual('${doesNotExist}');
      });
    });

    it('sends an analytics event on context menu', () => {
      $$(test.cmp.element).trigger('contextmenu');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    });

    it('sends an analytics event on mouseup', () => {
      $$(test.cmp.element).trigger('mouseup');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    });

    it('sends an analytics event on mousedown', () => {
      $$(test.cmp.element).trigger('mousedown');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    });

    it('does not send multiple analytics events with multiple mouse events', () => {
      $$(test.cmp.element).trigger('mousedown');
      $$(test.cmp.element).trigger('click');
      $$(test.cmp.element).trigger('mouseup');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    });

    it('sends an event 1s after a long press on mobile', done => {
      $$(test.cmp.element).trigger('touchstart');
      expect(test.cmp.usageAnalytics.logClickEvent).not.toHaveBeenCalled();
      setTimeout(() => {
        expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
        done();
      }, 1100);
    });

    it('does not send an event if a touchend event occurs before a 1s delay', done => {
      $$(test.cmp.element).trigger('touchstart');

      setTimeout(() => {
        $$(test.cmp.element).trigger('touchend');
      }, 300);

      setTimeout(() => {
        expect(test.cmp.usageAnalytics.logClickEvent).not.toHaveBeenCalled();
        done();
      }, 1100);
    });

    describe('when logging the analytic event', () => {
      it('should use the href if set', () => {
        let element = $$('a');
        let href = 'javascript:void(0)';
        element.setAttribute('href', href);
        test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult, new Mock.AdvancedComponentSetupOptions(element.el));
        spyOn(test.cmp, 'openLink');

        $$(test.cmp.element).trigger('click');

        expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.documentOpen,
          jasmine.objectContaining({ documentURL: href }),
          fakeResult,
          test.cmp.root
        );
      });

      it('should use the clickUri if the href is empty', () => {
        $$(test.cmp.element).trigger('click');

        expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.documentOpen,
          jasmine.objectContaining({ documentURL: fakeResult.clickUri }),
          fakeResult,
          test.cmp.root
        );
      });
    });

    describe('when the element is a hyperlink', () => {
      function initHyperLink(options?: IResultLinkOptions) {
        test = Mock.advancedResultComponentSetup<ResultLink>(
          ResultLink,
          fakeResult,
          new Mock.AdvancedComponentSetupOptions($$('a').el, options)
        );
      }

      beforeEach(() => {
        initHyperLink();
      });

      it('should set the href to the result click uri', () => {
        expect(test.cmp.element.getAttribute('href')).toEqual(fakeResult.clickUri);
      });

      it(`when the uri (clickUri) defined in the results contains the javascript protocol,
        it clears the value to prevent XSS`, () => {
        fakeResult.clickUri = 'JavaScript:void(0)';
        initHyperLink();
        expect(test.cmp.element.getAttribute('href')).toEqual('');
      });

      it(`when the field option is defined and the field contains the javascript protocol,
        it clears the value to prevent XSS`, () => {
        fakeResult.raw['test'] = 'javascript:void(0)';
        initHyperLink({ field: '@test' });
        expect(test.cmp.element.getAttribute('href')).toEqual('');
      });

      it('should not override the href if it is set before the initialization', () => {
        let element = $$('a');
        let href = 'javascript:void(0)';
        element.setAttribute('href', href);
        test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult, new Mock.AdvancedComponentSetupOptions(element.el));

        expect(test.cmp.element.getAttribute('href')).toEqual(href);
      });

      describe('and the result has the outlookfield', () => {
        beforeEach(() => {
          fakeResult.raw['outlookuri'] = 'uri.for.outlook';
          fakeResult.raw['outlookformacuri'] = 'uri.for.outlook.for.mac';
        });

        it('should generate the correct href if the os is windows and the option is openInOutlook', () => {
          test = Mock.advancedResultComponentSetup<ResultLink>(
            ResultLink,
            fakeResult,
            new Mock.AdvancedComponentSetupOptions($$('a').el, { openInOutlook: true }, (env: Mock.MockEnvironmentBuilder) => {
              return env.withOs(OS_NAME.WINDOWS);
            })
          );
          expect(test.cmp.element.getAttribute('href')).toEqual(fakeResult.raw['outlookuri']);
        });

        it('should generate the correct href if the os is windows and the option is not openInOutlook', () => {
          test = Mock.advancedResultComponentSetup<ResultLink>(
            ResultLink,
            fakeResult,
            new Mock.AdvancedComponentSetupOptions($$('a').el, { openInOutlook: false }, (env: Mock.MockEnvironmentBuilder) => {
              return env.withOs(OS_NAME.WINDOWS);
            })
          );
          expect(test.cmp.element.getAttribute('href')).not.toEqual(fakeResult.raw['outlookuri']);
        });

        it('should generate the correct href if the os is mac and the option is openInOutlook', () => {
          test = Mock.advancedResultComponentSetup<ResultLink>(
            ResultLink,
            fakeResult,
            new Mock.AdvancedComponentSetupOptions($$('a').el, { openInOutlook: true }, (env: Mock.MockEnvironmentBuilder) => {
              return env.withOs(OS_NAME.MACOSX);
            })
          );
          expect(test.cmp.element.getAttribute('href')).toEqual(fakeResult.raw['outlookformacuri']);
        });

        it('should generate the correct href if the os is mac and the option is not openInOutlook', () => {
          test = Mock.advancedResultComponentSetup<ResultLink>(
            ResultLink,
            fakeResult,
            new Mock.AdvancedComponentSetupOptions($$('a').el, { openInOutlook: false }, (env: Mock.MockEnvironmentBuilder) => {
              return env.withOs(OS_NAME.MACOSX);
            })
          );
          expect(test.cmp.element.getAttribute('href')).not.toEqual(fakeResult.raw['outlookformacuri']);
        });
      });
    });
  });
}
