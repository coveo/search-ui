import { IQueryboxOptions } from './Querybox';
import { QueryBuilder } from '../Base/QueryBuilder';
import * as _ from 'underscore';
import { Defer } from '../../MiscModules';

export class QueryboxQueryParameters {
  private static queryIsCurrentlyBlocked = false;

  constructor(private options: IQueryboxOptions) {}

  private static queryIsBlocked() {
    // This code runs on some assumption :
    // Since all "buildingQuery" events would have to be run in the same call stack
    // We can add a static flag to block 2 or more query box/omnibox from trying to modify the query inside the same event.
    // If 2 query box are activated, we get duplicate terms in the query, or duplicate term correction with did you mean.
    // This means that only one query box/searchbox would be able to modify the query in a single search page.
    // This also means that if there is 2 search box enabled, the first one in the markup in the page would be able to do the job correctly as far as the query is concerned.
    // The second one is inactive as far as the query is concerned.

    // The flag gets reset in "defer" (setTimeout 0) so that it gets reset correctly when the query event has finished executing
    if (!QueryboxQueryParameters.queryIsCurrentlyBlocked) {
      QueryboxQueryParameters.queryIsCurrentlyBlocked = true;
      Defer.defer(() => QueryboxQueryParameters.allowDuplicateQuery());
      return false;
    }
    return true;
  }

  public static allowDuplicateQuery() {
    QueryboxQueryParameters.queryIsCurrentlyBlocked = false;
  }

  public addParameters(queryBuilder: QueryBuilder, lastQuery: string) {
    if (!QueryboxQueryParameters.queryIsBlocked()) {
      if (this.options.enableWildcards) {
        queryBuilder.enableWildcards = true;
      }

      if (this.options.enableQuestionMarks) {
        queryBuilder.enableQuestionMarks = true;
      }

      if (this.options.enableLowercaseOperators) {
        queryBuilder.enableLowercaseOperators = true;
      }

      if (!_.isEmpty(lastQuery)) {
        queryBuilder.enableQuerySyntax = this.options.enableQuerySyntax;
        queryBuilder.expression.add(lastQuery);
        if (this.options.enablePartialMatch) {
          queryBuilder.enablePartialMatch = this.options.enablePartialMatch;
          if (this.options.partialMatchKeywords) {
            queryBuilder.partialMatchKeywords = this.options.partialMatchKeywords;
          }
          if (this.options.partialMatchThreshold) {
            queryBuilder.partialMatchThreshold = this.options.partialMatchThreshold;
          }
        }
      }
    }
  }
}
