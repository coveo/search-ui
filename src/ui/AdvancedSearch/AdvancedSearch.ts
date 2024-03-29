import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { AdvancedSearchEvents } from '../../events/AdvancedSearchEvents';
import { SettingsEvents } from '../../events/SettingsEvents';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import {
  IAdvancedSearchInput,
  IAdvancedSearchPrebuiltInput,
  IAdvancedSearchSection,
  IExternalAdvancedSearchSection
} from './AdvancedSearchInput';
import { AdvancedSearchInputFactory } from './AdvancedSearchInputFactory';
import { IQueryOptions } from '../../controllers/QueryController';
import { IAnalyticsNoMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { QuerySummaryEvents } from '../../events/QuerySummaryEvents';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_AdvancedSearch';
import { NumericSpinner } from '../FormWidgets/NumericSpinner';
import { DatePicker } from '../FormWidgets/DatePicker';
import { Dropdown } from '../FormWidgets/Dropdown';
import { TextInput } from '../FormWidgets/TextInput';
import { RadioButton } from '../FormWidgets/RadioButton';
import { ModalBox as ModalBoxModule } from '../../ExternalModulesShim';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs, IClearBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { SVGIcons } from '../../utils/SVGIcons';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { getHeadingTag } from '../../utils/AccessibilityUtils';

export interface IAdvancedSearchOptions {
  includeKeywords?: boolean;
  includeDate?: boolean;
  includeDocument?: boolean;
}

/**
 * The `AdvancedSearch` component is meant to render a section in the [`Settings`]{@link Settings} menu to allow the end
 * user to easily create complex queries to send to the index.
 *
 * **Note:**
 * > You can write custom code to add new sections in the **Advanced Search** modal box generated by this component by
 * > attaching a handler to the [`buildingAdvancedSearch`]{@link AdvancedSearchEvents.buildingAdvancedSearch} event.
 *
 * @availablesince [October 2016 Release (v1.1550.5)](https://docs.coveo.com/en/309/#october-2016-release-v115505)
 */
export class AdvancedSearch extends Component {
  static ID = 'AdvancedSearch';

  static doExport = () => {
    exportGlobally({
      AdvancedSearch: AdvancedSearch,
      NumericSpinner: NumericSpinner,
      DatePicker: DatePicker,
      Dropdown: Dropdown,
      TextInput: TextInput,
      RadioButton: RadioButton
    });
  };

  /**
   * @componentOptions
   */
  static options: IAdvancedSearchOptions = {
    /**
     * Specifies whether to include the built-in **Keywords** section.
     *
     * Default value is `true`.
     */
    includeKeywords: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to include the built-in **Date** section.
     *
     * Default value is `true`.
     */
    includeDate: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to include the built-in **Document** section.
     *
     * Default value is `true`.
     */
    includeDocument: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  public inputs: IAdvancedSearchInput[] = [];
  public content: Dom;

  private inputFactory = new AdvancedSearchInputFactory(this.queryController.getEndpoint(), this.root);
  private externalSections: IExternalAdvancedSearchSection[] = [];
  private modalbox: Coveo.ModalBox.ModalBox;
  private needToPopulateBreadcrumb = false;
  // Used as an internal flag to determine if the component should execute the advanced search event
  // This flag is typically set to false when the breadcrumb is resetting, for example.
  // This is because the query will already be executed anyway from external code.
  // Without this, we might get analytics event being sent multiple time, or multiple query being triggered (which gets cancelled).
  private needToExecuteAdvancedSearch = true;
  /**
   * Creates a new `AdvancedSearch` component.
   *
   * Triggers the [`buildingAdvancedSearch`]{@link AdvancedSearchEvents.buildingAdvancedSearch} event.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `AdvancedSearch` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(
    public element: HTMLElement,
    public options?: IAdvancedSearchOptions,
    bindings?: IComponentBindings,
    private ModalBox = ModalBoxModule
  ) {
    super(element, AdvancedSearch.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, AdvancedSearch, options);
    this.bindEvents();
    this.buildContent();
  }

  /**
   * Launches the advanced search query.
   * If query returns successfully, also logs an `advancedSearch` event in the usage analytics (see
   * {@link Analytics.logSearchEvent}).
   */
  public executeAdvancedSearch() {
    if (this.needToExecuteAdvancedSearch) {
      this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.advancedSearch, {});
      this.queryController.executeQuery({
        closeModalBox: false
      });
    }
  }

  /**
   * Resets the state of all form inputs inside the `AdvancedSearch` component.
   */
  public reset() {
    _.each(this.inputs, input => {
      input.reset();
    });
  }

  /**
   * Opens the `AdvancedSearch` modal box.
   */
  public open() {
    if (this.modalbox == null) {
      this.modalbox = this.ModalBox.open(this.content.el, {
        sizeMod: 'big',
        title: l('AdvancedSearch'),
        className: 'coveo-advanced-search-modal',
        body: this.searchInterface.options.modalContainer
      });
    }
  }

  /**
   * Closes the `AdvancedSearch` modal box.
   */
  public close() {
    if (this.modalbox != null) {
      this.modalbox.close();
      this.modalbox = null;
    }
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    if (this.needToPopulateBreadcrumb) {
      const { container, title, clear } = this.buildBreadcrumbElements(args.headingLevel);

      container.append(title.el);
      container.append(clear.el);

      args.breadcrumbs.push({
        element: container.el
      });
    }
  }

  private buildBreadcrumbElements(headingLevel?: number) {
    return {
      container: this.buildBreadcrumbContainer(),
      title: this.buildBreadcrumbTitle(headingLevel),
      clear: this.buildBreacrumbClear()
    };
  }

  private buildBreadcrumbContainer() {
    return $$('div', {
      className: 'coveo-advanced-search-breadcrumb'
    });
  }

  private buildBreadcrumbTitle(headingLevel?: number) {
    return $$(
      getHeadingTag(headingLevel, 'span'),
      {
        className: 'coveo-advanced-search-breadcrumb-title'
      },
      `${l('FiltersInAdvancedSearch')}:`
    );
  }

  private buildBreacrumbClear() {
    const clear = $$(
      'span',
      {
        className: 'coveo-advanced-search-breadcrumb-clear'
      },
      SVGIcons.icons.mainClear
    );

    const selectAction = () => {
      this.handleClearBreadcrumb();
      this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.breadcrumbAdvancedSearch, {});
      this.queryController.executeQuery();
    };

    new AccessibleButton()
      .withElement(clear)
      .withLabel(l('Clear'))
      .withSelectAction(() => selectAction())
      .build();

    return clear;
  }

  private handleClearBreadcrumb() {
    if (this.needToPopulateBreadcrumb) {
      this.needToExecuteAdvancedSearch = false;
      this.reset();
      this.needToExecuteAdvancedSearch = true;
    }
  }

  private handleQuerySummaryCancelLastAction() {
    this.needToExecuteAdvancedSearch = false;
    this.reset();
    this.needToExecuteAdvancedSearch = true;
  }

  private handlePopulateMenu(args: ISettingsPopulateMenuArgs) {
    args.menuData.push({
      text: l('AdvancedSearch'),
      className: 'coveo-advanced-search',
      onOpen: () => this.open(),
      onClose: () => this.close(),
      svgIcon: SVGIcons.icons.dropdownPreferences,
      svgIconClassName: 'coveo-advanced-search-svg'
    });
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    const originalQuery = data.queryBuilder.build();
    _.each(this.externalSections, (section: IExternalAdvancedSearchSection) => {
      if (section.updateQuery) {
        section.updateQuery(<any>section.inputs, data.queryBuilder);
      }
    });
    _.each(this.inputs, input => {
      if (input.updateQuery) {
        input.updateQuery(data.queryBuilder);
      }
    });
    const modifiedQuery = data.queryBuilder.build();
    this.needToPopulateBreadcrumb = modifiedQuery.aq != originalQuery.aq;
  }

  private buildContent() {
    const component = $$('div');
    const inputSections: IAdvancedSearchSection[] = [];
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
    $$(this.root).trigger(AdvancedSearchEvents.buildingAdvancedSearch, {
      sections: this.externalSections,
      executeQuery: (options: IQueryOptions) => {
        options = _.extend({}, options, { closeModalBox: false });
        return this.queryController.executeQuery(options);
      }
    });

    _.each(this.externalSections, (section: IExternalAdvancedSearchSection) => {
      component.append(this.buildExternalSection(section));
    });

    _.each(inputSections, section => {
      component.append(this.buildInternalSection(section));
    });

    this.content = component;
  }

  private getKeywordsSection(): IAdvancedSearchSection {
    const sectionName = l('Keywords');
    const keywordsInputs = [];
    keywordsInputs.push(this.inputFactory.createAllKeywordsInput());
    keywordsInputs.push(this.inputFactory.createExactKeywordsInput());
    keywordsInputs.push(this.inputFactory.createAnyKeywordsInput());
    keywordsInputs.push(this.inputFactory.createNoneKeywordsInput());
    return { name: sectionName, inputs: keywordsInputs };
  }

  private getDateSection(): IAdvancedSearchSection {
    const sectionName = l('Date');
    const dateInputs = [];
    dateInputs.push(this.inputFactory.createAnytimeDateInput());
    dateInputs.push(this.inputFactory.createInTheLastDateInput());
    dateInputs.push(this.inputFactory.createBetweenDateInput());
    return { name: sectionName, inputs: dateInputs };
  }

  private getDocumentSection(): IAdvancedSearchSection {
    const sectionName = l('Document');
    const documentInputs = [];
    documentInputs.push(this.inputFactory.createSimpleFieldInput(l('FileType'), '@filetype'));
    documentInputs.push(this.inputFactory.createSimpleFieldInput(l('Language'), '@language'));
    documentInputs.push(this.inputFactory.createSizeInput());
    documentInputs.push(this.inputFactory.createAdvancedFieldInput(l('Title'), '@title'));
    documentInputs.push(this.inputFactory.createAdvancedFieldInput(l('Author'), '@author'));
    return { name: sectionName, inputs: documentInputs };
  }

  private buildExternalSection(section: IExternalAdvancedSearchSection): HTMLElement {
    const { el } = this.buildSectionTitle(section);
    this.inputs = _.union(this.inputs, <any>section.inputs);
    el.appendChild(section.content);
    return el;
  }

  private buildInternalSection(section: IAdvancedSearchSection): HTMLElement {
    const { el, id } = this.buildSectionTitle(section);
    const sectionInputs = [];
    _.each(section.inputs, input => {
      sectionInputs.push(this.buildDefaultInput(input));
    });
    this.inputs = _.union(this.inputs, sectionInputs);
    _.each(sectionInputs, input => {
      const built: HTMLElement = input.build();
      const inputElement = built.querySelector('input');
      if (inputElement) {
        inputElement.setAttribute('aria-labelledby', id);
      }

      $$(el).append(built);
    });

    return el;
  }

  private buildSectionTitle(section: IAdvancedSearchSection) {
    const sectionHTML = $$('div', { className: 'coveo-advanced-search-section' });
    const title = $$('div', { className: 'coveo-advanced-search-section-title' });

    title.text(section.name);
    const id = `coveo-advanced-search-section-${section.name}`;
    title.el.id = id;
    sectionHTML.append(title.el);
    return {
      el: sectionHTML.el,
      id
    };
  }

  private buildDefaultInput(input: IAdvancedSearchInput | IAdvancedSearchPrebuiltInput): IAdvancedSearchInput {
    if (this.isPrebuiltInput(input)) {
      return this.inputFactory.create(input.name, input.parameters);
    } else {
      return input;
    }
  }

  private isPrebuiltInput(input: IAdvancedSearchInput | IAdvancedSearchPrebuiltInput): input is IAdvancedSearchPrebuiltInput {
    return (<IAdvancedSearchPrebuiltInput>input).name !== undefined;
  }

  private bindEvents() {
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) =>
      this.handlePopulateBreadcrumb(args)
    );
    this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, (args: IClearBreadcrumbEventArgs) => this.handleClearBreadcrumb());
    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => this.handlePopulateMenu(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (data: IBuildingQueryEventArgs) => this.handleBuildingQuery(data));
    this.bind.onRootElement(AdvancedSearchEvents.executeAdvancedSearch, () => this.executeAdvancedSearch());
    this.bind.onRootElement(QuerySummaryEvents.cancelLastAction, () => this.handleQuerySummaryCancelLastAction());
  }
}

Initialization.registerAutoCreateComponent(AdvancedSearch);
