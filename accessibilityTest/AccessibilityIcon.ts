import * as axe from 'axe-core';
import { $$, Component, Icon } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityIcon = () => {
  describe('Icon', () => {
    it('should be accessible', async done => {
      const iconElement = $$('div', {
        className: Component.computeCssClassName(Icon)
      });

      testResultElement(iconElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
