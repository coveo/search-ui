import { DatePicker } from '../../src/ui/FormWidgets/DatePicker';
import { DateUtils } from '../../src/utils/DateUtils';

export function DatePickerTest() {
  describe('DatePicker', () => {
    let picker: DatePicker;
    let spy: jasmine.Spy;

    beforeEach(function() {
      spy = jasmine.createSpy('spy');
      picker = new DatePicker(spy);
    });

    afterEach(function() {
      picker = null;
    });

    it('should be a readonly input', () => {
      let element = picker.getElement();
      expect(element.tagName.toLowerCase()).toEqual('input');
      expect(element.readOnly).toBe(true);
    });

    it('should return an empty string for getValue if it was not set before', () => {
      expect(picker.getValue()).toEqual('');
    });

    it('should return null for getDateValue if it was not set before', () => {
      expect(picker.getDateValue()).toBeNull();
    });

    describe('set value', () => {
      it('should allow to set the date and get it as a string', () => {
        const date = new Date();
        picker.setValue(date);
        expect(picker.getValue()).toEqual(DateUtils.dateForQuery(date));
      });

      it('should allow to set the date and get it as a date', () => {
        const date = new Date();
        picker.setValue(date);
        expect(picker.getDateValue() instanceof Date).toBe(true);
      });

      it('should call on change when the date is set', () => {
        const date = new Date();
        picker.setValue(date);
        expect(spy).toHaveBeenCalledWith(picker);
      });
    });

    describe('reset', () => {
      it('should allow to reset', () => {
        const date = new Date();
        picker.setValue(date);
        picker.reset();
        expect(picker.getValue()).toEqual('');
        expect(picker.getDateValue()).toBeNull();
      });

      it('should call on change with reset', () => {
        const date = new Date();
        picker.setValue(date);
        picker.reset();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(picker);
      });
    });
  });
}
