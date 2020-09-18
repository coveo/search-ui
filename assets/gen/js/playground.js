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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./node_modules/underscore/modules/index.js
var modules = __webpack_require__(5);

// CONCATENATED MODULE: ./node_modules/underscore/modules/index-default.js



// Add all of the Underscore functions to the wrapper object.
var _ = Object(modules["mixin"])(modules);
// Legacy Node.js API
_._ = _;
// Export the Underscore API.
/* harmony default export */ var index_default = (_);

// CONCATENATED MODULE: ./node_modules/underscore/modules/index-all.js
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "default", function() { return index_default; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "VERSION", function() { return modules["VERSION"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "iteratee", function() { return modules["iteratee"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "restArguments", function() { return modules["restArguments"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "each", function() { return modules["each"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "forEach", function() { return modules["forEach"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "map", function() { return modules["map"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "collect", function() { return modules["collect"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "reduce", function() { return modules["reduce"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "foldl", function() { return modules["foldl"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "inject", function() { return modules["inject"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "reduceRight", function() { return modules["reduceRight"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "foldr", function() { return modules["foldr"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "find", function() { return modules["find"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "detect", function() { return modules["detect"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "filter", function() { return modules["filter"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "select", function() { return modules["select"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "reject", function() { return modules["reject"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "every", function() { return modules["every"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "all", function() { return modules["all"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "some", function() { return modules["some"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "any", function() { return modules["any"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "contains", function() { return modules["contains"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "includes", function() { return modules["includes"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "include", function() { return modules["include"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "invoke", function() { return modules["invoke"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "pluck", function() { return modules["pluck"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "where", function() { return modules["where"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "findWhere", function() { return modules["findWhere"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "max", function() { return modules["max"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "min", function() { return modules["min"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "shuffle", function() { return modules["shuffle"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "sample", function() { return modules["sample"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "sortBy", function() { return modules["sortBy"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "groupBy", function() { return modules["groupBy"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "indexBy", function() { return modules["indexBy"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "countBy", function() { return modules["countBy"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "toArray", function() { return modules["toArray"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "size", function() { return modules["size"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "partition", function() { return modules["partition"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "first", function() { return modules["first"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "head", function() { return modules["head"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "take", function() { return modules["take"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "initial", function() { return modules["initial"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "last", function() { return modules["last"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "rest", function() { return modules["rest"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "tail", function() { return modules["tail"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "drop", function() { return modules["drop"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "compact", function() { return modules["compact"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "flatten", function() { return modules["flatten"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "without", function() { return modules["without"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "uniq", function() { return modules["uniq"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "unique", function() { return modules["unique"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "union", function() { return modules["union"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "intersection", function() { return modules["intersection"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "difference", function() { return modules["difference"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "unzip", function() { return modules["unzip"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "zip", function() { return modules["zip"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "object", function() { return modules["object"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "findIndex", function() { return modules["findIndex"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "findLastIndex", function() { return modules["findLastIndex"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "sortedIndex", function() { return modules["sortedIndex"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "indexOf", function() { return modules["indexOf"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "lastIndexOf", function() { return modules["lastIndexOf"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "range", function() { return modules["range"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "chunk", function() { return modules["chunk"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "bind", function() { return modules["bind"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "partial", function() { return modules["partial"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "bindAll", function() { return modules["bindAll"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "memoize", function() { return modules["memoize"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "delay", function() { return modules["delay"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "defer", function() { return modules["defer"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "throttle", function() { return modules["throttle"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "debounce", function() { return modules["debounce"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "wrap", function() { return modules["wrap"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "negate", function() { return modules["negate"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "compose", function() { return modules["compose"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "after", function() { return modules["after"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "before", function() { return modules["before"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "once", function() { return modules["once"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "keys", function() { return modules["keys"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "allKeys", function() { return modules["allKeys"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "values", function() { return modules["values"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "mapObject", function() { return modules["mapObject"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "pairs", function() { return modules["pairs"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "invert", function() { return modules["invert"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "functions", function() { return modules["functions"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "methods", function() { return modules["methods"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "extend", function() { return modules["extend"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "extendOwn", function() { return modules["extendOwn"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "assign", function() { return modules["assign"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "findKey", function() { return modules["findKey"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "pick", function() { return modules["pick"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "omit", function() { return modules["omit"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "defaults", function() { return modules["defaults"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "create", function() { return modules["create"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "clone", function() { return modules["clone"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "tap", function() { return modules["tap"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isMatch", function() { return modules["isMatch"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isEqual", function() { return modules["isEqual"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isEmpty", function() { return modules["isEmpty"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isElement", function() { return modules["isElement"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isArray", function() { return modules["isArray"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isObject", function() { return modules["isObject"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isArguments", function() { return modules["isArguments"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isFunction", function() { return modules["isFunction"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isString", function() { return modules["isString"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isNumber", function() { return modules["isNumber"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isDate", function() { return modules["isDate"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isRegExp", function() { return modules["isRegExp"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isError", function() { return modules["isError"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isSymbol", function() { return modules["isSymbol"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isMap", function() { return modules["isMap"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isWeakMap", function() { return modules["isWeakMap"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isSet", function() { return modules["isSet"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isWeakSet", function() { return modules["isWeakSet"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isFinite", function() { return modules["isFinite"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isNaN", function() { return modules["isNaN"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isBoolean", function() { return modules["isBoolean"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isNull", function() { return modules["isNull"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isUndefined", function() { return modules["isUndefined"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "has", function() { return modules["has"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "identity", function() { return modules["identity"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "constant", function() { return modules["constant"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "noop", function() { return modules["noop"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "property", function() { return modules["property"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "propertyOf", function() { return modules["propertyOf"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "matcher", function() { return modules["matcher"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "matches", function() { return modules["matches"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "times", function() { return modules["times"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "random", function() { return modules["random"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "now", function() { return modules["now"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "escape", function() { return modules["escape"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "unescape", function() { return modules["unescape"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "result", function() { return modules["result"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "uniqueId", function() { return modules["uniqueId"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "templateSettings", function() { return modules["templateSettings"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "template", function() { return modules["template"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "chain", function() { return modules["chain"]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "mixin", function() { return modules["mixin"]; });




/***/ }),
/* 1 */
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
var _ = __webpack_require__(0);
var Assert = /** @class */ (function () {
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
    return Assert;
}());
exports.Assert = Assert;
var PreconditionFailedException = /** @class */ (function (_super) {
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var isCoveoFieldRegex = /^@[a-zA-Z0-9_\.]+$/;
var Utils = /** @class */ (function () {
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
            // IE 8 FIX
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
    Utils.safeEncodeURIComponent = function (rawString) {
        // yiiip...
        // Explanation : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
        // Solution : https://stackoverflow.com/a/17109094
        // Basically some unicode character (low-high surrogate) will throw an "invalid malformed URI" error when being encoded as an URI component, and the pair of character is incomplete.
        // This simply removes those pesky characters
        if (_.isString(rawString)) {
            return encodeURIComponent(rawString
                .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '')
                .split('')
                .reverse()
                .join('')
                .replace(/[\uDC00-\uDFFF](?![\uD800-\uDBFF])/g, '')
                .split('')
                .reverse()
                .join(''));
        }
        else {
            // If the passed value is not a string, we probably don't want to do anything here...
            // The base browser function should be resilient enough
            return encodeURIComponent(rawString);
        }
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
    /**
     * Get the value of the first field from the array and defined in the result.
     *
     * @param result a QueryResult in which to ge the fieldvalue.
     * @param name One or multiple fieldNames to get the value.
     */
    Utils.getFirstAvailableFieldValue = function (result, fieldNames) {
        for (var i = 0; i < fieldNames.length; i++) {
            var value = Utils.getFieldValue(result, fieldNames[i]);
            if (value !== undefined) {
                return value;
            }
        }
        return undefined;
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
                timeout = window.setTimeout(later, remaining);
            }
            return result;
        };
    };
    Utils.extendDeep = function (target, src) {
        if (!target) {
            target = {};
        }
        var isArray = _.isArray(src);
        var toReturn = (isArray && []) || {};
        if (isArray) {
            target = target || [];
            toReturn = toReturn['concat'](target);
            _.each(src, function (e, i, obj) {
                if (typeof target[i] === 'undefined') {
                    toReturn[i] = e;
                }
                else if (typeof e === 'object' && !_.isElement(e)) {
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
            if (target && typeof target === 'object' && !_.isElement(target)) {
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
                timeout = window.setTimeout(function () {
                    timeout = null;
                }, wait);
                stackTraceTimeout = setTimeout(function () {
                    func.apply(_this, args);
                    stackTraceTimeout = null;
                });
            }
            else if (stackTraceTimeout == null) {
                clearTimeout(timeout);
                timeout = window.setTimeout(function () {
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
            return new DOMParser().parseFromString(xml, 'text/xml');
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
    Utils.differenceBetweenObjects = function (firstObject, secondObject) {
        var difference = {};
        var addDiff = function (first, second) {
            for (var key in first) {
                if (first[key] !== second[key] && difference[key] == null) {
                    difference[key] = first[key];
                }
            }
        };
        addDiff(firstObject, secondObject);
        addDiff(secondObject, firstObject);
        return difference;
    };
    Utils.resolveAfter = function (ms, returns) {
        return new Promise(function (resolve) { return setTimeout(function () { return (returns !== undefined ? resolve(returns) : resolve()); }, ms); });
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
        log: function () { },
        debug: function () { },
        info: function () { },
        warn: function () { },
        error: function () { },
        assert: function () { },
        clear: function () { },
        count: function () { },
        dir: function () { },
        dirxml: function () { },
        group: function () { },
        groupCollapsed: function () { },
        groupEnd: function () { },
        msIsIndependentlyComposed: function (element) { },
        profile: function () { },
        profileEnd: function () { },
        select: function () { },
        time: function () { },
        timeEnd: function () { },
        trace: function () { }
    };
}
/* istanbul ignore next */
var Logger = /** @class */ (function () {
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
    Logger.TRACE = 1;
    Logger.DEBUG = 2;
    Logger.INFO = 3;
    Logger.WARN = 4;
    Logger.ERROR = 5;
    Logger.NOTHING = 6;
    Logger.level = Logger.INFO;
    Logger.executionTime = false;
    return Logger;
}());
exports.Logger = Logger;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Assert_1 = __webpack_require__(1);
var Logger_1 = __webpack_require__(3);
var JQueryutils_1 = __webpack_require__(7);
var Utils_1 = __webpack_require__(2);
/**
 * This is essentially an helper class for dom manipulation.<br/>
 * This is intended to provide some basic functionality normally offered by jQuery.<br/>
 * To minimize the multiple jQuery conflict we have while integrating in various system, we implemented the very small subset that the framework needs.<br/>
 * See {@link $$}, which is a function that wraps this class constructor, for less verbose code.
 */
var Dom = /** @class */ (function () {
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
        underscore_1.each(children, function (child) {
            if (child instanceof HTMLElement) {
                elem.appendChild(child);
            }
            else if (underscore_1.isString(child)) {
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
    Dom.nodeListToArray = function (nodeList) {
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
            this.removeChild(this.el.firstChild);
        }
    };
    Dom.prototype.removeChild = function (child) {
        var oldParent = child.parentNode;
        try {
            this.el.removeChild(child);
        }
        catch (e) {
            if (e.name !== 'NotFoundError') {
                throw e;
            }
            if (oldParent === child.parentNode) {
                throw e;
            }
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
     * Show the element by setting display to block;
     */
    Dom.prototype.show = function () {
        this.el.style.display = 'block';
        $$(this.el).setAttribute('aria-hidden', 'false');
    };
    /**
     * Hide the element;
     */
    Dom.prototype.hide = function () {
        this.el.style.display = 'none';
        $$(this.el).setAttribute('aria-hidden', 'true');
    };
    /**
     * Show the element by setting display to an empty string.
     */
    Dom.prototype.unhide = function () {
        this.el.style.display = '';
        $$(this.el).setAttribute('aria-hidden', 'false');
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
     * Tries to determine if an element is "visible", in a generic manner.
     *
     * This is not meant to be a "foolproof" method, but only a superficial "best effort" detection is performed.
     */
    Dom.prototype.isVisible = function () {
        if (this.el.style.display == 'none') {
            return false;
        }
        if (this.el.style.visibility == 'hidden') {
            return false;
        }
        if (this.hasClass('coveo-tab-disabled')) {
            return false;
        }
        if (this.hasClass('coveo-hidden')) {
            return false;
        }
        return true;
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
        return Dom.nodeListToArray(this.el.children);
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
        return Dom.nodeListToArray(this.el.querySelectorAll(selector));
    };
    /**
     * Find the child elements using a className
     * @param className Class of the childs elements to find
     * @returns {HTMLElement[]}
     */
    Dom.prototype.findClass = function (className) {
        if ('getElementsByClassName' in this.el) {
            return Dom.nodeListToArray(this.el.getElementsByClassName(className));
        }
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
        if (underscore_1.isArray(className)) {
            underscore_1.each(className, function (name) {
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
        this.el.className = this.el.className.replace(new RegExp("(^|\\s)" + className + "(\\s|$)", 'g'), '$1').trim();
    };
    /**
     * Toggle the class on the element.
     * @param className Classname to toggle
     * @param swtch If true, add the class regardless and if false, remove the class
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
        // SVG elements got a className property, but it's not a string, it's an object
        var className = this.getAttribute('class');
        if (className && className.match) {
            return className.match(Dom.CLASS_NAME_REGEX) || [];
        }
        else {
            return [];
        }
    };
    /**
     * Check if the element has the given class name
     * @param className Classname to verify
     * @returns {boolean}
     */
    Dom.prototype.hasClass = function (className) {
        return underscore_1.contains(this.getClass(), className);
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
        if (underscore_1.isArray(type)) {
            underscore_1.each(type, function (t) {
                _this.on(t, eventHandle);
            });
        }
        else {
            var modifiedType = this.processEventTypeToBeJQueryCompatible(type);
            var jq = JQueryutils_1.JQueryUtils.getJQuery();
            if (this.shouldUseJQueryEvent()) {
                jq(this.el).on(modifiedType, eventHandle);
            }
            else if (this.el.addEventListener) {
                var fn = function (e) {
                    eventHandle(e, e.detail);
                };
                Dom.handlers.set(eventHandle, fn);
                // Mark touch events as passive for performance reasons:
                // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
                if (modifiedType && modifiedType.indexOf('touch') != -1) {
                    this.el.addEventListener(modifiedType, fn, { passive: true });
                }
                else {
                    this.el.addEventListener(modifiedType, fn, false);
                }
            }
            else if (this.el['on']) {
                this.el['on']('on' + modifiedType, eventHandle);
            }
        }
    };
    Dom.prototype.one = function (type, eventHandle) {
        var _this = this;
        if (underscore_1.isArray(type)) {
            underscore_1.each(type, function (t) {
                _this.one(t, eventHandle);
            });
        }
        else {
            var modifiedType_1 = this.processEventTypeToBeJQueryCompatible(type);
            var once_1 = function (e, args) {
                _this.off(modifiedType_1, once_1);
                return eventHandle(e, args);
            };
            this.on(modifiedType_1, once_1);
        }
    };
    Dom.prototype.off = function (type, eventHandle) {
        var _this = this;
        if (underscore_1.isArray(type)) {
            underscore_1.each(type, function (t) {
                _this.off(t, eventHandle);
            });
        }
        else {
            var modifiedType = this.processEventTypeToBeJQueryCompatible(type);
            var jq = JQueryutils_1.JQueryUtils.getJQuery();
            if (this.shouldUseJQueryEvent()) {
                jq(this.el).off(modifiedType, eventHandle);
            }
            else if (this.el.removeEventListener) {
                var handler = Dom.handlers.get(eventHandle);
                if (handler) {
                    this.el.removeEventListener(modifiedType, handler, false);
                }
            }
            else if (this.el['off']) {
                this.el['off']('on' + modifiedType, eventHandle);
            }
        }
    };
    /**
     * Trigger an event on the element.
     * @param type The event type to trigger
     * @param data
     */
    Dom.prototype.trigger = function (type, data) {
        var modifiedType = this.processEventTypeToBeJQueryCompatible(type);
        if (this.shouldUseJQueryEvent()) {
            JQueryutils_1.JQueryUtils.getJQuery()(this.el).trigger(modifiedType, data);
        }
        else if (window['CustomEvent'] !== undefined) {
            var event_1 = new CustomEvent(modifiedType, { detail: data, bubbles: true });
            this.el.dispatchEvent(event_1);
        }
        else {
            try {
                this.el.dispatchEvent(this.buildIE11CustomEvent(modifiedType, data));
            }
            catch (_a) {
                this.oldBrowserError();
            }
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
     * Check if the element is not a locked node (`{ toString(): string }`) and thus have base element properties.
     * @returns {boolean}
     */
    Dom.prototype.isValid = function () {
        return this.el != null && this.el.getAttribute != undefined;
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
    /**
     * Determine if an element support a particular native DOM event.
     * @param eventName The event to evaluate. Eg: touchstart, touchend, click, scroll.
     */
    Dom.prototype.canHandleEvent = function (eventName) {
        var eventToEvaluate = "on" + eventName;
        var isSupported = eventToEvaluate in this.el;
        // This is a protection against false negative.
        // Some browser will incorrectly report that the event is not supported at this point
        // To make sure, we need to try and set a fake function as a property on the element,
        // and then check if it got hooked properly as a 'function' or as something else, meaning
        // the property is really not defined on the element.
        if (!isSupported && this.el.setAttribute) {
            this.el.setAttribute(eventToEvaluate, 'return;');
            isSupported = typeof this.el[eventToEvaluate] == 'function';
            this.el.removeAttribute(eventToEvaluate);
        }
        return isSupported;
    };
    Dom.prototype.buildIE11CustomEvent = function (type, data) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, true, true, data);
        return event;
    };
    Dom.prototype.shouldUseJQueryEvent = function () {
        return JQueryutils_1.JQueryUtils.getJQuery() && !Dom.useNativeJavaScriptEvents;
    };
    Dom.prototype.processEventTypeToBeJQueryCompatible = function (event) {
        // From https://api.jquery.com/on/
        // [...]
        // > In addition, the .trigger() method can trigger both standard browser event names and custom event names to call attached handlers. Event names should only contain alphanumerics, underscore, and colon characters.
        if (event) {
            return event.replace(/[^a-zA-Z0-9\:\_]/g, '');
        }
        return event;
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
    Dom.prototype.oldBrowserError = function () {
        new Logger_1.Logger(this).error('CANNOT TRIGGER EVENT FOR OLDER BROWSER');
    };
    Dom.CLASS_NAME_REGEX = /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;
    Dom.ONLY_WHITE_SPACE_REGEX = /^\s*$/;
    /**
     * Whether to always register, remove, and trigger events using standard JavaScript rather than attempting to use jQuery first.
     * @type boolean
     */
    Dom.useNativeJavaScriptEvents = false;
    Dom.handlers = new WeakMap();
    return Dom;
}());
exports.Dom = Dom;
var Win = /** @class */ (function () {
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
        return this.supportPageOffset()
            ? this.win.pageYOffset
            : this.isCSS1Compat() ? this.win.document.documentElement.scrollTop : this.win.document.body.scrollTop;
    };
    Win.prototype.scrollX = function () {
        return this.supportPageOffset()
            ? window.pageXOffset
            : this.isCSS1Compat() ? document.documentElement.scrollLeft : document.body.scrollLeft;
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
var Doc = /** @class */ (function () {
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
    else if (args.length === 1 && !underscore_1.isString(args[0])) {
        return new Dom(args[0]);
    }
    else {
        return new Dom(Dom.createElement.apply(Dom, args));
    }
}
exports.$$ = $$;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["default"] = _;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VERSION", function() { return VERSION; });
/* harmony export (immutable) */ __webpack_exports__["iteratee"] = iteratee;
/* harmony export (immutable) */ __webpack_exports__["restArguments"] = restArguments;
/* harmony export (immutable) */ __webpack_exports__["each"] = each;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forEach", function() { return each; });
/* harmony export (immutable) */ __webpack_exports__["map"] = map;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "collect", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reduce", function() { return reduce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "foldl", function() { return reduce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inject", function() { return reduce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reduceRight", function() { return reduceRight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "foldr", function() { return reduceRight; });
/* harmony export (immutable) */ __webpack_exports__["find"] = find;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detect", function() { return find; });
/* harmony export (immutable) */ __webpack_exports__["filter"] = filter;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "select", function() { return filter; });
/* harmony export (immutable) */ __webpack_exports__["reject"] = reject;
/* harmony export (immutable) */ __webpack_exports__["every"] = every;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "all", function() { return every; });
/* harmony export (immutable) */ __webpack_exports__["some"] = some;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "any", function() { return some; });
/* harmony export (immutable) */ __webpack_exports__["contains"] = contains;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "includes", function() { return contains; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "include", function() { return contains; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "invoke", function() { return invoke; });
/* harmony export (immutable) */ __webpack_exports__["pluck"] = pluck;
/* harmony export (immutable) */ __webpack_exports__["where"] = where;
/* harmony export (immutable) */ __webpack_exports__["findWhere"] = findWhere;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["shuffle"] = shuffle;
/* harmony export (immutable) */ __webpack_exports__["sample"] = sample;
/* harmony export (immutable) */ __webpack_exports__["sortBy"] = sortBy;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "groupBy", function() { return groupBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "indexBy", function() { return indexBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "countBy", function() { return countBy; });
/* harmony export (immutable) */ __webpack_exports__["toArray"] = toArray;
/* harmony export (immutable) */ __webpack_exports__["size"] = size;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "partition", function() { return partition; });
/* harmony export (immutable) */ __webpack_exports__["first"] = first;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "head", function() { return first; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "take", function() { return first; });
/* harmony export (immutable) */ __webpack_exports__["initial"] = initial;
/* harmony export (immutable) */ __webpack_exports__["last"] = last;
/* harmony export (immutable) */ __webpack_exports__["rest"] = rest;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tail", function() { return rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drop", function() { return rest; });
/* harmony export (immutable) */ __webpack_exports__["compact"] = compact;
/* harmony export (immutable) */ __webpack_exports__["flatten"] = flatten;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "without", function() { return without; });
/* harmony export (immutable) */ __webpack_exports__["uniq"] = uniq;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unique", function() { return uniq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "union", function() { return union; });
/* harmony export (immutable) */ __webpack_exports__["intersection"] = intersection;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "difference", function() { return difference; });
/* harmony export (immutable) */ __webpack_exports__["unzip"] = unzip;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zip", function() { return zip; });
/* harmony export (immutable) */ __webpack_exports__["object"] = object;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findIndex", function() { return findIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findLastIndex", function() { return findLastIndex; });
/* harmony export (immutable) */ __webpack_exports__["sortedIndex"] = sortedIndex;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "indexOf", function() { return indexOf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lastIndexOf", function() { return lastIndexOf; });
/* harmony export (immutable) */ __webpack_exports__["range"] = range;
/* harmony export (immutable) */ __webpack_exports__["chunk"] = chunk;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bind", function() { return bind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "partial", function() { return partial; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bindAll", function() { return bindAll; });
/* harmony export (immutable) */ __webpack_exports__["memoize"] = memoize;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "delay", function() { return delay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defer", function() { return defer; });
/* harmony export (immutable) */ __webpack_exports__["throttle"] = throttle;
/* harmony export (immutable) */ __webpack_exports__["debounce"] = debounce;
/* harmony export (immutable) */ __webpack_exports__["wrap"] = wrap;
/* harmony export (immutable) */ __webpack_exports__["negate"] = negate;
/* harmony export (immutable) */ __webpack_exports__["compose"] = compose;
/* harmony export (immutable) */ __webpack_exports__["after"] = after;
/* harmony export (immutable) */ __webpack_exports__["before"] = before;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "once", function() { return once; });
/* harmony export (immutable) */ __webpack_exports__["keys"] = keys;
/* harmony export (immutable) */ __webpack_exports__["allKeys"] = allKeys;
/* harmony export (immutable) */ __webpack_exports__["values"] = values;
/* harmony export (immutable) */ __webpack_exports__["mapObject"] = mapObject;
/* harmony export (immutable) */ __webpack_exports__["pairs"] = pairs;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["functions"] = functions;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "methods", function() { return functions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extend", function() { return extend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extendOwn", function() { return extendOwn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return extendOwn; });
/* harmony export (immutable) */ __webpack_exports__["findKey"] = findKey;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pick", function() { return pick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "omit", function() { return omit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaults", function() { return defaults; });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["tap"] = tap;
/* harmony export (immutable) */ __webpack_exports__["isMatch"] = isMatch;
/* harmony export (immutable) */ __webpack_exports__["isEqual"] = isEqual;
/* harmony export (immutable) */ __webpack_exports__["isEmpty"] = isEmpty;
/* harmony export (immutable) */ __webpack_exports__["isElement"] = isElement;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return isArray; });
/* harmony export (immutable) */ __webpack_exports__["isObject"] = isObject;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArguments", function() { return isArguments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFunction", function() { return isFunction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNumber", function() { return isNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDate", function() { return isDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRegExp", function() { return isRegExp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isError", function() { return isError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSymbol", function() { return isSymbol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMap", function() { return isMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWeakMap", function() { return isWeakMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSet", function() { return isSet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWeakSet", function() { return isWeakSet; });
/* harmony export (immutable) */ __webpack_exports__["isFinite"] = isFinite;
/* harmony export (immutable) */ __webpack_exports__["isNaN"] = isNaN;
/* harmony export (immutable) */ __webpack_exports__["isBoolean"] = isBoolean;
/* harmony export (immutable) */ __webpack_exports__["isNull"] = isNull;
/* harmony export (immutable) */ __webpack_exports__["isUndefined"] = isUndefined;
/* harmony export (immutable) */ __webpack_exports__["has"] = has;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["constant"] = constant;
/* harmony export (immutable) */ __webpack_exports__["noop"] = noop;
/* harmony export (immutable) */ __webpack_exports__["property"] = property;
/* harmony export (immutable) */ __webpack_exports__["propertyOf"] = propertyOf;
/* harmony export (immutable) */ __webpack_exports__["matcher"] = matcher;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "matches", function() { return matcher; });
/* harmony export (immutable) */ __webpack_exports__["times"] = times;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "now", function() { return now; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "escape", function() { return escape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unescape", function() { return unescape; });
/* harmony export (immutable) */ __webpack_exports__["result"] = result;
/* harmony export (immutable) */ __webpack_exports__["uniqueId"] = uniqueId;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "templateSettings", function() { return templateSettings; });
/* harmony export (immutable) */ __webpack_exports__["template"] = template;
/* harmony export (immutable) */ __webpack_exports__["chain"] = chain;
/* harmony export (immutable) */ __webpack_exports__["mixin"] = mixin;
//     Underscore.js 1.10.2
//     https://underscorejs.org
//     (c) 2009-2020 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

// Baseline setup
// --------------

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self == 'object' && self.self === self && self ||
          typeof global == 'object' && global.global === global && global ||
          Function('return this')() ||
          {};

// Save bytes in the minified (but not gzipped) version:
var ArrayProto = Array.prototype, ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

// All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create;

// Create references to these builtin functions because we override them.
var _isNaN = root.isNaN,
    _isFinite = root.isFinite;

// Naked function reference for surrogate-prototype-swapping.
var Ctor = function(){};

// The Underscore object. All exported functions below are added to it in the
// modules/index-all.js using the mixin function.
function _(obj) {
  if (obj instanceof _) return obj;
  if (!(this instanceof _)) return new _(obj);
  this._wrapped = obj;
}

// Current version.
var VERSION = _.VERSION = '1.10.2';

// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1: return function(value) {
      return func.call(context, value);
    };
    // The 2-argument case is omitted because we’re not using it.
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
}

// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `identity`,
// an arbitrary callback, a property matcher, or a property accessor.
function baseIteratee(value, context, argCount) {
  if (value == null) return identity;
  if (isFunction(value)) return optimizeCb(value, context, argCount);
  if (isObject(value) && !isArray(value)) return matcher(value);
  return property(value);
}

// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only argCount argument.
_.iteratee = iteratee;
function iteratee(value, context) {
  return baseIteratee(value, context, Infinity);
}

// The function we actually call internally. It invokes _.iteratee if
// overridden, otherwise baseIteratee.
function cb(value, context, argCount) {
  if (_.iteratee !== iteratee) return _.iteratee(value, context);
  return baseIteratee(value, context, argCount);
}

// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function’s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6’s "rest parameter".
function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function() {
    var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, arguments[0], rest);
      case 2: return func.call(this, arguments[0], arguments[1], rest);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
}

// An internal function for creating a new object that inherits from another.
function baseCreate(prototype) {
  if (!isObject(prototype)) return {};
  if (nativeCreate) return nativeCreate(prototype);
  Ctor.prototype = prototype;
  var result = new Ctor;
  Ctor.prototype = null;
  return result;
}

function shallowProperty(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
}

function _has(obj, path) {
  return obj != null && hasOwnProperty.call(obj, path);
}

function deepGet(obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
}

// Helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = shallowProperty('length');
function isArrayLike(collection) {
  var length = getLength(collection);
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

// Collection Functions
// --------------------

// The cornerstone, an `each` implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
function each(obj, iteratee, context) {
  iteratee = optimizeCb(iteratee, context);
  var i, length;
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var _keys = keys(obj);
    for (i = 0, length = _keys.length; i < length; i++) {
      iteratee(obj[_keys[i]], _keys[i], obj);
    }
  }
  return obj;
}


// Return the results of applying the iteratee to each element.
function map(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var _keys = !isArrayLike(obj) && keys(obj),
      length = (_keys || obj).length,
      results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}


// Create a reducing function iterating left or right.
function createReduce(dir) {
  // Wrap code that reassigns argument variables in a separate function than
  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
  var reducer = function(obj, iteratee, memo, initial) {
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
    if (!initial) {
      memo = obj[_keys ? _keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = _keys ? _keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  return function(obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
  };
}

// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
var reduce = createReduce(1);


// The right-associative version of reduce, also known as `foldr`.
var reduceRight = createReduce(-1);


// Return the first value which passes a truth test.
function find(obj, predicate, context) {
  var keyFinder = isArrayLike(obj) ? findIndex : findKey;
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) return obj[key];
}


// Return all the elements that pass a truth test.
function filter(obj, predicate, context) {
  var results = [];
  predicate = cb(predicate, context);
  each(obj, function(value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
}


// Return all the elements for which a truth test fails.
function reject(obj, predicate, context) {
  return filter(obj, negate(cb(predicate)), context);
}

// Determine whether all of the elements match a truth test.
function every(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike(obj) && keys(obj),
      length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }
  return true;
}


// Determine if at least one element in the object matches a truth test.
function some(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike(obj) && keys(obj),
      length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }
  return false;
}


// Determine if the array or object contains a given item (using `===`).
function contains(obj, item, fromIndex, guard) {
  if (!isArrayLike(obj)) obj = values(obj);
  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
  return indexOf(obj, item, fromIndex) >= 0;
}


// Invoke a method (with arguments) on every item in a collection.
var invoke = restArguments(function(obj, path, args) {
  var contextPath, func;
  if (isFunction(path)) {
    func = path;
  } else if (isArray(path)) {
    contextPath = path.slice(0, -1);
    path = path[path.length - 1];
  }
  return map(obj, function(context) {
    var method = func;
    if (!method) {
      if (contextPath && contextPath.length) {
        context = deepGet(context, contextPath);
      }
      if (context == null) return void 0;
      method = context[path];
    }
    return method == null ? method : method.apply(context, args);
  });
});

// Convenience version of a common use case of `map`: fetching a property.
function pluck(obj, key) {
  return map(obj, property(key));
}

// Convenience version of a common use case of `filter`: selecting only objects
// containing specific `key:value` pairs.
function where(obj, attrs) {
  return filter(obj, matcher(attrs));
}

// Convenience version of a common use case of `find`: getting the first object
// containing specific `key:value` pairs.
function findWhere(obj, attrs) {
  return find(obj, matcher(attrs));
}

// Return the maximum element (or element-based computation).
function max(obj, iteratee, context) {
  var result = -Infinity, lastComputed = -Infinity,
      value, computed;
  if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
    obj = isArrayLike(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value > result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    each(obj, function(v, index, list) {
      computed = iteratee(v, index, list);
      if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}

// Return the minimum element (or element-based computation).
function min(obj, iteratee, context) {
  var result = Infinity, lastComputed = Infinity,
      value, computed;
  if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
    obj = isArrayLike(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value < result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    each(obj, function(v, index, list) {
      computed = iteratee(v, index, list);
      if (computed < lastComputed || computed === Infinity && result === Infinity) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}

// Shuffle a collection.
function shuffle(obj) {
  return sample(obj, Infinity);
}

// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `map`.
function sample(obj, n, guard) {
  if (n == null || guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    return obj[random(obj.length - 1)];
  }
  var sample = isArrayLike(obj) ? clone(obj) : values(obj);
  var length = getLength(sample);
  n = Math.max(Math.min(n, length), 0);
  var last = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = random(index, last);
    var temp = sample[index];
    sample[index] = sample[rand];
    sample[rand] = temp;
  }
  return sample.slice(0, n);
}

// Sort the object's values by a criterion produced by an iteratee.
function sortBy(obj, iteratee, context) {
  var index = 0;
  iteratee = cb(iteratee, context);
  return pluck(map(obj, function(value, key, list) {
    return {
      value: value,
      index: index++,
      criteria: iteratee(value, key, list)
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
}

// An internal function used for aggregate "group by" operations.
function group(behavior, partition) {
  return function(obj, iteratee, context) {
    var result = partition ? [[], []] : {};
    iteratee = cb(iteratee, context);
    each(obj, function(value, index) {
      var key = iteratee(value, index, obj);
      behavior(result, value, key);
    });
    return result;
  };
}

// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
var groupBy = group(function(result, value, key) {
  if (_has(result, key)) result[key].push(value); else result[key] = [value];
});

// Indexes the object's values by a criterion, similar to `groupBy`, but for
// when you know that your index values will be unique.
var indexBy = group(function(result, value, key) {
  result[key] = value;
});

// Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
var countBy = group(function(result, value, key) {
  if (_has(result, key)) result[key]++; else result[key] = 1;
});

var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
// Safely create a real, live array from anything iterable.
function toArray(obj) {
  if (!obj) return [];
  if (isArray(obj)) return slice.call(obj);
  if (isString(obj)) {
    // Keep surrogate pair characters together
    return obj.match(reStrSymbol);
  }
  if (isArrayLike(obj)) return map(obj, identity);
  return values(obj);
}

// Return the number of elements in an object.
function size(obj) {
  if (obj == null) return 0;
  return isArrayLike(obj) ? obj.length : keys(obj).length;
}

// Split a collection into two arrays: one whose elements all satisfy the given
// predicate, and one whose elements all do not satisfy the predicate.
var partition = group(function(result, value, pass) {
  result[pass ? 0 : 1].push(value);
}, true);

// Array Functions
// ---------------

// Get the first element of an array. Passing **n** will return the first N
// values in the array. The **guard** check allows it to work with `map`.
function first(array, n, guard) {
  if (array == null || array.length < 1) return n == null ? void 0 : [];
  if (n == null || guard) return array[0];
  return initial(array, array.length - n);
}


// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
function initial(array, n, guard) {
  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}

// Get the last element of an array. Passing **n** will return the last N
// values in the array.
function last(array, n, guard) {
  if (array == null || array.length < 1) return n == null ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return rest(array, Math.max(0, array.length - n));
}

// Returns everything but the first entry of the array. Especially useful on
// the arguments object. Passing an **n** will return the rest N values in the
// array.
function rest(array, n, guard) {
  return slice.call(array, n == null || guard ? 1 : n);
}


// Trim out all falsy values from an array.
function compact(array) {
  return filter(array, Boolean);
}

// Internal implementation of a recursive `flatten` function.
function _flatten(input, shallow, strict, output) {
  output = output || [];
  var idx = output.length;
  for (var i = 0, length = getLength(input); i < length; i++) {
    var value = input[i];
    if (isArrayLike(value) && (isArray(value) || isArguments(value))) {
      // Flatten current level of array or arguments object.
      if (shallow) {
        var j = 0, len = value.length;
        while (j < len) output[idx++] = value[j++];
      } else {
        _flatten(value, shallow, strict, output);
        idx = output.length;
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
}

// Flatten out an array, either recursively (by default), or just one level.
function flatten(array, shallow) {
  return _flatten(array, shallow, false);
}

// Return a version of the array that does not contain the specified value(s).
var without = restArguments(function(array, otherArrays) {
  return difference(array, otherArrays);
});

// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// The faster algorithm will not work with an iteratee if the iteratee
// is not a one-to-one function, so providing an iteratee will disable
// the faster algorithm.
function uniq(array, isSorted, iteratee, context) {
  if (!isBoolean(isSorted)) {
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
    if (isSorted && !iteratee) {
      if (!i || seen !== computed) result.push(value);
      seen = computed;
    } else if (iteratee) {
      if (!contains(seen, computed)) {
        seen.push(computed);
        result.push(value);
      }
    } else if (!contains(result, value)) {
      result.push(value);
    }
  }
  return result;
}


// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
var union = restArguments(function(arrays) {
  return uniq(_flatten(arrays, true, true));
});

// Produce an array that contains every item shared between all the
// passed-in arrays.
function intersection(array) {
  var result = [];
  var argsLength = arguments.length;
  for (var i = 0, length = getLength(array); i < length; i++) {
    var item = array[i];
    if (contains(result, item)) continue;
    var j;
    for (j = 1; j < argsLength; j++) {
      if (!contains(arguments[j], item)) break;
    }
    if (j === argsLength) result.push(item);
  }
  return result;
}

// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
var difference = restArguments(function(array, rest) {
  rest = _flatten(rest, true, true);
  return filter(array, function(value){
    return !contains(rest, value);
  });
});

// Complement of zip. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.
function unzip(array) {
  var length = array && max(array, getLength).length || 0;
  var result = Array(length);

  for (var index = 0; index < length; index++) {
    result[index] = pluck(array, index);
  }
  return result;
}

// Zip together multiple lists into a single array -- elements that share
// an index go together.
var zip = restArguments(unzip);

// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values. Passing by pairs is the reverse of pairs.
function object(list, values) {
  var result = {};
  for (var i = 0, length = getLength(list); i < length; i++) {
    if (values) {
      result[list[i]] = values[i];
    } else {
      result[list[i][0]] = list[i][1];
    }
  }
  return result;
}

// Generator function to create the findIndex and findLastIndex functions.
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

// Returns the first index on an array-like that passes a predicate test.
var findIndex = createPredicateIndexFinder(1);
var findLastIndex = createPredicateIndexFinder(-1);

// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
function sortedIndex(array, obj, iteratee, context) {
  iteratee = cb(iteratee, context, 1);
  var value = iteratee(obj);
  var low = 0, high = getLength(array);
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
  }
  return low;
}

// Generator function to create the indexOf and lastIndexOf functions.
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
      idx = predicateFind(slice.call(array, i, length), isNaN);
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
var indexOf = createIndexFinder(1, findIndex, sortedIndex);
var lastIndexOf = createIndexFinder(-1, findLastIndex);

// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](https://docs.python.org/library/functions.html#range).
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
}

// Chunk a single array into multiple arrays, each containing `count` or fewer
// items.
function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result = [];
  var i = 0, length = array.length;
  while (i < length) {
    result.push(slice.call(array, i, i += count));
  }
  return result;
}

// Function (ahem) Functions
// ------------------

// Determines whether to execute a function as a constructor
// or a normal function with the provided arguments.
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
  var self = baseCreate(sourceFunc.prototype);
  var result = sourceFunc.apply(self, args);
  if (isObject(result)) return result;
  return self;
}

// Create a function bound to a given object (assigning `this`, and arguments,
// optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
// available.
var bind = restArguments(function(func, context, args) {
  if (!isFunction(func)) throw new TypeError('Bind must be called on a function');
  var bound = restArguments(function(callArgs) {
    return executeBound(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
});

// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. _ acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `partial.placeholder` for a custom placeholder argument.
var partial = restArguments(function(func, boundArgs) {
  var placeholder = partial.placeholder;
  var bound = function() {
    var position = 0, length = boundArgs.length;
    var args = Array(length);
    for (var i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return executeBound(func, bound, this, this, args);
  };
  return bound;
});

partial.placeholder = _;

// Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
var bindAll = restArguments(function(obj, _keys) {
  _keys = _flatten(_keys, false, false);
  var index = _keys.length;
  if (index < 1) throw new Error('bindAll must be passed function names');
  while (index--) {
    var key = _keys[index];
    obj[key] = bind(obj[key], obj);
  }
});

// Memoize an expensive function by storing its results.
function memoize(func, hasher) {
  var memoize = function(key) {
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!_has(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
}

// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
var delay = restArguments(function(func, wait, args) {
  return setTimeout(function() {
    return func.apply(null, args);
  }, wait);
});

// Defers a function, scheduling it to run after the current call stack has
// cleared.
var defer = partial(delay, _, 1);

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var _now = now();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout, result;

  var later = function(context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  var debounced = restArguments(function(args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
function wrap(func, wrapper) {
  return partial(wrapper, func);
}

// Returns a negated version of the passed-in predicate.
function negate(predicate) {
  return function() {
    return !predicate.apply(this, arguments);
  };
}

// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

// Returns a function that will only be executed on and after the Nth call.
function after(times, func) {
  return function() {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
}

// Returns a function that will only be executed up to (but not including) the Nth call.
function before(times, func) {
  var memo;
  return function() {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }
    if (times <= 1) func = null;
    return memo;
  };
}

// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
var once = partial(before, 2);

// Object Functions
// ----------------

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
  'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

function collectNonEnumProps(obj, _keys) {
  var nonEnumIdx = nonEnumerableProps.length;
  var constructor = obj.constructor;
  var proto = isFunction(constructor) && constructor.prototype || ObjProto;

  // Constructor is a special case.
  var prop = 'constructor';
  if (_has(obj, prop) && !contains(_keys, prop)) _keys.push(prop);

  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !contains(_keys, prop)) {
      _keys.push(prop);
    }
  }
}

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
function keys(obj) {
  if (!isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj);
  var _keys = [];
  for (var key in obj) if (_has(obj, key)) _keys.push(key);
  // Ahem, IE < 9.
  if (hasEnumBug) collectNonEnumProps(obj, _keys);
  return _keys;
}

// Retrieve all the property names of an object.
function allKeys(obj) {
  if (!isObject(obj)) return [];
  var _keys = [];
  for (var key in obj) _keys.push(key);
  // Ahem, IE < 9.
  if (hasEnumBug) collectNonEnumProps(obj, _keys);
  return _keys;
}

// Retrieve the values of an object's properties.
function values(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var values = Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[_keys[i]];
  }
  return values;
}

// Returns the results of applying the iteratee to each element of the object.
// In contrast to map it returns an object.
function mapObject(obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var _keys = keys(obj),
      length = _keys.length,
      results = {};
  for (var index = 0; index < length; index++) {
    var currentKey = _keys[index];
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

// Convert an object into a list of `[key, value]` pairs.
// The opposite of object.
function pairs(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var pairs = Array(length);
  for (var i = 0; i < length; i++) {
    pairs[i] = [_keys[i], obj[_keys[i]]];
  }
  return pairs;
}

// Invert the keys and values of an object. The values must be serializable.
function invert(obj) {
  var result = {};
  var _keys = keys(obj);
  for (var i = 0, length = _keys.length; i < length; i++) {
    result[obj[_keys[i]]] = _keys[i];
  }
  return result;
}

// Return a sorted list of the function names available on the object.
function functions(obj) {
  var names = [];
  for (var key in obj) {
    if (isFunction(obj[key])) names.push(key);
  }
  return names.sort();
}


// An internal function for creating assigner functions.
function createAssigner(keysFunc, defaults) {
  return function(obj) {
    var length = arguments.length;
    if (defaults) obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (var index = 1; index < length; index++) {
      var source = arguments[index],
          _keys = keysFunc(source),
          l = _keys.length;
      for (var i = 0; i < l; i++) {
        var key = _keys[i];
        if (!defaults || obj[key] === void 0) obj[key] = source[key];
      }
    }
    return obj;
  };
}

// Extend a given object with all the properties in passed-in object(s).
var extend = createAssigner(allKeys);

// Assigns a given object with all the own properties in the passed-in object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
var extendOwn = createAssigner(keys);


// Returns the first key on an object that passes a predicate test.
function findKey(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = keys(obj), key;
  for (var i = 0, length = _keys.length; i < length; i++) {
    key = _keys[i];
    if (predicate(obj[key], key, obj)) return key;
  }
}

// Internal pick helper function to determine if `obj` has key `key`.
function keyInObj(value, key, obj) {
  return key in obj;
}

// Return a copy of the object only containing the whitelisted properties.
var pick = restArguments(function(obj, _keys) {
  var result = {}, iteratee = _keys[0];
  if (obj == null) return result;
  if (isFunction(iteratee)) {
    if (_keys.length > 1) iteratee = optimizeCb(iteratee, _keys[1]);
    _keys = allKeys(obj);
  } else {
    iteratee = keyInObj;
    _keys = _flatten(_keys, false, false);
    obj = Object(obj);
  }
  for (var i = 0, length = _keys.length; i < length; i++) {
    var key = _keys[i];
    var value = obj[key];
    if (iteratee(value, key, obj)) result[key] = value;
  }
  return result;
});

// Return a copy of the object without the blacklisted properties.
var omit = restArguments(function(obj, _keys) {
  var iteratee = _keys[0], context;
  if (isFunction(iteratee)) {
    iteratee = negate(iteratee);
    if (_keys.length > 1) context = _keys[1];
  } else {
    _keys = map(_flatten(_keys, false, false), String);
    iteratee = function(value, key) {
      return !contains(_keys, key);
    };
  }
  return pick(obj, iteratee, context);
});

// Fill in a given object with default properties.
var defaults = createAssigner(allKeys, true);

// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
function create(prototype, props) {
  var result = baseCreate(prototype);
  if (props) extendOwn(result, props);
  return result;
}

// Create a (shallow-cloned) duplicate of an object.
function clone(obj) {
  if (!isObject(obj)) return obj;
  return isArray(obj) ? obj.slice() : extend({}, obj);
}

// Invokes interceptor with the obj, and then returns obj.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
function tap(obj, interceptor) {
  interceptor(obj);
  return obj;
}

// Returns whether an object has a given set of `key:value` pairs.
function isMatch(object, attrs) {
  var _keys = keys(attrs), length = _keys.length;
  if (object == null) return !length;
  var obj = Object(object);
  for (var i = 0; i < length; i++) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
}


// Internal recursive comparison function for `isEqual`.
function eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  // `null` or `undefined` only equal to itself (strict comparison).
  if (a == null || b == null) return false;
  // `NaN`s are equivalent, but non-reflexive.
  if (a !== a) return b !== b;
  // Exhaust primitive checks
  var type = typeof a;
  if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
  return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `isEqual`.
function deepEq(a, b, aStack, bStack) {
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
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) return +b !== +b;
      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
    case '[object Symbol]':
      return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
  }

  var areArrays = className === '[object Array]';
  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') return false;

    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                             isFunction(bCtor) && bCtor instanceof bCtor)
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
    var _keys = keys(a), key;
    length = _keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (keys(b).length !== length) return false;
    while (length--) {
      // Deep compare each member
      key = _keys[length];
      if (!(_has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return true;
}

// Perform a deep comparison to check if two objects are equal.
function isEqual(a, b) {
  return eq(a, b);
}

// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
function isEmpty(obj) {
  if (obj == null) return true;
  if (isArrayLike(obj) && (isArray(obj) || isString(obj) || isArguments(obj))) return obj.length === 0;
  return keys(obj).length === 0;
}

// Is a given value a DOM element?
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

// Internal function for creating a toString-based type tester.
function tagTester(name) {
  return function(obj) {
    return toString.call(obj) === '[object ' + name + ']';
  };
}

// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
var isArray = nativeIsArray || tagTester('Array');

// Is a given variable an object?
function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
var isArguments = tagTester('Arguments');
var isFunction = tagTester('Function');
var isString = tagTester('String');
var isNumber = tagTester('Number');
var isDate = tagTester('Date');
var isRegExp = tagTester('RegExp');
var isError = tagTester('Error');
var isSymbol = tagTester('Symbol');
var isMap = tagTester('Map');
var isWeakMap = tagTester('WeakMap');
var isSet = tagTester('Set');
var isWeakSet = tagTester('WeakSet');

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
(function() {
  if (!isArguments(arguments)) {
    isArguments = function(obj) {
      return _has(obj, 'callee');
    };
  }
}());

// Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
// IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
var nodelist = root.document && root.document.childNodes;
if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
  isFunction = function(obj) {
    return typeof obj == 'function' || false;
  };
}

// Is a given object a finite number?
function isFinite(obj) {
  return !isSymbol(obj) && _isFinite(obj) && !_isNaN(parseFloat(obj));
}

// Is the given value `NaN`?
function isNaN(obj) {
  return isNumber(obj) && _isNaN(obj);
}

// Is a given value a boolean?
function isBoolean(obj) {
  return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}

// Is a given value equal to null?
function isNull(obj) {
  return obj === null;
}

// Is a given variable undefined?
function isUndefined(obj) {
  return obj === void 0;
}

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
function has(obj, path) {
  if (!isArray(path)) {
    return _has(obj, path);
  }
  var length = path.length;
  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (obj == null || !hasOwnProperty.call(obj, key)) {
      return false;
    }
    obj = obj[key];
  }
  return !!length;
}

// Utility Functions
// -----------------

// Keep the identity function around for default iteratees.
function identity(value) {
  return value;
}

// Predicate-generating functions. Often useful outside of Underscore.
function constant(value) {
  return function() {
    return value;
  };
}

function noop(){}

// Creates a function that, when passed an object, will traverse that object’s
// properties down the given `path`, specified as an array of keys or indexes.
function property(path) {
  if (!isArray(path)) {
    return shallowProperty(path);
  }
  return function(obj) {
    return deepGet(obj, path);
  };
}

// Generates a function for a given object that returns a given property.
function propertyOf(obj) {
  if (obj == null) {
    return function(){};
  }
  return function(path) {
    return !isArray(path) ? obj[path] : deepGet(obj, path);
  };
}

// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
function matcher(attrs) {
  attrs = extendOwn({}, attrs);
  return function(obj) {
    return isMatch(obj, attrs);
  };
}


// Run a function **n** times.
function times(n, iteratee, context) {
  var accum = Array(Math.max(0, n));
  iteratee = optimizeCb(iteratee, context, 1);
  for (var i = 0; i < n; i++) accum[i] = iteratee(i);
  return accum;
}

// Return a random integer between min and max (inclusive).
function random(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}

// A (possibly faster) way to get the current timestamp as an integer.
var now = Date.now || function() {
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
var unescapeMap = invert(escapeMap);

// Functions for escaping and unescaping strings to/from HTML interpolation.
function createEscaper(map) {
  var escaper = function(match) {
    return map[match];
  };
  // Regexes for identifying a key that needs to be escaped.
  var source = '(?:' + keys(map).join('|') + ')';
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function(string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}
var escape = createEscaper(escapeMap);
var unescape = createEscaper(unescapeMap);

// Traverses the children of `obj` along `path`. If a child is a function, it
// is invoked with its parent as context. Returns the value of the final
// child, or `fallback` if any child is undefined.
function result(obj, path, fallback) {
  if (!isArray(path)) path = [path];
  var length = path.length;
  if (!length) {
    return isFunction(fallback) ? fallback.call(obj) : fallback;
  }
  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path[i]];
    if (prop === void 0) {
      prop = fallback;
      i = length; // Ensure we don't continue iterating.
    }
    obj = isFunction(prop) ? prop.call(obj) : prop;
  }
  return obj;
}

// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter + '';
  return prefix ? prefix + id : id;
}

// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
var templateSettings = _.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g
};

// When customizing `templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /(.)^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
  "'": "'",
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

var escapeChar = function(match) {
  return '\\' + escapes[match];
};

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
function template(text, settings, oldSettings) {
  if (!settings && oldSettings) settings = oldSettings;
  settings = defaults({}, settings, _.templateSettings);

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
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;

    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }

    // Adobe VMs need the match returned to produce the correct offset.
    return match;
  });
  source += "';\n";

  // If a variable is not specified, place data values in local scope.
  if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

  source = "var __t,__p='',__j=Array.prototype.join," +
    "print=function(){__p+=__j.call(arguments,'');};\n" +
    source + 'return __p;\n';

  var render;
  try {
    render = new Function(settings.variable || 'obj', '_', source);
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
}

// Add a "chain" function. Start chaining a wrapped Underscore object.
function chain(obj) {
  var instance = _(obj);
  instance._chain = true;
  return instance;
}

// OOP
// ---------------
// If Underscore is called as a function, it returns a wrapped object that
// can be used OO-style. This wrapper holds altered versions of all the
// underscore functions. Wrapped objects may be chained.

// Helper function to continue chaining intermediate results.
function chainResult(instance, obj) {
  return instance._chain ? _(obj).chain() : obj;
}

// Add your own custom functions to the Underscore object.
function mixin(obj) {
  each(functions(obj), function(name) {
    var func = _[name] = obj[name];
    _.prototype[name] = function() {
      var args = [this._wrapped];
      push.apply(args, arguments);
      return chainResult(this, func.apply(_, args));
    };
  });
  return _;
}

// Add all mutator Array functions to the wrapper.
each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
  var method = ArrayProto[name];
  _.prototype[name] = function() {
    var obj = this._wrapped;
    method.apply(obj, arguments);
    if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
    return chainResult(this, obj);
  };
});

// Add all accessor Array functions to the wrapper.
each(['concat', 'join', 'slice'], function(name) {
  var method = ArrayProto[name];
  _.prototype[name] = function() {
    return chainResult(this, method.apply(this._wrapped, arguments));
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
  return String(this._wrapped);
};

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(6)))

/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JQueryUtils = /** @class */ (function () {
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var EndpointCaller_1 = __webpack_require__(21);
var Logger_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(1);
var Version_1 = __webpack_require__(25);
var AjaxError_1 = __webpack_require__(26);
var MissingAuthenticationError_1 = __webpack_require__(27);
var QueryUtils_1 = __webpack_require__(28);
var QueryError_1 = __webpack_require__(29);
var Utils_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var coveo_analytics_1 = __webpack_require__(30);
var CookieUtils_1 = __webpack_require__(37);
var TimeSpanUtils_1 = __webpack_require__(9);
var UrlUtils_1 = __webpack_require__(10);
var AccessToken_1 = __webpack_require__(38);
var BackOffRequest_1 = __webpack_require__(39);
var Plan_1 = __webpack_require__(47);
var DefaultSearchEndpointOptions = /** @class */ (function () {
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
 * The `SearchEndpoint` class allows the framework to perform HTTP requests against the Search API (e.g., searching, getting query suggestions, getting the HTML preview of an item, etc.).
 *
 * **Note:**
 *
 * When writing custom code that interacts with the Search API, be aware that executing queries directly through an instance of this class will *not* trigger any [query events](https://docs.coveo.com/en/417/#query-events).
 *
 * In some cases, this may be what you want. However, if you *do* want query events to be triggered (e.g., to ensure that standard components update themselves as expected), use the [`queryController`]{@link QueryController} instance instead.
 *
 * @externaldocs [JavaScript Search Framework Endpoint](https://docs.coveo.com/en/331/)
 */
var SearchEndpoint = /** @class */ (function () {
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
        this.accessToken = new AccessToken_1.AccessToken(this.options.accessToken, this.options.renewAccessToken);
        this.accessToken.subscribeToRenewal(function () { return _this.createEndpointCaller(); });
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
     * Configures a demo search endpoint on a Coveo Cloud V1 organization whose index contains various types of non-secured items.
     *
     * **Note:** This method mainly exists for demo and testing purposes.
     *
     * @param otherOptions Additional options to apply for this endpoint.
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
     * Configures a demo search endpoint on a Coveo Cloud V2 organization whose index contains various types of non-secured items.
     *
     * **Note:** This method mainly exists for demo and testing purposes.
     *
     * @param otherOptions Additional options to apply for this endpoint.
     */
    SearchEndpoint.configureSampleEndpointV2 = function (otherOptions) {
        SearchEndpoint.endpoints['default'] = new SearchEndpoint(_.extend({
            restUri: 'https://platform.cloud.coveo.com/rest/search',
            accessToken: 'xx564559b1-0045-48e1-953c-3addd1ee4457',
            queryStringArguments: {
                organizationId: 'searchuisamples',
                viewAllContent: 1
            }
        }, otherOptions));
    };
    /**
     * Configures a search endpoint on a Coveo Cloud V1 index.
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
     * [Configures a new search endpoint](https://docs.coveo.com/331/#configuring-a-new-search-endpoint) on a Coveo Cloud V2 organization.
     * @param organization The unique identifier of the target Coveo Cloud V2 organization (e.g., `mycoveocloudv2organizationg8tp8wu3`).
     * @param token The access token to authenticate Search API requests with (i.e., an [API key](https://docs.coveo.com/105/) or a [search token](https://docs.coveo.com/56/)).
     *
     * **Note:** This token will also authenticate Usage Analytics Write API requests if the search interface initializes an [`Analytics`]{@link Analytics} component whose [`token`]{@link Analytics.options.token} option is unspecified.
     * @param uri The base URI of the Search API.
     *
     * **Allowed values:**
     *
     * - `https://platform.cloud.coveo.com/rest/search` (for organizations in the standard Coveo Cloud V2 environment)
     * - `https://platformhipaa.cloud.coveo.com/rest/search` (for [HIPAA](https://docs.coveo.com/1853/) organizations)
     * - `https://globalplatform.cloud.coveo.com/rest/search` (for [multi-region](https://docs.coveo.com/2976/) organizations)
     *
     * **Default:** `https://platform.cloud.coveo.com/rest/search`
     * @param otherOptions Additional options to apply for this endpoint (e.g., a [`renewAccessToken`]{@link ISearchEndpointOptions.renewAccessToken} function).
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
    Object.defineProperty(SearchEndpoint, "defaultEndpoint", {
        get: function () {
            return this.endpoints['default'] || _.find(SearchEndpoint.endpoints, function (endpoint) { return endpoint != null; });
        },
        enumerable: true,
        configurable: true
    });
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
        return UrlUtils_1.UrlUtils.normalizeAsString({
            paths: [callParams.url, provider],
            queryAsString: callParams.queryString,
            query: __assign({ redirectUri: returnUri, message: message }, this.buildBaseQueryString(callOptions))
        });
    };
    /**
     * Indicates whether the search endpoint is using JSONP internally to communicate with the Search API.
     * @returns {boolean} `true` in the search enpoint is using JSONP; `false` otherwise.
     */
    SearchEndpoint.prototype.isJsonp = function () {
        return this.caller.useJsonp;
    };
    SearchEndpoint.prototype.buildCompleteCall = function (request, callOptions, callParams) {
        Assert_1.Assert.exists(request);
        callParams = __assign({}, callParams, { requestData: __assign({}, callParams.requestData, _.omit(request, function (queryParam) { return Utils_1.Utils.isNullOrUndefined(queryParam); })) });
        return { options: callOptions, params: callParams };
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
        var call = this.buildCompleteCall(query, callOptions, callParams);
        this.logger.info('Performing REST query', query);
        var start = new Date();
        return this.performOneCall(call.params, call.options).then(function (results) {
            _this.logger.info('REST query successful', results, query);
            // Version check
            // If the SearchAPI doesn't give us any apiVersion info, we assume version 1 (before apiVersion was implemented)
            if (results.apiVersion == null) {
                results.apiVersion = 1;
            }
            if (results.apiVersion < Version_1.version.supportedApiVersion) {
                _this.logger.error('Please update your REST Search API');
            }
            // Transform the duration compared to what the search API returns
            // We want to have the "duration" to be the time as seen by the browser
            results.searchAPIDuration = results.duration;
            results.duration = TimeSpanUtils_1.TimeSpan.fromDates(start, new Date()).getMilliseconds();
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
     * Gets the plan of execution of a search request, without performing it.
     *
     * @param query The query to execute. Typically, the query object is built using a
     * [`QueryBuilder`]{@link QueryBuilder}.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<ExecutionPlan>} A Promise of plan results.
     */
    SearchEndpoint.prototype.plan = function (query, callOptions, callParams) {
        return __awaiter(this, void 0, void 0, function () {
            var call, planResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        call = this.buildCompleteCall(query, callOptions, callParams);
                        this.logger.info('Performing REST query PLAN', query);
                        return [4 /*yield*/, this.performOneCall(call.params, call.options)];
                    case 1:
                        planResponse = _a.sent();
                        this.logger.info('REST query successful', planResponse, query);
                        return [2 /*return*/, new Plan_1.ExecutionPlan(planResponse)];
                }
            });
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
        return UrlUtils_1.UrlUtils.normalizeAsString({
            paths: callParams.url,
            queryAsString: callParams.queryString,
            query: __assign({ numberOfResults: numberOfResults ? numberOfResults.toString() : null, format: 'xlsx' }, this.buildQueryAsQueryString(null, query), this.buildBaseQueryString(callOptions))
        });
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
        callParams = UrlUtils_1.UrlUtils.merge(callParams, {
            paths: callParams.url,
            query: __assign({ dataStream: dataStreamType }, this.buildViewAsHtmlQueryString(documentUniqueId, callOptions))
        });
        this.logger.info('Performing REST query for datastream ' + dataStreamType + ' on item uniqueID ' + documentUniqueId);
        return this.performOneCall(callParams, callOptions).then(function (results) {
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
        if (callOptions === void 0) { callOptions = {}; }
        return UrlUtils_1.UrlUtils.normalizeAsString({
            paths: callParams.url,
            queryAsString: callParams.queryString,
            query: __assign({ dataStream: dataStreamType }, this.buildViewAsHtmlQueryString(documentUniqueID, callOptions), this.buildQueryAsQueryString(callOptions.query, callOptions.queryObject), this.buildBaseQueryString(callOptions))
        });
    };
    /**
     * Gets a single item, using its `uniqueId`.
     * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<IQueryResult>} A Promise of the item.
     */
    SearchEndpoint.prototype.getDocument = function (documentUniqueID, callOptions, callParams) {
        var _this = this;
        callParams = UrlUtils_1.UrlUtils.merge(callParams, {
            paths: callParams.url,
            queryAsString: callParams.queryString,
            query: __assign({}, this.buildViewAsHtmlQueryString(documentUniqueID, callOptions))
        });
        this.logger.info('Performing REST query to retrieve document', documentUniqueID);
        return this.performOneCall(callParams, callOptions).then(function (result) {
            _this.logger.info('REST query successful', result, documentUniqueID);
            return result;
        });
    };
    /**
     * Gets the content of a single item, as text (think: quickview).
     * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<string>} A Promise of the item content.
     */
    SearchEndpoint.prototype.getDocumentText = function (documentUniqueID, callOptions, callParams) {
        var _this = this;
        callParams = UrlUtils_1.UrlUtils.merge(callParams, {
            paths: callParams.url,
            queryAsString: callParams.queryString,
            query: __assign({}, this.buildViewAsHtmlQueryString(documentUniqueID, callOptions))
        });
        this.logger.info('Performing REST query to retrieve "TEXT" version of document', documentUniqueID);
        return this.performOneCall(callParams, callOptions).then(function (data) {
            _this.logger.info('REST query successful', data, documentUniqueID);
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
        var _this = this;
        callOptions = __assign({}, callOptions);
        callParams = UrlUtils_1.UrlUtils.merge(__assign({}, callParams, { requestData: callOptions.queryObject || { q: callOptions.query } }), {
            paths: callParams.url,
            queryAsString: callParams.queryString,
            query: __assign({}, this.buildViewAsHtmlQueryString(documentUniqueID, callOptions))
        });
        this.logger.info('Performing REST query to retrieve "HTML" version of document', documentUniqueID);
        return this.performOneCall(callParams, callOptions).then(function (result) {
            _this.logger.info('REST query successful', result, documentUniqueID);
            return result;
        });
    };
    /**
     * Gets an URL from which it is possible to see a single item content, as HTML (think: quickview).
     * @param documentUniqueID Typically, the {@link IQueryResult.uniqueId} on each result.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {string} The URL.
     */
    SearchEndpoint.prototype.getViewAsHtmlUri = function (documentUniqueID, callOptions, callParams) {
        return UrlUtils_1.UrlUtils.normalizeAsString({
            paths: callParams.url,
            queryAsString: callParams.queryString,
            query: __assign({}, this.buildViewAsHtmlQueryString(documentUniqueID, callOptions), this.buildBaseQueryString(callOptions))
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
        callParams = __assign({}, callParams, { requestData: __assign({}, callParams.requestData, request) });
        this.logger.info('Listing field values', request);
        return this.performOneCall(callParams, callOptions).then(function (data) {
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
    SearchEndpoint.prototype.listFieldValuesBatch = function (request, callOptions, callParams) {
        var _this = this;
        Assert_1.Assert.exists(request);
        callParams = __assign({}, callParams, { requestData: __assign({}, callParams.requestData, request) });
        this.logger.info('Listing field batch values', request);
        return this.performOneCall(callParams, callOptions).then(function (data) {
            _this.logger.info('REST list field batch values successful', data.batch, request);
            return data.batch;
        });
    };
    /**
     * Lists all fields for the index, and returns an array of their descriptions.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<TResult>|Promise<U>} A Promise of the index fields and descriptions.
     */
    SearchEndpoint.prototype.listFields = function (callOptions, callParams) {
        var _this = this;
        this.logger.info('Listing fields');
        return this.performOneCall(callParams, callOptions).then(function (data) {
            _this.logger.info('REST list fields successful', data.fields);
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
        var _this = this;
        this.logger.info('Performing REST query to list extensions');
        return this.performOneCall(callParams, callOptions).then(function (extensions) {
            _this.logger.info('REST query successful', extensions);
            return extensions;
        });
    };
    /**
     * **Note:**
     *
     * > The Coveo Cloud V2 platform does not support collaborative rating. Therefore, this method is obsolete in Coveo Cloud V2.
     *
     * Rates a single item in the index (granted that collaborative rating is enabled on your index)
     * @param ratingRequest The item id, and the rating to add.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<boolean>|Promise<T>}
     */
    SearchEndpoint.prototype.rateDocument = function (ratingRequest, callOptions, callParams) {
        var _this = this;
        this.logger.info('Performing REST query to rate a document', ratingRequest);
        callParams = __assign({}, callParams, { requestData: __assign({}, callParams.requestData, ratingRequest) });
        return this.performOneCall(callParams, callOptions).then(function () {
            _this.logger.info('REST query successful', ratingRequest);
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
        var _this = this;
        this.logger.info('Performing REST query to tag an item', taggingRequest);
        callParams = __assign({}, callParams, { requestData: __assign({}, callParams.requestData, taggingRequest) });
        return this.performOneCall(callParams, callOptions).then(function () {
            _this.logger.info('REST query successful', taggingRequest);
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
        var _this = this;
        var call = this.buildCompleteCall(request, callOptions, callParams);
        this.logger.info('Performing REST query to get query suggest', request);
        return this.performOneCall(call.params, call.options).then(function (response) {
            _this.logger.info('REST query successful', response);
            return response;
        });
    };
    // This is a non documented method to ensure backward compatibility for the old query suggest call.
    // It simply calls the "real" official and documented method.
    SearchEndpoint.prototype.getRevealQuerySuggest = function (request, callOptions, callParams) {
        return this.getQuerySuggest(request, callOptions, callParams);
    };
    /**
     * Searches through the values of a facet.
     * @param request The request for which to search through the values of a facet.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<IFacetSearchResponse>} A Promise of facet search results.
     */
    SearchEndpoint.prototype.facetSearch = function (request, callOptions, callParams) {
        return __awaiter(this, void 0, void 0, function () {
            var call, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        call = this.buildCompleteCall(request, callOptions, callParams);
                        this.logger.info('Performing REST query to get facet search results', request);
                        return [4 /*yield*/, this.performOneCall(call.params, call.options)];
                    case 1:
                        response = _a.sent();
                        this.logger.info('REST query successful', response);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Follows an item, or a query result, using the search alerts service.
     * @param request The subscription details.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<ISubscription>}
     */
    SearchEndpoint.prototype.follow = function (request, callOptions, callParams) {
        var _this = this;
        callParams.requestData = request;
        this.logger.info('Performing REST query to follow an item or a query', request);
        return this.performOneCall(callParams, callOptions).then(function (subscription) {
            _this.logger.info('REST query successful', subscription);
            return subscription;
        });
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
            callParams = UrlUtils_1.UrlUtils.merge(callParams, {
                paths: callParams.url,
                query: {
                    page: page || 0
                }
            });
            this.logger.info('Performing REST query to list subscriptions');
            this.currentListSubscriptions = this.performOneCall(callParams, callOptions);
            this.currentListSubscriptions
                .then(function (data) {
                _this.currentListSubscriptions = null;
                _this.logger.info('REST query successful', data);
                return data;
            })
                .catch(function (e) {
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
        var _this = this;
        callParams = UrlUtils_1.UrlUtils.merge(__assign({}, callParams, { requestData: __assign({}, callParams.requestData, subscription) }), {
            paths: [callParams.url, subscription.id]
        });
        this.logger.info('Performing REST query to update a subscription', subscription);
        return this.performOneCall(callParams, callOptions).then(function (subscription) {
            _this.logger.info('REST query successful', subscription);
            return subscription;
        });
    };
    /**
     * Deletes a subscription.
     * @param subscription The subscription to delete.
     * @param callOptions An additional set of options to use for this call.
     * @param callParams The options injected by the applied decorators.
     * @returns {Promise<ISubscription>}
     */
    SearchEndpoint.prototype.deleteSubscription = function (subscription, callOptions, callParams) {
        var _this = this;
        callParams = UrlUtils_1.UrlUtils.merge(callParams, {
            paths: [callParams.url, subscription.id]
        });
        this.logger.info('Performing REST query to delete a subscription', subscription);
        return this.performOneCall(callParams, callOptions).then(function (subscription) {
            _this.logger.info('REST query successful', subscription);
            return subscription;
        });
    };
    SearchEndpoint.prototype.logError = function (sentryLog, callOptions, callParams) {
        callParams = __assign({}, callParams, { requestData: __assign({}, callParams.requestData, sentryLog) });
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
        this.caller = new EndpointCaller_1.EndpointCaller(__assign({}, this.options, { accessToken: this.accessToken.token }));
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
        return UrlUtils_1.UrlUtils.normalizeAsString({
            paths: [this.options.restUri, this.options.version, path]
        });
    };
    SearchEndpoint.prototype.buildSearchAlertsUri = function (path) {
        Assert_1.Assert.isString(path);
        var baseUrl = this.options.searchAlertsUri ||
            UrlUtils_1.UrlUtils.normalizeAsString({
                paths: [this.options.restUri, '/alerts']
            });
        var url = UrlUtils_1.UrlUtils.normalizeAsString({
            paths: [baseUrl, path]
        });
        return url;
    };
    SearchEndpoint.prototype.buildBaseQueryString = function (callOptions) {
        callOptions = __assign({}, callOptions);
        if (_.isArray(callOptions.authentication) && Utils_1.Utils.isNonEmptyArray(callOptions.authentication)) {
            return __assign({}, this.options.queryStringArguments, { authentication: callOptions.authentication.join(',') });
        }
        else {
            return __assign({}, this.options.queryStringArguments);
        }
    };
    SearchEndpoint.prototype.buildQueryAsQueryString = function (query, queryObject) {
        queryObject = __assign({}, queryObject);
        // In an ideal parallel reality, the entire query used in the 'search' call is used here.
        // In this reality however, we must support GET calls (ex: GET /html) for CORS/JSONP/IE reasons.
        // Therefore, we cherry-pick parts of the query to include in a 'query string' instead of a body payload.
        var queryParameters = {};
        ['q', 'aq', 'cq', 'dq', 'searchHub', 'tab', 'locale', 'pipeline', 'lowercaseOperators', 'timezone'].forEach(function (key) {
            queryParameters[key] = queryObject[key];
        });
        var context = {};
        _.pairs(queryObject.context).forEach(function (pair) {
            var key = pair[0], value = pair[1];
            context["context[" + Utils_1.Utils.safeEncodeURIComponent(key) + "]"] = value;
        });
        if (queryObject.fieldsToInclude) {
            var fieldsToInclude = queryObject.fieldsToInclude.map(function (field) {
                var uri = Utils_1.Utils.safeEncodeURIComponent(field.replace('@', ''));
                return "\"" + uri + "\"";
            });
            queryParameters.fieldsToInclude = "[" + fieldsToInclude.join(',') + "]";
        }
        return __assign({ q: query }, context, queryParameters);
    };
    SearchEndpoint.prototype.buildViewAsHtmlQueryString = function (uniqueId, callOptions) {
        callOptions = _.extend({}, callOptions);
        return {
            uniqueId: Utils_1.Utils.safeEncodeURIComponent(uniqueId),
            enableNavigation: 'true',
            requestedOutputSize: callOptions.requestedOutputSize ? callOptions.requestedOutputSize.toString() : null,
            contentType: callOptions.contentType
        };
    };
    SearchEndpoint.prototype.performOneCall = function (params, callOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var request, response, error_1, errorCode, _a, tokenWasRenewed, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = UrlUtils_1.UrlUtils.merge(params, {
                            paths: params.url,
                            queryAsString: params.queryString,
                            query: __assign({}, this.buildBaseQueryString(callOptions))
                        });
                        request = function () { return _this.caller.call(params); };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 10]);
                        return [4 /*yield*/, request()];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        error_1 = _b.sent();
                        if (!error_1) {
                            throw new Error('Request failed but it did not return an error.');
                        }
                        errorCode = error_1.statusCode;
                        _a = errorCode;
                        switch (_a) {
                            case 419: return [3 /*break*/, 4];
                            case 429: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 8];
                    case 4: return [4 /*yield*/, this.accessToken.doRenew()];
                    case 5:
                        tokenWasRenewed = _b.sent();
                        if (!tokenWasRenewed) {
                            throw this.handleErrorResponse(error_1);
                        }
                        return [2 /*return*/, this.performOneCall(params, callOptions)];
                    case 6: return [4 /*yield*/, this.backOffThrottledRequest(request)];
                    case 7:
                        response = _b.sent();
                        return [2 /*return*/, response.data];
                    case 8: throw this.handleErrorResponse(error_1);
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SearchEndpoint.prototype.backOffThrottledRequest = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var options, backoffRequest, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        options = { retry: function (e, attempt) { return _this.retryIf429Error(e, attempt); } };
                        backoffRequest = { fn: request, options: options };
                        return [4 /*yield*/, BackOffRequest_1.BackOffRequest.enqueue(backoffRequest)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        throw this.handleErrorResponse(e_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SearchEndpoint.prototype.retryIf429Error = function (e, attempt) {
        if (this.isThrottled(e)) {
            this.logger.info("Resending the request because it was throttled. Retry attempt " + attempt);
            return true;
        }
        return false;
    };
    SearchEndpoint.prototype.isThrottled = function (error) {
        return error && error.statusCode === 429;
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
    SearchEndpoint.prototype.isMissingAuthenticationProviderStatus = function (status) {
        return status == 402;
    };
    /**
     * A map of all initialized `SearchEndpoint` instances.
     *
     * **Example:** `Coveo.SearchEndpoint.endpoints["default"]` returns the default endpoint that was created at initialization.
     * @type {{}}
     */
    SearchEndpoint.endpoints = {};
    __decorate([
        path('/login/'),
        accessTokenInUrl()
    ], SearchEndpoint.prototype, "getAuthenticationProviderUri", null);
    __decorate([
        includeActionsHistory(),
        includeReferrer(),
        includeVisitorId(),
        includeIsGuestUser()
    ], SearchEndpoint.prototype, "buildCompleteCall", null);
    __decorate([
        path('/'),
        method('POST'),
        responseType('text')
    ], SearchEndpoint.prototype, "search", null);
    __decorate([
        path('/plan'),
        method('POST'),
        requestDataType('application/json'),
        responseType('json')
    ], SearchEndpoint.prototype, "plan", null);
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
    ], SearchEndpoint.prototype, "listFieldValues", null);
    __decorate([
        path('/values/batch'),
        method('POST'),
        responseType('text')
    ], SearchEndpoint.prototype, "listFieldValuesBatch", null);
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
        method('POST'),
        responseType('text')
    ], SearchEndpoint.prototype, "getQuerySuggest", null);
    __decorate([
        path('/facet'),
        method('POST'),
        requestDataType('application/json'),
        responseType('text'),
        includeActionsHistory(),
        includeReferrer(),
        includeVisitorId(),
        includeIsGuestUser()
    ], SearchEndpoint.prototype, "facetSearch", null);
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
    return SearchEndpoint;
}());
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
function decoratorSetup(target, key, descriptor) {
    return {
        originalMethod: descriptor.value,
        nbParams: target[key].prototype.constructor.length
    };
}
function defaultDecoratorEndpointCallParameters() {
    var params = {
        url: '',
        queryString: [],
        requestData: {},
        method: '',
        responseType: '',
        errorsAsSuccess: false
    };
    return params;
}
function path(path) {
    return function (target, key, descriptor) {
        var _a = decoratorSetup(target, key, descriptor), originalMethod = _a.originalMethod, nbParams = _a.nbParams;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var url = this.buildBaseUri(path);
            if (args[nbParams - 1]) {
                args[nbParams - 1].url = url;
            }
            else {
                var endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { url: url });
                args[nbParams - 1] = endpointCallParams;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function alertsPath(path) {
    return function (target, key, descriptor) {
        var _a = decoratorSetup(target, key, descriptor), originalMethod = _a.originalMethod, nbParams = _a.nbParams;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var url = this.buildSearchAlertsUri(path);
            if (args[nbParams - 1]) {
                args[nbParams - 1].url = url;
            }
            else {
                var endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { url: url });
                args[nbParams - 1] = endpointCallParams;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function requestDataType(type) {
    return function (target, key, descriptor) {
        var _a = decoratorSetup(target, key, descriptor), originalMethod = _a.originalMethod, nbParams = _a.nbParams;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args[nbParams - 1]) {
                args[nbParams - 1].requestDataType = type;
            }
            else {
                var endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { requestDataType: type });
                args[nbParams - 1] = endpointCallParams;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function method(met) {
    return function (target, key, descriptor) {
        var _a = decoratorSetup(target, key, descriptor), originalMethod = _a.originalMethod, nbParams = _a.nbParams;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args[nbParams - 1]) {
                args[nbParams - 1].method = met;
            }
            else {
                var endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { method: met });
                args[nbParams - 1] = endpointCallParams;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function responseType(resp) {
    return function (target, key, descriptor) {
        var _a = decoratorSetup(target, key, descriptor), originalMethod = _a.originalMethod, nbParams = _a.nbParams;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args[nbParams - 1]) {
                args[nbParams - 1].responseType = resp;
            }
            else {
                var endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { responseType: resp });
                args[nbParams - 1] = endpointCallParams;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function accessTokenInUrl(tokenKey) {
    if (tokenKey === void 0) { tokenKey = 'access_token'; }
    return function (target, key, descriptor) {
        var _a = decoratorSetup(target, key, descriptor), originalMethod = _a.originalMethod, nbParams = _a.nbParams;
        var buildAccessToken = function (tokenKey, endpointInstance) {
            var queryString = [];
            if (Utils_1.Utils.isNonEmptyString(endpointInstance.accessToken.token)) {
                queryString.push(tokenKey + '=' + Utils_1.Utils.safeEncodeURIComponent(endpointInstance.accessToken.token));
            }
            return queryString;
        };
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var queryString = buildAccessToken(tokenKey, this);
            if (args[nbParams - 1]) {
                args[nbParams - 1].queryString = args[nbParams - 1].queryString.concat(queryString);
            }
            else {
                var endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), { queryString: queryString });
                args[nbParams - 1] = endpointCallParams;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function includeActionsHistory(historyStore) {
    if (historyStore === void 0) { historyStore = new coveo_analytics_1.history.HistoryStore(); }
    return function (target, key, descriptor) {
        var _a = decoratorSetup(target, key, descriptor), originalMethod = _a.originalMethod, nbParams = _a.nbParams;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var historyFromStore = historyStore.getHistory();
            if (historyFromStore == null) {
                historyFromStore = [];
            }
            if (args[nbParams - 1]) {
                args[nbParams - 1].requestData.actionsHistory = historyFromStore;
            }
            else {
                var endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), {
                    requestData: { actionsHistory: historyFromStore }
                });
                args[nbParams - 1] = endpointCallParams;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function includeReferrer() {
    return function (target, key, descriptor) {
        var _a = decoratorSetup(target, key, descriptor), originalMethod = _a.originalMethod, nbParams = _a.nbParams;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var referrer = document.referrer;
            if (referrer == null) {
                referrer = '';
            }
            if (args[nbParams - 1]) {
                args[nbParams - 1].requestData.referrer = referrer;
            }
            else {
                var endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), {
                    requestData: { referrer: referrer }
                });
                args[nbParams - 1] = endpointCallParams;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function includeVisitorId() {
    return function (target, key, descriptor) {
        var _a = decoratorSetup(target, key, descriptor), originalMethod = _a.originalMethod, nbParams = _a.nbParams;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var visitorId = CookieUtils_1.Cookie.get('visitorId');
            if (visitorId == null) {
                visitorId = '';
            }
            if (args[nbParams - 1]) {
                args[nbParams - 1].requestData.visitorId = visitorId;
            }
            else {
                var endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), {
                    requestData: { visitorId: visitorId }
                });
                args[nbParams - 1] = endpointCallParams;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function includeIsGuestUser() {
    return function (target, key, descriptor) {
        var _a = decoratorSetup(target, key, descriptor), originalMethod = _a.originalMethod, nbParams = _a.nbParams;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var isGuestUser = this.options.isGuestUser;
            if (args[nbParams - 1]) {
                args[nbParams - 1].requestData.isGuestUser = isGuestUser;
            }
            else {
                var endpointCallParams = _.extend(defaultDecoratorEndpointCallParameters(), {
                    requestData: { isGuestUser: isGuestUser }
                });
                args[nbParams - 1] = endpointCallParams;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(1);
var TimeSpan = /** @class */ (function () {
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Utils_1 = __webpack_require__(2);
var UrlUtils = /** @class */ (function () {
    function UrlUtils() {
    }
    UrlUtils.getUrlParameter = function (name) {
        return (decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null);
    };
    UrlUtils.merge = function (endpointParameters) {
        var parts = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parts[_i - 1] = arguments[_i];
        }
        parts.forEach(function (part) {
            var _a = UrlUtils.normalizeAsParts(part), path = _a.path, queryNormalized = _a.queryNormalized;
            if (Utils_1.Utils.isNonEmptyString(path)) {
                endpointParameters = __assign({}, endpointParameters, { url: path });
            }
            if (Utils_1.Utils.isNonEmptyArray(queryNormalized)) {
                var queryStringExists = Utils_1.Utils.isNonEmptyArray(endpointParameters.queryString);
                var queryString = queryStringExists
                    ? Utils_1.Utils.concatWithoutDuplicate(endpointParameters.queryString, queryNormalized)
                    : queryNormalized;
                endpointParameters = __assign({}, endpointParameters, { queryString: queryString });
            }
        });
        return endpointParameters;
    };
    UrlUtils.normalizeAsString = function (toNormalize) {
        var _a = this.normalizeAsParts(toNormalize), queryNormalized = _a.queryNormalized, path = _a.path;
        return "" + path + this.addToUrlIfNotEmpty(queryNormalized, '&', '?');
    };
    UrlUtils.normalizeAsParts = function (toNormalize) {
        var pathsNormalized = this.normalizePaths(toNormalize);
        var queryNormalized = this.normalizeQueryString(toNormalize);
        return {
            pathsNormalized: pathsNormalized,
            queryNormalized: queryNormalized,
            path: this.addToUrlIfNotEmpty(pathsNormalized, '/', UrlUtils.getRelativePathLeadingCharacters(toNormalize))
        };
    };
    UrlUtils.getRelativePathLeadingCharacters = function (toNormalize) {
        var leadingRelativeUrlCharacters = '';
        var relativeUrlLeadingCharactersRegex = /^(([\/])+)/;
        var firstPath = underscore_1.first(this.toArray(toNormalize.paths));
        if (firstPath) {
            var match = relativeUrlLeadingCharactersRegex.exec(firstPath);
            if (match) {
                leadingRelativeUrlCharacters = match[0];
            }
        }
        return leadingRelativeUrlCharacters;
    };
    UrlUtils.normalizePaths = function (toNormalize) {
        var _this = this;
        return this.toArray(toNormalize.paths).map(function (path) {
            if (Utils_1.Utils.isNonEmptyString(path)) {
                return _this.removeProblematicChars(path);
            }
            return '';
        });
    };
    UrlUtils.normalizeQueryString = function (toNormalize) {
        var _this = this;
        var queryNormalized = [];
        if (toNormalize.queryAsString) {
            var cleanedUp = this.toArray(toNormalize.queryAsString).map(function (query) {
                query = _this.removeProblematicChars(query);
                query = _this.encodeKeyValuePair(query);
                return query;
            });
            queryNormalized = queryNormalized.concat(cleanedUp);
        }
        if (toNormalize.query) {
            var paired = underscore_1.pairs(toNormalize.query);
            var mapped = paired.map(function (pair) {
                var key = pair[0], value = pair[1];
                var exceptions = ['pipeline'];
                var isAnException = underscore_1.isString(key) && underscore_1.contains(exceptions, key.toLowerCase());
                if (!isAnException) {
                    if (UrlUtils.isInvalidQueryStringValue(value) || UrlUtils.isInvalidQueryStringValue(key)) {
                        return '';
                    }
                }
                if (!_this.isEncoded(value)) {
                    return [_this.removeProblematicChars(key), Utils_1.Utils.safeEncodeURIComponent(value)].join('=');
                }
                else {
                    return [_this.removeProblematicChars(key), value].join('=');
                }
            });
            queryNormalized = queryNormalized.concat(mapped);
        }
        return underscore_1.uniq(queryNormalized);
    };
    UrlUtils.addToUrlIfNotEmpty = function (toAdd, joinWith, leadWith) {
        if (Utils_1.Utils.isNonEmptyArray(toAdd)) {
            return "" + leadWith + underscore_1.compact(toAdd).join(joinWith);
        }
        return '';
    };
    UrlUtils.startsWith = function (searchString, targetString) {
        return targetString.substr(0, searchString.length) === searchString;
    };
    UrlUtils.endsWith = function (searchString, targetString) {
        return targetString.substring(targetString.length - searchString.length, targetString.length) === searchString;
    };
    UrlUtils.removeAtEnd = function (searchString, targetString) {
        while (this.endsWith(searchString, targetString)) {
            targetString = targetString.slice(0, targetString.length - searchString.length);
        }
        return targetString;
    };
    UrlUtils.removeAtStart = function (searchString, targetString) {
        while (this.startsWith(searchString, targetString)) {
            targetString = targetString.slice(searchString.length);
        }
        return targetString;
    };
    UrlUtils.toArray = function (parameter) {
        return underscore_1.isArray(parameter) ? parameter : [parameter];
    };
    UrlUtils.encodeKeyValuePair = function (pair) {
        var split = pair.split('=');
        if (split.length == 0) {
            return pair;
        }
        var key = split[0];
        var value = underscore_1.rest(split, 1).join('');
        if (!key) {
            return pair;
        }
        if (!value) {
            return pair;
        }
        key = this.removeProblematicChars(key);
        if (!this.isEncoded(value)) {
            value = Utils_1.Utils.safeEncodeURIComponent(value);
        }
        return key + "=" + value;
    };
    UrlUtils.removeProblematicChars = function (value) {
        var _this = this;
        ['?', '/', '#', '='].forEach(function (problematicChar) {
            value = _this.removeAtStart(problematicChar, value);
            value = _this.removeAtEnd(problematicChar, value);
        });
        return value;
    };
    UrlUtils.isEncoded = function (value) {
        return value != decodeURIComponent(value);
    };
    UrlUtils.isInvalidQueryStringValue = function (value) {
        if (underscore_1.isString(value)) {
            return Utils_1.Utils.isEmptyString(value);
        }
        return Utils_1.Utils.isNullOrUndefined(value);
    };
    return UrlUtils;
}());
exports.UrlUtils = UrlUtils;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var history_1 = __webpack_require__(12);
__webpack_require__(32);
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
        var store = new history_1.HistoryStore();
        var historyElement = {
            name: 'PageView',
            value: request.contentIdValue,
            time: JSON.stringify(new Date()),
        };
        store.addElement(historyElement);
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var storage_1 = __webpack_require__(13);
var detector = __webpack_require__(14);
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
        var currentHistory = this.getHistoryWithInternalTime();
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
        var history = this.getHistoryWithInternalTime();
        return this.stripInternalTime(history);
    };
    HistoryStore.prototype.getHistoryWithInternalTime = function () {
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
        var currentHistory = this.getHistoryWithInternalTime();
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
    HistoryStore.prototype.stripInternalTime = function (history) {
        if (history) {
            history.forEach(function (part, index, array) {
                delete part.internalTime;
            });
        }
        return history;
    };
    return HistoryStore;
}());
exports.HistoryStore = HistoryStore;
;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HistoryStore;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var detector = __webpack_require__(14);
var cookieutils_1 = __webpack_require__(31);
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
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var JitterTypes;
(function (JitterTypes) {
    JitterTypes["None"] = "none";
    JitterTypes["Full"] = "full";
})(JitterTypes = exports.JitterTypes || (exports.JitterTypes = {}));
var defaultOptions = {
    delayFirstAttempt: false,
    jitter: JitterTypes.None,
    maxDelay: Infinity,
    numOfAttempts: 10,
    retry: function () { return true; },
    startingDelay: 100,
    timeMultiple: 2
};
function getSanitizedOptions(options) {
    var sanitized = __assign(__assign({}, defaultOptions), options);
    if (sanitized.numOfAttempts < 1) {
        sanitized.numOfAttempts = 1;
    }
    return sanitized;
}
exports.getSanitizedOptions = getSanitizedOptions;
//# sourceMappingURL=options.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var jitter_factory_1 = __webpack_require__(43);
var Delay = /** @class */ (function () {
    function Delay(options) {
        this.options = options;
        this.attempt = 0;
    }
    Delay.prototype.apply = function () {
        var _this = this;
        return new Promise(function (resolve) { return setTimeout(resolve, _this.jitteredDelay); });
    };
    Delay.prototype.setAttemptNumber = function (attempt) {
        this.attempt = attempt;
    };
    Object.defineProperty(Delay.prototype, "jitteredDelay", {
        get: function () {
            var jitter = jitter_factory_1.JitterFactory(this.options);
            return jitter(this.delay);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Delay.prototype, "delay", {
        get: function () {
            var constant = this.options.startingDelay;
            var base = this.options.timeMultiple;
            var power = this.numOfDelayedAttempts;
            var delay = constant * Math.pow(base, power);
            return Math.min(delay, this.options.maxDelay);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Delay.prototype, "numOfDelayedAttempts", {
        get: function () {
            return this.attempt;
        },
        enumerable: true,
        configurable: true
    });
    return Delay;
}());
exports.Delay = Delay;
//# sourceMappingURL=delay.base.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(4);
var SectionBuilder = /** @class */ (function () {
    function SectionBuilder(section) {
        if (section === void 0) { section = Dom_1.$$('div'); }
        this.section = section;
    }
    SectionBuilder.prototype.withComponent = function (component, props, markupTag) {
        if (props === void 0) { props = {}; }
        if (markupTag === void 0) { markupTag = 'div'; }
        this.section.append(Dom_1.$$(markupTag, __assign({ className: component }, props)).el);
        return this;
    };
    SectionBuilder.prototype.withDomElement = function (dom) {
        this.section.append(dom.el);
        return this;
    };
    SectionBuilder.prototype.build = function () {
        return this.section;
    };
    return SectionBuilder;
}());
exports.SectionBuilder = SectionBuilder;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(19);


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Playground_1 = __webpack_require__(20);
document.addEventListener('DOMContentLoaded', function () {
    new Playground_1.Playground(document.body);
});


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(4);
var SearchEndpoint_1 = __webpack_require__(8);
var PlaygroundConfiguration_1 = __webpack_require__(48);
var QueryEvents_1 = __webpack_require__(50);
var DefaultLanguage_1 = __webpack_require__(51);
DefaultLanguage_1.setLanguageAfterPageLoaded();
var Playground = /** @class */ (function () {
    function Playground(body) {
        this.body = body;
        this.initialized = false;
        var previewContainer = Dom_1.$$(document.body).find('.preview-container');
        if (this.isComponentPage() && this.shouldInitialize()) {
            this.initializePreview();
        }
        else {
            previewContainer && previewContainer.remove();
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
        return (Dom_1.$$(this.getTitle())
            .text()
            .toLowerCase()
            .indexOf('component') != -1);
    };
    Playground.prototype.getComponentName = function () {
        var match = Dom_1.$$(this.getTitle())
            .text()
            .match(/\(Coveo([a-zA-Z]+)\)$/);
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
            className: 'CoveoSearchInterface'
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
            var messageAboutBasic = configuration.basicExpression
                ? "the basic query expression is \"<span class='preview-info-emphasis'>" + configuration.basicExpression + "\"</span>"
                : '';
            var messageAboutAdvanced = configuration.advancedExpression
                ? "the advanced query expression is \"<span class='preview-info-emphasis'>" + configuration.advancedExpression + "\"</span>"
                : '';
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(1);
var TimeSpanUtils_1 = __webpack_require__(9);
var DeviceUtils_1 = __webpack_require__(22);
var Utils_1 = __webpack_require__(2);
var JQueryutils_1 = __webpack_require__(7);
var _ = __webpack_require__(0);
var UrlUtils_1 = __webpack_require__(10);
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
var EndpointCaller = /** @class */ (function () {
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
    EndpointCaller.convertJsonToQueryString = function (json) {
        Assert_1.Assert.exists(json);
        return _.chain(json)
            .map(function (value, key) {
            if (value != null) {
                var stringValue = _.isObject(value) ? JSON.stringify(value) : value.toString();
                return key + "=" + Utils_1.Utils.safeEncodeURIComponent(stringValue);
            }
            return null;
        })
            .compact()
            .value();
    };
    EndpointCaller.convertJsonToFormBody = function (json) {
        return this.convertJsonToQueryString(json).join('&');
    };
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
            requestDataType: params.requestDataType || 'application/x-www-form-urlencoded; charset=UTF-8',
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
        var isLocalHost = window.location.hostname === urlObject.hostname || urlObject.hostname === '';
        var currentPort = window.location.port != '' ? window.location.port : window.location.protocol == 'https:' ? '443' : '80';
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
                        xmlHttpRequest.send(EndpointCaller.convertJsonToFormBody(requestInfo.requestData));
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
                    var status_1 = xmlHttpRequest.status;
                    if (_this.isSuccessHttpStatus(status_1)) {
                        xmlHttpRequest.responseType = responseType;
                    }
                    else {
                        xmlHttpRequest.responseType = 'text';
                    }
                }
                else if (xmlHttpRequest.readyState == XMLHttpRequestStatus.DONE) {
                    var status_2 = xmlHttpRequest.status;
                    var data = void 0;
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
                    if (_this.isSuccessHttpStatus(status_2)) {
                        _this.handleSuccessfulResponseThatMightBeAnError(requestInfo, data, resolve, reject);
                    }
                    else {
                        _this.handleError(requestInfo, xmlHttpRequest.status, data, reject);
                    }
                }
            };
            var queryString = requestInfo.queryString;
            if (requestInfo.method == 'GET') {
                queryString = queryString.concat(EndpointCaller.convertJsonToQueryString(requestInfo.requestData));
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
                queryString.push('access_token=' + Utils_1.Utils.safeEncodeURIComponent(_this.options.accessToken));
            }
            var xDomainRequest = new XDomainRequest();
            if (requestInfo.method == 'GET') {
                queryString = queryString.concat(EndpointCaller.convertJsonToQueryString(requestInfo.requestData));
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
                    xDomainRequest.send(EndpointCaller.convertJsonToFormBody(requestInfo.requestData));
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
            var queryString = requestInfo.queryString.concat(EndpointCaller.convertJsonToQueryString(requestInfo.requestData));
            // JSONP don't support including stuff in the header, so we must
            // put the access token in the query string if we have one.
            if (_this.options.accessToken) {
                queryString.push('access_token=' + Utils_1.Utils.safeEncodeURIComponent(_this.options.accessToken));
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
        return UrlUtils_1.UrlUtils.normalizeAsString({
            paths: [url],
            queryAsString: queryString
        });
    };
    EndpointCaller.prototype.isXDomainRequestSupported = function () {
        return 'XDomainRequest' in window;
    };
    EndpointCaller.prototype.isCORSSupported = function () {
        return 'withCredentials' in this.getXmlHttpRequest();
    };
    EndpointCaller.prototype.isSuccessHttpStatus = function (status) {
        return (status >= 200 && status < 300) || status === 304;
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
            headers['Content-Type'] = 'application/json; charset=UTF-8';
        }
        else {
            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        }
        return headers;
    };
    EndpointCaller.JSONP_ERROR_TIMEOUT = 10000;
    return EndpointCaller;
}());
exports.EndpointCaller = EndpointCaller;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Not sure about this : In year 2033 who's to say that this list won't be 50 pages long !
var ResponsiveComponents_1 = __webpack_require__(23);
var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var DeviceUtils = /** @class */ (function () {
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
var Assert_1 = __webpack_require__(1);
__webpack_require__(24);
exports.MEDIUM_SCREEN_WIDTH = 800;
exports.SMALL_SCREEN_WIDTH = 480;
/**
 * This class serves as a way to get and set the different screen size breakpoints for the interface.
 *
 * By setting those, you can impact, amongst others, the {@link Facet}'s, {@link Tab}'s or the {@link ResultList}'s behaviour.
 *
 * For example, the {@link Facet} components of your interface will switch to a dropdown menu when the screen size reaches 800px or less.
 *
 * You could modify this value using `this` calls
 *
 * Normally, you would interact with this class using the instance bound to {@link SearchInterface.responsiveComponents}
 */
var ResponsiveComponents = /** @class */ (function () {
    function ResponsiveComponents(windoh) {
        if (windoh === void 0) { windoh = window; }
        this.windoh = windoh;
        this.responsiveMode = 'auto';
    }
    /**
     * Set the breakpoint for small screen size.
     * @param width
     */
    ResponsiveComponents.prototype.setSmallScreenWidth = function (width) {
        Assert_1.Assert.check(this.responsiveMode === 'auto', "Cannot modify medium screen width if responsiveMode is locked on " + this.responsiveMode + ".");
        Assert_1.Assert.check(width < this.getMediumScreenWidth(), "Cannot set small screen width (" + width + ") larger or equal to the current medium screen width (" + this.getMediumScreenWidth() + ")");
        this.smallScreenWidth = width;
    };
    /**
     * Set the breakpoint for medium screen size
     * @param width
     */
    ResponsiveComponents.prototype.setMediumScreenWidth = function (width) {
        Assert_1.Assert.check(this.responsiveMode === 'auto', "Cannot modify medium screen width if responsiveMode is locked on " + this.responsiveMode + ".");
        Assert_1.Assert.check(width > this.getSmallScreenWidth(), "Cannot set medium screen width (" + width + ") smaller or equal to the current small screen width (" + this.getSmallScreenWidth() + ")");
        this.mediumScreenWidth = width;
    };
    ResponsiveComponents.prototype.setResponsiveMode = function (responsiveMode) {
        this.responsiveMode = responsiveMode;
    };
    /**
     * Get the current breakpoint for small screen size.
     *
     * If it was not explicitly set by {@link ResponsiveComponents.setSmallScreenWidth}, the default value is `480`.
     * @returns {number}
     */
    ResponsiveComponents.prototype.getSmallScreenWidth = function () {
        if (this.responsiveMode === 'small') {
            return Number.POSITIVE_INFINITY;
        }
        if (this.responsiveMode !== 'auto') {
            return 0;
        }
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
        if (this.responsiveMode === 'medium') {
            return Number.POSITIVE_INFINITY;
        }
        if (this.responsiveMode !== 'auto') {
            return 0;
        }
        if (this.mediumScreenWidth == null) {
            return exports.MEDIUM_SCREEN_WIDTH;
        }
        return this.mediumScreenWidth;
    };
    /** Return the current responsive mode.
     * @returns {ValidResponsiveMode}
     */
    ResponsiveComponents.prototype.getResponsiveMode = function () {
        return this.responsiveMode;
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
/* 24 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.version = {
    lib: '2.9856.1-beta',
    product: '2.9856.1-beta',
    supportedApiVersion: 2
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(1);
var AjaxError = /** @class */ (function () {
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MissingAuthenticationError = /** @class */ (function () {
    function MissingAuthenticationError(provider) {
        this.provider = provider;
        this.isMissingAuthentication = true;
        this.name = this.type = this.message = "Missing Authentication (provider: " + provider + ")";
    }
    return MissingAuthenticationError;
}());
exports.MissingAuthenticationError = MissingAuthenticationError;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var QueryUtils = /** @class */ (function () {
    function QueryUtils() {
    }
    QueryUtils.createGuid = function () {
        var guid;
        var success = false;
        if (typeof crypto != 'undefined' && typeof crypto.getRandomValues != 'undefined') {
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
            var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
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
        return S4(buf[0]) + S4(buf[1]) + '-' + S4(buf[2]) + '-' + S4(buf[3]) + '-' + S4(buf[4]) + '-' + S4(buf[5]) + S4(buf[6]) + S4(buf[7]);
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
        return result.raw['collection'] || 'default';
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
        return QueryUtils.isAtomicString(str) || (QueryUtils.isRangeString(str) || QueryUtils.isRangeWithoutOuterBoundsString(str))
            ? str
            : QueryUtils.quoteAndEscape(str);
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(1);
var QueryError = /** @class */ (function () {
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var analytics = __webpack_require__(11);
exports.analytics = analytics;
var SimpleAnalytics = __webpack_require__(33);
exports.SimpleAnalytics = SimpleAnalytics;
var history = __webpack_require__(12);
exports.history = history;
var donottrack = __webpack_require__(36);
exports.donottrack = donottrack;
var storage = __webpack_require__(13);
exports.storage = storage;


/***/ }),
/* 31 */
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
/* 32 */
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
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
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
    this.status = options.status === undefined ? 200 : options.status
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
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var analytics = __webpack_require__(11);
var objectassign_1 = __webpack_require__(34);
var utils_1 = __webpack_require__(35);
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
                    anonymous: utils_1.popFromObject(customData, 'anonymous'),
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
/* 34 */
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
/* 35 */
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.doNotTrack = [true, 'yes', '1'].indexOf(navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.doNotTrack;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Code originally taken from : https://developers.livechatinc.com/blog/setting-cookies-to-subdomains-in-javascript/
var Cookie = /** @class */ (function () {
    function Cookie() {
    }
    Cookie.set = function (name, value, expiration) {
        var host = location.hostname;
        if (host.split('.').length === 1) {
            // no '.' in a domain - it's localhost or something similar
            document.cookie = this.buildCookie(name, value, expiration);
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
            var domainParts = host.split('.');
            domainParts.shift();
            var domain = '.' + domainParts.join('.');
            document.cookie = this.buildCookie(name, value, expiration, domain);
            // check if cookie was successfuly set to the given domain
            // (otherwise it was a Top-Level Domain)
            if (Cookie.get(name) == null || Cookie.get(name) != value) {
                // append '.' to current domain
                domain = '.' + host;
                document.cookie = this.buildCookie(name, value, expiration, domain);
            }
        }
    };
    Cookie.buildCookie = function (name, value, expiration, domain) {
        var expires = expiration ? this.buildExpiresValue(expiration) : '';
        var domainCookie = domain ? "; domain=" + domain : '';
        return "" + this.prefix + name + "=" + value + expires + domainCookie + "; SameSite=Lax; path=/";
    };
    Cookie.buildExpiresValue = function (expiration) {
        return "; expires=" + new Date(Date.now() + expiration).toUTCString();
    };
    Cookie.get = function (name) {
        var nameEQ = "" + this.prefix + name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
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
    Cookie.prefix = 'coveo_';
    return Cookie;
}());
exports.Cookie = Cookie;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(3);
var underscore_1 = __webpack_require__(0);
var ACCESS_TOKEN_ERRORS;
(function (ACCESS_TOKEN_ERRORS) {
    ACCESS_TOKEN_ERRORS["NO_RENEW_FUNCTION"] = "NO_RENEW_FUNCTION";
    ACCESS_TOKEN_ERRORS["REPEATED_FAILURES"] = "REPEATED_FAILURES";
})(ACCESS_TOKEN_ERRORS = exports.ACCESS_TOKEN_ERRORS || (exports.ACCESS_TOKEN_ERRORS = {}));
var AccessToken = /** @class */ (function () {
    function AccessToken(token, renew) {
        var _this = this;
        this.token = token;
        this.renew = renew;
        this.subscribers = [];
        this.logger = new Logger_1.Logger(this);
        this.triedRenewals = 0;
        this.resetRenewalTriesAfterDelay = underscore_1.debounce(function () {
            _this.triedRenewals = 0;
        }, 500, false);
    }
    AccessToken.prototype.doRenew = function (onError) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.triedRenewals++;
                        this.resetRenewalTriesAfterDelay();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        this.verifyRenewSetup();
                        this.logger.info('Renewing expired access token');
                        _a = this;
                        return [4 /*yield*/, this.renew()];
                    case 2:
                        _a.token = _b.sent();
                        this.logger.info('Access token renewed', this.token);
                        this.subscribers.forEach(function (subscriber) { return subscriber(_this.token); });
                        return [2 /*return*/, true];
                    case 3:
                        err_1 = _b.sent();
                        switch (err_1.message) {
                            case ACCESS_TOKEN_ERRORS.REPEATED_FAILURES:
                                this.logger.error('AccessToken tried to renew itself extremely fast in a short period of time');
                                this.logger.error('There is most probably an authentication error, or a bad implementation of the custom renew function');
                                this.logger.error('Inspect the developer console of your browser to find out the root cause');
                                break;
                            case ACCESS_TOKEN_ERRORS.NO_RENEW_FUNCTION:
                                this.logger.error("AccessToken tried to renew, but no function is configured on initialization to provide acess token renewal");
                                this.logger.error('The option name is renewAccessToken on the SearchEndpoint class');
                                break;
                        }
                        this.logger.error('Failed to renew access token', err_1);
                        if (onError) {
                            onError(err_1);
                        }
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AccessToken.prototype.subscribeToRenewal = function (onTokenRefreshed) {
        this.subscribers.push(onTokenRefreshed);
    };
    AccessToken.prototype.verifyRenewSetup = function () {
        if (this.renew == null) {
            throw new Error(ACCESS_TOKEN_ERRORS.NO_RENEW_FUNCTION);
        }
        if (this.triedRenewals >= 5) {
            throw new Error(ACCESS_TOKEN_ERRORS.REPEATED_FAILURES);
        }
    };
    return AccessToken;
}());
exports.AccessToken = AccessToken;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var exponential_backoff_1 = __webpack_require__(40);
var backOff = exponential_backoff_1.backOff;
function setBackOffModule(newModule) {
    backOff = newModule || exponential_backoff_1.backOff;
}
exports.setBackOffModule = setBackOffModule;
var BackOffRequest = /** @class */ (function () {
    function BackOffRequest() {
    }
    BackOffRequest.enqueue = function (request) {
        return new Promise(function (resolve, reject) {
            BackOffRequest.enqueueRequest(request, resolve, reject);
            BackOffRequest.clearQueueIfNotAlready();
        });
    };
    BackOffRequest.enqueueRequest = function (request, resolve, reject) {
        var req = function () {
            return backOff(request.fn, request.options)
                .then(resolve)
                .catch(reject);
        };
        BackOffRequest.queue.push(req);
    };
    BackOffRequest.clearQueueIfNotAlready = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (BackOffRequest.clearingQueue) {
                            return [2 /*return*/];
                        }
                        BackOffRequest.clearingQueue = true;
                        _a.label = 1;
                    case 1:
                        if (!BackOffRequest.queue.length) return [3 /*break*/, 3];
                        request = BackOffRequest.queue.shift();
                        return [4 /*yield*/, request()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        BackOffRequest.clearingQueue = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    BackOffRequest.queue = [];
    BackOffRequest.clearingQueue = false;
    return BackOffRequest;
}());
exports.BackOffRequest = BackOffRequest;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __webpack_require__(15);
var delay_factory_1 = __webpack_require__(41);
function backOff(request, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var sanitizedOptions, backOff;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sanitizedOptions = options_1.getSanitizedOptions(options);
                    backOff = new BackOff(request, sanitizedOptions);
                    return [4 /*yield*/, backOff.execute()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.backOff = backOff;
var BackOff = /** @class */ (function () {
    function BackOff(request, options) {
        this.request = request;
        this.options = options;
        this.attemptNumber = 0;
    }
    BackOff.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, shouldRetry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.attemptLimitReached) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.applyDelay()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.request()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        e_1 = _a.sent();
                        this.attemptNumber++;
                        shouldRetry = this.options.retry(e_1, this.attemptNumber);
                        if (!shouldRetry || this.attemptLimitReached) {
                            throw e_1;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 0];
                    case 6: throw new Error("Something went wrong.");
                }
            });
        });
    };
    Object.defineProperty(BackOff.prototype, "attemptLimitReached", {
        get: function () {
            return this.attemptNumber >= this.options.numOfAttempts;
        },
        enumerable: true,
        configurable: true
    });
    BackOff.prototype.applyDelay = function () {
        return __awaiter(this, void 0, void 0, function () {
            var delay;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delay = delay_factory_1.DelayFactory(this.options, this.attemptNumber);
                        return [4 /*yield*/, delay.apply()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return BackOff;
}());
//# sourceMappingURL=backoff.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var skip_first_delay_1 = __webpack_require__(42);
var always_delay_1 = __webpack_require__(46);
function DelayFactory(options, attempt) {
    var delay = initDelayClass(options);
    delay.setAttemptNumber(attempt);
    return delay;
}
exports.DelayFactory = DelayFactory;
function initDelayClass(options) {
    if (!options.delayFirstAttempt) {
        return new skip_first_delay_1.SkipFirstDelay(options);
    }
    return new always_delay_1.AlwaysDelay(options);
}
//# sourceMappingURL=delay.factory.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var delay_base_1 = __webpack_require__(16);
var SkipFirstDelay = /** @class */ (function (_super) {
    __extends(SkipFirstDelay, _super);
    function SkipFirstDelay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SkipFirstDelay.prototype.apply = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.isFirstAttempt ? true : _super.prototype.apply.call(this)];
            });
        });
    };
    Object.defineProperty(SkipFirstDelay.prototype, "isFirstAttempt", {
        get: function () {
            return this.attempt === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkipFirstDelay.prototype, "numOfDelayedAttempts", {
        get: function () {
            return this.attempt - 1;
        },
        enumerable: true,
        configurable: true
    });
    return SkipFirstDelay;
}(delay_base_1.Delay));
exports.SkipFirstDelay = SkipFirstDelay;
//# sourceMappingURL=skip-first.delay.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __webpack_require__(15);
var full_jitter_1 = __webpack_require__(44);
var no_jitter_1 = __webpack_require__(45);
function JitterFactory(options) {
    switch (options.jitter) {
        case options_1.JitterTypes.Full:
            return full_jitter_1.fullJitter;
        case options_1.JitterTypes.None:
        default:
            return no_jitter_1.noJitter;
    }
}
exports.JitterFactory = JitterFactory;
//# sourceMappingURL=jitter.factory.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function fullJitter(delay) {
    var jitteredDelay = Math.random() * delay;
    return Math.round(jitteredDelay);
}
exports.fullJitter = fullJitter;
//# sourceMappingURL=full.jitter.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function noJitter(delay) {
    return delay;
}
exports.noJitter = noJitter;
//# sourceMappingURL=no.jitter.js.map

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var delay_base_1 = __webpack_require__(16);
var AlwaysDelay = /** @class */ (function (_super) {
    __extends(AlwaysDelay, _super);
    function AlwaysDelay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AlwaysDelay;
}(delay_base_1.Delay));
exports.AlwaysDelay = AlwaysDelay;
//# sourceMappingURL=always.delay.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The plan of execution of a search request.
 */
var ExecutionPlan = /** @class */ (function () {
    function ExecutionPlan(response) {
        this.response = response;
    }
    Object.defineProperty(ExecutionPlan.prototype, "basicExpression", {
        /**
         * Gets the final value of the basic expression (`q`) after the search request has been processed in the query pipeline, but before it is sent to the index.
         */
        get: function () {
            return this.response.parsedInput.basicExpression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExecutionPlan.prototype, "largeExpression", {
        /**
         * Gets the final value of the large expression (`lq`) after the search request has been processed in the query pipeline, but before it is sent to the index.
         */
        get: function () {
            return this.response.parsedInput.largeExpression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExecutionPlan.prototype, "redirectionURL", {
        /**
         * Gets the URL to redirect the browser to, if the search request satisfies the condition of a `redirect` trigger rule in the query pipeline.
         *
         * Returns `null` otherwise.
         */
        get: function () {
            var redirects = this.response.preprocessingOutput.triggers.filter(function (trigger) { return trigger.type === 'redirect'; });
            return redirects.length ? redirects[0].content : null;
        },
        enumerable: true,
        configurable: true
    });
    return ExecutionPlan;
}());
exports.ExecutionPlan = ExecutionPlan;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(4);
var SearchEndpoint_1 = __webpack_require__(8);
var SearchSectionBuilder_1 = __webpack_require__(49);
var SectionBuilder_1 = __webpack_require__(17);
var getComponentContainerElement = function () {
    return Dom_1.$$(document.body).find('.component-container');
};
var getSearchInterfaceElement = function () {
    return Dom_1.$$(getComponentContainerElement()).find('.CoveoSearchInterface');
};
var getSearchInterfaceInstance = function () {
    return Coveo.get(getSearchInterfaceElement(), Coveo.SearchInterface);
};
var setMinHeightOnSearchInterface = function (minHeight) {
    getSearchInterfaceElement().style.minHeight = minHeight;
};
exports.PlaygroundConfiguration = {
    SearchInterface: {
        show: false,
        options: {
            autoTriggerQuery: false
        }
    },
    AdvancedSearch: {
        show: true,
        element: new SearchSectionBuilder_1.SearchSectionBuilder().withComponent('CoveoAdvancedSearch').build(),
        toExecute: function () {
            setMinHeightOnSearchInterface('300px');
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
        element: new SectionBuilder_1.SectionBuilder()
            .withComponent('CoveoBreadcrumb')
            .withDomElement(Dom_1.$$('p', {}, 'Interact with the facet to modify the breadcrumb'))
            .withComponent('CoveoFacet', {
            'data-field': '@objecttype',
            'data-title': 'Type'
        })
            .build()
    },
    DidYouMean: {
        show: true,
        basicExpression: 'testt',
        element: new SearchSectionBuilder_1.SearchSectionBuilder().withComponent('CoveoDidYouMean').build()
    },
    DynamicHierarchicalFacet: {
        show: true,
        options: {
            field: '@atlgeographicalhierarchy',
            title: 'Geographic position'
        }
    },
    DynamicFacet: {
        show: true,
        options: {
            field: '@author',
            title: 'Author'
        }
    },
    ErrorReport: {
        show: true,
        toExecute: function () {
            getSearchInterfaceInstance().queryController.setEndpoint(new SearchEndpoint_1.SearchEndpoint({
                restUri: 'https://platform.cloud.coveo.com/rest/search',
                accessToken: 'invalid'
            }));
        }
    },
    Excerpt: {
        show: true,
        isResultComponent: true,
        basicExpression: 'technology'
    },
    ExportToExcel: {
        show: true,
        element: new SearchSectionBuilder_1.SearchSectionBuilder().withComponent('CoveoExportToExcel').build(),
        toExecute: function () {
            setMinHeightOnSearchInterface('300px');
        }
    },
    Facet: {
        show: true,
        options: {
            field: '@objecttype',
            title: 'Type'
        }
    },
    FacetRange: {
        show: true,
        options: {
            field: '@size',
            title: 'Documents size',
            ranges: [
                {
                    start: 0,
                    end: 100,
                    label: '0 - 100 KB',
                    endInclusive: false
                },
                {
                    start: 100,
                    end: 200,
                    label: '100 - 200 KB',
                    endInclusive: false
                },
                {
                    start: 200,
                    end: 300,
                    label: '200 - 300 KB',
                    endInclusive: false
                },
                {
                    start: 300,
                    end: 400,
                    label: '300 - 400 KB',
                    endInclusive: false
                }
            ],
            sortCriteria: 'alphaascending'
        }
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
    FacetValueSuggestions: {
        options: {
            field: '@filetype',
            useQuerySuggestions: false
        },
        show: true,
        element: new SearchSectionBuilder_1.SearchSectionBuilder()
            .withDomElement(Dom_1.$$('div', { className: 'preview-info' }, "Showing scoped query suggestions based on <span class='preview-info-emphasis'>@filetype</span> field values"))
            .withComponent('CoveoFacetValueSuggestions')
            .withoutQuerySuggest()
            .build(),
        toExecute: function () {
            setMinHeightOnSearchInterface('500px');
        }
    },
    FieldSuggestions: {
        options: {
            field: '@author',
            headerTitle: 'Authors'
        },
        show: true,
        element: new SearchSectionBuilder_1.SearchSectionBuilder()
            .withDomElement(Dom_1.$$('div', { className: 'preview-info' }, "Showing suggestions on the field <span class='preview-info-emphasis'>@author</span>"))
            .withComponent('CoveoFieldSuggestions')
            .withoutQuerySuggest()
            .build(),
        toExecute: function () {
            setMinHeightOnSearchInterface('500px');
        }
    },
    FieldTable: {
        show: true,
        options: {
            minimizedByDefault: false
        },
        isResultComponent: true,
        advancedExpression: '@connectortype==DropboxCrawler AND @objecttype==File',
        element: new SectionBuilder_1.SectionBuilder()
            .withDomElement(Dom_1.$$('table', { className: 'CoveoFieldTable' }, "<tbody>\n            <tr data-field=\"@size\" data-caption=\"Document size\" data-helper=\"size\"></tr>\n            <tr data-field=\"@source\" data-caption=\"Source\"></tr>\n            <tr data-field=\"@date\" data-caption=\"Date\" date-helper=\"dateTime\"></tr>\n          </tbody>"))
            .build()
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
    HiddenQuery: {
        show: true,
        options: {
            title: 'This is the filter title'
        },
        toExecute: function () {
            var searchInterface = getSearchInterfaceElement();
            Coveo.$$(searchInterface).on('afterInitialization', function () {
                Coveo.state(searchInterface, 'hd', 'This is the filter description');
                Coveo.state(searchInterface, 'hq', '@uri');
            });
        },
        element: new SectionBuilder_1.SectionBuilder()
            .withComponent('CoveoBreadcrumb')
            .withComponent('CoveoHiddenQuery')
            .build()
    },
    HierarchicalFacet: {
        show: true,
        options: {
            field: '@hierarchicfield',
            title: 'Hierarchical Facet with random values'
        },
        toExecute: function () {
            // `@hierarchicfield` does not exist in the sample Coveo Cloud V2 organization.
            Dom_1.$$(getSearchInterfaceElement()).on('newQuery', function (e, args) {
                SearchEndpoint_1.SearchEndpoint.configureSampleEndpoint();
                Coveo.get(Dom_1.$$(getSearchInterfaceElement()).find('.CoveoHierarchicalFacet')).queryController.setEndpoint(SearchEndpoint_1.SearchEndpoint.endpoints['default']);
            });
        },
        advancedExpression: '@hierarchicfield'
    },
    Icon: {
        show: true,
        isResultComponent: true,
        basicExpression: 'getting started pdf'
    },
    Logo: {
        show: true,
        toExecute: function () {
            getSearchInterfaceElement().style.padding = '20px';
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
        element: new SectionBuilder_1.SectionBuilder().withComponent('CoveoMatrix').build()
    },
    MissingTerms: {
        show: true,
        toExecute: function () {
            var searchInterface = getSearchInterfaceElement();
            Coveo.$$(searchInterface).on('afterInitialization', function () {
                Coveo.state(searchInterface, 'q', 'getting started klingon language');
            });
        },
        element: new SectionBuilder_1.SectionBuilder().withComponent('CoveoMissingTerms').build(),
        isResultComponent: true,
        basicExpression: 'getting started klingon language'
    },
    Omnibox: {
        show: true,
        options: {
            enableQuerySuggestAddon: true,
            inline: true
        }
    },
    OmniboxResultList: {
        show: true,
        element: new SearchSectionBuilder_1.SearchSectionBuilder()
            .withDomElement(Dom_1.$$('div', {
            className: 'CoveoOmniboxResultList'
        }, Dom_1.$$('script', {
            className: 'result-template',
            type: 'text/underscore'
        }, "<div class=\"coveo-result-frame\">\n              <div class=\"coveo-result-cell\" style=\"vertical-align:top;text-align:center;width:32px;\">\n                <span class=\"CoveoIcon\" data-small=\"true\" data-with-label=\"false\"></span>\n              </div>\n              <div class=\"coveo-result-cell\" style=\"vertical-align: top;padding-left: 16px;\">\n                <div class=\"coveo-result-row\" style=\"margin-top:0;\">\n                  <div class=\"coveo-result-cell\" \">\n                    <a class=\"CoveoResultLink\" ></a>\n                  </div>\n                </div>\n              </div>\n            </div>")))
            .withoutQuerySuggest()
            .build(),
        options: {
            headerTitle: ''
        },
        toExecute: function () {
            setMinHeightOnSearchInterface('350px');
            getSearchInterfaceInstance().options.resultsPerPage = 5;
        }
    },
    Pager: {
        show: true,
        toExecute: function () {
            getSearchInterfaceElement().style.padding = '20px';
        }
    },
    PreferencesPanel: {
        show: true,
        element: new SearchSectionBuilder_1.SearchSectionBuilder()
            .withDomElement(Dom_1.$$('div', {
            className: 'CoveoPreferencesPanel'
        }, Dom_1.$$('div', { className: 'CoveoResultsPreferences' }), Dom_1.$$('div', { className: 'CoveoResultsFiltersPreferences' })))
            .build(),
        toExecute: function () {
            setMinHeightOnSearchInterface('300px');
        }
    },
    PrintableUri: {
        show: true,
        isResultComponent: true,
        advancedExpression: '@litopicid @filetype==lithiummessage'
    },
    PromotedResultsBadge: {
        show: true,
        element: new SearchSectionBuilder_1.SearchSectionBuilder()
            .withComponent('CoveoResultList', {
            'data-layout': 'list'
        })
            .withComponent('CoveoPromotedResultsBadge', {
            'data-show-badge-for-featured-results': true,
            'data-show-badge-for-recommended-results': true
        })
            .build()
    },
    Querybox: {
        show: true
    },
    QueryDuration: {
        show: true
    },
    QuerySummary: {
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
            getSearchInterfaceInstance().options.enableCollaborativeRating = true;
        }
    },
    ResultsFiltersPreferences: {
        show: true,
        element: new SearchSectionBuilder_1.SearchSectionBuilder()
            .withDomElement(Dom_1.$$('div', {
            className: 'CoveoPreferencesPanel'
        }, Dom_1.$$('div', { className: 'CoveoResultsFiltersPreferences' })))
            .build(),
        toExecute: function () {
            setMinHeightOnSearchInterface('300px');
        }
    },
    ResultsPerPage: {
        show: true,
        toExecute: function () {
            getSearchInterfaceElement().style.padding = '20px';
        }
    },
    ResultsPreferences: {
        element: new SearchSectionBuilder_1.SearchSectionBuilder()
            .withDomElement(Dom_1.$$('div', {
            className: 'CoveoPreferencesPanel'
        }, Dom_1.$$('div', { className: 'CoveoResultsPreferences' })))
            .build(),
        show: true,
        toExecute: function () {
            setMinHeightOnSearchInterface('300px');
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
    Settings: {
        show: true,
        element: new SearchSectionBuilder_1.SearchSectionBuilder()
            .withComponent('CoveoShareQuery')
            .withComponent('CoveoExportToExcel')
            .withComponent('CoveoAdvancedSearch')
            .build(),
        toExecute: function () {
            setMinHeightOnSearchInterface('300px');
        }
    },
    ShareQuery: {
        show: true,
        element: new SearchSectionBuilder_1.SearchSectionBuilder().withComponent('CoveoShareQuery').build(),
        toExecute: function () {
            setMinHeightOnSearchInterface('300px');
        }
    },
    SimpleFilter: {
        show: true,
        options: {
            field: '@filetype',
            title: 'File Type'
        },
        element: new SectionBuilder_1.SectionBuilder()
            .withComponent('CoveoSimpleFilter')
            .withComponent('CoveoResultList')
            .build()
    },
    Sort: {
        show: true,
        element: new SectionBuilder_1.SectionBuilder()
            .withDomElement(new SectionBuilder_1.SectionBuilder(Dom_1.$$('div', { className: 'coveo-sort-section' }))
            .withComponent('CoveoSort', {
            'data-sort-criteria': 'relevancy',
            'data-caption': 'relevancy'
        }, 'span')
            .withComponent('CoveoSort', {
            'data-sort-criteria': 'date descending,date ascending',
            'data-caption': 'Date'
        }, 'span')
            .build())
            .withComponent('CoveoResultList')
            .build(),
        toExecute: function () {
            getSearchInterfaceElement().style.padding = '20px';
            Dom_1.$$(getSearchInterfaceElement()).on('buildingQuery', function (e, args) {
                args.queryBuilder.numberOfResults = 3;
            });
        }
    },
    SortDropdown: {
        show: true,
        element: new SectionBuilder_1.SectionBuilder()
            .withDomElement(new SectionBuilder_1.SectionBuilder(Dom_1.$$('div', { className: 'coveo-sort-section' }))
            .withDomElement(Dom_1.$$('div', { className: 'CoveoSortDropdown' }, Dom_1.$$('span', {
            className: 'CoveoSort',
            'data-sort-criteria': 'relevancy',
            'data-caption': 'relevancy'
        }), Dom_1.$$('span', {
            className: 'CoveoSort',
            'data-sort-criteria': 'date descending',
            'data-caption': 'Newest'
        }), Dom_1.$$('span', {
            className: 'CoveoSort',
            'data-sort-criteria': 'date ascending',
            'data-caption': 'Oldest'
        })))
            .build())
            .withComponent('CoveoResultList')
            .build(),
        toExecute: function () {
            getSearchInterfaceElement().style.padding = '20px';
            Dom_1.$$(getSearchInterfaceElement()).on('buildingQuery', function (e, args) {
                args.queryBuilder.numberOfResults = 3;
            });
        }
    },
    StarRating: {
        show: true,
        options: {
            ratingField: '@sfaveragerating',
            numberOfRatingsField: '@sfnumberofreviews',
            ratingScale: '5'
        },
        isResultComponent: true,
        advancedExpression: '@objecttype=="ccrz__E_Product__c"'
    },
    Tab: {
        show: true,
        element: new SectionBuilder_1.SectionBuilder(Dom_1.$$('div', { className: 'coveo-tab-section' }))
            .withComponent('CoveoTab', {
            'data-caption': 'All content',
            'data-id': 'All'
        })
            .withComponent('CoveoTab', {
            'data-caption': 'YouTube videos',
            'data-id': 'YouTube'
        })
            .withComponent('CoveoTab', {
            'data-caption': 'Google Drive',
            'data-id': 'GoogleDrive'
        })
            .withComponent('CoveoTab', {
            'data-caption': 'Emails',
            'data-id': 'Emails'
        })
            .withComponent('CoveoTab', {
            'data-caption': 'Salesforce content',
            'data-id': 'Salesforce'
        })
            .build()
    },
    Thumbnail: {
        show: true,
        isResultComponent: true,
        advancedExpression: '@filetype=="youtubevideo"'
    },
    TimespanFacet: {
        show: true
    },
    YouTubeThumbnail: {
        show: true,
        isResultComponent: true,
        advancedExpression: '@filetype=="youtubevideo"'
    }
};


/***/ }),
/* 49 */
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
var Dom_1 = __webpack_require__(4);
var SectionBuilder_1 = __webpack_require__(17);
var SearchSectionBuilder = /** @class */ (function (_super) {
    __extends(SearchSectionBuilder, _super);
    function SearchSectionBuilder(sectionParameter) {
        if (sectionParameter === void 0) { sectionParameter = Dom_1.$$('div', {
            className: 'coveo-search-section'
        }); }
        var _this = _super.call(this) || this;
        _this.enableOmnibox = true;
        _this.enableQuerySuggest = true;
        _this.section = sectionParameter;
        _this.searchbox = Dom_1.$$('div', {
            className: 'CoveoSearchbox'
        });
        _this.settings = Dom_1.$$('div', {
            className: 'CoveoSettings'
        });
        _this.section.append(_this.settings.el);
        _this.section.append(_this.searchbox.el);
        return _this;
    }
    SearchSectionBuilder.prototype.withOmnibox = function () {
        this.enableOmnibox = true;
        return this;
    };
    SearchSectionBuilder.prototype.withoutOmnibox = function () {
        this.enableOmnibox = false;
        return this;
    };
    SearchSectionBuilder.prototype.withQuerySuggest = function () {
        this.enableQuerySuggest = true;
        return this;
    };
    SearchSectionBuilder.prototype.withoutQuerySuggest = function () {
        this.enableQuerySuggest = false;
        return this;
    };
    SearchSectionBuilder.prototype.build = function () {
        var built = _super.prototype.build.call(this);
        this.searchbox.setAttribute('data-enable-omnibox', this.enableOmnibox.toString());
        this.searchbox.setAttribute('data-enable-query-suggest-addon', this.enableQuerySuggest.toString());
        return built;
    };
    return SearchSectionBuilder;
}(SectionBuilder_1.SectionBuilder));
exports.SearchSectionBuilder = SearchSectionBuilder;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class is there to contains the different string definition for all the events related to query.
 *
 * Note that these events will only be triggered when the {@link QueryController.executeQuery} method is used, either directly or by using {@link executeQuery}
 */
var QueryEvents = /** @class */ (function () {
    function QueryEvents() {
    }
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
    return QueryEvents;
}());
exports.QueryEvents = QueryEvents;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Globalize = __webpack_require__(52);
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
    "box user": "User",
    "filetype_box user": "User",
    "html": "HTML File",
    "filetype_html": "HTML File",
    "wiki": "Wiki",
    "filetype_wiki": "Wiki",
    "webscraperwebpage": "Web Page",
    "filetype_webscraperwebpage": "Web Page",
    "image": "Image",
    "filetype_image": "Image",
    "folder": "Folder",
    "filetype_folder": "Folder",
    "txt": "Text",
    "filetype_txt": "Text",
    "zip": "Zip File",
    "filetype_zip": "Zip File",
    "olefile": "OLE file",
    "filetype_olefile": "OLE file",
    "gmailmessage": "Gmail Message",
    "filetype_gmailmessage": "Gmail Message",
    "pdf": "PDF File",
    "filetype_pdf": "PDF File",
    "swf": "Flash File",
    "filetype_swf": "Flash File",
    "xml": "XML File",
    "filetype_xml": "XML File",
    "vsd": "Visio",
    "filetype_vsd": "Visio",
    "svg": "SVG",
    "filetype_svg": "SVG",
    "svm": "Open Office",
    "filetype_svm": "Open Office",
    "rssitem": "RSS feed",
    "filetype_rssitem": "RSS feed",
    "doc": "Document",
    "filetype_doc": "Document",
    "docx": "Microsoft Word Document",
    "filetype_docx": "Microsoft Word Document",
    "xls": "Spreadsheet Document",
    "filetype_xls": "Spreadsheet Document",
    "ppt": "Presentation Document",
    "filetype_ppt": "Presentation Document",
    "video": "Video",
    "filetype_video": "Video",
    "youtube": "YouTube video",
    "filetype_youtube": "YouTube video",
    "saleforceitem": "Salesforce",
    "filetype_saleforceitem": "Salesforce",
    "dynamicscrmitem": "Dynamics CRM",
    "filetype_dynamicscrmitem": "Dynamics CRM",
    "salesforceitem": "Salesforce",
    "filetype_salesforceitem": "Salesforce",
    "odt": "Open Text Document",
    "filetype_odt": "Open Text Document",
    "box": "User",
    "filetype_box": "User",
    "jiraissue": "Jira Issue",
    "filetype_jiraissue": "Jira Issue",
    "cfpage": "Confluence Page",
    "filetype_cfpage": "Confluence Page",
    "cfcomment": "Confluence Comment",
    "filetype_cfcomment": "Confluence Comment",
    "cfspace": "Confluence Space",
    "filetype_cfspace": "Confluence Space",
    "cfblogentry": "Confluence Blog Entry",
    "filetype_cfblogentry": "Confluence Blog Entry",
    "confluencespace": "Confluence Space",
    "filetype_confluencespace": "Confluence Space",
    "exchangemessage": "Message",
    "filetype_exchangemessage": "Message",
    "exchangeappointment": "Appointment",
    "filetype_exchangeappointment": "Appointment",
    "exchangenote": "Note",
    "filetype_exchangenote": "Note",
    "exchangetask": "Task",
    "filetype_exchangetask": "Task",
    "exchangeperson": "Exchange User",
    "filetype_exchangeperson": "Exchange User",
    "activedirperson": "Active Directory User",
    "filetype_activedirperson": "Active Directory User",
    "exchangeactivity": "Activity",
    "filetype_exchangeactivity": "Activity",
    "exchangecalendarmessage": "Calendar Message",
    "filetype_exchangecalendarmessage": "Calendar Message",
    "exchangedocument": "Exchange Document",
    "filetype_exchangedocument": "Exchange Document",
    "exchangedsn": "DSN",
    "filetype_exchangedsn": "DSN",
    "exchangefreebusy": "Free/Busy",
    "filetype_exchangefreebusy": "Free/Busy",
    "exchangegroup": "Group",
    "filetype_exchangegroup": "Group",
    "exchangerssfeed": "RSS Feed",
    "filetype_exchangerssfeed": "RSS Feed",
    "exchangejunkmessage": "Junk Email",
    "filetype_exchangejunkmessage": "Junk Email",
    "exchangeofficecom": "Communications",
    "filetype_exchangeofficecom": "Communications",
    "lithiummessage": "Lithium Message",
    "filetype_lithiummessage": "Lithium Message",
    "lithiumthread": "Lithium Thread",
    "filetype_lithiumthread": "Lithium Thread",
    "lithiumboard": "Lithium Board",
    "filetype_lithiumboard": "Lithium Board",
    "lithiumcategory": "Lithium Category",
    "filetype_lithiumcategory": "Lithium Category",
    "lithiumcommunity": "Lithium Community",
    "filetype_lithiumcommunity": "Lithium Community",
    "people": "User",
    "objecttype_people": "User",
    "message": "Message",
    "objecttype_message": "Message",
    "feed": "RSS Feed",
    "objecttype_feed": "RSS Feed",
    "thread": "Thread",
    "objecttype_thread": "Thread",
    "file": "File",
    "objecttype_file": "File",
    "board": "Board",
    "objecttype_board": "Board",
    "category": "Category",
    "objecttype_category": "Category",
    "account": "Account",
    "objecttype_account": "Account",
    "annotation": "Note",
    "objecttype_annotation": "Note",
    "campaign": "Campaign",
    "objecttype_campaign": "Campaign",
    "case": "Case",
    "objecttype_case": "Case",
    "contact": "Contact",
    "objecttype_contact": "Contact",
    "contract": "Contract",
    "objecttype_contract": "Contract",
    "event": "Event",
    "objecttype_event": "Event",
    "email": "Email",
    "objecttype_email": "Email",
    "goal": "Goal",
    "objecttype_goal": "Goal",
    "incident": "Incident",
    "objecttype_incident": "Incident",
    "invoice": "Invoice",
    "objecttype_invoice": "Invoice",
    "lead": "Lead",
    "objecttype_lead": "Lead",
    "list": "List",
    "objecttype_list": "Marketing List",
    "solution": "Solution",
    "objecttype_solution": "Solution",
    "report": "Report",
    "objecttype_report": "Report",
    "task": "Task",
    "objecttype_task": "Task",
    "user": "User",
    "objecttype_user": "User",
    "attachment": "Attachment",
    "objecttype_attachment": "Attachment",
    "casecomment": "Case Comment",
    "objecttype_casecomment": "Case Comment",
    "opportunity": "Opportunity",
    "objecttype_opportunity": "Opportunity",
    "opportunityproduct": "Opportunity Product",
    "objecttype_opportunityproduct": "Opportunity Product",
    "feeditem": "Chatter",
    "objecttype_feeditem": "Chatter",
    "feedcomment": "Comment",
    "objecttype_feedcomment": "Comment",
    "note": "Note",
    "objecttype_note": "Note",
    "product": "Product",
    "objecttype_product": "Product",
    "partner": "Partner",
    "objecttype_partner": "Partner",
    "queueitem": "Queue Item",
    "objecttype_queueitem": "Queue Item",
    "quote": "Quote",
    "objecttype_quote": "Quote",
    "salesliterature": "Sales Literature",
    "objecttype_salesliterature": "Sales Literature",
    "salesorder": "Sales Order",
    "objecttype_salesorder": "Sales Order",
    "service": "Service",
    "objecttype_service": "Service",
    "socialprofile": "Social Profile",
    "objecttype_socialprofile": "Social Profile",
    "kbdocumentation": "Knowledge Document",
    "objecttype_kbdocumentation": "Knowledge Document",
    "kbtechnicalarticle": "Technical Documentation",
    "objecttype_kbtechnicalarticle": "Technical Documentation",
    "kbsolution": "Solution",
    "objecttype_kbsolution": "Solution",
    "kbknowledgearticle": "Knowledge Article",
    "objecttype_kbknowledgearticle": "Knowledge Article",
    "kbattachment": "Attachment",
    "objecttype_kbattachment": "Attachment",
    "kbarticle": "Article",
    "objecttype_kbarticle": "Article",
    "kbarticlecomment": "Article Comment",
    "objecttype_kbarticlecomment": "Article Comment",
    "knowledgearticle": "Knowledge Article",
    "objecttype_knowledgearticle": "Knowledge Article",
    "topic": "Topic",
    "objecttype_topic": "Topic",
    "dashboard": "Dashboard",
    "objecttype_dashboard": "Dashboard",
    "contentversion": "Document",
    "objecttype_contentversion": "Document",
    "collaborationgroup": "Collaboration group",
    "objecttype_collaborationgroup": "Collaboration group",
    "phonecall": "Phone call",
    "objecttype_phonecall": "Phone call",
    "appointment": "Appointment",
    "objecttype_appointment": "Appointment",
    "sn_hr_core_case": "HR Case",
    "filetype_sn_hr_core_case": "HR Case",
    "sc_cat_item": "Catalog Item",
    "filetype_sc_cat_item": "Catalog Item",
    "sn_customerservice_case": "Case",
    "filetype_sn_customerservice_case": "Case",
    "kb_social_qa_answer": "Answer",
    "filetype_kb_social_qa_answer": "Answer",
    "kb_social_qa_question": "Question",
    "filetype_kb_social_qa_question": "Question",
    "kb_social_qa_comment": "Comment",
    "filetype_kb_social_qa_comment": "Comment",
    "filetype_incident": "Incident",
    "kb_knowledge": "Knowledge Article",
    "filetype_kb_knowledge": "Knowledge Article",
    "spportal": "Portal",
    "filetype_spportal": "Portal",
    "spsite": "SharePoint Site",
    "filetype_spsite": "SharePoint Site",
    "spuserprofile": "SharePoint User",
    "filetype_spuserprofile": "SharePoint User",
    "sparea": "Area",
    "filetype_sparea": "Area",
    "spannouncement": "Announcement",
    "filetype_spannouncement": "Announcement",
    "spannouncementlist": "Announcements",
    "filetype_spannouncementlist": "Announcements",
    "spcontact": "Contact",
    "filetype_spcontact": "Contact",
    "spcontactlist": "Contacts",
    "filetype_spcontactlist": "Contacts",
    "spcustomlist": "Custom Lists",
    "filetype_spcustomlist": "Custom Lists",
    "spdiscussionboard": "Discussion Board",
    "filetype_spdiscussionboard": "Discussion Board",
    "spdiscussionboardlist": "Discussion Boards",
    "filetype_spdiscussionboardlist": "Discussion Boards",
    "spdocumentlibrarylist": "Document Library",
    "filetype_spdocumentlibrarylist": "Document Library",
    "spevent": "Event",
    "filetype_spevent": "Event",
    "speventlist": "Events",
    "filetype_speventlist": "Events",
    "spformlibrarylist": "Form Library",
    "filetype_spformlibrarylist": "Form Library",
    "spissue": "Issue",
    "filetype_spissue": "Issue",
    "spissuelist": "Issues",
    "filetype_spissuelist": "Issues",
    "splink": "Link",
    "filetype_splink": "Link",
    "splinklist": "Links",
    "filetype_splinklist": "Links",
    "sppicturelibrarylist": "Picture Library",
    "filetype_sppicturelibrarylist": "Picture Library",
    "spsurvey": "Survey",
    "filetype_spsurvey": "Survey",
    "spsurveylist": "Surveys",
    "filetype_spsurveylist": "Surveys",
    "sptask": "Task",
    "filetype_sptask": "Task",
    "sptasklist": "Tasks",
    "filetype_sptasklist": "Tasks",
    "spagenda": "Agenda",
    "filetype_spagenda": "Agenda",
    "spagendalist": "Agendas",
    "filetype_spagendalist": "Agendas",
    "spattendee": "Attendee",
    "filetype_spattendee": "Attendee",
    "spattendeelist": "Attendees",
    "filetype_spattendeelist": "Attendees",
    "spcustomgridlist": "Custom Grids",
    "filetype_spcustomgridlist": "Custom Grids",
    "spdecision": "Decision",
    "filetype_spdecision": "Decision",
    "spdecisionlist": "Decisions",
    "filetype_spdecisionlist": "Decisions",
    "spobjective": "Objective",
    "filetype_spobjective": "Objective",
    "spobjectivelist": "Objectives",
    "filetype_spobjectivelist": "Objectives",
    "sptextbox": "Textbox",
    "filetype_sptextbox": "Textbox",
    "sptextboxlist": "Textbox list",
    "filetype_sptextboxlist": "Textbox list",
    "spthingstobring": "Thing To Bring",
    "filetype_spthingstobring": "Thing To Bring",
    "spthingstobringlist": "Things To Bring",
    "filetype_spthingstobringlist": "Things To Bring",
    "sparealisting": "Area Listing",
    "filetype_sparealisting": "Area Listing",
    "spmeetingserie": "Meeting series",
    "filetype_spmeetingserie": "Meeting series",
    "spmeetingserielist": "Meeting Series List",
    "filetype_spmeetingserielist": "Meeting Series List",
    "spsitedirectory": "Site Directory Item",
    "filetype_spsitedirectory": "Site Directory Item",
    "spsitedirectorylist": "Site Directory",
    "filetype_spsitedirectorylist": "Site Directory",
    "spdatasource": "Data Source",
    "filetype_spdatasource": "Data Source",
    "spdatasourcelist": "Data Source List",
    "filetype_spdatasourcelist": "Data Source List",
    "splisttemplatecataloglist": "List Template Gallery",
    "filetype_splisttemplatecataloglist": "List Template Gallery",
    "spwebpartcataloglist": "WebPart Gallery",
    "filetype_spwebpartcataloglist": "WebPart Gallery",
    "spwebtemplatecataloglist": "Site Template Gallery",
    "filetype_spwebtemplatecataloglist": "Site Template Gallery",
    "spworkspacepagelist": "Workspace Pages",
    "filetype_spworkspacepagelist": "Workspace Pages",
    "spunknownlist": "Custom List",
    "filetype_spunknownlist": "Custom List",
    "spadministratortask": "Administrator Task",
    "filetype_spadministratortask": "Administrator Task",
    "spadministratortasklist": "Administrator Tasks",
    "filetype_spadministratortasklist": "Administrator Tasks",
    "spareadocumentlibrarylist": "Area Document Library",
    "filetype_spareadocumentlibrarylist": "Area Document Library",
    "spblogcategory": "Blog Category",
    "filetype_spblogcategory": "Blog Category",
    "spblogcategorylist": "Blog Categories",
    "filetype_spblogcategorylist": "Blog Categories",
    "spblogcomment": "Blog Comment",
    "filetype_spblogcomment": "Blog Comment",
    "spblogcommentlist": "Blog Comments",
    "filetype_spblogcommentlist": "Blog Comments",
    "spblogpost": "Blog Post",
    "filetype_spblogpost": "Blog Post",
    "spblogpostlist": "Blog Posts",
    "filetype_spblogpostlist": "Blog Posts",
    "spdataconnectionlibrarylist": "Data Connection Library",
    "filetype_spdataconnectionlibrarylist": "Data Connection Library",
    "spdistributiongroup": "Distribution Group",
    "filetype_spdistributiongroup": "Distribution Group",
    "spdistributiongrouplist": "Distribution Groups",
    "filetype_spdistributiongrouplist": "Distribution Groups",
    "spipfslist": "InfoPath Forms Servers",
    "filetype_spipfslist": "InfoPath Forms Servers",
    "spkeyperformanceindicator": "Key Performance Indicator",
    "filetype_spkeyperformanceindicator": "Key Performance Indicator",
    "spkeyperformanceindicatorlist": "Key Performance Indicators",
    "filetype_spkeyperformanceindicatorlist": "Key Performance Indicators",
    "splanguagesandtranslator": "Languages and Translator",
    "filetype_splanguagesandtranslator": "Languages and Translator",
    "splanguagesandtranslatorlist": "Languages and Translators",
    "filetype_splanguagesandtranslatorlist": "Languages and Translators",
    "spmasterpagescataloglist": "Master Page Gallery",
    "filetype_spmasterpagescataloglist": "Master Page Gallery",
    "spnocodeworkflowlibrarylist": "No-code Workflow Libraries",
    "filetype_spnocodeworkflowlibrarylist": "No-code Workflow Libraries",
    "spprojecttask": "Project Task",
    "filetype_spprojecttask": "Project Task",
    "spprojecttasklist": "Project Tasks",
    "filetype_spprojecttasklist": "Project Tasks",
    "sppublishingpageslibrarylist": "Page Library",
    "filetype_sppublishingpageslibrarylist": "Page Library",
    "spreportdocumentlibrarylist": "Report Document Library",
    "filetype_spreportdocumentlibrarylist": "Report Document Library",
    "spreportlibrarylist": "Report Library",
    "filetype_spreportlibrarylist": "Report Library",
    "spslidelibrarylist": "Slide Library",
    "filetype_spslidelibrarylist": "Slide Library",
    "sptab": "Tabs",
    "filetype_sptab": "Tabs",
    "sptablist": "Tabs List",
    "filetype_sptablist": "Tabs List",
    "sptranslationmanagementlibrarylist": "Translation Management Library",
    "filetype_sptranslationmanagementlibrarylist": "Translation Management Library",
    "spuserinformation": "User Information",
    "filetype_spuserinformation": "User Information",
    "spuserinformationlist": "User Information List",
    "filetype_spuserinformationlist": "User Information List",
    "spwikipagelibrarylist": "Wiki Page Library",
    "filetype_spwikipagelibrarylist": "Wiki Page Library",
    "spworkflowhistory": "Workflow History",
    "filetype_spworkflowhistory": "Workflow History",
    "spworkflowhistorylist": "Workflow History List",
    "filetype_spworkflowhistorylist": "Workflow History List",
    "spworkflowprocess": "Custom Workflow Process",
    "filetype_spworkflowprocess": "Custom Workflow Process",
    "spworkflowprocesslist": "Custom Workflow Processes",
    "filetype_spworkflowprocesslist": "Custom Workflow Processes",
    "sppublishingimageslibrarylist": "Publishing Image Library",
    "filetype_sppublishingimageslibrarylist": "Publishing Image Library",
    "spcirculation": "Circulation",
    "filetype_spcirculation": "Circulation",
    "spcirculationlist": "Circulations",
    "filetype_spcirculationlist": "Circulations",
    "spdashboardslibrarylist": "Dashboards Library",
    "filetype_spdashboardslibrarylist": "Dashboards Library",
    "spdataconnectionforperformancepointlibrarylist": "PerformancePoint Data Connection Library",
    "filetype_spdataconnectionforperformancepointlibrarylist": "PerformancePoint Data Connection Library",
    "sphealthreport": "Health Report",
    "filetype_sphealthreport": "Health Report",
    "sphealthreportlist": "Health Reports",
    "filetype_sphealthreportlist": "Health Reports",
    "sphealthrule": "Health Rule",
    "filetype_sphealthrule": "Health Rule",
    "sphealthrulelist": "Health Rules",
    "filetype_sphealthrulelist": "Health Rules",
    "spimedictionary": "IME Dictionary",
    "filetype_spimedictionary": "IME Dictionary",
    "spimedictionarylist": "IME Dictionaries",
    "filetype_spimedictionarylist": "IME Dictionaries",
    "spperformancepointcontent": "PerformancePoint Content",
    "filetype_spperformancepointcontent": "PerformancePoint Content",
    "spperformancepointcontentlist": "PerformancePoint Contents",
    "filetype_spperformancepointcontentlist": "PerformancePoint Contents",
    "spphonecallmemo": "Phone Call Memo",
    "filetype_spphonecallmemo": "Phone Call Memo",
    "spphonecallmemolist": "Phone Call Memos",
    "filetype_spphonecallmemolist": "Phone Call Memos",
    "sprecordlibrarylist": "Record Library",
    "filetype_sprecordlibrarylist": "Record Library",
    "spresource": "Resource",
    "filetype_spresource": "Resource",
    "spresourcelist": "Resources",
    "filetype_spresourcelist": "Resources",
    "spprocessdiagramslibrarylist": "Process Diagram Library",
    "filetype_spprocessdiagramslibrarylist": "Process Diagram Library",
    "spsitethemeslibrarylist": "Site Theme Library",
    "filetype_spsitethemeslibrarylist": "Site Theme Library",
    "spsolutionslibrarylist": "Solution Library",
    "filetype_spsolutionslibrarylist": "Solution Library",
    "spwfpublibrarylist": "WFPUB Library",
    "filetype_spwfpublibrarylist": "WFPUB Library",
    "spwhereabout": "Whereabout",
    "filetype_spwhereabout": "Whereabout",
    "spwhereaboutlist": "Whereabouts",
    "filetype_spwhereaboutlist": "Whereabouts",
    "spdocumentlink": "Link to a Document",
    "filetype_spdocumentlink": "Link to a Document",
    "spdocumentset": "Document Set",
    "filetype_spdocumentset": "Document Set",
    "spmicrofeedpost": "Microfeed Post",
    "filetype_spmicrofeedpost": "Microfeed Post",
    "spmicrofeedlist": "Microfeed",
    "filetype_spmicrofeedlist": "Microfeed",
    "splistfolder": "List Folder",
    "filetype_splistfolder": "List Folder",
    "youtubevideo": "YouTube video",
    "filetype_youtubevideo": "YouTube video",
    "youtubeplaylistitem": "YouTube playlist item",
    "filetype_youtubeplaylistitem": "YouTube playlist item",
    "youtubeplaylist": "YouTube playlist",
    "filetype_youtubeplaylist": "YouTube playlist",
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
    "SubmitSearch": "Submit search",
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
    "ShowingResultsOfWithQuery": "Result<pl>s</pl> {0}<pl>-{1}</pl> of {2} for {3}",
    "SwitchTo": "Switch to {0}",
    "Unexclude": "Remove exclusion filter on {0}",
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
    "noResult": "No results",
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
    "CollapseFacet": "Collapse {0} facet",
    "ExpandFacet": "Expand {0} facet",
    "ShowLessFacetResults": "Show fewer results for {0} facet",
    "ShowMoreFacetResults": "Show more results for {0} facet",
    "ShowLessCategoryResults": "Show fewer results for the {0} category",
    "ShowMoreCategoryResults": "Show more results for the {0} category",
    "SearchFacetResults": "Search for values in {0} facet",
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
    "CopyPasteToSupport": "Copy paste this message to the Coveo Support team for more information.",
    "FollowQueryDescription": "Alert me for changes to the search results of this query.",
    "SearchAlerts_Panel": "Manage Alerts",
    "SearchAlerts_PanelDescription": "View and manage your search alerts.",
    "SearchAlerts_PanelNoSearchAlerts": "You have no subscriptions.",
    "SearchAlerts_Fail": "The Search Alerts service is currently unavailable.",
    "SearchAlerts_Type": "Type",
    "SearchAlerts_Content": "Content",
    "SearchAlerts_Actions": "Action",
    "EmptyQuery": "<empty>",
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
    "card": "Card",
    "table": "Table",
    "ResultLinks": "Result links",
    "EnableQuerySyntax": "Enable query syntax",
    "On": "On",
    "Off": "Off",
    "Automatic": "Automatic",
    "ResultsPerPage": "Results per page",
    "PreviousMonth": "Previous month",
    "NextMonth": "Next month",
    "Title": "Title",
    "FiltersInAdvancedSearch": "Filters in Advanced Search",
    "NoEndpoints": "{0} has no registered endpoints.",
    "InvalidToken": "The token used is invalid.",
    "AddSources": "You will need to add sources in your index, or wait for the created sources to finish indexing.",
    "TryAgain": "Please try again.",
    "CoveoOnlineHelp": "Coveo Online Help",
    "CannotAccess": "{0} cannot be accessed.",
    "CoveoOrganization": "Coveo Organization",
    "SearchAPIDuration": "Search API Duration: {0}",
    "LastUpdated": "Last updated",
    "AllDates": "All dates",
    "WithinLastDay": "Within last day",
    "WithinLastWeek": "Within last week",
    "WithinLastMonth": "Within last month",
    "WithinLastYear": "Within last year",
    "RelevanceInspector": "Relevance Inspector",
    "KeywordInCategory": "{0} <span class=\"coveo-omnibox-suggestion-category\">in {1}</span>",
    "ResultCount": "{0} result<pl>s</pl>",
    "ShowingResults": "{0} result<pl>s</pl>",
    "ShowingResultsWithQuery": "{0} result<pl>s</pl> for {1}",
    "NumberOfVideos": "Number of videos",
    "AllCategories": "All Categories",
    "Recommended": "Recommended",
    "Featured": "Featured",
    "CoveoHomePage": "Coveo Home page",
    "SizeValue": "Size value",
    "UnitMeasurement": "Unit of measurement",
    "Toggle": "Toggle",
    "FilterOn": "Filter on {0}",
    "RemoveFilterOn": "Remove inclusion filter on {0}",
    "Enter": "Enter",
    "InsertAQuery": "Insert a query",
    "PressEnterToSend": "Press enter to send",
    "SortResultsBy": "Sort results by {0}",
    "SortResultsByAscending": "Sort by {0} in ascending order",
    "SortResultsByDescending": "Sort by {0} in descending order",
    "DisplayResultsAs": "Display results as {0}",
    "FacetTitle": "{0} facet",
    "IncludeValueWithResultCount": "Inclusion filter on {0}; {1}",
    "ExcludeValueWithResultCount": "Exclusion filter on {0}; {1}",
    "PageNumber": "Page {0}",
    "DisplayResultsPerPage": "Display {0} results per page",
    "GroupByAndFacetRequestsCannotCoexist": "The query is invalid because it contains both Group By and Facet requests. Ensure that the search interface does not initialize DynamicFacet components alongside Facet components (or alongside any component extending the Facet component, such as FacetRange or FacetSlider).",
    "MustContain": "Must contain:",
    "Missing": "Missing:",
    "Filters": "Filters",
    "FiltersDropdown": "Filters dropdown",
    "OpenFiltersDropdown": "Open the filters dropdown",
    "CloseFiltersDropdown": "Close the filters dropdown",
    "NoValuesFound": "No values found.",
    "To": "to",
    "DeselectFilterValues": "Deselect all active filters on {0} field",
    "Rated": "Rated {0} out of {1} star<pl>s</pl>",
    "RatedBy": "by {0} user<pl>s</pl>",
    "NoRatings": "No ratings",
    "Pagination": "Pagination",
    "ThumbnailOf": "Thumbnail of \"{0}\"",
    "CollapsedUriParts": "Collapsed URI parts",
    "HierarchicalFacetValueIndentedUnder": "{0} under {1}",
    "HierarchicalFacetValuePathPrefix": "in",
    "MoreValuesAvailable": "additional values are available",
    "Breadcrumb": "Active filters",
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Globalize"] = __webpack_require__(53);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

/*! globalize - v0.1.1 - 2013-04-30
* https://github.com/jquery/globalize
* Copyright 2013 ; Licensed MIT */
var Globalize = (function(e,r){var t,n,a,s,u,l,i,c,o,f,d,p,h,g,b,m,y,M,v,k,z,F,A,x;t=function(e){return new t.prototype.init(e)}, true?module.exports=t:e.Globalize=t,t.cultures={},t.prototype={constructor:t,init:function(e){return this.cultures=t.cultures,this.cultureSelector=e,this}},t.prototype.init.prototype=t.prototype,t.cultures["default"]={name:"en",englishName:"English",nativeName:"English",isRTL:!1,language:"en",numberFormat:{pattern:["-n"],decimals:2,",":",",".":".",groupSizes:[3],"+":"+","-":"-",NaN:"NaN",negativeInfinity:"-Infinity",positiveInfinity:"Infinity",percent:{pattern:["-n %","n %"],decimals:2,groupSizes:[3],",":",",".":".",symbol:"%"},currency:{pattern:["($n)","$n"],decimals:2,groupSizes:[3],",":",",".":".",symbol:"$"}},calendars:{standard:{name:"Gregorian_USEnglish","/":"/",":":":",firstDay:0,days:{names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],namesAbbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],namesShort:["Su","Mo","Tu","We","Th","Fr","Sa"]},months:{names:["January","February","March","April","May","June","July","August","September","October","November","December",""],namesAbbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""]},AM:["AM","am","AM"],PM:["PM","pm","PM"],eras:[{name:"A.D.",start:null,offset:0}],twoDigitYearMax:2029,patterns:{d:"M/d/yyyy",D:"dddd, MMMM dd, yyyy",t:"h:mm tt",T:"h:mm:ss tt",f:"dddd, MMMM dd, yyyy h:mm tt",F:"dddd, MMMM dd, yyyy h:mm:ss tt",M:"MMMM dd",Y:"yyyy MMMM",S:"yyyy'-'MM'-'dd'T'HH':'mm':'ss"}}},messages:{}},t.cultures["default"].calendar=t.cultures["default"].calendars.standard,t.cultures.en=t.cultures["default"],t.cultureSelector="en",n=/^0x[a-f0-9]+$/i,a=/^[+\-]?infinity$/i,s=/^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/,u=/^\s+|\s+$/g,l=function(e,r){if(e.indexOf)return e.indexOf(r);for(var t=0,n=e.length;n>t;t++)if(e[t]===r)return t;return-1},i=function(e,r){return e.substr(e.length-r.length)===r},c=function(){var e,t,n,a,s,u,l=arguments[0]||{},i=1,p=arguments.length,h=!1;for("boolean"==typeof l&&(h=l,l=arguments[1]||{},i=2),"object"==typeof l||f(l)||(l={});p>i;i++)if(null!=(e=arguments[i]))for(t in e)n=l[t],a=e[t],l!==a&&(h&&a&&(d(a)||(s=o(a)))?(s?(s=!1,u=n&&o(n)?n:[]):u=n&&d(n)?n:{},l[t]=c(h,u,a)):a!==r&&(l[t]=a));return l},o=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},f=function(e){return"[object Function]"===Object.prototype.toString.call(e)},d=function(e){return"[object Object]"===Object.prototype.toString.call(e)},p=function(e,r){return 0===e.indexOf(r)},h=function(e){return(e+"").replace(u,"")},g=function(e){return isNaN(e)?0/0:Math[0>e?"ceil":"floor"](e)},b=function(e,r,t){var n;for(n=e.length;r>n;n+=1)e=t?"0"+e:e+"0";return e},m=function(e,r){for(var t=0,n=!1,a=0,s=e.length;s>a;a++){var u=e.charAt(a);switch(u){case"'":n?r.push("'"):t++,n=!1;break;case"\\":n&&r.push("\\"),n=!n;break;default:r.push(u),n=!1}}return t},y=function(e,r){r=r||"F";var t,n=e.patterns,a=r.length;if(1===a){if(t=n[r],!t)throw"Invalid date format string '"+r+"'.";r=t}else 2===a&&"%"===r.charAt(0)&&(r=r.charAt(1));return r},M=function(e,r,t){function n(e,r){var t,n=e+"";return r>1&&r>n.length?(t=v[r-2]+n,t.substr(t.length-r,r)):t=n}function a(){return h||g?h:(h=A.test(r),g=!0,h)}function s(e,r){if(b)return b[r];switch(r){case 0:return e.getFullYear();case 1:return e.getMonth();case 2:return e.getDate();default:throw"Invalid part value "+r}}var u,l=t.calendar,i=l.convert;if(!r||!r.length||"i"===r){if(t&&t.name.length)if(i)u=M(e,l.patterns.F,t);else{var c=new Date(e.getTime()),o=z(e,l.eras);c.setFullYear(F(e,l,o)),u=c.toLocaleString()}else u=""+e;return u}var f=l.eras,d="s"===r;r=y(l,r),u=[];var p,h,g,b,v=["0","00","000"],A=/([^d]|^)(d|dd)([^d]|$)/g,x=0,I=k();for(!d&&i&&(b=i.fromGregorian(e));;){var S=I.lastIndex,w=I.exec(r),C=r.slice(S,w?w.index:r.length);if(x+=m(C,u),!w)break;if(x%2)u.push(w[0]);else{var D=w[0],H=D.length;switch(D){case"ddd":case"dddd":var O=3===H?l.days.namesAbbr:l.days.names;u.push(O[e.getDay()]);break;case"d":case"dd":h=!0,u.push(n(s(e,2),H));break;case"MMM":case"MMMM":var N=s(e,1);u.push(l.monthsGenitive&&a()?l.monthsGenitive[3===H?"namesAbbr":"names"][N]:l.months[3===H?"namesAbbr":"names"][N]);break;case"M":case"MM":u.push(n(s(e,1)+1,H));break;case"y":case"yy":case"yyyy":N=b?b[0]:F(e,l,z(e,f),d),4>H&&(N%=100),u.push(n(N,H));break;case"h":case"hh":p=e.getHours()%12,0===p&&(p=12),u.push(n(p,H));break;case"H":case"HH":u.push(n(e.getHours(),H));break;case"m":case"mm":u.push(n(e.getMinutes(),H));break;case"s":case"ss":u.push(n(e.getSeconds(),H));break;case"t":case"tt":N=12>e.getHours()?l.AM?l.AM[0]:" ":l.PM?l.PM[0]:" ",u.push(1===H?N.charAt(0):N);break;case"f":case"ff":case"fff":u.push(n(e.getMilliseconds(),3).substr(0,H));break;case"z":case"zz":p=e.getTimezoneOffset()/60,u.push((0>=p?"+":"-")+n(Math.floor(Math.abs(p)),H));break;case"zzz":p=e.getTimezoneOffset()/60,u.push((0>=p?"+":"-")+n(Math.floor(Math.abs(p)),2)+":"+n(Math.abs(e.getTimezoneOffset()%60),2));break;case"g":case"gg":l.eras&&u.push(l.eras[z(e,f)].name);break;case"/":u.push(l["/"]);break;default:throw"Invalid date format pattern '"+D+"'."}}}return u.join("")},function(){var e;e=function(e,r,t){var n=t.groupSizes,a=n[0],s=1,u=Math.pow(10,r),l=Math.round(e*u)/u;isFinite(l)||(l=e),e=l;var i=e+"",c="",o=i.split(/e/i),f=o.length>1?parseInt(o[1],10):0;i=o[0],o=i.split("."),i=o[0],c=o.length>1?o[1]:"",f>0?(c=b(c,f,!1),i+=c.slice(0,f),c=c.substr(f)):0>f&&(f=-f,i=b(i,f+1,!0),c=i.slice(-f,i.length)+c,i=i.slice(0,-f)),c=r>0?t["."]+(c.length>r?c.slice(0,r):b(c,r)):"";for(var d=i.length-1,p=t[","],h="";d>=0;){if(0===a||a>d)return i.slice(0,d+1)+(h.length?p+h+c:c);h=i.slice(d-a+1,d+1)+(h.length?p+h:""),d-=a,n.length>s&&(a=n[s],s++)}return i.slice(0,d+1)+p+h+c},v=function(r,t,n){if(!isFinite(r))return 1/0===r?n.numberFormat.positiveInfinity:r===-1/0?n.numberFormat.negativeInfinity:n.numberFormat.NaN;if(!t||"i"===t)return n.name.length?r.toLocaleString():""+r;t=t||"D";var a,s=n.numberFormat,u=Math.abs(r),l=-1;t.length>1&&(l=parseInt(t.slice(1),10));var i,c=t.charAt(0).toUpperCase();switch(c){case"D":a="n",u=g(u),-1!==l&&(u=b(""+u,l,!0)),0>r&&(u="-"+u);break;case"N":i=s;case"C":i=i||s.currency;case"P":i=i||s.percent,a=0>r?i.pattern[0]:i.pattern[1]||"n",-1===l&&(l=i.decimals),u=e(u*("P"===c?100:1),l,i);break;default:throw"Bad number format specifier: "+c}for(var o=/n|\$|-|%/g,f="";;){var d=o.lastIndex,p=o.exec(a);if(f+=a.slice(d,p?p.index:a.length),!p)break;switch(p[0]){case"n":f+=u;break;case"$":f+=s.currency.symbol;break;case"-":/[1-9]/.test(u)&&(f+=s["-"]);break;case"%":f+=s.percent.symbol}}return f}}(),k=function(){return/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g},z=function(e,r){if(!r)return 0;for(var t,n=e.getTime(),a=0,s=r.length;s>a;a++)if(t=r[a].start,null===t||n>=t)return a;return 0},F=function(e,r,t,n){var a=e.getFullYear();return!n&&r.eras&&(a-=r.eras[t].offset),a},function(){var e,r,t,n,a,s,u;e=function(e,r){if(100>r){var t=new Date,n=z(t),a=F(t,e,n),s=e.twoDigitYearMax;s="string"==typeof s?(new Date).getFullYear()%100+parseInt(s,10):s,r+=a-a%100,r>s&&(r-=100)}return r},r=function(e,r,t){var n,a=e.days,i=e._upperDays;return i||(e._upperDays=i=[u(a.names),u(a.namesAbbr),u(a.namesShort)]),r=s(r),t?(n=l(i[1],r),-1===n&&(n=l(i[2],r))):n=l(i[0],r),n},t=function(e,r,t){var n=e.months,a=e.monthsGenitive||e.months,i=e._upperMonths,c=e._upperMonthsGen;i||(e._upperMonths=i=[u(n.names),u(n.namesAbbr)],e._upperMonthsGen=c=[u(a.names),u(a.namesAbbr)]),r=s(r);var o=l(t?i[1]:i[0],r);return 0>o&&(o=l(t?c[1]:c[0],r)),o},n=function(e,r){var t=e._parseRegExp;if(t){var n=t[r];if(n)return n}else e._parseRegExp=t={};for(var a,s=y(e,r).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g,"\\\\$1"),u=["^"],l=[],i=0,c=0,o=k();null!==(a=o.exec(s));){var f=s.slice(i,a.index);if(i=o.lastIndex,c+=m(f,u),c%2)u.push(a[0]);else{var d,p=a[0],h=p.length;switch(p){case"dddd":case"ddd":case"MMMM":case"MMM":case"gg":case"g":d="(\\D+)";break;case"tt":case"t":d="(\\D*)";break;case"yyyy":case"fff":case"ff":case"f":d="(\\d{"+h+"})";break;case"dd":case"d":case"MM":case"M":case"yy":case"y":case"HH":case"H":case"hh":case"h":case"mm":case"m":case"ss":case"s":d="(\\d\\d?)";break;case"zzz":d="([+-]?\\d\\d?:\\d{2})";break;case"zz":case"z":d="([+-]?\\d\\d?)";break;case"/":d="(\\/)";break;default:throw"Invalid date format pattern '"+p+"'."}d&&u.push(d),l.push(a[0])}}m(s.slice(i),u),u.push("$");var g=u.join("").replace(/\s+/g,"\\s+"),b={regExp:g,groups:l};return t[r]=b},a=function(e,r,t){return r>e||e>t},s=function(e){return e.split("\u00a0").join(" ").toUpperCase()},u=function(e){for(var r=[],t=0,n=e.length;n>t;t++)r[t]=s(e[t]);return r},A=function(s,u,l){s=h(s);var i=l.calendar,c=n(i,u),o=RegExp(c.regExp).exec(s);if(null===o)return null;for(var f,d=c.groups,g=null,b=null,m=null,y=null,M=null,v=0,k=0,z=0,F=0,A=null,x=!1,I=0,S=d.length;S>I;I++){var w=o[I+1];if(w){var C=d[I],D=C.length,H=parseInt(w,10);switch(C){case"dd":case"d":if(y=H,a(y,1,31))return null;break;case"MMM":case"MMMM":if(m=t(i,w,3===D),a(m,0,11))return null;break;case"M":case"MM":if(m=H-1,a(m,0,11))return null;break;case"y":case"yy":case"yyyy":if(b=4>D?e(i,H):H,a(b,0,9999))return null;break;case"h":case"hh":if(v=H,12===v&&(v=0),a(v,0,11))return null;break;case"H":case"HH":if(v=H,a(v,0,23))return null;break;case"m":case"mm":if(k=H,a(k,0,59))return null;break;case"s":case"ss":if(z=H,a(z,0,59))return null;break;case"tt":case"t":if(x=i.PM&&(w===i.PM[0]||w===i.PM[1]||w===i.PM[2]),!x&&(!i.AM||w!==i.AM[0]&&w!==i.AM[1]&&w!==i.AM[2]))return null;break;case"f":case"ff":case"fff":if(F=H*Math.pow(10,3-D),a(F,0,999))return null;break;case"ddd":case"dddd":if(M=r(i,w,3===D),a(M,0,6))return null;break;case"zzz":var O=w.split(/:/);if(2!==O.length)return null;if(f=parseInt(O[0],10),a(f,-12,13))return null;var N=parseInt(O[1],10);if(a(N,0,59))return null;A=60*f+(p(w,"-")?-N:N);break;case"z":case"zz":if(f=H,a(f,-12,13))return null;A=60*f;break;case"g":case"gg":var T=w;if(!T||!i.eras)return null;T=h(T.toLowerCase());for(var j=0,$=i.eras.length;$>j;j++)if(T===i.eras[j].name.toLowerCase()){g=j;break}if(null===g)return null}}}var P,G=new Date,E=i.convert;if(P=E?E.fromGregorian(G)[0]:G.getFullYear(),null===b?b=P:i.eras&&(b+=i.eras[g||0].offset),null===m&&(m=0),null===y&&(y=1),E){if(G=E.toGregorian(b,m,y),null===G)return null}else{if(G.setFullYear(b,m,y),G.getDate()!==y)return null;if(null!==M&&G.getDay()!==M)return null}if(x&&12>v&&(v+=12),G.setHours(v,k,z,F),null!==A){var Y=G.getMinutes()-(A+G.getTimezoneOffset());G.setHours(G.getHours()+parseInt(Y/60,10),Y%60)}return G}}(),x=function(e,r,t){var n,a=r["-"],s=r["+"];switch(t){case"n -":a=" "+a,s=" "+s;case"n-":i(e,a)?n=["-",e.substr(0,e.length-a.length)]:i(e,s)&&(n=["+",e.substr(0,e.length-s.length)]);break;case"- n":a+=" ",s+=" ";case"-n":p(e,a)?n=["-",e.substr(a.length)]:p(e,s)&&(n=["+",e.substr(s.length)]);break;case"(n)":p(e,"(")&&i(e,")")&&(n=["-",e.substr(1,e.length-2)])}return n||["",e]},t.prototype.findClosestCulture=function(e){return t.findClosestCulture.call(this,e)},t.prototype.format=function(e,r,n){return t.format.call(this,e,r,n)},t.prototype.localize=function(e,r){return t.localize.call(this,e,r)},t.prototype.parseInt=function(e,r,n){return t.parseInt.call(this,e,r,n)},t.prototype.parseFloat=function(e,r,n){return t.parseFloat.call(this,e,r,n)},t.prototype.culture=function(e){return t.culture.call(this,e)},t.addCultureInfo=function(e,r,t){var n={},a=!1;"string"!=typeof e?(t=e,e=this.culture().name,n=this.cultures[e]):"string"!=typeof r?(t=r,a=null==this.cultures[e],n=this.cultures[e]||this.cultures["default"]):(a=!0,n=this.cultures[r]),this.cultures[e]=c(!0,{},n,t),a&&(this.cultures[e].calendar=this.cultures[e].calendars.standard)},t.findClosestCulture=function(e){var r;if(!e)return this.findClosestCulture(this.cultureSelector)||this.cultures["default"];if("string"==typeof e&&(e=e.split(",")),o(e)){var t,n,a=this.cultures,s=e,u=s.length,l=[];for(n=0;u>n;n++){e=h(s[n]);var i,c=e.split(";");t=h(c[0]),1===c.length?i=1:(e=h(c[1]),0===e.indexOf("q=")?(e=e.substr(2),i=parseFloat(e),i=isNaN(i)?0:i):i=1),l.push({lang:t,pri:i})}for(l.sort(function(e,r){return e.pri<r.pri?1:e.pri>r.pri?-1:0}),n=0;u>n;n++)if(t=l[n].lang,r=a[t])return r;for(n=0;u>n;n++)for(t=l[n].lang;;){var f=t.lastIndexOf("-");if(-1===f)break;if(t=t.substr(0,f),r=a[t])return r}for(n=0;u>n;n++){t=l[n].lang;for(var d in a){var p=a[d];if(p.language===t)return p}}}else if("object"==typeof e)return e;return r||null},t.format=function(e,r,t){var n=this.findClosestCulture(t);return e instanceof Date?e=M(e,r,n):"number"==typeof e&&(e=v(e,r,n)),e},t.localize=function(e,r){return this.findClosestCulture(r).messages[e]||this.cultures["default"].messages[e]},t.parseDate=function(e,r,t){t=this.findClosestCulture(t);var n,a,s;if(r){if("string"==typeof r&&(r=[r]),r.length)for(var u=0,l=r.length;l>u;u++){var i=r[u];if(i&&(n=A(e,i,t)))break}}else{s=t.calendar.patterns;for(a in s)if(n=A(e,s[a],t))break}return n||null},t.parseInt=function(e,r,n){return g(t.parseFloat(e,r,n))},t.parseFloat=function(e,r,t){"number"!=typeof r&&(t=r,r=10);var u=this.findClosestCulture(t),l=0/0,i=u.numberFormat;if(e.indexOf(u.numberFormat.currency.symbol)>-1&&(e=e.replace(u.numberFormat.currency.symbol,""),e=e.replace(u.numberFormat.currency["."],u.numberFormat["."])),e.indexOf(u.numberFormat.percent.symbol)>-1&&(e=e.replace(u.numberFormat.percent.symbol,"")),e=e.replace(/ /g,""),a.test(e))l=parseFloat(e);else if(!r&&n.test(e))l=parseInt(e,16);else{var c=x(e,i,i.pattern[0]),o=c[0],f=c[1];""===o&&"(n)"!==i.pattern[0]&&(c=x(e,i,"(n)"),o=c[0],f=c[1]),""===o&&"-n"!==i.pattern[0]&&(c=x(e,i,"-n"),o=c[0],f=c[1]),o=o||"+";var d,p,h=f.indexOf("e");0>h&&(h=f.indexOf("E")),0>h?(p=f,d=null):(p=f.substr(0,h),d=f.substr(h+1));var g,b,m=i["."],y=p.indexOf(m);0>y?(g=p,b=null):(g=p.substr(0,y),b=p.substr(y+m.length));var M=i[","];g=g.split(M).join("");var v=M.replace(/\u00A0/g," ");M!==v&&(g=g.split(v).join(""));var k=o+g;if(null!==b&&(k+="."+b),null!==d){var z=x(d,i,"-n");k+="e"+(z[0]||"+")+z[1]}s.test(k)&&(l=parseFloat(k))}return l},t.culture=function(e){return e!==r&&(this.cultureSelector=e),this.findClosestCulture(e)||this.cultures["default"]}; return Globalize;}(this));

/***/ })
/******/ ]);
//# sourceMappingURL=playground.js.map