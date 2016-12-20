import * as Mock from '../MockEnvironment';
import {ResultFolding} from '../../src/ui/ResultFolding/ResultFolding';
import {IResultFoldingOptions} from '../../src/ui/ResultFolding/ResultFolding';
import {FakeResults} from '../Fake';
import {$$} from '../../src/utils/Dom';
import {IQueryResult} from '../../src/rest/QueryResult';
import {UnderscoreTemplate} from '../../src/ui/Templates/UnderscoreTemplate';
import {TemplateCache} from '../../src/ui/Templates/TemplateCache';
import {CardOverlayEvents} from '../../src/events/CardOverlayEvents';

export function ResultFoldingTest() {
  describe('ResultFolding', function () {
    let test: Mock.IBasicComponentSetup<ResultFolding>;
    beforeEach(function () {
      test = Mock.basicResultComponentSetup<ResultFolding>(ResultFolding);
    });

    describe('exposes options', function () {
      it('resultTemplate should use the default result template when not defined', function () {
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
          resultTemplate: undefined
        }, undefined);
        expect((<any>test.cmp.options.resultTemplate).constructor.name).toBe('DefaultFoldingTemplate');
      });

      it('normalCaption should be set properly when not expanded and expanded caption is defined', function () {
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
          normalCaption: 'foobar',
          expandedCaption: 'obligatory'
        }, FakeResults.createFakeResultWithChildResult('heyo', 3));
        expect($$(test.cmp.element).find('.coveo-folding-normal-caption').innerHTML).toContain('foobar');
      });

      it('expandedCaption should be set properly when expanded and normal caption is defined', function () {
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
          expandedCaption: 'foobar',
          normalCaption: 'obligatory'
        }, FakeResults.createFakeResultWithChildResult('heyo', 3));
        test.cmp.result.moreResults = () => new Promise((resolve, reject) => null);
        test.cmp.showMoreResults();
        expect($$(test.cmp.element).find('.coveo-folding-expanded-caption').innerHTML).toContain('foobar');
      });

      it('normalCaption and extendedCaption should not be shown if one or the other is not defined', function () {
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
          expandedCaption: 'foobar',
          normalCaption: undefined
        }, FakeResults.createFakeResultWithChildResult('heyo', 3));
        test.cmp.result.moreResults = () => new Promise((resolve, reject) => null);
        test.cmp.showMoreResults();
        expect($$(test.cmp.element).find('.coveo-folding-expanded-caption')).toBeNull();

        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
          normalCaption: 'foobar',
          expandedCaption: undefined
        }, FakeResults.createFakeResultWithChildResult('heyo', 3));
        expect($$(test.cmp.element).find('.coveo-folding-normal-caption')).toBeNull();
      });

      it('moreCaption should set the appropriate caption on the expand link', function () {
        let fakeResult = FakeResults.createFakeResult();
        fakeResult.moreResults = () => new Promise((res, rej) => null);
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
          moreCaption: 'foobar'
        }, fakeResult);
        expect($$(test.cmp.element.parentElement).find('.coveo-folding-show-more').innerHTML).toBe('foobar');
      });

      it('lessCaption should set the appropriate caption on the unexpand link', function () {
        let fakeResult = FakeResults.createFakeResult();
        fakeResult.moreResults = () => new Promise((res, rej) => null);
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
          lessCaption: 'foobar'
        }, fakeResult);
        expect($$(test.cmp.element.parentElement).find('.coveo-folding-show-less').innerHTML).toBe('foobar');
      });

      it('oneResultCaption should set the appropriate caption when there is only one result', function () {
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
          oneResultCaption: 'foobar'
        }, FakeResults.createFakeResult());
        expect($$(test.cmp.element).find('.coveo-folding-oneresult-caption').innerHTML).toBe('foobar');
      });
    });

    it('should not display any header caption when there are no child results', function () {
      let fakeResult = FakeResults.createFakeResult();
      fakeResult.childResults = [];
      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
        normalCaption: 'normal',
        expandedCaption: 'expanded'
      }, fakeResult);
      expect($$(test.cmp.element).find('.coveo-folding-normal-caption').style.display).toBe('none');
      expect($$(test.cmp.element).find('.coveo-folding-expanded-caption').style.display).toBe('none');
    });

    it('should not display the \'more\' link when moreResults handler is not available', function () {
      expect($$(test.cmp.element).find('coveo-folding-show-more')).toBeNull();
    });

    describe('after calling showMoreResults', function () {
      let fakeResult: IQueryResult;

      beforeEach(function () {
        fakeResult = FakeResults.createFakeResultWithChildResult('rezzult', 4);
        fakeResult.moreResults = () => new Promise<IQueryResult[]>((resolve, reject) => {
          resolve(fakeResult.childResults);
        });
        test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, undefined, fakeResult);
        test.cmp.showMoreResults();
      });

      it('should get the appropriate child results', function (done) {
        setTimeout(() => {
          expect(test.cmp.childResults).toBe(fakeResult.childResults);
          done();
        }, 0);
      });

      it('should display the appropriate child results', function (done) {
        setTimeout(() => {
          let displayedChildResults = $$(test.cmp.element).findAll('.coveo-result-folding-child-result');
          expect(displayedChildResults.length).toBe(4);
          let expectedTitles = _.pluck(fakeResult.childResults, 'title');
          let actualTitles = _.map(displayedChildResults, (res: HTMLElement) => $$(res).find('a.CoveoResultLink').innerHTML);
          expect(actualTitles).toEqual(expectedTitles);
          done();
        }, 0);
      });

      it('should put an \'expanded\' CSS class on the expanded results', function (done) {
        setTimeout(() => {
          _.each($$(test.cmp.element).findAll('.coveo-result-folding-child-result'), (res: HTMLElement) => {
            expect($$(res).hasClass('coveo-expanded-child-result')).toBe(true);
          });
          done();
        });
      });

      it('should display the original results when showLessResults is called', function (done) {
        let tempChildResults = fakeResult.childResults;
        fakeResult.childResults = [];
        fakeResult.moreResults = () => new Promise((res, rej) => res(tempChildResults));
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
    });

    it('should put a \'normal\' caption on unexpanded search results', function () {
      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, undefined, FakeResults.createFakeResultWithChildResult('rez', 10));
      _.each($$(test.cmp.element).findAll('.coveo-result-folding-child-result'), (res: HTMLElement) => {
        expect($$(res).hasClass('coveo-normal-child-result')).toBe(true);
      });
    });

    it('should load template properly', function () {
      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
        resultTemplate: UnderscoreTemplate.fromString('Foo')
      }, FakeResults.createFakeResultWithChildResult('razzza', 2));
      _.each($$(test.cmp.element).findAll('.coveo-result-folding-child-result'), (result: HTMLElement) => {
        expect(result.innerHTML).toBe('Foo');
      });
    });

    it('should automatically initialize components in child results\' templates', function () {
      let fakeResult = FakeResults.createFakeResultWithChildResult('test', 3);
      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
        resultTemplate: UnderscoreTemplate.fromString('<a class="CoveoResultLink" />')
      }, fakeResult);
      _.each($$(test.cmp.element).findAll('.coveo-result-folding-child-result'), (result: HTMLElement, i) => {
        expect(result.getAttribute('href')).toBe(fakeResult.childResults[i].clickUri);
      });
    });

    it('can load an external template from an id', function () {
      TemplateCache.registerTemplate('Foo', UnderscoreTemplate.fromString('foubarre'));
      test = Mock.advancedResultComponentSetup<ResultFolding>(ResultFolding, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
        element: $$('div', { 'data-result-template-id': 'Foo' }).el
      });
      expect(test.cmp.options.resultTemplate.instantiateToElement({}).innerHTML).toBe('foubarre');
    });

    it('should automatically use the template inside its element', function () {
      test = Mock.advancedResultComponentSetup<ResultFolding>(ResultFolding, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
        element: $$('div', {}, $$('script', { className: 'result-template', 'type': 'text/underscore' }, 'heyo')).el,
      });
      expect(test.cmp.options.resultTemplate.instantiateToElement({}).innerHTML).toBe('heyo');
    });

    it('should show or hide elements with special classes when expanding or unexpanding', function (done) {
      let templateStr = '<div class="coveo-show-if-normal"></div><div class="coveo-show-if-expanded"></div>';

      let result = FakeResults.createFakeResultWithChildResult('foo', 3);
      result.moreResults = () => new Promise((res, rej) => res(result.childResults));

      test = Mock.optionsResultComponentSetup<ResultFolding, IResultFoldingOptions>(ResultFolding, <IResultFoldingOptions>{
        resultTemplate: UnderscoreTemplate.fromString(templateStr)
      }, result);

      expect($$(test.cmp.element).find('.coveo-show-if-normal').style.display).not.toBe('none');
      expect($$(test.cmp.element).find('.coveo-show-if-expanded').style.display).toBe('none');

      test.cmp.showMoreResults();

      setTimeout(() => {
        expect($$(test.cmp.element).find('.coveo-show-if-normal').style.display).toBe('none');
        expect($$(test.cmp.element).find('.coveo-show-if-expanded').style.display).not.toBe('none');
        done();
      });
    });

    it('should call showMoreResults when its parent CardOverlay *first* triggers openCardOverlay', function () {
      let parentCardOverlay = $$('div', { className: 'CoveoCardOverlay' }, $$('div')).el;
      test = Mock.advancedResultComponentSetup<ResultFolding>(ResultFolding, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
        element: parentCardOverlay.firstChild
      });
      spyOn(test.cmp, 'showMoreResults');
      $$(parentCardOverlay).trigger(CardOverlayEvents.openCardOverlay);
      $$(parentCardOverlay).trigger(CardOverlayEvents.openCardOverlay);
      expect(test.cmp.showMoreResults).toHaveBeenCalledTimes(1);
    });
  });
}
