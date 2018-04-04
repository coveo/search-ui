import { InlineRankingInfo } from '../../../src/ui/RelevanceInspector/InlineRankingInfo';
import { FakeResults } from '../../Fake';
import { IQueryResult } from '../../../src/rest/QueryResult';
import { parseRankingInfo, IRankingInfo } from '../../../src/ui/RelevanceInspector/RankingInfoParser';
import { each, keys } from 'underscore';
import { $$ } from '../../../src/UtilsModules';

export function InlineRankingInfoTest() {
  let result: IQueryResult;
  let inlineRankingInfo: InlineRankingInfo;
  let parsed: IRankingInfo;

  beforeEach(() => {
    result = FakeResults.createFakeResult();
    result.rankingInfo = FakeResults.createRankingInfoWithKeywords();
    inlineRankingInfo = new InlineRankingInfo(result);
    parsed = parseRankingInfo(result.rankingInfo);
  });

  describe('InlineRankingInfo', () => {
    it('should render a top level container', () => {
      const built = inlineRankingInfo.build();
      expect(built.find('div.coveo-relevance-inspector-inline-ranking')).toBeDefined();
    });

    it('should render a section for "Total', () => {
      const built = inlineRankingInfo.build();
      const totalHighlight = built.find('div.coveo-relevance-inspector-highlight');
      expect(totalHighlight).toBeDefined();
      expect(totalHighlight.textContent).toContain(parsed.totalWeight.toString());
    });

    it('should output a section for each relevant parsed document weights', () => {
      const built = inlineRankingInfo.build();
      const sections = built.findAll('div.coveo-relevance-inspector-inline-ranking-section');
      expect(sections.length).toEqual(10);

      const documentWeights = keys(parsed.documentWeights);
      each(documentWeights, (documentWeight, i) => {
        expect(sections[i].textContent).toContain(`${documentWeight}: ${parsed.documentWeights[documentWeight]}`);
      });
    });

    it('should contain a button to expand terms weights', () => {
      const built = inlineRankingInfo.build();
      const button = built.find('button.coveo-relevance-inspector-inline-ranking-button');
      expect(button).toBeDefined();
    });

    it('should contain a section for terms weight breakdown', () => {
      const built = inlineRankingInfo.build();
      const termsSection = built.find('div.coveo-relevance-inspector-inline-ranking-terms');
      expect(termsSection).toBeDefined();
    });

    it('should toggle the weight terms section with a button click', () => {
      const built = inlineRankingInfo.build();
      const button = built.find('button.coveo-relevance-inspector-inline-ranking-button');
      const termsSection = built.find('div.coveo-relevance-inspector-inline-ranking-terms');
      expect($$(termsSection).hasClass('coveo-active')).toBeFalsy();
      $$(button).trigger('click');
      expect($$(termsSection).hasClass('coveo-active')).toBeTruthy();
    });
  });
}
