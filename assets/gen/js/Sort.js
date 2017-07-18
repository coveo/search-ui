webpackJsonpCoveo__temporary([17],{

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SVGDom = (function () {
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
    SVGDom.getClass = function (svgElement) {
        var className = svgElement.getAttribute('class');
        return className ? className + ' ' : '';
    };
    return SVGDom;
}());
exports.SVGDom = SVGDom;


/***/ }),

/***/ 327:
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
var SortCriteria_1 = __webpack_require__(440);
var ComponentOptions_1 = __webpack_require__(9);
var Assert_1 = __webpack_require__(7);
var Utils_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(3);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var QueryEvents_1 = __webpack_require__(11);
var Initialization_1 = __webpack_require__(2);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var KeyboardUtils_1 = __webpack_require__(23);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(616);
var SVGIcons_1 = __webpack_require__(15);
var SVGDom_1 = __webpack_require__(16);
/**
 * The Sort component renders a widget that the end user can interact with to sort query results according to a single
 * criterion or list of criteria.
 */
var Sort = (function (_super) {
    __extends(Sort, _super);
    /**
     * Creates a new Sort component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Sort component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Sort(element, options, bindings) {
        var _this = _super.call(this, element, Sort.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Sort, options);
        Assert_1.Assert.isLargerOrEqualsThan(1, _this.options.sortCriteria.length);
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.SORT, function (args) { return _this.handleQueryStateChanged(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function (args) { return _this.handleQueryError(args); });
        var clickAction = function () { return _this.handleClick(); };
        _this.bind.on(_this.element, 'click', clickAction);
        _this.bind.on(_this.element, 'keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, clickAction));
        _this.element.setAttribute('tabindex', '0');
        if (Utils_1.Utils.isNonEmptyString(_this.options.caption)) {
            Dom_1.$$(_this.element).text(_this.options.caption);
        }
        if (_this.isToggle()) {
            _this.icon = Dom_1.$$('span', { className: 'coveo-icon' }).el;
            var iconAscending = Dom_1.$$('span', { className: 'coveo-sort-icon-ascending' }, SVGIcons_1.SVGIcons.icons.arrowUp);
            SVGDom_1.SVGDom.addClassToSVGInContainer(iconAscending.el, 'coveo-sort-icon-ascending-svg');
            var iconDescending = Dom_1.$$('span', { className: 'coveo-sort-icon-descending' }, SVGIcons_1.SVGIcons.icons.arrowDown);
            SVGDom_1.SVGDom.addClassToSVGInContainer(iconDescending.el, 'coveo-sort-icon-descending-svg');
            _this.icon.appendChild(iconAscending.el);
            _this.icon.appendChild(iconDescending.el);
            _this.element.appendChild(_this.icon);
        }
        _this.update();
        _this.updateAppearance();
        return _this;
    }
    /**
     * Selects the Sort component. Triggers a new query if selecting the component changes the current
     * {@link Sort.options.sortCriteria} (if it is toggled).
     * @param direction The sort direction. Can be either `ascending` or `descending`.
     */
    Sort.prototype.select = function (direction) {
        if (direction) {
            this.currentCriteria = _.find(this.options.sortCriteria, function (criteria) {
                return criteria.direction == direction;
            });
        }
        else if (Utils_1.Utils.exists(this.currentCriteria)) {
            var indexOfCurrentCriteria = _.indexOf(this.options.sortCriteria, this.currentCriteria);
            Assert_1.Assert.check(indexOfCurrentCriteria >= 0);
            this.currentCriteria = this.options.sortCriteria[(indexOfCurrentCriteria + 1) % this.options.sortCriteria.length];
        }
        else {
            this.currentCriteria = this.options.sortCriteria[0];
        }
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.sort, this.currentCriteria.toString());
    };
    Sort.prototype.enable = function () {
        Dom_1.$$(this.element).removeClass('coveo-tab-disabled');
        this.update();
        _super.prototype.enable.call(this);
    };
    Sort.prototype.disable = function () {
        Dom_1.$$(this.element).addClass('coveo-tab-disabled');
        _super.prototype.disable.call(this);
    };
    /**
     * Gets the current {@link Sort.options.sortCriteria}.
     * @returns {SortCriteria}
     */
    Sort.prototype.getCurrentCriteria = function () {
        return this.currentCriteria;
    };
    /**
     * Indicates whether the name of any of the {@link Sort.options.sortCriteria} matches the argument.
     * @param sortId The sort criteria name to look for (e.g., `date descending`).
     */
    Sort.prototype.match = function (sortId) {
        return _.any(this.options.sortCriteria, function (sortCriteria) { return sortId == sortCriteria.toString(); });
    };
    Sort.prototype.handleQueryStateChanged = function (data) {
        this.update();
    };
    Sort.prototype.update = function () {
        // Basically, if the criteria in the model fits with one of ours, it'll become our active criteria
        var sortCriteria = this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.sort);
        if (Utils_1.Utils.isNonEmptyString(sortCriteria)) {
            var criteriaFromModel = SortCriteria_1.SortCriteria.parse(sortCriteria);
            this.currentCriteria = _.find(this.options.sortCriteria, function (criteria) { return criteriaFromModel.equals(criteria); });
        }
        else {
            this.currentCriteria = null;
        }
        this.updateAppearance();
    };
    Sort.prototype.handleBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        var sort = this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.sort);
        if (sort == QueryStateModel_1.QueryStateModel.defaultAttributes.sort || this.isSelected()) {
            if (this.currentCriteria) {
                this.currentCriteria.putInQueryBuilder(data.queryBuilder);
            }
        }
    };
    Sort.prototype.handleQuerySuccess = function (data) {
        if (data.results.results.length == 0) {
            Dom_1.$$(this.element).addClass('coveo-sort-hidden');
        }
        else {
            Dom_1.$$(this.element).removeClass('coveo-sort-hidden');
        }
    };
    Sort.prototype.handleQueryError = function (data) {
        Dom_1.$$(this.element).addClass('coveo-sort-hidden');
    };
    Sort.prototype.handleClick = function () {
        var _this = this;
        var oldCriteria = this.currentCriteria;
        this.select();
        if (oldCriteria != this.currentCriteria) {
            this.queryController.deferExecuteQuery({
                beforeExecuteQuery: function () { return _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.resultsSort, { resultsSortBy: _this.currentCriteria.sort + _this.currentCriteria.direction }); }
            });
        }
    };
    Sort.prototype.isToggle = function () {
        return this.options.sortCriteria.length > 1;
    };
    Sort.prototype.isSelected = function () {
        return Utils_1.Utils.exists(this.currentCriteria);
    };
    Sort.prototype.updateAppearance = function () {
        Dom_1.$$(this.element).toggleClass('coveo-selected', this.isSelected());
        if (this.isToggle()) {
            var direction = this.currentCriteria ? this.currentCriteria.direction : this.options.sortCriteria[0].direction;
            Dom_1.$$(this.element).removeClass('coveo-ascending');
            Dom_1.$$(this.element).removeClass('coveo-descending');
            if (this.isSelected()) {
                Dom_1.$$(this.element).addClass(direction === 'ascending' ? 'coveo-ascending' : 'coveo-descending');
            }
        }
    };
    return Sort;
}(Component_1.Component));
Sort.ID = 'Sort';
Sort.doExport = function () {
    GlobalExports_1.exportGlobally({
        'Sort': Sort,
        'SortCriteria': SortCriteria_1.SortCriteria
    });
};
/**
 * Options for the component
 * @componentOptions
 */
Sort.options = {
    /**
     * Specifies the criterion (or criteria) for sorting.
     *
     * The possible criteria are:
     * - `relevancy`
     * - `date`
     * - `qre`
     * - `@fieldname` (replace `fieldname` with an actual field name (e.g., `@size`)
     *
     * You can also specify a direction (`ascending` or `descending`), for example `date ascending`.
     *
     * You can pass an array containing multiple criteria to the Sort component.
     * If you specify multiple criteria, all criteria must have the same direction (either `ascending` or
     * `descending`).
     * You can only use the `date` and `@fieldname` criteria when specifying multiple criteria.
     * Multiple criteria are evaluated in the order you specify them.
     *
     * It is necessary to specify a value for this option in order for this component to work.
     */
    sortCriteria: ComponentOptions_1.ComponentOptions.buildCustomListOption(function (values) {
        return _.map(values, function (criteria) {
            if (typeof criteria === 'string') {
                return SortCriteria_1.SortCriteria.parse(criteria);
            }
            else {
                return criteria;
            }
        });
    }, { required: true }),
    /**
     * Specifies the caption to display on the element.
     *
     * If you do not specify a value for this option, the component uses the tag body of the element.
     */
    caption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ required: true })
};
exports.Sort = Sort;
Initialization_1.Initialization.registerAutoCreateComponent(Sort);


/***/ }),

/***/ 440:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(7);
var Utils_1 = __webpack_require__(5);
var _ = __webpack_require__(1);
var SortCriteria = (function () {
    /**
     * Create a new SortCriteria
     * @param sort The sort criteria (e.g.: relevancy, date)
     * @param direction The direction by which to sort (e.g.: ascending, descending)
     */
    function SortCriteria(sort, direction) {
        if (direction === void 0) { direction = ''; }
        this.sort = sort;
        this.direction = direction;
        Assert_1.Assert.isNonEmptyString(sort);
        Assert_1.Assert.check(_.contains(SortCriteria.validSorts, sort) || SortCriteria.sortIsField(sort));
        if (SortCriteria.sortNeedsDirection(sort)) {
            Assert_1.Assert.check(_.contains(SortCriteria.validDirections, direction));
        }
        else {
            Assert_1.Assert.check(direction == '');
        }
    }
    /**
     * Return a new SortCriteria from a string
     * @param criteria The string from which to create the SortCriteria
     */
    SortCriteria.parse = function (criteria) {
        Assert_1.Assert.isNonEmptyString(criteria);
        var split = criteria.match(/\S+/g);
        return new SortCriteria(split[0], split[1]);
    };
    /**
     * Put the sort criteria in the passed queryBuilder
     * @param queryBuilder The queryBuilder in which to put the sort criteria.
     */
    SortCriteria.prototype.putInQueryBuilder = function (queryBuilder) {
        Assert_1.Assert.exists(queryBuilder);
        if (SortCriteria.sortIsField(this.sort)) {
            queryBuilder.sortCriteria = 'field' + this.direction;
            queryBuilder.sortField = this.sort;
        }
        else if (this.direction != '') {
            queryBuilder.sortCriteria = this.sort + this.direction;
        }
        else {
            queryBuilder.sortCriteria = this.sort;
        }
    };
    /**
     * Gets the value of the sort criteria from a single {@link IQueryResult}.<br/>
     * For example, if the sort criteria is 'relevancy', it will return the value of the 'relevancy' field from result.
     * @param result The {@link IQueryResult} from which to get the value.
     */
    SortCriteria.prototype.getValueFromResult = function (result) {
        Assert_1.Assert.exists(result);
        if (SortCriteria.sortIsField(this.sort)) {
            return Utils_1.Utils.getFieldValue(result, this.sort);
        }
        else if (this.sort == 'date') {
            return result.raw['date'];
        }
        else {
            Assert_1.Assert.fail('Cannot retrieve value: ' + this.sort);
        }
    };
    /**
     * Returns a string representation of the sort criteria (e.g.: 'date ascending').
     */
    SortCriteria.prototype.toString = function () {
        if (Utils_1.Utils.isNonEmptyString(this.direction)) {
            return this.sort + ' ' + this.direction;
        }
        else {
            return this.sort;
        }
    };
    /**
     * Checks if the SortCriteria is equal to another.
     * @param criteria The SortCriteria to compare with
     */
    SortCriteria.prototype.equals = function (criteria) {
        Assert_1.Assert.exists(criteria);
        return criteria.sort == this.sort && criteria.direction == this.direction;
    };
    SortCriteria.sortIsField = function (criteria) {
        return criteria.charAt(0) == '@';
    };
    SortCriteria.sortNeedsDirection = function (sort) {
        return _.contains(SortCriteria.sortsNeedingDirection, sort) || SortCriteria.sortIsField(sort);
    };
    return SortCriteria;
}());
SortCriteria.validSorts = ['relevancy', 'date', 'qre'];
SortCriteria.sortsNeedingDirection = ['date'];
SortCriteria.validDirections = ['ascending', 'descending'];
exports.SortCriteria = SortCriteria;


/***/ }),

/***/ 616:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Sort.js.map