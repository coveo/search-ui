import * as axe from 'axe-core';
import { $$, Component, FacetSlider } from 'coveo-search-ui';
import { afterDeferredQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode } from './Testing';

export const AccessibilityFacetSlider = () => {
  describe('FacetSlider', () => {
    const getFacetElement = () => {
      return $$('div', {
        className: Component.computeCssClassName(FacetSlider),
        'data-field': '@date',
        'data-date-field': true,
        'data-graph-steps': 10
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
