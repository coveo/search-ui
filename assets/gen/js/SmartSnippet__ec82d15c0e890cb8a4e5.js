webpackJsonpCoveo__temporary([19,53],{

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

/***/ 295:
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
var ExternalModulesShim_1 = __webpack_require__(26);
var GlobalExports_1 = __webpack_require__(3);
var Component_1 = __webpack_require__(7);
var Core_1 = __webpack_require__(20);
__webpack_require__(697);
var underscore_1 = __webpack_require__(0);
var UserFeedbackBanner_1 = __webpack_require__(698);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var HeightLimiter_1 = __webpack_require__(699);
var ExplanationModal_1 = __webpack_require__(700);
var Strings_1 = __webpack_require__(6);
var AttachShadowPolyfill_1 = __webpack_require__(517);
var Utils_1 = __webpack_require__(4);
var reasons = [
    {
        analytics: AnalyticsActionListMeta_1.AnalyticsSmartSnippetFeedbackReason.DoesNotAnswer,
        localeKey: 'UsefulnessFeedbackDoesNotAnswer'
    },
    {
        analytics: AnalyticsActionListMeta_1.AnalyticsSmartSnippetFeedbackReason.PartiallyAnswers,
        localeKey: 'UsefulnessFeedbackPartiallyAnswers'
    },
    {
        analytics: AnalyticsActionListMeta_1.AnalyticsSmartSnippetFeedbackReason.WasNotAQuestion,
        localeKey: 'UsefulnessFeedbackWasNotAQuestion'
    },
    {
        analytics: AnalyticsActionListMeta_1.AnalyticsSmartSnippetFeedbackReason.Other,
        localeKey: 'Other',
        hasDetails: true
    }
];
var BASE_CLASSNAME = 'coveo-smart-snippet';
var QUESTION_CLASSNAME = BASE_CLASSNAME + "-question";
var ANSWER_CONTAINER_CLASSNAME = BASE_CLASSNAME + "-answer";
var HAS_ANSWER_CLASSNAME = BASE_CLASSNAME + "-has-answer";
var SHADOW_CLASSNAME = BASE_CLASSNAME + "-content";
var CONTENT_CLASSNAME = BASE_CLASSNAME + "-content-wrapper";
var SOURCE_CLASSNAME = BASE_CLASSNAME + "-source";
var SOURCE_TITLE_CLASSNAME = SOURCE_CLASSNAME + "-title";
var SOURCE_URL_CLASSNAME = SOURCE_CLASSNAME + "-url";
exports.SmartSnippetClassNames = {
    QUESTION_CLASSNAME: QUESTION_CLASSNAME,
    ANSWER_CONTAINER_CLASSNAME: ANSWER_CONTAINER_CLASSNAME,
    HAS_ANSWER_CLASSNAME: HAS_ANSWER_CLASSNAME,
    SHADOW_CLASSNAME: SHADOW_CLASSNAME,
    CONTENT_CLASSNAME: CONTENT_CLASSNAME,
    SOURCE_CLASSNAME: SOURCE_CLASSNAME,
    SOURCE_TITLE_CLASSNAME: SOURCE_TITLE_CLASSNAME,
    SOURCE_URL_CLASSNAME: SOURCE_URL_CLASSNAME
};
var SmartSnippet = /** @class */ (function (_super) {
    __extends(SmartSnippet, _super);
    function SmartSnippet(element, options, bindings, ModalBox) {
        if (ModalBox === void 0) { ModalBox = ExternalModulesShim_1.ModalBox; }
        var _this = _super.call(this, element, SmartSnippet.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.ModalBox = ModalBox;
        _this.bind.onRootElement(Core_1.QueryEvents.deferredQuerySuccess, function (data) { return _this.handleQuerySuccess(data); });
        return _this;
    }
    Object.defineProperty(SmartSnippet.prototype, "style", {
        get: function () {
            return Core_1.$$(this.element)
                .children()
                .filter(function (element) { return element instanceof HTMLScriptElement && element.type.toLowerCase() === 'text/css'; })
                .map(function (element) { return element.innerHTML; })
                .join('\n');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SmartSnippet.prototype, "hasAnswer", {
        set: function (hasAnswer) {
            Core_1.$$(this.element).toggleClass(HAS_ANSWER_CLASSNAME, hasAnswer);
        },
        enumerable: true,
        configurable: true
    });
    SmartSnippet.prototype.createDom = function () {
        var _this = this;
        this.element.appendChild(this.buildAnswerContainer());
        this.feedbackBanner = new UserFeedbackBanner_1.UserFeedbackBanner(function (isUseful) { return (isUseful ? _this.sendLikeSmartSnippetAnalytics() : _this.sendDislikeSmartSnippetAnalytics()); }, function () { return _this.openExplanationModal(); });
        this.element.appendChild(this.feedbackBanner.build());
        this.explanationModal = new ExplanationModal_1.ExplanationModal({
            reasons: reasons.map(function (reason) {
                return ({
                    label: Strings_1.l(reason.localeKey),
                    id: reason.analytics.replace(/_/g, '-'),
                    onSelect: function () { return _this.sendExplanationAnalytics(reason.analytics, _this.explanationModal.details); },
                    hasDetails: reason.hasDetails
                });
            }),
            onClosed: function () { return _this.sendCloseFeedbackModalAnalytics(); },
            ownerElement: this.searchInterface.options.modalContainer,
            modalBoxModule: this.ModalBox
        });
    };
    SmartSnippet.prototype.buildAnswerContainer = function () {
        return Core_1.$$('div', {
            className: ANSWER_CONTAINER_CLASSNAME
        }, this.buildQuestion(), this.buildShadow(), this.buildHeightLimiter(), this.buildSourceContainer()).el;
    };
    SmartSnippet.prototype.buildQuestion = function () {
        return (this.questionContainer = Core_1.$$('div', { className: QUESTION_CLASSNAME }).el);
    };
    SmartSnippet.prototype.buildShadow = function () {
        var _this = this;
        this.shadowContainer = Core_1.$$('div', { className: SHADOW_CLASSNAME }).el;
        this.snippetContainer = Core_1.$$('section', { className: CONTENT_CLASSNAME }).el;
        this.shadowLoading = AttachShadowPolyfill_1.attachShadow(this.shadowContainer, { mode: 'open', title: Strings_1.l('AnswerSnippet') }).then(function (shadow) {
            shadow.appendChild(_this.snippetContainer);
            var style = _this.buildStyle();
            if (style) {
                shadow.appendChild(style);
            }
            return shadow;
        });
        return this.shadowContainer;
    };
    SmartSnippet.prototype.buildHeightLimiter = function () {
        var _this = this;
        return (this.heightLimiter = new HeightLimiter_1.HeightLimiter(this.shadowContainer, this.snippetContainer, 400, function (isExpanded) {
            return isExpanded ? _this.sendExpandSmartSnippetAnalytics() : _this.sendCollapseSmartSnippetAnalytics();
        })).toggleButton;
    };
    SmartSnippet.prototype.buildSourceContainer = function () {
        return (this.sourceContainer = Core_1.$$('div', { className: SOURCE_CLASSNAME }).el);
    };
    SmartSnippet.prototype.buildStyle = function () {
        var style = this.style;
        if (!style) {
            return;
        }
        var styleTag = document.createElement('style');
        styleTag.innerHTML = style;
        return styleTag;
    };
    /**
     * @warning This method only works for the demo. In practice, the source of the answer will not always be part of the results.
     */
    SmartSnippet.prototype.getCorrespondingResult = function (questionAnswer) {
        return underscore_1.find(this.queryController.getLastResults().results, function (result) { return result.raw[questionAnswer.documentId.contentIdKey] === questionAnswer.documentId.contentIdValue; });
    };
    SmartSnippet.prototype.handleQuerySuccess = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var questionAnswer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        questionAnswer = data.results.questionAnswer;
                        if (!questionAnswer) {
                            this.hasAnswer = false;
                            return [2 /*return*/];
                        }
                        this.hasAnswer = true;
                        return [4 /*yield*/, this.render(questionAnswer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SmartSnippet.prototype.render = function (questionAnswer) {
        return __awaiter(this, void 0, void 0, function () {
            var lastRenderedResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureDom();
                        this.questionContainer.innerText = questionAnswer.question;
                        this.renderSnippet(questionAnswer.answerSnippet);
                        lastRenderedResult = this.getCorrespondingResult(questionAnswer);
                        if (lastRenderedResult) {
                            this.renderSource(lastRenderedResult);
                        }
                        return [4 /*yield*/, this.shadowLoading];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Utils_1.Utils.resolveAfter(0)];
                    case 2:
                        _a.sent(); // `scrollHeight` isn't instantly detected, or at-least not on IE11.
                        this.heightLimiter.onContentHeightChanged();
                        return [2 /*return*/];
                }
            });
        });
    };
    SmartSnippet.prototype.renderSnippet = function (content) {
        this.snippetContainer.innerHTML = content;
    };
    SmartSnippet.prototype.renderSource = function (source) {
        Core_1.$$(this.sourceContainer).empty();
        this.sourceContainer.appendChild(this.renderSourceUrl(source.clickUri));
        this.sourceContainer.appendChild(this.renderSourceTitle(source.title, source.clickUri));
    };
    SmartSnippet.prototype.renderSourceTitle = function (title, clickUri) {
        return this.renderLink(title, clickUri, SOURCE_TITLE_CLASSNAME);
    };
    SmartSnippet.prototype.renderSourceUrl = function (url) {
        return this.renderLink(url, url, SOURCE_URL_CLASSNAME);
    };
    SmartSnippet.prototype.renderLink = function (text, href, className) {
        var _this = this;
        var element = Core_1.$$('a', { className: className, href: href }).el;
        element.innerText = text;
        this.enableAnalyticsOnLink(element, function () { return _this.sendOpenSourceAnalytics(); });
        return element;
    };
    SmartSnippet.prototype.enableAnalyticsOnLink = function (link, sendAnalytics) {
        var _this = this;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            _this.openLink(link.href, e.ctrlKey, sendAnalytics);
        });
    };
    SmartSnippet.prototype.openLink = function (href, newTab, sendAnalytics) {
        sendAnalytics();
        if (newTab) {
            window.open(href);
        }
        else {
            window.location.href = href;
        }
    };
    SmartSnippet.prototype.openExplanationModal = function () {
        this.sendOpenFeedbackModalAnalytics();
        this.explanationModal.open(this.feedbackBanner.explainWhy);
    };
    SmartSnippet.prototype.sendLikeSmartSnippetAnalytics = function () {
        return this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.likeSmartSnippet, {}, this.element, this.lastRenderedResult);
    };
    SmartSnippet.prototype.sendDislikeSmartSnippetAnalytics = function () {
        return this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.dislikeSmartSnippet, {}, this.element, this.lastRenderedResult);
    };
    SmartSnippet.prototype.sendExpandSmartSnippetAnalytics = function () {
        return this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.expandSmartSnippet, {}, this.element, this.lastRenderedResult);
    };
    SmartSnippet.prototype.sendCollapseSmartSnippetAnalytics = function () {
        return this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.collapseSmartSnippet, {}, this.element, this.lastRenderedResult);
    };
    SmartSnippet.prototype.sendOpenSourceAnalytics = function () {
        return this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.openSmartSnippetSource, {}, this.element, this.lastRenderedResult);
    };
    SmartSnippet.prototype.sendOpenFeedbackModalAnalytics = function () {
        return this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.openSmartSnippetFeedbackModal, {}, this.element, this.lastRenderedResult);
    };
    SmartSnippet.prototype.sendCloseFeedbackModalAnalytics = function () {
        return this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.closeSmartSnippetFeedbackModal, {}, this.element, this.lastRenderedResult);
    };
    SmartSnippet.prototype.sendExplanationAnalytics = function (reason, details) {
        return this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.sendSmartSnippetReason, {
            reason: reason,
            details: details
        }, this.element, this.lastRenderedResult);
    };
    SmartSnippet.ID = 'SmartSnippet';
    SmartSnippet.doExport = function () {
        GlobalExports_1.exportGlobally({
            SmartSnippet: SmartSnippet
        });
    };
    return SmartSnippet;
}(Component_1.Component));
exports.SmartSnippet = SmartSnippet;
Core_1.Initialization.registerAutoCreateComponent(SmartSnippet);


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

/***/ 517:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var Dom_1 = __webpack_require__(1);
__webpack_require__(582);
function attachShadow(element, init) {
    return __awaiter(this, void 0, void 0, function () {
        var iframe, onLoad, iframeBody, shadowRoot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    iframe = Dom_1.$$('iframe', { className: 'coveo-shadow-iframe', scrolling: 'no', title: init.title }).el;
                    onLoad = new Promise(function (resolve) { return iframe.addEventListener('load', function () { return resolve(); }); });
                    element.appendChild(iframe);
                    return [4 /*yield*/, onLoad];
                case 1:
                    _a.sent();
                    iframeBody = iframe.contentDocument.body;
                    iframeBody.style.margin = '0';
                    shadowRoot = Dom_1.$$('div', { style: 'overflow: auto;' }).el;
                    iframeBody.appendChild(shadowRoot);
                    autoUpdateHeight(iframe, shadowRoot);
                    if (init.mode === 'open') {
                        Object.defineProperty(element, 'shadowRoot', { get: function () { return shadowRoot; } });
                    }
                    return [2 /*return*/, shadowRoot];
            }
        });
    });
}
exports.attachShadow = attachShadow;
function autoUpdateHeight(elementToResize, content) {
    var heightObserver = new MutationObserver(function () {
        elementToResize.style.height = content.clientHeight + "px";
    });
    heightObserver.observe(content, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
    });
}


/***/ }),

/***/ 555:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 582:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 697:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 698:
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
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var SVGIcons_1 = __webpack_require__(12);
var underscore_1 = __webpack_require__(0);
var ROOT_CLASSNAME = 'coveo-user-feedback-banner';
var CONTAINER_CLASSNAME = ROOT_CLASSNAME + "-container";
var LABEL_CLASSNAME = ROOT_CLASSNAME + "-label";
var BUTTONS_CONTAINER_CLASSNAME = ROOT_CLASSNAME + "-buttons";
var YES_BUTTON_CLASSNAME = ROOT_CLASSNAME + "-yes-button";
var NO_BUTTON_CLASSNAME = ROOT_CLASSNAME + "-no-button";
var BUTTON_ACTIVE_CLASSNAME = ROOT_CLASSNAME + "-button-active";
var THANK_YOU_BANNER_CLASSNAME = ROOT_CLASSNAME + "-thanks";
var THANK_YOU_BANNER_ACTIVE_CLASSNAME = THANK_YOU_BANNER_CLASSNAME + "-active";
var ICON_CLASSNAME = THANK_YOU_BANNER_CLASSNAME + "-icon";
var EXPLAIN_WHY_CLASSNAME = ROOT_CLASSNAME + "-explain-why";
var EXPLAIN_WHY_ACTIVE_CLASSNAME = EXPLAIN_WHY_CLASSNAME + "-active";
var UsefulState;
(function (UsefulState) {
    UsefulState[UsefulState["Unknown"] = 0] = "Unknown";
    UsefulState[UsefulState["Yes"] = 1] = "Yes";
    UsefulState[UsefulState["No"] = 2] = "No";
})(UsefulState || (UsefulState = {}));
exports.UserFeedbackBannerClassNames = {
    ROOT_CLASSNAME: ROOT_CLASSNAME,
    CONTAINER_CLASSNAME: CONTAINER_CLASSNAME,
    LABEL_CLASSNAME: LABEL_CLASSNAME,
    BUTTONS_CONTAINER_CLASSNAME: BUTTONS_CONTAINER_CLASSNAME,
    YES_BUTTON_CLASSNAME: YES_BUTTON_CLASSNAME,
    NO_BUTTON_CLASSNAME: NO_BUTTON_CLASSNAME,
    BUTTON_ACTIVE_CLASSNAME: BUTTON_ACTIVE_CLASSNAME,
    THANK_YOU_BANNER_CLASSNAME: THANK_YOU_BANNER_CLASSNAME,
    THANK_YOU_BANNER_ACTIVE_CLASSNAME: THANK_YOU_BANNER_ACTIVE_CLASSNAME,
    ICON_CLASSNAME: ICON_CLASSNAME,
    EXPLAIN_WHY_CLASSNAME: EXPLAIN_WHY_CLASSNAME,
    EXPLAIN_WHY_ACTIVE_CLASSNAME: EXPLAIN_WHY_ACTIVE_CLASSNAME
};
var UserFeedbackBanner = /** @class */ (function () {
    function UserFeedbackBanner(sendUsefulnessAnalytics, onExplainWhyPressed) {
        this.sendUsefulnessAnalytics = sendUsefulnessAnalytics;
        this.onExplainWhyPressed = onExplainWhyPressed;
        this.isUseful = UsefulState.Unknown;
        this.labelId = underscore_1.uniqueId(LABEL_CLASSNAME);
    }
    UserFeedbackBanner.prototype.build = function () {
        return Dom_1.$$('div', {
            className: ROOT_CLASSNAME,
            ariaLive: 'polite'
        }, this.buildContainer(), this.buildThankYouBanner()).el;
    };
    UserFeedbackBanner.prototype.buildContainer = function () {
        return Dom_1.$$('div', {
            className: CONTAINER_CLASSNAME,
            ariaLabelledby: this.labelId
        }, this.buildLabel(), this.buildButtons()).el;
    };
    UserFeedbackBanner.prototype.buildLabel = function () {
        return Dom_1.$$('span', { className: LABEL_CLASSNAME, id: this.labelId }, Strings_1.l('UsefulnessFeedbackRequest')).el;
    };
    UserFeedbackBanner.prototype.buildThankYouBanner = function () {
        var _this = this;
        this.thankYouBanner = Dom_1.$$('div', { className: THANK_YOU_BANNER_CLASSNAME }).el;
        var text = Dom_1.$$('span', {}, Strings_1.l('UsefulnessFeedbackThankYou')).el;
        this.thankYouBanner.appendChild(text);
        this.explainWhy = this.buildButton({
            text: Strings_1.l('UsefulnessFeedbackExplainWhy'),
            className: EXPLAIN_WHY_CLASSNAME,
            action: function () { return _this.requestExplaination(); }
        });
        this.thankYouBanner.appendChild(this.explainWhy);
        return this.thankYouBanner;
    };
    UserFeedbackBanner.prototype.buildButtons = function () {
        var _this = this;
        var buttonsContainer = Dom_1.$$('div', { className: BUTTONS_CONTAINER_CLASSNAME }).el;
        this.yesButton = this.buildButton({
            text: Strings_1.l('Yes'),
            className: YES_BUTTON_CLASSNAME,
            action: function () { return _this.showThankYouBanner(true); },
            icon: {
                className: ICON_CLASSNAME,
                content: SVGIcons_1.SVGIcons.icons.checkYes
            },
            attributes: {
                ariaPressed: false,
                ariaDescribedby: this.labelId
            }
        });
        this.yesButton.setAttribute('aria-pressed', 'false');
        buttonsContainer.appendChild(this.yesButton);
        this.noButton = this.buildButton({
            text: Strings_1.l('No'),
            className: NO_BUTTON_CLASSNAME,
            action: function () { return _this.showThankYouBanner(false); },
            icon: {
                className: ICON_CLASSNAME,
                content: SVGIcons_1.SVGIcons.icons.clearSmall
            },
            attributes: {
                ariaPressed: false,
                ariaDescribedby: this.labelId
            }
        });
        buttonsContainer.appendChild(this.noButton);
        return buttonsContainer;
    };
    UserFeedbackBanner.prototype.buildButton = function (options) {
        var button = Dom_1.$$('button', __assign({}, (options.attributes || {}), { className: options.className })).el;
        if (options.icon) {
            var icon = Dom_1.$$('span', { className: options.icon.className }, options.icon.content).el;
            button.appendChild(icon);
            var text = Dom_1.$$('span', {}, options.text).el;
            button.appendChild(text);
        }
        else {
            button.innerText = options.text;
        }
        button.addEventListener('click', function () { return options.action(); });
        return button;
    };
    UserFeedbackBanner.prototype.showThankYouBanner = function (isUseful) {
        if (this.isUseful !== UsefulState.Unknown && isUseful === (this.isUseful === UsefulState.Yes)) {
            return;
        }
        this.isUseful = isUseful ? UsefulState.Yes : UsefulState.No;
        Dom_1.$$(this.yesButton).toggleClass(BUTTON_ACTIVE_CLASSNAME, isUseful);
        Dom_1.$$(this.yesButton).setAttribute('aria-pressed', "" + isUseful);
        Dom_1.$$(this.noButton).toggleClass(BUTTON_ACTIVE_CLASSNAME, !isUseful);
        Dom_1.$$(this.noButton).setAttribute('aria-pressed', "" + !isUseful);
        Dom_1.$$(this.thankYouBanner).addClass(THANK_YOU_BANNER_ACTIVE_CLASSNAME);
        Dom_1.$$(this.explainWhy).toggleClass(EXPLAIN_WHY_ACTIVE_CLASSNAME, !isUseful);
        this.sendUsefulnessAnalytics(isUseful);
    };
    UserFeedbackBanner.prototype.requestExplaination = function () {
        this.onExplainWhyPressed();
    };
    return UserFeedbackBanner;
}());
exports.UserFeedbackBanner = UserFeedbackBanner;


/***/ }),

/***/ 699:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var SVGIcons_1 = __webpack_require__(12);
var Strings_1 = __webpack_require__(6);
var BASE_CLASSNAME = 'coveo-height-limiter';
var CONTAINER_ACTIVE_CLASSNAME = BASE_CLASSNAME + "-container-active";
var CONTAINER_EXPANDED_CLASSNAME = BASE_CLASSNAME + "-container-expanded";
var BUTTON_CLASSNAME = BASE_CLASSNAME + "-button";
var BUTTON_LABEL_CLASSNAME = BUTTON_CLASSNAME + "-label";
var BUTTON_ICON_CLASSNAME = BUTTON_CLASSNAME + "-icon";
var BUTTON_ACTIVE_CLASSNAME = BUTTON_CLASSNAME + "-active";
exports.HeightLimiterClassNames = {
    CONTAINER_ACTIVE_CLASSNAME: CONTAINER_ACTIVE_CLASSNAME,
    CONTAINER_EXPANDED_CLASSNAME: CONTAINER_EXPANDED_CLASSNAME,
    BUTTON_CLASSNAME: BUTTON_CLASSNAME,
    BUTTON_LABEL_CLASSNAME: BUTTON_LABEL_CLASSNAME,
    BUTTON_ICON_CLASSNAME: BUTTON_ICON_CLASSNAME,
    BUTTON_ACTIVE_CLASSNAME: BUTTON_ACTIVE_CLASSNAME
};
var HeightLimiter = /** @class */ (function () {
    function HeightLimiter(containerElement, contentElement, heightLimit, onToggle) {
        this.containerElement = containerElement;
        this.contentElement = contentElement;
        this.heightLimit = heightLimit;
        this.onToggle = onToggle;
        this.isExpanded = false;
        this.buildButton();
        this.updateActiveAppearance();
    }
    Object.defineProperty(HeightLimiter.prototype, "toggleButton", {
        get: function () {
            return this.button;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeightLimiter.prototype, "height", {
        set: function (height) {
            this.containerElement.style.height = height + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeightLimiter.prototype, "contentHeight", {
        get: function () {
            return this.contentElement.clientHeight;
        },
        enumerable: true,
        configurable: true
    });
    HeightLimiter.prototype.onContentHeightChanged = function () {
        this.updateActiveAppearance();
    };
    HeightLimiter.prototype.buildButton = function () {
        var _this = this;
        this.button = Dom_1.$$('button', { className: BUTTON_CLASSNAME, ariaLabel: Strings_1.l('ShowMore'), ariaPressed: 'false', ariaHidden: 'true' }, (this.buttonLabel = Dom_1.$$('span', { className: BUTTON_LABEL_CLASSNAME }).el), (this.buttonIcon = Dom_1.$$('span', { className: BUTTON_ICON_CLASSNAME }).el)).el;
        this.button.addEventListener('click', function () { return _this.toggle(); });
        this.updateButton();
        return this.button;
    };
    HeightLimiter.prototype.updateActiveAppearance = function () {
        var shouldBeActive = this.contentHeight > this.heightLimit;
        Dom_1.$$(this.containerElement).toggleClass(CONTAINER_ACTIVE_CLASSNAME, shouldBeActive);
        Dom_1.$$(this.button).toggleClass(BUTTON_ACTIVE_CLASSNAME, shouldBeActive);
        if (shouldBeActive) {
            this.updateExpandedAppearance();
        }
        else {
            this.isExpanded = false;
            this.updateExpandedAppearance();
            this.containerElement.style.height = '';
        }
    };
    HeightLimiter.prototype.updateButton = function () {
        this.buttonLabel.innerText = this.isExpanded ? Strings_1.l('ShowLess') : Strings_1.l('ShowMore');
        this.button.setAttribute('aria-pressed', "" + this.isExpanded);
        this.buttonIcon.innerHTML = this.isExpanded ? SVGIcons_1.SVGIcons.icons.arrowUp : SVGIcons_1.SVGIcons.icons.arrowDown;
    };
    HeightLimiter.prototype.updateExpandedAppearance = function () {
        this.updateButton();
        Dom_1.$$(this.containerElement).toggleClass(CONTAINER_EXPANDED_CLASSNAME, this.isExpanded);
        this.height = this.isExpanded ? this.contentHeight : this.heightLimit;
    };
    HeightLimiter.prototype.toggle = function () {
        this.isExpanded = !this.isExpanded;
        this.updateExpandedAppearance();
        if (this.onToggle) {
            this.onToggle(this.isExpanded);
        }
    };
    return HeightLimiter;
}());
exports.HeightLimiter = HeightLimiter;


/***/ }),

/***/ 700:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AccessibleModal_1 = __webpack_require__(220);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var RadioButton_1 = __webpack_require__(94);
__webpack_require__(701);
var ROOT_CLASSNAME = 'coveo-user-explanation-modal';
var CONTENT_CLASSNAME = ROOT_CLASSNAME + "-content";
var EXPLANATION_SECTION_CLASSNAME = ROOT_CLASSNAME + "-explanation-section";
var REASONS_CLASSNAME = ROOT_CLASSNAME + "-explanations";
var REASONS_LABEL_CLASSNAME = REASONS_CLASSNAME + "-label";
var DETAILS_SECTION_CLASSNAME = ROOT_CLASSNAME + "-details";
var DETAILS_TEXTAREA_CLASSNAME = DETAILS_SECTION_CLASSNAME + "-textarea";
var DETAILS_LABEL_CLASSNAME = DETAILS_SECTION_CLASSNAME + "-label";
var BUTTONS_SECTION_CLASSNAME = ROOT_CLASSNAME + "-buttons-section";
var SEND_BUTTON_CLASSNAME = ROOT_CLASSNAME + "-send-button";
var CANCEL_BUTTON_CLASSNAME = ROOT_CLASSNAME + "-cancel-button";
var DETAILS_ID = DETAILS_SECTION_CLASSNAME;
exports.ExplanationModalClassNames = {
    ROOT_CLASSNAME: ROOT_CLASSNAME,
    CONTENT_CLASSNAME: CONTENT_CLASSNAME,
    EXPLANATION_SECTION_CLASSNAME: EXPLANATION_SECTION_CLASSNAME,
    REASONS_CLASSNAME: REASONS_CLASSNAME,
    REASONS_LABEL_CLASSNAME: REASONS_LABEL_CLASSNAME,
    DETAILS_SECTION_CLASSNAME: DETAILS_SECTION_CLASSNAME,
    DETAILS_TEXTAREA_CLASSNAME: DETAILS_TEXTAREA_CLASSNAME,
    DETAILS_LABEL_CLASSNAME: DETAILS_LABEL_CLASSNAME,
    BUTTONS_SECTION_CLASSNAME: BUTTONS_SECTION_CLASSNAME,
    SEND_BUTTON_CLASSNAME: SEND_BUTTON_CLASSNAME,
    CANCEL_BUTTON_CLASSNAME: CANCEL_BUTTON_CLASSNAME
};
var ExplanationModal = /** @class */ (function () {
    function ExplanationModal(options) {
        this.options = options;
        this.shouldCallCloseEvent = false;
        this.modal = new AccessibleModal_1.AccessibleModal(ROOT_CLASSNAME, this.options.ownerElement, this.options.modalBoxModule);
    }
    Object.defineProperty(ExplanationModal.prototype, "details", {
        get: function () {
            if (!this.selectedReason || !this.selectedReason.hasDetails) {
                return null;
            }
            return this.detailsTextArea.value;
        },
        enumerable: true,
        configurable: true
    });
    ExplanationModal.prototype.open = function (origin) {
        var _this = this;
        this.modal.open({
            origin: origin,
            title: Strings_1.l('UsefulnessFeedbackExplainWhyImperative'),
            content: this.buildContent(),
            validation: function () {
                if (_this.shouldCallCloseEvent) {
                    _this.options.onClosed();
                    _this.shouldCallCloseEvent = false;
                }
                return true;
            }
        });
        this.shouldCallCloseEvent = true;
    };
    ExplanationModal.prototype.buildContent = function () {
        return Dom_1.$$('div', {
            className: CONTENT_CLASSNAME
        }, this.buildExplanationSection(), this.buildButtonsSection()).el;
    };
    ExplanationModal.prototype.buildExplanationSection = function () {
        var detailsSection = this.buildDetailsSection();
        return Dom_1.$$('div', {
            className: EXPLANATION_SECTION_CLASSNAME
        }, this.buildReasons(), detailsSection).el;
    };
    ExplanationModal.prototype.buildButtonsSection = function () {
        return Dom_1.$$('div', {
            className: BUTTONS_SECTION_CLASSNAME
        }, this.buildSendButton(), this.buildCancelButton());
    };
    ExplanationModal.prototype.buildReasons = function () {
        var _this = this;
        var reasonsContainer = Dom_1.$$('fieldset', { className: REASONS_CLASSNAME }, this.buildReasonsLabel()).el;
        this.reasons = this.options.reasons.map(function (reason) { return _this.buildReasonRadioButton(reason); });
        this.reasons[0].select();
        this.reasons.forEach(function (radioButton) { return reasonsContainer.appendChild(radioButton.getElement()); });
        return reasonsContainer;
    };
    ExplanationModal.prototype.buildReasonsLabel = function () {
        return Dom_1.$$('legend', { className: REASONS_LABEL_CLASSNAME }, Strings_1.l('UsefulnessFeedbackReason')).el;
    };
    ExplanationModal.prototype.buildDetailsSection = function () {
        return Dom_1.$$('div', { className: DETAILS_SECTION_CLASSNAME }, Dom_1.$$('label', { className: DETAILS_LABEL_CLASSNAME, for: DETAILS_ID }, Strings_1.l('Details')).el, (this.detailsTextArea = Dom_1.$$('textarea', { className: DETAILS_TEXTAREA_CLASSNAME, id: DETAILS_ID, disabled: true })
            .el));
    };
    ExplanationModal.prototype.buildSendButton = function () {
        var _this = this;
        var button = Dom_1.$$('button', { className: SEND_BUTTON_CLASSNAME }, Strings_1.l('Send'));
        button.on('click', function () {
            _this.selectedReason.onSelect();
            _this.shouldCallCloseEvent = false;
            _this.modal.close();
        });
        return button.el;
    };
    ExplanationModal.prototype.buildCancelButton = function () {
        var _this = this;
        var button = Dom_1.$$('button', { className: CANCEL_BUTTON_CLASSNAME }, Strings_1.l('Cancel'));
        button.on('click', function () { return _this.modal.close(); });
        return button.el;
    };
    ExplanationModal.prototype.buildReasonRadioButton = function (reason) {
        var _this = this;
        return new RadioButton_1.RadioButton(function (radioButton) {
            if (!radioButton.isSelected()) {
                return;
            }
            _this.detailsTextArea.disabled = !reason.hasDetails;
            _this.selectedReason = reason;
        }, reason.label, 'reason', "coveo-reason-" + reason.id);
    };
    return ExplanationModal;
}());
exports.ExplanationModal = ExplanationModal;


/***/ }),

/***/ 701:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
__webpack_require__(555);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A radio button widget with standard styling.
 */
var RadioButton = /** @class */ (function () {
    /**
     * Creates a new `RadioButton`.
     * @param onChange The function to call when the radio button value changes. This function takes the current
     * `RadioButton` instance as an argument.
     * @param label The label to display next to the radio button.
     * @param name The value to set the `input` HTMLElement `name` attribute to.
     */
    function RadioButton(onChange, label, name, id) {
        if (onChange === void 0) { onChange = function (radioButton) { }; }
        if (id === void 0) { id = label; }
        this.onChange = onChange;
        this.label = label;
        this.name = name;
        this.id = id;
        this.buildContent();
    }
    RadioButton.doExport = function () {
        GlobalExports_1.exportGlobally({
            RadioButton: RadioButton
        });
    };
    /**
     * Resets the radio button.
     */
    RadioButton.prototype.reset = function () {
        var currentlySelected = this.isSelected();
        this.getRadio().checked = false;
        if (currentlySelected) {
            this.onChange(this);
        }
    };
    /**
     * Select the radio button
     * @param triggerChange will trigger change event if specified and the radio button is not already selected
     */
    RadioButton.prototype.select = function (triggerChange) {
        if (triggerChange === void 0) { triggerChange = true; }
        var currentlySelected = this.isSelected();
        this.getRadio().checked = true;
        if (!currentlySelected && triggerChange) {
            this.onChange(this);
        }
    };
    /**
     * Gets the element on which the radio button is bound.
     * @returns {HTMLElement} The radio button element.
     */
    RadioButton.prototype.build = function () {
        return this.element;
    };
    /**
     * Gets the element on which the radio button is bound.
     * @returns {HTMLElement} The radio button element.
     */
    RadioButton.prototype.getElement = function () {
        return this.element;
    };
    RadioButton.prototype.getValue = function () {
        return this.label;
    };
    /**
     * Indicates whether the radio button is selected.
     * @returns {boolean} `true` if the radio button is selected, `false` otherwise.
     */
    RadioButton.prototype.isSelected = function () {
        return this.getRadio().checked;
    };
    /**
     * Gets the `input` element (the radio button itself).
     * @returns {HTMLInputElement} The `input` element.
     */
    RadioButton.prototype.getRadio = function () {
        return Dom_1.$$(this.element).find('input');
    };
    /**
     * Gets the radio button [`label`]{@link RadioButton.label} element.
     * @returns {HTMLLabelElement} The `label` element.
     */
    RadioButton.prototype.getLabel = function () {
        return Dom_1.$$(this.element).find('label');
    };
    RadioButton.prototype.buildContent = function () {
        var _this = this;
        var radioOption = Dom_1.$$('div', { className: 'coveo-radio' });
        var radioInput = Dom_1.$$('input', { type: 'radio', name: this.name, id: this.id });
        var labelInput = Dom_1.$$('label', { className: 'coveo-radio-input-label', for: this.id });
        labelInput.text(this.label);
        radioInput.on('change', function () {
            _this.onChange(_this);
        });
        radioOption.append(radioInput.el);
        radioOption.append(labelInput.el);
        this.element = radioOption.el;
    };
    return RadioButton;
}());
exports.RadioButton = RadioButton;


/***/ })

});
//# sourceMappingURL=SmartSnippet__ec82d15c0e890cb8a4e5.js.map