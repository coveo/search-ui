webpackJsonpCoveo__temporary([45,67],{

/***/ 287:
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
var ComponentOptions_1 = __webpack_require__(9);
var Initialization_1 = __webpack_require__(2);
var FieldValue_1 = __webpack_require__(98);
var StringUtils_1 = __webpack_require__(20);
var Assert_1 = __webpack_require__(7);
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
/**
 * The Badge component outputs a field value with customizable colors and an icon preceding it.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)). It
 * extends the {@link FieldValue} component. Therefore all FieldValue options are also available for a Badge component.
 */
var Badge = (function (_super) {
    __extends(Badge, _super);
    /**
     * Creates a new Badge component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Badge component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function Badge(element, options, bindings, result) {
        var _this = _super.call(this, element, ComponentOptions_1.ComponentOptions.initComponentOptions(element, Badge, options), bindings, result, Badge.ID) || this;
        _this.options = options;
        if (_.isString(_this.options.colors)) {
            // to support the old string options
            _this.options.colors = Badge.parseColors(_this.options.colors);
        }
        if (_this.options.colors.values == null) {
            _this.options.colors.values = {};
        }
        return _this;
    }
    /**
     * Parses a {@link Badge.options.colors} option string into a workable JSON format.
     *
     * @param colorsOption The colors option string to parse. See {@link Badge.options.colors}.
     */
    Badge.parseColors = function (colorsOption) {
        if (colorsOption) {
            if (Badge.colorsRegex.test(colorsOption)) {
                var badgeColors_1 = {
                    values: {}
                };
                var colors = StringUtils_1.StringUtils.match(colorsOption, Badge.colorRegex);
                _.each(colors, function (color) {
                    var fieldValue = color[1], colorValue = color[2];
                    if (fieldValue != null) {
                        badgeColors_1.values[fieldValue.replace(/\\(:|;)/g, '$1')] = {
                            icon: colorValue
                        };
                    }
                    else {
                        badgeColors_1.icon = colorValue;
                    }
                });
                return badgeColors_1;
            }
            try {
                return JSON.parse(colorsOption);
            }
            catch (e) {
                Assert_1.Assert.fail("Invalid colors for badge '" + colorsOption + "'");
            }
        }
        return {};
    };
    /**
     * Gets the icon and text color of a field value.
     *
     * @param value The field value whose colors to return.
     * @returns {{icon: string, text: string}} An object with the `icon` and `text` keys.
     */
    Badge.prototype.getColor = function (value) {
        if (value === void 0) { value = ''; }
        var colorKey = _.find(_.keys(this.options.colors.values), function (key) { return value.toLowerCase() == key.toLowerCase(); });
        var color = colorKey ? this.options.colors.values[colorKey] : {};
        return {
            icon: color.icon || this.options.colors.icon,
            text: color.text || this.options.colors.text,
        };
    };
    /**
     * Renders one string value with the appropriate colors and icon.
     *
     * @param value The field value to render.
     * @returns {HTMLElement} An HTML `<span>` tag containing the rendered value.
     */
    Badge.prototype.renderOneValue = function (value) {
        var valueDom = _super.prototype.renderOneValue.call(this, value);
        Dom_1.$$(valueDom).addClass('coveo-value');
        var color = this.getColor(value);
        var icon = Dom_1.$$('span', { className: 'coveo-badge-icon' }).el;
        if (color.icon != null) {
            icon.style.color = color.icon;
        }
        var label = Dom_1.$$('span', { className: 'coveo-badge-label' }, valueDom.innerHTML).el;
        if (color.text != null) {
            label.style.color = color.text;
        }
        Dom_1.$$(valueDom).empty();
        valueDom.appendChild(icon);
        valueDom.appendChild(label);
        return valueDom;
    };
    // Override the protected method from FieldValue class to ignore a potential textCaption on a Badge.
    Badge.prototype.prependTextCaptionToDom = function () {
        return;
    };
    return Badge;
}(FieldValue_1.FieldValue));
Badge.ID = 'Badge';
Badge.doExport = function () {
    GlobalExports_1.exportGlobally({
        'Badge': Badge
    });
};
/**
 * The options for the component
 * @componentOptions
 */
Badge.options = {
    /**
     * Specifies the colors for the Badge component.
     *
     * You must specify the colors in a JSON format similar to what follows:
     * ```json
     * {
     *   "values":{
     *     "foo":{
     *       "icon":"blue",
     *       "text":"#222"
     *     },
     *     "bar":{
     *       "icon":"green",
     *       "text":"lightgreen"
     *     }
     *   },
     *   "icon":"red",
     *   "text":"#9ab52b"
     * }
     * ```
     * This format allows you to customize both the icon and text colors for each field value as well as the default
     * values.
     *
     * Colors can be specified in HTML or hexadecimal format.
     */
    colors: ComponentOptions_1.ComponentOptions.buildCustomOption(function (value) { return Badge.parseColors(value); }, { defaultValue: { values: {} } }),
    textCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption()
};
Badge.parent = FieldValue_1.FieldValue;
// The following regexes are used to match the old color format:
// This one matches a single color, e.g. either "red" or "foo: blue".
// Its capture groups will be the following :
// 0:( 1:() 2:(red)) or 0:( 1:(foo) 2:(blue))
Badge.colorRegex = /(?:\s*((?:[^:;]|\\[;:])*)\s*:\s*)?(\w+|#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3})/g;
// This one matches all colors, separated by semicolons, e.g. "red; foo: blue; bar: green".
// It wraps 'colorRegex' in other capture groups, such as the following:
// 0:(red) 1:(foo: blue;) 2:(bar: green)
Badge.colorsRegex = new RegExp('^(\\s*' + Badge.colorRegex.source + '\\s*;)*(\\s*' + Badge.colorRegex.source + ')?\\s*$');
exports.Badge = Badge;
Badge.options = _.omit(Badge.options, 'textCaption');
Initialization_1.Initialization.registerAutoCreateComponent(Badge);


/***/ }),

/***/ 98:
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
var Initialization_1 = __webpack_require__(2);
var TemplateHelpers_1 = __webpack_require__(69);
var Assert_1 = __webpack_require__(7);
var DateUtils_1 = __webpack_require__(29);
var QueryStateModel_1 = __webpack_require__(13);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
var StringUtils_1 = __webpack_require__(20);
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
var FieldValue = (function (_super) {
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
            _this.options = ComponentOptions_1.ComponentOptions.initOptions(element, FieldValue.helperOptions, _this.options);
            var toFilter = _.keys(FieldValue.options.helperOptions['subOptions']);
            var toKeep_1 = _.filter(toFilter, function (optionKey) {
                var optionDefinition = FieldValue.options.helperOptions['subOptions'][optionKey];
                if (optionDefinition) {
                    var helpers = optionDefinition.helpers;
                    return helpers != null && _.contains(helpers, _this.options.helper);
                }
                return false;
            });
            _this.options.helperOptions = _.omit(_this.options.helperOptions, function (value, key) {
                return !_.contains(toKeep_1, key);
            });
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
            if (_.isArray(loadedValueFromComponent)) {
                values = loadedValueFromComponent;
            }
            else if (_this.options.splitValues) {
                if (_.isString(loadedValueFromComponent)) {
                    values = _.map(loadedValueFromComponent.split(_this.options.separator), function (v) {
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
        if (!_.isArray(value) && _.isObject(value)) {
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
        var toRender = value;
        if (this.options.helper) {
            toRender = TemplateHelpers_1.TemplateHelpers.getHelper(this.options.helper).call(this, value, this.getHelperOptions());
            var fullDateStr = this.getFullDate(value, this.options.helper);
            if (fullDateStr) {
                element.setAttribute('title', fullDateStr);
            }
        }
        if (this.options.helper == 'date' || this.options.helper == 'dateTime' || this.options.helper == 'emailDateTime') {
            toRender = StringUtils_1.StringUtils.capitalizeFirstLetter(toRender);
        }
        if (this.options.htmlValue) {
            element.innerHTML = toRender;
        }
        else {
            element.appendChild(document.createTextNode(toRender));
        }
        this.bindEventOnValue(element, value);
        return element;
    };
    FieldValue.prototype.getValueContainer = function () {
        return this.element;
    };
    FieldValue.prototype.getHelperOptions = function () {
        var inlineOptions = ComponentOptions_1.ComponentOptions.loadStringOption(this.element, 'helperOptions', {});
        if (Utils_1.Utils.isNonEmptyString(inlineOptions)) {
            return _.extend({}, this.options.helperOptions, eval('(' + inlineOptions + ')'));
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
        _.each(values, function (value, index) {
            if (value != undefined) {
                _this.getValueContainer().appendChild(_this.renderOneValue(value));
                if (index !== values.length - 1) {
                    _this.getValueContainer().appendChild(document.createTextNode(_this.options.displaySeparator));
                }
            }
        });
    };
    FieldValue.prototype.renderTextCaption = function () {
        var element = Dom_1.$$('span', { className: 'coveo-field-caption' }, _.escape(this.options.textCaption));
        return element.el;
    };
    FieldValue.prototype.prependTextCaptionToDom = function () {
        var elem = this.getValueContainer();
        Dom_1.$$(elem).prepend(this.renderTextCaption());
        // Add a class to the container so the value and the caption wrap together.
        Dom_1.$$(elem).addClass('coveo-with-label');
    };
    FieldValue.prototype.bindEventOnValue = function (element, value) {
        var _this = this;
        if (Utils_1.Utils.isUndefined(Coveo['FacetRange'])) {
            return;
        }
        var facetAttributeName = QueryStateModel_1.QueryStateModel.getFacetId(this.options.facet);
        var facets = _.filter(this.componentStateModel.get(facetAttributeName), function (facet) {
            return !facet.disabled && Coveo['FacetRange'] && !(facet instanceof Coveo['FacetRange']);
        });
        var atLeastOneFacetIsEnabled = facets.length > 0;
        if (atLeastOneFacetIsEnabled) {
            var selected_1 = _.find(facets, function (facet) {
                var facetValue = facet.values.get(value);
                return facetValue && facetValue.selected;
            });
            Dom_1.$$(element).on('click', function () {
                if (selected_1 != null) {
                    _.each(facets, function (facet) { return facet.deselectValue(value); });
                }
                else {
                    _.each(facets, function (facet) { return facet.selectValue(value); });
                }
                _this.queryController.deferExecuteQuery({
                    beforeExecuteQuery: function () { return _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentField, {
                        facetId: _this.options.facet,
                        facetValue: value.toLowerCase()
                    }); }
                });
            });
            if (selected_1) {
                Dom_1.$$(element).addClass('coveo-selected');
            }
            Dom_1.$$(element).addClass('coveo-clickable');
        }
    };
    return FieldValue;
}(Component_1.Component));
FieldValue.ID = 'FieldValue';
FieldValue.doExport = function () {
    GlobalExports_1.exportGlobally({
        'FieldValue': FieldValue
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
            'class': ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
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
            lengthLimit: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['email'], { min: 1 })),
            truncateName: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['email'])),
            alt: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
            height: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
            width: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
            presision: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 2 })),
            base: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 0 })),
            isMilliseconds: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['timeSpan'])),
        }
    }),
    /**
     * Specifies a caption to display before the value.
     *
     * Default value is `undefined`.
     */
    textCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption()
};
FieldValue.simpleOptions = _.omit(FieldValue.options, 'helperOptions');
FieldValue.helperOptions = {
    helperOptions: FieldValue.options.helperOptions
};
exports.FieldValue = FieldValue;
Initialization_1.Initialization.registerAutoCreateComponent(FieldValue);


/***/ })

});
//# sourceMappingURL=Badge.js.map