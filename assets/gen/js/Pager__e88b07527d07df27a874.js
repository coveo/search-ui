webpackJsonpCoveo__temporary([38],{

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

/***/ 187:
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
var DeviceUtils_1 = __webpack_require__(21);
var QueryEvents_1 = __webpack_require__(10);
var Model_1 = __webpack_require__(16);
var QueryStateModel_1 = __webpack_require__(12);
var QueryStateModel_2 = __webpack_require__(12);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Initialization_1 = __webpack_require__(1);
var Assert_1 = __webpack_require__(5);
var Strings_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(2);
var KeyboardUtils_1 = __webpack_require__(20);
var GlobalExports_1 = __webpack_require__(3);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
__webpack_require__(403);
/**
 * The Pager component attaches itself to a `div` element and renders widgets that allow the end user to navigate
 * through the different result pages.
 *
 * This component takes care of triggering a query with the correct result range whenever the end user selects a page or
 * uses the navigation buttons (**Previous** and **Next**).
 */
var Pager = /** @class */ (function (_super) {
    __extends(Pager, _super);
    /**
     * Creates a new Pager. Binds multiple query events ({@link QueryEvents.newQuery}, {@link QueryEvents.buildingQuery},
     * {@link QueryEvents.querySuccess}, {@link QueryEvents.queryError} and {@link QueryEvents.noResults}. Renders itself
     * on every query success.
     * @param element The HTMLElement on which to instantiate the component (normally a `div`).
     * @param options The options for the Pager component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Pager(element, options, bindings) {
        var _this = _super.call(this, element, Pager.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.listenToQueryStateChange = true;
        _this.ignoreNextQuerySuccess = false;
        // The normal behavior of this component is to reset to page 1 when a new
        // query is performed by other components (i.e. not pagers).
        //
        // This behavior is overridden when the 'first' state is
        // programmatically modified.
        _this.needToReset = true;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Pager, options);
        _this.currentPage = 1;
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.newQuery, function (args) { return _this.handleNewQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return _this.handleQueryError(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.noResults, function (args) { return _this.handleNoResults(args); });
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_2.QUERY_STATE_ATTRIBUTES.FIRST, function (data) {
            return _this.handleQueryStateModelChanged(data);
        });
        _this.list = document.createElement('ul');
        Dom_1.$$(_this.list).addClass('coveo-pager-list');
        element.appendChild(_this.list);
        return _this;
    }
    /**
     * Sets the current page, then executes a query.
     *
     * Also logs an event in the usage analytics (`pageNumber` by default) with the new current page number as meta data.
     *
     * @param pageNumber The page number to navigate to.
     * @param analyticCause The event to log in the usage analytics.
     */
    Pager.prototype.setPage = function (pageNumber, analyticCause) {
        if (analyticCause === void 0) { analyticCause = AnalyticsActionListMeta_1.analyticsActionCauseList.pagerNumber; }
        Assert_1.Assert.exists(pageNumber);
        this.currentPage = Math.max(Math.min(pageNumber, this.getMaxNumberOfPagesForCurrentResultsPerPage()), 1);
        this.updateQueryStateModel(this.getFirstResultNumber(this.currentPage));
        this.usageAnalytics.logCustomEvent(analyticCause, { pagerNumber: this.currentPage }, this.element);
        this.queryController.executeQuery({
            ignoreWarningSearchEvent: true,
            keepLastSearchUid: true,
            origin: this
        });
    };
    /**
     * Navigates to the previous page, then executes a query.
     *
     * Also logs the `pagePrevious` event in the usage analytics with the new current page number as meta data.
     */
    Pager.prototype.previousPage = function () {
        this.setPage(this.currentPage - 1, AnalyticsActionListMeta_1.analyticsActionCauseList.pagerPrevious);
    };
    /**
     * Navigates to the next page, then executes a query.
     *
     * Also logs the `pageNext` event in the usage analytics with the new current page number as meta data.
     */
    Pager.prototype.nextPage = function () {
        this.setPage(this.currentPage + 1, AnalyticsActionListMeta_1.analyticsActionCauseList.pagerNext);
    };
    Pager.prototype.getMaxNumberOfPagesForCurrentResultsPerPage = function () {
        return Math.ceil(this.options.maximumNumberOfResultsFromIndex / this.searchInterface.resultsPerPage);
    };
    Pager.prototype.handleNewQuery = function (data) {
        var triggeredByPager = data && data.origin && data.origin.type == Pager.ID;
        if (this.needToReset && !triggeredByPager) {
            this.currentPage = 1;
            this.updateQueryStateModel(this.getFirstResultNumber(this.currentPage));
        }
        this.needToReset = true;
    };
    Pager.prototype.updateQueryStateModel = function (attrValue) {
        this.listenToQueryStateChange = false;
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.first, attrValue);
        this.listenToQueryStateChange = true;
    };
    Pager.prototype.handleQueryError = function () {
        this.reset();
    };
    Pager.prototype.handleQuerySuccess = function (data) {
        var _this = this;
        this.reset();
        if (this.ignoreNextQuerySuccess) {
            this.ignoreNextQuerySuccess = false;
        }
        else {
            Assert_1.Assert.isNotUndefined(data);
            var firstResult = data.query.firstResult;
            var count = data.results.totalCountFiltered;
            var pagerBoundary = this.computePagerBoundary(firstResult, count);
            this.currentPage = pagerBoundary.currentPage;
            if (pagerBoundary.end - pagerBoundary.start > 0) {
                var _loop_1 = function (i) {
                    var listItemValue = document.createElement('a');
                    Dom_1.$$(listItemValue).addClass(['coveo-pager-list-item-text', 'coveo-pager-anchor']);
                    Dom_1.$$(listItemValue).text(i.toString(10));
                    var listItem = Dom_1.$$('li', { className: 'coveo-pager-list-item', tabindex: 0 }).el;
                    if (i == this_1.currentPage) {
                        Dom_1.$$(listItem).addClass('coveo-active');
                    }
                    (function (pageNumber) {
                        var clickAction = function () { return _this.handleClickPage(pageNumber); };
                        Dom_1.$$(listItem).on('click', clickAction);
                        Dom_1.$$(listItem).on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, clickAction));
                    })(i);
                    listItem.appendChild(listItemValue);
                    this_1.list.appendChild(listItem);
                };
                var this_1 = this;
                for (var i = pagerBoundary.start; i <= pagerBoundary.end; i++) {
                    _loop_1(i);
                }
                if (this.options.enableNavigationButton && pagerBoundary.lastResultPage > 1) {
                    this.renderNavigationButton(pagerBoundary, this.list);
                }
            }
        }
    };
    Pager.prototype.handleNoResults = function (data) {
        var lastValidPage;
        if (data.results.totalCount > 0) {
            // First scenario : The index returned less results than expected (because of folding).
            // Recalculate the last valid page, and change to that new page.
            var possibleValidPage = this.computePagerBoundary(data.results.totalCountFiltered, data.results.totalCount).lastResultPage;
            if (this.currentPage > possibleValidPage) {
                lastValidPage = possibleValidPage;
            }
        }
        else if (this.currentPage > this.getMaxNumberOfPagesForCurrentResultsPerPage()) {
            // Second scenario : Someone tried to access a non-valid page by the URL for example, which is  higher than the current possible with the number of
            // possible results. The last valid page will be the maximum number of results avaiable from the index.
            lastValidPage = this.getMaxNumberOfPagesForCurrentResultsPerPage();
        }
        // This needs to be deferred because we still want all the "querySuccess" callbacks the complete their execution
        // before triggering/queuing the next query;
        // if we cannot find a lastValidPage to go to, do nothing : this means it's a query that simply return nothing.
        if (lastValidPage != null) {
            this.currentPage = lastValidPage;
            data.retryTheQuery = true;
            this.needToReset = false;
            this.ignoreNextQuerySuccess = false;
            this.updateQueryStateModel(this.getFirstResultNumber(this.currentPage));
        }
    };
    Pager.prototype.reset = function () {
        Dom_1.$$(this.list).empty();
    };
    Pager.prototype.handleBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        var eventArgs = this.getQueryEventArgs();
        data.queryBuilder.firstResult = eventArgs.first;
        // Set the number of results only if it was not already set by external code
        // Most of the time this will be set by either : the SearchInterface with the resultsPerPage option
        // Or by the ResultsPerPage component (so the end user decides).
        // Pager will realistically never set this value itself.
        if (data.queryBuilder.numberOfResults == null) {
            data.queryBuilder.numberOfResults = eventArgs.count;
        }
    };
    Pager.prototype.computePagerBoundary = function (firstResult, totalCount) {
        var resultPerPage = this.searchInterface.resultsPerPage;
        var currentPage = Math.floor(firstResult / resultPerPage) + 1;
        var lastPageNumber = Math.min(Math.ceil(totalCount / resultPerPage), this.getMaxNumberOfPagesForCurrentResultsPerPage());
        lastPageNumber = Math.max(lastPageNumber, 1);
        var halfLength = Math.floor(this.options.numberOfPages / 2);
        var firstPageNumber = currentPage - halfLength;
        firstPageNumber = Math.max(firstPageNumber, 1);
        var endPageNumber = firstPageNumber + this.options.numberOfPages - 1;
        endPageNumber = Math.min(endPageNumber, lastPageNumber);
        return {
            start: firstPageNumber,
            end: endPageNumber,
            lastResultPage: lastPageNumber,
            currentPage: currentPage
        };
    };
    Pager.prototype.renderNavigationButton = function (pagerBoundary, list) {
        var _this = this;
        if (this.currentPage > 1) {
            var previous = document.createElement('li');
            Dom_1.$$(previous).addClass(['coveo-pager-previous', 'coveo-pager-anchor', 'coveo-pager-list-item']);
            var buttonLink = document.createElement('a');
            var buttonIcon = Dom_1.$$('span', { className: 'coveo-pager-previous-icon' }, SVGIcons_1.SVGIcons.icons.pagerLeftArrow).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(buttonIcon, 'coveo-pager-previous-icon-svg');
            buttonLink.appendChild(buttonIcon);
            buttonLink.setAttribute('title', Strings_1.l('Previous'));
            previous.appendChild(buttonLink);
            Dom_1.$$(previous).on('click', function () { return _this.handleClickPrevious(); });
            this.list.insertBefore(previous, this.list.firstChild);
        }
        if (this.currentPage < pagerBoundary.lastResultPage) {
            var next = document.createElement('li');
            Dom_1.$$(next).addClass(['coveo-pager-next', 'coveo-pager-anchor', 'coveo-pager-list-item']);
            var buttonLink = document.createElement('a');
            var buttonIcon = Dom_1.$$('span', { className: 'coveo-pager-next-icon' }, SVGIcons_1.SVGIcons.icons.pagerRightArrow).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(buttonIcon, 'coveo-pager-next-icon-svg');
            buttonLink.appendChild(buttonIcon);
            buttonLink.setAttribute('title', Strings_1.l('Next'));
            next.appendChild(buttonLink);
            Dom_1.$$(next).on('click', function () { return _this.handleClickNext(); });
            this.list.appendChild(next);
        }
    };
    Pager.prototype.handleQueryStateModelChanged = function (data) {
        if (!this.listenToQueryStateChange) {
            return;
        }
        Assert_1.Assert.exists(data);
        this.needToReset = false;
        var firstResult = data.value;
        this.currentPage = this.fromFirstResultsToPageNumber(firstResult);
    };
    Pager.prototype.handleClickPage = function (pageNumber) {
        Assert_1.Assert.exists(pageNumber);
        this.setPage(pageNumber);
    };
    Pager.prototype.handleClickPrevious = function () {
        this.previousPage();
    };
    Pager.prototype.handleClickNext = function () {
        this.nextPage();
    };
    Pager.prototype.fromFirstResultsToPageNumber = function (firstResult) {
        return firstResult / this.searchInterface.resultsPerPage + 1;
    };
    Pager.prototype.getFirstResultNumber = function (pageNumber) {
        if (pageNumber === void 0) { pageNumber = this.currentPage; }
        return (pageNumber - 1) * this.searchInterface.resultsPerPage;
    };
    Pager.prototype.getQueryEventArgs = function () {
        return {
            count: this.searchInterface.resultsPerPage,
            first: this.getFirstResultNumber()
        };
    };
    Pager.ID = 'Pager';
    Pager.doExport = function () {
        GlobalExports_1.exportGlobally({
            Pager: Pager
        });
    };
    /**
     * The options for the Pager
     * @componentOptions
     */
    Pager.options = {
        /**
         * Specifies how many page links to display in the pager.
         *
         * Default value is `5` on a desktop computers and `3` on a mobile device. Minimum value is `1`.
         */
        numberOfPages: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultFunction: function () {
                if (DeviceUtils_1.DeviceUtils.isMobileDevice()) {
                    return 3;
                }
                else {
                    return 5;
                }
            },
            min: 1
        }),
        /**
         * Specifies whether the **Previous** and **Next** buttons should appear at each end of the pager when appropriate.
         *
         * The default value is `true`.
         */
        enableNavigationButton: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies the maximum number of pages to display if enough results are available.
         *
         * This property is typically set when the default number of accessible results from the index has been changed from its default value of `1000` (10 results per page X 100 `maxNumberOfPages`).
         * Default value is `100`
         *
         * @deprecated This is a deprecated option. The `Pager` now automatically adapts itself on each new query, so you no longer need to specify a value for this option. However, if the default maximum number of accessible results value was changed on your Coveo index, you should use the [`maximumNumberOfResultsFromIndex`]{@link Pager.options.maximumNumberOfResultsFromIndex} option to specify the new value.
         */
        maxNumberOfPages: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultValue: undefined,
            deprecated: 'This is a deprecated option. The pager will automatically adapt itself on each new query. You no longer need to specify this option. Use maximumNumberOfResultsFromIndex instead.'
        }),
        /**
         * Specifies the maximum number of results that the index can return for any query.
         *
         * Default value is `1000` in a Coveo index.
         *
         * If this value was modified in your Coveo index, you must specify the new value in this option for the Pager component to work properly
         */
        maximumNumberOfResultsFromIndex: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultValue: 1000
        })
    };
    return Pager;
}(Component_1.Component));
exports.Pager = Pager;
Initialization_1.Initialization.registerAutoCreateComponent(Pager);


/***/ }),

/***/ 403:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Pager__e88b07527d07df27a874.js.map