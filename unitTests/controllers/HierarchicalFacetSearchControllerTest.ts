import { HierarchicalFacetSearchController } from '../../src/controllers/HierarchicalFacetSearchController';
import { DynamicHierarchicalFacetTestUtils } from '../ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetTestUtils';
import { DynamicHierarchicalFacet } from '../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacet';
import { IDynamicHierarchicalFacetOptions } from '../../src/ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { IFacetSearchRequest, FacetSearchType } from '../../src/rest/Facet/FacetSearchRequest';
import { flatten } from 'underscore';

export function HierarchicalFacetSearchControllerTest() {
  describe('HierarchicalFacetSearchController', () => {
    let facet: DynamicHierarchicalFacet;
    let facetSearchController: HierarchicalFacetSearchController;

    beforeEach(() => {
      initializeComponents();
    });

    function initializeComponents(options?: IDynamicHierarchicalFacetOptions) {
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
        numberOfValues: facet.values.allFacetValues.length * 2,
        ignorePaths: [flatten(facet.values.selectedPath, true)],
        basePath: facet.options.basePath,
        captions: {},
        searchContext: facet.queryController.getLastQuery(),
        delimitingCharacter: facet.options.delimitingCharacter,
        query: `*${query}*`
      };

      expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalledWith(expectedRequest);
    });
  });
}
