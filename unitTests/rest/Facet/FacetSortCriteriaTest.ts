import { FacetSortCriteria, isFacetSortCriteria } from '../../../src/rest/Facet/FacetSortCriteria';

export function FacetSortCriteriaTest() {
  describe('isFacetSortCriteria', () => {
    it('should return false for a value that is not a facet sort criteria', () => {
      expect(isFacetSortCriteria('test')).toBe(false);
    });

    it('should return true for values that are facet sort criterias', () => {
      expect(isFacetSortCriteria(FacetSortCriteria.Score)).toBe(true);
      expect(isFacetSortCriteria(FacetSortCriteria.Occurrences)).toBe(true);
    });
  });
}
