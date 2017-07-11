import { ResultListRenderer } from './ResultListRenderer';
import { $$ } from '../../utils/Dom';
import _ = require('underscore');

export class ResultListCardRenderer extends ResultListRenderer {
  getEndFragment(resultElements: HTMLElement[]) {
    return new Promise<DocumentFragment>(resolve => {
      if (!_.isEmpty(resultElements)) {
        // with infinite scrolling, we want the additional results to append at the end of the previous query.
        // For this, we need to remove the padding.
        if (this.resultListOptions.enableInfiniteScroll) {
          const needToBeRemoved = $$(this.resultListOptions.resultContainer).findAll('.coveo-card-layout-padding');
          _.each(needToBeRemoved, toRemove => $$(toRemove).remove());
        }
        // Used to prevent last card from spanning the grid's whole width
        const emptyCards = document.createDocumentFragment();
        _.times(3, () => emptyCards.appendChild($$('div', { className: 'coveo-card-layout coveo-card-layout-padding' }).el));
        resolve(emptyCards);
      }
      resolve(null);
    });
  }
}
