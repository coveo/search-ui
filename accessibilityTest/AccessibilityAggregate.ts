import * as axe from 'axe-core';
import { $$, Aggregate, Component } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';

export const AccessibilityAggregate = () => {
  describe('Aggregate', () => {
    it('should be accessible', async done => {
      getResultsColumn().appendChild($$('div', { className: Component.computeCssClassName(Aggregate), 'data-field': '@objecttype' }).el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
