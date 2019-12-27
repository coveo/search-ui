import { ISearchResultPreview } from '../magicbox/ResultPreviewsManager';
import { Suggestion } from '../magicbox/SuggestionsManager';

/**
 * Executed when a {@link Suggestion} is focused before {@link PopulateSearchResultPreviews} is called to fetch more options.
 */
export interface IUpdateResultPreviewsManagerOptionsEventArgs {
  /**
   * How many milliseconds should a {@link Suggestion} be focused for before {@link PopulateSearchResultPreviews} is called.
   *
   * If this is not defined, it will default to 200ms.
   */
  displayAfterDuration?: number;
}

/**
 * Executed when a {@link Suggestion} is focused and waiting for search result previews.
 */
export interface IPopulateSearchResultPreviewsEventArgs {
  /**
   * The suggestion to look up search result previews for.
   */
  suggestion: Suggestion;
  /**
   * The result previews query. This must be set synchronously before the event resolves.
   * Setting this to a non-empty array will display the given search result previews.
   */
  previewsQueries: (ISearchResultPreview[] | Promise<ISearchResultPreview[]>)[];
}

/**
 * Those are the string definitions of events for ResultPreviewsManager.
 *
 * Those events should be bound to the element returned by `resolveRoot`.
 */
export class ResultPreviewsManagerEvents {
  /**
   * Executed when a {@link Suggestion} is focused before {@link PopulateSearchResultPreviews} is called to fetch more options.
   * This always receives {@link IUpdateResultPreviewsManagerOptionsEventArgs} as arguments.
   */
  public static updateResultPreviewsManagerOptions = 'updateResultPreviewsManagerOptions';
  /**
   * Executed when a {@link Suggestion} is focused and waiting for search result previews.
   * This always receives {@link IPopulateSearchResultPreviewsEventArgs} as arguments.
   */
  public static populateSearchResultPreviews = 'populateSearchResultPreviews';
}
