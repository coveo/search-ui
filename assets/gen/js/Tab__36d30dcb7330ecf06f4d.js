webpackJsonpCoveo__temporary([26],{

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

/***/ 198:
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
__webpack_require__(668);
var underscore_1 = __webpack_require__(0);
var InitializationEvents_1 = __webpack_require__(17);
var QueryEvents_1 = __webpack_require__(11);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var SearchEndpoint_1 = __webpack_require__(50);
var AccessibleButton_1 = __webpack_require__(15);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var ResponsiveTabs_1 = __webpack_require__(669);
/**
 * The Tab component renders a widget that allows the end user to select a specific search interface.
 *
 * This component attaches itself to a `div` element. It is in charge of adding an advanced expression to the outgoing
 * query in order to refine the results.
 *
 * The Tab component can also hide and show different parts of the UI. For each individual component in the UI, you can
 * specify whether you wish to include or exclude that component when the user selects a certain Tab (see [Using Components
 * Only on Specific Tabs](https://docs.coveo.com/en/508/javascript-search-framework/using-components-only-on-specific-tabs)).
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
        new AccessibleButton_1.AccessibleButton()
            .withElement(element)
            .withSelectAction(function () { return _this.select(); })
            .withTitle(_this.options.caption)
            .withOwner(_this.bind)
            .build();
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
            var state = {
                t: this.options.id,
                sort: this.options.sort || QueryStateModel_1.QueryStateModel.defaultAttributes.sort
            };
            if (this.options.layout) {
                state.layout = this.options.layout;
            }
            this.queryStateModel.setMultiple(state);
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
        return ((includedTabs.length != 0 && underscore_1.indexOf(includedTabs, this.options.id) != -1) ||
            (excludedTabs.length != 0 && underscore_1.indexOf(excludedTabs, this.options.id) == -1) ||
            (includedTabs.length == 0 && excludedTabs.length == 0));
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
        underscore_1.each(Dom_1.$$(this.root).findAll('[data-tab],[data-tab-not]'), function (element) {
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
            underscore_1.each(showElements, function (elem) { return Dom_1.$$(elem).removeClass('coveo-tab-disabled'); });
            underscore_1.each(hideElements, function (elem) { return Dom_1.$$(elem).addClass('coveo-tab-disabled'); });
        });
    };
    Tab.prototype.splitListOfTabs = function (value) {
        if (Utils_1.Utils.exists(value)) {
            return underscore_1.map(value.split(','), function (tab) { return Utils_1.Utils.trim(tab); });
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
        underscore_1.each(Dom_1.$$(element).findAll('*'), function (el) {
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
        expression: ComponentOptions_1.ComponentOptions.buildQueryExpressionOption({ section: 'Common Options' }),
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
         * See also [Result Layouts](https://docs.coveo.com/en/360/).
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
         * Whether to filter out duplicates, so that items resembling one another only appear once in the query results.
         *
         * **Notes:**
         * - Two items must be at least 85% similar to one another to be considered duplicates.
         * - When a pair of duplicates is found, only the higher-ranked item of the two is kept in the result set.
         * - Enabling this feature can make the total result count less precise, as only the requested page of query results is submitted to duplicate filtering.
         * - The default value for this option can be modified through the {@link SearchInterface} component.
         */
        enableDuplicateFiltering: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies the name of the query pipeline to use for the queries when the Tab is selected.
         *
         * You can specify a value for this option if your index is in a Coveo Cloud organization in which pipelines have
         * been created (see [Adding and Managing Query Pipelines](https://docs.coveo.com/en/1791/)).
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
         * equivalent to 30 minutes (see [maximumAge](https://docs.coveo.com/en/1461/#RestQueryParameters-maximumAge)).
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
         *
         * @availablesince [October 2016 Release (v1.1550.5)](https://docs.coveo.com/en/309/#october-2016-release-v115505)
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

/***/ 668:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 669:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(670);
var underscore_1 = __webpack_require__(0);
var InitializationEvents_1 = __webpack_require__(17);
var Logger_1 = __webpack_require__(9);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var EventsUtils_1 = __webpack_require__(133);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var Component_1 = __webpack_require__(7);
var SearchInterface_1 = __webpack_require__(19);
var Tab_1 = __webpack_require__(198);
var ResponsiveComponents_1 = __webpack_require__(52);
var ResponsiveComponentsManager_1 = __webpack_require__(60);
var ResponsiveComponentsUtils_1 = __webpack_require__(126);
var AccessibleButton_1 = __webpack_require__(15);
var popper_js_1 = __webpack_require__(93);
var KeyboardUtils_1 = __webpack_require__(25);
var ResponsiveTabs = /** @class */ (function () {
    function ResponsiveTabs(coveoRoot, ID) {
        this.coveoRoot = coveoRoot;
        this.ID = ID;
        this.ignoreNextDocumentClick = false;
        this.dropdownHeaderLabel = this.getDropdownHeaderLabel();
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.dropdownContent = this.buildDropdownContent();
        this.dropdownHeader = this.buildDropdownHeader();
        this.bindDropdownContentEvents();
        this.bindDropdownHeaderEvents();
        this.tabSection = Dom_1.$$(this.coveoRoot.find('.coveo-tab-section'));
        this.manageTabSwapping();
        this.bindNukeEvents();
        this.initialTabOrder = this.tabsInTabSection.slice();
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
        if (this.shouldAddTabsToDropdown()) {
            this.addTabsToDropdown();
        }
        else if (this.shouldRemoveTabsFromDropdown()) {
            this.removeTabsFromDropdown();
        }
        if (this.isDropdownOpen()) {
            this.positionPopup();
        }
    };
    ResponsiveTabs.prototype.needSmallMode = function () {
        // Ignore everything if the responsiveMode is not auto.
        if (!this.searchInterface) {
            return this.shouldAutoModeResolveToSmall();
        }
        switch (this.searchInterface.responsiveComponents.getResponsiveMode()) {
            case 'small':
            case 'medium':
                return true;
            case 'auto':
            default:
                return this.shouldAutoModeResolveToSmall();
        }
    };
    ResponsiveTabs.prototype.shouldAutoModeResolveToSmall = function () {
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
        return ((this.isOverflowing(this.tabSection.el) || this.tabSection.el.clientWidth === 0) &&
            ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot));
    };
    ResponsiveTabs.prototype.addTabsToDropdown = function () {
        var currentTab;
        if (!this.tabSection.find("." + ResponsiveTabs.TAB_IN_DROPDOWN_HEADER_CSS_CLASS)) {
            var facetDropdownHeader = this.tabSection.find('.coveo-facet-dropdown-header');
            if (facetDropdownHeader) {
                this.dropdownHeader.insertBefore(facetDropdownHeader);
            }
            else {
                this.tabSection.el.appendChild(this.dropdownHeader.el);
            }
        }
        for (var i = this.initialTabOrder.length - 1; i >= 0; i--) {
            currentTab = this.initialTabOrder[i];
            if (this.tabIsSelected(currentTab) && i > 0) {
                currentTab = this.initialTabOrder[--i];
            }
            this.addToDropdownIfNeeded(currentTab);
            if (!this.isOverflowing(this.tabSection.el)) {
                break;
            }
        }
    };
    ResponsiveTabs.prototype.shouldRemoveTabsFromDropdown = function () {
        return (!this.isOverflowing(this.tabSection.el) &&
            this.tabSection.el.clientWidth !== 0 &&
            ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot) &&
            !this.isDropdownEmpty());
    };
    ResponsiveTabs.prototype.removeTabsFromDropdown = function () {
        var _this = this;
        var dropdownTabs = this.tabsInTabDropdown;
        var current;
        while (!this.isOverflowing(this.tabSection.el) && !this.isDropdownEmpty()) {
            current = dropdownTabs.shift();
            this.removeFromDropdownIfNeeded(current);
            this.fromDropdownToTabSection(Dom_1.$$(current));
        }
        if (this.isOverflowing(this.tabSection.el)) {
            var unselectedTabs = underscore_1.filter(this.tabsInTabSection, function (tab) { return !_this.tabIsSelected(tab); });
            this.addToDropdownIfNeeded(unselectedTabs.pop());
        }
        if (this.isDropdownEmpty()) {
            this.cleanUpDropdown();
        }
    };
    ResponsiveTabs.prototype.emptyDropdown = function () {
        var _this = this;
        if (!this.isDropdownEmpty()) {
            var dropdownTabs = this.tabsInTabDropdown;
            while (!this.isDropdownEmpty()) {
                var current = dropdownTabs.shift();
                this.removeFromDropdownIfNeeded(current);
            }
            this.initialTabOrder.forEach(function (tab) { return _this.tabSection.append(tab); });
        }
    };
    ResponsiveTabs.prototype.isLargeFormatOverflowing = function () {
        var virtualTabSection = Dom_1.$$(this.tabSection.el.cloneNode(true));
        var dropdownHeader = virtualTabSection.find("." + ResponsiveTabs.TAB_IN_DROPDOWN_HEADER_CSS_CLASS);
        if (dropdownHeader) {
            virtualTabSection.el.removeChild(dropdownHeader);
        }
        virtualTabSection.el.style.position = 'absolute';
        virtualTabSection.el.style.visibility = 'hidden';
        if (!this.isDropdownEmpty()) {
            underscore_1.each(this.dropdownContent.findAll('.CoveoTab'), function (tab) {
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
        var dropdownHeader = Dom_1.$$('a', { className: "coveo-dropdown-header " + ResponsiveTabs.TAB_IN_DROPDOWN_HEADER_CSS_CLASS });
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
        var toggle = function (event) {
            if (_this.isDropdownOpen()) {
                _this.closeDropdown();
            }
            else {
                _this.openDropdown();
            }
            if (event.type === 'click') {
                _this.ignoreNextDocumentClick = true;
            }
        };
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.dropdownHeader)
            .withSelectAction(toggle)
            .withLabel(this.getDropdownHeaderLabel())
            .build();
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
        this.dropdownClickListener = function () {
            if (_this.isDropdownOpen()) {
                _this.ignoreNextDocumentClick = true;
            }
        };
        this.documentClickListener = function (event) {
            if (!_this.ignoreNextDocumentClick) {
                _this.closeDropdown();
            }
            _this.ignoreNextDocumentClick = false;
        };
        Dom_1.$$(this.dropdownHeader).on('click', this.dropdownClickListener);
        Dom_1.$$(this.dropdownContent).on('click', this.dropdownClickListener);
    };
    ResponsiveTabs.prototype.isDropdownOpen = function () {
        return this.dropdownHeader.hasClass(ResponsiveTabs.ACTIVE_DROPDOWN_CSS_CLASS);
    };
    ResponsiveTabs.prototype.closeDropdown = function () {
        Dom_1.$$(document.documentElement).off('click', this.documentClickListener);
        this.dropdownContent.detach();
        this.dropdownHeader.removeClass(ResponsiveTabs.ACTIVE_DROPDOWN_CSS_CLASS);
    };
    ResponsiveTabs.prototype.openDropdown = function () {
        Dom_1.$$(document.documentElement).on('click', this.documentClickListener);
        this.positionPopup();
        this.dropdownHeader.addClass(ResponsiveTabs.ACTIVE_DROPDOWN_CSS_CLASS);
    };
    ResponsiveTabs.prototype.addToDropdownIfNeeded = function (tab) {
        if (!this.canAddTabToDropdown(tab)) {
            return;
        }
        Dom_1.$$(tab).addClass(ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);
        var list = Dom_1.$$(this.dropdownContent.find('ol'));
        var listElement = Dom_1.$$('li', null, tab);
        list.prepend(listElement.el);
    };
    ResponsiveTabs.prototype.removeFromDropdownIfNeeded = function (tab) {
        if (!this.canRemoveTabFromDropdown(tab)) {
            return;
        }
        Dom_1.$$(tab).removeClass(ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);
        Dom_1.$$(tab.parentElement).detach();
    };
    ResponsiveTabs.prototype.canAddTabToDropdown = function (tab) {
        return tab && !this.tabIsInDropdown(tab) && this.dropdownHeader;
    };
    ResponsiveTabs.prototype.canRemoveTabFromDropdown = function (tab) {
        return tab && this.tabIsInDropdown(tab) && this.dropdownContent;
    };
    ResponsiveTabs.prototype.cleanUpDropdown = function () {
        this.dropdownHeader.removeClass(ResponsiveTabs.ACTIVE_DROPDOWN_CSS_CLASS);
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
        underscore_1.each(this.coveoRoot.findAll('.' + Component_1.Component.computeCssClassNameForType(this.ID)), function (tabElement) {
            var tab = Dom_1.$$(tabElement);
            var fadeOutFadeIn = function (event) {
                var lastTabInSection = _this.tabsInTabSection.pop();
                if (event.propertyName == 'opacity') {
                    if (tab.el.style.opacity == '0') {
                        Dom_1.$$(lastTabInSection).addClass(ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);
                        tab.replaceWith(lastTabInSection);
                        tab.removeClass(ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);
                        _this.fromDropdownToTabSection(tab);
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
            var swapOnSelect = function () {
                if (_this.tabIsInDropdown(tab)) {
                    var lastTabInSection = _this.tabsInTabSection.pop();
                    if (lastTabInSection) {
                        EventsUtils_1.EventsUtils.addPrefixedEvent(tab.el, 'TransitionEnd', fadeOutFadeIn);
                        tab.el.style.opacity = lastTabInSection.style.opacity = '0';
                    }
                }
            };
            tab.on('click', function () { return swapOnSelect(); });
            tab.on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, swapOnSelect));
            tab.on('blur', function (e) {
                if (e.relatedTarget && !_this.tabIsInDropdown(e.relatedTarget)) {
                    _this.closeDropdown();
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
        this.dropdownContent.insertAfter(this.dropdownHeader.el);
        new popper_js_1.default(this.dropdownHeader.el, this.dropdownContent.el, {
            modifiers: {
                preventOverflow: {
                    boundariesElement: this.coveoRoot.el
                }
            }
        });
    };
    ResponsiveTabs.prototype.fromDropdownToTabSection = function (tab) {
        var lastTabInTabSection = underscore_1.last(this.tabsInTabSection);
        if (!lastTabInTabSection) {
            this.tabSection.prepend(tab.el);
            return;
        }
        var comesAfterInitialTabOrder = this.initialTabOrder.indexOf(tab.el) > this.initialTabOrder.indexOf(lastTabInTabSection);
        if (comesAfterInitialTabOrder) {
            tab.insertAfter(lastTabInTabSection);
        }
        else {
            tab.insertBefore(lastTabInTabSection);
        }
    };
    ResponsiveTabs.prototype.getDropdownHeaderLabel = function () {
        var dropdownHeaderLabel;
        underscore_1.each(Dom_1.$$(this.coveoRoot.find('.coveo-tab-section')).findAll('.' + Component_1.Component.computeCssClassName(Tab_1.Tab)), function (tabElement) {
            var tab = Component_1.Component.get(tabElement, Tab_1.Tab);
            if (!dropdownHeaderLabel && tab && tab.options.dropdownHeaderLabel) {
                dropdownHeaderLabel = tab.options.dropdownHeaderLabel;
            }
        });
        if (!dropdownHeaderLabel) {
            dropdownHeaderLabel = Strings_1.l(ResponsiveTabs.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE);
        }
        return dropdownHeaderLabel;
    };
    ResponsiveTabs.prototype.tabIsSelected = function (tab) {
        return Dom_1.$$(tab).hasClass('coveo-selected');
    };
    ResponsiveTabs.prototype.tabIsInDropdown = function (tab) {
        return Dom_1.$$(tab).hasClass(ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);
    };
    Object.defineProperty(ResponsiveTabs.prototype, "tabsInTabSection", {
        get: function () {
            var _this = this;
            var tabsInSection = [];
            underscore_1.each(this.tabSection.children(), function (childElement) {
                if (Utils_1.Utils.isHtmlElement(childElement)) {
                    var child = Dom_1.$$(childElement);
                    var childHasTabCssClassName = child.hasClass(Component_1.Component.computeCssClassNameForType(_this.ID));
                    if (!_this.tabIsInDropdown(child) && childHasTabCssClassName) {
                        tabsInSection.push(child.el);
                    }
                }
            });
            return tabsInSection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponsiveTabs.prototype, "tabsInTabDropdown", {
        get: function () {
            if (!this.dropdownContent) {
                return [];
            }
            return this.dropdownContent.findAll("." + ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);
        },
        enumerable: true,
        configurable: true
    });
    ResponsiveTabs.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE = 'More';
    ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS = 'coveo-tab-dropdown';
    ResponsiveTabs.TAB_IN_DROPDOWN_HEADER_CSS_CLASS = ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS + "-header";
    ResponsiveTabs.ACTIVE_DROPDOWN_CSS_CLASS = 'coveo-dropdown-header-active';
    return ResponsiveTabs;
}());
exports.ResponsiveTabs = ResponsiveTabs;


/***/ }),

/***/ 670:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Tab__36d30dcb7330ecf06f4d.js.map