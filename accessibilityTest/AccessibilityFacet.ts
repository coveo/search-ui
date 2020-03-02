import * as axe from 'axe-core';
import { $$, Component, Facet, get, Dom } from 'coveo-search-ui';
import { afterDeferredQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode, afterQuerySelector } from './Testing';
import { ContrastChecker } from './ContrastChecker';

const searchContainerSelector = '.coveo-facet-search-results';

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

    describe('with facet element', () => {
      let facetElement: Dom;

      function getMagnifierSVG() {
        return facetElement.el.querySelector<HTMLElement>('.coveo-facet-search-magnifier-svg');
      }

      function getExcludeIcon() {
        return facetElement.el.querySelector<HTMLElement>('.coveo-facet-value-exclude-svg');
      }

      function getSearchButton() {
        return facetElement.el.querySelector<HTMLElement>('.coveo-facet-search-button .coveo-facet-value-checkbox');
      }

      beforeEach(async done => {
        facetElement = getFacetElement();
        getFacetColumn().appendChild(facetElement.el);
        await afterDeferredQuerySuccess();
        done();
      });

      it('settings should be accessible', async done => {
        facetElement.find('.coveo-facet-header-settings').click();
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should have good contrast on exclude buttons', () => {
        const borderContrast = ContrastChecker.getContrastWithBackground(getExcludeIcon(), 'borderBottomColor');
        expect(borderContrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
      });

      it('should have good contrast on the search button', () => {
        const borderContrast = ContrastChecker.getContrastWithBackground(getSearchButton(), 'borderBottomColor');
        expect(borderContrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
      });

      describe('after focusing on the search button', () => {
        beforeEach(async done => {
          (get(facetElement.el) as Facet).facetSearch.focus();
          await afterQuerySelector(document.body, searchContainerSelector);
          done();
        });

        it('search should be accessible', async done => {
          const axeResults = await axe.run(getRoot());
          expect(axeResults).toBeAccessible();
          done();
        });

        it('should still be accessible when search has been opened', async done => {
          (get(facetElement.el) as Facet).facetSearch.dismissSearchResults();
          const axeResults = await axe.run(getRoot());
          expect(axeResults).toBeAccessible();
          done();
        });

        it('should have good contrast on the search icon', async done => {
          const contrast = ContrastChecker.getContrastWithBackground(getMagnifierSVG());
          expect(contrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
          done();
        });
      });
    });
  });
};
