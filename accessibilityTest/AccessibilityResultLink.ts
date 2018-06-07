import * as axe from 'axe-core';
import { $$, ResultLink, Component } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityResultLink = () => {
  describe('ResultLink', () => {
    it('should be accessible', async done => {
      const badgeElement = $$('a', {
        className: Component.computeCssClassName(ResultLink)
      });

      testResultElement(badgeElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
