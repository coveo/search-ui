import { QuickviewDocumentWordButton } from '../../src/ui/Quickview/QuickviewDocumentWordButton';
import { QuickviewDocumentWord } from '../../src/ui/Quickview/QuickviewDocumentWord';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';

export function QuickviewDocumentWordButtonTest() {
  describe('QuickviewDocumentWordButton', () => {
    let word: QuickviewDocumentWord;
    let result: IQueryResult;

    beforeEach(() => {
      result = FakeResults.createFakeResult();
      word = new QuickviewDocumentWord(result);
    });

    it('should render the correct name', () => {
      //      new QuickviewDocumentWordButton(word);
    });
  });
}
