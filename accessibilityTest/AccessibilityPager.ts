import * as axe from 'axe-core';
import { $$, Component, Pager } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';

export const AccessibilityPager = () => {
  describe('Pager', () => {
    it('should be accessible', async done => {
      getResultsColumn().appendChild($$('div', { className: Component.computeCssClassName(Pager) }).el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
