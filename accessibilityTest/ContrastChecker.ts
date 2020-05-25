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
  public static readonly MinimumHighContrastRatio = 4.5;

  public static getContrastWithBackground(
    element: HTMLElement,
    colorAttributeName: keyof CSSStyleDeclaration = 'color',
    backgroundElement: HTMLElement = element
  ) {
    const color = this.getColor(element, colorAttributeName);
    if (!color) {
      return null;
    }
    const backgroundColor = this.getBackground(backgroundElement);
    return this.getContrastBetweenColors(color, backgroundColor);
  }

  public static getBackground(element: HTMLElement): IColor {
    const color = this.getColor(element, 'backgroundColor');
    if (color && color.alphaRatio !== 0) {
      return color;
    }
    if (element instanceof HTMLBodyElement) {
      return { redRatio: 1, greenRatio: 1, blueRatio: 1, alphaRatio: 1 };
    }
    return this.getBackground(element.parentElement);
  }

  public static getColor(element: HTMLElement, attributeName: keyof CSSStyleDeclaration = 'color') {
    const rawColor = this.getCSSAttribute(element, attributeName);
    if (!rawColor) {
      return null;
    }
    const color = this.parseCSSColor(rawColor);
    color.alphaRatio *= +this.getCSSAttribute(element, 'opacity');
    return color;
  }

  public static getCSSAttribute(element: HTMLElement, attributeName: keyof CSSStyleDeclaration): string {
    const computedStyle = window.getComputedStyle(element);
    if (!computedStyle.length) {
      return null;
    }
    return computedStyle[attributeName];
  }

  public static getContrastBetweenColors(foregroundColor: IColor, backgroundColor: IColor) {
    return this.getContrastBetweenRelativeLuminances(
      this.getRelativeLuminance(this.combineColors(foregroundColor, backgroundColor)),
      this.getRelativeLuminance(backgroundColor)
    );
  }

  public static combineColors(color: IColor, backgroundColor: IColor): IColor {
    const { alphaRatio } = color;
    return {
      redRatio: (1 - alphaRatio) * backgroundColor.redRatio + alphaRatio * color.redRatio,
      greenRatio: (1 - alphaRatio) * backgroundColor.greenRatio + alphaRatio * color.greenRatio,
      blueRatio: (1 - alphaRatio) * backgroundColor.blueRatio + alphaRatio * color.blueRatio,
      alphaRatio: backgroundColor.alphaRatio
    };
  }

  private static getContrastBetweenRelativeLuminances(luminance1: number, luminance2: number) {
    const [darkerRatio, lighterRatio] = [luminance1, luminance2].sort();
    return (lighterRatio + 0.05) / (darkerRatio + 0.05);
  }

  private static getRelativeLuminance(color: IColor) {
    return (
      0.2126 * this.convertSRGBToRGB(color.redRatio) +
      0.7152 * this.convertSRGBToRGB(color.greenRatio) +
      0.0722 * this.convertSRGBToRGB(color.blueRatio)
    );
  }

  private static convertSRGBToRGB(srgbColorRatio: number) {
    if (srgbColorRatio <= 0.03928) {
      return srgbColorRatio / 12.92;
    }
    return ((srgbColorRatio + 0.055) / 1.055) ** 2.4;
  }

  private static parseCSSColor(rawColor: string) {
    return (
      this.parseColorFromExpression(rawColor, /rgb\(\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})/) ||
      this.parseColorFromExpression(rawColor, /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/, 16) ||
      this.parseColorFromExpression(rawColor, /rgba\(\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})\s?,\s?([0-9]{1,3}),\s?([0-9\.])/)
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
