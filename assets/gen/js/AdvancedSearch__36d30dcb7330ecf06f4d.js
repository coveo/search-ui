webpackJsonpCoveo__temporary([13,53,82,83],{

/***/ 120:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
/**
 * A numeric spinner widget with standard styling.
 */
var NumericSpinner = /** @class */ (function () {
    /**
     * Creates a new `NumericSpinner`.
     * @param onChange The function to call when the numeric spinner value changes. This function takes the current
     * `NumericSpinner` instance as an argument.
     * @param min The minimum possible value of the numeric spinner.
     * @param max The maximum possible value of the numeric spinner.
     * @param label The label to use for the input for accessibility purposes.
     */
    function NumericSpinner(onChange, min, max, label) {
        if (onChange === void 0) { onChange = function (numericSpinner) { }; }
        if (min === void 0) { min = 0; }
        this.onChange = onChange;
        this.min = min;
        this.max = max;
        this.label = label;
        this.buildContent();
        this.bindEvents();
    }
    NumericSpinner.doExport = function () {
        GlobalExports_1.exportGlobally({
            NumericSpinner: NumericSpinner
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
        var numberInput = Dom_1.$$('input', {
            className: 'coveo-number-input',
            type: 'text',
            'aria-label': this.label ? Strings_1.l(this.label) : ''
        });
        var addOn = Dom_1.$$('span', { className: 'coveo-add-on' });
        var arrowUp = Dom_1.$$('div', { className: 'coveo-spinner-up' }, SVGIcons_1.SVGIcons.icons.arrowUp);
        SVGDom_1.SVGDom.addClassToSVGInContainer(arrowUp.el, 'coveo-spinner-up-svg');
        var arrowDown = Dom_1.$$('div', { className: 'coveo-spinner-down' }, SVGIcons_1.SVGIcons.icons.arrowDown);
        SVGDom_1.SVGDom.addClassToSVGInContainer(arrowDown.el, 'coveo-spinner-down-svg');
        addOn.append(arrowUp.el);
        addOn.append(arrowDown.el);
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


/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TextInput_1 = __webpack_require__(54);
var AdvancedSearchEvents_1 = __webpack_require__(84);
var Dom_1 = __webpack_require__(1);
var KeywordsInput = /** @class */ (function () {
    function KeywordsInput(inputName, root) {
        this.inputName = inputName;
        this.root = root;
    }
    KeywordsInput.prototype.reset = function () {
        this.clear();
    };
    KeywordsInput.prototype.build = function () {
        this.input = new TextInput_1.TextInput(this.onChange.bind(this), this.inputName);
        return this.input.getElement();
    };
    KeywordsInput.prototype.setValue = function (value) {
        this.input.setValue(value);
    };
    KeywordsInput.prototype.getValue = function () {
        return this.input.getValue();
    };
    KeywordsInput.prototype.clear = function () {
        this.input.setValue('');
    };
    KeywordsInput.prototype.updateQuery = function (queryBuilder) {
        var value = this.getValue();
        if (value) {
            queryBuilder.advancedExpression.add(value);
        }
    };
    KeywordsInput.prototype.onChange = function () {
        if (this.root) {
            Dom_1.$$(this.root).trigger(AdvancedSearchEvents_1.AdvancedSearchEvents.executeAdvancedSearch);
        }
        else if (this.input) {
            Dom_1.$$(this.input.getElement()).trigger(AdvancedSearchEvents_1.AdvancedSearchEvents.executeAdvancedSearch);
        }
    };
    return KeywordsInput;
}());
exports.KeywordsInput = KeywordsInput;


/***/ }),

/***/ 227:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AdvancedSearchEvents_1 = __webpack_require__(84);
var Dom_1 = __webpack_require__(1);
var RadioButton_1 = __webpack_require__(94);
var _ = __webpack_require__(0);
var DateInput = /** @class */ (function () {
    function DateInput(inputName, root) {
        this.inputName = inputName;
        this.root = root;
        this.buildContent();
    }
    DateInput.prototype.reset = function () {
        this.radio.reset();
    };
    DateInput.prototype.build = function () {
        return this.element;
    };
    DateInput.prototype.getElement = function () {
        return this.element;
    };
    DateInput.prototype.isSelected = function () {
        return this.getRadio().checked;
    };
    DateInput.prototype.updateQuery = function (queryBuilder) {
        try {
            var value = this.getValue();
            if (value) {
                queryBuilder.advancedExpression.add(value);
            }
            this.removeErrorMessage();
        }
        catch (error) {
            this.setErrorMessage(error);
        }
    };
    DateInput.prototype.getRadio = function () {
        return Dom_1.$$(this.element).find('input');
    };
    DateInput.prototype.setErrorMessage = function (message) {
        this.removeErrorMessage();
        this.error = Dom_1.$$('div', {
            className: 'coveo-error coveo-error-date-input'
        }, message).el;
        Dom_1.$$(this.element).append(this.error);
    };
    DateInput.prototype.removeErrorMessage = function () {
        if (this.error) {
            Dom_1.$$(this.error).remove();
        }
    };
    DateInput.prototype.buildContent = function () {
        var _this = this;
        this.radio = new RadioButton_1.RadioButton(function () {
            _this.deactivateAllInputs();
            _this.activateSelectedInput();
        }, this.inputName, 'coveo-advanced-search-date-input');
        this.element = this.radio.getElement();
        Dom_1.$$(this.element).addClass('coveo-advanced-search-date-input-section');
        Dom_1.$$(this.radio.getRadio()).addClass('coveo-advanced-search-date');
        Dom_1.$$(this.radio.getLabel()).addClass('coveo-advanced-search-label');
    };
    DateInput.prototype.deactivateAllInputs = function () {
        var elements = Dom_1.$$(this.element.parentElement).findAll('fieldset');
        _.each(elements, function (element) {
            element.disabled = true;
        });
    };
    DateInput.prototype.activateSelectedInput = function () {
        var elements = Dom_1.$$(this.element).findAll('fieldset');
        _.each(elements, function (element) {
            element.disabled = false;
        });
    };
    DateInput.prototype.onChange = function () {
        if (this.root) {
            Dom_1.$$(this.root).trigger(AdvancedSearchEvents_1.AdvancedSearchEvents.executeAdvancedSearch);
        }
        else if (this.element) {
            Dom_1.$$(this.element).trigger(AdvancedSearchEvents_1.AdvancedSearchEvents.executeAdvancedSearch);
        }
    };
    return DateInput;
}());
exports.DateInput = DateInput;


/***/ }),

/***/ 228:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var AdvancedSearchEvents_1 = __webpack_require__(84);
var Strings_1 = __webpack_require__(6);
var DocumentInput = /** @class */ (function () {
    function DocumentInput(inputName, root) {
        this.inputName = inputName;
        this.root = root;
    }
    DocumentInput.prototype.reset = function () { };
    DocumentInput.prototype.build = function () {
        var documentInput = Dom_1.$$('div', { className: 'coveo-advanced-search-document-input-section' });
        var label = Dom_1.$$('span', { className: 'coveo-advanced-search-label' });
        label.text(Strings_1.l(this.inputName));
        documentInput.append(label.el);
        this.element = documentInput.el;
        return this.element;
    };
    DocumentInput.prototype.getValue = function () {
        return '';
    };
    DocumentInput.prototype.updateQuery = function (queryBuilder) {
        var value = this.getValue();
        if (value) {
            queryBuilder.advancedExpression.add(this.getValue());
        }
    };
    DocumentInput.prototype.onChange = function () {
        if (this.root) {
            Dom_1.$$(this.root).trigger(AdvancedSearchEvents_1.AdvancedSearchEvents.executeAdvancedSearch);
        }
        else if (this.element) {
            Dom_1.$$(this.element).trigger(AdvancedSearchEvents_1.AdvancedSearchEvents.executeAdvancedSearch);
        }
    };
    return DocumentInput;
}());
exports.DocumentInput = DocumentInput;


/***/ }),

/***/ 233:
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
var QueryEvents_1 = __webpack_require__(11);
var AdvancedSearchEvents_1 = __webpack_require__(84);
var SettingsEvents_1 = __webpack_require__(53);
var Initialization_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var AdvancedSearchInputFactory_1 = __webpack_require__(583);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var QuerySummaryEvents_1 = __webpack_require__(514);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(594);
var NumericSpinner_1 = __webpack_require__(120);
var DatePicker_1 = __webpack_require__(85);
var Dropdown_1 = __webpack_require__(62);
var TextInput_1 = __webpack_require__(54);
var RadioButton_1 = __webpack_require__(94);
var ExternalModulesShim_1 = __webpack_require__(26);
var BreadcrumbEvents_1 = __webpack_require__(34);
var SVGIcons_1 = __webpack_require__(12);
var AccessibleButton_1 = __webpack_require__(15);
/**
 * The `AdvancedSearch` component is meant to render a section in the [`Settings`]{@link Settings} menu to allow the end
 * user to easily create complex queries to send to the index.
 *
 * **Note:**
 * > You can write custom code to add new sections in the **Advanced Search** modal box generated by this component by
 * > attaching a handler to the [`buildingAdvancedSearch`]{@link AdvancedSearchEvents.buildingAdvancedSearch} event.
 *
 * @availablesince [October 2016 Release (v1.1550.5)](https://docs.coveo.com/en/309/#october-2016-release-v115505)
 */
var AdvancedSearch = /** @class */ (function (_super) {
    __extends(AdvancedSearch, _super);
    /**
     * Creates a new `AdvancedSearch` component.
     *
     * Triggers the [`buildingAdvancedSearch`]{@link AdvancedSearchEvents.buildingAdvancedSearch} event.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `AdvancedSearch` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function AdvancedSearch(element, options, bindings, ModalBox) {
        if (ModalBox === void 0) { ModalBox = ExternalModulesShim_1.ModalBox; }
        var _this = _super.call(this, element, AdvancedSearch.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.ModalBox = ModalBox;
        _this.inputs = [];
        _this.inputFactory = new AdvancedSearchInputFactory_1.AdvancedSearchInputFactory(_this.queryController.getEndpoint(), _this.root);
        _this.externalSections = [];
        _this.needToPopulateBreadcrumb = false;
        // Used as an internal flag to determine if the component should execute the advanced search event
        // This flag is typically set to false when the breadcrumb is resetting, for example.
        // This is because the query will already be executed anyway from external code.
        // Without this, we might get analytics event being sent multiple time, or multiple query being triggered (which gets cancelled).
        _this.needToExecuteAdvancedSearch = true;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, AdvancedSearch, options);
        _this.bindEvents();
        _this.buildContent();
        return _this;
    }
    /**
     * Launches the advanced search query.
     * If query returns successfully, also logs an `advancedSearch` event in the usage analytics (see
     * {@link Analytics.logSearchEvent}).
     */
    AdvancedSearch.prototype.executeAdvancedSearch = function () {
        if (this.needToExecuteAdvancedSearch) {
            this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.advancedSearch, {});
            this.queryController.executeQuery({
                closeModalBox: false
            });
        }
    };
    /**
     * Resets the state of all form inputs inside the `AdvancedSearch` component.
     */
    AdvancedSearch.prototype.reset = function () {
        _.each(this.inputs, function (input) {
            input.reset();
        });
    };
    /**
     * Opens the `AdvancedSearch` modal box.
     */
    AdvancedSearch.prototype.open = function () {
        if (this.modalbox == null) {
            this.modalbox = this.ModalBox.open(this.content.el, {
                sizeMod: 'big',
                title: Strings_1.l('AdvancedSearch'),
                className: 'coveo-advanced-search-modal',
                body: this.searchInterface.options.modalContainer
            });
        }
    };
    /**
     * Closes the `AdvancedSearch` modal box.
     */
    AdvancedSearch.prototype.close = function () {
        if (this.modalbox != null) {
            this.modalbox.close();
            this.modalbox = null;
        }
    };
    AdvancedSearch.prototype.handlePopulateBreadcrumb = function (args) {
        if (this.needToPopulateBreadcrumb) {
            var _a = this.buildBreadcrumbElements(), container = _a.container, title = _a.title, clear = _a.clear;
            container.append(title.el);
            container.append(clear.el);
            args.breadcrumbs.push({
                element: container.el
            });
        }
    };
    AdvancedSearch.prototype.buildBreadcrumbElements = function () {
        return {
            container: this.buildBreadcrumbContainer(),
            title: this.buildBreadcrumbTitle(),
            clear: this.buildBreacrumbClear()
        };
    };
    AdvancedSearch.prototype.buildBreadcrumbContainer = function () {
        return Dom_1.$$('div', {
            className: 'coveo-advanced-search-breadcrumb'
        });
    };
    AdvancedSearch.prototype.buildBreadcrumbTitle = function () {
        return Dom_1.$$('span', {
            className: 'coveo-advanced-search-breadcrumb-title'
        }, Strings_1.l('FiltersInAdvancedSearch') + ":");
    };
    AdvancedSearch.prototype.buildBreacrumbClear = function () {
        var _this = this;
        var clear = Dom_1.$$('span', {
            className: 'coveo-advanced-search-breadcrumb-clear'
        }, SVGIcons_1.SVGIcons.icons.mainClear);
        var selectAction = function () {
            _this.handleClearBreadcrumb();
            _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbAdvancedSearch, {});
            _this.queryController.executeQuery();
        };
        new AccessibleButton_1.AccessibleButton()
            .withElement(clear)
            .withLabel(Strings_1.l('Clear'))
            .withSelectAction(function () { return selectAction(); })
            .build();
        return clear;
    };
    AdvancedSearch.prototype.handleClearBreadcrumb = function () {
        if (this.needToPopulateBreadcrumb) {
            this.needToExecuteAdvancedSearch = false;
            this.reset();
            this.needToExecuteAdvancedSearch = true;
        }
    };
    AdvancedSearch.prototype.handleQuerySummaryCancelLastAction = function () {
        this.needToExecuteAdvancedSearch = false;
        this.reset();
        this.needToExecuteAdvancedSearch = true;
    };
    AdvancedSearch.prototype.handlePopulateMenu = function (args) {
        var _this = this;
        args.menuData.push({
            text: Strings_1.l('AdvancedSearch'),
            className: 'coveo-advanced-search',
            onOpen: function () { return _this.open(); },
            onClose: function () { return _this.close(); },
            svgIcon: SVGIcons_1.SVGIcons.icons.dropdownPreferences,
            svgIconClassName: 'coveo-advanced-search-svg'
        });
    };
    AdvancedSearch.prototype.handleBuildingQuery = function (data) {
        var originalQuery = data.queryBuilder.build();
        _.each(this.externalSections, function (section) {
            if (section.updateQuery) {
                section.updateQuery(section.inputs, data.queryBuilder);
            }
        });
        _.each(this.inputs, function (input) {
            if (input.updateQuery) {
                input.updateQuery(data.queryBuilder);
            }
        });
        var modifiedQuery = data.queryBuilder.build();
        this.needToPopulateBreadcrumb = modifiedQuery.aq != originalQuery.aq;
    };
    AdvancedSearch.prototype.buildContent = function () {
        var _this = this;
        var component = Dom_1.$$('div');
        var inputSections = [];
        if (this.options.includeKeywords) {
            inputSections.push(this.getKeywordsSection());
        }
        if (this.options.includeDate) {
            inputSections.push(this.getDateSection());
        }
        if (this.options.includeDocument) {
            inputSections.push(this.getDocumentSection());
        }
        this.externalSections = [];
        Dom_1.$$(this.root).trigger(AdvancedSearchEvents_1.AdvancedSearchEvents.buildingAdvancedSearch, {
            sections: this.externalSections,
            executeQuery: function (options) {
                options = _.extend({}, options, { closeModalBox: false });
                return _this.queryController.executeQuery(options);
            }
        });
        _.each(this.externalSections, function (section) {
            component.append(_this.buildExternalSection(section));
        });
        _.each(inputSections, function (section) {
            component.append(_this.buildInternalSection(section));
        });
        this.content = component;
    };
    AdvancedSearch.prototype.getKeywordsSection = function () {
        var sectionName = Strings_1.l('Keywords');
        var keywordsInputs = [];
        keywordsInputs.push(this.inputFactory.createAllKeywordsInput());
        keywordsInputs.push(this.inputFactory.createExactKeywordsInput());
        keywordsInputs.push(this.inputFactory.createAnyKeywordsInput());
        keywordsInputs.push(this.inputFactory.createNoneKeywordsInput());
        return { name: sectionName, inputs: keywordsInputs };
    };
    AdvancedSearch.prototype.getDateSection = function () {
        var sectionName = Strings_1.l('Date');
        var dateInputs = [];
        dateInputs.push(this.inputFactory.createAnytimeDateInput());
        dateInputs.push(this.inputFactory.createInTheLastDateInput());
        dateInputs.push(this.inputFactory.createBetweenDateInput());
        return { name: sectionName, inputs: dateInputs };
    };
    AdvancedSearch.prototype.getDocumentSection = function () {
        var sectionName = Strings_1.l('Document');
        var documentInputs = [];
        documentInputs.push(this.inputFactory.createSimpleFieldInput(Strings_1.l('FileType'), '@filetype'));
        documentInputs.push(this.inputFactory.createSimpleFieldInput(Strings_1.l('Language'), '@language'));
        documentInputs.push(this.inputFactory.createSizeInput());
        documentInputs.push(this.inputFactory.createAdvancedFieldInput(Strings_1.l('Title'), '@title'));
        documentInputs.push(this.inputFactory.createAdvancedFieldInput(Strings_1.l('Author'), '@author'));
        return { name: sectionName, inputs: documentInputs };
    };
    AdvancedSearch.prototype.buildExternalSection = function (section) {
        var el = this.buildSectionTitle(section).el;
        this.inputs = _.union(this.inputs, section.inputs);
        el.appendChild(section.content);
        return el;
    };
    AdvancedSearch.prototype.buildInternalSection = function (section) {
        var _this = this;
        var _a = this.buildSectionTitle(section), el = _a.el, id = _a.id;
        var sectionInputs = [];
        _.each(section.inputs, function (input) {
            sectionInputs.push(_this.buildDefaultInput(input));
        });
        this.inputs = _.union(this.inputs, sectionInputs);
        _.each(sectionInputs, function (input) {
            var built = input.build();
            var inputElement = built.querySelector('input');
            if (inputElement) {
                inputElement.setAttribute('aria-labelledby', id);
            }
            Dom_1.$$(el).append(built);
        });
        return el;
    };
    AdvancedSearch.prototype.buildSectionTitle = function (section) {
        var sectionHTML = Dom_1.$$('div', { className: 'coveo-advanced-search-section' });
        var title = Dom_1.$$('div', { className: 'coveo-advanced-search-section-title' });
        title.text(section.name);
        var id = "coveo-advanced-search-section-" + section.name;
        title.el.id = id;
        sectionHTML.append(title.el);
        return {
            el: sectionHTML.el,
            id: id
        };
    };
    AdvancedSearch.prototype.buildDefaultInput = function (input) {
        if (this.isPrebuiltInput(input)) {
            return this.inputFactory.create(input.name, input.parameters);
        }
        else {
            return input;
        }
    };
    AdvancedSearch.prototype.isPrebuiltInput = function (input) {
        return input.name !== undefined;
    };
    AdvancedSearch.prototype.bindEvents = function () {
        var _this = this;
        this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) {
            return _this.handlePopulateBreadcrumb(args);
        });
        this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function (args) { return _this.handleClearBreadcrumb(); });
        this.bind.onRootElement(SettingsEvents_1.SettingsEvents.settingsPopulateMenu, function (args) { return _this.handlePopulateMenu(args); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (data) { return _this.handleBuildingQuery(data); });
        this.bind.onRootElement(AdvancedSearchEvents_1.AdvancedSearchEvents.executeAdvancedSearch, function () { return _this.executeAdvancedSearch(); });
        this.bind.onRootElement(QuerySummaryEvents_1.QuerySummaryEvents.cancelLastAction, function () { return _this.handleQuerySummaryCancelLastAction(); });
    };
    AdvancedSearch.ID = 'AdvancedSearch';
    AdvancedSearch.doExport = function () {
        GlobalExports_1.exportGlobally({
            AdvancedSearch: AdvancedSearch,
            NumericSpinner: NumericSpinner_1.NumericSpinner,
            DatePicker: DatePicker_1.DatePicker,
            Dropdown: Dropdown_1.Dropdown,
            TextInput: TextInput_1.TextInput,
            RadioButton: RadioButton_1.RadioButton
        });
    };
    /**
     * @componentOptions
     */
    AdvancedSearch.options = {
        /**
         * Specifies whether to include the built-in **Keywords** section.
         *
         * Default value is `true`.
         */
        includeKeywords: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to include the built-in **Date** section.
         *
         * Default value is `true`.
         */
        includeDate: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to include the built-in **Document** section.
         *
         * Default value is `true`.
         */
        includeDocument: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return AdvancedSearch;
}(Component_1.Component));
exports.AdvancedSearch = AdvancedSearch;
Initialization_1.Initialization.registerAutoCreateComponent(AdvancedSearch);


/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='Facet.ts' />
var StringUtils_1 = __webpack_require__(22);
var QueryUtils_1 = __webpack_require__(21);
var FileTypes_1 = __webpack_require__(113);
var DateUtils_1 = __webpack_require__(32);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var Strings_1 = __webpack_require__(6);
var FacetUtils = /** @class */ (function () {
    function FacetUtils() {
    }
    FacetUtils.getRegexToUseForFacetSearch = function (value, ignoreAccent) {
        return new RegExp(StringUtils_1.StringUtils.stringToRegex(value, ignoreAccent), 'i');
    };
    FacetUtils.getDisplayValueFromValueCaption = function (value, field, valueCaption) {
        var returnValue = this.tryToGetTranslatedCaption(field, value);
        return valueCaption[value] || returnValue;
    };
    FacetUtils.getValuesToUseForSearchInFacet = function (original, facet) {
        var ret = [original];
        var regex = this.getRegexToUseForFacetSearch(original, facet.options.facetSearchIgnoreAccents);
        if (facet.options.valueCaption) {
            _.chain(facet.options.valueCaption)
                .pairs()
                .filter(function (pair) {
                return regex.test(pair[1]);
            })
                .each(function (match) {
                ret.push(match[0]);
            });
            if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@objecttype') ||
                QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@filetype')) {
                _.each(FileTypes_1.FileTypes.getFileTypeCaptions(), function (value, key) {
                    if (!(key in facet.options.valueCaption) && regex.test(value)) {
                        ret.push(key);
                    }
                });
            }
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@objecttype') ||
            QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@filetype')) {
            _.each(_.filter(_.pairs(FileTypes_1.FileTypes.getFileTypeCaptions()), function (pair) {
                return regex.test(pair[1]);
            }), function (match) {
                ret.push(match[0]);
            });
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@month')) {
            _.each(_.range(1, 13), function (month) {
                if (regex.test(DateUtils_1.DateUtils.monthToString(month - 1))) {
                    ret.push(('0' + month.toString()).substr(-2));
                }
            });
        }
        return ret;
    };
    FacetUtils.buildFacetSearchPattern = function (values) {
        values = _.map(values, function (value) {
            return Utils_1.Utils.escapeRegexCharacter(value);
        });
        values[0] = '.*' + values[0] + '.*';
        return values.join('|');
    };
    FacetUtils.needAnotherFacetSearch = function (currentSearchLength, newSearchLength, oldSearchLength, desiredSearchLength) {
        // Something was removed (currentSearch < newSearch)
        // && we might want to display more facet search result(currentSearch < desiredSearch)
        // && the new query returned more stuff than the old one so there's still more results(currentSearchLength > oldLength)
        return currentSearchLength < newSearchLength && currentSearchLength < desiredSearchLength && currentSearchLength > oldSearchLength;
    };
    FacetUtils.addNoStateCssClassToFacetValues = function (facet, container) {
        // This takes care of adding the correct css class on each facet value checkbox (empty white box) if at least one value is selected in that facet
        if (facet.values.getSelected().length != 0) {
            var noStates = Dom_1.$$(container).findAll('li:not(.coveo-selected)');
            _.each(noStates, function (noState) {
                Dom_1.$$(noState).addClass('coveo-no-state');
            });
        }
    };
    FacetUtils.tryToGetTranslatedCaption = function (field, value) {
        var found;
        if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@filetype')) {
            found = FileTypes_1.FileTypes.getFileType(value).caption;
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@objecttype')) {
            found = FileTypes_1.FileTypes.getObjectType(value).caption;
        }
        else if (FacetUtils.isMonthFieldValue(field, value)) {
            var month = parseInt(value, 10);
            found = DateUtils_1.DateUtils.monthToString(month - 1);
        }
        else {
            found = Strings_1.l(value);
        }
        return found != undefined && Utils_1.Utils.isNonEmptyString(found) ? found : value;
    };
    FacetUtils.isMonthFieldValue = function (field, value) {
        if (!QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@month')) {
            return false;
        }
        var asInt = parseInt(value, 10);
        if (isNaN(asInt)) {
            return false;
        }
        if (asInt < 1 || asInt > 12) {
            return false;
        }
        return true;
    };
    return FacetUtils;
}());
exports.FacetUtils = FacetUtils;


/***/ }),

/***/ 514:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class is there to contains the different string definition for all the events related to the {@link AdvancedSearch} component.
 */
var QuerySummaryEvents = /** @class */ (function () {
    function QuerySummaryEvents() {
    }
    /**
     * Triggered when the last action is being cancelled by the query summary component
     *
     * Allows external code to revert their last action.
     * @type {string}
     */
    QuerySummaryEvents.cancelLastAction = 'cancelLastAction';
    return QuerySummaryEvents;
}());
exports.QuerySummaryEvents = QuerySummaryEvents;


/***/ }),

/***/ 555:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 583:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AllKeywordsInput_1 = __webpack_require__(584);
var ExactKeywordsInput_1 = __webpack_require__(585);
var AnyKeywordsInput_1 = __webpack_require__(586);
var NoneKeywordsInput_1 = __webpack_require__(587);
var AnytimeDateInput_1 = __webpack_require__(588);
var InTheLastDateInput_1 = __webpack_require__(589);
var BetweenDateInput_1 = __webpack_require__(590);
var SimpleFieldInput_1 = __webpack_require__(591);
var AdvancedFieldInput_1 = __webpack_require__(592);
var SizeInput_1 = __webpack_require__(593);
var AdvancedSearchInputFactory = /** @class */ (function () {
    function AdvancedSearchInputFactory(endpoint, root) {
        this.endpoint = endpoint;
        this.root = root;
    }
    AdvancedSearchInputFactory.prototype.create = function (name, options) {
        switch (name) {
            case 'keywords_all':
                return this.createAllKeywordsInput();
            case 'keywords_exact':
                return this.createExactKeywordsInput();
            case 'keywords_any':
                return this.createAnyKeywordsInput();
            case 'keywords_none':
                return this.createNoneKeywordsInput();
            case 'date_any':
                return this.createAnytimeDateInput();
            case 'date_last':
                return this.createInTheLastDateInput();
            case 'date_between':
                return this.createBetweenDateInput();
            case 'document_field':
                return this.createSimpleFieldInput(options.name, options.field);
            case 'document_advanced_field':
                return this.createAdvancedFieldInput(options.name, options.field);
            case 'document_size':
                return this.createSizeInput();
            default:
                return null;
        }
    };
    AdvancedSearchInputFactory.prototype.createAllKeywordsInput = function () {
        return new AllKeywordsInput_1.AllKeywordsInput(this.root);
    };
    AdvancedSearchInputFactory.prototype.createExactKeywordsInput = function () {
        return new ExactKeywordsInput_1.ExactKeywordsInput(this.root);
    };
    AdvancedSearchInputFactory.prototype.createAnyKeywordsInput = function () {
        return new AnyKeywordsInput_1.AnyKeywordsInput(this.root);
    };
    AdvancedSearchInputFactory.prototype.createNoneKeywordsInput = function () {
        return new NoneKeywordsInput_1.NoneKeywordsInput(this.root);
    };
    AdvancedSearchInputFactory.prototype.createAnytimeDateInput = function () {
        return new AnytimeDateInput_1.AnytimeDateInput(this.root);
    };
    AdvancedSearchInputFactory.prototype.createInTheLastDateInput = function () {
        return new InTheLastDateInput_1.InTheLastDateInput(this.root);
    };
    AdvancedSearchInputFactory.prototype.createBetweenDateInput = function () {
        return new BetweenDateInput_1.BetweenDateInput(this.root);
    };
    AdvancedSearchInputFactory.prototype.createSimpleFieldInput = function (name, field) {
        return new SimpleFieldInput_1.SimpleFieldInput(name, field, this.endpoint, this.root);
    };
    AdvancedSearchInputFactory.prototype.createAdvancedFieldInput = function (name, field) {
        return new AdvancedFieldInput_1.AdvancedFieldInput(name, field, this.root);
    };
    AdvancedSearchInputFactory.prototype.createSizeInput = function () {
        return new SizeInput_1.SizeInput(this.root);
    };
    return AdvancedSearchInputFactory;
}());
exports.AdvancedSearchInputFactory = AdvancedSearchInputFactory;


/***/ }),

/***/ 584:
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
var KeywordsInput_1 = __webpack_require__(183);
var Strings_1 = __webpack_require__(6);
var AllKeywordsInput = /** @class */ (function (_super) {
    __extends(AllKeywordsInput, _super);
    function AllKeywordsInput(root) {
        var _this = _super.call(this, Strings_1.l('AllTheseWords'), root) || this;
        _this.root = root;
        return _this;
    }
    return AllKeywordsInput;
}(KeywordsInput_1.KeywordsInput));
exports.AllKeywordsInput = AllKeywordsInput;


/***/ }),

/***/ 585:
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
var KeywordsInput_1 = __webpack_require__(183);
var Strings_1 = __webpack_require__(6);
var ExactKeywordsInput = /** @class */ (function (_super) {
    __extends(ExactKeywordsInput, _super);
    function ExactKeywordsInput(root) {
        var _this = _super.call(this, Strings_1.l('ExactPhrase'), root) || this;
        _this.root = root;
        return _this;
    }
    ExactKeywordsInput.prototype.getValue = function () {
        var value = _super.prototype.getValue.call(this);
        return value ? '"' + value + '"' : '';
    };
    return ExactKeywordsInput;
}(KeywordsInput_1.KeywordsInput));
exports.ExactKeywordsInput = ExactKeywordsInput;


/***/ }),

/***/ 586:
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
var KeywordsInput_1 = __webpack_require__(183);
var Strings_1 = __webpack_require__(6);
var _ = __webpack_require__(0);
var AnyKeywordsInput = /** @class */ (function (_super) {
    __extends(AnyKeywordsInput, _super);
    function AnyKeywordsInput(root) {
        var _this = _super.call(this, Strings_1.l('AnyOfTheseWords'), root) || this;
        _this.root = root;
        return _this;
    }
    AnyKeywordsInput.prototype.getValue = function () {
        var value = _super.prototype.getValue.call(this);
        var splitValues = value.split(' ');
        var generatedValue = '';
        _.each(splitValues, function (splitValue) {
            generatedValue += splitValue + ' OR ';
        });
        generatedValue = generatedValue.substr(0, generatedValue.length - 4);
        return generatedValue;
    };
    return AnyKeywordsInput;
}(KeywordsInput_1.KeywordsInput));
exports.AnyKeywordsInput = AnyKeywordsInput;


/***/ }),

/***/ 587:
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
var KeywordsInput_1 = __webpack_require__(183);
var Strings_1 = __webpack_require__(6);
var _ = __webpack_require__(0);
var NoneKeywordsInput = /** @class */ (function (_super) {
    __extends(NoneKeywordsInput, _super);
    function NoneKeywordsInput(root) {
        var _this = _super.call(this, Strings_1.l('NoneOfTheseWords'), root) || this;
        _this.root = root;
        return _this;
    }
    NoneKeywordsInput.prototype.getValue = function () {
        var value = _super.prototype.getValue.call(this);
        var generatedValue = '';
        if (value) {
            var splitValues = value.split(' ');
            _.each(splitValues, function (splitValue) {
                generatedValue += ' NOT ' + splitValue;
            });
            generatedValue = generatedValue.substr(1);
        }
        return generatedValue;
    };
    return NoneKeywordsInput;
}(KeywordsInput_1.KeywordsInput));
exports.NoneKeywordsInput = NoneKeywordsInput;


/***/ }),

/***/ 588:
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
var DateInput_1 = __webpack_require__(227);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var AdvancedSearchEvents_1 = __webpack_require__(84);
var AnytimeDateInput = /** @class */ (function (_super) {
    __extends(AnytimeDateInput, _super);
    function AnytimeDateInput(root) {
        var _this = _super.call(this, Strings_1.l('Anytime'), root) || this;
        _this.root = root;
        return _this;
    }
    AnytimeDateInput.prototype.getValue = function () {
        return null;
    };
    AnytimeDateInput.prototype.build = function () {
        var _this = this;
        _super.prototype.build.call(this);
        var radio = this.getRadio();
        radio.checked = true;
        Dom_1.$$(radio).on('change', function () {
            if (_this.root) {
                Dom_1.$$(_this.root).trigger(AdvancedSearchEvents_1.AdvancedSearchEvents.executeAdvancedSearch);
            }
            else {
                Dom_1.$$(_this.element).trigger(AdvancedSearchEvents_1.AdvancedSearchEvents.executeAdvancedSearch);
            }
        });
        return this.element;
    };
    return AnytimeDateInput;
}(DateInput_1.DateInput));
exports.AnytimeDateInput = AnytimeDateInput;


/***/ }),

/***/ 589:
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
var DateInput_1 = __webpack_require__(227);
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var Dropdown_1 = __webpack_require__(62);
var NumericSpinner_1 = __webpack_require__(120);
var DateUtils_1 = __webpack_require__(32);
var InTheLastDateInput = /** @class */ (function (_super) {
    __extends(InTheLastDateInput, _super);
    function InTheLastDateInput(root) {
        var _this = _super.call(this, Strings_1.l('InTheLast'), root) || this;
        _this.root = root;
        return _this;
    }
    InTheLastDateInput.prototype.reset = function () {
        this.dropdown.reset();
        this.spinner.reset();
    };
    InTheLastDateInput.prototype.build = function () {
        _super.prototype.build.call(this);
        var input = Dom_1.$$('fieldset', { className: 'coveo-advanced-search-date-input' });
        input.el.disabled = true;
        this.spinner = new NumericSpinner_1.NumericSpinner(this.onChange.bind(this), undefined, undefined, Strings_1.l('InTheLast'));
        input.append(this.spinner.getElement());
        this.dropdown = new Dropdown_1.Dropdown(this.onChange.bind(this), ['Days', 'Months'], undefined, Strings_1.l('InTheLast'));
        this.dropdown.setId('coveo-advanced-search-in-the-last-select');
        input.append(this.dropdown.getElement());
        this.element.appendChild(input.el);
        Dom_1.$$(this.getRadio()).on('change', this.onChange.bind(this));
        return this.element;
    };
    InTheLastDateInput.prototype.getValue = function () {
        var currentDate = new Date();
        var time = this.spinner.getIntValue();
        var size = this.dropdown.getValue().toLowerCase();
        var date = new Date();
        if (size == 'months') {
            date.setMonth(currentDate.getMonth() - time);
        }
        else {
            date.setDate(currentDate.getDate() - time);
        }
        return this.isSelected() && time ? '@date>=' + DateUtils_1.DateUtils.dateForQuery(date) : '';
    };
    return InTheLastDateInput;
}(DateInput_1.DateInput));
exports.InTheLastDateInput = InTheLastDateInput;


/***/ }),

/***/ 590:
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
var DateInput_1 = __webpack_require__(227);
var DatePicker_1 = __webpack_require__(85);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var DateUtils_1 = __webpack_require__(32);
var TimeSpanUtils_1 = __webpack_require__(70);
var BetweenDateInput = /** @class */ (function (_super) {
    __extends(BetweenDateInput, _super);
    function BetweenDateInput(root) {
        var _this = _super.call(this, Strings_1.l('Between'), root) || this;
        _this.root = root;
        _this.firstDatePicker = new DatePicker_1.DatePicker(_this.onChange.bind(_this));
        _this.secondDatePicker = new DatePicker_1.DatePicker(_this.onChange.bind(_this));
        return _this;
    }
    BetweenDateInput.prototype.reset = function () {
        this.firstDatePicker.reset();
        this.secondDatePicker.reset();
    };
    BetweenDateInput.prototype.build = function () {
        _super.prototype.build.call(this);
        var container = Dom_1.$$('fieldset', { className: 'coveo-advanced-search-date-input' });
        container.el.disabled = true;
        container.append(this.firstDatePicker.getElement());
        container.append(this.buildAnd());
        container.append(this.secondDatePicker.getElement());
        this.element.appendChild(container.el);
        return this.element;
    };
    BetweenDateInput.prototype.getValue = function () {
        var firstDate = this.firstDatePicker.getDateValue();
        var secondDate = this.secondDatePicker.getDateValue();
        var firstDateAsString = this.firstDatePicker.getValue();
        var secondDateAsString = this.secondDatePicker.getValue();
        var query = '';
        if (this.isSelected()) {
            if (firstDate && secondDate) {
                var timespan = TimeSpanUtils_1.TimeSpan.fromDates(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(firstDate), DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(secondDateAsString));
                if (timespan.getMilliseconds() < 0) {
                    throw Strings_1.l('QueryExceptionInvalidDate');
                }
            }
            if (firstDateAsString) {
                query += "(@date>=" + firstDateAsString + ")";
            }
            if (secondDateAsString) {
                query += "(@date<=" + secondDateAsString + ")";
            }
        }
        return query;
    };
    BetweenDateInput.prototype.buildAnd = function () {
        var and = Dom_1.$$('div', { className: 'coveo-advanced-search-and' });
        and.text(Strings_1.l('And').toLowerCase());
        return and.el;
    };
    return BetweenDateInput;
}(DateInput_1.DateInput));
exports.BetweenDateInput = BetweenDateInput;


/***/ }),

/***/ 591:
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
var _ = __webpack_require__(0);
var FacetUtils_1 = __webpack_require__(39);
var Dom_1 = __webpack_require__(1);
var QueryBuilder_1 = __webpack_require__(46);
var Dropdown_1 = __webpack_require__(62);
var DocumentInput_1 = __webpack_require__(228);
var SimpleFieldInput = /** @class */ (function (_super) {
    __extends(SimpleFieldInput, _super);
    function SimpleFieldInput(inputName, fieldName, endpoint, root) {
        var _this = _super.call(this, inputName, root) || this;
        _this.inputName = inputName;
        _this.fieldName = fieldName;
        _this.endpoint = endpoint;
        _this.root = root;
        return _this;
    }
    SimpleFieldInput.prototype.reset = function () {
        this.dropDown.reset();
    };
    SimpleFieldInput.prototype.build = function () {
        var _this = this;
        var fieldInput = Dom_1.$$(_super.prototype.build.call(this));
        this.buildFieldSelect().then(function () {
            fieldInput.append(_this.dropDown.getElement());
        });
        this.element = fieldInput.el;
        return this.element;
    };
    SimpleFieldInput.prototype.getValue = function () {
        var value = this.dropDown ? this.dropDown.getValue() : '';
        var queryBuilder = new QueryBuilder_1.QueryBuilder();
        if (value) {
            queryBuilder.advancedExpression.addFieldExpression(this.fieldName, '==', [value]);
            return queryBuilder.build().aq;
        }
        else {
            return '';
        }
    };
    SimpleFieldInput.prototype.buildFieldSelect = function () {
        var _this = this;
        return this.endpoint
            .listFieldValues({
            field: this.fieldName,
            maximumNumberOfValues: 50
        })
            .then(function (values) {
            var options = [''];
            _.each(values, function (value) {
                options.push(value.value);
            });
            _this.dropDown = new Dropdown_1.Dropdown(_this.onChange.bind(_this), options, function (str) {
                return FacetUtils_1.FacetUtils.tryToGetTranslatedCaption(_this.fieldName, str);
            }, _this.inputName);
        });
    };
    return SimpleFieldInput;
}(DocumentInput_1.DocumentInput));
exports.SimpleFieldInput = SimpleFieldInput;


/***/ }),

/***/ 592:
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
var Dropdown_1 = __webpack_require__(62);
var TextInput_1 = __webpack_require__(54);
var Dom_1 = __webpack_require__(1);
var DocumentInput_1 = __webpack_require__(228);
var QueryBuilder_1 = __webpack_require__(46);
var AdvancedFieldInput = /** @class */ (function (_super) {
    __extends(AdvancedFieldInput, _super);
    function AdvancedFieldInput(inputName, fieldName, root) {
        var _this = _super.call(this, inputName, root) || this;
        _this.inputName = inputName;
        _this.fieldName = fieldName;
        _this.root = root;
        return _this;
    }
    AdvancedFieldInput.prototype.reset = function () {
        this.mode.reset();
        this.input.reset();
    };
    AdvancedFieldInput.prototype.build = function () {
        var fieldInput = Dom_1.$$(_super.prototype.build.call(this));
        this.mode = new Dropdown_1.Dropdown(this.onChange.bind(this), ['Contains', 'DoesNotContain', 'Matches'], undefined, this.inputName);
        fieldInput.append(this.mode.getElement());
        this.input = new TextInput_1.TextInput(this.onChange.bind(this), this.inputName);
        fieldInput.append(this.input.getElement());
        this.element = fieldInput.el;
        return this.element;
    };
    AdvancedFieldInput.prototype.getValue = function () {
        var inputValue = this.input.getValue();
        var builder = new QueryBuilder_1.QueryBuilder();
        if (inputValue) {
            switch (this.mode.getValue()) {
                case 'Contains':
                    builder.advancedExpression.addFieldExpression(this.fieldName, '=', [inputValue]);
                    return builder.build().aq;
                case 'DoesNotContain':
                    builder.advancedExpression.addFieldExpression(this.fieldName, '<>', [inputValue]);
                    return builder.build().aq;
                default:
                    builder.advancedExpression.addFieldExpression(this.fieldName, '==', [inputValue]);
                    return builder.build().aq;
            }
        }
        return '';
    };
    return AdvancedFieldInput;
}(DocumentInput_1.DocumentInput));
exports.AdvancedFieldInput = AdvancedFieldInput;


/***/ }),

/***/ 593:
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
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var QueryBuilder_1 = __webpack_require__(46);
var Dropdown_1 = __webpack_require__(62);
var NumericSpinner_1 = __webpack_require__(120);
var DocumentInput_1 = __webpack_require__(228);
var SizeInput = /** @class */ (function (_super) {
    __extends(SizeInput, _super);
    function SizeInput(root) {
        var _this = _super.call(this, 'Size', root) || this;
        _this.root = root;
        return _this;
    }
    SizeInput.prototype.reset = function () {
        this.modeSelect.reset();
        this.sizeInput.reset();
    };
    SizeInput.prototype.build = function () {
        var sizeInput = Dom_1.$$(_super.prototype.build.call(this));
        var sizeInputSection = Dom_1.$$('div', { className: 'coveo-size-input-mode-section' });
        this.modeSelect = new Dropdown_1.Dropdown(this.onChange.bind(this), SizeInput.modes, undefined, Strings_1.l('Size'));
        this.modeSelect.setId('coveo-size-input-mode');
        sizeInputSection.append(this.modeSelect.getElement());
        this.sizeInput = new NumericSpinner_1.NumericSpinner(this.onChange.bind(this), undefined, undefined, Strings_1.l('SizeValue'));
        sizeInputSection.append(this.sizeInput.getElement());
        this.sizeSelect = new Dropdown_1.Dropdown(this.onChange.bind(this), SizeInput.sizes, undefined, Strings_1.l('UnitMeasurement'));
        this.sizeSelect.setId('coveo-size-input-select');
        sizeInputSection.append(this.sizeSelect.getElement());
        sizeInput.append(sizeInputSection.el);
        this.element = sizeInput.el;
        return this.element;
    };
    SizeInput.prototype.getValue = function () {
        var size = this.getSizeInBytes();
        var queryBuilder = new QueryBuilder_1.QueryBuilder();
        if (size) {
            switch (this.modeSelect.getValue()) {
                case 'AtLeast':
                    queryBuilder.advancedExpression.addFieldExpression('@size', '>=', [this.getSizeInBytes().toString()]);
                    return queryBuilder.build().aq;
                default:
                    queryBuilder.advancedExpression.addFieldExpression('@size', '<=', [this.getSizeInBytes().toString()]);
                    return queryBuilder.build().aq;
            }
        }
        return '';
    };
    SizeInput.prototype.getSizeInBytes = function () {
        var size = this.sizeInput.getFloatValue();
        switch (this.sizeSelect.getValue()) {
            case 'KB':
                return size * 1024;
            case 'MB':
                return size * Math.pow(1024, 2);
            default:
                return size;
        }
    };
    SizeInput.modes = ['AtLeast', 'AtMost'];
    SizeInput.sizes = ['KB', 'MB', 'Bytes'];
    return SizeInput;
}(DocumentInput_1.DocumentInput));
exports.SizeInput = SizeInput;


/***/ }),

/***/ 594:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A dropdown widget with standard styling.
 */
var Dropdown = /** @class */ (function () {
    /**
     * Creates a new `Dropdown`.
     * @param onChange The function to call when the dropdown selected value changes. This function takes the current
     * `Dropdown` instance as an argument.
     * @param listOfValues The selectable values to display in the dropdown.
     * @param getDisplayValue An optional function to modify the display values, rather than using the values as they
     * appear in the `listOfValues`.
     * @param label The label to use for the input for accessibility purposes.
     */
    function Dropdown(onChange, listOfValues, getDisplayValue, label) {
        if (onChange === void 0) { onChange = function (dropdown) { }; }
        if (getDisplayValue === void 0) { getDisplayValue = Strings_1.l; }
        this.onChange = onChange;
        this.listOfValues = listOfValues;
        this.getDisplayValue = getDisplayValue;
        this.label = label;
        this.optionsElement = [];
        this.buildContent();
        this.select(0, false);
        this.bindEvents();
    }
    Dropdown.doExport = function () {
        GlobalExports_1.exportGlobally({
            Dropdown: Dropdown
        });
    };
    /**
     * Resets the dropdown.
     */
    Dropdown.prototype.reset = function () {
        this.select(0, false);
    };
    Dropdown.prototype.setId = function (id) {
        Dom_1.$$(this.element).setAttribute('id', id);
    };
    /**
     * Gets the element on which the dropdown is bound.
     * @returns {HTMLElement} The dropdown element.
     */
    Dropdown.prototype.getElement = function () {
        return this.element;
    };
    /**
     * Gets the currently selected dropdown value.
     * @returns {string} The currently selected dropdown value.
     */
    Dropdown.prototype.getValue = function () {
        return this.selectElement.value;
    };
    /**
     * Selects a value from the dropdown [`listofValues`]{@link Dropdown.listOfValues}.
     * @param index The 0-based index position of the value to select in the `listOfValues`.
     * @param executeOnChange Indicates whether to execute the [`onChange`]{@link Dropdown.onChange} function when this
     * method changes the dropdown selection.
     */
    Dropdown.prototype.select = function (index, executeOnChange) {
        if (executeOnChange === void 0) { executeOnChange = true; }
        this.selectOption(this.optionsElement[index], executeOnChange);
    };
    /**
     * Gets the element on which the dropdown is bound.
     * @returns {HTMLElement} The dropdown element.
     */
    Dropdown.prototype.build = function () {
        return this.element;
    };
    /**
     * Sets the dropdown value.
     * @param value The value to set the dropdown to.
     */
    Dropdown.prototype.setValue = function (value) {
        var _this = this;
        _.each(this.optionsElement, function (option) {
            if (Dom_1.$$(option).getAttribute('data-value') == value) {
                _this.selectOption(option);
            }
        });
    };
    Dropdown.prototype.selectOption = function (option, executeOnChange) {
        if (executeOnChange === void 0) { executeOnChange = true; }
        this.selectElement.value = option.value;
        if (executeOnChange) {
            this.onChange(this);
        }
    };
    Dropdown.prototype.buildContent = function () {
        var _this = this;
        this.selectElement = Dom_1.$$('select', {
            className: 'coveo-dropdown'
        }).el;
        if (this.label) {
            this.selectElement.setAttribute('aria-label', Strings_1.l(this.label));
        }
        var selectOptions = this.buildOptions();
        _.each(selectOptions, function (opt) {
            Dom_1.$$(_this.selectElement).append(opt);
        });
        this.element = this.selectElement;
    };
    Dropdown.prototype.buildOptions = function () {
        var _this = this;
        var ret = [];
        _.each(this.listOfValues, function (value) {
            ret.push(_this.buildOption(value));
        });
        return ret;
    };
    Dropdown.prototype.buildOption = function (value) {
        var option = Dom_1.$$('option');
        option.setAttribute('data-value', value);
        option.setAttribute('value', value);
        option.text(this.getDisplayValue(value));
        this.optionsElement.push(option.el);
        return option.el;
    };
    Dropdown.prototype.bindEvents = function () {
        var _this = this;
        Dom_1.$$(this.selectElement).on('change', function () { return _this.onChange(_this); });
    };
    return Dropdown;
}());
exports.Dropdown = Dropdown;


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
//# sourceMappingURL=AdvancedSearch__36d30dcb7330ecf06f4d.js.map