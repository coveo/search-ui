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
      facet.values.reset();

      expect(facet.values.allFacetValues.length).toBe(0);
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

    describe('testing selectPath', () => {

      describe('when values are at a single level', () => {
        let testFacetValue: CategoryFacetValue;
        beforeEach(() => {
          facet.values.createFromResponse(CategoryFacetTestUtils.getCompleteFacetResponse(facet, {
            values: CategoryFacetTestUtils.createFakeFacetResponseValues(1, 3)
          }));
        });

        describe('when path already exists', () => {
          beforeEach(() => {
            testFacetValue = facet.values.allFacetValues[1];
            facet.values.selectPath([testFacetValue.value]);
          });

          it('value should be selected', () => {
            expect(testFacetValue.state).toBe(FacetValueState.selected);
          });

          it('should remove all the others values at first level', () => {
            expect(facet.values.allFacetValues.length).toBe(1);
          });
        });

        describe('when path does not exist', () => {
          let newValue = 'a new value!!';
          beforeEach(() => {
            facet.values.selectPath([newValue]);
            testFacetValue = facet.values.allFacetValues[0];
          });

          it('new value should have the right attributes', () => {
            expect(testFacetValue.value).toBe(newValue);
            expect(testFacetValue.children).toEqual([]);
            expect(testFacetValue.path).toEqual([newValue]);
            expect(testFacetValue.state).toBe(FacetValueState.selected);
          });

          it('should remove all the others values at first level', () => {
            expect(facet.values.allFacetValues.length).toBe(1);
          });
        });
      });

      describe('when values are at multiple levels', () => {
        let firstLevelFacetValue: CategoryFacetValue;
        let secondLevelFacetValue: CategoryFacetValue;
        let thirdLevelFacetValue: CategoryFacetValue;

        beforeEach(() => {
          facet.values.createFromResponse(CategoryFacetTestUtils.getCompleteFacetResponse(facet, {
            values: CategoryFacetTestUtils.createFakeFacetResponseValues(4, 3)
          }));
        });

        describe('when path already entirely exists', () => {
          beforeEach(() => {
            firstLevelFacetValue = facet.values.allFacetValues[1];
            secondLevelFacetValue = facet.values.allFacetValues[1].children[0];
            thirdLevelFacetValue = facet.values.allFacetValues[1].children[0].children[2];

            facet.values.selectPath([firstLevelFacetValue.value, secondLevelFacetValue.value, thirdLevelFacetValue.value]);
          });

          it('last level should be selected', () => {
            expect(thirdLevelFacetValue.state).toBe(FacetValueState.selected);
          });

          it('higher than last level values should be idle', () => {
            expect(firstLevelFacetValue.state).toBe(FacetValueState.idle);
            expect(secondLevelFacetValue.state).toBe(FacetValueState.idle);
          });

          it('should remove all the others values at each level', () => {
            expect(facet.values.allFacetValues).toEqual([firstLevelFacetValue]);
            expect(facet.values.allFacetValues[0].children).toEqual([secondLevelFacetValue]);
            expect(facet.values.allFacetValues[0].children[0].children).toEqual([thirdLevelFacetValue]);
          });
        });

        describe('when path only partially exist', () => {
          let newValue = 'a new value!!';

          beforeEach(() => {
            firstLevelFacetValue = facet.values.allFacetValues[1];
            secondLevelFacetValue = facet.values.allFacetValues[1].children[0];

            facet.values.selectPath([firstLevelFacetValue.value, secondLevelFacetValue.value, newValue]);
            thirdLevelFacetValue = facet.values.allFacetValues[0].children[0].children[0];
          });

          it('third level value should be selected', () => {
            expect(thirdLevelFacetValue.state).toBe(FacetValueState.selected);
          });

          it('third level value should have the right value/path', () => {
            expect(thirdLevelFacetValue.value).toBe(newValue);
            expect(thirdLevelFacetValue.path).toEqual([firstLevelFacetValue.value, secondLevelFacetValue.value, newValue]);
          });

          it('higher than last level values should be idle', () => {
            expect(firstLevelFacetValue.state).toBe(FacetValueState.idle);
            expect(secondLevelFacetValue.state).toBe(FacetValueState.idle);
          });

          it('should remove all the others values at each level', () => {
            expect(facet.values.allFacetValues).toEqual([firstLevelFacetValue]);
            expect(facet.values.allFacetValues[0].children).toEqual([secondLevelFacetValue]);
            expect(facet.values.allFacetValues[0].children[0].children).toEqual([thirdLevelFacetValue]);
          });
        });

        describe('when path does not exist', () => {
          let newPath = ['hello', 'this is', 'a brand new path'];

          beforeEach(() => {
            facet.values.selectPath([...newPath]);

            firstLevelFacetValue = facet.values.allFacetValues[0];
            secondLevelFacetValue = facet.values.allFacetValues[0].children[0];
            thirdLevelFacetValue = facet.values.allFacetValues[0].children[0].children[0];
          });

          it('third level should be selected', () => {
            expect(thirdLevelFacetValue.state).toBe(FacetValueState.selected);
          });

          it('third level value should have the right value/path', () => {
            expect(thirdLevelFacetValue.value).toBe(newPath[2]);
            expect(thirdLevelFacetValue.path).toEqual(newPath);
          });

          it('higher than last level values should be idle', () => {
            expect(firstLevelFacetValue.state).toBe(FacetValueState.idle);
            expect(secondLevelFacetValue.state).toBe(FacetValueState.idle);
          });

          it('higher than last level values have the right value/path', () => {
            expect(firstLevelFacetValue.value).toBe(newPath[0]);
            expect(firstLevelFacetValue.path).toEqual(newPath.slice(0, -2));

            expect(secondLevelFacetValue.value).toBe(newPath[1]);
            expect(secondLevelFacetValue.path).toEqual(newPath.slice(0, -1));
          });

          it('should remove all the others values at each level', () => {
            expect(facet.values.allFacetValues).toEqual([firstLevelFacetValue]);
            expect(facet.values.allFacetValues[0].children).toEqual([secondLevelFacetValue]);
            expect(facet.values.allFacetValues[0].children[0].children).toEqual([thirdLevelFacetValue]);
          });
        });
      });
    });
  });
}
