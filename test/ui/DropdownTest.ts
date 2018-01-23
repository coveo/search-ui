import { Dropdown } from '../../src/ui/FormWidgets/Dropdown';

export function DropdownTest() {
  describe('Dropdown', () => {
    let dropdown: Dropdown;
    let values: string[];
    let changeSpy: jasmine.Spy;

    beforeEach(function() {
      values = ['one', 'two', 'three'];
      changeSpy = jasmine.createSpy('changeSpy');
      dropdown = new Dropdown(changeSpy, values);
    });

    afterEach(function() {
      values = null;
      dropdown = null;
      changeSpy = null;
    });

    it('should select the first element by default', () => {
      expect(dropdown.getValue()).toEqual(values[0]);
    });

    it('should call the on change function when the option is changed', () => {
      dropdown.select(1);
      expect(changeSpy).toHaveBeenCalled();
    });

    it('should not call the on change function if not wanted', () => {
      dropdown.select(1, false);
      expect(changeSpy).not.toHaveBeenCalled();
    });

    describe('select', () => {
      it('should select option at specified index', () => {
        dropdown.select(1);
        expect(dropdown.getValue()).toEqual(values[1]);
      });

      it('should execute the onchange function by default when a selection is made', () => {
        let onchangeSpy = jasmine.createSpy('onchange');
        dropdown.onChange = onchangeSpy;
        dropdown.select(1);
        expect(onchangeSpy).toHaveBeenCalled();
      });

      it('should not execute the onchange function if specified', () => {
        let onchangeSpy = jasmine.createSpy('onchange');
        dropdown.onChange = onchangeSpy;
        dropdown.select(1, false);
        expect(onchangeSpy).not.toHaveBeenCalled();
      });
    });

    describe('selectValue', () => {
      it('should select option with specified value', () => {
        dropdown.setValue('three');
        expect(dropdown.getValue()).toEqual('three');
      });

      it("should not change selection if the value doesn't exist", () => {
        dropdown.setValue('random');
        expect(dropdown.getValue()).toEqual(values[0]);
      });
    });
  });
}
