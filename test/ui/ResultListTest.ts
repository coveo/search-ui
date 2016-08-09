import * as Mock from '../MockEnvironment';
import {ResultList} from '../../src/ui/ResultList/ResultList';
import {registerCustomMatcher} from '../CustomMatchers';
import {FakeResults} from '../Fake';
import {Simulate} from '../Simulate';
import {$$} from '../../src/utils/Dom';
import {ResultListEvents} from '../../src/events/ResultListEvents';
import {IResultListOptions} from '../../src/ui/ResultList/ResultList';
import {UnderscoreTemplate} from '../../src/ui/Templates/UnderscoreTemplate';

export function ResultListTest() {
  describe('ResultList', function () {
    let test: Mock.IBasicComponentSetup<ResultList>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<ResultList>(ResultList);
      registerCustomMatcher();
    })

    afterEach(function () {
      test = null;
    })

    it('should allow to return the currently displayed result', () => {
      expect(ResultList.resultCurrentlyBeingRendered).toBeNull();
      let data = FakeResults.createFakeResult();
      test.cmp.buildResult(data);
      expect(ResultList.resultCurrentlyBeingRendered).toBe(data);
    })

    it('should set currently displayed result to undefined when they are all rendered', () => {
      let data = FakeResults.createFakeResults(13);
      test.cmp.buildResults(data);
      expect(ResultList.resultCurrentlyBeingRendered).toBeNull();
    })

    it('should reset currently displayed on new query', () => {
      let data = FakeResults.createFakeResult();
      test.cmp.buildResult(data);
      expect(ResultList.resultCurrentlyBeingRendered).toBe(data);
      Simulate.query(test.env);
      expect(ResultList.resultCurrentlyBeingRendered).toBeNull();
    })

    it('should allow to build a single result element', function () {
      let data = FakeResults.createFakeResult();
      let built = test.cmp.buildResult(data);
      expect(built).toBeDefined();
      let rs = $$(built).find('.CoveoResultLink');
      expect($$(rs).text()).toBe(data.title);
    })

    it('should allow to build multiple results element', function () {
      let data = FakeResults.createFakeResults(13);
      let built = test.cmp.buildResults(data);
      expect(built.length).toBe(13);
      let rs = $$(built[0]).find('.CoveoResultLink');
      expect($$(rs).text()).toBe(data.results[0].title);
      rs = $$(built[12]).find('.CoveoResultLink');
      expect($$(rs).text()).toBe(data.results[12].title);
    })

    it('should allow to render results inside the result list', function () {
      let data = FakeResults.createFakeResults(13);
      test.cmp.renderResults(test.cmp.buildResults(data));
      expect($$(test.cmp.element).findAll('.CoveoResult').length).toBe(13);
    })

    it('should trigger result displayed event when rendering', function () {
      let data = FakeResults.createFakeResults(6);
      let spyResult = jasmine.createSpy('spyResult');
      let spyResults = jasmine.createSpy('spyResults');
      $$(test.cmp.element).on(ResultListEvents.newResultDisplayed, spyResult);
      $$(test.cmp.element).on(ResultListEvents.newResultsDisplayed, spyResults);
      test.cmp.renderResults(test.cmp.buildResults(data));
      expect(spyResult).toHaveBeenCalledTimes(6);
      expect(spyResults).toHaveBeenCalledTimes(1);
    })

    it('should render itself correctly after a full query', function () {
      let spyResult = jasmine.createSpy('spyResult');
      let spyResults = jasmine.createSpy('spyResults');
      $$(test.cmp.element).on(ResultListEvents.newResultDisplayed, spyResult);
      $$(test.cmp.element).on(ResultListEvents.newResultsDisplayed, spyResults);
      Simulate.query(test.env);
      expect(test.cmp.getDisplayedResults().length).toBe(10);
      expect(test.cmp.getDisplayedResultsElements().length).toBe(10);
      expect(spyResult).toHaveBeenCalledTimes(10);
      expect(spyResults).toHaveBeenCalledTimes(1);
    })

    it('should clear itself on query error', function () {
      Simulate.query(test.env);
      expect(test.cmp.getDisplayedResults().length).toBe(10);
      expect(test.cmp.getDisplayedResultsElements().length).toBe(10);
      Simulate.query(test.env, {
        error: {
          message: 'oh noes',
          type: 'very bad',
          name: 'oh noes very bad'
        }
      })
      expect(test.cmp.getDisplayedResults().length).toBe(0);
      expect(test.cmp.getDisplayedResultsElements().length).toBe(0);
    })

    it('should change CSS layout class when event is called', function () {
      $$(test.env.root).trigger(ResultListEvents.changeLayout, {
        layout: 'card'
      })
      expect(test.cmp.options.resultContainer.classList).toContain('coveo-card-layout');
    })

    describe('exposes options', function () {
      it('resultContainer allow to specify where to render results', function () {
        let aNewContainer = document.createElement('div');
        expect(aNewContainer.children.length).toBe(0);
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          resultContainer: aNewContainer
        })
        Simulate.query(test.env);
        expect(aNewContainer.children.length).toBe(10);
      })

      it('resultTemplate allow to specify a template manually', function () {
        let tmpl: UnderscoreTemplate = Mock.mock<UnderscoreTemplate>(UnderscoreTemplate);
        let asSpy = <any>tmpl;
        asSpy.instantiateToElement.and.returnValue(document.createElement('div'));
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          resultTemplate: tmpl
        })
        Simulate.query(test.env);
        expect(tmpl.instantiateToElement).toHaveBeenCalledTimes(10);
      })

      it('waitAnimation allow to specify a different animation such as spin or fade', function () {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          waitAnimation: 'fade'
        })

        Simulate.query(test.env, {
          callbackDuringQuery: () => {
            expect($$(test.cmp.options.waitAnimationContainer).hasClass('coveo-fade-out')).toBe(true)
          },
          callbackAfterQuery: () => {
            expect($$(test.cmp.options.waitAnimationContainer).hasClass('coveo-fade-out')).not.toBe(true)
          }
        })

        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          waitAnimation: 'spinner'
        })

        Simulate.query(test.env, {
          callbackDuringQuery: () => {
            expect($$(test.cmp.options.waitAnimationContainer).find('.coveo-loading-spinner')).toBeDefined();
          },
          callbackAfterQuery: () => {
            expect($$(test.cmp.options.waitAnimationContainer).find('.coveo-loading-spinner')).toBeNull();
          }
        })
      })

      it('waitAnimationContainer allow to specify where to display the animation', function () {
        let aNewContainer = document.createElement('div');
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          waitAnimation: 'fade',
          waitAnimationContainer: aNewContainer
        })
        Simulate.query(test.env, {
          callbackDuringQuery: () => {
            expect($$(aNewContainer).hasClass('coveo-fade-out')).toBe(true);
          }
        })
      })

      it('enableInfiniteScroll allow to enable infinite scrolling', function () {

        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: false
        })
        Simulate.query(test.env);
        expect(test.env.queryController.fetchMore).not.toHaveBeenCalled();

        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: true
        })
        Simulate.query(test.env);
        expect(test.env.queryController.fetchMore).toHaveBeenCalled();
      })

      it('infiniteScrollPageSize allow to specify the number of result to fetch when scrolling', function () {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: true,
          infiniteScrollPageSize: 26
        })
        Simulate.query(test.env);
        expect(test.env.queryController.fetchMore).toHaveBeenCalledWith(26);
      })

      it('fieldsToInclude allow to specify an array of fields to include in the query', function () {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          fieldsToInclude: ['@field1', '@field2', '@field3']
        })
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field1');
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field2');
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field3');
      })
    })
  })
}
