webpackJsonpCoveo__temporary([28],{

/***/ 179:
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
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var OmniboxEvents_1 = __webpack_require__(30);
var Initialization_1 = __webpack_require__(1);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Dom_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(325);
var _ = __webpack_require__(0);
var SuggestionsCache_1 = __webpack_require__(319);
var ModelsModules_1 = __webpack_require__(141);
var UtilsModules_1 = __webpack_require__(82);
var FacetValueSuggestionsProvider_1 = __webpack_require__(385);
var MiscModules_1 = __webpack_require__(52);
/**
 * The `FieldValueSuggestions` component provides query suggestions based on a particular field values.
 *
 * For example, if you use a `@category` field, this component will provide suggestions for categories that returns results for the given keywords.
 *
 * The query suggestions provided by this component appear in the [`Omnibox`]{@link Omnibox} component.
 */
var FacetValueSuggestions = /** @class */ (function (_super) {
    __extends(FacetValueSuggestions, _super);
    /**
     * Creates a new `FieldSuggestions` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `FieldSuggestions` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function FacetValueSuggestions(element, options, bindings) {
        var _this = _super.call(this, element, FacetValueSuggestions.ID, bindings) || this;
        _this.options = options;
        _this.fieldValueCache = new SuggestionsCache_1.SuggestionsCache();
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, FacetValueSuggestions, options);
        _this.facetValueSuggestionsProvider = new FacetValueSuggestionsProvider_1.FacetValueSuggestionsProvider(_this.queryController, {
            field: _this.options.field
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
        var keyword = UtilsModules_1.DomUtils.highlightElement(row.keyword, omnibox.getText(), 'coveo-omnibox-hightlight2');
        var facetValue = UtilsModules_1.DomUtils.highlightElement(row.value, row.value, 'coveo-omnibox-hightlight');
        var details = this.options.displayEstimateNumberOfResults ? " (" + MiscModules_1.l('ResultCount', row.numberOfResults.toString()) + ")" : '';
        return "" + MiscModules_1.l('KeywordInCategory', keyword, facetValue) + details;
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
                        suggestions = (_a.sent()) || [];
                        return [2 /*return*/, suggestions.map(function (s) { return s.text; })];
                    case 2: return [2 /*return*/, []];
                }
            });
        });
    };
    FacetValueSuggestions.prototype.getFacetValueSuggestions = function (text, omnibox) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var wordsToQuery, suggestionsKeywords, allWordsToQuery, suggestions, currentSelectedValues_1, filteredSuggestions, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wordsToQuery = this.options.useValueFromSearchbox ? [text] : [];
                        return [4 /*yield*/, this.getQuerySuggestionsKeywords(omnibox)];
                    case 1:
                        suggestionsKeywords = _a.sent();
                        allWordsToQuery = _.unique(wordsToQuery.concat(suggestionsKeywords));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.fieldValueCache.getSuggestions("fv" + allWordsToQuery.join(''), function () {
                                return _this.facetValueSuggestionsProvider.getSuggestions(allWordsToQuery);
                            })];
                    case 3:
                        suggestions = _a.sent();
                        this.logger.debug('FacetValue Suggestions Results', suggestions);
                        currentSelectedValues_1 = this.queryStateModel.get(this.queryStateFieldFacetId) || [];
                        filteredSuggestions = suggestions.filter(function (suggestion) {
                            return _this.isSuggestionRowAlreadyCheckedInFacet(suggestion, currentSelectedValues_1);
                        });
                        return [2 /*return*/, this.rankSuggestionRows(filteredSuggestions).map(function (result) { return _this.mapFacetValueSuggestion(result, omnibox); })];
                    case 4:
                        error_1 = _a.sent();
                        this.logger.error(error_1);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
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
        return {
            html: this.buildDisplayNameForRow(resultToShow, omnibox),
            onSelect: function () { return _this.onRowSelection(resultToShow, omnibox); }
        };
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
    FacetValueSuggestions.prototype.onRowSelection = function (row, omnibox) {
        omnibox.setText(row.keyword);
        // Copy the state here, else it will directly modify queryStateModel.defaultAttributes.fv.
        var fvState = __assign({}, this.queryStateModel.get(ModelsModules_1.QueryStateModel.attributesEnum.fv));
        var existingValues = fvState[this.options.field.toString()] || [];
        fvState[this.options.field.toString()] = existingValues.concat([row.value]);
        this.queryStateModel.set(ModelsModules_1.QueryStateModel.attributesEnum.fv, fvState);
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
         * Specifies the facet field from which to provide suggestions.
         *
         * Specifying a value for this option is required for the `FieldValueSuggestions` component to work.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
        /**
         * Specifies the number of suggestions to render in the [`Omnibox`]{@link Omnibox}.
         *
         * Default value is `5`. Minimum value is `1`.
         */
        numberOfSuggestions: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 }),
        /**
         * Specifies whether to use query suggestions as keywords to get facet values suggestions.
         *
         * Default value is `true`.
         *
         * **Note:**
         * This option requires that the `enableQuerySuggestAddon` is set to `true` in the [`Omnibox`]{@link Omnibox} component.
         */
        useQuerySuggestions: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to use the current value from the search box to get facet values suggestions.
         *
         * Default value is `true` if [`useQuerySuggestions`]{@link useQuerySuggestions} is disabled, `false` otherwise.
         */
        useValueFromSearchbox: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            postProcessing: function (value, options) {
                return value || !options.useQuerySuggestions;
            }
        }),
        /**
         * Specifies whether to display the number of results in each of the suggestions.
         *
         * Default value is `false`.
         *
         * **Note:**
         * The number of results is an estimate.
         *
         * On a Standalone Search Interface, if you are redirecting on a Search Interface that has different filters,
         *  the number of results on the Standalone Search Interface will be inaccurate.
         *
         * Setting this option has no effect when the `templateHelper` options is set.
         */
        displayEstimateNumberOfResults: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies the helper function to execute when generating suggestions shown to the end user in the
         * [`Omnibox`]{@link Omnibox}.
         *
         * If not specified, a default template will be used.
         *
         * **Note:**
         * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
         * > [`init`]{@link init} call of your search interface (see
         * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
         * > or before the `init` call, using the `options` top-level function (see
         * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
         *
         * **Example:**
         *
         * ```javascript
         *
         * var suggestionTemplate = function(row, omnibox) {
         *   return "Searching for " + row.keyword + " in category " + row.value;
         * };
         *
         * // You can set the option in the 'init' call:
         * Coveo.init(document.querySelector("#search"), {
         *    FacetValueSuggestions : {
         *      templateHelper : suggestionTemplate
         *    }
         * });
         *
         * // Or before the 'init' call, using the 'options' top-level function:
         * // Coveo.options(document.querySelector("#search"), {
         * //   FacetValueSuggestions : {
         * //     templateHelper : suggestionTemplate
         * //   }
         * // });
         * ```
         */
        templateHelper: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        })
    };
    return FacetValueSuggestions;
}(Component_1.Component));
exports.FacetValueSuggestions = FacetValueSuggestions;
Initialization_1.Initialization.registerAutoCreateComponent(FacetValueSuggestions);


/***/ }),

/***/ 319:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SuggestionsCache = /** @class */ (function () {
    function SuggestionsCache() {
        this.cache = {};
    }
    SuggestionsCache.prototype.getSuggestions = function (hash, suggestionsFetcher) {
        var _this = this;
        if (!hash || hash.length === 0) {
            return null;
        }
        if (this.cache[hash] != null) {
            return this.cache[hash];
        }
        var promise = suggestionsFetcher();
        this.cache[hash] = promise;
        promise.catch(function () { return _this.clearSuggestion(hash); });
        return this.cache[hash];
    };
    SuggestionsCache.prototype.clearSuggestion = function (hash) {
        if (!hash || hash.length === 0) {
            return null;
        }
        delete this.cache[hash];
    };
    return SuggestionsCache;
}());
exports.SuggestionsCache = SuggestionsCache;


/***/ }),

/***/ 325:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 385:
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
                        suggestionValuesRequests = valuesToSearch.map(function (value) { return _this.buildListFieldValueRequest(queryParts.concat([value]).join(' ')); });
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
//# sourceMappingURL=FacetValueSuggestions__e88b07527d07df27a874.js.map