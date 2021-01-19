webpackJsonpCoveo__temporary([87],{

/***/ 234:
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
var Initialization_1 = __webpack_require__(2);
var Dom_1 = __webpack_require__(1);
var Globalize = __webpack_require__(23);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
/**
 * The Aggregate component allows to display the result on an aggregate operation on the index.
 *
 * It hooks itself to the query to add a new {@link IGroupByRequest}, then displays the result.
 */
var Aggregate = /** @class */ (function (_super) {
    __extends(Aggregate, _super);
    /**
     * Creates a new Aggregate component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Aggregate component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Aggregate(element, options, bindings) {
        var _this = _super.call(this, element, Aggregate.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Aggregate, options);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) { return _this.handleQuerySuccess(args); });
        Dom_1.$$(_this.element).hide();
        return _this;
    }
    Aggregate.doExport = function () {
        GlobalExports_1.exportGlobally({
            Aggregate: Aggregate
        });
    };
    Aggregate.prototype.handleBuildingQuery = function (args) {
        var request = {
            field: this.options.field,
            maximumNumberOfValues: 0,
            computedFields: [
                {
                    field: this.options.field,
                    operation: this.options.operation
                }
            ]
        };
        this.index = args.queryBuilder.groupByRequests.length;
        args.queryBuilder.groupByRequests.push(request);
    };
    Aggregate.prototype.handleQuerySuccess = function (args) {
        if (_.isNumber(this.index) && args.results.groupByResults.length != 0) {
            var gbr = args.results.groupByResults[this.index];
            var aggregate = gbr.globalComputedFieldResults[0];
            Dom_1.$$(this.element).text(Globalize.format(aggregate, this.options.format));
            Dom_1.$$(this.element).show();
        }
        else {
            Dom_1.$$(this.element).hide();
        }
    };
    Aggregate.ID = 'Aggregate';
    /**
     * The options for the component
     * @componentOptions
     */
    Aggregate.options = {
        /**
         * Specifies the field on which to do the aggregate operation. This parameter is mandatory.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
        /**
         * Specifies the aggregate operation to perform.
         *
         * The possible values are:
         * - `sum` - Computes the sum of the computed field values.
         * - `average` - Computes the average of the computed field values.
         * - `minimum` - Finds the minimum value of the computed field values.
         * - `maximum` - Finds the maximum value of the computed field values.
         *
         * Default value is `sum`.
         */
        operation: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'sum' }),
        /**
         * Specifies how to format the value.
         *
         * The available formats are defined in the Globalize library (see
         * [Globalize](https://github.com/klaaspieter/jquery-global#globalizeformat-value-format-culture-).
         *
         * The most commonly used formats are:
         * - `c0` - Formats the value as a currency.
         * - `n0` - Formats the value as an integer.
         * - `n2` - Formats the value as a floating point with 2 decimal digits.
         *
         * Default value is `c0`.
         */
        format: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'c0' })
    };
    return Aggregate;
}(Component_1.Component));
exports.Aggregate = Aggregate;
Initialization_1.Initialization.registerAutoCreateComponent(Aggregate);


/***/ })

});
//# sourceMappingURL=Aggregate__ec82d15c0e890cb8a4e5.js.map