import {Promise} from 'es6-promise';

export function shim() {
  Promise.prototype['finally'] = function finallyPolyfill(callback) {
    var constructor = this.constructor;
    return this.then(function (value) {
      return constructor.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return constructor.resolve(callback()).then(function () {
        throw reason;
      });
    });
  }
}
