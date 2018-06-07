import { QuickviewDocumentHeader } from '../../src/ui/Quickview/QuickviewDocumentHeader';
import { QuickviewDocumentWordButton } from '../../src/ui/Quickview/QuickviewDocumentWordButton';
import { $$ } from '../../src/utils/Dom';

export function QuickviewDocumentHeaderTest() {
  describe('QuickviewDocumentHeader', () => {
    it('should build a valid header element', () => {
      expect(new QuickviewDocumentHeader().el.className).toBe('coveo-quickview-header');
    });

    it('should allow to add a new button', () => {
      const header = new QuickviewDocumentHeader();
      const button = jasmine.createSpyObj<QuickviewDocumentWordButton>('quickviewWordButton', ['el']);
      (button.el as any) = $$('div').el;

      header.addWord(button);

      expect(header.el.firstChild).toBe(button.el);
    });
  });
}
