import {TextInput} from '../../../../src/ui/AdvancedSearch/Form/TextInput';
import {$$} from '../../../../src/utils/Dom';

export function TextInputTest() {
  describe('TextInput', () => {
    let textInput: TextInput;

    beforeEach(function () {
      textInput = new TextInput();
    });

    afterEach(function () {
      textInput = null;
    });

    it('should contain a required input element', () => {
      let element = textInput.getElement();
      let input = <HTMLInputElement>$$(element).find('input');
      expect(input.required).toBe(true);
    });

    it('should contain a label if specified', () => {
      let label = 'Label';

      textInput = new TextInput(() => { }, label);
      let element = textInput.getElement();
      let labelHTML = <HTMLInputElement>$$(element).find('label');
      expect($$(labelHTML).text()).toEqual(label);
    });

    it('should not contain a label if not specified', () => {
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
    });
  });
}
