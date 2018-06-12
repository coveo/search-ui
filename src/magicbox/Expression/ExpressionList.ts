import { Result } from '../Result/Result';
import { Expression } from './Expression';

export class ExpressionList implements Expression {
  constructor(private parts: Expression[], public id: string) {
    if (parts.length == 0) {
      throw new Error(JSON.stringify(id) + ' should have at least 1 parts');
    }
  }

  parse(input: string, end: boolean): Result {
    var subResults: Result[] = [];
    var subResult: Result;
    var subInput = input;

    for (var i = 0; i < this.parts.length; i++) {
      var part = this.parts[i];
      subResult = part.parse(subInput, end && i == this.parts.length - 1);
      subResults.push(subResult);
      // if the subResult do not succeed, stop the parsing
      if (!subResult.isSuccess()) {
        break;
      } else {
        subInput = subInput.substr(subResult.getLength());
      }
    }
    return new Result(subResults, this, input);
  }

  public toString() {
    return this.id;
  }
}
