webpackJsonpCoveo__temporary([39],{

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(11);
var KeyboardUtils_1 = __webpack_require__(29);
var Dom_1 = __webpack_require__(1);
__webpack_require__(367);
var AccessibleButton = /** @class */ (function () {
    function AccessibleButton() {
        this.logger = new Logger_1.Logger(this);
    }
    AccessibleButton.prototype.withOwner = function (owner) {
        this.eventOwner = owner;
        return this;
    };
    AccessibleButton.prototype.withElement = function (element) {
        if (element instanceof HTMLElement) {
            this.element = Dom_1.$$(element);
        }
        else {
            this.element = element;
        }
        return this;
    };
    AccessibleButton.prototype.withLabel = function (label) {
        this.label = label;
        return this;
    };
    AccessibleButton.prototype.withTitle = function (title) {
        this.title = title;
        return this;
    };
    AccessibleButton.prototype.withSelectAction = function (action) {
        this.clickAction = action;
        this.enterKeyboardAction = action;
        return this;
    };
    AccessibleButton.prototype.withClickAction = function (clickAction) {
        this.clickAction = clickAction;
        return this;
    };
    AccessibleButton.prototype.withEnterKeyboardAction = function (enterAction) {
        this.enterKeyboardAction = enterAction;
        return this;
    };
    AccessibleButton.prototype.withFocusAndMouseEnterAction = function (action) {
        this.focusAction = action;
        this.mouseenterAction = action;
        return this;
    };
    AccessibleButton.prototype.withFocusAction = function (action) {
        this.focusAction = action;
        return this;
    };
    AccessibleButton.prototype.withMouseEnterAction = function (action) {
        this.mouseenterAction = action;
        return this;
    };
    AccessibleButton.prototype.withBlurAndMouseLeaveAction = function (action) {
        this.mouseleaveAction = action;
        this.blurAction = action;
        return this;
    };
    AccessibleButton.prototype.withMouseLeaveAction = function (action) {
        this.mouseleaveAction = action;
        return this;
    };
    AccessibleButton.prototype.withBlurAction = function (action) {
        this.blurAction = action;
        return this;
    };
    AccessibleButton.prototype.build = function () {
        if (!this.element) {
            this.element = Dom_1.$$('div');
        }
        this.ensureCorrectRole();
        this.ensureCorrectLabel();
        this.ensureTitle();
        this.ensureSelectAction();
        this.ensureUnselectAction();
        this.ensureMouseenterAndFocusAction();
        this.ensureMouseleaveAndBlurAction();
        this.ensureDifferentiationBetweenKeyboardAndMouseFocus();
        return this;
    };
    AccessibleButton.prototype.ensureDifferentiationBetweenKeyboardAndMouseFocus = function () {
        var _this = this;
        var classOnPress = 'coveo-accessible-button-pressed';
        var classOnFocus = 'coveo-accessible-button-focused';
        Dom_1.$$(this.element).addClass('coveo-accessible-button');
        Dom_1.$$(this.element).on('mousedown', function () {
            Dom_1.$$(_this.element).addClass(classOnPress);
            Dom_1.$$(_this.element).removeClass(classOnFocus);
        });
        Dom_1.$$(this.element).on('mouseup', function () { return Dom_1.$$(_this.element).removeClass(classOnPress); });
        Dom_1.$$(this.element).on('focus', function () {
            if (!Dom_1.$$(_this.element).hasClass(classOnPress)) {
                Dom_1.$$(_this.element).addClass(classOnFocus);
            }
        });
        Dom_1.$$(this.element).on('blur', function () { return Dom_1.$$(_this.element).removeClass(classOnFocus); });
    };
    AccessibleButton.prototype.ensureCorrectRole = function () {
        if (!this.element.getAttribute('role')) {
            this.element.setAttribute('role', 'button');
        }
    };
    AccessibleButton.prototype.ensureCorrectLabel = function () {
        if (!this.label) {
            this.logger.error("Missing label to create an accessible button !");
            return;
        }
        this.element.setAttribute('aria-label', this.label);
    };
    AccessibleButton.prototype.ensureTitle = function () {
        this.title && this.element.setAttribute('title', this.title);
    };
    AccessibleButton.prototype.ensureTabIndex = function () {
        this.element.setAttribute('tabindex', '0');
    };
    AccessibleButton.prototype.ensureSelectAction = function () {
        var _this = this;
        if (this.enterKeyboardAction) {
            this.ensureTabIndex();
            this.bindEvent('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function (e) { return _this.enterKeyboardAction(e); }));
        }
        if (this.clickAction) {
            this.bindEvent('click', this.clickAction);
        }
    };
    AccessibleButton.prototype.ensureUnselectAction = function () {
        if (this.blurAction) {
            this.bindEvent('blur', this.blurAction);
        }
        if (this.mouseleaveAction) {
            this.bindEvent('mouseleave', this.mouseleaveAction);
        }
    };
    AccessibleButton.prototype.ensureMouseenterAndFocusAction = function () {
        if (this.mouseenterAction) {
            this.bindEvent('mouseenter', this.mouseenterAction);
        }
        if (this.focusAction) {
            this.bindEvent('focus', this.focusAction);
        }
    };
    AccessibleButton.prototype.ensureMouseleaveAndBlurAction = function () {
        if (this.mouseleaveAction) {
            this.bindEvent('mouseleave', this.mouseleaveAction);
        }
        if (this.blurAction) {
            this.bindEvent('blur', this.blurAction);
        }
    };
    AccessibleButton.prototype.bindEvent = function (event, action) {
        if (this.eventOwner) {
            this.eventOwner.on(this.element, event, action);
        }
        else {
            Dom_1.$$(this.element).on(event, action);
        }
    };
    return AccessibleButton;
}());
exports.AccessibleButton = AccessibleButton;


/***/ }),

/***/ 175:
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
var SuggestionForOmnibox_1 = __webpack_require__(361);
var ComponentOptions_1 = __webpack_require__(8);
var Component_1 = __webpack_require__(6);
var Assert_1 = __webpack_require__(5);
var OmniboxEvents_1 = __webpack_require__(31);
var QueryEvents_1 = __webpack_require__(10);
var Strings_1 = __webpack_require__(7);
var QueryStateModel_1 = __webpack_require__(12);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Initialization_1 = __webpack_require__(2);
var Dom_1 = __webpack_require__(1);
var SearchInterface_1 = __webpack_require__(18);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var AccessibleButton_1 = __webpack_require__(17);
/**
 * The AnalyticsSuggestion component provides query suggestions based on the queries that a Coveo Analytics service most
 * commonly logs.
 *
 * This component orders possible query suggestions by their respective number of successful item views, thus
 * prioritizing the most relevant query suggestions. Consequently, when better options are available, this component
 * does not suggest queries resulting in no clicks from users or requiring refinements.
 *
 * The query suggestions appear in the {@link Omnibox} Component. The AnalyticsSuggestion component strongly
 * relates to the {@link Analytics} component. While a user is typing in a query box, the AnalyticsSuggestion component
 * allows them to see and select the most commonly used and relevant queries.
 *
 * @deprecated This component is exposed for legacy reasons. If possible, you should avoid using this component.
 * Instead, you should use the [`Omnibox`]{@link Omnibox}
 * [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon} option.
 */
var AnalyticsSuggestions = /** @class */ (function (_super) {
    __extends(AnalyticsSuggestions, _super);
    /**
     * Creates a new AnalyticsSuggestions component.
     *
     * Also binds event handlers so that when a user selects a suggestion, an `omniboxFromLink` usage analytics event is
     * logged if the suggestion comes from a standalone search box, or an `omniboxAnalytics` usage analytics
     * event is logged otherwise.
     *
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the AnalyticsSuggestions component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function AnalyticsSuggestions(element, options, bindings) {
        var _this = _super.call(this, element, AnalyticsSuggestions.ID, bindings) || this;
        _this.options = options;
        _this.partialQueries = [];
        _this.lastSuggestions = [];
        _this.resultsToBuildWith = [];
        if (_this.options && 'omniboxSuggestionOptions' in _this.options) {
            _this.options = _.extend(_this.options, _this.options['omniboxSuggestionOptions']);
        }
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, AnalyticsSuggestions, _this.options);
        var rowTemplate = function (toRender) {
            var rowElement = Dom_1.$$('div', {
                className: 'magic-box-suggestion coveo-omnibox-selectable coveo-top-analytics-suggestion-row'
            });
            new AccessibleButton_1.AccessibleButton()
                .withElement(rowElement)
                .withLabel(toRender.rawValue)
                .build();
            if (toRender['data']) {
                rowElement.el.innerHTML = toRender['data'];
            }
            return rowElement.el.outerHTML;
        };
        _this.options.onSelect = _this.options.onSelect || _this.onRowSelection;
        var suggestionStructure = {
            row: rowTemplate
        };
        _this.suggestionForOmnibox = new SuggestionForOmnibox_1.SuggestionForOmnibox(suggestionStructure, function (value, args) {
            _this.options.onSelect.call(_this, value, args);
        }, function (value, args) {
            _this.onRowTab.call(_this, value, args);
        });
        _this.bind.onRootElement(OmniboxEvents_1.OmniboxEvents.populateOmnibox, function (args) { return _this.handlePopulateOmnibox(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function () { return (_this.partialQueries = []); });
        return _this;
    }
    AnalyticsSuggestions.doExport = function () {
        GlobalExports_1.exportGlobally({
            AnalyticsSuggestions: AnalyticsSuggestions
        });
    };
    AnalyticsSuggestions.prototype.selectSuggestion = function (suggestion) {
        if (this.currentlyDisplayedSuggestions) {
            if (isNaN(suggestion)) {
                if (this.currentlyDisplayedSuggestions[suggestion]) {
                    Dom_1.$$(this.currentlyDisplayedSuggestions[suggestion].element).trigger('click');
                }
            }
            else {
                var currentlySuggested = _.findWhere(this.currentlyDisplayedSuggestions, {
                    pos: suggestion
                });
                if (currentlySuggested) {
                    Dom_1.$$(currentlySuggested.element).trigger('click');
                }
            }
        }
    };
    AnalyticsSuggestions.prototype.handlePopulateOmnibox = function (args) {
        var _this = this;
        Assert_1.Assert.exists(args);
        var promise = new Promise(function (resolve, reject) {
            var searchPromise = _this.usageAnalytics.getTopQueries({
                pageSize: _this.options.numberOfSuggestions,
                queryText: args.completeQueryExpression.word
            });
            searchPromise.then(function (results) {
                _this.resultsToBuildWith = _.map(results, function (result) {
                    return {
                        value: result
                    };
                });
                _this.lastSuggestions = results;
                if (!_.isEmpty(_this.resultsToBuildWith) && args.completeQueryExpression.word != '') {
                    _this.partialQueries.push(args.completeQueryExpression.word);
                }
                var element = _this.suggestionForOmnibox.buildOmniboxElement(_this.resultsToBuildWith, args);
                _this.currentlyDisplayedSuggestions = {};
                if (element) {
                    _.map(Dom_1.$$(element).findAll('.coveo-omnibox-selectable'), function (selectable, i) {
                        _this.currentlyDisplayedSuggestions[Dom_1.$$(selectable).text()] = {
                            element: selectable,
                            pos: i
                        };
                    });
                }
                resolve({
                    element: element,
                    zIndex: _this.options.omniboxZIndex
                });
            });
            searchPromise.catch(function () {
                resolve({
                    element: undefined
                });
            });
        });
        args.rows.push({ deferred: promise });
    };
    AnalyticsSuggestions.prototype.onRowSelection = function (value, args) {
        args.clear();
        args.closeOmnibox();
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, value);
        this.usageAnalytics.logSearchEvent(this.getOmniboxAnalyticsEventCause(), {
            partialQueries: this.cleanCustomData(this.partialQueries),
            suggestionRanking: _.indexOf(_.pluck(this.resultsToBuildWith, 'value'), value),
            suggestions: this.cleanCustomData(this.lastSuggestions),
            partialQuery: args.completeQueryExpression.word
        });
        this.queryController.executeQuery();
    };
    AnalyticsSuggestions.prototype.onRowTab = function (value, args) {
        args.clear();
        args.closeOmnibox();
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, "" + value);
        this.usageAnalytics.logCustomEvent(this.getOmniboxAnalyticsEventCause(), {
            partialQueries: this.cleanCustomData(this.partialQueries),
            suggestionRanking: _.indexOf(_.pluck(this.resultsToBuildWith, 'value'), value),
            suggestions: this.cleanCustomData(this.lastSuggestions),
            partialQuery: args.completeQueryExpression.word
        }, this.element);
    };
    AnalyticsSuggestions.prototype.cleanCustomData = function (toClean, rejectLength) {
        if (rejectLength === void 0) { rejectLength = 256; }
        // Filter out only consecutive values that are the identical
        toClean = _.compact(_.filter(toClean, function (partial, pos, array) {
            return pos === 0 || partial !== array[pos - 1];
        }));
        // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
        // Need to replace ;
        toClean = _.map(toClean, function (partial) {
            return partial.replace(/;/g, '');
        });
        // Reduce right to get the last X words that adds to less then rejectLength
        var reducedToRejectLengthOrLess = [];
        _.reduceRight(toClean, function (memo, partial) {
            var totalSoFar = memo + partial.length;
            if (totalSoFar <= rejectLength) {
                reducedToRejectLengthOrLess.push(partial);
            }
            return totalSoFar;
        }, 0);
        toClean = reducedToRejectLengthOrLess.reverse();
        var ret = toClean.join(';');
        // analytics service can store max 256 char in a custom event
        // if we're over that, call cleanup again with an arbitrary 10 less char accepted
        if (ret.length >= 256) {
            return this.cleanCustomData(toClean, rejectLength - 10);
        }
        return toClean.join(';');
    };
    AnalyticsSuggestions.prototype.getOmniboxAnalyticsEventCause = function () {
        if (this.searchInterface instanceof SearchInterface_1.StandaloneSearchInterface) {
            return AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxFromLink;
        }
        return AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxAnalytics;
    };
    AnalyticsSuggestions.ID = 'AnalyticsSuggestions';
    /**
     * The options for the component
     * @componentOptions
     */
    AnalyticsSuggestions.options = {
        /**
         * Specifies the z-index position at which the query suggestions render themselves in the {@link Omnibox}
         * component. Higher values are placed first.
         *
         * Default value is `52` and minimum value is `0`.
         */
        omniboxZIndex: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 52, min: 0 }),
        /**
         * Specifies the title of the query suggestions group in the {@link Omnibox} component. This option is not available
         * when using the default Lightning Friendly Theme (see
         * [Lightning Friendly Theme](https://developers.coveo.com/x/Y4EAAg)).
         *
         * Default value is the localized string for `"Suggested Queries"`.
         */
        headerTitle: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: Strings_1.l('SuggestedQueries') }),
        /**
         * Specifies the number of query suggestions to request and display in the {@link Omnibox} component.
         *
         * Default value is `5` and minimum value is `1`.
         */
        numberOfSuggestions: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 })
    };
    return AnalyticsSuggestions;
}(Component_1.Component));
exports.AnalyticsSuggestions = AnalyticsSuggestions;
Initialization_1.Initialization.registerAutoCreateComponent(AnalyticsSuggestions);


/***/ }),

/***/ 361:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DomUtils_1 = __webpack_require__(65);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var SuggestionForOmnibox = /** @class */ (function () {
    function SuggestionForOmnibox(structure, onSelect, onTabPress) {
        this.structure = structure;
        this.onSelect = onSelect;
        this.onTabPress = onTabPress;
    }
    SuggestionForOmnibox.prototype.buildOmniboxElement = function (results, args) {
        var element;
        if (results.length != 0) {
            element = Dom_1.$$('div').el;
            if (this.structure.header) {
                var header = this.buildElementHeader();
                element.appendChild(header);
            }
            var rows = this.buildRowElements(results, args);
            _.each(rows, function (row) {
                element.appendChild(row);
            });
        }
        return element;
    };
    SuggestionForOmnibox.prototype.buildElementHeader = function () {
        return Dom_1.$$('div', undefined, this.structure.header.template({
            headerTitle: this.structure.header.title
        })).el;
    };
    SuggestionForOmnibox.prototype.buildRowElements = function (results, args) {
        var _this = this;
        var ret = [];
        _.each(results, function (result) {
            var row = Dom_1.$$('div', undefined, _this.structure.row({
                rawValue: result.value,
                data: DomUtils_1.DomUtils.highlightElement(result.value, args.completeQueryExpression.word)
            })).el;
            Dom_1.$$(row).on('click', function () {
                _this.onSelect.call(_this, result.value, args);
            });
            Dom_1.$$(row).on('keyboardSelect', function () {
                _this.onSelect.call(_this, result.value, args);
            });
            Dom_1.$$(row).on('tabSelect', function () {
                _this.onTabPress.call(_this, result.value, args);
            });
            ret.push(row);
        });
        return ret;
    };
    return SuggestionForOmnibox;
}());
exports.SuggestionForOmnibox = SuggestionForOmnibox;


/***/ }),

/***/ 367:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=AnalyticsSuggestions__f056675ccb969b1e6859.js.map