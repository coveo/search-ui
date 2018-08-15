import { Basic, notInWord, notWordStart } from './Basic';
import { Complete } from './Complete';
import { Date } from './Date';
import { Expressions, ExpressionsGrammar, SubGrammar } from './Expressions';
import { ExpressionFunctionArgument } from '../Expression/ExpressionFunction';
import { Field } from './Field';
import { NestedQuery } from './NestedQuery';
import { QueryExtension } from './QueryExtension';
import { SubExpression } from './SubExpression';
export type SubGrammarImported = SubGrammar;
export type ExpressionFunctionArgumentImported = ExpressionFunctionArgument;

export const Grammars = {
  Basic,
  notInWord,
  notWordStart,
  Complete,
  Date,
  Expressions,
  ExpressionsGrammar,
  Field,
  NestedQuery,
  QueryExtension,
  SubExpression
};
