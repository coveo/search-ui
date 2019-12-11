import { CategoryFacetQueryController } from '../../src/controllers/CategoryFacetQueryController';
import * as Mock from '../MockEnvironment';
import { CategoryFacet, ICategoryFacetOptions } from '../../src/ui/CategoryFacet/CategoryFacet';
import { IGroupByRequest } from '../../src/rest/GroupByRequest';
import { AllowedValuesPatternType } from '../../src/rest/AllowedValuesPatternType';
import { FakeResults } from '../Fake';
import { QueryBuilder } from '../../src/Core';

export function CategoryFacetQueryControllerTest() {
  describe('CategoryFacetQueryController', () => {
    let testCategoryFacet: Mock.IBasicComponentSetup<CategoryFacet>;
    let categoryFacetController: CategoryFacetQueryController;

    beforeEach(() => {
      testCategoryFacet = Mock.optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, {
        field: '@someField',
        injectionDepth: 12345
      });
      categoryFacetController = new CategoryFacetQueryController(testCategoryFacet.cmp);
    });

    it('should create a valid group by request when searching', () => {
      categoryFacetController.searchFacetValues('some value', 15);

      expect(testCategoryFacet.env.searchEndpoint.search).toHaveBeenCalledWith(
        jasmine.objectContaining({
          groupBy: jasmine.arrayContaining([
            jasmine.objectContaining({
              allowedValues: ['*some value*'],
              allowedValuesPatternType: AllowedValuesPatternType.Wildcards,
              maximumNumberOfValues: 15,
              field: testCategoryFacet.cmp.options.field,
              sortCriteria: 'occurrences',
              injectionDepth: testCategoryFacet.cmp.options.injectionDepth
            } as IGroupByRequest)
          ])
        })
      );
    });

    it('should create a valid allowed value parameter when searching with a base path with a single value', () => {
      testCategoryFacet.cmp.options.basePath = ['a_base_path'];
      testCategoryFacet.cmp.options.delimitingCharacter = '/';
      categoryFacetController.searchFacetValues('some value', 15);

      expect(testCategoryFacet.env.searchEndpoint.search).toHaveBeenCalledWith(
        jasmine.objectContaining({
          groupBy: jasmine.arrayContaining([
            jasmine.objectContaining({
              allowedValues: ['a_base_path/*some value*'],
              allowedValuesPatternType: AllowedValuesPatternType.Wildcards
            } as IGroupByRequest)
          ])
        })
      );
    });

    it('should create a valid allowed value parameter when searching with a base path with multiple parts', () => {
      testCategoryFacet.cmp.options.basePath = ['a_base_path', 'another_part'];
      testCategoryFacet.cmp.options.delimitingCharacter = '|';
      categoryFacetController.searchFacetValues('some value', 15);

      expect(testCategoryFacet.env.searchEndpoint.search).toHaveBeenCalledWith(
        jasmine.objectContaining({
          groupBy: jasmine.arrayContaining([
            jasmine.objectContaining({
              allowedValues: ['a_base_path|another_part|*some value*'],
              allowedValuesPatternType: AllowedValuesPatternType.Wildcards
            } as IGroupByRequest)
          ])
        })
      );
    });

    describe('when searching and getting values back from the endpoint', () => {
      beforeEach(() => {
        const fakeResults = FakeResults.createFakeResults();
        const fakeGroupBy = FakeResults.createFakeHierarchicalGroupByResult('@someField', 'value');
        fakeGroupBy.values[0].numberOfResults = 123456;
        fakeGroupBy.values[1].numberOfResults = 123456;
        fakeGroupBy.values[0].value = 'a|much|longer|path';
        fakeGroupBy.values[1].value = 'a|shorter|path';

        fakeResults.groupByResults = [fakeGroupBy];
        (testCategoryFacet.env.searchEndpoint.search as jasmine.Spy).and.returnValue(fakeResults);
      });

      it('should order by the number of results', async done => {
        const searchResults = await categoryFacetController.searchFacetValues('some value', 15);

        for (let i = 0; i < searchResults.length - 1; i++) {
          expect(searchResults[i].numberOfResults).not.toBeLessThan(searchResults[i + 1].numberOfResults);
        }
        done();
      });

      it('should order by shortest path first when there is an equality on the number of results', async done => {
        const searchResults = await categoryFacetController.searchFacetValues('some value', 15);

        expect(searchResults[0].numberOfResults).toEqual(searchResults[1].numberOfResults);
        expect(searchResults[0].value).toBe('a|shorter|path');
        expect(searchResults[1].value).toBe('a|much|longer|path');
        done();
      });

      describe('when adding the filter in the query', () => {
        let queryBuilder: QueryBuilder;

        beforeEach(() => {
          queryBuilder = new QueryBuilder();
        });

        it('should not put any filter in the query when there is no base path and no active path', () => {
          testCategoryFacet.cmp.options.basePath = [];
          categoryFacetController.putCategoryFacetInQueryBuilder(queryBuilder, [], 5);
          expect(queryBuilder.advancedExpression.build()).toBeUndefined();
        });

        it('should put the filter in the query when there is no base path and there is an active path', () => {
          testCategoryFacet.cmp.options.basePath = [];
          categoryFacetController.putCategoryFacetInQueryBuilder(queryBuilder, ['active_path', 'active_path_2'], 5);
          expect(queryBuilder.advancedExpression.build()).toEqual('@someField=="active_path|active_path_2"');
        });

        it('should put the filter in the query when there is a base path that contains the active path', () => {
          testCategoryFacet.cmp.options.basePath = ['active_path'];
          categoryFacetController.putCategoryFacetInQueryBuilder(queryBuilder, ['active_path', 'active_path_2'], 5);
          expect(queryBuilder.advancedExpression.build()).toEqual('@someField=="active_path|active_path_2"');
        });

        it('should put the filter in the query when there is a base path that is different from the active path', () => {
          testCategoryFacet.cmp.options.basePath = ['different_path', 'another_different_path'];
          categoryFacetController.putCategoryFacetInQueryBuilder(queryBuilder, ['active_path', 'active_path_2'], 5);
          expect(queryBuilder.advancedExpression.build()).toEqual('@someField=="active_path|active_path_2"');
        });

        it('should not put the filter in the query when there is a base path that equals the active path', () => {
          testCategoryFacet.cmp.options.basePath = ['active_path', 'active_path_2'];
          categoryFacetController.putCategoryFacetInQueryBuilder(queryBuilder, ['active_path', 'active_path_2'], 5);
          expect(queryBuilder.advancedExpression.build()).toBeUndefined();
        });
      });
    });
  });
}
