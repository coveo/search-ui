webpackJsonpCoveo__temporary([8],{

/***/ 100:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
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
var TableTemplate_1 = __webpack_require__(442);
var DefaultResultTemplate_1 = __webpack_require__(86);
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var Assert_1 = __webpack_require__(7);
var QueryEvents_1 = __webpack_require__(11);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var QueryUtils_1 = __webpack_require__(19);
var Dom_1 = __webpack_require__(3);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var Initialization_1 = __webpack_require__(2);
var Defer_1 = __webpack_require__(28);
var DeviceUtils_1 = __webpack_require__(22);
var ResultListEvents_1 = __webpack_require__(32);
var ResultLayoutEvents_1 = __webpack_require__(103);
var Utils_1 = __webpack_require__(5);
var DomUtils_1 = __webpack_require__(45);
var DefaultRecommendationTemplate_1 = __webpack_require__(441);
var TemplateList_1 = __webpack_require__(102);
var TemplateCache_1 = __webpack_require__(49);
var ResponsiveDefaultResultTemplate_1 = __webpack_require__(500);
var ResultListRenderer_1 = __webpack_require__(266);
var ResultListTableRenderer_1 = __webpack_require__(502);
var ResultListCardRenderer_1 = __webpack_require__(501);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(493);
__webpack_require__(492);
__webpack_require__(491);
var InitializationPlaceholder_1 = __webpack_require__(252);
var RegisteredNamedMethods_1 = __webpack_require__(46);
/**
 * The ResultList component is responsible for displaying the results of the current query using one or more result
 * templates (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * This component supports many additional features, such as infinite scrolling.
 */
var ResultList = (function (_super) {
    __extends(ResultList, _super);
    /**
     * Creates a new ResultList component. Binds various event related to queries (e.g., on querySuccess ->
     * renderResults). Binds scroll event if {@link ResultList.options.enableInfiniteScroll} is `true`.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the ResultList component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param elementClassId The class that this component should instantiate. Components that extend the base ResultList
     * use this. Default value is `CoveoResultList`.
     */
    function ResultList(element, options, bindings, elementClassId) {
        if (elementClassId === void 0) { elementClassId = ResultList.ID; }
        var _this = _super.call(this, element, elementClassId, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.currentlyDisplayedResults = [];
        _this.reachedTheEndOfResults = false;
        _this.shouldDisplayTableHeader = true;
        _this.shouldDisplayTableFooter = false;
        // This variable serves to block some setup where the framework fails to correctly identify the "real" scrolling container.
        // Since it's not technically feasible to correctly identify the scrolling container in every possible scenario without some very complex logic, we instead try to add some kind of mechanism to
        // block runaway requests where UI will keep asking more results in the index, eventually bringing the browser to it's knee.
        // Those successive request are needed in "displayMoreResults" to ensure we fill the scrolling container correctly.
        // Since the container is not identified correctly, it is never "full", so we keep asking for more.
        // It is reset every time the user actually scroll the container manually.
        _this.successiveScrollCount = 0;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultList, options);
        Assert_1.Assert.exists(element);
        Assert_1.Assert.exists(_this.options);
        Assert_1.Assert.exists(_this.options.resultTemplate);
        Assert_1.Assert.exists(_this.options.infiniteScrollContainer);
        _this.showOrHideElementsDependingOnState(false, false);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.newQuery, function (args) { return _this.handleNewQuery(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function (args) { return _this.handleDuringQuery(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function (args) { return _this.handleQueryError(); });
        Dom_1.$$(_this.root).on(ResultListEvents_1.ResultListEvents.changeLayout, function (e, args) { return _this.handleChangeLayout(args); });
        if (_this.options.enableInfiniteScroll) {
            _this.handlePageChanged();
            _this.bind.on(_this.options.infiniteScrollContainer, 'scroll', function (e) {
                _this.successiveScrollCount = 0;
                _this.handleScrollOfResultList();
            });
        }
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.FIRST, function () { return _this.handlePageChanged(); });
        _this.initResultContainer();
        Assert_1.Assert.exists(_this.options.resultContainer);
        _this.initWaitAnimationContainer();
        Assert_1.Assert.exists(_this.options.waitAnimationContainer);
        _this.setupTemplatesVersusLayouts();
        Dom_1.$$(_this.root).on(ResultLayoutEvents_1.ResultLayoutEvents.populateResultLayout, function (e, args) { return args.layouts.push(_this.options.layout); });
        _this.setupRenderer();
        return _this;
    }
    ResultList.getDefaultTemplate = function (e) {
        var template = ResultList.loadTemplatesFromCache();
        if (template != null) {
            return template;
        }
        var component = Component_1.Component.get(e);
        if (Coveo['Recommendation'] && component.searchInterface instanceof Coveo['Recommendation']) {
            return new DefaultRecommendationTemplate_1.DefaultRecommendationTemplate();
        }
        return new DefaultResultTemplate_1.DefaultResultTemplate();
    };
    ResultList.loadTemplatesFromCache = function () {
        var pageTemplateNames = TemplateCache_1.TemplateCache.getResultListTemplateNames();
        if (pageTemplateNames.length > 0) {
            return new TemplateList_1.TemplateList(_.compact(_.map(pageTemplateNames, function (templateName) { return TemplateCache_1.TemplateCache.getTemplate(templateName); })));
        }
        return null;
    };
    /**
     * Get the fields needed to be automatically included in the query for this result list.
     * @returns {string[]}
     */
    ResultList.prototype.getAutoSelectedFieldsToInclude = function () {
        return _.chain(this.options.resultTemplate.getFields())
            .concat(this.getMinimalFieldsToInclude())
            .compact()
            .unique()
            .value();
    };
    ResultList.prototype.setupTemplatesVersusLayouts = function () {
        var _this = this;
        var layoutClassToAdd = "coveo-" + this.options.layout + "-layout-container";
        Dom_1.$$(this.options.resultContainer).addClass(layoutClassToAdd);
        if (this.options.layout === 'table') {
            this.options.resultTemplate = new TableTemplate_1.TableTemplate(this.options.resultTemplate.templates || []);
        }
        // A TemplateList is the scenario where the result template are directly embedded inside the ResultList
        // This is the typical scenario when a page gets created by the interface editor, for example.
        // In that case, we try to stick closely that what is actually configured inside the page, and do no "special magic".
        // Stick to the "hardcoded" configuration present in the page.
        // We only add the correct layout options if it has not been set manually.
        if (this.options.resultTemplate instanceof TemplateList_1.TemplateList) {
            _.each(this.options.resultTemplate.templates, function (tmpl) {
                if (!tmpl.layout) {
                    tmpl.layout = _this.options.layout;
                }
            });
        }
        else if (this.options.resultTemplate instanceof DefaultResultTemplate_1.DefaultResultTemplate && this.options.layout == 'list') {
            ResponsiveDefaultResultTemplate_1.ResponsiveDefaultResultTemplate.init(this.root, this, this.options);
        }
    };
    /**
     * Empties the current result list content and appends the given array of HTMLElement.
     *
     * Can append to existing elements in the result list, or replace them.
     *
     * Triggers the `newResultsDisplayed` and `newResultDisplayed` events.
     * @param resultsElement
     * @param append
     */
    ResultList.prototype.renderResults = function (resultElements, append) {
        var _this = this;
        if (append === void 0) { append = false; }
        if (!append) {
            this.options.resultContainer.innerHTML = '';
        }
        return this.renderer.renderResults(resultElements, append, this.triggerNewResultDisplayed.bind(this))
            .then(function () { return _this.triggerNewResultsDisplayed(); });
    };
    /**
     * Builds and returns an array of HTMLElement with the given result set.
     * @param results the result set to build an array of HTMLElement from.
     */
    ResultList.prototype.buildResults = function (results) {
        var _this = this;
        var res = [];
        var resultsPromises = _.map(results.results, function (result, index) {
            return _this.buildResult(result).then(function (resultElement) {
                if (resultElement != null) {
                    res.push({ elem: resultElement, idx: index });
                }
                ResultList.resultCurrentlyBeingRendered = null;
                return resultElement;
            });
        });
        // We need to sort by the original index order, because in lazy loading mode, it's possible that results does not gets rendered
        // in the correct order returned by the index, depending on the time it takes to load all the results component for a given result template
        return Promise.all(resultsPromises).then(function () {
            return _.pluck(_.sortBy(res, 'idx'), 'elem');
        });
    };
    /**
     * Builds and returns an HTMLElement for the given result.
     * @param result the result to build an HTMLElement from.
     * @returns {HTMLElement}
     */
    ResultList.prototype.buildResult = function (result) {
        var _this = this;
        Assert_1.Assert.exists(result);
        QueryUtils_1.QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), result);
        QueryUtils_1.QueryUtils.setSearchInterfaceObjectOnQueryResult(this.searchInterface, result);
        ResultList.resultCurrentlyBeingRendered = result;
        return this.options.resultTemplate.instantiateToElement(result, {
            wrapInDiv: true,
            checkCondition: true,
            currentLayout: this.options.layout,
            responsiveComponents: this.searchInterface.responsiveComponents
        }).then(function (resultElement) {
            if (resultElement != null) {
                Component_1.Component.bindResultToElement(resultElement, result);
            }
            _this.currentlyDisplayedResults.push(result);
            return _this.autoCreateComponentsInsideResult(resultElement, result).initResult.then(function () {
                return resultElement;
            });
        });
    };
    /**
     * Executes a query to fetch new results. After the query returns, renders the new results.
     *
     * Asserts that there are more results to display by verifying whether the last query has returned as many results as
     * requested.
     *
     * Asserts that the ResultList is not currently fetching results.
     * @param count The number of results to fetch and display.
     */
    ResultList.prototype.displayMoreResults = function (count) {
        var _this = this;
        Assert_1.Assert.isLargerOrEqualsThan(1, count);
        if (this.isCurrentlyFetchingMoreResults()) {
            this.logger.warn('Ignoring request to display more results since we\'re already doing so');
            return;
        }
        if (!this.hasPotentiallyMoreResultsToDisplay()) {
            this.logger.warn('Ignoring request to display more results since we know there aren\'t more to display');
            return;
        }
        if (this.options.enableInfiniteScrollWaitingAnimation) {
            this.showWaitingAnimationForInfiniteScrolling();
        }
        this.fetchingMoreResults = this.queryController.fetchMore(count);
        this.fetchingMoreResults.then(function (data) {
            Assert_1.Assert.exists(data);
            _this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.pagerScrolling, {}, _this.element);
            var results = data.results;
            _this.reachedTheEndOfResults = count > data.results.length;
            _this.buildResults(data).then(function (elements) {
                _this.renderResults(elements, true);
                _.each(results, function (result) {
                    _this.currentlyDisplayedResults.push(result);
                });
                _this.triggerNewResultsDisplayed();
            });
        });
        this.fetchingMoreResults.finally(function () {
            _this.hideWaitingAnimationForInfiniteScrolling();
            _this.fetchingMoreResults = undefined;
            Defer_1.Defer.defer(function () {
                _this.successiveScrollCount++;
                if (_this.successiveScrollCount <= ResultList.MAX_AMOUNT_OF_SUCESSIVE_REQUESTS) {
                    _this.handleScrollOfResultList();
                }
                else {
                    _this.logger.info("Result list has triggered 5 consecutive queries to try and fill up the scrolling container, but it is still unable to do so");
                    _this.logger.info("Try explicitly setting the 'data-infinite-scroll-container-selector' option on the result list. See : https://coveo.github.io/search-ui/components/resultlist.html#options.infinitescrollcontainer");
                }
            });
        });
        return this.fetchingMoreResults;
    };
    /**
     * Gets the list of currently displayed result.
     * @returns {IQueryResult[]}
     */
    ResultList.prototype.getDisplayedResults = function () {
        return this.currentlyDisplayedResults;
    };
    /**
     * Gets the list of currently displayed result HTMLElement.
     * @returns {HTMLElement[]}
     */
    ResultList.prototype.getDisplayedResultsElements = function () {
        return Dom_1.$$(this.options.resultContainer).findAll('.CoveoResult');
    };
    ResultList.prototype.enable = function () {
        _super.prototype.enable.call(this);
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    ResultList.prototype.disable = function () {
        _super.prototype.disable.call(this);
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    ResultList.prototype.autoCreateComponentsInsideResult = function (element, result) {
        Assert_1.Assert.exists(element);
        var initOptions = this.searchInterface.options.originalOptionsObject;
        var resultComponentBindings = _.extend({}, this.getBindings(), {
            resultElement: element
        });
        var initParameters = {
            options: initOptions,
            bindings: resultComponentBindings,
            result: result
        };
        return Initialization_1.Initialization.automaticallyCreateComponentsInside(element, initParameters);
    };
    ResultList.prototype.triggerNewResultDisplayed = function (result, resultElement) {
        var args = {
            result: result,
            item: resultElement
        };
        Dom_1.$$(this.element).trigger(ResultListEvents_1.ResultListEvents.newResultDisplayed, args);
    };
    ResultList.prototype.triggerNewResultsDisplayed = function () {
        Dom_1.$$(this.element).trigger(ResultListEvents_1.ResultListEvents.newResultsDisplayed, {});
    };
    ResultList.prototype.handleDuringQuery = function () {
        this.logger.trace('Emptying the result container');
        this.cancelFetchingMoreResultsIfNeeded();
        this.showWaitingAnimation();
        this.showOrHideElementsDependingOnState(false, false);
    };
    ResultList.prototype.handleQueryError = function () {
        this.hideWaitingAnimation();
        Dom_1.$$(this.options.resultContainer).empty();
        this.currentlyDisplayedResults = [];
    };
    ResultList.prototype.handleQuerySuccess = function (data) {
        var _this = this;
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.results);
        var results = data.results;
        this.logger.trace('Received query results from new query', results);
        this.hideWaitingAnimation();
        ResultList.resultCurrentlyBeingRendered = undefined;
        this.currentlyDisplayedResults = [];
        this.buildResults(data.results).then(function (elements) {
            _this.renderResults(elements);
            _this.reachedTheEndOfResults = false;
            _this.showOrHideElementsDependingOnState(true, _this.currentlyDisplayedResults.length != 0);
            if (DeviceUtils_1.DeviceUtils.isMobileDevice() && _this.options.mobileScrollContainer != undefined) {
                _this.options.mobileScrollContainer.scrollTop = 0;
            }
            if (_this.options.enableInfiniteScroll && results.results.length == data.queryBuilder.numberOfResults) {
                // This will check right away if we need to add more results to make the scroll container full & scrolling.
                _this.scrollBackToTop();
                _this.handleScrollOfResultList();
            }
        });
    };
    ResultList.prototype.handleScrollOfResultList = function () {
        if (this.isCurrentlyFetchingMoreResults() || !this.options.enableInfiniteScroll) {
            return;
        }
        if (this.isScrollingOfResultListAlmostAtTheBottom() && this.hasPotentiallyMoreResultsToDisplay()) {
            this.displayMoreResults(this.options.infiniteScrollPageSize);
        }
    };
    ResultList.prototype.handlePageChanged = function () {
        var _this = this;
        this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function () {
            setTimeout(function () {
                _this.scrollBackToTop();
            }, 0);
        });
    };
    ResultList.prototype.scrollBackToTop = function () {
        if (this.options.infiniteScrollContainer instanceof Window) {
            var win = this.options.infiniteScrollContainer;
            win.scrollTo(0, 0);
        }
        else {
            var el = this.options.infiniteScrollContainer;
            el.scrollTop = 0;
        }
    };
    ResultList.prototype.handleNewQuery = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
        ResultList.resultCurrentlyBeingRendered = undefined;
    };
    ResultList.prototype.handleBuildingQuery = function (args) {
        var _this = this;
        if (this.options.fieldsToInclude != null) {
            // remove the @
            args.queryBuilder.addFieldsToInclude(_.map(this.options.fieldsToInclude, function (field) { return field.substr(1); }));
        }
        if (this.options.autoSelectFieldsToInclude) {
            var otherResultListsElements = _.reject(Dom_1.$$(this.root).findAll("." + Component_1.Component.computeCssClassName(ResultList)), function (resultListElement) { return resultListElement == _this.element; });
            var otherFields = _.flatten(_.map(otherResultListsElements, function (otherResultListElement) {
                var otherResultListInstance = RegisteredNamedMethods_1.get(otherResultListElement);
                if (otherResultListInstance) {
                    return otherResultListInstance.getAutoSelectedFieldsToInclude();
                }
                else {
                    return [];
                }
            }));
            args.queryBuilder.addRequiredFields(_.unique(otherFields.concat(this.getAutoSelectedFieldsToInclude())));
            args.queryBuilder.includeRequiredFields = true;
        }
    };
    ResultList.prototype.handleChangeLayout = function (args) {
        var _this = this;
        if (args.layout === this.options.layout) {
            this.enable();
            this.options.resultTemplate.layout = this.options.layout;
            if (args.results) {
                // Prevent flickering when switching to a new layout that is empty
                // add a temporary placeholder, the same that is used on initialization
                if (this.options.resultContainer.innerHTML == '') {
                    new InitializationPlaceholder_1.InitializationPlaceholder(this.root, { resultList: true, layout: args.layout });
                }
                Defer_1.Defer.defer(function () {
                    _this.buildResults(args.results).then(function (elements) {
                        _this.renderResults(elements);
                    });
                });
            }
        }
        else {
            this.disable();
        }
    };
    ResultList.prototype.isCurrentlyFetchingMoreResults = function () {
        return Utils_1.Utils.exists(this.fetchingMoreResults);
    };
    ResultList.prototype.getMinimalFieldsToInclude = function () {
        // these fields are needed for analytics click event
        return ['author', 'language', 'urihash', 'objecttype', 'collection', 'source', 'language', 'permanentid'];
    };
    ResultList.prototype.isScrollingOfResultListAlmostAtTheBottom = function () {
        // this is in a try catch because the unit test fail otherwise (Window does not exist for phantom js in the console)
        var isWindow;
        try {
            isWindow = this.options.infiniteScrollContainer instanceof Window;
        }
        catch (e) {
            isWindow = false;
        }
        return isWindow ? this.isScrollAtBottomForWindowElement() : this.isScrollAtBottomForHtmlElement();
    };
    ResultList.prototype.isScrollAtBottomForWindowElement = function () {
        var win = new Dom_1.Win(window);
        var windowHeight = win.height();
        var scrollTop = win.scrollY();
        var bodyHeight = new Dom_1.Doc(document).height();
        return bodyHeight - (windowHeight + scrollTop) < windowHeight / 2;
    };
    ResultList.prototype.isScrollAtBottomForHtmlElement = function () {
        var el = this.options.infiniteScrollContainer;
        var elementHeight = el.clientHeight;
        var scrollHeight = el.scrollHeight;
        var bottomPosition = el.scrollTop + elementHeight;
        return (scrollHeight - bottomPosition) < elementHeight / 2;
    };
    ResultList.prototype.hasPotentiallyMoreResultsToDisplay = function () {
        return this.currentlyDisplayedResults.length > 0 && !this.reachedTheEndOfResults;
    };
    ResultList.prototype.cancelFetchingMoreResultsIfNeeded = function () {
        if (this.isCurrentlyFetchingMoreResults()) {
            this.logger.trace('Cancelling fetching more results');
            Promise.reject(this.fetchingMoreResults);
            this.fetchingMoreResults = undefined;
        }
    };
    ResultList.prototype.showOrHideElementsDependingOnState = function (hasQuery, hasResults) {
        var showIfQuery = Dom_1.$$(this.element).findAll('.coveo-show-if-query');
        var showIfNoQuery = Dom_1.$$(this.element).findAll('.coveo-show-if-no-query');
        var showIfResults = Dom_1.$$(this.element).findAll('.coveo-show-if-results');
        var showIfNoResults = Dom_1.$$(this.element).findAll('.coveo-show-if-no-results');
        _.each(showIfQuery, function (s) {
            Dom_1.$$(s).toggle(hasQuery);
        });
        _.each(showIfNoQuery, function (s) {
            Dom_1.$$(s).toggle(!hasQuery);
        });
        _.each(showIfResults, function (s) {
            Dom_1.$$(s).toggle(hasQuery && hasResults);
        });
        _.each(showIfNoResults, function (s) {
            Dom_1.$$(s).toggle(hasQuery && !hasResults);
        });
    };
    ResultList.prototype.showWaitingAnimation = function () {
        switch (this.options.waitAnimation.toLowerCase()) {
            case 'fade':
                Dom_1.$$(this.options.waitAnimationContainer).addClass('coveo-fade-out');
                break;
            case 'spinner':
                _.each(this.options.resultContainer.children, function (child) {
                    Dom_1.$$(child).hide();
                });
                if (Dom_1.$$(this.options.waitAnimationContainer).find('.coveo-wait-animation') == undefined) {
                    this.options.waitAnimationContainer.appendChild(DomUtils_1.DomUtils.getBasicLoadingAnimation());
                }
                break;
        }
    };
    ResultList.prototype.hideWaitingAnimation = function () {
        switch (this.options.waitAnimation.toLowerCase()) {
            case 'fade':
                Dom_1.$$(this.options.waitAnimationContainer).removeClass('coveo-fade-out');
                break;
            case 'spinner':
                var spinner = Dom_1.$$(this.options.waitAnimationContainer).find('.coveo-loading-spinner');
                if (spinner) {
                    Dom_1.$$(spinner).detach();
                }
                break;
        }
    };
    ResultList.prototype.showWaitingAnimationForInfiniteScrolling = function () {
        var spinner = DomUtils_1.DomUtils.getLoadingSpinner();
        if (this.options.layout == 'card' && this.options.enableInfiniteScroll) {
            var previousSpinnerContainer = Dom_1.$$(this.options.waitAnimationContainer).findAll('.coveo-loading-spinner-container');
            _.each(previousSpinnerContainer, function (previousSpinner) { return Dom_1.$$(previousSpinner).remove(); });
            var spinnerContainer = Dom_1.$$('div', {
                className: 'coveo-loading-spinner-container'
            });
            spinnerContainer.append(spinner);
            this.options.waitAnimationContainer.appendChild(spinnerContainer.el);
        }
        else {
            this.options.waitAnimationContainer.appendChild(DomUtils_1.DomUtils.getLoadingSpinner());
        }
    };
    ResultList.prototype.hideWaitingAnimationForInfiniteScrolling = function () {
        var spinners = Dom_1.$$(this.options.waitAnimationContainer).findAll('.coveo-loading-spinner');
        var containers = Dom_1.$$(this.options.waitAnimationContainer).findAll('.coveo-loading-spinner-container');
        _.each(spinners, function (spinner) { return Dom_1.$$(spinner).remove(); });
        _.each(containers, function (container) { return Dom_1.$$(container).remove(); });
    };
    ResultList.prototype.initResultContainer = function () {
        if (!this.options.resultContainer) {
            var elemType = this.options.layout === 'table' ? 'table' : 'div';
            this.options.resultContainer = Dom_1.$$(elemType, { className: 'coveo-result-list-container' }).el;
            this.element.appendChild(this.options.resultContainer);
        }
    };
    ResultList.prototype.initWaitAnimationContainer = function () {
        if (!this.options.waitAnimationContainer) {
            this.options.waitAnimationContainer = this.options.resultContainer;
        }
    };
    ResultList.prototype.setupRenderer = function () {
        var autoCreateComponentsFn = this.autoCreateComponentsInsideResult.bind(this);
        switch (this.options.layout) {
            case 'card':
                this.renderer = new ResultListCardRenderer_1.ResultListCardRenderer(this.options, autoCreateComponentsFn);
                break;
            case 'table':
                this.renderer = new ResultListTableRenderer_1.ResultListTableRenderer(this.options, autoCreateComponentsFn);
                break;
            case 'list':
            default:
                this.renderer = new ResultListRenderer_1.ResultListRenderer(this.options, autoCreateComponentsFn);
                break;
        }
    };
    return ResultList;
}(Component_1.Component));
ResultList.ID = 'ResultList';
ResultList.doExport = function () {
    GlobalExports_1.exportGlobally({
        'ResultList': ResultList
    });
};
/**
 * The options for the ResultList
 * @componentOptions
 */
ResultList.options = {
    /**
     * Specifies the element within which to insert the rendered templates for results.
     *
     * Performing a new query clears the content of this element.
     *
     * You can change the container by specifying its selector (e.g.,
     * `data-result-container-selector='#someCssSelector'`).
     *
     * If you specify no value for this option, a `div` element will be dynamically created and appended to the result
     * list. This element will then be used as a result container.
     */
    resultContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption(),
    resultTemplate: ComponentOptions_1.ComponentOptions.buildTemplateOption({ defaultFunction: ResultList.getDefaultTemplate }),
    /**
     * Specifies the type of animation to display while waiting for a query to return.
     *
     * The possible values are:
     * - `fade`: Fades out the current list of results while the query is executing.
     * - `spinner`: Shows a spinning animation while the query is executing.
     * - `none`: Use no animation during queries.
     *
     * See also {@link ResultList.options.waitAnimationContainer}.
     *
     * Default value is `none`.
     */
    waitAnimation: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'none' }),
    /**
     * Specifies the element inside which to display the {@link ResultList.options.waitAnimation}.
     *
     * You can change this by specifying a CSS selector (e.g.,
     * `data-wait-animation-container-selector='#someCssSelector'`).
     *
     * Default value is the value of {@link ResultList.options.resultContainer}.
     */
    waitAnimationContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption({ postProcessing: function (value, options) { return value || options.resultContainer; } }),
    /**
     * Specifies whether to automatically retrieve an additional page of results and append it to the
     * results that the ResultList is currently displaying when the user scrolls down to the bottom of the infinite
     * scroll container.
     *
     * See also {@link ResultList.options.infiniteScrollPageSize}, {@link ResultList.options.infiniteScrollContainer}
     * and {@link ResultList.options.enableInfiniteScrollWaitingAnimation}.
     *
     * It is important to specify the {@link ResultList.options.infiniteScrollContainer} manually if you want the scrolling
     * element to be something else than the default `window` element.
     * Otherwise, you might get in a weird state where the framework will rapidly trigger multiple successive query.
     *
     * Default value is `false`.
     */
    enableInfiniteScroll: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * If {@link ResultList.options.enableInfiniteScroll} is `true`, specifies the number of additional results to fetch
     * when the user scrolls down to the bottom of the {@link ResultList.options.infiniteScrollContainer}.
     *
     * Default value is `10`. Minimum value is `1`.
     */
    infiniteScrollPageSize: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableInfiniteScroll' }),
    /**
     * If {@link ResultList.options.enableInfiniteScroll} is `true`, specifies the element that triggers the fetching of
     * additional results when the end user scrolls down to its bottom.
     *
     * You can change the container by specifying its selector (e.g.,
     * `data-infinite-scroll-container-selector='#someCssSelector'`).
     *
     * By default, the framework uses the first vertically scrollable parent element it finds, starting from the
     * ResultList element itself. A vertically scrollable element is an element whose CSS `overflow-y` attribute is
     * `scroll`.
     *
     * This implies that if the framework can find no scrollable parent, it uses the window itself as a scrollable
     * container.
     *
     * This heuristic is not perfect, for technical reasons. There are always some corner case CSS combination which the framework will
     * not be able to detect correctly as 'scrollable'.
     *
     * It is highly recommended that you manually set this option if you wish to have something else than `window` be the scrollable element.
     */
    infiniteScrollContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption({ depend: 'enableInfiniteScroll', defaultFunction: function (element) { return ComponentOptions_1.ComponentOptions.findParentScrolling(element); } }),
    /**
     * If {@link ResultList.options.enableInfiniteScroll} is `true`, specifies whether to display the
     * {@link ResultList.options.waitAnimation} while fetching additional results.
     *
     * Default value is `true`.
     */
    enableInfiniteScrollWaitingAnimation: ComponentOptions_1.ComponentOptions.buildBooleanOption({ depend: 'enableInfiniteScroll', defaultValue: true }),
    mobileScrollContainer: ComponentOptions_1.ComponentOptions.buildSelectorOption({ defaultFunction: function () { return document.querySelector('.coveo-results-column'); } }),
    /**
     * Specifies a list of fields to include in the query.
     *
     * Specifying a list of values for this option ensures that the Search API does not send fields that are unnecessary
     * for the UI to function.
     *
     * See also {@link ResultList.options.autoSelectFieldsToInclude}.
     *
     * Default value is `undefined`.
     */
    fieldsToInclude: ComponentOptions_1.ComponentOptions.buildFieldsOption({ includeInResults: true }),
    /**
     * Specifies whether the ResultList should scan its template and discover which fields it needs to render all
     * results.
     *
     * Setting this option to `true` ensures that the Search API does not send fields that are unnecessary for the UI to
     * function.
     *
     * See also {@link ResultList.options.fieldsToInclude}.
     *
     * Default value is `false`.
     *
     * **Note:**
     * > Many interfaces created with the Interface Editor explicitly set this option to `true`.
     */
    autoSelectFieldsToInclude: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies the layout to use for displaying the results within this ResultList. Specifying a value for this option
     * automatically populates a {@link ResultLayout} component with a switcher for the layout.
     *
     * For example, if there are two {@link ResultList} components in the page, one with its
     * {@link ResultList.options.layout} set to `list` and the other with the same option set to `card`, then the
     * ResultLayout component will render two buttons respectively titled **List** and **Card**.
     *
     * See the {@link ValidLayout} type for the list of possible values.
     *
     * Default value is `list`.
     */
    layout: ComponentOptions_1.ComponentOptions.buildStringOption({
        defaultValue: 'list',
        required: true,
    }),
};
ResultList.resultCurrentlyBeingRendered = null;
ResultList.MAX_AMOUNT_OF_SUCESSIVE_REQUESTS = 5;
exports.ResultList = ResultList;
Initialization_1.Initialization.registerAutoCreateComponent(ResultList);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),

/***/ 266:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(8);
var _ = __webpack_require__(1);
var ResultListRenderer = (function () {
    function ResultListRenderer(resultListOptions, autoCreateComponentsFn) {
        this.resultListOptions = resultListOptions;
        this.autoCreateComponentsFn = autoCreateComponentsFn;
    }
    ResultListRenderer.prototype.renderResults = function (resultElements, append, resultDisplayedCallback) {
        var _this = this;
        if (append === void 0) { append = false; }
        return Promise.all([
            this.getStartFragment(resultElements, append),
            this.getEndFragment(resultElements, append)
        ]).then(function (_a) {
            var startFrag = _a[0], endFrag = _a[1];
            var resultsFragment = document.createDocumentFragment();
            if (startFrag) {
                resultsFragment.appendChild(startFrag);
            }
            _.each(resultElements, function (resultElement) {
                resultsFragment.appendChild(resultElement);
                resultDisplayedCallback(Component_1.Component.getResult(resultElement), resultElement);
            });
            if (endFrag) {
                resultsFragment.appendChild(endFrag);
            }
            _this.resultListOptions.resultContainer.appendChild(resultsFragment);
        });
    };
    ResultListRenderer.prototype.getStartFragment = function (resultElements, append) {
        return Promise.resolve(document.createDocumentFragment());
    };
    ResultListRenderer.prototype.getEndFragment = function (resultElements, append) {
        return Promise.resolve(document.createDocumentFragment());
    };
    return ResultListRenderer;
}());
exports.ResultListRenderer = ResultListRenderer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),

/***/ 441:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
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
var Template_1 = __webpack_require__(24);
var DefaultRecommendationTemplate = (function (_super) {
    __extends(DefaultRecommendationTemplate, _super);
    function DefaultRecommendationTemplate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultRecommendationTemplate.prototype.instantiateToString = function (object) {
        var template = "<div class=\"coveo-result-frame\">\n        <div class=\"coveo-result-row\">\n          <div class=\"coveo-result-cell\" style=\"width:40px;text-align:center;vertical-align:middle;\">\n            <span class=\"CoveoIcon\" data-small=\"true\">\n            </span>\n          </div>\n          <div class=\"coveo-result-cell\" style=\"padding:0 0 3px 5px;vertical-align:middle\">\n            <div class=\"coveo-result-row\">\n              <div class=\"coveo-result-cell\" style=\"font-size:10pt;\">\n                <a class=\"CoveoResultLink\" style=\"display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">\n                </a>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>";
        return template;
    };
    DefaultRecommendationTemplate.prototype.instantiateToElement = function (object) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var div = document.createElement('div');
            div.innerHTML = _this.instantiateToString(object);
            resolve(div);
        });
    };
    return DefaultRecommendationTemplate;
}(Template_1.Template));
exports.DefaultRecommendationTemplate = DefaultRecommendationTemplate;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),

/***/ 442:
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
var Template_1 = __webpack_require__(24);
var TemplateList_1 = __webpack_require__(102);
var _ = __webpack_require__(1);
var TableTemplate = (function (_super) {
    __extends(TableTemplate, _super);
    function TableTemplate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultTemplate = "<td><a class=\"CoveoResultLink\"></a></td>\n                             <td><span class=\"CoveoExcerpt\"></span></td>\n                             <td><span class=\"CoveoFieldValue\" data-field=\"@date\" data-helper=\"date\"></span></td>";
        _this.defaultRoledTemplates = {
            'table-header': "<th style=\"width: 40%\">Link</th>\n                     <th>Excerpt</th>\n                     <th style=\"width: 20%\"\n                         class=\"CoveoSort coveo-table-header-sort\"\n                         data-sort-criteria=\"date ascending,date descending\"\n                         data-display-unselected-icon=\"false\">Date</th>",
            'table-footer': "<th>Link</th>\n                     <th>Excerpt</th>\n                     <th>Date</th>"
        };
        return _this;
    }
    TableTemplate.prototype.instantiateRoleToString = function (role) {
        var roledTemplate = _.find(this.templates, function (t) { return t.role === role; });
        if (roledTemplate) {
            return roledTemplate.instantiateToString(undefined, {});
        }
        else {
            return this.defaultRoledTemplates[role];
        }
    };
    TableTemplate.prototype.instantiateRoleToElement = function (role) {
        var _this = this;
        var roledTemplate = _.find(this.templates, function (t) { return t.role === role; });
        if (roledTemplate) {
            return roledTemplate.instantiateToElement(undefined, {});
        }
        else {
            var tmpl = new Template_1.Template(function () { return _this.defaultRoledTemplates[role]; });
            tmpl.layout = 'table';
            return tmpl.instantiateToElement(undefined);
        }
    };
    TableTemplate.prototype.getFallbackTemplate = function () {
        var _this = this;
        return new Template_1.Template(function () { return _this.defaultTemplate; });
    };
    TableTemplate.prototype.hasTemplateWithRole = function (role) {
        return _.find(this.templates, function (t) { return t.role === role; });
    };
    return TableTemplate;
}(TemplateList_1.TemplateList));
exports.TableTemplate = TableTemplate;


/***/ }),

/***/ 491:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 492:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 493:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 500:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveComponentsManager_1 = __webpack_require__(78);
var SearchInterface_1 = __webpack_require__(21);
var ResultList_1 = __webpack_require__(100);
var Dom_1 = __webpack_require__(3);
var Component_1 = __webpack_require__(8);
var Logger_1 = __webpack_require__(14);
var ResponsiveDefaultResultTemplate = (function () {
    function ResponsiveDefaultResultTemplate(coveoRoot, ID, options, responsiveDropdown) {
        this.coveoRoot = coveoRoot;
        this.ID = ID;
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.currentMode = 'large';
    }
    ResponsiveDefaultResultTemplate.init = function (root, component, options) {
        if (!Dom_1.$$(root).find("." + Component_1.Component.computeCssClassName(ResultList_1.ResultList))) {
            var logger = new Logger_1.Logger('ResponsiveDefaultResultTemplate');
            logger.trace('No ResultLayout component found : Cannot instantiate ResponsiveResultLayout');
            return;
        }
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(ResponsiveDefaultResultTemplate, Dom_1.$$(root), ResultList_1.ResultList.ID, component, options);
    };
    ResponsiveDefaultResultTemplate.prototype.registerComponent = function (accept) {
        if (accept instanceof ResultList_1.ResultList) {
            this.resultList = accept;
            return true;
        }
        return false;
    };
    ResponsiveDefaultResultTemplate.prototype.handleResizeEvent = function () {
        var _this = this;
        var lastResults = this.resultList.queryController.getLastResults();
        if (this.needSmallMode()) {
            Dom_1.$$(this.resultList.options.resultContainer).addClass('coveo-card-layout-container');
            Dom_1.$$(this.resultList.options.resultContainer).removeClass("coveo-list-layout-container");
            if (this.currentMode != 'small') {
                if (lastResults) {
                    this.resultList.buildResults(lastResults).then(function (elements) {
                        _this.resultList.renderResults(elements);
                    });
                }
                this.currentMode = 'small';
            }
        }
        else {
            Dom_1.$$(this.resultList.options.resultContainer).removeClass('coveo-card-layout-container');
            Dom_1.$$(this.resultList.options.resultContainer).addClass("coveo-list-layout-container");
            if (this.currentMode != 'large') {
                if (lastResults) {
                    this.resultList.buildResults(lastResults).then(function (elements) {
                        _this.resultList.renderResults(elements);
                    });
                }
                this.currentMode = 'large';
            }
        }
    };
    ResponsiveDefaultResultTemplate.prototype.needSmallMode = function () {
        return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getSmallScreenWidth();
    };
    return ResponsiveDefaultResultTemplate;
}());
exports.ResponsiveDefaultResultTemplate = ResponsiveDefaultResultTemplate;


/***/ }),

/***/ 501:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
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
var ResultListRenderer_1 = __webpack_require__(266);
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
var ResultListCardRenderer = (function (_super) {
    __extends(ResultListCardRenderer, _super);
    function ResultListCardRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResultListCardRenderer.prototype.getEndFragment = function (resultElements) {
        var _this = this;
        return new Promise(function (resolve) {
            if (!_.isEmpty(resultElements)) {
                // with infinite scrolling, we want the additional results to append at the end of the previous query.
                // For this, we need to remove the padding.
                if (_this.resultListOptions.enableInfiniteScroll) {
                    var needToBeRemoved = Dom_1.$$(_this.resultListOptions.resultContainer).findAll('.coveo-card-layout-padding');
                    _.each(needToBeRemoved, function (toRemove) { return Dom_1.$$(toRemove).remove(); });
                }
                // Used to prevent last card from spanning the grid's whole width
                var emptyCards_1 = document.createDocumentFragment();
                _.times(3, function () { return emptyCards_1.appendChild(Dom_1.$$('div', { className: 'coveo-card-layout coveo-card-layout-padding' }).el); });
                resolve(emptyCards_1);
            }
            resolve(null);
        });
    };
    return ResultListCardRenderer;
}(ResultListRenderer_1.ResultListRenderer));
exports.ResultListCardRenderer = ResultListCardRenderer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),

/***/ 502:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
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
var ResultListRenderer_1 = __webpack_require__(266);
var TableTemplate_1 = __webpack_require__(442);
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
var ResultListTableRenderer = (function (_super) {
    __extends(ResultListTableRenderer, _super);
    function ResultListTableRenderer(resultListOptions, autoCreateComponentsFn) {
        var _this = _super.call(this, resultListOptions, autoCreateComponentsFn) || this;
        _this.resultListOptions = resultListOptions;
        _this.autoCreateComponentsFn = autoCreateComponentsFn;
        _this.shouldDisplayHeader = true;
        _this.shouldDisplayFooter = false;
        if (_this.resultListOptions.resultTemplate instanceof TableTemplate_1.TableTemplate) {
            if (_this.resultListOptions.resultTemplate.hasTemplateWithRole('table-footer')) {
                _this.shouldDisplayFooter = true;
            }
            // If custom templates are defined but no header template, do not display it.
            if (_this.resultListOptions.resultTemplate.templates.length !== 0 && !_this.resultListOptions.resultTemplate.hasTemplateWithRole('table-header')) {
                _this.shouldDisplayHeader = false;
            }
        }
        return _this;
    }
    ResultListTableRenderer.prototype.getStartFragment = function (resultElements, append) {
        if (!append && !_.isEmpty(resultElements) && this.shouldDisplayHeader) {
            return this.renderRoledTemplate('table-header');
        }
    };
    ResultListTableRenderer.prototype.getEndFragment = function (resultElements, append) {
        if (!append && !_.isEmpty(resultElements) && this.shouldDisplayFooter) {
            return this.renderRoledTemplate('table-footer');
        }
    };
    ResultListTableRenderer.prototype.renderRoledTemplate = function (role) {
        return __awaiter(this, void 0, void 0, function () {
            var elem, frag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resultListOptions.resultTemplate.instantiateRoleToElement(role)];
                    case 1:
                        elem = _a.sent();
                        Dom_1.$$(elem).addClass("coveo-result-list-" + role);
                        this.autoCreateComponentsFn(elem, undefined);
                        frag = document.createDocumentFragment();
                        frag.appendChild(elem);
                        return [2 /*return*/, frag];
                }
            });
        });
    };
    return ResultListTableRenderer;
}(ResultListRenderer_1.ResultListRenderer));
exports.ResultListTableRenderer = ResultListTableRenderer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(3);
var InitializationEvents_1 = __webpack_require__(17);
var Component_1 = __webpack_require__(8);
var SearchInterface_1 = __webpack_require__(21);
var Utils_1 = __webpack_require__(5);
var _ = __webpack_require__(1);
var QueryEvents_1 = __webpack_require__(11);
var Logger_1 = __webpack_require__(14);
var ResponsiveComponentsManager = (function () {
    function ResponsiveComponentsManager(root) {
        var _this = this;
        this.disabledComponents = [];
        this.responsiveComponents = [];
        this.coveoRoot = root;
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.dropdownHeadersWrapper = Dom_1.$$('div', { className: ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS });
        this.searchBoxElement = this.getSearchBoxElement();
        this.logger = new Logger_1.Logger(this);
        this.resizeListener = _.debounce(function () {
            if (_this.coveoRoot.width() != 0) {
                _this.addDropdownHeaderWrapperIfNeeded();
                if (_this.shouldSwitchToSmallMode()) {
                    _this.coveoRoot.addClass('coveo-small-interface');
                }
                else if (!_this.shouldSwitchToSmallMode()) {
                    _this.coveoRoot.removeClass('coveo-small-interface');
                }
                _.each(_this.responsiveComponents, function (responsiveComponent) {
                    responsiveComponent.handleResizeEvent();
                });
            }
            else {
                _this.logger.warn("The width of the search interface is 0, cannot dispatch resize events to responsive components. This means that the tabs will not\n        automatically fit in the tab section. Also, the facet and recommendation component will not hide in a menu. Could the search\n        interface display property be none? Could its visibility property be set to hidden? Also, if either of these scenarios happen during\n        loading, it could be the cause of this issue.");
            }
        }, ResponsiveComponentsManager.RESIZE_DEBOUNCE_DELAY, true);
        window.addEventListener('resize', this.resizeListener);
        this.bindNukeEvents();
    }
    // Register takes a class and will instantiate it after framework initialization has completed.
    ResponsiveComponentsManager.register = function (responsiveComponentConstructor, root, ID, component, options) {
        var _this = this;
        // options.initializationEventRoot can be set in some instance (like recommendation) where the root of the interface triggering the init event
        // is different from the one that will be used for calculation size.
        var initEventRoot = options.initializationEventRoot || root;
        initEventRoot.on(InitializationEvents_1.InitializationEvents.afterInitialization, function () {
            if (_this.shouldEnableResponsiveMode(root)) {
                var responsiveComponentsManager = _.find(_this.componentManagers, function (componentManager) { return root.el == componentManager.coveoRoot.el; });
                if (!responsiveComponentsManager) {
                    responsiveComponentsManager = new ResponsiveComponentsManager(root);
                    _this.componentManagers.push(responsiveComponentsManager);
                }
                if (!Utils_1.Utils.isNullOrUndefined(options.enableResponsiveMode) && !options.enableResponsiveMode) {
                    responsiveComponentsManager.disableComponent(ID);
                    return;
                }
                _this.componentInitializations.push({
                    responsiveComponentsManager: responsiveComponentsManager,
                    arguments: [responsiveComponentConstructor, root, ID, component, options]
                });
            }
            _this.remainingComponentInitializations--;
            if (_this.remainingComponentInitializations == 0) {
                _this.instantiateResponsiveComponents(); // necessary to verify if all components are disabled before they are initialized.
                if (root.width() == 0) {
                    var logger = new Logger_1.Logger('ResponsiveComponentsManager');
                    logger.info("Search interface width is 0, cannot dispatch resize events to responsive components. Will try again after first\n          query success.");
                    root.one(QueryEvents_1.QueryEvents.querySuccess, function () {
                        _this.resizeAllComponentsManager();
                    });
                }
                else {
                    _this.resizeAllComponentsManager();
                }
            }
        });
        this.remainingComponentInitializations++;
    };
    ResponsiveComponentsManager.shouldEnableResponsiveMode = function (root) {
        var searchInterface = Component_1.Component.get(root.el, SearchInterface_1.SearchInterface, true);
        return searchInterface instanceof SearchInterface_1.SearchInterface && searchInterface.options.enableAutomaticResponsiveMode;
    };
    ResponsiveComponentsManager.instantiateResponsiveComponents = function () {
        _.each(this.componentInitializations, function (componentInitialization) {
            var responsiveComponentsManager = componentInitialization.responsiveComponentsManager;
            responsiveComponentsManager.register.apply(responsiveComponentsManager, componentInitialization.arguments);
        });
    };
    ResponsiveComponentsManager.resizeAllComponentsManager = function () {
        _.each(this.componentManagers, function (componentManager) {
            componentManager.resizeListener();
        });
    };
    ResponsiveComponentsManager.prototype.register = function (responsiveComponentConstructor, root, ID, component, options) {
        if (this.isDisabled(ID)) {
            return;
        }
        if (!this.isActivated(ID)) {
            var responsiveComponent = new responsiveComponentConstructor(root, ID, options);
            if (this.isTabs(ID)) {
                this.responsiveComponents.push(responsiveComponent);
            }
            else {
                // Tabs need to be rendered last, so any dropdown header(eg: facet) is already there when the responsive tabs check for overflow.
                this.responsiveComponents.unshift(responsiveComponent);
            }
        }
        _.each(this.responsiveComponents, function (responsiveComponent) {
            if (responsiveComponent.registerComponent != null) {
                responsiveComponent.registerComponent(component);
            }
        });
    };
    ResponsiveComponentsManager.prototype.disableComponent = function (ID) {
        this.disabledComponents.push(ID);
    };
    ResponsiveComponentsManager.prototype.isDisabled = function (ID) {
        return _.indexOf(this.disabledComponents, ID) != -1;
    };
    ResponsiveComponentsManager.prototype.shouldSwitchToSmallMode = function () {
        var aComponentNeedsTabSection = this.needDropdownWrapper();
        var reachedBreakpoint = this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getMediumScreenWidth();
        return aComponentNeedsTabSection || reachedBreakpoint;
    };
    ResponsiveComponentsManager.prototype.needDropdownWrapper = function () {
        for (var i = 0; i < this.responsiveComponents.length; i++) {
            var responsiveComponent = this.responsiveComponents[i];
            if (responsiveComponent.needDropdownWrapper && responsiveComponent.needDropdownWrapper()) {
                return true;
            }
        }
        return false;
    };
    ResponsiveComponentsManager.prototype.addDropdownHeaderWrapperIfNeeded = function () {
        if (this.needDropdownWrapper()) {
            var tabSection = Dom_1.$$(this.coveoRoot).find('.coveo-tab-section');
            if (this.searchBoxElement) {
                this.dropdownHeadersWrapper.insertAfter(this.searchBoxElement);
            }
            else if (tabSection) {
                this.dropdownHeadersWrapper.insertAfter(tabSection);
            }
            else {
                this.coveoRoot.prepend(this.dropdownHeadersWrapper.el);
            }
        }
    };
    ResponsiveComponentsManager.prototype.isTabs = function (ID) {
        return ID == 'Tab';
    };
    ResponsiveComponentsManager.prototype.isActivated = function (ID) {
        return _.find(this.responsiveComponents, function (current) { return current.ID == ID; }) != undefined;
    };
    ResponsiveComponentsManager.prototype.getSearchBoxElement = function () {
        var searchBoxElement = this.coveoRoot.find('.coveo-search-section');
        if (searchBoxElement) {
            return searchBoxElement;
        }
        else {
            return this.coveoRoot.find('.CoveoSearchbox');
        }
    };
    ResponsiveComponentsManager.prototype.bindNukeEvents = function () {
        var _this = this;
        Dom_1.$$(this.coveoRoot).on(InitializationEvents_1.InitializationEvents.nuke, function () {
            window.removeEventListener('resize', _this.resizeListener);
        });
    };
    return ResponsiveComponentsManager;
}());
ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS = 'coveo-dropdown-header-wrapper';
ResponsiveComponentsManager.RESIZE_DEBOUNCE_DELAY = 200;
ResponsiveComponentsManager.componentManagers = [];
ResponsiveComponentsManager.remainingComponentInitializations = 0;
ResponsiveComponentsManager.componentInitializations = [];
exports.ResponsiveComponentsManager = ResponsiveComponentsManager;


/***/ })

});
//# sourceMappingURL=ResultList.js.map