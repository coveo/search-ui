import { last, chain } from 'underscore';
import { IAnalyticsOmniboxSuggestionMeta } from '../Analytics/AnalyticsActionListMeta';

export class OmniboxAnalytics {
  public partialQueries: string[];
  public suggestionRanking: number;
  public suggestions: string[];
  public partialQuery: string;

  constructor() {
    this.partialQueries = [];
    this.suggestions = [];
  }

  public buildCustomDataForPartialQueries(index?: number, suggestions?: string[]): IAnalyticsOmniboxSuggestionMeta {
    this.partialQuery = last(this.partialQueries);
    this.suggestions = suggestions || this.suggestions;
    this.suggestionRanking = index || this.suggestionRanking;

    return {
      partialQueries: this.cleanCustomData(this.partialQueries),
      suggestionRanking: this.suggestionRanking,
      suggestions: this.cleanCustomData(this.suggestions),
      partialQuery: this.partialQuery
    };
  }

  private cleanCustomData(toClean: string[], rejectLength = 256) {
    // Filter out only consecutive values that are the identical
    const reducedToRejectLengthOrLess = [];
    chain(toClean)
      .compact()

      // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
      // Need to replace ;
      .map(partial => {
        return partial.replace(/;/g, '');
      })

      // Reduce right to get the last X words that adds to less then rejectLength

      .reduceRight((memo: number, partial: string) => {
        const totalSoFar = memo + partial.length;
        if (totalSoFar <= rejectLength) {
          reducedToRejectLengthOrLess.push(partial);
        }
        return totalSoFar;
      }, 0)
      .value();
    const toCleanLocal = reducedToRejectLengthOrLess.reverse() as string[];
    const ret = toCleanLocal.join(';');

    // analytics service can store max 256 char in a custom event
    // if we're over that, call cleanup again with an arbitrary 10 less char accepted
    if (ret.length >= 256) {
      return this.cleanCustomData(toCleanLocal, rejectLength - 10);
    }

    return toCleanLocal.join(';');
  }
}
