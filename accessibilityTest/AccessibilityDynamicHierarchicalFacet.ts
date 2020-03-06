import * as axe from 'axe-core';
import { $$, Component, DynamicHierarchicalFacet } from 'coveo-search-ui';
import { afterDeferredQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode } from './Testing';

export const AccessibilityDynamicHierarchicalFacet = () => {
  describe('DynamicHierarchicalFacet', () => {
    let dynamicHierarchicalFacet: HTMLElement;

    beforeEach(() => {
      dynamicHierarchicalFacet = $$('div', {
        className: Component.computeCssClassName(DynamicHierarchicalFacet),
        dataTitle: 'My Facet',
        dataField: '@champion_categories',
        dataEnableCollapse: true
      }).el;

      inDesktopMode();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible', async done => {
      getFacetColumn().appendChild(dynamicHierarchicalFacet);
      await afterDeferredQuerySuccess();
      $$(dynamicHierarchicalFacet)
        .find('.coveo-dynamic-hierarchical-facet-value')
        .click();
      await afterDeferredQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
