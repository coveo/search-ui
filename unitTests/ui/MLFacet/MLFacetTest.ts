import * as Mock from '../../MockEnvironment';
import { MLFacet } from '../../../src/ui/MLFacet/MLFacet';
import { IMLFacetOptions } from '../../../src/ui/MLFacet/MLFacetOptions';
import { IMLFacetValue } from '../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import { MLFacetTestUtils } from './MLFacetTestUtils';

export function MLFacetTest() {
  describe('MLFacet', () => {
    let test: Mock.IBasicComponentSetup<MLFacet>;
    let mockFacetValues: IMLFacetValue[];

    beforeEach(() => {
      mockFacetValues = MLFacetTestUtils.createFakeFacetValues();
      initializeComponent();
    });

    function initializeComponent() {
      test = Mock.optionsComponentSetup<MLFacet, IMLFacetOptions>(MLFacet, <IMLFacetOptions>{
        field: '@field'
      });

      test.cmp.values.createFromResults(mockFacetValues);
    }

    it('allows to select a value', () => {
      expect(test.cmp.values.get(mockFacetValues[0].value).selected).toBe(false);

      test.cmp.selectValue(mockFacetValues[0].value);

      expect(test.cmp.values.get(mockFacetValues[0].value).selected).toBe(true);
    });

    it('allows to select a value that did not previously exist', () => {
      const newFacetValue = 'this is a brand new value';
      expect(test.cmp.values.allValues).not.toContain(newFacetValue);

      test.cmp.selectValue(newFacetValue);

      expect(test.cmp.values.get(newFacetValue).selected).toBe(true);
    });

    it('allows to select multiple values', () => {
      const selectedValues = [mockFacetValues[0].value, mockFacetValues[1].value, 'new value'];
      expect(test.cmp.values.selectedValues.length).toBe(0);

      test.cmp.selectMultipleValues(selectedValues);

      expect(test.cmp.values.selectedValues).toEqual(selectedValues);
    });

    it('allows to deselect a value', () => {
      mockFacetValues[2].selected = true;
      initializeComponent();

      test.cmp.deselectValue(mockFacetValues[2].value);

      expect(test.cmp.values.get(mockFacetValues[2].value).selected).toBe(false);
    });

    it('allows to deselect multiple values', () => {
      mockFacetValues[1].selected = true;
      mockFacetValues[3].selected = true;
      initializeComponent();

      test.cmp.deselectMultipleValues([mockFacetValues[1].value, mockFacetValues[3].value]);

      expect(test.cmp.values.selectedValues.length).toBe(0);
    });

    it('allows to toggle a value', () => {
      test.cmp.toggleSelectValue(mockFacetValues[1].value);
      expect(test.cmp.values.get(mockFacetValues[1].value).selected).toBe(true);

      test.cmp.toggleSelectValue(mockFacetValues[1].value);
      expect(test.cmp.values.get(mockFacetValues[1].value).selected).toBe(false);

      test.cmp.toggleSelectValue(mockFacetValues[1].value);
      expect(test.cmp.values.get(mockFacetValues[1].value).selected).toBe(true);
    });

    /**
     * reset
     * triggerNewQuery
     */

    /**
     * test with live querystatemodel
     */

    /**
     * test options
     */
  });
}
