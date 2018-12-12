webpackJsonpCoveo__temporary([31],{

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

/***/ 179:
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
__webpack_require__(413);
var underscore_1 = __webpack_require__(0);
var BreadcrumbEvents_1 = __webpack_require__(37);
var InitializationEvents_1 = __webpack_require__(16);
var QueryEvents_1 = __webpack_require__(10);
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(7);
var AccessibleButton_1 = __webpack_require__(17);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
/**
 * The Breadcrumb component displays a summary of the currently active query filters.
 *
 * For example, when the user selects a {@link Facet} value, the breadcrumbs display this value.
 *
 * The active filters are obtained by the component by firing an event in the Breadcrumb component.
 *
 * All other components having an active state can react to this event by providing custom bits of HTML to display
 * inside the breadcrumbs.
 *
 * Thus, it is possible to easily extend the Breadcrumb component using custom code to display information about custom
 * states and filters.
 *
 * See {@link BreadcrumbEvents} for the list of events and parameters sent when a Breadcrumb component is populated.
 */
var Breadcrumb = /** @class */ (function (_super) {
    __extends(Breadcrumb, _super);
    /**
     * Creates a new Breadcrumb component. Binds event on {@link QueryEvents.deferredQuerySuccess} to draw the
     * breadcrumbs.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Breadcrumb component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Breadcrumb(element, options, bindings) {
        var _this = _super.call(this, element, Breadcrumb.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Breadcrumb, options);
        _this.bind.oneRootElement(InitializationEvents_1.InitializationEvents.afterInitialization, function () { return _this.handleAfterInitialization(); });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.redrawBreadcrumb, function () { return _this.redrawBreadcrumb(); });
        _this.element.style.display = 'none';
        return _this;
    }
    /**
     * Triggers the event to populate the breadcrumbs. Components such as {@link Facet} can populate the breadcrumbs.
     *
     * This method triggers a {@link BreadcrumbEvents.populateBreadcrumb} event with an
     * {@link IPopulateBreadcrumbEventArgs} object (an array) that other components or code can populate.
     * @returns {IBreadcrumbItem[]} A populated breadcrumb item list.
     */
    Breadcrumb.prototype.getBreadcrumbs = function () {
        var args = { breadcrumbs: [] };
        this.bind.trigger(this.root, BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, args);
        this.logger.debug('Retrieved breadcrumbs', args.breadcrumbs);
        this.lastBreadcrumbs = args.breadcrumbs;
        return args.breadcrumbs;
    };
    /**
     * Triggers the event to clear the current breadcrumbs that components such as {@link Facet} can populate.
     *
     * Also triggers a new query and logs the `breadcrumbResetAll` event in the usage analytics.
     */
    Breadcrumb.prototype.clearBreadcrumbs = function () {
        var args = {};
        this.bind.trigger(this.root, BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, args);
        this.logger.debug('Clearing breadcrumbs');
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbResetAll, {});
        this.queryController.executeQuery();
    };
    /**
     * Draws the specified breadcrumb items.
     * @param breadcrumbs The breadcrumb items to draw.
     */
    Breadcrumb.prototype.drawBreadcrumb = function (breadcrumbs) {
        var _this = this;
        Dom_1.$$(this.element).empty();
        if (breadcrumbs.length != 0) {
            this.element.style.display = '';
        }
        else {
            this.element.style.display = 'none';
        }
        var breadcrumbItems = document.createElement('div');
        Dom_1.$$(breadcrumbItems).addClass('coveo-breadcrumb-items');
        this.element.appendChild(breadcrumbItems);
        underscore_1.each(breadcrumbs, function (bcrumb) {
            var elem = bcrumb.element;
            Dom_1.$$(elem).addClass('coveo-breadcrumb-item');
            breadcrumbItems.appendChild(elem);
        });
        var clear = Dom_1.$$('div', {
            className: 'coveo-breadcrumb-clear-all',
            title: Strings_1.l('ClearAllFilters')
        }).el;
        new AccessibleButton_1.AccessibleButton()
            .withElement(clear)
            .withSelectAction(function () { return _this.clearBreadcrumbs(); })
            .withOwner(this.bind)
            .withLabel(Strings_1.l('ClearAllFilters'))
            .build();
        var clearIcon = Dom_1.$$('div', {
            className: 'coveo-icon coveo-breadcrumb-clear-all-icon'
        }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(clearIcon, 'coveo-breadcrumb-clear-all-svg');
        clear.appendChild(clearIcon);
        var clearText = Dom_1.$$('div', undefined, Strings_1.l('Clear', '')).el;
        clear.appendChild(clearText);
        this.element.appendChild(clear);
    };
    Breadcrumb.prototype.redrawBreadcrumb = function () {
        this.lastBreadcrumbs ? this.drawBreadcrumb(this.lastBreadcrumbs) : this.drawBreadcrumb(this.getBreadcrumbs());
    };
    Breadcrumb.prototype.handleDeferredQuerySuccess = function () {
        this.drawBreadcrumb(this.getBreadcrumbs());
    };
    Breadcrumb.prototype.handleQueryError = function () {
        this.drawBreadcrumb(this.getBreadcrumbs());
    };
    Breadcrumb.prototype.handleAfterInitialization = function () {
        var _this = this;
        // We must bind to these events after the initialization to make sure the breadcrumb generation
        // is made with updated components. (E.G facet, facetrange, ...)
        this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function () { return _this.handleDeferredQuerySuccess(); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return _this.handleQueryError(); });
    };
    Breadcrumb.ID = 'Breadcrumb';
    Breadcrumb.options = {};
    Breadcrumb.doExport = function () {
        GlobalExports_1.exportGlobally({
            Breadcrumb: Breadcrumb
        });
    };
    return Breadcrumb;
}(Component_1.Component));
exports.Breadcrumb = Breadcrumb;
Initialization_1.Initialization.registerAutoCreateComponent(Breadcrumb);


/***/ }),

/***/ 367:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 413:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Breadcrumb__f056675ccb969b1e6859.js.map