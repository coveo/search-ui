import { FacetSearchController } from '../../src/controllers/FacetSearchController';
import { DynamicFacetTestUtils } from '../ui/DynamicFacet/DynamicFacetTestUtils';
import { DynamicFacet } from '../../src/ui/DynamicFacet/DynamicFacet';
import { IFacetSearchRequest } from '../../src/rest/Facet/FacetSearchRequest';

export function FacetSearchControllerTest() {
  describe('FacetSearchController', () => {
    let facet: DynamicFacet;
    let facetSearchController: FacetSearchController;

    beforeEach(() => {
      initializeComponents();
    });

    function initializeComponents() {
      facet = DynamicFacetTestUtils.createAdvancedFakeFacet().cmp;
      facet.values.createFromResponse(
        DynamicFacetTestUtils.getCompleteFacetResponse(facet, { values: DynamicFacetTestUtils.createFakeFacetValues() })
      );

      facetSearchController = new FacetSearchController(facet);
    }

    it('should trigger a facet search request with the right parameters', () => {
      const query = 'my query';
      facetSearchController.search(query);

      const expectedRequest: IFacetSearchRequest = {
        field: facet.fieldName,
        numberOfValues: facet.options.numberOfValues,
        ignoreValues: facet.values.allValues,
        captions: facet.options.valueCaption,
        searchContext: facet.queryController.getLastQuery(),
        query: `${query}*`
      };

      expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalledWith(expectedRequest);
    });

    it(`when facet option "optionalLeadingWildcard" is true
    should prepend the query with a wildcard`, () => {
      facet.options.useLeadingWildcardInFacetSearch = true;

      const query = 'my query';
      facetSearchController.search(query);

      const queryWithWildcards = `*${query}*`;

      expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalledWith(jasmine.objectContaining({ query: queryWithWildcards }));
    });
  });
}
