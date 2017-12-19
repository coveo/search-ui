import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
export function QueryBuilderTest() {
  describe('QueryBuilder', () => {
    var queryBuilder: QueryBuilder;

    beforeEach(() => {
      queryBuilder = new QueryBuilder();
    });

    afterEach(() => {
      queryBuilder = null;
    });

    it('can addContextValue and addContext', () => {
      queryBuilder.addContextValue('foo', 'bar');
      expect(queryBuilder.build().context['foo']).toBe('bar');
      queryBuilder.addContext({ a: 'b', c: 'd' });
      expect(queryBuilder.build().context['foo']).toBe('bar');
      expect(queryBuilder.build().context['a']).toBe('b');
    });

    it('can addFieldsToInclude', () => {
      queryBuilder.addFieldsToInclude(['foo', 'bar', 'yo']);
      expect(queryBuilder.build().fieldsToInclude).toEqual(['foo', 'bar', 'yo']);
    });

    it('can addFieldsToExclude', () => {
      expect(queryBuilder.build().fieldsToExclude).toBeUndefined();
      queryBuilder.addFieldsToExclude(['a', 'b', 'c']);
      expect(queryBuilder.build().fieldsToExclude).toEqual(['a', 'b', 'c']);
    });

    it('can addRequiredFields', () => {
      queryBuilder.addRequiredFields(['foo', 'bar', 'yo']);
      // Should not be added, as there is not fieldsToInclude
      expect(queryBuilder.build().fieldsToInclude).toBeNull();
      queryBuilder.addFieldsToInclude(['a', 'b', 'c']);
      // Now everything should be there, as fieldsToInclude were added
      expect(queryBuilder.build().fieldsToInclude).toEqual(['foo', 'bar', 'yo', 'a', 'b', 'c']);
    });

    describe('can compute expression', () => {
      beforeEach(() => {
        queryBuilder.expression.add('basic');
        queryBuilder.advancedExpression.add('advanced');
        queryBuilder.constantExpression.add('constant');
        queryBuilder.disjunctionExpression.add('disjunction');
        queryBuilder.longQueryExpression.add('long');
      });

      it('and computeCompleteExpression', () => {
        expect(queryBuilder.computeCompleteExpression()).toBe('((basic) (advanced) (constant)) OR (disjunction)');
      });

      it('and computeCompleteExpressionParts', () => {
        expect(queryBuilder.computeCompleteExpressionParts().constant).toBe('(constant) OR (disjunction)');
        expect(queryBuilder.computeCompleteExpressionParts().withoutConstant).toBe('((basic) (advanced)) OR (disjunction)');
        expect(queryBuilder.computeCompleteExpressionParts().full).toBe('((basic) (advanced) (constant)) OR (disjunction)');
      });

      it('and computeCompleteExpressionExcept', () => {
        expect(queryBuilder.computeCompleteExpressionExcept('advanced')).toBe('((basic) (constant)) OR (disjunction)');
        expect(queryBuilder.computeCompleteExpressionExcept('basic')).toBe('((advanced) (constant)) OR (disjunction)');
      });

      it('and computeCompleteExpressionPartsExcept', () => {
        expect(queryBuilder.computeCompleteExpressionPartsExcept('advanced').constant).toBe('(constant) OR (disjunction)');
        expect(queryBuilder.computeCompleteExpressionPartsExcept('advanced').withoutConstant).toBe('(basic) OR (disjunction)');
        expect(queryBuilder.computeCompleteExpressionPartsExcept('advanced').full).toBe('((basic) (constant)) OR (disjunction)');
      });
    });

    it('can add properties to query', () => {
      queryBuilder.pipeline = 'pipeline';
      queryBuilder.timezone = 'timezone';
      queryBuilder.searchHub = 'searchHub';
      queryBuilder.tab = 'tab';
      queryBuilder.maximumAge = 123;
      queryBuilder.enableWildcards = true;
      queryBuilder.enableQuestionMarks = true;
      queryBuilder.enableLowercaseOperators = true;
      queryBuilder.enablePartialMatch = true;
      queryBuilder.partialMatchKeywords = 123;
      queryBuilder.partialMatchThreshold = '50%';
      queryBuilder.firstResult = 123;
      queryBuilder.numberOfResults = 123;
      queryBuilder.excerptLength = 123;
      queryBuilder.filterField = 'filterField';
      queryBuilder.filterFieldRange = 123;
      queryBuilder.parentField = 'parentField';
      queryBuilder.childField = 'childField';
      queryBuilder.enableDidYouMean = true;
      queryBuilder.enableDebug = true;
      queryBuilder.enableCollaborativeRating = true;
      queryBuilder.sortCriteria = 'sortCriteria';
      queryBuilder.queryFunctions = [
        {
          function: 'function',
          fieldName: 'fieldName'
        }
      ];
      queryBuilder.rankingFunctions = [
        {
          expression: 'expression',
          normalizeWeight: true
        }
      ];
      queryBuilder.groupByRequests = [
        {
          field: 'field'
        }
      ];
      queryBuilder.enableDuplicateFiltering = true;
      queryBuilder.context = {
        foo: 'bar'
      };

      expect(queryBuilder.build().pipeline).toBe('pipeline');
      expect(queryBuilder.build().timezone).toBe('timezone');
      expect(queryBuilder.build().searchHub).toBe('searchHub');
      expect(queryBuilder.build().tab).toBe('tab');
      expect(queryBuilder.build().maximumAge).toBe(123);
      expect(queryBuilder.build().wildcards).toBe(true);
      expect(queryBuilder.build().questionMark).toBe(true);
      expect(queryBuilder.build().lowercaseOperators).toBe(true);
      expect(queryBuilder.build().partialMatch).toBe(true);
      expect(queryBuilder.build().partialMatchKeywords).toBe(123);
      expect(queryBuilder.build().partialMatchThreshold).toBe('50%');
      expect(queryBuilder.build().firstResult).toBe(123);
      expect(queryBuilder.build().numberOfResults).toBe(123);
      expect(queryBuilder.build().excerptLength).toBe(123);
      expect(queryBuilder.build().filterField).toBe('filterField');
      expect(queryBuilder.build().filterFieldRange).toBe(123);
      expect(queryBuilder.build().parentField).toBe('parentField');
      expect(queryBuilder.build().childField).toBe('childField');
      expect(queryBuilder.build().enableDidYouMean).toBe(true);
      expect(queryBuilder.build().debug).toBe(true);
      expect(queryBuilder.build().enableCollaborativeRating).toBe(true);
      expect(queryBuilder.build().sortCriteria).toBe('sortCriteria');
      expect(queryBuilder.build().queryFunctions).toEqual([
        {
          function: 'function',
          fieldName: 'fieldName'
        }
      ]);
      expect(queryBuilder.build().rankingFunctions).toEqual([
        {
          expression: 'expression',
          normalizeWeight: true
        }
      ]);
      expect(queryBuilder.build().groupBy).toEqual([
        {
          field: 'field'
        }
      ]);
      expect(queryBuilder.build().enableDuplicateFiltering).toBe(true);
      expect(queryBuilder.build().context).toEqual({
        foo: 'bar'
      });
    });

    it('should be able to detect end user keywords in the basic expression', () => {
      queryBuilder.expression.add('foo');
      expect(queryBuilder.containsEndUserKeywords()).toBeTruthy();
    });

    it('should be able to detect end user keywords in the long query expression', () => {
      queryBuilder.longQueryExpression.add('foo');
      expect(queryBuilder.containsEndUserKeywords()).toBeTruthy();
    });

    it('should be able to detect if no end user keywords exist in either the basic or long expression', () => {
      expect(queryBuilder.containsEndUserKeywords()).toBeFalsy();
    });
  });
}
