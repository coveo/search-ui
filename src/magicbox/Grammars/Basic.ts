import { SubGrammar } from './Expressions';
import { Expression } from '../Expression/Expression';
import { Result } from '../Result/Result';
import { EndOfInputResult } from '../Result/Result';

export const notWordStart = ' ()[],$@\'"';
export const notInWord = ' ()[],:';

export const Basic: SubGrammar = {
  basicExpressions: ['Word', 'DoubleQuoted'],
  grammars: {
    DoubleQuoted: '"[NotDoubleQuote]"',
    NotDoubleQuote: /[^"]*/,
    SingleQuoted: "'[NotSingleQuote]'",
    NotSingleQuote: /[^']*/,
    Number: /-?(0|[1-9]\d*)(\.\d+)?/,
    Word: (input: string, end: boolean, expression: Expression) => {
      const regex = new RegExp('[^' + notWordStart.replace(/(.)/g, '\\$1') + '][^' + notInWord.replace(/(.)/g, '\\$1') + ']*');
      let groups = input.match(regex);
      if (groups != null && groups.index != 0) {
        groups = null;
      }
      const result = new Result(groups != null ? groups[0] : null, expression, input);
      if (result.isSuccess() && end && input.length > result.value.length) {
        return new EndOfInputResult(result);
      }
      return result;
    }
  }
};
