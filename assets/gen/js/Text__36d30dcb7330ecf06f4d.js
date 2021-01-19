webpackJsonpCoveo__temporary([57],{

/***/ 282:
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
__webpack_require__(671);
var GlobalExports_1 = __webpack_require__(3);
var Dom_1 = __webpack_require__(1);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
/**
 * The Text component embeds itself in a result template to output a simple text value.
 *
 * The only purpose of this component is to make it possible to easily add different text values to result templates
 * when using the Coveo JavaScript Search Interface Editor (see
 * [Interface Editor](https://docs.coveo.com/en/1852/)).
 *
 * If you are not designing a search interface using the Coveo JavaScript Search Interface Editor, using this component
 * is unnecessary.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    /**
     * Creates a new Text component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Text component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Text(element, options, bindings) {
        var _this = _super.call(this, element, Text.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Text, options);
        Dom_1.$$(_this.element).text(_this.options.value);
        _this.element.style.fontSize = _this.options.size;
        _this.element.style.fontStyle = _this.options.style;
        _this.element.style.color = _this.options.color;
        _this.element.style.fontWeight = _this.options.weight;
        _this.element.style.textAlign = _this.options.textAlign;
        _this.element.style.marginTop = _this.options.marginTop;
        _this.element.style.marginBottom = _this.options.marginBottom;
        _this.element.style.marginRight = _this.options.marginRight;
        _this.element.style.marginLeft = _this.options.marginLeft;
        _this.element.style.paddingTop = _this.options.paddingTop;
        _this.element.style.paddingBottom = _this.options.paddingBottom;
        _this.element.style.paddingLeft = _this.options.paddingLeft;
        _this.element.style.paddingRight = _this.options.paddingRight;
        return _this;
    }
    Text.ID = 'Text';
    Text.doExport = function () {
        GlobalExports_1.exportGlobally({
            Text: Text
        });
    };
    /**
     * @componentOptions
     */
    Text.options = {
        /**
         * Specifies the localized string value that the component should render.
         */
        value: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption(),
        /**
         * Specifies the size of the text (set as the `font-size` CSS property).
         */
        size: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the style of the text (set as the `font-style` CSS property).
         */
        style: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the color of the text (set as the `color` CSS property).
         */
        color: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the weight of the text (set as the `font-weight` CSS property).
         */
        weight: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the alignment of the text (set as the `text-align` CSS property).
         */
        textAlign: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the top margin of the text (set as the `margin-top` CSS property).
         */
        marginTop: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the bottom margin of the text (set as the `margin-bottom` CSS property).
         */
        marginBottom: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the left margin of the text (set as the `margin-left` CSS property).
         */
        marginLeft: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the right margin of the text (set as the `margin-right` CSS property).
         */
        marginRight: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the top padding of the text (set as the `padding-top` CSS property).
         */
        paddingTop: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the bottom padding of the text (set as the `padding-bottom` CSS property).
         */
        paddingBottom: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the left padding of the text (set as the `padding-left` CSS property).
         */
        paddingLeft: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the right padding of the text (set as the `padding-right` CSS property).
         */
        paddingRight: ComponentOptions_1.ComponentOptions.buildStringOption()
    };
    return Text;
}(Component_1.Component));
exports.Text = Text;
Initialization_1.Initialization.registerAutoCreateComponent(Text);


/***/ }),

/***/ 671:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Text__36d30dcb7330ecf06f4d.js.map