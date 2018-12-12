webpackJsonpCoveo__temporary([10],{

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

/***/ 145:
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
var Component_1 = __webpack_require__(6);
var Strings_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(1);
var Initialization_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(3);
var CategoryFacetTemplates_1 = __webpack_require__(490);
var CategoryValueRoot_1 = __webpack_require__(491);
var CategoryFacetQueryController_1 = __webpack_require__(493);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var QueryStateModel_1 = __webpack_require__(12);
__webpack_require__(494);
var Model_1 = __webpack_require__(15);
var Utils_1 = __webpack_require__(4);
var underscore_1 = __webpack_require__(0);
var Assert_1 = __webpack_require__(5);
var QueryEvents_1 = __webpack_require__(10);
var CategoryFacetSearch_1 = __webpack_require__(495);
var KeyboardUtils_1 = __webpack_require__(29);
var BreadcrumbEvents_1 = __webpack_require__(37);
var CategoryFacetBreadcrumb_1 = __webpack_require__(497);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var CategoryFacetDebug_1 = __webpack_require__(498);
var QueryBuilder_1 = __webpack_require__(36);
/**
 * The `CategoryFacet` component is a facet that renders values in a hierarchical fashion. It determines the filter to apply depending on the
 * current selected path of values.
 *
 * The path is a sequence of values that leads to a specific value in the hierarchy.
 * It is an array listing all the parents of a file (e.g., `['c', 'folder1']` for the `c:\folder1\text1.txt` file).
 *
 * This facet requires a [`field`]{@link CategoryFacet.options.field} with a special format to work correctly (see [Using the Category Facet Component](https://docs.coveo.com/en/2667)).
 */
var CategoryFacet = /** @class */ (function (_super) {
    __extends(CategoryFacet, _super);
    function CategoryFacet(element, options, bindings) {
        var _this = _super.call(this, element, 'CategoryFacet', bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.listenToQueryStateChange = true;
        _this.moreValuesToFetch = true;
        _this.numberOfChildValuesCurrentlyDisplayed = 0;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, CategoryFacet, options);
        _this.categoryFacetQueryController = new CategoryFacetQueryController_1.CategoryFacetQueryController(_this);
        _this.categoryFacetTemplates = new CategoryFacetTemplates_1.CategoryFacetTemplates();
        _this.categoryValueRoot = new CategoryValueRoot_1.CategoryValueRoot(Dom_1.$$(_this.element), _this.categoryFacetTemplates, _this);
        _this.categoryValueRoot.path = _this.activePath;
        _this.currentPage = 0;
        _this.numberOfValues = _this.options.numberOfValues;
        if (_this.options.enableFacetSearch) {
            _this.categoryFacetSearch = new CategoryFacetSearch_1.CategoryFacetSearch(_this);
        }
        if (_this.options.debug) {
            new CategoryFacetDebug_1.CategoryFacetDebug(_this);
        }
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function () { return _this.addFading(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function () { return _this.removeFading(); });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) { return _this.handlePopulateBreadCrumb(args); });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function () { return _this.handleClearBreadcrumb(); });
        _this.buildFacetHeader();
        _this.initQueryStateEvents();
        return _this;
    }
    CategoryFacet.prototype.isCurrentlyDisplayed = function () {
        return this.hasValues;
    };
    Object.defineProperty(CategoryFacet.prototype, "activePath", {
        get: function () {
            return this.queryStateModel.get(this.queryStateAttribute) || this.options.basePath;
        },
        set: function (newPath) {
            this.listenToQueryStateChange = false;
            this.queryStateModel.set(this.queryStateAttribute, newPath);
            this.listenToQueryStateChange = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryFacet.prototype, "queryStateAttribute", {
        get: function () {
            return QueryStateModel_1.QueryStateModel.getFacetId(this.options.id);
        },
        enumerable: true,
        configurable: true
    });
    CategoryFacet.prototype.handleBuildingQuery = function (args) {
        this.positionInQuery = this.categoryFacetQueryController.putCategoryFacetInQueryBuilder(args.queryBuilder, this.activePath, this.numberOfValues + 1);
    };
    CategoryFacet.prototype.handleNoResults = function () {
        if (this.isPristine()) {
            this.hide();
            return;
        }
        if (this.hasValues) {
            this.show();
            return;
        }
        this.activePath = this.options.basePath;
        this.hide();
    };
    CategoryFacet.prototype.handleQuerySuccess = function (args) {
        if (Utils_1.Utils.isNullOrUndefined(args.results.categoryFacets)) {
            this.notImplementedError();
            return;
        }
        if (Utils_1.Utils.isNullOrUndefined(args.results.categoryFacets[this.positionInQuery])) {
            this.handleNoResults();
            return;
        }
        var numberOfRequestedValues = args.query.categoryFacets[this.positionInQuery].maximumNumberOfValues;
        var categoryFacetResult = args.results.categoryFacets[this.positionInQuery];
        this.moreValuesToFetch = numberOfRequestedValues == categoryFacetResult.values.length;
        this.clear();
        if (categoryFacetResult.notImplemented) {
            this.notImplementedError();
            return;
        }
        if (categoryFacetResult.values.length == 0 && categoryFacetResult.parentValues.length == 0) {
            this.handleNoResults();
            return;
        }
        this.renderValues(categoryFacetResult, numberOfRequestedValues);
        if (this.options.enableFacetSearch) {
            var facetSearch = this.categoryFacetSearch.build();
            Dom_1.$$(facetSearch).insertAfter(this.categoryValueRoot.listRoot.el);
        }
        if (this.options.enableMoreLess) {
            this.renderMoreLess();
        }
        if (!this.isPristine()) {
            Dom_1.$$(this.element).addClass('coveo-category-facet-non-empty-path');
        }
    };
    /**
     * Changes the active path.
     *
     */
    CategoryFacet.prototype.changeActivePath = function (path) {
        this.activePath = path;
    };
    CategoryFacet.prototype.executeQuery = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.showWaitingAnimation();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, this.queryController.executeQuery()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        this.hideWaitAnimation();
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reloads the facet with the same path.
     */
    CategoryFacet.prototype.reload = function () {
        this.changeActivePath(this.activePath);
        this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetReload);
        this.executeQuery();
    };
    /**
     * Returns all the visible parent values.
     * @returns simple object with three fields: `value`, `count` and `path`.
     */
    CategoryFacet.prototype.getVisibleParentValues = function () {
        return this.getVisibleParentCategoryValues().map(function (categoryValue) { return categoryValue.getDescriptor(); });
    };
    CategoryFacet.prototype.getVisibleParentCategoryValues = function () {
        if (this.categoryValueRoot.children.length == 0 || this.categoryValueRoot.children[0].children.length == 0) {
            return [];
        }
        var currentParentvalue = this.categoryValueRoot.children[0];
        var parentValues = [currentParentvalue];
        while (currentParentvalue.children.length != 0 && !Utils_1.Utils.arrayEqual(currentParentvalue.path, this.activePath)) {
            currentParentvalue = currentParentvalue.children[0];
            parentValues.push(currentParentvalue);
        }
        return parentValues;
    };
    /**
     * Shows more values according to {@link CategoryFacet.options.pageSize}.
     *
     * See the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess}, and
     * [`numberOfValues`]{@link CategoryFacet.options.numberOfValues} options.
     */
    CategoryFacet.prototype.showMore = function () {
        if (this.moreValuesToFetch) {
            this.currentPage++;
            this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
            this.reload();
        }
    };
    /**
     * Shows less values, up to the original number of values.
     *
     * See the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess}, and
     * [`numberOfValues`]{@link CategoryFacet.options.numberOfValues} options.
     */
    CategoryFacet.prototype.showLess = function () {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
            this.reload();
        }
    };
    /**
     * Returns the values at the bottom of the hierarchy. These are the values that are not yet applied to the query.
     * @returns simple object with three fields: `value`, `count` and `path`.
     */
    CategoryFacet.prototype.getAvailableValues = function () {
        if (!this.activeCategoryValue) {
            return [];
        }
        return this.activeCategoryValue.children.map(function (categoryValue) {
            return {
                value: categoryValue.categoryValueDescriptor.value,
                count: categoryValue.categoryValueDescriptor.count,
                path: categoryValue.path
            };
        });
    };
    /**
     * Selects a value from the currently available values.
     * If the given value to select is not in the available values, it will throw an error.
     */
    CategoryFacet.prototype.selectValue = function (value) {
        Assert_1.Assert.check(underscore_1.contains(underscore_1.pluck(this.getAvailableValues(), 'value'), value), 'Failed while trying to select a value that is not available.');
        var newPath = this.activePath.slice(0);
        newPath.push(value);
        this.changeActivePath(newPath);
        this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect);
        this.executeQuery();
    };
    /**
     * Deselects the last value in the hierarchy that is applied to the query. When at the top of the hierarchy, this method does nothing.
     */
    CategoryFacet.prototype.deselectCurrentValue = function () {
        if (this.activePath.length == 0) {
            return;
        }
        var newPath = this.activePath.slice(0);
        newPath.pop();
        this.changeActivePath(newPath);
        this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect);
        this.executeQuery();
    };
    /**
     * Resets the facet to its initial state.
     */
    CategoryFacet.prototype.reset = function () {
        this.changeActivePath(this.options.basePath);
        this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetClear);
        this.executeQuery();
    };
    CategoryFacet.prototype.disable = function () {
        _super.prototype.disable.call(this);
        this.hide();
    };
    /**
     * Hides the component.
     */
    CategoryFacet.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    /**
     * Shows the component.
     */
    CategoryFacet.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    /**
     * Goes through any value that contains the value parameter, and verifies whether there are missing parents.
     * Issues are then logged in the console.
     * If you do not want to specify a value, you can simply enable {@link CategoryFacet.options.debug} and do an empty query.
     */
    CategoryFacet.prototype.debugValue = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var queryBuilder, queryResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryBuilder = new QueryBuilder_1.QueryBuilder();
                        this.categoryFacetQueryController.addDebugGroupBy(queryBuilder, value);
                        return [4 /*yield*/, this.queryController.getEndpoint().search(queryBuilder.build())];
                    case 1:
                        queryResults = _a.sent();
                        CategoryFacetDebug_1.CategoryFacetDebug.analyzeResults(queryResults.groupByResults[0], this.options.delimitingCharacter);
                        return [2 /*return*/];
                }
            });
        });
    };
    CategoryFacet.prototype.showWaitingAnimation = function () {
        if (this.waitElement.el.style.visibility == 'hidden') {
            this.waitElement.el.style.visibility = 'visible';
        }
    };
    CategoryFacet.prototype.hideWaitAnimation = function () {
        if (this.waitElement.el.style.visibility == 'visible') {
            this.waitElement.el.style.visibility = 'hidden';
        }
    };
    CategoryFacet.prototype.logAnalyticsEvent = function (eventName, path) {
        if (path === void 0) { path = this.activePath; }
        this.usageAnalytics.logSearchEvent(eventName, {
            categoryFacetId: this.options.id,
            categoryFacetPath: path,
            categoryFacetTitle: this.options.title
        });
    };
    CategoryFacet.prototype.getEndpoint = function () {
        return this.queryController.getEndpoint();
    };
    Object.defineProperty(CategoryFacet.prototype, "children", {
        get: function () {
            return this.categoryValueRoot.children;
        },
        enumerable: true,
        configurable: true
    });
    CategoryFacet.prototype.renderValues = function (categoryFacetResult, numberOfRequestedValues) {
        this.show();
        var sortedParentValues = this.sortParentValues(categoryFacetResult.parentValues);
        var currentParentValue = this.categoryValueRoot;
        var needToTruncate = false;
        var pathOfLastTruncatedParentValue;
        var numberOfItemsInFirstSlice = Math.floor(CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING / 2);
        var numberOfItemsInSecondSlice = Math.ceil(CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING / 2);
        sortedParentValues = this.hideBasePathInParentValues(sortedParentValues);
        if (this.shouldTruncate(sortedParentValues)) {
            pathOfLastTruncatedParentValue = this.findPathOfLastTruncatedParentValue(sortedParentValues, numberOfItemsInSecondSlice);
            needToTruncate = true;
            sortedParentValues = underscore_1.first(sortedParentValues, numberOfItemsInFirstSlice).concat(underscore_1.last(sortedParentValues, numberOfItemsInSecondSlice));
        }
        if (!this.isPristine()) {
            this.addAllCategoriesButton();
        }
        for (var i = 0; i < sortedParentValues.length; i++) {
            currentParentValue = currentParentValue.renderAsParent(sortedParentValues[i]);
            // We do not want to make the "last" parent selectable, as clicking it would be a noop (re-selecting the same filter)
            var isLastParent = i == sortedParentValues.length - 1;
            if (!isLastParent) {
                currentParentValue.makeSelectable().showCollapseArrow();
            }
            if (needToTruncate) {
                if (i == numberOfItemsInFirstSlice - 1) {
                    this.addEllipsis();
                }
                if (i == numberOfItemsInFirstSlice) {
                    currentParentValue.path = pathOfLastTruncatedParentValue.concat([sortedParentValues[i].value]);
                }
            }
        }
        var childrenValuesToRender = this.moreValuesToFetch
            ? categoryFacetResult.values.slice(0, numberOfRequestedValues - 1)
            : categoryFacetResult.values.slice(0, numberOfRequestedValues);
        this.numberOfChildValuesCurrentlyDisplayed = childrenValuesToRender.length;
        currentParentValue.renderChildren(childrenValuesToRender);
        this.activeCategoryValue = currentParentValue;
    };
    CategoryFacet.prototype.hideBasePathInParentValues = function (parentValues) {
        if (Utils_1.Utils.arrayEqual(underscore_1.first(this.activePath, this.options.basePath.length), this.options.basePath)) {
            parentValues = underscore_1.last(parentValues, parentValues.length - this.options.basePath.length);
        }
        return parentValues;
    };
    CategoryFacet.prototype.shouldTruncate = function (parentValues) {
        return parentValues.length > CategoryFacet.MAXIMUM_NUMBER_OF_VALUES_BEFORE_TRUNCATING;
    };
    CategoryFacet.prototype.addEllipsis = function () {
        this.categoryValueRoot.listRoot.append(this.categoryFacetTemplates.buildEllipsis().el);
    };
    CategoryFacet.prototype.findPathOfLastTruncatedParentValue = function (sortedParentValues, numberOfItemsInSecondSlice) {
        var indexOfLastTruncatedParentValue = sortedParentValues.length - numberOfItemsInSecondSlice - 1;
        return underscore_1.reduce(underscore_1.first(sortedParentValues, indexOfLastTruncatedParentValue + 1), function (path, parentValue) { return path.concat([parentValue.value]); }, []);
    };
    CategoryFacet.prototype.addAllCategoriesButton = function () {
        var _this = this;
        var allCategories = this.categoryFacetTemplates.buildAllCategoriesButton();
        allCategories.on('click', function () { return _this.reset(); });
        this.categoryValueRoot.listRoot.append(allCategories.el);
    };
    CategoryFacet.prototype.isPristine = function () {
        return Utils_1.Utils.arrayEqual(this.activePath, this.options.basePath);
    };
    CategoryFacet.prototype.buildFacetHeader = function () {
        var _this = this;
        this.waitElement = Dom_1.$$('div', { className: CategoryFacet.WAIT_ELEMENT_CLASS }, SVGIcons_1.SVGIcons.icons.loading);
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.waitElement.el, 'coveo-category-facet-header-wait-animation-svg');
        this.waitElement.el.style.visibility = 'hidden';
        var titleSection = Dom_1.$$('div', { className: 'coveo-category-facet-title' }, this.options.title);
        this.facetHeader = Dom_1.$$('div', { className: 'coveo-category-facet-header' }, titleSection);
        Dom_1.$$(this.element).prepend(this.facetHeader.el);
        this.facetHeader.append(this.waitElement.el);
        var clearIcon = Dom_1.$$('div', { title: Strings_1.l('Clear', this.options.title), className: 'coveo-category-facet-header-eraser coveo-facet-header-eraser' }, SVGIcons_1.SVGIcons.icons.mainClear);
        SVGDom_1.SVGDom.addClassToSVGInContainer(clearIcon.el, 'coveo-facet-header-eraser-svg');
        clearIcon.on('click', function () {
            _this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetClear);
            _this.reset();
        });
        this.facetHeader.append(clearIcon.el);
    };
    CategoryFacet.prototype.handleQueryStateChanged = function (data) {
        if (this.listenToQueryStateChange) {
            var path = data.attributes[this.queryStateAttribute];
            if (!Utils_1.Utils.isNullOrUndefined(path) && underscore_1.isArray(path) && path.length != 0) {
                this.activePath = path;
            }
        }
    };
    CategoryFacet.prototype.initQueryStateEvents = function () {
        var _this = this;
        this.queryStateModel.registerNewAttribute(this.queryStateAttribute, this.options.basePath);
        this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE, undefined, function (data) { return _this.handleQueryStateChanged(data); });
    };
    CategoryFacet.prototype.addFading = function () {
        Dom_1.$$(this.element).addClass('coveo-category-facet-values-fade');
    };
    CategoryFacet.prototype.removeFading = function () {
        Dom_1.$$(this.element).removeClass('coveo-category-facet-values-fade');
    };
    CategoryFacet.prototype.notImplementedError = function () {
        var errorMessage = 'Category Facets are not supported by your current search endpoint. Disabling this component.';
        this.logger.error(errorMessage);
        this.disable();
    };
    CategoryFacet.prototype.sortParentValues = function (parentValues) {
        if (this.activePath.length != parentValues.length) {
            this.logger.warn('Inconsistent CategoryFacet results: Number of parent values results does not equal length of active path');
            return parentValues;
        }
        var sortedParentvalues = [];
        var _loop_1 = function (pathElement) {
            var currentParentValue = underscore_1.find(parentValues, function (parentValue) { return parentValue.value.toLowerCase() == pathElement.toLowerCase(); });
            if (!currentParentValue) {
                this_1.logger.warn('Inconsistent CategoryFacet results: path not consistent with parent values results');
                return { value: parentValues };
            }
            sortedParentvalues.push(currentParentValue);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.activePath; _i < _a.length; _i++) {
            var pathElement = _a[_i];
            var state_1 = _loop_1(pathElement);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return sortedParentvalues;
    };
    CategoryFacet.prototype.renderMoreLess = function () {
        this.moreLessContainer = Dom_1.$$('div', { className: 'coveo-category-facet-more-less-container' });
        Dom_1.$$(this.element).append(this.moreLessContainer.el);
        if (this.numberOfChildValuesCurrentlyDisplayed > this.options.numberOfValues) {
            this.moreLessContainer.append(this.buildLessButton());
        }
        if (this.moreValuesToFetch) {
            this.moreLessContainer.append(this.buildMoreButton());
        }
    };
    CategoryFacet.prototype.clear = function () {
        this.categoryValueRoot.clear();
        if (this.options.enableFacetSearch) {
            this.categoryFacetSearch.clear();
        }
        this.moreLessContainer && this.moreLessContainer.detach();
        Dom_1.$$(this.element).removeClass('coveo-category-facet-non-empty-path');
    };
    CategoryFacet.prototype.buildMoreButton = function () {
        var _this = this;
        var svgContainer = Dom_1.$$('span', { className: 'coveo-facet-more-icon' }, SVGIcons_1.SVGIcons.icons.arrowDown).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-more-icon-svg');
        var more = Dom_1.$$('div', { className: 'coveo-category-facet-more', tabindex: 0 }, svgContainer);
        var showMoreHandler = function () { return _this.showMore(); };
        more.on('click', function () { return _this.showMore(); });
        more.on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, showMoreHandler));
        return more.el;
    };
    CategoryFacet.prototype.buildLessButton = function () {
        var _this = this;
        var svgContainer = Dom_1.$$('span', { className: 'coveo-facet-less-icon' }, SVGIcons_1.SVGIcons.icons.arrowUp).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-less-icon-svg');
        var less = Dom_1.$$('div', { className: 'coveo-category-facet-less', tabIndex: 0 }, svgContainer);
        var showLessHandler = function () { return _this.showLess(); };
        less.on('click', showLessHandler);
        less.on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, showLessHandler));
        return less.el;
    };
    CategoryFacet.prototype.handlePopulateBreadCrumb = function (args) {
        var _this = this;
        var lastParentValue = this.getVisibleParentValues().pop();
        if (!this.isPristine() && lastParentValue) {
            var resetFacet = function () {
                _this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbFacet);
                _this.reset();
            };
            var categoryFacetBreadcrumbBuilder = new CategoryFacetBreadcrumb_1.CategoryFacetBreadcrumb(this.options.title, resetFacet, lastParentValue);
            args.breadcrumbs.push({ element: categoryFacetBreadcrumbBuilder.build() });
        }
    };
    CategoryFacet.prototype.handleClearBreadcrumb = function () {
        this.changeActivePath(this.options.basePath);
    };
    Object.defineProperty(CategoryFacet.prototype, "hasValues", {
        get: function () {
            return this.getAvailableValues().length > 0;
        },
        enumerable: true,
        configurable: true
    });
    CategoryFacet.doExport = function () {
        GlobalExports_1.exportGlobally({
            CategoryFacet: CategoryFacet
        });
    };
    CategoryFacet.ID = 'CategoryFacet';
    /**
     * The options for the component
     * @componentOptions
     */
    CategoryFacet.options = {
        /**
         * The index field whose values the facet should use. The field values should have the form:
         * `the; the|path; the|path|to; the|path|to|given; the|path|to|given|item;`
         * where the delimiting character is `|`. This default delimiting character can be changed using the [delimitingCharacter]{@link CategoryFacet.options.delimitingCharacter} option.
         *
         * To help you verify whether your fields are setup correctly, see the {@link CategoryFacet.options.debug} option
         * and the {@link CategoryFacet.debugValue} method.
         *
         * See [Using the Category Facet Component](https://docs.coveo.com/en/2667).
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
        /**
         * The title to display at the top of the facet.
         *
         * Default value is the localized string for `NoTitle`.
         */
        title: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            defaultValue: Strings_1.l('NoTitle')
        }),
        /**
         * The maximum number of field values to display by default in the facet before the user
         * clicks the arrow to show more.
         *
         * See also the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess} option.
         */
        numberOfValues: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0, section: 'CommonOptions' }),
        /**
         * Whether to display a search box at the bottom of the facet for searching among the available facet
         * [`field`]{@link CategoryFacet.options.field} values.
         *
         * See also the [`facetSearchDelay`]{@link CategoryFacet.options.facetSearchDelay}, and
         * [`numberOfResultsInFacetSearch`]{@link CategoryFacet.options.numberOfResultsInFacetSearch} options.
         *
         *
         * Default value is `true`.
         */
        enableFacetSearch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * A unique identifier for the facet. Among other things, this identifier serves the purpose of saving
         * the facet state in the URL hash.
         *
         * If you have two facets with the same field on the same page, you should specify an `id` value for at least one of
         * those two facets. This `id` must be unique among the facets.
         *
         * Default value is the [`field`]{@link CategoryFacet.options.field} option value.
         */
        id: ComponentOptions_1.ComponentOptions.buildStringOption({
            postProcessing: function (value, options) { return value || options.field; }
        }),
        /**
         * The *injection depth* to use.
         *
         * The injection depth determines how many results to scan in the index to ensure that the category facet lists all potential
         * facet values. Increasing this value enhances the accuracy of the listed values at the cost of performance.
         *
         * Default value is `1000`. Minimum value is `0`.
         * @notSupportedIn salesforcefree
         */
        injectionDepth: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 1000, min: 0 }),
        /**
         * If the [`enableFacetSearch`]{@link CategoryFacet.options.enableFacetSearch} option is `true`, specifies the number of
         * values to display in the facet search results popup.
         *
         * Default value is `15`. Minimum value is `1`.
         */
        numberOfResultsInFacetSearch: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 15, min: 1 }),
        /**
         * If the [`enableFacetSearch`]{@link CategoryFacet.options.enableFacetSearch} option is `true`, specifies the delay (in
         * milliseconds) before sending a search request to the server when the user starts typing in the category facet search box.
         *
         * Specifying a smaller value makes results appear faster. However, chances of having to cancel many requests
         * sent to the server increase as the user keeps on typing new characters.
         *
         * Default value is `100`. Minimum value is `0`.
         */
        facetSearchDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 100, min: 0 }),
        /**
         * Whether to enable the **More** and **Less** buttons in the Facet.
         *
         * See also the [`pageSize`]{@link CategoryFacet.options.pageSize} option.
         *
         * Default value is `true`.
         */
        enableMoreLess: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * If the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess} option is `true`, specifies the number of
         * additional results to fetch when clicking the **More** button.
         *
         * Default value is `10`. Minimum value is `1`.
         */
        pageSize: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableMoreLess' }),
        /**
         * The character that specifies the hierarchical dependency.
         *
         * **Example:**
         *
         * If your field has the following values:
         *
         * `@field: c; c>folder2; c>folder2>folder3;`
         *
         * The delimiting character is `>`.
         *
         * Default value is `|`.
         */
        delimitingCharacter: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '|' }),
        /**
         * The path to use as the path prefix for every query.
         *
         * **Example:**
         *
         * You have the following files indexed on a file system:
         * ```
         * c:\
         *    folder1\
         *      text1.txt
         *    folder2\
         *      folder3\
         *        text2.txt
         * ```
         * Setting the `basePath` to `c` would display `folder1` and `folder2` in the `CategoryFacet`, but omit `c`.
         *
         */
        basePath: ComponentOptions_1.ComponentOptions.buildListOption({ defaultValue: [] }),
        /**
         * The maximum number of levels to traverse in the hierarchy.
         * This option does not count the length of the base path. The depth depends on what is shown in the interface.
         *
         * Default value is `Number.MAX_VALUE`.
         */
        maximumDepth: ComponentOptions_1.ComponentOptions.buildNumberOption({ min: 1, defaultValue: Number.MAX_VALUE }),
        /**
         * Whether to activate field format debugging.
         * This options logs messages in the console for any potential encountered issues.
         * This option can have negative effects on performance, and should only be activated when debugging.
         */
        debug: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    CategoryFacet.MAXIMUM_NUMBER_OF_VALUES_BEFORE_TRUNCATING = 15;
    CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING = 10;
    CategoryFacet.WAIT_ELEMENT_CLASS = 'coveo-category-facet-header-wait-animation';
    return CategoryFacet;
}(Component_1.Component));
exports.CategoryFacet = CategoryFacet;
Initialization_1.Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();


/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var EventsUtils = /** @class */ (function () {
    function EventsUtils() {
    }
    // eventName must be in PascalCase
    EventsUtils.addPrefixedEvent = function (element, pascalCaseEventName, callback) {
        _.each(this.prefixes, function (prefix) {
            if (prefix == '') {
                pascalCaseEventName = pascalCaseEventName.toLowerCase();
            }
            element.addEventListener(prefix + pascalCaseEventName, callback, false);
        });
    };
    // eventName must be in PascalCase
    EventsUtils.removePrefixedEvent = function (element, pascalCaseEventName, callback) {
        _.each(this.prefixes, function (prefix) {
            if (prefix == '') {
                pascalCaseEventName = pascalCaseEventName.toLowerCase();
            }
            element.removeEventListener(prefix + pascalCaseEventName, callback, false);
        });
    };
    EventsUtils.prefixes = ['webkit', 'moz', 'MS', 'o', ''];
    return EventsUtils;
}());
exports.EventsUtils = EventsUtils;


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

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The possible values for the [allowedValuesPatternType]{@link IGroupByRequest.allowedValuesPatternType} property of the `IGroupByRequest` interface.
 */
var AllowedValuesPatternType;
(function (AllowedValuesPatternType) {
    /**
     * Only supports trailing wildcards in the pattern.
     */
    AllowedValuesPatternType["Legacy"] = "legacy";
    /**
     * Fully supports wildcards.
     */
    AllowedValuesPatternType["Wildcards"] = "wildcards";
    /**
     * Supports regular expression as the pattern.
     */
    AllowedValuesPatternType["Regex"] = "regex";
    /**
     *Applies the Edit Distance algorithm to match values that are close to the specified pattern.
     */
    AllowedValuesPatternType["EditDistance"] = "editdistance";
    /**
     *Applies a phonetic algorithm to match values that are phonetically similar to the specified pattern.
     */
    AllowedValuesPatternType["Phonetic"] = "phonetic";
})(AllowedValuesPatternType = exports.AllowedValuesPatternType || (exports.AllowedValuesPatternType = {}));


/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var Component_1 = __webpack_require__(6);
var Strings_1 = __webpack_require__(7);
var EventsUtils_1 = __webpack_require__(154);
var PopupUtils_1 = __webpack_require__(70);
var FacetSearchUserInputHandler_1 = __webpack_require__(371);
var underscore_1 = __webpack_require__(0);
var FacetSearchElement = /** @class */ (function () {
    function FacetSearchElement(facetSearch) {
        var _this = this;
        this.facetSearch = facetSearch;
        this.searchBarIsAnimating = false;
        this.triggeredScroll = false;
        this.facetSearchUserInputHandler = new FacetSearchUserInputHandler_1.FacetSearchUserInputHandler(this.facetSearch);
        this.searchResults = Dom_1.$$('ul', { className: 'coveo-facet-search-results' }).el;
        Dom_1.$$(this.searchResults).on('scroll', function () { return _this.handleScrollEvent(); });
        Dom_1.$$(this.searchResults).hide();
    }
    FacetSearchElement.prototype.build = function (handleFacetSearchClear) {
        var _this = this;
        this.search = document.createElement('div');
        Dom_1.$$(this.search).addClass('coveo-facet-search');
        this.magnifier = this.buildMagnifierIcon();
        this.search.appendChild(this.magnifier);
        this.wait = this.buildWaitIcon();
        this.search.appendChild(this.wait);
        this.hideFacetSearchWaitingAnimation();
        this.clear = Dom_1.$$('div', { className: 'coveo-facet-search-clear', title: Strings_1.l('Clear', Strings_1.l('Search')) }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.clear, 'coveo-facet-search-clear-svg');
        this.clear.style.display = 'none';
        this.search.appendChild(this.clear);
        var middle = document.createElement('div');
        Dom_1.$$(middle).addClass('coveo-facet-search-middle');
        this.search.appendChild(middle);
        this.input = this.buildInputElement();
        Component_1.Component.pointElementsToDummyForm(this.input);
        middle.appendChild(this.input);
        Dom_1.$$(this.input).on('keyup', function (e) {
            _this.facetSearchUserInputHandler.handleKeyboardEvent(e);
        });
        Dom_1.$$(this.clear).on('click', function (e) {
            handleFacetSearchClear && handleFacetSearchClear();
        });
        Dom_1.$$(this.input).on('focus', function (e) {
            _this.handleFacetSearchFocus();
        });
        this.detectSearchBarAnimation();
        return this.search;
    };
    FacetSearchElement.prototype.showFacetSearchWaitingAnimation = function () {
        this.magnifier && Dom_1.$$(this.magnifier).hide();
        Dom_1.$$(this.wait).show();
    };
    FacetSearchElement.prototype.getValueInInputForFacetSearch = function () {
        return this.input.value.trim();
    };
    FacetSearchElement.prototype.hideFacetSearchWaitingAnimation = function () {
        Dom_1.$$(this.magnifier).show();
        Dom_1.$$(this.wait).hide();
    };
    FacetSearchElement.prototype.detectSearchBarAnimation = function () {
        var _this = this;
        EventsUtils_1.EventsUtils.addPrefixedEvent(this.search, 'AnimationStart', function (event) {
            if (event.animationName == 'grow') {
                _this.searchBarIsAnimating = true;
            }
        });
        EventsUtils_1.EventsUtils.addPrefixedEvent(this.search, 'AnimationEnd', function (event) {
            if (event.animationName == 'grow') {
                _this.searchBarIsAnimating = false;
            }
        });
    };
    FacetSearchElement.prototype.positionSearchResults = function (root, facetWidth, nextTo) {
        var _this = this;
        if (this.searchResults != null) {
            root.appendChild(this.searchResults);
            this.searchResults.style.display = 'block';
            this.searchResults.style.width = facetWidth - FacetSearchElement.FACET_SEARCH_PADDING + 'px';
            if (Dom_1.$$(this.searchResults).css('display') == 'none') {
                this.searchResults.style.display = '';
            }
            var searchBar = Dom_1.$$(this.search);
            if (searchBar.css('display') == 'none' || this.searchBarIsAnimating) {
                if (Dom_1.$$(this.searchResults).css('display') == 'none') {
                    this.searchResults.style.display = '';
                }
                EventsUtils_1.EventsUtils.addPrefixedEvent(this.search, 'AnimationEnd', function () {
                    _this.positionPopUp(nextTo, root);
                    EventsUtils_1.EventsUtils.removePrefixedEvent(_this.search, 'AnimationEnd', _this);
                });
            }
            else {
                this.positionPopUp(nextTo, root);
            }
        }
    };
    FacetSearchElement.prototype.setAsCurrentResult = function (toSet) {
        this.currentResult && this.currentResult.removeClass('coveo-facet-search-current-result');
        this.currentResult = toSet;
        toSet.addClass('coveo-facet-search-current-result');
    };
    FacetSearchElement.prototype.moveCurrentResultDown = function () {
        var nextResult = this.currentResult.el.nextElementSibling;
        if (!nextResult) {
            nextResult = underscore_1.first(this.searchResults.children);
        }
        this.setAsCurrentResult(Dom_1.$$(nextResult));
        this.highlightAndShowCurrentResultWithKeyboard();
    };
    FacetSearchElement.prototype.moveCurrentResultUp = function () {
        var previousResult = this.currentResult.el.previousElementSibling;
        if (!previousResult) {
            previousResult = underscore_1.last(this.searchResults.children);
        }
        this.setAsCurrentResult(Dom_1.$$(previousResult));
        this.highlightAndShowCurrentResultWithKeyboard();
    };
    FacetSearchElement.prototype.highlightCurrentQueryInSearchResults = function (regex) {
        var captions = this.facetSearch.getCaptions();
        captions.forEach(function (caption) {
            caption.innerHTML = Dom_1.$$(caption)
                .text()
                .replace(regex, '<span class="coveo-highlight">$1</span>');
        });
    };
    FacetSearchElement.prototype.appendToSearchResults = function (el) {
        this.searchResults.appendChild(el);
        this.setupFacetSearchResultsEvents(el);
    };
    FacetSearchElement.prototype.focus = function () {
        this.input.focus();
        this.handleFacetSearchFocus();
    };
    FacetSearchElement.prototype.highlightAndShowCurrentResultWithKeyboard = function () {
        this.currentResult.addClass('coveo-facet-search-current-result');
        this.triggeredScroll = true;
        this.searchResults.scrollTop = this.currentResult.el.offsetTop;
    };
    FacetSearchElement.prototype.handleFacetSearchFocus = function () {
        if (this.facetSearch.currentlyDisplayedResults == null) {
            this.facetSearch.displayNewValues();
        }
    };
    FacetSearchElement.prototype.setupFacetSearchResultsEvents = function (el) {
        var _this = this;
        Dom_1.$$(el).on('mousemove', function () {
            _this.setAsCurrentResult(Dom_1.$$(el));
        });
        // Prevent closing the search results on the end of a touch drag
        var touchDragging = false;
        var mouseDragging = false;
        Dom_1.$$(el).on('mousedown', function () { return (mouseDragging = false); });
        Dom_1.$$(el).on('mousemove', function () { return (mouseDragging = true); });
        Dom_1.$$(el).on('touchmove', function () { return (touchDragging = true); });
        Dom_1.$$(el).on('mouseup touchend', function () {
            if (!touchDragging && !mouseDragging) {
                setTimeout(function () {
                    _this.facetSearch.dismissSearchResults();
                }, 0); // setTimeout is to give time to trigger the click event before hiding the search menu.
            }
            touchDragging = false;
            mouseDragging = false;
        });
    };
    FacetSearchElement.prototype.hideSearchResultsElement = function () {
        Dom_1.$$(this.searchResults).hide();
        Dom_1.$$(this.searchResults).remove();
    };
    FacetSearchElement.prototype.clearSearchInput = function () {
        if (this.input) {
            this.input.value = '';
        }
    };
    FacetSearchElement.prototype.buildMagnifierIcon = function () {
        var magnifier = document.createElement('div');
        magnifier.innerHTML = SVGIcons_1.SVGIcons.icons.search;
        Dom_1.$$(magnifier).addClass('coveo-facet-search-magnifier');
        SVGDom_1.SVGDom.addClassToSVGInContainer(magnifier, 'coveo-facet-search-magnifier-svg');
        this.search.appendChild(magnifier);
        return magnifier;
    };
    FacetSearchElement.prototype.buildWaitIcon = function () {
        var wait = document.createElement('div');
        wait.innerHTML = SVGIcons_1.SVGIcons.icons.loading;
        Dom_1.$$(wait).addClass('coveo-facet-search-wait-animation');
        SVGDom_1.SVGDom.addClassToSVGInContainer(wait, 'coveo-facet-search-wait-animation-svg');
        return wait;
    };
    FacetSearchElement.prototype.buildInputElement = function () {
        return Dom_1.$$('input', {
            className: 'coveo-facet-search-input',
            type: 'test',
            autocapitalize: 'off',
            autocorrect: 'off',
            'aria-label': Strings_1.l('Search')
        }).el;
    };
    FacetSearchElement.prototype.positionPopUp = function (nextTo, root) {
        PopupUtils_1.PopupUtils.positionPopup(this.searchResults, nextTo, root, {
            horizontal: PopupUtils_1.PopupHorizontalAlignment.CENTER,
            vertical: PopupUtils_1.PopupVerticalAlignment.BOTTOM
        });
    };
    FacetSearchElement.prototype.handleScrollEvent = function () {
        if (this.triggeredScroll) {
            this.triggeredScroll = false;
        }
        else {
            this.facetSearchUserInputHandler.handleFacetSearchResultsScroll();
        }
    };
    FacetSearchElement.FACET_SEARCH_PADDING = 40;
    return FacetSearchElement;
}());
exports.FacetSearchElement = FacetSearchElement;


/***/ }),

/***/ 366:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryValue_1 = __webpack_require__(492);
var underscore_1 = __webpack_require__(0);
var CategoryChildrenValueRenderer = /** @class */ (function () {
    function CategoryChildrenValueRenderer(element, categoryFacetTemplates, categoryValue, categoryFacet) {
        this.element = element;
        this.categoryFacetTemplates = categoryFacetTemplates;
        this.categoryValue = categoryValue;
        this.categoryFacet = categoryFacet;
        this.children = [];
    }
    CategoryChildrenValueRenderer.prototype.clearChildren = function () {
        this.element.removeClass('coveo-active-category-facet-parent');
        this.children.forEach(function (child) {
            child.clear();
        });
        this.children = [];
    };
    CategoryChildrenValueRenderer.prototype.renderChildren = function (values) {
        var _this = this;
        underscore_1.each(values, function (value) {
            _this.renderValue(value, true).makeSelectable();
        });
    };
    CategoryChildrenValueRenderer.prototype.renderAsParent = function (value) {
        var categoryValue = this.renderValue(value, false);
        return categoryValue;
    };
    CategoryChildrenValueRenderer.prototype.renderValue = function (value, isChild) {
        var path = this.categoryValue.path.concat([value.value]);
        var categoryValueDescriptor = {
            value: value.value,
            count: value.numberOfResults,
            path: path
        };
        var categoryValue = new CategoryValue_1.CategoryValue(this.categoryValue.listRoot, categoryValueDescriptor, this.categoryFacetTemplates, this.categoryFacet);
        categoryValue.render(isChild);
        this.children.push(categoryValue);
        return categoryValue;
    };
    return CategoryChildrenValueRenderer;
}());
exports.CategoryChildrenValueRenderer = CategoryChildrenValueRenderer;


/***/ }),

/***/ 367:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 371:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var KeyboardUtils_1 = __webpack_require__(29);
var FacetSearchUserInputHandler = /** @class */ (function () {
    function FacetSearchUserInputHandler(facetSearch) {
        this.facetSearch = facetSearch;
    }
    FacetSearchUserInputHandler.prototype.handleKeyboardEvent = function (event) {
        switch (event.which) {
            case KeyboardUtils_1.KEYBOARD.ENTER:
                this.facetSearch.keyboardNavigationEnterPressed(event);
                break;
            case KeyboardUtils_1.KEYBOARD.DELETE:
                this.facetSearch.keyboardNavigationDeletePressed && this.facetSearch.keyboardNavigationDeletePressed(event);
                break;
            case KeyboardUtils_1.KEYBOARD.ESCAPE:
                this.facetSearch.dismissSearchResults();
                break;
            case KeyboardUtils_1.KEYBOARD.DOWN_ARROW:
                this.facetSearch.facetSearchElement.moveCurrentResultDown();
                break;
            case KeyboardUtils_1.KEYBOARD.UP_ARROW:
                this.facetSearch.facetSearchElement.moveCurrentResultUp();
                break;
            default:
                this.facetSearch.keyboardEventDefaultHandler();
        }
    };
    FacetSearchUserInputHandler.prototype.handleFacetSearchResultsScroll = function () {
        if (this.facetSearch.facetSearchPromise ||
            this.facetSearch.facetSearchElement.getValueInInputForFacetSearch() != '' ||
            !this.facetSearch.moreValuesToFetch) {
            return;
        }
        var elementHeight = this.facetSearch.facetSearchElement.searchResults.clientHeight;
        var scrollHeight = this.facetSearch.facetSearchElement.searchResults.scrollHeight;
        var bottomPosition = this.facetSearch.facetSearchElement.searchResults.scrollTop + elementHeight;
        if (scrollHeight - bottomPosition < elementHeight / 2) {
            this.facetSearch.fetchMoreValues();
        }
    };
    return FacetSearchUserInputHandler;
}());
exports.FacetSearchUserInputHandler = FacetSearchUserInputHandler;


/***/ }),

/***/ 490:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var underscore_1 = __webpack_require__(0);
var Strings_1 = __webpack_require__(7);
var CategoryFacetTemplates = /** @class */ (function () {
    function CategoryFacetTemplates() {
        this.listRoot = Dom_1.$$('ul', { className: 'coveo-category-facet-values' });
        this.collapseArrow = Dom_1.$$('span', { className: 'coveo-category-facet-collapse-children' }, SVGIcons_1.SVGIcons.icons.arrowDown);
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.collapseArrow.el, 'coveo-category-facet-collapse-children-svg');
    }
    CategoryFacetTemplates.prototype.buildListRoot = function () {
        return this.listRoot.clone(true);
    };
    CategoryFacetTemplates.prototype.buildListElement = function (data) {
        var div = Dom_1.$$('div', {}, this.createListElement(data));
        return Dom_1.$$(div.el.firstChild);
    };
    CategoryFacetTemplates.prototype.buildAllCategoriesButton = function () {
        var allCategoriesCaption = Dom_1.$$('span', { className: 'coveo-category-facet-all-categories-caption' }, Strings_1.l('AllCategories'));
        var allCategories = Dom_1.$$('li', { className: 'coveo-category-facet-value coveo-category-facet-all-categories' }, this.buildCollapseArrow(), allCategoriesCaption);
        return allCategories;
    };
    CategoryFacetTemplates.prototype.buildEllipsis = function () {
        var ellipsisCaption = Dom_1.$$('span', { className: 'coveo-category-facet-ellipsis-caption' }, '[ ... ]');
        var ellipsis = Dom_1.$$('li', { className: 'coveo-category-facet-ellipsis' }, ellipsisCaption);
        return ellipsis;
    };
    CategoryFacetTemplates.prototype.buildCollapseArrow = function () {
        return this.collapseArrow.clone(true);
    };
    CategoryFacetTemplates.prototype.createListElement = function (data) {
        return "<li class=\"coveo-category-facet-value\">\n        <label class=\"coveo-category-facet-value-label\">\n          <span title=\"" + underscore_1.escape(data.value) + "\" class=\"coveo-category-facet-value-caption\">" + underscore_1.escape(data.value) + "</span>\n          <span class=\"coveo-category-facet-value-count\">" + data.count + "</span>\n        </label>\n      </li>";
    };
    return CategoryFacetTemplates;
}());
exports.CategoryFacetTemplates = CategoryFacetTemplates;


/***/ }),

/***/ 491:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryValueChildrenRenderer_1 = __webpack_require__(366);
var CategoryValueRoot = /** @class */ (function () {
    function CategoryValueRoot(element, categoryFacetTemplates, categoryFacet) {
        this.element = element;
        this.path = [];
        this.categoryChildrenValueRenderer = new CategoryValueChildrenRenderer_1.CategoryChildrenValueRenderer(element, categoryFacetTemplates, this, categoryFacet);
        this.listRoot = categoryFacetTemplates.buildListRoot();
        this.appendListRoot();
    }
    CategoryValueRoot.prototype.renderChildren = function (values) {
        this.appendListRoot();
        this.categoryChildrenValueRenderer.renderChildren(values);
    };
    CategoryValueRoot.prototype.renderAsParent = function (value) {
        this.appendListRoot();
        return this.categoryChildrenValueRenderer.renderAsParent(value);
    };
    Object.defineProperty(CategoryValueRoot.prototype, "children", {
        get: function () {
            return this.categoryChildrenValueRenderer.children;
        },
        enumerable: true,
        configurable: true
    });
    CategoryValueRoot.prototype.clear = function () {
        this.listRoot.detach();
        this.listRoot.empty();
        this.categoryChildrenValueRenderer.clearChildren();
    };
    CategoryValueRoot.prototype.appendListRoot = function () {
        this.element.append(this.listRoot.el);
    };
    return CategoryValueRoot;
}());
exports.CategoryValueRoot = CategoryValueRoot;


/***/ }),

/***/ 492:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var CategoryValueChildrenRenderer_1 = __webpack_require__(366);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var AccessibleButton_1 = __webpack_require__(17);
var Strings_1 = __webpack_require__(7);
var CategoryValue = /** @class */ (function () {
    function CategoryValue(listRoot, categoryValueDescriptor, categoryFacetTemplates, categoryFacet) {
        this.listRoot = listRoot;
        this.categoryValueDescriptor = categoryValueDescriptor;
        this.categoryFacetTemplates = categoryFacetTemplates;
        this.categoryFacet = categoryFacet;
        this.isActive = false;
        this.element = this.categoryFacetTemplates.buildListElement({
            value: this.categoryValueDescriptor.value,
            count: this.categoryValueDescriptor.count
        });
        this.collapseArrow = this.categoryFacetTemplates.buildCollapseArrow();
        this.categoryChildrenValueRenderer = new CategoryValueChildrenRenderer_1.CategoryChildrenValueRenderer(this.element, categoryFacetTemplates, this, this.categoryFacet);
        this.path = this.categoryValueDescriptor.path;
    }
    CategoryValue.prototype.render = function (isChild) {
        if (this.pastMaximumDepth()) {
            this.element.addClass('coveo-category-facet-last-value');
        }
        if (isChild) {
            this.element.addClass('coveo-category-facet-child-value');
        }
        else {
            this.element.addClass('coveo-category-facet-parent-value');
        }
        this.listRoot.append(this.element.el);
    };
    CategoryValue.prototype.getDescriptor = function () {
        return {
            value: this.categoryValueDescriptor.value,
            count: this.categoryValueDescriptor.count,
            path: this.path
        };
    };
    CategoryValue.prototype.clear = function () {
        this.element.detach();
        this.categoryChildrenValueRenderer.clearChildren();
    };
    CategoryValue.prototype.renderChildren = function (values) {
        this.isActive = true;
        this.element.addClass('coveo-active-category-facet-parent');
        this.categoryChildrenValueRenderer.renderChildren(values);
    };
    CategoryValue.prototype.renderAsParent = function (value) {
        return this.categoryChildrenValueRenderer.renderAsParent(value);
    };
    Object.defineProperty(CategoryValue.prototype, "children", {
        get: function () {
            return this.categoryChildrenValueRenderer.children;
        },
        enumerable: true,
        configurable: true
    });
    CategoryValue.prototype.makeSelectable = function () {
        var _this = this;
        this.label = Dom_1.$$(this.element.find('.coveo-category-facet-value-label'));
        this.label.addClass('coveo-selectable');
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.label)
            .withSelectAction(function () { return _this.onSelect(); })
            .withLabel(Strings_1.l(this.categoryValueDescriptor.value) + " " + this.categoryValueDescriptor.count)
            .build();
        return this;
    };
    CategoryValue.prototype.showCollapseArrow = function () {
        if (!this.collapseArrow.el.parentElement) {
            var label = this.element.find('label');
            Dom_1.$$(label).prepend(this.collapseArrow.el);
        }
        return this;
    };
    CategoryValue.prototype.onSelect = function () {
        if (!this.pastMaximumDepth()) {
            this.categoryFacet.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect, this.path);
            this.categoryFacet.changeActivePath(this.path);
            this.categoryFacet.executeQuery();
        }
    };
    CategoryValue.prototype.pastMaximumDepth = function () {
        return this.path.length - this.categoryFacet.options.basePath.length >= this.categoryFacet.options.maximumDepth;
    };
    return CategoryValue;
}());
exports.CategoryValue = CategoryValue;


/***/ }),

/***/ 493:
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
var AllowedValuesPatternType_1 = __webpack_require__(328);
var Utils_1 = __webpack_require__(4);
var CategoryFacetQueryController = /** @class */ (function () {
    function CategoryFacetQueryController(categoryFacet) {
        this.categoryFacet = categoryFacet;
    }
    CategoryFacetQueryController.prototype.putCategoryFacetInQueryBuilder = function (queryBuilder, path, maximumNumberOfValues) {
        var positionInQuery = queryBuilder.categoryFacets.length;
        if (path.length != 0) {
            queryBuilder.advancedExpression.addFieldExpression(this.categoryFacet.options.field, '==', [
                path.join(this.categoryFacet.options.delimitingCharacter)
            ]);
        }
        var categoryFacetsRequest = {
            field: this.categoryFacet.options.field,
            path: path,
            injectionDepth: this.categoryFacet.options.injectionDepth,
            maximumNumberOfValues: maximumNumberOfValues,
            delimitingCharacter: this.categoryFacet.options.delimitingCharacter
        };
        queryBuilder.categoryFacets.push(categoryFacetsRequest);
        return positionInQuery;
    };
    CategoryFacetQueryController.prototype.searchFacetValues = function (value, numberOfValues) {
        return __awaiter(this, void 0, void 0, function () {
            var lastQuery, groupByRequest, results, sortByNumberOfResultsThenPathLength;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastQuery = __assign({}, this.categoryFacet.queryController.getLastQuery());
                        groupByRequest = {
                            allowedValues: ["*" + value + "*"],
                            allowedValuesPatternType: AllowedValuesPatternType_1.AllowedValuesPatternType.Wildcards,
                            maximumNumberOfValues: numberOfValues,
                            field: this.categoryFacet.options.field,
                            sortCriteria: 'occurrences',
                            injectionDepth: this.categoryFacet.options.injectionDepth
                        };
                        lastQuery.groupBy = [groupByRequest];
                        lastQuery.categoryFacets.splice(this.categoryFacet.positionInQuery, 1);
                        return [4 /*yield*/, this.categoryFacet.queryController.getEndpoint().search(lastQuery)];
                    case 1:
                        results = _a.sent();
                        sortByNumberOfResultsThenPathLength = function (firstGroupByValue, secondGroupByValue) {
                            if (firstGroupByValue.numberOfResults == secondGroupByValue.numberOfResults) {
                                return firstGroupByValue.value.length - secondGroupByValue.value.length;
                            }
                            return secondGroupByValue.numberOfResults - firstGroupByValue.numberOfResults;
                        };
                        return [2 /*return*/, results.groupByResults[0].values.sort(sortByNumberOfResultsThenPathLength)];
                }
            });
        });
    };
    CategoryFacetQueryController.prototype.addDebugGroupBy = function (queryBuilder, value) {
        queryBuilder.groupByRequests.push({
            field: this.categoryFacet.options.field,
            allowedValues: [".*" + Utils_1.Utils.escapeRegexCharacter(value) + ".*"],
            allowedValuesPatternType: AllowedValuesPatternType_1.AllowedValuesPatternType.Regex
        });
    };
    return CategoryFacetQueryController;
}());
exports.CategoryFacetQueryController = CategoryFacetQueryController;


/***/ }),

/***/ 494:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 495:
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
var FacetSearchElement_1 = __webpack_require__(331);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var Strings_1 = __webpack_require__(7);
__webpack_require__(496);
var StringUtils_1 = __webpack_require__(19);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var AccessibleButton_1 = __webpack_require__(17);
var CategoryFacetSearch = /** @class */ (function () {
    function CategoryFacetSearch(categoryFacet) {
        var _this = this;
        this.categoryFacet = categoryFacet;
        this.moreValuesToFetch = true;
        this.facetSearchElement = new FacetSearchElement_1.FacetSearchElement(this);
        this.displayNewValues = underscore_1.debounce(this.getDisplayNewValuesFunction(), this.categoryFacet.options.facetSearchDelay);
        this.categoryFacet.root.addEventListener('click', function (e) { return _this.handleClickElsewhere(e); });
        this.numberOfValuesToFetch = this.categoryFacet.options.numberOfResultsInFacetSearch;
    }
    CategoryFacetSearch.prototype.build = function () {
        var _this = this;
        this.container = Dom_1.$$('div', {
            className: 'coveo-category-facet-search-container',
            role: 'heading',
            'aria-level': 3
        });
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.container)
            .withSelectAction(function () {
            Dom_1.$$(_this.categoryFacet.element).addClass('coveo-category-facet-searching');
            _this.focus();
        })
            .withLabel(Strings_1.l('Search'))
            .build();
        var search = this.facetSearchElement.build();
        var searchPlaceholder = this.buildfacetSearchPlaceholder();
        this.container.append(search);
        this.container.append(searchPlaceholder.el);
        return this.container;
    };
    CategoryFacetSearch.prototype.focus = function () {
        this.facetSearchElement.focus();
    };
    CategoryFacetSearch.prototype.clear = function () {
        this.dismissSearchResults();
        this.container && this.container.detach();
    };
    CategoryFacetSearch.prototype.dismissSearchResults = function () {
        this.removeNoResultsCssClasses();
        Dom_1.$$(this.categoryFacet.element).removeClass('coveo-category-facet-searching');
        Dom_1.$$(this.facetSearchElement.searchResults).empty();
        this.facetSearchElement.clearSearchInput();
        this.facetSearchElement.hideSearchResultsElement();
        this.currentlyDisplayedResults = null;
        this.numberOfValuesToFetch = this.categoryFacet.options.numberOfResultsInFacetSearch;
        this.moreValuesToFetch = true;
    };
    CategoryFacetSearch.prototype.keyboardEventDefaultHandler = function () {
        this.moreValuesToFetch = true;
        this.displayNewValues();
    };
    CategoryFacetSearch.prototype.keyboardNavigationEnterPressed = function () {
        this.selectCurrentResult();
    };
    CategoryFacetSearch.prototype.fetchMoreValues = function () {
        this.numberOfValuesToFetch += this.categoryFacet.options.numberOfResultsInFacetSearch;
        this.displayNewValues();
    };
    CategoryFacetSearch.prototype.getCaptions = function () {
        var searchResults = Dom_1.$$(this.facetSearchElement.searchResults);
        var captions = searchResults
            .findAll('.coveo-category-facet-search-value-caption')
            .concat(searchResults.findAll('.coveo-category-facet-search-path-parents'))
            .concat(searchResults.findAll('.coveo-category-facet-search-path-last-value'));
        return captions;
    };
    CategoryFacetSearch.prototype.selectCurrentResult = function () {
        if (this.facetSearchElement.currentResult) {
            var currentResultPathData = this.facetSearchElement.currentResult.el.dataset.path;
            var delimiter = this.categoryFacet.options.delimitingCharacter;
            var path = currentResultPathData.split(delimiter);
            this.categoryFacet.changeActivePath(path);
            this.categoryFacet.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect, path);
            this.categoryFacet.executeQuery();
        }
    };
    CategoryFacetSearch.prototype.handleClickElsewhere = function (e) {
        if (!Dom_1.$$(e.target).closest('.coveo-category-facet-search-container')) {
            this.dismissSearchResults();
        }
    };
    CategoryFacetSearch.prototype.buildfacetSearchPlaceholder = function () {
        var placeholder = Dom_1.$$('div', { className: 'coveo-category-facet-search-placeholder' });
        var icon = Dom_1.$$('div', { className: 'coveo-category-facet-search-icon' }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, 'coveo-category-facet-search-icon-svg');
        var label = Dom_1.$$('span', { className: 'coveo-category-facet-search-label' }, Strings_1.l('Search'));
        placeholder.append(icon.el);
        placeholder.append(label.el);
        return placeholder;
    };
    CategoryFacetSearch.prototype.getDisplayNewValuesFunction = function () {
        var _this = this;
        return function () { return __awaiter(_this, void 0, void 0, function () {
            var categoryFacetValues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.facetSearchElement.showFacetSearchWaitingAnimation();
                        this.categoryFacet.logger.info('Triggering new Category Facet search');
                        return [4 /*yield*/, this.categoryFacet.categoryFacetQueryController.searchFacetValues(this.facetSearchElement.input.value, this.numberOfValuesToFetch)];
                    case 1:
                        categoryFacetValues = _a.sent();
                        this.logAnalyticsEvent();
                        if (categoryFacetValues.length < this.numberOfValuesToFetch) {
                            this.moreValuesToFetch = false;
                        }
                        if (categoryFacetValues.length == 0) {
                            this.noFacetSearchResults();
                            return [2 /*return*/];
                        }
                        this.removeNoResultsCssClasses();
                        this.setFacetSearchResults(categoryFacetValues);
                        if (this.shouldPositionSearchResults) {
                            this.facetSearchElement.positionSearchResults(this.categoryFacet.root, this.categoryFacet.element.clientWidth, this.facetSearchElement.search);
                        }
                        this.facetSearchElement.hideFacetSearchWaitingAnimation();
                        return [2 /*return*/];
                }
            });
        }); };
    };
    CategoryFacetSearch.prototype.setFacetSearchResults = function (categoryFacetValues) {
        Dom_1.$$(this.facetSearchElement.searchResults).empty();
        this.currentlyDisplayedResults = underscore_1.pluck(categoryFacetValues, 'value');
        for (var i = 0; i < categoryFacetValues.length; i++) {
            var searchResult = this.buildFacetSearchValue(categoryFacetValues[i]);
            if (i == 0) {
                this.facetSearchElement.setAsCurrentResult(searchResult);
            }
            this.facetSearchElement.appendToSearchResults(searchResult.el);
        }
        this.highlightCurrentQueryWithinSearchResults();
    };
    CategoryFacetSearch.prototype.buildFacetSearchValue = function (categoryFacetValue) {
        var _this = this;
        var path = categoryFacetValue.value.split(this.categoryFacet.options.delimitingCharacter);
        var pathParents = path.slice(0, -1).length != 0 ? path.slice(0, -1).join('/') + "/" : '';
        var value = Dom_1.$$('span', { className: 'coveo-category-facet-search-value-caption' }, underscore_1.last(path));
        var number = Dom_1.$$('span', { className: 'coveo-category-facet-search-value-number' }, categoryFacetValue.numberOfResults.toString(10));
        var pathParentsCaption = Dom_1.$$('span', { className: 'coveo-category-facet-search-path-parents' }, pathParents);
        var pathToValueCaption = Dom_1.$$('span', { className: 'coveo-category-facet-search-path' }, pathParentsCaption);
        var firstRow = Dom_1.$$('div', { className: 'coveo-category-facet-search-first-row' }, value, number);
        var secondRow = Dom_1.$$('div', { className: 'coveo-category-facet-search-second-row' }, pathToValueCaption);
        var item = Dom_1.$$('li', {
            className: 'coveo-category-facet-search-value',
            title: path
        }, firstRow, secondRow);
        item.el.dataset.path = categoryFacetValue.value;
        new AccessibleButton_1.AccessibleButton()
            .withElement(item)
            .withSelectAction(function () {
            _this.categoryFacet.changeActivePath(path);
            _this.categoryFacet.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect, path);
            _this.categoryFacet.executeQuery();
        })
            .withLabel(Strings_1.l(underscore_1.last(path)) + " " + categoryFacetValue.numberOfResults)
            .build();
        return item;
    };
    CategoryFacetSearch.prototype.noFacetSearchResults = function () {
        this.facetSearchElement.hideFacetSearchWaitingAnimation();
        this.facetSearchElement.hideSearchResultsElement();
        Dom_1.$$(this.facetSearchElement.search).addClass('coveo-facet-search-no-results');
        Dom_1.$$(this.categoryFacet.element).addClass('coveo-no-results');
    };
    CategoryFacetSearch.prototype.removeNoResultsCssClasses = function () {
        this.facetSearchElement.search && Dom_1.$$(this.facetSearchElement.search).removeClass('coveo-facet-search-no-results');
        Dom_1.$$(this.categoryFacet.element).removeClass('coveo-no-results');
    };
    CategoryFacetSearch.prototype.highlightCurrentQueryWithinSearchResults = function () {
        var regex = new RegExp("(" + StringUtils_1.StringUtils.stringToRegex(this.facetSearchElement.input.value, true) + ")", 'ig');
        this.facetSearchElement.highlightCurrentQueryInSearchResults(regex);
    };
    CategoryFacetSearch.prototype.logAnalyticsEvent = function () {
        this.categoryFacet.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSearch, {
            categoryFacetId: this.categoryFacet.options.id,
            categoryFacetTitle: this.categoryFacet.options.title
        }, this.categoryFacet.root);
    };
    Object.defineProperty(CategoryFacetSearch.prototype, "shouldPositionSearchResults", {
        get: function () {
            var searchResults = this.facetSearchElement.searchResults;
            return searchResults && !searchResults.parentElement;
        },
        enumerable: true,
        configurable: true
    });
    return CategoryFacetSearch;
}());
exports.CategoryFacetSearch = CategoryFacetSearch;


/***/ }),

/***/ 496:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 497:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var CategoryFacetBreadcrumb = /** @class */ (function () {
    function CategoryFacetBreadcrumb(categoryFacetTitle, onClickHandler, categoryValueDescriptor) {
        this.categoryFacetTitle = categoryFacetTitle;
        this.onClickHandler = onClickHandler;
        this.categoryValueDescriptor = categoryValueDescriptor;
    }
    CategoryFacetBreadcrumb.prototype.build = function () {
        var clear = Dom_1.$$('span', {
            className: 'coveo-facet-breadcrumb-clear'
        }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
        SVGDom_1.SVGDom.addClassToSVGInContainer(clear.el, 'coveo-facet-breadcrumb-clear-svg');
        var title = this.categoryValueDescriptor.value + " " + this.categoryValueDescriptor.count;
        var breadcrumbTitle = Dom_1.$$('span', { className: 'coveo-category-facet-breadcrumb-title' }, this.categoryFacetTitle + ": ");
        var values = Dom_1.$$('span', { className: 'coveo-category-facet-breadcrumb-values' }, this.categoryValueDescriptor.path.join('/'), clear);
        var breadcrumb = Dom_1.$$('span', { className: 'coveo-category-facet-breadcrumb', title: title }, breadcrumbTitle, values);
        breadcrumb.on('click', this.onClickHandler);
        return breadcrumb.el;
    };
    return CategoryFacetBreadcrumb;
}());
exports.CategoryFacetBreadcrumb = CategoryFacetBreadcrumb;


/***/ }),

/***/ 498:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryFacet_1 = __webpack_require__(145);
var QueryEvents_1 = __webpack_require__(10);
var underscore_1 = __webpack_require__(0);
var Logger_1 = __webpack_require__(11);
var PathMap = /** @class */ (function () {
    function PathMap() {
    }
    return PathMap;
}());
var CategoryFacetDebug = /** @class */ (function () {
    function CategoryFacetDebug(categoryFacet) {
        var _this = this;
        this.categoryFacet = categoryFacet;
        this.categoryFacet.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        this.categoryFacet.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) {
            _this.handleQuerySuccess(args);
        });
    }
    CategoryFacetDebug.prototype.handleBuildingQuery = function (args) {
        var firstPositionInQuery = args.queryBuilder.groupByRequests.length;
        if (this.categoryFacet.activePath.length == 0) {
            this.positionInQuery = { start: firstPositionInQuery, end: firstPositionInQuery + 1 };
            this.addGroupByForEmptyPath(args.queryBuilder);
        }
        else {
            var path = this.categoryFacet.activePath;
            this.positionInQuery = { start: firstPositionInQuery, end: firstPositionInQuery + path.length };
            this.addGroupByForEachPathElement(args.queryBuilder, path);
        }
    };
    CategoryFacetDebug.prototype.handleQuerySuccess = function (args) {
        var _this = this;
        args.results.groupByResults
            .slice(this.positionInQuery.start, this.positionInQuery.end)
            .forEach(function (groupByResult) { return CategoryFacetDebug.analyzeResults(groupByResult, _this.categoryFacet.options.delimitingCharacter); });
    };
    CategoryFacetDebug.prototype.addGroupByForEmptyPath = function (queryBuilder) {
        queryBuilder.groupByRequests.push({
            field: this.categoryFacet.options.field,
            injectionDepth: this.categoryFacet.options.injectionDepth
        });
    };
    CategoryFacetDebug.prototype.addGroupByForEachPathElement = function (queryBuilder, path) {
        var _this = this;
        path.forEach(function (pathElement) {
            _this.categoryFacet.categoryFacetQueryController.addDebugGroupBy(queryBuilder, pathElement);
        });
    };
    CategoryFacetDebug.analyzeResults = function (groupByResults, delimiter) {
        var _this = this;
        var treeRoot = new Map();
        var orphans = [];
        var paths = this.buildPathsFromGroupByValues(groupByResults.values, delimiter);
        paths = underscore_1.sortBy(paths, function (value) { return value.length; });
        paths.forEach(function (path) {
            if (path.length == 1) {
                _this.addFirstNodeToTree(treeRoot, path);
            }
            else {
                var pathIsValid = true;
                var parentsOnly = path.slice(0, -1);
                var currentNode = treeRoot;
                for (var _i = 0, parentsOnly_1 = parentsOnly; _i < parentsOnly_1.length; _i++) {
                    var parent_1 = parentsOnly_1[_i];
                    currentNode = currentNode.get(parent_1);
                    if (!currentNode) {
                        _this.processOrphan(orphans, path, delimiter);
                        pathIsValid = false;
                        break;
                    }
                }
                if (pathIsValid) {
                    _this.addValidNodeToTree(currentNode, path);
                }
            }
        });
        return orphans;
    };
    CategoryFacetDebug.buildPathsFromGroupByValues = function (values, delimiter) {
        return underscore_1.chain(values)
            .pluck('value')
            .map(function (value) { return value.split(delimiter); })
            .sortBy(function (value) { return value.length; })
            .value();
    };
    CategoryFacetDebug.addFirstNodeToTree = function (treeRoot, path) {
        treeRoot.set(path[0], new Map());
    };
    CategoryFacetDebug.addValidNodeToTree = function (node, path) {
        node.set(path.slice(-1)[0], new Map());
    };
    CategoryFacetDebug.processOrphan = function (orphans, path, delimiter) {
        var formattedOrphan = path.join(delimiter);
        orphans.push(formattedOrphan);
        this.logger.error("Value " + formattedOrphan + " has no parent.");
    };
    CategoryFacetDebug.logger = new Logger_1.Logger(CategoryFacet_1.CategoryFacet);
    return CategoryFacetDebug;
}());
exports.CategoryFacetDebug = CategoryFacetDebug;


/***/ })

});
//# sourceMappingURL=CategoryFacet__f056675ccb969b1e6859.js.map