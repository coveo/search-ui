import { last, compact, filter, reduceRight } from 'underscore';
import { IAnalyticsOmniboxSuggestionMeta } from '../Analytics/AnalyticsActionListMeta';

export interface IOmniboxAnalytics {
  partialQueries: string[];
  suggestionRanking: number;
  suggestions: string[];
  partialQuery: string;
  buildCustomDataForPartialQueries: () => IAnalyticsOmniboxSuggestionMeta;
}

export class OmniboxAnalytics implements IOmniboxAnalytics {
  public partialQueries: string[] = [];
  public suggestionRanking: number;
  public suggestions: string[] = [];
  public partialQuery: string;

  private readonly analyticsLengthLimit = 256;

  constructor() {}

  public buildCustomDataForPartialQueries(): IAnalyticsOmniboxSuggestionMeta {
    this.partialQuery = last(this.partialQueries);

    return {
      partialQueries: this.cleanCustomData(this.partialQueries),
      suggestionRanking: this.suggestionRanking,
      suggestions: this.cleanCustomData(this.suggestions),
      partialQuery: this.partialQuery
    };
  }

  private cleanCustomData(toClean: string[], rejectLength = this.analyticsLengthLimit) {
    const filterOutConsecutiveValues = this.filterOutConsecutiveValues(toClean);

    // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
    // Need to replace ;
    const redimensionedArray = filterOutConsecutiveValues.map(value => this.removeSemicolons(value));

    // Reduce right to get the last X words that adds to less then rejectLength
    const reducedToRejectLengthOrLess = this.reduceAnalyticsToLengthLimit(redimensionedArray, rejectLength);

    const cleanStrings = reducedToRejectLengthOrLess.reverse();
    const ret = cleanStrings.join(';');

    // analytics service can store max 256 char in a custom event
    // if we're over that, call cleanup again with an arbitrary 10 less char accepted
    if (ret.length >= this.analyticsLengthLimit) {
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

  private removeSemicolons(partial: string) {
    return partial.replace(/;/g, '');
  }

  private reduceAnalyticsToLengthLimit(toClean: string[], rejectLength: number) {
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
