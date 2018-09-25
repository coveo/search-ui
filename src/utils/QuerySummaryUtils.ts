import * as Globalize from 'globalize';
import { IQuerySuccessEventArgs } from '../events/QueryEvents';
import { $$ } from './Dom';
import { l } from '../strings/Strings';
import { IQuery } from '../rest/Query';

interface ISummaryStrings {
  first: string;
  last: string;
  totalCount: string;
  query: string;
}

export class QuerySummaryUtils {
  public static standardModeMessage(data: IQuerySuccessEventArgs) {
    const numOfResults = data.results.results.length;

    if (!numOfResults) {
      return '';
    }

    const strings = QuerySummaryUtils.getHtmlSummaryStrings(data);
    const sanitizedQuery = QuerySummaryUtils.sanitizeQuery(data.query);

    if (sanitizedQuery) {
      return l('ShowingResultsOfWithQuery', strings.first, strings.last, strings.totalCount, strings.query, numOfResults);
    }

    return l('ShowingResultsOf', strings.first, strings.last, strings.totalCount, numOfResults);
  }

  public static infiniteScrollModeMessage(data: IQuerySuccessEventArgs) {
    const numOfResults = data.results.results.length;

    if (!numOfResults) {
      return '';
    }

    const strings = QuerySummaryUtils.getHtmlSummaryStrings(data);
    const sanitizedQuery = QuerySummaryUtils.sanitizeQuery(data.query);

    if (sanitizedQuery) {
      return l('ShowingResultsWithQuery', strings.totalCount, strings.query, numOfResults);
    }

    return l('ShowingResults', strings.totalCount, numOfResults);
  }

  private static getHtmlSummaryStrings(data: IQuerySuccessEventArgs): ISummaryStrings {
    const strings = QuerySummaryUtils.getSummaryStrings(data);

    return {
      first: QuerySummaryUtils.wrapWithSpanTag(strings.first),
      last: QuerySummaryUtils.wrapWithSpanTag(strings.last),
      totalCount: QuerySummaryUtils.wrapWithSpanTag(strings.totalCount),
      query: QuerySummaryUtils.wrapWithSpanTag(strings.query)
    };
  }

  private static wrapWithSpanTag(word: string) {
    return $$('span', { className: 'coveo-highlight' }, word).el.outerHTML;
  }

  private static getSummaryStrings(data: IQuerySuccessEventArgs): ISummaryStrings {
    const queryPerformed = data.query;
    const queryResults = data.results;

    const first = Globalize.format(queryPerformed.firstResult + 1, 'n0');
    const last = Globalize.format(queryPerformed.firstResult + queryResults.results.length, 'n0');
    const totalCount = Globalize.format(queryResults.totalCountFiltered, 'n0');
    const query = QuerySummaryUtils.sanitizeQuery(queryPerformed);

    return { first, last, totalCount, query };
  }

  private static sanitizeQuery(query: IQuery) {
    return query.q ? escape(query.q.trim()) : '';
  }
}
