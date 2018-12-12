webpackJsonpCoveo__temporary([30],{

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

/***/ 200:
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
var ComponentOptions_1 = __webpack_require__(8);
var DeviceUtils_1 = __webpack_require__(22);
var QueryEvents_1 = __webpack_require__(10);
var Model_1 = __webpack_require__(15);
var QueryStateModel_1 = __webpack_require__(12);
var QueryStateModel_2 = __webpack_require__(12);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Initialization_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(5);
var Strings_1 = __webpack_require__(7);
var Dom_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
__webpack_require__(447);
var AccessibleButton_1 = __webpack_require__(17);
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
        var triggeredByPagerOrDebugMode = data && data.origin && (data.origin.type == Pager.ID || data.origin.type == 'Debug');
        if (this.needToReset && !triggeredByPagerOrDebugMode) {
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
                    var page = i;
                    var listItem = Dom_1.$$('li', {
                        className: 'coveo-pager-list-item',
                        tabindex: 0
                    }).el;
                    if (page === this_1.currentPage) {
                        Dom_1.$$(listItem).addClass('coveo-active');
                    }
                    var clickAction = function () { return _this.handleClickPage(page); };
                    new AccessibleButton_1.AccessibleButton()
                        .withElement(listItem)
                        .withLabel(Strings_1.l('PageNumber', i.toString(10)))
                        .withClickAction(clickAction)
                        .withEnterKeyboardAction(clickAction)
                        .build();
                    listItem.appendChild(listItemValue);
                    this_1.list.appendChild(listItem);
                };
                var this_1 = this;
                for (var i = pagerBoundary.start; i <= pagerBoundary.end; i++) {
                    _loop_1(i);
                }
                if (this.options.enableNavigationButton && pagerBoundary.lastResultPage > 1) {
                    this.renderNavigationButton(pagerBoundary);
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
    Pager.prototype.renderNavigationButton = function (pagerBoundary) {
        if (this.currentPage > 1) {
            var previous = this.renderPreviousButton();
            this.list.insertBefore(previous.el, this.list.firstChild);
        }
        if (this.currentPage < pagerBoundary.lastResultPage) {
            var next = this.renderNextButton();
            this.list.appendChild(next.el);
        }
    };
    Pager.prototype.renderPreviousButton = function () {
        var _this = this;
        var previousButton = Dom_1.$$('li', {
            className: 'coveo-pager-previous coveo-pager-anchor coveo-pager-list-item'
        });
        var previousLink = Dom_1.$$('a', {
            title: Strings_1.l('Previous')
        });
        var previousIcon = Dom_1.$$('span', {
            className: 'coveo-pager-previous-icon'
        }, SVGIcons_1.SVGIcons.icons.pagerLeftArrow);
        SVGDom_1.SVGDom.addClassToSVGInContainer(previousIcon.el, 'coveo-pager-previous-icon-svg');
        previousLink.append(previousIcon.el);
        previousButton.append(previousLink.el);
        new AccessibleButton_1.AccessibleButton()
            .withElement(previousButton)
            .withLabel(Strings_1.l('Previous'))
            .withSelectAction(function () { return _this.handleClickPrevious(); })
            .build();
        return previousButton;
    };
    Pager.prototype.renderNextButton = function () {
        var _this = this;
        var nextButton = Dom_1.$$('li', {
            className: 'coveo-pager-next coveo-pager-anchor coveo-pager-list-item'
        });
        var nextLink = Dom_1.$$('a', {
            title: Strings_1.l('Next')
        });
        var nextIcon = Dom_1.$$('span', {
            className: 'coveo-pager-next-icon'
        }, SVGIcons_1.SVGIcons.icons.pagerRightArrow);
        SVGDom_1.SVGDom.addClassToSVGInContainer(nextIcon.el, 'coveo-pager-next-icon-svg');
        nextLink.append(nextIcon.el);
        nextButton.append(nextLink.el);
        new AccessibleButton_1.AccessibleButton()
            .withElement(nextButton)
            .withLabel(Strings_1.l('Next'))
            .withSelectAction(function () { return _this.handleClickNext(); })
            .build();
        return nextButton;
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

/***/ 367:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 447:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Pager__f056675ccb969b1e6859.js.map