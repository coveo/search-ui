import { ColorUtils } from '../../src/utils/ColorUtils';

export function ColorUtilsTest() {
  describe('ColorUtils', () => {
    it('should create the correct value from hsv to rgb', () => {
      expect(ColorUtils.hsvToRgb(1, 1, 1)).toEqual([255, 0, 0]);
    });

    it('should create the correct value from rgb to hsv', () => {
      expect(ColorUtils.rgbToHsv(255, 0, 0)).toEqual([0, 1, 1]);
    });
  });
}
