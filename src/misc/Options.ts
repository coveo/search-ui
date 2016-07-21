import _ = require('underscore');
import {Utils} from '../utils/Utils';

export class Options {
  public merge<T>(provided: T): T {
    return _.extend({}, this, provided);
  }

  public mergeDeep<T>(provided: T): T {
    return _.extend({}, Utils.extendDeep(this, provided));
  }
}
