import {QueryBuilder} from '../../src/ui/Base/QueryBuilder';
import {QueryboxQueryParameters} from '../../src/ui/Querybox/QueryboxQueryParameters';
export function QueryboxQueryParametersTest() {
  describe('QueryBoxQueryParameters', () => {
    let builder: QueryBuilder;

    beforeEach(() => {
      builder = new QueryBuilder();
    });

    afterEach(() => {
      builder = null;
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
        enableQuerySyntax: false
      }).addParameters(builder, 'foobar');

      expect(builder.disableQuerySyntax).toBe(true);
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
  });
}
