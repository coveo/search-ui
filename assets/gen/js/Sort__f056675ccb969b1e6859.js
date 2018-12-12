webpackJsonpCoveo__temporary([22],{

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

/***/ 220:
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
__webpack_require__(482);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var QueryEvents_1 = __webpack_require__(10);
var Assert_1 = __webpack_require__(5);
var Model_1 = __webpack_require__(15);
var QueryStateModel_1 = __webpack_require__(12);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var Utils_1 = __webpack_require__(4);
var SharedAnalyticsCalls_1 = __webpack_require__(85);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var SortCriteria_1 = __webpack_require__(357);
var AccessibleButton_1 = __webpack_require__(17);
var Strings_1 = __webpack_require__(7);
/**
 * The `Sort` component renders a widget that the end user can interact with to select the criterion to use when sorting query results.
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
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.SORT, function (args) {
            return _this.handleQueryStateChanged(args);
        });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function (args) { return _this.handleQueryError(args); });
        _this.setTextToCaptionIfDefined();
        _this.addAccessiblityAttributes();
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
     * Selects this `Sort` component.
     *
     * Triggers a query if selecting this component toggles its current [`sortCriteria`]{@link Sort.options.sortCriteria}.
     *
     * @param direction The sort direction. Can be one of: `ascending`, `descending`.
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
    Sort.prototype.setTextToCaptionIfDefined = function () {
        this.captionIsDefined && Dom_1.$$(this.element).text(this.options.caption);
    };
    Object.defineProperty(Sort.prototype, "captionIsDefined", {
        get: function () {
            return Utils_1.Utils.isNonEmptyString(this.options.caption);
        },
        enumerable: true,
        configurable: true
    });
    Sort.prototype.addAccessiblityAttributes = function () {
        var _this = this;
        var localizedCaption = Strings_1.l(this.displayedSortText);
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.element)
            .withSelectAction(function () { return _this.handleClick(); })
            .withLabel(Strings_1.l('SortResultsBy', localizedCaption))
            .build();
    };
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
    Sort.prototype.handleClick = function () {
        var _this = this;
        var oldCriteria = this.currentCriteria;
        this.select();
        if (oldCriteria != this.currentCriteria) {
            this.queryController.deferExecuteQuery({
                beforeExecuteQuery: function () { return SharedAnalyticsCalls_1.logSortEvent(_this.usageAnalytics, _this.currentCriteria.sort + _this.currentCriteria.direction); }
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
            return _.map(values, function (criteria) {
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

/***/ 357:
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

/***/ 367:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 482:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Sort__f056675ccb969b1e6859.js.map