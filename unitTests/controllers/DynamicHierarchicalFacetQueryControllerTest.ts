import { DynamicHierarchicalFacetQueryController } from '../../src/controllers/DynamicHierarchicalFacetQueryController';
import { QueryBuilder, SearchEndpoint } from '../../src/Core';
import { DynamicHierarchicalFacetTestUtils } from '../ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetTestUtils';
import { mockSearchEndpoint } from '../MockEnvironment';
import {
  IDynamicHierarchicalFacet,
  IDynamicHierarchicalFacetOptions
} from '../../src/ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';

export function DynamicHierarchicalFacetQueryControllerTest() {
  describe('DynamicHierarchicalFacetQueryController', () => {
    let facet: IDynamicHierarchicalFacet;
    let facetOptions: IDynamicHierarchicalFacetOptions;
    let dynamicHierarchicalFacetQueryController: DynamicHierarchicalFacetQueryController;
    let queryBuilder: QueryBuilder;
    let mockFacetValues = DynamicHierarchicalFacetTestUtils.createFakeFacetResponseValues(3, 3);

    beforeEach(() => {
      facetOptions = DynamicHierarchicalFacetTestUtils.allOptions();

      initializeComponents();
    });

    function initializeComponents() {
      facet = DynamicHierarchicalFacetTestUtils.createAdvancedFakeFacet(facetOptions).cmp;
      facet.values.createFromResponse(DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));

      queryBuilder = new QueryBuilder();
      dynamicHierarchicalFacetQueryController = new DynamicHierarchicalFacetQueryController(facet);
    }

    function putFacetIntoQueryBuilder() {
      dynamicHierarchicalFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
    }

    function facetRequest() {
      return dynamicHierarchicalFacetQueryController.buildFacetRequest(queryBuilder.build());
    }

    function queryFacetRequests() {
      return queryBuilder.build().facets;
    }

    function queryFacetOptions() {
      return queryBuilder.build().facetOptions;
    }

    it('should send the field without the "@"', () => {
      expect(facetRequest().field).toBe(facet.fieldName);
    });

    it('should send the facet type', () => {
      expect(facetRequest().type).toBe(facet.facetType);
    });

    it('should send the delimitingCharacter', () => {
      expect(facetRequest().delimitingCharacter).toBe(facet.options.delimitingCharacter);
    });

    it('should send the facet id', () => {
      expect(facetRequest().facetId).toBe(facet.options.id);
    });

    it('should send the injectionDepth', () => {
      expect(facetRequest().injectionDepth).toBe(facet.options.injectionDepth);
    });

    it('the facet option freezeFacetOrder should not be defined by default', () => {
      putFacetIntoQueryBuilder();
      expect(queryFacetOptions().freezeFacetOrder).toBeUndefined();
    });

    it(`when enableFreezeFacetOrderFlag is called
    the facet option freezeFacetOrder should be true`, () => {
      dynamicHierarchicalFacetQueryController.enableFreezeFacetOrderFlag();
      putFacetIntoQueryBuilder();
      expect(queryFacetOptions().freezeFacetOrder).toBe(true);
    });

    it('numberOfValues should be equal to the numberOfValues option by default', () => {
      expect(facetRequest().numberOfValues).toBe(facetOptions.numberOfValues);
    });

    it(`when increaseNumberOfValuesToRequest is called
    numberOfValues should be equal to the addtion of the numberOfValues and passed parameter`, () => {
      const additionalNumberOfValues = 5;
      dynamicHierarchicalFacetQueryController.increaseNumberOfValuesToRequest(additionalNumberOfValues);
      expect(facetRequest().numberOfValues).toBe(facetOptions.numberOfValues + additionalNumberOfValues);
    });

    it(`when resetNumberOfValuesToRequest is called
    numberOfValues should be equal to the numberOfValues option`, () => {
      dynamicHierarchicalFacetQueryController.increaseNumberOfValuesToRequest(40);
      dynamicHierarchicalFacetQueryController.resetNumberOfValuesToRequest();
      expect(facetRequest().numberOfValues).toBe(facetOptions.numberOfValues);
    });

    it(`when numberOfValues requested is lower or equal than the numberOfValues option
    isFieldExpanded should be false`, () => {
      expect(facetRequest().isFieldExpanded).toBe(false);
    });

    it(`when numberOfValues requested is higher than the numberOfValues option
    isFieldExpanded should be true`, () => {
      dynamicHierarchicalFacetQueryController.increaseNumberOfValuesToRequest(1);
      expect(facetRequest().isFieldExpanded).toBe(true);
    });

    it(`when putFacetIntoQueryBuilder is called
    should add facetRequest into the queryBuilder`, () => {
      putFacetIntoQueryBuilder();
      expect(queryFacetRequests()[0]).toEqual(facetRequest());
    });

    describe('testing currentValues', () => {
      it(`when no value is selected
      currentValues length should be 0`, () => {
        expect(facetRequest().currentValues.length).toBe(0);
      });

      // TODO: remove when API has fixed currentValue/numberOfValues issue
      it(`when numberOfValues requested is higher than the numberOfValues option
        when no value is selected
        currentValues should be empty`, () => {
        dynamicHierarchicalFacetQueryController.increaseNumberOfValuesToRequest(1);
        expect(facetRequest().currentValues).toEqual([]);
      });

      it(`when a value is selected
        a currentValue basic properties should be built correctly`, () => {
        facet.values.selectPath(facet.values.allFacetValues[0].path);
        const facetValue = facet.values.allFacetValues[0];
        const currentValue = facetRequest().currentValues[0];

        expect(currentValue.value).toBe(facetValue.value);
        expect(currentValue.state).toBe(facetValue.state);
        expect(currentValue.preventAutoSelect).toBe(facetValue.preventAutoSelect);
        expect(currentValue.retrieveCount).toBe(facetValue.retrieveCount);
      });

      it(`when the target value is selected
      retrieveChildren should be true`, () => {
        const facetValue = facet.values.allFacetValues[0];
        facet.values.selectPath(facetValue.path);
        const currentValue = facetRequest().currentValues[0];

        expect(currentValue.retrieveChildren).toBe(true);
      });

      it(`when the target value is selected
      children should be empty`, () => {
        const facetValue = facet.values.allFacetValues[0];
        facet.values.selectPath(facetValue.path);
        const currentValue = facetRequest().currentValues[0];

        expect(currentValue.children).toEqual([]);
      });
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
        dynamicHierarchicalFacetQueryController.getQueryResults();
        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            numberOfResults: 0
          })
        );
      });

      it(`when there are no previous facets requests
      should create the array of facet requests`, () => {
        dynamicHierarchicalFacetQueryController.getQueryResults();
        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            facets: [dynamicHierarchicalFacetQueryController.buildFacetRequest(new QueryBuilder().build())]
          })
        );
      });

      it(`when there are only other facets in the previous request
      should push to the array of facet requests`, () => {
        const fakeFacet = DynamicHierarchicalFacetTestUtils.createAdvancedFakeFacet({ field: '@field2' }).cmp;
        fakeFacet.putStateIntoQueryBuilder(queryBuilder);

        dynamicHierarchicalFacetQueryController.getQueryResults();

        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            facets: [queryFacetRequests()[0], dynamicHierarchicalFacetQueryController.buildFacetRequest(new QueryBuilder().build())]
          })
        );
      });

      it(`when there is the same facet in the previous result
      should overwrite it`, () => {
        putFacetIntoQueryBuilder();
        const originalFacetRequest = facetRequest();

        dynamicHierarchicalFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
        dynamicHierarchicalFacetQueryController.getQueryResults();

        const newFacetRequest = facetRequest();
        expect(originalFacetRequest).not.toEqual(newFacetRequest);
        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            facets: [newFacetRequest]
          })
        );
      });
    });

    // TODO: add tests for dependsOnManager when feature is reworked
  });
}
