import { Basic } from './Basic';
import { SubGrammar } from './Expressions';
import { Date } from './Date';
export const Field: SubGrammar = {
  basicExpressions: ['FieldSimpleQuery', 'FieldQuery', 'Field'],
  grammars: {
    FieldQuery: '[Field][OptionalSpaces][FieldQueryOperation]',
    FieldQueryOperation: ['FieldQueryValue', 'FieldQueryNumeric'],
    FieldQueryValue: '[FieldOperator][OptionalSpaces][FieldValue]',
    FieldQueryNumeric: '[FieldOperatorNumeric][OptionalSpaces][FieldValueNumeric]',
    FieldSimpleQuery: '[FieldName]:[OptionalSpaces][FieldValue]',
    Field: '@[FieldName]',
    FieldName: /[a-zA-Z][a-zA-Z0-9\.\_]*/,
    FieldOperator: /==|=|<>/,
    FieldOperatorNumeric: /<=|>=|<|>/,
    FieldValue: ['DateRange', 'NumberRange', 'DateRelative', 'Date', 'Number', 'FieldValueList', 'FieldValueString'],
    FieldValueNumeric: ['DateRelative', 'Date', 'Number'],
    FieldValueString: ['DoubleQuoted', 'FieldValueNotQuoted'],
    FieldValueList: '([FieldValueString][FieldValueStringList*])',
    FieldValueStringList: '[FieldValueSeparator][FieldValueString]',
    FieldValueSeparator: / *, */,
    FieldValueNotQuoted: /[^ \(\)\[\],]+/,
    NumberRange: '[Number][Spaces?]..[Spaces?][Number]'
  },
  include: [Date, Basic]
};
