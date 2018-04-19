webpackJsonpCoveo__temporary([71],{

/***/ 129:
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
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var Assert_1 = __webpack_require__(5);
var QueryUtils_1 = __webpack_require__(19);
var Initialization_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var FileTypes_1 = __webpack_require__(89);
var Dom_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(3);
/**
 * The Icon component outputs the corresponding icon for a given file type. The component searches for a suitable icon
 * from those available in the Coveo JavaScript Search Framework. If the component finds no suitable icon, it instead
 * outputs a generic icon.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
var Icon = /** @class */ (function (_super) {
    __extends(Icon, _super);
    /**
     * Creates a new Icon component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Icon component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function Icon(element, options, bindings, result) {
        var _this = _super.call(this, element, Icon.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Icon, options);
        _this.result = _this.result || _this.resolveResult();
        Assert_1.Assert.exists(_this.result);
        var possibleInternalQuickview = Dom_1.$$(_this.element).find('.' + Component_1.Component.computeCssClassNameForType('Quickview'));
        if (!Utils_1.Utils.isNullOrUndefined(possibleInternalQuickview) && QueryUtils_1.QueryUtils.hasHTMLVersion(_this.result)) {
            Dom_1.$$(_this.element).addClass('coveo-with-quickview');
            Dom_1.$$(_this.element).on('click', function () {
                var qv = Component_1.Component.get(possibleInternalQuickview);
                qv.open();
            });
        }
        Icon.createIcon(_this.result, _this.options, element, bindings);
        return _this;
    }
    Icon.createIcon = function (result, options, element, bindings) {
        if (options === void 0) { options = {}; }
        if (element === void 0) { element = Dom_1.$$('div').el; }
        var info = FileTypes_1.FileTypes.get(result);
        if (!bindings && result.searchInterface) {
            // try to resolve results bindings automatically
            bindings = result.searchInterface.getBindings();
        }
        info = Icon.preprocessIconInfo(options, info);
        Dom_1.$$(element).toggleClass('coveo-small', options.small === true);
        if (options.value != undefined) {
            if (options.small === true) {
                if (options.value.indexOf('-small') == -1) {
                    info.icon += '-small';
                }
            }
            if (options.small === false) {
                if (options.value.indexOf('-small') != -1) {
                    info.icon = info.icon.replace('-small', '');
                }
            }
        }
        Dom_1.$$(element).addClass(info.icon);
        element.setAttribute('title', info.caption);
        if (Icon.shouldDisplayLabel(options, bindings)) {
            element.appendChild(Dom_1.$$('span', {
                className: 'coveo-icon-caption-overlay'
            }, info.caption).el);
            Dom_1.$$(element).addClass('coveo-icon-with-caption-overlay');
            Dom_1.$$(element).setAttribute('data-with-label', 'true');
        }
        return element;
    };
    Icon.shouldDisplayLabel = function (options, bindings) {
        // If withLabel is explicitely set to false, the label will never display
        // If withLabel is explicitely set to true, the label will always display
        // If withLabel is set to default value (not a hard true or false), the label will display based on ./core/filetypes/**.json
        // with the property shouldDisplayLabel set on each file type/ objecttype
        // In this case, the generated css will take care of outputting the correct css to display : block
        return options.withLabel !== false;
    };
    Icon.preprocessIconInfo = function (options, info) {
        if (options.labelValue != null) {
            info.caption = options.labelValue;
        }
        if (options.value != null) {
            info.icon = 'coveo-icon ' + options.value;
        }
        if (info.caption == null) {
            info.caption = '';
        }
        if (info.icon == null) {
            info.icon = 'coveo-icon coveo-sprites-custom';
        }
        return info;
    };
    Icon.ID = 'Icon';
    Icon.doExport = function () {
        GlobalExports_1.exportGlobally({
            Icon: Icon
        });
    };
    /**
     * The options for the Icon
     * @componentOptions
     */
    Icon.options = {
        /**
         * Specifies the value that the Icon component should output as its CSS class instead of the auto-selected value.
         *
         * Default value is `undefined`, which means that the Coveo JavaScript Search Framework outputs a suitable icon
         * depending on the result file type.
         */
        value: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies whether the Icon component should output the smaller version of the icon instead of the regular one.
         *
         * Default value is `undefined`.
         */
        small: ComponentOptions_1.ComponentOptions.buildBooleanOption(),
        /**
         * Specifies whether the Icon component should force the output icon to display its caption/label.
         *
         * **Note:**
         *
         * > Due to limited screen real estate, setting this option to `true` has no effect on icons used inside Coveo for
         * > Salesforce Insight Panels.
         *
         * Default value is `undefined`, which means that the Coveo JavaScript Search Framework determines whether the icon
         * needs to display a caption/label depending on the result file type.
         */
        withLabel: ComponentOptions_1.ComponentOptions.buildBooleanOption(),
        /**
         * Specifies what text to display as the icon caption/label.
         *
         * Default value is `undefined`, which means that the Coveo JavaScript Search Framework determines what text the icon
         * needs to display depending on the result file type.
         */
        labelValue: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption()
    };
    return Icon;
}(Component_1.Component));
exports.Icon = Icon;
Initialization_1.Initialization.registerAutoCreateComponent(Icon);


/***/ })

});
//# sourceMappingURL=Icon__7adec7eb6144877a5629.js.map