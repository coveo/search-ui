/// <reference path="../Test.ts" />
module Coveo {
  describe('ResultList', function () {
    var test: Mock.IBasicComponentSetup<ResultList>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<ResultList>(ResultList);
      registerCustomMatcher();
    })

    afterEach(function () {
      test = null;
    })

    it('should allow to build a single result element', function () {
      var data = FakeResults.createFakeResult();
      var built = test.cmp.buildResult(data);
      expect(built).toBeDefined();
      var rs = $$(built).find('.CoveoResultLink');
      expect($$(rs).text()).toBe(data.title);
    })

    it('should allow to build multiple results element', function () {
      var data = FakeResults.createFakeResults(13);
      var built = test.cmp.buildResults(data);
      expect(built.length).toBe(13);
      var rs = $$(built[0]).find('.CoveoResultLink');
      expect($$(rs).text()).toBe(data.results[0].title);
      rs = $$(built[12]).find('.CoveoResultLink');
      expect($$(rs).text()).toBe(data.results[12].title);
    })

    it('should allow to render results inside the result list', function () {
      var data = FakeResults.createFakeResults(13);
      test.cmp.renderResults(test.cmp.buildResults(data));
      expect($$(test.cmp.element).findAll('.CoveoResult').length).toBe(13);
    })

    it('should trigger result displayed event when rendering', function () {
      var data = FakeResults.createFakeResults(6);
      var spyResult = jasmine.createSpy('spyResult');
      var spyResults = jasmine.createSpy('spyResults');
      $$(test.cmp.element).on(ResultListEvents.newResultDisplayed, spyResult);
      $$(test.cmp.element).on(ResultListEvents.newResultsDisplayed, spyResults);
      test.cmp.renderResults(test.cmp.buildResults(data));
      expect(spyResult).toHaveBeenCalledTimes(6);
      expect(spyResults).toHaveBeenCalledTimes(1);
    })

    it('should render itself correctly after a full query', function () {
      var spyResult = jasmine.createSpy('spyResult');
      var spyResults = jasmine.createSpy('spyResults');
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

    describe('exposes options', function () {
      it('resultContainer allow to specify where to render results', function () {
        var aNewContainer = document.createElement('div');
        expect(aNewContainer.children.length).toBe(0);
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          resultContainer: aNewContainer
        })
        Simulate.query(test.env);
        expect(aNewContainer.children.length).toBe(10);
      })

      it('resultTemplate allow to specify a template manually', function () {
        var tmpl: UnderscoreTemplate = Mock.mock<UnderscoreTemplate>(UnderscoreTemplate);
        var asSpy = <any>tmpl;
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
        var aNewContainer = document.createElement('div');
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
        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field1');
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field2');
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field3');
      })
    })
  })
}
