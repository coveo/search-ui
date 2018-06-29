import { Result } from './Result';
import _ = require('underscore');
import { Expression } from '../Expression/Expression';

export class OptionResult extends Result {
  constructor(private result: Result, public expression: Expression, public input: string, public failAttempt: Result[]) {
    super(result != null ? [result] : null, expression, input);
    _.forEach(this.failAttempt, subResult => {
      subResult.parent = this;
    });
  }

  /**
   * Return all fail result.
   */
  public getExpect(): Result[] {
    var expect = [];
    if (this.result != null) {
      expect = this.result.getExpect();
    }
    expect = _.reduce(this.failAttempt, (expect: Result[], result: Result) => expect.concat(result.getExpect()), expect);
    if (expect.length > 0 && _.all(expect, result => result.input == this.input)) {
      return [this];
    }
    return expect;
  }

  /**
   * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
   */
  public clean(path?: Result[]): Result {
    if (path != null || !this.isSuccess()) {
      // Result will be a ref. We skip it for cleaner tree.
      path = _.rest(path || _.last(this.getBestExpect()).path(this));
      // next can be Result or one of the failAttempt. In both case we have only one child
      var next = _.first(path);
      if (next == null) {
        return new Result(null, this.expression, this.input);
      }
      return new Result([next.clean(_.rest(path))], this.expression, this.input);
    }
    // Result will be a ref. We skip it for cleaner tree.
    return new Result(_.map(this.result.subResults, subResult => subResult.clean()), this.expression, this.input);
  }
}
