import * as axe from 'axe-core';
import { $$, Component, Excerpt } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityExcerpt = () => {
  describe('Excerpt', () => {
    it('should be accessible', async done => {
      const excerptElement = $$('div', {
        className: Component.computeCssClassName(Excerpt)
      });

      testResultElement(excerptElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
