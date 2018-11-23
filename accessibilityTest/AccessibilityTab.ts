import * as axe from 'axe-core';
import { $$, Component, Tab } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, getTabSection } from './Testing';

export const AccessibilityTab = () => {
  describe('Tab', () => {
    it('should be accessible when configured as an anchor', async done => {
      const tab = $$('a', {
        className: Component.computeCssClassName(Tab),
        'data-caption': 'All Content',
        'data-id': 'All'
      });

      getTabSection().appendChild(tab.el);

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when configured as a div', async done => {
      const tab = $$('div', {
        className: Component.computeCssClassName(Tab),
        'data-caption': 'All Content',
        'data-id': 'All'
      });

      getTabSection().appendChild(tab.el);

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when configured as a span', async done => {
      const tab = $$('span', {
        className: Component.computeCssClassName(Tab),
        'data-caption': 'All Content',
        'data-id': 'All'
      });

      getTabSection().appendChild(tab.el);

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
