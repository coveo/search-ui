import * as axe from 'axe-core';
import { $$, Component, CardActionBar } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityCardActionBar = () => {
  describe('CardActionBar', () => {
    it('should be accessible', async done => {
      const cardActionBarElement = $$('div', {
        className: Component.computeCssClassName(CardActionBar)
      });

      testResultElement(cardActionBarElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
