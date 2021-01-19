webpackJsonpCoveo__temporary([80],{

/***/ 257:
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
var QueryEvents_1 = __webpack_require__(11);
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
/**
 * The Logo component adds a clickable Coveo logo in the search interface.
 */
var Logo = /** @class */ (function (_super) {
    __extends(Logo, _super);
    /**
     * Creates a new Logo component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Logo component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Logo(element, options, bindings) {
        var _this = _super.call(this, element, Logo.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Logo, options);
        _this.buildLink();
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return _this.hide(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (data) { return _this.handleQuerySuccess(data); });
        return _this;
    }
    Logo.prototype.buildLink = function () {
        var link = Dom_1.$$('a', {
            className: 'coveo-powered-by coveo-footer-logo',
            href: 'https://www.coveo.com/',
            'aria-label': Strings_1.l('CoveoHomePage')
        }, SVGIcons_1.SVGIcons.icons.coveoPoweredBy);
        this.options.target && link.setAttribute('target', this.options.target);
        SVGDom_1.SVGDom.addClassToSVGInContainer(link.el, 'coveo-powered-by-svg');
        this.element.appendChild(link.el);
    };
    Logo.prototype.handleQuerySuccess = function (data) {
        data.results.results.length > 0 ? this.show() : this.hide();
    };
    Logo.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    Logo.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    Logo.ID = 'Logo';
    Logo.doExport = function () {
        GlobalExports_1.exportGlobally({
            Logo: Logo
        });
    };
    /**
     * The possible options for the component
     * @componentOptions
     */
    Logo.options = {
        /**
         * Specifies how the link to the Coveo website should be opened.
         *
         * Valid values supported are `_top`, `_blank`, `_self`, `_parent`.
         *
         * Default value is `undefined`, meaning standard browser behaviour for links will be respected.
         */
        target: ComponentOptions_1.ComponentOptions.buildStringOption()
    };
    return Logo;
}(Component_1.Component));
exports.Logo = Logo;
Initialization_1.Initialization.registerAutoCreateComponent(Logo);


/***/ })

});
//# sourceMappingURL=Logo__36d30dcb7330ecf06f4d.js.map