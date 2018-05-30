import { FacetValues } from '../../src/ui/Facet/FacetValues';
import { FakeResults } from '../Fake';

export function FacetValuesTest() {
  describe('FacetValues', () => {
    it('should allow to updateCountsFromNewValues', () => {
      const oldValues = new FacetValues(FakeResults.createFakeGroupByResult('@field', '@token', 10));
      expect(oldValues.get('@token0').occurrences).toEqual(1);

      const newValues = new FacetValues(FakeResults.createFakeGroupByResult('@field', '@token', 10));
      newValues.get('@token0').occurrences = 123;

      oldValues.updateCountsFromNewValues(newValues);
      expect(oldValues.get('@token0').occurrences).toEqual(123);
    });

    it('should not touch old values if they do not exist in new values', () => {
      const oldValues = new FacetValues(FakeResults.createFakeGroupByResult('@field', '@token', 10));
      expect(oldValues.get('@token9').occurrences).toEqual(10);

      const newValues = new FacetValues(FakeResults.createFakeGroupByResult('@field', '@token', 1));

      oldValues.updateCountsFromNewValues(newValues);
      expect(oldValues.get('@token9').occurrences).toEqual(10);
    });

    it('should set occurrences to 0 in old values if a new value does not exist in old values', () => {
      const oldValues = new FacetValues(FakeResults.createFakeGroupByResult('@field', '@token', 10));
      delete oldValues.get('@token9').occurrences;
      expect(oldValues.get('@token9').occurrences).toBeUndefined();

      const newValues = new FacetValues(FakeResults.createFakeGroupByResult('@field', '@token', 3));

      oldValues.updateCountsFromNewValues(newValues);
      expect(oldValues.get('@token9').occurrences).toEqual(0);
    });

    it('should set the occurences to in new values if importing from another active list', () => {
      const oldValues = new FacetValues(FakeResults.createFakeGroupByResult('@field', '@token', 10));
      oldValues.getAll().forEach(oldValue => (oldValue.selected = true));
      oldValues.get('@token9').occurrences = 999;

      const newValues = new FacetValues(FakeResults.createFakeGroupByResult('@field', '@token', 9));
      expect(newValues.get('@token9')).toBeUndefined();
      newValues.importActiveValuesFromOtherList(oldValues);
      expect(newValues.get('@token9')).toBeDefined();
      expect(newValues.get('@token9').occurrences).toBe(0);
    });
  });
}
