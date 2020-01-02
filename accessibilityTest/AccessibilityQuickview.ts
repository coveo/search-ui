import * as axe from 'axe-core';
import { $$, Quickview, Component, get, Dom } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement } from './Testing';

function nodeListToArray<T extends Node>(nodeList: NodeListOf<T>) {
  const result: T[] = [];
  for (let i = 0; i < nodeList.length; i++) {
    result.push(nodeList.item(i));
  }
  return result;
}

function getFocusableElements() {
  return nodeListToArray<HTMLElement>(
    document.querySelectorAll(`
      a[href]:not([tabindex='-1']),
      area[href]:not([tabindex='-1']),
      input:not([disabled]):not([tabindex='-1']),
      select:not([disabled]):not([tabindex='-1']),
      textarea:not([disabled]):not([tabindex='-1']),
      button:not([disabled]):not([tabindex='-1']),
      iframe:not([tabindex='-1']),
      [tabindex]:not([tabindex='-1']),
      [contentEditable=true]:not([tabindex='-1'])
    `)
  ).sort((a, b) => a.tabIndex - b.tabIndex);
}

function getNextFocusableElement() {
  const elements = getFocusableElements();
  const currentIndex = document.activeElement ? elements.indexOf(document.activeElement as HTMLElement) : -1;
  return elements[(currentIndex + 1) % elements.length];
}

function simulateTabKey() {
  const event = new KeyboardEvent('keydown');
  Object.defineProperty(event, 'keyCode', { get: () => 9 });
  document.body.dispatchEvent(event);
  if (!event.defaultPrevented) {
    getNextFocusableElement().focus();
  }
}

export const AccessibilityQuickview = () => {
  describe('Quickview', () => {
    async function openQuickview() {
      await (get(document.querySelector(`.${Component.computeCssClassName(Quickview)}`)) as Quickview).open();
    }

    let quickviewElement: Dom;
    beforeEach(async done => {
      quickviewElement = $$('div', {
        className: Component.computeCssClassName(Quickview)
      });

      testResultElement(quickviewElement.el);
      await afterQuerySuccess();
      done();
    });

    it('should be accessible', async done => {
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when opened', async done => {
      await openQuickview();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should have a close button when opened', async done => {
      await openQuickview();
      expect(document.querySelector('.coveo-small-close')).not.toBeNull();
      done();
    });

    it('should select the close button when opened', async done => {
      await openQuickview();
      expect(document.activeElement).toBe(document.querySelector('.coveo-small-close'));
      done();
    });

    it('should wrap the focus when pressing tab', async done => {
      await openQuickview();
      const container: HTMLElement = document.querySelector('.coveo-modal-container');
      const initialFocus = document.activeElement;
      const maxAttempts = 200;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        simulateTabKey();
        if (document.activeElement === initialFocus || !container.contains(document.activeElement)) {
          break;
        }
      }
      expect(document.activeElement.outerHTML).toBe(initialFocus.outerHTML);
      done();
    });
  });
};
