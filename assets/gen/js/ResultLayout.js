webpackJsonpCoveo__temporary([15],{

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

/***/ 255:
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
var ComponentOptions_1 = __webpack_require__(9);
var QueryEvents_1 = __webpack_require__(11);
var Initialization_1 = __webpack_require__(2);
var InitializationEvents_1 = __webpack_require__(17);
var Assert_1 = __webpack_require__(7);
var ResultListEvents_1 = __webpack_require__(32);
var ResultLayoutEvents_1 = __webpack_require__(103);
var Dom_1 = __webpack_require__(3);
var QueryStateModel_1 = __webpack_require__(13);
var Model_1 = __webpack_require__(18);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var KeyboardUtils_1 = __webpack_require__(23);
var ResponsiveResultLayout_1 = __webpack_require__(653);
var Utils_1 = __webpack_require__(5);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
var Strings_1 = __webpack_require__(10);
__webpack_require__(608);
var SVGIcons_1 = __webpack_require__(15);
var SVGDom_1 = __webpack_require__(16);
exports.defaultLayout = 'list';
/**
 * The ResultLayout component allows the end user to switch between multiple {@link ResultList} components that have
 * different {@link ResultList.options.layout} values.
 *
 * This component automatically populates itself with buttons to switch between the ResultList components that have a
 * valid layout value (see the {@link ValidLayout} type).
 *
 * See also the [Result Layouts](https://developers.coveo.com/x/yQUvAg) documentation.
 */
var ResultLayout = (function (_super) {
    __extends(ResultLayout, _super);
    /**
     * Creates a new ResultLayout component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the ResultLayout component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function ResultLayout(element, options, bindings) {
        var _this = _super.call(this, element, ResultLayout.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultLayout, options);
        _this.currentActiveLayouts = {};
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.LAYOUT, _this.handleQueryStateChanged.bind(_this));
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function (args) { return _this.handleQueryError(args); });
        _this.resultLayoutSection = Dom_1.$$(_this.element).closest('.coveo-result-layout-section');
        _this.bind.oneRootElement(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () { return _this.populate(); });
        _this.bind.oneRootElement(InitializationEvents_1.InitializationEvents.afterInitialization, function () { return _this.handleQueryStateChanged(); });
        ResponsiveResultLayout_1.ResponsiveResultLayout.init(_this.root, _this, _this.options);
        return _this;
    }
    /**
     * Changes the current layout.
     *
     * Also logs a `resultLayoutChange` event in the usage analytics with the new layout as metadeta.
     *
     * Triggers a new query.
     *
     * @param layout The new layout. The page must contain a valid {@link ResultList} component with a matching
     * {@link ResultList.options.layout} value for this method to work.
     */
    ResultLayout.prototype.changeLayout = function (layout) {
        Assert_1.Assert.check(this.isLayoutDisplayedByButton(layout), 'Layout not available or invalid');
        if (layout !== this.currentLayout || this.getModelValue() === '') {
            this.setModelValue(layout);
            var lastResults = this.queryController.getLastResults();
            this.setLayout(layout, lastResults);
            if (lastResults) {
                this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.resultsLayoutChange, {
                    resultsLayoutChangeTo: layout
                }, this.element);
            }
            else {
                this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.resultsLayoutChange, {
                    resultsLayoutChangeTo: layout
                });
                this.queryController.executeQuery();
            }
        }
    };
    /**
     * Gets the current layout (`list`, `card` or `table`).
     * @returns {string} The current current layout.
     */
    ResultLayout.prototype.getCurrentLayout = function () {
        return this.currentLayout;
    };
    ResultLayout.prototype.disableLayouts = function (layouts) {
        var _this = this;
        if (Utils_1.Utils.isNonEmptyArray(layouts)) {
            _.each(layouts, function (layout) { return _this.disableLayout(layout); });
            var remainingValidLayouts = _.difference(_.keys(this.currentActiveLayouts), layouts);
            if (!_.isEmpty(remainingValidLayouts)) {
                var newLayout = _.contains(remainingValidLayouts, this.currentLayout) ? this.currentLayout : remainingValidLayouts[0];
                this.changeLayout(newLayout);
            }
            else {
                this.logger.error('Cannot disable the last valid layout ... Re-enabling the first one possible');
                var firstPossibleValidLayout = _.keys(this.currentActiveLayouts)[0];
                this.enableLayout(firstPossibleValidLayout);
                this.setLayout(firstPossibleValidLayout);
            }
        }
    };
    ResultLayout.prototype.enableLayouts = function (layouts) {
        var _this = this;
        _.each(layouts, function (layout) {
            _this.enableLayout(layout);
        });
    };
    ResultLayout.prototype.disableLayout = function (layout) {
        if (this.isLayoutDisplayedByButton(layout)) {
            this.hideButton(layout);
        }
    };
    ResultLayout.prototype.enableLayout = function (layout) {
        if (this.isLayoutDisplayedByButton(layout)) {
            this.showButton(layout);
            this.updateSelectorAppearance();
        }
    };
    ResultLayout.prototype.hideButton = function (layout) {
        if (this.isLayoutDisplayedByButton(layout)) {
            var btn = this.currentActiveLayouts[layout].button;
            Dom_1.$$(btn.el).addClass('coveo-hidden');
            btn.visible = false;
            this.updateSelectorAppearance();
        }
    };
    ResultLayout.prototype.showButton = function (layout) {
        if (this.isLayoutDisplayedByButton(layout)) {
            var btn = this.currentActiveLayouts[layout].button;
            Dom_1.$$(btn.el).removeClass('coveo-hidden');
            btn.visible = true;
        }
    };
    ResultLayout.prototype.setLayout = function (layout, results) {
        if (layout) {
            this.isLayoutDisplayedByButton(layout);
            if (this.currentLayout) {
                Dom_1.$$(this.currentActiveLayouts[this.currentLayout].button.el).removeClass('coveo-selected');
            }
            Dom_1.$$(this.currentActiveLayouts[layout].button.el).addClass('coveo-selected');
            this.currentLayout = layout;
            Dom_1.$$(this.element).trigger(ResultListEvents_1.ResultListEvents.changeLayout, {
                layout: layout,
                results: results
            });
        }
    };
    ResultLayout.prototype.handleQuerySuccess = function (args) {
        this.hasNoResults = args.results.results.length == 0;
        if (this.shouldShowSelector()) {
            this.show();
        }
        else {
            this.hide();
        }
    };
    ResultLayout.prototype.handleQueryStateChanged = function (args) {
        var modelLayout = this.getModelValue();
        var newLayout = _.find(_.keys(this.currentActiveLayouts), function (l) { return l === modelLayout; });
        if (newLayout !== undefined) {
            this.setLayout(newLayout);
        }
        else {
            this.setLayout(_.keys(this.currentActiveLayouts)[0]);
        }
    };
    ResultLayout.prototype.handleQueryError = function (args) {
        this.hide();
    };
    ResultLayout.prototype.updateSelectorAppearance = function () {
        if (this.shouldShowSelector()) {
            this.show();
        }
        else {
            this.hide();
        }
    };
    ResultLayout.prototype.populate = function () {
        var _this = this;
        var populateArgs = { layouts: [] };
        Dom_1.$$(this.root).trigger(ResultLayoutEvents_1.ResultLayoutEvents.populateResultLayout, populateArgs);
        _.each(populateArgs.layouts, function (layout) { return Assert_1.Assert.check(_.contains(ResultLayout.validLayouts, layout), 'Invalid layout'); });
        if (!_.isEmpty(populateArgs.layouts)) {
            _.each(populateArgs.layouts, function (layout) { return _this.addButton(layout); });
            if (!this.shouldShowSelector()) {
                this.hide();
            }
        }
    };
    ResultLayout.prototype.addButton = function (layout) {
        var _this = this;
        var btn = Dom_1.$$('span', {
            className: 'coveo-result-layout-selector',
            tabindex: 0
        }, Dom_1.$$('span', { className: 'coveo-result-layout-selector-caption' }, Strings_1.l(layout)));
        var icon = Dom_1.$$('span', { className: "coveo-icon coveo-" + layout + "-layout-icon" }, SVGIcons_1.SVGIcons.icons[layout + "Layout"]);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, "coveo-" + layout + "-svg");
        btn.prepend(icon.el);
        if (layout === this.currentLayout) {
            btn.addClass('coveo-selected');
        }
        var activateAction = function () { return _this.changeLayout(layout); };
        btn.on('click', activateAction);
        btn.on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, activateAction));
        Dom_1.$$(this.element).append(btn.el);
        this.currentActiveLayouts[layout] = {
            button: {
                visible: true,
                el: btn.el
            },
            enabled: true
        };
    };
    ResultLayout.prototype.hide = function () {
        var elem = this.resultLayoutSection || this.element;
        Dom_1.$$(elem).addClass('coveo-result-layout-hidden');
    };
    ResultLayout.prototype.show = function () {
        var elem = this.resultLayoutSection || this.element;
        Dom_1.$$(elem).removeClass('coveo-result-layout-hidden');
    };
    ResultLayout.prototype.getModelValue = function () {
        return this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.layout);
    };
    ResultLayout.prototype.setModelValue = function (val) {
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.layout, val);
    };
    ResultLayout.prototype.shouldShowSelector = function () {
        return _.keys(this.currentActiveLayouts).length > 1 &&
            _.filter(this.currentActiveLayouts, function (activeLayout) { return activeLayout.button.visible; }).length > 1 &&
            !this.hasNoResults;
    };
    ResultLayout.prototype.isLayoutDisplayedByButton = function (layout) {
        return _.contains(_.keys(this.currentActiveLayouts), layout);
    };
    return ResultLayout;
}(Component_1.Component));
ResultLayout.ID = 'ResultLayout';
ResultLayout.doExport = function () {
    GlobalExports_1.exportGlobally({
        'ResultLayout': ResultLayout
    });
};
ResultLayout.validLayouts = ['list', 'card', 'table'];
ResultLayout.options = {
    /**
     * Specifies the layouts that should be available when the search page is displayed in mobile mode.
     *
     * By default, the mobile mode breakpoint is at 480 px screen width.
     *
     * When the breakpoint is reached, layouts that are not specified becomes inactive and the linked result list will be disabled.
     *
     * The possible values for layouts are `list`, `card`, `table`.
     *
     * The default value is `card`, `table`.
     */
    mobileLayouts: ComponentOptions_1.ComponentOptions.buildListOption({ defaultValue: ['card', 'table'] }),
    /**
     * Specifies the layouts that should be available when the search page is displayed in tablet mode.
     *
     * By default, the tablet mode breakpoint is at 800 px screen width.
     *
     *  When the breakpoint is reached, layouts that are not specified becomes inactive and the linked result list will be disabled.
     *
     * The possible values for layouts are `list`, `card`, `table`.
     *
     * The default value is `list`, `card`, `table`.
     */
    tabletLayouts: ComponentOptions_1.ComponentOptions.buildListOption({ defaultValue: ['list', 'card', 'table'] }),
    /**
     * Specifies the layouts that should be available when the search page is displayed in desktop mode.
     *
     * By default, the desktop mode breakpoint is any screen size over 800 px.
     *
     *  When the breakpoint is reached, layouts that are not specified becomes inactive and the linked result list will be disabled.
     *
     * The possible values for layouts are `list`, `card`, `table`.
     *
     * The default value is `list`, `card`, `table`.
     */
    desktopLayouts: ComponentOptions_1.ComponentOptions.buildListOption({ defaultValue: ['list', 'card', 'table'] })
};
exports.ResultLayout = ResultLayout;
Initialization_1.Initialization.registerAutoCreateComponent(ResultLayout);


/***/ }),

/***/ 608:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 653:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveComponentsManager_1 = __webpack_require__(78);
var Dom_1 = __webpack_require__(3);
var Component_1 = __webpack_require__(8);
var ResultLayout_1 = __webpack_require__(255);
var Logger_1 = __webpack_require__(14);
var SearchInterface_1 = __webpack_require__(21);
var _ = __webpack_require__(1);
var ResponsiveResultLayout = (function () {
    function ResponsiveResultLayout(coveoRoot, ID, options, responsiveDropdown) {
        this.coveoRoot = coveoRoot;
        this.ID = ID;
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
    }
    ResponsiveResultLayout.init = function (root, component, options) {
        if (!Dom_1.$$(root).find("." + Component_1.Component.computeCssClassName(ResultLayout_1.ResultLayout))) {
            var logger = new Logger_1.Logger('ResponsiveResultLayout');
            logger.trace('No ResultLayout component found : Cannot instantiate ResponsiveResultLayout');
            return;
        }
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(ResponsiveResultLayout, Dom_1.$$(root), ResultLayout_1.ResultLayout.ID, component, options);
    };
    ResponsiveResultLayout.prototype.registerComponent = function (accept) {
        if (accept instanceof ResultLayout_1.ResultLayout) {
            this.resultLayout = accept;
            return true;
        }
        return false;
    };
    ResponsiveResultLayout.prototype.handleResizeEvent = function () {
        if (this.needSmallMode()) {
            this.enableAndDisableLayouts(this.resultLayout.options.mobileLayouts);
        }
        else if (this.needMediumMode()) {
            this.enableAndDisableLayouts(this.resultLayout.options.tabletLayouts);
        }
        else {
            this.enableAndDisableLayouts(this.resultLayout.options.desktopLayouts);
        }
    };
    ResponsiveResultLayout.prototype.enableAndDisableLayouts = function (validLayouts) {
        var layoutsToDisable = _.difference(ResultLayout_1.ResultLayout.validLayouts, validLayouts);
        var layoutsToEnable = _.intersection(ResultLayout_1.ResultLayout.validLayouts, validLayouts);
        this.resultLayout.disableLayouts(layoutsToDisable);
        this.resultLayout.enableLayouts(layoutsToEnable);
    };
    ResponsiveResultLayout.prototype.needSmallMode = function () {
        return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getSmallScreenWidth();
    };
    ResponsiveResultLayout.prototype.needMediumMode = function () {
        return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getMediumScreenWidth();
    };
    return ResponsiveResultLayout;
}());
exports.ResponsiveResultLayout = ResponsiveResultLayout;


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
//# sourceMappingURL=ResultLayout.js.map