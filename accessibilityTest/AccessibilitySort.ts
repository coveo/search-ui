import * as axe from 'axe-core';
import { $$, Component, Sort, ResultList } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, getSortSection, getResultsColumn } from './Testing';

export const AccessibilitySort = () => {
  describe('Sort', () => {
    const getResultListStandardElement = () => {
      return $$('div', {
        className: Component.computeCssClassName(ResultList)
      });
    };

    it('should be accessible', async done => {
      const sortElement = $$('span', {
        className: Component.computeCssClassName(Sort),
        'data-sort-criteria': 'relevancy',
        'data-caption': 'Relevance'
      });

      getResultsColumn().appendChild(getResultListStandardElement().el);
      getSortSection().appendChild(sortElement.el);

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible with multiple consecutive sort element', async done => {
      const firstSortElement = $$('span', {
        className: Component.computeCssClassName(Sort),
        'data-sort-criteria': 'relevancy',
        'data-caption': 'Relevance'
      });

      const secondSortElement = $$('span', {
        className: Component.computeCssClassName(Sort),
        'data-sort-criteria': '@date ascending, @date descending',
        'data-caption': 'Date'
      });

      getResultsColumn().appendChild(getResultListStandardElement().el);
      getSortSection().appendChild(firstSortElement.el);
      getSortSection().appendChild(secondSortElement.el);

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
