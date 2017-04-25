import { ResultListRenderer } from './ResultListRenderer';
import { $$ } from '../../utils/Dom';
import _ = require('underscore');

export class ResultListCardRenderer extends ResultListRenderer {
  afterRenderingResults(container: Node, resultElements: HTMLElement[]) {
    if (!_.isEmpty(resultElements)) {
      if (!this.resultListOptions.enableInfiniteScroll) {
        // Used to prevent last card from spanning the grid's whole width
        _.times(3, () => container.appendChild($$('div', { className: 'coveo-card-layout' }).el));
      }
    }
  }
}
