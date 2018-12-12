webpackJsonpCoveo__temporary([38],{

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(11);
var KeyboardUtils_1 = __webpack_require__(29);
var Dom_1 = __webpack_require__(1);
__webpack_require__(367);
var AccessibleButton = /** @class */ (function () {
    function AccessibleButton() {
        this.logger = new Logger_1.Logger(this);
    }
    AccessibleButton.prototype.withOwner = function (owner) {
        this.eventOwner = owner;
        return this;
    };
    AccessibleButton.prototype.withElement = function (element) {
        if (element instanceof HTMLElement) {
            this.element = Dom_1.$$(element);
        }
        else {
            this.element = element;
        }
        return this;
    };
    AccessibleButton.prototype.withLabel = function (label) {
        this.label = label;
        return this;
    };
    AccessibleButton.prototype.withTitle = function (title) {
        this.title = title;
        return this;
    };
    AccessibleButton.prototype.withSelectAction = function (action) {
        this.clickAction = action;
        this.enterKeyboardAction = action;
        return this;
    };
    AccessibleButton.prototype.withClickAction = function (clickAction) {
        this.clickAction = clickAction;
        return this;
    };
    AccessibleButton.prototype.withEnterKeyboardAction = function (enterAction) {
        this.enterKeyboardAction = enterAction;
        return this;
    };
    AccessibleButton.prototype.withFocusAndMouseEnterAction = function (action) {
        this.focusAction = action;
        this.mouseenterAction = action;
        return this;
    };
    AccessibleButton.prototype.withFocusAction = function (action) {
        this.focusAction = action;
        return this;
    };
    AccessibleButton.prototype.withMouseEnterAction = function (action) {
        this.mouseenterAction = action;
        return this;
    };
    AccessibleButton.prototype.withBlurAndMouseLeaveAction = function (action) {
        this.mouseleaveAction = action;
        this.blurAction = action;
        return this;
    };
    AccessibleButton.prototype.withMouseLeaveAction = function (action) {
        this.mouseleaveAction = action;
        return this;
    };
    AccessibleButton.prototype.withBlurAction = function (action) {
        this.blurAction = action;
        return this;
    };
    AccessibleButton.prototype.build = function () {
        if (!this.element) {
            this.element = Dom_1.$$('div');
        }
        this.ensureCorrectRole();
        this.ensureCorrectLabel();
        this.ensureTitle();
        this.ensureSelectAction();
        this.ensureUnselectAction();
        this.ensureMouseenterAndFocusAction();
        this.ensureMouseleaveAndBlurAction();
        this.ensureDifferentiationBetweenKeyboardAndMouseFocus();
        return this;
    };
    AccessibleButton.prototype.ensureDifferentiationBetweenKeyboardAndMouseFocus = function () {
        var _this = this;
        var classOnPress = 'coveo-accessible-button-pressed';
        var classOnFocus = 'coveo-accessible-button-focused';
        Dom_1.$$(this.element).addClass('coveo-accessible-button');
        Dom_1.$$(this.element).on('mousedown', function () {
            Dom_1.$$(_this.element).addClass(classOnPress);
            Dom_1.$$(_this.element).removeClass(classOnFocus);
        });
        Dom_1.$$(this.element).on('mouseup', function () { return Dom_1.$$(_this.element).removeClass(classOnPress); });
        Dom_1.$$(this.element).on('focus', function () {
            if (!Dom_1.$$(_this.element).hasClass(classOnPress)) {
                Dom_1.$$(_this.element).addClass(classOnFocus);
            }
        });
        Dom_1.$$(this.element).on('blur', function () { return Dom_1.$$(_this.element).removeClass(classOnFocus); });
    };
    AccessibleButton.prototype.ensureCorrectRole = function () {
        if (!this.element.getAttribute('role')) {
            this.element.setAttribute('role', 'button');
        }
    };
    AccessibleButton.prototype.ensureCorrectLabel = function () {
        if (!this.label) {
            this.logger.error("Missing label to create an accessible button !");
            return;
        }
        this.element.setAttribute('aria-label', this.label);
    };
    AccessibleButton.prototype.ensureTitle = function () {
        this.title && this.element.setAttribute('title', this.title);
    };
    AccessibleButton.prototype.ensureTabIndex = function () {
        this.element.setAttribute('tabindex', '0');
    };
    AccessibleButton.prototype.ensureSelectAction = function () {
        var _this = this;
        if (this.enterKeyboardAction) {
            this.ensureTabIndex();
            this.bindEvent('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function (e) { return _this.enterKeyboardAction(e); }));
        }
        if (this.clickAction) {
            this.bindEvent('click', this.clickAction);
        }
    };
    AccessibleButton.prototype.ensureUnselectAction = function () {
        if (this.blurAction) {
            this.bindEvent('blur', this.blurAction);
        }
        if (this.mouseleaveAction) {
            this.bindEvent('mouseleave', this.mouseleaveAction);
        }
    };
    AccessibleButton.prototype.ensureMouseenterAndFocusAction = function () {
        if (this.mouseenterAction) {
            this.bindEvent('mouseenter', this.mouseenterAction);
        }
        if (this.focusAction) {
            this.bindEvent('focus', this.focusAction);
        }
    };
    AccessibleButton.prototype.ensureMouseleaveAndBlurAction = function () {
        if (this.mouseleaveAction) {
            this.bindEvent('mouseleave', this.mouseleaveAction);
        }
        if (this.blurAction) {
            this.bindEvent('blur', this.blurAction);
        }
    };
    AccessibleButton.prototype.bindEvent = function (event, action) {
        if (this.eventOwner) {
            this.eventOwner.on(this.element, event, action);
        }
        else {
            Dom_1.$$(this.element).on(event, action);
        }
    };
    return AccessibleButton;
}());
exports.AccessibleButton = AccessibleButton;


/***/ }),

/***/ 367:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='Facet.ts' />
var StringUtils_1 = __webpack_require__(19);
var QueryUtils_1 = __webpack_require__(20);
var FileTypes_1 = __webpack_require__(94);
var DateUtils_1 = __webpack_require__(30);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var Strings_1 = __webpack_require__(7);
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

/***/ 97:
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
var underscore_1 = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var QueryStateModel_1 = __webpack_require__(12);
var AccessibleButton_1 = __webpack_require__(17);
var DateUtils_1 = __webpack_require__(30);
var Dom_1 = __webpack_require__(1);
var StringUtils_1 = __webpack_require__(19);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var FacetUtils_1 = __webpack_require__(47);
var TemplateHelpers_1 = __webpack_require__(82);
var Strings_1 = __webpack_require__(7);
function showOnlyWithHelper(helpers, options) {
    if (options == null) {
        options = {};
    }
    options.helpers = helpers;
    return options;
}
/**
 * The FieldValue component displays the value of a field associated to its parent search result. It is normally usable
 * within a {@link FieldTable}.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * A common use of this component is to display a specific field value which also happens to be an existing
 * {@link Facet.options.field}. When the user clicks on the FieldValue component, it activates the corresponding Facet.
 */
var FieldValue = /** @class */ (function (_super) {
    __extends(FieldValue, _super);
    /**
     * Creates a new FieldValue.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the FieldValue component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function FieldValue(element, options, bindings, result, fieldValueClassId) {
        if (fieldValueClassId === void 0) { fieldValueClassId = FieldValue.ID; }
        var _this = _super.call(this, element, fieldValueClassId, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initOptions(element, FieldValue.simpleOptions, options);
        if (_this.options.helper != null) {
            _this.normalizeHelperAndOptions();
        }
        _this.result = _this.result || _this.resolveResult();
        Assert_1.Assert.exists(_this.result);
        var loadedValueFromComponent = _this.getValue();
        if (loadedValueFromComponent == null) {
            // Completely remove the element to ease stuff such as adding separators in CSS
            if (_this.element.parentElement != null) {
                _this.element.parentElement.removeChild(_this.element);
            }
        }
        else {
            var values = void 0;
            if (underscore_1.isArray(loadedValueFromComponent)) {
                values = loadedValueFromComponent;
            }
            else if (_this.options.splitValues) {
                if (underscore_1.isString(loadedValueFromComponent)) {
                    values = underscore_1.map(loadedValueFromComponent.split(_this.options.separator), function (v) {
                        return v.trim();
                    });
                }
            }
            else {
                loadedValueFromComponent = loadedValueFromComponent.toString();
                values = [loadedValueFromComponent];
            }
            _this.appendValuesToDom(values);
            if (_this.options.textCaption != null) {
                _this.prependTextCaptionToDom();
            }
        }
        return _this;
    }
    /**
     * Gets the current FieldValue from the current {@link IQueryResult}.
     *
     * @returns {any} The current FieldValue or `null` if value is and `Object`.
     */
    FieldValue.prototype.getValue = function () {
        var value = Utils_1.Utils.getFieldValue(this.result, this.options.field);
        if (!underscore_1.isArray(value) && underscore_1.isObject(value)) {
            value = null;
        }
        return value;
    };
    /**
     * Renders a value to HTML using all of the current FieldValue component options.
     * @param value The value to render.
     * @returns {HTMLElement} The element containing the rendered value.
     */
    FieldValue.prototype.renderOneValue = function (value) {
        var element = Dom_1.$$('span').el;
        var toRender = FacetUtils_1.FacetUtils.tryToGetTranslatedCaption(this.options.field, value);
        if (this.options.helper) {
            // Try to resolve and execute version 2 of each helper function if available
            var helper = TemplateHelpers_1.TemplateHelpers.getHelper(this.options.helper + "v2") || TemplateHelpers_1.TemplateHelpers.getHelper("" + this.options.helper);
            if (Utils_1.Utils.exists(helper)) {
                toRender = helper.call(this, value, this.getHelperOptions());
            }
            else {
                this.logger.warn("Helper " + this.options.helper + " is not found in available helpers. The list of supported helpers is :", underscore_1.keys(TemplateHelpers_1.TemplateHelpers.getHelpers()));
            }
            var fullDateStr = this.getFullDate(value, this.options.helper);
            if (fullDateStr) {
                element.setAttribute('title', fullDateStr);
            }
            if (this.options.helper == 'date' || this.options.helper == 'dateTime' || this.options.helper == 'emailDateTime') {
                toRender = StringUtils_1.StringUtils.capitalizeFirstLetter(toRender);
            }
        }
        if (this.options.htmlValue) {
            element.innerHTML = toRender;
        }
        else {
            element.appendChild(document.createTextNode(toRender));
        }
        this.bindEventOnValue(element, value, toRender);
        return element;
    };
    FieldValue.prototype.getValueContainer = function () {
        return this.element;
    };
    FieldValue.prototype.normalizeHelperAndOptions = function () {
        var _this = this;
        this.options = ComponentOptions_1.ComponentOptions.initOptions(this.element, FieldValue.helperOptions, this.options);
        var toFilter = underscore_1.keys(FieldValue.options.helperOptions['subOptions']);
        var toKeep = underscore_1.filter(toFilter, function (optionKey) {
            var optionDefinition = FieldValue.options.helperOptions['subOptions'][optionKey];
            if (optionDefinition) {
                var helpers = optionDefinition.helpers;
                return helpers != null && underscore_1.contains(helpers, _this.options.helper);
            }
            return false;
        });
        this.options.helperOptions = underscore_1.omit(this.options.helperOptions, function (value, key) {
            return !underscore_1.contains(toKeep, key);
        });
    };
    FieldValue.prototype.getHelperOptions = function () {
        var inlineOptions = ComponentOptions_1.ComponentOptions.loadStringOption(this.element, 'helperOptions', {});
        if (Utils_1.Utils.isNonEmptyString(inlineOptions)) {
            return underscore_1.extend({}, this.options.helperOptions, eval('(' + inlineOptions + ')'));
        }
        return this.options.helperOptions;
    };
    FieldValue.prototype.getFullDate = function (date, helper) {
        var fullDateOptions = {
            useLongDateFormat: true,
            useTodayYesterdayAndTomorrow: false,
            useWeekdayIfThisWeek: false,
            omitYearIfCurrentOne: false
        };
        if (helper == 'date') {
            return DateUtils_1.DateUtils.dateToString(new Date(parseInt(date)), fullDateOptions);
        }
        else if (helper == 'dateTime' || helper == 'emailDateTime') {
            return DateUtils_1.DateUtils.dateTimeToString(new Date(parseInt(date)), fullDateOptions);
        }
        return '';
    };
    FieldValue.prototype.appendValuesToDom = function (values) {
        var _this = this;
        underscore_1.each(values, function (value, index) {
            if (value != undefined) {
                _this.getValueContainer().appendChild(_this.renderOneValue(value));
                if (index !== values.length - 1) {
                    _this.getValueContainer().appendChild(document.createTextNode(_this.options.displaySeparator));
                }
            }
        });
    };
    FieldValue.prototype.renderTextCaption = function () {
        var element = Dom_1.$$('span', { className: 'coveo-field-caption' }, underscore_1.escape(this.options.textCaption));
        return element.el;
    };
    FieldValue.prototype.prependTextCaptionToDom = function () {
        var elem = this.getValueContainer();
        Dom_1.$$(elem).prepend(this.renderTextCaption());
        // Add a class to the container so the value and the caption wrap together.
        Dom_1.$$(elem).addClass('coveo-with-label');
    };
    FieldValue.prototype.bindEventOnValue = function (element, originalFacetValue, renderedFacetValue) {
        var _this = this;
        var facetAttributeName = QueryStateModel_1.QueryStateModel.getFacetId(this.options.facet);
        var facets = underscore_1.filter(this.componentStateModel.get(facetAttributeName), function (possibleFacetComponent) {
            // Here, we need to check if a potential facet component (as returned by the component state model) is a "standard" facet.
            // It's also possible that the FacetRange and FacetSlider constructor are not available (lazy loading mode)
            // For that reason we also need to check that the constructor event exist before calling the instanceof operator or an exception would explode (cannot use instanceof "undefined")
            var componentIsAStandardFacet = true;
            var facetRangeConstructorExists = Component_1.Component.getComponentRef('FacetRange');
            var facetSliderConstructorExists = Component_1.Component.getComponentRef('FacetSlider');
            if (possibleFacetComponent.disabled) {
                return false;
            }
            if (componentIsAStandardFacet && facetRangeConstructorExists) {
                componentIsAStandardFacet = !(possibleFacetComponent instanceof facetRangeConstructorExists);
            }
            if (componentIsAStandardFacet && facetSliderConstructorExists) {
                componentIsAStandardFacet = !(possibleFacetComponent instanceof facetSliderConstructorExists);
            }
            return componentIsAStandardFacet;
        });
        var atLeastOneFacetIsEnabled = facets.length > 0;
        if (atLeastOneFacetIsEnabled) {
            var selected_1 = underscore_1.find(facets, function (facet) {
                var facetValue = facet.values.get(originalFacetValue);
                return facetValue && facetValue.selected;
            });
            var label = selected_1 ? Strings_1.l('RemoveFilterOn', renderedFacetValue) : Strings_1.l('FilterOn', renderedFacetValue);
            new AccessibleButton_1.AccessibleButton()
                .withTitle(label)
                .withLabel(label)
                .withElement(element)
                .withSelectAction(function () { return _this.handleSelection(selected_1, facets, originalFacetValue); })
                .build();
            if (selected_1) {
                Dom_1.$$(element).addClass('coveo-selected');
            }
            Dom_1.$$(element).addClass('coveo-clickable');
        }
    };
    FieldValue.prototype.handleSelection = function (selected, facets, value) {
        var _this = this;
        if (selected != null) {
            underscore_1.each(facets, function (facet) { return facet.deselectValue(value); });
        }
        else {
            underscore_1.each(facets, function (facet) { return facet.selectValue(value); });
        }
        this.queryController.deferExecuteQuery({
            beforeExecuteQuery: function () {
                return _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentField, {
                    facetId: _this.options.facet,
                    facetValue: value.toLowerCase()
                });
            }
        });
    };
    FieldValue.ID = 'FieldValue';
    FieldValue.doExport = function () {
        GlobalExports_1.exportGlobally({
            FieldValue: FieldValue
        });
    };
    /**
     * The options for the component
     * @componentOptions
     */
    FieldValue.options = {
        /**
         * Specifies the field that the FieldValue should display.
         *
         * Specifying a value for this parameter is required in order for the FieldValue component to work.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ defaultValue: '@field', required: true }),
        /**
         * Specifies the {@link Facet} component to toggle when the end user clicks the FieldValue.
         *
         * Default value is the value of {@link FieldValue.options.field}.
         *
         * **Note:**
         * > If the target {@link Facet.options.id} is is not the same as its {@link Facet.options.field}), you must specify
         * > this option manually in order to link to the correct Facet.
         */
        facet: ComponentOptions_1.ComponentOptions.buildStringOption({ postProcessing: function (value, options) { return value || options.field; } }),
        /**
         * Specifies whether the content to display is an HTML element.
         *
         * Default value is `false`.
         */
        htmlValue: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies whether to split the FieldValue at each {@link FieldValue.options.separator}.
         *
         * This is useful for splitting groups using a {@link Facet.options.field}.
         *
         * When this option is `true`, the displayed values are split by the {@link FieldValue.options.displaySeparator}.
         *
         * Default value is `false`.
         */
        splitValues: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * If {@link FieldValue.options.splitValues} is `true`, specifies the separator string which separates multi-value
         * fields in the index.
         *
         * See {@link FieldValue.options.displaySeparator}.
         *
         * Default value is `";"`.
         */
        separator: ComponentOptions_1.ComponentOptions.buildStringOption({ depend: 'splitValues', defaultValue: ';' }),
        /**
         * If {@link FieldValue.options.splitValues} is `true`, specifies the string to use when displaying multi-value
         * fields in the UI.
         *
         * The component will insert this string between each value it displays from a multi-value field.
         *
         * See also {@link FieldValue.options.separator}.
         *
         * Default value is `", "`.
         */
        displaySeparator: ComponentOptions_1.ComponentOptions.buildStringOption({ depend: 'splitValues', defaultValue: ', ' }),
        /**
         * Specifies the helper that the FieldValue should use to display its content.
         *
         * While several helpers exist by default (see {@link ICoreHelpers}), it is also possible for you to create your own
         * custom helpers (see {@link TemplateHelpers}).
         */
        helper: ComponentOptions_1.ComponentOptions.buildHelperOption(),
        /**
         * Specifies the options to call on the specified helper.
         */
        helperOptions: ComponentOptions_1.ComponentOptions.buildObjectOption({
            subOptions: {
                text: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
                target: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
                class: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
                decimals: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['currency'], { min: 0 })),
                symbol: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['currency'])),
                useTodayYesterdayAndTomorrow: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
                useWeekdayIfThisWeek: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
                omitYearIfCurrentOne: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
                useLongDateFormat: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: false })),
                includeTimeIfToday: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
                includeTimeIfThisWeek: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
                alwaysIncludeTime: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: false })),
                predefinedFormat: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'])),
                companyDomain: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['email'])),
                me: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['email'])),
                lengthLimit: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['email'], { min: 1 })),
                truncateName: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['email'])),
                alt: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
                height: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
                width: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
                precision: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 2 })),
                base: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 0 })),
                isMilliseconds: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['timeSpan'])),
                length: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['shorten', 'shortenPath', 'shortenUri'], { defaultValue: 200 }))
            }
        }),
        /**
         * Specifies a caption to display before the value.
         *
         * Default value is `undefined`.
         */
        textCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption()
    };
    FieldValue.simpleOptions = underscore_1.omit(FieldValue.options, 'helperOptions');
    FieldValue.helperOptions = {
        helperOptions: FieldValue.options.helperOptions
    };
    return FieldValue;
}(Component_1.Component));
exports.FieldValue = FieldValue;
Initialization_1.Initialization.registerAutoCreateComponent(FieldValue);


/***/ })

});
//# sourceMappingURL=FieldValue__f056675ccb969b1e6859.js.map