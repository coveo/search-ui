import * as axe from 'axe-core';
import { $$, Component, ResultsPerPage } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';

export const AccessibilityResultsPerPage = () => {
  describe('ResultsPerPage', () => {
    it('should be accessible', async done => {
      getResultsColumn().appendChild($$('div', { className: Component.computeCssClassName(ResultsPerPage) }).el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
