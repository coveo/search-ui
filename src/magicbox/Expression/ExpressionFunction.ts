import { Expression } from './Expression';
import { Result } from '../Result/Result';
import { Grammar } from '../Grammar';

export interface ExpressionFunctionArgument {
  (input: string, end: boolean, expression: Expression): Result;
}

export class ExpressionFunction implements Expression {
  constructor(public func: ExpressionFunctionArgument, public id: string, public grammar: Grammar) {}

  public parse(input: string, end: boolean): Result {
    return this.func(input, end, this);
  }

  public toString() {
    return this.id;
  }
}
