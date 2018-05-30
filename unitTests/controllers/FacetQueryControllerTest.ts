import * as Mock from '../MockEnvironment';
import { Facet } from '../../src/ui/Facet/Facet';
import { FacetQueryController } from '../../src/controllers/FacetQueryController';
import { FacetValues } from '../../src/ui/Facet/FacetValues';
import { FacetValue } from '../../src/ui/Facet/FacetValues';
import { ExpressionBuilder } from '../../src/ui/Base/ExpressionBuilder';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { QueryController } from '../../src/controllers/QueryController';
import { SearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import { FacetSearchParameters } from '../../src/ui/Facet/FacetSearchParameters';
import { FakeResults } from '../Fake';
import { IQueryResults } from '../../src/rest/QueryResults';
import * as _ from 'underscore';

export function FacetQueryControllerTest() {
  describe('FacetQueryController', () => {
    let mockFacet: Facet;
    let facetQueryController: FacetQueryController;

    beforeEach(() => {
      mockFacet = Mock.mock<Facet>(Facet);
      mockFacet.options = {};
      mockFacet.options.field = '@field';
      let values: any = Mock.mock(FacetValues);
      mockFacet.values = values;
      (<jasmine.Spy>mockFacet.values.hasSelectedOrExcludedValues).and.returnValue(true);

      facetQueryController = new FacetQueryController(mockFacet);
    });

    afterEach(() => {
      mockFacet = null;
      facetQueryController = null;
    });

    it('should compute a filter expression', () => {
      (<jasmine.Spy>mockFacet.values.getSelected).and.returnValue([FacetValue.create('foo'), FacetValue.create('bar')]);
      (<jasmine.Spy>mockFacet.values.getExcluded).and.returnValue([]);

      let expectedBuilder = new ExpressionBuilder();
      expectedBuilder.addFieldExpression('@field', '==', ['foo', 'bar']);
      expect(facetQueryController.computeOurFilterExpression()).toBe(expectedBuilder.build());

      (<jasmine.Spy>mockFacet.values.getExcluded).and.returnValue([FacetValue.create('exclude1'), FacetValue.create('exclude2')]);
      expectedBuilder.addFieldNotEqualExpression('@field', ['exclude1', 'exclude2']);
      expect(facetQueryController.computeOurFilterExpression()).toBe(expectedBuilder.build());
    });

    describe('should push a group by into a query builder', () => {
      let queryBuilder;
      beforeEach(() => {
        (<jasmine.Spy>mockFacet.values.getSelected).and.returnValue([FacetValue.create('foo'), FacetValue.create('bar')]);
        (<jasmine.Spy>mockFacet.values.getExcluded).and.returnValue([]);
        mockFacet.numberOfValues = 5;
        queryBuilder = new QueryBuilder();
      });

      it('should put a group by into a query builder', () => {
        mockFacet.numberOfValues = 23;
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        let groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.allowedValues).toEqual(jasmine.arrayContaining(['foo', 'bar']));
        expect(groupByRequest.field).toBe('@field');
        expect(groupByRequest.maximumNumberOfValues).toBe(23);
      });

      it('should request 1 more value if more / less is enabled', () => {
        mockFacet.options.enableMoreLess = true;
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        let groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.maximumNumberOfValues).toBe(6);
      });

      it('should request only allowed values if set on the facet', () => {
        mockFacet.options.allowedValues = ['a', 'b', 'c'];
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        let groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.allowedValues).toEqual(jasmine.arrayContaining(['a', 'b', 'c']));
        expect(groupByRequest.allowedValues).not.toEqual(jasmine.arrayContaining(['foo', 'bar']));
      });

      it('should use lookupfield if set on facet', () => {
        mockFacet.options.lookupField = '@lookupfield';
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        let groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.lookupField).toBe('@lookupfield');
      });

      it('should use computed field if set on facet', () => {
        mockFacet.options.computedField = '@computedfield';
        mockFacet.options.computedFieldOperation = 'sum';

        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        let groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.computedFields[0]).toEqual(
          jasmine.objectContaining({
            field: '@computedfield',
            operation: 'sum'
          })
        );
      });

      it('should use the additional filter if set on facet', () => {
        mockFacet.options.additionalFilter = '@additionalfilter';

        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        let groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.constantQueryOverride).toBe('@additionalfilter');
      });

      it('should keep the expression to use for facet search after building a group by', () => {
        queryBuilder.expression.add('something');
        queryBuilder.advancedExpression.add('advanced expression');
        queryBuilder.constantExpression.add('something constant');

        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);

        expect(facetQueryController.expressionToUseForFacetSearch).toBe('(something) (advanced expression)');
        expect(facetQueryController.basicExpressionToUseForFacetSearch).toBe('something');
        expect(facetQueryController.advancedExpressionToUseForFacetSearch).toBe('advanced expression');
        expect(facetQueryController.constantExpressionToUseForFacetSearch).toBe('something constant');
      });

      it('should clear the expressions used for facet search when calling prepareForNewQuery', () => {
        queryBuilder.expression.add('something');
        queryBuilder.constantExpression.add('something constant');
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);

        facetQueryController.prepareForNewQuery();

        expect(facetQueryController.expressionToUseForFacetSearch).toBeUndefined();
        expect(facetQueryController.constantExpressionToUseForFacetSearch).toBeUndefined();
      });
    });

    describe('should perform search', () => {
      let mockEndpoint: SearchEndpoint;
      let mockQueryController: QueryController;
      beforeEach(() => {
        mockEndpoint = Mock.mockSearchEndpoint();
        mockQueryController = Mock.mockQueryController();

        mockFacet.searchInterface = <SearchInterface>{};

        mockFacet.queryController = mockQueryController;
        mockFacet.facetQueryController = facetQueryController;
        mockFacet.getEndpoint = jasmine.createSpy('endpoint');

        (<jasmine.Spy>mockFacet.getEndpoint).and.returnValue(mockEndpoint);
        (<jasmine.Spy>mockFacet.queryController.getLastQuery).and.returnValue(new QueryBuilder().build());
      });

      afterEach(() => {
        mockEndpoint = null;
        mockQueryController = null;
      });

      it('with params', () => {
        let params = new FacetSearchParameters(mockFacet);
        facetQueryController.search(params);
        expect(facetQueryController.facet.getEndpoint().search).toHaveBeenCalled();

        params.alwaysInclude = ['foo', 'bar'];
        facetQueryController.search(params);
        expect(facetQueryController.facet.getEndpoint().search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            groupBy: jasmine.arrayContaining([
              jasmine.objectContaining({
                allowedValues: jasmine.arrayContaining(['foo', 'bar'])
              })
            ])
          })
        );

        params.setValueToSearch('test');
        facetQueryController.search(params);
        expect(facetQueryController.facet.getEndpoint().search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            groupBy: jasmine.arrayContaining([
              jasmine.objectContaining({
                allowedValues: jasmine.arrayContaining(['*test*'])
              })
            ])
          })
        );
      });

      it('by copying last query', () => {
        let lastQueryBuilder = new QueryBuilder();
        lastQueryBuilder.pipeline = 'pipeline';
        lastQueryBuilder.enableWildcards = true;
        (<jasmine.Spy>mockFacet.queryController.getLastQuery).and.returnValue(lastQueryBuilder.build());

        facetQueryController.search(new FacetSearchParameters(mockFacet));
        expect(facetQueryController.facet.getEndpoint().search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            wildcards: true,
            pipeline: 'pipeline'
          })
        );
      });

      describe('with allowed values options on the facet', () => {
        let facetSearchParams: FacetSearchParameters;
        let searchPromise: Promise<IQueryResults>;

        beforeEach(() => {
          searchPromise = new Promise((resolve, reject) => {
            const results = FakeResults.createFakeResults();
            const singleGroupBy = FakeResults.createFakeGroupByResult('@foo', 'a', 10);
            results.groupByResults[0] = singleGroupBy;
            resolve(results);
          });
          (<jasmine.Spy>mockEndpoint.search).and.returnValue(searchPromise);

          facetSearchParams = new FacetSearchParameters(mockFacet);
          facetSearchParams.nbResults = 10;
        });

        afterEach(() => {
          facetSearchParams = null;
          searchPromise = null;
        });

        const generateMatcher = (values: string[]) => {
          const generated = _.map(values, value => {
            return jasmine.objectContaining({ value });
          });
          return jasmine.arrayContaining(generated);
        };

        it('should resolve with allowed values only', done => {
          mockFacet.options.allowedValues = ['a0', 'a5', 'a8'];
          facetQueryController.search(facetSearchParams).then(values => {
            expect(values).toEqual(generateMatcher(['a0', 'a5', 'a8']));
            expect(values).not.toEqual(generateMatcher(['a2', 'a1']));
            done();
          });
        });

        it('when performing fetch more with allowed values option', done => {
          mockFacet.options.allowedValues = ['a0', 'a5', 'a8'];
          facetQueryController.fetchMore(10).then((data: IQueryResults) => {
            expect(data.groupByResults[0].values).toEqual(generateMatcher(['a0', 'a5', 'a8']));
            expect(data.groupByResults[0].values).not.toEqual(generateMatcher(['a2', 'a1']));
            done();
          });
        });

        describe('with a wildcard', () => {
          beforeEach(() => {
            searchPromise = new Promise((resolve, reject) => {
              const results = FakeResults.createFakeResults();
              const groupByWithAToken = FakeResults.createFakeGroupByResult('@foo', 'a', 5);
              const groupByWithBToken = FakeResults.createFakeGroupByResult('@foo', 'b', 5);
              groupByWithAToken.values = groupByWithAToken.values.concat(groupByWithBToken.values);
              results.groupByResults[0] = groupByWithAToken;
              resolve(results);
            });
            (<jasmine.Spy>mockEndpoint.search).and.returnValue(searchPromise);
            mockFacet.options.allowedValues = ['a*'];
          });

          it('should resolve search correctly', done => {
            facetQueryController.search(facetSearchParams).then(values => {
              expect(values).toEqual(generateMatcher(['a0', 'a1', 'a2', 'a3', 'a4']));
              expect(values).not.toEqual(generateMatcher(['b0', 'b1', 'b2', 'b3', 'b4']));
              done();
            });
          });

          it('should resolve search correctly with ? character', done => {
            mockFacet.options.allowedValues = ['b?'];
            facetQueryController.search(facetSearchParams).then(values => {
              expect(values).not.toEqual(generateMatcher(['a0', 'a1', 'a2', 'a3', 'a4']));
              expect(values).toEqual(generateMatcher(['b0', 'b1', 'b2', 'b3', 'b4']));
              done();
            });
          });

          it('should resolve fetch more correctly', done => {
            searchPromise = new Promise((resolve, reject) => {
              const results = FakeResults.createFakeResults();
              const groupByWithAToken = FakeResults.createFakeGroupByResult('@foo', 'a', 5);
              const groupByWithBToken = FakeResults.createFakeGroupByResult('@foo', 'b', 5);
              groupByWithAToken.values = groupByWithAToken.values.concat(groupByWithBToken.values);
              results.groupByResults[0] = groupByWithAToken;
              resolve(results);
            });

            mockFacet.options.allowedValues = ['a*'];
            facetQueryController.fetchMore(10).then((data: IQueryResults) => {
              expect(data.groupByResults[0].values).toEqual(generateMatcher(['a0', 'a1', 'a2', 'a3', 'a4']));
              expect(data.groupByResults[0].values).not.toEqual(generateMatcher(['b0', 'b1', 'b2', 'b3', 'b4']));
              done();
            });
          });
        });
      });
    });
  });
}
