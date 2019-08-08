import { OmniboxAnalytics } from '../../src/ui/Omnibox/OmniboxAnalytics';
import { IAnalyticsOmniboxSuggestionMeta } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function OmniboxAnalyticsTest() {
  let omniboxAnalytics: OmniboxAnalytics;

  describe('omniboxAnalyticsTest', () => {
    beforeEach(() => {
      omniboxAnalytics = new OmniboxAnalytics();
    });

    function random256Array(array: string[]) {
      while (array.join('').length <= 256) {
        array.push(
          Math.random()
            .toString(36)
            .substring(2)
        );
      }
    }

    it('return IAnalyticsOmniboxSuggestionMeta when nothing has change since initialisation', () => {
      expect(omniboxAnalytics.buildCustomDataForPartialQueries()).toEqual(
        jasmine.objectContaining(<IAnalyticsOmniboxSuggestionMeta>{
          partialQueries: '',
          suggestionRanking: undefined,
          suggestions: '',
          partialQuery: undefined
        })
      );
    });

    it('suggestionRanking should get set with the right value', () => {
      omniboxAnalytics.suggestionRanking = 3;
      expect(omniboxAnalytics.buildCustomDataForPartialQueries()).toEqual(
        jasmine.objectContaining(<IAnalyticsOmniboxSuggestionMeta>{
          partialQueries: '',
          partialQuery: undefined,
          suggestionRanking: 3,
          suggestions: ''
        })
      );
    });

    it('partialQueries and suggestions values get separated by a semicolon', () => {
      omniboxAnalytics.partialQueries = ['foo', 'foo2'];
      omniboxAnalytics.suggestions = ['bar', 'bar2'];
      expect(omniboxAnalytics.buildCustomDataForPartialQueries()).toEqual(
        jasmine.objectContaining(<IAnalyticsOmniboxSuggestionMeta>{
          partialQueries: 'foo;foo2',
          partialQuery: 'foo2',
          suggestionRanking: undefined,
          suggestions: 'bar;bar2'
        })
      );
    });

    it('partialQueries and suggestions consecutive values get reduce to 1', () => {
      omniboxAnalytics.partialQueries = ['foo', 'foo', 'foo'];
      omniboxAnalytics.suggestions = ['bar', 'bar', 'bar'];
      expect(omniboxAnalytics.buildCustomDataForPartialQueries()).toEqual(
        jasmine.objectContaining(<IAnalyticsOmniboxSuggestionMeta>{
          partialQueries: 'foo',
          partialQuery: 'foo',
          suggestionRanking: undefined,
          suggestions: 'bar'
        })
      );
    });

    it('partialQueries length should get rezise be a max of 256 character', () => {
      random256Array(omniboxAnalytics.partialQueries);
      expect(omniboxAnalytics.partialQueries.join('').length).toBeGreaterThan(256);
      const metadata = omniboxAnalytics.buildCustomDataForPartialQueries();
      expect(metadata.partialQueries.length).toBeLessThan(256);
    });

    it('suggestions length should get rezise be a max of 256 character', () => {
      random256Array(omniboxAnalytics.suggestions);
      expect(omniboxAnalytics.suggestions.join('').length).toBeGreaterThan(256);
      const metadata = omniboxAnalytics.buildCustomDataForPartialQueries();
      expect(metadata.suggestions.length).toBeLessThan(256);
    });
  });
}
