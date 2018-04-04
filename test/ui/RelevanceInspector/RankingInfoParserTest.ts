import { parseRankingInfo, buildListOfTermsElement } from '../../../src/ui/RelevanceInspector/RankingInfoParser';
import { FakeResults } from '../../Fake';
import { $$ } from '../../../src/UtilsModules';

export function RankingInfoParserTest() {
  describe('RankingInfoParser', () => {
    it('should not throw on null', () => {
      expect(() => parseRankingInfo(null)).not.toThrow();
    });

    it('should parse ranking info with no keywords', () => {
      const toParse = FakeResults.createRankingInfoNoKeywords();

      const parsed = parseRankingInfo(toParse);
      expect(parsed.totalWeight).toBe(2375);
      expect(parsed.documentWeights.Adjacency).toBe(0);
      expect(parsed.documentWeights['Collaborative rating']).toBe(0);
      expect(parsed.documentWeights.Custom).toBe(400);
      expect(parsed.documentWeights.Date).toBe(405);
      expect(parsed.documentWeights.QRE).toBe(890);
      expect(parsed.documentWeights.Quality).toBe(180);
      expect(parsed.documentWeights['Ranking functions']).toBe(0);
      expect(parsed.documentWeights.Source).toBe(500);
      expect(parsed.documentWeights.Title).toBe(0);
      expect(parsed.termsWeight).toBeNull();
    });

    it('should parse ranking info properly with keywords', () => {
      const toParse = FakeResults.createRankingInfoWithKeywords();

      const parsed = parseRankingInfo(toParse);
      const testsTermsWeights = parsed.termsWeight['test'];

      expect(testsTermsWeights.Weights.Title).toBe(800);
      expect(testsTermsWeights.Weights.Concept).toBe(0);
      expect(testsTermsWeights.Weights.Summary).toBe(300);
      expect(testsTermsWeights.Weights.URI).toBe(500);
      expect(testsTermsWeights.Weights.Formatted).toBe(0);
      expect(testsTermsWeights.Weights.Casing).toBe(0);
      expect(testsTermsWeights.Weights.Relation).toBe(200);
      expect(testsTermsWeights.Weights.Frequency).toBe(1744);
      expect(testsTermsWeights.terms.test['TF-IDF']).toBe(26);
      expect(testsTermsWeights.terms.test.Correlation).toBe(100);
    });

    it('should be able to build a generic HtML list of terms', () => {
      const toParse = FakeResults.createRankingInfoWithKeywords();

      const parsed = parseRankingInfo(toParse);
      const list = buildListOfTermsElement(parsed.termsWeight.test.Weights);
      expect($$(list).find('dl')).toBeDefined();
      const listKeys = $$(list).findAll('dt');
      const listValues = $$(list).findAll('dd');

      expect(listKeys.length).toBeGreaterThan(0);
      expect(listKeys.length).toEqual(listValues.length);
      expect(listKeys[listKeys.length - 1].textContent).toBe('Total');
      expect(listValues[listValues.length - 1].textContent).toBe('3544');
    });
  });
}
