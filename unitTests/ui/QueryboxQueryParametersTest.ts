import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { QueryboxQueryParameters } from '../../src/ui/Querybox/QueryboxQueryParameters';
export function QueryboxQueryParametersTest() {
  describe('QueryBoxQueryParameters', () => {
    let builder: QueryBuilder;

    beforeEach(() => {
      builder = new QueryBuilder();
    });

    afterEach(() => {
      builder = null;
      QueryboxQueryParameters.allowDuplicateQuery();
    });

    it('should add enableLowercaseOperators to builder', () => {
      new QueryboxQueryParameters({
        enableLowercaseOperators: true
      }).addParameters(builder, 'foobar');

      expect(builder.enableLowercaseOperators).toBe(true);
    });

    it('should add enableQuestionMarks to builder', () => {
      new QueryboxQueryParameters({
        enableQuestionMarks: true
      }).addParameters(builder, 'foobar');

      expect(builder.enableQuestionMarks).toBe(true);
    });

    it('should add enableWildcards to builder', () => {
      new QueryboxQueryParameters({
        enableWildcards: true
      }).addParameters(builder, 'foobar');

      expect(builder.enableWildcards).toBe(true);
    });

    it('should add enableQuerySyntax to builder', () => {
      new QueryboxQueryParameters({
        enableQuerySyntax: true
      }).addParameters(builder, 'foobar');

      expect(builder.enableQuerySyntax).toBe(true);

      QueryboxQueryParameters.allowDuplicateQuery();

      new QueryboxQueryParameters({
        enableQuerySyntax: false
      }).addParameters(builder, 'foobar');

      expect(builder.enableQuerySyntax).toBe(false);
    });

    it('should add enablePartialMatch to builder', () => {
      new QueryboxQueryParameters({
        enablePartialMatch: true,
        partialMatchKeywords: 123,
        partialMatchThreshold: '12%'
      }).addParameters(builder, 'foobar');

      expect(builder.enablePartialMatch).toBe(true);
      expect(builder.partialMatchKeywords).toBe(123);
      expect(builder.partialMatchThreshold).toBe('12%');
    });

    it('should block duplicate execution of the query parameters', () => {
      const param1 = new QueryboxQueryParameters({
        enableQuerySyntax: false
      });
      const param2 = new QueryboxQueryParameters({
        enableQuerySyntax: true
      });

      param1.addParameters(builder, 'foobar');
      // param2 should be blocked, since it's the same call stack
      param2.addParameters(builder, 'foobar2');

      expect(builder.enableQuerySyntax).toBe(false);
      expect(builder.build().q).toBe('foobar');
    });
  });
}
