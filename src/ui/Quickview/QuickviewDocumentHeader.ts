import { $$, Dom } from '../../utils/Dom';

export class QuickviewDocumentHeader {
  public el: HTMLElement;

  constructor() {
    this.el = this.buildHeader().el;
  }

  public addWord() {}

  public removeWord() {}

  private buildHeader(): Dom {
    const header = $$('div', {
      className: 'coveo-quickview-header'
    });
    return header;
  }
}
