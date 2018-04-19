webpackJsonpCoveo__temporary([8],{

/***/ 136:
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
var SearchInterface_1 = __webpack_require__(17);
var ComponentOptions_1 = __webpack_require__(7);
var QueryEvents_1 = __webpack_require__(10);
var OmniboxEvents_1 = __webpack_require__(30);
var ResultListEvents_1 = __webpack_require__(32);
var SettingsEvents_1 = __webpack_require__(39);
var PreferencesPanelEvents_1 = __webpack_require__(68);
var AnalyticsEvents_1 = __webpack_require__(65);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var BreadcrumbEvents_1 = __webpack_require__(38);
var QuickviewEvents_1 = __webpack_require__(152);
var QueryStateModel_1 = __webpack_require__(12);
var Model_1 = __webpack_require__(16);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(2);
var ResponsiveRecommendation_1 = __webpack_require__(410);
var coveo_analytics_1 = __webpack_require__(85);
var RegisteredNamedMethods_1 = __webpack_require__(26);
var InitializationEvents_1 = __webpack_require__(15);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var DefaultRecommendationTemplate_1 = __webpack_require__(322);
var RecommendationQuery_1 = __webpack_require__(413);
var RecommendationAnalyticsClient_1 = __webpack_require__(141);
__webpack_require__(414);
/**
 * The Recommendation component is a {@link SearchInterface} that displays recommendations typically based on user
 * history.
 *
 * This component usually listens to the main SearchInterface. When the main SearchInterface generates a query, the
 * Recommendation component generates another query to get the recommendations at the same time.
 *
 * To get history-based recommendations, you will likely want to include the `pageview` script in your page (see
 * [coveo.analytics.js](https://github.com/coveo/coveo.analytics.js)). However, including this script is not mandatory.
 * For instance, you could use the Recommendation component without the Coveo Machine Learning service to create a
 * simple "recommended people" interface.
 *
 * It is possible to include this component inside another SearchInterface, but it is also possible to instantiate it as
 * a "standalone" search interface, without even instantiating a main SearchInterface component. In any case, a
 * Recommendation component always acts as a full-fledged search interface. Therefore, you can include any component
 * inside the Recommendation component (Searchbox, Facet, Sort, etc.), just as you would inside the main SearchInterface
 * component.
 */
var Recommendation = /** @class */ (function (_super) {
    __extends(Recommendation, _super);
    /**
     * Creates a new Recommendation component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Recommendation component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time)
     * @param _window
     */
    function Recommendation(element, options, analyticsOptions, _window) {
        if (options === void 0) { options = {}; }
        if (analyticsOptions === void 0) { analyticsOptions = {}; }
        if (_window === void 0) { _window = window; }
        var _this = _super.call(this, element, ComponentOptions_1.ComponentOptions.initComponentOptions(element, Recommendation, options), analyticsOptions, _window) || this;
        _this.element = element;
        _this.options = options;
        _this.analyticsOptions = analyticsOptions;
        _this.element.style.display = '';
        if (!_this.options.id) {
            _this.generateDefaultId();
        }
        // This is done to allow the component to be included in another search interface without triggering the parent events.
        _this.preventEventPropagation();
        if (_this.options.mainSearchInterface) {
            _this.bindToMainSearchInterface();
        }
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.buildingQuery, function (e, args) {
            return _this.handleRecommendationBuildingQuery(args);
        });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.querySuccess, function (e, args) { return _this.handleRecommendationQuerySuccess(args); });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.noResults, function (e, args) { return _this.handleRecommendationNoResults(); });
        Dom_1.$$(_this.element).on(QueryEvents_1.QueryEvents.queryError, function (e, args) { return _this.handleRecommendationQueryError(); });
        _this.historyStore = new coveo_analytics_1.history.HistoryStore();
        if (!_this.options.mainSearchInterface) {
            // When the recommendation component is "standalone", we add additional safeguard against bad config.
            _this.ensureCurrentPageViewExistsInStore();
        }
        ResponsiveRecommendation_1.ResponsiveRecommendation.init(_this.root, _this, options);
        return _this;
    }
    Recommendation.prototype.getId = function () {
        return this.options.id;
    };
    Recommendation.prototype.enable = function () {
        _super.prototype.enable.call(this);
        this.show();
    };
    Recommendation.prototype.disable = function () {
        _super.prototype.disable.call(this);
        this.hide();
    };
    Recommendation.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    Recommendation.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    Recommendation.prototype.ensureCurrentPageViewExistsInStore = function () {
        // It's not 100% sure that the element will actually be added in the store.
        // It's possible that an external script configured by the end user to log the page view already did that.
        // So we *could* end up with duplicate values in the store :
        // We rely on the fact that the coveo.analytics lib has defensive code against consecutive page view that are identical.
        // This is mainly done if the recommendation component is being initialized before the page view could be logged correctly by the coveo.analytics externa lib.
        var historyElement = {
            name: 'PageView',
            value: document.location.toString(),
            time: JSON.stringify(new Date()),
            title: document.title
        };
        this.historyStore.addElement(historyElement);
    };
    Recommendation.prototype.bindToMainSearchInterface = function () {
        this.bindComponentOptionsModelToMainSearchInterface();
        this.bindQueryEventsToMainSearchInterface();
    };
    Recommendation.prototype.bindComponentOptionsModelToMainSearchInterface = function () {
        var _this = this;
        // Try to fetch the componentOptions from the main search interface.
        // Since we do not know which interface is init first (recommendation or full search interface)
        // add a mechanism that waits for the full search interface to be correctly initialized
        // then, set the needed values on the component options model.
        var searchInterfaceComponent = RegisteredNamedMethods_1.get(this.options.mainSearchInterface, SearchInterface_1.SearchInterface);
        var alreadyInitialized = searchInterfaceComponent != null;
        var onceInitialized = function () {
            var mainSearchInterfaceOptionsModel = searchInterfaceComponent.getBindings().componentOptionsModel;
            _this.componentOptionsModel.setMultiple(mainSearchInterfaceOptionsModel.getAttributes());
            Dom_1.$$(_this.options.mainSearchInterface).on(_this.componentOptionsModel.getEventName(Model_1.MODEL_EVENTS.ALL), function () {
                _this.componentOptionsModel.setMultiple(mainSearchInterfaceOptionsModel.getAttributes());
            });
        };
        if (alreadyInitialized) {
            onceInitialized();
        }
        else {
            Dom_1.$$(this.options.mainSearchInterface).on(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () {
                searchInterfaceComponent = RegisteredNamedMethods_1.get(_this.options.mainSearchInterface, SearchInterface_1.SearchInterface);
                onceInitialized();
            });
        }
    };
    Recommendation.prototype.bindQueryEventsToMainSearchInterface = function () {
        var _this = this;
        // Whenever a query sucessfully returns on the full search interface, refresh the recommendation component.
        Dom_1.$$(this.options.mainSearchInterface).on(QueryEvents_1.QueryEvents.querySuccess, function (e, args) {
            _this.mainInterfaceQuery = args;
            _this.mainQuerySearchUID = args.results.searchUid;
            _this.mainQueryPipeline = args.results.pipeline;
            if (args.results.results.length != 0) {
                _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.recommendation, {});
                _this.queryController.executeQuery({
                    closeModalBox: false
                });
            }
        });
        Dom_1.$$(this.options.mainSearchInterface).on(QueryEvents_1.QueryEvents.queryError, function () { return _this.hide(); });
        Dom_1.$$(this.options.mainSearchInterface).on(QueryEvents_1.QueryEvents.noResults, function () { return _this.hide(); });
    };
    Recommendation.prototype.handleRecommendationBuildingQuery = function (data) {
        if (!this.disabled) {
            this.modifyQueryForRecommendation(data);
            this.addRecommendationInfoInQuery(data);
        }
    };
    Recommendation.prototype.handleRecommendationQuerySuccess = function (data) {
        if (!this.disabled) {
            if (this.options.hideIfNoResults) {
                if (data.results.totalCount === 0) {
                    this.hide();
                }
                else {
                    this.show();
                }
            }
        }
    };
    Recommendation.prototype.handleRecommendationNoResults = function () {
        if (!this.disabled) {
            if (this.options.hideIfNoResults) {
                this.hide();
            }
        }
    };
    Recommendation.prototype.handleRecommendationQueryError = function () {
        if (!this.disabled) {
            this.hide();
        }
    };
    Recommendation.prototype.modifyQueryForRecommendation = function (data) {
        if (this.mainInterfaceQuery) {
            Utils_1.Utils.copyObjectAttributes(data.queryBuilder, this.mainInterfaceQuery.queryBuilder, this.options.optionsToUse);
        }
    };
    Recommendation.prototype.addRecommendationInfoInQuery = function (data) {
        if (!_.isEmpty(this.options.userContext)) {
            data.queryBuilder.addContext(this.options.userContext);
        }
        data.queryBuilder.recommendation = this.options.id;
    };
    Recommendation.prototype.preventEventPropagation = function () {
        this.preventEventPropagationOn(QueryEvents_1.QueryEvents);
        this.preventEventPropagationOn(OmniboxEvents_1.OmniboxEvents);
        this.preventEventPropagationOn(ResultListEvents_1.ResultListEvents);
        this.preventEventPropagationOn(SettingsEvents_1.SettingsEvents);
        this.preventEventPropagationOn(PreferencesPanelEvents_1.PreferencesPanelEvents);
        this.preventEventPropagationOn(AnalyticsEvents_1.AnalyticsEvents);
        this.preventEventPropagationOn(BreadcrumbEvents_1.BreadcrumbEvents);
        this.preventEventPropagationOn(QuickviewEvents_1.QuickviewEvents);
        this.preventEventPropagationOn(InitializationEvents_1.InitializationEvents);
        this.preventEventPropagationOn(this.getAllModelEvents());
    };
    Recommendation.prototype.preventEventPropagationOn = function (eventType, eventName) {
        if (eventName === void 0) { eventName = function (event) {
            return event;
        }; }
        for (var event_1 in eventType) {
            Dom_1.$$(this.root).on(eventName(event_1), function (e) { return e.stopPropagation(); });
        }
    };
    Recommendation.prototype.getAllModelEvents = function () {
        var _this = this;
        var events = {};
        var queryStateModel = this.getBindings().queryStateModel;
        _.each(_.values(Model_1.Model.eventTypes), function (event) {
            var eventName = queryStateModel.getEventName(event);
            events[eventName] = eventName;
            _.each(_.values(QueryStateModel_1.QUERY_STATE_ATTRIBUTES), function (attribute) {
                var eventName = _this.queryStateModel.getEventName(event + attribute);
                events[eventName] = eventName;
            });
        });
        return events;
    };
    Recommendation.prototype.generateDefaultId = function () {
        var id = 'Recommendation';
        if (Recommendation.NEXT_ID !== 1) {
            this.logger.warn('Generating another recommendation default id', 'Consider configuring a human friendly / meaningful id for this interface');
            id = id + '_' + Recommendation.NEXT_ID;
        }
        Recommendation.NEXT_ID++;
        this.options.id = id;
    };
    Recommendation.ID = 'Recommendation';
    Recommendation.NEXT_ID = 1;
    Recommendation.doExport = function () {
        GlobalExports_1.exportGlobally({
            Recommendation: Recommendation,
            DefaultRecommendationTemplate: DefaultRecommendationTemplate_1.DefaultRecommendationTemplate,
            RecommendationQuery: RecommendationQuery_1.RecommendationQuery,
            RecommendationAnalyticsClient: RecommendationAnalyticsClient_1.RecommendationAnalyticsClient
        });
    };
    /**
     * The options for the recommendation component
     * @componentOptions
     */
    Recommendation.options = {
        /**
         * Specifies the main {@link SearchInterface} to listen to.
         */
        mainSearchInterface: ComponentOptions_1.ComponentOptions.buildSelectorOption(),
        /**
         * Specifies the user context to send to Coveo usage analytics.
         * The component sends this information with the query alongside the user history to get the recommendations.
         */
        userContext: ComponentOptions_1.ComponentOptions.buildJsonOption(),
        /**
         * Specifies the ID of the interface.
         * The usage analytics use the interface ID to know which recommendation interface was selected.
         *
         * Default value is `Recommendation` for the first one and `Recommendation_{number}`, where {number} depends on the
         * number of Recommendation interfaces with default IDs in the page for the others.
         */
        id: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies which options from the main {@link QueryBuilder} to use in the triggered query.
         *
         * Possible values are:
         * - `expression`
         * - `advancedExpression`
         * - `constantExpression`
         * - `disjunctionExpression`
         *
         * **Example:**
         *
         * Adding the expression (`q`) and the advanced expression (`aq`) parts of the main query in the triggered query:
         *
         * `data-options-to-use="expression,advancedExpression"`
         *
         * Default value is `expression`.
         */
        optionsToUse: ComponentOptions_1.ComponentOptions.buildListOption({
            defaultValue: ['expression']
        }),
        /**
         * Specifies whether to send the actions history along with the triggered query.
         *
         * Setting this option to `false` makes it impossible for this component to get Coveo Machine Learning
         * recommendations.
         *
         * However, setting this option to `false` can be useful to display side results in a search page.
         *
         * Default value is `true`.
         *
         * @deprecated This option is now deprecated. The correct way to control this behavior is to configure an appropriate machine learning model in the administration interface (Recommendation, Relevance tuning, Query suggestions).
         */
        sendActionsHistory: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: true,
            deprecated: 'This option is now deprecated. The correct way to control this behaviour is to configure an appropriate machine learning model in the administration interface (Recommendation, Relevance tuning, Query suggestions)'
        }),
        /**
         * Specifies whether to hide the Recommendations component if no result or recommendation is available.
         *
         * Default value is `true`.
         */
        hideIfNoResults: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        autoTriggerQuery: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            postProcessing: function (value, options) {
                if (options.mainSearchInterface) {
                    return false;
                }
                return value;
            }
        }),
        /**
         * Specifies whether to enable *responsive mode* for Recommendation components. Setting this options to `false` on
         * any Recommendation component in a search interface disables responsive mode for all other Recommendation
         * components in the search interface.
         *
         * Responsive mode displays all Recommendation components under a single dropdown button whenever the width of the
         * HTML element which the search interface is bound to reaches or falls behind a certain threshold (see
         * {@link Recommendation.options.responsiveBreakpoint}).
         *
         * See also {@link Recommendation.options.dropdownHeaderLabel}.
         *
         * Default value is `true`.
         */
        enableResponsiveMode: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * If {@link Recommendation.options.enableResponsiveMode} is `true` for all Recommendation components, specifies the
         * width threshold (in pixels) of the search interface at which Recommendation components go in responsive mode.
         *
         * Recommendation components go in responsive mode when the width of the search interface is equal to or lower than
         * this value.
         *
         * The `search interface` corresponds to the HTML element with the class `CoveoSearchInterface`.
         *
         * If more than one Recommendation component in the search interface specifies a value for this option, then the
         * framework uses the last occurrence of the option.
         *
         * Default value is `1000`.
         */
        responsiveBreakpoint: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 1000 }),
        /**
         * If {@link Recommendation.options.enableResponsiveMode} is `true` for all Recommendation components, specifies the
         * label of the dropdown button that allows to display the Recommendation components when in responsive mode.
         *
         * If more than one Recommendation component in the search interface specifies a value for this option, then the
         * framework uses the first occurrence of the option.
         *
         * Default value is `Recommendations`.
         */
        dropdownHeaderLabel: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Recommendations' })
    };
    return Recommendation;
}(SearchInterface_1.SearchInterface));
exports.Recommendation = Recommendation;
// We do not register the Recommendation component since it is done with .coveo('initRecommendation')


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

/***/ 148:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var EventsUtils_1 = __webpack_require__(146);
var _ = __webpack_require__(0);
var ResponsiveDropdownEvent;
(function (ResponsiveDropdownEvent) {
    ResponsiveDropdownEvent["OPEN"] = "responsiveDropdownOpen";
    ResponsiveDropdownEvent["CLOSE"] = "responsiveDropdownClose";
})(ResponsiveDropdownEvent = exports.ResponsiveDropdownEvent || (exports.ResponsiveDropdownEvent = {}));
var ResponsiveDropdown = /** @class */ (function () {
    function ResponsiveDropdown(dropdownContent, dropdownHeader, coveoRoot) {
        this.dropdownContent = dropdownContent;
        this.dropdownHeader = dropdownHeader;
        this.coveoRoot = coveoRoot;
        this.isOpened = false;
        this.onOpenHandlers = [];
        this.onCloseHandlers = [];
        this.popupBackgroundIsEnabled = true;
        this.popupBackground = this.buildPopupBackground();
        this.bindOnClickDropdownHeaderEvent();
        this.saveContentPosition();
    }
    ResponsiveDropdown.prototype.registerOnOpenHandler = function (handler, context) {
        this.onOpenHandlers.push({ handler: handler, context: context });
    };
    ResponsiveDropdown.prototype.registerOnCloseHandler = function (handler, context) {
        this.onCloseHandlers.push({ handler: handler, context: context });
    };
    ResponsiveDropdown.prototype.cleanUp = function () {
        this.close();
        this.dropdownHeader.cleanUp();
        this.dropdownContent.cleanUp();
        this.restoreContentPosition();
    };
    ResponsiveDropdown.prototype.open = function () {
        this.isOpened = true;
        this.dropdownHeader.open();
        this.dropdownContent.positionDropdown();
        _.each(this.onOpenHandlers, function (handlerCall) {
            handlerCall.handler.apply(handlerCall.context);
        });
        this.showPopupBackground();
        Dom_1.$$(this.dropdownHeader.element).trigger(ResponsiveDropdownEvent.OPEN);
    };
    ResponsiveDropdown.prototype.close = function () {
        this.isOpened = false;
        _.each(this.onCloseHandlers, function (handlerCall) {
            handlerCall.handler.apply(handlerCall.context);
        });
        this.dropdownHeader.close();
        this.dropdownContent.hideDropdown();
        this.hidePopupBackground();
        Dom_1.$$(this.dropdownHeader.element).trigger(ResponsiveDropdownEvent.CLOSE);
    };
    ResponsiveDropdown.prototype.disablePopupBackground = function () {
        this.popupBackgroundIsEnabled = false;
    };
    ResponsiveDropdown.prototype.bindOnClickDropdownHeaderEvent = function () {
        var _this = this;
        this.dropdownHeader.element.on('click', function () {
            if (_this.isOpened) {
                _this.close();
            }
            else {
                _this.open();
            }
        });
    };
    ResponsiveDropdown.prototype.showPopupBackground = function () {
        if (this.popupBackgroundIsEnabled) {
            this.coveoRoot.el.appendChild(this.popupBackground.el);
            window.getComputedStyle(this.popupBackground.el).opacity;
            this.popupBackground.el.style.opacity = ResponsiveDropdown.TRANSPARENT_BACKGROUND_OPACITY;
            this.popupBackground.addClass('coveo-dropdown-background-active');
        }
    };
    ResponsiveDropdown.prototype.hidePopupBackground = function () {
        if (this.popupBackgroundIsEnabled) {
            // forces the browser to reflow the element, so that the transition is applied.
            window.getComputedStyle(this.popupBackground.el).opacity;
            this.popupBackground.el.style.opacity = '0';
            this.popupBackground.removeClass('coveo-dropdown-background-active');
        }
    };
    ResponsiveDropdown.prototype.buildPopupBackground = function () {
        var _this = this;
        var popupBackground = Dom_1.$$('div', { className: ResponsiveDropdown.DROPDOWN_BACKGROUND_CSS_CLASS_NAME });
        EventsUtils_1.EventsUtils.addPrefixedEvent(popupBackground.el, 'TransitionEnd', function () {
            if (popupBackground.el.style.opacity == '0') {
                popupBackground.detach();
            }
        });
        popupBackground.on('click', function () { return _this.close(); });
        return popupBackground;
    };
    ResponsiveDropdown.prototype.saveContentPosition = function () {
        var dropdownContentPreviousSibling = this.dropdownContent.element.el.previousSibling;
        var dropdownContentParent = this.dropdownContent.element.el.parentElement;
        this.previousSibling = dropdownContentPreviousSibling ? Dom_1.$$(dropdownContentPreviousSibling) : null;
        this.parent = Dom_1.$$(dropdownContentParent);
    };
    ResponsiveDropdown.prototype.restoreContentPosition = function () {
        if (this.previousSibling) {
            this.dropdownContent.element.insertAfter(this.previousSibling.el);
        }
        else {
            this.parent.prepend(this.dropdownContent.element.el);
        }
    };
    ResponsiveDropdown.TRANSPARENT_BACKGROUND_OPACITY = '0.9';
    ResponsiveDropdown.DROPDOWN_BACKGROUND_CSS_CLASS_NAME = 'coveo-dropdown-background';
    return ResponsiveDropdown;
}());
exports.ResponsiveDropdown = ResponsiveDropdown;


/***/ }),

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The `QuickviewEvents` static class contains the string definitions of all events that strongly relate to the
 * [`Quickview`]{@link Quickview} component.
 */
var QuickviewEvents = /** @class */ (function () {
    function QuickviewEvents() {
    }
    /**
     * Triggered by the [`QuickviewDocument`]{@link QuickviewDocument} component when the content to display in the
     * quickview modal window has just finished downloading.
     *
     * The [`Quickview`]{@link Quickview} component listens to this event to know when to remove its loading animation.
     *
     * All `quickviewLoaded` event handlers receive a [`QuickviewLoadedEventArgs`]{@link IQuickviewLoadedEventArgs} object
     * as an argument.
     *
     * @type {string} The string value is `quickviewLoaded`.
     */
    QuickviewEvents.quickviewLoaded = 'quickviewLoaded';
    /**
     * Triggered by the [`QuickviewDocument`]{@link QuickviewDocument} component when the end user has just clicked the
     * **Quickview** button/link to open the quickview modal window.
     *
     * This event allows external code to modify the terms to highlight before the content of the quickview modal window
     * is rendered.
     *
     * All `openQuickview` event handlers receive an
     * [`OpenQuickviewEventArgs`]{@link ResultListEvents.IOpenQuickviewEventArgs} object as an argument.
     *
     * @type {string} The string value is `openQuickview`.
     */
    QuickviewEvents.openQuickview = 'openQuickview';
    return QuickviewEvents;
}());
exports.QuickviewEvents = QuickviewEvents;


/***/ }),

/***/ 307:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var ResponsiveDropdownHeader = /** @class */ (function () {
    function ResponsiveDropdownHeader(componentName, element) {
        this.element = element;
        this.element.addClass("coveo-" + componentName + "-dropdown-header");
        this.element.addClass(ResponsiveDropdownHeader.DEFAULT_CSS_CLASS_NAME);
    }
    ResponsiveDropdownHeader.prototype.open = function () {
        this.element.addClass(ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME);
    };
    ResponsiveDropdownHeader.prototype.close = function () {
        this.element.removeClass(ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME);
    };
    ResponsiveDropdownHeader.prototype.cleanUp = function () {
        this.element.detach();
    };
    ResponsiveDropdownHeader.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    ResponsiveDropdownHeader.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    ResponsiveDropdownHeader.DEFAULT_CSS_CLASS_NAME = 'coveo-dropdown-header';
    ResponsiveDropdownHeader.ACTIVE_HEADER_CSS_CLASS_NAME = 'coveo-dropdown-header-active';
    return ResponsiveDropdownHeader;
}());
exports.ResponsiveDropdownHeader = ResponsiveDropdownHeader;


/***/ }),

/***/ 322:
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
var Template_1 = __webpack_require__(22);
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

/***/ 410:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveComponentsManager_1 = __webpack_require__(74);
var ResponsiveComponentsUtils_1 = __webpack_require__(86);
var SearchInterface_1 = __webpack_require__(17);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(2);
var Logger_1 = __webpack_require__(11);
var Recommendation_1 = __webpack_require__(136);
var RecommendationDropdownContent_1 = __webpack_require__(411);
var ResponsiveDropdownHeader_1 = __webpack_require__(307);
var ResponsiveDropdown_1 = __webpack_require__(148);
var Strings_1 = __webpack_require__(8);
var Component_1 = __webpack_require__(6);
var RegisteredNamedMethods_1 = __webpack_require__(26);
var QueryEvents_1 = __webpack_require__(10);
var _ = __webpack_require__(0);
__webpack_require__(412);
var MiscModules_1 = __webpack_require__(52);
var ResponsiveRecommendation = /** @class */ (function () {
    function ResponsiveRecommendation(coveoRoot, ID, options, responsiveDropdown) {
        this.coveoRoot = coveoRoot;
        this.ID = ID;
        this.responsiveDropdown = responsiveDropdown;
        this.recommendationRoot = this.getRecommendationRoot();
        this.dropdownHeaderLabel = options.dropdownHeaderLabel;
        this.breakpoint = this.defineResponsiveBreakpoint(options);
        this.dropdown = this.buildDropdown(responsiveDropdown);
        this.facets = this.getFacets();
        this.facetSliders = this.getFacetSliders();
        this.registerOnOpenHandler();
        this.registerOnCloseHandler();
        this.registerQueryEvents();
        this.handleResizeEvent();
    }
    ResponsiveRecommendation.init = function (root, component, options) {
        var logger = new Logger_1.Logger('ResponsiveRecommendation');
        var coveoRoot = this.findParentRootOfRecommendationComponent(root);
        if (!coveoRoot) {
            logger.info('Recommendation component has no parent interface. Disabling responsive mode for this component.');
            return;
        }
        if (!Dom_1.$$(coveoRoot).find('.coveo-results-column')) {
            logger.info('Cannot find element with class coveo-results-column. Disabling responsive mode for this component.');
            return;
        }
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(ResponsiveRecommendation, Dom_1.$$(coveoRoot), Recommendation_1.Recommendation.ID, component, _.extend({}, options, { initializationEventRoot: Dom_1.$$(root) }));
    };
    ResponsiveRecommendation.findParentRootOfRecommendationComponent = function (root) {
        var coveoRoot = Dom_1.$$(root).parents(Component_1.Component.computeCssClassName(SearchInterface_1.SearchInterface));
        if (coveoRoot[0]) {
            return Dom_1.$$(coveoRoot[0]);
        }
        return null;
    };
    ResponsiveRecommendation.prototype.handleResizeEvent = function () {
        if (this.needSmallMode() && !ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallRecommendationActivated(this.coveoRoot)) {
            this.changeToSmallMode();
        }
        else if (!this.needSmallMode() && ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.isSmallRecommendationActivated(this.coveoRoot)) {
            this.changeToLargeMode();
        }
        if (this.dropdown.isOpened) {
            this.dropdown.dropdownContent.positionDropdown();
        }
    };
    ResponsiveRecommendation.prototype.needDropdownWrapper = function () {
        return this.needSmallMode();
    };
    ResponsiveRecommendation.prototype.needSmallMode = function () {
        return this.coveoRoot.width() <= this.breakpoint;
    };
    ResponsiveRecommendation.prototype.changeToSmallMode = function () {
        var _this = this;
        this.dropdown.close();
        var header = this.coveoRoot.find("." + ResponsiveComponentsManager_1.ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS);
        if (!header) {
            // It's possible that recommendation gets initialized before the main interface is completed.
            // We defer the resize event execution in that case.
            MiscModules_1.Defer.defer(function () { return _this.handleResizeEvent(); });
        }
        else {
            Dom_1.$$(header).append(this.dropdown.dropdownHeader.element.el);
            this.disableFacetPreservePosition();
            ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.activateSmallRecommendation(this.coveoRoot);
            ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.activateSmallRecommendation(this.recommendationRoot);
        }
    };
    ResponsiveRecommendation.prototype.changeToLargeMode = function () {
        this.enableFacetPreservePosition();
        this.dropdown.cleanUp();
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.deactivateSmallRecommendation(this.coveoRoot);
        ResponsiveComponentsUtils_1.ResponsiveComponentsUtils.deactivateSmallRecommendation(this.recommendationRoot);
    };
    ResponsiveRecommendation.prototype.buildDropdown = function (responsiveDropdown) {
        var dropdownContent = this.buildDropdownContent();
        var dropdownHeader = this.buildDropdownHeader();
        var dropdown = responsiveDropdown ? responsiveDropdown : new ResponsiveDropdown_1.ResponsiveDropdown(dropdownContent, dropdownHeader, this.coveoRoot);
        dropdown.disablePopupBackground();
        return dropdown;
    };
    ResponsiveRecommendation.prototype.buildDropdownHeader = function () {
        var dropdownHeaderElement = Dom_1.$$('a');
        var content = Dom_1.$$('p');
        content.text(Strings_1.l(this.dropdownHeaderLabel));
        dropdownHeaderElement.el.appendChild(content.el);
        var dropdownHeader = new ResponsiveDropdownHeader_1.ResponsiveDropdownHeader('recommendation', dropdownHeaderElement);
        return dropdownHeader;
    };
    ResponsiveRecommendation.prototype.buildDropdownContent = function () {
        var dropdownContentElement;
        var recommendationColumn = this.coveoRoot.find('.coveo-recommendation-column');
        if (recommendationColumn) {
            dropdownContentElement = Dom_1.$$(recommendationColumn);
        }
        else {
            dropdownContentElement = Dom_1.$$(this.coveoRoot.find('.' + Component_1.Component.computeCssClassName(Recommendation_1.Recommendation)));
        }
        var dropdownContent = new RecommendationDropdownContent_1.RecommendationDropdownContent('recommendation', dropdownContentElement, this.coveoRoot);
        return dropdownContent;
    };
    ResponsiveRecommendation.prototype.defineResponsiveBreakpoint = function (options) {
        var breakpoint;
        if (Utils_1.Utils.isNullOrUndefined(options.responsiveBreakpoint)) {
            breakpoint = ResponsiveRecommendation.RESPONSIVE_BREAKPOINT;
        }
        else {
            breakpoint = options.responsiveBreakpoint;
        }
        return breakpoint;
    };
    ResponsiveRecommendation.prototype.getFacetSliders = function () {
        var facetSliders = [];
        _.each(this.coveoRoot.findAll('.' + Component_1.Component.computeCssClassNameForType("FacetSlider")), function (facetSliderElement) {
            var facetSlider = Component_1.Component.get(facetSliderElement);
            facetSliders.push(facetSlider);
        });
        return facetSliders;
    };
    ResponsiveRecommendation.prototype.getFacets = function () {
        var facets = [];
        _.each(this.coveoRoot.findAll('.' + Component_1.Component.computeCssClassNameForType('Facet')), function (facetElement) {
            var facet = Component_1.Component.get(facetElement);
            facets.push(facet);
        });
        return facets;
    };
    ResponsiveRecommendation.prototype.dismissFacetSearches = function () {
        _.each(this.facets, function (facet) {
            if (facet.facetSearch && facet.facetSearch.currentlyDisplayedResults) {
                facet.facetSearch.completelyDismissSearch();
            }
        });
    };
    ResponsiveRecommendation.prototype.enableFacetPreservePosition = function () {
        _.each(this.facets, function (facet) { return (facet.options.preservePosition = true); });
    };
    ResponsiveRecommendation.prototype.disableFacetPreservePosition = function () {
        _.each(this.facets, function (facet) { return (facet.options.preservePosition = false); });
    };
    ResponsiveRecommendation.prototype.drawFacetSliderGraphs = function () {
        _.each(this.facetSliders, function (facetSlider) { return facetSlider.drawDelayedGraphData(); });
    };
    ResponsiveRecommendation.prototype.registerOnOpenHandler = function () {
        this.dropdown.registerOnOpenHandler(this.drawFacetSliderGraphs, this);
    };
    ResponsiveRecommendation.prototype.registerOnCloseHandler = function () {
        this.dropdown.registerOnCloseHandler(this.dismissFacetSearches, this);
    };
    ResponsiveRecommendation.prototype.getRecommendationRoot = function () {
        return Dom_1.$$(this.coveoRoot.find('.' + Component_1.Component.computeCssClassName(Recommendation_1.Recommendation)));
    };
    ResponsiveRecommendation.prototype.registerQueryEvents = function () {
        var _this = this;
        var recommendationInstance = RegisteredNamedMethods_1.get(this.recommendationRoot.el, SearchInterface_1.SearchInterface);
        if (recommendationInstance && recommendationInstance.options.hideIfNoResults) {
            this.coveoRoot.on(QueryEvents_1.QueryEvents.querySuccess, function (e, data) { return _this.handleRecommnendationQuerySucess(data); });
            this.coveoRoot.on(QueryEvents_1.QueryEvents.noResults, function (e, data) { return _this.handleRecommendationNoResults(); });
        }
        this.coveoRoot.on(QueryEvents_1.QueryEvents.queryError, function () { return _this.handleRecommendationQueryError(); });
    };
    ResponsiveRecommendation.prototype.handleRecommnendationQuerySucess = function (data) {
        if (data.results.totalCount === 0) {
            this.dropdown.close();
            this.dropdown.dropdownHeader.hide();
        }
        else {
            this.dropdown.dropdownHeader.show();
        }
    };
    ResponsiveRecommendation.prototype.handleRecommendationNoResults = function () {
        this.dropdown.close();
        this.dropdown.dropdownHeader.hide();
    };
    ResponsiveRecommendation.prototype.handleRecommendationQueryError = function () {
        this.dropdown.close();
        this.dropdown.dropdownHeader.hide();
    };
    ResponsiveRecommendation.DROPDOWN_CONTAINER_CSS_CLASS_NAME = 'coveo-recommendation-dropdown-container';
    ResponsiveRecommendation.RESPONSIVE_BREAKPOINT = 1000;
    return ResponsiveRecommendation;
}());
exports.ResponsiveRecommendation = ResponsiveRecommendation;


/***/ }),

/***/ 411:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveDropdownContent_1 = __webpack_require__(145);
var Dom_1 = __webpack_require__(2);
var RecommendationDropdownContent = /** @class */ (function () {
    function RecommendationDropdownContent(componentName, element, coveoRoot) {
        this.element = element;
        this.coveoRoot = coveoRoot;
        this.cssClassName = "coveo-" + componentName + "-dropdown-content";
        this.element.addClass(this.cssClassName);
        this.element.addClass(ResponsiveDropdownContent_1.ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    }
    RecommendationDropdownContent.prototype.positionDropdown = function () {
        this.element.el.style.display = '';
        var dropdownContentWrapper = this.coveoRoot.find('.coveo-results-column');
        Dom_1.$$(dropdownContentWrapper).prepend(this.element.el);
        this.element.addClass(ResponsiveDropdownContent_1.ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
        this.element.addClass(this.cssClassName);
        // forces the browser to reflow the element, so that the transition is applied.
        window.getComputedStyle(this.element.el).maxHeight;
        this.element.addClass(RecommendationDropdownContent.OPENED_DROPDOWN_CSS_CLASS_NAME);
    };
    RecommendationDropdownContent.prototype.hideDropdown = function () {
        this.element.addClass(ResponsiveDropdownContent_1.ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
        this.element.addClass(this.cssClassName);
        this.element.removeClass(RecommendationDropdownContent.OPENED_DROPDOWN_CSS_CLASS_NAME);
    };
    RecommendationDropdownContent.prototype.cleanUp = function () {
        this.element.removeClass(this.cssClassName);
        this.element.removeClass(ResponsiveDropdownContent_1.ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME);
    };
    RecommendationDropdownContent.OPENED_DROPDOWN_CSS_CLASS_NAME = 'coveo-open-dropdown-content';
    return RecommendationDropdownContent;
}());
exports.RecommendationDropdownContent = RecommendationDropdownContent;


/***/ }),

/***/ 412:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 413:
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
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var Utils_1 = __webpack_require__(4);
var QueryEvents_1 = __webpack_require__(10);
var Initialization_1 = __webpack_require__(1);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var RecommendationQuery = /** @class */ (function (_super) {
    __extends(RecommendationQuery, _super);
    function RecommendationQuery(element, options, bindings) {
        var _this = _super.call(this, element, RecommendationQuery.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, RecommendationQuery, options);
        if (_this.element.tagName.toLowerCase() === 'script') {
            try {
                _this.content = Utils_1.Utils.decodeHTMLEntities(Dom_1.$$(_this.element).text());
            }
            catch (e) {
                return _this;
            }
            if (!_.isUndefined(_this.content) && _this.content != '') {
                _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, _this.handleBuildingQuery);
            }
        }
        return _this;
    }
    RecommendationQuery.prototype.handleBuildingQuery = function (data) {
        data.queryBuilder.advancedExpression.add(this.content);
    };
    RecommendationQuery.ID = 'RecommendationQuery';
    /**
     * The options for the RecommendationQuery component
     * @componentOptions
     */
    RecommendationQuery.options = {};
    return RecommendationQuery;
}(Component_1.Component));
exports.RecommendationQuery = RecommendationQuery;
Initialization_1.Initialization.registerAutoCreateComponent(RecommendationQuery);


/***/ }),

/***/ 414:
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
//# sourceMappingURL=Recommendation__7adec7eb6144877a5629.js.map