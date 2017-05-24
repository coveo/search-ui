(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Coveo__temporary"] = factory();
	else
		root["Coveo__temporary"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonpCoveo__temporary"];
/******/ 	window["webpackJsonpCoveo__temporary"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		71: 0
/******/ 	};
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
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		if(installedChunks[chunkId] === 0) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/
/******/ 		// a Promise means "currently loading".
/******/ 		if(installedChunks[chunkId]) {
/******/ 			return installedChunks[chunkId][2];
/******/ 		}
/******/
/******/ 		// setup Promise in chunk cache
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunks[chunkId][2] = promise;
/******/
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "" + ({"0":"FacetSlider","1":"AdvancedSearch","2":"DatePicker","3":"HierarchicalFacet","4":"FacetRange","5":"Facet","6":"Recommendation","7":"OmniboxResultList","8":"Searchbox","9":"ResultList","10":"Omnibox","11":"Tab","12":"ResultsFiltersPreferences","13":"ResultsPreferences","14":"Quickview","15":"Backdrop","16":"SearchAlerts","17":"Thumbnail","18":"ResultLayout","19":"PrintableUri","20":"Matrix","21":"FoldingForThread","22":"Sort","23":"YouTubeThumbnail","24":"ResultFolding","25":"ResultAttachments","26":"QuerySummary","27":"FieldTable","28":"CardOverlay","29":"Querybox","30":"Folding","31":"FieldSuggestions","32":"ChatterPostedBy","33":"ChatterPostAttachment","34":"ChatterLikedBy","35":"Badge","36":"AnalyticsSuggestions","37":"FollowItem","38":"RadioButton","39":"MultiSelect","40":"FormGroup","41":"Triggers","42":"Text","43":"ShareQuery","44":"Settings","45":"ResultsPerPage","46":"ResultTagging","47":"ResultLink","48":"QueryDuration","49":"PreferencesPanel","50":"Pager","51":"HiddenQuery","52":"ExportToExcel","53":"Excerpt","54":"ErrorReport","55":"DidYouMean","56":"CardActionBar","57":"Breadcrumb","58":"AuthenticationProvider","59":"TemplateLoader","60":"SearchButton","61":"ResultRating","62":"PipelineContext","63":"Logo","64":"Icon","65":"NumericSpinner","66":"Dropdown","67":"FieldValue","68":"ChatterTopic","69":"Aggregate"}[chunkId]||chunkId) + ".js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) {
/******/ 					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				}
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		head.appendChild(script);
/******/
/******/ 		return promise;
/******/ 	};
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
/******/ 	__webpack_require__.p = "js/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 699);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(13);
var Component_1 = __webpack_require__(7);
var Utils_1 = __webpack_require__(4);
var Assert_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(2);
var InitializationEvents_1 = __webpack_require__(14);
var SearchInterface_1 = __webpack_require__(19);
var QueryController_1 = __webpack_require__(31);
var HashUtils_1 = __webpack_require__(36);
var QueryStateModel_1 = __webpack_require__(12);
var ComponentStateModel_1 = __webpack_require__(51);
var ComponentOptionsModel_1 = __webpack_require__(24);
var AnalyticsActionListMeta_1 = __webpack_require__(11);
var JQueryutils_1 = __webpack_require__(52);
var _ = __webpack_require__(0);
var InitializationPlaceholder_1 = __webpack_require__(130);
/**
 * The main purpose of this class is to initialize the framework (a.k.a the code executed when calling `Coveo.init`).<br/>
 * It's also in charge or registering the available components, as well as the method that we expost to the global Coveo scope.<br/>
 * For example, the `Coveo.executeQuery` function will be registed in this class by the {@link QueryController}.
 */
var Initialization = (function () {
    function Initialization() {
    }
    /**
     * Register a new set of options for a given element.<br/>
     * When the element is eventually initialized as a component, those options will be used / merged to create the final option set to use for this component.<br/>
     * Note that this function should not normally be called directly, but instead using the global `Coveo.options` function
     * @param element
     * @param options
     */
    Initialization.registerDefaultOptions = function (element, options) {
        var existing = element['CoveoDefaultOptions'] || {};
        var updated = Utils_1.Utils.extendDeep(existing, options);
        element['CoveoDefaultOptions'] = updated;
    };
    Initialization.resolveDefaultOptions = function (element, options) {
        var optionsForThisElement = element['CoveoDefaultOptions'];
        var optionsSoFar;
        if (Utils_1.Utils.exists(optionsForThisElement)) {
            optionsSoFar = Utils_1.Utils.extendDeep(optionsForThisElement, options);
        }
        else {
            optionsSoFar = options;
        }
        if (element.parentElement) {
            return Initialization.resolveDefaultOptions(element.parentElement, optionsSoFar);
        }
        else {
            return optionsSoFar;
        }
    };
    /**
     * Register a new Component to be recognized by the framework.
     * This essentially mean that when we call `Coveo.init`, the Initialization class will scan the DOM for known component (which have registed themselves with this call) and create a new component on each element.
     *
     * This is meant to register the component to be loaded "eagerly" (Immediately available when the UI scripts are included)
     * @param componentClass
     */
    Initialization.registerAutoCreateComponent = function (componentClass) {
        Assert_1.Assert.exists(componentClass);
        Assert_1.Assert.exists(componentClass.ID);
        Assert_1.Assert.doesNotExists(Initialization.namedMethods[componentClass.ID]);
        if (!_.contains(Initialization.registeredComponents, componentClass.ID)) {
            Initialization.registeredComponents.push(componentClass.ID);
        }
        if (EagerInitialization.eagerlyLoadedComponents[componentClass.ID] == null) {
            EagerInitialization.eagerlyLoadedComponents[componentClass.ID] = componentClass;
        }
        if (LazyInitialization.lazyLoadedComponents[componentClass.ID] == null) {
            LazyInitialization.lazyLoadedComponents[componentClass.ID] = function () {
                return new Promise(function (resolve, reject) {
                    resolve(componentClass);
                });
            };
        }
    };
    /**
     * Set the fields that the component needs to add to the query.
     *
     * This is used when the {@link ResultList.options.autoSelectFieldsToInclude } is set to `true` (which is `true` by default).
     *
     * The framework tries to only include the needed fields from the index, for performance reasons.
     *
     * @param componentId The id for the component (eg: CoveoFacet)
     * @param fields
     */
    Initialization.registerComponentFields = function (componentId, fields) {
        Initialization.fieldsNeededForQuery = Utils_1.Utils.concatWithoutDuplicate(Initialization.fieldsNeededForQuery, fields);
        // Register with both name (eg : Facet and CoveoFacet) to reduce possible confusion.
        // The id concept for component is fuzzy for a lot of people (include the Coveo prefix or not)
        var registerById = function (id) {
            if (Initialization.fieldsNeededForQueryByComponent[id] == null) {
                Initialization.fieldsNeededForQueryByComponent[id] = fields;
            }
            else {
                Initialization.fieldsNeededForQueryByComponent[id] = Utils_1.Utils.concatWithoutDuplicate(Initialization.fieldsNeededForQueryByComponent[id], fields);
            }
        };
        registerById(componentId);
        registerById(Component_1.Component.computeCssClassNameForType(componentId));
    };
    /**
     * Returns all the fields that the framework currently knows should be added to the query.
     *
     * This is used when the {@link ResultList.options.autoSelectFieldsToInclude } is set to `true` (which is `true` by default).
     *
     * The framework tries to only include the needed fields from the index, for performance reasons.
     * @returns {string[]}
     */
    Initialization.getRegisteredFieldsForQuery = function () {
        return Initialization.fieldsNeededForQuery;
    };
    /**
     * Returns all the fields that the framework currently knows should be added to the query, for a given component.
     *
     * This is used when the {@link ResultList.options.autoSelectFieldsToInclude } is set to `true` (which is `true` by default).
     *
     * The framework tries to only include the needed fields from the index, for performance reasons.
     * @param componentId
     * @returns {string[]|Array}
     */
    Initialization.getRegisteredFieldsComponentForQuery = function (componentId) {
        var basicId = Initialization.fieldsNeededForQueryByComponent[componentId] || [];
        var coveoId = Initialization.fieldsNeededForQueryByComponent[Component_1.Component.computeCssClassNameForType(componentId)] || [];
        return Utils_1.Utils.concatWithoutDuplicate(basicId, coveoId);
    };
    /**
     * Check if a component is already registered, using it's ID (e.g. : 'Facet').
     * @param componentClassId
     * @returns {boolean}
     */
    Initialization.isComponentClassIdRegistered = function (componentClassId) {
        return _.contains(Initialization.registeredComponents, componentClassId) || _.contains(Initialization.registeredComponents, Component_1.Component.computeCssClassNameForType(componentClassId));
    };
    /**
     * Return the list of all known components (the list of ID for each component), whether they are actually loaded or not.
     * @returns {string[]}
     */
    Initialization.getListOfRegisteredComponents = function () {
        return Initialization.registeredComponents;
    };
    /**
     * Return the list of all components that are currently eagerly loaded.
     * @returns {string[]}
     */
    Initialization.getListOfLoadedComponents = function () {
        return _.keys(EagerInitialization.eagerlyLoadedComponents);
    };
    /**
     * Return the component class definition, using it's ID (e.g. : 'CoveoFacet').
     *
     * This means the component needs to be eagerly loaded.
     *
     * @param name
     * @returns {IComponentDefinition}
     */
    Initialization.getRegisteredComponent = function (name) {
        return EagerInitialization.eagerlyLoadedComponents[name];
    };
    /**
     * Initialize the framework. Note that this function should not normally be called directly, but instead using a globally registered function (e.g.: Coveo.init), or {@link Initialization.initSearchInterface} or {@link Initialization.initStandaloneSearchInterface} <br/>
     * (e.g. : `Coveo.init` or `Coveo.initSearchbox`).
     * @param element The element on which to initialize the interface.
     * @param options The options for all components (eg: {Searchbox : {enableSearchAsYouType : true}}).
     * @param initSearchInterfaceFunction The function to execute to create the {@link SearchInterface} component. Different init call will create different {@link SearchInterface}.
     */
    Initialization.initializeFramework = function (element, options, initSearchInterfaceFunction) {
        Assert_1.Assert.exists(element);
        var alreadyInitialized = Component_1.Component.get(element, QueryController_1.QueryController, true);
        if (alreadyInitialized) {
            this.logger.error('This DOM element has already been initialized as a search interface, skipping initialization', element);
            return new Promise(function (resolve, reject) {
                resolve({ elem: element });
            });
        }
        new InitializationPlaceholder_1.InitializationPlaceholder(element);
        options = Initialization.resolveDefaultOptions(element, options);
        Initialization.performInitFunctionsOption(options, InitializationEvents_1.InitializationEvents.beforeInitialization);
        Dom_1.$$(element).trigger(InitializationEvents_1.InitializationEvents.beforeInitialization);
        var toExecuteOnceSearchInterfaceIsInitialized = function () {
            Initialization.initExternalComponents(element, options);
            Initialization.performInitFunctionsOption(options, InitializationEvents_1.InitializationEvents.afterComponentsInitialization);
            Dom_1.$$(element).trigger(InitializationEvents_1.InitializationEvents.afterComponentsInitialization);
            Dom_1.$$(element).trigger(InitializationEvents_1.InitializationEvents.restoreHistoryState);
            Initialization.performInitFunctionsOption(options, InitializationEvents_1.InitializationEvents.afterInitialization);
            Dom_1.$$(element).trigger(InitializationEvents_1.InitializationEvents.afterInitialization);
            var searchInterface = Component_1.Component.get(element, SearchInterface_1.SearchInterface);
            if (searchInterface.options.autoTriggerQuery) {
                Initialization.logFirstQueryCause(searchInterface);
                var shouldLogInActionHistory = true;
                // We should not log an action history if the interface is a standalone recommendation component.
                if (Coveo['Recommendation']) {
                    shouldLogInActionHistory = !(searchInterface instanceof Coveo['Recommendation']);
                }
                Component_1.Component.get(element, QueryController_1.QueryController).executeQuery({
                    logInActionsHistory: shouldLogInActionHistory,
                    isFirstQuery: true
                });
            }
        };
        var resultOfSearchInterfaceInitialization = initSearchInterfaceFunction(element, options);
        // We are executing a "lazy" initialization, which returns a Promise
        // eg : CoveoJsSearch.Lazy.js was included in the page
        // this means that we can only execute the function after the promise has resolved
        if (resultOfSearchInterfaceInitialization.isLazyInit) {
            return resultOfSearchInterfaceInitialization.initResult.then(function () {
                toExecuteOnceSearchInterfaceIsInitialized();
                return {
                    elem: element
                };
            });
        }
        else {
            // Else, we are executing an "eager" initialization, which returns void;
            // eg : CoveoJsSearch.js was included in the page
            // this mean that this function gets executed immediately
            toExecuteOnceSearchInterfaceIsInitialized();
            return new Promise(function (resolve, reject) {
                resolve({ elem: element });
            });
        }
    };
    /**
     * Create a new standard search interface. This is the function executed when calling `Coveo.init`.
     * @param element
     * @param options
     * @returns {IInitResult}
     */
    Initialization.initSearchInterface = function (element, options) {
        if (options === void 0) { options = {}; }
        options = Initialization.resolveDefaultOptions(element, options);
        var searchInterface = new SearchInterface_1.SearchInterface(element, options.SearchInterface, options.Analytics);
        searchInterface.options.originalOptionsObject = options;
        var initParameters = { options: options, bindings: searchInterface.getBindings() };
        return Initialization.automaticallyCreateComponentsInside(element, initParameters, ['Recommendation']);
    };
    /**
     * Create a new standalone search interface (standalone search box). This is the function executed when calling `Coveo.initSearchbox`.
     * @param element
     * @param options
     * @returns {IInitResult}
     */
    Initialization.initStandaloneSearchInterface = function (element, options) {
        if (options === void 0) { options = {}; }
        options = Initialization.resolveDefaultOptions(element, options);
        // Set trigger query on clear to false for standalone search interface automatically
        // Take care of not overriding any options that could have been set by external code.
        if (!options.Querybox) {
            options.Querybox = {};
        }
        if (!options.Omnibox) {
            options.Omnibox = {};
        }
        if (!options.Searchbox) {
            options.Searchbox = {};
        }
        if (!options.Querybox.triggerQueryOnClear || !options.Omnibox.triggerQueryOnClear || !options.Searchbox.triggerOnQueryClear) {
            options.Querybox.triggerQueryOnClear = false;
            options.Omnibox.triggerQueryOnClear = false;
            options.Searchbox.triggerQueryOnClear = false;
        }
        var searchInterface = new SearchInterface_1.StandaloneSearchInterface(element, options.StandaloneSearchInterface, options.Analytics);
        searchInterface.options.originalOptionsObject = options;
        var initParameters = { options: options, bindings: searchInterface.getBindings() };
        return Initialization.automaticallyCreateComponentsInside(element, initParameters);
    };
    /**
     * Create a new recommendation search interface. This is the function executed when calling `Coveo.initRecommendation`.
     * @param element
     * @param options
     * @returns {IInitResult}
     */
    Initialization.initRecommendationInterface = function (element, options) {
        if (options === void 0) { options = {}; }
        options = Initialization.resolveDefaultOptions(element, options);
        // Since a recommendation interface inherits from a search interface, we need to merge those if passed on init
        var optionsForRecommendation = _.extend({}, options.SearchInterface, options.Recommendation);
        // If there is a main search interface, modify the loading animation for the recommendation interface to a "noop" element
        // We don't want 2 animation overlapping
        if (optionsForRecommendation.mainSearchInterface) {
            optionsForRecommendation.firstLoadingAnimation = Dom_1.$$('span').el;
        }
        var recommendation = new window['Coveo']['Recommendation'](element, optionsForRecommendation, options.Analytics);
        recommendation.options.originalOptionsObject = options;
        var initParameters = { options: options, bindings: recommendation.getBindings() };
        return Initialization.automaticallyCreateComponentsInside(element, initParameters);
    };
    /**
     * Scan the element and all its children for known components. Initialize every known component found.
     * @param element
     * @param initParameters
     * @param ignore
     * @returns {IInitResult}
     */
    Initialization.automaticallyCreateComponentsInside = function (element, initParameters, ignore) {
        var _this = this;
        Assert_1.Assert.exists(element);
        var codeToExecute = [];
        var htmlElementsToIgnore = [];
        // Scan for elements to ignore which can be a container component (with other component inside)
        // When a component is ignored, all it's children component should be ignored too.
        // Add them to the array of html elements that should be skipped.
        _.each(ignore, function (toIgnore) {
            var rootToIgnore = Dom_1.$$(element).find("." + Component_1.Component.computeCssClassNameForType(toIgnore));
            if (rootToIgnore) {
                var childsElementsToIgnore = Dom_1.$$(rootToIgnore).findAll('*');
                htmlElementsToIgnore = htmlElementsToIgnore.concat(childsElementsToIgnore);
            }
        });
        var isLazyInit;
        _.each(Initialization.getListOfRegisteredComponents(), function (componentClassId) {
            if (!_.contains(ignore, componentClassId)) {
                var classname = Component_1.Component.computeCssClassNameForType("" + componentClassId);
                var elements = Dom_1.$$(element).findAll('.' + classname);
                // From all the component we found which match the current className, remove those that should be ignored
                elements = _.difference(elements, htmlElementsToIgnore);
                if (Dom_1.$$(element).hasClass(classname) && !_.contains(htmlElementsToIgnore, element)) {
                    elements.push(element);
                }
                if (elements.length != 0) {
                    var resultsOfFactory = _this.componentsFactory(elements, componentClassId, initParameters);
                    isLazyInit = resultsOfFactory.isLazyInit;
                    codeToExecute.push(resultsOfFactory.factory);
                }
            }
        });
        if (isLazyInit) {
            return {
                initResult: Promise.all(_.map(codeToExecute, function (code) {
                    var resultsOfFactory = code();
                    if (_.isArray(resultsOfFactory)) {
                        return Promise.all(resultsOfFactory).then(function () { return true; });
                    }
                    else {
                        return Promise.resolve(true);
                    }
                })).then(function () { return true; }),
                isLazyInit: true
            };
        }
        else {
            _.each(codeToExecute, function (code) { return code(); });
            return {
                initResult: Promise.resolve(true),
                isLazyInit: false
            };
        }
    };
    /**
     * Register a new globally available method in the Coveo namespace (e.g.: `Coveo.init`).
     * @param methodName The method name to register.
     * @param handler The function to execute when the method is called.
     */
    Initialization.registerNamedMethod = function (methodName, handler) {
        Assert_1.Assert.isNonEmptyString(methodName);
        Assert_1.Assert.doesNotExists(EagerInitialization.eagerlyLoadedComponents[methodName]);
        Assert_1.Assert.doesNotExists(Initialization.namedMethods[methodName]);
        Assert_1.Assert.exists(handler);
        Initialization.namedMethods[methodName] = handler;
    };
    /**
     * Check if the method is already registed.
     * @param methodName
     * @returns {boolean}
     */
    Initialization.isNamedMethodRegistered = function (methodName) {
        return Utils_1.Utils.exists(Initialization.namedMethods[methodName]);
    };
    /**
     * 'Monkey patch' (replace the function with a new one) a given method on a component instance.
     * @param methodName
     * @param element
     * @param handler
     */
    Initialization.monkeyPatchComponentMethod = function (methodName, element, handler) {
        Assert_1.Assert.isNonEmptyString(methodName);
        Assert_1.Assert.exists(handler);
        var componentClass;
        if (methodName.indexOf('.') > 0) {
            var splitArg = methodName.split('.');
            Assert_1.Assert.check(splitArg.length == 2, 'Invalid method name, correct syntax is CoveoComponent.methodName.');
            componentClass = splitArg[0];
            methodName = splitArg[1];
        }
        var boundComponent = Component_1.Component.get(element, componentClass);
        Assert_1.Assert.exists(boundComponent);
        Assert_1.Assert.exists(boundComponent[methodName]);
        var originalMethodName = '__' + methodName;
        if (!Utils_1.Utils.exists(boundComponent[originalMethodName])) {
            boundComponent[originalMethodName] = boundComponent[methodName];
        }
        boundComponent[methodName] = handler;
    };
    Initialization.initBoxInterface = function (element, options, type, injectMarkup) {
        if (options === void 0) { options = {}; }
        if (type === void 0) { type = 'Standard'; }
        if (injectMarkup === void 0) { injectMarkup = true; }
        options = Initialization.resolveDefaultOptions(element, options);
        var fromInitTypeToBoxReference = 'Box';
        if (type != 'Standard') {
            fromInitTypeToBoxReference += 'For' + type;
        }
        var boxRef = Component_1.Component.getComponentRef(fromInitTypeToBoxReference);
        if (boxRef) {
            new Logger_1.Logger(element).info('Initializing box of type ' + fromInitTypeToBoxReference);
            var injectFunction = injectMarkup ? boxRef.getInjection : function () {
            };
            var box = new boxRef(element, options[fromInitTypeToBoxReference], options.Analytics, injectFunction, options);
            box.options.originalOptionsObject = options;
            var initParameters = { options: options, bindings: box.getBindings() };
            return Initialization.automaticallyCreateComponentsInside(element, initParameters);
        }
        else {
            return {
                initResult: new Promise(function (resolve, reject) {
                    new Logger_1.Logger(element).error('Trying to initialize box of type : ' + fromInitTypeToBoxReference + ' but not found in code (not compiled)!');
                    Assert_1.Assert.fail('Cannot initialize unknown type of box');
                    reject(false);
                }),
                isLazyInit: false
            };
        }
    };
    Initialization.dispatchNamedMethodCall = function (methodName, element, args) {
        Assert_1.Assert.isNonEmptyString(methodName);
        Assert_1.Assert.exists(element);
        var namedMethodHandler = Initialization.namedMethods[methodName];
        Assert_1.Assert.exists(namedMethodHandler);
        Initialization.logger.trace('Dispatching named method call of ' + methodName, element, args);
        if (args.length != 0) {
            return namedMethodHandler.apply(null, [element].concat(args));
        }
        else {
            return namedMethodHandler.apply(null, [element]);
        }
    };
    Initialization.dispatchNamedMethodCallOrComponentCreation = function (token, element, args) {
        Assert_1.Assert.isNonEmptyString(token);
        Assert_1.Assert.exists(element);
        if (Initialization.isNamedMethodRegistered(token)) {
            return Initialization.dispatchNamedMethodCall(token, element, args);
        }
        else if (Initialization.isThereASingleComponentBoundToThisElement(element)) {
            return Initialization.dispatchMethodCallOnBoundComponent(token, element, args);
        }
        else {
            Assert_1.Assert.fail('No method or component named ' + token + ' are registered.');
        }
    };
    Initialization.isSearchFromLink = function (searchInterface) {
        return Utils_1.Utils.isNonEmptyString(searchInterface.getBindings().queryStateModel.get('q'));
    };
    Initialization.isThereASingleComponentBoundToThisElement = function (element) {
        Assert_1.Assert.exists(element);
        return Utils_1.Utils.exists(Component_1.Component.get(element));
    };
    Initialization.dispatchMethodCallOnBoundComponent = function (methodName, element, args) {
        Assert_1.Assert.isNonEmptyString(methodName);
        Assert_1.Assert.exists(element);
        var boundComponent = Component_1.Component.get(element);
        Assert_1.Assert.exists(boundComponent);
        var method = boundComponent[methodName];
        if (Utils_1.Utils.exists(method)) {
            return method.apply(boundComponent, args);
        }
        else {
            Assert_1.Assert.fail('No method named ' + methodName + ' exist on component ' + boundComponent.type);
        }
    };
    Initialization.logFirstQueryCause = function (searchInterface) {
        var firstQueryCause = HashUtils_1.HashUtils.getValue('firstQueryCause', HashUtils_1.HashUtils.getHash());
        if (firstQueryCause != null) {
            var meta = HashUtils_1.HashUtils.getValue('firstQueryMeta', HashUtils_1.HashUtils.getHash()) || {};
            searchInterface.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList[firstQueryCause], meta);
        }
        else {
            if (Initialization.isSearchFromLink(searchInterface)) {
                searchInterface.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchFromLink, {});
            }
            else {
                searchInterface.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.interfaceLoad, {});
            }
        }
    };
    Initialization.performInitFunctionsOption = function (options, event) {
        if (Utils_1.Utils.exists(options)) {
            Initialization.performFunctions(options[event]);
        }
    };
    Initialization.performFunctions = function (option) {
        if (Utils_1.Utils.exists(option)) {
            _.each(option, function (func) {
                if (typeof func == 'function') {
                    func();
                }
            });
        }
    };
    Initialization.initExternalComponents = function (element, options) {
        if (options && options['externalComponents']) {
            var searchInterface = Component_1.Component.get(element, SearchInterface_1.SearchInterface);
            var queryStateModel = Component_1.Component.get(element, QueryStateModel_1.QueryStateModel);
            var componentStateModel = Component_1.Component.get(element, ComponentStateModel_1.ComponentStateModel);
            var queryController = Component_1.Component.get(element, QueryController_1.QueryController);
            var componentOptionsModel = Component_1.Component.get(element, ComponentOptionsModel_1.ComponentOptionsModel);
            var usageAnalytics = searchInterface.usageAnalytics;
            Assert_1.Assert.exists(searchInterface);
            Assert_1.Assert.exists(queryStateModel);
            Assert_1.Assert.exists(queryController);
            Assert_1.Assert.exists(componentStateModel);
            Assert_1.Assert.exists(usageAnalytics);
            var initParameters_1 = {
                options: options,
                bindings: {
                    searchInterface: searchInterface,
                    queryStateModel: queryStateModel,
                    queryController: queryController,
                    usageAnalytics: usageAnalytics,
                    componentStateModel: componentStateModel,
                    componentOptionsModel: componentOptionsModel,
                    root: element
                }
            };
            _.each(options['externalComponents'], function (externalComponent) {
                var elementToInstantiate = externalComponent;
                if (Utils_1.Utils.isHtmlElement(elementToInstantiate)) {
                    return Initialization.automaticallyCreateComponentsInside(elementToInstantiate, initParameters_1);
                }
                else if (JQueryutils_1.JQueryUtils.isInstanceOfJQuery(elementToInstantiate)) {
                    return Initialization.automaticallyCreateComponentsInside((elementToInstantiate.get(0)), initParameters_1);
                }
            });
        }
    };
    return Initialization;
}());
Initialization.logger = new Logger_1.Logger('Initialization');
Initialization.registeredComponents = [];
Initialization.namedMethods = {};
// List of every fields that are needed by components when doing a query (the fieldsToInclude property in the query)
// Since results components are lazy loaded after the first query (when doing the rendering) we need to register the needed fields before their implementation are loaded in the page.
Initialization.fieldsNeededForQuery = [];
// List of every fields that are needed by components when doing a query (the fieldsToInclude property in the query), linked to the component that needs them
// It is a bit different from `fieldsNeededForQuery` because we can, in some scenarios, optimize to only get fields for components that are actually in the page
Initialization.fieldsNeededForQueryByComponent = {};
exports.Initialization = Initialization;
var LazyInitialization = (function () {
    function LazyInitialization() {
    }
    LazyInitialization.getLazyRegisteredComponent = function (name) {
        return LazyInitialization.lazyLoadedComponents[name]();
    };
    LazyInitialization.getLazyRegisteredModule = function (name) {
        return LazyInitialization.lazyLoadedModule[name]();
    };
    LazyInitialization.registerLazyComponent = function (id, load) {
        if (LazyInitialization.lazyLoadedComponents[id] == null) {
            Assert_1.Assert.exists(load);
            if (!_.contains(Initialization.registeredComponents, id)) {
                Initialization.registeredComponents.push(id);
            }
            LazyInitialization.lazyLoadedComponents[id] = load;
        }
        else {
            this.logger.warn('Component being registered twice', id);
        }
    };
    LazyInitialization.buildErrorCallback = function (chunkName) {
        return function () { return LazyInitialization.logger.error("Cannot load chunk for " + chunkName + ". You may need to configure the paths of the ressources using Coveo.configureRessourceRoot. Current path is " + __webpack_require__.p + "."); };
    };
    LazyInitialization.registerLazyModule = function (id, load) {
        if (LazyInitialization.lazyLoadedModule[id] == null) {
            Assert_1.Assert.exists(load);
            LazyInitialization.lazyLoadedModule[id] = load;
        }
        else {
            this.logger.warn('Module being registered twice', id);
        }
    };
    LazyInitialization.componentsFactory = function (elements, componentClassId, initParameters) {
        var factory = function () {
            var promises = [];
            _.each(elements, function (matchingElement) {
                if (Component_1.Component.get(matchingElement, componentClassId) == null) {
                    // If options were provided, lookup options for this component class and
                    // also for the element id. Merge them and pass those to the factory method.
                    var optionsToUse = undefined;
                    if (Utils_1.Utils.exists(initParameters.options)) {
                        var optionsForComponentClass = initParameters.options[componentClassId];
                        var optionsForElementId = initParameters.options[matchingElement.id];
                        var initOptions = initParameters.options['initOptions'] ? initParameters.options['initOptions'][componentClassId] : {};
                        optionsToUse = Utils_1.Utils.extendDeep(optionsForElementId, initOptions);
                        optionsToUse = Utils_1.Utils.extendDeep(optionsForComponentClass, optionsToUse);
                    }
                    var initParamToUse = _.extend({}, initParameters, { options: optionsToUse });
                    promises.push(LazyInitialization.createComponentOfThisClassOnElement(componentClassId, matchingElement, initParamToUse));
                }
            });
            return promises;
        };
        return {
            factory: factory,
            isLazyInit: true
        };
    };
    LazyInitialization.createComponentOfThisClassOnElement = function (componentClassId, element, initParameters) {
        Assert_1.Assert.isNonEmptyString(componentClassId);
        Assert_1.Assert.exists(element);
        return LazyInitialization.getLazyRegisteredComponent(componentClassId).then(function (lazyLoadedComponent) {
            Assert_1.Assert.exists(lazyLoadedComponent);
            var bindings = {};
            var options = {};
            var result = undefined;
            if (initParameters != undefined) {
                _.each(initParameters.bindings, function (value, key) {
                    bindings[key] = value;
                });
                options = initParameters.options;
                result = initParameters.result;
            }
            LazyInitialization.logger.trace('Creating component of class ' + componentClassId, element, options);
            return new lazyLoadedComponent(element, options, bindings, result);
        });
    };
    return LazyInitialization;
}());
LazyInitialization.logger = new Logger_1.Logger('LazyInitialization');
// Map of every component to a promise that resolve with their implementation (lazily loaded)
LazyInitialization.lazyLoadedComponents = {};
LazyInitialization.lazyLoadedModule = {};
exports.LazyInitialization = LazyInitialization;
var EagerInitialization = (function () {
    function EagerInitialization() {
    }
    EagerInitialization.componentsFactory = function (elements, componentClassId, initParameters) {
        var factory = function () {
            _.each(elements, function (matchingElement) {
                if (Component_1.Component.get(matchingElement, componentClassId) == null) {
                    // If options were provided, lookup options for this component class and
                    // also for the element id. Merge them and pass those to the factory method.
                    var optionsToUse = undefined;
                    if (Utils_1.Utils.exists(initParameters.options)) {
                        var optionsForComponentClass = initParameters.options[componentClassId];
                        var optionsForElementId = initParameters.options[matchingElement.id];
                        var initOptions = initParameters.options['initOptions'] ? initParameters.options['initOptions'][componentClassId] : {};
                        optionsToUse = Utils_1.Utils.extendDeep(optionsForElementId, initOptions);
                        optionsToUse = Utils_1.Utils.extendDeep(optionsForComponentClass, optionsToUse);
                    }
                    var initParamToUse = _.extend({}, initParameters, { options: optionsToUse });
                    EagerInitialization.createComponentOfThisClassOnElement(componentClassId, matchingElement, initParamToUse);
                }
            });
        };
        return {
            factory: factory,
            isLazyInit: false
        };
    };
    EagerInitialization.createComponentOfThisClassOnElement = function (componentClassId, element, initParameters) {
        Assert_1.Assert.isNonEmptyString(componentClassId);
        Assert_1.Assert.exists(element);
        var eagerlyLoadedComponent = Initialization.getRegisteredComponent(componentClassId);
        var bindings = {};
        var options = {};
        var result = undefined;
        if (initParameters != undefined) {
            _.each(initParameters.bindings, function (value, key) {
                bindings[key] = value;
            });
            options = initParameters.options;
            result = initParameters.result;
        }
        EagerInitialization.logger.trace("Creating component of class " + componentClassId, element, options);
        // This is done so that external code that extends a base component does not have to have two code path for lazy vs eager;
        // If we do not find the eager component registered, we can instead try to load the one found in lazy mode.
        // If it still fails there... tough luck. The component simply won't work.
        if (eagerlyLoadedComponent == null) {
            LazyInitialization.getLazyRegisteredComponent(componentClassId).then(function (lazyLoadedComponent) {
                EagerInitialization.logger.warn("Component of class " + componentClassId + " was not found in \"Eager\" mode. Using lazy mode as a fallback.");
                new lazyLoadedComponent(element, options, bindings, result);
            }).catch(function () {
                EagerInitialization.logger.error("Component of class " + componentClassId + " was not found in \"Eager\" mode nor \"Lazy\" mode. It will not be initialized properly...");
            });
            return null;
        }
        else {
            return new eagerlyLoadedComponent(element, options, bindings, result);
        }
    };
    return EagerInitialization;
}());
EagerInitialization.logger = new Logger_1.Logger('EagerInitialization');
// Map of every component with their implementation (eagerly loaded)
EagerInitialization.eagerlyLoadedComponents = {};
exports.EagerInitialization = EagerInitialization;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var JQueryutils_1 = __webpack_require__(52);
var Assert_1 = __webpack_require__(6);
var Logger_1 = __webpack_require__(13);
var _ = __webpack_require__(0);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var Logger_1 = __webpack_require__(13);
var Initialization_1 = __webpack_require__(1);
function exportGlobally(toExportGlobally) {
    if (window['Coveo'] == undefined) {
        window['Coveo'] = {};
    }
    _.each(_.keys(toExportGlobally), function (key) {
        if (window['Coveo'][key] == null) {
            window['Coveo'][key] = toExportGlobally[key];
        }
    });
}
exports.exportGlobally = exportGlobally;
function lazyExport(component, promiseResolve) {
    if (component.doExport) {
        component.doExport();
    }
    else {
        new Logger_1.Logger(this).error("Component " + component + " has no export function !");
    }
    Initialization_1.Initialization.registerAutoCreateComponent(component);
    promiseResolve(component);
}
exports.lazyExport = lazyExport;
function lazyExportModule(mod, promiseResolve) {
    if (mod.doExport) {
        mod.doExport();
    }
    promiseResolve(mod);
}
exports.lazyExportModule = lazyExportModule;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
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
/* 5 */,
/* 6 */
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
var Logger_1 = __webpack_require__(13);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
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
/* 7 */
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
var Assert_1 = __webpack_require__(6);
var Utils_1 = __webpack_require__(4);
var JQueryutils_1 = __webpack_require__(52);
var Dom_1 = __webpack_require__(2);
var QueryStateModel_1 = __webpack_require__(12);
var ComponentStateModel_1 = __webpack_require__(51);
var ComponentOptionsModel_1 = __webpack_require__(24);
var QueryController_1 = __webpack_require__(31);
var SearchInterface_1 = __webpack_require__(19);
var NoopAnalyticsClient_1 = __webpack_require__(71);
var BaseComponent_1 = __webpack_require__(28);
var DebugEvents_1 = __webpack_require__(68);
var _ = __webpack_require__(0);
/**
 * The base class for every component in the framework.
 */
var Component = (function (_super) {
    __extends(Component, _super);
    /**
     * Create a new Component. Resolve all {@link IComponentBindings} if not provided.<br/>
     * Create a new Logger for this component.
     * Attach the component to the {@link SearchInterface}.<br/>
     * @param element The HTMLElement on which to create the component. Used to bind data on the element.
     * @param type The unique identifier for this component. See : {@link IComponentDefinition.ID}. Used to generate the unique Coveo CSS class associated with every component.
     * @param bindings The environment for every component. Optional, but omitting to provide one will impact performance.
     */
    function Component(element, type, bindings) {
        if (bindings === void 0) { bindings = {}; }
        var _this = _super.call(this, element, type) || this;
        _this.element = element;
        _this.type = type;
        /**
         * Allows the component to bind events and execute them only when it is enabled.
         * @type {Coveo.ComponentEvents}
         */
        _this.bind = new ComponentEvents(_this);
        _this.root = bindings.root || _this.resolveRoot();
        _this.queryStateModel = bindings.queryStateModel || _this.resolveQueryStateModel();
        _this.componentStateModel = bindings.componentStateModel || _this.resolveComponentStateModel();
        _this.queryController = bindings.queryController || _this.resolveQueryController();
        _this.searchInterface = bindings.searchInterface || _this.resolveSearchInterface();
        _this.usageAnalytics = bindings.usageAnalytics || _this.resolveUA();
        _this.componentOptionsModel = bindings.componentOptionsModel || _this.resolveComponentOptionsModel();
        _this.ensureDom = _.once(function () { return _this.createDom(); });
        if (_this.searchInterface != null) {
            _this.searchInterface.attachComponent(type, _this);
        }
        _this.initDebugInfo();
        return _this;
    }
    /**
     * Return the bindings, or environment, for the current component.
     * @returns {IComponentBindings}
     */
    Component.prototype.getBindings = function () {
        return {
            root: this.root,
            queryStateModel: this.queryStateModel,
            queryController: this.queryController,
            searchInterface: this.searchInterface,
            componentStateModel: this.componentStateModel,
            componentOptionsModel: this.componentOptionsModel,
            usageAnalytics: this.usageAnalytics
        };
    };
    Component.prototype.createDom = function () {
        // By default we do nothing
    };
    Component.prototype.resolveSearchInterface = function () {
        return Component.resolveBinding(this.element, SearchInterface_1.SearchInterface);
    };
    Component.prototype.resolveRoot = function () {
        var resolvedSearchInterface = Component.resolveBinding(this.element, SearchInterface_1.SearchInterface);
        return resolvedSearchInterface ? resolvedSearchInterface.element : undefined;
    };
    Component.prototype.resolveQueryController = function () {
        return Component.resolveBinding(this.element, QueryController_1.QueryController);
    };
    Component.prototype.resolveComponentStateModel = function () {
        return Component.resolveBinding(this.element, ComponentStateModel_1.ComponentStateModel);
    };
    Component.prototype.resolveQueryStateModel = function () {
        return Component.resolveBinding(this.element, QueryStateModel_1.QueryStateModel);
    };
    Component.prototype.resolveComponentOptionsModel = function () {
        return Component.resolveBinding(this.element, ComponentOptionsModel_1.ComponentOptionsModel);
    };
    Component.prototype.resolveUA = function () {
        var searchInterface = this.resolveSearchInterface();
        return (searchInterface && searchInterface.usageAnalytics) ? searchInterface.usageAnalytics : new NoopAnalyticsClient_1.NoopAnalyticsClient();
    };
    Component.prototype.resolveResult = function () {
        return Component.getResult(this.element);
    };
    Component.prototype.initDebugInfo = function () {
        var _this = this;
        Dom_1.$$(this.element).on('dblclick', function (e) {
            if (e.altKey) {
                var debugInfo = _this.debugInfo();
                if (debugInfo != null) {
                    Dom_1.$$(_this.root).trigger(DebugEvents_1.DebugEvents.showDebugPanel, _this.debugInfo());
                }
            }
        });
    };
    /**
     * Get the bound component to the given HTMLElement. Throws an assert if the HTMLElement has no component bound, unless using the noThrow argument.<br/>
     * If there is multiple component bound to the current HTMLElement, you must specify the component class.
     * @param element HTMLElement for which to get the bound component.
     * @param componentClass Optional component class. If the HTMLElement has multiple components bound, you must specify which one you are targeting.
     * @param noThrow Boolean option to tell the method to not throw on error.
     * @returns {Component}
     */
    Component.get = function (element, componentClass, noThrow) {
        Assert_1.Assert.exists(element);
        if (_.isString(componentClass)) {
            return element[Component.computeCssClassNameForType(componentClass)];
        }
        else if (Utils_1.Utils.exists(componentClass)) {
            Assert_1.Assert.exists(componentClass.ID);
            return element[Component.computeCssClassNameForType(componentClass.ID)];
        }
        else {
            // No class specified, but we support returning the bound component
            // if there is exactly one.
            var boundComponents = BaseComponent_1.BaseComponent.getBoundComponentsForElement(element);
            if (!noThrow) {
                Assert_1.Assert.check(boundComponents.length <= 1, 'More than one component is bound to this element. You need to specify the component type.');
            }
            return boundComponents[0];
        }
    };
    Component.getResult = function (element, noThrow) {
        if (noThrow === void 0) { noThrow = false; }
        var resultElement = Dom_1.$$(element).closest('.CoveoResult');
        Assert_1.Assert.check(noThrow || resultElement != undefined);
        return resultElement['CoveoResult'];
    };
    Component.bindResultToElement = function (element, result) {
        Assert_1.Assert.exists(element);
        Assert_1.Assert.exists(result);
        Dom_1.$$(element).addClass('CoveoResult');
        element['CoveoResult'] = result;
        var jQuery = JQueryutils_1.JQueryUtils.getJQuery();
        if (jQuery) {
            jQuery(element).data(result);
        }
    };
    Component.resolveBinding = function (element, componentClass) {
        Assert_1.Assert.exists(element);
        Assert_1.Assert.exists(componentClass);
        Assert_1.Assert.exists(componentClass.ID);
        // first, look down
        var found;
        if (Dom_1.$$(element).is('.' + Component.computeCssClassNameForType(componentClass.ID))) {
            found = element;
        }
        else {
            var findDown = Dom_1.$$(element).findClass(Component.computeCssClassNameForType(componentClass.ID));
            if (!findDown || findDown.length == 0) {
                var findUp = Dom_1.$$(element).closest(Component.computeCssClassNameForType(componentClass.ID));
                if (findUp) {
                    found = findUp;
                }
            }
            else {
                found = findDown;
            }
        }
        if (found) {
            return found[Component.computeCssClassNameForType(componentClass.ID)];
        }
        else {
            return undefined;
        }
    };
    Component.pointElementsToDummyForm = function (element) {
        var inputs = Dom_1.$$(element).is('input') ? [element] : [];
        inputs = inputs.concat(Dom_1.$$(element).findAll('input'));
        _.each(_.compact(inputs), function (input) {
            input.setAttribute('form', 'coveo-dummy-form');
        });
    };
    return Component;
}(BaseComponent_1.BaseComponent));
exports.Component = Component;
/**
 * The `ComponentEvents` class is used by the various Coveo Component to trigger events and bind event handlers. It adds
 * logic to execute handlers or triggers only when a component is "enabled", which serves as a way to avoid executing
 * handlers on components that are invisible and inactive in the query.
 *
 * Typically, a component is disabled when it is not active in the current [`Tab`]{@link Tab}. It can also be disabled
 * by external code, however.
 *
 * To manually enable or disable a component, simply use its [`enable`]{@link Component.enable} or
 * [`disable`]{@link Component.disable} method.
 */
var ComponentEvents = (function () {
    /**
     * Creates a new `ComponentEvents` instance for a [`Component`]{@link Component}.
     * @param owner The [`Component`]{@link Component} that owns the event handlers and triggers.
     */
    function ComponentEvents(owner) {
        this.owner = owner;
        Assert_1.Assert.exists(owner);
    }
    ComponentEvents.prototype.on = function (arg, event, handler) {
        if (!JQueryutils_1.JQueryUtils.getJQuery() || !JQueryutils_1.JQueryUtils.isInstanceOfJQuery(arg)) {
            var htmlEl = arg;
            Dom_1.$$(htmlEl).on(event, this.wrapToCallIfEnabled(handler));
        }
        else {
            var jq = arg;
            jq.on(event, this.wrapToCallIfEnabled(handler));
        }
    };
    ComponentEvents.prototype.one = function (arg, event, handler) {
        if (arg instanceof HTMLElement) {
            var htmlEl = arg;
            Dom_1.$$(htmlEl).one(event, this.wrapToCallIfEnabled(handler));
        }
        else {
            var jq = arg;
            jq.one(event, this.wrapToCallIfEnabled(handler));
        }
    };
    /**
     * Bind on the "root" of the Component. The root is typically the {@link SearchInterface}.<br/>
     * Bind an event using native javascript code.
     * @param event The event for which to register an handler.
     * @param handler The function to execute when the event is triggered.
     */
    ComponentEvents.prototype.onRootElement = function (event, handler) {
        this.on(this.owner.root, event, handler);
    };
    /**
     * Bind on the "root" of the Component. The root is typically the {@link SearchInterface}.<br/>
     * Bind an event using native javascript code.
     * The handler will execute only ONE time.
     * @param event The event for which to register an handler.
     * @param handler The function to execute when the event is triggered.
     */
    ComponentEvents.prototype.oneRootElement = function (event, handler) {
        this.one(this.owner.root, event, handler);
    };
    /**
     * Bind an event related specially to the query state model.<br/>
     * This will build the correct string event and execute the handler only if the component is activated.
     * @param eventType The event type for which to register an event.
     * @param attribute The attribute for which to register an event.
     * @param handler The handler to execute when the query state event is triggered.
     */
    ComponentEvents.prototype.onQueryState = function (eventType, attribute, handler) {
        this.onRootElement(this.getQueryStateEventName(eventType, attribute), handler);
    };
    /**
     * Bind an event related specially to the component option model.
     * This will build the correct string event and execute the handler only if the component is activated.
     * @param eventType The event type for which to register an event.
     * @param attribute The attribute for which to register an event.
     * @param handler The handler to execute when the query state event is triggered.
     */
    ComponentEvents.prototype.onComponentOptions = function (eventType, attribute, handler) {
        this.onRootElement(this.getComponentOptionEventName(eventType, attribute), handler);
    };
    /**
     * Bind an event related specially to the query state model.<br/>
     * This will build the correct string event and execute the handler only if the component is activated.<br/>
     * Will execute only once.
     * @param eventType The event type for which to register an event.
     * @param attribute The attribute for which to register an event.
     * @param handler The handler to execute when the query state event is triggered.
     */
    ComponentEvents.prototype.oneQueryState = function (eventType, attribute, handler) {
        this.oneRootElement(this.getQueryStateEventName(eventType, attribute), handler);
    };
    ComponentEvents.prototype.trigger = function (arg, event, args) {
        this.wrapToCallIfEnabled(function () {
            if (arg instanceof HTMLElement) {
                var htmlEl = arg;
                Dom_1.$$(htmlEl).trigger(event, args);
            }
            else {
                var jq = arg;
                jq.trigger(event, args);
            }
        })(args);
    };
    /**
     * Execute the function only if the component is enabled.
     * @param func The function to execute if the component is enabled.
     * @returns {function(...[any]): *}
     */
    ComponentEvents.prototype.wrapToCallIfEnabled = function (func) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!_this.owner.disabled) {
                if (args && args[0] instanceof CustomEvent) {
                    if (args[0].detail) {
                        args = [args[0].detail];
                    }
                }
                else if (args && JQueryutils_1.JQueryUtils.isInstanceOfJqueryEvent(args[0])) {
                    if (args[1] != undefined) {
                        args = [args[1]];
                    }
                    else {
                        args = [];
                    }
                }
                return func.apply(_this.owner, args);
            }
        };
    };
    ComponentEvents.prototype.getQueryStateEventName = function (eventType, attribute) {
        return this.getModelEvent(this.owner.queryStateModel, eventType, attribute);
    };
    ComponentEvents.prototype.getComponentOptionEventName = function (eventType, attribute) {
        return this.getModelEvent(this.owner.componentOptionsModel, eventType, attribute);
    };
    ComponentEvents.prototype.getModelEvent = function (model, eventType, attribute) {
        var evtName;
        if (eventType && attribute) {
            evtName = model.getEventName(eventType + attribute);
        }
        else {
            evtName = model.getEventName(eventType);
        }
        return evtName;
    };
    return ComponentEvents;
}());
exports.ComponentEvents = ComponentEvents;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
var Logger_1 = __webpack_require__(13);
var Dom_1 = __webpack_require__(2);
var TemplateCache_1 = __webpack_require__(44);
var TemplateList_1 = __webpack_require__(98);
var UnderscoreTemplate_1 = __webpack_require__(39);
var HtmlTemplate_1 = __webpack_require__(73);
var Utils_1 = __webpack_require__(4);
var Strings_1 = __webpack_require__(9);
var _ = __webpack_require__(0);
;
var ComponentOptionsType;
(function (ComponentOptionsType) {
    ComponentOptionsType[ComponentOptionsType["BOOLEAN"] = 0] = "BOOLEAN";
    ComponentOptionsType[ComponentOptionsType["NUMBER"] = 1] = "NUMBER";
    ComponentOptionsType[ComponentOptionsType["STRING"] = 2] = "STRING";
    ComponentOptionsType[ComponentOptionsType["LOCALIZED_STRING"] = 3] = "LOCALIZED_STRING";
    ComponentOptionsType[ComponentOptionsType["LIST"] = 4] = "LIST";
    ComponentOptionsType[ComponentOptionsType["SELECTOR"] = 5] = "SELECTOR";
    ComponentOptionsType[ComponentOptionsType["CHILD_HTML_ELEMENT"] = 6] = "CHILD_HTML_ELEMENT";
    ComponentOptionsType[ComponentOptionsType["TEMPLATE"] = 7] = "TEMPLATE";
    ComponentOptionsType[ComponentOptionsType["FIELD"] = 8] = "FIELD";
    ComponentOptionsType[ComponentOptionsType["FIELDS"] = 9] = "FIELDS";
    ComponentOptionsType[ComponentOptionsType["ICON"] = 10] = "ICON";
    ComponentOptionsType[ComponentOptionsType["COLOR"] = 11] = "COLOR";
    ComponentOptionsType[ComponentOptionsType["OBJECT"] = 12] = "OBJECT";
    ComponentOptionsType[ComponentOptionsType["QUERY"] = 13] = "QUERY";
    ComponentOptionsType[ComponentOptionsType["HELPER"] = 14] = "HELPER";
    ComponentOptionsType[ComponentOptionsType["LONG_STRING"] = 15] = "LONG_STRING";
    ComponentOptionsType[ComponentOptionsType["JSON"] = 16] = "JSON";
    ComponentOptionsType[ComponentOptionsType["JAVASCRIPT"] = 17] = "JAVASCRIPT";
    ComponentOptionsType[ComponentOptionsType["NONE"] = 18] = "NONE";
})(ComponentOptionsType = exports.ComponentOptionsType || (exports.ComponentOptionsType = {}));
var camelCaseToHyphenRegex = /([A-Z])|\W+(\w)/g;
var fieldsSeperator = /\s*,\s*/;
var localizer = /([a-zA-Z\-]+)\s*:\s*(([^,]|,\s*(?!([a-zA-Z\-]+)\s*:))+)/g;
/**
 * This static class is used to initialize component options.
 *
 * Typically, each {@link Component} that exposes a set of options will contains a static `options` property,
 *
 * This property will "build" the options based on their type.
 */
var ComponentOptions = (function () {
    function ComponentOptions() {
    }
    /**
     * Build a boolean option.
     *
     * A boolean option can be "true" or "false" in the markup.
     *
     * `data-foo="true"` or `data-foo="false"`.
     * @param optionArgs
     * @returns {boolean}
     */
    ComponentOptions.buildBooleanOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.BOOLEAN, ComponentOptions.loadBooleanOption, optionArgs);
    };
    /**
     * Build a number option.
     *
     * A number option can be an integer or a float in the markup.
     *
     * `data-foo="1"` or `data-foo="1.5"`.
     */
    ComponentOptions.buildNumberOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.NUMBER, ComponentOptions.loadNumberOption, optionArgs);
    };
    /**
     * Build a string option.
     *
     * A string option can be any arbitrary string in the markup.
     *
     * `data-foo="bar"`.
     */
    ComponentOptions.buildStringOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.STRING, ComponentOptions.loadStringOption, optionArgs);
    };
    /**
     * Build an icon option.
     *
     * Normally, this only means that it will build a string that matches a CSS class for an icon.
     *
     * In the markup, this has no advantage over a plain string. This is mostly useful for the interface editor.
     *
     * `data-foo="coveo-sprites-user"` or `data-foo="coveo-sprites-database"`.
     */
    ComponentOptions.buildIconOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.ICON, ComponentOptions.loadStringOption, optionArgs);
    };
    /**
     * Build a color option.
     *
     * Normally, this only means that it will build a string that matches a CSS color.
     *
     * In the markup, this has no advantage over a plain string. This is mostly useful for the interface editor.
     *
     * `data-foo="coveo-sprites-user"` or `data-foo="coveo-sprites-database"`.
     */
    ComponentOptions.buildColorOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.COLOR, ComponentOptions.loadStringOption, optionArgs);
    };
    /**
     * Build a helper option.
     *
     * Normally, this only means that it will build a string that matches the name of a template helper.
     *
     * In the markup, this has no advantage over a plain string. This is mostly useful for the interface editor.
     *
     * `data-foo="date"` or `data-foo="dateTime"`.
     */
    ComponentOptions.buildHelperOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.HELPER, ComponentOptions.loadStringOption, optionArgs);
    };
    /**
     * Build a JSON option.
     *
     * Normally, this only means that it will build a stringified JSON.
     *
     * In the markup, this has no advantage over a plain string. This is mostly useful for the interface editor.
     *
     * `data-foo='{"bar" : "baz"}'`.
     */
    ComponentOptions.buildJsonOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.JSON, ComponentOptions.loadStringOption, optionArgs);
    };
    /**
     * Build a localized string option.
     *
     * A localized string option can be any arbitrary string.
     *
     * The framework, when parsing the value, will try to load the localization for that word if it is available.
     *
     * If it is not available, it will return the non-localized option.
     *
     * This should be used for options that will be rendered directly to the end users.
     *
     * `data-foo="bar"`.
     */
    ComponentOptions.buildLocalizedStringOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.LOCALIZED_STRING, ComponentOptions.loadLocalizedStringOption, optionArgs);
    };
    /**
     * Build a field option.
     *
     * A field option will validate that the field has a valid name. This means that the string has to start with @.
     *
     * `data-foo="@bar"`.
     */
    ComponentOptions.buildFieldOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.FIELD, ComponentOptions.loadFieldOption, optionArgs);
    };
    /**
     * Build an array of field option.
     *
     * As with all options that expect an array, you should use commas to delimit the different values.
     *
     * `data-foo="@bar,@baz"`.
     */
    ComponentOptions.buildFieldsOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.FIELDS, ComponentOptions.loadFieldsOption, optionArgs);
    };
    /**
     * Build an array of string option.
     *
     * As with all options that expect an array, you should use commas to delimit the different values.
     *
     * `data-foo="bar,baz"`.
     */
    ComponentOptions.buildListOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.LIST, ComponentOptions.loadListOption, optionArgs);
    };
    /**
     * Build an option that allow to select an HTMLElement.
     *
     * The option accept a CSS selector that will allow to find the required HTMLElement.
     *
     * It can be a class selector or an ID selector.
     *
     * `data-foo-selector=".bar" or data-foo-selector="#bar"`.
     */
    ComponentOptions.buildSelectorOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.SELECTOR, ComponentOptions.loadSelectorOption, optionArgs);
    };
    ComponentOptions.buildChildHtmlElementOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.CHILD_HTML_ELEMENT, ComponentOptions.loadChildHtmlElementOption, optionArgs);
    };
    ComponentOptions.buildTemplateOption = function (optionArgs) {
        return ComponentOptions.buildOption(ComponentOptionsType.TEMPLATE, ComponentOptions.loadTemplateOption, optionArgs);
    };
    ComponentOptions.buildCustomOption = function (converter, optionArgs) {
        var loadOption = function (element, name, option) {
            var stringvalue = ComponentOptions.loadStringOption(element, name, option);
            if (!Utils_1.Utils.isNullOrEmptyString(stringvalue)) {
                return converter(stringvalue);
            }
        };
        return ComponentOptions.buildOption(ComponentOptionsType.STRING, loadOption, optionArgs);
    };
    ComponentOptions.buildCustomListOption = function (converter, optionArgs) {
        var loadOption = function (element, name, option) {
            var stringvalue = ComponentOptions.loadListOption(element, name, option);
            return converter(stringvalue);
        };
        return ComponentOptions.buildOption(ComponentOptionsType.LIST, loadOption, optionArgs);
    };
    ComponentOptions.buildObjectOption = function (optionArgs) {
        var loadOption = function (element, name, option) {
            var keys = _.keys(optionArgs.subOptions);
            var scopedOptions = {};
            var scopedValues = {};
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var scopedkey = ComponentOptions.mergeCamelCase(name, key);
                scopedOptions[scopedkey] = optionArgs.subOptions[key];
            }
            ComponentOptions.initOptions(element, scopedOptions, scopedValues);
            var resultValues = {};
            var resultFound = false;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var scopedkey = ComponentOptions.mergeCamelCase(name, key);
                if (scopedValues[scopedkey] != null) {
                    resultValues[key] = scopedValues[scopedkey];
                    resultFound = true;
                }
            }
            return resultFound ? resultValues : null;
        };
        return ComponentOptions.buildOption(ComponentOptionsType.OBJECT, loadOption, optionArgs);
    };
    ComponentOptions.buildOption = function (type, load, optionArg) {
        if (optionArg === void 0) { optionArg = {}; }
        var option = optionArg;
        option.type = type;
        option.load = load;
        return option;
    };
    ComponentOptions.attrNameFromName = function (name, optionArgs) {
        if (optionArgs && optionArgs.attrName) {
            return optionArgs.attrName;
        }
        if (name) {
            return 'data-' + ComponentOptions.camelCaseToHyphen(name);
        }
        return name;
    };
    ComponentOptions.camelCaseToHyphen = function (name) {
        return name.replace(camelCaseToHyphenRegex, '-$1$2').toLowerCase();
    };
    ComponentOptions.mergeCamelCase = function (parent, name) {
        return parent + name.substr(0, 1).toUpperCase() + name.substr(1);
    };
    /**
     * The main function that will load and parse the options for the current given element.
     *
     * Every component will call this function in their constructor.
     * @param element The element on which the options should be parsed
     * @param component The component class for which the options should be parsed. For example : Searchbox, Facet, etc.
     * @param values The optional options which should be merged with the options set in the markup.
     */
    ComponentOptions.initComponentOptions = function (element, component, values) {
        return ComponentOptions.initOptions(element, component.options, values, component.ID);
    };
    ComponentOptions.initOptions = function (element, options, values, componentID) {
        var logger = new Logger_1.Logger(this);
        if (values == null) {
            values = {};
        }
        var names = _.keys(options);
        for (var i = 0; i < names.length; i++) {
            var name_1 = names[i];
            var optionDefinition = options[name_1];
            var value = void 0;
            var loadFromAttribute = optionDefinition.load;
            if (loadFromAttribute != null) {
                value = loadFromAttribute(element, name_1, optionDefinition);
                if (value && optionDefinition.deprecated) {
                    logger.warn(componentID + '.' + name_1 + ' : ' + optionDefinition.deprecated);
                }
            }
            if (Utils_1.Utils.isNullOrUndefined(value) && values[name_1] != undefined) {
                value = values[name_1];
            }
            if (value == null && values[name_1] == undefined) {
                if (optionDefinition.defaultValue != null) {
                    if (optionDefinition.type == ComponentOptionsType.LIST) {
                        value = _.extend([], optionDefinition.defaultValue);
                    }
                    else if (optionDefinition.type == ComponentOptionsType.OBJECT) {
                        value = _.extend({}, optionDefinition.defaultValue);
                    }
                    else {
                        value = optionDefinition.defaultValue;
                    }
                }
                else if (optionDefinition.defaultFunction != null) {
                    value = optionDefinition.defaultFunction(element);
                }
            }
            if (value != null) {
                if (optionDefinition.validator) {
                    var isValid = optionDefinition.validator(value);
                    if (!isValid) {
                        logger.warn(componentID + " ." + name_1 + " has invalid value :  " + value);
                        if (optionDefinition.required) {
                            logger.error(componentID + " ." + name_1 + " is required and has an invalid value : " + value + ". ***THIS COMPONENT WILL NOT WORK***");
                        }
                        delete values[name_1];
                        continue;
                    }
                }
                if (optionDefinition.type == ComponentOptionsType.OBJECT && values[name_1] != null) {
                    values[name_1] = _.extend(values[name_1], value);
                }
                else if (optionDefinition.type == ComponentOptionsType.LOCALIZED_STRING) {
                    values[name_1] = Strings_1.l(value);
                }
                else {
                    values[name_1] = value;
                }
            }
        }
        for (var i = 0; i < names.length; i++) {
            var name_2 = names[i];
            var optionDefinition = options[name_2];
            if (optionDefinition.postProcessing) {
                values[name_2] = optionDefinition.postProcessing(values[name_2], values);
            }
        }
        return values;
    };
    ComponentOptions.loadStringOption = function (element, name, option) {
        return element.getAttribute(ComponentOptions.attrNameFromName(name, option)) || ComponentOptions.getAttributeFromAlias(element, option);
    };
    ComponentOptions.loadFieldOption = function (element, name, option) {
        var field = ComponentOptions.loadStringOption(element, name, option);
        Assert_1.Assert.check(!Utils_1.Utils.isNonEmptyString(field) || Utils_1.Utils.isCoveoField(field), field + ' is not a valid field');
        return field;
    };
    ComponentOptions.loadFieldsOption = function (element, name, option) {
        var fieldsAttr = ComponentOptions.loadStringOption(element, name, option);
        if (fieldsAttr == null) {
            return null;
        }
        var fields = fieldsAttr.split(fieldsSeperator);
        _.each(fields, function (field) {
            Assert_1.Assert.check(Utils_1.Utils.isCoveoField(field), field + ' is not a valid field');
        });
        return fields;
    };
    ComponentOptions.loadLocalizedStringOption = function (element, name, option) {
        var attributeValue = ComponentOptions.loadStringOption(element, name, option);
        var locale = String['locale'] || String['defaultLocale'];
        if (locale != null && attributeValue != null) {
            var localeParts_1 = locale.toLowerCase().split('-');
            var locales = _.map(localeParts_1, function (part, i) { return localeParts_1.slice(0, i + 1).join('-'); });
            var localizers = attributeValue.match(localizer);
            if (localizers != null) {
                for (var i = 0; i < localizers.length; i++) {
                    var groups = localizer.exec(localizers[i]);
                    if (groups != null) {
                        var lang = groups[1].toLowerCase();
                        if (_.contains(locales, lang)) {
                            return groups[2].replace(/^\s+|\s+$/g, '');
                        }
                    }
                }
            }
            return attributeValue != null ? attributeValue.toLocaleString() : null;
        }
        return attributeValue;
    };
    ComponentOptions.loadNumberOption = function (element, name, option) {
        var attributeValue = ComponentOptions.loadStringOption(element, name, option);
        if (attributeValue == null) {
            return null;
        }
        var numberValue = option.float === true ? Utils_1.Utils.parseFloatIfNotUndefined(attributeValue) : Utils_1.Utils.parseIntIfNotUndefined(attributeValue);
        if (option.min != null && option.min > numberValue) {
            new Logger_1.Logger(element).info("Value for option " + name + " is less than the possible minimum (Value is " + numberValue + ", minimum is " + option.min + "). It has been forced to it's minimum value.", option);
            numberValue = option.min;
        }
        if (option.max != null && option.max < numberValue) {
            new Logger_1.Logger(element).info("Value for option " + name + " is higher than the possible maximum (Value is " + numberValue + ", maximum is " + option.max + "). It has been forced to it's maximum value.", option);
            numberValue = option.max;
        }
        return numberValue;
    };
    ComponentOptions.loadBooleanOption = function (element, name, option) {
        return Utils_1.Utils.parseBooleanIfNotUndefined(ComponentOptions.loadStringOption(element, name, option));
    };
    ComponentOptions.loadListOption = function (element, name, option) {
        var separator = option.separator || /\s*,\s*/;
        var attributeValue = ComponentOptions.loadStringOption(element, name, option);
        return Utils_1.Utils.isNonEmptyString(attributeValue) ? attributeValue.split(separator) : null;
    };
    ComponentOptions.loadEnumOption = function (element, name, option, _enum) {
        var enumAsString = ComponentOptions.loadStringOption(element, name, option);
        return enumAsString != null ? _enum[enumAsString] : null;
    };
    ComponentOptions.loadSelectorOption = function (element, name, option, doc) {
        if (doc === void 0) { doc = document; }
        var attributeValue = ComponentOptions.loadStringOption(element, name, option);
        return Utils_1.Utils.isNonEmptyString(attributeValue) ? doc.querySelector(attributeValue) : null;
    };
    ComponentOptions.loadChildHtmlElementOption = function (element, name, option, doc) {
        if (doc === void 0) { doc = document; }
        var htmlElement;
        // Attribute: selector
        var selectorAttr = option.selectorAttr || ComponentOptions.attrNameFromName(name, option) + '-selector';
        var selector = element.getAttribute(selectorAttr) || ComponentOptions.getAttributeFromAlias(element, option);
        if (selector != null) {
            htmlElement = doc.body.querySelector(selector);
        }
        // Child
        if (htmlElement == null) {
            var childSelector = option.childSelector;
            if (childSelector == null) {
                childSelector = '.' + name;
            }
            htmlElement = ComponentOptions.loadChildHtmlElementFromSelector(element, childSelector);
        }
        return htmlElement;
    };
    ComponentOptions.loadChildHtmlElementFromSelector = function (element, selector) {
        Assert_1.Assert.isNonEmptyString(selector);
        if (Dom_1.$$(element).is(selector)) {
            return element;
        }
        return Dom_1.$$(element).find(selector);
    };
    ComponentOptions.loadChildrenHtmlElementFromSelector = function (element, selector) {
        Assert_1.Assert.isNonEmptyString(selector);
        return Dom_1.$$(element).findAll(selector);
    };
    ComponentOptions.loadTemplateOption = function (element, name, option, doc) {
        if (doc === void 0) { doc = document; }
        var template;
        // Attribute: template selector
        var selectorAttr = option.selectorAttr || ComponentOptions.attrNameFromName(name, option) + '-selector';
        var selector = element.getAttribute(selectorAttr) || ComponentOptions.getAttributeFromAlias(element, option);
        if (selector != null) {
            var templateElement = doc.querySelector(selector);
            if (templateElement != null) {
                template = ComponentOptions.createResultTemplateFromElement(templateElement);
            }
        }
        // Attribute: template id
        if (template == null) {
            var idAttr = option.idAttr || ComponentOptions.attrNameFromName(name, option) + '-id';
            var id = element.getAttribute(idAttr) || ComponentOptions.getAttributeFromAlias(element, option);
            if (id != null) {
                template = ComponentOptions.loadResultTemplateFromId(id);
            }
        }
        // Child
        if (template == null) {
            var childSelector = option.childSelector;
            if (childSelector == null) {
                childSelector = '.' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
            }
            template = ComponentOptions.loadChildrenResultTemplateFromSelector(element, childSelector);
        }
        return template;
    };
    ComponentOptions.loadResultTemplateFromId = function (templateId) {
        return Utils_1.Utils.isNonEmptyString(templateId) ? TemplateCache_1.TemplateCache.getTemplate(templateId) : null;
    };
    ComponentOptions.loadChildrenResultTemplateFromSelector = function (element, selector) {
        var foundElements = ComponentOptions.loadChildrenHtmlElementFromSelector(element, selector);
        if (foundElements.length > 0) {
            return new TemplateList_1.TemplateList(_.compact(_.map(foundElements, function (element) { return ComponentOptions.createResultTemplateFromElement(element); })));
        }
        return null;
    };
    ComponentOptions.findParentScrolling = function (element, doc) {
        if (doc === void 0) { doc = document; }
        while (element != doc && element != null) {
            if (ComponentOptions.isElementScrollable(element)) {
                if (element.tagName.toLowerCase() !== 'body') {
                    return element;
                }
                return window;
            }
            element = element.parentElement;
        }
        return window;
    };
    ComponentOptions.isElementScrollable = function (element) {
        return Dom_1.$$(element).css('overflow-y') == 'scroll' || element.style.overflowY == 'scroll';
    };
    ComponentOptions.getAttributeFromAlias = function (element, option) {
        if (_.isArray(option.alias)) {
            var attributeFound_1;
            _.each(option.alias, function (alias) {
                var attributeFoundWithThisAlias = element.getAttribute(ComponentOptions.attrNameFromName(alias));
                if (attributeFoundWithThisAlias) {
                    attributeFound_1 = attributeFoundWithThisAlias;
                }
            });
            return attributeFound_1;
        }
        else {
            return element.getAttribute(ComponentOptions.attrNameFromName(option.alias));
        }
    };
    ComponentOptions.createResultTemplateFromElement = function (element) {
        Assert_1.Assert.exists(element);
        var type = element.getAttribute('type');
        var mimeTypes = 'You must specify the type of template. Valid values are :' +
            ' ' + UnderscoreTemplate_1.UnderscoreTemplate.mimeTypes.toString() +
            ' ' + HtmlTemplate_1.HtmlTemplate.mimeTypes.toString();
        Assert_1.Assert.check(Utils_1.Utils.isNonEmptyString(type), mimeTypes);
        if (_.indexOf(UnderscoreTemplate_1.UnderscoreTemplate.mimeTypes, type.toLowerCase()) != -1) {
            return UnderscoreTemplate_1.UnderscoreTemplate.create(element);
        }
        else if (_.indexOf(HtmlTemplate_1.HtmlTemplate.mimeTypes, type.toLowerCase()) != -1) {
            return new HtmlTemplate_1.HtmlTemplate(element);
        }
        else {
            Assert_1.Assert.fail('Cannot guess template type from attribute: ' + type + '. Valid values are ' + mimeTypes);
            return undefined;
        }
    };
    return ComponentOptions;
}());
exports.ComponentOptions = ComponentOptions;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var L10N_1 = __webpack_require__(107);
function l() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    return L10N_1.L10N.format.apply(this, arguments);
}
exports.l = l;
;


/***/ }),
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsActionCauseList = {
    interfaceLoad: {
        name: 'interfaceLoad',
        type: 'interface'
    },
    interfaceChange: {
        name: 'interfaceChange',
        type: 'interface',
        metaMap: { interfaceChangeTo: 1 }
    },
    contextRemove: {
        name: 'contextRemove',
        type: 'misc',
        metaMap: { contextName: 1 }
    },
    didyoumeanAutomatic: {
        name: 'didyoumeanAutomatic',
        type: 'misc'
    },
    didyoumeanClick: {
        name: 'didyoumeanClick',
        type: 'misc'
    },
    resultsSort: {
        name: 'resultsSort',
        type: 'misc',
        metaMap: { resultsSortBy: 1 }
    },
    searchboxSubmit: {
        name: 'searchboxSubmit',
        type: 'search box'
    },
    searchboxClear: {
        name: 'searchboxClear',
        type: 'search box'
    },
    searchboxAsYouType: {
        name: 'searchboxAsYouType',
        type: 'search box'
    },
    breadcrumbFacet: {
        name: 'breadcrumbFacet',
        type: 'breadcrumb',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    breadcrumbResetAll: {
        name: 'breadcrumbResetAll',
        type: 'breadcrumb',
    },
    documentTag: {
        name: 'documentTag',
        type: 'document',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    documentField: {
        name: 'documentField',
        type: 'document',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    documentQuickview: {
        name: 'documentQuickview',
        type: 'document',
        metaMap: { documentTitle: 1, documentURL: 2 }
    },
    documentOpen: {
        name: 'documentOpen',
        type: 'document',
        metaMap: { documentTitle: 1, documentURL: 2 }
    },
    omniboxFacetSelect: {
        name: 'omniboxFacetSelect',
        type: 'omnibox',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    omniboxFacetExclude: {
        name: 'omniboxFacetExclude',
        type: 'omnibox',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    omniboxFacetDeselect: {
        name: 'omniboxFacetDeselect',
        type: 'omnibox',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    omniboxFacetUnexclude: {
        name: 'omniboxFacetUnexclude',
        type: 'omnibox',
        metaMap: { faceId: 1, facetValue: 2, facetTitle: 3 }
    },
    omniboxAnalytics: {
        name: 'omniboxAnalytics',
        type: 'omnibox',
        metaMap: {
            partialQuery: 1,
            suggestionRanking: 2,
            partialQueries: 3,
            suggestions: 4
        }
    },
    omniboxFromLink: {
        name: 'omniboxFromLink',
        type: 'omnibox',
        metaMap: {
            partialQuery: 1,
            suggestionRanking: 2,
            partialQueries: 3,
            suggestions: 4
        }
    },
    omniboxField: {
        name: 'omniboxField',
        type: 'omnibox'
    },
    facetClearAll: {
        name: 'facetClearAll',
        type: 'facet',
        metaMap: { facetId: 1 }
    },
    facetSearch: {
        name: 'facetSearch',
        type: 'facet',
        metaMap: { facetId: 1 }
    },
    facetToggle: {
        name: 'facetToggle',
        type: 'facet',
        metaMap: { facetId: 1, facetOperatorBefore: 2, facetOperatorAfter: 3 }
    },
    facetRangeSlider: {
        name: 'facetRangeSlider',
        type: 'facet',
        metaMap: { facetId: 1, facetRangeStart: 2, facetRangeEnd: 3 }
    },
    facetRangeGraph: {
        name: 'facetRangeGraph',
        type: 'facet',
        metaMap: { facetId: 1, facetRangeStart: 2, facetRangeEnd: 3 }
    },
    facetSelect: {
        name: 'facetSelect',
        type: 'facet',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    facetSelectAll: {
        name: 'facetSelectAll',
        type: 'facet',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    facetDeselect: {
        name: 'facetDeselect',
        type: 'facet',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    facetExclude: {
        name: 'facetExclude',
        type: 'facet',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    facetUnexclude: {
        name: 'facetUnexclude',
        type: 'facet',
        metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
    },
    errorBack: {
        name: 'errorBack',
        type: 'errors'
    },
    errorClearQuery: {
        name: 'errorClearQuery',
        type: 'errors'
    },
    errorRetry: {
        name: 'errorRetry',
        type: 'errors'
    },
    noResultsBack: {
        name: 'noResultsBack',
        type: 'noResults'
    },
    expandToFullUI: {
        name: 'expandToFullUI',
        type: 'interface'
    },
    caseCreationInputChange: {
        name: 'inputChange',
        type: 'caseCreation'
    },
    caseCreationSubmitButton: {
        name: 'submitButton',
        type: 'caseCreation'
    },
    caseCreationCancelButton: {
        name: 'cancelButton',
        type: 'caseCreation'
    },
    caseCreationUnloadPage: {
        name: 'unloadPage',
        type: 'caseCreation'
    },
    casecontextAdd: {
        name: 'casecontextAdd',
        type: 'casecontext',
        metaMap: { caseID: 5 }
    },
    casecontextRemove: {
        name: 'casecontextRemove',
        type: 'casecontext',
        metaMap: { caseID: 5 }
    },
    preferencesChange: {
        name: 'preferencesChange',
        type: 'preferences',
        metaMap: { preferenceName: 1, preferenceType: 2 }
    },
    getUserHistory: {
        name: 'getUserHistory',
        type: 'userHistory'
    },
    userActionDocumentClick: {
        name: 'userActionDocumentClick',
        type: 'userHistory'
    },
    caseAttach: {
        name: 'caseAttach',
        type: 'case',
        metaMap: { documentTitle: 1, resultUriHash: 3, articleID: 4, caseID: 5 }
    },
    caseDetach: {
        name: 'caseDetach',
        type: 'case',
        metaMap: { documentTitle: 1, resultUriHash: 3, articleID: 4, caseID: 5 }
    },
    customfiltersChange: {
        name: 'customfiltersChange',
        type: 'customfilters',
        metaMap: { customFilterName: 1, customFilterType: 2, customFilterExpression: 3 }
    },
    pagerNumber: {
        name: 'pagerNumber',
        type: 'getMoreResults',
        metaMap: { 'pagerNumber': 1 }
    },
    pagerNext: {
        name: 'pagerNext',
        type: 'getMoreResults',
        metaMap: { 'pagerNumber': 1 }
    },
    pagerPrevious: {
        name: 'pagerPrevious',
        type: 'getMoreResults',
        metaMap: { 'pagerNumber': 1 }
    },
    pagerScrolling: {
        name: 'pagerScrolling',
        type: 'getMoreResults'
    },
    pagerResize: {
        name: 'pagerResize',
        type: 'getMoreResults'
    },
    searchFromLink: {
        name: 'searchFromLink',
        type: 'interface'
    },
    triggerNotify: {
        name: 'notify',
        type: 'queryPipelineTriggers'
    },
    triggerExecute: {
        name: 'execute',
        type: 'queryPipelineTriggers'
    },
    triggerQuery: {
        name: 'query',
        type: 'queryPipelineTriggers'
    },
    triggerRedirect: {
        name: 'redirect',
        type: 'queryPipelineTriggers'
    },
    queryError: {
        name: 'query',
        type: 'errors',
        metaMap: { 'query': 1, 'aq': 2, 'cq': 3, 'dq': 4, 'errorType': 5, 'errorMessage': 6 }
    },
    exportToExcel: {
        name: 'exportToExcel',
        type: 'misc'
    },
    recommendation: {
        name: 'recommendation',
        type: 'recommendation'
    },
    recommendationInterfaceLoad: {
        name: 'recommendationInterfaceLoad',
        type: 'recommendation'
    },
    recommendationOpen: {
        name: 'recommendationOpen',
        type: 'recommendation'
    },
    advancedSearch: {
        name: 'advancedSearch',
        type: 'advancedSearch'
    },
    searchAlertsFollowDocument: {
        name: 'followDocument',
        type: 'searchAlerts'
    },
    searchAlertsFollowQuery: {
        name: 'followQuery',
        type: 'searchAlerts'
    },
    searchAlertsUpdateSubscription: {
        name: 'updateSubscription',
        type: 'searchAlerts'
    },
    searchAlertsDeleteSubscription: {
        name: 'deleteSubscription',
        type: 'searchAlerts'
    },
    searchAlertsUnfollowDocument: {
        name: 'unfollowDocument',
        type: 'searchAlerts'
    },
    searchAlertsUnfollowQuery: {
        name: 'unfollowQuery',
        type: 'searchAlerts'
    },
    resultsLayoutChange: {
        name: 'changeResultsLayout',
        type: 'resultsLayout'
    }
};


/***/ }),
/* 12 */
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
var Model_1 = __webpack_require__(15);
var Assert_1 = __webpack_require__(6);
var _ = __webpack_require__(0);
var Utils_1 = __webpack_require__(4);
exports.QUERY_STATE_ATTRIBUTES = {
    Q: 'q',
    FIRST: 'first',
    T: 't',
    TG: 'tg',
    SORT: 'sort',
    LAYOUT: 'layout',
    HD: 'hd',
    HQ: 'hq',
    QUICKVIEW: 'quickview'
};
/**
 * The QueryStateModel is a key->value store of the state of every component that can affect a query.<br/>
 * Component set values in this key -> value store, and listen to event triggered to react accordingly.<br/>
 * For example, when a query is launched, the searchbox will set the 'q' attribute, the pager will set the 'first' attribute, etc.<br/>
 * At the same time, this class will trigger the associated event when a value is modified.<br/>
 * eg : The user change the content of the searchbox, and submit a query. This will trigger the following events :<br/>
 * -- state:change:q (because the value of 'q' changed)</br>
 * -- state:change (because at least one value changed in the query state)<br/>
 * Component or external code could hook handler on those events : document.addEventListener('state:change:q', handler);<br/>
 * See : {@link Model}, as all the relevant method are exposed in the base class.<br/>
 * Optionally, the state can be persisted to the query string to allow browser history management : See {@link HistoryController}
 */
var QueryStateModel = (function (_super) {
    __extends(QueryStateModel, _super);
    /**
     * Create a new QueryState
     * @param element
     * @param attributes
     * @param bindings
     */
    function QueryStateModel(element, attributes) {
        var _this = this;
        var merged = _.extend({}, QueryStateModel.defaultAttributes, attributes);
        _this = _super.call(this, element, QueryStateModel.ID, merged) || this;
        return _this;
    }
    QueryStateModel.getFacetId = function (id, include) {
        if (include === void 0) { include = true; }
        return 'f:' + id + (include ? '' : ':not');
    };
    QueryStateModel.getFacetOperator = function (id) {
        return 'f:' + id + ':operator';
    };
    QueryStateModel.getFacetLookupValue = function (id) {
        return QueryStateModel.getFacetId(id) + ':lookupvalues';
    };
    /**
     * Determine if at least one facet is currently active in the interface (this means that a facet has selected or excluded values)
     * @returns {boolean}
     */
    QueryStateModel.prototype.atLeastOneFacetIsActive = function () {
        return !_.isUndefined(_.find(this.attributes, function (value, key) {
            return key.indexOf('f:') == 0 && Utils_1.Utils.isNonEmptyArray(value);
        }));
    };
    QueryStateModel.prototype.set = function (attribute, value, options) {
        this.validate(attribute, value);
        _super.prototype.set.call(this, attribute, value, options);
    };
    QueryStateModel.prototype.validate = function (attribute, value) {
        if (attribute == QueryStateModel.attributesEnum.first) {
            Assert_1.Assert.isNumber(value);
            Assert_1.Assert.isLargerOrEqualsThan(0, value);
        }
    };
    return QueryStateModel;
}(Model_1.Model));
QueryStateModel.ID = 'state';
QueryStateModel.defaultAttributes = {
    q: '',
    first: 0,
    t: '',
    hd: '',
    hq: '',
    sort: '',
    layout: 'list',
    tg: '',
    quickview: ''
};
QueryStateModel.attributesEnum = {
    q: 'q',
    first: 'first',
    t: 't',
    sort: 'sort',
    layout: 'layout',
    hd: 'hd',
    hq: 'hq',
    tg: 'tg',
    quickview: 'quickview'
};
exports.QueryStateModel = QueryStateModel;
function setState(model, args) {
    Assert_1.Assert.exists(model);
    if (args.length == 0 || args[0] == undefined) {
        // No args means return the model
        return model;
    }
    else if (args.length == 1 && Utils_1.Utils.isNonEmptyString(args[0])) {
        // One string arg means retrieve value from model
        return model.get(args[0]);
    }
    else if (_.isObject(args[0])) {
        // One dictionary means set multiple values
        var toSet = args[0];
        var options = _.extend({ customAttribute: true }, args[1]);
        return model.setMultiple(toSet, options);
    }
    else if (args.length > 1) {
        // Otherwise we're setting a value
        var name_1 = args[0];
        var value = args[1];
        var options = _.extend({ customAttribute: true }, args[2]);
        Assert_1.Assert.isNonEmptyString(name_1);
        return model.set(name_1, value, options);
    }
}
exports.setState = setState;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Ensure that we're not going to get console is undefined error in IE8-9
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
            console.log([level, this.owner].concat(stuff));
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class is there to contain the different string definitions for all the events related to initialization.
 *
 * Note that these events will only be triggered when the {@link init} function is called.
 *
 * This means these events are normally called only once when the search interface is initialized.
 */
var InitializationEvents = (function () {
    function InitializationEvents() {
    }
    return InitializationEvents;
}());
/**
 * This event is triggered right before each components inside the search interface get initialized (eg: Before the constructor of each component is executed).
 *
 * The string value is `beforeInitialization`.
 * @type {string}
 */
InitializationEvents.beforeInitialization = 'beforeInitialization';
/**
 * Triggered after the components are initialized (eg: After the constructor of each component is executed)
 * but before their state is set from the hash portion of the URL (e.g., http://mysearchinterface#q=myQuery ).
 *
 * This is also before the first query is launched (if the {@link SearchInterface.options.autoTriggerQuery} is `true`).
 *
 * The string value is `afterComponentsInitialization`.
 * @type {string}
 */
InitializationEvents.afterComponentsInitialization = 'afterComponentsInitialization';
/**
 * Triggered right before the state from the URL (e.g., http://mysearchinterface#q=myQuery ) gets applied in the interface.
 *
 * This will typically only be useful if the {@link SearchInterface.options.enableHistory} is set to `true`.
 *
 * The string value is `restoreHistoryState`.
 * @type {string}
 */
InitializationEvents.restoreHistoryState = 'restoreHistoryState';
/**
 * Triggered right after the UI is fully initialized.
 *
 * Concretely this means that the constructor of each component has been executed, and that the state coming for the URL (e.g., http://mysearchinterface#q=myquery) has been applied.
 *
 * It is triggered *before* the first query is launched, and if the {@link SearchInterface.options.autoTriggerQuery} is `true`.
 *
 * The string value is `afterInitialization`.
 * @type {string}
 */
InitializationEvents.afterInitialization = 'afterInitialization';
/**
 * This is triggered when the UI needs to be dynamically removed so that components can unbind any internal handlers they might have set globally on the window or the document.
 *
 * After this event has been executed, the search interface can be dynamically removed and all handlers can be considered cleanly removed.
 *
 * The string value is `nuke`.
 * @type {string}
 */
InitializationEvents.nuke = 'nuke';
exports.InitializationEvents = InitializationEvents;


/***/ }),
/* 15 */
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
var Dom_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(6);
var Utils_1 = __webpack_require__(4);
var BaseComponent_1 = __webpack_require__(28);
var _ = __webpack_require__(0);
exports.MODEL_EVENTS = {
    PREPROCESS: 'preprocess',
    CHANGE_ONE: 'change:',
    CHANGE: 'change',
    RESET: 'reset',
    ALL: 'all'
};
/**
 * A *model* is a key-value store that triggers various JavaScript events when any value associated to one of its key changes.<br/>
 * This class is meant to be extended, one of the most important extension being the {@link QueryStateModel} class.<br/>
 * Components set values in this key-value store and listen to triggered events in order to update themselves accordingly.<br/>
 */
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(element, id, attributes) {
        var _this = _super.call(this, element, id) || this;
        _this.eventNameSpace = id;
        _this.defaultAttributes = Utils_1.Utils.extendDeep(_this.defaultAttributes, attributes);
        _this.attributes = attributes;
        _this.logger.debug('Creating model');
        return _this;
    }
    /**
     * Sets the value of a single specific attribute.</br>
     * Note: this method calls the `setMultiple` method.
     * @param attribute
     * the specific attribute whose value is to be set.
     * @param value
     * the value to set the attribute to.
     * @param options
     * the options (see {@link setMultiple}).
     */
    Model.prototype.set = function (attribute, value, options) {
        var toSet = {};
        toSet[attribute] = value;
        this.setMultiple(toSet, options);
    };
    /**
     * Gets an object containing all *active* registered attribute key-values.</br>
     * An attribute is considered active when its value is not in its default state.
     * @returns {{object}}
     */
    Model.prototype.getAttributes = function () {
        var _this = this;
        var attributes = {};
        _.each(this.attributes, function (attribute, key) {
            if (_.isObject(attribute)) {
                if (!Utils_1.Utils.objectEqual(attribute, _this.defaultAttributes[key])) {
                    attributes[key] = attribute;
                }
            }
            else if (attribute != _this.defaultAttributes[key]) {
                attributes[key] = attribute;
            }
        });
        return attributes;
    };
    /**
     * Sets the values of one or many attributes.</br>
     * This method may trigger the following events (in order):</br>
     * • `preprocess`</br>
     * • `changeOne`</br>
     * • `change`</br>
     * • `all`
     * @param toSet
     * the key-value list of attributes with their new intended values.
     * @param options
     * if the `customAttribute` option is set to `true`, the method will not validate whether an attribute is registered or not.</br>
     * If the `validateType` option is set to `true`, the method will ensure that each value type is correct.</br>
     * If the `silent` option is set to `true`, then the `changeOne`, `change` and `all` events will not be triggered.
     */
    Model.prototype.setMultiple = function (toSet, options) {
        var _this = this;
        var anythingChanged = false;
        this.preprocessEvent(toSet);
        _.each(toSet, function (value, attribute) {
            if (!options || !options.customAttribute) {
                _this.checkIfAttributeExists(attribute);
            }
            value = _this.parseToCorrectType(attribute, value);
            if (!options || options.validateType) {
                if (!_this.typeIsValid(attribute, value)) {
                    return;
                }
            }
            if (_this.checkIfAttributeChanged(attribute, value)) {
                _this.attributes[attribute] = value;
                anythingChanged = true;
                if (options == null || !options.silent) {
                    _this.attributeHasChangedEvent(attribute);
                }
            }
        });
        if (anythingChanged && (options == null || !options.silent)) {
            this.attributesHasChangedEvent();
            this.anyEvent();
        }
    };
    /**
     * Sets a new default value to a single specific attribute.</br>
     * Note: specifying a new attribute default value does not set the attribute to that value. This can be done using the {@link setDefault} method.
     * @param attribute
     * the specific attribute whose default value is to be changed.
     * @param value
     * the new intended default value.
     * @param options
     * if the `customAttribute` option is set to `true`, the method will not validate whether the attribute is registered or not.
     */
    Model.prototype.setNewDefault = function (attribute, value, options) {
        if (!options || !options.customAttribute) {
            this.checkIfAttributeExists(attribute);
        }
        this.defaultAttributes[attribute] = value;
    };
    /**
     * Sets a single specific attribute to its default value.</br>
     * Note: this method calls the {@link setMultiple} method without specifying any option.
     * @param attribute
     * the specific attribute whose value is to be set to its default value.
     */
    Model.prototype.setDefault = function (attribute) {
        this.set(attribute, this.defaultAttributes[attribute]);
    };
    /**
     * Gets the value of a single specific attribute.</br>
     * If no attribute is specified, the method instead returns an object containing all registered attribute key-values.
     * @param attribute
     * the specific attribute whose value should be returned.
     * @returns {any}
     */
    Model.prototype.get = function (attribute) {
        if (attribute == undefined) {
            return this.attributes;
        }
        else {
            return this.attributes[attribute];
        }
    };
    /**
     * Gets the default value of a single specific attribute.</br>
     * If no attribute is specified, the method instead returns an object containing all registered attribute key-default values.
     * @param attribute
     * the specific attribute whose default value should be returned.
     * @returns {any}
     */
    Model.prototype.getDefault = function (attribute) {
        if (attribute == undefined) {
            return this.defaultAttributes;
        }
        else {
            return this.defaultAttributes[attribute];
        }
    };
    /**
     * Resets each registered attribute to its default value.</br>
     * Note: this method calls the {@link setMultiple} method without specifying any options.</br>
     * After the `setMultiple` call has returned, this method triggers the `reset` event.
     */
    Model.prototype.reset = function () {
        this.setMultiple(this.defaultAttributes);
        this.modelWasResetEvent();
    };
    /**
     * Registers a new attribute key-value.
     * @param attribute
     * the name of the new attribute to register.
     * @param defaultValue
     * the newly registered attribute default value.
     */
    Model.prototype.registerNewAttribute = function (attribute, defaultValue) {
        this.defaultAttributes[attribute] = defaultValue;
        this.attributes[attribute] = defaultValue;
    };
    /**
     * Gets a string displaying the event namespace followed by the specific event name. The returned string is formatted thus:</br>
     * `[eventNameSpace]:[eventName]`
     * @example `getEventName("reset");` could return `"state:reset"`.
     * @param event
     * the event name.
     * @returns {string}
     */
    Model.prototype.getEventName = function (event) {
        return this.eventNameSpace + ':' + event;
    };
    Model.prototype.attributesHasChangedEvent = function () {
        Dom_1.$$(this.element).trigger(this.getEventName(Model.eventTypes.change), this.createAttributesChangedArgument());
    };
    Model.prototype.attributeHasChangedEvent = function (attr) {
        Dom_1.$$(this.element).trigger(this.getEventName(Model.eventTypes.changeOne) + attr, this.createAttributeChangedArgument(attr));
    };
    Model.prototype.preprocessEvent = function (attributes) {
        Dom_1.$$(this.element).trigger(this.getEventName(Model.eventTypes.preprocess), attributes);
    };
    Model.prototype.modelWasResetEvent = function () {
        Dom_1.$$(this.element).trigger(this.getEventName(Model.eventTypes.reset), this.createModelChangedArgument());
    };
    Model.prototype.anyEvent = function () {
        Dom_1.$$(this.element).trigger(this.getEventName(Model.eventTypes.all), this.createModelChangedArgument());
    };
    Model.prototype.createAttributeChangedArgument = function (attribute) {
        return { attribute: attribute, value: this.attributes[attribute] };
    };
    Model.prototype.createAttributesChangedArgument = function () {
        return { attributes: this.attributes };
    };
    Model.prototype.createModelChangedArgument = function () {
        return { model: this };
    };
    Model.prototype.checkIfAttributeExists = function (attribute) {
        Assert_1.Assert.check(_.has(this.attributes, attribute));
    };
    Model.prototype.typeIsValid = function (attribute, value) {
        if (!Utils_1.Utils.isNullOrUndefined(this.attributes[attribute]) && !Utils_1.Utils.isUndefined(value)) {
            if (_.isNumber(this.attributes[attribute])) {
                return this.validateNumber(attribute, value);
            }
            else if (_.isBoolean(this.attributes[attribute])) {
                return this.validateBoolean(attribute, value);
            }
            else {
                return this.validateOther(attribute, value);
            }
        }
        return true;
    };
    Model.prototype.validateNumber = function (attribute, value) {
        if (!_.isNumber(value) || isNaN(value)) {
            this.logger.error("Non-matching type for " + attribute + ". Expected number and got " + value);
            return false;
        }
        return true;
    };
    Model.prototype.validateBoolean = function (attribute, value) {
        if (!_.isBoolean(value) && !Utils_1.Utils.parseBooleanIfNotUndefined(value) !== undefined) {
            this.logger.error("Non matching type for " + attribute + ". Expected boolean and got " + value);
            return false;
        }
        return true;
    };
    Model.prototype.validateOther = function (attribute, value) {
        if (!Utils_1.Utils.isNullOrUndefined(this.defaultAttributes[attribute])) {
            if (typeof value !== typeof this.defaultAttributes[attribute]) {
                this.logger.error("Non-matching type for " + attribute + ". Expected " + typeof this.defaultAttributes[attribute] + " and got " + value);
                return false;
            }
        }
        return true;
    };
    Model.prototype.parseToCorrectType = function (attribute, value) {
        if (_.isNumber(this.attributes[attribute])) {
            return parseInt(value, 10);
        }
        else if (_.isBoolean(this.attributes[attribute])) {
            if (_.isBoolean(value)) {
                return value;
            }
            else {
                return Utils_1.Utils.parseBooleanIfNotUndefined(value);
            }
        }
        return value;
    };
    Model.prototype.checkIfAttributeChanged = function (attribute, newValue) {
        var oldValue = this.attributes[attribute];
        if (_.isNumber(oldValue) || _.isString(oldValue) || _.isBoolean(oldValue)) {
            return oldValue !== newValue;
        }
        if (_.isArray(oldValue)) {
            return !Utils_1.Utils.arrayEqual(oldValue, newValue);
        }
        if (_.isObject(oldValue)) {
            return !Utils_1.Utils.objectEqual(oldValue, newValue);
        }
        return true;
    };
    Model.prototype.debugInfo = function () {
        return null;
    };
    return Model;
}(BaseComponent_1.BaseComponent));
/**
 * The event types that can be triggered:<br/>
 * • `preprocess`: triggered before a value is set on an attribute. This allows the value to be modified before it is set.<br/>
 * • `changeOne`: triggered when a single value changes.</br>
 * • `change`: triggered when one or many values change.</br>
 * • `reset`: triggered when all attributes are reset to their default values. </br>
 * • `all`: triggered after the `change` event.</br>
 * @type {{preprocess: string, changeOne: string, change: string, reset: string, all: string}}
 */
Model.eventTypes = {
    preprocess: 'preprocess',
    changeOne: 'change:',
    change: 'change',
    reset: 'reset',
    all: 'all'
};
exports.Model = Model;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Not sure about this : In year 2033 who's to say that this list won't be 50 pages long !
var ResponsiveComponents_1 = __webpack_require__(38);
var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var DeviceUtils = (function () {
    function DeviceUtils() {
    }
    DeviceUtils.getDeviceName = function () {
        var userAgent = navigator.userAgent;
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
        if (userAgent.match(/Opera Mini/i)) {
            return 'Opera Mini';
        }
        if (userAgent.match(/IEMobile/i)) {
            return 'IE Mobile';
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(2);
var latinize = __webpack_require__(224);
var _ = __webpack_require__(0);
var StringUtils = (function () {
    function StringUtils() {
    }
    StringUtils.javascriptEncode = function (value) {
        Assert_1.Assert.isString(value);
        value = value.replace(/\\/g, '\\\\');
        value = value.replace(/'/g, '\\\'');
        value = value.replace(/"/g, '\\"');
        return value;
    };
    StringUtils.htmlEncode = function (value) {
        Assert_1.Assert.isString(value);
        var div = Dom_1.$$('div');
        div.text(value);
        return div.el.innerHTML;
    };
    StringUtils.splice = function (value, index, remove, toAdd) {
        return value.slice(0, index) + toAdd + value.slice(index + Math.abs(remove));
    };
    StringUtils.removeMiddle = function (value, length, toAdd) {
        if (value.length < length) {
            return value;
        }
        var toRemove = value.length - length;
        var index = Math.floor(length / 2);
        return StringUtils.splice(value, index, toRemove, toAdd);
    };
    StringUtils.regexEncode = function (value) {
        Assert_1.Assert.isString(value);
        return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    };
    StringUtils.stringToRegex = function (value, ignoreAccent) {
        if (ignoreAccent === void 0) { ignoreAccent = false; }
        Assert_1.Assert.isString(value);
        var encoded = StringUtils.regexEncode(value);
        if (ignoreAccent) {
            return _.map(encoded, function (char) {
                var regexp = _.find(StringUtils.accented, function (regexp) { return char.match(regexp) != null; });
                if (regexp) {
                    return regexp.source;
                }
                return char;
            }).join('');
        }
        return encoded;
    };
    StringUtils.wildcardsToRegex = function (value, ignoreAccent) {
        if (ignoreAccent === void 0) { ignoreAccent = false; }
        Assert_1.Assert.isString(value);
        var encoded = StringUtils.stringToRegex(value, ignoreAccent);
        encoded = encoded.replace(/\\\*/, '.*');
        encoded = encoded.replace(/\\\?/, '.');
        return encoded;
    };
    StringUtils.getHighlights = function (strToSearch, regexToFind, dataHighlightGroupTerm) {
        var match, indexes = [];
        while (match = regexToFind.exec(strToSearch)) {
            var desiredMatch = match[2];
            var undesiredMatch = match[1];
            var offset = match.index + undesiredMatch.length;
            indexes.push({ offset: offset, length: desiredMatch.length, dataHighlightGroupTerm: dataHighlightGroupTerm });
            if (!regexToFind.global) {
                break;
            }
        }
        return _.isEmpty(indexes) ? undefined : indexes;
    };
    StringUtils.encodeCarriageReturn = function (strToEncode) {
        Assert_1.Assert.isString(strToEncode);
        return strToEncode.replace(/\n/g, '<br/>');
    };
    StringUtils.equalsCaseInsensitive = function (str1, str2) {
        return str1.toLowerCase() == str2.toLowerCase();
    };
    StringUtils.match = function (value, regex) {
        var results = [];
        var arr;
        while ((arr = regex.exec(value)) !== null) {
            results.push(arr);
        }
        return results;
    };
    StringUtils.hashCode = function (str) {
        var hash = 0;
        var len = str.length;
        for (var i = 0; i < len; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    };
    // http://stackoverflow.com/a/25575009
    StringUtils.latinize = function (str) {
        return latinize(str);
    };
    return StringUtils;
}());
StringUtils.accented = {
    'A': /[Aa\xaa\xc0-\xc5\xe0-\xe5\u0100-\u0105\u01cd\u01ce\u0200-\u0203\u0226\u0227\u1d2c\u1d43\u1e00\u1e01\u1e9a\u1ea0-\u1ea3\u2090\u2100\u2101\u213b\u249c\u24b6\u24d0\u3371-\u3374\u3380-\u3384\u3388\u3389\u33a9-\u33af\u33c2\u33ca\u33df\u33ff\uff21\uff41]/g,
    'B': /[Bb\u1d2e\u1d47\u1e02-\u1e07\u212c\u249d\u24b7\u24d1\u3374\u3385-\u3387\u33c3\u33c8\u33d4\u33dd\uff22\uff42]/g,
    'C': /[Cc\xc7\xe7\u0106-\u010d\u1d9c\u2100\u2102\u2103\u2105\u2106\u212d\u216d\u217d\u249e\u24b8\u24d2\u3376\u3388\u3389\u339d\u33a0\u33a4\u33c4-\u33c7\uff23\uff43]/g,
    'D': /[Dd\u010e\u010f\u01c4-\u01c6\u01f1-\u01f3\u1d30\u1d48\u1e0a-\u1e13\u2145\u2146\u216e\u217e\u249f\u24b9\u24d3\u32cf\u3372\u3377-\u3379\u3397\u33ad-\u33af\u33c5\u33c8\uff24\uff44]/g,
    'E': /[Ee\xc8-\xcb\xe8-\xeb\u0112-\u011b\u0204-\u0207\u0228\u0229\u1d31\u1d49\u1e18-\u1e1b\u1eb8-\u1ebd\u2091\u2121\u212f\u2130\u2147\u24a0\u24ba\u24d4\u3250\u32cd\u32ce\uff25\uff45]/g,
    'F': /[Ff\u1da0\u1e1e\u1e1f\u2109\u2131\u213b\u24a1\u24bb\u24d5\u338a-\u338c\u3399\ufb00-\ufb04\uff26\uff46]/g,
    'G': /[Gg\u011c-\u0123\u01e6\u01e7\u01f4\u01f5\u1d33\u1d4d\u1e20\u1e21\u210a\u24a2\u24bc\u24d6\u32cc\u32cd\u3387\u338d-\u338f\u3393\u33ac\u33c6\u33c9\u33d2\u33ff\uff27\uff47]/g,
    'H': /[Hh\u0124\u0125\u021e\u021f\u02b0\u1d34\u1e22-\u1e2b\u1e96\u210b-\u210e\u24a3\u24bd\u24d7\u32cc\u3371\u3390-\u3394\u33ca\u33cb\u33d7\uff28\uff48]/g,
    'I': /[Ii\xcc-\xcf\xec-\xef\u0128-\u0130\u0132\u0133\u01cf\u01d0\u0208-\u020b\u1d35\u1d62\u1e2c\u1e2d\u1ec8-\u1ecb\u2071\u2110\u2111\u2139\u2148\u2160-\u2163\u2165-\u2168\u216a\u216b\u2170-\u2173\u2175-\u2178\u217a\u217b\u24a4\u24be\u24d8\u337a\u33cc\u33d5\ufb01\ufb03\uff29\uff49]/g,
    'J': /[Jj\u0132-\u0135\u01c7-\u01cc\u01f0\u02b2\u1d36\u2149\u24a5\u24bf\u24d9\u2c7c\uff2a\uff4a]/g,
    'K': /[Kk\u0136\u0137\u01e8\u01e9\u1d37\u1d4f\u1e30-\u1e35\u212a\u24a6\u24c0\u24da\u3384\u3385\u3389\u338f\u3391\u3398\u339e\u33a2\u33a6\u33aa\u33b8\u33be\u33c0\u33c6\u33cd-\u33cf\uff2b\uff4b]/g,
    'L': /[Ll\u0139-\u0140\u01c7-\u01c9\u02e1\u1d38\u1e36\u1e37\u1e3a-\u1e3d\u2112\u2113\u2121\u216c\u217c\u24a7\u24c1\u24db\u32cf\u3388\u3389\u33d0-\u33d3\u33d5\u33d6\u33ff\ufb02\ufb04\uff2c\uff4c]/g,
    'M': /[Mm\u1d39\u1d50\u1e3e-\u1e43\u2120\u2122\u2133\u216f\u217f\u24a8\u24c2\u24dc\u3377-\u3379\u3383\u3386\u338e\u3392\u3396\u3399-\u33a8\u33ab\u33b3\u33b7\u33b9\u33bd\u33bf\u33c1\u33c2\u33ce\u33d0\u33d4-\u33d6\u33d8\u33d9\u33de\u33df\uff2d\uff4d]/g,
    'N': /[Nn\xd1\xf1\u0143-\u0149\u01ca-\u01cc\u01f8\u01f9\u1d3a\u1e44-\u1e4b\u207f\u2115\u2116\u24a9\u24c3\u24dd\u3381\u338b\u339a\u33b1\u33b5\u33bb\u33cc\u33d1\uff2e\uff4e]/g,
    'O': /[Oo\xba\xd2-\xd6\xf2-\xf6\u014c-\u0151\u01a0\u01a1\u01d1\u01d2\u01ea\u01eb\u020c-\u020f\u022e\u022f\u1d3c\u1d52\u1ecc-\u1ecf\u2092\u2105\u2116\u2134\u24aa\u24c4\u24de\u3375\u33c7\u33d2\u33d6\uff2f\uff4f]/g,
    'P': /[Pp\u1d3e\u1d56\u1e54-\u1e57\u2119\u24ab\u24c5\u24df\u3250\u3371\u3376\u3380\u338a\u33a9-\u33ac\u33b0\u33b4\u33ba\u33cb\u33d7-\u33da\uff30\uff50]/g,
    'Q': /[Qq\u211a\u24ac\u24c6\u24e0\u33c3\uff31\uff51]/g,
    'R': /[Rr\u0154-\u0159\u0210-\u0213\u02b3\u1d3f\u1d63\u1e58-\u1e5b\u1e5e\u1e5f\u20a8\u211b-\u211d\u24ad\u24c7\u24e1\u32cd\u3374\u33ad-\u33af\u33da\u33db\uff32\uff52]/g,
    'S': /[Ss\u015a-\u0161\u017f\u0218\u0219\u02e2\u1e60-\u1e63\u20a8\u2101\u2120\u24ae\u24c8\u24e2\u33a7\u33a8\u33ae-\u33b3\u33db\u33dc\ufb06\uff33\uff53]/g,
    'T': /[Tt\u0162-\u0165\u021a\u021b\u1d40\u1d57\u1e6a-\u1e71\u1e97\u2121\u2122\u24af\u24c9\u24e3\u3250\u32cf\u3394\u33cf\ufb05\ufb06\uff34\uff54]/g,
    'U': /[Uu\xd9-\xdc\xf9-\xfc\u0168-\u0173\u01af\u01b0\u01d3\u01d4\u0214-\u0217\u1d41\u1d58\u1d64\u1e72-\u1e77\u1ee4-\u1ee7\u2106\u24b0\u24ca\u24e4\u3373\u337a\uff35\uff55]/g,
    'V': /[Vv\u1d5b\u1d65\u1e7c-\u1e7f\u2163-\u2167\u2173-\u2177\u24b1\u24cb\u24e5\u2c7d\u32ce\u3375\u33b4-\u33b9\u33dc\u33de\uff36\uff56]/g,
    'W': /[Ww\u0174\u0175\u02b7\u1d42\u1e80-\u1e89\u1e98\u24b2\u24cc\u24e6\u33ba-\u33bf\u33dd\uff37\uff57]/g,
    'X': /[Xx\u02e3\u1e8a-\u1e8d\u2093\u213b\u2168-\u216b\u2178-\u217b\u24b3\u24cd\u24e7\u33d3\uff38\uff58]/g,
    'Y': /[Yy\xdd\xfd\xff\u0176-\u0178\u0232\u0233\u02b8\u1e8e\u1e8f\u1e99\u1ef2-\u1ef9\u24b4\u24ce\u24e8\u33c9\uff39\uff59]/g,
    'Z': /[Zz\u0179-\u017e\u01f1-\u01f3\u1dbb\u1e90-\u1e95\u2124\u2128\u24b5\u24cf\u24e9\u3390-\u3394\uff3a\uff5a]/g
};
exports.StringUtils = StringUtils;


/***/ }),
/* 19 */
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
var SearchEndpoint_1 = __webpack_require__(35);
var ComponentOptions_1 = __webpack_require__(8);
var DeviceUtils_1 = __webpack_require__(17);
var Dom_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(6);
var QueryStateModel_1 = __webpack_require__(12);
var ComponentStateModel_1 = __webpack_require__(51);
var ComponentOptionsModel_1 = __webpack_require__(24);
var QueryController_1 = __webpack_require__(31);
var Model_1 = __webpack_require__(15);
var QueryEvents_1 = __webpack_require__(10);
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(63);
var HistoryController_1 = __webpack_require__(105);
var LocalStorageHistoryController_1 = __webpack_require__(106);
var InitializationEvents_1 = __webpack_require__(14);
var NoopAnalyticsClient_1 = __webpack_require__(71);
var Utils_1 = __webpack_require__(4);
var RootComponent_1 = __webpack_require__(32);
var BaseComponent_1 = __webpack_require__(28);
var Debug_1 = __webpack_require__(256);
var HashUtils_1 = __webpack_require__(36);
var fastclick = __webpack_require__(222);
var jstz = __webpack_require__(223);
var SentryLogger_1 = __webpack_require__(246);
var AnalyticsActionListMeta_1 = __webpack_require__(11);
var ResponsiveComponents_1 = __webpack_require__(38);
var _ = __webpack_require__(0);
__webpack_require__(215);
__webpack_require__(219);
__webpack_require__(220);
/**
 * The SearchInterface component is the root and main component of your Coveo search interface. You should place all
 * other Coveo components inside the SearchInterface component.
 *
 * It is also on the HTMLElement of the SearchInterface component that you call the {@link init} function.
 *
 * It is advisable to specify a unique HTML `id` attribute for the SearchInterface component in order to be able to
 * reference it easily.
 *
 * **Example:**
 *
 * ```html
 * <head>
 *
 * [ ... ]
 *
 * <script>
 *   document.addEventListener('DOMContentLoaded', function() {
 *
 *     [ ... ]
 *     // The init function is called on the SearchInterface element, in this case, the body of the page.
 *     Coveo.init(document.body);
 *
 *     [ ... ]
 *
 *     });
 * </script>
 *
 * [ ... ]
 * </head>
 *
 * <!-- Specifying a unique HTML id attribute for the SearchInterface component is good practice. -->
 * <body id='search' class='CoveoSearchInterface' [ ... other options ... ]>
 *
 *   [ ... ]
 *
 *   <!-- You should place all other Coveo components here, inside the SearchInterface component. -->
 *
 *   [ ... ]
 *
 * </body>
 * ```
 */
var SearchInterface = (function (_super) {
    __extends(SearchInterface, _super);
    /**
     * Creates a new SearchInterface. Initialize various singletons for the interface (e.g., usage analytics, query
     * controller, state model, etc.). Binds events related to the query.
     * @param element The HTMLElement on which to instantiate the component. This cannot be an `HTMLInputElement` for
     * technical reasons.
     * @param options The options for the SearchInterface.
     * @param analyticsOptions The options for the {@link Analytics} component. Since the Analytics component is normally
     * global, it needs to be passed at initialization of the whole interface.
     * @param _window The window object for the search interface. Used for unit tests, which can pass a mock. Default is
     * the global window object.
     */
    function SearchInterface(element, options, analyticsOptions, _window) {
        if (_window === void 0) { _window = window; }
        var _this = _super.call(this, element, SearchInterface.ID) || this;
        _this.element = element;
        _this.options = options;
        _this.analyticsOptions = analyticsOptions;
        _this.isNewDesignAttribute = false;
        if (DeviceUtils_1.DeviceUtils.isMobileDevice()) {
            Dom_1.$$(document.body).addClass('coveo-mobile-device');
        }
        // The definition file for fastclick does not match the way that fast click gets loaded (AMD)
        if (fastclick.attach) {
            fastclick.attach(element);
        }
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, SearchInterface, options);
        Assert_1.Assert.exists(element);
        Assert_1.Assert.exists(_this.options);
        _this.root = element;
        _this.queryStateModel = new QueryStateModel_1.QueryStateModel(element);
        _this.componentStateModel = new ComponentStateModel_1.ComponentStateModel(element);
        _this.componentOptionsModel = new ComponentOptionsModel_1.ComponentOptionsModel(element);
        _this.usageAnalytics = _this.initializeAnalytics();
        _this.queryController = new QueryController_1.QueryController(element, _this.options, _this.usageAnalytics, _this);
        new SentryLogger_1.SentryLogger(_this.queryController);
        var eventName = _this.queryStateModel.getEventName(Model_1.Model.eventTypes.preprocess);
        Dom_1.$$(_this.element).on(eventName, function (e, args) { return _this.handlePreprocessQueryStateModel(args); });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.buildingQuery, function (e, args) { return _this.handleBuildingQuery(args); });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.querySuccess, function (e, args) { return _this.handleQuerySuccess(args); });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.queryError, function (e, args) { return _this.handleQueryError(args); });
        if (_this.options.enableHistory) {
            if (!_this.options.useLocalStorageForHistory) {
                new HistoryController_1.HistoryController(element, _window, _this.queryStateModel, _this.queryController);
            }
            else {
                new LocalStorageHistoryController_1.LocalStorageHistoryController(element, _window, _this.queryStateModel, _this.queryController);
            }
        }
        else {
            Dom_1.$$(_this.element).on(InitializationEvents_1.InitializationEvents.restoreHistoryState, function () { return _this.queryStateModel.setMultiple(_this.queryStateModel.defaultAttributes); });
        }
        var eventNameQuickview = _this.queryStateModel.getEventName(Model_1.Model.eventTypes.changeOne + QueryStateModel_1.QueryStateModel.attributesEnum.quickview);
        Dom_1.$$(_this.element).on(eventNameQuickview, function (e, args) { return _this.handleQuickviewChanged(args); });
        // shows the UI, since it's been hidden while loading
        _this.element.style.display = element.style.display || 'block';
        _this.setupDebugInfo();
        _this.isNewDesignAttribute = _this.root.getAttribute('data-design') == 'new';
        _this.responsiveComponents = new ResponsiveComponents_1.ResponsiveComponents();
        return _this;
    }
    /**
     * Attaches a component to the search interface. This allows the search interface to easily list and iterate over its
     * components.
     * @param type Normally, the component type is a unique identifier without the `Coveo` prefix (e.g., `CoveoFacet` ->
     * `Facet`, `CoveoPager` -> `Pager`, `CoveoQuerybox` -> `Querybox`, etc.).
     * @param component The component instance to attach.
     */
    SearchInterface.prototype.attachComponent = function (type, component) {
        this.getComponents(type).push(component);
    };
    /**
     * Detaches a component from the search interface.
     * @param type Normally, the component type is a unique identifier without the `Coveo` prefix (e.g., `CoveoFacet` ->
     * `Facet`, `CoveoPager` -> `Pager`, `CoveoQuerybox` -> `Querybox`, etc.).
     * @param component The component instance to detach.
     */
    SearchInterface.prototype.detachComponent = function (type, component) {
        var components = this.getComponents(type);
        var index = _.indexOf(components, component);
        if (index > -1) {
            components.splice(index, 1);
        }
    };
    /**
     * Returns the bindings, or environment, for the current component.
     * @returns {IComponentBindings}
     */
    SearchInterface.prototype.getBindings = function () {
        return {
            root: this.root,
            queryStateModel: this.queryStateModel,
            queryController: this.queryController,
            searchInterface: this,
            componentStateModel: this.componentStateModel,
            componentOptionsModel: this.componentOptionsModel,
            usageAnalytics: this.usageAnalytics
        };
    };
    /**
     * Gets all the components of a given type.
     * @param type Normally, the component type is a unique identifier without the `Coveo` prefix (e.g., `CoveoFacet` ->
     * `Facet`, `CoveoPager` -> `Pager`, `CoveoQuerybox` -> `Querybox`, etc.).
     */
    SearchInterface.prototype.getComponents = function (type) {
        if (this.attachedComponents == null) {
            this.attachedComponents = {};
        }
        if (!(type in this.attachedComponents)) {
            this.attachedComponents[type] = [];
        }
        return this.attachedComponents[type];
    };
    /**
     * Indicates whether the search interface is using the new design.
     * This changes the rendering of multiple components.
     */
    SearchInterface.prototype.isNewDesign = function () {
        return this.isNewDesignAttribute;
    };
    SearchInterface.prototype.initializeAnalytics = function () {
        var analyticsRef = BaseComponent_1.BaseComponent.getComponentRef('Analytics');
        if (analyticsRef) {
            return analyticsRef.create(this.element, this.analyticsOptions, this.getBindings());
        }
        return new NoopAnalyticsClient_1.NoopAnalyticsClient();
    };
    SearchInterface.prototype.setupDebugInfo = function () {
        var _this = this;
        if (this.options.enableDebugInfo) {
            setTimeout(function () { return new Debug_1.Debug(_this.element, _this.getBindings()); });
        }
    };
    SearchInterface.prototype.handlePreprocessQueryStateModel = function (args) {
        var tgFromModel = this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.tg);
        var tFromModel = this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.t);
        var tg = tgFromModel;
        var t = tFromModel;
        // if you want to set the tab group
        if (args.tg !== undefined) {
            args.tg = this.getTabGroupId(args.tg);
            if (tg != args.tg) {
                args.t = args.t || QueryStateModel_1.QueryStateModel.defaultAttributes.t;
                args.sort = args.sort || QueryStateModel_1.QueryStateModel.defaultAttributes.sort;
                tg = args.tg;
            }
        }
        if (args.t !== undefined) {
            args.t = this.getTabId(tg, args.t);
            if (t != args.t) {
                args.sort = args.sort || QueryStateModel_1.QueryStateModel.defaultAttributes.sort;
                t = args.t;
            }
        }
        if (args.sort !== undefined) {
            args.sort = this.getSort(t, args.sort);
        }
        if (args.quickview !== undefined) {
            args.quickview = this.getQuickview(args.quickview);
        }
    };
    SearchInterface.prototype.getTabGroupId = function (tabGroupId) {
        var tabGroupRef = BaseComponent_1.BaseComponent.getComponentRef('TabGroup');
        if (tabGroupRef) {
            var tabGroups = this.getComponents(tabGroupRef.ID);
            // check if the tabgroup is correct
            if (tabGroupId != QueryStateModel_1.QueryStateModel.defaultAttributes.tg && _.any(tabGroups, function (tabGroup) { return !tabGroup.disabled && tabGroupId == tabGroup.options.id; })) {
                return tabGroupId;
            }
            // select the first tabGroup
            if (tabGroups.length > 0) {
                return tabGroups[0].options.id;
            }
        }
        return QueryStateModel_1.QueryStateModel.defaultAttributes.tg;
    };
    SearchInterface.prototype.getTabId = function (tabGroupId, tabId) {
        var tabRef = BaseComponent_1.BaseComponent.getComponentRef('Tab');
        var tabGroupRef = BaseComponent_1.BaseComponent.getComponentRef('TabGroup');
        if (tabRef) {
            var tabs = this.getComponents(tabRef.ID);
            if (tabGroupRef) {
                // if has a tabGroup
                if (tabGroupId != QueryStateModel_1.QueryStateModel.defaultAttributes.tg) {
                    var tabGroups = this.getComponents(tabGroupRef.ID);
                    var tabGroup_1 = _.find(tabGroups, function (tabGroup) { return tabGroupId == tabGroup.options.id; });
                    // check if the tabgroup contain this tab
                    if (tabId != QueryStateModel_1.QueryStateModel.defaultAttributes.t && _.any(tabs, function (tab) { return tabId == tab.options.id && tabGroup_1.isElementIncludedInTabGroup(tab.element); })) {
                        return tabId;
                    }
                    // select the first tab in the tabGroup
                    var tab = _.find(tabs, function (tab) { return tabGroup_1.isElementIncludedInTabGroup(tab.element); });
                    if (tab != null) {
                        return tab.options.id;
                    }
                    return QueryStateModel_1.QueryStateModel.defaultAttributes.t;
                }
            }
            // check if the tab is correct
            if (tabId != QueryStateModel_1.QueryStateModel.defaultAttributes.t && _.any(tabs, function (tab) { return tabId == tab.options.id; })) {
                return tabId;
            }
            // select the first tab
            if (tabs.length > 0) {
                return tabs[0].options.id;
            }
        }
        return QueryStateModel_1.QueryStateModel.defaultAttributes.t;
    };
    SearchInterface.prototype.getSort = function (tabId, sortId) {
        var sortRef = BaseComponent_1.BaseComponent.getComponentRef('Sort');
        if (sortRef) {
            var sorts = this.getComponents(sortRef.ID);
            // if has a selected tab
            var tabRef = BaseComponent_1.BaseComponent.getComponentRef('Tab');
            if (tabRef) {
                if (tabId != QueryStateModel_1.QueryStateModel.defaultAttributes.t) {
                    var tabs = this.getComponents(tabRef.ID);
                    var tab_1 = _.find(tabs, function (tab) { return tabId == tab.options.id; });
                    var sortCriteria = tab_1.options.sort;
                    // check if the tab contain this sort
                    if (sortId != QueryStateModel_1.QueryStateModel.defaultAttributes.sort && _.any(sorts, function (sort) { return tab_1.isElementIncludedInTab(sort.element) && sort.match(sortId); })) {
                        return sortId;
                    }
                    else if (sortCriteria != null) {
                        // if not and tab.options.sort is set apply it
                        return sortCriteria.toString();
                    }
                    // select the first sort in the tab
                    var sort = _.find(sorts, function (sort) { return tab_1.isElementIncludedInTab(sort.element); });
                    if (sort != null) {
                        return sort.options.sortCriteria[0].toString();
                    }
                    return QueryStateModel_1.QueryStateModel.defaultAttributes.sort;
                }
            }
            // check if the sort is correct
            if (sortId != QueryStateModel_1.QueryStateModel.defaultAttributes.sort && _.any(sorts, function (sort) { return sort.match(sortId); })) {
                return sortId;
            }
            // select the first sort
            if (sorts.length > 0) {
                return sorts[0].options.sortCriteria[0].toString();
            }
        }
        return QueryStateModel_1.QueryStateModel.defaultAttributes.sort;
    };
    SearchInterface.prototype.getQuickview = function (quickviewId) {
        var quickviewRef = BaseComponent_1.BaseComponent.getComponentRef('Quickview');
        if (quickviewRef) {
            var quickviews = this.getComponents(quickviewRef.ID);
            if (_.any(quickviews, function (quickview) { return quickview.getHashId() == quickviewId; })) {
                return quickviewId;
            }
        }
        return QueryStateModel_1.QueryStateModel.defaultAttributes.quickview;
    };
    SearchInterface.prototype.handleQuickviewChanged = function (args) {
        var quickviewRef = BaseComponent_1.BaseComponent.getComponentRef('Quickview');
        if (quickviewRef) {
            var quickviews = this.getComponents(quickviewRef.ID);
            if (args.value != '') {
                var quickviewsPartition = _.partition(quickviews, function (quickview) { return quickview.getHashId() == args.value; });
                if (quickviewsPartition[0].length != 0) {
                    _.first(quickviewsPartition[0]).open();
                    _.forEach(_.tail(quickviewsPartition[0]), function (quickview) { return quickview.close(); });
                }
                _.forEach(quickviewsPartition[1], function (quickview) { return quickview.close(); });
            }
            else {
                _.forEach(quickviews, function (quickview) {
                    quickview.close();
                });
            }
        }
    };
    SearchInterface.prototype.handleBuildingQuery = function (data) {
        if (this.options.enableDuplicateFiltering) {
            data.queryBuilder.enableDuplicateFiltering = true;
        }
        if (!Utils_1.Utils.isNullOrUndefined(this.options.pipeline)) {
            data.queryBuilder.pipeline = this.options.pipeline;
        }
        if (!Utils_1.Utils.isNullOrUndefined(this.options.maximumAge)) {
            data.queryBuilder.maximumAge = this.options.maximumAge;
        }
        if (!Utils_1.Utils.isNullOrUndefined(this.options.resultsPerPage)) {
            data.queryBuilder.numberOfResults = this.options.resultsPerPage;
        }
        if (!Utils_1.Utils.isNullOrUndefined(this.options.excerptLength)) {
            data.queryBuilder.excerptLength = this.options.excerptLength;
        }
        if (Utils_1.Utils.isNonEmptyString(this.options.expression)) {
            data.queryBuilder.advancedExpression.add(this.options.expression);
        }
        if (Utils_1.Utils.isNonEmptyString(this.options.filterField)) {
            data.queryBuilder.filterField = this.options.filterField;
        }
        if (Utils_1.Utils.isNonEmptyString(this.options.timezone)) {
            data.queryBuilder.timezone = this.options.timezone;
        }
        data.queryBuilder.enableCollaborativeRating = this.options.enableCollaborativeRating;
        data.queryBuilder.enableDuplicateFiltering = this.options.enableDuplicateFiltering;
    };
    SearchInterface.prototype.handleQuerySuccess = function (data) {
        var noResults = data.results.results.length == 0;
        this.toggleSectionState('coveo-no-results', noResults);
        var resultsHeader = Dom_1.$$(this.element).find('.coveo-results-header');
        if (resultsHeader) {
            Dom_1.$$(resultsHeader).removeClass('coveo-query-error');
        }
    };
    SearchInterface.prototype.handleQueryError = function (data) {
        this.toggleSectionState('coveo-no-results');
        var resultsHeader = Dom_1.$$(this.element).find('.coveo-results-header');
        if (resultsHeader) {
            Dom_1.$$(resultsHeader).addClass('coveo-query-error');
        }
    };
    SearchInterface.prototype.toggleSectionState = function (cssClass, toggle) {
        var _this = this;
        if (toggle === void 0) { toggle = true; }
        var facetSection = Dom_1.$$(this.element).find('.coveo-facet-column');
        var resultsSection = Dom_1.$$(this.element).find('.coveo-results-column');
        var resultsHeader = Dom_1.$$(this.element).find('.coveo-results-header');
        var facetSearchs = Dom_1.$$(this.element).findAll('.coveo-facet-search-results');
        if (facetSection) {
            Dom_1.$$(facetSection).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
        }
        if (resultsSection) {
            Dom_1.$$(resultsSection).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
        }
        if (resultsHeader) {
            Dom_1.$$(resultsHeader).toggleClass(cssClass, toggle && !this.queryStateModel.atLeastOneFacetIsActive());
        }
        if (facetSearchs && facetSearchs.length > 0) {
            _.each(facetSearchs, function (facetSearch) {
                Dom_1.$$(facetSearch).toggleClass(cssClass, toggle && !_this.queryStateModel.atLeastOneFacetIsActive());
            });
        }
    };
    return SearchInterface;
}(RootComponent_1.RootComponent));
SearchInterface.ID = 'SearchInterface';
/**
 * The options for the search interface
 * @componentOptions
 */
SearchInterface.options = {
    /**
     * Specifies whether to allow the end user to navigate search history using the **Back** and **Forward** buttons
     * of the browser.
     *
     * If this options is `true`, the SearchInterface component saves the state of the current query in the hash portion
     * of the URL when the user submits the query.
     *
     * **Example:**
     * > If the `enableHistory` option is `true` and the current query is `foobar`, the SearchInterface component
     * > saves `q=foobar` in the URL hash when the user submits the query.
     *
     * Default value is `false`.
     */
    enableHistory: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether to enable automatic responsive mode (i.e., automatically placing {@link Facet} and {@link Tab}
     * components in dropdown menus under the search box when the width of the SearchInterface HTML element reaches or
     * falls behind a certain pixel threshold).
     *
     * You might want to set this option to `false` if automatic responsive mode does not suit the specific design needs
     * of your implementation.
     *
     * **Note:**
     *
     * > If this option is `true`, you can also specify whether to enable responsive mode for Facet components (see
     * > {@link Facet.options.enableResponsiveMode}) and for Tab components (see
     * > {@link Tab.options.enableResponsiveMode}).
     * >
     * > In addition, you can specify the label you wish to display on the dropdown buttons (see
     * > {@link Facet.options.dropdownHeaderLabel} and {@link Tab.options.dropdownHeaderLabel}).
     *
     * Default value is `true`.
     */
    enableAutomaticResponsiveMode: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies whether to save the interface state in the local storage of the browser.
     *
     * You might want to set this option to `true` for reasons specifically important for your implementation.
     *
     * Default value is `false`.
     */
    useLocalStorageForHistory: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies the number of results to display on each page.
     *
     * For more advanced features, see the {@link ResultsPerPage} component.
     *
     * Default value is `10`. Minimum value is `0`.
     */
    resultsPerPage: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 10, min: 0 }),
    /**
     * Specifies the number of characters to get at query time to create an excerpt of the result.
     *
     * This setting is global and cannot be modified on a per-result basis.
     *
     * See also the {@link Excerpt} component.
     *
     * Default value is `200`. Minimum value is `0`.
     */
    excerptLength: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 200, min: 0 }),
    /**
     * Specifies an expression to add to each query.
     *
     * You might want to use this options to add a global filter to your entire search interface that applies for all
     * tabs.
     *
     * You should not use this option to address security concerns (it is JavaScript, after all).
     *
     * **Note:**
     *
     * > It also is possible to set this option separately for each {@link Tab} component
     * > (see {@link Tab.options.expression}).
     *
     * Default value is `''`.
     */
    expression: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '' }),
    /**
     * Specifies the name of a field to use as a custom filter when executing the query (also referred to as
     * "folding").
     *
     * Setting a value for this option causes the index to return only one result having any particular value inside the
     * filter field. Any other matching result is "folded" inside the childResults member of each JSON query result.
     *
     * This feature is typically useful with threaded conversations to include only one top-level result per
     * conversation. Thus, the field you specify for this option will typically be value unique to each thread that is
     * shared by all items (e.g., posts, emails, etc) in the thread.
     *
     * For more advanced features, see the {@link Folding} component.
     *
     * Default value is the empty string (`''`).
     */
    filterField: ComponentOptions_1.ComponentOptions.buildFieldOption({ defaultValue: '' }),
    hideUntilFirstQuery: ComponentOptions_1.ComponentOptions.buildBooleanOption({ deprecated: 'Exposed for legacy reasons. The loading animation is now composed of placeholders, and this option is obsolete.' }),
    firstLoadingAnimation: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption({
        deprecated: 'Exposed for legacy reasons. The loading animation is now composed of placeholder, and this options is obsolete.'
    }),
    /**
     * Specifies whether to trigger the first query automatically when the page finishes loading.
     *
     * Default value is `true`.
     */
    autoTriggerQuery: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
    endpoint: ComponentOptions_1.ComponentOptions.buildCustomOption(function (endpoint) { return endpoint != null && endpoint in SearchEndpoint_1.SearchEndpoint.endpoints ? SearchEndpoint_1.SearchEndpoint.endpoints[endpoint] : null; }, { defaultFunction: function () { return SearchEndpoint_1.SearchEndpoint.endpoints['default']; } }),
    /**
     * Specifies the timezone in which the search interface is loaded. This allows the index to recognize some special
     * query syntax.
     *
     * This option must have a valid IANA zone info key (AKA the Olson time zone database) as its value.
     *
     * **Example:** `America/New_York`.
     *
     * By default, the search interface allows a library to try to detect the timezone automatically.
     */
    timezone: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultFunction: function () { return jstz.determine().name(); } }),
    /**
     * Specifies whether to enable the feature that allows the end user to ALT + double click any result to open a debug
     * page with detailed information about all properties and fields for that result.
     *
     * Enabling this feature causes no security concern; the entire debug information is always visible to the end user
     * through the browser developer console or by calling the Coveo API directly.
     *
     * Default value is `true`.
     */
    enableDebugInfo: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies whether to enable collaborative rating, which you can leverage using the
     * [`ResultRating`]{@link ResultRating} component.
     *
     * Setting this option to `true` has no effect unless collaborative rating is also enabled on your Coveo index.
     *
     * Default value is `false`.
     */
    enableCollaborativeRating: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether to filter duplicates in the search results.
     *
     * Setting this option to `true` forces duplicates to not appear in search results. However, {@link Facet} counts
     * still include the duplicates, which can be confusing for the end user. This is a limitation of the index.
     *
     * **Example:**
     *
     * > The end user narrows a query down to a single item that has a duplicate. If the enableDuplicateFiltering
     * > option is `true`, then only one item appears in the search results while the Facet count is still 2.
     *
     * **Note:**
     *
     * > It also is possible to set this option separately for each {@link Tab} component
     * > (see {@link Tab.options.enableDuplicateFiltering}).
     *
     * Default value is `false`.
     */
    enableDuplicateFiltering: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies the name of the query pipeline to use for the queries.
     *
     * You can specify a value for this option if your index is in a Coveo Cloud organization in which pipelines have
     * been created (see [Managing Query Pipelines](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=128)).
     *
     * **Note:**
     *
     * > It also is possible to set this option separately for each {@link Tab} component
     * > (see {@link Tab.options.pipeline}).
     *
     * Default value is `undefined`, which means that the search interface uses the default pipeline.
     */
    pipeline: ComponentOptions_1.ComponentOptions.buildStringOption(),
    /**
     * Specifies the maximum age (in milliseconds) that cached query results can have to still be usable as results
     * instead of performing a new query on the index. The cache is located in the Coveo Search API (which resides
     * between the index and the search interface).
     *
     * If cached results that are older than the age you specify in this option are available, the framework will not
     * use these results; it will rather perform a new query on the index.
     *
     * On high-volume public web sites, specifying a higher value for this option can greatly improve query response
     * time at the cost of result freshness.
     *
     * **Note:**
     *
     * > It also is possible to set this option separately for each {@link Tab} component
     * > (see {@link Tab.options.maximumAge}).
     *
     * Default value is `undefined`, which means that the search interface lets the Coveo Search API determine the
     * maximum cache age. This is typically equivalent to 30 minutes (see
     * [Query Parameters - maximumAge](https://developers.coveo.com/x/iwEv#QueryParameters-maximumAge)).
     */
    maximumAge: ComponentOptions_1.ComponentOptions.buildNumberOption(),
    /**
     * Specifies the search page you wish to navigate to when instantiating a standalone search box interface.
     *
     * Default value is `undefined`, which means that the search interface does not redirect.
     */
    searchPageUri: ComponentOptions_1.ComponentOptions.buildStringOption()
};
SearchInterface.SMALL_INTERFACE_CLASS_NAME = 'coveo-small-search-interface';
exports.SearchInterface = SearchInterface;
var StandaloneSearchInterface = (function (_super) {
    __extends(StandaloneSearchInterface, _super);
    function StandaloneSearchInterface(element, options, analyticsOptions, _window) {
        if (_window === void 0) { _window = window; }
        var _this = _super.call(this, element, ComponentOptions_1.ComponentOptions.initComponentOptions(element, StandaloneSearchInterface, options), analyticsOptions, _window) || this;
        _this.element = element;
        _this.options = options;
        _this.analyticsOptions = analyticsOptions;
        _this._window = _window;
        Dom_1.$$(_this.root).on(QueryEvents_1.QueryEvents.newQuery, function (e, args) { return _this.handleRedirect(e, args); });
        return _this;
    }
    StandaloneSearchInterface.prototype.handleRedirect = function (e, data) {
        var dataToSendOnBeforeRedirect = {
            searchPageUri: this.options.searchPageUri,
            cancel: false
        };
        Dom_1.$$(this.root).trigger(StandaloneSearchInterfaceEvents_1.StandaloneSearchInterfaceEvents.beforeRedirect, dataToSendOnBeforeRedirect);
        if (dataToSendOnBeforeRedirect.cancel) {
            return;
        }
        data.cancel = true;
        if (!this.searchboxIsEmpty() || this.options.redirectIfEmpty) {
            this.redirectToSearchPage(dataToSendOnBeforeRedirect.searchPageUri);
        }
    };
    StandaloneSearchInterface.prototype.redirectToSearchPage = function (searchPage) {
        var _this = this;
        var stateValues = this.queryStateModel.getAttributes();
        var uaCausedBy = this.usageAnalytics.getCurrentEventCause();
        if (uaCausedBy != null) {
            // for legacy reason, searchbox submit were always logged a search from link in an external search box.
            // transform them if that's what we hit.
            if (uaCausedBy == AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit.name) {
                uaCausedBy = AnalyticsActionListMeta_1.analyticsActionCauseList.searchFromLink.name;
            }
            stateValues['firstQueryCause'] = uaCausedBy;
        }
        var uaMeta = this.usageAnalytics.getCurrentEventMeta();
        if (uaMeta != null) {
            stateValues['firstQueryMeta'] = uaMeta;
        }
        var link = document.createElement('a');
        link.href = searchPage;
        // By using a setTimeout, we allow other possible code related to the search box / magic box time to complete.
        // eg: onblur of the magic box.
        setTimeout(function () {
            _this._window.location.href = link.protocol + "//" + link.host + link.pathname + link.search + (link.hash ? link.hash + '&' : '#') + HashUtils_1.HashUtils.encodeValues(stateValues);
        }, 0);
    };
    StandaloneSearchInterface.prototype.searchboxIsEmpty = function () {
        return Utils_1.Utils.isEmptyString(this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.q));
    };
    return StandaloneSearchInterface;
}(SearchInterface));
StandaloneSearchInterface.ID = 'StandaloneSearchInterface';
StandaloneSearchInterface.options = {
    redirectIfEmpty: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
};
exports.StandaloneSearchInterface = StandaloneSearchInterface;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var KEYBOARD;
(function (KEYBOARD) {
    KEYBOARD[KEYBOARD["BACKSPACE"] = 8] = "BACKSPACE";
    KEYBOARD[KEYBOARD["TAB"] = 9] = "TAB";
    KEYBOARD[KEYBOARD["ENTER"] = 13] = "ENTER";
    KEYBOARD[KEYBOARD["SHIFT"] = 16] = "SHIFT";
    KEYBOARD[KEYBOARD["CTRL"] = 17] = "CTRL";
    KEYBOARD[KEYBOARD["ALT"] = 18] = "ALT";
    KEYBOARD[KEYBOARD["ESCAPE"] = 27] = "ESCAPE";
    KEYBOARD[KEYBOARD["SPACEBAR"] = 32] = "SPACEBAR";
    KEYBOARD[KEYBOARD["PAGE_UP"] = 33] = "PAGE_UP";
    KEYBOARD[KEYBOARD["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    KEYBOARD[KEYBOARD["HOME"] = 36] = "HOME";
    KEYBOARD[KEYBOARD["LEFT_ARROW"] = 37] = "LEFT_ARROW";
    KEYBOARD[KEYBOARD["UP_ARROW"] = 38] = "UP_ARROW";
    KEYBOARD[KEYBOARD["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
    KEYBOARD[KEYBOARD["DOWN_ARROW"] = 40] = "DOWN_ARROW";
    KEYBOARD[KEYBOARD["INSERT"] = 45] = "INSERT";
    KEYBOARD[KEYBOARD["DELETE"] = 46] = "DELETE";
})(KEYBOARD = exports.KEYBOARD || (exports.KEYBOARD = {}));
var KeyboardUtils = (function () {
    function KeyboardUtils() {
    }
    KeyboardUtils.keysEqual = function (key, code) {
        if (!Utils_1.Utils.isNullOrUndefined(key.keyCode)) {
            return key.keyCode == code;
        }
        else if (!Utils_1.Utils.isNullOrUndefined(key.which)) {
            return key.which == code;
        }
        return false;
    };
    KeyboardUtils.isAllowedKeyForOmnibox = function (e) {
        var keycode = e.keyCode;
        var valid = (KeyboardUtils.isNumberKeyPushed(keycode)) ||
            (keycode == 32 || keycode == 13) ||
            (KeyboardUtils.isLetterKeyPushed(keycode)) ||
            (keycode > 95 && keycode < 112) ||
            (keycode > 185 && keycode < 193) ||
            (keycode > 218 && keycode < 223) ||
            (keycode == KEYBOARD.BACKSPACE || keycode == KEYBOARD.DELETE) ||
            (KeyboardUtils.isArrowKeyPushed(keycode));
        return valid;
    };
    KeyboardUtils.isAllowedKeyForSearchAsYouType = function (e) {
        return KeyboardUtils.isAllowedKeyForOmnibox(e) && !KeyboardUtils.isArrowKeyPushed(e.keyCode);
    };
    KeyboardUtils.isDeleteOrBackspace = function (e) {
        return KeyboardUtils.keysEqual(e, KEYBOARD.BACKSPACE) || KeyboardUtils.keysEqual(e, KEYBOARD.DELETE);
    };
    KeyboardUtils.isArrowKeyPushed = function (keycode) {
        return keycode == KEYBOARD.LEFT_ARROW ||
            keycode == KEYBOARD.UP_ARROW ||
            keycode == KEYBOARD.RIGHT_ARROW ||
            keycode == KEYBOARD.DOWN_ARROW;
    };
    KeyboardUtils.isNumberKeyPushed = function (keycode) {
        return keycode > 47 && keycode < 58;
    };
    KeyboardUtils.isLetterKeyPushed = function (keycode) {
        return keycode > 64 && keycode < 91;
    };
    // Return a keyboard event listener that only executes the function if certain keys are pressed.
    KeyboardUtils.keypressAction = function (keyCode, action) {
        return function (e) {
            var data = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                data[_i - 1] = arguments[_i];
            }
            if (e) {
                var eventCode = e.charCode || e.keyCode;
                if (eventCode) {
                    if (_.isArray(keyCode) && _.contains(keyCode, eventCode)) {
                        action(e);
                    }
                    else if (eventCode === keyCode) {
                        action(e);
                    }
                }
            }
        };
    };
    return KeyboardUtils;
}());
exports.KeyboardUtils = KeyboardUtils;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalBox = __webpack_require__(213);
exports.LocaleString = __webpack_require__(214);


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Globalize"] = __webpack_require__(211);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(118)))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(13);
var Dom_1 = __webpack_require__(2);
var TemplateConditionEvaluator_1 = __webpack_require__(114);
var TemplateFieldsEvaluator_1 = __webpack_require__(264);
var ResponsiveComponents_1 = __webpack_require__(38);
var _ = __webpack_require__(0);
var Initialization_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var DefaultInstantiateTemplateOptions = (function () {
    function DefaultInstantiateTemplateOptions() {
        this.currentLayout = null;
        this.checkCondition = true;
        this.wrapInDiv = true;
        this.responsiveComponents = new ResponsiveComponents_1.ResponsiveComponents();
    }
    DefaultInstantiateTemplateOptions.prototype.get = function () {
        return {
            currentLayout: this.currentLayout,
            checkCondition: this.checkCondition,
            wrapInDiv: this.wrapInDiv,
            responsiveComponents: this.responsiveComponents
        };
    };
    DefaultInstantiateTemplateOptions.prototype.merge = function (other) {
        if (other) {
            return _.extend(this.get(), other);
        }
        return this.get();
    };
    return DefaultInstantiateTemplateOptions;
}());
exports.DefaultInstantiateTemplateOptions = DefaultInstantiateTemplateOptions;
var Template = (function () {
    function Template(dataToString) {
        this.dataToString = dataToString;
        this.logger = new Logger_1.Logger(this);
        this.fields = [];
    }
    Template.prototype.instantiateToString = function (object, instantiateOptions) {
        if (instantiateOptions === void 0) { instantiateOptions = new DefaultInstantiateTemplateOptions(); }
        if (this.dataToString) {
            if (instantiateOptions.checkCondition === false) {
                return this.dataToString(object);
            }
            // Should not happen but...
            // Normally, top level call from sub-class will have already created a
            // DefaultInstantiateTemplateOptions and merged down
            if (instantiateOptions.responsiveComponents == null) {
                instantiateOptions.responsiveComponents = new ResponsiveComponents_1.ResponsiveComponents();
            }
            // Mobile/tablet/desktop checks are only for "hard" set value (triple equal)
            // If it's undefined, we skip those checks, and we assume the template works correctly for any given screen size
            if (this.mobile === true && !instantiateOptions.responsiveComponents.isSmallScreenWidth()) {
                this.logger.trace('Template was skipped because it is optimized for small screen width', this);
                return null;
            }
            else if (this.mobile === false && instantiateOptions.responsiveComponents.isSmallScreenWidth()) {
                this.logger.trace('Template was skipped because it is not optimized for small screen width', this);
                return null;
            }
            if (this.tablet === true && !instantiateOptions.responsiveComponents.isMediumScreenWidth()) {
                this.logger.trace('Template was skipped because it is optimized for medium screen width', this);
                return null;
            }
            else if (this.tablet === false && instantiateOptions.responsiveComponents.isMediumScreenWidth()) {
                this.logger.trace('Template was skipped because it is not optimized for medium screen width', this);
                return null;
            }
            if (this.desktop === true && !instantiateOptions.responsiveComponents.isLargeScreenWidth()) {
                this.logger.trace('Template was skipped because it is optimized for large screen width', this);
                return null;
            }
            else if (this.desktop === false && instantiateOptions.responsiveComponents.isLargeScreenWidth()) {
                this.logger.trace('Template was skipped because it is not optimized for large screen width', this);
                return null;
            }
            if (this.layout != null && instantiateOptions.currentLayout != null && instantiateOptions.currentLayout !== this.layout) {
                this.logger.trace('Template was skipped because layout does not match', this, this.layout);
                return null;
            }
            this.logger.trace('Evaluating template ...');
            // Condition (as a function) is eval'ed, first
            if (this.condition != null && this.condition(object)) {
                this.logger.trace('Template was loaded because condition was :', this.condition, object);
                return this.dataToString(object);
            }
            // Condition (as a string) is parsed, if available.
            if (this.conditionToParse != null && TemplateConditionEvaluator_1.TemplateConditionEvaluator.evaluateCondition(this.conditionToParse, object, instantiateOptions.responsiveComponents)) {
                this.logger.trace('Template was loaded because condition was :', this.conditionToParse, object);
                return this.dataToString(object);
            }
            // fieldsToMatch is yet another fallback that allows to specify if a template should be loaded.
            if (this.fieldsToMatch != null && TemplateFieldsEvaluator_1.TemplateFieldsEvaluator.evaluateFieldsToMatch(this.fieldsToMatch, object)) {
                this.logger.trace('Template was loaded because condition was :', this.fieldsToMatch, object);
                return this.dataToString(object);
            }
            // If there is no condition at all, this means "true"
            if (this.condition == null && this.conditionToParse == null && this.fieldsToMatch == null) {
                this.logger.trace('Template was loaded because there was *NO* condition', this.condition, object);
                return this.dataToString(object);
            }
        }
        this.logger.trace('Template was skipped because it did not match any condition', this);
        return null;
    };
    Template.prototype.addField = function (field) {
        if (!_.contains(this.fields, field)) {
            this.fields.push(field);
        }
    };
    Template.prototype.addFields = function (fields) {
        if (Utils_1.Utils.isNonEmptyArray(fields)) {
            this.fields = Utils_1.Utils.concatWithoutDuplicate(this.fields, fields);
        }
    };
    Template.prototype.getComponentsInside = function (tmplString) {
        var allComponentsInsideCurrentTemplate = _.map(Initialization_1.Initialization.getListOfRegisteredComponents(), function (componentId) {
            var regex = new RegExp("Coveo" + componentId, 'g');
            if (regex.exec(tmplString)) {
                return componentId;
            }
            else {
                return null;
            }
        });
        return _.compact(allComponentsInsideCurrentTemplate);
    };
    Template.prototype.instantiateToElement = function (object, instantiateTemplateOptions) {
        var _this = this;
        if (instantiateTemplateOptions === void 0) { instantiateTemplateOptions = {}; }
        var mergedOptions = new DefaultInstantiateTemplateOptions().merge(instantiateTemplateOptions);
        var html = this.instantiateToString(object, mergedOptions);
        if (html == null) {
            return null;
        }
        var allComponentsLazyLoaded = _.map(this.getComponentsInside(html), function (component) {
            return Initialization_1.LazyInitialization.getLazyRegisteredComponent(component).then(function (lazyLoadedComponent) {
                return lazyLoadedComponent;
            });
        });
        return Promise.all(allComponentsLazyLoaded).then(function () {
            var layout = _this.layout || mergedOptions.currentLayout;
            var elemType = layout === 'table' ? 'tr' : 'div';
            var element = Dom_1.$$(elemType, {}, html).el;
            if (!mergedOptions.wrapInDiv && element.children.length === 1) {
                element = element.children.item(0);
            }
            if (layout) {
                Dom_1.$$(element).addClass("coveo-" + layout + "-layout");
            }
            _this.logger.trace('Instantiated result template', object, element);
            element['template'] = _this;
            return element;
        });
    };
    Template.prototype.toHtmlElement = function () {
        return null;
    };
    Template.prototype.getFields = function () {
        return this.fields;
    };
    Template.prototype.getType = function () {
        return 'Template';
    };
    Template.prototype.setConditionWithFallback = function (condition) {
        // In some circumstances (eg: locker service in SF), with strict Content-Security-Policy, eval / new Function are not allowed by the browser.
        // Try to use the eval method, if possible. Otherwise fallback to a mechanism where we will try to parse/evaluate the condition as a simple string.
        try {
            this.condition = new Function('obj', 'with(obj||{}){return ' + condition + '}');
        }
        catch (e) {
            this.conditionToParse = condition;
        }
    };
    return Template;
}());
exports.Template = Template;


/***/ }),
/* 24 */
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
var Model_1 = __webpack_require__(15);
var _ = __webpack_require__(0);
exports.COMPONENT_OPTIONS_ATTRIBUTES = {
    RESULT_LINK: 'resultLink',
    SEARCH_HUB: 'searchHub',
    SEARCH_BOX: 'searchBox'
};
var ComponentOptionsModel = (function (_super) {
    __extends(ComponentOptionsModel, _super);
    function ComponentOptionsModel(element, attributes) {
        var _this = this;
        var merged = _.extend({}, ComponentOptionsModel.defaultAttributes, attributes);
        _this = _super.call(this, element, ComponentOptionsModel.ID, merged) || this;
        return _this;
    }
    return ComponentOptionsModel;
}(Model_1.Model));
ComponentOptionsModel.ID = 'ComponentOptions';
ComponentOptionsModel.defaultAttributes = {
    resultLink: undefined,
    searchHub: undefined,
    searchBox: undefined
};
ComponentOptionsModel.attributesEnum = {
    resultLink: 'resultLink',
    searchHub: 'searchHub',
    searchBox: 'searchBox'
};
exports.ComponentOptionsModel = ComponentOptionsModel;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var Defer = (function () {
    function Defer() {
    }
    Defer.defer = function (code) {
        Defer.functions.push(code);
        Defer.arm();
    };
    Defer.flush = function () {
        while (Defer.popOne()) {
        }
    };
    Defer.arm = function () {
        _.defer(function () {
            if (Defer.popOne()) {
                Defer.arm();
            }
        });
    };
    Defer.popOne = function () {
        if (Defer.functions.length > 0) {
            var fun = Defer.functions[0];
            Defer.functions = _.rest(Defer.functions);
            fun();
            return Defer.functions.length > 0;
        }
        else {
            return false;
        }
    };
    return Defer;
}());
Defer.functions = [];
exports.Defer = Defer;


/***/ }),
/* 26 */,
/* 27 */
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
var Options_1 = __webpack_require__(50);
var Utils_1 = __webpack_require__(4);
var Strings_1 = __webpack_require__(9);
var TimeSpanUtils_1 = __webpack_require__(53);
var Globalize = __webpack_require__(22);
var _ = __webpack_require__(0);
var DefaultDateToStringOptions = (function (_super) {
    __extends(DefaultDateToStringOptions, _super);
    function DefaultDateToStringOptions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.now = new Date();
        _this.useTodayYesterdayAndTomorrow = true;
        _this.useWeekdayIfThisWeek = true;
        _this.omitYearIfCurrentOne = true;
        _this.useLongDateFormat = false;
        _this.includeTimeIfToday = true;
        _this.includeTimeIfThisWeek = true;
        _this.alwaysIncludeTime = false;
        _this.predefinedFormat = undefined;
        return _this;
    }
    return DefaultDateToStringOptions;
}(Options_1.Options));
var DateUtils = (function () {
    function DateUtils() {
    }
    DateUtils.convertFromJsonDateIfNeeded = function (date) {
        if (_.isDate(date)) {
            return date;
        }
        else if (date !== null && !isNaN(Number(date))) {
            return new Date(Number(date));
        }
        else if (_.isString(date)) {
            return new Date(date.replace('@', ' '));
        }
        else {
            return undefined;
        }
    };
    DateUtils.dateForQuery = function (date) {
        return date.getFullYear() + '/' + DateUtils.padNumber((date.getMonth() + 1).toString()) + '/' + DateUtils.padNumber(date.getDate().toString());
    };
    DateUtils.padNumber = function (num, length) {
        if (length === void 0) { length = 2; }
        while (num.length < length) {
            num = '0' + num;
        }
        return num;
    };
    DateUtils.keepOnlyDatePart = function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    DateUtils.offsetDateByDays = function (date, offset) {
        var newDate = new Date(date.valueOf());
        newDate.setDate(newDate.getDate() + offset);
        return newDate;
    };
    DateUtils.dateToString = function (d, options) {
        if (Utils_1.Utils.isNullOrUndefined(d)) {
            return '';
        }
        options = new DefaultDateToStringOptions().merge(options);
        var dateOnly = DateUtils.keepOnlyDatePart(d);
        if (options.predefinedFormat) {
            return Globalize.format(dateOnly, options.predefinedFormat);
        }
        var today = DateUtils.keepOnlyDatePart(options.now);
        if (options.useTodayYesterdayAndTomorrow) {
            if (dateOnly.valueOf() == today.valueOf()) {
                return Strings_1.l('Today');
            }
            var tomorrow = DateUtils.offsetDateByDays(today, 1);
            if (dateOnly.valueOf() == tomorrow.valueOf()) {
                return Strings_1.l('Tomorrow');
            }
            var yesterday = DateUtils.offsetDateByDays(today, -1);
            if (dateOnly.valueOf() == yesterday.valueOf()) {
                return Strings_1.l('Yesterday');
            }
        }
        var isThisWeek = Math.abs(TimeSpanUtils_1.TimeSpan.fromDates(dateOnly, today).getDays()) < 7;
        if (options.useWeekdayIfThisWeek && isThisWeek) {
            if (dateOnly.valueOf() > today.valueOf()) {
                return Strings_1.l('NextDay', Globalize.format(dateOnly, 'dddd'));
            }
            else {
                return Strings_1.l('LastDay', Globalize.format(dateOnly, 'dddd'));
            }
        }
        if (options.omitYearIfCurrentOne && dateOnly.getFullYear() === today.getFullYear()) {
            return Globalize.format(dateOnly, 'M');
        }
        if (options.useLongDateFormat) {
            return Globalize.format(dateOnly, 'D');
        }
        return Globalize.format(dateOnly, 'd');
    };
    DateUtils.timeToString = function (date, options) {
        if (Utils_1.Utils.isNullOrUndefined(date)) {
            return '';
        }
        return Globalize.format(date, 't');
    };
    DateUtils.dateTimeToString = function (date, options) {
        if (Utils_1.Utils.isNullOrUndefined(date)) {
            return '';
        }
        options = new DefaultDateToStringOptions().merge(options);
        var today = DateUtils.keepOnlyDatePart(options.now);
        var isThisWeek = Math.abs(TimeSpanUtils_1.TimeSpan.fromDates(date, today).getDays()) < 7;
        var datePart = DateUtils.dateToString(date, options);
        var dateWithoutTime = DateUtils.keepOnlyDatePart(date);
        if (options.alwaysIncludeTime || (options.includeTimeIfThisWeek && isThisWeek) || (options.includeTimeIfToday && dateWithoutTime.valueOf() == today.valueOf())) {
            return datePart + ', ' + DateUtils.timeToString(date);
        }
        else {
            return datePart;
        }
    };
    DateUtils.monthToString = function (month) {
        var date = new Date(1980, month);
        return Globalize.format(date, 'MMMM');
    };
    DateUtils.isValid = function (date) {
        if (date instanceof Date) {
            return !isNaN(date.getTime());
        }
        return false;
    };
    DateUtils.timeBetween = function (from, to) {
        if (Utils_1.Utils.isNullOrUndefined(from) || Utils_1.Utils.isNullOrUndefined(to)) {
            return '';
        }
        return ('0' + ((to.getTime() - from.getTime()) / (1000 * 60 * 60)).toFixed()).slice(-2) +
            ':' + ('0' + ((to.getTime() - from.getTime()) % (1000 * 60 * 60) / (1000 * 60)).toFixed()).slice(-2) +
            ':' + ('0' + ((to.getTime() - from.getTime()) % (1000 * 60) / (1000)).toFixed()).slice(-2);
    };
    return DateUtils;
}());
exports.DateUtils = DateUtils;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(2);
var Logger_1 = __webpack_require__(13);
/**
 * Every component in the framework ultimately inherits from this base component class.
 */
var BaseComponent = (function () {
    function BaseComponent(element, type) {
        this.element = element;
        this.type = type;
        /**
         * A disabled component will not participate in the query, or listen to {@link ComponentEvents}.
         * @type {boolean}
         */
        this.disabled = false;
        Assert_1.Assert.exists(element);
        Assert_1.Assert.isNonEmptyString(type);
        this.logger = new Logger_1.Logger(this);
        BaseComponent.bindComponentToElement(element, this);
    }
    /**
     * Return the debug info about this component.
     * @returns {any}
     */
    BaseComponent.prototype.debugInfo = function () {
        var info = {};
        info[this['constructor']['ID']] = this;
        return info;
    };
    /**
     * Disable the component.
     * Normally this means that the component will not execute handlers for the framework events (query events, for example).
     * Component are enabled by default on creation.
     */
    BaseComponent.prototype.disable = function () {
        this.disabled = true;
    };
    /**
     * Enable the component.
     * Normally this means that the component will execute handlers for the framework events (query events, for example).
     * Components are enabled by default on creation.
     */
    BaseComponent.prototype.enable = function () {
        this.disabled = false;
    };
    BaseComponent.bindComponentToElement = function (element, component) {
        Assert_1.Assert.exists(element);
        Assert_1.Assert.exists(component);
        Assert_1.Assert.isNonEmptyString(component.type);
        element[BaseComponent.computeCssClassNameForType(component.type)] = component;
        Dom_1.$$(element).addClass(BaseComponent.computeCssClassNameForType(component.type));
        BaseComponent.getBoundComponentsForElement(element).push(component);
    };
    BaseComponent.computeCssClassName = function (componentClass) {
        return BaseComponent.computeCssClassNameForType(componentClass['ID']);
    };
    BaseComponent.computeCssClassNameForType = function (type) {
        Assert_1.Assert.isNonEmptyString(type);
        return 'Coveo' + type;
    };
    BaseComponent.computeSelectorForType = function (type) {
        Assert_1.Assert.isNonEmptyString(type);
        return '.' + BaseComponent.computeCssClassNameForType(type);
    };
    BaseComponent.getBoundComponentsForElement = function (element) {
        Assert_1.Assert.exists(element);
        if (element.CoveoBoundComponents == null) {
            element.CoveoBoundComponents = [];
        }
        return element.CoveoBoundComponents;
    };
    BaseComponent.getComponentRef = function (component) {
        return Coveo[component];
    };
    return BaseComponent;
}());
exports.BaseComponent = BaseComponent;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResultListEvents = (function () {
    function ResultListEvents() {
    }
    return ResultListEvents;
}());
ResultListEvents.newResultsDisplayed = 'newResultsDisplayed';
ResultListEvents.newResultDisplayed = 'newResultDisplayed';
ResultListEvents.openQuickview = 'openQuickview';
ResultListEvents.changeLayout = 'changeLayout';
exports.ResultListEvents = ResultListEvents;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../../lib/magic-box/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var OmniboxEvents = (function () {
    function OmniboxEvents() {
    }
    return OmniboxEvents;
}());
OmniboxEvents.populateOmnibox = 'populateOmnibox';
OmniboxEvents.openOmnibox = 'openOmnibox';
OmniboxEvents.closeOmnibox = 'closeOmnibox';
OmniboxEvents.populateOmniboxSuggestions = 'populateOmniboxSuggestions';
OmniboxEvents.omniboxPreprocessResultForQuery = 'omniboxPreprocessResultForQuery';
exports.OmniboxEvents = OmniboxEvents;


/***/ }),
/* 31 */
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
var RootComponent_1 = __webpack_require__(32);
var QueryBuilder_1 = __webpack_require__(40);
var LocalStorageUtils_1 = __webpack_require__(34);
var Assert_1 = __webpack_require__(6);
var SearchEndpointWithDefaultCallOptions_1 = __webpack_require__(249);
var QueryEvents_1 = __webpack_require__(10);
var QueryUtils_1 = __webpack_require__(16);
var Defer_1 = __webpack_require__(25);
var Dom_1 = __webpack_require__(2);
var Utils_1 = __webpack_require__(4);
var BaseComponent_1 = __webpack_require__(28);
var ExternalModulesShim_1 = __webpack_require__(21);
var coveo_analytics_1 = __webpack_require__(135);
var _ = __webpack_require__(0);
var DefaultQueryOptions = (function () {
    function DefaultQueryOptions() {
        this.searchAsYouType = false;
        this.closeModalBox = true;
        this.cancel = false;
        this.logInActionsHistory = false;
    }
    return DefaultQueryOptions;
}());
/**
 * This class is automatically instantiated and bound to the root of your search interface when you initialize the framework.<br/>
 * It is essentially a singleton that wraps the access to the {@link SearchEndpoint} endpoint to execute query, and is in charge of triggering the different query events.<br/>
 * This is what every component of the framework uses internally to execute query or access the endpoint.<br/>
 * When calling <code>Coveo.executeQuery</code> this class is used.
 */
var QueryController = (function (_super) {
    __extends(QueryController, _super);
    /**
     * Create a new query controller
     * @param element
     * @param options
     */
    function QueryController(element, options, usageAnalytics, searchInterface) {
        var _this = _super.call(this, element, QueryController.ID) || this;
        _this.options = options;
        _this.usageAnalytics = usageAnalytics;
        _this.searchInterface = searchInterface;
        _this.showingExecutingQueryAnimation = false;
        _this.localStorage = new LocalStorageUtils_1.LocalStorageUtils('lastQueryHash');
        Assert_1.Assert.exists(element);
        Assert_1.Assert.exists(options);
        _this.firstQuery = true;
        _this.historyStore = new coveo_analytics_1.history.HistoryStore();
        return _this;
    }
    /**
     * Set the {@link SearchEndpoint} that the query controller should use to execute query
     * @param endpoint
     */
    QueryController.prototype.setEndpoint = function (endpoint) {
        this.overrideEndpoint = endpoint;
        this.logger.debug('Endpoint set', endpoint);
    };
    /**
     * Get the {@link SearchEndpoint} that is currently used by the query controller to execute query
     * @returns {SearchEndpoint}
     */
    QueryController.prototype.getEndpoint = function () {
        var endpoint = this.overrideEndpoint || this.options.endpoint;
        // We must wrap the endpoint in a decorator that'll add the call options
        // we obtain by firing the proper event. Those are used for authentication
        // providers, and I guess other stuff later on.
        return new SearchEndpointWithDefaultCallOptions_1.SearchEndpointWithDefaultCallOptions(endpoint, this.getCallOptions());
    };
    /**
     * Return the last query that was performed by the query controller
     * @returns {IQuery|Query}
     */
    QueryController.prototype.getLastQuery = function () {
        return this.lastQuery || new QueryBuilder_1.QueryBuilder().build();
    };
    /**
     * Return the last query results set.
     * @returns {IQueryResults}
     */
    QueryController.prototype.getLastResults = function () {
        return this.lastQueryResults;
    };
    /**
     * Execute a query and return a Promise of IQueryResults.<br/>
     * This will execute the normal query flow, triggering all the necessary query events (newQuery <br/>
     * All components present in the interface will act accordingly (modify the query and render results if needed).
     * @param options
     * @returns {Promise<IQueryResults>}
     */
    QueryController.prototype.executeQuery = function (options) {
        var _this = this;
        options = _.extend(new DefaultQueryOptions(), options);
        if (options.closeModalBox) {
            ExternalModulesShim_1.ModalBox.close(true);
        }
        this.logger.debug('Executing new query');
        this.cancelAnyCurrentPendingQuery();
        if (options.beforeExecuteQuery != null) {
            options.beforeExecuteQuery();
        }
        if (!options.ignoreWarningSearchEvent) {
            this.usageAnalytics.warnAboutSearchEvent();
        }
        this.showExecutingQueryAnimation();
        var dataToSendOnNewQuery = {
            searchAsYouType: options.searchAsYouType,
            cancel: options.cancel,
            origin: options.origin
        };
        this.newQueryEvent(dataToSendOnNewQuery);
        if (dataToSendOnNewQuery.cancel) {
            this.cancelQuery();
            return;
        }
        var queryBuilder = this.createQueryBuilder(options);
        // The query was canceled
        if (!queryBuilder) {
            return;
        }
        var query = queryBuilder.build();
        if (options.logInActionsHistory) {
            this.logQueryInActionsHistory(query, options.isFirstQuery);
        }
        var endpointToUse = this.getEndpoint();
        var promise = this.currentPendingQuery = endpointToUse.search(query);
        promise.then(function (queryResults) {
            Assert_1.Assert.exists(queryResults);
            var firstQuery = _this.firstQuery;
            if (_this.firstQuery) {
                _this.firstQuery = false;
            }
            // If our promise is no longer the current one, then the query
            // has been cancel. We should do nothing here.
            if (promise !== _this.currentPendingQuery) {
                return;
            }
            _this.logger.debug('Query results received', query, queryResults);
            var enableHistory = _this.searchInterface && _this.searchInterface.options && _this.searchInterface.options.enableHistory;
            if ((!firstQuery || enableHistory) && _this.keepLastSearchUid(query, queryResults)) {
                queryResults.searchUid = _this.getLastSearchUid();
                queryResults._reusedSearchUid = true;
                QueryUtils_1.QueryUtils.setPropertyOnResults(queryResults, 'queryUid', _this.getLastSearchUid());
            }
            else {
                _this.lastQueryHash = _this.queryHash(query, queryResults);
                _this.lastSearchUid = queryResults.searchUid;
            }
            _this.lastQuery = query;
            _this.lastQueryResults = queryResults;
            _this.currentError = null;
            var dataToSendOnPreprocessResult = {
                queryBuilder: queryBuilder,
                query: query,
                results: queryResults,
                searchAsYouType: options.searchAsYouType
            };
            _this.preprocessResultsEvent(dataToSendOnPreprocessResult);
            var dataToSendOnNoResult = {
                queryBuilder: queryBuilder,
                query: query,
                results: queryResults,
                searchAsYouType: options.searchAsYouType,
                retryTheQuery: false
            };
            if (queryResults.results.length == 0) {
                _this.noResultEvent(dataToSendOnNoResult);
            }
            if (dataToSendOnNoResult.retryTheQuery) {
                // When retrying the query, we must forward the results to the deferred we
                // initially returned, in case someone is listening on it.
                return _this.executeQuery();
            }
            else {
                _this.lastQueryBuilder = queryBuilder;
                _this.currentPendingQuery = undefined;
                var dataToSendOnSuccess_1 = {
                    queryBuilder: queryBuilder,
                    query: query,
                    results: queryResults,
                    searchAsYouType: options.searchAsYouType
                };
                _this.querySuccessEvent(dataToSendOnSuccess_1);
                Defer_1.Defer.defer(function () {
                    _this.deferredQuerySuccessEvent(dataToSendOnSuccess_1);
                    _this.hideExecutingQueryAnimation();
                });
                return queryResults;
            }
        }).catch(function (error) {
            // If our deferred is no longer the current one, then the query
            // has been cancel. We should do nothing here.
            if (promise !== _this.currentPendingQuery) {
                return;
            }
            _this.logger.error('Query triggered an error', query, error);
            // this.currentPendingQuery.reject(error);
            _this.currentPendingQuery = undefined;
            var dataToSendOnError = {
                queryBuilder: queryBuilder,
                endpoint: endpointToUse,
                query: query,
                error: error,
                searchAsYouType: options.searchAsYouType
            };
            _this.lastQuery = query;
            _this.lastQueryResults = null;
            _this.currentError = error;
            _this.queryError(dataToSendOnError);
            _this.hideExecutingQueryAnimation();
        });
        var dataToSendDuringQuery = {
            queryBuilder: queryBuilder,
            query: query,
            searchAsYouType: options.searchAsYouType,
            promise: promise
        };
        this.duringQueryEvent(dataToSendDuringQuery);
        return this.currentPendingQuery;
    };
    /**
     * Using the same parameters as the last successful query, fetch another batch of results. Particularly useful for infinite scrolling, for example.
     * @param count
     * @returns {any}
     */
    QueryController.prototype.fetchMore = function (count) {
        var _this = this;
        if (this.currentPendingQuery != undefined) {
            return undefined;
        }
        // Send all pending events (think : search as you type)
        // This allows us to get the real search id for the results when the query returns
        this.usageAnalytics.sendAllPendingEvents();
        var queryBuilder = new QueryBuilder_1.QueryBuilder();
        this.continueLastQueryBuilder(queryBuilder, count);
        var query = queryBuilder.build();
        var endpointToUse = this.getEndpoint();
        var promise = this.currentPendingQuery = endpointToUse.search(query);
        var dataToSendDuringQuery = {
            queryBuilder: queryBuilder,
            query: query,
            searchAsYouType: false,
            promise: promise
        };
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.duringFetchMoreQuery, dataToSendDuringQuery);
        this.lastQueryBuilder = queryBuilder;
        this.lastQuery = query;
        promise.then(function (results) {
            // We re-use the search id from the initial search here, even though the
            // server provided us with a new one. 'Fetch mores' are considered to be
            // the same query from an analytics point of view.
            _this.currentPendingQuery = undefined;
            if (_this.lastQueryResults == null) {
                _this.lastQueryResults = results;
            }
            else {
                _.forEach(results.results, function (result) {
                    _this.lastQueryResults.results.push(result);
                });
            }
            var dataToSendOnPreprocessResult = {
                queryBuilder: queryBuilder,
                query: query,
                results: results,
                searchAsYouType: false
            };
            _this.preprocessResultsEvent(dataToSendOnPreprocessResult);
            QueryUtils_1.QueryUtils.setIndexAndUidOnQueryResults(query, results, _this.getLastSearchUid(), results.pipeline, results.splitTestRun);
            var dataToSendOnFetchMoreSuccess = {
                query: query,
                results: results,
                queryBuilder: queryBuilder,
                searchAsYouType: false
            };
            _this.fetchMoreSuccessEvent(dataToSendOnFetchMoreSuccess);
        });
        return this.currentPendingQuery;
    };
    /**
     * Cancel any pending query
     */
    QueryController.prototype.cancelQuery = function () {
        this.cancelAnyCurrentPendingQuery();
        this.hideExecutingQueryAnimation();
    };
    QueryController.prototype.deferExecuteQuery = function (options) {
        var _this = this;
        this.showExecutingQueryAnimation();
        Defer_1.Defer.defer(function () { return _this.executeQuery(options); });
    };
    QueryController.prototype.ensureCreatedQueryBuilder = function () {
        if (!this.createdOneQueryBuilder) {
            this.createQueryBuilder(new DefaultQueryOptions());
        }
    };
    QueryController.prototype.createQueryBuilder = function (options) {
        Assert_1.Assert.exists(options);
        this.createdOneQueryBuilder = true;
        var queryBuilder = new QueryBuilder_1.QueryBuilder();
        // Default values, components will probably override them if they exists
        queryBuilder.language = String['locale'];
        queryBuilder.firstResult = queryBuilder.firstResult || 0;
        // Allow outside code to customize the query builder. We provide two events,
        // to allow someone to have a peep at the query builder after the first phase
        // and add some stuff depending on what was put in there. The facets are using
        // this mechanism to generate query overrides.
        var dataToSendDuringBuildingQuery = {
            queryBuilder: queryBuilder,
            searchAsYouType: options.searchAsYouType,
            cancel: options.cancel
        };
        this.buildingQueryEvent(dataToSendDuringBuildingQuery);
        var dataToSendDuringDoneBuildingQuery = {
            queryBuilder: queryBuilder,
            searchAsYouType: options.searchAsYouType,
            cancel: options.cancel
        };
        this.doneBuildingQueryEvent(dataToSendDuringDoneBuildingQuery);
        if (dataToSendDuringBuildingQuery.cancel || dataToSendDuringDoneBuildingQuery.cancel) {
            this.cancelQuery();
            return;
        }
        var pipeline = this.getPipelineInUrl();
        if (pipeline) {
            queryBuilder.pipeline = pipeline;
        }
        return queryBuilder;
    };
    QueryController.prototype.isStandaloneSearchbox = function () {
        return Utils_1.Utils.isNonEmptyString(this.options.searchPageUri);
    };
    QueryController.prototype.saveLastQuery = function () {
        this.localStorage.save({
            expire: new Date().getTime() + 1000 * 60 * 30,
            hash: this.lastQueryHash,
            uid: this.lastSearchUid
        });
    };
    // This field is exposed for components rendered in the results or on-demand which
    // need access to the entire query. For example, the QuickviewDocument need to pass
    // the entire query to the Search API. For other components, QueryStateModel or
    // listening to events like 'doneBuildingQuery' is the way to go.
    QueryController.prototype.getLastQueryHash = function () {
        if (this.lastQueryHash != null) {
            return this.lastQueryHash;
        }
        this.loadLastQueryHash();
        return this.lastQueryHash || this.queryHash(new QueryBuilder_1.QueryBuilder().build());
    };
    QueryController.prototype.getLastSearchUid = function () {
        if (this.lastSearchUid != null) {
            return this.lastSearchUid;
        }
        this.loadLastQueryHash();
        return this.lastSearchUid;
    };
    QueryController.prototype.loadLastQueryHash = function () {
        var lastQuery = this.localStorage.load();
        if (lastQuery != null && new Date().getTime() <= lastQuery.expire) {
            this.lastQueryHash = lastQuery.hash;
            this.lastSearchUid = lastQuery.uid;
            this.localStorage.remove();
        }
    };
    QueryController.prototype.continueLastQueryBuilder = function (queryBuilder, count) {
        _.extend(queryBuilder, this.lastQueryBuilder);
        queryBuilder.firstResult = queryBuilder.firstResult + queryBuilder.numberOfResults;
        queryBuilder.numberOfResults = count;
    };
    QueryController.prototype.getPipelineInUrl = function () {
        return QueryUtils_1.QueryUtils.getUrlParameter('pipeline');
    };
    QueryController.prototype.cancelAnyCurrentPendingQuery = function () {
        if (Utils_1.Utils.exists(this.currentPendingQuery)) {
            this.logger.debug('Cancelling current pending query');
            Promise.reject('Cancelling current pending query');
            this.currentPendingQuery = undefined;
            return true;
        }
        return false;
    };
    QueryController.prototype.showExecutingQueryAnimation = function () {
        if (!this.showingExecutingQueryAnimation) {
            Dom_1.$$(this.element).addClass('coveo-executing-query');
            this.showingExecutingQueryAnimation = true;
        }
    };
    QueryController.prototype.hideExecutingQueryAnimation = function () {
        if (this.showingExecutingQueryAnimation) {
            Dom_1.$$(this.element).removeClass('coveo-executing-query');
            this.showingExecutingQueryAnimation = false;
        }
    };
    QueryController.prototype.keepLastSearchUid = function (query, queryResults) {
        return this.getLastQueryHash() == this.queryHash(query, queryResults);
    };
    QueryController.prototype.queryHash = function (query, queryResults) {
        var queryHash = JSON.stringify(_.omit(query, 'firstResult', 'groupBy', 'debug'));
        if (queryResults != null) {
            queryHash += queryResults.pipeline;
        }
        return queryHash;
    };
    QueryController.prototype.getCallOptions = function () {
        var args = {
            options: {
                authentication: []
            }
        };
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.buildingCallOptions, args);
        return args.options;
    };
    QueryController.prototype.newQueryEvent = function (args) {
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.newQuery, args);
    };
    QueryController.prototype.buildingQueryEvent = function (args) {
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.buildingQuery, args);
    };
    QueryController.prototype.doneBuildingQueryEvent = function (args) {
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.doneBuildingQuery, args);
    };
    QueryController.prototype.duringQueryEvent = function (args) {
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.duringQuery, args);
    };
    QueryController.prototype.querySuccessEvent = function (args) {
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.querySuccess, args);
    };
    QueryController.prototype.fetchMoreSuccessEvent = function (args) {
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.fetchMoreSuccess, args);
    };
    QueryController.prototype.deferredQuerySuccessEvent = function (args) {
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.deferredQuerySuccess, args);
    };
    QueryController.prototype.queryError = function (args) {
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.queryError, args);
    };
    QueryController.prototype.preprocessResultsEvent = function (args) {
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.preprocessResults, args);
    };
    QueryController.prototype.noResultEvent = function (args) {
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.noResults, args);
    };
    QueryController.prototype.debugInfo = function () {
        var _this = this;
        var info = {
            'query': this.lastQuery,
        };
        if (this.lastQueryResults != null) {
            info.queryDuration = function () { return _this.buildQueryDurationSection(_this.lastQueryResults); };
            info.results = function () { return _.omit(_this.lastQueryResults, 'results'); };
        }
        if (this.currentError != null) {
            info.error = function () { return _this.currentError; };
        }
        return info;
    };
    QueryController.prototype.buildQueryDurationSection = function (queryResults) {
        var dom = Dom_1.Dom.createElement('div', { className: 'coveo-debug-queryDuration' });
        var graph = Dom_1.Dom.createElement('div', { className: 'coveo-debug-durations' });
        var debugRef = BaseComponent_1.BaseComponent.getComponentRef('Debug');
        dom.appendChild(graph);
        _.forEach(debugRef.durationKeys, function (key) {
            var duration = queryResults[key];
            if (duration != null) {
                graph.appendChild(Dom_1.Dom.createElement('div', {
                    className: 'coveo-debug-duration',
                    style: "width:" + duration + "px",
                    'data-id': key
                }));
                var legend = Dom_1.Dom.createElement('div', { className: 'coveo-debug-duration-legend', 'data-id': key });
                dom.appendChild(legend);
                var keyDom = Dom_1.Dom.createElement('span', { className: 'coveo-debug-duration-label' });
                keyDom.appendChild(document.createTextNode(key));
                legend.appendChild(keyDom);
                var durationDom = Dom_1.Dom.createElement('span', { className: 'coveo-debug-duration-value' });
                durationDom.appendChild(document.createTextNode(duration));
                legend.appendChild(durationDom);
            }
        });
        return dom;
    };
    QueryController.prototype.logQueryInActionsHistory = function (query, isFirstQuery) {
        var queryElement = {
            name: 'Query',
            value: query.q,
            time: JSON.stringify(new Date())
        };
        this.historyStore.addElement(queryElement);
    };
    return QueryController;
}(RootComponent_1.RootComponent));
QueryController.ID = 'QueryController';
exports.QueryController = QueryController;


/***/ }),
/* 32 */
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
var BaseComponent_1 = __webpack_require__(28);
var RootComponent = (function (_super) {
    __extends(RootComponent, _super);
    function RootComponent(element, type) {
        var _this = _super.call(this, element, type) || this;
        _this.element = element;
        _this.type = type;
        return _this;
    }
    return RootComponent;
}(BaseComponent_1.BaseComponent));
exports.RootComponent = RootComponent;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='Facet.ts' />
var StringUtils_1 = __webpack_require__(18);
var QueryUtils_1 = __webpack_require__(16);
var FileTypes_1 = __webpack_require__(81);
var DateUtils_1 = __webpack_require__(27);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var FacetUtils = (function () {
    function FacetUtils() {
    }
    FacetUtils.getRegexToUseForFacetSearch = function (value, ignoreAccent) {
        return new RegExp(StringUtils_1.StringUtils.stringToRegex(value, ignoreAccent), 'i');
    };
    FacetUtils.getValuesToUseForSearchInFacet = function (original, facet) {
        var ret = [original];
        var regex = this.getRegexToUseForFacetSearch(original, facet.options.facetSearchIgnoreAccents);
        if (facet.options.valueCaption) {
            _.chain(facet.options.valueCaption)
                .pairs()
                .filter(function (pair) {
                return regex.test(pair[1]);
            })
                .each(function (match) {
                ret.push(match[0]);
            });
            if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@objecttype') || QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@filetype')) {
                _.each(FileTypes_1.FileTypes.getFileTypeCaptions(), function (value, key) {
                    if (!(key in facet.options.valueCaption) && regex.test(value)) {
                        ret.push(key);
                    }
                });
            }
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@objecttype') || QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@filetype')) {
            _.each(_.filter(_.pairs(FileTypes_1.FileTypes.getFileTypeCaptions()), function (pair) {
                return regex.test(pair[1]);
            }), function (match) {
                ret.push(match[0]);
            });
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@month')) {
            _.each(_.range(1, 13), function (month) {
                if (regex.test(DateUtils_1.DateUtils.monthToString(month - 1))) {
                    ret.push(('0' + month.toString()).substr(-2));
                }
            });
        }
        return ret;
    };
    FacetUtils.buildFacetSearchPattern = function (values) {
        values = _.map(values, function (value) {
            return Utils_1.Utils.escapeRegexCharacter(value);
        });
        values[0] = '.*' + values[0] + '.*';
        return values.join('|');
    };
    FacetUtils.needAnotherFacetSearch = function (currentSearchLength, newSearchLength, oldSearchLength, desiredSearchLength) {
        // Something was removed (currentSearch < newSearch)
        // && we might want to display more facet search result(currentSearch < desiredSearch)
        // && the new query returned more stuff than the old one so there's still more results(currentSearchLength > oldLength)
        return currentSearchLength < newSearchLength && currentSearchLength < desiredSearchLength && currentSearchLength > oldSearchLength;
    };
    FacetUtils.addNoStateCssClassToFacetValues = function (facet, container) {
        // This takes care of adding the correct css class on each facet value checkbox (empty white box) if at least one value is selected in that facet
        if (facet.values.getSelected().length != 0) {
            var noStates = Dom_1.$$(container).findAll('li:not(.coveo-selected)');
            _.each(noStates, function (noState) {
                Dom_1.$$(noState).addClass('coveo-no-state');
            });
        }
    };
    FacetUtils.tryToGetTranslatedCaption = function (field, value) {
        var found;
        if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@filetype')) {
            found = FileTypes_1.FileTypes.getFileType(value.toLowerCase()).caption;
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@month')) {
            try {
                var month = parseInt(value);
                found = DateUtils_1.DateUtils.monthToString(month - 1);
            }
            catch (ex) {
                // Do nothing
            }
        }
        return found != undefined && Utils_1.Utils.isNonEmptyString(found) ? found : value;
    };
    FacetUtils.clipCaptionsToAvoidOverflowingTheirContainer = function (facet, forceClip) {
        if (forceClip === void 0) { forceClip = false; }
        // in new design, we don't need this : use flexbox instead (sorry IE user)
        if (facet.getBindings && facet.getBindings().searchInterface && facet.getBindings().searchInterface.isNewDesign() && !forceClip) {
            return;
        }
        if (!(Coveo.HierarchicalFacet && facet instanceof Coveo.HierarchicalFacet) || forceClip) {
            facet.logger.trace('Clipping captions');
            // force facet to show to calculate width
            Dom_1.$$(facet.element).show();
            var element = facet.element;
            var captions = Dom_1.$$(element).findAll('.coveo-facet-value-caption');
            for (var i = 0; i < captions.length; i++) {
                if (captions[i].style.width != '') {
                    captions[i].style.width = '';
                }
            }
            var labels = Dom_1.$$(element).findAll('.coveo-facet-value-label-wrapper');
            var labelsMaxWidth = [];
            for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                var caption = Dom_1.$$(label).find('.coveo-facet-value-caption');
                var labelWidth = label.scrollWidth;
                var labelVisibleWidth = label.clientWidth;
                var captionWidth = caption.scrollWidth;
                var crop = Math.max(0, labelWidth - labelVisibleWidth);
                if (crop) {
                    labelsMaxWidth.push({
                        element: caption,
                        width: captionWidth,
                        crop: crop,
                        label: label
                    });
                }
            }
            // remove the specific css class
            element.style.display = '';
            for (var i = 0; i < labelsMaxWidth.length; i++) {
                var labelMaxWidth = labelsMaxWidth[i];
                labelMaxWidth.element.style.width = labelMaxWidth.width - labelMaxWidth.crop + 'px';
                if (labelMaxWidth.crop > 0) {
                    labelMaxWidth.label.setAttribute('title', Dom_1.$$(labelMaxWidth.element).text());
                }
                else {
                    labelMaxWidth.label.setAttribute('title', null);
                }
            }
        }
    };
    return FacetUtils;
}());
exports.FacetUtils = FacetUtils;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var localStorage = window.localStorage;
var LocalStorageUtils = (function () {
    function LocalStorageUtils(id) {
        this.id = id;
    }
    LocalStorageUtils.prototype.save = function (data) {
        try {
            if (localStorage != null) {
                localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(data));
            }
        }
        catch (error) {
        }
    };
    LocalStorageUtils.prototype.load = function () {
        try {
            if (localStorage == null) {
                return null;
            }
            var value = localStorage.getItem(this.getLocalStorageKey());
            return value && JSON.parse(value);
        }
        catch (error) {
            return null;
        }
    };
    LocalStorageUtils.prototype.remove = function (key) {
        try {
            if (localStorage != null) {
                if (key == undefined) {
                    localStorage.removeItem(this.getLocalStorageKey());
                }
                else {
                    var oldObj = this.load();
                    delete oldObj[key];
                    this.save(oldObj);
                }
            }
        }
        catch (error) {
        }
    };
    LocalStorageUtils.prototype.getLocalStorageKey = function () {
        return 'coveo-' + this.id;
    };
    return LocalStorageUtils;
}());
exports.LocalStorageUtils = LocalStorageUtils;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EndpointCaller_1 = __webpack_require__(70);
var Logger_1 = __webpack_require__(13);
var Assert_1 = __webpack_require__(6);
var Version_1 = __webpack_require__(69);
var AjaxError_1 = __webpack_require__(247);
var MissingAuthenticationError_1 = __webpack_require__(248);
var QueryUtils_1 = __webpack_require__(16);
var QueryError_1 = __webpack_require__(111);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var PromisesShim_1 = __webpack_require__(108);
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
            response.data.clientDuration = timeToExecute;
            response.data.duration = response.duration || timeToExecute;
            return response.data;
        }).catch(function (error) {
            if (autoRenewToken && _this.canRenewAccessToken() && _this.isAccessTokenExpiredStatus(error.statusCode)) {
                _this.renewAccessToken().then(function () {
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var HashUtils = (function () {
    function HashUtils() {
    }
    HashUtils.getHash = function (w) {
        if (w === void 0) { w = window; }
        Assert_1.Assert.exists(w);
        // window.location.hash returns the DECODED hash on Firefox (it's a well known bug),
        // so any & in values will be already unescaped. This breaks our value splitting.
        // The following trick works on all browsers.
        var ret = '#' + (w.location.href.split('#')[1] || '');
        return HashUtils.getAjaxcrawlableHash(ret);
    };
    HashUtils.getValue = function (key, toParse) {
        Assert_1.Assert.isNonEmptyString(key);
        Assert_1.Assert.exists(toParse);
        toParse = HashUtils.getAjaxcrawlableHash(toParse);
        var paramValue = HashUtils.getRawValue(key, toParse);
        if (paramValue != undefined) {
            paramValue = HashUtils.getValueDependingOnType(key, paramValue);
        }
        return paramValue;
    };
    HashUtils.encodeValues = function (values) {
        var hash = [];
        _.each(values, function (valueToEncode, key, obj) {
            var encodedValue = '';
            if (Utils_1.Utils.isNonEmptyArray(valueToEncode)) {
                encodedValue = HashUtils.encodeArray(valueToEncode);
            }
            else if (_.isObject(valueToEncode) && Utils_1.Utils.isNonEmptyArray(_.keys(valueToEncode))) {
                encodedValue = HashUtils.encodeObject(valueToEncode);
            }
            else if (!Utils_1.Utils.isNullOrUndefined(valueToEncode)) {
                encodedValue = encodeURIComponent(valueToEncode.toString());
            }
            if (encodedValue != '') {
                hash.push(key + '=' + encodedValue);
            }
        });
        return hash.join('&');
    };
    HashUtils.getAjaxcrawlableHash = function (hash) {
        if (hash[1] != undefined && hash[1] == '!') {
            return hash.substring(0, 1) + hash.substring(2);
        }
        else {
            return hash;
        }
    };
    HashUtils.getRawValue = function (key, toParse) {
        Assert_1.Assert.exists(key);
        Assert_1.Assert.exists(toParse);
        Assert_1.Assert.check(toParse.indexOf('#') == 0 || toParse == '');
        var toParseArray = toParse.substr(1).split('&');
        var paramPos = 0;
        var loop = true;
        var paramValue = undefined;
        while (loop) {
            var paramValuePair = toParseArray[paramPos].split('=');
            if (paramValuePair[0] == key) {
                loop = false;
                paramValue = paramValuePair[1];
            }
            else {
                paramPos++;
                if (paramPos >= toParseArray.length) {
                    paramPos = undefined;
                    loop = false;
                }
            }
        }
        return paramValue;
    };
    HashUtils.getValueDependingOnType = function (key, paramValue) {
        var type = HashUtils.getValueType(key, paramValue);
        var returnValue;
        if (type == 'object') {
            returnValue = HashUtils.decodeObject(paramValue);
        }
        else if (type == 'array') {
            returnValue = HashUtils.decodeArray(paramValue);
        }
        else {
            returnValue = decodeURIComponent(paramValue);
        }
        return returnValue;
    };
    HashUtils.getValueType = function (key, paramValue) {
        if (key == 'q') {
            return 'other';
        }
        else if (HashUtils.isObject(paramValue)) {
            return 'object';
        }
        else if (HashUtils.isArray(paramValue)) {
            return 'array';
        }
        else {
            return 'other';
        }
    };
    HashUtils.isArrayStartNotEncoded = function (value) {
        return value.substr(0, 1) == HashUtils.DELIMITER.arrayStart;
    };
    HashUtils.isArrayStartEncoded = function (value) {
        return value.indexOf(encodeURIComponent(HashUtils.DELIMITER.arrayStart)) == 0;
    };
    HashUtils.isArrayEndNotEncoded = function (value) {
        return value.substr(value.length - 1);
    };
    HashUtils.isArrayEndEncoded = function (value) {
        return value.indexOf(encodeURIComponent(HashUtils.DELIMITER.arrayEnd)) == value.length - encodeURIComponent(HashUtils.DELIMITER.arrayEnd).length;
    };
    HashUtils.isObjectStartNotEncoded = function (value) {
        return value.substr(0, 1) == HashUtils.DELIMITER.objectStart;
    };
    HashUtils.isObjectStartEncoded = function (value) {
        return value.indexOf(encodeURIComponent(HashUtils.DELIMITER.objectStart)) == 0;
    };
    HashUtils.isObjectEndNotEncoded = function (value) {
        return value.substr(value.length - 1) == HashUtils.DELIMITER.objectEnd;
    };
    HashUtils.isObjectEndEncoded = function (value) {
        return value.indexOf(encodeURIComponent(HashUtils.DELIMITER.objectEnd)) == value.length - encodeURIComponent(HashUtils.DELIMITER.objectEnd).length;
    };
    HashUtils.isObject = function (value) {
        var isObjectStart = HashUtils.isObjectStartNotEncoded(value) || HashUtils.isObjectStartEncoded(value);
        var isObjectEnd = HashUtils.isObjectEndNotEncoded(value) || HashUtils.isObjectEndEncoded(value);
        return isObjectStart && isObjectEnd;
    };
    HashUtils.isArray = function (value) {
        var isArrayStart = HashUtils.isArrayStartNotEncoded(value) || HashUtils.isArrayStartEncoded(value);
        var isArrayEnd = HashUtils.isArrayEndNotEncoded(value) || HashUtils.isArrayEndEncoded(value);
        return isArrayStart && isArrayEnd;
    };
    HashUtils.encodeArray = function (array) {
        var arrayReturn = _.map(array, function (value) {
            return encodeURIComponent(value);
        });
        return HashUtils.DELIMITER.arrayStart + arrayReturn.join(',') + HashUtils.DELIMITER.arrayEnd;
    };
    HashUtils.encodeObject = function (obj) {
        var _this = this;
        var retArray = _.map(obj, function (val, key, obj) {
            return "\"" + encodeURIComponent(key) + "\":" + _this.encodeValue(val);
        });
        return HashUtils.DELIMITER.objectStart + retArray.join(' , ') + HashUtils.DELIMITER.objectEnd;
    };
    HashUtils.encodeValue = function (val) {
        var encodedValue = '';
        if (_.isArray(val)) {
            encodedValue = HashUtils.encodeArray(val);
        }
        else if (_.isObject(val)) {
            encodedValue = HashUtils.encodeObject(val);
        }
        else if (_.isNumber(val) || _.isBoolean(val)) {
            encodedValue = encodeURIComponent(val.toString());
        }
        else {
            encodedValue = '"' + encodeURIComponent(val) + '"';
        }
        return encodedValue;
    };
    HashUtils.decodeObject = function (obj) {
        if (HashUtils.isObjectStartEncoded(obj) && HashUtils.isObjectEndEncoded(obj)) {
            obj = obj.replace(/encodeURIComponent(HashUtils.Delimiter.objectStart)/, HashUtils.DELIMITER.objectStart);
            obj = obj.replace(encodeURIComponent(HashUtils.DELIMITER.objectEnd), HashUtils.DELIMITER.objectEnd);
        }
        return JSON.parse(decodeURIComponent(obj));
    };
    HashUtils.decodeArray = function (value) {
        if (HashUtils.isArrayStartEncoded(value) && HashUtils.isArrayEndEncoded(value)) {
            value = value.replace(encodeURIComponent(HashUtils.DELIMITER.arrayStart), HashUtils.DELIMITER.arrayStart);
            value = value.replace(encodeURIComponent(HashUtils.DELIMITER.arrayEnd), HashUtils.DELIMITER.arrayEnd);
        }
        value = value.substr(1);
        value = value.substr(0, value.length - 1);
        var array = value.split(',');
        return _.map(array, function (val) {
            return decodeURIComponent(val);
        });
    };
    return HashUtils;
}());
HashUtils.DELIMITER = {
    'objectStart': '{',
    'objectEnd': '}',
    'arrayStart': '[',
    'arrayEnd': ']',
    'objectStartRegExp': '^{',
    'objectEndRegExp': '}+$',
    'arrayStartRegExp': '^[',
    'arrayEndRegExp': ']+$'
};
exports.HashUtils = HashUtils;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SettingsEvents = (function () {
    function SettingsEvents() {
    }
    return SettingsEvents;
}());
SettingsEvents.settingsPopulateMenu = 'settingsPopulateMenu';
exports.SettingsEvents = SettingsEvents;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
__webpack_require__(218);
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
/* 39 */
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
var Template_1 = __webpack_require__(23);
var Assert_1 = __webpack_require__(6);
var Utils_1 = __webpack_require__(4);
var Logger_1 = __webpack_require__(13);
var TemplateFromAScriptTag_1 = __webpack_require__(115);
var DefaultResultTemplate_1 = __webpack_require__(82);
var _ = __webpack_require__(0);
var UnderscoreTemplate = (function (_super) {
    __extends(UnderscoreTemplate, _super);
    function UnderscoreTemplate(element) {
        var _this = _super.call(this) || this;
        _this.element = element;
        Assert_1.Assert.exists(element);
        var templateString = element.innerHTML;
        try {
            _this.template = _.template(templateString);
        }
        catch (e) {
            new Logger_1.Logger(_this).error('Cannot instantiate underscore template. Might be caused by strict Content-Security-Policy. Will fallback on a default template...', e);
        }
        _this.templateFromAScriptTag = new TemplateFromAScriptTag_1.TemplateFromAScriptTag(_this, _this.element);
        _this.dataToString = function (object) {
            var extended = _.extend({}, object, UnderscoreTemplate.templateHelpers);
            if (_this.template) {
                return _this.template(extended);
            }
            else {
                return new DefaultResultTemplate_1.DefaultResultTemplate().getFallbackTemplate();
            }
        };
        return _this;
    }
    UnderscoreTemplate.prototype.toHtmlElement = function () {
        var script = this.templateFromAScriptTag.toHtmlElement();
        script.setAttribute('type', _.first(UnderscoreTemplate.mimeTypes));
        return script;
    };
    UnderscoreTemplate.prototype.getType = function () {
        return 'UnderscoreTemplate';
    };
    UnderscoreTemplate.registerTemplateHelper = function (helperName, helper) {
        UnderscoreTemplate.templateHelpers[helperName] = helper;
    };
    UnderscoreTemplate.isLibraryAvailable = function () {
        return Utils_1.Utils.exists(window['_']);
    };
    UnderscoreTemplate.fromString = function (template, properties) {
        var script = TemplateFromAScriptTag_1.TemplateFromAScriptTag.fromString(template, properties);
        script.setAttribute('type', UnderscoreTemplate.mimeTypes[0]);
        return new UnderscoreTemplate(script);
    };
    UnderscoreTemplate.create = function (element) {
        Assert_1.Assert.exists(element);
        return new UnderscoreTemplate(element);
    };
    return UnderscoreTemplate;
}(Template_1.Template));
UnderscoreTemplate.templateHelpers = {};
UnderscoreTemplate.mimeTypes = [
    'text/underscore',
    'text/underscore-template',
    'text/x-underscore',
    'text/x-underscore-template'
];
exports.UnderscoreTemplate = UnderscoreTemplate;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionBuilder_1 = __webpack_require__(65);
var _ = __webpack_require__(0);
/**
 * The QueryBuilder is used to build a {@link IQuery} that will be able to be executed using the Search API.<br/>
 * The class exposes several members and methods that help components and external code to build up the final query that is sent to the Search API.<br/>
 */
var QueryBuilder = (function () {
    function QueryBuilder() {
        /**
         * Used to build the basic part of the query expression.<br/>
         * This part typically consists of user-entered content such as query keywords, etc.
         * @type {Coveo.ExpressionBuilder}
         */
        this.expression = new ExpressionBuilder_1.ExpressionBuilder();
        /**
         * Used to build the advanced part of the query expression.<br/>
         * This part is typically formed of filter expressions generated by components such as facets, external code, etc.
         * @type {Coveo.ExpressionBuilder}
         */
        this.advancedExpression = new ExpressionBuilder_1.ExpressionBuilder();
        /**
         * Used to build the advanced part of the query expression.<br/>
         * This part is similar to `advancedExpression`, but its content is interpreted as a constant expression by the index and it takes advantage of special caching features.
         * @type {Coveo.ExpressionBuilder}
         */
        this.constantExpression = new ExpressionBuilder_1.ExpressionBuilder();
        /**
         * The contextual text.<br/>
         * This is the contextual text part of the query. It uses the Coveo Machine Learning service to pick key keywords from the text and add them to the basic expression.
         * This field is mainly used to pass context such a case description, long textual query or any other form of text that might help in
         * refining the query.
         */
        this.longQueryExpression = new ExpressionBuilder_1.ExpressionBuilder();
        /**
         * Used to build the disjunctive part of the query expression.<br/>
         * When present, this part is evaluated separately from the other expressions and the matching results are merged to those matching expressions, `advancedExpression` and `constantExpression`.<br/>
         * The final boolean expression for the query is thus (basic advanced constant) OR (disjunction).
         * @type {Coveo.ExpressionBuilder}
         */
        this.disjunctionExpression = new ExpressionBuilder_1.ExpressionBuilder();
        /**
         * Whether to enable the special query syntax such as field references for the basic query expression (parameter q).
         * It is equivalent to a No syntax block applied to the basic query expression.
         * If not specified, the parameter defaults to false.
         */
        this.enableQuerySyntax = false;
        /**
         * This is the 0-based index of the first result to return.<br/>
         * If not specified, this parameter defaults to 0.
         */
        this.firstResult = 0;
        /**
         * This is the number of results to return, starting from {@link IQuery.firstResult}.<br/>
         * If not specified, this parameter defaults to 10.
         */
        this.numberOfResults = 10;
        this.requiredFields = [];
        this.includeRequiredFields = false;
        /**
         * Whether to enable query corrections on this query (see {@link DidYouMean}).
         */
        this.enableDidYouMean = false;
        /**
         * Whether to enable debug info on the query.<br/>
         * This will return additional information on the resulting JSON response from the Search API.<br/>
         * Mostly: execution report (a detailed breakdown of the parsed and executed query).
         */
        this.enableDebug = false;
        /**
         * This specifies the sort criterion(s) to use to sort results. If not specified, this parameter defaults to relevancy.<br/>
         * Possible values are : <br/>
         * -- relevancy :  This uses all the configured ranking weights as well as any specified ranking expressions to rank results.<br/>
         * -- dateascending / datedescending Sort using the value of the `@date` field, which is typically the last modification date of an item in the index.<br/>
         * -- qre : Sort using only the weights applied through ranking expressions. This is much like using `relevancy` except that automatic weights based on keyword proximity etc, are not computed.<br/>
         * -- nosort : Do not sort the results. The order in which items are returned is essentially random.<br/>
         * -- @field ascending / @field descending Sort using the value of a custom field.
         */
        this.sortCriteria = 'relevancy';
        this.retrieveFirstSentences = true;
        /**
         * This specifies an array of Query Function operation that will be executed on the results.
         */
        this.queryFunctions = [];
        /**
         * This specifies an array of Ranking Function operations that will be executed on the results.
         */
        this.rankingFunctions = [];
        /**
         * This specifies an array of Group By operations that can be performed on the query results to extract facets.
         */
        this.groupByRequests = [];
        this.enableDuplicateFiltering = false;
    }
    /**
     * Build the current content or state of the query builder and return a {@link IQuery}.<br/>
     * build can be called multiple times on the same QueryBuilder.
     * @returns {IQuery}
     */
    QueryBuilder.prototype.build = function () {
        var query = {
            q: this.expression.build(),
            aq: this.advancedExpression.build(),
            cq: this.constantExpression.build(),
            lq: this.longQueryExpression.build(),
            dq: this.disjunctionExpression.build(),
            searchHub: this.searchHub,
            tab: this.tab,
            language: this.language,
            pipeline: this.pipeline,
            maximumAge: this.maximumAge,
            wildcards: this.enableWildcards,
            questionMark: this.enableQuestionMarks,
            lowercaseOperators: this.enableLowercaseOperators,
            partialMatch: this.enablePartialMatch,
            partialMatchKeywords: this.partialMatchKeywords,
            partialMatchThreshold: this.partialMatchThreshold,
            firstResult: this.firstResult,
            numberOfResults: this.numberOfResults,
            excerptLength: this.excerptLength,
            filterField: this.filterField,
            filterFieldRange: this.filterFieldRange,
            parentField: this.parentField,
            childField: this.childField,
            fieldsToInclude: this.computeFieldsToInclude(),
            fieldsToExclude: this.fieldsToExclude,
            enableDidYouMean: this.enableDidYouMean,
            sortCriteria: this.sortCriteria,
            sortField: this.sortField,
            queryFunctions: this.queryFunctions,
            rankingFunctions: this.rankingFunctions,
            groupBy: this.groupByRequests,
            retrieveFirstSentences: this.retrieveFirstSentences,
            timezone: this.timezone,
            enableQuerySyntax: this.enableQuerySyntax,
            enableDuplicateFiltering: this.enableDuplicateFiltering,
            enableCollaborativeRating: this.enableCollaborativeRating,
            debug: this.enableDebug,
            context: this.context,
            actionsHistory: this.actionsHistory,
            recommendation: this.recommendation
        };
        return query;
    };
    /**
     * Return only the expression(s) part(s) of the query, as a string.<br/>
     * This means the basic, advanced and constant part in a complete expression {@link IQuery.q}, {@link IQuery.aq}, {@link IQuery.cq}.
     * @returns {string}
     */
    QueryBuilder.prototype.computeCompleteExpression = function () {
        return this.computeCompleteExpressionParts().full;
    };
    /**
     * Return only the expression(s) part(s) of the query, as an object.
     * @returns {{full: string, withoutConstant: string, constant: string}}
     */
    QueryBuilder.prototype.computeCompleteExpressionParts = function () {
        var withoutConstant = ExpressionBuilder_1.ExpressionBuilder.merge(this.expression, this.advancedExpression);
        return {
            full: ExpressionBuilder_1.ExpressionBuilder.mergeUsingOr(ExpressionBuilder_1.ExpressionBuilder.merge(withoutConstant, this.constantExpression), this.disjunctionExpression).build(),
            withoutConstant: ExpressionBuilder_1.ExpressionBuilder.mergeUsingOr(withoutConstant, this.disjunctionExpression).build(),
            basic: ExpressionBuilder_1.ExpressionBuilder.mergeUsingOr(this.expression, this.disjunctionExpression).build(),
            advanced: ExpressionBuilder_1.ExpressionBuilder.mergeUsingOr(this.advancedExpression, this.disjunctionExpression).build(),
            constant: ExpressionBuilder_1.ExpressionBuilder.mergeUsingOr(this.constantExpression, this.disjunctionExpression).build()
        };
    };
    /**
     * Return only the expression(s) part(s) of the query, as a string, except the given expression.<br/>
     * This is used by {@link Facet}, to build their group by request with query override.
     * @param except
     * @returns {string}
     */
    QueryBuilder.prototype.computeCompleteExpressionExcept = function (except) {
        return this.computeCompleteExpressionPartsExcept(except).full;
    };
    /**
     * Return only the expression(s) part(s) of the query, as an object, except the given expression.<br/>
     * This is used by {@link Facet}, to build their group by request with query override.
     * @param except
     * @returns {{full: string, withoutConstant: string, constant: string}}
     */
    QueryBuilder.prototype.computeCompleteExpressionPartsExcept = function (except) {
        var withoutConstantAndExcept = ExpressionBuilder_1.ExpressionBuilder.merge(this.expression, this.advancedExpression);
        withoutConstantAndExcept.remove(except);
        var basicAndExcept = new ExpressionBuilder_1.ExpressionBuilder();
        basicAndExcept.fromExpressionBuilder(this.expression);
        basicAndExcept.remove(except);
        var advancedAndExcept = new ExpressionBuilder_1.ExpressionBuilder();
        advancedAndExcept.fromExpressionBuilder(this.advancedExpression);
        advancedAndExcept.remove(except);
        return {
            full: ExpressionBuilder_1.ExpressionBuilder.mergeUsingOr(ExpressionBuilder_1.ExpressionBuilder.merge(withoutConstantAndExcept, this.constantExpression), this.disjunctionExpression).build(),
            withoutConstant: ExpressionBuilder_1.ExpressionBuilder.mergeUsingOr(withoutConstantAndExcept, this.disjunctionExpression).build(),
            basic: ExpressionBuilder_1.ExpressionBuilder.mergeUsingOr(basicAndExcept, this.disjunctionExpression).build(),
            advanced: ExpressionBuilder_1.ExpressionBuilder.mergeUsingOr(advancedAndExcept, this.disjunctionExpression).build(),
            constant: ExpressionBuilder_1.ExpressionBuilder.mergeUsingOr(this.constantExpression, this.disjunctionExpression).build()
        };
    };
    /**
     * Add fields to specifically include when the results return.<br/>
     * This can be used to accelerate the execution time of every query, as there is much less data to process if you whitelist specific fields.
     * @param fields
     */
    QueryBuilder.prototype.addFieldsToInclude = function (fields) {
        this.fieldsToInclude = _.uniq((this.fieldsToInclude || []).concat(fields));
    };
    QueryBuilder.prototype.addRequiredFields = function (fields) {
        this.requiredFields = _.uniq(this.requiredFields.concat(fields));
    };
    /**
     * Add fields to specifically exclude when the results return.<br/>
     * This can be used to accelerate the execution time of every query, as there is much less data to process if you blacklist specific fields.
     * @param fields
     */
    QueryBuilder.prototype.addFieldsToExclude = function (fields) {
        this.fieldsToExclude = _.uniq((this.fieldsToInclude || []).concat(fields));
    };
    QueryBuilder.prototype.computeFieldsToInclude = function () {
        if (this.includeRequiredFields || this.fieldsToInclude != null) {
            return this.requiredFields.concat(this.fieldsToInclude || []);
        }
        else {
            return null;
        }
    };
    /**
     * Add a single context key->value pair to the query.<br/>
     * This is used by the Query pipeline in the Coveo platform.
     * @param key
     * @param value
     */
    QueryBuilder.prototype.addContextValue = function (key, value) {
        if (this.context == null) {
            this.context = {};
        }
        this.context[key] = value;
    };
    /**
     * Add a context object to the query.<br/>
     * This can contain multiple key->value.<br/>
     * This is used by the Query pipeline in the Coveo platform.
     * @param values
     */
    QueryBuilder.prototype.addContext = function (values) {
        if (this.context == null) {
            this.context = {};
        }
        _.extend(this.context, values);
    };
    return QueryBuilder;
}());
exports.QueryBuilder = QueryBuilder;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var DateUtils_1 = __webpack_require__(27);
var FileTypes_1 = __webpack_require__(81);
var Utils_1 = __webpack_require__(4);
var StringUtils_1 = __webpack_require__(18);
var DomUtils = (function () {
    function DomUtils() {
    }
    DomUtils.getPopUpCloseButton = function (captionForClose, captionForReminder) {
        var container = document.createElement('span');
        var closeButton = document.createElement('span');
        Dom_1.$$(closeButton).addClass('coveo-close-button');
        container.appendChild(closeButton);
        var iconClose = document.createElement('span');
        Dom_1.$$(iconClose).addClass('coveo-icon');
        Dom_1.$$(iconClose).addClass('coveo-sprites-quickview-close');
        closeButton.appendChild(iconClose);
        Dom_1.$$(closeButton).text(captionForClose);
        var closeReminder = document.createElement('span');
        Dom_1.$$(closeReminder).addClass('coveo-pop-up-reminder');
        Dom_1.$$(closeReminder).text(captionForReminder);
        container.appendChild(closeReminder);
        return container.outerHTML;
    };
    DomUtils.getBasicLoadingAnimation = function () {
        var loadDotClass = 'coveo-loading-dot';
        var dom = document.createElement('div');
        dom.className = 'coveo-first-loading-animation';
        dom.innerHTML = "<div class='coveo-logo' ></div>\n    <div class='coveo-loading-container'>\n      <div class='" + loadDotClass + "'></div>\n      <div class='" + loadDotClass + "'></div>\n      <div class='" + loadDotClass + "'></div>\n      <div class='" + loadDotClass + "'></div>\n    </div>";
        return dom;
    };
    DomUtils.highlightElement = function (initialString, valueToSearch) {
        var regex = new RegExp(Utils_1.Utils.escapeRegexCharacter(StringUtils_1.StringUtils.latinize(valueToSearch)), 'i');
        var firstChar = StringUtils_1.StringUtils.latinize(initialString).search(regex);
        var lastChar = firstChar + valueToSearch.length;
        return StringUtils_1.StringUtils.htmlEncode(initialString.slice(0, firstChar)) + "<span class='coveo-highlight'>" + StringUtils_1.StringUtils.htmlEncode(initialString.slice(firstChar, lastChar)) + "</span>" + StringUtils_1.StringUtils.htmlEncode(initialString.slice(lastChar));
    };
    DomUtils.getLoadingSpinner = function () {
        var loading = Dom_1.$$('div', {
            className: 'coveo-loading-spinner'
        });
        return loading.el;
    };
    DomUtils.getModalBoxHeader = function (title) {
        var header = Dom_1.$$('div');
        header.el.innerHTML = "<div class='coveo-modalbox-right-header'>\n        <span class='coveo-modalbox-close-button'>\n          <span class='coveo-icon coveo-sprites-common-clear'></span>\n        </span>\n      </div>\n      <div class='coveo-modalbox-left-header'>\n        <span class='coveo-modalbox-pop-up-reminder'> " + (title || '') + "</span>\n      </div>";
        return header;
    };
    DomUtils.getQuickviewHeader = function (result, options, bindings) {
        var date = '';
        if (options.showDate) {
            date = DateUtils_1.DateUtils.dateTimeToString(new Date(Utils_1.Utils.getFieldValue(result, 'date')));
        }
        var fileType = FileTypes_1.FileTypes.get(result);
        var header = Dom_1.$$('div');
        header.el.innerHTML = "<div class='coveo-quickview-right-header'>\n        <span class='coveo-quickview-time'>" + date + "</span>\n        <span class='coveo-quickview-close-button'>\n          <span class='coveo-icon coveo-sprites-common-clear'></span>\n        </span>\n      </div>\n      <div class='coveo-quickview-left-header'>\n        <span class='coveo-quickview-icon coveo-small " + fileType.icon + "'></span>\n        <a class='coveo-quickview-pop-up-reminder'> " + (options.title || '') + "</a>\n      </div>";
        new Coveo[Coveo['Salesforce'] ? 'SalesforceResultLink' : 'ResultLink'](header.find('.coveo-quickview-pop-up-reminder'), undefined, bindings, result);
        return header;
    };
    DomUtils.getCurrentScript = function () {
        return document.currentScript;
    };
    return DomUtils;
}());
exports.DomUtils = DomUtils;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var Assert_1 = __webpack_require__(6);
var _ = __webpack_require__(0);
var StringAndHoles = (function () {
    function StringAndHoles() {
    }
    StringAndHoles.replace = function (str, find, replace) {
        var strAndHoles = new StringAndHoles();
        if (Utils_1.Utils.isNullOrEmptyString(str)) {
            return strAndHoles;
        }
        var index = str.lastIndexOf(find);
        if (index == -1) {
            strAndHoles.value = str;
            return strAndHoles;
        }
        var holes = [];
        while (index >= 0) {
            var hole = {
                begin: index,
                size: find.length,
                replacementSize: replace.length
            };
            holes.push(hole);
            str = str.slice(0, index) + replace + str.slice(index + find.length);
            index = str.lastIndexOf(find);
        }
        strAndHoles.holes = holes;
        strAndHoles.value = str;
        return strAndHoles;
    };
    /**
     * Shorten the passed path intelligently (path-aware).
     * Works with *local paths* and *network paths*
     * @param uriOrig The path to shorten
     * @param length The length to which the path will be shortened.
     */
    StringAndHoles.shortenPath = function (uriOrig, length) {
        var strAndHoles = new StringAndHoles();
        var uri = uriOrig;
        if (Utils_1.Utils.isNullOrEmptyString(uri) || (uri.length <= length)) {
            strAndHoles.value = uri;
            return strAndHoles;
        }
        var holes = [];
        var first = -1;
        if (Utils_1.Utils.stringStartsWith(uri, '\\\\')) {
            first = uri.indexOf('\\', first + 2);
        }
        else {
            first = uri.indexOf('\\');
        }
        if (first !== -1) {
            var removed = 0;
            var next = uri.indexOf('\\', first + 1);
            while (next !== -1 && uri.length - removed + StringAndHoles.SHORTEN_END.length > length) {
                removed = next - first - 1;
                next = uri.indexOf('\\', next + 1);
            }
            if (removed > 0) {
                uri = uri.slice(0, first + 1) + StringAndHoles.SHORTEN_END + uri.slice(removed);
                var hole = {
                    begin: first + 1,
                    size: removed - StringAndHoles.SHORTEN_END.length,
                    replacementSize: StringAndHoles.SHORTEN_END.length
                };
                holes.push(hole);
            }
        }
        if (uri.length > length) {
            var over = uri.length - length + StringAndHoles.SHORTEN_END.length;
            var start = uri.length - over;
            uri = uri.slice(0, start) + StringAndHoles.SHORTEN_END;
            var hole = {
                begin: start,
                size: over,
                replacementSize: StringAndHoles.SHORTEN_END.length
            };
            holes.push(hole);
        }
        strAndHoles.holes = holes;
        strAndHoles.value = uri;
        return strAndHoles;
    };
    /**
     * Shorten the passed string.
     * @param toShortenOrig The string to shorten
     * @param length The length to which the string will be shortened.
     * @param toAppend The string to append at the end (usually, it is set to '...')
     */
    StringAndHoles.shortenString = function (toShortenOrig, length, toAppend) {
        if (length === void 0) { length = 200; }
        var toShorten = toShortenOrig;
        toAppend = Utils_1.Utils.toNotNullString(toAppend);
        var strAndHoles = new StringAndHoles();
        if (Utils_1.Utils.isNullOrEmptyString(toShorten) || length <= toAppend.length) {
            strAndHoles.value = toShorten;
            return strAndHoles;
        }
        if (toShorten.length <= length) {
            strAndHoles.value = toShorten;
            return strAndHoles;
        }
        var str = toShorten;
        length = length - toAppend.length;
        str = str.slice(0, length);
        if (toShorten.charAt(str.length) !== ' ') {
            var pos = str.lastIndexOf(' ');
            if (pos !== -1 && str.length - pos < StringAndHoles.WORD_SHORTER) {
                str = str.slice(0, pos);
            }
        }
        var holes = [];
        holes[0] = {
            begin: str.length,
            size: toShorten.length - str.length,
            replacementSize: toAppend.length
        };
        str += toAppend;
        strAndHoles.value = str;
        strAndHoles.holes = holes;
        return strAndHoles;
    };
    /**
     * Shorten the passed URI intelligently (path-aware).
     * @param toShortenOrig The URI to shorten
     * @param length The length to which the URI will be shortened.
     */
    StringAndHoles.shortenUri = function (uri, length) {
        var strAndHoles = new StringAndHoles();
        if (Utils_1.Utils.isNullOrEmptyString(uri) || (uri.length <= length)) {
            strAndHoles.value = uri;
            return strAndHoles;
        }
        var holes = [];
        var first = uri.indexOf('//');
        if (first !== -1) {
            first = uri.indexOf('/', first + 2);
        }
        if (first !== -1) {
            var removed = 0;
            var next = uri.indexOf('/', first + 1);
            while (next !== -1 && uri.length - removed + StringAndHoles.SHORTEN_END.length > length) {
                removed = next - first - 1;
                next = uri.indexOf('/', next + 1);
            }
            if (removed > 0) {
                uri = uri.slice(0, first + 1) + StringAndHoles.SHORTEN_END + uri.slice(first + 1 + removed);
                var hole = {
                    begin: first + 1,
                    size: removed,
                    replacementSize: StringAndHoles.SHORTEN_END.length
                };
                holes.push(hole);
            }
        }
        if (uri.length > length) {
            var over = uri.length - length + StringAndHoles.SHORTEN_END.length;
            var start = uri.length - over;
            uri = uri.slice(0, start) + StringAndHoles.SHORTEN_END;
            var hole = {
                begin: start,
                size: over,
                replacementSize: StringAndHoles.SHORTEN_END.length
            };
            holes.push(hole);
        }
        strAndHoles.holes = holes;
        strAndHoles.value = uri;
        return strAndHoles;
    };
    return StringAndHoles;
}());
StringAndHoles.SHORTEN_END = '...';
StringAndHoles.WORD_SHORTER = 10;
exports.StringAndHoles = StringAndHoles;
var HighlightUtils = (function () {
    function HighlightUtils() {
    }
    /**
     * Highlight the passed string using specified highlights and holes.
     * @param content The string to highlight items in.
     * @param highlights The highlighted positions to highlight in the string.
     * @param holes Possible holes which are used to skip highlighting.
     * @param cssClass The css class to use on the highlighting `span`.
     */
    HighlightUtils.highlightString = function (content, highlights, holes, cssClass) {
        Assert_1.Assert.isNotUndefined(highlights);
        Assert_1.Assert.isNotNull(highlights);
        Assert_1.Assert.isNonEmptyString(cssClass);
        if (Utils_1.Utils.isNullOrEmptyString(content)) {
            return content;
        }
        var maxIndex = content.length;
        var highlighted = '';
        var last = 0;
        for (var i = 0; i < highlights.length; i++) {
            var highlight = highlights[i];
            var start = highlight.offset;
            var end = start + highlight.length;
            if (holes !== null) {
                var skip = false;
                for (var j = 0; j < holes.length; j++) {
                    var hole = holes[j];
                    var holeBegin = hole.begin;
                    var holeEnd = holeBegin + hole.size;
                    if (start < holeBegin && end >= holeBegin && end < holeEnd) {
                        end = holeBegin;
                    }
                    else if (start >= holeBegin && end < holeEnd) {
                        skip = true;
                        break;
                    }
                    else if (start >= holeBegin && start < holeEnd && end >= holeEnd) {
                        start = holeBegin + hole.replacementSize;
                        end -= hole.size - hole.replacementSize;
                    }
                    else if (start < holeBegin && end >= holeEnd) {
                        end -= hole.size - hole.replacementSize;
                    }
                    else if (start >= holeEnd) {
                        var offset = hole.size - hole.replacementSize;
                        start -= offset;
                        end -= offset;
                    }
                }
                if (skip || start === end) {
                    continue;
                }
            }
            if (end > maxIndex) {
                break;
            }
            highlighted += _.escape(content.slice(last, start));
            highlighted += "<span class=\"" + cssClass + "\"";
            if (highlight.dataHighlightGroup) {
                highlighted += " data-highlight-group=\"" + highlight.dataHighlightGroup.toString() + "\"";
            }
            if (highlight.dataHighlightGroupTerm) {
                highlighted += " data-highlight-group-term=\"" + highlight.dataHighlightGroupTerm + "\"";
            }
            highlighted += '>';
            highlighted += _.escape(content.slice(start, end));
            highlighted += '</span>';
            last = end;
        }
        if (last != maxIndex) {
            highlighted += _.escape(content.slice(last));
        }
        return highlighted;
    };
    return HighlightUtils;
}());
exports.HighlightUtils = HighlightUtils;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var KeyboardUtils_1 = __webpack_require__(20);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A text input widget with standard styling.
 */
var TextInput = (function () {
    /**
     * Creates a new `TextInput`.
     * @param onChange The function to call when the value entered in the text input changes. This function takes the
     * current `TextInput` instance as an argument.
     * @param name The text to display in the text input label.
     */
    function TextInput(onChange, name) {
        if (onChange === void 0) { onChange = function (textInput) {
        }; }
        this.onChange = onChange;
        this.name = name;
        this.lastQueryText = '';
        this.buildContent();
    }
    TextInput.doExport = function () {
        GlobalExports_1.exportGlobally({
            'TextInput': TextInput
        });
    };
    /**
     * Gets the element on which the text input is bound.
     * @returns {HTMLElement} The text input element.
     */
    TextInput.prototype.getElement = function () {
        return this.element;
    };
    /**
     * Gets the value currently entered in the text input.
     * @returns {string} The text input current value.
     */
    TextInput.prototype.getValue = function () {
        return Dom_1.$$(this.element).find('input').value;
    };
    /**
     * Sets the value in the text input.
     * @param value The value to set the text input to.
     */
    TextInput.prototype.setValue = function (value) {
        var currentValue = this.getValue();
        Dom_1.$$(this.element).find('input').value = value;
        if (currentValue != value) {
            this.onChange(this);
        }
    };
    /**
     * Resets the text input.
     */
    TextInput.prototype.reset = function () {
        var currentValue = this.getValue();
        Dom_1.$$(this.element).find('input').value = '';
        if (currentValue != '') {
            this.onChange(this);
        }
    };
    /**
     * Gets the element on which the text input is bound.
     * @returns {HTMLElement} The text input element.
     */
    TextInput.prototype.build = function () {
        return this.element;
    };
    /**
     * Gets the `input` element (the text input itself).
     * @returns {HTMLElement} The `input` element.
     */
    TextInput.prototype.getInput = function () {
        return Dom_1.$$(this.element).find('input');
    };
    TextInput.prototype.buildContent = function () {
        var _this = this;
        var container = Dom_1.$$('div', { className: 'coveo-input' });
        var input = Dom_1.$$('input', { type: 'text' });
        input.on(['keydown', 'blur'], function (e) {
            if (e.type == 'blur' || e.keyCode == KeyboardUtils_1.KEYBOARD.ENTER) {
                _this.triggerChange();
            }
        });
        input.el.required = true;
        container.append(input.el);
        if (this.name) {
            var label = Dom_1.$$('label');
            label.text(this.name);
            container.append(label.el);
        }
        this.element = container.el;
    };
    TextInput.prototype.triggerChange = function () {
        if (this.lastQueryText != this.getInput().value) {
            this.onChange(this);
            this.lastQueryText = this.getInput().value;
        }
    };
    return TextInput;
}());
exports.TextInput = TextInput;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Template_1 = __webpack_require__(23);
var Assert_1 = __webpack_require__(6);
var UnderscoreTemplate_1 = __webpack_require__(39);
var HtmlTemplate_1 = __webpack_require__(73);
var _ = __webpack_require__(0);
/**
 * Holds a reference to all template available in the framework
 */
var TemplateCache = (function () {
    function TemplateCache() {
    }
    /**
     * Register a new template in the framework, which will be available to render any results.
     * @param name
     * @param template
     * @param publicTemplate
     * @param defaultTemplate
     * @param pageTemplate
     */
    TemplateCache.registerTemplate = function (name, template, publicTemplate, defaultTemplate, resultListTemplate) {
        if (publicTemplate === void 0) { publicTemplate = true; }
        if (defaultTemplate === void 0) { defaultTemplate = false; }
        if (resultListTemplate === void 0) { resultListTemplate = false; }
        Assert_1.Assert.isNonEmptyString(name);
        Assert_1.Assert.exists(template);
        if (!(template instanceof Template_1.Template)) {
            template = new Template_1.Template(template);
        }
        if (template.name == null) {
            template.name = name;
        }
        TemplateCache.templates[name] = template;
        if (publicTemplate && !_.contains(TemplateCache.templateNames, name)) {
            TemplateCache.templateNames.push(name);
        }
        if (resultListTemplate && !_.contains(TemplateCache.resultListTemplateNames, name)) {
            TemplateCache.resultListTemplateNames.push(name);
        }
        if (defaultTemplate) {
            TemplateCache.defaultTemplates[name] = template;
        }
    };
    /**
     * Remove the given template from the cache.
     * @param name
     * @param string
     */
    TemplateCache.unregisterTemplate = function (name) {
        Assert_1.Assert.isNonEmptyString(name);
        if (TemplateCache.templates[name] != undefined) {
            delete TemplateCache.templates[name];
        }
        if (TemplateCache.defaultTemplates[name] != undefined) {
            delete TemplateCache.defaultTemplates[name];
        }
    };
    /**
     * Return a template by its name/FacID.
     * @param name
     * @returns {Template}
     */
    TemplateCache.getTemplate = function (name) {
        // In some scenarios, the template we're trying to load might be somewhere in the page
        // but we could not load it "normally" on page load (eg : UI was loaded with require js)
        // Try a last ditch effort to scan the needed templates.
        if (!TemplateCache.templates[name]) {
            TemplateCache.scanAndRegisterTemplates();
        }
        Assert_1.Assert.exists(TemplateCache.templates[name]);
        return TemplateCache.templates[name];
    };
    /**
     * Get all templates currently registered in the framework.
     * @returns {{}}
     */
    TemplateCache.getTemplates = function () {
        return TemplateCache.templates;
    };
    /**
     * Get all templates name currently registered in the framework.
     * @returns {string[]}
     */
    TemplateCache.getTemplateNames = function () {
        return TemplateCache.templateNames;
    };
    /**
     * Get all page templates name currently registered in the framework.
     * @returns {string[]}
     */
    TemplateCache.getResultListTemplateNames = function () {
        return TemplateCache.resultListTemplateNames;
    };
    /**
     * Get all the "default" templates in the framework.
     * @returns {string[]}
     */
    TemplateCache.getDefaultTemplates = function () {
        return _.keys(TemplateCache.defaultTemplates);
    };
    /**
     * Get a default template by name.
     * @param name The name of the queried template
     */
    TemplateCache.getDefaultTemplate = function (name) {
        Assert_1.Assert.exists(TemplateCache.defaultTemplates[name]);
        return TemplateCache.defaultTemplates[name];
    };
    TemplateCache.scanAndRegisterTemplates = function () {
        // Here we take care not to scan for templates for which the base library
        // is not available. Case in point: someone was using the JS UI on a page
        // that was also using Handlebars, but our code was initialized before
        // the Handlebars library (loaded through AMD).
        if (UnderscoreTemplate_1.UnderscoreTemplate.isLibraryAvailable()) {
            TemplateCache.scanAndRegisterUnderscoreTemplates();
        }
        TemplateCache.scanAndRegisterHtmlTemplates();
    };
    TemplateCache.scanAndRegisterUnderscoreTemplates = function () {
        _.each(UnderscoreTemplate_1.UnderscoreTemplate.mimeTypes, function (type) {
            var scriptList = document.querySelectorAll("script[id][type='" + type + "']");
            var i = scriptList.length;
            var arr = new Array(i);
            while (i--) {
                arr[i] = scriptList.item(i);
            }
            _.each(arr, function (elem) {
                var template = new UnderscoreTemplate_1.UnderscoreTemplate(elem);
                TemplateCache.registerTemplate(elem.getAttribute('id'), template);
            });
        });
    };
    TemplateCache.scanAndRegisterHtmlTemplates = function () {
        _.each(HtmlTemplate_1.HtmlTemplate.mimeTypes, function (type) {
            var scriptList = document.querySelectorAll("script[id][type='" + type + "']");
            var i = scriptList.length;
            var arr = new Array(i);
            while (i--) {
                arr[i] = scriptList.item(i);
            }
            _.each(arr, function (elem) {
                var template = new HtmlTemplate_1.HtmlTemplate(elem);
                TemplateCache.registerTemplate(elem.getAttribute('id'), template);
            });
        });
    };
    return TemplateCache;
}());
TemplateCache.templates = {};
TemplateCache.templateNames = [];
TemplateCache.resultListTemplateNames = [];
TemplateCache.defaultTemplates = {};
exports.TemplateCache = TemplateCache;
document.addEventListener('DOMContentLoaded', function () {
    TemplateCache.scanAndRegisterTemplates();
});


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var VerticalAlignment;
(function (VerticalAlignment) {
    VerticalAlignment[VerticalAlignment["TOP"] = 0] = "TOP";
    VerticalAlignment[VerticalAlignment["MIDDLE"] = 1] = "MIDDLE";
    VerticalAlignment[VerticalAlignment["BOTTOM"] = 2] = "BOTTOM";
    VerticalAlignment[VerticalAlignment["INNERTOP"] = 3] = "INNERTOP";
    VerticalAlignment[VerticalAlignment["INNERBOTTOM"] = 4] = "INNERBOTTOM";
})(VerticalAlignment = exports.VerticalAlignment || (exports.VerticalAlignment = {}));
var HorizontalAlignment;
(function (HorizontalAlignment) {
    HorizontalAlignment[HorizontalAlignment["LEFT"] = 0] = "LEFT";
    HorizontalAlignment[HorizontalAlignment["CENTER"] = 1] = "CENTER";
    HorizontalAlignment[HorizontalAlignment["RIGHT"] = 2] = "RIGHT";
    HorizontalAlignment[HorizontalAlignment["INNERLEFT"] = 3] = "INNERLEFT";
    HorizontalAlignment[HorizontalAlignment["INNERRIGHT"] = 4] = "INNERRIGHT";
})(HorizontalAlignment = exports.HorizontalAlignment || (exports.HorizontalAlignment = {}));
var PopupUtils = (function () {
    function PopupUtils() {
    }
    PopupUtils.positionPopup = function (popUp, nextTo, boundary, desiredPosition, appendTo, checkForBoundary) {
        if (checkForBoundary === void 0) { checkForBoundary = 0; }
        popUp.style.position = 'absolute';
        if (appendTo) {
            Dom_1.$$(appendTo).append(popUp);
        }
        desiredPosition.verticalOffset = desiredPosition.verticalOffset ? desiredPosition.verticalOffset : 0;
        desiredPosition.horizontalOffset = desiredPosition.horizontalOffset ? desiredPosition.horizontalOffset : 0;
        var popUpPosition = Dom_1.$$(nextTo).offset();
        PopupUtils.basicVerticalAlignment(popUpPosition, popUp, nextTo, desiredPosition);
        PopupUtils.basicHorizontalAlignment(popUpPosition, popUp, nextTo, desiredPosition);
        PopupUtils.finalAdjustement(Dom_1.$$(popUp).offset(), popUpPosition, popUp, desiredPosition);
        var popUpBoundary = PopupUtils.getBoundary(popUp);
        var boundaryPosition = PopupUtils.getBoundary(boundary);
        if (checkForBoundary < 2) {
            var checkBoundary = PopupUtils.checkForOutOfBoundary(popUpBoundary, boundaryPosition);
            if (checkBoundary.horizontal != 'ok' && desiredPosition.horizontalClip === true) {
                var width = popUp.offsetWidth;
                if (popUpBoundary.left < boundaryPosition.left) {
                    width -= boundaryPosition.left - popUpBoundary.left;
                }
                if (popUpBoundary.right > boundaryPosition.right) {
                    width -= popUpBoundary.right - boundaryPosition.right;
                }
                popUp.style.width = width + 'px';
                checkBoundary.horizontal = 'ok';
            }
            if (checkBoundary.vertical != 'ok' || checkBoundary.horizontal != 'ok') {
                var newDesiredPosition = PopupUtils.alignInsideBoundary(desiredPosition, checkBoundary);
                PopupUtils.positionPopup(popUp, nextTo, boundary, newDesiredPosition, appendTo, checkForBoundary + 1);
            }
        }
    };
    PopupUtils.finalAdjustement = function (popUpOffSet, popUpPosition, popUp, desiredPosition) {
        var position = Dom_1.$$(popUp).position();
        popUp.style.top = (position.top + desiredPosition.verticalOffset) - (popUpOffSet.top - popUpPosition.top) + 'px';
        popUp.style.left = (position.left + desiredPosition.horizontalOffset) - (popUpOffSet.left - popUpPosition.left) + 'px';
    };
    PopupUtils.basicVerticalAlignment = function (popUpPosition, popUp, nextTo, desiredPosition) {
        switch (desiredPosition.vertical) {
            case VerticalAlignment.TOP:
                popUpPosition.top -= popUp.offsetHeight;
                break;
            case VerticalAlignment.BOTTOM:
                popUpPosition.top += nextTo.offsetHeight;
                break;
            case VerticalAlignment.MIDDLE:
                popUpPosition.top -= popUp.offsetHeight / 3;
            case VerticalAlignment.INNERTOP:
                break; // Nothing to do, it's the default alignment normally
            case VerticalAlignment.INNERBOTTOM:
                popUpPosition.top -= popUp.offsetHeight - nextTo.offsetHeight;
                break;
            default:
                break;
        }
    };
    PopupUtils.basicHorizontalAlignment = function (popUpPosition, popUp, nextTo, desiredPosition) {
        switch (desiredPosition.horizontal) {
            case HorizontalAlignment.LEFT:
                popUpPosition.left -= popUp.offsetWidth;
                break;
            case HorizontalAlignment.RIGHT:
                popUpPosition.left += nextTo.offsetWidth;
                break;
            case HorizontalAlignment.CENTER:
                popUpPosition.left += PopupUtils.offSetToAlignCenter(popUp, nextTo);
                break;
            case HorizontalAlignment.INNERLEFT:
                break; // Nothing to do, it's the default alignment normally
            case HorizontalAlignment.INNERRIGHT:
                popUpPosition.left -= popUp.offsetWidth - nextTo.offsetWidth;
                break;
            default:
                break;
        }
    };
    PopupUtils.alignInsideBoundary = function (oldPosition, checkBoundary) {
        var newDesiredPosition = oldPosition;
        if (checkBoundary.horizontal == 'left') {
            newDesiredPosition.horizontal = HorizontalAlignment.RIGHT;
        }
        if (checkBoundary.horizontal == 'right') {
            newDesiredPosition.horizontal = HorizontalAlignment.LEFT;
        }
        if (checkBoundary.vertical == 'top') {
            newDesiredPosition.vertical = VerticalAlignment.BOTTOM;
        }
        if (checkBoundary.vertical == 'bottom') {
            newDesiredPosition.vertical = VerticalAlignment.TOP;
        }
        return newDesiredPosition;
    };
    PopupUtils.offSetToAlignCenter = function (popUp, nextTo) {
        return (nextTo.offsetWidth - popUp.offsetWidth) / 2;
    };
    PopupUtils.getBoundary = function (element) {
        var boundaryOffset = Dom_1.$$(element).offset();
        var toAddVertically;
        if (element.tagName.toLowerCase() == 'body') {
            toAddVertically = Math.max(element.scrollHeight, element.offsetHeight);
        }
        else if (element.tagName.toLowerCase() == 'html') {
            toAddVertically = Math.max(element.clientHeight, element.scrollHeight, element.offsetHeight);
        }
        else {
            toAddVertically = element.offsetHeight;
        }
        return {
            top: boundaryOffset.top,
            left: boundaryOffset.left,
            right: boundaryOffset.left + element.offsetWidth,
            bottom: boundaryOffset.top + toAddVertically
        };
    };
    PopupUtils.checkForOutOfBoundary = function (popUpBoundary, boundary) {
        var ret = {
            vertical: 'ok',
            horizontal: 'ok'
        };
        if (popUpBoundary.top < boundary.top) {
            ret.vertical = 'top';
        }
        if (popUpBoundary.bottom > boundary.bottom) {
            ret.vertical = 'bottom';
        }
        if (popUpBoundary.left < boundary.left) {
            ret.horizontal = 'left';
        }
        if (popUpBoundary.right > boundary.right) {
            ret.horizontal = 'right';
        }
        return ret;
    };
    return PopupUtils;
}());
exports.PopupUtils = PopupUtils;


/***/ }),
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class is there to contains the different string definition for all the events related to {@link Breadcrumb}.
 */
var BreadcrumbEvents = (function () {
    function BreadcrumbEvents() {
    }
    return BreadcrumbEvents;
}());
/**
 * Triggered when the breadcrumb needs to update its content. External code can use this event to provide bits of HTML that should be included in the breadcrumb.
 *
 * All handlers bound to this event will receive a {@link IPopulateBreadcrumbEventArgs} as an argument.
 */
BreadcrumbEvents.populateBreadcrumb = 'populateBreadcrumb';
/**
 * Triggered when the user clicks the Clear All button in the breadcrumb. When this event is raised, every filter that is included in the breadcrumb should be removed.
 *
 * This event does not provide custom event data.
 */
BreadcrumbEvents.clearBreadcrumb = 'clearBreadcrumb';
BreadcrumbEvents.redrawBreadcrumb = 'redrawBreadcrumb';
exports.BreadcrumbEvents = BreadcrumbEvents;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var Options = (function () {
    function Options() {
    }
    Options.prototype.merge = function (provided) {
        return _.extend({}, this, provided);
    };
    Options.prototype.mergeDeep = function (provided) {
        return _.extend({}, Utils_1.Utils.extendDeep(this, provided));
    };
    return Options;
}());
exports.Options = Options;


/***/ }),
/* 51 */
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
var Model_1 = __webpack_require__(15);
var ComponentStateModel = (function (_super) {
    __extends(ComponentStateModel, _super);
    function ComponentStateModel(element) {
        return _super.call(this, element, ComponentStateModel.ID, {}) || this;
    }
    ComponentStateModel.prototype.registerComponent = function (componentId, component) {
        var currentAttribute = this.attributes[componentId];
        if (currentAttribute == undefined) {
            this.attributes[componentId] = [component];
        }
        else {
            this.attributes[componentId].push(component);
        }
    };
    return ComponentStateModel;
}(Model_1.Model));
ComponentStateModel.ID = 'ComponentState';
exports.ComponentStateModel = ComponentStateModel;


/***/ }),
/* 52 */
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
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
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
/* 54 */,
/* 55 */,
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SearchAlertsEvents = (function () {
    function SearchAlertsEvents() {
    }
    return SearchAlertsEvents;
}());
SearchAlertsEvents.searchAlertsCreated = 'searchAlertsCreated';
SearchAlertsEvents.searchAlertsDeleted = 'searchAlertsDeleted';
SearchAlertsEvents.searchAlertsFail = 'searchAlertsFail';
SearchAlertsEvents.searchAlertsPopulateMessage = 'searchAlertsPopulateMessage';
exports.SearchAlertsEvents = SearchAlertsEvents;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var Assert_1 = __webpack_require__(6);
var QueryController_1 = __webpack_require__(31);
var QueryStateModel_1 = __webpack_require__(12);
var InitializationEvents_1 = __webpack_require__(14);
var Dom_1 = __webpack_require__(2);
var Component_1 = __webpack_require__(7);
var _ = __webpack_require__(0);
var PublicPathUtils_1 = __webpack_require__(141);
/**
 * Initialize the framework with a basic search interface. Calls {@link Initialization.initSearchInterface}.
 *
 * If using the jQuery extension, this is called using <code>$('#root').coveo('init');</code>.
 * @param element The root of the interface to initialize.
 * @param options JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType : true}}</code>).
 * @returns {Promise<{elem: HTMLElement}>}
 */
function init(element, options) {
    if (options === void 0) { options = {}; }
    return Initialization_1.Initialization.initializeFramework(element, options, function () {
        return Initialization_1.Initialization.initSearchInterface(element, options);
    });
}
exports.init = init;
Initialization_1.Initialization.registerNamedMethod('init', function (element, options) {
    if (options === void 0) { options = {}; }
    return init(element, options);
});
/**
 * Initialize the framework with a standalone search box. Calls {@link Initialize.initStandaloneSearchInterface}.
 *
 * If using the jQuery extension, this is called using <code>$('#root').coveo('initSearchbox');</code>.
 * @param element The root of the interface to initialize.
 * @param searchPageUri The search page on which to redirect when there is a query.
 * @param options JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType : true}}</code>).
 * @returns {Promise<{elem: HTMLElement}>}
 */
function initSearchbox(element, searchPageUri, options) {
    if (options === void 0) { options = {}; }
    Assert_1.Assert.isNonEmptyString(searchPageUri);
    var searchInterfaceOptions = {};
    searchInterfaceOptions.searchPageUri = searchPageUri;
    searchInterfaceOptions.autoTriggerQuery = false;
    searchInterfaceOptions.enableHistory = false;
    options = _.extend({}, options, { StandaloneSearchInterface: searchInterfaceOptions });
    return Initialization_1.Initialization.initializeFramework(element, options, function () {
        return Initialization_1.Initialization.initStandaloneSearchInterface(element, options);
    });
}
exports.initSearchbox = initSearchbox;
Initialization_1.Initialization.registerNamedMethod('initSearchbox', function (element, searchPageUri, options) {
    if (options === void 0) { options = {}; }
    initSearchbox(element, searchPageUri, options);
});
/**
 * Initialize the framework with a recommendation interface. Calls {@link Initialization.initRecommendationInterface}.
 *
 * If using the jQuery extension, this is called using <code>$('#root').coveo('initRecommendation');</code>.
 * @param element The root of the interface to initialize.
 * @param mainSearchInterface The search interface to link with the recommendation interface (see {@link Recommendation}).
 * @param userContext The user context to pass with the query generated in the recommendation interface (see {@link Recommendation}).
 * @param options JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType: true}}</code>).
 * @returns {Promise<{elem: HTMLElement}>}
 */
function initRecommendation(element, mainSearchInterface, userContext, options) {
    if (options === void 0) { options = {}; }
    var recommendationOptions = {};
    recommendationOptions.mainSearchInterface = mainSearchInterface;
    recommendationOptions.userContext = JSON.stringify(userContext);
    recommendationOptions.enableHistory = false;
    options = _.extend({}, options, { Recommendation: recommendationOptions });
    return Initialization_1.Initialization.initializeFramework(element, options, function () {
        return Initialization_1.Initialization.initRecommendationInterface(element, options);
    });
}
exports.initRecommendation = initRecommendation;
Initialization_1.Initialization.registerNamedMethod('initRecommendation', function (element, mainSearchInterface, userContext, options) {
    if (userContext === void 0) { userContext = {}; }
    if (options === void 0) { options = {}; }
    initRecommendation(element, mainSearchInterface, userContext, options);
});
/**
 * Execute a standard query. Active component in the interface will react to events/ push data in the query / handle the query success or failure as needed.
 *
 * It triggers a standard query flow for which the standard component will perform their expected behavior.
 *
 * If you wish to only perform a query on the index to retrieve results (without the component reacting), look into {@link SearchInterface} instead.
 *
 * Calling this method is the same as calling {@link QueryController.executeQuery}.
 *
 * @param element The root of the interface to initialize.
 * @returns {Promise<IQueryResults>}
 */
function executeQuery(element) {
    Assert_1.Assert.exists(element);
    var queryController = Component_1.Component.resolveBinding(element, QueryController_1.QueryController);
    Assert_1.Assert.exists(queryController);
    return queryController.executeQuery();
}
exports.executeQuery = executeQuery;
Initialization_1.Initialization.registerNamedMethod('executeQuery', function (element) {
    return executeQuery(element);
});
/**
 * Perform operation on the state ({@link QueryStateModel} of the interface.<br/>
 * Get the complete {@link QueryStateModel} object: <code>Coveo.state(element)</code><br/>.
 * Get an attribute from the {@link QueryStateModel}: <code>Coveo.state(element, 'q')</code> Can be any attribute.<br/>
 * Set an attribute on the {@link QueryStateModel}: <code>Coveo.state(element, 'q', 'foobar')</code>. Can be any attribute.<br/>
 * Set multiple attribute on the {@link QueryStateModel}: <code>Coveo.state(element, {'q' : 'foobar' , sort : 'relevancy'})</code>. Can be any attribute.<br/>
 * If using the jQuery extension, this is called using <code>$('#root').coveo('state');</code>.
 * @param element The root of the interface for which to access the {@link QueryStateModel}.
 * @param args
 * @returns {any}
 */
function state(element) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    Assert_1.Assert.exists(element);
    var model = Component_1.Component.resolveBinding(element, QueryStateModel_1.QueryStateModel);
    return QueryStateModel_1.setState(model, args);
}
exports.state = state;
Initialization_1.Initialization.registerNamedMethod('state', function (element) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (args.length != 0) {
        return state.apply(undefined, [element].concat(args));
    }
    else {
        return state.apply(undefined, [element]);
    }
});
/**
 * Get the component bound on the given `HTMLElement`.
 * @param element The `HTMLElement` for which to get the component instance.
 * @param componentClass If multiple components are bound to a single `HTMLElement`, you need to specify which components you wish to get.
 * @param noThrow By default, the GET method will throw if there is no component bound, or if there are multiple component and no `componentClass` is specified. This deletes the error if set to true.
 * @returns {Component}
 */
function get(element, componentClass, noThrow) {
    Assert_1.Assert.exists(element);
    return Component_1.Component.get(element, componentClass, noThrow);
}
exports.get = get;
Initialization_1.Initialization.registerNamedMethod('get', function (element, componentClass, noThrow) {
    return get(element, componentClass, noThrow);
});
function result(element, noThrow) {
    Assert_1.Assert.exists(element);
    return Component_1.Component.getResult(element, noThrow);
}
exports.result = result;
Initialization_1.Initialization.registerNamedMethod('result', function (element, noThrow) {
    return result(element, noThrow);
});
function getCoveoAnalyticsClient(element) {
    var analytics = getCoveoAnalytics(element);
    if (analytics) {
        return analytics.client;
    }
    else {
        return undefined;
    }
}
function getCoveoAnalytics(element) {
    var analyticsElement = Dom_1.$$(element).find('.' + Component_1.Component.computeCssClassNameForType("Analytics"));
    if (analyticsElement) {
        return Component_1.Component.get(analyticsElement);
    }
    else {
        return undefined;
    }
}
/**
 * Log a custom event on the Coveo Usage Analytics service.
 * @param element The root of the interface for which to log analytics events.
 * @param customEventCause The cause of the event.
 * @param metadata The metadata associated with the event (JSON key value).
 */
function logCustomEvent(element, customEventCause, metadata) {
    var client = getCoveoAnalyticsClient(element);
    if (client) {
        client.logCustomEvent(customEventCause, metadata, element);
    }
}
exports.logCustomEvent = logCustomEvent;
Initialization_1.Initialization.registerNamedMethod('logCustomEvent', function (element, customEventCause, metadata) {
    logCustomEvent(element, customEventCause, metadata);
});
/**
 * Log a `SearchEvent` on the Coveo Usage Analytics service.
 * @param element The root of the interface for which to log analytics events.
 * @param searchEventCause The cause of the event.
 * @param metadata The metadata associated with the event (JSON key value).
 */
function logSearchEvent(element, searchEventCause, metadata) {
    var client = getCoveoAnalyticsClient(element);
    if (client) {
        client.logSearchEvent(searchEventCause, metadata);
    }
}
exports.logSearchEvent = logSearchEvent;
Initialization_1.Initialization.registerNamedMethod('logSearchEvent', function (element, searchEventCause, metadata) {
    logSearchEvent(element, searchEventCause, metadata);
});
/**
 * Log a `SearchAsYouTypeEvent` on the Coveo Usage Analytics service.<br/>
 * It is a bit different from a standard search event, as it will wait 5 seconds before sending the final `SearchAsYouType` event.
 * @param element The root of the interface for which to log analytics events.
 * @param searchAsYouTypeEventCause The cause of the event.
 * @param metadata The metadata associated with the event (JSON key value).
 */
function logSearchAsYouTypeEvent(element, searchAsYouTypeEventCause, metadata) {
    var client = getCoveoAnalyticsClient(element);
    if (client) {
        client.logSearchAsYouType(searchAsYouTypeEventCause, metadata);
    }
}
exports.logSearchAsYouTypeEvent = logSearchAsYouTypeEvent;
Initialization_1.Initialization.registerNamedMethod('logSearchAsYouTypeEvent', function (element, searchAsYouTypeEventCause, metadata) {
    logSearchAsYouTypeEvent(element, searchAsYouTypeEventCause, metadata);
});
/**
 * Log a `ClickEvent` on the Coveo Usage Analytics service.
 * @param element The root of the interface for which to log analytics events.
 * @param clickEventCause The cause of the event.
 * @param metadata The metadata associated with the event (JSON key value).
 * @param result The result that was clicked.
 */
function logClickEvent(element, clickEventCause, metadata, result) {
    var client = getCoveoAnalyticsClient(element);
    if (client) {
        client.logClickEvent(clickEventCause, metadata, result, element);
    }
}
exports.logClickEvent = logClickEvent;
Initialization_1.Initialization.registerNamedMethod('logClickEvent', function (element, clickEventCause, metadata, result) {
    logClickEvent(element, clickEventCause, metadata, result);
});
/**
 * Pass options to the framework, before it is initialized ({@link init}).<br/>
 * All the options passed with this calls will be merged together on initialization.
 * @param element The root of the interface for which you wish to set options.
 * @param optionsToSet JSON options for the framework (e.g.: <code>{Searchbox : {enableSearchAsYouType: true}}</code>).
 */
function options(element, optionsToSet) {
    if (optionsToSet === void 0) { optionsToSet = {}; }
    Initialization_1.Initialization.registerDefaultOptions(element, optionsToSet);
}
exports.options = options;
Initialization_1.Initialization.registerNamedMethod('options', function (element, optionsToSet) {
    if (optionsToSet === void 0) { optionsToSet = {}; }
    options(element, optionsToSet);
});
/**
 * Patch the given `methodName` on an instance of a component bound to an `HTMLElement` with a new handler.
 * @param element
 * @param methodName
 * @param handler
 */
function patch(element, methodName, handler) {
    Initialization_1.Initialization.monkeyPatchComponentMethod(methodName, element, handler);
}
exports.patch = patch;
Initialization_1.Initialization.registerNamedMethod('patch', function (element, methodName, handler) {
    patch(element, methodName, handler);
});
function initBox(element) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var type, options = {}, injectMarkup;
    // This means : initBox, no type (no injection) and no options
    if (args.length == 0) {
        type = 'Standard';
        injectMarkup = false;
    }
    else if (args.length == 1) {
        // This mean a type (with injection) and no options
        if (typeof args[0] == 'string') {
            type = args[0];
            injectMarkup = true;
        }
        else if (typeof args[0] == 'object') {
            type = 'Standard';
            injectMarkup = false;
            options = args[0];
        }
        else {
            Assert_1.Assert.fail('Invalid parameters to init a box');
        }
    }
    else if (args.length == 2) {
        type = args[0];
        options = args[1];
        injectMarkup = true;
    }
    var merged = {};
    merged[type || 'Container'] = _.extend({}, options.SearchInterface, options[type]);
    options = _.extend({}, options, merged);
    Initialization_1.Initialization.initializeFramework(element, options, function () {
        return Initialization_1.Initialization.initBoxInterface(element, options, type, injectMarkup);
    });
}
exports.initBox = initBox;
Initialization_1.Initialization.registerNamedMethod('initBox', function (element) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    initBox(element, args);
});
function nuke(element) {
    Dom_1.$$(element).trigger(InitializationEvents_1.InitializationEvents.nuke);
}
exports.nuke = nuke;
Initialization_1.Initialization.registerNamedMethod('nuke', function (element) {
    nuke(element);
});
/**
 * Sets the path from where the chunks used for lazy loading will be loaded. In some cases, in IE11, we cannot automatically detect it, use this instead.
 * @param path This should be the path of the Coveo script. It should also have a trailing slash.
 */
function configureRessourceRoot(path) {
    PublicPathUtils_1.PublicPathUtils.configureRessourceRoot(path);
}
exports.configureRessourceRoot = configureRessourceRoot;
Initialization_1.Initialization.registerNamedMethod('configureRessourceRoot', function (path) {
    configureRessourceRoot(path);
});
/**
 * Asynchronously loads a module, or chunk.
 *
 * This is especially useful when you want to extend a base component, and make sure the lazy component loading process
 * recognizes it (see [Lazy Versus Eager Component Loading](https://developers.coveo.com/x/YBgvAg)).
 *
 * **Example:**
 *
 * ```typescript
 * export function lazyCustomFacet() {
 *   return Coveo.load<Facet>('Facet').then((Facet) => {
 *     class CustomFacet extends Facet {
 *       [ ... ]
 *     };
 *     Coveo.Initialization.registerAutoCreateComponent(CustomFacet);
 *     return CustomFacet;
 *   });
 * };
 *
 * Coveo.LazyInitialization.registerLazyComponent('CustomFacet', lazyCustomFacet);
 * ```
 *
 * You can also use this function to assert a component is fully loaded in your page before executing any code relating
 * to it.
 *
 * **Example:**
 *
 * > You could do `Coveo.load('Searchbox').then((Searchbox) => {})` to load the [`Searchbox`]{@link Searchbox}
 * > component, if it is not already loaded in your search page.
 *
 * @param id The identifier of the module you wish to load. In the case of components, this identifier is the component
 * name (e.g., `Facet`, `Searchbox`).
 * @returns {Promise} A Promise of the module, or chunk.
 */
function load(id) {
    if (Initialization_1.LazyInitialization.lazyLoadedComponents[id] != null) {
        return Initialization_1.LazyInitialization.getLazyRegisteredComponent(id);
    }
    else if (Initialization_1.LazyInitialization.lazyLoadedModule[id] != null) {
        return Initialization_1.LazyInitialization.getLazyRegisteredModule(id);
    }
    else {
        return Promise.reject("Module " + id + " is not available");
    }
}
exports.load = load;
Initialization_1.Initialization.registerNamedMethod('require', function (modules) {
    return load(modules);
});


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class is there to contains the different string definition for all the events related to the {@link AdvancedSearch} component.
 */
var AdvancedSearchEvents = (function () {
    function AdvancedSearchEvents() {
    }
    return AdvancedSearchEvents;
}());
/**
 * Triggered when the {@link AdvancedSearch} component is being built.
 *
 * Allows external code to add new sections in the **Advanced Search** panel.
 *
 * All bound handlers receive {@link IBuildingAdvancedSearchEventArgs} as an argument
 *
 * @type {string}
 */
AdvancedSearchEvents.buildingAdvancedSearch = 'buildingAdvancedSearch';
AdvancedSearchEvents.executeAdvancedSearch = 'executeAdvancedSearch';
exports.AdvancedSearchEvents = AdvancedSearchEvents;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
__webpack_require__(221);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A checkbox widget with standard styling.
 */
var Checkbox = (function () {
    /**
     * Creates a new `Checkbox`.
     * @param onChange The function to call when the checkbox state changes. This function takes the current `Checkbox`
     * instance as an argument.
     * @param label The label to display next to the checkbox.
     */
    function Checkbox(onChange, label) {
        if (onChange === void 0) { onChange = function (checkbox) {
        }; }
        this.onChange = onChange;
        this.label = label;
        this.buildContent();
    }
    /**
     * Toggles the checkbox state.
     */
    Checkbox.prototype.toggle = function () {
        this.checkbox.checked = !this.isSelected();
        Dom_1.$$(this.checkbox).trigger('change');
    };
    /**
     * Gets the element on which the checkbox is bound.
     * @returns {HTMLElement} The checkbox element.
     */
    Checkbox.prototype.getElement = function () {
        return this.element;
    };
    /**
     * Gets the element on which the checkbox is bound.
     * @returns {HTMLElement} The checkbox element.
     */
    Checkbox.prototype.build = function () {
        return this.element;
    };
    /**
     * Gets the checkbox [`label`]{@link Checkbox.label} value.
     * @returns {string} The checkbox label value.
     */
    Checkbox.prototype.getValue = function () {
        return this.label;
    };
    /**
     * Resets the checkbox.
     */
    Checkbox.prototype.reset = function () {
        var currentlyChecked = this.isSelected();
        this.checkbox.checked = false;
        if (currentlyChecked) {
            Dom_1.$$(this.checkbox).trigger('change');
        }
    };
    /**
     * Select the checkbox
     * @param triggerChange will trigger change even if specified and not already selected
     */
    Checkbox.prototype.select = function (triggerChange) {
        if (triggerChange === void 0) { triggerChange = true; }
        var currentlyChecked = this.isSelected();
        this.checkbox.checked = true;
        if (!currentlyChecked && triggerChange) {
            Dom_1.$$(this.checkbox).trigger('change');
        }
    };
    /**
     * Indicates whether the checkbox is checked.
     * @returns {boolean} `true` if the checkbox is checked, `false` otherwise.
     */
    Checkbox.prototype.isSelected = function () {
        return this.checkbox.checked;
    };
    /**
     * Gets the element on which the checkbox [`label`]{@link Checkbox.label} is bound.
     * @returns {HTMLElement} The `label` element.
     */
    Checkbox.prototype.getLabel = function () {
        return this.element;
    };
    Checkbox.prototype.buildContent = function () {
        var _this = this;
        var label = Dom_1.$$('label', {
            className: 'coveo-checkbox-label'
        });
        this.checkbox = Dom_1.$$('input', {
            type: 'checkbox',
            className: 'coveo-checkbox',
            value: this.label
        }).el;
        var button = Dom_1.$$('button', { type: 'button', className: 'coveo-checkbox-button' });
        var labelSpan = Dom_1.$$('span', { className: 'coveo-checkbox-span-label' }, this.label);
        label.append(this.checkbox);
        label.append(button.el);
        label.append(labelSpan.el);
        button.on('click', function () { return _this.toggle(); });
        Dom_1.$$(this.checkbox).on('change', function () {
            _this.onChange(_this);
        });
        this.element = label.el;
    };
    return Checkbox;
}());
Checkbox.doExport = function () {
    GlobalExports_1.exportGlobally({
        'Checkbox': Checkbox
    });
};
exports.Checkbox = Checkbox;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class is there to contains the different string definition for all the events related to analytics.
 */
var AnalyticsEvents = (function () {
    function AnalyticsEvents() {
    }
    return AnalyticsEvents;
}());
AnalyticsEvents.searchEvent = 'analyticsSearchEvent';
AnalyticsEvents.documentViewEvent = 'analyticsDocumentViewEvent';
AnalyticsEvents.customEvent = 'analyticsCustomEvent';
/**
 * Triggered whenever an analytics event is logged. This event allows external code to modify the analytics data.
 *
 * All bound handlers will receive {@link IChangeAnalyticsCustomDataEventArgs} as an argument.
 *
 * The string value is `changeAnalyticsCustomData`.
 */
AnalyticsEvents.changeAnalyticsCustomData = 'changeAnalyticsCustomData';
exports.AnalyticsEvents = AnalyticsEvents;


/***/ }),
/* 61 */,
/* 62 */
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
var Options_1 = __webpack_require__(50);
var HighlightUtils_1 = __webpack_require__(42);
var StringUtils_1 = __webpack_require__(18);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
// \u2011: http://graphemica.com/%E2%80%91
// Used to split terms and phrases. Should match characters that can separate words.
var wordBoundary = '[\\.\\-\\u2011\\s~=,.\\|\\/:\'`’;_()!?&+]';
var regexStart = '(' + wordBoundary + '|^)(';
var DefaultStreamHighlightOptions = (function (_super) {
    __extends(DefaultStreamHighlightOptions, _super);
    function DefaultStreamHighlightOptions(cssClass, shorten, regexFlags) {
        if (cssClass === void 0) { cssClass = 'coveo-highlight'; }
        if (shorten === void 0) { shorten = 0; }
        if (regexFlags === void 0) { regexFlags = 'gi'; }
        var _this = _super.call(this) || this;
        _this.cssClass = cssClass;
        _this.shorten = shorten;
        _this.regexFlags = regexFlags;
        return _this;
    }
    return DefaultStreamHighlightOptions;
}(Options_1.Options));
var StreamHighlightUtils = (function () {
    function StreamHighlightUtils() {
    }
    StreamHighlightUtils.highlightStreamHTML = function (stream, termsToHighlight, phrasesToHighlight, options) {
        var opts = new DefaultStreamHighlightOptions().merge(options);
        var container = createStreamHTMLContainer(stream);
        var allElements = Dom_1.$$(container).findAll('*');
        if (allElements.length > 0) {
            _.each(allElements, function (elem, i) {
                var text = Dom_1.$$(elem).text();
                elem.innerHTML = HighlightUtils_1.HighlightUtils.highlightString(text, getRestHighlightsForAllTerms(text, termsToHighlight, phrasesToHighlight, opts), [], opts.cssClass);
            });
        }
        else {
            return StreamHighlightUtils.highlightStreamText(stream, termsToHighlight, phrasesToHighlight, options);
        }
        return container.innerHTML;
    };
    StreamHighlightUtils.highlightStreamText = function (stream, termsToHighlight, phrasesToHighlight, options) {
        var opts = new DefaultStreamHighlightOptions().merge(options);
        return HighlightUtils_1.HighlightUtils.highlightString(stream, getRestHighlightsForAllTerms(stream, termsToHighlight, phrasesToHighlight, opts), [], opts.cssClass);
    };
    return StreamHighlightUtils;
}());
exports.StreamHighlightUtils = StreamHighlightUtils;
function getRestHighlightsForAllTerms(toHighlight, termsToHighlight, phrasesToHighlight, opts) {
    var indexes = [];
    var sortedTerms = _.keys(termsToHighlight).sort(termsSorting);
    _.each(sortedTerms, function (term) {
        var termsToIterate = _.compact([term].concat(termsToHighlight[term]).sort(termsSorting));
        termsToIterate = _.map(termsToIterate, function (term) { return Utils_1.Utils.escapeRegexCharacter(term); });
        var regex = regexStart;
        regex += termsToIterate.join('|') + ')(?=(?:' + wordBoundary + '|$)+)';
        var indexesFound = StringUtils_1.StringUtils.getHighlights(toHighlight, new RegExp(regex, opts.regexFlags), term);
        if (indexesFound != undefined && Utils_1.Utils.isNonEmptyArray(indexesFound)) {
            indexes.push(indexesFound);
        }
    });
    _.each(phrasesToHighlight, function (phrase, origPhrase) {
        var split = origPhrase.split(' ');
        var regex = regexStart;
        _.each(split, function (origWord, i) {
            regex += '(?:' + [origWord].concat(phrase[origWord]).join('|') + ')';
            if (i == split.length - 1) {
                regex += '(?=';
            }
            regex += wordBoundary;
            if (i == split.length - 1) {
                regex += '|$)';
            }
            if (i != split.length - 1) {
                regex += '+';
            }
        });
        regex += ')';
        var indexesFound = StringUtils_1.StringUtils.getHighlights(toHighlight, new RegExp(regex, opts.regexFlags), origPhrase);
        if (indexesFound != undefined && Utils_1.Utils.isNonEmptyArray(indexesFound)) {
            indexes.push(indexesFound);
        }
    });
    return _.chain(indexes)
        .flatten()
        .compact()
        .uniq(function (highlight) {
        return highlight.offset;
    })
        .sortBy(function (highlight) {
        return highlight.offset;
    })
        .map(function (highlight) {
        var keysFromTerms = _.keys(termsToHighlight);
        var keysFromPhrases = _.keys(phrasesToHighlight);
        var keys = keysFromTerms.concat(keysFromPhrases);
        var group = _.indexOf(keys, highlight.dataHighlightGroupTerm) + 1;
        return _.extend(highlight, { dataHighlightGroup: group });
    })
        .value();
}
function termsSorting(first, second) {
    return first.length - second.length;
}
function createStreamHTMLContainer(stream) {
    var container = Dom_1.$$('div').el;
    container.innerHTML = stream;
    return container;
}


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StandaloneSearchInterfaceEvents = (function () {
    function StandaloneSearchInterfaceEvents() {
    }
    return StandaloneSearchInterfaceEvents;
}());
StandaloneSearchInterfaceEvents.beforeRedirect = 'beforeRedirect';
exports.StandaloneSearchInterfaceEvents = StandaloneSearchInterfaceEvents;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PreferencesPanelEvents = (function () {
    function PreferencesPanelEvents() {
    }
    return PreferencesPanelEvents;
}());
PreferencesPanelEvents.savePreferences = 'savePreferences';
PreferencesPanelEvents.exitPreferencesWithoutSave = 'exitPreferencesWithoutSave';
exports.PreferencesPanelEvents = PreferencesPanelEvents;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
var QueryUtils_1 = __webpack_require__(16);
var _ = __webpack_require__(0);
/**
 * An `ExpressionBuilder` that is mostly used by the {@link QueryBuilder}.<br/>
 * It is used to build a single query expression.<br/>
 * It allows combining multiple expression parts into a single string and provides utilities to generate common expression parts.
 */
var ExpressionBuilder = (function () {
    function ExpressionBuilder() {
        this.parts = []; // he he he
        this.wrapParts = true;
    }
    /**
     * Add a new part to the expression.
     * @param expression
     */
    ExpressionBuilder.prototype.add = function (expression) {
        Assert_1.Assert.isNonEmptyString(expression);
        this.parts.push(expression);
    };
    /**
     * Take another `ExpressionBuilder`, and copy it.
     * @param expression
     */
    ExpressionBuilder.prototype.fromExpressionBuilder = function (expression) {
        this.parts = this.parts.concat(expression.parts);
    };
    /**
     * Add a new part to the expression, but specific for field values<br/>
     * eg @field=(value1,value2,value3).
     * @param field The field for which to create an expression (e.g.: @foo).
     * @param operator The operator to use e.g.: = (equal) == (strict equal) <> (not equal).
     * @param values The values to put in the expression.
     */
    ExpressionBuilder.prototype.addFieldExpression = function (field, operator, values) {
        Assert_1.Assert.isNonEmptyString(field);
        Assert_1.Assert.stringStartsWith(field, '@');
        Assert_1.Assert.isNonEmptyString(operator);
        Assert_1.Assert.isLargerOrEqualsThan(1, values.length);
        this.add(QueryUtils_1.QueryUtils.buildFieldExpression(field, operator, values));
    };
    /**
     * Add a new part to the expression, but specific for field values<br/>
     * eg : NOT @field==(value1, value2, value3).
     * @param field The field for which to create an expression (e.g.: @foo)
     * @param values The values to put in the expression.
     */
    ExpressionBuilder.prototype.addFieldNotEqualExpression = function (field, values) {
        Assert_1.Assert.isNonEmptyString(field);
        Assert_1.Assert.stringStartsWith(field, '@');
        Assert_1.Assert.isLargerOrEqualsThan(1, values.length);
        this.add(QueryUtils_1.QueryUtils.buildFieldNotEqualExpression(field, values));
    };
    /**
     * Removes an expression from the builder.
     * @param expression
     */
    ExpressionBuilder.prototype.remove = function (expression) {
        Assert_1.Assert.isNonEmptyString(expression);
        var index = _.indexOf(this.parts, expression);
        if (index != -1) {
            this.parts.splice(_.indexOf(this.parts, expression), 1);
        }
    };
    /**
     * Checks if the builder is currently empty.
     * @returns {boolean}
     */
    ExpressionBuilder.prototype.isEmpty = function () {
        return this.parts.length == 0;
    };
    /**
     * Builds the expression string by combining all the parts together.<br/>
     * @param exp expression to join the different parts, default to a space.
     * @returns {any}
     */
    ExpressionBuilder.prototype.build = function (exp) {
        if (exp === void 0) { exp = ' '; }
        if (this.parts.length == 0) {
            return undefined;
        }
        else if (this.parts.length == 1) {
            return this.parts[0];
        }
        else if (this.wrapParts) {
            return '(' + this.parts.join(')' + exp + '(') + ')';
        }
        else {
            return this.parts.join(exp);
        }
    };
    /**
     * Merges several `ExpressionBuilder` together.
     * @param builders Builders that should be merged.
     * @returns {Coveo.ExpressionBuilder}
     */
    ExpressionBuilder.merge = function () {
        var builders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            builders[_i] = arguments[_i];
        }
        var merged = new ExpressionBuilder();
        _.each(builders, function (builder) {
            merged.parts = merged.parts.concat(builder.parts);
        });
        return merged;
    };
    /**
     * Merges several `ExpressionBuilder` together, using the OR operator.
     * @param builders Builders that should be merged.
     * @returns {Coveo.ExpressionBuilder}
     */
    ExpressionBuilder.mergeUsingOr = function () {
        var builders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            builders[_i] = arguments[_i];
        }
        var nonEmpty = _.filter(builders, function (b) { return !b.isEmpty(); });
        var merged = new ExpressionBuilder();
        if (nonEmpty.length == 1) {
            merged.parts = [].concat(nonEmpty[0].parts);
        }
        else if (nonEmpty.length > 1) {
            var parts = _.map(nonEmpty, function (b) { return b.build(); });
            merged.add('(' + parts.join(') OR (') + ')');
        }
        return merged;
    };
    return ExpressionBuilder;
}());
exports.ExpressionBuilder = ExpressionBuilder;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
var UnderscoreTemplate_1 = __webpack_require__(39);
var Utils_1 = __webpack_require__(4);
/**
 * Allow to register and return template helpers (essentially: Utility functions that can be executed in the context of a template to render complex elements).
 */
var TemplateHelpers = (function () {
    function TemplateHelpers() {
    }
    TemplateHelpers.registerFieldHelper = function (name, helper) {
        TemplateHelpers.fieldHelpers.push(name);
        TemplateHelpers.registerTemplateHelper(name, helper);
    };
    /**
     * Register a new helper in the framework, that will be available inside all templates execution context.
     * @param name
     * @param helper
     */
    TemplateHelpers.registerTemplateHelper = function (name, helper) {
        Assert_1.Assert.isNonEmptyString(name);
        Assert_1.Assert.exists(helper);
        TemplateHelpers.registerTemplateHelperInUnderscore(name, helper);
        TemplateHelpers.helpers[name] = helper;
    };
    /**
     * Return a template helper function
     * @param name
     * @returns {any}
     */
    TemplateHelpers.getHelper = function (name) {
        return Utils_1.Utils.getCaseInsensitiveProperty(TemplateHelpers.helpers, name);
    };
    /**
     * Get all available helpers
     * @returns {{}}
     */
    TemplateHelpers.getHelpers = function () {
        return TemplateHelpers.helpers;
    };
    TemplateHelpers.registerTemplateHelperInUnderscore = function (name, helper) {
        Assert_1.Assert.isNonEmptyString(name);
        Assert_1.Assert.exists(helper);
        UnderscoreTemplate_1.UnderscoreTemplate.registerTemplateHelper(name, helper);
    };
    return TemplateHelpers;
}());
TemplateHelpers.helpers = {};
TemplateHelpers.fieldHelpers = [];
exports.TemplateHelpers = TemplateHelpers;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function hasLocalStorage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch (e) {
        return false;
    }
}
exports.hasLocalStorage = hasLocalStorage;
;
function hasSessionStorage() {
    try {
        return 'sessionStorage' in window && window['sessionStorage'] !== null;
    }
    catch (e) {
        return false;
    }
}
exports.hasSessionStorage = hasSessionStorage;
;
function hasCookieStorage() {
    return navigator.cookieEnabled;
}
exports.hasCookieStorage = hasCookieStorage;
;
function hasDocument() {
    return document !== null;
}
exports.hasDocument = hasDocument;
;
function hasDocumentLocation() {
    return hasDocument() && document.location !== null;
}
exports.hasDocumentLocation = hasDocumentLocation;
;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DebugEvents = (function () {
    function DebugEvents() {
    }
    return DebugEvents;
}());
DebugEvents.showDebugPanel = 'showDebugPanel';
exports.DebugEvents = DebugEvents;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.version = {
    'lib': '2.0.2-beta',
    'product': '2.0.2-beta',
    'supportedApiVersion': 2
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(13);
var Assert_1 = __webpack_require__(6);
var TimeSpanUtils_1 = __webpack_require__(53);
var DeviceUtils_1 = __webpack_require__(17);
var Utils_1 = __webpack_require__(4);
var JQueryutils_1 = __webpack_require__(52);
var _ = __webpack_require__(0);
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NoopAnalyticsClient = (function () {
    function NoopAnalyticsClient() {
        this.isContextual = false;
    }
    NoopAnalyticsClient.prototype.isActivated = function () {
        return false;
    };
    NoopAnalyticsClient.prototype.getCurrentEventCause = function () {
        return this.currentEventCause;
    };
    NoopAnalyticsClient.prototype.getCurrentEventMeta = function () {
        return this.currentEventMeta;
    };
    NoopAnalyticsClient.prototype.logSearchEvent = function (actionCause, meta) {
        this.setNoopCauseAndMeta(actionCause.name, meta);
    };
    NoopAnalyticsClient.prototype.logSearchAsYouType = function (actionCause, meta) {
        this.setNoopCauseAndMeta(actionCause.name, meta);
    };
    NoopAnalyticsClient.prototype.logClickEvent = function (actionCause, meta, result, element) {
        this.setNoopCauseAndMeta(actionCause.name, meta);
    };
    NoopAnalyticsClient.prototype.logCustomEvent = function (actionCause, meta, element) {
        this.setNoopCauseAndMeta(actionCause.name, meta);
    };
    NoopAnalyticsClient.prototype.getTopQueries = function (params) {
        return new Promise(function (resolve, reject) {
            resolve([]);
        });
    };
    NoopAnalyticsClient.prototype.getCurrentVisitIdPromise = function () {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    };
    NoopAnalyticsClient.prototype.getCurrentVisitId = function () {
        return null;
    };
    NoopAnalyticsClient.prototype.sendAllPendingEvents = function () {
    };
    NoopAnalyticsClient.prototype.cancelAllPendingEvents = function () {
    };
    NoopAnalyticsClient.prototype.warnAboutSearchEvent = function () {
    };
    NoopAnalyticsClient.prototype.getPendingSearchEvent = function () {
        return null;
    };
    NoopAnalyticsClient.prototype.setOriginContext = function (originContext) {
    };
    NoopAnalyticsClient.prototype.setNoopCauseAndMeta = function (cause, meta) {
        this.currentEventCause = cause;
        this.currentEventMeta = meta;
    };
    return NoopAnalyticsClient;
}());
exports.NoopAnalyticsClient = NoopAnalyticsClient;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var QueryEvents_1 = __webpack_require__(10);
var Assert_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(2);
var SearchInterface_1 = __webpack_require__(19);
var Component_1 = __webpack_require__(7);
var QueryController_1 = __webpack_require__(31);
var Defer_1 = __webpack_require__(25);
var APIAnalyticsBuilder_1 = __webpack_require__(109);
var AnalyticsEvents_1 = __webpack_require__(60);
var AnalyticsActionListMeta_1 = __webpack_require__(11);
var QueryStateModel_1 = __webpack_require__(12);
var _ = __webpack_require__(0);
var PendingSearchEvent = (function () {
    function PendingSearchEvent(root, endpoint, templateSearchEvent, sendToCloud) {
        var _this = this;
        this.root = root;
        this.endpoint = endpoint;
        this.templateSearchEvent = templateSearchEvent;
        this.sendToCloud = sendToCloud;
        this.searchPromises = [];
        this.results = [];
        this.cancelled = false;
        this.finished = false;
        this.searchEvents = [];
        Assert_1.Assert.exists(root);
        Assert_1.Assert.exists(endpoint);
        Assert_1.Assert.exists(templateSearchEvent);
        this.handler = function (evt, arg) {
            _this.handleDuringQuery(evt, arg);
        };
        Dom_1.$$(root).on(QueryEvents_1.QueryEvents.duringQuery, this.handler);
    }
    PendingSearchEvent.prototype.getEventCause = function () {
        return this.templateSearchEvent.actionCause;
    };
    PendingSearchEvent.prototype.getEventMeta = function () {
        return this.templateSearchEvent.customData;
    };
    PendingSearchEvent.prototype.cancel = function () {
        this.stopRecording();
        this.cancelled = true;
    };
    PendingSearchEvent.prototype.handleDuringQuery = function (evt, args) {
        var _this = this;
        Assert_1.Assert.check(!this.finished);
        Assert_1.Assert.check(!this.cancelled);
        // When synchronizing multiple search interfaces under a single search event
        // (think Salesforce boxes), we need to collect all search events and send them
        // in one single batch. So we gather all events until we idle out and then we
        // monitor those before sending the data.
        this.searchPromises.push(args.promise);
        // TODO: Maybe a better way to grab the search interface?
        var eventTarget;
        eventTarget = evt.target;
        var searchInterface = Component_1.Component.get(eventTarget, SearchInterface_1.SearchInterface);
        Assert_1.Assert.exists(searchInterface);
        // TODO: Maybe a better way to grab the query controller?
        var queryController = Component_1.Component.get(eventTarget, QueryController_1.QueryController);
        Assert_1.Assert.exists(queryController);
        args.promise.then(function (queryResults) {
            Assert_1.Assert.exists(queryResults);
            Assert_1.Assert.check(!_this.finished);
            if (queryResults._reusedSearchUid !== true || _this.templateSearchEvent.actionCause == AnalyticsActionListMeta_1.analyticsActionCauseList.recommendation.name) {
                var searchEvent = _.extend({}, _this.templateSearchEvent);
                _this.fillSearchEvent(searchEvent, searchInterface, args.query, queryResults);
                _this.searchEvents.push(searchEvent);
                _this.results.push(queryResults);
                return queryResults;
            }
        }).finally(function () {
            var index = _.indexOf(_this.searchPromises, args.promise);
            _this.searchPromises.splice(index, 1);
            if (_this.searchPromises.length == 0) {
                _this.flush();
            }
        });
    };
    PendingSearchEvent.prototype.stopRecording = function () {
        if (this.handler) {
            Dom_1.$$(this.root).off(QueryEvents_1.QueryEvents.duringQuery, this.handler);
            Dom_1.$$(this.root).off(QueryEvents_1.QueryEvents.duringFetchMoreQuery, this.handler);
            this.handler = null;
        }
    };
    PendingSearchEvent.prototype.flush = function () {
        var _this = this;
        if (!this.cancelled) {
            this.stopRecording();
            this.finished = true;
            Assert_1.Assert.check(this.searchEvents.length == this.results.length);
            Defer_1.Defer.defer(function () {
                if (_this.sendToCloud) {
                    _this.endpoint.sendSearchEvents(_this.searchEvents);
                }
                var apiSearchEvents = _.map(_this.searchEvents, function (searchEvent) {
                    return APIAnalyticsBuilder_1.APIAnalyticsBuilder.convertSearchEventToAPI(searchEvent);
                });
                Dom_1.$$(_this.root).trigger(AnalyticsEvents_1.AnalyticsEvents.searchEvent, { searchEvents: apiSearchEvents });
            });
        }
    };
    PendingSearchEvent.prototype.fillSearchEvent = function (searchEvent, searchInterface, query, queryResults) {
        Assert_1.Assert.exists(searchEvent);
        Assert_1.Assert.exists(searchInterface);
        Assert_1.Assert.exists(query);
        Assert_1.Assert.exists(queryResults);
        var currentQuery = searchInterface.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.q);
        searchEvent.queryPipeline = queryResults.pipeline;
        searchEvent.splitTestRunName = searchEvent.splitTestRunName || queryResults.splitTestRun;
        searchEvent.splitTestRunVersion = searchEvent.splitTestRunVersion || (queryResults.splitTestRun != undefined ? queryResults.pipeline : undefined);
        searchEvent.originLevel2 = searchEvent.originLevel2 || searchInterface.queryStateModel.get('t') || 'default';
        searchEvent.queryText = currentQuery || query.q || ''; // do not log the query sent to the server if possible; it may contain added syntax depending on options
        searchEvent.advancedQuery = query.aq || '';
        searchEvent.didYouMean = query.enableDidYouMean;
        searchEvent.numberOfResults = queryResults.totalCount;
        searchEvent.responseTime = queryResults.duration;
        searchEvent.pageNumber = (query.firstResult / query.numberOfResults);
        searchEvent.resultsPerPage = query.numberOfResults;
        searchEvent.searchQueryUid = queryResults.searchUid;
        searchEvent.queryPipeline = queryResults.pipeline;
        // The context_${key} format is important for the Analytics backend
        // This is what they use to recognize a custom data that will be used internally by other coveo's service.
        // In this case, Coveo Machine Learning will be the consumer of this information.
        if (query.context != undefined) {
            _.each(query.context, function (value, key) {
                searchEvent.customData["context_" + key] = value;
            });
        }
        // The refinedKeywords field is important for Coveo Machine Learning in order to learn properly on query
        // made based on the long query.
        if (queryResults.refinedKeywords != undefined && queryResults.refinedKeywords.length != 0) {
            searchEvent.customData['refinedKeywords'] = queryResults.refinedKeywords;
        }
    };
    return PendingSearchEvent;
}());
exports.PendingSearchEvent = PendingSearchEvent;


/***/ }),
/* 73 */
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
var Template_1 = __webpack_require__(23);
var Assert_1 = __webpack_require__(6);
var TemplateFromAScriptTag_1 = __webpack_require__(115);
var HtmlTemplate = (function (_super) {
    __extends(HtmlTemplate, _super);
    function HtmlTemplate(element) {
        var _this = _super.call(this, function () { return element.innerHTML; }) || this;
        _this.element = element;
        _this.templateFromAScriptTag = new TemplateFromAScriptTag_1.TemplateFromAScriptTag(_this, _this.element);
        return _this;
    }
    HtmlTemplate.prototype.toHtmlElement = function () {
        var script = this.templateFromAScriptTag.toHtmlElement();
        // We don't set the type attribute for 2 reasons:
        // 1) LockerService doesn't like when we set it.
        // 2) The HTML Template is the default one.
        return script;
    };
    HtmlTemplate.prototype.getType = function () {
        return 'HtmlTemplate';
    };
    HtmlTemplate.create = function (element) {
        Assert_1.Assert.exists(element);
        return new HtmlTemplate(element);
    };
    HtmlTemplate.fromString = function (template, properties) {
        var script = TemplateFromAScriptTag_1.TemplateFromAScriptTag.fromString(template, properties);
        // We don't set the type attribute for 2 reasons:
        // 1) LockerService doesn't like when we set it.
        // 2) The HTML Template is the default one.
        return new HtmlTemplate(script);
    };
    return HtmlTemplate;
}(Template_1.Template));
HtmlTemplate.mimeTypes = [
    'text/html',
    'text/HTML'
];
exports.HtmlTemplate = HtmlTemplate;


/***/ }),
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */
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
var PendingSearchEvent_1 = __webpack_require__(72);
var Dom_1 = __webpack_require__(2);
var InitializationEvents_1 = __webpack_require__(14);
var _ = __webpack_require__(0);
var PendingSearchAsYouTypeSearchEvent = (function (_super) {
    __extends(PendingSearchAsYouTypeSearchEvent, _super);
    function PendingSearchAsYouTypeSearchEvent(root, endpoint, templateSearchEvent, sendToCloud) {
        var _this = _super.call(this, root, endpoint, templateSearchEvent, sendToCloud) || this;
        _this.root = root;
        _this.endpoint = endpoint;
        _this.templateSearchEvent = templateSearchEvent;
        _this.sendToCloud = sendToCloud;
        _this.delayBeforeSending = 5000;
        _this.armBatchDelay = 50;
        _this.beforeUnloadHandler = function () {
            _this.onWindowUnload();
        };
        window.addEventListener('beforeunload', _this.beforeUnloadHandler);
        Dom_1.$$(root).on(InitializationEvents_1.InitializationEvents.nuke, function () { return _this.handleNuke(); });
        return _this;
    }
    PendingSearchAsYouTypeSearchEvent.prototype.handleDuringQuery = function (e, args) {
        var _this = this;
        var event = _.clone(e);
        this.beforeResolve = new Promise(function (resolve) {
            _this.toSendRightNow = function () {
                if (!_this.isCancelledOrFinished()) {
                    resolve(_this);
                    _super.prototype.handleDuringQuery.call(_this, event, args);
                }
            };
            _.delay(function () {
                _this.toSendRightNow();
            }, _this.delayBeforeSending);
        });
    };
    PendingSearchAsYouTypeSearchEvent.prototype.sendRightNow = function () {
        if (this.toSendRightNow) {
            this.toSendRightNow();
        }
    };
    PendingSearchAsYouTypeSearchEvent.prototype.modifyCustomData = function (key, newData) {
        _.each(this.searchEvents, function (searchEvent) {
            searchEvent.customData[key] = newData;
        });
        if (!this.templateSearchEvent.customData) {
            this.templateSearchEvent.customData = {};
        }
        this.templateSearchEvent.customData[key] = newData;
    };
    PendingSearchAsYouTypeSearchEvent.prototype.modifyEventCause = function (newCause) {
        _.each(this.searchEvents, function (searchEvent) {
            searchEvent.actionCause = newCause.name;
            searchEvent.actionType = newCause.type;
        });
        this.templateSearchEvent.actionCause = newCause.name;
        this.templateSearchEvent.actionType = newCause.type;
    };
    PendingSearchAsYouTypeSearchEvent.prototype.stopRecording = function () {
        _super.prototype.stopRecording.call(this);
        if (this.beforeUnloadHandler) {
            window.removeEventListener('beforeunload', this.beforeUnloadHandler);
            this.beforeUnloadHandler = undefined;
        }
    };
    PendingSearchAsYouTypeSearchEvent.prototype.handleNuke = function () {
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    };
    PendingSearchAsYouTypeSearchEvent.prototype.onWindowUnload = function () {
        if (!this.isCancelledOrFinished()) {
            this.armBatchDelay = 0;
            this.sendRightNow();
        }
    };
    PendingSearchAsYouTypeSearchEvent.prototype.isCancelledOrFinished = function () {
        if (!this.cancelled) {
            if (this.finished) {
                this.cancel();
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    };
    return PendingSearchAsYouTypeSearchEvent;
}(PendingSearchEvent_1.PendingSearchEvent));
exports.PendingSearchAsYouTypeSearchEvent = PendingSearchAsYouTypeSearchEvent;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var Strings_1 = __webpack_require__(9);
var Assert_1 = __webpack_require__(6);
var _ = __webpack_require__(0);
// On-demand mapping of file types to captions. Used by facets, but I don't
// really like this. Maybe a dedicated filetype facet would be better? Hmm...
var fileTypeCaptions;
var FileTypes = (function () {
    function FileTypes() {
    }
    FileTypes.get = function (result) {
        var objecttype = Utils_1.Utils.getFieldValue(result, 'objecttype');
        var filetype = Utils_1.Utils.getFieldValue(result, 'filetype');
        // When @objecttype is File we fallback on @filetype for icons and such
        if (Utils_1.Utils.isNonEmptyString(objecttype) && objecttype.toLowerCase() != 'file') {
            return FileTypes.getObjectType(objecttype);
        }
        else if (Utils_1.Utils.isNonEmptyString(filetype)) {
            return FileTypes.getFileType(filetype);
        }
        else {
            return {
                // This will render a default icon. Really it should not happen.
                icon: 'coveo-icon filetype',
                caption: Strings_1.l('Unknown')
            };
        }
    };
    FileTypes.getObjectType = function (objecttype) {
        // We must use lowercase filetypes because that's how the CSS classes
        // are generated (they are case sensitive, alas).
        objecttype = objecttype.toLowerCase();
        var variableValue = "objecttype_" + objecttype;
        // Most object types have a set of localized strings in the main dictionary
        var localizedString = Strings_1.l(variableValue);
        return {
            'icon': 'coveo-icon objecttype ' + objecttype.replace(' ', '-'),
            caption: localizedString != variableValue ? localizedString : objecttype
        };
    };
    FileTypes.getFileType = function (filetype) {
        // We must use lowercase filetypes because that's how the CSS classes
        // are generated (they are case sensitive, alas).
        filetype = filetype.toLowerCase();
        // Sometimes, filetype begins with a period (typically means the index has
        // no idea and uses the file extension as a filetype).
        if (filetype[0] == '.') {
            filetype = filetype.substring(1);
        }
        var variableValue = "filetype_" + filetype;
        // Most filetypes have a set of localized strings in the main dictionary
        var localizedString = Strings_1.l(variableValue);
        return {
            'icon': 'coveo-icon filetype ' + filetype.replace(' ', '-'),
            caption: localizedString != variableValue ? localizedString : filetype
        };
    };
    FileTypes.getFileTypeCaptions = function () {
        if (fileTypeCaptions == undefined) {
            fileTypeCaptions = {};
            var strings = String['locales'][String['locale'].toLowerCase()];
            Assert_1.Assert.isNotUndefined(strings);
            _.each(_.keys(strings), function (key) {
                if (key.indexOf('filetype_') == 0) {
                    fileTypeCaptions[key.substr('filetype_'.length)] = key.toLocaleString();
                }
                else if (key.indexOf('objecttype_') == 0) {
                    fileTypeCaptions[key.substr('objecttype_'.length)] = key.toLocaleString();
                }
            });
        }
        return fileTypeCaptions;
    };
    return FileTypes;
}());
exports.FileTypes = FileTypes;


/***/ }),
/* 82 */
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
var Template_1 = __webpack_require__(23);
var UnderscoreTemplate_1 = __webpack_require__(39);
var TemplateCache_1 = __webpack_require__(44);
var Assert_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var Initialization_1 = __webpack_require__(1);
/*
 * This renders the appropriate result template, found in TemplateCache,
 * according to its condition.
 *
 * For example, a result with a filetype of `YoutubeVideo` will get rendered
 * with the `YoutubeVideo` template, because the latter is registered with a
 * `condition` of `raw.filetype == 'YoutubeVideo'`.
 */
var DefaultResultTemplate = (function (_super) {
    __extends(DefaultResultTemplate, _super);
    function DefaultResultTemplate() {
        var _this = _super.call(this) || this;
        // For default result template, register everything since it's not possible to "scan" them before they are rendered.
        _this.addFields(Initialization_1.Initialization.getRegisteredFieldsForQuery());
        return _this;
    }
    DefaultResultTemplate.prototype.instantiateToString = function (object, instantiateOptions) {
        if (instantiateOptions === void 0) { instantiateOptions = {}; }
        Assert_1.Assert.exists(object);
        var mergedOptions = new Template_1.DefaultInstantiateTemplateOptions().merge(instantiateOptions);
        object = _.extend({}, object, UnderscoreTemplate_1.UnderscoreTemplate.templateHelpers);
        var templates = _.chain(TemplateCache_1.TemplateCache.getDefaultTemplates())
            .map(function (name) { return TemplateCache_1.TemplateCache.getTemplate(name); })
            .value();
        // Put templates with conditions first
        var sortedTemplates = _.chain(templates)
            .sortBy(function (template) { return template.condition == null; })
            .sortBy(function (template) { return template.fieldsToMatch == null; })
            .value();
        for (var i = 0; i < sortedTemplates.length; i++) {
            var result = sortedTemplates[i].instantiateToString(object, mergedOptions);
            if (result != null) {
                return result;
            }
        }
        return this.getFallbackTemplate();
    };
    DefaultResultTemplate.prototype.getFields = function () {
        var defaultTemplates = _.map(TemplateCache_1.TemplateCache.getDefaultTemplates(), function (name) { return TemplateCache_1.TemplateCache.getTemplate(name); });
        return _.flatten(_.map(defaultTemplates, function (template) { return template.getFields(); }));
    };
    DefaultResultTemplate.prototype.getType = function () {
        return 'DefaultResultTemplate';
    };
    DefaultResultTemplate.prototype.getFallbackTemplate = function () {
        var titleContainer = Dom_1.$$('div', {
            className: 'coveo-title'
        });
        var resultLink = Dom_1.$$('a', {
            className: 'CoveoResultLink'
        });
        titleContainer.append(resultLink.el);
        var excerpt = Dom_1.$$('div', {
            className: 'CoveoExcerpt'
        });
        var resultContainer = Dom_1.$$('div');
        resultContainer.append(titleContainer.el);
        resultContainer.append(excerpt.el);
        return resultContainer.el.outerHTML;
    };
    return DefaultResultTemplate;
}(Template_1.Template));
exports.DefaultResultTemplate = DefaultResultTemplate;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Code originally taken from : https://developers.livechatinc.com/blog/setting-cookies-to-subdomains-in-javascript/
var Cookie = (function () {
    function Cookie() {
    }
    Cookie.set = function (name, value, expiration) {
        var domain, domainParts, date, expires, host;
        if (expiration) {
            date = new Date();
            date.setTime(date.getTime() + expiration);
            expires = '; expires=' + date.toGMTString();
        }
        else {
            expires = '';
        }
        host = location.hostname;
        if (host.split('.').length === 1) {
            // no '.' in a domain - it's localhost or something similar
            document.cookie = this.prefix + name + '=' + value + expires + '; path=/';
        }
        else {
            // Remember the cookie on all subdomains.
            //
            // Start with trying to set cookie to the top domain.
            // (example: if user is on foo.com, try to set
            //  cookie to domain '.com')
            //
            // If the cookie will not be set, it means '.com'
            // is a top level domain and we need to
            // set the cookie to '.foo.com'
            domainParts = host.split('.');
            domainParts.shift();
            domain = '.' + domainParts.join('.');
            document.cookie = this.prefix + name + '=' + value + expires + '; path=/; domain=' + domain;
            // check if cookie was successfuly set to the given domain
            // (otherwise it was a Top-Level Domain)
            if (Cookie.get(name) == null || Cookie.get(name) != value) {
                // append '.' to current domain
                domain = '.' + host;
                document.cookie = this.prefix + name + '=' + value + expires + '; path=/; domain=' + domain;
            }
        }
    };
    Cookie.get = function (name) {
        var nameEQ = this.prefix + name + '=';
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
    Cookie.erase = function (name) {
        Cookie.set(name, '', -1);
    };
    return Cookie;
}());
Cookie.prefix = 'coveo_';
exports.Cookie = Cookie;


/***/ }),
/* 84 */
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
var Assert_1 = __webpack_require__(6);
var Options_1 = __webpack_require__(50);
var Utils_1 = __webpack_require__(4);
var Globalize = __webpack_require__(22);
var DefaultCurrencyToStringOptions = (function (_super) {
    __extends(DefaultCurrencyToStringOptions, _super);
    function DefaultCurrencyToStringOptions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.decimals = 0;
        return _this;
    }
    return DefaultCurrencyToStringOptions;
}(Options_1.Options));
var CurrencyUtils = (function () {
    function CurrencyUtils() {
    }
    CurrencyUtils.currencyToString = function (value, options) {
        if (Utils_1.Utils.isNullOrUndefined(value)) {
            return '';
        }
        value = Number(value);
        Assert_1.Assert.isNumber(value);
        options = new DefaultCurrencyToStringOptions().merge(options);
        var currency = Globalize.culture().numberFormat.currency;
        var backup = currency.symbol;
        if (Utils_1.Utils.isNonEmptyString(options.symbol)) {
            currency.symbol = options.symbol;
        }
        var str = Globalize.format(value, 'c' + options.decimals.toString());
        currency.symbol = backup;
        return str;
    };
    return CurrencyUtils;
}());
exports.CurrencyUtils = CurrencyUtils;


/***/ }),
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */
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
var Template_1 = __webpack_require__(23);
var DefaultResultTemplate_1 = __webpack_require__(82);
var Assert_1 = __webpack_require__(6);
var _ = __webpack_require__(0);
var TemplateList = (function (_super) {
    __extends(TemplateList, _super);
    function TemplateList(templates) {
        var _this = _super.call(this) || this;
        _this.templates = templates;
        Assert_1.Assert.exists(templates);
        return _this;
    }
    TemplateList.prototype.instantiateToString = function (object, instantiateOptions) {
        if (instantiateOptions === void 0) { instantiateOptions = {}; }
        var merged = new Template_1.DefaultInstantiateTemplateOptions().merge(instantiateOptions);
        var filteredTemplates = _.reject(this.templates, function (t) { return t.role != null; });
        for (var i = 0; i < filteredTemplates.length; i++) {
            var result = filteredTemplates[i].instantiateToString(object, merged);
            if (result != null) {
                return result;
            }
        }
        return this.getFallbackTemplate().instantiateToString(object, instantiateOptions);
    };
    TemplateList.prototype.instantiateToElement = function (object, instantiateOptions) {
        if (instantiateOptions === void 0) { instantiateOptions = {}; }
        var merged = new Template_1.DefaultInstantiateTemplateOptions().merge(instantiateOptions);
        var filteredTemplates = _.reject(this.templates, function (t) { return t.role != null; });
        for (var i = 0; i < filteredTemplates.length; i++) {
            var promiseOfHTMLElement = filteredTemplates[i].instantiateToElement(object, merged);
            if (promiseOfHTMLElement != null) {
                return promiseOfHTMLElement;
            }
        }
        return this.getFallbackTemplate().instantiateToElement(object, merged);
    };
    TemplateList.prototype.getFields = function () {
        return _.reduce(this.templates, function (fields, template) { return fields.concat(template.getFields()); }, []);
    };
    TemplateList.prototype.getType = function () {
        return 'TemplateList';
    };
    TemplateList.prototype.getFallbackTemplate = function () {
        return new DefaultResultTemplate_1.DefaultResultTemplate();
    };
    return TemplateList;
}(Template_1.Template));
exports.TemplateList = TemplateList;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResultLayoutEvents = (function () {
    function ResultLayoutEvents() {
    }
    return ResultLayoutEvents;
}());
ResultLayoutEvents.populateResultLayout = 'populateResultLayout';
exports.ResultLayoutEvents = ResultLayoutEvents;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SliderEvents = (function () {
    function SliderEvents() {
    }
    return SliderEvents;
}());
SliderEvents.startSlide = 'startSlide';
SliderEvents.duringSlide = 'duringSlide';
SliderEvents.endSlide = 'endSlide';
SliderEvents.graphValueSelected = 'graphValueSelected';
exports.SliderEvents = SliderEvents;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ColorUtils = (function () {
    function ColorUtils() {
    }
    ColorUtils.hsvToRgb = function (h, s, v) {
        var r, g, b;
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };
    ColorUtils.rgbToHsv = function (r, g, b) {
        r = r / 255, g = g / 255, b = b / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;
        var d = max - min;
        s = max == 0 ? 0 : d / max;
        if (max == min) {
            h = 0; // achromatic
        }
        else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, v];
    };
    return ColorUtils;
}());
exports.ColorUtils = ColorUtils;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var history_1 = __webpack_require__(103);
var detector_1 = __webpack_require__(67);
__webpack_require__(268);
exports.Version = 'v15';
exports.Endpoints = {
    default: 'https://usageanalytics.coveo.com',
    production: 'https://usageanalytics.coveo.com',
    dev: 'https://usageanalyticsdev.coveo.com',
    staging: 'https://usageanalyticsstaging.coveo.com'
};
;
function defaultResponseTransformer(response) {
    return response.json().then(function (data) {
        data.raw = response;
        return data;
    });
}
var Client = (function () {
    function Client(opts) {
        if (typeof opts === 'undefined') {
            throw new Error('You have to pass options to this constructor');
        }
        this.endpoint = opts.endpoint || exports.Endpoints.default;
        this.token = opts.token;
        this.version = opts.version || exports.Version;
    }
    Client.prototype.sendEvent = function (eventType, request) {
        return fetch(this.getRestEndpoint() + "/analytics/" + eventType, {
            method: 'POST',
            headers: this.getHeaders(),
            mode: 'cors',
            body: JSON.stringify(request),
            credentials: 'include'
        });
    };
    Client.prototype.sendSearchEvent = function (request) {
        return this.sendEvent('search', request).then(defaultResponseTransformer);
    };
    Client.prototype.sendClickEvent = function (request) {
        return this.sendEvent('click', request).then(defaultResponseTransformer);
    };
    Client.prototype.sendCustomEvent = function (request) {
        return this.sendEvent('custom', request).then(defaultResponseTransformer);
    };
    Client.prototype.sendViewEvent = function (request) {
        if (request.referrer === '') {
            delete request.referrer;
        }
        if (detector_1.hasDocumentLocation()) {
            var store = new history_1.HistoryStore();
            var historyElement = {
                name: 'PageView',
                value: document.location.toString(),
                time: JSON.stringify(new Date()),
                title: document.title
            };
            store.addElement(historyElement);
        }
        return this.sendEvent('view', request).then(defaultResponseTransformer);
    };
    Client.prototype.getVisit = function () {
        return fetch(this.getRestEndpoint() + "/analytics/visit")
            .then(defaultResponseTransformer);
    };
    Client.prototype.getHealth = function () {
        return fetch(this.getRestEndpoint() + "/analytics/monitoring/health")
            .then(defaultResponseTransformer);
    };
    Client.prototype.getRestEndpoint = function () {
        return this.endpoint + "/rest/" + this.version;
    };
    Client.prototype.getHeaders = function () {
        var headers = {
            'Content-Type': "application/json"
        };
        if (this.token) {
            headers['Authorization'] = "Bearer " + this.token;
        }
        return headers;
    };
    return Client;
}());
exports.Client = Client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Client;


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var storage_1 = __webpack_require__(104);
var detector = __webpack_require__(67);
exports.STORE_KEY = '__coveo.analytics.history';
exports.MAX_NUMBER_OF_HISTORY_ELEMENTS = 20;
exports.MIN_THRESHOLD_FOR_DUPLICATE_VALUE = 1000 * 60;
exports.MAX_VALUE_SIZE = 75;
var HistoryStore = (function () {
    function HistoryStore(store) {
        this.store = store || storage_1.getAvailableStorage();
        if (!(this.store instanceof storage_1.CookieStorage) && detector.hasCookieStorage()) {
            new storage_1.CookieStorage().removeItem(exports.STORE_KEY);
        }
    }
    ;
    HistoryStore.prototype.addElement = function (elem) {
        elem.internalTime = new Date().getTime();
        this.cropQueryElement(elem);
        var currentHistory = this.getHistory();
        if (currentHistory != null) {
            if (this.isValidEntry(elem)) {
                this.setHistory([elem].concat(currentHistory));
            }
        }
        else {
            this.setHistory([elem]);
        }
    };
    HistoryStore.prototype.getHistory = function () {
        try {
            return JSON.parse(this.store.getItem(exports.STORE_KEY));
        }
        catch (e) {
            return [];
        }
    };
    HistoryStore.prototype.setHistory = function (history) {
        try {
            this.store.setItem(exports.STORE_KEY, JSON.stringify(history.slice(0, exports.MAX_NUMBER_OF_HISTORY_ELEMENTS)));
        }
        catch (e) { }
    };
    HistoryStore.prototype.clear = function () {
        try {
            this.store.removeItem(exports.STORE_KEY);
        }
        catch (e) { }
    };
    HistoryStore.prototype.getMostRecentElement = function () {
        var currentHistory = this.getHistory();
        if (currentHistory != null) {
            var sorted = currentHistory.sort(function (first, second) {
                if (first.internalTime == null && second.internalTime == null) {
                    return 0;
                }
                if (first.internalTime == null && second.internalTime != null) {
                    return 1;
                }
                if (first.internalTime != null && second.internalTime == null) {
                    return -1;
                }
                return second.internalTime - first.internalTime;
            });
            return sorted[0];
        }
        return null;
    };
    HistoryStore.prototype.cropQueryElement = function (elem) {
        if (elem.name && elem.name.toLowerCase() == 'query' && elem.value != null) {
            elem.value = elem.value.slice(0, exports.MAX_VALUE_SIZE);
        }
    };
    HistoryStore.prototype.isValidEntry = function (elem) {
        var lastEntry = this.getMostRecentElement();
        if (lastEntry && lastEntry.value == elem.value) {
            return elem.internalTime - lastEntry.internalTime > exports.MIN_THRESHOLD_FOR_DUPLICATE_VALUE;
        }
        return true;
    };
    return HistoryStore;
}());
exports.HistoryStore = HistoryStore;
;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HistoryStore;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var detector = __webpack_require__(67);
var cookieutils_1 = __webpack_require__(228);
exports.preferredStorage = null;
function getAvailableStorage() {
    if (exports.preferredStorage) {
        return exports.preferredStorage;
    }
    if (detector.hasLocalStorage()) {
        return localStorage;
    }
    if (detector.hasCookieStorage()) {
        return new CookieStorage();
    }
    if (detector.hasSessionStorage()) {
        return sessionStorage;
    }
    return new NullStorage();
}
exports.getAvailableStorage = getAvailableStorage;
var CookieStorage = (function () {
    function CookieStorage() {
    }
    CookieStorage.prototype.getItem = function (key) {
        return cookieutils_1.Cookie.get(key);
    };
    CookieStorage.prototype.removeItem = function (key) {
        cookieutils_1.Cookie.erase(key);
    };
    CookieStorage.prototype.setItem = function (key, data) {
        cookieutils_1.Cookie.set(key, data);
    };
    return CookieStorage;
}());
exports.CookieStorage = CookieStorage;
var NullStorage = (function () {
    function NullStorage() {
    }
    NullStorage.prototype.getItem = function (key) { return null; };
    NullStorage.prototype.removeItem = function (key) { };
    NullStorage.prototype.setItem = function (key, data) { };
    return NullStorage;
}());
exports.NullStorage = NullStorage;


/***/ }),
/* 105 */
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
var Assert_1 = __webpack_require__(6);
var Model_1 = __webpack_require__(15);
var InitializationEvents_1 = __webpack_require__(14);
var Dom_1 = __webpack_require__(2);
var HashUtils_1 = __webpack_require__(36);
var Defer_1 = __webpack_require__(25);
var RootComponent_1 = __webpack_require__(32);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
/**
 * This component is instantiated automatically by the framework on the root if the {@link SearchInterface}.<br/>
 * When the {@link SearchInterface.options.enableHistory} option is set to true, this component is instantiated.<br/>
 * It's only job is to apply changes in the {@link QueryStateModel} to the hash in the URL, and vice versa.<br/>
 * This component does *not* hold the state of the interface, it only represent it in the URL.
 */
var HistoryController = (function (_super) {
    __extends(HistoryController, _super);
    /**
     * Create a new history controller
     * @param element
     * @param windoh For mock / test purposes.
     * @param model
     * @param queryController
     * @param hashUtilsModule For mock / test purposes.
     */
    function HistoryController(element, windoh, model, queryController, hashUtils) {
        if (hashUtils === void 0) { hashUtils = HashUtils_1.HashUtils; }
        var _this = _super.call(this, element, HistoryController.ID) || this;
        _this.windoh = windoh;
        _this.model = model;
        _this.queryController = queryController;
        _this.hashUtils = hashUtils;
        _this.ignoreNextHashChange = false;
        _this.initialHashChange = false;
        _this.willUpdateHash = false;
        _this.windoh = _this.windoh || window;
        Assert_1.Assert.exists(_this.model);
        Assert_1.Assert.exists(_this.queryController);
        Dom_1.$$(_this.element).on(InitializationEvents_1.InitializationEvents.restoreHistoryState, function () {
            _this.logger.trace('Restore history state. Update model');
            _this.updateModelFromHash();
        });
        Dom_1.$$(_this.element).on(_this.model.getEventName(Model_1.Model.eventTypes.all), function () {
            _this.logger.trace('Query model changed. Update hash');
            _this.updateHashFromModel();
        });
        _this.hashchange = function () {
            _this.handleHashChange();
        };
        _this.windoh.addEventListener('hashchange', _this.hashchange);
        Dom_1.$$(_this.element).on(InitializationEvents_1.InitializationEvents.nuke, function () { return _this.handleNuke(); });
        return _this;
    }
    /**
     * Set the given map of key value in the hash of the URL
     * @param values
     */
    HistoryController.prototype.setHashValues = function (values) {
        this.logger.trace('Update history hash');
        var hash = '#' + this.hashUtils.encodeValues(values);
        this.ignoreNextHashChange = this.windoh.location.hash != hash;
        this.logger.trace('ignoreNextHashChange', this.ignoreNextHashChange);
        this.logger.trace('initialHashChange', this.initialHashChange);
        this.logger.trace('from', this.windoh.location.hash, 'to', hash);
        if (this.initialHashChange) {
            this.initialHashChange = false;
            this.windoh.location.replace(hash);
            this.logger.trace('History hash modified', hash);
        }
        else if (this.ignoreNextHashChange) {
            this.windoh.location.hash = hash;
            this.logger.trace('History hash created', hash);
        }
    };
    HistoryController.prototype.handleNuke = function () {
        this.windoh.removeEventListener('hashchange', this.hashchange);
    };
    HistoryController.prototype.handleHashChange = function () {
        this.logger.trace('History hash changed');
        if (this.ignoreNextHashChange) {
            this.logger.trace('History hash change ignored');
            this.ignoreNextHashChange = false;
            return;
        }
        var diff = this.updateModelFromHash();
        if (_.difference(diff, HistoryController.attributesThatDoNotTriggerQuery).length > 0) {
            this.queryController.executeQuery();
        }
    };
    HistoryController.prototype.updateHashFromModel = function () {
        var _this = this;
        this.logger.trace('Model -> history hash');
        if (!this.willUpdateHash) {
            Defer_1.Defer.defer(function () {
                var attributes = _this.model.getAttributes();
                _this.setHashValues(attributes);
                _this.logger.debug('Saving state to hash', attributes);
                _this.willUpdateHash = false;
            });
            this.willUpdateHash = true;
        }
    };
    HistoryController.prototype.updateModelFromHash = function () {
        var _this = this;
        this.logger.trace('History hash -> model');
        var toSet = {};
        var diff = [];
        _.each(this.model.attributes, function (value, key, obj) {
            var valToSet = _this.getHashValue(key);
            toSet[key] = valToSet;
            if (_this.model.get(key) != valToSet) {
                diff.push(key);
            }
        });
        this.initialHashChange = true;
        this.model.setMultiple(toSet);
        return diff;
    };
    HistoryController.prototype.getHashValue = function (key) {
        Assert_1.Assert.isNonEmptyString(key);
        var value;
        try {
            value = this.hashUtils.getValue(key, this.hashUtils.getHash(this.windoh));
        }
        catch (error) {
            this.logger.error("Could not parse parameter " + key + " from URI");
        }
        if (Utils_1.Utils.isUndefined(value)) {
            value = this.model.defaultAttributes[key];
        }
        return value;
    };
    HistoryController.prototype.debugInfo = function () {
        return {
            'state': this.model.getAttributes()
        };
    };
    return HistoryController;
}(RootComponent_1.RootComponent));
HistoryController.ID = 'HistoryController';
HistoryController.attributesThatDoNotTriggerQuery = ['quickview'];
exports.HistoryController = HistoryController;


/***/ }),
/* 106 */
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
var LocalStorageUtils_1 = __webpack_require__(34);
var Model_1 = __webpack_require__(15);
var Logger_1 = __webpack_require__(13);
var Assert_1 = __webpack_require__(6);
var InitializationEvents_1 = __webpack_require__(14);
var RootComponent_1 = __webpack_require__(32);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
/**
 * This component acts like the {@link HistoryController} excepts that is saves the {@link QueryStateModel} in the local storage.<br/>
 * This will not allow 'back' and 'forward' navigation in the history, like the standard {@link HistoryController} allows. Instead, it load the query state only on page load.<br/>
 * To enable this component, you should set the {@link SearchInterface.options.useLocalStorageForHistory} as well as the {@link SearchInterface.options.enableHistory} options to true.
 */
var LocalStorageHistoryController = (function (_super) {
    __extends(LocalStorageHistoryController, _super);
    /**
     * Create a new LocalStorageHistoryController instance
     * @param element
     * @param windoh For mock purpose
     * @param model
     * @param queryController
     */
    function LocalStorageHistoryController(element, windoh, model, queryController) {
        var _this = _super.call(this, element, LocalStorageHistoryController.ID) || this;
        _this.windoh = windoh;
        _this.model = model;
        _this.queryController = queryController;
        _this.omit = [];
        if (!windoh['localStorage']) {
            new Logger_1.Logger(element).info('No local storage available in current browser. LocalStorageHistoryController cannot initialize itself', _this);
        }
        else {
            _this.storage = new LocalStorageUtils_1.LocalStorageUtils(LocalStorageHistoryController.ID);
            Assert_1.Assert.exists(_this.model);
            Assert_1.Assert.exists(_this.queryController);
            Dom_1.$$(_this.element).on(InitializationEvents_1.InitializationEvents.restoreHistoryState, function () { return _this.updateModelFromLocalStorage(); });
            Dom_1.$$(_this.element).on(_this.model.getEventName(Model_1.Model.eventTypes.all), function () { return _this.updateLocalStorageFromModel(); });
        }
        return _this;
    }
    /**
     * Specifies an array of attributes from the query state model that should not be persisted in the local storage
     * @param attributes
     */
    LocalStorageHistoryController.prototype.withoutThoseAttribute = function (attributes) {
        this.omit = attributes;
    };
    LocalStorageHistoryController.prototype.updateLocalStorageFromModel = function () {
        var attributes = _.omit(this.model.getAttributes(), this.omit);
        this.setStorageValues(attributes);
        this.logger.debug('Saving state to localstorage', attributes);
    };
    LocalStorageHistoryController.prototype.updateModelFromLocalStorage = function () {
        var _this = this;
        var toSet = {};
        var loadedFromStorage = this.storage.load();
        _.each(this.model.attributes, function (value, key, obj) {
            var valToSet = loadedFromStorage ? loadedFromStorage[key] : undefined;
            if (valToSet == undefined) {
                valToSet = _this.model.defaultAttributes[key];
            }
            toSet[key] = valToSet;
        });
        this.model.setMultiple(toSet);
    };
    LocalStorageHistoryController.prototype.setStorageValues = function (values) {
        this.storage.save(values);
    };
    return LocalStorageHistoryController;
}(RootComponent_1.RootComponent));
LocalStorageHistoryController.ID = 'LocalStorageHistoryController';
exports.LocalStorageHistoryController = LocalStorageHistoryController;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ExternalModulesShim_1 = __webpack_require__(21);
var _ = __webpack_require__(0);
String.toLocaleString = ExternalModulesShim_1.LocaleString;
var pluralRegex = /<pl>(((?!<\/pl>).)*)<\/pl>/g;
var singularRegex = /<sn>(((?!<\/sn>).)*)<\/sn>/g;
exports.L10N = {
    format: function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var value = key.toLocaleString();
        if (args.length > 0) {
            var last = _.last(args);
            // Last argument is either the count or a boolean forcing plural (true) or singular (false)
            if (_.isBoolean(last) || _.isNumber(last)) {
                args.pop();
                value = exports.L10N.formatPlSn(value, last);
            }
            _.each(args, function (arg, i) { return value = value.replace("{" + i + "}", arg); });
        }
        return value;
    },
    formatPlSn: function (value, count) {
        var isPlural = _.isBoolean(count) ? count : count > 1;
        if (isPlural) {
            value = value.replace(pluralRegex, '$1').replace(singularRegex, '');
        }
        else {
            value = value.replace(pluralRegex, '').replace(singularRegex, '$1');
        }
        return value;
    }
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore next */
function shim() {
    if (typeof Promise.prototype['finally'] != 'function') {
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
        };
    }
    var rethrowError = function (self) {
        self.then(null, function (err) {
            setTimeout(function () {
                throw err;
            }, 0);
        });
    };
    if (typeof Promise.prototype['done'] !== 'function') {
        Promise.prototype['done'] = function (onFulfilled, onRejected) {
            var self = arguments.length ? this.then.apply(this, arguments) : this;
            rethrowError(self);
            return this;
        };
    }
    if (typeof Promise.prototype['fail'] !== 'function') {
        Promise.prototype['fail'] = function (onFulfilled, onRejected) {
            var self = arguments.length ? this.catch.apply(this, arguments) : this;
            rethrowError(self);
            return this;
        };
    }
}
exports.shim = shim;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var APIAnalyticsBuilder = (function () {
    function APIAnalyticsBuilder() {
    }
    APIAnalyticsBuilder.convertSearchEventToAPI = function (searchEvent) {
        var apiSearchEvent = {
            advancedQuery: searchEvent.advancedQuery,
            customMetadatas: searchEvent.customData,
            device: searchEvent.device,
            didYouMean: searchEvent.didYouMean,
            language: searchEvent.language,
            pageNumber: searchEvent.pageNumber,
            queryText: searchEvent.queryText,
            responseTime: searchEvent.responseTime,
            numberOfResults: searchEvent.numberOfResults,
            resultsPerPage: searchEvent.resultsPerPage,
            searchHub: searchEvent.originLevel1,
            searchInterface: searchEvent.originLevel2,
            searchQueryUid: searchEvent.searchQueryUid,
            type: searchEvent.actionType,
            actionCause: searchEvent.actionCause,
            queryPipeline: searchEvent.queryPipeline,
            splitTestRunName: searchEvent.splitTestRunName,
            splitTestRunVersion: searchEvent.splitTestRunVersion
        };
        return apiSearchEvent;
    };
    APIAnalyticsBuilder.convertDocumentViewToAPI = function (documentView) {
        var apiDocumentView = {
            collectionName: documentView.collectionName,
            device: documentView.device,
            documentPosition: documentView.documentPosition,
            title: documentView.documentTitle,
            documentUrl: documentView.documentUrl,
            documentUri: documentView.documentUri,
            documentUriHash: documentView.documentUriHash,
            language: documentView.language,
            responseTime: documentView.responseTime,
            searchHub: documentView.originLevel1,
            searchInterface: documentView.originLevel2,
            searchQueryUid: documentView.searchQueryUid,
            sourceName: documentView.sourceName,
            viewMethod: documentView.viewMethod,
            customMetadatas: documentView.customData,
            actionCause: documentView.actionCause,
            queryPipeline: documentView.queryPipeline,
            splitTestRunName: documentView.splitTestRunName,
            splitTestRunVersion: documentView.splitTestRunVersion
        };
        return apiDocumentView;
    };
    APIAnalyticsBuilder.convertCustomEventToAPI = function (customEvent) {
        var apiCustomEvent = {
            actionCause: customEvent.actionCause,
            actionType: customEvent.actionType,
            device: customEvent.device,
            language: customEvent.language,
            responseTime: customEvent.responseTime,
            searchHub: customEvent.originLevel1,
            searchInterface: customEvent.originLevel2,
            customMetadatas: customEvent.customData
        };
        return apiCustomEvent;
    };
    return APIAnalyticsBuilder;
}());
exports.APIAnalyticsBuilder = APIAnalyticsBuilder;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(13);
var EndpointCaller_1 = __webpack_require__(70);
var Assert_1 = __webpack_require__(6);
var QueryUtils_1 = __webpack_require__(16);
var CookieUtils_1 = __webpack_require__(83);
var _ = __webpack_require__(0);
var AnalyticsEndpoint = (function () {
    function AnalyticsEndpoint(options) {
        this.options = options;
        this.logger = new Logger_1.Logger(this);
        var endpointCallerOptions = {
            accessToken: (this.options.token && this.options.token != '') ? this.options.token : null
        };
        this.endpointCaller = new EndpointCaller_1.EndpointCaller(endpointCallerOptions);
        this.organization = options.organization;
    }
    AnalyticsEndpoint.prototype.getCurrentVisitId = function () {
        return this.visitId;
    };
    AnalyticsEndpoint.prototype.getCurrentVisitIdPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.getCurrentVisitId()) {
                resolve(_this.getCurrentVisitId());
            }
            else {
                var url = _this.buildAnalyticsUrl('/analytics/visit');
                _this.getFromService(url, {})
                    .then(function (response) {
                    _this.visitId = response.id;
                    resolve(_this.visitId);
                })
                    .catch(function (response) {
                    reject(response);
                });
            }
        });
    };
    AnalyticsEndpoint.prototype.sendSearchEvents = function (searchEvents) {
        if (searchEvents.length > 0) {
            this.logger.info('Logging analytics search events', searchEvents);
            return this.sendToService(searchEvents, 'searches', 'searchEvents');
        }
    };
    AnalyticsEndpoint.prototype.sendDocumentViewEvent = function (documentViewEvent) {
        Assert_1.Assert.exists(documentViewEvent);
        this.logger.info('Logging analytics document view', documentViewEvent);
        return this.sendToService(documentViewEvent, 'click', 'clickEvent');
    };
    AnalyticsEndpoint.prototype.sendCustomEvent = function (customEvent) {
        Assert_1.Assert.exists(customEvent);
        this.logger.info('Logging analytics custom event', customEvent);
        return this.sendToService(customEvent, 'custom', 'customEvent');
    };
    AnalyticsEndpoint.prototype.getTopQueries = function (params) {
        var url = this.buildAnalyticsUrl('/stats/topQueries');
        return this.getFromService(url, params);
    };
    AnalyticsEndpoint.prototype.sendToService = function (data, path, paramName) {
        var _this = this;
        var url = QueryUtils_1.QueryUtils.mergePath(this.options.serviceUrl, '/rest/' + (AnalyticsEndpoint.CUSTOM_ANALYTICS_VERSION || AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION) + '/analytics/' + path);
        var queryString = [];
        if (this.organization) {
            queryString.push('org=' + this.organization);
        }
        if (CookieUtils_1.Cookie.get('visitorId')) {
            queryString.push('visitor=' + encodeURIComponent(CookieUtils_1.Cookie.get('visitorId')));
        }
        // We use pendingRequest because we don't want to have 2 request to analytics at the same time.
        // Otherwise the cookie visitId won't be set correctly.
        if (AnalyticsEndpoint.pendingRequest == null) {
            AnalyticsEndpoint.pendingRequest = this.endpointCaller.call({
                errorsAsSuccess: false,
                method: 'POST',
                queryString: queryString,
                requestData: data,
                url: url,
                responseType: 'text',
                requestDataType: 'application/json'
            }).then(function (res) {
                return _this.handleAnalyticsEventResponse(res.data);
            }).finally(function () {
                AnalyticsEndpoint.pendingRequest = null;
            });
            return AnalyticsEndpoint.pendingRequest;
        }
        else {
            return AnalyticsEndpoint.pendingRequest.finally(function () {
                return _this.sendToService(data, path, paramName);
            });
        }
    };
    AnalyticsEndpoint.prototype.getFromService = function (url, params) {
        var paramsToSend = (this.options.token && this.options.token != '') ? _.extend({ 'access_token': this.options.token }, params) : params;
        return this.endpointCaller.call({
            errorsAsSuccess: false,
            method: 'GET',
            queryString: this.options.organization ? ['org=' + encodeURIComponent(this.options.organization)] : [],
            requestData: paramsToSend,
            responseType: 'json',
            url: url
        }).then(function (res) {
            return res.data;
        });
    };
    AnalyticsEndpoint.prototype.handleAnalyticsEventResponse = function (response) {
        var visitId;
        var visitorId;
        if (response['visitId']) {
            visitId = response['visitId'];
            visitorId = response['visitorId'];
        }
        else if (response['searchEventResponses']) {
            visitId = _.first(response['searchEventResponses']).visitId;
            visitorId = _.first(response['searchEventResponses']).visitorId;
        }
        if (visitId) {
            this.visitId = visitId;
        }
        if (visitorId) {
            CookieUtils_1.Cookie.set('visitorId', visitorId, AnalyticsEndpoint.VISITOR_COOKIE_TIME);
        }
        return response;
    };
    AnalyticsEndpoint.prototype.buildAnalyticsUrl = function (path) {
        return this.options.serviceUrl + '/rest/' + (AnalyticsEndpoint.CUSTOM_ANALYTICS_VERSION || AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION) + path;
    };
    return AnalyticsEndpoint;
}());
AnalyticsEndpoint.DEFAULT_ANALYTICS_URI = 'https://usageanalytics.coveo.com';
AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION = 'v15';
AnalyticsEndpoint.CUSTOM_ANALYTICS_VERSION = undefined;
AnalyticsEndpoint.VISITOR_COOKIE_TIME = 10000 * 24 * 60 * 60 * 1000;
exports.AnalyticsEndpoint = AnalyticsEndpoint;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
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
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Globalize = __webpack_require__(22);
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
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DeviceUtils_1 = __webpack_require__(17);
var PendingSearchEvent_1 = __webpack_require__(72);
var PendingSearchAsYouTypeSearchEvent_1 = __webpack_require__(80);
var Assert_1 = __webpack_require__(6);
var Logger_1 = __webpack_require__(13);
var AnalyticsActionListMeta_1 = __webpack_require__(11);
var Defer_1 = __webpack_require__(25);
var Dom_1 = __webpack_require__(2);
var AnalyticsEvents_1 = __webpack_require__(60);
var APIAnalyticsBuilder_1 = __webpack_require__(109);
var QueryStateModel_1 = __webpack_require__(12);
var Component_1 = __webpack_require__(7);
var Version_1 = __webpack_require__(69);
var QueryUtils_1 = __webpack_require__(16);
var _ = __webpack_require__(0);
var LiveAnalyticsClient = (function () {
    function LiveAnalyticsClient(endpoint, rootElement, userId, userDisplayName, anonymous, splitTestRunName, splitTestRunVersion, originLevel1, sendToCloud) {
        this.endpoint = endpoint;
        this.rootElement = rootElement;
        this.userId = userId;
        this.userDisplayName = userDisplayName;
        this.anonymous = anonymous;
        this.splitTestRunName = splitTestRunName;
        this.splitTestRunVersion = splitTestRunVersion;
        this.originLevel1 = originLevel1;
        this.sendToCloud = sendToCloud;
        this.isContextual = false;
        this.originContext = 'Search';
        this.language = String['locale'];
        this.device = DeviceUtils_1.DeviceUtils.getDeviceName();
        this.mobile = DeviceUtils_1.DeviceUtils.isMobileDevice();
        Assert_1.Assert.exists(endpoint);
        Assert_1.Assert.exists(rootElement);
        Assert_1.Assert.isNonEmptyString(this.language);
        Assert_1.Assert.isNonEmptyString(this.device);
        Assert_1.Assert.isNonEmptyString(this.originLevel1);
        this.logger = new Logger_1.Logger(this);
    }
    LiveAnalyticsClient.prototype.isActivated = function () {
        return true;
    };
    LiveAnalyticsClient.prototype.getCurrentVisitId = function () {
        return this.endpoint.getCurrentVisitId();
    };
    LiveAnalyticsClient.prototype.getCurrentVisitIdPromise = function () {
        return this.endpoint.getCurrentVisitIdPromise();
    };
    LiveAnalyticsClient.prototype.getCurrentEventCause = function () {
        if (this.pendingSearchEvent != null) {
            return this.pendingSearchEvent.getEventCause();
        }
        if (this.pendingSearchAsYouTypeSearchEvent != null) {
            return this.pendingSearchAsYouTypeSearchEvent.getEventCause();
        }
        return null;
    };
    LiveAnalyticsClient.prototype.getCurrentEventMeta = function () {
        if (this.pendingSearchEvent != null) {
            return this.pendingSearchEvent.getEventMeta();
        }
        if (this.pendingSearchAsYouTypeSearchEvent != null) {
            return this.pendingSearchAsYouTypeSearchEvent.getEventMeta();
        }
        return null;
    };
    LiveAnalyticsClient.prototype.logSearchEvent = function (actionCause, meta) {
        var metaObject = this.buildMetaObject(meta);
        this.pushSearchEvent(actionCause, metaObject);
    };
    LiveAnalyticsClient.prototype.logSearchAsYouType = function (actionCause, meta) {
        var metaObject = this.buildMetaObject(meta);
        this.pushSearchAsYouTypeEvent(actionCause, metaObject);
    };
    LiveAnalyticsClient.prototype.logClickEvent = function (actionCause, meta, result, element) {
        var metaObject = this.buildMetaObject(meta, result);
        this.pushClickEvent(actionCause, metaObject, result, element);
    };
    LiveAnalyticsClient.prototype.logCustomEvent = function (actionCause, meta, element) {
        var metaObject = this.buildMetaObject(meta);
        this.pushCustomEvent(actionCause, metaObject, element);
    };
    LiveAnalyticsClient.prototype.getTopQueries = function (params) {
        return this.endpoint.getTopQueries(params);
    };
    LiveAnalyticsClient.prototype.sendAllPendingEvents = function () {
        if (this.pendingSearchAsYouTypeSearchEvent) {
            this.pendingSearchAsYouTypeSearchEvent.sendRightNow();
        }
    };
    LiveAnalyticsClient.prototype.cancelAllPendingEvents = function () {
        if (this.pendingSearchAsYouTypeSearchEvent) {
            this.pendingSearchAsYouTypeSearchEvent.cancel();
            this.pendingSearchAsYouTypeSearchEvent = null;
        }
        if (this.pendingSearchEvent) {
            this.pendingSearchEvent.cancel();
            this.pendingSearchEvent = null;
        }
    };
    LiveAnalyticsClient.prototype.getPendingSearchEvent = function () {
        if (this.pendingSearchEvent) {
            return this.pendingSearchEvent;
        }
        else if (this.pendingSearchAsYouTypeSearchEvent) {
            return this.pendingSearchAsYouTypeSearchEvent;
        }
        return null;
    };
    LiveAnalyticsClient.prototype.warnAboutSearchEvent = function () {
        if (_.isUndefined(this.pendingSearchEvent) && _.isUndefined(this.pendingSearchAsYouTypeSearchEvent)) {
            this.logger.warn('A search was triggered, but no analytics event was logged. If you wish to have consistent analytics data, consider logging a search event using the methods provided by the framework', 'https://developers.coveo.com/x/TwA5');
            if (window['console'] && console.trace) {
                console.trace();
            }
        }
    };
    LiveAnalyticsClient.prototype.setOriginContext = function (originContext) {
        this.originContext = originContext;
    };
    LiveAnalyticsClient.prototype.pushCustomEvent = function (actionCause, metaObject, element) {
        var _this = this;
        var customEvent = this.buildCustomEvent(actionCause, metaObject, element);
        this.triggerChangeAnalyticsCustomData('CustomEvent', metaObject, customEvent);
        this.checkToSendAnyPendingSearchAsYouType(actionCause);
        Defer_1.Defer.defer(function () {
            if (_this.sendToCloud) {
                _this.endpoint.sendCustomEvent(customEvent);
            }
            Dom_1.$$(_this.rootElement).trigger(AnalyticsEvents_1.AnalyticsEvents.customEvent, { customEvent: APIAnalyticsBuilder_1.APIAnalyticsBuilder.convertCustomEventToAPI(customEvent) });
        });
    };
    LiveAnalyticsClient.prototype.pushSearchEvent = function (actionCause, metaObject) {
        var _this = this;
        Assert_1.Assert.exists(actionCause);
        if (this.pendingSearchEvent && this.pendingSearchEvent.getEventCause() !== actionCause.name) {
            this.pendingSearchEvent.stopRecording();
            this.pendingSearchEvent = null;
        }
        this.checkToSendAnyPendingSearchAsYouType(actionCause);
        if (!this.pendingSearchEvent) {
            var searchEvent = this.buildSearchEvent(actionCause, metaObject);
            this.triggerChangeAnalyticsCustomData('SearchEvent', metaObject, searchEvent);
            var pendingSearchEvent = this.pendingSearchEvent = new PendingSearchEvent_1.PendingSearchEvent(this.rootElement, this.endpoint, searchEvent, this.sendToCloud);
            Defer_1.Defer.defer(function () {
                // At this point all `duringQuery` events should have been fired, so we can forget
                // about the pending search event. It will finish processing automatically when
                // all the deferred that were caught terminate.
                _this.pendingSearchEvent = undefined;
                pendingSearchEvent.stopRecording();
            });
        }
    };
    LiveAnalyticsClient.prototype.checkToSendAnyPendingSearchAsYouType = function (actionCause) {
        if (this.eventIsNotRelatedToSearchbox(actionCause.name)) {
            this.sendAllPendingEvents();
        }
        else {
            this.cancelAnyPendingSearchAsYouTypeEvent();
        }
    };
    LiveAnalyticsClient.prototype.pushSearchAsYouTypeEvent = function (actionCause, metaObject) {
        this.cancelAnyPendingSearchAsYouTypeEvent();
        var searchEvent = this.buildSearchEvent(actionCause, metaObject);
        this.triggerChangeAnalyticsCustomData('SearchEvent', metaObject, searchEvent);
        this.pendingSearchAsYouTypeSearchEvent = new PendingSearchAsYouTypeSearchEvent_1.PendingSearchAsYouTypeSearchEvent(this.rootElement, this.endpoint, searchEvent, this.sendToCloud);
    };
    LiveAnalyticsClient.prototype.pushClickEvent = function (actionCause, metaObject, result, element) {
        var _this = this;
        var event = this.buildClickEvent(actionCause, metaObject, result, element);
        this.checkToSendAnyPendingSearchAsYouType(actionCause);
        this.triggerChangeAnalyticsCustomData('ClickEvent', metaObject, event, { resultData: result });
        Assert_1.Assert.isNonEmptyString(event.searchQueryUid);
        Assert_1.Assert.isNonEmptyString(event.collectionName);
        Assert_1.Assert.isNonEmptyString(event.sourceName);
        Assert_1.Assert.isNumber(event.documentPosition);
        Defer_1.Defer.defer(function () {
            if (_this.sendToCloud) {
                _this.endpoint.sendDocumentViewEvent(event);
            }
            Dom_1.$$(_this.rootElement).trigger(AnalyticsEvents_1.AnalyticsEvents.documentViewEvent, {
                documentViewEvent: APIAnalyticsBuilder_1.APIAnalyticsBuilder.convertDocumentViewToAPI(event)
            });
        });
    };
    LiveAnalyticsClient.prototype.buildAnalyticsEvent = function (actionCause, metaObject) {
        return {
            actionCause: actionCause.name,
            actionType: actionCause.type,
            username: this.userId,
            userDisplayName: this.userDisplayName,
            anonymous: this.anonymous,
            device: this.device,
            mobile: this.mobile,
            language: this.language,
            responseTime: undefined,
            originLevel1: this.originLevel1,
            originLevel2: this.getOriginLevel2(this.rootElement),
            originLevel3: document.referrer,
            originContext: this.originContext,
            customData: _.keys(metaObject).length > 0 ? metaObject : undefined,
            userAgent: navigator.userAgent
        };
    };
    LiveAnalyticsClient.prototype.buildSearchEvent = function (actionCause, metaObject) {
        return this.merge(this.buildAnalyticsEvent(actionCause, metaObject), {
            searchQueryUid: undefined,
            pipeline: undefined,
            splitTestRunName: this.splitTestRunName,
            splitTestRunVersion: this.splitTestRunVersion,
            queryText: undefined,
            advancedQuery: undefined,
            results: undefined,
            resultsPerPage: undefined,
            pageNumber: undefined,
            didYouMean: undefined,
            facets: undefined,
            contextual: this.isContextual
        });
    };
    LiveAnalyticsClient.prototype.buildClickEvent = function (actionCause, metaObject, result, element) {
        return this.merge(this.buildAnalyticsEvent(actionCause, metaObject), {
            searchQueryUid: result.queryUid,
            queryPipeline: result.pipeline,
            splitTestRunName: this.splitTestRunName || result.splitTestRun,
            splitTestRunVersion: this.splitTestRunVersion || (result.splitTestRun != undefined ? result.pipeline : undefined),
            documentUri: result.uri,
            documentUriHash: QueryUtils_1.QueryUtils.getUriHash(result),
            documentUrl: result.clickUri,
            documentTitle: result.title,
            documentCategory: QueryUtils_1.QueryUtils.getObjectType(result),
            originLevel2: this.getOriginLevel2(element),
            collectionName: QueryUtils_1.QueryUtils.getCollection(result),
            sourceName: QueryUtils_1.QueryUtils.getSource(result),
            documentPosition: result.index + 1,
            responseTime: 0,
            viewMethod: actionCause.name,
            rankingModifier: result.rankingModifier
        });
    };
    LiveAnalyticsClient.prototype.buildCustomEvent = function (actionCause, metaObject, element) {
        return this.merge(this.buildAnalyticsEvent(actionCause, metaObject), {
            eventType: actionCause.type,
            eventValue: actionCause.name,
            originLevel2: this.getOriginLevel2(element),
            responseTime: 0
        });
    };
    LiveAnalyticsClient.prototype.getOriginLevel2 = function (element) {
        return this.resolveActiveTabFromElement(element) || 'default';
    };
    LiveAnalyticsClient.prototype.buildMetaObject = function (meta, result) {
        var modifiedMeta = _.extend({}, meta);
        modifiedMeta['JSUIVersion'] = Version_1.version.lib + ';' + Version_1.version.product;
        if (result) {
            var uniqueId = QueryUtils_1.QueryUtils.getPermanentId(result);
            modifiedMeta['contentIDKey'] = uniqueId.fieldUsed;
            modifiedMeta['contentIDValue'] = uniqueId.fieldValue;
        }
        return modifiedMeta;
    };
    LiveAnalyticsClient.prototype.cancelAnyPendingSearchAsYouTypeEvent = function () {
        if (this.pendingSearchAsYouTypeSearchEvent) {
            this.pendingSearchAsYouTypeSearchEvent.cancel();
            this.pendingSearchAsYouTypeSearchEvent = undefined;
        }
    };
    LiveAnalyticsClient.prototype.resolveActiveTabFromElement = function (element) {
        Assert_1.Assert.exists(element);
        var queryStateModel = this.resolveQueryStateModel(element);
        return (queryStateModel && queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.t));
    };
    LiveAnalyticsClient.prototype.resolveQueryStateModel = function (rootElement) {
        return Component_1.Component.resolveBinding(rootElement, QueryStateModel_1.QueryStateModel);
    };
    LiveAnalyticsClient.prototype.eventIsNotRelatedToSearchbox = function (event) {
        return event !== AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit.name && event !== AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxClear.name;
    };
    LiveAnalyticsClient.prototype.triggerChangeAnalyticsCustomData = function (type, metaObject, event, data) {
        // This is for backward compatibility. Before the analytics were using either numbered
        // metas in `metaDataAsNumber` of later on named metas in `metaDataAsString`. Thus we still
        // provide those properties in a deprecated way. Below we are moving any data that put
        // in them to the root.
        metaObject['metaDataAsString'] = {};
        metaObject['metaDataAsNumber'] = {};
        var changeableAnalyticsDataObject = {
            language: event.language,
            originLevel1: event.originLevel1,
            originLevel2: event.originLevel2,
            originLevel3: event.originLevel3,
            metaObject: metaObject
        };
        var args = _.extend({}, {
            type: type,
            actionType: event.actionType,
            actionCause: event.actionCause
        }, changeableAnalyticsDataObject, data);
        Dom_1.$$(this.rootElement).trigger(AnalyticsEvents_1.AnalyticsEvents.changeAnalyticsCustomData, args);
        event.language = args.language;
        event.originLevel1 = args.originLevel1;
        event.originLevel2 = args.originLevel2;
        event.originLevel3 = args.originLevel3;
        event.customData = metaObject;
        // This is for backward compatibility. Before the analytics were using either numbered
        // metas in `metaDataAsNumber` of later on named metas in `metaDataAsString`. We are now putting
        // them all at the root, and if I encounter the older properties I move them to the top
        // level after issuing a warning.
        var metaDataAsString = event.customData['metaDataAsString'];
        if (_.keys(metaDataAsString).length > 0) {
            this.logger.warn('Using deprecated \'metaDataAsString\' key to log custom analytics data. Custom meta should now be put at the root of the object.');
            _.extend(event.customData, metaDataAsString);
        }
        delete event.customData['metaDataAsString'];
        var metaDataAsNumber = event.customData['metaDataAsNumber'];
        if (_.keys(metaDataAsNumber).length > 0) {
            this.logger.warn('Using deprecated \'metaDataAsNumber\' key to log custom analytics data. Custom meta should now be put at the root of the object.');
            _.extend(event.customData, metaDataAsNumber);
        }
        delete event.customData['metaDataAsNumber'];
    };
    LiveAnalyticsClient.prototype.merge = function (first, second) {
        return _.extend({}, first, second);
    };
    return LiveAnalyticsClient;
}());
exports.LiveAnalyticsClient = LiveAnalyticsClient;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StringUtils_1 = __webpack_require__(18);
var ResponsiveComponents_1 = __webpack_require__(38);
var _ = __webpack_require__(0);
var TemplateConditionEvaluator = (function () {
    function TemplateConditionEvaluator() {
    }
    TemplateConditionEvaluator.getFieldFromString = function (text) {
        var fields = _.map(StringUtils_1.StringUtils.match(text, /(?:(?!\b@)@([a-z0-9]+(?:\.[a-z0-9]+)*\b))|\braw.([a-z0-9]+)|\braw\['([^']+)'\]|\braw\["([^"]+)"\]/gi), function (field) {
            return field[1] || field[2] || field[3] || field[4] || null;
        });
        return fields;
    };
    TemplateConditionEvaluator.evaluateCondition = function (condition, result, responsiveComponents) {
        if (responsiveComponents === void 0) { responsiveComponents = new ResponsiveComponents_1.ResponsiveComponents(); }
        var templateShouldBeLoaded = true;
        var fieldsInCondition = TemplateConditionEvaluator.getFieldFromString(condition);
        _.each(fieldsInCondition, function (fieldInCondition) {
            var matchingFieldValues = TemplateConditionEvaluator.evaluateMatchingFieldValues(fieldInCondition, condition);
            var fieldShouldNotBeNull = matchingFieldValues.length != 0 || TemplateConditionEvaluator.evaluateFieldShouldNotBeNull(fieldInCondition, condition);
            if (fieldShouldNotBeNull) {
                templateShouldBeLoaded = templateShouldBeLoaded && result.raw[fieldInCondition] != null;
            }
            if (templateShouldBeLoaded) {
                _.each(matchingFieldValues, function (fieldValue) {
                    templateShouldBeLoaded = templateShouldBeLoaded && result.raw[fieldInCondition].toLowerCase() == fieldValue.toLowerCase();
                });
            }
        });
        if (templateShouldBeLoaded) {
            if (TemplateConditionEvaluator.evaluateShouldUseSmallScreen(condition)) {
                templateShouldBeLoaded = templateShouldBeLoaded && responsiveComponents.isSmallScreenWidth();
            }
        }
        return templateShouldBeLoaded;
    };
    TemplateConditionEvaluator.evaluateMatchingFieldValues = function (field, condition) {
        var foundForCurrentField = [];
        // try to get the field value in the format raw.filetype == "YouTubeVideo"
        var firstRegexToGetValue = new RegExp("raw." + field + "\\s*=+\\s*[\"|']([a-zA-Z]+)[\"|']", 'gi');
        // try to get the field value in the format raw['filetype'] == "YouTubeVideo"
        var secondRegexToGetValue = new RegExp("raw[[\"|']" + field + "[\"|']]\\s*=+\\s*[\"|']([a-zA-Z]+)[\"|']", 'gi');
        var matches = StringUtils_1.StringUtils.match(condition, firstRegexToGetValue).concat(StringUtils_1.StringUtils.match(condition, secondRegexToGetValue));
        matches.forEach(function (match) {
            foundForCurrentField = foundForCurrentField.concat(match[1]);
        });
        return _.unique(foundForCurrentField);
    };
    TemplateConditionEvaluator.evaluateFieldShouldNotBeNull = function (field, condition) {
        var firstRegexToMatchNonNull = new RegExp("raw." + field + "\\s*!=\\s*(?=null|undefined)", 'gi');
        var secondRegexToMatchNonNull = new RegExp("raw[[\"|']" + field + "[\"|']]\\s*!=\\s*(?=null|undefined)", 'gi');
        return condition.match(firstRegexToMatchNonNull) != null || condition.match(secondRegexToMatchNonNull) != null;
    };
    TemplateConditionEvaluator.evaluateShouldUseSmallScreen = function (condition) {
        return condition.match(/Coveo\.DeviceUtils\.isSmallScreenWidth/gi);
    };
    return TemplateConditionEvaluator;
}());
exports.TemplateConditionEvaluator = TemplateConditionEvaluator;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var TemplateConditionEvaluator_1 = __webpack_require__(114);
var ComponentOptions_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var Initialization_1 = __webpack_require__(1);
var TemplateFromAScriptTag = (function () {
    function TemplateFromAScriptTag(template, scriptTag) {
        this.template = template;
        this.scriptTag = scriptTag;
        var condition = scriptTag.getAttribute('data-condition');
        if (condition != null) {
            // Allows to add quotes in data-condition on the templates
            condition = condition.toString().replace(/&quot;/g, '"');
            template.setConditionWithFallback(condition);
        }
        else {
            var parsedFieldsAttributes = this.parseFieldsAttributes();
            if (parsedFieldsAttributes && Utils_1.Utils.isNonEmptyArray(parsedFieldsAttributes)) {
                this.template.fieldsToMatch = parsedFieldsAttributes;
            }
        }
        this.template.layout = this.parseLayout();
        this.template.mobile = this.parseScreenSize('data-mobile');
        this.template.tablet = this.parseScreenSize('data-tablet');
        this.template.desktop = this.parseScreenSize('data-desktop');
        this.template.fields = TemplateConditionEvaluator_1.TemplateConditionEvaluator.getFieldFromString(scriptTag.innerHTML + " " + (condition ? condition : ''));
        this.template.role = scriptTag.getAttribute('data-role');
        this.template.addFields(TemplateConditionEvaluator_1.TemplateConditionEvaluator.getFieldFromString(scriptTag.innerHTML + ' ' + condition) || []);
        // Additional fields that might be specified directly on the script element
        var additionalFields = ComponentOptions_1.ComponentOptions.loadFieldsOption(scriptTag, 'fields', { includeInResults: true });
        if (additionalFields != null) {
            // remove the @
            this.template.addFields(_.map(additionalFields, function (field) { return field.substr(1); }));
        }
        // Additional fields that might be used to conditionally load the template when it's going to be rendered.
        this.template.addFields(_.map(this.template.fieldsToMatch, function (toMatch) {
            return toMatch.field;
        }));
        // Scan components in this template
        // return the fields needed for the content of this template
        var neededFieldsForComponents = _.chain(this.template.getComponentsInside(scriptTag.innerHTML))
            .map(function (component) {
            return Initialization_1.Initialization.getRegisteredFieldsComponentForQuery(component);
        })
            .flatten()
            .value();
        this.template.addFields(neededFieldsForComponents);
    }
    TemplateFromAScriptTag.prototype.toHtmlElement = function () {
        var script = Dom_1.$$('code');
        var condition = Dom_1.$$(this.scriptTag).getAttribute('data-condition');
        if (condition) {
            script.setAttribute('data-condition', condition);
        }
        script.setHtml(this.scriptTag.innerHTML);
        return script.el;
    };
    TemplateFromAScriptTag.prototype.parseFieldsAttributes = function () {
        var dataSet = this.scriptTag.dataset;
        return _.chain(dataSet)
            .map(function (value, key) {
            var match = key.match(/field([a-z0-9]*)/i);
            if (match) {
                var values = void 0;
                if (value != null && value != 'null' && value != '') {
                    values = value.split(',');
                }
                return {
                    field: match[1].toLowerCase(),
                    values: values
                };
            }
            else {
                return undefined;
            }
        })
            .compact()
            .value();
    };
    TemplateFromAScriptTag.prototype.parseScreenSize = function (attribute) {
        return Utils_1.Utils.parseBooleanIfNotUndefined(this.scriptTag.getAttribute(attribute));
    };
    TemplateFromAScriptTag.prototype.parseLayout = function () {
        var layout = this.scriptTag.getAttribute('data-layout');
        return layout;
    };
    TemplateFromAScriptTag.fromString = function (template, properties) {
        if (properties === void 0) { properties = {}; }
        var script = document.createElement('code');
        script.innerHTML = template;
        if (properties.condition != null) {
            script.setAttribute('data-condition', properties.condition);
        }
        if (properties.layout != null) {
            script.setAttribute('data-layout', properties.layout);
        }
        else {
            script.setAttribute('data-layout', 'list');
        }
        if (properties.mobile != null) {
            script.setAttribute('data-mobile', properties.mobile.toString());
        }
        if (properties.tablet != null) {
            script.setAttribute('data-tablet', properties.tablet.toString());
        }
        if (properties.desktop != null) {
            script.setAttribute('data-desktop', properties.desktop.toString());
        }
        if (properties.fieldsToMatch != null) {
            _.each(properties.fieldsToMatch, function (fieldToMatch) {
                if (fieldToMatch.values) {
                    script.setAttribute("data-field-" + fieldToMatch.field.toLowerCase(), fieldToMatch.values.join(','));
                }
                else {
                    script.setAttribute("data-field-" + fieldToMatch.field.toLowerCase(), null);
                }
            });
        }
        if (properties.role != null) {
            script.setAttribute('data-role', properties.role);
        }
        return script;
    };
    return TemplateFromAScriptTag;
}());
exports.TemplateFromAScriptTag = TemplateFromAScriptTag;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var Strings_1 = __webpack_require__(9);
var _ = __webpack_require__(0);
var EmailUtils = (function () {
    function EmailUtils() {
    }
    EmailUtils.splitSemicolonSeparatedListOfEmailAddresses = function (addresses) {
        var addressesAsList = addresses.split(/\s*;\s*/);
        return _.filter(addressesAsList, function (s) {
            return Utils_1.Utils.exists(s) && Utils_1.Utils.isNonEmptyString(Utils_1.Utils.trim(s));
        });
    };
    EmailUtils.emailAddressesToHyperlinks = function (addresses, companyDomain, me, lengthLimit, truncateName) {
        if (lengthLimit === void 0) { lengthLimit = 2; }
        if (truncateName === void 0) { truncateName = false; }
        addresses = _.filter(addresses, function (s) {
            return Utils_1.Utils.exists(s) && Utils_1.Utils.isNonEmptyString(Utils_1.Utils.trim(s));
        });
        var hyperlinks = _.map(addresses, function (item) {
            var emailArray = EmailUtils.parseEmail(item);
            var email = emailArray[1];
            var name = emailArray[0];
            if (Utils_1.Utils.exists(me) && email == me) {
                name = Strings_1.l('Me');
            }
            if (truncateName) {
                var split = name.split(' ');
                if (!Utils_1.Utils.isNullOrUndefined(split[1])) {
                    name = split[0] + ' ' + split[1].substring(0, 1) + '.';
                }
            }
            var domainIndex = email.indexOf('@') >= 0 ? email.indexOf('@') + 1 : 0;
            var domain = email.substr(domainIndex);
            if (Utils_1.Utils.exists(companyDomain) && domain != companyDomain) {
                name += ' (' + domain + ')';
            }
            return '<a title="' + item.replace(/'/g, '&quot;') + '" href="mailto:' + encodeURI(email) + '">' + name + '</a>';
        });
        var excess = hyperlinks.length - lengthLimit;
        var andOthers = excess > 0 ? EmailUtils.buildEmailAddressesAndOthers(_.last(hyperlinks, excess)) : '';
        return _.first(hyperlinks, lengthLimit).join(', ') + andOthers;
    };
    EmailUtils.buildEmailAddressesAndOthers = function (excessHyperLinks) {
        return '<span class="coveo-emails-excess-collapsed coveo-active" onclick="Coveo.TemplateHelpers.getHelper(\'excessEmailToggle\')(this);"> ' + Strings_1.l('AndOthers', excessHyperLinks.length.toString(), excessHyperLinks.length) + '</span>' +
            '<span class="coveo-emails-excess-expanded"> , ' + excessHyperLinks.join(' , ') + '</span>';
    };
    EmailUtils.parseEmail = function (email) {
        var name;
        var match = email.match(/^\s*(.*)\s+<(.*)>$/);
        if (match != null) {
            name = match[1];
            if (/^'.*'|'.*'$/.test(name)) {
                name = name.substr(1, name.length - 2);
            }
            email = match[2];
        }
        else {
            name = email;
            email = email;
        }
        return [name, email];
    };
    return EmailUtils;
}());
exports.EmailUtils = EmailUtils;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var HTMLUtils = (function () {
    function HTMLUtils() {
    }
    HTMLUtils.buildAttributeString = function (options) {
        var ret = [];
        _.each(options, function (val, key, obj) {
            if (val != undefined) {
                ret.push(key + '=' + JSON.stringify(val.toString()));
            }
        });
        return ret.join(' ');
    };
    return HTMLUtils;
}());
exports.HTMLUtils = HTMLUtils;
var AnchorUtils = (function () {
    function AnchorUtils() {
    }
    AnchorUtils.buildAnchor = function (href, options) {
        var text;
        if (!options || !options.text) {
            text = href;
        }
        else {
            text = options.text;
            options.text = undefined;
        }
        return "<a href='" + href + "' " + HTMLUtils.buildAttributeString(options) + ">" + text + "</a>";
    };
    return AnchorUtils;
}());
exports.AnchorUtils = AnchorUtils;
var ImageUtils = (function () {
    function ImageUtils() {
    }
    ImageUtils.buildImage = function (src, options) {
        var ret = '<img ';
        ret += src ? "src='" + src + "' " : '';
        ret += HTMLUtils.buildAttributeString(options) + '/>';
        return ret;
    };
    ImageUtils.selectImageFromResult = function (result) {
        return document.querySelector("img[data-coveo-uri-hash=" + result.raw['urihash'] + "]");
    };
    ImageUtils.buildImageWithDirectSrcAttribute = function (endpoint, result) {
        var image = new Image();
        var dataStreamUri = endpoint.getViewAsDatastreamUri(result.uniqueId, '$Thumbnail$', { contentType: 'image/png' });
        image.onload = function () {
            ImageUtils.selectImageFromResult(result).setAttribute('src', dataStreamUri);
        };
        image.src = dataStreamUri;
    };
    ImageUtils.buildImageWithBase64SrcAttribute = function (endpoint, result) {
        endpoint.getRawDataStream(result.uniqueId, '$Thumbnail$')
            .then(function (response) {
            var rawBinary = String.fromCharCode.apply(null, new Uint8Array(response));
            ImageUtils.selectImageFromResult(result).setAttribute('src', 'data:image/png;base64, ' + btoa(rawBinary));
        })
            .catch(function () {
            ImageUtils.selectImageFromResult(result).remove();
        });
    };
    ImageUtils.buildImageFromResult = function (result, endpoint, options) {
        options = options ? options : {};
        var img = ImageUtils.buildImage(undefined, _.extend(options, { 'data-coveo-uri-hash': result.raw['urihash'] }));
        if (endpoint.isJsonp()) {
            // For jsonp we can't GET/POST for binary data. We are limited to only setting the src attribute directly on the img.
            ImageUtils.buildImageWithDirectSrcAttribute(endpoint, result);
        }
        else {
            // Base 64 img allows us to GET/POST the image as raw binary, so that we can also pass the credential of the user
            // Useful for phonegap.
            ImageUtils.buildImageWithBase64SrcAttribute(endpoint, result);
        }
        return img;
    };
    return ImageUtils;
}());
exports.ImageUtils = ImageUtils;


/***/ }),
/* 118 */
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
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OS_NAME;
(function (OS_NAME) {
    OS_NAME[OS_NAME["WINDOWS"] = 0] = "WINDOWS";
    OS_NAME[OS_NAME["MACOSX"] = 1] = "MACOSX";
    OS_NAME[OS_NAME["UNIX"] = 2] = "UNIX";
    OS_NAME[OS_NAME["LINUX"] = 3] = "LINUX";
    OS_NAME[OS_NAME["UNKNOWN"] = 4] = "UNKNOWN";
})(OS_NAME = exports.OS_NAME || (exports.OS_NAME = {}));
var OSUtils = (function () {
    function OSUtils() {
    }
    OSUtils.get = function (nav) {
        if (nav === void 0) { nav = navigator; }
        var osName;
        if (nav.appVersion.indexOf('Win') != -1) {
            osName = OS_NAME.WINDOWS;
        }
        else if (nav.appVersion.indexOf('Mac') != -1) {
            osName = OS_NAME.MACOSX;
        }
        else if (nav.appVersion.indexOf('X11') != -1) {
            osName = OS_NAME.UNIX;
        }
        else if (nav.appVersion.indexOf('Linux') != -1) {
            osName = OS_NAME.LINUX;
        }
        else {
            osName = OS_NAME.UNKNOWN;
        }
        return osName;
    };
    return OSUtils;
}());
exports.OSUtils = OSUtils;


/***/ }),
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
__webpack_require__(217);
var QueryEvents_1 = __webpack_require__(10);
var InitializationEvents_1 = __webpack_require__(14);
var ResultListEvents_1 = __webpack_require__(29);
var HashUtils_1 = __webpack_require__(36);
var InitializationPlaceholder = (function () {
    function InitializationPlaceholder(root, options) {
        if (options === void 0) { options = {
            facet: true,
            searchbox: true,
            resultList: true,
            searchInterface: true
        }; }
        var _this = this;
        this.root = root;
        this.options = options;
        this.facetPlaceholder = "<div class=\"coveo-placeholder-title\"></div>\n    <div class=\"coveo-facet-placeholder-line\">\n      <div class=\"coveo-facet-placeholder-checkbox\"></div>\n      <div class=\"coveo-placeholder-text\"></div>\n    </div>\n    <div class=\"coveo-facet-placeholder-line\">\n      <div class=\"coveo-facet-placeholder-checkbox\"></div>\n      <div class=\"coveo-placeholder-text\"></div>\n    </div>\n    <div class=\"coveo-facet-placeholder-line\">\n      <div class=\"coveo-facet-placeholder-checkbox\"></div>\n      <div class=\"coveo-placeholder-text\"></div>\n    </div>\n    <div class=\"coveo-facet-placeholder-line\">\n      <div class=\"coveo-facet-placeholder-checkbox\"></div>\n      <div class=\"coveo-placeholder-text\"></div>\n    </div>\n    <div class=\"coveo-facet-placeholder-line\">\n      <div class=\"coveo-facet-placeholder-checkbox\"></div>\n      <div class=\"coveo-placeholder-text\"></div>\n    </div>";
        this.resultListPlaceholder = "<div class=\"coveo-result-frame coveo-placeholder-result\">\n  <div class=\"coveo-result-row\">\n    <div class=\"coveo-result-cell\" style=\"width:85px;text-align:center;\">\n      <div class=\"coveo-placeholder-icon\"></div>\n    </div>\n    <div class=\"coveo-result-cell\" style=\"padding-left:15px;\">\n      <div class=\"coveo-result-row\">\n        <div class=\"coveo-result-cell\">\n          <div class=\"coveo-placeholder-title\" style=\"width: 60%\"></div>\n        </div>\n        <div class=\"coveo-result-cell\" style=\"width:120px; text-align:right;\">\n          <div class=\"coveo-placeholder-text\" style=\"width: 80%\"></div>\n        </div>\n      </div>\n      <div class=\"coveo-result-row\">\n        <div class=\"coveo-result-cell\">\n          <div class=\"coveo-placeholder-text\" style=\"width: 70%\"></div>\n          <div class=\"coveo-placeholder-text\" style=\"width: 90%\"></div>\n          <div class=\"coveo-placeholder-text\" style=\"width: 60%\"></div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
        this.cardResultListPlaceholder = "<div class=\"coveo-card-layout coveo-placeholder-result CoveoResult\">\n  <div class=\"coveo-result-frame\">\n    <div class=\"coveo-result-row\" style=\"margin-bottom: 20px;\">\n      <div class=\"coveo-result-cell\" style=\"width: 32px; vertical-align: middle;\">\n        <div class=\"coveo-placeholder-icon-small\"></div>\n      </div>\n      <div class=\"coveo-result-cell\" style=\"text-align:left; padding-left: 10px; vertical-align: middle;\">\n        <div class=\"coveo-placeholder-title\" style=\"width: 60%\"></div>\n      </div>\n    </div>\n    <div class=\"coveo-result-row\" style=\"margin-bottom: 20px;\">\n      <div class=\"coveo-result-cell\">\n        <div class=\"coveo-placeholder-text\" style=\"width: 70%\"></div>\n        <div class=\"coveo-placeholder-text\" style=\"width: 90%\"></div>\n        <div class=\"coveo-placeholder-text\" style=\"width: 60%\"></div>\n      </div>\n      <div class=\"coveo-result-cell\">\n        <div class=\"coveo-placeholder-text\" style=\"width: 90%\"></div>\n        <div class=\"coveo-placeholder-text\" style=\"width: 70%\"></div>\n        <div class=\"coveo-placeholder-text\" style=\"width: 60%\"></div>\n      </div>\n    </div>\n    <div class=\"coveo-result-row\">\n      <div class=\"coveo-result-cell\">\n        <div class=\"coveo-placeholder-text\" style=\"width: 90%\"></div>\n          <div class=\"coveo-placeholder-text\" style=\"width: 100%\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n";
        if (options.searchInterface) {
            Dom_1.$$(this.root).addClass(InitializationPlaceholder.INITIALIZATION_CLASS);
        }
        if (options.facet) {
            this.createPlaceholderForFacets();
        }
        if (options.searchbox) {
            this.createPlaceholderSearchbox();
        }
        if (options.resultList) {
            this.createPlaceholderForResultList();
        }
        if (options.searchbox) {
            Dom_1.$$(this.root).one(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () {
                Dom_1.$$(_this.root).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS);
            });
        }
    }
    InitializationPlaceholder.prototype.createPlaceholderForFacets = function () {
        // Render an arbitrary number of placeholder facet.
        // Facets should become usable on the first deferredQuerySuccess
        var _this = this;
        var facetElements = Dom_1.$$(this.root).findAll('.CoveoFacet');
        facetElements = facetElements.concat(Dom_1.$$(this.root).findAll('.CoveoFacetRange'));
        facetElements = facetElements.concat(Dom_1.$$(this.root).findAll('.CoveoFacetSlider'));
        facetElements = facetElements.concat(Dom_1.$$(this.root).findAll('.CoveoHierarchicalFacet'));
        if (Utils_1.Utils.isNonEmptyArray(facetElements)) {
            var placeholders_1 = [];
            _.each(facetElements, function (facetElement) { return Dom_1.$$(facetElement).addClass(InitializationPlaceholder.INITIALIZATION_CLASS); });
            _.each(_.first(facetElements, InitializationPlaceholder.NUMBER_OF_FACETS), function (facetElement) {
                Dom_1.$$(facetElement).addClass('coveo-with-placeholder');
                var placeHolder = Dom_1.$$('div', { className: 'coveo-facet-placeholder' }, _this.facetPlaceholder);
                facetElement.appendChild(placeHolder.el);
                placeholders_1.push(placeHolder);
            });
            Dom_1.$$(this.root).one(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () {
                Dom_1.$$(_this.root).one(QueryEvents_1.QueryEvents.deferredQuerySuccess, function () {
                    _.each(placeholders_1, function (placeholder) { return placeholder.remove(); });
                    _.each(facetElements, function (facetElement) { return Dom_1.$$(facetElement).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS); });
                    _.each(facetElements, function (facetElement) { return Dom_1.$$(facetElement).removeClass('coveo-with-placeholder'); });
                });
            });
        }
    };
    InitializationPlaceholder.prototype.createPlaceholderSearchbox = function () {
        // Searchbox should be good/usable afterComponentsInitialization
        // Create a placeholder until we reach that event.
        var searchBoxElements = Dom_1.$$(this.root).findAll('.CoveoSearchbox');
        if (Utils_1.Utils.isNonEmptyArray(searchBoxElements)) {
            _.each(searchBoxElements, function (el) {
                Dom_1.$$(el).addClass(InitializationPlaceholder.INITIALIZATION_CLASS);
            });
            Dom_1.$$(this.root).one(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () {
                _.each(searchBoxElements, function (el) { return Dom_1.$$(el).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS); });
            });
        }
    };
    InitializationPlaceholder.prototype.createPlaceholderForResultList = function () {
        // Render an arbitrary number of placeholder in the first result list we find
        // When we get the first newResultDisplayedEvent, the result list should be usable.
        var resultListsElements = Dom_1.$$(this.root).findAll('.CoveoResultList');
        if (Utils_1.Utils.isNonEmptyArray(resultListsElements)) {
            _.each(resultListsElements, function (el) { return Dom_1.$$(el).addClass(InitializationPlaceholder.INITIALIZATION_CLASS); });
            var _a = this.determineResultListPlaceholder(resultListsElements), placeholderToUse_1 = _a.placeholderToUse, resultListToUse_1 = _a.resultListToUse, rootToUse_1 = _a.rootToUse;
            Dom_1.$$(resultListToUse_1).append(rootToUse_1);
            Dom_1.$$(resultListToUse_1).addClass('coveo-with-placeholder');
            _.times(InitializationPlaceholder.NUMBER_OF_RESULTS, function () {
                rootToUse_1.innerHTML += placeholderToUse_1;
            });
            var reset_1 = function () {
                Dom_1.$$(rootToUse_1).remove();
                _.each(resultListsElements, function (el) { return Dom_1.$$(el).removeClass(InitializationPlaceholder.INITIALIZATION_CLASS); });
                Dom_1.$$(resultListToUse_1).removeClass('coveo-with-placeholder');
            };
            Dom_1.$$(this.root).one(ResultListEvents_1.ResultListEvents.newResultDisplayed, function () { return reset_1(); });
            Dom_1.$$(this.root).one(QueryEvents_1.QueryEvents.queryError, function () { return reset_1(); });
            Dom_1.$$(this.root).one(QueryEvents_1.QueryEvents.noResults, function () { return reset_1(); });
        }
    };
    InitializationPlaceholder.prototype.determineResultListPlaceholder = function (resultListElements) {
        var currentLayout;
        if (this.options.layout) {
            currentLayout = this.options.layout;
        }
        else if (resultListElements.length > 1) {
            currentLayout = HashUtils_1.HashUtils.getValue('layout', HashUtils_1.HashUtils.getHash());
        }
        else {
            currentLayout = resultListElements[0].getAttribute('data-layout');
        }
        if (!currentLayout) {
            currentLayout = 'list';
        }
        if (resultListElements.length > 1) {
            var resultListElement = _.find(resultListElements, function (resultListElement) {
                return resultListElement.getAttribute('data-layout') == currentLayout;
            });
            if (!resultListElement) {
                // No data-layout default to list
                resultListElement = _.find(resultListElements, function (resultListElement) {
                    return resultListElement.getAttribute('data-layout') == null;
                });
            }
            if (!resultListElement) {
                // Last fallback
                resultListElement = _.first(resultListElements);
            }
            return {
                placeholderToUse: this.determinerResultListFromLayout(currentLayout),
                resultListToUse: resultListElement,
                rootToUse: this.determineRootFromLayout(currentLayout)
            };
        }
        else {
            return {
                placeholderToUse: this.determinerResultListFromLayout(currentLayout),
                resultListToUse: resultListElements[0],
                rootToUse: this.determineRootFromLayout(currentLayout)
            };
        }
    };
    InitializationPlaceholder.prototype.determinerResultListFromLayout = function (layout) {
        switch (layout) {
            case 'list':
                return this.resultListPlaceholder;
            case 'card':
                return this.cardResultListPlaceholder;
            default:
                return this.resultListPlaceholder;
        }
    };
    InitializationPlaceholder.prototype.determineRootFromLayout = function (layout) {
        switch (layout) {
            case 'list':
                return Dom_1.$$('div').el;
            case 'card':
                return Dom_1.$$('div', { className: 'coveo-result-list-container coveo-card-layout-container' }).el;
            default:
                return Dom_1.$$('div').el;
        }
    };
    return InitializationPlaceholder;
}());
InitializationPlaceholder.NUMBER_OF_FACETS = 3;
InitializationPlaceholder.NUMBER_OF_RESULTS = 10;
InitializationPlaceholder.INITIALIZATION_CLASS = 'coveo-during-initialization';
exports.InitializationPlaceholder = InitializationPlaceholder;


/***/ }),
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var analytics = __webpack_require__(102);
exports.analytics = analytics;
var SimpleAnalytics = __webpack_require__(231);
exports.SimpleAnalytics = SimpleAnalytics;
var history = __webpack_require__(103);
exports.history = history;
var donottrack = __webpack_require__(229);
exports.donottrack = donottrack;
var storage = __webpack_require__(104);
exports.storage = storage;


/***/ }),
/* 136 */
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
var LiveAnalyticsClient_1 = __webpack_require__(113);
var AnalyticsActionListMeta_1 = __webpack_require__(11);
var Component_1 = __webpack_require__(7);
var SearchInterface_1 = __webpack_require__(19);
var RecommendationAnalyticsClient = (function (_super) {
    __extends(RecommendationAnalyticsClient, _super);
    function RecommendationAnalyticsClient(endpoint, rootElement, userId, userDisplayName, anonymous, splitTestRunName, splitTestRunVersion, originLevel1, sendToCloud, bindings) {
        var _this = _super.call(this, endpoint, rootElement, userId, userDisplayName, anonymous, splitTestRunName, splitTestRunVersion, originLevel1, sendToCloud) || this;
        _this.endpoint = endpoint;
        _this.rootElement = rootElement;
        _this.userId = userId;
        _this.userDisplayName = userDisplayName;
        _this.anonymous = anonymous;
        _this.splitTestRunName = splitTestRunName;
        _this.splitTestRunVersion = splitTestRunVersion;
        _this.originLevel1 = originLevel1;
        _this.sendToCloud = sendToCloud;
        _this.bindings = bindings;
        _this.recommendation = _this.bindings.searchInterface;
        return _this;
    }
    RecommendationAnalyticsClient.prototype.logSearchEvent = function (actionCause, meta) {
        if (actionCause == AnalyticsActionListMeta_1.analyticsActionCauseList.interfaceLoad) {
            actionCause = AnalyticsActionListMeta_1.analyticsActionCauseList.recommendationInterfaceLoad;
        }
        _super.prototype.logSearchEvent.call(this, actionCause, meta);
    };
    RecommendationAnalyticsClient.prototype.logClickEvent = function (actionCause, meta, result, element) {
        if (actionCause == AnalyticsActionListMeta_1.analyticsActionCauseList.documentOpen) {
            actionCause = AnalyticsActionListMeta_1.analyticsActionCauseList.recommendationOpen;
        }
        _super.prototype.logClickEvent.call(this, actionCause, meta, result, element);
        if (this.recommendation.mainQuerySearchUID && this.recommendation.mainQueryPipeline != null) {
            // We log a second click associated with the main interface query to tell the analytics that the query was a success.
            var mainInterface = Component_1.Component.get(this.recommendation.options.mainSearchInterface, SearchInterface_1.SearchInterface);
            result.queryUid = this.recommendation.mainQuerySearchUID;
            result.pipeline = this.recommendation.mainQueryPipeline;
            mainInterface.usageAnalytics.logClickEvent(actionCause, meta, result, element);
        }
    };
    RecommendationAnalyticsClient.prototype.getOriginLevel2 = function (element) {
        return this.recommendation.getId();
    };
    return RecommendationAnalyticsClient;
}(LiveAnalyticsClient_1.LiveAnalyticsClient));
exports.RecommendationAnalyticsClient = RecommendationAnalyticsClient;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
if (!initCoveoJQuery()) {
    // Adding a check in case jQuery was added after the jsSearch
    // Since this event listener is registered before the Coveo.init call, JQuery should always be initiated before the Coveo.init call
    document.addEventListener('DOMContentLoaded', function () {
        initCoveoJQuery();
    });
}
function initCoveoJQuery() {
    if (!jQueryIsDefined()) {
        return false;
    }
    exports.jQueryInstance = getJQuery();
    if (window['Coveo'] == undefined) {
        window['Coveo'] = {};
    }
    if (window['Coveo']['$'] == undefined) {
        window['Coveo']['$'] = exports.jQueryInstance;
    }
    exports.jQueryInstance.fn.coveo = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var returnValue;
        this.each(function (index, element) {
            var returnValueForThisElement;
            if (_.isString(args[0])) {
                var token = args[0];
                returnValueForThisElement = Initialization_1.Initialization.dispatchNamedMethodCallOrComponentCreation(token, element, args.slice(1));
            }
            else {
                // Invoking with no method name is a shortcut for the 'get' method (from Component).
                returnValueForThisElement = Initialization_1.Initialization.dispatchNamedMethodCall('get', element, args);
            }
            // Keep only the first return value we encounter
            returnValue = returnValue || returnValueForThisElement;
        });
        return returnValue;
    };
    return true;
}
exports.initCoveoJQuery = initCoveoJQuery;
function jQueryIsDefined() {
    return jQueryDefinedOnWindow() || jQueryDefinedOnCoveoObject();
}
exports.jQueryIsDefined = jQueryIsDefined;
function jQueryDefinedOnCoveoObject() {
    return window['Coveo'] != undefined && window['Coveo']['$'] != undefined;
}
function jQueryDefinedOnWindow() {
    return window['$'] != undefined && window['$'].fn != undefined && window['$'].fn.jquery != undefined;
}
function getJQuery() {
    var jQueryInstance;
    if (window['$']) {
        jQueryInstance = window['$'];
    }
    else {
        jQueryInstance = window['Coveo']['$'];
    }
    return jQueryInstance;
}


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
exports.underscoreInstance = _;
setCoveoUnderscore();
function setCoveoUnderscore() {
    if (window['Coveo'] == undefined) {
        window['Coveo'] = {};
    }
    if (window['Coveo']['_'] == undefined) {
        window['Coveo']['_'] = _;
        exports.underscoreInstance = window['Coveo']['_'];
    }
}
window['_'] = _;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TemplateHelpers_1 = __webpack_require__(66);
var HighlightUtils_1 = __webpack_require__(42);
var DateUtils_1 = __webpack_require__(27);
var CurrencyUtils_1 = __webpack_require__(84);
var HtmlUtils_1 = __webpack_require__(117);
var Utils_1 = __webpack_require__(4);
var StringUtils_1 = __webpack_require__(18);
var TimeSpanUtils_1 = __webpack_require__(53);
var EmailUtils_1 = __webpack_require__(116);
var QueryUtils_1 = __webpack_require__(16);
var DeviceUtils_1 = __webpack_require__(17);
var TemplateCache_1 = __webpack_require__(44);
var Dom_1 = __webpack_require__(2);
var SearchEndpoint_1 = __webpack_require__(35);
var StreamHighlightUtils_1 = __webpack_require__(62);
var FacetUtils_1 = __webpack_require__(33);
var Globalize = __webpack_require__(22);
var _ = __webpack_require__(0);
var Component_1 = __webpack_require__(7);
var CoreHelpers = (function () {
    function CoreHelpers() {
    }
    /**
     * For backward compatibility reason, the "global" template helper should be available under the
     * coveo namespace.
     * @param scope
     */
    CoreHelpers.exportAllHelpersGlobally = function (scope) {
        _.each(TemplateHelpers_1.TemplateHelpers.getHelpers(), function (helper, name) {
            if (scope[name] == undefined) {
                scope[name] = helper;
            }
        });
    };
    return CoreHelpers;
}());
exports.CoreHelpers = CoreHelpers;
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('javascriptEncode', function (value) {
    return Utils_1.Utils.exists(value) ? StringUtils_1.StringUtils.javascriptEncode(value) : undefined;
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shorten', function (content, length, highlights, cssClass) {
    var strAndHoles = HighlightUtils_1.StringAndHoles.shortenString(content, length, '...');
    if (Utils_1.Utils.exists(highlights)) {
        return HighlightUtils_1.HighlightUtils.highlightString(strAndHoles.value, highlights, strAndHoles.holes, cssClass || 'highlight');
    }
    else {
        return strAndHoles.value;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shortenPath', function (content, length, highlights, cssClass) {
    var strAndHoles = HighlightUtils_1.StringAndHoles.shortenPath(content, length);
    if (Utils_1.Utils.exists(highlights)) {
        return HighlightUtils_1.HighlightUtils.highlightString(strAndHoles.value, highlights, strAndHoles.holes, cssClass || 'highlight');
    }
    else {
        return strAndHoles.value;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shortenUri', function (content, length, highlights, cssClass) {
    var strAndHoles = HighlightUtils_1.StringAndHoles.shortenUri(content, length);
    if (Utils_1.Utils.exists(highlights)) {
        return HighlightUtils_1.HighlightUtils.highlightString(strAndHoles.value, highlights, strAndHoles.holes, cssClass || 'highlight');
    }
    else {
        return strAndHoles.value;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlight', function (content, highlights, cssClass) {
    if (Utils_1.Utils.exists(content)) {
        if (Utils_1.Utils.exists(highlights)) {
            return HighlightUtils_1.HighlightUtils.highlightString(content, highlights, null, cssClass || 'highlight');
        }
        else {
            return content;
        }
    }
    else {
        return undefined;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightStreamText', function (content, termsToHighlight, phrasesToHighlight, opts) {
    if (termsToHighlight === void 0) { termsToHighlight = resolveTermsToHighlight(); }
    if (phrasesToHighlight === void 0) { phrasesToHighlight = resolvePhrasesToHighlight(); }
    if (Utils_1.Utils.exists(content) && Utils_1.Utils.exists(termsToHighlight) && Utils_1.Utils.exists(phrasesToHighlight)) {
        if (termsToHighlightAreDefined(termsToHighlight, phrasesToHighlight)) {
            return StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamText(content, termsToHighlight, phrasesToHighlight, opts);
        }
        else {
            return content;
        }
    }
    else {
        return undefined;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightStreamHTML', function (content, termsToHighlight, phrasesToHighlight, opts) {
    if (termsToHighlight === void 0) { termsToHighlight = resolveTermsToHighlight(); }
    if (phrasesToHighlight === void 0) { phrasesToHighlight = resolvePhrasesToHighlight(); }
    if (Utils_1.Utils.exists(content) && Utils_1.Utils.exists(termsToHighlight) && Utils_1.Utils.exists(phrasesToHighlight)) {
        if (termsToHighlightAreDefined(termsToHighlight, phrasesToHighlight)) {
            return StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamHTML(content, termsToHighlight, phrasesToHighlight, opts);
        }
        else {
            return content;
        }
    }
    else {
        return undefined;
    }
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('number', function (value, options) {
    var numberValue = Number(value);
    if (Utils_1.Utils.exists(value)) {
        if (_.isString(options)) {
            return StringUtils_1.StringUtils.htmlEncode(Globalize.format(numberValue, options));
        }
        else {
            return StringUtils_1.StringUtils.htmlEncode(numberValue.toString());
        }
    }
    else {
        return undefined;
    }
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('date', function (value, options) {
    return DateUtils_1.DateUtils.dateToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('time', function (value, options) {
    return DateUtils_1.DateUtils.timeToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('dateTime', function (value, options) {
    return DateUtils_1.DateUtils.dateTimeToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('emailDateTime', function (value, options) {
    var defaultOptions = {};
    defaultOptions.includeTimeIfThisWeek = true;
    var optionsToUse = _.extend(options, defaultOptions);
    return value ? DateUtils_1.DateUtils.dateTimeToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), optionsToUse) : undefined;
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('currency', function (value, options) {
    return CurrencyUtils_1.CurrencyUtils.currencyToString(value, options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('timeSpan', function (value, options) {
    if (options === void 0) { options = { isMilliseconds: false }; }
    return new TimeSpanUtils_1.TimeSpan(value, options.isMilliseconds).getHHMMSS();
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('email', function (value) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // support old arguments (value: any, companyDomain: string, me: string, lengthLimit = 2, truncateName = false)
    var companyDomain;
    var me;
    var lengthLimit;
    var truncateName;
    if (_.isObject(args[0])) {
        companyDomain = args[0]['companyDomain'];
        me = args[0]['me'];
        lengthLimit = args[0]['lengthLimit'];
        truncateName = args[0]['truncateName'];
    }
    else {
        companyDomain = args[0];
        me = args[1];
        lengthLimit = args[2];
        truncateName = args[3];
    }
    if (lengthLimit == undefined) {
        lengthLimit = 2;
    }
    if (truncateName == undefined) {
        truncateName = false;
    }
    if (_.isString(value)) {
        var listOfAddresses = EmailUtils_1.EmailUtils.splitSemicolonSeparatedListOfEmailAddresses(value);
        return EmailUtils_1.EmailUtils.emailAddressesToHyperlinks(listOfAddresses, companyDomain, me, lengthLimit, truncateName);
    }
    else if (_.isArray(value)) {
        return EmailUtils_1.EmailUtils.emailAddressesToHyperlinks(value, companyDomain, me, lengthLimit, truncateName);
    }
    else {
        return undefined;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('excessEmailToggle', function (target) {
    Dom_1.$$(target).removeClass('coveo-active');
    if (Dom_1.$$(target).hasClass('coveo-emails-excess-collapsed')) {
        _.each(Dom_1.$$(target).siblings('.coveo-emails-excess-expanded'), function (sibling) {
            Dom_1.$$(sibling).addClass('coveo-active');
        });
    }
    else if (Dom_1.$$(target).hasClass('coveo-hide-expanded')) {
        Dom_1.$$(target.parentElement).addClass('coveo-inactive');
        _.each(Dom_1.$$(target.parentElement).siblings('.coveo-emails-excess-collapsed'), function (sibling) {
            Dom_1.$$(sibling).addClass('coveo-active');
        });
    }
    return undefined;
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('anchor', function (href, options) {
    return HtmlUtils_1.AnchorUtils.buildAnchor(href, options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('image', function (src, options) {
    return HtmlUtils_1.ImageUtils.buildImage(src, options);
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('thumbnail', function (result, endpoint, options) {
    if (result === void 0) { result = resolveQueryResult(); }
    if (endpoint === void 0) { endpoint = 'default'; }
    if (QueryUtils_1.QueryUtils.hasThumbnail(result)) {
        return HtmlUtils_1.ImageUtils.buildImageFromResult(result, SearchEndpoint_1.SearchEndpoint.endpoints[endpoint], options);
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('fromFileTypeToIcon', function (result, options) {
    if (result === void 0) { result = resolveQueryResult(); }
    if (options === void 0) { options = {}; }
    var icon = Component_1.Component.getComponentRef('Icon');
    if (icon) {
        return icon.createIcon(result, options).outerHTML;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('attrEncode', function (value) {
    return ('' + value) /* Forces the conversion to string. */
        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
        .replace(/'/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('loadTemplates', function (templatesToLoad, once) {
    if (once === void 0) { once = true; }
    var ret = '';
    var data = resolveQueryResult();
    var atLeastOneWasLoaded = false;
    var toLoad = templatesToLoad;
    var defaultTmpl;
    _.each(templatesToLoad, function (value, key, obj) {
        if (value == 'default') {
            defaultTmpl = key;
        }
    });
    if (defaultTmpl != undefined) {
        toLoad = _.omit(templatesToLoad, defaultTmpl);
    }
    _.each(toLoad, function (condition, id, obj) {
        if (!atLeastOneWasLoaded || !once) {
            atLeastOneWasLoaded = atLeastOneWasLoaded || condition;
            ret += TemplateHelpers_1.TemplateHelpers.getHelper('loadTemplate')(id, condition, data);
        }
    });
    if (!atLeastOneWasLoaded && defaultTmpl != undefined) {
        ret += TemplateHelpers_1.TemplateHelpers.getHelper('loadTemplate')(defaultTmpl, true, data);
    }
    return ret;
});
var byteMeasure = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('size', function (value, options) {
    var size = parseInt(value, 10);
    var precision = (options != null && options.precision != null ? options.precision : 2);
    var base = (options != null && options.base != null ? options.base : 0);
    while (size > 1024 && base + 1 < byteMeasure.length) {
        size /= 1024;
        base++;
    }
    size = Math.floor(size * Math.pow(10, precision)) / Math.pow(10, precision);
    return size + ' ' + byteMeasure[base];
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('translatedCaption', function (value) {
    return FacetUtils_1.FacetUtils.tryToGetTranslatedCaption('@filetype', value);
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('loadTemplate', function (id, condition, data) {
    if (condition === void 0) { condition = true; }
    if (Utils_1.Utils.isNullOrUndefined(data)) {
        data = resolveQueryResult();
    }
    if (condition) {
        return TemplateCache_1.TemplateCache.getTemplate(id).instantiateToString(data, {
            checkCondition: false
        });
    }
    return '';
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('encodeCarriageReturn', function (data) {
    if (Utils_1.Utils.isNullOrUndefined(data)) {
        return undefined;
    }
    else {
        return StringUtils_1.StringUtils.encodeCarriageReturn(data);
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('isMobileDevice', function () {
    return DeviceUtils_1.DeviceUtils.isMobileDevice() ? DeviceUtils_1.DeviceUtils.getDeviceName() : null;
});
function resolveQueryResult() {
    var found;
    var resultList = Component_1.Component.getComponentRef('ResultList');
    if (resultList) {
        found = resultList.resultCurrentlyBeingRendered;
    }
    if (!found) {
        var quickview = Component_1.Component.getComponentRef('Quickview');
        if (quickview) {
            found = quickview.resultCurrentlyBeingRendered;
        }
    }
    return found;
}
function resolveTermsToHighlight() {
    var currentQueryResult = resolveQueryResult();
    if (currentQueryResult) {
        return currentQueryResult.termsToHighlight;
    }
}
function resolvePhrasesToHighlight() {
    var currentQueryResult = resolveQueryResult();
    if (currentQueryResult) {
        return currentQueryResult.phrasesToHighlight;
    }
}
function termsToHighlightAreDefined(termsToHighlight, phrasesToHighlight) {
    return Utils_1.Utils.isNonEmptyArray(_.keys(termsToHighlight)) || Utils_1.Utils.isNonEmptyArray(_.keys(phrasesToHighlight));
}


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
exports.fields = [
    'ytthumbnailurl'
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('YouTubeThumbnail', exports.fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var DomUtils_1 = __webpack_require__(41);
var PublicPathUtils = (function () {
    function PublicPathUtils() {
    }
    // Dynamically set the public path to load the chunks relative to the Coveo script
    // Fallback on last parsed script if document.currentScript is not available.
    PublicPathUtils.detectPublicPath = function () {
        if (!this.pathHasBeenConfigured) {
            var path = void 0;
            var currentScript = DomUtils_1.DomUtils.getCurrentScript();
            if (Utils_1.Utils.isNullOrUndefined(currentScript)) {
                var scripts = document.getElementsByTagName('script');
                path = this.parseScriptDirectoryPath(scripts[scripts.length - 1]);
            }
            else {
                var script = currentScript;
                path = this.parseScriptDirectoryPath(script);
            }
            __webpack_require__.p = path;
        }
    };
    PublicPathUtils.configureRessourceRoot = function (path) {
        this.pathHasBeenConfigured = true;
        __webpack_require__.p = path;
    };
    PublicPathUtils.reset = function () {
        this.pathHasBeenConfigured = false;
    };
    PublicPathUtils.parseScriptDirectoryPath = function (script) {
        return script.src.replace(/\/[\w\.-]*\.js((#|\?)(.*)){0,1}$/, '/');
    };
    return PublicPathUtils;
}());
PublicPathUtils.pathHasBeenConfigured = false;
exports.PublicPathUtils = PublicPathUtils;


/***/ }),
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

/*! globalize - v0.1.1 - 2013-04-30
* https://github.com/jquery/globalize
* Copyright 2013 ; Licensed MIT */
var Globalize = (function(e,r){var t,n,a,s,u,l,i,c,o,f,d,p,h,g,b,m,y,M,v,k,z,F,A,x;t=function(e){return new t.prototype.init(e)}, true?module.exports=t:e.Globalize=t,t.cultures={},t.prototype={constructor:t,init:function(e){return this.cultures=t.cultures,this.cultureSelector=e,this}},t.prototype.init.prototype=t.prototype,t.cultures["default"]={name:"en",englishName:"English",nativeName:"English",isRTL:!1,language:"en",numberFormat:{pattern:["-n"],decimals:2,",":",",".":".",groupSizes:[3],"+":"+","-":"-",NaN:"NaN",negativeInfinity:"-Infinity",positiveInfinity:"Infinity",percent:{pattern:["-n %","n %"],decimals:2,groupSizes:[3],",":",",".":".",symbol:"%"},currency:{pattern:["($n)","$n"],decimals:2,groupSizes:[3],",":",",".":".",symbol:"$"}},calendars:{standard:{name:"Gregorian_USEnglish","/":"/",":":":",firstDay:0,days:{names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],namesAbbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],namesShort:["Su","Mo","Tu","We","Th","Fr","Sa"]},months:{names:["January","February","March","April","May","June","July","August","September","October","November","December",""],namesAbbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""]},AM:["AM","am","AM"],PM:["PM","pm","PM"],eras:[{name:"A.D.",start:null,offset:0}],twoDigitYearMax:2029,patterns:{d:"M/d/yyyy",D:"dddd, MMMM dd, yyyy",t:"h:mm tt",T:"h:mm:ss tt",f:"dddd, MMMM dd, yyyy h:mm tt",F:"dddd, MMMM dd, yyyy h:mm:ss tt",M:"MMMM dd",Y:"yyyy MMMM",S:"yyyy'-'MM'-'dd'T'HH':'mm':'ss"}}},messages:{}},t.cultures["default"].calendar=t.cultures["default"].calendars.standard,t.cultures.en=t.cultures["default"],t.cultureSelector="en",n=/^0x[a-f0-9]+$/i,a=/^[+\-]?infinity$/i,s=/^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/,u=/^\s+|\s+$/g,l=function(e,r){if(e.indexOf)return e.indexOf(r);for(var t=0,n=e.length;n>t;t++)if(e[t]===r)return t;return-1},i=function(e,r){return e.substr(e.length-r.length)===r},c=function(){var e,t,n,a,s,u,l=arguments[0]||{},i=1,p=arguments.length,h=!1;for("boolean"==typeof l&&(h=l,l=arguments[1]||{},i=2),"object"==typeof l||f(l)||(l={});p>i;i++)if(null!=(e=arguments[i]))for(t in e)n=l[t],a=e[t],l!==a&&(h&&a&&(d(a)||(s=o(a)))?(s?(s=!1,u=n&&o(n)?n:[]):u=n&&d(n)?n:{},l[t]=c(h,u,a)):a!==r&&(l[t]=a));return l},o=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},f=function(e){return"[object Function]"===Object.prototype.toString.call(e)},d=function(e){return"[object Object]"===Object.prototype.toString.call(e)},p=function(e,r){return 0===e.indexOf(r)},h=function(e){return(e+"").replace(u,"")},g=function(e){return isNaN(e)?0/0:Math[0>e?"ceil":"floor"](e)},b=function(e,r,t){var n;for(n=e.length;r>n;n+=1)e=t?"0"+e:e+"0";return e},m=function(e,r){for(var t=0,n=!1,a=0,s=e.length;s>a;a++){var u=e.charAt(a);switch(u){case"'":n?r.push("'"):t++,n=!1;break;case"\\":n&&r.push("\\"),n=!n;break;default:r.push(u),n=!1}}return t},y=function(e,r){r=r||"F";var t,n=e.patterns,a=r.length;if(1===a){if(t=n[r],!t)throw"Invalid date format string '"+r+"'.";r=t}else 2===a&&"%"===r.charAt(0)&&(r=r.charAt(1));return r},M=function(e,r,t){function n(e,r){var t,n=e+"";return r>1&&r>n.length?(t=v[r-2]+n,t.substr(t.length-r,r)):t=n}function a(){return h||g?h:(h=A.test(r),g=!0,h)}function s(e,r){if(b)return b[r];switch(r){case 0:return e.getFullYear();case 1:return e.getMonth();case 2:return e.getDate();default:throw"Invalid part value "+r}}var u,l=t.calendar,i=l.convert;if(!r||!r.length||"i"===r){if(t&&t.name.length)if(i)u=M(e,l.patterns.F,t);else{var c=new Date(e.getTime()),o=z(e,l.eras);c.setFullYear(F(e,l,o)),u=c.toLocaleString()}else u=""+e;return u}var f=l.eras,d="s"===r;r=y(l,r),u=[];var p,h,g,b,v=["0","00","000"],A=/([^d]|^)(d|dd)([^d]|$)/g,x=0,I=k();for(!d&&i&&(b=i.fromGregorian(e));;){var S=I.lastIndex,w=I.exec(r),C=r.slice(S,w?w.index:r.length);if(x+=m(C,u),!w)break;if(x%2)u.push(w[0]);else{var D=w[0],H=D.length;switch(D){case"ddd":case"dddd":var O=3===H?l.days.namesAbbr:l.days.names;u.push(O[e.getDay()]);break;case"d":case"dd":h=!0,u.push(n(s(e,2),H));break;case"MMM":case"MMMM":var N=s(e,1);u.push(l.monthsGenitive&&a()?l.monthsGenitive[3===H?"namesAbbr":"names"][N]:l.months[3===H?"namesAbbr":"names"][N]);break;case"M":case"MM":u.push(n(s(e,1)+1,H));break;case"y":case"yy":case"yyyy":N=b?b[0]:F(e,l,z(e,f),d),4>H&&(N%=100),u.push(n(N,H));break;case"h":case"hh":p=e.getHours()%12,0===p&&(p=12),u.push(n(p,H));break;case"H":case"HH":u.push(n(e.getHours(),H));break;case"m":case"mm":u.push(n(e.getMinutes(),H));break;case"s":case"ss":u.push(n(e.getSeconds(),H));break;case"t":case"tt":N=12>e.getHours()?l.AM?l.AM[0]:" ":l.PM?l.PM[0]:" ",u.push(1===H?N.charAt(0):N);break;case"f":case"ff":case"fff":u.push(n(e.getMilliseconds(),3).substr(0,H));break;case"z":case"zz":p=e.getTimezoneOffset()/60,u.push((0>=p?"+":"-")+n(Math.floor(Math.abs(p)),H));break;case"zzz":p=e.getTimezoneOffset()/60,u.push((0>=p?"+":"-")+n(Math.floor(Math.abs(p)),2)+":"+n(Math.abs(e.getTimezoneOffset()%60),2));break;case"g":case"gg":l.eras&&u.push(l.eras[z(e,f)].name);break;case"/":u.push(l["/"]);break;default:throw"Invalid date format pattern '"+D+"'."}}}return u.join("")},function(){var e;e=function(e,r,t){var n=t.groupSizes,a=n[0],s=1,u=Math.pow(10,r),l=Math.round(e*u)/u;isFinite(l)||(l=e),e=l;var i=e+"",c="",o=i.split(/e/i),f=o.length>1?parseInt(o[1],10):0;i=o[0],o=i.split("."),i=o[0],c=o.length>1?o[1]:"",f>0?(c=b(c,f,!1),i+=c.slice(0,f),c=c.substr(f)):0>f&&(f=-f,i=b(i,f+1,!0),c=i.slice(-f,i.length)+c,i=i.slice(0,-f)),c=r>0?t["."]+(c.length>r?c.slice(0,r):b(c,r)):"";for(var d=i.length-1,p=t[","],h="";d>=0;){if(0===a||a>d)return i.slice(0,d+1)+(h.length?p+h+c:c);h=i.slice(d-a+1,d+1)+(h.length?p+h:""),d-=a,n.length>s&&(a=n[s],s++)}return i.slice(0,d+1)+p+h+c},v=function(r,t,n){if(!isFinite(r))return 1/0===r?n.numberFormat.positiveInfinity:r===-1/0?n.numberFormat.negativeInfinity:n.numberFormat.NaN;if(!t||"i"===t)return n.name.length?r.toLocaleString():""+r;t=t||"D";var a,s=n.numberFormat,u=Math.abs(r),l=-1;t.length>1&&(l=parseInt(t.slice(1),10));var i,c=t.charAt(0).toUpperCase();switch(c){case"D":a="n",u=g(u),-1!==l&&(u=b(""+u,l,!0)),0>r&&(u="-"+u);break;case"N":i=s;case"C":i=i||s.currency;case"P":i=i||s.percent,a=0>r?i.pattern[0]:i.pattern[1]||"n",-1===l&&(l=i.decimals),u=e(u*("P"===c?100:1),l,i);break;default:throw"Bad number format specifier: "+c}for(var o=/n|\$|-|%/g,f="";;){var d=o.lastIndex,p=o.exec(a);if(f+=a.slice(d,p?p.index:a.length),!p)break;switch(p[0]){case"n":f+=u;break;case"$":f+=s.currency.symbol;break;case"-":/[1-9]/.test(u)&&(f+=s["-"]);break;case"%":f+=s.percent.symbol}}return f}}(),k=function(){return/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g},z=function(e,r){if(!r)return 0;for(var t,n=e.getTime(),a=0,s=r.length;s>a;a++)if(t=r[a].start,null===t||n>=t)return a;return 0},F=function(e,r,t,n){var a=e.getFullYear();return!n&&r.eras&&(a-=r.eras[t].offset),a},function(){var e,r,t,n,a,s,u;e=function(e,r){if(100>r){var t=new Date,n=z(t),a=F(t,e,n),s=e.twoDigitYearMax;s="string"==typeof s?(new Date).getFullYear()%100+parseInt(s,10):s,r+=a-a%100,r>s&&(r-=100)}return r},r=function(e,r,t){var n,a=e.days,i=e._upperDays;return i||(e._upperDays=i=[u(a.names),u(a.namesAbbr),u(a.namesShort)]),r=s(r),t?(n=l(i[1],r),-1===n&&(n=l(i[2],r))):n=l(i[0],r),n},t=function(e,r,t){var n=e.months,a=e.monthsGenitive||e.months,i=e._upperMonths,c=e._upperMonthsGen;i||(e._upperMonths=i=[u(n.names),u(n.namesAbbr)],e._upperMonthsGen=c=[u(a.names),u(a.namesAbbr)]),r=s(r);var o=l(t?i[1]:i[0],r);return 0>o&&(o=l(t?c[1]:c[0],r)),o},n=function(e,r){var t=e._parseRegExp;if(t){var n=t[r];if(n)return n}else e._parseRegExp=t={};for(var a,s=y(e,r).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g,"\\\\$1"),u=["^"],l=[],i=0,c=0,o=k();null!==(a=o.exec(s));){var f=s.slice(i,a.index);if(i=o.lastIndex,c+=m(f,u),c%2)u.push(a[0]);else{var d,p=a[0],h=p.length;switch(p){case"dddd":case"ddd":case"MMMM":case"MMM":case"gg":case"g":d="(\\D+)";break;case"tt":case"t":d="(\\D*)";break;case"yyyy":case"fff":case"ff":case"f":d="(\\d{"+h+"})";break;case"dd":case"d":case"MM":case"M":case"yy":case"y":case"HH":case"H":case"hh":case"h":case"mm":case"m":case"ss":case"s":d="(\\d\\d?)";break;case"zzz":d="([+-]?\\d\\d?:\\d{2})";break;case"zz":case"z":d="([+-]?\\d\\d?)";break;case"/":d="(\\/)";break;default:throw"Invalid date format pattern '"+p+"'."}d&&u.push(d),l.push(a[0])}}m(s.slice(i),u),u.push("$");var g=u.join("").replace(/\s+/g,"\\s+"),b={regExp:g,groups:l};return t[r]=b},a=function(e,r,t){return r>e||e>t},s=function(e){return e.split("\u00a0").join(" ").toUpperCase()},u=function(e){for(var r=[],t=0,n=e.length;n>t;t++)r[t]=s(e[t]);return r},A=function(s,u,l){s=h(s);var i=l.calendar,c=n(i,u),o=RegExp(c.regExp).exec(s);if(null===o)return null;for(var f,d=c.groups,g=null,b=null,m=null,y=null,M=null,v=0,k=0,z=0,F=0,A=null,x=!1,I=0,S=d.length;S>I;I++){var w=o[I+1];if(w){var C=d[I],D=C.length,H=parseInt(w,10);switch(C){case"dd":case"d":if(y=H,a(y,1,31))return null;break;case"MMM":case"MMMM":if(m=t(i,w,3===D),a(m,0,11))return null;break;case"M":case"MM":if(m=H-1,a(m,0,11))return null;break;case"y":case"yy":case"yyyy":if(b=4>D?e(i,H):H,a(b,0,9999))return null;break;case"h":case"hh":if(v=H,12===v&&(v=0),a(v,0,11))return null;break;case"H":case"HH":if(v=H,a(v,0,23))return null;break;case"m":case"mm":if(k=H,a(k,0,59))return null;break;case"s":case"ss":if(z=H,a(z,0,59))return null;break;case"tt":case"t":if(x=i.PM&&(w===i.PM[0]||w===i.PM[1]||w===i.PM[2]),!x&&(!i.AM||w!==i.AM[0]&&w!==i.AM[1]&&w!==i.AM[2]))return null;break;case"f":case"ff":case"fff":if(F=H*Math.pow(10,3-D),a(F,0,999))return null;break;case"ddd":case"dddd":if(M=r(i,w,3===D),a(M,0,6))return null;break;case"zzz":var O=w.split(/:/);if(2!==O.length)return null;if(f=parseInt(O[0],10),a(f,-12,13))return null;var N=parseInt(O[1],10);if(a(N,0,59))return null;A=60*f+(p(w,"-")?-N:N);break;case"z":case"zz":if(f=H,a(f,-12,13))return null;A=60*f;break;case"g":case"gg":var T=w;if(!T||!i.eras)return null;T=h(T.toLowerCase());for(var j=0,$=i.eras.length;$>j;j++)if(T===i.eras[j].name.toLowerCase()){g=j;break}if(null===g)return null}}}var P,G=new Date,E=i.convert;if(P=E?E.fromGregorian(G)[0]:G.getFullYear(),null===b?b=P:i.eras&&(b+=i.eras[g||0].offset),null===m&&(m=0),null===y&&(y=1),E){if(G=E.toGregorian(b,m,y),null===G)return null}else{if(G.setFullYear(b,m,y),G.getDate()!==y)return null;if(null!==M&&G.getDay()!==M)return null}if(x&&12>v&&(v+=12),G.setHours(v,k,z,F),null!==A){var Y=G.getMinutes()-(A+G.getTimezoneOffset());G.setHours(G.getHours()+parseInt(Y/60,10),Y%60)}return G}}(),x=function(e,r,t){var n,a=r["-"],s=r["+"];switch(t){case"n -":a=" "+a,s=" "+s;case"n-":i(e,a)?n=["-",e.substr(0,e.length-a.length)]:i(e,s)&&(n=["+",e.substr(0,e.length-s.length)]);break;case"- n":a+=" ",s+=" ";case"-n":p(e,a)?n=["-",e.substr(a.length)]:p(e,s)&&(n=["+",e.substr(s.length)]);break;case"(n)":p(e,"(")&&i(e,")")&&(n=["-",e.substr(1,e.length-2)])}return n||["",e]},t.prototype.findClosestCulture=function(e){return t.findClosestCulture.call(this,e)},t.prototype.format=function(e,r,n){return t.format.call(this,e,r,n)},t.prototype.localize=function(e,r){return t.localize.call(this,e,r)},t.prototype.parseInt=function(e,r,n){return t.parseInt.call(this,e,r,n)},t.prototype.parseFloat=function(e,r,n){return t.parseFloat.call(this,e,r,n)},t.prototype.culture=function(e){return t.culture.call(this,e)},t.addCultureInfo=function(e,r,t){var n={},a=!1;"string"!=typeof e?(t=e,e=this.culture().name,n=this.cultures[e]):"string"!=typeof r?(t=r,a=null==this.cultures[e],n=this.cultures[e]||this.cultures["default"]):(a=!0,n=this.cultures[r]),this.cultures[e]=c(!0,{},n,t),a&&(this.cultures[e].calendar=this.cultures[e].calendars.standard)},t.findClosestCulture=function(e){var r;if(!e)return this.findClosestCulture(this.cultureSelector)||this.cultures["default"];if("string"==typeof e&&(e=e.split(",")),o(e)){var t,n,a=this.cultures,s=e,u=s.length,l=[];for(n=0;u>n;n++){e=h(s[n]);var i,c=e.split(";");t=h(c[0]),1===c.length?i=1:(e=h(c[1]),0===e.indexOf("q=")?(e=e.substr(2),i=parseFloat(e),i=isNaN(i)?0:i):i=1),l.push({lang:t,pri:i})}for(l.sort(function(e,r){return e.pri<r.pri?1:e.pri>r.pri?-1:0}),n=0;u>n;n++)if(t=l[n].lang,r=a[t])return r;for(n=0;u>n;n++)for(t=l[n].lang;;){var f=t.lastIndexOf("-");if(-1===f)break;if(t=t.substr(0,f),r=a[t])return r}for(n=0;u>n;n++){t=l[n].lang;for(var d in a){var p=a[d];if(p.language===t)return p}}}else if("object"==typeof e)return e;return r||null},t.format=function(e,r,t){var n=this.findClosestCulture(t);return e instanceof Date?e=M(e,r,n):"number"==typeof e&&(e=v(e,r,n)),e},t.localize=function(e,r){return this.findClosestCulture(r).messages[e]||this.cultures["default"].messages[e]},t.parseDate=function(e,r,t){t=this.findClosestCulture(t);var n,a,s;if(r){if("string"==typeof r&&(r=[r]),r.length)for(var u=0,l=r.length;l>u;u++){var i=r[u];if(i&&(n=A(e,i,t)))break}}else{s=t.calendar.patterns;for(a in s)if(n=A(e,s[a],t))break}return n||null},t.parseInt=function(e,r,n){return g(t.parseFloat(e,r,n))},t.parseFloat=function(e,r,t){"number"!=typeof r&&(t=r,r=10);var u=this.findClosestCulture(t),l=0/0,i=u.numberFormat;if(e.indexOf(u.numberFormat.currency.symbol)>-1&&(e=e.replace(u.numberFormat.currency.symbol,""),e=e.replace(u.numberFormat.currency["."],u.numberFormat["."])),e.indexOf(u.numberFormat.percent.symbol)>-1&&(e=e.replace(u.numberFormat.percent.symbol,"")),e=e.replace(/ /g,""),a.test(e))l=parseFloat(e);else if(!r&&n.test(e))l=parseInt(e,16);else{var c=x(e,i,i.pattern[0]),o=c[0],f=c[1];""===o&&"(n)"!==i.pattern[0]&&(c=x(e,i,"(n)"),o=c[0],f=c[1]),""===o&&"-n"!==i.pattern[0]&&(c=x(e,i,"-n"),o=c[0],f=c[1]),o=o||"+";var d,p,h=f.indexOf("e");0>h&&(h=f.indexOf("E")),0>h?(p=f,d=null):(p=f.substr(0,h),d=f.substr(h+1));var g,b,m=i["."],y=p.indexOf(m);0>y?(g=p,b=null):(g=p.substr(0,y),b=p.substr(y+m.length));var M=i[","];g=g.split(M).join("");var v=M.replace(/\u00A0/g," ");M!==v&&(g=g.split(v).join(""));var k=o+g;if(null!==b&&(k+="."+b),null!==d){var z=x(d,i,"-n");k+="e"+(z[0]||"+")+z[1]}s.test(k)&&(l=parseFloat(k))}return l},t.culture=function(e){return e!==r&&(this.cultureSelector=e),this.findClosestCulture(e)||this.cultures["default"]}; return Globalize;}(this));

/***/ }),
/* 212 */
/***/ (function(module, exports) {

/*!
Copyright (C) 2013 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var
  // should be a not so common char
  // possibly one JSON does not encode
  // possibly one encodeURIComponent does not encode
  // right now this char is '~' but this might change in the future
  specialChar = '~',
  safeSpecialChar = '\\x' + (
    '0' + specialChar.charCodeAt(0).toString(16)
  ).slice(-2),
  escapedSafeSpecialChar = '\\' + safeSpecialChar,
  specialCharRG = new RegExp(safeSpecialChar, 'g'),
  safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g'),

  safeStartWithSpecialCharRG = new RegExp('(?:^|([^\\\\]))' + escapedSafeSpecialChar),

  indexOf = [].indexOf || function(v){
    for(var i=this.length;i--&&this[i]!==v;);
    return i;
  },
  $String = String  // there's no way to drop warnings in JSHint
                    // about new String ... well, I need that here!
                    // faked, and happy linter!
;

function generateReplacer(value, replacer, resolve) {
  var
    path = [],
    all  = [value],
    seen = [value],
    mapp = [resolve ? specialChar : '[Circular]'],
    last = value,
    lvl  = 1,
    i
  ;
  return function(key, value) {
    // the replacer has rights to decide
    // if a new object should be returned
    // or if there's some key to drop
    // let's call it here rather than "too late"
    if (replacer) value = replacer.call(this, key, value);

    // did you know ? Safari passes keys as integers for arrays
    // which means if (key) when key === 0 won't pass the check
    if (key !== '') {
      if (last !== this) {
        i = lvl - indexOf.call(all, this) - 1;
        lvl -= i;
        all.splice(lvl, all.length);
        path.splice(lvl - 1, path.length);
        last = this;
      }
      // console.log(lvl, key, path);
      if (typeof value === 'object' && value) {
    	// if object isn't referring to parent object, add to the
        // object path stack. Otherwise it is already there.
        if (indexOf.call(all, value) < 0) {
          all.push(last = value);
        }
        lvl = all.length;
        i = indexOf.call(seen, value);
        if (i < 0) {
          i = seen.push(value) - 1;
          if (resolve) {
            // key cannot contain specialChar but could be not a string
            path.push(('' + key).replace(specialCharRG, safeSpecialChar));
            mapp[i] = specialChar + path.join(specialChar);
          } else {
            mapp[i] = mapp[0];
          }
        } else {
          value = mapp[i];
        }
      } else {
        if (typeof value === 'string' && resolve) {
          // ensure no special char involved on deserialization
          // in this case only first char is important
          // no need to replace all value (better performance)
          value = value .replace(safeSpecialChar, escapedSafeSpecialChar)
                        .replace(specialChar, safeSpecialChar);
        }
      }
    }
    return value;
  };
}

function retrieveFromPath(current, keys) {
  for(var i = 0, length = keys.length; i < length; current = current[
    // keys should be normalized back here
    keys[i++].replace(safeSpecialCharRG, specialChar)
  ]);
  return current;
}

function generateReviver(reviver) {
  return function(key, value) {
    var isString = typeof value === 'string';
    if (isString && value.charAt(0) === specialChar) {
      return new $String(value.slice(1));
    }
    if (key === '') value = regenerate(value, value, {});
    // again, only one needed, do not use the RegExp for this replacement
    // only keys need the RegExp
    if (isString) value = value .replace(safeStartWithSpecialCharRG, '$1' + specialChar)
                                .replace(escapedSafeSpecialChar, safeSpecialChar);
    return reviver ? reviver.call(this, key, value) : value;
  };
}

function regenerateArray(root, current, retrieve) {
  for (var i = 0, length = current.length; i < length; i++) {
    current[i] = regenerate(root, current[i], retrieve);
  }
  return current;
}

function regenerateObject(root, current, retrieve) {
  for (var key in current) {
    if (current.hasOwnProperty(key)) {
      current[key] = regenerate(root, current[key], retrieve);
    }
  }
  return current;
}

function regenerate(root, current, retrieve) {
  return current instanceof Array ?
    // fast Array reconstruction
    regenerateArray(root, current, retrieve) :
    (
      current instanceof $String ?
        (
          // root is an empty string
          current.length ?
            (
              retrieve.hasOwnProperty(current) ?
                retrieve[current] :
                retrieve[current] = retrieveFromPath(
                  root, current.split(specialChar)
                )
            ) :
            root
        ) :
        (
          current instanceof Object ?
            // dedicated Object parser
            regenerateObject(root, current, retrieve) :
            // value as it is
            current
        )
    )
  ;
}

function stringifyRecursion(value, replacer, space, doNotResolve) {
  return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space);
}

function parseRecursion(text, reviver) {
  return JSON.parse(text, generateReviver(reviver));
}
this.stringify = stringifyRecursion;
this.parse = parseRecursion;

/***/ }),
/* 213 */
/***/ (function(module, exports) {

var Coveo;!function(e){var o;!function(e){function o(e,o){void 0===o&&(o={});var n=o.body||document.body;n.className?n.className.indexOf("coveo-modal-opened")==-1&&(n.className+=" coveo-modal-opened"):n.className="coveo-modal-opened";var s=document.createElement("div");s.className="coveo-modal-container coveo-opened ","small"==o.sizeMod&&(s.className+=" coveo-mod-small"),"big"==o.sizeMod&&(s.className+=" coveo-mod-big"),setTimeout(function(){s.className+=" coveo-mod-fade-in-scale"},0),n.appendChild(s),o.fullscreen===!0&&(s.className+=" coveo-fullscreen");var r=document.createElement("div");r.className="coveo-modal-backdrop coveo-modal-transparent",n.appendChild(r),setTimeout(function(){c(r,"coveo-modal-transparent")},0);var m=document.createElement("div");m.className="coveo-modal-content",s.appendChild(m);var i=function(e,a){void 0===e&&(e=0),void 0===a&&(a=!1);var t=null==o.validation||o.validation(e);if(t!==!1||a){s.parentElement&&s.parentElement.removeChild(s);var l=d.indexOf(i);return l>=0&&d.splice(l,1),null==n.querySelector(".coveo-modal-container")&&c(n,"coveo-modal-opened"),r.remove(),!0}return!1},v=a(o,i),u=v.header,p=v.closeIcon;m.appendChild(u),m.appendChild(t(o,e)),p.addEventListener("click",function(){i()}),r.addEventListener("click",function(){i()});var N=function(e){27==e.keyCode&&n.className.indexOf("coveo-modal-opened")!=-1&&(i(),document.removeEventListener("keyup",N))};document.addEventListener("keyup",N);var f,h=function(e,o){var n=document.createElement("button");n.className="coveo-btn",n.textContent=e,n.addEventListener("click",function(){return i(o)}),f.appendChild(n)};return null!=o.buttons&&(f=document.createElement("footer"),f.className="coveo-modal-footer",m.appendChild(f),o.buttons&l.OK&&h("Ok",l.OK),o.buttons&l.APPLY&&h("Apply",l.APPLY),o.buttons&l.YES&&h("Yes",l.YES),o.buttons&l.NO&&h("No",l.NO),o.buttons&l.CANCEL&&h("Cancel",l.CANCEL)),d.push(i),null!=o.className&&(s.className+=" "+o.className),{modalBox:s,wrapper:m,buttons:f,content:m,overlay:r,close:i}}function n(e){void 0===e&&(e=!1);for(var o=0;d.length>o;){var n=d[o](0,e);n||o++}}function a(e,o){var n=document.createElement("header");if(n.className="coveo-modal-header",null!=e.title){var a=document.createElement("h1");n.appendChild(a),a.innerHTML=e.title,e.titleClose===!0&&a.addEventListener("click",function(){return o()})}var t=document.createElement("span");t.className="coveo-small-close",n.appendChild(t);var c='<svg viewBox="0 0 22 22" class="coveo-icon coveo-fill-pure-white">\n                    <g transform="matrix(.7071-.7071.7071.7071-3.142 11)">\n                        <path d="m9-3.4h2v26.9h-2z"></path>\n                        <path d="m-3.4 9h26.9v2h-26.9z"></path>\n                    </g>\n                </svg>';return t.innerHTML=c,{header:n,closeIcon:t}}function t(e,o){var n=document.createElement("div");return n.className="coveo-modal-body coveo-mod-header-paddding coveo-mod-form-top-bottom-padding",n.appendChild(o),n}function c(e,o){e.className=e.className.replace(new RegExp("(^|\\s)"+o+"(\\s|\\b)","g"),"$1")}!function(e){e[e.OK=1]="OK",e[e.APPLY=2]="APPLY",e[e.YES=4]="YES",e[e.NO=8]="NO",e[e.CANCEL=16]="CANCEL"}(e.BUTTON||(e.BUTTON={}));var l=e.BUTTON,d=[];e.open=o,e.close=n}(o=e.ModalBox||(e.ModalBox={}))}(Coveo||(Coveo={}));

/*** EXPORTS FROM exports-loader ***/
module.exports = Coveo.ModalBox;

/***/ }),
/* 214 */
/***/ (function(module, exports) {

!function(){"use strict";var t,e,n="undefined",r="string",i=self.navigator,o=String,a=Object.prototype.hasOwnProperty,l={},u={},s=!1,f=!0,c=/^\s*application\/(?:vnd\.oftn\.|x-)?l10n\+json\s*(?:$|;)/i,p="locale",g="defaultLocale",h="toLocaleString",y="toLowerCase",v=Array.prototype.indexOf||function(t){for(var e=this.length,n=0;e>n;n++)if(n in this&&this[n]===t)return n;return-1},d=function(e){var n=new t;return n.open("GET",e,s),n.send(null),200!==n.status?(setTimeout(function(){var t=new Error("Unable to load localization data: "+e);throw t.name="Localization Error",t},0),{}):JSON.parse(n.responseText)},m=o[h]=function(t){if(arguments.length>0&&"number"!=typeof t)if(typeof t===r)m(d(t));else if(t===s)u={};else{var e,n,i;for(e in t)if(a.call(t,e)){if(n=t[e],e=e[y](),e in u&&n!==s||(u[e]={}),n===s)continue;if(typeof n===r){if(0!==o[p][y]().indexOf(e)){e in l||(l[e]=[]),l[e].push(n);continue}n=d(n)}for(i in n)a.call(n,i)&&(u[e][i]=n[i])}}return Function.prototype[h].apply(o,arguments)},w=function(t){for(var e,n=l[t],r=0,i=n.length;i>r;r++)e={},e[t]=d(n[r]),m(e);delete l[t]},b=o.prototype[h]=function(){var t,n=e,r=o[n?g:p],i=r[y]().split("-"),a=i.length,c=this.valueOf();e=s;do if(t=i.slice(0,a).join("-"),t in l&&w(t),t in u&&c in u[t])return u[t][c];while(a-->1);return!n&&o[g]?(e=f,b.call(c)):c};if(typeof XMLHttpRequest===n&&typeof ActiveXObject!==n){var L=ActiveXObject;t=function(){try{return new L("Msxml2.XMLHTTP.6.0")}catch(t){}try{return new L("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new L("Msxml2.XMLHTTP")}catch(n){}throw new Error("XMLHttpRequest not supported by this browser.")}}else t=XMLHttpRequest;if(o[g]=o[g]||"",o[p]=i&&(i.language||i.userLanguage)||"",typeof document!==n)for(var T,M=document.getElementsByTagName("link"),O=M.length;O--;){var X=M[O],x=(X.getAttribute("rel")||"")[y]().split(/\s+/);c.test(X.type)&&(-1!==v.call(x,"localizations")?m(X.getAttribute("href")):-1!==v.call(x,"localization")&&(T={},T[(X.getAttribute("hreflang")||"")[y]()]=X.getAttribute("href"),m(T)))}}();

/*** EXPORTS FROM exports-loader ***/
module.exports = window.String.toLocaleString;

/***/ }),
/* 215 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 216 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 217 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 218 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 219 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 220 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 221 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return FastClick;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root) {/*global exports, Intl*/
/**
 * This script gives you the zone info key representing your device's time zone setting.
 *
 * @name jsTimezoneDetect
 * @version 1.0.6
 * @author Jon Nylander
 * @license MIT License - https://bitbucket.org/pellepim/jstimezonedetect/src/default/LICENCE.txt
 *
 * For usage and examples, visit:
 * http://pellepim.bitbucket.org/jstz/
 *
 * Copyright (c) Jon Nylander
 */


/**
 * Namespace to hold all the code for timezone detection.
 */
var jstz = (function () {
    'use strict';
    var HEMISPHERE_SOUTH = 's',

        consts = {
            DAY: 86400000,
            HOUR: 3600000,
            MINUTE: 60000,
            SECOND: 1000,
            BASELINE_YEAR: 2014,
            MAX_SCORE: 864000000, // 10 days
            AMBIGUITIES: {
                'America/Denver':       ['America/Mazatlan'],
                'Europe/London':        ['Africa/Casablanca'],
                'America/Chicago':      ['America/Mexico_City'],
                'America/Asuncion':     ['America/Campo_Grande', 'America/Santiago'],
                'America/Montevideo':   ['America/Sao_Paulo', 'America/Santiago'],
                // Europe/Minsk should not be in this list... but Windows.
                'Asia/Beirut':          ['Asia/Amman', 'Asia/Jerusalem', 'Europe/Helsinki', 'Asia/Damascus', 'Africa/Cairo', 'Asia/Gaza', 'Europe/Minsk'],
                'Pacific/Auckland':     ['Pacific/Fiji'],
                'America/Los_Angeles':  ['America/Santa_Isabel'],
                'America/New_York':     ['America/Havana'],
                'America/Halifax':      ['America/Goose_Bay'],
                'America/Godthab':      ['America/Miquelon'],
                'Asia/Dubai':           ['Asia/Yerevan'],
                'Asia/Jakarta':         ['Asia/Krasnoyarsk'],
                'Asia/Shanghai':        ['Asia/Irkutsk', 'Australia/Perth'],
                'Australia/Sydney':     ['Australia/Lord_Howe'],
                'Asia/Tokyo':           ['Asia/Yakutsk'],
                'Asia/Dhaka':           ['Asia/Omsk'],
                // In the real world Yerevan is not ambigous for Baku... but Windows.
                'Asia/Baku':            ['Asia/Yerevan'],
                'Australia/Brisbane':   ['Asia/Vladivostok'],
                'Pacific/Noumea':       ['Asia/Vladivostok'],
                'Pacific/Majuro':       ['Asia/Kamchatka', 'Pacific/Fiji'],
                'Pacific/Tongatapu':    ['Pacific/Apia'],
                'Asia/Baghdad':         ['Europe/Minsk', 'Europe/Moscow'],
                'Asia/Karachi':         ['Asia/Yekaterinburg'],
                'Africa/Johannesburg':  ['Asia/Gaza', 'Africa/Cairo']
            }
        },

        /**
         * Gets the offset in minutes from UTC for a certain date.
         * @param {Date} date
         * @returns {Number}
         */
        get_date_offset = function get_date_offset(date) {
            var offset = -date.getTimezoneOffset();
            return (offset !== null ? offset : 0);
        },

        /**
         * This function does some basic calculations to create information about
         * the user's timezone. It uses REFERENCE_YEAR as a solid year for which
         * the script has been tested rather than depend on the year set by the
         * client device.
         *
         * Returns a key that can be used to do lookups in jstz.olson.timezones.
         * eg: "720,1,2".
         *
         * @returns {String}
         */
        lookup_key = function lookup_key() {
            var january_offset = get_date_offset(new Date(consts.BASELINE_YEAR, 0, 2)),
                june_offset = get_date_offset(new Date(consts.BASELINE_YEAR, 5, 2)),
                diff = january_offset - june_offset;

            if (diff < 0) {
                return january_offset + ",1";
            } else if (diff > 0) {
                return june_offset + ",1," + HEMISPHERE_SOUTH;
            }

            return january_offset + ",0";
        },


        /**
         * Tries to get the time zone key directly from the operating system for those
         * environments that support the ECMAScript Internationalization API.
         */
        get_from_internationalization_api = function get_from_internationalization_api() {
            var format, timezone;
            if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat === "undefined") {
                return;
            }

            format = Intl.DateTimeFormat();

            if (typeof format === "undefined" || typeof format.resolvedOptions === "undefined") {
                return;
            }

            timezone = format.resolvedOptions().timeZone;

            if (timezone && (timezone.indexOf("/") > -1 || timezone === 'UTC')) {
                return timezone;
            }

        },

        /**
         * Starting point for getting all the DST rules for a specific year
         * for the current timezone (as described by the client system).
         *
         * Returns an object with start and end attributes, or false if no
         * DST rules were found for the year.
         *
         * @param year
         * @returns {Object} || {Boolean}
         */
        dst_dates = function dst_dates(year) {
            var yearstart = new Date(year, 0, 1, 0, 0, 1, 0).getTime();
            var yearend = new Date(year, 12, 31, 23, 59, 59).getTime();
            var current = yearstart;
            var offset = (new Date(current)).getTimezoneOffset();
            var dst_start = null;
            var dst_end = null;

            while (current < yearend - 86400000) {
                var dateToCheck = new Date(current);
                var dateToCheckOffset = dateToCheck.getTimezoneOffset();

                if (dateToCheckOffset !== offset) {
                    if (dateToCheckOffset < offset) {
                        dst_start = dateToCheck;
                    }
                    if (dateToCheckOffset > offset) {
                        dst_end = dateToCheck;
                    }
                    offset = dateToCheckOffset;
                }

                current += 86400000;
            }

            if (dst_start && dst_end) {
                return {
                    s: find_dst_fold(dst_start).getTime(),
                    e: find_dst_fold(dst_end).getTime()
                };
            }

            return false;
        },

        /**
         * Probably completely unnecessary function that recursively finds the
         * exact (to the second) time when a DST rule was changed.
         *
         * @param a_date - The candidate Date.
         * @param padding - integer specifying the padding to allow around the candidate
         *                  date for finding the fold.
         * @param iterator - integer specifying how many milliseconds to iterate while
         *                   searching for the fold.
         *
         * @returns {Date}
         */
        find_dst_fold = function find_dst_fold(a_date, padding, iterator) {
            if (typeof padding === 'undefined') {
                padding = consts.DAY;
                iterator = consts.HOUR;
            }

            var date_start = new Date(a_date.getTime() - padding).getTime();
            var date_end = a_date.getTime() + padding;
            var offset = new Date(date_start).getTimezoneOffset();

            var current = date_start;

            var dst_change = null;
            while (current < date_end - iterator) {
                var dateToCheck = new Date(current);
                var dateToCheckOffset = dateToCheck.getTimezoneOffset();

                if (dateToCheckOffset !== offset) {
                    dst_change = dateToCheck;
                    break;
                }
                current += iterator;
            }

            if (padding === consts.DAY) {
                return find_dst_fold(dst_change, consts.HOUR, consts.MINUTE);
            }

            if (padding === consts.HOUR) {
                return find_dst_fold(dst_change, consts.MINUTE, consts.SECOND);
            }

            return dst_change;
        },

        windows7_adaptations = function windows7_adaptions(rule_list, preliminary_timezone, score, sample) {
            if (score !== 'N/A') {
                return score;
            }
            if (preliminary_timezone === 'Asia/Beirut') {
                if (sample.name === 'Africa/Cairo') {
                    if (rule_list[6].s === 1398376800000 && rule_list[6].e === 1411678800000) {
                        return 0;
                    }
                }
                if (sample.name === 'Asia/Jerusalem') {
                    if (rule_list[6].s === 1395964800000 && rule_list[6].e === 1411858800000) {
                        return 0;
                }
            }
            } else if (preliminary_timezone === 'America/Santiago') {
                if (sample.name === 'America/Asuncion') {
                    if (rule_list[6].s === 1412481600000 && rule_list[6].e === 1397358000000) {
                        return 0;
                    }
                }
                if (sample.name === 'America/Campo_Grande') {
                    if (rule_list[6].s === 1413691200000 && rule_list[6].e === 1392519600000) {
                        return 0;
                    }
                }
            } else if (preliminary_timezone === 'America/Montevideo') {
                if (sample.name === 'America/Sao_Paulo') {
                    if (rule_list[6].s === 1413687600000 && rule_list[6].e === 1392516000000) {
                        return 0;
                    }
                }
            } else if (preliminary_timezone === 'Pacific/Auckland') {
                if (sample.name === 'Pacific/Fiji') {
                    if (rule_list[6].s === 1414245600000 && rule_list[6].e === 1396101600000) {
                        return 0;
                    }
                }
            }

            return score;
        },

        /**
         * Takes the DST rules for the current timezone, and proceeds to find matches
         * in the jstz.olson.dst_rules.zones array.
         *
         * Compares samples to the current timezone on a scoring basis.
         *
         * Candidates are ruled immediately if either the candidate or the current zone
         * has a DST rule where the other does not.
         *
         * Candidates are ruled out immediately if the current zone has a rule that is
         * outside the DST scope of the candidate.
         *
         * Candidates are included for scoring if the current zones rules fall within the
         * span of the samples rules.
         *
         * Low score is best, the score is calculated by summing up the differences in DST
         * rules and if the consts.MAX_SCORE is overreached the candidate is ruled out.
         *
         * Yah follow? :)
         *
         * @param rule_list
         * @param preliminary_timezone
         * @returns {*}
         */
        best_dst_match = function best_dst_match(rule_list, preliminary_timezone) {
            var score_sample = function score_sample(sample) {
                var score = 0;

                for (var j = 0; j < rule_list.length; j++) {

                    // Both sample and current time zone report DST during the year.
                    if (!!sample.rules[j] && !!rule_list[j]) {

                        // The current time zone's DST rules are inside the sample's. Include.
                        if (rule_list[j].s >= sample.rules[j].s && rule_list[j].e <= sample.rules[j].e) {
                            score = 0;
                            score += Math.abs(rule_list[j].s - sample.rules[j].s);
                            score += Math.abs(sample.rules[j].e - rule_list[j].e);

                        // The current time zone's DST rules are outside the sample's. Discard.
                        } else {
                            score = 'N/A';
                            break;
                        }

                        // The max score has been reached. Discard.
                        if (score > consts.MAX_SCORE) {
                            score = 'N/A';
                            break;
                        }
                    }
                }

                score = windows7_adaptations(rule_list, preliminary_timezone, score, sample);

                return score;
            };
            var scoreboard = {};
            var dst_zones = jstz.olson.dst_rules.zones;
            var dst_zones_length = dst_zones.length;
            var ambiguities = consts.AMBIGUITIES[preliminary_timezone];

            for (var i = 0; i < dst_zones_length; i++) {
                var sample = dst_zones[i];
                var score = score_sample(dst_zones[i]);

                if (score !== 'N/A') {
                    scoreboard[sample.name] = score;
                }
            }

            for (var tz in scoreboard) {
                if (scoreboard.hasOwnProperty(tz)) {
                    for (var j = 0; j < ambiguities.length; j++) {
                        if (ambiguities[j] === tz) {
                            return tz;
                        }
                    }
                }
            }

            return preliminary_timezone;
        },

        /**
         * Takes the preliminary_timezone as detected by lookup_key().
         *
         * Builds up the current timezones DST rules for the years defined
         * in the jstz.olson.dst_rules.years array.
         *
         * If there are no DST occurences for those years, immediately returns
         * the preliminary timezone. Otherwise proceeds and tries to solve
         * ambiguities.
         *
         * @param preliminary_timezone
         * @returns {String} timezone_name
         */
        get_by_dst = function get_by_dst(preliminary_timezone) {
            var get_rules = function get_rules() {
                var rule_list = [];
                for (var i = 0; i < jstz.olson.dst_rules.years.length; i++) {
                    var year_rules = dst_dates(jstz.olson.dst_rules.years[i]);
                    rule_list.push(year_rules);
                }
                return rule_list;
            };
            var check_has_dst = function check_has_dst(rules) {
                for (var i = 0; i < rules.length; i++) {
                    if (rules[i] !== false) {
                        return true;
                    }
                }
                return false;
            };
            var rules = get_rules();
            var has_dst = check_has_dst(rules);

            if (has_dst) {
                return best_dst_match(rules, preliminary_timezone);
            }

            return preliminary_timezone;
        },

        /**
         * Uses get_timezone_info() to formulate a key to use in the olson.timezones dictionary.
         *
         * Returns an object with one function ".name()"
         *
         * @returns Object
         */
        determine = function determine() {
            var preliminary_tz = get_from_internationalization_api();

            if (!preliminary_tz) {
                preliminary_tz = jstz.olson.timezones[lookup_key()];

                if (typeof consts.AMBIGUITIES[preliminary_tz] !== 'undefined') {
                    preliminary_tz = get_by_dst(preliminary_tz);
                }
            }

            return {
                name: function () {
                    return preliminary_tz;
                }
            };
        };

    return {
        determine: determine
    };
}());


jstz.olson = jstz.olson || {};

/**
 * The keys in this dictionary are comma separated as such:
 *
 * First the offset compared to UTC time in minutes.
 *
 * Then a flag which is 0 if the timezone does not take daylight savings into account and 1 if it
 * does.
 *
 * Thirdly an optional 's' signifies that the timezone is in the southern hemisphere,
 * only interesting for timezones with DST.
 *
 * The mapped arrays is used for constructing the jstz.TimeZone object from within
 * jstz.determine();
 */
jstz.olson.timezones = {
    '-720,0': 'Etc/GMT+12',
    '-660,0': 'Pacific/Pago_Pago',
    '-660,1,s': 'Pacific/Apia', // Why? Because windows... cry!
    '-600,1': 'America/Adak',
    '-600,0': 'Pacific/Honolulu',
    '-570,0': 'Pacific/Marquesas',
    '-540,0': 'Pacific/Gambier',
    '-540,1': 'America/Anchorage',
    '-480,1': 'America/Los_Angeles',
    '-480,0': 'Pacific/Pitcairn',
    '-420,0': 'America/Phoenix',
    '-420,1': 'America/Denver',
    '-360,0': 'America/Guatemala',
    '-360,1': 'America/Chicago',
    '-360,1,s': 'Pacific/Easter',
    '-300,0': 'America/Bogota',
    '-300,1': 'America/New_York',
    '-270,0': 'America/Caracas',
    '-240,1': 'America/Halifax',
    '-240,0': 'America/Santo_Domingo',
    '-240,1,s': 'America/Asuncion',
    '-210,1': 'America/St_Johns',
    '-180,1': 'America/Godthab',
    '-180,0': 'America/Argentina/Buenos_Aires',
    '-180,1,s': 'America/Montevideo',
    '-120,0': 'America/Noronha',
    '-120,1': 'America/Noronha',
    '-60,1': 'Atlantic/Azores',
    '-60,0': 'Atlantic/Cape_Verde',
    '0,0': 'UTC',
    '0,1': 'Europe/London',
    '60,1': 'Europe/Berlin',
    '60,0': 'Africa/Lagos',
    '60,1,s': 'Africa/Windhoek',
    '120,1': 'Asia/Beirut',
    '120,0': 'Africa/Johannesburg',
    '180,0': 'Asia/Baghdad',
    '180,1': 'Europe/Moscow',
    '210,1': 'Asia/Tehran',
    '240,0': 'Asia/Dubai',
    '240,1': 'Asia/Baku',
    '270,0': 'Asia/Kabul',
    '300,1': 'Asia/Yekaterinburg',
    '300,0': 'Asia/Karachi',
    '330,0': 'Asia/Kolkata',
    '345,0': 'Asia/Kathmandu',
    '360,0': 'Asia/Dhaka',
    '360,1': 'Asia/Omsk',
    '390,0': 'Asia/Rangoon',
    '420,1': 'Asia/Krasnoyarsk',
    '420,0': 'Asia/Jakarta',
    '480,0': 'Asia/Shanghai',
    '480,1': 'Asia/Irkutsk',
    '525,0': 'Australia/Eucla',
    '525,1,s': 'Australia/Eucla',
    '540,1': 'Asia/Yakutsk',
    '540,0': 'Asia/Tokyo',
    '570,0': 'Australia/Darwin',
    '570,1,s': 'Australia/Adelaide',
    '600,0': 'Australia/Brisbane',
    '600,1': 'Asia/Vladivostok',
    '600,1,s': 'Australia/Sydney',
    '630,1,s': 'Australia/Lord_Howe',
    '660,1': 'Asia/Kamchatka',
    '660,0': 'Pacific/Noumea',
    '690,0': 'Pacific/Norfolk',
    '720,1,s': 'Pacific/Auckland',
    '720,0': 'Pacific/Majuro',
    '765,1,s': 'Pacific/Chatham',
    '780,0': 'Pacific/Tongatapu',
    '780,1,s': 'Pacific/Apia',
    '840,0': 'Pacific/Kiritimati'
};

/* Build time: 2015-11-02 13:01:00Z Build by invoking python utilities/dst.py generate */
jstz.olson.dst_rules = {
    "years": [
        2008,
        2009,
        2010,
        2011,
        2012,
        2013,
        2014
    ],
    "zones": [
        {
            "name": "Africa/Cairo",
            "rules": [
                {
                    "e": 1219957200000,
                    "s": 1209074400000
                },
                {
                    "e": 1250802000000,
                    "s": 1240524000000
                },
                {
                    "e": 1285880400000,
                    "s": 1284069600000
                },
                false,
                false,
                false,
                {
                    "e": 1411678800000,
                    "s": 1406844000000
                }
            ]
        },
        {
            "name": "Africa/Casablanca",
            "rules": [
                {
                    "e": 1220223600000,
                    "s": 1212278400000
                },
                {
                    "e": 1250809200000,
                    "s": 1243814400000
                },
                {
                    "e": 1281222000000,
                    "s": 1272758400000
                },
                {
                    "e": 1312066800000,
                    "s": 1301788800000
                },
                {
                    "e": 1348970400000,
                    "s": 1345428000000
                },
                {
                    "e": 1382839200000,
                    "s": 1376100000000
                },
                {
                    "e": 1414288800000,
                    "s": 1406944800000
                }
            ]
        },
        {
            "name": "America/Asuncion",
            "rules": [
                {
                    "e": 1205031600000,
                    "s": 1224388800000
                },
                {
                    "e": 1236481200000,
                    "s": 1255838400000
                },
                {
                    "e": 1270954800000,
                    "s": 1286078400000
                },
                {
                    "e": 1302404400000,
                    "s": 1317528000000
                },
                {
                    "e": 1333854000000,
                    "s": 1349582400000
                },
                {
                    "e": 1364094000000,
                    "s": 1381032000000
                },
                {
                    "e": 1395543600000,
                    "s": 1412481600000
                }
            ]
        },
        {
            "name": "America/Campo_Grande",
            "rules": [
                {
                    "e": 1203217200000,
                    "s": 1224388800000
                },
                {
                    "e": 1234666800000,
                    "s": 1255838400000
                },
                {
                    "e": 1266721200000,
                    "s": 1287288000000
                },
                {
                    "e": 1298170800000,
                    "s": 1318737600000
                },
                {
                    "e": 1330225200000,
                    "s": 1350792000000
                },
                {
                    "e": 1361070000000,
                    "s": 1382241600000
                },
                {
                    "e": 1392519600000,
                    "s": 1413691200000
                }
            ]
        },
        {
            "name": "America/Goose_Bay",
            "rules": [
                {
                    "e": 1225594860000,
                    "s": 1205035260000
                },
                {
                    "e": 1257044460000,
                    "s": 1236484860000
                },
                {
                    "e": 1289098860000,
                    "s": 1268539260000
                },
                {
                    "e": 1320555600000,
                    "s": 1299988860000
                },
                {
                    "e": 1352005200000,
                    "s": 1331445600000
                },
                {
                    "e": 1383454800000,
                    "s": 1362895200000
                },
                {
                    "e": 1414904400000,
                    "s": 1394344800000
                }
            ]
        },
        {
            "name": "America/Havana",
            "rules": [
                {
                    "e": 1224997200000,
                    "s": 1205643600000
                },
                {
                    "e": 1256446800000,
                    "s": 1236488400000
                },
                {
                    "e": 1288501200000,
                    "s": 1268542800000
                },
                {
                    "e": 1321160400000,
                    "s": 1300597200000
                },
                {
                    "e": 1352005200000,
                    "s": 1333256400000
                },
                {
                    "e": 1383454800000,
                    "s": 1362891600000
                },
                {
                    "e": 1414904400000,
                    "s": 1394341200000
                }
            ]
        },
        {
            "name": "America/Mazatlan",
            "rules": [
                {
                    "e": 1225008000000,
                    "s": 1207472400000
                },
                {
                    "e": 1256457600000,
                    "s": 1238922000000
                },
                {
                    "e": 1288512000000,
                    "s": 1270371600000
                },
                {
                    "e": 1319961600000,
                    "s": 1301821200000
                },
                {
                    "e": 1351411200000,
                    "s": 1333270800000
                },
                {
                    "e": 1382860800000,
                    "s": 1365325200000
                },
                {
                    "e": 1414310400000,
                    "s": 1396774800000
                }
            ]
        },
        {
            "name": "America/Mexico_City",
            "rules": [
                {
                    "e": 1225004400000,
                    "s": 1207468800000
                },
                {
                    "e": 1256454000000,
                    "s": 1238918400000
                },
                {
                    "e": 1288508400000,
                    "s": 1270368000000
                },
                {
                    "e": 1319958000000,
                    "s": 1301817600000
                },
                {
                    "e": 1351407600000,
                    "s": 1333267200000
                },
                {
                    "e": 1382857200000,
                    "s": 1365321600000
                },
                {
                    "e": 1414306800000,
                    "s": 1396771200000
                }
            ]
        },
        {
            "name": "America/Miquelon",
            "rules": [
                {
                    "e": 1225598400000,
                    "s": 1205038800000
                },
                {
                    "e": 1257048000000,
                    "s": 1236488400000
                },
                {
                    "e": 1289102400000,
                    "s": 1268542800000
                },
                {
                    "e": 1320552000000,
                    "s": 1299992400000
                },
                {
                    "e": 1352001600000,
                    "s": 1331442000000
                },
                {
                    "e": 1383451200000,
                    "s": 1362891600000
                },
                {
                    "e": 1414900800000,
                    "s": 1394341200000
                }
            ]
        },
        {
            "name": "America/Santa_Isabel",
            "rules": [
                {
                    "e": 1225011600000,
                    "s": 1207476000000
                },
                {
                    "e": 1256461200000,
                    "s": 1238925600000
                },
                {
                    "e": 1288515600000,
                    "s": 1270375200000
                },
                {
                    "e": 1319965200000,
                    "s": 1301824800000
                },
                {
                    "e": 1351414800000,
                    "s": 1333274400000
                },
                {
                    "e": 1382864400000,
                    "s": 1365328800000
                },
                {
                    "e": 1414314000000,
                    "s": 1396778400000
                }
            ]
        },
        {
            "name": "America/Santiago",
            "rules": [
                {
                    "e": 1206846000000,
                    "s": 1223784000000
                },
                {
                    "e": 1237086000000,
                    "s": 1255233600000
                },
                {
                    "e": 1270350000000,
                    "s": 1286683200000
                },
                {
                    "e": 1304823600000,
                    "s": 1313899200000
                },
                {
                    "e": 1335668400000,
                    "s": 1346558400000
                },
                {
                    "e": 1367118000000,
                    "s": 1378612800000
                },
                {
                    "e": 1398567600000,
                    "s": 1410062400000
                }
            ]
        },
        {
            "name": "America/Sao_Paulo",
            "rules": [
                {
                    "e": 1203213600000,
                    "s": 1224385200000
                },
                {
                    "e": 1234663200000,
                    "s": 1255834800000
                },
                {
                    "e": 1266717600000,
                    "s": 1287284400000
                },
                {
                    "e": 1298167200000,
                    "s": 1318734000000
                },
                {
                    "e": 1330221600000,
                    "s": 1350788400000
                },
                {
                    "e": 1361066400000,
                    "s": 1382238000000
                },
                {
                    "e": 1392516000000,
                    "s": 1413687600000
                }
            ]
        },
        {
            "name": "Asia/Amman",
            "rules": [
                {
                    "e": 1225404000000,
                    "s": 1206655200000
                },
                {
                    "e": 1256853600000,
                    "s": 1238104800000
                },
                {
                    "e": 1288303200000,
                    "s": 1269554400000
                },
                {
                    "e": 1319752800000,
                    "s": 1301608800000
                },
                false,
                false,
                {
                    "e": 1414706400000,
                    "s": 1395957600000
                }
            ]
        },
        {
            "name": "Asia/Damascus",
            "rules": [
                {
                    "e": 1225486800000,
                    "s": 1207260000000
                },
                {
                    "e": 1256850000000,
                    "s": 1238104800000
                },
                {
                    "e": 1288299600000,
                    "s": 1270159200000
                },
                {
                    "e": 1319749200000,
                    "s": 1301608800000
                },
                {
                    "e": 1351198800000,
                    "s": 1333058400000
                },
                {
                    "e": 1382648400000,
                    "s": 1364508000000
                },
                {
                    "e": 1414702800000,
                    "s": 1395957600000
                }
            ]
        },
        {
            "name": "Asia/Dubai",
            "rules": [
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Asia/Gaza",
            "rules": [
                {
                    "e": 1219957200000,
                    "s": 1206655200000
                },
                {
                    "e": 1252015200000,
                    "s": 1238104800000
                },
                {
                    "e": 1281474000000,
                    "s": 1269640860000
                },
                {
                    "e": 1312146000000,
                    "s": 1301608860000
                },
                {
                    "e": 1348178400000,
                    "s": 1333058400000
                },
                {
                    "e": 1380229200000,
                    "s": 1364508000000
                },
                {
                    "e": 1414098000000,
                    "s": 1395957600000
                }
            ]
        },
        {
            "name": "Asia/Irkutsk",
            "rules": [
                {
                    "e": 1224957600000,
                    "s": 1206813600000
                },
                {
                    "e": 1256407200000,
                    "s": 1238263200000
                },
                {
                    "e": 1288461600000,
                    "s": 1269712800000
                },
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Asia/Jerusalem",
            "rules": [
                {
                    "e": 1223161200000,
                    "s": 1206662400000
                },
                {
                    "e": 1254006000000,
                    "s": 1238112000000
                },
                {
                    "e": 1284246000000,
                    "s": 1269561600000
                },
                {
                    "e": 1317510000000,
                    "s": 1301616000000
                },
                {
                    "e": 1348354800000,
                    "s": 1333065600000
                },
                {
                    "e": 1382828400000,
                    "s": 1364515200000
                },
                {
                    "e": 1414278000000,
                    "s": 1395964800000
                }
            ]
        },
        {
            "name": "Asia/Kamchatka",
            "rules": [
                {
                    "e": 1224943200000,
                    "s": 1206799200000
                },
                {
                    "e": 1256392800000,
                    "s": 1238248800000
                },
                {
                    "e": 1288450800000,
                    "s": 1269698400000
                },
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Asia/Krasnoyarsk",
            "rules": [
                {
                    "e": 1224961200000,
                    "s": 1206817200000
                },
                {
                    "e": 1256410800000,
                    "s": 1238266800000
                },
                {
                    "e": 1288465200000,
                    "s": 1269716400000
                },
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Asia/Omsk",
            "rules": [
                {
                    "e": 1224964800000,
                    "s": 1206820800000
                },
                {
                    "e": 1256414400000,
                    "s": 1238270400000
                },
                {
                    "e": 1288468800000,
                    "s": 1269720000000
                },
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Asia/Vladivostok",
            "rules": [
                {
                    "e": 1224950400000,
                    "s": 1206806400000
                },
                {
                    "e": 1256400000000,
                    "s": 1238256000000
                },
                {
                    "e": 1288454400000,
                    "s": 1269705600000
                },
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Asia/Yakutsk",
            "rules": [
                {
                    "e": 1224954000000,
                    "s": 1206810000000
                },
                {
                    "e": 1256403600000,
                    "s": 1238259600000
                },
                {
                    "e": 1288458000000,
                    "s": 1269709200000
                },
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Asia/Yekaterinburg",
            "rules": [
                {
                    "e": 1224968400000,
                    "s": 1206824400000
                },
                {
                    "e": 1256418000000,
                    "s": 1238274000000
                },
                {
                    "e": 1288472400000,
                    "s": 1269723600000
                },
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Asia/Yerevan",
            "rules": [
                {
                    "e": 1224972000000,
                    "s": 1206828000000
                },
                {
                    "e": 1256421600000,
                    "s": 1238277600000
                },
                {
                    "e": 1288476000000,
                    "s": 1269727200000
                },
                {
                    "e": 1319925600000,
                    "s": 1301176800000
                },
                false,
                false,
                false
            ]
        },
        {
            "name": "Australia/Lord_Howe",
            "rules": [
                {
                    "e": 1207407600000,
                    "s": 1223134200000
                },
                {
                    "e": 1238857200000,
                    "s": 1254583800000
                },
                {
                    "e": 1270306800000,
                    "s": 1286033400000
                },
                {
                    "e": 1301756400000,
                    "s": 1317483000000
                },
                {
                    "e": 1333206000000,
                    "s": 1349537400000
                },
                {
                    "e": 1365260400000,
                    "s": 1380987000000
                },
                {
                    "e": 1396710000000,
                    "s": 1412436600000
                }
            ]
        },
        {
            "name": "Australia/Perth",
            "rules": [
                {
                    "e": 1206813600000,
                    "s": 1224957600000
                },
                false,
                false,
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Europe/Helsinki",
            "rules": [
                {
                    "e": 1224982800000,
                    "s": 1206838800000
                },
                {
                    "e": 1256432400000,
                    "s": 1238288400000
                },
                {
                    "e": 1288486800000,
                    "s": 1269738000000
                },
                {
                    "e": 1319936400000,
                    "s": 1301187600000
                },
                {
                    "e": 1351386000000,
                    "s": 1332637200000
                },
                {
                    "e": 1382835600000,
                    "s": 1364691600000
                },
                {
                    "e": 1414285200000,
                    "s": 1396141200000
                }
            ]
        },
        {
            "name": "Europe/Minsk",
            "rules": [
                {
                    "e": 1224979200000,
                    "s": 1206835200000
                },
                {
                    "e": 1256428800000,
                    "s": 1238284800000
                },
                {
                    "e": 1288483200000,
                    "s": 1269734400000
                },
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Europe/Moscow",
            "rules": [
                {
                    "e": 1224975600000,
                    "s": 1206831600000
                },
                {
                    "e": 1256425200000,
                    "s": 1238281200000
                },
                {
                    "e": 1288479600000,
                    "s": 1269730800000
                },
                false,
                false,
                false,
                false
            ]
        },
        {
            "name": "Pacific/Apia",
            "rules": [
                false,
                false,
                false,
                {
                    "e": 1301752800000,
                    "s": 1316872800000
                },
                {
                    "e": 1333202400000,
                    "s": 1348927200000
                },
                {
                    "e": 1365256800000,
                    "s": 1380376800000
                },
                {
                    "e": 1396706400000,
                    "s": 1411826400000
                }
            ]
        },
        {
            "name": "Pacific/Fiji",
            "rules": [
                false,
                false,
                {
                    "e": 1269698400000,
                    "s": 1287842400000
                },
                {
                    "e": 1327154400000,
                    "s": 1319292000000
                },
                {
                    "e": 1358604000000,
                    "s": 1350741600000
                },
                {
                    "e": 1390050000000,
                    "s": 1382796000000
                },
                {
                    "e": 1421503200000,
                    "s": 1414850400000
                }
            ]
        },
        {
            "name": "Europe/London",
            "rules": [
                {
                    "e": 1224982800000,
                    "s": 1206838800000
                },
                {
                    "e": 1256432400000,
                    "s": 1238288400000
                },
                {
                    "e": 1288486800000,
                    "s": 1269738000000
                },
                {
                    "e": 1319936400000,
                    "s": 1301187600000
                },
                {
                    "e": 1351386000000,
                    "s": 1332637200000
                },
                {
                    "e": 1382835600000,
                    "s": 1364691600000
                },
                {
                    "e": 1414285200000,
                    "s": 1396141200000
                }
            ]
        }
    ]
};
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = jstz;
} else if (("function" !== 'undefined' && __webpack_require__(266) !== null) && (__webpack_require__(267) != null)) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
        return jstz;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
    if (typeof root === 'undefined') {
        window.jstz = jstz;
    } else {
        root.jstz = jstz;
    }
}
}());


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // running in browser
    root.latinize = factory();
  }
})(this, function() {

  function latinize(str) {
    if (typeof str === 'string') {
      return str.replace(/[^A-Za-z0-9]/g, function(x) {
        return latinize.characters[x] || x;
      });
    } else {
      return str;
    }
  }

  latinize.characters = {
    'Á': 'A',
    'Ă': 'A',
    'Ắ': 'A',
    'Ặ': 'A',
    'Ằ': 'A',
    'Ẳ': 'A',
    'Ẵ': 'A',
    'Ǎ': 'A',
    'Â': 'A',
    'Ấ': 'A',
    'Ậ': 'A',
    'Ầ': 'A',
    'Ẩ': 'A',
    'Ẫ': 'A',
    'Ä': 'A',
    'Ǟ': 'A',
    'Ȧ': 'A',
    'Ǡ': 'A',
    'Ạ': 'A',
    'Ȁ': 'A',
    'À': 'A',
    'Ả': 'A',
    'Ȃ': 'A',
    'Ā': 'A',
    'Ą': 'A',
    'Å': 'A',
    'Ǻ': 'A',
    'Ḁ': 'A',
    'Ⱥ': 'A',
    'Ã': 'A',
    'Ꜳ': 'AA',
    'Æ': 'AE',
    'Ǽ': 'AE',
    'Ǣ': 'AE',
    'Ꜵ': 'AO',
    'Ꜷ': 'AU',
    'Ꜹ': 'AV',
    'Ꜻ': 'AV',
    'Ꜽ': 'AY',
    'Ḃ': 'B',
    'Ḅ': 'B',
    'Ɓ': 'B',
    'Ḇ': 'B',
    'Ƀ': 'B',
    'Ƃ': 'B',
    'Ć': 'C',
    'Č': 'C',
    'Ç': 'C',
    'Ḉ': 'C',
    'Ĉ': 'C',
    'Ċ': 'C',
    'Ƈ': 'C',
    'Ȼ': 'C',
    'Ď': 'D',
    'Ḑ': 'D',
    'Ḓ': 'D',
    'Ḋ': 'D',
    'Ḍ': 'D',
    'Ɗ': 'D',
    'Ḏ': 'D',
    'ǲ': 'D',
    'ǅ': 'D',
    'Đ': 'D',
    'Ƌ': 'D',
    'Ǳ': 'DZ',
    'Ǆ': 'DZ',
    'É': 'E',
    'Ĕ': 'E',
    'Ě': 'E',
    'Ȩ': 'E',
    'Ḝ': 'E',
    'Ê': 'E',
    'Ế': 'E',
    'Ệ': 'E',
    'Ề': 'E',
    'Ể': 'E',
    'Ễ': 'E',
    'Ḙ': 'E',
    'Ë': 'E',
    'Ė': 'E',
    'Ẹ': 'E',
    'Ȅ': 'E',
    'È': 'E',
    'Ẻ': 'E',
    'Ȇ': 'E',
    'Ē': 'E',
    'Ḗ': 'E',
    'Ḕ': 'E',
    'Ę': 'E',
    'Ɇ': 'E',
    'Ẽ': 'E',
    'Ḛ': 'E',
    'Ꝫ': 'ET',
    'Ḟ': 'F',
    'Ƒ': 'F',
    'Ǵ': 'G',
    'Ğ': 'G',
    'Ǧ': 'G',
    'Ģ': 'G',
    'Ĝ': 'G',
    'Ġ': 'G',
    'Ɠ': 'G',
    'Ḡ': 'G',
    'Ǥ': 'G',
    'Ḫ': 'H',
    'Ȟ': 'H',
    'Ḩ': 'H',
    'Ĥ': 'H',
    'Ⱨ': 'H',
    'Ḧ': 'H',
    'Ḣ': 'H',
    'Ḥ': 'H',
    'Ħ': 'H',
    'Í': 'I',
    'Ĭ': 'I',
    'Ǐ': 'I',
    'Î': 'I',
    'Ï': 'I',
    'Ḯ': 'I',
    'İ': 'I',
    'Ị': 'I',
    'Ȉ': 'I',
    'Ì': 'I',
    'Ỉ': 'I',
    'Ȋ': 'I',
    'Ī': 'I',
    'Į': 'I',
    'Ɨ': 'I',
    'Ĩ': 'I',
    'Ḭ': 'I',
    'Ꝺ': 'D',
    'Ꝼ': 'F',
    'Ᵹ': 'G',
    'Ꞃ': 'R',
    'Ꞅ': 'S',
    'Ꞇ': 'T',
    'Ꝭ': 'IS',
    'Ĵ': 'J',
    'Ɉ': 'J',
    'Ḱ': 'K',
    'Ǩ': 'K',
    'Ķ': 'K',
    'Ⱪ': 'K',
    'Ꝃ': 'K',
    'Ḳ': 'K',
    'Ƙ': 'K',
    'Ḵ': 'K',
    'Ꝁ': 'K',
    'Ꝅ': 'K',
    'Ĺ': 'L',
    'Ƚ': 'L',
    'Ľ': 'L',
    'Ļ': 'L',
    'Ḽ': 'L',
    'Ḷ': 'L',
    'Ḹ': 'L',
    'Ⱡ': 'L',
    'Ꝉ': 'L',
    'Ḻ': 'L',
    'Ŀ': 'L',
    'Ɫ': 'L',
    'ǈ': 'L',
    'Ł': 'L',
    'Ǉ': 'LJ',
    'Ḿ': 'M',
    'Ṁ': 'M',
    'Ṃ': 'M',
    'Ɱ': 'M',
    'Ń': 'N',
    'Ň': 'N',
    'Ņ': 'N',
    'Ṋ': 'N',
    'Ṅ': 'N',
    'Ṇ': 'N',
    'Ǹ': 'N',
    'Ɲ': 'N',
    'Ṉ': 'N',
    'Ƞ': 'N',
    'ǋ': 'N',
    'Ñ': 'N',
    'Ǌ': 'NJ',
    'Ó': 'O',
    'Ŏ': 'O',
    'Ǒ': 'O',
    'Ô': 'O',
    'Ố': 'O',
    'Ộ': 'O',
    'Ồ': 'O',
    'Ổ': 'O',
    'Ỗ': 'O',
    'Ö': 'O',
    'Ȫ': 'O',
    'Ȯ': 'O',
    'Ȱ': 'O',
    'Ọ': 'O',
    'Ő': 'O',
    'Ȍ': 'O',
    'Ò': 'O',
    'Ỏ': 'O',
    'Ơ': 'O',
    'Ớ': 'O',
    'Ợ': 'O',
    'Ờ': 'O',
    'Ở': 'O',
    'Ỡ': 'O',
    'Ȏ': 'O',
    'Ꝋ': 'O',
    'Ꝍ': 'O',
    'Ō': 'O',
    'Ṓ': 'O',
    'Ṑ': 'O',
    'Ɵ': 'O',
    'Ǫ': 'O',
    'Ǭ': 'O',
    'Ø': 'O',
    'Ǿ': 'O',
    'Õ': 'O',
    'Ṍ': 'O',
    'Ṏ': 'O',
    'Ȭ': 'O',
    'Ƣ': 'OI',
    'Ꝏ': 'OO',
    'Ɛ': 'E',
    'Ɔ': 'O',
    'Ȣ': 'OU',
    'Ṕ': 'P',
    'Ṗ': 'P',
    'Ꝓ': 'P',
    'Ƥ': 'P',
    'Ꝕ': 'P',
    'Ᵽ': 'P',
    'Ꝑ': 'P',
    'Ꝙ': 'Q',
    'Ꝗ': 'Q',
    'Ŕ': 'R',
    'Ř': 'R',
    'Ŗ': 'R',
    'Ṙ': 'R',
    'Ṛ': 'R',
    'Ṝ': 'R',
    'Ȑ': 'R',
    'Ȓ': 'R',
    'Ṟ': 'R',
    'Ɍ': 'R',
    'Ɽ': 'R',
    'Ꜿ': 'C',
    'Ǝ': 'E',
    'Ś': 'S',
    'Ṥ': 'S',
    'Š': 'S',
    'Ṧ': 'S',
    'Ş': 'S',
    'Ŝ': 'S',
    'Ș': 'S',
    'Ṡ': 'S',
    'Ṣ': 'S',
    'Ṩ': 'S',
    'ß': 'ss',
    'Ť': 'T',
    'Ţ': 'T',
    'Ṱ': 'T',
    'Ț': 'T',
    'Ⱦ': 'T',
    'Ṫ': 'T',
    'Ṭ': 'T',
    'Ƭ': 'T',
    'Ṯ': 'T',
    'Ʈ': 'T',
    'Ŧ': 'T',
    'Ɐ': 'A',
    'Ꞁ': 'L',
    'Ɯ': 'M',
    'Ʌ': 'V',
    'Ꜩ': 'TZ',
    'Ú': 'U',
    'Ŭ': 'U',
    'Ǔ': 'U',
    'Û': 'U',
    'Ṷ': 'U',
    'Ü': 'U',
    'Ǘ': 'U',
    'Ǚ': 'U',
    'Ǜ': 'U',
    'Ǖ': 'U',
    'Ṳ': 'U',
    'Ụ': 'U',
    'Ű': 'U',
    'Ȕ': 'U',
    'Ù': 'U',
    'Ủ': 'U',
    'Ư': 'U',
    'Ứ': 'U',
    'Ự': 'U',
    'Ừ': 'U',
    'Ử': 'U',
    'Ữ': 'U',
    'Ȗ': 'U',
    'Ū': 'U',
    'Ṻ': 'U',
    'Ų': 'U',
    'Ů': 'U',
    'Ũ': 'U',
    'Ṹ': 'U',
    'Ṵ': 'U',
    'Ꝟ': 'V',
    'Ṿ': 'V',
    'Ʋ': 'V',
    'Ṽ': 'V',
    'Ꝡ': 'VY',
    'Ẃ': 'W',
    'Ŵ': 'W',
    'Ẅ': 'W',
    'Ẇ': 'W',
    'Ẉ': 'W',
    'Ẁ': 'W',
    'Ⱳ': 'W',
    'Ẍ': 'X',
    'Ẋ': 'X',
    'Ý': 'Y',
    'Ŷ': 'Y',
    'Ÿ': 'Y',
    'Ẏ': 'Y',
    'Ỵ': 'Y',
    'Ỳ': 'Y',
    'Ƴ': 'Y',
    'Ỷ': 'Y',
    'Ỿ': 'Y',
    'Ȳ': 'Y',
    'Ɏ': 'Y',
    'Ỹ': 'Y',
    'Ź': 'Z',
    'Ž': 'Z',
    'Ẑ': 'Z',
    'Ⱬ': 'Z',
    'Ż': 'Z',
    'Ẓ': 'Z',
    'Ȥ': 'Z',
    'Ẕ': 'Z',
    'Ƶ': 'Z',
    'Ĳ': 'IJ',
    'Œ': 'OE',
    'ᴀ': 'A',
    'ᴁ': 'AE',
    'ʙ': 'B',
    'ᴃ': 'B',
    'ᴄ': 'C',
    'ᴅ': 'D',
    'ᴇ': 'E',
    'ꜰ': 'F',
    'ɢ': 'G',
    'ʛ': 'G',
    'ʜ': 'H',
    'ɪ': 'I',
    'ʁ': 'R',
    'ᴊ': 'J',
    'ᴋ': 'K',
    'ʟ': 'L',
    'ᴌ': 'L',
    'ᴍ': 'M',
    'ɴ': 'N',
    'ᴏ': 'O',
    'ɶ': 'OE',
    'ᴐ': 'O',
    'ᴕ': 'OU',
    'ᴘ': 'P',
    'ʀ': 'R',
    'ᴎ': 'N',
    'ᴙ': 'R',
    'ꜱ': 'S',
    'ᴛ': 'T',
    'ⱻ': 'E',
    'ᴚ': 'R',
    'ᴜ': 'U',
    'ᴠ': 'V',
    'ᴡ': 'W',
    'ʏ': 'Y',
    'ᴢ': 'Z',
    'á': 'a',
    'ă': 'a',
    'ắ': 'a',
    'ặ': 'a',
    'ằ': 'a',
    'ẳ': 'a',
    'ẵ': 'a',
    'ǎ': 'a',
    'â': 'a',
    'ấ': 'a',
    'ậ': 'a',
    'ầ': 'a',
    'ẩ': 'a',
    'ẫ': 'a',
    'ä': 'a',
    'ǟ': 'a',
    'ȧ': 'a',
    'ǡ': 'a',
    'ạ': 'a',
    'ȁ': 'a',
    'à': 'a',
    'ả': 'a',
    'ȃ': 'a',
    'ā': 'a',
    'ą': 'a',
    'ᶏ': 'a',
    'ẚ': 'a',
    'å': 'a',
    'ǻ': 'a',
    'ḁ': 'a',
    'ⱥ': 'a',
    'ã': 'a',
    'ꜳ': 'aa',
    'æ': 'ae',
    'ǽ': 'ae',
    'ǣ': 'ae',
    'ꜵ': 'ao',
    'ꜷ': 'au',
    'ꜹ': 'av',
    'ꜻ': 'av',
    'ꜽ': 'ay',
    'ḃ': 'b',
    'ḅ': 'b',
    'ɓ': 'b',
    'ḇ': 'b',
    'ᵬ': 'b',
    'ᶀ': 'b',
    'ƀ': 'b',
    'ƃ': 'b',
    'ɵ': 'o',
    'ć': 'c',
    'č': 'c',
    'ç': 'c',
    'ḉ': 'c',
    'ĉ': 'c',
    'ɕ': 'c',
    'ċ': 'c',
    'ƈ': 'c',
    'ȼ': 'c',
    'ď': 'd',
    'ḑ': 'd',
    'ḓ': 'd',
    'ȡ': 'd',
    'ḋ': 'd',
    'ḍ': 'd',
    'ɗ': 'd',
    'ᶑ': 'd',
    'ḏ': 'd',
    'ᵭ': 'd',
    'ᶁ': 'd',
    'đ': 'd',
    'ɖ': 'd',
    'ƌ': 'd',
    'ı': 'i',
    'ȷ': 'j',
    'ɟ': 'j',
    'ʄ': 'j',
    'ǳ': 'dz',
    'ǆ': 'dz',
    'é': 'e',
    'ĕ': 'e',
    'ě': 'e',
    'ȩ': 'e',
    'ḝ': 'e',
    'ê': 'e',
    'ế': 'e',
    'ệ': 'e',
    'ề': 'e',
    'ể': 'e',
    'ễ': 'e',
    'ḙ': 'e',
    'ë': 'e',
    'ė': 'e',
    'ẹ': 'e',
    'ȅ': 'e',
    'è': 'e',
    'ẻ': 'e',
    'ȇ': 'e',
    'ē': 'e',
    'ḗ': 'e',
    'ḕ': 'e',
    'ⱸ': 'e',
    'ę': 'e',
    'ᶒ': 'e',
    'ɇ': 'e',
    'ẽ': 'e',
    'ḛ': 'e',
    'ꝫ': 'et',
    'ḟ': 'f',
    'ƒ': 'f',
    'ᵮ': 'f',
    'ᶂ': 'f',
    'ǵ': 'g',
    'ğ': 'g',
    'ǧ': 'g',
    'ģ': 'g',
    'ĝ': 'g',
    'ġ': 'g',
    'ɠ': 'g',
    'ḡ': 'g',
    'ᶃ': 'g',
    'ǥ': 'g',
    'ḫ': 'h',
    'ȟ': 'h',
    'ḩ': 'h',
    'ĥ': 'h',
    'ⱨ': 'h',
    'ḧ': 'h',
    'ḣ': 'h',
    'ḥ': 'h',
    'ɦ': 'h',
    'ẖ': 'h',
    'ħ': 'h',
    'ƕ': 'hv',
    'í': 'i',
    'ĭ': 'i',
    'ǐ': 'i',
    'î': 'i',
    'ï': 'i',
    'ḯ': 'i',
    'ị': 'i',
    'ȉ': 'i',
    'ì': 'i',
    'ỉ': 'i',
    'ȋ': 'i',
    'ī': 'i',
    'į': 'i',
    'ᶖ': 'i',
    'ɨ': 'i',
    'ĩ': 'i',
    'ḭ': 'i',
    'ꝺ': 'd',
    'ꝼ': 'f',
    'ᵹ': 'g',
    'ꞃ': 'r',
    'ꞅ': 's',
    'ꞇ': 't',
    'ꝭ': 'is',
    'ǰ': 'j',
    'ĵ': 'j',
    'ʝ': 'j',
    'ɉ': 'j',
    'ḱ': 'k',
    'ǩ': 'k',
    'ķ': 'k',
    'ⱪ': 'k',
    'ꝃ': 'k',
    'ḳ': 'k',
    'ƙ': 'k',
    'ḵ': 'k',
    'ᶄ': 'k',
    'ꝁ': 'k',
    'ꝅ': 'k',
    'ĺ': 'l',
    'ƚ': 'l',
    'ɬ': 'l',
    'ľ': 'l',
    'ļ': 'l',
    'ḽ': 'l',
    'ȴ': 'l',
    'ḷ': 'l',
    'ḹ': 'l',
    'ⱡ': 'l',
    'ꝉ': 'l',
    'ḻ': 'l',
    'ŀ': 'l',
    'ɫ': 'l',
    'ᶅ': 'l',
    'ɭ': 'l',
    'ł': 'l',
    'ǉ': 'lj',
    'ſ': 's',
    'ẜ': 's',
    'ẛ': 's',
    'ẝ': 's',
    'ḿ': 'm',
    'ṁ': 'm',
    'ṃ': 'm',
    'ɱ': 'm',
    'ᵯ': 'm',
    'ᶆ': 'm',
    'ń': 'n',
    'ň': 'n',
    'ņ': 'n',
    'ṋ': 'n',
    'ȵ': 'n',
    'ṅ': 'n',
    'ṇ': 'n',
    'ǹ': 'n',
    'ɲ': 'n',
    'ṉ': 'n',
    'ƞ': 'n',
    'ᵰ': 'n',
    'ᶇ': 'n',
    'ɳ': 'n',
    'ñ': 'n',
    'ǌ': 'nj',
    'ó': 'o',
    'ŏ': 'o',
    'ǒ': 'o',
    'ô': 'o',
    'ố': 'o',
    'ộ': 'o',
    'ồ': 'o',
    'ổ': 'o',
    'ỗ': 'o',
    'ö': 'o',
    'ȫ': 'o',
    'ȯ': 'o',
    'ȱ': 'o',
    'ọ': 'o',
    'ő': 'o',
    'ȍ': 'o',
    'ò': 'o',
    'ỏ': 'o',
    'ơ': 'o',
    'ớ': 'o',
    'ợ': 'o',
    'ờ': 'o',
    'ở': 'o',
    'ỡ': 'o',
    'ȏ': 'o',
    'ꝋ': 'o',
    'ꝍ': 'o',
    'ⱺ': 'o',
    'ō': 'o',
    'ṓ': 'o',
    'ṑ': 'o',
    'ǫ': 'o',
    'ǭ': 'o',
    'ø': 'o',
    'ǿ': 'o',
    'õ': 'o',
    'ṍ': 'o',
    'ṏ': 'o',
    'ȭ': 'o',
    'ƣ': 'oi',
    'ꝏ': 'oo',
    'ɛ': 'e',
    'ᶓ': 'e',
    'ɔ': 'o',
    'ᶗ': 'o',
    'ȣ': 'ou',
    'ṕ': 'p',
    'ṗ': 'p',
    'ꝓ': 'p',
    'ƥ': 'p',
    'ᵱ': 'p',
    'ᶈ': 'p',
    'ꝕ': 'p',
    'ᵽ': 'p',
    'ꝑ': 'p',
    'ꝙ': 'q',
    'ʠ': 'q',
    'ɋ': 'q',
    'ꝗ': 'q',
    'ŕ': 'r',
    'ř': 'r',
    'ŗ': 'r',
    'ṙ': 'r',
    'ṛ': 'r',
    'ṝ': 'r',
    'ȑ': 'r',
    'ɾ': 'r',
    'ᵳ': 'r',
    'ȓ': 'r',
    'ṟ': 'r',
    'ɼ': 'r',
    'ᵲ': 'r',
    'ᶉ': 'r',
    'ɍ': 'r',
    'ɽ': 'r',
    'ↄ': 'c',
    'ꜿ': 'c',
    'ɘ': 'e',
    'ɿ': 'r',
    'ś': 's',
    'ṥ': 's',
    'š': 's',
    'ṧ': 's',
    'ş': 's',
    'ŝ': 's',
    'ș': 's',
    'ṡ': 's',
    'ṣ': 's',
    'ṩ': 's',
    'ʂ': 's',
    'ᵴ': 's',
    'ᶊ': 's',
    'ȿ': 's',
    'ɡ': 'g',
    'ᴑ': 'o',
    'ᴓ': 'o',
    'ᴝ': 'u',
    'ť': 't',
    'ţ': 't',
    'ṱ': 't',
    'ț': 't',
    'ȶ': 't',
    'ẗ': 't',
    'ⱦ': 't',
    'ṫ': 't',
    'ṭ': 't',
    'ƭ': 't',
    'ṯ': 't',
    'ᵵ': 't',
    'ƫ': 't',
    'ʈ': 't',
    'ŧ': 't',
    'ᵺ': 'th',
    'ɐ': 'a',
    'ᴂ': 'ae',
    'ǝ': 'e',
    'ᵷ': 'g',
    'ɥ': 'h',
    'ʮ': 'h',
    'ʯ': 'h',
    'ᴉ': 'i',
    'ʞ': 'k',
    'ꞁ': 'l',
    'ɯ': 'm',
    'ɰ': 'm',
    'ᴔ': 'oe',
    'ɹ': 'r',
    'ɻ': 'r',
    'ɺ': 'r',
    'ⱹ': 'r',
    'ʇ': 't',
    'ʌ': 'v',
    'ʍ': 'w',
    'ʎ': 'y',
    'ꜩ': 'tz',
    'ú': 'u',
    'ŭ': 'u',
    'ǔ': 'u',
    'û': 'u',
    'ṷ': 'u',
    'ü': 'u',
    'ǘ': 'u',
    'ǚ': 'u',
    'ǜ': 'u',
    'ǖ': 'u',
    'ṳ': 'u',
    'ụ': 'u',
    'ű': 'u',
    'ȕ': 'u',
    'ù': 'u',
    'ủ': 'u',
    'ư': 'u',
    'ứ': 'u',
    'ự': 'u',
    'ừ': 'u',
    'ử': 'u',
    'ữ': 'u',
    'ȗ': 'u',
    'ū': 'u',
    'ṻ': 'u',
    'ų': 'u',
    'ᶙ': 'u',
    'ů': 'u',
    'ũ': 'u',
    'ṹ': 'u',
    'ṵ': 'u',
    'ᵫ': 'ue',
    'ꝸ': 'um',
    'ⱴ': 'v',
    'ꝟ': 'v',
    'ṿ': 'v',
    'ʋ': 'v',
    'ᶌ': 'v',
    'ⱱ': 'v',
    'ṽ': 'v',
    'ꝡ': 'vy',
    'ẃ': 'w',
    'ŵ': 'w',
    'ẅ': 'w',
    'ẇ': 'w',
    'ẉ': 'w',
    'ẁ': 'w',
    'ⱳ': 'w',
    'ẘ': 'w',
    'ẍ': 'x',
    'ẋ': 'x',
    'ᶍ': 'x',
    'ý': 'y',
    'ŷ': 'y',
    'ÿ': 'y',
    'ẏ': 'y',
    'ỵ': 'y',
    'ỳ': 'y',
    'ƴ': 'y',
    'ỷ': 'y',
    'ỿ': 'y',
    'ȳ': 'y',
    'ẙ': 'y',
    'ɏ': 'y',
    'ỹ': 'y',
    'ź': 'z',
    'ž': 'z',
    'ẑ': 'z',
    'ʑ': 'z',
    'ⱬ': 'z',
    'ż': 'z',
    'ẓ': 'z',
    'ȥ': 'z',
    'ẕ': 'z',
    'ᵶ': 'z',
    'ᶎ': 'z',
    'ʐ': 'z',
    'ƶ': 'z',
    'ɀ': 'z',
    'ﬀ': 'ff',
    'ﬃ': 'ffi',
    'ﬄ': 'ffl',
    'ﬁ': 'fi',
    'ﬂ': 'fl',
    'ĳ': 'ij',
    'œ': 'oe',
    'ﬆ': 'st',
    'ₐ': 'a',
    'ₑ': 'e',
    'ᵢ': 'i',
    'ⱼ': 'j',
    'ₒ': 'o',
    'ᵣ': 'r',
    'ᵤ': 'u',
    'ᵥ': 'v',
    'ₓ': 'x',
    'Ё': 'YO',
    'Й': 'I',
    'Ц': 'TS',
    'У': 'U',
    'К': 'K',
    'Е': 'E',
    'Н': 'N',
    'Г': 'G',
    'Ш': 'SH',
    'Щ': 'SCH',
    'З': 'Z',
    'Х': 'H',
    'Ъ': "'",
    'ё': 'yo',
    'й': 'i',
    'ц': 'ts',
    'у': 'u',
    'к': 'k',
    'е': 'e',
    'н': 'n',
    'г': 'g',
    'ш': 'sh',
    'щ': 'sch',
    'з': 'z',
    'х': 'h',
    'ъ': "'",
    'Ф': 'F',
    'Ы': 'I',
    'В': 'V',
    'А': 'a',
    'П': 'P',
    'Р': 'R',
    'О': 'O',
    'Л': 'L',
    'Д': 'D',
    'Ж': 'ZH',
    'Э': 'E',
    'ф': 'f',
    'ы': 'i',
    'в': 'v',
    'а': 'a',
    'п': 'p',
    'р': 'r',
    'о': 'o',
    'л': 'l',
    'д': 'd',
    'ж': 'zh',
    'э': 'e',
    'Я': 'Ya',
    'Ч': 'CH',
    'С': 'S',
    'М': 'M',
    'И': 'I',
    'Т': 'T',
    'Ь': "'",
    'Б': 'B',
    'Ю': 'YU',
    'я': 'ya',
    'ч': 'ch',
    'с': 's',
    'м': 'm',
    'и': 'i',
    'т': 't',
    'ь': "'",
    'б': 'b',
    'ю': 'yu'
  };

  return latinize;
});


/***/ }),
/* 225 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// This file can be required in Browserify and Node.js for automatic polyfill
// To use it:  require('es6-promise/auto');

module.exports = __webpack_require__(227).polyfill();


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {var require;/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.0
 */

(function (global, factory) {
     true ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = __webpack_require__(269);
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(225), __webpack_require__(118)))

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Cookie = (function () {
    function Cookie() {
    }
    Cookie.set = function (name, value, expiration) {
        var domain, domainParts, date, expires, host;
        if (expiration) {
            date = new Date();
            date.setTime(date.getTime() + expiration);
            expires = '; expires=' + date.toGMTString();
        }
        else {
            expires = '';
        }
        host = location.hostname;
        if (host.indexOf('.') === -1) {
            document.cookie = name + '=' + value + expires + '; path=/';
        }
        else {
            domainParts = host.split('.');
            domainParts.shift();
            domain = '.' + domainParts.join('.');
            document.cookie = name + '=' + value + expires + '; path=/; domain=' + domain;
            if (Cookie.get(name) == null || Cookie.get(name) != value) {
                domain = '.' + host;
                document.cookie = name + '=' + value + expires + '; path=/; domain=' + domain;
            }
        }
    };
    Cookie.get = function (name) {
        var cookiePrefix = name + '=';
        var cookieArray = document.cookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            cookie = cookie.replace(/^\s+/, '');
            if (cookie.indexOf(cookiePrefix) == 0) {
                return cookie.substring(cookiePrefix.length, cookie.length);
            }
        }
        return null;
    };
    Cookie.erase = function (name) {
        Cookie.set(name, '', -1);
    };
    return Cookie;
}());
exports.Cookie = Cookie;


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.doNotTrack = [true, 'yes', '1'].indexOf(navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.doNotTrack;


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hasOwnProperty = Object.prototype.hasOwnProperty;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
var objectAssignPonyfill = function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    var output = Object(target);
    sources.forEach(function (source) {
        var from = Object(source);
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                output[key] = from[key];
            }
        }
        if (getOwnPropertySymbols) {
            var symbols = getOwnPropertySymbols(from);
            symbols.forEach(function (symbol) {
                if (propIsEnumerable.call(from, symbol)) {
                    output[symbol] = from[symbol];
                }
            });
        }
    });
    return output;
};
exports.ponyfill = objectAssignPonyfill;
exports.assign = typeof Object.assign === 'function' ? Object.assign : objectAssignPonyfill;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.assign;


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var analytics = __webpack_require__(102);
var objectassign_1 = __webpack_require__(230);
var utils_1 = __webpack_require__(232);
var SimpleAPI = (function () {
    function SimpleAPI() {
    }
    SimpleAPI.prototype.init = function (token, endpoint) {
        if (typeof token === 'undefined') {
            throw new Error("You must pass your token when you call 'init'");
        }
        if (typeof token === 'string') {
            endpoint = endpoint || analytics.Endpoints.default;
            this.client = new analytics.Client({
                token: token,
                endpoint: endpoint
            });
        }
        else if (typeof token === 'object' && typeof token.sendEvent !== 'undefined') {
            this.client = token;
        }
        else {
            throw new Error("You must pass either your token or a valid object when you call 'init'");
        }
    };
    SimpleAPI.prototype.send = function (event, customData) {
        if (typeof this.client == 'undefined') {
            throw new Error("You must call init before sending an event");
        }
        customData = objectassign_1.default({}, {
            hash: window.location.hash
        }, customData);
        switch (event) {
            case 'pageview':
                this.client.sendViewEvent({
                    location: window.location.toString(),
                    referrer: document.referrer,
                    language: document.documentElement.lang,
                    title: document.title,
                    contentIdKey: utils_1.popFromObject(customData, 'contentIdKey'),
                    contentIdValue: utils_1.popFromObject(customData, 'contentIdValue'),
                    contentType: utils_1.popFromObject(customData, 'contentType'),
                    customData: customData
                });
                return;
            default:
                throw new Error("Event type: '" + event + "' not implemented");
        }
    };
    SimpleAPI.prototype.onLoad = function (callback) {
        if (typeof callback == 'undefined') {
            throw new Error("You must pass a function when you call 'onLoad'");
        }
        callback();
    };
    return SimpleAPI;
}());
exports.SimpleAPI = SimpleAPI;
var simpleAPI = new SimpleAPI();
exports.SimpleAnalytics = function (action) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    var actionFunction = simpleAPI[action];
    if (actionFunction) {
        return actionFunction.apply(simpleAPI, params);
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.SimpleAnalytics;


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function popFromObject(object, key) {
    if (object) {
        var value = object[key];
        delete object[key];
        return value;
    }
}
exports.popFromObject = popFromObject;


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var PromisesShim_1 = __webpack_require__(108);
PromisesShim_1.shim();
var CustomEventPolyfill_1 = __webpack_require__(245);
CustomEventPolyfill_1.customEventPolyfill();
// MISC
var Version_1 = __webpack_require__(69);
exports.version = Version_1.version;
var SearchEndpoint_1 = __webpack_require__(35);
exports.SearchEndpoint = SearchEndpoint_1.SearchEndpoint;
__export(__webpack_require__(21));
// Default language needs to be set after external module, since this is where l10n will be imported
var DefaultLanguage_1 = __webpack_require__(112);
DefaultLanguage_1.defaultLanguage();
var DefaultLanguage_2 = __webpack_require__(112);
exports.setLanguageAfterPageLoaded = DefaultLanguage_2.setLanguageAfterPageLoaded;


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var QueryController_1 = __webpack_require__(31);
exports.QueryController = QueryController_1.QueryController;
var HistoryController_1 = __webpack_require__(105);
exports.HistoryController = HistoryController_1.HistoryController;
var LocalStorageHistoryController_1 = __webpack_require__(106);
exports.LocalStorageHistoryController = LocalStorageHistoryController_1.LocalStorageHistoryController;


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// Shim for IE11 promise
// Will not override native promise in browsers that support them
__webpack_require__(226);
var CoveoUnderscore_1 = __webpack_require__(138);
exports._ = CoveoUnderscore_1.underscoreInstance;
__export(__webpack_require__(233));
__export(__webpack_require__(237));
__export(__webpack_require__(239));
__export(__webpack_require__(236));
__export(__webpack_require__(243));
__export(__webpack_require__(234));
__export(__webpack_require__(238));
__export(__webpack_require__(242));
__export(__webpack_require__(241));


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AdvancedSearchEvents_1 = __webpack_require__(58);
exports.AdvancedSearchEvents = AdvancedSearchEvents_1.AdvancedSearchEvents;
var AnalyticsEvents_1 = __webpack_require__(60);
exports.AnalyticsEvents = AnalyticsEvents_1.AnalyticsEvents;
var BreadcrumbEvents_1 = __webpack_require__(49);
exports.BreadcrumbEvents = BreadcrumbEvents_1.BreadcrumbEvents;
var DebugEvents_1 = __webpack_require__(68);
exports.DebugEvents = DebugEvents_1.DebugEvents;
var ImageResultListEvents_1 = __webpack_require__(244);
exports.ImageResultListEvents = ImageResultListEvents_1.ImageResultListEvents;
var InitializationEvents_1 = __webpack_require__(14);
exports.InitializationEvents = InitializationEvents_1.InitializationEvents;
var OmniboxEvents_1 = __webpack_require__(30);
exports.OmniboxEvents = OmniboxEvents_1.OmniboxEvents;
var PreferencesPanelEvents_1 = __webpack_require__(64);
exports.PreferencesPanelEvents = PreferencesPanelEvents_1.PreferencesPanelEvents;
var QueryEvents_1 = __webpack_require__(10);
exports.QueryEvents = QueryEvents_1.QueryEvents;
var ResultListEvents_1 = __webpack_require__(29);
exports.ResultListEvents = ResultListEvents_1.ResultListEvents;
var ResultLayoutEvents_1 = __webpack_require__(99);
exports.ResultLayoutEvents = ResultLayoutEvents_1.ResultLayoutEvents;
var SearchAlertEvents_1 = __webpack_require__(56);
exports.SearchAlertsEvents = SearchAlertEvents_1.SearchAlertsEvents;
var SettingsEvents_1 = __webpack_require__(37);
exports.SettingsEvents = SettingsEvents_1.SettingsEvents;
var SliderEvents_1 = __webpack_require__(100);
exports.SliderEvents = SliderEvents_1.SliderEvents;
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(63);
exports.StandaloneSearchInterfaceEvents = StandaloneSearchInterfaceEvents_1.StandaloneSearchInterfaceEvents;


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
exports.Assert = Assert_1.Assert;
var Defer_1 = __webpack_require__(25);
exports.Defer = Defer_1.Defer;
var L10N_1 = __webpack_require__(107);
exports.L10N = L10N_1.L10N;
var Logger_1 = __webpack_require__(13);
exports.Logger = Logger_1.Logger;
var Options_1 = __webpack_require__(50);
exports.Options = Options_1.Options;
var Strings_1 = __webpack_require__(9);
exports.l = Strings_1.l;


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Model_1 = __webpack_require__(15);
exports.Model = Model_1.Model;
var QueryStateModel_1 = __webpack_require__(12);
exports.QueryStateModel = QueryStateModel_1.QueryStateModel;
var ComponentOptionsModel_1 = __webpack_require__(24);
exports.ComponentOptionsModel = ComponentOptionsModel_1.ComponentOptionsModel;
var ComponentStateModel_1 = __webpack_require__(51);
exports.ComponentStateModel = ComponentStateModel_1.ComponentStateModel;


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AnalyticsEndpoint_1 = __webpack_require__(110);
exports.AnalyticsEndpoint = AnalyticsEndpoint_1.AnalyticsEndpoint;
var EndpointCaller_1 = __webpack_require__(70);
exports.EndpointCaller = EndpointCaller_1.EndpointCaller;
var QueryError_1 = __webpack_require__(111);
exports.QueryError = QueryError_1.QueryError;


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CoreHelpers_1 = __webpack_require__(139);
var _ = __webpack_require__(0);
// Webpack output a library target with a temporary name.
// It does not take care of merging the namespace if the global variable already exists.
// If another piece of code in the page use the Coveo namespace (eg: extension), then they get overwritten
// This code swap the current module to the "real" Coveo variable, without overwriting the whole global var.
function swapVar(scope) {
    if (window['Coveo'] == undefined) {
        window['Coveo'] = scope;
    }
    else {
        _.each(_.keys(scope), function (k) {
            window['Coveo'][k] = scope[k];
        });
    }
    CoreHelpers_1.CoreHelpers.exportAllHelpersGlobally(window['Coveo']);
    if (window['__extends'] == undefined) {
        var __extends = function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) {
                    d[p] = b[p];
                }
            }
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        window['__extends'] = __extends;
    }
}
exports.swapVar = swapVar;


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TemplateHelpers_1 = __webpack_require__(66);
exports.TemplateHelpers = TemplateHelpers_1.TemplateHelpers;
var TemplateCache_1 = __webpack_require__(44);
exports.TemplateCache = TemplateCache_1.TemplateCache;
var HtmlTemplate_1 = __webpack_require__(73);
exports.HtmlTemplate = HtmlTemplate_1.HtmlTemplate;
var UnderscoreTemplate_1 = __webpack_require__(39);
exports.UnderscoreTemplate = UnderscoreTemplate_1.UnderscoreTemplate;


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(57));
var ComponentOptions_1 = __webpack_require__(8);
exports.ComponentOptions = ComponentOptions_1.ComponentOptions;
exports.ComponentOptionsType = ComponentOptions_1.ComponentOptionsType;
var Component_1 = __webpack_require__(7);
exports.Component = Component_1.Component;
var BaseComponent_1 = __webpack_require__(28);
exports.BaseComponent = BaseComponent_1.BaseComponent;
var RootComponent_1 = __webpack_require__(32);
exports.RootComponent = RootComponent_1.RootComponent;
var QueryBuilder_1 = __webpack_require__(40);
exports.QueryBuilder = QueryBuilder_1.QueryBuilder;
var ExpressionBuilder_1 = __webpack_require__(65);
exports.ExpressionBuilder = ExpressionBuilder_1.ExpressionBuilder;
// Export Initialization under both name, for legacy reason and old code in the wild that
// reference the old CoveoJQuery module
var Initialization_1 = __webpack_require__(1);
exports.Initialization = Initialization_1.Initialization;
var Initialization_2 = __webpack_require__(1);
exports.CoveoJQuery = Initialization_2.Initialization;
var CoveoJQuery_1 = __webpack_require__(137);
exports.initCoveoJQuery = CoveoJQuery_1.initCoveoJQuery;


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ColorUtils_1 = __webpack_require__(101);
exports.ColorUtils = ColorUtils_1.ColorUtils;
var CookieUtils_1 = __webpack_require__(83);
exports.Cookie = CookieUtils_1.Cookie;
var CurrencyUtils_1 = __webpack_require__(84);
exports.CurrencyUtils = CurrencyUtils_1.CurrencyUtils;
var DateUtils_1 = __webpack_require__(27);
exports.DateUtils = DateUtils_1.DateUtils;
var DeviceUtils_1 = __webpack_require__(17);
exports.DeviceUtils = DeviceUtils_1.DeviceUtils;
var Dom_1 = __webpack_require__(2);
exports.Dom = Dom_1.Dom;
exports.$$ = Dom_1.$$;
var DomUtils_1 = __webpack_require__(41);
exports.DomUtils = DomUtils_1.DomUtils;
var EmailUtils_1 = __webpack_require__(116);
exports.EmailUtils = EmailUtils_1.EmailUtils;
var HashUtils_1 = __webpack_require__(36);
exports.HashUtils = HashUtils_1.HashUtils;
var HighlightUtils_1 = __webpack_require__(42);
exports.HighlightUtils = HighlightUtils_1.HighlightUtils;
exports.StringAndHoles = HighlightUtils_1.StringAndHoles;
var HtmlUtils_1 = __webpack_require__(117);
exports.HTMLUtils = HtmlUtils_1.HTMLUtils;
var KeyboardUtils_1 = __webpack_require__(20);
exports.KEYBOARD = KeyboardUtils_1.KEYBOARD;
exports.KeyboardUtils = KeyboardUtils_1.KeyboardUtils;
var LocalStorageUtils_1 = __webpack_require__(34);
exports.LocalStorageUtils = LocalStorageUtils_1.LocalStorageUtils;
var OSUtils_1 = __webpack_require__(124);
exports.OSUtils = OSUtils_1.OSUtils;
exports.OS_NAME = OSUtils_1.OS_NAME;
var PopupUtils_1 = __webpack_require__(45);
exports.PopupUtils = PopupUtils_1.PopupUtils;
var QueryUtils_1 = __webpack_require__(16);
exports.QueryUtils = QueryUtils_1.QueryUtils;
var StreamHighlightUtils_1 = __webpack_require__(62);
exports.StreamHighlightUtils = StreamHighlightUtils_1.StreamHighlightUtils;
var StringUtils_1 = __webpack_require__(18);
exports.StringUtils = StringUtils_1.StringUtils;
var TimeSpanUtils_1 = __webpack_require__(53);
exports.TimeSpan = TimeSpanUtils_1.TimeSpan;
var Utils_1 = __webpack_require__(4);
exports.Utils = Utils_1.Utils;


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ImageResultListEvents = (function () {
    function ImageResultListEvents() {
    }
    return ImageResultListEvents;
}());
ImageResultListEvents.imageResultsLayoutComplete = 'imageResultsLayoutComplete';
exports.ImageResultListEvents = ImageResultListEvents;


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// CustomEvent polyfill from MDN
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
/* istanbul ignore next */
function customEventPolyfill() {
    // window.CustomEvent is missing from the definitions
    if (typeof window.CustomEvent === 'function') {
        return;
    }
    var CustomEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return customEvent;
    };
    // window.Event is specific to IE
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
}
exports.customEventPolyfill = customEventPolyfill;


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(13);
var DeviceUtils_1 = __webpack_require__(17);
var _ = __webpack_require__(0);
var SentryLogger = (function () {
    function SentryLogger(queryController, windoh) {
        if (windoh === void 0) { windoh = window; }
        this.queryController = queryController;
        this.windoh = windoh;
        this.logger = new Logger_1.Logger(this);
        this.bindErrorHandler();
    }
    SentryLogger.prototype.bindErrorHandler = function () {
        var _this = this;
        // take care of not overriding any existing onerror handler that might be already present in the page.
        var oldHandler = this.windoh.onerror;
        if (_.isFunction(oldHandler)) {
            this.windoh.onerror = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                oldHandler.apply(oldHandler, args);
                _this.handleError.apply(_this, args);
            };
        }
        else {
            this.windoh.onerror = this.handleError.bind(this);
        }
    };
    SentryLogger.prototype.handleError = function (message, filename, lineno, colno, error) {
        // try not to log irrelevant errors ...
        if (!filename.toLowerCase().match(/coveo/) || this.windoh.location.host.toLowerCase().match(/localhost/)) {
            return;
        }
        var errorInfo = {
            message: message,
            filename: filename,
            line: lineno,
            column: colno,
            error: error.toString(),
            errorStack: error['stack'],
            device: DeviceUtils_1.DeviceUtils.getDeviceName()
        };
        var sentryLog = {
            level: 'DEBUG',
            title: this.windoh.location.href,
            message: JSON.stringify(errorInfo)
        };
        this.queryController.getEndpoint().logError(sentryLog);
    };
    return SentryLogger;
}());
exports.SentryLogger = SentryLogger;


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(6);
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
/* 248 */
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
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var SearchEndpointWithDefaultCallOptions = (function () {
    function SearchEndpointWithDefaultCallOptions(endpoint, callOptions) {
        this.endpoint = endpoint;
        this.callOptions = callOptions;
        this.options = endpoint.options;
    }
    SearchEndpointWithDefaultCallOptions.prototype.getBaseUri = function () {
        return this.endpoint.getBaseUri();
    };
    SearchEndpointWithDefaultCallOptions.prototype.getBaseAlertsUri = function () {
        return this.endpoint.getBaseAlertsUri();
    };
    SearchEndpointWithDefaultCallOptions.prototype.getAuthenticationProviderUri = function (provider, returnUri, message) {
        return this.endpoint.getAuthenticationProviderUri(provider, returnUri, message);
    };
    SearchEndpointWithDefaultCallOptions.prototype.isJsonp = function () {
        return this.endpoint.isJsonp();
    };
    SearchEndpointWithDefaultCallOptions.prototype.search = function (query, callOptions) {
        return this.endpoint.search(query, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.getExportToExcelLink = function (query, numberOfResults, callOptions) {
        return this.endpoint.getExportToExcelLink(query, numberOfResults, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.tagDocument = function (taggingRequest, callOptions) {
        return this.endpoint.tagDocument(taggingRequest, this.enrichCallOptions(taggingRequest));
    };
    SearchEndpointWithDefaultCallOptions.prototype.getQuerySuggest = function (request, callOptions) {
        return this.endpoint.getQuerySuggest(request, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.rateDocument = function (ratingRequest, callOptions) {
        return this.endpoint.rateDocument(ratingRequest, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.getRawDataStream = function (documentUniqueId, dataStreamType, callOptions) {
        return this.endpoint.getRawDataStream(documentUniqueId, dataStreamType, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.getDocument = function (documentUniqueId, callOptions) {
        return this.endpoint.getDocument(documentUniqueId, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.getDocumentText = function (documentUniqueID, callOptions) {
        return this.endpoint.getDocumentText(documentUniqueID, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.getDocumentHtml = function (documentUniqueID, callOptions) {
        return this.endpoint.getDocumentHtml(documentUniqueID, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.getViewAsHtmlUri = function (documentUniqueID, callOptions) {
        return this.endpoint.getViewAsHtmlUri(documentUniqueID, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.getViewAsDatastreamUri = function (documentUniqueID, dataStreamType, callOptions) {
        return this.endpoint.getViewAsDatastreamUri(documentUniqueID, dataStreamType, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.listFieldValues = function (request, callOptions) {
        return this.endpoint.listFieldValues(request, this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.listFields = function (callOptions) {
        return this.endpoint.listFields(this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.extensions = function (callOptions) {
        return this.endpoint.extensions(this.enrichCallOptions(callOptions));
    };
    SearchEndpointWithDefaultCallOptions.prototype.follow = function (request) {
        return this.endpoint.follow(request);
    };
    SearchEndpointWithDefaultCallOptions.prototype.listSubscriptions = function (page) {
        return this.endpoint.listSubscriptions(page);
    };
    SearchEndpointWithDefaultCallOptions.prototype.updateSubscription = function (subscription) {
        return this.endpoint.updateSubscription(subscription);
    };
    SearchEndpointWithDefaultCallOptions.prototype.deleteSubscription = function (subscription) {
        return this.endpoint.deleteSubscription(subscription);
    };
    SearchEndpointWithDefaultCallOptions.prototype.logError = function (sentryLog) {
        return this.endpoint.logError(sentryLog);
    };
    SearchEndpointWithDefaultCallOptions.prototype.enrichCallOptions = function (callOptions) {
        return _.extend({}, callOptions, this.callOptions);
    };
    return SearchEndpointWithDefaultCallOptions;
}());
exports.SearchEndpointWithDefaultCallOptions = SearchEndpointWithDefaultCallOptions;


/***/ }),
/* 250 */
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
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var AnalyticsEndpoint_1 = __webpack_require__(110);
var SearchEndpoint_1 = __webpack_require__(35);
var Assert_1 = __webpack_require__(6);
var QueryEvents_1 = __webpack_require__(10);
var ComponentOptionsModel_1 = __webpack_require__(24);
var Dom_1 = __webpack_require__(2);
var Model_1 = __webpack_require__(15);
var Utils_1 = __webpack_require__(4);
var NoopAnalyticsClient_1 = __webpack_require__(71);
var LiveAnalyticsClient_1 = __webpack_require__(113);
var MultiAnalyticsClient_1 = __webpack_require__(251);
var AnalyticsActionListMeta_1 = __webpack_require__(11);
var SearchInterface_1 = __webpack_require__(19);
var RecommendationAnalyticsClient_1 = __webpack_require__(136);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var PendingSearchEvent_1 = __webpack_require__(72);
var PendingSearchAsYouTypeSearchEvent_1 = __webpack_require__(80);
/**
 * The Analytics component logs user actions performed in the search interface and sends them to a REST web service
 * exposed through the Coveo Cloud Platform.
 *
 * You can use analytics data to evaluate how users are interacting with your search interface, improve relevance and
 * produce analytics dashboards within the Coveo Cloud Platform.
 *
 * See [Step 7 - Usage Analytics](https://developers.coveo.com/x/EYskAg) of the Getting Started with the JavaScript
 * Search Framework V1 tutorial for an introduction to usage analytics.
 *
 * See also [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ) for more advanced use cases.
 */
var Analytics = (function (_super) {
    __extends(Analytics, _super);
    /**
     * Creates a new Analytics component. Creates the {@link IAnalyticsClient}.
     * @param element The HTMLElement on which the component will be instantiated.
     * @param options The options for the Analytics component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Analytics(element, options, bindings) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, element, Analytics.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Analytics, options);
        _this.retrieveInfoFromDefaultSearchEndpoint();
        _this.initializeAnalyticsClient();
        Assert_1.Assert.exists(_this.client);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (data) { return _this.handleBuildingQuery(data); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function (data) { return _this.handleQueryError(data); });
        // Analytics component is a bit special: It can be higher in the dom tree than the search interface
        // Need to resolve down to find the componentOptionsModel if we need to.
        if (!_this.componentOptionsModel) {
            var cmpOptionElement = Dom_1.$$(element).find('.' + Component_1.Component.computeCssClassName(ComponentOptionsModel_1.ComponentOptionsModel));
            if (cmpOptionElement) {
                _this.componentOptionsModel = cmpOptionElement[Component_1.Component.computeCssClassName(ComponentOptionsModel_1.ComponentOptionsModel)];
            }
        }
        if (_this.componentOptionsModel) {
            _this.componentOptionsModel.set(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchHub, _this.options.searchHub);
            var event_1 = _this.componentOptionsModel.getEventName(Model_1.Model.eventTypes.changeOne + ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchHub);
            _this.bind.onRootElement(event_1, function (args) { return _this.handleSearchHubChanged(args); });
        }
        return _this;
    }
    Analytics.doExport = function () {
        GlobalExports_1.exportGlobally({
            'PendingSearchEvent': PendingSearchEvent_1.PendingSearchEvent,
            'PendingSearchAsYouTypeSearchEvent': PendingSearchAsYouTypeSearchEvent_1.PendingSearchAsYouTypeSearchEvent,
            'analyticsActionCauseList': AnalyticsActionListMeta_1.analyticsActionCauseList,
            'NoopAnalyticsClient': NoopAnalyticsClient_1.NoopAnalyticsClient,
            'LiveAnalyticsClient': LiveAnalyticsClient_1.LiveAnalyticsClient,
            'MultiAnalyticsClient': MultiAnalyticsClient_1.MultiAnalyticsClient,
            'Analytics': Analytics
        });
    };
    /**
     * Logs a Search event on the service, using an [AnalyticsActionCause]({@link IAnalyticsActionCause}) and a meta
     * object.
     *
     * Note that the search event is only sent to the service when the query successfully returns, not immediately after
     * calling this method. Therefore, it is important to call this method before executing the query. Otherwise the
     * service will log no Search event and you will get a warning message in the console.
     *
     * See [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
     *
     * @param actionCause Describes the cause of the event.
     * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
     * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
     * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
     * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
     * ( `{}` ).
     */
    Analytics.prototype.logSearchEvent = function (actionCause, meta) {
        this.client.logSearchEvent(actionCause, meta);
    };
    /**
     * Logs a SearchAsYouType event on the service, using an {@link IAnalyticsActionCause} and a meta object.
     *
     * This method is very similar to the {@link logSearchEvent} method, except that logSearchAsYouType is, by definition,
     * more frequently called.
     *
     * The `PendingSearchAsYouTypeEvent` takes care of logging only the "relevant" last event: an event that occurs after
     * 5 seconds elapse without any event being logged, or an event that occurs after another part of the interface
     * triggers a search event. This avoids logging every single partial query, which would make the reporting very
     * confusing.
     *
     * It is important to call this method before executing the query. Otherwise the service will log no SearchAsYouType
     * event and you will get a warning message in the console.
     *
     * See [Sending Custom Analytics Events](https://developers.coveo.com/x/KoGfAQ).
     *
     * @param actionCause Describes the cause of the event.
     * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
     * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
     * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
     * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
     * ( `{}` ).
     */
    Analytics.prototype.logSearchAsYouType = function (actionCause, meta) {
        this.client.logSearchAsYouType(actionCause, meta);
    };
    /**
     * Logs a Custom event on the service. You can use custom events to create custom reports, or to track events
     * that are not queries or item views.
     *
     * @param actionCause Describes the cause of the event.
     * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
     * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
     * API automatically converts white spaces to underscores and uppercase characters to lowercase characters in key
     * names. Each value must be a simple string. If you do not need to log metadata, you can simply pass an empty JSON
     * ( `{}` ).
     * @param element The HTMLElement that the user has interacted with for this custom event.
     */
    Analytics.prototype.logCustomEvent = function (actionCause, meta, element) {
        if (element === void 0) { element = this.element; }
        this.client.logCustomEvent(actionCause, meta, element);
    };
    /**
     * Logs a Click event. You can understand click events as item views (e.g., clicking on a {@link ResultLink} or
     * opening a {@link Quickview}).
     *
     * This event is logged immediately on the service.
     *
     * @param actionCause Describes the cause of the event.
     * @param meta The metadata which you want to use to create custom dimensions. Metadata can contain as many key-value
     * pairs as you need. Each key must contain only alphanumeric characters and underscores. The Coveo Usage Analytics
     * API automatically converts uppercase characters to lowercase characters in key names. Each value must be a simple
     * string. You do not have to pass an {@link IAnalyticsDocumentViewMeta} as meta when logging a custom Click event.
     * You can actually send any arbitrary meta. If you do not need to log metadata, you can simply pass an empty JSON
     * ( `{}` ).
     * @param result The result that the user has clicked.
     * @param element The HTMLElement that the user has clicked in the interface.
     */
    Analytics.prototype.logClickEvent = function (actionCause, meta, result, element) {
        if (element === void 0) { element = this.element; }
        this.client.logClickEvent(actionCause, meta, result, element);
    };
    /**
     * Sets the Origin Context dimension on the analytic events.
     *
     * You can use this dimension to specify the context of your application.
     * Suggested values are "Search", "InternalSearch" and "CommunitySearch"
     *
     * Default value is `Search`.
     *
     * @param originContext The origin context value
     */
    Analytics.prototype.setOriginContext = function (originContext) {
        this.client.setOriginContext(originContext);
    };
    Analytics.prototype.initializeAnalyticsEndpoint = function () {
        return new AnalyticsEndpoint_1.AnalyticsEndpoint({
            token: this.options.token,
            serviceUrl: this.options.endpoint,
            organization: this.options.organization
        });
    };
    Analytics.prototype.initializeAnalyticsClient = function () {
        if (Utils_1.Utils.isNonEmptyString(this.options.endpoint)) {
            var endpoint = this.initializeAnalyticsEndpoint();
            var elementToInitializeClient = void 0;
            if (this.root && this.element) {
                if (this.root.contains(this.element)) {
                    elementToInitializeClient = this.root;
                }
                else {
                    elementToInitializeClient = this.element;
                }
            }
            var isRecommendation = Dom_1.$$(this.root).hasClass(Component_1.Component.computeCssClassNameForType("Recommendation"));
            this.instantiateAnalyticsClient(endpoint, elementToInitializeClient, isRecommendation);
        }
        else {
            this.client = new NoopAnalyticsClient_1.NoopAnalyticsClient();
        }
    };
    Analytics.prototype.instantiateAnalyticsClient = function (endpoint, elementToInitializeClient, isRecommendation) {
        if (isRecommendation) {
            this.client = new RecommendationAnalyticsClient_1.RecommendationAnalyticsClient(endpoint, elementToInitializeClient, this.options.user, this.options.userDisplayName, this.options.anonymous, this.options.splitTestRunName, this.options.splitTestRunVersion, this.options.searchHub, this.options.sendToCloud, this.getBindings());
        }
        else {
            this.client = new LiveAnalyticsClient_1.LiveAnalyticsClient(endpoint, elementToInitializeClient, this.options.user, this.options.userDisplayName, this.options.anonymous, this.options.splitTestRunName, this.options.splitTestRunVersion, this.options.searchHub, this.options.sendToCloud);
        }
    };
    Analytics.prototype.retrieveInfoFromDefaultSearchEndpoint = function () {
        var defaultEndpoint = SearchEndpoint_1.SearchEndpoint.endpoints['default'];
        if (this.options.token == null && defaultEndpoint) {
            this.options.token = defaultEndpoint.options.accessToken;
        }
        if (!this.options.organization && defaultEndpoint) {
            this.options.organization = defaultEndpoint.options.queryStringArguments['workgroup'];
        }
    };
    Analytics.prototype.handleBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        data.queryBuilder.searchHub = this.options.searchHub;
    };
    Analytics.prototype.handleSearchHubChanged = function (data) {
        this.options.searchHub = data.value;
    };
    Analytics.prototype.handleQueryError = function (data) {
        Assert_1.Assert.exists(data);
        this.client.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.queryError, {
            query: data.query.q,
            aq: data.query.aq,
            cq: data.query.cq,
            dq: data.query.dq,
            errorType: data.error.type,
            errorMessage: data.error.message
        }, this.element);
    };
    Analytics.create = function (element, options, bindings) {
        var selector = Component_1.Component.computeSelectorForType(Analytics.ID);
        var found = [];
        found = found.concat(Dom_1.$$(element).findAll(selector));
        if (Coveo['Recommendation']) {
            if (!(Component_1.Component.get(element, SearchInterface_1.SearchInterface) instanceof Coveo['Recommendation'])) {
                found = this.ignoreElementsInsideRecommendationInterface(found);
            }
        }
        found.push(Dom_1.$$(element).closest(Component_1.Component.computeCssClassName(Analytics)));
        if (Dom_1.$$(element).is(selector)) {
            found.push(element);
        }
        found = _.compact(found);
        if (found.length == 1) {
            return Analytics.getClient(found[0], options, bindings);
        }
        else if (found.length > 1) {
            return new MultiAnalyticsClient_1.MultiAnalyticsClient(_.map(found, function (el) { return Analytics.getClient(el, options, bindings); }));
        }
        else {
            return new NoopAnalyticsClient_1.NoopAnalyticsClient();
        }
    };
    Analytics.ignoreElementsInsideRecommendationInterface = function (found) {
        return _.filter(found, function (element) {
            return Dom_1.$$(element).closest(Component_1.Component.computeCssClassNameForType('Recommendation')) === undefined;
        });
    };
    Analytics.getClient = function (element, options, bindings) {
        // This check if an element is already initialized as an analytics component.
        // If that's the case, return the client on that element.
        // Otherwise, init and return.
        var foundOnElement = Component_1.Component.get(element, Analytics, true);
        if (foundOnElement instanceof Analytics) {
            return foundOnElement.client;
        }
        else {
            return new Analytics(element, options, bindings).client;
        }
    };
    return Analytics;
}(Component_1.Component));
Analytics.ID = 'Analytics';
// NOTE: The default values for some of those options (`organization`, `endpoint`, `searchHub`) can be
// overridden by generated code when using hosted search pages.
/**
 * Options for the component
 * @componentOptions
 */
Analytics.options = {
    /**
     * Specifies the name of the user for the usage analytics logs.
     *
     * Default value is `undefined`
     */
    user: ComponentOptions_1.ComponentOptions.buildStringOption(),
    /**
     * Specifies the user display name for the usage analytics logs.
     *
     * Default value is `undefined`
     */
    userDisplayName: ComponentOptions_1.ComponentOptions.buildStringOption(),
    /**
     * Specifies the token to use to access the usage analytics endpoint.
     *
     * Default value is `undefined`, and the component uses the search token.
     */
    token: ComponentOptions_1.ComponentOptions.buildStringOption(),
    /**
     * Specifies the URL of the usage analytics logger to cover exceptional cases in which this location could differ
     * from the default Coveo Cloud Usage Analytics endpoint (https://usageanalytics.coveo.com).
     *
     * Default value is `https://usageanalytics.coveo.com`.
     */
    endpoint: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: AnalyticsEndpoint_1.AnalyticsEndpoint.DEFAULT_ANALYTICS_URI }),
    /**
     * Specifies whether to convert search user identities to unique hash when logging analytics data, so that
     * analytics reviewers and managers will not be able to clearly identify which user is performing which query.
     *
     * When this option is `true`, the Coveo Usage Analytics Platform can still properly differentiate sessions
     * made by anonymous users from sessions made by users authenticated in some way on the site containing the search
     * page.
     *
     * Default value is `false`.
     */
    anonymous: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Sets the Search Hub dimension on the search events.
     *
     * The Search Hub dimension is typically a name that refers to a specific search page. For example, you could use
     * the `CommunitySite` value to refer to a search page on a company's public community site.
     *
     * Default value is `default`.
     */
    searchHub: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'default' }),
    /**
     * Specifies the name of the split test run that the search page is part of.
     *
     * You can use this dimension to perform A/B testing using different search page layouts and features inside the
     * Coveo Query pipeline.
     *
     * Default value is `undefined` and no split test run name is reported to the Coveo Usage Analytics Platform.
     */
    splitTestRunName: ComponentOptions_1.ComponentOptions.buildStringOption(),
    /**
     * Specifies the version name for the page when a split test run is active.
     *
     * When reporting on A/B testing analytics data, this value specifies the test run version name that was
     * presented to the user.
     *
     * Default value is `undefined`
     */
    splitTestRunVersion: ComponentOptions_1.ComponentOptions.buildStringOption(),
    sendToCloud: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the organization bound to the access token. This is necessary when using an access token, because a
     * single access token can be associated to more than one organization.
     *
     * Default value is `undefined`, and the value of this parameter will fallback to the organization used for the
     * search endpoint.
     */
    organization: ComponentOptions_1.ComponentOptions.buildStringOption()
};
exports.Analytics = Analytics;


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var MultiAnalyticsClient = (function () {
    function MultiAnalyticsClient(analyticsClients) {
        if (analyticsClients === void 0) { analyticsClients = []; }
        this.analyticsClients = analyticsClients;
        this.isContextual = false;
    }
    MultiAnalyticsClient.prototype.isActivated = function () {
        return _.some(this.analyticsClients, function (analyticsClient) { return analyticsClient.isActivated(); });
    };
    MultiAnalyticsClient.prototype.getCurrentEventCause = function () {
        return _.find(_.map(this.analyticsClients, function (analyticsClient) { return analyticsClient.getCurrentEventCause(); }), function (currentEventCause) { return currentEventCause != null; });
    };
    MultiAnalyticsClient.prototype.getCurrentEventMeta = function () {
        return _.find(_.map(this.analyticsClients, function (analyticsClient) { return analyticsClient.getCurrentEventMeta(); }), function (currentEventMeta) { return currentEventMeta != null; });
    };
    MultiAnalyticsClient.prototype.logSearchEvent = function (actionCause, meta) {
        _.each(this.analyticsClients, function (analyticsClient) { return analyticsClient.logSearchEvent(actionCause, meta); });
    };
    MultiAnalyticsClient.prototype.logSearchAsYouType = function (actionCause, meta) {
        _.each(this.analyticsClients, function (analyticsClient) { return analyticsClient.logSearchEvent(actionCause, meta); });
    };
    MultiAnalyticsClient.prototype.logClickEvent = function (actionCause, meta, result, element) {
        _.each(this.analyticsClients, function (analyticsClient) { return analyticsClient.logClickEvent(actionCause, meta, result, element); });
    };
    MultiAnalyticsClient.prototype.logCustomEvent = function (actionCause, meta, element) {
        _.each(this.analyticsClients, function (analyticsClient) { return analyticsClient.logCustomEvent(actionCause, meta, element); });
    };
    MultiAnalyticsClient.prototype.getTopQueries = function (params) {
        var _this = this;
        return Promise.all(_.map(this.analyticsClients, function (client) {
            return client.getTopQueries(params);
        }))
            .then(function (values) {
            return _this.mergeTopQueries(values, params.pageSize);
        });
    };
    MultiAnalyticsClient.prototype.getCurrentVisitIdPromise = function () {
        return _.first(this.analyticsClients).getCurrentVisitIdPromise();
    };
    MultiAnalyticsClient.prototype.getCurrentVisitId = function () {
        return _.first(this.analyticsClients).getCurrentVisitId();
    };
    MultiAnalyticsClient.prototype.sendAllPendingEvents = function () {
        _.each(this.analyticsClients, function (analyticsClient) { return analyticsClient.sendAllPendingEvents(); });
    };
    MultiAnalyticsClient.prototype.warnAboutSearchEvent = function () {
        _.each(this.analyticsClients, function (analyticsClient) { return analyticsClient.warnAboutSearchEvent(); });
    };
    MultiAnalyticsClient.prototype.cancelAllPendingEvents = function () {
        _.each(this.analyticsClients, function (analyticsClient) { return analyticsClient.cancelAllPendingEvents(); });
    };
    MultiAnalyticsClient.prototype.getPendingSearchEvent = function () {
        return _.first(this.analyticsClients).getPendingSearchEvent();
    };
    MultiAnalyticsClient.prototype.setOriginContext = function (originContext) {
        _.each(this.analyticsClients, function (analyticsClient) { return analyticsClient.setOriginContext(originContext); });
    };
    MultiAnalyticsClient.prototype.mergeTopQueries = function (values, pageSize) {
        if (pageSize === void 0) { pageSize = 5; }
        return _.chain(values)
            .flatten()
            .first(pageSize)
            .value();
    };
    return MultiAnalyticsClient;
}());
exports.MultiAnalyticsClient = MultiAnalyticsClient;


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var fields = [
    'sflikedby',
    'sflikedbyid',
    'clickableuri',
    'sffeeditemid'
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('ChatterLikedBy', fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var fields = [
    'sfcontentversionid',
    'sffeeditemid',
    'sfcontentfilename'
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('ChatterPostAttachment', fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var fields = [
    'sfcreatedby',
    'sfcreatedbyid',
    'sffeeditemid',
    'sfuserid',
    'sfinsertedbyid',
    'sfparentid',
    'sfparentname'
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('ChatterPostedBy', fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var fields = [
    'coveochatterfeedtopics'
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('ChatterTopic', fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 256 */
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
var ComponentOptions_1 = __webpack_require__(8);
var LocalStorageUtils_1 = __webpack_require__(34);
var ResultListEvents_1 = __webpack_require__(29);
var DebugEvents_1 = __webpack_require__(68);
var Dom_1 = __webpack_require__(2);
var StringUtils_1 = __webpack_require__(18);
var SearchEndpoint_1 = __webpack_require__(35);
var Template_1 = __webpack_require__(23);
var RootComponent_1 = __webpack_require__(32);
var BaseComponent_1 = __webpack_require__(28);
var ExternalModulesShim_1 = __webpack_require__(21);
var Globalize = __webpack_require__(22);
var _ = __webpack_require__(0);
__webpack_require__(216);
var Strings_1 = __webpack_require__(9);
var DebugHeader_1 = __webpack_require__(258);
var QueryEvents_1 = __webpack_require__(10);
var DebugForResult_1 = __webpack_require__(257);
var Debug = (function (_super) {
    __extends(Debug, _super);
    function Debug(element, bindings, options, ModalBox) {
        if (ModalBox === void 0) { ModalBox = ExternalModulesShim_1.ModalBox; }
        var _this = _super.call(this, element, Debug.ID) || this;
        _this.element = element;
        _this.bindings = bindings;
        _this.options = options;
        _this.ModalBox = ModalBox;
        _this.opened = false;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Debug, options);
        // This gets debounced so the following logic works correctly :
        // When you alt dbl click on a component, it's possible to add/merge multiple debug info source together
        // They will be merged together in this.addInfoToDebugPanel
        // Then, openModalBox, even if it's called from multiple different caller will be opened only once all the info has been merged together correctly
        _this.showDebugPanel = _.debounce(function () { return _this.openModalBox(); }, 100);
        Dom_1.$$(_this.element).on(ResultListEvents_1.ResultListEvents.newResultDisplayed, function (e, args) { return _this.handleNewResultDisplayed(args); });
        Dom_1.$$(_this.element).on(DebugEvents_1.DebugEvents.showDebugPanel, function (e, args) { return _this.handleShowDebugPanel(args); });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.querySuccess, function (e, args) { return _this.handleQuerySuccess(args); });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.newQuery, function () { return _this.handleNewQuery(); });
        _this.localStorageDebug = new LocalStorageUtils_1.LocalStorageUtils('DebugPanel');
        _this.collapsedSections = _this.localStorageDebug.load() || [];
        return _this;
    }
    Debug.prototype.debugInfo = function () {
        return null;
    };
    Debug.prototype.addInfoToDebugPanel = function (info) {
        if (this.stackDebug == null) {
            this.stackDebug = {};
        }
        this.stackDebug = _.extend({}, this.stackDebug, info);
    };
    Debug.prototype.handleNewResultDisplayed = function (args) {
        var _this = this;
        Dom_1.$$(args.item).on('dblclick', function (e) {
            _this.handleResultDoubleClick(e, args);
        });
    };
    Debug.prototype.handleResultDoubleClick = function (e, args) {
        if (e.altKey) {
            var index_1 = args.result.index;
            var template = args.item['template'];
            var findResult = function (results) { return results != null ? _.find(results.results, function (result) { return result.index == index_1; }) : args.result; };
            var debugInfo = _.extend(new DebugForResult_1.DebugForResult(this.bindings).generateDebugInfoForResult(args.result), {
                findResult: findResult,
                template: this.templateToJson(template),
            });
            this.addInfoToDebugPanel(debugInfo);
            this.showDebugPanel();
        }
    };
    Debug.prototype.handleQuerySuccess = function (args) {
        if (this.opened) {
            if (this.stackDebug && this.stackDebug.findResult) {
                this.addInfoToDebugPanel(new DebugForResult_1.DebugForResult(this.bindings).generateDebugInfoForResult(this.stackDebug.findResult(args.results)));
            }
            this.redrawDebugPanel();
            this.hideAnimationDuringQuery();
        }
    };
    Debug.prototype.handleNewQuery = function () {
        if (this.opened) {
            this.showAnimationDuringQuery();
        }
    };
    Debug.prototype.handleShowDebugPanel = function (args) {
        this.addInfoToDebugPanel(args);
        this.showDebugPanel();
    };
    Debug.prototype.buildStackPanel = function () {
        var _this = this;
        var body = Dom_1.$$('div', {
            className: 'coveo-debug'
        });
        var keys = _.chain(this.stackDebug)
            .omit('findResult') // findResult is a duplicate of the simpler "result" key used to retrieve the results only
            .keys()
            .value();
        // TODO Can't chain this properly due to a bug in underscore js definition file.
        // Yep, A PR is opened to DefinitelyTyped.
        var keysPaired = _.pairs(keys);
        keysPaired = keysPaired.sort(function (a, b) {
            var indexA = _.indexOf(Debug.customOrder, a[1]);
            var indexB = _.indexOf(Debug.customOrder, b[1]);
            if (indexA != -1 && indexB != -1) {
                return indexA - indexB;
            }
            if (indexA != -1) {
                return -1;
            }
            if (indexB != -1) {
                return 1;
            }
            return a[0] - b[0];
        });
        var json = {};
        _.forEach(keysPaired, function (key) {
            var section = _this.buildSection(key[1]);
            var build = _this.buildStackPanelSection(_this.stackDebug[key[1]], _this.stackDebug['result']);
            section.container.append(build.section);
            if (build.json != null) {
                json[key[1]] = build.json;
            }
            body.append(section.dom.el);
        });
        return {
            body: body.el,
            json: json
        };
    };
    Debug.prototype.getModalBody = function () {
        if (this.modalBox && this.modalBox.content) {
            return Dom_1.$$(this.modalBox.content).find('.coveo-modal-body');
        }
        return null;
    };
    Debug.prototype.redrawDebugPanel = function () {
        var build = this.buildStackPanel();
        var body = this.getModalBody();
        if (body) {
            Dom_1.$$(body).empty();
            Dom_1.$$(body).append(build.body);
        }
    };
    Debug.prototype.openModalBox = function () {
        var _this = this;
        var build = this.buildStackPanel();
        this.opened = true;
        this.modalBox = this.ModalBox.open(build.body, {
            title: Strings_1.l('Debug'),
            className: 'coveo-debug',
            titleClose: true,
            overlayClose: true,
            validation: function () {
                _this.onCloseModalBox();
                return true;
            },
            sizeMod: 'big'
        });
        var title = Dom_1.$$(this.modalBox.wrapper).find('.coveo-modal-header');
        if (title) {
            new DebugHeader_1.DebugHeader(this.element, title, this.bindings, function (value) { return _this.search(value, build.body); }, this.stackDebug);
        }
        else {
            this.logger.warn('No title found in modal box.');
        }
    };
    Debug.prototype.onCloseModalBox = function () {
        this.stackDebug = null;
        this.opened = false;
    };
    Debug.prototype.buildStackPanelSection = function (value, results) {
        if (value instanceof HTMLElement) {
            return { section: value };
        }
        else if (_.isFunction(value)) {
            return this.buildStackPanelSection(value(results), results);
        }
        var json = this.toJson(value);
        return { section: this.buildProperty(json), json: json };
    };
    Debug.prototype.findInProperty = function (element, value) {
        var _this = this;
        var wrappedElement = Dom_1.$$(element);
        var match = element['label'].indexOf(value) != -1;
        if (match) {
            this.highlightSearch(element['labelDom'], value);
        }
        else {
            this.removeHighlightSearch(element['labelDom']);
        }
        if (wrappedElement.hasClass('coveo-property-object')) {
            wrappedElement.toggleClass('coveo-search-match', match);
            var children = element['buildKeys']();
            var submatch_1 = false;
            _.each(children, function (child) {
                submatch_1 = _this.findInProperty(child, value) || submatch_1;
            });
            wrappedElement.toggleClass('coveo-search-submatch', submatch_1);
            return match || submatch_1;
        }
        else {
            if (element['values'].indexOf(value) != -1) {
                this.highlightSearch(element['valueDom'], value);
                match = true;
            }
            else {
                this.removeHighlightSearch(element['valueDom']);
            }
            wrappedElement.toggleClass('coveo-search-match', match);
        }
        return match;
    };
    Debug.prototype.buildSection = function (id) {
        var _this = this;
        var dom = Dom_1.$$('div', {
            className: "coveo-section coveo-" + id + "-section"
        });
        var header = Dom_1.$$('div', {
            className: 'coveo-section-header'
        });
        Dom_1.$$(header).text(id);
        dom.append(header.el);
        var container = Dom_1.$$('div', {
            className: 'coveo-section-container'
        });
        dom.append(container.el);
        if (_.contains(this.collapsedSections, id)) {
            Dom_1.$$(dom).addClass('coveo-debug-collapsed');
        }
        header.on('click', function () {
            Dom_1.$$(dom).toggleClass('coveo-debug-collapsed');
            if (_.contains(_this.collapsedSections, id)) {
                _this.collapsedSections = _.without(_this.collapsedSections, id);
            }
            else {
                _this.collapsedSections.push(id);
            }
            _this.localStorageDebug.save(_this.collapsedSections);
        });
        return {
            dom: dom,
            header: header,
            container: container
        };
    };
    Debug.prototype.buildProperty = function (value, label) {
        if (value instanceof Promise) {
            return this.buildPromise(value, label);
        }
        else if ((_.isArray(value) || (_.isObject(value))) && !_.isString(value)) {
            return this.buildObjectProperty(value, label);
        }
        else {
            return this.buildBasicProperty(value, label);
        }
    };
    Debug.prototype.buildPromise = function (promise, label) {
        var _this = this;
        var dom = Dom_1.$$('div', {
            className: 'coveo-property coveo-property-promise'
        });
        promise.then(function (value) {
            var resolvedDom = _this.buildProperty(value, label);
            dom.replaceWith(resolvedDom);
        });
        return dom.el;
    };
    Debug.prototype.buildObjectProperty = function (object, label) {
        var _this = this;
        var dom = Dom_1.$$('div', {
            className: 'coveo-property coveo-property-object'
        });
        var valueContainer = Dom_1.$$('div', {
            className: 'coveo-property-value'
        });
        var keys = _.keys(object);
        if (!_.isArray(object)) {
            keys.sort();
        }
        var children;
        var buildKeys = function () {
            if (children == null) {
                children = [];
                _.each(keys, function (key) {
                    var property = _this.buildProperty(object[key], key);
                    if (property != null) {
                        children.push(property);
                        valueContainer.append(property);
                    }
                });
            }
            return children;
        };
        dom.el['buildKeys'] = buildKeys;
        if (label != null) {
            var labelDom = Dom_1.$$('div', {
                className: 'coveo-property-label'
            });
            labelDom.text(label);
            dom.el['labelDom'] = labelDom.el;
            dom.append(labelDom.el);
            if (keys.length != 0) {
                dom.addClass('coveo-collapsible');
                labelDom.on('click', function () {
                    buildKeys();
                    var className = dom.el.className.split(/\s+/);
                    if (_.contains(className, 'coveo-expanded')) {
                        className = _.without(className, 'coveo-expanded');
                    }
                    else {
                        className.push('coveo-expanded');
                    }
                    dom.el.className = className.join(' ');
                });
            }
        }
        else {
            buildKeys();
        }
        if (keys.length == 0) {
            var className = _.without(dom.el.className.split(/\s+/), 'coveo-property-object');
            className.push('coveo-property-basic');
            dom.el.className = className.join(' ');
            if (_.isArray(object)) {
                valueContainer.setHtml('[]');
            }
            else {
                valueContainer.setHtml('{}');
            }
            dom.el['values'] = '';
        }
        dom.el['label'] = label != null ? label.toLowerCase() : '';
        dom.append(valueContainer.el);
        return dom.el;
    };
    Debug.prototype.buildBasicProperty = function (value, label) {
        var _this = this;
        var dom = Dom_1.$$('div', {
            className: 'coveo-property coveo-property-basic'
        });
        if (label != null) {
            var labelDom = Dom_1.$$('div', {
                className: 'coveo-property-label'
            });
            labelDom.text(label);
            dom.append(labelDom.el);
            dom.el['labelDom'] = labelDom.el;
        }
        var stringValue = value != null ? value.toString() : String(value);
        if (value != null && value['ref'] != null) {
            value = value['ref'];
        }
        var valueDom = Dom_1.$$('div');
        valueDom.text(stringValue);
        valueDom.on('dblclick', function () {
            _this.selectElementText(valueDom.el);
        });
        dom.append(valueDom.el);
        dom.el['valueDom'] = valueDom;
        var className = ['coveo-property-value'];
        if (_.isString(value)) {
            className.push('coveo-property-value-string');
        }
        if (_.isNull(value) || _.isUndefined(value)) {
            className.push('coveo-property-value-null');
        }
        if (_.isNumber(value)) {
            className.push('coveo-property-value-number');
        }
        if (_.isBoolean(value)) {
            className.push('coveo-property-value-boolean');
        }
        if (_.isDate(value)) {
            className.push('coveo-property-value-date');
        }
        if (_.isObject(value)) {
            className.push('coveo-property-value-object');
        }
        if (_.isArray(value)) {
            className.push('coveo-property-value-array');
        }
        valueDom.el.className = className.join(' ');
        dom.el['label'] = label != null ? label.toLowerCase() : '';
        dom.el['values'] = stringValue.toLowerCase();
        return dom.el;
    };
    Debug.prototype.toJson = function (value, depth, done) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        if (done === void 0) { done = []; }
        if (value instanceof BaseComponent_1.BaseComponent || value instanceof SearchEndpoint_1.SearchEndpoint) {
            return this.componentToJson(value, depth);
        }
        if (value instanceof HTMLElement) {
            return this.htmlToJson(value);
        }
        if (value instanceof Template_1.Template) {
            return this.templateToJson(value);
        }
        if (value instanceof Promise) {
            return value.then(function (value) {
                return _this.toJson(value, depth, done);
            });
        }
        if (value == window) {
            return this.toJsonRef(value);
        }
        if (_.isArray(value) || _.isObject(value)) {
            if (_.contains(done, value)) {
                return this.toJsonRef(value, '< RECURSIVE >');
            }
            else if (depth >= Debug.maxDepth) {
                return this.toJsonRef(value);
            }
            else if (_.isArray(value)) {
                return _.map(value, function (subValue, key) { return _this.toJson(subValue, depth + 1, done.concat([value])); });
            }
            else if (_.isDate(value)) {
                return this.toJsonRef(value, Globalize.format(value, 'F'));
            }
            else {
                var result_1 = {};
                _.each(value, function (subValue, key) {
                    result_1[key] = _this.toJson(subValue, depth + 1, done.concat([value]));
                });
                result_1['ref'];
                return result_1;
            }
        }
        return value;
    };
    Debug.prototype.toJsonRef = function (value, stringValue) {
        stringValue = new String(stringValue || value);
        stringValue['ref'] = value;
        return stringValue;
    };
    Debug.prototype.componentToJson = function (value, depth) {
        if (depth === void 0) { depth = 0; }
        var options = _.keys(value['options']);
        if (options.length > 0) {
            return this.toJson(value['options'], depth);
        }
        else {
            return this.toJsonRef(value['options'], new String('No options'));
        }
    };
    Debug.prototype.htmlToJson = function (value) {
        if (value == null) {
            return undefined;
        }
        return {
            tagName: value.tagName,
            id: value.id,
            classList: value.className.split(/\s+/)
        };
    };
    Debug.prototype.templateToJson = function (template) {
        if (template == null) {
            return null;
        }
        var element = template['element'];
        var templateObject = {
            type: template.getType(),
        };
        if (element != null) {
            templateObject.id = element.id;
            templateObject.condition = element.attributes['data-condition'];
            templateObject.content = element.innerText;
        }
        return templateObject;
    };
    Debug.prototype.selectElementText = function (el) {
        if (window.getSelection && document.createRange) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(el);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        else if ('createTextRange' in document.body) {
            var textRange = document.body['createTextRange']();
            textRange.moveToElementText(el);
            textRange.select();
        }
    };
    Debug.prototype.search = function (value, body) {
        var _this = this;
        if (_.isEmpty(value)) {
            Dom_1.$$(body).findAll('.coveo-search-match, .coveo-search-submatch').forEach(function (el) {
                Dom_1.$$(el).removeClass('coveo-search-match, coveo-search-submatch');
            });
            Dom_1.$$(body).removeClass('coveo-searching');
        }
        else {
            Dom_1.$$(body).addClass('coveo-searching-loading');
            setTimeout(function () {
                var rootProperties = Dom_1.$$(body).findAll('.coveo-section .coveo-section-container > .coveo-property');
                _.each(rootProperties, function (element) {
                    _this.findInProperty(element, value);
                });
                Dom_1.$$(body).addClass('coveo-searching');
                Dom_1.$$(body).removeClass('coveo-searching-loading');
            });
        }
    };
    Debug.prototype.highlightSearch = function (element, search) {
        if (element != null) {
            var match = element.innerText.split(new RegExp('(?=' + StringUtils_1.StringUtils.regexEncode(search) + ')', 'gi'));
            element.innerHTML = '';
            match.forEach(function (value) {
                var regex = new RegExp('(' + StringUtils_1.StringUtils.regexEncode(search) + ')', 'i');
                var group = value.match(regex);
                var span;
                if (group != null) {
                    span = Dom_1.$$('span', {
                        className: 'coveo-debug-highlight'
                    });
                    span.text(group[1]);
                    element.appendChild(span.el);
                    span = Dom_1.$$('span');
                    span.text(value.substr(group[1].length));
                    element.appendChild(span.el);
                }
                else {
                    span = Dom_1.$$('span');
                    span.text(value);
                    element.appendChild(span.el);
                }
            });
        }
    };
    Debug.prototype.removeHighlightSearch = function (element) {
        if (element != null) {
            element.innerHTML = element.innerText;
        }
    };
    Debug.prototype.showAnimationDuringQuery = function () {
        Dom_1.$$(this.modalBox.content).addClass('coveo-debug-loading');
    };
    Debug.prototype.hideAnimationDuringQuery = function () {
        Dom_1.$$(this.modalBox.content).removeClass('coveo-debug-loading');
    };
    return Debug;
}(RootComponent_1.RootComponent));
Debug.ID = 'Debug';
Debug.options = {
    enableDebug: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
};
Debug.customOrder = ['error', 'queryDuration', 'result', 'fields', 'rankingInfo', 'template', 'query', 'results', 'state'];
Debug.durationKeys = ['indexDuration', 'proxyDuration', 'clientDuration', 'duration'];
Debug.maxDepth = 10;
exports.Debug = Debug;


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StringUtils_1 = __webpack_require__(18);
var _ = __webpack_require__(0);
var DebugForResult = (function () {
    function DebugForResult(bindings) {
        this.bindings = bindings;
    }
    DebugForResult.prototype.generateDebugInfoForResult = function (result) {
        var _this = this;
        return {
            result: result,
            fields: function () { return _this.buildFieldsSection(result); },
            rankingInfo: function () { return _this.buildRankingInfoSection(result); },
        };
    };
    DebugForResult.prototype.fetchFields = function () {
        var _this = this;
        if (this.fields == null) {
            return this.bindings.queryController.getEndpoint().listFields().then(function (fields) {
                _this.fields = {};
                fields.forEach(function (field) {
                    _this.fields[field.name] = field;
                });
                return _this.fields;
            });
        }
        else {
            return Promise.resolve(this.fields);
        }
    };
    DebugForResult.prototype.buildRankingInfoSection = function (result) {
        return result.rankingInfo && this.parseRankingInfo(result.rankingInfo);
    };
    DebugForResult.prototype.parseWeights = function (value) {
        var listOfWeight = value.match(/(\w+(?:\s\w+)*): ([-0-9]+)/g);
        return _.object(_.map(listOfWeight, function (weight) {
            var weightGroup = weight.match(/^(\w+(?:\s\w+)*): ([-0-9]+)$/);
            return [weightGroup[1], Number(weightGroup[2])];
        }));
    };
    DebugForResult.prototype.buildFieldsSection = function (result) {
        return this.fetchFields()
            .then(function (fieldDescriptions) {
            var fields = {};
            _.each(result.raw, function (value, key) {
                var fieldDescription = fieldDescriptions['@' + key];
                if (fieldDescription == null && key.match(/^sys/)) {
                    fieldDescription = fieldDescriptions['@' + key.substr(3)];
                }
                if (fieldDescription == null) {
                    fields['@' + key] = value;
                }
                else if (fieldDescription.fieldType == 'Date') {
                    fields['@' + key] = new Date(value);
                }
                else if (fieldDescription.splitGroupByField && _.isString(value)) {
                    fields['@' + key] = value.split(/\s*;\s*/);
                }
                else {
                    fields['@' + key] = value;
                }
            });
            return fields;
        });
    };
    DebugForResult.prototype.parseRankingInfo = function (value) {
        var _this = this;
        var rankingInfo = {};
        if (value) {
            var documentWeights = /Document weights:\n((?:.)*?)\n+/g.exec(value);
            var termsWeight = /Terms weights:\n((?:.|\n)*)\n+/g.exec(value);
            var totalWeight = /Total weight: ([0-9]+)/g.exec(value);
            if (documentWeights && documentWeights[1]) {
                rankingInfo['Document weights'] = this.parseWeights(documentWeights[1]);
            }
            if (totalWeight && totalWeight[1]) {
                rankingInfo['Total weight'] = Number(totalWeight[1]);
            }
            if (termsWeight && termsWeight[1]) {
                var terms = StringUtils_1.StringUtils.match(termsWeight[1], /((?:[^:]+: [0-9]+, [0-9]+; )+)\n((?:\w+: [0-9]+; )+)/g);
                rankingInfo['Terms weights'] = _.object(_.map(terms, function (term) {
                    var words = _.object(_.map(StringUtils_1.StringUtils.match(term[1], /([^:]+): ([0-9]+), ([0-9]+); /g), function (word) {
                        return [
                            word[1],
                            {
                                Correlation: Number(word[2]),
                                'TF-IDF': Number(word[3]),
                            }
                        ];
                    }));
                    var weights = _this.parseWeights(term[2]);
                    return [
                        _.keys(words).join(', '),
                        {
                            terms: words,
                            Weights: weights
                        }
                    ];
                }));
            }
        }
        return rankingInfo;
    };
    return DebugForResult;
}());
exports.DebugForResult = DebugForResult;


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Checkbox_1 = __webpack_require__(59);
var ComponentOptionsModel_1 = __webpack_require__(24);
var TextInput_1 = __webpack_require__(43);
var Dom_1 = __webpack_require__(2);
var ResultListEvents_1 = __webpack_require__(29);
var QueryEvents_1 = __webpack_require__(10);
var InitializationEvents_1 = __webpack_require__(14);
var circular_json_1 = __webpack_require__(212);
var DebugHeader = (function () {
    function DebugHeader(root, element, bindings, onSearch, infoToDebug) {
        var _this = this;
        this.root = root;
        this.element = element;
        this.bindings = bindings;
        this.onSearch = onSearch;
        this.infoToDebug = infoToDebug;
        this.debug = false;
        this.enableQuerySyntax = false;
        this.highlightRecommendation = false;
        this.element.appendChild(this.buildEnabledHighlightRecommendation());
        this.element.appendChild(this.buildEnableDebugCheckbox());
        this.element.appendChild(this.buildEnableQuerySyntaxCheckbox());
        this.element.appendChild(this.buildSearch());
        this.element.appendChild(this.buildDownloadLink());
        // After components initialization ensure any component that might modify the result will have the chance to do their job before we display debug info
        Dom_1.$$(this.root).on(InitializationEvents_1.InitializationEvents.afterInitialization, function () {
            Dom_1.$$(_this.root).on(ResultListEvents_1.ResultListEvents.newResultDisplayed, function (e, args) { return _this.handleNewResultDisplayed(args); });
        });
        Dom_1.$$(this.root).on(QueryEvents_1.QueryEvents.buildingQuery, function (e, args) { return _this.handleBuildingQuery(args); });
    }
    DebugHeader.prototype.handleNewResultDisplayed = function (args) {
        if (args.item != null && args.result.isRecommendation && this.highlightRecommendation) {
            Dom_1.$$(args.item).addClass('coveo-is-recommendation');
        }
    };
    DebugHeader.prototype.handleBuildingQuery = function (args) {
        args.queryBuilder.enableDebug = this.debug || args.queryBuilder.enableDebug;
    };
    DebugHeader.prototype.buildSearch = function () {
        var _this = this;
        var txtInput = new TextInput_1.TextInput(function (txtInputInstance) {
            var value = txtInputInstance.getValue().toLowerCase();
            _this.onSearch(value);
        }, 'Search in debug');
        this.search = txtInput.build();
        return this.search;
    };
    DebugHeader.prototype.buildDownloadLink = function () {
        var downloadLink = Dom_1.$$('a', {
            download: 'debug.json',
            'href': this.downloadHref()
        }, 'Download');
        return downloadLink.el;
    };
    DebugHeader.prototype.buildEnableDebugCheckbox = function () {
        var _this = this;
        var checkbox = new Checkbox_1.Checkbox(function (chkboxInstance) {
            _this.debug = chkboxInstance.isSelected();
            _this.bindings.queryController.executeQuery({
                closeModalBox: false
            });
            var input = _this.search.querySelector('input');
            input.value = '';
        }, 'Enable query debug');
        if (this.debug) {
            checkbox.select();
        }
        return checkbox.build();
    };
    DebugHeader.prototype.buildEnableQuerySyntaxCheckbox = function () {
        var _this = this;
        var checkbox = new Checkbox_1.Checkbox(function (chkboxInstance) {
            _this.enableQuerySyntax = chkboxInstance.isSelected();
            _this.bindings.componentOptionsModel.set(ComponentOptionsModel_1.COMPONENT_OPTIONS_ATTRIBUTES.SEARCH_BOX, { enableQuerySyntax: _this.enableQuerySyntax });
            _this.bindings.queryController.executeQuery({
                closeModalBox: false
            });
        }, 'Enable query syntax in search box');
        if (this.enableQuerySyntax) {
            checkbox.select();
        }
        return checkbox.build();
    };
    DebugHeader.prototype.buildEnabledHighlightRecommendation = function () {
        var _this = this;
        var checkbox = new Checkbox_1.Checkbox(function (chkboxInstance) {
            _this.highlightRecommendation = chkboxInstance.isSelected();
            _this.bindings.queryController.executeQuery({
                closeModalBox: false
            });
        }, 'Highlight recommendation');
        if (this.highlightRecommendation) {
            checkbox.select();
        }
        return checkbox.build();
    };
    DebugHeader.prototype.downloadHref = function () {
        return 'data:text/json;charset=utf-8,' + encodeURIComponent(circular_json_1.stringify(this.infoToDebug));
    };
    return DebugHeader;
}());
exports.DebugHeader = DebugHeader;


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var fields = [
    'urihash'
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('FollowItem', fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var fields = [
    'objecttype',
    'filetype',
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('Icon', fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var fields = [
    'parents'
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('PrintableUri', fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var fields = [
    'urihash',
    'collection',
    'source',
    'author' // analytics
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('Quickview', fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
exports.fields = [
    'outlookformacuri',
    'outlookuri',
    'connectortype',
    'urihash',
    'collection',
    'source',
    'author' // analytics
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('ResultLink', exports.fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var TemplateFieldsEvaluator = (function () {
    function TemplateFieldsEvaluator() {
    }
    TemplateFieldsEvaluator.evaluateFieldsToMatch = function (toMatches, result) {
        var templateShouldBeLoaded = true;
        _.each(toMatches, function (toMatch) {
            var matchAtLeastOnce = false;
            if (!toMatch.values) {
                matchAtLeastOnce = result.raw[toMatch.field] != null;
            }
            else {
                _.each(toMatch.values, function (value) {
                    if (!matchAtLeastOnce) {
                        matchAtLeastOnce = result.raw[toMatch.field] && result.raw[toMatch.field].toLowerCase() == value.toLowerCase();
                    }
                });
            }
            templateShouldBeLoaded = templateShouldBeLoaded && matchAtLeastOnce;
        });
        return templateShouldBeLoaded;
    };
    return TemplateFieldsEvaluator;
}());
exports.TemplateFieldsEvaluator = TemplateFieldsEvaluator;


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var fields = [
    'outlookformacuri',
    'outlookuri',
    'connectortype',
    'urihash',
    'collection',
    'source' //        ⎭
];
function registerFields() {
    Initialization_1.Initialization.registerComponentFields('Thumbnail', fields);
}
exports.registerFields = registerFields;


/***/ }),
/* 266 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 267 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 268 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 269 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */,
/* 381 */,
/* 382 */,
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */,
/* 428 */,
/* 429 */,
/* 430 */,
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */,
/* 440 */,
/* 441 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(235));
var SearchInterface_1 = __webpack_require__(19);
exports.SearchInterface = SearchInterface_1.SearchInterface;
exports.StandaloneSearchInterface = SearchInterface_1.StandaloneSearchInterface;
var PublicPathUtils_1 = __webpack_require__(141);
PublicPathUtils_1.PublicPathUtils.detectPublicPath();
var Initialization_1 = __webpack_require__(1);
Initialization_1.Initialization.componentsFactory = Initialization_1.LazyInitialization.componentsFactory;
var Initialization_2 = __webpack_require__(1);
exports.LazyInitialization = Initialization_2.LazyInitialization;
exports.EagerInitialization = Initialization_2.EagerInitialization;
exports.Initialization = Initialization_2.Initialization;
var Analytics_1 = __webpack_require__(250);
Analytics_1.Analytics.doExport();
var LazyAdvancedSearch_1 = __webpack_require__(626);
LazyAdvancedSearch_1.lazyAdvancedSearch();
var LazyAggregate_1 = __webpack_require__(627);
LazyAggregate_1.lazyAggregate();
var LazyAnalyticsSuggestions_1 = __webpack_require__(628);
LazyAnalyticsSuggestions_1.lazyAnalyticsSuggestions();
var LazyAuthenticationProvider_1 = __webpack_require__(629);
LazyAuthenticationProvider_1.lazyAuthenticationProvider();
var LazyBackdrop_1 = __webpack_require__(630);
LazyBackdrop_1.lazyBackdrop();
var LazyBadge_1 = __webpack_require__(631);
LazyBadge_1.lazyBadge();
var LazyBreadcrumb_1 = __webpack_require__(632);
LazyBreadcrumb_1.lazyBreadcrumb();
var LazyCardActionBar_1 = __webpack_require__(633);
LazyCardActionBar_1.lazyCardActionBar();
var LazyCardOverlay_1 = __webpack_require__(634);
LazyCardOverlay_1.lazyCardOverlay();
var LazyChatterLikedBy_1 = __webpack_require__(635);
LazyChatterLikedBy_1.lazyChatterLikedBy();
var ChatterLikedByFields_1 = __webpack_require__(252);
ChatterLikedByFields_1.registerFields();
var LazyChatterPostAttachment_1 = __webpack_require__(636);
LazyChatterPostAttachment_1.lazyChatterPostAttachment();
var ChatterPostAttachmentFields_1 = __webpack_require__(253);
ChatterPostAttachmentFields_1.registerFields();
var LazyChatterPostedBy_1 = __webpack_require__(637);
LazyChatterPostedBy_1.lazyChatterPostedBy();
var ChatterPostedByFields_1 = __webpack_require__(254);
ChatterPostedByFields_1.registerFields();
var LazyChatterTopic_1 = __webpack_require__(638);
LazyChatterTopic_1.lazyChatterTopic();
var ChatterTopicFields_1 = __webpack_require__(255);
ChatterTopicFields_1.registerFields();
var LazyDidYouMean_1 = __webpack_require__(639);
LazyDidYouMean_1.lazyDidYouMean();
var LazyErrorReport_1 = __webpack_require__(640);
LazyErrorReport_1.lazyErrorReport();
var LazyExcerpt_1 = __webpack_require__(641);
LazyExcerpt_1.lazyExcerpt();
var LazyExportToExcel_1 = __webpack_require__(642);
LazyExportToExcel_1.lazyExportToExcel();
var LazyFacet_1 = __webpack_require__(643);
LazyFacet_1.lazyFacet();
var LazyFacetRange_1 = __webpack_require__(644);
LazyFacetRange_1.lazyFacetRange();
var LazyFacetSlider_1 = __webpack_require__(645);
LazyFacetSlider_1.lazyFacetSlider();
var LazyFieldSuggestions_1 = __webpack_require__(646);
LazyFieldSuggestions_1.lazyFieldSuggestions();
var LazyFieldTable_1 = __webpack_require__(647);
LazyFieldTable_1.lazyFieldTable();
var LazyFieldValue_1 = __webpack_require__(648);
LazyFieldValue_1.lazyFieldValue();
var LazyFolding_1 = __webpack_require__(649);
LazyFolding_1.lazyFolding();
var LazyFoldingForThread_1 = __webpack_require__(650);
LazyFoldingForThread_1.lazyFoldingForThread();
var LazyHiddenQuery_1 = __webpack_require__(660);
LazyHiddenQuery_1.lazyHiddenQuery();
var LazyHierarchicalFacet_1 = __webpack_require__(661);
LazyHierarchicalFacet_1.lazyHierarchicalFacet();
var LazyIcon_1 = __webpack_require__(662);
LazyIcon_1.lazyIcon();
var IconFields_1 = __webpack_require__(260);
IconFields_1.registerFields();
var LazyLogo_1 = __webpack_require__(663);
LazyLogo_1.lazyLogo();
var LazyMatrix_1 = __webpack_require__(664);
LazyMatrix_1.lazyMatrix();
var LazyOmnibox_1 = __webpack_require__(665);
LazyOmnibox_1.lazyOmnibox();
var LazyOmniboxResultList_1 = __webpack_require__(666);
LazyOmniboxResultList_1.lazyOmniboxResultList();
var LazyPager_1 = __webpack_require__(667);
LazyPager_1.lazyPager();
var LazyPipelineContext_1 = __webpack_require__(668);
LazyPipelineContext_1.lazyPipelineContext();
var LazyPreferencesPanel_1 = __webpack_require__(669);
LazyPreferencesPanel_1.lazyPreferencesPanel();
var LazyPrintableUri_1 = __webpack_require__(670);
LazyPrintableUri_1.lazyPrintableUri();
var PrintableUriFields_1 = __webpack_require__(261);
PrintableUriFields_1.registerFields();
var LazyQuerybox_1 = __webpack_require__(673);
LazyQuerybox_1.lazyQuerybox();
var LazyQueryDuration_1 = __webpack_require__(671);
LazyQueryDuration_1.lazyQueryDuration();
var LazyQuerySummary_1 = __webpack_require__(672);
LazyQuerySummary_1.lazyQuerySummary();
var LazyQuickview_1 = __webpack_require__(674);
LazyQuickview_1.lazyQuickview();
var QuickviewFields_1 = __webpack_require__(262);
QuickviewFields_1.registerFields();
var LazyRecommendation_1 = __webpack_require__(675);
LazyRecommendation_1.lazyRecommendation();
var LazyResultAttachments_1 = __webpack_require__(676);
LazyResultAttachments_1.lazyResultAttachment();
var LazyResultFolding_1 = __webpack_require__(677);
LazyResultFolding_1.lazyResultFolding();
var LazyResultLayout_1 = __webpack_require__(678);
LazyResultLayout_1.lazyResultLayout();
var LazyResultLink_1 = __webpack_require__(679);
LazyResultLink_1.lazyResultLink();
var ResultLinkFields_1 = __webpack_require__(263);
ResultLinkFields_1.registerFields();
var LazyResultList_1 = __webpack_require__(680);
LazyResultList_1.lazyResultList();
var LazyResultRating_1 = __webpack_require__(681);
LazyResultRating_1.lazyResultRating();
var LazyResultsFiltersPreferences_1 = __webpack_require__(683);
LazyResultsFiltersPreferences_1.lazyResultsFiltersPreferences();
var LazyResultsPerPage_1 = __webpack_require__(684);
LazyResultsPerPage_1.lazyResultsPerPage();
var LazyResultsPreferences_1 = __webpack_require__(685);
LazyResultsPreferences_1.lazyResultsPreferences();
var LazyResultTagging_1 = __webpack_require__(682);
LazyResultTagging_1.lazyResultTagging();
var LazyFollowItem_1 = __webpack_require__(651);
LazyFollowItem_1.lazyFollowItem();
var FollowItemFields_1 = __webpack_require__(259);
FollowItemFields_1.registerFields();
var LazySearchAlerts_1 = __webpack_require__(686);
LazySearchAlerts_1.lazySearchAlerts();
var LazySearchbox_1 = __webpack_require__(688);
LazySearchbox_1.lazySearchbox();
var LazySearchButton_1 = __webpack_require__(687);
LazySearchButton_1.lazySearchButton();
var LazySettings_1 = __webpack_require__(689);
LazySettings_1.lazySettings();
var LazyShareQuery_1 = __webpack_require__(690);
LazyShareQuery_1.lazyShareQuery();
var LazySort_1 = __webpack_require__(691);
LazySort_1.lazySort();
var LazyTab_1 = __webpack_require__(692);
LazyTab_1.lazyTab();
var LazyTemplateLoader_1 = __webpack_require__(693);
LazyTemplateLoader_1.lazyTemplateLoader();
var LazyText_1 = __webpack_require__(694);
LazyText_1.lazyText();
var LazyThumbnail_1 = __webpack_require__(695);
LazyThumbnail_1.lazyThumbnail();
var ThumbnailFields_1 = __webpack_require__(265);
ThumbnailFields_1.registerFields();
var LazyTriggers_1 = __webpack_require__(696);
LazyTriggers_1.lazyTriggers();
var LazyYouTubeThumbnail_1 = __webpack_require__(697);
LazyYouTubeThumbnail_1.lazyYouTubeThumbnail();
var YouTubeThumbnailFields_1 = __webpack_require__(140);
YouTubeThumbnailFields_1.registerFields();
var LazyCheckbox_1 = __webpack_require__(652);
LazyCheckbox_1.lazyCheckbox();
var LazyDatePicker_1 = __webpack_require__(653);
LazyDatePicker_1.lazyDatePicker();
var LazyDropdown_1 = __webpack_require__(654);
LazyDropdown_1.lazyDropdown();
var LazyFormGroup_1 = __webpack_require__(655);
LazyFormGroup_1.lazyFormGroup();
var LazyMultiSelect_1 = __webpack_require__(656);
LazyMultiSelect_1.lazyMultiSelect();
var LazyNumericSpinner_1 = __webpack_require__(657);
LazyNumericSpinner_1.lazyNumericSpinner();
var LazyRadioButton_1 = __webpack_require__(658);
LazyRadioButton_1.lazyRadioButton();
var LazyTextInput_1 = __webpack_require__(659);
LazyTextInput_1.lazyTextInput();
var SwapVar_1 = __webpack_require__(240);
SwapVar_1.swapVar(this);


/***/ }),
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */,
/* 454 */,
/* 455 */,
/* 456 */,
/* 457 */,
/* 458 */,
/* 459 */,
/* 460 */,
/* 461 */,
/* 462 */,
/* 463 */,
/* 464 */,
/* 465 */,
/* 466 */,
/* 467 */,
/* 468 */,
/* 469 */,
/* 470 */,
/* 471 */,
/* 472 */,
/* 473 */,
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */,
/* 481 */,
/* 482 */,
/* 483 */,
/* 484 */,
/* 485 */,
/* 486 */,
/* 487 */,
/* 488 */,
/* 489 */,
/* 490 */,
/* 491 */,
/* 492 */,
/* 493 */,
/* 494 */,
/* 495 */,
/* 496 */,
/* 497 */,
/* 498 */,
/* 499 */,
/* 500 */,
/* 501 */,
/* 502 */,
/* 503 */,
/* 504 */,
/* 505 */,
/* 506 */,
/* 507 */,
/* 508 */,
/* 509 */,
/* 510 */,
/* 511 */,
/* 512 */,
/* 513 */,
/* 514 */,
/* 515 */,
/* 516 */,
/* 517 */,
/* 518 */,
/* 519 */,
/* 520 */,
/* 521 */,
/* 522 */,
/* 523 */,
/* 524 */,
/* 525 */,
/* 526 */,
/* 527 */,
/* 528 */,
/* 529 */,
/* 530 */,
/* 531 */,
/* 532 */,
/* 533 */,
/* 534 */,
/* 535 */,
/* 536 */,
/* 537 */,
/* 538 */,
/* 539 */,
/* 540 */,
/* 541 */,
/* 542 */,
/* 543 */,
/* 544 */,
/* 545 */,
/* 546 */,
/* 547 */,
/* 548 */,
/* 549 */,
/* 550 */,
/* 551 */,
/* 552 */,
/* 553 */,
/* 554 */,
/* 555 */,
/* 556 */,
/* 557 */,
/* 558 */,
/* 559 */,
/* 560 */,
/* 561 */,
/* 562 */,
/* 563 */,
/* 564 */,
/* 565 */,
/* 566 */,
/* 567 */,
/* 568 */,
/* 569 */,
/* 570 */,
/* 571 */,
/* 572 */,
/* 573 */,
/* 574 */,
/* 575 */,
/* 576 */,
/* 577 */,
/* 578 */,
/* 579 */,
/* 580 */,
/* 581 */,
/* 582 */,
/* 583 */,
/* 584 */,
/* 585 */,
/* 586 */,
/* 587 */,
/* 588 */,
/* 589 */,
/* 590 */,
/* 591 */,
/* 592 */,
/* 593 */,
/* 594 */,
/* 595 */,
/* 596 */,
/* 597 */,
/* 598 */,
/* 599 */,
/* 600 */,
/* 601 */,
/* 602 */,
/* 603 */,
/* 604 */,
/* 605 */,
/* 606 */,
/* 607 */,
/* 608 */,
/* 609 */,
/* 610 */,
/* 611 */,
/* 612 */,
/* 613 */,
/* 614 */,
/* 615 */,
/* 616 */,
/* 617 */,
/* 618 */,
/* 619 */,
/* 620 */,
/* 621 */,
/* 622 */,
/* 623 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 624 */
/***/ (function(module, exports) {

module.exports = " ../image/retinaNew.png";

/***/ }),
/* 625 */
/***/ (function(module, exports) {

module.exports = " ../image/spritesNew.png";

/***/ }),
/* 626 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GlobalExports_1 = __webpack_require__(3);
var Initialization_1 = __webpack_require__(1);
function lazyAdvancedSearch() {
    Initialization_1.LazyInitialization.registerLazyComponent('AdvancedSearch', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(1).then((function () {
                var loaded = __webpack_require__(161)['AdvancedSearch'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('AdvancedSearch'));
        });
    });
}
exports.lazyAdvancedSearch = lazyAdvancedSearch;


/***/ }),
/* 627 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GlobalExports_1 = __webpack_require__(3);
var Initialization_1 = __webpack_require__(1);
function lazyAggregate() {
    Initialization_1.LazyInitialization.registerLazyComponent('Aggregate', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(69).then((function () {
                var loaded = __webpack_require__(162)['Aggregate'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Aggregate'));
        });
    });
}
exports.lazyAggregate = lazyAggregate;


/***/ }),
/* 628 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GlobalExports_1 = __webpack_require__(3);
var Initialization_1 = __webpack_require__(1);
function lazyAnalyticsSuggestions() {
    Initialization_1.LazyInitialization.registerLazyComponent('AnalyticsSuggestions', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(36).then((function () {
                var loaded = __webpack_require__(163)['AnalyticsSuggestions'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('AnalyticsSuggestions'));
        });
    });
}
exports.lazyAnalyticsSuggestions = lazyAnalyticsSuggestions;


/***/ }),
/* 629 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyAuthenticationProvider() {
    Initialization_1.LazyInitialization.registerLazyComponent('AuthenticationProvider', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(58).then((function () {
                var loaded = __webpack_require__(164)['AuthenticationProvider'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('AuthenticationProvider'));
        });
    });
}
exports.lazyAuthenticationProvider = lazyAuthenticationProvider;


/***/ }),
/* 630 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyBackdrop() {
    Initialization_1.LazyInitialization.registerLazyComponent('Backdrop', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(15).then((function () {
                var loaded = __webpack_require__(165)['Backdrop'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Backdrop'));
        });
    });
}
exports.lazyBackdrop = lazyBackdrop;


/***/ }),
/* 631 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyBadge() {
    Initialization_1.LazyInitialization.registerLazyComponent('Badge', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(35).then((function () {
                var loaded = __webpack_require__(166)['Badge'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Badge'));
        });
    });
}
exports.lazyBadge = lazyBadge;


/***/ }),
/* 632 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyBreadcrumb() {
    Initialization_1.LazyInitialization.registerLazyComponent('Breadcrumb', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(57).then((function () {
                var loaded = __webpack_require__(167)['Breadcrumb'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Breadcrumb'));
        });
    });
}
exports.lazyBreadcrumb = lazyBreadcrumb;


/***/ }),
/* 633 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyCardActionBar() {
    Initialization_1.LazyInitialization.registerLazyComponent('CardActionBar', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(56).then((function () {
                var loaded = __webpack_require__(168)['CardActionBar'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('CardActionBar'));
        });
    });
}
exports.lazyCardActionBar = lazyCardActionBar;


/***/ }),
/* 634 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyCardOverlay() {
    Initialization_1.LazyInitialization.registerLazyComponent('CardOverlay', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(28).then((function () {
                var loaded = __webpack_require__(169)['CardOverlay'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('CardOverlay'));
        });
    });
}
exports.lazyCardOverlay = lazyCardOverlay;


/***/ }),
/* 635 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyChatterLikedBy() {
    Initialization_1.LazyInitialization.registerLazyComponent('ChatterLikedBy', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(34).then((function () {
                var loaded = __webpack_require__(170)['ChatterLikedBy'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ChatterLikedBy'));
        });
    });
}
exports.lazyChatterLikedBy = lazyChatterLikedBy;


/***/ }),
/* 636 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyChatterPostAttachment() {
    Initialization_1.LazyInitialization.registerLazyComponent('ChatterPostAttachment', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(33).then((function () {
                var loaded = __webpack_require__(171)['ChatterPostAttachment'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ChatterPostAttachment'));
        });
    });
}
exports.lazyChatterPostAttachment = lazyChatterPostAttachment;


/***/ }),
/* 637 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyChatterPostedBy() {
    Initialization_1.LazyInitialization.registerLazyComponent('ChatterPostedBy', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(32).then((function () {
                var loaded = __webpack_require__(172)['ChatterPostedBy'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ChatterPostedBy'));
        });
    });
}
exports.lazyChatterPostedBy = lazyChatterPostedBy;


/***/ }),
/* 638 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyChatterTopic() {
    Initialization_1.LazyInitialization.registerLazyComponent('ChatterTopic', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(68).then((function () {
                var loaded = __webpack_require__(173)['ChatterTopic'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ChatterTopic'));
        });
    });
}
exports.lazyChatterTopic = lazyChatterTopic;


/***/ }),
/* 639 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyDidYouMean() {
    Initialization_1.LazyInitialization.registerLazyComponent('DidYouMean', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(55).then((function () {
                var loaded = __webpack_require__(174)['DidYouMean'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('DidYouMean'));
        });
    });
}
exports.lazyDidYouMean = lazyDidYouMean;


/***/ }),
/* 640 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyErrorReport() {
    Initialization_1.LazyInitialization.registerLazyComponent('ErrorReport', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(54).then((function () {
                var loaded = __webpack_require__(175)['ErrorReport'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ErrorReport'));
        });
    });
}
exports.lazyErrorReport = lazyErrorReport;


/***/ }),
/* 641 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyExcerpt() {
    Initialization_1.LazyInitialization.registerLazyComponent('Excerpt', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(53).then((function () {
                var loaded = __webpack_require__(176)['Excerpt'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Excerpt'));
        });
    });
}
exports.lazyExcerpt = lazyExcerpt;


/***/ }),
/* 642 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyExportToExcel() {
    Initialization_1.LazyInitialization.registerLazyComponent('ExportToExcel', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(52).then((function () {
                var loaded = __webpack_require__(177)['ExportToExcel'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ExportToExcel'));
        });
    });
}
exports.lazyExportToExcel = lazyExportToExcel;


/***/ }),
/* 643 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyFacet() {
    Initialization_1.LazyInitialization.registerLazyComponent('Facet', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(5).then((function () {
                var loaded = __webpack_require__(54)['Facet'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Facet'));
        });
    });
}
exports.lazyFacet = lazyFacet;


/***/ }),
/* 644 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyFacetRange() {
    Initialization_1.LazyInitialization.registerLazyComponent('FacetRange', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(4).then((function () {
                var loaded = __webpack_require__(178)['FacetRange'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('FacetRange'));
        });
    });
}
exports.lazyFacetRange = lazyFacetRange;


/***/ }),
/* 645 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyFacetSlider() {
    Initialization_1.LazyInitialization.registerLazyComponent('FacetSlider', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(0).then((function () {
                var loaded = __webpack_require__(131)['FacetSlider'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('FacetSlider'));
        });
    });
}
exports.lazyFacetSlider = lazyFacetSlider;


/***/ }),
/* 646 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyFieldSuggestions() {
    Initialization_1.LazyInitialization.registerLazyComponent('FieldSuggestions', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(31).then((function () {
                var loaded = __webpack_require__(179)['FieldSuggestions'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('FieldSuggestions'));
        });
    });
}
exports.lazyFieldSuggestions = lazyFieldSuggestions;


/***/ }),
/* 647 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyFieldTable() {
    Initialization_1.LazyInitialization.registerLazyComponent('FieldTable', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(27).then((function () {
                var loaded = __webpack_require__(180)['FieldTable'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('FieldTable'));
        });
    });
}
exports.lazyFieldTable = lazyFieldTable;


/***/ }),
/* 648 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyFieldValue() {
    Initialization_1.LazyInitialization.registerLazyComponent('FieldValue', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(67).then((function () {
                var loaded = __webpack_require__(94)['FieldValue'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('FieldValue'));
        });
    });
}
exports.lazyFieldValue = lazyFieldValue;


/***/ }),
/* 649 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyFolding() {
    Initialization_1.LazyInitialization.registerLazyComponent('Folding', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(30).then((function () {
                var loaded = __webpack_require__(125)['Folding'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Folding'));
        });
    });
}
exports.lazyFolding = lazyFolding;


/***/ }),
/* 650 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyFoldingForThread() {
    Initialization_1.LazyInitialization.registerLazyComponent('FoldingForThread', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(21).then((function () {
                var loaded = __webpack_require__(181)['FoldingForThread'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('FoldingForThread'));
        });
    });
}
exports.lazyFoldingForThread = lazyFoldingForThread;


/***/ }),
/* 651 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyFollowItem() {
    Initialization_1.LazyInitialization.registerLazyComponent('FollowItem', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(37).then((function () {
                var loaded = __webpack_require__(182)['FollowItem'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('FollowItem'));
        });
    });
}
exports.lazyFollowItem = lazyFollowItem;


/***/ }),
/* 652 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyCheckbox() {
    Initialization_1.LazyInitialization.registerLazyModule('Checkbox', function () {
        return new Promise(function (resolve, reject) {
            Promise.resolve().then((function () {
                var loaded = __webpack_require__(59)['Checkbox'];
                GlobalExports_1.lazyExportModule(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Checkbox'));
        });
    });
}
exports.lazyCheckbox = lazyCheckbox;


/***/ }),
/* 653 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyDatePicker() {
    Initialization_1.LazyInitialization.registerLazyModule('Datepicker', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(2).then((function () {
                var loaded = __webpack_require__(97)['DatePicker'];
                GlobalExports_1.lazyExportModule(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('DatePicker'));
        });
    });
}
exports.lazyDatePicker = lazyDatePicker;


/***/ }),
/* 654 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyDropdown() {
    Initialization_1.LazyInitialization.registerLazyModule('Dropdown', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(66).then((function () {
                var loaded = __webpack_require__(48)['Dropdown'];
                GlobalExports_1.lazyExportModule(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Dropdown'));
        });
    });
}
exports.lazyDropdown = lazyDropdown;


/***/ }),
/* 655 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyFormGroup() {
    Initialization_1.LazyInitialization.registerLazyModule('FormGroup', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(40).then((function () {
                var loaded = __webpack_require__(95)['FormGroup'];
                GlobalExports_1.lazyExportModule(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('FormGroup'));
        });
    });
}
exports.lazyFormGroup = lazyFormGroup;


/***/ }),
/* 656 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyMultiSelect() {
    Initialization_1.LazyInitialization.registerLazyModule('MultiSelect', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(39).then((function () {
                var loaded = __webpack_require__(126)['MultiSelect'];
                GlobalExports_1.lazyExportModule(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('MultiSelect'));
        });
    });
}
exports.lazyMultiSelect = lazyMultiSelect;


/***/ }),
/* 657 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyNumericSpinner() {
    Initialization_1.LazyInitialization.registerLazyModule('NumericSpinner', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(65).then((function () {
                var loaded = __webpack_require__(79)['NumericSpinner'];
                GlobalExports_1.lazyExportModule(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('NumericSpinner'));
        });
    });
}
exports.lazyNumericSpinner = lazyNumericSpinner;


/***/ }),
/* 658 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyRadioButton() {
    Initialization_1.LazyInitialization.registerLazyModule('RadioButton', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(38).then((function () {
                var loaded = __webpack_require__(78)['RadioButton'];
                GlobalExports_1.lazyExportModule(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('RadioButton'));
        });
    });
}
exports.lazyRadioButton = lazyRadioButton;


/***/ }),
/* 659 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyTextInput() {
    Initialization_1.LazyInitialization.registerLazyModule('TextInput', function () {
        return new Promise(function (resolve, reject) {
            Promise.resolve().then((function () {
                var loaded = __webpack_require__(43)['TextInput'];
                GlobalExports_1.lazyExportModule(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('TextInput'));
        });
    });
}
exports.lazyTextInput = lazyTextInput;


/***/ }),
/* 660 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyHiddenQuery() {
    Initialization_1.LazyInitialization.registerLazyComponent('HiddenQuery', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(51).then((function () {
                var loaded = __webpack_require__(183)['HiddenQuery'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('HiddenQuery'));
        });
    });
}
exports.lazyHiddenQuery = lazyHiddenQuery;


/***/ }),
/* 661 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyHierarchicalFacet() {
    Initialization_1.LazyInitialization.registerLazyComponent('HierarchicalFacet', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(3).then((function () {
                var loaded = __webpack_require__(184)['HierarchicalFacet'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('HierarchicalFacet'));
        });
    });
}
exports.lazyHierarchicalFacet = lazyHierarchicalFacet;


/***/ }),
/* 662 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyIcon() {
    Initialization_1.LazyInitialization.registerLazyComponent('Icon', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(64).then((function () {
                var loaded = __webpack_require__(127)['Icon'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Icon'));
        });
    });
}
exports.lazyIcon = lazyIcon;


/***/ }),
/* 663 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyLogo() {
    Initialization_1.LazyInitialization.registerLazyComponent('Logo', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(63).then((function () {
                var loaded = __webpack_require__(185)['Logo'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Logo'));
        });
    });
}
exports.lazyLogo = lazyLogo;


/***/ }),
/* 664 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyMatrix() {
    Initialization_1.LazyInitialization.registerLazyComponent('Matrix', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(20).then((function () {
                var loaded = __webpack_require__(186)['Matrix'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Matrix'));
        });
    });
}
exports.lazyMatrix = lazyMatrix;


/***/ }),
/* 665 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyOmnibox() {
    Initialization_1.LazyInitialization.registerLazyComponent('Omnibox', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(10).then((function () {
                var loaded = __webpack_require__(77)['Omnibox'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Omnibox'));
        });
    });
}
exports.lazyOmnibox = lazyOmnibox;


/***/ }),
/* 666 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyOmniboxResultList() {
    Initialization_1.LazyInitialization.registerLazyComponent('OmniboxResultList', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(7).then((function () {
                var loaded = __webpack_require__(187)['OmniboxResultList'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('OmniboxResultList'));
        });
    });
}
exports.lazyOmniboxResultList = lazyOmniboxResultList;


/***/ }),
/* 667 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyPager() {
    Initialization_1.LazyInitialization.registerLazyComponent('Pager', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(50).then((function () {
                var loaded = __webpack_require__(188)['Pager'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Pager'));
        });
    });
}
exports.lazyPager = lazyPager;


/***/ }),
/* 668 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyPipelineContext() {
    Initialization_1.LazyInitialization.registerLazyComponent('PipelineContext', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(62).then((function () {
                var loaded = __webpack_require__(189)['PipelineContext'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('PipelineContext'));
        });
    });
}
exports.lazyPipelineContext = lazyPipelineContext;


/***/ }),
/* 669 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyPreferencesPanel() {
    Initialization_1.LazyInitialization.registerLazyComponent('PreferencesPanel', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(49).then((function () {
                var loaded = __webpack_require__(190)['PreferencesPanel'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('lazyPreferencesPanel'));
        });
    });
}
exports.lazyPreferencesPanel = lazyPreferencesPanel;


/***/ }),
/* 670 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyPrintableUri() {
    Initialization_1.LazyInitialization.registerLazyComponent('PrintableUri', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(19).then((function () {
                var loaded = __webpack_require__(191)['PrintableUri'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('PrintableUri'));
        });
    });
}
exports.lazyPrintableUri = lazyPrintableUri;


/***/ }),
/* 671 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyQueryDuration() {
    Initialization_1.LazyInitialization.registerLazyComponent('QueryDuration', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(48).then((function () {
                var loaded = __webpack_require__(192)['QueryDuration'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('QueryDuration'));
        });
    });
}
exports.lazyQueryDuration = lazyQueryDuration;


/***/ }),
/* 672 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyQuerySummary() {
    Initialization_1.LazyInitialization.registerLazyComponent('QuerySummary', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(26).then((function () {
                var loaded = __webpack_require__(193)['QuerySummary'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('QuerySummary'));
        });
    });
}
exports.lazyQuerySummary = lazyQuerySummary;


/***/ }),
/* 673 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyQuerybox() {
    Initialization_1.LazyInitialization.registerLazyComponent('Querybox', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(29).then((function () {
                var loaded = __webpack_require__(93)['Querybox'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Querybox'));
        });
    });
}
exports.lazyQuerybox = lazyQuerybox;


/***/ }),
/* 674 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyQuickview() {
    Initialization_1.LazyInitialization.registerLazyComponent('Quickview', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(14).then((function () {
                var loaded = __webpack_require__(194)['Quickview'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Quickview'));
        });
    });
}
exports.lazyQuickview = lazyQuickview;


/***/ }),
/* 675 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyRecommendation() {
    Initialization_1.LazyInitialization.registerLazyComponent('Recommendation', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(6).then((function () {
                var loaded = __webpack_require__(132)['Recommendation'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Recommendation'));
        });
    });
}
exports.lazyRecommendation = lazyRecommendation;


/***/ }),
/* 676 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyResultAttachment() {
    Initialization_1.LazyInitialization.registerLazyComponent('ResultAttachments', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(25).then((function () {
                var loaded = __webpack_require__(195)['ResultAttachments'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ResultAttachments'));
        });
    });
}
exports.lazyResultAttachment = lazyResultAttachment;


/***/ }),
/* 677 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyResultFolding() {
    Initialization_1.LazyInitialization.registerLazyComponent('ResultFolding', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(24).then((function () {
                var loaded = __webpack_require__(196)['ResultFolding'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ResultFolding'));
        });
    });
}
exports.lazyResultFolding = lazyResultFolding;


/***/ }),
/* 678 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyResultLayout() {
    Initialization_1.LazyInitialization.registerLazyComponent('ResultLayout', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(18).then((function () {
                var loaded = __webpack_require__(133)['ResultLayout'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ResultLayout'));
        });
    });
}
exports.lazyResultLayout = lazyResultLayout;


/***/ }),
/* 679 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyResultLink() {
    Initialization_1.LazyInitialization.registerLazyComponent('ResultLink', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(47).then((function () {
                var loaded = __webpack_require__(75)['ResultLink'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ResultLink'));
        });
    });
}
exports.lazyResultLink = lazyResultLink;


/***/ }),
/* 680 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyResultList() {
    Initialization_1.LazyInitialization.registerLazyComponent('ResultList', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(9).then((function () {
                var loaded = __webpack_require__(96)['ResultList'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ResultList'));
        });
    });
}
exports.lazyResultList = lazyResultList;


/***/ }),
/* 681 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyResultRating() {
    Initialization_1.LazyInitialization.registerLazyComponent('ResultRating', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(61).then((function () {
                var loaded = __webpack_require__(197)['ResultRating'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ResultRating'));
        });
    });
}
exports.lazyResultRating = lazyResultRating;


/***/ }),
/* 682 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyResultTagging() {
    Initialization_1.LazyInitialization.registerLazyComponent('ResultTagging', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(46).then((function () {
                var loaded = __webpack_require__(198)['ResultTagging'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ResultTagging'));
        });
    });
}
exports.lazyResultTagging = lazyResultTagging;


/***/ }),
/* 683 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyResultsFiltersPreferences() {
    Initialization_1.LazyInitialization.registerLazyComponent('ResultsFiltersPreferences', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(12).then((function () {
                var loaded = __webpack_require__(199)['ResultsFiltersPreferences'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ResultsFiltersPreferences'));
        });
    });
}
exports.lazyResultsFiltersPreferences = lazyResultsFiltersPreferences;


/***/ }),
/* 684 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyResultsPerPage() {
    Initialization_1.LazyInitialization.registerLazyComponent('ResultsPerPage', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(45).then((function () {
                var loaded = __webpack_require__(200)['ResultsPerPage'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ResultsPerPage'));
        });
    });
}
exports.lazyResultsPerPage = lazyResultsPerPage;


/***/ }),
/* 685 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyResultsPreferences() {
    Initialization_1.LazyInitialization.registerLazyComponent('ResultsPreferences', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(13).then((function () {
                var loaded = __webpack_require__(201)['ResultsPreferences'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ResultsPreferences'));
        });
    });
}
exports.lazyResultsPreferences = lazyResultsPreferences;


/***/ }),
/* 686 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazySearchAlerts() {
    Initialization_1.LazyInitialization.registerLazyComponent('SearchAlerts', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(16).then((function () {
                var loaded = __webpack_require__(202)['SearchAlerts'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('SearchAlerts'));
        });
    });
}
exports.lazySearchAlerts = lazySearchAlerts;


/***/ }),
/* 687 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazySearchButton() {
    Initialization_1.LazyInitialization.registerLazyComponent('SearchButton', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(60).then((function () {
                var loaded = __webpack_require__(128)['SearchButton'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('SearchButton'));
        });
    });
}
exports.lazySearchButton = lazySearchButton;


/***/ }),
/* 688 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazySearchbox() {
    Initialization_1.LazyInitialization.registerLazyComponent('Searchbox', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(8).then((function () {
                var loaded = __webpack_require__(203)['Searchbox'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Searchbox'));
        });
    });
}
exports.lazySearchbox = lazySearchbox;


/***/ }),
/* 689 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazySettings() {
    Initialization_1.LazyInitialization.registerLazyComponent('Settings', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(44).then((function () {
                var loaded = __webpack_require__(204)['Settings'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Settings'));
        });
    });
}
exports.lazySettings = lazySettings;


/***/ }),
/* 690 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyShareQuery() {
    Initialization_1.LazyInitialization.registerLazyComponent('ShareQuery', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(43).then((function () {
                var loaded = __webpack_require__(205)['ShareQuery'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('ShareQuery'));
        });
    });
}
exports.lazyShareQuery = lazyShareQuery;


/***/ }),
/* 691 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazySort() {
    Initialization_1.LazyInitialization.registerLazyComponent('Sort', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(22).then((function () {
                var loaded = __webpack_require__(206)['Sort'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Sort'));
        });
    });
}
exports.lazySort = lazySort;


/***/ }),
/* 692 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyTab() {
    Initialization_1.LazyInitialization.registerLazyComponent('Tab', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(11).then((function () {
                var loaded = __webpack_require__(134)['Tab'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Tab'));
        });
    });
}
exports.lazyTab = lazyTab;


/***/ }),
/* 693 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyTemplateLoader() {
    Initialization_1.LazyInitialization.registerLazyComponent('TemplateLoader', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(59).then((function () {
                var loaded = __webpack_require__(207)['TemplateLoader'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('TemplateLoader'));
        });
    });
}
exports.lazyTemplateLoader = lazyTemplateLoader;


/***/ }),
/* 694 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyText() {
    Initialization_1.LazyInitialization.registerLazyComponent('Text', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(42).then((function () {
                var loaded = __webpack_require__(208)['Text'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Text'));
        });
    });
}
exports.lazyText = lazyText;


/***/ }),
/* 695 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyThumbnail() {
    Initialization_1.LazyInitialization.registerLazyComponent('Thumbnail', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(17).then((function () {
                var loaded = __webpack_require__(209)['Thumbnail'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Thumbnail'));
        });
    });
}
exports.lazyThumbnail = lazyThumbnail;


/***/ }),
/* 696 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
function lazyTriggers() {
    Initialization_1.LazyInitialization.registerLazyComponent('Triggers', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(41).then((function () {
                var loaded = __webpack_require__(210)['Triggers'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('Triggers'));
        });
    });
}
exports.lazyTriggers = lazyTriggers;


/***/ }),
/* 697 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Initialization_1 = __webpack_require__(1);
var YouTubeThumbnailFields_1 = __webpack_require__(140);
var GlobalExports_1 = __webpack_require__(3);
function lazyYouTubeThumbnail() {
    YouTubeThumbnailFields_1.registerFields();
    Initialization_1.LazyInitialization.registerLazyComponent('YouTubeThumbnail', function () {
        return new Promise(function (resolve, reject) {
            __webpack_require__.e/* require.ensure */(23).then((function () {
                var loaded = __webpack_require__(129)['YouTubeThumbnail'];
                GlobalExports_1.lazyExport(loaded, resolve);
            }).bind(null, __webpack_require__)).catch(Initialization_1.LazyInitialization.buildErrorCallback('YouTubeThumbnail'));
        });
    });
}
exports.lazyYouTubeThumbnail = lazyYouTubeThumbnail;


/***/ }),
/* 698 */,
/* 699 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(441);


/***/ }),
/* 700 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=CoveoJsSearch.Lazy.js.map