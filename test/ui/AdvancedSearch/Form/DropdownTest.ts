import {Dropdown} from '../../../../src/ui/AdvancedSearch/Form/Dropdown';
import {$$} from '../../../../src/utils/Dom';

export function DropdownTest() {
  describe('Dropdown', () => {
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

    it('should open the menu on click', () => {
      let element = dropdown.getElement();
      let button = $$(element).find('.coveo-dropdown-toggle');
      $$(button).trigger('click');
      expect($$(element).hasClass('coveo-open')).toBe(true);
    });

    it('should close the menu on click if already open', () => {
      dropdown.open();
      let element = dropdown.getElement();
      let button = $$(element).find('.coveo-dropdown-toggle');
      $$(button).trigger('click');
      expect($$(element).hasClass('coveo-open')).toBe(false);
    });

    it('should select the first element by default', () => {
      expect(dropdown.getValue()).toEqual(values[0]);
    });

    it('should select a value on click', () => {
      let options = $$(dropdown.getElement()).findAll('li');
      $$(options[1]).trigger('click');
      expect(dropdown.getValue()).toEqual(values[1]);
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
