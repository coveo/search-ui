webpackJsonpCoveo__temporary([69],{

/***/ 255:
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
var Strings_1 = __webpack_require__(6);
var QueryEvents_1 = __webpack_require__(11);
var BreadcrumbEvents_1 = __webpack_require__(34);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var QueryStateModel_1 = __webpack_require__(13);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var Initialization_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(5);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(615);
var SVGIcons_1 = __webpack_require__(12);
/**
 * The HiddenQuery component handles a "hidden" query parameter (`hq`) and its description (`hd`).
 *
 * Concretely, this means that if a HiddenQuery component is present in your page and you load your search interface
 * with `hq=foo&hd=bar` in the URL hash, the component adds `foo` as an expression to the query (`hq` is the hidden
 * query) and renders `bar` in the {@link Breadcrumb} (`hd` is the hidden query description).
 */
var HiddenQuery = /** @class */ (function (_super) {
    __extends(HiddenQuery, _super);
    /**
     * Creates a new HiddenQuery component, which binds multiple events ({@link QueryEvents.buildingQuery},
     * {@link BreadcrumbEvents.populateBreadcrumb} and {@link BreadcrumbEvents.clearBreadcrumb}).
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the HiddenQuery component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function HiddenQuery(element, options, bindings) {
        var _this = _super.call(this, element, HiddenQuery.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, HiddenQuery, options);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) {
            return _this.handlePopulateBreadcrumb(args);
        });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function () { return _this.setStateEmpty(); });
        return _this;
    }
    /**
     * Clears any `hd` or `hq` set in the {@link QueryStateModel}.
     * Also logs the `contextRemove` event in the usage analytics and triggers a new query.
     */
    HiddenQuery.prototype.clear = function () {
        this.setStateEmpty();
        var hiddenDescriptionRemoved = this.getDescription();
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.contextRemove, {
            contextName: hiddenDescriptionRemoved
        });
        this.queryController.executeQuery();
    };
    HiddenQuery.prototype.setStateEmpty = function () {
        this.queryStateModel.set(QueryStateModel_1.QUERY_STATE_ATTRIBUTES.HD, '');
        this.queryStateModel.set(QueryStateModel_1.QUERY_STATE_ATTRIBUTES.HQ, '');
    };
    HiddenQuery.prototype.handleBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        var hiddenQuery = this.queryStateModel.get(QueryStateModel_1.QUERY_STATE_ATTRIBUTES.HQ);
        if (Utils_1.Utils.isNonEmptyString(hiddenQuery)) {
            data.queryBuilder.advancedExpression.add(hiddenQuery);
        }
    };
    HiddenQuery.prototype.handlePopulateBreadcrumb = function (args) {
        var _this = this;
        var description = this.getDescription();
        if (!_.isEmpty(description) && !_.isEmpty(this.queryStateModel.get(QueryStateModel_1.QUERY_STATE_ATTRIBUTES.HQ))) {
            var elem = document.createElement('div');
            Dom_1.$$(elem).addClass('coveo-hidden-query-breadcrumb');
            var title = document.createElement('span');
            Dom_1.$$(title).addClass('coveo-hidden-query-breadcrumb-title');
            Dom_1.$$(title).text(this.options.title);
            elem.appendChild(title);
            var value = Dom_1.$$('span', { className: 'coveo-hidden-query-breadcrumb-value' }, _.escape(description)).el;
            elem.appendChild(value);
            var clear = Dom_1.$$('span', { className: 'coveo-hidden-query-breadcrumb-clear' }, SVGIcons_1.SVGIcons.icons.mainClear);
            value.appendChild(clear.el);
            Dom_1.$$(value).on('click', function () { return _this.clear(); });
            args.breadcrumbs.push({
                element: elem
            });
        }
    };
    HiddenQuery.prototype.getDescription = function () {
        var description = this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.hd);
        if (_.isEmpty(description)) {
            description = this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.hq);
        }
        if (!_.isEmpty(description)) {
            if (description.length > this.options.maximumDescriptionLength) {
                description = description.slice(0, this.options.maximumDescriptionLength) + ' ...';
            }
        }
        return description;
    };
    HiddenQuery.ID = 'HiddenQuery';
    HiddenQuery.doExport = function () {
        GlobalExports_1.exportGlobally({
            HiddenQuery: HiddenQuery
        });
    };
    /**
     * Possible options for the `HiddenQuery` component
     * @componentOptions
     */
    HiddenQuery.options = {
        /**
         * Specifies the maximum number of characters from the hidden query description (`hd`) to display in the
         * {@link Breadcrumb}.
         *
         * Beyond this length, the HiddenQuery component slices the rest of the description and replaces it by `...`.
         *
         * Default value is `100`. Minimum value is `0`.
         */
        maximumDescriptionLength: ComponentOptions_1.ComponentOptions.buildNumberOption({ min: 0, defaultValue: 100 }),
        /**
         * Specifies the title that should appear in the {@link Breadcrumb} when the HiddenQuery populates it.
         *
         * Default value is the localized string f
         * or `"Additional filters:"`
         */
        title: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            localizedString: function () { return Strings_1.l('AdditionalFilters') + ':'; }
        })
    };
    return HiddenQuery;
}(Component_1.Component));
exports.HiddenQuery = HiddenQuery;
Initialization_1.Initialization.registerAutoCreateComponent(HiddenQuery);


/***/ }),

/***/ 615:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=HiddenQuery__b6f3a40b26ad27101c27.js.map