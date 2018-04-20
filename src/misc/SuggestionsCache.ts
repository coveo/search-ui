export class SuggestionsCache<T> {
  private cache: { [hash: string]: Promise<T> } = {};

  getSuggestions(hash: string, suggestionsFetcher: () => Promise<T>): Promise<T> {
    if (this.cache[hash] != null) {
      return this.cache[hash];
    }

    const promise = suggestionsFetcher();
    this.cache[hash] = promise;
    promise.catch(() => this.clearSuggestion(hash));
    return this.cache[hash];
  }

  clearSuggestion(hash: string): void {
    if (!hash || hash.length === 0) {
      return null;
    }

    delete this.cache[hash];
  }
}
