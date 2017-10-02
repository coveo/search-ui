import * as Mock from '../MockEnvironment';
import { QuerySummary } from '../../src/ui/QuerySummary/QuerySummary';
import { FakeResults } from '../Fake';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { IQuerySummaryOptions } from '../../src/ui/QuerySummary/QuerySummary';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';

export function QuerySummaryTest() {
  describe('QuerySummary', () => {
    let test: Mock.IBasicComponentSetup<QuerySummary>;
    beforeEach(() => {
      test = Mock.basicComponentSetup<QuerySummary>(QuerySummary);
    });

    it('should not display tips when there are results', () => {
      let results = FakeResults.createFakeResults(10);
      Simulate.query(test.env, {
        results: results
      });
      expect($$(test.cmp.element).find('.coveo-query-summary-search-tips-info')).toBeNull();

      results = FakeResults.createFakeResults(0);
      Simulate.query(test.env, {
        results: results
      });
      expect($$(test.cmp.element).find('.coveo-query-summary-search-tips-info')).not.toBeNull();
    });

    it('should display result range when there are results', () => {
      let results = FakeResults.createFakeResults(10);
      Simulate.query(test.env, {
        results: results
      });
      expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching(/^Results 1-10 of 11/));

      results = FakeResults.createFakeResults(0);
      Simulate.query(test.env, {
        results: results
      });
      expect($$(test.cmp.element).text()).not.toEqual(jasmine.stringMatching(/^Results.*of.*/));
    });

    it('should not display query recall if there is no query', () => {
      const results = FakeResults.createFakeResults(10);
      Simulate.query(test.env, {
        results: results
      });
      expect($$(test.cmp.element).text()).not.toEqual(jasmine.stringMatching(/for/));
    });

    it('should display query recall if there is a query', () => {
      const queryBuilder = new QueryBuilder();
      queryBuilder.expression.add('foo');
      const results = FakeResults.createFakeResults(10);

      Simulate.query(test.env, {
        results: results,
        query: queryBuilder.build()
      });
      expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching(/for foo/));
    });

    describe('exposes options', () => {
      it('enableSearchTips allow to display search tips on no results', () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableSearchTips: false
        });

        let results = FakeResults.createFakeResults(0);
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
      });

      it('onlyDisplaySearchTips allow to not render the results range', () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          onlyDisplaySearchTips: false
        });

        let results = FakeResults.createFakeResults(10);
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
      });
    });
  });
}
