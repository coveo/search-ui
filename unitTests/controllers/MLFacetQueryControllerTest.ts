import { MLFacetQueryController } from '../../src/controllers/MLFacetQueryController';
import { MLFacet, IMLFacetOptions } from '../../src/ui/MLFacet/MLFacet';
import { MLFacetTestUtils } from '../ui/MLFacet/MLFacetTestUtils';
import { QueryBuilder } from '../../src/Core';
import { IFacetRequest } from '../../src/rest/Facet/FacetRequest';

export function MLFacetQueryControllerTest() {
  describe('MLFacetQueryController', () => {
    let facet: MLFacet;
    let facetOptions: IMLFacetOptions;
    let mLFacetQueryController: MLFacetQueryController;
    let queryBuilder: QueryBuilder;
    let facetsRequest: IFacetRequest[];
    const mockFacetValues = MLFacetTestUtils.createFakeFacetValues(1);

    beforeEach(() => {
      facetOptions = { field: '@field' };

      initializeComponents();
    });

    function initializeComponents() {
      facet = MLFacetTestUtils.createAdvancedFakeFacet(facetOptions).cmp;
      facet.values.createFromResponse(MLFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));

      queryBuilder = new QueryBuilder();
      mLFacetQueryController = new MLFacetQueryController(facet);
      mLFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
      facetsRequest = queryBuilder.build().facets;
    }

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

    it('should send the correct numberOfValues, which is initially the option', () => {
      facetOptions.numberOfValues = 100;

      initializeComponents();
      expect(facetsRequest[0].numberOfValues).toBe(100);
    });

    it(`when increaseNumberOfValuesToRequest is called
      it should increase the number of values in the request`, () => {
      facetOptions.numberOfValues = 100;
      initializeComponents();

      mLFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);

      mLFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
      facetsRequest = queryBuilder.build().facets;

      expect(facetsRequest[1].numberOfValues).toBe(200);
    });

    it(`when resetNumberOfValuesToRequest is called
      it should reset the number of values in the request`, () => {
      facetOptions.numberOfValues = 100;
      initializeComponents();

      mLFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
      mLFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
      mLFacetQueryController.resetNumberOfValuesToRequest();

      mLFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
      facetsRequest = queryBuilder.build().facets;

      expect(facetsRequest[1].numberOfValues).toBe(100);
    });
  });
}
