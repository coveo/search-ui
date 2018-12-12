webpackJsonpCoveo__temporary([4,6,7,37],{

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionRef_1 = __webpack_require__(343);
var ExpressionOptions_1 = __webpack_require__(341);
var ExpressionRegExp_1 = __webpack_require__(345);
var _ = __webpack_require__(0);
var ExpressionFunction_1 = __webpack_require__(339);
var ExpressionConstant_1 = __webpack_require__(157);
var ExpressionList_1 = __webpack_require__(340);
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

/***/ 135:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

///<reference path="FieldAddon.ts" />
///<reference path="QueryExtensionAddon.ts" />
///<reference path="QuerySuggestAddon.ts" />
///<reference path="OldOmniboxAddon.ts" />
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(386);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var OmniboxEvents_1 = __webpack_require__(31);
var QueryEvents_1 = __webpack_require__(10);
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(71);
var Assert_1 = __webpack_require__(5);
var ComponentOptionsModel_1 = __webpack_require__(25);
var Model_1 = __webpack_require__(15);
var QueryStateModel_1 = __webpack_require__(12);
var Strings_1 = __webpack_require__(7);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var PendingSearchAsYouTypeSearchEvent_1 = __webpack_require__(88);
var SharedAnalyticsCalls_1 = __webpack_require__(85);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var Querybox_1 = __webpack_require__(96);
var QueryboxQueryParameters_1 = __webpack_require__(352);
var SearchInterface_1 = __webpack_require__(18);
var FieldAddon_1 = __webpack_require__(387);
var OldOmniboxAddon_1 = __webpack_require__(388);
var QueryExtensionAddon_1 = __webpack_require__(389);
var QuerySuggestAddon_1 = __webpack_require__(390);
var Grammar_1 = __webpack_require__(126);
var Complete_1 = __webpack_require__(353);
var Expressions_1 = __webpack_require__(354);
var MagicBox_1 = __webpack_require__(161);
var QueryboxOptionsProcessing_1 = __webpack_require__(355);
var MINIMUM_EXECUTABLE_CONFIDENCE = 0.8;
/**
 * The `Omnibox` component extends the [`Querybox`]{@link Querybox}, and thus provides the same basic options and
 * behaviors. Furthermore, the `Omnibox` adds a type-ahead capability to the search input.
 *
 * You can configure the type-ahead feature by enabling or disabling certain addons, which the Coveo JavaScript Search
 * Framework provides out-of-the-box (see the [`enableFieldAddon`]{@link Omnibox.options.enableFieldAddon},
 * [`enableQueryExtension`]{@link Omnibox.options.enableQueryExtensionAddon}, and
 * [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon} options).
 *
 * Custom components and external code can also extend or customize the type-ahead feature and the query completion
 * suggestions it provides by attaching their own handlers to the
 * [`populateOmniboxSuggestions`]{@link OmniboxEvents.populateOmniboxSuggestions`] event.
 *
 * See also the [`Searchbox`]{@link Searchbox} component, which can automatically instantiate an `Omnibox` along with an
 * optional {@link SearchButton}.
 */
var Omnibox = /** @class */ (function (_super) {
    __extends(Omnibox, _super);
    /**
     * Creates a new Omnibox component. Also enables necessary addons and binds events on various query events.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Omnibox component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Omnibox(element, options, bindings) {
        var _this = _super.call(this, element, Omnibox.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.partialQueries = [];
        _this.lastSuggestions = [];
        _this.movedOnce = false;
        _this.skipAutoSuggest = false;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Omnibox, options);
        var originalValueForQuerySyntax = _this.options.enableQuerySyntax;
        new QueryboxOptionsProcessing_1.QueryboxOptionsProcessing(_this).postProcess();
        Dom_1.$$(_this.element).toggleClass('coveo-query-syntax-disabled', _this.options.enableQuerySyntax == false);
        _this.suggestionAddon = _this.options.enableQuerySuggestAddon ? new QuerySuggestAddon_1.QuerySuggestAddon(_this) : new QuerySuggestAddon_1.VoidQuerySuggestAddon();
        new OldOmniboxAddon_1.OldOmniboxAddon(_this);
        _this.createMagicBox();
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(StandaloneSearchInterfaceEvents_1.StandaloneSearchInterfaceEvents.beforeRedirect, function () { return _this.handleBeforeRedirect(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function () { return _this.handleQuerySuccess(); });
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.Q, function (args) {
            return _this.handleQueryStateChanged(args);
        });
        if (_this.isAutoSuggestion()) {
            _this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function (args) { return _this.handleDuringQuery(args); });
        }
        _this.bind.onComponentOptions(Model_1.MODEL_EVENTS.CHANGE_ONE, ComponentOptionsModel_1.COMPONENT_OPTIONS_ATTRIBUTES.SEARCH_BOX, function (args) {
            if (args.value.enableQuerySyntax != null) {
                _this.options.enableQuerySyntax = args.value.enableQuerySyntax;
            }
            else {
                _this.options.enableQuerySyntax = originalValueForQuerySyntax;
            }
            _this.updateGrammar();
        });
        return _this;
    }
    /**
     * Adds the current content of the input to the query and triggers a query if the current content of the input has
     * changed since last submit.
     *
     * Also logs a `searchboxSubmit` event in the usage analytics.
     */
    Omnibox.prototype.submit = function () {
        var _this = this;
        this.magicBox.clearSuggestion();
        this.updateQueryState();
        this.triggerNewQuery(false, function () {
            SharedAnalyticsCalls_1.logSearchBoxSubmitEvent(_this.usageAnalytics);
        });
        this.magicBox.blur();
    };
    /**
     * Gets the current content of the input.
     * @returns {string} The current content of the input.
     */
    Omnibox.prototype.getText = function () {
        return this.magicBox.getText();
    };
    /**
     * Sets the content of the input
     * @param text The string to set in the input.
     */
    Omnibox.prototype.setText = function (text) {
        this.magicBox.setText(text);
        this.updateQueryState();
    };
    /**
     * Clears the content of the input.
     */
    Omnibox.prototype.clear = function () {
        this.magicBox.clear();
    };
    /**
     * Gets the `HTMLInputElement` of the Omnibox.
     */
    Omnibox.prototype.getInput = function () {
        return this.magicBox.element.querySelector('input');
    };
    Omnibox.prototype.getResult = function () {
        return this.magicBox.getResult();
    };
    Omnibox.prototype.getDisplayedResult = function () {
        return this.magicBox.getDisplayedResult();
    };
    Omnibox.prototype.getCursor = function () {
        return this.magicBox.getCursor();
    };
    Omnibox.prototype.resultAtCursor = function (match) {
        return this.magicBox.resultAtCursor(match);
    };
    Omnibox.prototype.createGrammar = function () {
        var grammar = null;
        if (this.options.enableQuerySyntax) {
            grammar = Expressions_1.Expressions(Complete_1.Complete);
            if (this.options.enableFieldAddon) {
                new FieldAddon_1.FieldAddon(this);
            }
            if (this.options.fieldAlias != null) {
                this.options.listOfFields = this.options.listOfFields || [];
                this.options.listOfFields = this.options.listOfFields.concat(_.keys(this.options.fieldAlias));
            }
            if (this.options.enableQueryExtensionAddon) {
                new QueryExtensionAddon_1.QueryExtensionAddon(this);
            }
        }
        else {
            grammar = { start: 'Any', expressions: { Any: /.*/ } };
        }
        if (this.options.grammar != null) {
            grammar = this.options.grammar(grammar);
        }
        return grammar;
    };
    Omnibox.prototype.updateGrammar = function () {
        var grammar = this.createGrammar();
        this.magicBox.grammar = new Grammar_1.Grammar(grammar.start, grammar.expressions);
        this.magicBox.setText(this.magicBox.getText());
    };
    Omnibox.prototype.createMagicBox = function () {
        var grammar = this.createGrammar();
        this.magicBox = MagicBox_1.createMagicBox(this.element, new Grammar_1.Grammar(grammar.start, grammar.expressions), {
            inline: this.options.inline,
            selectableSuggestionClass: 'coveo-omnibox-selectable',
            selectedSuggestionClass: 'coveo-omnibox-selected',
            suggestionTimeout: this.options.omniboxTimeout
        });
        var input = Dom_1.$$(this.magicBox.element).find('input');
        if (input) {
            Dom_1.$$(input).setAttribute('aria-label', this.options.placeholder || Strings_1.l('Search'));
        }
        this.setupMagicBox();
    };
    Omnibox.prototype.setupMagicBox = function () {
        var _this = this;
        this.magicBox.onmove = function () {
            // We assume that once the user has moved its selection, it becomes an explicit omnibox analytics event
            if (_this.isAutoSuggestion()) {
                _this.modifyEventTo = _this.getOmniboxAnalyticsEventCause();
            }
            _this.movedOnce = true;
        };
        this.magicBox.onfocus = function () {
            if (_this.isAutoSuggestion()) {
                // This flag is used to block the automatic query when the UI is loaded with a query (#q=foo)
                // and then the input is focused. We want to block that query, even if it match the suggestion
                // Only when there is an actual change in the input (user typing something) is when we want the automatic query to kick in
                _this.skipAutoSuggest = true;
            }
        };
        this.magicBox.onsuggestions = function (suggestions) {
            // If text is empty, this can mean that user selected text from the search box
            // and hit "delete" : Reset the partial queries in this case
            if (Utils_1.Utils.isEmptyString(_this.getText())) {
                _this.partialQueries = [];
            }
            _this.movedOnce = false;
            _this.lastSuggestions = suggestions;
            if (_this.isAutoSuggestion() && !_this.skipAutoSuggest) {
                _this.searchAsYouType();
            }
        };
        if (this.options.enableSearchAsYouType) {
            Dom_1.$$(this.element).addClass('coveo-magicbox-search-as-you-type');
        }
        this.magicBox.onchange = function () {
            _this.skipAutoSuggest = false;
            var text = _this.getText();
            if (text != undefined && text != '') {
                if (_this.isAutoSuggestion()) {
                    if (_this.movedOnce) {
                        _this.searchAsYouType(true);
                    }
                }
                else if (_this.options.enableSearchAsYouType) {
                    _this.searchAsYouType(true);
                }
            }
            else {
                _this.clear();
            }
        };
        if (this.options.placeholder) {
            this.magicBox.element.querySelector('input').placeholder = this.options.placeholder;
        }
        this.magicBox.onsubmit = function () { return _this.submit(); };
        this.magicBox.onselect = function (suggestion) {
            var index = _.indexOf(_this.lastSuggestions, suggestion);
            var suggestions = _.compact(_.map(_this.lastSuggestions, function (suggestion) { return suggestion.text; }));
            _this.magicBox.clearSuggestion();
            _this.updateQueryState();
            // A bit tricky here : When it's machine learning auto suggestions
            // the mouse selection and keyboard selection acts differently :
            // keyboard selection will automatically do the query (which will log a search as you type event -> further modified by this.modifyEventTo if needed)
            // mouse selection will not "auto" send the query.
            // the movedOnce variable detect the keyboard movement, and is used to differentiate mouse vs keyboard
            if (!_this.isAutoSuggestion()) {
                _this.usageAnalytics.cancelAllPendingEvents();
                _this.triggerNewQuery(false, function () {
                    _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
                });
            }
            else if (_this.isAutoSuggestion() && _this.movedOnce) {
                _this.handleAutoSuggestionWithKeyboard(index, suggestions);
            }
            else if (_this.isAutoSuggestion() && !_this.movedOnce) {
                _this.handleAutoSuggestionsWithMouse(index, suggestions);
            }
            // Consider a selection like a reset of the partial queries (it's the end of a suggestion pattern)
            if (_this.isAutoSuggestion()) {
                _this.partialQueries = [];
            }
        };
        this.magicBox.onblur = function () {
            if (_this.isAutoSuggestion()) {
                _this.setText(_this.getQuery(true));
                _this.usageAnalytics.sendAllPendingEvents();
            }
        };
        this.magicBox.onclear = function () {
            _this.updateQueryState();
            if (_this.options.triggerQueryOnClear || _this.options.enableSearchAsYouType) {
                _this.triggerNewQuery(false, function () {
                    _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxClear, {});
                });
            }
        };
        this.magicBox.ontabpress = function () {
            _this.handleTabPress();
        };
        this.magicBox.getSuggestions = function () { return _this.handleSuggestions(); };
    };
    Omnibox.prototype.handleAutoSuggestionWithKeyboard = function (index, suggestions) {
        var _this = this;
        if (this.searchAsYouTypeTimeout) {
            // Here, there is currently a search as you typed queued up :
            // Think : user typed very quickly, then very quickly selected a suggestion (without waiting for the search as you type)
            // Cancel the search as you type query, then immediately do the query with the selection (+analytics event with the selection)
            this.usageAnalytics.cancelAllPendingEvents();
            clearTimeout(this.searchAsYouTypeTimeout);
            this.searchAsYouTypeTimeout = undefined;
            this.triggerNewQuery(false, function () {
                _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
            });
        }
        else {
            // Here, the search as you type query has returned, but the analytics event has not ye been sent.
            // Think : user typed slowly, the query returned, and then the user selected a suggestion.
            // Since the analytics event has not yet been sent (search as you type event have a 5 sec delay)
            // modify the pending event, then send the newly modified analytics event immediately.
            this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
            this.modifyCustomDataOnPending(index, suggestions);
            this.modifyQueryContentOnPending();
            this.usageAnalytics.sendAllPendingEvents();
        }
    };
    Omnibox.prototype.handleAutoSuggestionsWithMouse = function (index, suggestions) {
        var _this = this;
        if (this.searchAsYouTypeTimeout || index != 0) {
            // Here : the user either very quickly chose the first suggestion, and the search as you type is still queued up.
            // OR
            // the user chose something different then the first suggestion.
            // Remove the search as you type if it's there, and do the query with the suggestion directly.
            this.clearSearchAsYouType();
            this.usageAnalytics.cancelAllPendingEvents();
            this.triggerNewQuery(false, function () {
                _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
            });
        }
        else {
            // Here : the user either very slowly chose a suggestion, and there is no search as you typed queued up
            // AND
            // the user chose the first suggestion.
            // this means the query is already returned, but the analytics event is still queued up.
            // modify the analytics event, and send it.
            this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
            this.modifyCustomDataOnPending(index, suggestions);
            this.modifyQueryContentOnPending();
            this.usageAnalytics.sendAllPendingEvents();
            // This should happen if :
            // users did a (short) query first, which does not match the first suggestion. (eg: typed "t", then search)
            // then, refocus the search box. The same suggestion(s) will re-appear.
            // By selecting the first one with the mouse, we need to retrigger a query because this means the search as you type could not
            // kick in and do the query automatically.
            if (this.lastQuery != this.getText()) {
                this.triggerNewQuery(false, function () {
                    _this.usageAnalytics.logSearchEvent(_this.getOmniboxAnalyticsEventCause(), _this.buildCustomDataForPartialQueries(index, suggestions));
                });
            }
        }
    };
    Omnibox.prototype.modifyCustomDataOnPending = function (index, suggestions) {
        var pendingEvt = this.usageAnalytics.getPendingSearchEvent();
        if (pendingEvt instanceof PendingSearchAsYouTypeSearchEvent_1.PendingSearchAsYouTypeSearchEvent) {
            var newCustomData_1 = this.buildCustomDataForPartialQueries(index, suggestions);
            _.each(_.keys(newCustomData_1), function (k) {
                pendingEvt.modifyCustomData(k, newCustomData_1[k]);
            });
        }
    };
    Omnibox.prototype.modifyQueryContentOnPending = function () {
        var pendingEvt = this.usageAnalytics.getPendingSearchEvent();
        if (pendingEvt instanceof PendingSearchAsYouTypeSearchEvent_1.PendingSearchAsYouTypeSearchEvent) {
            var queryContent = this.getQuery(this.options.enableSearchAsYouType);
            pendingEvt.modifyQueryContent(queryContent);
        }
    };
    Omnibox.prototype.buildCustomDataForPartialQueries = function (index, suggestions) {
        return {
            partialQueries: this.cleanCustomData(this.partialQueries),
            suggestionRanking: index,
            suggestions: this.cleanCustomData(suggestions),
            partialQuery: _.last(this.partialQueries)
        };
    };
    Omnibox.prototype.cleanCustomData = function (toClean, rejectLength) {
        if (rejectLength === void 0) { rejectLength = 256; }
        // Filter out only consecutive values that are the identical
        toClean = _.compact(_.filter(toClean, function (partial, pos, array) {
            return pos === 0 || partial !== array[pos - 1];
        }));
        // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
        // Need to replace ;
        toClean = _.map(toClean, function (partial) {
            return partial.replace(/;/g, '');
        });
        // Reduce right to get the last X words that adds to less then rejectLength
        var reducedToRejectLengthOrLess = [];
        _.reduceRight(toClean, function (memo, partial) {
            var totalSoFar = memo + partial.length;
            if (totalSoFar <= rejectLength) {
                reducedToRejectLengthOrLess.push(partial);
            }
            return totalSoFar;
        }, 0);
        toClean = reducedToRejectLengthOrLess.reverse();
        var ret = toClean.join(';');
        // analytics service can store max 256 char in a custom event
        // if we're over that, call cleanup again with an arbitrary 10 less char accepted
        if (ret.length >= 256) {
            return this.cleanCustomData(toClean, rejectLength - 10);
        }
        return toClean.join(';');
    };
    Omnibox.prototype.handleSuggestions = function () {
        var suggestionsEventArgs = {
            suggestions: [],
            omnibox: this
        };
        this.bind.trigger(this.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, suggestionsEventArgs);
        var text = this.getText();
        if (!Utils_1.Utils.isNullOrEmptyString(text)) {
            this.partialQueries.push(text);
        }
        return _.compact(suggestionsEventArgs.suggestions);
    };
    Omnibox.prototype.handleBeforeRedirect = function () {
        this.updateQueryState();
    };
    Omnibox.prototype.handleBuildingQuery = function (data) {
        var _this = this;
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.queryBuilder);
        this.updateQueryState();
        this.lastQuery = this.getQuery(data.searchAsYouType);
        var result = this.lastQuery == this.magicBox.getDisplayedResult().input
            ? this.magicBox.getDisplayedResult().clone()
            : this.magicBox.grammar.parse(this.lastQuery).clean();
        var preprocessResultForQueryArgs = {
            result: result
        };
        if (this.options.enableQuerySyntax) {
            var notQuotedValues = preprocessResultForQueryArgs.result.findAll('FieldValueNotQuoted');
            _.each(notQuotedValues, function (value) { return (value.value = '"' + value.value.replace(/"|\u00A0/g, ' ') + '"'); });
            if (this.options.fieldAlias) {
                var fieldNames = preprocessResultForQueryArgs.result.findAll(function (result) { return result.expression.id == 'FieldName' && result.isSuccess(); });
                _.each(fieldNames, function (result) {
                    var alias = _.find(_.keys(_this.options.fieldAlias), function (alias) { return alias.toLowerCase() == result.value.toLowerCase(); });
                    if (alias != null) {
                        result.value = _this.options.fieldAlias[alias];
                    }
                });
            }
        }
        this.bind.trigger(this.element, OmniboxEvents_1.OmniboxEvents.omniboxPreprocessResultForQuery, preprocessResultForQueryArgs);
        var query = preprocessResultForQueryArgs.result.toString();
        new QueryboxQueryParameters_1.QueryboxQueryParameters(this.options).addParameters(data.queryBuilder, query);
    };
    Omnibox.prototype.handleTabPress = function () {
        if (this.options.enableQuerySuggestAddon) {
            this.handleTabPressForSuggestions();
        }
        this.handleTabPressForOldOmniboxAddon();
    };
    Omnibox.prototype.handleTabPressForSuggestions = function () {
        if (!this.options.enableSearchAsYouType) {
            var suggestions = _.compact(_.map(this.lastSuggestions, function (suggestion) { return suggestion.text; }));
            this.usageAnalytics.logCustomEvent(this.getOmniboxAnalyticsEventCause(), this.buildCustomDataForPartialQueries(0, suggestions), this.element);
        }
        else {
            this.setText(this.getQuery(true));
        }
    };
    Omnibox.prototype.handleTabPressForOldOmniboxAddon = function () {
        var domSuggestions = this.lastSuggestions.filter(function (suggestions) { return suggestions.dom; }).map(function (suggestions) { return Dom_1.$$(suggestions.dom); });
        var selected = this.findAllElementsWithClass(domSuggestions, '.coveo-omnibox-selected');
        if (selected.length > 0) {
            Dom_1.$$(selected[0]).trigger('tabSelect');
        }
        else if (!this.options.enableQuerySuggestAddon) {
            var selectable = this.findAllElementsWithClass(domSuggestions, '.coveo-omnibox-selectable');
            if (selectable.length > 0) {
                Dom_1.$$(selectable[0]).trigger('tabSelect');
            }
        }
    };
    Omnibox.prototype.findAllElementsWithClass = function (elements, className) {
        return elements
            .map(function (element) { return element.find(className); })
            .filter(function (s) { return s; })
            .reduce(function (total, s) { return total.concat(s); }, []);
    };
    Omnibox.prototype.triggerNewQuery = function (searchAsYouType, analyticsEvent) {
        clearTimeout(this.searchAsYouTypeTimeout);
        var text = this.getQuery(searchAsYouType);
        if (this.shouldExecuteQuery(searchAsYouType)) {
            this.lastQuery = text;
            analyticsEvent();
            this.queryController.executeQuery({
                searchAsYouType: searchAsYouType,
                logInActionsHistory: true
            });
        }
    };
    Omnibox.prototype.getQuery = function (searchAsYouType) {
        if (this.lastQuery == this.magicBox.getText()) {
            return this.lastQuery;
        }
        if (!searchAsYouType) {
            return this.magicBox.getText();
        }
        var wordCompletion = this.magicBox.getWordCompletion();
        if (wordCompletion != null) {
            return wordCompletion;
        }
        var currentOmniboxSuggestion = this.magicBox.getWordCompletion() || this.getFirstSuggestion();
        if (currentOmniboxSuggestion) {
            return currentOmniboxSuggestion;
        }
        if (this.isAutoSuggestion()) {
            return this.lastQuery || this.magicBox.getText();
        }
        return this.magicBox.getText();
    };
    Omnibox.prototype.getFirstSuggestion = function () {
        if (this.lastSuggestions == null) {
            return '';
        }
        if (this.lastSuggestions.length <= 0) {
            return '';
        }
        var textSuggestion = _.find(this.lastSuggestions, function (suggestion) { return suggestion.text != null; });
        if (textSuggestion == null) {
            return '';
        }
        return textSuggestion.text;
    };
    Omnibox.prototype.updateQueryState = function () {
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, this.magicBox.getText());
    };
    Omnibox.prototype.handleQueryStateChanged = function (args) {
        Assert_1.Assert.exists(args);
        var q = args.value;
        if (q != this.magicBox.getText()) {
            this.magicBox.setText(q);
        }
    };
    Omnibox.prototype.handleQuerySuccess = function () {
        if (!this.isAutoSuggestion()) {
            this.partialQueries = [];
        }
    };
    Omnibox.prototype.handleDuringQuery = function (args) {
        var _this = this;
        // When the query results returns ... (args.promise)
        args.promise.then(function () {
            // Get a handle on a pending search as you type (those events are delayed, not sent instantly)
            var pendingEvent = _this.usageAnalytics.getPendingSearchEvent();
            if (pendingEvent instanceof PendingSearchAsYouTypeSearchEvent_1.PendingSearchAsYouTypeSearchEvent) {
                pendingEvent.beforeResolve.then(function (evt) {
                    // Check if we need to modify the event type beforeResolving it
                    args.promise.then(function () {
                        if (_this.modifyEventTo) {
                            evt.modifyEventCause(_this.modifyEventTo);
                            _this.modifyEventTo = null;
                        }
                    });
                });
            }
        });
    };
    Omnibox.prototype.searchAsYouType = function (forceExecuteQuery) {
        var _this = this;
        if (forceExecuteQuery === void 0) { forceExecuteQuery = false; }
        this.clearSearchAsYouType();
        if (this.shouldExecuteQuery(true)) {
            this.searchAsYouTypeTimeout = window.setTimeout(function () {
                if (_this.suggestionShouldTriggerQuery() || forceExecuteQuery) {
                    var suggestions_1 = _.map(_this.lastSuggestions, function (suggestion) { return suggestion.text; });
                    var index_1 = _.indexOf(suggestions_1, _this.magicBox.getWordCompletion());
                    _this.triggerNewQuery(true, function () {
                        _this.usageAnalytics.logSearchAsYouType(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxAsYouType, _this.buildCustomDataForPartialQueries(index_1, suggestions_1));
                    });
                    _this.clearSearchAsYouType();
                }
            }, this.options.searchAsYouTypeDelay);
        }
    };
    Omnibox.prototype.isAutoSuggestion = function () {
        return this.options.enableSearchAsYouType && this.options.enableQuerySuggestAddon;
    };
    Omnibox.prototype.shouldExecuteQuery = function (searchAsYouType) {
        var text = this.getQuery(searchAsYouType);
        if (this.searchInterface.options.allowQueriesWithoutKeywords === false) {
            return this.lastQuery != text && Utils_1.Utils.isNonEmptyString(text);
        }
        return this.lastQuery != text && text != null;
    };
    Omnibox.prototype.suggestionShouldTriggerQuery = function (suggestions) {
        if (suggestions === void 0) { suggestions = this.lastSuggestions; }
        if (this.shouldExecuteQuery(true)) {
            if (suggestions && suggestions[0]) {
                var suggestion = suggestions[0];
                // If we have access to a confidence level, return true if we are equal or above the minimum confidence level.
                if (suggestion && suggestion.executableConfidence != undefined) {
                    return suggestion.executableConfidence >= MINIMUM_EXECUTABLE_CONFIDENCE;
                }
                // If we don't have access to a confidence level, return true only if it "starts with" the content of the search box
                if (suggestion.text && suggestion.text.indexOf(this.magicBox.getText()) == 0) {
                    return true;
                }
            }
        }
        return false;
    };
    Omnibox.prototype.clearSearchAsYouType = function () {
        clearTimeout(this.searchAsYouTypeTimeout);
        this.searchAsYouTypeTimeout = undefined;
    };
    Omnibox.prototype.getOmniboxAnalyticsEventCause = function () {
        if (this.searchInterface instanceof SearchInterface_1.StandaloneSearchInterface) {
            return AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFromLink;
        }
        return AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxAnalytics;
    };
    Omnibox.ID = 'Omnibox';
    Omnibox.doExport = function () {
        GlobalExports_1.exportGlobally({
            Omnibox: Omnibox,
            QueryboxQueryParameters: QueryboxQueryParameters_1.QueryboxQueryParameters
        });
    };
    /**
     * The options for the omnibox
     * @componentOptions
     */
    Omnibox.options = {
        /**
         * Specifies whether query completion suggestions appearing in the `Omnibox` should push the result list and facets
         * down, rather than rendering themselves over them (and partially hiding them).
         *
         * Set this option as well as {@link Omnibox.options.enableSearchAsYouType} and
         * {@link Omnibox.options.enableQuerySuggestAddon} to `true` for a cool effect!
         *
         * Default value is `false`.
         */
        inline: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Whether to automatically trigger a new query whenever the end user types additional text in the search box input.
         *
         * See also the [`searchAsYouTypeDelay`]{@link Omnibox.options.searchAsYouTypeDelay} option.
         *
         * **Note:**
         * > If you set this option and the [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon}
         * > option to `true`, the query suggestion feature returns the auto-completion of the currently typed keyword as
         * > its first suggestion.
         *
         * Default value is `false`.
         */
        enableSearchAsYouType: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'SearchAsYouType' }),
        /**
         * If {@link Omnibox.options.enableSearchAsYouType} is `true`, specifies the delay (in milliseconds) before
         * triggering a new query when the end user types in the `Omnibox`.
         *
         * Default value is `2000`. Minimum value is `0`.
         */
        searchAsYouTypeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultValue: 2000,
            min: 0,
            depend: 'enableSearchAsYouType',
            section: 'SearchAsYouType'
        }),
        /**
         * The `field` addon makes the `Omnibox` highlight and complete field syntax. Setting this option to `true` automatically sets
         * the [enableQuerySyntax]{@link Querybox.options.enableQuerySyntax} option to `true` as a side effect.
         *
         * **Example:**
         * > Suppose you want to search for PDF files. You start typing `@f` in the search box. The `Omnibox` provides
         * > you with several matching fields. You select the `@filetype` field. Then, you start typing `=p` in the input.
         * > This time, the `Omnibox` provides you with several matching values for the `@filetype` field. You select the
         * > `pdf` suggestion, and submit your search request. Since the `enableQuerySyntax` option is set to `true`, the
         * > Coveo Search API interprets the basic expression as query syntax and returns the items whose `@filetype` field
         * > matches the `pdf` value.
         *
         * Default value is `false`.
         */
        enableFieldAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            depend: 'enableQuerySyntax',
            postProcessing: function (value, options) {
                if (value) {
                    options.enableQuerySyntax = true;
                }
                return value;
            },
            section: 'QuerySyntax'
        }),
        enableSimpleFieldAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableFieldAddon' }),
        listOfFields: ComponentOptions_1.ComponentOptions.buildFieldsOption({ depend: 'enableFieldAddon' }),
        /**
         * Whether to display Coveo Machine Learning (Coveo ML) query suggestions in the `Omnibox`.
         *
         * The corresponding Coveo ML model must be properly configured in your Coveo Cloud organization, otherwise this
         * option has no effect (see
         * [Managing Machine Learning Query Suggestions in a Query Pipeline](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=168)).
         *
         * **Note:**
         * > When you set this option and the [`enableSearchAsYouType`]{@link Omnibox.options.enableSearchAsYouType} option
         * > to `true`, the query suggestion feature returns the auto-completion of the currently typed keyword as its first
         * > query suggestion.
         *
         * Default value is `true`.
         */
        enableQuerySuggestAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: true,
            alias: ['enableTopQueryAddon', 'enableRevealQuerySuggestAddon']
        }),
        /**
         * If {@link Querybox.options.enableQuerySyntax} is `true`, specifies whether to enable the `query extension` addon.
         *
         * The `query extension` addon allows the Omnibox to complete the syntax for query extensions.
         *
         * Default value is `false`.
         */
        enableQueryExtensionAddon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            depend: 'enableQuerySyntax',
            postProcessing: function (value, options) {
                if (value) {
                    options.enableQuerySyntax = true;
                }
                return value;
            },
            section: 'QuerySyntax'
        }),
        /**
         * Specifies a placeholder for the input.
         */
        placeholder: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption(),
        /**
         * Specifies a timeout (in milliseconds) before rejecting suggestions in the Omnibox.
         *
         * Default value is `2000`. Minimum value is `0`.
         */
        omniboxTimeout: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 }),
        /**
         * Specifies whether the Coveo Platform should try to interpret special query syntax such as field references in the
         * query that the user enters in the Querybox (see
         * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
         *
         * Setting this option to `true` also causes the query syntax in the Querybox to highlight.
         *
         * Default value is `false`.
         */
        enableQuerySyntax: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            section: 'QuerySyntax'
        })
    };
    return Omnibox;
}(Component_1.Component));
exports.Omnibox = Omnibox;
Omnibox.options = __assign({}, Omnibox.options, Querybox_1.Querybox.options);
Initialization_1.Initialization.registerAutoCreateComponent(Omnibox);


/***/ }),

/***/ 137:
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
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(7);
var AccessibleButton_1 = __webpack_require__(17);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Component_1 = __webpack_require__(6);
var Initialization_1 = __webpack_require__(2);
/**
 * The SearchButton component renders a search icon that the end user can click to trigger a new query.
 *
 * See also the {@link Searchbox} component, which can automatically instantiate a SearchButton component along with a
 * {@link Querybox} component or an {@link Omnibox} component.
 */
var SearchButton = /** @class */ (function (_super) {
    __extends(SearchButton, _super);
    /**
     * Creates a new SearchButton. Binds a `click` event on the element. Adds a search icon on the element.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the SearchButton component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function SearchButton(element, options, bindings) {
        var _this = _super.call(this, element, SearchButton.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        new AccessibleButton_1.AccessibleButton()
            .withElement(element)
            .withOwner(_this.bind)
            .withLabel(Strings_1.l('Search'))
            .withSelectAction(function () { return _this.handleClick(); })
            .build();
        // Provide a magnifier icon if element contains nothing
        if (Utils_1.Utils.trim(Dom_1.$$(_this.element).text()) == '') {
            var svgMagnifierContainer = Dom_1.$$('span', { className: 'coveo-search-button' }, SVGIcons_1.SVGIcons.icons.search).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(svgMagnifierContainer, 'coveo-search-button-svg');
            var svgLoadingAnimationContainer = Dom_1.$$('span', { className: 'coveo-search-button-loading' }, SVGIcons_1.SVGIcons.icons.loading).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(svgLoadingAnimationContainer, 'coveo-search-button-loading-svg');
            element.appendChild(svgMagnifierContainer);
            element.appendChild(svgLoadingAnimationContainer);
        }
        return _this;
    }
    /**
     * Triggers the `click` event handler, which logs a `searchboxSubmit` event in the usage analytics and executes a
     * query.
     */
    SearchButton.prototype.click = function () {
        this.handleClick();
    };
    SearchButton.prototype.handleClick = function () {
        this.logger.debug('Performing query following button click');
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit, {});
        this.queryController.executeQuery();
    };
    SearchButton.ID = 'SearchButton';
    SearchButton.doExport = function () {
        GlobalExports_1.exportGlobally({
            SearchButton: SearchButton
        });
    };
    SearchButton.options = {};
    return SearchButton;
}(Component_1.Component));
exports.SearchButton = SearchButton;
Initialization_1.Initialization.registerAutoCreateComponent(SearchButton);


/***/ }),

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var SVGDom = /** @class */ (function () {
    function SVGDom() {
    }
    SVGDom.addClassToSVGInContainer = function (svgContainer, classToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', "" + SVGDom.getClass(svgElement) + classToAdd);
    };
    SVGDom.removeClassFromSVGInContainer = function (svgContainer, classToRemove) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', SVGDom.getClass(svgElement).replace(classToRemove, ''));
    };
    SVGDom.addStyleToSVGInContainer = function (svgContainer, styleToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        _.each(styleToAdd, function (styleValue, styleKey) {
            svgElement.style[styleKey] = styleValue;
        });
    };
    SVGDom.getClass = function (svgElement) {
        var className = svgElement.getAttribute('class');
        return className ? className + ' ' : '';
    };
    return SVGDom;
}());
exports.SVGDom = SVGDom;


/***/ }),

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(40);
var Result_2 = __webpack_require__(40);
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

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionEndOfInput = {
    id: 'end of input',
    parse: null
};


/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(93);
var Date_1 = __webpack_require__(347);
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
        FieldValueNotQuoted: /[^ \(\),]+/,
        NumberRange: '[Number][Spaces?]..[Spaces?][Number]'
    },
    include: [Date_1.Date, Basic_1.Basic]
};


/***/ }),

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var doMagicBoxExport_1 = __webpack_require__(380);
var SuggestionsManager_1 = __webpack_require__(351);
var InputManager_1 = __webpack_require__(350);
var underscore_1 = __webpack_require__(0);
var MagicBoxClear_1 = __webpack_require__(382);
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
        Dom_1.$$(this.element).setAttribute('role', 'combobox');
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
                _this.showSuggestion();
                _this.onchange && _this.onchange();
            }
            else {
                _this.setText(text);
                _this.onselect && _this.onselect(_this.getFirstSuggestionText());
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
            selectableClass: this.options.selectableSuggestionClass,
            selectedClass: this.options.selectedSuggestionClass,
            timeout: this.options.suggestionTimeout
        });
        this.magicBoxClear = new MagicBoxClear_1.MagicBoxClear(this);
        this.setupHandler();
    }
    MagicBoxInstance.prototype.getResult = function () {
        return this.result;
    };
    MagicBoxInstance.prototype.getDisplayedResult = function () {
        return this.displayedResult;
    };
    MagicBoxInstance.prototype.setText = function (text) {
        Dom_1.$$(this.element).toggleClass('magic-box-notEmpty', text.length > 0);
        this.magicBoxClear.toggleTabindex(text.length > 0);
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
            _this.showSuggestion();
            _this.onfocus && _this.onfocus();
        };
        this.inputManager.onkeydown = function (key) {
            if (key == 38 || key == 40) {
                // Up, Down
                return false;
            }
            if (key == 13) {
                // Enter
                var suggestion = _this.suggestionsManager.selectAndReturnKeyboardFocusedElement();
                if (suggestion == null) {
                    _this.onsubmit && _this.onsubmit();
                }
                return false;
            }
            else if (key == 27) {
                // ESC
                _this.clearSuggestion();
                _this.blur();
            }
            return true;
        };
        this.inputManager.onchangecursor = function () {
            _this.showSuggestion();
        };
        this.inputManager.onkeyup = function (key) {
            if (key == 38) {
                // Up
                _this.onmove && _this.onmove();
                _this.focusOnSuggestion(_this.suggestionsManager.moveUp());
                _this.onchange && _this.onchange();
            }
            else if (key == 40) {
                // Down
                _this.onmove && _this.onmove();
                _this.focusOnSuggestion(_this.suggestionsManager.moveDown());
                _this.onchange && _this.onchange();
            }
            else {
                return true;
            }
            return false;
        };
    };
    MagicBoxInstance.prototype.showSuggestion = function () {
        var _this = this;
        this.suggestionsManager.mergeSuggestions(this.getSuggestions != null ? this.getSuggestions() : [], function (suggestions) {
            _this.updateSuggestion(suggestions);
        });
    };
    MagicBoxInstance.prototype.updateSuggestion = function (suggestions) {
        var _this = this;
        this.lastSuggestions = suggestions;
        var firstSuggestion = this.getFirstSuggestionText();
        this.inputManager.setWordCompletion(firstSuggestion && firstSuggestion.text);
        this.onsuggestions && this.onsuggestions(suggestions);
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
        var _this = this;
        this.suggestionsManager.mergeSuggestions([], function (suggestions) {
            _this.updateSuggestion(suggestions);
        });
        this.inputManager.setWordCompletion(null);
    };
    MagicBoxInstance.prototype.focusOnSuggestion = function (suggestion) {
        if (suggestion == null || suggestion.text == null) {
            suggestion = this.getFirstSuggestionText();
            this.inputManager.setResult(this.displayedResult, suggestion && suggestion.text);
        }
        else {
            this.inputManager.setResult(this.grammar.parse(suggestion.text).clean(), suggestion.text);
        }
    };
    MagicBoxInstance.prototype.getFirstSuggestionText = function () {
        return underscore_1.find(this.lastSuggestions, function (suggestion) { return suggestion.text != null; });
    };
    MagicBoxInstance.prototype.getText = function () {
        return this.inputManager.getValue();
    };
    MagicBoxInstance.prototype.getWordCompletion = function () {
        return this.inputManager.getWordCompletion();
    };
    MagicBoxInstance.prototype.clear = function () {
        this.setText('');
        this.showSuggestion();
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

/***/ 162:
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

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(11);
var KeyboardUtils_1 = __webpack_require__(29);
var Dom_1 = __webpack_require__(1);
__webpack_require__(367);
var AccessibleButton = /** @class */ (function () {
    function AccessibleButton() {
        this.logger = new Logger_1.Logger(this);
    }
    AccessibleButton.prototype.withOwner = function (owner) {
        this.eventOwner = owner;
        return this;
    };
    AccessibleButton.prototype.withElement = function (element) {
        if (element instanceof HTMLElement) {
            this.element = Dom_1.$$(element);
        }
        else {
            this.element = element;
        }
        return this;
    };
    AccessibleButton.prototype.withLabel = function (label) {
        this.label = label;
        return this;
    };
    AccessibleButton.prototype.withTitle = function (title) {
        this.title = title;
        return this;
    };
    AccessibleButton.prototype.withSelectAction = function (action) {
        this.clickAction = action;
        this.enterKeyboardAction = action;
        return this;
    };
    AccessibleButton.prototype.withClickAction = function (clickAction) {
        this.clickAction = clickAction;
        return this;
    };
    AccessibleButton.prototype.withEnterKeyboardAction = function (enterAction) {
        this.enterKeyboardAction = enterAction;
        return this;
    };
    AccessibleButton.prototype.withFocusAndMouseEnterAction = function (action) {
        this.focusAction = action;
        this.mouseenterAction = action;
        return this;
    };
    AccessibleButton.prototype.withFocusAction = function (action) {
        this.focusAction = action;
        return this;
    };
    AccessibleButton.prototype.withMouseEnterAction = function (action) {
        this.mouseenterAction = action;
        return this;
    };
    AccessibleButton.prototype.withBlurAndMouseLeaveAction = function (action) {
        this.mouseleaveAction = action;
        this.blurAction = action;
        return this;
    };
    AccessibleButton.prototype.withMouseLeaveAction = function (action) {
        this.mouseleaveAction = action;
        return this;
    };
    AccessibleButton.prototype.withBlurAction = function (action) {
        this.blurAction = action;
        return this;
    };
    AccessibleButton.prototype.build = function () {
        if (!this.element) {
            this.element = Dom_1.$$('div');
        }
        this.ensureCorrectRole();
        this.ensureCorrectLabel();
        this.ensureTitle();
        this.ensureSelectAction();
        this.ensureUnselectAction();
        this.ensureMouseenterAndFocusAction();
        this.ensureMouseleaveAndBlurAction();
        this.ensureDifferentiationBetweenKeyboardAndMouseFocus();
        return this;
    };
    AccessibleButton.prototype.ensureDifferentiationBetweenKeyboardAndMouseFocus = function () {
        var _this = this;
        var classOnPress = 'coveo-accessible-button-pressed';
        var classOnFocus = 'coveo-accessible-button-focused';
        Dom_1.$$(this.element).addClass('coveo-accessible-button');
        Dom_1.$$(this.element).on('mousedown', function () {
            Dom_1.$$(_this.element).addClass(classOnPress);
            Dom_1.$$(_this.element).removeClass(classOnFocus);
        });
        Dom_1.$$(this.element).on('mouseup', function () { return Dom_1.$$(_this.element).removeClass(classOnPress); });
        Dom_1.$$(this.element).on('focus', function () {
            if (!Dom_1.$$(_this.element).hasClass(classOnPress)) {
                Dom_1.$$(_this.element).addClass(classOnFocus);
            }
        });
        Dom_1.$$(this.element).on('blur', function () { return Dom_1.$$(_this.element).removeClass(classOnFocus); });
    };
    AccessibleButton.prototype.ensureCorrectRole = function () {
        if (!this.element.getAttribute('role')) {
            this.element.setAttribute('role', 'button');
        }
    };
    AccessibleButton.prototype.ensureCorrectLabel = function () {
        if (!this.label) {
            this.logger.error("Missing label to create an accessible button !");
            return;
        }
        this.element.setAttribute('aria-label', this.label);
    };
    AccessibleButton.prototype.ensureTitle = function () {
        this.title && this.element.setAttribute('title', this.title);
    };
    AccessibleButton.prototype.ensureTabIndex = function () {
        this.element.setAttribute('tabindex', '0');
    };
    AccessibleButton.prototype.ensureSelectAction = function () {
        var _this = this;
        if (this.enterKeyboardAction) {
            this.ensureTabIndex();
            this.bindEvent('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function (e) { return _this.enterKeyboardAction(e); }));
        }
        if (this.clickAction) {
            this.bindEvent('click', this.clickAction);
        }
    };
    AccessibleButton.prototype.ensureUnselectAction = function () {
        if (this.blurAction) {
            this.bindEvent('blur', this.blurAction);
        }
        if (this.mouseleaveAction) {
            this.bindEvent('mouseleave', this.mouseleaveAction);
        }
    };
    AccessibleButton.prototype.ensureMouseenterAndFocusAction = function () {
        if (this.mouseenterAction) {
            this.bindEvent('mouseenter', this.mouseenterAction);
        }
        if (this.focusAction) {
            this.bindEvent('focus', this.focusAction);
        }
    };
    AccessibleButton.prototype.ensureMouseleaveAndBlurAction = function () {
        if (this.mouseleaveAction) {
            this.bindEvent('mouseleave', this.mouseleaveAction);
        }
        if (this.blurAction) {
            this.bindEvent('blur', this.blurAction);
        }
    };
    AccessibleButton.prototype.bindEvent = function (event, action) {
        if (this.eventOwner) {
            this.eventOwner.on(this.element, event, action);
        }
        else {
            Dom_1.$$(this.element).on(event, action);
        }
    };
    return AccessibleButton;
}());
exports.AccessibleButton = AccessibleButton;


/***/ }),

/***/ 217:
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(479);
var GlobalExports_1 = __webpack_require__(3);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var Omnibox_1 = __webpack_require__(135);
var Querybox_1 = __webpack_require__(96);
var SearchButton_1 = __webpack_require__(137);
var underscore_1 = __webpack_require__(0);
/**
 * The `Searchbox` component allows you to conveniently instantiate two components which end users frequently use to
 * enter and submit queries.
 *
 * This component attaches itself to a `div` element and takes care of instantiating either a
 * [`Querybox`]{@link Querybox} or an [`Omnibox`]{@link Omnibox} component (see the
 * [`enableOmnibox`]{@link Searchbox.options.enableOmnibox} option). Optionally, the `Searchbox` can also instantiate a
 * [`SearchButton`]{@link SearchButton} component, and append it inside the same `div` (see the
 * [`addSearchButton`]{@link Searchbox.options.addSearchButton} option).
 */
var Searchbox = /** @class */ (function (_super) {
    __extends(Searchbox, _super);
    /**
     * Creates a new `Searchbox` component. Creates a new `Coveo.Magicbox` instance and wraps magic box methods (`onblur`,
     * `onsubmit`, etc.). Binds event on `buildingQuery` and on redirection (for standalone box).
     * @param element The HTMLElement on which to instantiate the component. This cannot be an HTMLInputElement for
     * technical reasons.
     * @param options The options for the `Searchbox component`. These will merge with the options from the component set
     * directly on the `HTMLElement`.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Searchbox(element, options, bindings) {
        var _this = _super.call(this, element, Searchbox.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Searchbox, options);
        if (_this.options.inline) {
            Dom_1.$$(element).addClass('coveo-inline');
        }
        var div = document.createElement('div');
        _this.element.appendChild(div);
        if (_this.options.addSearchButton) {
            var anchor = Dom_1.$$('a');
            _this.element.appendChild(anchor.el);
            _this.searchButton = new SearchButton_1.SearchButton(anchor.el, undefined, bindings);
        }
        if (_this.options.enableOmnibox) {
            _this.searchbox = new Omnibox_1.Omnibox(div, _this.options, bindings);
        }
        else {
            _this.searchbox = new Querybox_1.Querybox(div, _this.options, bindings);
        }
        var magicBoxIcon = Dom_1.$$(_this.element).find('.magic-box-icon');
        magicBoxIcon.innerHTML = SVGIcons_1.SVGIcons.icons.mainClear;
        SVGDom_1.SVGDom.addClassToSVGInContainer(magicBoxIcon, 'magic-box-clear-svg');
        return _this;
    }
    Searchbox.ID = 'Searchbox';
    Searchbox.parent = Omnibox_1.Omnibox;
    Searchbox.doExport = function () {
        GlobalExports_1.exportGlobally({
            Searchbox: Searchbox,
            SearchButton: SearchButton_1.SearchButton,
            Omnibox: Omnibox_1.Omnibox,
            Querybox: Querybox_1.Querybox
        });
    };
    /**
     * Possible options for the {@link Searchbox}
     * @componentOptions
     */
    Searchbox.options = {
        /**
         * Specifies whether to instantiate a [`SearchButton`]{@link SearchButton} component.
         *
         * Default value is `true`.
         */
        addSearchButton: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to instantiate an [`Omnibox`]{@link Omnibox} component.
         *
         * When this option is `false`, the `Searchbox` instantiates a [`Querybox`]{@link Querybox} component instead.
         *
         * **Note:**
         * > You can use configuration options specific to the component you choose to instantiate with the `Searchbox`.
         *
         * **Examples:**
         *
         * In this first case, the `Searchbox` instantiates a `Querybox` component. You can configure this `Querybox`
         * instance using any of the `Querybox` component options, such as
         * [`triggerQueryOnClear`]{@link Querybox.options.triggerQueryOnClear}.
         * ```html
         * <div class='CoveoSearchbox' data-trigger-query-on-clear='true'></div>
         * ```
         *
         * In this second case, the `Searchbox` instantiates an `Omnibox` component. You can configure this `Omnibox`
         * instance using any of the `Omnibox` component options, such as
         * [`placeholder`]{@link Omnibox.options.placeholder}.
         * Moreover, since the `Omnibox` component inherits all of the `Querybox` component options, the
         * `data-trigger-query-on-clear` option from the previous example would also work on this `Omnibox` instance.
         * ```html
         * <div class='CoveoSearchbox' data-enable-omnibox='true' data-placeholder='Please enter a query'></div>
         * ```
         *
         * Default value is `true`.
         */
        enableOmnibox: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return Searchbox;
}(Component_1.Component));
exports.Searchbox = Searchbox;
Searchbox.options = __assign({}, Searchbox.options, Omnibox_1.Omnibox.options, Querybox_1.Querybox.options);
// Only parse omnibox option if omnibox is enabled
underscore_1.each(Searchbox.options, function (value, key) {
    if (key in Omnibox_1.Omnibox.options && !(key in Querybox_1.Querybox.options)) {
        Searchbox.options[key] = underscore_1.extend({ depend: 'enableOmnibox' }, value);
    }
});
Initialization_1.Initialization.registerAutoCreateComponent(Searchbox);


/***/ }),

/***/ 339:
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

/***/ 340:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(40);
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

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OptionResult_1 = __webpack_require__(342);
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

/***/ 342:
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
var Result_1 = __webpack_require__(40);
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

/***/ 343:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(40);
var RefResult_1 = __webpack_require__(344);
var ExpressionEndOfInput_1 = __webpack_require__(158);
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

/***/ 344:
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
var Result_1 = __webpack_require__(40);
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

/***/ 345:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(40);
var Result_2 = __webpack_require__(40);
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

/***/ 346:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = __webpack_require__(159);
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

/***/ 347:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(93);
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

/***/ 348:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(93);
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

/***/ 349:
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

/***/ 350:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var KeyboardUtils_1 = __webpack_require__(29);
var Strings_1 = __webpack_require__(7);
var InputManager = /** @class */ (function () {
    function InputManager(element, onchange, magicBox) {
        this.onchange = onchange;
        this.magicBox = magicBox;
        this.hasFocus = false;
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
        this.input.onclick = function () {
            _this.onchangecursor();
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
        this.input.spellcheck = false;
        this.input.setAttribute('form', 'coveo-dummy-form');
        this.input.setAttribute('role', 'combobox');
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('aria-autocomplete', 'list');
        this.input.setAttribute('title', Strings_1.l('InsertAQuery') + ". " + Strings_1.l('PressEnterToSend'));
    };
    InputManager.prototype.focus = function () {
        var _this = this;
        this.hasFocus = true;
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
            case 37: // Left
            case 39: // Right
                this.onchangecursor();
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

/***/ 351:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var SuggestionsManager = /** @class */ (function () {
    function SuggestionsManager(element, magicBoxContainer, inputManager, options) {
        var _this = this;
        this.element = element;
        this.magicBoxContainer = magicBoxContainer;
        this.inputManager = inputManager;
        this.options = underscore_1.defaults(options, {
            selectableClass: 'magic-box-suggestion',
            selectedClass: 'magic-box-selected'
        });
        // Put in a sane default, so as to not reject every suggestions if not set on initialization
        if (this.options.timeout == undefined) {
            this.options.timeout = 500;
        }
        this.hasSuggestions = false;
        Dom_1.$$(this.element).on('mouseover', function (e) {
            _this.handleMouseOver(e);
        });
        Dom_1.$$(this.element).on('mouseout', function (e) {
            _this.handleMouseOut(e);
        });
        this.addAccessibilityProperties();
    }
    SuggestionsManager.prototype.handleMouseOver = function (e) {
        var target = Dom_1.$$(e.target);
        var parents = target.parents(this.options.selectableClass);
        if (target.hasClass(this.options.selectableClass)) {
            this.processMouseSelection(target.el);
        }
        else if (parents.length > 0 && this.element.contains(parents[0])) {
            this.processMouseSelection(parents[0]);
        }
    };
    SuggestionsManager.prototype.handleMouseOut = function (e) {
        var target = Dom_1.$$(e.target);
        var targetParents = target.parents(this.options.selectableClass);
        //e.relatedTarget is not available if moving off the browser window
        if (e.relatedTarget) {
            var relatedTargetParents = Dom_1.$$(e.relatedTarget).parents(this.options.selectableClass);
            if (target.hasClass(this.options.selectedClass) && !Dom_1.$$(e.relatedTarget).hasClass(this.options.selectableClass)) {
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
    };
    SuggestionsManager.prototype.moveDown = function () {
        return this.returnMoved(this.move('down'));
    };
    SuggestionsManager.prototype.moveUp = function () {
        return this.returnMoved(this.move('up'));
    };
    SuggestionsManager.prototype.selectAndReturnKeyboardFocusedElement = function () {
        var selected = this.keyboardFocusedSuggestion;
        if (selected != null) {
            Dom_1.$$(selected).trigger('keyboardSelect');
            // By definition, once an element has been "selected" with the keyboard,
            // it is not longer "active" since the event has been processed.
            this.keyboardFocusedSuggestion = null;
        }
        return selected;
    };
    SuggestionsManager.prototype.mergeSuggestions = function (suggestions, callback) {
        var _this = this;
        var results = [];
        var timeout;
        var stillNeedToResolve = true;
        // clean empty / null values in the array of suggestions
        suggestions = underscore_1.compact(suggestions);
        var promise = (this.pendingSuggestion = new Promise(function (resolve, reject) {
            // Concat all promises results together in one flat array.
            // If one promise take too long to resolve, simply skip it
            underscore_1.each(suggestions, function (suggestion) {
                var shouldRejectPart = false;
                setTimeout(function () {
                    shouldRejectPart = true;
                    stillNeedToResolve = false;
                }, _this.options.timeout);
                suggestion.then(function (item) {
                    if (!shouldRejectPart && item) {
                        results = results.concat(item);
                    }
                });
            });
            // Resolve the promise when one of those conditions is met first :
            // - All suggestions resolved
            // - Timeout is reached before all promises have processed -> resolve with what we have so far
            // - No suggestions given (length 0 or undefined)
            var onResolve = function () {
                if (stillNeedToResolve) {
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    if (results.length == 0) {
                        resolve([]);
                    }
                    else if (promise == _this.pendingSuggestion || _this.pendingSuggestion == null) {
                        resolve(results.sort(function (a, b) { return b.index - a.index; }));
                    }
                    else {
                        reject('new request queued');
                    }
                }
                stillNeedToResolve = false;
            };
            if (suggestions.length == 0) {
                onResolve();
            }
            if (suggestions == undefined) {
                onResolve();
            }
            timeout = setTimeout(function () {
                onResolve();
            }, _this.options.timeout);
            Promise.all(suggestions).then(function () { return onResolve(); });
        }));
        promise
            .then(function (suggestions) {
            if (callback) {
                callback(suggestions);
            }
            _this.updateSuggestions(suggestions);
            return suggestions;
        })
            .catch(function () {
            return null;
        });
    };
    SuggestionsManager.prototype.updateSuggestions = function (suggestions) {
        var _this = this;
        Dom_1.$$(this.element).empty();
        this.element.className = 'magic-box-suggestions';
        var suggestionsContainer = this.buildSuggestionsContainer();
        Dom_1.$$(this.element).append(suggestionsContainer.el);
        underscore_1.each(suggestions, function (suggestion) {
            var dom = suggestion.dom ? _this.modifyDomFromExistingSuggestion(suggestion.dom) : _this.createDomFromSuggestion(suggestion);
            dom.setAttribute('id', "magic-box-suggestion-" + underscore_1.indexOf(suggestions, suggestion));
            dom.setAttribute('role', 'option');
            dom.setAttribute('aria-selected', 'false');
            dom['suggestion'] = suggestion;
            suggestionsContainer.append(dom.el);
        });
        this.hasSuggestions = suggestions.length > 0;
        Dom_1.$$(this.element).toggleClass('magic-box-hasSuggestion', this.hasSuggestions);
        Dom_1.$$(this.magicBoxContainer).setAttribute('aria-expanded', this.hasSuggestions.toString());
    };
    SuggestionsManager.prototype.processKeyboardSelection = function (suggestion) {
        this.addSelectedStatus(suggestion);
        this.keyboardFocusedSuggestion = suggestion;
        Dom_1.$$(this.inputManager.input).setAttribute('aria-activedescendant', Dom_1.$$(suggestion).getAttribute('id'));
    };
    SuggestionsManager.prototype.processMouseSelection = function (suggestion) {
        this.addSelectedStatus(suggestion);
        this.keyboardFocusedSuggestion = null;
    };
    SuggestionsManager.prototype.buildSuggestionsContainer = function () {
        return Dom_1.$$('div', {
            id: 'coveo-magicbox-suggestions',
            role: 'listbox'
        });
    };
    SuggestionsManager.prototype.createDomFromSuggestion = function (suggestion) {
        var dom = Dom_1.$$('div', {
            className: "magic-box-suggestion " + this.options.selectableClass
        });
        dom.on('click', function () {
            suggestion.onSelect();
        });
        dom.on('keyboardSelect', function () {
            suggestion.onSelect();
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
    SuggestionsManager.prototype.modifyDomFromExistingSuggestion = function (dom) {
        // this need to be done if the selection is in cache and the dom is set in the suggestion
        this.removeSelectedStatus(dom);
        var found = Dom_1.$$(dom).find('.' + this.options.selectableClass);
        this.removeSelectedStatus(found);
        return Dom_1.$$(dom);
    };
    SuggestionsManager.prototype.move = function (direction) {
        var currentlySelected = Dom_1.$$(this.element).find("." + this.options.selectedClass);
        var selectables = Dom_1.$$(this.element).findAll("." + this.options.selectableClass);
        var currentIndex = underscore_1.indexOf(selectables, currentlySelected);
        var index = direction == 'up' ? currentIndex - 1 : currentIndex + 1;
        if (index < -1) {
            index = selectables.length - 1;
        }
        if (index > selectables.length) {
            index = 0;
        }
        var newlySelected = selectables[index];
        if (newlySelected) {
            this.processKeyboardSelection(newlySelected);
        }
        else {
            this.keyboardFocusedSuggestion = null;
            this.inputManager.input.removeAttribute('aria-activedescendant');
        }
        return newlySelected;
    };
    SuggestionsManager.prototype.returnMoved = function (selected) {
        if (selected != null) {
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
    SuggestionsManager.prototype.addSelectedStatus = function (suggestion) {
        var selected = this.element.getElementsByClassName(this.options.selectedClass);
        for (var i = 0; i < selected.length; i++) {
            var elem = selected.item(i);
            this.removeSelectedStatus(elem);
        }
        Dom_1.$$(suggestion).addClass(this.options.selectedClass);
        this.updateAreaSelectedIfDefined(suggestion, 'true');
    };
    SuggestionsManager.prototype.removeSelectedStatus = function (suggestion) {
        Dom_1.$$(suggestion).removeClass(this.options.selectedClass);
        this.updateAreaSelectedIfDefined(suggestion, 'false');
    };
    SuggestionsManager.prototype.updateAreaSelectedIfDefined = function (suggestion, value) {
        if (Dom_1.$$(suggestion).getAttribute('aria-selected')) {
            Dom_1.$$(suggestion).setAttribute('aria-selected', value);
        }
    };
    SuggestionsManager.prototype.addAccessibilityProperties = function () {
        Dom_1.$$(this.magicBoxContainer).setAttribute('aria-expanded', 'false');
        Dom_1.$$(this.magicBoxContainer).setAttribute('aria-haspopup', 'listbox');
        this.inputManager.input.removeAttribute('aria-activedescendant');
    };
    return SuggestionsManager;
}());
exports.SuggestionsManager = SuggestionsManager;


/***/ }),

/***/ 352:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var MiscModules_1 = __webpack_require__(54);
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

/***/ 353:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NestedQuery_1 = __webpack_require__(346);
var QueryExtension_1 = __webpack_require__(348);
var Basic_1 = __webpack_require__(93);
var Field_1 = __webpack_require__(159);
var SubExpression_1 = __webpack_require__(349);
exports.Complete = {
    include: [NestedQuery_1.NestedQuery, QueryExtension_1.QueryExtension, SubExpression_1.SubExpression, Field_1.Field, Basic_1.Basic]
};


/***/ }),

/***/ 354:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Grammar_1 = __webpack_require__(126);
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

/***/ 355:
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
var ComponentOptionsModel_1 = __webpack_require__(25);
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
            this.owner.logger.warn('Forcing option triggerQueryOnClear to true, since search as you type is enabled', this.owner);
            this.options.triggerQueryOnClear = true;
        }
    };
    return QueryboxOptionsProcessing;
}());
exports.QueryboxOptionsProcessing = QueryboxOptionsProcessing;


/***/ }),

/***/ 356:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SuggestionsCache = /** @class */ (function () {
    function SuggestionsCache() {
        this.cache = {};
    }
    SuggestionsCache.prototype.getSuggestions = function (hash, suggestionsFetcher) {
        var _this = this;
        if (this.cache[hash] != null) {
            return this.cache[hash];
        }
        var promise = suggestionsFetcher();
        this.cache[hash] = promise;
        promise.catch(function () { return _this.clearSuggestion(hash); });
        return this.cache[hash];
    };
    SuggestionsCache.prototype.clearSuggestion = function (hash) {
        if (!hash || hash.length === 0) {
            return null;
        }
        delete this.cache[hash];
    };
    return SuggestionsCache;
}());
exports.SuggestionsCache = SuggestionsCache;


/***/ }),

/***/ 367:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 380:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GlobalExports_1 = __webpack_require__(3);
var ExpressionConstant_1 = __webpack_require__(157);
var ExpressionEndOfInput_1 = __webpack_require__(158);
var ExpressionFunction_1 = __webpack_require__(339);
var ExpressionList_1 = __webpack_require__(340);
var ExpressionOptions_1 = __webpack_require__(341);
var ExpressionRef_1 = __webpack_require__(343);
var ExpressionRegExp_1 = __webpack_require__(345);
var Grammar_1 = __webpack_require__(126);
var Grammars_1 = __webpack_require__(381);
var InputManager_1 = __webpack_require__(350);
var MagicBox_1 = __webpack_require__(161);
var MagicBoxUtils_1 = __webpack_require__(162);
var OptionResult_1 = __webpack_require__(342);
var RefResult_1 = __webpack_require__(344);
var Result_1 = __webpack_require__(40);
var SuggestionsManager_1 = __webpack_require__(351);
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

/***/ 381:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(93);
var Complete_1 = __webpack_require__(353);
var Date_1 = __webpack_require__(347);
var Expressions_1 = __webpack_require__(354);
var Field_1 = __webpack_require__(159);
var NestedQuery_1 = __webpack_require__(346);
var QueryExtension_1 = __webpack_require__(348);
var SubExpression_1 = __webpack_require__(349);
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

/***/ 382:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(7);
var AccessibleButton_1 = __webpack_require__(17);
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
        this.toggleTabindex(false);
    }
    MagicBoxClear.prototype.toggleTabindex = function (hasText) {
        var tabindex = hasText ? '0' : '-1';
        this.element.setAttribute('tabindex', tabindex);
    };
    return MagicBoxClear;
}());
exports.MagicBoxClear = MagicBoxClear;


/***/ }),

/***/ 386:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 387:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OmniboxEvents_1 = __webpack_require__(31);
var _ = __webpack_require__(0);
var MagicBoxUtils_1 = __webpack_require__(162);
var FieldAddon = /** @class */ (function () {
    function FieldAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.cache = {};
        this.omnibox.bind.on(this.omnibox.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (args) {
            args.suggestions.push(_this.getSuggestion());
        });
    }
    FieldAddon.prototype.getSuggestion = function () {
        var _this = this;
        var hash = this.getHash();
        if (hash == null) {
            return null;
        }
        var hashString = this.hashToString(hash);
        if (this.cache[hashString] != null) {
            return this.hashValueToSuggestion(hash, this.cache[hashString]);
        }
        var values;
        if (hash.type == 'FieldName') {
            values = this.fieldNames(hash.current);
        }
        if (hash.type == 'FieldValue') {
            values = this.fieldValues(hash.field, hash.current);
        }
        if (hash.type == 'SimpleFieldName') {
            values = this.simpleFieldNames(hash.current);
        }
        this.cache[hashString] = values;
        values.catch(function () {
            delete _this.cache[hashString];
        });
        return this.hashValueToSuggestion(hash, values);
    };
    FieldAddon.prototype.getHash = function () {
        var fieldName = _.last(this.omnibox.resultAtCursor('FieldName'));
        if (fieldName != null) {
            fieldName = fieldName.findParent('Field') || fieldName;
            var currentField = fieldName.toString();
            var before = fieldName.before();
            var after = fieldName.after();
            return { type: 'FieldName', current: currentField, before: before, after: after };
        }
        var fieldValue = _.last(this.omnibox.resultAtCursor('FieldValue'));
        if (fieldValue) {
            var fieldQuery = fieldValue.findParent('FieldQuery') || (this.omnibox.options.enableSimpleFieldAddon && fieldValue.findParent('FieldSimpleQuery'));
            if (fieldQuery) {
                var field = fieldQuery.find('FieldName').toString();
                if (this.omnibox.options.fieldAlias) {
                    if (field in this.omnibox.options.fieldAlias) {
                        field = this.omnibox.options.fieldAlias[field];
                    }
                }
                var value = fieldValue.toString();
                var before = fieldValue.before();
                var after = fieldValue.after();
                return { type: 'FieldValue', field: field, current: value, before: before, after: after };
            }
        }
        if (this.omnibox.options.enableSimpleFieldAddon) {
            var word = _.last(this.omnibox.resultAtCursor('Word'));
            if (word != null) {
                var current = word.toString();
                var before = word.before();
                var after = word.after();
                return { type: 'SimpleFieldName', current: current, before: before, after: after };
            }
        }
    };
    FieldAddon.prototype.hashToString = function (hash) {
        if (hash == null) {
            return null;
        }
        return hash.type + hash.current + (hash.field || '');
    };
    FieldAddon.prototype.hashValueToSuggestion = function (hash, promise) {
        return promise.then(function (values) {
            var suggestions = _.map(values, function (value, i) {
                var suggestion = {
                    text: hash.before +
                        (hash.current.toLowerCase().indexOf(value.toLowerCase()) == 0 ? hash.current + value.substr(hash.current.length) : value) +
                        hash.after,
                    html: MagicBoxUtils_1.MagicBoxUtils.highlightText(value, hash.current, true),
                    index: FieldAddon.INDEX - i / values.length
                };
                return suggestion;
            });
            return suggestions;
        });
    };
    FieldAddon.prototype.getFields = function () {
        var _this = this;
        if (this.fields == null) {
            this.fields = new Promise(function (resolve, reject) {
                if (_this.omnibox.options.listOfFields != null) {
                    resolve(_this.omnibox.options.listOfFields);
                }
                else {
                    var promise = _this.omnibox.queryController.getEndpoint().listFields();
                    promise
                        .then(function (fieldDescriptions) {
                        var fieldNames = _.chain(fieldDescriptions)
                            .filter(function (fieldDescription) { return fieldDescription.includeInQuery && fieldDescription.groupByField; })
                            .map(function (fieldDescription) { return fieldDescription.name.substr(1); })
                            .value();
                        resolve(fieldNames);
                    })
                        .catch(function () {
                        reject();
                    });
                }
            });
        }
        return this.fields;
    };
    FieldAddon.prototype.fieldNames = function (current) {
        var withAt = current.length > 0 && current[0] == '@';
        var fieldName = withAt ? current.substr(1) : current;
        var fieldNameLC = fieldName.toLowerCase();
        return this.getFields().then(function (fields) {
            var matchFields = _.chain(fields)
                .map(function (fieldName) {
                var fieldNameBeginsWithAt = fieldName.length > 0 && fieldName[0] == '@';
                return {
                    index: fieldName.toLowerCase().indexOf(fieldNameLC),
                    field: fieldNameBeginsWithAt ? fieldName : '@' + fieldName
                };
            })
                .filter(function (field) {
                return field.index != -1 && field.field.length > current.length;
            })
                .sortBy('index')
                .map(function (field) { return field.field; })
                .value();
            matchFields = _.first(matchFields, 5);
            return matchFields;
        });
    };
    FieldAddon.prototype.fieldValues = function (field, current) {
        return this.omnibox.queryController
            .getEndpoint()
            .listFieldValues({
            pattern: '.*' + current + '.*',
            patternType: 'RegularExpression',
            sortCriteria: 'occurrences',
            field: '@' + field,
            maximumNumberOfValues: 5
        })
            .then(function (values) {
            return _.chain(values)
                .map(function (value) {
                return {
                    index: value.value.toLowerCase().indexOf(current),
                    value: value.value
                };
            })
                .filter(function (value) {
                return value.value.length > current.length;
            })
                .sortBy('index')
                .map(function (value) {
                return value.value.replace(/ /g, '\u00A0');
            })
                .value();
        });
    };
    FieldAddon.prototype.simpleFieldNames = function (current) {
        var fieldName = current;
        var fieldNameLC = fieldName.toLowerCase();
        return this.getFields().then(function (fields) {
            var matchFields = _.chain(fields)
                .map(function (field) {
                return {
                    index: field.toLowerCase().indexOf(fieldNameLC),
                    field: field + ':'
                };
            })
                .filter(function (field) {
                return field.index != -1 && field.field.length > current.length;
            })
                .sortBy('index')
                .map(function (field) { return field.field; })
                .value();
            matchFields = _.first(matchFields, 5);
            return matchFields;
        });
    };
    FieldAddon.INDEX = 64;
    return FieldAddon;
}());
exports.FieldAddon = FieldAddon;


/***/ }),

/***/ 388:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OmniboxEvents_1 = __webpack_require__(31);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var OldOmniboxAddon = /** @class */ (function () {
    function OldOmniboxAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.omnibox.bind.on(this.omnibox.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (args) {
            _.each(_this.getSuggestion(), function (suggestion) {
                args.suggestions.push(suggestion);
            });
        });
    }
    OldOmniboxAddon.prototype.getSuggestion = function () {
        var text = this.omnibox.magicBox.getText();
        if (text.length == 0) {
            return null;
        }
        var eventArgs = this.buildPopulateOmniboxEventArgs();
        Dom_1.$$(this.omnibox.root).trigger(OmniboxEvents_1.OmniboxEvents.populateOmnibox, eventArgs);
        return this.rowsToSuggestions(eventArgs.rows);
    };
    OldOmniboxAddon.prototype.getCurrentQueryExpression = function () {
        var cursorPos = this.omnibox.getCursor();
        var value = this.omnibox.getText();
        var length = value.length;
        var start = cursorPos;
        var end = cursorPos;
        if (value[start] == ' ') {
            start--;
        }
        while (start > 0 && value[start] != ' ') {
            start--;
        }
        while (end < length && value[end] != ' ') {
            end++;
        }
        return value.substring(start, end);
    };
    OldOmniboxAddon.prototype.getRegexToSearch = function (strValue) {
        if (strValue == null) {
            strValue = this.omnibox.getText();
        }
        return new RegExp(Utils_1.Utils.escapeRegexCharacter(strValue), 'i');
    };
    OldOmniboxAddon.prototype.getQueryExpressionBreakDown = function () {
        var _this = this;
        var ret = [];
        var queryWords = this.omnibox.getText().split(' ');
        _.each(queryWords, function (word) {
            ret.push({
                word: word,
                regex: _this.getRegexToSearch(word)
            });
        });
        return ret;
    };
    OldOmniboxAddon.prototype.replace = function (searchValue, newValue) {
        this.omnibox.setText(this.omnibox.getText().replace(searchValue, newValue));
    };
    OldOmniboxAddon.prototype.clearCurrentExpression = function () {
        this.replace(this.getCurrentQueryExpression(), '');
    };
    OldOmniboxAddon.prototype.insertAt = function (at, toInsert) {
        var oldValue = this.omnibox.getText();
        var newValue = [oldValue.slice(0, at), toInsert, oldValue.slice(at)].join('');
        this.omnibox.setText(newValue);
    };
    OldOmniboxAddon.prototype.replaceCurrentExpression = function (newValue) {
        this.replace(this.getCurrentQueryExpression(), newValue);
    };
    OldOmniboxAddon.prototype.buildPopulateOmniboxEventArgs = function () {
        var _this = this;
        var currentQueryExpression = this.getCurrentQueryExpression();
        var ret = {
            rows: [],
            completeQueryExpression: {
                word: this.omnibox.getText(),
                regex: this.getRegexToSearch()
            },
            currentQueryExpression: {
                word: currentQueryExpression,
                regex: this.getRegexToSearch(currentQueryExpression)
            },
            allQueryExpressions: this.getQueryExpressionBreakDown(),
            cursorPosition: this.omnibox.getCursor(),
            clear: function () {
                _this.omnibox.clear();
            },
            clearCurrentExpression: function () {
                _this.clearCurrentExpression();
            },
            replace: function (searchValue, newValue) {
                _this.replace(searchValue, newValue);
            },
            replaceCurrentExpression: function (newValue) {
                _this.replaceCurrentExpression(newValue);
            },
            insertAt: function (at, toInsert) {
                _this.insertAt(at, toInsert);
            },
            closeOmnibox: function () {
                _this.omnibox.magicBox.blur();
            }
        };
        return ret;
    };
    OldOmniboxAddon.prototype.rowsToSuggestions = function (rows) {
        return _.map(rows, function (row) {
            if (!Utils_1.Utils.isNullOrUndefined(row.element)) {
                return new Promise(function (resolve) {
                    resolve([
                        {
                            dom: row.element,
                            index: row.zIndex
                        }
                    ]);
                });
            }
            else if (!Utils_1.Utils.isNullOrUndefined(row.deferred)) {
                return new Promise(function (resolve) {
                    row.deferred.then(function (row) {
                        if (row.element != null) {
                            resolve([
                                {
                                    dom: row.element,
                                    index: row.zIndex
                                }
                            ]);
                        }
                        else {
                            resolve(null);
                        }
                    });
                });
            }
            return null;
        });
    };
    return OldOmniboxAddon;
}());
exports.OldOmniboxAddon = OldOmniboxAddon;


/***/ }),

/***/ 389:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
///<reference path='Omnibox.ts'/>
var OmniboxEvents_1 = __webpack_require__(31);
var _ = __webpack_require__(0);
var MagicBoxUtils_1 = __webpack_require__(162);
var QueryExtensionAddon = /** @class */ (function () {
    function QueryExtensionAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.cache = {};
        this.omnibox.bind.on(this.omnibox.element, OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (args) {
            args.suggestions.push(_this.getSuggestion());
        });
    }
    QueryExtensionAddon.prototype.getSuggestion = function () {
        var _this = this;
        var hash = this.getHash(this.omnibox.magicBox);
        if (hash == null) {
            return null;
        }
        var hashString = this.hashToString(hash);
        if (this.cache[hashString] != null) {
            return this.hashValueToSuggestion(hash, this.cache[hashString]);
        }
        var values = hash.type == 'QueryExtensionName' ? this.names(hash.current) : this.attributeNames(hash.name, hash.current, hash.used);
        this.cache[hashString] = values;
        values.catch(function () {
            delete _this.cache[hashString];
        });
        return this.hashValueToSuggestion(hash, values);
    };
    QueryExtensionAddon.prototype.getHash = function (magicBox) {
        var queryExtension = _.last(magicBox.resultAtCursor('QueryExtension'));
        if (queryExtension != null) {
            var queryExtensionArgumentResults = queryExtension.findAll('QueryExtensionArgument');
            var current = _.last(magicBox.resultAtCursor('QueryExtensionName'));
            if (current != null) {
                return {
                    type: 'QueryExtensionName',
                    current: current.toString(),
                    before: current.before(),
                    after: current.after()
                };
            }
            current = _.last(magicBox.resultAtCursor('QueryExtensionArgumentName'));
            if (current != null) {
                var used = _.chain(queryExtensionArgumentResults)
                    .map(function (result) {
                    var name = result.find('QueryExtensionArgumentName');
                    return name && name.toString();
                })
                    .compact()
                    .value();
                var name = queryExtension.find('QueryExtensionName').toString();
                return {
                    type: 'QueryExtensionArgumentName',
                    current: current.toString(),
                    before: current.before(),
                    after: current.after(),
                    name: name,
                    used: used
                };
            }
        }
        return null;
    };
    QueryExtensionAddon.prototype.hashToString = function (hash) {
        if (hash == null) {
            return null;
        }
        return [hash.type, hash.current, hash.name || '', hash.used ? hash.used.join() : ''].join();
    };
    QueryExtensionAddon.prototype.hashValueToSuggestion = function (hash, promise) {
        return promise.then(function (values) {
            var suggestions = _.map(values, function (value, i) {
                return {
                    html: MagicBoxUtils_1.MagicBoxUtils.highlightText(value, hash.current, true),
                    text: hash.before + value + hash.after,
                    index: QueryExtensionAddon.INDEX - i / values.length
                };
            });
            return suggestions;
        });
    };
    QueryExtensionAddon.prototype.getExtensions = function () {
        if (this.extensions == null) {
            this.extensions = this.omnibox.queryController.getEndpoint().extensions();
        }
        return this.extensions;
    };
    QueryExtensionAddon.prototype.names = function (current) {
        var extensionName = current.toLowerCase();
        return this.getExtensions().then(function (extensions) {
            var matchExtensions = _.chain(extensions)
                .map(function (extension) {
                return {
                    index: extension.name.toLowerCase().indexOf(extensionName),
                    extension: extension.name
                };
            })
                .filter(function (extension) {
                return extension.index != -1 && extension.extension.length > extensionName.length;
            })
                .sortBy('index')
                .pluck('extension')
                .value();
            matchExtensions = _.first(matchExtensions, 5);
            return matchExtensions;
        });
    };
    QueryExtensionAddon.prototype.attributeNames = function (name, current, used) {
        return this.getExtensions().then(function (extensions) {
            var extension = _.find(extensions, function (extension) { return extension.name == name; });
            if (extension == null) {
                return [];
            }
            else {
                return _.filter(_.difference(extension.argumentNames, used), function (argumentName) { return argumentName.indexOf(current) == 0; });
            }
        });
    };
    QueryExtensionAddon.prototype.hash = function () {
        return;
    };
    QueryExtensionAddon.INDEX = 62;
    return QueryExtensionAddon;
}());
exports.QueryExtensionAddon = QueryExtensionAddon;


/***/ }),

/***/ 390:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var ComponentOptionsModel_1 = __webpack_require__(25);
var OmniboxEvents_1 = __webpack_require__(31);
var StringUtils_1 = __webpack_require__(19);
var SuggestionsCache_1 = __webpack_require__(356);
var _ = __webpack_require__(0);
var QuerySuggestAddon = /** @class */ (function () {
    function QuerySuggestAddon(omnibox) {
        var _this = this;
        this.omnibox = omnibox;
        this.cache = new SuggestionsCache_1.SuggestionsCache();
        Dom_1.$$(this.omnibox.element).on(OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (e, args) {
            args.suggestions.push(_this.getSuggestion());
        });
    }
    QuerySuggestAddon.suggestiontHtml = function (suggestion) {
        return suggestion.highlighted.replace(/\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g, function (part, notMatched, matched, corrected) {
            var className = '';
            if (matched) {
                className = 'coveo-omnibox-hightlight';
            }
            if (corrected) {
                className = 'coveo-omnibox-hightlight2';
            }
            var ret;
            if (className) {
                ret = Dom_1.$$('span', {
                    className: className
                });
            }
            else {
                ret = Dom_1.$$('span');
            }
            ret.text(notMatched || matched || corrected);
            return ret.el.outerHTML;
        });
    };
    QuerySuggestAddon.isPartialMatch = function (suggestion) {
        // groups : 1=notMatched, 2=matched, 3=corrected
        var parts = StringUtils_1.StringUtils.match(suggestion.highlighted, /\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g);
        var firstFail = _.find(parts, function (part) { return part[1] != null; });
        // if no fail found, this is a partial or a full match
        if (firstFail == null) {
            return true;
        }
        // if all right parts are notMatched, the right parts is autocomplete
        return _.every(_.last(parts, _.indexOf(parts, firstFail) - parts.length), function (part) { return part[1] != null; });
    };
    QuerySuggestAddon.prototype.getSuggestion = function () {
        var _this = this;
        var text = this.omnibox.magicBox.getText();
        return this.cache.getSuggestions(text, function () { return _this.getQuerySuggest(text); });
    };
    QuerySuggestAddon.prototype.getQuerySuggest = function (text) {
        var payload = { q: text };
        var locale = String['locale'];
        var searchHub = this.omnibox.getBindings().componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchHub);
        var pipeline = this.omnibox.getBindings().searchInterface.options.pipeline;
        var enableWordCompletion = this.omnibox.options.enableSearchAsYouType;
        var context = this.omnibox.getBindings().searchInterface.getQueryContext();
        if (locale) {
            payload.locale = locale;
        }
        if (searchHub) {
            payload.searchHub = searchHub;
        }
        if (pipeline) {
            payload.pipeline = pipeline;
        }
        if (context) {
            payload.context = context;
        }
        payload.enableWordCompletion = enableWordCompletion;
        return this.omnibox.queryController
            .getEndpoint()
            .getQuerySuggest(payload)
            .then(function (result) {
            var completions = result.completions;
            var results = _.map(completions, function (completion, i) {
                return {
                    html: QuerySuggestAddon.suggestiontHtml(completion),
                    text: completion.expression,
                    index: QuerySuggestAddon.INDEX - i / completions.length,
                    partial: QuerySuggestAddon.isPartialMatch(completion),
                    executableConfidence: completion.executableConfidence
                };
            });
            return results;
        });
    };
    QuerySuggestAddon.INDEX = 60;
    return QuerySuggestAddon;
}());
exports.QuerySuggestAddon = QuerySuggestAddon;
var VoidQuerySuggestAddon = /** @class */ (function () {
    function VoidQuerySuggestAddon() {
    }
    VoidQuerySuggestAddon.prototype.getSuggestion = function () {
        return Promise.resolve([]);
    };
    return VoidQuerySuggestAddon;
}());
exports.VoidQuerySuggestAddon = VoidQuerySuggestAddon;


/***/ }),

/***/ 40:
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
var ExpressionEndOfInput_1 = __webpack_require__(158);
var ExpressionConstant_1 = __webpack_require__(157);
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

/***/ 479:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(40);
var Result_2 = __webpack_require__(40);
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

/***/ 96:
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
var GlobalExports_1 = __webpack_require__(3);
var QueryEvents_1 = __webpack_require__(10);
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(71);
var Assert_1 = __webpack_require__(5);
var Model_1 = __webpack_require__(15);
var QueryStateModel_1 = __webpack_require__(12);
var Strings_1 = __webpack_require__(7);
var Dom_1 = __webpack_require__(1);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var QueryboxQueryParameters_1 = __webpack_require__(352);
var MagicBox_1 = __webpack_require__(161);
var Grammar_1 = __webpack_require__(126);
var QueryboxOptionsProcessing_1 = __webpack_require__(355);
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
         * Specifies whether to enable the search-as-you-type feature.
         *
         * Default value is `false`.
         */
        enableSearchAsYouType: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'SearchAsYouType' }),
        /**
         * If the [`enableSearchAsYouType`]{@link Querybox.options.enableSearchAsYouType} option is `true`, specifies how
         * long to wait (in milliseconds) between each key press before triggering a new query.
         *
         * Default value is `50`. Minimum value is `0`
         */
        searchAsYouTypeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 50, min: 0, section: 'SearchAsYouType' }),
        /**
         * Specifies whether to interpret special query syntax (e.g., `@objecttype=message`) when the end user types
         * a query in the `Querybox` (see
         * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)). Setting this
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
        enableQuerySyntax: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'QuerySyntax' }),
        /**
         * Specifies whether to expand basic expression keywords containing wildcards characters (`*`) to the possible
         * matching keywords in order to broaden the query (see
         * [Using Wildcards in Queries](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=359)).
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
        enableWildcards: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'QuerySyntax' }),
        /**
         * If [`enableWildcards`]{@link Querybox.options.enableWildcards} is `true`, specifies whether to expand basic
         * expression keywords containing question mark characters (`?`) to the possible matching keywords in order to
         * broaden the query (see
         * [Using Wildcards in Queries](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=359)).
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
         * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
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
         * [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option) to a *partial match expression*, so
         * that items containing at least a certain number of those keywords (see the
         * [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option) will match the expression.
         *
         * **Notes:**
         *
         * > - Only the basic expression of the query (see [`q`]{@link q}) can be converted to a partial match expression.
         * > - When the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is set to `true`, this
         * > feature has no effect on a basic expression containing query syntax (field expressions, operators, etc.).
         *
         * **Example:**
         *
         * > With the following markup configuration, if a basic expression contains at least 4 keywords, items containing
         * > at least 75% of those keywords (round up) will match the query.
         * > ```html
         * > <div class='CoveoQuerybox' data-enable-partial-match='true' data-partial-match-keywords='4' data-partial-match-threshold='75%'></div>
         * > ```
         * > For instance, if the basic expression is `Coveo custom component configuration help`, items containing
         * > all 5 of those keywords, or 4 of them (75% of 5 rounded up) will match the query.
         *
         * Default value is `false`, which implies that an item must contain all of the basic expression keywords to match
         * the query.
         * @notSupportedIn salesforcefree
         */
        enablePartialMatch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * The minimum number of keywords that need to be present in a basic expression to convert it to a partial match
         * expression.
         *
         * See also the [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option.
         *
         * **Notes:**
         * > - This option has no meaning unless the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch}
         * > option is set to `true`.
         * > - Repeated keywords in a basic expression count as a single keyword.
         * > - Thesaurus expansions in a basic expression count towards the `partialMatchKeywords` count.
         * > - Stemming expansions **do not** count towards the `partialMatchKeywords` count.
         *
         * **Example:**
         * > If the `partialMatchKeywords` value is `7`, the basic expression will have to contain at least 7 keywords
         * > to be converted to a partial match expression.
         *
         * Default value is `5`.
         * @notSupportedIn salesforcefree
         */
        partialMatchKeywords: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1, depend: 'enablePartialMatch' }),
        /**
         * An absolute or relative value indicating the minimum number (rounded up) of partial match expression keywords an
         * item must contain to match the expression.
         *
         * See also the [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option.
         *
         * **Notes:**
         * > - This option has no meaning unless the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch}
         * > option is set to `true`.
         * > - A keyword and its stemming expansions count as a single keyword when evaluating whether an item meets the
         * > `partialMatchThreshold`.
         *
         * **Examples:**
         * > If the `partialMatchThreshold` value is `50%` and the partial match expression contains exactly 9 keywords,
         * > items will have to contain at least 5 of those keywords to match the query (50% of 9, rounded up).
         *
         * > With the same configuration, if the partial match expression contains exactly 12 keywords, items will have to
         * > contain at least 6 of those keywords to match the query (50% of 12).
         *
         * > If the `partialMatchThreshold` value is `2`, items will always have to contain at least 2 of the partial match
         * > expression keywords to match the query, no matter how many keywords the partial match expression actually
         * > contains.
         *
         * Default value is `50%`.
         * @notSupportedIn salesforcefree
         */
        partialMatchThreshold: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '50%', depend: 'enablePartialMatch' }),
        /**
         * Specifies whether to trigger a query when clearing the `Querybox`.
         *
         * Default value is `false`.
         */
        triggerQueryOnClear: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return Querybox;
}(Component_1.Component));
exports.Querybox = Querybox;
Initialization_1.Initialization.registerAutoCreateComponent(Querybox);


/***/ })

});
//# sourceMappingURL=Searchbox__f056675ccb969b1e6859.js.map