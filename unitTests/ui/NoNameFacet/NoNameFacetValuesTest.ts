import { NoNameFacetValues } from '../../../src/ui/NoNameFacet/NoNameFacetValues/NoNameFacetValues';
import { INoNameFacetValue } from '../../../src/ui/NoNameFacet/NoNameFacetValues/NoNameFacetValue';
import { NoNameFacet } from '../../../src/ui/NoNameFacet/NoNameFacet';
import { NoNameFacetTestUtils } from './NoNameFacetTestUtils';

export function NoNameFacetValuesTest() {
  describe('NoNameFacetValues', () => {
    let noNameFacetValues: NoNameFacetValues;
    let mockFacetValues: INoNameFacetValue[];
    let facet: NoNameFacet;

    beforeEach(() => {
      facet = NoNameFacetTestUtils.createFakeFacet();

      mockFacetValues = NoNameFacetTestUtils.createFakeFacetValues();
      mockFacetValues[1].selected = true;
      mockFacetValues[3].selected = true;

      initializeComponent();
    });

    function initializeComponent() {
      noNameFacetValues = new NoNameFacetValues(facet);
      noNameFacetValues.createFromResults(mockFacetValues);
    }

    it('should return allFacetValues correctly', () => {
      expect(noNameFacetValues.allFacetValues.length).toBe(mockFacetValues.length);
      expect(noNameFacetValues.allFacetValues[0].equals(mockFacetValues[0].value)).toBe(true);
    });

    it('should return allValues correctly', () => {
      expect(noNameFacetValues.allValues.length).toBe(mockFacetValues.length);
      expect(noNameFacetValues.allValues[0]).toBe(mockFacetValues[0].value);
    });

    it('should return selectedValues correctly', () => {
      expect(noNameFacetValues.selectedValues[0]).toBe(mockFacetValues[1].value);
      expect(noNameFacetValues.selectedValues[1]).toBe(mockFacetValues[3].value);
    });

    it('when there are selected values, hasSelectedValues should return true', () => {
      expect(noNameFacetValues.hasSelectedValues()).toBe(true);
    });

    it('when there are no selected values, hasSelectedValues should return false', () => {
      mockFacetValues = [
        {
          value: 'test 1',
          numberOfResults: 10,
          selected: false
        }
      ];
      initializeComponent();
      expect(noNameFacetValues.hasSelectedValues()).toBe(false);
    });

    it('when there are values, isEmpty should return false', () => {
      expect(noNameFacetValues.isEmpty()).toBe(false);
    });

    it('when there are no values, isEmpty should return true', () => {
      mockFacetValues = [];
      initializeComponent();
      expect(noNameFacetValues.isEmpty()).toBe(true);
    });

    it('clearAll should set all values to selected=false', () => {
      noNameFacetValues.clearAll();
      expect(noNameFacetValues.hasSelectedValues()).toBe(false);
    });

    it('get should return a value if it exists', () => {
      expect(noNameFacetValues.get(mockFacetValues[2].value)).toBe(noNameFacetValues.allFacetValues[2]);
    });

    it('get should create and return a new value if it does not exist', () => {
      const newValue = noNameFacetValues.get('new value');
      expect(noNameFacetValues.allFacetValues[noNameFacetValues.allFacetValues.length - 1]).toBe(newValue);
    });

    it('renders without error', () => {
      expect(() => noNameFacetValues.render()).not.toThrow();
    });

    it('renders the correct number of children', () => {
      const element = noNameFacetValues.render();
      expect(element.childElementCount).toBe(mockFacetValues.length);
    });
  });
}
