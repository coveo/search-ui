webpackJsonpCoveo__temporary([65],{

/***/ 264:
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
var Assert_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var Initialization_1 = __webpack_require__(2);
var Globalize = __webpack_require__(23);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(634);
/**
 * The QueryDuration component displays the duration of the last query execution.
 *
 * When a {@link QueryEvents.querySuccess} event is triggered, the QueryDuration component becomes visible. It also
 * displays the global duration, the index duration, and the client duration in a single tooltip.
 *
 * If a {@link QueryEvents.queryError} event is triggered, the QueryDuration component becomes hidden.
 */
var QueryDuration = /** @class */ (function (_super) {
    __extends(QueryDuration, _super);
    /**
     * Creates a new QueryDuration component.
     * Binds handlers on the {@link QueryEvents.querySuccess} and {@link QueryEvents.queryError} events.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the QueryDuration component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function QueryDuration(element, options, bindings) {
        var _this = _super.call(this, element, QueryDuration.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, QueryDuration, options);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (data) { return _this.handleQuerySuccess(data); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function () { return Dom_1.$$(_this.element).hide(); });
        _this.element.style.display = 'none';
        _this.textContainer = Dom_1.$$('span').el;
        _this.element.appendChild(_this.textContainer);
        return _this;
    }
    QueryDuration.prototype.handleQuerySuccess = function (data) {
        if (!this.disabled && data.results.results.length > 0) {
            Assert_1.Assert.exists(data);
            var tooltip = [
                Strings_1.l('Duration', this.formatQueryDuration(data.results.duration)),
                Strings_1.l('SearchAPIDuration', this.formatQueryDuration(data.results.searchAPIDuration)),
                Strings_1.l('IndexDuration', this.formatQueryDuration(data.results.indexDuration))
            ].join('\n');
            this.textContainer.textContent = this.formatQueryDuration(data.results.duration);
            this.element.setAttribute('title', tooltip);
            this.element.style.display = 'inline';
        }
        else {
            this.element.style.display = 'none';
        }
    };
    QueryDuration.prototype.formatQueryDuration = function (durationInMillis) {
        if (durationInMillis == undefined) {
            return Strings_1.l('Unavailable');
        }
        else {
            var seconds = Math.max(durationInMillis / 1000, 0.01);
            if (String['locale'] === 'en') {
                return Strings_1.l('Seconds', Globalize.format(seconds, 'n2'), seconds, true);
            }
            else {
                return Strings_1.l('Seconds', Globalize.format(seconds, 'n2'), seconds);
            }
        }
    };
    QueryDuration.ID = 'QueryDuration';
    QueryDuration.doExport = function () {
        GlobalExports_1.exportGlobally({
            QueryDuration: QueryDuration
        });
    };
    QueryDuration.options = {};
    return QueryDuration;
}(Component_1.Component));
exports.QueryDuration = QueryDuration;
Initialization_1.Initialization.registerAutoCreateComponent(QueryDuration);


/***/ }),

/***/ 634:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=QueryDuration__36d30dcb7330ecf06f4d.js.map