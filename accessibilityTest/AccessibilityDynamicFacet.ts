import * as axe from 'axe-core';
import { $$, Component, DynamicFacet } from 'coveo-search-ui';
import { afterQuerySuccess, afterDelay, getFacetColumn, getRoot, inDesktopMode, resetMode, afterDeferredQuerySuccess } from './Testing';
import { KEYBOARD } from '../src/Core';
import { ContrastChecker } from './ContrastChecker';

export const AccessibilityDynamicFacet = () => {
  describe('DynamicFacet', () => {
    let dynamicFacet: HTMLElement;

    beforeEach(() => {
      dynamicFacet = $$('div', {
        className: Component.computeCssClassName(DynamicFacet),
        dataTitle: 'My Facet',
        dataField: '@objecttype',
        dataEnableCollapse: true,
        dataEnableFacetSearch: true
      }).el;

      inDesktopMode();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible', async done => {
      getFacetColumn().appendChild(dynamicFacet);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should have good contrast on the first value while focused', async done => {
      getFacetColumn().appendChild(dynamicFacet);
      await afterDeferredQuerySuccess();

      const firstValue = getFirstValue();
      firstValue.classList.add('coveo-focused');
      const contrast = ContrastChecker.getContrastWithBackground(firstValue.querySelector('.coveo-checkbox-span-label'));
      expect(contrast).not.toBeLessThan(ContrastChecker.MinimumHighContrastRatio);

      done();
    });

    it("should have good contrast on the first value's count while focused", async done => {
      getFacetColumn().appendChild(dynamicFacet);
      await afterDeferredQuerySuccess();

      const firstValue = getFirstValue();
      firstValue.classList.add('coveo-focused');
      const contrast = ContrastChecker.getContrastWithBackground(firstValue.querySelector('.coveo-checkbox-span-label-suffix'));
      expect(contrast).not.toBeLessThan(ContrastChecker.MinimumHighContrastRatio);

      done();
    });

    function getInput() {
      return $$(dynamicFacet).find('input');
    }

    function getFirstValue() {
      return $$(dynamicFacet).find('.coveo-dynamic-facet-value');
    }

    function triggerKeyboardEvent(name: string, key: KEYBOARD, input: HTMLElement) {
      const event = new KeyboardEvent(name);
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
    }

    async function loadSearchResultsForQuery(query = 'a', delay = 1000) {
      getInput().setAttribute('value', query);
      triggerKeyboardEvent('keyup', KEYBOARD.CTRL, getInput());
      await afterDelay(delay);
    }

    describe('facet search', () => {
      it('should be accessible with results', async done => {
        getFacetColumn().appendChild(dynamicFacet);
        await afterQuerySuccess();

        await loadSearchResultsForQuery();

        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should be accessible without results', async done => {
        getFacetColumn().appendChild(dynamicFacet);
        await afterQuerySuccess();

        await loadSearchResultsForQuery('a non relevant query');

        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should be accessible when selected a result with the keyboard', async done => {
        getFacetColumn().appendChild(dynamicFacet);
        await afterQuerySuccess();

        await loadSearchResultsForQuery();
        triggerKeyboardEvent('keydown', KEYBOARD.DOWN_ARROW, getInput());

        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should be accessible after being cleared', async done => {
        getFacetColumn().appendChild(dynamicFacet);
        await afterQuerySuccess();

        await loadSearchResultsForQuery();
        await loadSearchResultsForQuery('', 0);

        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });
    });
  });
};
