import { DynamicFacetSearchInput } from '../../../src/ui/DynamicFacetSearch/DynamicFacetSearchInput';
import { DynamicFacet } from '../../../src/ui/DynamicFacet/DynamicFacet';
import { DynamicFacetTestUtils } from '../DynamicFacet/DynamicFacetTestUtils';
import { $$, KEYBOARD } from '../../../src/Core';
import { Simulate } from '../../Simulate';

export function DynamicFacetSearchInputTest() {
  describe('DynamicFacetSearchInputTest', () => {
    let facet: DynamicFacet;
    let facetSearchInput: DynamicFacetSearchInput;
    const onChangeSpy = jasmine.createSpy('onChange');

    beforeEach(() => {
      facet = DynamicFacetTestUtils.createFakeFacet();
      facetSearchInput = new DynamicFacetSearchInput(facet, onChangeSpy);
    });

    function getInput() {
      return $$(facetSearchInput.element).find('input');
    }

    function simulateInputChange(value: string) {
      getInput().setAttribute('value', value);
      Simulate.keyUp(getInput(), KEYBOARD.CTRL);
    }

    it('should render the input', () => {
      expect(getInput()).toBeTruthy();
    });

    it(`when triggering a change on the input
    should call the "onChange" passed in the constructor`, () => {
      const value = 'test';
      simulateInputChange(value);
      expect(onChangeSpy).toHaveBeenCalledWith(value);
    });
  });
}
