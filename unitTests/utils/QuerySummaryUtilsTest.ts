import * as Mock from '../MockEnvironment';
import { QuerySummaryUtils } from '../../src/utils/QuerySummaryUtils';
import { IQuerySuccessEventArgs } from '../../src/events/QueryEvents';
import { QueryBuilder, $$ } from '../../src/Core';
import { FakeResults } from '../Fake';
import { ResultList } from '../../src/ui/ResultList/ResultList';
import { IResultListOptions } from '../../src/ui/ResultList/ResultListOptions';

export const QuerySummaryUtilsTest = () => {
  describe('QuerySummaryUtils', () => {
    const utils = QuerySummaryUtils;
    let data: IQuerySuccessEventArgs;
    let root: HTMLElement;

    function appendResultListToRoot(options: IResultListOptions = {}) {
      const resultList = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, options).cmp.element;

      root.appendChild(resultList);
    }

    function buildQuerySuccessData(config: Partial<IQuerySuccessEventArgs> = {}) {
      const data: IQuerySuccessEventArgs = {
        query: { q: '' },
        queryBuilder: new QueryBuilder(),
        results: FakeResults.createFakeResults(),
        searchAsYouType: false
      };

      return { ...data, ...config } as IQuerySuccessEventArgs;
    }

    function initDataWithZeroResults() {
      const results = FakeResults.createFakeResults(0);
      data = buildQuerySuccessData({ results });
    }

    function initDataWithOneResultAndFalsyQuery() {
      const query = { q: '', firstResult: 0 };
      const results = FakeResults.createFakeResults(1);

      data = buildQuerySuccessData({ query, results });
    }

    function initDataWithOneResultAndTruthyQuery() {
      const query = { q: 'query', firstResult: 0 };
      const results = FakeResults.createFakeResults(1);

      data = buildQuerySuccessData({ query, results });
    }

    beforeEach(() => (root = $$('div').el));

    it('when calling #replaceQueryTags with a template', () => {
      const template = '${query}';
      const replacement = 'replacement';
      const result = utils.replaceQueryTags(template, replacement);

      expect(result).toBe(replacement);
    });

    describe('when the result list enableInfiniteScroll is disabled', () => {
      beforeEach(() => appendResultListToRoot({ enableInfiniteScroll: false }));

      describe('when the #data object does not have any results', () => {
        beforeEach(initDataWithZeroResults);

        it(`when calling #message, it returns an empty string`, () => {
          const message = utils.message(root, data);
          expect(message).toBe('');
        });

        it(`when calling #htmlMessage, it returns an empty string`, () => {
          const message = utils.htmlMessage(root, data);
          expect(message).toBe('');
        });
      });

      describe(`given the #data object has one result,
      when the query #q is falsy (e.g. an empty string)`, () => {
        beforeEach(initDataWithOneResultAndFalsyQuery);

        it(`when calling #message, it returns the expected message`, () => {
          const message = utils.message(root, data);
          expect(message).toBe('Result 1 of 1');
        });

        it(`when calling #htmlMessage,
        it returns the expected message`, () => {
          const message = utils.htmlMessage(root, data);
          const expected =
            'Result <span class="coveo-highlight coveo-highlight-first">1</span> of <span class="coveo-highlight coveo-highlight-total-count">1</span>';
          expect(message).toBe(expected);
        });
      });

      describe(`given the #data object has one result,
      when the query #q is truthy`, () => {
        beforeEach(initDataWithOneResultAndTruthyQuery);

        it(`when calling #message,
        it includes the query in the message`, () => {
          const message = utils.message(root, data);
          expect(message).toContain(data.query.q);
        });

        it(`when calling #htmlMessage,
        it includes the query in the message`, () => {
          const message = utils.htmlMessage(root, data);
          expect(message).toContain(data.query.q);
        });
      });
    });

    describe(`when the result list has enableInfiniteScroll enabled`, () => {
      beforeEach(() => appendResultListToRoot({ enableInfiniteScroll: true }));

      describe(`given the #data object has one result,
      when the query #q is falsy (e.g. an empty string)`, () => {
        beforeEach(initDataWithOneResultAndFalsyQuery);

        it(`when calling #message, it returns the expected message`, () => {
          const message = utils.message(root, data);
          expect(message).toBe('1 result');
        });

        it(`when calling #htmlMessage, it returns the expected message`, () => {
          const message = utils.htmlMessage(root, data);
          const expected = '<span class="coveo-highlight coveo-highlight-total-count">1</span> result';
          expect(message).toBe(expected);
        });
      });
    });
  });
};
