import { CategoryFacetValues } from '../../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValues'
import { CategoryFacetTestUtils } from '../CategoryFacetTestUtils';
import { CategoryFacet } from '../../../../src/ui/CategoryFacet/CategoryFacet';
import { IFacetResponse, IFacetResponseValue } from '../../../../src/rest/Facet/FacetResponse';
import { CategoryFacetValue } from '../../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValue';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';

export function CategoryFacetValuesTest() {
  describe('CategoryFacetValues', () => {
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
            values: CategoryFacetTestUtils.createFakeFacetResponseValues(2)
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

    describe('testing clearHierarchy', () => {
      it(`when path is a single level
        should set the value state to idle`, () => {
        facet.values.createFromResponse(CategoryFacetTestUtils.getCompleteFacetResponse(facet));
        const testValue = facet.values.allFacetValues[2];
        testValue.select();
        facet.values.clearHierarchy([testValue.value]);
        expect(testValue.state).toBe(FacetValueState.idle);
      });

      describe('when path is multiple levels', () => {
        let testValue: CategoryFacetValue;
        let childTestValue: CategoryFacetValue;
        let grandChildTestValue: CategoryFacetValue;

        beforeEach(() => {
          facet.values.createFromResponse(CategoryFacetTestUtils.getCompleteFacetResponse(facet, {
            values: CategoryFacetTestUtils.createFakeFacetResponseValues(3)
          }));

          testValue = facet.values.allFacetValues[1];
          childTestValue = facet.values.allFacetValues[1].children[3];
          grandChildTestValue = facet.values.allFacetValues[1].children[3].children[0];
          grandChildTestValue.select();
        });

        function shouldBeIdle(facetValues: CategoryFacetValue[]) {
          facetValues.forEach(({ state }) => expect(state).toBe(FacetValueState.idle));
        }

        function shouldBeChildlessExcept(facetValues: CategoryFacetValue[], pathValue: string) {
          facetValues.forEach(({ value, children }) => value !== pathValue && expect(children.length).toBe(0));
        }

        it(`should set every values's state expect to idle`, () => {
          facet.values.clearHierarchy([testValue.value, childTestValue.value, grandChildTestValue.value]);
          shouldBeIdle(facet.values.allFacetValues);
          shouldBeIdle(testValue.children);
          shouldBeIdle(childTestValue.children);
        });

        it(`should remove every values's children outside of the path`, () => {
          facet.values.clearHierarchy([testValue.value, childTestValue.value, grandChildTestValue.value]);
          shouldBeChildlessExcept(facet.values.allFacetValues, testValue.value);
          shouldBeChildlessExcept(testValue.children, childTestValue.value);
          shouldBeChildlessExcept(childTestValue.children, grandChildTestValue.value);
        });
      });
    });

    describe('testing render', () => {
      let listElement: HTMLElement;
      
      beforeEach(() => {
        facet.values.createFromResponse(CategoryFacetTestUtils.getCompleteFacetResponse(facet, {
          values: CategoryFacetTestUtils.createFakeFacetResponseValues(3, 3)
        }));
        listElement = facet.values.render();
      });

      it('should render the correct number of children', () => {
        expect(listElement.children.length).toBe(39);
      });

      it('should render the children in the correct order', () => {
        expect(listElement.children[0].getAttribute('data-value')).toBe(facet.values.allFacetValues[0].value);
        expect(listElement.children[1].getAttribute('data-value')).toBe(facet.values.allFacetValues[0].children[0].value);
        expect(listElement.children[listElement.children.length - 1].getAttribute('data-value')).toBe(facet.values.allFacetValues[2].children[2].children[2].value);
      });
    });

    describe('testing get', () => {
      beforeEach(() => {
        facet.values.createFromResponse(CategoryFacetTestUtils.getCompleteFacetResponse(facet, {
          values: CategoryFacetTestUtils.createFakeFacetResponseValues(4, 3)
        }));
      });

      describe('when path already exists', () => {
        it('returns the value at the first level', () => {
          const firstLevelValue = facet.values.allFacetValues[1];
          const path = [firstLevelValue.value];
          expect(facet.values.get(path)).toBe(firstLevelValue);
        });

        it('returns the value at the end of the path at the multiple levels deep', () => {
          const firstLevelValue = facet.values.allFacetValues[1];
          const secondLevelValue = firstLevelValue.children[2];
          const thirdLevelValue = secondLevelValue.children[0];
          const fourthLevelValue = thirdLevelValue.children[1];
          const path = [firstLevelValue.value, secondLevelValue.value, thirdLevelValue.value, fourthLevelValue.value];

          expect(facet.values.get(path)).toBe(fourthLevelValue);
        });
      });

      describe('when path does not exist', () => {
        let newValue: CategoryFacetValue;
        let newValuePath: string[];

        describe('at the first level', () => {
          beforeEach(() => {
            newValuePath = ['hello'];
            newValue = facet.values.get(newValuePath);
          });

          it('returns a new value at the first level with the right attributes', () => {
            expect(newValue.numberOfResults).toBe(0);
            expect(newValue.path).toEqual(newValuePath);
            expect(newValue.children).toEqual([]);
            expect(newValue.value).toBe('hello');
            expect(newValue.state).toBe(FacetValueState.idle);
          });
  
          it('appends the new value at end of the first level', () => {
            expect(facet.values.allFacetValues[facet.values.allFacetValues.length - 1]).toBe(newValue);
          });
        });

        describe('at a deeper level under existing values', () => {
          let firstLevelIndex = 1;
          let secondLevelIndex = 2;

          beforeEach(() => {
            newValuePath = [
              facet.values.allFacetValues[firstLevelIndex].value, 
              facet.values.allFacetValues[firstLevelIndex].children[secondLevelIndex].value, 
              'hello'
            ];
            newValue = facet.values.get(newValuePath);
          });

          it('returns a new value at the deeper level with the right attributes', () => {
            expect(newValue.numberOfResults).toBe(0);
            expect(newValue.path).toEqual(newValuePath);
            expect(newValue.children).toEqual([]);
            expect(newValue.value).toBe('hello');
            expect(newValue.state).toBe(FacetValueState.idle);
          });
  
          it('appends the new value at end of "path"', () => {
            expect(facet.values.allFacetValues[firstLevelIndex].children[secondLevelIndex].children[3]).toBe(newValue);
          });
        });

        describe('at a deeper level under non-existing values', () => {
          beforeEach(() => {
            newValuePath = [
              'bonjour', 
              'hello'
            ];
            newValue = facet.values.get(newValuePath);
          });

          it('creates a new value at the first level with the right attributes', () => {
            const lastFirstLevelIndex = facet.values.allFacetValues.length - 1;
            const newFirstLevelValue = facet.values.allFacetValues[lastFirstLevelIndex];

            expect(newFirstLevelValue.numberOfResults).toBe(0);
            expect(newFirstLevelValue.path).toEqual(['bonjour']);
            expect(newFirstLevelValue.children).toEqual([newValue]);
            expect(newFirstLevelValue.value).toBe('bonjour');
            expect(newFirstLevelValue.state).toBe(FacetValueState.idle);
          });

          it('returns a new value at the deeper level with the right attributes', () => {
            expect(newValue.numberOfResults).toBe(0);
            expect(newValue.path).toEqual(newValuePath);
            expect(newValue.children).toEqual([]);
            expect(newValue.value).toBe('hello');
            expect(newValue.state).toBe(FacetValueState.idle);
          });
  
          it('appends the new value at end of "path"', () => {
            const lastFirstLevelIndex = facet.values.allFacetValues.length - 1;
            expect(facet.values.allFacetValues[lastFirstLevelIndex].children[0]).toBe(newValue);
          });
        });
      });
    });
  });
}
