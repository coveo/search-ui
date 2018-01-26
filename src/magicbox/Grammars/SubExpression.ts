import { SubGrammar } from './Expressions';

export const SubExpression: SubGrammar = {
  basicExpressions: ['SubExpression'],
  grammars: {
    SubExpression: '([Expressions])'
  }
};
