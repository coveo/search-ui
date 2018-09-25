import * as Globalize from 'globalize';
import { IQuerySuccessEventArgs } from '../events/QueryEvents';
import { $$ } from './Dom';
import { l } from '../strings/Strings';

export class QuerySummaryUtils {
  public static standardModeMessage(data: IQuerySuccessEventArgs) {
    if (!data.results.results.length) {
      return '';
    }

    const { query, highlightFirst, highlightLast, highlightTotal, highlightQuery } = QuerySummaryUtils.formatSummary(data);
    const queryResults = data.results;

    if (query) {
      return l(
        'ShowingResultsOfWithQuery',
        highlightFirst.outerHTML,
        highlightLast.outerHTML,
        highlightTotal.outerHTML,
        highlightQuery.outerHTML,
        queryResults.results.length
      );
    }

    return l('ShowingResultsOf', highlightFirst.outerHTML, highlightLast.outerHTML, highlightTotal.outerHTML, queryResults.results.length);
  }

  public static infiniteScrollModeMessage(data: IQuerySuccessEventArgs) {
    if (!data.results.results.length) {
      return '';
    }

    const { query, highlightQuery, highlightTotal } = QuerySummaryUtils.formatSummary(data);
    const queryResults = data.results;

    if (query) {
      return l('ShowingResultsWithQuery', highlightTotal.outerHTML, highlightQuery.outerHTML, queryResults.results.length);
    }

    return l('ShowingResults', highlightTotal.outerHTML, queryResults.results.length);
  }

  private static formatSummary(data: IQuerySuccessEventArgs) {
    const queryPerformed = data.query;
    const queryResults = data.results;

    const first = Globalize.format(queryPerformed.firstResult + 1, 'n0');
    const last = Globalize.format(queryPerformed.firstResult + queryResults.results.length, 'n0');
    const totalCount = Globalize.format(queryResults.totalCountFiltered, 'n0');
    const query = queryPerformed.q ? escape(queryPerformed.q.trim()) : '';

    const highlightFirst = $$('span', { className: 'coveo-highlight' }, first).el;
    const highlightLast = $$('span', { className: 'coveo-highlight' }, last).el;
    const highlightTotal = $$('span', { className: 'coveo-highlight' }, totalCount).el;
    const highlightQuery = $$('span', { className: 'coveo-highlight' }, query).el;

    return {
      first,
      last,
      totalCount,
      query,
      highlightFirst,
      highlightLast,
      highlightTotal,
      highlightQuery
    };
  }
}
