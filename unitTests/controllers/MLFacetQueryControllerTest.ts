import { MLFacetQueryController } from '../../src/controllers/MLFacetQueryController';
import { MLFacet } from '../../src/ui/MLFacet/MLFacet';
import { MLFacetTestUtils } from '../ui/MLFacet/MLFacetTestUtils';
import { QueryBuilder } from '../../src/Core';
import { IFacetRequest } from '../../src/rest/Facet/FacetRequest';

export function MLFacetQueryControllerTest() {
  describe('MLFacetQueryController', () => {
    let facet: MLFacet;
    let mLFacetQueryController: MLFacetQueryController;
    let queryBuilder: QueryBuilder;
    let facetsRequest: IFacetRequest[];
    const mockFacetValues = MLFacetTestUtils.createFakeFacetValues(1);

    beforeEach(() => {
      queryBuilder = new QueryBuilder();
      facet = MLFacetTestUtils.createAdvancedFakeFacet({ field: '@field' }).cmp;

      mLFacetQueryController = new MLFacetQueryController(facet);
      facet.values.createFromResults(mockFacetValues);
      mLFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
      facetsRequest = queryBuilder.build().facets;
    });

    it('should put one facet request in the facets request parameter', () => {
      expect(facetsRequest.length).toBe(1);
    });

    it('should send the field without the "@"', () => {
      expect(facetsRequest[0].field).toBe('field');
    });

    it('should send the current values', () => {
      const currentValues = facetsRequest[0].currentValues;

      expect(currentValues[0]).toEqual({
        value: mockFacetValues[0].value,
        state: mockFacetValues[0].state
      });
    });
  });
}
