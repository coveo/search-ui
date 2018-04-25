import { QuickviewDocumentPreviewBar } from '../../src/ui/Quickview/QuickviewDocumentPreviewBar';
import { QuickviewDocumentIframe } from '../../src/ui/Quickview/QuickviewDocumentIframe';
import { QuickviewDocumentWords } from '../../src/ui/Quickview/QuickviewDocumentWords';
import { $$ } from '../../src/utils/Dom';
import { QuickviewDocumentWord } from '../../src/ui/Quickview/QuickviewDocumentWord';

export function QuickviewDocumentPreviewBarTest() {
  describe('QuickviewDocumentPreviewBar', () => {
    let fakeIframe: QuickviewDocumentIframe;
    let words: QuickviewDocumentWords;

    const mockWord = (elements: HTMLElement[]) => {
      const word = jasmine.createSpyObj<QuickviewDocumentWord>('quickviewWord', ['isTaggedWord']);
      (word.elements as any) = elements;
      return word;
    };

    beforeEach(() => {
      fakeIframe = jasmine.createSpyObj<QuickviewDocumentIframe>('quickviewIframe', ['body']);
      (fakeIframe.body as any) = $$('div').el;
      words = jasmine.createSpyObj<QuickviewDocumentWords>('quickviewWords', ['b']);
      words.words = {
        a: mockWord([$$('div').el])
      };
    });

    describe("when there's keyword in the document", () => {
      it('s', () => {
        const previewBar = new QuickviewDocumentPreviewBar(fakeIframe, words);
        console.log(previewBar);
      });
    });
  });
}
