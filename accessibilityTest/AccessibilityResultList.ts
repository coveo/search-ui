import * as axe from 'axe-core';
import { $$, Component, ResultList } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';

export const AccessibilityResultList = () => {
  describe('ResultList', () => {
    it('should be accessible', async done => {
      const resultListElement = $$('div', {
        className: Component.computeCssClassName(ResultList)
      });

      getResultsColumn().appendChild(resultListElement.el);

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
