import { DynamicFacetValues } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValues';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';
import { IDynamicFacetValue } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { DynamicRangeFacetValueCreator } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicRangeFacetValueCreator';
import { DynamicFacet } from '../../../../src/ui/DynamicFacet/DynamicFacet';
import { DynamicFacetTestUtils } from '../DynamicFacetTestUtils';
import { $$ } from '../../../../src/Core';
import { DynamicRangeFacetTestUtils } from '../DynamicRangeFacetTestUtils';

export function DynamicFacetValuesTest() {
  describe('DynamicFacetValues', () => {
    const valueCount = 8;
    let dynamicFacetValues: DynamicFacetValues;
    let mockFacetValues: IDynamicFacetValue[];
    let facet: DynamicFacet;

    beforeEach(() => {
      facet = DynamicFacetTestUtils.createFakeFacet({ numberOfValues: valueCount, enableMoreLess: true });

      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(valueCount);
      mockFacetValues[1].state = FacetValueState.selected;
      mockFacetValues[3].state = FacetValueState.selected;

      initializeComponent();
    });

    function initializeComponent() {
      dynamicFacetValues = new DynamicFacetValues(facet);
      createValuesFromResponse();
    }

    function createValuesFromResponse() {
      dynamicFacetValues.createFromResponse(DynamicFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));
    }

    function createValuesFromRanges() {
      dynamicFacetValues = new DynamicFacetValues(facet, DynamicRangeFacetValueCreator);
      dynamicFacetValues.createFromRanges(DynamicRangeFacetTestUtils.createFakeRanges(valueCount));
    }

    function moreButton() {
      const element = dynamicFacetValues.render();
      return $$(element).find('.coveo-dynamic-facet-show-more');
    }

    function lessButton() {
      const element = dynamicFacetValues.render();
      return $$(element).find('.coveo-dynamic-facet-show-less');
    }

    it('should return allFacetValues correctly', () => {
      expect(dynamicFacetValues.allFacetValues.length).toBe(mockFacetValues.length);
      expect(dynamicFacetValues.allFacetValues[0].equals(mockFacetValues[0].value)).toBe(true);
    });

    it('should return allValues correctly', () => {
      expect(dynamicFacetValues.allValues.length).toBe(mockFacetValues.length);
      expect(dynamicFacetValues.allValues[0]).toBe(mockFacetValues[0].value);
    });

    it('should return selectedValues correctly', () => {
      expect(dynamicFacetValues.selectedValues[0]).toBe(mockFacetValues[1].value);
      expect(dynamicFacetValues.selectedValues[1]).toBe(mockFacetValues[3].value);
    });

    it('should return activeFacetValues correctly', () => {
      expect(dynamicFacetValues.activeFacetValues[0].value).toBe(mockFacetValues[1].value);
      expect(dynamicFacetValues.activeFacetValues[1].value).toBe(mockFacetValues[3].value);
    });

    it('when there are selected values, hasSelectedValues should return true', () => {
      expect(dynamicFacetValues.hasSelectedValues).toBe(true);
    });

    it('when there are selected values, hasActiveValues should return true', () => {
      expect(dynamicFacetValues.hasActiveValues).toBe(true);
    });

    it('when there are no selected values, hasSelectedValues should return false', () => {
      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues();
      initializeComponent();
      expect(dynamicFacetValues.hasSelectedValues).toBe(false);
    });

    it('when there are no selected values, hasActiveValues should return false', () => {
      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues();
      initializeComponent();
      expect(dynamicFacetValues.hasActiveValues).toBe(false);
    });

    it('when there are idle values, hasIdleValues should return true', () => {
      expect(dynamicFacetValues.hasIdleValues).toBe(true);
    });

    it('when there are no idle values, hasIdleValues should return false', () => {
      mockFacetValues.forEach(mockFacetValue => (mockFacetValue.state = FacetValueState.selected));
      initializeComponent();

      expect(dynamicFacetValues.hasIdleValues).toBe(false);
    });

    it('when there are values, isEmpty should return false', () => {
      expect(dynamicFacetValues.isEmpty).toBe(false);
    });

    it('when there are no values, isEmpty should return true', () => {
      mockFacetValues = [];
      initializeComponent();
      expect(dynamicFacetValues.isEmpty).toBe(true);
    });

    it('clearAll should set all values to selected=false', () => {
      dynamicFacetValues.clearAll();
      expect(dynamicFacetValues.hasSelectedValues).toBe(false);
    });

    it('get should return a value if it exists', () => {
      expect(dynamicFacetValues.get(mockFacetValues[2].value)).toBe(dynamicFacetValues.allFacetValues[2]);
    });

    it('get should create and return a new value if it does not exist', () => {
      const newValue = dynamicFacetValues.get('new value');
      expect(dynamicFacetValues.allFacetValues[dynamicFacetValues.allFacetValues.length - 1]).toBe(newValue);
    });

    it('renders without error', () => {
      expect(() => dynamicFacetValues.render()).not.toThrow();
    });

    it('renders the correct number of children', () => {
      const element = dynamicFacetValues.render();
      expect(element.childElementCount).toBe(mockFacetValues.length);
    });

    it(`when moreValuesAvailable is false
      should not render the "Show more" button`, () => {
      expect(moreButton()).toBeFalsy();
    });

    it(`should reset the values correctly`, () => {
      dynamicFacetValues.resetValues();
      expect(dynamicFacetValues.allFacetValues.length).toBe(0);
    });

    describe('when moreValuesAvailable is true', () => {
      beforeEach(() => {
        facet.moreValuesAvailable = true;
        createValuesFromResponse();
      });

      it(`should render the "Show more" button`, () => {
        expect(moreButton()).toBeTruthy();
      });

      it(`when clicking on the "Show more" button
        should perform the correct actions on the facet`, () => {
        $$(moreButton()).trigger('click');
        expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalledTimes(1);
        expect(facet.showMoreValues).toHaveBeenCalledTimes(1);
      });
    });

    it(`when there are less or an equal number of values as the numberOfValues option
      should not render the "Show less" button`, () => {
      expect(lessButton()).toBeFalsy();
    });

    describe('when there are more values than the numberOfValues option', () => {
      beforeEach(() => {
        mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(10);
        createValuesFromResponse();
      });

      it(`should render the "Show less" button`, () => {
        expect(lessButton()).toBeTruthy();
      });

      it(`when clicking on the "Show more" button
        should perform the correct actions on the facet`, () => {
        $$(lessButton()).trigger('click');
        expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalledTimes(1);
        expect(facet.showLessValues).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the facet option enableMoreLess is false', () => {
      beforeEach(() => {
        facet = DynamicFacetTestUtils.createFakeFacet({ numberOfValues: 5, enableMoreLess: false });
        initializeComponent();
      });

      it(`when moreValuesAvailable is true
      should not render the "Show less" button`, () => {
        facet.moreValuesAvailable = true;

        createValuesFromResponse();
        expect(moreButton()).toBeFalsy();
      });

      it(`when there are more values than the option "numberOfValues"
      should not render the "Show less" button`, () => {
        mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(facet.options.numberOfValues * 3);
        createValuesFromResponse();

        expect(lessButton()).toBeFalsy();
      });
    });

    it(`when calling createValuesFromResponse
    it should create the values correctly`, () => {
      createValuesFromResponse();
      expect(dynamicFacetValues.allFacetValues.length).toBe(valueCount);
    });

    it(`when calling createValuesFromRanges
    it should create the values correctly`, () => {
      createValuesFromRanges();
      expect(dynamicFacetValues.allFacetValues.length).toBe(valueCount);
    });
  });
}
