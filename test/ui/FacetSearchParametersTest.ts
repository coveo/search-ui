import { Facet } from '../../src/ui/Facet/Facet';
import * as Mock from '../MockEnvironment';
import { FacetSearchParameters } from '../../src/ui/Facet/FacetSearchParameters';
import { FacetValue } from '../../src/ui/Facet/FacetValues';
import { $$ } from '../../src/utils/Dom';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { QueryController } from '../../src/controllers/QueryController';
import { FacetQueryController } from '../../src/controllers/FacetQueryController';

export function FacetSearchParametersTest() {
  describe('FacetSearchParameters', () => {
    let mockFacet: Facet;

    beforeEach(() => {
      mockFacet = Mock.mock<Facet>(Facet);
      mockFacet.options = {};
      mockFacet.options.numberOfValuesInFacetSearch = 10;
      mockFacet.options.facetSearchIgnoreAccents = false;
      mockFacet.searchInterface = <any>{};
    });

    afterEach(() => {
      mockFacet = null;
    });

    it('should allow to set value to search and expand it with different captions', () => {
      let params = new FacetSearchParameters(mockFacet);
      params.setValueToSearch('test');
      expect(params.alwaysInclude).toContain('test');

      mockFacet.options.valueCaption = {
        foo: 'test',
        bar: 'testing'
      };
      params = new FacetSearchParameters(mockFacet);
      params.setValueToSearch('test');
      expect(params.alwaysInclude).toContain('test');
      expect(params.alwaysInclude).toContain('foo');
      expect(params.alwaysInclude).toContain('bar');
    });

    it('should allow to build a group by request', () => {
      let params = new FacetSearchParameters(mockFacet);

      params.setValueToSearch('testing');
      let req = params.getGroupByRequest();
      expect(req.allowedValues).toContain('*testing*');
      expect(req.maximumNumberOfValues).toBe(mockFacet.options.numberOfValuesInFacetSearch);
      expect(req.field).toBe(mockFacet.options.field);
      expect(req.sortCriteria).toBe(params.sortCriteria);

      mockFacet.options.computedField = '@computefield';
      mockFacet.options.computedFieldOperation = 'sum';

      req = params.getGroupByRequest();
      expect(req.computedFields[0].field).toBe('@computefield');
      expect(req.computedFields[0].operation).toBe('sum');
    });

    describe('with facet having displayed values', () => {
      let elem: HTMLElement;

      beforeEach(() => {
        mockFacet.options.valueCaption = {
          foo: 'test',
          bar: 'testing'
        };
        const spy = <jasmine.Spy>mockFacet.getDisplayedFacetValues;
        spy.and.returnValue([FacetValue.createFromValue('a'), FacetValue.createFromValue('b'), FacetValue.createFromValue('c')]);

        elem = document.createElement('div');
        const oneValue = document.createElement('div');
        const twoValue = document.createElement('div');
        $$(oneValue).text('test');
        $$(twoValue).text('qwerty');
        oneValue.className = 'coveo-facet-value-caption';
        twoValue.className = 'coveo-facet-value-caption';
        elem.appendChild(oneValue);
        elem.appendChild(twoValue);
      });

      afterEach(() => {
        elem = null;
      });

      it('allows to exclude currently displayed values in search', () => {
        const params = new FacetSearchParameters(mockFacet);
        params.excludeCurrentlyDisplayedValuesInSearch(elem);
        expect(params.alwaysExclude.length).toBe(7);
        expect(params.alwaysExclude).toContain('test');
        expect(params.alwaysExclude).toContain('foo');
        expect(params.alwaysExclude).toContain('bar');
        expect(params.alwaysExclude).toContain('qwerty');
        expect(params.alwaysExclude).toContain('a');
        expect(params.alwaysExclude).toContain('b');
        expect(params.alwaysExclude).toContain('c');
      });

      it('allows to create a group by', () => {
        const params = new FacetSearchParameters(mockFacet);
        params.setValueToSearch('qwerty');
        let groupBy = params.getGroupByRequest();
        expect(groupBy.allowedValues).toContain('*qwerty*');
        expect(groupBy.allowedValues).not.toContain('test');
        expect(groupBy.allowedValues).not.toContain('c');

        params.excludeCurrentlyDisplayedValuesInSearch(elem);
        groupBy = params.getGroupByRequest();
        expect(groupBy.allowedValues).toContain('*qwerty*');
        expect(groupBy.allowedValues).toContain('test');
        expect(groupBy.allowedValues).toContain('c');
      });

      describe('should duplicate query', () => {
        let spy: jasmine.Spy;
        let builder: QueryBuilder;

        beforeEach(() => {
          spy = jasmine.createSpy('spy');
          builder = new QueryBuilder();
          mockFacet.queryController = <QueryController>{};
          mockFacet.queryController.getLastQuery = spy;
          mockFacet.facetQueryController = <FacetQueryController>{};
          mockFacet.facetQueryController.basicExpressionToUseForFacetSearch = '@basic';
          mockFacet.facetQueryController.advancedExpressionToUseForFacetSearch = '@advanced';
          mockFacet.facetQueryController.constantExpressionToUseForFacetSearch = '@constant';
        });

        afterEach(() => {
          spy = null;
          builder = null;
        });

        it('should contain the same parameters as last one', () => {
          builder.enablePartialMatch = true;
          builder.enableQuerySyntax = true;
          spy.and.returnValue(builder.build());
          const params = new FacetSearchParameters(mockFacet);
          expect(params.getQuery().partialMatch).toBe(true);
          expect(params.getQuery().q).toBe('@basic');
          expect(params.getQuery().aq).toBe('@advanced');
          expect(params.getQuery().cq).toBe('@constant');
        });

        it('should force the duplicated query to enable query syntax, with @uri in basic expression', () => {
          builder.enableQuerySyntax = false;
          mockFacet.facetQueryController.basicExpressionToUseForFacetSearch = '@uri';
          spy.and.returnValue(builder.build());
          const params = new FacetSearchParameters(mockFacet);
          expect(params.getQuery().enableQuerySyntax).toBe(true);
          expect(params.getQuery().q).toBe('');
          expect(params.getQuery().aq).toBe('@advanced');
          expect(params.getQuery().cq).toBe('@constant');
        });

        it('should force the duplicated query to enable query syntax, with a field expression in basic expression', () => {
          builder.enableQuerySyntax = false;
          mockFacet.facetQueryController.basicExpressionToUseForFacetSearch = '@test=a';
          spy.and.returnValue(builder.build());
          const params = new FacetSearchParameters(mockFacet);
          expect(params.getQuery().enableQuerySyntax).toBe(true);
          expect(params.getQuery().q).toBe('<@- @test=a -@>');
          expect(params.getQuery().aq).toBe('@advanced');
          expect(params.getQuery().cq).toBe('@constant');
        });

        it('should not modify the basic expression if query syntax was originally enabled', () => {
          builder.enableQuerySyntax = true;
          mockFacet.facetQueryController.basicExpressionToUseForFacetSearch = '@test=a';
          spy.and.returnValue(builder.build());
          const params = new FacetSearchParameters(mockFacet);
          expect(params.getQuery().enableQuerySyntax).toBe(true);
          expect(params.getQuery().q).toBe('@test=a');
          expect(params.getQuery().aq).toBe('@advanced');
          expect(params.getQuery().cq).toBe('@constant');
        });

        it('should not modify the basic expression with @uri if query syntax was originally enabled', () => {
          builder.enableQuerySyntax = true;
          mockFacet.facetQueryController.basicExpressionToUseForFacetSearch = '@uri';
          spy.and.returnValue(builder.build());
          const params = new FacetSearchParameters(mockFacet);
          expect(params.getQuery().enableQuerySyntax).toBe(true);
          expect(params.getQuery().q).toBe('@uri');
          expect(params.getQuery().aq).toBe('@advanced');
          expect(params.getQuery().cq).toBe('@constant');
        });

        it('should use the same group by parameters as the facet', () => {
          mockFacet.options.sortCriteria = 'alphaascending';
          spy.and.returnValue(builder.build());
          const params = new FacetSearchParameters(mockFacet);
          expect(params.getQuery().groupBy[0].sortCriteria).toBe('alphaascending');
          mockFacet.options.sortCriteria = 'occurences';
          expect(params.getQuery().groupBy[0].sortCriteria).toBe('occurences');
        });
      });
    });
  });
}
