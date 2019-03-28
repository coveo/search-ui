import * as axe from 'axe-core';
import { $$, Component, MLFacet } from 'coveo-search-ui';
import { afterQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode } from './Testing';

export const AccessibilityMLFacet = () => {
  describe('MLFacet', () => {
    const mLFacet = $$('div', { className: Component.computeCssClassName(MLFacet), 'data-field': '@objecttype' }).el;

    beforeEach(() => {
      inDesktopMode();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible', async done => {
      getFacetColumn().appendChild(mLFacet);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
