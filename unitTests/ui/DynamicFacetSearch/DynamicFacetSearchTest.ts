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
      should trigger a new facet search`, done => {
        setTimeout(() => {
          expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalled();
          done();
        }, DynamicFacetSearch.delay);
      });

      it(`when the input has an empty value
      should not trigger a new facet search`, done => {
        simulateInputChange('');

        setTimeout(() => {
          expect(facet.queryController.getEndpoint().facetSearch).not.toHaveBeenCalled();
          done();
        }, DynamicFacetSearch.delay);
      });

      it(`should not trigger a new facet search before the search delay as expired`, done => {
        setTimeout(() => {
          expect(facet.queryController.getEndpoint().facetSearch).not.toHaveBeenCalled();
          done();
        }, 0);
      });
    });

    it(`when triggering multiple changes before the search delay expiration
    should not trigger more than one facet search`, done => {
      simulateInputChange('tes');
      simulateInputChange('test');

      setTimeout(() => {
        expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalledTimes(1);
        done();
      }, DynamicFacetSearch.delay);
    });

    it(`when triggering multiple changes after the search delay expiration
    should trigger more than one facet search`, done => {
      simulateInputChange('tes');

      setTimeout(() => {
        simulateInputChange('test');

        setTimeout(() => {
          expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalledTimes(2);
          done();
        }, DynamicFacetSearch.delay);
      }, DynamicFacetSearch.delay);
    });
  });
}
