webpackJsonpCoveo__temporary([27,38],{

/***/ 118:
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
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var DateUtils_1 = __webpack_require__(32);
var Dom_1 = __webpack_require__(1);
var StringUtils_1 = __webpack_require__(22);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var FacetUtils_1 = __webpack_require__(39);
var TemplateFieldsEvaluator_1 = __webpack_require__(132);
var TemplateHelpers_1 = __webpack_require__(115);
var IFieldValueCompatibleFacet_1 = __webpack_require__(534);
var ComponentsTypes_1 = __webpack_require__(45);
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
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
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
        _this.options = ComponentOptions_1.ComponentOptions.initOptions(element, FieldValue.simpleOptions, options, FieldValue.ID);
        if (_this.options.helper != null) {
            _this.normalizeHelperAndOptions();
        }
        _this.result = _this.result || _this.resolveResult();
        Assert_1.Assert.exists(_this.result);
        if (TemplateFieldsEvaluator_1.TemplateFieldsEvaluator.evaluateFieldsToMatch(_this.options.conditions, _this.result) && _this.getValue()) {
            _this.initialize();
        }
        else if (_this.element.parentElement != null) {
            _this.element.parentElement.removeChild(_this.element);
        }
        return _this;
    }
    FieldValue.prototype.initialize = function () {
        var loadedValueFromComponent = this.getValue();
        var values;
        if (underscore_1.isArray(loadedValueFromComponent)) {
            values = loadedValueFromComponent;
        }
        else if (this.options.splitValues) {
            if (underscore_1.isString(loadedValueFromComponent)) {
                values = underscore_1.map(loadedValueFromComponent.split(this.options.separator), function (v) {
                    return v.trim();
                });
            }
        }
        else {
            loadedValueFromComponent = loadedValueFromComponent.toString();
            values = [loadedValueFromComponent];
        }
        this.appendValuesToDom(values);
        if (this.options.textCaption != null) {
            this.prependTextCaptionToDom();
        }
    };
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
        var toRender = this.getCaption(value);
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
        this.options = ComponentOptions_1.ComponentOptions.initOptions(this.element, FieldValue.helperOptions, this.options, FieldValue.ID);
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
        this.bindFacets(element, originalFacetValue, renderedFacetValue);
    };
    FieldValue.prototype.getCaption = function (value) {
        for (var _i = 0, _a = this.getFacets(); _i < _a.length; _i++) {
            var facet = _a[_i];
            var caption = facet.getCaptionForStringValue(value);
            if (caption) {
                return caption;
            }
        }
        return FacetUtils_1.FacetUtils.tryToGetTranslatedCaption(this.options.field, value);
    };
    FieldValue.prototype.getFacets = function () {
        var _this = this;
        var facets = ComponentsTypes_1.ComponentsTypes.getAllFacetsFromSearchInterface(this.searchInterface)
            .filter(IFieldValueCompatibleFacet_1.isFacetFieldValueCompatible)
            .filter(function (facet) { return !facet.disabled; });
        var facetsWithMatchingId = facets.filter(function (facet) { return facet.options.id === _this.options.facet; });
        if (facetsWithMatchingId.length) {
            return facetsWithMatchingId;
        }
        return facets.filter(function (facet) { return facet.options.field === _this.options.field; });
    };
    FieldValue.prototype.bindFacets = function (element, originalFacetValue, renderedFacetValue) {
        var _this = this;
        var facets = this.getFacets();
        if (!facets.length) {
            return;
        }
        var isValueSelected = !!underscore_1.find(facets, function (facet) { return facet.hasSelectedValue(originalFacetValue); });
        var selectAction = function () { return _this.handleFacetSelection(isValueSelected, facets, originalFacetValue); };
        this.buildClickableElement(element, isValueSelected, renderedFacetValue, selectAction);
    };
    FieldValue.prototype.buildClickableElement = function (element, isSelected, value, selectAction) {
        var label = isSelected ? Strings_1.l('RemoveFilterOn', value) : Strings_1.l('FilterOn', value);
        new AccessibleButton_1.AccessibleButton().withTitle(label).withElement(element).withSelectAction(selectAction).build();
        if (isSelected) {
            Dom_1.$$(element).addClass('coveo-selected');
        }
        Dom_1.$$(element).addClass('coveo-clickable');
    };
    FieldValue.prototype.handleFacetSelection = function (isValueSelected, facets, value) {
        facets.forEach(function (facet) {
            isValueSelected ? facet.deselectValue(value) : facet.selectValue(value);
        });
        this.executeQuery(value);
    };
    FieldValue.prototype.executeQuery = function (value) {
        var _this = this;
        this.queryController.deferExecuteQuery({
            beforeExecuteQuery: function () {
                return _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentField, {
                    facetId: _this.options.facet,
                    facetField: _this.options.field.toString(),
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
                format: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['number'])),
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
                srcTemplate: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
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
         *
         * @availablesince [January 2017 Release (v1.1865.9)](https://docs.coveo.com/en/396/#january-2017-release-v118659)
         */
        textCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption(),
        /**
         * A field-based condition that must be satisfied by the query result item for the component to be rendered.
         *
         * Note: This option uses a distinctive markup configuration syntax allowing multiple conditions to be expressed. Its underlying logic is the same as that of the field value conditions mechanism used by result templates.
         *
         * **Examples:**
         * Render the component if the query result item's @documenttype field value is Article or Documentation.
         * ```html
         * <div class="CoveoFieldValue" data-field="@author" data-condition-field-documenttype="Article, Documentation"></div>
         * ```
         * Render the component if the query result item's @documenttype field value is anything but Case.
         * ```html
         * <div class="CoveoFieldValue" data-field="@author" data-condition-field-not-documenttype="Case"></div>
         * ```
         * Render the component if the query result item's @documenttype field value is Article, and if its @author field value is anything but Anonymous.
         * ```html
         * <div class="CoveoFieldValue" data-field="@author" data-condition-field-documenttype="Article" data-condition-field-not-author="Anonymous"></div>
         * ```
         * Default value is `undefined`.
         */
        conditions: ComponentOptions_1.ComponentOptions.buildFieldConditionOption()
    };
    FieldValue.simpleOptions = underscore_1.omit(FieldValue.options, 'helperOptions');
    FieldValue.helperOptions = {
        helperOptions: FieldValue.options.helperOptions
    };
    return FieldValue;
}(Component_1.Component));
exports.FieldValue = FieldValue;
Initialization_1.Initialization.registerAutoCreateComponent(FieldValue);


/***/ }),

/***/ 253:
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
__webpack_require__(614);
var underscore_1 = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var Dom_1 = __webpack_require__(1);
var QueryUtils_1 = __webpack_require__(21);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var FieldValue_1 = __webpack_require__(118);
/**
 * The FieldTable component displays a set of {@link FieldValue} components in a table that can optionally be
 * expandable and minimizable. This component automatically takes care of not displaying empty field values.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 *
 * **Example:**
 *
 * ```
 * // This is the FieldTable component itself, which holds a list of table rows.
 * // Each row is a FieldValue component.
 * <table class='CoveoFieldTable'>
 *    // Items
 *    <tr data-field='@sysdate' data-caption='Date' data-helper='dateTime' />
 *    <tr data-field='@sysauthor' data-caption='Author' />
 *    <tr data-field='@clickuri' data-html-value='true' data-caption='URL' data-helper='anchor' data-helper-options='{text: \"<%= raw.syssource %>\" , target:\"_blank\"}'>
 * </table>
 * ```
 */
var FieldTable = /** @class */ (function (_super) {
    __extends(FieldTable, _super);
    /**
     * Creates a new FieldTable.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the FieldTable component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function FieldTable(element, options, bindings, result) {
        var _this = _super.call(this, element, ValueRow.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, FieldTable, options);
        var rows = Dom_1.$$(_this.element).findAll('tr[data-field]');
        underscore_1.each(rows, function (e) {
            new ValueRow(e, {}, bindings, result);
        });
        if (Dom_1.$$(_this.element).find('tr') == null) {
            Dom_1.$$(element).detach();
        }
        if (_this.isTogglable()) {
            var className = 'coveo-field-table-toggle-container';
            _this.toggleContainer = Dom_1.$$('div', { className: className, id: underscore_1.uniqueId(className) }).el;
            _this.buildToggle();
            Dom_1.$$(_this.toggleContainer).insertBefore(_this.element);
            _this.toggleContainer.appendChild(_this.element);
            _this.toggleContainer.appendChild(_this.toggleButtonInsideTable);
        }
        return _this;
    }
    Object.defineProperty(FieldTable.prototype, "isExpanded", {
        get: function () {
            return !this.toggleButton || this.toggleButton.getAttribute('aria-expanded') === 'true';
        },
        set: function (expanded) {
            if (this.toggleButton) {
                this.toggleButton.setAttribute('aria-expanded', expanded.toString());
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Toggles between expanding (showing) and minimizing (collapsing) the FieldTable.
     *
     * @param anim Specifies whether to show a sliding animation when toggling the display of the FieldTable.
     */
    FieldTable.prototype.toggle = function (anim) {
        if (anim === void 0) { anim = false; }
        this.isExpanded ? this.minimize(anim) : this.expand(anim);
    };
    /**
     * Expands (shows) the FieldTable,
     * @param anim Specifies whether to show a sliding animation when expanding the FieldTable.
     */
    FieldTable.prototype.expand = function (anim) {
        if (anim === void 0) { anim = false; }
        if (this.isTogglable()) {
            this.isExpanded = true;
            this.toggleCaption.textContent = this.options.expandedTitle;
            SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonSVGContainer, 'coveo-opened');
            SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonInsideTable, 'coveo-opened');
            anim ? this.slideToggle(true) : this.slideToggle(true, false);
        }
    };
    /**
     * Minimizes (collapses) the FieldTable.
     * @param anim Specifies whether to show a sliding animation when minimizing the FieldTable.
     */
    FieldTable.prototype.minimize = function (anim) {
        if (anim === void 0) { anim = false; }
        if (this.isTogglable()) {
            this.isExpanded = false;
            this.toggleCaption.textContent = this.options.minimizedTitle;
            SVGDom_1.SVGDom.removeClassFromSVGInContainer(this.toggleButtonSVGContainer, 'coveo-opened');
            SVGDom_1.SVGDom.removeClassFromSVGInContainer(this.toggleButtonInsideTable, 'coveo-opened');
            anim ? this.slideToggle(false) : this.slideToggle(false, false);
        }
    };
    /**
     * Updates the toggle height if the content was dynamically resized, so that the expanding and minimizing animation
     * can match the new content size.
     */
    FieldTable.prototype.updateToggleHeight = function () {
        this.updateToggleContainerHeight();
        this.isExpanded ? this.expand() : this.minimize();
    };
    FieldTable.prototype.isTogglable = function () {
        if (this.options.allowMinimization) {
            return true;
        }
        return false;
    };
    FieldTable.prototype.buildToggle = function () {
        var _this = this;
        this.toggleCaption = Dom_1.$$('span', {
            className: 'coveo-field-table-toggle-caption'
        }).el;
        this.toggleButton = Dom_1.$$('div', {
            className: 'coveo-field-table-toggle coveo-field-table-toggle-down',
            ariaControls: this.toggleContainer.id
        }).el;
        this.toggleButtonSVGContainer = Dom_1.$$('span', null, SVGIcons_1.SVGIcons.icons.arrowDown).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonSVGContainer, 'coveo-field-table-toggle-down-svg');
        this.toggleButton.appendChild(this.toggleCaption);
        this.toggleButton.appendChild(this.toggleButtonSVGContainer);
        Dom_1.$$(this.toggleButton).insertBefore(this.element);
        this.toggleButtonInsideTable = Dom_1.$$('span', { className: 'coveo-field-table-toggle coveo-field-table-toggle-up' }, SVGIcons_1.SVGIcons.icons.arrowUp).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonInsideTable, 'coveo-field-table-toggle-up-svg');
        if (this.options.minimizedByDefault === true) {
            this.isExpanded = false;
        }
        else if (this.options.minimizedByDefault === false) {
            this.isExpanded = true;
        }
        else {
            this.isExpanded = !QueryUtils_1.QueryUtils.hasExcerpt(this.result);
        }
        requestAnimationFrame(function () { return _this.updateToggleHeight(); });
        var toggleAction = function () { return _this.toggle(true); };
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.toggleButton)
            .withSelectAction(function () { return toggleAction(); })
            .withOwner(this.bind)
            .withLabel(Strings_1.l('Details'))
            .build();
        Dom_1.$$(this.toggleButtonInsideTable).on('click', toggleAction);
    };
    FieldTable.prototype.slideToggle = function (visible, anim) {
        if (visible === void 0) { visible = true; }
        if (anim === void 0) { anim = true; }
        if (!anim) {
            Dom_1.$$(this.toggleContainer).addClass('coveo-no-transition');
        }
        if (visible) {
            this.toggleContainer.style.display = 'block';
            this.toggleContainer.style.height = this.containerHeight;
        }
        else {
            this.toggleContainer.style.height = '0';
        }
        if (!anim) {
            this.toggleContainer.offsetHeight; // Force reflow
            Dom_1.$$(this.toggleContainer).removeClass('coveo-no-transition');
        }
    };
    Object.defineProperty(FieldTable.prototype, "containerHeight", {
        get: function () {
            if (!this.toggleContainerHeight) {
                this.updateToggleContainerHeight();
            }
            return this.toggleContainerHeight + 'px';
        },
        enumerable: true,
        configurable: true
    });
    FieldTable.prototype.updateToggleContainerHeight = function () {
        this.toggleContainerHeight = this.toggleContainer.scrollHeight;
    };
    FieldTable.ID = 'FieldTable';
    FieldTable.doExport = function () {
        GlobalExports_1.exportGlobally({
            FieldTable: FieldTable,
            FieldValue: FieldValue_1.FieldValue
        });
    };
    /**
     * The options for the component
     * @componentOptions
     */
    FieldTable.options = {
        /**
         * Specifies whether to allow the minimization (collapsing) of the FieldTable.
         *
         * If you set this option to `false`, the component will not create the **Minimize** / **Expand** toggle links.
         *
         * See also {@link FieldTable.options.expandedTitle}, {@link FieldTable.options.minimizedTitle} and
         * {@link FieldTable.options.minimizedByDefault}.
         *
         * Default value is `true`.
         */
        allowMinimization: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * If {@link FieldTable.options.allowMinimization} is `true`, specifies the caption to show on the **Minimize** link
         * (the link that appears when the FieldTable is expanded).
         *
         * Default value is `"Details"`.
         */
        expandedTitle: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            localizedString: function () { return Strings_1.l('Details'); },
            depend: 'allowMinimization'
        }),
        /**
         * If {@link FieldTable.options.allowMinimization} is `true`, specifies the caption to show on the **Expand** link
         * (the link that appears when the FieldTable is minimized).
         *
         * Default value is `"Details"`.
         */
        minimizedTitle: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({
            localizedString: function () { return Strings_1.l('Details'); },
            depend: 'allowMinimization'
        }),
        /**
         * If {@link FieldTable.options.allowMinimization} is `true`, specifies whether to minimize the table by default.
         *
         * Default value is `undefined`, and the FieldTable will collapse by default if the result it is associated with has
         * a non-empty excerpt.
         */
        minimizedByDefault: ComponentOptions_1.ComponentOptions.buildBooleanOption({ depend: 'allowMinimization' })
    };
    return FieldTable;
}(Component_1.Component));
exports.FieldTable = FieldTable;
Initialization_1.Initialization.registerAutoCreateComponent(FieldTable);
var ValueRow = /** @class */ (function (_super) {
    __extends(ValueRow, _super);
    function ValueRow(element, options, bindings, result) {
        var _this = _super.call(this, element, options, bindings, result, ValueRow.ID) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ValueRow, options);
        var caption = Dom_1.$$('th').el;
        caption.appendChild(document.createTextNode(_this.options.caption.toLocaleString()));
        _this.element.insertBefore(caption, _this.getValueContainer());
        return _this;
    }
    ValueRow.prototype.getValueContainer = function () {
        if (this.valueContainer == null) {
            this.valueContainer = document.createElement('td');
            this.element.appendChild(this.valueContainer);
        }
        return this.valueContainer;
    };
    ValueRow.ID = 'ValueRow';
    ValueRow.options = {
        caption: ComponentOptions_1.ComponentOptions.buildStringOption({
            postProcessing: function (value, options) { return value || options.field.substr(1); }
        })
    };
    ValueRow.parent = FieldValue_1.FieldValue;
    return ValueRow;
}(FieldValue_1.FieldValue));


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

/***/ 534:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isFacetFieldValueCompatible(facet) {
    return !!facet['isFieldValueCompatible'];
}
exports.isFacetFieldValueCompatible = isFacetFieldValueCompatible;


/***/ }),

/***/ 614:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=FieldTable__ec82d15c0e890cb8a4e5.js.map