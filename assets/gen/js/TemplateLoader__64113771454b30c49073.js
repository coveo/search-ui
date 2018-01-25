webpackJsonpCoveo__temporary([32],{

/***/ 144:
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
var DefaultResultTemplate_1 = __webpack_require__(88);
var Assert_1 = __webpack_require__(5);
var _ = __webpack_require__(0);
var TemplateList = /** @class */ (function (_super) {
    __extends(TemplateList, _super);
    function TemplateList(templates) {
        var _this = _super.call(this) || this;
        _this.templates = templates;
        Assert_1.Assert.exists(templates);
        return _this;
    }
    TemplateList.prototype.instantiateToString = function (object, instantiateOptions) {
        if (instantiateOptions === void 0) { instantiateOptions = {}; }
        var merged = new Template_1.DefaultInstantiateTemplateOptions().merge(instantiateOptions);
        var filteredTemplates = _.reject(this.templates, function (t) { return t.role != null; });
        for (var i = 0; i < filteredTemplates.length; i++) {
            var result = filteredTemplates[i].instantiateToString(object, merged);
            if (result != null) {
                return result;
            }
        }
        return this.getFallbackTemplate().instantiateToString(object, instantiateOptions);
    };
    TemplateList.prototype.instantiateToElement = function (object, instantiateOptions) {
        if (instantiateOptions === void 0) { instantiateOptions = {}; }
        var merged = new Template_1.DefaultInstantiateTemplateOptions().merge(instantiateOptions);
        var filteredTemplates = _.reject(this.templates, function (t) { return t.role != null; });
        for (var i = 0; i < filteredTemplates.length; i++) {
            var promiseOfHTMLElement = filteredTemplates[i].instantiateToElement(object, merged);
            if (promiseOfHTMLElement != null) {
                return promiseOfHTMLElement;
            }
        }
        return this.getFallbackTemplate().instantiateToElement(object, merged);
    };
    TemplateList.prototype.getFields = function () {
        return _.reduce(this.templates, function (fields, template) { return fields.concat(template.getFields()); }, []);
    };
    TemplateList.prototype.getType = function () {
        return 'TemplateList';
    };
    TemplateList.prototype.getFallbackTemplate = function () {
        return new DefaultResultTemplate_1.DefaultResultTemplate();
    };
    return TemplateList;
}(Template_1.Template));
exports.TemplateList = TemplateList;


/***/ }),

/***/ 203:
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
var Assert_1 = __webpack_require__(5);
var Initialization_1 = __webpack_require__(1);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var TemplateComponentOptions_1 = __webpack_require__(74);
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
 * See [Result Templates](https://developers.coveo.com/x/aIGfAQ).
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
            _.each(parents, function (parent) {
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


/***/ }),

/***/ 74:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TemplateCache_1 = __webpack_require__(58);
var TemplateList_1 = __webpack_require__(144);
var UnderscoreTemplate_1 = __webpack_require__(48);
var HtmlTemplate_1 = __webpack_require__(77);
var ComponentOptions_1 = __webpack_require__(7);
var Assert_1 = __webpack_require__(5);
var Utils_1 = __webpack_require__(4);
var underscore_1 = __webpack_require__(0);
var TemplateComponentOptions = /** @class */ (function () {
    function TemplateComponentOptions() {
    }
    /**
     * Builds a template option.
     *
     * The option accepts a CSS selector matching a valid template. This selector can either be a class, or an ID
     * selector.
     *
     * When building a template option using an ID selector, the matching template must be registered in the
     * [`TemplateCache`]{@link TemplateCache}, however.
     *
     * **Markup Examples:**
     *
     * > `data-foo-id="#bar"`
     *
     * > `data-foo-selector=".bar"`
     *
     * @param optionArgs The arguments to apply when building the option.
     * @returns {Template} The resulting option value.
     */
    TemplateComponentOptions.buildTemplateOption = function (optionArgs) {
        return ComponentOptions_1.ComponentOptions.buildOption(ComponentOptions_1.ComponentOptionsType.TEMPLATE, TemplateComponentOptions.loadTemplateOption, optionArgs);
    };
    TemplateComponentOptions.loadTemplateOption = function (element, name, option, doc) {
        if (doc === void 0) { doc = document; }
        var template;
        // Attribute: template selector
        var selectorAttr = option.selectorAttr || ComponentOptions_1.ComponentOptions.attrNameFromName(name, option) + '-selector';
        var selector = element.getAttribute(selectorAttr) || ComponentOptions_1.ComponentOptions.getAttributeFromAlias(element, option);
        if (selector != null) {
            var templateElement = doc.querySelector(selector);
            if (templateElement != null) {
                template = TemplateComponentOptions.createResultTemplateFromElement(templateElement);
            }
        }
        // Attribute: template id
        if (template == null) {
            var idAttr = option.idAttr || ComponentOptions_1.ComponentOptions.attrNameFromName(name, option) + '-id';
            var id = element.getAttribute(idAttr) || ComponentOptions_1.ComponentOptions.getAttributeFromAlias(element, option);
            if (id != null) {
                template = TemplateComponentOptions.loadResultTemplateFromId(id);
            }
        }
        // Child
        if (template == null) {
            var childSelector = option.childSelector;
            if (childSelector == null) {
                childSelector = '.' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
            }
            template = TemplateComponentOptions.loadChildrenResultTemplateFromSelector(element, childSelector);
        }
        return template;
    };
    TemplateComponentOptions.createResultTemplateFromElement = function (element) {
        Assert_1.Assert.exists(element);
        var type = element.getAttribute('type');
        var mimeTypes = 'You must specify the type of template. Valid values are:' +
            ' ' +
            UnderscoreTemplate_1.UnderscoreTemplate.mimeTypes.toString() +
            ' ' +
            HtmlTemplate_1.HtmlTemplate.mimeTypes.toString();
        Assert_1.Assert.check(Utils_1.Utils.isNonEmptyString(type), mimeTypes);
        if (underscore_1.indexOf(UnderscoreTemplate_1.UnderscoreTemplate.mimeTypes, type.toLowerCase()) != -1) {
            return UnderscoreTemplate_1.UnderscoreTemplate.create(element);
        }
        else if (underscore_1.indexOf(HtmlTemplate_1.HtmlTemplate.mimeTypes, type.toLowerCase()) != -1) {
            return new HtmlTemplate_1.HtmlTemplate(element);
        }
        else {
            Assert_1.Assert.fail('Cannot guess template type from attribute: ' + type + '. Valid values are ' + mimeTypes);
            return undefined;
        }
    };
    TemplateComponentOptions.loadResultTemplateFromId = function (templateId) {
        return Utils_1.Utils.isNonEmptyString(templateId) ? TemplateCache_1.TemplateCache.getTemplate(templateId) : null;
    };
    TemplateComponentOptions.loadChildrenResultTemplateFromSelector = function (element, selector) {
        var foundElements = ComponentOptions_1.ComponentOptions.loadChildrenHtmlElementFromSelector(element, selector);
        if (foundElements.length > 0) {
            return new TemplateList_1.TemplateList(underscore_1.compact(foundElements.map(function (element) { return TemplateComponentOptions.createResultTemplateFromElement(element); })));
        }
        return null;
    };
    return TemplateComponentOptions;
}());
exports.TemplateComponentOptions = TemplateComponentOptions;


/***/ })

});
//# sourceMappingURL=TemplateLoader__64113771454b30c49073.js.map