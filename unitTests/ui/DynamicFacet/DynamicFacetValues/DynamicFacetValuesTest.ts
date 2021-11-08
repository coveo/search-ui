import { DynamicFacetValues } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValues';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';
import { IDynamicFacetValueProperties } from '../../../../src/ui/DynamicFacet/IDynamicFacet';
import { DynamicFacet } from '../../../../src/ui/DynamicFacet/DynamicFacet';
import { DynamicFacetTestUtils } from '../DynamicFacetTestUtils';
import { $$ } from '../../../../src/Core';
import { DynamicFacetValueCreator } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValueCreator';

export function DynamicFacetValuesTest() {
  describe('DynamicFacetValues', () => {
    const valueCount = 8;
    let dynamicFacetValues: DynamicFacetValues;
    let mockFacetValues: IDynamicFacetValueProperties[];
    let facet: DynamicFacet;

    beforeEach(() => {
      facet = DynamicFacetTestUtils.createFakeFacet({ numberOfValues: valueCount, enableMoreLess: true });

      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(valueCount);
      mockFacetValues[1].state = FacetValueState.selected;
      mockFacetValues[3].state = FacetValueState.selected;

      initializeComponent();
    });

    function initializeComponent() {
      dynamicFacetValues = new DynamicFacetValues(facet, DynamicFacetValueCreator);
      createValuesFromResponse();
    }

    function createValuesFromResponse() {
      dynamicFacetValues.createFromResponse(DynamicFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));
    }

    function facetValueList() {
      return dynamicFacetValues.render();
    }

    function moreButton() {
      const element = dynamicFacetValues.render();
      return $$(element).find('.coveo-dynamic-facet-show-more');
    }

    function lessButton() {
      const element = dynamicFacetValues.render();
      return $$(element).find('.coveo-dynamic-facet-show-less');
    }

    function values() {
      const element = dynamicFacetValues.render();
      return $$(element).findAll('.coveo-dynamic-facet-value');
    }

    function selectedCollapsedValues() {
      const element = dynamicFacetValues.render();
      return $$(element).find('.coveo-dynamic-facet-collapsed-values');
    }

    it('the facet value list element has an aria-labelledby', () => {
      const list = facetValueList();
      expect($$(list).getAttribute('aria-labelledby')).toBe(`${facet.options.id}-facet-heading`);
    });

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
      expect(dynamicFacetValues.activeValues[0].value).toBe(mockFacetValues[1].value);
      expect(dynamicFacetValues.activeValues[1].value).toBe(mockFacetValues[3].value);
    });

    it('when there are selected values, hasSelectedValues should return true', () => {
      expect(dynamicFacetValues.hasSelectedValues).toBe(true);
    });

    it('when there are selected values, hasActiveValues should return true', () => {
      expect(dynamicFacetValues.hasActiveValues).toBe(true);
    });

    it('when there are selected values, it should append an element for collapsed selected values', () => {
      expect(selectedCollapsedValues()).toBeTruthy();
      expect(selectedCollapsedValues().textContent).toBe(dynamicFacetValues.selectedValues.join(', '));
    });

    it('when a selected facet value contains XSS, it escapes the XSS value rendered in collapsed mode', () => {
      const facetValueWithXSS = DynamicFacetTestUtils.createFakeFacetValue({
        value: '<img src=x onerror=alert(1)>',
        state: FacetValueState.selected
      });

      mockFacetValues = [facetValueWithXSS];
      initializeComponent();

      expect(selectedCollapsedValues().textContent).toBe(facetValueWithXSS.value);
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

    it('when there are selected values, it should not append an element for collapsed selected values', () => {
      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues();
      initializeComponent();
      expect(selectedCollapsedValues()).toBeFalsy();
    });

    it('when there are idle values, hasIdleValues should return true', () => {
      expect(dynamicFacetValues.hasIdleValues).toBe(true);
    });

    it('when there are no idle values, hasIdleValues should return false', () => {
      mockFacetValues.forEach(mockFacetValue => (mockFacetValue.state = FacetValueState.selected));
      initializeComponent();

      expect(dynamicFacetValues.hasIdleValues).toBe(false);
    });

    it('when there are values (non empty or active), hasDisplayedValues should return true', () => {
      expect(dynamicFacetValues.hasDisplayedValues).toBe(true);
    });

    it('when there are only idle values with no results, hasDisplayedValues should return false', () => {
      const idleValueWithoutResult = mockFacetValues[0];
      idleValueWithoutResult.state = FacetValueState.idle;
      idleValueWithoutResult.numberOfResults = 0;
      mockFacetValues = [idleValueWithoutResult];
      initializeComponent();

      expect(dynamicFacetValues.hasDisplayedValues).toBe(false);
    });

    it('when there are no values, hasDisplayedValues should return false', () => {
      mockFacetValues = [];
      initializeComponent();
      expect(dynamicFacetValues.hasDisplayedValues).toBe(false);
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

    it('renders the correct number of values', () => {
      expect(values().length).toBe(mockFacetValues.length);
    });

    it('does not renders values that are idle and without result', () => {
      mockFacetValues[0].numberOfResults = 0;
      initializeComponent();

      expect(values().length).toBe(mockFacetValues.length - 1);
    });

    it(`when moreValuesAvailable is false
      should not render the "Show more" button`, () => {
      expect(moreButton()).toBeFalsy();
    });

    it(`should reset the values correctly`, () => {
      dynamicFacetValues.resetValues();
      expect(dynamicFacetValues.allFacetValues.length).toBe(0);
    });

    it('should reorder values correctly', () => {
      dynamicFacetValues.reorderValues([
        'does not exist',
        mockFacetValues[6].value,
        mockFacetValues[3].value,
        mockFacetValues[2].value,
        'also does not exist'
      ]);
      expect(dynamicFacetValues.allValues).toEqual([
        mockFacetValues[6].value,
        mockFacetValues[3].value,
        mockFacetValues[2].value,
        mockFacetValues[0].value,
        mockFacetValues[1].value,
        mockFacetValues[4].value,
        mockFacetValues[5].value,
        mockFacetValues[7].value
      ]);
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
  });
}
