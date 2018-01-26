import { Result } from './Result';
import { ExpressionEndOfInput } from '../Expression/ExpressionEndOfInput';

export class EndOfInputResult extends Result {
  constructor(result: Result) {
    super([result], ExpressionEndOfInput, result.input);
    var endOfInput = new Result(null, ExpressionEndOfInput, result.input.substr(result.getLength()));
    endOfInput.parent = this;
    this.subResults.push(endOfInput);
  }
}
