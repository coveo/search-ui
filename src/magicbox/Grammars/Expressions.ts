import { Grammar } from '../Grammar';
import { ExpressionDef } from '../Expression/Expression';
import * as _ from 'underscore';

export interface SubGrammar {
  grammars?: { [id: string]: ExpressionDef };
  expressions?: string[];
  basicExpressions?: string[];
  include?: SubGrammar[];
}

function loadSubGrammar(
  expressions: string[],
  basicExpressions: string[],
  grammars: { [id: string]: ExpressionDef },
  subGrammar: SubGrammar
) {
  _.each(subGrammar.expressions, expression => {
    if (!_.contains(expressions, expression)) {
      expressions.push(expression);
    }
  });
  _.each(subGrammar.basicExpressions, expression => {
    if (!_.contains(basicExpressions, expression)) {
      basicExpressions.push(expression);
    }
  });
  _.each(subGrammar.grammars, (expressionDef: ExpressionDef, id: string) => {
    if (!(id in grammars)) {
      grammars[id] = expressionDef;
    } else {
      if (_.isArray(grammars[id]) && _.isArray(expressionDef)) {
        _.each(<string[]>expressionDef, (value: string) => {
          (<string[]>grammars[id]).push(value);
        });
      } else {
        _.each(<string[]>expressionDef, (value: string) => {
          (<string[]>grammars[id]).push(value);
        });
        throw new Error('Can not merge ' + id + '(' + JSON.stringify(expressionDef) + ' => ' + JSON.stringify(grammars[id]) + ')');
      }
    }
  });
}

export function Expressions(...subGrammars: SubGrammar[]): { start: string; expressions: { [id: string]: ExpressionDef } } {
  var expressions: string[] = [];
  var BasicExpression: string[] = [];
  var grammars: { [id: string]: ExpressionDef } = {
    Start: ['Expressions', 'Empty'],
    Expressions: '[OptionalSpaces][Expression][ExpressionsList*][OptionalSpaces]',
    ExpressionsList: '[Spaces][Expression]',
    Expression: expressions,
    BasicExpression: BasicExpression,
    OptionalSpaces: / */,
    Spaces: / +/,
    Empty: /(?!.)/
  };
  for (var i = 0; i < subGrammars.length; i++) {
    loadSubGrammar(expressions, BasicExpression, grammars, subGrammars[i]);
    _.each(subGrammars[i].include, subGrammar => {
      if (!_.contains(subGrammars, subGrammar)) {
        subGrammars.push(subGrammar);
      }
    });
  }
  expressions.push('BasicExpression');
  return {
    start: 'Start',
    expressions: grammars
  };
}

export function ExpressionsGrammar(...subGrammars: SubGrammar[]) {
  var grammar = Expressions.apply(this, subGrammars);
  return new Grammar(grammar.start, grammar.expressions);
}
