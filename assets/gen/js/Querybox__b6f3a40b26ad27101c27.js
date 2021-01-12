webpackJsonpCoveo__temporary([10],{

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(49);
var Result_2 = __webpack_require__(49);
exports.notWordStart = ' ()[],$@\'"';
exports.notInWord = ' ()[],:';
exports.Basic = {
    basicExpressions: ['Word', 'DoubleQuoted'],
    grammars: {
        DoubleQuoted: '"[NotDoubleQuote]"',
        NotDoubleQuote: /[^"]*/,
        SingleQuoted: "'[NotSingleQuote]'",
        NotSingleQuote: /[^']*/,
        Number: /-?(0|[1-9]\d*)(\.\d+)?/,
        Word: function (input, end, expression) {
            var regex = new RegExp('[^' + exports.notWordStart.replace(/(.)/g, '\\$1') + '][^' + exports.notInWord.replace(/(.)/g, '\\$1') + ']*');
            var groups = input.match(regex);
            if (groups != null && groups.index != 0) {
                groups = null;
            }
            var result = new Result_1.Result(groups != null ? groups[0] : null, expression, input);
            if (result.isSuccess() && end && input.length > result.value.length) {
                return new Result_2.EndOfInputResult(result);
            }
            return result;
        }
    }
};


/***/ }),

/***/ 135:
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
__webpack_require__(560);
var QueryEvents_1 = __webpack_require__(11);
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(95);
var GlobalExports_1 = __webpack_require__(3);
var Grammar_1 = __webpack_require__(176);
var MagicBox_1 = __webpack_require__(218);
var Assert_1 = __webpack_require__(5);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var QueryboxOptionsProcessing_1 = __webpack_require__(502);
var QueryboxQueryParameters_1 = __webpack_require__(503);
/**
 * The `Querybox` component renders an input which the end user can interact with to enter and submit queries.
 *
 * When the end user submits a search request, the `Querybox` component triggers a query and logs the corresponding
 * usage analytics data.
 *
 * For technical reasons, it is necessary to instantiate this component on a `div` element rather than on an `input`
 * element.
 *
 * See also the [`Searchbox`]{@link Searchbox} component, which can automatically instantiate a `Querybox` along with an
 * optional [`SearchButton`]{@link SearchButton} component.
 */
var Querybox = /** @class */ (function (_super) {
    __extends(Querybox, _super);
    /**
     * Creates a new `Querybox component`. Creates a new `Coveo.Magicbox` instance and wraps the Magicbox methods
     * (`onblur`, `onsubmit` etc.). Binds event on `buildingQuery` and before redirection (for standalone box).
     * @param element The HTMLElement on which to instantiate the component. This cannot be an HTMLInputElement for
     * technical reasons.
     * @param options The options for the `Querybox` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Querybox(element, options, bindings) {
        var _this = _super.call(this, element, Querybox.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        if (element instanceof HTMLInputElement) {
            _this.logger.error('Querybox cannot be used on an HTMLInputElement');
        }
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Querybox, options);
        new QueryboxOptionsProcessing_1.QueryboxOptionsProcessing(_this).postProcess();
        Dom_1.$$(_this.element).toggleClass('coveo-query-syntax-disabled', _this.options.enableQuerySyntax == false);
        _this.magicBox = MagicBox_1.createMagicBox(element, new Grammar_1.Grammar('Query', {
            Query: '[Term*][Spaces?]',
            Term: '[Spaces?][Word]',
            Spaces: / +/,
            Word: /[^ ]+/
        }), {
            inline: true
        });
        var input = Dom_1.$$(_this.magicBox.element).find('input');
        if (input) {
            Dom_1.$$(input).setAttribute('aria-label', _this.options.placeholder || Strings_1.l('Search'));
        }
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(StandaloneSearchInterfaceEvents_1.StandaloneSearchInterfaceEvents.beforeRedirect, function () { return _this.updateQueryState(); });
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.Q, function (args) {
            return _this.handleQueryStateChanged(args);
        });
        if (_this.options.enableSearchAsYouType) {
            Dom_1.$$(_this.element).addClass('coveo-search-as-you-type');
            _this.magicBox.onchange = function () {
                _this.searchAsYouType();
            };
        }
        _this.magicBox.onsubmit = function () {
            _this.submit();
        };
        _this.magicBox.onblur = function () {
            _this.updateQueryState();
        };
        _this.magicBox.onclear = function () {
            _this.updateQueryState();
            if (_this.options.triggerQueryOnClear) {
                _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxClear, {});
                _this.triggerNewQuery(false);
            }
        };
        return _this;
    }
    /**
     * Adds the current content of the input to the query and triggers a query if the current content of the input has
     * changed since last submit.
     *
     * Also logs the `serachboxSubmit` event in the usage analytics.
     */
    Querybox.prototype.submit = function () {
        this.magicBox.clearSuggestion();
        this.updateQueryState();
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit, {});
        this.triggerNewQuery(false);
    };
    /**
     * Sets the content of the input.
     *
     * @param text The string to set in the input.
     */
    Querybox.prototype.setText = function (text) {
        this.magicBox.setText(text);
        this.updateQueryState();
    };
    /**
     * Clears the content of the input.
     *
     * See also the [`triggerQueryOnClear`]{@link Querybox.options.triggerQueryOnClear} option.
     */
    Querybox.prototype.clear = function () {
        this.magicBox.clear();
    };
    /**
     * Gets the content of the input.
     *
     * @returns {string} The content of the input.
     */
    Querybox.prototype.getText = function () {
        return this.magicBox.getText();
    };
    /**
     * Gets the result from the input.
     *
     * @returns {Result} The result.
     */
    Querybox.prototype.getResult = function () {
        return this.magicBox.getResult();
    };
    /**
     * Gets the displayed result from the input.
     *
     * @returns {Result} The displayed result.
     */
    Querybox.prototype.getDisplayedResult = function () {
        return this.magicBox.getDisplayedResult();
    };
    /**
     * Gets the current cursor position in the input.
     *
     * @returns {number} The cursor position (index starts at 0).
     */
    Querybox.prototype.getCursor = function () {
        return this.magicBox.getCursor();
    };
    /**
     * Gets the result at cursor position.
     *
     * @param match {string | { (result): boolean }} The match condition.
     *
     * @returns {Result[]} The result.
     */
    Querybox.prototype.resultAtCursor = function (match) {
        return this.magicBox.resultAtCursor(match);
    };
    Querybox.prototype.handleBuildingQuery = function (args) {
        Assert_1.Assert.exists(args);
        Assert_1.Assert.exists(args.queryBuilder);
        this.updateQueryState();
        this.lastQuery = this.magicBox.getText();
        new QueryboxQueryParameters_1.QueryboxQueryParameters(this.options).addParameters(args.queryBuilder, this.lastQuery);
    };
    Querybox.prototype.triggerNewQuery = function (searchAsYouType) {
        clearTimeout(this.searchAsYouTypeTimeout);
        var text = this.magicBox.getText();
        if (this.lastQuery != text && text != null) {
            this.lastQuery = text;
            this.queryController.executeQuery({
                searchAsYouType: searchAsYouType,
                logInActionsHistory: true
            });
        }
    };
    Querybox.prototype.updateQueryState = function () {
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, this.magicBox.getText());
    };
    Querybox.prototype.handleQueryStateChanged = function (args) {
        Assert_1.Assert.exists(args);
        var q = args.value;
        if (q != this.magicBox.getText()) {
            this.magicBox.setText(q);
        }
    };
    Querybox.prototype.searchAsYouType = function () {
        var _this = this;
        clearTimeout(this.searchAsYouTypeTimeout);
        this.searchAsYouTypeTimeout = window.setTimeout(function () {
            _this.usageAnalytics.logSearchAsYouType(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxAsYouType, {});
            _this.triggerNewQuery(true);
        }, this.options.searchAsYouTypeDelay);
    };
    Querybox.ID = 'Querybox';
    Querybox.doExport = function () {
        GlobalExports_1.exportGlobally({
            Querybox: Querybox,
            QueryboxQueryParameters: QueryboxQueryParameters_1.QueryboxQueryParameters
        });
    };
    /**
     * The options for the Querybox.
     * @componentOptions
     */
    Querybox.options = {
        /**
         * Whether to enable the search-as-you-type feature.
         *
         * **Note:** Enabling this feature can consume lots of queries per month (QPM), especially if the [`searchAsYouTypeDelay`]{@link Querybox.options.searchAsYouTypeDelay} option is set to a low value.
         *
         * Default value is `false`.
         */
        enableSearchAsYouType: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Advanced Options' }),
        /**
         * If the [`enableSearchAsYouType`]{@link Querybox.options.enableSearchAsYouType} option is `true`, specifies how
         * long to wait (in milliseconds) between each key press before triggering a new query.
         *
         * Default value is `50`. Minimum value is `0`
         */
        searchAsYouTypeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 50, min: 0, section: 'Advanced Options' }),
        /**
         * Specifies whether to interpret special query syntax (e.g., `@objecttype=message`) when the end user types
         * a query in the `Querybox` (see
         * [Coveo Query Syntax Reference](https://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)). Setting this
         * option to `true` also causes the `Querybox` to highlight any query syntax.
         *
         * Regardless of the value of this option, the Coveo Cloud REST Search API always interprets expressions surrounded
         * by double quotes (`"`) as exact phrase match requests.
         *
         * See also [`enableLowercaseOperators`]{@link Querybox.options.enableLowercaseOperators}.
         *
         * **Notes:**
         * > * End user preferences can override the value you specify for this option.
         * >
         * > If the end user selects a value other than **Automatic** for the **Enable query syntax** setting (see
         * > the [`enableQuerySyntax`]{@link ResultsPreferences.options.enableQuerySyntax} option of the
         * > [`ResultsPreferences`]{@link ResultsPreferences} component), the end user preference takes precedence over this
         * > option.
         * >
         * > * On-premises versions of the Coveo Search API require this option to be set to `true` in order to interpret
         * > expressions surrounded by double quotes (`"`) as exact phrase match requests.
         *
         * Default value is `false`.
         */
        enableQuerySyntax: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Advanced Options' }),
        /**
         * Specifies whether to expand basic expression keywords containing wildcards characters (`*`) to the possible
         * matching keywords in order to broaden the query (see
         * [Using Wildcards in Queries](https://docs.coveo.com/en/1580/)).
         *
         * See also [`enableQuestionMarks`]{@link Querybox.options.enableQuestionMarks}.
         *
         *  **Note:**
         * > If you are using an on-premises version of the Coveo Search API, you need to set the
         * > [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option to `true` to be able to set
         * > `enableWildcards` to `true`.
         *
         * Default value is `false`.
         */
        enableWildcards: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Advanced Options' }),
        /**
         * If [`enableWildcards`]{@link Querybox.options.enableWildcards} is `true`, specifies whether to expand basic
         * expression keywords containing question mark characters (`?`) to the possible matching keywords in order to
         * broaden the query (see
         * [Using Wildcards in Queries](https://docs.coveo.com/en/1580/)).
         *
         * **Note:**
         * > If you are using an on-premises version of the Coveo Search API, you also need to set the
         * > [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option to `true` in order to be able to set
         * > `enableQuestionMarks` to `true`.
         *
         * Default value is `false`.
         */
        enableQuestionMarks: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableWildcards' }),
        /**
         * If the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is `true`, specifies whether to
         * interpret the `AND`, `NOT`, `OR`, and `NEAR` keywords in the `Querybox` as query operators in the query, even if
         * the end user types those keywords in lowercase.
         *
         * This option applies to all query operators (see
         * [Coveo Query Syntax Reference](https://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
         *
         * **Example:**
         * > If this option and the `enableQuerySyntax` option are both `true`, the Coveo Platform interprets the `near`
         * > keyword in a query such as `service center near me` as the `NEAR` query operator (not as a query term).
         *
         * > Otherwise, if the `enableQuerySyntax` option is `true` and this option is `false`, the end user has to type the
         * > `NEAR` keyword in uppercase for the Coveo Platform to interpret it as a query operator.
         *
         * Default value is `false`.
         */
        enableLowercaseOperators: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableQuerySyntax' }),
        /**
         * Whether to convert a basic expression containing at least a certain number of keywords (see the
         * [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option) to *partial match expression*, so
         * that items containing at least a certain number of those keywords (see the
         * [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option) will match the expression.
         *
         * **Notes:**
         * - Only the basic expression of the query (see [`q`]{@link q}) can be converted to a partial match expression.
         * - When the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is set to `true`, this feature has no effect if the basic expression contains advanced query syntax (field expressions, operators, etc.).
         *
         * @notSupportedIn salesforcefree
         */
        enablePartialMatch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * The minimum number of keywords that need to be present in the basic expression to convert it to a partial match expression.
         *
         * See also the [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option.
         *
         * **Notes:**
         *
         * - Repeated keywords count as a single keyword.
         * - Thesaurus expansions count towards the `partialMatchKeywords` count.
         * - Stemming expansions **do not** count towards the `partialMatchKeywords` count.
         *
         * @notSupportedIn salesforcefree
         */
        partialMatchKeywords: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1, depend: 'enablePartialMatch' }),
        /**
         * An absolute or relative value indicating the minimum number of partial match expression keywords an item must contain to match the expression.
         *
         * See also the [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option.
         *
         * **Notes:**
         * - A keyword and its stemming expansions count as a single keyword when evaluating whether an item meets the `partialMatchThreshold`.
         * - When a relative `partialMatchThreshold` does not yield a whole integer, the fractional part is truncated (e.g., `3.6` becomes `3`).
         *
         * @notSupportedIn salesforcefree
         */
        partialMatchThreshold: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '50%', depend: 'enablePartialMatch' }),
        /**
         * Whether to trigger a query when clearing the `Querybox`.
         *
         * Default value is `false`.
         */
        triggerQueryOnClear: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return Querybox;
}(Component_1.Component));
exports.Querybox = Querybox;
Initialization_1.Initialization.registerAutoCreateComponent(Querybox);


/***/ }),

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionRef_1 = __webpack_require__(484);
var ExpressionOptions_1 = __webpack_require__(486);
var ExpressionRegExp_1 = __webpack_require__(488);
var _ = __webpack_require__(0);
var ExpressionFunction_1 = __webpack_require__(489);
var ExpressionConstant_1 = __webpack_require__(215);
var ExpressionList_1 = __webpack_require__(490);
var Grammar = /** @class */ (function () {
    function Grammar(start, expressions) {
        if (expressions === void 0) { expressions = {}; }
        this.expressions = {};
        this.start = new ExpressionRef_1.ExpressionRef(start, null, 'start', this);
        this.addExpressions(expressions);
    }
    Grammar.prototype.addExpressions = function (expressions) {
        var _this = this;
        _.each(expressions, function (basicExpression, id) {
            _this.addExpression(id, basicExpression);
        });
    };
    Grammar.prototype.addExpression = function (id, basicExpression) {
        if (id in this.expressions) {
            throw new Error('Grammar already contain the id:' + id);
        }
        this.expressions[id] = Grammar.buildExpression(basicExpression, id, this);
    };
    Grammar.prototype.getExpression = function (id) {
        return this.expressions[id];
    };
    Grammar.prototype.parse = function (value) {
        return this.start.parse(value, true);
    };
    Grammar.buildExpression = function (value, id, grammar) {
        var type = typeof value;
        if (type == 'undefined') {
            throw new Error('Invalid Expression: ' + value);
        }
        if (_.isString(value)) {
            return this.buildStringExpression(value, id, grammar);
        }
        if (_.isArray(value)) {
            return new ExpressionOptions_1.ExpressionOptions(_.map(value, function (v, i) { return new ExpressionRef_1.ExpressionRef(v, null, id + '_' + i, grammar); }), id);
        }
        if (_.isRegExp(value)) {
            return new ExpressionRegExp_1.ExpressionRegExp(value, id, grammar);
        }
        if (_.isFunction(value)) {
            return new ExpressionFunction_1.ExpressionFunction(value, id, grammar);
        }
        throw new Error('Invalid Expression: ' + value);
    };
    Grammar.buildStringExpression = function (value, id, grammar) {
        var matchs = Grammar.stringMatch(value, Grammar.spliter);
        var expressions = _.map(matchs, function (match, i) {
            if (match[1]) {
                // Ref
                var ref = match[1];
                var occurrence = match[3] ? Number(match[3]) : match[2] || null;
                return new ExpressionRef_1.ExpressionRef(ref, occurrence, id + '_' + i, grammar);
            }
            else {
                // Constant
                return new ExpressionConstant_1.ExpressionConstant(match[4], id + '_' + i);
            }
        });
        if (expressions.length == 1) {
            var expression = expressions[0];
            expression.id = id;
            return expression;
        }
        else {
            return new ExpressionList_1.ExpressionList(expressions, id);
        }
    };
    Grammar.stringMatch = function (str, re) {
        var groups = [];
        var cloneRegExp = new RegExp(re.source, 'g');
        var group = cloneRegExp.exec(str);
        while (group !== null) {
            groups.push(group);
            group = cloneRegExp.exec(str);
        }
        return groups;
    };
    Grammar.spliter = /\[(\w+)(\*|\+|\?|\{([1-9][0-9]*)\})?\]|(.[^\[]*)/;
    return Grammar;
}());
exports.Grammar = Grammar;


/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionEndOfInput = {
    id: 'end of input',
    parse: null
};


/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(49);
var Result_2 = __webpack_require__(49);
var ExpressionConstant = /** @class */ (function () {
    function ExpressionConstant(value, id) {
        this.value = value;
        this.id = id;
    }
    ExpressionConstant.prototype.parse = function (input, end) {
        // the value must be at the start of the input
        var success = input.indexOf(this.value) == 0;
        var result = new Result_1.Result(success ? this.value : null, this, input);
        // if is successful and we require the end but the length of parsed is
        // lower than the input length, return a EndOfInputExpected Result
        if (success && end && input.length > this.value.length) {
            return new Result_2.EndOfInputResult(result);
        }
        return result;
    };
    ExpressionConstant.prototype.toString = function () {
        return this.value;
    };
    return ExpressionConstant;
}());
exports.ExpressionConstant = ExpressionConstant;


/***/ }),

/***/ 216:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(128);
var Date_1 = __webpack_require__(492);
exports.Field = {
    basicExpressions: ['FieldSimpleQuery', 'FieldQuery', 'Field'],
    grammars: {
        FieldQuery: '[Field][OptionalSpaces][FieldQueryOperation]',
        FieldQueryOperation: ['FieldQueryValue', 'FieldQueryNumeric'],
        FieldQueryValue: '[FieldOperator][OptionalSpaces][FieldValue]',
        FieldQueryNumeric: '[FieldOperatorNumeric][OptionalSpaces][FieldValueNumeric]',
        FieldSimpleQuery: '[FieldName]:[OptionalSpaces][FieldValue]',
        Field: '@[FieldName]',
        FieldName: /[a-zA-Z][a-zA-Z0-9\.\_]*/,
        FieldOperator: /==|=|<>/,
        FieldOperatorNumeric: /<=|>=|<|>/,
        FieldValue: ['DateRange', 'NumberRange', 'DateRelative', 'Date', 'Number', 'FieldValueList', 'FieldValueString'],
        FieldValueNumeric: ['DateRelative', 'Date', 'Number'],
        FieldValueString: ['DoubleQuoted', 'FieldValueNotQuoted'],
        FieldValueList: '([FieldValueString][FieldValueStringList*])',
        FieldValueStringList: '[FieldValueSeparator][FieldValueString]',
        FieldValueSeparator: / *, */,
        FieldValueNotQuoted: /[^ \(\)\[\],]+/,
        NumberRange: '[Number][Spaces?]..[Spaces?][Number]'
    },
    include: [Date_1.Date, Basic_1.Basic]
};


/***/ }),

/***/ 217:
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
var underscore_1 = __webpack_require__(0);
var OmniboxEvents_1 = __webpack_require__(33);
var Component_1 = __webpack_require__(7);
var Dom_1 = __webpack_require__(1);
var ResultPreviewsManager_1 = __webpack_require__(558);
var QueryProcessor_1 = __webpack_require__(496);
var QueryUtils_1 = __webpack_require__(21);
var Direction;
(function (Direction) {
    Direction["Up"] = "Up";
    Direction["Down"] = "Down";
    Direction["Left"] = "Left";
    Direction["Right"] = "Right";
})(Direction = exports.Direction || (exports.Direction = {}));
var SuggestionsManager = /** @class */ (function () {
    function SuggestionsManager(element, magicBoxContainer, inputManager, options) {
        var _this = this;
        this.element = element;
        this.magicBoxContainer = magicBoxContainer;
        this.inputManager = inputManager;
        this.suggestionListboxID = "coveo-magicbox-suggestions-" + QueryUtils_1.QueryUtils.createGuid();
        this.suggestionListboxClassName = "coveo-magicbox-suggestions";
        this.root = Component_1.Component.resolveRoot(element);
        this.options = underscore_1.defaults(options, {
            suggestionClass: 'magic-box-suggestion',
            selectedClass: 'magic-box-selected'
        });
        // Put in a sane default, so as to not reject every suggestions if not set on initialization
        if (this.options.timeout == undefined) {
            this.options.timeout = 500;
        }
        Dom_1.$$(this.element).on('mouseover', function (e) {
            _this.handleMouseOver(e);
        });
        Dom_1.$$(this.element).on('mouseout', function (e) {
            _this.handleMouseOut(e);
        });
        this.suggestionsProcessor = new QueryProcessor_1.QueryProcessor({ timeout: this.options.timeout });
        this.resultPreviewsManager = new ResultPreviewsManager_1.ResultPreviewsManager(element, {
            selectedClass: this.options.selectedClass,
            timeout: this.options.timeout
        });
        this.suggestionsListbox = this.buildSuggestionsContainer();
        Dom_1.$$(this.element).append(this.suggestionsListbox.el);
        this.addAccessibilityProperties();
        this.appendEmptySuggestionOption();
    }
    Object.defineProperty(SuggestionsManager.prototype, "hasSuggestions", {
        get: function () {
            return this.currentSuggestions && this.currentSuggestions.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuggestionsManager.prototype, "hasFocus", {
        get: function () {
            return Dom_1.$$(this.element).findClass(this.options.selectedClass).length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuggestionsManager.prototype, "hasPreviews", {
        get: function () {
            return this.resultPreviewsManager.hasPreviews;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuggestionsManager.prototype, "focusedSuggestion", {
        get: function () {
            var _this = this;
            return underscore_1.find(this.currentSuggestions, function (suggestion) { return suggestion.dom.classList.contains(_this.options.selectedClass); });
        },
        enumerable: true,
        configurable: true
    });
    SuggestionsManager.prototype.handleMouseOver = function (e) {
        var target = Dom_1.$$(e.target);
        var parents = target.parents(this.options.suggestionClass);
        if (target.hasClass(this.options.suggestionClass)) {
            this.processMouseSelection(target.el);
        }
        else if (parents.length > 0 && this.element.contains(parents[0])) {
            this.processMouseSelection(parents[0]);
        }
    };
    SuggestionsManager.prototype.handleMouseOut = function (e) {
        var target = Dom_1.$$(e.target);
        var targetParents = target.parents(this.options.suggestionClass);
        //e.relatedTarget is not available if moving off the browser window or is an empty object `{}` when moving out of namespace in LockerService.
        if (e.relatedTarget && Dom_1.$$(e.relatedTarget).isValid()) {
            var relatedTargetParents = Dom_1.$$(e.relatedTarget).parents(this.options.suggestionClass);
            if (target.hasClass(this.options.selectedClass) && !Dom_1.$$(e.relatedTarget).hasClass(this.options.suggestionClass)) {
                this.removeSelectedStatus(target.el);
            }
            else if (relatedTargetParents.length == 0 && targetParents.length > 0) {
                this.removeSelectedStatus(targetParents[0]);
            }
        }
        else {
            if (target.hasClass(this.options.selectedClass)) {
                this.removeSelectedStatus(target.el);
            }
            else if (targetParents.length > 0) {
                this.removeSelectedStatus(targetParents[0]);
            }
        }
        Dom_1.$$(this.root).trigger(OmniboxEvents_1.OmniboxEvents.querySuggestLoseFocus);
    };
    SuggestionsManager.prototype.moveDown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.move(Direction.Down)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SuggestionsManager.prototype.moveUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.move(Direction.Up)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SuggestionsManager.prototype.moveLeft = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.move(Direction.Left)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SuggestionsManager.prototype.moveRight = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.move(Direction.Right)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SuggestionsManager.prototype.selectAndReturnKeyboardFocusedElement = function () {
        var selected = this.keyboardFocusedElement;
        if (selected) {
            Dom_1.$$(selected).trigger('keyboardSelect');
            // By definition, once an element has been "selected" with the keyboard,
            // it is not longer "active" since the event has been processed.
            this.keyboardFocusedElement = null;
            this.inputManager.blur();
        }
        return selected;
    };
    SuggestionsManager.prototype.clearKeyboardFocusedElement = function () {
        this.keyboardFocusedElement = null;
    };
    SuggestionsManager.prototype.receiveSuggestions = function (suggestions) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, results, status;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.suggestionsProcessor.processQueries(suggestions)];
                    case 1:
                        _a = _b.sent(), results = _a.results, status = _a.status;
                        if (status === QueryProcessor_1.ProcessingStatus.Overriden) {
                            return [2 /*return*/, []];
                        }
                        this.updateSuggestions(results);
                        return [2 /*return*/, results];
                }
            });
        });
    };
    SuggestionsManager.prototype.clearSuggestions = function () {
        this.updateSuggestions([]);
    };
    SuggestionsManager.prototype.updateSuggestions = function (suggestions) {
        var _this = this;
        this.suggestionsListbox.empty();
        this.inputManager.activeDescendant = null;
        this.currentSuggestions = suggestions;
        Dom_1.$$(this.element).toggleClass('magic-box-hasSuggestion', this.hasSuggestions);
        this.inputManager.expanded = this.hasSuggestions;
        this.resultPreviewsManager.displaySearchResultPreviewsForSuggestion(null);
        if (!this.hasSuggestions) {
            this.appendEmptySuggestionOption();
            Dom_1.$$(this.root).trigger(OmniboxEvents_1.OmniboxEvents.querySuggestLoseFocus);
            return;
        }
        suggestions
            .sort(function (a, b) { return (b.index || 0) - (a.index || 0); })
            .forEach(function (suggestion) {
            var dom = suggestion.dom ? _this.modifyDomFromExistingSuggestion(suggestion.dom) : _this.createDomFromSuggestion(suggestion);
            dom.setAttribute('id', "magic-box-suggestion-" + underscore_1.indexOf(suggestions, suggestion));
            dom.setAttribute('role', 'option');
            dom.setAttribute('aria-selected', 'false');
            dom.setAttribute('aria-label', dom.text());
            dom['suggestion'] = suggestion;
            _this.suggestionsListbox.append(dom.el);
        });
        Dom_1.$$(this.root).trigger(OmniboxEvents_1.OmniboxEvents.querySuggestRendered);
    };
    Object.defineProperty(SuggestionsManager.prototype, "selectedSuggestion", {
        get: function () {
            if (this.htmlElementIsSuggestion(this.keyboardFocusedElement)) {
                return this.returnMoved(this.keyboardFocusedElement);
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    SuggestionsManager.prototype.processKeyboardSelection = function (suggestion) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.addSelectedStatus(suggestion);
                        this.keyboardFocusedElement = suggestion;
                        return [4 /*yield*/, this.updateSelectedSuggestion(this.focusedSuggestion)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SuggestionsManager.prototype.processKeyboardPreviewSelection = function (preview) {
        this.addSelectedStatus(preview);
        this.keyboardFocusedElement = preview;
    };
    SuggestionsManager.prototype.processMouseSelection = function (suggestion) {
        this.addSelectedStatus(suggestion);
        this.updateSelectedSuggestion(this.focusedSuggestion);
        this.keyboardFocusedElement = null;
    };
    SuggestionsManager.prototype.buildSuggestionsContainer = function () {
        return Dom_1.$$('div', {
            className: this.suggestionListboxClassName,
            id: this.suggestionListboxID,
            role: 'listbox',
            ariaLabel: 'Search Suggestions'
        });
    };
    SuggestionsManager.prototype.createDomFromSuggestion = function (suggestion) {
        var _this = this;
        var dom = Dom_1.$$('div', {
            className: "magic-box-suggestion " + this.options.suggestionClass
        });
        suggestion.dom = dom.el;
        dom.on('click', function () {
            _this.selectSuggestion(suggestion);
        });
        dom.on('keyboardSelect', function () {
            _this.selectSuggestion(suggestion);
        });
        if (suggestion.html) {
            dom.el.innerHTML = suggestion.html;
            return dom;
        }
        if (suggestion.text) {
            dom.text(suggestion.text);
            return dom;
        }
        if (suggestion.separator) {
            dom.addClass('magic-box-suggestion-seperator');
            var suggestionLabel = Dom_1.$$('div', {
                className: 'magic-box-suggestion-seperator-label'
            }, suggestion.separator);
            dom.append(suggestionLabel.el);
            return dom;
        }
        return dom;
    };
    SuggestionsManager.prototype.selectSuggestion = function (suggestion) {
        suggestion.onSelect();
        Dom_1.$$(this.root).trigger(OmniboxEvents_1.OmniboxEvents.querySuggestSelection, { suggestion: suggestion.text });
    };
    SuggestionsManager.prototype.appendEmptySuggestionOption = function () {
        // Accessibility tools reports that a listbox element must always have at least one child with an option
        // Even if there is no suggestions to show.
        this.suggestionsListbox.append(Dom_1.$$('div', { role: 'option' }).el);
    };
    SuggestionsManager.prototype.modifyDomFromExistingSuggestion = function (dom) {
        // this need to be done if the selection is in cache and the dom is set in the suggestion
        this.removeSelectedStatus(dom);
        var found = dom.classList.contains(this.options.suggestionClass) ? dom : Dom_1.$$(dom).find('.' + this.options.suggestionClass);
        this.removeSelectedStatus(found);
        return Dom_1.$$(dom);
    };
    SuggestionsManager.prototype.move = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            var firstPreview;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.resultPreviewsManager.focusedPreviewElement) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.moveWithinPreview(direction)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (direction === Direction.Right || direction === Direction.Left) {
                            firstPreview = this.resultPreviewsManager.previewElements[0];
                            if (firstPreview) {
                                this.processKeyboardPreviewSelection(firstPreview);
                                return [2 /*return*/];
                            }
                        }
                        return [4 /*yield*/, this.moveWithinSuggestion(direction)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SuggestionsManager.prototype.moveWithinSuggestion = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            var currentlySelected, selectables, currentIndex, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentlySelected = Dom_1.$$(this.element).find("." + this.options.selectedClass);
                        selectables = Dom_1.$$(this.element).findAll("." + this.options.suggestionClass);
                        currentIndex = underscore_1.indexOf(selectables, currentlySelected);
                        index = direction === Direction.Up ? currentIndex - 1 : currentIndex + 1;
                        index = (index + selectables.length) % selectables.length;
                        return [4 /*yield*/, this.selectQuerySuggest(selectables[index])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SuggestionsManager.prototype.selectQuerySuggest = function (suggestion) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!suggestion) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.processKeyboardSelection(suggestion)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.keyboardFocusedElement = null;
                        this.inputManager.input.removeAttribute('aria-activedescendant');
                        _a.label = 3;
                    case 3: return [2 /*return*/, suggestion];
                }
            });
        });
    };
    SuggestionsManager.prototype.moveWithinPreview = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            var newFocusedPreview;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newFocusedPreview = this.resultPreviewsManager.getElementInDirection(direction);
                        if (!!newFocusedPreview) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.selectQuerySuggest(this.resultPreviewsManager.previewsOwner.dom)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        this.processKeyboardPreviewSelection(newFocusedPreview);
                        return [2 /*return*/];
                }
            });
        });
    };
    SuggestionsManager.prototype.returnMoved = function (selected) {
        if (selected) {
            if (selected['suggestion']) {
                return selected['suggestion'];
            }
            if (selected['no-text-suggestion']) {
                return null;
            }
            if (selected instanceof HTMLElement) {
                return {
                    text: Dom_1.$$(selected).text()
                };
            }
        }
        return null;
    };
    SuggestionsManager.prototype.addSelectedStatus = function (element) {
        var selected = this.element.getElementsByClassName(this.options.selectedClass);
        for (var i = 0; i < selected.length; i++) {
            var elem = selected.item(i);
            this.removeSelectedStatus(elem);
        }
        Dom_1.$$(element).addClass(this.options.selectedClass);
        this.updateAreaSelectedIfDefined(element, 'true');
    };
    SuggestionsManager.prototype.updateSelectedSuggestion = function (suggestion) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Dom_1.$$(this.root).trigger(OmniboxEvents_1.OmniboxEvents.querySuggestGetFocus, {
                            suggestion: suggestion.text
                        });
                        return [4 /*yield*/, this.resultPreviewsManager.displaySearchResultPreviewsForSuggestion(suggestion)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SuggestionsManager.prototype.removeSelectedStatus = function (suggestion) {
        Dom_1.$$(suggestion).removeClass(this.options.selectedClass);
        this.updateAreaSelectedIfDefined(suggestion, 'false');
    };
    SuggestionsManager.prototype.updateAreaSelectedIfDefined = function (element, value) {
        if (Dom_1.$$(element).getAttribute('aria-selected')) {
            this.inputManager.activeDescendant = element;
            Dom_1.$$(element).setAttribute('aria-selected', value);
        }
    };
    SuggestionsManager.prototype.addAccessibilityProperties = function () {
        this.addAccessibilityPropertiesForMagicBox();
        this.addAccessibilityPropertiesForInput();
    };
    SuggestionsManager.prototype.addAccessibilityPropertiesForMagicBox = function () {
        var magicBox = Dom_1.$$(this.magicBoxContainer);
        magicBox.setAttribute('role', 'search');
        magicBox.setAttribute('aria-haspopup', 'listbox');
    };
    SuggestionsManager.prototype.addAccessibilityPropertiesForInput = function () {
        var input = Dom_1.$$(this.inputManager.input);
        this.inputManager.activeDescendant = null;
        this.inputManager.expanded = false;
        input.setAttribute('aria-owns', this.suggestionListboxID);
        input.setAttribute('aria-controls', this.suggestionListboxID);
    };
    SuggestionsManager.prototype.htmlElementIsSuggestion = function (selected) {
        var omniboxSelectables = Dom_1.$$(this.element).findAll("." + this.options.suggestionClass);
        return underscore_1.indexOf(omniboxSelectables, selected) > -1;
    };
    return SuggestionsManager;
}());
exports.SuggestionsManager = SuggestionsManager;


/***/ }),

/***/ 218:
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
var underscore_1 = __webpack_require__(0);
var Core_1 = __webpack_require__(20);
var Dom_1 = __webpack_require__(1);
var doMagicBoxExport_1 = __webpack_require__(556);
var InputManager_1 = __webpack_require__(495);
var MagicBoxClear_1 = __webpack_require__(559);
var SuggestionsManager_1 = __webpack_require__(217);
var MagicBoxInstance = /** @class */ (function () {
    function MagicBoxInstance(element, grammar, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.element = element;
        this.grammar = grammar;
        this.options = options;
        this.lastSuggestions = [];
        if (underscore_1.isUndefined(this.options.inline)) {
            this.options.inline = false;
        }
        Dom_1.$$(element).addClass('magic-box');
        if (this.options.inline) {
            Dom_1.$$(element).addClass('magic-box-inline');
        }
        this.result = this.grammar.parse('');
        this.displayedResult = this.result.clean();
        var inputContainer = Dom_1.$$(element).find('.magic-box-input');
        if (!inputContainer) {
            inputContainer = document.createElement('div');
            inputContainer.className = 'magic-box-input';
            element.appendChild(inputContainer);
        }
        this.inputManager = new InputManager_1.InputManager(inputContainer, function (text, wordCompletion) {
            if (!wordCompletion) {
                _this.setText(text);
                _this.addSuggestions();
                _this.onchange && _this.onchange();
            }
            else {
                _this.setText(text);
                _this.onselect && _this.onselect(_this.firstSuggestionWithText);
            }
        }, this);
        this.inputManager.ontabpress = function () {
            _this.ontabpress && _this.ontabpress();
        };
        var existingValue = this.inputManager.getValue();
        if (existingValue) {
            this.displayedResult.input = existingValue;
        }
        this.inputManager.setResult(this.displayedResult);
        var suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'magic-box-suggestions';
        this.element.appendChild(suggestionsContainer);
        this.suggestionsManager = new SuggestionsManager_1.SuggestionsManager(suggestionsContainer, this.element, this.inputManager, {
            suggestionClass: this.options.selectableSuggestionClass,
            selectedClass: this.options.selectedSuggestionClass,
            timeout: this.options.suggestionTimeout
        });
        this.magicBoxClear = new MagicBoxClear_1.MagicBoxClear(this);
        this.setupHandler();
    }
    Object.defineProperty(MagicBoxInstance.prototype, "firstSuggestionWithText", {
        get: function () {
            return underscore_1.find(this.lastSuggestions, function (suggestion) { return suggestion.text; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MagicBoxInstance.prototype, "firstSuggestionText", {
        get: function () {
            var firstSuggestionWithText = this.firstSuggestionWithText;
            return firstSuggestionWithText ? firstSuggestionWithText.text : '';
        },
        enumerable: true,
        configurable: true
    });
    MagicBoxInstance.prototype.getResult = function () {
        return this.result;
    };
    MagicBoxInstance.prototype.getDisplayedResult = function () {
        return this.displayedResult;
    };
    MagicBoxInstance.prototype.setText = function (text) {
        Dom_1.$$(this.element).toggleClass('magic-box-notEmpty', text.length > 0);
        this.magicBoxClear.toggleTabindexAndAriaHidden(text.length > 0);
        this.result = this.grammar.parse(text);
        this.displayedResult = this.result.clean();
        this.inputManager.setResult(this.displayedResult);
    };
    MagicBoxInstance.prototype.setCursor = function (index) {
        this.inputManager.setCursor(index);
    };
    MagicBoxInstance.prototype.getCursor = function () {
        return this.inputManager.getCursor();
    };
    MagicBoxInstance.prototype.resultAtCursor = function (match) {
        return this.displayedResult.resultAt(this.getCursor(), match);
    };
    MagicBoxInstance.prototype.setupHandler = function () {
        var _this = this;
        this.inputManager.onblur = function () {
            Dom_1.$$(_this.element).removeClass('magic-box-hasFocus');
            _this.onblur && _this.onblur();
            if (!_this.options.inline) {
                _this.clearSuggestion();
            }
        };
        this.inputManager.onfocus = function () {
            Dom_1.$$(_this.element).addClass('magic-box-hasFocus');
            _this.addSuggestions();
            _this.onfocus && _this.onfocus();
        };
        this.inputManager.onkeydown = function (key) {
            if (_this.shouldMoveInSuggestions(key)) {
                return false;
            }
            if (key === Core_1.KEYBOARD.ENTER) {
                var suggestion = _this.suggestionsManager.selectAndReturnKeyboardFocusedElement();
                if (suggestion == null) {
                    _this.onsubmit && _this.onsubmit();
                }
                return false;
            }
            else if (key === Core_1.KEYBOARD.ESCAPE) {
                _this.clearSuggestion();
                _this.blur();
            }
            else {
                _this.suggestionsManager.clearKeyboardFocusedElement();
            }
            return true;
        };
        this.inputManager.onchangecursor = function () {
            _this.addSuggestions();
        };
        this.inputManager.onkeyup = function (key) {
            _this.onmove && _this.onmove();
            if (!_this.shouldMoveInSuggestions(key)) {
                return true;
            }
            switch (key) {
                case Core_1.KEYBOARD.UP_ARROW:
                    _this.suggestionsManager.moveUp();
                    break;
                case Core_1.KEYBOARD.DOWN_ARROW:
                    _this.suggestionsManager.moveDown();
                    break;
                case Core_1.KEYBOARD.LEFT_ARROW:
                    _this.suggestionsManager.moveLeft();
                    break;
                case Core_1.KEYBOARD.RIGHT_ARROW:
                    _this.suggestionsManager.moveRight();
                    break;
            }
            if (_this.suggestionsManager.selectedSuggestion) {
                _this.focusOnSuggestion(_this.suggestionsManager.selectedSuggestion);
            }
            _this.onchange && _this.onchange();
            return false;
        };
    };
    MagicBoxInstance.prototype.addSuggestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var suggestions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.suggestionsManager.receiveSuggestions(this.getSuggestions != null ? this.getSuggestions() : [])];
                    case 1:
                        suggestions = _a.sent();
                        this.addSelectEventHandlers(suggestions);
                        this.inputManager.setWordCompletion(this.firstSuggestionText);
                        this.onSuggestions(suggestions);
                        return [2 /*return*/];
                }
            });
        });
    };
    MagicBoxInstance.prototype.shouldMoveInSuggestions = function (key) {
        switch (key) {
            case Core_1.KEYBOARD.UP_ARROW:
            case Core_1.KEYBOARD.DOWN_ARROW:
                return true;
            case Core_1.KEYBOARD.LEFT_ARROW:
            case Core_1.KEYBOARD.RIGHT_ARROW:
                if (this.suggestionsManager.hasFocus && this.suggestionsManager.hasPreviews) {
                    return true;
                }
        }
        return false;
    };
    MagicBoxInstance.prototype.addSelectEventHandlers = function (suggestions) {
        var _this = this;
        underscore_1.each(suggestions, function (suggestion) {
            if (suggestion.onSelect == null && suggestion.text != null) {
                suggestion.onSelect = function () {
                    _this.setText(suggestion.text);
                    _this.onselect && _this.onselect(suggestion);
                };
            }
        });
    };
    MagicBoxInstance.prototype.focus = function () {
        Dom_1.$$(this.element).addClass('magic-box-hasFocus');
        this.inputManager.focus();
    };
    MagicBoxInstance.prototype.blur = function () {
        this.inputManager.blur();
    };
    MagicBoxInstance.prototype.clearSuggestion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.inputManager.setWordCompletion(null);
                this.suggestionsManager.clearSuggestions();
                this.onSuggestions([]);
                return [2 /*return*/];
            });
        });
    };
    MagicBoxInstance.prototype.focusOnSuggestion = function (suggestion) {
        if (suggestion == null || suggestion.text == null) {
            this.inputManager.setResult(this.displayedResult, this.firstSuggestionText);
        }
        else {
            this.inputManager.setResult(this.grammar.parse(suggestion.text).clean(), suggestion.text);
        }
    };
    MagicBoxInstance.prototype.getText = function () {
        return this.inputManager.getValue();
    };
    MagicBoxInstance.prototype.getWordCompletion = function () {
        return this.inputManager.getWordCompletion();
    };
    MagicBoxInstance.prototype.clear = function () {
        this.setText('');
        this.clearSuggestion();
        this.focus();
        this.onclear && this.onclear();
    };
    MagicBoxInstance.prototype.hasSuggestions = function () {
        return this.suggestionsManager.hasSuggestions;
    };
    return MagicBoxInstance;
}());
exports.MagicBoxInstance = MagicBoxInstance;
function createMagicBox(element, grammar, options) {
    return new MagicBoxInstance(element, grammar, options);
}
exports.createMagicBox = createMagicBox;
function requestAnimationFrame(callback) {
    if ('requestAnimationFrame' in window) {
        return window.requestAnimationFrame(callback);
    }
    return setTimeout(callback);
}
exports.requestAnimationFrame = requestAnimationFrame;
doMagicBoxExport_1.doMagicBoxExport();


/***/ }),

/***/ 219:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var MagicBoxUtils = /** @class */ (function () {
    function MagicBoxUtils() {
    }
    MagicBoxUtils.escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    };
    MagicBoxUtils.highlightText = function (text, highligth, ignoreCase, matchClass, doNotMatchClass) {
        var _this = this;
        if (ignoreCase === void 0) { ignoreCase = false; }
        if (matchClass === void 0) { matchClass = 'magic-box-hightlight'; }
        if (doNotMatchClass === void 0) { doNotMatchClass = ''; }
        if (highligth.length == 0) {
            return text;
        }
        var escaped = this.escapeRegExp(highligth);
        var stringRegex = '(' + escaped + ')|(.*?(?=' + escaped + ')|.+)';
        var regex = new RegExp(stringRegex, ignoreCase ? 'gi' : 'g');
        return text.replace(regex, function (text, match, notmatch) { return _this.escapeText(match != null ? matchClass : doNotMatchClass, text); });
    };
    MagicBoxUtils.escapeText = function (classname, text) {
        return "<span class=\"" + classname + "\">" + _.escape(text) + "</span>";
    };
    return MagicBoxUtils;
}());
exports.MagicBoxUtils = MagicBoxUtils;


/***/ }),

/***/ 484:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(49);
var RefResult_1 = __webpack_require__(485);
var ExpressionEndOfInput_1 = __webpack_require__(214);
var _ = __webpack_require__(0);
var ExpressionRef = /** @class */ (function () {
    function ExpressionRef(ref, occurrence, id, grammar) {
        this.ref = ref;
        this.occurrence = occurrence;
        this.id = id;
        this.grammar = grammar;
    }
    ExpressionRef.prototype.parse = function (input, end) {
        var ref = this.grammar.getExpression(this.ref);
        if (ref == null) {
            throw new Error('Expression not found:' + this.ref);
        }
        if (this.occurrence == '?' || this.occurrence == null) {
            return this.parseOnce(input, end, ref);
        }
        else {
            return this.parseMany(input, end, ref);
        }
    };
    ExpressionRef.prototype.parseOnce = function (input, end, ref) {
        var refResult = ref.parse(input, end);
        var success = refResult.isSuccess();
        if (!success && this.occurrence == '?') {
            if (end) {
                // if end was found
                if (input.length == 0) {
                    return new RefResult_1.RefResult([], this, input, refResult);
                }
                // if end was not found and all error expression are EndOfInput, reparse with end = false.
                if (_.all(refResult.getBestExpect(), function (expect) { return expect.expression == ExpressionEndOfInput_1.ExpressionEndOfInput; })) {
                    return new RefResult_1.RefResult([new Result_1.Result(null, ExpressionEndOfInput_1.ExpressionEndOfInput, input)], this, input, refResult);
                }
                return refResult;
            }
            // the ref is not required and it do not need to end the input
            return new RefResult_1.RefResult([], this, input, null);
        }
        return new RefResult_1.RefResult([refResult], this, input, success ? null : refResult);
    };
    ExpressionRef.prototype.parseMany = function (input, end, ref) {
        var subResults = [];
        var subResult;
        var subInput = input;
        var success;
        // try to parse until it do not match, do not manage the end yet
        do {
            subResult = ref.parse(subInput, false);
            success = subResult.isSuccess();
            if (success) {
                subResults.push(subResult);
                subInput = subInput.substr(subResult.getLength());
            }
        } while (success && subResult.input != subInput);
        // minimal occurance of a ref
        var requiredOccurance = _.isNumber(this.occurrence) ? this.occurrence : this.occurrence == '+' ? 1 : 0;
        // if the minimal occurance is not reached add the fail result to the list
        if (subResults.length < requiredOccurance) {
            subResults.push(subResult);
        }
        else if (end) {
            // if there is at least one match, check if the last match is at the end
            if (subResults.length > 0) {
                var last = _.last(subResults);
                subResult = ref.parse(last.input, true);
                if (subResult.isSuccess()) {
                    // if successful, replace the last subResult by the one with end
                    subResults[subResults.length - 1] = subResult;
                }
                else {
                    // if not successful, we keep the last successful result and we add a endOfInputExpected Result after it
                    subResults.push(new Result_1.Result(null, ExpressionEndOfInput_1.ExpressionEndOfInput, last.input.substr(last.getLength())));
                    // we parse back the last with the length of the successful Result (at the same place we put the endOfInputExpected) and put it in failAttempt
                    subResult = ref.parse(last.input.substr(last.getLength()), true);
                }
            }
            else if (input.length != 0) {
                // if there is no result at all and we are not at the end, return a endOfInputExpected Result
                var endOfInput = new Result_1.Result(null, ExpressionEndOfInput_1.ExpressionEndOfInput, input);
                return new RefResult_1.RefResult([endOfInput], this, input, subResult);
            }
        }
        return new RefResult_1.RefResult(subResults, this, input, subResult);
    };
    ExpressionRef.prototype.toString = function () {
        return this.id;
    };
    return ExpressionRef;
}());
exports.ExpressionRef = ExpressionRef;


/***/ }),

/***/ 485:
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
var Result_1 = __webpack_require__(49);
var _ = __webpack_require__(0);
var RefResult = /** @class */ (function (_super) {
    __extends(RefResult, _super);
    function RefResult(results, expression, input, lastResult) {
        var _this = _super.call(this, results, expression, input) || this;
        _this.expression = expression;
        _this.input = input;
        if (_.last(results) != lastResult) {
            _this.failAttempt = lastResult;
            if (_this.failAttempt != null) {
                _this.failAttempt.parent = _this;
            }
        }
        return _this;
    }
    /**
     * Return all fail result.
     */
    RefResult.prototype.getExpect = function () {
        var expect = _super.prototype.getExpect.call(this);
        // add the failAttempt to the expect
        if (this.failAttempt != null) {
            return expect.concat(this.failAttempt.getExpect());
        }
        return expect;
    };
    /**
     * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
     */
    RefResult.prototype.clean = function (path) {
        // if there is no failAttempt, we will use the default clean
        if (this.failAttempt != null && (path != null || !this.isSuccess())) {
            path = path || _.last(this.getBestExpect()).path(this);
            var next = _.first(path);
            // if the next is in the subResults, not the failAttempt, do the default clean;
            if (next != null && next == this.failAttempt) {
                var last = _.last(this.subResults);
                // if the last is not successful, remove it because we want the failAttempt path
                var subResults = _.map(last != null && last.isSuccess() ? this.subResults : _.initial(this.subResults), function (subResult) {
                    return subResult.clean();
                });
                subResults.push(next.clean(_.rest(path)));
                return new Result_1.Result(subResults, this.expression, this.input);
            }
        }
        return _super.prototype.clean.call(this, path);
    };
    return RefResult;
}(Result_1.Result));
exports.RefResult = RefResult;


/***/ }),

/***/ 486:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OptionResult_1 = __webpack_require__(487);
var ExpressionOptions = /** @class */ (function () {
    function ExpressionOptions(parts, id) {
        this.parts = parts;
        this.id = id;
    }
    ExpressionOptions.prototype.parse = function (input, end) {
        var failAttempt = [];
        for (var i = 0; i < this.parts.length; i++) {
            var subResult = this.parts[i].parse(input, end);
            if (subResult.isSuccess()) {
                return new OptionResult_1.OptionResult(subResult, this, input, failAttempt);
            }
            failAttempt.push(subResult);
        }
        return new OptionResult_1.OptionResult(null, this, input, failAttempt);
    };
    ExpressionOptions.prototype.toString = function () {
        return this.id;
    };
    return ExpressionOptions;
}());
exports.ExpressionOptions = ExpressionOptions;


/***/ }),

/***/ 487:
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
var Result_1 = __webpack_require__(49);
var _ = __webpack_require__(0);
var OptionResult = /** @class */ (function (_super) {
    __extends(OptionResult, _super);
    function OptionResult(result, expression, input, failAttempt) {
        var _this = _super.call(this, result != null ? [result] : null, expression, input) || this;
        _this.result = result;
        _this.expression = expression;
        _this.input = input;
        _this.failAttempt = failAttempt;
        _.forEach(_this.failAttempt, function (subResult) {
            subResult.parent = _this;
        });
        return _this;
    }
    /**
     * Return all fail result.
     */
    OptionResult.prototype.getExpect = function () {
        var _this = this;
        var expect = [];
        if (this.result != null) {
            expect = this.result.getExpect();
        }
        expect = _.reduce(this.failAttempt, function (expect, result) { return expect.concat(result.getExpect()); }, expect);
        if (expect.length > 0 && _.all(expect, function (result) { return result.input == _this.input; })) {
            return [this];
        }
        return expect;
    };
    /**
     * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
     */
    OptionResult.prototype.clean = function (path) {
        if (path != null || !this.isSuccess()) {
            // Result will be a ref. We skip it for cleaner tree.
            path = _.rest(path || _.last(this.getBestExpect()).path(this));
            // next can be Result or one of the failAttempt. In both case we have only one child
            var next = _.first(path);
            if (next == null) {
                return new Result_1.Result(null, this.expression, this.input);
            }
            return new Result_1.Result([next.clean(_.rest(path))], this.expression, this.input);
        }
        // Result will be a ref. We skip it for cleaner tree.
        return new Result_1.Result(_.map(this.result.subResults, function (subResult) { return subResult.clean(); }), this.expression, this.input);
    };
    return OptionResult;
}(Result_1.Result));
exports.OptionResult = OptionResult;


/***/ }),

/***/ 488:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(49);
var Result_2 = __webpack_require__(49);
var ExpressionRegExp = /** @class */ (function () {
    function ExpressionRegExp(value, id, grammar) {
        this.value = value;
        this.id = id;
    }
    ExpressionRegExp.prototype.parse = function (input, end) {
        var groups = input.match(this.value);
        // if the RegExp do not match at the start, ignore it
        if (groups != null && groups.index != 0) {
            groups = null;
        }
        var result = new Result_1.Result(groups != null ? groups[0] : null, this, input);
        // if is successful and we require the end but the length of parsed is
        // lower than the input length, return a EndOfInputExpected Result
        if (result.isSuccess() && end && input.length > result.value.length) {
            return new Result_2.EndOfInputResult(result);
        }
        return result;
    };
    ExpressionRegExp.prototype.toString = function () {
        return this.id;
    };
    return ExpressionRegExp;
}());
exports.ExpressionRegExp = ExpressionRegExp;


/***/ }),

/***/ 489:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionFunction = /** @class */ (function () {
    function ExpressionFunction(func, id, grammar) {
        this.func = func;
        this.id = id;
        this.grammar = grammar;
    }
    ExpressionFunction.prototype.parse = function (input, end) {
        return this.func(input, end, this);
    };
    ExpressionFunction.prototype.toString = function () {
        return this.id;
    };
    return ExpressionFunction;
}());
exports.ExpressionFunction = ExpressionFunction;


/***/ }),

/***/ 49:
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
var ExpressionEndOfInput_1 = __webpack_require__(214);
var ExpressionConstant_1 = __webpack_require__(215);
var _ = __webpack_require__(0);
var Result = /** @class */ (function () {
    function Result(value, expression, input) {
        var _this = this;
        this.expression = expression;
        this.input = input;
        if (_.isString(value)) {
            this.value = value;
        }
        else if (_.isArray(value)) {
            this.subResults = value;
            _.forEach(this.subResults, function (subResult) {
                subResult.parent = _this;
            });
        }
    }
    Result.prototype.isSuccess = function () {
        // if null is the value, this mean the expression could not parse this input
        return this.value != null || (this.subResults != null && _.all(this.subResults, function (subResult) { return subResult.isSuccess(); }));
    };
    /**
     * Return path to this result ([parent.parent, parent, this])
     */
    Result.prototype.path = function (until) {
        var path = this.parent != null && this.parent != until ? this.parent.path(until) : [];
        path.push(this);
        return path;
    };
    /**
     * Return the closest parent that match the condition (can be it-self). If match is a string, it will search for the result expresion id
     */
    Result.prototype.findParent = function (match) {
        var parent = this;
        var iterator = _.isString(match) ? function (result) { return match == result.expression.id; } : match;
        while (parent != null && !iterator(parent)) {
            parent = parent.parent;
        }
        return parent;
    };
    /**
     * Return the first child that match the condition (can be it-self). If match is a string, it will search for the result expresion id
     */
    Result.prototype.find = function (match) {
        var iterator = _.isString(match) ? function (result) { return match == result.expression.id; } : match;
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
    };
    /**
     * Return all children that match the condition (can be it-self). If match is a string, it will search for the result expresion id
     */
    Result.prototype.findAll = function (match) {
        var results = [];
        var iterator = _.isString(match) ? function (result) { return match == result.expression.id; } : match;
        if (iterator(this)) {
            results.push(this);
        }
        if (this.subResults) {
            results = _.reduce(this.subResults, function (results, subResult) { return results.concat(subResult.findAll(iterator)); }, results);
        }
        return results;
    };
    /**
     * Return the first child that match the condition (can be it-self). If match is a string, it will search for the result expresion id
     */
    Result.prototype.resultAt = function (index, match) {
        if (index < 0 || index > this.getLength()) {
            return [];
        }
        if (match != null) {
            if (_.isString(match)) {
                if (match == this.expression.id) {
                    return [this];
                }
            }
            else {
                if (match(this)) {
                    return [this];
                }
            }
        }
        else {
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
    };
    /**
     * Return all fail result.
     */
    Result.prototype.getExpect = function () {
        if (this.value == null && this.subResults == null) {
            return [this];
        }
        if (this.subResults != null) {
            return _.reduce(this.subResults, function (expect, result) { return expect.concat(result.getExpect()); }, []);
        }
        return [];
    };
    /**
     * Return the best fail result (The farthest result who got parsed). We also remove duplicate and always return the simplest result of a kind
     */
    Result.prototype.getBestExpect = function () {
        var expects = this.getExpect();
        var groups = _.groupBy(expects, function (expect) { return expect.input; });
        var key = _.last(_.keys(groups).sort(function (a, b) {
            return b.length - a.length;
        }));
        var bestResults = groups[key];
        var groups = _.groupBy(bestResults, function (expect) { return expect.expression.id; });
        return _.map(groups, function (bestResults) {
            return _.chain(bestResults)
                .map(function (result) {
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
    };
    Result.prototype.getHumanReadableExpect = function () {
        var expect = this.getBestExpect();
        var input = expect.length > 0 ? _.last(expect).input : '';
        return ('Expected ' +
            _.map(expect, function (result) { return result.getHumanReadable(); }).join(' or ') +
            ' but ' +
            (input.length > 0 ? JSON.stringify(input[0]) : 'end of input') +
            ' found.');
    };
    /**
     * Return a string that represent what is before this result
     */
    Result.prototype.before = function () {
        if (this.parent == null) {
            return '';
        }
        var index = _.indexOf(this.parent.subResults, this);
        return (this.parent.before() +
            _.chain(this.parent.subResults)
                .first(index)
                .map(function (subResult) { return subResult.toString(); })
                .join('')
                .value());
    };
    /**
     * Return a string that represent what is after this result
     */
    Result.prototype.after = function () {
        if (this.parent == null) {
            return '';
        }
        var index = _.indexOf(this.parent.subResults, this);
        return (_.chain(this.parent.subResults)
            .last(this.parent.subResults.length - index - 1)
            .map(function (subResult) { return subResult.toString(); })
            .join('')
            .value() + this.parent.after());
    };
    /**
     * Return the length of the result
     */
    Result.prototype.getLength = function () {
        if (this.value != null) {
            return this.value.length;
        }
        if (this.subResults != null) {
            return _.reduce(this.subResults, function (length, subResult) { return length + subResult.getLength(); }, 0);
        }
        return this.input.length;
    };
    Result.prototype.toHtmlElement = function () {
        var element = document.createElement('span');
        var id = this.expression != null ? this.expression.id : null;
        if (id != null) {
            element.setAttribute('data-id', id);
        }
        element.setAttribute('data-success', this.isSuccess().toString());
        if (this.value != null) {
            element.appendChild(document.createTextNode(this.value));
            element.setAttribute('data-value', this.value);
        }
        else if (this.subResults != null) {
            _.each(this.subResults, function (subResult) {
                element.appendChild(subResult.toHtmlElement());
            });
        }
        else {
            element.appendChild(document.createTextNode(this.input));
            element.setAttribute('data-input', this.input);
            element.className = 'magic-box-error' + (this.input.length > 0 ? '' : ' magic-box-error-empty');
        }
        element['result'] = this;
        return element;
    };
    /**
     * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
     */
    Result.prototype.clean = function (path) {
        if (path != null || !this.isSuccess()) {
            path = path || _.last(this.getBestExpect()).path(this);
            var next = _.first(path);
            if (next != null) {
                var nextIndex = _.indexOf(this.subResults, next);
                var subResults = nextIndex == -1 ? [] : _.map(_.first(this.subResults, nextIndex), function (subResult) { return subResult.clean(); });
                subResults.push(next.clean(_.rest(path)));
                return new Result(subResults, this.expression, this.input);
            }
            else {
                return new Result(null, this.expression, this.input);
            }
        }
        if (this.value != null) {
            return new Result(this.value, this.expression, this.input);
        }
        if (this.subResults != null) {
            return new Result(_.map(this.subResults, function (subResult) { return subResult.clean(); }), this.expression, this.input);
        }
    };
    Result.prototype.clone = function () {
        if (this.value != null) {
            return new Result(this.value, this.expression, this.input);
        }
        if (this.subResults != null) {
            return new Result(_.map(this.subResults, function (subResult) { return subResult.clone(); }), this.expression, this.input);
        }
        return new Result(null, this.expression, this.input);
    };
    Result.prototype.toString = function () {
        if (this.value != null) {
            return this.value;
        }
        if (this.subResults != null) {
            return _.map(this.subResults, function (subresult) { return subresult.toString(); }).join('');
        }
        return this.input;
    };
    Result.prototype.getHumanReadable = function () {
        if (this.expression instanceof ExpressionConstant_1.ExpressionConstant) {
            return JSON.stringify(this.expression.value);
        }
        return this.expression.id;
    };
    return Result;
}());
exports.Result = Result;
var EndOfInputResult = /** @class */ (function (_super) {
    __extends(EndOfInputResult, _super);
    function EndOfInputResult(result) {
        var _this = _super.call(this, [result], ExpressionEndOfInput_1.ExpressionEndOfInput, result.input) || this;
        var endOfInput = new Result(null, ExpressionEndOfInput_1.ExpressionEndOfInput, result.input.substr(result.getLength()));
        endOfInput.parent = _this;
        _this.subResults.push(endOfInput);
        return _this;
    }
    return EndOfInputResult;
}(Result));
exports.EndOfInputResult = EndOfInputResult;


/***/ }),

/***/ 490:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(49);
var ExpressionList = /** @class */ (function () {
    function ExpressionList(parts, id) {
        this.parts = parts;
        this.id = id;
        if (parts.length == 0) {
            throw new Error(JSON.stringify(id) + ' should have at least 1 parts');
        }
    }
    ExpressionList.prototype.parse = function (input, end) {
        var subResults = [];
        var subResult;
        var subInput = input;
        for (var i = 0; i < this.parts.length; i++) {
            var part = this.parts[i];
            subResult = part.parse(subInput, end && i == this.parts.length - 1);
            subResults.push(subResult);
            // if the subResult do not succeed, stop the parsing
            if (!subResult.isSuccess()) {
                break;
            }
            else {
                subInput = subInput.substr(subResult.getLength());
            }
        }
        return new Result_1.Result(subResults, this, input);
    };
    ExpressionList.prototype.toString = function () {
        return this.id;
    };
    return ExpressionList;
}());
exports.ExpressionList = ExpressionList;


/***/ }),

/***/ 491:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = __webpack_require__(216);
exports.NestedQuery = {
    basicExpressions: ['NestedQuery'],
    grammars: {
        NestedQuery: '[[NestedField][OptionalSpaces][Expressions]]',
        NestedField: '[[Field]]',
        FieldValue: ['NestedQuery']
    },
    include: [Field_1.Field]
};


/***/ }),

/***/ 492:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(128);
exports.Date = {
    grammars: {
        Date: '[DateYear]/[DateMonth]/[DateDay]',
        DateYear: /([0-9]{4})/,
        DateMonth: /(1[0-2]|0?[1-9])/,
        DateDay: /([1-2][0-9]|3[0-1]|0?[1-9])/,
        DateRange: '[Date][Spaces?]..[Spaces?][Date]',
        DateRelative: ['DateRelativeNegative', 'DateRelativeTerm'],
        DateRelativeTerm: /now|today|yesterday/,
        DateRelativeNegative: '[DateRelativeTerm][DateRelativeNegativeRef]',
        DateRelativeNegativeRef: /([\-\+][0-9]+(s|m|h|d|mo|y))/
    },
    include: [Basic_1.Basic]
};


/***/ }),

/***/ 493:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(128);
exports.QueryExtension = {
    basicExpressions: ['QueryExtension'],
    grammars: {
        QueryExtension: '$[QueryExtensionName]([QueryExtensionArguments])',
        QueryExtensionName: /\w+/,
        QueryExtensionArguments: '[QueryExtensionArgumentList*][QueryExtensionArgument]',
        QueryExtensionArgumentList: '[QueryExtensionArgument][Spaces?],[Spaces?]',
        QueryExtensionArgument: '[QueryExtensionArgumentName]:[Spaces?][QueryExtensionArgumentValue]',
        QueryExtensionArgumentName: /\w+/,
        QueryExtensionArgumentValue: ['SingleQuoted', 'Expressions']
    },
    include: [Basic_1.Basic]
};


/***/ }),

/***/ 494:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SubExpression = {
    basicExpressions: ['SubExpression'],
    grammars: {
        SubExpression: '([Expressions])'
    }
};


/***/ }),

/***/ 495:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var Core_1 = __webpack_require__(20);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(25);
var InputManager = /** @class */ (function () {
    function InputManager(element, onchange, magicBox) {
        this.onchange = onchange;
        this.magicBox = magicBox;
        this.hasFocus = false;
        this.root = Core_1.Component.resolveRoot(element);
        this.underlay = document.createElement('div');
        this.underlay.className = 'magic-box-underlay';
        this.highlightContainer = document.createElement('span');
        this.highlightContainer.className = 'magic-box-highlight-container';
        this.underlay.appendChild(this.highlightContainer);
        this.ghostTextContainer = document.createElement('span');
        this.ghostTextContainer.className = 'magic-box-ghost-text';
        this.underlay.appendChild(this.ghostTextContainer);
        this.input = Dom_1.$$(element).find('input');
        if (!this.input) {
            this.input = document.createElement('input');
            element.appendChild(this.underlay);
            element.appendChild(this.input);
        }
        else {
            element.insertBefore(this.underlay, this.input);
        }
        this.setupHandler();
        this.addAccessibilitiesProperties();
    }
    Object.defineProperty(InputManager.prototype, "expanded", {
        set: function (isExpanded) {
            this.input.setAttribute('aria-expanded', isExpanded.toString());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "activeDescendant", {
        set: function (element) {
            if (element) {
                this.input.setAttribute('aria-activedescendant', element.id);
            }
            else {
                this.input.removeAttribute('aria-activedescendant');
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Update the input with the result value
     */
    InputManager.prototype.updateInput = function () {
        if (this.input.value != this.result.input) {
            this.input.value = this.result.input;
            if (this.hasFocus) {
                this.setCursor(this.getValue().length);
            }
        }
    };
    /**
     * Update the highlight with the result value
     */
    InputManager.prototype.updateHighlight = function () {
        Dom_1.$$(this.highlightContainer).empty();
        this.highlightContainer.appendChild(this.result.toHtmlElement());
    };
    /**
     * Update the ghostText with the wordCompletion
     */
    InputManager.prototype.updateWordCompletion = function () {
        Dom_1.$$(this.ghostTextContainer).empty();
        this.ghostTextContainer.innerHTML = '';
        if (this.wordCompletion != null) {
            this.ghostTextContainer.appendChild(document.createTextNode(this.wordCompletion.substr(this.result.input.length)));
        }
    };
    /**
     * Set the result and update visual if needed
     */
    InputManager.prototype.setResult = function (result, wordCompletion) {
        this.result = result;
        this.updateInput();
        this.updateHighlight();
        // reuse last wordCompletion for a better visual
        if (_.isUndefined(wordCompletion) && this.wordCompletion != null && this.wordCompletion.indexOf(this.result.input) == 0) {
            this.updateWordCompletion();
        }
        else {
            this.setWordCompletion(wordCompletion);
        }
        this.updateScroll();
    };
    /**
     * Set the word completion. will be ignore if the word completion do not start with the result input
     */
    InputManager.prototype.setWordCompletion = function (wordCompletion) {
        if (wordCompletion != null && wordCompletion.toLowerCase().indexOf(this.result.input.toLowerCase()) != 0) {
            wordCompletion = null;
        }
        this.wordCompletion = wordCompletion;
        this.updateWordCompletion();
        this.updateScroll();
    };
    /**
     * Set cursor position
     */
    InputManager.prototype.setCursor = function (index) {
        this.input.focus();
        if (this.input.createTextRange) {
            var range = this.input.createTextRange();
            range.move('character', index);
            range.select();
        }
        else if (this.input.selectionStart != null) {
            this.input.focus();
            this.input.setSelectionRange(index, index);
        }
    };
    InputManager.prototype.getCursor = function () {
        return this.input.selectionStart;
    };
    InputManager.prototype.updateScroll = function (defer) {
        var _this = this;
        if (defer === void 0) { defer = true; }
        var callback = function () {
            // this is the cheapest call we can do before update scroll
            if (_this.underlay.clientWidth < _this.underlay.scrollWidth) {
                _this.underlay.style.visibility = 'hidden';
                _this.underlay.scrollLeft = _this.input.scrollLeft;
                _this.underlay.scrollTop = _this.input.scrollTop;
                _this.underlay.style.visibility = 'visible';
            }
            _this.updateScrollDefer = null;
            // one day we will have to remove this
            if (_this.hasFocus) {
                _this.updateScroll();
            }
        };
        // sometime we want it to be updated as soon as posible to have no flickering
        if (!defer) {
            callback();
        }
        else if (this.updateScrollDefer == null) {
            this.updateScrollDefer = requestAnimationFrame(callback);
        }
    };
    InputManager.prototype.setupHandler = function () {
        var _this = this;
        this.input.onblur = function () {
            _this.hasFocus = false;
            setTimeout(function () {
                if (!_this.hasFocus) {
                    _this.onblur && _this.onblur();
                }
            }, 300);
            _this.updateScroll();
        };
        this.input.onfocus = function () {
            if (!_this.hasFocus) {
                _this.hasFocus = true;
                _this.updateScroll();
                _this.onfocus && _this.onfocus();
            }
        };
        this.input.onkeydown = function (e) {
            _this.keydown(e);
        };
        this.input.onkeyup = function (e) {
            _this.keyup(e);
        };
        this.input.oncut = function () {
            setTimeout(function () {
                _this.onInputChange();
            });
        };
        this.input.onpaste = function () {
            setTimeout(function () {
                _this.onInputChange();
            });
        };
    };
    InputManager.prototype.addAccessibilitiesProperties = function () {
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('role', 'combobox');
        this.input.setAttribute('form', 'coveo-dummy-form');
        this.input.setAttribute('aria-autocomplete', 'list');
        this.input.setAttribute('title', Strings_1.l('InsertAQuery') + ". " + Strings_1.l('PressEnterToSend'));
    };
    InputManager.prototype.focus = function () {
        var _this = this;
        // neet a timeout for IE8-9
        setTimeout(function () {
            _this.input.focus();
            _this.setCursor(_this.getValue().length);
        });
    };
    InputManager.prototype.blur = function () {
        if (this.hasFocus) {
            this.input.blur();
        }
    };
    InputManager.prototype.keydown = function (e) {
        var _this = this;
        switch (e.keyCode || e.which) {
            case KeyboardUtils_1.KEYBOARD.TAB:
                // Take care of not "preventing" the default event behaviour : For accessibility reasons, it is much simpler
                // to simply let the browser do it's standard action (which is to focus out of the input).
                // Instead, handle "tabPress" immediately instead of "keyup".
                // The focus will be on the next element in the page when the key is released, so keyup on the input will never be triggered.
                this.tabPress();
                this.magicBox.clearSuggestion();
                break;
            default:
                e.stopPropagation();
                if (this.onkeydown == null || this.onkeydown(e.keyCode || e.which)) {
                    requestAnimationFrame(function () {
                        _this.onInputChange();
                    });
                }
                else {
                    e.preventDefault();
                }
                break;
        }
    };
    InputManager.prototype.keyup = function (e) {
        switch (e.keyCode || e.which) {
            case KeyboardUtils_1.KEYBOARD.LEFT_ARROW:
            case KeyboardUtils_1.KEYBOARD.RIGHT_ARROW:
                this.handleLeftRightArrow(e);
                break;
            default:
                if (this.onkeydown == null || this.onkeyup(e.keyCode || e.which)) {
                    this.onInputChange();
                }
                else {
                    e.preventDefault();
                }
                break;
        }
    };
    InputManager.prototype.handleLeftRightArrow = function (e) {
        var querySuggestPreview = Dom_1.$$(this.root).find("." + Core_1.Component.computeCssClassNameForType('QuerySuggestPreview'));
        if (!querySuggestPreview) {
            this.onchangecursor();
        }
        var inputChanged = this.onkeydown == null || this.onkeyup(e.keyCode || e.which);
        inputChanged ? this.onInputChange() : e.preventDefault();
    };
    InputManager.prototype.tabPress = function () {
        this.ontabpress && this.ontabpress();
        this.onblur && this.onblur();
    };
    InputManager.prototype.onInputChange = function () {
        if (this.result.input != this.input.value) {
            this.onchange(this.input.value, false);
        }
    };
    InputManager.prototype.getValue = function () {
        return this.input.value;
    };
    InputManager.prototype.getWordCompletion = function () {
        return this.wordCompletion;
    };
    return InputManager;
}());
exports.InputManager = InputManager;


/***/ }),

/***/ 496:
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
var underscore_1 = __webpack_require__(0);
var ProcessingStatus;
(function (ProcessingStatus) {
    ProcessingStatus[ProcessingStatus["Finished"] = 0] = "Finished";
    ProcessingStatus[ProcessingStatus["TimedOut"] = 1] = "TimedOut";
    ProcessingStatus[ProcessingStatus["Overriden"] = 2] = "Overriden";
})(ProcessingStatus = exports.ProcessingStatus || (exports.ProcessingStatus = {}));
/**
 * IE11 equivalent of Promise.race
 * Adapted from Promise.race(iterable) polyfill on https://www.promisejs.org/api/
 */
function racePromises(promises) {
    return new Promise(function (resolve, reject) { return promises.forEach(function (value) { return Promise.resolve(value).then(resolve, reject); }); });
}
var QueryProcessor = /** @class */ (function () {
    function QueryProcessor(options) {
        if (options === void 0) { options = {}; }
        this.options = __assign({ timeout: 500 }, options);
    }
    /**
     * Overrides the previous queries and accumulates the result of promise arrays with a timeout.
     */
    QueryProcessor.prototype.processQueries = function (queries) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var asyncQueries;
            return __generator(this, function (_a) {
                this.overrideIfProcessing();
                this.processedResults = new Array(queries.length);
                asyncQueries = queries.map(function (query) { return (query instanceof Promise ? query : Promise.resolve(query)); });
                return [2 /*return*/, racePromises([
                        this.accumulateResultsChronologically(asyncQueries).then(function () { return _this.buildProcessResults(ProcessingStatus.Finished); }),
                        this.waitForOverride().then(function () { return _this.buildProcessResults(ProcessingStatus.Overriden); }),
                        this.waitForTimeout().then(function () { return _this.buildProcessResults(ProcessingStatus.TimedOut); })
                    ])];
            });
        });
    };
    QueryProcessor.prototype.overrideIfProcessing = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.override) {
                    this.override();
                }
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(QueryProcessor.prototype, "orderedResults", {
        get: function () {
            return underscore_1.flatten(this.processedResults.filter(function (result) { return !!result; }), true);
        },
        enumerable: true,
        configurable: true
    });
    QueryProcessor.prototype.buildProcessResults = function (status) {
        return {
            status: status,
            results: status !== ProcessingStatus.Overriden ? this.orderedResults : []
        };
    };
    QueryProcessor.prototype.accumulateResultsChronologically = function (queries) {
        return __awaiter(this, void 0, void 0, function () {
            var output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        output = this.processedResults;
                        return [4 /*yield*/, Promise.all(queries.map(function (query, i) { return query.then(function (items) { return (output[i] = items); }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QueryProcessor.prototype.waitForOverride = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.override = function () {
                _this.override = null;
                resolve();
            };
        });
    };
    QueryProcessor.prototype.waitForTimeout = function () {
        var _this = this;
        return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, _this.options.timeout); });
    };
    return QueryProcessor;
}());
exports.QueryProcessor = QueryProcessor;


/***/ }),

/***/ 499:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NestedQuery_1 = __webpack_require__(491);
var QueryExtension_1 = __webpack_require__(493);
var Basic_1 = __webpack_require__(128);
var Field_1 = __webpack_require__(216);
var SubExpression_1 = __webpack_require__(494);
exports.Complete = {
    include: [NestedQuery_1.NestedQuery, QueryExtension_1.QueryExtension, SubExpression_1.SubExpression, Field_1.Field, Basic_1.Basic]
};


/***/ }),

/***/ 500:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Grammar_1 = __webpack_require__(176);
var _ = __webpack_require__(0);
function loadSubGrammar(expressions, basicExpressions, grammars, subGrammar) {
    _.each(subGrammar.expressions, function (expression) {
        if (!_.contains(expressions, expression)) {
            expressions.push(expression);
        }
    });
    _.each(subGrammar.basicExpressions, function (expression) {
        if (!_.contains(basicExpressions, expression)) {
            basicExpressions.push(expression);
        }
    });
    _.each(subGrammar.grammars, function (expressionDef, id) {
        if (!(id in grammars)) {
            grammars[id] = expressionDef;
        }
        else {
            if (_.isArray(grammars[id]) && _.isArray(expressionDef)) {
                _.each(expressionDef, function (value) {
                    grammars[id].push(value);
                });
            }
            else {
                _.each(expressionDef, function (value) {
                    grammars[id].push(value);
                });
                throw new Error('Can not merge ' + id + '(' + JSON.stringify(expressionDef) + ' => ' + JSON.stringify(grammars[id]) + ')');
            }
        }
    });
}
function Expressions() {
    var subGrammars = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        subGrammars[_i] = arguments[_i];
    }
    var expressions = [];
    var BasicExpression = [];
    var grammars = {
        Start: ['Expressions', 'Empty'],
        Expressions: '[OptionalSpaces][Expression][ExpressionsList*][OptionalSpaces]',
        ExpressionsList: '[Spaces][Expression]',
        Expression: expressions,
        BasicExpression: BasicExpression,
        OptionalSpaces: / */,
        Spaces: / +/,
        Empty: /(?!.)/
    };
    for (var i = 0; i < subGrammars.length; i++) {
        loadSubGrammar(expressions, BasicExpression, grammars, subGrammars[i]);
        _.each(subGrammars[i].include, function (subGrammar) {
            if (!_.contains(subGrammars, subGrammar)) {
                subGrammars.push(subGrammar);
            }
        });
    }
    expressions.push('BasicExpression');
    return {
        start: 'Start',
        expressions: grammars
    };
}
exports.Expressions = Expressions;
function ExpressionsGrammar() {
    var subGrammars = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        subGrammars[_i] = arguments[_i];
    }
    var grammar = Expressions.apply(this, subGrammars);
    return new Grammar_1.Grammar(grammar.start, grammar.expressions);
}
exports.ExpressionsGrammar = ExpressionsGrammar;


/***/ }),

/***/ 501:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Those are the string definitions of events for ResultPreviewsManager.
 *
 * Those events should be bound to the element returned by `resolveRoot`.
 */
var ResultPreviewsManagerEvents = /** @class */ (function () {
    function ResultPreviewsManagerEvents() {
    }
    /**
     * Executed when building a query to fetch result previews.
     * This always receives {@link IBuildingResultPreviewsQueryEventArgs} as arguments.
     */
    ResultPreviewsManagerEvents.buildingResultPreviewsQuery = 'buildingResultPreviewsQuery';
    /**
     * Executed when a {@link Suggestion} is focused before {@link PopulateSearchResultPreviews} is called to fetch more options.
     * This always receives {@link IUpdateResultPreviewsManagerOptionsEventArgs} as arguments.
     */
    ResultPreviewsManagerEvents.updateResultPreviewsManagerOptions = 'updateResultPreviewsManagerOptions';
    /**
     * Executed when a {@link Suggestion} is focused and waiting for search result previews.
     * This always receives {@link IPopulateSearchResultPreviewsEventArgs} as arguments.
     */
    ResultPreviewsManagerEvents.populateSearchResultPreviews = 'populateSearchResultPreviews';
    return ResultPreviewsManagerEvents;
}());
exports.ResultPreviewsManagerEvents = ResultPreviewsManagerEvents;


/***/ }),

/***/ 502:
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
var ComponentOptionsModel_1 = __webpack_require__(28);
var QueryboxOptionsProcessing = /** @class */ (function () {
    function QueryboxOptionsProcessing(owner) {
        this.owner = owner;
    }
    Object.defineProperty(QueryboxOptionsProcessing.prototype, "options", {
        get: function () {
            return this.owner.options;
        },
        set: function (options) {
            this.owner.options = options;
        },
        enumerable: true,
        configurable: true
    });
    QueryboxOptionsProcessing.prototype.postProcess = function () {
        this.options = __assign({}, this.options, this.owner.componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchBox));
        this.processQueryOnClearVersusEmptyQuery();
        this.processQueryOnClearVersusSearchAsYouType();
    };
    QueryboxOptionsProcessing.prototype.processQueryOnClearVersusEmptyQuery = function () {
        if (this.options.triggerQueryOnClear && this.owner.searchInterface.options.allowQueriesWithoutKeywords === false) {
            this.owner.logger.warn('Forcing option triggerQueryOnClear to false, as it is not supported when the search interface is configured to not allow queries without keywords (data-allow-queries-without-keywords="false")', this.owner);
            this.options.triggerQueryOnClear = false;
        }
    };
    QueryboxOptionsProcessing.prototype.processQueryOnClearVersusSearchAsYouType = function () {
        if (this.owner.searchInterface.options.allowQueriesWithoutKeywords === true &&
            this.options.triggerQueryOnClear === false &&
            this.options.enableSearchAsYouType === true) {
            this.owner.logger.warn('Forcing option triggerQueryOnClear to true, since search-as-you-type is enabled', this.owner);
            this.options.triggerQueryOnClear = true;
        }
    };
    return QueryboxOptionsProcessing;
}());
exports.QueryboxOptionsProcessing = QueryboxOptionsProcessing;


/***/ }),

/***/ 503:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var MiscModules_1 = __webpack_require__(71);
var QueryboxQueryParameters = /** @class */ (function () {
    function QueryboxQueryParameters(options) {
        this.options = options;
    }
    QueryboxQueryParameters.queryIsBlocked = function () {
        // This code runs on some assumption :
        // Since all "buildingQuery" events would have to be run in the same call stack
        // We can add a static flag to block 2 or more query box/omnibox from trying to modify the query inside the same event.
        // If 2 query box are activated, we get duplicate terms in the query, or duplicate term correction with did you mean.
        // This means that only one query box/searchbox would be able to modify the query in a single search page.
        // This also means that if there is 2 search box enabled, the first one in the markup in the page would be able to do the job correctly as far as the query is concerned.
        // The second one is inactive as far as the query is concerned.
        // The flag gets reset in "defer" (setTimeout 0) so that it gets reset correctly when the query event has finished executing
        if (!QueryboxQueryParameters.queryIsCurrentlyBlocked) {
            QueryboxQueryParameters.queryIsCurrentlyBlocked = true;
            MiscModules_1.Defer.defer(function () { return QueryboxQueryParameters.allowDuplicateQuery(); });
            return false;
        }
        return true;
    };
    QueryboxQueryParameters.allowDuplicateQuery = function () {
        QueryboxQueryParameters.queryIsCurrentlyBlocked = false;
    };
    QueryboxQueryParameters.prototype.addParameters = function (queryBuilder, lastQuery) {
        if (!QueryboxQueryParameters.queryIsBlocked()) {
            if (this.options.enableWildcards) {
                queryBuilder.enableWildcards = true;
            }
            if (this.options.enableQuestionMarks) {
                queryBuilder.enableQuestionMarks = true;
            }
            if (this.options.enableLowercaseOperators) {
                queryBuilder.enableLowercaseOperators = true;
            }
            if (!_.isEmpty(lastQuery)) {
                queryBuilder.enableQuerySyntax = this.options.enableQuerySyntax;
                queryBuilder.expression.add(lastQuery);
                if (this.options.enablePartialMatch) {
                    queryBuilder.enablePartialMatch = this.options.enablePartialMatch;
                    if (this.options.partialMatchKeywords) {
                        queryBuilder.partialMatchKeywords = this.options.partialMatchKeywords;
                    }
                    if (this.options.partialMatchThreshold) {
                        queryBuilder.partialMatchThreshold = this.options.partialMatchThreshold;
                    }
                }
            }
        }
    };
    QueryboxQueryParameters.queryIsCurrentlyBlocked = false;
    return QueryboxQueryParameters;
}());
exports.QueryboxQueryParameters = QueryboxQueryParameters;


/***/ }),

/***/ 556:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GlobalExports_1 = __webpack_require__(3);
var ExpressionConstant_1 = __webpack_require__(215);
var ExpressionEndOfInput_1 = __webpack_require__(214);
var ExpressionFunction_1 = __webpack_require__(489);
var ExpressionList_1 = __webpack_require__(490);
var ExpressionOptions_1 = __webpack_require__(486);
var ExpressionRef_1 = __webpack_require__(484);
var ExpressionRegExp_1 = __webpack_require__(488);
var Grammar_1 = __webpack_require__(176);
var Grammars_1 = __webpack_require__(557);
var InputManager_1 = __webpack_require__(495);
var MagicBox_1 = __webpack_require__(218);
var MagicBoxUtils_1 = __webpack_require__(219);
var OptionResult_1 = __webpack_require__(487);
var RefResult_1 = __webpack_require__(485);
var Result_1 = __webpack_require__(49);
var SuggestionsManager_1 = __webpack_require__(217);
exports.GrammarsImportedLocally = Grammars_1.Grammars;
function doMagicBoxExport() {
    GlobalExports_1.exportGlobally({
        MagicBox: {
            EndOfInputResult: Result_1.EndOfInputResult,
            ExpressionConstant: ExpressionConstant_1.ExpressionConstant,
            ExpressionEndOfInput: ExpressionEndOfInput_1.ExpressionEndOfInput,
            ExpressionFunction: ExpressionFunction_1.ExpressionFunction,
            ExpressionList: ExpressionList_1.ExpressionList,
            ExpressionOptions: ExpressionOptions_1.ExpressionOptions,
            ExpressionRef: ExpressionRef_1.ExpressionRef,
            ExpressionRegExp: ExpressionRegExp_1.ExpressionRegExp,
            Grammar: Grammar_1.Grammar,
            Grammars: Grammars_1.Grammars,
            InputManager: InputManager_1.InputManager,
            Instance: MagicBox_1.MagicBoxInstance,
            OptionResult: OptionResult_1.OptionResult,
            RefResult: RefResult_1.RefResult,
            Result: Result_1.Result,
            SuggestionsManager: SuggestionsManager_1.SuggestionsManager,
            Utils: MagicBoxUtils_1.MagicBoxUtils,
            create: MagicBox_1.createMagicBox,
            requestAnimationFrame: MagicBox_1.requestAnimationFrame
        }
    });
}
exports.doMagicBoxExport = doMagicBoxExport;


/***/ }),

/***/ 557:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(128);
var Complete_1 = __webpack_require__(499);
var Date_1 = __webpack_require__(492);
var Expressions_1 = __webpack_require__(500);
var Field_1 = __webpack_require__(216);
var NestedQuery_1 = __webpack_require__(491);
var QueryExtension_1 = __webpack_require__(493);
var SubExpression_1 = __webpack_require__(494);
exports.Grammars = {
    Basic: Basic_1.Basic,
    notInWord: Basic_1.notInWord,
    notWordStart: Basic_1.notWordStart,
    Complete: Complete_1.Complete,
    Date: Date_1.Date,
    Expressions: Expressions_1.Expressions,
    ExpressionsGrammar: Expressions_1.ExpressionsGrammar,
    Field: Field_1.Field,
    NestedQuery: NestedQuery_1.NestedQuery,
    QueryExtension: QueryExtension_1.QueryExtension,
    SubExpression: SubExpression_1.SubExpression
};


/***/ }),

/***/ 558:
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
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var underscore_1 = __webpack_require__(0);
var Component_1 = __webpack_require__(7);
var SuggestionsManager_1 = __webpack_require__(217);
var ResultPreviewsManagerEvents_1 = __webpack_require__(501);
var QueryProcessor_1 = __webpack_require__(496);
var Utils_1 = __webpack_require__(4);
var ResultPreviewsManager = /** @class */ (function () {
    function ResultPreviewsManager(element, options) {
        if (options === void 0) { options = {}; }
        this.element = element;
        this.options = underscore_1.defaults(options, {
            previewHeaderText: Strings_1.l('QuerySuggestPreview'),
            previewHeaderFieldText: Strings_1.l('QuerySuggestPreviewWithField'),
            previewClass: 'coveo-preview-selectable',
            selectedClass: 'magic-box-selected'
        });
        this.root = Component_1.Component.resolveRoot(element);
        this.previewsProcessor = new QueryProcessor_1.QueryProcessor({ timeout: this.options.timeout });
    }
    Object.defineProperty(ResultPreviewsManager.prototype, "previewsOwner", {
        get: function () {
            return this.lastDisplayedSuggestion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultPreviewsManager.prototype, "hasPreviews", {
        get: function () {
            return !!this.suggestionsPreviewContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultPreviewsManager.prototype, "focusedPreviewElement", {
        get: function () {
            if (!this.hasPreviews) {
                return null;
            }
            var focusedElement = this.suggestionsPreviewContainer.findClass(this.options.selectedClass)[0];
            if (!focusedElement || !focusedElement.classList.contains(this.options.previewClass)) {
                return null;
            }
            return focusedElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultPreviewsManager.prototype, "previewElements", {
        get: function () {
            if (!this.hasPreviews) {
                return [];
            }
            return this.suggestionsPreviewContainer.findClass(this.options.previewClass);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultPreviewsManager.prototype, "suggestionsListbox", {
        get: function () {
            return Dom_1.$$(Dom_1.$$(this.element).findClass('coveo-magicbox-suggestions')[0]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultPreviewsManager.prototype, "numberOfResultsPerRow", {
        get: function () {
            var previewSelectables = this.suggestionsPreviewContainer.findClass(this.options.previewClass);
            if (previewSelectables.length === 0) {
                return 0;
            }
            var firstVerticalOffset = previewSelectables[0].offsetTop;
            var firstIndexOnNextRow = underscore_1.findIndex(previewSelectables, function (previewSelectable) { return previewSelectable.offsetTop !== firstVerticalOffset; });
            return firstIndexOnNextRow !== -1 ? firstIndexOnNextRow : previewSelectables.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultPreviewsManager.prototype, "previewContainerId", {
        get: function () {
            return "coveo-previews-for-" + this.lastDisplayedSuggestion.dom.id;
        },
        enumerable: true,
        configurable: true
    });
    ResultPreviewsManager.prototype.displaySearchResultPreviewsForSuggestion = function (suggestion) {
        return __awaiter(this, void 0, void 0, function () {
            var externalOptions, currentDelay, isQueryForSuggestionOngoing, arePreviewsForSuggestionCurrentlyDisplayed, _a, status, results;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalOptions = this.getExternalOptions();
                        currentDelay = (this.lastDelay = Utils_1.Utils.resolveAfter(Utils_1.Utils.isNullOrUndefined(externalOptions.displayAfterDuration) ? 200 : externalOptions.displayAfterDuration));
                        return [4 /*yield*/, currentDelay];
                    case 1:
                        _b.sent();
                        if (currentDelay !== this.lastDelay) {
                            return [2 /*return*/];
                        }
                        isQueryForSuggestionOngoing = suggestion && this.lastQueriedSuggestion === suggestion;
                        if (isQueryForSuggestionOngoing) {
                            return [2 /*return*/];
                        }
                        arePreviewsForSuggestionCurrentlyDisplayed = this.lastDisplayedSuggestion === suggestion;
                        if (arePreviewsForSuggestionCurrentlyDisplayed) {
                            this.previewsProcessor.overrideIfProcessing();
                            this.lastQueriedSuggestion = null;
                            return [2 /*return*/];
                        }
                        this.lastQueriedSuggestion = suggestion;
                        if (!suggestion) {
                            this.displaySuggestionPreviews(null, []);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getSearchResultPreviewsQuery(suggestion)];
                    case 2:
                        _a = _b.sent(), status = _a.status, results = _a.results;
                        if (status === QueryProcessor_1.ProcessingStatus.Overriden) {
                            return [2 /*return*/];
                        }
                        this.lastQueriedSuggestion = null;
                        this.displaySuggestionPreviews(suggestion, results);
                        return [2 /*return*/];
                }
            });
        });
    };
    ResultPreviewsManager.prototype.getElementInDirection = function (direction) {
        var previewElements = this.previewElements;
        var focusedIndex = previewElements.indexOf(this.focusedPreviewElement);
        if (focusedIndex === -1) {
            return null;
        }
        if (focusedIndex === 0 && direction === SuggestionsManager_1.Direction.Left) {
            return null;
        }
        return previewElements[(focusedIndex + this.getIncrementInDirection(direction)) % previewElements.length];
    };
    ResultPreviewsManager.prototype.getIncrementInDirection = function (direction) {
        switch (direction) {
            case SuggestionsManager_1.Direction.Left:
                return -1;
            case SuggestionsManager_1.Direction.Right:
                return 1;
            case SuggestionsManager_1.Direction.Up:
                return -this.numberOfResultsPerRow;
            case SuggestionsManager_1.Direction.Down:
                return this.numberOfResultsPerRow;
        }
    };
    ResultPreviewsManager.prototype.setHasPreviews = function (shouldHavePreviews) {
        if (this.hasPreviews === !!shouldHavePreviews) {
            return;
        }
        if (shouldHavePreviews) {
            this.initPreviewForSuggestions();
        }
        else {
            this.revertPreviewForSuggestions();
        }
    };
    ResultPreviewsManager.prototype.initPreviewForSuggestions = function () {
        this.suggestionsPreviewContainer = Dom_1.$$('div', {
            className: 'coveo-suggestion-container'
        }, this.suggestionsListbox.el, this.buildPreviewContainer());
        this.element.appendChild(this.suggestionsPreviewContainer.el);
        this.suggestionsListbox.setAttribute('aria-controls', this.previewContainerId);
    };
    ResultPreviewsManager.prototype.revertPreviewForSuggestions = function () {
        this.element.appendChild(this.suggestionsListbox.el);
        this.suggestionsPreviewContainer.remove();
        this.suggestionsPreviewContainer = null;
    };
    ResultPreviewsManager.prototype.buildPreviewContainer = function () {
        return Dom_1.$$('div', {
            className: 'coveo-preview-container',
            id: this.previewContainerId
        }, (this.resultPreviewsContainer = Dom_1.$$('div', {
            className: 'coveo-preview-results',
            role: 'listbox',
            'aria-orientation': 'horizontal'
        }))).el;
    };
    ResultPreviewsManager.prototype.getExternalOptions = function () {
        var optionsEventArgs = {};
        Dom_1.$$(this.root).trigger(ResultPreviewsManagerEvents_1.ResultPreviewsManagerEvents.updateResultPreviewsManagerOptions, optionsEventArgs);
        return optionsEventArgs;
    };
    ResultPreviewsManager.prototype.getSearchResultPreviewsQuery = function (suggestion) {
        var populateEventArgs = {
            suggestion: suggestion,
            previewsQueries: []
        };
        Dom_1.$$(this.root).trigger(ResultPreviewsManagerEvents_1.ResultPreviewsManagerEvents.populateSearchResultPreviews, populateEventArgs);
        return this.previewsProcessor.processQueries(populateEventArgs.previewsQueries);
    };
    ResultPreviewsManager.prototype.appendSearchResultPreview = function (preview, position) {
        this.resultPreviewsContainer.append(preview.element);
        preview.element.id = "coveo-result-preview-" + position;
        var elementDom = Dom_1.$$(preview.element);
        elementDom.setAttribute('aria-selected', 'false');
        elementDom.setAttribute('role', 'option');
        elementDom.on('click', function () { return preview.onSelect(); });
        elementDom.on('keyboardSelect', function () { return preview.onSelect(); });
    };
    ResultPreviewsManager.prototype.appendSearchResultPreviews = function (previews) {
        var _this = this;
        this.resultPreviewsContainer.empty();
        previews.forEach(function (preview, i) { return _this.appendSearchResultPreview(preview, i); });
    };
    ResultPreviewsManager.prototype.displaySuggestionPreviews = function (suggestion, previews) {
        this.lastDisplayedSuggestion = suggestion;
        this.setHasPreviews(previews && previews.length > 0);
        this.element.classList.toggle('magic-box-hasPreviews', this.hasPreviews);
        if (!this.hasPreviews) {
            return;
        }
        this.appendSearchResultPreviews(previews);
    };
    return ResultPreviewsManager;
}());
exports.ResultPreviewsManager = ResultPreviewsManager;


/***/ }),

/***/ 559:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var MagicBoxClear = /** @class */ (function () {
    function MagicBoxClear(magicBox) {
        this.element = Dom_1.$$('div', {
            className: 'magic-box-clear'
        });
        var clearIcon = Dom_1.$$('div', {
            className: 'magic-box-icon'
        });
        this.element.append(clearIcon.el);
        this.element.insertAfter(Dom_1.$$(magicBox.element).find('input'));
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.element)
            .withLabel(Strings_1.l('Clear'))
            .withSelectAction(function () { return magicBox.clear(); })
            .build();
        this.toggleTabindexAndAriaHidden(false);
    }
    MagicBoxClear.prototype.toggleTabindexAndAriaHidden = function (hasText) {
        var tabindex = hasText ? '0' : '-1';
        this.element.setAttribute('tabindex', tabindex);
        this.element.setAttribute('aria-hidden', "" + !hasText);
    };
    return MagicBoxClear;
}());
exports.MagicBoxClear = MagicBoxClear;


/***/ }),

/***/ 560:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Querybox__b6f3a40b26ad27101c27.js.map