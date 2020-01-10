import { DynamicHierarchicalFacetValues } from '../../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetValues/DynamicHierarchicalFacetValues';
import { DynamicHierarchicalFacetTestUtils } from '../DynamicHierarchicalFacetTestUtils';
import { IFacetResponse, IFacetResponseValue } from '../../../../src/rest/Facet/FacetResponse';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';
import { $$ } from '../../../../src/Core';
import {
  IDynamicHierarchicalFacet,
  IDynamicHierarchicalFacetValue
} from '../../../../src/ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';

export function DynamicHierarchicalFacetValuesTest() {
  describe('DynamicHierarchicalFacetValues', () => {
    let facet: IDynamicHierarchicalFacet;

    beforeEach(() => {
      facet = DynamicHierarchicalFacetTestUtils.createAdvancedFakeFacet({ field: '@test', clearLabel: 'Clear all test' }).cmp;
      facet.values = new DynamicHierarchicalFacetValues(facet);
    });

    function moreButton() {
      const element = facet.values.render();
      return $$(element).find('.coveo-dynamic-hierarchical-facet-show-more');
    }

    function lessButton() {
      const element = facet.values.render();
      return $$(element).find('.coveo-dynamic-hierarchical-facet-show-less');
    }

    describe('testing createFromResponse', () => {
      let response: IFacetResponse;

      describe('when response has 1 level deep of facet values', () => {
        let testValue: IDynamicHierarchicalFacetValue;
        let responseValue: IFacetResponseValue;

        beforeEach(() => {
          response = DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet);
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
        let testValue: IDynamicHierarchicalFacetValue;
        let childTestValue: IDynamicHierarchicalFacetValue;
        let responseValue: IFacetResponseValue;
        let responseChildValue: IFacetResponseValue;

        beforeEach(() => {
          response = DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet, {
            values: DynamicHierarchicalFacetTestUtils.createFakeFacetResponseValues(2)
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

      describe('when response has a selected response value (e.g. autoselection)', () => {
        let responseValue: IFacetResponseValue;

        beforeEach(() => {
          responseValue = DynamicHierarchicalFacetTestUtils.createFakeSelectedFacetResponseValue();
          response = DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet, {
            values: [responseValue]
          });
          facet.values.createFromResponse(response);
        });

        it('should have a single selected value at the root', () => {
          expect(facet.values.allFacetValues.length).toBe(1);
          expect(facet.values.allFacetValues[0].state).toBe(FacetValueState.selected);
        });

        it('should have the right number of children', () => {
          expect(facet.values.allFacetValues[0].children.length).toBe(responseValue.children.length);
        });

        it('should have the right selectedPath', () => {
          expect(facet.values.selectedPath).toEqual(facet.values.allFacetValues[0].path);
        });
      });
    });

    it('resetValues should empty the values and clear the path', () => {
      facet.values.createFromResponse(DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet));
      facet.values.resetValues();

      expect(facet.values.allFacetValues.length).toBe(0);
      expect(facet.values.selectedPath).toEqual([]);
    });

    it('clearPath should clear the path', () => {
      facet.values.createFromResponse(DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet));
      facet.values.clearPath();

      expect(facet.values.allFacetValues.length).not.toBe(0);
      expect(facet.values.selectedPath).toEqual([]);
    });

    describe('testing render', () => {
      let listElement: HTMLElement;

      beforeEach(() => {
        facet.values.createFromResponse(
          DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet, {
            values: DynamicHierarchicalFacetTestUtils.createFakeFacetResponseValues(3, 3)
          })
        );
        listElement = facet.values.render();
      });

      it('should render the correct number of children', () => {
        expect(listElement.children.length).toBe(39);
      });

      it('should render the children in the correct order', () => {
        const documentFragment = new DocumentFragment();
        expect(listElement.children[0]).toEqual(facet.values.allFacetValues[0].render(documentFragment));
        expect(listElement.children[1]).toEqual(facet.values.allFacetValues[0].children[0].render(documentFragment));
        expect(listElement.children[listElement.children.length - 1]).toEqual(
          facet.values.allFacetValues[2].children[2].children[2].render(documentFragment)
        );
      });

      function getAllCategoriesElement() {
        return $$(listElement).find('.coveo-dynamic-hierarchical-facet-all');
      }

      describe('when there is no value selected', () => {
        it('list should not have the class "coveo-with-space"', () => {
          expect($$(listElement).hasClass('coveo-with-space')).toBe(false);
        });

        it('list does not append the "All Categories" element', () => {
          expect(getAllCategoriesElement()).toBeFalsy();
        });
      });

      describe('when there is a value selected', () => {
        beforeEach(() => {
          facet.values.selectPath(facet.values.allFacetValues[0].path);
          listElement = facet.values.render();
        });

        it('list should not have the class "coveo-with-space"', () => {
          expect($$(listElement).hasClass('coveo-with-space')).toBe(true);
        });

        it('list does not append the "All Categories" button', () => {
          expect(getAllCategoriesElement()).toBeTruthy();
        });

        it('clicking on the "All Categories" button should call "clear" on the facet header', () => {
          spyOn(facet.header.options, 'clear');
          $$(getAllCategoriesElement()).trigger('click');
          expect(facet.header.options.clear).toHaveBeenCalled();
        });

        it('the "All Categories" button should be defined by the "clearLabel" facet option', () => {
          expect($$(getAllCategoriesElement()).text()).toBe(facet.options.clearLabel);
        });
      });
    });

    describe('testing selectPath', () => {
      describe('when values are at a single level', () => {
        let testFacetValue: IDynamicHierarchicalFacetValue;
        beforeEach(() => {
          facet.values.createFromResponse(
            DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet, {
              values: DynamicHierarchicalFacetTestUtils.createFakeFacetResponseValues(1, 3)
            })
          );
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

          it('should have the right selectedPath', () => {
            expect(facet.values.selectedPath).toEqual([testFacetValue.value]);
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

          it('should have the right selectedPath', () => {
            expect(facet.values.selectedPath).toEqual([newValue]);
          });
        });
      });

      describe('when values are at multiple levels', () => {
        let firstLevelFacetValue: IDynamicHierarchicalFacetValue;
        let secondLevelFacetValue: IDynamicHierarchicalFacetValue;
        let thirdLevelFacetValue: IDynamicHierarchicalFacetValue;

        beforeEach(() => {
          facet.values.createFromResponse(
            DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet, {
              values: DynamicHierarchicalFacetTestUtils.createFakeFacetResponseValues(4, 3)
            })
          );
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

          it('should have the right selectedPath', () => {
            expect(facet.values.selectedPath).toEqual(thirdLevelFacetValue.path);
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

          it('should have the right selectedPath', () => {
            expect(facet.values.selectedPath).toEqual(thirdLevelFacetValue.path);
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

          it('should have the right selectedPath', () => {
            expect(facet.values.selectedPath).toEqual(thirdLevelFacetValue.path);
          });
        });
      });
    });

    describe('testing show more/less values', () => {
      describe('when moreValuesAvailable is true', () => {
        beforeEach(() => {
          facet.moreValuesAvailable = true;
        });

        it(`should render the "Show more" button`, () => {
          expect(moreButton()).toBeTruthy();
        });

        it(`when clicking on the "Show more" button
          should perform the correct actions on the facet`, () => {
          spyOn(facet, 'showMoreValues');
          spyOn(facet, 'enableFreezeFacetOrderFlag');
          $$(moreButton()).trigger('click');
          expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalledTimes(1);
          expect(facet.showMoreValues).toHaveBeenCalledTimes(1);
        });

        it(`when the facet option enableMoreLess is false
          should not should render the "Show more" button`, () => {
          facet.options.enableMoreLess = false;
          expect(moreButton()).toBeFalsy();
        });
      });

      describe('when there are more values than the numberOfValues option', () => {
        beforeEach(() => {
          const response = DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet, {
            values: DynamicHierarchicalFacetTestUtils.createFakeFacetResponseValues(1, 20)
          });
          facet.values.createFromResponse(response);
        });

        it(`should render the "Show less" button`, () => {
          expect(lessButton()).toBeTruthy();
        });

        it(`when clicking on the "Show less" button
          should perform the correct actions on the facet`, () => {
          spyOn(facet, 'enableFreezeFacetOrderFlag');
          spyOn(facet, 'showLessValues');
          $$(lessButton()).trigger('click');
          expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalledTimes(1);
          expect(facet.showLessValues).toHaveBeenCalledTimes(1);
        });

        it(`when the facet option enableMoreLess is false
          should not should render the "Show less" button`, () => {
          facet.options.enableMoreLess = false;
          expect(lessButton()).toBeFalsy();
        });
      });
    });
  });
}
