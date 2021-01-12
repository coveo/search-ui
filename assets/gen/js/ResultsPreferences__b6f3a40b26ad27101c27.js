webpackJsonpCoveo__temporary([23,53,55],{

/***/ 136:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
__webpack_require__(561);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A simple `fieldset` HTMLElement containing multiple form widgets.
 */
var FormGroup = /** @class */ (function () {
    /**
     * Creates a new `FormGroup`.
     * @param contents The form widgets to include in the form group.
     * @param label The label to display for the form group.
     */
    function FormGroup(contents, label) {
        var _this = this;
        this.labelElement = Dom_1.$$('span', { className: 'coveo-form-group-label' });
        this.labelElement.text(label);
        this.element = Dom_1.$$('fieldset', { className: 'coveo-form-group' }, this.labelElement);
        _.each(contents, function (content) {
            _this.element.append(content.build());
        });
    }
    FormGroup.doExport = function () {
        GlobalExports_1.exportGlobally({
            FormGroup: FormGroup
        });
    };
    /**
     * Gets the element on which the form group is bound.
     * @returns {HTMLElement} The form group element.
     */
    FormGroup.prototype.build = function () {
        return this.element.el;
    };
    return FormGroup;
}());
exports.FormGroup = FormGroup;


/***/ }),

/***/ 274:
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
__webpack_require__(661);
var _ = __webpack_require__(0);
var PreferencesPanelEvents_1 = __webpack_require__(96);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var Defer_1 = __webpack_require__(31);
var ComponentOptionsModel_1 = __webpack_require__(28);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var StorageUtils_1 = __webpack_require__(205);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var Checkbox_1 = __webpack_require__(64);
var FormGroup_1 = __webpack_require__(136);
var RadioButton_1 = __webpack_require__(94);
/**
 * The ResultsPreferences component allows the end user to select preferences related to the search results. These
 * preferences are then saved in the local storage of the end user.
 *
 * This component is normally accessible through the {@link Settings} menu. Its usual location in the DOM is inside the
 * {@link PreferencesPanel} component.
 *
 * See also the {@link ResultsFiltersPreferences} component.
 */
var ResultsPreferences = /** @class */ (function (_super) {
    __extends(ResultsPreferences, _super);
    /**
     * Creates a new ResultsPreference component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the ResultsPreferences component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function ResultsPreferences(element, options, bindings) {
        var _this = _super.call(this, element, ResultsPreferences.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.preferencePanelCheckboxInputs = {};
        _this.preferencePanelRadioInputs = {};
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultsPreferences, options);
        _this.preferencesPanel = Dom_1.$$(_this.element).closest(Component_1.Component.computeCssClassNameForType('PreferencesPanel'));
        _this.preferencePanelLocalStorage = new StorageUtils_1.StorageUtils(ResultsPreferences.ID);
        Assert_1.Assert.exists(_this.componentOptionsModel);
        Assert_1.Assert.exists(window.localStorage);
        Assert_1.Assert.exists(_this.preferencesPanel);
        _this.preferences = _this.preferencePanelLocalStorage.load() || {};
        _this.adjustPreferencesToComponentConfig();
        ComponentOptions_1.ComponentOptions.initComponentOptions(_this.element, ResultsPreferences, _this.options);
        _this.updateComponentOptionsModel();
        _this.bind.on(_this.preferencesPanel, PreferencesPanelEvents_1.PreferencesPanelEvents.savePreferences, function () { return _this.save(); });
        _this.bind.on(_this.preferencesPanel, PreferencesPanelEvents_1.PreferencesPanelEvents.exitPreferencesWithoutSave, function () { return _this.exitWithoutSave(); });
        _this.buildCheckboxesInput();
        _this.buildRadiosInput();
        return _this;
    }
    /**
     * Saves the current state of the ResultsPreferences component in the local storage.
     */
    ResultsPreferences.prototype.save = function () {
        this.fromInputToPreferences();
        this.logger.info('Saving preferences', this.preferences);
        this.preferencePanelLocalStorage.save(this.preferences);
        this.updateComponentOptionsModel();
    };
    ResultsPreferences.prototype.exitWithoutSave = function () {
        this.fromPreferencesToCheckboxInput();
    };
    ResultsPreferences.prototype.updateComponentOptionsModel = function () {
        var resultLinkOption = _.pick(this.preferences, 'openInOutlook', 'alwaysOpenInNewWindow');
        var searchBoxOption = _.pick(this.preferences, 'enableQuerySyntax');
        this.componentOptionsModel.set(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.resultLink, resultLinkOption);
        this.componentOptionsModel.set(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchBox, searchBoxOption);
    };
    ResultsPreferences.prototype.buildRadiosInput = function () {
        var _this = this;
        if (this.options.enableQuerySyntax) {
            var createRadioButton_1 = function (label) {
                var radio = new RadioButton_1.RadioButton(function (radioButtonInstance) {
                    _this.fromPreferenceChangeEventToUsageAnalyticsLog(radioButtonInstance.isSelected() ? 'selected' : 'unselected', label);
                    _this.save();
                    _this.queryController.executeQuery({
                        closeModalBox: false
                    });
                }, label, 'coveo-results-preferences-query-syntax');
                return radio;
            };
            var translatedLabels = _.map(['On', 'Off', 'Automatic'], function (label) { return Strings_1.l(label); });
            var radios = _.map(translatedLabels, function (label) {
                var radio = createRadioButton_1(label);
                _this.preferencePanelRadioInputs[label] = radio;
                return radio;
            });
            var formGroup = new FormGroup_1.FormGroup(radios, Strings_1.l('EnableQuerySyntax'));
            Dom_1.$$(this.element).append(formGroup.build());
            this.fromPreferencesToRadioInput();
        }
    };
    ResultsPreferences.prototype.buildCheckboxesInput = function () {
        var _this = this;
        var createCheckbox = function (label) {
            var checkbox = new Checkbox_1.Checkbox(function (checkboxInstance) {
                _this.fromPreferenceChangeEventToUsageAnalyticsLog(checkboxInstance.isSelected() ? 'selected' : 'unselected', label);
                _this.save();
                _this.queryController.executeQuery({
                    closeModalBox: false
                });
            }, label);
            _this.preferencePanelCheckboxInputs[label] = checkbox;
            return checkbox;
        };
        var checkboxes = [];
        if (this.options.enableOpenInOutlook) {
            checkboxes.push(createCheckbox(Strings_1.l('OpenInOutlookWhenPossible')));
        }
        if (this.options.enableOpenInNewWindow) {
            checkboxes.push(createCheckbox(Strings_1.l('AlwaysOpenInNewWindow')));
        }
        this.element.appendChild(new FormGroup_1.FormGroup(checkboxes, Strings_1.l('ResultLinks')).build());
        this.fromPreferencesToCheckboxInput();
    };
    ResultsPreferences.prototype.fromInputToPreferences = function () {
        var _this = this;
        this.preferences = this.preferences || {
            openInOutlook: false,
            alwaysOpenInNewWindow: false,
            enableQuerySyntax: undefined
        };
        _.each(this.preferencePanelCheckboxInputs, function (checkbox, label) {
            if (label == Strings_1.l('OpenInOutlookWhenPossible')) {
                if (_this.isSelected(Strings_1.l('OpenInOutlookWhenPossible'), label, checkbox)) {
                    _this.preferences.openInOutlook = true;
                }
                else if (_this.preferences.openInOutlook != null) {
                    _this.preferences.openInOutlook = false;
                }
            }
            if (label == Strings_1.l('AlwaysOpenInNewWindow')) {
                if (_this.isSelected(Strings_1.l('AlwaysOpenInNewWindow'), label, checkbox)) {
                    _this.preferences.alwaysOpenInNewWindow = true;
                }
                else if (_this.preferences.alwaysOpenInNewWindow != null) {
                    _this.preferences.alwaysOpenInNewWindow = false;
                }
            }
        });
        _.each(this.preferencePanelRadioInputs, function (radio, label) {
            if (_this.isSelected(Strings_1.l('On'), label, radio)) {
                _this.preferences.enableQuerySyntax = true;
            }
            if (_this.isSelected(Strings_1.l('Off'), label, radio)) {
                _this.preferences.enableQuerySyntax = false;
            }
            if (_this.isSelected(Strings_1.l('Automatic'), label, radio)) {
                delete _this.preferences.enableQuerySyntax;
            }
        });
    };
    ResultsPreferences.prototype.fromPreferencesToCheckboxInput = function () {
        if (this.preferences.openInOutlook) {
            this.preferencePanelCheckboxInputs[Strings_1.l('OpenInOutlookWhenPossible')].select(false);
        }
        if (this.preferences.alwaysOpenInNewWindow) {
            this.preferencePanelCheckboxInputs[Strings_1.l('AlwaysOpenInNewWindow')].select(false);
        }
    };
    ResultsPreferences.prototype.fromPreferencesToRadioInput = function () {
        if (this.preferences.enableQuerySyntax === true) {
            this.preferencePanelRadioInputs[Strings_1.l('On')].select(false);
        }
        else if (this.preferences.enableQuerySyntax === false) {
            this.preferencePanelRadioInputs[Strings_1.l('Off')].select(false);
        }
        else {
            this.preferencePanelRadioInputs[Strings_1.l('Automatic')].select(false);
        }
    };
    ResultsPreferences.prototype.fromPreferenceChangeEventToUsageAnalyticsLog = function (type, preference) {
        this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.preferencesChange, { preferenceName: preference, preferenceType: type }, this.element);
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.preferencesChange, {
            preferenceName: preference,
            preferenceType: type
        });
    };
    ResultsPreferences.prototype.adjustPreferencesToComponentConfig = function () {
        var _this = this;
        // This method is used when there are illogical configuration between what's saved in local storage (the preferences)
        // and how the component is configured.
        // This can happen if an admin change the component configuration after end users have already selected a preferences.
        // We need to adapt the saved preferences to what's actually available in the component
        var needToSave = false;
        if (!this.options.enableOpenInNewWindow) {
            delete this.preferences.alwaysOpenInNewWindow;
            needToSave = true;
        }
        if (!this.options.enableOpenInOutlook) {
            delete this.preferences.openInOutlook;
            needToSave = true;
        }
        if (!this.options.enableQuerySyntax) {
            delete this.preferences.enableQuerySyntax;
            needToSave = true;
        }
        if (needToSave) {
            Defer_1.Defer.defer(function () {
                _this.save();
            });
        }
    };
    ResultsPreferences.prototype.isSelected = function (checkingFor, label, input) {
        return checkingFor == label && input.isSelected();
    };
    ResultsPreferences.ID = 'ResultsPreferences';
    ResultsPreferences.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultsPreferences: ResultsPreferences
        });
    };
    /**
     * The options for the component
     * @componentOptions
     */
    ResultsPreferences.options = {
        /**
         * Specifies whether to make the option to open results in Microsoft Outlook available.
         *
         * Default value is `false`
         */
        enableOpenInOutlook: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies whether to make the option to open results in a new window available.
         *
         * Default value is `true`
         */
        enableOpenInNewWindow: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to make the option to allow end users to turn query syntax on or off available.
         *
         * If query syntax is enabled, the Coveo Platform tries to interpret special query syntax (e.g.,
         * `@objecttype=message`) when the end user types a query in the [`Querybox`]{@link Querybox} (see
         * [Coveo Query Syntax Reference](https://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)). Enabling query
         * syntax also causes the `Querybox` to highlight any query syntax.
         *
         * Selecting **On** for the **Enable query syntax** setting enables query syntax, whereas selecting **Off** disables
         * it. Selecting **Automatic** uses the `Querybox` [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax}
         * option value (which is `false` by default).
         *
         * Default value is `false`
         */
        enableQuerySyntax: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return ResultsPreferences;
}(Component_1.Component));
exports.ResultsPreferences = ResultsPreferences;
Initialization_1.Initialization.registerAutoCreateComponent(ResultsPreferences);


/***/ }),

/***/ 555:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 561:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 661:
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
//# sourceMappingURL=ResultsPreferences__b6f3a40b26ad27101c27.js.map