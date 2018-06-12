import { SubGrammar } from './Expressions';
import { Basic } from './Basic';

export const Date: SubGrammar = {
  grammars: {
    Date: '[DateYear]/[DateMonth]/[DateDay]',
    DateYear: /([0-9]{4})/,
    DateMonth: /(1[0-2]|0?[1-9])/,
    DateDay: /([1-2][0-9]|3[0-1]|0?[1-9])/,
    DateRange: '[Date][Spaces?]..[Spaces?][Date]',
    DateRelative: ['DateRelativeNegative', 'DateRelativeTerm'],
    DateRelativeTerm: /now|today|yesterday/,
    DateRelativeNegative: '[DateRelativeTerm][DateRelativeNegativeRef]',
    DateRelativeNegativeRef: /([\-\+][0-9]+(s|m|h|d|mo|y))/
  },
  include: [Basic]
};
