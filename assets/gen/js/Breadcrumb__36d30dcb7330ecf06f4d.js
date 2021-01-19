webpackJsonpCoveo__temporary([75],{

/***/ 239:
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
__webpack_require__(597);
var underscore_1 = __webpack_require__(0);
var BreadcrumbEvents_1 = __webpack_require__(34);
var InitializationEvents_1 = __webpack_require__(17);
var QueryEvents_1 = __webpack_require__(11);
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var Dom_1 = __webpack_require__(1);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
/**
 * The Breadcrumb component displays a summary of the currently active query filters.
 *
 * For example, when the user selects a {@link Facet} value, the breadcrumbs display this value.
 *
 * The active filters are obtained by the component by firing an event in the Breadcrumb component.
 *
 * All other components having an active state can react to this event by providing custom bits of HTML to display
 * inside the breadcrumbs.
 *
 * Thus, it is possible to easily extend the Breadcrumb component using custom code to display information about custom
 * states and filters.
 *
 * See {@link BreadcrumbEvents} for the list of events and parameters sent when a Breadcrumb component is populated.
 */
var Breadcrumb = /** @class */ (function (_super) {
    __extends(Breadcrumb, _super);
    /**
     * Creates a new Breadcrumb component. Binds event on {@link QueryEvents.deferredQuerySuccess} to draw the
     * breadcrumbs.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Breadcrumb component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Breadcrumb(element, options, bindings) {
        var _this = _super.call(this, element, Breadcrumb.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Breadcrumb, options);
        _this.bind.oneRootElement(InitializationEvents_1.InitializationEvents.afterInitialization, function () { return _this.handleAfterInitialization(); });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.redrawBreadcrumb, function () { return _this.redrawBreadcrumb(); });
        _this.element.style.display = 'none';
        _this.element.setAttribute('tabindex', '-1');
        _this.addDefaultAccessibilityAttributes();
        return _this;
    }
    /**
     * Triggers the event to populate the breadcrumbs. Components such as {@link Facet} can populate the breadcrumbs.
     *
     * This method triggers a {@link BreadcrumbEvents.populateBreadcrumb} event with an
     * {@link IPopulateBreadcrumbEventArgs} object (an array) that other components or code can populate.
     * @returns {IBreadcrumbItem[]} A populated breadcrumb item list.
     */
    Breadcrumb.prototype.getBreadcrumbs = function () {
        var args = { breadcrumbs: [] };
        this.bind.trigger(this.root, BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, args);
        this.logger.debug('Retrieved breadcrumbs', args.breadcrumbs);
        // If newly received breadcrumbs are empty, and last breadcrumbs were not.
        // this means end user removed the last filter:
        // We want to shift keyboard focus to the result list container in that case, for ease of use of the interface
        // https://coveord.atlassian.net/browse/JSUI-3078
        if (underscore_1.isEmpty(args.breadcrumbs) && !underscore_1.isEmpty(this.lastBreadcrumbs)) {
            this.focusFirstEnabledResultList();
        }
        this.lastBreadcrumbs = args.breadcrumbs;
        return args.breadcrumbs;
    };
    /**
     * Triggers the event to clear the current breadcrumbs that components such as {@link Facet} can populate.
     *
     * Also triggers a new query and logs the `breadcrumbResetAll` event in the usage analytics.
     */
    Breadcrumb.prototype.clearBreadcrumbs = function () {
        var args = {};
        this.bind.trigger(this.root, BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, args);
        this.logger.debug('Clearing breadcrumbs');
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbResetAll, {});
        this.queryController.executeQuery();
    };
    /**
     * Draws the specified breadcrumb items.
     * @param breadcrumbs The breadcrumb items to draw.
     */
    Breadcrumb.prototype.drawBreadcrumb = function (breadcrumbs) {
        var _this = this;
        Dom_1.$$(this.element).empty();
        if (breadcrumbs.length != 0) {
            this.element.style.display = '';
        }
        else {
            this.element.style.display = 'none';
        }
        var breadcrumbItems = document.createElement('div');
        Dom_1.$$(breadcrumbItems).addClass('coveo-breadcrumb-items');
        this.element.appendChild(breadcrumbItems);
        underscore_1.each(breadcrumbs, function (bcrumb) {
            var elem = bcrumb.element;
            Dom_1.$$(elem).addClass('coveo-breadcrumb-item');
            breadcrumbItems.appendChild(elem);
        });
        var clearText = Dom_1.$$('div', undefined, Strings_1.l('ClearAllFilters')).el;
        var clear = Dom_1.$$('div', {
            className: 'coveo-breadcrumb-clear-all',
            title: Strings_1.l('ClearAllFilters')
        }, clearText).el;
        new AccessibleButton_1.AccessibleButton()
            .withElement(clear)
            .withSelectAction(function () { return _this.clearBreadcrumbs(); })
            .withOwner(this.bind)
            .withLabel(Strings_1.l('ClearAllFilters'))
            .build();
        this.element.appendChild(clear);
    };
    Breadcrumb.prototype.redrawBreadcrumb = function () {
        this.lastBreadcrumbs ? this.drawBreadcrumb(this.lastBreadcrumbs) : this.drawBreadcrumb(this.getBreadcrumbs());
    };
    Breadcrumb.prototype.handleDeferredQuerySuccess = function () {
        this.drawBreadcrumb(this.getBreadcrumbs());
    };
    Breadcrumb.prototype.handleQueryError = function () {
        this.drawBreadcrumb(this.getBreadcrumbs());
    };
    Breadcrumb.prototype.handleAfterInitialization = function () {
        var _this = this;
        // We must bind to these events after the initialization to make sure the breadcrumb generation
        // is made with updated components. (E.G facet, facetrange, ...)
        this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function () { return _this.handleDeferredQuerySuccess(); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return _this.handleQueryError(); });
    };
    Breadcrumb.prototype.focusFirstEnabledResultList = function () {
        var resultLists = this.searchInterface.getComponents('ResultList');
        var firstEnabledResultList = underscore_1.find(resultLists, function (resultList) { return resultList.disabled === false; });
        if (firstEnabledResultList) {
            // Problem with types definition of TypeScript 2.8
            // default .focus() definition is incomplete.
            // force cast to any
            firstEnabledResultList.element.focus({ preventScroll: true });
        }
    };
    Breadcrumb.prototype.addDefaultAccessibilityAttributes = function () {
        if (!this.element.getAttribute('role')) {
            this.element.setAttribute('role', 'navigation');
        }
        if (!this.element.getAttribute('aria-label')) {
            this.element.setAttribute('aria-label', Strings_1.l('Breadcrumb'));
        }
    };
    Breadcrumb.ID = 'Breadcrumb';
    Breadcrumb.options = {};
    Breadcrumb.doExport = function () {
        GlobalExports_1.exportGlobally({
            Breadcrumb: Breadcrumb
        });
    };
    return Breadcrumb;
}(Component_1.Component));
exports.Breadcrumb = Breadcrumb;
Initialization_1.Initialization.registerAutoCreateComponent(Breadcrumb);


/***/ }),

/***/ 597:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Breadcrumb__36d30dcb7330ecf06f4d.js.map