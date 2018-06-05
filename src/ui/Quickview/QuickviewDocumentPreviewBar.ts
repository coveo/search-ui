import { QuickviewDocumentIframe } from './QuickviewDocumentIframe';
import { QuickviewDocumentWords } from './QuickviewDocumentWords';
import { Doc, $$ } from '../../utils/Dom';
import { each, without, chain } from 'underscore';
import { QuickviewDocumentWord } from './QuickviewDocumentWord';
import { Logger } from '../../misc/Logger';

export class QuickviewDocumentPreviewBar {
  private logger: Logger;
  public wordIndicators: Map<QuickviewDocumentWord, { indicators: HTMLElement[]; position: number }> = new Map();

  constructor(public iframe: QuickviewDocumentIframe, public words: QuickviewDocumentWords) {
    this.logger = new Logger(this);
    this.renderPreviewBar();
  }

  public navigateForward(word: QuickviewDocumentWord): HTMLElement {
    const currentWord = this.wordIndicators.get(word);
    if (!currentWord) {
      this.logger.warn(`Invalid navigation for given word.`, word);
      return null;
    }

    currentWord.position++;

    if (currentWord.position >= currentWord.indicators.length) {
      currentWord.position = 0;
    }
    this.highlightNavigation(word);
    return currentWord.indicators[currentWord.position];
  }

  public navigateBackward(word: QuickviewDocumentWord): HTMLElement {
    const currentWord = this.wordIndicators.get(word);
    if (!currentWord) {
      this.logger.warn(`Invalid navigation for the given word.`, word);
      return null;
    }

    currentWord.position--;

    if (currentWord.position < 0) {
      currentWord.position = currentWord.indicators.length - 1;
    }
    this.highlightNavigation(word);
    return currentWord.indicators[currentWord.position];
  }

  public navigateTo(position: number, word: QuickviewDocumentWord): HTMLElement {
    const currentWord = this.wordIndicators.get(word);
    if (!currentWord) {
      this.logger.warn(`Invalid navigation for the given word`, word);
      return null;
    }

    currentWord.position = position;

    if (currentWord.position < 0 || currentWord.position >= currentWord.indicators.length) {
      this.logger.warn(`Invalid navigation for the given position: ${position}`);
      currentWord.position = 0;
    }
    this.highlightNavigation(word);
    return currentWord.indicators[currentWord.position];
  }

  private highlightNavigation(word: QuickviewDocumentWord) {
    const currentWord = this.wordIndicators.get(word);
    const currentElement = currentWord.indicators[currentWord.position];

    const otherElements = without(currentWord.indicators, currentElement);

    currentElement.style.backgroundColor = word.color.invert();
    currentElement.style.border = `1px solid ${word.color.invert()}`;

    otherElements.forEach(element => this.defaultStyleColor(element, word));
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

        if (this.wordIndicators.has(word)) {
          this.wordIndicators.get(word).indicators.push(indicator);
        } else {
          this.wordIndicators.set(word, {
            indicators: [indicator],
            position: -1
          });
        }

        previewBar.append(indicator);
      });

      this.handleOverlappingIndicators(word);
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
    this.defaultStyleColor(previewUnit.el, word);
    return previewUnit;
  }

  private defaultStyleColor(element: HTMLElement, word: QuickviewDocumentWord) {
    element.style.border = `1px solid ${word.color.saturate()}`;
    element.style.backgroundColor = word.color.htmlColor;
  }

  private handleOverlappingIndicators(word: QuickviewDocumentWord) {
    const allIndicators = this.wordIndicators.get(word).indicators;

    for (let i = 0; i < allIndicators.length; i++) {
      const otherIndicatorAtSamePositionInDocument = chain(allIndicators)
        .without(allIndicators[i])
        .find(otherIndicator => otherIndicator.style.top == allIndicators[i].style.top)
        .value();

      if (otherIndicatorAtSamePositionInDocument) {
        $$(allIndicators[i]).remove();
        allIndicators[i] = otherIndicatorAtSamePositionInDocument;
      }
    }
  }
}
