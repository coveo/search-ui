import { HierarchicalFacetSearchController } from '../../src/controllers/HierarchicalFacetSearchController';
import { DynamicHierarchicalFacetTestUtils } from '../ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetTestUtils';
import { DynamicHierarchicalFacet } from '../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacet';
import { IFacetSearchRequest, FacetSearchType } from '../../src/rest/Facet/FacetSearchRequest';
import { flatten } from 'underscore';
import { IDynamicHierarchicalFacetOptions } from '../../src/ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';

export function HierarchicalFacetSearchControllerTest() {
  describe('HierarchicalFacetSearchController', () => {
    let facet: DynamicHierarchicalFacet;
    let facetSearchController: HierarchicalFacetSearchController;
    let facetSearchSpy: jasmine.Spy;
    const facetValuesMultiplier = 2;

    beforeEach(() => {
      initializeComponents();
    });

    function initializeComponents(options: Partial<IDynamicHierarchicalFacetOptions> = {}) {
      facet = DynamicHierarchicalFacetTestUtils.createAdvancedFakeFacet({
        field: 'field',
        delimitingCharacter: '-',
        basePath: ['test', 'hello'],
        ...options
      }).cmp;
      facet.values.createFromResponse(DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet));

      facetSearchController = new HierarchicalFacetSearchController(facet);
      facetSearchSpy = facet.queryController.getEndpoint().facetSearch as jasmine.Spy;
    }

    it('should trigger a facet search request with the right parameters', () => {
      const query = 'my query';
      facetSearchController.search(query);

      const expectedRequest: IFacetSearchRequest = {
        field: facet.fieldName,
        filterFacetCount: true,
        type: FacetSearchType.hierarchical,
        numberOfValues: facet.options.numberOfValues * facetValuesMultiplier,
        ignorePaths: [flatten(facet.values.selectedPath, true)],
        basePath: facet.options.basePath,
        captions: {},
        searchContext: facet.queryController.getLastQuery(),
        delimitingCharacter: facet.options.delimitingCharacter,
        query: `*${query}*`
      };

      expect(facetSearchSpy).toHaveBeenCalledWith(expectedRequest);
    });

    it(`when facet option #filterFacetCount is false,
    the facet search request #filterFacetCount is also false`, () => {
      initializeComponents({ filterFacetCount: false });
      facetSearchController.search('');

      expect(facetSearchSpy.calls.mostRecent().args[0].filterFacetCount).toBe(false);
    });

    it(`when calling fetchMoreResults
    should search with the same terms but bump the number of values`, () => {
      const query = 'my query';
      const page = 2;
      facetSearchController.search(query);
      facetSearchController.fetchMoreResults();

      expect(facetSearchSpy.calls.mostRecent().args[0]).toEqual(
        jasmine.objectContaining({
          numberOfValues: facet.options.numberOfValues * facetValuesMultiplier * page,
          query: `*${query}*`
        })
      );
    });

    it(`when calling search after fetchMoreResults
    should reset the number of values and update the query`, () => {
      const query = 'second query';
      const page = 1;
      facetSearchController.search('first query');
      facetSearchController.fetchMoreResults();
      facetSearchController.search(query);

      expect(facetSearchSpy.calls.mostRecent().args[0]).toEqual(
        jasmine.objectContaining({
          numberOfValues: facet.options.numberOfValues * facetValuesMultiplier * page,
          query: `*${query}*`
        })
      );
    });
  });
}
