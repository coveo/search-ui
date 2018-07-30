import { Basic } from './Basic';
import { SubGrammar } from './Expressions';
export const QueryExtension: SubGrammar = {
  basicExpressions: ['QueryExtension'],
  grammars: {
    QueryExtension: '$[QueryExtensionName]([QueryExtensionArguments])',
    QueryExtensionName: /\w+/,
    QueryExtensionArguments: '[QueryExtensionArgumentList*][QueryExtensionArgument]',
    QueryExtensionArgumentList: '[QueryExtensionArgument][Spaces?],[Spaces?]',
    QueryExtensionArgument: '[QueryExtensionArgumentName]:[Spaces?][QueryExtensionArgumentValue]',
    QueryExtensionArgumentName: /\w+/,
    QueryExtensionArgumentValue: ['SingleQuoted', 'Expressions']
  },
  include: [Basic]
};
