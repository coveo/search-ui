import * as axe from 'axe-core';
import {
  $$,
  AdvancedSearch,
  Breadcrumb,
  Component,
  Facet,
  HiddenQuery,
  SimpleFilter,
  TextInput,
  executeQuery,
  get,
  state
} from 'coveo-search-ui';
import { afterDeferredQuerySuccess, afterInit, afterQuerySuccess, getFacetColumn, getResultsColumn, getRoot } from './Testing';

export const AccessibilityBreadcrumb = () => {
  describe('Breadcrumb', () => {
    const getBreadcrumbElement = () => {
      return $$('div', {
        className: Component.computeCssClassName(Breadcrumb)
      });
    };

    it('should be accessible for facets', async done => {
      const breadcrumbElement = getBreadcrumbElement();

      const facetElement = $$('div', {
        className: Component.computeCssClassName(Facet),
        'data-field': '@filetype'
      });

      getFacetColumn().appendChild(facetElement.el);
      getResultsColumn().appendChild(breadcrumbElement.el);
      await afterDeferredQuerySuccess();

      const facet = get(facetElement.el) as Facet;
      facet.selectValue(facet.getDisplayedFacetValues()[0]);
      executeQuery(getRoot());

      await afterDeferredQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible for advanced search', async done => {
      const breadcrumbElement = getBreadcrumbElement();

      const advancedSearchElement = $$('div', {
        className: Component.computeCssClassName(AdvancedSearch)
      });

      getResultsColumn().appendChild(advancedSearchElement.el);
      getResultsColumn().appendChild(breadcrumbElement.el);
      await afterQuerySuccess();

      const advancedSearch = get(advancedSearchElement.el) as AdvancedSearch;
      (advancedSearch.inputs[0]['input'] as TextInput).setValue('test');

      executeQuery(getRoot());
      await afterDeferredQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible for hidden query', async done => {
      const breadcrumbElement = getBreadcrumbElement();

      const hiddenQueryElement = $$('div', {
        className: Component.computeCssClassName(HiddenQuery)
      });

      getResultsColumn().appendChild(breadcrumbElement.el);
      getResultsColumn().appendChild(hiddenQueryElement.el);

      await afterInit();
      state(getRoot(), 'hq', 'hidden query');
      state(getRoot(), 'hd', 'hidden description');
      executeQuery(getRoot());
      await afterDeferredQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible for simple filter', async done => {
      const breadcrumbElement = getBreadcrumbElement();

      const simpleFilterElement = $$('div', {
        className: Component.computeCssClassName(SimpleFilter),
        'data-field': '@objecttype'
      });

      getResultsColumn().appendChild(breadcrumbElement.el);
      getResultsColumn().appendChild(simpleFilterElement.el);

      await afterQuerySuccess();
      const simpleFilter = get(simpleFilterElement.el) as SimpleFilter;
      simpleFilter.selectValue('Board', true);
      await afterDeferredQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
