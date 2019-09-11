import { DynamicFacetRangeValueUtils } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetRangeValueUtils';
import { DynamicFacetRangeValueFormat } from '../../../../src/ui/DynamicFacet/DynamicFacetRange';

export function DynamicFacetRangeValueUtilsTest() {
  describe('DynamicFacetRangeValueUtils', () => {
    describe('testing formatValue with the number format', () => {
      it(`when the value a integer
        should return the format correctly`, () => {
        const value = DynamicFacetRangeValueUtils.formatValue(10, DynamicFacetRangeValueFormat.number);
        expect(value).toBe('10');
      });

      it(`when the value a big integer
        should return the format correctly`, () => {
        const value = DynamicFacetRangeValueUtils.formatValue(1000, DynamicFacetRangeValueFormat.number);
        expect(value).toBe('1,000');
      });

      it(`when the value a float
        should return the format correctly`, () => {
        const value = DynamicFacetRangeValueUtils.formatValue(1.001, DynamicFacetRangeValueFormat.number);
        expect(value).toBe('1.001');
      });
    });

    it('should return formatRangeValue correctly', () => {
      const value = DynamicFacetRangeValueUtils.formatRangeValue({ start: 0, end: 10 }, DynamicFacetRangeValueFormat.number, 'to');

      expect(value).toBe('0 to 10');
    });

    describe(`testing validateRange`, () => {
      it(`when sending a valid range
      should return it correctly parsed`, () => {
        const validatedRange = DynamicFacetRangeValueUtils.validateRange(
          {
            start: '0.1',
            end: 10,
            endInclusive: true
          },
          DynamicFacetRangeValueFormat.number
        );

        expect(validatedRange).toEqual({
          start: 0.1,
          end: 10,
          endInclusive: true
        });
      });

      it(`when sending a invalid range
      should return null`, () => {
        const validatedRange = DynamicFacetRangeValueUtils.validateRange(
          {
            start: 'yes',
            end: 10,
            endInclusive: true
          },
          DynamicFacetRangeValueFormat.number
        );

        expect(validatedRange).toBeNull();
      });
    });

    it('should return valueFromRange correctly', () => {
      const value = DynamicFacetRangeValueUtils.valueFromRange({ start: 0.0191, end: 100000, endInclusive: true });
      expect(value).toBe('0.0191..100000inc');
    });

    describe(`testing rangeFromValue`, () => {
      it(`when sending a valid value
      should return the range correctly`, () => {
        const range = DynamicFacetRangeValueUtils.rangeFromValue('0.1..10exc', DynamicFacetRangeValueFormat.number);

        expect(range).toEqual({
          start: 0.1,
          end: 10,
          endInclusive: false
        });
      });

      it(`when sending a value with a wrong range
      should return null`, () => {
        const range = DynamicFacetRangeValueUtils.rangeFromValue('hello..10inc', DynamicFacetRangeValueFormat.number);
        expect(range).toBeNull();
      });

      it(`when sending a value with an unknown endInclusive value
      should return null`, () => {
        const range = DynamicFacetRangeValueUtils.rangeFromValue('1..100ish', DynamicFacetRangeValueFormat.number);
        expect(range).toBeNull();
      });
    });
  });
}
