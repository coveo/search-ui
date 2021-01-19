webpackJsonpCoveo__temporary([5,1,6,17,84],{

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

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(5);
var Utils_1 = __webpack_require__(4);
var Globalize = __webpack_require__(23);
var underscore_1 = __webpack_require__(0);
/**
 * A class which holds information and operation available on a single facet value returned by a {@link IGroupByRequest}.<br/>
 * This class is used extensively in the {@link Facet} component.
 */
var FacetValue = /** @class */ (function () {
    function FacetValue() {
        this.selected = false;
        this.excluded = false;
        this.waitingForDelta = false;
    }
    FacetValue.prototype.reset = function () {
        this.selected = false;
        this.excluded = false;
    };
    FacetValue.prototype.updateCountsFromNewValue = function (newValue) {
        Assert_1.Assert.exists(newValue);
        this.occurrences = newValue.occurrences;
        this.delta = newValue.delta;
        this.computedField = newValue.computedField;
    };
    FacetValue.prototype.clone = function () {
        this.computedField = undefined;
        this.delta = undefined;
        return this;
    };
    FacetValue.prototype.cloneWithZeroOccurrences = function () {
        this.occurrences = 0;
        return this.clone();
    };
    FacetValue.prototype.cloneWithDelta = function (count, delta) {
        Assert_1.Assert.isLargerOrEqualsThan(0, count);
        var clone = this.cloneWithZeroOccurrences();
        clone.delta = delta;
        clone.occurrences = count;
        return clone;
    };
    FacetValue.prototype.getFormattedCount = function () {
        var count = undefined;
        if (Utils_1.Utils.exists(this.delta) && this.delta > 0) {
            count = '+' + Globalize.format(this.delta, 'n0');
        }
        else {
            if (this.occurrences > 0) {
                count = Globalize.format(this.occurrences, 'n0');
            }
        }
        return count;
    };
    FacetValue.prototype.getFormattedComputedField = function (format) {
        if (this.computedField != 0) {
            return Globalize.format(this.computedField, format);
        }
        else {
            return undefined;
        }
    };
    FacetValue.create = function (value) {
        if (underscore_1.isString(value)) {
            return FacetValue.createFromValue(value);
        }
        else if (underscore_1.isObject(value)) {
            if ('computedFieldResults' in value) {
                return FacetValue.createFromGroupByValue(value);
            }
            else {
                return FacetValue.createFromFieldValue(value);
            }
        }
        else {
            throw new Error("Can't create value from " + value);
        }
    };
    FacetValue.createFromValue = function (value) {
        Assert_1.Assert.isNonEmptyString(value);
        var facetValue = new FacetValue();
        facetValue.value = value;
        facetValue.lookupValue = value;
        return facetValue;
    };
    FacetValue.createFromGroupByValue = function (groupByValue) {
        Assert_1.Assert.exists(groupByValue);
        Assert_1.Assert.exists(groupByValue);
        var facetValue = new FacetValue();
        facetValue.value = groupByValue.value;
        facetValue.lookupValue = Utils_1.Utils.exists(groupByValue.lookupValue) ? groupByValue.lookupValue : groupByValue.value;
        facetValue.occurrences = groupByValue.numberOfResults;
        facetValue.computedField = Utils_1.Utils.isNonEmptyArray(groupByValue.computedFieldResults) ? groupByValue.computedFieldResults[0] : undefined;
        facetValue.score = groupByValue.score;
        return facetValue;
    };
    FacetValue.createFromFieldValue = function (fieldValue) {
        Assert_1.Assert.exists(fieldValue);
        var facetValue = new FacetValue();
        facetValue.value = fieldValue.value;
        facetValue.lookupValue = fieldValue.lookupValue;
        facetValue.occurrences = fieldValue.numberOfResults;
        return facetValue;
    };
    return FacetValue;
}());
exports.FacetValue = FacetValue;


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

/***/ 127:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
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
var ValueElement_1 = __webpack_require__(468);
var FacetValueElement = /** @class */ (function (_super) {
    __extends(FacetValueElement, _super);
    function FacetValueElement(facet, facetValue, keepDisplayedValueNextTime) {
        var _this = _super.call(this, facet, facetValue) || this;
        _this.facet = facet;
        _this.facetValue = facetValue;
        _this.keepDisplayedValueNextTime = keepDisplayedValueNextTime;
        return _this;
    }
    FacetValueElement.prototype.bindEvent = function () {
        _super.prototype.bindEvent.call(this, {
            displayNextTime: this.keepDisplayedValueNextTime,
            pinFacet: this.facet.options.preservePosition
        });
    };
    return FacetValueElement;
}(ValueElement_1.ValueElement));
exports.FacetValueElement = FacetValueElement;


/***/ }),

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = __webpack_require__(4);
var FacetUtils_1 = __webpack_require__(39);
var QueryBuilder_1 = __webpack_require__(46);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var AllowedValuesPatternType_1 = __webpack_require__(467);
var FacetSearchParameters = /** @class */ (function () {
    function FacetSearchParameters(facet) {
        this.facet = facet;
        this.valueToSearch = '';
        this.alwaysInclude = [];
        this.alwaysExclude = [];
        this.sortCriteria = 'occurrences';
        this.fetchMore = false;
        this.completeFacetWithStandardValues = true;
        this.nbResults = facet.options.numberOfValuesInFacetSearch;
        this.ignoreAccents = facet.options.facetSearchIgnoreAccents;
    }
    FacetSearchParameters.prototype.setValueToSearch = function (value) {
        this.valueToSearch = value;
        if (Utils_1.Utils.isNonEmptyString(value)) {
            this.valueToSearch = this.valueToSearch.trim();
            this.alwaysInclude = this.alwaysInclude.concat(FacetUtils_1.FacetUtils.getValuesToUseForSearchInFacet(this.valueToSearch, this.facet));
        }
        return this;
    };
    FacetSearchParameters.prototype.excludeCurrentlyDisplayedValuesInSearch = function (searchResults) {
        var _this = this;
        _.each(this.getCurrentlyShowedValueInSearch(searchResults), function (v) {
            var expandedValues = FacetUtils_1.FacetUtils.getValuesToUseForSearchInFacet(v, _this.facet);
            _.each(expandedValues, function (expanded) {
                _this.alwaysExclude.push(expanded);
            });
        });
        _.each(this.facet.getDisplayedFacetValues(), function (v) {
            _this.alwaysExclude.push(v.value);
        });
    };
    FacetSearchParameters.prototype.getGroupByRequest = function () {
        this.lowerCaseAll();
        var nbResults = this.nbResults;
        nbResults += this.alwaysExclude.length;
        var typedByUser = [];
        if (this.valueToSearch) {
            typedByUser = ['*' + this.valueToSearch + '*'];
        }
        var allowedValues;
        if (this.valueToSearch) {
            allowedValues = typedByUser.concat(this.alwaysInclude).concat(this.alwaysExclude);
        }
        else {
            allowedValues = _.compact(typedByUser.concat(this.alwaysInclude).concat(this.facet.options.allowedValues));
        }
        var completeFacetWithStandardValues = this.completeFacetWithStandardValues;
        if (this.facet.options.lookupField != null) {
            completeFacetWithStandardValues = false;
        }
        var request = {
            allowedValues: allowedValues,
            allowedValuesPatternType: this.facet.options.useWildcardsInFacetSearch
                ? AllowedValuesPatternType_1.AllowedValuesPatternType.Wildcards
                : AllowedValuesPatternType_1.AllowedValuesPatternType.Legacy,
            maximumNumberOfValues: nbResults,
            completeFacetWithStandardValues: completeFacetWithStandardValues,
            field: this.facet.options.field,
            sortCriteria: this.facet.options.sortCriteria || this.sortCriteria,
            injectionDepth: this.facet.options.injectionDepth
        };
        if (this.facet.options.lookupField) {
            request.lookupField = this.facet.options.lookupField;
        }
        if (this.facet.options.computedField) {
            request.computedFields = [
                {
                    field: this.facet.options.computedField,
                    operation: this.facet.options.computedFieldOperation
                }
            ];
        }
        return request;
    };
    FacetSearchParameters.prototype.getQuery = function () {
        var lastQuery = _.clone(this.facet.queryController.getLastQuery());
        if (!lastQuery) {
            // There should normally always be a last query available
            // If not, just create an empty one.
            lastQuery = new QueryBuilder_1.QueryBuilder().build();
        }
        // We want to always force query syntax to true for a facet search,
        // but arrange for the basic expression to adapt itself with no syntax block
        if (lastQuery.enableQuerySyntax) {
            lastQuery.q = this.facet.facetQueryController.basicExpressionToUseForFacetSearch;
        }
        else if (Utils_1.Utils.isNonEmptyString(this.facet.facetQueryController.basicExpressionToUseForFacetSearch)) {
            lastQuery.q = "<@- " + this.facet.facetQueryController.basicExpressionToUseForFacetSearch + " -@>";
        }
        else {
            lastQuery.q = '';
        }
        lastQuery.enableQuerySyntax = true;
        lastQuery.cq = this.facet.facetQueryController.constantExpressionToUseForFacetSearch;
        lastQuery.aq = this.facet.facetQueryController.advancedExpressionToUseForFacetSearch;
        lastQuery.enableDidYouMean = false;
        lastQuery.firstResult = 0;
        lastQuery.numberOfResults = 0;
        lastQuery.fieldsToInclude = [];
        lastQuery.groupBy = [this.getGroupByRequest()];
        return lastQuery;
    };
    FacetSearchParameters.prototype.getCurrentlyShowedValueInSearch = function (searchResults) {
        return _.map(Dom_1.$$(searchResults).findAll('.coveo-facet-value-caption'), function (val) {
            return Dom_1.$$(val).getAttribute('data-original-value') || Dom_1.$$(val).text();
        });
    };
    FacetSearchParameters.prototype.lowerCaseAll = function () {
        this.alwaysExclude = _.chain(this.alwaysExclude)
            .map(function (v) {
            return v.toLowerCase();
        })
            .uniq()
            .value();
        this.alwaysInclude = _.chain(this.alwaysInclude)
            .map(function (v) {
            return v.toLowerCase();
        })
            .uniq()
            .value();
    };
    return FacetSearchParameters;
}());
exports.FacetSearchParameters = FacetSearchParameters;


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

/***/ 174:
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
var Facet_1 = __webpack_require__(67);
var ResponsiveFacets = /** @class */ (function (_super) {
    __extends(ResponsiveFacets, _super);
    function ResponsiveFacets() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResponsiveFacets.init = function (root, component, options) {
        ResponsiveFacetColumn_1.ResponsiveFacetColumn.init(ResponsiveFacets, root, component, options, Facet_1.Facet.ID);
    };
    return ResponsiveFacets;
}(ResponsiveFacetColumn_1.ResponsiveFacetColumn));
exports.ResponsiveFacets = ResponsiveFacets;


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

/***/ 186:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path='../Facet/Facet.ts' />
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
Object.defineProperty(exports, "__esModule", { value: true });
var Facet_1 = __webpack_require__(67);
var ComponentOptions_1 = __webpack_require__(8);
var TemplateHelpers_1 = __webpack_require__(115);
var FacetRangeQueryController_1 = __webpack_require__(567);
var Initialization_1 = __webpack_require__(2);
var Globalize = __webpack_require__(23);
var GlobalExports_1 = __webpack_require__(3);
var ResponsiveFacetOptions_1 = __webpack_require__(82);
var ResponsiveFacets_1 = __webpack_require__(174);
var underscore_1 = __webpack_require__(0);
/**
 * A `FacetRange` is a [facet](https://docs.coveo.com/en/198/) whose values are expressed as ranges.
 *
 * You must set the [`field`]{@link Facet.options.field} option to a value targeting a numeric or date [field](https://docs.coveo.com/en/200/) in your index for this component to work.
 *
 * This component extends the [`Facet`]{@link Facet} component and supports all `Facet` options except:
 *
 * - **Settings** menu options
 *   - [`enableSettings`]{@link Facet.options.enableSettings}
 *   - [`enableSettingsFacetState`]{@link Facet.options.enableSettingsFacetState}
 *   - [`enableCollapse`]{@link Facet.options.enableCollapse}
 *   - [`availableSorts`]{@link Facet.options.availableSorts}
 *   - [`customSort`]{@link Facet.options.customSort}
 *   - [`computedFieldCaption`]{@link Facet.options.computedFieldCaption}
 * - **Facet Search** options
 *   - [`enableFacetSearch`]{@link Facet.options.enableFacetSearch}
 *   - [`facetSearchDelay`]{@link Facet.options.facetSearchDelay}
 *   - [`facetSearchIgnoreAccents`]{@link Facet.options.facetSearchIgnoreAccents}
 *   - [`numberOfValuesInFacetSearch`]{@link Facet.options.numberOfValuesInFacetSearch}
 * - **More and Less** options
 *   - [`enableMoreLess`]{@link Facet.options.enableMoreLess}
 *   - [`pageSize`]{@link Facet.options.pageSize}
 *
 *  @notSupportedIn salesforcefree
 */
var FacetRange = /** @class */ (function (_super) {
    __extends(FacetRange, _super);
    /**
     * Creates a new `FacetRange`.
     * @param element The HTML element on which to instantiate the component.
     * @param options The configuration options to apply when creating the component.
     * @param bindings The bindings required by the component.
     */
    function FacetRange(element, options, bindings) {
        var _this = _super.call(this, element, ComponentOptions_1.ComponentOptions.initComponentOptions(element, FacetRange, options), bindings, FacetRange.ID) || this;
        _this.element = element;
        _this.isFieldValueCompatible = false;
        _this.options.enableFacetSearch = false;
        _this.options.enableSettings = false;
        _this.options.includeInOmnibox = false;
        _this.options.enableMoreLess = false;
        ResponsiveFacets_1.ResponsiveFacets.init(_this.root, _this, _this.options);
        return _this;
    }
    FacetRange.prototype.getValueCaption = function (facetValue) {
        if (this.options.valueCaption || this.isLabelSpecifiedForValue(facetValue)) {
            return _super.prototype.getValueCaption.call(this, facetValue);
        }
        return this.translateValuesFromFormat(facetValue);
    };
    FacetRange.prototype.isLabelSpecifiedForValue = function (facetValue) {
        return this.options.ranges && !!underscore_1.find(this.options.ranges, function (range) { return !underscore_1.isUndefined(range.label) && range.label === facetValue.lookupValue; });
    };
    FacetRange.prototype.initFacetQueryController = function () {
        this.facetQueryController = new FacetRangeQueryController_1.FacetRangeQueryController(this);
    };
    FacetRange.prototype.processNewGroupByResults = function (groupByResults) {
        var _this = this;
        if (groupByResults != null && this.options.ranges == null) {
            groupByResults.values.sort(function (valueA, valueB) { return _this.sortRangeGroupByResults(valueA.value, valueB.value); });
        }
        _super.prototype.processNewGroupByResults.call(this, groupByResults);
    };
    FacetRange.prototype.sortRangeGroupByResults = function (valueA, valueB) {
        var startEndA = this.extractStartAndEndValue(valueA);
        var startEndB = this.extractStartAndEndValue(valueB);
        var firstValue;
        var secondValue;
        if (!startEndA) {
            firstValue = valueA;
        }
        else {
            firstValue = startEndA.start;
        }
        if (!startEndB) {
            secondValue = valueB;
        }
        else {
            secondValue = startEndB.start;
        }
        if (this.options.dateField) {
            return Date.parse(firstValue) - Date.parse(secondValue);
        }
        return Number(firstValue) - Number(secondValue);
    };
    FacetRange.prototype.translateValuesFromFormat = function (facetValue) {
        var startAndEnd = this.extractStartAndEndValue(facetValue.lookupValue || facetValue.value);
        if (!startAndEnd) {
            return null;
        }
        return this.formatValue(startAndEnd.start) + " - " + this.formatValue(startAndEnd.end);
    };
    FacetRange.prototype.extractStartAndEndValue = function (value) {
        var startAndEnd = /^(.*)\.\.(.*)$/.exec(value);
        if (startAndEnd == null) {
            return null;
        }
        return {
            start: startAndEnd[1],
            end: startAndEnd[2]
        };
    };
    FacetRange.prototype.formatValue = function (value) {
        var isNumber = !!value.match(/^[\+\-]?[0-9]+(\.[0-9]+)?$/);
        return this.options.dateField || !isNumber ? this.formatDateValue(value) : this.formatNumberValue(Number(value));
    };
    FacetRange.prototype.formatDateValue = function (value) {
        var helper = TemplateHelpers_1.TemplateHelpers.getHelper('dateTime');
        var helperOptions = {
            alwaysIncludeTime: false,
            includeTimeIfThisWeek: false,
            includeTimeIfToday: false,
            omitYearIfCurrentOne: false,
            useTodayYesterdayAndTomorrow: false,
            useWeekdayIfThisWeek: false
        };
        return helper(value, helperOptions);
    };
    FacetRange.prototype.formatNumberValue = function (value) {
        return Globalize.format(value, this.options.valueFormat);
    };
    FacetRange.ID = 'FacetRange';
    FacetRange.parent = Facet_1.Facet;
    FacetRange.doExport = function () {
        GlobalExports_1.exportGlobally({
            FacetRange: FacetRange
        });
    };
    /**
     * The options for the component
     * @componentOptions
     */
    FacetRange.options = __assign({ 
        /**
         * Whether the specified [`field`]{@link Facet.options.field} option value targets a date field in your index.
         *
         * This allows the component to correctly build the outgoing [Group By](https://docs.coveo.com/en/203/).
         *
         * **Default:** `false`.
         */
        dateField: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }), 
        /**
         * The list of [range values]{@link IRangeValue} to request (see [Requesting Specific FacetRange Values](https://docs.coveo.com/en/2790/)).
         *
         * By default, the index automatically generates range values.
         *
         * **Note:**
         * > The index cannot automatically generate range values for a `FacetRange` whose [`field`]{@link Facet.options.field} option value references a dynamic field generated by a [query function](https://docs.coveo.com/en/232/). In such a case, you _must_ use the `ranges` option.
         */
        ranges: ComponentOptions_1.ComponentOptions.buildJsonOption(), 
        /**
         * The format to apply to the range values. Only works for numeric values.
         *
         * Some of the most commonly used formats are:
         *
         * - `c0`: format  a numeric value as currency.
         * - `n0`: formats a numeric value as an integer.
         * - `n2`: formats a numeric value as a floating point number with two decimal digits.
         *
         * The available formats are defined in the [Globalize](https://github.com/klaaspieter/jquery-global#numbers) library.
         *
         * **Note:** This option is ignored when the [`valueCaption`]{@link Facet.options.valueCaption} is defined.
         */
        valueFormat: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'n0' }) }, ResponsiveFacetOptions_1.ResponsiveFacetOptions);
    return FacetRange;
}(Facet_1.Facet));
exports.FacetRange = FacetRange;
Initialization_1.Initialization.registerAutoCreateComponent(FacetRange);


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

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path='../ui/Facet/Facet.ts' />
Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionBuilder_1 = __webpack_require__(72);
var Utils_1 = __webpack_require__(4);
var FacetSearchParameters_1 = __webpack_require__(172);
var Assert_1 = __webpack_require__(5);
var FacetUtils_1 = __webpack_require__(39);
var _ = __webpack_require__(0);
var QueryBuilderExpression_1 = __webpack_require__(182);
var FacetQueryController = /** @class */ (function () {
    function FacetQueryController(facet) {
        this.facet = facet;
    }
    /**
     * Reset the expression for the facet search, used when a new query is triggered
     */
    FacetQueryController.prototype.prepareForNewQuery = function () {
        this.lastGroupByRequestIndex = undefined;
        this.expressionToUseForFacetSearch = undefined;
        this.constantExpressionToUseForFacetSearch = undefined;
    };
    /**
     * Compute the filter expression that the facet needs to output for the query
     * @returns {string}
     */
    FacetQueryController.prototype.computeOurFilterExpression = function () {
        var _this = this;
        var builder = new ExpressionBuilder_1.ExpressionBuilder();
        var selected = this.facet.values.getSelected();
        if (selected.length > 0) {
            if (this.facet.options.useAnd) {
                _.each(selected, function (value) {
                    builder.addFieldExpression(_this.facet.options.field, '==', [value.value]);
                });
            }
            else {
                builder.addFieldExpression(this.facet.options.field, '==', _.map(selected, function (value) { return value.value; }));
            }
        }
        var excluded = this.facet.values.getExcluded();
        if (excluded.length > 0) {
            builder.addFieldNotEqualExpression(this.facet.options.field, _.map(excluded, function (value) { return value.value; }));
        }
        if (Utils_1.Utils.isNonEmptyString(this.facet.options.additionalFilter)) {
            builder.add(this.facet.options.additionalFilter);
        }
        return builder.build();
    };
    /**
     * Build the group by request for the facet, and insert it in the query builder
     * @param queryBuilder
     */
    FacetQueryController.prototype.putGroupByIntoQueryBuilder = function (queryBuilder) {
        Assert_1.Assert.exists(queryBuilder);
        var allowedValues = this.createGroupByAllowedValues();
        var groupByRequest = this.createBasicGroupByRequest(allowedValues);
        var queryOverrideObject = this.createGroupByQueryOverride(queryBuilder);
        if (!Utils_1.Utils.isNullOrUndefined(queryOverrideObject) || !QueryBuilderExpression_1.QueryBuilderExpression.isEmpty(queryOverrideObject)) {
            groupByRequest.queryOverride = queryOverrideObject.basic;
            groupByRequest.advancedQueryOverride = queryOverrideObject.advanced;
            groupByRequest.constantQueryOverride = queryOverrideObject.constant;
            this.expressionToUseForFacetSearch = queryOverrideObject.withoutConstant;
            this.basicExpressionToUseForFacetSearch = queryOverrideObject.basic;
            this.advancedExpressionToUseForFacetSearch = queryOverrideObject.advanced;
            this.constantExpressionToUseForFacetSearch = queryOverrideObject.constant;
        }
        else {
            var parts = queryBuilder.computeCompleteExpressionParts();
            this.expressionToUseForFacetSearch = parts.withoutConstant == null ? '' : parts.withoutConstant;
            this.basicExpressionToUseForFacetSearch = parts.basic == null ? '' : parts.basic;
            this.advancedExpressionToUseForFacetSearch = parts.advanced;
            this.constantExpressionToUseForFacetSearch = parts.constant;
        }
        this.lastGroupByRequestIndex = queryBuilder.groupByRequests.length;
        this.lastGroupByRequest = groupByRequest;
        queryBuilder.groupByRequests.push(groupByRequest);
    };
    /**
     * Search inside the facet, using a group by request
     * @param params
     * @param oldLength Optional params, used by the search method to call itself recursively to fetch all required values
     * @returns {Promise|Promise<T>}
     */
    FacetQueryController.prototype.search = function (params, oldLength) {
        var _this = this;
        if (oldLength === void 0) { oldLength = params.nbResults; }
        // For search, we want to retrieve the exact values we requested, and not additional ones
        params.completeFacetWithStandardValues = false;
        return new Promise(function (resolve, reject) {
            var onResult = function (fieldValues) {
                var newLength = fieldValues.length;
                fieldValues = _this.checkForFacetSearchValuesToRemove(fieldValues, params.valueToSearch);
                if (FacetUtils_1.FacetUtils.needAnotherFacetSearch(fieldValues.length, newLength, oldLength, 5)) {
                    // This means that we removed enough values from the returned one that we need to perform a new search with more values requested.
                    params.nbResults += 5;
                    return _this.search(params, fieldValues.length);
                }
                else {
                    resolve(fieldValues);
                }
            };
            var searchPromise = _this.facet.getEndpoint().search(params.getQuery());
            _this.currentSearchPromise = searchPromise;
            searchPromise
                .then(function (queryResults) {
                if (_this.currentSearchPromise == searchPromise) {
                    // params.getQuery() will generate a query for all excluded values + some new values
                    // there is no clean way to do a group by and remove some values
                    // so instead we request more values than we need, and crop all the one we don't want
                    var valuesCropped_1 = [];
                    if (queryResults.groupByResults && queryResults.groupByResults[0]) {
                        _.each(queryResults.groupByResults[0].values, function (v) {
                            if (v.lookupValue) {
                                if (!_.contains(params.alwaysExclude, v.lookupValue.toLowerCase())) {
                                    valuesCropped_1.push(v);
                                }
                            }
                            else {
                                if (!_.contains(params.alwaysExclude, v.value.toLowerCase())) {
                                    valuesCropped_1.push(v);
                                }
                            }
                        });
                    }
                    onResult(_.first(valuesCropped_1, params.nbResults));
                }
                else {
                    reject();
                }
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    FacetQueryController.prototype.fetchMore = function (numberOfValuesToFetch) {
        var _this = this;
        var params = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        params.alwaysInclude = this.facet.options.allowedValues || _.pluck(this.facet.values.getAll(), 'value');
        params.nbResults = numberOfValuesToFetch;
        return this.facet
            .getEndpoint()
            .search(params.getQuery())
            .then(function (results) {
            if (_this.facet.options.allowedValues && results && results.groupByResults && results.groupByResults[0]) {
                results.groupByResults[0].values = _this.filterByAllowedValueOption(results.groupByResults[0].values);
            }
            return results;
        });
    };
    FacetQueryController.prototype.searchInFacetToUpdateDelta = function (facetValues) {
        var params = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        var query = params.getQuery();
        query.aq = (query.aq ? query.aq : '') + " " + this.computeOurFilterExpression();
        _.each(facetValues, function (facetValue) {
            facetValue.waitingForDelta = true;
        });
        query.groupBy = [this.createBasicGroupByRequest(_.map(facetValues, function (facetValue) { return facetValue.value; }))];
        query.groupBy[0].completeFacetWithStandardValues = false;
        return this.facet.getEndpoint().search(query);
    };
    FacetQueryController.prototype.createGroupByAllowedValues = function () {
        // if you want to keep displayed values next time, take all current values as allowed values
        // otherwise take only the selected value
        if (this.facet.options.allowedValues != undefined) {
            return this.facet.options.allowedValues;
        }
        else if (this.facet.options.customSort != undefined) {
            // If there is a custom sort, we still need to add selectedValues to the group by
            // Filter out duplicates with a lower case comparison on the value
            return this.getUnionWithCustomSortLowercase(this.facet.options.customSort, this.getAllowedValuesFromSelected());
        }
        else {
            return _.map(this.getAllowedValuesFromSelected(), function (facetValue) { return facetValue.value; });
        }
    };
    FacetQueryController.prototype.createBasicGroupByRequest = function (allowedValues, addComputedField) {
        if (addComputedField === void 0) { addComputedField = true; }
        var nbOfRequestedValues = this.facet.numberOfValues;
        if (this.facet.options.customSort != null) {
            // If we have a custom sort, we need to make sure that we always request at least enough values to always receive them
            var usedValues = this.getUnionWithCustomSortLowercase(this.facet.options.customSort, this.facet.values.getSelected().concat(this.facet.values.getExcluded()));
            nbOfRequestedValues = Math.max(nbOfRequestedValues, usedValues.length);
        }
        var groupByRequest = {
            field: this.facet.options.field,
            maximumNumberOfValues: nbOfRequestedValues + (this.facet.options.enableMoreLess ? 1 : 0),
            sortCriteria: this.facet.options.sortCriteria,
            injectionDepth: this.facet.options.injectionDepth,
            completeFacetWithStandardValues: this.facet.options.allowedValues == undefined ? true : false
        };
        if (this.facet.options.lookupField) {
            groupByRequest.lookupField = this.facet.options.lookupField;
        }
        if (allowedValues != null) {
            groupByRequest.allowedValues = allowedValues;
        }
        if (addComputedField && Utils_1.Utils.isNonEmptyString(this.facet.options.computedField)) {
            groupByRequest.computedFields = [
                {
                    field: this.facet.options.computedField,
                    operation: this.facet.options.computedFieldOperation
                }
            ];
        }
        return groupByRequest;
    };
    FacetQueryController.prototype.getAllowedValuesFromSelected = function () {
        var facetValues = [];
        if (this.facet.options.useAnd || !this.facet.keepDisplayedValuesNextTime) {
            var selected = this.facet.values.getSelected();
            if (selected.length == 0) {
                return undefined;
            }
            facetValues = this.facet.values.getSelected();
        }
        else {
            facetValues = this.facet.values.getAll();
        }
        return facetValues;
    };
    Object.defineProperty(FacetQueryController.prototype, "additionalFilter", {
        get: function () {
            return this.facet.options.additionalFilter ? this.facet.options.additionalFilter : '';
        },
        enumerable: true,
        configurable: true
    });
    FacetQueryController.prototype.getUnionWithCustomSortLowercase = function (customSort, facetValues) {
        // This will take the custom sort, compare it against the passed in facetValues
        // The comparison is lowercase.
        // The union of the 2 arrays with duplicated filtered out is returned.
        var toCompare = _.map(customSort, function (val) {
            return val.toLowerCase();
        });
        var filtered = _.chain(facetValues)
            .filter(function (facetValue) {
            return !_.contains(toCompare, facetValue.value.toLowerCase());
        })
            .map(function (facetValue) {
            return facetValue.value;
        })
            .value();
        return _.compact(customSort.concat(filtered));
    };
    FacetQueryController.prototype.createGroupByQueryOverride = function (queryBuilder) {
        var queryBuilderExpression = queryBuilder.computeCompleteExpressionParts();
        if (this.queryOverrideIsNeededForMultiSelection()) {
            queryBuilderExpression = this.processQueryOverrideForMultiSelection(queryBuilder, queryBuilderExpression);
        }
        else {
            queryBuilderExpression.reset();
        }
        if (this.queryOverrideIsNeededForAdditionalFilter()) {
            queryBuilderExpression = this.processQueryOverrideForAdditionalFilter(queryBuilder, queryBuilderExpression);
        }
        queryBuilderExpression = this.processQueryOverrideForEmptyValues(queryBuilder, queryBuilderExpression);
        if (QueryBuilderExpression_1.QueryBuilderExpression.isEmpty(queryBuilderExpression)) {
            return null;
        }
        return queryBuilderExpression;
    };
    FacetQueryController.prototype.queryOverrideIsNeededForMultiSelection = function () {
        if (this.facet.options.useAnd) {
            return false;
        }
        if (this.facet.values.hasSelectedOrExcludedValues()) {
            return true;
        }
        return false;
    };
    FacetQueryController.prototype.queryOverrideIsNeededForAdditionalFilter = function () {
        return Utils_1.Utils.isNonEmptyString(this.additionalFilter);
    };
    FacetQueryController.prototype.processQueryOverrideForMultiSelection = function (queryBuilder, mergeWith) {
        if (this.facet.values.hasSelectedOrExcludedValues()) {
            var ourExpression = this.computeOurFilterExpression();
            mergeWith = queryBuilder.computeCompleteExpressionPartsExcept(ourExpression);
            if (QueryBuilderExpression_1.QueryBuilderExpression.isEmpty(mergeWith)) {
                mergeWith.advanced = '@uri';
            }
        }
        return mergeWith;
    };
    FacetQueryController.prototype.processQueryOverrideForAdditionalFilter = function (queryBuilder, mergeWith) {
        if (Utils_1.Utils.isEmptyString(mergeWith.basic)) {
            mergeWith.basic = queryBuilder.expression.build();
        }
        if (Utils_1.Utils.isEmptyString(mergeWith.constant)) {
            var addExistingConstantExpressionIfNotEmpty = queryBuilder.constantExpression.isEmpty()
                ? ''
                : queryBuilder.constantExpression.build() + ' ';
            mergeWith.constant = "" + addExistingConstantExpressionIfNotEmpty + this.additionalFilter;
        }
        else {
            mergeWith.constant = mergeWith.constant + " " + this.additionalFilter;
        }
        if (!mergeWith.advanced) {
            mergeWith.advanced = this.getFilterExpressionWithoutOurFilterExpression(queryBuilder);
        }
        return mergeWith;
    };
    FacetQueryController.prototype.getFilterExpressionWithoutOurFilterExpression = function (queryBuilder) {
        var expression = new ExpressionBuilder_1.ExpressionBuilder();
        var advancedExpressionParts = queryBuilder.advancedExpression.getParts();
        advancedExpressionParts.forEach(function (part) { return expression.add(part); });
        var currentFacetAdvancedExpression = this.computeOurFilterExpression();
        expression.remove(currentFacetAdvancedExpression);
        return expression.build();
    };
    FacetQueryController.prototype.processQueryOverrideForEmptyValues = function (queryBuilder, mergeWith) {
        var withoutEmptyValues = _.chain(mergeWith)
            .keys()
            .each(function (key) {
            if (Utils_1.Utils.isEmptyString(mergeWith[key]) || Utils_1.Utils.isNullOrUndefined(mergeWith[key])) {
                delete mergeWith[key];
            }
        })
            .value();
        if (_.keys(withoutEmptyValues).length == 0) {
            mergeWith = undefined;
        }
        return mergeWith;
    };
    FacetQueryController.prototype.checkForFacetSearchValuesToRemove = function (fieldValues, valueToCheckAgainst) {
        var _this = this;
        var regex = FacetUtils_1.FacetUtils.getRegexToUseForFacetSearch(valueToCheckAgainst, this.facet.options.facetSearchIgnoreAccents);
        return _.filter(fieldValues, function (fieldValue) {
            var isAllowed = _.isEmpty(_this.facet.options.allowedValues) || _this.isValueAllowedByAllowedValueOption(fieldValue.value);
            var value = _this.facet.getValueCaption(fieldValue);
            return isAllowed && regex.test(value);
        });
    };
    FacetQueryController.prototype.filterByAllowedValueOption = function (values) {
        var _this = this;
        return _.filter(values, function (value) { return _this.isValueAllowedByAllowedValueOption(value.value); });
    };
    FacetQueryController.prototype.isValueAllowedByAllowedValueOption = function (value) {
        var _this = this;
        return _.some(this.facet.options.allowedValues, function (allowedValue) {
            var regexContent = _this.replaceWildcardsWithRegexEquivalent(_this.escapeMostRegexCharacters(allowedValue));
            var regex = new RegExp("^" + regexContent + "$", 'gi');
            return regex.test(value);
        });
    };
    FacetQueryController.prototype.escapeMostRegexCharacters = function (text) {
        // Regex taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
        // `*` and `?` were removed because they are used for wildcards
        return text.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    };
    FacetQueryController.prototype.replaceWildcardsWithRegexEquivalent = function (text) {
        // Allowed value option on the facet should support * (wildcard searches)
        // We need to filter values client side the index will completeWithStandardValues
        // Replace the wildcard (*) for a regex match (.*)
        // Also replace the (?) with "any character once" since it is also supported by the index
        return text.replace(/\*/g, '.*').replace(/\?/g, '.');
    };
    return FacetQueryController;
}());
exports.FacetQueryController = FacetQueryController;


/***/ }),

/***/ 286:
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
Object.defineProperty(exports, "__esModule", { value: true });
var moment = __webpack_require__(140);
var underscore_1 = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var FacetRange_1 = __webpack_require__(186);
var ResponsiveFacetOptions_1 = __webpack_require__(82);
/**
 * The TimespanFacet component displays a {@link FacetRange} with prebuilt ranges.
 *
 * The prebuilt ranges allow you to see the items last updated in the last day, week, month, or year.
 *
 * This component in a thin wrapper around the standard {@link FacetRange} component.
 *
 * This component is meant to offer out of the box default ranges, so it can easily be inserted in a standard search page.
 *
 * To configure different ranges than those offered by this component, use the standard {@link FacetRange} component instead.
 *
 * @notSupportedIn salesforcefree
 */
var TimespanFacet = /** @class */ (function (_super) {
    __extends(TimespanFacet, _super);
    function TimespanFacet(element, options, bindings) {
        var _this = _super.call(this, element, TimespanFacet.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.rangeValues = [
            {
                start: moment(0).toDate(),
                end: moment()
                    .endOf('day')
                    .toDate(),
                label: Strings_1.l('AllDates'),
                endInclusive: false
            },
            {
                start: moment()
                    .startOf('day')
                    .subtract(1, 'day')
                    .toDate(),
                end: moment()
                    .endOf('day')
                    .toDate(),
                label: Strings_1.l('WithinLastDay'),
                endInclusive: false
            },
            {
                start: moment()
                    .startOf('day')
                    .subtract(1, 'week')
                    .toDate(),
                end: moment()
                    .endOf('day')
                    .toDate(),
                label: Strings_1.l('WithinLastWeek'),
                endInclusive: false
            },
            {
                start: moment()
                    .startOf('day')
                    .subtract(1, 'month')
                    .toDate(),
                end: moment()
                    .endOf('day')
                    .toDate(),
                label: Strings_1.l('WithinLastMonth'),
                endInclusive: false
            },
            {
                start: moment()
                    .startOf('day')
                    .subtract(1, 'year')
                    .toDate(),
                end: moment()
                    .endOf('day')
                    .toDate(),
                label: Strings_1.l('WithinLastYear'),
                endInclusive: false
            }
        ];
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, TimespanFacet, options);
        _this.buildFacet();
        return _this;
    }
    TimespanFacet.prototype.isCurrentlyDisplayed = function () {
        if (!Dom_1.$$(this.element).isVisible()) {
            return false;
        }
        if (this.disabled) {
            return false;
        }
        return true;
    };
    Object.defineProperty(TimespanFacet.prototype, "ranges", {
        /**
         * Returns the current range the facet uses to query the index
         */
        get: function () {
            return this.rangeValues;
        },
        /**
         * Sets a new range for the component.
         */
        set: function (ranges) {
            this.rangeValues = ranges;
            this.buildFacet();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimespanFacet.prototype, "facet", {
        /**
         * Returns the underlying {@link FacetRange} component associated to the Timespan Facet.
         */
        get: function () {
            return this.facetRange;
        },
        enumerable: true,
        configurable: true
    });
    TimespanFacet.prototype.buildFacet = function () {
        this.destroyFacet();
        this.facetRangeElement = Dom_1.$$('div');
        Dom_1.$$(this.element).append(this.facetRangeElement.el);
        this.facetRange = new FacetRange_1.FacetRange(this.facetRangeElement.el, {
            field: this.options.field,
            title: this.options.title,
            ranges: this.rangeValues,
            availableSorts: ['custom'],
            customSort: underscore_1.pluck(this.rangeValues, 'label'),
            id: this.options.id
        }, this.bindings);
        this.facetRange.isCurrentlyDisplayed = this.isCurrentlyDisplayed;
    };
    TimespanFacet.prototype.destroyFacet = function () {
        if (this.facetRangeElement) {
            this.facetRangeElement.remove();
        }
        delete this.facetRange;
    };
    TimespanFacet.ID = 'TimespanFacet';
    /**
     * @componentOptions
     */
    TimespanFacet.options = __assign({ 
        /**
         * Specifies the title to display at the top of the facet.
         *
         * Default value is the localized string for `Last updated`.
         */
        title: ComponentOptions_1.ComponentOptions.buildStringOption({
            defaultValue: Strings_1.l('LastUpdated')
        }), 
        /**
         * Specifies the index field whose values the facet should use.
         *
         * Default value is the field `@date`
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({
            defaultValue: '@date'
        }), 
        /**
         * Specifies a unique identifier for the facet. Among other things, this identifier serves the purpose of saving
         * the facet state in the URL hash.
         *
         * If you have two facets with the same field on the same page, you should specify an `id` value for at least one of
         * those two facets. This `id` must be unique in the page.
         *
         * Default value is the [`field`]{@link TimespanFacet.options.field} option value.
         */
        id: ComponentOptions_1.ComponentOptions.buildStringOption({
            postProcessing: function (value, options) { return value || options.field; }
        }) }, ResponsiveFacetOptions_1.ResponsiveFacetOptions);
    TimespanFacet.doExport = function () {
        GlobalExports_1.exportGlobally({
            TimespanFacet: TimespanFacet
        });
    };
    return TimespanFacet;
}(Component_1.Component));
exports.TimespanFacet = TimespanFacet;
Initialization_1.Initialization.registerAutoCreateComponent(TimespanFacet);


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

/***/ 467:
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

/***/ 468:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ValueElementRenderer_1 = __webpack_require__(469);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Dom_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(25);
var ValueElement = /** @class */ (function () {
    function ValueElement(facet, facetValue, onSelect, onExclude) {
        this.facet = facet;
        this.facetValue = facetValue;
        this.onSelect = onSelect;
        this.onExclude = onExclude;
    }
    ValueElement.prototype.build = function () {
        this.renderer = new ValueElementRenderer_1.ValueElementRenderer(this.facet, this.facetValue).build();
        this.bindEvent({ displayNextTime: true, pinFacet: this.facet.options.preservePosition });
        return this;
    };
    ValueElement.prototype.bindEvent = function (eventBindings) {
        if (!Utils_1.Utils.isNullOrUndefined(eventBindings.omniboxObject)) {
            this.isOmnibox = true;
        }
        else {
            this.isOmnibox = false;
        }
        this.handleEventForCheckboxChange(eventBindings);
        if (this.facetValue.excluded) {
            this.handleEventForExcludedValueElement(eventBindings);
        }
        else {
            this.handleEventForValueElement(eventBindings);
        }
    };
    ValueElement.prototype.select = function () {
        this.facetValue.selected = true;
        this.facetValue.excluded = false;
        this.renderer.setCssClassOnListValueElement();
    };
    ValueElement.prototype.unselect = function () {
        this.facetValue.selected = false;
        this.facetValue.excluded = false;
        this.renderer.setCssClassOnListValueElement();
    };
    ValueElement.prototype.exclude = function () {
        this.facetValue.selected = false;
        this.facetValue.excluded = true;
        this.renderer.setCssClassOnListValueElement();
    };
    ValueElement.prototype.unexclude = function () {
        this.facetValue.selected = false;
        this.facetValue.excluded = false;
        this.renderer.setCssClassOnListValueElement();
    };
    ValueElement.prototype.toggleExcludeWithUA = function () {
        var _this = this;
        var actionCause;
        if (this.facetValue.excluded) {
            actionCause = this.isOmnibox ? AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFacetUnexclude : AnalyticsActionListMeta_1.analyticsActionCauseList.facetUnexclude;
        }
        else {
            actionCause = this.isOmnibox ? AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFacetExclude : AnalyticsActionListMeta_1.analyticsActionCauseList.facetExclude;
        }
        this.facet.toggleExcludeValue(this.facetValue);
        if (this.onExclude) {
            this.facet.triggerNewQuery(function () { return _this.onExclude(_this, actionCause); });
        }
        else {
            this.facet.triggerNewQuery(function () {
                return _this.facet.usageAnalytics.logSearchEvent(actionCause, _this.getAnalyticsFacetMeta());
            });
        }
    };
    ValueElement.prototype.handleSelectValue = function (eventBindings) {
        var _this = this;
        this.facet.keepDisplayedValuesNextTime = eventBindings.displayNextTime && !this.facet.options.useAnd;
        var actionCause;
        if (this.facetValue.excluded) {
            actionCause = this.isOmnibox ? AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFacetUnexclude : AnalyticsActionListMeta_1.analyticsActionCauseList.facetUnexclude;
            this.facet.unexcludeValue(this.facetValue);
        }
        else {
            if (this.facetValue.selected) {
                actionCause = this.isOmnibox ? AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFacetDeselect : AnalyticsActionListMeta_1.analyticsActionCauseList.facetDeselect;
            }
            else {
                actionCause = this.isOmnibox ? AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFacetSelect : AnalyticsActionListMeta_1.analyticsActionCauseList.facetSelect;
            }
            this.facet.toggleSelectValue(this.facetValue);
        }
        if (this.onSelect) {
            this.facet.triggerNewQuery(function () { return _this.onSelect(_this, actionCause); });
        }
        else {
            this.facet.triggerNewQuery(function () {
                return _this.facet.usageAnalytics.logSearchEvent(actionCause, _this.getAnalyticsFacetMeta());
            });
        }
    };
    ValueElement.prototype.handleExcludeClick = function (eventBindings) {
        this.facet.keepDisplayedValuesNextTime = eventBindings.displayNextTime && !this.facet.options.useAnd;
        this.toggleExcludeWithUA();
    };
    ValueElement.prototype.handleSelectEventForExcludedValueElement = function (eventBindings) {
        var _this = this;
        var clickEvent = function () {
            if (eventBindings.pinFacet) {
                _this.facet.pinFacetPosition();
            }
            if (eventBindings.omniboxObject) {
                _this.omniboxCloseEvent(eventBindings.omniboxObject);
            }
            _this.handleSelectValue(eventBindings);
            _this.tryDismissSearchResults();
            return false;
        };
        Dom_1.$$(this.renderer.label).on('click', function (e) {
            e.stopPropagation();
            clickEvent();
        });
        Dom_1.$$(this.renderer.stylishCheckbox).on('keydown', KeyboardUtils_1.KeyboardUtils.keypressAction([KeyboardUtils_1.KEYBOARD.SPACEBAR, KeyboardUtils_1.KEYBOARD.ENTER], clickEvent));
    };
    ValueElement.prototype.handleExcludeEventForValueElement = function (eventBindings) {
        var _this = this;
        var excludeAction = function (event) {
            if (eventBindings.omniboxObject) {
                _this.omniboxCloseEvent(eventBindings.omniboxObject);
            }
            _this.handleExcludeClick(eventBindings);
            _this.tryDismissSearchResults();
            event.stopPropagation();
            event.preventDefault();
        };
        Dom_1.$$(this.renderer.excludeIcon).on('click', excludeAction);
        Dom_1.$$(this.renderer.excludeIcon).on('keydown', KeyboardUtils_1.KeyboardUtils.keypressAction([KeyboardUtils_1.KEYBOARD.SPACEBAR, KeyboardUtils_1.KEYBOARD.ENTER], excludeAction));
    };
    ValueElement.prototype.handleSelectEventForValueElement = function (eventBindings) {
        var _this = this;
        var selectAction = function (event) {
            if (eventBindings.pinFacet) {
                _this.facet.pinFacetPosition();
            }
            _this.tryDismissSearchResults();
            Dom_1.$$(_this.renderer.checkbox).trigger('change');
            event.preventDefault();
        };
        Dom_1.$$(this.renderer.label).on('click', selectAction);
        Dom_1.$$(this.renderer.stylishCheckbox).on('keydown', KeyboardUtils_1.KeyboardUtils.keypressAction([KeyboardUtils_1.KEYBOARD.SPACEBAR, KeyboardUtils_1.KEYBOARD.ENTER], selectAction));
    };
    ValueElement.prototype.handleEventForExcludedValueElement = function (eventBindings) {
        this.handleSelectEventForExcludedValueElement(eventBindings);
        this.handleExcludeEventForValueElement(eventBindings);
    };
    ValueElement.prototype.handleEventForValueElement = function (eventBindings) {
        this.handleSelectEventForValueElement(eventBindings);
        this.handleExcludeEventForValueElement(eventBindings);
    };
    ValueElement.prototype.handleEventForCheckboxChange = function (eventBindings) {
        var _this = this;
        Dom_1.$$(this.renderer.checkbox).on('change', function () {
            if (eventBindings.omniboxObject) {
                _this.omniboxCloseEvent(eventBindings.omniboxObject);
            }
            _this.handleSelectValue(eventBindings);
        });
    };
    ValueElement.prototype.omniboxCloseEvent = function (eventArg) {
        eventArg.closeOmnibox();
        eventArg.clear();
    };
    ValueElement.prototype.tryDismissSearchResults = function () {
        if (this.facet && this.facet.facetSearch && this.facet.facetSearch.dismissSearchResults) {
            this.facet.facetSearch.dismissSearchResults();
        }
    };
    ValueElement.prototype.getAnalyticsFacetMeta = function () {
        return {
            facetId: this.facet.options.id,
            facetField: this.facet.options.field.toString(),
            facetValue: this.facetValue.value,
            facetTitle: this.facet.options.title
        };
    };
    return ValueElement;
}());
exports.ValueElement = ValueElement;


/***/ }),

/***/ 469:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var Strings_1 = __webpack_require__(6);
var Component_1 = __webpack_require__(7);
var _ = __webpack_require__(0);
var SVGIcons_1 = __webpack_require__(12);
var SVGDom_1 = __webpack_require__(16);
var ValueElementRenderer = /** @class */ (function () {
    function ValueElementRenderer(facet, facetValue) {
        this.facet = facet;
        this.facetValue = facetValue;
    }
    ValueElementRenderer.prototype.withNo = function (element) {
        if (_.isArray(element)) {
            _.each(element, function (e) {
                if (e) {
                    Dom_1.$$(e).detach();
                }
            });
        }
        else {
            if (element) {
                Dom_1.$$(element).detach();
            }
        }
        return this;
    };
    ValueElementRenderer.prototype.build = function () {
        this.buildListItem();
        this.initAndAppendLabel();
        this.initAndAppendExcludeIcon();
        this.setCssClassOnListValueElement();
        this.addAccessibilityAttributesToTargetElement();
        return this;
    };
    ValueElementRenderer.prototype.setCssClassOnListValueElement = function () {
        Dom_1.$$(this.listItem).toggleClass('coveo-selected', this.facetValue.selected);
        Dom_1.$$(this.listItem).toggleClass('coveo-excluded', this.facetValue.excluded);
    };
    Object.defineProperty(ValueElementRenderer.prototype, "accessibleElement", {
        get: function () {
            return this.stylishCheckbox;
        },
        enumerable: true,
        configurable: true
    });
    ValueElementRenderer.prototype.buildExcludeIcon = function () {
        var isExcluded = this.facetValue.excluded;
        var excludeIcon = Dom_1.$$('div', {
            ariaLabel: Strings_1.l('ExcludeValueWithResultCount', this.caption, Strings_1.l('ResultCount', this.count, parseInt(this.count, 10))),
            className: 'coveo-facet-value-exclude',
            tabindex: 0,
            role: 'button',
            ariaPressed: isExcluded.toString()
        }).el;
        this.addFocusAndBlurEventListeners(excludeIcon);
        excludeIcon.innerHTML = isExcluded ? SVGIcons_1.SVGIcons.icons.plus : SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore;
        SVGDom_1.SVGDom.addClassToSVGInContainer(excludeIcon, isExcluded ? 'coveo-facet-value-unexclude-svg' : 'coveo-facet-value-exclude-svg');
        SVGDom_1.SVGDom.addAttributesToSVGInContainer(excludeIcon, { 'aria-hidden': 'true' });
        return excludeIcon;
    };
    ValueElementRenderer.prototype.buildValueComputedField = function () {
        var computedField = this.facetValue.getFormattedComputedField(this.facet.options.computedFieldFormat);
        if (Utils_1.Utils.isNonEmptyString(computedField)) {
            var elem = Dom_1.$$('span', {
                className: 'coveo-facet-value-computed-field'
            }).el;
            Dom_1.$$(elem).text(computedField);
            return elem;
        }
        else {
            return undefined;
        }
    };
    ValueElementRenderer.prototype.buildValueCheckbox = function () {
        var checkbox = Dom_1.$$('input', {
            type: 'checkbox',
            ariaHidden: true,
            ariaLabel: this.ariaLabel
        }).el;
        this.facetValue.selected ? checkbox.setAttribute('checked', 'checked') : checkbox.removeAttribute('checked');
        this.facetValue.excluded ? checkbox.setAttribute('disabled', 'disabled') : checkbox.removeAttribute('disabled');
        Component_1.Component.pointElementsToDummyForm(checkbox);
        return checkbox;
    };
    ValueElementRenderer.prototype.buildValueStylishCheckbox = function () {
        var checkbox = Dom_1.$$('div', {
            className: 'coveo-facet-value-checkbox',
            tabindex: 0
        }).el;
        checkbox.innerHTML = SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore;
        SVGDom_1.SVGDom.addClassToSVGInContainer(checkbox, 'coveo-facet-value-checkbox-svg');
        this.addFocusAndBlurEventListeners(checkbox);
        return checkbox;
    };
    ValueElementRenderer.prototype.buildValueIcon = function () {
        var icon = this.getValueIcon();
        if (Utils_1.Utils.exists(icon)) {
            return Dom_1.$$('img', {
                className: 'coveo-facet-value-icon coveo-icon',
                src: this.getValueIcon()
            }).el;
        }
        else {
            return this.buildValueIconFromSprite();
        }
    };
    ValueElementRenderer.prototype.getValueIcon = function () {
        if (Utils_1.Utils.exists(this.facet.options.valueIcon)) {
            return this.facet.options.valueIcon(this.facetValue);
        }
        else {
            return undefined;
        }
    };
    ValueElementRenderer.prototype.buildValueIconFromSprite = function () {
        return Dom_1.$$('div', {
            className: 'coveo-facet-value-icon coveo-icon ' + this.facet.options.field.substr(1) + ' ' + this.facetValue.value
        }).el;
    };
    ValueElementRenderer.prototype.buildValueCaption = function () {
        var valueCaption = Dom_1.$$('span', {
            className: 'coveo-facet-value-caption',
            title: this.caption,
            'data-original-value': this.facetValue.value
        }).el;
        Dom_1.$$(valueCaption).text(this.caption);
        return valueCaption;
    };
    ValueElementRenderer.prototype.buildValueCount = function () {
        if (Utils_1.Utils.isNonEmptyString(this.count)) {
            var countElement = Dom_1.$$('span', {
                className: 'coveo-facet-value-count'
            }).el;
            Dom_1.$$(countElement).text(this.count);
            return countElement;
        }
        else {
            return undefined;
        }
    };
    Object.defineProperty(ValueElementRenderer.prototype, "caption", {
        get: function () {
            return this.facet.getValueCaption(this.facetValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueElementRenderer.prototype, "count", {
        get: function () {
            return this.facetValue.getFormattedCount();
        },
        enumerable: true,
        configurable: true
    });
    ValueElementRenderer.prototype.addFocusAndBlurEventListeners = function (elem) {
        var _this = this;
        Dom_1.$$(elem).on('focus', function () { return Dom_1.$$(_this.listItem).addClass('coveo-focused'); });
        Dom_1.$$(elem).on('blur', function () { return Dom_1.$$(_this.listItem).removeClass('coveo-focused'); });
    };
    ValueElementRenderer.prototype.buildListItem = function () {
        this.listItem = Dom_1.$$('li', { className: 'coveo-facet-value coveo-facet-selectable', ariaLabel: this.ariaLabel }).el;
        if (!Dom_1.$$(this.listItem).canHandleEvent('touchstart')) {
            Dom_1.$$(this.listItem).addClass('coveo-with-hover');
        }
        this.listItem.setAttribute('data-value', this.facetValue.value);
    };
    ValueElementRenderer.prototype.initAndAppendLabel = function () {
        this.label = Dom_1.$$('label', { className: 'coveo-facet-value-label', role: 'group' }).el;
        this.tryToInitAndAppendComputedField();
        this.initAndAppendFacetValueLabelWrapper();
        this.listItem.appendChild(this.label);
    };
    ValueElementRenderer.prototype.initAndAppendExcludeIcon = function () {
        this.excludeIcon = this.buildExcludeIcon();
        this.attachExcludeIconEventHandlers();
        this.listItem.appendChild(this.excludeIcon);
    };
    ValueElementRenderer.prototype.attachExcludeIconEventHandlers = function () {
        var _this = this;
        Dom_1.$$(this.excludeIcon).on('mouseover', function () {
            Dom_1.$$(_this.listItem).addClass('coveo-facet-value-will-exclude');
        });
        Dom_1.$$(this.excludeIcon).on('mouseout', function () {
            Dom_1.$$(_this.listItem).removeClass('coveo-facet-value-will-exclude');
        });
    };
    ValueElementRenderer.prototype.tryToInitAndAppendComputedField = function () {
        if (!Utils_1.Utils.exists(this.facetValue.computedField)) {
            return;
        }
        this.computedField = this.buildValueComputedField();
        if (!this.computedField) {
            return;
        }
        this.label.appendChild(this.computedField);
        Dom_1.$$(this.label).addClass('coveo-with-computed-field');
    };
    ValueElementRenderer.prototype.initAndAppendFacetValueLabelWrapper = function () {
        this.facetValueLabelWrapper = Dom_1.$$('div', { className: 'coveo-facet-value-label-wrapper' }).el;
        this.initAndAppendCheckbox();
        this.initAndAppendStylishCheckbox();
        this.initAndAppendValueCaption();
        this.initAndAppendValueCount();
        this.label.appendChild(this.facetValueLabelWrapper);
    };
    ValueElementRenderer.prototype.initAndAppendCheckbox = function () {
        this.checkbox = this.buildValueCheckbox();
        this.facetValueLabelWrapper.appendChild(this.checkbox);
    };
    ValueElementRenderer.prototype.initAndAppendStylishCheckbox = function () {
        this.stylishCheckbox = this.buildValueStylishCheckbox();
        this.facetValueLabelWrapper.appendChild(this.stylishCheckbox);
    };
    ValueElementRenderer.prototype.initAndAppendValueCount = function () {
        this.valueCount = this.buildValueCount();
        if (!this.valueCount) {
            return;
        }
        this.facetValueLabelWrapper.appendChild(this.valueCount);
    };
    ValueElementRenderer.prototype.initAndAppendValueCaption = function () {
        this.valueCaption = this.buildValueCaption();
        this.facetValueLabelWrapper.appendChild(this.valueCaption);
    };
    ValueElementRenderer.prototype.addAccessibilityAttributesToTargetElement = function () {
        var el = this.accessibleElement;
        el.setAttribute('aria-label', this.ariaLabel);
        el.setAttribute('role', 'button');
        el.setAttribute('aria-pressed', this.ariaPressed);
    };
    Object.defineProperty(ValueElementRenderer.prototype, "ariaLabel", {
        get: function () {
            var resultCount = Strings_1.l('ResultCount', this.count, parseInt(this.count, 10));
            return "" + Strings_1.l('IncludeValueWithResultCount', this.caption, resultCount);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueElementRenderer.prototype, "ariaPressed", {
        get: function () {
            if (this.facetValue.excluded) {
                return 'mixed';
            }
            return this.facetValue.selected ? 'true' : 'false';
        },
        enumerable: true,
        configurable: true
    });
    return ValueElementRenderer;
}());
exports.ValueElementRenderer = ValueElementRenderer;


/***/ }),

/***/ 470:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StringUtils_1 = __webpack_require__(22);
var _ = __webpack_require__(0);
var FacetValuesOrder = /** @class */ (function () {
    function FacetValuesOrder(facet, facetSort) {
        this.facet = facet;
        this.facetSort = facetSort;
    }
    FacetValuesOrder.prototype.reorderValues = function (facetValues) {
        if (this.facetSort && this.facetSort.activeSort) {
            if (this.usingCustomSort) {
                return this.reorderValuesWithCustomOrder(facetValues);
            }
            if (this.usingAlphabeticalSort) {
                return this.reorderValuesWithCustomCaption(facetValues);
            }
        }
        return facetValues;
    };
    FacetValuesOrder.prototype.reorderValuesIfUsingCustomSort = function (values) {
        return this.usingCustomSort ? this.reorderValuesWithCustomOrder(values) : values;
    };
    FacetValuesOrder.prototype.reorderValuesIfUsingAlphabeticalSort = function (values) {
        return this.usingAlphabeticalSort ? this.reorderValuesWithCustomCaption(values) : values;
    };
    Object.defineProperty(FacetValuesOrder.prototype, "usingCustomSort", {
        get: function () {
            return this.facetSort.activeSort.name == 'custom' && this.facet.options.customSort != undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetValuesOrder.prototype, "usingAlphabeticalSort", {
        get: function () {
            return this.facetSort.activeSort.name.indexOf('alpha') != -1;
        },
        enumerable: true,
        configurable: true
    });
    FacetValuesOrder.prototype.reorderValuesWithCustomOrder = function (facetValues) {
        var customSortsLowercase = _.map(this.facet.options.customSort, function (customSort) { return customSort.toLowerCase(); });
        var valueIndexPair = _.map(facetValues, function (facetValue, i) {
            // Get the index of the current value in the custom sort array.
            // If it's not found, put it's index to it's original value + the length of customSort so that's always after the specified custom sort order.
            var index = _.findIndex(customSortsLowercase, function (customSort) {
                return (StringUtils_1.StringUtils.equalsCaseInsensitive(customSort, facetValue.value) ||
                    (facetValue.lookupValue != null && StringUtils_1.StringUtils.equalsCaseInsensitive(customSort, facetValue.lookupValue)));
            });
            if (index == -1) {
                index = i + customSortsLowercase.length;
            }
            return { facetValue: facetValue, index: index };
        });
        var sorted = _.sortBy(valueIndexPair, 'index');
        sorted = this.facetSort.customSortDirection == 'ascending' ? sorted : sorted.reverse();
        return _.pluck(sorted, 'facetValue');
    };
    FacetValuesOrder.prototype.reorderValuesWithCustomCaption = function (facetValues) {
        var _this = this;
        var sorted = facetValues.sort(function (firstValue, secondValue) {
            return _this.facet.getValueCaption(firstValue).localeCompare(_this.facet.getValueCaption(secondValue), String['locale'], {
                sensitivity: 'base'
            });
        });
        if (this.facetSort.activeSort.name.indexOf('descending') != -1) {
            sorted = sorted.reverse();
        }
        return sorted;
    };
    return FacetValuesOrder;
}());
exports.FacetValuesOrder = FacetValuesOrder;


/***/ }),

/***/ 471:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGIcons_1 = __webpack_require__(12);
var SVGDom_1 = __webpack_require__(16);
var Component_1 = __webpack_require__(7);
var Strings_1 = __webpack_require__(6);
var EventsUtils_1 = __webpack_require__(133);
var FacetSearchUserInputHandler_1 = __webpack_require__(539);
var underscore_1 = __webpack_require__(0);
var SearchDropdownNavigatorFactory_1 = __webpack_require__(540);
var KeyboardUtils_1 = __webpack_require__(25);
var FacetSearchElement = /** @class */ (function () {
    function FacetSearchElement(facetSearch) {
        this.facetSearch = facetSearch;
        this.searchBarIsAnimating = false;
        this.triggeredScroll = false;
        this.facetSearchId = underscore_1.uniqueId('coveo-facet-search-results');
        this.facetValueNotFoundId = underscore_1.uniqueId('coveo-facet-value-not-found');
        this.facetSearchUserInputHandler = new FacetSearchUserInputHandler_1.FacetSearchUserInputHandler(this.facetSearch);
        this.initSearchResults();
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
        this.combobox = this.buildCombobox();
        this.search.appendChild(this.combobox);
        this.input = this.buildInputElement();
        Component_1.Component.pointElementsToDummyForm(this.input);
        this.combobox.appendChild(this.input);
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
        this.initSearchDropdownNavigator();
        return this.search;
    };
    FacetSearchElement.prototype.initSearchResults = function () {
        var _this = this;
        this.searchResults = Dom_1.$$('ul', { id: this.facetSearchId, className: 'coveo-facet-search-results', role: 'listbox' }).el;
        Dom_1.$$(this.searchResults).on('scroll', function () { return _this.handleScrollEvent(); });
        Dom_1.$$(this.searchResults).on('keyup', function (e) {
            if (e.which === KeyboardUtils_1.KEYBOARD.ESCAPE) {
                _this.facetSearch.dismissSearchResults();
            }
        });
        Dom_1.$$(this.searchResults).hide();
    };
    FacetSearchElement.prototype.initSearchDropdownNavigator = function () {
        var _this = this;
        var config = {
            input: this.input,
            searchResults: this.searchResults,
            setScrollTrigger: function (val) { return (_this.triggeredScroll = val); }
        };
        this.searchDropdownNavigator = SearchDropdownNavigatorFactory_1.SearchDropdownNavigatorFactory(this.facetSearch, config);
    };
    FacetSearchElement.prototype.buildCombobox = function () {
        return Dom_1.$$('div', {
            className: 'coveo-facet-search-middle',
            ariaHaspopup: 'listbox',
            ariaExpanded: 'true'
        }).el;
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
    FacetSearchElement.prototype.positionSearchResults = function () {
        var _this = this;
        if (this.searchResults != null) {
            Dom_1.$$(this.searchResults).insertAfter(this.search);
            Dom_1.$$(this.searchResults).show();
            if (Dom_1.$$(this.searchResults).css('display') == 'none') {
                this.searchResults.style.display = '';
            }
            var searchBar = Dom_1.$$(this.search);
            if (searchBar.css('display') == 'none' || this.searchBarIsAnimating) {
                if (Dom_1.$$(this.searchResults).css('display') == 'none') {
                    this.searchResults.style.display = '';
                }
                EventsUtils_1.EventsUtils.addPrefixedEvent(this.search, 'AnimationEnd', function () {
                    EventsUtils_1.EventsUtils.removePrefixedEvent(_this.search, 'AnimationEnd', _this);
                });
            }
        }
        this.addAriaAttributes();
    };
    FacetSearchElement.prototype.setAsCurrentResult = function (toSet) {
        this.searchDropdownNavigator.setAsCurrentResult(toSet);
    };
    Object.defineProperty(FacetSearchElement.prototype, "currentResult", {
        get: function () {
            return this.searchDropdownNavigator.currentResult;
        },
        enumerable: true,
        configurable: true
    });
    FacetSearchElement.prototype.moveCurrentResultDown = function () {
        this.searchDropdownNavigator.focusNextElement();
    };
    FacetSearchElement.prototype.moveCurrentResultUp = function () {
        this.searchDropdownNavigator.focusPreviousElement();
    };
    FacetSearchElement.prototype.highlightCurrentQueryInSearchResults = function (regex) {
        var captions = this.facetSearch.getCaptions();
        captions.forEach(function (caption) {
            caption.innerHTML = Dom_1.$$(caption).text().replace(regex, '<span class="coveo-highlight">$1</span>');
        });
    };
    FacetSearchElement.prototype.appendToSearchResults = function (el) {
        this.searchResults.appendChild(el);
        this.setupFacetSearchResultsEvents(el);
    };
    FacetSearchElement.prototype.emptyAndShowNoResults = function () {
        Dom_1.$$(this.searchResults).empty();
        this.searchResults.appendChild(Dom_1.$$('li', { id: this.facetValueNotFoundId, className: 'coveo-facet-value-not-found', role: 'option', ariaSelected: 'true', tabindex: 0 }, Strings_1.l('NoValuesFound')).el);
        this.input.setAttribute('aria-activedescendant', this.facetValueNotFoundId);
    };
    FacetSearchElement.prototype.updateAriaLiveWithResults = function (inputValue, numberOfResults, moreValuesToFetch) {
        var ariaLiveText = inputValue === ''
            ? Strings_1.l('ShowingResults', numberOfResults, inputValue, numberOfResults)
            : Strings_1.l('ShowingResultsWithQuery', numberOfResults, inputValue, numberOfResults);
        if (moreValuesToFetch) {
            ariaLiveText = ariaLiveText + " (" + Strings_1.l('MoreValuesAvailable') + ")";
        }
        this.facetSearch.updateAriaLive(ariaLiveText);
    };
    FacetSearchElement.prototype.focus = function () {
        this.input.focus();
        this.handleFacetSearchFocus();
    };
    FacetSearchElement.prototype.handleFacetSearchFocus = function () {
        if (this.facetSearch.currentlyDisplayedResults == null) {
            this.facetSearch.displayNewValues();
            this.addAriaAttributes();
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
        this.removeAriaAttributes();
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
            type: 'text',
            autocapitalize: 'off',
            autocorrect: 'off',
            ariaLabel: Strings_1.l('SearchFacetResults', this.facetSearch.facetTitle),
            ariaHaspopup: 'true',
            ariaAutocomplete: 'list'
        }).el;
    };
    FacetSearchElement.prototype.handleScrollEvent = function () {
        if (this.triggeredScroll) {
            this.triggeredScroll = false;
        }
        else {
            this.facetSearchUserInputHandler.handleFacetSearchResultsScroll();
        }
    };
    FacetSearchElement.prototype.addAriaAttributes = function () {
        if (!this.input || !this.combobox) {
            return;
        }
        this.combobox.setAttribute('role', 'combobox');
        this.combobox.setAttribute('aria-owns', this.facetSearchId);
        this.input.setAttribute('aria-controls', this.facetSearchId);
        this.input.setAttribute('aria-expanded', 'true');
        this.facetSearch.setExpandedFacetSearchAccessibilityAttributes(this.searchResults);
    };
    FacetSearchElement.prototype.removeAriaAttributes = function () {
        if (!this.input || !this.combobox) {
            return;
        }
        this.combobox.removeAttribute('role');
        this.combobox.removeAttribute('aria-owns');
        this.input.removeAttribute('aria-controls');
        this.input.removeAttribute('aria-activedescendant');
        this.input.setAttribute('aria-expanded', 'false');
        this.facetSearch.setCollapsedFacetSearchAccessibilityAttributes();
    };
    return FacetSearchElement;
}());
exports.FacetSearchElement = FacetSearchElement;


/***/ }),

/***/ 472:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var DefaultSearchDropdownNavigator = /** @class */ (function () {
    function DefaultSearchDropdownNavigator(config) {
        this.config = config;
    }
    DefaultSearchDropdownNavigator.prototype.setAsCurrentResult = function (toSet) {
        this.currentResult && this.currentResult.removeClass('coveo-facet-search-current-result');
        this.currentResult = toSet;
        toSet.addClass('coveo-facet-search-current-result');
        this.updateSelectedOption(toSet);
    };
    DefaultSearchDropdownNavigator.prototype.focusNextElement = function () {
        this.moveCurrentResultDown();
    };
    DefaultSearchDropdownNavigator.prototype.focusPreviousElement = function () {
        this.moveCurrentResultUp();
    };
    DefaultSearchDropdownNavigator.prototype.moveCurrentResultDown = function () {
        var nextResult = this.currentResult.el.nextElementSibling;
        if (!nextResult) {
            nextResult = underscore_1.first(this.searchResults.children);
        }
        this.setAsCurrentResult(Dom_1.$$(nextResult));
        this.highlightAndShowCurrentResultWithKeyboard();
    };
    DefaultSearchDropdownNavigator.prototype.moveCurrentResultUp = function () {
        var previousResult = this.currentResult.el.previousElementSibling;
        if (!previousResult) {
            previousResult = underscore_1.last(this.searchResults.children);
        }
        this.setAsCurrentResult(Dom_1.$$(previousResult));
        this.highlightAndShowCurrentResultWithKeyboard();
    };
    DefaultSearchDropdownNavigator.prototype.highlightAndShowCurrentResultWithKeyboard = function () {
        this.currentResult.addClass('coveo-facet-search-current-result');
        this.config.setScrollTrigger(true);
        this.searchResults.scrollTop = this.currentResult.el.offsetTop;
    };
    Object.defineProperty(DefaultSearchDropdownNavigator.prototype, "searchResults", {
        get: function () {
            return this.config.searchResults;
        },
        enumerable: true,
        configurable: true
    });
    DefaultSearchDropdownNavigator.prototype.updateSelectedOption = function (option) {
        this.config.input.setAttribute('aria-activedescendant', option.getAttribute('id'));
        var previouslySelectedOption = Dom_1.$$(this.searchResults).find('[aria-selected^="true"]');
        previouslySelectedOption && previouslySelectedOption.setAttribute('aria-selected', 'false');
        option.setAttribute('aria-selected', 'true');
    };
    return DefaultSearchDropdownNavigator;
}());
exports.DefaultSearchDropdownNavigator = DefaultSearchDropdownNavigator;


/***/ }),

/***/ 473:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryValue_1 = __webpack_require__(544);
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

/***/ 474:
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
var popper_js_1 = __webpack_require__(93);
__webpack_require__(553);
var underscore_1 = __webpack_require__(0);
var InitializationEvents_1 = __webpack_require__(17);
var QueryStateModel_1 = __webpack_require__(13);
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var Dom_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(25);
var LocalStorageUtils_1 = __webpack_require__(55);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var FacetSort_1 = __webpack_require__(475);
/**
 * Handle the rendering of the {@link Facet} settings menu (typically the ... in the facet header).
 */
var FacetSettings = /** @class */ (function (_super) {
    __extends(FacetSettings, _super);
    function FacetSettings(sorts, facet) {
        var _this = _super.call(this, sorts, facet) || this;
        _this.sorts = sorts;
        _this.facet = facet;
        _this.customSortDirectionChange = false;
        _this.onDocumentClick = function () { return _this.close(); };
        _this.enabledSortsIgnoreRenderBecauseOfPairs = [];
        _this.filterDuplicateForRendering();
        return _this;
    }
    Object.defineProperty(FacetSettings.prototype, "isExpanded", {
        get: function () {
            return this.settingsButton && this.settingsButton.getAttribute('aria-expanded') === "" + true;
        },
        set: function (expanded) {
            this.settingsButton.setAttribute('aria-expanded', "" + expanded);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSettings.prototype, "firstFocusablePopupElement", {
        get: function () {
            return underscore_1.find(Dom_1.$$(this.settingsPopup).findAll('[tabindex]'), function (element) { return element.tabIndex >= 0; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Build the menu, hook click events.
     * @returns {HTMLElement}
     */
    FacetSettings.prototype.build = function () {
        var _this = this;
        this.buildSettingsButton();
        this.buildSettingsPopup();
        if (Utils_1.Utils.isNonEmptyArray(this.enabledSorts)) {
            this.sortSection = this.buildSortSection();
            if (this.enabledSortsAllowDirection()) {
                this.directionSection = this.buildDirectionSection();
            }
        }
        if (this.facet.options.enableSettingsFacetState) {
            this.saveStateSection = this.buildSaveStateSection();
            this.clearStateSection = this.buildClearStateSection();
        }
        if (this.facet.options.enableCollapse) {
            this.hideSection = this.buildHideSection();
            this.showSection = this.buildShowSection();
        }
        var appendCommon = function () {
            _this.appendIfNotUndefined(_this.saveStateSection);
            _this.appendIfNotUndefined(_this.clearStateSection);
            _this.appendIfNotUndefined(_this.hideSection);
            _this.appendIfNotUndefined(_this.showSection);
        };
        this.addOnDocumentClickHandler();
        this.addOnNukeHandler();
        if (Utils_1.Utils.isNonEmptyArray(this.enabledSorts)) {
            this.settingsPopup.appendChild(this.sortSection.element);
            underscore_1.each(this.directionSection, function (d) {
                _this.appendIfNotUndefined(d);
            });
            appendCommon();
        }
        else {
            appendCommon();
        }
        return this.settingsButton;
    };
    /**
     * Restore the facet state from local storage, and apply it in the query state model.
     */
    FacetSettings.prototype.loadSavedState = function () {
        if (this.facetStateLocalStorage) {
            // set the state from the settings only if there is nothing
            // in the query state model for the current facet
            var state = this.facetStateLocalStorage.load();
            var currentStateIncluded = this.facet.queryStateModel.get(this.includedStateAttribute);
            var currentStateExcluded = this.facet.queryStateModel.get(this.excludedStateAttribute);
            var currentStateOperator = this.facet.queryStateModel.get(this.operatorStateAttribute);
            if (!Utils_1.Utils.isNullOrUndefined(state) &&
                Utils_1.Utils.isEmptyArray(currentStateIncluded) &&
                Utils_1.Utils.isEmptyArray(currentStateExcluded) &&
                !Utils_1.Utils.isNonEmptyString(currentStateOperator)) {
                var toSet = {};
                toSet[this.includedStateAttribute] = state.included;
                toSet[this.excludedStateAttribute] = state.excluded;
                toSet[this.operatorStateAttribute] = state.operator;
                this.facet.queryStateModel.setMultiple(toSet);
                this.loadedFromSettings = toSet;
            }
        }
        else {
            this.facet.logger.info('Facet state local storage not enabled : See Facet.options.enableSettingsFacetState');
        }
    };
    /**
     * Take the current state of the facet and save it in the local storage.
     */
    FacetSettings.prototype.saveState = function () {
        if (this.facetStateLocalStorage) {
            this.facetStateLocalStorage.save({
                included: this.facet.queryStateModel.get(this.includedStateAttribute),
                excluded: this.facet.queryStateModel.get(this.excludedStateAttribute),
                operator: this.facet.queryStateModel.get(this.operatorStateAttribute)
            });
        }
        else {
            this.facet.logger.info('Facet state local storage not enabled : See Facet.options.enableSettingsFacetState');
        }
    };
    /**
     * Close the settings menu
     */
    FacetSettings.prototype.close = function () {
        if (!this.isExpanded) {
            return;
        }
        this.isExpanded = false;
        Dom_1.$$(this.settingsPopup).detach();
    };
    /**
     * Open the settings menu
     */
    FacetSettings.prototype.open = function () {
        var _this = this;
        Dom_1.$$(this.settingsPopup).insertAfter(this.settingsButton);
        new popper_js_1.default(this.settingsButton, this.settingsPopup);
        this.isExpanded = true;
        if (this.hideSection && this.showSection) {
            Dom_1.$$(this.hideSection).toggle(!Dom_1.$$(this.facet.element).hasClass('coveo-facet-collapsed'));
            Dom_1.$$(this.showSection).toggle(Dom_1.$$(this.facet.element).hasClass('coveo-facet-collapsed'));
        }
        if (this.facet.options.enableSettingsFacetState) {
            Dom_1.$$(this.clearStateSection).toggle(!Utils_1.Utils.isNullOrUndefined(this.facetStateLocalStorage.load()));
        }
        underscore_1.each(this.enabledSorts, function (criteria, i) {
            if (_this.activeSort.name == criteria.name.toLowerCase()) {
                _this.selectItem(_this.getSortItem(criteria.name));
            }
            else {
                _this.unselectItem(_this.getSortItem(criteria.name));
            }
        });
        var elementToFocus = this.firstFocusablePopupElement;
        if (elementToFocus) {
            elementToFocus.focus();
        }
    };
    FacetSettings.prototype.getSortItem = function (sortName) {
        return underscore_1.find(this.sortSection.sortItems, function (sortItem) {
            return Dom_1.$$(sortItem).getAttribute('data-sort-name').toLowerCase() == sortName.replace('ascending|descending', '').toLowerCase();
        });
    };
    Object.defineProperty(FacetSettings.prototype, "button", {
        get: function () {
            return this.settingsButton;
        },
        enumerable: true,
        configurable: true
    });
    FacetSettings.prototype.buildSettingsButton = function () {
        var _this = this;
        this.settingsButton = Dom_1.$$('div', { className: 'coveo-facet-header-settings', 'aria-haspopup': 'true' }).el;
        this.settingsButton.innerHTML = SVGIcons_1.SVGIcons.icons.more;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.settingsButton, 'coveo-facet-settings-more-svg');
        this.hideElementOnMouseEnterLeave(this.settingsButton);
        this.isExpanded = false;
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.settingsButton)
            .withLabel(Strings_1.l('Settings'))
            .withClickAction(function (e) { return _this.handleSettingsButtonClick(e); })
            .withEnterKeyboardAction(function (e) { return _this.handleSettingsButtonClick(e); })
            .build();
    };
    FacetSettings.prototype.hideElementOnMouseEnterLeave = function (el) {
        var _this = this;
        var mouseLeave = function () { return (_this.closeTimeout = window.setTimeout(function () { return _this.close(); }, 300)); };
        var mouseEnter = function () { return clearTimeout(_this.closeTimeout); };
        Dom_1.$$(el).on('mouseleave', mouseLeave);
        Dom_1.$$(el).on('mouseenter', mouseEnter);
        Dom_1.$$(el).on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ESCAPE, function () { return _this.handleKeyboardClose(); }));
    };
    FacetSettings.prototype.handleKeyboardClose = function () {
        this.close();
        this.settingsButton.focus();
    };
    FacetSettings.prototype.buildSettingsPopup = function () {
        var _this = this;
        this.settingsPopup = Dom_1.$$('div', { className: 'coveo-facet-settings-popup' }).el;
        this.hideElementOnMouseEnterLeave(this.settingsPopup);
        Dom_1.$$(this.settingsPopup).on('focusout', function (e) {
            if (e.relatedTarget && _this.settingsPopup.contains(e.relatedTarget)) {
                return;
            }
            _this.close();
        });
    };
    FacetSettings.prototype.buildSortSection = function () {
        var sortSection = this.buildSection('coveo-facet-settings-section-sort');
        var sortSectionIcon = this.buildIcon('coveo-facet-settings-section-sort-svg', SVGIcons_1.SVGIcons.icons.sort);
        var sortSectionItems = this.buildItems();
        var sortTitle = document.createElement('div');
        Dom_1.$$(sortTitle).addClass('coveo-facet-settings-section-sort-title');
        Dom_1.$$(sortTitle).text(Strings_1.l('SortBy') + ' :');
        sortSectionItems.appendChild(sortTitle);
        var sortItems = this.buildSortSectionItems();
        underscore_1.each(sortItems, function (s) {
            sortSectionItems.appendChild(s);
        });
        sortSection.appendChild(sortSectionIcon);
        sortSection.appendChild(sortSectionItems);
        return { element: sortSection, sortItems: sortItems };
    };
    FacetSettings.prototype.buildSortSectionItems = function () {
        var _this = this;
        var elems = underscore_1.map(this.enabledSorts, function (enabledSort) {
            if (underscore_1.contains(_this.enabledSortsIgnoreRenderBecauseOfPairs, enabledSort)) {
                return undefined;
            }
            else {
                var elem = _this.buildItem(Strings_1.l(enabledSort.label), enabledSort.description);
                Dom_1.$$(elem).setAttribute('data-sort-name', enabledSort.name.toLowerCase().replace('ascending|descending', ''));
                new AccessibleButton_1.AccessibleButton()
                    .withElement(elem)
                    .withSelectAction(function (e) { return _this.handleClickSortButton(e, enabledSort); })
                    .withLabel(enabledSort.label)
                    .build();
                return elem;
            }
        });
        elems = underscore_1.compact(elems);
        return elems;
    };
    FacetSettings.prototype.closePopupAndUpdateSort = function () {
        this.close();
        if (this.activeSort.name != 'custom') {
            this.facet.updateSort(this.activeSort.name);
        }
        else {
            this.facet.updateSort('nosort');
            if (this.customSortDirectionChange) {
                this.customSortDirectionChange = false;
                this.facet.queryController.executeQuery();
            }
        }
    };
    FacetSettings.prototype.enabledSortsAllowDirection = function () {
        var _this = this;
        var allEnabledSortsWithPossibleDirectionToggle = underscore_1.filter(this.enabledSorts, function (facetSortDescription) {
            return facetSortDescription.directionToggle;
        });
        var allowToggle = underscore_1.filter(allEnabledSortsWithPossibleDirectionToggle, function (possibleDirectionToggle) {
            return underscore_1.findWhere(_this.enabledSorts, { name: possibleDirectionToggle.relatedSort }) != undefined;
        });
        return allowToggle.length > 0;
    };
    FacetSettings.prototype.buildDirectionSection = function () {
        var _this = this;
        var directionAscendingSection = this.buildAscendingOrDescendingSection('Ascending');
        var iconAscending = this.buildIcon('coveo-facet-settings-section-direction-ascending-svg', SVGIcons_1.SVGIcons.icons.ascending);
        var iconDescending = this.buildIcon('coveo-facet-settings-section-direction-descending-svg', SVGIcons_1.SVGIcons.icons.descending);
        var directionItemsAscending = this.buildItems();
        var ascending = this.buildAscendingOrDescending('Ascending');
        directionItemsAscending.appendChild(ascending);
        directionAscendingSection.appendChild(iconAscending);
        directionAscendingSection.appendChild(directionItemsAscending);
        new AccessibleButton_1.AccessibleButton()
            .withElement(ascending)
            .withoutLabelOrTitle()
            .withSelectAction(function () { return _this.handleDirectionClick(ascending, 'ascending'); })
            .build();
        this.unselectSection(directionAscendingSection);
        var directionDescendingSection = this.buildAscendingOrDescendingSection('Descending');
        var directionItemsDescending = this.buildItems();
        var descending = this.buildAscendingOrDescending('Descending');
        directionItemsDescending.appendChild(descending);
        directionDescendingSection.appendChild(iconDescending);
        directionDescendingSection.appendChild(directionItemsDescending);
        new AccessibleButton_1.AccessibleButton()
            .withElement(descending)
            .withoutLabelOrTitle()
            .withSelectAction(function () { return _this.handleDirectionClick(descending, 'descending'); })
            .build();
        this.unselectSection(directionDescendingSection);
        if (!this.activeSort.directionToggle) {
            Dom_1.$$(directionAscendingSection).addClass('coveo-facet-settings-disabled');
            Dom_1.$$(directionDescendingSection).addClass('coveo-facet-settings-disabled');
        }
        else {
            this.selectItem(this.getItems(directionAscendingSection)[0]);
        }
        return [directionAscendingSection, directionDescendingSection];
    };
    FacetSettings.prototype.buildSaveStateSection = function () {
        var _this = this;
        var saveStateSection = this.buildSection('coveo-facet-settings-section-save-state');
        var icon = this.buildIcon('coveo-facet-settings-section-save-state-svg', SVGIcons_1.SVGIcons.icons.dropdownMore);
        var saveStateItems = this.buildItems();
        this.facetStateLocalStorage = new LocalStorageUtils_1.LocalStorageUtils('facet-state-' + this.facet.options.id);
        this.includedStateAttribute = QueryStateModel_1.QueryStateModel.getFacetId(this.facet.options.id);
        this.excludedStateAttribute = QueryStateModel_1.QueryStateModel.getFacetId(this.facet.options.id, false);
        this.operatorStateAttribute = QueryStateModel_1.QueryStateModel.getFacetOperator(this.facet.options.id);
        var saveStateItem = document.createElement('div');
        Dom_1.$$(saveStateItem).addClass('coveo-facet-settings-item');
        saveStateItem.setAttribute('title', Strings_1.l('SaveFacetState'));
        Dom_1.$$(saveStateItem).text(Strings_1.l('SaveFacetState'));
        saveStateItems.appendChild(saveStateItem);
        saveStateSection.appendChild(icon);
        saveStateSection.appendChild(saveStateItems);
        new AccessibleButton_1.AccessibleButton()
            .withElement(saveStateSection)
            .withSelectAction(function () { return _this.handleSaveStateClick(); })
            .withoutLabelOrTitle()
            .build();
        return saveStateSection;
    };
    FacetSettings.prototype.buildClearStateSection = function () {
        var _this = this;
        var clearStateSection = this.buildSection('coveo-facet-settings-section-clear-state');
        var icon = this.buildIcon('coveo-facet-settings-section-clear-state-svg', SVGIcons_1.SVGIcons.icons.dropdownLess);
        var clearStateItems = this.buildItems();
        var clearStateItem = this.buildItem(Strings_1.l('ClearFacetState'));
        clearStateItems.appendChild(clearStateItem);
        clearStateSection.appendChild(icon);
        clearStateSection.appendChild(clearStateItems);
        new AccessibleButton_1.AccessibleButton()
            .withElement(clearStateSection)
            .withSelectAction(function () { return _this.handleClearStateClick(); })
            .withoutLabelOrTitle()
            .build();
        return clearStateSection;
    };
    FacetSettings.prototype.buildHideSection = function () {
        var _this = this;
        var hideSection = this.buildSection('coveo-facet-settings-section-hide');
        var icon = this.buildIcon('coveo-facet-settings-section-hide-svg', SVGIcons_1.SVGIcons.icons.facetCollapse);
        var hideItems = this.buildItems();
        var hideItem = this.buildItem(Strings_1.l('Collapse'));
        hideItems.appendChild(hideItem);
        hideSection.appendChild(icon);
        hideSection.appendChild(hideItems);
        new AccessibleButton_1.AccessibleButton()
            .withElement(hideSection)
            .withSelectAction(function () {
            _this.facet.facetHeader.collapseFacet();
            _this.close();
        })
            .withLabel(Strings_1.l('CollapseFacet', this.facet.options.title))
            .build();
        return hideSection;
    };
    FacetSettings.prototype.buildShowSection = function () {
        var _this = this;
        var showSection = this.buildSection('coveo-facet-settings-section-show');
        var icon = this.buildIcon('coveo-facet-settings-section-show-svg', SVGIcons_1.SVGIcons.icons.facetExpand);
        var showItems = this.buildItems();
        var showItem = this.buildItem(Strings_1.l('Expand'));
        showItems.appendChild(showItem);
        showSection.appendChild(icon);
        showSection.appendChild(showItems);
        new AccessibleButton_1.AccessibleButton()
            .withElement(showSection)
            .withSelectAction(function () {
            _this.facet.facetHeader.expandFacet();
            _this.close();
        })
            .withLabel(Strings_1.l('ExpandFacet', this.facet.options.title))
            .build();
        return showSection;
    };
    FacetSettings.prototype.buildIcon = function (iconClass, svgIcon) {
        if (iconClass && svgIcon) {
            var icon = Dom_1.$$('div', { className: 'coveo-icon-container' }, svgIcon);
            SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, iconClass);
            return icon.el;
        }
        else {
            return Dom_1.$$('div', { className: 'coveo-icon' }).el;
        }
    };
    FacetSettings.prototype.buildAscendingOrDescending = function (direction) {
        var elem = this.buildItem(Strings_1.l(direction));
        elem.setAttribute('aria-disabled', 'true');
        elem.setAttribute('data-direction', direction.toLowerCase());
        return elem;
    };
    FacetSettings.prototype.buildAscendingOrDescendingSection = function (direction) {
        return this.buildSection('coveo-facet-settings-section-direction-' + direction.toLowerCase());
    };
    FacetSettings.prototype.buildItem = function (label, title) {
        if (title === void 0) { title = label; }
        return Dom_1.$$('div', {
            className: 'coveo-facet-settings-item',
            title: title
        }, underscore_1.escape(label)).el;
    };
    FacetSettings.prototype.buildItems = function () {
        var elem = document.createElement('div');
        Dom_1.$$(elem).addClass('coveo-facet-settings-items');
        return elem;
    };
    FacetSettings.prototype.buildSection = function (className) {
        var section = document.createElement('div');
        Dom_1.$$(section).addClass(['coveo-facet-settings-section', className]);
        return section;
    };
    FacetSettings.prototype.handleSettingsButtonClick = function (event) {
        event.stopPropagation();
        var settingsPopupIsOpen = !Utils_1.Utils.isNullOrUndefined(this.settingsPopup.parentElement);
        settingsPopupIsOpen ? this.close() : this.open();
    };
    FacetSettings.prototype.handleClickSortButton = function (e, enabledSort) {
        if (this.activeSort != enabledSort && this.activeSort.relatedSort != enabledSort.name) {
            this.activeSort = enabledSort;
            if (enabledSort.directionToggle && underscore_1.contains(this.enabledSorts, FacetSettings.availableSorts[this.activeSort.relatedSort])) {
                this.activateDirectionSection();
            }
            else {
                this.disableDirectionSection();
            }
            this.unselectSection(this.sortSection.element);
            this.selectItem(e.target);
            this.closePopupAndUpdateSort();
        }
    };
    FacetSettings.prototype.handleDirectionClick = function (item, direction) {
        var _this = this;
        if (item.getAttribute('aria-disabled') === 'false' && this.activeSort.name.indexOf(direction) === -1) {
            this.activeSort = FacetSettings.availableSorts[this.activeSort.relatedSort];
            underscore_1.each(this.directionSection, function (d) {
                _this.unselectSection(d);
            });
            this.selectItem(item);
            if (this.activeSort.name == 'custom' && this.customSortDirection != direction) {
                this.customSortDirection = direction;
                this.customSortDirectionChange = true;
            }
            this.closePopupAndUpdateSort();
        }
    };
    FacetSettings.prototype.handleSaveStateClick = function () {
        this.saveState();
        this.close();
    };
    FacetSettings.prototype.handleClearStateClick = function () {
        var _this = this;
        this.facetStateLocalStorage.remove();
        this.facet.reset();
        this.close();
        this.facet.triggerNewQuery(function () {
            return _this.facet.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetClearAll, {
                facetId: _this.facet.options.id,
                facetField: _this.facet.options.field.toString(),
                facetTitle: _this.facet.options.title
            });
        });
    };
    FacetSettings.prototype.addOnNukeHandler = function () {
        var _this = this;
        Dom_1.$$(this.facet.root).on(InitializationEvents_1.InitializationEvents.nuke, function () { return _this.handleNuke(); });
    };
    FacetSettings.prototype.addOnDocumentClickHandler = function () {
        var _this = this;
        document.addEventListener('click', function () { return _this.onDocumentClick(); });
    };
    FacetSettings.prototype.getCurrentDirectionItem = function (directionSection) {
        var _this = this;
        if (directionSection === void 0) { directionSection = this.directionSection; }
        var found;
        underscore_1.each(directionSection, function (direction) {
            if (!found) {
                found = underscore_1.find(_this.getItems(direction), function (direction) {
                    return _this.activeSort.name.indexOf(direction.getAttribute('data-direction')) != -1;
                });
            }
        });
        if (!found) {
            found = directionSection[0];
        }
        return found;
    };
    FacetSettings.prototype.activateDirectionSection = function () {
        var _this = this;
        underscore_1.each(this.directionSection, function (direction) {
            Dom_1.$$(direction).removeClass('coveo-facet-settings-disabled');
            Dom_1.$$(direction).find('.coveo-facet-settings-item').setAttribute('aria-disabled', 'false');
            _this.unselectSection(direction);
        });
        this.selectItem(this.getCurrentDirectionItem());
    };
    FacetSettings.prototype.disableDirectionSection = function () {
        var _this = this;
        underscore_1.each(this.directionSection, function (direction) {
            Dom_1.$$(direction).addClass('coveo-facet-settings-disabled');
            Dom_1.$$(direction).find('.coveo-facet-settings-item').setAttribute('aria-disabled', 'true');
            _this.unselectSection(direction);
        });
    };
    FacetSettings.prototype.getItems = function (section) {
        return Dom_1.$$(section).findAll('.coveo-facet-settings-item');
    };
    FacetSettings.prototype.unselectSection = function (section) {
        var _this = this;
        underscore_1.each(this.getItems(section), function (i) { return _this.unselectItem(i); });
    };
    FacetSettings.prototype.selectItem = function (item) {
        if (item) {
            Dom_1.$$(item).addClass('coveo-selected');
            item.setAttribute('aria-pressed', 'true');
        }
    };
    FacetSettings.prototype.unselectItem = function (item) {
        if (item) {
            Dom_1.$$(item).removeClass('coveo-selected');
            item.setAttribute('aria-pressed', 'false');
        }
    };
    FacetSettings.prototype.filterDuplicateForRendering = function () {
        var _this = this;
        underscore_1.each(this.enabledSorts, function (enabledSort, i) {
            if (enabledSort.relatedSort != null) {
                for (var j = i + 1; j < _this.enabledSorts.length; j++) {
                    if (_this.enabledSorts[j].name == enabledSort.relatedSort) {
                        _this.enabledSortsIgnoreRenderBecauseOfPairs.push(_this.enabledSorts[j]);
                        break;
                    }
                }
            }
        });
    };
    FacetSettings.prototype.appendIfNotUndefined = function (toAppend) {
        if (!Utils_1.Utils.isNullOrUndefined(toAppend)) {
            this.settingsPopup.appendChild(toAppend);
        }
    };
    FacetSettings.prototype.handleNuke = function () {
        document.removeEventListener('click', this.onDocumentClick);
    };
    return FacetSettings;
}(FacetSort_1.FacetSort));
exports.FacetSettings = FacetSettings;


/***/ }),

/***/ 475:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Strings_1 = __webpack_require__(6);
var FacetSettings_1 = __webpack_require__(474);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var FacetSort = /** @class */ (function () {
    function FacetSort(sorts, facet) {
        var _this = this;
        this.facet = facet;
        this.enabledSorts = [];
        this.customSortDirection = 'ascending';
        _.each(sorts, function (sortToActivate) {
            var newSortToEnable = FacetSettings_1.FacetSettings.availableSorts[sortToActivate.toLowerCase()];
            if (newSortToEnable != undefined) {
                _this.enabledSorts.push(newSortToEnable);
            }
        });
        this.removeEnabledSortsBasedOnFacetType();
        if (Utils_1.Utils.isNonEmptyArray(this.enabledSorts)) {
            if (this.facet.options.sortCriteria != undefined) {
                this.activeSort = _.find(this.enabledSorts, function (enabledSort) {
                    return enabledSort.name == _this.facet.options.sortCriteria;
                });
            }
            if (!this.activeSort) {
                this.activeSort = this.enabledSorts[0];
            }
        }
    }
    FacetSort.prototype.removeEnabledSortsBasedOnFacetType = function () {
        if (Coveo.FacetRange && this.facet instanceof Coveo.FacetRange) {
            var facetRange = this.facet;
            if (facetRange.options['slider']) {
                this.enabledSorts = [];
            }
        }
    };
    FacetSort.availableSorts = {
        score: {
            label: Strings_1.l('Score'),
            directionToggle: false,
            description: Strings_1.l('ScoreDescription'),
            name: 'score'
        },
        occurrences: {
            label: Strings_1.l('Occurrences'),
            directionToggle: false,
            description: Strings_1.l('OccurrencesDescription'),
            name: 'occurrences'
        },
        alphaascending: {
            label: Strings_1.l('Label'),
            directionToggle: true,
            description: Strings_1.l('LabelDescription'),
            name: 'alphaascending',
            relatedSort: 'alphadescending'
        },
        alphadescending: {
            label: Strings_1.l('Label'),
            directionToggle: true,
            description: Strings_1.l('LabelDescription'),
            name: 'alphadescending',
            relatedSort: 'alphaascending'
        },
        computedfieldascending: {
            label: Strings_1.l('Value'),
            directionToggle: true,
            description: Strings_1.l('ValueDescription'),
            name: 'computedfieldascending',
            relatedSort: 'computedfielddescending'
        },
        computedfielddescending: {
            label: Strings_1.l('Value'),
            directionToggle: true,
            description: Strings_1.l('ValueDescription'),
            name: 'computedfielddescending',
            relatedSort: 'computedfieldascending'
        },
        chisquare: {
            label: Strings_1.l('RelativeFrequency'),
            directionToggle: false,
            description: Strings_1.l('RelativeFrequencyDescription'),
            name: 'chisquare'
        },
        nosort: {
            label: Strings_1.l('Nosort'),
            directionToggle: false,
            description: Strings_1.l('NosortDescription'),
            name: 'nosort'
        },
        custom: {
            label: Strings_1.l('Custom'),
            directionToggle: true,
            description: Strings_1.l('CustomDescription'),
            name: 'custom',
            relatedSort: 'custom'
        }
    };
    return FacetSort;
}());
exports.FacetSort = FacetSort;


/***/ }),

/***/ 476:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
__webpack_require__(533);
var SVGIcons_1 = __webpack_require__(12);
var SVGDom_1 = __webpack_require__(16);
var AccessibleButton_1 = __webpack_require__(15);
var FacetHeader = /** @class */ (function () {
    function FacetHeader(options) {
        this.options = options;
        this.element = document.createElement('div');
        Dom_1.$$(this.element).addClass('coveo-facet-header');
    }
    FacetHeader.prototype.build = function () {
        var titleSection = Dom_1.$$('div', {
            className: 'coveo-facet-header-title-section'
        });
        if (this.options.icon != undefined) {
            this.iconElement = this.buildIcon();
            titleSection.append(this.iconElement);
        }
        titleSection.append(this.buildTitle());
        this.waitElement = this.buildWaitAnimation();
        titleSection.append(this.waitElement);
        this.element.appendChild(titleSection.el);
        var settingsSection = Dom_1.$$('div', {
            className: 'coveo-facet-header-settings-section'
        });
        this.eraserElement = this.buildEraser();
        settingsSection.append(this.eraserElement);
        if (this.options.facet) {
            this.operatorElement = this.buildOperatorToggle();
            settingsSection.append(this.operatorElement);
            Dom_1.$$(this.operatorElement).toggle(this.options.facet.options.enableTogglingOperator);
        }
        if (this.options.settingsKlass) {
            this.sort = this.settings = new this.options.settingsKlass(this.options.availableSorts, this.options.facet);
            settingsSection.append(this.settings.build());
        }
        else if (this.options.sortKlass) {
            this.sort = new this.options.sortKlass(this.options.availableSorts, this.options.facet);
        }
        this.element.appendChild(settingsSection.el);
        return this.element;
    };
    FacetHeader.prototype.switchToAnd = function () {
        if (this.options.facet) {
            this.options.facet.options.useAnd = true;
            this.rebuildOperatorToggle();
            this.updateOperatorQueryStateModel();
        }
    };
    FacetHeader.prototype.switchToOr = function () {
        if (this.options.facet) {
            this.options.facet.options.useAnd = false;
            this.rebuildOperatorToggle();
            this.updateOperatorQueryStateModel();
        }
    };
    FacetHeader.prototype.collapseFacet = function () {
        if (this.collapseElement && this.expandElement) {
            Dom_1.$$(this.collapseElement).hide();
            Dom_1.$$(this.expandElement).show();
        }
        Dom_1.$$(this.options.facetElement).addClass('coveo-facet-collapsed');
    };
    FacetHeader.prototype.expandFacet = function () {
        if (this.collapseElement && this.expandElement) {
            Dom_1.$$(this.expandElement).hide();
            Dom_1.$$(this.collapseElement).show();
        }
        Dom_1.$$(this.options.facetElement).removeClass('coveo-facet-collapsed');
    };
    FacetHeader.prototype.updateOperatorQueryStateModel = function () {
        if (this.options.facet && this.options.facet.options.enableTogglingOperator) {
            var valueToSet = '';
            if (this.options.facet.getSelectedValues().length != 0 || this.options.facet.getExcludedValues().length != 0) {
                valueToSet = this.options.facet.options.useAnd ? 'and' : 'or';
            }
            this.options.facet.queryStateModel.set(this.options.facet.operatorAttributeId, valueToSet);
        }
    };
    FacetHeader.prototype.rebuildOperatorToggle = function () {
        var newElement = this.buildOperatorToggle();
        if (this.operatorElement) {
            Dom_1.$$(this.operatorElement).replaceWith(newElement);
        }
        this.operatorElement = newElement;
    };
    FacetHeader.prototype.buildIcon = function () {
        var cssClassForIcon;
        if (this.options.icon) {
            cssClassForIcon = 'coveo-icon-custom ' + this.options.icon;
        }
        else {
            cssClassForIcon = 'coveo-icon ' + this.options.field.substr(1);
        }
        this.iconElement = document.createElement('div');
        Dom_1.$$(this.iconElement).addClass(cssClassForIcon);
        return this.iconElement;
    };
    FacetHeader.prototype.buildWaitAnimation = function () {
        this.waitElement = Dom_1.$$('div', { className: 'coveo-facet-header-wait-animation' }, SVGIcons_1.SVGIcons.icons.loading).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.waitElement, 'coveo-facet-header-wait-animation-svg');
        this.waitElement.style.visibility = 'hidden';
        return this.waitElement;
    };
    FacetHeader.prototype.buildOperatorToggle = function () {
        var _this = this;
        var label = Strings_1.l('SwitchTo', this.options.facet.options.useAnd ? Strings_1.l('Or') : Strings_1.l('And'));
        var icon = Dom_1.$$('span', { className: 'coveo-' + (this.options.facet.options.useAnd ? 'and' : 'or') }, SVGIcons_1.SVGIcons.icons.orAnd);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, 'coveo-or-and-svg');
        var toggle = Dom_1.$$('div', {
            className: 'coveo-facet-header-operator',
            title: label
        });
        toggle.append(icon.el);
        new AccessibleButton_1.AccessibleButton()
            .withElement(toggle)
            .withLabel(label)
            .withSelectAction(function () { return _this.handleOperatorClick(); })
            .build();
        return toggle.el;
    };
    FacetHeader.prototype.handleOperatorClick = function () {
        var _this = this;
        if (this.options.facet.options.useAnd) {
            this.options.facet.switchToOr();
        }
        else {
            this.options.facet.switchToAnd();
        }
        if (this.options.facet.getSelectedValues().length != 0) {
            var operatorNow_1 = this.options.facet.options.useAnd ? 'AND' : 'OR';
            var operatorBefore_1 = this.options.facet.options.useAnd ? 'OR' : 'AND';
            this.options.facet.triggerNewQuery(function () {
                return _this.options.facet.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetToggle, {
                    facetId: _this.options.facet.options.id,
                    facetField: _this.options.field.toString(),
                    facetOperatorBefore: operatorBefore_1,
                    facetOperatorAfter: operatorNow_1,
                    facetTitle: _this.options.title
                });
            });
        }
    };
    FacetHeader.prototype.buildTitle = function () {
        var title = Dom_1.$$('div', { className: 'coveo-facet-header-title' });
        title.text(this.options.title);
        title.setAttribute('role', 'heading');
        title.setAttribute('aria-level', '2');
        title.setAttribute('aria-label', Strings_1.l('FacetTitle', this.options.title) + ".");
        return title.el;
    };
    FacetHeader.prototype.buildEraser = function () {
        var _this = this;
        var eraser = Dom_1.$$('div', { className: 'coveo-facet-header-eraser' }, SVGIcons_1.SVGIcons.icons.mainClear);
        SVGDom_1.SVGDom.addClassToSVGInContainer(eraser.el, 'coveo-facet-header-eraser-svg');
        new AccessibleButton_1.AccessibleButton()
            .withElement(eraser.el)
            .withLabel(Strings_1.l('Clear', this.options.title))
            .withClickAction(function () { return _this.onEraserClick(); })
            .withEnterKeyboardAction(function () { return _this.onEraserClick(); })
            .build();
        return eraser.el;
    };
    FacetHeader.prototype.onEraserClick = function () {
        var cmp = this.options.facet || this.options.facetSlider;
        cmp.reset();
        cmp.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetClearAll, {
            facetId: cmp.options.id,
            facetField: cmp.options.field.toString(),
            facetTitle: cmp.options.title
        });
        cmp.queryController.executeQuery();
    };
    return FacetHeader;
}());
exports.FacetHeader = FacetHeader;


/***/ }),

/***/ 477:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(537);
var underscore_1 = __webpack_require__(0);
var Assert_1 = __webpack_require__(5);
var AccessibleButton_1 = __webpack_require__(15);
var Dom_1 = __webpack_require__(1);
var SVGIcons_1 = __webpack_require__(12);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Strings_1 = __webpack_require__(6);
var BreadcrumbValueElement = /** @class */ (function () {
    function BreadcrumbValueElement(facet, facetValue) {
        this.facet = facet;
        this.facetValue = facetValue;
    }
    BreadcrumbValueElement.prototype.build = function () {
        Assert_1.Assert.exists(this.facetValue);
        var _a = this.buildElements(), container = _a.container, caption = _a.caption, clear = _a.clear, listContainer = _a.listContainer;
        container.append(caption.el);
        container.append(clear.el);
        listContainer.append(container.el);
        return listContainer;
    };
    BreadcrumbValueElement.prototype.getBreadcrumbTooltip = function () {
        var tooltipParts = [
            this.facet.getValueCaption(this.facetValue),
            this.facetValue.getFormattedCount(),
            this.facetValue.getFormattedComputedField(this.facet.options.computedFieldFormat)
        ];
        return underscore_1.compact(tooltipParts).join(' ');
    };
    BreadcrumbValueElement.prototype.buildElements = function () {
        return {
            container: this.buildContainer(),
            clear: this.buildClear(),
            caption: this.buildCaption(),
            listContainer: this.buildListContainer()
        };
    };
    BreadcrumbValueElement.prototype.buildContainer = function () {
        var _this = this;
        var container = Dom_1.$$('div', {
            className: 'coveo-facet-breadcrumb-value'
        });
        container.toggleClass('coveo-selected', this.facetValue.selected);
        container.toggleClass('coveo-excluded', this.facetValue.excluded);
        var labelString = this.facetValue.excluded ? 'Unexclude' : 'RemoveFilterOn';
        var label = Strings_1.l(labelString, this.facet.getValueCaption(this.facetValue));
        new AccessibleButton_1.AccessibleButton()
            .withElement(container)
            .withLabel(label)
            .withSelectAction(function () { return _this.selectAction(); })
            .build();
        return container;
    };
    BreadcrumbValueElement.prototype.buildListContainer = function () {
        return Dom_1.$$('li', {
            className: 'coveo-facet-breadcrumb-value-list-item'
        });
    };
    BreadcrumbValueElement.prototype.buildClear = function () {
        var clear = Dom_1.$$('span', {
            className: 'coveo-facet-breadcrumb-clear'
        }, SVGIcons_1.SVGIcons.icons.mainClear);
        return clear;
    };
    BreadcrumbValueElement.prototype.buildCaption = function () {
        var caption = Dom_1.$$('span', {
            className: 'coveo-facet-breadcrumb-caption'
        });
        caption.text(this.facet.getValueCaption(this.facetValue));
        return caption;
    };
    BreadcrumbValueElement.prototype.selectAction = function () {
        var _this = this;
        if (this.facetValue.excluded) {
            this.facet.unexcludeValue(this.facetValue.value);
        }
        else {
            this.facet.deselectValue(this.facetValue.value);
        }
        this.facet.triggerNewQuery(function () {
            return _this.facet.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbFacet, {
                facetId: _this.facet.options.id,
                facetField: _this.facet.options.field.toString(),
                facetValue: _this.facetValue.value,
                facetTitle: _this.facet.options.title
            });
        });
        this.focusOnContainer();
    };
    BreadcrumbValueElement.prototype.focusOnContainer = function () {
        var breadcrumb = underscore_1.first(this.facet.searchInterface.getComponents('Breadcrumb'));
        breadcrumb ? breadcrumb.element.focus() : null;
    };
    return BreadcrumbValueElement;
}());
exports.BreadcrumbValueElement = BreadcrumbValueElement;


/***/ }),

/***/ 478:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Globalize = __webpack_require__(23);
var underscore_1 = __webpack_require__(0);
var Assert_1 = __webpack_require__(5);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var AccessibleButton_1 = __webpack_require__(15);
var BreadcrumbValueList = /** @class */ (function () {
    function BreadcrumbValueList(facet, facetValues, breadcrumbValueElementKlass) {
        this.facet = facet;
        this.facetValues = facetValues;
        this.breadcrumbValueElementKlass = breadcrumbValueElementKlass;
        this.setExpandedAndCollapsed();
        this.elem = Dom_1.$$('div', {
            className: 'coveo-facet-breadcrumb'
        }).el;
        var title = Dom_1.$$('span');
        title.addClass('coveo-facet-breadcrumb-title');
        title.text(this.facet.options.title + ':');
        this.elem.appendChild(title.el);
        this.valueContainer = Dom_1.$$('ul', {
            className: 'coveo-facet-breadcrumb-values'
        }).el;
        this.elem.appendChild(this.valueContainer);
    }
    BreadcrumbValueList.prototype.build = function () {
        this.buildExpanded();
        if (this.collapsed.length != 0) {
            this.buildCollapsed();
        }
        return this.elem;
    };
    BreadcrumbValueList.prototype.buildAsString = function () {
        this.build();
        if (this.elem) {
            return (this.facet.options.title + ": " +
                underscore_1.map(Dom_1.$$(this.elem).findAll('.coveo-facet-breadcrumb-value'), function (value) {
                    return Dom_1.$$(value).text();
                }).join(', '));
        }
        return '';
    };
    BreadcrumbValueList.prototype.buildExpanded = function () {
        var _this = this;
        underscore_1.each(this.expanded, function (value, index) {
            var elementBreadcrumb = new _this.breadcrumbValueElementKlass(_this.facet, value).build();
            _this.valueContainer.appendChild(elementBreadcrumb.el);
        });
    };
    BreadcrumbValueList.prototype.buildCollapsed = function () {
        var _this = this;
        var numberOfSelected = underscore_1.filter(this.collapsed, function (value) { return value.selected; }).length;
        var numberOfExcluded = underscore_1.filter(this.collapsed, function (value) { return value.excluded; }).length;
        Assert_1.Assert.check(numberOfSelected + numberOfExcluded == this.collapsed.length);
        var listContainer = Dom_1.$$('li', {
            className: 'coveo-facet-breadcrumb-value-list-item'
        });
        var elem = Dom_1.$$('div', {
            className: 'coveo-facet-breadcrumb-value'
        });
        var multiCount = Dom_1.$$('span', {
            className: 'coveo-facet-breadcrumb-multi-count'
        });
        multiCount.text(Strings_1.l('NMore', Globalize.format(numberOfSelected + numberOfExcluded, 'n0')));
        elem.append(multiCount.el);
        var valueElements = underscore_1.map(this.collapsed, function (facetValue) {
            return new _this.breadcrumbValueElementKlass(_this.facet, facetValue);
        });
        var toolTips = underscore_1.map(valueElements, function (valueElement) {
            return valueElement.getBreadcrumbTooltip();
        });
        new AccessibleButton_1.AccessibleButton()
            .withElement(elem)
            .withTitle(toolTips.join('\n'))
            .withSelectAction(function () {
            var elements = [];
            underscore_1.each(valueElements, function (valueElement) {
                elements.push(valueElement.build().el);
            });
            underscore_1.each(elements, function (el) {
                Dom_1.$$(el).insertBefore(elem.el);
            });
            elem.detach();
        })
            .build();
        listContainer.append(elem.el);
        this.valueContainer.appendChild(listContainer.el);
    };
    BreadcrumbValueList.prototype.setExpandedAndCollapsed = function () {
        if (this.facetValues.length > this.facet.options.numberOfValuesInBreadcrumb) {
            this.collapsed = underscore_1.rest(this.facetValues, this.facet.options.numberOfValuesInBreadcrumb);
            this.expanded = underscore_1.first(this.facetValues, this.facet.options.numberOfValuesInBreadcrumb);
        }
        else {
            this.collapsed = [];
            this.expanded = this.facetValues;
        }
    };
    return BreadcrumbValueList;
}());
exports.BreadcrumbValueList = BreadcrumbValueList;


/***/ }),

/***/ 479:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var Facet_1 = __webpack_require__(67);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var InitializationEvents_1 = __webpack_require__(17);
var FacetSearchParameters_1 = __webpack_require__(172);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Strings_1 = __webpack_require__(6);
var Assert_1 = __webpack_require__(5);
var FacetValue_1 = __webpack_require__(112);
var StringUtils_1 = __webpack_require__(22);
var FacetValueElement_1 = __webpack_require__(127);
var ExternalModulesShim_1 = __webpack_require__(26);
var SearchInterface_1 = __webpack_require__(19);
var ResponsiveComponentsUtils_1 = __webpack_require__(126);
var FacetValuesOrder_1 = __webpack_require__(470);
__webpack_require__(538);
var underscore_1 = __webpack_require__(0);
var FacetSearchElement_1 = __webpack_require__(471);
/**
 * Used by the {@link Facet} component to render and handle the facet search part of each facet.
 */
var FacetSearch = /** @class */ (function () {
    function FacetSearch(facet, facetSearchValuesListKlass, root) {
        var _this = this;
        this.facet = facet;
        this.facetSearchValuesListKlass = facetSearchValuesListKlass;
        this.root = root;
        this.moreValuesToFetch = true;
        this.lastSearchWasEmpty = true;
        this.facetSearchElement = new FacetSearchElement_1.FacetSearchElement(this);
        this.onResize = underscore_1.debounce(function () {
            // Mitigate issues in UT where the window in phantom js might get resized in the scope of another test.
            // These would point to random instance of a test karma object, and not a real search interface.
            if (_this.facet instanceof Facet_1.Facet && _this.facet.searchInterface instanceof SearchInterface_1.SearchInterface) {
                if (_this.shouldPositionSearchResults()) {
                    _this.positionSearchResults();
                }
            }
        }, 250);
        this.onDocumentClick = function (e) {
            _this.handleClickElsewhere(e);
        };
        window.addEventListener('resize', this.onResize);
        document.addEventListener('click', function (e) { return _this.onDocumentClick(e); });
        Dom_1.$$(facet.root).on(InitializationEvents_1.InitializationEvents.nuke, function () { return _this.handleNuke(); });
    }
    Object.defineProperty(FacetSearch.prototype, "facetType", {
        get: function () {
            return Facet_1.Facet.ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearch.prototype, "facetTitle", {
        get: function () {
            return this.facet.options.title || this.facet.options.field.toString();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Build the search component and return an `HTMLElement` which can be appended to the {@link Facet}.
     * @returns {HTMLElement}
     */
    FacetSearch.prototype.build = function () {
        return this.buildBaseSearch();
    };
    /**
     * Position the search results at the footer of the facet.
     */
    FacetSearch.prototype.positionSearchResults = function () {
        this.facetSearchElement.positionSearchResults();
    };
    FacetSearch.prototype.fetchMoreValues = function () {
        this.triggerNewFacetSearch(this.buildParamsForFetchingMore());
    };
    /**
     * Dismiss the search results
     */
    FacetSearch.prototype.dismissSearchResults = function () {
        this.cancelAnyPendingSearchOperation();
        this.facet.unfadeInactiveValuesInMainList();
        Dom_1.$$(this.searchResults).empty();
        this.moreValuesToFetch = true;
        Dom_1.$$(this.search).removeClass('coveo-facet-search-no-results');
        Dom_1.$$(this.facet.element).removeClass('coveo-facet-searching');
        this.facetSearchElement.hideSearchResultsElement();
        this.input.value = '';
        Dom_1.$$(this.clear).hide();
        this.currentlyDisplayedResults = undefined;
    };
    /**
     * Trigger a new facet search, and display the results.
     * @param params
     */
    FacetSearch.prototype.triggerNewFacetSearch = function (params) {
        var _this = this;
        this.cancelAnyPendingSearchOperation();
        this.facetSearchElement.showFacetSearchWaitingAnimation();
        this.facet.logger.info('Triggering new facet search');
        this.facetSearchPromise = this.facet.facetQueryController.search(params);
        if (this.facetSearchPromise) {
            this.facetSearchPromise
                .then(function (fieldValues) {
                _this.facet.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetSearch, {
                    facetId: _this.facet.options.id,
                    facetField: _this.facet.options.field.toString(),
                    facetTitle: _this.facet.options.title
                }, _this.facet.root);
                _this.facet.logger.debug('Received field values', fieldValues);
                _this.processNewFacetSearchResults(fieldValues, params);
                _this.facetSearchElement.hideFacetSearchWaitingAnimation();
                _this.facetSearchPromise = undefined;
            })
                .catch(function (error) {
                // The request might be normally cancelled if another search is triggered.
                // In this case we do not hide the animation to prevent flicking.
                if (Utils_1.Utils.exists(error)) {
                    _this.facet.logger.error('Error while retrieving facet values', error);
                    _this.facetSearchElement.hideFacetSearchWaitingAnimation();
                }
                _this.facetSearchPromise = undefined;
                return null;
            });
        }
    };
    /**
     * Trigger the event associated with the focus of the search input.
     */
    FacetSearch.prototype.focus = function () {
        this.facetSearchElement.focus();
    };
    Object.defineProperty(FacetSearch.prototype, "searchResults", {
        get: function () {
            return this.facetSearchElement.searchResults;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearch.prototype, "searchBarIsAnimating", {
        get: function () {
            return this.facetSearchElement.searchBarIsAnimating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearch.prototype, "search", {
        get: function () {
            return this.facetSearchElement.search;
        },
        enumerable: true,
        configurable: true
    });
    FacetSearch.prototype.setExpandedFacetSearchAccessibilityAttributes = function (searchResultsElement) {
        this.facet.setExpandedFacetSearchAccessibilityAttributes(searchResultsElement);
    };
    FacetSearch.prototype.setCollapsedFacetSearchAccessibilityAttributes = function () {
        this.facet.setCollapsedFacetSearchAccessibilityAttributes();
    };
    FacetSearch.prototype.keyboardEventDefaultHandler = function () {
        this.moreValuesToFetch = true;
        this.highlightCurrentQueryWithinSearchResults();
        if (!this.inputIsEmpty()) {
            this.lastSearchWasEmpty = false;
            this.displayNewValues(this.buildParamsForNormalSearch());
        }
        else if (!this.lastSearchWasEmpty) {
            // This normally happen if a user delete the search box content to go back to "empty" state.
            this.currentlyDisplayedResults = undefined;
            Dom_1.$$(this.searchResults).empty();
            this.lastSearchWasEmpty = true;
            this.displayNewValues(this.buildParamsForFetchingMore());
        }
    };
    FacetSearch.prototype.keyboardNavigationEnterPressed = function (event) {
        if (event.shiftKey) {
            this.triggerNewFacetSearch(this.buildParamsForNormalSearch());
        }
        else {
            if (this.searchResults.style.display != 'none') {
                this.performActionOnCurrentSearchResult();
                this.dismissSearchResults();
            }
            else if (Dom_1.$$(this.search).is('.coveo-facet-search-no-results')) {
                this.selectAllValuesMatchingSearch();
            }
        }
    };
    FacetSearch.prototype.keyboardNavigationDeletePressed = function (event) {
        if (event.shiftKey) {
            this.performExcludeActionOnCurrentSearchResult();
            this.dismissSearchResults();
            this.input.value = '';
        }
    };
    FacetSearch.prototype.displayNewValues = function (params) {
        var _this = this;
        if (params === void 0) { params = this.buildParamsForExcludingCurrentlyDisplayedValues(); }
        this.cancelAnyPendingSearchOperation();
        this.facetSearchTimeout = window.setTimeout(function () {
            _this.triggerNewFacetSearch(params);
        }, this.facet.options.facetSearchDelay);
    };
    FacetSearch.prototype.getCaptions = function () {
        return Dom_1.$$(this.searchResults).findAll('.coveo-facet-value-caption');
    };
    FacetSearch.prototype.getValueInInputForFacetSearch = function () {
        return this.facetSearchElement.getValueInInputForFacetSearch();
    };
    FacetSearch.prototype.updateAriaLive = function (text) {
        this.facet.searchInterface.ariaLive.updateText(text);
    };
    Object.defineProperty(FacetSearch.prototype, "input", {
        get: function () {
            return this.facetSearchElement.input;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearch.prototype, "clear", {
        get: function () {
            return this.facetSearchElement.clear;
        },
        enumerable: true,
        configurable: true
    });
    FacetSearch.prototype.shouldPositionSearchResults = function () {
        return !ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallFacetActivated(Dom_1.$$(this.root)) && Dom_1.$$(this.facet.element).hasClass('coveo-facet-searching');
    };
    FacetSearch.prototype.buildBaseSearch = function () {
        var _this = this;
        this.facetSearchElement.build(function () { return _this.handleFacetSearchClear(); });
        Dom_1.$$(this.facetSearchElement.input).on('keyup', function () { return _this.showOrHideClearElement(); });
        return this.search;
    };
    FacetSearch.prototype.handleNuke = function () {
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('click', this.onDocumentClick);
    };
    FacetSearch.prototype.handleClickElsewhere = function (event) {
        if (this.currentlyDisplayedResults && this.search != event.target && this.searchResults != event.target && this.input != event.target) {
            this.dismissSearchResults();
        }
    };
    FacetSearch.prototype.handleFacetSearchClear = function () {
        this.input.value = '';
        Dom_1.$$(this.clear).hide();
        this.dismissSearchResults();
    };
    FacetSearch.prototype.showOrHideClearElement = function () {
        if (!this.inputIsEmpty()) {
            Dom_1.$$(this.clear).show();
        }
        else {
            Dom_1.$$(this.clear).hide();
            Dom_1.$$(this.search).removeClass('coveo-facet-search-no-results');
        }
    };
    FacetSearch.prototype.cancelAnyPendingSearchOperation = function () {
        if (Utils_1.Utils.exists(this.facetSearchTimeout)) {
            clearTimeout(this.facetSearchTimeout);
            this.facetSearchTimeout = undefined;
        }
        if (Utils_1.Utils.exists(this.facetSearchPromise)) {
            Promise.reject(this.facetSearchPromise).catch(function () { });
            this.facetSearchPromise = undefined;
        }
        this.facetSearchElement.hideFacetSearchWaitingAnimation();
    };
    FacetSearch.prototype.inputIsEmpty = function () {
        return this.input.value.trim() == '';
    };
    FacetSearch.prototype.processNewFacetSearchResults = function (fieldValues, facetSearchParameters) {
        Assert_1.Assert.exists(fieldValues);
        fieldValues = new FacetValuesOrder_1.FacetValuesOrder(this.facet, this.facet.facetSort).reorderValues(fieldValues);
        if (fieldValues.length > 0) {
            Dom_1.$$(this.search).removeClass('coveo-facet-search-no-results');
            this.facet.fadeInactiveValuesInMainList(this.facet.options.facetSearchDelay);
            this.rebuildSearchResults(fieldValues, facetSearchParameters);
            if (!facetSearchParameters.fetchMore) {
                this.showSearchResultsElement();
            }
            this.highlightCurrentQueryWithinSearchResults();
            this.makeFirstSearchResultTheCurrentOne();
            this.facetSearchElement.updateAriaLiveWithResults(this.input.value, this.currentlyDisplayedResults.length, this.moreValuesToFetch);
        }
        else {
            if (facetSearchParameters.fetchMore) {
                this.moreValuesToFetch = false;
            }
            else {
                Dom_1.$$(this.search).addClass('coveo-facet-search-no-results');
                this.showSearchResultsElement();
                this.facetSearchElement.emptyAndShowNoResults();
            }
        }
    };
    FacetSearch.prototype.rebuildSearchResults = function (fieldValues, facetSearchParameters) {
        var _this = this;
        Assert_1.Assert.exists(fieldValues);
        if (!facetSearchParameters.fetchMore) {
            Dom_1.$$(this.searchResults).empty();
        }
        var facetSearchHasQuery = Utils_1.Utils.isNonEmptyString(facetSearchParameters.valueToSearch);
        if (facetSearchHasQuery) {
            this.appendSelectAllResultsButton();
        }
        var facetValues = underscore_1.map(fieldValues, function (fieldValue) {
            return FacetValue_1.FacetValue.create(fieldValue);
        });
        underscore_1.each(new this.facetSearchValuesListKlass(this.facet, FacetValueElement_1.FacetValueElement).build(facetValues), function (listElement) {
            _this.facetSearchElement.appendToSearchResults(listElement);
        });
        if (this.currentlyDisplayedResults) {
            this.currentlyDisplayedResults = this.currentlyDisplayedResults.concat(underscore_1.pluck(facetValues, 'value'));
        }
        else {
            this.currentlyDisplayedResults = underscore_1.pluck(facetValues, 'value');
        }
        underscore_1.each(Dom_1.$$(this.searchResults).findAll('.coveo-facet-selectable'), function (elem, index) {
            Dom_1.$$(elem).setAttribute('id', "coveo-facet-search-" + _this.facet.options.id + "-suggestion-" + index);
            Dom_1.$$(elem).setAttribute('role', 'option');
            Dom_1.$$(elem).setAttribute('aria-selected', 'false');
            Dom_1.$$(elem).addClass('coveo-facet-search-selectable');
        });
    };
    FacetSearch.prototype.appendSelectAllResultsButton = function () {
        var _this = this;
        var selectAll = document.createElement('li');
        Dom_1.$$(selectAll).addClass(['coveo-facet-selectable', 'coveo-facet-search-selectable', 'coveo-facet-search-select-all']);
        Dom_1.$$(selectAll).text(Strings_1.l('SelectAll'));
        Dom_1.$$(selectAll).on('click', function () { return _this.selectAllValuesMatchingSearch(); });
        this.facetSearchElement.appendToSearchResults(selectAll);
    };
    FacetSearch.prototype.buildParamsForNormalSearch = function () {
        var params = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        params.setValueToSearch(this.getValueInInputForFacetSearch());
        params.fetchMore = false;
        return params;
    };
    FacetSearch.prototype.buildParamsForFetchingMore = function () {
        var params = this.buildParamsForExcludingCurrentlyDisplayedValues();
        params.fetchMore = true;
        return params;
    };
    FacetSearch.prototype.buildParamsForExcludingCurrentlyDisplayedValues = function () {
        var params = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        params.excludeCurrentlyDisplayedValuesInSearch(this.searchResults);
        params.setValueToSearch(this.getValueInInputForFacetSearch());
        return params;
    };
    FacetSearch.prototype.showSearchResultsElement = function () {
        this.positionSearchResults();
    };
    FacetSearch.prototype.highlightCurrentQueryWithinSearchResults = function () {
        var search = this.getValueInInputForFacetSearch();
        var regex = new RegExp('(' + StringUtils_1.StringUtils.wildcardsToRegex(search, this.facet.options.facetSearchIgnoreAccents) + ')', 'ig');
        this.facetSearchElement.highlightCurrentQueryInSearchResults(regex);
    };
    FacetSearch.prototype.makeFirstSearchResultTheCurrentOne = function () {
        this.facetSearchElement.setAsCurrentResult(Dom_1.$$(this.getSelectables()[0]));
    };
    FacetSearch.prototype.getSelectables = function (target) {
        if (target === void 0) { target = this.searchResults; }
        return Dom_1.$$(target).findAll('.coveo-facet-selectable');
    };
    FacetSearch.prototype.performActionOnCurrentSearchResult = function () {
        var current = Dom_1.$$(this.searchResults).find('.coveo-facet-search-current-result');
        Assert_1.Assert.check(current != undefined);
        var shouldExclude = Dom_1.$$(current).hasClass('coveo-facet-value-will-exclude');
        if (shouldExclude) {
            var excludeIcon = Dom_1.$$(current).find('.coveo-facet-value-exclude');
            excludeIcon.click();
            return;
        }
        var checkbox = Dom_1.$$(current).find('input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = true;
            Dom_1.$$(checkbox).trigger('change');
        }
        else {
            current.click();
        }
    };
    FacetSearch.prototype.performExcludeActionOnCurrentSearchResult = function () {
        var current = Dom_1.$$(this.searchResults).find('.coveo-facet-search-current-result');
        Assert_1.Assert.check(current != null);
        var valueCaption = Dom_1.$$(current).find('.coveo-facet-value-caption');
        var valueElement = this.facet.facetValuesList.get(Dom_1.$$(valueCaption).text());
        valueElement.toggleExcludeWithUA();
    };
    FacetSearch.prototype.selectAllValuesMatchingSearch = function () {
        var _this = this;
        this.facet.showWaitingAnimation();
        var searchParameters = new FacetSearchParameters_1.FacetSearchParameters(this.facet);
        searchParameters.nbResults = 1000;
        searchParameters.setValueToSearch(this.getValueInInputForFacetSearch());
        this.facet.facetQueryController.search(searchParameters).then(function (fieldValues) {
            _this.dismissSearchResults();
            ExternalModulesShim_1.ModalBox.close(true);
            var facetValues = underscore_1.map(fieldValues, function (fieldValue) {
                var facetValue = _this.facet.values.get(fieldValue.value);
                if (!Utils_1.Utils.exists(facetValue)) {
                    facetValue = FacetValue_1.FacetValue.create(fieldValue);
                }
                facetValue.selected = true;
                facetValue.excluded = false;
                return facetValue;
            });
            _this.facet.processFacetSearchAllResultsSelected(facetValues);
        });
        this.dismissSearchResults();
    };
    return FacetSearch;
}());
exports.FacetSearch = FacetSearch;


/***/ }),

/***/ 480:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var FacetSearchValuesList = /** @class */ (function () {
    function FacetSearchValuesList(facet, facetValueElementKlass) {
        this.facet = facet;
        this.facetValueElementKlass = facetValueElementKlass;
    }
    FacetSearchValuesList.prototype.build = function (facetValues) {
        var _this = this;
        var valuesToBuildWith = _.map(facetValues, function (facetValue) {
            return (_.find(_this.facet.values.getAll(), function (valueAlreadyInFacet) {
                return valueAlreadyInFacet.value == facetValue.value;
            }) || facetValue);
        });
        return _.map(valuesToBuildWith, function (facetValue) {
            var valueElement = new _this.facetValueElementKlass(_this.facet, facetValue, _this.facet.keepDisplayedValuesNextTime).build();
            valueElement.renderer.excludeIcon.setAttribute('aria-hidden', 'true');
            valueElement.renderer.label.setAttribute('aria-hidden', 'true');
            return valueElement.renderer.listItem;
        });
    };
    return FacetSearchValuesList;
}());
exports.FacetSearchValuesList = FacetSearchValuesList;


/***/ }),

/***/ 481:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var FacetValueElement_1 = __webpack_require__(127);
var Dom_1 = __webpack_require__(1);
var FacetValue_1 = __webpack_require__(112);
var Utils_1 = __webpack_require__(4);
var FacetUtils_1 = __webpack_require__(39);
var _ = __webpack_require__(0);
var FacetValuesList = /** @class */ (function () {
    function FacetValuesList(facet, facetValueElementKlass) {
        this.facet = facet;
        this.facetValueElementKlass = facetValueElementKlass;
        // Dictionary of values. The key is always in lowercase.
        this.valueList = {};
        this.currentlyDisplayed = [];
    }
    FacetValuesList.prototype.build = function () {
        this.valueContainer = document.createElement('ul');
        Dom_1.$$(this.valueContainer).addClass('coveo-facet-values');
        return this.valueContainer;
    };
    FacetValuesList.prototype.getAllCurrentlyDisplayed = function () {
        return this.currentlyDisplayed;
    };
    FacetValuesList.prototype.getAll = function () {
        return _.toArray(this.valueList);
    };
    FacetValuesList.prototype.getAllFacetValue = function () {
        return _.map(this.getAll(), function (v) {
            return v.facetValue;
        });
    };
    FacetValuesList.prototype.get = function (value) {
        var getter;
        if (value instanceof FacetValue_1.FacetValue) {
            getter = value.value;
        }
        else {
            value = Utils_1.Utils.anyTypeToString(value);
            getter = value;
        }
        this.ensureFacetValueIsInList(value);
        return this.valueList[getter.toLowerCase()];
    };
    FacetValuesList.prototype.select = function (value) {
        var valueElement = this.get(value);
        valueElement.select();
        return valueElement;
    };
    FacetValuesList.prototype.unselect = function (value) {
        var valueElement = this.get(value);
        valueElement.unselect();
        return valueElement;
    };
    FacetValuesList.prototype.exclude = function (value) {
        var valueElement = this.get(value);
        valueElement.exclude();
        return valueElement;
    };
    FacetValuesList.prototype.unExclude = function (value) {
        var valueElement = this.get(value);
        valueElement.unexclude();
        return valueElement;
    };
    FacetValuesList.prototype.toggleSelect = function (value) {
        var valueElement = this.get(value);
        if (valueElement.facetValue.selected) {
            valueElement.unselect();
        }
        else {
            valueElement.select();
        }
        return valueElement;
    };
    FacetValuesList.prototype.toggleExclude = function (value) {
        var valueElement = this.get(value);
        if (valueElement.facetValue.excluded) {
            valueElement.unexclude();
        }
        else {
            valueElement.exclude();
        }
        return valueElement;
    };
    FacetValuesList.prototype.rebuild = function (numberOfValues) {
        var _this = this;
        Dom_1.$$(this.valueContainer).empty();
        this.currentlyDisplayed = [];
        var allValues = this.getValuesToBuildWith();
        var toCompare = numberOfValues;
        var docFragment = document.createDocumentFragment();
        _.each(allValues, function (facetValue, index, list) {
            if (_this.facetValueShouldBeRemoved(facetValue)) {
                _this.facet.values.remove(facetValue.value);
                toCompare += 1;
            }
            else if (index < toCompare) {
                var valueElement = new _this.facetValueElementKlass(_this.facet, facetValue, true);
                _this.valueList[facetValue.value.toLowerCase()] = valueElement;
                var valueListElement = valueElement.build().renderer.listItem;
                docFragment.appendChild(valueListElement);
                _this.currentlyDisplayed.push(valueElement);
            }
        });
        this.valueContainer.appendChild(docFragment);
        FacetUtils_1.FacetUtils.addNoStateCssClassToFacetValues(this.facet, this.valueContainer);
    };
    FacetValuesList.prototype.getValuesToBuildWith = function () {
        return this.facet.values.getAll();
    };
    FacetValuesList.prototype.facetValueShouldBeRemoved = function (facetValue) {
        return (facetValue.occurrences == 0 &&
            (facetValue.delta == 0 || facetValue.delta == undefined) &&
            !facetValue.selected &&
            !facetValue.excluded &&
            !this.facet.keepDisplayedValuesNextTime);
    };
    FacetValuesList.prototype.ensureFacetValueIsInList = function (value) {
        var facetValue;
        if (value instanceof FacetValue_1.FacetValue) {
            facetValue = this.facet.values.get(value.value);
            if (facetValue == null) {
                this.facet.values.add(value);
                facetValue = value;
            }
        }
        else {
            facetValue = this.facet.values.get(value);
            if (facetValue == null) {
                facetValue = FacetValue_1.FacetValue.createFromValue(value);
                this.facet.values.add(facetValue);
            }
        }
        var key = facetValue.value.toLowerCase();
        var found = this.valueList[key];
        if (found == undefined) {
            found = this.valueList[key] = new FacetValueElement_1.FacetValueElement(this.facet, facetValue, true);
            found.build();
        }
        else {
            found.facetValue = facetValue;
        }
    };
    return FacetValuesList;
}());
exports.FacetValuesList = FacetValuesList;


/***/ }),

/***/ 482:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="Facet.ts" />
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
var ValueElement_1 = __webpack_require__(468);
var OmniboxValueElement = /** @class */ (function (_super) {
    __extends(OmniboxValueElement, _super);
    function OmniboxValueElement(facet, facetValue, eventArg, onSelect, onExclude) {
        var _this = _super.call(this, facet, facetValue, onSelect, onExclude) || this;
        _this.facet = facet;
        _this.facetValue = facetValue;
        _this.eventArg = eventArg;
        return _this;
    }
    OmniboxValueElement.prototype.bindEvent = function () {
        _super.prototype.bindEvent.call(this, { displayNextTime: false, pinFacet: false, omniboxObject: this.eventArg });
    };
    return OmniboxValueElement;
}(ValueElement_1.ValueElement));
exports.OmniboxValueElement = OmniboxValueElement;


/***/ }),

/***/ 483:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="Facet.ts" />
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var FacetUtils_1 = __webpack_require__(39);
var OmniboxValuesList = /** @class */ (function () {
    function OmniboxValuesList(facet, facetValues, omniboxObject, omniboxValueElementKlass) {
        this.facet = facet;
        this.facetValues = facetValues;
        this.omniboxObject = omniboxObject;
        this.omniboxValueElementKlass = omniboxValueElementKlass;
    }
    OmniboxValuesList.prototype.build = function () {
        var _this = this;
        var rows = [];
        underscore_1.each(this.facetValues, function (facetValue) {
            rows.push(_this.buildOmniboxForOneRow(facetValue, _this.omniboxObject));
        });
        return this.buildFinalOmniboxElement(rows);
    };
    OmniboxValuesList.prototype.buildOmniboxForOneRow = function (facetValue, omniboxObject) {
        var _this = this;
        var selectCallback = function (elem, cause) { return _this.logAnalyticsEvent(elem, cause); };
        var excludeCallback = function (elem, cause) { return _this.logAnalyticsEvent(elem, cause); };
        var omniboxValueElement = new this.omniboxValueElementKlass(this.facet, facetValue, omniboxObject, selectCallback, excludeCallback);
        var omniboxRowContent = omniboxValueElement.build().renderer.listItem;
        var regex = omniboxObject.completeQueryExpression.regex;
        var valueToSearch = omniboxObject.completeQueryExpression.word;
        var caption = Dom_1.$$(omniboxRowContent).find('.coveo-facet-value-caption');
        caption.innerHTML = this.highlightOmniboxMatch(this.facet.getValueCaption(facetValue), regex, valueToSearch);
        var omniboxRow = Dom_1.$$('ul', {
            className: 'coveo-omnibox-selectable coveo-facet-value coveo-omnibox-facet-value'
        }).el;
        omniboxRow.appendChild(omniboxRowContent);
        Dom_1.$$(omniboxRow).on('keyboardSelect', function () {
            var input = Dom_1.$$(omniboxRowContent).find('input[type=checkbox]');
            Dom_1.$$(input).trigger('change');
        });
        omniboxRow['no-text-suggestion'] = true;
        return omniboxRow;
    };
    OmniboxValuesList.prototype.buildFinalOmniboxElement = function (rows) {
        var header = this.buildOmniboxHeader();
        if (Utils_1.Utils.isEmptyArray(rows)) {
            return undefined;
        }
        else {
            var ret_1 = Dom_1.$$('div', {
                className: 'coveo-omnibox-facet-value'
            }).el;
            ret_1.appendChild(header);
            underscore_1.each(rows, function (r) {
                ret_1.appendChild(r);
            });
            FacetUtils_1.FacetUtils.addNoStateCssClassToFacetValues(this.facet, ret_1);
            return ret_1;
        }
    };
    OmniboxValuesList.prototype.buildOmniboxHeader = function () {
        var title = this.facet.options.title;
        var header = Dom_1.$$('div', {
            className: 'coveo-omnibox-facet-header'
        }).el;
        Dom_1.$$(header).text(title);
        return header;
    };
    OmniboxValuesList.prototype.highlightOmniboxMatch = function (orignalStr, regex, valueToSearch) {
        var firstChar = orignalStr.search(regex);
        var lastChar = firstChar + valueToSearch.length;
        return (orignalStr.slice(0, firstChar) +
            '<span class="coveo-highlight">' +
            orignalStr.slice(firstChar, lastChar) +
            '</span>' +
            orignalStr.slice(lastChar));
    };
    OmniboxValuesList.prototype.logAnalyticsEvent = function (elem, cause) {
        var strippedFacetValues = underscore_1.pluck(this.facetValues, 'value');
        elem.facet.usageAnalytics.logSearchEvent(cause, {
            query: this.omniboxObject.completeQueryExpression.word,
            facetId: elem.facet.options.id,
            facetField: elem.facet.options.field.toString(),
            facetTitle: elem.facet.options.title,
            facetValue: elem.facetValue.value,
            suggestions: strippedFacetValues.join(';'),
            suggestionRanking: underscore_1.indexOf(strippedFacetValues, elem.facetValue.value)
        });
    };
    return OmniboxValuesList;
}());
exports.OmniboxValuesList = OmniboxValuesList;


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

/***/ 533:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 535:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 536:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 537:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 538:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 539:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var KeyboardUtils_1 = __webpack_require__(25);
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

/***/ 540:
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
var DefaultSearchDropdownNavigator_1 = __webpack_require__(472);
var FacetSearchDropdownNavigator_1 = __webpack_require__(541);
var CategoryFacet_1 = __webpack_require__(89);
var Facet_1 = __webpack_require__(67);
function SearchDropdownNavigatorFactory(facetSearch, config) {
    switch (facetSearch.facetType) {
        case Facet_1.Facet.ID:
            return new FacetSearchDropdownNavigator_1.FacetSearchDropdownNavigator(__assign({}, config, { facetSearch: facetSearch }));
        case CategoryFacet_1.CategoryFacet.ID:
        default:
            return new DefaultSearchDropdownNavigator_1.DefaultSearchDropdownNavigator(config);
    }
}
exports.SearchDropdownNavigatorFactory = SearchDropdownNavigatorFactory;


/***/ }),

/***/ 541:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DefaultSearchDropdownNavigator_1 = __webpack_require__(472);
var Dom_1 = __webpack_require__(1);
var FacetSearchDropdownNavigator = /** @class */ (function () {
    function FacetSearchDropdownNavigator(config) {
        this.config = config;
        this.defaultDropdownNavigator = new DefaultSearchDropdownNavigator_1.DefaultSearchDropdownNavigator(config);
    }
    FacetSearchDropdownNavigator.prototype.setAsCurrentResult = function (dom) {
        this.defaultDropdownNavigator.setAsCurrentResult(dom);
    };
    Object.defineProperty(FacetSearchDropdownNavigator.prototype, "currentResult", {
        get: function () {
            return this.defaultDropdownNavigator.currentResult;
        },
        enumerable: true,
        configurable: true
    });
    FacetSearchDropdownNavigator.prototype.focusNextElement = function () {
        this.toggleCanExcludeCurrentResult();
        if (this.willExcludeCurrentResult) {
            this.announceCurrentResultCanBeExcluded();
            return;
        }
        this.defaultDropdownNavigator.moveCurrentResultDown();
    };
    FacetSearchDropdownNavigator.prototype.focusPreviousElement = function () {
        if (this.willExcludeCurrentResult) {
            this.toggleCanExcludeCurrentResult();
            return;
        }
        this.moveResultUp();
        this.toggleCanExcludeCurrentResult();
    };
    FacetSearchDropdownNavigator.prototype.moveResultUp = function () {
        if (this.willExcludeCurrentResult) {
            this.toggleCanExcludeCurrentResult();
            return;
        }
        this.defaultDropdownNavigator.moveCurrentResultUp();
        this.toggleCanExcludeCurrentResult();
    };
    Object.defineProperty(FacetSearchDropdownNavigator.prototype, "isCurrentResultNotAFacetValue", {
        get: function () {
            return this.currentResult.hasClass('coveo-facet-search-select-all') || this.currentResult.hasClass('coveo-facet-value-not-found');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FacetSearchDropdownNavigator.prototype, "willExcludeCurrentResult", {
        get: function () {
            return this.currentResult.hasClass('coveo-facet-value-will-exclude');
        },
        enumerable: true,
        configurable: true
    });
    FacetSearchDropdownNavigator.prototype.toggleCanExcludeCurrentResult = function () {
        if (this.isCurrentResultNotAFacetValue) {
            return;
        }
        this.currentResult.toggleClass('coveo-facet-value-will-exclude', !this.willExcludeCurrentResult);
    };
    FacetSearchDropdownNavigator.prototype.announceCurrentResultCanBeExcluded = function () {
        if (this.isCurrentResultNotAFacetValue) {
            return;
        }
        var excludeIcon = Dom_1.$$(this.currentResult).find('.coveo-facet-value-exclude');
        this.config.facetSearch.updateAriaLive(excludeIcon.getAttribute('aria-label'));
    };
    return FacetSearchDropdownNavigator;
}());
exports.FacetSearchDropdownNavigator = FacetSearchDropdownNavigator;


/***/ }),

/***/ 542:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGIcons_1 = __webpack_require__(12);
var SVGDom_1 = __webpack_require__(16);
var underscore_1 = __webpack_require__(0);
var Strings_1 = __webpack_require__(6);
var Globalize = __webpack_require__(23);
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
    CategoryFacetTemplates.prototype.getFormattedCount = function (count) {
        return Globalize.format(count, 'n0');
    };
    CategoryFacetTemplates.prototype.createListElement = function (data) {
        return "<li class=\"coveo-category-facet-value\">\n        <label class=\"coveo-category-facet-value-label\">\n          <span title=\"" + underscore_1.escape(data.value) + "\" class=\"coveo-category-facet-value-caption\">" + underscore_1.escape(data.value) + "</span>\n          <span class=\"coveo-category-facet-value-count\">" + this.getFormattedCount(data.count) + "</span>\n        </label>\n      </li>";
    };
    return CategoryFacetTemplates;
}());
exports.CategoryFacetTemplates = CategoryFacetTemplates;


/***/ }),

/***/ 543:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryValueChildrenRenderer_1 = __webpack_require__(473);
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

/***/ 544:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var CategoryValueChildrenRenderer_1 = __webpack_require__(473);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var AccessibleButton_1 = __webpack_require__(15);
var Strings_1 = __webpack_require__(6);
var CategoryValue = /** @class */ (function () {
    function CategoryValue(listRoot, categoryValueDescriptor, categoryFacetTemplates, categoryFacet) {
        this.listRoot = listRoot;
        this.categoryValueDescriptor = categoryValueDescriptor;
        this.categoryFacetTemplates = categoryFacetTemplates;
        this.categoryFacet = categoryFacet;
        this.isActive = false;
        this.element = this.categoryFacetTemplates.buildListElement({
            value: this.captionedValueDescriptorValue,
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
        var element = Dom_1.$$(this.element.find('.coveo-category-facet-value-label'));
        element.addClass('coveo-selectable');
        var count = this.categoryValueDescriptor.count;
        var countLabel = Strings_1.l('ResultCount', count.toString(), count);
        var label = Strings_1.l('IncludeValueWithResultCount', this.captionedValueDescriptorValue, countLabel);
        new AccessibleButton_1.AccessibleButton()
            .withElement(element)
            .withSelectAction(function () { return _this.onSelect(); })
            .withLabel(label)
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
    Object.defineProperty(CategoryValue.prototype, "captionedValueDescriptorValue", {
        get: function () {
            var value = this.categoryValueDescriptor.value;
            return this.categoryFacet.getCaption(value);
        },
        enumerable: true,
        configurable: true
    });
    CategoryValue.prototype.onSelect = function () {
        if (!this.pastMaximumDepth()) {
            this.categoryFacet.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect, this.path);
            this.categoryFacet.scrollToTop();
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

/***/ 545:
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
var AllowedValuesPatternType_1 = __webpack_require__(467);
var Utils_1 = __webpack_require__(4);
var CategoryFacetQueryController = /** @class */ (function () {
    function CategoryFacetQueryController(categoryFacet) {
        this.categoryFacet = categoryFacet;
    }
    CategoryFacetQueryController.prototype.putCategoryFacetInQueryBuilder = function (queryBuilder, path, maximumNumberOfValues) {
        var positionInQuery = queryBuilder.categoryFacets.length;
        this.addQueryFilter(queryBuilder, path);
        this.addCategoryFacetRequest(queryBuilder, path, maximumNumberOfValues);
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
                            allowedValues: [this.getAllowedValuesPattern(value)],
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
    CategoryFacetQueryController.prototype.shouldAddFilterToQuery = function (path) {
        return path.length != 0 && !Utils_1.Utils.arrayEqual(path, this.categoryFacet.options.basePath);
    };
    CategoryFacetQueryController.prototype.addQueryFilter = function (queryBuilder, path) {
        if (this.shouldAddFilterToQuery(path)) {
            queryBuilder.advancedExpression.addFieldExpression(this.categoryFacet.options.field, '==', [
                path.join(this.categoryFacet.options.delimitingCharacter)
            ]);
        }
    };
    CategoryFacetQueryController.prototype.addCategoryFacetRequest = function (queryBuilder, path, maximumNumberOfValues) {
        var categoryFacetsRequest = {
            field: this.categoryFacet.options.field,
            path: path,
            injectionDepth: this.categoryFacet.options.injectionDepth,
            maximumNumberOfValues: maximumNumberOfValues,
            delimitingCharacter: this.categoryFacet.options.delimitingCharacter
        };
        queryBuilder.categoryFacets.push(categoryFacetsRequest);
    };
    CategoryFacetQueryController.prototype.getAllowedValuesPattern = function (value) {
        var basePath = this.categoryFacet.options.basePath;
        var delimiter = this.categoryFacet.options.delimitingCharacter;
        if (Utils_1.Utils.isNonEmptyArray(basePath)) {
            return "" + basePath.join(delimiter) + delimiter + "*" + value + "*";
        }
        return "*" + value + "*";
    };
    return CategoryFacetQueryController;
}());
exports.CategoryFacetQueryController = CategoryFacetQueryController;


/***/ }),

/***/ 546:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 547:
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
var CategoryFacet_1 = __webpack_require__(89);
var FacetSearchElement_1 = __webpack_require__(471);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Strings_1 = __webpack_require__(6);
__webpack_require__(548);
var StringUtils_1 = __webpack_require__(22);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var AccessibleButton_1 = __webpack_require__(15);
var Globalize = __webpack_require__(23);
var CategoryFacetSearch = /** @class */ (function () {
    function CategoryFacetSearch(categoryFacet, displayButton) {
        if (displayButton === void 0) { displayButton = true; }
        var _this = this;
        this.categoryFacet = categoryFacet;
        this.displayButton = displayButton;
        this.moreValuesToFetch = true;
        this.facetSearchElement = new FacetSearchElement_1.FacetSearchElement(this);
        this.displayNewValues = underscore_1.debounce(this.getDisplayNewValuesFunction(), this.categoryFacet.options.facetSearchDelay);
        this.categoryFacet.root.addEventListener('click', function (e) { return _this.handleClickElsewhere(e); });
        this.numberOfValuesToFetch = this.categoryFacet.options.numberOfResultsInFacetSearch;
    }
    Object.defineProperty(CategoryFacetSearch.prototype, "facetType", {
        get: function () {
            return CategoryFacet_1.CategoryFacet.ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryFacetSearch.prototype, "facetTitle", {
        get: function () {
            return this.categoryFacet.options.title || this.categoryFacet.options.field.toString();
        },
        enumerable: true,
        configurable: true
    });
    CategoryFacetSearch.prototype.setExpandedFacetSearchAccessibilityAttributes = function (searchResultsElements) {
        this.container.setAttribute('aria-expanded', 'true');
    };
    CategoryFacetSearch.prototype.setCollapsedFacetSearchAccessibilityAttributes = function () {
        this.container.setAttribute('aria-expanded', 'false');
    };
    CategoryFacetSearch.prototype.build = function () {
        this.container = Dom_1.$$('div', {
            className: 'coveo-category-facet-search-container',
            role: 'button'
        });
        this.container.toggleClass('coveo-category-facet-search-without-button', !this.displayButton);
        this.displayButton && this.buildButton();
        this.container.append(this.facetSearchElement.build());
        Dom_1.$$(this.facetSearchElement.search).toggleClass('without-animation', !this.displayButton);
        return this.container;
    };
    CategoryFacetSearch.prototype.buildButton = function () {
        var _this = this;
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.container)
            .withSelectAction(function () {
            Dom_1.$$(_this.categoryFacet.element).addClass('coveo-category-facet-searching');
            _this.focus();
        })
            .withLabel(Strings_1.l('SearchFacetResults', this.facetTitle))
            .build();
        this.buildfacetSearchPlaceholder();
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
    CategoryFacetSearch.prototype.updateAriaLive = function (text) {
        this.categoryFacet.searchInterface.ariaLive.updateText(text);
    };
    CategoryFacetSearch.prototype.selectCurrentResult = function () {
        if (this.facetSearchElement.currentResult) {
            var currentResultPathData = this.facetSearchElement.currentResult.el.dataset.path;
            var delimiter = this.categoryFacet.options.delimitingCharacter;
            var path = currentResultPathData.split(delimiter);
            this.categoryFacet.changeActivePath(path);
            this.categoryFacet.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect, path);
            this.categoryFacet.executeQuery();
            this.categoryFacet.scrollToTop();
        }
    };
    CategoryFacetSearch.prototype.handleClickElsewhere = function (e) {
        var closestContainer = Dom_1.$$(e.target).closest('.coveo-category-facet-search-container');
        var isSelfContainer = this.container && closestContainer === this.container.el;
        if (!closestContainer || !isSelfContainer) {
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
        this.container.append(placeholder.el);
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
                            this.facetSearchElement.positionSearchResults();
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
            var searchResult = this.buildFacetSearchValue(categoryFacetValues[i], i);
            if (i == 0) {
                this.facetSearchElement.setAsCurrentResult(searchResult);
            }
            this.facetSearchElement.appendToSearchResults(searchResult.el);
        }
        this.highlightCurrentQueryWithinSearchResults();
        this.facetSearchElement.updateAriaLiveWithResults(this.facetSearchElement.input.value, this.currentlyDisplayedResults.length, this.moreValuesToFetch);
    };
    CategoryFacetSearch.prototype.getFormattedCount = function (count) {
        return Globalize.format(count, 'n0');
    };
    CategoryFacetSearch.prototype.buildFacetSearchValue = function (categoryFacetValue, index) {
        var _this = this;
        var path = categoryFacetValue.value.split(this.categoryFacet.options.delimitingCharacter);
        var pathParents = path.slice(0, -1).length != 0 ? path.slice(0, -1).join('/') + "/" : '';
        var value = Dom_1.$$('span', { className: 'coveo-category-facet-search-value-caption' }, underscore_1.last(path));
        var number = Dom_1.$$('span', { className: 'coveo-category-facet-search-value-number' }, this.getFormattedCount(categoryFacetValue.numberOfResults));
        var pathParentsCaption = Dom_1.$$('span', { className: 'coveo-category-facet-search-path-parents' }, pathParents);
        var pathToValueCaption = Dom_1.$$('span', { className: 'coveo-category-facet-search-path' }, pathParentsCaption);
        var firstRow = Dom_1.$$('div', { className: 'coveo-category-facet-search-first-row' }, value, number);
        var secondRow = Dom_1.$$('div', { className: 'coveo-category-facet-search-second-row' }, pathToValueCaption);
        var item = Dom_1.$$('li', {
            id: "coveo-category-facet-search-suggestion-" + index,
            role: 'option',
            ariaSelected: 'false',
            className: 'coveo-category-facet-search-value',
            title: path
        }, firstRow, secondRow);
        item.el.dataset.path = categoryFacetValue.value;
        var countLabel = Strings_1.l('ResultCount', this.getFormattedCount(categoryFacetValue.numberOfResults), categoryFacetValue.numberOfResults);
        var label = Strings_1.l('IncludeValueWithResultCount', underscore_1.last(path), countLabel);
        new AccessibleButton_1.AccessibleButton()
            .withElement(item)
            .withSelectAction(function () {
            _this.categoryFacet.changeActivePath(path);
            _this.categoryFacet.scrollToTop();
            _this.categoryFacet.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetSelect, path);
            _this.categoryFacet.executeQuery();
        })
            .withLabel(label)
            .build();
        return item;
    };
    CategoryFacetSearch.prototype.noFacetSearchResults = function () {
        this.facetSearchElement.hideFacetSearchWaitingAnimation();
        this.facetSearchElement.emptyAndShowNoResults();
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
            categoryFacetField: this.categoryFacet.options.field.toString(),
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

/***/ 548:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 549:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGIcons_1 = __webpack_require__(12);
var AccessibleButton_1 = __webpack_require__(15);
var Strings_1 = __webpack_require__(6);
var underscore_1 = __webpack_require__(0);
var CategoryFacetBreadcrumb = /** @class */ (function () {
    function CategoryFacetBreadcrumb(categoryFacet, onClickHandler, categoryValueDescriptor) {
        this.categoryFacet = categoryFacet;
        this.onClickHandler = onClickHandler;
        this.categoryValueDescriptor = categoryValueDescriptor;
    }
    CategoryFacetBreadcrumb.prototype.build = function () {
        var _this = this;
        var clear = Dom_1.$$('span', {
            className: 'coveo-facet-breadcrumb-clear'
        }, SVGIcons_1.SVGIcons.icons.mainClear);
        var pathToRender = underscore_1.without.apply(void 0, [this.categoryValueDescriptor.path].concat(this.categoryFacet.options.basePath));
        var captionLabel = pathToRender.map(function (pathPart) { return _this.categoryFacet.getCaption(pathPart); }).join('/');
        var breadcrumbTitle = Dom_1.$$('span', { className: 'coveo-category-facet-breadcrumb-title' }, this.categoryFacet.options.title + ":");
        var valuesContainer = Dom_1.$$('span', { className: 'coveo-category-facet-breadcrumb-values' }, captionLabel, clear);
        new AccessibleButton_1.AccessibleButton()
            .withElement(valuesContainer)
            .withLabel(Strings_1.l('RemoveFilterOn', captionLabel))
            .withSelectAction(this.onClickHandler)
            .build();
        var breadcrumb = Dom_1.$$('span', { className: 'coveo-category-facet-breadcrumb' }, breadcrumbTitle, valuesContainer);
        return breadcrumb.el;
    };
    return CategoryFacetBreadcrumb;
}());
exports.CategoryFacetBreadcrumb = CategoryFacetBreadcrumb;


/***/ }),

/***/ 550:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryFacet_1 = __webpack_require__(89);
var QueryEvents_1 = __webpack_require__(11);
var underscore_1 = __webpack_require__(0);
var Logger_1 = __webpack_require__(9);
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


/***/ }),

/***/ 551:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CategoryFacet_1 = __webpack_require__(89);
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var SVGIcons_1 = __webpack_require__(12);
var SVGDom_1 = __webpack_require__(16);
var AccessibleButton_1 = __webpack_require__(15);
var CategoryFacetHeader = /** @class */ (function () {
    function CategoryFacetHeader(options) {
        this.options = options;
        this.element = document.createElement('div');
        Dom_1.$$(this.element).addClass('coveo-facet-header');
    }
    CategoryFacetHeader.prototype.build = function () {
        var waitElement = this.buildWaitAnimation();
        var titleSection = Dom_1.$$('div', {
            className: 'coveo-category-facet-title',
            role: 'heading',
            'aria-level': '2',
            'aria-label': Strings_1.l('FacetTitle', this.options.title) + "."
        }, this.options.title);
        this.element = Dom_1.$$('div', { className: 'coveo-category-facet-header' }, titleSection).el;
        Dom_1.$$(this.element).append(waitElement);
        var eraserElement = this.buildEraser();
        Dom_1.$$(this.element).append(eraserElement);
        return this.element;
    };
    CategoryFacetHeader.prototype.buildWaitAnimation = function () {
        var waitElement = Dom_1.$$('div', { className: CategoryFacet_1.CategoryFacet.WAIT_ELEMENT_CLASS }, SVGIcons_1.SVGIcons.icons.loading).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(waitElement, 'coveo-category-facet-header-wait-animation-svg');
        waitElement.style.visibility = 'hidden';
        return waitElement;
    };
    CategoryFacetHeader.prototype.buildEraser = function () {
        var _this = this;
        var eraserElement = Dom_1.$$('div', { className: 'coveo-category-facet-header-eraser coveo-facet-header-eraser' }, SVGIcons_1.SVGIcons.icons.mainClear)
            .el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(eraserElement, 'coveo-facet-header-eraser-svg');
        var onClearClick = function () {
            _this.options.categoryFacet.reset();
            _this.options.categoryFacet.scrollToTop();
        };
        new AccessibleButton_1.AccessibleButton()
            .withElement(eraserElement)
            .withLabel(Strings_1.l('Clear', this.options.title))
            .withClickAction(onClearClick)
            .withEnterKeyboardAction(onClearClick)
            .build();
        return eraserElement;
    };
    return CategoryFacetHeader;
}());
exports.CategoryFacetHeader = CategoryFacetHeader;


/***/ }),

/***/ 552:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var CategoryFacetValuesTree = /** @class */ (function () {
    function CategoryFacetValuesTree() {
        this.seenValues = [];
    }
    CategoryFacetValuesTree.prototype.getValueForLastPartInPath = function (path) {
        var nullCategoryFacetValue = { value: '', numberOfResults: 0 };
        var currentNode;
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var part = path_1[_i];
            var nodesToSearch = currentNode ? currentNode.children : this.seenValues;
            var node = this.findNodeWithValue(nodesToSearch, part);
            if (!node) {
                return nullCategoryFacetValue;
            }
            currentNode = node;
        }
        return currentNode ? currentNode.result : nullCategoryFacetValue;
    };
    CategoryFacetValuesTree.prototype.storeNewValues = function (categoryFacetResult) {
        var _this = this;
        var currentNodes = this.seenValues;
        for (var _i = 0, _a = categoryFacetResult.parentValues; _i < _a.length; _i++) {
            var parent_1 = _a[_i];
            var node = this.findNodeWithValue(currentNodes, parent_1.value);
            if (!node) {
                var newNode = { result: parent_1, children: [] };
                currentNodes.push(newNode);
            }
            currentNodes = this.findNodeWithValue(currentNodes, parent_1.value).children;
        }
        categoryFacetResult.values
            .filter(function (result) { return !_this.findNodeWithValue(currentNodes, result.value); })
            .forEach(function (result) { return currentNodes.push({ result: result, children: [] }); });
    };
    CategoryFacetValuesTree.prototype.findNodeWithValue = function (nodes, value) {
        return underscore_1.find(nodes, function (node) { return node.result.value === value; });
    };
    return CategoryFacetValuesTree;
}());
exports.CategoryFacetValuesTree = CategoryFacetValuesTree;


/***/ }),

/***/ 553:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 554:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(5);
var Utils_1 = __webpack_require__(4);
var FacetValue_1 = __webpack_require__(112);
var _ = __webpack_require__(0);
var FacetValues = /** @class */ (function () {
    function FacetValues(groupByResult) {
        if (Utils_1.Utils.exists(groupByResult)) {
            this.values = _.map(groupByResult.values, function (groupByValue) { return FacetValue_1.FacetValue.createFromGroupByValue(groupByValue); });
        }
        else {
            this.values = [];
        }
    }
    FacetValues.prototype.add = function (facetValue) {
        Assert_1.Assert.exists(facetValue);
        Assert_1.Assert.check(!this.contains(facetValue.value));
        this.values.push(facetValue);
    };
    FacetValues.prototype.remove = function (value) {
        Assert_1.Assert.isNonEmptyString(value);
        value = value;
        this.values = _.filter(this.values, function (elem) { return elem.value != value; });
    };
    FacetValues.prototype.size = function () {
        return this.values.length;
    };
    FacetValues.prototype.isEmpty = function () {
        return this.values.length == 0;
    };
    FacetValues.prototype.at = function (index) {
        Assert_1.Assert.isLargerOrEqualsThan(0, index);
        Assert_1.Assert.isSmallerThan(this.values.length, index);
        return this.values[index];
    };
    FacetValues.prototype.get = function (value) {
        return _.find(this.values, function (elem) { return elem.value.toLowerCase() == value.toLowerCase(); });
    };
    FacetValues.prototype.contains = function (value) {
        return Utils_1.Utils.exists(this.get(value));
    };
    FacetValues.prototype.getAll = function () {
        return this.values;
    };
    FacetValues.prototype.getSelected = function () {
        return _.filter(this.values, function (value) { return value.selected; });
    };
    FacetValues.prototype.getExcluded = function () {
        return _.filter(this.values, function (value) { return value.excluded; });
    };
    FacetValues.prototype.hasSelectedOrExcludedValues = function () {
        return this.getSelected().length != 0 || this.getExcluded().length != 0;
    };
    FacetValues.prototype.hasSelectedAndExcludedValues = function () {
        return this.getSelected().length != 0 && this.getExcluded().length != 0;
    };
    FacetValues.prototype.hasOnlyExcludedValues = function () {
        return this.getSelected().length == 0 && this.getExcluded().length != 0;
    };
    FacetValues.prototype.hasOnlySelectedValues = function () {
        return this.getSelected().length != 0 && this.getExcluded().length == 0;
    };
    FacetValues.prototype.reset = function () {
        _.each(this.values, function (elem) { return elem.reset(); });
    };
    FacetValues.prototype.importActiveValuesFromOtherList = function (other) {
        var _this = this;
        Assert_1.Assert.exists(other);
        _.each(other.getSelected(), function (otherValue) {
            var myValue = _this.get(otherValue.value);
            if (Utils_1.Utils.exists(myValue)) {
                myValue.selected = true;
            }
            else {
                _this.values.push(otherValue.cloneWithZeroOccurrences());
            }
        });
        _.each(other.getExcluded(), function (otherValue) {
            var myValue = _this.get(otherValue.value);
            if (Utils_1.Utils.exists(myValue)) {
                myValue.excluded = true;
            }
            else if (otherValue.occurrences != 0) {
                var occurrences = otherValue.occurrences;
                var clone = otherValue.cloneWithZeroOccurrences();
                clone.occurrences = occurrences;
                _this.values.push(clone);
            }
            else {
                _this.values.push(otherValue.cloneWithZeroOccurrences());
            }
        });
    };
    FacetValues.prototype.updateCountsFromNewValues = function (newValues) {
        Assert_1.Assert.exists(newValues);
        this.values = _.map(this.values, function (myValue) {
            var newValue = newValues.get(myValue.value);
            if (Utils_1.Utils.exists(newValue)) {
                myValue.updateCountsFromNewValue(newValue);
                return myValue;
            }
            else if (myValue.occurrences == null) {
                return myValue.cloneWithZeroOccurrences();
            }
            return myValue;
        });
    };
    FacetValues.prototype.updateDeltaWithFilteredFacetValues = function (filtered, isMultiValueField) {
        var _this = this;
        Assert_1.Assert.exists(filtered);
        _.each(this.values, function (unfilteredValue) {
            var filteredValue = filtered.get(unfilteredValue.value);
            unfilteredValue.waitingForDelta = false;
            if (Utils_1.Utils.exists(filteredValue)) {
                if (unfilteredValue.occurrences - filteredValue.occurrences > 0) {
                    // When there are only exclusion in the facet, there should be no "delta"
                    // The number of value for each facet will be what is selected, no addition.
                    if (_this.hasOnlyExcludedValues()) {
                        unfilteredValue.delta = null;
                        unfilteredValue.occurrences = filteredValue.occurrences;
                    }
                    else {
                        unfilteredValue.delta = unfilteredValue.occurrences - filteredValue.occurrences;
                    }
                }
                else {
                    unfilteredValue.delta = null;
                }
            }
            else if (!unfilteredValue.selected && !unfilteredValue.excluded) {
                if (isMultiValueField && filtered.values.length == 0) {
                    unfilteredValue.delta = null;
                    unfilteredValue.occurrences = 0;
                }
                else {
                    unfilteredValue.delta = unfilteredValue.occurrences;
                }
            }
        });
    };
    FacetValues.prototype.mergeWithUnfilteredFacetValues = function (unfiltered) {
        var _this = this;
        Assert_1.Assert.exists(unfiltered);
        var values = [];
        _.each(unfiltered.values, function (unfilteredValue) {
            var filteredValue = _this.get(unfilteredValue.value);
            if (Utils_1.Utils.exists(filteredValue)) {
                if (filteredValue.occurrences == unfilteredValue.occurrences) {
                    values.push(filteredValue);
                }
                else {
                    values.push(unfilteredValue.cloneWithDelta(unfilteredValue.occurrences, unfilteredValue.occurrences - filteredValue.occurrences));
                }
            }
            else {
                values.push(unfilteredValue.cloneWithDelta(unfilteredValue.occurrences, unfilteredValue.occurrences));
            }
        });
        var index = 0;
        _.each(this.values, function (value) {
            var unfilteredValue = unfiltered.get(value.value);
            if (!Utils_1.Utils.exists(unfilteredValue)) {
                if (value.selected || value.excluded) {
                    values.splice(index, 0, value);
                    index++;
                }
            }
            else {
                for (var i = 0; i < values.length; i++) {
                    if (values[i].value == value.value) {
                        index = i + 1;
                        break;
                    }
                }
            }
        });
        this.values = values;
    };
    FacetValues.prototype.sort = function (options) {
        var facetValuesOrder = options.facetValuesOrder, numberOfValues = options.numberOfValues;
        this.values = facetValuesOrder.reorderValuesIfUsingAlphabeticalSort(this.values);
        this.sortValuesDependingOnStatus(numberOfValues);
        this.values = facetValuesOrder.reorderValuesIfUsingCustomSort(this.values);
    };
    FacetValues.prototype.sortValuesDependingOnStatus = function (numOfDisplayedValues) {
        this.values = _.sortBy(this.values, function (value) {
            if (value.selected) {
                return 1;
            }
            else if (value.excluded) {
                return 3;
            }
            else {
                return 2;
            }
        });
        this.ensureExcludedValuesAreDisplayed(numOfDisplayedValues);
    };
    FacetValues.prototype.ensureExcludedValuesAreDisplayed = function (numOfDisplayedValues) {
        if (numOfDisplayedValues != null && numOfDisplayedValues < this.values.length) {
            var nbExclude = this.getExcluded().length;
            var excludedValues = this.values.splice(this.values.length - nbExclude, nbExclude);
            (_a = this.values).splice.apply(_a, [numOfDisplayedValues - nbExclude, 0].concat(excludedValues));
        }
        var _a;
    };
    return FacetValues;
}());
exports.FacetValues = FacetValues;


/***/ }),

/***/ 567:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../ui/FacetRange/FacetRange.ts" />
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
var FacetQueryController_1 = __webpack_require__(213);
var Utils_1 = __webpack_require__(4);
var FacetRangeQueryController = /** @class */ (function (_super) {
    __extends(FacetRangeQueryController, _super);
    function FacetRangeQueryController(facet) {
        var _this = _super.call(this, facet) || this;
        _this.facet = facet;
        return _this;
    }
    FacetRangeQueryController.prototype.createBasicGroupByRequest = function (allowedValues, addComputedField) {
        if (addComputedField === void 0) { addComputedField = true; }
        var groupByQuery = _super.prototype.createBasicGroupByRequest.call(this, null, addComputedField);
        groupByQuery.allowedValues = undefined;
        if (Utils_1.Utils.isNonEmptyArray(this.facet.options.ranges)) {
            groupByQuery = this.buildGroupByQueryForPredefinedRanges(groupByQuery);
        }
        else {
            groupByQuery = this.buildGroupByQueryForAutomaticRanges(groupByQuery);
        }
        return groupByQuery;
    };
    FacetRangeQueryController.prototype.createGroupByAllowedValues = function () {
        return undefined;
    };
    FacetRangeQueryController.prototype.buildGroupByQueryForAutomaticRanges = function (groupByQuery) {
        groupByQuery.generateAutomaticRanges = true;
        return groupByQuery;
    };
    FacetRangeQueryController.prototype.buildGroupByQueryForPredefinedRanges = function (groupByQuery) {
        groupByQuery.rangeValues = this.facet.options.ranges;
        groupByQuery.maximumNumberOfValues = this.facet.options.ranges.length;
        return groupByQuery;
    };
    return FacetRangeQueryController;
}(FacetQueryController_1.FacetQueryController));
exports.FacetRangeQueryController = FacetRangeQueryController;


/***/ }),

/***/ 67:
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
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(535);
__webpack_require__(536);
var _ = __webpack_require__(0);
var FacetQueryController_1 = __webpack_require__(213);
var BreadcrumbEvents_1 = __webpack_require__(34);
var OmniboxEvents_1 = __webpack_require__(33);
var QueryEvents_1 = __webpack_require__(11);
var SearchAlertEvents_1 = __webpack_require__(83);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var Defer_1 = __webpack_require__(31);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var ComponentsTypes_1 = __webpack_require__(45);
var DependsOnManager_1 = __webpack_require__(173);
var DeviceUtils_1 = __webpack_require__(24);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var ResponsiveFacetOptions_1 = __webpack_require__(82);
var ResponsiveFacets_1 = __webpack_require__(174);
var BreadcrumbValueElement_1 = __webpack_require__(477);
var BreadcrumbValuesList_1 = __webpack_require__(478);
var FacetHeader_1 = __webpack_require__(476);
var FacetSearch_1 = __webpack_require__(479);
var FacetSearchParameters_1 = __webpack_require__(172);
var FacetSearchValuesList_1 = __webpack_require__(480);
var FacetSettings_1 = __webpack_require__(474);
var FacetSort_1 = __webpack_require__(475);
var FacetUtils_1 = __webpack_require__(39);
var FacetValueElement_1 = __webpack_require__(127);
var FacetValue_1 = __webpack_require__(112);
var FacetValues_1 = __webpack_require__(554);
var FacetValuesList_1 = __webpack_require__(481);
var FacetValuesOrder_1 = __webpack_require__(470);
var OmniboxValueElement_1 = __webpack_require__(482);
var OmniboxValuesList_1 = __webpack_require__(483);
var ValueElementRenderer_1 = __webpack_require__(469);
/**
 * The `Facet` component displays a *facet* of the results for the current query. A facet is a list of values for a
 * certain field occurring in the results, ordered using a configurable criteria (e.g., number of occurrences).
 *
 * The list of values is obtained using a [`GroupByRequest`]{@link IGroupByRequest} operation performed at the same time
 * as the main query.
 *
 * The `Facet` component allows the end user to drill down inside a result set by restricting the result to certain
 * field values. It also allows filtering out values from the facet itself, and can provide a search box to look for
 * specific values inside larger sets.
 *
 * This is probably the most complex component in the Coveo JavaScript Search Framework and as such, it allows for many
 * configuration options.
 *
 * See also the [`FacetRange`]{@link FacetRange} and [`TimespanFacet`]{@link TimespanFacet} components (which
 * extend this component), and the [`FacetSlider`]{@link FacetSlider} and [`CategoryFacet`]{@link CategoryFacet} components (which do not extend this
 * component, but are very similar).
 */
var Facet = /** @class */ (function (_super) {
    __extends(Facet, _super);
    /**
     * Creates a new `Facet` component. Binds multiple query events as well.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `Facet` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param facetClassId The ID to use for this facet (as `Facet` inherited from by other component
     * (e.g., [`FacetRange`]{@link FacetRange}). Default value is `Facet`.
     */
    function Facet(element, options, bindings, facetClassId) {
        if (facetClassId === void 0) { facetClassId = Facet.ID; }
        var _this = _super.call(this, element, facetClassId, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.keepDisplayedValuesNextTime = false;
        _this.values = new FacetValues_1.FacetValues();
        _this.currentPage = 0;
        _this.firstQuery = true;
        _this.isFieldValueCompatible = true;
        _this.canFetchMore = true;
        _this.showingWaitAnimation = false;
        _this.listenToQueryStateChange = true;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Facet, options);
        if (_this.options.valueCaption != null) {
            _this.options.availableSorts = _.filter(_this.options.availableSorts, function (sort) { return !/^alpha.*$/.test(sort); });
            _this.logger.warn("Because the " + _this.options.field + " facet is using value captions, alphabetical sorts are disabled.");
        }
        ResponsiveFacets_1.ResponsiveFacets.init(_this.root, _this, _this.options);
        // Serves as a way to render facet in the omnibox in the order in which they are instantiated
        _this.omniboxZIndex = Facet.omniboxIndex;
        Facet.omniboxIndex--;
        _this.checkForComputedFieldAndSort();
        _this.checkForValueCaptionType();
        _this.checkForCustomSort();
        _this.initDependsOnManager();
        _this.initFacetQueryController();
        _this.initQueryEvents();
        _this.initQueryStateEvents();
        _this.initComponentStateEvents();
        _this.initOmniboxEvents();
        _this.initBreadCrumbEvents();
        _this.initSearchAlertEvents();
        _this.updateNumberOfValues();
        _this.bind.oneRootElement(QueryEvents_1.QueryEvents.querySuccess, function () {
            _this.firstQuery = false;
        });
        return _this;
    }
    Facet.prototype.setExpandedFacetSearchAccessibilityAttributes = function (searchResultsElement) {
        if (!this.searchContainer) {
            return;
        }
        Assert_1.Assert.exists(searchResultsElement);
        var accessibleElement = this.searchContainer.accessibleElement;
        accessibleElement.setAttribute('aria-expanded', true.toString());
    };
    Facet.prototype.setCollapsedFacetSearchAccessibilityAttributes = function () {
        if (!this.searchContainer) {
            return;
        }
        this.searchContainer.accessibleElement.setAttribute('aria-expanded', false.toString());
    };
    Facet.prototype.isCurrentlyDisplayed = function () {
        if (!Dom_1.$$(this.element).isVisible()) {
            return false;
        }
        if (Dom_1.$$(this.element).hasClass('coveo-active')) {
            return true;
        }
        if (Dom_1.$$(this.element).hasClass('coveo-facet-empty')) {
            return false;
        }
        return true;
    };
    Facet.prototype.createDom = function () {
        var _this = this;
        this.initBottomAndTopSpacer();
        this.buildFacetContent();
        this.updateAppearanceDependingOnState();
        // After the facet has been created (and before the first query is applied)
        // Try to load a state from the setting, if it's available
        // Execute only _.once (only the first query, or the first time the user switch to a tab that contains a newly set of active facet)
        if (this.facetSettings && this.options.enableSettingsFacetState) {
            var loadOnce = _.once(function () {
                _this.facetSettings.loadSavedState.apply(_this.facetSettings);
            });
            this.bind.onRootElement(QueryEvents_1.QueryEvents.newQuery, loadOnce);
        }
    };
    /**
     * Selects a single value.
     *
     * Does not trigger a query automatically.
     *
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string (e.g., `selectValue('foobar')` or
     * `selectValue(new FacetValue('foobar'))`).
     */
    Facet.prototype.selectValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Selecting facet value', this.facetValuesList.select(value));
        this.facetValueHasChanged();
    };
    /**
     * Selects multiple values.
     *
     * Does not trigger a query automatically.
     *
     * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
     */
    Facet.prototype.selectMultipleValues = function (values) {
        var _this = this;
        Assert_1.Assert.exists(values);
        this.ensureDom();
        _.each(values, function (value) {
            _this.logger.info('Selecting facet value', _this.facetValuesList.select(value));
        });
        this.facetValueHasChanged();
    };
    /**
     * Deselects a single value.
     *
     * Does not trigger a query automatically.
     *
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string (e.g., `deselectValue('foobar')` or
     * `deselectValue(new FacetValue('foobar'))`).
     */
    Facet.prototype.deselectValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Deselecting facet value', this.facetValuesList.unselect(value));
        this.facetValueHasChanged();
    };
    /**
     * Deselects multiple values.
     *
     * Does not trigger a query automatically.
     *
     * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
     */
    Facet.prototype.deselectMultipleValues = function (values) {
        var _this = this;
        Assert_1.Assert.exists(values);
        this.ensureDom();
        _.each(values, function (value) {
            _this.logger.info('Deselecting facet value', _this.facetValuesList.unselect(value));
        });
        this.facetValueHasChanged();
    };
    /**
     * Excludes a single value.
     *
     * Does not trigger a query automatically.
     *
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string (e.g., `excludeValue('foobar')` or
     * `excludeValue(new FacetValue('foobar'))`).
     */
    Facet.prototype.excludeValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Excluding facet value', this.facetValuesList.exclude(value));
        this.facetValueHasChanged();
    };
    /**
     * Excludes multiple values.
     *
     * Does not trigger a query automatically.
     *
     * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
     */
    Facet.prototype.excludeMultipleValues = function (values) {
        var _this = this;
        Assert_1.Assert.exists(values);
        this.ensureDom();
        _.each(values, function (value) {
            _this.logger.info('Excluding facet value', _this.facetValuesList.exclude(value));
        });
        this.facetValueHasChanged();
    };
    /**
     * Unexcludes a single value.
     *
     * Does not trigger a query automatically.
     *
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string.
     */
    Facet.prototype.unexcludeValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Unexcluding facet value', this.facetValuesList.unExclude(value));
        this.facetValueHasChanged();
    };
    /**
     * Unexcludes multiple values.
     *
     * Does not trigger a query automatically.
     *
     * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
     */
    Facet.prototype.unexcludeMultipleValues = function (values) {
        var _this = this;
        Assert_1.Assert.exists(values);
        this.ensureDom();
        _.each(values, function (value) {
            _this.logger.info('Unexcluding facet value', _this.facetValuesList.unExclude(value));
        });
        this.facetValueHasChanged();
    };
    /**
     * Toggles the selection state of a single value (selects the value if it is not already selected; un-selects the
     * value if it is already selected).
     *
     * Does not trigger a query automatically.
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string.
     */
    Facet.prototype.toggleSelectValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Toggle select facet value', this.facetValuesList.toggleSelect(value));
        this.facetValueHasChanged();
    };
    /**
     * Toggles the exclusion state of a single value (excludes the value if it is not already excluded; un-excludes the
     * value if it is already excluded).
     *
     * Does not trigger a query automatically.
     *
     * @param value Can be a [`FacetValue`]{@link FacetValue} or a string.
     */
    Facet.prototype.toggleExcludeValue = function (value) {
        Assert_1.Assert.exists(value);
        this.ensureDom();
        this.logger.info('Toggle exclude facet value', this.facetValuesList.toggleExclude(value));
        this.facetValueHasChanged();
    };
    /**
     * Returns the currently displayed values as an array of strings.
     *
     * @returns {any[]} The currently displayed values.
     */
    Facet.prototype.getDisplayedValues = function () {
        return _.pluck(this.getDisplayedFacetValues(), 'value');
    };
    /**
     * Returns the currently displayed values as an array of [`FacetValue`]{@link FacetValue}.
     *
     * @returns {T[]} The currently displayed values.
     */
    Facet.prototype.getDisplayedFacetValues = function () {
        this.ensureDom();
        var displayed = this.facetValuesList.getAllCurrentlyDisplayed();
        return _.map(displayed, function (value) {
            return value.facetValue;
        });
    };
    /**
     * Returns the currently selected values as an array of strings.
     * @returns {string[]} The currently selected values.
     */
    Facet.prototype.getSelectedValues = function () {
        this.ensureDom();
        return _.map(this.values.getSelected(), function (value) { return value.value; });
    };
    /**
     * Determines whether the specified value is selected in the facet.
     * @param value The name of the facet value to verify.
     */
    Facet.prototype.hasSelectedValue = function (value) {
        var facetValue = this.values.get(value);
        return facetValue && facetValue.selected;
    };
    /**
     * Returns the currently excluded values as an array of strings.
     * @returns {string[]} The currently excluded values.
     */
    Facet.prototype.getExcludedValues = function () {
        this.ensureDom();
        return _.map(this.values.getExcluded(), function (value) { return value.value; });
    };
    /**
     * Resets the facet by un-selecting all values, un-excluding all values, and redrawing the facet.
     */
    Facet.prototype.reset = function () {
        this.ensureDom();
        this.values.reset();
        this.rebuildValueElements();
        this.updateAppearanceDependingOnState();
        this.updateQueryStateModel();
    };
    /**
     * Switches the facet to `AND` mode.
     *
     * See the [`useAnd`]{@link Facet.options.useAnd}, and
     * [`enableTogglingOperator`]{@link Facet.options.enableTogglingOperator} options.
     */
    Facet.prototype.switchToAnd = function () {
        this.ensureDom();
        this.logger.info('Switching to AND');
        this.facetHeader.switchToAnd();
    };
    /**
     * Switches the facet to `OR` mode.
     *
     * See the [`useAnd`]{@link Facet.options.useAnd}, and
     * [`enableTogglingOperator`]{@link Facet.options.enableTogglingOperator} options.
     */
    Facet.prototype.switchToOr = function () {
        this.ensureDom();
        this.logger.info('Switching to OR');
        this.facetHeader.switchToOr();
    };
    /**
     * Returns the endpoint for the facet.
     * @returns {ISearchEndpoint} The endpoint for the facet.
     */
    Facet.prototype.getEndpoint = function () {
        return this.queryController.getEndpoint();
    };
    /**
     * Changes the sort parameter for the facet.
     *
     * See {@link Facet.options.availableSorts} for the list of possible values.
     *
     * Also triggers a new query.
     *
     * @param criteria The new sort parameter for the facet.
     */
    Facet.prototype.updateSort = function (criteria) {
        this.ensureDom();
        if (this.options.sortCriteria != criteria) {
            this.options.sortCriteria = criteria;
            this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetUpdateSort, {
                criteria: criteria,
                facetId: this.options.id,
                facetField: this.options.field.toString(),
                facetTitle: this.options.title
            }, this.element);
            this.triggerNewQuery();
        }
    };
    Facet.prototype.unfadeInactiveValuesInMainList = function () {
        Dom_1.$$(this.element).removeClass('coveo-facet-fade');
    };
    Facet.prototype.fadeInactiveValuesInMainList = function (delay) {
        Dom_1.$$(this.element).addClass('coveo-facet-fade');
    };
    /**
     * Shows a waiting animation in the facet header (a spinner).
     */
    Facet.prototype.showWaitingAnimation = function () {
        this.ensureDom();
        if (!this.showingWaitAnimation) {
            Dom_1.$$(this.headerElement).find('.coveo-facet-header-wait-animation').style.visibility = 'visible';
            this.showingWaitAnimation = true;
        }
    };
    /**
     * Hides the waiting animation in the facet header.
     */
    Facet.prototype.hideWaitingAnimation = function () {
        this.ensureDom();
        if (this.showingWaitAnimation) {
            Dom_1.$$(this.headerElement).find('.coveo-facet-header-wait-animation').style.visibility = 'hidden';
            this.showingWaitAnimation = false;
        }
    };
    Facet.prototype.processFacetSearchAllResultsSelected = function (facetValues) {
        var _this = this;
        var valuesForAnalytics = [];
        _.each(facetValues, function (facetValue) {
            _this.ensureFacetValueIsInList(facetValue);
            valuesForAnalytics.push(facetValue.value);
        });
        // Calculate the correct number of values from the current selected/excluded values (those will stay no matter what next rendering)
        // add the new one that will be selected (and are not already selected in the facet)
        // The minimum number of values is the number of values set in the option
        var valuesThatStays = this.values.getSelected().concat(this.values.getExcluded());
        this.numberOfValues = valuesThatStays.length + _.difference(valuesThatStays, facetValues).length;
        this.numberOfValues = Math.max(this.numberOfValues, this.options.numberOfValues);
        this.updateQueryStateModel();
        this.triggerNewQuery(function () {
            return _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.facetSelectAll, {
                facetId: _this.options.id,
                facetField: _this.options.field.toString(),
                facetTitle: _this.options.title
            });
        });
    };
    Facet.prototype.pinFacetPosition = function () {
        if (this.options.preservePosition) {
            this.pinnedViewportPosition = this.element.getBoundingClientRect().top;
        }
    };
    /**
     * Returns the configured caption for the given [`FacetValue`]{@link FacetValue}.
     *
     * @param facetValue The `FacetValue` whose caption the method should return.
     */
    Facet.prototype.getValueCaption = function (facetValue) {
        Assert_1.Assert.exists(facetValue);
        var lookupValue = typeof facetValue === 'string' ? facetValue : facetValue.lookupValue || facetValue.value;
        var ret = FacetUtils_1.FacetUtils.tryToGetTranslatedCaption(this.options.field, lookupValue);
        if (Utils_1.Utils.exists(this.options.valueCaption)) {
            if (typeof this.options.valueCaption == 'object') {
                ret = this.options.valueCaption[lookupValue] || ret;
            }
            if (typeof this.options.valueCaption == 'function') {
                var fv = facetValue instanceof FacetValue_1.FacetValue ? facetValue : FacetValue_1.FacetValue.create(facetValue);
                var valueFromList = this.facetValuesList.get(fv).facetValue;
                ret = this.options.valueCaption.call(this, valueFromList);
            }
        }
        return ret;
    };
    /**
     * Returns the configured caption for a desired facet value.
     *
     * @param value The string facet value whose caption the method should return.
     */
    Facet.prototype.getCaptionForStringValue = function (value) {
        Assert_1.Assert.exists(value);
        return this.getValueCaption(value);
    };
    /**
     * Shows the next page of results in the facet.
     *
     * See the [`enableMoreLess`]{@link Facet.options.enableMoreLess}, and [`pageSize`]{@link Facet.options.pageSize}
     * options.
     *
     * Triggers a query if needed, or displays the already available values.
     */
    Facet.prototype.showMore = function () {
        this.currentPage = Math.floor((this.numberOfValues - this.options.numberOfValues) / this.options.pageSize) + 1;
        this.updateNumberOfValues();
        if (this.nbAvailableValues >= this.numberOfValues || !this.canFetchMore) {
            this.rebuildValueElements();
        }
        else {
            this.triggerMoreQuery();
        }
    };
    /**
     * Shows less elements in the Facet (up to the original number of values).
     *
     * See the [`enableMoreLess`]{@link Facet.options.enableMoreLess}, and
     * [`numberOfValues`]{@link Facet.options.numberOfValues} options.
     */
    Facet.prototype.showLess = function () {
        Dom_1.$$(this.lessElement).removeClass('coveo-active');
        this.currentPage = 0;
        this.updateNumberOfValues();
        Dom_1.$$(this.moreElement).addClass('coveo-active');
        this.values.sortValuesDependingOnStatus(this.numberOfValues);
        this.rebuildValueElements();
        this.logAnalyticsFacetShowMoreLess(AnalyticsActionListMeta_1.analyticsActionCauseList.facetShowLess);
    };
    /**
     * Collapses the facet.
     */
    Facet.prototype.collapse = function () {
        this.ensureDom();
        if (this.facetHeader) {
            this.facetHeader.collapseFacet();
        }
    };
    /**
     * Expands the facet.
     */
    Facet.prototype.expand = function () {
        this.ensureDom();
        if (this.facetHeader) {
            this.facetHeader.expandFacet();
        }
    };
    Facet.prototype.triggerNewQuery = function (beforeExecuteQuery) {
        if (!beforeExecuteQuery) {
            this.queryController.executeQuery({ ignoreWarningSearchEvent: true });
        }
        else {
            this.queryController.executeQuery({ beforeExecuteQuery: beforeExecuteQuery });
        }
        this.showWaitingAnimation();
    };
    Facet.prototype.handleDeferredQuerySuccess = function (data) {
        Assert_1.Assert.exists(data);
        this.unfadeInactiveValuesInMainList();
        this.hideWaitingAnimation();
        var groupByResult = data.results.groupByResults[this.facetQueryController.lastGroupByRequestIndex];
        this.facetQueryController.lastGroupByResult = groupByResult;
        // Two corner case to handle regarding the "sticky" aspect of facets :
        // 1) The group by is empty (so there is nothing to "sticky")
        // 2) There is only one value displayed currently, so there is nothing to "sticky" either
        if (!groupByResult) {
            this.keepDisplayedValuesNextTime = false;
        }
        if (this.values.getAll().length == 1) {
            this.keepDisplayedValuesNextTime = false;
        }
        this.processNewGroupByResults(groupByResult);
    };
    Facet.prototype.handleQueryError = function () {
        this.updateValues(new FacetValues_1.FacetValues());
        this.updateAppearanceDependingOnState();
        this.hideWaitingAnimation();
    };
    Facet.prototype.handlePopulateBreadcrumb = function (args) {
        Assert_1.Assert.exists(args);
        if (this.values.hasSelectedOrExcludedValues()) {
            var element = new BreadcrumbValuesList_1.BreadcrumbValueList(this, this.values.getSelected().concat(this.values.getExcluded()), BreadcrumbValueElement_1.BreadcrumbValueElement).build();
            args.breadcrumbs.push({ element: element });
        }
    };
    Facet.prototype.handlePopulateSearchAlerts = function (args) {
        if (this.values.hasSelectedOrExcludedValues()) {
            var excludedValues = this.values.getExcluded();
            var selectedValues = this.values.getSelected();
            if (!_.isEmpty(excludedValues)) {
                args.text.push({
                    value: new BreadcrumbValuesList_1.BreadcrumbValueList(this, excludedValues, BreadcrumbValueElement_1.BreadcrumbValueElement).buildAsString(),
                    lineThrough: true
                });
            }
            if (!_.isEmpty(selectedValues)) {
                args.text.push({
                    value: new BreadcrumbValuesList_1.BreadcrumbValueList(this, selectedValues, BreadcrumbValueElement_1.BreadcrumbValueElement).buildAsString(),
                    lineThrough: false
                });
            }
        }
    };
    Facet.prototype.initFacetQueryController = function () {
        this.facetQueryController = new FacetQueryController_1.FacetQueryController(this);
    };
    Facet.prototype.initFacetValuesList = function () {
        this.facetValuesList = new FacetValuesList_1.FacetValuesList(this, FacetValueElement_1.FacetValueElement);
        this.element.appendChild(this.facetValuesList.build());
    };
    Facet.prototype.initFacetSearch = function () {
        this.facetSearch = new FacetSearch_1.FacetSearch(this, FacetSearchValuesList_1.FacetSearchValuesList, this.root);
        this.element.appendChild(this.facetSearch.build());
    };
    Facet.prototype.facetValueHasChanged = function () {
        var _this = this;
        this.updateQueryStateModel();
        this.rebuildValueElements();
        Defer_1.Defer.defer(function () {
            _this.updateAppearanceDependingOnState();
        });
    };
    Facet.prototype.updateAppearanceDependingOnState = function () {
        Dom_1.$$(this.element).toggleClass('coveo-active', this.values.hasSelectedOrExcludedValues());
        Dom_1.$$(this.element).toggleClass('coveo-facet-empty', !this.isAnyValueCurrentlyDisplayed());
        Dom_1.$$(this.facetHeader.eraserElement).toggleClass('coveo-facet-header-eraser-visible', this.values.hasSelectedOrExcludedValues());
    };
    Facet.prototype.initQueryEvents = function () {
        var _this = this;
        this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function () { return _this.handleDuringQuery(); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.doneBuildingQuery, function (args) { return _this.handleDoneBuildingQuery(args); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function (args) { return _this.handleDeferredQuerySuccess(args); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return _this.handleQueryError(); });
    };
    Facet.prototype.initQueryStateEvents = function () {
        var _this = this;
        this.includedAttributeId = QueryStateModel_1.QueryStateModel.getFacetId(this.options.id);
        this.excludedAttributeId = QueryStateModel_1.QueryStateModel.getFacetId(this.options.id, false);
        this.operatorAttributeId = QueryStateModel_1.QueryStateModel.getFacetOperator(this.options.id);
        this.lookupValueAttributeId = QueryStateModel_1.QueryStateModel.getFacetLookupValue(this.options.id);
        this.queryStateModel.registerNewAttribute(this.includedAttributeId, []);
        this.queryStateModel.registerNewAttribute(this.excludedAttributeId, []);
        this.queryStateModel.registerNewAttribute(this.operatorAttributeId, '');
        this.queryStateModel.registerNewAttribute(this.lookupValueAttributeId, {});
        this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE, undefined, function (args) { return _this.handleQueryStateChanged(args); });
    };
    Facet.prototype.initComponentStateEvents = function () {
        this.componentStateId = QueryStateModel_1.QueryStateModel.getFacetId(this.options.id);
        this.componentStateModel.registerComponent(this.componentStateId, this);
    };
    Facet.prototype.initOmniboxEvents = function () {
        var _this = this;
        if (this.options.includeInOmnibox) {
            this.bind.onRootElement(OmniboxEvents_1.OmniboxEvents.populateOmnibox, function (args) { return _this.handlePopulateOmnibox(args); });
        }
    };
    Facet.prototype.initBreadCrumbEvents = function () {
        var _this = this;
        if (this.options.includeInBreadcrumb) {
            this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) {
                return _this.handlePopulateBreadcrumb(args);
            });
            this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function (args) { return _this.handleClearBreadcrumb(); });
        }
    };
    Facet.prototype.initSearchAlertEvents = function () {
        var _this = this;
        this.bind.onRootElement(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsPopulateMessage, function (args) {
            return _this.handlePopulateSearchAlerts(args);
        });
    };
    Facet.prototype.handleOmniboxWithStaticValue = function (eventArg) {
        var _this = this;
        var regex = new RegExp('^' + eventArg.completeQueryExpression.regex.source, 'i');
        var match = _.first(_.filter(this.getDisplayedValues(), function (displayedValue) {
            var value = _this.getValueCaption(_this.facetValuesList.get(displayedValue).facetValue);
            return regex.test(value);
        }), this.options.numberOfValuesInOmnibox);
        var facetValues = _.map(match, function (gotAMatch) {
            return _this.facetValuesList.get(gotAMatch).facetValue;
        });
        var element = new OmniboxValuesList_1.OmniboxValuesList(this, facetValues, eventArg, OmniboxValueElement_1.OmniboxValueElement).build();
        eventArg.rows.push({ element: element, zIndex: this.omniboxZIndex });
    };
    Facet.prototype.processNewGroupByResults = function (groupByResult) {
        this.logger.trace('Displaying group by results', groupByResult);
        if (groupByResult != undefined && groupByResult.values != undefined) {
            this.nbAvailableValues = groupByResult.values.length;
        }
        var newFacetValues = new FacetValues_1.FacetValues(groupByResult);
        this.updateValues(newFacetValues);
        this.canFetchMore = this.numberOfValues < this.nbAvailableValues;
        if (this.values.hasSelectedOrExcludedValues() && !this.options.useAnd && this.options.isMultiValueField) {
            this.triggerUpdateDeltaQuery(_.filter(this.values.getAll(), function (facetValue) {
                return !facetValue.selected && !facetValue.excluded;
            }));
        }
        else if (this.values.getSelected().length > 0 && !this.options.useAnd) {
            this.values.updateDeltaWithFilteredFacetValues(new FacetValues_1.FacetValues(), this.options.isMultiValueField);
        }
        if (!this.values.hasSelectedOrExcludedValues() || this.options.useAnd || !this.options.isMultiValueField) {
            this.rebuildValueElements();
            this.updateAppearanceDependingOnState();
            this.ensurePinnedFacetHasntMoved();
        }
        this.keepDisplayedValuesNextTime = false;
    };
    Facet.prototype.updateQueryStateModel = function () {
        this.listenToQueryStateChange = false;
        this.updateExcludedQueryStateModel();
        this.updateIncludedQueryStateModel();
        this.facetHeader.updateOperatorQueryStateModel();
        this.updateLookupValueQueryStateModel();
        this.listenToQueryStateChange = true;
    };
    Facet.prototype.rebuildValueElements = function () {
        this.updateNumberOfValues();
        this.facetValuesList.rebuild(this.numberOfValues);
        if (this.shouldRenderMoreLess()) {
            this.updateMoreLess();
            if (this.shouldRenderFacetSearch()) {
                this.updateSearchElement(this.nbAvailableValues > this.numberOfValues);
            }
        }
        else if (this.shouldRenderFacetSearch()) {
            this.updateSearchElement();
        }
    };
    Facet.prototype.updateSearchElement = function (moreValuesAvailable) {
        var _this = this;
        if (moreValuesAvailable === void 0) { moreValuesAvailable = true; }
        if (!moreValuesAvailable) {
            return;
        }
        var renderer = new ValueElementRenderer_1.ValueElementRenderer(this, FacetValue_1.FacetValue.create(Strings_1.l('Search')));
        this.searchContainer = renderer.build().withNo([renderer.excludeIcon, renderer.icon]);
        Dom_1.$$(this.searchContainer.listItem).addClass('coveo-facet-search-button');
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.searchContainer.accessibleElement)
            .withLabel(Strings_1.l('SearchFacetResults', this.options.title))
            .withEnterKeyboardAction(function (e) { return _this.toggleSearchMenu(e); })
            .build();
        this.setCollapsedFacetSearchAccessibilityAttributes();
        // Mobile do not like label. Use click event
        if (DeviceUtils_1.DeviceUtils.isMobileDevice()) {
            Dom_1.$$(this.searchContainer.label).on('click', function (e) { return _this.toggleSearchMenu(e); });
        }
        Dom_1.$$(this.searchContainer.checkbox).on('change', function () {
            Dom_1.$$(_this.element).addClass('coveo-facet-searching');
            _this.facetSearch.focus();
        });
        this.facetValuesList.valueContainer.appendChild(this.searchContainer.listItem);
    };
    Facet.prototype.updateMoreLess = function (lessElementIsShown, moreValuesAvailable) {
        if (lessElementIsShown === void 0) { lessElementIsShown = this.getMinimumNumberOfValuesToDisplay() < this.numberOfValues; }
        if (moreValuesAvailable === void 0) { moreValuesAvailable = this.nbAvailableValues > this.numberOfValues; }
        if (lessElementIsShown) {
            Dom_1.$$(this.lessElement).addClass('coveo-active');
        }
        else {
            Dom_1.$$(this.lessElement).removeClass('coveo-active');
        }
        if (moreValuesAvailable) {
            Dom_1.$$(this.moreElement).addClass('coveo-active');
        }
        else {
            Dom_1.$$(this.moreElement).removeClass('coveo-active');
        }
        if (lessElementIsShown || moreValuesAvailable) {
            Dom_1.$$(this.footerElement).removeClass('coveo-facet-empty');
        }
        else {
            Dom_1.$$(this.footerElement).addClass('coveo-facet-empty');
        }
    };
    Facet.prototype.handleClickMore = function () {
        this.showMore();
    };
    Facet.prototype.handleClickLess = function () {
        this.showLess();
    };
    Facet.prototype.toggleSearchMenu = function (e) {
        var searchButton = this.searchContainer;
        if (searchButton.checkbox.getAttribute('checked')) {
            searchButton.checkbox.removeAttribute('checked');
        }
        else {
            searchButton.checkbox.setAttribute('checked', 'checked');
        }
        Dom_1.$$(searchButton.checkbox).trigger('change');
        e.stopPropagation();
        e.preventDefault();
    };
    Facet.prototype.checkForComputedFieldAndSort = function () {
        if (this.options.sortCriteria.toLowerCase().indexOf('computedfield') != -1 && Utils_1.Utils.isNullOrUndefined(this.options.computedField)) {
            this.logger.warn('Sort criteria is specified as ComputedField, but the facet uses no computed field. Facet will always be empty !', this);
        }
    };
    Facet.prototype.checkForValueCaptionType = function () {
        if (this.options.valueCaption && typeof this.options.valueCaption == 'function') {
            this.options.enableFacetSearch = false;
            this.options.includeInOmnibox = false;
            this.logger.warn('Using a function as valueCaption is now deprecated. Use a json key value pair instead. Facet search and omnibox has been disabled for this facet', this);
        }
    };
    Facet.prototype.checkForCustomSort = function () {
        if (this.options.customSort != undefined && !_.contains(this.options.availableSorts, 'custom')) {
            this.options.availableSorts.unshift('custom');
        }
        if (this.options.availableSorts[0] == 'custom') {
            this.options.sortCriteria = 'nosort';
        }
    };
    Facet.prototype.initDependsOnManager = function () {
        var _this = this;
        var facetInfo = {
            reset: function () { return _this.reset(); },
            ref: this
        };
        this.dependsOnManager = new DependsOnManager_1.DependsOnManager(facetInfo);
    };
    Facet.prototype.dependsOnUpdateParentDisplayValue = function () {
        var _this = this;
        if (!this.options.dependsOn) {
            return;
        }
        var masterFacetComponent = ComponentsTypes_1.ComponentsTypes.getAllFacetInstancesFromElement(this.root).filter(function (cmp) {
            var idFacet = cmp instanceof Facet;
            return idFacet && cmp.options.id === _this.options.dependsOn;
        });
        if (!masterFacetComponent.length) {
            this.logger.warn("Unable to find a Facet with the id or field \"" + this.options.dependsOn + "\".", "The master facet values can't be updated.");
            return;
        }
        if (masterFacetComponent.length > 1) {
            this.logger.warn("Multiple facets with id \"" + this.options.dependsOn + "\" found.", "A given facet may only depend on a single other facet.", "Ensure that each facet in your search interface has a unique id.", "The master facet cannot be updated.", masterFacetComponent);
            return;
        }
        var masterFacet = masterFacetComponent[0];
        masterFacet.keepDisplayedValuesNextTime = false;
    };
    Facet.prototype.initBottomAndTopSpacer = function () {
        var _this = this;
        var bottomSpace = Dom_1.$$(this.options.paddingContainer).find('.coveo-bottomSpace');
        var topSpace = Dom_1.$$(this.options.paddingContainer).find('.coveo-topSpace');
        if (this.options.preservePosition) {
            Dom_1.$$(this.options.paddingContainer).on('mouseleave', function () { return _this.unpinFacetPosition(); });
            this.pinnedTopSpace = topSpace;
            this.pinnedBottomSpace = bottomSpace;
            if (!this.pinnedTopSpace) {
                this.pinnedTopSpace = document.createElement('div');
                Dom_1.$$(this.pinnedTopSpace).addClass('coveo-topSpace');
                Dom_1.$$(this.pinnedTopSpace).insertBefore(this.options.paddingContainer.firstChild);
            }
            if (!this.pinnedBottomSpace) {
                this.pinnedBottomSpace = document.createElement('div');
                Dom_1.$$(this.pinnedBottomSpace).addClass('coveo-bottomSpace');
                this.options.paddingContainer.appendChild(this.pinnedBottomSpace);
            }
        }
    };
    Facet.prototype.updateIncludedQueryStateModel = function () {
        var selectedValues = { included: this.getSelectedValues(), title: this.includedAttributeId };
        this.queryStateModel.set(this.includedAttributeId, selectedValues.included);
    };
    Facet.prototype.updateExcludedQueryStateModel = function () {
        var excludedValues = { title: this.excludedAttributeId, excluded: this.getExcludedValues() };
        this.queryStateModel.set(this.excludedAttributeId, excludedValues.excluded);
    };
    Facet.prototype.updateLookupValueQueryStateModel = function () {
        if (this.options.lookupField) {
            var valueToSet_1 = {};
            _.each(this.values.getSelected().concat(this.values.getExcluded()), function (value) {
                valueToSet_1[value.value] = value.lookupValue;
            });
            this.queryStateModel.set(this.lookupValueAttributeId, valueToSet_1);
        }
    };
    Facet.prototype.handleQueryStateChangedOperator = function (operator) {
        if (operator == 'and') {
            this.switchToAnd();
        }
        else if (operator == 'or') {
            this.switchToOr();
        }
    };
    Facet.prototype.handleQueryStateChangedIncluded = function (includedChanged) {
        var toUnSelect = _.difference(this.getSelectedValues(), includedChanged);
        if (Utils_1.Utils.isNonEmptyArray(toUnSelect)) {
            this.deselectMultipleValues(toUnSelect);
        }
        if (!Utils_1.Utils.arrayEqual(this.getSelectedValues(), includedChanged, false)) {
            this.selectMultipleValues(includedChanged);
        }
    };
    Facet.prototype.handleQueryStateChangedExcluded = function (excludedChanged) {
        var toUnExclude = _.difference(this.getExcludedValues(), excludedChanged);
        if (Utils_1.Utils.isNonEmptyArray(toUnExclude)) {
            this.unexcludeMultipleValues(toUnExclude);
        }
        if (!Utils_1.Utils.arrayEqual(this.getExcludedValues(), excludedChanged, false)) {
            this.excludeMultipleValues(excludedChanged);
        }
    };
    Facet.prototype.handleLookupvalueChanged = function (lookupFieldChanged) {
        var _this = this;
        _.each(lookupFieldChanged, function (lookupvalue, value) {
            _this.facetValuesList.get(decodeURIComponent(value)).facetValue.lookupValue = decodeURIComponent(lookupvalue);
        });
    };
    Facet.prototype.handleQueryStateChanged = function (data) {
        Assert_1.Assert.exists(data);
        this.ensureDom();
        this.dependsOnUpdateParentDisplayValue();
        var trimValuesFromModel = function (values) {
            if (values) {
                values = _.map(values, function (value) { return value.trim(); });
            }
            return values;
        };
        var queryStateAttributes = data.attributes;
        var includedChanged = trimValuesFromModel(queryStateAttributes[this.includedAttributeId]);
        var excludedChanged = trimValuesFromModel(queryStateAttributes[this.excludedAttributeId]);
        var operator = queryStateAttributes[this.operatorAttributeId];
        var lookupValueChanged = queryStateAttributes[this.lookupValueAttributeId];
        if (this.listenToQueryStateChange) {
            if (!Utils_1.Utils.isNullOrEmptyString(operator)) {
                this.handleQueryStateChangedOperator(operator);
            }
            if (!Utils_1.Utils.isNullOrUndefined(includedChanged)) {
                this.handleQueryStateChangedIncluded(includedChanged);
            }
            if (!Utils_1.Utils.isNullOrUndefined(excludedChanged)) {
                this.handleQueryStateChangedExcluded(excludedChanged);
            }
            if (!Utils_1.Utils.isNullOrUndefined(lookupValueChanged)) {
                this.handleLookupvalueChanged(lookupValueChanged);
            }
        }
    };
    Facet.prototype.handlePopulateOmnibox = function (data) {
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.completeQueryExpression);
        // The omnibox calls can come in before a first query was executed (atypical, but
        // if no query is auto-triggered on initialization). To ensure that we've got the
        // proper filters, we ensure that at least a dumbshow query builder run occured
        // before proceeding.
        this.queryController.ensureCreatedQueryBuilder();
        if (this.canFetchMore) {
            this.handleOmniboxWithSearchInFacet(data);
        }
        else {
            this.handleOmniboxWithStaticValue(data);
        }
    };
    Facet.prototype.handleOmniboxWithSearchInFacet = function (eventArg) {
        var _this = this;
        var regex = new RegExp('^' + eventArg.completeQueryExpression.regex.source, 'i');
        var promise = new Promise(function (resolve, reject) {
            var searchParameters = new FacetSearchParameters_1.FacetSearchParameters(_this);
            searchParameters.setValueToSearch(eventArg.completeQueryExpression.word);
            searchParameters.nbResults = _this.options.numberOfValuesInOmnibox;
            _this.facetQueryController
                .search(searchParameters)
                .then(function (fieldValues) {
                var facetValues = _.map(_.filter(fieldValues, function (fieldValue) {
                    return regex.test(fieldValue.lookupValue);
                }), function (fieldValue) {
                    return _this.values.get(fieldValue.lookupValue) || FacetValue_1.FacetValue.create(fieldValue);
                });
                var element = new OmniboxValuesList_1.OmniboxValuesList(_this, facetValues, eventArg, OmniboxValueElement_1.OmniboxValueElement).build();
                resolve({ element: element, zIndex: _this.omniboxZIndex });
            })
                .catch(function () {
                resolve({ element: undefined });
            });
        });
        eventArg.rows.push({ deferred: promise });
    };
    Facet.prototype.handleDuringQuery = function () {
        this.ensureDom();
        if (!this.keepDisplayedValuesNextTime) {
            this.fadeInactiveValuesInMainList(this.options.facetSearchDelay);
        }
    };
    Facet.prototype.handleBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.queryBuilder);
        this.facetQueryController.prepareForNewQuery();
        if (this.values.hasSelectedOrExcludedValues()) {
            var expression = this.facetQueryController.computeOurFilterExpression();
            this.logger.trace('Putting filter in query', expression);
            data.queryBuilder.advancedExpression.add(expression);
        }
    };
    Facet.prototype.handleDoneBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.queryBuilder);
        var queryBuilder = data.queryBuilder;
        this.facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
    };
    Facet.prototype.handleClearBreadcrumb = function () {
        this.reset();
    };
    Facet.prototype.updateValues = function (facetValues) {
        Assert_1.Assert.exists(facetValues);
        if (this.keepDisplayedValuesNextTime) {
            this.values.updateCountsFromNewValues(facetValues);
        }
        else {
            this.values = this.consolidateAndSortNewFacetValues(facetValues);
        }
        this.updateNumberOfValues();
    };
    Facet.prototype.consolidateAndSortNewFacetValues = function (newValues) {
        newValues.importActiveValuesFromOtherList(this.values);
        newValues.sort(this.optionsToSortFacetValues);
        return newValues;
    };
    Object.defineProperty(Facet.prototype, "optionsToSortFacetValues", {
        get: function () {
            return {
                facetValuesOrder: this.facetValuesOrder,
                numberOfValues: this.numberOfValues
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Facet.prototype, "facetValuesOrder", {
        get: function () {
            return new FacetValuesOrder_1.FacetValuesOrder(this, this.facetSort);
        },
        enumerable: true,
        configurable: true
    });
    Facet.prototype.ensureFacetValueIsInList = function (facetValue) {
        Assert_1.Assert.exists(facetValue);
        if (!this.values.contains(facetValue.value)) {
            this.values.add(facetValue);
        }
    };
    Facet.prototype.isAnyValueCurrentlyDisplayed = function () {
        return !this.values.isEmpty();
    };
    Facet.prototype.buildFacetContent = function () {
        this.headerElement = this.buildHeader();
        this.element.appendChild(this.headerElement);
        this.initFacetValuesList();
        if (this.shouldRenderFacetSearch()) {
            this.initFacetSearch();
        }
        if (this.shouldRenderMoreLess()) {
            this.moreElement = this.buildMore();
            this.lessElement = this.buildLess();
        }
        this.footerElement = this.buildFooter();
        this.element.appendChild(this.footerElement);
        if (this.lessElement && this.moreElement) {
            this.footerElement.appendChild(this.lessElement);
            this.footerElement.appendChild(this.moreElement);
        }
    };
    Facet.prototype.buildHeader = function () {
        var icon = this.options.headerIcon;
        if (this.options.headerIcon == this.options.field) {
            icon = undefined;
        }
        this.facetHeader = new FacetHeader_1.FacetHeader({
            facetElement: this.element,
            title: this.options.title,
            icon: icon,
            field: this.options.field,
            enableClearElement: true,
            enableCollapseElement: this.options.enableCollapse,
            facet: this,
            settingsKlass: this.options.enableSettings ? FacetSettings_1.FacetSettings : undefined,
            sortKlass: FacetSort_1.FacetSort,
            availableSorts: this.options.availableSorts
        });
        var built = this.facetHeader.build();
        this.facetSettings = this.facetHeader.settings;
        this.facetSort = this.facetHeader.sort;
        return built;
    };
    Facet.prototype.unpinFacetPosition = function () {
        if (this.shouldFacetUnpin() && this.options.preservePosition) {
            Dom_1.$$(this.pinnedTopSpace).addClass('coveo-with-animation');
            Dom_1.$$(this.pinnedBottomSpace).addClass('coveo-with-animation');
            this.pinnedTopSpace.style.height = '0px';
            this.pinnedBottomSpace.style.height = '0px';
        }
        this.unpinnedViewportPosition = undefined;
        this.pinnedViewportPosition = undefined;
    };
    Facet.prototype.isFacetPinned = function () {
        return Utils_1.Utils.exists(this.pinnedViewportPosition);
    };
    Facet.prototype.shouldFacetUnpin = function () {
        return Utils_1.Utils.exists(this.unpinnedViewportPosition);
    };
    Facet.prototype.ensurePinnedFacetHasntMoved = function () {
        if (this.isFacetPinned()) {
            Assert_1.Assert.exists(this.pinnedViewportPosition);
            Dom_1.$$(this.pinnedTopSpace).removeClass('coveo-with-animation');
            Dom_1.$$(this.pinnedBottomSpace).removeClass('coveo-with-animation');
            this.pinnedTopSpace.style.height = '0px';
            this.pinnedBottomSpace.style.height = '0px';
            // Under firefox scrolling the body doesn't work, but window does
            // on all browser, so we substitute those here when needed.
            var elementToScroll_1 = this.options.scrollContainer == document.body ? window : this.options.scrollContainer;
            var currentViewportPosition = this.element.getBoundingClientRect().top;
            var offset_1 = currentViewportPosition - this.pinnedViewportPosition;
            var scrollToOffset = function () {
                if (elementToScroll_1 instanceof Window) {
                    window.scrollTo(0, new Dom_1.Win(elementToScroll_1).scrollY() + offset_1);
                }
                else {
                    elementToScroll_1.scrollTop = elementToScroll_1.scrollTop + offset_1;
                }
            };
            // First try to adjust position by scrolling the page
            scrollToOffset();
            currentViewportPosition = this.element.getBoundingClientRect().top;
            offset_1 = currentViewportPosition - this.pinnedViewportPosition;
            // If scrolling has worked (offset == 0), we're good to go, nothing to do anymore.
            if (offset_1 < 0) {
                // This means the facet element is scrolled up in the viewport,
                // scroll it down by adding space in the top container
                this.pinnedTopSpace.style.height = offset_1 * -1 + 'px';
            }
            this.unpinnedViewportPosition = this.pinnedViewportPosition;
            this.pinnedViewportPosition = null;
        }
    };
    Facet.prototype.buildFooter = function () {
        return Dom_1.$$('div', { className: 'coveo-facet-footer' }).el;
    };
    Facet.prototype.buildMore = function () {
        var _this = this;
        var svgContainer = Dom_1.$$('span', { className: 'coveo-facet-more-icon' }, SVGIcons_1.SVGIcons.icons.arrowDown).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-more-icon-svg');
        var more = Dom_1.$$('div', { className: 'coveo-facet-more', tabindex: 0 }, svgContainer).el;
        new AccessibleButton_1.AccessibleButton()
            .withElement(more)
            .withLabel(Strings_1.l('ShowMoreFacetResults', this.options.title))
            .withSelectAction(function () { return _this.handleClickMore(); })
            .build();
        return more;
    };
    Facet.prototype.buildLess = function () {
        var _this = this;
        var svgContainer = Dom_1.$$('span', { className: 'coveo-facet-less-icon' }, SVGIcons_1.SVGIcons.icons.arrowUp).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-less-icon-svg');
        var less = Dom_1.$$('div', { className: 'coveo-facet-less', tabindex: 0 }, svgContainer).el;
        new AccessibleButton_1.AccessibleButton()
            .withElement(less)
            .withLabel(Strings_1.l('ShowLessFacetResults', this.options.title))
            .withSelectAction(function () { return _this.handleClickLess(); })
            .build();
        return less;
    };
    Facet.prototype.triggerMoreQuery = function () {
        var _this = this;
        this.logger.info('Triggering new facet more query');
        this.showWaitingAnimation();
        // fetch 1 more value than we need, so we can see if there is more value to fetch still or if we have reached
        // the end of the availables values
        this.facetQueryController
            .fetchMore(this.numberOfValues + 1)
            .then(function (queryResults) {
            _this.logAnalyticsFacetShowMoreLess(AnalyticsActionListMeta_1.analyticsActionCauseList.facetShowMore);
            var facetValues = new FacetValues_1.FacetValues(queryResults.groupByResults[0]);
            _this.values = _this.consolidateAndSortNewFacetValues(facetValues);
            _this.nbAvailableValues = _this.values.size();
            _this.updateNumberOfValues();
            _this.canFetchMore = _this.numberOfValues < _this.nbAvailableValues;
            if (_this.values.hasSelectedOrExcludedValues() && !_this.options.useAnd && _this.options.isMultiValueField) {
                _this.triggerUpdateDeltaQuery(_.filter(_this.values.getAll(), function (facetValue) { return !facetValue.selected && !facetValue.excluded; }));
            }
            else if (_this.values.hasSelectedOrExcludedValues() && !_this.options.useAnd) {
                _this.values.updateDeltaWithFilteredFacetValues(new FacetValues_1.FacetValues(), _this.options.isMultiValueField);
                _this.hideWaitingAnimation();
            }
            else {
                _this.hideWaitingAnimation();
            }
            _this.rebuildValueElements();
        })
            .catch(function () { return _this.hideWaitingAnimation(); });
    };
    Facet.prototype.triggerUpdateDeltaQuery = function (facetValues) {
        var _this = this;
        this.showWaitingAnimation();
        this.facetQueryController.searchInFacetToUpdateDelta(facetValues).then(function (queryResults) {
            var values = new FacetValues_1.FacetValues();
            _.each(queryResults.groupByResults, function (groupByResult) {
                _.each(groupByResult.values, function (groupByValue) {
                    if (!values.contains(groupByValue.value)) {
                        values.add(FacetValue_1.FacetValue.createFromGroupByValue(groupByValue));
                    }
                });
            });
            _this.values.updateDeltaWithFilteredFacetValues(values, _this.options.isMultiValueField);
            _this.cleanupDeltaValuesForMultiValueField();
            _this.rebuildValueElements();
            _this.hideWaitingAnimation();
        });
    };
    Facet.prototype.updateNumberOfValues = function () {
        if (this.keepDisplayedValuesNextTime) {
            return;
        }
        if (this.currentPage <= 0) {
            // We're on the first page, let's reset the number of values to a minimum.
            this.currentPage = 0;
            this.numberOfValues = 0;
        }
        else {
            // Calculate the number of value with the current page.
            this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
        }
        // Make sure we have at least the absolute minimum of value to display.
        this.numberOfValues = Math.max(this.numberOfValues, this.getMinimumNumberOfValuesToDisplay());
    };
    Facet.prototype.getMinimumNumberOfValuesToDisplay = function () {
        // The min value is the number of used values.
        var minValue = this.values.getExcluded().length + this.values.getSelected().length;
        // When using a custom sort, we have to show all values between the selected ones.
        // Thus, we must find the last selected value after a reorder and use that value as the number of value.
        if (this.options.customSort != null && this.facetSort != null && this.options.customSort.length > 0) {
            var lastSelectedValueIndex_1 = -1;
            new FacetValuesOrder_1.FacetValuesOrder(this, this.facetSort).reorderValues(this.values.getAll()).forEach(function (facetValue, index) {
                if (facetValue.selected) {
                    lastSelectedValueIndex_1 = index;
                }
            });
            minValue = lastSelectedValueIndex_1 + 1;
        }
        return Math.max(minValue, this.options.numberOfValues);
    };
    Facet.prototype.cleanupDeltaValuesForMultiValueField = function () {
        var _this = this;
        // On a multi value field, it's possible to end up in a scenario where many of the current values are empty
        // Crop those out, and adjust the nbAvailable values for the "search" and "show more";
        if (this.options.isMultiValueField) {
            _.each(this.values.getAll(), function (v) {
                if (v.occurrences == 0 && !v.selected && !v.excluded) {
                    _this.values.remove(v.value);
                }
            });
            this.nbAvailableValues = this.values.getAll().length;
        }
    };
    Facet.prototype.shouldRenderFacetSearch = function () {
        return this.options.enableFacetSearch;
    };
    Facet.prototype.shouldRenderMoreLess = function () {
        return this.options.enableMoreLess;
    };
    Facet.prototype.debugInfo = function () {
        var info = {};
        info[this['constructor']['ID']] = {
            component: this,
            groupByRequest: this.facetQueryController.lastGroupByRequest,
            groupByResult: this.facetQueryController.lastGroupByResult
        };
        return info;
    };
    Facet.prototype.logAnalyticsFacetShowMoreLess = function (cause) {
        this.usageAnalytics.logCustomEvent(cause, {
            facetId: this.options.id,
            facetField: this.options.field.toString(),
            facetTitle: this.options.title
        }, this.element);
    };
    Facet.ID = 'Facet';
    Facet.omniboxIndex = 50;
    Facet.doExport = function () {
        GlobalExports_1.exportGlobally({
            Facet: Facet,
            FacetHeader: FacetHeader_1.FacetHeader,
            FacetSearchValuesList: FacetSearchValuesList_1.FacetSearchValuesList,
            FacetSettings: FacetSettings_1.FacetSettings,
            FacetSort: FacetSort_1.FacetSort,
            FacetUtils: FacetUtils_1.FacetUtils,
            FacetValueElement: FacetValueElement_1.FacetValueElement,
            FacetValue: FacetValue_1.FacetValue
        });
    };
    /**
     * The possible options for a facet
     * @componentOptions
     */
    Facet.options = __assign({ 
        /**
         * Specifies the title to display at the top of the facet.
         *
         * Default value is the localized string for `NoTitle`.
         */
        title: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            localizedString: function () { return Strings_1.l('NoTitle'); },
            section: 'CommonOptions',
            priority: 10
        }), 
        /**
         * Specifies the index field whose values the facet should use.
         *
         * This requires the given field to be configured correctly in the index as a *Facet field* (see
         * [Add or Edit Fields](https://docs.coveo.com/en/1982/)).
         *
         * Specifying a value for this option is required for the `Facet` component to work.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true, groupByField: true, section: 'CommonOptions' }), headerIcon: ComponentOptions_1.ComponentOptions.buildStringOption({
            deprecated: 'This option is exposed for legacy reasons, and the recommendation is to not use this option.'
        }), 
        /**
         * Specifies a unique identifier for the facet. Among other things, this identifier serves the purpose of saving
         * the facet state in the URL hash.
         *
         * If you have two facets with the same field on the same page, you should specify an `id` value for at least one of
         * those two facets. This `id` must be unique among the facets.
         *
         * Non-word characters except - @ $ _ . + ! * ' ( ) , , ( `^a-zA-Z0-9-@$_.+!*'(),,]+` ) are automatically removed from the `id` value.
         *
         * Default value is the [`field`]{@link Facet.options.field} option value.
         */
        id: ComponentOptions_1.ComponentOptions.buildStringOption({
            postProcessing: function (value, options) {
                if (value) {
                    // All non-word characters, except @ (the default character that specifies a field in the index)
                    // and characters that do no need to be encoded in the URL : - @ $ _ . + ! * ' ( ) , ,
                    var modified = value.replace(/[^a-zA-Z0-9-@$_.+!*'(),,]+/g, '');
                    if (Utils_1.Utils.isNullOrEmptyString(modified)) {
                        return options.field;
                    }
                    return modified;
                }
                return options.field;
            }
        }), 
        /**
         * Specifies whether the facet [`field`]{@link Facet.options.field} is configured in the index as a multi-value
         * field (semicolon separated values such as `abc;def;ghi`).
         *
         * Default value is `false`.
         */
        isMultiValueField: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'CommonOptions' }), 
        /**
         * Specifies the field whose values the Facet should display.
         *
         * @deprecated This option is exposed for legacy reasons. It is not recommended to use this option.
         */
        lookupField: ComponentOptions_1.ComponentOptions.buildFieldOption({
            deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
        }), 
        /**
         * Specifies whether to display the facet **Settings** menu.
         *
         * See also the [`enableSettingsFacetState`]{@link Facet.options.enableSettingsFacetState},
         * [`availableSorts`]{@link Facet.options.availableSorts}, and
         * [`enableCollapse`]{@link Facet.options.enableCollapse} options.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `true`.
         */
        enableSettings: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'Sorting', priority: 9 }), 
        /**
         * If the [`enableSettings`]{@link Facet.options.enableSettings} option is `true`, specifies whether the
         * **Save state** menu option is available in the facet **Settings** menu.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `false`.
         */
        enableSettingsFacetState: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableSettings' }), 
        /**
         * If the [`enableSettings`]{@link Facet.options.enableSettings} option is `true`, specifies the sort criteria
         * options to display in the facet **Settings** menu.
         *
         * Possible values are:
         * - `"occurrences"`
         * - `"score"`
         * - `"alphaascending"`
         * - `"alphadescending"`
         * - `"computedfieldascending"`
         * - `"computedfielddescending"`
         * - `"custom"`
         *
         * See {@link IGroupByRequest.sortCriteria} for a description of each possible value.
         *
         * **Notes:**
         * > * The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * > * Using value captions will disable alphabetical sorts (see the [valueCaption]{@link Facet.options.valueCaption} option).
         *
         * Default value is `occurrences,score,alphaascending,alphadescending`.
         */
        availableSorts: ComponentOptions_1.ComponentOptions.buildListOption({
            defaultValue: ['occurrences', 'score', 'alphaascending', 'alphadescending'],
            section: 'Sorting',
            depend: 'enableSettings',
            values: [
                'occurrences',
                'score',
                'alphaascending',
                'alphadescending',
                'computedfieldascending',
                'computedfielddescending',
                'chisquare',
                'nosort'
            ]
        }), 
        /**
         * Specifies the criteria to use to sort the facet values.
         *
         * See {@link IGroupByRequest.sortCriteria} for the list and description of possible values.
         *
         * Default value is the first sort criteria specified in the [`availableSorts`]{@link Facet.options.availableSorts}
         * option, or `occurrences` if no sort criteria is specified.
         */
        sortCriteria: ComponentOptions_1.ComponentOptions.buildStringOption({
            postProcessing: function (value, options) {
                return value || (options.availableSorts.length > 0 ? options.availableSorts[0] : 'occurrences');
            },
            section: 'Sorting'
        }), 
        /**
         * Specifies a custom order by which to sort the facet values.
         *
         * **Example:**
         *
         * You could use this option to specify a logical order for support tickets, such as:
         * ```html
         * <div class="CoveoFacet" data-field="@ticketstatus" data-title="Ticket Status" data-tab="All" data-custom-sort="New,Opened,Feedback,Resolved"></div>
         * ```
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         */
        customSort: ComponentOptions_1.ComponentOptions.buildListOption({ section: 'Sorting' }), 
        /**
         * Specifies the maximum number of field values to display by default in the facet before the user
         * clicks the arrow to show more.
         *
         * See also the [`enableMoreLess`]{@link Facet.options.enableMoreLess} option.
         */
        numberOfValues: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0, section: 'CommonOptions' }), 
        /**
         * Specifies the *injection depth* to use for the [`GroupByRequest`]{@link IGroupByRequest} operation.
         *
         * The injection depth determines how many results to scan in the index to ensure that the facet lists all potential
         * facet values. Increasing this value enhances the accuracy of the listed values at the cost of performance.
         *
         * Default value is `1000`. Minimum value is `0`.
         * @notSupportedIn salesforcefree
         */
        injectionDepth: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 1000, min: 0 }), showIcon: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
        }), 
        /**
         * Specifies whether to use the `AND` operator in the resulting filter when multiple values are selected in the
         * facet.
         *
         * Setting this option to `true` means that items must have all of the selected values to match the resulting
         * query.
         *
         * Default value is `false`, which means that the filter uses the `OR` operator. Thus, by default, items must
         * have at least one of the selected values to match the query.
         */
        useAnd: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }), 
        /**
         * Specifies whether to allow the user to toggle between the `OR` and `AND` modes in the facet.
         *
         * Setting this option to `true` displays an icon in the top right corner of the facet. The user can click this icon
         * to toggle between between the two modes.
         *
         * Default value is `false`.
         */
        enableTogglingOperator: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            alias: 'allowTogglingOperator'
        }), 
        /**
         * Specifies whether to display a search box at the bottom of the facet for searching among the available facet
         * [`field`]{@link Facet.options.field} values.
         *
         * See also the [`facetSearchDelay`]{@link Facet.options.facetSearchDelay},
         * [`facetSearchIgnoreAccents`]{@link Facet.options.facetSearchIgnoreAccents}, and
         * [`numberOfValuesInFacetSearch`]{@link Facet.options.numberOfValuesInFacetSearch} options.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `true`.
         */
        enableFacetSearch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'FacetSearch', priority: 8 }), 
        /**
         * If the [`enableFacetSearch`]{@link Facet.options.enableFacetSearch} option is `true`, specifies the delay (in
         * milliseconds) before sending a search request to the server when the user starts typing in the facet search box.
         *
         * Specifying a smaller value makes results appear faster. However, chances of having to cancel many requests
         * sent to the server increase as the user keeps on typing new characters.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `100`. Minimum value is `0`.
         */
        facetSearchDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 100, min: 0, depend: 'enableFacetSearch' }), 
        /**
         * If the [`enableFacetSearch`]{@link Facet.options.enableFacetSearch} option is `true`, specifies whether to ignore
         * accents in the facet search box.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `false`.
         */
        facetSearchIgnoreAccents: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableFacetSearch' }), 
        /**
         * If the [`enableFacetSearch`]{@link Facet.options.enableFacetSearch} option is `true`, specifies the number of v
         * alues to display in the facet search results popup.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `15`. Minimum value is `1`.
         */
        numberOfValuesInFacetSearch: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 15, min: 1, section: 'FacetSearch' }), 
        /**
         * Specifies whether [wildcards]{@link AllowedValuesPatternType.wildcards} are used as the [allowedValuesPatternType]{@link IGroupByRequest.allowedValuesPatternType}
         * in the [groupBy]{@link IGroupByRequest} for the facet search.
         *
         * Enabling this option returns results that end with the entered value. For example, searching for `veo` would match with `Coveo`.
         *
         * **Note:**
         * > If you are experiencing slow facet search and/or timeouts when this option is set to `true`, consider enabling the **Use cache for nested queries**
         * > option on your facet [field]{@link Facet.options.field} in the Coveo Cloud Admninistration Console (see [Add or Edit Fields]{@link https://docs.coveo.com/en/1982/}).
         */
        useWildcardsInFacetSearch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'FacetSearch' }), 
        /**
         * Specifies whether the facet should push data to the [`Breadcrumb`]{@link Breadcrumb} component.
         *
         * See also the [`numberOfValuesInBreadcrumb`]{@link Facet.options.numberOfValuesInBreadcrumb} option.
         *
         * Default value is `true`.
         */
        includeInBreadcrumb: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }), 
        /**
         * If the [`includeInBreadcrumb`]{@link Facet.options.includeInBreadcrumb} option is `true`, specifies the maximum
         * number of values that the facet should display in the [`Breadcrumb`]{@link Breadcrumb} before outputting a
         * **more...** button.
         *
         * Default value is `5` on a desktop computer and `3` on a mobile device. Minimum value is `0`.
         */
        numberOfValuesInBreadcrumb: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultFunction: function () { return (DeviceUtils_1.DeviceUtils.isMobileDevice() ? 3 : 5); },
            min: 0,
            depend: 'includeInBreadcrumb'
        }), 
        /**
         * Specifies whether the Facet should push data to the {@link Omnibox} component.
         *
         * See also {@link Facet.options.numberOfValuesInOmnibox}.
         *
         * Default value is `false`.
         *
         * @deprecated This option is exposed for legacy reasons. It is not recommended to use this option.
         */
        includeInOmnibox: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
        }), 
        /**
         * When {@link Facet.options.includeInOmnibox} is `true`, specifies the number of values to populate the
         * {@link Breadcrumb} with.
         *
         * Default value is `5` on desktop computer and `3` on a mobile device. Minimum value is `0`.
         *
         * @deprecated This option is exposed for legacy reasons. It is not recommended to use this option.
         */
        numberOfValuesInOmnibox: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultFunction: function () { return (DeviceUtils_1.DeviceUtils.isMobileDevice() ? 3 : 5); },
            min: 0,
            depend: 'includeInOmnibox',
            deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
        }), 
        /**
         * Specifies the name of a field on which to execute an aggregate operation for all distinct values of the facet
         * [`field`]{@link Facet.options.field}.
         *
         * The facet displays the result of the operation along with the number of occurrences for each value.
         *
         * You can use this option to compute the sum of a field (like a money amount) for each listed facet value.
         *
         * Works in conjunction with the [`computedFieldOperation`]{@link Facet.options.computedFieldOperation},
         * [`computedFieldFormat`]{@link Facet.options.computedFieldFormat}, and
         * [`computedFieldCaption`]{@link Facet.options.computedFieldCaption} options.
         * @notSupportedIn salesforcefree
         */
        computedField: ComponentOptions_1.ComponentOptions.buildFieldOption({ priority: 7 }), 
        /**
         * Specifies the type of aggregate operation to perform on the [`computedField`]{@link Facet.options.computedField}.
         *
         * The possible values are:
         * - `sum` - Computes the sum of the computed field values.
         * - `average` - Computes the average of the computed field values.
         * - `minimum` - Finds the minimum value of the computed field values.
         * - `maximum` - Finds the maximum value of the computed field values.
         *
         * Default value is `sum`.
         * @notSupportedIn salesforcefree
         */
        computedFieldOperation: ComponentOptions_1.ComponentOptions.buildStringOption({
            defaultValue: 'sum',
            section: 'ComputedField'
        }), 
        /**
         * Specifies how to format the values resulting from a
         * [`computedFieldOperation`]{@link Facet.options.computedFieldOperation}.
         *
         * The Globalize library defines all available formats (see
         * [Globalize](https://github.com/klaaspieter/jquery-global#globalizeformat-value-format-culture-)).
         *
         * The most commonly used formats are:
         * - `c0` - Formats the value as a currency.
         * - `n0` - Formats the value as an integer.
         * - `n2` - Formats the value as a floating point with 2 decimal digits.
         *
         * Default value is `"c0"`.
         * @notSupportedIn salesforcefree
         */
        computedFieldFormat: ComponentOptions_1.ComponentOptions.buildStringOption({
            defaultValue: 'c0',
            section: 'ComputedField'
        }), 
        /**
         * Specifies what the caption of the [`computedField`]{@link Facet.options.computedField} should be in the facet
         * **Settings** menu for sorting.
         *
         * For example, setting this option to `"Money"` will display `"Money Ascending"` for computed field ascending.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is the localized string for `ComputedField`.
         * @notSupportedIn salesforcefree
         */
        computedFieldCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            localizedString: function () { return Strings_1.l('ComputedField'); },
            section: 'ComputedField'
        }), 
        /**
         * Specifies whether the facet should remain stable in its current position in the viewport while the mouse cursor
         * is over it.
         *
         * Whenever the value selection changes in a facet, the search interface automatically performs a query. This new
         * query might cause other elements in the page to resize themselves (typically, other facets above or below the
         * one the user is interacting with).
         *
         * This option is responsible for adding the `<div class='coveo-topSpace'>` and
         * `<div class='coveo-bottomSpace'>` around the Facet container. The Facet adjusts the scroll amount of the page to
         * ensure that it does not move relatively to the mouse when the results are updated.
         *
         * In some cases, the facet also adds margins to the `scrollContainer`, if scrolling alone is not enough to
         * preserve position.
         *
         * See also the [`paddingContainer`]{@link Facet.options.paddingContainer}, and
         * [`scrollContainer`]{@link Facet.options.scrollContainer} options.
         *
         * Default value is `true`.
         */
        preservePosition: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }), 
        /**
         * Specifies the parent container of the facets.
         *
         * Used by the [`preservePosition`]{@link Facet.options.preservePosition} option.
         *
         * Default value is `element.parentElement`.
         */
        paddingContainer: ComponentOptions_1.ComponentOptions.buildSelectorOption({
            defaultFunction: function (element) {
                var standardColumn = Dom_1.$$(element).parent('coveo-facet-column');
                if (standardColumn != null) {
                    return standardColumn;
                }
                return element.parentElement;
            }
        }), 
        /**
         * Specifies the HTML element (through a CSS selector) whose scroll amount the facet should adjust to preserve its
         * position when results are updated.
         *
         * Used by the [`preservePosition`]{@link Facet.options.preservePosition} option.
         *
         * Default value is `document.body`.
         */
        scrollContainer: ComponentOptions_1.ComponentOptions.buildSelectorOption({ defaultFunction: function (element) { return document.body; } }), 
        /**
         * Specifies whether to enable the **More** and **Less** buttons in the Facet.
         *
         * See also the [`pageSize`]{@link Facet.options.pageSize} option.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `true`.
         */
        enableMoreLess: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }), 
        /**
         * If the [`enableMoreLess`]{@link Facet.options.enableMoreLess} option is `true`, specifies the number of
         * additional results to fetch when clicking the **More** button.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `10`. Minimum value is `1`.
         */
        pageSize: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableMoreLess' }), 
        /**
         * If the [`enableSettings`]{@link Facet.options.enableSettings} option is `true`, specifies whether the
         * **Collapse \ Expand** menu option is available in the facet **Settings** menu.
         *
         * **Note:**
         * > The [`FacetRange`]{@link FacetRange} component does not support this option.
         *
         * Default value is `true`.
         */
        enableCollapse: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, depend: 'enableSettings' }), 
        /**
         * Specifies an explicit list of [`allowedValues`]{@link IGroupByRequest.allowedValues} in the
         * [`GroupByRequest`]{@link IGroupByRequest}.
         *
         * If you specify a list of values for this option, the facet uses only these values (if they are available in
         * the current result set).
         *
         * **Example:**
         *
         * The following facet only uses the `Contact`, `Account`, and `File` values of the `@objecttype` field. Even if the
         * current result set contains other `@objecttype` values, such as `Message`, or `Product`, the facet does not use
         * those other values.
         *
         * ```html
         *
         * <div class="CoveoFacet" data-field="@objecttype" data-title="Object Type" data-tab="All" data-allowed-values="Contact,Account,File"></div>
         * ```
         *
         * Default value is `undefined`, and the facet uses all available values for its
         * [`field`]{@link Facet.options.field} in the current result set.
         */
        allowedValues: ComponentOptions_1.ComponentOptions.buildListOption(), 
        /**
         * Specifies an additional query expression (query override) to add to each
         * [`GroupByRequest`]{@link IGroupByRequest} that this facet performs.
         *
         * Example: `@date>=2014/01/01`
         * @notSupportedIn salesforcefree
         */
        additionalFilter: ComponentOptions_1.ComponentOptions.buildQueryExpressionOption(), 
        /**
         * Specifies whether this facet only appears when a value is selected in its "parent" facet.
         *
         * To specify the parent facet, use its [`id`]{@link Facet.options.id}.
         *
         * Remember that by default, a facet `id` value is the same as its [`field`]{@link Facet.options.field} option
         * value.
         *
         * **Examples:**
         *
         * First case: the "parent" facet has no custom `id`:
         * ```html
         * <!-- "Parent" Facet: -->
         * <div class='CoveoFacet' data-field='@myfield' data-title='My Parent Facet'></div>
         *
         * <!-- The "dependent" Facet must refer to the default `id` of its "parent" Facet, which is the name of its field. -->
         * <div class='CoveoFacet' data-field='@myotherfield' data-title='My Dependent Facet' data-depends-on='@myfield'></div>
         * ```
         *
         * Second case: the "parent" facet has a custom `id`:
         * ```html
         * <!-- "Parent" Facet: -->
         * <div class='CoveoFacet' data-field='@myfield' data-title='My Parent Facet' data-id='myParentCustomId'></div>
         *
         * <!-- The "dependent" Facet must refer to the custom `id` of its "parent" Facet, which is 'myParentCustomId'. -->
         * <div class='CoveoFacet' data-field='@myotherfield' data-title='My Dependent Facet' data-depends-on='myParentCustomId'></div>
         * ```
         *
         * Default value is `undefined`
         */
        dependsOn: ComponentOptions_1.ComponentOptions.buildStringOption(), 
        /**
         * A function that verifies whether the current state of the `dependsOn` facet allows the dependent facet to be displayed.
         *
         * If specified, the function receives a reference to the resolved `dependsOn` facet component instance as an argument, and must return a boolean.
         * The function's argument should typically be treated as read-only.
         *
         * By default, the dependent facet is displayed whenever one or more values are selected in its `dependsOn` facet.
         *
         * @externaldocs [Defining Dependent Facets](https://docs.coveo.com/3210/)
         */
        dependsOnCondition: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        }, { depend: 'dependsOn', section: 'CommonOptions' }), 
        /**
         * Specifies a JSON object describing a mapping of facet values to their desired captions. See
         * [Normalizing Facet Value Captions](https://docs.coveo.com/en/368/).
         *
         * **Examples:**
         *
         * You can set the option in the ['init']{@link init} call:
         * ```javascript
         * var myValueCaptions = {
         *   "txt" : "Text files",
         *   "html" : "Web page",
         *   [ ... ]
         * };
         *
         * Coveo.init(document.querySelector("#search"), {
         *   Facet : {
         *     valueCaption : myValueCaptions
         *   }
         * });
         * ```
         *
         * Or before the `init` call, using the ['options']{@link options} top-level function:
         * ```javascript
         * Coveo.options(document.querySelector("#search"), {
         *   Facet : {
         *     valueCaption : myValueCaptions
         *   }
         * });
         * ```
         *
         * Or directly in the markup:
         * ```html
         * <!-- Ensure that the double quotes are properly handled in data-value-caption. -->
         * <div class='CoveoFacet' data-field='@myotherfield' data-value-caption='{"txt":"Text files","html":"Web page"}'></div>
         * ```
         *
         * **Note:**
         * > Using value captions will disable alphabetical sorts (see the [availableSorts]{@link Facet.options.availableSorts} option).
         */
        valueCaption: ComponentOptions_1.ComponentOptions.buildJsonOption() }, ResponsiveFacetOptions_1.ResponsiveFacetOptions);
    return Facet;
}(Component_1.Component));
exports.Facet = Facet;
Initialization_1.Initialization.registerAutoCreateComponent(Facet);
Facet.doExport();


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


/***/ }),

/***/ 89:
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
var Component_1 = __webpack_require__(7);
var Strings_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(1);
var Initialization_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(3);
var CategoryFacetTemplates_1 = __webpack_require__(542);
var CategoryValueRoot_1 = __webpack_require__(543);
var CategoryFacetQueryController_1 = __webpack_require__(545);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var QueryStateModel_1 = __webpack_require__(13);
__webpack_require__(546);
var Model_1 = __webpack_require__(18);
var Utils_1 = __webpack_require__(4);
var underscore_1 = __webpack_require__(0);
var Assert_1 = __webpack_require__(5);
var QueryEvents_1 = __webpack_require__(11);
var CategoryFacetSearch_1 = __webpack_require__(547);
var BreadcrumbEvents_1 = __webpack_require__(34);
var CategoryFacetBreadcrumb_1 = __webpack_require__(549);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var CategoryFacetDebug_1 = __webpack_require__(550);
var QueryBuilder_1 = __webpack_require__(46);
var ResponsiveFacets_1 = __webpack_require__(174);
var ResponsiveFacetOptions_1 = __webpack_require__(82);
var CategoryFacetHeader_1 = __webpack_require__(551);
var AccessibleButton_1 = __webpack_require__(15);
var DependsOnManager_1 = __webpack_require__(173);
var ResultListUtils_1 = __webpack_require__(111);
var CategoryFacetValuesTree_1 = __webpack_require__(552);
/**
 * The `CategoryFacet` component is a facet that renders values in a hierarchical fashion. It determines the filter to apply depending on the
 * current selected path of values.
 *
 * The path is a sequence of values that leads to a specific value in the hierarchy.
 * It is an array listing all the parents of a file (e.g., `['c', 'folder1']` for the `c:\folder1\text1.txt` file).
 *
 * This facet requires a [`field`]{@link CategoryFacet.options.field} with a special format to work correctly (see [Using the Category Facet Component](https://docs.coveo.com/en/2667)).
 *
 * @notSupportedIn salesforcefree
 * @availablesince [January 2019 Release (v2.5395.12)]({{ site.baseurl }}/2938/)
 */
var CategoryFacet = /** @class */ (function (_super) {
    __extends(CategoryFacet, _super);
    function CategoryFacet(element, options, bindings) {
        var _this = _super.call(this, element, 'CategoryFacet', bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.listenToQueryStateChange = true;
        _this.moreValuesToFetch = true;
        _this.showingWaitAnimation = false;
        _this.numberOfChildValuesCurrentlyDisplayed = 0;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, CategoryFacet, options);
        _this.categoryFacetQueryController = new CategoryFacetQueryController_1.CategoryFacetQueryController(_this);
        _this.categoryFacetTemplates = new CategoryFacetTemplates_1.CategoryFacetTemplates();
        _this.categoryValueRoot = new CategoryValueRoot_1.CategoryValueRoot(Dom_1.$$(_this.element), _this.categoryFacetTemplates, _this);
        _this.categoryValueRoot.path = _this.activePath;
        _this.currentPage = 0;
        _this.numberOfValues = _this.options.numberOfValues;
        _this.categoryFacetValuesTree = new CategoryFacetValuesTree_1.CategoryFacetValuesTree();
        _this.tryToInitFacetSearch();
        if (_this.options.debug) {
            new CategoryFacetDebug_1.CategoryFacetDebug(_this);
        }
        ResponsiveFacets_1.ResponsiveFacets.init(_this.root, _this, _this.options);
        _this.initDependsOnManager();
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function () { return _this.addFading(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function () { return _this.handleDeferredQuerySuccess(); });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) { return _this.handlePopulateBreadCrumb(args); });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function () { return _this.handleClearBreadcrumb(); });
        _this.buildFacetHeader();
        _this.initQueryStateEvents();
        return _this;
    }
    CategoryFacet.prototype.isCurrentlyDisplayed = function () {
        return Dom_1.$$(this.element).isVisible();
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
    CategoryFacet.prototype.scrollToTop = function () {
        ResultListUtils_1.ResultListUtils.scrollToTop(this.root);
    };
    CategoryFacet.prototype.tryToInitFacetSearch = function () {
        if (!this.isFacetSearchAvailable) {
            return this.logDisabledFacetSearchWarning();
        }
        this.categoryFacetSearch = new CategoryFacetSearch_1.CategoryFacetSearch(this, this.options.displaySearchButton);
    };
    CategoryFacet.prototype.logDisabledFacetSearchWarning = function () {
        if (this.isEnableFacetSearchFalsy) {
            return;
        }
        var valueCaptionAttributeName = this.getOptionAttributeName('valueCaption');
        var enableFacetSearchAttributeName = this.getOptionAttributeName('enableFacetSearch');
        var field = this.options.field;
        this.logger.warn("The search box is disabled on the " + field + " CategoryFacet. To hide this warning,\n    either remove the " + valueCaptionAttributeName + " option or set the " + enableFacetSearchAttributeName + " option to \"false\".");
    };
    CategoryFacet.prototype.getOptionAttributeName = function (optionName) {
        return ComponentOptions_1.ComponentOptions.attrNameFromName(optionName);
    };
    Object.defineProperty(CategoryFacet.prototype, "isFacetSearchAvailable", {
        get: function () {
            if (this.areValueCaptionsSpecified) {
                return false;
            }
            if (this.isEnableFacetSearchFalsy) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryFacet.prototype, "areValueCaptionsSpecified", {
        get: function () {
            var valueCaptions = this.options.valueCaption;
            return underscore_1.keys(valueCaptions).length !== 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryFacet.prototype, "isEnableFacetSearchFalsy", {
        get: function () {
            return !this.options.enableFacetSearch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryFacet.prototype, "isCategoryEmpty", {
        get: function () {
            return !this.categoryValueRoot.children.length;
        },
        enumerable: true,
        configurable: true
    });
    CategoryFacet.prototype.updateAppearance = function () {
        if (this.disabled || this.isCategoryEmpty) {
            return this.hide();
        }
        this.show();
    };
    CategoryFacet.prototype.handleQuerySuccess = function (args) {
        if (Utils_1.Utils.isNullOrUndefined(args.results.categoryFacets)) {
            return this.notImplementedError();
        }
        if (Utils_1.Utils.isNullOrUndefined(args.results.categoryFacets[this.positionInQuery])) {
            return;
        }
        var numberOfRequestedValues = args.query.categoryFacets[this.positionInQuery].maximumNumberOfValues;
        var categoryFacetResult = args.results.categoryFacets[this.positionInQuery];
        this.moreValuesToFetch = numberOfRequestedValues == categoryFacetResult.values.length;
        this.clear();
        if (categoryFacetResult.notImplemented) {
            return this.notImplementedError();
        }
        if (!categoryFacetResult.values.length && !categoryFacetResult.parentValues.length) {
            return;
        }
        this.renderValues(categoryFacetResult, numberOfRequestedValues);
        if (this.isFacetSearchAvailable) {
            var facetSearch = this.categoryFacetSearch.build();
            this.options.displaySearchOnTop
                ? Dom_1.$$(facetSearch).insertBefore(this.categoryValueRoot.listRoot.el)
                : Dom_1.$$(facetSearch).insertAfter(this.categoryValueRoot.listRoot.el);
        }
        this.moreLessContainer = Dom_1.$$('div', { className: 'coveo-category-facet-more-less-container' });
        Dom_1.$$(this.element).append(this.moreLessContainer.el);
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
                        this.hideWaitingAnimation();
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
            this.logAnalyticsFacetShowMoreLess(AnalyticsActionListMeta_1.analyticsActionCauseList.facetShowMore);
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
            this.logAnalyticsFacetShowMoreLess(AnalyticsActionListMeta_1.analyticsActionCauseList.facetShowLess);
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
    CategoryFacet.prototype.resetPath = function () {
        this.changeActivePath(this.options.basePath);
    };
    /**
     * Resets the facet to its initial state.
     */
    CategoryFacet.prototype.reset = function () {
        this.resetPath();
        this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.categoryFacetClear);
        this.executeQuery();
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
    CategoryFacet.prototype.enable = function () {
        _super.prototype.enable.call(this);
        this.updateAppearance();
    };
    CategoryFacet.prototype.disable = function () {
        _super.prototype.disable.call(this);
        this.updateAppearance();
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
    /**
     *
     * @param value The string to find a caption for.
     * Returns the caption for a value or the value itself if no caption is available.
     */
    CategoryFacet.prototype.getCaption = function (value) {
        var valueCaptions = this.options.valueCaption;
        var caption = valueCaptions[value];
        return caption ? caption : value;
    };
    CategoryFacet.prototype.showWaitingAnimation = function () {
        this.ensureDom();
        if (!this.showingWaitAnimation) {
            Dom_1.$$(this.headerElement).find('.coveo-category-facet-header-wait-animation').style.visibility = 'visible';
            this.showingWaitAnimation = true;
        }
    };
    CategoryFacet.prototype.hideWaitingAnimation = function () {
        this.ensureDom();
        if (this.showingWaitAnimation) {
            Dom_1.$$(this.headerElement).find('.coveo-category-facet-header-wait-animation').style.visibility = 'hidden';
            this.showingWaitAnimation = false;
        }
    };
    CategoryFacet.prototype.logAnalyticsEvent = function (eventName, path) {
        if (path === void 0) { path = this.activePath; }
        this.usageAnalytics.logSearchEvent(eventName, {
            categoryFacetId: this.options.id,
            categoryFacetField: this.options.field.toString(),
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
        this.categoryFacetValuesTree.storeNewValues(categoryFacetResult);
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
        new AccessibleButton_1.AccessibleButton()
            .withLabel(Strings_1.l('AllCategories'))
            .withElement(allCategories)
            .withSelectAction(function () {
            _this.reset();
            _this.scrollToTop();
        })
            .build();
        this.categoryValueRoot.listRoot.append(allCategories.el);
    };
    CategoryFacet.prototype.isPristine = function () {
        return Utils_1.Utils.arrayEqual(this.activePath, this.options.basePath);
    };
    CategoryFacet.prototype.buildFacetHeader = function () {
        var facetHeader = new CategoryFacetHeader_1.CategoryFacetHeader({ categoryFacet: this, title: this.options.title });
        this.headerElement = facetHeader.build();
        Dom_1.$$(this.element).prepend(this.headerElement);
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
    CategoryFacet.prototype.initDependsOnManager = function () {
        var _this = this;
        var facetInfo = {
            reset: function () { return _this.dependsOnReset(); },
            ref: this
        };
        this.dependsOnManager = new DependsOnManager_1.DependsOnManager(facetInfo);
    };
    CategoryFacet.prototype.dependsOnReset = function () {
        this.changeActivePath(this.options.basePath);
        this.clear();
    };
    CategoryFacet.prototype.addFading = function () {
        Dom_1.$$(this.element).addClass('coveo-category-facet-values-fade');
    };
    CategoryFacet.prototype.handleDeferredQuerySuccess = function () {
        this.updateAppearance();
        this.removeFading();
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
        if (this.numberOfChildValuesCurrentlyDisplayed > this.options.numberOfValues) {
            this.moreLessContainer.append(this.buildLessButton());
        }
        if (this.moreValuesToFetch) {
            this.moreLessContainer.append(this.buildMoreButton());
        }
    };
    CategoryFacet.prototype.clear = function () {
        this.categoryValueRoot.clear();
        if (this.isFacetSearchAvailable) {
            this.categoryFacetSearch.clear();
        }
        this.moreLessContainer && this.moreLessContainer.detach();
        Dom_1.$$(this.element).removeClass('coveo-category-facet-non-empty-path');
    };
    CategoryFacet.prototype.buildMoreButton = function () {
        var _this = this;
        var svgContainer = Dom_1.$$('span', { className: 'coveo-facet-more-icon' }, SVGIcons_1.SVGIcons.icons.arrowDown).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-more-icon-svg');
        var more = Dom_1.$$('div', { className: 'coveo-category-facet-more' }, svgContainer);
        new AccessibleButton_1.AccessibleButton()
            .withElement(more)
            .withSelectAction(function () { return _this.showMore(); })
            .withLabel(Strings_1.l('ShowMoreFacetResults', this.options.title))
            .build();
        return more.el;
    };
    CategoryFacet.prototype.buildLessButton = function () {
        var _this = this;
        var svgContainer = Dom_1.$$('span', { className: 'coveo-facet-less-icon' }, SVGIcons_1.SVGIcons.icons.arrowUp).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-less-icon-svg');
        var less = Dom_1.$$('div', { className: 'coveo-category-facet-less' }, svgContainer);
        new AccessibleButton_1.AccessibleButton()
            .withElement(less)
            .withSelectAction(function () { return _this.showLess(); })
            .withLabel(Strings_1.l('ShowLessFacetResults', this.options.title))
            .build();
        return less.el;
    };
    CategoryFacet.prototype.handlePopulateBreadCrumb = function (args) {
        var _this = this;
        if (this.isPristine()) {
            return;
        }
        var lastParentValue = this.categoryFacetValuesTree.getValueForLastPartInPath(this.activePath);
        var descriptor = {
            path: this.activePath,
            count: lastParentValue.numberOfResults,
            value: lastParentValue.value
        };
        var resetFacet = function () {
            _this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbFacet);
            _this.reset();
        };
        var categoryFacetBreadcrumbBuilder = new CategoryFacetBreadcrumb_1.CategoryFacetBreadcrumb(this, resetFacet, descriptor);
        args.breadcrumbs.push({ element: categoryFacetBreadcrumbBuilder.build() });
    };
    CategoryFacet.prototype.handleClearBreadcrumb = function () {
        this.changeActivePath(this.options.basePath);
    };
    CategoryFacet.prototype.logAnalyticsFacetShowMoreLess = function (cause) {
        this.usageAnalytics.logCustomEvent(cause, {
            facetId: this.options.id,
            facetField: this.options.field.toString(),
            facetTitle: this.options.title
        }, this.element);
    };
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
    CategoryFacet.options = __assign({ 
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
            localizedString: function () { return Strings_1.l('NoTitle'); }
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
         * This options accepts an array of values. To specify a "deeper" starting path in your tree, you need to use comma-separated values.
         *
         * For example, setting `data-base-path="c,folder1"` on the component markup would display `folder3` in the `CategoryFacet`, but omit `c` and `folder1`.
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
        debug: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }), 
        /**
         * Specifies a JSON object describing a mapping of facet values to their desired captions. See
         * [Normalizing Facet Value Captions](https://developers.coveo.com/x/jBsvAg).
         *
         * **Note:**
         * If this option is specified, the facet search box will be unavailable.
         *
         * **Examples:**
         *
         * You can set the option in the ['init']{@link init} call:
         * ```javascript
         * var myValueCaptions = {
         *   "txt" : "Text files",
         *   "html" : "Web page",
         *   [ ... ]
         * };
         *
         * Coveo.init(document.querySelector("#search"), {
         *   Facet : {
         *     valueCaption : myValueCaptions
         *   }
         * });
         * ```
         *
         * Or before the `init` call, using the ['options']{@link options} top-level function:
         * ```javascript
         * Coveo.options(document.querySelector("#search"), {
         *   Facet : {
         *     valueCaption : myValueCaptions
         *   }
         * });
         * ```
         *
         * Or directly in the markup:
         * ```html
         * <!-- Ensure that the double quotes are properly handled in data-value-caption. -->
         * <div class='CoveoCategoryFacet' data-field='@myotherfield' data-value-caption='{"txt":"Text files","html":"Web page"}'></div>
         * ```
         */
        valueCaption: ComponentOptions_1.ComponentOptions.buildJsonOption({ defaultValue: {} }), 
        /**
         * The [id](@link Facet.options.id) of another facet in which at least one value must be selected in order
         * for the dependent category facet to be visible.
         *
         * **Default:** `undefined` and the category facet does not depend on any other facet to be displayed.
         *
         * @availablesince [September 2019 Release (v2.7023)](https://docs.coveo.com/en/2990/)
         */
        dependsOn: ComponentOptions_1.ComponentOptions.buildStringOption(), 
        /**
         * A function that verifies whether the current state of the `dependsOn` facet allows the dependent facet to be displayed.
         *
         * If specified, the function receives a reference to the resolved `dependsOn` facet component instance as an argument, and must return a boolean.
         * The function's argument should typically be treated as read-only.
         *
         * By default, the dependent facet is displayed whenever one or more values are selected in its `dependsOn` facet.
         *
         * @externaldocs [Defining Dependent Facets](https://docs.coveo.com/3210/)
         */
        dependsOnCondition: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        }, { depend: 'dependsOn', section: 'CommonOptions' }), 
        /**
         * Whether to display the facet search widget above the facet values instead of below them.
         *
         * @availablesince [July 2020 Release (v2.9373)](https://docs.coveo.com/3293/)
         */
        displaySearchOnTop: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }), 
        /**
         * Whether to display the facet search widget as a button instead of a search bar.
         *
         * @availablesince [July 2020 Release (v2.9373)](https://docs.coveo.com/3293/)
         */
        displaySearchButton: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }) }, ResponsiveFacetOptions_1.ResponsiveFacetOptions);
    CategoryFacet.MAXIMUM_NUMBER_OF_VALUES_BEFORE_TRUNCATING = 15;
    CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING = 10;
    CategoryFacet.WAIT_ELEMENT_CLASS = 'coveo-category-facet-header-wait-animation';
    return CategoryFacet;
}(Component_1.Component));
exports.CategoryFacet = CategoryFacet;
Initialization_1.Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();


/***/ })

});
//# sourceMappingURL=TimespanFacet__36d30dcb7330ecf06f4d.js.map