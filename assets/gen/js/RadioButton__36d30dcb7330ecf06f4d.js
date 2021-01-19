webpackJsonpCoveo__temporary([53],{

/***/ 555:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
__webpack_require__(555);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A radio button widget with standard styling.
 */
var RadioButton = /** @class */ (function () {
    /**
     * Creates a new `RadioButton`.
     * @param onChange The function to call when the radio button value changes. This function takes the current
     * `RadioButton` instance as an argument.
     * @param label The label to display next to the radio button.
     * @param name The value to set the `input` HTMLElement `name` attribute to.
     */
    function RadioButton(onChange, label, name, id) {
        if (onChange === void 0) { onChange = function (radioButton) { }; }
        if (id === void 0) { id = label; }
        this.onChange = onChange;
        this.label = label;
        this.name = name;
        this.id = id;
        this.buildContent();
    }
    RadioButton.doExport = function () {
        GlobalExports_1.exportGlobally({
            RadioButton: RadioButton
        });
    };
    /**
     * Resets the radio button.
     */
    RadioButton.prototype.reset = function () {
        var currentlySelected = this.isSelected();
        this.getRadio().checked = false;
        if (currentlySelected) {
            this.onChange(this);
        }
    };
    /**
     * Select the radio button
     * @param triggerChange will trigger change event if specified and the radio button is not already selected
     */
    RadioButton.prototype.select = function (triggerChange) {
        if (triggerChange === void 0) { triggerChange = true; }
        var currentlySelected = this.isSelected();
        this.getRadio().checked = true;
        if (!currentlySelected && triggerChange) {
            this.onChange(this);
        }
    };
    /**
     * Gets the element on which the radio button is bound.
     * @returns {HTMLElement} The radio button element.
     */
    RadioButton.prototype.build = function () {
        return this.element;
    };
    /**
     * Gets the element on which the radio button is bound.
     * @returns {HTMLElement} The radio button element.
     */
    RadioButton.prototype.getElement = function () {
        return this.element;
    };
    RadioButton.prototype.getValue = function () {
        return this.label;
    };
    /**
     * Indicates whether the radio button is selected.
     * @returns {boolean} `true` if the radio button is selected, `false` otherwise.
     */
    RadioButton.prototype.isSelected = function () {
        return this.getRadio().checked;
    };
    /**
     * Gets the `input` element (the radio button itself).
     * @returns {HTMLInputElement} The `input` element.
     */
    RadioButton.prototype.getRadio = function () {
        return Dom_1.$$(this.element).find('input');
    };
    /**
     * Gets the radio button [`label`]{@link RadioButton.label} element.
     * @returns {HTMLLabelElement} The `label` element.
     */
    RadioButton.prototype.getLabel = function () {
        return Dom_1.$$(this.element).find('label');
    };
    RadioButton.prototype.buildContent = function () {
        var _this = this;
        var radioOption = Dom_1.$$('div', { className: 'coveo-radio' });
        var radioInput = Dom_1.$$('input', { type: 'radio', name: this.name, id: this.id });
        var labelInput = Dom_1.$$('label', { className: 'coveo-radio-input-label', for: this.id });
        labelInput.text(this.label);
        radioInput.on('change', function () {
            _this.onChange(_this);
        });
        radioOption.append(radioInput.el);
        radioOption.append(labelInput.el);
        this.element = radioOption.el;
    };
    return RadioButton;
}());
exports.RadioButton = RadioButton;


/***/ })

});
//# sourceMappingURL=RadioButton__36d30dcb7330ecf06f4d.js.map