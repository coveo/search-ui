import { $$ } from '../../../../src/utils/Dom';
import { DynamicFacetValueRenderer } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValueRenderer';
import { DynamicFacetValue } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { DynamicFacetTestUtils } from '../DynamicFacetTestUtils';
import { DynamicFacet, IDynamicFacetOptions } from '../../../../src/ui/DynamicFacet/DynamicFacet';
import { analyticsActionCauseList } from '../../../../src/ui/Analytics/AnalyticsActionListMeta';

export function DynamicFacetValueRendererTest() {
  describe('DynamicFacetValueRenderer', () => {
    let dynamicFacetValue: DynamicFacetValue;
    let dynamicFacetValueRenderer: DynamicFacetValueRenderer;
    let facet: DynamicFacet;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent(options?: IDynamicFacetOptions) {
      facet = DynamicFacetTestUtils.createFakeFacet(options);
      dynamicFacetValue = new DynamicFacetValue(DynamicFacetTestUtils.createFakeFacetValues(1)[0], facet);
      dynamicFacetValueRenderer = new DynamicFacetValueRenderer(dynamicFacetValue, facet);
    }

    it('should render without errors', () => {
      expect(() => dynamicFacetValueRenderer.render()).not.toThrow();
    });

    describe('when being rendered', () => {
      let element: HTMLElement;
      let checkboxButton: HTMLElement;

      beforeEach(() => {
        element = dynamicFacetValueRenderer.render();
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
          dynamicFacetValue.toggleSelect();

          $$(checkboxButton).trigger('click');

          expect(facet.toggleSelectValue).toHaveBeenCalledTimes(1);
          expect(facet.triggerNewQuery).toHaveBeenCalledTimes(1);
          expect($$(element).hasClass('coveo-selected')).toBe(true);
        });

        it(`when checkbox is clicked
        should log the select analytics action`, () => {
          facet.triggerNewQuery = beforeExecuteQuery => {
            beforeExecuteQuery();
          };
          // Toggling selection on value manualy because the facet is only a mock
          dynamicFacetValue.toggleSelect();
          $$(checkboxButton).trigger('click');

          expect(facet.logAnalyticsEvent).toHaveBeenCalledWith(
            analyticsActionCauseList.dynamicFacetSelect,
            dynamicFacetValue.analyticsMeta
          );
        });

        it('should contain an aria-label with the correct string', () => {
          const expectedAriaLabel = `Select ${dynamicFacetValue.value} with ${dynamicFacetValue.formattedCount} results`;

          expect($$(checkboxButton).getAttribute('aria-label')).toBe(expectedAriaLabel);
        });
      });

      describe('when being the facet value is selected', () => {
        beforeEach(() => {
          dynamicFacetValue.select();
          element = dynamicFacetValueRenderer.render();
          checkboxButton = $$(element).find('button');
        });

        it('should have the coveo-selected class', () => {
          expect($$(element).hasClass('coveo-selected')).toBe(true);
        });

        it(`when checkbox is clicked
        should toggle the value to deselected correctly`, () => {
          // Toggling selection on value manualy because the facet is only a mock
          dynamicFacetValue.toggleSelect();
          $$(checkboxButton).trigger('click');

          expect(facet.toggleSelectValue).toHaveBeenCalledTimes(1);
          expect(facet.enableFreezeCurrentValuesFlag).toHaveBeenCalledTimes(1);
          expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalledTimes(1);
          expect(facet.triggerNewQuery).toHaveBeenCalledTimes(1);
          expect($$(element).hasClass('coveo-selected')).toBe(false);
        });

        it(`when checkbox is clicked
        should log the deselect analytics action`, () => {
          facet.triggerNewQuery = beforeExecuteQuery => {
            beforeExecuteQuery();
          };
          // Toggling selection on value manualy because the facet is only a mock
          dynamicFacetValue.toggleSelect();
          $$(checkboxButton).trigger('click');

          expect(facet.logAnalyticsEvent).toHaveBeenCalledWith(
            analyticsActionCauseList.dynamicFacetDeselect,
            dynamicFacetValue.analyticsMeta
          );
        });

        it('should contain an aria-label with the correct string', () => {
          const expectedAriaLabel = `Unselect ${dynamicFacetValue.value} with ${dynamicFacetValue.formattedCount} results`;

          expect($$(checkboxButton).getAttribute('aria-label')).toBe(expectedAriaLabel);
        });
      });
    });
  });
}
