import { TextEllipsisTooltip } from '../../src/ui/Misc/TextEllipsisTooltip';
import { $$ } from '../../src/utils/Dom';

export function TextEllipsisTooltipTest() {
  describe('TextEllipsisTooltip', () => {
    let textEllipsisTooltip: TextEllipsisTooltip;
    let root: HTMLElement;
    let referenceText: HTMLElement;
    const text = 'this is a test';

    beforeEach(() => {
      root = $$('div').el;
      referenceText = $$('p', { style: { width: '200px' } }, text).el;
      root.appendChild(referenceText);

      initializeComponent();
    });

    function initializeComponent() {
      textEllipsisTooltip = new TextEllipsisTooltip(referenceText, 'this is a test', root);
    }

    it('should be instanciated without error', () => {
      expect(() => initializeComponent()).not.toThrow();
    });

    it('should be hidden on instanciation', () => {
      expect($$(textEllipsisTooltip.element).hasClass('coveo-hidden')).toBe(true);
    });

    it('should contain the text', () => {
      expect(textEllipsisTooltip.element.innerText).toBe(text);
    });
  });
}
