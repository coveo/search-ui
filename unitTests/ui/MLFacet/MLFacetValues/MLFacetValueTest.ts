import * as Globalize from 'globalize';
import { MLFacetValue } from '../../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import { MLFacetTestUtils } from '../MLFacetTestUtils';
import { MLFacet, IMLFacetOptions } from '../../../../src/ui/MLFacet/MLFacet';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';

export function MLFacetValueTest() {
  describe('MLFacetValue', () => {
    let mLFacetValue: MLFacetValue;
    let facet: MLFacet;
    let options: IMLFacetOptions;

    beforeEach(() => {
      options = undefined;
      initializeComponent();
    });

    function initializeComponent() {
      facet = MLFacetTestUtils.createFakeFacet(options);
      mLFacetValue = new MLFacetValue(MLFacetTestUtils.createFakeFacetValues(1)[0], facet);
    }

    it('should toggle selection correctly', () => {
      mLFacetValue.toggleSelect();
      expect(mLFacetValue.isSelected).toBe(true);
      mLFacetValue.toggleSelect();
      expect(mLFacetValue.isSelected).toBe(false);
    });

    it('should select correctly', () => {
      mLFacetValue.select();
      expect(mLFacetValue.isSelected).toBe(true);
    });

    it('should deselect correctly', () => {
      mLFacetValue.state = FacetValueState.selected;
      mLFacetValue.deselect();
      expect(mLFacetValue.isSelected).toBe(false);
    });

    it(`when comparing with another MLFacetValue with a different value
      it should not equal`, () => {
      const anotherMLFacetValue = new MLFacetValue(MLFacetTestUtils.createFakeFacetValues(2)[1], facet);
      expect(mLFacetValue.equals(anotherMLFacetValue)).toBe(false);
    });

    it(`when comparing with another MLFacetValue with the same value
      it should equal`, () => {
      const anotherMLFacetValue = new MLFacetValue(MLFacetTestUtils.createFakeFacetValues(1)[0], facet);
      expect(mLFacetValue.equals(anotherMLFacetValue)).toBe(true);
    });

    it(`when comparing with a value that does not equal it's own value
      it should not equal`, () => {
      const value = 'a random value with no meaning';
      expect(mLFacetValue.equals(value)).toBe(false);
    });

    it(`when comparing with a value that equals it's own value
      it should equal`, () => {
      const value = mLFacetValue.value;
      expect(mLFacetValue.equals(value)).toBe(true);
    });

    it(`when comparing with a value that equals it's own value but with different casing
      it should equal`, () => {
      const value = mLFacetValue.value.toUpperCase();
      expect(mLFacetValue.equals(value)).toBe(true);
    });

    it(`when getting formattedCount with a non zero value
      it should return a string in the Globalize format`, () => {
      expect(mLFacetValue.formattedCount).toBe(Globalize.format(mLFacetValue.numberOfResults, 'n0'));
    });

    it(`when getting formattedCount with a zero value
      it should return an empty string`, () => {
      mLFacetValue.numberOfResults = 0;
      expect(mLFacetValue.formattedCount).toBe('');
    });

    it(`when using the valueCaption option with a function
      should bypass it and return the original value`, () => {
      options = { valueCaption: () => 'allo' };
      initializeComponent();

      expect(mLFacetValue.valueCaption).toBe(mLFacetValue.value);
    });

    it(`when using the valueCaption with an object that contains the original value
      should return the caption`, () => {
      const captionValue = 'allo';
      options = { valueCaption: { [mLFacetValue.value]: captionValue } };
      initializeComponent();

      expect(mLFacetValue.valueCaption).toBe(captionValue);
    });

    it(`when using the valueCaption with an object that does not contain the original value
      should return original value`, () => {
      options = { valueCaption: { randomValue: 'allo' } };
      initializeComponent();

      expect(mLFacetValue.valueCaption).toBe(mLFacetValue.value);
    });

    it(`should render without error`, () => {
      expect(() => mLFacetValue.render()).not.toThrow();
    });
  });
}
