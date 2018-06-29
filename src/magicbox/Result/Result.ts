import { Expression } from '../Expression/Expression';
import { ExpressionEndOfInput } from '../Expression/ExpressionEndOfInput';
import { ExpressionConstant } from '../Expression/ExpressionConstant';
import _ = require('underscore');

export class Result {
  public value: string;
  public subResults: Result[];
  public parent: Result;

  constructor(value: string | Result[], public expression: Expression, public input: string) {
    if (_.isString(value)) {
      this.value = <string>value;
    } else if (_.isArray(value)) {
      this.subResults = <Result[]>value;
      _.forEach(this.subResults, (subResult: Result) => {
        subResult.parent = this;
      });
    }
  }

  public isSuccess() {
    // if null is the value, this mean the expression could not parse this input
    return this.value != null || (this.subResults != null && _.all(this.subResults, subResult => subResult.isSuccess()));
  }

  /**
   * Return path to this result ([parent.parent, parent, this])
   */
  public path(until?: Result): Result[] {
    var path: Result[] = this.parent != null && this.parent != until ? this.parent.path(until) : [];
    path.push(this);
    return path;
  }

  /**
   * Return the closest parent that match the condition (can be it-self). If match is a string, it will search for the result expresion id
   */
  public findParent(match: string | { (result: Result): boolean }): Result {
    var parent = <Result>this;
    var iterator = _.isString(match) ? (result: Result) => match == result.expression.id : <{ (result: Result): boolean }>match;
    while (parent != null && !iterator(parent)) {
      parent = parent.parent;
    }
    return parent;
  }

  /**
   * Return the first child that match the condition (can be it-self). If match is a string, it will search for the result expresion id
   */
  public find(match: string | { (result: Result): boolean }): Result {
    var iterator = _.isString(match) ? (result: Result) => match == result.expression.id : <{ (result: Result): boolean }>match;
    if (iterator(this)) {
      return this;
    }
    if (this.subResults) {
      for (var i = 0; i < this.subResults.length; i++) {
        var subResultFind = this.subResults[i].find(iterator);
        if (subResultFind) {
          return subResultFind;
        }
      }
    }
    return null;
  }

  /**
   * Return all children that match the condition (can be it-self). If match is a string, it will search for the result expresion id
   */
  public findAll(match: string | { (result: Result): boolean }): Result[] {
    var results: Result[] = [];
    var iterator = _.isString(match) ? (result: Result) => match == result.expression.id : <{ (result: Result): boolean }>match;
    if (iterator(this)) {
      results.push(this);
    }
    if (this.subResults) {
      results = _.reduce(this.subResults, (results, subResult: Result) => results.concat(subResult.findAll(iterator)), results);
    }
    return results;
  }

  /**
   * Return the first child that match the condition (can be it-self). If match is a string, it will search for the result expresion id
   */
  public resultAt(index: number, match?: string | { (result: Result): boolean }): Result[] {
    if (index < 0 || index > this.getLength()) {
      return [];
    }
    if (match != null) {
      if (_.isString(match)) {
        if (match == this.expression.id) {
          return [this];
        }
      } else {
        if ((<{ (result: Result): boolean }>match)(this)) {
          return [this];
        }
      }
    } else {
      var value = this.value == null && this.subResults == null ? this.input : this.value;
      if (value != null) {
        return [this];
      }
    }

    if (this.subResults != null) {
      var results = [];
      for (var i = 0; i < this.subResults.length; i++) {
        var subResult = this.subResults[i];
        results = results.concat(subResult.resultAt(index, match));
        index -= subResult.getLength();
        if (index < 0) {
          break;
        }
      }
      return results;
    }

    return [];
  }

  /**
   * Return all fail result.
   */
  public getExpect(): Result[] {
    if (this.value == null && this.subResults == null) {
      return [this];
    }
    if (this.subResults != null) {
      return _.reduce(this.subResults, (expect: Result[], result: Result) => expect.concat(result.getExpect()), []);
    }
    return [];
  }

  /**
   * Return the best fail result (The farthest result who got parsed). We also remove duplicate and always return the simplest result of a kind
   */
  public getBestExpect(): Result[] {
    var expects = this.getExpect();
    var groups = _.groupBy(expects, expect => expect.input);
    var key = _.last(
      _.keys(groups).sort((a, b) => {
        return b.length - a.length;
      })
    );
    var bestResults = groups[key];
    var groups = _.groupBy(bestResults, expect => expect.expression.id);
    return _.map(groups, (bestResults: Result[]): Result => {
      return _.chain(bestResults)
        .map(result => {
          return {
            path: result.path().length,
            result: result
          };
        })
        .sortBy('path')
        .pluck('result')
        .first()
        .value();
    });
  }

  public getHumanReadableExpect() {
    var expect = this.getBestExpect();
    var input = expect.length > 0 ? _.last(expect).input : '';
    return (
      'Expected ' +
      _.map(expect, (result: Result) => result.getHumanReadable()).join(' or ') +
      ' but ' +
      (input.length > 0 ? JSON.stringify(input[0]) : 'end of input') +
      ' found.'
    );
  }

  /**
   * Return a string that represent what is before this result
   */
  public before(): string {
    if (this.parent == null) {
      return '';
    }
    var index = _.indexOf(this.parent.subResults, this);
    return (
      this.parent.before() +
      _.chain(this.parent.subResults)
        .first(index)
        .map(subResult => subResult.toString())
        .join('')
        .value()
    );
  }

  /**
   * Return a string that represent what is after this result
   */
  public after(): string {
    if (this.parent == null) {
      return '';
    }
    var index = _.indexOf(this.parent.subResults, this);
    return (
      _.chain(this.parent.subResults)
        .last(this.parent.subResults.length - index - 1)
        .map(subResult => subResult.toString())
        .join('')
        .value() + this.parent.after()
    );
  }

  /**
   * Return the length of the result
   */
  public getLength() {
    if (this.value != null) {
      return this.value.length;
    }

    if (this.subResults != null) {
      return _.reduce(this.subResults, (length: number, subResult: Result) => length + subResult.getLength(), 0);
    }

    return this.input.length;
  }

  public toHtmlElement(): HTMLElement {
    var element = document.createElement('span');
    var id = this.expression != null ? this.expression.id : null;

    if (id != null) {
      element.setAttribute('data-id', id);
    }

    element.setAttribute('data-success', this.isSuccess().toString());

    if (this.value != null) {
      element.appendChild(document.createTextNode(this.value));
      element.setAttribute('data-value', this.value);
    } else if (this.subResults != null) {
      _.each(this.subResults, (subResult: Result) => {
        element.appendChild(subResult.toHtmlElement());
      });
    } else {
      element.appendChild(document.createTextNode(this.input));
      element.setAttribute('data-input', this.input);
      element.className = 'magic-box-error' + (this.input.length > 0 ? '' : ' magic-box-error-empty');
    }

    element['result'] = this;

    return element;
  }

  /**
   * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
   */
  public clean(path?: Result[]): Result {
    if (path != null || !this.isSuccess()) {
      path = path || _.last(this.getBestExpect()).path(this);
      var next = _.first(path);
      if (next != null) {
        var nextIndex = _.indexOf(this.subResults, next);
        var subResults: Result[] = nextIndex == -1 ? [] : _.map(_.first(this.subResults, nextIndex), subResult => subResult.clean());
        subResults.push(next.clean(_.rest(path)));
        return new Result(subResults, this.expression, this.input);
      } else {
        return new Result(null, this.expression, this.input);
      }
    }
    if (this.value != null) {
      return new Result(this.value, this.expression, this.input);
    }
    if (this.subResults != null) {
      return new Result(_.map(this.subResults, subResult => subResult.clean()), this.expression, this.input);
    }
  }

  public clone(): Result {
    if (this.value != null) {
      return new Result(this.value, this.expression, this.input);
    }
    if (this.subResults != null) {
      return new Result(_.map(this.subResults, subResult => subResult.clone()), this.expression, this.input);
    }
    return new Result(null, this.expression, this.input);
  }

  public toString() {
    if (this.value != null) {
      return this.value;
    }
    if (this.subResults != null) {
      return _.map(this.subResults, subresult => subresult.toString()).join('');
    }
    return this.input;
  }

  public getHumanReadable() {
    if (this.expression instanceof ExpressionConstant) {
      return JSON.stringify((<ExpressionConstant>this.expression).value);
    }
    return this.expression.id;
  }
}

export class EndOfInputResult extends Result {
  constructor(result: Result) {
    super([result], ExpressionEndOfInput, result.input);
    var endOfInput = new Result(null, ExpressionEndOfInput, result.input.substr(result.getLength()));
    endOfInput.parent = this;
    this.subResults.push(endOfInput);
  }
}
