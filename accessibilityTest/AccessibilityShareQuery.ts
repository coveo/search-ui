import * as axe from 'axe-core';
import { $$, Component, ShareQuery, get } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testSettingsElement } from './Testing';

export const AccessibilityShareQuery = () => {
  describe('ShareQuery', () => {
    it('should be accessible', async done => {
      const shareQueryElement = $$('div', {
        className: Component.computeCssClassName(ShareQuery)
      });

      testSettingsElement(shareQueryElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when opened', async done => {
      const shareQueryElement = $$('div', {
        className: Component.computeCssClassName(ShareQuery)
      });

      testSettingsElement(shareQueryElement.el);
      await afterQuerySuccess();
      (get(shareQueryElement.el) as ShareQuery).open();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
