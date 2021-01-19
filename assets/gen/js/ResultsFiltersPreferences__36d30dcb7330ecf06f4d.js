webpackJsonpCoveo__temporary([24,54,55],{

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

/***/ 272:
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
__webpack_require__(659);
var _ = __webpack_require__(0);
var BreadcrumbEvents_1 = __webpack_require__(34);
var InitializationEvents_1 = __webpack_require__(17);
var PreferencesPanelEvents_1 = __webpack_require__(96);
var QueryEvents_1 = __webpack_require__(11);
var GlobalExports_1 = __webpack_require__(3);
var Model_1 = __webpack_require__(18);
var QueryStateModel_1 = __webpack_require__(13);
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var Dom_1 = __webpack_require__(1);
var LocalStorageUtils_1 = __webpack_require__(55);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var Checkbox_1 = __webpack_require__(64);
var FormGroup_1 = __webpack_require__(136);
var MultiSelect_1 = __webpack_require__(190);
var TextInput_1 = __webpack_require__(54);
/**
 * The `ResultFiltersPreferences` component allows end users to create custom filters to apply to queries. These filters
 * are saved to local storage.
 *
 * Only advanced end users who understand the Coveo query syntax should use this feature (see
 * [Coveo Query Syntax Reference](https://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
 *
 * This component is normally accessible through the [`Settings`]{@link Settings} menu. Its usual location in the DOM is
 * inside the [`PreferencesPanel`]{@link PreferencesPanel} element.
 *
 * See also the {@link ResultsPreferences} component.
 */
var ResultsFiltersPreferences = /** @class */ (function (_super) {
    __extends(ResultsFiltersPreferences, _super);
    /**
     * Creates a new `ResultsFiltersPreferences` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultsFiltersPreferences` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function ResultsFiltersPreferences(element, options, bindings) {
        var _this = _super.call(this, element, ResultsFiltersPreferences.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.preferencePanelCheckboxInput = {};
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultsFiltersPreferences, options);
        _this.preferencePanel = Dom_1.$$(_this.element).closest(Component_1.Component.computeCssClassNameForType('PreferencesPanel'));
        if (!_this.preferencePanel) {
            _this.logger.warn("Cannot instantiate ResultsFilterPreferences, as there is no \"CoveoPreferencesPanel\" in your page !");
            return _this;
        }
        _this.preferencePanelLocalStorage = new LocalStorageUtils_1.LocalStorageUtils(ResultsFiltersPreferences.ID);
        _this.mergeLocalPreferencesWithStaticPreferences();
        _this.bindPreferencePanelEvent();
        _this.bindBreadcrumbEvent();
        _this.bindQueryEvent();
        // We need to wait after all components are initialized before building the dom, because this component interacts with Tab
        // And we don't know if Tab(s) are initialized before or after this component.
        _this.bind.oneRootElement(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () { return _this.createDom(); });
        _this.bind.oneQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.T, function () { return _this.fromPreferencesToCheckboxInput(); });
        return _this;
    }
    ResultsFiltersPreferences.prototype.createDom = function () {
        this.container = new FormGroup_1.FormGroup([], Strings_1.l('ResultsFilteringExpression')).build();
        this.element.appendChild(this.container);
        this.buildCheckboxesInput();
        if (this.options.showAdvancedFilters) {
            this.buildAdvancedFilters();
        }
    };
    ResultsFiltersPreferences.prototype.save = function () {
        this.fromCheckboxInputToPreferences();
        var toSave = _.omit(this.preferences, 'tab');
        this.logger.info('Saving preferences', toSave);
        this.preferencePanelLocalStorage.save(toSave);
    };
    ResultsFiltersPreferences.prototype.exitWithoutSave = function () {
        this.fromPreferencesToCheckboxInput();
        this.hideAdvancedFilterBuilder();
    };
    ResultsFiltersPreferences.prototype.bindPreferencePanelEvent = function () {
        var _this = this;
        this.bind.on(this.preferencePanel, PreferencesPanelEvents_1.PreferencesPanelEvents.savePreferences, function () { return _this.save(); });
        this.bind.on(this.preferencePanel, PreferencesPanelEvents_1.PreferencesPanelEvents.exitPreferencesWithoutSave, function () { return _this.exitWithoutSave(); });
    };
    ResultsFiltersPreferences.prototype.bindBreadcrumbEvent = function () {
        var _this = this;
        if (this.options.includeInBreadcrumb) {
            this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) {
                return _this.handlePopulateBreadcrumb(args);
            });
            this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, function () { return _this.handleClearBreadcrumb(); });
        }
    };
    ResultsFiltersPreferences.prototype.bindQueryEvent = function () {
        var _this = this;
        this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
    };
    ResultsFiltersPreferences.prototype.handleBuildingQuery = function (args) {
        _.each(this.getActiveFilters(), function (filter) {
            if (Utils_1.Utils.isNonEmptyString(filter.expression)) {
                args.queryBuilder.advancedExpression.add(filter.expression);
            }
        });
    };
    ResultsFiltersPreferences.prototype.handlePopulateBreadcrumb = function (args) {
        var actives = this.getActiveFilters();
        if (Utils_1.Utils.isNonEmptyArray(actives)) {
            var container = Dom_1.$$('div', { className: 'coveo-results-filter-preferences-breadcrumb' });
            var title = Dom_1.$$('span', { className: 'coveo-title' });
            title.text(Strings_1.l('FiltersInYourPreferences') + ':');
            container.el.appendChild(title.el);
            var valuesContainer = Dom_1.$$('span', { className: 'coveo-values' });
            container.el.appendChild(valuesContainer.el);
            for (var i = 0; i < actives.length; i++) {
                valuesContainer.el.appendChild(this.buildBreadcrumb(actives[i]));
            }
            args.breadcrumbs.push({ element: container.el });
        }
    };
    ResultsFiltersPreferences.prototype.handleClearBreadcrumb = function () {
        this.isFullBreadcrumbClear = true;
        _.each(this.getActiveFilters(), function (filter) {
            filter.selected = false;
        });
        this.fromPreferencesToCheckboxInput();
        this.isFullBreadcrumbClear = false;
    };
    ResultsFiltersPreferences.prototype.buildAdvancedFilters = function () {
        var _this = this;
        this.advancedFilters = Dom_1.$$('div', { className: 'coveo-advanced-filters' }, Strings_1.l('Create')).el;
        this.buildAdvancedFilterInput();
        this.buildAdvancedFilterFormValidate();
        this.advancedFiltersBuilder = Dom_1.$$('div', { className: 'coveo-advanced-filters-builder' }).el;
        this.advancedFiltersBuilder.appendChild(this.advancedFilterFormValidate);
        Dom_1.$$(this.advancedFilters).on('click', function () { return _this.openAdvancedFilterSectionOrSaveFilters(); });
        var onlineHelp = Dom_1.$$('a', {
            href: 'https://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10006',
            className: 'coveo-online-help'
        }, '?');
        var title = Dom_1.$$(this.container).find('.coveo-form-group-label');
        onlineHelp.insertAfter(title);
        Dom_1.$$(this.advancedFilters).insertAfter(title);
        this.container.appendChild(this.advancedFiltersBuilder);
    };
    ResultsFiltersPreferences.prototype.buildAdvancedFilterInput = function () {
        this.advancedFiltersTextInputCaption = new TextInput_1.TextInput(function () { }, Strings_1.l('Caption'));
        this.advancedFiltersTextInputCaption.getInput().setAttribute('required', '');
        this.advancedFiltersTextInputExpression = new TextInput_1.TextInput(function () { }, Strings_1.l('Expression'));
        this.advancedFiltersTextInputExpression.getInput().setAttribute('required', '');
        this.advancedFiltersTabSelect = new MultiSelect_1.MultiSelect(function () { }, this.getAllTabs(), Strings_1.l('Tab'));
    };
    ResultsFiltersPreferences.prototype.buildAdvancedFilterFormValidate = function () {
        var _this = this;
        this.advancedFilterFormValidate = Dom_1.$$('form').el;
        var formSubmit = Dom_1.$$('input', {
            type: 'submit'
        });
        var saveFormButton = Dom_1.$$('span', {
            className: 'coveo-save'
        }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
        SVGDom_1.SVGDom.addClassToSVGInContainer(saveFormButton.el, 'coveo-save-svg');
        var closeFormButton = Dom_1.$$('span', {
            className: 'coveo-close'
        }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
        SVGDom_1.SVGDom.addClassToSVGInContainer(closeFormButton.el, 'coveo-close-svg');
        var saveAndCloseContainer = Dom_1.$$('div', {
            className: 'coveo-choice-container coveo-close-and-save'
        });
        saveAndCloseContainer.el.appendChild(saveFormButton.el);
        saveAndCloseContainer.el.appendChild(closeFormButton.el);
        var inputCaption = this.advancedFiltersTextInputCaption.build();
        Dom_1.$$(inputCaption).addClass('coveo-caption');
        var filtersTabSelect = this.advancedFiltersTabSelect.build();
        Dom_1.$$(filtersTabSelect).addClass('coveo-tab');
        var filtersExpression = this.advancedFiltersTextInputExpression.build();
        Dom_1.$$(filtersExpression).addClass('coveo-expression');
        _.each([inputCaption, filtersExpression, filtersTabSelect, saveAndCloseContainer.el, formSubmit.el], function (el) {
            _this.advancedFilterFormValidate.appendChild(el);
        });
        saveFormButton.on('click', function () {
            formSubmit.el.click();
        });
        closeFormButton.on('click', function () {
            _this.hideAdvancedFilterBuilder();
        });
        Dom_1.$$(this.advancedFilterFormValidate).on('submit', function (e) { return _this.validateAndSaveAdvancedFilter(e); });
    };
    ResultsFiltersPreferences.prototype.getAllTabs = function () {
        var tabRef = Component_1.Component.getComponentRef('Tab');
        if (tabRef) {
            var tabsElement = Dom_1.$$(this.root).findAll('.' + Component_1.Component.computeCssClassName(tabRef));
            return _.map(tabsElement, function (tabElement) {
                var tab = Component_1.Component.get(tabElement);
                return tab.options.id;
            });
        }
        else {
            return [];
        }
    };
    ResultsFiltersPreferences.prototype.getPreferencesBoxInputToBuild = function () {
        return _.map(this.preferences, function (filter) {
            return {
                label: filter.caption,
                tab: filter.tab,
                expression: filter.expression
            };
        });
    };
    ResultsFiltersPreferences.prototype.buildCheckboxesInput = function () {
        var _this = this;
        if (this.preferenceContainer != undefined) {
            this.preferenceContainer.remove();
        }
        var toBuild = this.getPreferencesBoxInputToBuild();
        if (Utils_1.Utils.isNonEmptyArray(toBuild)) {
            this.preferenceContainer = Dom_1.$$('div', {
                className: 'coveo-choices-container'
            }).el;
            _.each(toBuild, function (filterToBuild) {
                var checkbox = new Checkbox_1.Checkbox(function (checkbox) {
                    _this.save();
                    var filter = _this.preferences[checkbox.getValue()];
                    if (!_this.queryController.firstQuery && !_this.isFullBreadcrumbClear) {
                        _this.fromFilterToAnalyticsEvent(filter, filter.selected ? 'selected' : 'unselected');
                        _this.queryController.executeQuery({
                            closeModalBox: false
                        });
                    }
                }, filterToBuild.label);
                Dom_1.$$(checkbox.build()).addClass('coveo-choice-container');
                _this.preferencePanelCheckboxInput[filterToBuild.label] = checkbox;
                _this.preferenceContainer.appendChild(checkbox.getElement());
            });
            _.each(Dom_1.$$(this.preferenceContainer).findAll('.coveo-choice-container'), function (choiceContainer) {
                choiceContainer.appendChild(Dom_1.$$('div', { className: 'coveo-section coveo-section-edit-delete' }).el);
            });
            Dom_1.$$(this.container).append(this.preferenceContainer);
            this.buildEditAdvancedFilter();
            this.buildDeleteAdvancedFilter();
            this.fromPreferencesToCheckboxInput();
        }
    };
    ResultsFiltersPreferences.prototype.buildDeleteAdvancedFilter = function () {
        var _this = this;
        _.each(this.preferences, function (filter) {
            if (filter.custom) {
                var deleteElement = Dom_1.$$('span', {
                    className: 'coveo-delete'
                }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore).el;
                SVGDom_1.SVGDom.addClassToSVGInContainer(deleteElement, 'coveo-delete-svg');
                var filterElement_1 = _this.getFilterElementByCaption(filter.caption);
                var insertInto = Dom_1.$$(filterElement_1).find('.coveo-section-edit-delete');
                insertInto.appendChild(deleteElement);
                Dom_1.$$(deleteElement).on('click', function () { return _this.confirmDelete(filter, filterElement_1); });
            }
        });
    };
    ResultsFiltersPreferences.prototype.buildEditAdvancedFilter = function () {
        var _this = this;
        _.each(this.preferences, function (filter) {
            if (filter.custom) {
                var editElement = Dom_1.$$('span', {
                    className: 'coveo-edit'
                }, SVGIcons_1.SVGIcons.icons.edit);
                SVGDom_1.SVGDom.addClassToSVGInContainer(editElement.el, 'coveo-edit-svg');
                var filterElement_2 = _this.getFilterElementByCaption(filter.caption);
                var insertInto = Dom_1.$$(filterElement_2).find('.coveo-section-edit-delete');
                insertInto.appendChild(editElement.el);
                editElement.on('click', function () { return _this.editElement(filter, filterElement_2); });
            }
        });
    };
    ResultsFiltersPreferences.prototype.buildBreadcrumb = function (filter) {
        var _this = this;
        var elem = Dom_1.$$('span', { className: 'coveo-value' });
        var caption = Dom_1.$$('span', { className: 'coveo-caption' });
        caption.text(filter.caption);
        elem.el.appendChild(caption.el);
        var clear = Dom_1.$$('span', { className: 'coveo-clear' }, SVGIcons_1.SVGIcons.icons.mainClear);
        elem.el.appendChild(clear.el);
        var onSelectAction = function () {
            filter.selected = false;
            _this.fromFilterToAnalyticsEvent(filter, 'cleared from breadcrumb');
            _this.fromPreferencesToCheckboxInput();
        };
        new AccessibleButton_1.AccessibleButton()
            .withElement(elem)
            .withLabel(Strings_1.l('RemoveFilterOn', filter.caption))
            .withSelectAction(onSelectAction)
            .build();
        return elem.el;
    };
    ResultsFiltersPreferences.prototype.confirmDelete = function (filter, filterElement) {
        if (confirm(Strings_1.l('AreYouSureDeleteFilter', filter.caption, filter.expression))) {
            var isSelected = filter.selected;
            this.deleteFilterPreference(filter, filterElement);
            if (isSelected) {
                this.fromFilterToAnalyticsEvent(filter, 'deleted');
                this.queryController.executeQuery({
                    closeModalBox: false
                });
            }
        }
    };
    ResultsFiltersPreferences.prototype.editElement = function (filter, filterElement) {
        var oldCaption = this.preferences[filter.caption].caption;
        var oldTab = this.preferences[filter.caption].tab;
        var oldExpression = this.preferences[filter.caption].expression;
        this.deleteFilterPreference(filter, filterElement);
        this.openAdvancedFilterSectionOrSaveFilters();
        this.populateEditSection({ tab: oldTab, caption: oldCaption, expression: oldExpression });
    };
    ResultsFiltersPreferences.prototype.populateEditSection = function (toPopulate) {
        if (toPopulate === void 0) { toPopulate = { tab: [''], caption: '', expression: '' }; }
        this.advancedFiltersTextInputCaption.setValue(toPopulate.caption);
        this.advancedFiltersTextInputExpression.setValue(toPopulate.expression);
        this.advancedFiltersTabSelect.setValue(toPopulate.tab);
    };
    ResultsFiltersPreferences.prototype.deleteFilterPreference = function (filter, filterElement) {
        this.preferencePanelLocalStorage.remove(filter.caption);
        delete this.preferences[filter.caption];
        Dom_1.$$(Dom_1.$$(filterElement).closest('.coveo-choice-container')).detach();
    };
    ResultsFiltersPreferences.prototype.openAdvancedFilterSectionOrSaveFilters = function () {
        if (Dom_1.$$(this.advancedFiltersBuilder).hasClass('coveo-active')) {
            Dom_1.$$(Dom_1.$$(this.advancedFilterFormValidate).find('input[type=submit]')).trigger('click');
            this.hideAdvancedFilterBuilder();
        }
        else {
            this.populateEditSection();
            this.showAdvancedFilterBuilder();
        }
    };
    ResultsFiltersPreferences.prototype.validateAndSaveAdvancedFilter = function (e) {
        e.preventDefault();
        this.hideAdvancedFilterBuilder();
        var caption = this.advancedFiltersTextInputCaption.getValue();
        var expression = this.advancedFiltersTextInputExpression.getValue();
        var tabs = this.advancedFiltersTabSelect.getValue();
        this.preferences[caption] = {
            caption: caption,
            custom: true,
            expression: expression,
            tab: tabs,
            selected: true
        };
        this.buildCheckboxesInput();
        this.save();
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.t, this.getActiveTab());
        this.advancedFiltersTextInputCaption.reset();
        this.advancedFiltersTextInputExpression.reset();
        this.advancedFiltersTabSelect.reset();
        this.container.appendChild(this.advancedFiltersBuilder);
        this.fromFilterToAnalyticsEvent(this.preferences[caption], 'saved');
        this.queryController.executeQuery({
            closeModalBox: false
        });
    };
    ResultsFiltersPreferences.prototype.fromPreferencesToCheckboxInput = function () {
        var _this = this;
        _.each(this.getActiveFilters(), function (filter) {
            _this.preferencePanelCheckboxInput[filter.caption].select();
        });
        _.each(this.getInactiveFilters(), function (filter) {
            _this.preferencePanelCheckboxInput[filter.caption].reset();
        });
        _.each(this.getDormantFilters(), function (filter) {
            _this.preferencePanelCheckboxInput[filter.caption].select();
        });
    };
    ResultsFiltersPreferences.prototype.fromCheckboxInputToPreferences = function () {
        if (this.preferencePanelCheckboxInput) {
            var selecteds_1 = _.map(_.filter(this.preferencePanelCheckboxInput, function (checkbox) { return checkbox.isSelected(); }), function (selected) { return selected.getValue(); });
            _.each(this.preferences, function (filter) {
                if (_.contains(selecteds_1, filter.caption)) {
                    filter.selected = true;
                }
                else {
                    filter.selected = false;
                }
            });
        }
    };
    ResultsFiltersPreferences.prototype.getDormantFilters = function () {
        var _this = this;
        var activeTab = this.getActiveTab();
        return _.filter(this.preferences, function (filter) {
            return filter.selected && !_this.filterIsInActiveTab(filter, activeTab);
        });
    };
    ResultsFiltersPreferences.prototype.getActiveFilters = function () {
        var _this = this;
        var activeTab = this.getActiveTab();
        return _.filter(this.preferences, function (filter) {
            return filter.selected && _this.filterIsInActiveTab(filter, activeTab);
        });
    };
    ResultsFiltersPreferences.prototype.getInactiveFilters = function () {
        var _this = this;
        var activeTab = this.getActiveTab();
        return _.filter(this.preferences, function (filter) {
            return !filter.selected || !_this.filterIsInActiveTab(filter, activeTab);
        });
    };
    ResultsFiltersPreferences.prototype.getActiveTab = function () {
        return this.queryStateModel.get(QueryStateModel_1.QueryStateModel.attributesEnum.t);
    };
    ResultsFiltersPreferences.prototype.filterIsInActiveTab = function (filter, tab) {
        filter.tab = _.compact(filter.tab);
        return _.contains(filter.tab, tab) || Utils_1.Utils.isEmptyArray(filter.tab);
    };
    ResultsFiltersPreferences.prototype.getFilterElementByCaption = function (caption) {
        return Dom_1.$$(this.preferenceContainer).find("input[value='" + caption + "']").parentElement;
    };
    ResultsFiltersPreferences.prototype.fromResultsFilterOptionToResultsPreferenceInterface = function () {
        var ret = {};
        _.each(this.options.filters, function (filter, caption) {
            ret[caption] = {
                expression: filter.expression,
                tab: filter.tab,
                selected: filter.selected ? filter.selected : false,
                custom: false,
                caption: caption
            };
        });
        return ret;
    };
    ResultsFiltersPreferences.prototype.mergeLocalPreferencesWithStaticPreferences = function () {
        var staticPreferences = this.fromResultsFilterOptionToResultsPreferenceInterface();
        var localPreferences = this.preferencePanelLocalStorage.load();
        var localPreferencesWithoutRemoved = _.filter(localPreferences, function (preference) {
            var isCustom = preference.custom;
            var existsInStatic = _.find(staticPreferences, function (staticPreference) {
                return staticPreference.caption == preference.caption;
            });
            return isCustom || existsInStatic != undefined;
        });
        var localToMerge = {};
        _.each(localPreferencesWithoutRemoved, function (filter) {
            localToMerge[filter.caption] = {
                expression: filter.expression,
                tab: filter.tab,
                selected: filter.selected,
                custom: filter.custom,
                caption: filter.caption
            };
        });
        this.preferences = Utils_1.Utils.extendDeep(staticPreferences, localToMerge);
    };
    ResultsFiltersPreferences.prototype.fromFilterToAnalyticsEvent = function (filter, type) {
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.customfiltersChange, {
            customFilterName: filter.caption,
            customFilterExpression: filter.expression,
            customFilterType: type
        });
    };
    ResultsFiltersPreferences.prototype.enlargeModalBox = function () {
        var modalBoxContainer = Dom_1.$$(document.body).find('.coveo-modal-container');
        if (modalBoxContainer) {
            Dom_1.$$(modalBoxContainer).addClass('coveo-mod-big');
        }
    };
    ResultsFiltersPreferences.prototype.shrinkModalBox = function () {
        var modalBoxContainer = Dom_1.$$(document.body).find('.coveo-modal-container');
        if (modalBoxContainer) {
            Dom_1.$$(modalBoxContainer).removeClass('coveo-mod-big');
        }
    };
    ResultsFiltersPreferences.prototype.showAdvancedFilterBuilder = function () {
        if (this.advancedFiltersBuilder) {
            Dom_1.$$(this.advancedFiltersBuilder).addClass('coveo-active');
            this.enlargeModalBox();
        }
    };
    ResultsFiltersPreferences.prototype.hideAdvancedFilterBuilder = function () {
        if (this.advancedFiltersBuilder) {
            Dom_1.$$(this.advancedFiltersBuilder).removeClass('coveo-active');
            this.shrinkModalBox();
        }
    };
    ResultsFiltersPreferences.ID = 'ResultsFiltersPreferences';
    ResultsFiltersPreferences.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultsFiltersPreferences: ResultsFiltersPreferences
        });
    };
    /**
     * The options for the component
     * @componentOptions
     */
    ResultsFiltersPreferences.options = {
        /**
         * Specifies whether to display the active filter(s) in the [`Breadcrumb`]{@link Breadcrumb}.
         *
         * Default value is `true`.
         */
        includeInBreadcrumb: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to show the **Create** button that allows the end user to create filters.
         *
         * If you set this option to `false`, only the pre-populated
         * [`filters`]{@link ResultsFiltersPreferences.options.filters} are available to the end user.
         *
         * Default value is `true`.
         */
        showAdvancedFilters: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies the default filters which all end users can apply.
         *
         * End users cannot modify or delete these filters. These filters do not count as "user-made" filters, but rather as
         * "built-in" filters created by the developer of the search page.
         *
         * **Note:**
         * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
         * > [`init`]{@link init} call of your search interface (see
         * > [Passing Component Options in the init Call](https://docs.coveo.com/en/346/#passing-component-options-in-the-init-call)),
         * > or before the `init` call, using the `options` top-level function (see
         * > [Passing Component Options Before the init Call](https://docs.coveo.com/en/346/#passing-component-options-before-the-init-call)).
         *
         * Filters should follow this definition:
         *
         * `filters : { [caption : string] : { expression : string, tab? : string[] } }`;
         *
         * **Example:**
         *
         * var myFilters = {
         *   "Only Google Drive Items" : {
         *     expression : "@connectortype == 'GoogleDriveCrawler'",
         *     tab : ["Tab1", "Tab2"]
         *   },
         *
         *   "Another Filter" : {
         *     expression : [ ... another expression ... ]
         *   },
         *
         *   [ ... ]
         * };
         *
         * ```javascript
         * // You can set the option in the 'init' call:
         * Coveo.init(document.querySelector("#search"), {
         *   ResultsFiltersPreferences : {
         *     filters : myFilters
         *   }
         * });
         *
         * // Or before the 'init' call, using the 'options' top-level function:
         * // Coveo.options(document.querySelector("#search"), {
         * //   ResultsFiltersPreferences : {
         *        filters : myFilters
         *      }
         * // });
         * ```
         *
         * Default value is `undefined`.
         */
        filters: ComponentOptions_1.ComponentOptions.buildJsonOption()
    };
    return ResultsFiltersPreferences;
}(Component_1.Component));
exports.ResultsFiltersPreferences = ResultsFiltersPreferences;
Initialization_1.Initialization.registerAutoCreateComponent(ResultsFiltersPreferences);


/***/ }),

/***/ 561:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 573:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 659:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ResultsFiltersPreferences__36d30dcb7330ecf06f4d.js.map