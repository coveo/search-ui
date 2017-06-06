webpackJsonpCoveo__temporary([65],{

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(3);
var GlobalExports_1 = __webpack_require__(4);
/**
 * A numeric spinner widget with standard styling.
 */
var NumericSpinner = (function () {
    /**
     * Creates a new `NumericSpinner`.
     * @param onChange The function to call when the numeric spinner value changes. This function takes the current
     * `NumericSpinner` instance as an argument.
     * @param min The minimum possible value of the numeric spinner.
     * @param max The maximum possible value of the numeric spinner.
     */
    function NumericSpinner(onChange, min, max) {
        if (onChange === void 0) { onChange = function (numericSpinner) {
        }; }
        if (min === void 0) { min = 0; }
        this.onChange = onChange;
        this.min = min;
        this.max = max;
        this.buildContent();
        this.bindEvents();
    }
    NumericSpinner.doExport = function () {
        GlobalExports_1.exportGlobally({
            'NumericSpinner': NumericSpinner
        });
    };
    /**
     * Resets the numeric spinner.
     */
    NumericSpinner.prototype.reset = function () {
        this.getSpinnerInput().value = '';
        this.onChange(this);
    };
    /**
     * Gets the element on which the numeric spinner is bound.
     * @returns {HTMLInputElement} The numeric spinner element.
     */
    NumericSpinner.prototype.getElement = function () {
        return this.element;
    };
    /**
     * Gets the numeric spinner currently selected value (as a string).
     * @returns {string} The numeric spinner value.
     */
    NumericSpinner.prototype.getValue = function () {
        return this.getSpinnerInput().value;
    };
    /**
     * Gets the numeric spinner currently selected value (as an integer).
     * @returns {number} The numeric spinner value.
     */
    NumericSpinner.prototype.getIntValue = function () {
        return this.getSpinnerInput().value ? parseInt(this.getSpinnerInput().value, 10) : this.min;
    };
    /**
     * Gets the numeric spinner currently selected value (as a float).
     * @returns {number} The numeric spinner value.
     */
    NumericSpinner.prototype.getFloatValue = function () {
        return this.getSpinnerInput().value ? parseFloat(this.getSpinnerInput().value) : this.min;
    };
    /**
     * Sets the numeric spinner value.
     *
     * @param value The value to set the numeric spinner to. If `value` is greater than [`max`]{@link NumericSpinner.max},
     * this method sets the numeric spinner to its maximum value instead. Likewise, if value is lesser than
     * [`min`]{@link NumericSpinner.min}, the method sets the numeric spinner to its minimum value.
     */
    NumericSpinner.prototype.setValue = function (value) {
        if (this.max && value > this.max) {
            value = this.max;
        }
        if (value < this.min) {
            value = this.min;
        }
        this.getSpinnerInput().value = value.toString();
        this.onChange(this);
    };
    /**
     * Gets the element on which the numeric spinner is bound.
     * @returns {HTMLInputElement} The numeric spinner element.
     */
    NumericSpinner.prototype.build = function () {
        return this.element;
    };
    NumericSpinner.prototype.buildContent = function () {
        var numericSpinner = Dom_1.$$('div', { className: 'coveo-numeric-spinner' });
        var numberInput = Dom_1.$$('input', { className: 'coveo-number-input', type: 'text' });
        var addOn = Dom_1.$$('span', { className: 'coveo-add-on' });
        addOn.el.innerHTML = "<div class=\"coveo-spinner-up\">\n                              <i class=\"coveo-sprites-arrow-up\"></i>\n                          </div>\n                          <div class=\"coveo-spinner-down\">\n                              <i class=\"coveo-sprites-arrow-down\"></i>\n                          </div>";
        numericSpinner.append(numberInput.el);
        numericSpinner.append(addOn.el);
        this.element = numericSpinner.el;
    };
    NumericSpinner.prototype.bindEvents = function () {
        var _this = this;
        var up = Dom_1.$$(this.element).find('.coveo-spinner-up');
        Dom_1.$$(up).on('click', function () {
            _this.setValue(_this.getFloatValue() + 1);
        });
        var down = Dom_1.$$(this.element).find('.coveo-spinner-down');
        Dom_1.$$(down).on('click', function () {
            _this.setValue(_this.getFloatValue() - 1);
        });
        var numberInput = Dom_1.$$(this.element).find('input');
        Dom_1.$$(numberInput).on('input', function () {
            if (numberInput.value.match(/[0-9]*/)) {
                _this.onChange(_this);
            }
        });
    };
    NumericSpinner.prototype.getSpinnerInput = function () {
        return Dom_1.$$(this.element).find('.coveo-number-input');
    };
    return NumericSpinner;
}());
exports.NumericSpinner = NumericSpinner;


/***/ })

});
//# sourceMappingURL=NumericSpinner.js.map