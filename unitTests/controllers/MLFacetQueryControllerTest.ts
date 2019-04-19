import { MLFacetQueryController } from '../../src/controllers/MLFacetQueryController';
import { MLFacet, IMLFacetOptions } from '../../src/ui/MLFacet/MLFacet';
import { MLFacetTestUtils } from '../ui/MLFacet/MLFacetTestUtils';
import { QueryBuilder } from '../../src/Core';
import { FacetValueState } from '../../src/rest/Facet/FacetValueState';

export function MLFacetQueryControllerTest() {
  describe('MLFacetQueryController', () => {
    let facet: MLFacet;
    let facetOptions: IMLFacetOptions;
    let mLFacetQueryController: MLFacetQueryController;
    let queryBuilder: QueryBuilder;
    let mockFacetValues = MLFacetTestUtils.createFakeFacetValues(1);

    beforeEach(() => {
      facetOptions = { field: '@field' };

      initializeComponents();
    });

    function initializeComponents() {
      facet = MLFacetTestUtils.createAdvancedFakeFacet(facetOptions).cmp;
      facet.values.createFromResponse(MLFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));

      queryBuilder = new QueryBuilder();
      mLFacetQueryController = new MLFacetQueryController(facet);
      buildRequest();
    }

    function buildRequest() {
      mLFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
    }

    function facetRequests() {
      return queryBuilder.build().facets;
    }

    function latestFacetRequest() {
      const requests = facetRequests();
      return requests[requests.length - 1];
    }

    it('should put one facet request in the facets request parameter', () => {
      expect(facetRequests().length).toBe(1);
    });

    it('should send the field without the "@"', () => {
      expect(latestFacetRequest().field).toBe('field');
    });

    it('should send the current values', () => {
      const currentValues = latestFacetRequest().currentValues;

      expect(currentValues[0]).toEqual({
        value: mockFacetValues[0].value,
        state: mockFacetValues[0].state
      });
    });

    it('should send the correct numberOfValues, which is initially the option', () => {
      facetOptions.numberOfValues = 100;

      initializeComponents();
      expect(latestFacetRequest().numberOfValues).toBe(100);
    });

    it(`when the number of non idle values is lower than the numberOfValuesToRequest
      it should send the latter as the numberOfValues`, () => {
      const numberOfSelectedValues = 5;
      facetOptions.numberOfValues = 8;
      mockFacetValues = MLFacetTestUtils.createFakeFacetValues(numberOfSelectedValues, FacetValueState.selected);

      initializeComponents();
      expect(latestFacetRequest().numberOfValues).toBe(8);
    });

    it(`when the number of non idle values is greater than the numberOfValuesToRequest
      it should send the former as the numberOfValues`, () => {
      const numberOfSelectedValues = 5;
      facetOptions.numberOfValues = 3;
      mockFacetValues = MLFacetTestUtils.createFakeFacetValues(numberOfSelectedValues, FacetValueState.selected);

      initializeComponents();
      expect(latestFacetRequest().numberOfValues).toBe(numberOfSelectedValues);
    });

    it(`when increaseNumberOfValuesToRequest is called
      it should increase the number of values in the request`, () => {
      facetOptions.numberOfValues = 100;
      initializeComponents();

      mLFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);

      buildRequest();

      expect(latestFacetRequest().numberOfValues).toBe(200);
    });

    it(`when resetNumberOfValuesToRequest is called
      it should reset the number of values in the request`, () => {
      facetOptions.numberOfValues = 100;
      initializeComponents();

      mLFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
      mLFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
      mLFacetQueryController.resetNumberOfValuesToRequest();

      buildRequest();

      expect(latestFacetRequest().numberOfValues).toBe(100);
    });

    it('freezeCurrentValues should be false by default', () => {
      expect(latestFacetRequest().freezeCurrentValues).toBe(false);
    });

    it('allows to enableFreezeCurrentValuesFlag', () => {
      mLFacetQueryController.enableFreezeCurrentValuesFlag();
      buildRequest();

      expect(latestFacetRequest().freezeCurrentValues).toBe(true);
    });

    it(`when freezeCurrentValues flag is set to true
      it should send a numberOfValues equal to the number of sent currentValues`, () => {
      facetOptions.numberOfValues = 25;
      initializeComponents();

      mLFacetQueryController.enableFreezeCurrentValuesFlag();
      buildRequest();

      expect(latestFacetRequest().numberOfValues).toBe(latestFacetRequest().currentValues.length);
    });

    it('isFieldExpanded should be false by default', () => {
      expect(latestFacetRequest().isFieldExpanded).toBe(false);
    });

    it(`when more values are requested than the numberOfValues options
      isFieldExpanded should be true`, () => {
      facetOptions.numberOfValues = 10;
      initializeComponents();

      mLFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);

      buildRequest();

      expect(latestFacetRequest().isFieldExpanded).toBe(true);
    });
  });
}
