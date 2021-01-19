webpackJsonpCoveo__temporary([78],{

/***/ 191:
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
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var Initialization_1 = __webpack_require__(2);
var QueryStateModel_1 = __webpack_require__(13);
/**
 * The SearchButton component renders a search icon that the end user can click to trigger a new query.
 *
 * See also the {@link Searchbox} component, which can automatically instantiate a SearchButton component along with a
 * {@link Querybox} component or an {@link Omnibox} component.
 */
var SearchButton = /** @class */ (function (_super) {
    __extends(SearchButton, _super);
    /**
     * Creates a new SearchButton. Binds a `click` event on the element. Adds a search icon on the element.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the SearchButton component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function SearchButton(element, options, bindings) {
        var _this = _super.call(this, element, SearchButton.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        new AccessibleButton_1.AccessibleButton()
            .withElement(element)
            .withOwner(_this.bind)
            .withLabel(Strings_1.l('Search'))
            .withSelectAction(function () { return _this.handleClick(); })
            .build();
        // Provide a magnifier icon if element contains nothing
        if (Utils_1.Utils.trim(Dom_1.$$(_this.element).text()) == '') {
            var svgMagnifierContainer = Dom_1.$$('span', { className: 'coveo-search-button' }, SVGIcons_1.SVGIcons.icons.search).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(svgMagnifierContainer, 'coveo-search-button-svg');
            var svgLoadingAnimationContainer = Dom_1.$$('span', { className: 'coveo-search-button-loading' }, SVGIcons_1.SVGIcons.icons.loading).el;
            SVGDom_1.SVGDom.addClassToSVGInContainer(svgLoadingAnimationContainer, 'coveo-search-button-loading-svg');
            element.appendChild(svgMagnifierContainer);
            element.appendChild(svgLoadingAnimationContainer);
        }
        return _this;
    }
    /**
     * Triggers the `click` event handler, which logs a `searchboxSubmit` event in the usage analytics and executes a
     * query.
     */
    SearchButton.prototype.click = function () {
        this.handleClick();
    };
    SearchButton.prototype.handleClick = function () {
        this.logger.debug('Performing query following button click');
        this.updateQueryStateModelWithSearchboxQuery();
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit, {});
        this.queryController.executeQuery({ origin: this });
    };
    SearchButton.prototype.updateQueryStateModelWithSearchboxQuery = function () {
        var searchbox = this.options && this.options.searchbox;
        searchbox && this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, searchbox.getText());
    };
    SearchButton.ID = 'SearchButton';
    SearchButton.doExport = function () {
        GlobalExports_1.exportGlobally({
            SearchButton: SearchButton
        });
    };
    SearchButton.options = {};
    return SearchButton;
}(Component_1.Component));
exports.SearchButton = SearchButton;
Initialization_1.Initialization.registerAutoCreateComponent(SearchButton);


/***/ })

});
//# sourceMappingURL=SearchButton__ec82d15c0e890cb8a4e5.js.map