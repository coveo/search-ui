import { SubGrammar } from './Expressions';
import { NestedQuery } from './NestedQuery';
import { QueryExtension } from './QueryExtension';
import { Basic } from './Basic';
import { Field } from './Field';
import { SubExpression } from './SubExpression';

export const Complete: SubGrammar = {
  include: [NestedQuery, QueryExtension, SubExpression, Field, Basic]
};
