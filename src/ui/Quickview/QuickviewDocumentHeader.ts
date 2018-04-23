import { $$, Dom } from '../../utils/Dom';
import { QuickviewDocumentWordButton } from './QuickviewDocumentWordButton';

export class QuickviewDocumentHeader {
  public el: HTMLElement;

  constructor() {
    this.el = this.buildHeader().el;
  }

  public addWord(wordButton: QuickviewDocumentWordButton) {
    this.el.appendChild(wordButton.el);
  }

  private buildHeader(): Dom {
    const header = $$('div', {
      className: 'coveo-quickview-header'
    });
    return header;
  }
}
