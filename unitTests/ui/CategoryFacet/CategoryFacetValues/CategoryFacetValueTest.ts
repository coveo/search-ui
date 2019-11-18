import * as Globalize from 'globalize';
import { CategoryFacetValue, ICategoryFacetValue } from '../../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValue'
import { CategoryFacetTestUtils } from '../CategoryFacetTestUtils';
import { CategoryFacet } from '../../../../src/ui/CategoryFacet/CategoryFacet';
import { $$ } from '../../../../src/Core';

export function CategoryFacetValueTest() {
  describe('CategoryFacetValue', () => {
    let facet: CategoryFacet;
    let facetValue: CategoryFacetValue;
    let fakeFacetValue: ICategoryFacetValue

    beforeEach(() => {
      facet = CategoryFacetTestUtils.createFakeFacet();
      fakeFacetValue = CategoryFacetTestUtils.createFakeFacetValue();
      facetValue = new CategoryFacetValue(fakeFacetValue, facet);
    });

    it('should be idle by default', () => {
      expect(facetValue.isIdle).toBe(true);
    });

    it('should select correctly', () => {
      facetValue.select();
      expect(facetValue.isSelected).toBe(true);
    });

    it(`when getting formattedCount
      it should return a string in the Globalize format`, () => {
      expect(facetValue.formattedCount).toBe(Globalize.format(facetValue.numberOfResults, 'n0'));
    });

    it('should return the correct aria-label', () => {
      const expectedAriaLabel = `Select ${facetValue.value} with ${facetValue.formattedCount} results`;
      expect(facetValue.selectAriaLabel).toBe(expectedAriaLabel);
    });

    it(`should render without error`, () => {
      expect(() => facetValue.render(new DocumentFragment())).not.toThrow();
    });

    it('retrieveCount should be equal to the numberOfValues options', () => {
      expect(facetValue.retrieveCount).toBe(facet.options.numberOfValues);
    });

    it(`when the facet value has more children than the numberOfValues options
      it should use it's length as the retrieveCount`, () => {
      fakeFacetValue.children = [null, null, null, null, null, null, null, null, null];
      facetValue = new CategoryFacetValue(fakeFacetValue, facet);
      expect(facetValue.retrieveCount).toBe(facetValue.children.length);
    });

    describe('testing render', () => {
      let fragment: DocumentFragment;

      function addChildrenToValue(numberOfChildren: number) {
        for (let index = 0; index < numberOfChildren; index++) {
          facetValue.children.push(new CategoryFacetValue(CategoryFacetTestUtils.createFakeFacetValue(), facet));
        }
      }

      function renderElement() {
        fragment = new DocumentFragment();
        facetValue.render(fragment);
      }

      function getSeeMore() {
        return fragment.querySelector('.coveo-dynamic-category-facet-show-more') as HTMLElement;
      }

      function getSeeLess() {
        return fragment.querySelector('.coveo-dynamic-category-facet-show-less') as HTMLElement;
      }

      it(`when the facet value has children
      should render and append in the frament`, () => {
        addChildrenToValue(facet.options.numberOfValues);
        renderElement();
        expect(fragment.children.length).toBe(facetValue.children.length + 1);
      });

      it(`when moreValuesAvailable is false
      should not render the "See more"`, () => {
        renderElement();
        expect(getSeeMore()).toBeFalsy();
      });

      it(`when there are less or equal children than the numberOfValues option
      should not render the "See more"`, () => {
        renderElement();
        expect(getSeeLess()).toBeFalsy();
      });

      describe('when moreValuesAvailable is true', () => {
        beforeEach(() => {
          fakeFacetValue.moreValuesAvailable = true;
          facetValue = new CategoryFacetValue(fakeFacetValue, facet);
          renderElement();
        });

        it('should render the "See more" button', () => {
          expect(getSeeMore()).toBeTruthy();
        });

        it(`when clicking on the "See more" button
        should bump the retrieveCount according to the defined options`, () => {
          $$(getSeeMore()).trigger('click');
          expect(facetValue.retrieveCount).toBe(facet.options.numberOfValues + facet.options.pageSize);
        });

        it(`when clicking on the "See more" button
        should call the right methods`, () => {
          $$(getSeeMore()).trigger('click');
          expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalled();
          expect(facet.triggerNewIsolatedQuery).toHaveBeenCalled();
        });
      });

      describe('when there are more children than the numberOfValues option', () => {
        beforeEach(() => {
          const newNumberOfValues = facet.options.numberOfValues + facet.options.pageSize;
          facetValue.retrieveCount = newNumberOfValues;
          addChildrenToValue(newNumberOfValues);
          renderElement();
        });

        it('should render the "See less" button', () => {
          expect(getSeeLess()).toBeTruthy();
        });

        it(`when clicking on the "See less" button
        should bump the retrieveCount according to the defined options`, () => {
          $$(getSeeLess()).trigger('click');
          expect(facetValue.retrieveCount).toBe(facet.options.numberOfValues);
        });

        it(`when clicking on the "See less" button
        should call the right methods`, () => {
          $$(getSeeLess()).trigger('click');
          expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalled();
          expect(facet.triggerNewIsolatedQuery).toHaveBeenCalled();
        });
      });
    });
  });
}
