import * as axe from 'axe-core';
import { $$, Component, Matrix } from 'coveo-search-ui';
import { getResultsColumn, getRoot, afterDeferredQuerySuccess } from './Testing';

export const AccessibilityMatrix = () => {
  describe('Matrix', () => {
    it('should be accessible', async done => {
      const matrixElement = $$('div', {
        className: Component.computeCssClassName(Matrix),
        'data-row-field': '@author',
        'data-column-field': '@filetype',
        'data-computed-field': '@size'
      });

      getResultsColumn().appendChild(matrixElement.el);
      await afterDeferredQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
