import { $$ } from '../../utils/Dom';
import { each } from 'underscore';
import { QuickviewDocumentIframe } from './QuickviewDocumentIframe';
import { QuickviewDocumentWord } from './QuickviewDocumentWord';
import { HIGHLIGHT_PREFIX } from './QuickviewDocument';
import { IQueryResult } from '../../rest/QueryResult';

export class QuickviewDocumentWords {
  public words: Record<string, QuickviewDocumentWord> = {};

  constructor(public iframe: QuickviewDocumentIframe, public result: IQueryResult) {
    this.scanDocument();
  }

  private scanDocument() {
    each($$(this.iframe.body).findAll(`[id^="${HIGHLIGHT_PREFIX}"]`), (element: HTMLElement, index: number) => {
      const quickviewWord = new QuickviewDocumentWord(this.result);
      quickviewWord.doCompleteInitialScanForKeywordInDocument(element);

      if (!quickviewWord.text) {
        return;
      }

      const alreadyScannedKeyword = this.words[quickviewWord.indexIdentifier];

      if (!alreadyScannedKeyword) {
        this.words[quickviewWord.indexIdentifier] = quickviewWord;
      } else {
        alreadyScannedKeyword.addElement(element);

        // Special code needed to workaround invalid HTML returned by the index with embedded keyword
        if (alreadyScannedKeyword.occurrence == quickviewWord.occurrence) {
          alreadyScannedKeyword.text += quickviewWord.text;
        }
      }
    });
  }
}
