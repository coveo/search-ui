webpackJsonpCoveo__temporary([5,46,53,54,72],{

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TextInput_1 = __webpack_require__(47);
var AdvancedSearchEvents_1 = __webpack_require__(63);
var Dom_1 = __webpack_require__(2);
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

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var SVGDom = /** @class */ (function () {
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
    SVGDom.addStyleToSVGInContainer = function (svgContainer, styleToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        _.each(styleToAdd, function (styleValue, styleKey) {
            svgElement.style[styleKey] = styleValue;
        });
    };
    SVGDom.getClass = function (svgElement) {
        var className = svgElement.getAttribute('class');
        return className ? className + ' ' : '';
    };
    return SVGDom;
}());
exports.SVGDom = SVGDom;


/***/ }),

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AdvancedSearchEvents_1 = __webpack_require__(63);
var Dom_1 = __webpack_require__(2);
var RadioButton_1 = __webpack_require__(79);
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

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var AdvancedSearchEvents_1 = __webpack_require__(63);
var Strings_1 = __webpack_require__(8);
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

/***/ 160:
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
var QueryEvents_1 = __webpack_require__(10);
var AdvancedSearchEvents_1 = __webpack_require__(63);
var SettingsEvents_1 = __webpack_require__(39);
var Initialization_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(2);
var AdvancedSearchInputFactory_1 = __webpack_require__(355);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var QuerySummaryEvents_1 = __webpack_require__(323);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(366);
var NumericSpinner_1 = __webpack_require__(80);
var DatePicker_1 = __webpack_require__(96);
var Dropdown_1 = __webpack_require__(50);
var TextInput_1 = __webpack_require__(47);
var RadioButton_1 = __webpack_require__(79);
var ExternalModulesShim_1 = __webpack_require__(23);
var BreadcrumbEvents_1 = __webpack_require__(38);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
/**
 * The `AdvancedSearch` component is meant to render a section in the [`Settings`]{@link Settings} menu to allow the end
 * user to easily create complex queries to send to the index.
 *
 * **Note:**
 * > You can write custom code to add new sections in the **Advanced Search** modal box generated by this component by
 * > attaching a handler to the [`buildingAdvancedSearch`]{@link AdvancedSearchEvents.buildingAdvancedSearch} event.
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
            }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
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

/***/ 323:
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

/***/ 339:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 341:
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
        try { moment = __webpack_require__(98); } catch (e) {}
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
        onDraw: null,

        // Enable keyboard input
        keyboardInput: true
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

        if (opts.keyboardInput) {
            addEvent(document, 'keydown', self._onKeyChange);
        }

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
            var opts = this._o;

            this.hide();
            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
            removeEvent(this.el, 'touchend', this._onMouseDown, true);
            removeEvent(this.el, 'change', this._onChange);
            if (opts.keyboardInput) {
                removeEvent(document, 'keydown', this._onKeyChange);
            }
            if (opts.field) {
                removeEvent(opts.field, 'change', this._onInputChange);
                if (opts.bound) {
                    removeEvent(opts.trigger, 'click', this._onInputClick);
                    removeEvent(opts.trigger, 'focus', this._onInputFocus);
                    removeEvent(opts.trigger, 'blur', this._onInputBlur);
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

/***/ 355:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AllKeywordsInput_1 = __webpack_require__(356);
var ExactKeywordsInput_1 = __webpack_require__(357);
var AnyKeywordsInput_1 = __webpack_require__(358);
var NoneKeywordsInput_1 = __webpack_require__(359);
var AnytimeDateInput_1 = __webpack_require__(360);
var InTheLastDateInput_1 = __webpack_require__(361);
var BetweenDateInput_1 = __webpack_require__(362);
var SimpleFieldInput_1 = __webpack_require__(363);
var AdvancedFieldInput_1 = __webpack_require__(364);
var SizeInput_1 = __webpack_require__(365);
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

/***/ 356:
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
var KeywordsInput_1 = __webpack_require__(124);
var Strings_1 = __webpack_require__(8);
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

/***/ 357:
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
var KeywordsInput_1 = __webpack_require__(124);
var Strings_1 = __webpack_require__(8);
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

/***/ 358:
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
var KeywordsInput_1 = __webpack_require__(124);
var Strings_1 = __webpack_require__(8);
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

/***/ 359:
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
var KeywordsInput_1 = __webpack_require__(124);
var Strings_1 = __webpack_require__(8);
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

/***/ 360:
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
var DateInput_1 = __webpack_require__(155);
var Strings_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(2);
var AdvancedSearchEvents_1 = __webpack_require__(63);
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

/***/ 361:
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
var DateInput_1 = __webpack_require__(155);
var Dom_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(8);
var Dropdown_1 = __webpack_require__(50);
var NumericSpinner_1 = __webpack_require__(80);
var DateUtils_1 = __webpack_require__(29);
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

/***/ 362:
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
var DateInput_1 = __webpack_require__(155);
var DatePicker_1 = __webpack_require__(96);
var Strings_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(2);
var DateUtils_1 = __webpack_require__(29);
var TimeSpanUtils_1 = __webpack_require__(55);
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

/***/ 363:
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
var Dropdown_1 = __webpack_require__(50);
var FacetUtils_1 = __webpack_require__(44);
var DocumentInput_1 = __webpack_require__(156);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var QueryBuilder_1 = __webpack_require__(45);
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
            });
        });
    };
    return SimpleFieldInput;
}(DocumentInput_1.DocumentInput));
exports.SimpleFieldInput = SimpleFieldInput;


/***/ }),

/***/ 364:
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
var Dropdown_1 = __webpack_require__(50);
var TextInput_1 = __webpack_require__(47);
var Dom_1 = __webpack_require__(2);
var DocumentInput_1 = __webpack_require__(156);
var QueryBuilder_1 = __webpack_require__(45);
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

/***/ 365:
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
var Dropdown_1 = __webpack_require__(50);
var NumericSpinner_1 = __webpack_require__(80);
var Dom_1 = __webpack_require__(2);
var DocumentInput_1 = __webpack_require__(156);
var QueryBuilder_1 = __webpack_require__(45);
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
    SizeInput.modes = ['AtLeast', 'AtMost'];
    SizeInput.sizes = ['KB', 'MB', 'Bytes'];
    return SizeInput;
}(DocumentInput_1.DocumentInput));
exports.SizeInput = SizeInput;


/***/ }),

/***/ 366:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='Facet.ts' />
var StringUtils_1 = __webpack_require__(18);
var QueryUtils_1 = __webpack_require__(19);
var FileTypes_1 = __webpack_require__(89);
var DateUtils_1 = __webpack_require__(29);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var Strings_1 = __webpack_require__(8);
var FacetUtils = /** @class */ (function () {
    function FacetUtils() {
    }
    FacetUtils.getRegexToUseForFacetSearch = function (value, ignoreAccent) {
        return new RegExp(StringUtils_1.StringUtils.stringToRegex(value, ignoreAccent), 'i');
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
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@month') && value != 'Search') {
            try {
                var month = parseInt(value);
                found = DateUtils_1.DateUtils.monthToString(month - 1);
            }
            catch (ex) {
                // Do nothing
            }
        }
        else {
            found = Strings_1.l(value);
        }
        return found != undefined && Utils_1.Utils.isNonEmptyString(found) ? found : value;
    };
    return FacetUtils;
}());
exports.FacetUtils = FacetUtils;


/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(8);
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
     * @param label The label to display for the dropdown.
     */
    function Dropdown(onChange, listOfValues, getDisplayValue) {
        if (onChange === void 0) { onChange = function (dropdown) { }; }
        if (getDisplayValue === void 0) { getDisplayValue = Strings_1.l; }
        this.onChange = onChange;
        this.listOfValues = listOfValues;
        this.getDisplayValue = getDisplayValue;
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

/***/ 79:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
__webpack_require__(339);
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
    function RadioButton(onChange, label, name) {
        if (onChange === void 0) { onChange = function (radioButton) { }; }
        this.onChange = onChange;
        this.label = label;
        this.name = name;
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
        var radioInput = Dom_1.$$('input', { type: 'radio', name: this.name, id: this.label });
        var labelInput = Dom_1.$$('label', { className: 'coveo-radio-input-label', for: this.label });
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

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(3);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
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
     */
    function NumericSpinner(onChange, min, max) {
        if (onChange === void 0) { onChange = function (numericSpinner) { }; }
        if (min === void 0) { min = 0; }
        this.onChange = onChange;
        this.min = min;
        this.max = max;
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
        var numberInput = Dom_1.$$('input', { className: 'coveo-number-input', type: 'text' });
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

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var DateUtils_1 = __webpack_require__(29);
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(8);
var Globalize = __webpack_require__(25);
var Pikaday = __webpack_require__(341);
/**
 * A date picker widget with standard styling.
 */
var DatePicker = /** @class */ (function () {
    /**
     * Creates a new `DatePicker`.
     * @param onChange The function to call when a new value is selected in the date picker. This function takes the
     * current `DatePicker` instance as an argument.
     */
    function DatePicker(onChange) {
        if (onChange === void 0) { onChange = function () { }; }
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
    DatePicker.doExport = function () {
        GlobalExports_1.exportGlobally({
            DatePicker: DatePicker
        });
    };
    return DatePicker;
}());
exports.DatePicker = DatePicker;


/***/ })

});
//# sourceMappingURL=AdvancedSearch__3666dadfe7be2cf1b66b.js.map