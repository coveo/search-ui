webpackJsonpCoveo__temporary([6,47,48],{

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SVGIcons = (function () {
    function SVGIcons() {
    }
    return SVGIcons;
}());
SVGIcons.search = __webpack_require__(465);
SVGIcons.more = __webpack_require__(463);
SVGIcons.loading = __webpack_require__(461);
SVGIcons.checkboxHookExclusionMore = __webpack_require__(450);
SVGIcons.arrowUp = __webpack_require__(448);
SVGIcons.arrowDown = __webpack_require__(447);
SVGIcons.mainClear = __webpack_require__(462);
SVGIcons.orAnd = __webpack_require__(464);
SVGIcons.sort = __webpack_require__(466);
SVGIcons.ascending = __webpack_require__(449);
SVGIcons.descending = __webpack_require__(451);
SVGIcons.dropdownMore = __webpack_require__(456);
SVGIcons.dropdownLess = __webpack_require__(455);
SVGIcons.facetCollapse = __webpack_require__(459);
SVGIcons.facetExpand = __webpack_require__(460);
SVGIcons.dropdownShareQuery = __webpack_require__(458);
SVGIcons.dropdownPreferences = __webpack_require__(457);
SVGIcons.dropdownAuthenticate = __webpack_require__(452);
SVGIcons.dropdownExport = __webpack_require__(453);
SVGIcons.dropdownFollowQuery = __webpack_require__(454);
exports.SVGIcons = SVGIcons;


/***/ }),

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
var Strings_1 = __webpack_require__(10);
__webpack_require__(482);
var Utils_1 = __webpack_require__(5);
var GlobalExports_1 = __webpack_require__(4);
/**
 * A multi select widget with standard styling.
 */
var MultiSelect = (function () {
    /**
     * Creates a new `MultiSelect`.
     * @param onChange The function to call when the widget selected values change. This function takes the current
     * `MultiSelect` instance as an argument.
     * @param options The values which can be selected with the multi select.
     * @param label The label to display for the multi select.
     */
    function MultiSelect(onChange, options, label) {
        if (onChange === void 0) { onChange = function (multiSelect) {
        }; }
        this.onChange = onChange;
        this.options = options;
        this.label = label;
        this.buildContent();
    }
    MultiSelect.doExport = function () {
        GlobalExports_1.exportGlobally({
            'MultiSelect': MultiSelect
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
        var currentStateSplit = _.partition(_.toArray(this.element.options), function (opt) { return _.contains(currentlySelected, opt.value); });
        var newStateToApplySplit = _.partition(_.toArray(this.element.options), function (opt) { return _.contains(values, opt.value); });
        _.each(newStateToApplySplit[0], function (toSelect) { return toSelect.selected = true; });
        _.each(newStateToApplySplit[1], function (toUnSelect) { return toUnSelect.selected = false; });
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
            className: 'mdc-multi-select mdl-list',
            multiple: '',
            size: this.options.length.toString()
        }).el;
        var optgroup = Dom_1.$$('optgroup', {
            className: 'mdc-list-group',
            label: this.label
        });
        var options = _.map(this.options, function (opt) {
            return Dom_1.$$('option', { value: opt, className: 'mdc-list-item' }, Strings_1.l(opt));
        });
        _.each(options, function (opt) { return optgroup.append(opt.el); });
        this.element.appendChild(optgroup.el);
        Dom_1.$$(this.element).on('change', function () { return _this.onChange(_this); });
    };
    return MultiSelect;
}());
exports.MultiSelect = MultiSelect;


/***/ }),

/***/ 27:
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

/***/ 320:
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
var LocalStorageUtils_1 = __webpack_require__(36);
var InitializationEvents_1 = __webpack_require__(15);
var PreferencesPanelEvents_1 = __webpack_require__(67);
var Model_1 = __webpack_require__(16);
var QueryEvents_1 = __webpack_require__(11);
var QueryStateModel_1 = __webpack_require__(13);
var BreadcrumbEvents_1 = __webpack_require__(43);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var Initialization_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(10);
var Utils_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(598);
var Checkbox_1 = __webpack_require__(61);
var TextInput_1 = __webpack_require__(48);
var MultiSelect_1 = __webpack_require__(248);
var FormGroup_1 = __webpack_require__(99);
var SVGIcons_1 = __webpack_require__(21);
var SVGDom_1 = __webpack_require__(27);
/**
 * The `ResultFiltersPreferences` component allows end users to create custom filters to apply to queries. These filters
 * are saved to local storage.
 *
 * Only advanced end users who understand the Coveo query syntax should use this feature (see
 * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
 *
 * This component is normally accessible through the [`Settings`]{@link Settings} menu. Its usual location in the DOM is
 * inside the [`PreferencesPanel`]{@link PreferencesPanel} element.
 *
 * See also the {@link ResultsPreferences} component.
 */
var ResultsFiltersPreferences = (function (_super) {
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
            this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, function (args) { return _this.handlePopulateBreadcrumb(args); });
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
                if (i != 0) {
                    var separator = Dom_1.$$('span', {
                        className: 'coveo-separator'
                    });
                    separator.text(', ');
                    valuesContainer.el.appendChild(separator.el);
                }
                valuesContainer.el.appendChild(this.buildBreadcrumb(actives[i]));
            }
            args.breadcrumbs.push({ element: container.el });
        }
    };
    ResultsFiltersPreferences.prototype.handleClearBreadcrumb = function () {
        _.each(this.getActiveFilters(), function (filter) {
            filter.selected = false;
        });
        this.fromPreferencesToCheckboxInput();
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
            href: 'http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10006',
            className: 'coveo-online-help'
        }, '?');
        var title = Dom_1.$$(this.container).find('.coveo-form-group-label');
        onlineHelp.insertAfter(title);
        Dom_1.$$(this.advancedFilters).insertAfter(title);
        this.container.appendChild(this.advancedFiltersBuilder);
    };
    ResultsFiltersPreferences.prototype.buildAdvancedFilterInput = function () {
        this.advancedFiltersTextInputCaption = new TextInput_1.TextInput(function () {
        }, Strings_1.l('Caption'));
        this.advancedFiltersTextInputCaption.getInput().setAttribute('required', '');
        this.advancedFiltersTextInputExpression = new TextInput_1.TextInput(function () {
        }, Strings_1.l('Expression'));
        this.advancedFiltersTextInputExpression.getInput().setAttribute('required', '');
        this.advancedFiltersTabSelect = new MultiSelect_1.MultiSelect(function () {
        }, this.getAllTabs(), Strings_1.l('Tab'));
    };
    ResultsFiltersPreferences.prototype.buildAdvancedFilterFormValidate = function () {
        var _this = this;
        this.advancedFilterFormValidate = Dom_1.$$('form').el;
        var formSubmit = Dom_1.$$('input', {
            type: 'submit'
        });
        var saveFormButton = Dom_1.$$('span', {
            className: 'coveo-save'
        });
        var closeFormButton = Dom_1.$$('span', {
            className: 'coveo-close'
        }, SVGIcons_1.SVGIcons.checkboxHookExclusionMore);
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
                    _this.fromFilterToAnalyticsEvent(filter, filter.selected ? 'selected' : 'unselected');
                    _this.queryController.executeQuery({
                        closeModalBox: false
                    });
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
                }, Dom_1.$$('span', {
                    className: 'coveo-icon'
                }).el).el;
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
                }, Dom_1.$$('span', { className: 'coveo-icon' }));
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
        var clear = Dom_1.$$('span', { className: 'coveo-clear' }, SVGIcons_1.SVGIcons.checkboxHookExclusionMore);
        SVGDom_1.SVGDom.addClassToSVGInContainer(clear.el, 'coveo-clear-svg');
        elem.el.appendChild(clear.el);
        elem.on('click', function () {
            filter.selected = false;
            _this.fromFilterToAnalyticsEvent(filter, 'cleared from breadcrumb');
            _this.fromPreferencesToCheckboxInput();
            _this.queryController.executeQuery({
                closeModalBox: false
            });
        });
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
        return Dom_1.$$(this.preferenceContainer).find('input[value=\'' + caption + '\']').parentElement;
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
    return ResultsFiltersPreferences;
}(Component_1.Component));
ResultsFiltersPreferences.ID = 'ResultsFiltersPreferences';
ResultsFiltersPreferences.doExport = function () {
    GlobalExports_1.exportGlobally({
        'ResultsFiltersPreferences': ResultsFiltersPreferences
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
     * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
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
exports.ResultsFiltersPreferences = ResultsFiltersPreferences;
Initialization_1.Initialization.registerAutoCreateComponent(ResultsFiltersPreferences);


/***/ }),

/***/ 447:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 10 6\" viewBox=\"0 0 10 6\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m5 5.932c-.222 0-.443-.084-.612-.253l-4.134-4.134c-.338-.338-.338-.886 0-1.224s.886-.338 1.224 0l3.522 3.521 3.523-3.521c.336-.338.886-.338 1.224 0s .337.886-.001 1.224l-4.135 4.134c-.168.169-.39.253-.611.253z\"></path></g></svg>"

/***/ }),

/***/ 448:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 10 6\" viewBox=\"0 0 10 6\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m5 .068c.222 0 .443.084.612.253l4.134 4.134c.338.338.338.886 0 1.224s-.886.338-1.224 0l-3.522-3.521-3.523 3.521c-.336.338-.886.338-1.224 0s-.337-.886.001-1.224l4.134-4.134c.168-.169.39-.253.612-.253z\"></path></g></svg>"

/***/ }),

/***/ 449:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 12\" viewBox=\"0 0 15 12\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m10.936 2.021 0 0c0 .549-.452.998-1.004.998h-1.004c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h1.004c.552 0 1.004.449 1.004.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m12.943 5.015 0 0c0 .549-.452.998-1.004.998h-3.011c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h3.011c.553 0 1.004.449 1.004.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m15 8.008 0 0c0 .549-.452.998-1.004.998h-5.068c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h5.068c.552 0 1.004.449 1.004.998z\"></path><path d=\"m6.521 2.683-2.403-2.391c-.188-.187-.444-.292-.71-.292s-.521.105-.71.292l-2.404 2.391c-.392.39-.392 1.021 0 1.411s1.027.39 1.419 0l .691-.687v7.594c0 .55.452.999 1.004.999s1.004-.449 1.004-.998v-7.594l.691.687c.392.39 1.027.39 1.419 0s .392-1.021-.001-1.412z\"></path></g></svg>"

/***/ }),

/***/ 450:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 11 11\" viewBox=\"0 0 11 11\" xmlns=\"http://www.w3.org/2000/svg\"><g class=\"coveo-more-svg\" fill=\"none\"><path d=\"m10.083 4.583h-3.666v-3.666c0-.524-.393-.917-.917-.917s-.917.393-.917.917v3.667h-3.666c-.524-.001-.917.392-.917.916s.393.917.917.917h3.667v3.667c-.001.523.392.916.916.916s.917-.393.917-.917v-3.666h3.667c.523 0 .916-.393.916-.917-.001-.524-.394-.917-.917-.917z\"></path></g><g class=\"coveo-exclusion-svg\" fill=\"none\"><path d=\"m9.233 7.989-2.489-2.489 2.489-2.489c.356-.356.356-.889 0-1.244-.356-.356-.889-.356-1.244 0l-2.489 2.489-2.489-2.489c-.356-.356-.889-.356-1.244 0-.356.356-.356.889 0 1.244l2.489 2.489-2.489 2.489c-.356.356-.356.889 0 1.244.356.356.889.356 1.244 0l2.489-2.489 2.489 2.489c.356.356.889.356 1.244 0 .356-.355.356-.889 0-1.244z\"></path></g><g class=\"coveo-hook-svg\" fill=\"none\"><path d=\"m10.252 2.213c-.155-.142-.354-.211-.573-.213-.215.005-.414.091-.561.24l-4.873 4.932-2.39-2.19c-.154-.144-.385-.214-.57-.214-.214.004-.415.09-.563.24-.148.147-.227.343-.222.549.005.207.093.4.249.542l2.905 2.662c.168.154.388.239.618.239h.022.003c.237-.007.457-.101.618-.266l5.362-5.428c.148-.148.228-.344.223-.551s-.093-.399-.248-.542z\"></path></g></svg>"

/***/ }),

/***/ 451:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 12\" viewBox=\"0 0 15 12\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m6.521 7.906c-.392-.39-1.027-.39-1.419 0l-.69.686v-7.594c0-.549-.452-.998-1.004-.998s-1.004.449-1.004.998v7.594l-.69-.686c-.392-.39-1.027-.39-1.419 0-.392.39-.392 1.021 0 1.411l2.404 2.391c.188.187.443.292.709.292s.522-.105.71-.292l2.404-2.391c.392-.391.392-1.022-.001-1.411z\"></path><path class=\"coveo-active-shape-svg\" d=\"m9.932 11.001h-1.004c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h1.004c.552 0 1.004.449 1.004.998l0 0c0 .549-.452.998-1.004.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m11.94 8.007h-3.012c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h3.011c.552 0 1.004.449 1.004.998l0 0c0 .549-.451.998-1.003.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m13.996 5.014h-5.068c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h5.068c.552 0 1.004.449 1.004.998l0 0c0 .548-.452.998-1.004.998z\"></path></g></svg>"

/***/ }),

/***/ 452:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 12 16\" viewBox=\"0 0 12 16\" xmlns=\"http://www.w3.org/2000/svg\"><g class=\"coveo-dropdown-authenticate-svg\" fill=\"none\"><path d=\"m10 5h-8c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2m0 1.5c.3 0 .5.2.5.5v5c0 .3-.2.5-.5.5h-8c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5z\"></path><path d=\"m10 5h-1.6v-1.1c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v1.1h-1.6v-1.1c0-2.1 1.8-3.9 4-3.9s4 1.8 4 3.9z\"></path></g><g class=\"coveo-dropdown-authenticate-hover-svg\" fill=\"none\"><path class=\"coveo-active-shape-svg\" d=\"m10 7h-8c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2m0 1.5c.3 0 .5.2.5.5v5c0 .3-.2.5-.5.5h-8c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5z\"></path><path d=\"m5.1.1c-1.8.4-3.1 2.1-3.1 4v2.9h1.6v-3.1c0-1.7 1.8-3 3.6-2.1.8.4 1.2 1.3 1.2 2.2v.6c0 .4.4.8.8.8s.8-.4.8-.8v-.7c0-2.4-2.3-4.4-4.9-3.8z\"></path></g></svg>"

/***/ }),

/***/ 453:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 14 14\" viewBox=\"0 0 14 14\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\" transform=\"matrix(0 1 -1 0 20 0)\"><path d=\"m7.699 8.591 1.05 1.05c.49.49 1.05 0 1.05 0s .49-.56 0-1.05l-2.31-2.381c-.28-.28-.7-.28-.98 0l-2.309 2.451c-.49.49 0 .98 0 .98s.56.49 1.05 0l1.05-1.05v7.91c0 .42.35.7.7.7s.7-.35.7-.7z\"></path><path class=\"coveo-active-shape-svg\" d=\"m10.5 12.301h2.033l.065 6.301h-11.198v-6.301h2.1c.386 0 .7-.314.7-.7l0 0c0-.386-.314-.7-.7-.7h-2.806c-.383-.001-.694.31-.694.694v7.706c0 .385.318.699.694.699h12.607c.384 0 .699-.315.699-.699v-7.7c0-.386-.316-.699-.694-.699h-2.806c-.386 0-.7.314-.7.7l0 0c0 .385.314.699.7.699z\"></path></g></svg>"

/***/ }),

/***/ 454:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 12\" viewBox=\"0 0 15 12\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m9.224 11.999c-.198 0-.496-.103-.694-.308-.397-.411-.397-1.025 0-1.436l3.965-4.409-3.966-4.102c-.397-.411-.397-1.025 0-1.436s.991-.411 1.388 0l4.859 4.922c.298.308.298.718 0 1.025l-4.859 5.435c-.198.206-.496.309-.693.309\"></path><path class=\"coveo-active-shape-svg\" d=\"m4.958.411c-.397-.411-.991-.411-1.388 0s-.397 1.025 0 1.436l2.973 2.974h-5.552c-.594 0-.991.41-.991 1.025s.397 1.025.991 1.025h5.651l-3.074 3.384c-.397.411-.397 1.025 0 1.436.199.206.398.309.695.309.298 0 .495-.103.694-.308l4.859-5.333c.298-.308.298-.718 0-1.025z\"></path></g></svg>"

/***/ }),

/***/ 455:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m14 2v12h-11.999v-12zm1.306-2h-14.607c-.386 0-.699.318-.699.694v14.607c0 .384.315.699.699.699h14.602c.385 0 .699-.316.699-.694v-14.612c0-.383-.311-.694-.694-.694z\"></path><path d=\"m10.969 9.055h-5.939c-.569 0-1.032-.448-1.032-1s .462-1 1.032-1h5.938c.57 0 1.032.448 1.032 1 .001.552-.46 1-1.031 1\"></path></g></svg>"

/***/ }),

/***/ 456:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m14 2v12h-12v-12zm1.306-2h-14.607c-.386 0-.699.318-.699.694v14.607c0 .384.315.699.699.699h14.602c.385 0 .699-.316.699-.694v-14.612c0-.383-.311-.694-.694-.694z\"></path><path d=\"m10.969 7.055h-1.97v-1.968c0-.571-.448-1.032-1-1.032s-1 .462-1 1.032v1.969h-1.969c-.57 0-1.032.448-1.032 1s .463 1 1.032 1h1.97v1.969c0 .57.448 1.032 1 1.032s1-.463 1-1.032v-1.97h1.969c.571 0 1.032-.448 1.032-1 .001-.552-.462-1-1.032-1z\"></path></g></svg>"

/***/ }),

/***/ 457:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 22 22\" viewBox=\"0 0 22 22\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m12.989 21.947h-3.978c-.752 0-1.388-.557-1.48-1.295l-.298-2.075c-.309-.154-.611-.33-.905-.526l-1.968.79c-.722.268-1.508-.028-1.858-.668l-1.977-3.419c-.366-.671-.207-1.47.365-1.922l1.669-1.306c-.013-.186-.019-.359-.019-.526s.006-.34.02-.526l-1.665-1.303c-.586-.462-.742-1.292-.365-1.932l1.985-3.434c.343-.633 1.136-.923 1.836-.65l1.98.796c.3-.2.6-.375.901-.527l.301-2.096c.089-.719.726-1.275 1.478-1.275h3.979c.753 0 1.39.557 1.479 1.296l.298 2.074c.31.154.611.33.905.526l1.968-.791c.721-.263 1.508.028 1.857.667l1.979 3.421c.365.671.207 1.47-.365 1.922l-1.669 1.305c.012.166.02.342.02.527s-.008.361-.02.526l1.665 1.302c.576.457.734 1.256.381 1.903l-2 3.463c-.35.636-1.146.922-1.84.649l-1.978-.794c-.301.199-.6.374-.902.526l-.3 2.095c-.088.72-.725 1.277-1.478 1.277m-3.539-2h3.1l.396-2.762.529-.217c.485-.2.964-.478 1.461-.851l.45-.337 2.585 1.038 1.554-2.688-2.198-1.718.071-.563c.035-.277.062-.555.062-.85s-.027-.572-.062-.85l-.071-.563 2.198-1.718-1.555-2.688-2.592 1.042-.452-.348c-.466-.358-.94-.633-1.451-.843l-.529-.217-.396-2.761h-3.1l-.396 2.762-.53.217c-.485.199-.962.477-1.46.85l-.451.337-2.584-1.038-1.554 2.688 2.196 1.718-.07.562c-.034.277-.061.564-.061.851s.027.573.062.852l.07.562-2.196 1.718 1.554 2.688 2.591-1.041.452.348c.465.356.939.632 1.452.843l.529.217z\"></path><path d=\"m11 15c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4m0-6c-1.103 0-2 .897-2 2s .897 2 2 2 2-.897 2-2-.897-2-2-2\"></path></g></svg>"

/***/ }),

/***/ 458:
/***/ (function(module, exports) {

module.exports = "<svg viewBox=\"0 0 18 14\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path class=\"coveo-active-shape-svg\" d=\"m12.1 13.5c-.426 0-.771-.332-.771-.74 0-.409.346-.74.771-.74h1.862c1.374 0 2.49-1.136 2.49-2.534v-.193c0-1.144-.756-2.15-1.839-2.448l-.488-.134-.066-.484c-.132-.979-1.11-1.673-2.041-1.458l-.635.143-.253-.578c-.626-1.429-2.024-2.352-3.562-2.352-2.147 0-3.892 1.769-3.892 3.944 0 .082.002.164.007.246l.032.541-.529.192c-.986.359-1.65 1.319-1.65 2.388v.192c0 1.398 1.117 2.535 2.49 2.535h.782c.426 0 .771.332.771.74 0 .409-.346.74-.771.74h-.782c-2.224 0-4.03-1.802-4.03-4.02v-.192c0-1.496.842-2.861 2.143-3.549.097-2.908 2.496-5.243 5.432-5.243 1.968 0 3.767 1.061 4.726 2.747 1.501-.024 2.798.945 3.198 2.327 1.495.61 2.501 2.077 2.501 3.717v.193c0 2.215-1.808 4.02-4.03 4.02h-1.863\"></path><path d=\"m9 5.234c-.098-.149-.3-.233-.511-.234-.212 0-.413.084-.561.232l-3.193 3.176c-.311.309-.312.812-.003 1.123.155.156.359.233.563.233.202 0 .406-.076.56-.231l1.822-1.813v5.485c0 .438.356.794.794.794.438 0 .794-.356.794-.794v-5.504l1.82 1.83c.309.311.812.312 1.122.002.31-.309.312-.812.002-1.123l-3.21-3.176\"></path></g></svg>"

/***/ }),

/***/ 459:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m8.01 0c-4.425 0-8.01 3.581-8.01 7.992 0 4.425 3.581 8.01 7.999 8.01l.003-.003c4.417 0 7.999-3.581 7.999-7.999 0-4.417-3.581-7.999-7.992-7.999m.002 1.5c3.58 0 6.493 2.916 6.493 6.5s-2.916 6.5-6.5 6.5h-.172c-3.506-.09-6.331-2.975-6.331-6.508 0-3.58 2.92-6.493 6.51-6.492\"></path><path d=\"m11.04 10.27c-.192 0-.384-.073-.53-.22l-2.51-2.51-2.51 2.51c-.293.293-.768.293-1.061 0s-.293-.768 0-1.061l3.041-3.04c.141-.14.332-.219.53-.219l0 0c .199 0 .39.079.53.22l3.04 3.041c.293.293.293.768 0 1.061-.146.145-.337.218-.53.218z\"></path></g></svg>"

/***/ }),

/***/ 460:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m7.991 16.002c4.425 0 8.01-3.581 8.01-7.992 0-4.425-3.581-8.01-7.999-8.01l-.003.003c-4.417 0-7.999 3.581-7.999 7.999 0 4.417 3.581 7.999 7.992 7.999m-.002-1.5c-3.58 0-6.493-2.916-6.493-6.5s2.916-6.5 6.5-6.5h.172c3.506.09 6.331 2.975 6.331 6.508 0 3.58-2.92 6.493-6.51 6.493\"></path><path d=\"m4.961 5.732c.192 0 .384.073.53.22l2.51 2.51 2.51-2.51c.293-.293.768-.293 1.061 0s .293.768 0 1.061l-3.041 3.04c-.141.14-.332.219-.53.219l0 0c-.199 0-.39-.079-.53-.22l-3.04-3.041c-.293-.293-.293-.768 0-1.061.146-.145.337-.218.53-.218z\"></path></g></svg>"

/***/ }),

/***/ 461:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 18 18\" viewBox=\"0 0 18 18\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m16.76 8.051c-.448 0-.855-.303-.969-.757-.78-3.117-3.573-5.294-6.791-5.294s-6.01 2.177-6.79 5.294c-.134.537-.679.861-1.213.727-.536-.134-.861-.677-.728-1.212 1.004-4.009 4.594-6.809 8.731-6.809 4.138 0 7.728 2.8 8.73 6.809.135.536-.191 1.079-.727 1.213-.081.02-.162.029-.243.029z\"></path><path d=\"m9 18c-4.238 0-7.943-3.007-8.809-7.149-.113-.541.234-1.071.774-1.184.541-.112 1.071.232 1.184.773.674 3.222 3.555 5.56 6.851 5.56s6.178-2.338 6.852-5.56c.113-.539.634-.892 1.184-.773.54.112.887.643.773 1.184-.866 4.142-4.57 7.149-8.809 7.149z\"></path></g></svg>"

/***/ }),

/***/ 462:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 13 13\" viewBox=\"0 0 13 13\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m7.881 6.501 4.834-4.834c.38-.38.38-1.001 0-1.381s-1.001-.38-1.381 0l-4.834 4.834-4.834-4.835c-.38-.38-1.001-.38-1.381 0s-.38 1.001 0 1.381l4.834 4.834-4.834 4.834c-.38.38-.38 1.001 0 1.381s1.001.38 1.381 0l4.834-4.834 4.834 4.834c.38.38 1.001.38 1.381 0s .38-1.001 0-1.381z\"></path></g></svg>"

/***/ }),

/***/ 463:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-more-background-svg\" fill-opacity=\"0\" d=\"m8.03.819c3.987 0 7.227 3.222 7.227 7.181s-3.239 7.181-7.227 7.181c-3.976 0-7.209-3.222-7.209-7.181s3.237-7.181 7.209-7.181\"></path><path d=\"m0 8c0 4.416 3.572 8 7.991 8 4.425 0 8.009-3.581 8.009-8 0-4.416-3.581-8-8.009-8-4.416 0-7.991 3.581-7.991 8m8.031-6.4c3.553 0 6.441 2.872 6.441 6.4s-2.887 6.4-6.441 6.4c-3.544 0-6.425-2.872-6.425-6.4s2.885-6.4 6.425-6.4\"></path><path d=\"m10.988 9.024c.551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path><path d=\"m7.991 9c .551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path><path d=\"m4.994 9c .551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path></g></svg>"

/***/ }),

/***/ 464:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 18 18\" viewBox=\"0 0 18 18\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-and-svg\" d=\"m13.769 5.294h-1.063v-1.063c0-2.329-1.894-4.231-4.231-4.231h-4.244c-2.329 0-4.231 1.894-4.231 4.231v4.244c0 2.329 1.894 4.231 4.231 4.231h1.063v1.063c0 2.329 1.894 4.231 4.231 4.231h4.244c2.329 0 4.231-1.894 4.231-4.231v-4.244c0-2.329-1.894-4.231-4.231-4.231zm2.731 8.475c0 1.506-1.225 2.731-2.731 2.731h-4.244c-1.506 0-2.731-1.225-2.731-2.731v-2.563h-2.563c-1.506 0-2.731-1.225-2.731-2.731v-4.244c0-1.506 1.225-2.731 2.731-2.731h4.244c1.506 0 2.731 1.225 2.731 2.731v2.563h2.563c1.506 0 2.731 1.225 2.731 2.731z\"></path><path class=\"coveo-or-svg\" d=\"m11.206 6.794v1.909c0 1.38-1.123 2.503-2.503 2.503h-1.909v-1.909c0-1.38 1.123-2.503 2.503-2.503zm1.5-1.5h-3.409c-2.209 0-4.003 1.792-4.003 4.003v3.409h3.409c2.209 0 4.003-1.792 4.003-4.003z\"></path></g></svg>"

/***/ }),

/***/ 465:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 20 20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-magnifier-circle-svg\" d=\"m8.368 16.736c-4.614 0-8.368-3.754-8.368-8.368s3.754-8.368 8.368-8.368 8.368 3.754 8.368 8.368-3.754 8.368-8.368 8.368m0-14.161c-3.195 0-5.793 2.599-5.793 5.793s2.599 5.793 5.793 5.793 5.793-2.599 5.793-5.793-2.599-5.793-5.793-5.793\"></path><path d=\"m18.713 20c-.329 0-.659-.126-.91-.377l-4.552-4.551c-.503-.503-.503-1.318 0-1.82.503-.503 1.318-.503 1.82 0l4.552 4.551c.503.503.503 1.318 0 1.82-.252.251-.581.377-.91.377\"></path></g></svg>"

/***/ }),

/***/ 466:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 14\" viewBox=\"0 0 15 14\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m13.002 4.076 0 0c0 .536-.439.975-.975.975h-2.925c-.536 0-.975-.439-.975-.975l0 0c0-.536.439-.975.975-.975h2.925c.537 0 .975.438.975.975z\"></path><path class=\"coveo-active-shape-svg\" d=\"m13.002 9.925 0 0c0 .536-.439.975-.975.975h-2.925c-.536 0-.975-.439-.975-.975l0 0c0-.536.439-.975.975-.975h2.925c.537 0 .975.439.975.975z\"></path><path class=\"coveo-active-shape-svg\" d=\"m15 7 0 0c0 .536-.439.975-.975.975h-4.923c-.536 0-.974-.438-.974-.975l0 0c0-.536.439-.975.975-.975h4.923c.535.001.974.439.974.975z\"></path><path d=\"m4.956 9.837-.671.671v-7.015l.671.671c.381.381.997.381 1.379 0 .381-.38.381-.997 0-1.379l-2.335-2.336c-.183-.184-.431-.286-.69-.286s-.506.102-.689.286l-2.335 2.336c-.381.381-.381.997 0 1.379s.997.381 1.379 0l .671-.671v7.015l-.671-.671c-.381-.381-.997-.381-1.379 0-.381.38-.381.997 0 1.379l2.335 2.336c.182.183.431.286.689.286s.506-.103.69-.287l2.335-2.336c.381-.381.381-.997 0-1.379-.382-.381-.998-.381-1.379.001z\"></path></g></svg>"

/***/ }),

/***/ 475:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 482:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 598:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 99:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
__webpack_require__(475);
var GlobalExports_1 = __webpack_require__(4);
/**
 * A simple `fieldset` HTMLElement containing multiple form widgets.
 */
var FormGroup = (function () {
    /**
     * Creates a new `FormGroup`.
     * @param contents The form widgets to include in the form group.
     * @param label The label to display for the form group.
     */
    function FormGroup(contents, label) {
        var _this = this;
        this.element = Dom_1.$$('fieldset', { className: 'coveo-form-group' }, Dom_1.$$('span', { className: 'coveo-form-group-label' }, label));
        _.each(contents, function (content) {
            _this.element.append(content.build());
        });
    }
    FormGroup.doExport = function () {
        GlobalExports_1.exportGlobally({
            'FormGroup': FormGroup
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


/***/ })

});
//# sourceMappingURL=ResultsFiltersPreferences.js.map