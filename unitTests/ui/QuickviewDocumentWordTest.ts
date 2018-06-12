import { QuickviewDocumentWord } from '../../src/ui/Quickview/QuickviewDocumentWord';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';

export function QuickviewDocumentWordTest() {
  describe('QuickviewDocumentWord', () => {
    let result: IQueryResult;
    let quickviewWord: QuickviewDocumentWord;

    beforeEach(() => {
      result = FakeResults.createFakeResult();
      quickviewWord = new QuickviewDocumentWord(result);
    });

    describe('when adding elements', () => {
      let elem: HTMLElement;

      beforeEach(() => {
        elem = $$('div').el;
      });

      it('should allow to add elements', () => {
        expect(quickviewWord.elements.length).toBe(0);
        quickviewWord.addElement(elem);
        expect(quickviewWord.elements.length).toBe(1);
        expect(quickviewWord.elements).toContain(elem);
      });

      it('should update count when adding element', () => {
        expect(quickviewWord.count).toBe(0);
        quickviewWord.addElement(elem);
        expect(quickviewWord.count).toBe(1);
      });
    });

    describe('when parsing elements as index keywords', () => {
      let elem: HTMLElement;

      beforeEach(() => {
        elem = $$('div', {
          id: 'CoveoHighlight:1.4.2'
        }).el;
      });

      it('should be able to identify the index identifier', () => {
        quickviewWord.doCompleteInitialScanForKeywordInDocument(elem);
        expect(quickviewWord.indexIdentifier).toBe('1');
      });

      it('should be able to identify the occurence in the document', () => {
        quickviewWord.doCompleteInitialScanForKeywordInDocument(elem);
        expect(quickviewWord.occurrence).toBe(4);
      });

      it('should be able to detect embedded keyword part', () => {
        quickviewWord.doCompleteInitialScanForKeywordInDocument(elem);
        expect(quickviewWord.indexTermPart).toBe(2);
      });

      describe('which contains text', () => {
        beforeEach(() => {
          elem.textContent = 'a';
        });

        it('should return the element text content if there is not terms to highlight on the result', () => {
          quickviewWord.result.termsToHighlight = null;
          quickviewWord.doCompleteInitialScanForKeywordInDocument(elem);
          expect(quickviewWord.text).toBe('a');
        });

        it('should return the text content if found in the original keys of the terms to highlight', () => {
          quickviewWord.result.termsToHighlight = {
            a: ['b', 'c']
          };
          quickviewWord.doCompleteInitialScanForKeywordInDocument(elem);
          expect(quickviewWord.text).toBe('a');
        });

        it('should return the text content if found in the expansion values for the terms to highlight', () => {
          quickviewWord.result.termsToHighlight = {
            c: ['a', 'b']
          };
          quickviewWord.doCompleteInitialScanForKeywordInDocument(elem);
          expect(quickviewWord.text).toBe('c');
        });
      });
    });

    describe('when navigating', () => {
      let firstElem: HTMLElement;
      let secondElem: HTMLElement;

      beforeEach(() => {
        firstElem = $$('div', {
          id: 'CoveoHighlight:1.1.1'
        }).el;
        firstElem.style.backgroundColor = 'rgb(1, 1, 1)';

        secondElem = $$('div', {
          id: 'CoveoHighlight:2.1.1'
        }).el;
        secondElem.style.backgroundColor = 'rgb(2, 2, 2)';

        quickviewWord.doCompleteInitialScanForKeywordInDocument(firstElem);
        quickviewWord.doCompleteInitialScanForKeywordInDocument(secondElem);
      });

      it('should allow to navigate forward through the elements', () => {
        const firstNavigation = quickviewWord.navigateForward();
        expect(firstNavigation).toBe(firstElem);

        const secondNavigation = quickviewWord.navigateForward();
        expect(secondNavigation).toBe(secondElem);

        const thirdNavigation = quickviewWord.navigateForward();
        expect(thirdNavigation).toBe(firstElem);
      });

      it('should allow to navigate backward through the elements', () => {
        const firstNavigation = quickviewWord.navigateBackward();
        expect(firstNavigation).toBe(secondElem);

        const secondNavigation = quickviewWord.navigateBackward();
        expect(secondNavigation).toBe(firstElem);

        const thirdNavigation = quickviewWord.navigateBackward();
        expect(thirdNavigation).toBe(secondElem);
      });

      it('should allow to navigate to a precise position', () => {
        const firstNavigation = quickviewWord.navigateTo(0);
        expect(firstNavigation).toBe(firstElem);

        const secondNavigation = quickviewWord.navigateTo(1);
        expect(secondNavigation).toBe(secondElem);
      });

      it('should navigate to a correct position if requesting to navigate to an impossible one', () => {
        const firstNavigation = quickviewWord.navigateTo(9999);
        expect(firstNavigation).toBe(firstElem);
      });
    });
  });
}
