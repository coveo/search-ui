webpackJsonpplayground([0],{

/***/ 121:
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
var RankingInfoTable_1 = __webpack_require__(340);
var MetaDataTable_1 = __webpack_require__(346);
var Dom_1 = __webpack_require__(1);
var ExternalModulesShim_1 = __webpack_require__(43);
var Core_1 = __webpack_require__(42);
var RelevanceInspectorTabs_1 = __webpack_require__(347);
__webpack_require__(348);
var ExecutionReport_1 = __webpack_require__(335);
var AvailableFieldsTable_1 = __webpack_require__(356);
var underscore_1 = __webpack_require__(0);
var InlineRankingInfo_1 = __webpack_require__(357);
var RelevanceInspector = /** @class */ (function () {
    function RelevanceInspector(element, bindings) {
        var _this = this;
        this.element = element;
        this.bindings = bindings;
        this.opened = false;
        this.modalBoxModule = ExternalModulesShim_1.ModalBox;
        Dom_1.$$(this.element).text('Relevance Inspector');
        Dom_1.$$(this.element).addClass('coveo-button coveo-relevance-inspector');
        Dom_1.$$(this.bindings.root).on(this.bindings.queryStateModel.getEventName(Core_1.QueryStateModel.eventTypes.changeOne + Core_1.QueryStateModel.attributesEnum.debug), function (e, args) { return _this.toggleFromState(args.value); });
        Dom_1.$$(this.element).on('click', function () { return _this.open(); });
        Dom_1.$$(this.bindings.root).on(Core_1.ResultListEvents.newResultDisplayed, function (e, args) {
            return _this.handleNewResultDisplayed(args);
        });
        this.bindings.queryStateModel.get(Core_1.QueryStateModel.attributesEnum.debug) ? this.show() : this.hide();
    }
    Object.defineProperty(RelevanceInspector.prototype, "modalBox", {
        get: function () {
            return this.modalBoxModule;
        },
        set: function (modalBoxModule) {
            this.modalBoxModule = modalBoxModule;
        },
        enumerable: true,
        configurable: true
    });
    RelevanceInspector.prototype.hide = function () {
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    RelevanceInspector.prototype.show = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    RelevanceInspector.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var content, animation, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.opened) {
                            return [2 /*return*/];
                        }
                        this.opened = true;
                        content = Dom_1.$$('div');
                        animation = Core_1.DomUtils.getBasicLoadingAnimation();
                        content.append(animation);
                        this.modalBox.open(content.el, this.modalBoxOptions);
                        return [4 /*yield*/, this.buildTabs()];
                    case 1:
                        rows = _a.sent();
                        if (rows) {
                            animation.remove();
                            content.append(rows.el);
                        }
                        else {
                            this.modalBox.close();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RelevanceInspector.prototype.handleNewResultDisplayed = function (args) {
        if (this.bindings.queryStateModel.get(Core_1.QueryStateModel.attributesEnum.debug)) {
            Dom_1.$$(args.item).addClass('coveo-with-inline-ranking-info');
            if (Dom_1.$$(args.item).hasClass('coveo-table-layout')) {
                Dom_1.$$(args.item).append(new InlineRankingInfo_1.InlineRankingInfo(args.result).build().el);
            }
            else {
                Dom_1.$$(args.item).prepend(new InlineRankingInfo_1.InlineRankingInfo(args.result).build().el);
            }
        }
    };
    Object.defineProperty(RelevanceInspector.prototype, "modalBoxOptions", {
        get: function () {
            var _this = this;
            return {
                title: 'Relevance Inspector',
                titleClose: false,
                overlayClose: true,
                sizeMod: 'big',
                className: 'relevance-inspector-modal',
                validation: function () {
                    _this.opened = false;
                    return true;
                },
                body: document.getElementsByClassName('CoveoSearchInterface')[0] // Will return undefined if no CoveoSearchInterface is present
            };
        },
        enumerable: true,
        configurable: true
    });
    RelevanceInspector.prototype.toggleFromState = function (stateValue) {
        stateValue != 0 ? this.show() : this.hide();
        this.modalBox.close();
    };
    RelevanceInspector.prototype.buildTabs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var lastResults, container, rankingInfoTable, metadataTable, executionReport, availableFields, inspectorTabs, debouncedResize, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        lastResults = this.bindings.queryController.getLastResults().results;
                        if (!lastResults || lastResults.length == 0) {
                            new Core_1.Logger(this).error('Could not open Relevance Inspector because there is no results to display. Please execute a query beforehand', lastResults);
                            return [2 /*return*/];
                        }
                        if (!lastResults[0].rankingInfo) {
                            new Core_1.Logger(this).error('Could not open Relevance Inspector because there is no ranking info returned on the results. Please execute a query in debug mode beforehad', lastResults);
                            return [2 /*return*/];
                        }
                        container = Dom_1.$$('div');
                        rankingInfoTable = new RankingInfoTable_1.RankingInfoTable(lastResults, this.bindings);
                        metadataTable = new MetaDataTable_1.MetaDataTable(lastResults, this.bindings);
                        executionReport = new ExecutionReport_1.ExecutionReport(this.bindings.queryController.getLastResults(), this.bindings);
                        availableFields = new AvailableFieldsTable_1.AvailableFieldsTable(this.bindings);
                        this.tabs = {
                            relevanceInspectorRankingInfo: rankingInfoTable,
                            relevanceInspectorMetadata: metadataTable,
                            relevanceInspectorExecutionReport: executionReport,
                            relevanceInspectorAvailableFields: availableFields
                        };
                        inspectorTabs = new RelevanceInspectorTabs_1.RelevanceInspectorTabs(function (tabChangedTo) {
                            _this.activeTab = tabChangedTo;
                            _this.resize();
                        });
                        debouncedResize = underscore_1.debounce(function () { return _this.resize(); }, 100);
                        window.addEventListener('resize', debouncedResize);
                        _b = (_a = inspectorTabs).addSection;
                        _c = ['Ranking Information'];
                        return [4 /*yield*/, rankingInfoTable.build()];
                    case 1:
                        _b.apply(_a, _c.concat([_o.sent(), 'relevanceInspectorRankingInfo']));
                        _e = (_d = inspectorTabs).addSection;
                        _f = ['Metadata'];
                        return [4 /*yield*/, metadataTable.build()];
                    case 2:
                        _e.apply(_d, _f.concat([_o.sent(), 'relevanceInspectorMetadata']));
                        _h = (_g = inspectorTabs).addSection;
                        _j = ['Execution Report'];
                        return [4 /*yield*/, executionReport.build()];
                    case 3:
                        _h.apply(_g, _j.concat([_o.sent(), 'relevanceInspectorExecutionReport']));
                        _l = (_k = inspectorTabs).addSection;
                        _m = ['Available Fields'];
                        return [4 /*yield*/, availableFields.build()];
                    case 4:
                        _l.apply(_k, _m.concat([_o.sent(), 'relevanceInspectorAvailableFields']));
                        inspectorTabs.select('relevanceInspectorRankingInfo');
                        container.append(inspectorTabs.navigationSection.el);
                        container.append(inspectorTabs.tabContentSection.el);
                        return [2 /*return*/, container];
                }
            });
        });
    };
    RelevanceInspector.prototype.resize = function () {
        if (!this.activeTab) {
            return;
        }
        if (!this.tabs[this.activeTab]) {
            return;
        }
        this.tabs[this.activeTab].gridOptions.api.sizeColumnsToFit();
    };
    return RelevanceInspector;
}());
exports.RelevanceInspector = RelevanceInspector;


/***/ }),

/***/ 334:
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
var AgGrid_1 = __webpack_require__(341);
var underscore_1 = __webpack_require__(0);
var UtilsModules_1 = __webpack_require__(81);
var ResultLink_1 = __webpack_require__(342);
exports.defaultGridOptions = {
    domLayout: 'autoHeight',
    enableColResize: true,
    rowHeight: 100,
    enableRangeSelection: true,
    suppressRowClickSelection: true,
    suppressCellSelection: true,
    defaultColDef: {
        width: 100
    },
    enableSorting: true,
    autoSizePadding: 10
};
var TableBuilder = /** @class */ (function () {
    function TableBuilder() {
    }
    TableBuilder.prototype.build = function (sources, table, gridOptions) {
        if (gridOptions === void 0) { gridOptions = exports.defaultGridOptions; }
        return __awaiter(this, void 0, void 0, function () {
            var firstData, mapToAgGridFormat, columnDefs, rowData, grid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firstData = underscore_1.first(sources) || {};
                        mapToAgGridFormat = function (value, key) {
                            if (value.children) {
                                return {
                                    field: key,
                                    headerName: key,
                                    marryChildren: true,
                                    children: underscore_1.flatten(value.children.map(function (child) {
                                        return underscore_1.map(child, mapToAgGridFormat);
                                    }))
                                };
                            }
                            else {
                                return __assign({ field: key, headerName: key }, value);
                            }
                        };
                        columnDefs = underscore_1.map(firstData, mapToAgGridFormat);
                        rowData = underscore_1.map(sources, function (source) {
                            var merged = {};
                            var extractContent = function (value, key) {
                                if (value.content) {
                                    merged[key] = value.content;
                                }
                                else if (value.children) {
                                    underscore_1.each(value.children, function (child) {
                                        underscore_1.each(child, extractContent);
                                    });
                                }
                            };
                            underscore_1.each(source, extractContent);
                            return merged;
                        });
                        this.gridOptions = __assign({}, exports.defaultGridOptions, { columnDefs: columnDefs,
                            rowData: rowData }, gridOptions);
                        return [4 /*yield*/, AgGrid_1.loadAgGridLibrary()];
                    case 1:
                        _a.sent();
                        grid = new agGrid.Grid(table.el, this.gridOptions);
                        return [2 /*return*/, { grid: grid, gridOptions: this.gridOptions }];
                }
            });
        });
    };
    TableBuilder.thumbnailCell = function (result, bindings) {
        return {
            Document: {
                content: { result: result, bindings: bindings },
                cellRenderer: ThumbnailHtmlRenderer,
                width: 550,
                getQuickFilterText: function (params) {
                    return '';
                }
            }
        };
    };
    return TableBuilder;
}());
exports.TableBuilder = TableBuilder;
var ThumbnailHtmlRenderer = /** @class */ (function () {
    function ThumbnailHtmlRenderer() {
    }
    ThumbnailHtmlRenderer.prototype.init = function (params) {
        if (params) {
            this.element = params.value;
            this.currentFilter = params.api.filterManager.quickFilter;
        }
    };
    ThumbnailHtmlRenderer.prototype.getGui = function () {
        var cell = UtilsModules_1.$$('div', { className: 'coveo-relevance-inspector-thumbnail-cell' });
        if (this.element) {
            var thumbnail = this.thumbnail(this.element.result, this.element.bindings);
            cell.append(thumbnail.el);
        }
        else {
            cell.append(UtilsModules_1.$$('p', undefined, '-- NULL --').el);
        }
        return cell.el;
    };
    ThumbnailHtmlRenderer.prototype.thumbnail = function (result, bindings) {
        var dom;
        if (bindings && result) {
            var resultLists = bindings.searchInterface.getComponents('ResultList');
            var firstActiveResultList = underscore_1.find(resultLists, function (resultList) { return !resultList.disabled; });
            if (firstActiveResultList) {
                dom = UtilsModules_1.$$('div', {
                    className: 'coveo-relevance-inspector-result-thumbnail'
                });
                firstActiveResultList.buildResult(result).then(function (builtResult) {
                    dom.append(builtResult);
                });
            }
            else {
                dom = UtilsModules_1.$$('a', {
                    className: 'CoveoResultLink'
                });
                new ResultLink_1.ResultLink(dom.el, { alwaysOpenInNewWindow: true }, bindings, result);
            }
            if (this.currentFilter) {
                this.highlightSearch(dom.el, this.currentFilter);
            }
        }
        else {
            dom = UtilsModules_1.$$('div', undefined, '-- NULL --');
        }
        return dom;
    };
    ThumbnailHtmlRenderer.prototype.refresh = function (params) {
        return true;
    };
    ThumbnailHtmlRenderer.prototype.highlightSearch = function (elementToSearch, search) {
        var asHTMLElement = elementToSearch;
        if (asHTMLElement != null && asHTMLElement.innerText != null) {
            var match = asHTMLElement.innerText.split(new RegExp('(?=' + UtilsModules_1.StringUtils.regexEncode(search) + ')', 'gi'));
            asHTMLElement.innerHTML = '';
            match.forEach(function (value) {
                var regex = new RegExp('(' + UtilsModules_1.StringUtils.regexEncode(search) + ')', 'i');
                var group = value.match(regex);
                var span;
                if (group != null) {
                    span = UtilsModules_1.$$('span', {
                        className: 'coveo-relevance-inspector-highlight'
                    });
                    span.text(group[1]);
                    asHTMLElement.appendChild(span.el);
                    span = UtilsModules_1.$$('span');
                    span.text(value.substr(group[1].length));
                    asHTMLElement.appendChild(span.el);
                }
                else {
                    span = UtilsModules_1.$$('span');
                    span.text(value);
                    asHTMLElement.appendChild(span.el);
                }
            });
        }
    };
    return ThumbnailHtmlRenderer;
}());
exports.ThumbnailHtmlRenderer = ThumbnailHtmlRenderer;
var GenericHtmlRenderer = /** @class */ (function () {
    function GenericHtmlRenderer() {
    }
    GenericHtmlRenderer.prototype.init = function (params) {
        if (params && params.api) {
            this.element = params.value;
            this.currentFilter = params.api.filterManager.quickFilter;
        }
    };
    GenericHtmlRenderer.prototype.getGui = function () {
        if (this.element && this.currentFilter) {
            return UtilsModules_1.$$('div', undefined, UtilsModules_1.StreamHighlightUtils.highlightStreamHTML(this.element, { Precision: ['precision'] }, {})).el;
        }
        else if (this.element) {
            return UtilsModules_1.$$('div', undefined, this.element).el;
        }
        else {
            return UtilsModules_1.$$('div', undefined, '-- NULL --').el;
        }
    };
    GenericHtmlRenderer.prototype.refresh = function (params) {
        return true;
    };
    return GenericHtmlRenderer;
}());
exports.GenericHtmlRenderer = GenericHtmlRenderer;


/***/ }),

/***/ 335:
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
var ExecutionReportAuthenticationSection_1 = __webpack_require__(350);
var ExecutionReportResolvedPipelineSection_1 = __webpack_require__(351);
var ExecutionReportQueryOverrideSection_1 = __webpack_require__(352);
var ExecutionReportSimpleSection_1 = __webpack_require__(339);
var ExecutionReportEffectiveIndexQuerySection_1 = __webpack_require__(353);
var UtilsModules_1 = __webpack_require__(81);
var ExecutionReportRankingModifiers_1 = __webpack_require__(354);
var Core_1 = __webpack_require__(42);
var ExecutionReportITDSection_1 = __webpack_require__(355);
var EXECUTION_REPORT_SECTION;
(function (EXECUTION_REPORT_SECTION) {
    EXECUTION_REPORT_SECTION["PERFORM_AUTHENTICATION"] = "PerformAuthentication";
    EXECUTION_REPORT_SECTION["RESOLVE_PIPELINE"] = "ResolvePipeline";
    EXECUTION_REPORT_SECTION["QUERY_PARAM_OVERRIDE"] = "ApplyQueryParamOverrideFeature";
    EXECUTION_REPORT_SECTION["THESAURUS"] = "ApplyThesaurusFeature";
    EXECUTION_REPORT_SECTION["PREPROCESS_QUERY_EXPRESSION"] = "PreprocessQueryExpression";
    EXECUTION_REPORT_SECTION["PREPROCESS_QUERY"] = "PreprocessQuery";
    EXECUTION_REPORT_SECTION["STOP_WORDS"] = "ApplyStopWordFeature";
    EXECUTION_REPORT_SECTION["FILTERS"] = "ApplyFilterFeature";
    EXECUTION_REPORT_SECTION["RANKING"] = "ApplyRankingFeature";
    EXECUTION_REPORT_SECTION["TOP_RESULT"] = "ApplyTopResultFeature";
    EXECUTION_REPORT_SECTION["RANKING_WEIGHT"] = "ApplyRankingWeightFeature";
    EXECUTION_REPORT_SECTION["INDEX_QUERY"] = "Send query to index";
    EXECUTION_REPORT_SECTION["TOP_CLICKS"] = "EvaluatingTopClicks";
    EXECUTION_REPORT_SECTION["PARTIAL_MATCH"] = "PartialMatch";
    EXECUTION_REPORT_SECTION["NONE"] = "NONE";
})(EXECUTION_REPORT_SECTION = exports.EXECUTION_REPORT_SECTION || (exports.EXECUTION_REPORT_SECTION = {}));
var ExecutionReport = /** @class */ (function () {
    function ExecutionReport(results, bindings) {
        this.results = results;
        this.bindings = bindings;
    }
    ExecutionReport.standardSectionHeader = function (title) {
        var container = UtilsModules_1.$$('div');
        container.append(UtilsModules_1.$$('h4', undefined, title).el);
        var agGridElement = UtilsModules_1.$$('div', {
            className: 'ag-theme-fresh'
        });
        container.append(agGridElement.el);
        return {
            container: container,
            agGridElement: agGridElement
        };
    };
    ExecutionReport.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var container, gridOptions, authenticationSection, resolvedPipelineSection, resolvedRankingModifiers, queryParamOverrideSection, thesaurusSection, stopWordsSection, filtersSection, rankingSection, topResultsSection, itdSection, rankingWeightsSection, indexQuerySection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.results.executionReport) {
                            new Core_1.Logger(this).error('Could not open execution report : Missing execution report on results. Try executing the query in debug mode.');
                            return [2 /*return*/, UtilsModules_1.$$('div')];
                        }
                        container = UtilsModules_1.$$('div', {
                            className: 'execution-report-debug'
                        });
                        gridOptions = [];
                        return [4 /*yield*/, new ExecutionReportAuthenticationSection_1.ExecutionReportAuthenticationSection().build(this.results.executionReport)];
                    case 1:
                        authenticationSection = _a.sent();
                        container.append(authenticationSection.container.el);
                        if (authenticationSection.gridOptions) {
                            gridOptions.push(authenticationSection.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportResolvedPipelineSection_1.ExecutionReportResolvedPipelineSection().build(this.results.executionReport)];
                    case 2:
                        resolvedPipelineSection = _a.sent();
                        container.append(resolvedPipelineSection.container.el);
                        if (resolvedPipelineSection.gridOptions) {
                            gridOptions.push(resolvedPipelineSection.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportRankingModifiers_1.ExecutionReportRankingModifiers().build(this.results.results, this.results.rankingExpressions, this.bindings)];
                    case 3:
                        resolvedRankingModifiers = _a.sent();
                        container.append(resolvedRankingModifiers.container.el);
                        if (resolvedRankingModifiers.gridOptions) {
                            gridOptions.push(resolvedRankingModifiers.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportQueryOverrideSection_1.ExecutionReportQueryOverrideSection().build(this.results.executionReport)];
                    case 4:
                        queryParamOverrideSection = _a.sent();
                        container.append(queryParamOverrideSection.container.el);
                        if (queryParamOverrideSection.gridOptions) {
                            gridOptions.push(queryParamOverrideSection.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportSimpleSection_1.ExecutionReportSimpleSection(EXECUTION_REPORT_SECTION.PREPROCESS_QUERY_EXPRESSION, EXECUTION_REPORT_SECTION.THESAURUS, 'Thesaurus').build(this.results.executionReport)];
                    case 5:
                        thesaurusSection = _a.sent();
                        container.append(thesaurusSection.container.el);
                        if (thesaurusSection.gridOptions) {
                            gridOptions.push(thesaurusSection.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportSimpleSection_1.ExecutionReportSimpleSection(EXECUTION_REPORT_SECTION.PREPROCESS_QUERY_EXPRESSION, EXECUTION_REPORT_SECTION.STOP_WORDS, 'Stop words').build(this.results.executionReport)];
                    case 6:
                        stopWordsSection = _a.sent();
                        container.append(stopWordsSection.container.el);
                        if (stopWordsSection.gridOptions) {
                            gridOptions.push(stopWordsSection.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportSimpleSection_1.ExecutionReportSimpleSection(EXECUTION_REPORT_SECTION.PREPROCESS_QUERY, EXECUTION_REPORT_SECTION.FILTERS, 'Filters').build(this.results.executionReport)];
                    case 7:
                        filtersSection = _a.sent();
                        container.append(filtersSection.container.el);
                        if (filtersSection.gridOptions) {
                            gridOptions.push(filtersSection.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportSimpleSection_1.ExecutionReportSimpleSection(EXECUTION_REPORT_SECTION.PREPROCESS_QUERY, EXECUTION_REPORT_SECTION.RANKING, 'Ranking').build(this.results.executionReport)];
                    case 8:
                        rankingSection = _a.sent();
                        container.append(rankingSection.container.el);
                        if (rankingSection.gridOptions) {
                            gridOptions.push(rankingSection.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportSimpleSection_1.ExecutionReportSimpleSection(EXECUTION_REPORT_SECTION.PREPROCESS_QUERY, EXECUTION_REPORT_SECTION.TOP_RESULT, 'Featured Results').build(this.results.executionReport)];
                    case 9:
                        topResultsSection = _a.sent();
                        container.append(topResultsSection.container.el);
                        if (topResultsSection.gridOptions) {
                            gridOptions.push(topResultsSection.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportITDSection_1.ExecutionReportITDSection().build(this.results.executionReport)];
                    case 10:
                        itdSection = _a.sent();
                        container.append(itdSection.container.el);
                        if (itdSection.gridOptions) {
                            gridOptions.push(itdSection.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportSimpleSection_1.ExecutionReportSimpleSection(EXECUTION_REPORT_SECTION.PREPROCESS_QUERY, EXECUTION_REPORT_SECTION.RANKING_WEIGHT, 'Ranking weights').build(this.results.executionReport)];
                    case 11:
                        rankingWeightsSection = _a.sent();
                        container.append(rankingWeightsSection.container.el);
                        if (rankingWeightsSection.gridOptions) {
                            gridOptions.push(rankingWeightsSection.gridOptions);
                        }
                        return [4 /*yield*/, new ExecutionReportEffectiveIndexQuerySection_1.ExecutionReportEffectiveIndexQuerySection().build(this.results.executionReport)];
                    case 12:
                        indexQuerySection = _a.sent();
                        container.append(indexQuerySection.container.el);
                        this.gridOptions = {
                            api: {
                                sizeColumnsToFit: function () {
                                    gridOptions.forEach(function (option) { return (option.api ? option.api.sizeColumnsToFit() : null); });
                                }
                            }
                        };
                        return [2 /*return*/, container];
                }
            });
        });
    };
    return ExecutionReport;
}());
exports.ExecutionReport = ExecutionReport;


/***/ }),

/***/ 336:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TableBuilder_1 = __webpack_require__(334);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var defaultNullOutput = '-- NULL --';
var GenericValueOutput = /** @class */ (function () {
    function GenericValueOutput() {
    }
    GenericValueOutput.prototype.output = function (section) {
        if (underscore_1.isArray(section)) {
            return this.arrayJoined(section);
        }
        if (underscore_1.isObject(section)) {
            return this.objectJoined(section);
        }
        return this.simpleValue(section);
    };
    GenericValueOutput.prototype.simpleValue = function (section) {
        return {
            content: this.valueOrNullOutput(section)
        };
    };
    GenericValueOutput.prototype.objectJoined = function (section) {
        var _this = this;
        var content = '';
        underscore_1.each(section, function (value, key) {
            if (underscore_1.isArray(value)) {
                var list = Dom_1.$$('dl');
                list.append(Dom_1.$$('dt', undefined, key).el);
                var innerList = Dom_1.$$('dd', undefined, _this.arrayJoined(value).content);
                list.append(innerList.el);
                content += list.el.outerHTML;
            }
            else if (underscore_1.isObject(value)) {
                content += _this.objectJoined(value).content;
            }
            else {
                var list = Dom_1.$$('dl');
                list.append(Dom_1.$$('dt', undefined, key).el);
                list.append(Dom_1.$$('dd', undefined, _this.valueOrNullOutput(value)).el);
                content += list.el.outerHTML;
            }
        });
        return {
            content: content,
            cellRenderer: TableBuilder_1.GenericHtmlRenderer
        };
    };
    GenericValueOutput.prototype.arrayJoined = function (section) {
        var _this = this;
        if (!section || section.length == 0) {
            return {
                content: defaultNullOutput
            };
        }
        var list = Dom_1.$$('ul', {
            className: 'relevance-inspector-list-output'
        });
        section.forEach(function (sectionValue) {
            if (underscore_1.isObject(sectionValue)) {
                list.append(Dom_1.$$('li', undefined, _this.objectJoined(sectionValue).content).el);
            }
            else {
                list.append(Dom_1.$$('li', undefined, _this.valueOrNullOutput(sectionValue)).el);
            }
        });
        return {
            content: list.el.outerHTML,
            cellRenderer: TableBuilder_1.GenericHtmlRenderer
        };
    };
    GenericValueOutput.prototype.valueOrNullOutput = function (value) {
        if (value != null && value !== '') {
            return value.toString();
        }
        return defaultNullOutput;
    };
    return GenericValueOutput;
}());
exports.GenericValueOutput = GenericValueOutput;


/***/ }),

/***/ 337:
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
var GenericValueOutput_1 = __webpack_require__(336);
var ExecutionReportGenericSection = /** @class */ (function () {
    function ExecutionReportGenericSection() {
    }
    ExecutionReportGenericSection.prototype.build = function (executionReportSection) {
        return __assign({}, this.descriptionSection(executionReportSection), this.durationSection(executionReportSection));
    };
    ExecutionReportGenericSection.prototype.descriptionSection = function (executionReportSection) {
        return {
            Description: new GenericValueOutput_1.GenericValueOutput().output(executionReportSection.description)
        };
    };
    ExecutionReportGenericSection.prototype.durationSection = function (executionReportSection) {
        return {
            Duration: new GenericValueOutput_1.GenericValueOutput().output(executionReportSection.duration + " ms")
        };
    };
    return ExecutionReportGenericSection;
}());
exports.ExecutionReportGenericSection = ExecutionReportGenericSection;


/***/ }),

/***/ 338:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var StringUtils_1 = __webpack_require__(20);
var Dom_1 = __webpack_require__(1);
exports.buildListOfTermsElement = function (weightPerTerm) {
    var listItems = underscore_1.map(weightPerTerm, function (value, key) {
        return {
            dt: Dom_1.$$('dt', {
                className: 'coveo-relevance-inspector-dt'
            }, "" + key),
            dd: Dom_1.$$('dd', {
                className: 'coveo-relevance-inspector-dd'
            }, "" + value)
        };
    });
    var total = underscore_1.reduce(weightPerTerm, function (memo, value) { return memo + value; }, 0);
    var list = Dom_1.$$('dl');
    listItems.forEach(function (item) {
        list.append(item.dt.el);
        list.append(item.dd.el);
    });
    list.append(Dom_1.$$('dt', { className: 'coveo-relevance-inspector-dt' }, "Total").el);
    list.append(Dom_1.$$('dd', { className: 'coveo-relevance-inspector-dd coveo-relevance-inspector-highlight' }, "" + total).el);
    return list;
};
exports.parseRankingInfo = function (value) {
    var REGEX_EXTRACT_DOCUMENT_WEIGHTS = /Document weights:\n((?:.)*?)\n+/g;
    var REGEX_EXTRACT_TERMS_WEIGHTS = /Terms weights:\n((?:.|\n)*)\n+/g;
    var REGEX_EXTRACT_TOTAL_WEIGHTS = /Total weight: ([0-9]+)/g;
    if (value) {
        var docWeightsRegexResult = REGEX_EXTRACT_DOCUMENT_WEIGHTS.exec(value);
        var termsWeightRegexResult = REGEX_EXTRACT_TERMS_WEIGHTS.exec(value);
        var totalWeigthRegexResult = REGEX_EXTRACT_TOTAL_WEIGHTS.exec(value);
        var qreWeights = parseQREWeights(value);
        var documentWeights = parseWeights(docWeightsRegexResult ? docWeightsRegexResult[1] : null);
        var termsWeight = parseTermsWeights(termsWeightRegexResult);
        var totalWeight = totalWeigthRegexResult ? Number(totalWeigthRegexResult[1]) : null;
        return {
            documentWeights: documentWeights,
            termsWeight: termsWeight,
            totalWeight: totalWeight,
            qreWeights: qreWeights
        };
    }
    return null;
};
var parseWeights = function (value) {
    var REGEX_EXTRACT_LIST_OF_WEIGHTS = /(\w+(?:\s\w+)*): ([-0-9]+)/g;
    var REGEX_EXTRACT_WEIGHT_GROUP = /^(\w+(?:\s\w+)*): ([-0-9]+)$/;
    if (value) {
        var listOfWeight = value.match(REGEX_EXTRACT_LIST_OF_WEIGHTS);
        if (listOfWeight) {
            return underscore_1.object(listOfWeight.map(function (weight) {
                var weightGroup = weight.match(REGEX_EXTRACT_WEIGHT_GROUP);
                if (weightGroup) {
                    var weightAppliedOn = weightGroup[1];
                    var weightValue = weightGroup[2];
                    return [weightAppliedOn, Number(weightValue)];
                }
                return null;
            }));
        }
    }
    return null;
};
var parseTermsWeights = function (termsWeight) {
    var REGEX_EXTRACT_GROUP_OF_TERMS = /((?:[^:]+: [0-9]+, [0-9]+; )+)\n((?:\w+: [0-9]+; )+)/g;
    var REGEX_EXTRACT_SINGLE_TERM = /([^:]+): ([0-9]+), ([0-9]+); /g;
    if (termsWeight && termsWeight[1]) {
        var terms = StringUtils_1.StringUtils.match(termsWeight[1], REGEX_EXTRACT_GROUP_OF_TERMS);
        return underscore_1.object(underscore_1.map(terms, function (term) {
            var words = underscore_1.object(underscore_1.map(StringUtils_1.StringUtils.match(term[1], REGEX_EXTRACT_SINGLE_TERM), function (word) {
                return [
                    word[1],
                    {
                        Correlation: Number(word[2]),
                        'TF-IDF': Number(word[3])
                    }
                ];
            }));
            var weights = parseWeights(term[2]);
            return [
                underscore_1.keys(words).join(', '),
                {
                    terms: words,
                    Weights: weights
                }
            ];
        }));
    }
    return null;
};
var parseQREWeights = function (value) {
    var REGEX_EXTRACT_QRE_WEIGHTS = /(Expression:\s".*")\sScore:\s(?!0)([-0-9]+)\n+/g;
    var qreWeightsRegexResult = REGEX_EXTRACT_QRE_WEIGHTS.exec(value);
    var qreWeights = [];
    while (qreWeightsRegexResult) {
        qreWeights.push({
            expression: qreWeightsRegexResult[1],
            score: parseInt(qreWeightsRegexResult[2], 10)
        });
        qreWeightsRegexResult = REGEX_EXTRACT_QRE_WEIGHTS.exec(value);
    }
    return qreWeights;
};


/***/ }),

/***/ 339:
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
var ExecutionReport_1 = __webpack_require__(335);
var underscore_1 = __webpack_require__(0);
var ExecutionReportGenericSection_1 = __webpack_require__(337);
var GenericValueOutput_1 = __webpack_require__(336);
var TableBuilder_1 = __webpack_require__(334);
var ExecutionReportSimpleSection = /** @class */ (function () {
    function ExecutionReportSimpleSection(topLevelProperty, secondLevelProperty, sectionTitle) {
        this.topLevelProperty = topLevelProperty;
        this.secondLevelProperty = secondLevelProperty;
        this.sectionTitle = sectionTitle;
    }
    ExecutionReportSimpleSection.prototype.build = function (executionReport) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, container, agGridElement, gridOptions, topLevelProperty, secondLevelProperty, dataSource, tableBuilder, tableBuilder, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = ExecutionReport_1.ExecutionReport.standardSectionHeader(this.sectionTitle), container = _a.container, agGridElement = _a.agGridElement;
                        topLevelProperty = underscore_1.find(executionReport.children, function (child) {
                            return child.name == _this.topLevelProperty && child.children && underscore_1.findWhere(child.children, { name: _this.secondLevelProperty });
                        });
                        if (!(topLevelProperty && topLevelProperty.children)) return [3 /*break*/, 3];
                        secondLevelProperty = underscore_1.findWhere(topLevelProperty.children, { name: this.secondLevelProperty });
                        if (!secondLevelProperty) return [3 /*break*/, 2];
                        dataSource = [
                            __assign({}, new ExecutionReportGenericSection_1.ExecutionReportGenericSection().build(secondLevelProperty), { Applied: new GenericValueOutput_1.GenericValueOutput().output(secondLevelProperty.applied) })
                        ];
                        return [4 /*yield*/, new TableBuilder_1.TableBuilder().build(dataSource, agGridElement)];
                    case 1:
                        tableBuilder = _c.sent();
                        gridOptions = tableBuilder.gridOptions;
                        _c.label = 2;
                    case 2: return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, new TableBuilder_1.TableBuilder().build([
                            (_b = {},
                                _b["" + this.sectionTitle] = {
                                    content: "NO DATA AVAILABLE FOR " + this.sectionTitle + " IN CURRENT EXECUTION REPORT"
                                },
                                _b)
                        ], agGridElement)];
                    case 4:
                        tableBuilder = _c.sent();
                        gridOptions = tableBuilder.gridOptions;
                        _c.label = 5;
                    case 5: return [2 /*return*/, { container: container, gridOptions: gridOptions }];
                }
            });
        });
    };
    return ExecutionReportSimpleSection;
}());
exports.ExecutionReportSimpleSection = ExecutionReportSimpleSection;


/***/ }),

/***/ 340:
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
var RankingInfoParser_1 = __webpack_require__(338);
var underscore_1 = __webpack_require__(0);
var TableBuilder_1 = __webpack_require__(334);
var Dom_1 = __webpack_require__(1);
var RankingInfoTable = /** @class */ (function () {
    function RankingInfoTable(results, bindings) {
        this.results = results;
        this.bindings = bindings;
    }
    RankingInfoTable.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var container, agGridElement, topLevelInfoThatHaveAtLeastANonZeroValue, containsKeywordRankingInfo, data, gridOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = Dom_1.$$('div');
                        agGridElement = Dom_1.$$('div', {
                            className: 'ag-theme-fresh'
                        });
                        container.append(agGridElement.el);
                        topLevelInfoThatHaveAtLeastANonZeroValue = [];
                        containsKeywordRankingInfo = false;
                        this.results.forEach(function (result) {
                            var rankingInfo = RankingInfoParser_1.parseRankingInfo(result.rankingInfo);
                            containsKeywordRankingInfo = rankingInfo.termsWeight != null;
                            if (rankingInfo && rankingInfo.documentWeights) {
                                underscore_1.each(rankingInfo.documentWeights, function (value, key) {
                                    if (value != 0) {
                                        topLevelInfoThatHaveAtLeastANonZeroValue.push(key);
                                    }
                                });
                            }
                        });
                        topLevelInfoThatHaveAtLeastANonZeroValue = underscore_1.uniq(topLevelInfoThatHaveAtLeastANonZeroValue);
                        data = this.results.map(function (result) {
                            var rankingInfo = RankingInfoParser_1.parseRankingInfo(result.rankingInfo);
                            if (rankingInfo) {
                                var documentsWeights = _this.buildTopLevelDocumentsWeights(rankingInfo, topLevelInfoThatHaveAtLeastANonZeroValue);
                                var breakdownPerTerm_1 = {};
                                var onlyTopFewKeywords_1 = {};
                                underscore_1.chain(rankingInfo.termsWeight)
                                    .keys()
                                    .sortBy(function (key) {
                                    var total = underscore_1.reduce(rankingInfo.termsWeight[key].Weights, function (memo, value) { return memo + value; }, 0);
                                    return total;
                                })
                                    .reverse()
                                    .first(3)
                                    .each(function (key) {
                                    onlyTopFewKeywords_1[key] = rankingInfo.termsWeight[key];
                                });
                                underscore_1.each(onlyTopFewKeywords_1, function (value, key) {
                                    var builtKey = "Keyword: " + key;
                                    breakdownPerTerm_1[builtKey] = {
                                        content: RankingInfoParser_1.buildListOfTermsElement(value.Weights).el.outerHTML,
                                        cellRenderer: TableBuilder_1.GenericHtmlRenderer,
                                        width: 200
                                    };
                                });
                                var totalContent = rankingInfo.totalWeight ? rankingInfo.totalWeight : 0;
                                return __assign({}, TableBuilder_1.TableBuilder.thumbnailCell(result, _this.bindings), documentsWeights, breakdownPerTerm_1, { Total: { content: totalContent || 0 } });
                            }
                            return {};
                        });
                        return [4 /*yield*/, new TableBuilder_1.TableBuilder().build(data, agGridElement, {
                                getRowHeight: function () {
                                    return containsKeywordRankingInfo ? 400 : 250;
                                },
                                onGridReady: function (params) {
                                    setTimeout(function () {
                                        if (params) {
                                            params.api.sizeColumnsToFit();
                                            params.api.setSortModel([{ colId: 'Total', sort: 'desc' }]);
                                        }
                                    }, 0);
                                }
                            })];
                    case 1:
                        gridOptions = (_a.sent()).gridOptions;
                        this.gridOptions = gridOptions;
                        return [2 /*return*/, container];
                }
            });
        });
    };
    RankingInfoTable.prototype.buildTopLevelDocumentsWeights = function (rankingInfo, hasAtLeastOneNonZeroValue) {
        var documentWeights = {};
        underscore_1.each(rankingInfo.documentWeights || {}, function (value, key) {
            if (underscore_1.contains(hasAtLeastOneNonZeroValue, key))
                documentWeights[key] = { content: value || 0 };
        });
        return documentWeights;
    };
    return RankingInfoTable;
}());
exports.RankingInfoTable = RankingInfoTable;


/***/ }),

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var isAgGridLoaded = false;
var isAgGridLoading = null;
var agGridLibUrl = 'https://cdnjs.cloudflare.com/ajax/libs/ag-grid/16.0.1/ag-grid.min.noStyle.js';
var agGridStyleBaseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/ag-grid/16.0.1/styles/ag-grid.css';
var agGridStyleFreshUrl = 'https://cdnjs.cloudflare.com/ajax/libs/ag-grid/16.0.1/styles/ag-theme-fresh.css';
// Should only be used for UT
exports.reset = function (doc) {
    if (doc === void 0) { doc = document; }
    isAgGridLoaded = false;
    isAgGridLoading = null;
};
exports.loadAgGridLibrary = function (doc) {
    if (doc === void 0) { doc = document; }
    return new Promise(function (resolve, reject) {
        if (isAgGridLoaded) {
            resolve(true);
        }
        else if (typeof agGrid !== 'undefined') {
            isAgGridLoaded = true;
            resolve(true);
        }
        else {
            addAgGridScriptsToDocument(doc);
            isAgGridLoading.then(function () { return resolve(true); });
            isAgGridLoading.catch(function () { return reject(false); });
        }
    });
};
var addAgGridScriptsToDocument = function (doc) {
    if (doc === void 0) { doc = document; }
    if (!isAgGridLoading) {
        var script_1 = Dom_1.$$('script', {
            src: agGridLibUrl,
            type: 'text/javascript',
            async: true
        }).el;
        var styleBase = Dom_1.$$('link', {
            href: agGridStyleBaseUrl,
            rel: 'stylesheet',
            type: 'text/css'
        }).el;
        var style = Dom_1.$$('link', {
            href: agGridStyleFreshUrl,
            rel: 'stylesheet',
            type: 'text/css'
        }).el;
        doc.head.appendChild(script_1);
        doc.head.appendChild(styleBase);
        doc.head.appendChild(style);
        isAgGridLoading = new Promise(function (resolveScriptLoaded, rejectScriptLoaded) {
            script_1.onload = function () {
                resolveScriptLoaded(true);
            };
            script_1.onerror = function () {
                isAgGridLoaded = false;
                rejectScriptLoaded(false);
            };
        });
    }
};


/***/ }),

/***/ 342:
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
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(14);
var ComponentOptionsModel_1 = __webpack_require__(23);
var AnalyticsActionListMeta_1 = __webpack_require__(11);
var ResultListEvents_1 = __webpack_require__(32);
var HighlightUtils_1 = __webpack_require__(83);
var DeviceUtils_1 = __webpack_require__(30);
var OSUtils_1 = __webpack_require__(122);
var Initialization_1 = __webpack_require__(12);
var QueryUtils_1 = __webpack_require__(22);
var Assert_1 = __webpack_require__(2);
var Utils_1 = __webpack_require__(3);
var Defer_1 = __webpack_require__(31);
var Dom_1 = __webpack_require__(1);
var StreamHighlightUtils_1 = __webpack_require__(118);
var StringUtils_1 = __webpack_require__(20);
var underscore_1 = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(21);
__webpack_require__(343);
var AccessibleButton_1 = __webpack_require__(124);
var ResultLinkCommon_1 = __webpack_require__(345);
/**
 * The `ResultLink` component automatically transform a search result title into a clickable link pointing to the
 * original item.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 */
var ResultLink = /** @class */ (function (_super) {
    __extends(ResultLink, _super);
    /**
     * Creates a new `ResultLink` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultLink` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     * @param os
     */
    function ResultLink(element, options, bindings, result, os) {
        var _this = _super.call(this, element, ResultLink.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.os = os;
        _this.logAnalytics = underscore_1.debounce(function () {
            _this.queryController.saveLastQuery();
            var documentURL = Dom_1.$$(_this.element).getAttribute('href');
            if (documentURL == undefined || documentURL == '') {
                documentURL = _this.escapedClickUri;
            }
            if (_this.options.logAnalytics) {
                _this.options.logAnalytics(documentURL);
            }
            else {
                _this.logDocumentOpen(documentURL);
            }
            Defer_1.Defer.flush();
        }, 1500, true);
        var globalOptions = _this.searchInterface.options.originalOptionsObject[ResultLink.ID] || {};
        var initialOptions = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultLink, __assign({}, globalOptions, options));
        var resultLinkOptions = _this.componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.resultLink);
        _this.options = underscore_1.extend({}, initialOptions, resultLinkOptions);
        _this.result = result || _this.resolveResult();
        if (_this.options.openQuickview == null) {
            _this.options.openQuickview = result.raw['connectortype'] == 'ExchangeCrawler' && DeviceUtils_1.DeviceUtils.isMobileDevice();
        }
        if (!_this.element.hasAttribute('tabindex')) {
            _this.element.setAttribute('tabindex', '0');
        }
        Assert_1.Assert.exists(_this.componentOptionsModel);
        Assert_1.Assert.exists(_this.result);
        if (!_this.quickviewShouldBeOpened()) {
            // Bind on multiple "click" or "mouse" events.
            // Create a function that will be executed only once, so as not to log multiple events
            // Once a result link has been opened, and that we log at least one analytics event,
            // it should not matter if the end user open the same link multiple times with different methods.
            // It's still only one "click" event as far as UA is concerned.
            // Also need to handle "longpress" on mobile (the contextual menu), which we assume to be 1 s long.
            ResultLinkCommon_1.bindAnalyticsToLink(element, function () { return _this.logAnalytics(); });
        }
        _this.renderUri(element, result);
        _this.bindEventToOpen();
        return _this;
    }
    ResultLink.prototype.renderUri = function (element, result) {
        if (/^\s*$/.test(this.element.innerHTML)) {
            var title = this.getDisplayedTitle();
            this.element.innerHTML = title;
            var titleAsText = this.getDisplayedTitleAsText();
            if (!this.element.hasAttribute('aria-label')) {
                this.element.setAttribute('aria-label', titleAsText);
            }
            if (!this.element.title) {
                this.element.title = titleAsText;
            }
        }
    };
    /**
     * Opens the result in the same window, no matter how the actual component is configured for the end user.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLink = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (logAnalytics) {
            this.logAnalytics();
        }
        window.location.href = this.getResultUri();
    };
    /**
     * Opens the result in a new window, no matter how the actual component is configured for the end user.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkInNewWindow = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (logAnalytics) {
            this.logAnalytics();
        }
        window.open(this.getResultUri(), '_blank');
    };
    /**
     * Tries to open the result in Microsoft Outlook if the result has an `outlookformacuri` or `outlookuri` field.
     *
     * Normally, this implies the result should be a link to an email.
     *
     * If the needed fields are not present, this method does nothing.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkInOutlook = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (this.hasOutlookField()) {
            if (logAnalytics) {
                this.logAnalytics();
            }
            this.openLink();
        }
    };
    /**
     * Opens the link in the same manner the end user would.
     *
     * This essentially simulates a click on the result link.
     *
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkAsConfigured = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (this.toExecuteOnOpen) {
            if (logAnalytics) {
                this.logAnalytics();
            }
            this.toExecuteOnOpen();
        }
    };
    ResultLink.prototype.bindEventToOpen = function () {
        return (this.bindOnClickIfNotUndefined() ||
            this.bindOpenQuickviewIfNotUndefined() ||
            this.setHrefIfNotAlready() ||
            this.openLinkThatIsNotAnAnchor());
    };
    ResultLink.prototype.getDisplayedTitle = function () {
        if (!this.options.titleTemplate) {
            return this.result.title
                ? HighlightUtils_1.HighlightUtils.highlightString(this.result.title, this.result.titleHighlights, null, 'coveo-highlight')
                : this.escapedClickUri;
        }
        else {
            var newTitle = StringUtils_1.StringUtils.buildStringTemplateFromResult(this.options.titleTemplate, this.result);
            return newTitle
                ? StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamText(newTitle, this.result.termsToHighlight, this.result.phrasesToHighlight)
                : this.escapedClickUri;
        }
    };
    ResultLink.prototype.getDisplayedTitleAsText = function () {
        var container = Dom_1.$$('div');
        container.setHtml(this.getDisplayedTitle());
        return container.text();
    };
    Object.defineProperty(ResultLink.prototype, "escapedClickUri", {
        get: function () {
            return underscore_1.escape(this.result.clickUri);
        },
        enumerable: true,
        configurable: true
    });
    ResultLink.prototype.bindOnClickIfNotUndefined = function () {
        var _this = this;
        if (this.options.onClick != undefined) {
            this.toExecuteOnOpen = function (e) {
                _this.options.onClick.call(_this, e, _this.result);
            };
            new AccessibleButton_1.AccessibleButton()
                .withElement(this.element)
                .withLabel(this.result.title)
                .withSelectAction(function (e) { return _this.toExecuteOnOpen(e); })
                .build();
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.bindOpenQuickviewIfNotUndefined = function () {
        var _this = this;
        if (this.quickviewShouldBeOpened()) {
            this.toExecuteOnOpen = function () {
                Dom_1.$$(_this.bindings.resultElement).trigger(ResultListEvents_1.ResultListEvents.openQuickview);
            };
            Dom_1.$$(this.element).on('click', function (e) {
                e.preventDefault();
                _this.toExecuteOnOpen();
            });
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.openLinkThatIsNotAnAnchor = function () {
        var _this = this;
        if (!this.elementIsAnAnchor()) {
            this.toExecuteOnOpen = function () {
                if (_this.options.alwaysOpenInNewWindow) {
                    if (_this.options.openInOutlook) {
                        _this.openLinkInOutlook();
                    }
                    else {
                        _this.openLinkInNewWindow();
                    }
                }
                else {
                    _this.openLink();
                }
            };
            Dom_1.$$(this.element).on('click', function () {
                _this.toExecuteOnOpen();
            });
            return true;
        }
        return false;
    };
    ResultLink.prototype.setHrefIfNotAlready = function () {
        // Do not erase any value put in href by the template, etc. Allows
        // using custom click urls while still keeping analytics recording
        // and other behavior brought by the component.
        if (this.elementIsAnAnchor() && !Utils_1.Utils.isNonEmptyString(Dom_1.$$(this.element).getAttribute('href'))) {
            Dom_1.$$(this.element).setAttribute('href', this.getResultUri());
            if (this.options.alwaysOpenInNewWindow && !(this.options.openInOutlook && this.hasOutlookField())) {
                Dom_1.$$(this.element).setAttribute('target', '_blank');
            }
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.logDocumentOpen = function (href) {
        this.usageAnalytics.logClickEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentOpen, {
            documentURL: href,
            documentTitle: this.result.title,
            author: Utils_1.Utils.getFieldValue(this.result, 'author')
        }, this.result, this.root);
    };
    ResultLink.prototype.filterProtocol = function (uri) {
        var isAbsolute = /^(https?|ftp|file|mailto|tel|sip):/i.test(uri);
        var isRelative = /^(\/|\.\/|\.\.\/)/.test(uri);
        return isAbsolute || isRelative ? uri : '';
    };
    ResultLink.prototype.getResultUri = function () {
        if (this.options.hrefTemplate) {
            var uri = StringUtils_1.StringUtils.buildStringTemplateFromResult(this.options.hrefTemplate, this.result);
            return this.filterProtocol(uri);
        }
        if (this.options.field == undefined && this.options.openInOutlook) {
            this.setField();
        }
        if (this.options.field != undefined) {
            return this.filterProtocol(Utils_1.Utils.getFieldValue(this.result, this.options.field));
        }
        return this.filterProtocol(this.result.clickUri);
    };
    ResultLink.prototype.elementIsAnAnchor = function () {
        return this.element.tagName == 'A';
    };
    ResultLink.prototype.setField = function () {
        var os = Utils_1.Utils.exists(this.os) ? this.os : OSUtils_1.OSUtils.get();
        if (os == OSUtils_1.OS_NAME.MACOSX && this.hasOutlookField()) {
            this.options.field = '@outlookformacuri';
        }
        else if (os == OSUtils_1.OS_NAME.WINDOWS && this.hasOutlookField()) {
            this.options.field = '@outlookuri';
        }
    };
    ResultLink.prototype.hasOutlookField = function () {
        var os = Utils_1.Utils.exists(this.os) ? this.os : OSUtils_1.OSUtils.get();
        if (os == OSUtils_1.OS_NAME.MACOSX && this.result.raw['outlookformacuri'] != undefined) {
            return true;
        }
        else if (os == OSUtils_1.OS_NAME.WINDOWS && this.result.raw['outlookuri'] != undefined) {
            return true;
        }
        return false;
    };
    ResultLink.prototype.isUriThatMustBeOpenedInQuickview = function () {
        return this.escapedClickUri.toLowerCase().indexOf('ldap://') == 0;
    };
    ResultLink.prototype.quickviewShouldBeOpened = function () {
        return (this.options.openQuickview || this.isUriThatMustBeOpenedInQuickview()) && QueryUtils_1.QueryUtils.hasHTMLVersion(this.result);
    };
    ResultLink.ID = 'ResultLink';
    ResultLink.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultLink: ResultLink
        });
    };
    /**
     * The options for the ResultLink
     * @componentOptions
     */
    ResultLink.options = {
        /**
         * Specifies the field to use to output the component `href` attribute value.
         *
         * **Tip:**
         * > Instead of specifying a value for the `field` option, you can directly add an `href` attribute to the
         * > `ResultLink` HTML element. Then, you can use a custom script to generate the `href` value.
         *
         * **Examples:**
         * - With the following markup, the `ResultLink` outputs its `href` value using the `@uri` field (rather than the
         * default field):
         *
         * ```html
         * <a class="CoveoResultLink" data-field="@uri"></a>
         * ```
         *
         * - In the following result template, the custom `getMyKBUri()` function provides the `href` value:
         *
         * ```html
         * <script id="KnowledgeArticle" type="text/underscore" class="result-template">
         *   <div class='CoveoIcon>'></div>
         *   <a class="CoveoResultLink" href="<%= getMyKBUri(raw) %>"></a>
         *   <div class="CoveoExcerpt"></div>
         * </script>
         * ```
         *
         * See also [`hrefTemplate`]{@link ResultLink.options.hrefTemplate}, which can override this option.
         *
         * By default, the component uses the `@clickUri` field of the item to output the value of its `href` attribute.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption(),
        /**
         * Specifies whether the component should try to open its link in Microsoft Outlook.
         *
         * Setting this option to `true` is normally useful for `ResultLink` instances related to Microsoft Exchange emails.
         *
         * If this option is `true`, clicking the `ResultLink` calls the
         * [`openLinkInOutlook`]{@link ResultLink.openLinkInOutlook} method instead of the
         * [`openLink`]{@link ResultLink.openLink} method.
         *
         * Default value is `false`.
         */
        openInOutlook: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies whether the component should open its link in the [`Quickview`]{@link Quickview} component rather than
         * loading through the original URL.
         *
         * Default value is `false`.
         */
        openQuickview: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies whether the component should open its link in a new window instead of opening it in the current
         * context.
         *
         * If this option is `true`, clicking the `ResultLink` calls the
         * [`openLinkInNewWindow`]{@link ResultLink.openLinkInNewWindow} method instead of the
         * [`openLink`]{@link ResultLink.openLink} method.
         *
         * **Note:**
         * > If a search page contains a [`ResultPreferences`]{@link ResultsPreferences} component whose
         * > [`enableOpenInNewWindow`]{@link ResultsPreferences.options.enableOpenInNewWindow} option is `true`, and the end
         * > user checks the <b>Always open results in new window</b> box, `ResultLink` components in this page will always
         * > open their links in a new window when the end user clicks them, no matter what the value of their
         * > `alwaysOpenInNewWindow` option is.
         *
         * Default value is `false`.
         */
        alwaysOpenInNewWindow: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies a template literal from which to generate the `ResultLink` `href` attribute value (see
         * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
         *
         * This option overrides the [`field`]{@link ResultLink.options.field} option value.
         *
         * The template literal can reference any number of fields from the parent result. It can also reference global
         * scope properties.
         *
         * **Examples:**
         *
         * - The following markup generates an `href` value such as `http://uri.com?id=itemTitle`:
         *
         * ```html
         * <a class='CoveoResultLink' data-href-template='${clickUri}?id=${raw.title}'></a>
         * ```
         *
         * - The following markup generates an `href` value such as `localhost/fooBar`:
         *
         * ```html
         * <a class='CoveoResultLink' data-href-template='${window.location.hostname}/{Foo.Bar}'></a>
         * ```
         *
         * Default value is `undefined`.
         */
        hrefTemplate: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies a template literal from which to generate the `ResultLink` display title (see
         * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
         *
         * This option overrides the default `ResultLink` display title behavior.
         *
         * The template literal can reference any number of fields from the parent result. However, if the template literal
         * references a key whose value is undefined in the parent result fields, the `ResultLink` title displays the
         * name of this key instead.
         *
         * This option is ignored if the `ResultLink` innerHTML contains any value.
         *
         * **Examples:**
         *
         * - The following markup generates a `ResultLink` display title such as `Case number: 123456` if both the
         * `raw.objecttype` and `raw.objectnumber` keys are defined in the parent result fields:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${raw.objecttype} number: ${raw.objectnumber}"></a>
         * ```
         *
         * - The following markup generates `${myField}` as a `ResultLink` display title if the `myField` key is undefined
         * in the parent result fields:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${myField}"></a>
         * ```
         *
         * - The following markup generates `Foobar` as a `ResultLink` display title, because the `ResultLink` innterHTML is
         * not empty:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${will} ${be} ${ignored}">Foobar</a>
         * ```
         *
         * Default value is `undefined`.
         *
         * @availablesince [January 2017 Release (v1.1865.9)](https://docs.coveo.com/en/396/#january-2017-release-v118659)
         */
        titleTemplate: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies an event handler function to execute when the user clicks the `ResultLink` component.
         *
         * The handler function takes a JavaScript [`Event`](https://developer.mozilla.org/en/docs/Web/API/Event) object and
         * an [`IQueryResult`]{@link IQueryResult} as its parameters.
         *
         * Overriding the default behavior of the `onClick` event can allow you to execute specific code instead.
         *
         * **Note:**
         * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
         * > [`init`]{@link init} call of your search interface (see
         * > [Passing Component Options in the init Call](https://docs.coveo.com/en/346/#passing-component-options-in-the-init-call)),
         * > or before the `init` call, using the `options` top-level function (see
         * > [Passing Component Options Before the init Call](https://docs.coveo.com/en/346/#passing-component-options-before-the-init-call)).
         *
         * **Example:**
         * ```javascript
         * // You can set the option in the 'init' call:
         * Coveo.init(document.querySelector("#search"), {
         *   ResultLink : {
         *     onClick : function(e, result) {
         *       e.preventDefault();
         *       // Custom code to execute with the item URI and title.
         *       openUriInASpecialTab(result.clickUri, result.title);
         *     }
         *   }
         * });
         *
         * // Or before the 'init' call, using the 'options' top-level function:
         * // Coveo.options(document.querySelector('#search'), {
         * //   ResultLink : {
         * //     onClick : function(e, result) {
         * //       e.preventDefault();
         * //       // Custom code to execute with the item URI and title.
         * //       openUriInASpecialTab(result.clickUri, result.title);
         * //     }
         * //   }
         * // });
         * ```
         */
        onClick: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        }),
        /**
         * Specify this option to log additional analytics when this result link is pressed.
         *
         * **Example:**
         * ```javascript
         * const resultLink = new Coveo.ResultLink(
         *   linkElement,
         *   {
         *     logAnalytics: (href) => Coveo.logCustomEvent(
         *         Coveo.analyticsActionCauseList.openSmartSnippetSource,
         *         {
         *           searchQueryUid: searchInterface.queryController.lastSearchUid,
         *           documentTitle: result.title,
         *           author: Utils.getFieldValue(result, 'author'),
         *           documentURL: href
         *         },
         *         element
         *       )
         *   },
         *   searchInterface.getBindings(),
         *   result
         * )
         * ```
         */
        logAnalytics: ComponentOptions_1.ComponentOptions.buildCustomOption(function () { return null; })
    };
    return ResultLink;
}(Component_1.Component));
exports.ResultLink = ResultLink;
Initialization_1.Initialization.registerAutoCreateComponent(ResultLink);


/***/ }),

/***/ 343:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(344);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(333)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/string-replace-loader/index.js??ref--0-2!../node_modules/css-loader/index.js??ref--0-3!../node_modules/resolve-url-loader/index.js??ref--0-4!../node_modules/sass-loader/dist/cjs.js??ref--0-5!./_ResultLink.scss", function() {
			var newContent = require("!!../node_modules/string-replace-loader/index.js??ref--0-2!../node_modules/css-loader/index.js??ref--0-3!../node_modules/resolve-url-loader/index.js??ref--0-4!../node_modules/sass-loader/dist/cjs.js??ref--0-5!./_ResultLink.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 344:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(332)();
// imports


// module
exports.push([module.i, ".CoveoResultLink,\na.CoveoResultLink,\n.CoveoResult a.CoveoResultLink {\n  color: #0059b3;\n  text-decoration: none;\n  cursor: pointer;\n  word-wrap: break-word;\n}\n\n.CoveoResultLink:visited,\n.CoveoResultLink:visited:hover,\na.CoveoResultLink:visited,\na.CoveoResultLink:visited:hover,\n.CoveoResult a.CoveoResultLink:visited,\n.CoveoResult a.CoveoResultLink:visited:hover {\n  color: #609;\n}\n\n.CoveoResultLink:hover,\n.CoveoResultLink:hover a,\n.CoveoResultLink:focus,\n.CoveoResultLink:focus a,\na.CoveoResultLink:hover,\na.CoveoResultLink:hover a,\na.CoveoResultLink:focus,\na.CoveoResultLink:focus a,\n.CoveoResult a.CoveoResultLink:hover,\n.CoveoResult a.CoveoResultLink:hover a,\n.CoveoResult a.CoveoResultLink:focus,\n.CoveoResult a.CoveoResultLink:focus a {\n  text-decoration: underline;\n}\n\n.CoveoResultLink.coveo-selected *,\na.CoveoResultLink.coveo-selected *,\n.CoveoResult a.CoveoResultLink.coveo-selected * {\n  color: #0059b3;\n}\n\n.coveo-card-overlay a.CoveoResultLink {\n  color: #0059b3;\n  text-decoration: none;\n  cursor: pointer;\n  color: #f7f8f9;\n  text-decoration: underline;\n}\n\n.coveo-card-overlay a.CoveoResultLink:visited,\n.coveo-card-overlay a.CoveoResultLink:visited:hover {\n  color: #609;\n  color: #f7f8f9;\n}\n\n.coveo-card-overlay a.CoveoResultLink:hover,\n.coveo-card-overlay a.CoveoResultLink:hover a,\n.coveo-card-overlay a.CoveoResultLink:focus,\n.coveo-card-overlay a.CoveoResultLink:focus a {\n  text-decoration: underline;\n}\n\n.coveo-card-overlay a.CoveoResultLink.coveo-selected * {\n  color: #0059b3;\n  color: #f7f8f9;\n}\n\n", ""]);

// exports


/***/ }),

/***/ 345:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
function bindAnalyticsToLink(element, logAnalytics) {
    var executeOnlyOnce = underscore_1.once(function () { return logAnalytics(); });
    Dom_1.$$(element).on(['contextmenu', 'click', 'mousedown', 'mouseup'], executeOnlyOnce);
    var longPressTimer;
    Dom_1.$$(element).on('touchstart', function () {
        longPressTimer = window.setTimeout(executeOnlyOnce, 1000);
    });
    Dom_1.$$(element).on('touchend', function () {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
        }
    });
}
exports.bindAnalyticsToLink = bindAnalyticsToLink;


/***/ }),

/***/ 346:
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
var TableBuilder_1 = __webpack_require__(334);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var StringUtils_1 = __webpack_require__(20);
var DateUtils_1 = __webpack_require__(57);
var TextInput_1 = __webpack_require__(119);
var MetaDataTable = /** @class */ (function () {
    function MetaDataTable(results, bindings) {
        this.results = results;
        this.bindings = bindings;
    }
    MetaDataTable.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var fieldsDescription, container, builders, builtTables, textInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.bindings.queryController) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.bindings.queryController.getEndpoint().listFields()];
                    case 1:
                        fieldsDescription = _a.sent();
                        container = Dom_1.$$('div', {
                            className: 'metadata-table'
                        });
                        builders = this.results.map(function (result) { return __awaiter(_this, void 0, void 0, function () {
                            var nestedContainer, nestedAgGrid, thumbnail, fields;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        nestedContainer = Dom_1.$$('div');
                                        container.append(nestedContainer.el);
                                        nestedAgGrid = Dom_1.$$('div', {
                                            className: 'ag-theme-fresh'
                                        });
                                        nestedContainer.append(nestedAgGrid.el);
                                        thumbnail = TableBuilder_1.TableBuilder.thumbnailCell(result, this.bindings);
                                        fields = {};
                                        fields["Fields Values"] = {
                                            content: { result: result, fieldsDescription: fieldsDescription },
                                            cellRenderer: FieldValuesRenderer,
                                            width: 900,
                                            getQuickFilterText: function (params) {
                                                var allValues = underscore_1.map(params.value.result.raw, function (val) { return val.toString(); });
                                                return Object.keys(params.value.result.raw)
                                                    .concat(allValues)
                                                    .join(' ');
                                            },
                                            onCellDoubleClicked: function (params) {
                                                var el = params.event ? params.event.target : null;
                                                if (el && window.getSelection && document.createRange) {
                                                    var selection = window.getSelection();
                                                    var range = document.createRange();
                                                    range.selectNodeContents(el);
                                                    selection.removeAllRanges();
                                                    selection.addRange(range);
                                                }
                                            }
                                        };
                                        return [4 /*yield*/, new TableBuilder_1.TableBuilder().build([
                                                __assign({}, thumbnail, fields)
                                            ], nestedAgGrid, {
                                                rowHeight: 400
                                            })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); });
                        this.gridOptions = {
                            api: {
                                sizeColumnsToFit: function () {
                                    builtTables.forEach(function (built) { return (built.gridOptions.api ? built.gridOptions.api.sizeColumnsToFit : null); });
                                }
                            }
                        };
                        return [4 /*yield*/, Promise.all(builders)];
                    case 2:
                        builtTables = _a.sent();
                        textInput = new TextInput_1.TextInput(function (input) {
                            builtTables.forEach(function (built) {
                                var api = built.gridOptions && built.gridOptions.api;
                                if (api) {
                                    api.setQuickFilter(input.getValue());
                                    api.onRowHeightChanged();
                                }
                            });
                        }, 'Filters on Fields Values');
                        container.prepend(textInput.getElement());
                        return [2 /*return*/, container];
                }
            });
        });
    };
    return MetaDataTable;
}());
exports.MetaDataTable = MetaDataTable;
var FieldValuesRenderer = /** @class */ (function () {
    function FieldValuesRenderer() {
    }
    FieldValuesRenderer.prototype.init = function (params) {
        this.element = params.value;
        this.params = params;
        this.currentFilter = params.api.filterManager.quickFilter;
        params.value.el = this.listAsInput(this.element.result);
    };
    FieldValuesRenderer.prototype.getGui = function () {
        if (this.element) {
            var list = this.listAsInput(this.element.result);
            this.params.eParentOfValue.appendChild(list.el);
            var height = Math.max(list.height() + 50, 200);
            var maxHeight = Math.min(height, 5000);
            this.params.node.setRowHeight(maxHeight);
            return Dom_1.$$('div', undefined, list).el;
        }
        return Dom_1.$$('div', undefined, 'N.A').el;
    };
    FieldValuesRenderer.prototype.listAsInput = function (result) {
        var _this = this;
        var container = Dom_1.$$('div');
        underscore_1.each(result.raw, function (value, fieldInResult) {
            if (fieldInResult == 'allmetadatavalues' || fieldInResult.indexOf('sys') == 0) {
                return;
            }
            if (_this.isCurrentElementFilteredOut(value, fieldInResult)) {
                return;
            }
            var inputGroup = Dom_1.$$('div', { className: 'coveo-relevance-inspector-input-group' });
            var fieldName = Dom_1.$$('div', {
                className: 'coveo-relevance-inspector-metadata-name'
            }, fieldInResult);
            var fieldValue = _this.convertFieldValueToReadableFormat(result, fieldInResult);
            var fieldValueElement = Dom_1.$$('div', {
                className: 'coveo-relevance-inspector-metadata-value'
            }, fieldValue);
            if (_this.currentFilter) {
                _this.highlightSearch(fieldName.el, _this.currentFilter);
                _this.highlightSearch(fieldValueElement.el, _this.currentFilter);
            }
            inputGroup.append(fieldName.el);
            inputGroup.append(fieldValueElement.el);
            container.append(inputGroup.el);
        });
        return container;
    };
    FieldValuesRenderer.prototype.isCurrentElementFilteredOut = function (value, fieldInResult) {
        if (this.currentFilter) {
            var matchInFieldName = fieldInResult.toLowerCase().indexOf(this.currentFilter.toLowerCase()) != -1;
            var matchInFieldValue = value
                ? value
                    .toString()
                    .toLowerCase()
                    .indexOf(this.currentFilter.toLowerCase()) != -1
                : false;
            if (!matchInFieldName && !matchInFieldValue) {
                return true;
            }
        }
        return false;
    };
    FieldValuesRenderer.prototype.convertFieldValueToReadableFormat = function (result, fieldInResult) {
        var fieldValue = result.raw[fieldInResult].toString();
        if (this.element.fieldsDescription) {
            var matchingFieldDescription = underscore_1.find(this.element.fieldsDescription, function (description) {
                return description.name.replace('@', '').toLowerCase() == fieldInResult;
            });
            if (matchingFieldDescription && matchingFieldDescription.fieldType == 'Date') {
                fieldValue = DateUtils_1.DateUtils.convertToStandardDate(fieldValue).toString() + " ( Epoch : " + fieldValue + " )";
            }
        }
        return fieldValue;
    };
    FieldValuesRenderer.prototype.highlightSearch = function (elementToSearch, search) {
        var asHTMLElement = elementToSearch;
        if (asHTMLElement != null && asHTMLElement.innerText != null) {
            var match = asHTMLElement.innerText.split(new RegExp('(?=' + StringUtils_1.StringUtils.regexEncode(search) + ')', 'gi'));
            asHTMLElement.innerHTML = '';
            match.forEach(function (value) {
                var regex = new RegExp('(' + StringUtils_1.StringUtils.regexEncode(search) + ')', 'i');
                var group = value.match(regex);
                var span;
                if (group != null) {
                    span = Dom_1.$$('span', {
                        className: 'coveo-relevance-inspector-highlight'
                    });
                    span.text(group[1]);
                    asHTMLElement.appendChild(span.el);
                    span = Dom_1.$$('span');
                    span.text(value.substr(group[1].length));
                    asHTMLElement.appendChild(span.el);
                }
                else {
                    span = Dom_1.$$('span');
                    span.text(value);
                    asHTMLElement.appendChild(span.el);
                }
            });
        }
    };
    FieldValuesRenderer.prototype.refresh = function (params) {
        return true;
    };
    return FieldValuesRenderer;
}());
exports.FieldValuesRenderer = FieldValuesRenderer;


/***/ }),

/***/ 347:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var RelevanceInspectorTabs = /** @class */ (function () {
    function RelevanceInspectorTabs(onTabChange) {
        this.onTabChange = onTabChange;
        this.navigationSection = Dom_1.$$('div', {
            className: 'coveo-relevance-inspector-tab-navigation-section'
        });
        this.tabContentSection = Dom_1.$$('div', {
            className: 'coveo-relevance-inspector-tab-content-section'
        });
        this.navigationElements = [];
        this.tabContentElements = [];
    }
    RelevanceInspectorTabs.prototype.select = function (id) {
        var navElementToActivate = this.findNavigationById(id);
        var tabContentToActivate = this.findTabContentById(id);
        if (navElementToActivate && tabContentToActivate) {
            this.activateTabNavigation(navElementToActivate);
            this.activateTabContent(tabContentToActivate);
            if (this.onTabChange) {
                this.onTabChange(id);
            }
        }
    };
    RelevanceInspectorTabs.prototype.addNavigation = function (caption, id) {
        var _this = this;
        var navigationElement = Dom_1.$$('div', {
            id: id,
            className: 'coveo-relevance-inspector-tab'
        }, caption);
        navigationElement.on('click', function () { return _this.select(id); });
        this.navigationElements.push(navigationElement);
        this.navigationSection.append(navigationElement.el);
        return this;
    };
    RelevanceInspectorTabs.prototype.addContent = function (content, targetId) {
        var tabContent = Dom_1.$$('div', {
            className: 'coveo-relevance-inspector-tab-content',
            'data-target-tab': targetId
        });
        tabContent.append(content.el);
        this.tabContentElements.push(tabContent);
        this.tabContentSection.append(tabContent.el);
        return this;
    };
    RelevanceInspectorTabs.prototype.addSection = function (caption, content, id) {
        return this.addNavigation(caption, id).addContent(content, id);
    };
    RelevanceInspectorTabs.prototype.findNavigationById = function (id) {
        return underscore_1.find(this.navigationElements, function (element) { return element.getAttribute('id') == id; });
    };
    RelevanceInspectorTabs.prototype.findTabContentById = function (id) {
        return underscore_1.find(this.tabContentElements, function (tabContentElement) { return tabContentElement.getAttribute('data-target-tab') == id; });
    };
    RelevanceInspectorTabs.prototype.activateTabNavigation = function (navigationElement) {
        this.navigationElements.forEach(function (element) {
            element.removeClass('coveo-selected');
        });
        navigationElement.addClass('coveo-selected');
    };
    RelevanceInspectorTabs.prototype.activateTabContent = function (contentElement) {
        this.tabContentElements.forEach(function (element) {
            element.removeClass('coveo-selected');
        });
        contentElement.addClass('coveo-selected');
    };
    return RelevanceInspectorTabs;
}());
exports.RelevanceInspectorTabs = RelevanceInspectorTabs;


/***/ }),

/***/ 348:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(349);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(333)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/string-replace-loader/index.js??ref--0-2!../node_modules/css-loader/index.js??ref--0-3!../node_modules/resolve-url-loader/index.js??ref--0-4!../node_modules/sass-loader/dist/cjs.js??ref--0-5!./_RelevanceInspector.scss", function() {
			var newContent = require("!!../node_modules/string-replace-loader/index.js??ref--0-2!../node_modules/css-loader/index.js??ref--0-3!../node_modules/resolve-url-loader/index.js??ref--0-4!../node_modules/sass-loader/dist/cjs.js??ref--0-5!./_RelevanceInspector.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 349:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(332)();
// imports


// module
exports.push([module.i, "@-webkit-keyframes fadeout {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n@-moz-keyframes fadeout {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n@-o-keyframes fadeout {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n@keyframes fadeout {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n@-webkit-keyframes fadein {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@-moz-keyframes fadein {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@-o-keyframes fadein {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes fadein {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes slideInLeft {\n  0% {\n    -webkit-transform: translateX(-2000px);\n    -moz-transform: translateX(-2000px);\n    -ms-transform: translateX(-2000px);\n    -o-transform: translateX(-2000px);\n    transform: translateX(-2000px);\n    opacity: 0;\n  }\n\n  100% {\n    -webkit-transform: translateX(0);\n    -moz-transform: translateX(0);\n    -ms-transform: translateX(0);\n    -o-transform: translateX(0);\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes coveo-spin {\n  from {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@-moz-keyframes coveo-spin {\n  from {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@-o-keyframes coveo-spin {\n  from {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes coveo-spin {\n  from {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes loadingFade {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: .8;\n  }\n\n  100% {\n    opacity: 0;\n  }\n}\n\n@-moz-keyframes loadingFade {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: .8;\n  }\n\n  100% {\n    opacity: 0;\n  }\n}\n\n@-o-keyframes loadingFade {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: .8;\n  }\n\n  100% {\n    opacity: 0;\n  }\n}\n\n@keyframes loadingFade {\n  0% {\n    opacity: 0;\n  }\n\n  50% {\n    opacity: .8;\n  }\n\n  100% {\n    opacity: 0;\n  }\n}\n\n.coveo-relevance-inspector {\n  text-align: center;\n  padding: 10px;\n  line-height: 20px;\n  height: 40px;\n  top: 0;\n  z-index: 1000;\n}\n\n.coveo-relevance-inspector.coveo-hidden {\n  display: none;\n}\n\n.relevance-inspector-modal .coveo-logo {\n  height: 64px;\n  width: 178px;\n}\n\n.ag-theme-fresh .ag-cell {\n  overflow: auto;\n  white-space: normal;\n  word-break: break-word;\n}\n\n.ag-theme-fresh .ag-font-style {\n  user-select: auto;\n}\n\n.coveo-relevance-inspector-tab-navigation-section {\n  margin-bottom: 20px;\n}\n\n.coveo-relevance-inspector-tab-content {\n  display: none;\n}\n\n.coveo-relevance-inspector-tab-content.coveo-selected {\n  display: block;\n  -webkit-animation: slideInLeft .3s ease-in;\n  -moz-animation: slideInLeft .3s ease-in;\n  animation: slideInLeft .3s ease-in;\n}\n\n.coveo-relevance-inspector-tab {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -webkit-flex;\n  display: -moz-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  box-align: center;\n  -webkit-align-items: center;\n  -moz-align-items: center;\n  -ms-align-items: center;\n  -o-align-items: center;\n  align-items: center;\n  -ms-flex-align: center;\n  font-size: 12px;\n  font-weight: bold;\n  padding: 0 5px 10px;\n  border-bottom: 1px solid #bcc3ca;\n  text-transform: uppercase;\n  border-bottom: 2px solid #bcc3ca;\n  display: inline-block;\n  margin-right: 10px;\n}\n\n.coveo-relevance-inspector-tab.coveo-selected,\n.coveo-relevance-inspector-tab.coveo-selected:hover {\n  border-bottom: 2px solid #263e55;\n}\n\n.coveo-relevance-inspector-tab:hover {\n  color: #263e55;\n}\n\n.coveo-relevance-inspector-highlight {\n  display: inline-block;\n  font-weight: bold;\n}\n\n.coveo-relevance-inspector-result-thumbnail {\n  min-width: 500px;\n  white-space: normal;\n}\n\n.coveo-relevance-inspector-dt {\n  font-weight: bold;\n}\n\n.coveo-relevance-inspector-dt,\n.coveo-relevance-inspector-dd {\n  font-size: 14px;\n  line-height: 14px;\n  padding: 2px 0 4px;\n}\n\n.coveo-relevance-inspector-metadata-name,\n.coveo-relevance-inspector-metadata-value {\n  background-color: #e9ecef;\n  display: block;\n  padding: 10px;\n  line-height: 1.5;\n  border: 1px solid #ced4da;\n  border-radius: 2px;\n  position: relative;\n  flex: 1 1 auto;\n  margin-bottom: 0;\n}\n\n.coveo-relevance-inspector-metadata-name {\n  max-width: 25%;\n  min-width: 25%;\n}\n\n.coveo-relevance-inspector-metadata-value {\n  width: 75%;\n  overflow: auto;\n}\n\n.coveo-relevance-inspector-input-group {\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: stretch;\n  width: 100%;\n}\n\n.coveo-relevance-inspector-tab-content .coveo-input {\n  margin: 40px 0 10px;\n}\n\n.coveo-relevance-inspector-available-fields-popup {\n  background: #fff;\n  border: 1px solid #bcc3ca;\n  border-radius: 2px;\n  padding: 10px 5px 10px 20px;\n  width: 200px;\n  overflow: hidden;\n  list-style-type: none;\n}\n\n.coveo-relevance-inspector-available-fields-popup-value {\n  padding: 0 0 10px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.coveo-available-fields-table-button {\n  overflow: hidden;\n  display: inline-block;\n  position: relative;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n  -moz-transform: translateY(-50%);\n  -ms-transform: translateY(-50%);\n  -o-transform: translateY(-50%);\n  transform: translateY(-50%);\n}\n\n.coveo-relevance-inspector-effective-query-collapsible {\n  display: none;\n}\n\n.coveo-relevance-inspector-effective-query-collapsible.coveo-active {\n  display: inherit;\n}\n\n.coveo-relevance-inspector-table {\n  width: 100%;\n  text-align: left;\n  border: none;\n  border-spacing: 0;\n}\n\n.coveo-relevance-inspector-table tr {\n  height: 37px;\n  font-size: 15px;\n  line-height: 18px;\n}\n\n.coveo-relevance-inspector-table tr:first-child {\n  padding-left: 10px;\n}\n\n.coveo-relevance-inspector-table tr:hover td {\n  background-color: #e6ecf0;\n}\n\n.coveo-relevance-inspector-table td {\n  position: relative;\n  text-align: left;\n  vertical-align: middle;\n  padding: 9px 15px;\n  margin-left: 15px;\n  text-align: left;\n  border-bottom: 1px solid #bcc3ca;\n}\n\n.coveo-relevance-inspector-table td:first-child {\n  border-left: 5px solid rgba(0,0,0,0);\n}\n\n.coveo-relevance-inspector-inline-ranking {\n  border: 1px solid #bcc3ca;\n  border-radius: 2px;\n  display: -webkit-box;\n  display: -moz-box;\n  display: -webkit-flex;\n  display: -moz-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-lines: multiple;\n  -moz-box-lines: multiple;\n  box-lines: multiple;\n  -webkit-flex-wrap: wrap;\n  -moz-flex-wrap: wrap;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  padding: 10px;\n  margin-bottom: 10px;\n}\n\n.coveo-relevance-inspector-inline-ranking-section {\n  margin: 10px;\n}\n\n.coveo-relevance-inspector-inline-ranking-terms {\n  display: none;\n  padding: 10px;\n  width: 100%;\n}\n\n.coveo-relevance-inspector-inline-ranking-terms.coveo-active {\n  display: block;\n  -webkit-animation: fadein .5s;\n  -moz-animation: fadein .5s;\n  animation: fadein .5s;\n}\n\n.coveo-relevance-inspector-inline-ranking-terms h2 {\n  border-bottom: 1px solid #bcc3ca;\n}\n\n.coveo-relevance-inspector-inline-ranking-terms dl {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -webkit-flex;\n  display: -moz-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-lines: multiple;\n  -moz-box-lines: multiple;\n  box-lines: multiple;\n  -webkit-flex-wrap: wrap;\n  -moz-flex-wrap: wrap;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  box-align: center;\n  -webkit-align-items: center;\n  -moz-align-items: center;\n  -ms-align-items: center;\n  -o-align-items: center;\n  align-items: center;\n  -ms-flex-align: center;\n}\n\n.coveo-relevance-inspector-inline-ranking-terms dt {\n  margin: 10px 20px;\n}\n\n.coveo-relevance-inspector-inline-ranking-terms dd {\n  margin-left: 0;\n}\n\n.coveo-relevance-inspector-inline-ranking-button {\n  height: 35px;\n  margin: 5px 0;\n}\n\n.relevance-inspector-list-output {\n  padding-left: 5px;\n  margin-top: 0;\n}\n\n.coveo-relevance-inspector-inline-ranking-qre-expression {\n  font-weight: bold;\n  word-break: break-all;\n}\n\n", ""]);

// exports


/***/ }),

/***/ 350:
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
var ExecutionReport_1 = __webpack_require__(335);
var TableBuilder_1 = __webpack_require__(334);
var underscore_1 = __webpack_require__(0);
var ExecutionReportGenericSection_1 = __webpack_require__(337);
var GenericValueOutput_1 = __webpack_require__(336);
var ExecutionReportAuthenticationSection = /** @class */ (function () {
    function ExecutionReportAuthenticationSection() {
    }
    ExecutionReportAuthenticationSection.prototype.build = function (executionReport) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, container, agGridElement, gridOptions, authenticationSection, dataSource, tableBuilder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ExecutionReport_1.ExecutionReport.standardSectionHeader('Authentication'), container = _a.container, agGridElement = _a.agGridElement;
                        authenticationSection = underscore_1.find(executionReport.children, function (child) { return child.name == ExecutionReport_1.EXECUTION_REPORT_SECTION.PERFORM_AUTHENTICATION; });
                        if (!authenticationSection) return [3 /*break*/, 2];
                        dataSource = [
                            __assign({}, new ExecutionReportGenericSection_1.ExecutionReportGenericSection().build(authenticationSection), this.configurationSection(authenticationSection), this.pipelineOuputSection(authenticationSection))
                        ];
                        return [4 /*yield*/, new TableBuilder_1.TableBuilder().build(dataSource, agGridElement, {
                                rowHeight: 150
                            })];
                    case 1:
                        tableBuilder = _b.sent();
                        gridOptions = tableBuilder.gridOptions;
                        _b.label = 2;
                    case 2: return [2 /*return*/, { container: container, gridOptions: gridOptions }];
                }
            });
        });
    };
    ExecutionReportAuthenticationSection.prototype.configurationSection = function (authenticationSection) {
        return {
            Configured: {
                children: [
                    {
                        Primary: this.genericOutput(authenticationSection.configured.primary),
                        Secondary: this.genericOutput(authenticationSection.configured.secondary),
                        Mandatory: this.genericOutput(authenticationSection.configured.mandatory)
                    }
                ]
            }
        };
    };
    ExecutionReportAuthenticationSection.prototype.pipelineOuputSection = function (authenticationSection) {
        return {
            'Pipeline Output': {
                children: [
                    {
                        'User ids': {
                            children: this.usersIds(authenticationSection.result.userIds)
                        },
                        'Query restriction': {
                            children: this.queryRestrictions(authenticationSection.result.queryRestrictions)
                        },
                        Roles: __assign({}, this.genericOutput(authenticationSection.result.roles), { width: 200 }),
                        'User groups': this.genericOutput(authenticationSection.result.userGroups)
                    }
                ]
            }
        };
    };
    ExecutionReportAuthenticationSection.prototype.usersIds = function (userIds) {
        var _this = this;
        return underscore_1.map(userIds, function (userId) {
            return _a = {},
                _a[userId.name] = {
                    children: [
                        {
                            Kind: _this.genericOutput(userId.kind),
                            Provider: __assign({}, _this.genericOutput(userId.provider), { width: 150 }),
                            Info: { content: userId.info }
                        }
                    ]
                },
                _a;
            var _a;
        });
    };
    ExecutionReportAuthenticationSection.prototype.genericOutput = function (section) {
        return new GenericValueOutput_1.GenericValueOutput().output(section);
    };
    ExecutionReportAuthenticationSection.prototype.queryRestrictions = function (queryRestrictions) {
        var _this = this;
        return underscore_1.map(queryRestrictions, function (value, key) {
            return _a = {},
                _a[key] = _this.genericOutput(value),
                _a;
            var _a;
        });
    };
    return ExecutionReportAuthenticationSection;
}());
exports.ExecutionReportAuthenticationSection = ExecutionReportAuthenticationSection;


/***/ }),

/***/ 351:
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
var ExecutionReport_1 = __webpack_require__(335);
var underscore_1 = __webpack_require__(0);
var ExecutionReportGenericSection_1 = __webpack_require__(337);
var TableBuilder_1 = __webpack_require__(334);
var GenericValueOutput_1 = __webpack_require__(336);
var ExecutionReportResolvedPipelineSection = /** @class */ (function () {
    function ExecutionReportResolvedPipelineSection() {
    }
    ExecutionReportResolvedPipelineSection.prototype.build = function (executionReport) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, container, agGridElement, gridOptions, resolvedPipelineSection, dataSource, tableBuilder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ExecutionReport_1.ExecutionReport.standardSectionHeader('Pipeline'), container = _a.container, agGridElement = _a.agGridElement;
                        resolvedPipelineSection = underscore_1.find(executionReport.children, function (child) { return child.name == ExecutionReport_1.EXECUTION_REPORT_SECTION.RESOLVE_PIPELINE; });
                        if (!resolvedPipelineSection) return [3 /*break*/, 2];
                        dataSource = [
                            __assign({}, new ExecutionReportGenericSection_1.ExecutionReportGenericSection().build(resolvedPipelineSection), { Pipeline: new GenericValueOutput_1.GenericValueOutput().output(resolvedPipelineSection.result.pipeline) }, { 'Split Test': new GenericValueOutput_1.GenericValueOutput().output(resolvedPipelineSection.result.splitTest) })
                        ];
                        return [4 /*yield*/, new TableBuilder_1.TableBuilder().build(dataSource, agGridElement)];
                    case 1:
                        tableBuilder = _b.sent();
                        gridOptions = tableBuilder.gridOptions;
                        _b.label = 2;
                    case 2: return [2 /*return*/, { container: container, gridOptions: gridOptions }];
                }
            });
        });
    };
    return ExecutionReportResolvedPipelineSection;
}());
exports.ExecutionReportResolvedPipelineSection = ExecutionReportResolvedPipelineSection;


/***/ }),

/***/ 352:
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
var ExecutionReport_1 = __webpack_require__(335);
var underscore_1 = __webpack_require__(0);
var ExecutionReportGenericSection_1 = __webpack_require__(337);
var TableBuilder_1 = __webpack_require__(334);
var GenericValueOutput_1 = __webpack_require__(336);
var ExecutionReportQueryOverrideSection = /** @class */ (function () {
    function ExecutionReportQueryOverrideSection() {
    }
    ExecutionReportQueryOverrideSection.prototype.build = function (executionReport) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, container, agGridElement, gridOptions, queryOverrideSection, dataSource, tableBuilder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ExecutionReport_1.ExecutionReport.standardSectionHeader('Query Params Override'), container = _a.container, agGridElement = _a.agGridElement;
                        queryOverrideSection = underscore_1.find(executionReport.children, function (child) { return child.name == ExecutionReport_1.EXECUTION_REPORT_SECTION.QUERY_PARAM_OVERRIDE; });
                        if (!queryOverrideSection) return [3 /*break*/, 2];
                        dataSource = [
                            __assign({}, new ExecutionReportGenericSection_1.ExecutionReportGenericSection().build(queryOverrideSection), { Applied: new GenericValueOutput_1.GenericValueOutput().output(queryOverrideSection.applied) })
                        ];
                        return [4 /*yield*/, new TableBuilder_1.TableBuilder().build(dataSource, agGridElement)];
                    case 1:
                        tableBuilder = _b.sent();
                        gridOptions = tableBuilder.gridOptions;
                        _b.label = 2;
                    case 2: return [2 /*return*/, { container: container, gridOptions: gridOptions }];
                }
            });
        });
    };
    return ExecutionReportQueryOverrideSection;
}());
exports.ExecutionReportQueryOverrideSection = ExecutionReportQueryOverrideSection;


/***/ }),

/***/ 353:
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
var ExecutionReport_1 = __webpack_require__(335);
var underscore_1 = __webpack_require__(0);
var GenericValueOutput_1 = __webpack_require__(336);
var Dom_1 = __webpack_require__(1);
var collapsibleSectionsInReport = ['Facets', 'RankingOverrides', 'RankingExpressions'];
var ExecutionReportEffectiveIndexQuerySection = /** @class */ (function () {
    function ExecutionReportEffectiveIndexQuerySection() {
    }
    ExecutionReportEffectiveIndexQuerySection.prototype.build = function (executionReport) {
        return __awaiter(this, void 0, void 0, function () {
            var container, table, indexQuerySection;
            return __generator(this, function (_a) {
                container = ExecutionReport_1.ExecutionReport.standardSectionHeader('Query sent to index').container;
                table = Dom_1.$$('table', {
                    className: 'coveo-relevance-inspector-table'
                });
                container.append(table.el);
                indexQuerySection = underscore_1.findWhere(executionReport.children, { description: ExecutionReport_1.EXECUTION_REPORT_SECTION.INDEX_QUERY });
                if (indexQuerySection) {
                    underscore_1.each(indexQuerySection.result.in, function (paramValue, paramKey) {
                        var row = Dom_1.$$('tr');
                        table.append(row.el);
                        var id = "executionReportIndexExecution" + paramKey;
                        if (underscore_1.contains(collapsibleSectionsInReport, paramKey) && paramValue) {
                            var btn = Dom_1.$$('button', {
                                className: 'coveo-button',
                                type: 'button'
                            }, paramKey);
                            var tdTarget_1 = Dom_1.$$('td', {
                                id: id,
                                className: 'coveo-relevance-inspector-effective-query-collapsible'
                            }, new GenericValueOutput_1.GenericValueOutput().output(paramValue).content);
                            btn.on('click', function () {
                                tdTarget_1.toggleClass('coveo-active');
                            });
                            row.append(Dom_1.$$('td', undefined, btn).el);
                            row.append(tdTarget_1.el);
                        }
                        else {
                            row.append(Dom_1.$$('td', undefined, paramKey).el);
                            row.append(Dom_1.$$('td', undefined, new GenericValueOutput_1.GenericValueOutput().output(paramValue).content).el);
                        }
                    });
                }
                return [2 /*return*/, { container: container }];
            });
        });
    };
    return ExecutionReportEffectiveIndexQuerySection;
}());
exports.ExecutionReportEffectiveIndexQuerySection = ExecutionReportEffectiveIndexQuerySection;


/***/ }),

/***/ 354:
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
var ExecutionReport_1 = __webpack_require__(335);
var TableBuilder_1 = __webpack_require__(334);
var underscore_1 = __webpack_require__(0);
var GenericValueOutput_1 = __webpack_require__(336);
var QueryBuilder_1 = __webpack_require__(82);
var ExecutionReportRankingModifiers = /** @class */ (function () {
    function ExecutionReportRankingModifiers() {
    }
    ExecutionReportRankingModifiers.prototype.build = function (results, rankingExpressions, bindings) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, container, agGridElement, dataSourcePromises, dataSource, gridOptions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ExecutionReport_1.ExecutionReport.standardSectionHeader('Ranking Modifiers & Machine Learning Boosts'), container = _a.container, agGridElement = _a.agGridElement;
                        dataSourcePromises = underscore_1.map(rankingExpressions, function (rankingExpression) { return __awaiter(_this, void 0, void 0, function () {
                            var isAutomaticBoostRegex, thumbnailPreview, returnedByIndexForCurrentQuery, result, isAutomaticBoost, permanentIDUsedInAutomaticBoost, extracted;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        isAutomaticBoostRegex = /^(@permanentid|@urihash)="?([a-zA-Z0-9]+)"?$/;
                                        thumbnailPreview = TableBuilder_1.TableBuilder.thumbnailCell(null, null);
                                        returnedByIndexForCurrentQuery = '-- NULL --';
                                        result = null;
                                        isAutomaticBoost = rankingExpression.expression.match(isAutomaticBoostRegex);
                                        if (!isAutomaticBoost) return [3 /*break*/, 2];
                                        permanentIDUsedInAutomaticBoost = isAutomaticBoost[2];
                                        return [4 /*yield*/, this.extractDocumentInfoFromBoost(results, permanentIDUsedInAutomaticBoost, rankingExpression, bindings)];
                                    case 1:
                                        extracted = _a.sent();
                                        thumbnailPreview = TableBuilder_1.TableBuilder.thumbnailCell(extracted.result, bindings);
                                        result = extracted.result;
                                        returnedByIndexForCurrentQuery = extracted.returnedByIndexForCurrentQuery.toString();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/, __assign({}, thumbnailPreview, { ReturnedByIndexForCurrentQuery: new GenericValueOutput_1.GenericValueOutput().output(returnedByIndexForCurrentQuery), IsRecommendation: new GenericValueOutput_1.GenericValueOutput().output(result ? result.isRecommendation : '-- NULL --'), Expression: __assign({}, new GenericValueOutput_1.GenericValueOutput().output(rankingExpression.expression), { width: 150 }), Modifier: new GenericValueOutput_1.GenericValueOutput().output(rankingExpression.modifier) })];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(dataSourcePromises)];
                    case 1:
                        dataSource = _b.sent();
                        return [4 /*yield*/, new TableBuilder_1.TableBuilder().build(dataSource, agGridElement, {
                                rowHeight: 150
                            })];
                    case 2:
                        gridOptions = (_b.sent()).gridOptions;
                        return [2 /*return*/, {
                                container: container,
                                gridOptions: gridOptions
                            }];
                }
            });
        });
    };
    ExecutionReportRankingModifiers.prototype.extractDocumentInfoFromBoost = function (results, permanentID, rankingExpression, bindings) {
        return __awaiter(this, void 0, void 0, function () {
            var matchingResult, resultInResultSet, queryBuilder, resultsFromIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matchingResult = {
                            result: null,
                            returnedByIndexForCurrentQuery: false
                        };
                        resultInResultSet = underscore_1.find(results, function (result) {
                            return result.raw.permanentid == permanentID || result.raw.urihash == permanentID;
                        });
                        if (resultInResultSet) {
                            matchingResult = {
                                result: resultInResultSet,
                                returnedByIndexForCurrentQuery: true
                            };
                            return [2 /*return*/, matchingResult];
                        }
                        queryBuilder = new QueryBuilder_1.QueryBuilder();
                        queryBuilder.advancedExpression.add(rankingExpression.expression);
                        return [4 /*yield*/, bindings.queryController.getEndpoint().search(queryBuilder.build())];
                    case 1:
                        resultsFromIndex = _a.sent();
                        matchingResult = {
                            result: resultsFromIndex.results[0],
                            returnedByIndexForCurrentQuery: false
                        };
                        return [2 /*return*/, matchingResult];
                }
            });
        });
    };
    return ExecutionReportRankingModifiers;
}());
exports.ExecutionReportRankingModifiers = ExecutionReportRankingModifiers;


/***/ }),

/***/ 355:
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
var ExecutionReport_1 = __webpack_require__(335);
var underscore_1 = __webpack_require__(0);
var TableBuilder_1 = __webpack_require__(334);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(3);
var StreamHighlightUtils_1 = __webpack_require__(118);
var ExecutionReportSimpleSection_1 = __webpack_require__(339);
var ExecutionReportITDSection = /** @class */ (function () {
    function ExecutionReportITDSection() {
    }
    ExecutionReportITDSection.prototype.build = function (executionReport) {
        return __awaiter(this, void 0, void 0, function () {
            var preprocessQuerySection, originalLongQuery, topClicksSection, _a, container, agGridElement, gridOptions, dataSource, tableBuilder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        preprocessQuerySection = underscore_1.find(executionReport.children, function (child) { return child.name == ExecutionReport_1.EXECUTION_REPORT_SECTION.PREPROCESS_QUERY; });
                        if (!preprocessQuerySection) {
                            return [2 /*return*/, this.buildFallbackEmptyTable(executionReport)];
                        }
                        originalLongQuery = preprocessQuerySection.result.in.lq;
                        topClicksSection = underscore_1.find(preprocessQuerySection.children, function (child) { return child.name == ExecutionReport_1.EXECUTION_REPORT_SECTION.TOP_CLICKS; });
                        if (!topClicksSection || !originalLongQuery) {
                            return [2 /*return*/, this.buildFallbackEmptyTable(executionReport)];
                        }
                        _a = ExecutionReport_1.ExecutionReport.standardSectionHeader('Large Query Intelligent Term Detection (ITD)'), container = _a.container, agGridElement = _a.agGridElement;
                        dataSource = [
                            {
                                'Original large query': this.buildOriginalLongQueryCell(originalLongQuery, topClicksSection.refinedQueries),
                                'Keyword(s) extracted': this.buildRefinedQueryCell(executionReport, topClicksSection.refinedQueries, preprocessQuerySection)
                            }
                        ];
                        return [4 /*yield*/, new TableBuilder_1.TableBuilder().build(dataSource, agGridElement, {
                                rowHeight: 300
                            })];
                    case 1:
                        tableBuilder = _b.sent();
                        gridOptions = tableBuilder.gridOptions;
                        return [2 /*return*/, { container: container, gridOptions: gridOptions }];
                }
            });
        });
    };
    ExecutionReportITDSection.prototype.doHighlights = function (originalLongQuery, refinedQueries) {
        var termsToHighlight = {};
        underscore_1.each(refinedQueries, function (refined) {
            termsToHighlight[refined.q] = [];
        });
        return StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamText(originalLongQuery, termsToHighlight, {});
    };
    ExecutionReportITDSection.prototype.buildOriginalLongQueryCell = function (originalLongQuery, refinedQueries) {
        return {
            content: this.doHighlights(originalLongQuery, refinedQueries),
            cellRenderer: TableBuilder_1.GenericHtmlRenderer
        };
    };
    ExecutionReportITDSection.prototype.buildRefinedQueryCell = function (executionReport, refinedQueries, preprocessSection) {
        if (Utils_1.Utils.isNonEmptyArray(refinedQueries)) {
            return this.buildRefinedQueryByMLCell(refinedQueries);
        }
        var fallbackIndexPartialMatch = underscore_1.find(preprocessSection.children, function (child) { return child.name == ExecutionReport_1.EXECUTION_REPORT_SECTION.PARTIAL_MATCH; });
        var isUsingPartialMatch = fallbackIndexPartialMatch ? fallbackIndexPartialMatch.result.out.match(/^PartialMatch/) : false;
        if (isUsingPartialMatch) {
            return this.buildRefinedQueryByPartialMatchCell(fallbackIndexPartialMatch);
        }
        return this.buildRefinedQueryNoExtraction();
    };
    ExecutionReportITDSection.prototype.buildRefinedQueryByMLCell = function (refinedQueries) {
        var _this = this;
        var topLevelContainer = Dom_1.$$('div', undefined, Dom_1.$$('h2', undefined, 'Extraction and scoring performed using Coveo Machine Learning:'));
        var keywordsList = Dom_1.$$('ul');
        topLevelContainer.append(keywordsList.el);
        underscore_1.chain(refinedQueries)
            .map(function (refinedQuery) {
            var content = _this.doHighlights("Keyword: " + refinedQuery.q + " ==> Score: " + refinedQuery.score, [refinedQuery]);
            var container = Dom_1.$$('li', null, content);
            return container;
        })
            .each(function (refinedQueryContainer) {
            keywordsList.append(refinedQueryContainer.el);
        });
        return {
            content: topLevelContainer,
            cellRenderer: TableBuilder_1.GenericHtmlRenderer
        };
    };
    ExecutionReportITDSection.prototype.buildRefinedQueryByPartialMatchCell = function (partialMatch) {
        var topLevelContainer = Dom_1.$$('div');
        topLevelContainer.append(Dom_1.$$('h2', undefined, 'Coveo Machine learning was unable to suggest any refined keywords').el);
        topLevelContainer.append(Dom_1.$$('h4', undefined, 'Fallback on Coveo Index partial match feature').el);
        var content = Dom_1.$$('code', undefined, partialMatch.result.out);
        topLevelContainer.append(content.el);
        return {
            content: topLevelContainer,
            cellRenderer: TableBuilder_1.GenericHtmlRenderer
        };
    };
    ExecutionReportITDSection.prototype.buildRefinedQueryNoExtraction = function () {
        var topLevelContainer = Dom_1.$$('div');
        topLevelContainer.append(Dom_1.$$('h2', undefined, 'No keywords were extracted').el);
        topLevelContainer.append(Dom_1.$$('h4', undefined, 'The query is probably too small, or Coveo is lacking usage analytics data to return any meaningful suggestions.')
            .el);
        return {
            content: topLevelContainer,
            cellRenderer: TableBuilder_1.GenericHtmlRenderer
        };
    };
    ExecutionReportITDSection.prototype.buildFallbackEmptyTable = function (executionReport) {
        return new ExecutionReportSimpleSection_1.ExecutionReportSimpleSection(ExecutionReport_1.EXECUTION_REPORT_SECTION.NONE, ExecutionReport_1.EXECUTION_REPORT_SECTION.NONE, 'Large Query Intelligent Term Detection (ITD)').build(executionReport);
    };
    return ExecutionReportITDSection;
}());
exports.ExecutionReportITDSection = ExecutionReportITDSection;


/***/ }),

/***/ 356:
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
var TableBuilder_1 = __webpack_require__(334);
var underscore_1 = __webpack_require__(0);
var GenericValueOutput_1 = __webpack_require__(336);
var UtilsModules_1 = __webpack_require__(81);
var QueryBuilder_1 = __webpack_require__(82);
var PopupUtils_1 = __webpack_require__(123);
var AvailableFieldsTable = /** @class */ (function () {
    function AvailableFieldsTable(bindings) {
        this.bindings = bindings;
    }
    AvailableFieldsTable.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var container, agGridElement, allFieldsDescription, _a, dataSource, gridOptions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        container = UtilsModules_1.$$('div');
                        agGridElement = UtilsModules_1.$$('div', {
                            className: 'ag-theme-fresh'
                        });
                        container.append(agGridElement.el);
                        if (!this.bindings.queryController) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.bindings.queryController.getEndpoint().listFields()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = null;
                        _b.label = 3;
                    case 3:
                        allFieldsDescription = _a;
                        if (!allFieldsDescription) return [3 /*break*/, 5];
                        dataSource = underscore_1.map(allFieldsDescription, function (description) {
                            return {
                                Name: new GenericValueOutput_1.GenericValueOutput().output(description.name),
                                Description: __assign({}, new GenericValueOutput_1.GenericValueOutput().output(description.description), { width: 150 }),
                                'Default Value': new GenericValueOutput_1.GenericValueOutput().output(description.defaultValue),
                                'Field Type': new GenericValueOutput_1.GenericValueOutput().output(description.fieldType),
                                'Field Source Type': new GenericValueOutput_1.GenericValueOutput().output(description.fieldSourceType),
                                'Include In Query': new GenericValueOutput_1.GenericValueOutput().output(description.includeInQuery),
                                'Include In Results': new GenericValueOutput_1.GenericValueOutput().output(description.includeInResults),
                                'Group By Field': new GenericValueOutput_1.GenericValueOutput().output(description.groupByField),
                                'Split Group By Field': new GenericValueOutput_1.GenericValueOutput().output(description.splitGroupByField),
                                'Sort By Field': new GenericValueOutput_1.GenericValueOutput().output(description.sortByField),
                                'Sample Of Available Values': {
                                    content: {
                                        content: {
                                            description: description,
                                            bindings: _this.bindings,
                                            container: container
                                        }
                                    },
                                    width: 200,
                                    suppressSorting: true,
                                    suppressFilter: true,
                                    cellRenderer: AvailableFieldsSampleValue
                                }
                            };
                        });
                        return [4 /*yield*/, new TableBuilder_1.TableBuilder().build(dataSource, agGridElement, {
                                enableFilter: true,
                                rowModelType: 'infinite',
                                pagination: true,
                                paginationPageSize: 25,
                                rowHeight: 100,
                                enableServerSideFilter: true,
                                enableServerSideSorting: true,
                                datasource: new AvailableFieldsDatasource(dataSource)
                            })];
                    case 4:
                        gridOptions = (_b.sent()).gridOptions;
                        this.gridOptions = gridOptions;
                        _b.label = 5;
                    case 5: return [2 /*return*/, container];
                }
            });
        });
    };
    return AvailableFieldsTable;
}());
exports.AvailableFieldsTable = AvailableFieldsTable;
var AvailableFieldsSampleValue = /** @class */ (function () {
    function AvailableFieldsSampleValue() {
    }
    AvailableFieldsSampleValue.prototype.init = function (params) {
        if (params.value && params.value.content) {
            this.description = params.value.content.description;
            this.bindings = params.value.content.bindings;
            this.container = params.value.content.container;
        }
    };
    AvailableFieldsSampleValue.prototype.getGui = function () {
        var _this = this;
        var btn = UtilsModules_1.$$('button', {
            className: 'coveo-button coveo-available-fields-table-button',
            type: 'button'
        }, 'Hover For Sample Values');
        var popperElement;
        var userHoveringButtonWithHisMouse = false;
        btn.on('mouseover', function () { return __awaiter(_this, void 0, void 0, function () {
            var values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userHoveringButtonWithHisMouse = true;
                        if (!(this.description && this.container && userHoveringButtonWithHisMouse)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getFieldsValues(this.description)];
                    case 1:
                        values = _a.sent();
                        if (userHoveringButtonWithHisMouse) {
                            popperElement = this.renderFieldValues(values);
                            this.container.append(popperElement.el);
                            UtilsModules_1.PopupUtils.positionPopup(popperElement.el, btn.el, document.body, {
                                horizontal: PopupUtils_1.PopupHorizontalAlignment.LEFT,
                                vertical: PopupUtils_1.PopupVerticalAlignment.MIDDLE
                            });
                        }
                        userHoveringButtonWithHisMouse = false;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        btn.on('mouseout', function () {
            if (popperElement) {
                popperElement.remove();
            }
            userHoveringButtonWithHisMouse = false;
        });
        return btn.el;
    };
    AvailableFieldsSampleValue.prototype.getFieldsValues = function (fieldDesciption) {
        return __awaiter(this, void 0, void 0, function () {
            var queryBuilder, queryResults, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.bindings || !this.description || !this.bindings.queryController || !this.container) {
                            return [2 /*return*/, []];
                        }
                        if (!fieldDesciption.groupByField) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.bindings.queryController.getEndpoint().listFieldValues({
                                field: this.description.name
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        queryBuilder = new QueryBuilder_1.QueryBuilder();
                        queryBuilder.advancedExpression.add(fieldDesciption.name);
                        if (!this.bindings) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.bindings.queryController.getEndpoint().search(queryBuilder.build())];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = null;
                        _b.label = 5;
                    case 5:
                        queryResults = _a;
                        if (queryResults) {
                            return [2 /*return*/, underscore_1.map(queryResults.results, function (result) {
                                    return { value: UtilsModules_1.Utils.getFieldValue(result, fieldDesciption.name) };
                                })];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AvailableFieldsSampleValue.prototype.renderFieldValues = function (fieldValues) {
        var list = UtilsModules_1.$$('ul', { className: 'coveo-relevance-inspector-available-fields-popup' });
        list.el.style.background = 'white';
        if (fieldValues.length == 0) {
            list.append(UtilsModules_1.$$('li', undefined, 'No Values Available ...').el);
        }
        else {
            fieldValues.forEach(function (fieldValue) {
                var listItem = UtilsModules_1.$$('li', {
                    className: 'coveo-relevance-inspector-available-fields-popup-value'
                }, new GenericValueOutput_1.GenericValueOutput().output(fieldValue.value).content);
                list.append(listItem.el);
            });
        }
        return list;
    };
    AvailableFieldsSampleValue.prototype.refresh = function () {
        return true;
    };
    return AvailableFieldsSampleValue;
}());
exports.AvailableFieldsSampleValue = AvailableFieldsSampleValue;
var AvailableFieldsDatasource = /** @class */ (function () {
    function AvailableFieldsDatasource(dataSource) {
        this.dataSource = dataSource;
        this.rowsData = [];
        this.rowsData = underscore_1.map(this.dataSource, function (source) {
            var merged = {};
            var extractContent = function (value, key) {
                if (value.content != null) {
                    merged[key] = value.content;
                }
                else if (value.children) {
                    underscore_1.each(value.children, function (child) {
                        underscore_1.each(child, extractContent);
                    });
                }
            };
            underscore_1.each(source, extractContent);
            return merged;
        });
    }
    AvailableFieldsDatasource.prototype.getRows = function (params) {
        var filtered = this.filter(this.rowsData, params.filterModel);
        var filteredAndSorted = this.sort(filtered, params.sortModel);
        params.successCallback(filteredAndSorted.slice(params.startRow, params.endRow), filteredAndSorted.length);
    };
    AvailableFieldsDatasource.prototype.filter = function (rows, filterModel) {
        underscore_1.each(filterModel, function (value, key) {
            switch (value.type) {
                case 'equals':
                    rows = underscore_1.where(rows, (_a = {}, _a[key] = value.filter, _a));
                    break;
                case 'notEqual':
                    rows = underscore_1.reject(rows, function (possibleReturn) {
                        return possibleReturn[key] == value.filter;
                    });
                    break;
                case 'startsWith':
                    rows = underscore_1.filter(rows, function (possibleReturn) {
                        return possibleReturn[key].toLowerCase().indexOf(value.filter) == 0;
                    });
                    break;
                case 'endsWith':
                    rows = underscore_1.filter(rows, function (possibleReturn) {
                        return possibleReturn[key].toLowerCase().indexOf(value.filter) == possibleReturn[key].length - value.filter.length;
                    });
                    break;
                case 'contains':
                    rows = underscore_1.filter(rows, function (possibleReturn) {
                        return possibleReturn[key].toLowerCase().indexOf(value.filter) != -1;
                    });
                    break;
                case 'notContains':
                    rows = underscore_1.filter(rows, function (possibleReturn) {
                        return possibleReturn[key].toLowerCase().indexOf(value.filter) == -1;
                    });
                    break;
            }
            var _a;
        });
        return rows;
    };
    AvailableFieldsDatasource.prototype.sort = function (rows, sortModels) {
        if (sortModels && sortModels[0]) {
            var sortModel_1 = sortModels[0];
            return rows.sort(function (first, second) {
                var firstValue = first[sortModel_1.colId];
                var secondValue = second[sortModel_1.colId];
                var ascendingOrDescendingMultiplier = sortModel_1.sort == 'asc' ? 1 : -1;
                if (UtilsModules_1.Utils.isNullOrEmptyString(firstValue) && UtilsModules_1.Utils.isNullOrEmptyString(secondValue)) {
                    return 0;
                }
                if (UtilsModules_1.Utils.isNullOrEmptyString(firstValue)) {
                    return -1 * ascendingOrDescendingMultiplier;
                }
                if (UtilsModules_1.Utils.isNullOrEmptyString(secondValue)) {
                    return 1 * ascendingOrDescendingMultiplier;
                }
                if (isNaN(firstValue) || isNaN(secondValue)) {
                    return firstValue.localeCompare(secondValue) * ascendingOrDescendingMultiplier;
                }
                else {
                    return (Number(firstValue) - Number(secondValue)) * ascendingOrDescendingMultiplier;
                }
            });
        }
        return rows;
    };
    return AvailableFieldsDatasource;
}());
exports.AvailableFieldsDatasource = AvailableFieldsDatasource;


/***/ }),

/***/ 357:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RankingInfoParser_1 = __webpack_require__(338);
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var Utils_1 = __webpack_require__(3);
var InlineRankingInfo = /** @class */ (function () {
    function InlineRankingInfo(result) {
        this.result = result;
        this.rankingInfo = RankingInfoParser_1.parseRankingInfo(result.rankingInfo);
    }
    InlineRankingInfo.prototype.build = function () {
        var container = Dom_1.$$('div', {
            className: 'coveo-relevance-inspector-inline-ranking'
        });
        underscore_1.each(this.rankingInfo.documentWeights, function (value, key) {
            var section = Dom_1.$$('div', { className: 'coveo-relevance-inspector-inline-ranking-section' }, key + ": " + value);
            container.append(section.el);
        });
        var total = Dom_1.$$('div', { className: 'coveo-relevance-inspector-highlight coveo-relevance-inspector-inline-ranking-section' }, "Total: " + this.rankingInfo.totalWeight);
        container.append(total.el);
        if (this.rankingInfo.termsWeight) {
            this.buildTogglableTermsSection(container);
        }
        if (Utils_1.Utils.isNonEmptyArray(this.rankingInfo.qreWeights)) {
            this.buildTogglableQRESection(container);
        }
        return container;
    };
    InlineRankingInfo.prototype.buildTogglableTermsSection = function (container) {
        var termsButton = Dom_1.$$('button', { className: 'coveo-button coveo-relevance-inspector-inline-ranking-button', type: 'button' }, 'Toggle Terms Relevancy Breakdown');
        container.append(termsButton.el);
        var termsSection = Dom_1.$$('div', { className: 'coveo-relevance-inspector-inline-ranking-terms' });
        container.append(termsSection.el);
        underscore_1.each(this.rankingInfo.termsWeight || {}, function (value, key) {
            var builtKey = "Keyword: " + key;
            termsSection.append(Dom_1.$$('h2', undefined, builtKey).el);
            termsSection.append(RankingInfoParser_1.buildListOfTermsElement(value.Weights).el);
        });
        termsButton.on('click', function () { return termsSection.toggleClass('coveo-active'); });
    };
    InlineRankingInfo.prototype.buildTogglableQRESection = function (container) {
        var qreButton = Dom_1.$$('button', { className: 'coveo-button coveo-relevance-inspector-inline-ranking-button', type: 'button' }, 'Toggle QRE Breakdown');
        container.append(qreButton.el);
        var qreSection = Dom_1.$$('ul', { className: 'coveo-relevance-inspector-inline-ranking-terms' });
        container.append(qreSection.el);
        underscore_1.each(this.rankingInfo.qreWeights, function (value) {
            qreSection.append(Dom_1.$$('dd', { className: 'coveo-relevance-inspector-inline-ranking-qre-expression' }, "" + value.expression).el);
            qreSection.append(Dom_1.$$('dt', undefined, "Score: " + value.score).el);
        });
        qreButton.on('click', function () { return qreSection.toggleClass('coveo-active'); });
    };
    return InlineRankingInfo;
}());
exports.InlineRankingInfo = InlineRankingInfo;


/***/ })

});
//# sourceMappingURL=0.js.map