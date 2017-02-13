import { IQueryboxOptions } from './Querybox';
import { QueryBuilder } from '../Base/QueryBuilder';
import _ = require('underscore');

export class QueryboxQueryParameters {
  constructor(private options: IQueryboxOptions) {
  }

  public addParameters(queryBuilder: QueryBuilder, lastQuery: string) {
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
      queryBuilder.disableQuerySyntax = !this.options.enableQuerySyntax;
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
