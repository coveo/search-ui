webpackJsonpCoveo__temporary([85],{

/***/ 293:
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
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var QueryEvents_1 = __webpack_require__(11);
var AnalyticsEvents_1 = __webpack_require__(56);
var Initialization_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(3);
/**
 * This component exposes options to handle commerce-related queries.
 *
 * @availablesince [March 2020 Release (v2.8521)](https://docs.coveo.com/en/3203/)
 */
var CommerceQuery = /** @class */ (function (_super) {
    __extends(CommerceQuery, _super);
    /**
     * Creates a new CommerceQuery component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the CommerceQuery component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function CommerceQuery(element, options, bindings) {
        var _this = _super.call(this, element, CommerceQuery.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, CommerceQuery, options);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.doneBuildingQuery, _this.handleDoneBuildingQuery);
        _this.bind.onRootElement(AnalyticsEvents_1.AnalyticsEvents.changeAnalyticsCustomData, _this.handleChangeAnalytics);
        return _this;
    }
    CommerceQuery.prototype.handleDoneBuildingQuery = function (event) {
        if (this.options.listing) {
            event.queryBuilder.tab = this.options.listing;
            event.queryBuilder.addContextValue('listing', this.options.listing);
        }
    };
    CommerceQuery.prototype.handleChangeAnalytics = function (event) {
        if (this.options.listing) {
            event.originLevel2 = this.options.listing;
        }
    };
    CommerceQuery.ID = 'CommerceQuery';
    CommerceQuery.doExport = function () {
        GlobalExports_1.exportGlobally({
            CommerceQuery: CommerceQuery
        });
    };
    /**
     * The options for the CommerceQuery.
     * @componentOptions
     */
    CommerceQuery.options = {
        /**
         * The listing page identifier.
         *
         * In a typical Coveo for Commerce solution, all listing pages should share the same `searchHub`/`originLevel1` and be differentiated by setting this option to a unique, human-readable value.
         *
         * When specified, this option sets the `tab`/`originLevel2` parameter, as well as the `listing` property of the `context`/`customData` object of each query/usage analytics event originating from the listing page. This allows Coveo ML to provide relevant output for the listing page, and can also be useful for usage analytics reporting purposes.
         *
         * @examples ACME Furniture, ACME Jewelry, ACME Clothes
         */
        listing: ComponentOptions_1.ComponentOptions.buildStringOption()
    };
    return CommerceQuery;
}(Component_1.Component));
exports.CommerceQuery = CommerceQuery;
Initialization_1.Initialization.registerAutoCreateComponent(CommerceQuery);


/***/ })

});
//# sourceMappingURL=CommerceQuery__b6f3a40b26ad27101c27.js.map