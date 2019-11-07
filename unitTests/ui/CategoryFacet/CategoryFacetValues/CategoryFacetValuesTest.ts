import { CategoryFacetValues } from '../../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValues'
import { CategoryFacetTestUtils } from '../CategoryFacetTestUtils';
import { CategoryFacet } from '../../../../src/ui/CategoryFacet/CategoryFacet';
import { IFacetResponse, IFacetResponseValue } from '../../../../src/rest/Facet/FacetResponse';
import { CategoryFacetValue } from '../../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValue';

export function CategoryFacetValuesTest() {
  describe('CategoryFacetsValues', () => {
    let facet: CategoryFacet;

    beforeEach(() => {
      facet = CategoryFacetTestUtils.createFakeFacet();
      facet.values = new CategoryFacetValues(facet);
    });

    describe('testing createFromResponse', () => {
      let response: IFacetResponse;

      describe('when response has 1 level deep of facet values', () => {
        let testValue: CategoryFacetValue;
        let responseValue: IFacetResponseValue;

        beforeEach(() => {
          response = CategoryFacetTestUtils.getCompleteFacetResponse(facet);
          facet.values.createFromResponse(response);
          testValue = facet.values.allFacetValues[2];
          responseValue = response.values[2];
        });

        it('should have the correct number of values', () => {
          expect(facet.values.allFacetValues.length).toBe(response.values.length);
        });

        it('values should be initialized correctly', () => {
          expect(testValue.value).toBe(responseValue.value);
          expect(testValue.displayValue).toBe(responseValue.value);
          expect(testValue.state).toBe(responseValue.state);
          expect(testValue.numberOfResults).toBe(responseValue.numberOfResults);
          expect(testValue.preventAutoSelect).toBe(false);
          expect(testValue.moreValuesAvailable).toBe(responseValue.moreValuesAvailable);
        });

        it('path should contain the first value', () => {
          expect(testValue.path).toEqual([responseValue.value]);
        });

        it('children should be empty', () => {
          expect(testValue.children).toEqual([]);
        });
      });

      describe('when response has multiple levels deep of facet values', () => {
        let testValue: CategoryFacetValue;
        let childTestValue: CategoryFacetValue;
        let responseValue: IFacetResponseValue;
        let responseChildValue: IFacetResponseValue;

        beforeEach(() => {
          response = CategoryFacetTestUtils.getCompleteFacetResponse(facet, {
            values: CategoryFacetTestUtils.createFakeFacetResponseValues(true)
          });
          facet.values.createFromResponse(response);

          testValue = facet.values.allFacetValues[1];
          childTestValue = facet.values.allFacetValues[1].children[3];
          responseValue = response.values[1];
          responseChildValue = response.values[1].children[3];
        });

        it('should have the correct number of children values', () => {
          expect(testValue.children.length).toBe(responseValue.children.length);
        });

        it('child values should be initialized correctly', () => {
          expect(childTestValue.value).toBe(responseChildValue.value);
          expect(childTestValue.displayValue).toBe(responseChildValue.value);
          expect(childTestValue.state).toBe(responseChildValue.state);
          expect(childTestValue.numberOfResults).toBe(responseChildValue.numberOfResults);
          expect(childTestValue.preventAutoSelect).toBe(false);
          expect(childTestValue.moreValuesAvailable).toBe(responseChildValue.moreValuesAvailable);
        });

        it('children path should contain the parent and child value', () => {
          expect(childTestValue.path).toEqual([responseValue.value, responseChildValue.value]);
        });

        it(`children's children should be empty`, () => {
          expect(childTestValue.children).toEqual([]);
        });
      });
    });

    it('resetValues should empty the values', () => {
      facet.values.createFromResponse(CategoryFacetTestUtils.getCompleteFacetResponse(facet));
      facet.values.resetValues();

      expect(facet.values.allFacetValues.length).toBe(0);
    });
  });
}
