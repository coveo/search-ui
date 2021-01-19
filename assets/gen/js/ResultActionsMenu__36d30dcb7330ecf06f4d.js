webpackJsonpCoveo__temporary([64],{

/***/ 267:
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
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(1);
var Assert_1 = __webpack_require__(5);
var Initialization_1 = __webpack_require__(2);
var underscore_1 = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(650);
/**
 * The _ResultActionsMenu_ component adds a floating result action menu, meant to be used inside result templates (see [Result Templates](https://docs.coveo.com/en/413/javascript-search-framework/result-templates)).
 * It is designed to contain other components that can execute actions related to the result,
 * typically the [Quickview]{@link Quickview} and AttachToCase components, available in the Coveo for Salesforce and Coveo for Dynamics integrations.
 *
 * ```html
 * <script type="text/html" class="result-template" [...]
 *   <div class="coveo-result-frame">
 *     <div class="CoveoResultActionsMenu">
 *       <div class="CoveoQuickview"></div>
 *     </div>
 *   [...]
 * </script>
 * ```
 *
 * @availablesince [July 2018 Release (v2.4382.10)](https://docs.coveo.com/410/#july-2018-release-v2438210)
 */
var ResultActionsMenu = /** @class */ (function (_super) {
    __extends(ResultActionsMenu, _super);
    /**
     * Creates a new `ResultActionsMenu` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultActionsMenu` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function ResultActionsMenu(element, options, bindings, result) {
        var _this = _super.call(this, element, ResultActionsMenu.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultActionsMenu, options);
        _this.initializeParentResult();
        _this.bindEvents();
        _this.buildMenuItems();
        return _this;
    }
    /**
     * Shows the floating menu.
     */
    ResultActionsMenu.prototype.show = function () {
        Dom_1.$$(this.element).addClass(ResultActionsMenu.SHOW_CLASS);
    };
    /**
     * Hides the floating menu.
     */
    ResultActionsMenu.prototype.hide = function () {
        Dom_1.$$(this.element).removeClass(ResultActionsMenu.SHOW_CLASS);
    };
    ResultActionsMenu.prototype.initializeParentResult = function () {
        // Find the result containing this ResultActionsMenu
        this.parentResult = Dom_1.$$(this.element).closest('CoveoResult');
        Assert_1.Assert.check(this.parentResult !== undefined, 'ResultActionsMenu needs to be a child of a Result');
        Dom_1.$$(this.parentResult).addClass('coveo-clickable');
    };
    ResultActionsMenu.prototype.bindEvents = function () {
        var _this = this;
        Dom_1.$$(this.parentResult).on('click', function () { return _this.show(); });
        Dom_1.$$(this.parentResult).on('mouseleave', function () { return _this.hide(); });
        if (this.options.openOnMouseOver) {
            Dom_1.$$(this.parentResult).on('mouseenter', function () { return _this.show(); });
        }
    };
    ResultActionsMenu.prototype.buildMenuItems = function () {
        var _this = this;
        this.menuItems = [];
        underscore_1.forEach(Dom_1.$$(this.element).children(), function (elem) {
            _this.menuItems.push(elem);
            Dom_1.$$(elem).addClass('coveo-result-actions-menu-menu-item');
        });
    };
    ResultActionsMenu.ID = 'ResultActionsMenu';
    ResultActionsMenu.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultActionsMenu: ResultActionsMenu
        });
    };
    ResultActionsMenu.SHOW_CLASS = 'coveo-menu-opened';
    /**
     * @componentOptions
     */
    ResultActionsMenu.options = {
        /**
         * Specifies whether the menu should open when the user hovers over the result.
         *
         * When set to false, the menu opens only when clicking on the result.
         *
         * Default value is `true`.
         */
        openOnMouseOver: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return ResultActionsMenu;
}(Component_1.Component));
exports.ResultActionsMenu = ResultActionsMenu;
Initialization_1.Initialization.registerAutoCreateComponent(ResultActionsMenu);


/***/ }),

/***/ 650:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ResultActionsMenu__36d30dcb7330ecf06f4d.js.map