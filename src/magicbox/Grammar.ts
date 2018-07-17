import { ExpressionRef } from './Expression/ExpressionRef';
import { Expression, ExpressionDef } from './Expression/Expression';
import { ExpressionOptions } from './Expression/ExpressionOptions';
import { ExpressionRegExp } from './Expression/ExpressionRegExp';
import _ = require('underscore');
import { ExpressionFunction, ExpressionFunctionArgument } from './Expression/ExpressionFunction';
import { ExpressionConstant } from './Expression/ExpressionConstant';
import { ExpressionList } from './Expression/ExpressionList';
import { Result } from './Result/Result';

export class Grammar {
  public start: ExpressionRef;
  public expressions: { [id: string]: Expression } = {};

  constructor(start: string, expressions: { [id: string]: ExpressionDef } = {}) {
    this.start = new ExpressionRef(start, null, 'start', this);
    this.addExpressions(expressions);
  }

  public addExpressions(expressions: { [id: string]: ExpressionDef }) {
    _.each(expressions, (basicExpression: ExpressionDef, id: string) => {
      this.addExpression(id, basicExpression);
    });
  }

  public addExpression(id: string, basicExpression: ExpressionDef) {
    if (id in this.expressions) {
      throw new Error('Grammar already contain the id:' + id);
    }
    this.expressions[id] = Grammar.buildExpression(basicExpression, id, this);
  }

  public getExpression(id: string) {
    return this.expressions[id];
  }

  public parse(value: string): Result {
    return this.start.parse(value, true);
  }

  public static buildExpression(value: ExpressionDef, id: string, grammar: Grammar): Expression {
    const type = typeof value;
    if (type == 'undefined') {
      throw new Error('Invalid Expression: ' + value);
    }
    if (_.isString(value)) {
      return this.buildStringExpression(<string>value, id, grammar);
    }
    if (_.isArray(value)) {
      return new ExpressionOptions(_.map(<string[]>value, (v: string, i) => new ExpressionRef(v, null, id + '_' + i, grammar)), id);
    }
    if (_.isRegExp(value)) {
      return new ExpressionRegExp(<RegExp>value, id, grammar);
    }
    if (_.isFunction(value)) {
      return new ExpressionFunction(<ExpressionFunctionArgument>value, id, grammar);
    }
    throw new Error('Invalid Expression: ' + value);
  }

  public static buildStringExpression(value: string, id: string, grammar: Grammar): Expression {
    const matchs = Grammar.stringMatch(value, Grammar.spliter);
    const expressions = _.map(matchs, (match: string[], i: number): Expression => {
      if (match[1]) {
        // Ref
        const ref = match[1];
        const occurrence = match[3] ? Number(match[3]) : match[2] || null;
        return new ExpressionRef(ref, occurrence, id + '_' + i, grammar);
      } else {
        // Constant
        return new ExpressionConstant(match[4], id + '_' + i);
      }
    });
    if (expressions.length == 1) {
      const expression = expressions[0];
      expression.id = id;
      return expression;
    } else {
      return new ExpressionList(expressions, id);
    }
  }

  public static stringMatch(str: string, re: RegExp) {
    const groups: string[][] = [];
    const cloneRegExp = new RegExp(re.source, 'g');
    let group: RegExpExecArray = cloneRegExp.exec(str);

    while (group !== null) {
      groups.push(group);
      group = cloneRegExp.exec(str);
    }
    return groups;
  }

  static spliter = /\[(\w+)(\*|\+|\?|\{([1-9][0-9]*)\})?\]|(.[^\[]*)/;
}
