webpackJsonpCoveo__temporary([54],{

/***/ 190:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var Strings_1 = __webpack_require__(6);
__webpack_require__(573);
var Utils_1 = __webpack_require__(4);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A multi select widget with standard styling.
 */
var MultiSelect = /** @class */ (function () {
    /**
     * Creates a new `MultiSelect`.
     * @param onChange The function to call when the widget selected values change. This function takes the current
     * `MultiSelect` instance as an argument.
     * @param options The values which can be selected with the multi select.
     * @param label The label to display for the multi select.
     */
    function MultiSelect(onChange, options, label) {
        if (onChange === void 0) { onChange = function (multiSelect) { }; }
        this.onChange = onChange;
        this.options = options;
        this.label = label;
        this.buildContent();
    }
    MultiSelect.doExport = function () {
        GlobalExports_1.exportGlobally({
            MultiSelect: MultiSelect
        });
    };
    /**
     * Gets the element on which the multi select is bound.
     * @returns {HTMLSelectElement} The multi select element.
     */
    MultiSelect.prototype.build = function () {
        return this.element;
    };
    /**
     * Gets the element on which the multi select is bound.
     * @returns {HTMLSelectElement} The multi select element.
     */
    MultiSelect.prototype.getElement = function () {
        return this.element;
    };
    /**
     * Gets the currently selected values.
     * @returns {string[]} The array of selected multi select values.
     */
    MultiSelect.prototype.getValue = function () {
        return _.chain(this.element.options)
            .toArray()
            .filter(function (opt) { return opt.selected; })
            .map(function (selected) { return selected.value; })
            .value();
    };
    /**
     * Gets the currently un-selected values.
     * @returns {string[]} The array of un-selected multi select values.
     */
    MultiSelect.prototype.getUnselectedValues = function () {
        return _.chain(this.element.options)
            .toArray()
            .filter(function (opt) { return !opt.selected; })
            .map(function (selected) { return selected.value; })
            .value();
    };
    /**
     * Sets the currently selected values.
     * @param values The values to select.
     */
    MultiSelect.prototype.setValue = function (values) {
        var currentlySelected = this.getValue();
        var currentStateSplit = _.partition(_.toArray(this.element.options), function (opt) {
            return _.contains(currentlySelected, opt.value);
        });
        var newStateToApplySplit = _.partition(_.toArray(this.element.options), function (opt) { return _.contains(values, opt.value); });
        _.each(newStateToApplySplit[0], function (toSelect) { return (toSelect.selected = true); });
        _.each(newStateToApplySplit[1], function (toUnSelect) { return (toUnSelect.selected = false); });
        var hasChanged = false;
        if (!Utils_1.Utils.arrayEqual(currentStateSplit[0], newStateToApplySplit[0], false)) {
            hasChanged = true;
        }
        if (!Utils_1.Utils.arrayEqual(currentStateSplit[1], newStateToApplySplit[1], false)) {
            hasChanged = true;
        }
        if (hasChanged) {
            Dom_1.$$(this.element).trigger('change');
        }
    };
    /**
     * Resets the multi select.
     */
    MultiSelect.prototype.reset = function () {
        var currentlySelected = this.getValue();
        this.element.selectedIndex = -1;
        if (!Utils_1.Utils.isEmptyArray(currentlySelected)) {
            Dom_1.$$(this.element).trigger('change');
        }
    };
    MultiSelect.prototype.buildContent = function () {
        var _this = this;
        this.element = Dom_1.$$('select', {
            className: 'coveo-multi-select',
            multiple: '',
            size: this.options.length.toString()
        }).el;
        var optgroup = Dom_1.$$('optgroup', {
            className: 'coveo-list-group',
            label: this.label
        });
        var options = _.map(this.options, function (opt) {
            return Dom_1.$$('option', { value: opt, className: 'coveo-list-item' }, Strings_1.l(opt));
        });
        _.each(options, function (opt) { return optgroup.append(opt.el); });
        this.element.appendChild(optgroup.el);
        Dom_1.$$(this.element).on('change', function () { return _this.onChange(_this); });
    };
    return MultiSelect;
}());
exports.MultiSelect = MultiSelect;


/***/ }),

/***/ 573:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=MultiSelect__ec82d15c0e890cb8a4e5.js.map