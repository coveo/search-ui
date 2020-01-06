import * as axe from 'axe-core';
import { $$, Component, Facet, get } from 'coveo-search-ui';
import { afterDeferredQuerySuccess, afterDelay, getFacetColumn, getRoot, inDesktopMode, resetMode } from './Testing';

export const AccessibilityFacet = () => {
  describe('Facet', () => {
    const getFacetElement = () => {
      return $$('div', { className: Component.computeCssClassName(Facet), 'data-field': '@objecttype' });
    };

    beforeEach(() => {
      inDesktopMode();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible', async done => {
      getFacetColumn().appendChild(getFacetElement().el);
      await afterDeferredQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('search should be accessible', async done => {
      const facetElement = getFacetElement();
      getFacetColumn().appendChild(facetElement.el);
      await afterDeferredQuerySuccess();
      (get(facetElement.el) as Facet).facetSearch.focus();
      await afterDelay(1000);
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should still be accessible when search has been opened', async done => {
      const facetElement = getFacetElement();
      getFacetColumn().appendChild(facetElement.el);
      await afterDeferredQuerySuccess();
      (get(facetElement.el) as Facet).facetSearch.focus();
      await afterDelay(1000);
      (get(facetElement.el) as Facet).facetSearch.dismissSearchResults();
      await afterDelay(1000);
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('settings should be accessible', async done => {
      const facetElement = getFacetElement();
      getFacetColumn().appendChild(facetElement.el);
      await afterDeferredQuerySuccess();
      facetElement.find('.coveo-facet-header-settings').click();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
