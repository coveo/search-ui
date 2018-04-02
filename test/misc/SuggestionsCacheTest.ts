import { SuggestionsCache } from '../../src/Misc/SuggestionsCache';
export function SuggestionsCacheTest() {
  const suggestionFetcher: () => Promise<string> = () => Promise.resolve((count++).toString());
  let count = 0;
  let cache: SuggestionsCache<string>;

  beforeEach(() => {
    count = 0;
    cache = new SuggestionsCache<string>();
  });

  describe('SuggestionsCache', function() {
    it('should return null when the cache key is empty', async done => {
      const cacheResult = await cache.getSuggestions('', suggestionFetcher);

      expect(cacheResult).toBeNull();
      done();
    });

    it('should call the suggestion fetcher when the key is not in cache', async done => {
      const cacheResult = await cache.getSuggestions('first', suggestionFetcher);
      const secondCacheResult = await cache.getSuggestions('second', suggestionFetcher);

      expect(cacheResult).toBe('0');
      expect(secondCacheResult).toBe('1');
      expect(count).toBe(2);
      done();
    });

    it('should return the value from the cache when using the same key', async done => {
      const cacheResult = await cache.getSuggestions('first', suggestionFetcher);
      const secondCacheResult = await cache.getSuggestions('first', suggestionFetcher);

      expect(cacheResult).toBe('0');
      expect(secondCacheResult).toBe('0');
      expect(count).toBe(1);
      done();
    });

    it('should call the suggestion fetcher when the key is cleared from the cache', async done => {
      const cacheResult = await cache.getSuggestions('first', suggestionFetcher);
      cache.clearSuggestion('first');
      const secondCacheResult = await cache.getSuggestions('first', suggestionFetcher);

      expect(cacheResult).toBe('0');
      expect(secondCacheResult).toBe('1');
      expect(count).toBe(2);
      done();
    });

    it('should should clear the suggestion when the fetcher throws', async done => {
      try {
        await cache.getSuggestions('first', () => {
          throw 'sobad';
        });
      } catch (ex) {
        const cacheResult = await cache.getSuggestions('first', suggestionFetcher);
        expect(cacheResult).toBe('0');
        expect(count).toBe(1);
        done();
      }
    });
  });
}
