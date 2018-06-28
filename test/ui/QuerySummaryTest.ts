import * as Mock from '../MockEnvironment';
import { QuerySummary, noResultsCssClass } from '../../src/ui/QuerySummary/QuerySummary';
import { FakeResults } from '../Fake';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { IQuerySummaryOptions } from '../../src/ui/QuerySummary/QuerySummary';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { ResultList } from '../../src/ui/ResultList/ResultList';

const queryTag = '${query}';

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

    describe('when there are result lists in the page', () => {
      let resultListOne: ResultList;
      let resultListTwo: ResultList;

      beforeEach(() => {
        resultListOne = new ResultList($$('div', { className: 'CoveoResultList' }).el, null, test.env);
        resultListTwo = new ResultList($$('div', { className: 'CoveoResultList' }).el, null, test.env);
        test.cmp.root.appendChild(resultListOne.element);
        test.cmp.root.appendChild(resultListTwo.element);
      });

      it('should not display the results range if there is exactly one result list with infinite scroll enabled', () => {
        resultListOne.options.enableInfiniteScroll = true;
        $$(resultListTwo.element).remove();

        Simulate.query(test.env);
        expect($$(test.cmp.element).text()).not.toEqual(jasmine.stringMatching(/^Results 1-10/));
      });

      it('should display the results range if there is exactly one result list with infinite scroll disabled', () => {
        resultListOne.options.enableInfiniteScroll = false;
        $$(resultListTwo.element).remove();

        Simulate.query(test.env);
        expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching(/^Results 1-10/));
      });

      it('should not display the results range if there is at least one result list with infinite scroll enabled', () => {
        resultListOne.options.enableInfiniteScroll = true;
        resultListTwo.options.enableInfiniteScroll = false;

        Simulate.query(test.env);
        expect($$(test.cmp.element).text()).not.toEqual(jasmine.stringMatching(/^Results 1-10/));
      });

      it('should display query recall if possible, but not the results range if there is a result list with infinite scroll', () => {
        const queryBuilder = new QueryBuilder();
        queryBuilder.expression.add('foo');
        resultListOne.options.enableInfiniteScroll = true;

        Simulate.query(test.env, {
          query: queryBuilder.build()
        });
        expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching(/for foo/));
        expect($$(test.cmp.element).text()).not.toEqual(jasmine.stringMatching(/^Results 1-10/));
      });
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

      it('enableNoResultsFoundMessage allow to display the no results found message on no results', () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: false
        });

        let results = FakeResults.createFakeResults(0);
        Simulate.query(test.env, {
          results: results
        });
        expect($$(test.cmp.element).find('.coveo-query-summary-no-results-string')).toBeNull();

        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true
        });

        results = FakeResults.createFakeResults(0);
        Simulate.query(test.env, {
          results: results
        });
        expect($$(test.cmp.element).find('.coveo-query-summary-no-results-string')).not.toBeNull();
      });

      it('enableCancelLastAction allow to display the cancel last action link on no results', () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableCancelLastAction: false
        });

        let results = FakeResults.createFakeResults(0);
        Simulate.query(test.env, {
          results: results
        });
        expect($$(test.cmp.element).find('.coveo-query-summary-cancel-last')).toBeNull();

        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableCancelLastAction: true
        });

        results = FakeResults.createFakeResults(0);
        Simulate.query(test.env, {
          results: results
        });
        expect($$(test.cmp.element).find('.coveo-query-summary-cancel-last')).not.toBeNull();
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

    describe('when the option enableNoResultsFoundMessage is set to true', () => {
      it(`when the noResultsFoundMessage is not specified
          it should return the default message`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true
        });
        expect(test.cmp.options.noResultsFoundMessage).toBe(`No results for ${queryTag}`);
      });

      it(`when the noResultsFoundMessage is specified 
          it should return the custom message`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true,
          noResultsFoundMessage: 'customMessage'
        });
        expect(test.cmp.options.noResultsFoundMessage).toBe('customMessage');
      });

      describe('when the noResultsFoundMessage is parsed', () => {
        it(`when there is no query tag in the noResultsFoundMessage
            it should not change the initial message`, () => {
          test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
            enableNoResultsFoundMessage: true,
            noResultsFoundMessage: 'customMessage'
          });

          test.env.queryStateModel.get = () => 'querySearched';
          Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

          const customMessageElement = $$(test.cmp.element).find('.coveo-query-summary-no-results-string');

          expect(customMessageElement.textContent).toBe('customMessage');
        });

        it(`when there is one query tag in the noResultsFoundMessage
            it should replace the query tag by the query searched`, () => {
          test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
            enableNoResultsFoundMessage: true,
            noResultsFoundMessage: `customMessage ${queryTag}`
          });

          test.env.queryStateModel.get = () => 'querySearched';
          Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

          const customMessageElement = $$(test.cmp.element).find('.coveo-query-summary-no-results-string');

          expect(customMessageElement.textContent).toBe('customMessage querySearched');
        });

        it(`when there is multiple query tags in the noResultsFoundMessage
            it should replace all the query tags by the query searched`, () => {
          test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
            enableNoResultsFoundMessage: true,
            noResultsFoundMessage: `custom ${queryTag} Message ${queryTag}`
          });

          test.env.queryStateModel.get = () => 'querySearched';
          Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

          const customMessageElement = $$(test.cmp.element).find('.coveo-query-summary-no-results-string');

          expect(customMessageElement.textContent).toBe('custom querySearched Message querySearched');
        });
      });
    });

    describe('when a custom no results page is added inside the QuerySummary component', () => {
      it(`when there are results
          it should not display the custom no results page`, () => {
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">Custom No Results Page</div>`;
        Simulate.query(test.env, { results: FakeResults.createFakeResults(10) });

        expect($$(test.cmp.element).find('.coveo-no-results-page-hidden')).not.toBeNull();
      });

      it(`when there are no results
          it should display the custom no results page`, () => {
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">Custom No Results Page</div>`;

        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect($$(test.cmp.element).find('.coveo-no-results-page-hidden')).toBeNull();
      });

      it(`when a query tag is added in the custom no results page
          it should replace the query tag by the query searched`, () => {
        test.env.queryStateModel.get = () => 'querySearched';
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">${queryTag}</div>`;

        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        const customNoResultsPageElement = $$(test.cmp.element).find(`.${noResultsCssClass}`);

        expect(customNoResultsPageElement.textContent).toBe('querySearched');
      });

      it(`when mutiple query tags are added in the custom no results page
          it should replace all the query tags by the query searched`, () => {
        test.env.queryStateModel.get = () => 'querySearched';
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">${queryTag} ${queryTag}</div>`;
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        const customNoResultsPageElement = $$(test.cmp.element).find(`.${noResultsCssClass}`);

        expect(customNoResultsPageElement.textContent).toBe('querySearched querySearched');
      });
    });
  });
}
