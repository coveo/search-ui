import { DynamicRangeFacetValueUtils } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicRangeFacetValueUtils';
import { DynamicRangeFacetValueFormat } from '../../../../src/ui/DynamicFacet/DynamicRangeFacet';

export function DynamicRangeFacetValueUtilsTest() {
  describe('DynamicRangeFacetValueUtils', () => {
    describe('testing formatValue with the number format', () => {
      it(`when the value a integer
        should return the format correctly`, () => {
        const value = DynamicRangeFacetValueUtils.formatValue(10, DynamicRangeFacetValueFormat.number);
        expect(value).toBe('10');
      });

      it(`when the value a big integer
        should return the format correctly`, () => {
        const value = DynamicRangeFacetValueUtils.formatValue(1000, DynamicRangeFacetValueFormat.number);
        expect(value).toBe('1,000');
      });

      it(`when the value a float
        should return the format correctly`, () => {
        const value = DynamicRangeFacetValueUtils.formatValue(1.001, DynamicRangeFacetValueFormat.number);
        expect(value).toBe('1.001');
      });
    });

    it('should return formatRangeValue correctly', () => {
      const value = DynamicRangeFacetValueUtils.formatRangeValue({ start: 0, end: 10 }, DynamicRangeFacetValueFormat.number, 'to');

      expect(value).toBe('0 to 10');
    });

    describe(`testing validateRange`, () => {
      it(`when sending a valid range
      should return it correctly parsed`, () => {
        const validatedRange = DynamicRangeFacetValueUtils.validateRange(
          {
            start: '0.1',
            end: 10,
            endInclusive: true
          },
          DynamicRangeFacetValueFormat.number
        );

        expect(validatedRange).toEqual({
          start: 0.1,
          end: 10,
          endInclusive: true
        });
      });

      it(`when sending a invalid range
      should return null`, () => {
        const validatedRange = DynamicRangeFacetValueUtils.validateRange(
          {
            start: 'yes',
            end: 10,
            endInclusive: true
          },
          DynamicRangeFacetValueFormat.number
        );

        expect(validatedRange).toBeNull();
      });
    });

    it('should return valueFromRange correctly', () => {
      const value = DynamicRangeFacetValueUtils.valueFromRange({ start: 0.0191, end: 100000, endInclusive: true });
      expect(value).toBe('0.0191..100000inc');
    });

    describe(`testing rangeFromValue`, () => {
      it(`when sending a valid value
      should return the range correctly`, () => {
        const range = DynamicRangeFacetValueUtils.rangeFromValue('0.1..10exc', DynamicRangeFacetValueFormat.number);

        expect(range).toEqual({
          start: 0.1,
          end: 10,
          endInclusive: false
        });
      });

      it(`when sending a value with a wrong range
      should return null`, () => {
        const range = DynamicRangeFacetValueUtils.rangeFromValue('hello..10inc', DynamicRangeFacetValueFormat.number);
        expect(range).toBeNull();
      });

      it(`when sending a value with an unknown endInclusive value
      should return null`, () => {
        const range = DynamicRangeFacetValueUtils.rangeFromValue('1..100ish', DynamicRangeFacetValueFormat.number);
        expect(range).toBeNull();
      });
    });
  });
}
