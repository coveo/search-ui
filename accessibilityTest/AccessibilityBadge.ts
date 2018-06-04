import * as axe from 'axe-core';
import { $$, Badge, Component } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityBadge = () => {
  describe('Badge', () => {
    it('should be accessible', async done => {
      const backdrop = $$('div', {
        className: Component.computeCssClassName(Badge),
        'data-field': '@filetype'
      });

      testResultElement(backdrop.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
