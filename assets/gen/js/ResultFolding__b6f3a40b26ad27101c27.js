webpackJsonpCoveo__temporary([41],{

/***/ 269:
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
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var DefaultFoldingTemplate_1 = __webpack_require__(653);
var Utils_1 = __webpack_require__(4);
var QueryUtils_1 = __webpack_require__(21);
var Initialization_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var underscore_1 = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Logger_1 = __webpack_require__(9);
__webpack_require__(654);
var SVGIcons_1 = __webpack_require__(12);
var SVGDom_1 = __webpack_require__(16);
var TemplateComponentOptions_1 = __webpack_require__(61);
var AccessibleButton_1 = __webpack_require__(15);
/**
 * The `ResultFolding` component renders folded result sets. It is usable inside a result template when there is an
 * active [`Folding`]{@link Folding} component in the page. This component takes care of rendering the parent result and
 * its child results in a coherent manner.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 *
 * See [Folding Results](https://docs.coveo.com/en/428/).
 */
var ResultFolding = /** @class */ (function (_super) {
    __extends(ResultFolding, _super);
    /**
     * Creates a new ResultFolding component.
     * @param options The options for the ResultFolding component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function ResultFolding(element, options, bindings, result) {
        var _this = _super.call(this, element, ResultFolding.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.showingMoreResults = false;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(_this.element, ResultFolding, options);
        Assert_1.Assert.exists(result);
        _this.buildElements();
        _this.renderElements();
        return _this;
    }
    /**
     * Show more results by fetching additional results from the index, which match the current folded conversation.
     * This is the equivalent of clicking "Show all conversation".
     * @returns {Promise<IQueryResult[]>}
     */
    ResultFolding.prototype.showMoreResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, e_1, logger;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Assert_1.Assert.exists(this.result.moreResults);
                        this.cancelAnyPendingShowMore();
                        this.moreResultsPromise = this.result.moreResults();
                        this.waitAnimation = Dom_1.$$('div', { className: 'coveo-loading-spinner' }).el;
                        this.results.appendChild(this.waitAnimation);
                        this.updateElementVisibility();
                        return [4 /*yield*/, this.moreResultsPromise];
                    case 1:
                        results = _a.sent();
                        this.childResults = results;
                        this.showingMoreResults = true;
                        this.usageAnalytics.logClickEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.foldingShowMore, this.getAnalyticsMetadata(), this.result, this.element);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.displayThoseResults(results)];
                    case 3:
                        _a.sent();
                        this.updateElementVisibility(results.length);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        logger = new Logger_1.Logger(this);
                        logger.warn('An error occured when trying to display more results');
                        return [3 /*break*/, 5];
                    case 5:
                        this.moreResultsPromise = undefined;
                        Dom_1.$$(this.waitAnimation).detach();
                        this.waitAnimation = undefined;
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * Show less results for a given conversation. This is the equivalent of clicking "Show less"
     */
    ResultFolding.prototype.showLessResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.cancelAnyPendingShowMore();
                        this.showingMoreResults = false;
                        this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.foldingShowLess, this.getAnalyticsMetadata(), this.element);
                        return [4 /*yield*/, this.displayThoseResults(this.result.childResults)];
                    case 1:
                        _a.sent();
                        this.updateElementVisibility();
                        this.scrollToResultElement();
                        return [2 /*return*/];
                }
            });
        });
    };
    ResultFolding.prototype.buildElements = function () {
        this.buildHeader();
        this.buildResults();
        this.buildFooter();
    };
    ResultFolding.prototype.renderElements = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.displayThoseResults(this.result.childResults)];
                    case 1:
                        _a.sent();
                        this.updateElementVisibility();
                        if (Dom_1.$$(this.element.parentElement).hasClass('CoveoCardOverlay')) {
                            this.bindOverlayEvents();
                        }
                        if (this.result.childResults.length == 0 && !this.result.moreResults) {
                            Dom_1.$$(this.element).hide();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ResultFolding.prototype.buildHeader = function () {
        var header = Dom_1.$$('div', { className: 'coveo-folding-header' }).el;
        this.element.appendChild(header);
        if (this.options.normalCaption != undefined && this.options.expandedCaption != undefined) {
            this.normalCaption = Dom_1.$$('div', { className: 'coveo-folding-normal-caption' }, this.options.normalCaption).el;
            header.appendChild(this.normalCaption);
            this.expandedCaption = Dom_1.$$('div', { className: 'coveo-folding-expanded-caption' }, this.options.expandedCaption).el;
            header.appendChild(this.expandedCaption);
        }
        this.oneResultCaption = Dom_1.$$('div', { className: 'coveo-folding-oneresult-caption' }, this.options.oneResultCaption).el;
        header.appendChild(this.oneResultCaption);
    };
    ResultFolding.prototype.buildResults = function () {
        this.results = Dom_1.$$('div', { className: 'coveo-folding-results' }).el;
        this.element.appendChild(this.results);
    };
    ResultFolding.prototype.buildFooter = function () {
        var _this = this;
        var footer = Dom_1.$$('div', { className: 'coveo-folding-footer' }).el;
        this.element.parentElement.appendChild(footer);
        if (this.result.moreResults) {
            this.showMore = Dom_1.$$('div', { className: 'coveo-folding-footer-section-for-less' }).el;
            footer.appendChild(this.showMore);
            this.showLess = Dom_1.$$('div', { className: 'coveo-folding-footer-section-for-more' }).el;
            footer.appendChild(this.showLess);
            var footerIconShowMore = Dom_1.$$('div', { className: 'coveo-folding-more' }, Dom_1.$$('span', { className: 'coveo-folding-footer-icon' }, SVGIcons_1.SVGIcons.icons.arrowDown).el).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(footerIconShowMore, 'coveo-folding-more-svg');
            var footerIconShowLess = Dom_1.$$('div', { className: 'coveo-folding-less' }, Dom_1.$$('span', { className: 'coveo-folding-footer-icon' }, SVGIcons_1.SVGIcons.icons.arrowUp).el).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(footerIconShowLess, 'coveo-folding-less-svg');
            var showMoreLink = Dom_1.$$('a', { className: 'coveo-folding-show-more' }, this.options.moreCaption).el;
            var showLessLink = Dom_1.$$('a', { className: 'coveo-folding-show-less' }, this.options.lessCaption).el;
            new AccessibleButton_1.AccessibleButton()
                .withElement(this.showMore)
                .withLabel(this.options.moreCaption)
                .withSelectAction(function () { return _this.showMoreResults(); })
                .build();
            new AccessibleButton_1.AccessibleButton()
                .withElement(this.showLess)
                .withLabel(this.options.lessCaption)
                .withSelectAction(function () { return _this.showLessResults(); })
                .build();
            this.showMore.appendChild(showMoreLink);
            this.showLess.appendChild(showLessLink);
            this.showMore.appendChild(footerIconShowMore);
            this.showLess.appendChild(footerIconShowLess);
        }
    };
    ResultFolding.prototype.updateElementVisibility = function (subResultsLength) {
        if (this.normalCaption) {
            Dom_1.$$(this.normalCaption).toggle(!this.showingMoreResults && this.result.childResults.length > 0);
        }
        if (this.expandedCaption) {
            Dom_1.$$(this.expandedCaption).toggle(this.showingMoreResults);
        }
        Dom_1.$$(this.oneResultCaption).toggleClass('coveo-hidden', !(subResultsLength && subResultsLength == 1));
        if (this.showMore) {
            Dom_1.$$(this.showMore).toggleClass('coveo-visible', !this.showingMoreResults && !Utils_1.Utils.exists(this.moreResultsPromise));
            Dom_1.$$(this.showLess).toggleClass('coveo-visible', this.showingMoreResults);
        }
        var showIfNormal = Dom_1.$$(this.element).find('.coveo-show-if-normal');
        if (showIfNormal) {
            Dom_1.$$(showIfNormal).toggle(!this.showingMoreResults);
        }
        var showIfExpanded = Dom_1.$$(this.element).find('.coveo-show-if-expanded');
        if (showIfExpanded) {
            Dom_1.$$(showIfExpanded).toggle(this.showingMoreResults);
        }
    };
    ResultFolding.prototype.scrollToResultElement = function () {
        var resultElem = Dom_1.$$(this.element).closest('CoveoResult');
        window.scrollTo(0, new Dom_1.Win(window).scrollY() + resultElem.getBoundingClientRect().top);
    };
    ResultFolding.prototype.displayThoseResults = function (results) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var childResultsPromises, childsToAppend;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        childResultsPromises = underscore_1.map(results, function (result) {
                            return _this.renderChildResult(result);
                        });
                        return [4 /*yield*/, Promise.all(childResultsPromises)];
                    case 1:
                        childsToAppend = _a.sent();
                        Dom_1.$$(this.results).empty();
                        underscore_1.each(childsToAppend, function (oneChild) {
                            _this.results.appendChild(oneChild);
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ResultFolding.prototype.renderChildResult = function (childResult) {
        return __awaiter(this, void 0, void 0, function () {
            var oneChild;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        QueryUtils_1.QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), childResult);
                        QueryUtils_1.QueryUtils.setSearchInterfaceObjectOnQueryResult(this.searchInterface, childResult);
                        return [4 /*yield*/, this.options.resultTemplate.instantiateToElement(childResult, {
                                wrapInDiv: false,
                                checkCondition: false,
                                responsiveComponents: this.searchInterface.responsiveComponents
                            })];
                    case 1:
                        oneChild = _a.sent();
                        Dom_1.$$(oneChild).addClass('coveo-result-folding-child-result');
                        Dom_1.$$(oneChild).toggleClass('coveo-normal-child-result', !this.showingMoreResults);
                        Dom_1.$$(oneChild).toggleClass('coveo-expanded-child-result', this.showingMoreResults);
                        return [4 /*yield*/, Initialization_1.Initialization.automaticallyCreateComponentsInsideResult(oneChild, childResult).initResult];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, oneChild];
                }
            });
        });
    };
    ResultFolding.prototype.cancelAnyPendingShowMore = function () {
        if (this.moreResultsPromise) {
            this.moreResultsPromise = undefined;
        }
        Assert_1.Assert.doesNotExists(this.moreResultsPromise);
        Assert_1.Assert.doesNotExists(this.waitAnimation);
    };
    ResultFolding.prototype.bindOverlayEvents = function () {
        var _this = this;
        this.bind.one(this.element.parentElement, 'openCardOverlay', function () {
            if (_this.result.moreResults) {
                _this.showMoreResults();
            }
        });
    };
    ResultFolding.prototype.getAnalyticsMetadata = function () {
        return {
            documentURL: this.result.clickUri,
            documentTitle: this.result.title,
            author: Utils_1.Utils.getFieldValue(this.result, 'author')
        };
    };
    ResultFolding.ID = 'ResultFolding';
    ResultFolding.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultFolding: ResultFolding,
            DefaultFoldingTemplate: DefaultFoldingTemplate_1.DefaultFoldingTemplate
        });
    };
    /**
     * The options for the component
     * @componentOptions
     */
    ResultFolding.options = {
        /**
         * Specifies the template to use to render each of the child results for a top result.
         *
         * You can specify a previously registered template to use either by referring to its HTML `id` attribute or to a
         * CSS selector (see {@link TemplateCache}).
         *
         * **Example:**
         *
         * Specifying a previously registered template by referring to its HTML `id` attribute:
         *
         * ```html
         * <span class="CoveoResultFolding" data-result-template-id="Foo"></span>
         * ```
         *
         * Specifying a previously registered template by referring to a CSS selector:
         *
         * ```html
         * <span class='CoveoResultFolding' data-result-template-selector="#Foo"></span>
         * ```
         *
         * If you do not specify a custom folding template, the component uses the default result folding template.
         */
        resultTemplate: TemplateComponentOptions_1.TemplateComponentOptions.buildTemplateOption({ defaultFunction: function () { return new DefaultFoldingTemplate_1.DefaultFoldingTemplate(); } }),
        /**
         * Specifies the caption to display at the top of the child results when the folding result set is not expanded.
         *
         * Default value is `undefined`, which displays no caption.
         */
        normalCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption(),
        /**
         * Specifies the caption to display at the top of the child results when the folding result set is expanded.
         *
         * Default value is `undefined`, which displays no caption.
         */
        expandedCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption(),
        /**
         * Specifies the caption to display on the link to expand / show child results.
         *
         * Default value is the localized string for `ShowMore`.
         */
        moreCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ postProcessing: function (value) { return value || Strings_1.l('ShowMore'); } }),
        /**
         * Specifies the caption to display on the link to shrink the loaded folding result set back to only the top result.
         *
         * Default value is the localized string for `ShowLess`.
         */
        lessCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ postProcessing: function (value) { return value || Strings_1.l('ShowLess'); } }),
        /**
         * Specifies the caption to display when there is only one result in a folding result set.
         *
         * Default value is the localized string for `DisplayingTheOnlyMessage`
         */
        oneResultCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            postProcessing: function (value) { return value || Strings_1.l('DisplayingTheOnlyMessage'); }
        })
    };
    return ResultFolding;
}(Component_1.Component));
exports.ResultFolding = ResultFolding;
Initialization_1.Initialization.registerAutoCreateComponent(ResultFolding);


/***/ }),

/***/ 653:
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
var DefaultFoldingTemplate = /** @class */ (function (_super) {
    __extends(DefaultFoldingTemplate, _super);
    function DefaultFoldingTemplate() {
        return _super.call(this) || this;
    }
    DefaultFoldingTemplate.prototype.instantiateToString = function (queryResult) {
        return '<div class="coveo-child-result"><span class="CoveoIcon" data-small="true"></span> <a class="CoveoResultLink"></a> <span class="CoveoQuickview"></span></div>';
    };
    DefaultFoldingTemplate.prototype.getType = function () {
        return 'DefaultFoldingTemplate';
    };
    return DefaultFoldingTemplate;
}(Template_1.Template));
exports.DefaultFoldingTemplate = DefaultFoldingTemplate;


/***/ }),

/***/ 654:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ResultFolding__b6f3a40b26ad27101c27.js.map