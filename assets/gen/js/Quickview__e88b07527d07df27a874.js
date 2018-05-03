webpackJsonpCoveo__temporary([15],{

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

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The `QuickviewEvents` static class contains the string definitions of all events that strongly relate to the
 * [`Quickview`]{@link Quickview} component.
 */
var QuickviewEvents = /** @class */ (function () {
    function QuickviewEvents() {
    }
    /**
     * Triggered by the [`QuickviewDocument`]{@link QuickviewDocument} component when the content to display in the
     * quickview modal window has just finished downloading.
     *
     * The [`Quickview`]{@link Quickview} component listens to this event to know when to remove its loading animation.
     *
     * All `quickviewLoaded` event handlers receive a [`QuickviewLoadedEventArgs`]{@link IQuickviewLoadedEventArgs} object
     * as an argument.
     *
     * @type {string} The string value is `quickviewLoaded`.
     */
    QuickviewEvents.quickviewLoaded = 'quickviewLoaded';
    /**
     * Triggered by the [`QuickviewDocument`]{@link QuickviewDocument} component when the end user has just clicked the
     * **Quickview** button/link to open the quickview modal window.
     *
     * This event allows external code to modify the terms to highlight before the content of the quickview modal window
     * is rendered.
     *
     * All `openQuickview` event handlers receive an
     * [`OpenQuickviewEventArgs`]{@link ResultListEvents.IOpenQuickviewEventArgs} object as an argument.
     *
     * @type {string} The string value is `openQuickview`.
     */
    QuickviewEvents.openQuickview = 'openQuickview';
    return QuickviewEvents;
}());
exports.QuickviewEvents = QuickviewEvents;


/***/ }),

/***/ 193:
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
var DomUtils_1 = __webpack_require__(62);
var Dom_1 = __webpack_require__(2);
var DefaultQuickviewTemplate_1 = __webpack_require__(408);
var ResultListEvents_1 = __webpack_require__(32);
var StringUtils_1 = __webpack_require__(18);
var QuickviewDocument_1 = __webpack_require__(409);
var QueryStateModel_1 = __webpack_require__(12);
var QuickviewEvents_1 = __webpack_require__(153);
var Initialization_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(20);
var ExternalModulesShim_1 = __webpack_require__(23);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(410);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Utils_1 = __webpack_require__(4);
var TemplateComponentOptions_1 = __webpack_require__(51);
/**
 * The `Quickview` component renders a button/link which the end user can click to open a modal box containing certain
 * information about a result. Most of the time, this component references a
 * [`QuickviewDocument`]{@link QuickviewDocument} in its [`contentTemplate`]{@link Quickview.options.contentTemplate}.
 *
 * **Note:**
 * > - You can change the appearance of the `Quickview` link/button by adding elements in the inner HTML of its `div`.
 * > - You can change the content of the `Quickview` modal box link by specifying a template `id` or CSS selector (see
 * > the [`contentTemplate`]{@link Quickview.options.contentTemplate} option).
 *
 * **Example:**
 * ```html
 * [ ... ]
 *
 * <script class='result-template' type='text/underscore' id='myContentTemplateId'>
 *   <div>
 *     <span>This content will be displayed when then end user opens the quickview modal box. It could also include other Coveo component, and use core helpers.</span>
 *     <table class="CoveoFieldTable">
 *       <tr data-field="@liboardshorttitle" data-caption="Board" />
 *       <tr data-field="@licategoryshorttitle" data-caption="Category" />
 *       <tr data-field="@sysauthor" data-caption="Author" />
 *     </table>
 *   </div>
 * </script>
 *
 * [ ... ]
 *
 * <div class='CoveoResultList'>
 *   <script class='result-template' type='text/underscore' id='myResultTemplateId'>
 *
 *   [ ... ]
 *
 *     <!-- The `myContentTemplateId` template applies when displaying content in the quickview modal box. -->
 *       <div class='CoveoQuickview' data-template-id='myContentTemplateId'>
 *         <!-- This changes the appearance of the Quickview button itself in the results -->
 *         <span>Click here for a quickview</span>
 *       </div>
 *   </script>
 *
 *   [ ... ]
 *
 * <!-- Note that simply including `<div class='CoveoQuickview'></div>` in the markup will be enough most of the time, since the component includes a default template and a default button appearance. -->
 * ```
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
var Quickview = /** @class */ (function (_super) {
    __extends(Quickview, _super);
    /**
     * Creates a new `Quickview` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `Quickview` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     * @param ModalBox The quickview modal box.
     */
    function Quickview(element, options, bindings, result, ModalBox) {
        if (ModalBox === void 0) { ModalBox = ExternalModulesShim_1.ModalBox; }
        var _this = _super.call(this, element, Quickview.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.ModalBox = ModalBox;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Quickview, options);
        if (_this.options.contentTemplate == null) {
            _this.options.contentTemplate = new DefaultQuickviewTemplate_1.DefaultQuickviewTemplate();
        }
        // If there is no content inside the Quickview div,
        // we need to add something that will show up in the result template itself
        if (/^\s*$/.test(_this.element.innerHTML)) {
            var iconForQuickview = Dom_1.$$('div', { className: 'coveo-icon-for-quickview' }, SVGIcons_1.SVGIcons.icons.quickview);
            SVGDom_1.SVGDom.addClassToSVGInContainer(iconForQuickview.el, 'coveo-icon-for-quickview-svg');
            var captionForQuickview = Dom_1.$$('div', { className: 'coveo-caption-for-icon', tabindex: 0 }, 'Quickview'.toLocaleString()).el;
            var div = Dom_1.$$('div');
            div.append(iconForQuickview.el);
            div.append(captionForQuickview);
            Dom_1.$$(_this.element).append(div.el);
        }
        _this.bindClick(result);
        if (_this.bindings.resultElement) {
            _this.bind.on(_this.bindings.resultElement, ResultListEvents_1.ResultListEvents.openQuickview, function () { return _this.open(); });
        }
        return _this;
    }
    /**
     * Opens the `Quickview` modal box.
     */
    Quickview.prototype.open = function () {
        var _this = this;
        if (this.modalbox == null) {
            // To prevent the keyboard from opening on mobile if the search bar has focus
            Quickview.resultCurrentlyBeingRendered = this.result;
            Dom_1.$$(document.activeElement).trigger('blur');
            var openerObject_1 = this.prepareOpenQuickviewObject();
            this.createModalBox(openerObject_1).then(function () {
                _this.bindQuickviewEvents(openerObject_1);
                _this.animateAndOpen();
                _this.logUsageAnalyticsEvent();
                _this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.quickview, _this.getHashId());
                Quickview.resultCurrentlyBeingRendered = null;
            });
        }
    };
    /**
     * Closes the `Quickview` modal box.
     */
    Quickview.prototype.close = function () {
        if (this.modalbox != null) {
            this.modalbox.close();
            this.modalbox = null;
        }
    };
    Quickview.prototype.getHashId = function () {
        return this.result.queryUid + '.' + this.result.index + '.' + StringUtils_1.StringUtils.hashCode(this.result.uniqueId);
    };
    Quickview.prototype.logUsageAnalyticsEvent = function () {
        this.usageAnalytics.logClickEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentQuickview, {
            author: Utils_1.Utils.getFieldValue(this.result, 'author'),
            documentURL: this.result.clickUri,
            documentTitle: this.result.title
        }, this.result, this.element);
    };
    Quickview.prototype.bindClick = function (result) {
        var _this = this;
        if (typeof result.hasHtmlVersion == 'undefined' || result.hasHtmlVersion || this.options.alwaysShow) {
            var clickAction = function () { return _this.open(); };
            Dom_1.$$(this.element).on('click', clickAction);
            this.bind.on(this.element, 'keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, clickAction));
        }
        else {
            this.element.style.display = 'none';
        }
    };
    Quickview.prototype.bindQuickviewEvents = function (openerObject) {
        Dom_1.$$(this.modalbox.content).on(QuickviewEvents_1.QuickviewEvents.quickviewLoaded, function () {
            if (openerObject.loadingAnimation instanceof HTMLElement) {
                Dom_1.$$(openerObject.loadingAnimation).remove();
            }
            else if (openerObject.loadingAnimation instanceof Promise) {
                openerObject.loadingAnimation.then(function (anim) {
                    Dom_1.$$(anim).remove();
                });
            }
        });
    };
    Quickview.prototype.animateAndOpen = function () {
        var quickviewDocument = Dom_1.$$(this.modalbox.modalBox).find('.' + Component_1.Component.computeCssClassName(QuickviewDocument_1.QuickviewDocument));
        if (quickviewDocument) {
            Initialization_1.Initialization.dispatchNamedMethodCallOrComponentCreation('open', quickviewDocument, null);
        }
    };
    Quickview.prototype.createModalBox = function (openerObject) {
        var _this = this;
        var computedModalBoxContent = Dom_1.$$('div');
        computedModalBoxContent.addClass('coveo-computed-modal-box-content');
        return openerObject.content.then(function (builtContent) {
            computedModalBoxContent.append(builtContent.el);
            var title = DomUtils_1.DomUtils.getQuickviewHeader(_this.result, {
                showDate: _this.options.showDate,
                title: _this.options.title
            }, _this.bindings).el;
            _this.modalbox = _this.ModalBox.open(computedModalBoxContent.el, {
                title: title,
                className: 'coveo-quick-view',
                validation: function () {
                    _this.closeQuickview();
                    return true;
                },
                body: _this.element.ownerDocument.body,
                sizeMod: 'big'
            });
            return computedModalBoxContent;
        });
    };
    Quickview.prototype.prepareOpenQuickviewObject = function () {
        var loadingAnimation = this.options.loadingAnimation;
        return {
            loadingAnimation: loadingAnimation,
            content: this.prepareQuickviewContent(loadingAnimation)
        };
    };
    Quickview.prototype.prepareQuickviewContent = function (loadingAnimation) {
        var _this = this;
        return this.options.contentTemplate.instantiateToElement(this.result).then(function (built) {
            var content = Dom_1.$$(built);
            var initOptions = _this.searchInterface.options;
            var initParameters = {
                options: initOptions,
                bindings: _this.getBindings(),
                result: _this.result
            };
            return Initialization_1.Initialization.automaticallyCreateComponentsInside(content.el, initParameters).initResult.then(function () {
                if (content.find('.' + Component_1.Component.computeCssClassName(QuickviewDocument_1.QuickviewDocument)) != undefined && _this.options.enableLoadingAnimation) {
                    if (loadingAnimation instanceof HTMLElement) {
                        content.prepend(loadingAnimation);
                    }
                    else if (loadingAnimation instanceof Promise) {
                        loadingAnimation.then(function (anim) {
                            content.prepend(anim);
                        });
                    }
                }
                return content;
            });
        });
    };
    Quickview.prototype.closeQuickview = function () {
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.quickview, '');
    };
    Quickview.ID = 'Quickview';
    Quickview.doExport = function () {
        GlobalExports_1.exportGlobally({
            Quickview: Quickview,
            QuickviewDocument: QuickviewDocument_1.QuickviewDocument
        });
    };
    /**
     * @componentOptions
     */
    Quickview.options = {
        /**
         * Specifies whether to always show the `Quickview` button/link, even when the index body of an item is empty.
         *
         * In such cases, the [`contentTemplate`]{@link Quickview.options.contentTemplate} defines what appears in the
         * `Quickview` modal box. Consequently, if there is no quickview for the item, you *MUST* specify a custom
         * `contentTemplate`, otherwise the component will throw an error when opened.
         *
         * Default value is `false`.
         */
        alwaysShow: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies the title that should appear in the `Quickview` modal box header.
         *
         * Default value is undefined, which is equivalent to the empty string.
         */
        title: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies whether to display the item date in the `Quickview` modal box header.
         *
         * Default value is `true`.
         */
        showDate: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to enable the loading animation.
         *
         * See also [`loadingAnimation`]{Quickview.options.loadingAnimation}.
         *
         * Default value is `true`.
         */
        enableLoadingAnimation: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies a custom template to use when displaying content in the `Quickview` modal box.
         *
         * **Note:**
         * > You can use [`CoreHelpers`]{@link ICoreHelpers} methods in your content template.
         *
         * You can specify a previously registered template to use either by referring to its HTML `id` attribute or to a
         * CSS selector (see [`TemplateCache`]{@link TemplateCache}).
         *
         * **Example:**
         *
         * * Specifying a previously registered template by referring to its HTML `id` attribute:
         *
         * ```html
         * <div class="CoveoQuickview" data-template-id="myContentTemplateId"></div>
         * ```
         *
         * * Specifying a previously registered template by referring to a CSS selector:
         *
         * ```html
         * <div class='CoveoQuickview' data-template-selector=".myContentTemplateSelector"></div>
         * ```
         *
         * If you do not specify a custom content template, the component uses its default template.
         */
        contentTemplate: TemplateComponentOptions_1.TemplateComponentOptions.buildTemplateOption({
            selectorAttr: 'data-template-selector',
            idAttr: 'data-template-id'
        }),
        /**
         * If [`enableLoadingAnimation`]{@link Quickview.options.enableLoadingAnimation} is `true`, specifies a custom
         * animation to display while the content of the quickview modal window is loading. You can either specify the CSS
         * selector of the HTML element you wish to display, or the `id` of a previously registered template (see
         * [`TemplateCache`]{@link TemplateCache}).
         *
         * See [Branding Customization - Customizing the Quickview Loading Animation](https://developers.coveo.com/x/EoGfAQ#BrandingCustomization-CustomizingtheQuickviewLoadingAnimation).
         *
         * **Examples:**
         *
         * * Specifying the CSS selector of the HTML element to display:
         *
         * ```html
         * <div class="CoveoQuickview" data-loading-animation-selector=".my-loading-animation"></div>
         * ```
         *
         * * Specifying the `id` of a previously registered template:
         *
         * ```html
         * <div class="CoveoQuickview" data-loading-animation-template-id="my-loading-animation-template"></div>
         * ```
         *
         * By default, the loading animation is a Coveo animation, which you can customize with CSS (see
         * [Branding Customization - Customizing the Default Loading Animation](https://developers.coveo.com/x/EoGfAQ#BrandingCustomization-CustomizingtheDefaultLoadingAnimation).
         */
        loadingAnimation: ComponentOptions_1.ComponentOptions.buildOption(ComponentOptions_1.ComponentOptionsType.NONE, function (element) {
            var loadingAnimationSelector = element.getAttribute('data-loading-animation-selector');
            if (loadingAnimationSelector != null) {
                var loadingAnimation = Dom_1.$$(document.documentElement).find(loadingAnimationSelector);
                if (loadingAnimation != null) {
                    Dom_1.$$(loadingAnimation).detach();
                    return loadingAnimation;
                }
            }
            var id = element.getAttribute('data-loading-animation-template-id');
            if (id != null) {
                var loadingAnimationTemplate = TemplateComponentOptions_1.TemplateComponentOptions.loadResultTemplateFromId(id);
                if (loadingAnimationTemplate) {
                    return loadingAnimationTemplate.instantiateToElement(undefined, {
                        checkCondition: false
                    });
                }
            }
            return DomUtils_1.DomUtils.getBasicLoadingAnimation();
        })
    };
    Quickview.resultCurrentlyBeingRendered = null;
    return Quickview;
}(Component_1.Component));
exports.Quickview = Quickview;
Initialization_1.Initialization.registerAutoCreateComponent(Quickview);


/***/ }),

/***/ 408:
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
var DefaultQuickviewTemplate = /** @class */ (function (_super) {
    __extends(DefaultQuickviewTemplate, _super);
    function DefaultQuickviewTemplate() {
        return _super.call(this) || this;
    }
    DefaultQuickviewTemplate.prototype.instantiateToString = function (queryResult) {
        return '<div class="coveo-quick-view-full-height"><div class="CoveoQuickviewDocument"></div></div>';
    };
    return DefaultQuickviewTemplate;
}(Template_1.Template));
exports.DefaultQuickviewTemplate = DefaultQuickviewTemplate;


/***/ }),

/***/ 409:
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
var Dom_1 = __webpack_require__(2);
var QuickviewEvents_1 = __webpack_require__(153);
var DeviceUtils_1 = __webpack_require__(21);
var Utils_1 = __webpack_require__(4);
var ColorUtils_1 = __webpack_require__(103);
var Initialization_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(8);
var _ = __webpack_require__(0);
var HIGHLIGHT_PREFIX = 'CoveoHighlight';
/**
 * The `QuickviewDocument` component normally exists within a [`Quickview`]{@link Quickview} component. The sole purpose
 * of this component is to add an `<iframe>` which loads the correct HTML version of the current item.
 *
 * The default [`contentTemplate`]{@link Quickview.options.contentTemplate} of the
 * `Quickview` component includes the `QuickviewDocument` component.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
var QuickviewDocument = /** @class */ (function (_super) {
    __extends(QuickviewDocument, _super);
    /**
     * Creates a new `QuickviewDocument` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `QuickviewDocument` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The current result.
     */
    function QuickviewDocument(element, options, bindings, result) {
        var _this = _super.call(this, element, QuickviewDocument.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, QuickviewDocument, options);
        _this.result = result || _this.resolveResult();
        _this.termsToHighlightWereModified = false;
        Assert_1.Assert.exists(_this.result);
        return _this;
    }
    QuickviewDocument.prototype.createDom = function () {
        var container = Dom_1.$$('div');
        container.addClass('coveo-quickview-document');
        this.element.appendChild(container.el);
        this.header = this.buildHeader();
        this.iframe = this.buildIFrame();
        container.append(this.header.el);
        container.append(this.iframe.el);
    };
    QuickviewDocument.prototype.open = function () {
        var _this = this;
        this.ensureDom();
        var beforeLoad = new Date().getTime();
        var iframe = this.iframe.find('iframe');
        iframe.src = 'about:blank';
        var endpoint = this.queryController.getEndpoint();
        var termsToHighlight = _.keys(this.result.termsToHighlight);
        var dataToSendOnOpenQuickView = {
            termsToHighlight: termsToHighlight
        };
        Dom_1.$$(this.element).trigger(QuickviewEvents_1.QuickviewEvents.openQuickview, dataToSendOnOpenQuickView);
        this.checkIfTermsToHighlightWereModified(dataToSendOnOpenQuickView.termsToHighlight);
        var queryObject = _.extend({}, this.getBindings().queryController.getLastQuery());
        if (this.termsToHighlightWereModified) {
            this.handleTermsToHighlight(dataToSendOnOpenQuickView.termsToHighlight, queryObject);
        }
        var callOptions = {
            queryObject: queryObject,
            requestedOutputSize: this.options.maximumDocumentSize
        };
        endpoint
            .getDocumentHtml(this.result.uniqueId, callOptions)
            .then(function (html) {
            // If the contentDocument is null at this point it means that the Quick View
            // was closed before we've finished loading it. In this case do nothing.
            if (iframe.contentDocument == null) {
                return;
            }
            _this.renderHTMLDocument(iframe, html);
            _this.triggerQuickviewLoaded(beforeLoad);
        })
            .catch(function (error) {
            // If the contentDocument is null at this point it means that the Quick View
            // was closed before we've finished loading it. In this case do nothing.
            if (iframe.contentDocument == null) {
                return;
            }
            if (error.status != 0) {
                _this.renderErrorReport(iframe, error.status);
                _this.triggerQuickviewLoaded(beforeLoad);
            }
            else {
                iframe.onload = function () {
                    _this.triggerQuickviewLoaded(beforeLoad);
                };
                iframe.src = endpoint.getViewAsHtmlUri(_this.result.uniqueId, callOptions);
            }
        });
    };
    QuickviewDocument.prototype.renderHTMLDocument = function (iframe, html) {
        var _this = this;
        iframe.onload = function () {
            _this.computeHighlights(iframe.contentWindow);
            // Remove white border for new Quickview
            if (_this.isNewQuickviewDocument(iframe.contentWindow)) {
                var body = Dom_1.$$(_this.element).find('iframe');
                if (body) {
                    body.style.padding = '0';
                    var header = Dom_1.$$(_this.element).find('.coveo-quickview-header');
                    header.style.paddingTop = '10';
                    header.style.paddingLeft = '10';
                }
            }
            if (Dom_1.$$(_this.element).find('.coveo-quickview-header').innerHTML == '') {
                Dom_1.$$(_this.element).find('.coveo-quickview-header').style.display = 'none';
            }
        };
        this.writeToIFrame(iframe, html);
        this.wrapPreElementsInIframe(iframe);
    };
    QuickviewDocument.prototype.renderErrorReport = function (iframe, errorStatus) {
        var errorString = '';
        if (errorStatus == 400) {
            errorString = 'NoQuickview';
        }
        else {
            errorString = 'OopsError';
        }
        var errorMessage = "<html><body style='font-family: Arimo, 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: none;' >" + Strings_1.l(errorString) + " </body></html>";
        this.writeToIFrame(iframe, errorMessage);
    };
    QuickviewDocument.prototype.writeToIFrame = function (iframe, content) {
        var toWrite = content;
        if (content instanceof HTMLDocument) {
            _.each(Dom_1.$$(content.body).findAll('a'), function (link) {
                link.setAttribute('target', '_top');
            });
            toWrite = content.getElementsByTagName('html')[0].outerHTML;
        }
        iframe.contentWindow.document.open();
        try {
            iframe.contentWindow.document.write(toWrite);
        }
        catch (e) {
            // The iframe is sandboxed, and can throw ugly errors, especially when rendering random web pages.
            // Suppress those
        }
        iframe.contentWindow.document.close();
    };
    QuickviewDocument.prototype.wrapPreElementsInIframe = function (iframe) {
        try {
            var style = document.createElement('style');
            style.type = 'text/css';
            // This CSS forces <pre> tags used in some emails to wrap by default
            var cssText = 'html pre { white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; }';
            // Some people react strongly when presented with their browser's default font, so let's fix that
            cssText += "body, html { font-family: Arimo, 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: none; }";
            if (DeviceUtils_1.DeviceUtils.isIos()) {
                // Safari on iOS forces resize iframes to fit their content, even if an explicit size
                // is set on the iframe. Isn't that great? By chance there is a trick around it: by
                // setting a very small size on the body and instead using min-* to set the size to
                // 100% we're able to trick Safari from thinking it must expand the iframe. Amazed.
                // The 'scrolling' part is required otherwise the hack doesn't work.
                //
                // http://stackoverflow.com/questions/23083462/how-to-get-an-iframe-to-be-responsive-in-ios-safari
                cssText += 'body, html { height: 1px !important; min-height: 100%; width: 1px !important; min-width: 100%; overflow: scroll; }';
                Dom_1.$$(iframe).setAttribute('scrolling', 'no');
                // Some content is cropped on iOs if a margin is present
                // We remove it and add one on the iframe wrapper.
                cssText += 'body, html {margin: auto}';
                iframe.parentElement.style.margin = '0 0 5px 5px';
            }
            if ('styleSheet' in style) {
                style['styleSheet'].cssText = cssText;
            }
            else {
                style.appendChild(document.createTextNode(cssText));
            }
            var head = iframe.contentWindow.document.head;
            head.appendChild(style);
        }
        catch (e) {
            // if not allowed
        }
    };
    QuickviewDocument.prototype.triggerQuickviewLoaded = function (beforeLoad) {
        var afterLoad = new Date().getTime();
        var eventArgs = { duration: afterLoad - beforeLoad };
        Dom_1.$$(this.element).trigger(QuickviewEvents_1.QuickviewEvents.quickviewLoaded, eventArgs);
    };
    // An highlighted term looks like:
    //
    //     <span id='CoveoHighlight:X.Y.Z'>a</span>
    //
    // The id has 3 components:
    // - X: the term
    // - Y: the term occurence
    // - Z: the term part
    //
    // For the 'Z' component, if the term 'foo bar' is found in multiple elements, we will see:
    //
    //     <span id='CoveoHighlight:1.1.1'>foo</span>
    //     <span id='CoveoHighlight:1.1.2'>bar</span>
    //
    // Highlighted words can overlap, which looks like:
    //
    //     <span id='CoveoHighlight:1.Y.Z'>
    //         a
    //         <coveotaggedword id='CoveoHighlight:2.Y.Z'>b</coveotaggedword>
    //     </span>
    //     <span id='CoveoHighlight:2.Y.Z'>c</span>
    //
    // In the previous example, the words 'ab' and 'bc' are highlighted.
    //
    // One thing important to note is that the id of all 'coveotaggedword' for
    // the same word AND the first 'span' for that word will have the same id.
    //
    // Example:
    //
    //     <span id='CoveoHighlight:1.1.1'>
    //         a
    //         <coveotaggedword id='CoveoHighlight:2.1.1'>b</coveotaggedword>
    //     </span>
    //     <span id='CoveoHighlight:1.1.2'>
    //         c
    //         <coveotaggedword id='CoveoHighlight:2.1.1'>d</coveotaggedword>
    //     </span>
    //     <span id='CoveoHighlight:2.1.1'>e</span>
    //     <span id='CoveoHighlight:2.1.2'>f</span>
    //
    // In the previous example, the words 'abcd' and 'bcdef' are highlighted.
    //
    // This method is public for testing purposes.
    QuickviewDocument.prototype.computeHighlights = function (window) {
        var _this = this;
        Dom_1.$$(this.header).empty();
        this.keywordsState = [];
        var words = {};
        var highlightsCount = 0;
        _.each(Dom_1.$$(window.document.body).findAll('[id^="' + HIGHLIGHT_PREFIX + '"]'), function (element, index) {
            var idParts = _this.getHighlightIdParts(element);
            if (idParts) {
                var idIndexPart = idParts[1]; // X
                var idOccurencePart = parseInt(idParts[2], 10); // Y
                var idTermPart = parseInt(idParts[3], 10); // Z in <span id='CoveoHighlight:X.Y.Z'>a</span>
                var word = words[idIndexPart];
                // The 'idTermPart' check is to circumvent a bug from the index
                // where an highlight of an empty string start with an idTermPart > 1.
                if (word == null && idTermPart == 1) {
                    words[idIndexPart] = word = {
                        text: _this.getHighlightInnerText(element),
                        count: 1,
                        index: parseInt(idIndexPart, 10),
                        // Here I try to be clever.
                        // An overlaping word:
                        // 1) always start with a 'coveotaggedword' element.
                        // 2) then other 'coveotaggedword' elements may follow
                        // 3) then a 'span' element may follow.
                        //
                        // All 1), 2) and 3) will have the same id so I consider them as
                        // a whole having the id 0 instead of 1.
                        termsCount: element.nodeName.toLowerCase() == 'coveotaggedword' ? 0 : 1,
                        element: element,
                        occurence: idOccurencePart
                    };
                }
                else if (word) {
                    if (word.occurence == idOccurencePart) {
                        if (element.nodeName.toLowerCase() == 'coveotaggedword') {
                            word.text += _this.getHighlightInnerText(element);
                            // Doesn't count as a term part (see method description for more info).
                        }
                        else if (word.termsCount < idTermPart) {
                            word.text += _this.getHighlightInnerText(element);
                            word.termsCount += 1;
                        }
                    }
                    word.count = Math.max(word.count, idOccurencePart);
                    highlightsCount += 1;
                }
                // See the method description to understand why this code const us
                // create the word 'bcdef' instead of 'bdef'.
                if (word && word.occurence == idOccurencePart && element.nodeName.toLowerCase() == 'span') {
                    var embeddedWordParts = _this.getHightlightEmbeddedWordIdParts(element);
                    var embeddedWord = embeddedWordParts ? words[embeddedWordParts[1]] : null;
                    if (embeddedWord && embeddedWord.occurence == parseInt(embeddedWordParts[2], 10)) {
                        embeddedWord.text += element.childNodes[0].nodeValue || ''; // only immediate text without children.
                    }
                }
            }
        });
        if (highlightsCount == 0) {
            this.header.el.style.minHeight = '0';
        }
        var resolvedWords = [];
        _.each(words, function (word) {
            // When possible, take care to find the original term from the query instead of the
            // first highlighted version we encounter. This relies on a recent feature by the
            // Search API, but will fallback properly on older versions.
            word.text = _this.resolveOriginalTermFromHighlight(word.text);
            var state = {
                word: word,
                color: word.element.style.backgroundColor,
                currentIndex: 0,
                index: word.index
            };
            _this.keywordsState.push(state);
            Dom_1.$$(_this.header).append(_this.buildWordButton(state, window));
            resolvedWords.push(word.text);
        });
        return resolvedWords;
    };
    QuickviewDocument.prototype.getHighlightIdParts = function (element) {
        var parts = element.id.substr(HIGHLIGHT_PREFIX.length + 1).match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/);
        return parts && parts.length > 3 ? parts : null;
    };
    QuickviewDocument.prototype.getHighlightInnerText = function (element) {
        if (element.nodeName.toLowerCase() == 'coveotaggedword') {
            // only immediate text without children.
            return element.childNodes.length >= 1 ? element.childNodes.item(0).textContent || '' : '';
        }
        else {
            return element.textContent || '';
        }
    };
    QuickviewDocument.prototype.getHightlightEmbeddedWordIdParts = function (element) {
        var embedded = element.getElementsByTagName('coveotaggedword')[0];
        return embedded ? this.getHighlightIdParts(embedded) : null;
    };
    QuickviewDocument.prototype.resolveOriginalTermFromHighlight = function (highlight) {
        var _this = this;
        var found = highlight;
        // Beware, terms to highlight is only set by recent search APIs.
        if (this.result.termsToHighlight) {
            // We look for the term expansion and we'll return the corresponding
            // original term is one is found.
            found =
                _.find(_.keys(this.result.termsToHighlight), function (originalTerm) {
                    // The expansions do NOT include the original term (makes sense), so be sure to check
                    // the original term for a match too.
                    return (originalTerm.toLowerCase() == highlight.toLowerCase() ||
                        _.find(_this.result.termsToHighlight[originalTerm], function (expansion) { return expansion.toLowerCase() == highlight.toLowerCase(); }) !=
                            undefined);
                }) || found;
        }
        return found;
    };
    QuickviewDocument.prototype.buildWordButton = function (wordState, window) {
        var _this = this;
        var wordHtml = Dom_1.$$('span');
        wordHtml.addClass('coveo-term-for-quickview');
        var quickviewName = Dom_1.$$('span');
        quickviewName.addClass('coveo-term-for-quickview-name');
        quickviewName.setHtml(wordState.word.text);
        quickviewName.on('click', function () {
            _this.navigate(wordState, false, window);
        });
        wordHtml.append(quickviewName.el);
        var quickviewUpArrow = Dom_1.$$('span');
        quickviewUpArrow.addClass('coveo-term-for-quickview-up-arrow');
        var quickviewUpArrowIcon = Dom_1.$$('span');
        quickviewUpArrowIcon.addClass('coveo-term-for-quickview-up-arrow-icon');
        quickviewUpArrow.append(quickviewUpArrowIcon.el);
        quickviewUpArrow.on('click', function () {
            _this.navigate(wordState, true, window);
        });
        wordHtml.append(quickviewUpArrow.el);
        var quickviewDownArrow = Dom_1.$$('span');
        quickviewDownArrow.addClass('coveo-term-for-quickview-down-arrow');
        var quickviewDownArrowIcon = Dom_1.$$('span');
        quickviewDownArrowIcon.addClass('coveo-term-for-quickview-down-arrow-icon');
        quickviewDownArrow.append(quickviewDownArrowIcon.el);
        quickviewDownArrow.on('click', function () {
            _this.navigate(wordState, false, window);
        });
        wordHtml.append(quickviewDownArrow.el);
        wordHtml.el.style.backgroundColor = wordState.color;
        wordHtml.el.style.borderColor = this.getSaturatedColor(wordState.color);
        quickviewDownArrow.el.style.borderColor = this.getSaturatedColor(wordState.color);
        return wordHtml.el;
    };
    QuickviewDocument.prototype.navigate = function (state, backward, window) {
        var fromIndex = state.currentIndex;
        var toIndex;
        if (!backward) {
            toIndex = fromIndex == state.word.count ? 1 : fromIndex + 1;
        }
        else {
            toIndex = fromIndex <= 1 ? state.word.count : fromIndex - 1;
        }
        var scroll = this.getScrollingElement(window);
        // Un-highlight any currently selected element
        var current = Dom_1.$$(scroll).find('[id^="' + HIGHLIGHT_PREFIX + ':' + state.word.index + '.' + fromIndex + '"]');
        if (current) {
            current.style.border = '';
        }
        // Find and highlight the new element.
        var element = Dom_1.$$(window.document.body).find('[id^="' + HIGHLIGHT_PREFIX + ':' + state.word.index + '.' + toIndex + '"]');
        element.style.border = '1px dotted #333';
        state.currentIndex = toIndex;
        // pdf2html docs hide the non-visible frames by default, to speed up browsers.
        // But this prevents keyword navigation from working so we must force show it. This
        // is done by adding the 'opened' class to it (defined by pdf2html).
        if (this.isNewQuickviewDocument(window)) {
            var pdf = Dom_1.$$(element).closest('.pc');
            Dom_1.$$(pdf).addClass('opened');
        }
        element.scrollIntoView();
        document.body.scrollLeft = 0;
        document.body.scrollTop = 0;
    };
    QuickviewDocument.prototype.buildHeader = function () {
        var header = Dom_1.$$('div');
        header.addClass('coveo-quickview-header');
        return header;
    };
    QuickviewDocument.prototype.buildIFrame = function () {
        var iFrame = Dom_1.$$('iframe');
        iFrame.setAttribute('sandbox', 'allow-same-origin allow-top-navigation');
        var iFrameWrapper = Dom_1.$$('div');
        iFrameWrapper.addClass('coveo-iframeWrapper');
        iFrameWrapper.el.appendChild(iFrame.el);
        return iFrameWrapper;
    };
    QuickviewDocument.prototype.getScrollingElement = function (iframeWindow) {
        var found;
        if (this.isNewQuickviewDocument(iframeWindow)) {
            // 'New' quick views have a #page-container element generated by the pdf2html thing.
            // This is the element we want to scroll on.
            found = Dom_1.$$(iframeWindow.document.body).find('#page-container');
        }
        // If all else fails, we use the body
        if (!found) {
            found = Dom_1.$$(iframeWindow.document.body).el;
        }
        return found;
    };
    QuickviewDocument.prototype.isNewQuickviewDocument = function (iframeWindow) {
        var meta = Dom_1.$$(iframeWindow.document.head).find("meta[name='generator']");
        return meta && meta.getAttribute('content') == 'pdf2htmlEX';
    };
    QuickviewDocument.prototype.handleTermsToHighlight = function (termsToHighlight, queryObject) {
        var _this = this;
        for (var term in this.result.termsToHighlight) {
            delete this.result.termsToHighlight[term];
        }
        var query = '';
        _.each(termsToHighlight, function (term) {
            query += term + ' ';
            _this.result.termsToHighlight[term] = new Array(term);
        });
        query = query.substring(0, query.length - 1);
        queryObject.q = query;
    };
    QuickviewDocument.prototype.checkIfTermsToHighlightWereModified = function (termsToHighlight) {
        if (!Utils_1.Utils.arrayEqual(termsToHighlight, _.keys(this.result.termsToHighlight))) {
            this.termsToHighlightWereModified = true;
        }
    };
    QuickviewDocument.prototype.getSaturatedColor = function (color) {
        var r = parseInt(color.substring(4, 7));
        var g = parseInt(color.substring(9, 12));
        var b = parseInt(color.substring(14, 17));
        var hsv = ColorUtils_1.ColorUtils.rgbToHsv(r, g, b);
        hsv[1] *= 2;
        if (hsv[1] > 1) {
            hsv[1] = 1;
        }
        var rgb = ColorUtils_1.ColorUtils.hsvToRgb(hsv[0], hsv[1], hsv[2]);
        return 'rgb(' + rgb[0].toString() + ', ' + rgb[1].toString() + ', ' + rgb[2].toString() + ')';
    };
    QuickviewDocument.ID = 'QuickviewDocument';
    /**
     * The options for the component
     * @componentOptions
     */
    QuickviewDocument.options = {
        /**
         * Specifies the maximum preview size that the index should return.
         *
         * Default value is `0`, and the index returns the entire preview. Minimum value is `0`.
         */
        maximumDocumentSize: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 0, min: 0 })
    };
    return QuickviewDocument;
}(Component_1.Component));
exports.QuickviewDocument = QuickviewDocument;
Initialization_1.Initialization.registerAutoCreateComponent(QuickviewDocument);


/***/ }),

/***/ 410:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Quickview__e88b07527d07df27a874.js.map