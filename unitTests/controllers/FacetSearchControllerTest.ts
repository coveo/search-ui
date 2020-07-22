import { FacetSearchController } from '../../src/controllers/FacetSearchController';
import { DynamicFacetTestUtils } from '../ui/DynamicFacet/DynamicFacetTestUtils';
import { DynamicFacet } from '../../src/ui/DynamicFacet/DynamicFacet';
import { IDynamicFacetOptions } from '../../src/ui/DynamicFacet/IDynamicFacet';
import { IFacetSearchRequest } from '../../src/rest/Facet/FacetSearchRequest';
import { FileTypes } from '../../src/ui/Misc/FileTypes';

export function FacetSearchControllerTest() {
  describe('FacetSearchController', () => {
    let facet: DynamicFacet;
    let facetSearchController: FacetSearchController;

    beforeEach(() => {
      initializeComponents();
    });

    function initializeComponents(options?: IDynamicFacetOptions) {
      facet = DynamicFacetTestUtils.createAdvancedFakeFacet(options).cmp;
      facet.values.createFromResponse(DynamicFacetTestUtils.getCompleteFacetResponse(facet));

      facetSearchController = new FacetSearchController(facet);
    }

    it('should trigger a facet search request with the right parameters', () => {
      const query = 'my query';
      facetSearchController.search(query);

      const expectedRequest: IFacetSearchRequest = {
        field: facet.fieldName,
        numberOfValues: facet.options.numberOfValues,
        ignoreValues: facet.values.activeValues.map(value => value.value),
        captions: {},
        searchContext: facet.queryController.getLastQuery(),
        query: `*${query}*`
      };

      expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalledWith(expectedRequest);
    });

    function testHasTypesCaptions() {
      facetSearchController.search('q');

      const expectedPartialRequest = {
        captions: FileTypes.getFileTypeCaptions()
      };

      expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalledWith(jasmine.objectContaining(expectedPartialRequest));
    }

    it('should add types captions if the field is @filetype', () => {
      initializeComponents({ field: '@filetype' });
      testHasTypesCaptions();
    });

    it('should add types captions if the field is @objecttype', () => {
      initializeComponents({ field: '@objecttype' });
      testHasTypesCaptions();
    });

    it('should add months captions if the field is @month', () => {
      initializeComponents({ field: '@month' });
      facetSearchController.search('q');

      const expectedPartialRequest = {
        captions: {
          '01': 'January',
          '02': 'February',
          '03': 'March',
          '04': 'April',
          '05': 'May',
          '06': 'June',
          '07': 'July',
          '08': 'August',
          '09': 'September',
          '10': 'October',
          '11': 'November',
          '12': 'December'
        }
      };

      expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalledWith(jasmine.objectContaining(expectedPartialRequest));
    });

    it(`when facet option "optionalLeadingWildcard" is false
    should not prepend the query with a wildcard`, () => {
      facet.options.useLeadingWildcardInFacetSearch = false;

      const query = 'my query';
      facetSearchController.search(query);

      const queryWithEndWildcardOnly = `${query}*`;

      expect(facet.queryController.getEndpoint().facetSearch).toHaveBeenCalledWith(
        jasmine.objectContaining({ query: queryWithEndWildcardOnly })
      );
    });
  });
}
