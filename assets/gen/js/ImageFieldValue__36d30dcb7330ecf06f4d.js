webpackJsonpCoveo__temporary([29,38],{

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

/***/ 193:
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
var Core_1 = __webpack_require__(20);
var GlobalExports_1 = __webpack_require__(3);
var ComponentOptions_1 = __webpack_require__(8);
var FieldValue_1 = __webpack_require__(118);
/**
 * This component renders an image from a URL retrieved in a given [`field`]{@link ImageFieldValue.options.field}.
 *
 * A typical use case of this component is to display product images in the context of commerce.
 *
 * @isresulttemplatecomponent
 * @availablesince [September 2019 Release (v2.7023)](https://docs.coveo.com/en/2990/)
 */
var ImageFieldValue = /** @class */ (function (_super) {
    __extends(ImageFieldValue, _super);
    /**
     * Creates a new ImageFieldValue.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the ImageFieldValue component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function ImageFieldValue(element, options, bindings, result) {
        var _this = _super.call(this, element, ImageFieldValue.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ImageFieldValue, options);
        var fieldValueOption = {
            field: _this.options.field,
            helper: 'image',
            htmlValue: true,
            helperOptions: {
                height: _this.options.height,
                width: _this.options.width,
                alt: result.title,
                srcTemplate: _this.options.srcTemplate
            }
        };
        new FieldValue_1.FieldValue(element, fieldValueOption, bindings, result);
        return _this;
    }
    ImageFieldValue.ID = 'ImageFieldValue';
    ImageFieldValue.doExport = function () {
        GlobalExports_1.exportGlobally({
            ImageFieldValue: ImageFieldValue
        });
    };
    /**
     * The options for the component
     * @componentOptions
     */
    ImageFieldValue.options = {
        /**
         * **Required**. The name of a field whose value is the URL of the image to display.
         *
         * **Note:** The component uses the value of this field to set the `src` attribute of the [`img`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) HTML tag it generates.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
        /**
         * The width of the image (in pixels).
         *
         * **Note:** The component uses this value to set the `width` attribute of the [`img`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) HTML tag it generates.
         */
        width: ComponentOptions_1.ComponentOptions.buildNumberOption(),
        /**
         * The height of the image (in pixels).
         *
         * **Note:** The component uses this value to set the `height` attribute of the [`img`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) HTML tag it generates.
         */
        height: ComponentOptions_1.ComponentOptions.buildNumberOption(),
        /**
         * A [template literal](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)
         * from which to generate the `img` tag's `src` attribute value.
         *
         * This option overrides the [`field`]{@link ImageFieldValue.options.field} option value.
         *
         * The template literal can reference any number of fields from the parent result. It can also reference global
         * scope properties.
         *
         * **Examples:**
         *
         * - The following markup generates an `src` value such as `http://uri.com?id=itemTitle`:
         *
         * ```html
         * <a class='CoveoImageFieldValue' data-src-template='${clickUri}?id=${raw.title}'></a>
         * ```
         *
         * - The following markup generates an `src` value such as `localhost/fooBar`:
         *
         * ```html
         * <a class='CoveoImageFieldValue' data-src-template='${window.location.hostname}/{Foo.Bar}'></a>
         * ```
         *
         * Default value is `undefined`.
         */
        srcTemplate: ComponentOptions_1.ComponentOptions.buildStringOption()
    };
    return ImageFieldValue;
}(Core_1.Component));
exports.ImageFieldValue = ImageFieldValue;
Core_1.Initialization.registerAutoCreateComponent(ImageFieldValue);


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


/***/ })

});
//# sourceMappingURL=ImageFieldValue__36d30dcb7330ecf06f4d.js.map