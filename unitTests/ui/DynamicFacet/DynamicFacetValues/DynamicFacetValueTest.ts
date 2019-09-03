import * as Globalize from 'globalize';
import { DynamicFacetValue } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { DynamicFacetTestUtils } from '../DynamicFacetTestUtils';
import { DynamicRangeFacetTestUtils } from '../DynamicRangeFacetTestUtils';
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
      facet = DynamicFacetTestUtils.createAdvancedFakeFacet(options).cmp;
      (facet.searchInterface.getComponents as jasmine.Spy).and.returnValue([facet]);
      dynamicFacetValue = new DynamicFacetValue(DynamicFacetTestUtils.createFakeFacetValues(1)[0], facet);
      spyOn(facet, 'logAnalyticsEvent');
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

    it(`should return the correct analyticsMeta for a specific value`, () => {
      expect(dynamicFacetValue.analyticsMeta).toEqual({
        ...facet.basicAnalyticsFacetState,
        value: dynamicFacetValue.value,
        valuePosition: dynamicFacetValue.position,
        displayValue: dynamicFacetValue.displayValue,
        state: dynamicFacetValue.state
      });
    });

    it(`should return the correct analyticsMeta for a range value`, () => {
      const rangeFacet = DynamicRangeFacetTestUtils.createFakeFacet();
      rangeFacet.values.createFromRanges(DynamicRangeFacetTestUtils.createFakeRanges());
      dynamicFacetValue = rangeFacet.values.allFacetValues[0];

      expect(dynamicFacetValue.analyticsMeta).toEqual({
        ...rangeFacet.basicAnalyticsFacetState,
        value: dynamicFacetValue.value,
        valuePosition: dynamicFacetValue.position,
        displayValue: dynamicFacetValue.displayValue,
        state: dynamicFacetValue.state,
        start: dynamicFacetValue.start,
        end: dynamicFacetValue.end,
        endInclusive: dynamicFacetValue.endInclusive
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
