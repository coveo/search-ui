import { SubGrammar } from './Expressions';
import { Field } from './Field';

export var NestedQuery: SubGrammar = {
  basicExpressions: ['NestedQuery'],
  grammars: {
    NestedQuery: '[[NestedField][OptionalSpaces][Expressions]]',
    NestedField: '[[Field]]',
    FieldValue: ['NestedQuery']
  },
  include: [Field]
};
