import { ResultListRenderer } from './ResultListRenderer';
import { $$ } from '../../utils/Dom';
import _ = require('underscore');

export class ResultListCardRenderer extends ResultListRenderer {
  afterRenderingResults(resultElements: HTMLElement[]) {
    if (!_.isEmpty(resultElements)) {
      if (!this.resultListOptions.enableInfiniteScroll) {
        // Used to prevent last card from spanning the grid's whole width
        _.times(3, () => this.resultListOptions.resultContainer.appendChild($$('div', { className: 'coveo-card-layout' }).el));
      }
    }
  }
}
