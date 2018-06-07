import * as axe from 'axe-core';
import { $$, Component, ResultActionsMenu, Quickview } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityResultActionMenu = () => {
  describe('ResultActionMenu', () => {
    it('should be accessible', async done => {
      const resultActionMenuElement = $$(
        'div',
        {
          className: Component.computeCssClassName(ResultActionsMenu)
        },
        $$('div', {
          className: Component.computeCssClassName(Quickview)
        })
      );

      testResultElement(resultActionMenuElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
