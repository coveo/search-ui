import * as Mock from '../MockEnvironment';
import { Excerpt } from '../../src/ui/Excerpt/Excerpt';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';
import { HighlightUtils } from '../../src/utils/HighlightUtils';

export function ExcerptTest() {
  describe('Excerpt', function() {
    let test: Mock.IBasicComponentSetup<Excerpt>;
    let fakeResult: IQueryResult;

    beforeEach(() => {
      fakeResult = FakeResults.createFakeResult();
      fakeResult.excerpt = 'This is the excerpt';
      fakeResult.excerptHighlights = [
        {
          offset: 12,
          length: 7
        }
      ];
      test = Mock.advancedResultComponentSetup<Excerpt>(Excerpt, fakeResult, undefined);
    });

    afterEach(function() {
      test = null;
      fakeResult = null;
    });

    it('should highlight the keywords', () => {
      let expectedExcerpt = HighlightUtils.highlightString(fakeResult.excerpt, fakeResult.excerptHighlights, null, 'coveo-highlight');
      expect(test.cmp.element.innerHTML).toEqual(expectedExcerpt);
    });
  });
}
