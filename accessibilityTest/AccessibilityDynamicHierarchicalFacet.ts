import * as axe from 'axe-core';
import { $$, Component, DynamicHierarchicalFacet } from 'coveo-search-ui';
import { afterDeferredQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode, waitUntilSelectorIsPresent } from './Testing';

export const AccessibilityDynamicHierarchicalFacet = () => {
  describe('DynamicHierarchicalFacet', () => {
    let dynamicHierarchicalFacet: DynamicHierarchicalFacet;

    async function initializeHierarchicalFacet() {
      const dynamicHierarchicalFacetElement = $$('div', {
        className: Component.computeCssClassName(DynamicHierarchicalFacet),
        dataTitle: 'My Facet',
        dataField: '@geographicalhierarchy',
        dataEnableCollapse: true
      }).el;
      getFacetColumn().appendChild(dynamicHierarchicalFacetElement);
      await afterDeferredQuerySuccess();
      dynamicHierarchicalFacet = Component.get(dynamicHierarchicalFacetElement, DynamicHierarchicalFacet) as DynamicHierarchicalFacet;
      dynamicHierarchicalFacet.ensureDom();
    }

    beforeEach(async done => {
      inDesktopMode();

      await initializeHierarchicalFacet();
      done();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible', async done => {
      (await waitUntilSelectorIsPresent<HTMLElement>(dynamicHierarchicalFacet.element, '.coveo-dynamic-hierarchical-facet-value')).click();
      await afterDeferredQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
