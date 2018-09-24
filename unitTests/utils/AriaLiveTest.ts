import { AriaLive } from '../../src/utils/AriaLive';
import { $$ } from '../../src/Core';

export const AriaLiveTest = () => {
  describe('AriaLive', () => {
    let ariaLive: AriaLive;
    let root: HTMLElement;

    beforeEach(() => {
      root = document.createElement('div');
      ariaLive = new AriaLive(root);
    });

    function getAriaLiveEl() {
      return $$(root).find('[aria-live]');
    }
    it(`adds a div with attribute aria-live as a child`, () => {
      const ariaLiveEl = getAriaLiveEl();
      expect(ariaLiveEl.getAttribute('aria-live')).toBe('polite');
    });

    it(`when calling #updateText with a value,
    it sets the ariaLive element text to the value`, () => {
      const text = 'text';
      ariaLive.updateText(text);

      expect(getAriaLiveEl().textContent).toBe(text);
    });
  });
};
