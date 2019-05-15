import { $$ } from '../../../../src/utils/Dom';
import { MLFacetValueRenderer } from '../../../../src/ui/MLFacet/MLFacetValues/MLFacetValueRenderer';
import { MLFacetValue } from '../../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import { MLFacetTestUtils } from '../MLFacetTestUtils';
import { MLFacet, IMLFacetOptions } from '../../../../src/ui/MLFacet/MLFacet';

export function MLFacetValueRendererTest() {
  describe('MLFacetValueRenderer', () => {
    let mLFacetValue: MLFacetValue;
    let mLFacetValueRenderer: MLFacetValueRenderer;
    let facet: MLFacet;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent(options?: IMLFacetOptions) {
      facet = MLFacetTestUtils.createFakeFacet(options);
      mLFacetValue = new MLFacetValue(MLFacetTestUtils.createFakeFacetValues(1)[0], facet);
      mLFacetValueRenderer = new MLFacetValueRenderer(mLFacetValue, facet);
    }

    it('should render without errors', () => {
      expect(() => mLFacetValueRenderer.render()).not.toThrow();
    });

    describe('when being rendered', () => {
      let element: HTMLElement;
      let checkboxButton: HTMLElement;

      beforeEach(() => {
        element = mLFacetValueRenderer.render();
        checkboxButton = $$(element).find('button');
      });

      it(`when checkbox is focused
        should add the coveo-focused class`, () => {
        $$(checkboxButton).trigger('focusin');

        expect($$(element).hasClass('coveo-focused')).toBe(true);
      });

      it(`when checkbox is focused and blurred
        should remove the coveo-focused class`, () => {
        $$(checkboxButton).trigger('focusin');
        $$(checkboxButton).trigger('focusout');

        expect($$(element).hasClass('coveo-focused')).toBe(false);
      });

      describe('when being the facet value is not selected', () => {
        it('should not have the coveo-selected class', () => {
          expect($$(element).hasClass('coveo-selected')).toBe(false);
        });

        it(`when checkbox is clicked
        should toggle the value to selected correctly`, () => {
          // Toggling selection on value manualy because the facet is only a mock
          mLFacetValue.toggleSelect();

          $$(checkboxButton).trigger('click');

          expect(facet.toggleSelectValue).toHaveBeenCalledTimes(1);
          expect(facet.triggerNewQuery).toHaveBeenCalledTimes(1);
          expect($$(element).hasClass('coveo-selected')).toBe(true);
        });

        it('should contain an aria-label with the correct string', () => {
          const expectedAriaLabel = `Select ${mLFacetValue.value} with ${mLFacetValue.formattedCount} results`;

          expect($$(checkboxButton).getAttribute('aria-label')).toBe(expectedAriaLabel);
        });
      });

      describe('when being the facet value is selected', () => {
        beforeEach(() => {
          mLFacetValue.select();
          element = mLFacetValueRenderer.render();
          checkboxButton = $$(element).find('button');
        });

        it('should have the coveo-selected class', () => {
          expect($$(element).hasClass('coveo-selected')).toBe(true);
        });

        it(`when checkbox is clicked
        should toggle the value to deselected correctly`, () => {
          // Toggling selection on value manualy because the facet is only a mock
          mLFacetValue.toggleSelect();
          $$(checkboxButton).trigger('click');

          expect(facet.toggleSelectValue).toHaveBeenCalledTimes(1);
          expect(facet.triggerNewQuery).toHaveBeenCalledTimes(1);
          expect($$(element).hasClass('coveo-selected')).toBe(false);
        });

        it('should contain an aria-label with the correct string', () => {
          const expectedAriaLabel = `Unselect ${mLFacetValue.value} with ${mLFacetValue.formattedCount} results`;

          expect($$(checkboxButton).getAttribute('aria-label')).toBe(expectedAriaLabel);
        });
      });
    });
  });
}
