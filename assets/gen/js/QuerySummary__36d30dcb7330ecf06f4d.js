webpackJsonpCoveo__temporary([43],{

/***/ 265:
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
__webpack_require__(635);
var underscore_1 = __webpack_require__(0);
var QueryEvents_1 = __webpack_require__(11);
var QuerySummaryEvents_1 = __webpack_require__(514);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var QueryStateModel_1 = __webpack_require__(13);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var QuerySummaryUtils_1 = __webpack_require__(202);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var AccessibleButton_1 = __webpack_require__(15);
exports.noResultsCssClass = 'coveo-show-if-no-results';
/**
 * The QuerySummary component can display information about the currently displayed range of results (e.g., "Results
 * 1-10 of 123").
 *
 * When the query does not match any items, the QuerySummary component can instead display information to the end users.
 *
 * The information displayed to the end user is customizable through this component.
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
        Dom_1.$$(_this.element).prepend(_this.textContainer);
        return _this;
    }
    QuerySummary.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    QuerySummary.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    QuerySummary.prototype.render = function (data) {
        Dom_1.$$(this.textContainer).empty();
        this.show();
        this.updateNoResultsSnapshot();
        this.hideNoResultsPage();
        if (!this.options.onlyDisplaySearchTips) {
            this.updateSummaryIfResultsWereReceived(data);
        }
        var queryResults = data.results;
        if (queryResults.exception != null && queryResults.exception.code != null) {
            var code = ('QueryException' + queryResults.exception.code).toLocaleString();
            this.textContainer.innerHTML = Strings_1.l('QueryException', code);
        }
        else if (queryResults.results.length == 0) {
            this.updateQueryTagsInNoResultsContainer();
            this.displayInfoOnNoResults();
        }
        else {
            this.lastKnownGoodState = this.queryStateModel.getAttributes();
        }
    };
    QuerySummary.prototype.handleQuerySuccess = function (data) {
        Assert_1.Assert.exists(data);
        this.render(data);
    };
    QuerySummary.prototype.updateSummaryIfResultsWereReceived = function (data) {
        if (!data.results.results.length) {
            return;
        }
        var message = QuerySummaryUtils_1.QuerySummaryUtils.htmlMessage(this.root, data);
        this.textContainer.innerHTML = message;
    };
    QuerySummary.prototype.updateNoResultsSnapshot = function () {
        var noResultsContainer = this.getNoResultsContainer();
        if (this.noResultsSnapshot == null && noResultsContainer) {
            this.noResultsSnapshot = noResultsContainer.innerHTML;
        }
    };
    QuerySummary.prototype.updateQueryTagsInNoResultsContainer = function () {
        var noResultsContainer = this.getNoResultsContainer();
        if (noResultsContainer) {
            noResultsContainer.innerHTML = this.replaceQueryTagsWithHighlightedQuery(this.noResultsSnapshot);
        }
    };
    QuerySummary.prototype.replaceQueryTagsWithHighlightedQuery = function (template) {
        var highlightedQuery = "<span class=\"coveo-highlight\">" + this.sanitizedQuery + "</span>";
        return QuerySummaryUtils_1.QuerySummaryUtils.replaceQueryTags(template, highlightedQuery);
    };
    Object.defineProperty(QuerySummary.prototype, "sanitizedQuery", {
        get: function () {
            return underscore_1.escape(this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.q));
        },
        enumerable: true,
        configurable: true
    });
    QuerySummary.prototype.displayInfoOnNoResults = function () {
        this.showNoResultsPage();
        if (this.options.enableNoResultsFoundMessage) {
            var noResultsFoundMessage = this.getNoResultsFoundMessageElement();
            this.textContainer.appendChild(noResultsFoundMessage.el);
        }
        if (this.options.enableCancelLastAction) {
            var cancelLastAction = this.getCancelLastActionElement();
            this.textContainer.appendChild(cancelLastAction.el);
        }
        if (this.options.enableSearchTips) {
            var searchTipsTitle = this.getSearchTipsTitleElement();
            var searchTipsList = this.getSearchTipsListElement();
            this.textContainer.appendChild(searchTipsTitle.el);
            this.textContainer.appendChild(searchTipsList.el);
        }
    };
    QuerySummary.prototype.hideNoResultsPage = function () {
        var noResultsContainers = this.getAllNoResultsContainer();
        noResultsContainers.forEach(function (noResultsContainer) {
            Dom_1.$$(noResultsContainer).removeClass('coveo-no-results');
        });
    };
    QuerySummary.prototype.showNoResultsPage = function () {
        var noResultsContainers = this.getAllNoResultsContainer();
        noResultsContainers.forEach(function (noResultsContainer) {
            Dom_1.$$(noResultsContainer).addClass('coveo-no-results');
        });
    };
    QuerySummary.prototype.getNoResultsContainer = function () {
        return Dom_1.$$(this.element).find("." + exports.noResultsCssClass);
    };
    QuerySummary.prototype.getAllNoResultsContainer = function () {
        return Dom_1.$$(this.element).findAll("." + exports.noResultsCssClass);
    };
    Object.defineProperty(QuerySummary.prototype, "parsedNoResultsFoundMessage", {
        get: function () {
            if (this.sanitizedQuery.trim() === '') {
                return Strings_1.l('noResult');
            }
            return this.replaceQueryTagsWithHighlightedQuery(this.options.noResultsFoundMessage);
        },
        enumerable: true,
        configurable: true
    });
    QuerySummary.prototype.getNoResultsFoundMessageElement = function () {
        var noResultsFoundMessage = Dom_1.$$('div', {
            className: 'coveo-query-summary-no-results-string'
        }, this.parsedNoResultsFoundMessage);
        return noResultsFoundMessage;
    };
    QuerySummary.prototype.getCancelLastActionElement = function () {
        var _this = this;
        var cancelLastAction = Dom_1.$$('div', {
            className: 'coveo-query-summary-cancel-last'
        }, Strings_1.l('CancelLastAction'));
        new AccessibleButton_1.AccessibleButton()
            .withLabel(Strings_1.l('CancelLastAction'))
            .withElement(cancelLastAction)
            .withSelectAction(function () {
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
        })
            .build();
        return cancelLastAction;
    };
    QuerySummary.prototype.getSearchTipsTitleElement = function () {
        var searchTipsInfo = Dom_1.$$('div', {
            className: 'coveo-query-summary-search-tips-info'
        });
        searchTipsInfo.text(Strings_1.l('SearchTips'));
        return searchTipsInfo;
    };
    QuerySummary.prototype.getSearchTipsListElement = function () {
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
        return searchTips;
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
         * Specifies whether to hide the number of returned results.
         *
         * When this option is set to true, the number of returned results will be hidden from the page, meaning that your end users will not know how many results were returned for their query.
         *
         * Default value is `false`.
         */
        onlyDisplaySearchTips: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies whether to display the {@link QuerySummary.options.noResultsFoundMessage} message when there are no search results.
         *
         * Default value is `true`.
         *
         * @availablesince [August 2018 Release (v2.4609.6)](https://docs.coveo.com/410/#august-2018-release-v246096)
         */
        enableNoResultsFoundMessage: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies a custom message to display when there are no search results.
         *
         * You can refer to the query the end user has entered using the `${query}` query tag.
         *
         * **Example**
         * > For the `noResultFoundMessage` option, you enter `There were no results found for "${query}"`.
         * > Your end user searches for `query without results`, which does not return any result.
         * > On your page, they see this message: `There were no results found for "query without results"`.
         *
         * Default value is `No results for ${query}`.
         *
         * **Note**
         * > If there is no query, the value will fallback to `No results`.
         *
         * @availablesince [August 2018 Release (v2.4609.6)](https://docs.coveo.com/410/#august-2018-release-v246096)
         */
        noResultsFoundMessage: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            localizedString: function () { return Strings_1.l('noResultFor', '${query}'); },
            depend: 'enableNoResultsFoundMessage',
            postProcessing: function (value) {
                return underscore_1.escape(value);
            }
        }),
        /**
         * Specifies whether to display the `Cancel last action` link when there are no search results.
         *
         * When clicked, the link restores the previous query that contained results.
         *
         * Default value is `true`.
         */
        enableCancelLastAction: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to display search tips when there are no search results.
         *
         * Default value is `true`.
         */
        enableSearchTips: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return QuerySummary;
}(Component_1.Component));
exports.QuerySummary = QuerySummary;
Initialization_1.Initialization.registerAutoCreateComponent(QuerySummary);


/***/ }),

/***/ 514:
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

/***/ 635:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=QuerySummary__36d30dcb7330ecf06f4d.js.map