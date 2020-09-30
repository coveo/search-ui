import { $$, KEYBOARD } from '../../../src/Core';
import { Combobox } from '../../../src/ui/Combobox/Combobox';
import { ComboboxInput } from '../../../src/ui/Combobox/ComboboxInput';
import { Simulate } from '../../Simulate';
import { comboboxDefaultOptions } from './ComboboxTest';

export function ComboboxInputTest() {
  describe('ComboboxInput', () => {
    let combobox: Combobox;
    let comboboxInput: ComboboxInput;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent() {
      combobox = new Combobox(comboboxDefaultOptions());
      spyOn(combobox, 'onInputBlur');
      spyOn(combobox, 'onInputChange');

      comboboxInput = new ComboboxInput(combobox);
    }

    function getInput() {
      return $$(comboboxInput.element).find('input');
    }

    function simulateInputChange(value: string) {
      getInput().setAttribute('value', value);
      Simulate.keyUp(getInput(), KEYBOARD.CTRL);
    }

    it('should render the input', () => {
      expect(getInput()).toBeTruthy();
    });

    it('value getter should return the input value', () => {
      simulateInputChange('hello');
      expect(comboboxInput.value).toBe('hello');
    });

    it(`when triggering change on the input
    should call the "onInputChange" method of the combobox`, () => {
      const value = 'test';
      simulateInputChange(value);
      expect(combobox.onInputChange).toHaveBeenCalledWith(value);
    });

    it(`when triggering focus on the input,
    when the "clearOnBlur" option if "false" (default)
    should call the "onInputChange" method of the combobox`, () => {
      getInput().dispatchEvent(new Event('focus'));
      expect(combobox.onInputChange).toHaveBeenCalled();
    });

    it(`when triggering blur on the input
    when relatedTarget is outside the combobox
    should call the "onInputBlur" method of the combobox`, () => {
      const relatedTarget = document.body;
      combobox.element.dispatchEvent(new FocusEvent('focusout', { relatedTarget }));
      expect(combobox.onInputBlur).toHaveBeenCalled();
    });

    it(`when triggering blur on the input
    when relatedTarget is inside the combobox
    should not call the "onInputBlur" method of the combobox`, () => {
      const relatedTarget = combobox.values.element;
      combobox.element.dispatchEvent(new FocusEvent('focusout', { relatedTarget }));
      expect(combobox.onInputBlur).not.toHaveBeenCalled();
    });

    it(`when pressing the down arrow on the keyboard
    should call the "focusNextValue" method of the combobox values`, () => {
      spyOn(combobox.values, 'focusNextValue');
      Simulate.keyDown(combobox.element, KEYBOARD.DOWN_ARROW);
      expect(combobox.values.focusNextValue).toHaveBeenCalled();
    });

    it(`when pressing the up arrow on the keyboard
    should call the "focusPreviousValue" method of the combobox values`, () => {
      spyOn(combobox.values, 'focusPreviousValue');
      Simulate.keyDown(combobox.element, KEYBOARD.UP_ARROW);
      expect(combobox.values.focusPreviousValue).toHaveBeenCalled();
    });

    it(`when pressing the home button on the keyboard
    should call the "focusFirstValue" method of the combobox values`, () => {
      spyOn(combobox.values, 'focusFirstValue');
      Simulate.keyDown(combobox.element, KEYBOARD.HOME);
      expect(combobox.values.focusFirstValue).toHaveBeenCalled();
    });

    it(`when pressing the end button on the keyboard
    should call the "focusLastValue" method of the combobox values`, () => {
      spyOn(combobox.values, 'focusLastValue');
      Simulate.keyDown(combobox.element, KEYBOARD.END);
      expect(combobox.values.focusLastValue).toHaveBeenCalled();
    });

    it(`when pressing enter button of the keyboard
    should call the "selectActiveValue" method of the combobox values`, () => {
      spyOn(combobox.values, 'selectActiveValue');
      Simulate.keyUp(combobox.element, KEYBOARD.ENTER);
      expect(combobox.values.selectActiveValue).toHaveBeenCalled();
    });

    it(`when pressing escape button of the keyboard
    should call the "clearAll" method of the combobox`, () => {
      spyOn(combobox, 'clearAll');
      Simulate.keyUp(combobox.element, KEYBOARD.ESCAPE);
      expect(combobox.clearAll).toHaveBeenCalled();
    });

    it('should add the correct accessibility attributes', () => {
      const id = `${combobox.id}-input`;
      const listboxId = `${combobox.id}-listbox`;
      expect(getInput().getAttribute('role')).toBe('combobox');
      expect(getInput().getAttribute('aria-owns')).toBe(listboxId);
      expect(getInput().getAttribute('aria-haspopup')).toBe('listbox');
      expect(getInput().getAttribute('aria-expanded')).toBe('false');
      expect(getInput().getAttribute('aria-autocomplete')).toBe('list');
      expect(getInput().getAttribute('id')).toBe(id);
      expect(getInput().getAttribute('aria-activeDescendant')).toBeFalsy();
    });

    it(`When calling "updateAccessibilityAttributes"
    should modify the correct accessibility attributes`, () => {
      const activeDescendant = 'test';
      comboboxInput.updateAccessibilityAttributes({
        activeDescendant,
        expanded: true
      });

      expect(getInput().getAttribute('aria-expanded')).toBe('true');
      expect(getInput().getAttribute('aria-activeDescendant')).toBe(activeDescendant);
    });

    it(`When calling "clearInput"
    should reset the input correctly`, () => {
      getInput().setAttribute('value', 'test');
      comboboxInput.clearInput();

      expect(combobox.onInputChange).toHaveBeenCalledWith('');
    });
  });
}
