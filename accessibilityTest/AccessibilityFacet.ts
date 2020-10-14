import * as axe from 'axe-core';
import { $$, Component, Facet, get, Dom } from 'coveo-search-ui';
import { afterDeferredQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode, waitUntilSelectorIsPresent } from './Testing';
import { ContrastChecker } from './ContrastChecker';

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
      let facet: Facet;

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
        facet = get(facetElement.el) as Facet;
        done();
      });

      it('settings should be accessible', async done => {
        facetElement.find('.coveo-facet-header-settings').click();
        const axeResults = await axe.run(await waitUntilSelectorIsPresent(getRoot(), '.coveo-facet-settings-popup'));
        expect(axeResults).toBeAccessible();
        done();
      });

      it('disabled settings items should have good contrast', async done => {
        facetElement.find('.coveo-facet-header-settings').click();
        const settingsItem = await waitUntilSelectorIsPresent<HTMLElement>(
          getRoot(),
          '.coveo-facet-settings-disabled .coveo-facet-settings-item'
        );
        expect(ContrastChecker.getContrastWithBackground(settingsItem)).toBeGreaterThan(ContrastChecker.MinimumHighContrastRatio);
        done();
      });

      it('should have good contrast on the facet itself', () => {
        const borderContrast = ContrastChecker.getContrastWithBackground(facetElement.el, 'borderBottomColor');
        expect(borderContrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
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
          facet.facetSearch.focus();
          await waitUntilSelectorIsPresent(document.body, '.coveo-facet-search-results');
          done();
        });

        it('search should be accessible', async done => {
          const axeResults = await axe.run(getRoot());
          expect(axeResults).toBeAccessible();
          done();
        });

        it("should have a conformant contrast ratio on FacetSearch's border", () => {
          expect(ContrastChecker.getContrastWithBackground(facet.facetSearch.search, 'borderBottomColor')).not.toBeLessThan(
            ContrastChecker.MinimumContrastRatio
          );
        });

        it("should have a conformant contrast ratio on the facet search results' border", () => {
          expect(ContrastChecker.getContrastWithBackground(facet.facetSearch.searchResults, 'borderBottomColor')).not.toBeLessThan(
            ContrastChecker.MinimumContrastRatio
          );
        });

        it('should still be accessible when search has been dismissed', async done => {
          facet.facetSearch.dismissSearchResults();
          const axeResults = await axe.run(getRoot());
          expect(axeResults).toBeAccessible();
          done();
        });

        it('should have good contrast on the search icon', async done => {
          const contrast = ContrastChecker.getContrastWithBackground(getMagnifierSVG());
          expect(contrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
          done();
        });

        describe('after focusing on the search button with no results', () => {
          beforeEach(async done => {
            facet.facetSearch.facetSearchElement.emptyAndShowNoResults();
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
