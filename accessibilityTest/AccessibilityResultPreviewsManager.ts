import * as axe from 'axe-core';
import { $$, Component, QuerySuggestPreview, Searchbox, InputManager } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, getSearchSection } from './Testing';
import { toArray } from 'lodash';

enum KeyboardKey {
  UpArrow = 38,
  DownArrow = 40
}

function noop() {}

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
      getSearchSection().appendChild(querySuggestPreviewElement);
    }

    function getInput() {
      return searchBoxElement.getElementsByTagName('input')[0];
    }

    function pressKeyboardKey(keyCode: KeyboardKey) {
      const inputManager = getSearchBox()['searchbox'].magicBox['inputManager'] as InputManager;
      const key: Partial<KeyboardEvent> = { keyCode, stopPropagation: noop, preventDefault: noop };
      inputManager['keydown'](key);
      inputManager['keyup'](key);
    }

    function waitForElement(parent: HTMLElement, condition: (addedElement: HTMLElement) => boolean, subtree = false): Promise<HTMLElement> {
      return new Promise(resolve => {
        const observer = new MutationObserver(mutations => {
          for (let mutation of mutations) {
            if (mutation.type === 'childList') {
              for (let addedNode of toArray<HTMLElement>((mutation.addedNodes as any) as ArrayLike<HTMLElement>)) {
                if (condition(addedNode)) {
                  resolve(addedNode);
                  observer.disconnect();
                  return;
                }
              }
            }
          }
        });

        observer.observe(parent, { childList: true, subtree });
      });
    }

    async function waitForSuggestions() {
      await waitForElement(searchBoxElement, element => element.classList.contains('magic-box-suggestion'), true);
    }

    async function waitForPreviews() {
      await waitForElement(searchBoxElement, element => element.classList.contains('coveo-preview-selectable'), true);
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
