webpackJsonpCoveo__temporary([74],{

/***/ 240:
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
var Initialization_1 = __webpack_require__(2);
var Assert_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(25);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(598);
var SVGIcons_1 = __webpack_require__(12);
var SVGDom_1 = __webpack_require__(16);
/**
 * The `CardActionBar` component displays an action bar at the bottom of a card result (see
 * [Result Layouts](https://docs.coveo.com/en/360/)). It is a simple container for buttons or complementary
 * information.
 *
 * You should place this component at the bottom of a card result template (i.e., as the last child of the surrounding
 * `coveo-result-frame` div).
 *
 * See [Using the CardActionBar Component](https://docs.coveo.com/en/1349/#using-the-cardactionbar-component)
 */
var CardActionBar = /** @class */ (function (_super) {
    __extends(CardActionBar, _super);
    /**
     * Creates a new `CardActionBar` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The parent [query result]{@link IQueryResult}..
     */
    function CardActionBar(element, options, bindings, result) {
        var _this = _super.call(this, element, CardActionBar.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.removedTabIndexElements = [];
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, CardActionBar, options);
        _this.parentResult = Dom_1.$$(_this.element).closest('CoveoResult');
        Assert_1.Assert.check(_this.parentResult !== undefined, 'ActionBar needs to be a child of a Result');
        if (_this.options.hidden) {
            Dom_1.$$(_this.parentResult).addClass('coveo-clickable');
            _this.appendArrow();
            _this.bindEvents();
            _.forEach(Dom_1.$$(_this.element).findAll('*'), function (elem) {
                if (elem.hasAttribute('tabindex') && elem.getAttribute('tabindex') == '0') {
                    _this.removedTabIndexElements.push(elem);
                    elem.removeAttribute('tabindex');
                }
            });
        }
        else {
            _this.element.style.transition = 'none';
            _this.element.style.transform = 'none';
        }
        return _this;
    }
    /**
     * Shows the component.
     */
    CardActionBar.prototype.show = function () {
        Dom_1.$$(this.element).addClass('coveo-opened');
        _.forEach(this.removedTabIndexElements, function (e) {
            e.setAttribute('tabindex', '0');
        });
    };
    /**
     * Hides the component.
     */
    CardActionBar.prototype.hide = function () {
        Dom_1.$$(this.element).removeClass('coveo-opened');
        _.forEach(this.removedTabIndexElements, function (e) {
            e.removeAttribute('tabindex');
        });
    };
    CardActionBar.prototype.bindEvents = function () {
        var _this = this;
        Dom_1.$$(this.parentResult).on('click', function () { return _this.show(); });
        Dom_1.$$(this.parentResult).on('mouseleave', function () { return _this.hide(); });
        Dom_1.$$(this.element).on('focusin', function () { return _this.show(); });
        Dom_1.$$(this.element).on('focusout', function () { return _this.hide(); });
        if (this.options.openOnMouseOver) {
            Dom_1.$$(this.arrowContainer).on('mouseenter', function () { return _this.show(); });
        }
    };
    CardActionBar.prototype.appendArrow = function () {
        var _this = this;
        this.arrowContainer = Dom_1.$$('div', { className: 'coveo-card-action-bar-arrow-container', tabindex: 0 }).el;
        this.bind.on(this.arrowContainer, 'keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function () { return _this.show(); }));
        var arrowUp = Dom_1.$$('span', { className: 'coveo-icon coveo-card-action-bar-arrow-icon' }, SVGIcons_1.SVGIcons.icons.arrowUp);
        SVGDom_1.SVGDom.addClassToSVGInContainer(arrowUp.el, 'coveo-card-action-bar-arrow-svg');
        this.arrowContainer.appendChild(arrowUp.el);
        this.parentResult.appendChild(this.arrowContainer);
    };
    CardActionBar.ID = 'CardActionBar';
    CardActionBar.doExport = function () {
        GlobalExports_1.exportGlobally({
            CardActionBar: CardActionBar
        });
    };
    /**
     * @componentOptions
     */
    CardActionBar.options = {
        /**
         * Whether to hide the component by default and append a visual indicator to its parent query result.
         *
         * If this option is set to `true`, the component will show itself when the user clicks its parent query result.
         *
         * Default value is `true`.
         */
        hidden: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Whether to open the `CardActionBar` when the cursor hovers over it.
         *
         * This option is only meaningful when [`hidden`]{@link CardActionBar.options.hidden} is set to `true`.
         *
         * Default value is `true`.
         */
        openOnMouseOver: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true, depend: 'hidden' })
    };
    return CardActionBar;
}(Component_1.Component));
exports.CardActionBar = CardActionBar;
Initialization_1.Initialization.registerAutoCreateComponent(CardActionBar);


/***/ }),

/***/ 598:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=CardActionBar__36d30dcb7330ecf06f4d.js.map