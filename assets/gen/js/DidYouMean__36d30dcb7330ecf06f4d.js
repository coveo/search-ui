webpackJsonpCoveo__temporary([73],{

/***/ 246:
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
__webpack_require__(601);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var QueryEvents_1 = __webpack_require__(11);
var Assert_1 = __webpack_require__(5);
var QueryStateModel_1 = __webpack_require__(13);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var StringUtils_1 = __webpack_require__(22);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
/**
 * The DidYouMean component is responsible for displaying query corrections. If this component is in the page and the
 * query returns no result but finds a possible query correction, the component either suggests the correction or
 * automatically triggers a new query with the suggested term.
 */
var DidYouMean = /** @class */ (function (_super) {
    __extends(DidYouMean, _super);
    /**
     * Creates a new DidYouMean component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the DidYouMean component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function DidYouMean(element, options, bindings) {
        var _this = _super.call(this, element, DidYouMean.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, DidYouMean, options);
        Assert_1.Assert.exists(element);
        Assert_1.Assert.exists(_this.options);
        _this.hideNext = true;
        _this.correctedTerm = null;
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, _this.handlePrepareQueryBuilder);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, _this.handleProcessNewQueryResults);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.noResults, _this.handleNoResults);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.newQuery, _this.handleNewQuery);
        Dom_1.$$(_this.element).hide();
        return _this;
    }
    /**
     * Executes a query with the corrected term.
     * Throws an exception if the corrected term has not been initialized.
     * If successful, logs a `didyoumeanClick` event in the usage analytics.
     */
    DidYouMean.prototype.doQueryWithCorrectedTerm = function () {
        var _this = this;
        Assert_1.Assert.exists(this.correctedTerm);
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, this.correctedTerm);
        this.queryController.deferExecuteQuery({
            beforeExecuteQuery: function () { return _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.didyoumeanClick, {}); }
        });
    };
    DidYouMean.prototype.handleNewQuery = function () {
        if (this.hideNext) {
            Dom_1.$$(this.element).empty();
            Dom_1.$$(this.element).hide();
            this.correctedTerm = null;
        }
        else {
            this.hideNext = true;
        }
    };
    DidYouMean.prototype.handlePrepareQueryBuilder = function (data) {
        Assert_1.Assert.exists(data);
        data.queryBuilder.enableDidYouMean = true;
    };
    DidYouMean.prototype.handleNoResults = function (data) {
        // We do not auto-correct on search-as-you-type queries
        if (Utils_1.Utils.isNonEmptyArray(data.results.queryCorrections) && !data.searchAsYouType && this.options.enableAutoCorrection) {
            var originalQuery = this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.q);
            this.correctedTerm = data.results.queryCorrections[0].correctedQuery;
            var correctedSentence = this.buildCorrectedSentence(data.results.queryCorrections[0]);
            this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, data.results.queryCorrections[0].correctedQuery);
            this.searchInterface.historyManager.replaceState(this.queryStateModel.getAttributes());
            data.retryTheQuery = true;
            this.hideNext = false;
            var noResultsFor = Dom_1.$$('div', { className: 'coveo-did-you-mean-no-results-for' }).el;
            noResultsFor.innerHTML = Strings_1.l('noResultFor', '<span class="coveo-highlight coveo-did-you-mean-highlight">' + StringUtils_1.StringUtils.htmlEncode(originalQuery) + '</span>');
            this.element.appendChild(noResultsFor);
            var automaticCorrect = Dom_1.$$('div', { className: 'coveo-did-you-mean-automatic-correct' }).el;
            automaticCorrect.innerHTML = Strings_1.l('autoCorrectedQueryTo', '<span class="coveo-highlight">' + correctedSentence + '</span>');
            this.element.appendChild(automaticCorrect);
            Dom_1.$$(this.element).show();
            this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.didyoumeanAutomatic, {});
        }
    };
    DidYouMean.prototype.handleProcessNewQueryResults = function (data) {
        var _this = this;
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.results);
        var results = data.results;
        this.logger.trace('Received query results from new query', results);
        if (Utils_1.Utils.isNonEmptyArray(results.queryCorrections)) {
            var correctedSentence = this.buildCorrectedSentence(results.queryCorrections[0]);
            this.correctedTerm = results.queryCorrections[0].correctedQuery;
            var correctedWordEl = Dom_1.$$('button', {}, correctedSentence).el;
            var didYouMean = Dom_1.$$('div', { className: 'coveo-did-you-mean-suggestion' }, Strings_1.l('didYouMean', correctedWordEl.outerHTML));
            this.element.appendChild(didYouMean.el);
            var appendedCorrectedWordEl = didYouMean.find(correctedWordEl.tagName);
            Dom_1.$$(appendedCorrectedWordEl).on('click', function () { return _this.doQueryWithCorrectedTerm(); });
            Dom_1.$$(this.element).show();
        }
    };
    DidYouMean.prototype.buildCorrectedSentence = function (correction) {
        var toReturn = [];
        var tagStart = "<span class='coveo-did-you-mean-word-correction'>";
        var tagEnd = '</span>';
        var currentOffset = 0;
        _.each(correction.wordCorrections, function (wordCorrection) {
            toReturn.push(StringUtils_1.StringUtils.htmlEncode(correction.correctedQuery.slice(currentOffset, wordCorrection.offset)));
            currentOffset = wordCorrection.offset;
            toReturn.push(tagStart);
            toReturn.push(StringUtils_1.StringUtils.htmlEncode(correction.correctedQuery.slice(currentOffset, wordCorrection.length + currentOffset)));
            toReturn.push(tagEnd);
            currentOffset = wordCorrection.offset + wordCorrection.length;
        });
        toReturn.push(StringUtils_1.StringUtils.htmlEncode(correction.correctedQuery.slice(currentOffset)));
        return toReturn.join('');
    };
    DidYouMean.ID = 'DidYouMean';
    DidYouMean.doExport = function () {
        GlobalExports_1.exportGlobally({
            DidYouMean: DidYouMean
        });
    };
    /**
     * The options for the component
     * @componentOptions
     */
    DidYouMean.options = {
        /**
         * Specifies whether the DidYouMean component automatically triggers a new query when a query returns no result and
         * a possible correction is available.
         *
         * Default value is `true`.
         */
        enableAutoCorrection: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return DidYouMean;
}(Component_1.Component));
exports.DidYouMean = DidYouMean;
Initialization_1.Initialization.registerAutoCreateComponent(DidYouMean);


/***/ }),

/***/ 601:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=DidYouMean__36d30dcb7330ecf06f4d.js.map