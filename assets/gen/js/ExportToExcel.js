webpackJsonpCoveo__temporary([58],{

/***/ 298:
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
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var SettingsEvents_1 = __webpack_require__(39);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var Initialization_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(10);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(589);
var SVGIcons_1 = __webpack_require__(15);
/**
 * The ExportToExcel component renders an item in the {@link Settings} menu to allow the end user to export the current
 * search results to the Microsoft Excel format (.xlsx).
 */
var ExportToExcel = (function (_super) {
    __extends(ExportToExcel, _super);
    /**
     * Creates a new ExportToExcel component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the ExportToExcel component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param _window The global Window object (used to download the Excel link).
     */
    function ExportToExcel(element, options, bindings, _window) {
        var _this = _super.call(this, element, ExportToExcel.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this._window = _window;
        _this._window = _this._window || window;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ExportToExcel, options);
        _this.bind.onRootElement(SettingsEvents_1.SettingsEvents.settingsPopulateMenu, function (args) {
            args.menuData.push({
                text: Strings_1.l('ExportToExcel'),
                className: 'coveo-export-to-excel',
                tooltip: Strings_1.l('ExportToExcelDescription'),
                onOpen: function () { return _this.download(); },
                svgIcon: SVGIcons_1.SVGIcons.icons.dropdownExport,
                svgIconClassName: 'coveo-export-to-excel-svg'
            });
        });
        return _this;
    }
    /**
     * Downloads the Excel representation of the current query.
     *
     * Also logs an `exportToExcel` event in the usage analytics.
     */
    ExportToExcel.prototype.download = function () {
        var query = this.queryController.getLastQuery();
        if (query) {
            query = _.omit(query, 'numberOfResults');
            if (this.options.fieldsToInclude) {
                query.fieldsToInclude = this.options.fieldsToInclude;
            }
            this.logger.debug('Performing query following \'Export to Excel\' click');
            var endpoint = this.queryController.getEndpoint();
            this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.exportToExcel, {}, this.element);
            this._window.location.replace(endpoint.getExportToExcelLink(query, this.options.numberOfResults));
        }
    };
    ExportToExcel.create = function (element, options, root) {
        return new ExportToExcel(element, options, root);
    };
    return ExportToExcel;
}(Component_1.Component));
ExportToExcel.ID = 'ExportToExcel';
ExportToExcel.doExport = function () {
    GlobalExports_1.exportGlobally({
        'ExportToExcel': ExportToExcel
    });
};
/**
 * The options for the ExportToExcel
 * @componentOptions
 */
ExportToExcel.options = {
    /**
     * Specifies the number of results to include in the resulting Excel file.
     *
     * Generating and downloading the Excel file should take a reasonably short amount of time when using the default
     * value. However, this amount of time will increase exponentially as you set the value higher.
     *
     * Consequently, you should avoid setting this value above the default index limit of 1000 search results.
     *
     * Default value is `100`. Minimum value is `1`.
     */
    numberOfResults: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 100, min: 1 }),
    fieldsToInclude: ComponentOptions_1.ComponentOptions.buildFieldsOption()
};
exports.ExportToExcel = ExportToExcel;
Initialization_1.Initialization.registerAutoCreateComponent(ExportToExcel);


/***/ }),

/***/ 589:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ExportToExcel.js.map