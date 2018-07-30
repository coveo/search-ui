import { Result } from '../Result/Result';
import { ExpressionFunctionArgument } from './ExpressionFunction';

export type ExpressionDef = RegExp | string | string[] | ExpressionFunctionArgument;

export interface Expression {
  id: string;
  parse: (input: string, end: boolean) => Result;
}
