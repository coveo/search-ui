import { $$ } from './Dom';
import _ = require('underscore');

export class SearchBoxResize {
  public static resize(element: HTMLElement, size: number) {
    const searchBox = this.findsearchBox(element);
    const InputChange: HTMLElement[] = this.findOnlyHeigthChange(element);
    const magicBoxChange: HTMLElement[] = this.findMagicBoxElement(element);
    const magicBoxInput: HTMLElement = this.findMagicBoxInput(element);

    const searchBoxStyle = `height: ${size}px; line-height: ${size}px; display: inline-block; align-items: center;`;
    const inputChangeStyle = `height: ${size}px`;
    const magicBoxChangeStyle = `display: flex; align-items: center; height: ${size}px; width: ${size}px; margin-top: 0px; max-width: 48px; margin-left: ${size /
      4}px ;`;

    //This need to be a little bit smaller because when the height become smaller than 38px or to big, the bottom border of the Searchbox dissapear
    const magicBoxInputStyle = `height: ${size - 2}px;`;

    this.applyStyle(searchBox, searchBoxStyle);

    _.forEach(InputChange, HtmlElement => {
      this.applyStyle(HtmlElement, inputChangeStyle);
    });

    _.forEach(magicBoxChange, HtmlElement => {
      this.applyStyle(HtmlElement, magicBoxChangeStyle);
    });

    this.applyStyle(magicBoxInput, magicBoxInputStyle);
  }

  private static applyStyle(element: HTMLElement, style) {
    element.style.cssText += style;
  }

  private static findsearchBox(element: HTMLElement): HTMLElement {
    return $$(element).find('.CoveoOmnibox') || $$(element).find('.CoveoQuerybox');
  }

  private static findOnlyHeigthChange(element: HTMLElement): HTMLElement[] {
    let elements: HTMLElement[] = [];
    elements.push($$(element).find('.CoveoSearchButton'));
    elements.push($$($$(element).find('.magic-box-input')).find('input'));
    return elements;
  }

  private static findMagicBoxElement(element: HTMLElement): HTMLElement[] {
    let elements: HTMLElement[] = [];
    elements.push($$(element).find('.magic-box-icon'));
    elements.push($$(element).find('.magic-box-clear'));
    return elements;
  }

  private static findMagicBoxInput(element: HTMLElement): HTMLElement {
    return $$(element).find('.magic-box-input');
  }
}
