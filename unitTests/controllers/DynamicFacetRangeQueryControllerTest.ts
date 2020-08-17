import { DynamicFacetRangeQueryController } from '../../src/controllers/DynamicFacetRangeQueryController';
import { DynamicFacetRangeTestUtils } from '../ui/DynamicFacet/DynamicFacetRangeTestUtils';
import { DynamicFacetRange } from '../../src/ui/DynamicFacet/DynamicFacetRange';
import { IDynamicFacetRangeOptions } from '../../src/ui/DynamicFacet/IDynamicFacetRange';
import { QueryBuilder } from '../../src/Core';
import { FacetValueState } from '../../src/rest/Facet/FacetValueState';

export function DynamicFacetRangeQueryControllerTest() {
  describe('DynamicFacetRangeQueryController', () => {
    let facet: DynamicFacetRange;
    let facetOptions: IDynamicFacetRangeOptions;
    let dynamicFacetRangeQueryController: DynamicFacetRangeQueryController;
    let ranges = DynamicFacetRangeTestUtils.createFakeRanges();

    beforeEach(() => {
      facetOptions = {};
      initializeComponents();
    });

    function initializeComponents() {
      facet = DynamicFacetRangeTestUtils.createAdvancedFakeFacet(facetOptions).cmp;
      dynamicFacetRangeQueryController = new DynamicFacetRangeQueryController(facet);
    }

    function facetRequest() {
      return dynamicFacetRangeQueryController.buildFacetRequest(new QueryBuilder().build());
    }

    it('should send the right basic facetRequest parameters', () => {
      expect(facetRequest().facetId).toBe(facet.options.id);
      expect(facetRequest().field).toBe(facet.fieldName);
      expect(facetRequest().type).toBe(facet.facetType);
      expect(facetRequest().sortCriteria).toBe(facet.options.sortCriteria);
      expect(facetRequest().injectionDepth).toBe(facet.options.injectionDepth);
    });

    it('freezeCurrentValues should be false', () => {
      expect(facetRequest().freezeCurrentValues).toBe(false);
    });

    describe('when the ranges option is defined', () => {
      beforeEach(() => {
        facetOptions = { field: '@field', ranges };
        initializeComponents();
      });

      it('numberOfValues should be equal to the number of current values', () => {
        expect(facetRequest().numberOfValues).toBe(facetRequest().currentValues.length);
      });

      it('generateAutomaticRanges should be false', () => {
        expect(facetRequest().generateAutomaticRanges).toBe(false);
      });

      it('should send the ranges values as current', () => {
        const currentValues = facetRequest().currentValues;
        const facetValue = ranges[0];
        expect(currentValues[0]).toEqual(
          jasmine.objectContaining({
            start: facetValue.start,
            end: facetValue.end,
            endInclusive: facetValue.endInclusive,
            state: FacetValueState.idle
          })
        );
      });
    });

    describe('when the ranges option is not defined (empty ranges)', () => {
      it('numberOfValues should be equal to the numberOfValues option', () => {
        expect(facetRequest().numberOfValues).toBe(facet.options.numberOfValues);
      });

      describe('when there are no values in the facet', () => {
        it('generateAutomaticRanges should be true', () => {
          expect(facetRequest().generateAutomaticRanges).toBe(true);
        });

        it('should send no current values', () => {
          expect(facetRequest().currentValues).toEqual([]);
        });
      });

      describe('when there are values in the facet', () => {
        beforeEach(() => {
          facet.selectMultipleValues(['0..100inc', '100..200inc', '200..300inc']);
          facet.deselectValue('0..100inc');
        });

        it('generateAutomaticRanges should be true', () => {
          expect(facetRequest().generateAutomaticRanges).toBe(true);
        });

        it('should send current available values', () => {
          expect(facetRequest().currentValues.length).toEqual(3);
        });
      });
    });
  });
}
