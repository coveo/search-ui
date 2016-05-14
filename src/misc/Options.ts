import _ =require('underscore');
import {extendDeep} from '../utils/Utils';

export class Options {
  public merge<T>(provided: T): T {
    return _.extend({}, this, provided);
  }

  public mergeDeep<T>(provided: T): T {
    return _.extend({}, extendDeep(this, provided));
  }
}