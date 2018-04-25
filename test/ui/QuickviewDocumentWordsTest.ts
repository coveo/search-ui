import { QuickviewDocumentWords } from '../../src/ui/Quickview/QuickviewDocumentWords';
import { QuickviewDocumentIframe } from '../../src/ui/Quickview/QuickviewDocumentIframe';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';
import { $$, Dom } from '../../src/utils/Dom';

export function QuickviewDocumentWordsTest() {
  describe('QuickviewDocumentWords', () => {
    let fakeIframe: QuickviewDocumentIframe;
    let fakeResult: IQueryResult;
    let fakeBody: Dom;

    beforeEach(() => {
      fakeBody = $$('body');

      fakeIframe = {
        body: fakeBody.el
      } as QuickviewDocumentIframe;

      fakeResult = FakeResults.createFakeResult();
    });

    it('should detect multiple keywords, and ignore random elements', () => {
      fakeBody.append(
        $$('div', {
          id: 'CoveoHighlight:1.1.1'
        }).el
      );

      fakeBody.append(
        $$('div', {
          id: 'randomStuff'
        }).el
      );

      fakeBody.append(
        $$('div', {
          id: 'CoveoHighlight:2.1.1'
        }).el
      );

      fakeBody.append(
        $$('div', {
          id: 'randomStuff2'
        }).el
      );

      const words = new QuickviewDocumentWords(fakeIframe, fakeResult);
      expect(words.words['1'].indexIdentifier).toBe('1');
      expect(words.words['2'].indexIdentifier).toBe('2');
      expect(Object.keys(words.words).length).toBe(2);
    });

    it('should detect multiple keywords in the same group', () => {
      fakeBody.append(
        $$('div', {
          id: 'CoveoHighlight:1.1.1'
        }).el
      );

      fakeBody.append(
        $$('div', {
          id: 'CoveoHighlight:1.2.1'
        }).el
      );

      fakeBody.append(
        $$('div', {
          id: 'CoveoHighlight:1.3.1'
        }).el
      );

      const words = new QuickviewDocumentWords(fakeIframe, fakeResult);
      expect(words.words['1'].indexIdentifier).toBe('1');
      expect(words.words['1'].elements.length).toBe(3);
    });
  });
}
