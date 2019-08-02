import { compact, filter, map, reduceRight, last } from 'underscore';
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

  public dumpInfo() {
    console.log(this.partialQueries);
  }

  private cleanCustomData(toClean: string[], rejectLength = 256) {
    // Filter out only consecutive values that are the identical
    toClean = compact(
      filter(toClean, (partial: string, pos?: number, array?: string[]) => {
        return pos === 0 || partial !== array[pos - 1];
      })
    );

    // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
    // Need to replace ;
    toClean = map(toClean, partial => {
      return partial.replace(/;/g, '');
    });

    // Reduce right to get the last X words that adds to less then rejectLength
    const reducedToRejectLengthOrLess = [];
    reduceRight(
      toClean,
      (memo: number, partial: string) => {
        const totalSoFar = memo + partial.length;
        if (totalSoFar <= rejectLength) {
          reducedToRejectLengthOrLess.push(partial);
        }
        return totalSoFar;
      },
      0
    );
    toClean = reducedToRejectLengthOrLess.reverse();
    const ret = toClean.join(';');

    // analytics service can store max 256 char in a custom event
    // if we're over that, call cleanup again with an arbitrary 10 less char accepted
    if (ret.length >= 256) {
      return this.cleanCustomData(toClean, rejectLength - 10);
    }

    return toClean.join(';');
  }
}
