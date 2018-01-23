import { Logger } from '../misc/Logger';
import { Utils } from '../utils/Utils';
import * as _ from 'underscore';

export class Assert {
  private static logger = new Logger('Assert');

  static failureHandler = (message?: string) => {
    Assert.logger.error('Assertion Failed!', message);

    if (window['console'] && console.trace) {
      console.trace();
    }

    if (Utils.isNonEmptyString(message)) {
      throw new PreconditionFailedException(message);
    } else {
      throw new PreconditionFailedException('Assertion Failed!');
    }
  };

  static fail(message?: string) {
    Assert.failureHandler(message);
  }

  static check(condition: boolean, message?: string) {
    if (!condition) {
      Assert.fail(message);
    }
  }

  static isUndefined(obj: any) {
    Assert.check(Utils.isUndefined(obj), 'Value should be undefined.');
  }

  static isNotUndefined(obj: any) {
    Assert.check(!Utils.isUndefined(obj), 'Value should not be undefined.');
  }

  static isNull(obj: any) {
    Assert.check(Utils.isNull(obj), 'Value should be null.');
  }

  static isNotNull(obj: any) {
    Assert.check(!Utils.isNull(obj), 'Value should not be null.');
  }

  static exists(obj: any) {
    Assert.check(!Utils.isNullOrUndefined(obj), 'Value should not be null or undefined');
  }

  static doesNotExists(obj: any) {
    Assert.check(Utils.isNullOrUndefined(obj), 'Value should be null or undefined');
  }

  static isString(obj: any) {
    Assert.check(_.isString(obj), 'Value should be a string.');
  }

  static stringStartsWith(str: string, start: string) {
    Assert.isNonEmptyString(str);
    Assert.isNonEmptyString(start);
    Assert.check(str.indexOf(start) == 0, 'Value should start with ' + start);
  }

  static isNonEmptyString(str: string) {
    Assert.check(Utils.isNonEmptyString(str), 'Value should be a non-empty string.');
  }

  static isNumber(obj: any) {
    Assert.check(_.isNumber(obj), 'Value should be a number.');
  }

  static isLargerThan(expected: number, actual: number) {
    Assert.check(actual > expected, 'Value ' + actual + ' should be larger than ' + expected);
  }

  static isLargerOrEqualsThan(expected: number, actual: number) {
    Assert.check(actual >= expected, 'Value ' + actual + ' should be larger or equal than ' + expected);
  }

  static isSmallerThan(expected: number, actual: number) {
    Assert.check(actual < expected, 'Value ' + actual + ' should be smaller than ' + expected);
  }

  static isSmallerOrEqualsThan(expected: number, actual: number) {
    Assert.check(actual <= expected, 'Value ' + actual + ' should be smaller or equal than ' + expected);
  }
}

export class PreconditionFailedException extends Error {
  constructor(public message: string) {
    super(message);
  }

  toString() {
    return this.message;
  }
}
