import * as axe from 'axe-core';
import { $$, Component, DidYouMean } from 'coveo-search-ui';
import { addBasicExpression, afterQuerySuccess, getResultsColumn, getRoot } from './Testing';

export const AccessibilityDidYouMean = () => {
  describe('DidYouMean', () => {
    beforeEach(() => {
      addBasicExpression('testt');
    });

    it('should be accessible', async done => {
      const didYouMeanElement = $$('div', {
        className: Component.computeCssClassName(DidYouMean),
        'data-enable-auto-correction': false
      });

      getResultsColumn().appendChild(didYouMeanElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
