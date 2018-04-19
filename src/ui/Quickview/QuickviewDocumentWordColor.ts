import { ColorUtils } from '../../utils/ColorUtils';

export class QuickviewDocumentWordColor {
  public r: number;
  public g: number;
  public b: number;

  constructor(public htmlColor: string) {
    const rgbExtracted = htmlColor.match(/\d+/g);
    if (rgbExtracted) {
      this.r = parseInt(rgbExtracted[0], 10);
      this.g = parseInt(rgbExtracted[1], 10);
      this.b = parseInt(rgbExtracted[2], 10);
    }
  }

  public invert() {
    return `rgb(${255 - this.r}, ${255 - this.g}, ${255 - this.b})`;
  }

  public saturate() {
    const hsv = ColorUtils.rgbToHsv(this.r, this.g, this.b);
    hsv[1] *= 2;
    if (hsv[1] > 1) {
      hsv[1] = 1;
    }
    const rgb = ColorUtils.hsvToRgb(hsv[0], hsv[1], hsv[2]);
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }
}
