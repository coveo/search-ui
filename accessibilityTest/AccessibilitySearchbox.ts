import * as axe from 'axe-core';
import { $$, Component, Searchbox, get } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, getSearchSection } from './Testing';

export const AccessibilitySearchbox = () => {
  describe('Searchbox', () => {
    let searchBoxElement: HTMLElement;

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
