import * as Globalize from 'globalize';
import { DynamicHierarchicalFacetValue } from '../../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetValues/DynamicHierarchicalFacetValue';
import { DynamicHierarchicalFacetTestUtils } from '../DynamicHierarchicalFacetTestUtils';
import { $$ } from '../../../../src/Core';
import {
  IDynamicHierarchicalFacet,
  IDynamicHierarchicalFacetValueProperties
} from '../../../../src/ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { analyticsActionCauseList } from '../../../../src/ui/Analytics/AnalyticsActionListMeta';

export function DynamicHierarchicalFacetValueTest() {
  describe('DynamicHierarchicalFacetValue', () => {
    let facet: IDynamicHierarchicalFacet;
    let facetValue: DynamicHierarchicalFacetValue;
    let fakeFacetValue: IDynamicHierarchicalFacetValueProperties;

    beforeEach(() => {
      facet = DynamicHierarchicalFacetTestUtils.createFakeFacet();
      fakeFacetValue = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
      facetValue = new DynamicHierarchicalFacetValue(fakeFacetValue, facet);
    });

    it('should be idle by default', () => {
      expect(facetValue.isIdle).toBe(true);
    });

    it('should select correctly', () => {
      facetValue.select();
      expect(facetValue.isSelected).toBe(true);
    });

    it('should log the right analytics action', () => {
      facetValue.logSelectActionToAnalytics();
      expect(facet.logAnalyticsEvent).toHaveBeenCalledWith(analyticsActionCauseList.dynamicFacetSelect);
    });

    it(`when getting formattedCount
      it should return a string in the Globalize format`, () => {
      expect(facetValue.formattedCount).toBe(Globalize.format(facetValue.numberOfResults, 'n0'));
    });

    it('should return the correct aria-label', () => {
      const expectedAriaLabel = `${facetValue.value} ${facetValue.formattedCount} results`;
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
      facetValue = new DynamicHierarchicalFacetValue(fakeFacetValue, facet);
      expect(facetValue.retrieveCount).toBe(facetValue.children.length);
    });

    describe('testing render', () => {
      let fragment: DocumentFragment;

      function addChildrenToValue(numberOfChildren: number) {
        for (let index = 0; index < numberOfChildren; index++) {
          facetValue.children.push(new DynamicHierarchicalFacetValue(DynamicHierarchicalFacetTestUtils.createFakeFacetValue(), facet));
        }
      }

      function renderElement() {
        fragment = new DocumentFragment();
        facetValue.render(fragment);
      }

      function getSeeMore() {
        return fragment.querySelector('.coveo-dynamic-hierarchical-facet-show-more') as HTMLElement;
      }

      function getSeeLess() {
        return fragment.querySelector('.coveo-dynamic-hierarchical-facet-show-less') as HTMLElement;
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
          facetValue = new DynamicHierarchicalFacetValue(fakeFacetValue, facet);
          renderElement();
        });

        it('should render the "See more" button', () => {
          expect(getSeeMore()).toBeTruthy();
        });

        it(`when clicking on the "See more" button
        should bump the retrieveCount according to the defined options`, () => {
          $$(getSeeMore()).trigger('click');
          expect(facetValue.retrieveCount).toBe(facet.options.numberOfValues * 2);
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
          const newNumberOfValues = facet.options.numberOfValues * 2;
          facetValue.retrieveCount = newNumberOfValues;
          addChildrenToValue(newNumberOfValues);
          renderElement();
        });

        it('should render the "See less" button', () => {
          expect(getSeeLess()).toBeTruthy();
        });

        it(`when clicking on the "See less" button
        should reduce the retrieveCount according to the defined options`, () => {
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
