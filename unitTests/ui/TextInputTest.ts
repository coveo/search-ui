import { TextInput, ITextInputOptions } from '../../src/ui/FormWidgets/TextInput';
import { $$ } from '../../src/utils/Dom';
import { Simulate } from '../Simulate';
import { KEYBOARD } from '../../src/Core';

export function TextInputTest() {
  describe('TextInput', () => {
    let textInput: TextInput;
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');
      initializeComponentWithOptions('hello');
    });

    afterEach(() => {
      textInput = null;
      spy = null;
    });

    function initializeComponentWithOptions(name?: string, options?: ITextInputOptions) {
      textInput = new TextInput(spy, name, options);
    }

    function getElement() {
      return textInput.getElement();
    }

    function getInput() {
      return $$(getElement()).find('input');
    }

    function simulateEnter() {
      getInput().setAttribute('value', 'new value');
      Simulate.keyDown(getInput(), KEYBOARD.ENTER);
    }

    function simulateKeyUp() {
      getInput().setAttribute('value', 'new value');
      Simulate.keyUp(getInput(), KEYBOARD.CTRL);
    }

    function simulateBlur() {
      getInput().setAttribute('value', 'new value');
      $$(getInput()).trigger('blur');
    }

    it('should contain a required input element', () => {
      const input = <HTMLInputElement>getInput();
      expect(input.required).toBe(true);
    });

    it('should contain a label if specified', () => {
      const label = 'Label';

      initializeComponentWithOptions(label);
      const labelHTML = $$(getElement()).find('label');
      expect($$(labelHTML).text()).toEqual(label);
    });

    it('should not contain a label if not specified', () => {
      initializeComponentWithOptions();
      const labelHTML = $$(getElement()).find('label');
      expect(labelHTML).toBeNull();
    });

    it('should contain an icon if specified', () => {
      initializeComponentWithOptions(undefined, { icon: 'arrowDown' });
      expect(getElement().querySelector('svg')).not.toBeNull();
    });

    it('should not contain an icon if not specified', () => {
      initializeComponentWithOptions();
      expect(getElement().querySelector('svg')).toBeNull();
    });

    it(`when name is specified and the options "usePlaceholder" is true
    should contain a placeholder instead of a label`, () => {
      const placeholder = 'A Placeholder';
      initializeComponentWithOptions(placeholder, { usePlaceholder: true });

      const input = <HTMLInputElement>getInput();
      const labelHTML = $$(getElement()).find('label');

      expect(labelHTML).toBeNull();
      expect(input.placeholder).toEqual(placeholder);
    });

    describe('setValue', () => {
      it('should modify the input value', () => {
        const value = 'test';
        textInput.setValue(value);
        expect(textInput.getValue()).toEqual(value);
      });

      it('should call the onchange', () => {
        textInput.setValue('test');
        expect(spy).toHaveBeenCalledWith(textInput);
      });

      it('should not call the onchange multiple time', () => {
        textInput.setValue('test');
        textInput.setValue('test');
        textInput.setValue('test');
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should call on change with different values multiple time', () => {
        textInput.setValue('test 1');
        textInput.setValue('test 2');
        textInput.setValue('test 3');
        expect(spy).toHaveBeenCalledTimes(3);
      });

      it('should call on change with empty value', () => {
        textInput.setValue('test');
        textInput.setValue('');
        expect(spy).toHaveBeenCalledTimes(2);
      });
    });

    it('should call on change on reset', () => {
      textInput.setValue('test');
      textInput.reset();
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should call on change after reset with the same original value', () => {
      textInput.setValue('test');
      textInput.reset();
      textInput.setValue('test');
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should call on change after changing values back to the same original value', () => {
      textInput.setValue('test');
      textInput.setValue('');
      textInput.setValue('test');
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should not call on change on reset multiple time', () => {
      textInput.setValue('test');
      textInput.reset();
      textInput.reset();
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should have coveo-input as the default class name', () => {
      expect($$(getElement()).getClass()[0]).toBe('coveo-input');
    });

    it('should allow to set a custom class with the option "className"', () => {
      const customClass = 'coveo-custom-class';
      initializeComponentWithOptions('hello', { className: customClass });

      expect($$(getElement()).getClass()[0]).toBe(customClass);
    });

    describe('when option "triggerOnChangeAsYouType" is false (default)', () => {
      it('should trigger "onChange" when input is blurred', () => {
        simulateBlur();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should trigger "onChange" when the Enter key is pressed on the keyboard', () => {
        simulateEnter();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should not trigger "onChange" on key up', () => {
        simulateKeyUp();
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('when option "triggerOnChangeAsYouType" is true', () => {
      beforeEach(() => {
        initializeComponentWithOptions('hello', { triggerOnChangeAsYouType: true });
      });

      it('should not trigger "onChange" when input is blurred', () => {
        simulateBlur();
        expect(spy).not.toHaveBeenCalled();
      });

      it('should not trigger "onChange" when the Enter key is pressed on the keyboard', () => {
        simulateEnter();
        expect(spy).not.toHaveBeenCalled();
      });

      it('should trigger "onChange" on key up', () => {
        simulateKeyUp();
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    it(`should have the "autocomplete" attribute set to "off"`, () => {
      expect(getInput().getAttribute('autocomplete')).toBe('off');
    });

    it(`when the "ariaLabel" option is not defined (default)
    should not add the "aria-label" attribute`, () => {
      expect(getInput().hasAttribute('aria-label')).toBe(false);
    });

    it(`when the "ariaLabel" option is defined
    should add the "aria-label" attribute on the input with the right value`, () => {
      const ariaLabel = 'An arial label;';
      initializeComponentWithOptions('Hello', { ariaLabel });

      expect(getInput().getAttribute('aria-label')).toEqual(ariaLabel);
    });

    it(`when the "isRequired" option is true
    should set the "required" attribute on the input to true`, () => {
      initializeComponentWithOptions('Hello', { isRequired: true });

      expect(getInput().getAttribute('required')).toBe('true');
    });

    it(`when the "isRequired" option is false
    should set the "required" attribute on the input to false`, () => {
      initializeComponentWithOptions('Hello', { isRequired: false });

      expect(getInput().getAttribute('required')).toBeFalsy();
    });
  });
}
