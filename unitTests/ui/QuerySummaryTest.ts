import * as Mock from '../MockEnvironment';
import { QuerySummary, noResultsCssClass } from '../../src/ui/QuerySummary/QuerySummary';
import { FakeResults } from '../Fake';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { IQuerySummaryOptions } from '../../src/ui/QuerySummary/QuerySummary';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { ResultList } from '../../src/ui/ResultList/ResultList';
import { escape } from 'underscore';
import { l } from '../../src/Core';

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
      expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching(/^Results 1-10 of 10/));

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

    it('should display query recall with spaces properly if there is a query', () => {
      const queryBuilder = new QueryBuilder();
      queryBuilder.expression.add('foo bar');
      const results = FakeResults.createFakeResults(10);

      Simulate.query(test.env, {
        results: results,
        query: queryBuilder.build()
      });
      expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching(/for foo bar/));
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
      it(`when enableSearchTips is set to true,
          it should display the search tips on no results`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableSearchTips: true
        });

        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect($$(test.cmp.element).find('.coveo-query-summary-search-tips-info')).not.toBeNull();
      });

      it(`when enableSearchTips is set to false,
          it should not display the search tips on no results`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableSearchTips: false
        });

        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect($$(test.cmp.element).find('.coveo-query-summary-search-tips-info')).toBeNull();
      });

      it(`when enableNoResultsFoundMessage is set to true,
          it should display the no results found message on no results`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true
        });

        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect($$(test.cmp.element).find('.coveo-query-summary-no-results-string')).not.toBeNull();
      });

      it(`when enableNoResultsFoundMessage is set to false,
          it should not display the no results found message on no results`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: false
        });

        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect($$(test.cmp.element).find('.coveo-query-summary-no-results-string')).toBeNull();
      });

      describe('when enableCancelLastAction is set to true, on no results', () => {
        function getCancelLastActionLink() {
          return $$(test.cmp.element).find('.coveo-query-summary-cancel-last');
        }

        beforeEach(() => {
          test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
            enableCancelLastAction: true
          });

          Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });
        });

        it('should display the cancel last action link', () => {
          expect(getCancelLastActionLink()).not.toBeNull();
        });

        it('should give a tabindex to the cancel last action link', () => {
          expect(getCancelLastActionLink().getAttribute('tabindex')).toEqual('0');
        });

        it('should give a role to the cancel last action link', () => {
          expect(getCancelLastActionLink().getAttribute('role')).toEqual('button');
        });
      });

      it(`when enableCancelLastAction is set to false,
          it should not display the cancel last action link on no results`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableCancelLastAction: false
        });

        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect($$(test.cmp.element).find('.coveo-query-summary-cancel-last')).toBeNull();
      });

      it(`when onlyDisplaySearchTips is set to true,
          it should not display the results range when there are results`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          onlyDisplaySearchTips: true
        });

        Simulate.query(test.env, { results: FakeResults.createFakeResults(10) });

        expect($$(test.cmp.element).text()).not.toEqual(jasmine.stringMatching(/^Results.*of.*/));
      });

      it(`when onlyDisplaySearchTips is set to false,
          it should display the results range when there are results`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          onlyDisplaySearchTips: false
        });

        Simulate.query(test.env, { results: FakeResults.createFakeResults(10) });

        expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching(/^Results.*of.*/));
      });
    });

    describe('when the option enableNoResultsFoundMessage is set to true', () => {
      function getCustomMessageElement() {
        return $$(test.cmp.element).find('.coveo-query-summary-no-results-string');
      }

      it(`when there is no query tag in the noResultsFoundMessage,
          it should not change the initial message`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true,
          noResultsFoundMessage: 'customMessage'
        });

        test.env.queryStateModel.get = () => 'querySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getCustomMessageElement().textContent).toBe('customMessage');
      });

      it(`when there is one query tag in the noResultsFoundMessage,
          it should replace the query tag with the query searched`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true,
          noResultsFoundMessage: `customMessage ${queryTag}`
        });

        test.env.queryStateModel.get = () => 'querySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getCustomMessageElement().textContent).toBe('customMessage querySearched');
      });

      it(`when there is multiple query tags in the noResultsFoundMessage,
          it should replace all the query tags with the query searched`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true,
          noResultsFoundMessage: `custom ${queryTag} Message ${queryTag}`
        });

        test.env.queryStateModel.get = () => 'querySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getCustomMessageElement().textContent).toBe('custom querySearched Message querySearched');
      });

      it(`when mutiple no results page are triggered consicutively with different querySearched,
          it should update the query tags with the new query searched`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true,
          noResultsFoundMessage: `${queryTag}`
        });

        test.env.queryStateModel.get = () => 'firstQuerySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        test.env.queryStateModel.get = () => 'SecondQuerySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getCustomMessageElement().textContent).toBe('SecondQuerySearched');
      });

      it(`when the queryTag is in the attributes of an element,
          it should replace this queryTag by the querySearched while escaping the tags`, () => {
        const customMessage: string = `<div><a href="${queryTag}"></a></div>`;

        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true,
          noResultsFoundMessage: customMessage
        });

        test.env.queryStateModel.get = () => 'querySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });
        const highlightedText = '<span class="coveo-highlight">querySearched</span>';
        const parsedCustomMessage: string = `${escape('<div><a href=')}"${highlightedText}"${escape('></a></div>')}`;
        expect(getCustomMessageElement().innerHTML).toBe(parsedCustomMessage);
      });

      it(`when the query searched is an empty string,
          it should put the string NoResult instead`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true,
          noResultsFoundMessage: `customMessage ${queryTag}`
        });

        test.env.queryStateModel.get = () => '';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getCustomMessageElement().textContent).toBe(l('NoResult'));
      });

      it(`when the query searched is the same as the queryTag,
          it should replace the query tag with the query searched`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true,
          noResultsFoundMessage: `${queryTag}`
        });

        test.env.queryStateModel.get = () => `${queryTag}`;
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getCustomMessageElement().textContent).toBe(`${queryTag}`);
      });

      it(`when a query tag is replaced,
          it should escape the HTML against XSS`, () => {
        test = Mock.optionsComponentSetup<QuerySummary, IQuerySummaryOptions>(QuerySummary, {
          enableNoResultsFoundMessage: true,
          noResultsFoundMessage: `${queryTag}`
        });
        test.env.queryStateModel.get = () => '<script>alert("XSS")</script>';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getCustomMessageElement().innerHTML).toBe(`<span class="coveo-highlight">&lt;script&gt;alert("XSS")&lt;/script&gt;</span>`);
      });
    });

    describe('when a custom no results page is added inside the QuerySummary component', () => {
      function getcustomNoResultsPageElement() {
        return $$(test.cmp.element).find(`.${noResultsCssClass}`);
      }

      it(`when there are results,
          it should not display the custom no results page`, () => {
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">Custom No Results Page</div>`;
        Simulate.query(test.env, { results: FakeResults.createFakeResults(10) });

        expect($$(test.cmp.element).find('.coveo-no-results')).toBeNull();
      });

      it(`when there are no results,
          it should display the custom no results page`, () => {
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">Custom No Results Page</div>`;
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect($$(test.cmp.element).find('.coveo-no-results')).not.toBeNull();
      });

      it(`when a query tag is added in the custom no results page,
          it should replace the query tag with the query searched`, () => {
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">${queryTag}</div>`;
        test.env.queryStateModel.get = () => 'querySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getcustomNoResultsPageElement().textContent).toBe('querySearched');
      });

      it(`when mutiple query tags are added in the custom no results page,
          it should replace all the query tags with the query searched`, () => {
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">${queryTag} ${queryTag}</div>`;
        test.env.queryStateModel.get = () => 'querySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getcustomNoResultsPageElement().textContent).toBe('querySearched querySearched');
      });

      it(`when mutiple no results page are triggered consicutively with different querySearched,
          it should update the query tags with the new query searched`, () => {
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">${queryTag}</div>`;

        test.env.queryStateModel.get = () => 'firstQuerySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        test.env.queryStateModel.get = () => 'SecondQuerySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getcustomNoResultsPageElement().textContent).toBe('SecondQuerySearched');
      });

      it(`when the queryTag is in the attributes of an element,
          it should replace this queryTag by the querySearched`, () => {
        const customNoResultsPage = `<div><a href="${queryTag}"></a></div>`;
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">${customNoResultsPage}</div>`;

        test.env.queryStateModel.get = () => 'querySearched';
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        const parsedCustomNoResultsPage: string = '<div><a href="<span class=" coveo-highlight"="">querySearched"&gt;</a></div>';
        expect(getcustomNoResultsPageElement().innerHTML).toBe(parsedCustomNoResultsPage);
      });

      it(`when the query searched is an empty string,
          it should replace the query tag with the query searched`, () => {
        test.env.queryStateModel.get = () => '';
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">${queryTag}</div>`;
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getcustomNoResultsPageElement().textContent).toBe('');
      });

      it(`when the query searched is the same as the queryTag,
          it should replace the query tag with the query searched`, () => {
        test.env.queryStateModel.get = () => `${queryTag}`;
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">${queryTag}</div>`;
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getcustomNoResultsPageElement().textContent).toBe(`${queryTag}`);
      });

      it(`when a query tag is replaced,
          it should escape the HTML against XSS`, () => {
        test.env.queryStateModel.get = () => '<script>alert("XSS")</script>';
        test.cmp.element.innerHTML = `<div class="${noResultsCssClass}">${queryTag}</div>`;
        Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });

        expect(getcustomNoResultsPageElement().innerHTML).toBe(
          `<span class="coveo-highlight">&lt;script&gt;alert("XSS")&lt;/script&gt;</span>`
        );
      });
    });
  });
}
