import { DynamicRangeFacetQueryController } from '../../src/controllers/DynamicRangeFacetQueryController';
import { DynamicRangeFacetTestUtils } from '../ui/DynamicFacet/DynamicRangeFacetTestUtils';
import { DynamicRangeFacet, IDynamicRangeFacetOptions } from '../../src/ui/DynamicFacet/DynamicRangeFacet';

export function DynamicRangeFacetQueryControllerTest() {
  describe('DynamicRangeFacetQueryController', () => {
    let facet: DynamicRangeFacet;
    let facetOptions: IDynamicRangeFacetOptions;
    let dynamicRangeFacetQueryController: DynamicRangeFacetQueryController;
    let ranges = DynamicRangeFacetTestUtils.createFakeRanges();

    beforeEach(() => {
      facetOptions = { field: '@field', ranges };

      initializeComponents();
    });

    function initializeComponents() {
      facet = DynamicRangeFacetTestUtils.createAdvancedFakeFacet(facetOptions).cmp;
      dynamicRangeFacetQueryController = new DynamicRangeFacetQueryController(facet);
    }

    function facetRequest() {
      return dynamicRangeFacetQueryController.facetRequest;
    }

    function facetValues() {
      return facet.values.allFacetValues;
    }

    it('should send the current values', () => {
      const currentValues = facetRequest().currentValues;
      const facetValue = facetValues()[0];
      expect(currentValues[0]).toEqual({
        start: facetValue.start,
        end: facetValue.end,
        endInclusive: facetValue.endInclusive,
        state: facetValue.state
      });
    });

    describe('when there are values', () => {
      it('freezeCurrentValues should be true', () => {
        expect(facetRequest().freezeCurrentValues).toBe(true);
      });

      it('generateAutomaticRanges should be false', () => {
        expect(facetRequest().generateAutomaticRanges).toBe(false);
      });

      it('numberOfValues should be equal to the number of current values', () => {
        expect(facetRequest().numberOfValues).toBe(facetRequest().currentValues.length);
      });
    });

    describe('when there no values', () => {
      beforeEach(() => {
        facet.values.resetValues();
      });

      it('freezeCurrentValues should be false', () => {
        expect(facetRequest().freezeCurrentValues).toBe(false);
      });

      it('generateAutomaticRanges should be true', () => {
        expect(facetRequest().generateAutomaticRanges).toBe(true);
      });

      it('numberOfValues should be equal to the numberOfValues option', () => {
        expect(facetRequest().numberOfValues).toBe(facet.options.numberOfValues);
      });
    });
  });
}
