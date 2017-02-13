import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { KEYBOARD } from '../../utils/KeyboardUtils';
import { PreferencesPanel } from '../PreferencesPanel/PreferencesPanel';
import { PreferencesPanelCheckboxInput, PreferencesPanelTextAreaInput, PreferencePanelMultiSelectInput, IPreferencePanelInputToBuild } from '../PreferencesPanel/PreferencesPanelItem';
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
import _ = require('underscore');

export interface IResultFilterPreference {
  selected?: boolean;
  custom?: boolean;
  tab?: string[];
  caption: string;
  expression: string;
}

export interface IResultsFiltersPreferencesOptions {
  filters?: {
    [caption: string]: { expression: string; tab?: string[]; };
  };
  includeInBreadcrumb?: boolean;
  showAdvancedFilters?: boolean;
}

/**
 * The ResultFiltersPreferences component allows the end user to create custom filters to apply to queries. These
 * filters are saved in the local storage of the end user.
 *
 * Only advanced end users who understand the Coveo query syntax should actually use this feature (see
 * [Coveo Query Sytax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
 *
 * This component is normally accessible through the {@link Settings} menu. Its usual location in the DOM is inside the
 * {@link PreferencesPanel} component.
 *
 * See also the {@link ResultsPreferences} component.
 */
export class ResultsFiltersPreferences extends Component {
  static ID = 'ResultsFiltersPreferences';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IResultsFiltersPreferencesOptions = {

    /**
     * Specifies whether to include the active filter(s) in the {@link Breadcrumb}.
     *
     * Default value is `true`.
     */
    includeInBreadcrumb: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to show the **Create** button that allows the end user to create filters.
     *
     * If you set this option to `false`, only the pre-populated {@link ResultsFiltersPreferences.options.filters} will
     * be available to the end user.
     *
     * Default value is `true`.
     */
    showAdvancedFilters: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies the default filters that all end users can apply.
     *
     * End users will not be able to modify or delete these filters. They do not count as "user-made" filters, but
     * rather as "built-in" filters created by the developer of the search page.
     *
     * You can only set this option in the `init` call of your search interface. You cannot set it directly in the
     * markup as an HTML attribute.
     *
     * Filters should follow this definition:
     *
     * `filters: { [caption: string]: { expression: string; tab?: string[]; } }`;
     *
     * **Example:**
     *
     * ```javascript
     * Coveo.init(document.querySelector('#search'), {
     *   ResultsFiltersPreferences : {
     *     filters : {
     *       "Only Google Drive Items" : {
     *         expression : "@connectortype == 'GoogleDriveCrawler'"
     *         tab: ['Tab1', 'Tab2'],
     *       },
     *       "Another Filter" : {
     *         expression : [ ... another expression ... ]
     *       },
     *       [ ... ]
     *     }
     *   }
     * });
     * ```
     *
     * Default value is `undefined`.
     */
    filters: <any>ComponentOptions.buildJsonOption()
  };

  public preferences: { [caption: string]: IResultFilterPreference };
  private preferencePanelLocalStorage: LocalStorageUtils<{ [caption: string]: IResultFilterPreference }>;
  private preferencePanel: HTMLElement;
  private preferenceContainer: HTMLElement;
  private preferencePanelCheckboxInput: PreferencesPanelCheckboxInput;
  private advancedFilters: HTMLElement;
  private advancedFiltersBuilder: HTMLElement;
  private advancedFiltersTextInputCaption: PreferencesPanelTextAreaInput;
  private advancedFiltersTextInputExpression: PreferencesPanelTextAreaInput;
  private advancedFiltersTabSelect: PreferencePanelMultiSelectInput;
  private advancedFilterFormValidate: HTMLFormElement;

  /**
   * Creates a new ResultsFiltersPreferences component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ResultsFiltersPreferences component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: IResultsFiltersPreferencesOptions, public bindings: IComponentBindings) {
    super(element, ResultsFiltersPreferences.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, ResultsFiltersPreferences, options);

    this.preferencePanel = $$(this.element).closest(Component.computeCssClassName(PreferencesPanel));
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
    this.buildTitle();
    this.buildCheckboxesInput();
    if (this.options.showAdvancedFilters) {
      this.buildAdvancedFilters();
    }
  }

  public save() {
    this.fromCheckboxInputToPreferences();
    var toSave = _.omit(this.preferences, 'tab');
    this.logger.info('Saving preferences', toSave);
    this.preferencePanelLocalStorage.save(toSave);
  }

  public exitWithoutSave() {
    this.fromPreferencesToCheckboxInput();
  }

  private bindPreferencePanelEvent() {
    this.bind.on(this.preferencePanel, PreferencesPanelEvents.savePreferences, () => this.save());
    this.bind.on(this.preferencePanel, PreferencesPanelEvents.exitPreferencesWithoutSave, () => this.exitWithoutSave());
  }

  private bindBreadcrumbEvent() {
    if (this.options.includeInBreadcrumb) {
      this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) => this.handlePopulateBreadcrumb(args));
      this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.handleClearBreadcrumb());
    }
  }

  private bindQueryEvent() {
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    _.each(this.getActiveFilters(), (filter) => {
      args.queryBuilder.advancedExpression.add(filter.expression);
    });
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    var actives = this.getActiveFilters();
    if (Utils.isNonEmptyArray(actives)) {
      var container = $$('div', { className: 'coveo-results-filter-preferences-breadcrumb' });
      var title = $$('span', { className: 'coveo-title' });
      title.text(l('FiltersInYourPreferences') + ':');
      container.el.appendChild(title.el);

      var valuesContainer = $$('span', { className: 'coveo-values' });
      container.el.appendChild(valuesContainer.el);

      for (var i = 0; i < actives.length; i++) {
        if (i != 0) {
          var separator = $$('span', {
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
    _.each(this.getActiveFilters(), (filter) => {
      filter.selected = false;
    });
    this.fromPreferencesToCheckboxInput();
  }

  private buildTitle() {
    this.element.appendChild($$('div', {
      className: 'coveo-title'
    }, l('ResultsFilteringExpression')).el);
  }

  private buildAdvancedFilters() {
    this.advancedFilters = $$('div', { className: 'coveo-advanced-filters' }, l('Create')).el;
    this.buildAdvancedFilterInput();
    this.buildAdvancedFilterFormValidate();
    this.advancedFiltersBuilder = $$('div', { className: 'coveo-advanced-filters-builder' }).el;
    this.advancedFiltersBuilder.appendChild(this.advancedFilterFormValidate);
    $$(this.advancedFilters).on('click', () => this.openAdvancedFilterSectionOrSaveFilters());
    var onlineHelp = $$('a', {
      href: 'http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10006',
      className: 'coveo-online-help'
    }, '?');

    var title = $$(this.element).find('.coveo-title');

    onlineHelp.insertAfter(title);
    $$(this.advancedFilters).insertAfter(title);
    this.element.appendChild(this.advancedFiltersBuilder);
  }

  private buildAdvancedFilterInput() {
    this.advancedFiltersTextInputCaption = new PreferencesPanelTextAreaInput(<IPreferencePanelInputToBuild[]>[{
      label: l('Caption'),
      placeholder: l('EnterExpressionName'),
      otherAttribute: 'required'
    }], ResultsFiltersPreferences.ID + '-advanced-caption');
    this.advancedFiltersTextInputExpression = new PreferencesPanelTextAreaInput(<IPreferencePanelInputToBuild[]>[{
      label: l('Expression'),
      placeholder: l('EnterExpressionToFilterWith'),
      otherAttribute: 'required'
    }], ResultsFiltersPreferences.ID + '-advanced-expression');
    this.advancedFiltersTabSelect = new PreferencePanelMultiSelectInput({
      label: l('Tab'),
      placeholder: l('SelectTab')
    }, this.getAllTabs(), ResultsFiltersPreferences.ID + '-multiselect');
  }

  private buildAdvancedFilterFormValidate() {
    this.advancedFilterFormValidate = <HTMLFormElement>$$('form').el;

    var formSubmit = $$('input', {
      type: 'submit'
    });

    var saveFormButton = $$('span', {
      className: 'coveo-save'
    });

    var closeFormButton = $$('span', {
      className: 'coveo-close'
    });

    var saveAndCloseContainer = $$('div', {
      className: 'coveo-choice-container coveo-close-and-save'
    });

    saveAndCloseContainer.el.appendChild(saveFormButton.el);
    saveAndCloseContainer.el.appendChild(closeFormButton.el);

    var inputCaption = this.advancedFiltersTextInputCaption.build();
    $$(inputCaption).addClass('coveo-caption');

    var filtersTabSelect = this.advancedFiltersTabSelect.build();
    $$(filtersTabSelect).addClass('coveo-tab');

    var filtersExpression = this.advancedFiltersTextInputExpression.build();
    $$(filtersExpression).addClass('coveo-expression');

    _.each([inputCaption, filtersTabSelect, filtersExpression, saveAndCloseContainer.el, formSubmit.el], (el: HTMLElement) => {
      this.advancedFilterFormValidate.appendChild(el);
    });

    saveFormButton.on('click', () => {
      formSubmit.el.click();
    });
    closeFormButton.on('click', () => $$(this.advancedFiltersBuilder).toggleClass('coveo-active'));

    $$($$(this.advancedFilterFormValidate).find('textarea')).on('keyup', (e: KeyboardEvent) => {
      if (e.keyCode == KEYBOARD.ENTER) {
        formSubmit.trigger('click');
      }
    });

    $$(this.advancedFilterFormValidate).on('submit', (e: Event) => this.validateAndSaveAdvancedFilter(e));
  }

  private getAllTabs() {
    var tabRef = Component.getComponentRef('Tab');
    if (tabRef) {
      var tabsElement = $$(this.root).findAll('.' + Component.computeCssClassName(tabRef));
      return _.map(tabsElement, (tabElement: HTMLElement) => {
        let tab = <Tab>Component.get(tabElement);
        return tab.options.id;
      });
    }
  }

  private getPreferencesBoxInputToBuild(): IPreferencePanelInputToBuild[] {
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
    var toBuild = this.getPreferencesBoxInputToBuild();
    if (Utils.isNonEmptyArray(toBuild)) {
      this.preferencePanelCheckboxInput = new PreferencesPanelCheckboxInput(toBuild, ResultsFiltersPreferences.ID);
      this.preferenceContainer = $$('div', {
        className: 'coveo-choices-container'
      }).el;
      this.preferenceContainer.appendChild(this.preferencePanelCheckboxInput.build());

      _.each($$(this.preferenceContainer).findAll('.coveo-choice-container'), (choiceContainer: HTMLElement) => {
        choiceContainer.appendChild($$('div', { className: 'coveo-section coveo-section-edit-delete' }).el);
      });

      $$(this.element).append(this.preferenceContainer);
      this.buildEditAdvancedFilter();
      this.buildDeleteAdvancedFilter();
      this.fromPreferencesToCheckboxInput();
      _.each($$(this.preferenceContainer).findAll('input'), (input: HTMLElement) => {
        $$(input).on('change', (e: Event) => {
          this.save();
          var target: HTMLInputElement = <HTMLInputElement>e.target;
          var filter = this.preferences[target.value];
          this.fromFilterToAnalyticsEvent(filter, filter.selected ? 'selected' : 'unselected');
          this.queryController.executeQuery();
        });
      });
    }
  }

  private buildDeleteAdvancedFilter() {
    _.each(this.preferences, (filter) => {
      if (filter.custom) {
        var deleteElement = $$('span', {
          className: 'coveo-delete'
        }, $$('span', {
          className: 'coveo-icon'
        }).el).el;
        var filterElement = this.getFilterElementByCaption(filter.caption);
        var insertInto = $$($$(filterElement).closest('coveo-section').parentElement).find('.coveo-section-edit-delete');
        insertInto.appendChild(deleteElement);
        $$(deleteElement).on('click', () => this.confirmDelete(filter, filterElement));
      }
    });
  }

  private buildEditAdvancedFilter() {
    _.each(this.preferences, (filter) => {
      if (filter.custom) {
        var editElement = $$('span', {
          className: 'coveo-edit'
        }, $$('span', { className: 'coveo-icon' }));
        var filterElement = this.getFilterElementByCaption(filter.caption);
        var insertInto = $$($$(filterElement).closest('coveo-section').parentElement).find('.coveo-section-edit-delete');
        insertInto.appendChild(editElement.el);
        editElement.on('click', () => this.editElement(filter, filterElement));
      }
    });
  }

  private buildBreadcrumb(filter: IResultFilterPreference): HTMLElement {
    var elem = $$('span', { className: 'coveo-value' });

    var caption = $$('span', { className: 'coveo-caption' });
    caption.text(filter.caption);
    elem.el.appendChild(caption.el);

    var clear = $$('span', { className: 'coveo-clear' });
    elem.el.appendChild(clear.el);

    elem.on('click', () => {
      filter.selected = false;
      this.fromFilterToAnalyticsEvent(filter, 'cleared from breadcrumb');
      this.fromPreferencesToCheckboxInput();
      this.queryController.executeQuery();
    });

    return elem.el;
  }

  private confirmDelete(filter: IResultFilterPreference, filterElement: HTMLElement) {
    if (confirm(l('AreYouSureDeleteFilter', filter.caption, filter.expression))) {
      var isSelected = filter.selected;
      this.deleteFilterPreference(filter, filterElement);
      if (isSelected) {
        this.fromFilterToAnalyticsEvent(filter, 'deleted');
        this.queryController.executeQuery();
      }
    }
  }

  private editElement(filter: IResultFilterPreference, filterElement: HTMLElement) {
    var oldCaption = this.preferences[filter.caption].caption;
    var oldTab = this.preferences[filter.caption].tab;
    var oldExpression = this.preferences[filter.caption].expression;
    this.deleteFilterPreference(filter, filterElement);
    this.openAdvancedFilterSectionOrSaveFilters();
    this.populateEditSection({ tab: oldTab, caption: oldCaption, expression: oldExpression });
  }

  private populateEditSection(toPopulate = { tab: [''], caption: '', expression: '' }) {
    this.advancedFiltersTextInputCaption.setValue(l('Caption'), toPopulate.caption);
    this.advancedFiltersTextInputExpression.setValue(l('Expression'), toPopulate.expression);
    this.advancedFiltersTabSelect.setValues(toPopulate.tab);
  }

  private deleteFilterPreference(filter: IResultFilterPreference, filterElement: HTMLElement) {
    this.preferencePanelLocalStorage.remove(filter.caption);
    delete this.preferences[filter.caption];
    $$($$(filterElement).closest('.coveo-choice-container')).detach();
  }

  private openAdvancedFilterSectionOrSaveFilters() {
    if ($$(this.advancedFiltersBuilder).hasClass('coveo-active')) {
      $$($$(this.advancedFilterFormValidate).find('input[type=submit]')).trigger('click');
    } else {
      this.populateEditSection();
      $$(this.advancedFiltersBuilder).toggleClass('coveo-active');
    }
  }

  private validateAndSaveAdvancedFilter(e: Event) {
    e.preventDefault();
    $$(this.advancedFiltersBuilder).removeClass('coveo-active');
    var caption = this.advancedFiltersTextInputCaption.getValues()[0];
    var expression = this.advancedFiltersTextInputExpression.getValues()[0];
    var tabs = this.advancedFiltersTabSelect.getValues();
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
    this.element.appendChild(this.advancedFiltersBuilder);
    this.fromFilterToAnalyticsEvent(this.preferences[caption], 'saved');
    this.queryController.executeQuery();
  }

  private fromPreferencesToCheckboxInput() {
    _.each(this.getActiveFilters(), (filter: IResultFilterPreference) => {
      this.preferencePanelCheckboxInput.select(filter.caption);
    });
    _.each(this.getInactiveFilters(), (filter: IResultFilterPreference) => {
      this.preferencePanelCheckboxInput.unselect(filter.caption);
    });
    _.each(this.getDormantFilters(), (filter: IResultFilterPreference) => {
      this.preferencePanelCheckboxInput.select(filter.caption);
    });
  }

  private fromCheckboxInputToPreferences() {
    var selecteds = this.preferencePanelCheckboxInput.getSelecteds();
    _.each(this.preferences, (filter: IResultFilterPreference) => {
      if (_.contains(selecteds, filter.caption)) {
        filter.selected = true;
      } else {
        filter.selected = false;
      }
    });
  }

  private getDormantFilters() {
    var activeTab = this.getActiveTab();
    return _.filter(this.preferences, (filter: IResultFilterPreference) => {
      return filter.selected && !this.filterIsInActiveTab(filter, activeTab);
    });
  }

  private getActiveFilters() {
    var activeTab = this.getActiveTab();
    return _.filter(this.preferences, (filter: IResultFilterPreference) => {
      return filter.selected && this.filterIsInActiveTab(filter, activeTab);
    });
  }

  private getInactiveFilters() {
    var activeTab = this.getActiveTab();
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
    return $$(this.preferenceContainer).find('input[value=\'' + caption + '\']').parentElement;
  }

  private fromResultsFilterOptionToResultsPreferenceInterface() {
    var ret: { [key: string]: IResultFilterPreference } = {};
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
    var staticPreferences = this.fromResultsFilterOptionToResultsPreferenceInterface();
    var localPreferences = this.preferencePanelLocalStorage.load();
    var localPreferencesWithoutRemoved = _.filter<IResultFilterPreference>(localPreferences, (preference) => {
      var isCustom = preference.custom;
      var existsInStatic = _.find<IResultFilterPreference>(staticPreferences, (staticPreference) => {
        return staticPreference.caption == preference.caption;
      });
      return isCustom || existsInStatic != undefined;
    });

    var localToMerge = {};
    _.each(localPreferencesWithoutRemoved, (filter: IResultFilterPreference) => {
      localToMerge[filter.caption] = {
        expression: filter.expression,
        tab: filter.tab,
        selected: filter.selected,
        custom: filter.custom,
        caption: filter.caption
      };
    });
    this.preferences = <{ [caption: string]: IResultFilterPreference; }>Utils.extendDeep(staticPreferences, localToMerge);
  }

  private fromFilterToAnalyticsEvent(filter: IResultFilterPreference, type: string) {
    this.usageAnalytics.logSearchEvent<IAnalyticsCustomFiltersChangeMeta>(analyticsActionCauseList.customfiltersChange, {
      customFilterName: filter.caption,
      customFilterExpression: filter.expression,
      customFilterType: type
    });
  }
}

Initialization.registerAutoCreateComponent(ResultsFiltersPreferences);
