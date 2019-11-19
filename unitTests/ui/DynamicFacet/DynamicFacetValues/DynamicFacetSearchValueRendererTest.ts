import { DynamicFacetSearchValueRenderer } from '../../../../src/ui/DynamicFacetSearch/DynamicFacetSearchValueRenderer';
import { DynamicFacetValue } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { DynamicFacetTestUtils } from '../DynamicFacetTestUtils';
import { DynamicFacet } from '../../../../src/ui/DynamicFacet/DynamicFacet';

export function DynamicFacetSearchValueRendererTest() {
  describe('DynamicFacetValueRenderer', () => {
    let dynamicFacetValue: DynamicFacetValue;
    let dynamicFacetSearchValueRenderer: DynamicFacetSearchValueRenderer;
    let facet: DynamicFacet;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent() {
      facet = DynamicFacetTestUtils.createFakeFacet();
      dynamicFacetValue = new DynamicFacetValue(DynamicFacetTestUtils.createFakeFacetValues(1)[0], facet, DynamicFacetSearchValueRenderer);
      dynamicFacetSearchValueRenderer = new DynamicFacetSearchValueRenderer(dynamicFacetValue, facet);

      spyOn(dynamicFacetValue, 'logSelectActionToAnalytics');
    }

    it('should render without errors', () => {
      expect(() => dynamicFacetSearchValueRenderer.render()).not.toThrow();
    });

    it(`when checkbox is clicked
      should trigger the right methods`, () => {
      facet.triggerNewQuery = beforeExecuteQuery => {
        beforeExecuteQuery();
      };
      dynamicFacetSearchValueRenderer.selectAction();

      expect(facet.toggleSelectValue).toHaveBeenCalledTimes(1);
      expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalledTimes(1);
      expect(facet.scrollToTop).toHaveBeenCalledTimes(1);
      expect(dynamicFacetValue.logSelectActionToAnalytics).toHaveBeenCalledTimes(1);
    });
  });
}
