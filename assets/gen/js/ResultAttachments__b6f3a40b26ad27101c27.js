webpackJsonpCoveo__temporary([42],{

/***/ 268:
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
var DefaultResultAttachmentTemplate_1 = __webpack_require__(651);
var Utils_1 = __webpack_require__(4);
var QueryUtils_1 = __webpack_require__(21);
var Initialization_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(652);
var TemplateComponentOptions_1 = __webpack_require__(61);
/**
 * The `ResultAttachments` component renders attachments in a result set, for example when displaying emails. This
 * component is usable inside a result template when there is an active [`Folding`]{@link Folding} component in the
 * page.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
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

/***/ 651:
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
var Template_1 = __webpack_require__(27);
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

/***/ 652:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ResultAttachments__b6f3a40b26ad27101c27.js.map