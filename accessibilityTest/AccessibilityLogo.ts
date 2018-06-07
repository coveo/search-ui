import * as axe from 'axe-core';
import { $$, Logo, Component } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';

export const AccessibilityLogo = () => {
  describe('Logo', () => {
    it('should be accessible', async done => {
      const logoElement = $$('div', {
        className: Component.computeCssClassName(Logo)
      });

      getResultsColumn().appendChild(logoElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
