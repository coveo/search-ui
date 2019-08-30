import { DynamicRangeFacetValueCreator } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicRangeFacetValueCreator';
import { DynamicRangeFacet } from '../../../../src/ui/DynamicFacet/DynamicRangeFacet';
import { DynamicRangeFacetTestUtils } from '../DynamicRangeFacetTestUtils';
import { IFacetResponseValue } from '../../../../src/rest/Facet/FacetResponse';
import { DynamicFacetValue } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { FacetValueState } from '../../../../src/rest/Facet/FacetValueState';
import { RangeEndScope } from '../../../../src/rest/RangeValue';
// import { FacetUtils } from '../../../../src/ui/Facet/FacetUtils';

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
  });
}
