import { QuickviewDocumentIframe } from '../../src/ui/Quickview/QuickviewDocumentIframe';
import { QuickviewDocumentPreviewBar } from '../../src/ui/Quickview/QuickviewDocumentPreviewBar';
import { QuickviewDocumentWord } from '../../src/ui/Quickview/QuickviewDocumentWord';
import { QuickviewDocumentWordButton } from '../../src/ui/Quickview/QuickviewDocumentWordButton';
import { QuickviewDocumentWordColor } from '../../src/ui/Quickview/QuickviewDocumentWordColor';
import { $$ } from '../../src/utils/Dom';

export function QuickviewDocumentWordButtonTest() {
  describe('QuickviewDocumentWordButton', () => {
    let word: QuickviewDocumentWord;
    let iframe: QuickviewDocumentIframe;
    let previewBar: QuickviewDocumentPreviewBar;
    let button: QuickviewDocumentWordButton;

    const mockIframe = () => {
      iframe = jasmine.createSpyObj<QuickviewDocumentIframe>('quickviewIframe', ['isNewQuickviewDocument']);
      (iframe.isNewQuickviewDocument as jasmine.Spy).and.returnValue(false);
    };

    const mockPreviewBar = () => {
      previewBar = jasmine.createSpyObj<QuickviewDocumentPreviewBar>('previewBar', ['navigateForward', 'navigateBackward']);
    };

    const mockWord = () => {
      word = jasmine.createSpyObj<QuickviewDocumentWord>('quickviewWord', ['navigateForward', 'navigateBackward']);
      (word.navigateBackward as jasmine.Spy).and.returnValue($$('div').el);
      (word.navigateForward as jasmine.Spy).and.returnValue($$('div').el);

      (word.color as any) = new QuickviewDocumentWordColor('rgb(125,125,125)');

      word.text = 'hello world';
      word.count = 123;
    };

    beforeEach(() => {
      mockIframe();
      mockPreviewBar();
      mockWord();

      button = new QuickviewDocumentWordButton(word, previewBar, iframe);
    });

    it('should render the correct name', () => {
      const nameElement = $$(button.el).find('.coveo-term-for-quickview-name');
      expect(nameElement).toBeDefined();
      expect(nameElement.textContent).toContain(word.text);
      expect(nameElement.textContent).toContain(word.count.toString());
    });

    it('should render an up arrow', () => {
      const arrowElement = $$(button.el).find('.coveo-term-for-quickview-up-arrow');
      expect(arrowElement).toBeDefined();
    });

    it('should navigate backward on up arrow click', () => {
      const arrowElement = $$(button.el).find('.coveo-term-for-quickview-up-arrow');
      $$(arrowElement).trigger('click');
      expect(word.navigateBackward).toHaveBeenCalled();
      expect(previewBar.navigateBackward).toHaveBeenCalled();
    });

    it('should render a down arrow', () => {
      const arrowElement = $$(button.el).find('.coveo-term-for-quickview-down-arrow');
      expect(arrowElement).toBeDefined();
    });

    it('should navigate forward on down arrow click', () => {
      const arrowElement = $$(button.el).find('.coveo-term-for-quickview-down-arrow');
      $$(arrowElement).trigger('click');
      expect(word.navigateForward).toHaveBeenCalled();
      expect(previewBar.navigateForward).toHaveBeenCalled();
    });
  });
}
