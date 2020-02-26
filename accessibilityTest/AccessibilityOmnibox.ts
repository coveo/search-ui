import * as axe from 'axe-core';
import { $$, Component, Omnibox, get, Dom, Facet, AnalyticsSuggestions, Analytics, OmniboxResultList } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, getSearchSection, afterDelay, getResultsColumn } from './Testing';
import { KEYBOARD } from '../src/utils/KeyboardUtils';
import { times } from 'underscore';
import { ContrastChecker } from './ContrastChecker';

function getSuggestionsBox() {
  return getSearchSection().querySelector<HTMLElement>('.coveo-magicbox-suggestions');
}

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

    describe('with keyboard navigation', () => {
      let input: HTMLInputElement;

      const triggerEvent = (key: KEYBOARD) => {
        const event = new KeyboardEvent('keyup');
        Object.defineProperty(event, 'keyCode', {
          get: () => {
            return key;
          }
        });
        Object.defineProperty(event, 'which', {
          get: () => {
            return key;
          }
        });
        input.dispatchEvent(event);
      };

      const down = () => triggerEvent(KEYBOARD.DOWN_ARROW);
      const up = () => triggerEvent(KEYBOARD.UP_ARROW);

      beforeEach(async done => {
        const omniboxElement = getOmniboxElement();
        getSearchSection().appendChild(omniboxElement.el);
        await afterQuerySuccess();
        showSuggestions(omniboxElement);
        await afterDelay(500);
        input = omniboxElement.find('input') as HTMLInputElement;
        input.focus();
        done();
      });

      it('should have good contrast on the border of the suggestions box', () => {
        const borderContrast = ContrastChecker.getContrastWithBackground(getSuggestionsBox(), 'borderBottomColor');
        expect(borderContrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
      });

      it('should be accessible when navigating using keyboard down arrow once', async done => {
        down();
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should be accessible when navigating using keyboard up arrow once', async done => {
        up();
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should be accessible when navigating using keyboard down arrow multiple time (wrapping around)', async done => {
        times(10, () => down());
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should be accessible when navigating using keyboard up arrow multiple time (wrapping around)', async done => {
        times(10, () => up());
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });
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
