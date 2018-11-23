import { Expression } from './Expression';
import { Grammar } from '../Grammar';
import { Result } from '../Result/Result';
import { EndOfInputResult } from '../Result/Result';

export class ExpressionRegExp implements Expression {
  constructor(public value: RegExp, public id: string, grammar: Grammar) {}

  parse(input: string, end: boolean): Result {
    var groups = input.match(this.value);
    // if the RegExp do not match at the start, ignore it
    if (groups != null && groups.index != 0) {
      groups = null;
    }
    var result = new Result(groups != null ? groups[0] : null, this, input);
    // if is successful and we require the end but the length of parsed is
    // lower than the input length, return a EndOfInputExpected Result
    if (result.isSuccess() && end && input.length > result.value.length) {
      return new EndOfInputResult(result);
    }
    return result;
  }

  public toString() {
    return this.id;
  }
}
