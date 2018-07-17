import { TextInput } from '../../src/ui/FormWidgets/TextInput';
import { $$ } from '../../src/utils/Dom';

export function TextInputTest() {
  describe('TextInput', () => {
    let textInput: TextInput;
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');
      textInput = new TextInput(spy, 'hello');
    });

    afterEach(() => {
      textInput = null;
      spy = null;
    });

    it('should contain a required input element', () => {
      let element = textInput.getElement();
      let input = <HTMLInputElement>$$(element).find('input');
      expect(input.required).toBe(true);
    });

    it('should contain a label if specified', () => {
      let label = 'Label';

      textInput = new TextInput(() => {}, label);
      let element = textInput.getElement();
      let labelHTML = <HTMLInputElement>$$(element).find('label');
      expect($$(labelHTML).text()).toEqual(label);
    });

    it('should not contain a label if not specified', () => {
      textInput = new TextInput(spy);
      let element = textInput.getElement();
      let labelHTML = <HTMLInputElement>$$(element).find('label');
      expect(labelHTML).toBeNull();
    });

    describe('setValue', () => {
      it('should modify the input value', () => {
        let value = 'test';
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

    it('should not call on change on reset multiple time', () => {
      textInput.setValue('test');
      textInput.reset();
      textInput.reset();
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
}
