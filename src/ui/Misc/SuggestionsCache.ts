import { IOmniboxSuggestion } from '../Omnibox/Omnibox';

export class SuggestionsCache {
  private cache: { [hash: string]: Promise<IOmniboxSuggestion[]> } = {};

  getSuggestions(hash: string, suggestionsFetcher: () => Promise<IOmniboxSuggestion[]>): Promise<IOmniboxSuggestion[] | null> {
    if (!hash || hash.length === 0) {
      return null;
    }

    if (this.cache[hash] != null) {
      return this.cache[hash];
    }

    const promise = suggestionsFetcher();
    this.cache[hash] = promise;
    promise.catch(() => {
      delete this.cache[hash];
    });
    return this.cache[hash];
  }
}
