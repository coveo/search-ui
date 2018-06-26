import * as axe from 'axe-core';
import { $$, Component, ResultLayoutSelector, ResultList } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';

export const AccessibilityResultLayoutSelector = () => {
  describe('ResultLayoutSelector', () => {
    it('should be accessible', async done => {
      const resultLayoutSelectorElement = $$('div', {
        className: Component.computeCssClassName(ResultLayoutSelector)
      });

      const resultListAsListLayout = $$('div', {
        className: Component.computeCssClassName(ResultList),
        'data-layout': 'list'
      });

      const resultListAsCardLayout = $$('div', {
        className: Component.computeCssClassName(ResultList),
        'data-layout': 'card'
      });

      getResultsColumn().appendChild(resultLayoutSelectorElement.el);
      getResultsColumn().appendChild(resultListAsListLayout.el);
      getResultsColumn().appendChild(resultListAsCardLayout.el);

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
