webpackJsonpCoveo__temporary([71],{

/***/ 249:
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
var Assert_1 = __webpack_require__(5);
var HighlightUtils_1 = __webpack_require__(68);
var Initialization_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(606);
/**
 * The Excerpt component renders an excerpt of its associated result and highlights the keywords from the query using
 * the appropriate template helpers.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 */
var Excerpt = /** @class */ (function (_super) {
    __extends(Excerpt, _super);
    /**
     * Creates a new Excerpt component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Excerpt component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function Excerpt(element, options, bindings, result) {
        var _this = _super.call(this, element, Excerpt.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Excerpt, options);
        _this.result = _this.result || _this.resolveResult();
        Assert_1.Assert.exists(_this.result);
        _this.element.innerHTML = HighlightUtils_1.HighlightUtils.highlightString(_this.result.excerpt, _this.result.excerptHighlights, null, 'coveo-highlight');
        return _this;
    }
    Excerpt.ID = 'Excerpt';
    Excerpt.doExport = function () {
        GlobalExports_1.exportGlobally({
            Excerpt: Excerpt
        });
    };
    return Excerpt;
}(Component_1.Component));
exports.Excerpt = Excerpt;
Initialization_1.Initialization.registerAutoCreateComponent(Excerpt);


/***/ }),

/***/ 606:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Excerpt__b6f3a40b26ad27101c27.js.map