import { HierarchicalFacetSearchController } from '../../src/controllers/HierarchicalFacetSearchController';
import { DynamicHierarchicalFacetTestUtils } from '../ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetTestUtils';
import { DynamicHierarchicalFacet } from '../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacet';
import { IFacetSearchRequest, FacetSearchType } from '../../src/rest/Facet/FacetSearchRequest';
import { flatten } from 'underscore';

export function HierarchicalFacetSearchControllerTest() {
  describe('HierarchicalFacetSearchController', () => {
    let facet: DynamicHierarchicalFacet;
    let facetSearchController: HierarchicalFacetSearchController;
    let facetSearchSpy: jasmine.Spy;
    const facetValuesMultiplier = 2;

    beforeEach(() => {
      initializeComponents();
      facetSearchSpy = facet.queryController.getEndpoint().facetSearch as jasmine.Spy;
    });

    function initializeComponents() {
      facet = DynamicHierarchicalFacetTestUtils.createAdvancedFakeFacet({
        field: 'field',
        delimitingCharacter: '-',
        basePath: ['test', 'hello']
      }).cmp;
      facet.values.createFromResponse(DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet));

      facetSearchController = new HierarchicalFacetSearchController(facet);
    }

    it('should trigger a facet search request with the right parameters', () => {
      const query = 'my query';
      facetSearchController.search(query);

      const expectedRequest: IFacetSearchRequest = {
        field: facet.fieldName,
        type: FacetSearchType.hierarchical,
        numberOfValues: facet.values.allFacetValues.length * facetValuesMultiplier,
        ignorePaths: [flatten(facet.values.selectedPath, true)],
        basePath: facet.options.basePath,
        captions: {},
        searchContext: facet.queryController.getLastQuery(),
        delimitingCharacter: facet.options.delimitingCharacter,
        query: `*${query}*`
      };

      expect(facetSearchSpy).toHaveBeenCalledWith(expectedRequest);
    });

    it(`when calling fetchMoreResults
    should search with the same terms but bump the number of values`, () => {
      const query = 'my query';
      const page = 2;
      facetSearchController.search(query);
      facetSearchController.fetchMoreResults();

      expect(facetSearchSpy.calls.mostRecent().args[0]).toEqual(
        jasmine.objectContaining({
          numberOfValues: facet.values.allFacetValues.length * facetValuesMultiplier * page,
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
          numberOfValues: facet.values.allFacetValues.length * facetValuesMultiplier * page,
          query: `*${query}*`
        })
      );
    });
  });
}
