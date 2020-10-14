import { DynamicHierarchicalFacetValue } from '../../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetValues/DynamicHierarchicalFacetValue';
import { DynamicHierarchicalFacetValueRenderer } from '../../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetValues/DynamicHierarchicalFacetValueRenderer';
import { DynamicHierarchicalFacetTestUtils } from '../DynamicHierarchicalFacetTestUtils';
import { $$ } from '../../../../src/Core';
import {
  IDynamicHierarchicalFacet,
  IDynamicHierarchicalFacetValueProperties
} from '../../../../src/ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';

export function DynamicHierarchicalFacetValueRendererTest() {
  describe('DynamicHierarchicalFacetValueRenderer', () => {
    let facetValue: DynamicHierarchicalFacetValue;
    let facetValueRenderer: DynamicHierarchicalFacetValueRenderer;
    let facet: IDynamicHierarchicalFacet;
    let element: HTMLElement;

    beforeEach(() => {
      facet = DynamicHierarchicalFacetTestUtils.createFakeFacet();
      initFacetValue(DynamicHierarchicalFacetTestUtils.createFakeFacetValue());
    });

    function initFacetValue(value: IDynamicHierarchicalFacetValueProperties) {
      facetValue = new DynamicHierarchicalFacetValue(value, facet);
      facetValueRenderer = new DynamicHierarchicalFacetValueRenderer(facetValue, facet);
      render();
    }

    function initMultiLevelValues() {
      const grandChildValue = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
      grandChildValue.value = 'more';
      grandChildValue.path = ['one', 'two', 'three'];

      const childValue = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
      childValue.value = 'two';
      childValue.path = ['one', 'two'];
      childValue.children = [new DynamicHierarchicalFacetValue(grandChildValue, facet)];

      const parentValue = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
      parentValue.value = 'one';
      parentValue.path = ['one'];
      parentValue.children = [new DynamicHierarchicalFacetValue(grandChildValue, facet)];

      initFacetValue(childValue);
    }

    function selectValue() {
      facetValue.select();
      render();
    }

    function render() {
      element = facetValueRenderer.render();
    }

    function getLabel() {
      return $$(element).find('.coveo-dynamic-hierarchical-facet-value-label');
    }

    function getButton() {
      return $$(element).find('button');
    }

    function getCount() {
      return $$(element).find('.coveo-dynamic-hierarchical-facet-value-count');
    }

    it('should render without errors', () => {
      expect(() => facetValueRenderer.render()).not.toThrow();
    });

    it('should not render XSS in the displayValue', () => {
      const fakeFacetValueWithXSS = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
      fakeFacetValueWithXSS.displayValue = '<script>alert("Hehe goodbye")</script>';
      initFacetValue(fakeFacetValueWithXSS);
      expect(getLabel().innerHTML).toBe('&lt;script&gt;alert("Hehe goodbye")&lt;/script&gt;');
    });

    it('should assign the value to data-value', () => {
      expect(element.getAttribute('data-value')).toBe(facetValue.value);
    });

    it('should append the correct formatted count', () => {
      expect(getCount().textContent).toBe(`(${facetValue.formattedCount})`);
    });

    it('button should have an aria-label', () => {
      expect(getButton().getAttribute('aria-label')).toBe(facetValue.selectAriaLabel);
    });

    it('button should not have the class "coveo-selected"', () => {
      expect($$(getButton()).hasClass('coveo-selected')).toBe(false);
    });

    it('button should not be disabled', () => {
      expect(getButton().getAttribute('disabled')).toBeFalsy();
    });

    it(`when clicking on the button
    should trigger the right actions`, () => {
      $$(getButton()).trigger('click');
      expect(facet.selectPath).toHaveBeenCalledWith(facetValue.path);
      expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalled();
      expect(facet.scrollToTop).toHaveBeenCalled();
      expect(facet.triggerNewQuery).toHaveBeenCalled();
    });

    it(`when value is selected
    button should have the class "coveo-selected"`, () => {
      selectValue();
      expect($$(getButton()).hasClass('coveo-selected')).toBe(true);
    });

    it(`when value is selected
    button should be disabled`, () => {
      selectValue();
      expect(getButton().getAttribute('disabled')).toBeTruthy();
    });

    describe(`testing the margin ("coveo-with-space")`, () => {
      function hasMargin() {
        return $$(getButton()).hasClass('coveo-with-space');
      }

      it('button should not have the class "coveo-with-space"', () => {
        expect(hasMargin()).toBe(false);
      });

      it(`when value is not at the first level but has children
        button should not have the class "coveo-with-space"`, () => {
        initMultiLevelValues();

        expect(hasMargin()).toBe(false);
      });

      it(`when value is not at the first level and has no children
        button should have the class "coveo-with-space"`, () => {
        initMultiLevelValues();
        facetValue.children = [];
        render();

        expect(hasMargin()).toBe(true);
      });

      it(`when value is not at the first level and has no children, but is selected
        button should not have the class "coveo-with-space"`, () => {
        initMultiLevelValues();
        facetValue.children = [];
        selectValue();

        expect(hasMargin()).toBe(false);
      });
    });

    describe(`testing the back arrow`, () => {
      function getBackArrow() {
        return !!$$(element).find('.coveo-dynamic-hierarchical-facet-value-arrow-left');
      }

      it('should not prepend an arrow by default', () => {
        expect(getBackArrow()).toBe(false);
      });

      it(`when a value is selected
      should not prepend an arrow`, () => {
        selectValue();
        expect(getBackArrow()).toBe(false);
      });

      describe('when value is not at the first level and has children', () => {
        beforeEach(() => {
          initMultiLevelValues();
        });

        it(`when facet has no selected value
          should not prepend an arrow`, () => {
          expect(getBackArrow()).toBe(false);
        });

        it(`when facet has a selected value
          should prepend an arrow`, () => {
          facet.values.selectPath(['random value']);
          element = facetValueRenderer.render();

          expect(getBackArrow()).toBe(true);
        });
      });
    });

    describe(`testing the forward arrow`, () => {
      function getForwardArrow() {
        return !!$$(element).find('.coveo-dynamic-hierarchical-facet-value-arrow-right');
      }

      it(`when isLeafValue is false
      should append an arrow`, () => {
        expect(getForwardArrow()).toBe(true);
      });

      it(`when isLeafValue is true
      should not append an arrow `, () => {
        const value = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
        value.isLeafValue = true;
        initFacetValue(value);
        expect(getForwardArrow()).toBe(false);
      });

      it(`when a value has children
      should not append an arrow`, () => {
        facetValue.children = [new DynamicHierarchicalFacetValue(DynamicHierarchicalFacetTestUtils.createFakeFacetValue(), facet)];
        render();
        expect(getForwardArrow()).toBe(false);
      });

      it(`when value is selected
      should not append an arrow`, () => {
        selectValue();
        expect(getForwardArrow()).toBe(false);
      });
    });

    describe(`testing the collapsed feature`, () => {
      function displayedWhenCollapsed() {
        return $$(getButton()).hasClass('coveo-show-when-collapsed');
      }

      function selectChildrenValue() {
        initMultiLevelValues();
        const children = facetValue.children[0];
        children.select();
        facet.values.selectPath(children.path);
      }

      it('should not display the value when collapsed by default', () => {
        expect(displayedWhenCollapsed()).toBe(false);
      });

      it(`when value is selected
      should display the value when collapsed`, () => {
        selectValue();
        expect(displayedWhenCollapsed()).toBe(true);
      });

      it(`when value is the parent of the selected value
      should display the value when collapsed`, () => {
        selectChildrenValue();
        render();

        expect(displayedWhenCollapsed()).toBe(true);
      });

      it(`when value is the grandparent of the selected value
      should not display the value when collapsed`, () => {
        selectChildrenValue();
        initFacetValue(facet.values.allFacetValues[0]);

        expect(displayedWhenCollapsed()).toBe(false);
      });
    });
  });
}
