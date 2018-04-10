webpackJsonpCoveo__temporary([37],{

/***/ 192:
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
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var QueryEvents_1 = __webpack_require__(10);
var Dom_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(5);
var Strings_1 = __webpack_require__(8);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Initialization_1 = __webpack_require__(1);
var QueryStateModel_1 = __webpack_require__(12);
var Globalize = __webpack_require__(25);
var QuerySummaryEvents_1 = __webpack_require__(323);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(406);
/**
 * The QuerySummary component can display information about the currently displayed range of results (e.g., "Results
 * 1-10 of 123").
 *
 * If the query matches no item, the QuerySummary component can instead display tips to help the end user formulate
 * a better query.
 */
var QuerySummary = /** @class */ (function (_super) {
    __extends(QuerySummary, _super);
    /**
     * Creates a new QuerySummary component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the QuerySummary component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function QuerySummary(element, options, bindings) {
        var _this = _super.call(this, element, QuerySummary.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, QuerySummary, options);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (data) { return _this.handleQuerySuccess(data); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return _this.hide(); });
        _this.hide();
        _this.textContainer = Dom_1.$$('span').el;
        _this.element.appendChild(_this.textContainer);
        return _this;
    }
    QuerySummary.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    QuerySummary.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    QuerySummary.prototype.handleQuerySuccess = function (data) {
        Assert_1.Assert.exists(data);
        Dom_1.$$(this.textContainer).empty();
        this.show();
        if (!this.options.onlyDisplaySearchTips) {
            if (data.results.results.length > 0) {
                var first = Globalize.format(data.query.firstResult + 1, 'n0');
                var last = Globalize.format(data.query.firstResult + data.results.results.length, 'n0');
                var totalCount = Globalize.format(data.results.totalCountFiltered, 'n0');
                var highlightFirst = Dom_1.$$('span', { className: 'coveo-highlight' }, first).el;
                var highlightLast = Dom_1.$$('span', { className: 'coveo-highlight' }, last).el;
                var highlightTotal = Dom_1.$$('span', { className: 'coveo-highlight' }, totalCount).el;
                var query = data.query.q ? _.escape(data.query.q.trim()) : '';
                if (query) {
                    var highlightQuery = Dom_1.$$('span', { className: 'coveo-highlight' }, query).el;
                    this.textContainer.innerHTML = Strings_1.l('ShowingResultsOfWithQuery', highlightFirst.outerHTML, highlightLast.outerHTML, highlightTotal.outerHTML, highlightQuery.outerHTML, data.results.results.length);
                }
                else {
                    this.textContainer.innerHTML = Strings_1.l('ShowingResultsOf', highlightFirst.outerHTML, highlightLast.outerHTML, highlightTotal.outerHTML, data.results.results.length);
                }
            }
        }
        if (data.results.exception != null && data.results.exception.code != null) {
            var code = ('QueryException' + data.results.exception.code).toLocaleString();
            this.textContainer.innerHTML = Strings_1.l('QueryException', code);
        }
        else if (data.results.results.length == 0) {
            this.displayInfoOnNoResults();
        }
        else {
            this.lastKnownGoodState = this.queryStateModel.getAttributes();
        }
    };
    QuerySummary.prototype.displayInfoOnNoResults = function () {
        var _this = this;
        var queryEscaped = _.escape(this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.q));
        var noResultsForString;
        if (queryEscaped != '') {
            noResultsForString = Dom_1.$$('div', {
                className: 'coveo-query-summary-no-results-string'
            }, Strings_1.l('noResultFor', Dom_1.$$('span', { className: 'coveo-highlight' }, queryEscaped).el.outerHTML));
        }
        var cancelLastAction = Dom_1.$$('div', {
            className: 'coveo-query-summary-cancel-last'
        }, Strings_1.l('CancelLastAction'));
        cancelLastAction.on('click', function () {
            _this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.noResultsBack, {}, _this.root);
            _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.noResultsBack, {});
            if (_this.lastKnownGoodState) {
                _this.queryStateModel.reset();
                _this.queryStateModel.setMultiple(_this.lastKnownGoodState);
                Dom_1.$$(_this.root).trigger(QuerySummaryEvents_1.QuerySummaryEvents.cancelLastAction);
                _this.queryController.executeQuery();
            }
            else {
                history.back();
            }
        });
        var searchTipsInfo = Dom_1.$$('div', {
            className: 'coveo-query-summary-search-tips-info'
        });
        searchTipsInfo.text(Strings_1.l('SearchTips'));
        var searchTips = Dom_1.$$('ul');
        var checkSpelling = Dom_1.$$('li');
        checkSpelling.text(Strings_1.l('CheckSpelling'));
        var fewerKeywords = Dom_1.$$('li');
        fewerKeywords.text(Strings_1.l('TryUsingFewerKeywords'));
        searchTips.el.appendChild(checkSpelling.el);
        searchTips.el.appendChild(fewerKeywords.el);
        if (this.queryStateModel.atLeastOneFacetIsActive()) {
            var fewerFilter = Dom_1.$$('li');
            fewerFilter.text(Strings_1.l('SelectFewerFilters'));
            searchTips.el.appendChild(fewerFilter.el);
        }
        if (this.options.enableSearchTips) {
            if (noResultsForString) {
                this.textContainer.appendChild(noResultsForString.el);
            }
            this.textContainer.appendChild(cancelLastAction.el);
            this.textContainer.appendChild(searchTipsInfo.el);
            this.textContainer.appendChild(searchTips.el);
        }
        else {
            if (noResultsForString) {
                this.textContainer.appendChild(noResultsForString.el);
            }
            this.textContainer.appendChild(cancelLastAction.el);
        }
    };
    QuerySummary.ID = 'QuerySummary';
    QuerySummary.doExport = function () {
        GlobalExports_1.exportGlobally({
            QuerySummary: QuerySummary
        });
    };
    /**
     * Options for the component
     * @componentOptions
     */
    QuerySummary.options = {
        /**
         * Specifies whether to display the search tips to the end user when there are no search results.
         *
         * Default value is `true`.
         */
        enableSearchTips: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to hide the information about the currently displayed range of results and only display the
         * search tips instead.
         *
         * Default value is `false`.
         */
        onlyDisplaySearchTips: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return QuerySummary;
}(Component_1.Component));
exports.QuerySummary = QuerySummary;
Initialization_1.Initialization.registerAutoCreateComponent(QuerySummary);


/***/ }),

/***/ 323:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class is there to contains the different string definition for all the events related to the {@link AdvancedSearch} component.
 */
var QuerySummaryEvents = /** @class */ (function () {
    function QuerySummaryEvents() {
    }
    /**
     * Triggered when the last action is being cancelled by the query summary component
     *
     * Allows external code to revert their last action.
     * @type {string}
     */
    QuerySummaryEvents.cancelLastAction = 'cancelLastAction';
    return QuerySummaryEvents;
}());
exports.QuerySummaryEvents = QuerySummaryEvents;


/***/ }),

/***/ 406:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=QuerySummary__119648951d2af823e366.js.map