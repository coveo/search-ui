import { DynamicFacetRangeValueCreator } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetRangeValueCreator';
import { DynamicFacetRange } from '../../../../src/ui/DynamicFacet/DynamicFacetRange';
import { DynamicFacetRangeTestUtils } from '../DynamicFacetRangeTestUtils';
import { IFacetResponseValue } from '../../../../src/rest/Facet/FacetResponse';
import { DynamicFacetValue } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';
import { RangeEndScope, IRangeValue } from '../../../../src/rest/RangeValue';

export function DynamicFacetRangeValueCreatorTest() {
  describe('DynamicFacetRangeValueCreator', () => {
    let valueCreator: DynamicFacetRangeValueCreator;
    let facet: DynamicFacetRange;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent() {
      facet = DynamicFacetRangeTestUtils.createAdvancedFakeFacet().cmp;
      valueCreator = new DynamicFacetRangeValueCreator(facet);
    }

    describe('testing createFromResponse', () => {
      let index: number;
      let responseValue: IFacetResponseValue;
      let facetValue: DynamicFacetValue;

      beforeEach(() => {
        index = 0;
        responseValue = {
          start: 10,
          end: 20,
          endInclusive: true,
          state: FacetValueState.selected,
          numberOfResults: 34
        };
        initializeValue();
      });

      function initializeValue() {
        facetValue = valueCreator.createFromResponse(responseValue, index);
      }

      it('should have the right basic properties', () => {
        expect(facetValue.start).toBe(responseValue.start);
        expect(facetValue.endInclusive).toBe(responseValue.endInclusive);
        expect(facetValue.end).toBe(responseValue.end);
        expect(facetValue.state).toBe(responseValue.state);
        expect(facetValue.position).toBe(index + 1);
        expect(facetValue.numberOfResults).toBe(responseValue.numberOfResults);
        expect(facetValue.value).toBeTruthy();
      });

      it('should have the formated displayValue from the value by default', () => {
        expect(facetValue.displayValue).toBe(`${facetValue.start} ${facet.options.valueSeparator} ${facetValue.end}`);
      });

      it(`when is was a previous corresponding facet value
      should copy it's displayValue`, () => {
        const displayValue = 'this is a display value';
        const correspondingFacetValue = facet.values.get(facetValue);
        correspondingFacetValue.displayValue = displayValue;

        initializeValue();
        expect(facetValue.displayValue).toBe(displayValue);
      });
    });

    it('when the facet does not have ranges, getDefaultValues returns an empty array', () => {
      expect(valueCreator.getDefaultValues().length).toEqual(0);
    });

    it('when the facet has multiple ranges configured, getDefaultValues returns an array with as many elements as configured ranges', () => {
      facet.options.ranges = DynamicFacetRangeTestUtils.createFakeRanges(2);
      expect(valueCreator.getDefaultValues().length).toEqual(facet.options.ranges.length);
    });

    describe('the facet has one range value, when calling getDefaultValues', () => {
      let index: number;
      let rangeValue: IRangeValue;

      function firstDefaultValue() {
        return valueCreator.getDefaultValues()[0];
      }

      function setRangeOnFacet() {
        facet.options.ranges = [rangeValue];
      }

      beforeEach(() => {
        index = 0;
        rangeValue = DynamicFacetRangeTestUtils.createFakeRanges(1)[0];
        setRangeOnFacet();
      });

      it('the default value should have the right basic properties', () => {
        const facetValue = firstDefaultValue();

        expect(facetValue.start).toBe(rangeValue.start);
        expect(facetValue.endInclusive).toBe(rangeValue.endInclusive);
        expect(facetValue.end).toBe(rangeValue.end);
        expect(facetValue.state).toBe(FacetValueState.idle);
        expect(facetValue.position).toBe(index + 1);
        expect(facetValue.numberOfResults).toBe(0);
        expect(facetValue.value).toBeTruthy();
      });

      it(`when the range does not have a label,
        should format the displayValue correctly`, () => {
        const facetValue = firstDefaultValue();
        expect(facetValue.displayValue).toBe(`${facetValue.start} ${facet.options.valueSeparator} ${facetValue.end}`);
      });

      it(`when the range has a label, 
        should assign it to the displayValue`, () => {
        rangeValue.label = 'this is a label';
        setRangeOnFacet();

        expect(firstDefaultValue().displayValue).toBe(rangeValue.label);
      });
    });

    describe('testing createFromValue', () => {
      let value = `10..20${RangeEndScope.Inclusive}`;
      let facetValue: DynamicFacetValue;

      beforeEach(() => {
        initializeValue();
      });

      function initializeValue() {
        facetValue = valueCreator.createFromValue(value);
      }

      it('should throw on a invalid format', () => {
        spyOn(facet.logger, 'error');
        valueCreator.createFromValue('notValid');
        expect(facet.logger.error).toHaveBeenCalled();
      });

      it('should return null on a invalid format', () => {
        expect(valueCreator.createFromValue('notvalid')).toBeNull();
      });

      it('should have the right position', () => {
        expect(facetValue.position).toBe(1);
      });
    });
  });
}
