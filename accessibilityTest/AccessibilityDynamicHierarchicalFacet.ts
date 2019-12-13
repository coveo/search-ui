import * as axe from 'axe-core';
import { $$, Component, DynamicHierarchicalFacet } from 'coveo-search-ui';
import { afterQuerySuccess, getFacetColumn, getRoot, inDesktopMode, resetMode } from './Testing';

export const AccessibilityDynamicHierarchicalFacet = () => {
  describe('DynamicHierarchicalFacet', () => {
    let dynamicHierarchicalFacet: HTMLElement;

    beforeEach(() => {
      dynamicHierarchicalFacet = $$('div', {
        className: Component.computeCssClassName(DynamicHierarchicalFacet),
        dataTitle: 'My Facet',
        dataField: '@objecttype',
        dataEnableCollapse: true
      }).el;

      inDesktopMode();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible', async done => {
      getFacetColumn().appendChild(dynamicHierarchicalFacet);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
