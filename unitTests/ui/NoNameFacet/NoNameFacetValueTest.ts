import { NoNameFacetValue } from '../../../src/ui/NoNameFacet/NoNameFacetValues/NoNameFacetValue';
import { NoNameFacetTestUtils } from './NoNameFacetTestUtils';
import { NoNameFacet } from '../../../src/ui/NoNameFacet/NoNameFacet';

export function NoNameFacetValueTest() {
  describe('NoNameFacetValue', () => {
    let noNameFacetValue: NoNameFacetValue;
    let facet: NoNameFacet;

    beforeEach(() => {
      facet = NoNameFacetTestUtils.createFakeFacet();
      noNameFacetValue = new NoNameFacetValue(NoNameFacetTestUtils.createFakeFacetValues(1)[0], facet);
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

    it(`when comparing with another NoNameFacetValue with a different value
      it should not equal`, () => {
      const anotherNoNameFacetValue = new NoNameFacetValue(NoNameFacetTestUtils.createFakeFacetValues(2)[1], facet);
      expect(noNameFacetValue.equals(anotherNoNameFacetValue)).toBe(false);
    });

    it(`when comparing with another NoNameFacetValue with the same value
      it should equal`, () => {
      const anotherNoNameFacetValue = new NoNameFacetValue(NoNameFacetTestUtils.createFakeFacetValues(1)[0], facet);
      expect(noNameFacetValue.equals(anotherNoNameFacetValue)).toBe(true);
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
