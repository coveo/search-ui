import { find, first, keys, without } from 'underscore';
import { StringUtils } from '../../Core';
import { Logger } from '../../misc/Logger';
import { IQueryResult } from '../../rest/QueryResult';
import { $$ } from '../../utils/Dom';
import { HIGHLIGHT_PREFIX } from './QuickviewDocument';
import { QuickviewDocumentWordColor } from './QuickviewDocumentWordColor';

export class QuickviewDocumentWord {
  public text: string;
  public count: number = 0;
  public numberOfEmbeddedWords: number;
  public occurrence: number;
  public indexIdentifier: string;
  public indexTermPart: number;
  public elements: HTMLElement[] = [];
  public currentNavigationPosition = -1;
  public color: QuickviewDocumentWordColor;

  private logger: Logger;

  constructor(public result: IQueryResult) {
    this.logger = new Logger(this);
  }

  public addElement(element: HTMLElement) {
    this.count++;
    this.elements.push(element);
  }

  public navigateForward() {
    this.currentNavigationPosition++;
    if (this.currentNavigationPosition >= this.elements.length) {
      this.currentNavigationPosition = 0;
    }
    this.highlightNavigation();
    this.putElementIntoView();
    return this.elements[this.currentNavigationPosition];
  }

  public navigateBackward() {
    this.currentNavigationPosition--;
    if (this.currentNavigationPosition < 0) {
      this.currentNavigationPosition = this.elements.length - 1;
    }
    this.highlightNavigation();
    this.putElementIntoView();
    return this.elements[this.currentNavigationPosition];
  }

  public navigateTo(position: number): HTMLElement {
    this.currentNavigationPosition = position;
    if (this.currentNavigationPosition < 0 || this.currentNavigationPosition >= this.elements.length) {
      this.currentNavigationPosition = 0;
      this.logger.warn(`Invalid position in quickview navigation: ${position}`);
    }
    this.highlightNavigation();
    return this.elements[this.currentNavigationPosition];
  }

  public doCompleteInitialScanForKeywordInDocument(element: HTMLElement) {
    const parsed = this.parseKeywordIdentifier(element);

    if (parsed) {
      this.indexIdentifier = parsed.keywordIdentifier;
      this.occurrence = parsed.keywordOccurrencesInDocument;
      this.indexTermPart = parsed.keywordTermPart;
      this.text = this.getText(element);
      this.color = new QuickviewDocumentWordColor(element.style.backgroundColor);

      this.addElement(element);
    }
  }

  public isTaggedWord(element: HTMLElement) {
    return element.nodeName.toLowerCase() == 'coveotaggedword';
  }

  private highlightNavigation() {
    const currentElement = this.elements[this.currentNavigationPosition];
    const otherElements = without(this.elements, currentElement);
    currentElement.style.color = this.color.htmlColor;
    currentElement.style.backgroundColor = this.color.invert();
    otherElements.forEach(element => {
      element.style.color = '';
      element.style.backgroundColor = this.color.htmlColor;
    });
  }

  private putElementIntoView() {
    const element = this.elements[this.currentNavigationPosition];
    element.scrollIntoView();
  }

  private getText(element: HTMLElement) {
    const innerTextOfHTMLElement = this.getHighlightedInnerText(element);
    return this.resolveOriginalTerm(innerTextOfHTMLElement);
  }

  private resolveOriginalTerm(highlight: string): string {
    if (!this.result || !this.result.termsToHighlight) {
      return highlight;
    }

    const found = find(keys(this.result.termsToHighlight), (originalTerm: string) => {
      // The expansions do NOT include the original term (makes sense), so be sure to check
      // the original term for a match too.
      const originalTermMatch = StringUtils.equalsCaseInsensitive(originalTerm, highlight);
      const expansionMatch =
        find(this.result.termsToHighlight[originalTerm], (expansion: string) => StringUtils.equalsCaseInsensitive(expansion, highlight)) !=
        undefined;
      return originalTermMatch || expansionMatch;
    });

    return found || highlight;
  }

  private getHighlightedInnerText(element: HTMLElement): string {
    if (!this.isTaggedWord(element)) {
      return $$(element).text() || '';
    }

    const children = $$(element).children();
    if (children.length >= 1) {
      return $$(first(children)).text() || '';
    }

    return '';
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
