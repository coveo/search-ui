import * as axe from 'axe-core';
import { $$, Component, FacetRange } from 'coveo-search-ui';
import { afterDeferredQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode } from './Testing';

export const AccessibilityFacetRange = () => {
  describe('FacetRange', () => {
    const getFacetElement = () => {
      return $$('div', {
        className: Component.computeCssClassName(FacetRange),
        'data-field': '@date',
        'data-date-field': true
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
