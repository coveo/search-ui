webpackJsonpCoveo__temporary([45],{

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

/***/ 184:
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
var Initialization_1 = __webpack_require__(1);
var Dom_1 = __webpack_require__(2);
var QueryEvents_1 = __webpack_require__(10);
var GlobalExports_1 = __webpack_require__(3);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
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
        var link = Dom_1.$$('a', {
            className: 'coveo-powered-by coveo-footer-logo',
            href: 'http://www.coveo.com/'
        }, SVGIcons_1.SVGIcons.icons.coveoPoweredBy);
        SVGDom_1.SVGDom.addClassToSVGInContainer(link.el, 'coveo-powered-by-svg');
        _this.element.appendChild(link.el);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.noResults, function () { return _this.hide(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (data) {
            if (data.results.results.length > 0) {
                _this.show();
            }
            else {
                _this.hide();
            }
        });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return _this.hide(); });
        return _this;
    }
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
    Logo.options = {};
    return Logo;
}(Component_1.Component));
exports.Logo = Logo;
Initialization_1.Initialization.registerAutoCreateComponent(Logo);


/***/ })

});
//# sourceMappingURL=Logo__e88b07527d07df27a874.js.map