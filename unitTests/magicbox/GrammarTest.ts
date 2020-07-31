import { Grammar } from '../../src/magicbox/Grammar';
import { ExpressionConstant } from '../../src/magicbox/Expression/ExpressionConstant';
import { ExpressionRef } from '../../src/magicbox/Expression/ExpressionRef';
import { ExpressionOptions } from '../../src/magicbox/Expression/ExpressionOptions';
import { ExpressionList } from '../../src/magicbox/Expression/ExpressionList';
import { ExpressionRegExp } from '../../src/magicbox/Expression/ExpressionRegExp';
import { Grammars } from '../../src/magicbox/Grammars/Grammars';

export function GrammarTest() {
  describe('Grammar Expression Builder build expression of type', () => {
    it('ExpressionConstant', () => {
      var exp = Grammar.buildExpression('foo', 'id', null);
      expect(exp).toEqual(jasmine.any(ExpressionConstant));
    });

    it('ExpressionRef', () => {
      var exp = <ExpressionRef>Grammar.buildExpression('[foo]', 'id', null);
      expect(exp).toEqual(jasmine.any(ExpressionRef));
      expect(exp.ref).toBe('foo');
      expect(exp.occurrence).toBeNull();

      exp = <ExpressionRef>Grammar.buildExpression('[foo?]', 'id', null);
      expect(exp).toEqual(jasmine.any(ExpressionRef));
      expect(exp.ref).toBe('foo');
      expect(exp.occurrence).toBe('?');

      exp = <ExpressionRef>Grammar.buildExpression('[foo{2}]', 'id', null);
      expect(exp).toEqual(jasmine.any(ExpressionRef));
      expect(exp.ref).toBe('foo');
      expect(exp.occurrence).toBe(2);
    });

    it('ExpressionOptions', () => {
      var exp = <ExpressionOptions>Grammar.buildExpression(['foo', 'bar'], 'id', null);
      expect(exp).toEqual(jasmine.any(ExpressionOptions));
      expect(exp.parts.length).toBe(2);
    });

    it('ExpressionList', () => {
      // this generate a list because at [ he do not know if it will be a ref start
      var exp1 = Grammar.buildExpression('foo[bar', 'id', null);
      expect(exp1).toEqual(jasmine.any(ExpressionList));

      var exp2 = Grammar.buildExpression('foo[bar]', 'id', null);
      expect(exp2).toEqual(jasmine.any(ExpressionList));
    });

    it('ExpressionRegExp', () => {
      var exp = Grammar.buildExpression(/foo/, 'id', null);
      expect(exp).toEqual(jasmine.any(ExpressionRegExp));
    });
  });
  // http://pegjs.org/online

  /*
   A = "A" B?
   B = "B" C
   C = "C"
   */

  describe('ABC Grammar parse correctly', () => {
    var FakeGrammar = new Grammar('A', {
      A: 'A[B?]',
      B: 'B[C+]',
      C: 'C'
    });

    var FakeGrammar2 = new Grammar('A', {
      A: '[B][C*]',
      B: 'B',
      C: 'C[B]'
    });

    it('Empty String', () => {
      var result = FakeGrammar.parse('');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected "A" but end of input found.');
    });
    it('"A"', () => {
      var result = FakeGrammar.parse('A');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"AB"', () => {
      var result = FakeGrammar.parse('AB');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected "C" but end of input found.');
    });
    it('"ABC"', () => {
      var result = FakeGrammar.parse('ABC');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"AC"', () => {
      var result = FakeGrammar.parse('AC');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected "B" but "C" found.');
    });
    it('"ABBC"', () => {
      var result = FakeGrammar.parse('ABBC');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected "C" but "B" found.');
    });

    it('"BC"', () => {
      var result = FakeGrammar2.parse('BC');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected "B" but end of input found.');
    });

    it('"BCBB"', () => {
      var result = FakeGrammar2.parse('BCBB');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected end of input or "C" but "B" found.');
      expect(result.clean().toString()).toBe('BCBB');
    });
  });

  /*
  bcbb
  
   Expr = Product / Sum / Value
   Value = SubExpr / Number
   SubExpr = "(" Expr ")"
   Number = [0-9]+
   Product = Value "*" Value
   Sum= Value "+" Value
  
   */

  describe('Math Grammar parse correctly', () => {
    var FakeGrammar = new Grammar('Expr', {
      Expr: ['Product', 'Sum', 'Value'],
      Value: ['SubExpr', 'Number'],
      SubExpr: '([Expr])',
      Number: /([1-9][0-9]*|0)(\.[0-9]+)?/,
      Product: '[Value]*[Value]',
      Sum: '[Value]+[Value]'
    });

    it('Empty String', () => {
      var result = FakeGrammar.parse('');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected Expr but end of input found.');
    });
    it('"1"', () => {
      var result = FakeGrammar.parse('1');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"1+"', () => {
      var result = FakeGrammar.parse('1+');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected Value but end of input found.');
    });
    it('"1+2"', () => {
      var result = FakeGrammar.parse('1+2');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"1+2+"', () => {
      var result = FakeGrammar.parse('1+2+');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected end of input but "+" found.');
    });
    it('"1+2+3"', () => {
      var result = FakeGrammar.parse('1+2+3');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected end of input but "+" found.');
    });
    it('"(1+2)+3"', () => {
      var result = FakeGrammar.parse('(1+2)+3');
      expect(result.isSuccess()).toBeTruthy();
    });
  });

  describe('Coveo Field Grammar parse correctly', () => {
    var completeExpressions = Grammars.Expressions(Grammars.Complete);
    var coveoGrammar = new Grammar(completeExpressions.start, completeExpressions.expressions);

    it('Empty String', () => {
      var result = coveoGrammar.parse('');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName"', () => {
      var result = coveoGrammar.parse('@fieldName');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName="', () => {
      var result = coveoGrammar.parse('@fieldName=');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected FieldValue but end of input found.');
      console.log(result.clean());
    });
    it('"@fieldName=value"', () => {
      var result = coveoGrammar.parse('@fieldName=value');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName=(value"', () => {
      var result = coveoGrammar.parse('@fieldName=(value');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected FieldValueSeparator or ")" but end of input found.');
    });
    it('"@fieldName=(value)"', () => {
      var result = coveoGrammar.parse('@fieldName=(value)');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName=(value,)"', () => {
      var result = coveoGrammar.parse('@fieldName=(value,)');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected FieldValueString but ")" found.');
    });
    it('"@fieldName=(value, abc)"', () => {
      var result = coveoGrammar.parse('@fieldName=(value, abc)');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"word @fieldName=(value, abc)"', () => {
      var result = coveoGrammar.parse('word @fieldName=(value, abc)');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"word @fieldName =  (value  , abc)"', () => {
      var result = coveoGrammar.parse('word @fieldName =  (value  , abc)');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName=value]"', () => {
      var result = coveoGrammar.parse('@fieldName=value]');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected Spaces or end of input but "]" found.');
    });
    it('"word (word2"', () => {
      var result = coveoGrammar.parse('word (word2');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected ":" or Spaces or ")" but end of input found.');
    });
    it('"word(word2)"', () => {
      var result = coveoGrammar.parse('word(word2)');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected ":" or Spaces or end of input but "(" found.');
    });
    it('"word (word2)"', () => {
      var result = coveoGrammar.parse('word (word2)');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"word OR (word2)"', () => {
      var result = coveoGrammar.parse('word OR (word2)');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"word OR"', () => {
      var result = coveoGrammar.parse('word OR');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"(word OR (word2))"', () => {
      var result = coveoGrammar.parse('(word OR (word2))');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"word @"', () => {
      var result = coveoGrammar.parse('word @');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected FieldName but end of input found.');
    });
    it('"foo ( bar foo )"', () => {
      var result = coveoGrammar.parse('foo ( bar foo )');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"foo bar"', () => {
      var result = coveoGrammar.parse('foo bar');
      expect(result.isSuccess()).toBeTruthy();
      expect(result.clean().toString()).toBe('foo bar');
    });
    it('"$extension("', () => {
      var result = coveoGrammar.parse('$extension(');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected QueryExtensionArgumentName but end of input found.');
    });
    it('"$extension(a"', () => {
      var result = coveoGrammar.parse('$extension(a');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected ":" but end of input found.');
    });
    it('"$extension(a:"', () => {
      var result = coveoGrammar.parse('$extension(a:');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected QueryExtensionArgumentValue but end of input found.');
    });
    it('"$extension(a:value"', () => {
      var result = coveoGrammar.parse('$extension(a:value');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected ":" or Spaces or "," or ")" but end of input found.');
    });
    it('"$extension(a:value)"', () => {
      var result = coveoGrammar.parse('$extension(a:value)');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"$extension(a:value,"', () => {
      var result = coveoGrammar.parse('$extension(a:value,');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected QueryExtensionArgumentName but end of input found.');
    });
    it('"$extension(a:value,b"', () => {
      var result = coveoGrammar.parse('$extension(a:value,b');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected ":" but end of input found.');
    });
    it('"$extension(a:value,b:"', () => {
      var result = coveoGrammar.parse('$extension(a:value,b:');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected QueryExtensionArgumentValue but end of input found.');
    });
    it('"$extension(a:value,b:\'"', () => {
      var result = coveoGrammar.parse("$extension(a:value,b:'");
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected "\'" but end of input found.');
    });
    it('"$extension(a:value,b:\'abc\')"', () => {
      var result = coveoGrammar.parse("$extension(a:value,b:'abc')");
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"["', () => {
      var result = coveoGrammar.parse('[');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected "[" but end of input found.');
    });
    it('"[["', () => {
      var result = coveoGrammar.parse('[[');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected "@" but end of input found.');
    });
    it('"[[@field"', () => {
      var result = coveoGrammar.parse('[[@field');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected "]" but end of input found.');
    });
    it('"[[@field]"', () => {
      var result = coveoGrammar.parse('[[@field]');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected Expression but end of input found.');
    });
    it('"[[@field]]"', () => {
      var result = coveoGrammar.parse('[[@field]]');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected Expression but "]" found.');
    });
    it('"[[@field] @sysuri"', () => {
      var result = coveoGrammar.parse('[[@field] @sysuri');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected FieldQueryOperation or Spaces or "]" but end of input found.');
    });
    it('"[[@field] @sysuri]"', () => {
      var result = coveoGrammar.parse('[[@field] @sysuri]');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('""Not Quoted""', () => {
      var result = coveoGrammar.parse('"Not Quoted"');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('" start with space"', () => {
      var result = coveoGrammar.parse(' start with space');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"end with space "', () => {
      var result = coveoGrammar.parse('end with space ');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName<now"', () => {
      var result = coveoGrammar.parse('@fieldName<now');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName<now-d"', () => {
      var result = coveoGrammar.parse('@fieldName<now-d');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected DateRelativeNegativeRef or Spaces or end of input but "-" found.');
    });
    it('"@fieldName<now-1d"', () => {
      var result = coveoGrammar.parse('@fieldName<now-1d');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName<10..420"', () => {
      var result = coveoGrammar.parse('@fieldName<10..420');
      expect(result.isSuccess()).toBeFalsy();
      expect(result.getHumanReadableExpect()).toBe('Expected Spaces or end of input but "." found.');
    });
    it('"@fieldName=10..420"', () => {
      var result = coveoGrammar.parse('@fieldName=10..420');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName=420"', () => {
      var result = coveoGrammar.parse('@fieldName=420');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName<420"', () => {
      var result = coveoGrammar.parse('@fieldName<420');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName<4.20"', () => {
      var result = coveoGrammar.parse('@fieldName<4.20');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName<4,20"', () => {
      var result = coveoGrammar.parse('@fieldName<4,20');
      expect(result.isSuccess()).toBeFalsy();
    });
    it('"@fieldName<-4.20"', () => {
      var result = coveoGrammar.parse('@fieldName<-4.20');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('"@fieldName<4.20.20"', () => {
      var result = coveoGrammar.parse('@fieldName<4.20.20');
      expect(result.isSuccess()).toBeFalsy();
    });
    it('@fieldName>=2000/01/01', () => {
      var result = coveoGrammar.parse('@fieldName>=2000/01/01');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('@fieldName<=2000/01/01', () => {
      var result = coveoGrammar.parse('@fieldName<=2000/01/01');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('@fieldName>2000/01/01', () => {
      var result = coveoGrammar.parse('@fieldName>2000/01/01');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('@fieldName<2000/01/01', () => {
      var result = coveoGrammar.parse('@fieldName<2000/01/01');
      expect(result.isSuccess()).toBeTruthy();
    });
    it('@fieldName==2000/01/01', () => {
      var result = coveoGrammar.parse('@fieldName==2000/01/01');
      expect(result.isSuccess()).toBeTruthy();
    });
  });
}
