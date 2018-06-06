import * as axe from 'axe-core';
import { $$, Quickview, Component, get } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement, afterDelay } from './Testing';

export const AccessibilityQuickview = () => {
  describe('Quickview', () => {
    it('should be accessible', async done => {
      const quickviewElement = $$('div', {
        className: Component.computeCssClassName(Quickview)
      });

      testResultElement(quickviewElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when opened', async done => {
      const quickviewElement = $$('div', {
        className: Component.computeCssClassName(Quickview)
      });

      testResultElement(quickviewElement.el);
      await afterQuerySuccess();
      (get(document.querySelector(`.${Component.computeCssClassName(Quickview)}`)) as Quickview).open();
      await afterDelay(500);
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
