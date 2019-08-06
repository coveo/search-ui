import { last, compact, filter, map, reduceRight } from 'underscore';
import { IAnalyticsOmniboxSuggestionMeta } from '../Analytics/AnalyticsActionListMeta';

export class OmniboxAnalytics {
  public partialQueries: string[] = [];
  public suggestionRanking: number;
  public suggestions: string[] = [];
  public partialQuery: string;

  constructor() {}

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
    const filterOutConsecutiveValues = this.filterOutConsecutiveValues(toClean);

    // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
    // Need to replace ;
    const redimensionedArray = this.removeCustomDimension(filterOutConsecutiveValues);

    // Reduce right to get the last X words that adds to less then rejectLength
    const reducedToRejectLengthOrLess = this.toAnalyticsLenghtLimit(redimensionedArray, rejectLength);

    const cleanStrings = reducedToRejectLengthOrLess.reverse();
    const ret = cleanStrings.join(';');

    // analytics service can store max 256 char in a custom event
    // if we're over that, call cleanup again with an arbitrary 10 less char accepted
    if (ret.length >= 256) {
      return this.cleanCustomData(cleanStrings, rejectLength - 10);
    }

    return cleanStrings.join(';');
  }

  private filterOutConsecutiveValues(toClean: string[]) {
    return compact(
      filter(toClean, (partial: string, pos?: number, array?: string[]) => {
        return pos === 0 || partial !== array[pos - 1];
      })
    );
  }

  private removeCustomDimension(toClean: string[]) {
    return map(toClean, partial => {
      return partial.replace(/;/g, '');
    });
  }

  private toAnalyticsLenghtLimit(toClean: string[], rejectLength: number) {
    const reducedToRejectLengthOrLess: string[] = [];
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
    return reducedToRejectLengthOrLess;
  }
}
