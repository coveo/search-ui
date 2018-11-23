import * as axe from 'axe-core';
import { $$, AdvancedSearch, Component, get } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';

export const AccessibilityAdvancedSearch = () => {
  describe('AdvancedSearch', () => {
    const getAdvancedSearchElement = () => {
      return $$('div', { className: Component.computeCssClassName(AdvancedSearch) });
    };

    it('should be accessible', async done => {
      const advancedSearchElement = getAdvancedSearchElement();
      getResultsColumn().appendChild(advancedSearchElement.el);
      await afterQuerySuccess();
      const advancedSearch = get(advancedSearchElement.el) as AdvancedSearch;
      advancedSearch.open();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
