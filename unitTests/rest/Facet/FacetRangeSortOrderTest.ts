import { FacetRangeSortOrder, isFacetRangeSortOrder } from '../../../src/rest/Facet/FacetRangeSortOrder';

export function FacetRangeSortOrderTest() {
  describe('isFacetRangeSortOrder', () => {
    it('should return false for a value that is not a facet range sort order', () => {
      expect(isFacetRangeSortOrder('test')).toBe(false);
    });

    it('should return true for values that are facet range sort orders', () => {
      expect(isFacetRangeSortOrder(FacetRangeSortOrder.ascending)).toBe(true);
      expect(isFacetRangeSortOrder(FacetRangeSortOrder.descending)).toBe(true);
    });
  });
}
