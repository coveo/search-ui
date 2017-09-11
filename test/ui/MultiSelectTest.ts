import { MultiSelect } from '../../src/ui/FormWidgets/MultiSelect';
export function MultiSelectTest() {
  describe('MultiSelect', () => {
    let multiSelect: MultiSelect;
    let onchange: jasmine.Spy;

    beforeEach(() => {
      onchange = jasmine.createSpy('onchange');
      multiSelect = new MultiSelect(onchange, ['1', '2', '3'], 'hello');
    });

    it('should allow to build and get the element', () => {
      expect(multiSelect.build()).not.toBeNull();
      expect(multiSelect.getElement()).not.toBeNull();
    });

    it('should allow to set the currently selected values', () => {
      multiSelect.setValue(['2', '3']);
      expect(multiSelect.getValue()).toEqual(['2', '3']);
    });

    it('should allow to get the values not currently selected', () => {
      multiSelect.setValue(['2', '3']);
      expect(multiSelect.getUnselectedValues()).toEqual(['1']);
    });

    it('should trigger on change when setting values', () => {
      multiSelect.setValue(['1']);
      expect(onchange).toHaveBeenCalledWith(multiSelect);
    });

    it('should not trigger on change when setting the same values', () => {
      multiSelect.setValue(['1']);
      multiSelect.setValue(['1']);
      expect(onchange).toHaveBeenCalledTimes(1);
    });

    it('should trigger on change when resetting', () => {
      multiSelect.setValue(['1']);
      multiSelect.reset();
      expect(onchange).toHaveBeenCalledTimes(2);
    });

    it('should not trigger on change when resetting multiple time', () => {
      multiSelect.setValue(['1']);
      multiSelect.reset();
      multiSelect.reset();
      expect(onchange).toHaveBeenCalledTimes(2);
    });
  });
}
