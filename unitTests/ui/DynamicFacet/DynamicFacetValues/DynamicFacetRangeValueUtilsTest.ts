import { DynamicFacetRangeValueUtils } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetRangeValueUtils';
import { DynamicFacetRangeValueFormat } from '../../../../src/ui/DynamicFacet/DynamicFacetRange';

export function DynamicFacetRangeValueUtilsTest() {
  describe('DynamicFacetRangeValueUtils', () => {
    describe('testing with the number format', () => {
      describe('testing formatDisplayValue', () => {
        it(`when the value is a integer
          should return the format correctly`, () => {
          const value = DynamicFacetRangeValueUtils.formatDisplayValue(10, DynamicFacetRangeValueFormat.number);
          expect(value).toBe('10');
        });

        it(`when the value is a big integer
          should return the format correctly`, () => {
          const value = DynamicFacetRangeValueUtils.formatDisplayValue(1000, DynamicFacetRangeValueFormat.number);
          expect(value).toBe('1,000');
        });

        it(`when the value is a float
          should return the format correctly`, () => {
          const value = DynamicFacetRangeValueUtils.formatDisplayValue(1.001, DynamicFacetRangeValueFormat.number);
          expect(value).toBe('1.001');
        });
      });

      it('should return formatRangeDisplayValue correctly', () => {
        const value = DynamicFacetRangeValueUtils.formatRangeDisplayValue({ start: 0, end: 10 }, DynamicFacetRangeValueFormat.number, 'to');

        expect(value).toBe('0 to 10');
      });

      describe(`testing parseRange`, () => {
        it(`when sending a valid range
        should return it correctly parsed`, () => {
          const validatedRange = DynamicFacetRangeValueUtils.parseRange(
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
          const validatedRange = DynamicFacetRangeValueUtils.parseRange(
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

      it('should return createValueFromRange correctly', () => {
        const value = DynamicFacetRangeValueUtils.createValueFromRange({ start: 0.0191, end: 100000, endInclusive: true });
        expect(value).toBe('0.0191..100000inc');
      });

      describe(`testing createRangeFromValue`, () => {
        it(`when sending a valid value
        should return the range correctly`, () => {
          const range = DynamicFacetRangeValueUtils.createRangeFromValue('0.1..10exc', DynamicFacetRangeValueFormat.number);

          expect(range).toEqual({
            start: 0.1,
            end: 10,
            endInclusive: false
          });
        });

        it(`when sending a value with a wrong range
        should return null`, () => {
          const range = DynamicFacetRangeValueUtils.createRangeFromValue('hello..10inc', DynamicFacetRangeValueFormat.number);
          expect(range).toBeNull();
        });

        it(`when sending a value with an unknown endInclusive value
        should return null`, () => {
          const range = DynamicFacetRangeValueUtils.createRangeFromValue('1..100ish', DynamicFacetRangeValueFormat.number);
          expect(range).toBeNull();
        });
      });
    });

    describe('testing with the date format', () => {
      describe('testing formatDisplayValue', () => {
        it(`when the value is a Date object
          should return the format correctly`, () => {
          const value = DynamicFacetRangeValueUtils.formatDisplayValue(new Date('April 17 1999'), DynamicFacetRangeValueFormat.date);
          expect(value).toBe('4/17/1999');
        });

        it(`when the value is a integer
          should return the format correctly`, () => {
          const value = DynamicFacetRangeValueUtils.formatDisplayValue(1466662921705, DynamicFacetRangeValueFormat.date);
          expect(value).toBe('6/23/2016');
        });

        it(`when the value is a string
          should return the format correctly`, () => {
          const value = DynamicFacetRangeValueUtils.formatDisplayValue('April 17 1999', DynamicFacetRangeValueFormat.date);
          expect(value).toBe('4/17/1999');
        });
      });

      describe(`testing parseRange`, () => {
        it(`when sending a valid range
        should return it correctly parsed`, () => {
          const validatedRange = DynamicFacetRangeValueUtils.parseRange(
            {
              start: '4/17/1999',
              end: '6/23/2016',
              endInclusive: true
            },
            DynamicFacetRangeValueFormat.date
          );

          expect(validatedRange).toEqual({
            start: '1999/04/17@00:00:00',
            end: '2016/06/23@00:00:00',
            endInclusive: true
          });
        });

        it(`when sending a invalid range
        should return null`, () => {
          const validatedRange = DynamicFacetRangeValueUtils.parseRange(
            {
              start: 'yes',
              end: 'no',
              endInclusive: true
            },
            DynamicFacetRangeValueFormat.date
          );

          expect(validatedRange).toBeNull();
        });
      });

      it('should return createValueFromRange correctly', () => {
        const value = DynamicFacetRangeValueUtils.createValueFromRange({
          start: '1999/04/17@00:00:00',
          end: '2016/06/23@00:00:00',
          endInclusive: true
        });

        expect(value).toBe('1999/04/17@00:00:00..2016/06/23@00:00:00inc');
      });
    });
  });
}
