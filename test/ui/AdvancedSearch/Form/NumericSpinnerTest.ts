/// <reference path="../../../Test.ts" />

module Coveo {
  describe('NumericSpinner', () => {
    let spinner: NumericSpinner;

    beforeEach(function () {
      spinner = new NumericSpinner();
      spinner.setValue(5);
    });

    afterEach(function () {
      spinner = null;
    });

    it('should increment on click on spinner-up', () => {
      let initialValue = spinner.getIntValue();
      let element = spinner.getElement();
      let up = $$(element).find('.coveo-spinner-up');
      $$(up).trigger('click');
      expect(spinner.getIntValue()).toEqual(initialValue + 1);
    })

    it('should decrement on click on spinner-down', () => {
      let initialValue = spinner.getIntValue();
      let element = spinner.getElement();
      let down = $$(element).find('.coveo-spinner-down');
      $$(down).trigger('click');
      expect(spinner.getIntValue()).toEqual(initialValue - 1);
    })

    describe('setValue', () => {
      it('should set the spinner value', () => {
        let value = 8;
        spinner.setValue(value);
        expect(spinner.getIntValue()).toEqual(value);
      })

      it('should set the value to min if below min', () => {
        let min = 5;
        spinner = new NumericSpinner(min);
        spinner.setValue(min - 1);
        expect(spinner.getIntValue()).toEqual(min);
      })

      it('should set the value to max if over max', () => {
        let max = 5;
        spinner = new NumericSpinner(0, max);
        spinner.setValue(max + 1);
        expect(spinner.getIntValue()).toEqual(max);
      })
    })

  })
}
