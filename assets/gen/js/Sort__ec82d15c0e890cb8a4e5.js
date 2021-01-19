webpackJsonpCoveo__temporary([39],{

/***/ 192:
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
__webpack_require__(574);
var GlobalExports_1 = __webpack_require__(3);
var QueryEvents_1 = __webpack_require__(11);
var Assert_1 = __webpack_require__(5);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var SharedAnalyticsCalls_1 = __webpack_require__(119);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var SortCriteria_1 = __webpack_require__(498);
var AccessibleButton_1 = __webpack_require__(15);
var Strings_1 = __webpack_require__(6);
var underscore_1 = __webpack_require__(0);
/**
 * The `Sort` component renders a widget that the end user can interact with to select the criterion to use when sorting query results.
 *
 * To improve accessibility, it's recommended to group `Sort` components in a container with `role="radiogroup"`.
 */
var Sort = /** @class */ (function (_super) {
    __extends(Sort, _super);
    /**
     * Creates a new `Sort` component instance.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for this component instance.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Sort(element, options, bindings) {
        var _this = _super.call(this, element, Sort.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Sort, options);
        Assert_1.Assert.isLargerOrEqualsThan(1, _this.options.sortCriteria.length);
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.SORT, function () { return _this.handleQueryStateChanged(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function (args) { return _this.handleQueryError(args); });
        _this.ensureDom();
        return _this;
    }
    Sort.prototype.createDom = function () {
        var _this = this;
        var el = Dom_1.$$(this.element);
        el.on('click', function () { return _this.selectAndExecuteQuery(); });
        var innerText = el.text();
        el.empty();
        this.findOrCreateRadioGroup();
        this.createSortButton(innerText);
        if (this.isToggle()) {
            this.createDirectionButton();
        }
        this.update();
    };
    /**
     * Selects this `Sort` component.
     *
     * Updates the state model if selecting this component toggles its current [`sortCriteria`]{@link Sort.options.sortCriteria}.
     *
     * @param direction The sort direction. Can be one of: `ascending`, `descending`.
     */
    Sort.prototype.select = function (direction) {
        if (direction) {
            this.currentCriteria = underscore_1.find(this.options.sortCriteria, function (criteria) {
                return criteria.direction == direction;
            });
            this.updateQueryStateModel();
        }
        else if (Utils_1.Utils.exists(this.currentCriteria)) {
            this.selectNextCriteria();
        }
        else {
            this.selectFirstCriteria();
        }
    };
    /**
     * Selects this `Sort` component, then triggers a query if selecting this component toggles its current [`sortCriteria`]{@link Sort.options.sortCriteria}.
     *
     * Also logs an event in the usage analytics with the new current sort criteria.
     */
    Sort.prototype.selectAndExecuteQuery = function () {
        var oldCriteria = this.currentCriteria;
        this.select();
        if (oldCriteria != this.currentCriteria) {
            this.executeSearchQuery();
        }
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
     * Gets the current [`sortCriteria`]{@link Sort.options.sortCriteria} of this `Sort` component.
     * @returns {SortCriteria}
     */
    Sort.prototype.getCurrentCriteria = function () {
        return this.currentCriteria;
    };
    /**
     * Indicates whether the name of any of the available [`sortCriteria`]{@link Sort.options.sortCriteria} of this `Sort` component matches the argument.
     * @param sortId The sort criteria name to look for (e.g., `date descending`).
     */
    Sort.prototype.match = function (sortId) {
        return underscore_1.any(this.options.sortCriteria, function (sortCriteria) { return sortId == sortCriteria.toString(); });
    };
    Sort.prototype.findOrCreateRadioGroup = function () {
        this.radioGroup = this.findRadioGroup();
        if (!this.radioGroup) {
            this.element.setAttribute('role', 'radiogroup');
            this.radioGroup = this.element;
        }
    };
    Sort.prototype.createSortButton = function (innerText) {
        var _this = this;
        this.sortButton = Dom_1.$$('span').el;
        this.sortButton.innerText = this.options.caption || innerText;
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.sortButton)
            .withEnterKeyboardAction(function () { return _this.selectAndExecuteQuery(); })
            .withArrowsAction(function (direction, e) { return _this.onArrowPressed(direction, e); })
            .withLabel(this.isToggle() ? this.getDirectionalLabel(this.initialDirection) : this.getOmnidirectionalLabel())
            .withRole('radio')
            .build();
        this.element.appendChild(this.sortButton);
    };
    Sort.prototype.createDirectionButton = function () {
        var _this = this;
        this.directionButton = Dom_1.$$.apply(void 0, ['span', { className: 'coveo-icon' }].concat(this.createIcons())).el;
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.directionButton)
            .withSelectAction(function (e) {
            e.stopPropagation();
            _this.selectNextCriteriaAndExecuteQuery();
        })
            .withArrowsAction(function (direction, e) { return _this.onArrowPressed(direction, e); })
            .withLabel(this.getDirectionalLabel(this.initialDirection === SortCriteria_1.VALID_DIRECTION.DESCENDING ? SortCriteria_1.VALID_DIRECTION.ASCENDING : SortCriteria_1.VALID_DIRECTION.DESCENDING))
            .withRole('radio')
            .build();
        this.element.appendChild(this.directionButton);
    };
    Sort.prototype.onArrowPressed = function (direction, e) {
        this.selectNextRadioButton(direction === AccessibleButton_1.ArrowDirection.RIGHT || direction === AccessibleButton_1.ArrowDirection.DOWN ? 1 : -1);
        e.stopPropagation();
    };
    Sort.prototype.createIcons = function () {
        var iconAscending = Dom_1.$$('span', { className: 'coveo-sort-icon-ascending' }, SVGIcons_1.SVGIcons.icons.arrowUp);
        SVGDom_1.SVGDom.addClassToSVGInContainer(iconAscending.el, 'coveo-sort-icon-ascending-svg');
        var iconDescending = Dom_1.$$('span', { className: 'coveo-sort-icon-descending' }, SVGIcons_1.SVGIcons.icons.arrowDown);
        SVGDom_1.SVGDom.addClassToSVGInContainer(iconDescending.el, 'coveo-sort-icon-descending-svg');
        return [iconAscending, iconDescending];
    };
    Sort.prototype.findRadioGroup = function (element) {
        if (element === void 0) { element = this.element; }
        if (!element || element === document.body) {
            return null;
        }
        if (element.getAttribute('role') === 'radiogroup') {
            return element;
        }
        return this.findRadioGroup(element.parentElement);
    };
    Sort.prototype.selectNextRadioButton = function (direction) {
        if (direction === void 0) { direction = 1; }
        var radioButtons = Dom_1.$$(this.radioGroup).findAll('[role="radio"]');
        var currentIndex = underscore_1.findIndex(radioButtons, function (radio) { return radio.getAttribute('aria-checked') === 'true'; });
        var indexToSelect;
        var isAnythingSelected = currentIndex !== -1;
        if (isAnythingSelected) {
            indexToSelect = (currentIndex + direction + radioButtons.length) % radioButtons.length;
        }
        else {
            if (direction >= 0) {
                indexToSelect = 0;
            }
            else {
                indexToSelect = radioButtons.length - 1;
            }
        }
        var radioToSelect = radioButtons[indexToSelect];
        radioToSelect.focus();
        radioToSelect.click();
    };
    Sort.prototype.executeSearchQuery = function () {
        var _this = this;
        this.queryController.deferExecuteQuery({
            beforeExecuteQuery: function () { return SharedAnalyticsCalls_1.logSortEvent(_this.usageAnalytics, _this.currentCriteria.sort + _this.currentCriteria.direction); }
        });
    };
    Sort.prototype.selectFirstCriteria = function () {
        this.currentCriteria = this.options.sortCriteria[0];
        this.updateQueryStateModel();
    };
    Sort.prototype.selectNextCriteria = function () {
        var indexOfCurrentCriteria = this.currentCriteria ? this.options.sortCriteria.indexOf(this.currentCriteria) : 0;
        this.currentCriteria = this.options.sortCriteria[(indexOfCurrentCriteria + 1) % this.options.sortCriteria.length];
        this.updateQueryStateModel();
    };
    Sort.prototype.selectNextCriteriaAndExecuteQuery = function () {
        var oldCriteria = this.currentCriteria;
        this.selectNextCriteria();
        if (oldCriteria != this.currentCriteria) {
            this.executeSearchQuery();
        }
    };
    Sort.prototype.handleQueryStateChanged = function () {
        this.update();
    };
    Sort.prototype.update = function () {
        // Basically, if the criteria in the model fits with one of ours, it'll become our active criteria
        var sortCriteria = this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.sort);
        if (Utils_1.Utils.isNonEmptyString(sortCriteria)) {
            var criteriaFromModel = SortCriteria_1.SortCriteria.parse(sortCriteria);
            this.currentCriteria = underscore_1.find(this.options.sortCriteria, function (criteria) { return criteriaFromModel.equals(criteria); });
        }
        else {
            this.currentCriteria = null;
        }
        this.updateAppearance();
        this.updateAccessibilityProperties();
    };
    Object.defineProperty(Sort.prototype, "captionIsDefined", {
        get: function () {
            return Utils_1.Utils.isNonEmptyString(this.options.caption);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sort.prototype, "currentDirection", {
        get: function () {
            return this.currentCriteria ? this.currentCriteria.direction : this.initialDirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sort.prototype, "initialDirection", {
        get: function () {
            return this.options.sortCriteria[0].direction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sort.prototype, "displayedSortText", {
        get: function () {
            return this.captionIsDefined ? this.options.caption : this.element.textContent;
        },
        enumerable: true,
        configurable: true
    });
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
    Sort.prototype.isToggle = function () {
        return this.options.sortCriteria.length > 1;
    };
    Sort.prototype.isSelected = function () {
        return Utils_1.Utils.exists(this.currentCriteria);
    };
    Sort.prototype.updateAppearance = function () {
        Dom_1.$$(this.element).toggleClass('coveo-selected', this.isSelected());
        if (this.isToggle()) {
            Dom_1.$$(this.element).removeClass('coveo-ascending');
            Dom_1.$$(this.element).removeClass('coveo-descending');
            if (this.isSelected()) {
                Dom_1.$$(this.element).addClass(this.currentDirection === 'ascending' ? 'coveo-ascending' : 'coveo-descending');
            }
        }
    };
    Sort.prototype.updateAccessibilityProperties = function () {
        this.sortButton.setAttribute('aria-controls', this.resultListsIds);
        var directionIsInitial = this.currentDirection === this.initialDirection;
        this.sortButton.setAttribute('aria-checked', "" + (this.isSelected() && directionIsInitial));
        if (this.isToggle()) {
            this.directionButton.setAttribute('aria-controls', this.resultListsIds);
            this.directionButton.setAttribute('aria-checked', "" + (this.isSelected() && !directionIsInitial));
        }
    };
    Object.defineProperty(Sort.prototype, "resultListsIds", {
        get: function () {
            var resultLists = this.searchInterface.getComponents('ResultList');
            return resultLists.map(function (resultList) { return resultList.element.id; }).join(' ');
        },
        enumerable: true,
        configurable: true
    });
    Sort.prototype.getDirectionalLabel = function (direction) {
        var localizedCaption = Strings_1.l(this.displayedSortText);
        return direction === SortCriteria_1.VALID_DIRECTION.DESCENDING
            ? Strings_1.l('SortResultsByDescending', localizedCaption)
            : Strings_1.l('SortResultsByAscending', localizedCaption);
    };
    Sort.prototype.getOmnidirectionalLabel = function () {
        var localizedCaption = Strings_1.l(this.displayedSortText);
        return Strings_1.l('SortResultsBy', localizedCaption);
    };
    Sort.prototype.updateQueryStateModel = function () {
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.sort, this.currentCriteria.toString());
    };
    Sort.ID = 'Sort';
    Sort.doExport = function () {
        GlobalExports_1.exportGlobally({
            Sort: Sort,
            SortCriteria: SortCriteria_1.SortCriteria
        });
    };
    /**
     * Options for the component
     * @componentOptions
     */
    Sort.options = {
        /**
         * The sort criterion/criteria the end user can select/toggle between when interacting with this component instance.
         *
         * The available sort criteria are:
         * - `relevancy`
         * - `date ascending`/`date descending`
         * - `qre`
         * - `@field ascending`/`@field descending`, where you must replace `field` with the name of a sortable field in your index (e.g., `data-sort-criteria="@size ascending"`).
         *
         * You can specify a comma separated list of sort criteria to toggle between when interacting with this component instance (e.g., `data-sort-criteria="date descending,date ascending"`).
         *
         * You can specify multiple sort criteria to be used in the same request by separating them with a semicolon (e.g., `data-sort-criteria="@size ascending;date ascending"` ).
         *
         * Interacting with this component instance will cycle through those criteria in the order they are listed in.
         * Typically, you should only specify a list of sort criteria when you want the end user to be able to to toggle the direction of a `date` or `@field` sort criteria.
         * Otherwise, you should configure a distinct `Sort` component instance for each sort criterion you want to make available in your search page.
         *
         * You must specify a valid value for this option in order for this component instance to work correctly.
         *
         * Examples:
         *
         * - `data-sort-criteria="date ascending"` createes a Sort component that allows to sort on `date ascending`, without being able to toggle the order.
         * - `data-sort-criteria="date ascending, date descending"` creates a Sort component that allows end users to toggle between `date ascending` and `date descending` on click.
         * - `data-sort-criteria="@size ascending; date descending"` creates a Sort component that only allows end users to sort on `@size ascending`. The index then applies a second sort on `date descending` when two items are of equal value.
         * - `data-sort-criteria="@size ascending; date descending, @size descending; date descending"` creates a Sort component that allows end users to toggle between `@size ascending` and `@size descending`. For each value, the index applies a second sort on `date descending` when two items are of equal value.
         */
        sortCriteria: ComponentOptions_1.ComponentOptions.buildCustomListOption(function (values) {
            return values.map(function (criteria) {
                // 'any' because Underscore won't accept the union type as an argument.
                if (typeof criteria === 'string') {
                    return new SortCriteria_1.SortCriteria(criteria);
                }
                else {
                    return criteria;
                }
            });
        }, { required: true }),
        /**
         * The caption to display on this component instance.
         *
         * By default, the component uses the text content of the element it is instanciated on.
         */
        caption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ required: true })
    };
    return Sort;
}(Component_1.Component));
exports.Sort = Sort;
Initialization_1.Initialization.registerAutoCreateComponent(Sort);


/***/ }),

/***/ 498:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Assert_1 = __webpack_require__(5);
var VALID_SORT;
(function (VALID_SORT) {
    VALID_SORT["RELEVANCY"] = "relevancy";
    VALID_SORT["DATE"] = "date";
    VALID_SORT["QRE"] = "qre";
})(VALID_SORT = exports.VALID_SORT || (exports.VALID_SORT = {}));
var VALID_DIRECTION;
(function (VALID_DIRECTION) {
    VALID_DIRECTION["ASCENDING"] = "ascending";
    VALID_DIRECTION["DESCENDING"] = "descending";
})(VALID_DIRECTION = exports.VALID_DIRECTION || (exports.VALID_DIRECTION = {}));
var SortCriterion = /** @class */ (function () {
    /**
     * Create a new SortCriteria
     * @param sort The sort criteria (e.g.: relevancy, date)
     * @param direction The direction by which to sort (e.g.: ascending, descending)
     */
    function SortCriterion(sort, direction) {
        if (direction === void 0) { direction = ''; }
        this.sort = sort;
        this.direction = direction;
        if (!SortCriterion.sortIsField(sort)) {
            Assert_1.Assert.check(this.isValidSort(sort), sort + " is not a valid sort criteria. Valid values are " + underscore_1.values(VALID_SORT) + " or a valid index sortable index field.");
        }
        if (SortCriterion.sortNeedsDirection(sort)) {
            Assert_1.Assert.check(this.isValidDirection(direction), direction + " is not a valid sort criteria direction. Valid values are " + underscore_1.values(VALID_DIRECTION));
        }
        else {
            Assert_1.Assert.check(direction == '');
        }
    }
    SortCriterion.prototype.isValidDirection = function (direction) {
        return underscore_1.chain(VALID_DIRECTION)
            .values()
            .contains(direction)
            .value();
    };
    SortCriterion.prototype.isValidSort = function (sort) {
        return underscore_1.chain(VALID_SORT)
            .values()
            .contains(sort)
            .value();
    };
    SortCriterion.sortIsField = function (criteria) {
        return criteria.charAt(0) == '@';
    };
    SortCriterion.sortNeedsDirection = function (sort) {
        return underscore_1.contains(SortCriterion.sortsNeedingDirection, sort) || SortCriterion.sortIsField(sort);
    };
    SortCriterion.sortsNeedingDirection = [VALID_SORT.DATE];
    return SortCriterion;
}());
exports.SortCriterion = SortCriterion;
var SortCriteria = /** @class */ (function () {
    function SortCriteria(rawCriteriaString) {
        var _this = this;
        this.criteria = [];
        var criteria = rawCriteriaString.split(';');
        criteria.forEach(function (criterion) {
            var split = criterion.match(/\S+/g);
            _this.criteria.push(new SortCriterion(split[0], split[1]));
        });
    }
    Object.defineProperty(SortCriteria.prototype, "direction", {
        get: function () {
            return underscore_1.first(this.criteria).direction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortCriteria.prototype, "sort", {
        get: function () {
            return underscore_1.first(this.criteria).sort;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return a new SortCriteria from a string
     * @param criteria The string from which to create the SortCriteria
     */
    SortCriteria.parse = function (criteria) {
        return new SortCriteria(criteria);
    };
    /**
     * Put the sort criteria in the passed queryBuilder
     * @param queryBuilder The queryBuilder in which to put the sort criteria.
     */
    SortCriteria.prototype.putInQueryBuilder = function (queryBuilder) {
        Assert_1.Assert.exists(queryBuilder);
        queryBuilder.sortCriteria = this.toString()
            .split(';')
            .join(',');
    };
    /**
     * Returns a string representation of the sort criteria (e.g.: 'date ascending').
     */
    SortCriteria.prototype.toString = function () {
        return this.criteria
            .map(function (criterion) {
            return criterion.direction ? criterion.sort + " " + criterion.direction : "" + criterion.sort;
        })
            .join(';');
    };
    /**
     * Checks if the SortCriteria is equal to another.
     * @param criteria The SortCriteria to compare with
     */
    SortCriteria.prototype.equals = function (criteria) {
        return criteria.toString() == this.toString();
    };
    return SortCriteria;
}());
exports.SortCriteria = SortCriteria;


/***/ }),

/***/ 574:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Sort__ec82d15c0e890cb8a4e5.js.map