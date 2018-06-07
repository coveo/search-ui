import * as axe from 'axe-core';
import { $$, Component, Omnibox, get, Dom, Facet, AnalyticsSuggestions, Analytics, OmniboxResultList } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, getSearchSection, afterDelay, getResultsColumn } from './Testing';

export const AccessibilityOmnibox = () => {
  describe('Omnibox', () => {
    const getOmniboxElement = () => {
      return $$('div', {
        className: Component.computeCssClassName(Omnibox)
      });
    };

    const showSuggestions = (omniboxElement: Dom) => {
      get(omniboxElement.el)['magicBox'].inputManager.onfocus();
    };

    const setText = (omniboxElement: Dom, text: string) => {
      (get(omniboxElement.el) as Omnibox).setText(text);
    };

    it('should be accessible', async done => {
      const omniboxElement = getOmniboxElement();
      getSearchSection().appendChild(omniboxElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible with standard query suggestion', async done => {
      const omniboxElement = getOmniboxElement();
      getSearchSection().appendChild(omniboxElement.el);
      await afterQuerySuccess();
      showSuggestions(omniboxElement);
      await afterDelay(500);
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    describe('with disabled standard query suggestions', () => {
      let omniboxElement: Dom;

      beforeEach(() => {
        omniboxElement = getOmniboxElement();
        omniboxElement.setAttribute('data-enable-query-suggest-addon', 'false');
        getSearchSection().appendChild(omniboxElement.el);
      });

      it('should be accessible with facet suggestion', async done => {
        const facetElement = $$('div', {
          className: Component.computeCssClassName(Facet),
          'data-field': '@objecttype',
          'data-include-in-omnibox': true
        });

        getResultsColumn().appendChild(facetElement.el);

        await afterQuerySuccess();
        setText(omniboxElement, 'm');
        showSuggestions(omniboxElement);
        await afterDelay(500);
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should be accessible with analytics suggestions', async done => {
        const analyticsSuggestionsElement = $$('div', {
          className: Component.computeCssClassName(AnalyticsSuggestions)
        });
        const analyticsElement = $$('div', {
          className: Component.computeCssClassName(Analytics)
        });
        getResultsColumn().appendChild(analyticsSuggestionsElement.el);
        getResultsColumn().appendChild(analyticsElement.el);

        await afterQuerySuccess();
        setText(omniboxElement, 'm');
        showSuggestions(omniboxElement);
        await afterDelay(1000);
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should be accessible with omnibox result list', async done => {
        const omniboxResultListElement = $$('div', {
          className: Component.computeCssClassName(OmniboxResultList)
        });

        getResultsColumn().appendChild(omniboxResultListElement.el);

        await afterQuerySuccess();
        setText(omniboxElement, 'm');
        showSuggestions(omniboxElement);
        await afterQuerySuccess();
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });
    });
  });
};
