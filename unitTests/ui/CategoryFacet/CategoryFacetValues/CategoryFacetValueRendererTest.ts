import { CategoryFacetValue } from '../../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValue';
import { CategoryFacetValueRenderer } from '../../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValueRenderer';
import { CategoryFacet } from '../../../../src/ui/CategoryFacet/CategoryFacet';
import { CategoryFacetTestUtils } from '../CategoryFacetTestUtils';

export function CategoryFacetValueRendererTest() {
  describe('CategoryFacetValueRendererTest', () => {
    let facetValue: CategoryFacetValue;
    let facetValueRenderer: CategoryFacetValueRenderer;
    let facet: CategoryFacet;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent() {
    facet = CategoryFacetTestUtils.createFakeFacet();
      facetValue = new CategoryFacetValue(CategoryFacetTestUtils.createFakeFacetValue(), facet);
      facetValueRenderer = new CategoryFacetValueRenderer(facetValue, facet);
    }

    // TODO: add XSS tests
    it('should render without errors', () => {
      expect(() => facetValueRenderer.render()).not.toThrow();
    });
  });
}
