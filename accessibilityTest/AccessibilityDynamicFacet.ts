import * as axe from 'axe-core';
import { $$, Component, DynamicFacet } from 'coveo-search-ui';
import { afterQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode } from './Testing';

export const AccessibilityDynamicFacet = () => {
  describe('DynamicFacet', () => {
    const dynamicFacet = $$('div', { className: Component.computeCssClassName(DynamicFacet), 'data-field': '@objecttype' }).el;

    beforeEach(() => {
      inDesktopMode();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible', async done => {
      getFacetColumn().appendChild(dynamicFacet);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
