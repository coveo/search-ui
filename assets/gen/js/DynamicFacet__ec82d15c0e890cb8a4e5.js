webpackJsonpCoveo__temporary([2,17,84],{

/***/ 111:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(7);
var ResultList_1 = __webpack_require__(87);
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var Logger_1 = __webpack_require__(9);
var ResultListUtils = /** @class */ (function () {
    function ResultListUtils() {
    }
    ResultListUtils.hideIfInfiniteScrollEnabled = function (cmp) {
        var infiniteScrollEnabled = ResultListUtils.isInfiniteScrollEnabled(cmp.searchInterface.element);
        if (infiniteScrollEnabled) {
            cmp.disable();
            Dom_1.$$(cmp.element).hide();
            ResultListUtils.warnIfComponentNotNeeded(cmp);
        }
        else {
            cmp.enable();
            Dom_1.$$(cmp.element).unhide();
        }
    };
    ResultListUtils.isInfiniteScrollEnabled = function (root) {
        var resultList = ResultListUtils.getActiveResultList(root);
        return resultList ? !!resultList.options.enableInfiniteScroll : false;
    };
    ResultListUtils.scrollToTop = function (root) {
        var resultList = ResultListUtils.getActiveResultList(root);
        if (!resultList) {
            new Logger_1.Logger(this).warn('No active ResultList, scrolling to the top of the Window');
            return window.scrollTo(0, 0);
        }
        var searchInterfacePosition = resultList.searchInterface.element.getBoundingClientRect().top;
        if (searchInterfacePosition > 0) {
            return;
        }
        var scrollContainer = resultList.options.infiniteScrollContainer;
        if (typeof scrollContainer.scrollTo === 'function') {
            scrollContainer.scrollTo(0, window.pageYOffset + searchInterfacePosition);
        }
        else {
            scrollContainer.scrollTop = 0;
        }
    };
    ResultListUtils.getActiveResultList = function (root) {
        var resultLists = ResultListUtils.getResultLists(root);
        return underscore_1.find(resultLists, function (resultList) { return !resultList.disabled; });
    };
    ResultListUtils.getResultLists = function (root) {
        return Dom_1.$$(root)
            .findAll("." + ResultListUtils.cssClass())
            .map(function (el) { return Component_1.Component.get(el, ResultList_1.ResultList); });
    };
    ResultListUtils.cssClass = function () {
        return Component_1.Component.computeCssClassName(ResultList_1.ResultList);
    };
    ResultListUtils.warnIfComponentNotNeeded = function (cmp) {
        var root = cmp.searchInterface.root;
        var allListsUseInfiniteScroll = ResultListUtils.allResultListsUseInfiniteScroll(root);
        allListsUseInfiniteScroll && ResultListUtils.notNeededComponentWarning(cmp);
    };
    ResultListUtils.allResultListsUseInfiniteScroll = function (root) {
        var listsWithInfiniteScrollDisabled = ResultListUtils.getResultLists(root).filter(function (resultList) { return !resultList.options.enableInfiniteScroll; });
        return listsWithInfiniteScrollDisabled.length === 0;
    };
    ResultListUtils.notNeededComponentWarning = function (cmp) {
        var cmpCssClass = Component_1.Component.computeCssClassNameForType(cmp.type);
        var message = "The " + cmpCssClass + " component is not needed because all " + ResultListUtils.cssClass() + " components have enableInfiniteScroll set to 'true'.\n    For the best performance, remove the " + cmpCssClass + " component from your search page.";
        new Logger_1.Logger(cmp).warn(message);
    };
    return ResultListUtils;
}());
exports.ResultListUtils = ResultListUtils;


/***/ }),

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveDropdownContent_1 = __webpack_require__(88);
var ResponsiveComponentsUtils = /** @class */ (function () {
    function ResponsiveComponentsUtils() {
    }
    ResponsiveComponentsUtils.shouldDrawFacetSlider = function (root, facetSliderElement) {
        return ResponsiveDropdownContent_1.ResponsiveDropdownContent.isTargetInsideOpenedDropdown(facetSliderElement) || !this.isSmallFacetActivated(root);
    };
    ResponsiveComponentsUtils.isSmallTabsActivated = function (root) {
        return root.hasClass(this.smallTabsClassName);
    };
    ResponsiveComponentsUtils.isSmallFacetActivated = function (root) {
        return root.hasClass(this.smallFacetClassName);
    };
    ResponsiveComponentsUtils.isSmallRecommendationActivated = function (root) {
        return root.hasClass(this.smallRecommendationClassName);
    };
    ResponsiveComponentsUtils.activateSmallTabs = function (root) {
        root.addClass(this.smallTabsClassName);
    };
    ResponsiveComponentsUtils.deactivateSmallTabs = function (root) {
        root.removeClass(this.smallTabsClassName);
    };
    ResponsiveComponentsUtils.activateSmallFacet = function (root) {
        root.addClass(this.smallFacetClassName);
    };
    ResponsiveComponentsUtils.deactivateSmallFacet = function (root) {
        root.removeClass(this.smallFacetClassName);
    };
    ResponsiveComponentsUtils.activateSmallRecommendation = function (root) {
        root.addClass(this.smallRecommendationClassName);
    };
    ResponsiveComponentsUtils.deactivateSmallRecommendation = function (root) {
        root.removeClass(this.smallRecommendationClassName);
    };
    ResponsiveComponentsUtils.smallTabsClassName = 'coveo-small-tabs';
    ResponsiveComponentsUtils.smallFacetClassName = 'coveo-small-facets';
    ResponsiveComponentsUtils.smallRecommendationClassName = 'coveo-small-recommendation';
    return ResponsiveComponentsUtils;
}());
exports.ResponsiveComponentsUtils = ResponsiveComponentsUtils;


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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
__webpack_require__(221);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var ResponsiveFacetOptions_1 = __webpack_require__(82);
var ResponsiveDynamicFacets_1 = __webpack_require__(575);
var DynamicFacetBreadcrumbs_1 = __webpack_require__(576);
var DynamicFacetHeader_1 = __webpack_require__(506);
var DynamicFacetValues_1 = __webpack_require__(511);
var QueryEvents_1 = __webpack_require__(11);
var QueryStateModel_1 = __webpack_require__(13);
var DynamicFacetQueryController_1 = __webpack_require__(512);
var Utils_1 = __webpack_require__(4);
var Model_1 = __webpack_require__(18);
var Assert_1 = __webpack_require__(5);
var FacetSortCriteria_1 = __webpack_require__(507);
var Strings_1 = __webpack_require__(6);
var DeviceUtils_1 = __webpack_require__(24);
var BreadcrumbEvents_1 = __webpack_require__(34);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var DynamicFacetSearch_1 = __webpack_require__(578);
var ResultListUtils_1 = __webpack_require__(111);
var FacetRequest_1 = __webpack_require__(180);
var DependsOnManager_1 = __webpack_require__(173);
var DynamicFacetValueCreator_1 = __webpack_require__(581);
var Logger_1 = __webpack_require__(9);
var FacetUtils_1 = __webpack_require__(39);
/**
 * The `DynamicFacet` component displays a *facet* of the results for the current query. A facet is a list of values for a
 * certain field occurring in the results, ordered using a configurable criteria (e.g., number of occurrences).
 *
 * The list of values is obtained using an array of [`FacetRequest`]{@link IFacetRequest} operations performed at the same time
 * as the main query.
 *
 * The `DynamicFacet` component allows the end-user to drill down inside a result set by restricting the result to certain
 * field values.
 *
 * This facet is more easy to use than the original [`Facet`]{@link Facet} component. It implements additional Coveo Machine Learning (Coveo ML) features
 * such as dynamic navigation experience (DNE).
 *
 * @notSupportedIn salesforcefree
 * @availablesince [May 2019 Release (v2.6063)](https://docs.coveo.com/en/2909/)
 */
var DynamicFacet = /** @class */ (function (_super) {
    __extends(DynamicFacet, _super);
    /**
     * Creates a new `DynamicFacet` instance.
     *
     * @param element The element from which to instantiate the component.
     * @param options The component options.
     * @param bindings The component bindings. Automatically resolved by default.
     */
    function DynamicFacet(element, options, bindings, classId) {
        if (classId === void 0) { classId = DynamicFacet.ID; }
        var _this = _super.call(this, element, classId, bindings) || this;
        _this.element = element;
        _this.listenToQueryStateChange = true;
        _this.moreValuesAvailable = false;
        _this.isDynamicFacet = true;
        _this.isFieldValueCompatible = true;
        _this.handleQueryStateChangedIncluded = function (querySelectedValues) {
            var currentSelectedValues = _this.values.selectedValues;
            var validQuerySelectedValues = querySelectedValues.filter(function (value) { return _this.values.get(value); });
            var valuesToSelect = underscore_1.difference(validQuerySelectedValues, currentSelectedValues);
            var valuesToDeselect = underscore_1.difference(currentSelectedValues, validQuerySelectedValues);
            if (Utils_1.Utils.isNonEmptyArray(valuesToSelect)) {
                _this.selectMultipleValues(valuesToSelect);
            }
            if (Utils_1.Utils.isNonEmptyArray(valuesToDeselect)) {
                _this.deselectMultipleValues(valuesToDeselect);
            }
        };
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, DynamicFacet, options);
        _this.initDynamicFacetQueryController();
        _this.initDependsOnManager();
        _this.initQueryEvents();
        _this.initQueryStateEvents();
        _this.initBreadCrumbEvents();
        _this.initComponentStateEvents();
        _this.initValues();
        _this.verifyCollapsingConfiguration();
        _this.isCollapsed = _this.options.enableCollapse && _this.options.collapsedByDefault;
        ResponsiveDynamicFacets_1.ResponsiveDynamicFacets.init(_this.root, _this, _this.options);
        return _this;
    }
    Object.defineProperty(DynamicFacet.prototype, "fieldName", {
        get: function () {
            return this.options.field.slice(1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacet.prototype, "facetType", {
        get: function () {
            return FacetRequest_1.FacetType.specific;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Selects a single value in this facet.
     *
     * Does **not** trigger a query automatically.
     * Does **not** update the visual of the facet until a query is performed.
     *
     * @param value The name of the facet value to select.
     */
    DynamicFacet.prototype.selectValue = function (value) {
        Assert_1.Assert.exists(value);
        this.selectMultipleValues([value]);
    };
    /**
     * Selects multiple values in this facet.
     *
     * Does **not** trigger a query automatically.
     * Does **not** update the visual of the facet until a query is performed.
     *
     * @param values The names of the facet values to select.
     */
    DynamicFacet.prototype.selectMultipleValues = function (values) {
        var _this = this;
        Assert_1.Assert.exists(values);
        this.ensureDom();
        this.logger.info('Selecting facet value(s)', values);
        values.forEach(function (value) {
            _this.values.get(value).select();
        });
        this.updateQueryStateModel();
    };
    /**
     * Deselects a single value in this facet.
     *
     * Does **not** trigger a query automatically.
     * Does **not** update the visual of the facet until a query is performed.
     *
     * @param values The name of the facet value to deselect.
     */
    DynamicFacet.prototype.deselectValue = function (value) {
        Assert_1.Assert.exists(value);
        this.deselectMultipleValues([value]);
    };
    /**
     * Determines whether the specified value is selected in the facet.
     * @param value The name of the facet value to verify.
     */
    DynamicFacet.prototype.hasSelectedValue = function (value) {
        return this.values.hasSelectedValue(value);
    };
    /**
     * Deselects multiple values in this facet.
     *
     * Does **not** trigger a query automatically.
     * Does **not** update the visual of the facet until a query is performed.
     *
     * @param values The names of the facet values to deselect.
     */
    DynamicFacet.prototype.deselectMultipleValues = function (values) {
        var _this = this;
        Assert_1.Assert.exists(values);
        this.ensureDom();
        this.logger.info('Deselecting facet value(s)', values);
        values.forEach(function (value) {
            _this.values.get(value).deselect();
        });
        this.updateQueryStateModel();
    };
    /**
     * Toggles the selection state of a single value in this facet.
     *
     * Does **not** trigger a query automatically.
     *
     * @param values The name of the facet value to toggle.
     */
    DynamicFacet.prototype.toggleSelectValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        var facetValue = this.values.get(value);
        facetValue.toggleSelect();
        this.logger.info('Toggle select facet value', facetValue);
        this.updateQueryStateModel();
    };
    /**
     * Returns the configured caption for a desired facet value.
     *
     * @param value The string facet value whose caption the method should return.
     */
    DynamicFacet.prototype.getCaptionForStringValue = function (value) {
        return FacetUtils_1.FacetUtils.getDisplayValueFromValueCaption(value, this.options.field, this.options.valueCaption);
    };
    /**
     * Requests additional values.
     *
     * Automatically triggers an isolated query.
     * @param additionalNumberOfValues The number of additional values to request. Minimum value is 1. Defaults to the [numberOfValues]{@link DynamicFacet.options.numberOfValues} option value.
     */
    DynamicFacet.prototype.showMoreValues = function (additionalNumberOfValues) {
        var _this = this;
        if (additionalNumberOfValues === void 0) { additionalNumberOfValues = this.options.numberOfValues; }
        this.ensureDom();
        this.logger.info('Show more values');
        this.dynamicFacetQueryController.increaseNumberOfValuesToRequest(additionalNumberOfValues);
        this.triggerNewIsolatedQuery(function () { return _this.logAnalyticsFacetShowMoreLess(AnalyticsActionListMeta_1.analyticsActionCauseList.dynamicFacetShowMore); });
    };
    /**
     * Reduces the number of displayed facet values down to [numberOfValues]{@link DynamicFacet.options.numberOfValues}.
     *
     * Automatically triggers an isolated query.
     */
    DynamicFacet.prototype.showLessValues = function () {
        var _this = this;
        this.ensureDom();
        this.logger.info('Show less values');
        this.dynamicFacetQueryController.resetNumberOfValuesToRequest();
        this.triggerNewIsolatedQuery(function () { return _this.logAnalyticsFacetShowMoreLess(AnalyticsActionListMeta_1.analyticsActionCauseList.dynamicFacetShowLess); });
    };
    /**
     * Deselects all values in this facet.
     *
     * Does **not** trigger a query automatically.
     * Updates the visual of the facet.
     *
     */
    DynamicFacet.prototype.reset = function () {
        this.ensureDom();
        if (this.values.hasActiveValues) {
            this.logger.info('Deselect all values');
            this.values.clearAll();
            this.values.render();
        }
        this.enablePreventAutoSelectionFlag();
        this.updateAppearance();
        this.updateQueryStateModel();
    };
    /**
     * Collapses or expands the facet depending on it's current state.
     */
    DynamicFacet.prototype.toggleCollapse = function () {
        this.isCollapsed ? this.expand() : this.collapse();
    };
    /**
     * Expands the facet, displaying all of its currently fetched values.
     */
    DynamicFacet.prototype.expand = function () {
        if (!this.options.enableCollapse) {
            return this.logger.warn("Calling expand() won't do anything on a facet that has the option \"enableCollapse\" set to \"false\"");
        }
        if (!this.isCollapsed) {
            return;
        }
        this.ensureDom();
        this.logger.info('Expand facet values');
        this.isCollapsed = false;
        this.updateAppearance();
    };
    /**
     * Collapses the facet, displaying only its currently selected values.
     */
    DynamicFacet.prototype.collapse = function () {
        if (!this.options.enableCollapse) {
            return this.logger.warn("Calling collapse() won't do anything on a facet that has the option \"enableCollapse\" set to \"false\"");
        }
        if (this.isCollapsed) {
            return;
        }
        this.ensureDom();
        this.logger.info('Collapse facet values');
        this.isCollapsed = true;
        this.updateAppearance();
    };
    /**
     * Sets a flag indicating whether the facet values should be returned in their current order.
     *
     * Setting the flag to `true` helps ensuring that the values do not move around while the end-user is interacting with them.
     *
     * The flag is automatically set back to `false` after a query is built.
     */
    DynamicFacet.prototype.enableFreezeCurrentValuesFlag = function () {
        this.dynamicFacetQueryController.enableFreezeCurrentValuesFlag();
    };
    /**
     * For this method to work, the component has to be the child of a [DynamicFacetManager]{@link DynamicFacetManager} component.
     *
     * Sets a flag indicating whether the facets should be returned in their current order.
     *
     * Setting the flag to `true` helps ensuring that the facets do not move around while the end-user is interacting with them.
     *
     * The flag is automatically set back to `false` after a query is built.
     */
    DynamicFacet.prototype.enableFreezeFacetOrderFlag = function () {
        this.dynamicFacetQueryController.enableFreezeFacetOrderFlag();
    };
    DynamicFacet.prototype.enablePreventAutoSelectionFlag = function () {
        this.dynamicFacetQueryController.enablePreventAutoSelectionFlag();
    };
    DynamicFacet.prototype.scrollToTop = function () {
        if (this.options.enableScrollToTop) {
            ResultListUtils_1.ResultListUtils.scrollToTop(this.root);
        }
    };
    Object.defineProperty(DynamicFacet.prototype, "analyticsFacetState", {
        get: function () {
            return this.values.activeValues.map(function (facetValue) { return facetValue.analyticsFacetState; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacet.prototype, "basicAnalyticsFacetState", {
        get: function () {
            return {
                field: this.options.field.toString(),
                id: this.options.id,
                title: this.options.title,
                facetType: this.facetType,
                facetPosition: this.position
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacet.prototype, "basicAnalyticsFacetMeta", {
        get: function () {
            return {
                facetField: this.options.field.toString(),
                facetId: this.options.id,
                facetTitle: this.options.title
            };
        },
        enumerable: true,
        configurable: true
    });
    DynamicFacet.prototype.logAnalyticsEvent = function (actionCause, facetMeta) {
        this.usageAnalytics.logSearchEvent(actionCause, facetMeta);
    };
    DynamicFacet.prototype.putStateIntoQueryBuilder = function (queryBuilder) {
        Assert_1.Assert.exists(queryBuilder);
        this.dynamicFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
    };
    DynamicFacet.prototype.putStateIntoAnalytics = function () {
        var pendingEvent = this.usageAnalytics.getPendingSearchEvent();
        pendingEvent && pendingEvent.addFacetState(this.analyticsFacetState);
    };
    DynamicFacet.prototype.isCurrentlyDisplayed = function () {
        return Dom_1.$$(this.element).isVisible();
    };
    Object.defineProperty(DynamicFacet.prototype, "hasActiveValues", {
        get: function () {
            return this.values.hasActiveValues;
        },
        enumerable: true,
        configurable: true
    });
    DynamicFacet.prototype.initQueryEvents = function () {
        var _this = this;
        this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function () { return _this.ensureDom(); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.doneBuildingQuery, function (data) { return _this.handleDoneBuildingQuery(data); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function (data) { return _this.handleQuerySuccess(data.results); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return _this.onNoValues(); });
    };
    DynamicFacet.prototype.initQueryStateEvents = function () {
        this.includedAttributeId = QueryStateModel_1.QueryStateModel.getFacetId(this.options.id);
        this.queryStateModel.registerNewAttribute(this.includedAttributeId, []);
        this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE, undefined, this.handleQueryStateChanged);
    };
    DynamicFacet.prototype.initBreadCrumbEvents = function () {
        var _this = this;
        if (this.options.includeInBreadcrumb) {
            this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) {
                return _this.handlePopulateBreadcrumb(args);
            });
            this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function () { return _this.reset(); });
        }
    };
    DynamicFacet.prototype.initValues = function () {
        this.values = new DynamicFacetValues_1.DynamicFacetValues(this, DynamicFacetValueCreator_1.DynamicFacetValueCreator);
    };
    DynamicFacet.prototype.initComponentStateEvents = function () {
        var componentStateId = QueryStateModel_1.QueryStateModel.getFacetId(this.options.id);
        this.componentStateModel.registerComponent(componentStateId, this);
    };
    DynamicFacet.prototype.initDynamicFacetQueryController = function () {
        this.dynamicFacetQueryController = new DynamicFacetQueryController_1.DynamicFacetQueryController(this);
    };
    DynamicFacet.prototype.handleDoneBuildingQuery = function (data) {
        // If there is a DynamicFacetManager, it will take care of adding the facet's state
        if (this.dynamicFacetManager) {
            return;
        }
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.queryBuilder);
        this.putStateIntoQueryBuilder(data.queryBuilder);
        this.putStateIntoAnalytics();
    };
    DynamicFacet.prototype.handleQuerySuccess = function (results) {
        // If there is a DynamicFacetManager, it will take care of handling the results
        if (this.dynamicFacetManager) {
            return;
        }
        if (Utils_1.Utils.isNullOrUndefined(results.facets)) {
            return this.notImplementedError();
        }
        this.handleQueryResults(results);
    };
    DynamicFacet.prototype.handleQueryResults = function (results) {
        var index = underscore_1.findIndex(results.facets, { facetId: this.options.id });
        var facetResponse = index !== -1 ? results.facets[index] : null;
        this.position = facetResponse ? index + 1 : undefined;
        facetResponse ? this.onNewValues(facetResponse) : this.onNoValues();
        this.header.hideLoading();
        this.updateQueryStateModel();
        this.values.render();
        this.updateAppearance();
    };
    DynamicFacet.prototype.onNewValues = function (facetResponse) {
        this.moreValuesAvailable = facetResponse.moreValuesAvailable;
        this.values.createFromResponse(facetResponse);
    };
    DynamicFacet.prototype.onNoValues = function () {
        this.moreValuesAvailable = false;
        this.values.resetValues();
    };
    DynamicFacet.prototype.handleQueryStateChanged = function (data) {
        if (!this.listenToQueryStateChange) {
            return;
        }
        var querySelectedValues = data.attributes[this.includedAttributeId];
        if (!querySelectedValues) {
            return;
        }
        this.handleQueryStateChangedIncluded(querySelectedValues);
    };
    DynamicFacet.prototype.handlePopulateBreadcrumb = function (args) {
        Assert_1.Assert.exists(args);
        if (!this.values.hasActiveValues) {
            return;
        }
        var breadcrumbs = new DynamicFacetBreadcrumbs_1.DynamicFacetBreadcrumbs(this);
        args.breadcrumbs.push({ element: breadcrumbs.element });
    };
    DynamicFacet.prototype.initDependsOnManager = function () {
        var _this = this;
        var facetInfo = {
            reset: function () { return _this.reset(); },
            ref: this
        };
        this.dependsOnManager = new DependsOnManager_1.DependsOnManager(facetInfo);
    };
    DynamicFacet.prototype.createDom = function () {
        this.createAndAppendContent();
        this.updateAppearance();
    };
    DynamicFacet.prototype.createAndAppendContent = function () {
        this.createAndAppendHeader();
        this.createAndAppendSearch();
        this.createAndAppendValues();
    };
    DynamicFacet.prototype.createAndAppendHeader = function () {
        var _this = this;
        this.header = new DynamicFacetHeader_1.DynamicFacetHeader({
            title: this.options.title,
            enableCollapse: this.options.enableCollapse,
            clear: function () { return _this.clear(); },
            toggleCollapse: function () { return _this.toggleCollapse(); },
            collapse: function () { return _this.collapse(); },
            expand: function () { return _this.expand(); }
        });
        this.element.appendChild(this.header.element);
    };
    DynamicFacet.prototype.createAndAppendSearch = function () {
        if (this.options.enableFacetSearch === false) {
            return;
        }
        this.search = new DynamicFacetSearch_1.DynamicFacetSearch(this);
        this.element.appendChild(this.search.element);
    };
    DynamicFacet.prototype.createAndAppendValues = function () {
        this.element.appendChild(this.values.render());
    };
    DynamicFacet.prototype.updateQueryStateModel = function () {
        this.listenToQueryStateChange = false;
        this.queryStateModel.set(this.includedAttributeId, this.values.selectedValues);
        this.listenToQueryStateChange = true;
    };
    DynamicFacet.prototype.updateAppearance = function () {
        this.header.toggleClear(this.values.hasSelectedValues);
        this.header.toggleCollapse(this.isCollapsed);
        this.toggleSearchDisplay();
        Dom_1.$$(this.element).toggleClass('coveo-dynamic-facet-collapsed', this.isCollapsed);
        Dom_1.$$(this.element).toggleClass('coveo-active', this.values.hasSelectedValues);
        Dom_1.$$(this.element).toggleClass('coveo-hidden', !this.values.hasDisplayedValues);
    };
    DynamicFacet.prototype.toggleSearchDisplay = function () {
        if (this.options.enableFacetSearch === false) {
            return;
        }
        if (this.isCollapsed) {
            return Dom_1.$$(this.search.element).toggleClass('coveo-hidden', true);
        }
        Dom_1.$$(this.search.element).toggleClass('coveo-hidden', !this.options.enableFacetSearch && !this.moreValuesAvailable);
    };
    DynamicFacet.prototype.triggerNewQuery = function (beforeExecuteQuery) {
        this.beforeSendingQuery();
        var options = beforeExecuteQuery ? { beforeExecuteQuery: beforeExecuteQuery } : { ignoreWarningSearchEvent: true };
        this.queryController.executeQuery(options);
    };
    DynamicFacet.prototype.triggerNewIsolatedQuery = function (beforeExecuteQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var results, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.beforeSendingQuery();
                        beforeExecuteQuery && beforeExecuteQuery();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dynamicFacetQueryController.getQueryResults()];
                    case 2:
                        results = _a.sent();
                        this.handleQueryResults(results);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.header.hideLoading();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DynamicFacet.prototype.beforeSendingQuery = function () {
        this.header.showLoading();
    };
    DynamicFacet.prototype.notImplementedError = function () {
        this.logger.error('DynamicFacets are not supported by your current search endpoint. Disabling this component.');
        this.disable();
        this.updateAppearance();
    };
    DynamicFacet.prototype.verifyCollapsingConfiguration = function () {
        if (this.options.collapsedByDefault && !this.options.enableCollapse) {
            this.logger.warn('The "collapsedByDefault" option is "true" while the "enableCollapse" is "false"');
        }
    };
    DynamicFacet.prototype.logAnalyticsFacetShowMoreLess = function (cause) {
        this.usageAnalytics.logCustomEvent(cause, this.basicAnalyticsFacetMeta, this.element);
    };
    DynamicFacet.prototype.clear = function () {
        var _this = this;
        this.reset();
        this.enableFreezeFacetOrderFlag();
        this.scrollToTop();
        this.triggerNewQuery(function () { return _this.logClearAllToAnalytics(); });
    };
    DynamicFacet.prototype.logClearAllToAnalytics = function () {
        this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.dynamicFacetClearAll, this.basicAnalyticsFacetMeta);
    };
    DynamicFacet.ID = 'DynamicFacet';
    DynamicFacet.doExport = function () { return GlobalExports_1.exportGlobally({ DynamicFacet: DynamicFacet }); };
    /**
     * The options for the DynamicFacet
     * @componentOptions
     */
    DynamicFacet.options = __assign({}, ResponsiveFacetOptions_1.ResponsiveFacetOptions, { 
        /**
         * The unique identifier for this facet.
         *
         * Among other things, this is used to record and read the facet
         * state in the URL fragment identifier (see the
         * [`enableHistory`]{@link SearchInterface.options.enableHistory} `SearchInterface`
         * option).
         *
         * **Tip:** When several facets in a given search interface are based on
         * the same field, ensure that each of those facets has a distinct `id`.
         *
         * If specified, must contain between 1 and 60 characters.
         * Only alphanumeric (A-Za-z0-9), underscore (_), and hyphen (-) characters are kept; other characters are automatically removed.
         *
         * Defaults to the [`field`]{@link DynamicFacet.options.field} option value.
         *
         * @examples author-facet
         */
        id: ComponentOptions_1.ComponentOptions.buildStringOption({
            postProcessing: function (value, options) {
                if (value === void 0) { value = ''; }
                var maxCharLength = 60;
                var sanitizedValue = value.replace(/[^A-Za-z0-9-_@]+/g, '');
                if (Utils_1.Utils.isNonEmptyString(sanitizedValue)) {
                    return sanitizedValue.slice(0, maxCharLength - 1);
                }
                return options.field.slice(0, maxCharLength - 1);
            },
            section: 'CommonOptions'
        }), 
        /**
         * The title to display for this facet.
         *
         * Defaults to the localized string for `NoTitle`.
         *
         * @examples Author
         */
        title: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            localizedString: function () { return Strings_1.l('NoTitle'); },
            section: 'CommonOptions',
            priority: 10
        }), 
        /**
         * The name of the field on which to base this facet.
         *
         * Must be prefixed by `@`, and must reference an existing field whose
         * **Facet** option is enabled.
         *
         * @externaldocs [Add or Edit Fields](https://docs.coveo.com/en/1982/)
         * @examples @author
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true, section: 'CommonOptions' }), 
        /**
         * The sort criterion to use for this facet.
         *
         * See [`FacetSortCriteria`]{@link FacetSortCriteria} for the list and
         * description of allowed values.
         *
         * By default, the following behavior applies:
         *
         * - If the requested [`numberOfValues`]{@link DynamicFacet.options.numberOfValues}
         * is greater than or equal to the currently displayed number of values,
         * the [`alphanumeric`]{@link FacetSortCriteria.alphanumeric} criterion is
         * used.
         * - If the requested `numberOfValues` is less than the currently displayed
         * number of values and the facet is not currently expanded, the [`score`]{@link FacetSortCriteria.score}
         * criterion is used.
         * - Otherwise, the `alphanumeric` criterion is used.
         *
         * @examples score
         */
        sortCriteria: ComponentOptions_1.ComponentOptions.buildStringOption({
            postProcessing: function (value) {
                if (!value) {
                    return undefined;
                }
                if (FacetSortCriteria_1.isFacetSortCriteria(value)) {
                    return value;
                }
                new Logger_1.Logger(value).warn('sortCriteria is not of the the allowed values: "score", "alphanumeric", "occurrences"');
                return undefined;
            },
            section: 'Sorting'
        }), 
        /**
         * The number of values to request for this facet.
         *
         * Also determines the default maximum number of additional values to request each time this facet is expanded,
         * and the maximum number of values to display when this facet is collapsed (see the [`enableCollapse`]{@link DynamicFacet.options.enableCollapse} option).
         */
        numberOfValues: ComponentOptions_1.ComponentOptions.buildNumberOption({ min: 0, defaultValue: 8, section: 'CommonOptions' }), 
        /**
         * Whether to allow the end-user to expand and collapse this facet.
         */
        enableCollapse: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }), 
        /**
         * Whether to scroll back to the top of the page whenever the end-user interacts with the facet.
         */
        enableScrollToTop: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }), 
        /**
         * Whether to enable the **Show more** and **Show less** buttons in the facet.
         *
         * **Note:** The [`DynamicFacetRange`]{@link DynamicFacetRange} component does not support this option.
         */
        enableMoreLess: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }), 
        /**
         * Whether to allow the end-user to search the facet values.
         *
         * **Note:** The [`DynamicFacetRange`]{@link DynamicFacetRange} component does not support this option.
         *
         * By default, the following behavior applies:
         *
         * - Enabled when more facet values are available.
         * - Disabled when all available facet values are already displayed.
         */
        enableFacetSearch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ section: 'Filtering' }), 
        /**
         * Whether to prepend facet search queries with a wildcard.
         *
         * **Note:** The [`DynamicFacetRange`]{@link DynamicFacetRange} component does not support this option.
         */
        useLeadingWildcardInFacetSearch: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: true,
            section: 'Filtering',
            depend: 'enableFacetSearch'
        }), 
        /**
         * Whether this facet should be collapsed by default.
         */
        collapsedByDefault: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'CommonOptions', depend: 'enableCollapse' }), 
        /**
         * Whether to notify the [`Breadcrumb`]{@link Breadcrumb} component when toggling values in the facet.
         *
         * See also the [`numberOfValuesInBreadcrumb`]{@link DynamicFacet.options.numberOfValuesInBreadcrumb} option.
         */
        includeInBreadcrumb: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }), 
        /**
         * The maximum number of selected values the [`Breadcrumb`]{@link Breadcrumb} component can display before outputting a **N more...** link for the facet.
         */
        numberOfValuesInBreadcrumb: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultFunction: function () { return (DeviceUtils_1.DeviceUtils.isMobileDevice() ? 3 : 5); },
            min: 0,
            depend: 'includeInBreadcrumb',
            section: 'CommonOptions'
        }), 
        /**
         * A mapping of facet values to their desired captions.
         *
         * **Note:** The [`DynamicFacetRange`]{@link DynamicFacetRange} component does not support this option.
         *
         * @externaldocs [Normalizing Facet Value Captions](https://docs.coveo.com/368/).
         * @examples { "smith_alice": "Alice Smith"\, "jones_bob_r": "Bob R. Jones" }
         */
        valueCaption: ComponentOptions_1.ComponentOptions.buildJsonOption({ defaultValue: {} }), 
        /**
         * The [`id`]{@link DynamicFacet.options.id} of another facet in which at least one value must be selected in order for the dependent facet to be visible.
         *
         * By default, the facet does not depend on any other facet to be displayed.
         *
         * @examples document-type-facet
         *
         * @availablesince [December 2019 Release (v2.7610)](https://docs.coveo.com/en/3142/)
         */
        dependsOn: ComponentOptions_1.ComponentOptions.buildStringOption({ section: 'CommonOptions' }), 
        /**
         * A function that verifies whether the current state of the `dependsOn` facet allows the dependent facet to be displayed.
         *
         * If specified, the function receives a reference to the resolved `dependsOn` facet component instance as an argument, and must return a boolean.
         * The function's argument should typically be treated as read-only.
         *
         * By default, the dependent facet is displayed whenever one or more values are selected in its `dependsOn` facet.
         *
         * @externaldocs [Defining Dependent Facets](https://docs.coveo.com/3210/)
         *
         * @availablesince [April 2020 Release (v2.8864)](https://docs.coveo.com/en/3231/)
         */
        dependsOnCondition: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        }, { depend: 'dependsOn', section: 'CommonOptions' }), 
        /**
         * The number of items to scan for facet values.
         *
         * Setting this option to a higher value may enhance the accuracy of facet value counts at the cost of slower query performance.
         *
         * @availablesince [January 2020 Release (v2.7968)](https://docs.coveo.com/en/3163/)
         */
        injectionDepth: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 1000, min: 0 }), 
        /**
         * Whether to exclude folded result parents when estimating result counts for facet values.
         *
         * See also the [`Folding`]{@link Folding} and [`FoldingForThread`]{@link FoldingForThread} components.
         *
         * **Default:** `false` if folded results are requested; `true` otherwise.
         *
         * @availablesince [March 2020 Release (v2.8521)](https://docs.coveo.com/en/3203/)
         */
        filterFacetCount: ComponentOptions_1.ComponentOptions.buildBooleanOption({ section: 'Filtering' }) });
    return DynamicFacet;
}(Component_1.Component));
exports.DynamicFacet = DynamicFacet;
Initialization_1.Initialization.registerAutoCreateComponent(DynamicFacet);
DynamicFacet.doExport();


/***/ }),

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Core_1 = __webpack_require__(20);
var Model_1 = __webpack_require__(18);
var ComponentsTypes_1 = __webpack_require__(45);
var Dom_1 = __webpack_require__(1);
var InitializationEvents_1 = __webpack_require__(17);
var DependsOnManager = /** @class */ (function () {
    function DependsOnManager(facet) {
        var _this = this;
        this.facet = facet;
        this.facet.ref.bind.onRootElement(Core_1.QueryEvents.buildingQuery, function () { return _this.handleBuildingQuery(); });
        if (this.getDependsOn(this.facet.ref)) {
            this.facet.ref.bind.onRootElement(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () { return _this.setupDependentFacet(); });
        }
    }
    DependsOnManager.prototype.setupDependentFacet = function () {
        var _this = this;
        Dom_1.$$(this.facet.ref.element).addClass('coveo-hidden');
        this.parentFacetRef = this.getParentFacet(this.facet.ref);
        if (this.parentFacetRef) {
            this.facet.ref.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE, undefined, function () { return _this.resetIfConditionUnfullfiled(); });
        }
    };
    DependsOnManager.prototype.resetIfConditionUnfullfiled = function () {
        var condition = this.getDependsOnCondition(this.facet.ref);
        if (!condition(this.parentFacetRef)) {
            this.facet.reset();
        }
    };
    DependsOnManager.prototype.getId = function (component) {
        var id = component.options.id;
        return id ? "" + id : null;
    };
    DependsOnManager.prototype.getDependsOn = function (component) {
        var dependsOn = component.options.dependsOn;
        return dependsOn ? "" + dependsOn : null;
    };
    DependsOnManager.prototype.getDependsOnCondition = function (component) {
        var _this = this;
        var conditionOption = component.options.dependsOnCondition;
        return conditionOption && underscore_1.isFunction(conditionOption) ? conditionOption : function () { return _this.parentHasSelectedValues(component); };
    };
    DependsOnManager.prototype.parentHasSelectedValues = function (component) {
        var parent = this.getParentFacet(component);
        return parent && this.valuesExistForFacetWithId(this.getId(parent));
    };
    DependsOnManager.prototype.valuesExistForFacetWithId = function (facetId) {
        var values = this.facet.ref.queryStateModel.get(Core_1.QueryStateModel.getFacetId(facetId));
        return !!values && !!values.length;
    };
    Object.defineProperty(DependsOnManager.prototype, "allFacetsInInterface", {
        get: function () {
            return ComponentsTypes_1.ComponentsTypes.getAllFacetsFromSearchInterface(this.facet.ref.searchInterface);
        },
        enumerable: true,
        configurable: true
    });
    DependsOnManager.prototype.getParentFacet = function (component) {
        var _this = this;
        var parent = this.allFacetsInInterface.filter(function (potentialParentFacet) { return _this.getId(potentialParentFacet) === _this.getDependsOn(component); });
        if (!parent.length) {
            component.logger.warn('DependsOn reference does not exist', this.getDependsOn(this.facet.ref));
            return null;
        }
        return parent[0];
    };
    Object.defineProperty(DependsOnManager.prototype, "dependentFacets", {
        get: function () {
            var _this = this;
            return this.allFacetsInInterface.filter(function (potentialDependentFacet) { return _this.getId(_this.facet.ref) === _this.getDependsOn(potentialDependentFacet); });
        },
        enumerable: true,
        configurable: true
    });
    DependsOnManager.prototype.handleBuildingQuery = function () {
        var _this = this;
        this.dependentFacets.forEach(function (dependentFacet) {
            var condition = _this.getDependsOnCondition(dependentFacet);
            if (condition(_this.facet.ref)) {
                Dom_1.$$(dependentFacet.element).removeClass('coveo-hidden');
                return dependentFacet.enable();
            }
            dependentFacet.disable();
            Dom_1.$$(dependentFacet.element).addClass('coveo-hidden');
        });
    };
    Object.defineProperty(DependsOnManager.prototype, "hasDependentFacets", {
        get: function () {
            return !!this.dependentFacets.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DependsOnManager.prototype, "dependentFacetsHaveSelectedValues", {
        get: function () {
            var _this = this;
            return this.dependentFacets.some(function (dependentFacet) { return _this.valuesExistForFacetWithId(_this.getId(dependentFacet)); });
        },
        enumerable: true,
        configurable: true
    });
    return DependsOnManager;
}());
exports.DependsOnManager = DependsOnManager;


/***/ }),

/***/ 175:
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
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var GlobalExports_1 = __webpack_require__(3);
var Core_1 = __webpack_require__(20);
var Initialization_1 = __webpack_require__(2);
/**
 * This component lets you customize the mobile responsive behavior of facets in your search interface.
 *
 * **Notes:**
 * - You can include this component anywhere under the root element of your search interface.
 * - You should only include this component once in your search interface.
 * - If you do not include this component in your search interface, facets will still have a default mobile responsive behavior.
 */
var FacetsMobileMode = /** @class */ (function (_super) {
    __extends(FacetsMobileMode, _super);
    function FacetsMobileMode(element, options, bindings) {
        var _this = _super.call(this, element, FacetsMobileMode.ID, bindings) || this;
        _this.element = element;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, FacetsMobileMode, options);
        if (_this.options.preventScrolling) {
            var scrollContainer = _this.options.scrollContainer || _this.searchInterface.element;
            _this.options.scrollContainer = ComponentOptions_1.ComponentOptions.findParentScrollLockable(scrollContainer);
        }
        return _this;
    }
    FacetsMobileMode.ID = 'FacetsMobileMode';
    /**
     * @componentOptions
     */
    FacetsMobileMode.options = {
        /**
         * The screen width (in number of pixels) at which facets should enter mobile responsive mode and be collapsed under a single button.
         *
         * **Default:** `800`
         */
        breakpoint: ComponentOptions_1.ComponentOptions.buildNumberOption(),
        /**
         * Whether to display the facets in a modal instead of a pop-up when the end user expands them in mobile responsive mode.
         */
        isModal: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Whether to display an overlay behind the facets when the end user expands them in mobile responsive mode.
         *
         * By default, the following behavior applies:
         * - `true` when [isModal]{@link FacetsMobileMode.options.isModal} is `false`
         * - `false` when [isModal]{@link FacetsMobileMode.options.isModal} is `true`
         */
        displayOverlayWhileOpen: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            postProcessing: function (value, options) { return (Core_1.Utils.isNullOrUndefined(value) ? !options.isModal : value); }
        }),
        /**
         * Whether to disable vertical scrolling on the specified or resolved [`scrollContainer`]{@link FacetsMobileMode.options.scrollContainer} while facets are expanded in mobile responsive mode.
         *
         * By default, the following behavior applies:
         * - `true` when [isModal]{@link FacetsMobileMode.options.isModal} is `true`
         * - `false` when [isModal]{@link FacetsMobileMode.options.isModal} is `false`
         */
        preventScrolling: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            postProcessing: function (value, options) { return (Core_1.Utils.isNullOrUndefined(value) ? options.isModal : value); }
        }),
        /**
         * The HTML element whose vertical scrolling should be locked while facets are expanded in mobile responsive mode.
         *
         * By default, the component tries to detect and use the first ancestor element whose CSS `overflow-y` attribute is set to `scroll`, starting from the `FacetsMobileMode`'s element itself. If no such element is found, the `document.body` element is used.
         *
         * Since this heuristic is not perfect, we strongly recommend that you manually set this option by explicitly specifying the desired CSS selector.
         *
         * **Example:** `data-scroll-container-selector='#someCssSelector'`
         */
        scrollContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption({ depend: 'preventScrolling' })
    };
    FacetsMobileMode.doExport = function () {
        GlobalExports_1.exportGlobally({
            FacetsMobileMode: FacetsMobileMode
        });
    };
    return FacetsMobileMode;
}(Component_1.Component));
exports.FacetsMobileMode = FacetsMobileMode;
Initialization_1.Initialization.registerAutoCreateComponent(FacetsMobileMode);


/***/ }),

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The allowed values for the [`facetType`]{@link IFacetRequest.facetType} property of a [facet request]{@link IFacetRequest}.
 */
var FacetType;
(function (FacetType) {
    /**
     * Request facet values representing specific values.
     */
    FacetType["specific"] = "specific";
    /**
     * Request facet values representing ranges of numbers.
     */
    FacetType["numericalRange"] = "numericalRange";
    /**
     * Request facet values representing ranges of dates.
     */
    FacetType["dateRange"] = "dateRange";
    /**
     * Request facet values representing a hierarchy.
     */
    FacetType["hierarchical"] = "hierarchical";
})(FacetType = exports.FacetType || (exports.FacetType = {}));


/***/ }),

/***/ 211:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(7);
var _ = __webpack_require__(0);
var ResultListRenderer = /** @class */ (function () {
    function ResultListRenderer(resultListOptions, autoCreateComponentsFn) {
        this.resultListOptions = resultListOptions;
        this.autoCreateComponentsFn = autoCreateComponentsFn;
    }
    ResultListRenderer.prototype.renderResults = function (resultElements, append, resultDisplayedCallback) {
        var _this = this;
        if (append === void 0) { append = false; }
        return Promise.all([this.getStartFragment(resultElements, append), this.getEndFragment(resultElements, append)]).then(function (_a) {
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
            _this.resultListOptions.resultsContainer.appendChild(resultsFragment);
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


/***/ }),

/***/ 212:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(529);
var QueryEvents_1 = __webpack_require__(11);
var Logger_1 = __webpack_require__(9);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var Component_1 = __webpack_require__(7);
var SearchInterface_1 = __webpack_require__(19);
var ResponsiveComponents_1 = __webpack_require__(52);
var ResponsiveComponentsManager_1 = __webpack_require__(60);
var ResponsiveComponentsUtils_1 = __webpack_require__(126);
var ResponsiveDropdown_1 = __webpack_require__(117);
var ResponsiveDropdownContent_1 = __webpack_require__(88);
var ResponsiveDropdownHeader_1 = __webpack_require__(131);
var underscore_1 = __webpack_require__(0);
var ComponentsTypes_1 = __webpack_require__(45);
var ResponsiveDropdownModalContent_1 = __webpack_require__(530);
var FacetsMobileMode_1 = __webpack_require__(175);
var FacetsMobileModeEvents_1 = __webpack_require__(531);
var ResponsiveFacetColumn = /** @class */ (function () {
    function ResponsiveFacetColumn(coveoRoot, ID, options, responsiveDropdown) {
        this.coveoRoot = coveoRoot;
        this.ID = ID;
        this.componentsInFacetColumn = [];
        this.preservePositionOriginalValues = [];
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.dropdownHeaderLabel = this.getDropdownHeaderLabel();
        this.dropdown = this.buildDropdown(responsiveDropdown);
        this.bindDropdownContentEvents();
        this.bindFacetsMobileModeEvents();
        this.registerOnCloseHandler();
        this.registerQueryEvents();
        this.initializeBreakpoint(options.responsiveBreakpoint);
    }
    ResponsiveFacetColumn.init = function (responsiveComponentConstructor, root, component, options, ID) {
        var column = this.findColumn(root);
        if (!column) {
            return;
        }
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(ResponsiveFacetColumn, Dom_1.$$(root), 'ResponsiveFacetColumn', component, options);
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(responsiveComponentConstructor, Dom_1.$$(root), ID, component, options);
    };
    ResponsiveFacetColumn.findColumn = function (root) {
        var column = Dom_1.$$(root).find('.coveo-facet-column');
        if (!column) {
            var logger = new Logger_1.Logger('ResponsiveFacets');
            logger.info('No element with class coveo-facet-column. Responsive facets cannot be enabled');
        }
        return column;
    };
    Object.defineProperty(ResponsiveFacetColumn.prototype, "facetsMobileModeComponent", {
        get: function () {
            return this.searchInterface ? this.searchInterface.getComponents(FacetsMobileMode_1.FacetsMobileMode.ID)[0] : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponsiveFacetColumn.prototype, "facetsMobileModeOptions", {
        get: function () {
            var facetsMobileModeComponent = this.facetsMobileModeComponent;
            if (!facetsMobileModeComponent) {
                return {
                    isModal: false,
                    preventScrolling: false,
                    displayOverlayWhileOpen: true
                };
            }
            return facetsMobileModeComponent.options;
        },
        enumerable: true,
        configurable: true
    });
    ResponsiveFacetColumn.prototype.registerComponent = function (accept) {
        this.componentsInFacetColumn.push(accept);
        this.preservePositionOriginalValues.push(accept.options.preservePosition);
        return true;
    };
    ResponsiveFacetColumn.prototype.needDropdownWrapper = function () {
        return this.needSmallMode();
    };
    ResponsiveFacetColumn.prototype.handleResizeEvent = function () {
        if (this.needSmallMode() && !ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallFacetActivated(this.coveoRoot)) {
            this.changeToSmallMode();
        }
        else if (!this.needSmallMode() && ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallFacetActivated(this.coveoRoot)) {
            this.changeToLargeMode();
        }
        if (this.dropdown.isOpened) {
            this.dropdown.dropdownContent.positionDropdown();
        }
    };
    ResponsiveFacetColumn.prototype.dismissFacetSearches = function () {
        underscore_1.each(this.componentsInFacetColumn, function (component) {
            if (component.facetSearch && component.facetSearch.currentlyDisplayedResults) {
                component.facetSearch.dismissSearchResults();
            }
        });
    };
    ResponsiveFacetColumn.prototype.needSmallMode = function () {
        if (!this.searchInterface) {
            return (this.coveoRoot.width() <=
                (Utils_1.Utils.isNullOrUndefined(this.breakpoint) ? new ResponsiveComponents_1.ResponsiveComponents().getMediumScreenWidth() : this.breakpoint));
        }
        switch (this.searchInterface.responsiveComponents.getResponsiveMode()) {
            case 'small':
            case 'medium':
                return true;
            case 'auto':
                return (this.coveoRoot.width() <=
                    (Utils_1.Utils.isNullOrUndefined(this.breakpoint) ? this.searchInterface.responsiveComponents.getMediumScreenWidth() : this.breakpoint));
            default:
                return false;
        }
    };
    ResponsiveFacetColumn.prototype.changeToSmallMode = function () {
        this.dropdown.close();
        this.disableFacetPreservePosition();
        Dom_1.$$(this.coveoRoot.find("." + ResponsiveComponentsManager_1.ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS)).append(this.dropdown.dropdownHeader.element.el);
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.activateSmallFacet(this.coveoRoot);
    };
    ResponsiveFacetColumn.prototype.changeToLargeMode = function () {
        this.restoreFacetPreservePositionValue();
        this.dropdown.cleanUp();
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.deactivateSmallFacet(this.coveoRoot);
    };
    ResponsiveFacetColumn.prototype.buildDropdown = function (responsiveDropdown) {
        var dropdownContent = this.buildDropdownContent();
        var dropdownHeader = this.buildDropdownHeader();
        var dropdown = responsiveDropdown ? responsiveDropdown : new ResponsiveDropdown_1.ResponsiveDropdown(dropdownContent, dropdownHeader, this.coveoRoot);
        if (!this.facetsMobileModeOptions.displayOverlayWhileOpen) {
            dropdown.disablePopupBackground();
        }
        if (this.facetsMobileModeOptions.preventScrolling) {
            dropdown.enableScrollLocking(this.facetsMobileModeOptions.scrollContainer);
        }
        return dropdown;
    };
    ResponsiveFacetColumn.prototype.buildDropdownContent = function () {
        var _this = this;
        var dropdownContentElement = Dom_1.$$(this.coveoRoot.find('.coveo-facet-column'));
        var filterByContainer = Dom_1.$$('div', { className: 'coveo-facet-header-filter-by-container', style: 'display: none' });
        var filterBy = Dom_1.$$('div', { className: 'coveo-facet-header-filter-by' });
        filterBy.text(Strings_1.l('Filter by:'));
        filterByContainer.append(filterBy.el);
        dropdownContentElement.prepend(filterByContainer.el);
        if (this.facetsMobileModeOptions.isModal) {
            return new ResponsiveDropdownModalContent_1.ResponsiveDropdownModalContent('facet', dropdownContentElement, Strings_1.l('CloseFiltersDropdown'), function () { return _this.dropdown.close(); });
        }
        return new ResponsiveDropdownContent_1.ResponsiveDropdownContent('facet', dropdownContentElement, this.coveoRoot, ResponsiveFacetColumn.DROPDOWN_MIN_WIDTH, ResponsiveFacetColumn.DROPDOWN_WIDTH_RATIO);
    };
    ResponsiveFacetColumn.prototype.buildDropdownHeader = function () {
        var dropdownHeaderElement = Dom_1.$$('a');
        var content = Dom_1.$$('p');
        content.text(this.dropdownHeaderLabel);
        dropdownHeaderElement.el.appendChild(content.el);
        var dropdownHeader = new ResponsiveDropdownHeader_1.ResponsiveDropdownHeader('facet', dropdownHeaderElement);
        return dropdownHeader;
    };
    ResponsiveFacetColumn.prototype.initializeBreakpoint = function (defaultBreakpoint) {
        var facetsMobileModeBreakpoint = this.facetsMobileModeOptions.breakpoint;
        this.breakpoint = Utils_1.Utils.isNullOrUndefined(facetsMobileModeBreakpoint) ? defaultBreakpoint : facetsMobileModeBreakpoint;
    };
    ResponsiveFacetColumn.prototype.registerOnCloseHandler = function () {
        this.dropdown.registerOnCloseHandler(this.dismissFacetSearches, this);
    };
    ResponsiveFacetColumn.prototype.registerQueryEvents = function () {
        var _this = this;
        this.coveoRoot.on(QueryEvents_1.QueryEvents.noResults, function () { return _this.handleNoResults(); });
        this.coveoRoot.on(QueryEvents_1.QueryEvents.querySuccess, function (e, data) { return _this.handleQuerySuccess(data); });
        this.coveoRoot.on(QueryEvents_1.QueryEvents.queryError, function () { return _this.handleQueryError(); });
    };
    ResponsiveFacetColumn.prototype.bindDropdownContentEvents = function () {
        var _this = this;
        this.dropdown.dropdownContent.element.on('scroll', underscore_1.debounce(function () {
            underscore_1.each(_this.componentsInFacetColumn, function (component) {
                var facetSearch = component.facetSearch;
                if (facetSearch && facetSearch.currentlyDisplayedResults && !_this.isFacetSearchScrolledIntoView(facetSearch.search)) {
                    component.facetSearch.positionSearchResults(_this.dropdown.dropdownContent.element.el);
                }
                else if (facetSearch && component.facetSearch.currentlyDisplayedResults) {
                    component.facetSearch.positionSearchResults();
                }
            });
        }, ResponsiveFacetColumn.DEBOUNCE_SCROLL_WAIT));
    };
    ResponsiveFacetColumn.prototype.bindFacetsMobileModeEvents = function () {
        var facetsMobileModeComponent = this.facetsMobileModeComponent;
        if (facetsMobileModeComponent) {
            this.dropdown.registerOnOpenHandler(function () { return Dom_1.$$(facetsMobileModeComponent.element).trigger(FacetsMobileModeEvents_1.FacetsMobileModeEvents.popupOpened); }, facetsMobileModeComponent);
            this.dropdown.registerOnCloseHandler(function () { return Dom_1.$$(facetsMobileModeComponent.element).trigger(FacetsMobileModeEvents_1.FacetsMobileModeEvents.popupClosed); }, facetsMobileModeComponent);
        }
    };
    ResponsiveFacetColumn.prototype.restoreFacetPreservePositionValue = function () {
        var _this = this;
        underscore_1.each(this.componentsInFacetColumn, function (component, index) {
            if (component.options) {
                component.options.preservePosition = _this.preservePositionOriginalValues[index];
            }
        });
    };
    ResponsiveFacetColumn.prototype.disableFacetPreservePosition = function () {
        underscore_1.each(this.componentsInFacetColumn, function (component) {
            if (component.options) {
                component.options.preservePosition = false;
            }
        });
    };
    ResponsiveFacetColumn.prototype.isFacetSearchScrolledIntoView = function (facetSearchElement) {
        var facetTop = facetSearchElement.getBoundingClientRect().top;
        var facetBottom = facetSearchElement.getBoundingClientRect().bottom;
        var dropdownTop = this.dropdown.dropdownContent.element.el.getBoundingClientRect().top;
        var dropdownBottom = this.dropdown.dropdownContent.element.el.getBoundingClientRect().bottom;
        dropdownTop = dropdownTop >= 0 ? dropdownTop : 0;
        return facetTop >= dropdownTop && facetBottom <= dropdownBottom;
    };
    ResponsiveFacetColumn.prototype.getDropdownHeaderLabel = function () {
        var dropdownHeaderLabel;
        ComponentsTypes_1.ComponentsTypes.getAllFacetInstancesFromElement(this.coveoRoot.find('.coveo-facet-column')).forEach(function (facet) {
            var options = facet.options;
            if (!dropdownHeaderLabel && options.dropdownHeaderLabel) {
                dropdownHeaderLabel = options.dropdownHeaderLabel;
            }
        });
        if (!dropdownHeaderLabel) {
            dropdownHeaderLabel = Strings_1.l(ResponsiveFacetColumn.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE);
        }
        return dropdownHeaderLabel;
    };
    ResponsiveFacetColumn.prototype.handleNoResults = function () {
        this.dropdown.dropdownHeader.hide();
    };
    ResponsiveFacetColumn.prototype.handleQueryError = function () {
        this.dropdown.dropdownHeader.hide();
    };
    ResponsiveFacetColumn.prototype.handleQuerySuccess = function (data) {
        if (data.results.totalCount === 0) {
            this.dropdown.dropdownHeader.hide();
        }
        else {
            this.dropdown.dropdownHeader.show();
        }
    };
    ResponsiveFacetColumn.DEBOUNCE_SCROLL_WAIT = 250;
    ResponsiveFacetColumn.DROPDOWN_MIN_WIDTH = 280;
    ResponsiveFacetColumn.DROPDOWN_WIDTH_RATIO = 0.35; // Used to set the width relative to the coveo root.
    ResponsiveFacetColumn.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE = 'Filters';
    return ResponsiveFacetColumn;
}());
exports.ResponsiveFacetColumn = ResponsiveFacetColumn;


/***/ }),

/***/ 221:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 222:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var DynamicFacetValueShowMoreLessButton = /** @class */ (function () {
    function DynamicFacetValueShowMoreLessButton(options) {
        var btn = Dom_1.$$('button', {
            className: options.className,
            ariaLabel: options.ariaLabel,
            type: 'button'
        }, options.label);
        this.element = Dom_1.$$('li', null, btn).el;
        btn.on('click', function () { return options.action(); });
    }
    return DynamicFacetValueShowMoreLessButton;
}());
exports.DynamicFacetValueShowMoreLessButton = DynamicFacetValueShowMoreLessButton;


/***/ }),

/***/ 223:
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
var Globalize = __webpack_require__(23);
var FacetValueState_1 = __webpack_require__(69);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Strings_1 = __webpack_require__(6);
var FacetRequest_1 = __webpack_require__(180);
var DynamicFacetValue = /** @class */ (function () {
    function DynamicFacetValue(facetValue, facet, rendererKlass) {
        this.facet = facet;
        this.element = null;
        this.value = facetValue.value;
        this.start = facetValue.start;
        this.end = facetValue.end;
        this.endInclusive = facetValue.endInclusive;
        this.state = facetValue.state;
        this.numberOfResults = facetValue.numberOfResults;
        this.position = facetValue.position;
        this.displayValue = facetValue.displayValue;
        this.renderer = new rendererKlass(this, facet);
    }
    Object.defineProperty(DynamicFacetValue.prototype, "isSelected", {
        get: function () {
            return this.state === FacetValueState_1.FacetValueState.selected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValue.prototype, "isIdle", {
        get: function () {
            return this.state === FacetValueState_1.FacetValueState.idle;
        },
        enumerable: true,
        configurable: true
    });
    DynamicFacetValue.prototype.toggleSelect = function () {
        this.state === FacetValueState_1.FacetValueState.selected ? this.deselect() : this.select();
    };
    DynamicFacetValue.prototype.select = function () {
        this.state = FacetValueState_1.FacetValueState.selected;
    };
    DynamicFacetValue.prototype.deselect = function () {
        this.state = FacetValueState_1.FacetValueState.idle;
    };
    DynamicFacetValue.prototype.equals = function (arg) {
        var value = typeof arg === 'string' ? arg : arg.value;
        return value.toLowerCase() === this.value.toLowerCase();
    };
    Object.defineProperty(DynamicFacetValue.prototype, "formattedCount", {
        get: function () {
            return Globalize.format(this.numberOfResults, 'n0');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValue.prototype, "selectAriaLabel", {
        get: function () {
            var resultCount = Strings_1.l('ResultCount', this.formattedCount, this.numberOfResults);
            return "" + Strings_1.l('IncludeValueWithResultCount', this.displayValue, resultCount);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValue.prototype, "isRange", {
        get: function () {
            return this.facet.facetType !== FacetRequest_1.FacetType.specific;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValue.prototype, "analyticsValue", {
        get: function () {
            return this.isRange ? this.start + ".." + this.end : this.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValue.prototype, "rangeFacetState", {
        get: function () {
            if (!this.isRange) {
                return null;
            }
            return {
                start: "" + this.start,
                end: "" + this.end,
                endInclusive: this.endInclusive
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValue.prototype, "analyticsFacetState", {
        get: function () {
            return __assign({}, this.facet.basicAnalyticsFacetState, this.rangeFacetState, { value: this.analyticsValue, valuePosition: this.position, displayValue: this.displayValue, state: this.state });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValue.prototype, "rangeFacetMeta", {
        get: function () {
            if (!this.isRange) {
                return null;
            }
            return {
                facetRangeStart: "" + this.start,
                facetRangeEnd: "" + this.end,
                facetRangeEndInclusive: this.endInclusive
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValue.prototype, "analyticsFacetMeta", {
        get: function () {
            return __assign({}, this.facet.basicAnalyticsFacetMeta, this.rangeFacetMeta, { facetValue: this.analyticsValue });
        },
        enumerable: true,
        configurable: true
    });
    DynamicFacetValue.prototype.logSelectActionToAnalytics = function () {
        var action = this.state === FacetValueState_1.FacetValueState.selected ? AnalyticsActionListMeta_1.analyticsActionCauseList.dynamicFacetSelect : AnalyticsActionListMeta_1.analyticsActionCauseList.dynamicFacetDeselect;
        this.facet.logAnalyticsEvent(action, this.analyticsFacetMeta);
    };
    DynamicFacetValue.prototype.render = function () {
        this.element = this.renderer.render();
        return this.element;
    };
    Object.defineProperty(DynamicFacetValue.prototype, "renderedElement", {
        get: function () {
            if (this.element) {
                return this.element;
            }
            return this.render();
        },
        enumerable: true,
        configurable: true
    });
    return DynamicFacetValue;
}());
exports.DynamicFacetValue = DynamicFacetValue;


/***/ }),

/***/ 290:
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
var Component_1 = __webpack_require__(7);
var InitializationEvents_1 = __webpack_require__(17);
var QueryEvents_1 = __webpack_require__(11);
var GlobalExports_1 = __webpack_require__(3);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var ComponentOptions_1 = __webpack_require__(8);
var Assert_1 = __webpack_require__(5);
var Initialization_1 = __webpack_require__(2);
var ComponentsTypes_1 = __webpack_require__(45);
/**
 * The `DynamicFacetManager` component is meant to be a parent for multiple [DynamicFacet]{@link DynamicFacet} & [DynamicFacetRange]{@link DynamicFacetRange} components.
 * This component allows controlling a set of [`DynamicFacet`]{@link DynamicFacet} and [`DynamicFacetRange`]{@link DynamicFacetRange} as a group.
 *
 * @externaldocs [Using Dynamic Facets](https://docs.coveo.com/en/2917/).
 * @availablesince [May 2019 Release (v2.6063)](https://docs.coveo.com/en/2909/)
 */
var DynamicFacetManager = /** @class */ (function (_super) {
    __extends(DynamicFacetManager, _super);
    /**
     * Creates a new `DynamicFacetManager` instance.
     *
     * @param element The element from which to instantiate the component.
     * @param options The component options.
     * @param bindings The component bindings. Automatically resolved by default.
     */
    function DynamicFacetManager(element, options) {
        var _this = _super.call(this, element, 'DynamicFacetManager') || this;
        _this.options = options;
        _this.childrenFacets = [];
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, DynamicFacetManager, options);
        _this.resetContainer();
        _this.prependContainer();
        _this.initEvents();
        return _this;
    }
    Object.defineProperty(DynamicFacetManager.prototype, "enabledFacets", {
        get: function () {
            return this.childrenFacets.filter(function (facet) { return !facet.disabled; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetManager.prototype, "displayedFacets", {
        get: function () {
            return this.childrenFacets.filter(function (facet) { return facet.isCurrentlyDisplayed(); });
        },
        enumerable: true,
        configurable: true
    });
    DynamicFacetManager.prototype.resetContainer = function () {
        this.containerElement && Dom_1.$$(this.containerElement).remove();
        this.containerElement = Dom_1.$$('div', { className: 'coveo-dynamic-facet-manager-container' }).el;
    };
    DynamicFacetManager.prototype.prependContainer = function () {
        Dom_1.$$(this.element).prepend(this.containerElement);
    };
    DynamicFacetManager.prototype.initEvents = function () {
        var _this = this;
        this.bind.onRootElement(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () { return _this.handleAfterComponentsInitialization(); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.doneBuildingQuery, function (data) { return _this.handleDoneBuildingQuery(data); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function (data) { return _this.handleQuerySuccess(data); });
    };
    DynamicFacetManager.prototype.isDynamicFacet = function (component) {
        return !!component.isDynamicFacet;
    };
    Object.defineProperty(DynamicFacetManager.prototype, "allDynamicFacets", {
        get: function () {
            var allFacetsInComponent = ComponentsTypes_1.ComponentsTypes.getAllFacetInstancesFromElement(this.element);
            return allFacetsInComponent.filter(this.isDynamicFacet);
        },
        enumerable: true,
        configurable: true
    });
    DynamicFacetManager.prototype.handleAfterComponentsInitialization = function () {
        var _this = this;
        this.childrenFacets = this.allDynamicFacets;
        this.childrenFacets.forEach(function (dynamicFacet) {
            dynamicFacet.dynamicFacetManager = _this;
            _this.containerElement.appendChild(dynamicFacet.element);
        });
        if (this.element.children.length > 1) {
            this.logger.warn("DynamicFacetManager contains incompatible elements. Those elements may be moved in the DOM.\n        To prevent this warning, move those elements outside of the DynamicFacetManager.");
        }
        if (!this.childrenFacets.length) {
            this.disable();
        }
    };
    DynamicFacetManager.prototype.handleDoneBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.queryBuilder);
        this.enabledFacets.forEach(function (dynamicFacet) {
            dynamicFacet.putStateIntoQueryBuilder(data.queryBuilder);
            dynamicFacet.putStateIntoAnalytics();
        });
    };
    DynamicFacetManager.prototype.handleQuerySuccess = function (data) {
        if (Utils_1.Utils.isNullOrUndefined(data.results.facets)) {
            return this.notImplementedError();
        }
        this.enabledFacets.forEach(function (dynamicFacet) {
            dynamicFacet.handleQueryResults(data.results);
        });
        var wasFacetOrderFrozen = data.query.facetOptions && data.query.facetOptions.freezeFacetOrder;
        if (wasFacetOrderFrozen) {
            return this.callOnUpdateOnChildrenFacets();
        }
        if (this.options.enableReorder) {
            this.options.compareFacets ? this.sortFacetsWithCompareOption() : this.sortFacetsWithResponseOrder(data.results.facets);
            this.reorderFacetsInDom();
        }
        this.respectMaximumExpandedFacetsThreshold();
        this.callOnUpdateOnChildrenFacets();
    };
    DynamicFacetManager.prototype.callOnUpdateOnChildrenFacets = function () {
        var _this = this;
        if (!this.options.onUpdate) {
            return;
        }
        this.childrenFacets.forEach(function (dynamicFacet, index) { return _this.options.onUpdate(dynamicFacet, index); });
    };
    DynamicFacetManager.prototype.sortFacetsWithResponseOrder = function (facetsResponse) {
        var _this = this;
        var facetsInResponse = facetsResponse.map(function (_a) {
            var facetId = _a.facetId;
            return _this.getChildFacetWithId(facetId);
        }).filter(Utils_1.Utils.exists);
        var facetsNotInResponse = underscore_1.without.apply(void 0, [this.childrenFacets].concat(facetsInResponse));
        this.childrenFacets = facetsInResponse.concat(facetsNotInResponse);
    };
    DynamicFacetManager.prototype.sortFacetsWithCompareOption = function () {
        this.childrenFacets = this.childrenFacets.sort(this.options.compareFacets);
    };
    DynamicFacetManager.prototype.reorderFacetsInDom = function () {
        this.resetContainer();
        var fragment = document.createDocumentFragment();
        this.childrenFacets.forEach(function (dynamicFacet) { return fragment.appendChild(dynamicFacet.element); });
        this.containerElement.appendChild(fragment);
        this.prependContainer();
    };
    DynamicFacetManager.prototype.respectMaximumExpandedFacetsThreshold = function () {
        if (this.options.maximumNumberOfExpandedFacets === -1) {
            return;
        }
        var _a = underscore_1.partition(this.displayedFacets, function (facet) { return facet.options.enableCollapse; }), collapsableFacets = _a[0], uncollapsableFacets = _a[1];
        var facetsLeftToExpandCounter = this.options.maximumNumberOfExpandedFacets - uncollapsableFacets.length;
        collapsableFacets.forEach(function (dynamicFacet) {
            if (facetsLeftToExpandCounter < 1) {
                return dynamicFacet.collapse();
            }
            if (dynamicFacet.options.collapsedByDefault) {
                dynamicFacet.logger.info('The facet has its "collapsedByDefault" option set to "true", which prevents the DynamicFacetManager from expanding it.', 'While this configuration may be legitimate, it partially defeats the purpose of the dynamic navigation experience feature.', 'For more information, see https://docs.coveo.com/en/2917/.');
                return dynamicFacet.collapse();
            }
            facetsLeftToExpandCounter--;
            dynamicFacet.expand();
        });
    };
    DynamicFacetManager.prototype.getChildFacetWithId = function (id) {
        return underscore_1.find(this.childrenFacets, function (facet) { return facet.options.id === id; });
    };
    DynamicFacetManager.prototype.notImplementedError = function () {
        this.logger.error('DynamicFacetManager is not supported by your current search endpoint. Disabling this component.');
        this.disable();
    };
    DynamicFacetManager.prototype.isCurrentlyDisplayed = function () {
        return !!underscore_1.find(this.childrenFacets, function (facet) { return facet.isCurrentlyDisplayed(); });
    };
    DynamicFacetManager.ID = 'DynamicFacetManager';
    DynamicFacetManager.doExport = function () { return GlobalExports_1.exportGlobally({ DynamicFacetManager: DynamicFacetManager }); };
    /**
     * The options for the DynamicFacetManager
     * @componentOptions
     */
    DynamicFacetManager.options = {
        /**
         * Whether to allow the reordering of facets based on Coveo ML and index ranking scores.
         *
         * **Default:** `true`
         */
        enableReorder: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'Filtering' }),
        /**
         * A function to execute whenever facets are updated in the query response @externaldocs [Defining Custom Dynamic Facet Behaviors](https://docs.coveo.com/en/2917/javascript-search-framework/using-dynamic-facets#defining-custom-dynamic-facet-behaviors).
         *
         * **Note:**
         * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
         * > [`init`]{@link init} call of your search interface (see
         * > [Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
         * > or before the `init` call, using the `options` top-level function (see
         * > [Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
         */
        onUpdate: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        }),
        /**
         * A custom sort function to execute on facets on every successful query response @externaldocs [Using Custom Dynamic Facet Sort Functions](https://docs.coveo.com/en/2917/javascript-search-framework/using-dynamic-facets#using-custom-dynamic-facet-sort-functions).
         *
         * **Note:**
         * > If specified, the function must implement the JavaScript compareFunction (see [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).
         * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
         * > [`init`]{@link init} call of your search interface (see
         * > [Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
         * > or before the `init` call, using the `options` top-level function (see
         * > [Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
         */
        compareFacets: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        }),
        /**
         * The maximum number of expanded facets inside the manager.
         * Remaining facets are collapsed.
         *
         * **Note:**
         * Prioritizes facets with active values, and then prioritizes first facets.
         * If the number of facets with active values exceeds the value of the `maximumNumberOfExpandedFacets` option, it overrides the option.
         *
         * Using the value `-1` disables the feature and keeps all facets expanded.
         *
         * @availablesince [September 2019 Release (v2.7023)](https://docs.coveo.com/en/2990/)
         */
        maximumNumberOfExpandedFacets: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 4, min: -1 })
    };
    return DynamicFacetManager;
}(Component_1.Component));
exports.DynamicFacetManager = DynamicFacetManager;
Initialization_1.Initialization.registerAutoCreateComponent(DynamicFacetManager);
DynamicFacetManager.doExport();


/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='Facet.ts' />
var StringUtils_1 = __webpack_require__(22);
var QueryUtils_1 = __webpack_require__(21);
var FileTypes_1 = __webpack_require__(113);
var DateUtils_1 = __webpack_require__(32);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var Strings_1 = __webpack_require__(6);
var FacetUtils = /** @class */ (function () {
    function FacetUtils() {
    }
    FacetUtils.getRegexToUseForFacetSearch = function (value, ignoreAccent) {
        return new RegExp(StringUtils_1.StringUtils.stringToRegex(value, ignoreAccent), 'i');
    };
    FacetUtils.getDisplayValueFromValueCaption = function (value, field, valueCaption) {
        var returnValue = this.tryToGetTranslatedCaption(field, value);
        return valueCaption[value] || returnValue;
    };
    FacetUtils.getValuesToUseForSearchInFacet = function (original, facet) {
        var ret = [original];
        var regex = this.getRegexToUseForFacetSearch(original, facet.options.facetSearchIgnoreAccents);
        if (facet.options.valueCaption) {
            _.chain(facet.options.valueCaption)
                .pairs()
                .filter(function (pair) {
                return regex.test(pair[1]);
            })
                .each(function (match) {
                ret.push(match[0]);
            });
            if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@objecttype') ||
                QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@filetype')) {
                _.each(FileTypes_1.FileTypes.getFileTypeCaptions(), function (value, key) {
                    if (!(key in facet.options.valueCaption) && regex.test(value)) {
                        ret.push(key);
                    }
                });
            }
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@objecttype') ||
            QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@filetype')) {
            _.each(_.filter(_.pairs(FileTypes_1.FileTypes.getFileTypeCaptions()), function (pair) {
                return regex.test(pair[1]);
            }), function (match) {
                ret.push(match[0]);
            });
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@month')) {
            _.each(_.range(1, 13), function (month) {
                if (regex.test(DateUtils_1.DateUtils.monthToString(month - 1))) {
                    ret.push(('0' + month.toString()).substr(-2));
                }
            });
        }
        return ret;
    };
    FacetUtils.buildFacetSearchPattern = function (values) {
        values = _.map(values, function (value) {
            return Utils_1.Utils.escapeRegexCharacter(value);
        });
        values[0] = '.*' + values[0] + '.*';
        return values.join('|');
    };
    FacetUtils.needAnotherFacetSearch = function (currentSearchLength, newSearchLength, oldSearchLength, desiredSearchLength) {
        // Something was removed (currentSearch < newSearch)
        // && we might want to display more facet search result(currentSearch < desiredSearch)
        // && the new query returned more stuff than the old one so there's still more results(currentSearchLength > oldLength)
        return currentSearchLength < newSearchLength && currentSearchLength < desiredSearchLength && currentSearchLength > oldSearchLength;
    };
    FacetUtils.addNoStateCssClassToFacetValues = function (facet, container) {
        // This takes care of adding the correct css class on each facet value checkbox (empty white box) if at least one value is selected in that facet
        if (facet.values.getSelected().length != 0) {
            var noStates = Dom_1.$$(container).findAll('li:not(.coveo-selected)');
            _.each(noStates, function (noState) {
                Dom_1.$$(noState).addClass('coveo-no-state');
            });
        }
    };
    FacetUtils.tryToGetTranslatedCaption = function (field, value) {
        var found;
        if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@filetype')) {
            found = FileTypes_1.FileTypes.getFileType(value).caption;
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@objecttype')) {
            found = FileTypes_1.FileTypes.getObjectType(value).caption;
        }
        else if (FacetUtils.isMonthFieldValue(field, value)) {
            var month = parseInt(value, 10);
            found = DateUtils_1.DateUtils.monthToString(month - 1);
        }
        else {
            found = Strings_1.l(value);
        }
        return found != undefined && Utils_1.Utils.isNonEmptyString(found) ? found : value;
    };
    FacetUtils.isMonthFieldValue = function (field, value) {
        if (!QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@month')) {
            return false;
        }
        var asInt = parseInt(value, 10);
        if (isNaN(asInt)) {
            return false;
        }
        if (asInt < 1 || asInt > 12) {
            return false;
        }
        return true;
    };
    return FacetUtils;
}());
exports.FacetUtils = FacetUtils;


/***/ }),

/***/ 462:
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
var Template_1 = __webpack_require__(27);
var TemplateList_1 = __webpack_require__(90);
var _ = __webpack_require__(0);
var TableTemplate = /** @class */ (function (_super) {
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

/***/ 463:
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
var Template_1 = __webpack_require__(27);
var DefaultRecommendationTemplate = /** @class */ (function (_super) {
    __extends(DefaultRecommendationTemplate, _super);
    function DefaultRecommendationTemplate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultRecommendationTemplate.prototype.instantiateToString = function (object) {
        var template = "<div class=\"coveo-result-frame\">\n        <div class=\"coveo-result-row\">\n          <div class=\"coveo-result-cell\" style=\"width:40px;text-align:center;vertical-align:middle;\">\n            <span class=\"CoveoIcon\" data-small=\"true\" data-with-label=\"false\">\n            </span>\n          </div>\n          <div class=\"coveo-result-cell\" style=\"padding:0 0 3px 5px;vertical-align:middle\">\n            <div class=\"coveo-result-row\">\n              <div class=\"coveo-result-cell\" style=\"font-size:10pt;\">\n                <a class=\"CoveoResultLink\" style=\"display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">\n                </a>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>";
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


/***/ }),

/***/ 464:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var Core_1 = __webpack_require__(20);
var ResultList_1 = __webpack_require__(87);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var Logger_1 = __webpack_require__(9);
var TemplateToHtml = /** @class */ (function () {
    function TemplateToHtml(args) {
        this.args = args;
    }
    TemplateToHtml.prototype.buildResults = function (results, layout, currentlyDisplayedResults) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var res, resultsPromises;
            return __generator(this, function (_a) {
                res = [];
                resultsPromises = underscore_1.map(results.results, function (result, index) {
                    return _this.buildResult(result, layout, currentlyDisplayedResults).then(function (resultElement) {
                        if (resultElement != null) {
                            res.push({ elem: resultElement, idx: index });
                        }
                        ResultList_1.ResultList.resultCurrentlyBeingRendered = null;
                        return resultElement;
                    });
                });
                // We need to sort by the original index order, because in lazy loading mode, it's possible that results does not gets rendered
                // in the correct order returned by the index, depending on the time it takes to load all the results component for a given result template
                return [2 /*return*/, Promise.all(resultsPromises).then(function () {
                        return underscore_1.pluck(underscore_1.sortBy(res, 'idx'), 'elem');
                    })];
            });
        });
    };
    TemplateToHtml.prototype.buildResult = function (result, layout, currentlyDisplayedResults) {
        return __awaiter(this, void 0, void 0, function () {
            var resultElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Core_1.Assert.exists(result);
                        Core_1.QueryUtils.setStateObjectOnQueryResult(this.args.queryStateModel.get(), result);
                        Core_1.QueryUtils.setSearchInterfaceObjectOnQueryResult(this.args.searchInterface, result);
                        ResultList_1.ResultList.resultCurrentlyBeingRendered = result;
                        return [4 /*yield*/, this.createHtmlElement(result, layout)];
                    case 1:
                        resultElement = _a.sent();
                        if (resultElement != null) {
                            Core_1.Component.bindResultToElement(resultElement, result);
                        }
                        currentlyDisplayedResults.push(result);
                        return [4 /*yield*/, this.autoCreateComponentsInsideResult(resultElement, result).initResult];
                    case 2:
                        _a.sent();
                        this.verifyChildren(resultElement);
                        return [2 /*return*/, resultElement];
                }
            });
        });
    };
    TemplateToHtml.prototype.autoCreateComponentsInsideResult = function (element, result) {
        Core_1.Assert.exists(element);
        return Core_1.Initialization.automaticallyCreateComponentsInsideResult(element, result);
    };
    TemplateToHtml.prototype.createHtmlElement = function (result, layout) {
        return this.args.resultTemplate.instantiateToElement(result, {
            wrapInDiv: true,
            checkCondition: true,
            currentLayout: layout,
            responsiveComponents: this.args.searchInterface.responsiveComponents
        });
    };
    TemplateToHtml.prototype.verifyChildren = function (element) {
        var containsResultLink = !!Dom_1.$$(element).find('.CoveoResultLink');
        if (containsResultLink) {
            return;
        }
        var msg = "Result does not contain a \"CoveoResultLink\" component, please verify the result template";
        new Logger_1.Logger(element).warn(msg, this.args.resultTemplate);
    };
    return TemplateToHtml;
}());
exports.TemplateToHtml = TemplateToHtml;


/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Defer_1 = __webpack_require__(31);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var FocusTrap = /** @class */ (function () {
    function FocusTrap(container) {
        this.container = container;
        this.hiddenElements = [];
        this.enable();
    }
    Object.defineProperty(FocusTrap.prototype, "focusableElements", {
        get: function () {
            return underscore_1.sortBy(this.container.querySelectorAll('[tabindex]'), function (element) { return element.tabIndex; });
        },
        enumerable: true,
        configurable: true
    });
    FocusTrap.prototype.disable = function () {
        document.removeEventListener('focusin', this.focusInEvent);
        document.removeEventListener('focusout', this.focusOutEvent);
        this.showHiddenElements();
        this.enabled = false;
    };
    FocusTrap.prototype.enable = function () {
        var _this = this;
        document.addEventListener('focusin', (this.focusInEvent = function (e) { return _this.onFocusIn(e); }));
        document.addEventListener('focusout', (this.focusOutEvent = function (e) { return _this.onFocusOut(e); }));
        this.hideAllExcept(this.container);
        this.enabled = true;
    };
    FocusTrap.prototype.showHiddenElements = function () {
        while (this.hiddenElements.length) {
            this.hiddenElements.pop().removeAttribute('aria-hidden');
        }
    };
    FocusTrap.prototype.hideElement = function (element) {
        if (element.getAttribute('aria-hidden')) {
            return;
        }
        this.hiddenElements.push(element);
        element.setAttribute('aria-hidden', "" + true);
    };
    FocusTrap.prototype.hideSiblings = function (allowedElement) {
        var _this = this;
        var parent = allowedElement.parentElement;
        if (parent) {
            underscore_1.without(Dom_1.$$(parent).children(), allowedElement).forEach(function (elementToHide) {
                _this.hideElement(elementToHide);
            });
        }
    };
    FocusTrap.prototype.hideAllExcept = function (allowedElement) {
        this.hideSiblings(allowedElement);
        var parent = allowedElement.parentElement;
        if (parent && parent !== document.body) {
            this.hideAllExcept(parent);
        }
    };
    FocusTrap.prototype.getFocusableSibling = function (element, previous) {
        if (previous === void 0) { previous = false; }
        var elements = this.focusableElements;
        var currentIndex = elements.indexOf(element);
        if (currentIndex === -1) {
            return null;
        }
        return elements[(currentIndex + (previous ? -1 : 1) + elements.length) % elements.length];
    };
    FocusTrap.prototype.focusSibling = function (element, previous) {
        if (previous === void 0) { previous = false; }
        var sibling = this.getFocusableSibling(element, previous);
        if (sibling) {
            sibling.focus();
        }
    };
    FocusTrap.prototype.focusFirstElement = function () {
        var elements = this.focusableElements;
        if (elements.length) {
            elements[0].focus();
        }
    };
    FocusTrap.prototype.elementIsBefore = function (oldElement, newElement) {
        if (!newElement) {
            return false;
        }
        return oldElement.compareDocumentPosition(newElement) === Node.DOCUMENT_POSITION_PRECEDING;
    };
    FocusTrap.prototype.onLosingFocus = function (oldElement, newElement) {
        var _this = this;
        Defer_1.Defer.defer(function () {
            if (!_this.enabled) {
                return;
            }
            _this.enabled = false;
            if (oldElement && _this.focusIsAllowed(oldElement)) {
                _this.focusSibling(oldElement, _this.elementIsBefore(oldElement, newElement));
            }
            else {
                _this.focusFirstElement();
            }
            _this.enabled = true;
        });
    };
    FocusTrap.prototype.focusIsAllowed = function (element) {
        return this.container.contains(element);
    };
    FocusTrap.prototype.elementIsInPage = function (element) {
        return element && element !== document.body.parentElement;
    };
    FocusTrap.prototype.onFocusIn = function (e) {
        if (!this.enabled) {
            return;
        }
        var oldElement = e.relatedTarget;
        var handledByFocusOut = this.elementIsInPage(oldElement);
        if (handledByFocusOut) {
            return;
        }
        var newElement = e.target;
        if (!this.elementIsInPage(newElement)) {
            return;
        }
        if (!this.focusIsAllowed(newElement)) {
            this.onLosingFocus(null, newElement);
        }
    };
    FocusTrap.prototype.onFocusOut = function (e) {
        if (!this.enabled) {
            return;
        }
        var newElement = e.relatedTarget;
        if (!this.elementIsInPage(newElement)) {
            return;
        }
        if (!newElement || !this.focusIsAllowed(newElement)) {
            this.onLosingFocus(e.target, newElement);
        }
    };
    return FocusTrap;
}());
exports.FocusTrap = FocusTrap;


/***/ }),

/***/ 466:
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
var TemplateHelpers_1 = __webpack_require__(115);
var HighlightUtils_1 = __webpack_require__(68);
var DateUtils_1 = __webpack_require__(32);
var CurrencyUtils_1 = __webpack_require__(130);
var HtmlUtils_1 = __webpack_require__(179);
var Utils_1 = __webpack_require__(4);
var StringUtils_1 = __webpack_require__(22);
var TimeSpanUtils_1 = __webpack_require__(70);
var EmailUtils_1 = __webpack_require__(178);
var QueryUtils_1 = __webpack_require__(21);
var DeviceUtils_1 = __webpack_require__(24);
var Dom_1 = __webpack_require__(1);
var SearchEndpoint_1 = __webpack_require__(50);
var StreamHighlightUtils_1 = __webpack_require__(114);
var FacetUtils_1 = __webpack_require__(39);
var Globalize = __webpack_require__(23);
var _ = __webpack_require__(0);
var Component_1 = __webpack_require__(7);
var TemplateCache_1 = __webpack_require__(66);
var CoreHelpers = /** @class */ (function () {
    function CoreHelpers() {
    }
    /**
     * For backward compatibility reason, the "global" template helper should be available under the
     * coveo namespace.
     * @param scope
     */
    CoreHelpers.exportAllHelpersGlobally = function (scope) {
        _.each(TemplateHelpers_1.TemplateHelpers.getHelpers(), function (helper, name) {
            if (scope[name] == undefined) {
                scope[name] = helper;
            }
        });
    };
    return CoreHelpers;
}());
exports.CoreHelpers = CoreHelpers;
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('javascriptEncode', function (value) {
    return Utils_1.Utils.exists(value) ? StringUtils_1.StringUtils.javascriptEncode(value) : undefined;
});
var executeShorten = function (content, options) {
    var strAndHoles = HighlightUtils_1.StringAndHoles.shortenString(content, options.length, '...');
    if (Utils_1.Utils.exists(options.highlights)) {
        return HighlightUtils_1.HighlightUtils.highlightString(strAndHoles.value, options.highlights, strAndHoles.holes, options.cssClass || 'highlight');
    }
    else {
        return strAndHoles.value;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shorten', function (content, length, highlights, cssClass) {
    return executeShorten(content, {
        length: length,
        highlights: highlights,
        cssClass: cssClass
    });
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shortenv2', function (content, options) {
    return executeShorten(content, options);
});
var executeShortenPath = function (content, options) {
    var strAndHoles = HighlightUtils_1.StringAndHoles.shortenPath(content, options.length);
    if (Utils_1.Utils.exists(options.highlights)) {
        return HighlightUtils_1.HighlightUtils.highlightString(strAndHoles.value, options.highlights, strAndHoles.holes, options.cssClass || 'highlight');
    }
    else {
        return strAndHoles.value;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shortenPath', function (content, length, highlights, cssClass) {
    return executeShortenPath(content, {
        length: length,
        highlights: highlights,
        cssClass: cssClass
    });
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('shortenPathv2', function (content, options) {
    return executeShortenPath(content, options);
});
var executeShortenUri = function (content, options) {
    var strAndHoles = HighlightUtils_1.StringAndHoles.shortenUri(content, options.length);
    if (Utils_1.Utils.exists(options.highlights)) {
        return HighlightUtils_1.HighlightUtils.highlightString(strAndHoles.value, options.highlights, strAndHoles.holes, options.cssClass || 'highlight');
    }
    else {
        return strAndHoles.value;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shortenUri', function (content, length, highlights, cssClass) {
    return executeShortenUri(content, {
        length: length,
        highlights: highlights,
        cssClass: cssClass
    });
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shortenUriv2', function (content, options) {
    return executeShortenUri(content, options);
});
var executeHighlight = function (content, options) {
    if (Utils_1.Utils.exists(content)) {
        if (Utils_1.Utils.exists(options.highlights)) {
            return HighlightUtils_1.HighlightUtils.highlightString(content, options.highlights, null, options.cssClass || 'highlight');
        }
        else {
            return content;
        }
    }
    else {
        return undefined;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlight', function (content, highlights, cssClass) {
    return executeHighlight(content, {
        highlights: highlights,
        cssClass: cssClass
    });
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightv2', function (content, options) {
    return executeHighlight(content, options);
});
var executeHighlightStreamText = function (content, options) {
    if (Utils_1.Utils.exists(content) && Utils_1.Utils.exists(options.termsToHighlight) && Utils_1.Utils.exists(options.phrasesToHighlight)) {
        if (termsToHighlightAreDefined(options.termsToHighlight, options.phrasesToHighlight)) {
            return StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamText(content, options.termsToHighlight, options.phrasesToHighlight, options.opts);
        }
        else {
            return content;
        }
    }
    else {
        return undefined;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightStreamText', function (content, termsToHighlight, phrasesToHighlight, opts) {
    if (termsToHighlight === void 0) { termsToHighlight = resolveTermsToHighlight(); }
    if (phrasesToHighlight === void 0) { phrasesToHighlight = resolvePhrasesToHighlight(); }
    return executeHighlightStreamText(content, {
        termsToHighlight: termsToHighlight,
        phrasesToHighlight: phrasesToHighlight,
        opts: opts
    });
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightStreamTextv2', function (content, options) {
    var mergedOptions = __assign({ termsToHighlight: resolveTermsToHighlight(), phrasesToHighlight: resolvePhrasesToHighlight() }, options);
    return executeHighlightStreamText(content, mergedOptions);
});
var executeHighlightStreamHTML = function (content, options) {
    if (Utils_1.Utils.exists(content) && Utils_1.Utils.exists(options.termsToHighlight) && Utils_1.Utils.exists(options.phrasesToHighlight)) {
        if (termsToHighlightAreDefined(options.termsToHighlight, options.phrasesToHighlight)) {
            return StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamHTML(content, options.termsToHighlight, options.phrasesToHighlight, options.opts);
        }
        else {
            return content;
        }
    }
    else {
        return undefined;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightStreamHTML', function (content, termsToHighlight, phrasesToHighlight, opts) {
    if (termsToHighlight === void 0) { termsToHighlight = resolveTermsToHighlight(); }
    if (phrasesToHighlight === void 0) { phrasesToHighlight = resolvePhrasesToHighlight(); }
    return executeHighlightStreamHTML(content, {
        termsToHighlight: termsToHighlight,
        phrasesToHighlight: phrasesToHighlight,
        opts: opts
    });
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightStreamHTMLv2', function (content, options) {
    var mergedOptions = __assign({ termsToHighlight: resolveTermsToHighlight(), phrasesToHighlight: resolvePhrasesToHighlight() }, options);
    return executeHighlightStreamHTML(content, mergedOptions);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('number', function (value, options) {
    if (!Utils_1.Utils.exists(value)) {
        return undefined;
    }
    var numberValue = Number(value);
    var format = _.isString(options) ? options : options && options.format;
    if (!format) {
        return StringUtils_1.StringUtils.htmlEncode(numberValue.toString());
    }
    return StringUtils_1.StringUtils.htmlEncode(Globalize.format(numberValue, format));
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('date', function (value, options) {
    return DateUtils_1.DateUtils.dateToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('time', function (value, options) {
    return DateUtils_1.DateUtils.timeToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('dateTime', function (value, options) {
    return DateUtils_1.DateUtils.dateTimeToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('emailDateTime', function (value, options) {
    var defaultOptions = {};
    defaultOptions.includeTimeIfThisWeek = true;
    var optionsToUse = _.extend(options, defaultOptions);
    return value ? DateUtils_1.DateUtils.dateTimeToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), optionsToUse) : undefined;
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('currency', function (value, options) {
    return CurrencyUtils_1.CurrencyUtils.currencyToString(value, options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('timeSpan', function (value, options) {
    if (options === void 0) { options = { isMilliseconds: false }; }
    return new TimeSpanUtils_1.TimeSpan(value, options.isMilliseconds).getHHMMSS();
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('email', function (value) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // support old arguments (value: any, companyDomain: string, me: string, lengthLimit = 2, truncateName = false)
    var companyDomain;
    var me;
    var lengthLimit;
    var truncateName;
    if (_.isObject(args[0])) {
        companyDomain = args[0]['companyDomain'];
        me = args[0]['me'];
        lengthLimit = args[0]['lengthLimit'];
        truncateName = args[0]['truncateName'];
    }
    else {
        companyDomain = args[0];
        me = args[1];
        lengthLimit = args[2];
        truncateName = args[3];
    }
    if (lengthLimit == undefined) {
        lengthLimit = 2;
    }
    if (truncateName == undefined) {
        truncateName = false;
    }
    if (_.isString(value)) {
        var listOfAddresses = EmailUtils_1.EmailUtils.splitSemicolonSeparatedListOfEmailAddresses(value);
        return EmailUtils_1.EmailUtils.emailAddressesToHyperlinks(listOfAddresses, companyDomain, me, lengthLimit, truncateName);
    }
    else if (_.isArray(value)) {
        return EmailUtils_1.EmailUtils.emailAddressesToHyperlinks(value, companyDomain, me, lengthLimit, truncateName);
    }
    else {
        return undefined;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('excessEmailToggle', function (target) {
    Dom_1.$$(target).removeClass('coveo-active');
    if (Dom_1.$$(target).hasClass('coveo-emails-excess-collapsed')) {
        _.each(Dom_1.$$(target).siblings('.coveo-emails-excess-expanded'), function (sibling) {
            Dom_1.$$(sibling).addClass('coveo-active');
        });
    }
    else if (Dom_1.$$(target).hasClass('coveo-hide-expanded')) {
        Dom_1.$$(target.parentElement).addClass('coveo-inactive');
        _.each(Dom_1.$$(target.parentElement).siblings('.coveo-emails-excess-collapsed'), function (sibling) {
            Dom_1.$$(sibling).addClass('coveo-active');
        });
    }
    return undefined;
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('anchor', function (href, options) {
    return HtmlUtils_1.AnchorUtils.buildAnchor(href, options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('image', function (src, options, result) {
    if (result === void 0) { result = resolveQueryResult(); }
    if (options && options.srcTemplate) {
        return HtmlUtils_1.ImageUtils.buildImage(StringUtils_1.StringUtils.buildStringTemplateFromResult(options.srcTemplate, result), {
            alt: options.alt,
            height: options.height,
            width: options.width
        });
    }
    return HtmlUtils_1.ImageUtils.buildImage(src, options);
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('thumbnail', function (result, endpoint, options) {
    if (result === void 0) { result = resolveQueryResult(); }
    if (endpoint === void 0) { endpoint = 'default'; }
    if (QueryUtils_1.QueryUtils.hasThumbnail(result)) {
        return HtmlUtils_1.ImageUtils.buildImageFromResult(result, SearchEndpoint_1.SearchEndpoint.endpoints[endpoint], options);
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('fromFileTypeToIcon', function (result, options) {
    if (result === void 0) { result = resolveQueryResult(); }
    if (options === void 0) { options = {}; }
    var icon = Component_1.Component.getComponentRef('Icon');
    if (icon) {
        return icon.createIcon(result, options).outerHTML;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('attrEncode', function (value) {
    return ('' + value) /* Forces the conversion to string. */
        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
        .replace(/'/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('loadTemplates', function (templatesToLoad, once) {
    if (once === void 0) { once = true; }
    var ret = '';
    var data = resolveQueryResult();
    var atLeastOneWasLoaded = false;
    var toLoad = templatesToLoad;
    var defaultTmpl;
    _.each(templatesToLoad, function (value, key, obj) {
        if (value == 'default') {
            defaultTmpl = key;
        }
    });
    if (defaultTmpl != undefined) {
        toLoad = _.omit(templatesToLoad, defaultTmpl);
    }
    _.each(toLoad, function (condition, id, obj) {
        if (!atLeastOneWasLoaded || !once) {
            atLeastOneWasLoaded = atLeastOneWasLoaded || condition;
            ret += TemplateHelpers_1.TemplateHelpers.getHelper('loadTemplate')(id, condition, data);
        }
    });
    if (!atLeastOneWasLoaded && defaultTmpl != undefined) {
        ret += TemplateHelpers_1.TemplateHelpers.getHelper('loadTemplate')(defaultTmpl, true, data);
    }
    return ret;
});
var byteMeasure = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('size', function (value, options) {
    var size = parseInt(value, 10);
    var precision = options != null && options.precision != null ? options.precision : 2;
    var base = options != null && options.base != null ? options.base : 0;
    while (size > 1024 && base + 1 < byteMeasure.length) {
        size /= 1024;
        base++;
    }
    size = Math.floor(size * Math.pow(10, precision)) / Math.pow(10, precision);
    return size + ' ' + byteMeasure[base];
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('translatedCaption', function (value) {
    return FacetUtils_1.FacetUtils.tryToGetTranslatedCaption('@filetype', value);
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('loadTemplate', function (id, condition, data) {
    if (condition === void 0) { condition = true; }
    if (Utils_1.Utils.isNullOrUndefined(data)) {
        data = resolveQueryResult();
    }
    if (condition) {
        return TemplateCache_1.TemplateCache.getTemplate(id).instantiateToString(data, {
            checkCondition: false
        });
    }
    return '';
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('encodeCarriageReturn', function (data) {
    if (Utils_1.Utils.isNullOrUndefined(data)) {
        return undefined;
    }
    else {
        return StringUtils_1.StringUtils.encodeCarriageReturn(data);
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('isMobileDevice', function () {
    return DeviceUtils_1.DeviceUtils.isMobileDevice() ? DeviceUtils_1.DeviceUtils.getDeviceName() : null;
});
function resolveQueryResult() {
    var found;
    var resultList = Component_1.Component.getComponentRef('ResultList');
    if (resultList) {
        found = resultList.resultCurrentlyBeingRendered;
    }
    if (!found) {
        var quickview = Component_1.Component.getComponentRef('Quickview');
        if (quickview) {
            found = quickview.resultCurrentlyBeingRendered;
        }
    }
    return found;
}
function resolveTermsToHighlight() {
    var currentQueryResult = resolveQueryResult();
    if (currentQueryResult) {
        return currentQueryResult.termsToHighlight;
    }
}
function resolvePhrasesToHighlight() {
    var currentQueryResult = resolveQueryResult();
    if (currentQueryResult) {
        return currentQueryResult.phrasesToHighlight;
    }
}
function termsToHighlightAreDefined(termsToHighlight, phrasesToHighlight) {
    return Utils_1.Utils.isNonEmptyArray(_.keys(termsToHighlight)) || Utils_1.Utils.isNonEmptyArray(_.keys(phrasesToHighlight));
}


/***/ }),

/***/ 497:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(16);
var DynamicFacetHeaderButton = /** @class */ (function () {
    function DynamicFacetHeaderButton(rootOptions) {
        this.rootOptions = rootOptions;
        this.create();
    }
    DynamicFacetHeaderButton.prototype.create = function () {
        var hasIcon = this.rootOptions.iconSVG && this.rootOptions.iconClassName;
        this.button = Dom_1.$$('button', {
            className: ("coveo-dynamic-facet-header-btn " + (this.rootOptions.className || '')).trim(),
            type: 'button'
        }, hasIcon ? this.rootOptions.iconSVG : this.rootOptions.label);
        this.rootOptions.action && this.button.on('click', this.rootOptions.action);
        if (hasIcon) {
            this.button.setAttribute('aria-label', this.rootOptions.label);
            this.button.setAttribute('title', this.rootOptions.label);
            SVGDom_1.SVGDom.addClassToSVGInContainer(this.button.el, this.rootOptions.iconClassName);
        }
        if (this.rootOptions.ariaLabel) {
            this.button.setAttribute('aria-label', this.rootOptions.ariaLabel);
        }
        if (this.rootOptions.shouldDisplay !== undefined) {
            this.toggle(this.rootOptions.shouldDisplay);
        }
        this.element = this.button.el;
    };
    DynamicFacetHeaderButton.prototype.toggle = function (shouldDisplay) {
        this.button.toggle(shouldDisplay);
    };
    return DynamicFacetHeaderButton;
}());
exports.DynamicFacetHeaderButton = DynamicFacetHeaderButton;


/***/ }),

/***/ 504:
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
var Utils_1 = __webpack_require__(4);
var DynamicFacetRequestBuilder = /** @class */ (function () {
    function DynamicFacetRequestBuilder(request) {
        this.request = request;
    }
    DynamicFacetRequestBuilder.prototype.buildBaseRequestForQuery = function (query) {
        return __assign({}, this.request, { filterFacetCount: this.getFilterFacetCount(!!query.filterField) });
    };
    DynamicFacetRequestBuilder.prototype.getFilterFacetCount = function (isFoldingEnabled) {
        if (Utils_1.Utils.isUndefined(this.request.filterFacetCount)) {
            return !isFoldingEnabled;
        }
        return this.request.filterFacetCount;
    };
    return DynamicFacetRequestBuilder;
}());
exports.DynamicFacetRequestBuilder = DynamicFacetRequestBuilder;


/***/ }),

/***/ 505:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 506:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(562);
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var SVGIcons_1 = __webpack_require__(12);
var SVGDom_1 = __webpack_require__(16);
var DynamicFacetHeaderButton_1 = __webpack_require__(497);
var DynamicFacetHeaderCollapseToggle_1 = __webpack_require__(563);
var DynamicFacetHeader = /** @class */ (function () {
    function DynamicFacetHeader(options) {
        this.options = options;
        this.element = Dom_1.$$('div', { className: 'coveo-dynamic-facet-header' }).el;
        this.title = this.createTitle();
        Dom_1.$$(this.element).append(this.title.el);
        Dom_1.$$(this.element).append(this.createWaitAnimation());
        Dom_1.$$(this.element).append(this.createClearButton());
        this.options.enableCollapse && this.enableCollapse();
    }
    DynamicFacetHeader.prototype.createClearButton = function () {
        var _this = this;
        this.clearButton = new DynamicFacetHeaderButton_1.DynamicFacetHeaderButton({
            label: Strings_1.l('Clear'),
            ariaLabel: Strings_1.l('Clear', this.options.title),
            className: 'coveo-dynamic-facet-header-clear',
            shouldDisplay: false,
            action: function () { return _this.options.clear(); }
        });
        return this.clearButton.element;
    };
    DynamicFacetHeader.prototype.createCollapseToggle = function () {
        this.collapseToggle = new DynamicFacetHeaderCollapseToggle_1.DynamicFacetHeaderCollapseToggle(this.options);
        return this.collapseToggle.element;
    };
    DynamicFacetHeader.prototype.enableCollapse = function () {
        var _this = this;
        Dom_1.$$(this.element).append(this.createCollapseToggle());
        Dom_1.$$(this.title).addClass('coveo-clickable');
        Dom_1.$$(this.title).on('click', function () { return _this.options.toggleCollapse(); });
    };
    DynamicFacetHeader.prototype.toggleCollapse = function (isCollapsed) {
        this.options.enableCollapse && this.collapseToggle.toggleButtons(isCollapsed);
    };
    DynamicFacetHeader.prototype.createTitle = function () {
        return Dom_1.$$('h2', {
            className: 'coveo-dynamic-facet-header-title',
            ariaLabel: "" + Strings_1.l('FacetTitle', this.options.title)
        }, Dom_1.$$('span', { ariaHidden: true, title: this.options.title }, this.options.title));
    };
    DynamicFacetHeader.prototype.createWaitAnimation = function () {
        this.waitAnimation = Dom_1.$$('div', { className: 'coveo-dynamic-facet-header-wait-animation' }, SVGIcons_1.SVGIcons.icons.loading);
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.waitAnimation.el, 'coveo-dynamic-facet-header-wait-animation-svg');
        this.waitAnimation.toggle(false);
        return this.waitAnimation.el;
    };
    DynamicFacetHeader.prototype.toggleClear = function (visible) {
        this.clearButton.toggle(visible);
    };
    DynamicFacetHeader.prototype.showLoading = function () {
        var _this = this;
        clearTimeout(this.showLoadingTimeout);
        this.showLoadingTimeout = window.setTimeout(function () { return _this.waitAnimation.toggle(true); }, DynamicFacetHeader.showLoadingDelay);
    };
    DynamicFacetHeader.prototype.hideLoading = function () {
        clearTimeout(this.showLoadingTimeout);
        this.waitAnimation.toggle(false);
    };
    DynamicFacetHeader.showLoadingDelay = 2000;
    return DynamicFacetHeader;
}());
exports.DynamicFacetHeader = DynamicFacetHeader;


/***/ }),

/***/ 507:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The allowed sort criteria for a Search API
 * [facet request]{@link IFacetRequest}.
 */
var FacetSortCriteria;
(function (FacetSortCriteria) {
    /**
     * Sort facet values in descending score order.
     *
     * Facet value scores are based on number of occurrences and position in the
     * ranked query result set.
     *
     * The Coveo Machine Learning dynamic navigation experience feature only
     * works with this sort criterion.
     */
    FacetSortCriteria["score"] = "score";
    /**
     * Sort facet values in ascending alphanumeric order.
     */
    FacetSortCriteria["alphanumeric"] = "alphanumeric";
    /**
     * Sort facet values in descending number of occurrences.
     */
    FacetSortCriteria["occurrences"] = "occurrences";
})(FacetSortCriteria = exports.FacetSortCriteria || (exports.FacetSortCriteria = {}));
function isFacetSortCriteria(sortCriteria) {
    return !!FacetSortCriteria[sortCriteria];
}
exports.isFacetSortCriteria = isFacetSortCriteria;


/***/ }),

/***/ 508:
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
var Dom_1 = __webpack_require__(1);
var ComboboxInput_1 = __webpack_require__(564);
var underscore_1 = __webpack_require__(0);
var SVGIcons_1 = __webpack_require__(12);
var SVGDom_1 = __webpack_require__(16);
var ComboboxValues_1 = __webpack_require__(565);
__webpack_require__(566);
var Utils_1 = __webpack_require__(4);
var Strings_1 = __webpack_require__(6);
var Combobox = /** @class */ (function () {
    function Combobox(options) {
        this.options = options;
        this.defaultOptions = {
            wrapperClassName: '',
            clearOnBlur: false
        };
        this.throttlingDelay = 600;
        this.isRequestCancelled = false;
        this.throttledRequest = underscore_1.throttle(this.triggerRequest, this.throttlingDelay, {
            leading: true,
            trailing: true
        });
        this.options = __assign({}, this.defaultOptions, this.options);
        this.id = underscore_1.uniqueId('coveo-combobox-');
        this.create();
    }
    Combobox.prototype.create = function () {
        this.element = Dom_1.$$('div', { className: "coveo-combobox-wrapper " + this.options.wrapperClassName }).el;
        this.createAndAppendInput();
        this.createAndAppendWaitAnimation();
        this.createAndAppendValues();
    };
    Combobox.prototype.createAndAppendInput = function () {
        this.input = new ComboboxInput_1.ComboboxInput(this);
        this.element.appendChild(this.input.element);
    };
    Combobox.prototype.createAndAppendWaitAnimation = function () {
        this.waitAnimationElement = Dom_1.$$('div', { className: 'coveo-combobox-wait-animation' }, SVGIcons_1.SVGIcons.icons.loading).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.waitAnimationElement, 'coveo-combobox-wait-animation-svg');
        this.toggleWaitAnimation(false);
        this.input.element.appendChild(this.waitAnimationElement);
    };
    Combobox.prototype.toggleWaitAnimation = function (show) {
        Dom_1.$$(this.waitAnimationElement).toggle(show);
    };
    Combobox.prototype.createAndAppendValues = function () {
        this.values = new ComboboxValues_1.ComboboxValues(this);
        this.element.appendChild(this.values.element);
    };
    Combobox.prototype.clearAll = function () {
        this.clearValues();
        this.input.clearInput();
    };
    Combobox.prototype.clearValues = function () {
        this.values.clearValues();
        this.cancelRequest();
    };
    Combobox.prototype.cancelRequest = function () {
        this.toggleWaitAnimation(false);
        this.throttledRequest.cancel();
        this.isRequestCancelled = true;
    };
    Combobox.prototype.onInputChange = function (value) {
        var _this = this;
        if (Utils_1.Utils.isEmptyString(value)) {
            return this.clearValues();
        }
        this.throttledRequest(function () { return _this.options.requestValues(value); }, function () { return _this.values.resetScroll(); });
    };
    Combobox.prototype.onInputBlur = function () {
        if (this.values.mouseIsOverValue) {
            return;
        }
        if (this.values.isRenderingNewValues) {
            return;
        }
        if (this.options.clearOnBlur) {
            return this.clearAll();
        }
        this.clearValues();
    };
    Combobox.prototype.updateAccessibilityAttributes = function (attributes) {
        this.input.updateAccessibilityAttributes(attributes);
    };
    Combobox.prototype.updateAriaLive = function () {
        if (!this.values.hasValues()) {
            this.options.ariaLive.updateText(Strings_1.l('NoValuesFound'));
            return;
        }
        var text = Strings_1.l('ShowingResultsWithQuery', this.values.numberOfValues, this.input.value, this.values.numberOfValues);
        if (this.options.scrollable && this.options.scrollable.areMoreValuesAvailable()) {
            text = text + " (" + Strings_1.l('MoreValuesAvailable') + ")";
        }
        this.options.ariaLive.updateText(text);
    };
    Combobox.prototype.onScrollEndReached = function () {
        var _this = this;
        this.values.saveFocusedValue();
        this.options.scrollable &&
            this.throttledRequest(function () { return _this.options.scrollable.requestMoreValues(); }, function () { return _this.values.restoreFocusedValue(); });
    };
    Combobox.prototype.triggerRequest = function (request, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isRequestCancelled = false;
                        this.toggleWaitAnimation(true);
                        return [4 /*yield*/, request()];
                    case 1:
                        response = _a.sent();
                        this.toggleWaitAnimation(false);
                        if (!this.isRequestCancelled) {
                            this.values.renderFromResponse(response);
                            callback && callback();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Combobox;
}());
exports.Combobox = Combobox;


/***/ }),

/***/ 509:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 510:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Checkbox_1 = __webpack_require__(64);
var Dom_1 = __webpack_require__(1);
var DynamicFacetValueCheckbox = /** @class */ (function () {
    function DynamicFacetValueCheckbox(facetValue, selectAction) {
        if (selectAction === void 0) { selectAction = function () { }; }
        this.facetValue = facetValue;
        this.checkbox = new Checkbox_1.Checkbox(selectAction.bind(this), this.facetValue.displayValue, this.facetValue.selectAriaLabel, "(" + this.facetValue.formattedCount + ")");
        var label = Dom_1.$$(this.checkbox.getElement()).find('.coveo-checkbox-span-label');
        var labelSuffix = Dom_1.$$(this.checkbox.getElement()).find('.coveo-checkbox-span-label-suffix');
        if (label && labelSuffix) {
            label.setAttribute('title', this.facetValue.displayValue);
            label.setAttribute('aria-hidden', 'true');
            labelSuffix.setAttribute('aria-hidden', 'true');
        }
        this.facetValue.isSelected && this.checkbox.select(false);
        this.element = this.checkbox.getElement();
    }
    return DynamicFacetValueCheckbox;
}());
exports.DynamicFacetValueCheckbox = DynamicFacetValueCheckbox;


/***/ }),

/***/ 511:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(577);
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var FacetValueState_1 = __webpack_require__(69);
var Strings_1 = __webpack_require__(6);
var DynamicFacetValueMoreLessButton_1 = __webpack_require__(222);
var DynamicFacetValues = /** @class */ (function () {
    function DynamicFacetValues(facet, creatorKlass) {
        this.facet = facet;
        this.list = Dom_1.$$('ul', { className: 'coveo-dynamic-facet-values' }).el;
        this.valueCreator = new creatorKlass(this.facet);
        this.resetValues();
    }
    DynamicFacetValues.prototype.createFromResponse = function (response) {
        var _this = this;
        this.facetValues = response.values.map(function (facetValue, index) { return _this.valueCreator.createFromResponse(facetValue, index); });
    };
    DynamicFacetValues.prototype.resetValues = function () {
        this.facetValues = this.valueCreator.getDefaultValues();
    };
    Object.defineProperty(DynamicFacetValues.prototype, "allFacetValues", {
        get: function () {
            return this.facetValues;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValues.prototype, "allValues", {
        get: function () {
            return this.facetValues.map(function (facetValue) { return facetValue.value; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValues.prototype, "selectedValues", {
        get: function () {
            return this.facetValues.filter(function (value) { return value.isSelected; }).map(function (_a) {
                var value = _a.value;
                return value;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValues.prototype, "selectedDisplayValues", {
        get: function () {
            return this.facetValues.filter(function (value) { return value.isSelected; }).map(function (_a) {
                var displayValue = _a.displayValue;
                return displayValue;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValues.prototype, "activeValues", {
        get: function () {
            return this.facetValues.filter(function (value) { return !value.isIdle; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValues.prototype, "displayedValues", {
        get: function () {
            return this.facetValues.filter(function (value) { return !value.isIdle || value.numberOfResults > 0; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValues.prototype, "hasSelectedValues", {
        get: function () {
            return !!underscore_1.findWhere(this.facetValues, { state: FacetValueState_1.FacetValueState.selected });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValues.prototype, "hasActiveValues", {
        get: function () {
            return !!this.activeValues.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValues.prototype, "hasIdleValues", {
        get: function () {
            return !!underscore_1.findWhere(this.facetValues, { state: FacetValueState_1.FacetValueState.idle });
        },
        enumerable: true,
        configurable: true
    });
    DynamicFacetValues.prototype.clearAll = function () {
        this.facetValues.forEach(function (value) { return value.deselect(); });
    };
    Object.defineProperty(DynamicFacetValues.prototype, "hasValues", {
        get: function () {
            return !!this.allFacetValues.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetValues.prototype, "hasDisplayedValues", {
        get: function () {
            return !!this.displayedValues.length;
        },
        enumerable: true,
        configurable: true
    });
    DynamicFacetValues.prototype.hasSelectedValue = function (arg) {
        var value = typeof arg === 'string' ? arg : arg.value;
        var foundValue = underscore_1.find(this.facetValues, function (facetValue) { return facetValue.equals(value); });
        return foundValue && foundValue.isSelected;
    };
    DynamicFacetValues.prototype.get = function (arg) {
        var value = typeof arg === 'string' ? arg : arg.value;
        var facetValue = underscore_1.find(this.facetValues, function (facetValue) { return facetValue.equals(value); });
        if (facetValue) {
            return facetValue;
        }
        var newFacetValue = this.valueCreator.createFromValue(value);
        if (!newFacetValue) {
            return null;
        }
        this.facetValues.push(newFacetValue);
        return newFacetValue;
    };
    DynamicFacetValues.prototype.buildShowLess = function () {
        var _this = this;
        var showLess = new DynamicFacetValueMoreLessButton_1.DynamicFacetValueShowMoreLessButton({
            className: 'coveo-dynamic-facet-show-less',
            ariaLabel: Strings_1.l('ShowLessFacetResults', this.facet.options.title),
            label: Strings_1.l('ShowLess'),
            action: function () {
                _this.facet.enableFreezeFacetOrderFlag();
                _this.facet.showLessValues();
            }
        });
        return showLess.element;
    };
    DynamicFacetValues.prototype.buildShowMore = function () {
        var _this = this;
        var showMore = new DynamicFacetValueMoreLessButton_1.DynamicFacetValueShowMoreLessButton({
            className: 'coveo-dynamic-facet-show-more',
            ariaLabel: Strings_1.l('ShowMoreFacetResults', this.facet.options.title),
            label: Strings_1.l('ShowMore'),
            action: function () {
                _this.facet.enableFreezeFacetOrderFlag();
                _this.facet.showMoreValues();
            }
        });
        return showMore.element;
    };
    Object.defineProperty(DynamicFacetValues.prototype, "shouldEnableShowLess", {
        get: function () {
            var hasMoreValuesThenDefault = this.facetValues.length > this.facet.options.numberOfValues;
            return hasMoreValuesThenDefault && this.hasIdleValues;
        },
        enumerable: true,
        configurable: true
    });
    DynamicFacetValues.prototype.appendShowMoreLess = function (fragment) {
        if (!this.facet.options.enableMoreLess) {
            return;
        }
        if (this.shouldEnableShowLess) {
            fragment.appendChild(this.buildShowLess());
        }
        if (this.facet.moreValuesAvailable) {
            fragment.appendChild(this.buildShowMore());
        }
    };
    DynamicFacetValues.prototype.appendSelectedCollapsedValues = function (fragment) {
        if (!this.hasSelectedValues) {
            return;
        }
        var selectedValues = this.selectedDisplayValues.join(', ');
        fragment.appendChild(Dom_1.$$('li', {
            className: 'coveo-dynamic-facet-collapsed-values',
            ariaLabel: Strings_1.l('CurrentSelections') + ": " + selectedValues
        }, underscore_1.escape(selectedValues)).el);
    };
    DynamicFacetValues.prototype.render = function () {
        var fragment = document.createDocumentFragment();
        Dom_1.$$(this.list).empty();
        this.displayedValues.forEach(function (facetValue) {
            fragment.appendChild(facetValue.renderedElement);
        });
        this.appendShowMoreLess(fragment);
        this.appendSelectedCollapsedValues(fragment);
        this.list.appendChild(fragment);
        return this.list;
    };
    return DynamicFacetValues;
}());
exports.DynamicFacetValues = DynamicFacetValues;


/***/ }),

/***/ 512:
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
var Assert_1 = __webpack_require__(5);
var QueryEvents_1 = __webpack_require__(11);
var underscore_1 = __webpack_require__(0);
var DynamicFacetRequestBuilder_1 = __webpack_require__(504);
var DynamicFacetQueryController = /** @class */ (function () {
    function DynamicFacetQueryController(facet) {
        this.facet = facet;
        this.freezeCurrentValues = false;
        this.freezeFacetOrder = false;
        this.preventAutoSelection = false;
        this.requestBuilder = new DynamicFacetRequestBuilder_1.DynamicFacetRequestBuilder({
            facetId: this.facet.options.id,
            field: this.facet.fieldName,
            type: this.facet.facetType,
            sortCriteria: this.facet.options.sortCriteria,
            injectionDepth: this.facet.options.injectionDepth,
            filterFacetCount: this.facet.options.filterFacetCount
        });
        this.resetNumberOfValuesToRequest();
        this.resetFlagsDuringQuery();
    }
    DynamicFacetQueryController.prototype.resetFlagsDuringQuery = function () {
        var _this = this;
        this.facet.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function () {
            _this.freezeCurrentValues = false;
            _this.freezeFacetOrder = false;
            _this.preventAutoSelection = false;
        });
    };
    DynamicFacetQueryController.prototype.increaseNumberOfValuesToRequest = function (additionalNumberOfValues) {
        this.numberOfValuesToRequest += additionalNumberOfValues;
    };
    DynamicFacetQueryController.prototype.resetNumberOfValuesToRequest = function () {
        this.numberOfValuesToRequest = this.facet.options.numberOfValues;
    };
    DynamicFacetQueryController.prototype.enablePreventAutoSelectionFlag = function () {
        this.preventAutoSelection = true;
    };
    DynamicFacetQueryController.prototype.enableFreezeCurrentValuesFlag = function () {
        if (this.areValuesIncorrectlyAffectedByDependsOn) {
            return;
        }
        this.freezeCurrentValues = true;
    };
    DynamicFacetQueryController.prototype.enableFreezeFacetOrderFlag = function () {
        this.freezeFacetOrder = true;
    };
    Object.defineProperty(DynamicFacetQueryController.prototype, "areValuesIncorrectlyAffectedByDependsOn", {
        get: function () {
            if (!this.facet.dependsOnManager.hasDependentFacets) {
                return false;
            }
            if (this.facet.dependsOnManager.dependentFacetsHaveSelectedValues) {
                return false;
            }
            return this.currentValues.length < this.numberOfValuesToRequest;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Build the facets request for the DynamicFacet, and insert it in the query builder
     * @param queryBuilder
     */
    DynamicFacetQueryController.prototype.putFacetIntoQueryBuilder = function (queryBuilder) {
        Assert_1.Assert.exists(queryBuilder);
        queryBuilder.facetRequests.push(this.buildFacetRequest(queryBuilder.build()));
        if (this.freezeFacetOrder) {
            queryBuilder.facetOptions.freezeFacetOrder = true;
        }
    };
    DynamicFacetQueryController.prototype.buildFacetRequest = function (query) {
        return __assign({}, this.requestBuilder.buildBaseRequestForQuery(query), { currentValues: this.currentValues, numberOfValues: this.numberOfValues, freezeCurrentValues: this.freezeCurrentValues, preventAutoSelect: this.preventAutoSelection, isFieldExpanded: this.numberOfValuesToRequest > this.facet.options.numberOfValues });
    };
    DynamicFacetQueryController.prototype.getQueryResults = function () {
        var query = this.facet.queryController.getLastQuery();
        // Specifying a numberOfResults of 0 will not log the query as a full fledged query in the API
        // it will also alleviate the load on the index
        query.numberOfResults = 0;
        var previousFacetRequestIndex = underscore_1.findIndex(query.facets, { facetId: this.facet.options.id });
        if (previousFacetRequestIndex !== -1) {
            query.facets[previousFacetRequestIndex] = this.buildFacetRequest(query);
        }
        else if (query.facets) {
            query.facets.push(this.buildFacetRequest(query));
        }
        else {
            query.facets = [this.buildFacetRequest(query)];
        }
        return this.facet.queryController.getEndpoint().search(query);
    };
    Object.defineProperty(DynamicFacetQueryController.prototype, "currentValues", {
        get: function () {
            return this.facet.values.allFacetValues.map(function (_a) {
                var value = _a.value, state = _a.state;
                return ({
                    value: value,
                    state: state
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicFacetQueryController.prototype, "numberOfValues", {
        get: function () {
            if (this.freezeCurrentValues) {
                return this.currentValues.length;
            }
            return Math.max(this.numberOfValuesToRequest, this.facet.values.activeValues.length);
        },
        enumerable: true,
        configurable: true
    });
    return DynamicFacetQueryController;
}());
exports.DynamicFacetQueryController = DynamicFacetQueryController;


/***/ }),

/***/ 513:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var DynamicFacetValueCheckbox_1 = __webpack_require__(510);
var DynamicFacetValueRenderer = /** @class */ (function () {
    function DynamicFacetValueRenderer(facetValue, facet) {
        this.facetValue = facetValue;
        this.facet = facet;
    }
    DynamicFacetValueRenderer.prototype.render = function () {
        this.dom = Dom_1.$$('li', {
            className: 'coveo-dynamic-facet-value',
            dataValue: this.facetValue.value
        });
        this.toggleSelectedClass();
        this.renderCheckbox();
        this.addFocusAndBlurEventListeners();
        return this.dom.el;
    };
    DynamicFacetValueRenderer.prototype.toggleSelectedClass = function () {
        this.dom.toggleClass('coveo-selected', this.facetValue.isSelected);
    };
    DynamicFacetValueRenderer.prototype.renderCheckbox = function () {
        this.valueCheckbox = new DynamicFacetValueCheckbox_1.DynamicFacetValueCheckbox(this.facetValue, this.selectAction.bind(this));
        this.dom.append(this.valueCheckbox.element);
    };
    DynamicFacetValueRenderer.prototype.addFocusAndBlurEventListeners = function () {
        var _this = this;
        var checkboxButton = Dom_1.$$(this.valueCheckbox.element).find('button');
        Dom_1.$$(checkboxButton).on('focusin', function () { return _this.onFocusIn(); });
        Dom_1.$$(checkboxButton).on('focusout', function () { return _this.onFocusOut(); });
    };
    DynamicFacetValueRenderer.prototype.onFocusIn = function () {
        this.dom.addClass('coveo-focused');
    };
    DynamicFacetValueRenderer.prototype.onFocusOut = function () {
        this.dom.removeClass('coveo-focused');
    };
    DynamicFacetValueRenderer.prototype.selectAction = function () {
        var _this = this;
        this.facet.toggleSelectValue(this.facetValue.value);
        this.toggleSelectedClass();
        this.facet.enableFreezeCurrentValuesFlag();
        this.facet.enableFreezeFacetOrderFlag();
        this.facet.enablePreventAutoSelectionFlag();
        this.facet.scrollToTop();
        this.facet.triggerNewQuery(function () { return _this.facetValue.logSelectActionToAnalytics(); });
    };
    return DynamicFacetValueRenderer;
}());
exports.DynamicFacetValueRenderer = DynamicFacetValueRenderer;


/***/ }),

/***/ 522:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 523:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 524:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 525:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveComponentsManager_1 = __webpack_require__(60);
var SearchInterface_1 = __webpack_require__(19);
var ResultList_1 = __webpack_require__(87);
var Dom_1 = __webpack_require__(1);
var Component_1 = __webpack_require__(7);
var Logger_1 = __webpack_require__(9);
var ResponsiveDefaultResultTemplate = /** @class */ (function () {
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
            Dom_1.$$(this.resultList.options.resultsContainer).addClass('coveo-card-layout-container');
            Dom_1.$$(this.resultList.options.resultsContainer).removeClass("coveo-list-layout-container");
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
            Dom_1.$$(this.resultList.options.resultsContainer).removeClass('coveo-card-layout-container');
            Dom_1.$$(this.resultList.options.resultsContainer).addClass("coveo-list-layout-container");
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

/***/ 526:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var ResultContainer = /** @class */ (function () {
    function ResultContainer(resultContainer, searchInterface) {
        this.searchInterface = searchInterface;
        this.resultContainerElement = Dom_1.$$(resultContainer);
    }
    ResultContainer.prototype.empty = function () {
        this.searchInterface.detachComponentsInside(this.resultContainerElement.el);
        Dom_1.$$(this.resultContainerElement).empty();
    };
    ResultContainer.prototype.addClass = function (classToAdd) {
        this.resultContainerElement.addClass(classToAdd);
    };
    ResultContainer.prototype.isEmpty = function () {
        return this.resultContainerElement.isEmpty();
    };
    ResultContainer.prototype.hideChildren = function () {
        this.resultContainerElement.children().forEach(function (child) { return Dom_1.$$(child).hide(); });
    };
    ResultContainer.prototype.getResultElements = function () {
        return this.resultContainerElement.findAll('.CoveoResult');
    };
    Object.defineProperty(ResultContainer.prototype, "el", {
        get: function () {
            return this.resultContainerElement.el;
        },
        enumerable: true,
        configurable: true
    });
    ResultContainer.resultCurrentlyBeingRendered = null;
    return ResultContainer;
}());
exports.ResultContainer = ResultContainer;


/***/ }),

/***/ 527:
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
var ResultListRenderer_1 = __webpack_require__(211);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var ResultListCardRenderer = /** @class */ (function (_super) {
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
                    var needToBeRemoved = Dom_1.$$(_this.resultListOptions.resultsContainer).findAll('.coveo-card-layout-padding');
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


/***/ }),

/***/ 528:
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
var ResultListRenderer_1 = __webpack_require__(211);
var TableTemplate_1 = __webpack_require__(462);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var ResultListTableRenderer = /** @class */ (function (_super) {
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
            if (_this.resultListOptions.resultTemplate.templates.length !== 0 &&
                !_this.resultListOptions.resultTemplate.hasTemplateWithRole('table-header')) {
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


/***/ }),

/***/ 529:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 530:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveDropdownContent_1 = __webpack_require__(88);
var Core_1 = __webpack_require__(20);
var SVGIcons_1 = __webpack_require__(12);
var FocusTrap_1 = __webpack_require__(465);
var ResponsiveDropdownModalContent = /** @class */ (function () {
    function ResponsiveDropdownModalContent(componentName, element, closeButtonLabel, close) {
        this.componentName = componentName;
        this.element = element;
        this.closeButtonLabel = closeButtonLabel;
        this.close = close;
        this.className = "coveo-" + this.componentName + "-dropdown-modal-content";
    }
    Object.defineProperty(ResponsiveDropdownModalContent.prototype, "hidden", {
        set: function (shouldHide) {
            this.element.toggleClass('coveo-hidden', shouldHide);
        },
        enumerable: true,
        configurable: true
    });
    ResponsiveDropdownModalContent.prototype.positionDropdown = function () {
        this.element.el.classList.add(this.className, ResponsiveDropdownContent_1.ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
        this.element.setAttribute('role', 'group');
        this.element.setAttribute('aria-label', Core_1.l('FiltersDropdown'));
        this.hidden = false;
        this.ensureCloseButton();
        this.ensureFocusTrap();
    };
    ResponsiveDropdownModalContent.prototype.hideDropdown = function () {
        this.element.el.classList.remove(this.className, ResponsiveDropdownContent_1.ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
        this.element.setAttribute('role', null);
        this.element.setAttribute('aria-label', null);
        this.hidden = true;
        this.removeCloseButton();
        this.removeFocusTrap();
    };
    ResponsiveDropdownModalContent.prototype.cleanUp = function () {
        this.hidden = false;
    };
    ResponsiveDropdownModalContent.prototype.ensureCloseButton = function () {
        var _this = this;
        if (!this.closeButton) {
            this.closeButton = Core_1.$$('button', {
                className: 'coveo-facet-modal-close-button',
                ariaLabel: this.closeButtonLabel
            }, SVGIcons_1.SVGIcons.icons.mainClear);
            this.closeButton.on('click', function () { return _this.close(); });
            this.element.prepend(this.closeButton.el);
        }
    };
    ResponsiveDropdownModalContent.prototype.ensureFocusTrap = function () {
        if (!this.focusTrap) {
            this.focusTrap = new FocusTrap_1.FocusTrap(this.element.el);
        }
    };
    ResponsiveDropdownModalContent.prototype.removeCloseButton = function () {
        if (this.closeButton) {
            this.closeButton.remove();
            this.closeButton = null;
        }
    };
    ResponsiveDropdownModalContent.prototype.removeFocusTrap = function () {
        if (this.focusTrap) {
            this.focusTrap.disable();
            this.focusTrap = null;
        }
    };
    return ResponsiveDropdownModalContent;
}());
exports.ResponsiveDropdownModalContent = ResponsiveDropdownModalContent;


/***/ }),

/***/ 531:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The names of the events that can be triggered by the [FacetsMobileMode]{@link FacetsMobileMode} component.
 */
var FacetsMobileModeEvents = /** @class */ (function () {
    function FacetsMobileModeEvents() {
    }
    /**
     * The name of the event that gets triggered when the facets pop-up (or modal) is opened in mobile mode.
     */
    FacetsMobileModeEvents.popupOpened = 'popupOpened';
    /**
     * The name of the event that gets triggered when the facets pop-up (or modal) is closed in mobile mode.
     */
    FacetsMobileModeEvents.popupClosed = 'popupClosed';
    return FacetsMobileModeEvents;
}());
exports.FacetsMobileModeEvents = FacetsMobileModeEvents;


/***/ }),

/***/ 562:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 563:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Strings_1 = __webpack_require__(6);
var SVGIcons_1 = __webpack_require__(12);
var Dom_1 = __webpack_require__(1);
var DynamicFacetHeaderButton_1 = __webpack_require__(497);
var DynamicFacetHeaderCollapseToggle = /** @class */ (function () {
    function DynamicFacetHeaderCollapseToggle(options) {
        this.options = options;
        this.create();
    }
    DynamicFacetHeaderCollapseToggle.prototype.create = function () {
        var _this = this;
        var parent = Dom_1.$$('div');
        this.collapseButton = new DynamicFacetHeaderButton_1.DynamicFacetHeaderButton({
            label: Strings_1.l('CollapseFacet', this.options.title),
            iconSVG: SVGIcons_1.SVGIcons.icons.arrowUp,
            iconClassName: 'coveo-dynamic-facet-collapse-toggle-svg',
            className: 'coveo-dynamic-facet-header-collapse',
            shouldDisplay: true,
            action: function () {
                _this.options.collapse();
                _this.expandButton.element.focus();
            }
        });
        this.expandButton = new DynamicFacetHeaderButton_1.DynamicFacetHeaderButton({
            label: Strings_1.l('ExpandFacet', this.options.title),
            iconSVG: SVGIcons_1.SVGIcons.icons.arrowDown,
            iconClassName: 'coveo-dynamic-facet-collapse-toggle-svg',
            className: 'coveo-dynamic-facet-header-expand',
            shouldDisplay: false,
            action: function () {
                _this.options.expand();
                _this.collapseButton.element.focus();
            }
        });
        parent.append(this.collapseButton.element);
        parent.append(this.expandButton.element);
        this.element = parent.el;
    };
    DynamicFacetHeaderCollapseToggle.prototype.toggleButtons = function (isCollapsed) {
        this.collapseButton.toggle(!isCollapsed);
        this.expandButton.toggle(isCollapsed);
    };
    return DynamicFacetHeaderCollapseToggle;
}());
exports.DynamicFacetHeaderCollapseToggle = DynamicFacetHeaderCollapseToggle;


/***/ }),

/***/ 564:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TextInput_1 = __webpack_require__(54);
var Dom_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(25);
var Utils_1 = __webpack_require__(4);
var ComboboxInput = /** @class */ (function () {
    function ComboboxInput(combobox) {
        this.combobox = combobox;
        this.inputOptions = {
            usePlaceholder: true,
            className: 'coveo-combobox-input',
            triggerOnChangeAsYouType: true,
            isRequired: false,
            icon: 'search'
        };
        this.create();
        this.element = this.textInput.getElement();
        this.inputElement = Dom_1.$$(this.element).find('input');
        this.addEventListeners();
        this.addAccessibilityAttributes();
    }
    Object.defineProperty(ComboboxInput.prototype, "value", {
        get: function () {
            return this.inputElement.value;
        },
        enumerable: true,
        configurable: true
    });
    ComboboxInput.prototype.create = function () {
        var _this = this;
        this.textInput = new TextInput_1.TextInput(function (inputInstance) { return _this.combobox.onInputChange(inputInstance.getValue()); }, this.combobox.options.placeholderText, this.inputOptions);
    };
    ComboboxInput.prototype.addEventListeners = function () {
        var _this = this;
        if (!this.combobox.options.clearOnBlur) {
            this.inputElement.addEventListener('focus', function () { return _this.combobox.onInputChange(_this.textInput.getValue()); });
        }
        this.combobox.element.addEventListener('focusout', function (e) { return _this.handleFocusOut(e); });
        this.combobox.element.addEventListener('keydown', function (e) { return _this.handleKeyboardDirection(e); });
        this.combobox.element.addEventListener('keyup', function (e) { return _this.handleKeyboardEnterEscape(e); });
    };
    ComboboxInput.prototype.addAccessibilityAttributes = function () {
        var listboxId = this.combobox.id + "-listbox";
        this.inputElement.setAttribute('role', 'combobox');
        this.inputElement.setAttribute('aria-owns', listboxId);
        this.inputElement.setAttribute('aria-haspopup', 'listbox');
        this.inputElement.setAttribute('aria-autocomplete', 'list');
        this.inputElement.setAttribute('id', this.combobox.id + "-input");
        this.inputElement.setAttribute('aria-label', this.combobox.options.label);
        this.updateAccessibilityAttributes({
            activeDescendant: '',
            expanded: false
        });
    };
    ComboboxInput.prototype.updateAccessibilityAttributes = function (attributes) {
        this.inputElement.setAttribute('aria-expanded', attributes.expanded ? 'true' : 'false');
        Utils_1.Utils.isEmptyString(attributes.activeDescendant)
            ? this.inputElement.removeAttribute('aria-activedescendant')
            : this.inputElement.setAttribute('aria-activedescendant', attributes.activeDescendant);
    };
    ComboboxInput.prototype.clearInput = function () {
        this.textInput.reset();
    };
    ComboboxInput.prototype.handleFocusOut = function (event) {
        var newTarget = event.relatedTarget;
        var focusInsideCombobox = this.combobox.element.contains(newTarget);
        if (focusInsideCombobox) {
            return;
        }
        var comboboxValuesHovered = Dom_1.$$(this.combobox.element).find('.coveo-combobox-values:hover');
        if (comboboxValuesHovered) {
            this.inputElement.focus();
            return;
        }
        this.combobox.onInputBlur();
    };
    ComboboxInput.prototype.handleKeyboardDirection = function (event) {
        switch (event.which) {
            case KeyboardUtils_1.KEYBOARD.DOWN_ARROW:
                event.preventDefault();
                this.combobox.values.focusNextValue();
                break;
            case KeyboardUtils_1.KEYBOARD.UP_ARROW:
                event.preventDefault();
                this.combobox.values.focusPreviousValue();
                break;
            case KeyboardUtils_1.KEYBOARD.HOME:
                event.preventDefault();
                this.combobox.values.focusFirstValue();
                break;
            case KeyboardUtils_1.KEYBOARD.END:
                event.preventDefault();
                this.combobox.values.focusLastValue();
                break;
        }
    };
    ComboboxInput.prototype.handleKeyboardEnterEscape = function (event) {
        switch (event.which) {
            case KeyboardUtils_1.KEYBOARD.ENTER:
                this.combobox.values.selectActiveValue();
                break;
            case KeyboardUtils_1.KEYBOARD.ESCAPE:
                if (Utils_1.Utils.isNonEmptyString(this.textInput.getValue())) {
                    event.stopPropagation();
                }
                this.combobox.clearAll();
                break;
        }
    };
    return ComboboxInput;
}());
exports.ComboboxInput = ComboboxInput;


/***/ }),

/***/ 565:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var Strings_1 = __webpack_require__(6);
var underscore_2 = __webpack_require__(0);
var ComboboxValues = /** @class */ (function () {
    function ComboboxValues(combobox) {
        var _this = this;
        this.combobox = combobox;
        this.mouseIsOverValue = false;
        this.isRenderingNewValues = false;
        this.values = [];
        this.element = Dom_1.$$('ul', {
            id: this.combobox.id + "-listbox",
            role: 'listbox',
            className: 'coveo-combobox-values',
            ariaLabelledby: this.combobox.id + "-input"
        }).el;
        Dom_1.$$(this.element).hide();
        this.isScrollable = !!this.combobox.options.scrollable;
        this.isScrollable && this.element.addEventListener('scroll', function () { return _this.onScroll(); });
    }
    ComboboxValues.prototype.renderFromResponse = function (response) {
        this.isRenderingNewValues = true;
        this.clearValues();
        this.values = this.combobox.options.createValuesFromResponse(response);
        this.render();
        this.combobox.updateAriaLive();
        this.isRenderingNewValues = false;
    };
    ComboboxValues.prototype.render = function () {
        Dom_1.$$(this.element).show();
        if (!this.hasValues()) {
            return this.renderNoValuesFound();
        }
        this.renderValues();
        this.addEventListeners();
        this.updateAccessibilityAttributes();
    };
    ComboboxValues.prototype.renderValues = function () {
        var _this = this;
        var fragment = document.createDocumentFragment();
        this.values.forEach(function (value, index) {
            var elementWrapper = Dom_1.$$('li', { id: _this.combobox.id + "-value-" + index, className: 'coveo-combobox-value', role: 'option', tabindex: 0 }, value.element).el;
            _this.highlightCurrentQueryInSearchResults(value.element);
            value.element = elementWrapper;
            fragment.appendChild(value.element);
        });
        this.element.appendChild(fragment);
    };
    ComboboxValues.prototype.highlightCurrentQueryInSearchResults = function (searchResult) {
        if (this.combobox.options.highlightValueClassName) {
            var regex = new RegExp('(' + this.combobox.element.querySelector('input').value + ')', 'ig');
            var result = Dom_1.$$(searchResult).hasClass(this.combobox.options.highlightValueClassName)
                ? searchResult
                : Dom_1.$$(searchResult).find("." + this.combobox.options.highlightValueClassName);
            if (result) {
                var text = underscore_2.escape(Dom_1.$$(result).text());
                result.innerHTML = text.replace(regex, '<span class="coveo-highlight">$1</span>');
            }
        }
    };
    ComboboxValues.prototype.hasValues = function () {
        return !!this.numberOfValues;
    };
    Object.defineProperty(ComboboxValues.prototype, "numberOfValues", {
        get: function () {
            return this.values.length;
        },
        enumerable: true,
        configurable: true
    });
    ComboboxValues.prototype.renderNoValuesFound = function () {
        var noValuesFoundElement = Dom_1.$$('li', {
            role: 'option',
            className: 'coveo-combobox-value-not-found'
        }, Strings_1.l('NoValuesFound')).el;
        this.element.appendChild(noValuesFoundElement);
    };
    ComboboxValues.prototype.addEventListeners = function () {
        var _this = this;
        this.values.forEach(function (value) {
            Dom_1.$$(value.element).on('mouseenter', function () { return (_this.mouseIsOverValue = true); });
            Dom_1.$$(value.element).on('mouseleave', function () { return (_this.mouseIsOverValue = false); });
            Dom_1.$$(value.element).on('click', function (e) { return _this.onValueClick(e); });
            Dom_1.$$(value.element).on('focus', function () { return _this.setKeyboardActiveValue(value); });
        });
    };
    ComboboxValues.prototype.onValueClick = function (e) {
        var target = e.target;
        var targetElement = Dom_1.$$(target).hasClass('coveo-combobox-value') ? target : Dom_1.$$(target).parent('coveo-combobox-value');
        if (!targetElement) {
            return;
        }
        var targetId = targetElement.getAttribute('id');
        var value = underscore_1.find(this.values, function (_a) {
            var element = _a.element;
            return element.getAttribute('id') === targetId;
        });
        value && this.combobox.options.onSelectValue(value);
        this.combobox.clearAll();
    };
    ComboboxValues.prototype.updateAccessibilityAttributes = function () {
        var activeDescendant = this.keyboardActiveValue ? this.keyboardActiveValue.element.getAttribute('id') : '';
        this.combobox.updateAccessibilityAttributes({
            activeDescendant: activeDescendant,
            expanded: this.hasValues()
        });
    };
    ComboboxValues.prototype.clearValues = function () {
        this.mouseIsOverValue = false;
        this.resetKeyboardActiveValue();
        Dom_1.$$(this.element).empty();
        Dom_1.$$(this.element).hide();
        this.values = [];
        this.updateAccessibilityAttributes();
    };
    ComboboxValues.prototype.setKeyboardActiveValue = function (value) {
        this.resetKeyboardActiveValue();
        this.keyboardActiveValue = value;
        this.activateFocusOnValue(this.keyboardActiveValue);
        this.updateAccessibilityAttributes();
    };
    ComboboxValues.prototype.resetKeyboardActiveValue = function () {
        if (!this.keyboardActiveValue) {
            return;
        }
        this.deactivateFocusOnValue(this.keyboardActiveValue);
        this.keyboardActiveValue = null;
    };
    ComboboxValues.prototype.activateFocusOnValue = function (_a) {
        var element = _a.element;
        Dom_1.$$(element).addClass('coveo-focused');
        element.setAttribute('aria-selected', 'true');
    };
    ComboboxValues.prototype.deactivateFocusOnValue = function (_a) {
        var element = _a.element;
        Dom_1.$$(element).removeClass('coveo-focused');
        element.setAttribute('aria-selected', 'false');
    };
    ComboboxValues.prototype.selectActiveValue = function () {
        if (!this.keyboardActiveValue) {
            return;
        }
        this.combobox.options.onSelectValue(this.keyboardActiveValue);
        this.combobox.clearAll();
    };
    ComboboxValues.prototype.onScroll = function () {
        var scrollEndReached = this.element.scrollTop + this.element.clientHeight >= this.element.scrollHeight;
        if (scrollEndReached && this.combobox.options.scrollable.areMoreValuesAvailable()) {
            this.combobox.onScrollEndReached();
        }
    };
    ComboboxValues.prototype.resetScroll = function () {
        if (!this.isScrollable) {
            return;
        }
        this.element.style.maxHeight = this.combobox.options.scrollable.maxDropdownHeight + "px";
        this.element.scrollTop = 0;
    };
    ComboboxValues.prototype.focusFirstValue = function () {
        if (!this.hasValues()) {
            return;
        }
        this.firstValue.element.focus();
    };
    ComboboxValues.prototype.focusLastValue = function () {
        if (!this.hasValues()) {
            return;
        }
        this.lastValue.element.focus();
    };
    ComboboxValues.prototype.focusNextValue = function () {
        if (!this.hasValues()) {
            return;
        }
        var nextActiveValue = this.nextOrFirstValue;
        nextActiveValue.element.focus();
    };
    ComboboxValues.prototype.focusPreviousValue = function () {
        if (!this.hasValues()) {
            return;
        }
        var previousActiveValue = this.previousOrLastValue;
        previousActiveValue.element.focus();
    };
    Object.defineProperty(ComboboxValues.prototype, "nextOrFirstValue", {
        get: function () {
            if (!this.keyboardActiveValue) {
                return this.firstValue;
            }
            var nextValueIndex = (this.values.indexOf(this.keyboardActiveValue) + 1) % this.numberOfValues;
            return this.values[nextValueIndex];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComboboxValues.prototype, "firstValue", {
        get: function () {
            return this.values[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComboboxValues.prototype, "previousOrLastValue", {
        get: function () {
            if (!this.keyboardActiveValue) {
                return this.lastValue;
            }
            var previousValueIndex = this.values.indexOf(this.keyboardActiveValue) - 1;
            return previousValueIndex >= 0 ? this.values[previousValueIndex] : this.values[this.numberOfValues - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComboboxValues.prototype, "lastValue", {
        get: function () {
            var lastValueIndex = this.numberOfValues - 1;
            return this.values[lastValueIndex];
        },
        enumerable: true,
        configurable: true
    });
    ComboboxValues.prototype.saveFocusedValue = function () {
        if (!this.keyboardActiveValue) {
            this.focusedValueId = null;
            return;
        }
        this.focusedValueId = this.keyboardActiveValue.element.id;
    };
    ComboboxValues.prototype.restoreFocusedValue = function () {
        if (!this.focusedValueId) {
            return;
        }
        var element = Dom_1.$$(this.element).find("#" + this.focusedValueId);
        element.focus();
        this.focusedValueId = null;
    };
    return ComboboxValues;
}());
exports.ComboboxValues = ComboboxValues;


/***/ }),

/***/ 566:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 575:
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
var ResponsiveFacetColumn_1 = __webpack_require__(212);
var DynamicFacet_1 = __webpack_require__(137);
var ResponsiveDynamicFacets = /** @class */ (function (_super) {
    __extends(ResponsiveDynamicFacets, _super);
    function ResponsiveDynamicFacets() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResponsiveDynamicFacets.init = function (root, component, options) {
        ResponsiveFacetColumn_1.ResponsiveFacetColumn.init(ResponsiveDynamicFacets, root, component, options, DynamicFacet_1.DynamicFacet.ID);
    };
    return ResponsiveDynamicFacets;
}(ResponsiveFacetColumn_1.ResponsiveFacetColumn));
exports.ResponsiveDynamicFacets = ResponsiveDynamicFacets;


/***/ }),

/***/ 576:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(505);
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var SVGIcons_1 = __webpack_require__(12);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var underscore_1 = __webpack_require__(0);
var DynamicFacetBreadcrumbs = /** @class */ (function () {
    function DynamicFacetBreadcrumbs(facet) {
        this.facet = facet;
        this.create();
    }
    DynamicFacetBreadcrumbs.prototype.create = function () {
        this.element = Dom_1.$$('ul', { className: 'coveo-dynamic-facet-breadcrumb coveo-breadcrumb-item' }).el;
        this.createAndAppendTitle();
        var activeFacetValues = this.facet.values.activeValues;
        var breadcrumbFacetValues = activeFacetValues.slice(0, this.facet.options.numberOfValuesInBreadcrumb);
        var collapsedFacetValues = activeFacetValues.slice(this.facet.options.numberOfValuesInBreadcrumb);
        this.createAndAppendBreadcrumbValues(breadcrumbFacetValues);
        if (collapsedFacetValues.length) {
            this.createAndAppendCollapsedBreadcrumbs(collapsedFacetValues);
        }
    };
    DynamicFacetBreadcrumbs.prototype.createAndAppendTitle = function () {
        var titleElement = Dom_1.$$('h3', { className: 'coveo-dynamic-facet-breadcrumb-title' }, this.facet.options.title + ":").el;
        this.element.appendChild(titleElement);
    };
    DynamicFacetBreadcrumbs.prototype.createAndAppendBreadcrumbValues = function (facetValues) {
        var _this = this;
        facetValues.forEach(function (facetValue) { return _this.createAndAppendBreadcrumbValue(facetValue); });
    };
    DynamicFacetBreadcrumbs.prototype.createAndAppendBreadcrumbValue = function (facetValue) {
        var _this = this;
        var listContainer = Dom_1.$$('li', { className: 'coveo-dynamic-facet-breadcrumb-value-list-item' }).el;
        var valueElement = Dom_1.$$('button', {
            className: 'coveo-dynamic-facet-breadcrumb-value',
            ariaLabel: Strings_1.l('RemoveFilterOn', facetValue.displayValue)
        }, underscore_1.escape(facetValue.displayValue)).el;
        var clearElement = Dom_1.$$('span', { className: 'coveo-dynamic-facet-breadcrumb-value-clear' }, SVGIcons_1.SVGIcons.icons.mainClear).el;
        valueElement.appendChild(clearElement);
        Dom_1.$$(valueElement).on('click', function () { return _this.valueSelectAction(facetValue); });
        listContainer.appendChild(valueElement);
        this.element.appendChild(listContainer);
    };
    DynamicFacetBreadcrumbs.prototype.valueSelectAction = function (facetValue) {
        var _this = this;
        this.facet.deselectValue(facetValue.value);
        this.facet.enablePreventAutoSelectionFlag();
        this.facet.triggerNewQuery(function () { return _this.logActionToAnalytics(); });
    };
    DynamicFacetBreadcrumbs.prototype.logActionToAnalytics = function () {
        this.facet.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbFacet, this.facet.basicAnalyticsFacetMeta);
    };
    DynamicFacetBreadcrumbs.prototype.createAndAppendCollapsedBreadcrumbs = function (facetValues) {
        var _this = this;
        var label = Strings_1.l('NMore', "" + facetValues.length);
        var title = facetValues.map(function (_a) {
            var value = _a.value;
            return value;
        }).join('\n');
        var collapsedElement = Dom_1.$$('button', {
            className: 'coveo-dynamic-facet-breadcrumb-collapse',
            title: title
        }, label).el;
        Dom_1.$$(collapsedElement).on('click', function () {
            Dom_1.$$(collapsedElement).remove();
            _this.createAndAppendBreadcrumbValues(facetValues);
        });
        this.element.appendChild(collapsedElement);
    };
    return DynamicFacetBreadcrumbs;
}());
exports.DynamicFacetBreadcrumbs = DynamicFacetBreadcrumbs;


/***/ }),

/***/ 577:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 578:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Combobox_1 = __webpack_require__(508);
var Strings_1 = __webpack_require__(6);
var FacetSearchController_1 = __webpack_require__(579);
var DynamicFacetValue_1 = __webpack_require__(223);
var FacetValueState_1 = __webpack_require__(69);
var DynamicFacetSearchValueRenderer_1 = __webpack_require__(580);
__webpack_require__(509);
var FacetUtils_1 = __webpack_require__(39);
var DynamicFacetSearch = /** @class */ (function () {
    function DynamicFacetSearch(facet) {
        var _this = this;
        this.facet = facet;
        this.facetSearchController = new FacetSearchController_1.FacetSearchController(this.facet);
        this.combobox = new Combobox_1.Combobox({
            label: Strings_1.l('SearchFacetResults', this.facet.options.title),
            ariaLive: this.facet.searchInterface.ariaLive,
            requestValues: function (terms) { return _this.facetSearchController.search(terms); },
            createValuesFromResponse: function (response) { return _this.createValuesFromResponse(response); },
            onSelectValue: this.onSelectValue,
            placeholderText: Strings_1.l('Search'),
            wrapperClassName: 'coveo-dynamic-facet-search',
            clearOnBlur: true,
            scrollable: {
                requestMoreValues: function () { return _this.facetSearchController.fetchMoreResults(); },
                areMoreValuesAvailable: function () { return _this.facetSearchController.moreValuesAvailable; },
                maxDropdownHeight: 250
            },
            highlightValueClassName: 'coveo-checkbox-span-label'
        });
        this.element = this.combobox.element;
    }
    DynamicFacetSearch.prototype.getDisplayValue = function (value) {
        return FacetUtils_1.FacetUtils.getDisplayValueFromValueCaption(value, this.facet.options.field, this.facet.options.valueCaption);
    };
    DynamicFacetSearch.prototype.createValuesFromResponse = function (response) {
        var _this = this;
        return response.values.map(function (value, index) {
            var facetValue = new DynamicFacetValue_1.DynamicFacetValue({
                value: value.rawValue,
                // TODO: remove when https://coveord.atlassian.net/browse/SEARCHAPI-4958 is fixed
                displayValue: _this.getDisplayValue(value.displayValue),
                numberOfResults: value.count,
                state: FacetValueState_1.FacetValueState.idle,
                position: index + 1
            }, _this.facet, DynamicFacetSearchValueRenderer_1.DynamicFacetSearchValueRenderer);
            return {
                value: facetValue,
                element: facetValue.renderedElement
            };
        });
    };
    DynamicFacetSearch.prototype.onSelectValue = function (_a) {
        var value = _a.value;
        value.renderer.selectAction();
    };
    return DynamicFacetSearch;
}());
exports.DynamicFacetSearch = DynamicFacetSearch;


/***/ }),

/***/ 579:
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
var FileTypes_1 = __webpack_require__(113);
var QueryUtils_1 = __webpack_require__(21);
var DateUtils_1 = __webpack_require__(32);
var FacetSearchController = /** @class */ (function () {
    function FacetSearchController(facet) {
        this.facet = facet;
        this.terms = '';
        this.pageCount = 1;
        this.numberOfValuesMultiplier = 3;
        this.moreValuesAvailable = true;
    }
    FacetSearchController.prototype.getMonthsValueCaptions = function () {
        var monthsValueCaptions = {};
        for (var month = 1; month <= 12; month++) {
            var key = ("0" + month).substr(-2);
            monthsValueCaptions[key] = DateUtils_1.DateUtils.monthToString(month - 1);
        }
        return monthsValueCaptions;
    };
    FacetSearchController.prototype.addTypesCaptionsIfNecessary = function () {
        var field = this.facet.options.field.toLowerCase();
        var isFileType = QueryUtils_1.QueryUtils.isStratusAgnosticField(field, '@filetype');
        var isObjectType = QueryUtils_1.QueryUtils.isStratusAgnosticField(field, '@objecttype');
        var isMonth = QueryUtils_1.QueryUtils.isStratusAgnosticField(field, '@month');
        if (isFileType || isObjectType) {
            return FileTypes_1.FileTypes.getFileTypeCaptions();
        }
        if (isMonth) {
            return this.getMonthsValueCaptions();
        }
        return {};
    };
    Object.defineProperty(FacetSearchController.prototype, "captions", {
        get: function () {
            return __assign({}, this.addTypesCaptionsIfNecessary(), this.facet.options.valueCaption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearchController.prototype, "numberOfValues", {
        get: function () {
            return this.facet.options.numberOfValues * this.numberOfValuesMultiplier * this.pageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearchController.prototype, "request", {
        get: function () {
            var optionalLeadingWildcard = this.facet.options.useLeadingWildcardInFacetSearch ? '*' : '';
            return {
                field: this.facet.fieldName,
                numberOfValues: this.numberOfValues,
                ignoreValues: this.facet.values.activeValues.map(function (value) { return value.value; }),
                captions: this.captions,
                searchContext: this.facet.queryController.getLastQuery(),
                query: "" + optionalLeadingWildcard + this.terms + "*"
            };
        },
        enumerable: true,
        configurable: true
    });
    FacetSearchController.prototype.triggerRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.facet.queryController.getEndpoint().facetSearch(this.request)];
                    case 1:
                        response = _a.sent();
                        this.moreValuesAvailable = response.moreValuesAvailable;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    FacetSearchController.prototype.search = function (terms) {
        this.terms = terms;
        this.pageCount = 1;
        return this.triggerRequest();
    };
    FacetSearchController.prototype.fetchMoreResults = function () {
        this.pageCount++;
        return this.triggerRequest();
    };
    return FacetSearchController;
}());
exports.FacetSearchController = FacetSearchController;


/***/ }),

/***/ 580:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var DynamicFacetValueCheckbox_1 = __webpack_require__(510);
var DynamicFacetSearchValueRenderer = /** @class */ (function () {
    function DynamicFacetSearchValueRenderer(facetValue, facet) {
        this.facetValue = facetValue;
        this.facet = facet;
    }
    DynamicFacetSearchValueRenderer.prototype.render = function () {
        this.dom = Dom_1.$$('div', {
            className: 'coveo-dynamic-facet-value',
            dataValue: this.facetValue.value
        });
        this.renderCheckbox();
        return this.dom.el;
    };
    DynamicFacetSearchValueRenderer.prototype.renderCheckbox = function () {
        this.valueCheckbox = new DynamicFacetValueCheckbox_1.DynamicFacetValueCheckbox(this.facetValue);
        Dom_1.$$(this.valueCheckbox.element).find('button').setAttribute('tabindex', '-1');
        this.dom.append(this.valueCheckbox.element);
    };
    DynamicFacetSearchValueRenderer.prototype.selectAction = function () {
        var _this = this;
        this.facet.enableFreezeFacetOrderFlag();
        this.facet.toggleSelectValue(this.facetValue.value);
        this.facetValue.select();
        this.facet.scrollToTop();
        this.facet.triggerNewQuery(function () { return _this.facetValue.logSelectActionToAnalytics(); });
    };
    return DynamicFacetSearchValueRenderer;
}());
exports.DynamicFacetSearchValueRenderer = DynamicFacetSearchValueRenderer;


/***/ }),

/***/ 581:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FacetUtils_1 = __webpack_require__(39);
var DynamicFacetValue_1 = __webpack_require__(223);
var FacetValueState_1 = __webpack_require__(69);
var DynamicFacetValueRenderer_1 = __webpack_require__(513);
var DynamicFacetValueCreator = /** @class */ (function () {
    function DynamicFacetValueCreator(facet) {
        this.facet = facet;
    }
    DynamicFacetValueCreator.prototype.getDisplayValue = function (value) {
        return FacetUtils_1.FacetUtils.getDisplayValueFromValueCaption(value, this.facet.options.field, this.facet.options.valueCaption);
    };
    DynamicFacetValueCreator.prototype.getDefaultValues = function () {
        return [];
    };
    DynamicFacetValueCreator.prototype.createFromResponse = function (facetValue, index) {
        return new DynamicFacetValue_1.DynamicFacetValue({
            value: facetValue.value,
            displayValue: this.getDisplayValue(facetValue.value),
            numberOfResults: facetValue.numberOfResults,
            state: facetValue.state,
            position: index + 1
        }, this.facet, DynamicFacetValueRenderer_1.DynamicFacetValueRenderer);
    };
    DynamicFacetValueCreator.prototype.createFromValue = function (value) {
        var position = this.facet.values.allFacetValues.length + 1;
        var state = FacetValueState_1.FacetValueState.idle;
        var displayValue = this.getDisplayValue(value);
        return new DynamicFacetValue_1.DynamicFacetValue({ value: value, displayValue: displayValue, state: state, numberOfResults: 0, position: position }, this.facet, DynamicFacetValueRenderer_1.DynamicFacetValueRenderer);
    };
    return DynamicFacetValueCreator;
}());
exports.DynamicFacetValueCreator = DynamicFacetValueCreator;


/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The allowed states of a facet value in a Search API facet
 * [request]{@link IFacetRequestValue.state} or
 * [response]{@link IFacetResponseValue.state}.
 */
var FacetValueState;
(function (FacetValueState) {
    /**
     * The facet value is not currently selected or excluded in the search
     * interface.
     */
    FacetValueState["idle"] = "idle";
    /**
     * The facet value is currently selected in the search interface.
     */
    FacetValueState["selected"] = "selected";
})(FacetValueState = exports.FacetValueState || (exports.FacetValueState = {}));


/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ComponentOptions_1 = __webpack_require__(8);
/**
 * ResponsiveFacets options
 */
exports.ResponsiveFacetOptions = {
    /**
     * Specifies whether to enable *responsive mode* for facets. Setting this options to `false` on any `Facet`, or
     * [`FacetSlider`]{@link FacetSlider} component in a search interface disables responsive mode for all other facets
     * in the search interface.
     *
     * Responsive mode displays all facets under a single dropdown button whenever the width of the HTML element which
     * the search interface is bound to reaches or falls behind a certain threshold (see
     * {@link SearchInterface.responsiveComponents}).
     *
     * See also the [`dropdownHeaderLabel`]{@link Facet.options.dropdownHeaderLabel} option.
     *
     * Default value is `true`.
     */
    enableResponsiveMode: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'ResponsiveOptions' }),
    responsiveBreakpoint: ComponentOptions_1.ComponentOptions.buildNumberOption({
        deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option. Instead, use `SearchInterface.options.responsiveMediumBreakpoint` options exposed on the `SearchInterface`.'
    }),
    /**
     * If the [`enableResponsiveMode`]{@link Facet.options.enableResponsiveMode} option is `true` for all facets and
     * {@link FacetSlider.options.enableResponsiveMode} is also `true` for all sliders, specifies the label of the
     * dropdown button that allows to display the facets when in responsive mode.
     *
     * If more than one `Facet` or {@link FacetSlider} component in the search interface specifies a value for this
     * option, the framework uses the first occurrence of the option.
     *
     * Default value is `Filters`.
     */
    dropdownHeaderLabel: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ section: 'ResponsiveOptions' })
};


/***/ }),

/***/ 87:
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
__webpack_require__(522);
__webpack_require__(523);
__webpack_require__(524);
var underscore_1 = __webpack_require__(0);
var QueryEvents_1 = __webpack_require__(11);
var ResultLayoutEvents_1 = __webpack_require__(129);
var ResultListEvents_1 = __webpack_require__(29);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var Defer_1 = __webpack_require__(31);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var DeviceUtils_1 = __webpack_require__(24);
var Dom_1 = __webpack_require__(1);
var DomUtils_1 = __webpack_require__(91);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var InitializationPlaceholder_1 = __webpack_require__(177);
var TemplateComponentOptions_1 = __webpack_require__(61);
var ResponsiveDefaultResultTemplate_1 = __webpack_require__(525);
var CoreHelpers_1 = __webpack_require__(466);
var DefaultRecommendationTemplate_1 = __webpack_require__(463);
var DefaultResultTemplate_1 = __webpack_require__(116);
var TableTemplate_1 = __webpack_require__(462);
var TemplateCache_1 = __webpack_require__(66);
var TemplateList_1 = __webpack_require__(90);
var ResultContainer_1 = __webpack_require__(526);
var ResultListCardRenderer_1 = __webpack_require__(527);
var ResultListRenderer_1 = __webpack_require__(211);
var ResultListTableRenderer_1 = __webpack_require__(528);
var ResultListUtils_1 = __webpack_require__(111);
var TemplateToHtml_1 = __webpack_require__(464);
CoreHelpers_1.CoreHelpers.exportAllHelpersGlobally(window['Coveo']);
/**
 * The `ResultList` component is responsible for displaying query results by applying one or several result templates
 * (see [Result Templates](https://docs.coveo.com/en/413/)).
 *
 * It is possible to include multiple `ResultList` components along with a single `ResultLayout`
 * component in a search page to provide different result layouts (see
 * [Result Layouts](https://docs.coveo.com/en/360/)).
 *
 * This component supports infinite scrolling (see the
 * [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll} option).
 */
var ResultList = /** @class */ (function (_super) {
    __extends(ResultList, _super);
    /**
     * Creates a new `ResultList` component. Binds various event related to queries (e.g., on querySuccess ->
     * renderResults). Binds scroll event if the [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll}
     * option is `true`.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultList` component.
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
        _this.disableLayoutChange = false;
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
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) {
            return _this.handleBuildingQuery(args);
        });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) {
            return _this.handleQuerySuccess(args);
        });
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
        _this.resultContainer = _this.initResultContainer();
        Assert_1.Assert.exists(_this.options.resultsContainer);
        _this.initWaitAnimationContainer();
        Assert_1.Assert.exists(_this.options.waitAnimationContainer);
        _this.setupTemplatesVersusLayouts();
        Dom_1.$$(_this.root).on(ResultLayoutEvents_1.ResultLayoutEvents.populateResultLayout, function (e, args) {
            return args.layouts.push(_this.options.layout);
        });
        _this.setupRenderer();
        _this.makeElementFocusable();
        _this.ensureHasId();
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
            return new TemplateList_1.TemplateList(underscore_1.compact(underscore_1.map(pageTemplateNames, function (templateName) { return TemplateCache_1.TemplateCache.getTemplate(templateName); })));
        }
        return null;
    };
    /**
     * Get the fields needed to be automatically included in the query for this result list.
     * @returns {string[]}
     */
    ResultList.prototype.getAutoSelectedFieldsToInclude = function () {
        return underscore_1.chain(this.options.resultTemplate.getFields()).concat(this.getMinimalFieldsToInclude()).compact().unique().value();
    };
    ResultList.prototype.setupTemplatesVersusLayouts = function () {
        var _this = this;
        var layoutClassToAdd = "coveo-" + this.options.layout + "-layout-container";
        this.resultContainer.addClass(layoutClassToAdd);
        if (this.options.layout === 'table') {
            this.options.resultTemplate = new TableTemplate_1.TableTemplate(this.options.resultTemplate.templates || []);
        }
        // A TemplateList is the scenario where the result template are directly embedded inside the ResultList
        // This is the typical scenario when a page gets created by the interface editor, for example.
        // In that case, we try to stick closely that what is actually configured inside the page, and do no "special magic".
        // Stick to the "hardcoded" configuration present in the page.
        // We only add the correct layout options if it has not been set manually.
        if (this.options.resultTemplate instanceof TemplateList_1.TemplateList) {
            underscore_1.each(this.options.resultTemplate.templates, function (tmpl) {
                if (!tmpl.layout) {
                    tmpl.layout = _this.options.layout;
                }
            });
        }
        else if (this.options.resultTemplate instanceof DefaultResultTemplate_1.DefaultResultTemplate && this.options.layout == 'list') {
            ResponsiveDefaultResultTemplate_1.ResponsiveDefaultResultTemplate.init(this.root, this, {});
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
            this.resultContainer.empty();
        }
        return this.renderer
            .renderResults(resultElements, append, this.triggerNewResultDisplayed.bind(this))
            .then(function () { return _this.triggerNewResultsDisplayed(); });
    };
    /**
     * Builds and returns an array of HTMLElement with the given result set.
     * @param results the result set to build an array of HTMLElement from.
     */
    ResultList.prototype.buildResults = function (results) {
        var layout = this.options.layout;
        return this.templateToHtml.buildResults(results, layout, this.currentlyDisplayedResults);
    };
    /**
     * Builds and returns an HTMLElement for the given result.
     * @param result the result to build an HTMLElement from.
     * @returns {HTMLElement}
     */
    ResultList.prototype.buildResult = function (result) {
        var layout = this.options.layout;
        return this.templateToHtml.buildResult(result, layout, this.currentlyDisplayedResults);
    };
    /**
     * Executes a query to fetch new results. After the query returns, renders the new results.
     *
     * Asserts that there are more results to display by verifying whether the last query has returned as many results as
     * requested.
     *
     * Asserts that the `ResultList` is not currently fetching results.
     * @param count The number of results to fetch and display.
     */
    ResultList.prototype.displayMoreResults = function (count) {
        Assert_1.Assert.isLargerOrEqualsThan(1, count);
        if (this.isCurrentlyFetchingMoreResults()) {
            this.logger.warn("Ignoring request to display more results since we're already doing so");
            return;
        }
        if (!this.hasPotentiallyMoreResultsToDisplay()) {
            this.logger.warn("Ignoring request to display more results since we know there aren't more to display");
            return;
        }
        if (this.options.enableInfiniteScrollWaitingAnimation) {
            this.showWaitingAnimationForInfiniteScrolling();
        }
        return this.fetchAndRenderMoreResults(count);
    };
    Object.defineProperty(ResultList.prototype, "templateToHtml", {
        get: function () {
            var templateToHtmlArgs = {
                resultTemplate: this.options.resultTemplate,
                searchInterface: this.searchInterface,
                queryStateModel: this.queryStateModel
            };
            return new TemplateToHtml_1.TemplateToHtml(templateToHtmlArgs);
        },
        enumerable: true,
        configurable: true
    });
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
        return this.resultContainer.getResultElements();
    };
    ResultList.prototype.enable = function () {
        var _this = this;
        _super.prototype.enable.call(this);
        this.disableLayoutChange = false;
        underscore_1.each(this.resultLayoutSelectors, function (resultLayoutSelector) {
            resultLayoutSelector.enableLayouts([_this.options.layout]);
        });
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    ResultList.prototype.disable = function () {
        var _this = this;
        _super.prototype.disable.call(this);
        var otherLayoutsStillActive = underscore_1.map(this.otherResultLists, function (otherResultList) { return otherResultList.options.layout; });
        if (!underscore_1.contains(otherLayoutsStillActive, this.options.layout) && !this.disableLayoutChange) {
            underscore_1.each(this.resultLayoutSelectors, function (resultLayoutSelector) {
                resultLayoutSelector.disableLayouts([_this.options.layout]);
            });
        }
        this.disableLayoutChange = false;
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    ResultList.prototype.autoCreateComponentsInsideResult = function (element, result) {
        return this.templateToHtml.autoCreateComponentsInsideResult(element, result);
    };
    ResultList.prototype.triggerNewResultDisplayed = function (result, resultElement) {
        var args = {
            result: result,
            item: resultElement
        };
        Dom_1.$$(this.element).trigger(ResultListEvents_1.ResultListEvents.newResultDisplayed, args);
    };
    ResultList.prototype.triggerNewResultsDisplayed = function () {
        var args = {
            isInfiniteScrollEnabled: this.options.enableInfiniteScroll
        };
        Dom_1.$$(this.element).trigger(ResultListEvents_1.ResultListEvents.newResultsDisplayed, args);
    };
    ResultList.prototype.fetchAndRenderMoreResults = function (count) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.fetchingMoreResults = this.queryController.fetchMore(count);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fetchingMoreResults];
                    case 2:
                        data = _a.sent();
                        Assert_1.Assert.exists(data);
                        this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.pagerScrolling, {}, this.element);
                        this.reachedTheEndOfResults = count > data.results.length;
                        this.renderNewResults(data);
                        this.resetStateAfterFetchingMoreResults();
                        return [2 /*return*/, data];
                    case 3:
                        e_1 = _a.sent();
                        this.resetStateAfterFetchingMoreResults();
                        return [2 /*return*/, Promise.reject(e_1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ResultList.prototype.renderNewResults = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var elements, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.buildResults(data)];
                    case 1:
                        elements = _b.sent();
                        this.renderResults(elements, true);
                        (_a = this.currentlyDisplayedResults).push.apply(_a, data.results);
                        this.triggerNewResultsDisplayed();
                        return [2 /*return*/];
                }
            });
        });
    };
    ResultList.prototype.resetStateAfterFetchingMoreResults = function () {
        var _this = this;
        this.hideWaitingAnimationForInfiniteScrolling();
        this.fetchingMoreResults = undefined;
        Defer_1.Defer.defer(function () {
            _this.successiveScrollCount++;
            if (_this.successiveScrollCount <= ResultList.MAX_AMOUNT_OF_SUCESSIVE_REQUESTS) {
                _this.handleScrollOfResultList();
            }
            else {
                _this.logger.info("Result list has triggered 5 consecutive queries to try and fill up the scrolling container, but it is still unable to do so.\n          Try explicitly setting the 'data-infinite-scroll-container-selector' option on the result list. See: https://coveo.github.io/search-ui/components/resultlist.html#options.infinitescrollcontainer");
            }
        });
    };
    ResultList.prototype.handleDuringQuery = function () {
        this.logger.trace('Emptying the result container');
        this.cancelFetchingMoreResultsIfNeeded();
        this.showWaitingAnimation();
        this.showOrHideElementsDependingOnState(false, false);
    };
    ResultList.prototype.handleQueryError = function () {
        this.hideWaitingAnimation();
        this.resultContainer.empty();
        this.currentlyDisplayedResults = [];
        this.reachedTheEndOfResults = true;
    };
    ResultList.prototype.handleQuerySuccess = function (data) {
        var _this = this;
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.results);
        var results = data.results;
        this.logger.trace('Received query results from new query', results);
        this.hideWaitingAnimation();
        ResultList.resultCurrentlyBeingRendered = undefined;
        this.reachedTheEndOfResults = data.query.numberOfResults > data.results.results.length;
        this.currentlyDisplayedResults = [];
        this.buildResults(data.results).then(function (elements) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.renderResults(elements)];
                    case 1:
                        _a.sent();
                        this.showOrHideElementsDependingOnState(true, this.currentlyDisplayedResults.length != 0);
                        if (DeviceUtils_1.DeviceUtils.isMobileDevice() && this.options.mobileScrollContainer != undefined) {
                            this.options.mobileScrollContainer.scrollTop = 0;
                        }
                        if (this.options.enableInfiniteScroll && results.results.length == data.queryBuilder.numberOfResults) {
                            // This will check right away if we need to add more results to make the scroll container full & scrolling.
                            this.scrollToTopIfEnabled();
                            this.handleScrollOfResultList();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
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
                _this.scrollToTopIfEnabled();
            }, 0);
        });
    };
    ResultList.prototype.scrollToTopIfEnabled = function () {
        if (!this.options.enableScrollToTop) {
            return;
        }
        ResultListUtils_1.ResultListUtils.scrollToTop(this.root);
    };
    ResultList.prototype.handleNewQuery = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
        ResultList.resultCurrentlyBeingRendered = undefined;
    };
    Object.defineProperty(ResultList.prototype, "otherResultLists", {
        get: function () {
            var allResultLists = this.searchInterface.getComponents(ResultList.ID);
            return underscore_1.without(allResultLists, this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultList.prototype, "resultLayoutSelectors", {
        get: function () {
            return this.searchInterface.getComponents('ResultLayoutSelector');
        },
        enumerable: true,
        configurable: true
    });
    ResultList.prototype.handleBuildingQuery = function (args) {
        if (this.options.fieldsToInclude != null) {
            // remove the @
            args.queryBuilder.addFieldsToInclude(underscore_1.map(this.options.fieldsToInclude, function (field) { return field.substr(1); }));
        }
        if (this.options.autoSelectFieldsToInclude) {
            var otherFields = underscore_1.flatten(underscore_1.map(this.otherResultLists, function (otherResultList) {
                return otherResultList.getAutoSelectedFieldsToInclude();
            }));
            args.queryBuilder.addRequiredFields(underscore_1.unique(otherFields.concat(this.getAutoSelectedFieldsToInclude())));
            args.queryBuilder.includeRequiredFields = true;
        }
    };
    ResultList.prototype.handleChangeLayout = function (args) {
        var _this = this;
        if (args.layout === this.options.layout) {
            this.disableLayoutChange = false;
            this.enable();
            this.options.resultTemplate.layout = this.options.layout;
            if (args.results) {
                // Prevent flickering when switching to a new layout that is empty
                // add a temporary placeholder, the same that is used on initialization
                if (this.resultContainer.isEmpty()) {
                    new InitializationPlaceholder_1.InitializationPlaceholder(this.root).withVisibleRootElement().withPlaceholderForResultList();
                }
                Defer_1.Defer.defer(function () { return __awaiter(_this, void 0, void 0, function () {
                    var elements;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.buildResults(args.results)];
                            case 1:
                                elements = _a.sent();
                                this.renderResults(elements);
                                this.showOrHideElementsDependingOnState(true, this.currentlyDisplayedResults.length !== 0);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
        }
        else {
            this.disableLayoutChange = true;
            this.disable();
            this.resultContainer.empty();
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
        return scrollHeight - bottomPosition < elementHeight / 2;
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
        underscore_1.each(showIfQuery, function (s) {
            Dom_1.$$(s).toggle(hasQuery);
        });
        underscore_1.each(showIfNoQuery, function (s) {
            Dom_1.$$(s).toggle(!hasQuery);
        });
        underscore_1.each(showIfResults, function (s) {
            Dom_1.$$(s).toggle(hasQuery && hasResults);
        });
        underscore_1.each(showIfNoResults, function (s) {
            Dom_1.$$(s).toggle(hasQuery && !hasResults);
        });
    };
    Object.defineProperty(ResultList.prototype, "waitAnimation", {
        get: function () {
            return this.options.waitAnimation.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    ResultList.prototype.showWaitingAnimation = function () {
        switch (this.waitAnimation) {
            case 'fade':
                Dom_1.$$(this.options.waitAnimationContainer).addClass('coveo-fade-out');
                break;
            case 'spinner':
                this.resultContainer.hideChildren();
                if (Dom_1.$$(this.options.waitAnimationContainer).find('.coveo-wait-animation') == undefined) {
                    this.options.waitAnimationContainer.appendChild(DomUtils_1.DomUtils.getBasicLoadingAnimation());
                }
                break;
        }
    };
    ResultList.prototype.hideWaitingAnimation = function () {
        switch (this.waitAnimation) {
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
            underscore_1.each(previousSpinnerContainer, function (previousSpinner) { return Dom_1.$$(previousSpinner).remove(); });
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
        underscore_1.each(spinners, function (spinner) { return Dom_1.$$(spinner).remove(); });
        underscore_1.each(containers, function (container) { return Dom_1.$$(container).remove(); });
    };
    ResultList.prototype.initResultContainer = function () {
        if (!this.options.resultsContainer) {
            var elemType = this.options.layout === 'table' ? 'table' : 'div';
            this.options.resultsContainer = Dom_1.$$(elemType, { className: 'coveo-result-list-container' }).el;
            this.initResultContainerAddToDom();
        }
        return new ResultContainer_1.ResultContainer(this.options.resultsContainer, this.searchInterface);
    };
    ResultList.prototype.initResultContainerAddToDom = function () {
        this.element.appendChild(this.options.resultsContainer);
    };
    ResultList.prototype.initWaitAnimationContainer = function () {
        if (!this.options.waitAnimationContainer) {
            this.options.waitAnimationContainer = this.resultContainer.el;
        }
    };
    ResultList.prototype.setupRenderer = function () {
        var initParameters = {
            options: this.searchInterface.options.originalOptionsObject,
            bindings: this.bindings
        };
        var autoCreateComponentsFn = function (elem) { return Initialization_1.Initialization.automaticallyCreateComponentsInside(elem, initParameters); };
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
    ResultList.prototype.makeElementFocusable = function () {
        Dom_1.$$(this.element).setAttribute('tabindex', '-1');
    };
    ResultList.prototype.ensureHasId = function () {
        var currentId = this.element.id;
        if (currentId === '') {
            this.element.id = underscore_1.uniqueId('coveo-result-list');
        }
    };
    ResultList.ID = 'ResultList';
    ResultList.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultList: ResultList
        });
    };
    /**
     * The options for the ResultList
     * @componentOptions
     */
    ResultList.options = {
        /**
         * The element inside which to insert the rendered result templates.
         *
         * Performing a new query clears the content of this element.
         *
         * You can change the container by specifying its selector (e.g.,
         * `data-result-container-selector='#someCssSelector'`).
         *
         * If you specify no value for this option, a `div` element will be dynamically created and appended to the result
         * list. This element will then be used as a result container.
         */
        resultsContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption({ alias: 'resultContainerSelector' }),
        resultTemplate: TemplateComponentOptions_1.TemplateComponentOptions.buildTemplateOption({ defaultFunction: ResultList.getDefaultTemplate }),
        /**
         * The type of animation to display while waiting for a query to return.
         *
         * The possible values are:
         * - `fade`: Fades out the current list of results while the query is executing.
         * - `spinner`: Shows a spinning animation while the query is executing.
         * - `none`: Use no animation during queries.
         *
         * See also the [`waitAnimationContainer`]{@link ResultList.options.waitAnimationContainer} option.
         *
         * @examples spinner
         */
        waitAnimation: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'none' }),
        /**
         * The element inside which to display the [`waitAnimation`]{@link ResultList.options.waitAnimation}.
         *
         * You can change this by specifying a CSS selector (e.g.,
         * `data-wait-animation-container-selector='#someCssSelector'`).
         *
         * Defaults to the value of the [`resultsContainer`]{@link ResultList.options.resultsContainer} option.
         */
        waitAnimationContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption({
            postProcessing: function (value, options) { return value || options.resultsContainer; }
        }),
        /**
         * Whether to automatically retrieve an additional page of results and append it to the
         * results that the `ResultList` is currently displaying when the user scrolls down to the bottom of the
         * [`infiniteScrollContainer`]{@link ResultList.options.infiniteScrollContainer}.
         *
         * See also the [`infiniteScrollPageSize`]{@link ResultList.options.infiniteScrollPageSize} and
         * [`enableInfiniteScrollWaitingAnimation`]{@link ResultList.options.enableInfiniteScrollWaitingAnimation} options.
         *
         * It is important to specify the `infiniteScrollContainer` option manually if you want the scrolling element to be
         * something else than the default `window` element. Otherwise, you might find yourself in a strange state where the
         * framework rapidly triggers multiple successive query.
         */
        enableInfiniteScroll: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * The number of additional results to fetch when the user scrolls down to the bottom of the
         * [`infiniteScrollContainer`]{@link ResultList.options.infiniteScrollContainer}.
         *
         * @examples 5
         */
        infiniteScrollPageSize: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultValue: 10,
            min: 1,
            depend: 'enableInfiniteScroll'
        }),
        /**
         * The element that triggers fetching additional results when the end user scrolls down to its bottom.
         *
         * You can change the container by specifying its selector (e.g.,
         * `data-infinite-scroll-container-selector='#someCssSelector'`).
         *
         * By default, the framework uses the first vertically scrollable parent element it finds, starting from the
         * `ResultList` element itself. A vertically scrollable element is an element whose CSS `overflow-y` attribute is
         * `scroll`.
         *
         * This implies that if the framework can find no scrollable parent, it uses the `window` itself as a scrollable
         * container.
         *
         * This heuristic is not perfect, for technical reasons. There are always some corner case CSS combination which the
         * framework will not be able to correctly detect as 'scrollable'.
         *
         * It is highly recommended that you manually set this option if you wish something else than the `window` to be the
         * scrollable element.
         */
        infiniteScrollContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption({
            depend: 'enableInfiniteScroll',
            defaultFunction: function (element) { return ComponentOptions_1.ComponentOptions.findParentScrolling(element); }
        }),
        /**
         * Whether to display the [`waitingAnimation`]{@link ResultList.options.waitAnimation} while fetching additional
         * results.
         */
        enableInfiniteScrollWaitingAnimation: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            depend: 'enableInfiniteScroll',
            defaultValue: true
        }),
        mobileScrollContainer: ComponentOptions_1.ComponentOptions.buildSelectorOption({
            defaultFunction: function () { return document.querySelector('.coveo-results-column'); }
        }),
        /**
         * Whether the `ResultList` should scan its result templates to discover which fields it must request to
         * be able to render all results.
         *
         * Setting this option to `true` ensures that the Coveo Search API does not return fields that are unnecessary for
         * the UI to function.
         *
         * **Notes:**
         *
         * - Many interfaces created with the JavaScript Search Interface Editor explicitly set this option to `true`.
         * - You cannot set this option to `true` in the Coveo for Sitecore integration.
         */
        autoSelectFieldsToInclude: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * A list of fields to include in the query results.
         *
         * If you set the [`autoSelectFieldsToInclude`]{@link ResultList.options.autoSelectFieldsToInclude} option to
         * `true`, the Coveo Search API returns the fields you specify for this option (if those fields are available) in
         * addition to the fields which the `ResultList` automatically requests.
         *
         * Otherwise, the Coveo Search API only returns the fields you specify for this option (if those fields are
         * available), unless you leave this option undefined, in which case the Coveo Search API returns all available
         * fields.
         */
        fieldsToInclude: ComponentOptions_1.ComponentOptions.buildFieldsOption({ includeInResults: true }),
        /**
         * Specifies the layout to use when displaying results in this `ResultList` (see
         * [Result Layouts](https://docs.coveo.com/en/360/)). Specifying a value for this option automatically
         * populates a [`ResultLayout`]{@link ResultLayout} component with a switcher for the layout.
         *
         * For example, if there are two `ResultList` components in the page, one with its `layout` set to `list` and the
         * other with the same option set to `card`, then the `ResultLayout` component will render two buttons respectively
         * entitled **List** and **Card**.
         *
         * See the [`ValidLayout`]{@link ValidLayout} type for the list of possible values.
         *
         * @examples card
         */
        layout: ComponentOptions_1.ComponentOptions.buildStringOption({
            defaultValue: 'list',
            required: true
        }),
        /**
         * Whether to scroll back to the top of the page when the end-user interacts with a facet.
         *
         * **Note:** Setting this option to `false` has no effect on dynamic facets. To disable this behavior on a `DynamicFacet` component, you must set its own [`enableScrollToTop`]{@link DynamicFacet.options.enableScrollToTop} option to `false`.
         *
         * @availablesince [July 2019 Release (v2.6459)](https://docs.coveo.com/en/2938/)
         */
        enableScrollToTop: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: true,
            depend: 'enableInfiniteScroll'
        })
    };
    ResultList.resultCurrentlyBeingRendered = null;
    ResultList.MAX_AMOUNT_OF_SUCESSIVE_REQUESTS = 5;
    return ResultList;
}(Component_1.Component));
exports.ResultList = ResultList;
Initialization_1.Initialization.registerAutoCreateComponent(ResultList);


/***/ })

});
//# sourceMappingURL=DynamicFacet__ec82d15c0e890cb8a4e5.js.map