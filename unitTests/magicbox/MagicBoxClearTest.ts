import { MagicBoxInstance } from '../../src/magicbox/MagicBox';
import { MagicBoxClear } from '../../src/magicbox/MagicBoxClear';
import { $$ } from '../../src/Core';
import { Grammar } from '../../src/magicbox/Grammar';

export const MagicBoxClearTest = () => {
  describe('MagicBoxClear', () => {
    let elem: HTMLElement;
    let magicBox: MagicBoxInstance;

    beforeEach(() => {
      elem = $$('div').el;
      magicBox = new MagicBoxInstance(elem, new Grammar('Any', { Any: /.*/ }), {});
    });

    it('should create a container', () => {
      const clear = new MagicBoxClear(magicBox);
      expect($$(clear.element).hasClass('magic-box-clear')).toBe(true);
    });

    it('should create an icon', () => {
      const clear = new MagicBoxClear(magicBox);
      expect($$(clear.element).find('.magic-box-icon')).toBeDefined();
    });

    it('When the magicBox contains text, it should clear it on click', () => {
      const clear = new MagicBoxClear(magicBox);
      magicBox.setText('foo');
      expect(magicBox.getText()).toBe('foo');
      clear.element.trigger('click');
      expect(magicBox.getText()).toBe('');
    });
  });
};
