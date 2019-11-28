import { CategoryFacetQueryController } from '../../src/controllers/DynamicCategoryFacetQueryController';
import { CategoryFacet, ICategoryFacetOptions } from '../../src/ui/CategoryFacet/CategoryFacet';
import { QueryBuilder, SearchEndpoint } from '../../src/Core';
import { CategoryFacetTestUtils } from '../ui/CategoryFacet/CategoryFacetTestUtils';
import { mockSearchEndpoint } from '../MockEnvironment';

export function DynamicCategoryFacetQueryControllerTest() {
  describe('DynamicCategoryFacetQueryController', () => {
    let facet: CategoryFacet;
    let facetOptions: ICategoryFacetOptions;
    let categoryFacetQueryController: CategoryFacetQueryController;
    let queryBuilder: QueryBuilder;
    let mockFacetValues = CategoryFacetTestUtils.createFakeFacetResponseValues(3, 3);

    beforeEach(() => {
      facetOptions = CategoryFacetTestUtils.allOptions();

      initializeComponents();
    });

    function initializeComponents() {
      facet = CategoryFacetTestUtils.createAdvancedFakeFacet(facetOptions).cmp;
      facet.values.createFromResponse(CategoryFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));

      queryBuilder = new QueryBuilder();
      categoryFacetQueryController = new CategoryFacetQueryController(facet);
    }

    function putFacetIntoQueryBuilder() {
      categoryFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
    }

    function facetRequest() {
      return categoryFacetQueryController.facetRequest;
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
      categoryFacetQueryController.enableFreezeFacetOrderFlag();
      putFacetIntoQueryBuilder();
      expect(queryFacetOptions().freezeFacetOrder).toBe(true);
    });

    it('numberOfValues should be equal to the numberOfValues option by default', () => {
      expect(facetRequest().numberOfValues).toBe(facetOptions.numberOfValues);
    });

    it(`when increaseNumberOfValuesToRequest is called
    numberOfValues should be equal to the addtion of the numberOfValues and passed parameter`, () => {
      const additionalNumberOfValues = 5;
      categoryFacetQueryController.increaseNumberOfValuesToRequest(additionalNumberOfValues);
      expect(facetRequest().numberOfValues).toBe(facetOptions.numberOfValues + additionalNumberOfValues);
    });

    it(`when resetNumberOfValuesToRequest is called
    numberOfValues should be equal to the numberOfValues option`, () => {
      categoryFacetQueryController.increaseNumberOfValuesToRequest(40);
      categoryFacetQueryController.resetNumberOfValuesToRequest();
      expect(facetRequest().numberOfValues).toBe(facetOptions.numberOfValues);
    });

    it(`when numberOfValues requested is lower or equal than the numberOfValues option
    isFieldExpanded should be false`, () => {
      expect(facetRequest().isFieldExpanded).toBe(false);
    });

    it(`when numberOfValues requested is higher than the numberOfValues option
    isFieldExpanded should be true`, () => {
      categoryFacetQueryController.increaseNumberOfValuesToRequest(1);
      expect(facetRequest().isFieldExpanded).toBe(true);
    });

    it(`when putFacetIntoQueryBuilder is called
    should add facetRequest into the queryBuilder`, () => {
      putFacetIntoQueryBuilder()
      expect(queryFacetRequests()[0]).toEqual(facetRequest());
    });
    
    describe('testing currentValues', () => {

      // TODO: rename when API has fixed currentValue/numberOfValues issue
      it(`when a value is selected
      currentValues length should be equal to the facet number of values`, () => {
        expect(facetRequest().currentValues.length).toBe(facet.values.allFacetValues.length);
      });

      // TODO: remove when API has fixed currentValue/numberOfValues issue
      it(`when numberOfValues requested is higher than the numberOfValues option
        when no value is selected
        currentValues should be empty`, () => {
        categoryFacetQueryController.increaseNumberOfValuesToRequest(1);
        expect(facetRequest().currentValues).toEqual([]);
      });

      it(`a currentValue basic properties should be built correctly`, () => {
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

      it(`when the target value is not selected
      retrieveChildren should be false`, () => {
        const currentValue = facetRequest().currentValues[0];
        expect(currentValue.retrieveChildren).toBe(false);
      });

      it(`when the target value is not selected
      children should not be empty`, () => {
        const currentValue = facetRequest().currentValues[0];
        expect(currentValue.children).not.toEqual([]);
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
        categoryFacetQueryController.getQueryResults();
        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            numberOfResults: 0
          })
        );
      });

      it(`when there are no previous facets requests
      should create the array of facet requests`, () => {
        categoryFacetQueryController.getQueryResults();
        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            facets: [categoryFacetQueryController.facetRequest]
          })
        );
      });

      it(`when there are only other facets in the previous request
      should push to the array of facet requests`, () => {
        const fakeFacet = CategoryFacetTestUtils.createAdvancedFakeFacet({ field: '@field2' }).cmp;
        fakeFacet.putStateIntoQueryBuilder(queryBuilder);

        categoryFacetQueryController.getQueryResults();

        expect(mockEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            facets: [queryFacetRequests()[0], categoryFacetQueryController.facetRequest]
          })
        );
      });

      it(`when there is the same facet in the previous result
      should overwrite it`, () => {
        putFacetIntoQueryBuilder();
        const originalFacetRequest = facetRequest();

        categoryFacetQueryController.increaseNumberOfValuesToRequest(facetOptions.numberOfValues);
        categoryFacetQueryController.getQueryResults();

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
