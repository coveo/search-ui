import { DynamicFacetRequestBuilder } from '../../src/controllers/DynamicFacetRequestBuilder';
import { IFacetRequest } from '../../src/rest/Facet/FacetRequest';
import { QueryBuilder } from '../../src/Core';

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
      when the "query" has no "filterField" defined
      "filterFacetCount" should be "true"`, () => {
        initializeRequestBuilder();
        const query = new QueryBuilder().build();
        expect(requestBuilder.buildBaseRequestForQuery(query).filterFacetCount).toBe(true);
      });

      it(`when "filterFacetCount" is not initially defined
      when the "query" has a "filterField" defined
      "filterFacetCount" should be "false"`, () => {
        initializeRequestBuilder();
        const query = new QueryBuilder().build();
        query.filterField = '@foldingCollection';
        expect(requestBuilder.buildBaseRequestForQuery(query).filterFacetCount).toBe(false);
      });

      it(`when "filterFacetCount" is initially defined
      "filterFacetCount" should stay the same`, () => {
        facetRequest.filterFacetCount = false;
        initializeRequestBuilder();
        const query = new QueryBuilder().build();
        expect(requestBuilder.buildBaseRequestForQuery(query).filterFacetCount).toBe(false);
      });
    });
  });
}
