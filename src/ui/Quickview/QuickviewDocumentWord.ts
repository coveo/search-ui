import { HIGHLIGHT_PREFIX } from './QuickviewDocument';
import { $$ } from '../../utils/Dom';
import { first } from 'underscore';

export class QuickviewDocumentWord {
  public text: string;
  public count: number;
  public termsCount: number;
  public occurrence: number;
  public indexIdentifier: string;
  public indexTermPart: number;

  constructor(public element: HTMLElement) {
    const parsed = this.parseKeywordIdentifier(element);
    if (parsed) {
      this.indexIdentifier = parsed.keywordIdentifier;
      this.occurrence = parsed.keywordOccurrencesInDocument;
      this.indexTermPart = parsed.keywordTermPart;
    }
  }

  public doCompleteInitialScanForKeywordInDocument() {
    this.text = this.getHighlightedInnerText();
    this.count = 1;
    this.termsCount = this.isTaggedWord() ? 0 : 1;
  }

  private getHighlightedInnerText(): string {
    if (!this.isTaggedWord()) {
      return $$(this.element).text() || '';
    }

    const children = $$(this.element).children();
    if (children.length >= 1) {
      return $$(first(children)).text() || '';
    }

    return '';
  }

  private isTaggedWord() {
    return this.element.nodeName.toLowerCase() == 'coveotaggedword';
  }

  private parseKeywordIdentifier(element: HTMLElement) {
    const parts = element.id.substr(HIGHLIGHT_PREFIX.length + 1).match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/);

    if (!parts || parts.length <= 3) {
      return null;
    }

    return {
      keywordIdentifier: parts[1],
      keywordOccurrencesInDocument: parseInt(parts[2], 10),
      keywordTermPart: parseInt(parts[3], 10)
    };
  }
}
