import { Result } from './Result';
import { Expression } from '../Expression/Expression';
import _ = require('underscore');

export class RefResult extends Result {
  public failAttempt: Result;
  constructor(results: Result[], public expression: Expression, public input: string, lastResult: Result) {
    super(results, expression, input);
    if (_.last(results) != lastResult) {
      this.failAttempt = lastResult;
      if (this.failAttempt != null) {
        this.failAttempt.parent = this;
      }
    }
  }

  /**
   * Return all fail result.
   */
  public getExpect(): Result[] {
    var expect = super.getExpect();
    // add the failAttempt to the expect
    if (this.failAttempt != null) {
      return expect.concat(this.failAttempt.getExpect());
    }
    return expect;
  }

  /**
   * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
   */
  public clean(path?: Result[]): Result {
    // if there is no failAttempt, we will use the default clean
    if (this.failAttempt != null && (path != null || !this.isSuccess())) {
      path = path || _.last(this.getBestExpect()).path(this);
      var next = _.first(path);
      // if the next is in the subResults, not the failAttempt, do the default clean;
      if (next != null && next == this.failAttempt) {
        var last = _.last(this.subResults);
        // if the last is not successful, remove it because we want the failAttempt path
        var subResults: Result[] = _.map(last != null && last.isSuccess() ? this.subResults : _.initial(this.subResults), subResult =>
          subResult.clean()
        );
        subResults.push(next.clean(_.rest(path)));
        return new Result(subResults, this.expression, this.input);
      }
    }
    return super.clean(path);
  }
}
