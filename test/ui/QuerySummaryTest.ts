/// <reference path="../Test.ts" />

module Coveo {
  describe('QuerySummary', function () {
    var test: Mock.IBasicComponentSetup<QuerySummary>;
    beforeEach(function () {
      test = Mock.basicComponentSetup<QuerySummary>(QuerySummary);
    })

    it('should not display tips when there are results', function () {
      var results = FakeResults.createFakeResults(10);
      Simulate.query(test.env, {
        results: results
      })
      expect($$(test.cmp.element).find('.coveo-query-summary-search-tips-info')).toBeNull();

      results = FakeResults.createFakeResults(0);
      Simulate.query(test.env, {
        results: results
      })
      expect($$(test.cmp.element).find('.coveo-query-summary-search-tips-info')).not.toBeNull();
    })

    it('should display result range when there are results', function () {
      var results = FakeResults.createFakeResults(10);
      Simulate.query(test.env, {
        results: results
      })
      expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching(/^Results 1-10 of 11/));

      results = FakeResults.createFakeResults(0);
      Simulate.query(test.env, {
        results: results
      })
      expect($$(test.cmp.element).text()).not.toEqual(jasmine.stringMatching(/^Results.*of.*/));
    })


    describe('exposes options', function () {
      it('enableSearchTips allow to display search tips on no results', function () {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableSearchTips: false
        });

        var results = FakeResults.createFakeResults(0);
        Simulate.query(test.env, {
          results: results
        });
        expect($$(test.cmp.element).find('.coveo-query-summary-search-tips-info')).toBeNull();

        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableSearchTips: true
        });

        results = FakeResults.createFakeResults(0);
        Simulate.query(test.env, {
          results: results
        });
        expect($$(test.cmp.element).find('.coveo-query-summary-search-tips-info')).not.toBeNull();
      })

      it('onlyDisplaySearchTips allow to not render the results range', function () {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          onlyDisplaySearchTips: false
        });

        var results = FakeResults.createFakeResults(10);
        Simulate.query(test.env, {
          results: results
        });
        expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching(/^Results.*of.*/));

        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          onlyDisplaySearchTips: true
        });

        results = FakeResults.createFakeResults(10);
        Simulate.query(test.env, {
          results: results
        });
        expect($$(test.cmp.element).text()).not.toEqual(jasmine.stringMatching(/^Results.*of.*/));
      })
    })
  })
}