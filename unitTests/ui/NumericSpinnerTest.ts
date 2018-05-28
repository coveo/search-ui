import { NumericSpinner } from '../../src/ui/FormWidgets/NumericSpinner';
import { $$ } from '../../src/utils/Dom';

export function NumericSpinnerTest() {
  describe('NumericSpinner', () => {
    let spinner: NumericSpinner;

    beforeEach(() => {
      spinner = new NumericSpinner();
      spinner.setValue(5);
    });

    afterEach(() => {
      spinner = null;
    });

    it('should increment on click on spinner-up', () => {
      const initialValue = spinner.getIntValue();
      const element = spinner.getElement();
      const up = $$(element).find('.coveo-spinner-up');
      $$(up).trigger('click');
      expect(spinner.getIntValue()).toEqual(initialValue + 1);
    });

    it('should decrement on click on spinner-down', () => {
      const initialValue = spinner.getIntValue();
      const element = spinner.getElement();
      const down = $$(element).find('.coveo-spinner-down');
      $$(down).trigger('click');
      expect(spinner.getIntValue()).toEqual(initialValue - 1);
    });

    describe('setValue', () => {
      it('should set the spinner value', () => {
        const value = 8;
        spinner.setValue(value);
        expect(spinner.getIntValue()).toEqual(value);
      });

      it('should set the value to min if below min', () => {
        const min = 5;
        spinner = new NumericSpinner();
        spinner.min = min;
        spinner.setValue(min - 1);
        expect(spinner.getIntValue()).toEqual(min);
      });

      it('should set the value to max if over max', () => {
        const max = 5;
        spinner = new NumericSpinner();
        spinner.max = max;
        spinner.setValue(max + 1);
        expect(spinner.getIntValue()).toEqual(max);
      });
    });
  });
}
