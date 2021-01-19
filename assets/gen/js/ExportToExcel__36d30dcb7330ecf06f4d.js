webpackJsonpCoveo__temporary([70],{

/***/ 250:
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
var ComponentOptions_1 = __webpack_require__(8);
var SettingsEvents_1 = __webpack_require__(53);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Initialization_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(6);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(607);
var SVGIcons_1 = __webpack_require__(12);
var SearchInterface_1 = __webpack_require__(19);
var RegisteredNamedMethods_1 = __webpack_require__(30);
var moment = __webpack_require__(140);
var createAnchor = function () { return document.createElement('a'); };
function setCreateAnchor(fn) {
    createAnchor = fn;
}
exports.setCreateAnchor = setCreateAnchor;
/**
 * The ExportToExcel component renders an item in the {@link Settings} menu to allow the end user to export the current
 * search results to the Microsoft Excel format (.xlsx).
 *
 * @availablesince [November 2015 Release (v1.0.139)](https://docs.coveo.com/en/289/#november-2015-release-v10139)
 */
var ExportToExcel = /** @class */ (function (_super) {
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
        var _this = this;
        var query = this.buildExcelQuery();
        this.logger.debug("Performing query following 'Export to Excel' click");
        var endpoint = this.queryController.getEndpoint();
        this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.exportToExcel, {}, this.element);
        endpoint.fetchBinary(query).then(function (content) { return _this.downloadExcelFile(content); });
    };
    ExportToExcel.prototype.buildExcelQuery = function () {
        var query = this.queryController.getLastQuery();
        query = _.omit(query, ['numberOfResults', 'fieldsToInclude']);
        if (this.options.fieldsToInclude) {
            query.fieldsToInclude = this.options.fieldsToInclude;
        }
        return __assign({}, query, { format: 'xlsx', numberOfResults: this.options.numberOfResults });
    };
    ExportToExcel.prototype.downloadExcelFile = function (content) {
        var blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var url = URL.createObjectURL(blob);
        var a = createAnchor();
        a.href = url;
        a.download = this.buildExcelFileName();
        a.click();
        URL.revokeObjectURL(url);
    };
    ExportToExcel.prototype.buildExcelFileName = function () {
        var utc = moment().utc();
        var year = utc.format('YYYY');
        var month = utc.format('MM');
        var day = utc.format('DD');
        var hour = utc.format('HH');
        var minute = utc.format('mm');
        var second = utc.format('ss');
        return "query--" + year + "-" + month + "-" + day + "--" + hour + "-" + minute + "-" + second + ".xlsx";
    };
    ExportToExcel.create = function (element, options, root) {
        return new ExportToExcel(element, options, RegisteredNamedMethods_1.get(root, SearchInterface_1.SearchInterface).getBindings());
    };
    ExportToExcel.ID = 'ExportToExcel';
    ExportToExcel.doExport = function () {
        GlobalExports_1.exportGlobally({
            ExportToExcel: ExportToExcel
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
         *
         * @availablesince [February 2016 Release (v1.0.318)](https://docs.coveo.com/en/309/#february-2016-release-v10318)
         */
        numberOfResults: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 100, min: 1 }),
        /**
         * Specifies the fields to include in the CSV output.
         *
         * Note that this does not affect top level properties such as the title, clickUri, printableUri and sysUri, for example.
         *
         * Default value is `undefined`, meaning all fields will be exported.
         */
        fieldsToInclude: ComponentOptions_1.ComponentOptions.buildFieldsOption()
    };
    return ExportToExcel;
}(Component_1.Component));
exports.ExportToExcel = ExportToExcel;
Initialization_1.Initialization.registerAutoCreateComponent(ExportToExcel);


/***/ }),

/***/ 607:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ExportToExcel__36d30dcb7330ecf06f4d.js.map