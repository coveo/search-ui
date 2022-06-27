import * as axe from 'axe-core';
import { $$, Quickview, Component, get, Dom } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement, getModal, waitUntilSelectorIsPresent, addFieldEqualFilter } from './Testing';

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
      addFieldEqualFilter('@author', ['Marie']);

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
      await waitUntilSelectorIsPresent(document.body, 'iframe[title]');
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
