import { RadioButton } from '../../src/ui/FormWidgets/RadioButton';

export function RadioButtonTest() {
  describe('RadioButton', () => {
    let radioButton: RadioButton;
    let onChange: jasmine.Spy;

    beforeEach(function() {
      onChange = jasmine.createSpy('onchange');
      radioButton = new RadioButton(onChange, 'Hello world', 'same-name');
    });

    afterEach(function() {
      onChange = null;
      radioButton = null;
    });

    it('should return the element', () => {
      expect(radioButton.getElement()).not.toBe(null);
    });

    it('should return the value', () => {
      expect(radioButton.getValue()).toEqual('Hello world');
    });

    it('should return the label element', () => {
      expect(radioButton.getLabel().tagName.toLowerCase()).toEqual('label');
    });

    it('should return the input element', () => {
      expect(radioButton.getRadio().tagName.toLowerCase()).toEqual('input');
    });

    describe('select', () => {
      it('should return is selected correctly', () => {
        radioButton.select();
        expect(radioButton.isSelected()).toBe(true);
      });

      it('should call the on change option', () => {
        radioButton.select();
        expect(onChange).toHaveBeenCalledWith(radioButton);
      });

      it('should not call the on change option when already selected', () => {
        radioButton.select();
        radioButton.select();
        expect(onChange).toHaveBeenCalledTimes(1);
      });
    });

    describe('reset', () => {
      it('should allow to reset selection', () => {
        radioButton.select();
        expect(radioButton.isSelected()).toBe(true);
        radioButton.reset();
        expect(radioButton.isSelected()).toBe(false);
      });

      it('should call on change', () => {
        radioButton.select();
        radioButton.reset();
        expect(onChange).toHaveBeenCalledTimes(2);
      });

      it('should not call on change multiple time on reset', () => {
        radioButton.select();
        radioButton.reset();
        radioButton.reset();
        expect(onChange).toHaveBeenCalledTimes(2);
      });
    });
  });
}
