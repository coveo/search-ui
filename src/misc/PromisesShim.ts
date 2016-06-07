import {Promise} from 'es6-promise';

export function shim() {

  Promise.prototype['finally'] = function finallyPolyfill(callback) {
    let constructor = this.constructor;
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

  let rethrowError = (self) => {
    self.then(null, function (err) {
      setTimeout(function () {
        throw err
      }, 0)
    })
  }

  if (typeof Promise.prototype['done'] !== 'function') {
    Promise.prototype['done'] = function (onFulfilled, onRejected) {
      let self = arguments.length ? this.then.apply(this, arguments) : this
      rethrowError(self);
      return this;
    }
  }

  if (typeof Promise.prototype['fail'] !== 'function') {
    Promise.prototype['fail'] = function (onFulfilled, onRejected) {
      let self = arguments.length ? this.catch.apply(this, arguments) : this
      rethrowError(self);
      return this;
    }
  }
}
