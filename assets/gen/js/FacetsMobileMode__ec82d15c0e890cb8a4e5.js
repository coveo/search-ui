webpackJsonpCoveo__temporary([84],{

/***/ 175:
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
var GlobalExports_1 = __webpack_require__(3);
var Core_1 = __webpack_require__(20);
var Initialization_1 = __webpack_require__(2);
/**
 * This component lets you customize the mobile responsive behavior of facets in your search interface.
 *
 * **Notes:**
 * - You can include this component anywhere under the root element of your search interface.
 * - You should only include this component once in your search interface.
 * - If you do not include this component in your search interface, facets will still have a default mobile responsive behavior.
 */
var FacetsMobileMode = /** @class */ (function (_super) {
    __extends(FacetsMobileMode, _super);
    function FacetsMobileMode(element, options, bindings) {
        var _this = _super.call(this, element, FacetsMobileMode.ID, bindings) || this;
        _this.element = element;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, FacetsMobileMode, options);
        if (_this.options.preventScrolling) {
            var scrollContainer = _this.options.scrollContainer || _this.searchInterface.element;
            _this.options.scrollContainer = ComponentOptions_1.ComponentOptions.findParentScrollLockable(scrollContainer);
        }
        return _this;
    }
    FacetsMobileMode.ID = 'FacetsMobileMode';
    /**
     * @componentOptions
     */
    FacetsMobileMode.options = {
        /**
         * The screen width (in number of pixels) at which facets should enter mobile responsive mode and be collapsed under a single button.
         *
         * **Default:** `800`
         */
        breakpoint: ComponentOptions_1.ComponentOptions.buildNumberOption(),
        /**
         * Whether to display the facets in a modal instead of a pop-up when the end user expands them in mobile responsive mode.
         */
        isModal: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Whether to display an overlay behind the facets when the end user expands them in mobile responsive mode.
         *
         * By default, the following behavior applies:
         * - `true` when [isModal]{@link FacetsMobileMode.options.isModal} is `false`
         * - `false` when [isModal]{@link FacetsMobileMode.options.isModal} is `true`
         */
        displayOverlayWhileOpen: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            postProcessing: function (value, options) { return (Core_1.Utils.isNullOrUndefined(value) ? !options.isModal : value); }
        }),
        /**
         * Whether to disable vertical scrolling on the specified or resolved [`scrollContainer`]{@link FacetsMobileMode.options.scrollContainer} while facets are expanded in mobile responsive mode.
         *
         * By default, the following behavior applies:
         * - `true` when [isModal]{@link FacetsMobileMode.options.isModal} is `true`
         * - `false` when [isModal]{@link FacetsMobileMode.options.isModal} is `false`
         */
        preventScrolling: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            postProcessing: function (value, options) { return (Core_1.Utils.isNullOrUndefined(value) ? options.isModal : value); }
        }),
        /**
         * The HTML element whose vertical scrolling should be locked while facets are expanded in mobile responsive mode.
         *
         * By default, the component tries to detect and use the first ancestor element whose CSS `overflow-y` attribute is set to `scroll`, starting from the `FacetsMobileMode`'s element itself. If no such element is found, the `document.body` element is used.
         *
         * Since this heuristic is not perfect, we strongly recommend that you manually set this option by explicitly specifying the desired CSS selector.
         *
         * **Example:** `data-scroll-container-selector='#someCssSelector'`
         */
        scrollContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption({ depend: 'preventScrolling' })
    };
    FacetsMobileMode.doExport = function () {
        GlobalExports_1.exportGlobally({
            FacetsMobileMode: FacetsMobileMode
        });
    };
    return FacetsMobileMode;
}(Component_1.Component));
exports.FacetsMobileMode = FacetsMobileMode;
Initialization_1.Initialization.registerAutoCreateComponent(FacetsMobileMode);


/***/ })

});
//# sourceMappingURL=FacetsMobileMode__ec82d15c0e890cb8a4e5.js.map