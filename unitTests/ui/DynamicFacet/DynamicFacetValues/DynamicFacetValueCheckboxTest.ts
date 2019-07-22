import { $$ } from '../../../../src/utils/Dom';
import { DynamicFacetValueCheckbox } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValueCheckbox';
import { DynamicFacetValue } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { mock } from '../../../MockEnvironment';

export function DynamicFacetValueCheckboxTest() {
  describe('DynamicFacetValueCheckbox', () => {
    let dynamicFacetValueCheckbox: DynamicFacetValueCheckbox;
    let selectAction: any;

    beforeEach(() => {
      selectAction = jasmine.createSpy('selectAction');
      dynamicFacetValueCheckbox = new DynamicFacetValueCheckbox(mock(DynamicFacetValue), selectAction);
    });

    function checkboxButton() {
      return $$(dynamicFacetValueCheckbox.element).find('button');
    }

    it(`when checkbox is clicked
    should toggle the value to deselected correctly`, () => {
      $$(checkboxButton()).trigger('click');
      expect(selectAction).toHaveBeenCalled();
    });
  });
}
