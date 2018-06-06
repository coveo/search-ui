import * as axe from 'axe-core';
import { $$, QueryDuration, Component } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';

export const AccessibilityQueryDuration = () => {
  describe('QueryDuration', () => {
    it('should be accessible', async done => {
      const queryDurationElement = $$('div', {
        className: Component.computeCssClassName(QueryDuration)
      });

      getResultsColumn().appendChild(queryDurationElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
