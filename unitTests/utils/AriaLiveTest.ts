import { AriaLive } from '../../src/utils/AriaLive';
import { $$ } from '../../src/Core';

export const AriaLiveTest = () => {
  describe('AriaLive', () => {
    let ariaLive: AriaLive;
    let root: HTMLElement;

    beforeEach(() => {
      ariaLive = new AriaLive();
      root = document.createElement('div');
    });

    function getAriaLiveEl() {
      return $$(root).find('[aria-live]');
    }
    it(`when calling #appendTo,
    it adds a div with attribute aria-live as a child`, () => {
      ariaLive.appendTo(root);
      const ariaLiveEl = getAriaLiveEl();

      expect(ariaLiveEl.getAttribute('aria-live')).toBe('polite');
    });

    it(`when calling #updateText with a value,
    it sets the ariaLive element text to the value`, () => {
      const text = 'text';
      ariaLive.appendTo(root);
      ariaLive.updateText(text);

      expect(getAriaLiveEl().textContent).toBe(text);
    });
  });
};
