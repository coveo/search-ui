/// <reference path="../Test.ts" />

module Coveo {
  import QueryController = Coveo.QueryController;
  import mockQueryController = Coveo.Mock.mockQueryController;
  describe('FacetQueryController', function () {

    var mockFacet: Facet;
    var facetQueryController: FacetQueryController;

    beforeEach(function () {
      mockFacet = Mock.mock<Facet>(Facet);
      mockFacet.options = {};
      mockFacet.options.field = '@field';
      var values: any = Mock.mock(FacetValues);
      mockFacet.values = values;
      (<jasmine.Spy>mockFacet.values.hasSelectedOrExcludedValues).and.returnValue(true);

      facetQueryController = new FacetQueryController(mockFacet);
    })

    afterEach(function () {
      mockFacet = null;
      facetQueryController = null;
    })

    it('should compute a filter expression', function () {
      (<jasmine.Spy>mockFacet.values.getSelected).and.returnValue([FacetValue.create('foo'), FacetValue.create('bar')]);
      (<jasmine.Spy>mockFacet.values.getExcluded).and.returnValue([]);


      var expectedBuilder = new ExpressionBuilder();
      expectedBuilder.addFieldExpression('@field', '==', ['foo', 'bar']);
      expect(facetQueryController.computeOurFilterExpression()).toBe(expectedBuilder.build());


      (<jasmine.Spy>mockFacet.values.getExcluded).and.returnValue([FacetValue.create('exclude1'), FacetValue.create('exclude2')]);
      expectedBuilder.addFieldNotEqualExpression('@field', ['exclude1', 'exclude2']);
      expect(facetQueryController.computeOurFilterExpression()).toBe(expectedBuilder.build());
    })

    describe('should push a group by into a query builder', function () {
      beforeEach(function () {
        (<jasmine.Spy>mockFacet.values.getSelected).and.returnValue([FacetValue.create('foo'), FacetValue.create('bar')]);
        (<jasmine.Spy>mockFacet.values.getExcluded).and.returnValue([]);
        mockFacet.numberOfValues = 5;
      })

      it('should put a group by into a query builder', function () {
        mockFacet.numberOfValues = 23;
        var queryBuilder = new QueryBuilder();
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        var groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.allowedValues).toEqual(jasmine.arrayContaining(['foo', 'bar']));
        expect(groupByRequest.field).toBe('@field');
        expect(groupByRequest.maximumNumberOfValues).toBe(23);
      })

      it('should request 1 more value if more / less is enabled', function () {
        mockFacet.options.enableMoreLess = true;

        var queryBuilder = new QueryBuilder();
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        var groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.maximumNumberOfValues).toBe(6);
      })

      it('should request only allowed values if set on the facet', function () {
        mockFacet.options.allowedValues = ['a', 'b', 'c']
        var queryBuilder = new QueryBuilder();
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        var groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.allowedValues).toEqual(jasmine.arrayContaining(['a', 'b', 'c']));
        expect(groupByRequest.allowedValues).not.toEqual(jasmine.arrayContaining(['foo', 'bar']));
      })

      it('should use lookupfield if set on facet', function () {
        mockFacet.options.lookupField = '@lookupfield';
        var queryBuilder = new QueryBuilder();
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        var groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.lookupField).toBe('@lookupfield');
      })

      it('should use computed field if set on facet', function () {
        mockFacet.options.computedField = '@computedfield';
        mockFacet.options.computedFieldOperation = 'sum';

        var queryBuilder = new QueryBuilder();
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        var groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.computedFields[0]).toEqual(jasmine.objectContaining({
          field: '@computedfield',
          operation: 'sum'
        }));
      })

      it('should use the additional filter if set on facet', function () {
        mockFacet.options.additionalFilter = '@additionalfilter';

        var queryBuilder = new QueryBuilder();
        facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
        var groupByRequest = queryBuilder.build().groupBy[0];
        expect(groupByRequest.constantQueryOverride).toBe('@additionalfilter');
      })

      it('should keep the expression to use for facet search after building a group by', function () {
        var builder = new QueryBuilder();
        builder.expression.add('something');
        builder.constantExpression.add('something constant');
        facetQueryController.putGroupByIntoQueryBuilder(builder);
        expect(facetQueryController.expressionToUseForFacetSearch).toBe('something');
        expect(facetQueryController.constantExpressionToUseForFacetSearch).toBe('something constant');
        facetQueryController.prepareForNewQuery();
        expect(facetQueryController.expressionToUseForFacetSearch).toBeUndefined();
        expect(facetQueryController.constantExpressionToUseForFacetSearch).toBeUndefined();
      })
    })

    describe('should perform search', function () {
      var mockEndpoint: SearchEndpoint;
      var mockQueryController: QueryController;
      beforeEach(function () {
        mockEndpoint = Mock.mockSearchEndpoint();
        mockQueryController = Mock.mockQueryController();

        mockFacet.searchInterface = <SearchInterface>{};
        mockFacet.searchInterface.isNewDesign = () => {
          return true;
        }
        mockFacet.queryController = mockQueryController;
        mockFacet.facetQueryController = facetQueryController;
        mockFacet.getEndpoint = jasmine.createSpy('endpoint');

        (<jasmine.Spy>mockFacet.getEndpoint).and.returnValue(mockEndpoint);
        (<jasmine.Spy>mockFacet.queryController.getLastQuery).and.returnValue(new QueryBuilder().build());
      })

      afterEach(function () {
        mockEndpoint = null;
        mockQueryController = null;
      })

      it('with params', function () {
        var params = new FacetSearchParameters(mockFacet);
        facetQueryController.search(params);
        expect(facetQueryController.facet.getEndpoint().search).toHaveBeenCalled();

        params.alwaysInclude = ['foo', 'bar'];
        facetQueryController.search(params);
        expect(facetQueryController.facet.getEndpoint().search).toHaveBeenCalledWith(jasmine.objectContaining({
          groupBy: jasmine.arrayContaining([jasmine.objectContaining({
            allowedValues: jasmine.arrayContaining(['foo', 'bar'])
          })])
        }))

        params.setValueToSearch('test');
        facetQueryController.search(params);
        expect(facetQueryController.facet.getEndpoint().search).toHaveBeenCalledWith(jasmine.objectContaining({
          groupBy: jasmine.arrayContaining([jasmine.objectContaining({
            allowedValues: jasmine.arrayContaining(['*test*'])
          })])
        }))
      })

      it('by copying last query', function () {
        var lastQueryBuilder = new QueryBuilder();
        lastQueryBuilder.pipeline = 'pipeline';
        lastQueryBuilder.enableWildcards = true;
        (<jasmine.Spy>mockFacet.queryController.getLastQuery).and.returnValue(lastQueryBuilder.build());

        facetQueryController.search(new FacetSearchParameters(mockFacet));
        expect(facetQueryController.facet.getEndpoint().search).toHaveBeenCalledWith(jasmine.objectContaining({
          wildcards: true,
          pipeline: 'pipeline'
        }))
      })
    })
  })
}
