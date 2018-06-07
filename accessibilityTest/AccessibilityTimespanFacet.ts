import * as axe from 'axe-core';
import { $$, Component, TimespanFacet } from 'coveo-search-ui';
import { afterDeferredQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode } from './Testing';

export const AccessibilityTimespanFacet = () => {
  describe('FacetTimespan', () => {
    const getFacetElement = () => {
      return $$('div', {
        className: Component.computeCssClassName(TimespanFacet)
      });
    };

    beforeEach(() => {
      inDesktopMode();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible', async done => {
      getFacetColumn().appendChild(getFacetElement().el);
      await afterDeferredQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
