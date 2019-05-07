import { MLFacetValues } from '../../../../src/ui/MLFacet/MLFacetValues/MLFacetValues';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';
import { IMLFacetValue } from '../../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import { MLFacet } from '../../../../src/ui/MLFacet/MLFacet';
import { MLFacetTestUtils } from '../MLFacetTestUtils';
import { $$ } from '../../../../src/Core';

export function MLFacetValuesTest() {
  describe('MLFacetValues', () => {
    let mLFacetValues: MLFacetValues;
    let mockFacetValues: IMLFacetValue[];
    let facet: MLFacet;

    beforeEach(() => {
      facet = MLFacetTestUtils.createFakeFacet({ numberOfValues: 5 });

      mockFacetValues = MLFacetTestUtils.createFakeFacetValues();
      mockFacetValues[1].state = FacetValueState.selected;
      mockFacetValues[3].state = FacetValueState.selected;

      initializeComponent();
    });

    function initializeComponent() {
      mLFacetValues = new MLFacetValues(facet);
      mLFacetValues.createFromResponse(MLFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));
    }

    function moreButton() {
      const element = mLFacetValues.render();
      return $$(element).find('.coveo-ml-facet-show-more');
    }

    function lessButton() {
      const element = mLFacetValues.render();
      return $$(element).find('.coveo-ml-facet-show-less');
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

    it('should return activeFacetValues correctly', () => {
      expect(mLFacetValues.activeFacetValues[0].value).toBe(mockFacetValues[1].value);
      expect(mLFacetValues.activeFacetValues[1].value).toBe(mockFacetValues[3].value);
    });

    it('when there are selected values, hasSelectedValues should return true', () => {
      expect(mLFacetValues.hasSelectedValues).toBe(true);
    });

    it('when there are selected values, hasActiveValues should return true', () => {
      expect(mLFacetValues.hasActiveValues).toBe(true);
    });

    it('when there are no selected values, hasSelectedValues should return false', () => {
      mockFacetValues = MLFacetTestUtils.createFakeFacetValues();
      initializeComponent();
      expect(mLFacetValues.hasSelectedValues).toBe(false);
    });

    it('when there are no selected values, hasActiveValues should return false', () => {
      mockFacetValues = MLFacetTestUtils.createFakeFacetValues();
      initializeComponent();
      expect(mLFacetValues.hasActiveValues).toBe(false);
    });

    it('when there are idle values, hasIdleValues should return true', () => {
      expect(mLFacetValues.hasIdleValues).toBe(true);
    });

    it('when there are no idle values, hasIdleValues should return false', () => {
      mockFacetValues.forEach(mockFacetValue => (mockFacetValue.state = FacetValueState.selected));
      initializeComponent();

      expect(mLFacetValues.hasIdleValues).toBe(false);
    });

    it('when there are values, isEmpty should return false', () => {
      expect(mLFacetValues.isEmpty).toBe(false);
    });

    it('when there are no values, isEmpty should return true', () => {
      mockFacetValues = [];
      initializeComponent();
      expect(mLFacetValues.isEmpty).toBe(true);
    });

    it('clearAll should set all values to selected=false', () => {
      mLFacetValues.clearAll();
      expect(mLFacetValues.hasSelectedValues).toBe(false);
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

    it(`when moreValuesAvailable is false
      should not render the "Show more" button`, () => {
      expect(moreButton()).toBeFalsy();
    });

    it(`should reset the values correctly`, () => {
      mLFacetValues.resetValues();
      expect(mLFacetValues.allFacetValues.length).toBe(0);
    });

    it(`when moreValuesAvailable is true
      should render the "Show more" button`, () => {
      mLFacetValues.createFromResponse(
        MLFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues, moreValuesAvailable: true })
      );
      expect(moreButton()).toBeTruthy();
    });

    it(`when there are less or an equal number of values as the numberOfValues option
      should not render the "Show less" button`, () => {
      expect(lessButton()).toBeFalsy();
    });

    it(`when there are more values than the numberOfValues option
      should render the "Show less" button`, () => {
      mockFacetValues = MLFacetTestUtils.createFakeFacetValues(10);
      mLFacetValues.createFromResponse(MLFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));
      expect(lessButton()).toBeTruthy();
    });
  });
}
