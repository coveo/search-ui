webpackJsonpCoveo__temporary([68],{

/***/ 291:
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
__webpack_require__(694);
var Core_1 = __webpack_require__(20);
var GlobalExports_1 = __webpack_require__(3);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var MissingTermManager_1 = __webpack_require__(203);
var XRegExp = __webpack_require__(204);
/**
 * This [result template component](https://docs.coveo.com/en/513/#using-result-template-components) renders a list of query terms
 * that were not matched by the associated result item.
 *
 * @availablesince [July 2019 Release (v2.6459)](https://docs.coveo.com/en/2938/)
 */
var MissingTerms = /** @class */ (function (_super) {
    __extends(MissingTerms, _super);
    /**
     * Creates a new `MissingTerms` component instance.
     * @param element The element on which to instantiate the component.
     * @param options The configuration options for the component.
     * @param bindings The bindings required by the component to function normally. If not set, these will be automatically resolved (with a slower execution time).
     * @param result The query result item to associate the component with.
     */
    function MissingTerms(element, options, bindings, result) {
        var _this = _super.call(this, element, MissingTerms.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, MissingTerms, options);
        _this.addMissingTerms();
        return _this;
    }
    Object.defineProperty(MissingTerms.prototype, "missingTerms", {
        /**
         *Returns all original basic query expression terms that were not matched by the result item the component instance is associated with.
         */
        get: function () {
            var terms = [];
            for (var _i = 0, _a = this.result.absentTerms; _i < _a.length; _i++) {
                var term = _a[_i];
                var regex = this.createWordBoundaryDelimitedRegex(term);
                var query = this.queryStateModel.get('q');
                var result = regex.exec(query);
                if (result) {
                    var originalKeywordInQuery = result[4];
                    terms.push(originalKeywordInQuery);
                }
            }
            return terms;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Injects a term in the advanced part of the query expression (aq) to filter out items that do not match the term.
     * @param term The term to add to the advanced query expression.
     */
    MissingTerms.prototype.addTermForcedToAppear = function (term) {
        if (this.missingTerms.indexOf(term) === -1) {
            this.logger.warn("Method execution aborted because the term to inject in aq (\"" + term + "\") is not a missing term.", "Allowed missing terms: " + this.missingTerms.toString() + ".");
            return;
        }
        this.updateTermForcedToAppear();
        this.termForcedToAppear.push(term);
        this.queryStateModel.set('missingTerms', this.termForcedToAppear.slice());
    };
    MissingTerms.prototype.updateTermForcedToAppear = function () {
        this.termForcedToAppear = this.queryStateModel.get('missingTerms').slice();
    };
    MissingTerms.prototype.addMissingTerms = function () {
        var _this = this;
        if (this.missingTerms.length === 0) {
            return;
        }
        var missingTermElement = this.buildContainer();
        if (missingTermElement.length > 1) {
            this.hideMissingTermsOverTheNumberOfResults(missingTermElement);
            missingTermElement.map(function (element) {
                Core_1.$$(_this.element).append(element);
            });
        }
    };
    MissingTerms.prototype.buildContainer = function () {
        var elements = [];
        elements.push(this.buildCaption().el);
        this.buildMissingTerms().forEach(function (term) {
            if (term) {
                elements.push(term.el);
            }
        });
        return elements;
    };
    MissingTerms.prototype.buildCaption = function () {
        return Core_1.$$('span', { className: 'coveo-field-caption' }, this.options.caption);
    };
    MissingTerms.prototype.buildMissingTerms = function () {
        var _this = this;
        var validTerms = this.missingTerms.filter(function (term) { return _this.isValidTerm(term); });
        var terms = validTerms.map(function (term) {
            return _this.makeTermClickableIfEnabled(term);
        });
        return terms;
    };
    MissingTerms.prototype.executeNewQuery = function (missingTerm) {
        if (missingTerm === void 0) { missingTerm = this.queryStateModel.get('q'); }
        this.queryController.executeQuery();
    };
    MissingTerms.prototype.makeTermClickableIfEnabled = function (term) {
        var _this = this;
        if (this.options.clickable) {
            var termElement = Core_1.$$('button', { className: 'coveo-missing-term coveo-clickable' }, term);
            termElement.on('click', function () {
                _this.addTermForcedToAppear(term);
                _this.logAnalyticsAddMissingTerm(term);
                _this.executeNewQuery(term);
            });
            return termElement;
        }
        else {
            return Core_1.$$('span', { className: 'coveo-missing-term' }, term);
        }
    };
    MissingTerms.prototype.createWordBoundaryDelimitedRegex = function (term) {
        return XRegExp(MissingTermManager_1.MissingTermManager.wordBoundary + "(" + term + ")" + MissingTermManager_1.MissingTermManager.wordBoundary, 'gi');
    };
    MissingTerms.prototype.containsFeaturedResults = function (term) {
        this.updateTermForcedToAppear();
        return this.termForcedToAppear.indexOf(term) !== -1;
    };
    MissingTerms.prototype.hideMissingTermsOverTheNumberOfResults = function (elements) {
        var _this = this;
        var allMissingTerms = elements.filter(function (element) {
            return element.tagName === 'BUTTON';
        });
        if (allMissingTerms.length <= this.options.numberOfTerms) {
            return;
        }
        for (var index = this.options.numberOfTerms; index < allMissingTerms.length; index++) {
            Core_1.$$(allMissingTerms[index]).hide();
        }
        var nbMoreResults = allMissingTerms.length - this.options.numberOfTerms;
        var showMore = Core_1.$$('button', { className: 'coveo-missing-term-show-more coveo-clickable' }, Core_1.l('NMore', [nbMoreResults]));
        showMore.on('click', function () {
            _this.showAllHiddenMissingTerms();
        });
        elements.push(showMore.el);
    };
    MissingTerms.prototype.showAllHiddenMissingTerms = function () {
        var showMore = Core_1.$$(this.element).find('.coveo-missing-term-show-more');
        showMore.parentNode.removeChild(showMore);
        var allMissingTerms = Core_1.$$(this.element).findAll('.coveo-missing-term');
        for (var index = this.options.numberOfTerms; index < allMissingTerms.length; index++) {
            Core_1.$$(allMissingTerms[index]).show();
            allMissingTerms[index].removeAttribute('style');
        }
    };
    MissingTerms.prototype.isValidTerm = function (term) {
        return this.isNonBoundaryTerm(term) && !this.containsFeaturedResults(term);
    };
    MissingTerms.prototype.isNonBoundaryTerm = function (term) {
        //p{L} is a Unicode script that matches any character in any language.
        var wordWithBreakpoints = "\\p{L}*[-'?*\u2019.~=,/\\\\:`;_!&()]+\\p{L}*";
        var regex = XRegExp(wordWithBreakpoints, 'gi');
        var query = this.queryStateModel.get('q');
        var matches = query.match(regex) || [];
        return matches.every(function (word) {
            return word.indexOf(term) === -1;
        });
    };
    MissingTerms.prototype.logAnalyticsAddMissingTerm = function (term) {
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.addMissingTerm, {
            missingTerm: term
        });
    };
    MissingTerms.ID = 'MissingTerms';
    /**
     * @componentOptions
     */
    MissingTerms.options = {
        /**
         * Whether to allow the end-user to click a missing term to filter out items that do not match this term.
         *
         * **Default:** `true`
         */
        clickable: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * The text to display before missing terms.
         *
         * **Default:** The localized string for `Missing`.
         */
        caption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            localizedString: function () { return Core_1.l('Missing'); }
        }),
        /**
         * The maximum number of missing term to be displayed
         *
         * **Default:** `5`
         * **Minimum value:** `1`
         */
        numberOfTerms: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultValue: 5,
            min: 1
        })
    };
    MissingTerms.doExport = function () {
        GlobalExports_1.exportGlobally({
            MissingTerms: MissingTerms
        });
    };
    return MissingTerms;
}(Component_1.Component));
exports.MissingTerms = MissingTerms;
Core_1.Initialization.registerAutoCreateComponent(MissingTerms);


/***/ }),

/***/ 694:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=MissingTerms__b6f3a40b26ad27101c27.js.map