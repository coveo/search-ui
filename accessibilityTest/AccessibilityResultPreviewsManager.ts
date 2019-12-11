import * as axe from 'axe-core';
import { $$, Component, QuerySuggestPreview, Searchbox } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, getSearchSection } from './Testing';
import { KEYBOARD } from '../src/utils/KeyboardUtils';

export const AccessibilityResultPreviewsManager = () => {
  describe('ResultPreviewsManager', () => {
    let searchBoxElement: HTMLElement;
    function buildSearchBox() {
      searchBoxElement = $$('div', { className: Component.computeCssClassName(Searchbox) }).el;
      getSearchSection().appendChild(searchBoxElement);
    }

    function buildQuerySuggestPreview() {
      const querySuggestPreviewElement = $$('div', { className: Component.computeCssClassName(QuerySuggestPreview) }).el;
      getSearchSection().appendChild(querySuggestPreviewElement);
    }

    function getInput() {
      return searchBoxElement.getElementsByTagName('input')[0];
    }

    function triggerEvent(key: KEYBOARD) {
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
      getInput().dispatchEvent(event);
    }

    function deferAsync() {
      return new Promise(resolve => setTimeout(resolve));
    }

    function waitForElement(parent: HTMLElement, condition: (addedElement: HTMLElement) => boolean, subtree = false): Promise<HTMLElement> {
      return new Promise(resolve => {
        const observer = new MutationObserver(mutations => {
          for (let mutation of mutations) {
            if (mutation.type === 'childList') {
              for (let addedNode of _.toArray<HTMLElement>(mutation.addedNodes)) {
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
      await deferAsync();
    }

    async function waitForPreviews() {
      await waitForElement(searchBoxElement, element => element.classList.contains('coveo-preview-selectable'), true);
      await deferAsync();
    }

    async function triggerResultPreviewsManager() {
      getInput().focus();
      await waitForSuggestions();
      triggerEvent(KEYBOARD.DOWN_ARROW);
    }

    beforeEach(() => {
      buildSearchBox();
      buildQuerySuggestPreview();
    });

    it('should be accessible', async done => {
      await afterQuerySuccess();
      await triggerResultPreviewsManager();
      await waitForPreviews();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
