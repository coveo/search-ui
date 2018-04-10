webpackJsonpCoveo__temporary([12],{

/***/ 138:
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
var ResponsiveTabs_1 = __webpack_require__(431);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var Model_1 = __webpack_require__(16);
var QueryEvents_1 = __webpack_require__(10);
var InitializationEvents_1 = __webpack_require__(15);
var QueryStateModel_1 = __webpack_require__(12);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var SearchEndpoint_1 = __webpack_require__(41);
var Initialization_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var Assert_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(2);
var KeyboardUtils_1 = __webpack_require__(20);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(433);
/**
 * The Tab component renders a bar that allows the end user to select a specific search interface.
 *
 * This component attaches itself to a `div` element. It is in charge of adding an advanced expression to the outgoing
 * query in order to refine the results.
 *
 * The Tab component can also hide and show different parts of the UI. For each individual component in the UI, you can
 * specify whether you wish to include or exclude that component when the user selects a certain Tab.
 *
 * **Including and Excluding Other HTML Components:**
 *
 * You can hide or show a specific HTML component based on the currently selected Tab by adding one of the following
 * attributes to its tag:
 *
 * - `<div data-tab="foobar">`: Only include this element in the Tab with `foobar` as its `data-id`.
 * - `<div data-tab-not="foobar">`: Do not include this element in the Tab with `foobar` as its `data-id`.
 * - `<div data-tab="foobar,somethingelse">`: Only include this element in the Tab with `foobar` as its `data-id` and in
 * the Tab with `somethingelse` as its `data-id`.
 *
 * **Setting a New Endpoint for a Tab:**
 *
 * A Tab can use a custom endpoint when performing a query. Of course, you need to make sure that the endpoint exists in
 * the array of Coveo.SearchEndpoint.endpoints (see {@link SearchEndpoint.endpoints}).
 *
 * ```
 * Coveo.SearchEndpoint.endpoints["specialEndpoint"] = new Coveo.SearchEndpoint({
 *     restUri : 'https://somewhere.com/rest/search'
 * })
 *
 * [ ... ]
 *
 * <div class='CoveoTab' data-endpoint='specialEndpoint'></div>
 *
 * ```
 */
var Tab = /** @class */ (function (_super) {
    __extends(Tab, _super);
    /**
     * Creates a new Tab. Binds on buildingQuery event as well as an event on click of the element.
     * @param element The HTMLElement on which to instantiate the component. Normally a `div`.
     * @param options The options for the Tab component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Tab(element, options, bindings) {
        var _this = _super.call(this, element, Tab.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Tab, options);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(InitializationEvents_1.InitializationEvents.afterInitialization, function () { return _this.handleAfterInitialization(); });
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.T, function (args) {
            return _this.handleQueryStateChanged(args);
        });
        var clickAction = function () { return _this.handleClick(); };
        _this.bind.on(element, 'click', clickAction);
        _this.bind.on(element, 'keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, clickAction));
        _this.render();
        ResponsiveTabs_1.ResponsiveTabs.init(_this.root, _this, _this.options);
        return _this;
    }
    /**
     * Selects the current Tab.
     *
     * Also logs the `interfaceChange` event in the usage analytics with the new current {@link Tab.options.id} as metada
     * and triggers a new query.
     */
    Tab.prototype.select = function () {
        if (!this.disabled) {
            var currentLayout = this.queryStateModel.get(QueryStateModel_1.QUERY_STATE_ATTRIBUTES.LAYOUT);
            this.queryStateModel.setMultiple({
                t: this.options.id,
                sort: this.options.sort || QueryStateModel_1.QueryStateModel.defaultAttributes.sort,
                layout: this.options.layout || currentLayout || QueryStateModel_1.QueryStateModel.defaultAttributes.layout
            });
            this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.interfaceChange, {
                interfaceChangeTo: this.options.id
            });
            this.queryController.executeQuery();
        }
    };
    /**
     * Indicates whether the HTMLElement argument is included in the Tab. *Included* elements are shown when the Tab is
     * selected, whereas *excluded* elements are not.
     * @param element The HTMLElement to verify.
     * @returns {boolean} `true` if the HTMLElement is included in the Tab; `false` if it is excluded.
     */
    Tab.prototype.isElementIncludedInTab = function (element) {
        Assert_1.Assert.exists(element);
        var includedTabs = this.splitListOfTabs(element.getAttribute('data-tab'));
        var excludedTabs = this.splitListOfTabs(element.getAttribute('data-tab-not'));
        Assert_1.Assert.check(!(includedTabs.length != 0 && excludedTabs.length != 0), 'You cannot both explicitly include and exclude an element from tabs.');
        return ((includedTabs.length != 0 && _.indexOf(includedTabs, this.options.id) != -1) ||
            (excludedTabs.length != 0 && _.indexOf(excludedTabs, this.options.id) == -1) ||
            (includedTabs.length == 0 && excludedTabs.length == 0));
    };
    Tab.prototype.handleClick = function () {
        this.select();
    };
    Tab.prototype.render = function () {
        var icon = this.options.icon;
        if (Utils_1.Utils.isNonEmptyString(icon)) {
            var iconSpan = Dom_1.$$('span').el;
            Dom_1.$$(iconSpan).addClass(['coveo-icon', icon]);
            this.element.insertBefore(iconSpan, this.element.firstChild);
        }
        var caption = this.options.caption;
        if (Utils_1.Utils.isNonEmptyString(caption)) {
            var captionP = document.createElement('p');
            Dom_1.$$(captionP).text(caption);
            this.element.appendChild(captionP);
        }
        this.element.setAttribute('tabindex', '0');
    };
    Tab.prototype.handleBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        if (!this.disabled && this.isSelected()) {
            data.queryBuilder.tab = this.options.id;
            if (Utils_1.Utils.isNonEmptyString(this.options.expression)) {
                if (this.options.constant) {
                    data.queryBuilder.constantExpression.add(this.options.expression);
                }
                else {
                    data.queryBuilder.advancedExpression.add(this.options.expression);
                }
            }
            if (this.options.enableDuplicateFiltering) {
                data.queryBuilder.enableDuplicateFiltering = true;
            }
            if (this.options.pipeline != null) {
                data.queryBuilder.pipeline = this.options.pipeline;
            }
            if (this.options.maximumAge != null) {
                data.queryBuilder.maximumAge = this.options.maximumAge;
            }
        }
    };
    Tab.prototype.handleQueryStateChanged = function (data) {
        Assert_1.Assert.exists(data);
        if (!this.disabled && this.isSelected()) {
            Dom_1.$$(this.element).addClass('coveo-selected');
            this.queryController.setEndpoint(this.options.endpoint);
            this.showAndHideAppropriateElements();
        }
        else {
            Dom_1.$$(this.element).removeClass('coveo-selected');
        }
    };
    Tab.prototype.handleAfterInitialization = function () {
        if (this.isSelected() && this.options.layout) {
            this.queryStateModel.set(QueryStateModel_1.QUERY_STATE_ATTRIBUTES.LAYOUT, this.options.layout);
        }
    };
    Tab.prototype.isSelected = function () {
        var activeTab = this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.t);
        return activeTab == this.options.id;
    };
    Tab.prototype.showAndHideAppropriateElements = function () {
        var _this = this;
        var showElements = [];
        var hideElements = [];
        _.each(Dom_1.$$(this.root).findAll('[data-tab],[data-tab-not]'), function (element) {
            if (_this.isElementIncludedInTab(element)) {
                _this.toggleAllComponentsUnder(element, true);
                showElements.push(element);
            }
            else {
                _this.toggleAllComponentsUnder(element, false);
                hideElements.push(element);
            }
        });
        Dom_1.$$(this.root).one(QueryEvents_1.QueryEvents.querySuccess, function () {
            _.each(showElements, function (elem) { return Dom_1.$$(elem).removeClass('coveo-tab-disabled'); });
            _.each(hideElements, function (elem) { return Dom_1.$$(elem).addClass('coveo-tab-disabled'); });
        });
    };
    Tab.prototype.splitListOfTabs = function (value) {
        if (Utils_1.Utils.exists(value)) {
            return _.map(value.split(','), function (tab) { return Utils_1.Utils.trim(tab); });
        }
        else {
            return [];
        }
    };
    Tab.prototype.toggleAllComponentsUnder = function (element, enable) {
        Assert_1.Assert.exists(element);
        var togglePossibleComponent = function (possibleComponent) {
            var possibleCmp = Component_1.Component.get(possibleComponent, undefined, true);
            if (possibleCmp) {
                if (enable) {
                    possibleCmp.enable();
                }
                else {
                    possibleCmp.disable();
                }
            }
        };
        togglePossibleComponent(element);
        _.each(Dom_1.$$(element).findAll('*'), function (el) {
            togglePossibleComponent(el);
        });
    };
    Tab.prototype.enable = function () {
        _super.prototype.enable.call(this);
        this.element.style.display = '';
    };
    Tab.prototype.disable = function () {
        _super.prototype.disable.call(this);
        this.element.style.display = 'none';
    };
    Tab.ID = 'Tab';
    Tab.doExport = function () {
        GlobalExports_1.exportGlobally({
            Tab: Tab
        });
    };
    /**
     * The options for a Tab
     * @componentOptions
     */
    Tab.options = {
        /**
         * Specifies a unique ID for the Tab.
         *
         * Specifying a value for this option is necessary for this component to work.
         */
        id: ComponentOptions_1.ComponentOptions.buildStringOption({ required: true, section: 'Common Options' }),
        /**
         * Specifies the caption of the Tab.
         *
         * Specifying a value for this option is necessary for this component to work.
         */
        caption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ required: true, section: 'Common Options' }),
        /**
         * Specifies an icon to use for the Tab.
         *
         * @deprecated This options is mostly kept for legacy reasons. If possible, you should avoid using it.
         */
        icon: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies an advanced expression or filter that the Tab should add to any outgoing query.
         *
         * **Example:**
         *
         * `@objecttype==Message`
         *
         * Default value is `undefined` and the Tab applies no additional expression or filter to the query.
         */
        expression: ComponentOptions_1.ComponentOptions.buildStringOption({ section: 'Filtering' }),
        /**
         * Specifies the {@link SearchEndpoint} to point to when performing queries from within the Tab.
         *
         * By default, the Tab uses the "default" endpoint.
         */
        endpoint: ComponentOptions_1.ComponentOptions.buildCustomOption(function (endpoint) { return (endpoint != null ? SearchEndpoint_1.SearchEndpoint.endpoints[endpoint] : null); }),
        /**
         * Specifies the default sort criteria to use when selecting the Tab. A {@link Sort} component with the same
         * parameter needs to be present in the search interface in order for this option to function properly.
         *
         * **Examples:**
         *
         * - `data-sort='relevancy'`
         * - `data-sort='date descending'`
         *
         * Default value is `undefined` and the normal {@link Sort} component behavior applies.
         */
        sort: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the default layout to display when the user selects the Tab (see {@link ResultList.options.layout} and
         * {@link ResultLayout}).
         *
         * See the {@link ValidLayout} type for the list of possible values.
         *
         * If not specified, it will default to 'list'.
         *
         * See also [Result Layouts](https://developers.coveo.com/x/yQUvAg).
         *
         * Default value is `undefined` and the component selects the first available layout.
         */
        layout: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies whether to include the {@link Tab.options.expression} in the constant part of the query.
         *
         * The index specially optimizes the constant part of the query to execute faster. However, you must be careful not
         * to include dynamic query expressions, otherwise the cache will lose its efficiency.
         *
         * Default value is `true`.
         */
        constant: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'Filtering' }),
        /**
         * Specifies whether to filter duplicates in the search results when the user selects the Tab.
         *
         * Setting this option to `true` forces duplicates to not appear in the search results. However, {@link Facet}
         * counts still include duplicates, which can be confusing for the end user. This is a limitation of the index.
         *
         * **Example:**
         *
         * > The end user narrows a query down to one item that has a duplicate. If this options is `true` and the user
         * > selects the Tab, only one item appears in the search results while the Facet count is still 2.
         *
         * **Note:**
         *
         * > It is also possible to enable duplicate filtering for the entire {@link SearchInterface} rather than for a
         * > single Tab (see {@link SearchInterface.options.enableDuplicateFiltering}).
         *
         * Default value is `false`.
         */
        enableDuplicateFiltering: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies the name of the query pipeline to use for the queries when the Tab is selected.
         *
         * You can specify a value for this option if your index is in a Coveo Cloud organization in which pipelines have
         * been created (see [Managing Query Pipelines](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=128)).
         *
         * Default value is `undefined`, which means that pipeline selection conditions defined in the Coveo Cloud
         * organization apply.
         */
        pipeline: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the maximum age (in milliseconds) that cached query results can have to still be usable as results
         * instead of performing a new query on the index from within the Tab. The cache is located in the Coveo Search API
         * (which resides between the index and the search interface).
         *
         * If cached results that are older than the age you specify in this option are available, a new query will be
         * performed on the index anyhow.
         *
         * On high-volume public web sites, specifying a higher value for this option can greatly improve query response
         * time at the cost of result freshness.
         *
         * **Note:**
         *
         * > It is also possible to set a maximum cache age for the entire {@link SearchInterface} rather than for a single
         * > Tab (see {@link SearchInterface.options.maximumAge}).
         *
         * Default value is `undefined` and the Coveo Search API determines the maximum cache age. This is typically
         * equivalent to 30 minutes (see [Query Parameters - maximumAge](https://developers.coveo.com/display/SearchREST/Query+Parameters#QueryParameters-maximumAge)).
         */
        maximumAge: ComponentOptions_1.ComponentOptions.buildNumberOption(),
        /**
         * Specifies whether to enable responsive mode for tabs. Responsive mode makes overflowing tabs disappear, instead
         * making them available using a dropdown button. Responsive tabs are enabled either when tabs overflow or when the
         * width of the search interface becomes too small.
         *
         * Disabling responsive mode for one Tab also disables it for all tabs. Therefore, you only need to set this option
         * to `false` on one Tab to disable responsive mode.
         *
         * Default value is `true`.
         */
        enableResponsiveMode: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'ResponsiveOptions' }),
        /**
         * Specifies the label of the button that allows to show the hidden tabs when in responsive mode.
         *
         * If more than one Tab in the search interface specifies a value for this option, then the framework uses the first
         * occurrence of the option.
         *
         * The default value is `"More"`.
         */
        dropdownHeaderLabel: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ section: 'ResponsiveOptions' })
    };
    return Tab;
}(Component_1.Component));
exports.Tab = Tab;
Initialization_1.Initialization.registerAutoCreateComponent(Tab);


/***/ }),

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

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var PopupUtils_1 = __webpack_require__(48);
var ResponsiveComponentsManager_1 = __webpack_require__(74);
var ResponsiveDropdownContent = /** @class */ (function () {
    function ResponsiveDropdownContent(componentName, element, coveoRoot, minWidth, widthRatio) {
        this.element = element;
        this.cssClassName = "coveo-" + componentName + "-dropdown-content";
        this.coveoRoot = coveoRoot;
        this.widthRatio = widthRatio;
        this.minWidth = minWidth;
    }
    ResponsiveDropdownContent.isTargetInsideOpenedDropdown = function (target) {
        var targetParentDropdown = target.parent(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
        if (targetParentDropdown) {
            return targetParentDropdown.style.display != 'none';
        }
        return false;
    };
    ResponsiveDropdownContent.prototype.positionDropdown = function () {
        this.element.addClass(this.cssClassName);
        this.element.addClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
        this.element.el.style.display = '';
        var width = this.widthRatio * this.coveoRoot.width();
        if (width <= this.minWidth) {
            width = this.minWidth;
        }
        this.element.el.style.width = width.toString() + 'px';
        PopupUtils_1.PopupUtils.positionPopup(this.element.el, Dom_1.$$(this.coveoRoot.find("." + ResponsiveComponentsManager_1.ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS)).el, this.coveoRoot.el, { horizontal: PopupUtils_1.PopupHorizontalAlignment.INNERRIGHT, vertical: PopupUtils_1.PopupVerticalAlignment.BOTTOM, verticalOffset: 15 }, this.coveoRoot.el);
    };
    ResponsiveDropdownContent.prototype.hideDropdown = function () {
        this.element.el.style.display = 'none';
        this.element.removeClass(this.cssClassName);
        this.element.removeClass(ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    };
    ResponsiveDropdownContent.prototype.cleanUp = function () {
        this.element.el.removeAttribute('style');
    };
    ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-content';
    return ResponsiveDropdownContent;
}());
exports.ResponsiveDropdownContent = ResponsiveDropdownContent;


/***/ }),

/***/ 146:
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

/***/ 431:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var InitializationEvents_1 = __webpack_require__(15);
var PopupUtils_1 = __webpack_require__(48);
var EventsUtils_1 = __webpack_require__(146);
var Utils_1 = __webpack_require__(4);
var Logger_1 = __webpack_require__(11);
var Component_1 = __webpack_require__(6);
var SearchInterface_1 = __webpack_require__(17);
var Tab_1 = __webpack_require__(138);
var ResponsiveComponentsManager_1 = __webpack_require__(74);
var ResponsiveComponentsUtils_1 = __webpack_require__(86);
var Strings_1 = __webpack_require__(8);
var ResponsiveComponents_1 = __webpack_require__(40);
var _ = __webpack_require__(0);
__webpack_require__(432);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var ResponsiveTabs = /** @class */ (function () {
    function ResponsiveTabs(coveoRoot, ID) {
        this.coveoRoot = coveoRoot;
        this.ID = ID;
        this.dropdownHeaderLabel = this.getDropdownHeaderLabel();
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.dropdownContent = this.buildDropdownContent();
        this.dropdownHeader = this.buildDropdownHeader();
        this.bindDropdownContentEvents();
        this.bindDropdownHeaderEvents();
        this.tabSection = Dom_1.$$(this.coveoRoot.find('.coveo-tab-section'));
        this.manageTabSwapping();
        this.bindNukeEvents();
    }
    ResponsiveTabs.init = function (root, component, options) {
        this.logger = new Logger_1.Logger('ResponsiveTabs');
        if (!Dom_1.$$(root).find('.coveo-tab-section')) {
            this.logger.info('No element with class coveo-tab-section. Responsive tabs cannot be enabled.');
            return;
        }
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(ResponsiveTabs, Dom_1.$$(root), Tab_1.Tab.ID, component, options);
    };
    ResponsiveTabs.prototype.handleResizeEvent = function () {
        if (this.needSmallMode() && !ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)) {
            this.changeToSmallMode();
        }
        else if (!this.needSmallMode() && ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)) {
            this.changeToLargeMode();
        }
        var tabs = this.getTabsInTabSection();
        if (this.shouldAddTabsToDropdown()) {
            this.addTabsToDropdown(tabs);
        }
        else if (this.shouldRemoveTabsFromDropdown()) {
            this.removeTabsFromDropdown(tabs);
        }
        if (this.dropdownHeader.hasClass('coveo-dropdown-header-active')) {
            this.positionPopup();
        }
    };
    ResponsiveTabs.prototype.needSmallMode = function () {
        var mediumWidth = this.searchInterface
            ? this.searchInterface.responsiveComponents.getMediumScreenWidth()
            : new ResponsiveComponents_1.ResponsiveComponents().getMediumScreenWidth();
        if (this.coveoRoot.width() <= mediumWidth) {
            return true;
        }
        else if (!ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)) {
            return this.isOverflowing(this.tabSection.el);
        }
        else {
            return this.isLargeFormatOverflowing();
        }
    };
    ResponsiveTabs.prototype.changeToSmallMode = function () {
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.activateSmallTabs(this.coveoRoot);
    };
    ResponsiveTabs.prototype.changeToLargeMode = function () {
        this.emptyDropdown();
        this.cleanUpDropdown();
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.deactivateSmallTabs(this.coveoRoot);
    };
    ResponsiveTabs.prototype.shouldAddTabsToDropdown = function () {
        return this.isOverflowing(this.tabSection.el) && ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot);
    };
    ResponsiveTabs.prototype.addTabsToDropdown = function (tabs) {
        var currentTab;
        if (!this.tabSection.find('.coveo-tab-dropdown-header')) {
            var facetDropdownHeader = this.tabSection.find('.coveo-facet-dropdown-header');
            if (facetDropdownHeader) {
                this.dropdownHeader.insertBefore(facetDropdownHeader);
            }
            else {
                this.tabSection.el.appendChild(this.dropdownHeader.el);
            }
        }
        for (var i = tabs.length - 1; i >= 0; i--) {
            currentTab = tabs[i];
            if (Dom_1.$$(currentTab).hasClass('coveo-selected') && i > 0) {
                currentTab = tabs[--i];
            }
            this.addToDropdown(currentTab);
            if (!this.isOverflowing(this.tabSection.el)) {
                break;
            }
        }
    };
    ResponsiveTabs.prototype.shouldRemoveTabsFromDropdown = function () {
        return (!this.isOverflowing(this.tabSection.el) && ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot) && !this.isDropdownEmpty());
    };
    ResponsiveTabs.prototype.removeTabsFromDropdown = function (tabs) {
        var dropdownTabs = this.dropdownContent.findAll('.coveo-tab-dropdown');
        var lastTabInSection, current;
        if (tabs) {
            lastTabInSection = tabs.pop();
        }
        while (!this.isOverflowing(this.tabSection.el) && !this.isDropdownEmpty()) {
            current = dropdownTabs.shift();
            this.removeFromDropdown(current);
            this.fromDropdownToTabSection(Dom_1.$$(current), lastTabInSection);
            lastTabInSection = _.clone(current);
        }
        if (this.isOverflowing(this.tabSection.el)) {
            var tabs_1 = this.getTabsInTabSection();
            this.addToDropdown(tabs_1.pop());
        }
        if (this.isDropdownEmpty()) {
            this.cleanUpDropdown();
        }
    };
    ResponsiveTabs.prototype.emptyDropdown = function () {
        if (!this.isDropdownEmpty()) {
            var dropdownTabs = this.dropdownContent.findAll('.coveo-tab-dropdown');
            var tabs = this.getTabsInTabSection();
            var lastTabInSection = void 0;
            if (tabs) {
                lastTabInSection = tabs.pop();
            }
            while (!this.isDropdownEmpty()) {
                var current = dropdownTabs.shift();
                this.removeFromDropdown(current);
                Dom_1.$$(current).insertBefore(this.dropdownHeader.el);
                this.fromDropdownToTabSection(Dom_1.$$(current), lastTabInSection);
                lastTabInSection = _.clone(current);
            }
        }
    };
    ResponsiveTabs.prototype.isLargeFormatOverflowing = function () {
        var virtualTabSection = Dom_1.$$(this.tabSection.el.cloneNode(true));
        var dropdownHeader = virtualTabSection.find('.coveo-tab-dropdown-header');
        if (dropdownHeader) {
            virtualTabSection.el.removeChild(dropdownHeader);
        }
        virtualTabSection.el.style.position = 'absolute';
        virtualTabSection.el.style.visibility = 'hidden';
        if (!this.isDropdownEmpty()) {
            _.each(this.dropdownContent.findAll('.CoveoTab'), function (tab) {
                virtualTabSection.el.appendChild(tab.cloneNode(true));
            });
        }
        virtualTabSection.insertBefore(this.tabSection.el);
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.deactivateSmallTabs(this.coveoRoot);
        var isOverflowing = this.isOverflowing(this.tabSection.el) || this.isOverflowing(virtualTabSection.el);
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.activateSmallTabs(this.coveoRoot);
        virtualTabSection.detach();
        return isOverflowing;
    };
    ResponsiveTabs.prototype.isOverflowing = function (el) {
        return el.clientWidth < el.scrollWidth;
    };
    ResponsiveTabs.prototype.buildDropdownHeader = function () {
        var dropdownHeader = Dom_1.$$('a', { className: 'coveo-dropdown-header coveo-tab-dropdown-header' });
        var content = Dom_1.$$('p');
        content.text(this.dropdownHeaderLabel);
        var icon = Dom_1.$$('span', { className: 'coveo-more-tabs' }, SVGIcons_1.SVGIcons.icons.arrowDown);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, 'coveo-more-tabs-svg');
        content.el.appendChild(icon.el);
        dropdownHeader.el.appendChild(content.el);
        return dropdownHeader;
    };
    ResponsiveTabs.prototype.bindDropdownHeaderEvents = function () {
        var _this = this;
        this.dropdownHeader.on('click', function () {
            if (!_this.dropdownHeader.hasClass('coveo-dropdown-header-active')) {
                _this.positionPopup();
                _this.dropdownHeader.addClass('coveo-dropdown-header-active');
            }
            else {
                _this.closeDropdown();
            }
        });
    };
    ResponsiveTabs.prototype.buildDropdownContent = function () {
        var dropdownContent = Dom_1.$$('div', {
            className: 'coveo-tab-list-container ' + SearchInterface_1.SearchInterface.SMALL_INTERFACE_CLASS_NAME
        });
        var contentList = Dom_1.$$('ol', { className: 'coveo-tab-list' });
        dropdownContent.el.appendChild(contentList.el);
        return dropdownContent;
    };
    ResponsiveTabs.prototype.bindDropdownContentEvents = function () {
        var _this = this;
        this.documentClickListener = function (event) {
            if (Utils_1.Utils.isHtmlElement(event.target)) {
                var eventTarget = Dom_1.$$(event.target);
                if (!eventTarget.closest('coveo-tab-list-container') &&
                    !eventTarget.closest('coveo-tab-dropdown-header') &&
                    !eventTarget.closest('coveo-tab-dropdown')) {
                    _this.closeDropdown();
                }
            }
        };
        Dom_1.$$(document.documentElement).on('click', this.documentClickListener);
    };
    ResponsiveTabs.prototype.closeDropdown = function () {
        this.dropdownContent.detach();
        this.dropdownHeader.removeClass('coveo-dropdown-header-active');
    };
    ResponsiveTabs.prototype.addToDropdown = function (el) {
        if (this.dropdownContent) {
            Dom_1.$$(el).addClass('coveo-tab-dropdown');
            var list = this.dropdownContent.find('ol');
            var listElement = Dom_1.$$('li');
            listElement.el.appendChild(el);
            Dom_1.$$(list).prepend(listElement.el);
        }
    };
    ResponsiveTabs.prototype.removeFromDropdown = function (el) {
        if (this.dropdownContent) {
            Dom_1.$$(el).removeClass('coveo-tab-dropdown');
            Dom_1.$$(el.parentElement).detach();
        }
    };
    ResponsiveTabs.prototype.cleanUpDropdown = function () {
        this.dropdownHeader.removeClass('coveo-dropdown-header-active');
        this.dropdownHeader.detach();
        this.dropdownContent.detach();
    };
    ResponsiveTabs.prototype.isDropdownEmpty = function () {
        if (this.dropdownContent) {
            var tabs = this.dropdownContent.findAll('.CoveoTab');
            return tabs.length == 0;
        }
        return false;
    };
    ResponsiveTabs.prototype.manageTabSwapping = function () {
        var _this = this;
        _.each(this.coveoRoot.findAll('.' + Component_1.Component.computeCssClassNameForType(this.ID)), function (tabElement) {
            var tab = Dom_1.$$(tabElement);
            var fadeOutFadeIn = function (event) {
                var tabsInSection = _this.getTabsInTabSection();
                var lastTabInSection = tabsInSection.pop();
                var lastTabSectionSibling = lastTabInSection.previousSibling;
                if (event.propertyName == 'opacity') {
                    if (tab.el.style.opacity == '0') {
                        Dom_1.$$(lastTabInSection).addClass('coveo-tab-dropdown');
                        tab.replaceWith(lastTabInSection);
                        tab.removeClass('coveo-tab-dropdown');
                        _this.fromDropdownToTabSection(tab, lastTabSectionSibling);
                        // Because of the DOM manipulation, sometimes the animation will not trigger. Accessing the computed styles makes sure
                        // the animation will happen.
                        window.getComputedStyle(tab.el).opacity;
                        window.getComputedStyle(lastTabInSection).opacity;
                        tab.el.style.opacity = lastTabInSection.style.opacity = '1';
                    }
                    else if (tab.el.style.opacity == '1') {
                        _this.closeDropdown();
                        EventsUtils_1.EventsUtils.removePrefixedEvent(tab.el, 'TransitionEnd', fadeOutFadeIn);
                        _this.handleResizeEvent();
                    }
                }
            };
            tab.on('click', function () {
                if (tab.hasClass('coveo-tab-dropdown')) {
                    var tabsInSection = _this.getTabsInTabSection();
                    var lastTabInSection = tabsInSection.pop();
                    if (lastTabInSection) {
                        EventsUtils_1.EventsUtils.addPrefixedEvent(tab.el, 'TransitionEnd', fadeOutFadeIn);
                        tab.el.style.opacity = lastTabInSection.style.opacity = '0';
                    }
                }
            });
        });
    };
    ResponsiveTabs.prototype.bindNukeEvents = function () {
        var _this = this;
        Dom_1.$$(this.coveoRoot).on(InitializationEvents_1.InitializationEvents.nuke, function () {
            Dom_1.$$(document.documentElement).off('click', _this.documentClickListener);
        });
    };
    ResponsiveTabs.prototype.positionPopup = function () {
        PopupUtils_1.PopupUtils.positionPopup(this.dropdownContent.el, this.dropdownHeader.el, this.coveoRoot.el, { horizontal: PopupUtils_1.PopupHorizontalAlignment.INNERRIGHT, vertical: PopupUtils_1.PopupVerticalAlignment.BOTTOM }, this.coveoRoot.el);
    };
    ResponsiveTabs.prototype.getTabsInTabSection = function () {
        var _this = this;
        var tabsInSection = [];
        _.each(this.tabSection.el.children, function (childElement) {
            if (Utils_1.Utils.isHtmlElement(childElement)) {
                var child = Dom_1.$$(childElement);
                if (!child.hasClass('coveo-tab-dropdown') && child.hasClass(Component_1.Component.computeCssClassNameForType(_this.ID))) {
                    tabsInSection.push(child.el);
                }
            }
        });
        return tabsInSection;
    };
    ResponsiveTabs.prototype.fromDropdownToTabSection = function (tab, lastTabInTabSection) {
        if (lastTabInTabSection) {
            tab.insertAfter(lastTabInTabSection);
        }
        else {
            this.tabSection.prepend(tab.el);
        }
    };
    ResponsiveTabs.prototype.getDropdownHeaderLabel = function () {
        var dropdownHeaderLabel;
        _.each(Dom_1.$$(this.coveoRoot.find('.coveo-tab-section')).findAll('.' + Component_1.Component.computeCssClassName(Tab_1.Tab)), function (tabElement) {
            var tab = Component_1.Component.get(tabElement, Tab_1.Tab);
            if (!dropdownHeaderLabel && tab.options.dropdownHeaderLabel) {
                dropdownHeaderLabel = tab.options.dropdownHeaderLabel;
            }
        });
        if (!dropdownHeaderLabel) {
            dropdownHeaderLabel = Strings_1.l(ResponsiveTabs.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE);
        }
        return dropdownHeaderLabel;
    };
    ResponsiveTabs.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE = 'More';
    return ResponsiveTabs;
}());
exports.ResponsiveTabs = ResponsiveTabs;


/***/ }),

/***/ 432:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 433:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 74:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var InitializationEvents_1 = __webpack_require__(15);
var Component_1 = __webpack_require__(6);
var SearchInterface_1 = __webpack_require__(17);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var QueryEvents_1 = __webpack_require__(10);
var Logger_1 = __webpack_require__(11);
var ResponsiveComponentsManager = /** @class */ (function () {
    function ResponsiveComponentsManager(root) {
        var _this = this;
        this.disabledComponents = [];
        this.responsiveComponents = [];
        this.coveoRoot = root;
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.dropdownHeadersWrapper = Dom_1.$$('div', {
            className: ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS
        });
        this.searchBoxElement = this.getSearchBoxElement();
        this.logger = new Logger_1.Logger(this);
        this.resizeListener = function () {
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
                _this.logger
                    .warn("The width of the search interface is 0, cannot dispatch resize events to responsive components. This means that the tabs will not\n        automatically fit in the tab section. Also, the facet and recommendation component will not hide in a menu. Could the search\n        interface display property be none? Could its visibility property be set to hidden? Also, if either of these scenarios happen during\n        loading, it could be the cause of this issue.");
            }
        };
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
            // If the interface gets nuked, we need to remove all reference to componentManagers stored which match the current search interface
            ResponsiveComponentsManager.componentManagers = _.filter(ResponsiveComponentsManager.componentManagers, function (manager) { return manager.coveoRoot.el != _this.coveoRoot.el; });
        });
    };
    ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS = 'coveo-dropdown-header-wrapper';
    ResponsiveComponentsManager.componentManagers = [];
    ResponsiveComponentsManager.remainingComponentInitializations = 0;
    ResponsiveComponentsManager.componentInitializations = [];
    return ResponsiveComponentsManager;
}());
exports.ResponsiveComponentsManager = ResponsiveComponentsManager;


/***/ }),

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveDropdownContent_1 = __webpack_require__(145);
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


/***/ })

});
//# sourceMappingURL=Tab__119648951d2af823e366.js.map