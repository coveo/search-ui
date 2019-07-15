import { DynamicFacetSearch } from '../../../src/ui/DynamicFacetSearch/DynamicFacetSearch';
import { DynamicFacet } from '../../../src/ui/DynamicFacet/DynamicFacet';
import { DynamicFacetTestUtils } from '../DynamicFacet/DynamicFacetTestUtils';
import { $$, KEYBOARD } from '../../../src/Core';
import { Simulate } from '../../Simulate';

export function DynamicFacetSearchTest() {
  describe('DynamicFacetSearch', () => {
    let facet: DynamicFacet;
    let facetSearch: DynamicFacetSearch;

    beforeEach(() => {
      facet = DynamicFacetTestUtils.createAdvancedFakeFacet().cmp;
      facet.values.createFromResponse(DynamicFacetTestUtils.getCompleteFacetResponse(facet));
      facetSearch = new DynamicFacetSearch(facet);
    });

    function getInput() {
      return $$(facetSearch.element).find('input');
    }

    function simulateInputChange(value: string) {
      getInput().setAttribute('value', value);
      Simulate.keyUp(getInput(), KEYBOARD.CTRL);
    }

    it('should render the input', () => {
      expect(getInput()).toBeTruthy();
    });

    describe('when triggering a change on the input', () => {
      beforeEach(() => {
        simulateInputChange('test');
      });

      it(`when the input has a value
      should trigger a new facet search`, () => {
        expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalled();
      });

      it(`when the input has an empty value
      should not trigger a new facet search`, () => {
        simulateInputChange('');
        expect(facet.queryController.getEndpoint().facetSearch).not.toHaveBeenCalled();
      });

      it(`should not trigger a new facet search before the search delay as expired`, done => {
        setTimeout(() => {
          expect(facet.queryController.getEndpoint().facetSearch).not.toHaveBeenCalled();
          done();
        }, 0);
      });
    });

    it(`when triggering multiple changes before the search delay expiration
    should not trigger more than 2 facet searches (leading and trailing)`, () => {
      simulateInputChange('te');
      simulateInputChange('tes');
      simulateInputChange('test');

      expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalledTimes(2);
    });
  });
}
