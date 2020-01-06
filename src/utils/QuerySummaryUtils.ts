import * as Globalize from 'globalize';
import { any, escape } from 'underscore';
import { IQuerySuccessEventArgs } from '../events/QueryEvents';
import { IQuery } from '../rest/Query';
import { l } from '../strings/Strings';
import { get } from '../ui/Base/RegisteredNamedMethods';
import { IResultListOptions } from '../ui/ResultList/ResultListOptions';
import { $$ } from './Dom';

interface ISummaryStrings {
  first: string;
  last: string;
  totalCount: string;
  query: string;
}

interface ISummaryMessage {
  includingQuery: string;
  excludingQuery: string;
}

export class QuerySummaryUtils {
  public static message(root: HTMLElement, data: IQuerySuccessEventArgs) {
    const messageBuilder = QuerySummaryUtils.messageBuilderForMode(root);
    const strings = QuerySummaryUtils.getSummaryStrings(data);

    return messageBuilder(data, strings);
  }

  public static htmlMessage(root: HTMLElement, data: IQuerySuccessEventArgs) {
    const messageBuilder = QuerySummaryUtils.messageBuilderForMode(root);
    const strings = QuerySummaryUtils.getHtmlSummaryStrings(data);

    return messageBuilder(data, strings);
  }

  public static replaceQueryTags(template: string, replacement: string) {
    const queryTag = /\$\{query\}/g;
    return template ? template.replace(queryTag, replacement) : '';
  }

  private static messageBuilderForMode(root: HTMLElement) {
    if (QuerySummaryUtils.isInfiniteScrollMode(root)) {
      return QuerySummaryUtils.buildInfiniteScrollMessage;
    }

    return QuerySummaryUtils.buildStandardMessage;
  }

  private static isInfiniteScrollMode(root: HTMLElement) {
    const resultListSelector = `.CoveoResultList`;
    const resultLists = $$(root).findAll(resultListSelector);

    return any(resultLists, resultList => {
      const options: IResultListOptions = (get(resultList) as any).options;
      return options && options.enableInfiniteScroll;
    });
  }

  private static buildStandardMessage(data: IQuerySuccessEventArgs, strings: ISummaryStrings) {
    const numOfResults = data.results.results.length;
    const messages: ISummaryMessage = {
      includingQuery: l('ShowingResultsOfWithQuery', strings.first, strings.last, strings.totalCount, strings.query, numOfResults),
      excludingQuery: l('ShowingResultsOf', strings.first, strings.last, strings.totalCount, numOfResults)
    };

    return QuerySummaryUtils.buildMessage(data, messages);
  }

  private static buildInfiniteScrollMessage(data: IQuerySuccessEventArgs, strings: ISummaryStrings) {
    const numOfResults = data.results.results.length;
    const messages: ISummaryMessage = {
      includingQuery: l('ShowingResultsWithQuery', strings.totalCount, strings.query, numOfResults),
      excludingQuery: l('ShowingResults', strings.totalCount, numOfResults)
    };

    return QuerySummaryUtils.buildMessage(data, messages);
  }

  private static buildMessage(data: IQuerySuccessEventArgs, message: ISummaryMessage) {
    const numOfResults = data.results.results.length;
    const sanitizedQuery = QuerySummaryUtils.sanitizeQuery(data.query);

    if (!numOfResults) {
      return '';
    }

    return sanitizedQuery ? message.includingQuery : message.excludingQuery;
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
