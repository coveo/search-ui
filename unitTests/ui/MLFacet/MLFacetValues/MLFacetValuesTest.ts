import { MLFacetValues } from '../../../../src/ui/MLFacet/MLFacetValues/MLFacetValues';
import { IMLFacetValue } from '../../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import { MLFacet } from '../../../../src/ui/MLFacet/MLFacet';
import { MLFacetTestUtils } from '../MLFacetTestUtils';

export function MLFacetValuesTest() {
  describe('MLFacetValues', () => {
    let mLFacetValues: MLFacetValues;
    let mockFacetValues: IMLFacetValue[];
    let facet: MLFacet;

    beforeEach(() => {
      facet = MLFacetTestUtils.createFakeFacet();

      mockFacetValues = MLFacetTestUtils.createFakeFacetValues();
      mockFacetValues[1].selected = true;
      mockFacetValues[3].selected = true;

      initializeComponent();
    });

    function initializeComponent() {
      mLFacetValues = new MLFacetValues(facet);
      mLFacetValues.createFromResults(mockFacetValues);
    }

    it('should return allFacetValues correctly', () => {
      expect(mLFacetValues.allFacetValues.length).toBe(mockFacetValues.length);
      expect(mLFacetValues.allFacetValues[0].equals(mockFacetValues[0].value)).toBe(true);
    });

    it('should return allValues correctly', () => {
      expect(mLFacetValues.allValues.length).toBe(mockFacetValues.length);
      expect(mLFacetValues.allValues[0]).toBe(mockFacetValues[0].value);
    });

    it('should return selectedValues correctly', () => {
      expect(mLFacetValues.selectedValues[0]).toBe(mockFacetValues[1].value);
      expect(mLFacetValues.selectedValues[1]).toBe(mockFacetValues[3].value);
    });

    it('when there are selected values, hasSelectedValues should return true', () => {
      expect(mLFacetValues.hasSelectedValues()).toBe(true);
    });

    it('when there are no selected values, hasSelectedValues should return false', () => {
      mockFacetValues = MLFacetTestUtils.createFakeFacetValues();
      initializeComponent();
      expect(mLFacetValues.hasSelectedValues()).toBe(false);
    });

    it('when there are values, isEmpty should return false', () => {
      expect(mLFacetValues.isEmpty()).toBe(false);
    });

    it('when there are no values, isEmpty should return true', () => {
      mockFacetValues = [];
      initializeComponent();
      expect(mLFacetValues.isEmpty()).toBe(true);
    });

    it('clearAll should set all values to selected=false', () => {
      mLFacetValues.clearAll();
      expect(mLFacetValues.hasSelectedValues()).toBe(false);
    });

    it('get should return a value if it exists', () => {
      expect(mLFacetValues.get(mockFacetValues[2].value)).toBe(mLFacetValues.allFacetValues[2]);
    });

    it('get should create and return a new value if it does not exist', () => {
      const newValue = mLFacetValues.get('new value');
      expect(mLFacetValues.allFacetValues[mLFacetValues.allFacetValues.length - 1]).toBe(newValue);
    });

    it('renders without error', () => {
      expect(() => mLFacetValues.render()).not.toThrow();
    });

    it('renders the correct number of children', () => {
      const element = mLFacetValues.render();
      expect(element.childElementCount).toBe(mockFacetValues.length);
    });
  });
}
