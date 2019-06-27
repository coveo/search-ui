import { TextInput, ITextInputOptions } from '../../src/ui/FormWidgets/TextInput';
import { $$ } from '../../src/utils/Dom';

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

    it('should contain a required input element', () => {
      const input = <HTMLInputElement>$$(getElement()).find('input');
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

    it(`when name is specified and the usePlaceholder options is true
    should contain a placeholder instead of a label`, () => {
      const placeholder = 'A Placeholder';
      initializeComponentWithOptions(placeholder, { usePlaceholder: true });

      const input = <HTMLInputElement>$$(getElement()).find('input');
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

    it('should allow to set a custom class name', () => {
      const customClass = 'coveo-custom-class';
      initializeComponentWithOptions('hello', { className: customClass });

      expect($$(getElement()).getClass()[0]).toBe(customClass);
    });

    // TODO: test triggerOnChangeAsYouType, resetOnBlur & ariaLabel
  });
}
