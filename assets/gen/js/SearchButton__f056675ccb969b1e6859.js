webpackJsonpCoveo__temporary([37],{

/***/ 137:
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
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(7);
var AccessibleButton_1 = __webpack_require__(17);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Component_1 = __webpack_require__(6);
var Initialization_1 = __webpack_require__(2);
/**
 * The SearchButton component renders a search icon that the end user can click to trigger a new query.
 *
 * See also the {@link Searchbox} component, which can automatically instantiate a SearchButton component along with a
 * {@link Querybox} component or an {@link Omnibox} component.
 */
var SearchButton = /** @class */ (function (_super) {
    __extends(SearchButton, _super);
    /**
     * Creates a new SearchButton. Binds a `click` event on the element. Adds a search icon on the element.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the SearchButton component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function SearchButton(element, options, bindings) {
        var _this = _super.call(this, element, SearchButton.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        new AccessibleButton_1.AccessibleButton()
            .withElement(element)
            .withOwner(_this.bind)
            .withLabel(Strings_1.l('Search'))
            .withSelectAction(function () { return _this.handleClick(); })
            .build();
        // Provide a magnifier icon if element contains nothing
        if (Utils_1.Utils.trim(Dom_1.$$(_this.element).text()) == '') {
            var svgMagnifierContainer = Dom_1.$$('span', { className: 'coveo-search-button' }, SVGIcons_1.SVGIcons.icons.search).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(svgMagnifierContainer, 'coveo-search-button-svg');
            var svgLoadingAnimationContainer = Dom_1.$$('span', { className: 'coveo-search-button-loading' }, SVGIcons_1.SVGIcons.icons.loading).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(svgLoadingAnimationContainer, 'coveo-search-button-loading-svg');
            element.appendChild(svgMagnifierContainer);
            element.appendChild(svgLoadingAnimationContainer);
        }
        return _this;
    }
    /**
     * Triggers the `click` event handler, which logs a `searchboxSubmit` event in the usage analytics and executes a
     * query.
     */
    SearchButton.prototype.click = function () {
        this.handleClick();
    };
    SearchButton.prototype.handleClick = function () {
        this.logger.debug('Performing query following button click');
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit, {});
        this.queryController.executeQuery();
    };
    SearchButton.ID = 'SearchButton';
    SearchButton.doExport = function () {
        GlobalExports_1.exportGlobally({
            SearchButton: SearchButton
        });
    };
    SearchButton.options = {};
    return SearchButton;
}(Component_1.Component));
exports.SearchButton = SearchButton;
Initialization_1.Initialization.registerAutoCreateComponent(SearchButton);


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

/***/ 367:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=SearchButton__f056675ccb969b1e6859.js.map