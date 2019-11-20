import { CategoryFacetQueryController } from '../../src/controllers/DynamicCategoryFacetQueryController';
import * as Mock from '../MockEnvironment';
import { CategoryFacet, ICategoryFacetOptions } from '../../src/ui/CategoryFacet/CategoryFacet';
import { QueryBuilder } from '../../src/Core';
import { CategoryFacetTestUtils } from '../ui/CategoryFacet/CategoryFacetTestUtils';

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

    it('should put one facet request in the facets request parameter', () => {
      putFacetIntoQueryBuilder();
      expect(queryFacetRequests().length).toBe(1);
    });

    it('should send the field without the "@"', () => {
      expect(facetRequest().field).toBe(facet.fieldName);
    });

    it('should send the facet type', () => {
      expect(facetRequest().type).toBe(facet.facetType);
    });

    it('should send the current values', () => {
      const currentValues = facetRequest().currentValues;
      const facetValues = facet.values.allFacetValues;

      expect(currentValues.length).toBe(facetValues.length);
    });

  });
}
