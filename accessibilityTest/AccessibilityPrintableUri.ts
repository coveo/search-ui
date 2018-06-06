import * as axe from 'axe-core';
import { $$, Component, PrintableUri } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityPrintableUri = () => {
  describe('PrintableUri', () => {
    it('should be accessible', async done => {
      const printableUriElement = $$('div', {
        className: Component.computeCssClassName(PrintableUri)
      });

      testResultElement(printableUriElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
