import { HIGHLIGHT_PREFIX } from './QuickviewDocument';
import { $$ } from '../../utils/Dom';
import { first, without } from 'underscore';
import { Logger } from '../../misc/Logger';
import { QuickviewDocumentWordColor } from './QuickviewDocumentWordColor';
import { IQueryResult } from '../../rest/QueryResult';

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
  public colorRed: number;
  public colorGreen: number;
  public colorBLue: number;

  private logger: Logger;

  constructor(public result: IQueryResult) {
    this.logger = new Logger(this);
  }

  public addElement(element: HTMLElement) {
    this.count++;
    this.elements.push(element);
  }

  public navigateForward(): HTMLElement {
    this.currentNavigationPosition++;
    if (this.currentNavigationPosition >= this.elements.length) {
      this.currentNavigationPosition = 0;
    }
    this.highlightNavigation();
    return this.elements[this.currentNavigationPosition];
  }

  public navigateBackward(): HTMLElement {
    this.currentNavigationPosition--;
    if (this.currentNavigationPosition < 0) {
      this.currentNavigationPosition = this.elements.length - 1;
    }
    this.highlightNavigation();
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
      this.text = this.getHighlightedInnerText(element);
      this.numberOfEmbeddedWords = this.isTaggedWord(element) ? 0 : 1;
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

  private getText(element: HTMLElement) {
    const innerTextOfHTMLElement = this.getHighlightedInnerText(element);
  }

  private resolveOriginalTermFromHighlight(highlight: string): string {
    let found = highlight;

    // Beware, terms to highlight is only set by recent search APIs.
    if (this.result.termsToHighlight) {
      // We look for the term expansion and we'll return the corresponding
      // original term is one is found.
      found =
        _.find(_.keys(this.result.termsToHighlight), (originalTerm: string) => {
          // The expansions do NOT include the original term (makes sense), so be sure to check
          // the original term for a match too.
          return (
            originalTerm.toLowerCase() == highlight.toLowerCase() ||
            _.find(this.result.termsToHighlight[originalTerm], (expansion: string) => expansion.toLowerCase() == highlight.toLowerCase()) !=
              undefined
          );
        }) || found;
    }
    return found;
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
