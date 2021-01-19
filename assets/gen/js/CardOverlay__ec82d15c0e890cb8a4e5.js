webpackJsonpCoveo__temporary([46],{

/***/ 241:
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
var CardOverlayEvents_1 = __webpack_require__(599);
var Dom_1 = __webpack_require__(1);
var Assert_1 = __webpack_require__(5);
var KeyboardUtils_1 = __webpack_require__(25);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(600);
var SVGIcons_1 = __webpack_require__(12);
var SVGDom_1 = __webpack_require__(16);
var Utils_1 = __webpack_require__(4);
var Strings_1 = __webpack_require__(6);
/**
 * The CardOverlay component displays a button that the user can click to toggle the visibility of an overlay on top of
 * an {@link IQueryResult}. While this component typically populates a {@link CardActionBar} component, it is actually
 * possible to place a CardOverlay component anywhere in any result.
 *
 * The primary purpose of the CardOverlay component is to display additional information about a result in a format that
 * fits well within a card result layout (see [Result Layouts](https://docs.coveo.com/en/360/)).
 *
 * When initialized, this component creates a `<div class="coveo-card-overlay">` element as the last child of its parent
 * IQueryResult, and displays a button which toggles the visibility of the overlay.
 */
var CardOverlay = /** @class */ (function (_super) {
    __extends(CardOverlay, _super);
    /**
     * Creates a new CardOverlay component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the CardOverlay component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function CardOverlay(element, options, bindings) {
        var _this = _super.call(this, element, CardOverlay.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, CardOverlay, options);
        _this.parentCard = Dom_1.$$(_this.element).closest('.CoveoResult');
        Assert_1.Assert.exists(_this.parentCard);
        Dom_1.$$(_this.parentCard).addClass('coveo-with-card-overlay');
        _this.createOverlay();
        _this.createButton(_this.element);
        _this.closeOverlay();
        return _this;
    }
    /**
     * Toggles the CardOverlay visibility.
     *
     * @param swtch Specifying a value for this parameter forces the component visibility to take the corresponding value
     * (`true` for visible; `false` for hidden).
     */
    CardOverlay.prototype.toggleOverlay = function (swtch) {
        if (swtch !== undefined) {
            swtch ? this.openOverlay() : this.closeOverlay();
        }
        else {
            if (Dom_1.$$(this.overlay).hasClass('coveo-opened')) {
                this.closeOverlay();
            }
            else {
                this.openOverlay();
            }
        }
    };
    /**
     * Opens the CardOverlay.
     *
     * Also triggers the {@link CardOverlayEvents.openCardOverlay} event.
     */
    CardOverlay.prototype.openOverlay = function () {
        Dom_1.$$(this.overlay).removeClass('coveo-hidden-for-tab-nav');
        Dom_1.$$(this.overlay).addClass('coveo-opened');
        Dom_1.$$(this.parentCard).addClass('coveo-card-overlay-opened');
        this.bind.trigger(this.element, CardOverlayEvents_1.CardOverlayEvents.openCardOverlay);
    };
    /**
     * Closes the CardOverlay.
     *
     * Also triggers the {@link CardOverlayEvents.closeCardOverlay} event.
     */
    CardOverlay.prototype.closeOverlay = function () {
        Dom_1.$$(this.overlay).addClass('coveo-hidden-for-tab-nav');
        Dom_1.$$(this.overlay).removeClass('coveo-opened');
        Dom_1.$$(this.parentCard).removeClass('coveo-card-overlay-opened');
        this.bind.trigger(this.element, CardOverlayEvents_1.CardOverlayEvents.closeCardOverlay);
    };
    CardOverlay.prototype.createOverlay = function () {
        var _this = this;
        this.overlay = Dom_1.$$('div', { className: 'coveo-card-overlay' }).el;
        // Create header
        var overlayHeader = Dom_1.$$('div', { className: 'coveo-card-overlay-header' }).el;
        this.createButton(overlayHeader);
        this.overlay.appendChild(overlayHeader);
        // Create body
        var overlayBody = Dom_1.$$('div', { className: 'coveo-card-overlay-body' }).el;
        // Transfer all of element's children to the overlay
        while (this.element.childNodes.length > 0) {
            overlayBody.appendChild(this.element.firstChild);
        }
        this.overlay.appendChild(overlayBody);
        // Create footer
        var icon = Dom_1.$$('span', { className: 'coveo-icon coveo-open-card-overlay' }, SVGIcons_1.SVGIcons.icons.arrowDown);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, 'coveo-open-card-overlay-svg');
        var overlayFooter = Dom_1.$$('div', { className: 'coveo-card-overlay-footer', tabindex: '0' }, icon.el);
        overlayFooter.on('click', function () { return _this.toggleOverlay(false); });
        this.bind.on(overlayFooter.el, 'keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function () { return _this.toggleOverlay(false); }));
        this.overlay.appendChild(overlayFooter.el);
        this.parentCard.appendChild(this.overlay);
    };
    CardOverlay.prototype.createButton = function (element) {
        var _this = this;
        if (this.options.icon) {
            var icon = Dom_1.$$('span', { className: 'coveo-icon ' }, SVGIcons_1.SVGIcons.icons[this.options.icon]).el;
            element.appendChild(icon);
            SVGDom_1.SVGDom.addClassToSVGInContainer(element, "coveo-" + Utils_1.Utils.toDashCase(this.options.icon) + "-svg");
        }
        element.appendChild(Dom_1.$$('span', { className: 'coveo-label' }, this.options.title).el);
        element.setAttribute('tabindex', '0');
        Dom_1.$$(element).on('click', function () { return _this.toggleOverlay(); });
        this.bind.on(element, 'keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function () { return _this.toggleOverlay(); }));
    };
    CardOverlay.ID = 'CardOverlay';
    CardOverlay.doExport = function () {
        GlobalExports_1.exportGlobally({
            CardOverlay: CardOverlay
        });
    };
    /**
     * @componentOptions
     */
    CardOverlay.options = {
        /**
         * Specifies the string to use for the overlay title and for the button text.
         *
         * Setting a value for this option is required for this component to work.
         */
        title: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            required: true,
            localizedString: function () { return Strings_1.l('NoTitle'); }
        }),
        /**
         * Specifies the icon to use for the overlay icon and for the button icon.
         *
         * The name of the icon to use should be specified in dashed case. ie: facet-expand
         */
        icon: ComponentOptions_1.ComponentOptions.buildIconOption()
    };
    return CardOverlay;
}(Component_1.Component));
exports.CardOverlay = CardOverlay;
Initialization_1.Initialization.registerAutoCreateComponent(CardOverlay);


/***/ }),

/***/ 599:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The CardOverlayEvents class contains string definitions for all events related to the {@link CardOverlay} component.
 */
var CardOverlayEvents = /** @class */ (function () {
    function CardOverlayEvents() {
    }
    /**
     * Opening a {@link CardOverlay} component triggers this event (see {@link CardOverlay.openOverlay}).
     *
     * @type {string}
     */
    CardOverlayEvents.openCardOverlay = 'openCardOverlay';
    /**
     * Closing a {@link CardOverlay} component triggers this event (see {@link CardOverlay.closeOverlay}).
     *
     * @type {string}
     */
    CardOverlayEvents.closeCardOverlay = 'closeCardOverlay';
    return CardOverlayEvents;
}());
exports.CardOverlayEvents = CardOverlayEvents;


/***/ }),

/***/ 600:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=CardOverlay__ec82d15c0e890cb8a4e5.js.map