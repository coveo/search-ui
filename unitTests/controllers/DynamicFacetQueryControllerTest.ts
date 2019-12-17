import { DynamicFacetQueryController } from '../../src/controllers/DynamicFacetQueryController';
import { DynamicFacet } from '../../src/ui/DynamicFacet/DynamicFacet';
import { IDynamicFacetOptions } from '../../src/ui/DynamicFacet/IDynamicFacet';
import { DynamicFacetTestUtils } from '../ui/DynamicFacet/DynamicFacetTestUtils';
import { QueryBuilder, SearchEndpoint } from '../../src/Core';
import { FacetValueState } from '../../src/rest/Facet/FacetValueState';
import { mockSearchEndpoint } from '../MockEnvironment';
import { DependsOnManager } from '../../src/utils/DependsOnManager';

export function DynamicFacetQueryControllerTest() {
  describe('DynamicFacetQueryController', () => {
    let facet: DynamicFacet;
    let facetOptions: IDynamicFacetOptions;
    let dynamicFacetQueryController: DynamicFacetQueryController;
    let queryBuilder: QueryBuilder;
    let mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(5);

    beforeEach(() => {
      facetOptions = { field: '@field', numberOfValues: 5 };

      initializeComponents();
    });

    function initializeComponents() {
      facet = DynamicFacetTestUtils.createAdvancedFakeFacet(facetOptions).cmp;
      facet.values.createFromResponse(DynamicFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));

      queryBuilder = new QueryBuilder();
      dynamicFacetQueryController = new DynamicFacetQueryController(facet);
    }

    function putFacetIntoQueryBuilder() {
      dynamicFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
    }

    function facetRequest() {
      return dynamicFacetQueryController.facetRequest;
    }

    function queryFacetRequests() {
      return queryBuilder.build().facets;
    }

    function queryFacetOptions() {
      return queryBuilder.build().facetOptions;
    }

    it('should put one facet request in the facets request parameter', () => {
      putFacetIntoQueryBuilder();
      expect(queryFacetRequests().length).toBe(1);
    });

    it('should send the facet id', () => {
      expect(facetRequest().facetId).toBe(facet.options.id);
    });

    it('should send the field without the "@"', () => {
      expect(facetRequest().field).toBe('field');
    });

    it('should send the facet type', () => {
      expect(facetRequest().type).toBe(facet.facetType);
    });

    it('should send the injectionDepth', () => {
      facet.options.injectionDepth = 15;
      expect(facetRequest().injectionDepth).toBe(15);
    });

    it('should send the current values', () => {
      const currentValues = facetRequest().currentValues;

      expect(currentValues[0]).toEqual({
        value: mockFacetValues[0].value,
        state: mockFacetValues[0].state,
        preventAutoSelect: mockFacetValues[0].preventAutoSelect
      });
    });

    it('should send the correct numberOfValues, which is initially the option', () => {
      facetOptions.numberOfValues = 100;
      initializeComponents();

      expect(facetRequest().numberOfValues).toBe(100);
    });

    it(`when the number of non idle values is lower than the numberOfValuesToRequest
      it should send the latter as the numberOfValues`, () => {
      const numberOfSelectedValues = 5;
      facetOptions.numberOfValues = 8;
      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(numberOfSelectedValues, FacetValueState.selected);
      initializeComponents();

      expect(facetRequest().numberOfValues).toBe(8);
    });

    it(`when the number of non idle values is greater than the numberOfValuesToRequest
      it should send the former as the numberOfValues`, () => {
      const numberOfSelectedValues = 5;
      facetOptions.numberOfValues = 3;
      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(numberOfSelectedValues, FacetValueState.selected);
      initializeComponents();

      expect(facetRequest().numberOfValues).toBe(numberOfSelectedValues);
    });

    it(`when increaseNumberOfValuesToRequest is called
      it should increase the number of values in the request`, () => {
      facetOptions.numberOfValues = 100;
      initializeComponents();

      dynamicFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);

      expect(facetRequest().numberOfValues).toBe(200);
    });

    it(`when resetNumberOfValuesToRequest is called
      it should reset the number of values in the request`, () => {
      facetOptions.numberOfValues = 100;
      initializeComponents();

      dynamicFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
      dynamicFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
      dynamicFacetQueryController.resetNumberOfValuesToRequest();

      expect(facetRequest().numberOfValues).toBe(100);
    });

    it('freezeCurrentValues should be false by default', () => {
      expect(facetRequest().freezeCurrentValues).toBe(false);
    });

    it(`when calling enableFreezeCurrentValuesFlag
      allows to enable the flag`, () => {
      dynamicFacetQueryController.enableFreezeCurrentValuesFlag();

      expect(facetRequest().freezeCurrentValues).toBe(true);
    });

    it(`given a facet with dependent facets having selected values,
      when calling enableFreezeCurrentValuesFlag
      it sets the freezeCurrentValues flag to true`, () => {
      facet.dependsOnManager = {
        hasDependentFacets: true,
        dependentFacetsHaveSelectedValues: true
      } as DependsOnManager;

      dynamicFacetQueryController.enableFreezeCurrentValuesFlag();

      expect(facetRequest().freezeCurrentValues).toBe(true);
    });

    it(`given a facet with dependent facets without selected values,
    when calling enableFreezeCurrentValuesFlag
    when values are not affected
    it sets the freezeCurrentValues flag to true`, () => {
      facet.dependsOnManager = {
        hasDependentFacets: true,
        dependentFacetsHaveSelectedValues: false
      } as DependsOnManager;

      dynamicFacetQueryController.enableFreezeCurrentValuesFlag();

      expect(facetRequest().freezeCurrentValues).toBe(true);
    });

    it(`given a facet with dependent facets without selected values,
    when calling enableFreezeCurrentValuesFlag
    when values are affected
    it sets the freezeCurrentValues flag to true`, () => {
      facet.dependsOnManager = {
        hasDependentFacets: true,
        dependentFacetsHaveSelectedValues: false
      } as DependsOnManager;
      facet.values.resetValues();
      facet.values.get('allo');

      dynamicFacetQueryController.enableFreezeCurrentValuesFlag();

      expect(facetRequest().freezeCurrentValues).toBe(false);
    });

    it(`when freezeCurrentValues flag is set to true
      it should send a numberOfValues equal to the number of sent currentValues`, () => {
      facetOptions.numberOfValues = 25;
      initializeComponents();

      dynamicFacetQueryController.enableFreezeCurrentValuesFlag();

      expect(facetRequest().numberOfValues).toBe(facetRequest().currentValues.length);
    });

    it('freezeFacetOrder should be undefined by default', () => {
      expect(queryFacetOptions().freezeFacetOrder).toBeUndefined();
    });

    it('allows to enableFreezeFacetOrderFlag', () => {
      dynamicFacetQueryController.enableFreezeFacetOrderFlag();
      putFacetIntoQueryBuilder();

      expect(queryFacetOptions().freezeFacetOrder).toBe(true);
    });

    it('isFieldExpanded should be false by default', () => {
      expect(facetRequest().isFieldExpanded).toBe(false);
    });

    it(`when more values are requested than the numberOfValues options
      isFieldExpanded should be true`, () => {
      facetOptions.numberOfValues = 10;
      initializeComponents();

      dynamicFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
      expect(facetRequest().isFieldExpanded).toBe(true);
    });

    describe('when executing a query', () => {
      let mockEndpoint: SearchEndpoint;
      beforeEach(() => {
        mockEndpoint = mockSearchEndpoint();
        facet.queryController.getEndpoint = () => mockEndpoint;
        facet.queryController.getLastQuery = () => queryBuilder.build();
      });

      it(`should send a numberOfResults of 0 in order not to log the query as a full fleged query
        and alleviate the load on the index`, () => {
        dynamicFacetQueryController.getQueryResults();
        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            numberOfResults: 0
          })
        );
      });

      it(`when there are no previous facets requests
      should create the array of facet requests`, () => {
        dynamicFacetQueryController.getQueryResults();
        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            facets: [dynamicFacetQueryController.facetRequest]
          })
        );
      });

      it(`when there are only other facets in the previous request
      should push to the array of facet requests`, () => {
        const fakeFacet = DynamicFacetTestUtils.createAdvancedFakeFacet({ field: '@field2' }).cmp;
        fakeFacet.putStateIntoQueryBuilder(queryBuilder);

        dynamicFacetQueryController.getQueryResults();

        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            facets: [queryFacetRequests()[0], dynamicFacetQueryController.facetRequest]
          })
        );
      });

      it(`when there is the same facet in the previous result
      should overwrite it`, () => {
        putFacetIntoQueryBuilder();
        const originalFacetRequest = facetRequest();

        dynamicFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
        dynamicFacetQueryController.getQueryResults();

        const newFacetRequest = facetRequest();
        expect(originalFacetRequest).not.toEqual(newFacetRequest);
        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            facets: [newFacetRequest]
          })
        );
      });
    });
  });
}
