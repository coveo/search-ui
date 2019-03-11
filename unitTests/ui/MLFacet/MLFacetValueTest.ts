import { MLFacetValue } from '../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import { MLFacetTestUtils } from './MLFacetTestUtils';
import { MLFacet } from '../../../src/ui/MLFacet/MLFacet';

export function MLFacetValueTest() {
  describe('MLFacetValue', () => {
    let noNameFacetValue: MLFacetValue;
    let facet: MLFacet;

    beforeEach(() => {
      facet = MLFacetTestUtils.createFakeFacet();
      noNameFacetValue = new MLFacetValue(MLFacetTestUtils.createFakeFacetValues(1)[0], facet);
    });

    it('should toggle selection correctly', () => {
      noNameFacetValue.toggleSelect();
      expect(noNameFacetValue.selected).toBe(true);
      noNameFacetValue.toggleSelect();
      expect(noNameFacetValue.selected).toBe(false);
    });

    it('should select correctly', () => {
      noNameFacetValue.select();
      expect(noNameFacetValue.selected).toBe(true);
    });

    it('should deselect correctly', () => {
      noNameFacetValue.selected = true;
      noNameFacetValue.deselect();
      expect(noNameFacetValue.selected).toBe(false);
    });

    it(`when comparing with another MLFacetValue with a different value
      it should not equal`, () => {
      const anotherMLFacetValue = new MLFacetValue(MLFacetTestUtils.createFakeFacetValues(2)[1], facet);
      expect(noNameFacetValue.equals(anotherMLFacetValue)).toBe(false);
    });

    it(`when comparing with another MLFacetValue with the same value
      it should equal`, () => {
      const anotherMLFacetValue = new MLFacetValue(MLFacetTestUtils.createFakeFacetValues(1)[0], facet);
      expect(noNameFacetValue.equals(anotherMLFacetValue)).toBe(true);
    });

    it(`when comparing with a value that does not equal it's own value
      it should not equal`, () => {
      const value = 'a random value with no meaning';
      expect(noNameFacetValue.equals(value)).toBe(false);
    });

    it(`when comparing with a value that equals it's own value
      it should equal`, () => {
      const value = noNameFacetValue.value;
      expect(noNameFacetValue.equals(value)).toBe(true);
    });

    it(`when comparing with a value that equals it's own value but with different casing
      it should equal`, () => {
      const value = noNameFacetValue.value.toUpperCase();
      expect(noNameFacetValue.equals(value)).toBe(true);
    });

    // TODO: tests
    // formattedCount
    // valueCaption
    // render (only check that is doesn't throw)
  });
}
