webpackJsonpCoveo__temporary([18],{

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ExternalModulesShim_1 = __webpack_require__(26);
var FocusTrap_1 = __webpack_require__(465);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(25);
var Core_1 = __webpack_require__(20);
var AccessibleModal = /** @class */ (function () {
    function AccessibleModal(className, ownerElement, modalboxModule, options) {
        if (modalboxModule === void 0) { modalboxModule = ExternalModulesShim_1.ModalBox; }
        if (options === void 0) { options = {}; }
        this.className = className;
        this.ownerElement = ownerElement;
        this.modalboxModule = modalboxModule;
        this.options = __assign({
            sizeMod: 'big'
        }, options);
    }
    Object.defineProperty(AccessibleModal.prototype, "isOpen", {
        get: function () {
            return !!this.focusTrap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccessibleModal.prototype, "element", {
        get: function () {
            return this.activeModal && this.activeModal.modalBox;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccessibleModal.prototype, "content", {
        get: function () {
            return this.activeModal && this.activeModal.content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccessibleModal.prototype, "wrapper", {
        get: function () {
            return this.activeModal && this.activeModal.wrapper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccessibleModal.prototype, "headerElement", {
        get: function () {
            return this.element && this.element.querySelector('.coveo-modal-header h1');
        },
        enumerable: true,
        configurable: true
    });
    AccessibleModal.prototype.openResult = function (parameters) {
        if (this.isOpen) {
            return;
        }
        this.openModalAndTrap({
            content: parameters.content,
            validation: parameters.validation,
            origin: parameters.origin,
            title: Core_1.DomUtils.getQuickviewHeader(parameters.result, parameters.options, parameters.bindings).el
        });
        this.makeAccessible(parameters.options.title || parameters.result.title);
    };
    AccessibleModal.prototype.open = function (parameters) {
        if (this.isOpen) {
            return;
        }
        this.openModalAndTrap(parameters);
        this.makeAccessible();
    };
    AccessibleModal.prototype.openModalAndTrap = function (parameters) {
        var _this = this;
        this.initiallyFocusedElement = parameters.origin || document.activeElement;
        this.activeModal = this.modalboxModule.open(parameters.content, {
            title: parameters.title,
            className: this.className,
            validation: function () {
                _this.onModalClose();
                return parameters.validation();
            },
            body: this.ownerElement,
            sizeMod: this.options.sizeMod,
            overlayClose: this.options.overlayClose
        });
        this.focusTrap = new FocusTrap_1.FocusTrap(this.element);
    };
    AccessibleModal.prototype.close = function () {
        if (!this.isOpen) {
            return;
        }
        this.activeModal.close();
        this.activeModal = null;
    };
    AccessibleModal.prototype.makeAccessible = function (title) {
        this.element.setAttribute('aria-modal', 'true');
        if (title) {
            this.headerElement.setAttribute('aria-label', title);
        }
        this.makeCloseButtonAccessible();
    };
    AccessibleModal.prototype.makeCloseButtonAccessible = function () {
        var closeButton = this.element.querySelector('.coveo-small-close');
        closeButton.setAttribute('aria-label', Strings_1.l('Close'));
        closeButton.setAttribute('role', 'button');
        closeButton.tabIndex = 0;
        closeButton.focus();
        Dom_1.$$(closeButton).on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function () { return closeButton.click(); }));
    };
    AccessibleModal.prototype.onModalClose = function () {
        this.focusTrap.disable();
        this.focusTrap = null;
        if (this.initiallyFocusedElement && document.body.contains(this.initiallyFocusedElement)) {
            this.initiallyFocusedElement.focus();
        }
    };
    return AccessibleModal;
}());
exports.AccessibleModal = AccessibleModal;


/***/ }),

/***/ 225:
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

/***/ 231:
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var QuickviewEvents_1 = __webpack_require__(225);
var Assert_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var QuickviewDocumentIframe_1 = __webpack_require__(638);
var QuickviewDocumentHeader_1 = __webpack_require__(639);
var QuickviewDocumentWords_1 = __webpack_require__(640);
var underscore_1 = __webpack_require__(0);
var QuickviewDocumentWordButton_1 = __webpack_require__(643);
var QuickviewDocumentPreviewBar_1 = __webpack_require__(644);
exports.HIGHLIGHT_PREFIX = 'CoveoHighlight';
/**
 * The `QuickviewDocument` component normally exists within a [`Quickview`]{@link Quickview} component. The sole purpose
 * of this component is to add an `<iframe>` which loads the correct HTML version of the current item.
 *
 * The default [`contentTemplate`]{@link Quickview.options.contentTemplate} of the
 * `Quickview` component includes the `QuickviewDocument` component.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
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
        Assert_1.Assert.exists(_this.result);
        return _this;
    }
    QuickviewDocument.prototype.createDom = function () {
        var container = Dom_1.$$('div', {
            className: 'coveo-quickview-document'
        });
        this.element.appendChild(container.el);
        this.header = new QuickviewDocumentHeader_1.QuickviewDocumentHeader();
        this.iframe = new QuickviewDocumentIframe_1.QuickviewDocumentIframe();
        container.append(this.header.el);
        container.append(this.iframe.el);
    };
    QuickviewDocument.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var beforeLoad, termsToHighlight, termsWereModified, documentHTML, documentWords, previewBar_1, afterLoad, error_1, afterLoad;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureDom();
                        beforeLoad = new Date().getTime();
                        termsToHighlight = this.initialTermsToHighlight;
                        this.triggerOpenQuickViewEvent({ termsToHighlight: termsToHighlight });
                        termsWereModified = this.wereTermsToHighlightModified(termsToHighlight);
                        if (termsWereModified) {
                            this.handleTermsToHighlight(termsToHighlight, this.query);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 6]);
                        return [4 /*yield*/, this.queryController.getEndpoint().getDocumentHtml(this.result.uniqueId, {
                                queryObject: this.query,
                                requestedOutputSize: this.options.maximumDocumentSize
                            })];
                    case 2:
                        documentHTML = _a.sent();
                        return [4 /*yield*/, this.iframe.render(documentHTML, this.result.title)];
                    case 3:
                        _a.sent();
                        documentWords = new QuickviewDocumentWords_1.QuickviewDocumentWords(this.iframe, this.result);
                        previewBar_1 = new QuickviewDocumentPreviewBar_1.QuickviewDocumentPreviewBar(this.iframe, documentWords);
                        underscore_1.each(documentWords.words, function (word) {
                            var button = new QuickviewDocumentWordButton_1.QuickviewDocumentWordButton(word, previewBar_1, _this.iframe);
                            _this.header.addWord(button);
                        });
                        afterLoad = new Date().getTime();
                        this.triggerQuickviewLoaded(afterLoad - beforeLoad);
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.iframe.renderError(error_1)];
                    case 5:
                        _a.sent();
                        afterLoad = new Date().getTime();
                        this.triggerQuickviewLoaded(afterLoad - beforeLoad);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(QuickviewDocument.prototype, "initialTermsToHighlight", {
        get: function () {
            return underscore_1.keys(this.result.termsToHighlight);
        },
        enumerable: true,
        configurable: true
    });
    QuickviewDocument.prototype.triggerOpenQuickViewEvent = function (args) {
        Dom_1.$$(this.root).trigger(QuickviewEvents_1.QuickviewEvents.openQuickview, args);
    };
    Object.defineProperty(QuickviewDocument.prototype, "query", {
        get: function () {
            return __assign({}, this.queryController.getLastQuery());
        },
        enumerable: true,
        configurable: true
    });
    QuickviewDocument.prototype.triggerQuickviewLoaded = function (duration) {
        Dom_1.$$(this.element).trigger(QuickviewEvents_1.QuickviewEvents.quickviewLoaded, {
            duration: duration
        });
    };
    QuickviewDocument.prototype.handleTermsToHighlight = function (termsToHighlight, queryObject) {
        var _this = this;
        for (var term in this.result.termsToHighlight) {
            delete this.result.termsToHighlight[term];
        }
        var query = '';
        underscore_1.each(termsToHighlight, function (term) {
            query += term + ' ';
            _this.result.termsToHighlight[term] = [term];
        });
        query = query.substring(0, query.length - 1);
        queryObject.q = query;
    };
    QuickviewDocument.prototype.wereTermsToHighlightModified = function (termsToHighlight) {
        return !Utils_1.Utils.arrayEqual(termsToHighlight, this.initialTermsToHighlight);
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

/***/ 266:
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var popper_js_1 = __webpack_require__(93);
__webpack_require__(636);
var QuickviewEvents_1 = __webpack_require__(225);
var ResultListEvents_1 = __webpack_require__(29);
var ExternalModulesShim_1 = __webpack_require__(26);
var GlobalExports_1 = __webpack_require__(3);
var QueryStateModel_1 = __webpack_require__(13);
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var Dom_1 = __webpack_require__(1);
var DomUtils_1 = __webpack_require__(91);
var StringUtils_1 = __webpack_require__(22);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var IComponentOptions_1 = __webpack_require__(47);
var Initialization_1 = __webpack_require__(2);
var TemplateComponentOptions_1 = __webpack_require__(61);
var DefaultQuickviewTemplate_1 = __webpack_require__(637);
var QuickviewDocument_1 = __webpack_require__(231);
var AccessibleModal_1 = __webpack_require__(220);
/**
 * The `Quickview` component renders a button/link which the end user can click to open a modal box containing certain
 * information about a result. Most of the time, this component references a
 * [`QuickviewDocument`]{@link QuickviewDocument} in its [`contentTemplate`]{@link Quickview.options.contentTemplate}.
 *
 * **Notes:**
 * > - `Quickview` is not meant to replace a [ResultLink]{@link ResultLink} to access an item; it has certain limitations (e.g., custom styles and embedded
 * images/links may not work as expected in a `Quickview`).
 * > - You can change the appearance of the `Quickview` link/button by adding elements in the inner HTML of its `div`.
 * > - You can change the content of the `Quickview` modal box link by specifying a template `id` or CSS selector (see
 * > the [`contentTemplate`]{@link Quickview.options.contentTemplate} option).
 * > - When using Coveo for Salesforce 3.16, in an environment compliant with LockerService, ensure you use `CoveoSalesforceQuickview` (see [Changing the Default Quick View in Coveo for Salesforce](https://docs.coveo.com/en/1234/)).
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
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
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
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Quickview, options);
        if (_this.options.contentTemplate == null) {
            _this.options.contentTemplate = new DefaultQuickviewTemplate_1.DefaultQuickviewTemplate();
        }
        // If there is no content inside the Quickview div,
        // we need to add something that will show up in the result template itself
        if (/^\s*$/.test(_this.element.innerHTML)) {
            _this.buildContent();
        }
        _this.bindClick(result);
        if (_this.bindings.resultElement) {
            _this.bind.on(_this.bindings.resultElement, ResultListEvents_1.ResultListEvents.openQuickview, function (event) {
                event && event.stopPropagation();
                _this.open();
            });
        }
        _this.modalbox = new AccessibleModal_1.AccessibleModal('coveo-quick-view', _this.searchInterface.options.modalContainer, ModalBox);
        return _this;
    }
    Quickview.prototype.buildContent = function () {
        var icon = this.buildIcon();
        var caption = this.buildCaption();
        var content = Dom_1.$$('div');
        content.append(icon);
        content.append(caption);
        Dom_1.$$(this.element).append(content.el);
        this.buildTooltipIfNotInCardLayout(icon, caption);
    };
    Quickview.prototype.buildIcon = function () {
        var icon = Dom_1.$$('div', { className: 'coveo-icon-for-quickview' }, SVGIcons_1.SVGIcons.icons.quickview).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon, 'coveo-icon-for-quickview-svg');
        return icon;
    };
    Quickview.prototype.buildCaption = function () {
        return Dom_1.$$('div', { className: 'coveo-caption-for-icon' }, 'Quickview'.toLocaleString()).el;
    };
    Quickview.prototype.buildTooltipIfNotInCardLayout = function (icon, caption) {
        if (this.resultsAreInCardLayout) {
            return;
        }
        var arrow = Dom_1.$$('div').el;
        caption.appendChild(arrow);
        this.buildPopper(icon, caption, arrow);
    };
    Object.defineProperty(Quickview.prototype, "resultsAreInCardLayout", {
        get: function () {
            return this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.layout) === 'card';
        },
        enumerable: true,
        configurable: true
    });
    Quickview.prototype.buildPopper = function (icon, caption, arrow) {
        var popperReference = new popper_js_1.default(icon, caption, {
            placement: this.options.tooltipPlacement,
            modifiers: {
                preventOverflow: {
                    boundariesElement: Dom_1.$$(this.root).el,
                    padding: 0
                },
                arrow: {
                    element: arrow
                },
                // X,Y offset of the tooltip relative to the icon
                offset: {
                    offset: '0,8'
                }
            },
            eventsEnabled: false
        });
        Dom_1.$$(this.element).on('mouseover', function () {
            popperReference.update();
        });
    };
    /**
     * Opens the `Quickview` modal box.
     */
    Quickview.prototype.open = function () {
        var _this = this;
        if (!this.modalbox.isOpen) {
            // To prevent the keyboard from opening on mobile if the search bar has focus
            Quickview.resultCurrentlyBeingRendered = this.result;
            // activeElement does not exist in LockerService
            if (document.activeElement && document.activeElement instanceof HTMLElement) {
                Dom_1.$$(document.activeElement).trigger('blur');
            }
            var openerObject_1 = this.prepareOpenQuickviewObject();
            return this.createModalBox(openerObject_1).then(function () {
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
        if (this.modalbox.isOpen) {
            this.modalbox.close();
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
            new AccessibleButton_1.AccessibleButton().withElement(this.element).withSelectAction(clickAction).withLabel(Strings_1.l('Quickview')).withOwner(this.bind).build();
        }
        else {
            this.element.style.display = 'none';
        }
    };
    Quickview.prototype.bindQuickviewEvents = function (openerObject) {
        var _this = this;
        Dom_1.$$(this.modalbox.content).on(QuickviewEvents_1.QuickviewEvents.quickviewLoaded, function () { return __awaiter(_this, void 0, void 0, function () {
            var anim;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, openerObject.loadingAnimation];
                    case 1:
                        anim = _a.sent();
                        Dom_1.$$(anim).remove();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Quickview.prototype.animateAndOpen = function () {
        var quickviewDocument = Dom_1.$$(this.modalbox.element).find('.' + Component_1.Component.computeCssClassName(QuickviewDocument_1.QuickviewDocument));
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
            _this.modalbox.openResult({
                result: _this.result,
                options: {
                    showDate: _this.options.showDate,
                    title: _this.options.title
                },
                bindings: _this.bindings,
                content: computedModalBoxContent.el,
                validation: function () {
                    _this.closeQuickview();
                    return true;
                },
                origin: _this.element
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var domContent, initOptions, initParameters, containsQuickviewDocumentAndCustomAnimation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.instantiateTemplateToDom()];
                    case 1:
                        domContent = _a.sent();
                        initOptions = this.searchInterface.options;
                        initParameters = {
                            options: initOptions,
                            bindings: this.getBindings(),
                            result: this.result
                        };
                        return [4 /*yield*/, Initialization_1.Initialization.automaticallyCreateComponentsInside(domContent.el, initParameters).initResult];
                    case 2:
                        _a.sent();
                        containsQuickviewDocumentAndCustomAnimation = function () {
                            return domContent.find("." + Component_1.Component.computeCssClassName(QuickviewDocument_1.QuickviewDocument)) != undefined && _this.options.enableLoadingAnimation;
                        };
                        if (containsQuickviewDocumentAndCustomAnimation()) {
                            if (loadingAnimation instanceof HTMLElement) {
                                domContent.prepend(loadingAnimation);
                            }
                            else if (loadingAnimation instanceof Promise) {
                                loadingAnimation.then(function (anim) {
                                    domContent.prepend(anim);
                                });
                            }
                        }
                        return [2 /*return*/, domContent];
                }
            });
        });
    };
    Quickview.prototype.instantiateTemplateToDom = function () {
        return __awaiter(this, void 0, void 0, function () {
            var templateInstantiated, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 6]);
                        return [4 /*yield*/, this.options.contentTemplate.instantiateToElement(this.result)];
                    case 1:
                        templateInstantiated = _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        e_1 = _a.sent();
                        this.logger.warn(e_1);
                        return [3 /*break*/, 6];
                    case 3:
                        if (!!templateInstantiated) return [3 /*break*/, 5];
                        this.logger.warn('An unexpected error happened while trying to render a custom template quickview, fallbacking on default quickview template...', this.options.contentTemplate);
                        return [4 /*yield*/, new DefaultQuickviewTemplate_1.DefaultQuickviewTemplate().instantiateToElement(this.result)];
                    case 4:
                        templateInstantiated = _a.sent();
                        _a.label = 5;
                    case 5: return [7 /*endfinally*/];
                    case 6: return [2 /*return*/, Dom_1.$$(templateInstantiated)];
                }
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
         *
         * @availablesince [September 2015 Release (v1.0.59)](https://docs.coveo.com/en/289/#september-2015-release-v1059)
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
         * See [Customizing the Quickview Loading Animation](https://docs.coveo.com/en/296/#customizing-the-quickview-loading-animation).
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
         * [Customizing the Default Loading Animation](https://docs.coveo.com/en/296/#customizing-the-default-search-page-animation).
         */
        loadingAnimation: ComponentOptions_1.ComponentOptions.buildOption(IComponentOptions_1.ComponentOptionsType.NONE, function (element) {
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
        }),
        /**
         * Specifies the emplacement of the tooltip in relation to the `Quickview` HTML element.
         *
         * **Example:**
         * > Setting this option to `top-start` will make the tooltip appear on top of the `Quickview` button, aligned to the left.
         *
         * @availablesince [January 2019 Release (v2.5395.12)](https://docs.coveo.com/en/2938/)
         */
        tooltipPlacement: ComponentOptions_1.ComponentOptions.buildCustomOption(function (value) { return value; }, {
            defaultValue: 'bottom'
        })
    };
    Quickview.resultCurrentlyBeingRendered = null;
    return Quickview;
}(Component_1.Component));
exports.Quickview = Quickview;
Initialization_1.Initialization.registerAutoCreateComponent(Quickview);


/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Defer_1 = __webpack_require__(31);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var FocusTrap = /** @class */ (function () {
    function FocusTrap(container) {
        this.container = container;
        this.hiddenElements = [];
        this.enable();
    }
    Object.defineProperty(FocusTrap.prototype, "focusableElements", {
        get: function () {
            return underscore_1.sortBy(this.container.querySelectorAll('[tabindex]'), function (element) { return element.tabIndex; });
        },
        enumerable: true,
        configurable: true
    });
    FocusTrap.prototype.disable = function () {
        document.removeEventListener('focusin', this.focusInEvent);
        document.removeEventListener('focusout', this.focusOutEvent);
        this.showHiddenElements();
        this.enabled = false;
    };
    FocusTrap.prototype.enable = function () {
        var _this = this;
        document.addEventListener('focusin', (this.focusInEvent = function (e) { return _this.onFocusIn(e); }));
        document.addEventListener('focusout', (this.focusOutEvent = function (e) { return _this.onFocusOut(e); }));
        this.hideAllExcept(this.container);
        this.enabled = true;
    };
    FocusTrap.prototype.showHiddenElements = function () {
        while (this.hiddenElements.length) {
            this.hiddenElements.pop().removeAttribute('aria-hidden');
        }
    };
    FocusTrap.prototype.hideElement = function (element) {
        if (element.getAttribute('aria-hidden')) {
            return;
        }
        this.hiddenElements.push(element);
        element.setAttribute('aria-hidden', "" + true);
    };
    FocusTrap.prototype.hideSiblings = function (allowedElement) {
        var _this = this;
        var parent = allowedElement.parentElement;
        if (parent) {
            underscore_1.without(Dom_1.$$(parent).children(), allowedElement).forEach(function (elementToHide) {
                _this.hideElement(elementToHide);
            });
        }
    };
    FocusTrap.prototype.hideAllExcept = function (allowedElement) {
        this.hideSiblings(allowedElement);
        var parent = allowedElement.parentElement;
        if (parent && parent !== document.body) {
            this.hideAllExcept(parent);
        }
    };
    FocusTrap.prototype.getFocusableSibling = function (element, previous) {
        if (previous === void 0) { previous = false; }
        var elements = this.focusableElements;
        var currentIndex = elements.indexOf(element);
        if (currentIndex === -1) {
            return null;
        }
        return elements[(currentIndex + (previous ? -1 : 1) + elements.length) % elements.length];
    };
    FocusTrap.prototype.focusSibling = function (element, previous) {
        if (previous === void 0) { previous = false; }
        var sibling = this.getFocusableSibling(element, previous);
        if (sibling) {
            sibling.focus();
        }
    };
    FocusTrap.prototype.focusFirstElement = function () {
        var elements = this.focusableElements;
        if (elements.length) {
            elements[0].focus();
        }
    };
    FocusTrap.prototype.elementIsBefore = function (oldElement, newElement) {
        if (!newElement) {
            return false;
        }
        return oldElement.compareDocumentPosition(newElement) === Node.DOCUMENT_POSITION_PRECEDING;
    };
    FocusTrap.prototype.onLosingFocus = function (oldElement, newElement) {
        var _this = this;
        Defer_1.Defer.defer(function () {
            if (!_this.enabled) {
                return;
            }
            _this.enabled = false;
            if (oldElement && _this.focusIsAllowed(oldElement)) {
                _this.focusSibling(oldElement, _this.elementIsBefore(oldElement, newElement));
            }
            else {
                _this.focusFirstElement();
            }
            _this.enabled = true;
        });
    };
    FocusTrap.prototype.focusIsAllowed = function (element) {
        return this.container.contains(element);
    };
    FocusTrap.prototype.elementIsInPage = function (element) {
        return element && element !== document.body.parentElement;
    };
    FocusTrap.prototype.onFocusIn = function (e) {
        if (!this.enabled) {
            return;
        }
        var oldElement = e.relatedTarget;
        var handledByFocusOut = this.elementIsInPage(oldElement);
        if (handledByFocusOut) {
            return;
        }
        var newElement = e.target;
        if (!this.elementIsInPage(newElement)) {
            return;
        }
        if (!this.focusIsAllowed(newElement)) {
            this.onLosingFocus(null, newElement);
        }
    };
    FocusTrap.prototype.onFocusOut = function (e) {
        if (!this.enabled) {
            return;
        }
        var newElement = e.relatedTarget;
        if (!this.elementIsInPage(newElement)) {
            return;
        }
        if (!newElement || !this.focusIsAllowed(newElement)) {
            this.onLosingFocus(e.target, newElement);
        }
    };
    return FocusTrap;
}());
exports.FocusTrap = FocusTrap;


/***/ }),

/***/ 636:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 637:
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

/***/ 638:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Core_1 = __webpack_require__(20);
var Dom_1 = __webpack_require__(1);
var QuickviewDocumentIframe = /** @class */ (function () {
    function QuickviewDocumentIframe() {
        this.el = this.buildIFrame().el;
    }
    Object.defineProperty(QuickviewDocumentIframe.prototype, "iframeHTMLElement", {
        get: function () {
            return this.iframeElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickviewDocumentIframe.prototype, "document", {
        get: function () {
            return this.iframeElement.contentWindow.document;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickviewDocumentIframe.prototype, "body", {
        get: function () {
            return this.document.body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickviewDocumentIframe.prototype, "window", {
        get: function () {
            return this.iframeElement.contentWindow;
        },
        enumerable: true,
        configurable: true
    });
    QuickviewDocumentIframe.prototype.isNewQuickviewDocument = function () {
        var meta = Dom_1.$$(this.document.head).find("meta[name='generator']");
        return meta && meta.getAttribute('content') == 'pdf2htmlEX';
    };
    QuickviewDocumentIframe.prototype.render = function (htmlDocument, title) {
        var _this = this;
        if (this.quickviewIsClosedByEndUser()) {
            return Promise.reject(null);
        }
        return new Promise(function (resolve, reject) {
            // Take care to bind the onload function before actually writing to the iframe :
            // Safari, IE, Edge need this, otherwise the onload function is never called
            _this.iframeElement.onload = function () {
                resolve(_this.iframeElement);
            };
            _this.addClientSideTweaksToIFrameStyling(htmlDocument);
            _this.writeToIFrame(htmlDocument);
            _this.iframeElement.title = title;
        });
    };
    QuickviewDocumentIframe.prototype.renderError = function (error) {
        var _this = this;
        if (this.quickviewIsClosedByEndUser()) {
            return Promise.reject(null);
        }
        return new Promise(function (resolve, reject) {
            var errorMessage = '';
            switch (error.status) {
                case 400:
                    errorMessage = Core_1.l('NoQuickview');
                    break;
                default:
                    errorMessage = Core_1.l('OoopsError');
                    break;
            }
            var errorDocument = document.implementation.createHTMLDocument();
            errorDocument.body.style.fontFamily = "Arimo, 'Helvetica Neue', Helvetica, Arial, sans-serif";
            Dom_1.$$(errorDocument.body).text(errorMessage);
            _this.writeToIFrame(errorDocument);
            resolve(_this.iframeElement);
        });
    };
    QuickviewDocumentIframe.prototype.quickviewIsClosedByEndUser = function () {
        return this.iframeElement.contentDocument == null;
    };
    QuickviewDocumentIframe.prototype.buildIFrame = function () {
        var iframe = Dom_1.$$('iframe', {
            sandbox: 'allow-popups allow-same-origin allow-top-navigation',
            src: 'about:blank'
        });
        this.iframeElement = iframe.el;
        var iframewrapper = Dom_1.$$('div', {
            className: 'coveo-iframeWrapper'
        });
        iframewrapper.append(iframe.el);
        return iframewrapper;
    };
    QuickviewDocumentIframe.prototype.writeToIFrame = function (htmlDocument) {
        this.allowDocumentLinkToEscapeSandbox(htmlDocument);
        this.document.open();
        this.document.write(htmlDocument.getElementsByTagName('html')[0].outerHTML);
        this.document.close();
    };
    QuickviewDocumentIframe.prototype.allowDocumentLinkToEscapeSandbox = function (htmlDocument) {
        // On the iframe, we set the sandbox attribute to "allow top navigation".
        // For this to work, we need to force all link to target _top.
        // This is especially useful for quickview on web pages.
        underscore_1.each(Dom_1.$$(htmlDocument.body).findAll('a'), function (link) {
            link.setAttribute('target', '_top');
        });
    };
    QuickviewDocumentIframe.prototype.addClientSideTweaksToIFrameStyling = function (htmlDocument) {
        var style = Dom_1.$$('style', { type: 'text/css' }).el;
        // Safari on iOS forces resize iframes to fit their content, even if an explicit size
        // is set on the iframe. Isn't that great? By chance there is a trick around it: by
        // setting a very small size on the body and instead using min-* to set the size to
        // 100% we're able to trick Safari from thinking it must expand the iframe. Amazed.
        // The 'scrolling' part is required otherwise the hack doesn't work.
        //
        // https://stackoverflow.com/questions/23083462/how-to-get-an-iframe-to-be-responsive-in-ios-safari
        var cssHackForIOS = "\n      body, html {\n        height: 1px !important;\n        min-height: 100%;\n        width: 1px !important;\n        min-width: 100%;\n        overflow: scroll;\n        margin: auto\n      }\n      ";
        var cssText = "\n      html pre {\n        white-space: pre-wrap;\n        word-wrap: break-word;\n      }\n      body, html {\n        font-family: Arimo, 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: none;\n      }\n      " + (Core_1.DeviceUtils.isIos() ? cssHackForIOS : '') + "\n      ";
        if (Core_1.DeviceUtils.isIos()) {
            Dom_1.$$(this.iframeElement).setAttribute('scrolling', 'no');
            this.iframeElement.parentElement.style.margin = '0 0 5px 5px';
        }
        style.appendChild(document.createTextNode(cssText));
        htmlDocument.head.appendChild(style);
    };
    return QuickviewDocumentIframe;
}());
exports.QuickviewDocumentIframe = QuickviewDocumentIframe;


/***/ }),

/***/ 639:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var QuickviewDocumentHeader = /** @class */ (function () {
    function QuickviewDocumentHeader() {
        this.el = this.buildHeader().el;
    }
    QuickviewDocumentHeader.prototype.addWord = function (wordButton) {
        this.el.appendChild(wordButton.el);
    };
    QuickviewDocumentHeader.prototype.buildHeader = function () {
        var header = Dom_1.$$('div', {
            className: 'coveo-quickview-header'
        });
        return header;
    };
    return QuickviewDocumentHeader;
}());
exports.QuickviewDocumentHeader = QuickviewDocumentHeader;


/***/ }),

/***/ 640:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var QuickviewDocumentWord_1 = __webpack_require__(641);
var QuickviewDocument_1 = __webpack_require__(231);
var QuickviewDocumentWords = /** @class */ (function () {
    function QuickviewDocumentWords(iframe, result) {
        this.iframe = iframe;
        this.result = result;
        this.words = {};
        this.scanDocument();
    }
    QuickviewDocumentWords.prototype.scanDocument = function () {
        var _this = this;
        underscore_1.each(Dom_1.$$(this.iframe.body).findAll("[id^=\"" + QuickviewDocument_1.HIGHLIGHT_PREFIX + "\"]"), function (element, index) {
            var quickviewWord = new QuickviewDocumentWord_1.QuickviewDocumentWord(_this.result);
            quickviewWord.doCompleteInitialScanForKeywordInDocument(element);
            if (!quickviewWord.text) {
                return;
            }
            var alreadyScannedKeyword = _this.words[quickviewWord.indexIdentifier];
            if (!alreadyScannedKeyword) {
                _this.words[quickviewWord.indexIdentifier] = quickviewWord;
            }
            else {
                alreadyScannedKeyword.addElement(element);
                // Special code needed to workaround invalid HTML returned by the index with embedded keyword
                if (alreadyScannedKeyword.occurrence == quickviewWord.occurrence) {
                    alreadyScannedKeyword.text += quickviewWord.text;
                }
            }
        });
    };
    return QuickviewDocumentWords;
}());
exports.QuickviewDocumentWords = QuickviewDocumentWords;


/***/ }),

/***/ 641:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Core_1 = __webpack_require__(20);
var Logger_1 = __webpack_require__(9);
var Dom_1 = __webpack_require__(1);
var QuickviewDocument_1 = __webpack_require__(231);
var QuickviewDocumentWordColor_1 = __webpack_require__(642);
var QuickviewDocumentWord = /** @class */ (function () {
    function QuickviewDocumentWord(result) {
        this.result = result;
        this.count = 0;
        this.elements = [];
        this.currentNavigationPosition = -1;
        this.logger = new Logger_1.Logger(this);
    }
    QuickviewDocumentWord.prototype.addElement = function (element) {
        this.count++;
        this.elements.push(element);
    };
    QuickviewDocumentWord.prototype.navigateForward = function () {
        this.currentNavigationPosition++;
        if (this.currentNavigationPosition >= this.elements.length) {
            this.currentNavigationPosition = 0;
        }
        this.highlightNavigation();
        this.putElementIntoView();
        return this.elements[this.currentNavigationPosition];
    };
    QuickviewDocumentWord.prototype.navigateBackward = function () {
        this.currentNavigationPosition--;
        if (this.currentNavigationPosition < 0) {
            this.currentNavigationPosition = this.elements.length - 1;
        }
        this.highlightNavigation();
        this.putElementIntoView();
        return this.elements[this.currentNavigationPosition];
    };
    QuickviewDocumentWord.prototype.navigateTo = function (position) {
        this.currentNavigationPosition = position;
        if (this.currentNavigationPosition < 0 || this.currentNavigationPosition >= this.elements.length) {
            this.currentNavigationPosition = 0;
            this.logger.warn("Invalid position in quickview navigation: " + position);
        }
        this.highlightNavigation();
        return this.elements[this.currentNavigationPosition];
    };
    QuickviewDocumentWord.prototype.doCompleteInitialScanForKeywordInDocument = function (element) {
        var parsed = this.parseKeywordIdentifier(element);
        if (parsed) {
            this.indexIdentifier = parsed.keywordIdentifier;
            this.occurrence = parsed.keywordOccurrencesInDocument;
            this.indexTermPart = parsed.keywordTermPart;
            this.text = this.getText(element);
            this.color = new QuickviewDocumentWordColor_1.QuickviewDocumentWordColor(element.style.backgroundColor);
            this.addElement(element);
        }
    };
    QuickviewDocumentWord.prototype.isTaggedWord = function (element) {
        return element.nodeName.toLowerCase() == 'coveotaggedword';
    };
    QuickviewDocumentWord.prototype.highlightNavigation = function () {
        var _this = this;
        var currentElement = this.elements[this.currentNavigationPosition];
        var otherElements = underscore_1.without(this.elements, currentElement);
        currentElement.style.color = this.color.htmlColor;
        currentElement.style.backgroundColor = this.color.invert();
        otherElements.forEach(function (element) {
            element.style.color = '';
            element.style.backgroundColor = _this.color.htmlColor;
        });
    };
    QuickviewDocumentWord.prototype.putElementIntoView = function () {
        var element = this.elements[this.currentNavigationPosition];
        element.scrollIntoView();
    };
    QuickviewDocumentWord.prototype.getText = function (element) {
        var innerTextOfHTMLElement = this.getHighlightedInnerText(element);
        return this.resolveOriginalTerm(innerTextOfHTMLElement);
    };
    QuickviewDocumentWord.prototype.resolveOriginalTerm = function (highlight) {
        var _this = this;
        if (!this.result || !this.result.termsToHighlight) {
            return highlight;
        }
        var found = underscore_1.find(underscore_1.keys(this.result.termsToHighlight), function (originalTerm) {
            // The expansions do NOT include the original term (makes sense), so be sure to check
            // the original term for a match too.
            var originalTermMatch = Core_1.StringUtils.equalsCaseInsensitive(originalTerm, highlight);
            var expansionMatch = underscore_1.find(_this.result.termsToHighlight[originalTerm], function (expansion) { return Core_1.StringUtils.equalsCaseInsensitive(expansion, highlight); }) !=
                undefined;
            return originalTermMatch || expansionMatch;
        });
        return found || highlight;
    };
    QuickviewDocumentWord.prototype.getHighlightedInnerText = function (element) {
        if (!this.isTaggedWord(element)) {
            return Dom_1.$$(element).text() || '';
        }
        var children = Dom_1.$$(element).children();
        if (children.length >= 1) {
            return Dom_1.$$(underscore_1.first(children)).text() || '';
        }
        return '';
    };
    QuickviewDocumentWord.prototype.parseKeywordIdentifier = function (element) {
        var parts = element.id.substr(QuickviewDocument_1.HIGHLIGHT_PREFIX.length + 1).match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/);
        if (!parts || parts.length <= 3) {
            return null;
        }
        return {
            keywordIdentifier: parts[1],
            keywordOccurrencesInDocument: parseInt(parts[2], 10),
            keywordTermPart: parseInt(parts[3], 10)
        };
    };
    return QuickviewDocumentWord;
}());
exports.QuickviewDocumentWord = QuickviewDocumentWord;


/***/ }),

/***/ 642:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ColorUtils_1 = __webpack_require__(141);
var QuickviewDocumentWordColor = /** @class */ (function () {
    function QuickviewDocumentWordColor(htmlColor) {
        this.htmlColor = htmlColor;
        var rgbExtracted = htmlColor.match(/\d+/g);
        if (rgbExtracted) {
            this.r = parseInt(rgbExtracted[0], 10);
            this.g = parseInt(rgbExtracted[1], 10);
            this.b = parseInt(rgbExtracted[2], 10);
        }
    }
    QuickviewDocumentWordColor.prototype.invert = function () {
        return "rgb(" + (255 - this.r) + ", " + (255 - this.g) + ", " + (255 - this.b) + ")";
    };
    QuickviewDocumentWordColor.prototype.saturate = function () {
        var hsv = ColorUtils_1.ColorUtils.rgbToHsv(this.r, this.g, this.b);
        hsv[1] *= 2;
        if (hsv[1] > 1) {
            hsv[1] = 1;
        }
        var rgb = ColorUtils_1.ColorUtils.hsvToRgb(hsv[0], hsv[1], hsv[2]);
        return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
    };
    return QuickviewDocumentWordColor;
}());
exports.QuickviewDocumentWordColor = QuickviewDocumentWordColor;


/***/ }),

/***/ 643:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var QuickviewDocumentWordButton = /** @class */ (function () {
    function QuickviewDocumentWordButton(word, previewBar, iframe) {
        this.word = word;
        this.previewBar = previewBar;
        this.iframe = iframe;
        this.el = this.render();
    }
    QuickviewDocumentWordButton.prototype.render = function () {
        var wordHtml = Dom_1.$$('span', {
            className: 'coveo-term-for-quickview'
        });
        wordHtml.append(this.buildName().el);
        wordHtml.append(this.renderArrow('up').el);
        wordHtml.append(this.renderArrow('down').el);
        wordHtml.el.style.backgroundColor = this.word.color.htmlColor;
        wordHtml.el.style.borderColor = this.word.color.saturate();
        return wordHtml.el;
    };
    QuickviewDocumentWordButton.prototype.buildName = function () {
        var _this = this;
        var name = Dom_1.$$('span', {
            className: 'coveo-term-for-quickview-name'
        }, this.word.text + " (" + this.word.count + ")");
        name.on('click', function () { return _this.navigate(false); });
        return name;
    };
    QuickviewDocumentWordButton.prototype.navigate = function (backward) {
        var element;
        if (backward) {
            element = this.word.navigateBackward();
            this.previewBar.navigateBackward(this.word);
        }
        else {
            element = this.word.navigateForward();
            this.previewBar.navigateForward(this.word);
        }
        // pdf2html docs hide the non-visible frames by default, to speed up browsers.
        // But this prevents keyword navigation from working so we must force show it. This
        // is done by adding the 'opened' class to it (defined by pdf2html).
        if (this.iframe.isNewQuickviewDocument()) {
            var pdf = Dom_1.$$(element).closest('.pc');
            Dom_1.$$(pdf).addClass('opened');
        }
        element.scrollIntoView();
    };
    QuickviewDocumentWordButton.prototype.renderArrow = function (direction) {
        var _this = this;
        var arrow = Dom_1.$$('span', {
            className: "coveo-term-for-quickview-" + direction + "-arrow"
        });
        var arrowIcon = Dom_1.$$('span', {
            className: "coveo-term-for-quickview-" + direction + "-arrow-icon"
        });
        arrow.append(arrowIcon.el);
        arrow.on('click', function () { return _this.navigate(direction == 'up'); });
        return arrow;
    };
    return QuickviewDocumentWordButton;
}());
exports.QuickviewDocumentWordButton = QuickviewDocumentWordButton;


/***/ }),

/***/ 644:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var Logger_1 = __webpack_require__(9);
var QuickviewDocumentPreviewBar = /** @class */ (function () {
    function QuickviewDocumentPreviewBar(iframe, words) {
        this.iframe = iframe;
        this.words = words;
        this.wordIndicators = new Map();
        this.logger = new Logger_1.Logger(this);
        this.renderPreviewBar();
    }
    QuickviewDocumentPreviewBar.prototype.navigateForward = function (word) {
        var currentWord = this.wordIndicators.get(word);
        if (!currentWord) {
            this.logger.warn("Invalid navigation for given word.", word);
            return null;
        }
        currentWord.position++;
        if (currentWord.position >= currentWord.indicators.length) {
            currentWord.position = 0;
        }
        this.highlightNavigation(word);
        return currentWord.indicators[currentWord.position];
    };
    QuickviewDocumentPreviewBar.prototype.navigateBackward = function (word) {
        var currentWord = this.wordIndicators.get(word);
        if (!currentWord) {
            this.logger.warn("Invalid navigation for the given word.", word);
            return null;
        }
        currentWord.position--;
        if (currentWord.position < 0) {
            currentWord.position = currentWord.indicators.length - 1;
        }
        this.highlightNavigation(word);
        return currentWord.indicators[currentWord.position];
    };
    QuickviewDocumentPreviewBar.prototype.navigateTo = function (position, word) {
        var currentWord = this.wordIndicators.get(word);
        if (!currentWord) {
            this.logger.warn("Invalid navigation for the given word", word);
            return null;
        }
        currentWord.position = position;
        if (currentWord.position < 0 || currentWord.position >= currentWord.indicators.length) {
            this.logger.warn("Invalid navigation for the given position: " + position);
            currentWord.position = 0;
        }
        this.highlightNavigation(word);
        return currentWord.indicators[currentWord.position];
    };
    QuickviewDocumentPreviewBar.prototype.highlightNavigation = function (word) {
        var _this = this;
        var currentWord = this.wordIndicators.get(word);
        var currentElement = currentWord.indicators[currentWord.position];
        var otherElements = underscore_1.without(currentWord.indicators, currentElement);
        currentElement.style.backgroundColor = word.color.invert();
        currentElement.style.border = "1px solid " + word.color.invert();
        otherElements.forEach(function (element) { return _this.defaultStyleColor(element, word); });
    };
    QuickviewDocumentPreviewBar.prototype.renderPreviewBar = function () {
        var _this = this;
        var previewBar = Dom_1.$$('div');
        previewBar.el.style.width = '15px';
        previewBar.el.style.position = 'fixed';
        previewBar.el.style.top = '0';
        previewBar.el.style.right = '0px';
        previewBar.el.style.height = '100%';
        this.iframe.body.appendChild(previewBar.el);
        underscore_1.each(this.words.words, function (word) {
            underscore_1.each(word.elements, function (element) {
                var indicator = _this.renderWordPositionIndicator(element, word).el;
                if (_this.wordIndicators.has(word)) {
                    _this.wordIndicators.get(word).indicators.push(indicator);
                }
                else {
                    _this.wordIndicators.set(word, {
                        indicators: [indicator],
                        position: -1
                    });
                }
                previewBar.append(indicator);
            });
            _this.handleOverlappingIndicators(word);
        });
    };
    QuickviewDocumentPreviewBar.prototype.renderWordPositionIndicator = function (element, word) {
        var docHeight = new Dom_1.Doc(this.iframe.document).height();
        var elementPosition = element.getBoundingClientRect().top;
        var previewUnit = Dom_1.$$('div');
        previewUnit.el.style.position = 'absolute';
        previewUnit.el.style.top = elementPosition / docHeight * 100 + "%";
        previewUnit.el.style.width = '100%';
        previewUnit.el.style.height = '1px';
        this.defaultStyleColor(previewUnit.el, word);
        return previewUnit;
    };
    QuickviewDocumentPreviewBar.prototype.defaultStyleColor = function (element, word) {
        element.style.border = "1px solid " + word.color.saturate();
        element.style.backgroundColor = word.color.htmlColor;
    };
    QuickviewDocumentPreviewBar.prototype.handleOverlappingIndicators = function (word) {
        var allIndicators = this.wordIndicators.get(word).indicators;
        var _loop_1 = function (i) {
            var otherIndicatorAtSamePositionInDocument = underscore_1.chain(allIndicators)
                .without(allIndicators[i])
                .find(function (otherIndicator) { return otherIndicator.style.top == allIndicators[i].style.top; })
                .value();
            if (otherIndicatorAtSamePositionInDocument) {
                Dom_1.$$(allIndicators[i]).remove();
                allIndicators[i] = otherIndicatorAtSamePositionInDocument;
            }
        };
        for (var i = 0; i < allIndicators.length; i++) {
            _loop_1(i);
        }
    };
    return QuickviewDocumentPreviewBar;
}());
exports.QuickviewDocumentPreviewBar = QuickviewDocumentPreviewBar;


/***/ })

});
//# sourceMappingURL=Quickview__b6f3a40b26ad27101c27.js.map