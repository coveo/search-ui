webpackJsonpCoveo__temporary([4,45,46,65,66],{

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(3);
var DateUtils_1 = __webpack_require__(29);
var GlobalExports_1 = __webpack_require__(4);
var Strings_1 = __webpack_require__(10);
var Globalize = __webpack_require__(25);
var Pikaday = __webpack_require__(484);
/**
 * A date picker widget with standard styling.
 */
var DatePicker = (function () {
    /**
     * Creates a new `DatePicker`.
     * @param onChange The function to call when a new value is selected in the date picker. This function takes the
     * current `DatePicker` instance as an argument.
     */
    function DatePicker(onChange) {
        if (onChange === void 0) { onChange = function () {
        }; }
        this.onChange = onChange;
        this.wasReset = true;
        this.buildContent();
    }
    /**
     * Resets the date picker.
     */
    DatePicker.prototype.reset = function () {
        this.picker.setDate(undefined);
        this.wasReset = true;
        this.onChange(this);
    };
    /**
     * Gets the element on which the date picker is bound.
     * @returns {HTMLInputElement} The date picker element.
     */
    DatePicker.prototype.getElement = function () {
        return this.element;
    };
    /**
     * Gets the currently selected value in the date picker.
     * @returns {string} A textual representation of the currently selected value (`YYYY-MM-DD` format).
     */
    DatePicker.prototype.getValue = function () {
        if (this.wasReset) {
            return '';
        }
        var date = this.picker.getDate();
        return date ? DateUtils_1.DateUtils.dateForQuery(this.picker.getDate()) : '';
    };
    /**
     * Get the currently selected value in the date picker, as a Date object
     * @returns {Date} A Date object for the current value, or null if the date picker was reset or a date has not been selected initially.
     */
    DatePicker.prototype.getDateValue = function () {
        if (this.wasReset) {
            return null;
        }
        return this.picker.getDate();
    };
    /**
     * Sets the date picker value.
     * @param date The value to set the date picker to. Must be a
     * [Date](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date) object.
     */
    DatePicker.prototype.setValue = function (date) {
        this.picker.setDate(date);
        this.wasReset = false;
    };
    /**
     * Gets the element on which the date picker is bound.
     * @returns {HTMLInputElement} The date picker element.
     */
    DatePicker.prototype.build = function () {
        return this.element;
    };
    DatePicker.prototype.buildContent = function () {
        var _this = this;
        this.element = Dom_1.$$('input', { className: 'coveo-button' }).el;
        this.element.readOnly = true;
        this.picker = new Pikaday({
            field: this.element,
            onSelect: function () {
                _this.wasReset = false;
                _this.onChange.call(_this, _this);
            },
            i18n: {
                previousMonth: Strings_1.l('PreviousMonth'),
                nextMonth: Strings_1.l('NextMonth'),
                months: Globalize.culture().calendar.months.names,
                weekdays: Globalize.culture().calendar.days.names,
                weekdaysShort: Globalize.culture().calendar.days.namesAbbr
            }
        });
    };
    return DatePicker;
}());
DatePicker.doExport = function () {
    GlobalExports_1.exportGlobally({
        'DatePicker': DatePicker
    });
};
exports.DatePicker = DatePicker;


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SVGIcons = (function () {
    function SVGIcons() {
    }
    return SVGIcons;
}());
SVGIcons.search = __webpack_require__(466);
SVGIcons.more = __webpack_require__(464);
SVGIcons.loading = __webpack_require__(462);
SVGIcons.checkboxHookExclusionMore = __webpack_require__(451);
SVGIcons.arrowUp = __webpack_require__(449);
SVGIcons.arrowDown = __webpack_require__(448);
SVGIcons.mainClear = __webpack_require__(463);
SVGIcons.orAnd = __webpack_require__(465);
SVGIcons.sort = __webpack_require__(467);
SVGIcons.ascending = __webpack_require__(450);
SVGIcons.descending = __webpack_require__(452);
SVGIcons.dropdownMore = __webpack_require__(457);
SVGIcons.dropdownLess = __webpack_require__(456);
SVGIcons.facetCollapse = __webpack_require__(460);
SVGIcons.facetExpand = __webpack_require__(461);
SVGIcons.dropdownShareQuery = __webpack_require__(459);
SVGIcons.dropdownPreferences = __webpack_require__(458);
SVGIcons.dropdownAuthenticate = __webpack_require__(453);
SVGIcons.dropdownExport = __webpack_require__(454);
SVGIcons.dropdownFollowQuery = __webpack_require__(455);
exports.SVGIcons = SVGIcons;


/***/ }),

/***/ 245:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TextInput_1 = __webpack_require__(48);
var AdvancedSearchEvents_1 = __webpack_require__(60);
var Dom_1 = __webpack_require__(3);
var KeywordsInput = (function () {
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

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SVGDom = (function () {
    function SVGDom() {
    }
    SVGDom.addClassToSVGInContainer = function (svgContainer, classToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', "" + SVGDom.getClass(svgElement) + classToAdd);
    };
    SVGDom.removeClassFromSVGInContainer = function (svgContainer, classToRemove) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', SVGDom.getClass(svgElement).replace(classToRemove, ''));
    };
    SVGDom.getClass = function (svgElement) {
        var className = svgElement.getAttribute('class');
        return className ? className + ' ' : '';
    };
    return SVGDom;
}());
exports.SVGDom = SVGDom;


/***/ }),

/***/ 280:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AdvancedSearchEvents_1 = __webpack_require__(60);
var Dom_1 = __webpack_require__(3);
var RadioButton_1 = __webpack_require__(82);
var _ = __webpack_require__(1);
var DateInput = (function () {
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

/***/ 281:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(3);
var AdvancedSearchEvents_1 = __webpack_require__(60);
var Strings_1 = __webpack_require__(10);
var DocumentInput = (function () {
    function DocumentInput(inputName, root) {
        this.inputName = inputName;
        this.root = root;
    }
    DocumentInput.prototype.reset = function () {
    };
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

/***/ 282:
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
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var QueryEvents_1 = __webpack_require__(11);
var AdvancedSearchEvents_1 = __webpack_require__(60);
var SettingsEvents_1 = __webpack_require__(40);
var Initialization_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(10);
var Dom_1 = __webpack_require__(3);
var AdvancedSearchInputFactory_1 = __webpack_require__(611);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var QuerySummaryEvents_1 = __webpack_require__(412);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(569);
var NumericSpinner_1 = __webpack_require__(83);
var DatePicker_1 = __webpack_require__(101);
var Dropdown_1 = __webpack_require__(53);
var TextInput_1 = __webpack_require__(48);
var RadioButton_1 = __webpack_require__(82);
var ExternalModulesShim_1 = __webpack_require__(23);
var BreadcrumbEvents_1 = __webpack_require__(43);
var SVGIcons_1 = __webpack_require__(21);
var SVGDom_1 = __webpack_require__(28);
/**
 * The `AdvancedSearch` component is meant to render a section in the [`Settings`]{@link Settings} menu to allow the end
 * user to easily create complex queries to send to the index.
 *
 * **Note:**
 * > You can write custom code to add new sections in the **Advanced Search** modal box generated by this component by
 * > attaching a handler to the [`buildingAdvancedSearch`]{@link AdvancedSearchEvents.buildingAdvancedSearch} event.
 */
var AdvancedSearch = (function (_super) {
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
                className: 'coveo-advanced-search-modal'
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
        var _this = this;
        if (this.needToPopulateBreadcrumb) {
            var elem = Dom_1.$$('div', {
                className: 'coveo-advanced-search-breadcrumb'
            });
            var title = Dom_1.$$('span', {
                className: 'coveo-title'
            });
            title.text(Strings_1.l('FiltersInAdvancedSearch') + ' : ');
            var clear = Dom_1.$$('span', {
                className: 'coveo-advanced-search-breadcrumb-clear'
            }, SVGIcons_1.SVGIcons.checkboxHookExclusionMore);
            SVGDom_1.SVGDom.addClassToSVGInContainer(clear.el, 'coveo-advanced-search-breadcrumb-clear-svg');
            clear.on('click', function () {
                _this.handleClearBreadcrumb();
                _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbAdvancedSearch, {});
                _this.queryController.executeQuery();
            });
            elem.append(title.el);
            elem.append(clear.el);
            args.breadcrumbs.push({
                element: elem.el
            });
        }
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
            svgIcon: SVGIcons_1.SVGIcons.dropdownPreferences,
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
        var sectionHTML = this.buildSectionTitle(section);
        this.inputs = _.union(this.inputs, section.inputs);
        sectionHTML.appendChild(section.content);
        return sectionHTML;
    };
    AdvancedSearch.prototype.buildInternalSection = function (section) {
        var _this = this;
        var sectionHTML = this.buildSectionTitle(section);
        var sectionInputs = [];
        _.each(section.inputs, function (input) {
            sectionInputs.push(_this.buildDefaultInput(input));
        });
        this.inputs = _.union(this.inputs, sectionInputs);
        _.each(sectionInputs, function (input) {
            Dom_1.$$(sectionHTML).append(input.build());
        });
        return sectionHTML;
    };
    AdvancedSearch.prototype.buildSectionTitle = function (section) {
        var sectionHTML = Dom_1.$$('div', { className: 'coveo-advanced-search-section' });
        var title = Dom_1.$$('div', { className: 'coveo-advanced-search-section-title' });
        title.text(section.name);
        sectionHTML.append(title.el);
        return sectionHTML.el;
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
        this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) { return _this.handlePopulateBreadcrumb(args); });
        this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function (args) { return _this.handleClearBreadcrumb(); });
        this.bind.onRootElement(SettingsEvents_1.SettingsEvents.settingsPopulateMenu, function (args) { return _this.handlePopulateMenu(args); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (data) { return _this.handleBuildingQuery(data); });
        this.bind.onRootElement(AdvancedSearchEvents_1.AdvancedSearchEvents.executeAdvancedSearch, function () { return _this.executeAdvancedSearch(); });
        this.bind.onRootElement(QuerySummaryEvents_1.QuerySummaryEvents.cancelLastAction, function () { return _this.handleQuerySummaryCancelLastAction(); });
    };
    return AdvancedSearch;
}(Component_1.Component));
AdvancedSearch.ID = 'AdvancedSearch';
AdvancedSearch.doExport = function () {
    GlobalExports_1.exportGlobally({
        'AdvancedSearch': AdvancedSearch,
        'NumericSpinner': NumericSpinner_1.NumericSpinner,
        'DatePicker': DatePicker_1.DatePicker,
        'Dropdown': Dropdown_1.Dropdown,
        'TextInput': TextInput_1.TextInput,
        'RadioButton': RadioButton_1.RadioButton
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
exports.AdvancedSearch = AdvancedSearch;
Initialization_1.Initialization.registerAutoCreateComponent(AdvancedSearch);


/***/ }),

/***/ 412:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class is there to contains the different string definition for all the events related to the {@link AdvancedSearch} component.
 */
var QuerySummaryEvents = (function () {
    function QuerySummaryEvents() {
    }
    return QuerySummaryEvents;
}());
/**
 * Triggered when the last action is being cancelled by the query summary component
 *
 * Allows external code to revert their last action.
 * @type {string}
 */
QuerySummaryEvents.cancelLastAction = 'cancelLastAction';
exports.QuerySummaryEvents = QuerySummaryEvents;


/***/ }),

/***/ 448:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 10 6\" viewBox=\"0 0 10 6\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m5 5.932c-.222 0-.443-.084-.612-.253l-4.134-4.134c-.338-.338-.338-.886 0-1.224s.886-.338 1.224 0l3.522 3.521 3.523-3.521c.336-.338.886-.338 1.224 0s .337.886-.001 1.224l-4.135 4.134c-.168.169-.39.253-.611.253z\"></path></g></svg>"

/***/ }),

/***/ 449:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 10 6\" viewBox=\"0 0 10 6\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m5 .068c.222 0 .443.084.612.253l4.134 4.134c.338.338.338.886 0 1.224s-.886.338-1.224 0l-3.522-3.521-3.523 3.521c-.336.338-.886.338-1.224 0s-.337-.886.001-1.224l4.134-4.134c.168-.169.39-.253.612-.253z\"></path></g></svg>"

/***/ }),

/***/ 450:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 12\" viewBox=\"0 0 15 12\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m10.936 2.021 0 0c0 .549-.452.998-1.004.998h-1.004c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h1.004c.552 0 1.004.449 1.004.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m12.943 5.015 0 0c0 .549-.452.998-1.004.998h-3.011c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h3.011c.553 0 1.004.449 1.004.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m15 8.008 0 0c0 .549-.452.998-1.004.998h-5.068c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h5.068c.552 0 1.004.449 1.004.998z\"></path><path d=\"m6.521 2.683-2.403-2.391c-.188-.187-.444-.292-.71-.292s-.521.105-.71.292l-2.404 2.391c-.392.39-.392 1.021 0 1.411s1.027.39 1.419 0l .691-.687v7.594c0 .55.452.999 1.004.999s1.004-.449 1.004-.998v-7.594l.691.687c.392.39 1.027.39 1.419 0s .392-1.021-.001-1.412z\"></path></g></svg>"

/***/ }),

/***/ 451:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 11 11\" viewBox=\"0 0 11 11\" xmlns=\"http://www.w3.org/2000/svg\"><g class=\"coveo-more-svg\" fill=\"none\"><path d=\"m10.083 4.583h-3.666v-3.666c0-.524-.393-.917-.917-.917s-.917.393-.917.917v3.667h-3.666c-.524-.001-.917.392-.917.916s.393.917.917.917h3.667v3.667c-.001.523.392.916.916.916s.917-.393.917-.917v-3.666h3.667c.523 0 .916-.393.916-.917-.001-.524-.394-.917-.917-.917z\"></path></g><g class=\"coveo-exclusion-svg\" fill=\"none\"><path d=\"m9.233 7.989-2.489-2.489 2.489-2.489c.356-.356.356-.889 0-1.244-.356-.356-.889-.356-1.244 0l-2.489 2.489-2.489-2.489c-.356-.356-.889-.356-1.244 0-.356.356-.356.889 0 1.244l2.489 2.489-2.489 2.489c-.356.356-.356.889 0 1.244.356.356.889.356 1.244 0l2.489-2.489 2.489 2.489c.356.356.889.356 1.244 0 .356-.355.356-.889 0-1.244z\"></path></g><g class=\"coveo-hook-svg\" fill=\"none\"><path d=\"m10.252 2.213c-.155-.142-.354-.211-.573-.213-.215.005-.414.091-.561.24l-4.873 4.932-2.39-2.19c-.154-.144-.385-.214-.57-.214-.214.004-.415.09-.563.24-.148.147-.227.343-.222.549.005.207.093.4.249.542l2.905 2.662c.168.154.388.239.618.239h.022.003c.237-.007.457-.101.618-.266l5.362-5.428c.148-.148.228-.344.223-.551s-.093-.399-.248-.542z\"></path></g></svg>"

/***/ }),

/***/ 452:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 12\" viewBox=\"0 0 15 12\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m6.521 7.906c-.392-.39-1.027-.39-1.419 0l-.69.686v-7.594c0-.549-.452-.998-1.004-.998s-1.004.449-1.004.998v7.594l-.69-.686c-.392-.39-1.027-.39-1.419 0-.392.39-.392 1.021 0 1.411l2.404 2.391c.188.187.443.292.709.292s.522-.105.71-.292l2.404-2.391c.392-.391.392-1.022-.001-1.411z\"></path><path class=\"coveo-active-shape-svg\" d=\"m9.932 11.001h-1.004c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h1.004c.552 0 1.004.449 1.004.998l0 0c0 .549-.452.998-1.004.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m11.94 8.007h-3.012c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h3.011c.552 0 1.004.449 1.004.998l0 0c0 .549-.451.998-1.003.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m13.996 5.014h-5.068c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h5.068c.552 0 1.004.449 1.004.998l0 0c0 .548-.452.998-1.004.998z\"></path></g></svg>"

/***/ }),

/***/ 453:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 12 16\" viewBox=\"0 0 12 16\" xmlns=\"http://www.w3.org/2000/svg\"><g class=\"coveo-dropdown-authenticate-svg\" fill=\"none\"><path d=\"m10 5h-8c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2m0 1.5c.3 0 .5.2.5.5v5c0 .3-.2.5-.5.5h-8c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5z\"></path><path d=\"m10 5h-1.6v-1.1c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v1.1h-1.6v-1.1c0-2.1 1.8-3.9 4-3.9s4 1.8 4 3.9z\"></path></g><g class=\"coveo-dropdown-authenticate-hover-svg\" fill=\"none\"><path class=\"coveo-active-shape-svg\" d=\"m10 7h-8c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2m0 1.5c.3 0 .5.2.5.5v5c0 .3-.2.5-.5.5h-8c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5z\"></path><path d=\"m5.1.1c-1.8.4-3.1 2.1-3.1 4v2.9h1.6v-3.1c0-1.7 1.8-3 3.6-2.1.8.4 1.2 1.3 1.2 2.2v.6c0 .4.4.8.8.8s.8-.4.8-.8v-.7c0-2.4-2.3-4.4-4.9-3.8z\"></path></g></svg>"

/***/ }),

/***/ 454:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 14 14\" viewBox=\"0 0 14 14\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\" transform=\"matrix(0 1 -1 0 20 0)\"><path d=\"m7.699 8.591 1.05 1.05c.49.49 1.05 0 1.05 0s .49-.56 0-1.05l-2.31-2.381c-.28-.28-.7-.28-.98 0l-2.309 2.451c-.49.49 0 .98 0 .98s.56.49 1.05 0l1.05-1.05v7.91c0 .42.35.7.7.7s.7-.35.7-.7z\"></path><path class=\"coveo-active-shape-svg\" d=\"m10.5 12.301h2.033l.065 6.301h-11.198v-6.301h2.1c.386 0 .7-.314.7-.7l0 0c0-.386-.314-.7-.7-.7h-2.806c-.383-.001-.694.31-.694.694v7.706c0 .385.318.699.694.699h12.607c.384 0 .699-.315.699-.699v-7.7c0-.386-.316-.699-.694-.699h-2.806c-.386 0-.7.314-.7.7l0 0c0 .385.314.699.7.699z\"></path></g></svg>"

/***/ }),

/***/ 455:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 12\" viewBox=\"0 0 15 12\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m9.224 11.999c-.198 0-.496-.103-.694-.308-.397-.411-.397-1.025 0-1.436l3.965-4.409-3.966-4.102c-.397-.411-.397-1.025 0-1.436s.991-.411 1.388 0l4.859 4.922c.298.308.298.718 0 1.025l-4.859 5.435c-.198.206-.496.309-.693.309\"></path><path class=\"coveo-active-shape-svg\" d=\"m4.958.411c-.397-.411-.991-.411-1.388 0s-.397 1.025 0 1.436l2.973 2.974h-5.552c-.594 0-.991.41-.991 1.025s.397 1.025.991 1.025h5.651l-3.074 3.384c-.397.411-.397 1.025 0 1.436.199.206.398.309.695.309.298 0 .495-.103.694-.308l4.859-5.333c.298-.308.298-.718 0-1.025z\"></path></g></svg>"

/***/ }),

/***/ 456:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m14 2v12h-11.999v-12zm1.306-2h-14.607c-.386 0-.699.318-.699.694v14.607c0 .384.315.699.699.699h14.602c.385 0 .699-.316.699-.694v-14.612c0-.383-.311-.694-.694-.694z\"></path><path d=\"m10.969 9.055h-5.939c-.569 0-1.032-.448-1.032-1s .462-1 1.032-1h5.938c.57 0 1.032.448 1.032 1 .001.552-.46 1-1.031 1\"></path></g></svg>"

/***/ }),

/***/ 457:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m14 2v12h-12v-12zm1.306-2h-14.607c-.386 0-.699.318-.699.694v14.607c0 .384.315.699.699.699h14.602c.385 0 .699-.316.699-.694v-14.612c0-.383-.311-.694-.694-.694z\"></path><path d=\"m10.969 7.055h-1.97v-1.968c0-.571-.448-1.032-1-1.032s-1 .462-1 1.032v1.969h-1.969c-.57 0-1.032.448-1.032 1s .463 1 1.032 1h1.97v1.969c0 .57.448 1.032 1 1.032s1-.463 1-1.032v-1.97h1.969c.571 0 1.032-.448 1.032-1 .001-.552-.462-1-1.032-1z\"></path></g></svg>"

/***/ }),

/***/ 458:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 22 22\" viewBox=\"0 0 22 22\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m12.989 21.947h-3.978c-.752 0-1.388-.557-1.48-1.295l-.298-2.075c-.309-.154-.611-.33-.905-.526l-1.968.79c-.722.268-1.508-.028-1.858-.668l-1.977-3.419c-.366-.671-.207-1.47.365-1.922l1.669-1.306c-.013-.186-.019-.359-.019-.526s.006-.34.02-.526l-1.665-1.303c-.586-.462-.742-1.292-.365-1.932l1.985-3.434c.343-.633 1.136-.923 1.836-.65l1.98.796c.3-.2.6-.375.901-.527l.301-2.096c.089-.719.726-1.275 1.478-1.275h3.979c.753 0 1.39.557 1.479 1.296l.298 2.074c.31.154.611.33.905.526l1.968-.791c.721-.263 1.508.028 1.857.667l1.979 3.421c.365.671.207 1.47-.365 1.922l-1.669 1.305c.012.166.02.342.02.527s-.008.361-.02.526l1.665 1.302c.576.457.734 1.256.381 1.903l-2 3.463c-.35.636-1.146.922-1.84.649l-1.978-.794c-.301.199-.6.374-.902.526l-.3 2.095c-.088.72-.725 1.277-1.478 1.277m-3.539-2h3.1l.396-2.762.529-.217c.485-.2.964-.478 1.461-.851l.45-.337 2.585 1.038 1.554-2.688-2.198-1.718.071-.563c.035-.277.062-.555.062-.85s-.027-.572-.062-.85l-.071-.563 2.198-1.718-1.555-2.688-2.592 1.042-.452-.348c-.466-.358-.94-.633-1.451-.843l-.529-.217-.396-2.761h-3.1l-.396 2.762-.53.217c-.485.199-.962.477-1.46.85l-.451.337-2.584-1.038-1.554 2.688 2.196 1.718-.07.562c-.034.277-.061.564-.061.851s.027.573.062.852l.07.562-2.196 1.718 1.554 2.688 2.591-1.041.452.348c.465.356.939.632 1.452.843l.529.217z\"></path><path d=\"m11 15c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4m0-6c-1.103 0-2 .897-2 2s .897 2 2 2 2-.897 2-2-.897-2-2-2\"></path></g></svg>"

/***/ }),

/***/ 459:
/***/ (function(module, exports) {

module.exports = "<svg viewBox=\"0 0 18 14\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path class=\"coveo-active-shape-svg\" d=\"m12.1 13.5c-.426 0-.771-.332-.771-.74 0-.409.346-.74.771-.74h1.862c1.374 0 2.49-1.136 2.49-2.534v-.193c0-1.144-.756-2.15-1.839-2.448l-.488-.134-.066-.484c-.132-.979-1.11-1.673-2.041-1.458l-.635.143-.253-.578c-.626-1.429-2.024-2.352-3.562-2.352-2.147 0-3.892 1.769-3.892 3.944 0 .082.002.164.007.246l.032.541-.529.192c-.986.359-1.65 1.319-1.65 2.388v.192c0 1.398 1.117 2.535 2.49 2.535h.782c.426 0 .771.332.771.74 0 .409-.346.74-.771.74h-.782c-2.224 0-4.03-1.802-4.03-4.02v-.192c0-1.496.842-2.861 2.143-3.549.097-2.908 2.496-5.243 5.432-5.243 1.968 0 3.767 1.061 4.726 2.747 1.501-.024 2.798.945 3.198 2.327 1.495.61 2.501 2.077 2.501 3.717v.193c0 2.215-1.808 4.02-4.03 4.02h-1.863\"></path><path d=\"m9 5.234c-.098-.149-.3-.233-.511-.234-.212 0-.413.084-.561.232l-3.193 3.176c-.311.309-.312.812-.003 1.123.155.156.359.233.563.233.202 0 .406-.076.56-.231l1.822-1.813v5.485c0 .438.356.794.794.794.438 0 .794-.356.794-.794v-5.504l1.82 1.83c.309.311.812.312 1.122.002.31-.309.312-.812.002-1.123l-3.21-3.176\"></path></g></svg>"

/***/ }),

/***/ 460:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m8.01 0c-4.425 0-8.01 3.581-8.01 7.992 0 4.425 3.581 8.01 7.999 8.01l.003-.003c4.417 0 7.999-3.581 7.999-7.999 0-4.417-3.581-7.999-7.992-7.999m.002 1.5c3.58 0 6.493 2.916 6.493 6.5s-2.916 6.5-6.5 6.5h-.172c-3.506-.09-6.331-2.975-6.331-6.508 0-3.58 2.92-6.493 6.51-6.492\"></path><path d=\"m11.04 10.27c-.192 0-.384-.073-.53-.22l-2.51-2.51-2.51 2.51c-.293.293-.768.293-1.061 0s-.293-.768 0-1.061l3.041-3.04c.141-.14.332-.219.53-.219l0 0c .199 0 .39.079.53.22l3.04 3.041c.293.293.293.768 0 1.061-.146.145-.337.218-.53.218z\"></path></g></svg>"

/***/ }),

/***/ 461:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m7.991 16.002c4.425 0 8.01-3.581 8.01-7.992 0-4.425-3.581-8.01-7.999-8.01l-.003.003c-4.417 0-7.999 3.581-7.999 7.999 0 4.417 3.581 7.999 7.992 7.999m-.002-1.5c-3.58 0-6.493-2.916-6.493-6.5s2.916-6.5 6.5-6.5h.172c3.506.09 6.331 2.975 6.331 6.508 0 3.58-2.92 6.493-6.51 6.493\"></path><path d=\"m4.961 5.732c.192 0 .384.073.53.22l2.51 2.51 2.51-2.51c.293-.293.768-.293 1.061 0s .293.768 0 1.061l-3.041 3.04c-.141.14-.332.219-.53.219l0 0c-.199 0-.39-.079-.53-.22l-3.04-3.041c-.293-.293-.293-.768 0-1.061.146-.145.337-.218.53-.218z\"></path></g></svg>"

/***/ }),

/***/ 462:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 18 18\" viewBox=\"0 0 18 18\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m16.76 8.051c-.448 0-.855-.303-.969-.757-.78-3.117-3.573-5.294-6.791-5.294s-6.01 2.177-6.79 5.294c-.134.537-.679.861-1.213.727-.536-.134-.861-.677-.728-1.212 1.004-4.009 4.594-6.809 8.731-6.809 4.138 0 7.728 2.8 8.73 6.809.135.536-.191 1.079-.727 1.213-.081.02-.162.029-.243.029z\"></path><path d=\"m9 18c-4.238 0-7.943-3.007-8.809-7.149-.113-.541.234-1.071.774-1.184.541-.112 1.071.232 1.184.773.674 3.222 3.555 5.56 6.851 5.56s6.178-2.338 6.852-5.56c.113-.539.634-.892 1.184-.773.54.112.887.643.773 1.184-.866 4.142-4.57 7.149-8.809 7.149z\"></path></g></svg>"

/***/ }),

/***/ 463:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 13 13\" viewBox=\"0 0 13 13\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m7.881 6.501 4.834-4.834c.38-.38.38-1.001 0-1.381s-1.001-.38-1.381 0l-4.834 4.834-4.834-4.835c-.38-.38-1.001-.38-1.381 0s-.38 1.001 0 1.381l4.834 4.834-4.834 4.834c-.38.38-.38 1.001 0 1.381s1.001.38 1.381 0l4.834-4.834 4.834 4.834c.38.38 1.001.38 1.381 0s .38-1.001 0-1.381z\"></path></g></svg>"

/***/ }),

/***/ 464:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-more-background-svg\" fill-opacity=\"0\" d=\"m8.03.819c3.987 0 7.227 3.222 7.227 7.181s-3.239 7.181-7.227 7.181c-3.976 0-7.209-3.222-7.209-7.181s3.237-7.181 7.209-7.181\"></path><path d=\"m0 8c0 4.416 3.572 8 7.991 8 4.425 0 8.009-3.581 8.009-8 0-4.416-3.581-8-8.009-8-4.416 0-7.991 3.581-7.991 8m8.031-6.4c3.553 0 6.441 2.872 6.441 6.4s-2.887 6.4-6.441 6.4c-3.544 0-6.425-2.872-6.425-6.4s2.885-6.4 6.425-6.4\"></path><path d=\"m10.988 9.024c.551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path><path d=\"m7.991 9c .551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path><path d=\"m4.994 9c .551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path></g></svg>"

/***/ }),

/***/ 465:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 18 18\" viewBox=\"0 0 18 18\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-and-svg\" d=\"m13.769 5.294h-1.063v-1.063c0-2.329-1.894-4.231-4.231-4.231h-4.244c-2.329 0-4.231 1.894-4.231 4.231v4.244c0 2.329 1.894 4.231 4.231 4.231h1.063v1.063c0 2.329 1.894 4.231 4.231 4.231h4.244c2.329 0 4.231-1.894 4.231-4.231v-4.244c0-2.329-1.894-4.231-4.231-4.231zm2.731 8.475c0 1.506-1.225 2.731-2.731 2.731h-4.244c-1.506 0-2.731-1.225-2.731-2.731v-2.563h-2.563c-1.506 0-2.731-1.225-2.731-2.731v-4.244c0-1.506 1.225-2.731 2.731-2.731h4.244c1.506 0 2.731 1.225 2.731 2.731v2.563h2.563c1.506 0 2.731 1.225 2.731 2.731z\"></path><path class=\"coveo-or-svg\" d=\"m11.206 6.794v1.909c0 1.38-1.123 2.503-2.503 2.503h-1.909v-1.909c0-1.38 1.123-2.503 2.503-2.503zm1.5-1.5h-3.409c-2.209 0-4.003 1.792-4.003 4.003v3.409h3.409c2.209 0 4.003-1.792 4.003-4.003z\"></path></g></svg>"

/***/ }),

/***/ 466:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 20 20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-magnifier-circle-svg\" d=\"m8.368 16.736c-4.614 0-8.368-3.754-8.368-8.368s3.754-8.368 8.368-8.368 8.368 3.754 8.368 8.368-3.754 8.368-8.368 8.368m0-14.161c-3.195 0-5.793 2.599-5.793 5.793s2.599 5.793 5.793 5.793 5.793-2.599 5.793-5.793-2.599-5.793-5.793-5.793\"></path><path d=\"m18.713 20c-.329 0-.659-.126-.91-.377l-4.552-4.551c-.503-.503-.503-1.318 0-1.82.503-.503 1.318-.503 1.82 0l4.552 4.551c.503.503.503 1.318 0 1.82-.252.251-.581.377-.91.377\"></path></g></svg>"

/***/ }),

/***/ 467:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 14\" viewBox=\"0 0 15 14\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m13.002 4.076 0 0c0 .536-.439.975-.975.975h-2.925c-.536 0-.975-.439-.975-.975l0 0c0-.536.439-.975.975-.975h2.925c.537 0 .975.438.975.975z\"></path><path class=\"coveo-active-shape-svg\" d=\"m13.002 9.925 0 0c0 .536-.439.975-.975.975h-2.925c-.536 0-.975-.439-.975-.975l0 0c0-.536.439-.975.975-.975h2.925c.537 0 .975.439.975.975z\"></path><path class=\"coveo-active-shape-svg\" d=\"m15 7 0 0c0 .536-.439.975-.975.975h-4.923c-.536 0-.974-.438-.974-.975l0 0c0-.536.439-.975.975-.975h4.923c.535.001.974.439.974.975z\"></path><path d=\"m4.956 9.837-.671.671v-7.015l.671.671c.381.381.997.381 1.379 0 .381-.38.381-.997 0-1.379l-2.335-2.336c-.183-.184-.431-.286-.69-.286s-.506.102-.689.286l-2.335 2.336c-.381.381-.381.997 0 1.379s.997.381 1.379 0l .671-.671v7.015l-.671-.671c-.381-.381-.997-.381-1.379 0-.381.38-.381.997 0 1.379l2.335 2.336c.182.183.431.286.689.286s.506-.103.69-.287l2.335-2.336c.381-.381.381-.997 0-1.379-.382-.381-.998-.381-1.379.001z\"></path></g></svg>"

/***/ }),

/***/ 477:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 484:
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Pikaday
 *
 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

(function (root, factory)
{
    'use strict';

    var moment;
    if (true) {
        // CommonJS module
        // Load moment.js as an optional dependency
        try { moment = __webpack_require__(0); } catch (e) {}
        module.exports = factory(moment);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function (req)
        {
            // Load moment.js as an optional dependency
            var id = 'moment';
            try { moment = req(id); } catch (e) {}
            return factory(moment);
        });
    } else {
        root.Pikaday = factory(root.moment);
    }
}(this, function (moment)
{
    'use strict';

    /**
     * feature detection and helper functions
     */
    var hasMoment = typeof moment === 'function',

    hasEventListeners = !!window.addEventListener,

    document = window.document,

    sto = window.setTimeout,

    addEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    },

    removeEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.removeEventListener(e, callback, !!capture);
        } else {
            el.detachEvent('on' + e, callback);
        }
    },

    trim = function(str)
    {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    },

    hasClass = function(el, cn)
    {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    },

    addClass = function(el, cn)
    {
        if (!hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    },

    removeClass = function(el, cn)
    {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    },

    isArray = function(obj)
    {
        return (/Array/).test(Object.prototype.toString.call(obj));
    },

    isDate = function(obj)
    {
        return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
    },

    isWeekend = function(date)
    {
        var day = date.getDay();
        return day === 0 || day === 6;
    },

    isLeapYear = function(year)
    {
        // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },

    getDaysInMonth = function(year, month)
    {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    setToStartOfDay = function(date)
    {
        if (isDate(date)) date.setHours(0,0,0,0);
    },

    compareDates = function(a,b)
    {
        // weak date comparison (use setToStartOfDay(date) to ensure correct result)
        return a.getTime() === b.getTime();
    },

    extend = function(to, from, overwrite)
    {
        var prop, hasProp;
        for (prop in from) {
            hasProp = to[prop] !== undefined;
            if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
                if (isDate(from[prop])) {
                    if (overwrite) {
                        to[prop] = new Date(from[prop].getTime());
                    }
                }
                else if (isArray(from[prop])) {
                    if (overwrite) {
                        to[prop] = from[prop].slice(0);
                    }
                } else {
                    to[prop] = extend({}, from[prop], overwrite);
                }
            } else if (overwrite || !hasProp) {
                to[prop] = from[prop];
            }
        }
        return to;
    },

    fireEvent = function(el, eventName, data)
    {
        var ev;

        if (document.createEvent) {
            ev = document.createEvent('HTMLEvents');
            ev.initEvent(eventName, true, false);
            ev = extend(ev, data);
            el.dispatchEvent(ev);
        } else if (document.createEventObject) {
            ev = document.createEventObject();
            ev = extend(ev, data);
            el.fireEvent('on' + eventName, ev);
        }
    },

    adjustCalendar = function(calendar) {
        if (calendar.month < 0) {
            calendar.year -= Math.ceil(Math.abs(calendar.month)/12);
            calendar.month += 12;
        }
        if (calendar.month > 11) {
            calendar.year += Math.floor(Math.abs(calendar.month)/12);
            calendar.month -= 12;
        }
        return calendar;
    },

    /**
     * defaults and localisation
     */
    defaults = {

        // bind the picker to a form field
        field: null,

        // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
        bound: undefined,

        // position of the datepicker, relative to the field (default to bottom & left)
        // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
        position: 'bottom left',

        // automatically fit in the viewport even if it means repositioning from the position option
        reposition: true,

        // the default output format for `.toString()` and `field` value
        format: 'YYYY-MM-DD',

        // the toString function which gets passed a current date object and format
        // and returns a string
        toString: null,

        // used to create date object from current input string
        parse: null,

        // the initial date to view when first opened
        defaultDate: null,

        // make the `defaultDate` the initial selected value
        setDefaultDate: false,

        // first day of week (0: Sunday, 1: Monday etc)
        firstDay: 0,

        // the default flag for moment's strict date parsing
        formatStrict: false,

        // the minimum/earliest date that can be selected
        minDate: null,
        // the maximum/latest date that can be selected
        maxDate: null,

        // number of years either side, or array of upper/lower range
        yearRange: 10,

        // show week numbers at head of row
        showWeekNumber: false,

        // Week picker mode
        pickWholeWeek: false,

        // used internally (don't config outside)
        minYear: 0,
        maxYear: 9999,
        minMonth: undefined,
        maxMonth: undefined,

        startRange: null,
        endRange: null,

        isRTL: false,

        // Additional text to append to the year in the calendar title
        yearSuffix: '',

        // Render the month after year in the calendar title
        showMonthAfterYear: false,

        // Render days of the calendar grid that fall in the next or previous month
        showDaysInNextAndPreviousMonths: false,

        // Allows user to select days that fall in the next or previous month
        enableSelectionDaysInNextAndPreviousMonths: false,

        // how many months are visible
        numberOfMonths: 1,

        // when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
        // only used for the first display or when a selected date is not visible
        mainCalendar: 'left',

        // Specify a DOM element to render the calendar in
        container: undefined,

        // Blur field when date is selected
        blurFieldOnSelect : true,

        // internationalization
        i18n: {
            previousMonth : 'Previous Month',
            nextMonth     : 'Next Month',
            months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
            weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        },

        // Theme Classname
        theme: null,

        // events array
        events: [],

        // callback function
        onSelect: null,
        onOpen: null,
        onClose: null,
        onDraw: null
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function(opts, day, abbr)
    {
        day += opts.firstDay;
        while (day >= 7) {
            day -= 7;
        }
        return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },

    renderDay = function(opts)
    {
        var arr = [];
        var ariaSelected = 'false';
        if (opts.isEmpty) {
            if (opts.showDaysInNextAndPreviousMonths) {
                arr.push('is-outside-current-month');

                if(!opts.enableSelectionDaysInNextAndPreviousMonths) {
                    arr.push('is-selection-disabled');
                }

            } else {
                return '<td class="is-empty"></td>';
            }
        }
        if (opts.isDisabled) {
            arr.push('is-disabled');
        }
        if (opts.isToday) {
            arr.push('is-today');
        }
        if (opts.isSelected) {
            arr.push('is-selected');
            ariaSelected = 'true';
        }
        if (opts.hasEvent) {
            arr.push('has-event');
        }
        if (opts.isInRange) {
            arr.push('is-inrange');
        }
        if (opts.isStartRange) {
            arr.push('is-startrange');
        }
        if (opts.isEndRange) {
            arr.push('is-endrange');
        }
        return '<td data-day="' + opts.day + '" class="' + arr.join(' ') + '" aria-selected="' + ariaSelected + '">' +
                 '<button class="pika-button pika-day" type="button" ' +
                    'data-pika-year="' + opts.year + '" data-pika-month="' + opts.month + '" data-pika-day="' + opts.day + '">' +
                        opts.day +
                 '</button>' +
               '</td>';
    },

    renderWeek = function (d, m, y) {
        // Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
        var onejan = new Date(y, 0, 1),
            weekNum = Math.ceil((((new Date(y, m, d) - onejan) / 86400000) + onejan.getDay()+1)/7);
        return '<td class="pika-week">' + weekNum + '</td>';
    },

    renderRow = function(days, isRTL, pickWholeWeek, isRowSelected)
    {
        return '<tr class="pika-row' + (pickWholeWeek ? ' pick-whole-week' : '') + (isRowSelected ? ' is-selected' : '') + '">' + (isRTL ? days.reverse() : days).join('') + '</tr>';
    },

    renderBody = function(rows)
    {
        return '<tbody>' + rows.join('') + '</tbody>';
    },

    renderHead = function(opts)
    {
        var i, arr = [];
        if (opts.showWeekNumber) {
            arr.push('<th></th>');
        }
        for (i = 0; i < 7; i++) {
            arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
        }
        return '<thead><tr>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</tr></thead>';
    },

    renderTitle = function(instance, c, year, month, refYear, randId)
    {
        var i, j, arr,
            opts = instance._o,
            isMinYear = year === opts.minYear,
            isMaxYear = year === opts.maxYear,
            html = '<div id="' + randId + '" class="pika-title" role="heading" aria-live="assertive">',
            monthHtml,
            yearHtml,
            prev = true,
            next = true;

        for (arr = [], i = 0; i < 12; i++) {
            arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' +
                (i === month ? ' selected="selected"': '') +
                ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth) ? 'disabled="disabled"' : '') + '>' +
                opts.i18n.months[i] + '</option>');
        }

        monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month" tabindex="-1">' + arr.join('') + '</select></div>';

        if (isArray(opts.yearRange)) {
            i = opts.yearRange[0];
            j = opts.yearRange[1] + 1;
        } else {
            i = year - opts.yearRange;
            j = 1 + year + opts.yearRange;
        }

        for (arr = []; i < j && i <= opts.maxYear; i++) {
            if (i >= opts.minYear) {
                arr.push('<option value="' + i + '"' + (i === year ? ' selected="selected"': '') + '>' + (i) + '</option>');
            }
        }
        yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + arr.join('') + '</select></div>';

        if (opts.showMonthAfterYear) {
            html += yearHtml + monthHtml;
        } else {
            html += monthHtml + yearHtml;
        }

        if (isMinYear && (month === 0 || opts.minMonth >= month)) {
            prev = false;
        }

        if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
            next = false;
        }

        if (c === 0) {
            html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
        }
        if (c === (instance._o.numberOfMonths - 1) ) {
            html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';
        }

        return html += '</div>';
    },

    renderTable = function(opts, data, randId)
    {
        return '<table cellpadding="0" cellspacing="0" class="pika-table" role="grid" aria-labelledby="' + randId + '">' + renderHead(opts) + renderBody(data) + '</table>';
    },


    /**
     * Pikaday constructor
     */
    Pikaday = function(options)
    {
        var self = this,
            opts = self.config(options);

        self._onMouseDown = function(e)
        {
            if (!self._v) {
                return;
            }
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (!hasClass(target, 'is-disabled')) {
                if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty') && !hasClass(target.parentNode, 'is-disabled')) {
                    self.setDate(new Date(target.getAttribute('data-pika-year'), target.getAttribute('data-pika-month'), target.getAttribute('data-pika-day')));
                    if (opts.bound) {
                        sto(function() {
                            self.hide();
                            if (opts.blurFieldOnSelect && opts.field) {
                                opts.field.blur();
                            }
                        }, 100);
                    }
                }
                else if (hasClass(target, 'pika-prev')) {
                    self.prevMonth();
                }
                else if (hasClass(target, 'pika-next')) {
                    self.nextMonth();
                }
            }
            if (!hasClass(target, 'pika-select')) {
                // if this is touch event prevent mouse events emulation
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                    return false;
                }
            } else {
                self._c = true;
            }
        };

        self._onChange = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }
            if (hasClass(target, 'pika-select-month')) {
                self.gotoMonth(target.value);
            }
            else if (hasClass(target, 'pika-select-year')) {
                self.gotoYear(target.value);
            }
        };

        self._onKeyChange = function(e)
        {
            e = e || window.event;

            if (self.isVisible()) {

                switch(e.keyCode){
                    case 13:
                    case 27:
                        if (opts.field) {
                            opts.field.blur();
                        }
                        break;
                    case 37:
                        e.preventDefault();
                        self.adjustDate('subtract', 1);
                        break;
                    case 38:
                        self.adjustDate('subtract', 7);
                        break;
                    case 39:
                        self.adjustDate('add', 1);
                        break;
                    case 40:
                        self.adjustDate('add', 7);
                        break;
                }
            }
        };

        self._onInputChange = function(e)
        {
            var date;

            if (e.firedBy === self) {
                return;
            }
            if (opts.parse) {
                date = opts.parse(opts.field.value, opts.format);
            } else if (hasMoment) {
                date = moment(opts.field.value, opts.format, opts.formatStrict);
                date = (date && date.isValid()) ? date.toDate() : null;
            }
            else {
                date = new Date(Date.parse(opts.field.value));
            }
            if (isDate(date)) {
              self.setDate(date);
            }
            if (!self._v) {
                self.show();
            }
        };

        self._onInputFocus = function()
        {
            self.show();
        };

        self._onInputClick = function()
        {
            self.show();
        };

        self._onInputBlur = function()
        {
            // IE allows pika div to gain focus; catch blur the input field
            var pEl = document.activeElement;
            do {
                if (hasClass(pEl, 'pika-single')) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));

            if (!self._c) {
                self._b = sto(function() {
                    self.hide();
                }, 50);
            }
            self._c = false;
        };

        self._onClick = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement,
                pEl = target;
            if (!target) {
                return;
            }
            if (!hasEventListeners && hasClass(target, 'pika-select')) {
                if (!target.onchange) {
                    target.setAttribute('onchange', 'return;');
                    addEvent(target, 'change', self._onChange);
                }
            }
            do {
                if (hasClass(pEl, 'pika-single') || pEl === opts.trigger) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));
            if (self._v && target !== opts.trigger && pEl !== opts.trigger) {
                self.hide();
            }
        };

        self.el = document.createElement('div');
        self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '') + (opts.theme ? ' ' + opts.theme : '');

        addEvent(self.el, 'mousedown', self._onMouseDown, true);
        addEvent(self.el, 'touchend', self._onMouseDown, true);
        addEvent(self.el, 'change', self._onChange);
        addEvent(document, 'keydown', self._onKeyChange);

        if (opts.field) {
            if (opts.container) {
                opts.container.appendChild(self.el);
            } else if (opts.bound) {
                document.body.appendChild(self.el);
            } else {
                opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
            }
            addEvent(opts.field, 'change', self._onInputChange);

            if (!opts.defaultDate) {
                if (hasMoment && opts.field.value) {
                    opts.defaultDate = moment(opts.field.value, opts.format).toDate();
                } else {
                    opts.defaultDate = new Date(Date.parse(opts.field.value));
                }
                opts.setDefaultDate = true;
            }
        }

        var defDate = opts.defaultDate;

        if (isDate(defDate)) {
            if (opts.setDefaultDate) {
                self.setDate(defDate, true);
            } else {
                self.gotoDate(defDate);
            }
        } else {
            self.gotoDate(new Date());
        }

        if (opts.bound) {
            this.hide();
            self.el.className += ' is-bound';
            addEvent(opts.trigger, 'click', self._onInputClick);
            addEvent(opts.trigger, 'focus', self._onInputFocus);
            addEvent(opts.trigger, 'blur', self._onInputBlur);
        } else {
            this.show();
        }
    };


    /**
     * public Pikaday API
     */
    Pikaday.prototype = {


        /**
         * configure functionality
         */
        config: function(options)
        {
            if (!this._o) {
                this._o = extend({}, defaults, true);
            }

            var opts = extend(this._o, options, true);

            opts.isRTL = !!opts.isRTL;

            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

            opts.theme = (typeof opts.theme) === 'string' && opts.theme ? opts.theme : null;

            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

            opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;

            opts.disableWeekends = !!opts.disableWeekends;

            opts.disableDayFn = (typeof opts.disableDayFn) === 'function' ? opts.disableDayFn : null;

            var nom = parseInt(opts.numberOfMonths, 10) || 1;
            opts.numberOfMonths = nom > 4 ? 4 : nom;

            if (!isDate(opts.minDate)) {
                opts.minDate = false;
            }
            if (!isDate(opts.maxDate)) {
                opts.maxDate = false;
            }
            if ((opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate) {
                opts.maxDate = opts.minDate = false;
            }
            if (opts.minDate) {
                this.setMinDate(opts.minDate);
            }
            if (opts.maxDate) {
                this.setMaxDate(opts.maxDate);
            }

            if (isArray(opts.yearRange)) {
                var fallback = new Date().getFullYear() - 10;
                opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
                opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
            } else {
                opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
                if (opts.yearRange > 100) {
                    opts.yearRange = 100;
                }
            }

            return opts;
        },

        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function(format)
        {
            format = format || this._o.format;
            if (!isDate(this._d)) {
                return '';
            }
            if (this._o.toString) {
              return this._o.toString(this._d, format);
            }
            if (hasMoment) {
              return moment(this._d).format(format);
            }
            return this._d.toDateString();
        },

        /**
         * return a Moment.js object of the current selection (if available)
         */
        getMoment: function()
        {
            return hasMoment ? moment(this._d) : null;
        },

        /**
         * set the current selection from a Moment.js object (if available)
         */
        setMoment: function(date, preventOnSelect)
        {
            if (hasMoment && moment.isMoment(date)) {
                this.setDate(date.toDate(), preventOnSelect);
            }
        },

        /**
         * return a Date object of the current selection
         */
        getDate: function()
        {
            return isDate(this._d) ? new Date(this._d.getTime()) : null;
        },

        /**
         * set the current selection
         */
        setDate: function(date, preventOnSelect)
        {
            if (!date) {
                this._d = null;

                if (this._o.field) {
                    this._o.field.value = '';
                    fireEvent(this._o.field, 'change', { firedBy: this });
                }

                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (!isDate(date)) {
                return;
            }

            var min = this._o.minDate,
                max = this._o.maxDate;

            if (isDate(min) && date < min) {
                date = min;
            } else if (isDate(max) && date > max) {
                date = max;
            }

            this._d = new Date(date.getTime());
            setToStartOfDay(this._d);
            this.gotoDate(this._d);

            if (this._o.field) {
                this._o.field.value = this.toString();
                fireEvent(this._o.field, 'change', { firedBy: this });
            }
            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
                this._o.onSelect.call(this, this.getDate());
            }
        },

        /**
         * change view to a specific date
         */
        gotoDate: function(date)
        {
            var newCalendar = true;

            if (!isDate(date)) {
                return;
            }

            if (this.calendars) {
                var firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
                    lastVisibleDate = new Date(this.calendars[this.calendars.length-1].year, this.calendars[this.calendars.length-1].month, 1),
                    visibleDate = date.getTime();
                // get the end of the month
                lastVisibleDate.setMonth(lastVisibleDate.getMonth()+1);
                lastVisibleDate.setDate(lastVisibleDate.getDate()-1);
                newCalendar = (visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate);
            }

            if (newCalendar) {
                this.calendars = [{
                    month: date.getMonth(),
                    year: date.getFullYear()
                }];
                if (this._o.mainCalendar === 'right') {
                    this.calendars[0].month += 1 - this._o.numberOfMonths;
                }
            }

            this.adjustCalendars();
        },

        adjustDate: function(sign, days) {

            var day = this.getDate() || new Date();
            var difference = parseInt(days)*24*60*60*1000;

            var newDay;

            if (sign === 'add') {
                newDay = new Date(day.valueOf() + difference);
            } else if (sign === 'subtract') {
                newDay = new Date(day.valueOf() - difference);
            }

            this.setDate(newDay);
        },

        adjustCalendars: function() {
            this.calendars[0] = adjustCalendar(this.calendars[0]);
            for (var c = 1; c < this._o.numberOfMonths; c++) {
                this.calendars[c] = adjustCalendar({
                    month: this.calendars[0].month + c,
                    year: this.calendars[0].year
                });
            }
            this.draw();
        },

        gotoToday: function()
        {
            this.gotoDate(new Date());
        },

        /**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
        gotoMonth: function(month)
        {
            if (!isNaN(month)) {
                this.calendars[0].month = parseInt(month, 10);
                this.adjustCalendars();
            }
        },

        nextMonth: function()
        {
            this.calendars[0].month++;
            this.adjustCalendars();
        },

        prevMonth: function()
        {
            this.calendars[0].month--;
            this.adjustCalendars();
        },

        /**
         * change view to a specific full year (e.g. "2012")
         */
        gotoYear: function(year)
        {
            if (!isNaN(year)) {
                this.calendars[0].year = parseInt(year, 10);
                this.adjustCalendars();
            }
        },

        /**
         * change the minDate
         */
        setMinDate: function(value)
        {
            if(value instanceof Date) {
                setToStartOfDay(value);
                this._o.minDate = value;
                this._o.minYear  = value.getFullYear();
                this._o.minMonth = value.getMonth();
            } else {
                this._o.minDate = defaults.minDate;
                this._o.minYear  = defaults.minYear;
                this._o.minMonth = defaults.minMonth;
                this._o.startRange = defaults.startRange;
            }

            this.draw();
        },

        /**
         * change the maxDate
         */
        setMaxDate: function(value)
        {
            if(value instanceof Date) {
                setToStartOfDay(value);
                this._o.maxDate = value;
                this._o.maxYear = value.getFullYear();
                this._o.maxMonth = value.getMonth();
            } else {
                this._o.maxDate = defaults.maxDate;
                this._o.maxYear = defaults.maxYear;
                this._o.maxMonth = defaults.maxMonth;
                this._o.endRange = defaults.endRange;
            }

            this.draw();
        },

        setStartRange: function(value)
        {
            this._o.startRange = value;
        },

        setEndRange: function(value)
        {
            this._o.endRange = value;
        },

        /**
         * refresh the HTML
         */
        draw: function(force)
        {
            if (!this._v && !force) {
                return;
            }
            var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth,
                html = '',
                randId;

            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }

            randId = 'pika-title-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2);

            for (var c = 0; c < opts.numberOfMonths; c++) {
                html += '<div class="pika-lendar">' + renderTitle(this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year, randId) + this.render(this.calendars[c].year, this.calendars[c].month, randId) + '</div>';
            }

            this.el.innerHTML = html;

            if (opts.bound) {
                if(opts.field.type !== 'hidden') {
                    sto(function() {
                        opts.trigger.focus();
                    }, 1);
                }
            }

            if (typeof this._o.onDraw === 'function') {
                this._o.onDraw(this);
            }

            if (opts.bound) {
                // let the screen reader user know to use arrow keys
                opts.field.setAttribute('aria-label', 'Use the arrow keys to pick a date');
            }
        },

        adjustPosition: function()
        {
            var field, pEl, width, height, viewportWidth, viewportHeight, scrollTop, left, top, clientRect;

            if (this._o.container) return;

            this.el.style.position = 'absolute';

            field = this._o.trigger;
            pEl = field;
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
            viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

            if (typeof field.getBoundingClientRect === 'function') {
                clientRect = field.getBoundingClientRect();
                left = clientRect.left + window.pageXOffset;
                top = clientRect.bottom + window.pageYOffset;
            } else {
                left = pEl.offsetLeft;
                top  = pEl.offsetTop + pEl.offsetHeight;
                while((pEl = pEl.offsetParent)) {
                    left += pEl.offsetLeft;
                    top  += pEl.offsetTop;
                }
            }

            // default position is bottom & left
            if ((this._o.reposition && left + width > viewportWidth) ||
                (
                    this._o.position.indexOf('right') > -1 &&
                    left - width + field.offsetWidth > 0
                )
            ) {
                left = left - width + field.offsetWidth;
            }
            if ((this._o.reposition && top + height > viewportHeight + scrollTop) ||
                (
                    this._o.position.indexOf('top') > -1 &&
                    top - height - field.offsetHeight > 0
                )
            ) {
                top = top - height - field.offsetHeight;
            }

            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';
        },

        /**
         * render HTML for a particular month
         */
        render: function(year, month, randId)
        {
            var opts   = this._o,
                now    = new Date(),
                days   = getDaysInMonth(year, month),
                before = new Date(year, month, 1).getDay(),
                data   = [],
                row    = [];
            setToStartOfDay(now);
            if (opts.firstDay > 0) {
                before -= opts.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var previousMonth = month === 0 ? 11 : month - 1,
                nextMonth = month === 11 ? 0 : month + 1,
                yearOfPreviousMonth = month === 0 ? year - 1 : year,
                yearOfNextMonth = month === 11 ? year + 1 : year,
                daysInPreviousMonth = getDaysInMonth(yearOfPreviousMonth, previousMonth);
            var cells = days + before,
                after = cells;
            while(after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            var isWeekSelected = false;
            for (var i = 0, r = 0; i < cells; i++)
            {
                var day = new Date(year, month, 1 + (i - before)),
                    isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
                    isToday = compareDates(day, now),
                    hasEvent = opts.events.indexOf(day.toDateString()) !== -1 ? true : false,
                    isEmpty = i < before || i >= (days + before),
                    dayNumber = 1 + (i - before),
                    monthNumber = month,
                    yearNumber = year,
                    isStartRange = opts.startRange && compareDates(opts.startRange, day),
                    isEndRange = opts.endRange && compareDates(opts.endRange, day),
                    isInRange = opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange,
                    isDisabled = (opts.minDate && day < opts.minDate) ||
                                 (opts.maxDate && day > opts.maxDate) ||
                                 (opts.disableWeekends && isWeekend(day)) ||
                                 (opts.disableDayFn && opts.disableDayFn(day));

                if (isEmpty) {
                    if (i < before) {
                        dayNumber = daysInPreviousMonth + dayNumber;
                        monthNumber = previousMonth;
                        yearNumber = yearOfPreviousMonth;
                    } else {
                        dayNumber = dayNumber - days;
                        monthNumber = nextMonth;
                        yearNumber = yearOfNextMonth;
                    }
                }

                var dayConfig = {
                        day: dayNumber,
                        month: monthNumber,
                        year: yearNumber,
                        hasEvent: hasEvent,
                        isSelected: isSelected,
                        isToday: isToday,
                        isDisabled: isDisabled,
                        isEmpty: isEmpty,
                        isStartRange: isStartRange,
                        isEndRange: isEndRange,
                        isInRange: isInRange,
                        showDaysInNextAndPreviousMonths: opts.showDaysInNextAndPreviousMonths,
                        enableSelectionDaysInNextAndPreviousMonths: opts.enableSelectionDaysInNextAndPreviousMonths
                    };

                if (opts.pickWholeWeek && isSelected) {
                    isWeekSelected = true;
                }

                row.push(renderDay(dayConfig));

                if (++r === 7) {
                    if (opts.showWeekNumber) {
                        row.unshift(renderWeek(i - before, month, year));
                    }
                    data.push(renderRow(row, opts.isRTL, opts.pickWholeWeek, isWeekSelected));
                    row = [];
                    r = 0;
                    isWeekSelected = false;
                }
            }
            return renderTable(opts, data, randId);
        },

        isVisible: function()
        {
            return this._v;
        },

        show: function()
        {
            if (!this.isVisible()) {
                this._v = true;
                this.draw();
                removeClass(this.el, 'is-hidden');
                if (this._o.bound) {
                    addEvent(document, 'click', this._onClick);
                    this.adjustPosition();
                }
                if (typeof this._o.onOpen === 'function') {
                    this._o.onOpen.call(this);
                }
            }
        },

        hide: function()
        {
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    removeEvent(document, 'click', this._onClick);
                }
                this.el.style.position = 'static'; // reset
                this.el.style.left = 'auto';
                this.el.style.top = 'auto';
                addClass(this.el, 'is-hidden');
                this._v = false;
                if (v !== undefined && typeof this._o.onClose === 'function') {
                    this._o.onClose.call(this);
                }
            }
        },

        /**
         * GAME OVER
         */
        destroy: function()
        {
            this.hide();
            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
            removeEvent(this.el, 'touchend', this._onMouseDown, true);
            removeEvent(this.el, 'change', this._onChange);
            removeEvent(document, 'keydown', this._onKeyChange);
            if (this._o.field) {
                removeEvent(this._o.field, 'change', this._onInputChange);
                if (this._o.bound) {
                    removeEvent(this._o.trigger, 'click', this._onInputClick);
                    removeEvent(this._o.trigger, 'focus', this._onInputFocus);
                    removeEvent(this._o.trigger, 'blur', this._onInputBlur);
                }
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }

    };

    return Pikaday;

}));


/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(10);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
/**
 * A dropdown widget with standard styling.
 */
var Dropdown = (function () {
    /**
     * Creates a new `Dropdown`.
     * @param onChange The function to call when the dropdown selected value changes. This function takes the current
     * `Dropdown` instance as an argument.
     * @param listOfValues The selectable values to display in the dropdown.
     * @param getDisplayValue An optional function to modify the display values, rather than using the values as they
     * appear in the `listOfValues`.
     * @param label The label to display for the dropdown.
     */
    function Dropdown(onChange, listOfValues, getDisplayValue, label) {
        if (onChange === void 0) { onChange = function (dropdown) {
        }; }
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
            'Dropdown': Dropdown
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
        this.selectElement = Dom_1.$$('select', { className: 'coveo-dropdown' }).el;
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

/***/ 569:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 611:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AllKeywordsInput_1 = __webpack_require__(618);
var ExactKeywordsInput_1 = __webpack_require__(620);
var AnyKeywordsInput_1 = __webpack_require__(619);
var NoneKeywordsInput_1 = __webpack_require__(621);
var AnytimeDateInput_1 = __webpack_require__(612);
var InTheLastDateInput_1 = __webpack_require__(614);
var BetweenDateInput_1 = __webpack_require__(613);
var SimpleFieldInput_1 = __webpack_require__(616);
var AdvancedFieldInput_1 = __webpack_require__(615);
var SizeInput_1 = __webpack_require__(617);
var AdvancedSearchInputFactory = (function () {
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

/***/ 612:
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
var DateInput_1 = __webpack_require__(280);
var Strings_1 = __webpack_require__(10);
var Dom_1 = __webpack_require__(3);
var AdvancedSearchEvents_1 = __webpack_require__(60);
var AnytimeDateInput = (function (_super) {
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

/***/ 613:
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
var DateInput_1 = __webpack_require__(280);
var DatePicker_1 = __webpack_require__(101);
var Strings_1 = __webpack_require__(10);
var Dom_1 = __webpack_require__(3);
var DateUtils_1 = __webpack_require__(29);
var TimeSpanUtils_1 = __webpack_require__(63);
var BetweenDateInput = (function (_super) {
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

/***/ 614:
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
var DateInput_1 = __webpack_require__(280);
var Dom_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(10);
var Dropdown_1 = __webpack_require__(53);
var NumericSpinner_1 = __webpack_require__(83);
var DateUtils_1 = __webpack_require__(29);
var InTheLastDateInput = (function (_super) {
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
        this.spinner = new NumericSpinner_1.NumericSpinner(this.onChange.bind(this));
        input.append(this.spinner.getElement());
        this.dropdown = new Dropdown_1.Dropdown(this.onChange.bind(this), ['Days', 'Months']);
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

/***/ 615:
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
var Dropdown_1 = __webpack_require__(53);
var TextInput_1 = __webpack_require__(48);
var Dom_1 = __webpack_require__(3);
var DocumentInput_1 = __webpack_require__(281);
var QueryBuilder_1 = __webpack_require__(44);
var AdvancedFieldInput = (function (_super) {
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
        this.mode = new Dropdown_1.Dropdown(this.onChange.bind(this), ['Contains', 'DoesNotContain', 'Matches']);
        fieldInput.append(this.mode.getElement());
        this.input = new TextInput_1.TextInput(this.onChange.bind(this), '');
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

/***/ 616:
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
var Dropdown_1 = __webpack_require__(53);
var FacetUtils_1 = __webpack_require__(36);
var DocumentInput_1 = __webpack_require__(281);
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
var QueryBuilder_1 = __webpack_require__(44);
var SimpleFieldInput = (function (_super) {
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
        return this.endpoint.listFieldValues({
            field: this.fieldName,
            maximumNumberOfValues: 50
        }).then(function (values) {
            var options = [''];
            _.each(values, function (value) {
                options.push(value.value);
            });
            _this.dropDown = new Dropdown_1.Dropdown(_this.onChange.bind(_this), options, function (str) {
                return FacetUtils_1.FacetUtils.tryToGetTranslatedCaption(_this.fieldName, str);
            });
        });
    };
    return SimpleFieldInput;
}(DocumentInput_1.DocumentInput));
exports.SimpleFieldInput = SimpleFieldInput;


/***/ }),

/***/ 617:
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
var Dropdown_1 = __webpack_require__(53);
var NumericSpinner_1 = __webpack_require__(83);
var Dom_1 = __webpack_require__(3);
var DocumentInput_1 = __webpack_require__(281);
var QueryBuilder_1 = __webpack_require__(44);
var SizeInput = (function (_super) {
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
        this.modeSelect = new Dropdown_1.Dropdown(this.onChange.bind(this), SizeInput.modes);
        this.modeSelect.setId('coveo-size-input-mode');
        sizeInputSection.append(this.modeSelect.getElement());
        this.sizeInput = new NumericSpinner_1.NumericSpinner(this.onChange.bind(this));
        sizeInputSection.append(this.sizeInput.getElement());
        this.sizeSelect = new Dropdown_1.Dropdown(this.onChange.bind(this), SizeInput.sizes);
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
    return SizeInput;
}(DocumentInput_1.DocumentInput));
SizeInput.modes = ['AtLeast', 'AtMost'];
SizeInput.sizes = ['KB', 'MB', 'Bytes'];
exports.SizeInput = SizeInput;


/***/ }),

/***/ 618:
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
var KeywordsInput_1 = __webpack_require__(245);
var Strings_1 = __webpack_require__(10);
var AllKeywordsInput = (function (_super) {
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

/***/ 619:
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
var KeywordsInput_1 = __webpack_require__(245);
var Strings_1 = __webpack_require__(10);
var _ = __webpack_require__(1);
var AnyKeywordsInput = (function (_super) {
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

/***/ 620:
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
var KeywordsInput_1 = __webpack_require__(245);
var Strings_1 = __webpack_require__(10);
var ExactKeywordsInput = (function (_super) {
    __extends(ExactKeywordsInput, _super);
    function ExactKeywordsInput(root) {
        var _this = _super.call(this, Strings_1.l('ExactPhrase'), root) || this;
        _this.root = root;
        return _this;
    }
    ExactKeywordsInput.prototype.getValue = function () {
        var value = _super.prototype.getValue.call(this);
        return value ? '\"' + value + '\"' : '';
    };
    return ExactKeywordsInput;
}(KeywordsInput_1.KeywordsInput));
exports.ExactKeywordsInput = ExactKeywordsInput;


/***/ }),

/***/ 621:
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
var KeywordsInput_1 = __webpack_require__(245);
var Strings_1 = __webpack_require__(10);
var _ = __webpack_require__(1);
var NoneKeywordsInput = (function (_super) {
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

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(3);
__webpack_require__(477);
var GlobalExports_1 = __webpack_require__(4);
/**
 * A radio button widget with standard styling.
 */
var RadioButton = (function () {
    /**
     * Creates a new `RadioButton`.
     * @param onChange The function to call when the radio button value changes. This function takes the current
     * `RadioButton` instance as an argument.
     * @param label The label to display next to the radio button.
     * @param name The value to set the `input` HTMLElement `name` attribute to.
     */
    function RadioButton(onChange, label, name) {
        if (onChange === void 0) { onChange = function (radioButton) {
        }; }
        this.onChange = onChange;
        this.label = label;
        this.name = name;
        this.buildContent();
    }
    RadioButton.doExport = function () {
        GlobalExports_1.exportGlobally({
            'RadioButton': RadioButton
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
        var radioInput = Dom_1.$$('input', { type: 'radio', name: this.name, id: this.label });
        var labelInput = Dom_1.$$('label', { className: 'coveo-radio-input-label', 'for': this.label });
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


/***/ }),

/***/ 83:
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
//# sourceMappingURL=AdvancedSearch.js.map