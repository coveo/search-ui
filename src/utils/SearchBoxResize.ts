import { $$ } from './Dom';

export class SearchBoxResize {
  public static resize(element: HTMLElement, size: number) {
    const searchbox = this.findSearchbox(element);
    const InputChange: HTMLElement[] = this.findOnlyHeigthChange(element);
    const magicboxInput: HTMLElement = this.findMagicboxInput(element);

    const searchboxStyle = `height: ${size}px; line-height: ${size}px;`;
    const inputChangeStyle = `height: ${size}px`;

    //This need to be a little bit smaller because when the height become smaller than 38px or to big, the bottom border of the Searchbox dissapear
    const magicboxInputStyle = `height: ${size - 2}px;`;

    this.applyStyle(searchbox, searchboxStyle);
    this.applyStyle(magicboxInput, magicboxInputStyle);

    InputChange.forEach(HtmlElement => {
      this.applyStyle(HtmlElement, inputChangeStyle);
    });
  }

  private static applyStyle(element: HTMLElement, style: string) {
    element.style.cssText += style;
  }

  private static findSearchbox(element: HTMLElement): HTMLElement {
    return $$(element).find('.CoveoOmnibox') || $$(element).find('.CoveoQuerybox');
  }

  private static findOnlyHeigthChange(element: HTMLElement): HTMLElement[] {
    return [
      $$(element).find('.CoveoSearchButton'),
      $$($$(element).find('.magic-box-input')).find('input'),
      $$(element).find('.magic-box-icon'),
      $$(element).find('.magic-box-clear')
    ];
  }

  private static findMagicboxInput(element: HTMLElement): HTMLElement {
    return $$(element).find('.magic-box-input');
  }
}
