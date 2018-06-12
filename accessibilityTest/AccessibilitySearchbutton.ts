import * as axe from 'axe-core';
import { $$, Component, SearchButton } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, getSearchSection } from './Testing';

export const AccessibilitySearchButton = () => {
  describe('SearchButton', () => {
    it('should be accessible', async done => {
      getSearchSection().appendChild($$('div', { className: Component.computeCssClassName(SearchButton) }).el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
