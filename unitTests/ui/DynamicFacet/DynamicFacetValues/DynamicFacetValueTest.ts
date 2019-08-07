import * as Globalize from 'globalize';
import { DynamicFacetValue } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { DynamicFacetTestUtils } from '../DynamicFacetTestUtils';
import { DynamicFacet, IDynamicFacetOptions } from '../../../../src/ui/DynamicFacet/DynamicFacet';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';
import { analyticsActionCauseList } from '../../../../src/ui/Analytics/AnalyticsActionListMeta';

export function DynamicFacetValueTest() {
  describe('DynamicFacetValue', () => {
    let dynamicFacetValue: DynamicFacetValue;
    let facet: DynamicFacet;
    let options: IDynamicFacetOptions;

    beforeEach(() => {
      options = undefined;
      initializeComponent();
    });

    function initializeComponent() {
      facet = DynamicFacetTestUtils.createFakeFacet(options);
      (facet.searchInterface.getComponents as jasmine.Spy).and.returnValue([facet]);
      dynamicFacetValue = new DynamicFacetValue(DynamicFacetTestUtils.createFakeFacetValues(1)[0], facet);
    }

    it('should toggle selection correctly', () => {
      dynamicFacetValue.toggleSelect();
      expect(dynamicFacetValue.isSelected).toBe(true);
      dynamicFacetValue.toggleSelect();
      expect(dynamicFacetValue.isSelected).toBe(false);
    });

    it('should be idle by default', () => {
      expect(dynamicFacetValue.isIdle).toBe(true);
    });

    it('should select correctly', () => {
      dynamicFacetValue.select();
      expect(dynamicFacetValue.isSelected).toBe(true);
    });

    it('should deselect correctly', () => {
      dynamicFacetValue.state = FacetValueState.selected;
      dynamicFacetValue.deselect();
      expect(dynamicFacetValue.isSelected).toBe(false);
    });

    it('should be idle when deselected', () => {
      dynamicFacetValue.state = FacetValueState.selected;
      dynamicFacetValue.deselect();
      expect(dynamicFacetValue.isIdle).toBe(true);
    });

    it(`when comparing with another DynamicFacetValue with a different value
      it should not equal`, () => {
      const anotherDynamicFacetValue = new DynamicFacetValue(DynamicFacetTestUtils.createFakeFacetValues(2)[1], facet);
      expect(dynamicFacetValue.equals(anotherDynamicFacetValue)).toBe(false);
    });

    it(`when comparing with another DynamicFacetValue with the same value
      it should equal`, () => {
      const anotherDynamicFacetValue = new DynamicFacetValue(DynamicFacetTestUtils.createFakeFacetValues(1)[0], facet);
      expect(dynamicFacetValue.equals(anotherDynamicFacetValue)).toBe(true);
    });

    it(`when comparing with a value that does not equal it's own value
      it should not equal`, () => {
      const value = 'a random value with no meaning';
      expect(dynamicFacetValue.equals(value)).toBe(false);
    });

    it(`when comparing with a value that equals it's own value
      it should equal`, () => {
      const value = dynamicFacetValue.value;
      expect(dynamicFacetValue.equals(value)).toBe(true);
    });

    it(`when comparing with a value that equals it's own value but with different casing
      it should equal`, () => {
      const value = dynamicFacetValue.value.toUpperCase();
      expect(dynamicFacetValue.equals(value)).toBe(true);
    });

    it(`when getting formattedCount
      it should return a string in the Globalize format`, () => {
      expect(dynamicFacetValue.formattedCount).toBe(Globalize.format(dynamicFacetValue.numberOfResults, 'n0'));
    });

    it(`when using the valueCaption option with a function
      should bypass it and return the original value`, () => {
      options = { valueCaption: () => 'allo' };
      initializeComponent();

      expect(dynamicFacetValue.valueCaption).toBe(dynamicFacetValue.value);
    });

    it(`when using the valueCaption with an object that contains the original value
      should return the caption`, () => {
      const captionValue = 'allo';
      options = { valueCaption: { [dynamicFacetValue.value]: captionValue } };
      initializeComponent();

      expect(dynamicFacetValue.valueCaption).toBe(captionValue);
    });

    it(`when a display value isn't specified
      when there is no valueCaption
      should return the value as display value`, () => {
      expect(dynamicFacetValue.displayValue).toBe(dynamicFacetValue.value);
    });

    it(`when a display value is specified
      when using the valueCaption with an object that contains the original value
      should still return the original display value`, () => {
      const displayValue = 'display value';
      options = { valueCaption: { [dynamicFacetValue.value]: 'value caption' } };
      initializeComponent();
      const mockValue = DynamicFacetTestUtils.createFakeFacetValues(1)[0];
      dynamicFacetValue = new DynamicFacetValue({ ...mockValue, displayValue }, facet);

      expect(dynamicFacetValue.displayValue).toBe(displayValue);
    });

    it(`when a display value is not specified
      when using the valueCaption with an object that contains the original value
      should return the valueCaption as display value`, () => {
      const valueCaption = 'value caption';
      options = { valueCaption: { [dynamicFacetValue.value]: valueCaption } };
      initializeComponent();

      expect(dynamicFacetValue.displayValue).toBe(valueCaption);
    });

    it(`when using the valueCaption with an object that does not contain the original value
      should return original value`, () => {
      options = { valueCaption: { randomValue: 'allo' } };
      initializeComponent();

      expect(dynamicFacetValue.valueCaption).toBe(dynamicFacetValue.value);
    });

    it(`should return the correct analyticsMeta`, () => {
      expect(dynamicFacetValue.analyticsMeta).toEqual({
        ...facet.basicAnalyticsFacetState,
        value: dynamicFacetValue.value,
        valuePosition: dynamicFacetValue.position,
        displayValue: dynamicFacetValue.displayValue,
        state: dynamicFacetValue.state
      });
    });

    describe('when the value has the state "idle"', () => {
      it('should return the correct aria-label', () => {
        const expectedAriaLabel = `Select ${dynamicFacetValue.value} with ${dynamicFacetValue.formattedCount} results`;
        expect(dynamicFacetValue.selectAriaLabel).toBe(expectedAriaLabel);
      });

      it('should log the right analytics action', () => {
        dynamicFacetValue.logSelectActionToAnalytics();
        expect(facet.logAnalyticsEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.dynamicFacetDeselect,
          dynamicFacetValue.analyticsMeta
        );
      });
    });

    describe('when the value has the state "selected"', () => {
      beforeEach(() => {
        dynamicFacetValue.select();
      });

      it('should return the correct aria-label', () => {
        const expectedAriaLabel = `Unselect ${dynamicFacetValue.value} with ${dynamicFacetValue.formattedCount} results`;
        expect(dynamicFacetValue.selectAriaLabel).toBe(expectedAriaLabel);
      });

      it('should log the right analytics action', () => {
        dynamicFacetValue.logSelectActionToAnalytics();
        expect(facet.logAnalyticsEvent).toHaveBeenCalledWith(analyticsActionCauseList.dynamicFacetSelect, dynamicFacetValue.analyticsMeta);
      });
    });

    it(`should render without error`, () => {
      expect(() => dynamicFacetValue.renderedElement).not.toThrow();
    });
  });
}
