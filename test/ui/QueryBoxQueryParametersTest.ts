/// <reference path="../Test.ts" />
module Coveo {
  describe('QueryBoxQueryParameters', ()=> {
    let builder: QueryBuilder;

    beforeEach(()=> {
      builder = new QueryBuilder();
    })

    afterEach(()=> {
      builder = null;
    })

    it('should add enableLowercaseOperators to builder', ()=> {
      new QueryBoxQueryParameters({
        enableLowercaseOperators: true
      }).addParameters(builder, 'foobar');

      expect(builder.enableLowercaseOperators).toBe(true)
    })

    it('should add enableQuestionMarks to builder', ()=> {
      new QueryBoxQueryParameters({
        enableQuestionMarks: true
      }).addParameters(builder, 'foobar');

      expect(builder.enableQuestionMarks).toBe(true)
    })

    it('should add enableWildcards to builder', ()=> {
      new QueryBoxQueryParameters({
        enableWildcards: true
      }).addParameters(builder, 'foobar');

      expect(builder.enableWildcards).toBe(true)
    })

    it('should add enableQuerySyntax to builder', ()=> {
      new QueryBoxQueryParameters({
        enableQuerySyntax: false
      }).addParameters(builder, 'foobar');

      expect(builder.disableQuerySyntax).toBe(true)
    })

    it('should add enablePartialMatch to builder', ()=> {
      new QueryBoxQueryParameters({
        enablePartialMatch: true,
        partialMatchKeywords: 123,
        partialMatchThreshold: '12%'
      }).addParameters(builder, 'foobar');

      expect(builder.enablePartialMatch).toBe(true);
      expect(builder.partialMatchKeywords).toBe(123);
      expect(builder.partialMatchThreshold).toBe('12%');
    })
  })
}