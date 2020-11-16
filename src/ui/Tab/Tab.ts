import 'styling/_Tab';
import { each, indexOf, map } from 'underscore';
import { InitializationEvents } from '../../events/InitializationEvents';
import { IBuildingQueryEventArgs, QueryEvents } from '../../events/QueryEvents';
import { exportGlobally } from '../../GlobalExports';
import { Assert } from '../../misc/Assert';
import { IAttributeChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { QueryStateModel, QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { SearchEndpoint } from '../../rest/SearchEndpoint';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { analyticsActionCauseList, IAnalyticsInterfaceChange } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IQueryExpression } from '../Base/IComponentOptions';
import { Initialization } from '../Base/Initialization';
import { ResponsiveTabs } from '../ResponsiveComponents/ResponsiveTabs';
import { ValidLayout } from '../ResultLayoutSelector/ValidLayout';

export interface ITabOptions {
  expression?: IQueryExpression;
  constant?: boolean;
  id?: string;
  icon?: string;
  caption?: string;
  sort?: string;
  layout?: string;
  endpoint?: SearchEndpoint;
  enableDuplicateFiltering?: boolean;
  pipeline?: string;
  maximumAge?: number;
  enableResponsiveMode?: boolean;
  dropdownHeaderLabel?: string;
}

/**
 * The Tab component renders a widget that allows the end user to select a specific search interface.
 *
 * This component attaches itself to a `div` element. It is in charge of adding an advanced expression to the outgoing
 * query in order to refine the results.
 *
 * The Tab component can also hide and show different parts of the UI. For each individual component in the UI, you can
 * specify whether you wish to include or exclude that component when the user selects a certain Tab (see [Using Components
 * Only on Specific Tabs](https://docs.coveo.com/en/508/javascript-search-framework/using-components-only-on-specific-tabs)).
 *
 * **Setting a New Endpoint for a Tab:**
 *
 * A Tab can use a custom endpoint when performing a query. Of course, you need to make sure that the endpoint exists in
 * the array of Coveo.SearchEndpoint.endpoints (see {@link SearchEndpoint.endpoints}).
 *
 * ```
 * Coveo.SearchEndpoint.endpoints["specialEndpoint"] = new Coveo.SearchEndpoint({
 *     restUri : 'https://somewhere.com/rest/search'
 * })
 *
 * [ ... ]
 *
 * <div class='CoveoTab' data-endpoint='specialEndpoint'></div>
 *
 * ```
 */
export class Tab extends Component {
  static ID = 'Tab';

  static doExport = () => {
    exportGlobally({
      Tab: Tab
    });
  };

  /**
   * The options for a Tab
   * @componentOptions
   */
  static options: ITabOptions = {
    /**
     * Specifies a unique ID for the Tab.
     *
     * Specifying a value for this option is necessary for this component to work.
     */
    id: ComponentOptions.buildStringOption({ required: true, section: 'Common Options' }),

    /**
     * Specifies the caption of the Tab.
     *
     * Specifying a value for this option is necessary for this component to work.
     */
    caption: ComponentOptions.buildLocalizedStringOption({ required: true, section: 'Common Options' }),

    /**
     * Specifies an icon to use for the Tab.
     *
     * @deprecated This options is mostly kept for legacy reasons. If possible, you should avoid using it.
     */
    icon: ComponentOptions.buildStringOption(),

    /**
     * Specifies an advanced expression or filter that the Tab should add to any outgoing query.
     *
     * **Example:**
     *
     * `@objecttype==Message`
     *
     * Default value is `undefined` and the Tab applies no additional expression or filter to the query.
     */
    expression: ComponentOptions.buildQueryExpressionOption({ section: 'Common Options' }),

    /**
     * Specifies the {@link SearchEndpoint} to point to when performing queries from within the Tab.
     *
     * By default, the Tab uses the "default" endpoint.
     */
    endpoint: ComponentOptions.buildCustomOption(endpoint => (endpoint != null ? SearchEndpoint.endpoints[endpoint] : null)),

    /**
     * Specifies the default sort criteria to use when selecting the Tab. A {@link Sort} component with the same
     * parameter needs to be present in the search interface in order for this option to function properly.
     *
     * **Examples:**
     *
     * - `data-sort='relevancy'`
     * - `data-sort='date descending'`
     *
     * Default value is `undefined` and the normal {@link Sort} component behavior applies.
     */
    sort: ComponentOptions.buildStringOption(),

    /**
     * Specifies the default layout to display when the user selects the Tab (see {@link ResultList.options.layout} and
     * {@link ResultLayout}).
     *
     * See the {@link ValidLayout} type for the list of possible values.
     *
     * If not specified, it will default to 'list'.
     *
     * See also [Result Layouts](https://docs.coveo.com/en/360/).
     *
     * Default value is `undefined` and the component selects the first available layout.
     */
    layout: ComponentOptions.buildStringOption<ValidLayout>(),

    /**
     * Specifies whether to include the {@link Tab.options.expression} in the constant part of the query.
     *
     * The index specially optimizes the constant part of the query to execute faster. However, you must be careful not
     * to include dynamic query expressions, otherwise the cache will lose its efficiency.
     *
     * Default value is `true`.
     */
    constant: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'Filtering' }),

    /**
     * Whether to filter out duplicates, so that items resembling one another only appear once in the query results.
     *
     * **Notes:**
     * - Two items must be at least 85% similar to one another to be considered duplicates.
     * - When a pair of duplicates is found, only the higher-ranked item of the two is kept in the result set.
     * - Enabling this feature can make the total result count less precise, as only the requested page of query results is submitted to duplicate filtering.
     * - The default value for this option can be modified through the {@link SearchInterface} component.
     */
    enableDuplicateFiltering: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies the name of the query pipeline to use for the queries when the Tab is selected.
     *
     * You can specify a value for this option if your index is in a Coveo Cloud organization in which pipelines have
     * been created (see [Adding and Managing Query Pipelines](https://docs.coveo.com/en/1791/)).
     *
     * Default value is `undefined`, which means that pipeline selection conditions defined in the Coveo Cloud
     * organization apply.
     */
    pipeline: ComponentOptions.buildStringOption(),

    /**
     * Specifies the maximum age (in milliseconds) that cached query results can have to still be usable as results
     * instead of performing a new query on the index from within the Tab. The cache is located in the Coveo Search API
     * (which resides between the index and the search interface).
     *
     * If cached results that are older than the age you specify in this option are available, a new query will be
     * performed on the index anyhow.
     *
     * On high-volume public web sites, specifying a higher value for this option can greatly improve query response
     * time at the cost of result freshness.
     *
     * **Note:**
     *
     * > It is also possible to set a maximum cache age for the entire {@link SearchInterface} rather than for a single
     * > Tab (see {@link SearchInterface.options.maximumAge}).
     *
     * Default value is `undefined` and the Coveo Search API determines the maximum cache age. This is typically
     * equivalent to 30 minutes (see [maximumAge](https://docs.coveo.com/en/1461/#RestQueryParameters-maximumAge)).
     */
    maximumAge: ComponentOptions.buildNumberOption(),

    /**
     * Specifies whether to enable responsive mode for tabs. Responsive mode makes overflowing tabs disappear, instead
     * making them available using a dropdown button. Responsive tabs are enabled either when tabs overflow or when the
     * width of the search interface becomes too small.
     *
     * Disabling responsive mode for one Tab also disables it for all tabs. Therefore, you only need to set this option
     * to `false` on one Tab to disable responsive mode.
     *
     * Default value is `true`.
     *
     * @availablesince [October 2016 Release (v1.1550.5)](https://docs.coveo.com/en/309/#october-2016-release-v115505)
     */
    enableResponsiveMode: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'ResponsiveOptions' }),

    /**
     * Specifies the label of the button that allows to show the hidden tabs when in responsive mode.
     *
     * If more than one Tab in the search interface specifies a value for this option, then the framework uses the first
     * occurrence of the option.
     *
     * The default value is `"More"`.
     */
    dropdownHeaderLabel: ComponentOptions.buildLocalizedStringOption({ section: 'ResponsiveOptions' })
  };

  /**
   * Creates a new Tab. Binds on buildingQuery event as well as an event on click of the element.
   * @param element The HTMLElement on which to instantiate the component. Normally a `div`.
   * @param options The options for the Tab component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: ITabOptions, bindings?: IComponentBindings) {
    super(element, Tab.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Tab, options);

    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(InitializationEvents.afterInitialization, () => this.handleAfterInitialization());
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.T, (args: IAttributeChangedEventArg) =>
      this.handleQueryStateChanged(args)
    );

    new AccessibleButton()
      .withElement(element)
      .withSelectAction(() => this.select())
      .withTitle(this.options.caption)
      .withOwner(this.bind)
      .build();

    this.render();
    ResponsiveTabs.init(this.root, this, this.options);
  }

  /**
   * Selects the current Tab.
   *
   * Also logs the `interfaceChange` event in the usage analytics with the new current {@link Tab.options.id} as metada
   * and triggers a new query.
   */
  public select() {
    if (!this.disabled) {
      const state = {
        t: this.options.id,
        sort: this.options.sort || QueryStateModel.defaultAttributes.sort
      } as any;

      if (this.options.layout) {
        state.layout = this.options.layout;
      }

      this.queryStateModel.setMultiple(state);

      this.usageAnalytics.logSearchEvent<IAnalyticsInterfaceChange>(analyticsActionCauseList.interfaceChange, {
        interfaceChangeTo: this.options.id
      });
      this.queryController.executeQuery();
    }
  }

  /**
   * Indicates whether the HTMLElement argument is included in the Tab. *Included* elements are shown when the Tab is
   * selected, whereas *excluded* elements are not.
   * @param element The HTMLElement to verify.
   * @returns {boolean} `true` if the HTMLElement is included in the Tab; `false` if it is excluded.
   */
  public isElementIncludedInTab(element: HTMLElement): boolean {
    Assert.exists(element);

    const includedTabs = this.splitListOfTabs(element.getAttribute('data-tab'));
    const excludedTabs = this.splitListOfTabs(element.getAttribute('data-tab-not'));
    Assert.check(
      !(includedTabs.length != 0 && excludedTabs.length != 0),
      'You cannot both explicitly include and exclude an element from tabs.'
    );

    return (
      (includedTabs.length != 0 && indexOf(includedTabs, this.options.id) != -1) ||
      (excludedTabs.length != 0 && indexOf(excludedTabs, this.options.id) == -1) ||
      (includedTabs.length == 0 && excludedTabs.length == 0)
    );
  }

  private render() {
    const icon = this.options.icon;
    if (Utils.isNonEmptyString(icon)) {
      const iconSpan = $$('span').el;
      $$(iconSpan).addClass(['coveo-icon', icon]);
      this.element.insertBefore(iconSpan, this.element.firstChild);
    }

    const caption = this.options.caption;
    if (Utils.isNonEmptyString(caption)) {
      const captionP = document.createElement('p');
      $$(captionP).text(caption);
      this.element.appendChild(captionP);
    }
  }

  protected handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);
    if (!this.disabled && this.isSelected()) {
      data.queryBuilder.tab = this.options.id;

      if (Utils.isNonEmptyString(this.options.expression)) {
        if (this.options.constant) {
          data.queryBuilder.constantExpression.add(this.options.expression);
        } else {
          data.queryBuilder.advancedExpression.add(this.options.expression);
        }
      }

      if (this.options.enableDuplicateFiltering) {
        data.queryBuilder.enableDuplicateFiltering = true;
      }

      if (this.options.pipeline != null) {
        data.queryBuilder.pipeline = this.options.pipeline;
      }

      if (this.options.maximumAge != null) {
        data.queryBuilder.maximumAge = this.options.maximumAge;
      }
    }
  }

  private handleQueryStateChanged(data: IAttributeChangedEventArg) {
    Assert.exists(data);
    if (!this.disabled && this.isSelected()) {
      $$(this.element).addClass('coveo-selected');
      this.queryController.setEndpoint(this.options.endpoint);
      this.showAndHideAppropriateElements();
    } else {
      $$(this.element).removeClass('coveo-selected');
    }
  }

  private handleAfterInitialization() {
    if (this.isSelected() && this.options.layout) {
      this.queryStateModel.set(QUERY_STATE_ATTRIBUTES.LAYOUT, this.options.layout);
    }
  }

  protected isSelected(): boolean {
    const activeTab = this.queryStateModel.get(QueryStateModel.attributesEnum.t);
    return activeTab == this.options.id;
  }

  private showAndHideAppropriateElements() {
    const showElements = [];
    const hideElements = [];

    each($$(this.root).findAll('[data-tab],[data-tab-not]'), element => {
      if (this.isElementIncludedInTab(element)) {
        this.toggleAllComponentsUnder(element, true);
        showElements.push(element);
      } else {
        this.toggleAllComponentsUnder(element, false);
        hideElements.push(element);
      }
    });

    $$(this.root).one(QueryEvents.querySuccess, () => {
      each(showElements, elem => $$(elem).removeClass('coveo-tab-disabled'));
      each(hideElements, elem => $$(elem).addClass('coveo-tab-disabled'));
    });
  }

  private splitListOfTabs(value: string): string[] {
    if (Utils.exists(value)) {
      return map(value.split(','), tab => Utils.trim(tab));
    } else {
      return [];
    }
  }

  private toggleAllComponentsUnder(element: HTMLElement, enable: boolean) {
    Assert.exists(element);

    const togglePossibleComponent = (possibleComponent: HTMLElement) => {
      const possibleCmp = Component.get(possibleComponent, undefined, true);
      if (possibleCmp) {
        if (enable) {
          possibleCmp.enable();
        } else {
          possibleCmp.disable();
        }
      }
    };

    togglePossibleComponent(element);
    each($$(element).findAll('*'), el => {
      togglePossibleComponent(el);
    });
  }

  public enable() {
    super.enable();
    this.element.style.display = '';
  }

  public disable() {
    super.disable();
    this.element.style.display = 'none';
  }
}

Initialization.registerAutoCreateComponent(Tab);
