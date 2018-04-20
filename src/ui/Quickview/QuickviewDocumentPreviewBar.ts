import { QuickviewDocumentIframe } from './QuickviewDocumentIframe';
import { QuickviewDocumentWords } from './QuickviewDocumentWords';
import { Doc, $$ } from '../../utils/Dom';
import { each } from 'underscore';
import { QuickviewDocumentWord } from './QuickviewDocumentWord';

export class QuickviewDocumentPreviewBar {
  public currentNavigationPosition = -1;
  public indicators: { indicator: HTMLElement; word: QuickviewDocumentWord }[] = [];

  constructor(public iframe: QuickviewDocumentIframe, public words: QuickviewDocumentWords) {
    this.renderPreviewBar();
  }

  public navigateForward(): HTMLElement {
    this.currentNavigationPosition++;
    if (this.currentNavigationPosition >= this.indicators.length) {
      this.currentNavigationPosition = 0;
    }
    this.highlightNavigation();
    return this.indicators[this.currentNavigationPosition].indicator;
  }

  public navigateBackward(): HTMLElement {
    this.currentNavigationPosition--;
    if (this.currentNavigationPosition < 0) {
      this.currentNavigationPosition = this.indicators.length - 1;
    }
    this.highlightNavigation();
    return this.indicators[this.currentNavigationPosition].indicator;
  }

  public navigateTo(position: number): HTMLElement {
    this.currentNavigationPosition = position;
    if (this.currentNavigationPosition < 0 || this.currentNavigationPosition >= this.indicators.length) {
      this.currentNavigationPosition = 0;
      // this.logger.warn(`Invalid position in quickview navigation: ${position}`);
    }
    this.highlightNavigation();
    return this.indicators[this.currentNavigationPosition].indicator;
  }

  private highlightNavigation() {
    /*const currentElement = this.indicators[this.currentNavigationPosition].indicator;
    const currentWord = 
    const otherElements = without(this.elements, currentElement);
    currentElement.style.color = this.color.htmlColor;
    currentElement.style.backgroundColor = this.color.invert();
    otherElements.forEach(element => {
      element.style.color = '';
      element.style.backgroundColor = this.color.htmlColor;
    });*/
  }

  private renderPreviewBar() {
    const previewBar = $$('div');

    previewBar.el.style.width = '15px';
    previewBar.el.style.position = 'fixed';
    previewBar.el.style.top = '0';
    previewBar.el.style.right = '0px';
    previewBar.el.style.height = '100%';

    this.iframe.body.appendChild(previewBar.el);

    each(this.words.words, word => {
      each(word.elements, element => {
        const indicator = this.renderWordPositionIndicator(element, word).el;
        this.indicators.push({
          word,
          indicator
        });
        previewBar.append(indicator);
      });
    });
  }

  private renderWordPositionIndicator(element: HTMLElement, word: QuickviewDocumentWord) {
    const docHeight = new Doc(this.iframe.document).height();
    const elementPosition = element.getBoundingClientRect().top;

    const previewUnit = $$('div');
    previewUnit.el.style.position = 'absolute';
    previewUnit.el.style.top = `${elementPosition / docHeight * 100}%`;
    previewUnit.el.style.width = '100%';
    previewUnit.el.style.height = '1px';
    previewUnit.el.style.border = `1px solid ${word.color.saturate()}`;
    previewUnit.el.style.backgroundColor = word.color.htmlColor;

    return previewUnit;
  }
}
