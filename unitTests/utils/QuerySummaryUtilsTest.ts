import { QuerySummaryUtils } from '../../src/utils/QuerySummaryUtils';
import { IQuerySuccessEventArgs } from '../../src/events/QueryEvents';
import { QueryBuilder } from '../../src/Core';
import { FakeResults } from '../Fake';

export const QuerySummaryUtilsTest = () => {
  describe('QuerySummaryUtils', () => {
    const utils = QuerySummaryUtils;
    let data: IQuerySuccessEventArgs;

    function buildQuerySuccessData(config: Partial<IQuerySuccessEventArgs> = {}) {
      const data: IQuerySuccessEventArgs = {
        query: { q: '' },
        queryBuilder: new QueryBuilder(),
        results: FakeResults.createFakeResults(),
        searchAsYouType: false
      };

      return { ...data, ...config } as IQuerySuccessEventArgs;
    }

    describe('when the #data object does not have any results', () => {
      beforeEach(() => {
        const results = FakeResults.createFakeResults(0);
        data = buildQuerySuccessData({ results });
      });

      it(`when calling #standardHtmlMessage, it returns an empty string`, () => {
        const message = utils.standardHtmlMessage(data);
        expect(message).toBe('');
      });

      it(`when calling #infiniteScrollHtmlMessage, it returns an empty string`, () => {
        const message = utils.infiniteScrollHtmlMessage(data);
        expect(message).toBe('');
      });
    });

    describe(`given the #data object has one result,
    when the query #q is falsy (e.g. an empty string),
    when the query #firstResult is defined (e.g. 0)`, () => {
      beforeEach(() => {
        const query = { q: '', firstResult: 0 };
        const results = FakeResults.createFakeResults(1);

        data = buildQuerySuccessData({ query, results });
      });

      it(`when calling #standardHtmlMessage,
      it returns the expected message`, () => {
        const message = utils.standardHtmlMessage(data);
        const expected = 'Result <span class="coveo-highlight">1</span> of <span class="coveo-highlight">1</span>';
        expect(message).toBe(expected);
      });

      it(`when calling #infiniteScrollHtmlMessage,
      it returns the expected message`, () => {
        const message = utils.infiniteScrollHtmlMessage(data);
        const expected = '<span class="coveo-highlight">1</span> result';
        expect(message).toBe(expected);
      });
    });

    describe(`given the #data object has one result,
    when the query #q is truthy,
    when the query #firstResult is defined (e.g. 0)`, () => {
      beforeEach(() => {
        const query = { q: 'query', firstResult: 0 };
        const results = FakeResults.createFakeResults(1);

        data = buildQuerySuccessData({ query, results });
      });

      it(`when calling #standardHtmlMessage,
      it includes the query in the message`, () => {
        const message = utils.standardHtmlMessage(data);
        expect(message).toContain(data.query.q);
      });

      it(`when calling #infiniteScrollHtmlMessage,
      it includes the query in the message`, () => {
        const message = utils.infiniteScrollHtmlMessage(data);
        expect(message).toContain(data.query.q);
      });
    });
  });
};
