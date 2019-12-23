import * as axe from 'axe-core';
import { $$, Component, QuerySuggestPreview, Searchbox, InputManager } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, getSearchSection } from './Testing';

const maxServerResponseTime = 1200;
const executeQueryDelay = 250;

enum KeyboardKey {
  UpArrow = 38,
  DownArrow = 40
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export const AccessibilityResultPreviewsManager = () => {
  describe('ResultPreviewsManager', () => {
    let searchBoxElement: HTMLElement;
    function buildSearchBox() {
      searchBoxElement = $$('div', { className: Component.computeCssClassName(Searchbox) }).el;
      getSearchSection().appendChild(searchBoxElement);
    }

    function getSearchBox() {
      return Component.get(searchBoxElement, Searchbox) as Searchbox;
    }

    function buildQuerySuggestPreview() {
      const querySuggestPreviewElement = $$('div', { className: Component.computeCssClassName(QuerySuggestPreview) }).el;
      querySuggestPreviewElement.dataset.executeQueryDelay = executeQueryDelay.toString();
      getSearchSection().appendChild(querySuggestPreviewElement);
    }

    function getInput() {
      return searchBoxElement.getElementsByTagName('input')[0];
    }

    function pressKeyboardKey(keyCode: KeyboardKey) {
      const inputManager = getSearchBox()['searchbox'].magicBox['inputManager'] as InputManager;
      const key: Partial<KeyboardEvent> = { keyCode, stopPropagation: () => {}, preventDefault: () => {} };
      inputManager['keydown'](key);
      inputManager['keyup'](key);
    }

    async function waitForSuggestions() {
      await wait(maxServerResponseTime);
    }

    async function waitForPreviews() {
      await wait(executeQueryDelay + maxServerResponseTime);
    }

    async function focusOnFirstSuggestion() {
      getInput().focus();
      await waitForSuggestions();
      pressKeyboardKey(KeyboardKey.DownArrow);
    }

    beforeEach(() => {
      buildSearchBox();
      buildQuerySuggestPreview();
    });

    it('should be accessible', async done => {
      await afterQuerySuccess();
      await focusOnFirstSuggestion();
      await waitForPreviews();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
