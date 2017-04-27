import { Dropdown } from '../../../../src/ui/FormWidgets/Dropdown';
import { $$ } from '../../../../src/utils/Dom';

export function RadioButtonTest() {
  describe('RadioButton', () => {
    let dropdown: Dropdown;
    let values: string[];

    beforeEach(function () {
      values = ['one', 'two', 'three'];
      dropdown = new Dropdown(undefined, values);
    });

    afterEach(function () {
      values = null;
      dropdown = null;
    });

    it('should select the first element by default', () => {
      expect(dropdown.getValue()).toEqual(values[0]);
    });

    describe('select', () => {
      it('should select option at specified index', () => {
        dropdown.select(1);
        expect(dropdown.getValue()).toEqual(values[1]);
      });
    });

    describe('selectValue', () => {
      it('should select option with specified value', () => {
        dropdown.selectValue('three');
        expect(dropdown.getValue()).toEqual('three');
      });

      it('should not change selection if the value doesn\'t exist', () => {
        dropdown.selectValue('random');
        expect(dropdown.getValue()).toEqual(values[0]);
      });
    });
  });
}
