import { CategoryFacetValue } from '../../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValue';
import { CategoryFacetValueRenderer } from '../../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValueRenderer';
import { CategoryFacet, ICategoryFacetOptions } from '../../../../src/ui/CategoryFacet/CategoryFacet';
import { CategoryFacetTestUtils } from '../CategoryFacetTestUtils';

export function CategoryFacetValueRendererTest() {
  describe('CategoryFacetValueRendererTest', () => {
    let facetValue: CategoryFacetValue;
    let facetValueRenderer: CategoryFacetValueRenderer;
    let facet: CategoryFacet;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent(options?: ICategoryFacetOptions) {
      facet = CategoryFacetTestUtils.createFakeFacet(options);
      facetValue = new CategoryFacetValue(CategoryFacetTestUtils.createFakeFacetValues(1)[0], facet);
      facetValueRenderer = new CategoryFacetValueRenderer(facetValue, facet);
    }

    it('should render without errors', () => {
      expect(() => facetValueRenderer.render()).not.toThrow();
    });
  });
}
