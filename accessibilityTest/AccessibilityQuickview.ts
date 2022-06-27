import * as axe from 'axe-core';
import { $$, Quickview, Component, get, Dom } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement, getModal, waitUntilSelectorIsPresent } from './Testing';

export const AccessibilityQuickview = () => {
  describe('Quickview', () => {
    async function openQuickview() {
      await (get(document.querySelector(`.${Component.computeCssClassName(Quickview)}`)) as Quickview).open();
    }

    function getQuickviewCloseButton(): HTMLElement {
      return document.querySelector('.coveo-small-close');
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

    it('should open an accessible modal', async done => {
      await openQuickview();
      if (!getModal().querySelector('.coveo-iframeWrapper iframe')) {
        await waitUntilSelectorIsPresent(getModal(), '.coveo-iframeWrapper iframe');
      }
      const axeResults = await axe.run(getModal());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should have a close button when opened', async done => {
      await openQuickview();
      expect(getQuickviewCloseButton()).not.toBeNull();
      done();
    });

    it('should select the close button when opened', async done => {
      await openQuickview();
      expect(document.activeElement).toBe(getQuickviewCloseButton());
      done();
    });
  });
};
