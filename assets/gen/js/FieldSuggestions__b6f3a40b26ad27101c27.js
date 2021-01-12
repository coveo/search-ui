webpackJsonpCoveo__temporary([44],{

/***/ 251:
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
__webpack_require__(516);
var _ = __webpack_require__(0);
var OmniboxEvents_1 = __webpack_require__(33);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var QueryStateModel_1 = __webpack_require__(13);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var SuggestionForOmnibox_1 = __webpack_require__(515);
/**
 * The `FieldSuggestions` component provides query suggestions based on a particular facet field. For example, you could
 * use this component to provide auto-complete suggestions while the end user is typing the title of an item.
 *
 * The query suggestions provided by this component appear in the [`Omnibox`]{@link Omnibox} component.
 *
 * **Note:** Consider [providing Coveo ML query suggestions](https://docs.coveo.com/en/340/#providing-coveo-machine-learning-query-suggestions)
 * rather than field suggestions, as the former yields better performance and relevance.
 */
var FieldSuggestions = /** @class */ (function (_super) {
    __extends(FieldSuggestions, _super);
    /**
     * Creates a new `FieldSuggestions` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `FieldSuggestions` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function FieldSuggestions(element, options, bindings) {
        var _this = _super.call(this, element, FieldSuggestions.ID, bindings) || this;
        _this.options = options;
        if (_this.options && 'omniboxSuggestionOptions' in _this.options) {
            _this.options = _.extend(_this.options, _this.options['omniboxSuggestionOptions']);
        }
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, FieldSuggestions, options);
        Assert_1.Assert.check(Utils_1.Utils.isCoveoField(_this.options.field), _this.options.field + ' is not a valid field');
        _this.options.onSelect = _this.options.onSelect || _this.onRowSelection;
        var rowTemplate = function (toRender) {
            var rowElement = Dom_1.$$('div', {
                className: 'magic-box-suggestion coveo-omnibox-selectable coveo-top-field-suggestion-row'
            });
            if (toRender['data']) {
                rowElement.el.innerHTML = toRender['data'];
            }
            return rowElement.el.outerHTML;
        };
        var suggestionStructure;
        if (_this.options.headerTitle == null) {
            suggestionStructure = {
                row: rowTemplate
            };
        }
        else {
            var headerTemplate = function () {
                var headerElement = Dom_1.$$('div', {
                    className: 'coveo-top-field-suggestion-header'
                });
                var iconElement = Dom_1.$$('span', {
                    className: 'coveo-icon-top-field'
                });
                var captionElement = Dom_1.$$('span', {
                    className: 'coveo-caption'
                });
                if (_this.options.headerTitle) {
                    captionElement.text(_this.options.headerTitle);
                }
                headerElement.append(iconElement.el);
                headerElement.append(captionElement.el);
                return headerElement.el.outerHTML;
            };
            suggestionStructure = {
                header: { template: headerTemplate, title: _this.options.headerTitle },
                row: rowTemplate
            };
        }
        _this.suggestionForOmnibox = new SuggestionForOmnibox_1.SuggestionForOmnibox(suggestionStructure, function (value, args) {
            _this.options.onSelect.call(_this, value, args);
        }, function (value, args) {
            _this.onRowTab(value, args);
        });
        _this.bind.onRootElement(OmniboxEvents_1.OmniboxEvents.populateOmnibox, function (args) { return _this.handlePopulateOmnibox(args); });
        return _this;
    }
    /**
     * Selects a currently displayed query suggestion. This implies that at least one suggestion must have been returned
     * at least once.
     * @param suggestion Either a number (0-based index position of the query suggestion to select) or a string that
     * matches the suggestion to select.
     */
    FieldSuggestions.prototype.selectSuggestion = function (suggestion) {
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
    FieldSuggestions.prototype.handlePopulateOmnibox = function (args) {
        var _this = this;
        Assert_1.Assert.exists(args);
        var valueToSearch = args.completeQueryExpression.word;
        var promise = new Promise(function (resolve) {
            _this.queryController
                .getEndpoint()
                .listFieldValues(_this.buildListFieldValueRequest(valueToSearch))
                .then(function (results) {
                var element = _this.suggestionForOmnibox.buildOmniboxElement(results, args);
                _this.currentlyDisplayedSuggestions = {};
                if (element) {
                    _.map(Dom_1.$$(element).findAll('.coveo-omnibox-selectable'), function (selectable, i) {
                        _this.currentlyDisplayedSuggestions[Dom_1.$$(selectable).text()] = {
                            element: selectable,
                            pos: i
                        };
                    });
                    resolve({
                        element: element,
                        zIndex: _this.options.omniboxZIndex
                    });
                }
                else {
                    resolve({
                        element: undefined
                    });
                }
            })
                .catch(function () {
                resolve({
                    element: undefined
                });
            });
        });
        args.rows.push({
            deferred: promise
        });
    };
    FieldSuggestions.prototype.onRowSelection = function (value, args) {
        args.closeOmnibox();
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, value);
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxField, {});
        this.queryController.executeQuery();
    };
    FieldSuggestions.prototype.onRowTab = function (value, args) {
        args.clear();
        args.closeOmnibox();
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, "" + value);
        this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.omniboxField, {}, this.element);
    };
    FieldSuggestions.prototype.buildListFieldValueRequest = function (valueToSearch) {
        return {
            field: this.options.field,
            ignoreAccents: true,
            sortCriteria: 'occurrences',
            maximumNumberOfValues: this.options.numberOfSuggestions,
            patternType: 'Wildcards',
            pattern: '*' + valueToSearch + '*',
            queryOverride: this.options.queryOverride
        };
    };
    FieldSuggestions.ID = 'FieldSuggestions';
    FieldSuggestions.doExport = function () {
        GlobalExports_1.exportGlobally({
            FieldSuggestions: FieldSuggestions
        });
    };
    /**
     * @componentOptions
     */
    FieldSuggestions.options = {
        /**
         * Specifies the facet field from which to provide suggestions.
         *
         * Specifying a value for this option is required for the `FieldSuggestions` component to work.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
        /**
         * Specifies a query override to apply when retrieving suggestions. You can use any valid query expression (see
         * [Coveo Query Syntax Reference](https://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
         *
         * Default value is the empty string, and the component applies no query override.
         */
        queryOverride: ComponentOptions_1.ComponentOptions.buildQueryExpressionOption({ defaultValue: '' }),
        /**
         * Specifies the z-index position at which the suggestions render themselves in the [`Omnibox`]{@link Omnibox}.
         *
         * When there are multiple suggestion providers, components with higher `omniboxZIndex` values render themselves
         * first.
         *
         * Default value is `51`. Minimum value is `0`.
         */
        omniboxZIndex: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 51, min: 0 }),
        /**
         * Specifies the title of the result suggestions group in the [`Omnibox`]{@link Omnibox} component.
         * If not provided, the component will simply not output any title.
         *
         * Default value is `null`.
         */
        headerTitle: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption(),
        /**
         * Specifies the number of suggestions to render in the [`Omnibox`]{@link Omnibox}.
         *
         * Default value is `5`. Minimum value is `1`.
         */
        numberOfSuggestions: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 }),
        /**
         * Specifies the event handler function to execute when the end user selects a suggested value in the
         * [`Omnibox`]{@link Omnibox}. By default, the query box text is replaced by what the end user selected and a new
         * query is executed. You can, however, replace this default behavior by providing a callback function to execute
         * when the value is selected.
         *
         * **Note:**
         * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
         * > [`init`]{@link init} call of your search interface (see
         * > [Passing Component Options in the init Call](https://docs.coveo.com/en/346/#passing-component-options-in-the-init-call)),
         * > or before the `init` call, using the `options` top-level function (see
         * > [Passing Component Options Before the init Call](https://docs.coveo.com/en/346/#passing-component-options-before-the-init-call)).
         *
         * **Example:**
         *
         * ```javascript
         *
         * var myOnSelectFunction = function(selectedValue, populateOmniboxEventArgs) {
         *
         *   // Close the suggestion list when the user clicks a suggestion.
         *   populateOmniboxEventArgs.closeOmnibox();
         *
         *   // Search for matching title results in the default endpoint.
         *   Coveo.SearchEndpoint.endpoints["default"].search({
         *     q: "@title==" + selectedValue
         *   }).done(function(results) {
         *
         *     // If more than one result is found, select a result that matches the selected title.
         *     var foundResult = Coveo._.find(results.results, function(result) {
         *       return selectedValue == result.raw.title;
         *     });
         *
         *     // Open the found result in the current window, or log an error.
         *     if (foundResult) {
         *       window.location = foundResult.clickUri;
         *     }
         *     else {
         *       new Coveo.Logger.warn("Selected suggested result '" + selectedValue + "' not found.");
         *     }
         *   });
         * };
         *
         * // You can set the option in the 'init' call:
         * Coveo.init(document.querySelector("#search"), {
         *    FieldSuggestions : {
         *      onSelect : myOnSelectFunction
         *    }
         * });
         *
         * // Or before the 'init' call, using the 'options' top-level function:
         * // Coveo.options(document.querySelector("#search"), {
         * //   FieldSuggestions : {
         * //     onSelect : myOnSelectFunction
         * //   }
         * // });
         * ```
         */
        onSelect: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        })
    };
    return FieldSuggestions;
}(Component_1.Component));
exports.FieldSuggestions = FieldSuggestions;
Initialization_1.Initialization.registerAutoCreateComponent(FieldSuggestions);


/***/ }),

/***/ 515:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DomUtils_1 = __webpack_require__(91);
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

/***/ 516:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=FieldSuggestions__b6f3a40b26ad27101c27.js.map