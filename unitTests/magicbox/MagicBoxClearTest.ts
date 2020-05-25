import { MagicBoxInstance } from '../../src/magicbox/MagicBox';
import { MagicBoxClear } from '../../src/magicbox/MagicBoxClear';
import { $$, Utils } from '../../src/Core';
import { Grammar } from '../../src/magicbox/Grammar';

export const MagicBoxClearTest = () => {
  describe('MagicBoxClear', () => {
    let elem: HTMLElement;
    let magicBox: MagicBoxInstance;
    let clear: MagicBoxClear;

    function waitForGetSuggestions() {
      return new Promise(resolve => {
        magicBox.getSuggestions = () => {
          resolve();
          return [];
        };
      });
    }

    function passFocusThrough() {
      spyOn(magicBox['inputManager'].input, 'focus').and.callFake(() => {
        magicBox['inputManager'].input.dispatchEvent(new FocusEvent('focus'));
      });
    }

    beforeEach(() => {
      elem = $$('div').el;
      magicBox = new MagicBoxInstance(elem, new Grammar('Any', { Any: /.*/ }), {});
      magicBox.onSuggestions = () => {};
      clear = new MagicBoxClear(magicBox);
      passFocusThrough();
      magicBox.setText('foo');
    });

    it('should create a container', () => {
      expect($$(clear.element).hasClass('magic-box-clear')).toBe(true);
    });

    it('should create an icon', () => {
      expect($$(clear.element).find('.magic-box-icon')).toBeDefined();
    });

    it('when the magicBox contains text, it should clear it on click', () => {
      expect(magicBox.getText()).toBe('foo');
      clear.element.trigger('click');
      expect(magicBox.getText()).toBe('');
    });

    it('should request new suggestions on click', async done => {
      const suggestionsRequested = waitForGetSuggestions();
      clear.element.trigger('click');
      const suggestionsWereRequested = await Promise.race([suggestionsRequested.then(() => true), Utils.resolveAfter(150, false)]);
      expect(suggestionsWereRequested).toEqual(true, "Suggestions should've been requested within a 150ms timeout");
      done();
    });
  });
};
