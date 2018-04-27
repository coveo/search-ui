import { QuickviewDocumentIframe } from '../../src/ui/Quickview/QuickviewDocumentIframe';
import { QuickviewDocumentPreviewBar } from '../../src/ui/Quickview/QuickviewDocumentPreviewBar';
import { QuickviewDocumentWord } from '../../src/ui/Quickview/QuickviewDocumentWord';
import { QuickviewDocumentWordColor } from '../../src/ui/Quickview/QuickviewDocumentWordColor';
import { QuickviewDocumentWords } from '../../src/ui/Quickview/QuickviewDocumentWords';
import { $$ } from '../../src/utils/Dom';

export function QuickviewDocumentPreviewBarTest() {
  describe('QuickviewDocumentPreviewBar', () => {
    let fakeIframe: QuickviewDocumentIframe;
    let words: QuickviewDocumentWords;

    const mockWord = (elements: HTMLElement[]) => {
      const word = jasmine.createSpyObj<QuickviewDocumentWord>('quickviewWord', ['elements', 'color']);
      (word.elements as any) = elements;
      (word.color as any) = new QuickviewDocumentWordColor('rgb(123,123,123)');
      return word;
    };

    beforeEach(() => {
      fakeIframe = jasmine.createSpyObj<QuickviewDocumentIframe>('quickviewIframe', ['body']);
      (fakeIframe.body as any) = $$('div').el;
      (fakeIframe.document as any) = document.implementation.createHTMLDocument();
    });

    describe("when there's one keyword in the document", () => {
      beforeEach(() => {
        words = jasmine.createSpyObj<QuickviewDocumentWords>('quickviewWords', ['words']);
      });

      it('should display one indicator if there is one element', () => {
        words.words = {
          foo: mockWord([$$('div').el])
        };

        const previewBar = new QuickviewDocumentPreviewBar(fakeIframe, words);
        previewBar.wordIndicators.forEach(value => {
          expect(value.indicators.length).toBe(1);
        });
      });

      it('should display multiple indicator if there are multiple elements', () => {
        words.words = {
          foo: mockWord([$$('div').el, $$('div').el, $$('div').el])
        };

        const previewBar = new QuickviewDocumentPreviewBar(fakeIframe, words);
        previewBar.wordIndicators.forEach(value => {
          expect(value.indicators.length).toBe(3);
        });
      });

      it('should handle indicators that are overlapping', () => {
        // If 2 elements are in the same position in the original document, the indicators will overlap
        const elem1 = $$('div').el;
        elem1.style.top = '100px';
        const elem2 = $$('div').el;
        elem2.style.top = '100px';

        words.words = {
          foo: mockWord([elem1, elem2])
        };

        let allIndicators = [];
        const previewBar = new QuickviewDocumentPreviewBar(fakeIframe, words);
        previewBar.wordIndicators.forEach(value => {
          allIndicators = allIndicators.concat(value.indicators);
        });

        expect(allIndicators[0]).toEqual(allIndicators[1]);
      });
    });

    describe('when navigating', () => {
      beforeEach(() => {
        words.words = {
          foo: mockWord([$$('div').el, $$('div').el])
        };
      });

      it('should allow to navigate forward', () => {
        const previewBar = new QuickviewDocumentPreviewBar(fakeIframe, words);

        const firstNavigation = previewBar.navigateForward(words.words['foo']);
        expect(firstNavigation.style.backgroundColor).toBe(words.words['foo'].color.invert());

        const secondNavigation = previewBar.navigateForward(words.words['foo']);

        const thirdNavigation = previewBar.navigateForward(words.words['foo']);
        expect(thirdNavigation).toEqual(firstNavigation);

        const fourthNavigation = previewBar.navigateForward(words.words['foo']);
        expect(fourthNavigation).toEqual(secondNavigation);
      });

      it('should allow to navigate backward', () => {
        const previewBar = new QuickviewDocumentPreviewBar(fakeIframe, words);

        const firstNavigation = previewBar.navigateBackward(words.words['foo']);
        expect(firstNavigation.style.backgroundColor).toBe(words.words['foo'].color.invert());

        const secondNavigation = previewBar.navigateBackward(words.words['foo']);

        const thirdNavigation = previewBar.navigateBackward(words.words['foo']);
        expect(thirdNavigation).toEqual(firstNavigation);

        const fourthNavigation = previewBar.navigateBackward(words.words['foo']);
        expect(fourthNavigation).toEqual(secondNavigation);
      });

      it('should allow to navigate to a given position', () => {
        const previewBar = new QuickviewDocumentPreviewBar(fakeIframe, words);

        const firstNavigation = previewBar.navigateTo(0, words.words['foo']);
        expect(firstNavigation.style.backgroundColor).toBe(words.words['foo'].color.invert());
      });

      it('should not throw when navigating to an invalid position', () => {
        const previewBar = new QuickviewDocumentPreviewBar(fakeIframe, words);

        expect(() => previewBar.navigateTo(-1, words.words['foo'])).not.toThrow();
        expect(() => previewBar.navigateTo(99, words.words['foo'])).not.toThrow();
      });

      it('should not throw when navigating to an invalid word', () => {
        const previewBar = new QuickviewDocumentPreviewBar(fakeIframe, words);

        expect(() => previewBar.navigateForward(words.words['does not exist'])).not.toThrow();
        expect(() => previewBar.navigateBackward(words.words['does not exist'])).not.toThrow();
        expect(() => previewBar.navigateTo(0, words.words['does not exist'])).not.toThrow();
      });
    });
  });
}
