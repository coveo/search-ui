import * as axe from 'axe-core';
import { $$, Component, MLFacet } from 'coveo-search-ui';
import { afterQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode } from './Testing';

export const AccessibilityMLFacet = () => {
  describe('MLFacet', () => {
    const getFacetElement = () => {
      return $$('div', { className: Component.computeCssClassName(MLFacet), 'data-field': '@objecttype' });
    };

    beforeEach(() => {
      inDesktopMode();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible', async done => {
      getFacetColumn().appendChild(getFacetElement().el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
