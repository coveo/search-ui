import * as Globalize from 'globalize';
import { CategoryFacetValue, ICategoryFacetValue } from '../../../../src/ui/CategoryFacet/CategoryFacetValues/CategoryFacetValue'
import { CategoryFacetTestUtils } from '../CategoryFacetTestUtils';
import * as Mock from '../../../MockEnvironment';
import { CategoryFacet } from '../../../../src/ui/CategoryFacet/CategoryFacet';

export function CategoryFacetValueTest() {
  describe('CategoryFacetValue', () => {
    let facet: CategoryFacet;
    let facetValue: CategoryFacetValue;
    let fakeFacetValue: ICategoryFacetValue

    beforeEach(() => {
      facet = Mock.mockComponent(CategoryFacet);
      fakeFacetValue = CategoryFacetTestUtils.createFakeFacetValues()[0];
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

    it(`when the facet value has children
      should render and append in the frament`, () => {
      fakeFacetValue.children = CategoryFacetTestUtils.createFakeFacetValues().map(fakeFacetValue => new CategoryFacetValue(fakeFacetValue, facet));
      facetValue = new CategoryFacetValue(fakeFacetValue, facet);
      const fragment = new DocumentFragment();
      facetValue.render(fragment)
      expect(fragment.children.length).toBe(facetValue.children.length + 1);
    });
  });
}
