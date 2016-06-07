/// <reference path="../Test.ts" />
module Coveo {
  describe('FacetSearchParameters', function() {
    var mockFacet: Facet;

    beforeEach(function() {
      mockFacet = Mock.mock<Facet>(Facet);
      mockFacet.options = {};
      mockFacet.options.numberOfValuesInFacetSearch = 10;
      mockFacet.options.facetSearchIgnoreAccents = false;
      mockFacet.searchInterface = <any>{};
      mockFacet.searchInterface.isNewDesign = () => {
        return true;
      }
    })

    afterEach(function() {
      mockFacet = null;
    })

    it('should allow to set value to search and expand it with different captions', function() {
      var params = new FacetSearchParameters(mockFacet);
      params.setValueToSearch('test');
      expect(params.alwaysInclude).toContain('test');

      mockFacet.options.valueCaption = {
        'foo': 'test',
        'bar': 'testing'
      }
      params = new FacetSearchParameters(mockFacet);
      params.setValueToSearch('test');
      expect(params.alwaysInclude).toContain('test');
      expect(params.alwaysInclude).toContain('foo');
      expect(params.alwaysInclude).toContain('bar');
    })

    it('should allow to build a group by request', function() {
      var params = new FacetSearchParameters(mockFacet);

      params.setValueToSearch('testing');
      var req = params.getGroupByRequest();
      expect(req.allowedValues).toContain('*testing*');
      expect(req.maximumNumberOfValues).toBe(mockFacet.options.numberOfValuesInFacetSearch);
      expect(req.field).toBe(mockFacet.options.field);
      expect(req.sortCriteria).toBe(params.sortCriteria);

      mockFacet.options.computedField = '@computefield';
      mockFacet.options.computedFieldOperation = 'sum';

      req = params.getGroupByRequest();
      expect(req.computedFields[0].field).toBe('@computefield');
      expect(req.computedFields[0].operation).toBe('sum');
    })

    describe('with facet having displayed values', function() {
      var elem: HTMLElement;

      beforeEach(function() {
        mockFacet.options.valueCaption = {
          'foo': 'test',
          'bar': 'testing'
        }
        var spy = <jasmine.Spy>mockFacet.getDisplayedFacetValues;
        spy.and.returnValue([FacetValue.createFromValue('a'), FacetValue.createFromValue('b'), FacetValue.createFromValue('c')]);

        elem = document.createElement('div');
        var oneValue = document.createElement('div');
        var twoValue = document.createElement('div');
        $$(oneValue).text('test');
        $$(twoValue).text('qwerty');
        oneValue.className = 'coveo-facet-value-caption';
        twoValue.className = 'coveo-facet-value-caption';
        elem.appendChild(oneValue);
        elem.appendChild(twoValue);
      })

      afterEach(function() {
        elem = null;
      })

      it('allows to exclude currently displayed values in search', function() {
        var params = new FacetSearchParameters(mockFacet);
        params.excludeCurrentlyDisplayedValuesInSearch(elem);
        expect(params.alwaysExclude.length).toBe(7);
        expect(params.alwaysExclude).toContain('test');
        expect(params.alwaysExclude).toContain('foo');
        expect(params.alwaysExclude).toContain('bar');
        expect(params.alwaysExclude).toContain('qwerty');
        expect(params.alwaysExclude).toContain('a');
        expect(params.alwaysExclude).toContain('b');
        expect(params.alwaysExclude).toContain('c');
      })

      it('allows to create a group by', function() {
        var params = new FacetSearchParameters(mockFacet);
        params.setValueToSearch('qwerty');
        var groupBy = params.getGroupByRequest();
        expect(groupBy.allowedValues).toContain('*qwerty*');
        expect(groupBy.allowedValues).not.toContain('test');
        expect(groupBy.allowedValues).not.toContain('c');

        params.excludeCurrentlyDisplayedValuesInSearch(elem);
        groupBy = params.getGroupByRequest();
        expect(groupBy.allowedValues).toContain('*qwerty*');
        expect(groupBy.allowedValues).toContain('test');
        expect(groupBy.allowedValues).toContain('c');
      })

      it('allow to create a query duplicated from the last one', function() {
        var spy = jasmine.createSpy('spy');
        var builder = new QueryBuilder();
        builder.enablePartialMatch = true;

        mockFacet.queryController = <QueryController>{};
        mockFacet.queryController.getLastQuery = spy;
        spy.and.returnValue(builder.build());

        mockFacet.facetQueryController = <FacetQueryController>{};
        mockFacet.facetQueryController.expressionToUseForFacetSearch = '@asdf';
        mockFacet.facetQueryController.constantExpressionToUseForFacetSearch = '@qwerty';

        var params = new FacetSearchParameters(mockFacet);
        expect(params.getQuery().partialMatch).toBe(true);
        expect(params.getQuery().q).toBe('@asdf');
        expect(params.getQuery().cq).toBe('@qwerty');
      })
    })
  })
}
