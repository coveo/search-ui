var playground =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(3);
var Utils_1 = __webpack_require__(2);
var _ = __webpack_require__(1);
var Assert = (function () {
    function Assert() {
    }
    Assert.fail = function (message) {
        Assert.failureHandler(message);
    };
    Assert.check = function (condition, message) {
        if (!condition) {
            Assert.fail(message);
        }
    };
    Assert.isUndefined = function (obj) {
        Assert.check(Utils_1.Utils.isUndefined(obj), 'Value should be undefined.');
    };
    Assert.isNotUndefined = function (obj) {
        Assert.check(!Utils_1.Utils.isUndefined(obj), 'Value should not be undefined.');
    };
    Assert.isNull = function (obj) {
        Assert.check(Utils_1.Utils.isNull(obj), 'Value should be null.');
    };
    Assert.isNotNull = function (obj) {
        Assert.check(!Utils_1.Utils.isNull(obj), 'Value should not be null.');
    };
    Assert.exists = function (obj) {
        Assert.check(!Utils_1.Utils.isNullOrUndefined(obj), 'Value should not be null or undefined');
    };
    Assert.doesNotExists = function (obj) {
        Assert.check(Utils_1.Utils.isNullOrUndefined(obj), 'Value should be null or undefined');
    };
    Assert.isString = function (obj) {
        Assert.check(_.isString(obj), 'Value should be a string.');
    };
    Assert.stringStartsWith = function (str, start) {
        Assert.isNonEmptyString(str);
        Assert.isNonEmptyString(start);
        Assert.check(str.indexOf(start) == 0, 'Value should start with ' + start);
    };
    Assert.isNonEmptyString = function (str) {
        Assert.check(Utils_1.Utils.isNonEmptyString(str), 'Value should be a non-empty string.');
    };
    Assert.isNumber = function (obj) {
        Assert.check(_.isNumber(obj), 'Value should be a number.');
    };
    Assert.isLargerThan = function (expected, actual) {
        Assert.check(actual > expected, 'Value ' + actual + ' should be larger than ' + expected);
    };
    Assert.isLargerOrEqualsThan = function (expected, actual) {
        Assert.check(actual >= expected, 'Value ' + actual + ' should be larger or equal than ' + expected);
    };
    Assert.isSmallerThan = function (expected, actual) {
        Assert.check(actual < expected, 'Value ' + actual + ' should be smaller than ' + expected);
    };
    Assert.isSmallerOrEqualsThan = function (expected, actual) {
        Assert.check(actual <= expected, 'Value ' + actual + ' should be smaller or equal than ' + expected);
    };
    return Assert;
}());
Assert.logger = new Logger_1.Logger('Assert');
Assert.failureHandler = function (message) {
    Assert.logger.error('Assertion Failed!', message);
    if (window['console'] && console.trace) {
        console.trace();
    }
    if (Utils_1.Utils.isNonEmptyString(message)) {
        throw new PreconditionFailedException(message);
    }
    else {
        throw new PreconditionFailedException('Assertion Failed!');
    }
};
exports.Assert = Assert;
var PreconditionFailedException = (function (_super) {
    __extends(PreconditionFailedException, _super);
    function PreconditionFailedException(message) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        return _this;
    }
    PreconditionFailedException.prototype.toString = function () {
        return this.message;
    };
    return PreconditionFailedException;
}(Error));
exports.PreconditionFailedException = PreconditionFailedException;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return _;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}.call(this));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(1);
var isCoveoFieldRegex = /^@[a-zA-Z0-9_\.]+$/;
var Utils = (function () {
    function Utils() {
    }
    Utils.isUndefined = function (obj) {
        return typeof obj == 'undefined';
    };
    Utils.isNull = function (obj) {
        return obj === null;
    };
    Utils.isNullOrUndefined = function (obj) {
        return Utils.isUndefined(obj) || Utils.isNull(obj);
    };
    Utils.exists = function (obj) {
        return !Utils.isNullOrUndefined(obj);
    };
    Utils.toNotNullString = function (str) {
        return _.isString(str) ? str : '';
    };
    Utils.anyTypeToString = function (value) {
        return value ? value.toString() : '';
    };
    Utils.isNullOrEmptyString = function (str) {
        return Utils.isNullOrUndefined(str) || !Utils.isNonEmptyString(str);
    };
    Utils.isNonEmptyString = function (str) {
        return _.isString(str) && str !== '';
    };
    Utils.isEmptyString = function (str) {
        return !Utils.isNonEmptyString(str);
    };
    Utils.stringStartsWith = function (str, startWith) {
        return str.slice(0, startWith.length) == startWith;
    };
    Utils.isNonEmptyArray = function (obj) {
        return _.isArray(obj) && obj.length > 0;
    };
    Utils.isEmptyArray = function (obj) {
        return !Utils.isNonEmptyArray(obj);
    };
    Utils.isHtmlElement = function (obj) {
        if (window['HTMLElement'] != undefined) {
            return obj instanceof HTMLElement;
        }
        else {
            return obj && obj.nodeType && obj.nodeType == 1;
        }
    };
    Utils.parseIntIfNotUndefined = function (str) {
        if (Utils.isNonEmptyString(str)) {
            return parseInt(str, 10);
        }
        else {
            return undefined;
        }
    };
    Utils.parseFloatIfNotUndefined = function (str) {
        var a = 't';
        a instanceof HTMLDocument;
        if (Utils.isNonEmptyString(str)) {
            return parseFloat(str);
        }
        else {
            return undefined;
        }
    };
    Utils.round = function (num, decimals) {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    };
    Utils.parseBooleanIfNotUndefined = function (str) {
        if (Utils.isNonEmptyString(str)) {
            switch (str.toLowerCase()) {
                case 'true':
                case '1':
                case 'yes':
                    return true;
                case 'false':
                case '0':
                case 'no':
                    return false;
                default:
                    return undefined;
            }
        }
        else {
            return undefined;
        }
    };
    Utils.trim = function (value) {
        if (value == null) {
            return null;
        }
        return value.replace(/^\s+|\s+$/g, '');
    };
    Utils.encodeHTMLEntities = function (rawStr) {
        var ret = [];
        for (var i = rawStr.length - 1; i >= 0; i--) {
            if (/^[a-z0-9]/i.test(rawStr[i])) {
                ret.unshift(rawStr[i]);
            }
            else {
                ret.unshift(['&#', rawStr.charCodeAt(i), ';'].join(''));
            }
        }
        return ret.join('');
    };
    Utils.decodeHTMLEntities = function (rawString) {
        return rawString.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    };
    Utils.arrayEqual = function (array1, array2, sameOrder) {
        if (sameOrder === void 0) { sameOrder = true; }
        if (sameOrder) {
            return _.isEqual(array1, array2);
        }
        else {
            var arrays_1 = [array1, array2];
            return _.all(arrays_1, function (array) {
                return array.length == arrays_1[0].length && _.difference(array, arrays_1[0]).length == 0;
            });
        }
    };
    Utils.objectEqual = function (obj1, obj2) {
        return _.isEqual(obj1, obj2);
    };
    Utils.isCoveoField = function (field) {
        return isCoveoFieldRegex.test(field);
    };
    Utils.escapeRegexCharacter = function (str) {
        var ret = str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        return ret;
    };
    Utils.getCaseInsensitiveProperty = function (object, name) {
        // First try using a fast case-sensitive lookup
        var value = object[name];
        // Then try a fast case-sensitive lookup with lowercase name
        if (value == null) {
            var lowerCaseName_1 = name.toLowerCase();
            value = object[lowerCaseName_1];
            // Then try a slow scanning of all the properties
            if (value == null) {
                var matchingKey = _.find(_.keys(object), function (key) { return key.toLowerCase() == lowerCaseName_1; });
                if (matchingKey != null) {
                    value = object[matchingKey];
                }
            }
        }
        return value;
    };
    Utils.getFieldValue = function (result, name) {
        // Be as forgiving as possible about the field name, since we expect
        // user provided values.
        if (name == null) {
            return undefined;
        }
        name = Utils.trim(name);
        if (name[0] == '@') {
            name = name.substr(1);
        }
        if (name == '') {
            return undefined;
        }
        // At this point the name should be well formed
        if (!Utils.isCoveoField('@' + name)) {
            throw "Not a valid field : " + name;
        }
        // Handle namespace field values of the form sf.Foo.Bar
        var parts = name.split('.').reverse();
        var obj = result.raw;
        while (parts.length > 1) {
            obj = Utils.getCaseInsensitiveProperty(obj, parts.pop());
            if (Utils.isUndefined(obj)) {
                return undefined;
            }
        }
        var value = Utils.getCaseInsensitiveProperty(obj, parts[0]);
        // If still nothing, look at the root of the result
        if (value == null) {
            value = Utils.getCaseInsensitiveProperty(result, name);
        }
        return value;
    };
    Utils.throttle = function (func, wait, options, context, args) {
        if (options === void 0) { options = {}; }
        var result;
        var timeout = null;
        var previous = 0;
        var later = function () {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
        };
        return function () {
            var now = new Date().getTime();
            if (!previous && options.leading === false) {
                previous = now;
            }
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
            }
            else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };
    Utils.extendDeep = function (target, src) {
        if (!target) {
            target = {};
        }
        var isArray = _.isArray(src);
        var toReturn = isArray && [] || {};
        if (isArray) {
            target = target || [];
            toReturn = toReturn['concat'](target);
            _.each(src, function (e, i, obj) {
                if (typeof target[i] === 'undefined') {
                    toReturn[i] = e;
                }
                else if (typeof e === 'object') {
                    toReturn[i] = Utils.extendDeep(target[i], e);
                }
                else {
                    if (target.indexOf(e) === -1) {
                        toReturn['push'](e);
                    }
                }
            });
        }
        else {
            if (target && typeof target === 'object') {
                _.each(_.keys(target), function (key) {
                    toReturn[key] = target[key];
                });
            }
            _.each(_.keys(src), function (key) {
                if (typeof src[key] !== 'object' || !src[key]) {
                    toReturn[key] = src[key];
                }
                else {
                    if (!target[key]) {
                        toReturn[key] = src[key];
                    }
                    else {
                        toReturn[key] = Utils.extendDeep(target[key], src[key]);
                    }
                }
            });
        }
        return toReturn;
    };
    Utils.getQueryStringValue = function (key, queryString) {
        if (queryString === void 0) { queryString = window.location.search; }
        return queryString.replace(new RegExp('^(?:.*[&\\?]' + key.replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1');
    };
    Utils.isValidUrl = function (str) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(str);
    };
    Utils.debounce = function (func, wait) {
        var timeout;
        var stackTraceTimeout;
        return function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (timeout == null) {
                timeout = setTimeout(function () {
                    timeout = null;
                }, wait);
                stackTraceTimeout = setTimeout(function () {
                    func.apply(_this, args);
                    stackTraceTimeout = null;
                });
            }
            else if (stackTraceTimeout == null) {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    func.apply(_this, args);
                    timeout = null;
                }, wait);
            }
        };
    };
    Utils.readCookie = function (name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    };
    Utils.toDashCase = function (camelCased) {
        return camelCased.replace(/([a-z][A-Z])/g, function (g) { return g[0] + '-' + g[1].toLowerCase(); });
    };
    Utils.toCamelCase = function (dashCased) {
        return dashCased.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    };
    // Based on http://stackoverflow.com/a/8412989
    Utils.parseXml = function (xml) {
        if (typeof DOMParser != 'undefined') {
            return (new DOMParser()).parseFromString(xml, 'text/xml');
        }
        else if (typeof ActiveXObject != 'undefined' && new ActiveXObject('Microsoft.XMLDOM')) {
            var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = 'false';
            xmlDoc.loadXML(xml);
            return xmlDoc;
        }
        else {
            throw new Error('No XML parser found');
        }
    };
    Utils.copyObject = function (target, src) {
        var _this = this;
        _.each(_.keys(src), function (key) {
            if (typeof src[key] !== 'object' || !src[key]) {
                target[key] = src[key];
            }
            else if (!target[key]) {
                target[key] = src[key];
            }
            else {
                _this.copyObject(target[key], src[key]);
            }
        });
    };
    Utils.copyObjectAttributes = function (target, src, attributes) {
        var _this = this;
        _.each(_.keys(src), function (key) {
            if (_.contains(attributes, key)) {
                if (typeof src[key] !== 'object' || !src[key]) {
                    target[key] = src[key];
                }
                else if (!target[key]) {
                    target[key] = src[key];
                }
                else {
                    _this.copyObject(target[key], src[key]);
                }
            }
        });
    };
    Utils.concatWithoutDuplicate = function (firstArray, secondArray) {
        var diff = _.difference(secondArray, firstArray);
        if (diff && diff.length > 0) {
            firstArray = firstArray.concat(diff);
        }
        return firstArray;
    };
    return Utils;
}());
exports.Utils = Utils;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Ensure that we're not going to get console is undefined error in IE8-9
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore next */
if (!window['console']) {
    console = {
        log: function () {
        },
        debug: function () {
        },
        info: function () {
        },
        warn: function () {
        },
        error: function () {
        },
        assert: function () {
        },
        clear: function () {
        },
        count: function () {
        },
        dir: function () {
        },
        dirxml: function () {
        },
        group: function () {
        },
        groupCollapsed: function () {
        },
        groupEnd: function () {
        },
        msIsIndependentlyComposed: function (element) {
        },
        profile: function () {
        },
        profileEnd: function () {
        },
        select: function () {
        },
        time: function () {
        },
        timeEnd: function () {
        },
        trace: function () {
        }
    };
}
/* istanbul ignore next */
var Logger = (function () {
    function Logger(owner) {
        this.owner = owner;
    }
    Logger.prototype.trace = function () {
        var stuff = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stuff[_i] = arguments[_i];
        }
        if (Logger.level <= Logger.TRACE) {
            this.log('TRACE', stuff);
        }
    };
    Logger.prototype.debug = function () {
        var stuff = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stuff[_i] = arguments[_i];
        }
        if (Logger.level <= Logger.DEBUG) {
            this.log('DEBUG', stuff);
        }
    };
    Logger.prototype.info = function () {
        var stuff = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stuff[_i] = arguments[_i];
        }
        if (Logger.level <= Logger.INFO) {
            this.log('INFO', stuff);
        }
    };
    Logger.prototype.warn = function () {
        var stuff = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stuff[_i] = arguments[_i];
        }
        if (Logger.level <= Logger.WARN) {
            this.log('WARN', stuff);
        }
    };
    Logger.prototype.error = function () {
        var stuff = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stuff[_i] = arguments[_i];
        }
        if (Logger.level <= Logger.ERROR) {
            this.log('ERROR', stuff);
        }
    };
    Logger.prototype.log = function (level, stuff) {
        if (window['console'] && console.log) {
            if (console.error && level == 'ERROR') {
                console.error([level, this.owner].concat(stuff));
            }
            else if (console.info && level == 'INFO') {
                console.info([level, this.owner].concat(stuff));
            }
            else if (console.warn && level == 'WARN') {
                console.warn([level, this.owner].concat(stuff));
            }
            else {
                console.log([level, this.owner].concat(stuff));
            }
            if (Logger.executionTime) {
                console.timeEnd('Execution time');
                console.time('Execution time');
            }
        }
    };
    Logger.enable = function () {
        Logger.level = Logger.TRACE;
    };
    Logger.disable = function () {
        Logger.level = Logger.NOTHING;
    };
    return Logger;
}());
Logger.TRACE = 1;
Logger.DEBUG = 2;
Logger.INFO = 3;
Logger.WARN = 4;
Logger.ERROR = 5;
Logger.NOTHING = 6;
Logger.level = Logger.INFO;
Logger.executionTime = false;
exports.Logger = Logger;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(2);
var JQueryutils_1 = __webpack_require__(5);
var Assert_1 = __webpack_require__(0);
var Logger_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
/**
 * This is essentially an helper class for dom manipulation.<br/>
 * This is intended to provide some basic functionality normally offered by jQuery.<br/>
 * To minimize the multiple jQuery conflict we have while integrating in various system, we implemented the very small subset that the framework needs.<br/>
 * See {@link $$}, which is a function that wraps this class constructor, for less verbose code.
 */
var Dom = (function () {
    /**
     * Create a new Dom object with the given HTMLElement
     * @param el The HTMLElement to wrap in a Dom object
     */
    function Dom(el) {
        Assert_1.Assert.exists(el);
        this.el = el;
    }
    /**
     * Helper function to quickly create an HTMLElement
     * @param type The type of the element (e.g. div, span)
     * @param props The props (id, className, attributes) of the element<br/>
     * Can be either specified in dashed-case strings ('my-attribute') or camelCased keys (myAttribute),
     * the latter of which will automatically get replaced to dash-case.
     * @param innerHTML The contents of the new HTMLElement, either in string form or as another HTMLElement
     */
    Dom.createElement = function (type, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var elem = document.createElement(type);
        for (var key in props) {
            if (key === 'className') {
                elem.className = props['className'];
            }
            else {
                var attr = key.indexOf('-') !== -1 ? key : Utils_1.Utils.toDashCase(key);
                elem.setAttribute(attr, props[key]);
            }
        }
        _.each(children, function (child) {
            if (child instanceof HTMLElement) {
                elem.appendChild(child);
            }
            else if (_.isString(child)) {
                elem.innerHTML += child;
            }
            else if (child instanceof Dom) {
                elem.appendChild(child.el);
            }
        });
        return elem;
    };
    /**
     * Adds the element to the children of the current element
     * @param element The element to append
     * @returns {string}
     */
    Dom.prototype.append = function (element) {
        this.el.appendChild(element);
    };
    /**
     * Get the css value of the specified property.<br/>
     * @param property The property
     * @returns {string}
     */
    Dom.prototype.css = function (property) {
        if (this.el.style[property]) {
            return this.el.style[property];
        }
        return window.getComputedStyle(this.el).getPropertyValue(property);
    };
    /**
     * Get or set the text content of the HTMLElement.<br/>
     * @param txt Optional. If given, this will set the text content of the element. If not, will return the text content.
     * @returns {string}
     */
    Dom.prototype.text = function (txt) {
        if (Utils_1.Utils.isUndefined(txt)) {
            return this.el.innerText || this.el.textContent;
        }
        else {
            if (this.el.innerText != undefined) {
                this.el.innerText = txt;
            }
            else if (this.el.textContent != undefined) {
                this.el.textContent = txt;
            }
        }
    };
    /**
     * Performant way to transform a NodeList to an array of HTMLElement, for manipulation<br/>
     * http://jsperf.com/nodelist-to-array/72
     * @param nodeList a {NodeList} to convert to an array
     * @returns {HTMLElement[]}
     */
    Dom.prototype.nodeListToArray = function (nodeList) {
        var i = nodeList.length;
        var arr = new Array(i);
        while (i--) {
            arr[i] = nodeList.item(i);
        }
        return arr;
    };
    /**
     * Empty (remove all child) from the element;
     */
    Dom.prototype.empty = function () {
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
    };
    /**
     * Empty the element and all childs from the dom;
     */
    Dom.prototype.remove = function () {
        if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    };
    /**
     * Show the element;
     */
    Dom.prototype.show = function () {
        this.el.style.display = 'block';
    };
    /**
     * Hide the element;
     */
    Dom.prototype.hide = function () {
        this.el.style.display = 'none';
    };
    /**
     * Toggle the element visibility.<br/>
     * Optional visible parameter, if specified will set the element visibility
     * @param visible Optional parameter to display or hide the element
     */
    Dom.prototype.toggle = function (visible) {
        if (visible === undefined) {
            if (this.el.style.display == 'block') {
                this.hide();
            }
            else {
                this.show();
            }
        }
        else {
            if (visible) {
                this.show();
            }
            else {
                this.hide();
            }
        }
    };
    /**
     * Returns the value of the specified attribute.
     * @param name The name of the attribute
     */
    Dom.prototype.getAttribute = function (name) {
        return this.el.getAttribute(name);
    };
    /**
     * Sets the value of the specified attribute.
     * @param name The name of the attribute
     * @param value The value to set
     */
    Dom.prototype.setAttribute = function (name, value) {
        this.el.setAttribute(name, value);
    };
    /**
     * Find a child element, given a CSS selector
     * @param selector A CSS selector, can be a .className or #id
     * @returns {HTMLElement}
     */
    Dom.prototype.find = function (selector) {
        return this.el.querySelector(selector);
    };
    /**
     * Check if the element match the selector.<br/>
     * The selector can be a class, an id or a tag.<br/>
     * Eg : .is('.foo') or .is('#foo') or .is('div').
     */
    Dom.prototype.is = function (selector) {
        if (this.el.tagName.toLowerCase() == selector.toLowerCase()) {
            return true;
        }
        if (selector[0] == '.') {
            if (this.hasClass(selector.substr(1))) {
                return true;
            }
        }
        if (selector[0] == '#') {
            if (this.el.getAttribute('id') == selector.substr(1)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Get the first element that matches the classname by testing the element itself and traversing up through its ancestors in the DOM tree.
     *
     * Stops at the body of the document
     * @param className A CSS classname
     */
    Dom.prototype.closest = function (className) {
        return this.traverseAncestorForClass(this.el, className);
    };
    /**
     * Get the first element that matches the classname by testing the element itself and traversing up through its ancestors in the DOM tree.
     *
     * Stops at the body of the document
     * @returns {any}
     */
    Dom.prototype.parent = function (className) {
        if (this.el.parentElement == undefined) {
            return undefined;
        }
        return this.traverseAncestorForClass(this.el.parentElement, className);
    };
    /**
     *  Get all the ancestors of the current element that match the given className
     *
     *  Return an empty array if none found.
     * @param className
     * @returns {HTMLElement[]}
     */
    Dom.prototype.parents = function (className) {
        var parentsFound = [];
        var parentFound = this.parent(className);
        while (parentFound) {
            parentsFound.push(parentFound);
            parentFound = new Dom(parentFound).parent(className);
        }
        return parentsFound;
    };
    /**
     * Return all children
     * @returns {HTMLElement[]}
     */
    Dom.prototype.children = function () {
        return this.nodeListToArray(this.el.children);
    };
    /**
     * Return all siblings
     * @returns {HTMLElement[]}
     */
    Dom.prototype.siblings = function (selector) {
        var sibs = [];
        var currentElement = this.el.parentNode.firstChild;
        for (; currentElement; currentElement = currentElement.nextSibling) {
            if (currentElement != this.el) {
                if (this.matches(currentElement, selector) || !selector) {
                    sibs.push(currentElement);
                }
            }
        }
        return sibs;
    };
    Dom.prototype.matches = function (element, selector) {
        var all = document.querySelectorAll(selector);
        for (var i = 0; i < all.length; i++) {
            if (all[i] === element) {
                return true;
            }
        }
        return false;
    };
    /**
     * Find all children that match the given CSS selector
     * @param selector A CSS selector, can be a .className
     * @returns {HTMLElement[]}
     */
    Dom.prototype.findAll = function (selector) {
        return this.nodeListToArray(this.el.querySelectorAll(selector));
    };
    /**
     * Find the child elements using a className
     * @param className Class of the childs elements to find
     * @returns {HTMLElement[]}
     */
    Dom.prototype.findClass = function (className) {
        if ('getElementsByClassName' in this.el) {
            return this.nodeListToArray(this.el.getElementsByClassName(className));
        }
        // For ie 8
        return this.nodeListToArray(this.el.querySelectorAll('.' + className));
    };
    /**
     * Find an element using an ID
     * @param id ID of the element to find
     * @returns {HTMLElement}
     */
    Dom.prototype.findId = function (id) {
        return document.getElementById(id);
    };
    Dom.prototype.addClass = function (className) {
        var _this = this;
        if (_.isArray(className)) {
            _.each(className, function (name) {
                _this.addClass(name);
            });
        }
        else {
            if (!this.hasClass(className)) {
                if (this.el.className) {
                    this.el.className += ' ' + className;
                }
                else {
                    this.el.className = className;
                }
            }
        }
    };
    /**
     * Remove the class on the element. Works even if the element does not possess the class.
     * @param className Classname to remove on the the element
     */
    Dom.prototype.removeClass = function (className) {
        this.el.className = this.el.className.replace(new RegExp("(^|\\s)" + className + "(\\s|\\b)", 'g'), '$1').trim();
    };
    /**
     * Toggle the class on the element.
     * @param className Classname to toggle
     * @swtch If true, add the class regardless and if false, remove the class
     */
    Dom.prototype.toggleClass = function (className, swtch) {
        if (Utils_1.Utils.isNullOrUndefined(swtch)) {
            if (this.hasClass(className)) {
                this.removeClass(className);
            }
            else {
                this.addClass(className);
            }
        }
        else {
            if (swtch) {
                this.addClass(className);
            }
            else {
                this.removeClass(className);
            }
        }
    };
    /**
     * Sets the inner html of the element
     * @param html The html to set
     */
    Dom.prototype.setHtml = function (html) {
        this.el.innerHTML = html;
    };
    /**
     * Return an array with all the classname on the element. Empty array if the element has not classname
     * @returns {any|Array}
     */
    Dom.prototype.getClass = function () {
        return this.el.className.match(Dom.CLASS_NAME_REGEX) || [];
    };
    /**
     * Check if the element has the given class name
     * @param className Classname to verify
     * @returns {boolean}
     */
    Dom.prototype.hasClass = function (className) {
        return _.contains(this.getClass(), className);
    };
    /**
     * Detach the element from the DOM.
     */
    Dom.prototype.detach = function () {
        this.el.parentElement && this.el.parentElement.removeChild(this.el);
    };
    /**
     * Insert the current node after the given reference node
     * @param refNode
     */
    Dom.prototype.insertAfter = function (refNode) {
        refNode.parentNode && refNode.parentNode.insertBefore(this.el, refNode.nextSibling);
    };
    /**
     * Insert the current node before the given reference node
     * @param refNode
     */
    Dom.prototype.insertBefore = function (refNode) {
        refNode.parentNode && refNode.parentNode.insertBefore(this.el, refNode);
    };
    /**
     * Insert the given node as the first child of the current node
     * @param toPrepend
     */
    Dom.prototype.prepend = function (toPrepend) {
        if (this.el.firstChild) {
            new Dom(toPrepend).insertBefore(this.el.firstChild);
        }
        else {
            this.el.appendChild(toPrepend);
        }
    };
    Dom.prototype.on = function (type, eventHandle) {
        var _this = this;
        if (_.isArray(type)) {
            _.each(type, function (t) {
                _this.on(t, eventHandle);
            });
        }
        else {
            var jq = JQueryutils_1.JQueryUtils.getJQuery();
            if (jq) {
                jq(this.el).on(type, eventHandle);
            }
            else if (this.el.addEventListener) {
                var fn = function (e) {
                    eventHandle(e, e.detail);
                };
                Dom.handlers.push({
                    eventHandle: eventHandle,
                    fn: fn
                });
                this.el.addEventListener(type, fn, false);
            }
            else if (this.el['on']) {
                this.el['on']('on' + type, eventHandle);
            }
        }
    };
    Dom.prototype.one = function (type, eventHandle) {
        var _this = this;
        if (_.isArray(type)) {
            _.each(type, function (t) {
                _this.one(t, eventHandle);
            });
        }
        else {
            var once_1 = function (e, args) {
                _this.off(type, once_1);
                return eventHandle(e, args);
            };
            this.on(type, once_1);
        }
    };
    Dom.prototype.off = function (type, eventHandle) {
        var _this = this;
        if (_.isArray(type)) {
            _.each(type, function (t) {
                _this.off(t, eventHandle);
            });
        }
        else {
            var jq = JQueryutils_1.JQueryUtils.getJQuery();
            if (jq) {
                jq(this.el).off(type, eventHandle);
            }
            else if (this.el.removeEventListener) {
                var idx_1 = 0;
                var found = _.find(Dom.handlers, function (handlerObj, i) {
                    if (handlerObj.eventHandle == eventHandle) {
                        idx_1 = i;
                        return true;
                    }
                });
                if (found) {
                    this.el.removeEventListener(type, found.fn, false);
                    Dom.handlers.splice(idx_1, 1);
                }
            }
            else if (this.el['off']) {
                this.el['off']('on' + type, eventHandle);
            }
        }
    };
    /**
     * Trigger an event on the element.
     * @param type The event type to trigger
     * @param data
     */
    Dom.prototype.trigger = function (type, data) {
        var jq = JQueryutils_1.JQueryUtils.getJQuery();
        if (jq) {
            jq(this.el).trigger(type, data);
        }
        else if (CustomEvent !== undefined) {
            var event_1 = new CustomEvent(type, { detail: data, bubbles: true });
            this.el.dispatchEvent(event_1);
        }
        else {
            new Logger_1.Logger(this).error('CANNOT TRIGGER EVENT FOR OLDER BROWSER');
        }
    };
    /**
     * Check if the element is "empty" (has no innerHTML content). Whitespace is considered empty</br>
     * @returns {boolean}
     */
    Dom.prototype.isEmpty = function () {
        return Dom.ONLY_WHITE_SPACE_REGEX.test(this.el.innerHTML);
    };
    /**
     * Check if the element is a descendant of parent
     * @param other
     */
    Dom.prototype.isDescendant = function (parent) {
        var node = this.el.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    /**
     * Replace the current element with the other element, then detach the current element
     * @param otherElem
     */
    Dom.prototype.replaceWith = function (otherElem) {
        var parent = this.el.parentNode;
        if (parent) {
            new Dom(otherElem).insertAfter(this.el);
        }
        this.detach();
    };
    // based on http://api.jquery.com/position/
    /**
     * Return the position relative to the offset parent.
     */
    Dom.prototype.position = function () {
        var offsetParent = this.offsetParent();
        var offset = this.offset();
        var parentOffset = { top: 0, left: 0 };
        if (!$$(offsetParent).is('html')) {
            parentOffset = $$(offsetParent).offset();
        }
        var borderTopWidth = parseInt($$(offsetParent).css('borderTopWidth'));
        var borderLeftWidth = parseInt($$(offsetParent).css('borderLeftWidth'));
        borderTopWidth = isNaN(borderTopWidth) ? 0 : borderTopWidth;
        borderLeftWidth = isNaN(borderLeftWidth) ? 0 : borderLeftWidth;
        parentOffset = {
            top: parentOffset.top + borderTopWidth,
            left: parentOffset.left + borderLeftWidth
        };
        var marginTop = parseInt(this.css('marginTop'));
        var marginLeft = parseInt(this.css('marginLeft'));
        marginTop = isNaN(marginTop) ? 0 : marginTop;
        marginLeft = isNaN(marginLeft) ? 0 : marginLeft;
        return {
            top: offset.top - parentOffset.top - marginTop,
            left: offset.left - parentOffset.left - marginLeft
        };
    };
    // based on https://api.jquery.com/offsetParent/
    /**
     * Returns the offset parent. The offset parent is the closest parent that is positioned.
     * An element is positioned when its position property is not 'static', which is the default.
     */
    Dom.prototype.offsetParent = function () {
        var offsetParent = this.el.offsetParent;
        while (offsetParent instanceof HTMLElement && $$(offsetParent).css('position') === 'static') {
            // Will break out if it stumbles upon an non-HTMLElement and return documentElement
            offsetParent = offsetParent.offsetParent;
        }
        if (!(offsetParent instanceof HTMLElement)) {
            return document.documentElement;
        }
        return offsetParent;
    };
    // based on http://api.jquery.com/offset/
    /**
     * Return the position relative to the document.
     */
    Dom.prototype.offset = function () {
        // In <=IE11, calling getBoundingClientRect on a disconnected node throws an error
        if (!this.el.getClientRects().length) {
            return { top: 0, left: 0 };
        }
        var rect = this.el.getBoundingClientRect();
        if (rect.width || rect.height) {
            var doc = this.el.ownerDocument;
            var docElem = doc.documentElement;
            return {
                top: rect.top + window.pageYOffset - docElem.clientTop,
                left: rect.left + window.pageXOffset - docElem.clientLeft
            };
        }
        return rect;
    };
    /**
     * Returns the offset width of the element
     */
    Dom.prototype.width = function () {
        return this.el.offsetWidth;
    };
    /**
     * Returns the offset height of the element
     */
    Dom.prototype.height = function () {
        return this.el.offsetHeight;
    };
    /**
     * Clone the node
     * @param deep true if the children of the node should also be cloned, or false to clone only the specified node.
     * @returns {Dom}
     */
    Dom.prototype.clone = function (deep) {
        if (deep === void 0) { deep = false; }
        return $$(this.el.cloneNode(deep));
    };
    Dom.prototype.traverseAncestorForClass = function (current, className) {
        if (current === void 0) { current = this.el; }
        if (className.indexOf('.') == 0) {
            className = className.substr(1);
        }
        var found = false;
        while (!found) {
            if ($$(current).hasClass(className)) {
                found = true;
            }
            if (current.tagName.toLowerCase() == 'body') {
                break;
            }
            if (current.parentElement == null) {
                break;
            }
            if (!found) {
                current = current.parentElement;
            }
        }
        if (found) {
            return current;
        }
        return undefined;
    };
    return Dom;
}());
Dom.CLASS_NAME_REGEX = /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;
Dom.ONLY_WHITE_SPACE_REGEX = /^\s*$/;
Dom.handlers = [];
exports.Dom = Dom;
var Win = (function () {
    function Win(win) {
        this.win = win;
    }
    Win.prototype.height = function () {
        return this.win.innerHeight;
    };
    Win.prototype.width = function () {
        return this.win.innerWidth;
    };
    Win.prototype.scrollY = function () {
        return this.supportPageOffset() ? this.win.pageYOffset : this.isCSS1Compat() ? this.win.document.documentElement.scrollTop : this.win.document.body.scrollTop;
    };
    Win.prototype.scrollX = function () {
        return this.supportPageOffset() ? window.pageXOffset : this.isCSS1Compat() ? document.documentElement.scrollLeft : document.body.scrollLeft;
    };
    Win.prototype.isCSS1Compat = function () {
        return (this.win.document.compatMode || '') === 'CSS1Compat';
    };
    Win.prototype.supportPageOffset = function () {
        return this.win.pageXOffset !== undefined;
    };
    return Win;
}());
exports.Win = Win;
var Doc = (function () {
    function Doc(doc) {
        this.doc = doc;
    }
    Doc.prototype.height = function () {
        var body = this.doc.body;
        return Math.max(body.scrollHeight, body.offsetHeight);
    };
    Doc.prototype.width = function () {
        var body = this.doc.body;
        return Math.max(body.scrollWidth, body.offsetWidth);
    };
    return Doc;
}());
exports.Doc = Doc;
function $$() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 1 && args[0] instanceof Dom) {
        return args[0];
    }
    else if (args.length === 1 && (!_.isString(args[0]))) {
        return new Dom(args[0]);
    }
    else {
        return new Dom(Dom.createElement.apply(Dom, args));
    }
}
exports.$$ = $$;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JQueryUtils = (function () {
    function JQueryUtils() {
    }
    JQueryUtils.getJQuery = function () {
        if (window && window['Coveo'] && window['Coveo']['$']) {
            return window['Coveo']['$'];
        }
        return false;
    };
    JQueryUtils.isInstanceOfJQuery = function (obj) {
        var jq = this.getJQuery();
        if (jq) {
            return obj instanceof jq;
        }
        return false;
    };
    JQueryUtils.isInstanceOfJqueryEvent = function (obj) {
        var jq = this.getJQuery();
        if (jq) {
            return obj instanceof jq.Event;
        }
        return false;
    };
    return JQueryUtils;
}());
exports.JQueryUtils = JQueryUtils;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Playground_1 = __webpack_require__(10);
document.addEventListener('DOMContentLoaded', function () {
    new Playground_1.Playground(document.body);
});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*! globalize - v0.1.1 - 2013-04-30
* https://github.com/jquery/globalize
* Copyright 2013 ; Licensed MIT */
var Globalize = (function(e,r){var t,n,a,s,u,l,i,c,o,f,d,p,h,g,b,m,y,M,v,k,z,F,A,x;t=function(e){return new t.prototype.init(e)}, true?module.exports=t:e.Globalize=t,t.cultures={},t.prototype={constructor:t,init:function(e){return this.cultures=t.cultures,this.cultureSelector=e,this}},t.prototype.init.prototype=t.prototype,t.cultures["default"]={name:"en",englishName:"English",nativeName:"English",isRTL:!1,language:"en",numberFormat:{pattern:["-n"],decimals:2,",":",",".":".",groupSizes:[3],"+":"+","-":"-",NaN:"NaN",negativeInfinity:"-Infinity",positiveInfinity:"Infinity",percent:{pattern:["-n %","n %"],decimals:2,groupSizes:[3],",":",",".":".",symbol:"%"},currency:{pattern:["($n)","$n"],decimals:2,groupSizes:[3],",":",",".":".",symbol:"$"}},calendars:{standard:{name:"Gregorian_USEnglish","/":"/",":":":",firstDay:0,days:{names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],namesAbbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],namesShort:["Su","Mo","Tu","We","Th","Fr","Sa"]},months:{names:["January","February","March","April","May","June","July","August","September","October","November","December",""],namesAbbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""]},AM:["AM","am","AM"],PM:["PM","pm","PM"],eras:[{name:"A.D.",start:null,offset:0}],twoDigitYearMax:2029,patterns:{d:"M/d/yyyy",D:"dddd, MMMM dd, yyyy",t:"h:mm tt",T:"h:mm:ss tt",f:"dddd, MMMM dd, yyyy h:mm tt",F:"dddd, MMMM dd, yyyy h:mm:ss tt",M:"MMMM dd",Y:"yyyy MMMM",S:"yyyy'-'MM'-'dd'T'HH':'mm':'ss"}}},messages:{}},t.cultures["default"].calendar=t.cultures["default"].calendars.standard,t.cultures.en=t.cultures["default"],t.cultureSelector="en",n=/^0x[a-f0-9]+$/i,a=/^[+\-]?infinity$/i,s=/^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/,u=/^\s+|\s+$/g,l=function(e,r){if(e.indexOf)return e.indexOf(r);for(var t=0,n=e.length;n>t;t++)if(e[t]===r)return t;return-1},i=function(e,r){return e.substr(e.length-r.length)===r},c=function(){var e,t,n,a,s,u,l=arguments[0]||{},i=1,p=arguments.length,h=!1;for("boolean"==typeof l&&(h=l,l=arguments[1]||{},i=2),"object"==typeof l||f(l)||(l={});p>i;i++)if(null!=(e=arguments[i]))for(t in e)n=l[t],a=e[t],l!==a&&(h&&a&&(d(a)||(s=o(a)))?(s?(s=!1,u=n&&o(n)?n:[]):u=n&&d(n)?n:{},l[t]=c(h,u,a)):a!==r&&(l[t]=a));return l},o=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},f=function(e){return"[object Function]"===Object.prototype.toString.call(e)},d=function(e){return"[object Object]"===Object.prototype.toString.call(e)},p=function(e,r){return 0===e.indexOf(r)},h=function(e){return(e+"").replace(u,"")},g=function(e){return isNaN(e)?0/0:Math[0>e?"ceil":"floor"](e)},b=function(e,r,t){var n;for(n=e.length;r>n;n+=1)e=t?"0"+e:e+"0";return e},m=function(e,r){for(var t=0,n=!1,a=0,s=e.length;s>a;a++){var u=e.charAt(a);switch(u){case"'":n?r.push("'"):t++,n=!1;break;case"\\":n&&r.push("\\"),n=!n;break;default:r.push(u),n=!1}}return t},y=function(e,r){r=r||"F";var t,n=e.patterns,a=r.length;if(1===a){if(t=n[r],!t)throw"Invalid date format string '"+r+"'.";r=t}else 2===a&&"%"===r.charAt(0)&&(r=r.charAt(1));return r},M=function(e,r,t){function n(e,r){var t,n=e+"";return r>1&&r>n.length?(t=v[r-2]+n,t.substr(t.length-r,r)):t=n}function a(){return h||g?h:(h=A.test(r),g=!0,h)}function s(e,r){if(b)return b[r];switch(r){case 0:return e.getFullYear();case 1:return e.getMonth();case 2:return e.getDate();default:throw"Invalid part value "+r}}var u,l=t.calendar,i=l.convert;if(!r||!r.length||"i"===r){if(t&&t.name.length)if(i)u=M(e,l.patterns.F,t);else{var c=new Date(e.getTime()),o=z(e,l.eras);c.setFullYear(F(e,l,o)),u=c.toLocaleString()}else u=""+e;return u}var f=l.eras,d="s"===r;r=y(l,r),u=[];var p,h,g,b,v=["0","00","000"],A=/([^d]|^)(d|dd)([^d]|$)/g,x=0,I=k();for(!d&&i&&(b=i.fromGregorian(e));;){var S=I.lastIndex,w=I.exec(r),C=r.slice(S,w?w.index:r.length);if(x+=m(C,u),!w)break;if(x%2)u.push(w[0]);else{var D=w[0],H=D.length;switch(D){case"ddd":case"dddd":var O=3===H?l.days.namesAbbr:l.days.names;u.push(O[e.getDay()]);break;case"d":case"dd":h=!0,u.push(n(s(e,2),H));break;case"MMM":case"MMMM":var N=s(e,1);u.push(l.monthsGenitive&&a()?l.monthsGenitive[3===H?"namesAbbr":"names"][N]:l.months[3===H?"namesAbbr":"names"][N]);break;case"M":case"MM":u.push(n(s(e,1)+1,H));break;case"y":case"yy":case"yyyy":N=b?b[0]:F(e,l,z(e,f),d),4>H&&(N%=100),u.push(n(N,H));break;case"h":case"hh":p=e.getHours()%12,0===p&&(p=12),u.push(n(p,H));break;case"H":case"HH":u.push(n(e.getHours(),H));break;case"m":case"mm":u.push(n(e.getMinutes(),H));break;case"s":case"ss":u.push(n(e.getSeconds(),H));break;case"t":case"tt":N=12>e.getHours()?l.AM?l.AM[0]:" ":l.PM?l.PM[0]:" ",u.push(1===H?N.charAt(0):N);break;case"f":case"ff":case"fff":u.push(n(e.getMilliseconds(),3).substr(0,H));break;case"z":case"zz":p=e.getTimezoneOffset()/60,u.push((0>=p?"+":"-")+n(Math.floor(Math.abs(p)),H));break;case"zzz":p=e.getTimezoneOffset()/60,u.push((0>=p?"+":"-")+n(Math.floor(Math.abs(p)),2)+":"+n(Math.abs(e.getTimezoneOffset()%60),2));break;case"g":case"gg":l.eras&&u.push(l.eras[z(e,f)].name);break;case"/":u.push(l["/"]);break;default:throw"Invalid date format pattern '"+D+"'."}}}return u.join("")},function(){var e;e=function(e,r,t){var n=t.groupSizes,a=n[0],s=1,u=Math.pow(10,r),l=Math.round(e*u)/u;isFinite(l)||(l=e),e=l;var i=e+"",c="",o=i.split(/e/i),f=o.length>1?parseInt(o[1],10):0;i=o[0],o=i.split("."),i=o[0],c=o.length>1?o[1]:"",f>0?(c=b(c,f,!1),i+=c.slice(0,f),c=c.substr(f)):0>f&&(f=-f,i=b(i,f+1,!0),c=i.slice(-f,i.length)+c,i=i.slice(0,-f)),c=r>0?t["."]+(c.length>r?c.slice(0,r):b(c,r)):"";for(var d=i.length-1,p=t[","],h="";d>=0;){if(0===a||a>d)return i.slice(0,d+1)+(h.length?p+h+c:c);h=i.slice(d-a+1,d+1)+(h.length?p+h:""),d-=a,n.length>s&&(a=n[s],s++)}return i.slice(0,d+1)+p+h+c},v=function(r,t,n){if(!isFinite(r))return 1/0===r?n.numberFormat.positiveInfinity:r===-1/0?n.numberFormat.negativeInfinity:n.numberFormat.NaN;if(!t||"i"===t)return n.name.length?r.toLocaleString():""+r;t=t||"D";var a,s=n.numberFormat,u=Math.abs(r),l=-1;t.length>1&&(l=parseInt(t.slice(1),10));var i,c=t.charAt(0).toUpperCase();switch(c){case"D":a="n",u=g(u),-1!==l&&(u=b(""+u,l,!0)),0>r&&(u="-"+u);break;case"N":i=s;case"C":i=i||s.currency;case"P":i=i||s.percent,a=0>r?i.pattern[0]:i.pattern[1]||"n",-1===l&&(l=i.decimals),u=e(u*("P"===c?100:1),l,i);break;default:throw"Bad number format specifier: "+c}for(var o=/n|\$|-|%/g,f="";;){var d=o.lastIndex,p=o.exec(a);if(f+=a.slice(d,p?p.index:a.length),!p)break;switch(p[0]){case"n":f+=u;break;case"$":f+=s.currency.symbol;break;case"-":/[1-9]/.test(u)&&(f+=s["-"]);break;case"%":f+=s.percent.symbol}}return f}}(),k=function(){return/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g},z=function(e,r){if(!r)return 0;for(var t,n=e.getTime(),a=0,s=r.length;s>a;a++)if(t=r[a].start,null===t||n>=t)return a;return 0},F=function(e,r,t,n){var a=e.getFullYear();return!n&&r.eras&&(a-=r.eras[t].offset),a},function(){var e,r,t,n,a,s,u;e=function(e,r){if(100>r){var t=new Date,n=z(t),a=F(t,e,n),s=e.twoDigitYearMax;s="string"==typeof s?(new Date).getFullYear()%100+parseInt(s,10):s,r+=a-a%100,r>s&&(r-=100)}return r},r=function(e,r,t){var n,a=e.days,i=e._upperDays;return i||(e._upperDays=i=[u(a.names),u(a.namesAbbr),u(a.namesShort)]),r=s(r),t?(n=l(i[1],r),-1===n&&(n=l(i[2],r))):n=l(i[0],r),n},t=function(e,r,t){var n=e.months,a=e.monthsGenitive||e.months,i=e._upperMonths,c=e._upperMonthsGen;i||(e._upperMonths=i=[u(n.names),u(n.namesAbbr)],e._upperMonthsGen=c=[u(a.names),u(a.namesAbbr)]),r=s(r);var o=l(t?i[1]:i[0],r);return 0>o&&(o=l(t?c[1]:c[0],r)),o},n=function(e,r){var t=e._parseRegExp;if(t){var n=t[r];if(n)return n}else e._parseRegExp=t={};for(var a,s=y(e,r).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g,"\\\\$1"),u=["^"],l=[],i=0,c=0,o=k();null!==(a=o.exec(s));){var f=s.slice(i,a.index);if(i=o.lastIndex,c+=m(f,u),c%2)u.push(a[0]);else{var d,p=a[0],h=p.length;switch(p){case"dddd":case"ddd":case"MMMM":case"MMM":case"gg":case"g":d="(\\D+)";break;case"tt":case"t":d="(\\D*)";break;case"yyyy":case"fff":case"ff":case"f":d="(\\d{"+h+"})";break;case"dd":case"d":case"MM":case"M":case"yy":case"y":case"HH":case"H":case"hh":case"h":case"mm":case"m":case"ss":case"s":d="(\\d\\d?)";break;case"zzz":d="([+-]?\\d\\d?:\\d{2})";break;case"zz":case"z":d="([+-]?\\d\\d?)";break;case"/":d="(\\/)";break;default:throw"Invalid date format pattern '"+p+"'."}d&&u.push(d),l.push(a[0])}}m(s.slice(i),u),u.push("$");var g=u.join("").replace(/\s+/g,"\\s+"),b={regExp:g,groups:l};return t[r]=b},a=function(e,r,t){return r>e||e>t},s=function(e){return e.split("\u00a0").join(" ").toUpperCase()},u=function(e){for(var r=[],t=0,n=e.length;n>t;t++)r[t]=s(e[t]);return r},A=function(s,u,l){s=h(s);var i=l.calendar,c=n(i,u),o=RegExp(c.regExp).exec(s);if(null===o)return null;for(var f,d=c.groups,g=null,b=null,m=null,y=null,M=null,v=0,k=0,z=0,F=0,A=null,x=!1,I=0,S=d.length;S>I;I++){var w=o[I+1];if(w){var C=d[I],D=C.length,H=parseInt(w,10);switch(C){case"dd":case"d":if(y=H,a(y,1,31))return null;break;case"MMM":case"MMMM":if(m=t(i,w,3===D),a(m,0,11))return null;break;case"M":case"MM":if(m=H-1,a(m,0,11))return null;break;case"y":case"yy":case"yyyy":if(b=4>D?e(i,H):H,a(b,0,9999))return null;break;case"h":case"hh":if(v=H,12===v&&(v=0),a(v,0,11))return null;break;case"H":case"HH":if(v=H,a(v,0,23))return null;break;case"m":case"mm":if(k=H,a(k,0,59))return null;break;case"s":case"ss":if(z=H,a(z,0,59))return null;break;case"tt":case"t":if(x=i.PM&&(w===i.PM[0]||w===i.PM[1]||w===i.PM[2]),!x&&(!i.AM||w!==i.AM[0]&&w!==i.AM[1]&&w!==i.AM[2]))return null;break;case"f":case"ff":case"fff":if(F=H*Math.pow(10,3-D),a(F,0,999))return null;break;case"ddd":case"dddd":if(M=r(i,w,3===D),a(M,0,6))return null;break;case"zzz":var O=w.split(/:/);if(2!==O.length)return null;if(f=parseInt(O[0],10),a(f,-12,13))return null;var N=parseInt(O[1],10);if(a(N,0,59))return null;A=60*f+(p(w,"-")?-N:N);break;case"z":case"zz":if(f=H,a(f,-12,13))return null;A=60*f;break;case"g":case"gg":var T=w;if(!T||!i.eras)return null;T=h(T.toLowerCase());for(var j=0,$=i.eras.length;$>j;j++)if(T===i.eras[j].name.toLowerCase()){g=j;break}if(null===g)return null}}}var P,G=new Date,E=i.convert;if(P=E?E.fromGregorian(G)[0]:G.getFullYear(),null===b?b=P:i.eras&&(b+=i.eras[g||0].offset),null===m&&(m=0),null===y&&(y=1),E){if(G=E.toGregorian(b,m,y),null===G)return null}else{if(G.setFullYear(b,m,y),G.getDate()!==y)return null;if(null!==M&&G.getDay()!==M)return null}if(x&&12>v&&(v+=12),G.setHours(v,k,z,F),null!==A){var Y=G.getMinutes()-(A+G.getTimezoneOffset());G.setHours(G.getHours()+parseInt(Y/60,10),Y%60)}return G}}(),x=function(e,r,t){var n,a=r["-"],s=r["+"];switch(t){case"n -":a=" "+a,s=" "+s;case"n-":i(e,a)?n=["-",e.substr(0,e.length-a.length)]:i(e,s)&&(n=["+",e.substr(0,e.length-s.length)]);break;case"- n":a+=" ",s+=" ";case"-n":p(e,a)?n=["-",e.substr(a.length)]:p(e,s)&&(n=["+",e.substr(s.length)]);break;case"(n)":p(e,"(")&&i(e,")")&&(n=["-",e.substr(1,e.length-2)])}return n||["",e]},t.prototype.findClosestCulture=function(e){return t.findClosestCulture.call(this,e)},t.prototype.format=function(e,r,n){return t.format.call(this,e,r,n)},t.prototype.localize=function(e,r){return t.localize.call(this,e,r)},t.prototype.parseInt=function(e,r,n){return t.parseInt.call(this,e,r,n)},t.prototype.parseFloat=function(e,r,n){return t.parseFloat.call(this,e,r,n)},t.prototype.culture=function(e){return t.culture.call(this,e)},t.addCultureInfo=function(e,r,t){var n={},a=!1;"string"!=typeof e?(t=e,e=this.culture().name,n=this.cultures[e]):"string"!=typeof r?(t=r,a=null==this.cultures[e],n=this.cultures[e]||this.cultures["default"]):(a=!0,n=this.cultures[r]),this.cultures[e]=c(!0,{},n,t),a&&(this.cultures[e].calendar=this.cultures[e].calendars.standard)},t.findClosestCulture=function(e){var r;if(!e)return this.findClosestCulture(this.cultureSelector)||this.cultures["default"];if("string"==typeof e&&(e=e.split(",")),o(e)){var t,n,a=this.cultures,s=e,u=s.length,l=[];for(n=0;u>n;n++){e=h(s[n]);var i,c=e.split(";");t=h(c[0]),1===c.length?i=1:(e=h(c[1]),0===e.indexOf("q=")?(e=e.substr(2),i=parseFloat(e),i=isNaN(i)?0:i):i=1),l.push({lang:t,pri:i})}for(l.sort(function(e,r){return e.pri<r.pri?1:e.pri>r.pri?-1:0}),n=0;u>n;n++)if(t=l[n].lang,r=a[t])return r;for(n=0;u>n;n++)for(t=l[n].lang;;){var f=t.lastIndexOf("-");if(-1===f)break;if(t=t.substr(0,f),r=a[t])return r}for(n=0;u>n;n++){t=l[n].lang;for(var d in a){var p=a[d];if(p.language===t)return p}}}else if("object"==typeof e)return e;return r||null},t.format=function(e,r,t){var n=this.findClosestCulture(t);return e instanceof Date?e=M(e,r,n):"number"==typeof e&&(e=v(e,r,n)),e},t.localize=function(e,r){return this.findClosestCulture(r).messages[e]||this.cultures["default"].messages[e]},t.parseDate=function(e,r,t){t=this.findClosestCulture(t);var n,a,s;if(r){if("string"==typeof r&&(r=[r]),r.length)for(var u=0,l=r.length;l>u;u++){var i=r[u];if(i&&(n=A(e,i,t)))break}}else{s=t.calendar.patterns;for(a in s)if(n=A(e,s[a],t))break}return n||null},t.parseInt=function(e,r,n){return g(t.parseFloat(e,r,n))},t.parseFloat=function(e,r,t){"number"!=typeof r&&(t=r,r=10);var u=this.findClosestCulture(t),l=0/0,i=u.numberFormat;if(e.indexOf(u.numberFormat.currency.symbol)>-1&&(e=e.replace(u.numberFormat.currency.symbol,""),e=e.replace(u.numberFormat.currency["."],u.numberFormat["."])),e.indexOf(u.numberFormat.percent.symbol)>-1&&(e=e.replace(u.numberFormat.percent.symbol,"")),e=e.replace(/ /g,""),a.test(e))l=parseFloat(e);else if(!r&&n.test(e))l=parseInt(e,16);else{var c=x(e,i,i.pattern[0]),o=c[0],f=c[1];""===o&&"(n)"!==i.pattern[0]&&(c=x(e,i,"(n)"),o=c[0],f=c[1]),""===o&&"-n"!==i.pattern[0]&&(c=x(e,i,"-n"),o=c[0],f=c[1]),o=o||"+";var d,p,h=f.indexOf("e");0>h&&(h=f.indexOf("E")),0>h?(p=f,d=null):(p=f.substr(0,h),d=f.substr(h+1));var g,b,m=i["."],y=p.indexOf(m);0>y?(g=p,b=null):(g=p.substr(0,y),b=p.substr(y+m.length));var M=i[","];g=g.split(M).join("");var v=M.replace(/\u00A0/g," ");M!==v&&(g=g.split(v).join(""));var k=o+g;if(null!==b&&(k+="."+b),null!==d){var z=x(d,i,"-n");k+="e"+(z[0]||"+")+z[1]}s.test(k)&&(l=parseFloat(k))}return l},t.culture=function(e){return e!==r&&(this.cultureSelector=e),this.findClosestCulture(e)||this.cultures["default"]}; return Globalize;}(this));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Globalize"] = __webpack_require__(7);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(4);
var SearchEndpoint_1 = __webpack_require__(19);
var PlaygroundConfiguration_1 = __webpack_require__(11);
var QueryEvents_1 = __webpack_require__(12);
var DefaultLanguage_1 = __webpack_require__(20);
DefaultLanguage_1.setLanguageAfterPageLoaded();
var Playground = (function () {
    function Playground(body) {
        this.body = body;
        this.initialized = false;
        var previewContainer = Dom_1.$$(document.body).find('.preview-container');
        if (this.isComponentPage() && this.shouldInitialize()) {
            this.initializePreview();
        }
        else {
            previewContainer.remove();
        }
    }
    Playground.prototype.getTitle = function () {
        return Dom_1.$$(this.body).find('.tsd-page-title h1');
    };
    Playground.prototype.getConfiguration = function () {
        return PlaygroundConfiguration_1.PlaygroundConfiguration[this.getComponentName()];
    };
    Playground.prototype.shouldInitialize = function () {
        var name = this.getComponentName();
        var configuration = this.getConfiguration();
        return name && configuration && configuration.show;
    };
    Playground.prototype.isComponentPage = function () {
        return Dom_1.$$(this.getTitle()).text().toLowerCase().indexOf('coveo component') != -1;
    };
    Playground.prototype.getComponentName = function () {
        var match = Dom_1.$$(this.getTitle()).text().match(/([a-zA-Z]+)$/);
        if (match) {
            return match[1];
        }
        return null;
    };
    Playground.prototype.hide = function () {
        this.showButton.show();
        this.hideButton.hide();
        $(this.componentContainer.el).slideUp();
    };
    Playground.prototype.show = function () {
        var _this = this;
        this.showButton.hide();
        this.hideButton.show();
        $(this.componentContainer.el).slideDown(undefined, function () {
            if (!_this.initialized) {
                _this.initializeComponent();
            }
        });
    };
    Playground.prototype.initializeComponent = function () {
        var configuration = this.getConfiguration();
        SearchEndpoint_1.SearchEndpoint.configureSampleEndpointV2();
        var searchInterface = this.getSearchInterface();
        this.componentContainer.append(searchInterface.el);
        Coveo.SearchEndpoint.endpoints['default'] = SearchEndpoint_1.SearchEndpoint.endpoints['default'];
        var initOptions = this.getInitConfig();
        Coveo.init(searchInterface.el, initOptions);
        this.initialized = true;
        if (this.getConfiguration().toExecute) {
            this.getConfiguration().toExecute();
        }
        this.triggerQuery(configuration, searchInterface.el);
    };
    Playground.prototype.getInitConfig = function () {
        var initOptions = {};
        var configuration = this.getConfiguration();
        initOptions[this.getComponentName()] = configuration.options;
        initOptions['SearchInterface'] = PlaygroundConfiguration_1.PlaygroundConfiguration['SearchInterface'].options;
        if (configuration.isResultComponent) {
            initOptions['SearchInterface'].resultsPerPage = 1;
        }
        return initOptions;
    };
    Playground.prototype.getSearchInterface = function () {
        var searchInterface = Dom_1.$$('div', {
            className: 'CoveoSearchInterface',
            'data-design': 'new'
        });
        var configuration = this.getConfiguration();
        if (configuration.isResultComponent) {
            this.insertElementIntoResultList(searchInterface);
        }
        else {
            this.insertElementIntoSearchInterface(searchInterface);
        }
        return searchInterface;
    };
    Playground.prototype.initializePreview = function () {
        var _this = this;
        var previewContainer = Dom_1.$$(document.body).find('.preview-container');
        this.showButton = Dom_1.$$('button', { className: 'preview-toggle' }, "Show a live example of " + this.getComponentName());
        this.hideButton = Dom_1.$$('button', { className: 'preview-toggle' }, 'Hide example');
        this.componentContainer = Dom_1.$$('div', { className: 'component-container' });
        this.componentContainer.hide();
        this.hideButton.hide();
        this.showButton.on('click', function () {
            _this.show();
        });
        this.hideButton.on('click', function () {
            _this.hide();
        });
        previewContainer.appendChild(this.showButton.el);
        previewContainer.appendChild(this.hideButton.el);
        previewContainer.appendChild(this.componentContainer.el);
    };
    Playground.prototype.insertElementIntoResultList = function (searchInterface) {
        var resultListElement = Dom_1.$$('div', { className: 'CoveoResultList' });
        var scriptElement = Dom_1.$$('script', {
            type: 'text/underscore',
            className: 'result-template'
        });
        var resultContainer = Dom_1.$$('div');
        resultContainer.el.innerHTML = this.getComponentElement().el.outerHTML;
        scriptElement.el.innerHTML = resultContainer.el.outerHTML;
        resultListElement.append(scriptElement.el);
        searchInterface.append(resultListElement.el);
    };
    Playground.prototype.insertElementIntoSearchInterface = function (searchInterface) {
        searchInterface.append(this.getComponentElement().el);
    };
    Playground.prototype.getComponentElement = function () {
        if (this.getConfiguration().element) {
            return this.getConfiguration().element;
        }
        return Dom_1.$$('div', { className: "Coveo" + Coveo[this.getComponentName()].ID });
    };
    Playground.prototype.triggerQuery = function (configuration, searchInterface) {
        if (configuration.basicExpression || configuration.advancedExpression) {
            Dom_1.$$(searchInterface).on(QueryEvents_1.QueryEvents.buildingQuery, function (e, args) {
                if (configuration.basicExpression) {
                    args.queryBuilder.expression.add(configuration.basicExpression);
                }
                if (configuration.advancedExpression) {
                    args.queryBuilder.advancedExpression.add(configuration.advancedExpression);
                }
            });
            var messageAboutBasic = configuration.basicExpression ? "the basic query expression is \"<span class='preview-info-emphasis'>" + configuration.basicExpression + "\"</span>" : '';
            var messageAboutAdvanced = configuration.advancedExpression ? "the advanced query expression is \"<span class='preview-info-emphasis'>" + configuration.advancedExpression + "\"</span>" : '';
            if (configuration.basicExpression && configuration.advancedExpression) {
                messageAboutBasic += ' and ';
            }
            var messageAboutQuery = Dom_1.$$('div', { className: 'preview-info' }, "Currently showing an example where " + messageAboutBasic + messageAboutAdvanced + ".");
            Dom_1.$$(searchInterface).prepend(messageAboutQuery.el);
        }
        Coveo['executeQuery'](searchInterface);
    };
    return Playground;
}());
exports.Playground = Playground;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(4);
exports.PlaygroundConfiguration = {
    SearchInterface: {
        show: false,
        options: {
            autoTriggerQuery: false
        }
    },
    Facet: {
        show: true,
        options: {
            field: '@objecttype',
            title: 'Type'
        }
    },
    Searchbox: {
        show: true,
        options: {
            enableOmnibox: true,
            enableRevealQuerySuggestAddon: true,
            inline: true
        }
    },
    SearchButton: {
        show: true
    },
    Omnibox: {
        show: true,
        options: {
            enableQuerySuggestAddon: true,
            inline: true
        }
    },
    Excerpt: {
        show: true,
        isResultComponent: true,
        basicExpression: 'technology'
    },
    Icon: {
        show: true,
        isResultComponent: true,
        basicExpression: 'getting started pdf'
    },
    Tab: {
        show: true,
        element: Dom_1.$$('div', { className: 'coveo-tab-section' }, "<div class=\"CoveoTab\" data-caption=\"All content\" data-id=\"All\"></div><div class=\"CoveoTab\" data-caption=\"YouTube videos\" data-id=\"YouTube\"></div><div class=\"CoveoTab\" data-caption=\"Google Drive\" data-id=\"GoogleDrive\"></div><div class=\"CoveoTab\" data-caption=\"Emails\" data-id=\"Emails\"></div><div class=\"CoveoTab\" data-caption=\"Salesforce content\" data-id=\"Salesforce\"></div>")
    },
    FacetSlider: {
        show: true,
        options: {
            field: '@date',
            dateField: true,
            queryOverride: '@date>2010/01/01',
            graph: {
                steps: 20
            },
            rangeSlider: true,
            title: 'Date distribution'
        }
    },
    Badge: {
        show: true,
        options: {
            field: '@author'
        },
        isResultComponent: true,
        advancedExpression: '@author=="BBC News"'
    },
    Breadcrumb: {
        show: true,
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoBreadcrumb\"></div><p>Interact with the facet to modify the breadcrumb</p><div class=\"CoveoFacet\" data-field=\"@objecttype\" data-title=\"Type\"></div>")
    },
    DidYouMean: {
        show: true,
        basicExpression: 'testt',
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoDidYouMean\"></div><div class='CoveoSearchbox'></div>")
    },
    ErrorReport: {
        show: true,
        toExecute: function () {
            Coveo['SearchEndpoint'].endpoints['default'].options.accessToken = 'invalid';
        }
    },
    ExportToExcel: {
        show: true,
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoSettings\"></div><div class=\"CoveoSearchbox\"></div><div class=\"CoveoExportToExcel\"></div>"),
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
        }
    },
    FacetRange: {
        show: true,
        options: {
            field: '@size',
            title: 'Documents size',
            ranges: [{
                    start: 0,
                    end: 100,
                    label: "0 - 100 KB",
                    endInclusive: false
                }, {
                    start: 100,
                    end: 200,
                    label: "100 - 200 KB",
                    endInclusive: false
                }, {
                    start: 200,
                    end: 300,
                    label: "200 - 300 KB",
                    endInclusive: false
                },
                {
                    start: 300,
                    end: 400,
                    label: "300 - 400 KB",
                    endInclusive: false
                }
            ],
            sortCriteria: 'alphaascending'
        }
    },
    FieldSuggestions: {
        options: {
            field: '@author'
        },
        show: true,
        element: Dom_1.$$('div', undefined, "<div class='preview-info'>Showing suggestions on the field <span class='preview-info-emphasis'>@author</span></div><div class=\"CoveoSearchbox\" data-enable-omnibox=\"true\"></div><div class=\"CoveoFieldSuggestions\"></div>"),
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.minHeight = '500px';
        }
    },
    FieldTable: {
        show: true,
        options: {
            minimizedByDefault: false
        },
        isResultComponent: true,
        advancedExpression: '@source=="Dropbox - coveodocumentationsamples@gmail.com"',
        element: Dom_1.$$('div', undefined, "<table class=\"CoveoFieldTable\">\n            <tbody>\n             <tr data-field=\"@size\" data-caption=\"Document size\" data-helper=\"size\">\n              </tr>\n              <tr data-field=\"@source\" data-caption=\"Source\">\n              </tr>\n              <tr data-field=\"@date\" data-caption=\"Date\" date-helper=\"dateTime\"></tr>\n            </tbody>\n          </table>")
    },
    FieldValue: {
        show: true,
        options: {
            field: '@date',
            helper: 'dateTime'
        },
        isResultComponent: true,
        advancedExpression: '@date'
    },
    FollowItem: {
        show: true,
        isResultComponent: true,
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoSearchAlerts\"></div><a class=\"CoveoResultLink\"></a><span class=\"CoveoFollowItem\"></span>"),
        basicExpression: 'technology',
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
        }
    },
    HiddenQuery: {
        show: true,
        toExecute: function () {
            var searchInterface = Dom_1.$$(document.body).find('.CoveoSearchInterface');
            Coveo.state(searchInterface, 'hd', 'This is the filter description');
            Coveo.state(searchInterface, 'hq', '@uri');
        },
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoBreadcrumb\"></div><div class=\"CoveoHiddenQuery\"></div>")
    },
    HierarchicalFacet: {
        show: true,
        options: {
            field: '@hierarchicfield',
            title: 'Hierarchical Facet with random values'
        },
        advancedExpression: "@hierarchicfield"
    },
    Logo: {
        show: true,
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.padding = '20px';
        }
    },
    Matrix: {
        show: true,
        options: {
            title: 'Size of documents by Author',
            rowField: '@author',
            columnField: '@filetype',
            columnFieldValues: ['pdf', 'YouTubeVideo', 'xls'],
            computedField: '@size',
            computedFieldFormat: 'n0 bytes',
            columnLabels: ['PDF', 'YouTube Videos', 'Excel documents']
        },
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoBreadcrumb\"></div><div class=\"CoveoMatrix\"></div>")
    },
    OmniboxResultList: {
        show: true,
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoSearchbox\" data-enable-omnibox=\"true\" data-inline=\"true\"></div><div class=\"CoveoOmniboxResultList\"><script class=\"result-template\" type=\"text/x-underscore\"><div><a class='CoveoResultLink'></a></div></script></div>"),
        options: {
            headerTitle: ''
        },
        toExecute: function () {
            Coveo.get(Dom_1.$$(document.body).find('.CoveoSearchInterface'), Coveo.SearchInterface).options.resultsPerPage = 5;
        }
    },
    Pager: {
        show: true,
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.padding = '20px';
        }
    },
    PreferencesPanel: {
        show: true,
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoSettings\"></div><div class=\"CoveoSearchbox\"></div><div class=\"CoveoPreferencesPanel\"><div class=\"CoveoResultsPreferences\"></div><div class=\"CoveoResultsFiltersPreferences\"></div></div>"),
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
        }
    },
    PrintableUri: {
        show: true,
        isResultComponent: true,
        advancedExpression: '@litopicid @filetype==lithiummessage'
    },
    QueryDuration: {
        show: true
    },
    QuerySummary: {
        show: true
    },
    Querybox: {
        show: true
    },
    Quickview: {
        show: true,
        isResultComponent: true,
        advancedExpression: '@filetype=="youtubevideo"'
    },
    ResultLink: {
        show: true,
        isResultComponent: true,
        advancedExpression: '@filetype=="youtubevideo"'
    },
    ResultList: {
        show: true
    },
    ResultRating: {
        show: true,
        isResultComponent: true,
        toExecute: function () {
            Coveo.get(Dom_1.$$(document.body).find('.CoveoSearchInterface'), Coveo.SearchInterface).options.enableCollaborativeRating = true;
        }
    },
    ResultsFiltersPreferences: {
        show: true,
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoSettings\"></div><div class=\"CoveoSearchbox\"></div><div class=\"CoveoPreferencesPanel\"><div class=\"CoveoResultsFiltersPreferences\"></div></div>"),
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
        }
    },
    ResultsPerPage: {
        show: true,
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.padding = '20px';
        }
    },
    ResultsPreferences: {
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoSettings\"></div><div class=\"CoveoSearchbox\"></div><div class=\"CoveoPreferencesPanel\"><div class=\"CoveoResultsPreferences\"></div></div>"),
        show: true,
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
        }
    },
    SearchAlerts: {
        show: true,
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoSettings\"></div><div class=\"CoveoSearchbox\"></div><div class=\"CoveoSearchAlerts\"></div>"),
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
        }
    },
    Settings: {
        show: true,
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoSettings\"></div><div class=\"CoveoSearchbox\"></div><div class=\"CoveoPreferencesPanel\"></div><div class=\"CoveoShareQuery\"></div><div class=\"CoveoExportToExcel\"></div>"),
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
        }
    },
    ShareQuery: {
        show: true,
        element: Dom_1.$$('div', undefined, "<div class=\"CoveoSettings\"></div><div class=\"CoveoSearchbox\"></div><div class=\"CoveoShareQuery\"></div>"),
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
        }
    },
    Sort: {
        show: true,
        element: Dom_1.$$('div', undefined, "<span class=\"CoveoSort\" data-sort-criteria=\"relevancy\" data-caption=\"Relevance\"></span><span class=\"CoveoSort\" data-sort-criteria=\"date descending,date ascending\" data-caption=\"Date\"></span>"),
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.padding = '20px';
        }
    },
    Thumbnail: {
        show: true,
        isResultComponent: true,
        advancedExpression: '@filetype=="youtubevideo"'
    },
    YouTubeThumbnail: {
        show: true,
        isResultComponent: true,
        advancedExpression: '@filetype=="youtubevideo"'
    },
    AdvancedSearch: {
        show: true,
        element: Dom_1.$$('div', undefined, "<div class=\"coveo-search-section\"><div class=\"CoveoSettings\"></div><div class=\"CoveoSearchbox\"></div></div><div class=\"CoveoAdvancedSearch\"></div>"),
        toExecute: function () {
            Dom_1.$$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
        }
    }
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class is there to contains the different string definition for all the events related to query.
 *
 * Note that these events will only be triggered when the {@link QueryController.executeQuery} method is used, either directly or by using {@link executeQuery}
 */
var QueryEvents = (function () {
    function QueryEvents() {
    }
    return QueryEvents;
}());
/**
 * Triggered when a new query is launched.
 *
 * All bound handlers will receive {@link INewQueryEventArgs} as an argument.
 *
 * The string value is `newQuery`.
 * @type {string}
 */
QueryEvents.newQuery = 'newQuery';
/**
 * Triggered when the query is being built.
 *
 * This is typically where all components will contribute their part to the {@link IQuery} using the {@link QueryBuilder}.
 *
 * All bound handlers will receive {@link IBuildingQueryEventArgs} as an argument.
 *
 * The string value is `buildingQuery`.
 * @type {string}
 */
QueryEvents.buildingQuery = 'buildingQuery';
/**
 * Triggered when the query is done being built.
 *
 * This is typically where the facet will add it's {@link IGroupByRequest} to the {@link IQuery}.
 *
 * All bound handlers will receive {@link IDoneBuildingQueryEventArgs} as an argument.
 *
 * The string value is `doneBuildingQuery`.
 * @type {string}
 */
QueryEvents.doneBuildingQuery = 'doneBuildingQuery';
/**
 * Triggered when the query is being executed on the Search API.
 *
 * All bound handlers will receive {@link IDuringQueryEventArgs} as an argument.
 *
 * The string value is `duringQuery`.
 * @type {string}
 */
QueryEvents.duringQuery = 'duringQuery';
/**
 * Triggered when more results are being fetched on the Search API (think : infinite scrolling, or pager).
 *
 * All bound handlers will receive {@link IDuringQueryEventArgs} as an argument.
 *
 * The string value is `duringFetchMoreQuery`.
 * @type {string}
 */
QueryEvents.duringFetchMoreQuery = 'duringFetchMoreQuery';
/**
 * Triggered when a query successfully returns from the Search API.
 *
 * All bound handlers will receive {@link IQuerySuccessEventArgs} as an argument.
 *
 * The string value is `querySuccess`.
 * @type {string}
 */
QueryEvents.querySuccess = 'querySuccess';
/**
 * Triggered when a more results were successfully returned from the Search API. (think : infinite scrolling, or pager).
 *
 * All bound handlers will receive {@link IFetchMoreSuccessEventArgs} as an argument.
 *
 * The string value is `fetchMoreSuccess`.
 * @type {string}
 */
QueryEvents.fetchMoreSuccess = 'fetchMoreSuccess';
/**
 * Triggered after the main query success event has finished executing.
 *
 * This is typically where facets will process the {@link IGroupByResult} and render themselves.
 *
 * All bound handlers will receive {@link IQuerySuccessEventArgs} as an argument.
 *
 * The string value is `deferredQuerySuccess`.
 * @type {string}
 */
QueryEvents.deferredQuerySuccess = 'deferredQuerySuccess';
/**
 * Triggered when there was an error executing a query on the Search API.
 *
 * All bound handlers will receive {@link IQueryErrorEventArgs} as an argument.
 *
 * The string value is `queryError`.
 * @type {string}
 */
QueryEvents.queryError = 'queryError';
/**
 * Triggered before the {@link QueryEvents.querySuccess} event.
 *
 * This allows external code to modify the results before rendering them.
 *
 * For example, the {@link Folding} component might use this event to construct a coherent parent child relationship between query results.
 *
 * All bound handlers will receive {@link IPreprocessResultsEventArgs} as an argument.
 *
 * The string value is `preprocessResults`.
 * @type {string}
 */
QueryEvents.preprocessResults = 'preprocessResults';
/**
 * Triggered before the {@link QueryEvents.fetchMoreSuccess} event.
 *
 * This allows external code to modify the results before rendering them.
 *
 * For example, the {@link Folding} component might use this event to construct a coherent parent child relationship between query results.
 *
 * All bound handlers will receive {@link IPreprocessResultsEventArgs} as an argument.
 *
 * The string value is `preprocessMoreResults`.
 * @type {string}
 */
QueryEvents.preprocessMoreResults = 'preprocessMoreResults';
/**
 * Triggered when there is no result for a particular query.
 *
 * All bound handlers will receive {@link INoResultsEventArgs} as an argument.
 *
 * The string value is `noResults`.
 * @type {string}
 */
QueryEvents.noResults = 'noResults';
QueryEvents.buildingCallOptions = 'buildingCallOptions';
exports.QueryEvents = QueryEvents;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore next */
function shim() {
    var doShim = function (promiseInstance) {
        if (typeof promiseInstance.prototype['finally'] != 'function') {
            promiseInstance.prototype['finally'] = function finallyPolyfill(callback) {
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
            };
        }
        var rethrowError = function (self) {
            self.then(null, function (err) {
                setTimeout(function () {
                    throw err;
                }, 0);
            });
        };
        if (typeof promiseInstance.prototype['done'] !== 'function') {
            promiseInstance.prototype['done'] = function (onFulfilled, onRejected) {
                var self = arguments.length ? this.then.apply(this, arguments) : this;
                rethrowError(self);
                return this;
            };
        }
        if (typeof promiseInstance.prototype['fail'] !== 'function') {
            promiseInstance.prototype['fail'] = function (onFulfilled, onRejected) {
                var self = arguments.length ? this.catch.apply(this, arguments) : this;
                rethrowError(self);
                return this;
            };
        }
    };
    var globalPromise = window['Promise'];
    var localPromise = Promise;
    if (globalPromise) {
        doShim(globalPromise);
    }
    if (localPromise) {
        doShim(localPromise);
    }
}
exports.shim = shim;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.version = {
    'lib': '2.2900.20-beta',
    'product': '2.2900.20-beta',
    'supportedApiVersion': 2
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(0);
var AjaxError = (function () {
    function AjaxError(message, status) {
        this.message = message;
        this.status = status;
        Assert_1.Assert.exists(message);
        Assert_1.Assert.exists(status);
        this.name = this.type = 'Ajax Error (status: ' + status + ')';
    }
    return AjaxError;
}());
exports.AjaxError = AjaxError;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(0);
var TimeSpanUtils_1 = __webpack_require__(24);
var DeviceUtils_1 = __webpack_require__(22);
var Utils_1 = __webpack_require__(2);
var JQueryutils_1 = __webpack_require__(5);
var _ = __webpack_require__(1);
// In ie8, XMLHttpRequest has no status property, so let's use this enum instead
var XMLHttpRequestStatus;
(function (XMLHttpRequestStatus) {
    XMLHttpRequestStatus[XMLHttpRequestStatus["OPENED"] = XMLHttpRequest.OPENED || 1] = "OPENED";
    XMLHttpRequestStatus[XMLHttpRequestStatus["HEADERS_RECEIVED"] = XMLHttpRequest.HEADERS_RECEIVED || 2] = "HEADERS_RECEIVED";
    XMLHttpRequestStatus[XMLHttpRequestStatus["DONE"] = XMLHttpRequest.DONE || 4] = "DONE";
})(XMLHttpRequestStatus || (XMLHttpRequestStatus = {}));
/**
 * This class is in charge of calling an endpoint (eg: a {@link SearchEndpoint}).
 *
 * This means it's only uses to execute an XMLHttpRequest (for example), massage the response and check if there are errors.
 *
 * Will execute the call and return a Promise.
 *
 * Call using one of those options :
 *
 * * XMLHttpRequest for recent browser that support CORS, or if the endpoint is on the same origin.
 * * XDomainRequest for older IE browser that do not support CORS.
 * * Jsonp if all else fails, or is explicitly enabled.
 */
var EndpointCaller = (function () {
    /**
     * Create a new EndpointCaller.
     * @param options Specify the authentication that will be used for this endpoint. Not needed if the endpoint is public and has no authentication
     */
    function EndpointCaller(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        /**
         * Set this property to true to enable Jsonp call to the endpoint.<br/>
         * Be aware that jsonp is "easier" to setup endpoint wise, but has a lot of drawback and limitation for the client code.<br/>
         * Default to false.
         * @type {boolean}
         */
        this.useJsonp = false;
        this.logger = new Logger_1.Logger(this);
    }
    /**
     * Generic call to the endpoint using the provided {@link IEndpointCallParameters}.<br/>
     * Internally, will decide which method to use to call the endpoint :<br/>
     * -- XMLHttpRequest for recent browser that support CORS, or if the endpoint is on the same origin.<br/>
     * -- XDomainRequest for older IE browser that do not support CORS.<br/>
     * -- Jsonp if all else fails, or is explicitly enabled.
     * @param params The parameters to use for the call
     * @returns {any} A promise of the given type
     */
    EndpointCaller.prototype.call = function (params) {
        var requestInfo = {
            url: params.url,
            queryString: params.errorsAsSuccess ? params.queryString.concat(['errorsAsSuccess=1']) : params.queryString,
            requestData: params.requestData,
            requestDataType: params.requestDataType || 'application/x-www-form-urlencoded; charset="UTF-8"',
            begun: new Date(),
            method: params.method
        };
        requestInfo.headers = this.buildRequestHeaders(requestInfo);
        if (_.isFunction(this.options.requestModifier)) {
            requestInfo = this.options.requestModifier(requestInfo);
        }
        this.logger.trace('Performing REST request', requestInfo);
        var urlObject = this.parseURL(requestInfo.url);
        // In IE8, hostname and port return "" when we are on the same domain.
        var isLocalHost = (window.location.hostname === urlObject.hostname) || (urlObject.hostname === '');
        var currentPort = (window.location.port != '' ? window.location.port : (window.location.protocol == 'https:' ? '443' : '80'));
        var isSamePort = currentPort == urlObject.port;
        var isCrossOrigin = !(isLocalHost && isSamePort);
        if (!this.useJsonp) {
            if (this.isCORSSupported() || !isCrossOrigin) {
                return this.callUsingXMLHttpRequest(requestInfo, params.responseType);
            }
            else if (this.isXDomainRequestSupported()) {
                return this.callUsingXDomainRequest(requestInfo);
            }
            else {
                return this.callUsingAjaxJsonP(requestInfo);
            }
        }
        else {
            return this.callUsingAjaxJsonP(requestInfo);
        }
    };
    /**
     * Call the endpoint using XMLHttpRequest. Used internally by {@link EndpointCaller.call}.<br/>
     * Will try internally to handle error if it can.<br/>
     * Promise will otherwise fail with the error type.
     * @param requestInfo The info about the request
     * @param responseType The responseType. Default to text. https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
     * @returns {Promise<T>|Promise}
     */
    EndpointCaller.prototype.callUsingXMLHttpRequest = function (requestInfo, responseType) {
        var _this = this;
        if (responseType === void 0) { responseType = 'text'; }
        return new Promise(function (resolve, reject) {
            var xmlHttpRequest = _this.getXmlHttpRequest();
            // Beware, most stuff must be set on the event that says the request is OPENED.
            // Otherwise it'll bork on some browsers. Gotta love standards.
            // This sent variable allowed to remove the second call of onreadystatechange with the state OPENED in IE11
            var sent = false;
            xmlHttpRequest.onreadystatechange = function (ev) {
                if (xmlHttpRequest.readyState == XMLHttpRequestStatus.OPENED && !sent) {
                    sent = true;
                    xmlHttpRequest.withCredentials = true;
                    _.each(requestInfo.headers, function (headerValue, headerKey) {
                        xmlHttpRequest.setRequestHeader(headerKey, headerValue);
                    });
                    if (requestInfo.method == 'GET') {
                        xmlHttpRequest.send();
                    }
                    else if (requestInfo.requestDataType.indexOf('application/json') === 0) {
                        xmlHttpRequest.send(JSON.stringify(requestInfo.requestData));
                    }
                    else {
                        xmlHttpRequest.send(_this.convertJsonToFormBody(requestInfo.requestData));
                    }
                    // The "responseType" varies if the request is a success or not.
                    // Therefore we postpone setting "responseType" until we know if the
                    // request is a success or not. Doing so, we avoid this potential
                    // error in Chrome:
                    //
                    //   Uncaught InvalidStateError: Failed to read the 'responseText'
                    //   property from 'XMLHttpRequest': The value is only accessible if
                    //   the object's 'responseType' is '' or 'text' (was 'document').
                    //
                }
                else if (xmlHttpRequest.readyState == XMLHttpRequestStatus.HEADERS_RECEIVED) {
                    var status = xmlHttpRequest.status;
                    if (_this.isSuccessHttpStatus(status)) {
                        xmlHttpRequest.responseType = responseType;
                    }
                    else {
                        xmlHttpRequest.responseType = 'text';
                    }
                }
                else if (xmlHttpRequest.readyState == XMLHttpRequestStatus.DONE) {
                    var status = xmlHttpRequest.status;
                    var data;
                    switch (responseType) {
                        case 'json':
                            data = xmlHttpRequest.response;
                            // Work around a bug in IE11 where responseType jsonis not supported : the response comes back as a plain string
                            // Force the json parse manually
                            if (responseType == 'json' && DeviceUtils_1.DeviceUtils.getDeviceName() == 'IE') {
                                try {
                                    data = JSON.parse(data);
                                }
                                catch (e) {
                                    // Do nothing, it probably means the data was JSON already
                                }
                            }
                            break;
                        case 'text':
                            data = _this.tryParseResponseText(xmlHttpRequest.responseText, xmlHttpRequest.getResponseHeader('Content-Type'));
                            break;
                        default:
                            data = xmlHttpRequest.response;
                            break;
                    }
                    if (data == undefined) {
                        data = _this.tryParseResponseText(xmlHttpRequest.responseText, xmlHttpRequest.getResponseHeader('Content-Type'));
                    }
                    if (_this.isSuccessHttpStatus(status)) {
                        _this.handleSuccessfulResponseThatMightBeAnError(requestInfo, data, resolve, reject);
                    }
                    else {
                        _this.handleError(requestInfo, xmlHttpRequest.status, data, reject);
                    }
                }
            };
            var queryString = requestInfo.queryString;
            if (requestInfo.method == 'GET') {
                queryString = queryString.concat(_this.convertJsonToQueryString(requestInfo.requestData));
            }
            xmlHttpRequest.open(requestInfo.method, _this.combineUrlAndQueryString(requestInfo.url, queryString));
        });
    };
    /**
     * Call the endpoint using XDomainRequest https://msdn.microsoft.com/en-us/library/cc288060(v=vs.85).aspx<br/>
     * Used for IE8/9
     * @param requestInfo The info about the request
     * @returns {Promise<T>|Promise}
     */
    EndpointCaller.prototype.callUsingXDomainRequest = function (requestInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var queryString = requestInfo.queryString.concat([]);
            // XDomainRequest don't support including stuff in the header, so we must
            // put the access token in the query string if we have one.
            if (_this.options.accessToken) {
                queryString.push('access_token=' + encodeURIComponent(_this.options.accessToken));
            }
            var xDomainRequest = new XDomainRequest();
            if (requestInfo.method == 'GET') {
                queryString = queryString.concat(_this.convertJsonToQueryString(requestInfo.requestData));
            }
            xDomainRequest.open(requestInfo.method, _this.combineUrlAndQueryString(requestInfo.url, queryString));
            xDomainRequest.onload = function () {
                var data = _this.tryParseResponseText(xDomainRequest.responseText, xDomainRequest.contentType);
                _this.handleSuccessfulResponseThatMightBeAnError(requestInfo, data, resolve, reject);
            };
            xDomainRequest.onerror = function () {
                var data = _this.tryParseResponseText(xDomainRequest.responseText, xDomainRequest.contentType);
                _this.handleError(requestInfo, 0, data, reject);
            };
            // We must set those functions otherwise it will sometime fail in IE
            xDomainRequest.ontimeout = function () { return _this.logger.error('Request timeout', xDomainRequest, requestInfo.requestData); };
            xDomainRequest.onprogress = function () { return _this.logger.trace('Request progress', xDomainRequest, requestInfo.requestData); };
            // We must open the request in a separate thread, for obscure reasons
            _.defer(function () {
                if (requestInfo.method == 'GET') {
                    xDomainRequest.send();
                }
                else {
                    xDomainRequest.send(_this.convertJsonToFormBody(requestInfo.requestData));
                }
            });
        });
    };
    /**
     * Call the endpoint using Jsonp https://en.wikipedia.org/wiki/JSONP<br/>
     * Should be used for dev only, or for very special setup as using jsonp has a lot of drawbacks.
     * @param requestInfo The info about the request
     * @returns {Promise<T>|Promise}
     */
    EndpointCaller.prototype.callUsingAjaxJsonP = function (requestInfo) {
        var _this = this;
        var jQuery = JQueryutils_1.JQueryUtils.getJQuery();
        Assert_1.Assert.check(jQuery, 'Using jsonp without having included jQuery is not supported.');
        return new Promise(function (resolve, reject) {
            var queryString = requestInfo.queryString.concat(_this.convertJsonToQueryString(requestInfo.requestData));
            // JSONP don't support including stuff in the header, so we must
            // put the access token in the query string if we have one.
            if (_this.options.accessToken) {
                queryString.push('access_token=' + encodeURIComponent(_this.options.accessToken));
            }
            queryString.push('callback=?');
            jQuery.ajax({
                url: _this.combineUrlAndQueryString(requestInfo.url, queryString),
                dataType: 'jsonp',
                success: function (data) { return _this.handleSuccessfulResponseThatMightBeAnError(requestInfo, data, resolve, reject); },
                timeout: EndpointCaller.JSONP_ERROR_TIMEOUT,
                error: function () { return _this.handleError(requestInfo, 0, undefined, reject); }
            });
        });
    };
    EndpointCaller.prototype.parseURL = function (url) {
        var urlObject = document.createElement('a');
        urlObject.href = url;
        return urlObject;
    };
    EndpointCaller.prototype.getXmlHttpRequest = function () {
        var newXmlHttpRequest = this.options.xmlHttpRequest || XMLHttpRequest;
        return new newXmlHttpRequest();
    };
    EndpointCaller.prototype.convertJsonToQueryString = function (json) {
        Assert_1.Assert.exists(json);
        var result = [];
        _.each(json, function (value, key) {
            if (value != null) {
                if (_.isObject(value)) {
                    result.push(key + '=' + encodeURIComponent(JSON.stringify(value)));
                }
                else {
                    result.push(key + '=' + encodeURIComponent(value.toString()));
                }
            }
        });
        return result;
    };
    EndpointCaller.prototype.convertJsonToFormBody = function (json) {
        return this.convertJsonToQueryString(json).join('&');
    };
    EndpointCaller.prototype.handleSuccessfulResponseThatMightBeAnError = function (requestInfo, data, success, error) {
        if (this.isErrorResponseBody(data)) {
            this.handleError(requestInfo, data.statusCode, data, error);
        }
        else {
            this.handleSuccess(requestInfo, data, success);
        }
    };
    EndpointCaller.prototype.handleSuccess = function (requestInfo, data, success) {
        var querySuccess = {
            duration: TimeSpanUtils_1.TimeSpan.fromDates(requestInfo.begun, new Date()).getMilliseconds(),
            data: data
        };
        this.logger.trace('REST request successful', data, requestInfo);
        success(querySuccess);
    };
    EndpointCaller.prototype.handleError = function (requestInfo, status, data, error) {
        var queryError = {
            statusCode: status,
            data: data
        };
        this.logger.error('REST request failed', status, data, requestInfo);
        error(queryError);
    };
    EndpointCaller.prototype.combineUrlAndQueryString = function (url, queryString) {
        var questionMark = '?';
        if (url.match(/\?$/)) {
            questionMark = '';
        }
        return url + (queryString.length > 0 ? questionMark + queryString.join('&') : '');
    };
    EndpointCaller.prototype.isXDomainRequestSupported = function () {
        return 'XDomainRequest' in window;
    };
    EndpointCaller.prototype.isCORSSupported = function () {
        return 'withCredentials' in this.getXmlHttpRequest();
    };
    EndpointCaller.prototype.isSuccessHttpStatus = function (status) {
        return status >= 200 && status < 300 || status === 304;
    };
    EndpointCaller.prototype.tryParseResponseText = function (json, contentType) {
        if (contentType != null && contentType.indexOf('application/json') != -1) {
            if (Utils_1.Utils.isNonEmptyString(json)) {
                try {
                    return JSON.parse(json);
                }
                catch (ex) {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        }
        else {
            return json;
        }
    };
    EndpointCaller.prototype.isErrorResponseBody = function (data) {
        if (data && data.statusCode) {
            return !this.isSuccessHttpStatus(data.statusCode);
        }
        else {
            return false;
        }
    };
    EndpointCaller.prototype.buildRequestHeaders = function (requestInfo) {
        var headers = {};
        if (this.options.accessToken) {
            headers['Authorization'] = "Bearer " + this.options.accessToken;
        }
        else if (this.options.username && this.options.password) {
            headers['Authorization'] = "Basic " + btoa(this.options.username + ':' + this.options.password);
        }
        if (requestInfo.method == 'GET') {
            return headers;
        }
        if (requestInfo.requestDataType.indexOf('application/json') === 0) {
            headers['Content-Type'] = 'application/json; charset="UTF-8"';
        }
        else {
            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset="UTF-8"';
        }
        return headers;
    };
    return EndpointCaller;
}());
EndpointCaller.JSONP_ERROR_TIMEOUT = 10000;
exports.EndpointCaller = EndpointCaller;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MissingAuthenticationError = (function () {
    function MissingAuthenticationError(provider) {
        this.provider = provider;
        this.isMissingAuthentication = true;
        this.name = this.type = this.message = "Missing Authentication (provider: " + provider + ")";
    }
    return MissingAuthenticationError;
}());
exports.MissingAuthenticationError = MissingAuthenticationError;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(0);
var QueryError = (function () {
    function QueryError(errorResponse) {
        this.status = errorResponse.statusCode;
        this.message = errorResponse.data.message;
        this.name = this.type = errorResponse.data.type;
        this.queryExecutionReport = errorResponse.data.executionReport;
        Assert_1.Assert.isNumber(this.status);
        Assert_1.Assert.isNonEmptyString(this.message);
        Assert_1.Assert.isNonEmptyString(this.type);
    }
    return QueryError;
}());
exports.QueryError = QueryError;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EndpointCaller_1 = __webpack_require__(16);
var Logger_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(0);
var Version_1 = __webpack_require__(14);
var AjaxError_1 = __webpack_require__(15);
var MissingAuthenticationError_1 = __webpack_require__(17);
var QueryUtils_1 = __webpack_require__(23);
var QueryError_1 = __webpack_require__(18);
var Utils_1 = __webpack_require__(2);
var _ = __webpack_require__(1);
var PromisesShim_1 = __webpack_require__(13);
PromisesShim_1.shim();
var DefaultSearchEndpointOptions = (function () {
    function DefaultSearchEndpointOptions() {
        this.version = 'v2';
        this.queryStringArguments = {};
        this.anonymous = false;
        this.isGuestUser = false;
    }
    return DefaultSearchEndpointOptions;
}());
exports.DefaultSearchEndpointOptions = DefaultSearchEndpointOptions;
/**
 * The `SearchEndpoint` class allows you to execute various actions against the Coveo Search API and a Coveo index
 * (e.g., searching, listing field values, getting the quickview content of an item, etc.).
 *
 * This class does trigger any query events directly. Consequently, executing an action with this class does not trigger
 * a full query cycle for the Coveo components.
 *
 * If you wish to have all Coveo components "react" to a query, (and trigger the corresponding query events), use the
 * [`QueryController`]{@link QueryController} class instead.
 */
var SearchEndpoint = (function () {
    /**
     * Creates a new `SearchEndpoint` instance.
     * Uses a set of adequate default options, and merges these with the `options` parameter.
     * Also creates an [`EndpointCaller`]{@link EndpointCaller} instance and uses it to communicate with the endpoint
     * internally.
     * @param options The custom options to apply to the new `SearchEndpoint`.
     */
    function SearchEndpoint(options) {
        var _this = this;
        this.options = options;
        Assert_1.Assert.exists(options);
        Assert_1.Assert.exists(options.restUri);
        // For backward compatibility, we set anonymous to true when an access token
        // is specified on a page loaded through the filesystem. This causes withCredentials
        // to NOT be set, allowing those pages to work with non Windows/Basic/Cookie
        // authentication. If anonymous is explicitly set to false, we'll use withCredentials.
        var defaultOptions = new DefaultSearchEndpointOptions();
        defaultOptions.anonymous = window.location.href.indexOf('file://') == 0 && Utils_1.Utils.isNonEmptyString(options.accessToken);
        this.options = _.extend({}, defaultOptions, options);
        // Forward any debug=1 query argument to the REST API to ease debugging
        if (SearchEndpoint.isDebugArgumentPresent()) {
            this.options.queryStringArguments['debug'] = 1;
        }
        this.onUnload = function () {
            _this.handleUnload();
        };
        window.addEventListener('beforeunload', this.onUnload);
        this.logger = new Logger_1.Logger(this);
        this.createEndpointCaller();
    }
    /**
     * Configures a sample search endpoint on a Coveo Cloud index containing a set of public sources with no secured
     * content.
     *
     * **Note:**
     * > This method mainly exists for demo purposes and ease of setup.
     *
     * @param otherOptions A set of additional options to use when configuring this endpoint.
     */
    SearchEndpoint.configureSampleEndpoint = function (otherOptions) {
        if (SearchEndpoint.isUseLocalArgumentPresent()) {
            // This is a handy flag to quickly test a local search API and alerts
            SearchEndpoint.endpoints['default'] = new SearchEndpoint(_.extend({
                restUri: 'http://localhost:8100/rest/search',
                searchAlertsUri: 'http://localhost:8088/rest/search/alerts/'
            }, otherOptions));
        }
        else {
            // This OAuth token points to the organization used for samples.
            // It contains a set of harmless content sources.
            SearchEndpoint.endpoints['default'] = new SearchEndpoint(_.extend({
                restUri: 'https://cloudplatform.coveo.com/rest/search',
                accessToken: '52d806a2-0f64-4390-a3f2-e0f41a4a73ec'
            }, otherOptions));
        }
    };
    /**
     * Configures a sample search endpoint on a Coveo Cloud V2 index containing a set of public sources with no secured
     * content.
     *
     * **Note:**
     * > This method mainly exists for demo purposes and ease of setup.
     *
     * @param otherOptions A set of additional options to use when configuring this endpoint.
     */
    SearchEndpoint.configureSampleEndpointV2 = function (optionsOPtions) {
        SearchEndpoint.endpoints['default'] = new SearchEndpoint(_.extend({
            restUri: 'https://platform.cloud.coveo.com/rest/search',
            accessToken: 'xx564559b1-0045-48e1-953c-3addd1ee4457',
            queryStringArguments: {
                organizationId: 'searchuisamples',
                viewAllContent: 1
            }
        }));
    };
    /**
     * Configures a search endpoint on a Coveo Cloud index.
     * @param organization The organization ID of your Coveo Cloud index.
     * @param token The token to use to execute query. If not specified, you will likely need to login when querying.
     * @param uri The URI of the Coveo Cloud REST Search API. By default, this points to the production environment.
     * @param otherOptions A set of additional options to use when configuring this endpoint.
     */
    SearchEndpoint.configureCloudEndpoint = function (organization, token, uri, otherOptions) {
        if (uri === void 0) { uri = 'https://cloudplatform.coveo.com/rest/search'; }
        var options = {
            restUri: uri,
            accessToken: token,
            queryStringArguments: { organizationId: organization }
        };
        var merged = SearchEndpoint.mergeConfigOptions(options, otherOptions);
        SearchEndpoint.endpoints['default'] = new SearchEndpoint(SearchEndpoint.removeUndefinedConfigOption(merged));
    };
    /**
     * Configures a search endpoint on a Coveo Cloud V2 index.
     * @param organization The organization ID of your Coveo Cloud V2 index.
     * @param token The token to use to execute query. If not specified, you will likely need to login when querying.
     * @param uri The URI of the Coveo Cloud REST Search API. By default, this points to the production environment.
     * @param otherOptions A set of additional options to use when configuring this endpoint.
     */
    SearchEndpoint.configureCloudV2Endpoint = function (organization, token, uri, otherOptions) {
        if (uri === void 0) { uri = 'https://platform.cloud.coveo.com/rest/search'; }
        return SearchEndpoint.configureCloudEndpoint(organization, token, uri, otherOptions);
    };
    /**
     * Configures a search endpoint on a Coveo on-premise index.
     * @param uri The URI of your Coveo Search API endpoint (e.g., `http://myserver:8080/rest/search`)
     * @param token The token to use to execute query. If not specified, you will likely need to login when querying
     * (unless your Coveo Search API endpoint is configured using advanced auth options, such as Windows auth or claims).
     * @param otherOptions A set of additional options to use when configuring this endpoint.
     */
    SearchEndpoint.configureOnPremiseEndpoint = function (uri, token, otherOptions) {
        var merged = SearchEndpoint.mergeConfigOptions({
            restUri: uri,
            accessToken: token
        }, otherOptions);
        SearchEndpoint.endpoints['default'] = new SearchEndpoint(SearchEndpoint.removeUndefinedConfigOption(merged));
    };
    SearchEndpoint.removeUndefinedConfigOption = function (config) {
        _.each(_.keys(config), function (key) {
            if (config[key] == undefined) {
                delete config[key];
            }
        });
        return config;
    };
    SearchEndpoint.mergeConfigOptions = function (first, second) {
        first = SearchEndpoint.removeUndefinedConfigOption(first);
        second = SearchEndpoint.removeUndefinedConfigOption(second);
        return _.extend({}, first, second);
    };
    SearchEndpoint.prototype.reset = function () {
        this.createEndpointCaller();
    };
    /**
     * Sets a function which allows external code to modify all endpoint call parameters before the browser sends them.
     *
     * **Note:**
     * > This is useful in very specific scenarios where the network infrastructure requires special request headers to be
     * > added or removed, for example.
     * @param requestModifier The function.
     */
    SearchEndpoint.prototype.setRequestModifier = function (requestModifier) {
        this.caller.options.requestModifier = requestModifier;
    };
    /**
     * Gets the base URI of the Search API endpoint.
     * @returns {string} The base URI of the Search API endpoint.
     */
    SearchEndpoint.prototype.getBaseUri = function () {
        return this.buildBaseUri('');
    };
    /**
     * Gets the base URI of the search alerts endpoint.
     * @returns {string} The base URI of the search alerts endpoint.
     */
    SearchEndpoint.prototype.getBaseAlertsUri = function () {
        return this.buildSearchAlertsUri('');
    };
    /**
     * Gets the URI that can be used to authenticate against the given provider.
     * @param provider The provider name.
     * @param returnUri The URI to return to after the authentication is completed.
     * @param message The authentication message.
     * @param callOptions Additional set of options to use for this call.
     * @param callParams Options injected by the applied decorators.
     * @returns {string} The authentication provider URI.
     */
    SearchEndpoint.prototype.getAuthenticationProviderUri = function (provider, returnUri, message, callOptions, callParams) {
        var queryString = this.buildBaseQueryString(callOptions);
        callParams.queryString = callParams.queryString.concat(queryString);
        callParams.url += provider + '?';
        if (Utils_1.Utils.isNonEmptyString(returnUri)) {
            callParams.url += 'redirectUri=' + encodeURIComponent(returnUri) + '&';
        }
        else if (Utils_1.Utils.isNonEmptyString(message)) {
            callParams.url += 'message=' + encodeURIComponent(message) + '&';
        }
        callParams.url += callParams.queryString.join('&');
        return callParams.url;
    };
    /**
     * Indicates whether the search endpoint is using JSONP internally to communicate with the Search API.
     * @returns {boolean} `true` in the search enpoint is using JSONP; `false` otherwise.
     */
    SearchEndpoint.prototype.isJsonp = function () {
        return this.caller.useJsonp;
    };
    /**
     * Performs a search on the index and returns a Promise of [`IQueryResults`]{@link IQueryResults}.
     *
     * This method slightly modifies the query results by adding additional information to each result (id, state object,
     * etc.).
     * @param query The query to execute. Typically, the query object is built using a
     * [`QueryBuilder`]{@link QueryBuilder}.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<IQueryResults>} A Promise of query results.
     */
    SearchEndpoint.prototype.search = function (query, callOptions, callParams) {
        var _this = this;
        Assert_1.Assert.exists(query);
        callParams.requestData = query;
        this.logger.info('Performing REST query', query);
        return this.performOneCall(callParams, callOptions).then(function (results) {
            _this.logger.info('REST query successful', results, query);
            // Version check
            // If the SearchAPI doesn't give us any apiVersion info, we assume version 1 (before apiVersion was implemented)
            if (results.apiVersion == null) {
                results.apiVersion = 1;
            }
            if (results.apiVersion < Version_1.version.supportedApiVersion) {
                _this.logger.error('Please update your REST Search API');
            }
            // If the server specified no search ID generated one using the client-side
            // GUID generator. We prefer server generated guids to allow tracking a query
            // all the way from the analytics to the logs.
            if (Utils_1.Utils.isNullOrEmptyString(results.searchUid)) {
                results.searchUid = QueryUtils_1.QueryUtils.createGuid();
            }
            QueryUtils_1.QueryUtils.setIndexAndUidOnQueryResults(query, results, results.searchUid, results.pipeline, results.splitTestRun);
            QueryUtils_1.QueryUtils.setTermsToHighlightOnQueryResults(query, results);
            return results;
        });
    };
    /**
     * Gets a link / URI to download a query result set to the XLSX format.
     *
     * **Note:**
     * > This method does not automatically download the query result set, but rather provides an URI from which to
     * > download it.
     * @param query The query for which to get the XLSX result set.
     * @param numberOfResults The number of results to download.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {string} The download URI.
     */
    SearchEndpoint.prototype.getExportToExcelLink = function (query, numberOfResults, callOptions, callParams) {
        var queryString = this.buildBaseQueryString(callOptions);
        callParams.queryString = callParams.queryString.concat(queryString);
        queryString = this.buildCompleteQueryString(null, query);
        callParams.queryString = callParams.queryString.concat(queryString);
        if (numberOfResults != null) {
            callParams.queryString.push('numberOfResults=' + numberOfResults);
        }
        callParams.queryString.push('format=xlsx');
        return callParams.url + '?' + callParams.queryString.join('&');
    };
    /**
     * Gets the raw datastream for an item. This is typically used to get a thumbnail for an item.
     *
     * Returns an array buffer.
     *
     * **Example:**
     * ```
     * let rawBinary = String.fromCharCode.apply(null, new Uint8Array(response));
     * img.setAttribute('src', 'data:image/png;base64,' + btoa(rawBinary));
     * ```
     * @param documentUniqueId Typically, the {@link IQueryResult.uniqueId} on each result.
     * @param dataStreamType Normally, `$Thumbnail`.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<TResult>|Promise<U>}
     */
    SearchEndpoint.prototype.getRawDataStream = function (documentUniqueId, dataStreamType, callOptions, callParams) {
        var _this = this;
        Assert_1.Assert.exists(documentUniqueId);
        var queryString = this.buildViewAsHtmlQueryString(documentUniqueId, callOptions);
        callParams.queryString = callParams.queryString.concat(queryString);
        this.logger.info('Performing REST query for datastream ' + dataStreamType + ' on item uniqueID ' + documentUniqueId);
        callParams.queryString.push('dataStream=' + dataStreamType);
        return this.performOneCall(callParams).then(function (results) {
            _this.logger.info('REST query successful', results, documentUniqueId);
            return results;
        });
    };
    /**
     * Gets an URL from which it is possible to see the datastream for an item. This is typically used to get a
     * thumbnail for an item.
     * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
     * @param dataStreamType Normally, `$Thumbnail`.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {string} The datastream URL.
     */
    SearchEndpoint.prototype.getViewAsDatastreamUri = function (documentUniqueID, dataStreamType, callOptions, callParams) {
        callOptions = _.extend({}, callOptions);
        var queryString = this.buildBaseQueryString(callOptions);
        callParams.queryString = callParams.queryString.concat(queryString);
        queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
        callParams.queryString = callParams.queryString.concat(queryString);
        queryString = this.buildCompleteQueryString(callOptions.query, callOptions.queryObject);
        callParams.queryString = callParams.queryString.concat(queryString);
        return callParams.url + '?' + callParams.queryString.join('&') + '&dataStream=' + encodeURIComponent(dataStreamType);
    };
    /**
     * Gets a single item, using its `uniqueId`.
     * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<IQueryResult>} A Promise of the item.
     */
    SearchEndpoint.prototype.getDocument = function (documentUniqueID, callOptions, callParams) {
        var queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
        callParams.queryString = callParams.queryString.concat(queryString);
        return this.performOneCall(callParams);
    };
    /**
     * Gets the content of a single item, as text (think: quickview).
     * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<string>} A Promise of the item content.
     */
    SearchEndpoint.prototype.getDocumentText = function (documentUniqueID, callOptions, callParams) {
        var queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
        callParams.queryString = callParams.queryString.concat(queryString);
        return this.performOneCall(callParams)
            .then(function (data) {
            return data.content;
        });
    };
    /**
     * Gets the content for a single item, as an HTMLDocument (think: quickview).
     * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<HTMLDocument>} A Promise of the item content.
     */
    SearchEndpoint.prototype.getDocumentHtml = function (documentUniqueID, callOptions, callParams) {
        callOptions = _.extend({}, callOptions);
        var queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
        callParams.queryString = callParams.queryString.concat(queryString);
        callParams.requestData = callOptions.queryObject || { q: callOptions.query };
        return this.performOneCall(callParams);
    };
    /**
     * Gets an URL from which it is possible to see a single item content, as HTML (think: quickview).
     * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {string} The URL.
     */
    SearchEndpoint.prototype.getViewAsHtmlUri = function (documentUniqueID, callOptions, callParams) {
        var queryString = this.buildBaseQueryString(callOptions);
        callParams.queryString = callParams.queryString.concat(queryString);
        queryString = this.buildViewAsHtmlQueryString(documentUniqueID, callOptions);
        callParams.queryString = callParams.queryString.concat(queryString);
        callParams.queryString = _.uniq(callParams.queryString);
        return callParams.url + '?' + callParams.queryString.join('&');
    };
    SearchEndpoint.prototype.batchFieldValues = function (request, callOptions, callParams) {
        var _this = this;
        Assert_1.Assert.exists(request);
        return this.performOneCall(callParams)
            .then(function (data) {
            _this.logger.info('REST list field values successful', data.values, request);
            return data.values;
        });
    };
    /**
     * Lists the possible field values for a request.
     * @param request The request for which to list the possible field values.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<TResult>|Promise<U>} A Promise of the field values.
     */
    SearchEndpoint.prototype.listFieldValues = function (request, callOptions, callParams) {
        var _this = this;
        Assert_1.Assert.exists(request);
        callParams.requestData = request;
        this.logger.info('Listing field values', request);
        return this.performOneCall(callParams)
            .then(function (data) {
            _this.logger.info('REST list field values successful', data.values, request);
            return data.values;
        });
    };
    /**
     * Lists all fields for the index, and returns an array of their descriptions.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<TResult>|Promise<U>} A Promise of the index fields and descriptions.
     */
    SearchEndpoint.prototype.listFields = function (callOptions, callParams) {
        this.logger.info('Listing fields');
        return this.performOneCall(callParams).then(function (data) {
            return data.fields;
        });
    };
    /**
     * Lists all available query extensions for the search endpoint.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<IExtension[]>} A Promise of the extensions.
     */
    SearchEndpoint.prototype.extensions = function (callOptions, callParams) {
        this.logger.info('Listing extensions');
        return this.performOneCall(callParams);
    };
    /**
     * Rates a single item in the index (granted that collaborative rating is enabled on your index)
     * @param ratingRequest The item id, and the rating to add.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<boolean>|Promise<T>}
     */
    SearchEndpoint.prototype.rateDocument = function (ratingRequest, callOptions, callParams) {
        this.logger.info('Rating a document', ratingRequest);
        callParams.requestData = ratingRequest;
        return this.performOneCall(callParams).then(function () {
            return true;
        });
    };
    /**
     * Tags a single item.
     * @param taggingRequest The item id, and the tag action to perform.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<boolean>|Promise<T>}
     */
    SearchEndpoint.prototype.tagDocument = function (taggingRequest, callOptions, callParams) {
        this.logger.info('Tagging an item', taggingRequest);
        callParams.requestData = taggingRequest;
        return this.performOneCall(callParams).then(function () {
            return true;
        });
    };
    /**
     * Gets a list of query suggestions for a request.
     * @param request The query, and the number of suggestions to return.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<IQuerySuggestResponse>} A Promise of query suggestions.
     */
    SearchEndpoint.prototype.getQuerySuggest = function (request, callOptions, callParams) {
        this.logger.info('Get Query Suggest', request);
        callParams.requestData = request;
        return this.performOneCall(callParams);
    };
    // This is a non documented method to ensure backward compatibility for the old query suggest call.
    // It simply calls the "real" official and documented method.
    SearchEndpoint.prototype.getRevealQuerySuggest = function (request, callOptions, callParams) {
        return this.getQuerySuggest(request, callOptions, callParams);
    };
    /**
     * Follows an item, or a query result, using the search alerts service.
     * @param request The subscription details.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<ISubscription>}
     */
    SearchEndpoint.prototype.follow = function (request, callOptions, callParams) {
        callParams.requestData = request;
        this.logger.info('Following an item or a query', request);
        return this.performOneCall(callParams);
    };
    /**
     * Gets a Promise of an array of the current subscriptions.
     * @param page The page of the subscriptions.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {any}
     */
    SearchEndpoint.prototype.listSubscriptions = function (page, callOptions, callParams) {
        var _this = this;
        if (this.options.isGuestUser) {
            return new Promise(function (resolve, reject) {
                reject();
            });
        }
        if (this.currentListSubscriptions == null) {
            callParams.queryString.push('page=' + (page || 0));
            this.currentListSubscriptions = this.performOneCall(callParams);
            this.currentListSubscriptions.then(function (data) {
                _this.currentListSubscriptions = null;
                return data;
            }).catch(function (e) {
                // Trap 403 error, as the listSubscription call is called on every page initialization
                // to check for current subscriptions. By default, the search alert service is not enabled for most organization
                // Don't want to pollute the console with un-needed noise and confusion
                if (e.status != 403) {
                    throw e;
                }
            });
        }
        return this.currentListSubscriptions;
    };
    /**
     * Updates a subscription with new parameters.
     * @param subscription The subscription to update with new parameters.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<ISubscription>}
     */
    SearchEndpoint.prototype.updateSubscription = function (subscription, callOptions, callParams) {
        callParams.requestData = subscription;
        this.logger.info('Updating a subscription', subscription);
        callParams.url += subscription.id;
        return this.performOneCall(callParams);
    };
    /**
     * Deletes a subscription.
     * @param subscription The subscription to delete.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<ISubscription>}
     */
    SearchEndpoint.prototype.deleteSubscription = function (subscription, callOptions, callParams) {
        callParams.url += subscription.id;
        return this.performOneCall(callParams);
    };
    SearchEndpoint.prototype.logError = function (sentryLog, callOptions, callParams) {
        callParams.requestData = sentryLog;
        return this.performOneCall(callParams, callOptions)
            .then(function () {
            return true;
        })
            .catch(function () {
            return false;
        });
    };
    SearchEndpoint.prototype.nuke = function () {
        window.removeEventListener('beforeunload', this.onUnload);
    };
    SearchEndpoint.prototype.createEndpointCaller = function () {
        this.caller = new EndpointCaller_1.EndpointCaller(this.options);
    };
    SearchEndpoint.isDebugArgumentPresent = function () {
        return /[?&]debug=1([&]|$)/.test(window.location.search);
    };
    SearchEndpoint.isUseLocalArgumentPresent = function () {
        return /[?&]useLocal=1([&]|$)/.test(window.location.search);
    };
    SearchEndpoint.prototype.handleUnload = function () {
        this.isRedirecting = true;
    };
    SearchEndpoint.prototype.buildBaseUri = function (path) {
        Assert_1.Assert.isString(path);
        var uri = this.options.restUri;
        uri = this.removeTrailingSlash(uri);
        if (Utils_1.Utils.isNonEmptyString(this.options.version)) {
            uri += '/' + this.options.version;
        }
        uri += path;
        return uri;
    };
    SearchEndpoint.prototype.buildSearchAlertsUri = function (path) {
        Assert_1.Assert.isString(path);
        var uri = this.options.searchAlertsUri || this.options.restUri + '/alerts';
        if (uri == null) {
            return null;
        }
        uri = this.removeTrailingSlash(uri);
        uri += path;
        return uri;
    };
    // see https://github.com/palantir/tslint/issues/1421
    // tslint:disable-next-line:no-unused-variable
    SearchEndpoint.prototype.buildAccessToken = function (tokenKey) {
        var queryString = [];
        if (Utils_1.Utils.isNonEmptyString(this.options.accessToken)) {
            queryString.push(tokenKey + '=' + encodeURIComponent(this.options.accessToken));
        }
        return queryString;
    };
    SearchEndpoint.prototype.buildBaseQueryString = function (callOptions) {
        callOptions = _.extend({}, callOptions);
        var queryString = [];
        for (var name_1 in this.options.queryStringArguments) {
            queryString.push(name_1 + '=' + encodeURIComponent(this.options.queryStringArguments[name_1]));
        }
        if (callOptions && _.isArray(callOptions.authentication) && callOptions.authentication.length != 0) {
            queryString.push('authentication=' + callOptions.authentication.join(','));
        }
        return queryString;
    };
    SearchEndpoint.prototype.buildCompleteQueryString = function (query, queryObject) {
        // In an ideal parallel reality, the entire query used in the 'search' call is used here.
        // In this reality however, we must support GET calls (ex: GET /html) for CORS/JSONP/IE reasons.
        // Therefore, we cherry-pick parts of the query to include in a 'query string' instead of a body payload.
        var queryString = [];
        if (queryObject) {
            _.each(['q', 'aq', 'cq', 'dq', 'searchHub', 'tab', 'language', 'pipeline', 'lowercaseOperators'], function (key) {
                if (queryObject[key]) {
                    queryString.push(key + '=' + encodeURIComponent(queryObject[key]));
                }
            });
            _.each(queryObject.context, function (value, key) {
                queryString.push('context[' + key + ']=' + encodeURIComponent(value));
            });
            if (queryObject.fieldsToInclude) {
                queryString.push("fieldsToInclude=[" + _.map(queryObject.fieldsToInclude, function (field) { return '"' + encodeURIComponent(field.replace('@', '')) + '"'; }).join(',') + "]");
            }
        }
        else if (query) {
            queryString.push('q=' + encodeURIComponent(query));
        }
        return queryString;
    };
    SearchEndpoint.prototype.buildViewAsHtmlQueryString = function (uniqueId, callOptions) {
        callOptions = _.extend({}, callOptions);
        var queryString = this.buildBaseQueryString(callOptions);
        queryString.push('uniqueId=' + encodeURIComponent(uniqueId));
        if (callOptions.query || callOptions.queryObject) {
            queryString.push('enableNavigation=true');
        }
        if (callOptions.requestedOutputSize) {
            queryString.push('requestedOutputSize=' + encodeURIComponent(callOptions.requestedOutputSize.toString()));
        }
        if (callOptions.contentType) {
            queryString.push('contentType=' + encodeURIComponent(callOptions.contentType));
        }
        return queryString;
    };
    SearchEndpoint.prototype.performOneCall = function (params, callOptions, autoRenewToken) {
        var _this = this;
        if (autoRenewToken === void 0) { autoRenewToken = true; }
        var queryString = this.buildBaseQueryString(callOptions);
        params.queryString = params.queryString.concat(queryString);
        params.queryString = _.uniq(params.queryString);
        var startTime = new Date();
        return this.caller.call(params)
            .then(function (response) {
            if (response.data == null) {
                response.data = {};
            }
            var timeToExecute = new Date().getTime() - startTime.getTime();
            if (response.data && _.isObject(response.data)) {
                response.data.clientDuration = timeToExecute;
                response.data.duration = response.duration || timeToExecute;
            }
            return response.data;
        }).catch(function (error) {
            if (autoRenewToken && _this.canRenewAccessToken() && _this.isAccessTokenExpiredStatus(error.statusCode)) {
                return _this.renewAccessToken().then(function () {
                    return _this.performOneCall(params, callOptions, autoRenewToken);
                })
                    .catch(function () {
                    return Promise.reject(_this.handleErrorResponse(error));
                });
            }
            else if (error.statusCode == 0 && _this.isRedirecting) {
                // The page is getting redirected
                // Set timeout on return with empty string, since it does not really matter
                _.defer(function () {
                    return '';
                });
            }
            else {
                return Promise.reject(_this.handleErrorResponse(error));
            }
        });
    };
    SearchEndpoint.prototype.handleErrorResponse = function (errorResponse) {
        if (this.isMissingAuthenticationProviderStatus(errorResponse.statusCode)) {
            return new MissingAuthenticationError_1.MissingAuthenticationError(errorResponse.data['provider']);
        }
        else if (errorResponse.data && errorResponse.data.message && errorResponse.data.type) {
            return new QueryError_1.QueryError(errorResponse);
        }
        else if (errorResponse.data && errorResponse.data.message) {
            return new AjaxError_1.AjaxError("Request Error : " + errorResponse.data.message, errorResponse.statusCode);
        }
        else {
            return new AjaxError_1.AjaxError('Request Error', errorResponse.statusCode);
        }
    };
    SearchEndpoint.prototype.canRenewAccessToken = function () {
        return Utils_1.Utils.isNonEmptyString(this.options.accessToken) && _.isFunction(this.options.renewAccessToken);
    };
    SearchEndpoint.prototype.renewAccessToken = function () {
        var _this = this;
        this.logger.info('Renewing expired access token');
        return this.options.renewAccessToken().then(function (token) {
            Assert_1.Assert.isNonEmptyString(token);
            _this.options.accessToken = token;
            _this.createEndpointCaller();
            return token;
        }).catch(function (e) {
            _this.logger.error('Failed to renew access token', e);
            return e;
        });
    };
    SearchEndpoint.prototype.removeTrailingSlash = function (uri) {
        if (this.hasTrailingSlash(uri)) {
            uri = uri.substr(0, uri.length - 1);
        }
        return uri;
    };
    SearchEndpoint.prototype.hasTrailingSlash = function (uri) {
        return uri.charAt(uri.length - 1) == '/';
    };
    SearchEndpoint.prototype.isMissingAuthenticationProviderStatus = function (status) {
        return status == 402;
    };
    SearchEndpoint.prototype.isAccessTokenExpiredStatus = function (status) {
        return status == 419;
    };
    return SearchEndpoint;
}());
/**
 * Contains a map of all initialized `SearchEndpoint` instances.
 *
 * **Example:**
 * > `Coveo.SearchEndpoint.endpoints['default']` returns the default endpoint that was created at initialization.
 * @type {{}}
 */
SearchEndpoint.endpoints = {};
__decorate([
    path('/login/'),
    accessTokenInUrl()
], SearchEndpoint.prototype, "getAuthenticationProviderUri", null);
__decorate([
    path('/'),
    method('POST'),
    responseType('text')
], SearchEndpoint.prototype, "search", null);
__decorate([
    path('/'),
    accessTokenInUrl()
], SearchEndpoint.prototype, "getExportToExcelLink", null);
__decorate([
    path('/datastream'),
    accessTokenInUrl(),
    method('GET'),
    responseType('arraybuffer')
], SearchEndpoint.prototype, "getRawDataStream", null);
__decorate([
    path('/datastream'),
    accessTokenInUrl()
], SearchEndpoint.prototype, "getViewAsDatastreamUri", null);
__decorate([
    path('/document'),
    method('GET'),
    responseType('text')
], SearchEndpoint.prototype, "getDocument", null);
__decorate([
    path('/text'),
    method('GET'),
    responseType('text')
], SearchEndpoint.prototype, "getDocumentText", null);
__decorate([
    path('/html'),
    method('POST'),
    responseType('document')
], SearchEndpoint.prototype, "getDocumentHtml", null);
__decorate([
    path('/html'),
    accessTokenInUrl()
], SearchEndpoint.prototype, "getViewAsHtmlUri", null);
__decorate([
    path('/values'),
    method('POST'),
    responseType('text')
], SearchEndpoint.prototype, "batchFieldValues", null);
__decorate([
    path('/values'),
    method('POST'),
    responseType('text')
], SearchEndpoint.prototype, "listFieldValues", null);
__decorate([
    path('/fields'),
    method('GET'),
    responseType('text')
], SearchEndpoint.prototype, "listFields", null);
__decorate([
    path('/extensions'),
    method('GET'),
    responseType('text')
], SearchEndpoint.prototype, "extensions", null);
__decorate([
    path('/rating'),
    method('POST'),
    responseType('text')
], SearchEndpoint.prototype, "rateDocument", null);
__decorate([
    path('/tag'),
    method('POST'),
    responseType('text')
], SearchEndpoint.prototype, "tagDocument", null);
__decorate([
    path('/querySuggest'),
    method('GET'),
    responseType('text')
], SearchEndpoint.prototype, "getQuerySuggest", null);
__decorate([
    alertsPath('/subscriptions'),
    accessTokenInUrl('accessToken'),
    method('POST'),
    requestDataType('application/json'),
    responseType('text')
], SearchEndpoint.prototype, "follow", null);
__decorate([
    alertsPath('/subscriptions'),
    accessTokenInUrl('accessToken'),
    method('GET'),
    requestDataType('application/json'),
    responseType('text')
], SearchEndpoint.prototype, "listSubscriptions", null);
__decorate([
    alertsPath('/subscriptions/'),
    accessTokenInUrl('accessToken'),
    method('PUT'),
    requestDataType('application/json'),
    responseType('text')
], SearchEndpoint.prototype, "updateSubscription", null);
__decorate([
    alertsPath('/subscriptions/'),
    accessTokenInUrl('accessToken'),
    method('DELETE'),
    requestDataType('application/json'),
    responseType('text')
], SearchEndpoint.prototype, "deleteSubscription", null);
__decorate([
    path('/log'),
    method('POST')
], SearchEndpoint.prototype, "logError", null);
exports.SearchEndpoint = SearchEndpoint;
// It's taken for granted that methods using decorators have :
// IEndpointCallOptions as their second to last parameter
// IEndpointCallParameters as their last parameter
// The default parameters for each member of the injected {@link IEndpointCallParameters} are the following:
// url: '',
// queryString: [],
// requestData: {},
// requestDataType: undefined,
// method: '',
// responseType: '',
// errorsAsSuccess: false
function path(path) {
    return function (target, key, descriptor) {
        var originalMethod = descriptor.value;
        var nbParams = target[key].prototype.constructor.length;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var uri = this.buildBaseUri(path);
            if (args[nbParams - 1]) {
                args[nbParams - 1].url = uri;
            }
            else {
                var params = {
                    url: uri,
                    queryString: [],
                    requestData: {},
                    method: '',
                    responseType: '',
                    errorsAsSuccess: false
                };
                args[nbParams - 1] = params;
            }
            var result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}
function alertsPath(path) {
    return function (target, key, descriptor) {
        var originalMethod = descriptor.value;
        var nbParams = target[key].prototype.constructor.length;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var uri = this.buildSearchAlertsUri(path);
            if (args[nbParams - 1]) {
                args[nbParams - 1].url = uri;
            }
            else {
                var params = {
                    url: uri,
                    queryString: [],
                    requestData: {},
                    method: '',
                    responseType: '',
                    errorsAsSuccess: false
                };
                args[nbParams - 1] = params;
            }
            var result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}
function requestDataType(type) {
    return function (target, key, descriptor) {
        var originalMethod = descriptor.value;
        var nbParams = target[key].prototype.constructor.length;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args[nbParams - 1]) {
                args[nbParams - 1].requestDataType = type;
            }
            else {
                var params = {
                    url: '',
                    queryString: [],
                    requestData: {},
                    requestDataType: type,
                    method: '',
                    responseType: '',
                    errorsAsSuccess: false
                };
                args[nbParams - 1] = params;
            }
            var result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}
function method(met) {
    return function (target, key, descriptor) {
        var originalMethod = descriptor.value;
        var nbParams = target[key].prototype.constructor.length;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args[nbParams - 1]) {
                args[nbParams - 1].method = met;
            }
            else {
                var params = {
                    url: '',
                    queryString: [],
                    requestData: {},
                    method: met,
                    responseType: '',
                    errorsAsSuccess: false
                };
                args[nbParams - 1] = params;
            }
            var result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}
function responseType(resp) {
    return function (target, key, descriptor) {
        var originalMethod = descriptor.value;
        var nbParams = target[key].prototype.constructor.length;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args[nbParams - 1]) {
                args[nbParams - 1].responseType = resp;
            }
            else {
                var params = {
                    url: '',
                    queryString: [],
                    requestData: {},
                    method: '',
                    responseType: resp,
                    errorsAsSuccess: false
                };
                args[nbParams - 1] = params;
            }
            var result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}
function accessTokenInUrl(tokenKey) {
    if (tokenKey === void 0) { tokenKey = 'access_token'; }
    return function (target, key, descriptor) {
        var originalMethod = descriptor.value;
        var nbParams = target[key].prototype.constructor.length;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var queryString = this.buildAccessToken(tokenKey);
            if (args[nbParams - 1]) {
                args[nbParams - 1].queryString = args[nbParams - 1].queryString.concat(queryString);
            }
            else {
                var params = {
                    url: '',
                    queryString: queryString,
                    requestData: {},
                    method: '',
                    responseType: '',
                    errorsAsSuccess: false
                };
                args[nbParams - 1] = params;
            }
            var result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Globalize = __webpack_require__(8);
var merge = function (obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
};
var dict = {
    "Unknown": "Unknown",
    "And": "AND",
    "Authenticating": "Authenticating {0}...",
    "Clear": "Clear {0}",
    "CompleteQuery": "Complete query",
    "Exclude": "Exclude {0}",
    "EnterTag": "Add Tag",
    "Next": "Next",
    "Last": "Last",
    "Link": "Link",
    "Or": "OR",
    "Previous": "Previous",
    "QueryDidntMatchAnyDocuments": "Your query did not match any documents.",
    "QueryException": "Your query has an error: {0}.",
    "Me": "Me",
    "Remove": "Remove",
    "Search": "Search",
    "SearchFor": "Search for {0}",
    "ShareQuery": "Share Query",
    "Preferences": "Preferences",
    "LinkOpeningSettings": "Link opening settings",
    "Reauthenticate": "Reauthenticate {0}",
    "ResultsFilteringExpression": "Results filtering expressions",
    "FiltersInYourPreferences": "Filters in your preferences",
    "Create": "Create",
    "SearchIn": "Search in {0}",
    "Seconds": "in {0} second<pl>s</pl>",
    "ShowingResultsOf": "Result<pl>s</pl> {0}<pl>-{1}</pl> of {2}",
    "SwitchTo": "Switch to {0}",
    "Unexclude": "Unexclude {0}",
    "ClearAllFilters": "Clear All Filters",
    "SkipLogin": "Skip login",
    "LoginInProgress": "Login in progress, please wait ...",
    "Login": "Log In",
    "GetStarted": "Get Started",
    "More": "More",
    "NMore": "{0} more...",
    "Less": "Fewer",
    "Settings": "Settings",
    "Score": "Score",
    "ScoreDescription": "The score is computed from the number of occurrences as well as from the position in the result set.",
    "Occurrences": "Occurrences",
    "OccurrencesDescription": "Sort by number of occurrences, with values having the highest number appearing first.",
    "Label": "Label",
    "Of": "of",
    "LabelDescription": "Sort alphabetically on the field values.",
    "Value": "Value",
    "ValueDescription": "Sort on the values of the first computed field",
    "AlphaAscending": "Value Ascending",
    "AlphaDescending": "Value Descending",
    "ChiSquare": "Chi Square",
    "Nosort": "No Sort",
    "NosortDescription": "Do not sort the values. The values will be returned in a random order.",
    "RelativeFrequency": "Relative Frequency",
    "RelativeFrequencyDescription": "Sort based on the relative frequency of values. Less common values will appear higher.",
    "DateDistribution": "Date distribution",
    "Custom": "Custom",
    "CustomDescription": "Sort based on a custom order",
    "ComputedField": "Computed Field",
    "Ascending": "Ascending",
    "Descending": "Descending",
    "noResultFor": "No results for {0}",
    "autoCorrectedQueryTo": "Query was automatically corrected to {0}",
    "didYouMean": "Did you mean: {0}",
    "SuggestedResults": "Suggested Results",
    "SuggestedQueries": "Suggested Queries",
    "MostRelevantItems": "Most relevant items:",
    "AllItems": "All items:",
    "ShowLess": "Show less",
    "ShowMore": "Show more",
    "HideFacet": "Hide Facet",
    "ShowFacet": "Show Facet",
    "AndOthers": "and {0} other<pl>s</pl>",
    "Others": "{0} other<pl>s</pl>",
    "MostRelevantPosts": "Most Relevant Posts:",
    "CompleteThread": "Complete Thread:",
    "ShowCompleteThread": "Show Complete Thread",
    "ShowOnlyTopMatchingPosts": "Show Only Top Matching Posts",
    "MostRelevantReplies": "Most Relevant Replies:",
    "AllConversation": "All Conversation:",
    "ShowAllConversation": "Show All Conversation",
    "ShowAllReplies": "Show All Replies",
    "ShowOnlyMostRelevantReplies": "Show Only Most Relevant Replies",
    "Close": "Close",
    "Open": "Open",
    "OpenInOutlookWhenPossible": "Open in Outlook (when possible)",
    "AlwaysOpenInNewWindow": "Always open results in new window",
    "Quickview": "Quick View",
    "NoQuickview": "The Quick View for this document is unavailable",
    "ErrorReport": "Error Report",
    "OopsError": "Something went wrong.",
    "ProblemPersists": "If the problem persists contact the administrator.",
    "GoBack": "Go Back",
    "Reset": "Reset",
    "Retry": "Retry",
    "MoreInfo": "More Information",
    "Username": "Username",
    "Password": "Password",
    "PostedBy": "Posted by",
    "CannotConnect": "Cannot connect to the server address.",
    "BadUserPass": "Password does not match with username.",
    "PleaseEnterYourCredentials": "Please enter your credentials for {0}.",
    "PleaseEnterYourSearchPage": "Please enter your search page URL",
    "Collapse": "Collapse",
    "Collapsable": "Collapsible",
    "Expand": "Expand",
    "Today": "Today",
    "Yesterday": "Yesterday",
    "Tomorrow": "Tomorrow",
    "Duration": "Duration: {0}",
    "IndexDuration": "Index Duration: {0}",
    "ProxyDuration": "Proxy Duration: {0}",
    "ClientDuration": "Client Duration: {0}",
    "Unavailable": "Unavailable",
    "Reply": "Reply",
    "ReplyAll": "Reply All",
    "Forward": "Forward",
    "From": "From",
    "Caption": "Caption",
    "Expression": "Expression",
    "Tab": "Tab",
    "Tabs": "Tabs",
    "EnterExpressionName": "Enter expression name",
    "EnterExpressionToFilterWith": "Enter expression to filter results with",
    "SelectTab": "Select Tab",
    "SelectAll": "Select All",
    "PageUrl": "Search page URL",
    "ErrorSavingToDevice": "Error while saving the information to your device",
    "ErrorReadingFromDevice": "Error while reading the information from your device",
    "AppIntro": "Speak with a product specialist who can answer your questions about Coveo and help you decide which Coveo solution is right for you. Or, try a live demo !",
    "TryDemo": "Try the demo",
    "ContactUs": "Contact us",
    "NewToCoveo": "New to Coveo?",
    "LetUsHelpGetStarted": "Let us help you get started",
    "LikesThis": "{0} like<sn>s</sn> this.",
    "CannotConnectSearchPage": "Cannot connect to your search page",
    "AreYouSureDeleteFilter": "Are you sure you want to delete the filter {0} with the expression {1}",
    "OnlineHelp": "Online Help",
    "Done": "Done",
    "SaveFacetState": "Save this facet state",
    "ClearFacetState": "Clear facet state",
    "DisplayingTheOnlyMessage": "Displaying the only message in this conversation",
    "NoNetworkConnection": "No network connection",
    "UnknownConnection": "Unknown connection",
    "EthernetConnection": "Ethernet connection",
    "WiFi": "WiFi connection",
    "CELL": "Cellular connection",
    "CELL_2G": "Cellular 2G connection",
    "CELL_3G": "Cellular 3G connection",
    "CELL_4G": "Cellular 4G connection",
    "Relevance": "Relevance",
    "Date": "Date",
    "Amount": "Amount",
    "QueryExceptionNoException": "No exception",
    "QueryExceptionInvalidSyntax": "Invalid syntax",
    "QueryExceptionInvalidCustomField": "Invalid custom field",
    "QueryExceptionInvalidDate": "Invalid date",
    "QueryExceptionInvalidExactPhrase": "Invalid exact phrase",
    "QueryExceptionInvalidDateOp": "Invalid date operator",
    "QueryExceptionInvalidNear": "Invalid NEAR operator",
    "QueryExceptionInvalidWeightedNear": "Invalid weighted NEAR",
    "QueryExceptionInvalidTerm": "Invalid term",
    "QueryExceptionTooManyTerms": "Too many terms",
    "QueryExceptionWildcardTooGeneral": "Wildcard too general",
    "QueryExceptionInvalidSortField": "Invalid sort field",
    "QueryExceptionInvalidSmallStringOp": "Invalid small string operator",
    "QueryExceptionRequestedResultsMax": "Requested results maximum",
    "QueryExceptionAggregatedMirrorDead": "Aggregated mirror is offline",
    "QueryExceptionAggregatedMirrorQueryTimeOut": "Aggregated mirror query timeout",
    "QueryExceptionAggregatedMirrorInvalidBuildNumber": "Aggregated mirror invalid build number",
    "QueryExceptionAggregatedMirrorCannotConnect": "Aggregated mirror cannot connect",
    "QueryExceptionNotEnoughLeadingCharsWildcard": "Not enough leading character wildcard",
    "QueryExceptionSecurityInverterNotFound": "Security inverter not found",
    "QueryExceptionSecurityInverterAccessDenied": "Security inverter access denied",
    "QueryExceptionAggregatedMirrorCannotImpersonate": "Aggregated mirror cannot impersonate",
    "QueryExceptionUnexpected": "Unexpected",
    "QueryExceptionAccessDenied": "Access denied",
    "QueryExceptionSuperUserTokenInvalid": "Super user token invalid",
    "QueryExceptionSuperUserTokenExpired": "Super user token is expired",
    "QueryExceptionLicenseQueriesExpired": "Queries license expired",
    "QueryExceptionLicenseSuperUserTokenNotSupported": "License super user token not supported",
    "QueryExceptionInvalidSession": "Invalid session",
    "QueryExceptionInvalidDocument": "Invalid document",
    "QueryExceptionSearchDisabled": "Search disabled",
    "FileType": "File type",
    "ShowAttachment": "Show attachment",
    "OnFeed": "on {0}'s feed.",
    "Author": "Author",
    "NoTitle": "No title",
    "CurrentSelections": "Current selections",
    "AllContent": "All content",
    "CancelLastAction": "Cancel last action",
    "SearchTips": "Search tips",
    "CheckSpelling": "Check the spelling of your keywords.",
    "TryUsingFewerKeywords": "Try using fewer, different or more general keywords.",
    "SelectFewerFilters": "Select fewer filters to broaden your search.",
    "Document": "Document",
    "Time": "Time",
    "StartDate": "Start Date",
    "StartTime": "Start Time",
    "DurationTitle": "Duration",
    "UserQuery": "User query",
    "ShowUserActions": "Show User Actions",
    "NoData": "No data available",
    "EventType": "Event type",
    "GoToFullSearch": "Full search",
    "GoToEdition": "Customize Panel",
    "RemoveContext": "Remove context",
    "BoxAttachToCase": "Attach to case",
    "AttachToCase": "Attach to case",
    "Attach": "Attach",
    "Attached": "Attached",
    "Detach": "Detach",
    "Details": "Details",
    "AdditionalFilters": "Additional filters",
    "SelectNonContextualSearch": "Remove the context from the current record to broaden your search",
    "CopyPasteToSupport": "Copy paste this message to Coveo Support team for more information.",
    "FollowQueryDescription": "Alert me for changes to the search results of this query.",
    "SearchAlerts_Panel": "Manage Alerts",
    "SearchAlerts_PanelDescription": "View and manage your search alerts.",
    "SearchAlerts_PanelNoSearchAlerts": "You have no subscriptions.",
    "SearchAlerts_Fail": "The Search Alerts service is currently unavailable.",
    "SearchAlerts_Type": "Type",
    "SearchAlerts_Content": "Content",
    "SearchAlerts_Actions": "Action",
    "EmptyQuery": "&lt;empty&gt;",
    "SearchAlerts_Type_followQuery": "Query",
    "SearchAlerts_Type_followDocument": "Item",
    "SearchAlerts_unFollowing": "Stop Following",
    "SearchAlerts_follow": "Follow",
    "SearchAlerts_followed": "Followed",
    "SearchAlerts_followQuery": "Follow Query",
    "Subscription_StopFollowingQuery": "Stop Following Query",
    "SearchAlerts_Frequency": "When",
    "SubscriptionsManageSubscriptions": "Manage Alerts",
    "SubscriptionsMessageFollowQuery": "You will receive alerts when the query <b>{0}</b> returns new or updated items.",
    "SubscriptionsMessageFollow": "You will receive alerts for changes to the item <b>{0}</b>.",
    "Expiration": "Expiration",
    "Monthly": "Monthly",
    "Daily": "Daily",
    "Monday": "Monday",
    "Tuesday": "Tuesday",
    "Wednesday": "Wednesday",
    "Thursday": "Thursday",
    "Friday": "Friday",
    "Saturday": "Saturday",
    "Sunday": "Sunday",
    "NextDay": "Next {0}",
    "LastDay": "Last {0}",
    "StartTypingCaseForSuggestions": "Describe your problem to see possible solutions",
    "ExportToExcel": "Export to Excel",
    "ExportToExcelDescription": "Export search results to Excel",
    "CaseCreationNoResults": "No recommended solutions were found",
    "SortBy": "Sort by",
    "BoxCreateArticle": "Create Article",
    "Facets": "Facets",
    "AdvancedSearch": "Advanced Search",
    "Keywords": "Keywords",
    "AllTheseWords": "All these words",
    "ExactPhrase": "This exact phrase",
    "AnyOfTheseWords": "Any of these words",
    "NoneOfTheseWords": "None of these words",
    "Anytime": "Anytime",
    "InTheLast": "In the last",
    "Days": "days",
    "Months": "months",
    "Month": "Month",
    "Year": "Year",
    "Between": "Between",
    "Language": "Language",
    "Size": "Size",
    "AtLeast": "at least",
    "AtMost": "at most",
    "Contains": "contains",
    "DoesNotContain": "does not contain",
    "Matches": "matches",
    "Bytes": "bytes",
    "list": "List",
    "card": "Card",
    "table": "Table",
    "ResultLinks": "Result links",
    "EnableQuerySyntax": "Enable query syntax",
    "On": "On",
    "Off": "Off",
    "Automatic": "Automatic",
    "ResultsPerPage": "Results per page",
    "FiltersInAdvancedSearch": "Filters in Advanced Search",
    "InvalidTimeRange": "Invalid time range",
    "PreviousMonth": "Previous month",
    "NextMonth": "Next month",
    "Title": "Title",
    "objecttype_people": "People",
    "objecttype_message": "Message",
    "objecttype_feed": "RSS Feed",
    "objecttype_thread": "Thread",
    "objecttype_file": "File",
    "objecttype_board": "Board",
    "objecttype_category": "Category",
    "objecttype_account": "Account",
    "objecttype_annotation": "Note",
    "objecttype_campaign": "Campaign",
    "objecttype_case": "Case",
    "objecttype_contentversion": "Salesforce File",
    "objecttype_contact": "Contact",
    "objecttype_contract": "Contract",
    "objecttype_event": "Event",
    "objecttype_email": "Email",
    "objecttype_goal": "Goal",
    "objecttype_incident": "Case",
    "objecttype_invoice": "Invoice",
    "objecttype_lead": "Lead",
    "objecttype_list": "Marketing List",
    "objecttype_solution": "Solution",
    "objecttype_task": "Task",
    "objecttype_user": "User",
    "objecttype_attachment": "Attachment",
    "objecttype_casecomment": "Case Comment",
    "objecttype_opportunity": "Opportunity",
    "objecttype_opportunityproduct": "Opportunity Product",
    "objecttype_feeditem": "Chatter",
    "objecttype_feedcomment": "Chatter",
    "objecttype_note": "Note",
    "objecttype_product": "Product",
    "objecttype_partner": "Partner",
    "objecttype_queueitem": "Queue Item",
    "objecttype_quote": "Quote",
    "objecttype_salesliterature": "Sales Literature",
    "objecttype_salesorder": "Sales Order",
    "objecttype_service": "Service",
    "objecttype_socialprofile": "Social Profile",
    "objecttype_kbdocumentation": "Documentation",
    "objecttype_kbtechnicalarticle": "Documentation",
    "objecttype_kbsolution": "Solution",
    "objecttype_kbknowledgearticle": "Knowledge Article",
    "objecttype_kbattachment": "Attachment",
    "objecttype_kbarticle": "Article",
    "objecttype_kbarticlecomment": "Article Comment",
    "objecttype_knowledgearticle": "Knowledge Article",
    "filetype_box user": "Box User",
    "filetype_html": "HTML File",
    "filetype_wiki": "Wiki",
    "filetype_webscraperwebpage": "Web Page",
    "filetype_image": "Image",
    "filetype_folder": "Folder",
    "filetype_txt": "Text",
    "filetype_zip": "Zip File",
    "filetype_olefile": "OLE file",
    "filetype_gmailmessage": "Gmail Message",
    "filetype_pdf": "PDF File",
    "filetype_swf": "Flash File",
    "filetype_xml": "XML File",
    "filetype_vsd": "Visio",
    "filetype_svg": "SVG",
    "filetype_svm": "Open Office",
    "filetype_rssitem": "RSS feed",
    "filetype_doc": "Document",
    "filetype_docx": "Microsoft Word Document",
    "filetype_xls": "Spreadsheet Document",
    "filetype_ppt": "Presentation Document",
    "filetype_video": "Video",
    "filetype_youtube": "YouTube video",
    "filetype_saleforceitem": "Salesforce",
    "filetype_dynamicscrmitem": "Dynamics CRM",
    "filetype_salesforceitem": "Salesforce",
    "filetype_odt": "Open Text Document",
    "filetype_box": "User",
    "filetype_jiraissue": "Jira Issue",
    "filetype_cfpage": "Confluence Page",
    "filetype_cfcomment": "Confluence Comment",
    "filetype_cfspace": "Confluence Space",
    "filetype_cfblogentry": "Confluence Blog Entry",
    "filetype_confluencespace": "Confluence Space",
    "filetype_exchangemessage": "Message",
    "filetype_exchangeappointment": "Appointment",
    "filetype_exchangenote": "Note",
    "filetype_exchangetask": "Task",
    "filetype_exchangeperson": "Exchange User",
    "filetype_activedirperson": "Active Directory User",
    "filetype_exchangeactivity": "Activity",
    "filetype_exchangecalendarmessage": "Calendar Message",
    "filetype_exchangedocument": "Exchange Document",
    "filetype_exchangedsn": "DSN",
    "filetype_exchangefreebusy": "Free/Busy",
    "filetype_exchangegroup": "Group",
    "filetype_exchangerssfeed": "RSS Feed",
    "filetype_exchangejunkmessage": "Junk Email",
    "filetype_exchangeofficecom": "Communications",
    "filetype_lithiummessage": "Lithium Message",
    "filetype_lithiumthread": "Lithium Thread",
    "filetype_lithiumboard": "Lithium Board",
    "filetype_lithiumcategory": "Lithium Category",
    "filetype_lithiumcommunity": "Lithium Community",
    "filetype_spportal": "Portal",
    "filetype_spsite": "Site",
    "filetype_spuserprofile": "SharePoint User",
    "filetype_sparea": "Area",
    "filetype_spannouncement": "Announcement",
    "filetype_spannouncementlist": "Announcements",
    "filetype_spcontact": "Contact",
    "filetype_spcontactlist": "Contacts",
    "filetype_spcustomlist": "Custom Lists",
    "filetype_spdiscussionboard": "Discussion Board",
    "filetype_spdiscussionboardlist": "Discussion Boards",
    "filetype_spdocumentlibrarylist": "Document Library",
    "filetype_spevent": "Event",
    "filetype_speventlist": "Events",
    "filetype_spformlibrarylist": "Form Library",
    "filetype_spissue": "Issue",
    "filetype_spissuelist": "Issues",
    "filetype_splink": "Link",
    "filetype_splinklist": "Links",
    "filetype_sppicturelibrarylist": "Picture Library",
    "filetype_spsurvey": "Survey",
    "filetype_spsurveylist": "Surveys",
    "filetype_sptask": "Task",
    "filetype_sptasklist": "Tasks",
    "filetype_spagenda": "Agenda",
    "filetype_spagendalist": "Ordres du jour",
    "filetype_spattendee": "Attendee",
    "filetype_spattendeelist": "Attendees",
    "filetype_spcustomgridlist": "Custom Grids",
    "filetype_spdecision": "Decision",
    "filetype_spdecisionlist": "Decisions",
    "filetype_spobjective": "Objective",
    "filetype_spobjectivelist": "Objectives",
    "filetype_sptextbox": "Textbox",
    "filetype_sptextboxlist": "Textbox list",
    "filetype_spthingstobring": "Thing To Bring",
    "filetype_spthingstobringlist": "Things To Bring",
    "filetype_sparealisting": "Area Listing",
    "filetype_spmeetingserie": "Meeting series",
    "filetype_spmeetingserielist": "Meeting Series List",
    "filetype_spsitedirectory": "Site Directory Item",
    "filetype_spsitedirectorylist": "Site Directory",
    "filetype_spdatasource": "Data Source",
    "filetype_spdatasourcelist": "Data Source List",
    "filetype_splisttemplatecataloglist": "List Template Gallery",
    "filetype_spwebpartcataloglist": "WebPart Gallery",
    "filetype_spwebtemplatecataloglist": "Site Template Gallery",
    "filetype_spworkspacepagelist": "Workspace Pages",
    "filetype_spunknownlist": "Custom List",
    "filetype_spadministratortask": "Administrator Task",
    "filetype_spadministratortasklist": "Administrator Tasks",
    "filetype_spareadocumentlibrarylist": "Area Document Library",
    "filetype_spblogcategory": "Blog Category",
    "filetype_spblogcategorylist": "Blog Categories",
    "filetype_spblogcomment": "Blog Comment",
    "filetype_spblogcommentlist": "Blog Comments",
    "filetype_spblogpost": "Blog Post",
    "filetype_spblogpostlist": "Blog Posts",
    "filetype_spdataconnectionlibrarylist": "Data Connection Library",
    "filetype_spdistributiongroup": "Distribution Group",
    "filetype_spdistributiongrouplist": "Distribution Groups",
    "filetype_spipfslist": "InfoPath Forms Servers",
    "filetype_spkeyperformanceindicator": "Key Performance Indicator",
    "filetype_spkeyperformanceindicatorlist": "Key Performance Indicators",
    "filetype_splanguagesandtranslator": "Languages and Translator",
    "filetype_splanguagesandtranslatorlist": "Languages and Translators",
    "filetype_spmasterpagescataloglist": "Master Page Gallery",
    "filetype_spnocodeworkflowlibrarylist": "No-code Workflow Libraries",
    "filetype_spprojecttask": "Project Task",
    "filetype_spprojecttasklist": "Project Tasks",
    "filetype_sppublishingpageslibrarylist": "Page Library",
    "filetype_spreportdocumentlibrarylist": "Report Document Library",
    "filetype_spreportlibrarylist": "Report Library",
    "filetype_spslidelibrarylist": "Slide Library",
    "filetype_sptab": "Tabs",
    "filetype_sptablist": "Tabs List",
    "filetype_sptranslationmanagementlibrarylist": "Translation Management Library",
    "filetype_spuserinformation": "User Information",
    "filetype_spuserinformationlist": "User Information List",
    "filetype_spwikipagelibrarylist": "Wiki Page Library",
    "filetype_spworkflowhistory": "Workflow History",
    "filetype_spworkflowhistorylist": "Workflow History List",
    "filetype_spworkflowprocess": "Custom Workflow Process",
    "filetype_spworkflowprocesslist": "Custom Workflow Processes",
    "filetype_sppublishingimageslibrarylist": "Publishing Image Library",
    "filetype_spcirculation": "Circulation",
    "filetype_spcirculationlist": "Circulations",
    "filetype_spdashboardslibrarylist": "Dashboards Library",
    "filetype_spdataconnectionforperformancepointlibrarylist": "PerformancePoint Data Connection Library",
    "filetype_sphealthreport": "Health Report",
    "filetype_sphealthreportlist": "Health Reports",
    "filetype_sphealthrule": "Health Rule",
    "filetype_sphealthrulelist": "Health Rules",
    "filetype_spimedictionary": "IME Dictionary",
    "filetype_spimedictionarylist": "IME Dictionaries",
    "filetype_spperformancepointcontent": "PerformancePoint Content",
    "filetype_spperformancepointcontentlist": "PerformancePoint Contents",
    "filetype_spphonecallmemo": "Phone Call Memo",
    "filetype_spphonecallmemolist": "Phone Call Memos",
    "filetype_sprecordlibrarylist": "Record Library",
    "filetype_spresource": "Resource",
    "filetype_spresourcelist": "Resources",
    "filetype_spprocessdiagramslibrarylist": "Process Diagram Library",
    "filetype_spsitethemeslibrarylist": "Site Theme Library",
    "filetype_spsolutionslibrarylist": "Solution Library",
    "filetype_spwfpublibrarylist": "WFPUB Library",
    "filetype_spwhereabout": "Whereabout",
    "filetype_spwhereaboutlist": "Whereabouts",
    "filetype_spdocumentlink": "Link to a Document",
    "filetype_spdocumentset": "Document Set",
    "filetype_spmicrofeedpost": "Microfeed Post",
    "filetype_spmicrofeedlist": "Microfeed",
    "filetype_splistfolder": "List Folder",
    "filetype_youtubevideo": "YouTube video",
    "filetype_youtubeplaylistitem": "YouTube playlist item",
};
function defaultLanguage() {
    var locales = String["locales"] || (String["locales"] = {});
    locales["en"] = merge(locales["en"], dict);
    String["toLocaleString"].call(this, { "en": dict });
    String["locale"] = "en";
    String["defaultLocale"] = "en";
    Globalize.culture("en");
}
exports.defaultLanguage = defaultLanguage;
function setLanguageAfterPageLoaded() {
    var locales = String["locales"] || (String["locales"] = {});
    locales["en"] = merge(locales["en"], dict);
    String["toLocaleString"].call(this, { "en": dict });
    String["locale"] = "en";
    String["defaultLocale"] = "en";
    Globalize.culture("en");
}
exports.setLanguageAfterPageLoaded = setLanguageAfterPageLoaded;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(0);
__webpack_require__(9);
exports.MEDIUM_SCREEN_WIDTH = 800;
exports.SMALL_SCREEN_WIDTH = 480;
/**
 * This class serves as a way to get and set the different screen size breakpoints for the interface.
 *
 * By settings those, you can impact, amongst other, the {@link Facet}, {@link Tab} or {@link ResultList} behaviour.
 *
 * For example, the {@link Facet} components of your interface will switch to a dropdown menu when the screen size reaches 800px or less.
 *
 * You could modify this value using this calls
 *
 * Normally, you would interact with this class using the instance bound to {@link SearchInterface.responsiveComponents}
 */
var ResponsiveComponents = (function () {
    function ResponsiveComponents(windoh) {
        if (windoh === void 0) { windoh = window; }
        this.windoh = windoh;
    }
    /**
     * Set the breakpoint for small screen size.
     * @param width
     */
    ResponsiveComponents.prototype.setSmallScreenWidth = function (width) {
        Assert_1.Assert.check(width < this.getMediumScreenWidth(), "Cannot set small screen width (" + width + ") larger or equal to the current medium screen width (" + this.getMediumScreenWidth() + ")");
        this.smallScreenWidth = width;
    };
    /**
     * Set the breakpoint for medium screen size
     * @param width
     */
    ResponsiveComponents.prototype.setMediumScreenWidth = function (width) {
        Assert_1.Assert.check(width > this.getSmallScreenWidth(), "Cannot set medium screen width (" + width + ") smaller or equal to the current small screen width (" + this.getSmallScreenWidth() + ")");
        this.mediumScreenWidth = width;
    };
    /**
     * Get the current breakpoint for small screen size.
     *
     * If it was not explicitly set by {@link ResponsiveComponents.setSmallScreenWidth}, the default value is `480`.
     * @returns {number}
     */
    ResponsiveComponents.prototype.getSmallScreenWidth = function () {
        if (this.smallScreenWidth == null) {
            return exports.SMALL_SCREEN_WIDTH;
        }
        return this.smallScreenWidth;
    };
    /**
     * Get the current breakpoint for medium screen size.
     *
     * If it was not explicitly set by {@link ResponsiveComponents.setMediumScreenWidth}, the default value is `800`.
     * @returns {number}
     */
    ResponsiveComponents.prototype.getMediumScreenWidth = function () {
        if (this.mediumScreenWidth == null) {
            return exports.MEDIUM_SCREEN_WIDTH;
        }
        return this.mediumScreenWidth;
    };
    /**
     * Return true if the current screen size is smaller than the current breakpoint set for small screen width.
     * @returns {boolean}
     */
    ResponsiveComponents.prototype.isSmallScreenWidth = function () {
        if (this.windoh['clientWidth'] != null) {
            return this.windoh['clientWidth'] <= this.getSmallScreenWidth();
        }
        else {
            return document.body.clientWidth <= this.getSmallScreenWidth();
        }
    };
    /**
     * Return true if the current screen size is smaller than the current breakpoint set for medium screen width.
     * @returns {boolean}
     */
    ResponsiveComponents.prototype.isMediumScreenWidth = function () {
        if (this.isSmallScreenWidth()) {
            return false;
        }
        if (this.windoh['clientWidth'] != null) {
            return this.windoh['clientWidth'] <= this.getMediumScreenWidth();
        }
        return document.body.clientWidth <= this.getMediumScreenWidth();
    };
    /**
     * Return true if the current screen size is larger than the current breakpoint set for medium and small.
     * @returns {boolean}
     */
    ResponsiveComponents.prototype.isLargeScreenWidth = function () {
        return !this.isSmallScreenWidth() && !this.isMediumScreenWidth();
    };
    return ResponsiveComponents;
}());
exports.ResponsiveComponents = ResponsiveComponents;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Not sure about this : In year 2033 who's to say that this list won't be 50 pages long !
var ResponsiveComponents_1 = __webpack_require__(21);
var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var DeviceUtils = (function () {
    function DeviceUtils() {
    }
    DeviceUtils.getDeviceName = function (userAgent) {
        if (userAgent === void 0) { userAgent = navigator.userAgent; }
        if (userAgent.match(/Edge/i)) {
            return 'Edge';
        }
        if (userAgent.match(/Opera Mini/i)) {
            return 'Opera Mini';
        }
        if (userAgent.match(/Android/i)) {
            return 'Android';
        }
        if (userAgent.match(/BlackBerry/i)) {
            return 'BlackBerry';
        }
        if (userAgent.match(/iPhone/i)) {
            return 'iPhone';
        }
        if (userAgent.match(/iPad/i)) {
            return 'iPad';
        }
        if (userAgent.match(/iPod/i)) {
            return 'iPod';
        }
        if (userAgent.match(/Chrome/i)) {
            return 'Chrome';
        }
        if (userAgent.match(/MSIE/i) || userAgent.match(/Trident/i)) {
            return 'IE';
        }
        if (userAgent.match(/Opera/i)) {
            return 'Opera';
        }
        if (userAgent.match(/Firefox/i)) {
            return 'Firefox';
        }
        if (userAgent.match(/Safari/i)) {
            return 'Safari';
        }
        return 'Others';
    };
    DeviceUtils.isAndroid = function () {
        return DeviceUtils.getDeviceName() == 'Android';
    };
    DeviceUtils.isIos = function () {
        var deviceName = DeviceUtils.getDeviceName();
        return deviceName == 'iPhone' || deviceName == 'iPad' || deviceName == 'iPod';
    };
    DeviceUtils.isMobileDevice = function () {
        return mobile;
    };
    /**
     * @deprecated
     *
     * Use ResponsiveComponents.isSmallScreenWidth() instead
     */
    DeviceUtils.isSmallScreenWidth = function () {
        return new ResponsiveComponents_1.ResponsiveComponents().isSmallScreenWidth();
    };
    return DeviceUtils;
}());
exports.DeviceUtils = DeviceUtils;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(0);
var Utils_1 = __webpack_require__(2);
var _ = __webpack_require__(1);
var QueryUtils = (function () {
    function QueryUtils() {
    }
    QueryUtils.createGuid = function () {
        var guid;
        var success = false;
        if ((typeof (crypto) != 'undefined' && typeof (crypto.getRandomValues) != 'undefined')) {
            try {
                guid = QueryUtils.generateWithCrypto();
                success = true;
            }
            catch (e) {
                success = false;
            }
        }
        if (!success) {
            guid = QueryUtils.generateWithRandom();
        }
        return guid;
    };
    // This method is a fallback as it's generate a lot of collisions in Chrome.
    QueryUtils.generateWithRandom = function () {
        // http://stackoverflow.com/a/2117523
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    QueryUtils.generateWithCrypto = function () {
        var buf = new Uint16Array(8);
        crypto.getRandomValues(buf);
        var S4 = function (num) {
            var ret = num.toString(16);
            while (ret.length < 4) {
                ret = '0' + ret;
            }
            return ret;
        };
        return (S4(buf[0]) + S4(buf[1]) + '-' + S4(buf[2]) + '-' + S4(buf[3]) + '-' + S4(buf[4]) + '-' + S4(buf[5]) + S4(buf[6]) + S4(buf[7]));
    };
    QueryUtils.setStateObjectOnQueryResults = function (state, results) {
        QueryUtils.setPropertyOnResults(results, 'state', state);
    };
    QueryUtils.setStateObjectOnQueryResult = function (state, result) {
        QueryUtils.setPropertyOnResult(result, 'state', state);
    };
    QueryUtils.setSearchInterfaceObjectOnQueryResult = function (searchInterface, result) {
        QueryUtils.setPropertyOnResult(result, 'searchInterface', searchInterface);
    };
    QueryUtils.setIndexAndUidOnQueryResults = function (query, results, queryUid, pipeline, splitTestRun) {
        Assert_1.Assert.exists(query);
        Assert_1.Assert.exists(results);
        var index = query.firstResult;
        QueryUtils.setPropertyOnResults(results, 'queryUid', queryUid);
        QueryUtils.setPropertyOnResults(results, 'pipeline', pipeline);
        QueryUtils.setPropertyOnResults(results, 'splitTestRun', splitTestRun);
        QueryUtils.setPropertyOnResults(results, 'index', index, function () { return ++index; });
    };
    QueryUtils.setTermsToHighlightOnQueryResults = function (query, results) {
        QueryUtils.setPropertyOnResults(results, 'termsToHighlight', results.termsToHighlight);
        QueryUtils.setPropertyOnResults(results, 'phrasesToHighlight', results.phrasesToHighlight);
    };
    QueryUtils.splitFlags = function (flags, delimiter) {
        if (delimiter === void 0) { delimiter = ';'; }
        Assert_1.Assert.exists(flags);
        return flags.split(delimiter);
    };
    QueryUtils.isAttachment = function (result) {
        return _.contains(QueryUtils.splitFlags(result.flags), 'IsAttachment');
    };
    QueryUtils.containsAttachment = function (result) {
        return _.contains(QueryUtils.splitFlags(result.flags), 'ContainsAttachment');
    };
    QueryUtils.hasHTMLVersion = function (result) {
        return _.contains(QueryUtils.splitFlags(result.flags), 'HasHtmlVersion');
    };
    QueryUtils.hasThumbnail = function (result) {
        return _.contains(QueryUtils.splitFlags(result.flags), 'HasThumbnail');
    };
    QueryUtils.hasExcerpt = function (result) {
        return result.excerpt != undefined && result.excerpt != '';
    };
    QueryUtils.getAuthor = function (result) {
        return result.raw['author'];
    };
    QueryUtils.getUriHash = function (result) {
        return result.raw['urihash'];
    };
    QueryUtils.getObjectType = function (result) {
        return result.raw['objecttype'];
    };
    QueryUtils.getCollection = function (result) {
        return result.raw['collection'];
    };
    QueryUtils.getSource = function (result) {
        return result.raw['source'];
    };
    QueryUtils.getLanguage = function (result) {
        return result.raw['language'];
    };
    QueryUtils.getPermanentId = function (result) {
        var fieldValue;
        var fieldUsed;
        var permanentId = Utils_1.Utils.getFieldValue(result, 'permanentid');
        if (permanentId) {
            fieldUsed = 'permanentid';
            fieldValue = permanentId;
        }
        else {
            fieldUsed = 'urihash';
            fieldValue = Utils_1.Utils.getFieldValue(result, 'urihash');
        }
        return {
            fieldValue: fieldValue,
            fieldUsed: fieldUsed
        };
    };
    QueryUtils.quoteAndEscapeIfNeeded = function (str) {
        Assert_1.Assert.isString(str);
        return QueryUtils.isAtomicString(str) || (QueryUtils.isRangeString(str) || QueryUtils.isRangeWithoutOuterBoundsString(str)) ? str : QueryUtils.quoteAndEscape(str);
    };
    QueryUtils.quoteAndEscape = function (str) {
        Assert_1.Assert.isString(str);
        return "\"" + QueryUtils.escapeString(str) + "\"";
    };
    QueryUtils.escapeString = function (str) {
        Assert_1.Assert.isString(str);
        return str.replace(/"/g, ' ');
    };
    QueryUtils.isAtomicString = function (str) {
        Assert_1.Assert.isString(str);
        return /^\d+(\.\d+)?$|^[\d\w]+$/.test(str);
    };
    QueryUtils.isRangeString = function (str) {
        Assert_1.Assert.isString(str);
        return /^\d+(\.\d+)?\.\.\d+(\.\d+)?$|^\d{4}\/\d{2}\/\d{2}@\d{2}:\d{2}:\d{2}\.\.\d{4}\/\d{2}\/\d{2}@\d{2}:\d{2}:\d{2}$/.test(str);
    };
    QueryUtils.isRangeWithoutOuterBoundsString = function (str) {
        Assert_1.Assert.isString(str);
        return /^\d+(\.\d+)?$|^\d{4}\/\d{2}\/\d{2}@\d{2}:\d{2}:\d{2}$/.test(str);
    };
    QueryUtils.buildFieldExpression = function (field, operator, values) {
        Assert_1.Assert.isNonEmptyString(field);
        Assert_1.Assert.stringStartsWith(field, '@');
        Assert_1.Assert.isNonEmptyString(operator);
        Assert_1.Assert.isLargerOrEqualsThan(1, values.length);
        if (values.length == 1) {
            return field + operator + QueryUtils.quoteAndEscapeIfNeeded(values[0]);
        }
        else {
            return field + operator + '(' + _.map(values, function (str) { return QueryUtils.quoteAndEscapeIfNeeded(str); }).join(',') + ')';
        }
    };
    QueryUtils.buildFieldNotEqualExpression = function (field, values) {
        Assert_1.Assert.isNonEmptyString(field);
        Assert_1.Assert.stringStartsWith(field, '@');
        Assert_1.Assert.isLargerOrEqualsThan(1, values.length);
        var filter;
        if (values.length == 1) {
            filter = field + '==' + QueryUtils.quoteAndEscapeIfNeeded(values[0]);
        }
        else {
            filter = field + '==' + '(' + _.map(values, function (str) { return QueryUtils.quoteAndEscapeIfNeeded(str); }).join(',') + ')';
        }
        return '(NOT ' + filter + ')';
    };
    QueryUtils.mergeQueryString = function (url, queryString) {
        var queryStringPosition = url.indexOf('?');
        if (queryStringPosition != -1) {
            url += '&' + queryString;
        }
        else {
            url += '?' + queryString;
        }
        return url;
    };
    QueryUtils.mergePath = function (url, path) {
        var urlSplit = url.split('?');
        return urlSplit[0] + path + '?' + (urlSplit[1] || '');
    };
    QueryUtils.setPropertyOnResults = function (results, property, value, afterOneLoop) {
        _.each(results.results, function (result) {
            QueryUtils.setPropertyOnResult(result, property, value);
            value = afterOneLoop ? afterOneLoop() : value;
        });
    };
    QueryUtils.setPropertyOnResult = function (result, property, value) {
        result[property] = value;
        _.each(result.childResults, function (child) {
            child[property] = value;
        });
        if (!Utils_1.Utils.isNullOrUndefined(result.parentResult)) {
            result.parentResult[property] = value;
        }
    };
    // http://stackoverflow.com/a/11582513
    QueryUtils.getUrlParameter = function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null;
    };
    QueryUtils.isStratusAgnosticField = function (fieldToVerify, fieldToMatch) {
        var checkForSystem = /^(@?)(sys)?(.*)/i;
        var matchFieldToVerify = checkForSystem.exec(fieldToVerify);
        var matchFieldToMatch = checkForSystem.exec(fieldToMatch);
        if (matchFieldToVerify && matchFieldToMatch) {
            return (matchFieldToVerify[1] + matchFieldToVerify[3]).toLowerCase() == (matchFieldToMatch[1] + matchFieldToMatch[3]).toLowerCase();
        }
        return false;
    };
    return QueryUtils;
}());
exports.QueryUtils = QueryUtils;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(0);
var TimeSpan = (function () {
    function TimeSpan(time, isMilliseconds) {
        if (isMilliseconds === void 0) { isMilliseconds = true; }
        if (isMilliseconds) {
            this.milliseconds = time;
        }
        else {
            this.milliseconds = time * 1000;
        }
    }
    TimeSpan.prototype.getMilliseconds = function () {
        return this.milliseconds;
    };
    TimeSpan.prototype.getSeconds = function () {
        return this.getMilliseconds() / 1000;
    };
    TimeSpan.prototype.getMinutes = function () {
        return this.getSeconds() / 60;
    };
    TimeSpan.prototype.getHours = function () {
        return this.getMinutes() / 60;
    };
    TimeSpan.prototype.getDays = function () {
        return this.getHours() / 24;
    };
    TimeSpan.prototype.getWeeks = function () {
        return this.getDays() / 7;
    };
    TimeSpan.prototype.getHHMMSS = function () {
        var hours = Math.floor(this.getHours());
        var minutes = Math.floor(this.getMinutes()) % 60;
        var seconds = Math.floor(this.getSeconds()) % 60;
        var hoursString, minutesString, secondsString;
        if (hours == 0) {
            hoursString = '';
        }
        else {
            hoursString = hours < 10 ? '0' + hours.toString() : hours.toString();
        }
        minutesString = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
        secondsString = seconds < 10 ? '0' + seconds.toString() : seconds.toString();
        var hhmmss = (hoursString != '' ? hoursString + ':' : '') + minutesString + ':' + secondsString;
        return hhmmss;
    };
    TimeSpan.fromDates = function (from, to) {
        Assert_1.Assert.exists(from);
        Assert_1.Assert.exists(to);
        return new TimeSpan(to.valueOf() - from.valueOf());
    };
    return TimeSpan;
}());
exports.TimeSpan = TimeSpan;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ })
/******/ ]);
//# sourceMappingURL=playground.js.map