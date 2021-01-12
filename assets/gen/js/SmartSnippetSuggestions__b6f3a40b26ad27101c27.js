webpackJsonpCoveo__temporary([28],{

/***/ 296:
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
__webpack_require__(702);
var Component_1 = __webpack_require__(7);
var GlobalExports_1 = __webpack_require__(3);
var QueryEvents_1 = __webpack_require__(11);
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var SmartSnippetCollapsibleSuggestion_1 = __webpack_require__(703);
var Strings_1 = __webpack_require__(6);
var Initialization_1 = __webpack_require__(2);
var BASE_CLASSNAME = 'coveo-smart-snippet-suggestions';
var HAS_QUESTIONS_CLASSNAME = BASE_CLASSNAME + "-has-questions";
var QUESTIONS_LIST_CLASSNAME = BASE_CLASSNAME + "-questions";
var QUESTIONS_LIST_TITLE_CLASSNAME = QUESTIONS_LIST_CLASSNAME + "-title";
exports.SmartSnippetSuggestionsClassNames = {
    HAS_QUESTIONS_CLASSNAME: HAS_QUESTIONS_CLASSNAME,
    QUESTIONS_LIST_CLASSNAME: QUESTIONS_LIST_CLASSNAME,
    QUESTIONS_LIST_TITLE_CLASSNAME: QUESTIONS_LIST_TITLE_CLASSNAME
};
var SmartSnippetSuggestions = /** @class */ (function (_super) {
    __extends(SmartSnippetSuggestions, _super);
    function SmartSnippetSuggestions(element, options, bindings) {
        var _this = _super.call(this, element, SmartSnippetSuggestions.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.titleId = underscore_1.uniqueId(QUESTIONS_LIST_TITLE_CLASSNAME);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function (data) { return _this.handleQuerySuccess(data); });
        return _this;
    }
    Object.defineProperty(SmartSnippetSuggestions.prototype, "loading", {
        get: function () {
            return this.contentLoaded;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @warning This method only works for the demo. In practice, the source of the answer will not always be part of the results.
     */
    SmartSnippetSuggestions.prototype.getCorrespondingResult = function (questionAnswer) {
        return underscore_1.find(this.queryController.getLastResults().results, function (result) { return result.raw[questionAnswer.documentId.contentIdKey] === questionAnswer.documentId.contentIdValue; });
    };
    SmartSnippetSuggestions.prototype.handleQuerySuccess = function (data) {
        var questionAnswer = data.results.questionAnswer;
        var hasQuestions = !!(questionAnswer && questionAnswer.relatedQuestions.length);
        Dom_1.$$(this.element).toggleClass(HAS_QUESTIONS_CLASSNAME, hasQuestions);
        if (hasQuestions) {
            if (this.renderedQuestionAnswer && underscore_1.isEqual(questionAnswer, this.renderedQuestionAnswer)) {
                return;
            }
            this.detachContent();
            this.element.appendChild((this.title = this.buildTitle()).el);
            this.element.appendChild((this.questionAnswers = this.buildQuestionAnswers(questionAnswer.relatedQuestions)).el);
        }
        else {
            this.detachContent();
        }
        this.renderedQuestionAnswer = questionAnswer;
    };
    SmartSnippetSuggestions.prototype.detachContent = function () {
        this.title && this.title.detach();
        this.questionAnswers && this.questionAnswers.detach();
        this.title = this.questionAnswers = null;
    };
    SmartSnippetSuggestions.prototype.buildTitle = function () {
        return Dom_1.$$('span', { className: QUESTIONS_LIST_TITLE_CLASSNAME, id: this.titleId }, Strings_1.l('SuggestedQuestions'));
    };
    SmartSnippetSuggestions.prototype.buildQuestionAnswers = function (questionAnswers) {
        var _this = this;
        var innerCSS = this.getInnerCSS();
        var answers = questionAnswers.map(function (questionAnswer) { return new SmartSnippetCollapsibleSuggestion_1.SmartSnippetCollapsibleSuggestion(questionAnswer, innerCSS, _this.getCorrespondingResult(questionAnswer)); });
        var container = Dom_1.$$.apply(void 0, ['ul',
            { className: QUESTIONS_LIST_CLASSNAME, ariaLabelledby: this.titleId }].concat(answers.map(function (answer) { return answer.build(); })));
        this.contentLoaded = Promise.all(answers.map(function (answer) { return answer.loading; }));
        return container;
    };
    SmartSnippetSuggestions.prototype.getInnerCSS = function () {
        return Dom_1.$$(this.element)
            .children()
            .filter(function (element) { return element instanceof HTMLScriptElement && element.type.toLowerCase() === 'text/css'; })
            .map(function (element) { return element.innerHTML; })
            .join('\n');
    };
    SmartSnippetSuggestions.ID = 'SmartSnippetSuggestions';
    SmartSnippetSuggestions.doExport = function () {
        GlobalExports_1.exportGlobally({
            SmartSnippetSuggestions: SmartSnippetSuggestions
        });
    };
    return SmartSnippetSuggestions;
}(Component_1.Component));
exports.SmartSnippetSuggestions = SmartSnippetSuggestions;
Initialization_1.Initialization.registerAutoCreateComponent(SmartSnippetSuggestions);
SmartSnippetSuggestions.doExport();


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

/***/ 582:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 702:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 703:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var AccessibleButton_1 = __webpack_require__(15);
var SVGIcons_1 = __webpack_require__(12);
var AttachShadowPolyfill_1 = __webpack_require__(517);
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var QUESTION_CLASSNAME = "coveo-smart-snippet-suggestions-question";
var QUESTION_TITLE_CLASSNAME = QUESTION_CLASSNAME + "-title";
var QUESTION_TITLE_LABEL_CLASSNAME = QUESTION_TITLE_CLASSNAME + "-label";
var QUESTION_TITLE_CHECKBOX_CLASSNAME = QUESTION_TITLE_CLASSNAME + "-checkbox";
var QUESTION_SNIPPET_CLASSNAME = QUESTION_CLASSNAME + "-snippet";
var QUESTION_SNIPPET_HIDDEN_CLASSNAME = QUESTION_SNIPPET_CLASSNAME + "-hidden";
var SHADOW_CLASSNAME = QUESTION_SNIPPET_CLASSNAME + "-content";
var RAW_CONTENT_CLASSNAME = SHADOW_CLASSNAME + "-raw";
var SOURCE_CLASSNAME = QUESTION_CLASSNAME + "-source";
var SOURCE_TITLE_CLASSNAME = SOURCE_CLASSNAME + "-title";
var SOURCE_URL_CLASSNAME = SOURCE_CLASSNAME + "-url";
exports.SmartSnippetCollapsibleSuggestionClassNames = {
    QUESTION_CLASSNAME: QUESTION_CLASSNAME,
    QUESTION_TITLE_CLASSNAME: QUESTION_TITLE_CLASSNAME,
    QUESTION_TITLE_LABEL_CLASSNAME: QUESTION_TITLE_LABEL_CLASSNAME,
    QUESTION_TITLE_CHECKBOX_CLASSNAME: QUESTION_TITLE_CHECKBOX_CLASSNAME,
    QUESTION_SNIPPET_CLASSNAME: QUESTION_SNIPPET_CLASSNAME,
    QUESTION_SNIPPET_HIDDEN_CLASSNAME: QUESTION_SNIPPET_HIDDEN_CLASSNAME,
    SHADOW_CLASSNAME: SHADOW_CLASSNAME,
    RAW_CONTENT_CLASSNAME: RAW_CONTENT_CLASSNAME,
    SOURCE_CLASSNAME: SOURCE_CLASSNAME,
    SOURCE_TITLE_CLASSNAME: SOURCE_TITLE_CLASSNAME,
    SOURCE_URL_CLASSNAME: SOURCE_URL_CLASSNAME
};
var SmartSnippetCollapsibleSuggestion = /** @class */ (function () {
    function SmartSnippetCollapsibleSuggestion(questionAnswer, innerCSS, source) {
        this.questionAnswer = questionAnswer;
        this.innerCSS = innerCSS;
        this.source = source;
        this.labelId = underscore_1.uniqueId(QUESTION_TITLE_LABEL_CLASSNAME);
        this.snippetId = underscore_1.uniqueId(QUESTION_SNIPPET_CLASSNAME);
        this.checkboxId = underscore_1.uniqueId(QUESTION_TITLE_CHECKBOX_CLASSNAME);
        this.expanded = false;
    }
    Object.defineProperty(SmartSnippetCollapsibleSuggestion.prototype, "loading", {
        get: function () {
            return this.contentLoaded;
        },
        enumerable: true,
        configurable: true
    });
    SmartSnippetCollapsibleSuggestion.prototype.build = function () {
        var collapsibleContainer = this.buildCollapsibleContainer(this.questionAnswer.answerSnippet, this.questionAnswer.question, this.innerCSS && this.buildStyle(this.innerCSS));
        var title = this.buildTitle(this.questionAnswer.question);
        this.updateExpanded();
        return Dom_1.$$('li', {
            className: QUESTION_CLASSNAME,
            ariaLabelledby: this.labelId
        }, title, collapsibleContainer).el;
    };
    SmartSnippetCollapsibleSuggestion.prototype.buildStyle = function (innerCSS) {
        var styleTag = document.createElement('style');
        styleTag.innerHTML = innerCSS;
        return styleTag;
    };
    SmartSnippetCollapsibleSuggestion.prototype.buildTitle = function (question) {
        var _this = this;
        var checkbox = this.buildCheckbox(question);
        var label = Dom_1.$$('span', { className: QUESTION_TITLE_LABEL_CLASSNAME, id: this.labelId });
        label.text(question);
        var title = Dom_1.$$('span', { className: QUESTION_TITLE_CLASSNAME }, label, checkbox);
        title.on('click', function () { return _this.toggle(); });
        return title;
    };
    SmartSnippetCollapsibleSuggestion.prototype.buildCheckbox = function (question) {
        var _this = this;
        this.checkbox = Dom_1.$$('div', {
            role: 'button',
            tabindex: 0,
            ariaControls: this.snippetId,
            className: QUESTION_TITLE_CHECKBOX_CLASSNAME,
            id: this.checkboxId
        });
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.checkbox)
            .withLabel(Strings_1.l('ExpandQuestionAnswer', question))
            .withEnterKeyboardAction(function () { return _this.toggle(); })
            .build();
        return this.checkbox;
    };
    SmartSnippetCollapsibleSuggestion.prototype.buildCollapsibleContainer = function (innerHTML, title, style) {
        var _this = this;
        var shadowContainer = Dom_1.$$('div', { className: SHADOW_CLASSNAME });
        this.collapsibleContainer = Dom_1.$$('div', { className: QUESTION_SNIPPET_CLASSNAME, id: this.snippetId }, shadowContainer);
        this.contentLoaded = AttachShadowPolyfill_1.attachShadow(shadowContainer.el, { mode: 'open', title: Strings_1.l('AnswerSpecificSnippet', title) }).then(function (shadowRoot) {
            shadowRoot.appendChild(_this.buildAnswerSnippetContent(innerHTML, style).el);
        });
        if (this.source) {
            this.collapsibleContainer.append(this.buildSourceUrl(this.source.clickUri));
            this.collapsibleContainer.append(this.buildSourceTitle(this.source.title, this.source.clickUri));
        }
        return this.collapsibleContainer;
    };
    SmartSnippetCollapsibleSuggestion.prototype.buildAnswerSnippetContent = function (innerHTML, style) {
        var snippet = Dom_1.$$('div', { className: RAW_CONTENT_CLASSNAME }, innerHTML);
        var container = Dom_1.$$('div', {}, snippet);
        if (style) {
            container.append(style);
        }
        return container;
    };
    SmartSnippetCollapsibleSuggestion.prototype.buildSourceTitle = function (title, clickUri) {
        return this.buildLink(title, clickUri, SOURCE_TITLE_CLASSNAME);
    };
    SmartSnippetCollapsibleSuggestion.prototype.buildSourceUrl = function (url) {
        return this.buildLink(url, url, SOURCE_URL_CLASSNAME);
    };
    SmartSnippetCollapsibleSuggestion.prototype.buildLink = function (text, href, className) {
        var element = Dom_1.$$('a', { className: className, href: href }).el;
        element.innerText = text;
        return element;
    };
    SmartSnippetCollapsibleSuggestion.prototype.toggle = function () {
        this.expanded = !this.expanded;
        this.updateExpanded();
    };
    SmartSnippetCollapsibleSuggestion.prototype.updateExpanded = function () {
        this.checkbox.setAttribute('aria-expanded', this.expanded.toString());
        this.checkbox.setHtml(this.expanded ? SVGIcons_1.SVGIcons.icons.arrowUp : SVGIcons_1.SVGIcons.icons.arrowDown);
        this.collapsibleContainer.setAttribute('tabindex', "" + (this.expanded ? 0 : -1));
        this.collapsibleContainer.setAttribute('aria-hidden', (!this.expanded).toString());
        this.collapsibleContainer.toggleClass(QUESTION_SNIPPET_HIDDEN_CLASSNAME, !this.expanded);
    };
    return SmartSnippetCollapsibleSuggestion;
}());
exports.SmartSnippetCollapsibleSuggestion = SmartSnippetCollapsibleSuggestion;


/***/ })

});
//# sourceMappingURL=SmartSnippetSuggestions__b6f3a40b26ad27101c27.js.map