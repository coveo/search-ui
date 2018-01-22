webpackJsonpCoveo__temporary([22],{

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

/***/ 190:
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
var DefaultResultAttachmentTemplate_1 = __webpack_require__(410);
var Utils_1 = __webpack_require__(4);
var QueryUtils_1 = __webpack_require__(19);
var Initialization_1 = __webpack_require__(1);
var Assert_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(411);
var TemplateComponentOptions_1 = __webpack_require__(74);
/**
 * The `ResultAttachments` component renders attachments in a result set, for example when displaying emails. This
 * component is usable inside a result template when there is an active [`Folding`]{@link Folding} component in the
 * page.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 * @notSupportedIn salesforcefree
 */
var ResultAttachments = /** @class */ (function (_super) {
    __extends(ResultAttachments, _super);
    /**
     * Creates a new `ResultAttachments` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultAttachments` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     * @param attachmentLevel The nesting depth.
     */
    function ResultAttachments(element, options, bindings, result, attachmentLevel) {
        if (attachmentLevel === void 0) { attachmentLevel = 0; }
        var _this = _super.call(this, element, ResultAttachments.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.attachmentLevel = attachmentLevel;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultAttachments, options);
        _this.attachments = result.attachments;
        if (Utils_1.Utils.isNonEmptyArray(_this.attachments)) {
            _this.renderAttachments();
        }
        return _this;
    }
    ResultAttachments.prototype.renderAttachments = function () {
        var _this = this;
        _.each(this.attachments, function (attachment) {
            QueryUtils_1.QueryUtils.setStateObjectOnQueryResult(_this.queryStateModel.get(), attachment);
            QueryUtils_1.QueryUtils.setSearchInterfaceObjectOnQueryResult(_this.searchInterface, attachment);
            var subTemplatePromise = _this.attachmentLevel > 0
                ? _this.options.subResultTemplate.instantiateToElement(attachment)
                : _this.options.resultTemplate.instantiateToElement(attachment);
            subTemplatePromise.then(function (container) {
                _this.autoCreateComponentsInsideResult(container, _.extend({}, attachment, { attachments: [] }));
                Dom_1.$$(container).addClass('coveo-result-attachments-container');
                _this.element.appendChild(container);
                if (_this.attachmentHasSubAttachment(attachment) && _this.attachmentLevel < _this.options.maximumAttachmentLevel) {
                    var childAttachmentContainer = Dom_1.$$('div').el;
                    container.appendChild(childAttachmentContainer);
                    new ResultAttachments(childAttachmentContainer, _this.options, _this.bindings, attachment, _this.attachmentLevel + 1);
                }
            });
        });
    };
    ResultAttachments.prototype.attachmentHasSubAttachment = function (attachment) {
        if (Utils_1.Utils.isNonEmptyArray(attachment.attachments)) {
            return true;
        }
        else if (Utils_1.Utils.isNonEmptyArray(attachment.childResults)) {
            attachment.attachments = attachment.childResults;
            return true;
        }
        else {
            return false;
        }
    };
    ResultAttachments.prototype.autoCreateComponentsInsideResult = function (element, result) {
        Assert_1.Assert.exists(element);
        var initOptions = this.searchInterface.options;
        var initParameters = {
            options: initOptions,
            bindings: this.getBindings(),
            result: result
        };
        Initialization_1.Initialization.automaticallyCreateComponentsInside(element, initParameters, [ResultAttachments.ID]);
    };
    ResultAttachments.ID = 'ResultAttachments';
    ResultAttachments.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultAttachments: ResultAttachments,
            DefaultResultAttachmentTemplate: DefaultResultAttachmentTemplate_1.DefaultResultAttachmentTemplate
        });
    };
    /**
     * The options for the component
     * @componentOptions
     */
    ResultAttachments.options = {
        /**
         * Specifies the template to use to render each attachment for a top result.
         *
         * You can specify a previously registered template to use either by referring to its HTML `id` attribute or to a
         * CSS selector (see {@link TemplateCache}).
         *
         * **Examples:**
         *
         * Specifying a previously registered template by referring to its HTML `id` attribute:
         *
         * ```html
         * <div class="CoveoResultAttachments" data-result-template-id="Foo"></div>
         * ```
         *
         * Specifying a previously registered template by referring to a CSS selector:
         *
         * ```html
         * <div class='CoveoResultAttachments' data-result-template-selector=".Foo"></div>
         * ```
         *
         * If you do not specify a custom folding template, the component uses the default result attachment template.
         */
        resultTemplate: TemplateComponentOptions_1.TemplateComponentOptions.buildTemplateOption({
            defaultFunction: function (e) { return new DefaultResultAttachmentTemplate_1.DefaultResultAttachmentTemplate(); }
        }),
        /**
         * Specifies the template to use to render sub-attachments, which are attachments within attachments, for example
         * when multiple files are embedded within a `.zip` attachment.
         *
         * Sub-attachments can themselves contain sub-attachments, and so on up to a certain level (see the
         * [`maximumAttachmentLevel`]{@link ResultAttachments.options.maximumAttachmentLevel} option).
         *
         * You can specify a previously registered template to use either by referring to its HTML `id` attribute or to a
         * CSS selector (see {@link TemplateCache}).
         *
         * **Example:**
         *
         * Specifying a previously registered template by referring to its HTML `id` attribute:
         *
         * ```html
         * <div class="CoveoResultAttachments" data-sub-result-template-id="Foo"></div>
         * ```
         *
         * Specifying a previously registered template by referring to a CSS selector:
         *
         * ```html
         * <div class="CoveoResultAttachments" data-sub-result-template-selector=".Foo"></div>
         * ```
         *
         * By default, this option uses the same template you specify for the
         * [`resultTemplate`]{@link ResultAttachments.options.resultTemplate} option.
         */
        subResultTemplate: TemplateComponentOptions_1.TemplateComponentOptions.buildTemplateOption({
            postProcessing: function (value, options) { return (value != null ? value : options.resultTemplate); }
        }),
        /**
         * Specifies the maximum nesting depth. Beyond this depth, the component stops rendering sub-attachments.
         *
         * Default value is `5`. Minimum value is `0`.
         */
        maximumAttachmentLevel: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0 })
    };
    return ResultAttachments;
}(Component_1.Component));
exports.ResultAttachments = ResultAttachments;
Initialization_1.Initialization.registerAutoCreateComponent(ResultAttachments);


/***/ }),

/***/ 410:
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
var DefaultResultAttachmentTemplate = /** @class */ (function (_super) {
    __extends(DefaultResultAttachmentTemplate, _super);
    function DefaultResultAttachmentTemplate() {
        return _super.call(this) || this;
    }
    DefaultResultAttachmentTemplate.prototype.instantiateToString = function (queryResult) {
        return '<div><span class="CoveoIcon"></span> <a class="CoveoResultLink"></a> <span class="CoveoQuickview"></span></div>';
    };
    return DefaultResultAttachmentTemplate;
}(Template_1.Template));
exports.DefaultResultAttachmentTemplate = DefaultResultAttachmentTemplate;


/***/ }),

/***/ 411:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

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
//# sourceMappingURL=ResultAttachments__9d54d02246a5662671fe.js.map