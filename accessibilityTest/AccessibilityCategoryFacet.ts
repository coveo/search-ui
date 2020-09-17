import * as axe from 'axe-core';
import { $$, Component, CategoryFacet, get, Dom } from 'coveo-search-ui';
import { afterDeferredQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode, waitUntilSelectorIsPresent } from './Testing';
import { ContrastChecker } from './ContrastChecker';

export const AccessibilityCategoryFacet = () => {
  describe('CategoryFacet', () => {
    const getFacetElement = () => {
      return $$('div', { className: Component.computeCssClassName(CategoryFacet), 'data-field': '@objecttype' });
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
      let facet: CategoryFacet;

      function getMagnifierSVG() {
        return facetElement.el.querySelector<HTMLElement>('.coveo-facet-search-magnifier-svg');
      }

      function getSearchButton() {
        return facetElement.el.querySelector<HTMLElement>('.coveo-category-facet-search-icon');
      }

      beforeEach(async done => {
        facetElement = getFacetElement();
        getFacetColumn().appendChild(facetElement.el);
        await afterDeferredQuerySuccess();
        facet = get(facetElement.el) as CategoryFacet;
        done();
      });

      it('should have good contrast on the facet itself', () => {
        const borderContrast = ContrastChecker.getContrastWithBackground(facetElement.el, 'borderBottomColor');
        expect(borderContrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
      });

      it('should have good contrast on the search button', () => {
        const borderContrast = ContrastChecker.getContrastWithBackground(getSearchButton(), 'borderBottomColor');
        expect(borderContrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
      });

      describe('after focusing on the search button', () => {
        function hideFocusedSearchFacetValueStyle() {
          const focusedClass = 'coveo-facet-search-current-result';
          $$(getRoot())
            .findClass(focusedClass)[0]
            .classList.remove(focusedClass);
        }

        beforeEach(async done => {
          facet.categoryFacetSearch.focus();
          await waitUntilSelectorIsPresent(document.body, '.coveo-facet-search-results');
          done();
        });

        it('search should be accessible', async done => {
          hideFocusedSearchFacetValueStyle();
          const axeResults = await axe.run(getRoot());
          expect(axeResults).toBeAccessible();
          done();
        });

        it("should have a conformant contrast ratio on FacetSearch's border", () => {
          expect(
            ContrastChecker.getContrastWithBackground(facet.categoryFacetSearch.facetSearchElement.search, 'borderBottomColor')
          ).not.toBeLessThan(ContrastChecker.MinimumContrastRatio);
        });

        it("should have a conformant contrast ratio on facet search results' border", () => {
          expect(
            ContrastChecker.getContrastWithBackground(facet.categoryFacetSearch.facetSearchElement.searchResults, 'borderBottomColor')
          ).not.toBeLessThan(ContrastChecker.MinimumContrastRatio);
        });

        it('should have good contrast on the search icon', async done => {
          const contrast = ContrastChecker.getContrastWithBackground(getMagnifierSVG());
          expect(contrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
          done();
        });

        describe('after focusing on the search button with no results', () => {
          beforeEach(async done => {
            facet.categoryFacetSearch.facetSearchElement.emptyAndShowNoResults();
            done();
          });

          it("should still be accessible when there's no results", async done => {
            const axeResults = await axe.run(getRoot());
            expect(axeResults).toBeAccessible();
            done();
          });
        });
      });
    });
  });
};
