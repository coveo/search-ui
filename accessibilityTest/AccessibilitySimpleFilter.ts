import * as axe from 'axe-core';
import { $$, Component, SimpleFilter } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';

export const AccessibilitySimpleFilter = () => {
  describe('SimpleFilter', () => {
    it('should be accessible', async done => {
      const simpleFilterElement = $$('div', {
        className: Component.computeCssClassName(SimpleFilter),
        'data-field': '@filetype'
      });

      getResultsColumn().appendChild(simpleFilterElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
