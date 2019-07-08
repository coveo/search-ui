import * as Mock from '../MockEnvironment';
import { FoldingForThread } from '../../src/ui/FoldingForThread/FoldingForThread';
import { IFoldingOptions } from '../../src/ui/Folding/Folding';
import { FakeResults } from '../Fake';

export function FoldingForThreadTest() {
  describe('FoldingForThread', () => {
    let test: Mock.IBasicComponentSetup<FoldingForThread>;

    beforeEach(() => {
      test = Mock.optionsComponentSetup<FoldingForThread, IFoldingOptions>(FoldingForThread, {});
    });

    it(`when calling #options.getMoreResults with results,
    it returns the results`, () => {
      const results = [FakeResults.createFakeResult()];
      const moreResults = test.cmp.options.getMoreResults(results);

      expect(moreResults).toEqual(results);
    });
  });
}
