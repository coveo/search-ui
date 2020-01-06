import { NumberUtils } from '../../src/utils/NumberUtils';

export function NumberUtilsTest() {
  describe('NumberUtils', () => {
    it('should return 0 if there is no decimal number', () => {
      expect(NumberUtils.countDecimals(1)).toBe(0);
    });

    it('should return 0 if there is the decimal numbers are composed of 0s', () => {
      expect(NumberUtils.countDecimals(1.0)).toBe(0);
    });

    it('should return 2 if there is 2 decimal number', () => {
      expect(NumberUtils.countDecimals(1.29)).toBe(2);
    });

    it('should return 10 if there is 10 decimal number', () => {
      expect(NumberUtils.countDecimals(1.0123456789)).toBe(10);
    });
  });
}
