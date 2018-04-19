webpackJsonpCoveo__temporary([25],{

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

/***/ 195:
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
var DefaultFoldingTemplate_1 = __webpack_require__(417);
var Utils_1 = __webpack_require__(4);
var QueryUtils_1 = __webpack_require__(19);
var Initialization_1 = __webpack_require__(1);
var Assert_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(8);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
__webpack_require__(418);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
var TemplateComponentOptions_1 = __webpack_require__(51);
/**
 * The `ResultFolding` component renders folded result sets. It is usable inside a result template when there is an
 * active [`Folding`]{@link Folding} component in the page. This component takes care of rendering the parent result and
 * its child results in a coherent manner.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * See [Folding Results](https://developers.coveo.com/x/7hUvAg).
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
        _this.displayThoseResults(_this.result.childResults).then(function () {
            _this.updateElementVisibility();
            if (Dom_1.$$(_this.element.parentElement).hasClass('CoveoCardOverlay')) {
                _this.bindOverlayEvents();
            }
            if (_this.result.childResults.length == 0 && !_this.result.moreResults) {
                Dom_1.$$(_this.element).hide();
            }
        });
        return _this;
    }
    /**
     * Show more results by fetching additional results from the index, which match the current folded conversation.
     * This is the equivalent of clicking "Show all conversation".
     * @returns {Promise<IQueryResult[]>}
     */
    ResultFolding.prototype.showMoreResults = function () {
        var _this = this;
        Assert_1.Assert.exists(this.result.moreResults);
        this.cancelAnyPendingShowMore();
        this.moreResultsPromise = this.result.moreResults();
        this.waitAnimation = Dom_1.$$('div', { className: 'coveo-loading-spinner' }).el;
        this.results.appendChild(this.waitAnimation);
        this.updateElementVisibility();
        var ret = this.moreResultsPromise.then(function (results) {
            _this.childResults = results;
            _this.showingMoreResults = true;
            _this.usageAnalytics.logClickEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.foldingShowMore, _this.getAnalyticsMetadata(), _this.result, _this.element);
            return _this.displayThoseResults(results).then(function () {
                _this.updateElementVisibility(results.length);
                return results;
            });
        });
        ret.finally(function () {
            _this.moreResultsPromise = undefined;
            Dom_1.$$(_this.waitAnimation).detach();
            _this.waitAnimation = undefined;
        });
        return ret;
    };
    /**
     * Show less results for a given conversation. This is the equivalent of clicking "Show less"
     */
    ResultFolding.prototype.showLessResults = function () {
        this.cancelAnyPendingShowMore();
        this.showingMoreResults = false;
        this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.foldingShowLess, this.getAnalyticsMetadata(), this.element);
        this.displayThoseResults(this.result.childResults);
        this.updateElementVisibility();
        this.scrollToResultElement();
    };
    ResultFolding.prototype.buildElements = function () {
        this.buildHeader();
        this.buildResults();
        this.buildFooter();
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
            Dom_1.$$(this.showMore).on('click', function () { return _this.showMoreResults(); });
            footer.appendChild(this.showMore);
            this.showLess = Dom_1.$$('div', { className: 'coveo-folding-footer-section-for-more' }).el;
            Dom_1.$$(this.showLess).on('click', function () { return _this.showLessResults(); });
            footer.appendChild(this.showLess);
            var footerIconShowMore = Dom_1.$$('div', { className: 'coveo-folding-more' }, Dom_1.$$('span', { className: 'coveo-folding-footer-icon' }, SVGIcons_1.SVGIcons.icons.arrowDown).el).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(footerIconShowMore, 'coveo-folding-more-svg');
            var footerIconShowLess = Dom_1.$$('div', { className: 'coveo-folding-less' }, Dom_1.$$('span', { className: 'coveo-folding-footer-icon' }, SVGIcons_1.SVGIcons.icons.arrowUp).el).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(footerIconShowLess, 'coveo-folding-less-svg');
            var showMoreLink = Dom_1.$$('a', { className: 'coveo-folding-show-more' }, this.options.moreCaption).el;
            var showLessLink = Dom_1.$$('a', { className: 'coveo-folding-show-less' }, this.options.lessCaption).el;
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
            Dom_1.$$(this.showMore).toggle(!this.showingMoreResults && !Utils_1.Utils.exists(this.moreResultsPromise));
            Dom_1.$$(this.showLess).toggle(this.showingMoreResults);
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
        var _this = this;
        var childResultsPromises = _.map(results, function (result) {
            return _this.renderChildResult(result);
        });
        return Promise.all(childResultsPromises).then(function (childsToAppend) {
            Dom_1.$$(_this.results).empty();
            _.each(childsToAppend, function (oneChild) {
                _this.results.appendChild(oneChild);
            });
            return true;
        });
    };
    ResultFolding.prototype.renderChildResult = function (childResult) {
        var _this = this;
        QueryUtils_1.QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), childResult);
        QueryUtils_1.QueryUtils.setSearchInterfaceObjectOnQueryResult(this.searchInterface, childResult);
        return this.options.resultTemplate
            .instantiateToElement(childResult, {
            wrapInDiv: false,
            checkCondition: false,
            responsiveComponents: this.searchInterface.responsiveComponents
        })
            .then(function (oneChild) {
            Dom_1.$$(oneChild).addClass('coveo-result-folding-child-result');
            Dom_1.$$(oneChild).toggleClass('coveo-normal-child-result', !_this.showingMoreResults);
            Dom_1.$$(oneChild).toggleClass('coveo-expanded-child-result', _this.showingMoreResults);
            return _this.autoCreateComponentsInsideResult(oneChild, childResult).initResult.then(function () {
                return oneChild;
            });
        });
    };
    ResultFolding.prototype.autoCreateComponentsInsideResult = function (element, result) {
        Assert_1.Assert.exists(element);
        var initOptions = this.searchInterface.options;
        var initParameters = {
            options: initOptions,
            bindings: this.getBindings(),
            result: result
        };
        return Initialization_1.Initialization.automaticallyCreateComponentsInside(element, initParameters);
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

/***/ 417:
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

/***/ 418:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ResultFolding__7adec7eb6144877a5629.js.map