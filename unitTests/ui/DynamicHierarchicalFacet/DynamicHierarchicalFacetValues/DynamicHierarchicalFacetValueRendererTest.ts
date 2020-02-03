import { DynamicHierarchicalFacetValue } from '../../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetValues/DynamicHierarchicalFacetValue';
import { DynamicHierarchicalFacetValueRenderer } from '../../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetValues/DynamicHierarchicalFacetValueRenderer';
import { DynamicHierarchicalFacetTestUtils } from '../DynamicHierarchicalFacetTestUtils';
import { $$ } from '../../../../src/Core';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';
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
      initializeComponentWithValue(DynamicHierarchicalFacetTestUtils.createFakeFacetValue());
    });

    function initializeComponentWithValue(value: IDynamicHierarchicalFacetValueProperties) {
      facet = DynamicHierarchicalFacetTestUtils.createFakeFacet();
      facetValue = new DynamicHierarchicalFacetValue(value, facet);
      facetValueRenderer = new DynamicHierarchicalFacetValueRenderer(facetValue, facet);
      element = facetValueRenderer.render();
    }

    function initializeComponentWithSelectedValue() {
      const selectedValue = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
      selectedValue.state = FacetValueState.selected;
      initializeComponentWithValue(selectedValue);
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
      initializeComponentWithValue(fakeFacetValueWithXSS);
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

    it('button should not have the class "coveo-with-space"', () => {
      expect($$(getButton()).hasClass('coveo-with-space')).toBe(false);
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
      initializeComponentWithSelectedValue();
      expect($$(getButton()).hasClass('coveo-selected')).toBe(true);
    });

    it(`when value is selected
    button should be disabled`, () => {
      initializeComponentWithSelectedValue();
      expect(getButton().getAttribute('disabled')).toBeTruthy();
    });

    describe(`testing the margin ("coveo-with-space")`, () => {
      it(`when value is not at the first level and has no children
        button should have the class "coveo-with-space"`, () => {
        const childValue = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
        childValue.path = ['a', 'path'];
        initializeComponentWithValue(childValue);

        expect($$(getButton()).hasClass('coveo-with-space')).toBe(true);
      });

      it(`when value is not at the first level and has no children, but is selected
        button should not have the class "coveo-with-space"`, () => {
        const childValue = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
        childValue.path = ['a', 'path'];
        childValue.state = FacetValueState.selected;
        initializeComponentWithValue(childValue);

        expect($$(getButton()).hasClass('coveo-with-space')).toBe(false);
      });

      it(`when value is not at the first level but has children
        button should not have the class "coveo-with-space"`, () => {
        const childValueWithChildren = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
        childValueWithChildren.path = ['a', 'path'];
        childValueWithChildren.children = [
          new DynamicHierarchicalFacetValue(DynamicHierarchicalFacetTestUtils.createFakeFacetValue(), facet)
        ];
        initializeComponentWithValue(childValueWithChildren);

        expect($$(getButton()).hasClass('coveo-with-space')).toBe(false);
      });
    });

    describe(`testing the arrow`, () => {
      function getArrow() {
        return $$(element).find('.coveo-dynamic-hierarchical-facet-value-arrow');
      }

      it('should not prepend an arrow by default', () => {
        expect(getArrow()).toBeFalsy();
      });

      it(`when value is selected
      should not prepend an arrow`, () => {
        initializeComponentWithSelectedValue();
        expect(getArrow()).toBeFalsy();
      });

      describe('when value is not at the first level and has children', () => {
        beforeEach(() => {
          const valueWithChildren = DynamicHierarchicalFacetTestUtils.createFakeFacetValue();
          valueWithChildren.children = [new DynamicHierarchicalFacetValue(DynamicHierarchicalFacetTestUtils.createFakeFacetValue(), facet)];
          initializeComponentWithValue(valueWithChildren);
        });

        it(`when facet has no selected value
          should not prepend an arrow`, () => {
          expect(getArrow()).toBeFalsy();
        });

        it(`when facet has a selected value, 
          when value is not at the first level and has children
          should prepend an arrow`, () => {
          facet.values.selectPath(['random value']);
          element = facetValueRenderer.render();

          expect(getArrow()).toBeTruthy();
        });
      });
    });
  });
}
