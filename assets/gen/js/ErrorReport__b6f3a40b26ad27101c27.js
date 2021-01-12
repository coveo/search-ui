webpackJsonpCoveo__temporary([72],{

/***/ 248:
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
__webpack_require__(605);
var QueryEvents_1 = __webpack_require__(11);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var Dom_1 = __webpack_require__(1);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
/**
 * The ErrorReport component takes care of handling fatal error when doing a query on the index / Search API.
 *
 * For example, the ErrorReport component displays a message when the service responds with a 401 or 503 error. This
 * component also renders a small text area with the JSON content of the error response, for debugging purposes.
 */
var ErrorReport = /** @class */ (function (_super) {
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
        _this.container = Dom_1.$$('div', { className: 'coveo-error-report-container' });
        _this.element.appendChild(_this.container.el);
        if (_this.options.showDetailedError) {
            _this.message = Dom_1.$$('div', {
                className: 'coveo-error-report-message'
            });
            _this.container.append(_this.message.el);
        }
        _this.helpSuggestion = Dom_1.$$('div', {
            className: 'coveo-error-report-help-suggestion'
        });
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
    ErrorReport.prototype.buildOrGetTitleElements = function () {
        var titleElement = Dom_1.$$(this.element).find('.coveo-error-report-title');
        var title;
        if (titleElement) {
            title = Dom_1.$$(titleElement);
        }
        else {
            title = Dom_1.$$('div', { className: 'coveo-error-report-title' });
            this.container.prepend(title.el);
        }
        var firstHeading = title.find('h1');
        if (!firstHeading) {
            firstHeading = Dom_1.$$('h1').el;
            title.append(firstHeading);
        }
        var secondHeading = title.find('h2');
        if (!secondHeading) {
            secondHeading = Dom_1.$$('h2').el;
            title.append(secondHeading);
        }
        return {
            title: title,
            h1: Dom_1.$$(firstHeading),
            h2: Dom_1.$$(secondHeading)
        };
    };
    ErrorReport.prototype.setErrorTitle = function (errorName, helpSuggestion) {
        var errorTitle = {
            h1: errorName ? Strings_1.l(errorName) : Strings_1.l('OopsError'),
            h2: helpSuggestion ? Strings_1.l(helpSuggestion) : Strings_1.l('ProblemPersists')
        };
        var _a = this.buildOrGetTitleElements(), h1 = _a.h1, h2 = _a.h2;
        if (h1 && h2) {
            Dom_1.$$(h1).text(errorTitle.h1);
            Dom_1.$$(h2).text(errorTitle.h2);
        }
    };
    ErrorReport.prototype.buildPrevious = function () {
        var _this = this;
        var previous = Dom_1.$$('span', {
            className: 'coveo-error-report-previous'
        }, Strings_1.l('GoBack'));
        new AccessibleButton_1.AccessibleButton()
            .withElement(previous)
            .withSelectAction(function () { return _this.back(); })
            .withLabel(Strings_1.l('GoBack'))
            .build();
        return previous.el;
    };
    ErrorReport.prototype.buildReset = function () {
        var _this = this;
        var reset = Dom_1.$$('span', {
            className: 'coveo-error-report-clear'
        }, Strings_1.l('Reset'));
        new AccessibleButton_1.AccessibleButton()
            .withElement(reset)
            .withSelectAction(function () { return _this.reset(); })
            .withLabel(Strings_1.l('Reset'))
            .build();
        return reset.el;
    };
    ErrorReport.prototype.buildRetry = function () {
        var _this = this;
        var retry = Dom_1.$$('span', {
            className: 'coveo-error-report-retry'
        }, Strings_1.l('Retry'));
        new AccessibleButton_1.AccessibleButton()
            .withElement(retry)
            .withSelectAction(function () { return _this.retry(); })
            .withLabel(Strings_1.l('Retry'))
            .build();
        return retry.el;
    };
    ErrorReport.prototype.handleNewQuery = function () {
        Dom_1.$$(this.element).hide();
        var _a = this.buildOrGetTitleElements(), h1 = _a.h1, h2 = _a.h2;
        h1.remove();
        h2.remove();
        if (this.closePopup != null) {
            this.closePopup();
        }
    };
    ErrorReport.prototype.handleQueryError = function (data) {
        var _this = this;
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.error);
        if (data.endpoint.options.queryStringArguments.organizationId) {
            this.organizationId = data.endpoint.options.queryStringArguments.organizationId;
        }
        else {
            this.organizationId = Strings_1.l('CoveoOrganization');
        }
        // Do not display the panel if the error is for missing authentication. The
        // appropriate authentication provider should take care of redirecting.
        if (data.error.isMissingAuthentication) {
            return;
        }
        switch (data.error.name) {
            case 'NoEndpointsException':
                this.options.showDetailedError = false;
                this.buildEndpointErrorElements('https://docs.coveo.com/en/331/');
                this.setErrorTitle(Strings_1.l('NoEndpoints', this.organizationId), Strings_1.l('AddSources'));
                break;
            case 'InvalidTokenException':
                this.options.showDetailedError = false;
                this.buildEndpointErrorElements('https://docs.coveo.com/en/56/');
                this.setErrorTitle(Strings_1.l('CannotAccess', this.organizationId), Strings_1.l('InvalidToken'));
                break;
            case 'GroupByAndFacetBothExistingException':
                this.options.showDetailedError = false;
                this.buildEndpointErrorElements('https://docs.coveo.com/en/2917');
                this.setErrorTitle(undefined, Strings_1.l('GroupByAndFacetRequestsCannotCoexist'));
                break;
            default:
                this.buildOptionsElement();
                this.setErrorTitle();
        }
        if (this.options.showDetailedError) {
            this.message.empty();
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
    ErrorReport.prototype.buildOptionsElement = function () {
        var oldOptions = this.container.find('.coveo-error-report-options');
        if (oldOptions) {
            Dom_1.$$(oldOptions).remove();
        }
        var optionsElement = Dom_1.$$('div', { className: 'coveo-error-report-options' });
        optionsElement.el.appendChild(this.buildPrevious());
        optionsElement.el.appendChild(this.buildReset());
        optionsElement.el.appendChild(this.buildRetry());
        this.container.append(optionsElement.el);
    };
    ErrorReport.prototype.buildEndpointErrorElements = function (helpLink) {
        if (helpLink === void 0) { helpLink = 'https://docs.coveo.com/en/331/'; }
        this.helpSuggestion.empty();
        var link = Dom_1.$$('a', {
            href: helpLink,
            className: 'coveo-error-report-help-link'
        });
        link.setHtml(Strings_1.l('CoveoOnlineHelp'));
        this.helpSuggestion.append(link.el);
        this.container.el.insertBefore(this.helpSuggestion.el, this.message.el);
    };
    ErrorReport.ID = 'ErrorReport';
    ErrorReport.doExport = function () {
        GlobalExports_1.exportGlobally({
            ErrorReport: ErrorReport
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
    return ErrorReport;
}(Component_1.Component));
exports.ErrorReport = ErrorReport;
Initialization_1.Initialization.registerAutoCreateComponent(ErrorReport);


/***/ }),

/***/ 605:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ErrorReport__b6f3a40b26ad27101c27.js.map