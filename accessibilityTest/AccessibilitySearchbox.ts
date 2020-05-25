import * as axe from 'axe-core';
import { $$, Component, Searchbox, get, Omnibox, SearchButton } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, getSearchSection } from './Testing';
import { ContrastChecker } from './ContrastChecker';

export const AccessibilitySearchbox = () => {
  describe('Searchbox', () => {
    let searchBoxElement: HTMLElement;

    function getOmnibox() {
      return searchBoxElement.querySelector<HTMLElement>(`.${Component.computeCssClassName(Omnibox)}`);
    }

    function getSearchButton() {
      return searchBoxElement.querySelector<HTMLElement>(`.${Component.computeCssClassName(SearchButton)}`);
    }

    beforeEach(() => {
      searchBoxElement = $$('div', { className: Component.computeCssClassName(Searchbox) }).el;
      getSearchSection().appendChild(searchBoxElement);
    });

    it('should be accessible', async done => {
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should have good contrast on the border of the omnibox', async done => {
      await afterQuerySuccess();
      const borderContrast = ContrastChecker.getContrastWithBackground(getOmnibox(), 'borderBottomColor');
      expect(borderContrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
      done();
    });

    it('should have good contrast on the border of the search button', async done => {
      await afterQuerySuccess();
      const borderContrast = ContrastChecker.getContrastWithBackground(getSearchButton(), 'borderBottomColor');
      expect(borderContrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
      done();
    });

    it('should be accessible when focused', async done => {
      await afterQuerySuccess();
      searchBoxElement.querySelector('input').focus();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it("should be accessible when there's text", async done => {
      await afterQuerySuccess();
      (get(searchBoxElement) as Searchbox).searchbox.setText('test');
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
