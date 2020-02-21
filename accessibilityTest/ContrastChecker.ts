export interface IColor {
  redRatio: number;
  greenRatio: number;
  blueRatio: number;
  alphaRatio: number;
}

/**
 * @see https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-procedure
 */
export class ContrastChecker {
  public static readonly MinimumContrastRatio = 3;

  public static getContrastWithBackground(element: HTMLElement, colorAttributeName: keyof CSSStyleDeclaration = 'color') {
    const color = ContrastChecker.getColor(element, colorAttributeName);
    if (!color) {
      return null;
    }
    const backgroundColor = ContrastChecker.getBackground(element);
    return this.getContrastBetweenRelativeLuminances(this.getRelativeLuminance(color), this.getRelativeLuminance(backgroundColor));
  }

  public static getBackground(element: HTMLElement): IColor {
    const color = ContrastChecker.getColor(element, 'backgroundColor');
    if (color && color.alphaRatio !== 0) {
      return color;
    }
    if (element instanceof HTMLBodyElement) {
      return { redRatio: 1, greenRatio: 1, blueRatio: 1, alphaRatio: 1 };
    }
    return ContrastChecker.getBackground(element.parentElement);
  }

  public static getColor(element: HTMLElement, attributeName: keyof CSSStyleDeclaration = 'color') {
    const rawColor = ContrastChecker.getCSSAttribute(element, attributeName);
    if (!rawColor) {
      return null;
    }
    return ContrastChecker.parseCSSColor(rawColor);
  }

  private static getContrastBetweenRelativeLuminances(luminance1: number, luminance2: number) {
    const [darkerRatio, lighterRatio] = [luminance1, luminance2].sort();
    return (lighterRatio + 0.05) / (darkerRatio + 0.05);
  }

  private static getRelativeLuminance(color: IColor) {
    return (
      0.2126 * ContrastChecker.convertSRGBToRGB(color.redRatio) +
      0.7152 * ContrastChecker.convertSRGBToRGB(color.greenRatio) +
      0.0722 * ContrastChecker.convertSRGBToRGB(color.blueRatio)
    );
  }

  private static convertSRGBToRGB(srgbColorRatio: number) {
    if (srgbColorRatio <= 0.03928) {
      return srgbColorRatio / 12.92;
    }
    return ((srgbColorRatio + 0.055) / 1.055) ** 2.4;
  }

  private static getCSSAttribute(element: HTMLElement, attributeName: keyof CSSStyleDeclaration): string {
    const computedStyle = window.getComputedStyle(element);
    if (!computedStyle.length) {
      return null;
    }
    return computedStyle[attributeName];
  }

  private static parseCSSColor(rawColor: string) {
    return (
      ContrastChecker.parseColorFromExpression(rawColor, /rgb\(\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})/) ||
      ContrastChecker.parseColorFromExpression(rawColor, /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/, 16) ||
      ContrastChecker.parseColorFromExpression(rawColor, /rgba\(\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})\s?,\s?([0-9]{1,3}),\s?([0-9\.])/)
    );
  }

  private static parseColorFromExpression(rawColor: string, expression: RegExp, radix = 10): IColor {
    const result = expression.exec(rawColor);
    if (!result) {
      return null;
    }
    const [, rawRed, rawGreen, rawBlue, rawAlpha] = result;
    return {
      redRatio: parseInt(rawRed, radix) / 255,
      greenRatio: parseInt(rawGreen, radix) / 255,
      blueRatio: parseInt(rawBlue, radix) / 255,
      alphaRatio: rawAlpha ? parseInt(rawAlpha) : 1
    };
  }
}
