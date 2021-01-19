webpackJsonpCoveo__temporary([40],{

/***/ 197:
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
__webpack_require__(655);
var underscore_1 = __webpack_require__(0);
var InitializationEvents_1 = __webpack_require__(17);
var QueryEvents_1 = __webpack_require__(11);
var ResultLayoutEvents_1 = __webpack_require__(129);
var ResultListEvents_1 = __webpack_require__(29);
var Assert_1 = __webpack_require__(5);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var ResponsiveResultLayout_1 = __webpack_require__(656);
var AccessibleButton_1 = __webpack_require__(15);
exports.defaultLayout = 'list';
/**
 * The ResultLayoutSelector component allows the end user to switch between multiple {@link ResultList} components that have
 * different {@link ResultList.options.layout} values.
 *
 * This component automatically populates itself with buttons to switch between the ResultList components that have a
 * valid layout value (see the {@link ValidLayout} type).
 *
 * See also the [Result Layouts](https://docs.coveo.com/en/360/) documentation.
 *
 * @availablesince [February 2018 Release (v2.3826.10)](https://docs.coveo.com/en/410/#february-2018-release-v2382610)
 */
var ResultLayoutSelector = /** @class */ (function (_super) {
    __extends(ResultLayoutSelector, _super);
    /**
     * Creates a new ResultLayoutSelector component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the ResultLayout component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function ResultLayoutSelector(element, options, bindings) {
        var _this = _super.call(this, element, ResultLayoutSelector.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultLayoutSelector, options);
        _this.currentActiveLayouts = {};
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.LAYOUT, _this.handleQueryStateChanged.bind(_this));
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function (args) { return _this.handleQueryError(args); });
        _this.resultLayoutSection = Dom_1.$$(_this.element).closest('.coveo-result-layout-section');
        _this.bind.oneRootElement(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () { return _this.populate(); });
        _this.bind.oneRootElement(InitializationEvents_1.InitializationEvents.afterInitialization, function () { return _this.handleQueryStateChanged(); });
        ResponsiveResultLayout_1.ResponsiveResultLayout.init(_this.root, _this, {});
        return _this;
    }
    Object.defineProperty(ResultLayoutSelector.prototype, "activeLayouts", {
        get: function () {
            return this.currentActiveLayouts;
        },
        enumerable: true,
        configurable: true
    });
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
    ResultLayoutSelector.prototype.changeLayout = function (layout) {
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
                if (!this.queryController.firstQuery) {
                    this.queryController.executeQuery();
                }
            }
        }
    };
    /**
     * Gets the current layout (`list`, `card` or `table`).
     * @returns {string} The current current layout.
     */
    ResultLayoutSelector.prototype.getCurrentLayout = function () {
        return this.currentLayout;
    };
    ResultLayoutSelector.prototype.disableLayouts = function (layouts) {
        var _this = this;
        if (Utils_1.Utils.isNonEmptyArray(layouts)) {
            underscore_1.each(layouts, function (layout) { return _this.disableLayout(layout); });
            var remainingValidLayouts = underscore_1.difference(underscore_1.keys(this.currentActiveLayouts), layouts);
            if (!underscore_1.isEmpty(remainingValidLayouts)) {
                var newLayout = underscore_1.contains(remainingValidLayouts, this.currentLayout) ? this.currentLayout : remainingValidLayouts[0];
                this.changeLayout(newLayout);
            }
            else {
                this.logger.error('Cannot disable the last valid layout ... Re-enabling the first one possible');
                var firstPossibleValidLayout = underscore_1.keys(this.currentActiveLayouts)[0];
                this.enableLayout(firstPossibleValidLayout);
                this.setLayout(firstPossibleValidLayout);
            }
        }
    };
    ResultLayoutSelector.prototype.enableLayouts = function (layouts) {
        var _this = this;
        underscore_1.each(layouts, function (layout) {
            _this.enableLayout(layout);
        });
    };
    ResultLayoutSelector.prototype.disableLayout = function (layout) {
        if (this.isLayoutDisplayedByButton(layout)) {
            this.hideButton(layout);
        }
    };
    ResultLayoutSelector.prototype.enableLayout = function (layout) {
        var allResultLists = this.resultLists;
        var atLeastOneResultListCanShowLayout = underscore_1.find(allResultLists, function (resultList) { return resultList.options.layout == layout; });
        if (atLeastOneResultListCanShowLayout && this.isLayoutDisplayedByButton(layout)) {
            this.showButton(layout);
            this.updateSelectorAppearance();
        }
    };
    Object.defineProperty(ResultLayoutSelector.prototype, "resultLists", {
        get: function () {
            return this.searchInterface.getComponents('ResultList');
        },
        enumerable: true,
        configurable: true
    });
    ResultLayoutSelector.prototype.hideButton = function (layout) {
        if (this.isLayoutDisplayedByButton(layout)) {
            var btn = this.currentActiveLayouts[layout].button;
            Dom_1.$$(btn.el).addClass('coveo-hidden');
            btn.visible = false;
            this.updateSelectorAppearance();
        }
    };
    ResultLayoutSelector.prototype.showButton = function (layout) {
        if (this.isLayoutDisplayedByButton(layout)) {
            var btn = this.currentActiveLayouts[layout].button;
            Dom_1.$$(btn.el).removeClass('coveo-hidden');
            btn.visible = true;
        }
    };
    ResultLayoutSelector.prototype.setLayout = function (layout, results) {
        if (layout) {
            if (this.currentLayout) {
                Dom_1.$$(this.currentActiveLayouts[this.currentLayout].button.el).removeClass('coveo-selected');
                Dom_1.$$(this.currentActiveLayouts[this.currentLayout].button.el).setAttribute('aria-pressed', false.toString());
            }
            Dom_1.$$(this.currentActiveLayouts[layout].button.el).addClass('coveo-selected');
            Dom_1.$$(this.currentActiveLayouts[layout].button.el).setAttribute('aria-pressed', true.toString());
            this.currentLayout = layout;
            Dom_1.$$(this.element).trigger(ResultListEvents_1.ResultListEvents.changeLayout, {
                layout: layout,
                results: results
            });
        }
    };
    ResultLayoutSelector.prototype.handleQuerySuccess = function (args) {
        this.hasNoResults = args.results.results.length == 0;
        if (this.shouldShowSelector()) {
            this.show();
        }
        else {
            this.hide();
        }
    };
    ResultLayoutSelector.prototype.handleQueryStateChanged = function (args) {
        var modelLayout = this.getModelValue();
        var newLayout = underscore_1.find(underscore_1.keys(this.currentActiveLayouts), function (l) { return l === modelLayout; });
        if (newLayout !== undefined) {
            this.setLayout(newLayout);
        }
        else {
            this.setLayout(underscore_1.keys(this.currentActiveLayouts)[0]);
        }
    };
    ResultLayoutSelector.prototype.handleQueryError = function (args) {
        this.hasNoResults = true;
        this.hide();
    };
    ResultLayoutSelector.prototype.updateSelectorAppearance = function () {
        if (this.shouldShowSelector()) {
            this.show();
        }
        else {
            this.hide();
        }
    };
    ResultLayoutSelector.prototype.populate = function () {
        var _this = this;
        var populateArgs = { layouts: [] };
        Dom_1.$$(this.root).trigger(ResultLayoutEvents_1.ResultLayoutEvents.populateResultLayout, populateArgs);
        var layouts = underscore_1.uniq(populateArgs.layouts.map(function (layout) { return layout.toLowerCase(); }));
        underscore_1.each(layouts, function (layout) { return Assert_1.Assert.check(underscore_1.contains(ResultLayoutSelector.validLayouts, layout), 'Invalid layout'); });
        if (!underscore_1.isEmpty(layouts)) {
            underscore_1.each(layouts, function (layout) { return _this.addButton(layout); });
            if (!this.shouldShowSelector()) {
                this.hide();
            }
        }
    };
    ResultLayoutSelector.prototype.addButton = function (layout) {
        var _this = this;
        var btn = Dom_1.$$('span', {
            className: 'coveo-result-layout-selector'
        });
        var caption = Dom_1.$$('span', { className: 'coveo-result-layout-selector-caption' }, Strings_1.l(layout));
        btn.append(caption.el);
        var icon = Dom_1.$$('span', { className: "coveo-icon coveo-" + layout + "-layout-icon" }, SVGIcons_1.SVGIcons.icons[layout + "Layout"]);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, "coveo-" + layout + "-svg");
        btn.prepend(icon.el);
        var selectAction = function () { return _this.changeLayout(layout); };
        new AccessibleButton_1.AccessibleButton()
            .withElement(btn)
            .withLabel(Strings_1.l('DisplayResultsAs', Strings_1.l(layout)))
            .withSelectAction(selectAction)
            .withOwner(this.bind)
            .build();
        var isCurrentLayout = layout === this.currentLayout;
        btn.toggleClass('coveo-selected', isCurrentLayout);
        btn.setAttribute('aria-pressed', isCurrentLayout.toString());
        Dom_1.$$(this.element).append(btn.el);
        this.currentActiveLayouts[layout] = {
            button: {
                visible: true,
                el: btn.el
            },
            enabled: true
        };
    };
    ResultLayoutSelector.prototype.hide = function () {
        var elem = this.resultLayoutSection || this.element;
        Dom_1.$$(elem).addClass('coveo-result-layout-hidden');
    };
    ResultLayoutSelector.prototype.show = function () {
        var elem = this.resultLayoutSection || this.element;
        Dom_1.$$(elem).removeClass('coveo-result-layout-hidden');
    };
    ResultLayoutSelector.prototype.getModelValue = function () {
        return this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.layout);
    };
    ResultLayoutSelector.prototype.setModelValue = function (val) {
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.layout, val);
    };
    ResultLayoutSelector.prototype.shouldShowSelector = function () {
        return (underscore_1.keys(this.currentActiveLayouts).length > 1 &&
            underscore_1.filter(this.currentActiveLayouts, function (activeLayout) { return activeLayout.button.visible; }).length > 1 &&
            !this.hasNoResults);
    };
    ResultLayoutSelector.prototype.isLayoutDisplayedByButton = function (layout) {
        return underscore_1.contains(underscore_1.keys(this.currentActiveLayouts), layout);
    };
    ResultLayoutSelector.ID = 'ResultLayoutSelector';
    ResultLayoutSelector.aliases = ['ResultLayout'];
    ResultLayoutSelector.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultLayoutSelector: ResultLayoutSelector,
            ResultLayout: ResultLayoutSelector
        });
    };
    ResultLayoutSelector.validLayouts = ['list', 'card', 'table'];
    /**
     * The component options
     * @componentOptions
     */
    ResultLayoutSelector.options = {
        /**
         * Specifies the layouts that should be available when the search page is displayed in mobile mode.
         *
         * By default, the mobile mode breakpoint is at 480 px screen width.
         *
         * To change this default value, use the [responsiveSmallBreakpoint]{@link SearchInterface.options.responsiveSmallBreakpoint} option.
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
         * To change this default value, use the [responsiveMediumBreakpoint]{@link SearchInterface.options.responsiveMediumBreakpoint} option.
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
         * To change this default value, use the [responsiveMediumBreakpoint]{@link SearchInterface.options.responsiveMediumBreakpoint} option.
         *
         *  When the breakpoint is reached, layouts that are not specified becomes inactive and the linked result list will be disabled.
         *
         * The possible values for layouts are `list`, `card`, `table`.
         *
         * The default value is `list`, `card`, `table`.
         */
        desktopLayouts: ComponentOptions_1.ComponentOptions.buildListOption({ defaultValue: ['list', 'card', 'table'] })
    };
    return ResultLayoutSelector;
}(Component_1.Component));
exports.ResultLayoutSelector = ResultLayoutSelector;
Initialization_1.Initialization.registerAutoCreateComponent(ResultLayoutSelector);


/***/ }),

/***/ 655:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 656:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Logger_1 = __webpack_require__(9);
var Dom_1 = __webpack_require__(1);
var Component_1 = __webpack_require__(7);
var ResultLayoutSelector_1 = __webpack_require__(197);
var SearchInterface_1 = __webpack_require__(19);
var ResponsiveComponentsManager_1 = __webpack_require__(60);
var ResponsiveResultLayout = /** @class */ (function () {
    function ResponsiveResultLayout(coveoRoot, ID, options, responsiveDropdown) {
        this.coveoRoot = coveoRoot;
        this.ID = ID;
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
    }
    ResponsiveResultLayout.init = function (root, component, options) {
        if (!Dom_1.$$(root).find("." + Component_1.Component.computeCssClassName(ResultLayoutSelector_1.ResultLayoutSelector))) {
            var logger = new Logger_1.Logger('ResponsiveResultLayout');
            logger.trace('No ResultLayout component found : Cannot instantiate ResponsiveResultLayout');
            return;
        }
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(ResponsiveResultLayout, Dom_1.$$(root), ResultLayoutSelector_1.ResultLayoutSelector.ID, component, options);
    };
    ResponsiveResultLayout.prototype.registerComponent = function (accept) {
        if (accept instanceof ResultLayoutSelector_1.ResultLayoutSelector) {
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
        var layoutsToDisable = underscore_1.difference(ResultLayoutSelector_1.ResultLayoutSelector.validLayouts, validLayouts);
        var layoutsToEnable = underscore_1.intersection(ResultLayoutSelector_1.ResultLayoutSelector.validLayouts, validLayouts);
        this.resultLayout.disableLayouts(layoutsToDisable);
        this.resultLayout.enableLayouts(layoutsToEnable);
    };
    ResponsiveResultLayout.prototype.needSmallMode = function () {
        switch (this.searchInterface.responsiveComponents.getResponsiveMode()) {
            case 'small':
                return true;
            case 'auto':
                return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getSmallScreenWidth();
            default:
                return false;
        }
    };
    ResponsiveResultLayout.prototype.needMediumMode = function () {
        switch (this.searchInterface.responsiveComponents.getResponsiveMode()) {
            case 'medium':
                return true;
            case 'auto':
                return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getMediumScreenWidth();
            default:
                return false;
        }
    };
    return ResponsiveResultLayout;
}());
exports.ResponsiveResultLayout = ResponsiveResultLayout;


/***/ })

});
//# sourceMappingURL=ResultLayoutSelector__ec82d15c0e890cb8a4e5.js.map