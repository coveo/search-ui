import { HIGHLIGHT_PREFIX } from './QuickviewDocument';
import { $$ } from '../../utils/Dom';
import { first, each } from 'underscore';
import { QuickviewDocumentIframe } from './QuickviewDocumentIframe';

export class QuickviewDocumentWord {}

export class QuickviewDocumentWords {
  public keywordsState = [];
  public words: Record<string, QuickviewDocumentWord> = {};

  constructor(public iframe: QuickviewDocumentIframe) {
    each($$(this.iframe.body).findAll(`[id^="${HIGHLIGHT_PREFIX}"]`), (element: HTMLElement, index: number) => {});
  }

  public computeHighlights() {}

  private getHighlightInnerText(element: HTMLElement): string {
    if (element.nodeName.toLowerCase() != 'coveotaggedword') {
      return $$(element).text() || '';
    }

    const children = $$(element).children();
    if (children.length >= 1) {
      return $$(first(children)).text() || '';
    }

    return '';
  }

  private getHightlightEmbeddedWordIdParts(element: HTMLElement) {
    const embedded = element.getElementsByTagName('coveotaggedword')[0];
    return embedded ? this.parseKeywordIdentifier(embedded as HTMLElement) : null;
  }
}
