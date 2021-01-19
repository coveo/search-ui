webpackJsonpCoveo__temporary([45],{

/***/ 252:
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
__webpack_require__(516);
var _ = __webpack_require__(0);
var OmniboxEvents_1 = __webpack_require__(33);
var GlobalExports_1 = __webpack_require__(3);
var MiscModules_1 = __webpack_require__(71);
var ModelsModules_1 = __webpack_require__(201);
var Dom_1 = __webpack_require__(1);
var UtilsModules_1 = __webpack_require__(121);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var FacetValueSuggestionsProvider_1 = __webpack_require__(613);
/**
 * This component provides [`Omnibox`]{@link Omnibox} query suggestions scoped to distinct categories based on the values of a
 * specific [`field`]{@link FacetValueSuggestions.options.field} whose [Facet](https://docs.coveo.com/en/1982/#facet) option is enabled.
 *
 * @externaldocs [Providing Facet Value Suggestions](https://docs.coveo.com/en/340/#providing-facet-value-suggestions)
 *
 * @availablesince [May 2018 Release (v2.4094.8)](https://docs.coveo.com/410/#may-2018-release-v240948)
 */
var FacetValueSuggestions = /** @class */ (function (_super) {
    __extends(FacetValueSuggestions, _super);
    /**
     * Creates a new `FacetValueSuggestions` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `FacetValueSuggestions` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function FacetValueSuggestions(element, options, bindings) {
        var _this = _super.call(this, element, FacetValueSuggestions.ID, bindings) || this;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, FacetValueSuggestions, options);
        _this.facetValueSuggestionsProvider = new FacetValueSuggestionsProvider_1.FacetValueSuggestionsProvider(_this.queryController, {
            field: _this.options.field,
            expression: _this.options.expression
        });
        _this.queryStateFieldFacetId = "f:" + _this.options.field;
        if (!_this.options.templateHelper) {
            _this.options.templateHelper = FacetValueSuggestions.defaultTemplate;
        }
        Dom_1.$$(_this.root).on(OmniboxEvents_1.OmniboxEvents.populateOmniboxSuggestions, function (e, args) {
            args.suggestions.push(_this.getSuggestions(args.omnibox));
        });
        return _this;
    }
    FacetValueSuggestions.defaultTemplate = function (row, omnibox) {
        var keyword = row.keyword.html;
        var facetValue = UtilsModules_1.DomUtils.highlight(row.value, 'coveo-omnibox-hightlight');
        var details = this.options.displayEstimateNumberOfResults
            ? UtilsModules_1.DomUtils.highlight(" (" + MiscModules_1.l('ResultCount', row.numberOfResults.toString(), row.numberOfResults) + ")", 'coveo-omnibox-suggestion-results-count', true)
            : '';
        return "" + MiscModules_1.l('KeywordInCategory', keyword, facetValue) + details;
    };
    FacetValueSuggestions.getQuerySuggestionKeywordFromText = function (text) {
        return {
            text: text,
            html: UtilsModules_1.DomUtils.highlight(text, 'coveo-omnibox-hightlight')
        };
    };
    FacetValueSuggestions.prototype.getSuggestions = function (omnibox) {
        return __awaiter(this, void 0, void 0, function () {
            var text, suggestions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.numberOfSuggestions == 0) {
                            return [2 /*return*/, []];
                        }
                        text = omnibox.getText();
                        return [4 /*yield*/, this.getFacetValueSuggestions(text, omnibox)];
                    case 1:
                        suggestions = _a.sent();
                        return [2 /*return*/, suggestions || []];
                }
            });
        });
    };
    FacetValueSuggestions.prototype.getQuerySuggestionsKeywords = function (omnibox) {
        return __awaiter(this, void 0, void 0, function () {
            var suggestions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.options.useQuerySuggestions && omnibox.suggestionAddon)) return [3 /*break*/, 2];
                        return [4 /*yield*/, omnibox.suggestionAddon.getSuggestion()];
                    case 1:
                        suggestions = _a.sent();
                        return [2 /*return*/, suggestions.map(function (_a) {
                                var text = _a.text, html = _a.html;
                                return ({ text: text || '', html: html });
                            })];
                    case 2: return [2 /*return*/, []];
                }
            });
        });
    };
    FacetValueSuggestions.prototype.getFacetValueSuggestions = function (text, omnibox) {
        return __awaiter(this, void 0, void 0, function () {
            var wordsToQuery, suggestionsKeywords, allKeywordsToQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wordsToQuery = this.options.useValueFromSearchbox ? [FacetValueSuggestions.getQuerySuggestionKeywordFromText(text)] : [];
                        return [4 /*yield*/, this.getQuerySuggestionsKeywords(omnibox)];
                    case 1:
                        suggestionsKeywords = _a.sent();
                        allKeywordsToQuery = _.unique(wordsToQuery.concat(suggestionsKeywords).filter(function (keyword) { return keyword.text != ''; }), function (keyword) { return keyword.text; });
                        if (allKeywordsToQuery.length === 0) {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, this.getSuggestionsForWords(allKeywordsToQuery, omnibox)];
                }
            });
        });
    };
    FacetValueSuggestions.prototype.getSuggestionsForWords = function (keywordToQuery, omnibox) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var suggestions, currentSelectedValues_1, filteredSuggestions, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.facetValueSuggestionsProvider.getSuggestions(keywordToQuery)];
                    case 1:
                        suggestions = _a.sent();
                        this.logger.debug('FacetValue Suggestions Results', suggestions);
                        currentSelectedValues_1 = this.queryStateModel.get(this.queryStateFieldFacetId) || [];
                        filteredSuggestions = suggestions.filter(function (suggestion) {
                            return _this.isSuggestionRowAlreadyCheckedInFacet(suggestion, currentSelectedValues_1);
                        });
                        return [2 /*return*/, this.rankSuggestionRows(filteredSuggestions).map(function (result) { return _this.mapFacetValueSuggestion(result, omnibox); })];
                    case 2:
                        error_1 = _a.sent();
                        this.logger.error(error_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FacetValueSuggestions.prototype.isSuggestionRowAlreadyCheckedInFacet = function (suggestion, currentlySelectedValues) {
        return !currentlySelectedValues.some(function (value) { return value == suggestion.value; });
    };
    FacetValueSuggestions.prototype.rankSuggestionRows = function (suggestions) {
        var rankedResults = suggestions.sort(function (a, b) { return b.score.distanceFromTotalForField - a.score.distanceFromTotalForField; }).slice();
        var firstSlice = Math.ceil(this.options.numberOfSuggestions / 2);
        var lastSlice = -Math.floor(this.options.numberOfSuggestions / 2);
        var firstResultsToReturn = rankedResults.splice(0, firstSlice);
        if (lastSlice != 0) {
            var lastResultsToReturn = rankedResults.slice(lastSlice);
            return firstResultsToReturn.concat(lastResultsToReturn);
        }
        return firstResultsToReturn;
    };
    FacetValueSuggestions.prototype.mapFacetValueSuggestion = function (resultToShow, omnibox) {
        var _this = this;
        var suggestion = {
            html: this.buildDisplayNameForRow(resultToShow, omnibox),
            text: resultToShow.keyword.text
        };
        var fieldValues = this.options.isCategoryField
            ? resultToShow.value.split(this.options.categoryFieldDelimitingCharacter)
            : [resultToShow.value];
        suggestion.advancedQuery = fieldValues.map(function (value) { return _this.options.field + "==\"" + value + "\""; }).join(' AND ');
        suggestion.onSelect = function () { return _this.onSuggestionSelected(suggestion, fieldValues, omnibox); };
        return suggestion;
    };
    FacetValueSuggestions.prototype.buildDisplayNameForRow = function (row, omnibox) {
        try {
            return this.options.templateHelper.call(this, row, omnibox);
        }
        catch (ex) {
            this.logger.error('Could not apply template from options for the given row. Will use default template.', ex, row, omnibox);
            return FacetValueSuggestions.defaultTemplate.call(this, row, omnibox);
        }
    };
    FacetValueSuggestions.prototype.onSuggestionSelected = function (suggestion, fieldValues, omnibox) {
        omnibox.setText(suggestion.text);
        // Copy the state here, else it will directly modify queryStateModel.defaultAttributes.fv.
        var fvState = __assign({}, this.queryStateModel.get(ModelsModules_1.QueryStateModel.attributesEnum.fv));
        var existingValues = fvState[this.options.field.toString()] || [];
        fvState[this.options.field.toString()] = existingValues.concat(fieldValues);
        this.queryStateModel.set(ModelsModules_1.QueryStateModel.attributesEnum.fv, fvState);
        omnibox.magicBox.blur();
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxField, {});
        this.queryController.executeQuery();
    };
    FacetValueSuggestions.ID = 'FacetValueSuggestions';
    FacetValueSuggestions.doExport = function () {
        GlobalExports_1.exportGlobally({
            FacetValueSuggestions: FacetValueSuggestions
        });
    };
    /**
     * @componentOptions
     */
    FacetValueSuggestions.options = {
        /**
         * The field on whose values the scoped query suggestions should be based.
         *
         * @examples @productcategory
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
        /**
         * The maximum number of suggestions to render in the [`Omnibox`]{@link Omnibox}.
         */
        numberOfSuggestions: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 }),
        /**
         * Whether to get scoped query suggestions from the current Coveo ML query suggestions.
         *
         * **Note:** If this options is set to `true` the [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon} option of the [`Omnibox`]{@link Omnibox.option.enableQuerySuggestAddon} component must be set to `true` as well.
         */
        useQuerySuggestions: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Whether to get scoped query suggestions from the current user query entered in the search box.
         *
         * **Default:** `true` if [`useQuerySuggestions`]{@link FacetValueSuggestions.options.useQuerySuggestions} is `false`; `false` otherwise
         */
        useValueFromSearchbox: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            postProcessing: function (value, options) {
                return value || !options.useQuerySuggestions;
            }
        }),
        /**
         * Whether to display an estimate of the number of results for each scoped query suggestions.
         *
         * **Notes:**
         * - Setting this option to `true` has no effect when the [`templateHelper`]{@link FacetValueSuggestions.options.templateHelper} options is set.
         * - When displaying scoped query suggestions for a standalone search box whose queries are redirected to a search interface enforcing other filters, the number of results will be inaccurate.
         */
        displayEstimateNumberOfResults: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * The template helper function to execute when rendering each scoped query suggestion.
         *
         * If specified, the function must have the following signature: (row: [IFacetValueSuggestionRow]{@link IFacetValueSuggestionRow}, omnibox: Omnibox) => string
         *
         * If not specified, a default function will be used.
         *
         * **Note:** You cannot set this option directly in the component markup as an HTML attribute. You must either set it:
         * - In the [`init`]{@link init} call of your search interface (see [Passing Component Options in the init Call](https://docs.coveo.com/en/346/#passing-component-options-in-the-init-call)
         * - Before the `init` call, using the [`options`](@link options) top-level function (see [Passing Component Options Before the init Call](https://docs.coveo.com/en/346/#passing-component-options-before-the-init-call)).
         *
         * **Example:**
         *
         * ```javascript
         * Coveo.init(document.getElementById('search'), {
         *   FacetValueSuggestions: {
         *     templateHelper: (row, omnibox) => { return `Searching for <strong>${row.keyword}</strong> in category <em>${row.value}</em>`; }
         *   }
         * })
         * ```
         */
        templateHelper: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        }),
        /**
         * Whether the [`field`]{@link FacetValueSuggestions.options.field} option references a multi-value field.
         *
         * Setting this option to `true` if appropriate will allow the corresponding [`CategoryFacet`]{@link CategoryFacet} or [`DynamicHierarchicalFacet`]{@link DynamicHierarchicalFacet} component (if present) to properly handle the filter format.
         *
         * See also the [`categoryFieldDelimitingCharacter`]{@link FacetValueSuggestions.options.categoryFieldDelimitingCharacter} option.
         */
        isCategoryField: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * The delimiting character used for the multi-value field referenced by the [`field`]{@link FacetValueSuggestions.options.field} option.
         *
         * @examples ;, #
         */
        categoryFieldDelimitingCharacter: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '|', depend: 'isCategoryField' }),
        /**
         * An advanced query expression to add when requesting facet value suggestions.
         *
         * Set this option to ensure that the suggestions are properly scoped when using the component with a standalone search box. For instance, if a certain [tab]{@link Tab} is automatically selected in the search interface the standalone search box is redirecting its queries to, you should set this option to that tab's [`expression`]{@link Tab.options.expression}.
         *
         * @examples @objecttype==Message
         */
        expression: ComponentOptions_1.ComponentOptions.buildQueryExpressionOption()
    };
    return FacetValueSuggestions;
}(Component_1.Component));
exports.FacetValueSuggestions = FacetValueSuggestions;
Initialization_1.Initialization.registerAutoCreateComponent(FacetValueSuggestions);


/***/ }),

/***/ 516:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 613:
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
var FacetValueSuggestionsProvider = /** @class */ (function () {
    function FacetValueSuggestionsProvider(queryController, options) {
        this.queryController = queryController;
        this.options = options;
    }
    FacetValueSuggestionsProvider.prototype.getSuggestions = function (valuesToSearch) {
        return __awaiter(this, void 0, void 0, function () {
            var fieldsToQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFieldValuesToQuery(valuesToSearch)];
                    case 1:
                        fieldsToQuery = _a.sent();
                        return [2 /*return*/, this.getAllSuggestionsRows(fieldsToQuery.responses, fieldsToQuery.reference)];
                }
            });
        });
    };
    FacetValueSuggestionsProvider.prototype.getAllSuggestionsRows = function (fieldResponses, fieldTotalReference) {
        var _this = this;
        return fieldResponses.reduce(function (allValues, fieldResponse) {
            var suggestionRows = fieldResponse.values.map(function (indexFieldValue) {
                return {
                    numberOfResults: indexFieldValue.numberOfResults,
                    keyword: fieldResponse.keyword,
                    value: indexFieldValue.value,
                    score: _this.computeScoreForSuggestionRow(indexFieldValue, fieldTotalReference),
                    field: _this.options.field
                };
            });
            return allValues.concat(suggestionRows);
        }, []);
    };
    FacetValueSuggestionsProvider.prototype.getFieldValuesToQuery = function (valuesToSearch) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var referenceValuesRequest, queryParts, suggestionValuesRequests, requests, values, reference, responses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        referenceValuesRequest = this.buildReferenceFieldValueRequest();
                        queryParts = this.getQueryToExecuteParts();
                        if (this.options.expression) {
                            queryParts.push(this.options.expression);
                        }
                        suggestionValuesRequests = valuesToSearch.map(function (keyword) {
                            var queryToExecute = queryParts.concat([keyword.text]).join(' ');
                            return _this.buildListFieldValueRequest(queryToExecute);
                        });
                        requests = suggestionValuesRequests.concat([referenceValuesRequest]);
                        return [4 /*yield*/, this.queryController.getEndpoint().listFieldValuesBatch({
                                batch: requests
                            })];
                    case 1:
                        values = _a.sent();
                        reference = this.computeReferenceFromBatch(values.pop());
                        responses = values.map(function (value, i) {
                            return {
                                keyword: valuesToSearch[i],
                                values: value
                            };
                        });
                        return [2 /*return*/, {
                                responses: responses,
                                reference: reference
                            }];
                }
            });
        });
    };
    FacetValueSuggestionsProvider.prototype.computeScoreForSuggestionRow = function (fieldValue, reference) {
        var totalNumberForFieldValue = reference.fieldsTotal[fieldValue.value] || reference.smallestTotal;
        var distanceFromTotalForField = (totalNumberForFieldValue - fieldValue.numberOfResults) / totalNumberForFieldValue * 100;
        return {
            distanceFromTotalForField: distanceFromTotalForField
        };
    };
    FacetValueSuggestionsProvider.prototype.computeReferenceFromBatch = function (batch) {
        var fieldsTotal = {};
        batch.forEach(function (value) { return (fieldsTotal[value.value] = value.numberOfResults); });
        return {
            fieldsTotal: fieldsTotal,
            smallestTotal: batch[batch.length - 1].numberOfResults
        };
    };
    FacetValueSuggestionsProvider.prototype.buildListFieldValueRequest = function (queryToExecute) {
        return {
            field: this.options.field,
            ignoreAccents: true,
            maximumNumberOfValues: 3,
            queryOverride: queryToExecute
        };
    };
    FacetValueSuggestionsProvider.prototype.buildReferenceFieldValueRequest = function () {
        return {
            field: this.options.field
        };
    };
    FacetValueSuggestionsProvider.prototype.getQueryToExecuteParts = function () {
        var lastQuery = this.queryController.getLastQuery();
        var aqWithoutCurrentField = lastQuery && lastQuery.aq ? this.removeFieldExpressionFromExpression(this.options.field.toString(), lastQuery.aq) : '';
        return [aqWithoutCurrentField, lastQuery.cq].filter(function (part) { return !!part; });
    };
    FacetValueSuggestionsProvider.prototype.removeFieldExpressionFromExpression = function (field, expression) {
        var expressionWithParenthesis = '([^)]*)';
        var expressionAsSingleValue = '[^ ]*';
        return expression
            .replace(new RegExp(field + "==" + expressionWithParenthesis, 'gi'), '')
            .replace(new RegExp(field + "==" + expressionAsSingleValue, 'gi'), '');
    };
    return FacetValueSuggestionsProvider;
}());
exports.FacetValueSuggestionsProvider = FacetValueSuggestionsProvider;


/***/ })

});
//# sourceMappingURL=FacetValueSuggestions__36d30dcb7330ecf06f4d.js.map