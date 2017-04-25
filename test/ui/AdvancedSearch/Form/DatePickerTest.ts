import { DatePicker } from '../../../../src/ui/FormWidgets/DatePicker';

export function DatePickerTest() {
  describe('DatePicker', () => {
    let picker: DatePicker;

    beforeEach(function () {
      picker = new DatePicker();
    });

    afterEach(function () {
      picker = null;
    });

    it('should be a readonly input', () => {
      let element = picker.getElement();
      expect(element.tagName.toLowerCase()).toEqual('input');
      expect(element.readOnly).toBe(true);
    });
  });
}
