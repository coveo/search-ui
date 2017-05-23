import { DatePicker } from '../../src/ui/FormWidgets/DatePicker';
import { DateUtils } from '../../src/utils/DateUtils';

export function DatePickerTest() {
  describe('DatePicker', () => {
    let picker: DatePicker;
    let spy: jasmine.Spy;

    beforeEach(function () {
      spy = jasmine.createSpy('spy');
      picker = new DatePicker(spy);
    });

    afterEach(function () {
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

    describe('set value', () => {
      it('should allow to set the date', () => {
        const date = new Date();
        picker.setValue(date);
        expect(picker.getValue()).toEqual(DateUtils.dateForQuery(date));
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
