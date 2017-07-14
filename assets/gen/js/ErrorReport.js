webpackJsonpCoveo__temporary([60],{

/***/ 296:
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
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var Dom_1 = __webpack_require__(3);
var QueryEvents_1 = __webpack_require__(11);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var Strings_1 = __webpack_require__(10);
var Assert_1 = __webpack_require__(7);
var Initialization_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(587);
/**
 * The ErrorReport component takes care of handling fatal error when doing a query on the index / Search API.
 *
 * For example, the ErrorReport component displays a message when the service responds with a 401 or 503 error. This
 * component also renders a small text area with the JSON content of the error response, for debugging purposes.
 */
var ErrorReport = (function (_super) {
    __extends(ErrorReport, _super);
    /**
     * Creates a new ErrorReport component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the ErrorReport component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function ErrorReport(element, options, bindings) {
        var _this = _super.call(this, element, ErrorReport.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ErrorReport, options);
        var title = Dom_1.$$('div', { className: 'coveo-error-report-title' }, '<h3></h3><h4></h4>');
        _this.element.appendChild(title.el);
        var optionsElement = Dom_1.$$('div', { className: 'coveo-error-report-options' });
        optionsElement.el.appendChild(_this.buildPrevious());
        optionsElement.el.appendChild(_this.buildReset());
        optionsElement.el.appendChild(_this.buildRetry());
        _this.message = Dom_1.$$('div', {
            className: 'coveo-error-report-message'
        });
        _this.element.appendChild(optionsElement.el);
        _this.element.appendChild(_this.message.el);
        Dom_1.$$(_this.element).hide();
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.newQuery, function () { return _this.handleNewQuery(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function (data) { return _this.handleQueryError(data); });
        return _this;
    }
    /**
     * Performs the "back" action in the browser.
     * Also logs an `errorBack` event in the usage analytics.
     */
    ErrorReport.prototype.back = function () {
        this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.errorBack, {}, this.root);
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.errorBack, {});
        history.back();
    };
    /**
     * Resets the current state of the query and triggers a new query.
     * Also logs an `errorClearQuery` event in the usage analytics.
     */
    ErrorReport.prototype.reset = function () {
        this.queryStateModel.reset();
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.errorClearQuery, {});
        this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.errorClearQuery, {}, this.root);
        this.queryController.executeQuery();
    };
    /**
     * Retries the same query, in case of a temporary service error.
     * Also logs an `errorRetry` event in the usage analytics.
     */
    ErrorReport.prototype.retry = function () {
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.errorRetry, {});
        this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.errorRetry, {}, this.root);
        this.queryController.executeQuery();
    };
    ErrorReport.prototype.setErrorTitle = function () {
        var errorTitle = {
            h3: Strings_1.l('OopsError'),
            h4: Strings_1.l('ProblemPersists')
        };
        var h3 = Dom_1.$$(this.element).find('h3');
        var h4 = Dom_1.$$(this.element).find('h4');
        if (h3 && h4) {
            Dom_1.$$(h3).text(errorTitle.h3);
            Dom_1.$$(h4).text(errorTitle.h4);
        }
    };
    ErrorReport.prototype.buildPrevious = function () {
        var _this = this;
        var previous = Dom_1.$$('span', { className: 'coveo-error-report-previous' }, Strings_1.l('GoBack'));
        previous.on('click', function () { return _this.back(); });
        return previous.el;
    };
    ErrorReport.prototype.buildReset = function () {
        var _this = this;
        var reset = Dom_1.$$('span', {
            className: 'coveo-error-report-clear'
        }, Strings_1.l('Reset'));
        reset.on('click', function () { return _this.reset(); });
        return reset.el;
    };
    ErrorReport.prototype.buildRetry = function () {
        var _this = this;
        var retry = Dom_1.$$('span', {
            className: 'coveo-error-report-retry'
        }, Strings_1.l('Retry'));
        retry.on('click', function () { return _this.retry(); });
        return retry.el;
    };
    ErrorReport.prototype.handleNewQuery = function () {
        Dom_1.$$(this.element).hide();
        if (this.closePopup != null) {
            this.closePopup();
        }
    };
    ErrorReport.prototype.handleQueryError = function (data) {
        var _this = this;
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.error);
        // Do not display the panel if the error is for missing authentication. The
        // appropriate authentication provider should take care of redirecting.
        if (data.error.isMissingAuthentication) {
            return;
        }
        this.message.empty();
        this.setErrorTitle();
        if (this.options.showDetailedError) {
            var moreInfo_1 = Dom_1.$$('span', {
                className: 'coveo-error-report-more-info'
            }, Strings_1.l('MoreInfo'));
            moreInfo_1.on('click', function () {
                moreInfo_1.empty();
                _this.message.el.appendChild(_this.buildErrorInfo(data.error));
            });
            this.message.el.appendChild(moreInfo_1.el);
        }
        Dom_1.$$(this.element).show();
    };
    ErrorReport.prototype.buildErrorInfo = function (data) {
        var errorInfo = Dom_1.$$('div', {
            className: 'coveo-error-info'
        });
        var textArea = Dom_1.$$('textarea', undefined, JSON.stringify(data, null, 2));
        errorInfo.el.appendChild(textArea.el);
        var infoLabel = Dom_1.$$('div', {
            className: 'coveo-error-info-label'
        }, Strings_1.l('CopyPasteToSupport'));
        errorInfo.el.appendChild(infoLabel.el);
        return errorInfo.el;
    };
    return ErrorReport;
}(Component_1.Component));
ErrorReport.ID = 'ErrorReport';
ErrorReport.doExport = function () {
    GlobalExports_1.exportGlobally({
        'ErrorReport': ErrorReport
    });
};
/**
 * The options for the component
 * @componentOptions
 */
ErrorReport.options = {
    /**
     * Specifies whether to display a detailed error message as a JSON in a text content area.
     *
     * Default value is `true`.
     */
    showDetailedError: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
};
exports.ErrorReport = ErrorReport;
Initialization_1.Initialization.registerAutoCreateComponent(ErrorReport);


/***/ }),

/***/ 587:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ErrorReport.js.map