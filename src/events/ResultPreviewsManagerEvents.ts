import { ISearchResultPreview } from '../magicbox/ResultPreviewsManager';

/**
 * Executed when a {@link Suggestion} is focused and waiting for search result previews.
 */
export interface IPopulateSearchResultPreviewsEventArgs {
  /**
   * The text to look up search result previews for.
   */
  suggestionText: string;
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
export enum ResultPreviewsManagerEvents {
  /**
   * Executed when a {@link Suggestion} is focused and waiting for search result previews.
   * This always receives {@link IPopulateSearchResultPreviewsEventArgs} as arguments.
   */
  PopulateSearchResultPreviews = 'populateSearchResultPreviews'
}
