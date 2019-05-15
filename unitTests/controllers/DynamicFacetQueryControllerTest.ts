import { DynamicFacetQueryController } from '../../src/controllers/DynamicFacetQueryController';
import { DynamicFacet, IDynamicFacetOptions } from '../../src/ui/DynamicFacet/DynamicFacet';
import { DynamicFacetTestUtils } from '../ui/DynamicFacet/DynamicFacetTestUtils';
import { QueryBuilder } from '../../src/Core';
import { FacetValueState } from '../../src/rest/Facet/FacetValueState';

export function DynamicFacetQueryControllerTest() {
  describe('DynamicFacetQueryController', () => {
    let facet: DynamicFacet;
    let facetOptions: IDynamicFacetOptions;
    let dynamicFacetQueryController: DynamicFacetQueryController;
    let queryBuilder: QueryBuilder;
    let mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(1);

    beforeEach(() => {
      facetOptions = { field: '@field' };

      initializeComponents();
    });

    function initializeComponents() {
      facet = DynamicFacetTestUtils.createAdvancedFakeFacet(facetOptions).cmp;
      facet.values.createFromResponse(DynamicFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));

      queryBuilder = new QueryBuilder();
      dynamicFacetQueryController = new DynamicFacetQueryController(facet);
      buildRequest();
    }

    function buildRequest() {
      dynamicFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
    }

    function facetRequests() {
      return queryBuilder.build().facets;
    }

    function facetOptionsRequest() {
      return queryBuilder.build().facetOptions;
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
      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(numberOfSelectedValues, FacetValueState.selected);

      initializeComponents();
      expect(latestFacetRequest().numberOfValues).toBe(8);
    });

    it(`when the number of non idle values is greater than the numberOfValuesToRequest
      it should send the former as the numberOfValues`, () => {
      const numberOfSelectedValues = 5;
      facetOptions.numberOfValues = 3;
      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(numberOfSelectedValues, FacetValueState.selected);

      initializeComponents();
      expect(latestFacetRequest().numberOfValues).toBe(numberOfSelectedValues);
    });

    it(`when increaseNumberOfValuesToRequest is called
      it should increase the number of values in the request`, () => {
      facetOptions.numberOfValues = 100;
      initializeComponents();

      dynamicFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);

      buildRequest();

      expect(latestFacetRequest().numberOfValues).toBe(200);
    });

    it(`when resetNumberOfValuesToRequest is called
      it should reset the number of values in the request`, () => {
      facetOptions.numberOfValues = 100;
      initializeComponents();

      dynamicFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
      dynamicFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
      dynamicFacetQueryController.resetNumberOfValuesToRequest();

      buildRequest();

      expect(latestFacetRequest().numberOfValues).toBe(100);
    });

    it('freezeCurrentValues should be false by default', () => {
      expect(latestFacetRequest().freezeCurrentValues).toBe(false);
    });

    it('allows to enableFreezeCurrentValuesFlag', () => {
      dynamicFacetQueryController.enableFreezeCurrentValuesFlag();
      buildRequest();

      expect(latestFacetRequest().freezeCurrentValues).toBe(true);
    });

    it(`when freezeCurrentValues flag is set to true
      it should send a numberOfValues equal to the number of sent currentValues`, () => {
      facetOptions.numberOfValues = 25;
      initializeComponents();

      dynamicFacetQueryController.enableFreezeCurrentValuesFlag();
      buildRequest();

      expect(latestFacetRequest().numberOfValues).toBe(latestFacetRequest().currentValues.length);
    });

    it('freezeFacetOrder should be undefined by default', () => {
      expect(facetOptionsRequest().freezeFacetOrder).toBeUndefined();
    });

    it('allows to enableFreezeFacetOrderFlag', () => {
      dynamicFacetQueryController.enableFreezeFacetOrderFlag();
      buildRequest();

      expect(facetOptionsRequest().freezeFacetOrder).toBe(true);
    });

    it('isFieldExpanded should be false by default', () => {
      expect(latestFacetRequest().isFieldExpanded).toBe(false);
    });

    it(`when more values are requested than the numberOfValues options
      isFieldExpanded should be true`, () => {
      facetOptions.numberOfValues = 10;
      initializeComponents();

      dynamicFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);

      buildRequest();

      expect(latestFacetRequest().isFieldExpanded).toBe(true);
    });
  });
}
