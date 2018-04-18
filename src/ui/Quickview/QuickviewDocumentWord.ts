import { HIGHLIGHT_PREFIX } from './QuickviewDocument';

export class QuickviewDocumentWord {
  public text: string;
  public count: number;
  public index: number;
  public termsCount: number;
  public occurrence: number;
  public indexIdentifier: string;

  constructor(public element: HTMLElement) {
    const parsed = this.parseKeywordIdentifier(element);
    if (parsed) {
    }
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
