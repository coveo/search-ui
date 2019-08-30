import { DynamicRangeFacetValueCreator } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicRangeFacetValueCreator';
import { DynamicRangeFacet } from '../../../../src/ui/DynamicFacet/DynamicRangeFacet';
import { DynamicRangeFacetTestUtils } from '../DynamicRangeFacetTestUtils';
import { IFacetResponseValue } from '../../../../src/rest/Facet/FacetResponse';
import { DynamicFacetValue } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';
import { RangeEndScope, IRangeValue } from '../../../../src/rest/RangeValue';

export function DynamicRangeFacetValueCreatorTest() {
  describe('DynamicRangeFacetValueCreator', () => {
    let valueCreator: DynamicRangeFacetValueCreator;
    let facet: DynamicRangeFacet;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent() {
      facet = DynamicRangeFacetTestUtils.createFakeFacet();
      valueCreator = new DynamicRangeFacetValueCreator(facet);
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
      });

      it(`when the endInclusive is true
      should format the value from the range properly`, () => {
        expect(facetValue.value).toBe(`${responseValue.start}..${responseValue.end}${RangeEndScope.Inclusive}`);
      });

      it(`when the endInclusive is false
      should format the value from the range properly`, () => {
        responseValue.endInclusive = false;
        initializeValue();
        expect(facetValue.value).toBe(`${responseValue.start}..${responseValue.end}${RangeEndScope.Exclusive}`);
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

    describe('testing createFromRanges', () => {
      let index: number;
      let rangeValue: IRangeValue;
      let facetValue: DynamicFacetValue;

      beforeEach(() => {
        index = 0;
        rangeValue = DynamicRangeFacetTestUtils.createFakeRanges(1)[0];
        initializeValue();
      });

      function initializeValue() {
        facetValue = valueCreator.createFromRange(rangeValue, index);
      }

      it('should have the right basic properties', () => {
        expect(facetValue.start).toBe(rangeValue.start);
        expect(facetValue.endInclusive).toBe(rangeValue.endInclusive);
        expect(facetValue.end).toBe(rangeValue.end);
        expect(facetValue.state).toBe(FacetValueState.idle);
        expect(facetValue.position).toBe(index + 1);
        expect(facetValue.numberOfResults).toBe(0);
      });

      it(`when the endInclusive is false
      should format the value from the range properly`, () => {
        expect(facetValue.value).toBe(`${facetValue.start}..${facetValue.end}${RangeEndScope.Exclusive}`);
      });

      it(`when the endInclusive is true
      should format the value from the range properly`, () => {
        rangeValue.endInclusive = true;
        initializeValue();
        expect(facetValue.value).toBe(`${facetValue.start}..${facetValue.end}${RangeEndScope.Inclusive}`);
      });

      it(`when there is no label 
        should format the displayValue correctly`, () => {
        expect(facetValue.displayValue).toBe(`${facetValue.start} ${facet.options.valueSeparator} ${facetValue.end}`);
      });

      it(`when there is no label 
        should assign it to the displayValue`, () => {
        const label = 'this is a label';
        rangeValue.label = label;
        initializeValue();
        expect(facetValue.displayValue).toBe(label);
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
        expect(() => valueCreator.createFromValue('allo')).toThrowError();
        expect(() => valueCreator.createFromValue('1..1000')).toThrowError();
      });

      it('should extract the start correctly when it is a integer', () => {
        expect(facetValue.start).toBe(10);
      });

      it('should extract the start correctly when it is a double', () => {
        value = `10.5..20${RangeEndScope.Inclusive}`;
        initializeValue();
        expect(facetValue.start).toBe(10.5);
      });

      it('should extract the end correctly when it is a integer', () => {
        expect(facetValue.end).toBe(20);
      });

      it('should extract the end correctly when it is a double', () => {
        value = `10..20.1${RangeEndScope.Inclusive}`;
        initializeValue();
        expect(facetValue.end).toBe(20.1);
      });

      it('should extract the endInclusive correctly "Inclusive"', () => {
        expect(facetValue.endInclusive).toBe(true);
      });

      it('should extract the endInclusive correctly "Exclusive"', () => {
        value = `10..20${RangeEndScope.Exclusive}`;
        initializeValue();
        expect(facetValue.endInclusive).toBe(false);
      });
    });
  });
}
