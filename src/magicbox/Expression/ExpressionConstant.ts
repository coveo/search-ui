import { Expression } from './Expression';
import { Result } from '../Result/Result';
import { EndOfInputResult } from '../Result/Result';

export class ExpressionConstant implements Expression {
  constructor(public value: string, public id: string) {}

  public parse(input: string, end: boolean): Result {
    // the value must be at the start of the input
    var success = input.indexOf(this.value) == 0;
    var result = new Result(success ? this.value : null, this, input);
    // if is successful and we require the end but the length of parsed is
    // lower than the input length, return a EndOfInputExpected Result
    if (success && end && input.length > this.value.length) {
      return new EndOfInputResult(result);
    }
    return result;
  }

  public toString() {
    return this.value;
  }
}
