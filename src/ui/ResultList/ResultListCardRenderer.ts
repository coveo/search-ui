import { ResultListRenderer } from './ResultListRenderer';
import { $$ } from '../../utils/Dom';
import _ = require('underscore');

export class ResultListCardRenderer extends ResultListRenderer {
  getEndFragment(resultElements: HTMLElement[]) {
    return new Promise<DocumentFragment>(resolve => {
      if (!_.isEmpty(resultElements)) {
        if (!this.resultListOptions.enableInfiniteScroll) {
          // Used to prevent last card from spanning the grid's whole width
          const emptyCards = document.createDocumentFragment();
          _.times(3, () => emptyCards.appendChild($$('div', { className: 'coveo-card-layout' }).el));
          resolve(emptyCards);
        }
      }
      resolve(null);
    });
  }
}
