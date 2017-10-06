import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { InitializationEvents } from '../../events/InitializationEvents';
import { PreferencesPanelEvents } from '../../events/PreferencesPanelEvents';
import { MODEL_EVENTS } from '../../models/Model';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { QueryStateModel, QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { analyticsActionCauseList, IAnalyticsCustomFiltersChangeMeta } from '../Analytics/AnalyticsActionListMeta';
import { Tab } from '../Tab/Tab';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import { Utils } from '../../utils/Utils';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

import 'styling/_ResultsFiltersPreferences';
import { Checkbox } from '../FormWidgets/Checkbox';
import { TextInput } from '../FormWidgets/TextInput';
import { MultiSelect } from '../FormWidgets/MultiSelect';
import { FormGroup } from '../FormWidgets/FormGroup';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface IResultFilterPreference {
  selected?: boolean;
  custom?: boolean;
  tab?: string[];
  caption: string;
  expression: string;
}

export interface IResultsFiltersPreferencesOptions {
  filters?: {
    [caption: string]: { expression: string; tab?: string[] };
  };
  includeInBreadcrumb?: boolean;
  showAdvancedFilters?: boolean;
}

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
export class ResultsFiltersPreferences extends Component {
  static ID = 'ResultsFiltersPreferences';

  static doExport = () => {
    exportGlobally({
      ResultsFiltersPreferences: ResultsFiltersPreferences
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IResultsFiltersPreferencesOptions = {
    /**
     * Specifies whether to display the active filter(s) in the [`Breadcrumb`]{@link Breadcrumb}.
     *
     * Default value is `true`.
     */
    includeInBreadcrumb: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to show the **Create** button that allows the end user to create filters.
     *
     * If you set this option to `false`, only the pre-populated
     * [`filters`]{@link ResultsFiltersPreferences.options.filters} are available to the end user.
     *
     * Default value is `true`.
     */
    showAdvancedFilters: ComponentOptions.buildBooleanOption({ defaultValue: true }),

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
    filters: <any>ComponentOptions.buildJsonOption()
  };

  public preferences: { [caption: string]: IResultFilterPreference };
  public container: HTMLFieldSetElement;
  private preferencePanelLocalStorage: LocalStorageUtils<{ [caption: string]: IResultFilterPreference }>;
  private preferencePanel: HTMLElement;
  private preferenceContainer: HTMLElement;
  private preferencePanelCheckboxInput: { [caption: string]: Checkbox } = {};
  private advancedFilters: HTMLElement;
  private advancedFiltersBuilder: HTMLElement;
  private advancedFiltersTextInputCaption: TextInput;
  private advancedFiltersTextInputExpression: TextInput;
  private advancedFiltersTabSelect: MultiSelect;
  private advancedFilterFormValidate: HTMLFormElement;

  /**
   * Creates a new `ResultsFiltersPreferences` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `ResultsFiltersPreferences` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: IResultsFiltersPreferencesOptions, public bindings: IComponentBindings) {
    super(element, ResultsFiltersPreferences.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, ResultsFiltersPreferences, options);

    this.preferencePanel = $$(this.element).closest(Component.computeCssClassNameForType('PreferencesPanel'));
    if (!this.preferencePanel) {
      this.logger.warn(`Cannot instantiate ResultsFilterPreferences, as there is no "CoveoPreferencesPanel" in your page !`);
      return;
    }
    this.preferencePanelLocalStorage = new LocalStorageUtils<{ [caption: string]: IResultFilterPreference }>(ResultsFiltersPreferences.ID);
    this.mergeLocalPreferencesWithStaticPreferences();

    this.bindPreferencePanelEvent();
    this.bindBreadcrumbEvent();
    this.bindQueryEvent();

    // We need to wait after all components are initialized before building the dom, because this component interacts with Tab
    // And we don't know if Tab(s) are initialized before or after this component.
    this.bind.oneRootElement(InitializationEvents.afterComponentsInitialization, () => this.createDom());

    this.bind.oneQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.T, () => this.fromPreferencesToCheckboxInput());
  }

  public createDom() {
    this.container = <HTMLFieldSetElement>new FormGroup([], l('ResultsFilteringExpression')).build();
    this.element.appendChild(this.container);
    this.buildCheckboxesInput();
    if (this.options.showAdvancedFilters) {
      this.buildAdvancedFilters();
    }
  }

  public save() {
    this.fromCheckboxInputToPreferences();
    const toSave = _.omit(this.preferences, 'tab');
    this.logger.info('Saving preferences', toSave);
    this.preferencePanelLocalStorage.save(toSave);
  }

  public exitWithoutSave() {
    this.fromPreferencesToCheckboxInput();
    this.hideAdvancedFilterBuilder();
  }

  private bindPreferencePanelEvent() {
    this.bind.on(this.preferencePanel, PreferencesPanelEvents.savePreferences, () => this.save());
    this.bind.on(this.preferencePanel, PreferencesPanelEvents.exitPreferencesWithoutSave, () => this.exitWithoutSave());
  }

  private bindBreadcrumbEvent() {
    if (this.options.includeInBreadcrumb) {
      this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) =>
        this.handlePopulateBreadcrumb(args)
      );
      this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.handleClearBreadcrumb());
    }
  }

  private bindQueryEvent() {
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    _.each(this.getActiveFilters(), filter => {
      if (Utils.isNonEmptyString(filter.expression)) {
        args.queryBuilder.advancedExpression.add(filter.expression);
      }
    });
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    const actives = this.getActiveFilters();
    if (Utils.isNonEmptyArray(actives)) {
      const container = $$('div', { className: 'coveo-results-filter-preferences-breadcrumb' });
      const title = $$('span', { className: 'coveo-title' });
      title.text(l('FiltersInYourPreferences') + ':');
      container.el.appendChild(title.el);

      const valuesContainer = $$('span', { className: 'coveo-values' });
      container.el.appendChild(valuesContainer.el);

      for (var i = 0; i < actives.length; i++) {
        if (i != 0) {
          const separator = $$('span', {
            className: 'coveo-separator'
          });
          separator.text(', ');
          valuesContainer.el.appendChild(separator.el);
        }
        valuesContainer.el.appendChild(this.buildBreadcrumb(actives[i]));
      }
      args.breadcrumbs.push({ element: container.el });
    }
  }

  private handleClearBreadcrumb() {
    _.each(this.getActiveFilters(), filter => {
      filter.selected = false;
    });
    this.fromPreferencesToCheckboxInput();
  }

  private buildAdvancedFilters() {
    this.advancedFilters = $$('div', { className: 'coveo-advanced-filters' }, l('Create')).el;
    this.buildAdvancedFilterInput();
    this.buildAdvancedFilterFormValidate();
    this.advancedFiltersBuilder = $$('div', { className: 'coveo-advanced-filters-builder' }).el;
    this.advancedFiltersBuilder.appendChild(this.advancedFilterFormValidate);
    $$(this.advancedFilters).on('click', () => this.openAdvancedFilterSectionOrSaveFilters());
    const onlineHelp = $$(
      'a',
      {
        href: 'http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10006',
        className: 'coveo-online-help'
      },
      '?'
    );

    const title = $$(this.container).find('.coveo-form-group-label');

    onlineHelp.insertAfter(title);
    $$(this.advancedFilters).insertAfter(title);
    this.container.appendChild(this.advancedFiltersBuilder);
  }

  private buildAdvancedFilterInput() {
    this.advancedFiltersTextInputCaption = new TextInput(() => {}, l('Caption'));

    this.advancedFiltersTextInputCaption.getInput().setAttribute('required', '');

    this.advancedFiltersTextInputExpression = new TextInput(() => {}, l('Expression'));

    this.advancedFiltersTextInputExpression.getInput().setAttribute('required', '');

    this.advancedFiltersTabSelect = new MultiSelect(() => {}, this.getAllTabs(), l('Tab'));
  }

  private buildAdvancedFilterFormValidate() {
    this.advancedFilterFormValidate = <HTMLFormElement>$$('form').el;

    const formSubmit = $$('input', {
      type: 'submit'
    });

    const saveFormButton = $$(
      'span',
      {
        className: 'coveo-save'
      },
      SVGIcons.icons.checkboxHookExclusionMore
    );
    SVGDom.addClassToSVGInContainer(saveFormButton.el, 'coveo-save-svg');

    const closeFormButton = $$(
      'span',
      {
        className: 'coveo-close'
      },
      SVGIcons.icons.checkboxHookExclusionMore
    );
    SVGDom.addClassToSVGInContainer(closeFormButton.el, 'coveo-close-svg');

    const saveAndCloseContainer = $$('div', {
      className: 'coveo-choice-container coveo-close-and-save'
    });

    saveAndCloseContainer.el.appendChild(saveFormButton.el);
    saveAndCloseContainer.el.appendChild(closeFormButton.el);

    const inputCaption = this.advancedFiltersTextInputCaption.build();
    $$(inputCaption).addClass('coveo-caption');

    const filtersTabSelect = this.advancedFiltersTabSelect.build();
    $$(filtersTabSelect).addClass('coveo-tab');

    const filtersExpression = this.advancedFiltersTextInputExpression.build();
    $$(filtersExpression).addClass('coveo-expression');

    _.each([inputCaption, filtersExpression, filtersTabSelect, saveAndCloseContainer.el, formSubmit.el], (el: HTMLElement) => {
      this.advancedFilterFormValidate.appendChild(el);
    });

    saveFormButton.on('click', () => {
      formSubmit.el.click();
    });
    closeFormButton.on('click', () => {
      this.hideAdvancedFilterBuilder();
    });

    $$(this.advancedFilterFormValidate).on('submit', (e: Event) => this.validateAndSaveAdvancedFilter(e));
  }

  private getAllTabs() {
    const tabRef = Component.getComponentRef('Tab');
    if (tabRef) {
      const tabsElement = $$(this.root).findAll('.' + Component.computeCssClassName(tabRef));
      return _.map(tabsElement, (tabElement: HTMLElement) => {
        let tab = <Tab>Component.get(tabElement);
        return tab.options.id;
      });
    } else {
      return [];
    }
  }

  private getPreferencesBoxInputToBuild() {
    return _.map(this.preferences, (filter: IResultFilterPreference) => {
      return {
        label: filter.caption,
        tab: filter.tab,
        expression: filter.expression
      };
    });
  }

  private buildCheckboxesInput() {
    if (this.preferenceContainer != undefined) {
      this.preferenceContainer.remove();
    }
    const toBuild = this.getPreferencesBoxInputToBuild();
    if (Utils.isNonEmptyArray(toBuild)) {
      this.preferenceContainer = $$('div', {
        className: 'coveo-choices-container'
      }).el;

      _.each(toBuild, filterToBuild => {
        const checkbox = new Checkbox((checkbox: Checkbox) => {
          this.save();
          const filter = this.preferences[checkbox.getValue()];
          this.fromFilterToAnalyticsEvent(filter, filter.selected ? 'selected' : 'unselected');
          this.queryController.executeQuery({
            closeModalBox: false
          });
        }, filterToBuild.label);
        $$(checkbox.build()).addClass('coveo-choice-container');
        this.preferencePanelCheckboxInput[filterToBuild.label] = checkbox;
        this.preferenceContainer.appendChild(checkbox.getElement());
      });

      _.each($$(this.preferenceContainer).findAll('.coveo-choice-container'), (choiceContainer: HTMLElement) => {
        choiceContainer.appendChild($$('div', { className: 'coveo-section coveo-section-edit-delete' }).el);
      });

      $$(this.container).append(this.preferenceContainer);
      this.buildEditAdvancedFilter();
      this.buildDeleteAdvancedFilter();
      this.fromPreferencesToCheckboxInput();
    }
  }

  private buildDeleteAdvancedFilter() {
    _.each(this.preferences, filter => {
      if (filter.custom) {
        const deleteElement = $$(
          'span',
          {
            className: 'coveo-delete'
          },
          SVGIcons.icons.checkboxHookExclusionMore
        ).el;
        SVGDom.addClassToSVGInContainer(deleteElement, 'coveo-delete-svg');
        const filterElement = this.getFilterElementByCaption(filter.caption);
        const insertInto = $$(filterElement).find('.coveo-section-edit-delete');
        insertInto.appendChild(deleteElement);
        $$(deleteElement).on('click', () => this.confirmDelete(filter, filterElement));
      }
    });
  }

  private buildEditAdvancedFilter() {
    _.each(this.preferences, filter => {
      if (filter.custom) {
        const editElement = $$(
          'span',
          {
            className: 'coveo-edit'
          },
          SVGIcons.icons.edit
        );
        SVGDom.addClassToSVGInContainer(editElement.el, 'coveo-edit-svg');
        const filterElement = this.getFilterElementByCaption(filter.caption);
        const insertInto = $$(filterElement).find('.coveo-section-edit-delete');
        insertInto.appendChild(editElement.el);
        editElement.on('click', () => this.editElement(filter, filterElement));
      }
    });
  }

  private buildBreadcrumb(filter: IResultFilterPreference): HTMLElement {
    const elem = $$('span', { className: 'coveo-value' });

    const caption = $$('span', { className: 'coveo-caption' });
    caption.text(filter.caption);
    elem.el.appendChild(caption.el);

    const clear = $$('span', { className: 'coveo-clear' }, SVGIcons.icons.checkboxHookExclusionMore);
    SVGDom.addClassToSVGInContainer(clear.el, 'coveo-clear-svg');
    elem.el.appendChild(clear.el);

    elem.on('click', () => {
      filter.selected = false;
      this.fromFilterToAnalyticsEvent(filter, 'cleared from breadcrumb');
      this.fromPreferencesToCheckboxInput();
      this.queryController.executeQuery({
        closeModalBox: false
      });
    });

    return elem.el;
  }

  private confirmDelete(filter: IResultFilterPreference, filterElement: HTMLElement) {
    if (confirm(l('AreYouSureDeleteFilter', filter.caption, filter.expression))) {
      const isSelected = filter.selected;
      this.deleteFilterPreference(filter, filterElement);
      if (isSelected) {
        this.fromFilterToAnalyticsEvent(filter, 'deleted');
        this.queryController.executeQuery({
          closeModalBox: false
        });
      }
    }
  }

  private editElement(filter: IResultFilterPreference, filterElement: HTMLElement) {
    const oldCaption = this.preferences[filter.caption].caption;
    const oldTab = this.preferences[filter.caption].tab;
    const oldExpression = this.preferences[filter.caption].expression;
    this.deleteFilterPreference(filter, filterElement);
    this.openAdvancedFilterSectionOrSaveFilters();
    this.populateEditSection({ tab: oldTab, caption: oldCaption, expression: oldExpression });
  }

  private populateEditSection(toPopulate = { tab: [''], caption: '', expression: '' }) {
    this.advancedFiltersTextInputCaption.setValue(toPopulate.caption);
    this.advancedFiltersTextInputExpression.setValue(toPopulate.expression);
    this.advancedFiltersTabSelect.setValue(toPopulate.tab);
  }

  private deleteFilterPreference(filter: IResultFilterPreference, filterElement: HTMLElement) {
    this.preferencePanelLocalStorage.remove(filter.caption);
    delete this.preferences[filter.caption];
    $$($$(filterElement).closest('.coveo-choice-container')).detach();
  }

  private openAdvancedFilterSectionOrSaveFilters() {
    if ($$(this.advancedFiltersBuilder).hasClass('coveo-active')) {
      $$($$(this.advancedFilterFormValidate).find('input[type=submit]')).trigger('click');
      this.hideAdvancedFilterBuilder();
    } else {
      this.populateEditSection();
      this.showAdvancedFilterBuilder();
    }
  }

  private validateAndSaveAdvancedFilter(e: Event) {
    e.preventDefault();
    this.hideAdvancedFilterBuilder();
    const caption = this.advancedFiltersTextInputCaption.getValue();
    const expression = this.advancedFiltersTextInputExpression.getValue();
    const tabs = this.advancedFiltersTabSelect.getValue();
    this.preferences[caption] = {
      caption: caption,
      custom: true,
      expression: expression,
      tab: tabs,
      selected: true
    };
    this.buildCheckboxesInput();
    this.save();
    this.queryStateModel.set(QueryStateModel.attributesEnum.t, this.getActiveTab());
    this.advancedFiltersTextInputCaption.reset();
    this.advancedFiltersTextInputExpression.reset();
    this.advancedFiltersTabSelect.reset();
    this.container.appendChild(this.advancedFiltersBuilder);
    this.fromFilterToAnalyticsEvent(this.preferences[caption], 'saved');
    this.queryController.executeQuery({
      closeModalBox: false
    });
  }

  private fromPreferencesToCheckboxInput() {
    _.each(this.getActiveFilters(), (filter: IResultFilterPreference) => {
      this.preferencePanelCheckboxInput[filter.caption].select();
    });
    _.each(this.getInactiveFilters(), (filter: IResultFilterPreference) => {
      this.preferencePanelCheckboxInput[filter.caption].reset();
    });
    _.each(this.getDormantFilters(), (filter: IResultFilterPreference) => {
      this.preferencePanelCheckboxInput[filter.caption].select();
    });
  }

  private fromCheckboxInputToPreferences() {
    if (this.preferencePanelCheckboxInput) {
      const selecteds = _.map(
        _.filter(this.preferencePanelCheckboxInput, (checkbox: Checkbox) => checkbox.isSelected()),
        (selected: Checkbox) => selected.getValue()
      );
      _.each(this.preferences, (filter: IResultFilterPreference) => {
        if (_.contains(selecteds, filter.caption)) {
          filter.selected = true;
        } else {
          filter.selected = false;
        }
      });
    }
  }

  private getDormantFilters() {
    const activeTab = this.getActiveTab();
    return _.filter(this.preferences, (filter: IResultFilterPreference) => {
      return filter.selected && !this.filterIsInActiveTab(filter, activeTab);
    });
  }

  private getActiveFilters() {
    const activeTab = this.getActiveTab();
    return _.filter(this.preferences, (filter: IResultFilterPreference) => {
      return filter.selected && this.filterIsInActiveTab(filter, activeTab);
    });
  }

  private getInactiveFilters() {
    const activeTab = this.getActiveTab();
    return _.filter(this.preferences, (filter: IResultFilterPreference) => {
      return !filter.selected || !this.filterIsInActiveTab(filter, activeTab);
    });
  }

  private getActiveTab() {
    return this.queryStateModel.get(QueryStateModel.attributesEnum.t);
  }

  private filterIsInActiveTab(filter: IResultFilterPreference, tab: string) {
    filter.tab = _.compact(filter.tab);
    return _.contains(filter.tab, tab) || Utils.isEmptyArray(filter.tab);
  }

  private getFilterElementByCaption(caption: string): HTMLElement {
    return $$(this.preferenceContainer).find("input[value='" + caption + "']").parentElement;
  }

  private fromResultsFilterOptionToResultsPreferenceInterface() {
    const ret: { [key: string]: IResultFilterPreference } = {};
    _.each(<any>this.options.filters, (filter: { expression: string; tab?: string[]; selected?: boolean }, caption: string) => {
      ret[caption] = {
        expression: filter.expression,
        tab: filter.tab,
        selected: filter.selected ? filter.selected : false,
        custom: false,
        caption: caption
      };
    });
    return ret;
  }

  private mergeLocalPreferencesWithStaticPreferences() {
    const staticPreferences = this.fromResultsFilterOptionToResultsPreferenceInterface();
    const localPreferences = this.preferencePanelLocalStorage.load();
    const localPreferencesWithoutRemoved = _.filter<IResultFilterPreference>(localPreferences, preference => {
      const isCustom = preference.custom;
      const existsInStatic = _.find<IResultFilterPreference>(staticPreferences, staticPreference => {
        return staticPreference.caption == preference.caption;
      });
      return isCustom || existsInStatic != undefined;
    });

    const localToMerge = {};
    _.each(localPreferencesWithoutRemoved, (filter: IResultFilterPreference) => {
      localToMerge[filter.caption] = {
        expression: filter.expression,
        tab: filter.tab,
        selected: filter.selected,
        custom: filter.custom,
        caption: filter.caption
      };
    });
    this.preferences = <{ [caption: string]: IResultFilterPreference }>Utils.extendDeep(staticPreferences, localToMerge);
  }

  private fromFilterToAnalyticsEvent(filter: IResultFilterPreference, type: string) {
    this.usageAnalytics.logSearchEvent<IAnalyticsCustomFiltersChangeMeta>(analyticsActionCauseList.customfiltersChange, {
      customFilterName: filter.caption,
      customFilterExpression: filter.expression,
      customFilterType: type
    });
  }

  private enlargeModalBox() {
    const modalBoxContainer = $$(document.body).find('.coveo-modal-container');
    if (modalBoxContainer) {
      $$(modalBoxContainer).addClass('coveo-mod-big');
    }
  }

  private shrinkModalBox() {
    const modalBoxContainer = $$(document.body).find('.coveo-modal-container');
    if (modalBoxContainer) {
      $$(modalBoxContainer).removeClass('coveo-mod-big');
    }
  }

  private showAdvancedFilterBuilder() {
    if (this.advancedFiltersBuilder) {
      $$(this.advancedFiltersBuilder).addClass('coveo-active');
      this.enlargeModalBox();
    }
  }

  private hideAdvancedFilterBuilder() {
    if (this.advancedFiltersBuilder) {
      $$(this.advancedFiltersBuilder).removeClass('coveo-active');
      this.shrinkModalBox();
    }
  }
}

Initialization.registerAutoCreateComponent(ResultsFiltersPreferences);
