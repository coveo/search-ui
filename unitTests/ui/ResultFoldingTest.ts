import * as Mock from '../MockEnvironment';
import { ResultFolding } from '../../src/ui/ResultFolding/ResultFolding';
import { IResultFoldingOptions } from '../../src/ui/ResultFolding/ResultFolding';
import { Quickview } from '../../src/ui/Quickview/Quickview';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';
import { IQueryResult } from '../../src/rest/QueryResult';
import { UnderscoreTemplate } from '../../src/ui/Templates/UnderscoreTemplate';
import { TemplateCache } from '../../src/ui/Templates/TemplateCache';
import { Template } from '../../src/ui/Templates/Template';
import { CardOverlayEvents } from '../../src/events/CardOverlayEvents';
import { pluck, map, each } from 'underscore';
import { get } from '../../src/ui/Base/RegisteredNamedMethods';
import { Defer } from '../../src/misc/Defer';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function ResultFoldingTest() {
  describe('ResultFolding', () => {
    let test: Mock.IBasicComponentSetup<ResultFolding>;

    afterEach(() => {
      test = null;
    });

    describe('after calling showMoreResults', () => {
      let test: Mock.IBasicComponentSetup<ResultFolding>;
      let fakeResult: IQueryResult;
      let afterMoreResults: Promise<IQueryResult[]>;

      beforeEach(() => {
        fakeResult = FakeResults.createFakeResultWithChildResult('rezzult', 4);
        fakeResult.moreResults = () => Promise.resolve(fakeResult.childResults);
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, undefined, fakeResult);
        afterMoreResults = test.cmp.showMoreResults();
      });

      afterEach(() => {
        afterMoreResults = null;
      });

      it('should get the appropriate child results', done => {
        afterMoreResults.then(() => {
          expect(test.cmp.childResults).toBe(fakeResult.childResults);
          done();
        });
      });

      it('should display the appropriate child results', done => {
        afterMoreResults.then(() => {
          const displayedChildResults = $$(test.cmp.element).findAll('.coveo-result-folding-child-result');
          expect(displayedChildResults.length).toBe(4);
          const expectedTitles = pluck(fakeResult.childResults, 'title');
          const actualTitles = map(displayedChildResults, (res: HTMLElement) => $$(res).find('a.CoveoResultLink').innerHTML);
          expect(actualTitles).toEqual(expectedTitles);
          done();
        });
      });

      it("should put an 'expanded' CSS class on the expanded results", done => {
        setTimeout(() => {
          each($$(test.cmp.element).findAll('.coveo-result-folding-child-result'), (res: HTMLElement) => {
            expect($$(res).hasClass('coveo-expanded-child-result')).toBe(true);
          });
          done();
        });
      });

      it('should display the original results when showLessResults is called', done => {
        const tempChildResults = fakeResult.childResults;
        fakeResult.childResults = [];
        fakeResult.moreResults = () => Promise.resolve(tempChildResults);
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, undefined, fakeResult);

        test.cmp.showMoreResults();
        setTimeout(() => {
          test.cmp.showLessResults();
          setTimeout(() => {
            expect($$($$(test.cmp.element).find('.coveo-folding-results')).isEmpty()).toBe(true);
            done();
          });
        });
      });

      it('should remove loading animation if the result template throws an error ', done => {
        const tempChildResults = fakeResult.childResults;
        fakeResult.childResults = [];
        fakeResult.moreResults = () => Promise.resolve(tempChildResults);
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, undefined, fakeResult);

        test.cmp.options.resultTemplate = new Template(() => {
          throw 'Oh, the Humanity!';
        });

        test.cmp.showMoreResults();
        expect($$(test.cmp.element).find('.coveo-loading-spinner')).toBeTruthy();

        setTimeout(() => {
          expect($$(test.cmp.element).find('.coveo-loading-spinner')).toBeNull();
          done();
        });
      });
    });

    describe('exposes options', () => {
      it('resultTemplate should use the default result template when not defined', () => {
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
          ResultFolding,
          <IResultFoldingOptions>{
            resultTemplate: undefined
          },
          undefined
        );
        expect((<any>test.cmp.options.resultTemplate).constructor.name).toBe('DefaultFoldingTemplate');
      });

      it('normalCaption should be set properly when not expanded and expanded caption is defined', () => {
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
          ResultFolding,
          <IResultFoldingOptions>{
            normalCaption: 'foobar',
            expandedCaption: 'obligatory'
          },
          FakeResults.createFakeResultWithChildResult('heyo', 3)
        );
        expect($$(test.cmp.element).find('.coveo-folding-normal-caption').innerHTML).toContain('foobar');
      });

      it('expandedCaption should be set properly when expanded and normal caption is defined', () => {
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
          ResultFolding,
          <IResultFoldingOptions>{
            expandedCaption: 'foobar',
            normalCaption: 'obligatory'
          },
          FakeResults.createFakeResultWithChildResult('heyo', 3)
        );
        test.cmp.result.moreResults = () => Promise.resolve(null);
        test.cmp.showMoreResults();
        expect($$(test.cmp.element).find('.coveo-folding-expanded-caption').innerHTML).toContain('foobar');
      });

      it('normalCaption and extendedCaption should not be shown if one or the other is not defined', () => {
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
          ResultFolding,
          <IResultFoldingOptions>{
            expandedCaption: 'foobar',
            normalCaption: undefined
          },
          FakeResults.createFakeResultWithChildResult('heyo', 3)
        );
        test.cmp.result.moreResults = () => Promise.resolve(null);
        test.cmp.showMoreResults();
        expect($$(test.cmp.element).find('.coveo-folding-expanded-caption')).toBeNull();

        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
          ResultFolding,
          <IResultFoldingOptions>{
            normalCaption: 'foobar',
            expandedCaption: undefined
          },
          FakeResults.createFakeResultWithChildResult('heyo', 3)
        );
        expect($$(test.cmp.element).find('.coveo-folding-normal-caption')).toBeNull();
      });

      it('moreCaption should set the appropriate caption on the expand link', () => {
        const fakeResult = FakeResults.createFakeResult();
        fakeResult.moreResults = () => Promise.resolve([]);
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
          ResultFolding,
          <IResultFoldingOptions>{
            moreCaption: 'foobar'
          },
          fakeResult
        );
        expect($$(test.cmp.element.parentElement).find('.coveo-folding-show-more').innerHTML).toBe('foobar');
      });

      it('lessCaption should set the appropriate caption on the unexpand link', () => {
        const fakeResult = FakeResults.createFakeResult();
        fakeResult.moreResults = () => Promise.resolve([]);
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
          ResultFolding,
          <IResultFoldingOptions>{
            lessCaption: 'foobar'
          },
          fakeResult
        );
        expect($$(test.cmp.element.parentElement).find('.coveo-folding-show-less').innerHTML).toBe('foobar');
      });

      it('oneResultCaption should set the appropriate caption when there is only one result', () => {
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
          ResultFolding,
          <IResultFoldingOptions>{
            oneResultCaption: 'foobar'
          },
          FakeResults.createFakeResult()
        );
        expect($$(test.cmp.element).find('.coveo-folding-oneresult-caption').innerHTML).toBe('foobar');
      });
    });

    it("should not display the 'more' link when moreResults handler is not available", done => {
      test = Mock.basicResultComponentSetup<ResultFolding>(ResultFolding);
      Defer.defer(() => {
        expect($$(test.cmp.element).find('coveo-folding-show-more')).toBeNull();
        done();
      });
    });

    it('should not display any header caption when there are no child results', done => {
      const fakeResult = FakeResults.createFakeResult();
      fakeResult.childResults = [];
      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
        ResultFolding,
        <IResultFoldingOptions>{
          normalCaption: 'normal',
          expandedCaption: 'expanded'
        },
        fakeResult
      );

      Defer.defer(() => {
        expect($$(test.cmp.element).find('.coveo-folding-normal-caption').style.display).toBe('none');
        expect($$(test.cmp.element).find('.coveo-folding-expanded-caption').style.display).toBe('none');
        done();
      });
    });

    it("should put a 'normal' caption on unexpanded search results", done => {
      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
        ResultFolding,
        undefined,
        FakeResults.createFakeResultWithChildResult('rez', 10)
      );
      Defer.defer(() => {
        each($$(test.cmp.element).findAll('.coveo-result-folding-child-result'), (res: HTMLElement) => {
          expect($$(res).hasClass('coveo-normal-child-result')).toBe(true);
          done();
        });
      });
    });

    it('should load template properly', done => {
      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
        ResultFolding,
        <IResultFoldingOptions>{
          resultTemplate: UnderscoreTemplate.fromString('Foo', {})
        },
        FakeResults.createFakeResultWithChildResult('razzza', 2)
      );
      Defer.defer(() => {
        each($$(test.cmp.element).findAll('.coveo-result-folding-child-result'), (result: HTMLElement) => {
          expect(result.innerHTML).toBe('Foo');
        });
        done();
      });
    });

    it("should automatically initialize components in child results' templates", done => {
      const fakeResult = FakeResults.createFakeResultWithChildResult('test', 3);
      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
        ResultFolding,
        <IResultFoldingOptions>{
          resultTemplate: UnderscoreTemplate.fromString('<a class="CoveoResultLink" />', {})
        },
        fakeResult
      );
      Defer.defer(() => {
        each($$(test.cmp.element).findAll('.coveo-result-folding-child-result'), (result: HTMLElement, i) => {
          expect(result.getAttribute('href')).toBe(fakeResult.childResults[i].clickUri);
        });
        done();
      });
    });

    it('can load an external template from an id', done => {
      TemplateCache.registerTemplate('Foo', UnderscoreTemplate.fromString('foubarre', {}));
      test = Mock.advancedResultComponentSetup<ResultFolding>(ResultFolding, FakeResults.createFakeResult(), <
        Mock.AdvancedComponentSetupOptions
      >{
        element: $$('div', { 'data-result-template-id': 'Foo' }).el
      });
      test.cmp.options.resultTemplate.instantiateToElement(<IQueryResult>{}).then(elem => {
        expect(elem.innerHTML).toBe('foubarre');
        done();
      });
    });

    it('should automatically use the template inside its element', done => {
      test = Mock.advancedResultComponentSetup<ResultFolding>(ResultFolding, FakeResults.createFakeResult(), <
        Mock.AdvancedComponentSetupOptions
      >{
        element: $$('div', {}, $$('script', { className: 'result-template', type: 'text/underscore' }, 'heyo')).el
      });
      test.cmp.options.resultTemplate.instantiateToElement(<IQueryResult>{}).then(elem => {
        expect(elem.innerHTML).toBe('heyo');
        done();
      });
    });

    it('should show or hide elements with special classes when expanding or unexpanding', done => {
      const templateStr = '<div class="coveo-show-if-normal"></div><div class="coveo-show-if-expanded"></div>';

      const result = FakeResults.createFakeResultWithChildResult('foo', 3);
      result.moreResults = () => Promise.resolve(result.childResults);

      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
        ResultFolding,
        <IResultFoldingOptions>{
          resultTemplate: UnderscoreTemplate.fromString(templateStr, {})
        },
        result
      );

      Defer.defer(() => {
        expect($$(test.cmp.element).find('.coveo-show-if-normal').style.display).not.toBe('none');
        expect($$(test.cmp.element).find('.coveo-show-if-expanded').style.display).toBe('none');

        test.cmp.showMoreResults().then(() => {
          expect($$(test.cmp.element).find('.coveo-show-if-normal').style.display).toBe('none');
          expect($$(test.cmp.element).find('.coveo-show-if-expanded').style.display).not.toBe('none');
          done();
        });
      });
    });

    it('should call usage analytics when showing more results', done => {
      const result = FakeResults.createFakeResultWithChildResult('foo', 3);
      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{}, result);
      result.moreResults = () => Promise.resolve(result.childResults);
      test.cmp.showMoreResults().then(() => {
        expect(test.env.usageAnalytics.logClickEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.foldingShowMore,
          jasmine.objectContaining({
            documentURL: result.clickUri,
            documentTitle: result.title,
            author: result.raw['author']
          }),
          result,
          test.cmp.element
        );
        done();
      });
    });

    it('should call usage analytics when showing less results', () => {
      const result = FakeResults.createFakeResultWithChildResult('foo', 3);
      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{}, result);
      result.moreResults = () => Promise.resolve(result.childResults);
      test.cmp.showLessResults();
      expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
        analyticsActionCauseList.foldingShowLess,
        jasmine.objectContaining({
          documentURL: result.clickUri,
          documentTitle: result.title,
          author: result.raw['author']
        }),
        test.cmp.element
      );
    });

    it('should call showMoreResults when its parent CardOverlay *first* triggers openCardOverlay', done => {
      const parentCardOverlay = $$('div', { className: 'CoveoCardOverlay' }, $$('div')).el;
      const result = FakeResults.createFakeResult();
      result.moreResults = () => undefined; // moreResults needs to exist
      test = Mock.advancedResultComponentSetup<ResultFolding>(ResultFolding, result, <Mock.AdvancedComponentSetupOptions>{
        element: parentCardOverlay.firstChild
      });
      Defer.defer(() => {
        spyOn(test.cmp, 'showMoreResults');
        $$(parentCardOverlay).trigger(CardOverlayEvents.openCardOverlay);
        $$(parentCardOverlay).trigger(CardOverlayEvents.openCardOverlay);
        expect(test.cmp.showMoreResults).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should call Quickview open when ResultLink has openQuickview option', done => {
      const result = FakeResults.createFakeResultWithChildResult('foo', 1);
      result.childResults[0].flags = 'HasHtmlVersion';

      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(
        ResultFolding,
        <IResultFoldingOptions>{
          resultTemplate: UnderscoreTemplate.fromString(
            '<div class="CoveoQuickview"></div><a class="CoveoResultLink" data-open-quickview="true"/>',
            {}
          )
        },
        result
      );

      Defer.defer(() => {
        const quickview = $$(test.cmp.element).find('.CoveoQuickview');
        const resultLink = $$(test.cmp.element).find('.CoveoResultLink');
        const spyOnQuickviewOpen = jasmine.createSpy('openQuickview');
        (<Quickview>get(quickview)).open = spyOnQuickviewOpen;

        resultLink.click();

        expect(spyOnQuickviewOpen).toHaveBeenCalled();
        done();
      });
    });
  });
}
