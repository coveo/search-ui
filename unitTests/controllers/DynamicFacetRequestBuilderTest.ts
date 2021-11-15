import { DynamicFacetRequestBuilder } from '../../src/controllers/DynamicFacetRequestBuilder';
import { IFacetRequest } from '../../src/rest/Facet/FacetRequest';

export function DynamicFacetRequestBuilderTest() {
  describe('DynamicFacetRequestBuilder', () => {
    let requestBuilder: DynamicFacetRequestBuilder;
    let facetRequest: IFacetRequest = {
      facetId: 'id_facet',
      field: 'field'
    };

    function initializeRequestBuilder() {
      requestBuilder = new DynamicFacetRequestBuilder(facetRequest);
    }

    describe('testing "filterFacetCount"', () => {
      it(`when "filterFacetCount" is not initially defined
      "filterFacetCount" should be "true"`, () => {
        initializeRequestBuilder();
        expect(requestBuilder.buildBaseRequestForQuery().filterFacetCount).toBe(true);
      });

      it(`when "filterFacetCount" is initially defined
      "filterFacetCount" should stay the same`, () => {
        facetRequest.filterFacetCount = false;
        initializeRequestBuilder();
        expect(requestBuilder.buildBaseRequestForQuery().filterFacetCount).toBe(false);
      });
    });
  });
}
