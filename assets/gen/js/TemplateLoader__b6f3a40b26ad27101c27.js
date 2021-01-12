webpackJsonpCoveo__temporary([77],{

/***/ 281:
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
var underscore_1 = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(1);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var TemplateComponentOptions_1 = __webpack_require__(61);
/**
 * The TemplateLoader component can load one result template into another. You should normally declare any reusable
 * result template outside of the {@link ResultList} component. Otherwise, the framework will evaluate the
 * `data-condition` of the reusable result template and possibly render it.
 *
 * **Example:**
 *
 * ```html
 * [ ... ]
 *
 * <!-- A reusable result template. Note that it is important to declare it outside of the ResultList component. -->
 * <script type='text/underscore' class='result-template' id='ReusableTemplate'>
 *   <table class='CoveoFieldTable'>
 *     <tr data-field='@source' data-caption='Source'></tr>
 *     <tr data-field='@percentScore' data-caption='Score'></tr>
 *   </table>
 * </script>
 *
 * [ ... ]
 *
 * <div class="CoveoResultList" data-wait-animation="fade" data-auto-select-fields-to-include="true">
 *
 *   <!-- A custom result template for Lithium messages. -->
 *   <script type='text/underscore' class='result-template' data-condition='raw.filetype == "lithiummessage"'>
 *     <div>
 *       <img class='CoveoIcon' data-small='true'>
 *       <a class='CoveoResultLink'></a>
 *       <div class='CoveoTemplateLoader' data-template-id='ReusableTemplate'></div>
 *     </div>
 *   </script>
 *
 *   <!-- A custom result template for images. -->
 *   <script type='text/underscore' class='result-template' data-condition='raw.filetype == "Image"'>
 *     <div>
 *       <img class='CoveoIcon' data-small='true'></img>
 *         <a class='CoveoResultLink'>
 *           <img class='CoveoThumbnail'>
 *         </a>
 *       <div class='CoveoTemplateLoader' data-template-id='ReusableTemplate'></div>
 *     </div>
 *   </script>
 * </div>
 *
 * [ ... ]
 * ```
 *
 * See [Result Templates](https://docs.coveo.com/en/413/).
 */
var TemplateLoader = /** @class */ (function (_super) {
    __extends(TemplateLoader, _super);
    /**
     * Creates a new TemplateLoader.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the TemplateLoader component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function TemplateLoader(element, options, bindings, result) {
        var _this = _super.call(this, element, TemplateLoader.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, TemplateLoader, options);
        _this.result = _this.result || _this.resolveResult();
        Assert_1.Assert.exists(_this.result);
        if (_this.options.condition != null) {
            var conditionFunction = new Function('obj', 'with(obj||{}){return ' + _this.options.condition + '}');
            if (conditionFunction(_this.result)) {
                _this.initialize();
            }
        }
        else {
            _this.initialize();
        }
        return _this;
    }
    TemplateLoader.prototype.initialize = function () {
        var _this = this;
        if (this.options.template != null) {
            var initOptions = this.searchInterface.options;
            var initParameters = {
                options: initOptions,
                bindings: this.bindings,
                result: this.result
            };
            var parents = Dom_1.$$(this.element).parents(Component_1.Component.computeCssClassName(TemplateLoader));
            underscore_1.each(parents, function (parent) {
                var clone = parent.cloneNode();
                Dom_1.$$(clone).empty();
                var outerHTMLParent = clone.outerHTML;
                Assert_1.Assert.check(outerHTMLParent.indexOf(_this.element.outerHTML) === -1, 'TemplateLoader cannot load a template into itself.');
            });
            this.element.innerHTML = this.options.template.instantiateToString(this.result, {
                checkCondition: false,
                responsiveComponents: this.bindings ? this.bindings.searchInterface.responsiveComponents : null
            });
            Initialization_1.Initialization.automaticallyCreateComponentsInside(this.element, initParameters);
        }
    };
    TemplateLoader.ID = 'TemplateLoader';
    TemplateLoader.doExport = function () {
        GlobalExports_1.exportGlobally({
            TemplateLoader: TemplateLoader
        });
    };
    /**
     * The possible options for a TemplateLoader.
     * @componentOptions
     */
    TemplateLoader.options = {
        /**
         * Specifies how to find the template. This can be either a CSS selector or an HTML `id` attribute.
         *
         * **Examples:**
         *
         * - With a CSS selector: `data-template-selector='.MySelector'`
         * - With an HTML `id`: `data-template-id='MyId'`
         */
        template: TemplateComponentOptions_1.TemplateComponentOptions.buildTemplateOption(),
        /**
         * Specifies the boolean condition that the result must satisfy in order for the template to load.
         *
         * **Example:**
         *
         * `data-condition='percentScore > 80'`
         */
        condition: ComponentOptions_1.ComponentOptions.buildStringOption()
    };
    return TemplateLoader;
}(Component_1.Component));
exports.TemplateLoader = TemplateLoader;
Initialization_1.Initialization.registerAutoCreateComponent(TemplateLoader);


/***/ })

});
//# sourceMappingURL=TemplateLoader__b6f3a40b26ad27101c27.js.map