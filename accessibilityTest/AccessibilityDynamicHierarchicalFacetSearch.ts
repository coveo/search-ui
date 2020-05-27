import * as axe from 'axe-core';
import {
  DynamicHierarchicalFacet,
  Component,
  $$,
  DynamicHierarchicalFacetSearch,
  HierarchicalFacetSearchController,
  IFacetSearchResultValue
} from 'coveo-search-ui';
import { inDesktopMode, resetMode, getFacetColumn, afterDeferredQuerySuccess, waitUntilSelectorIsPresent } from './Testing';

export const AccessibilityDynamicHierarchicalFacetSearch = () => {
  describe('DynamicHierarchicalFacetSearch', () => {
    let dynamicHierarchicalFacet: DynamicHierarchicalFacet;
    let dynamicHierarchicalFacetSearch: DynamicHierarchicalFacetSearch;

    async function initializeHierarchicalFacet() {
      const dynamicHierarchicalFacetElement = $$('div', {
        className: Component.computeCssClassName(DynamicHierarchicalFacet),
        dataTitle: 'My Facet',
        dataField: '@champion_categories',
        dataEnableCollapse: true,
        dataEnableFacetSearch: true
      }).el;
      getFacetColumn().appendChild(dynamicHierarchicalFacetElement);
      await afterDeferredQuerySuccess();
      dynamicHierarchicalFacet = Component.get(dynamicHierarchicalFacetElement, DynamicHierarchicalFacet) as DynamicHierarchicalFacet;
      dynamicHierarchicalFacet.ensureDom();
    }

    function createMockFacetSearchResult(path: string[]): IFacetSearchResultValue {
      return {
        displayValue: 'abc',
        path,
        rawValue: 'abc',
        count: 1234,
        moreValuesAvailable: false
      };
    }

    function createMockQueryController() {
      return <HierarchicalFacetSearchController>{
        search: () =>
          Promise.resolve({
            values: [
              createMockFacetSearchResult(['aaa']),
              createMockFacetSearchResult(['aaa', 'bbb', 'ccc', 'ddd']),
              createMockFacetSearchResult(['aaa', 'bbb', 'ccc', 'ddd', 'eee']),
              createMockFacetSearchResult(['aaa', 'bbb', 'ccc', 'ddd', 'fff'])
            ]
          })
      };
    }

    function prepareDynamicHierarchicalFacetSearch() {
      dynamicHierarchicalFacetSearch = dynamicHierarchicalFacet['search'];
      dynamicHierarchicalFacetSearch['hierarchicalFacetSearchController'] = createMockQueryController();
    }

    beforeEach(async done => {
      inDesktopMode();
      await initializeHierarchicalFacet();
      prepareDynamicHierarchicalFacetSearch();
      done();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible when collapsed', async done => {
      const axeResults = await axe.run(getFacetColumn());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when expanded', async done => {
      dynamicHierarchicalFacetSearch['combobox'].onInputChange('a');
      await waitUntilSelectorIsPresent(getFacetColumn(), '.coveo-dynamic-hierarchical-facet-search-value');

      const axeResults = await axe.run(getFacetColumn());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
