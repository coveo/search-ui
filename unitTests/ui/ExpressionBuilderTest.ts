import { ExpressionBuilder } from '../../src/ui/Base/ExpressionBuilder';

export function ExpressionBuilderTest() {
  describe('ExpressionBuilder', () => {
    var expressionBuilder: ExpressionBuilder;
    beforeEach(() => {
      expressionBuilder = new ExpressionBuilder();
    });

    afterEach(() => {
      expressionBuilder = null;
    });

    it('can add an expression', () => {
      expressionBuilder.add('foo');
      expressionBuilder.add('bar');
      expect(expressionBuilder.build()).toBe('(foo) (bar)');
    });

    it('can add a fieldExpression', () => {
      expressionBuilder.addFieldExpression('@foo', '==', ['bar1', 'bar2', 'bar3']);
      expect(expressionBuilder.build()).toBe('@foo==(bar1,bar2,bar3)');
      expressionBuilder.addFieldExpression('@foo2', '<>', ['bar 1', 'bar 2', 'bar 3']);
      expect(expressionBuilder.build()).toBe('(@foo==(bar1,bar2,bar3)) (@foo2<>("bar 1","bar 2","bar 3"))');
    });

    it('can add a field not equal expression', () => {
      expressionBuilder.addFieldNotEqualExpression('@foo', ['bar 1', 'bar2', 'bar3']);
      expect(expressionBuilder.build()).toBe('(NOT @foo==("bar 1",bar2,bar3))');
    });

    it('can be built while empty, and return undefined', () => {
      expect(expressionBuilder.build()).toBeUndefined();
    });

    it('can be merged with another expression builder', () => {
      var expressionBuilder2 = new ExpressionBuilder();
      expressionBuilder.add('1');
      expressionBuilder2.add('2');
      expect(ExpressionBuilder.merge(expressionBuilder, expressionBuilder2).build()).toBe('(1) (2)');
    });

    it('can merge using OR', () => {
      var builder1 = new ExpressionBuilder();
      var builder2 = new ExpressionBuilder();
      var builder3 = new ExpressionBuilder();
      builder1.add('foo');
      builder1.add('bar');
      builder2.add('spam');
      var merged = ExpressionBuilder.mergeUsingOr(builder1, builder2, builder3);
      expect(merged.build()).toBe('((foo) (bar)) OR (spam)');

      merged = ExpressionBuilder.mergeUsingOr(builder1);
      expect(merged.build()).toBe('(foo) (bar)');

      merged = ExpressionBuilder.mergeUsingOr(builder1, builder3);
      expect(merged.build()).toBe('(foo) (bar)');

      merged = ExpressionBuilder.mergeUsingOr(builder3);
      expect(merged.build()).toBeUndefined();
    });

    it("can tell if it's empty", () => {
      expect(expressionBuilder.isEmpty()).toBe(true);
      expressionBuilder.add('foo');
      expect(expressionBuilder.isEmpty()).toBe(false);
    });

    it('can remove an expression', () => {
      expressionBuilder.add('foo');
      expressionBuilder.add('bar');
      expressionBuilder.addFieldNotEqualExpression('@field', ['a', 'b', 'c']);
      expressionBuilder.remove('bar');
      expect(expressionBuilder.build()).toBe('(foo) ((NOT @field==(a,b,c)))');
      expressionBuilder.remove('(NOT @field==(a,b,c))');
      expect(expressionBuilder.build()).toBe('foo');
    });
  });
}
