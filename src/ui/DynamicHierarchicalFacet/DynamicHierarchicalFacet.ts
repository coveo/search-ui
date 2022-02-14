import 'styling/DynamicFacet/_DynamicFacet';
import { Component } from '../Base/Component';
import { l } from '../../strings/Strings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import { DynamicHierarchicalFacetQueryController } from '../../controllers/DynamicHierarchicalFacetQueryController';
import { QueryStateModel } from '../../models/QueryStateModel';
import { IAttributesChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { Utils } from '../../utils/Utils';
import { isArray, findIndex } from 'underscore';
import { Assert } from '../../misc/Assert';
import { QueryEvents, IQuerySuccessEventArgs, IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { DynamicHierarchicalFacetBreadcrumb } from './DynamicHierarchicalFacetBreadcrumb';
import { analyticsActionCauseList, IAnalyticsActionCause, IAnalyticsFacetMeta } from '../Analytics/AnalyticsActionListMeta';
import { QueryBuilder } from '../Base/QueryBuilder';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import {
  IDynamicHierarchicalFacetOptions,
  IDynamicHierarchicalFacet,
  IDynamicHierarchicalFacetValues,
  HierarchicalFacetSortCriteria
} from './IDynamicHierarchicalFacet';
import { ResponsiveFacetOptions } from '../ResponsiveComponents/ResponsiveFacetOptions';
import { DynamicFacetHeader } from '../DynamicFacet/DynamicFacetHeader/DynamicFacetHeader';
import { IStringMap } from '../../rest/GenericParam';
import { DependsOnManager, IDependentFacet, IDependentFacetCondition } from '../../utils/DependsOnManager';
import { ResultListUtils } from '../../utils/ResultListUtils';
import { FacetType } from '../../rest/Facet/FacetRequest';
import { DynamicHierarchicalFacetValues } from './DynamicHierarchicalFacetValues/DynamicHierarchicalFacetValues';
import { IFacetResponse } from '../../rest/Facet/FacetResponse';
import { IQueryOptions } from '../../controllers/QueryController';
import { IQueryResults } from '../../rest/QueryResults';
import { DynamicFacetManager } from '../DynamicFacetManager/DynamicFacetManager';
import { IAnalyticsFacetState } from '../Analytics/IAnalyticsFacetState';
import { FacetValueState } from '../../rest/Facet/FacetValueState';
import { FacetSortCriteria } from '../../rest/Facet/FacetSortCriteria';
import { Logger } from '../../misc/Logger';
import { DynamicHierarchicalFacetSearch } from '../DynamicHierarchicalFacetSearch/DynamicHierarchicalFacetSearch';
import { ResponsiveComponentsUtils } from '../ResponsiveComponents/ResponsiveComponentsUtils';

/**
 * The `DynamicHierarchicalFacet` component is a facet that renders values in a hierarchical fashion. It determines the filter to apply depending on the
 * selected path of values.
 *
 * This facet requires a [`field`]{@link DynamicHierarchicalFacet.options.field} with a special format to work correctly.
 *
 * @notSupportedIn salesforcefree
 * @availablesince [January 2020 Release (v2.7968)](https://docs.coveo.com/en/3163/)
 * @externaldocs [Using Hierarchical Facets](https://docs.coveo.com/en/2667)
 */
export class DynamicHierarchicalFacet extends Component implements IDynamicHierarchicalFacet {
  static ID = 'DynamicHierarchicalFacet';
  static doExport = () => {
    exportGlobally({
      DynamicHierarchicalFacet
    });
  };

  /**
   * The options for the DynamicHierarchicalFacet
   * @componentOptions
   */
  static options: IDynamicHierarchicalFacetOptions = {
    /**
     * A unique identifier for the facet. Among other things, this identifier serves the purpose of saving
     * the facet state in the URL hash.
     *
     * If you have two facets with the same field on the same page, you should specify an `id` value for at least one of
     * those two facets. This `id` must be unique among the facets.
     *
     * Default value is the [`field`]{@link DynamicHierarchicalFacet.options.field} option value.
     *
     * @examples productcategory
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value, options: IDynamicHierarchicalFacetOptions) => value || (options.field as string),
      section: 'CommonOptions'
    }),

    /**
     * The index field whose values the facet should use. The field values should have the form:
     * `the; the|path; the|path|to; the|path|to|given; the|path|to|given|item;`
     * where the delimiting character is `|`. This default delimiting character can be changed using the [delimitingCharacter]{@link DynamicHierarchicalFacet.options.delimitingCharacter} option.
     *
     * To help you verify whether your fields are setup correctly, use the [`debugInfo`]{@link DynamicHierarchicalFacet.debugInfo} method.
     *
     * @externaldocs [Using the Hierarchical Facet Component](https://docs.coveo.com/en/2667).
     * @examples @category
     */
    field: ComponentOptions.buildFieldOption({ required: true, section: 'CommonOptions' }),

    /**
     * The title to display at the top of the facet.
     *
     * Default value is the localized string for `NoTitle`.
     *
     * @examples Product category
     */
    title: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('NoTitle'),
      section: 'CommonOptions'
    }),

    /**
     * The maximum number of field values to display by default in the facet before the user
     * clicks the arrow to show more.
     *
     * See also the [`enableMoreLess`]{@link DynamicHierarchicalFacet.options.enableMoreLess} option.
     *
     * @examples 8
     */
    numberOfValues: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0, section: 'CommonOptions' }),

    /**
     * Whether to allow the end-user to expand and collapse this facet.
     */
    enableCollapse: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * Whether this facet should be collapsed by default.
     */
    collapsedByDefault: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'CommonOptions', depend: 'enableCollapse' }),

    /**
     * Whether to scroll back to the top of the page whenever the end-user interacts with a facet.
     */
    enableScrollToTop: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * Whether to notify the [`Breadcrumb`]{@link Breadcrumb} component when toggling values in the facet.
     */
    includeInBreadcrumb: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * The number of items to scan for facet values.
     *
     * Setting this option to a higher value may enhance the accuracy of facet value counts at the cost of slower query performance.
     *
     * @examples 1500
     */
    injectionDepth: ComponentOptions.buildNumberOption({ defaultValue: 1000, min: 1000 }),

    /**
     * Whether to enable the **More** and **Less** buttons in the Facet.
     *
     * See also the [`numberOfValues`]{@link DynamicHierarchicalFacet.options.numberOfValues} option.
     */
    enableMoreLess: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * Whether to allow the end-user to search the facet values.
     */
    enableFacetSearch: ComponentOptions.buildBooleanOption({ section: 'Filtering', defaultValue: false }),

    /**
     * The character that specifies the hierarchical dependency.
     *
     * **Example:**
     *
     * If your field has the following values:
     *
     * `electronics; electronics>laptops; electronics>laptops>gaming;`
     *
     * The delimiting character is `>`.
     *
     * @examples >
     */
    delimitingCharacter: ComponentOptions.buildStringOption({ defaultValue: '|', section: 'CommonOptions' }),

    /**
     * A mapping of facet values to their desired captions.
     *
     * @externaldocs [Normalizing Facet Value Captions](https://docs.coveo.com/en/368/)
     */
    valueCaption: ComponentOptions.buildJsonOption<IStringMap<string>>({ defaultValue: {} }),

    /**
     * The `id` option value of another facet in which at least one value must be selected in order
     * for the dependent hierarchical facet to be visible.
     *
     * **Default:** `undefined` and the hierarchical facet does not depend on any other facet to be displayed.
     *
     * @externaldocs [Defining Dependent Facets](https://docs.coveo.com/3210/)
     * @examples department
     */
    dependsOn: ComponentOptions.buildStringOption({ section: 'CommonOptions' }),

    /**
     * A function that verifies whether the current state of the `dependsOn` facet allows the dependent facet to be displayed.
     *
     * If specified, the function receives a reference to the resolved `dependsOn` facet component instance as an argument, and must return a boolean.
     * The function's argument should typically be treated as read-only.
     *
     * By default, the dependent facet is displayed whenever one or more values are selected in its `dependsOn` facet.
     *
     * @externaldocs [Defining Dependent Facets](https://docs.coveo.com/3210/)
     */
    dependsOnCondition: ComponentOptions.buildCustomOption<IDependentFacetCondition>(
      () => {
        return null;
      },
      { depend: 'dependsOn', section: 'CommonOptions' }
    ),

    /**
     * Whether to exclude folded result parents when estimating result counts for facet values.
     *
     * **Note:** The target folding field must be a facet field with the **Use cache for nested queries** options enabled (see [Add or Edit a Field](https://docs.coveo.com/en/1982)).
     *
     * See also the [`Folding`]{@link Folding} and [`FoldingForThread`]{@link FoldingForThread} components.
     *
     * **Default:** `true`.
     */
    filterFacetCount: ComponentOptions.buildBooleanOption({ section: 'Filtering' }),

    /**
     * The sort criterion to use for this facet.
     *
     * **Default (Search API):** `occurrences`.
     *
     * @examples alphanumeric
     *
     * @availablesince [March 2020 Release (v2.8521)](https://docs.coveo.com/en/3203/)
     */
    sortCriteria: <HierarchicalFacetSortCriteria>ComponentOptions.buildStringOption({
      postProcessing: value => {
        if (!value) {
          return undefined;
        }

        if (value === FacetSortCriteria.alphanumeric || value === FacetSortCriteria.occurrences) {
          return value;
        }

        new Logger(value).warn('sortCriteria is not of the the allowed values: "alphanumeric", "occurrences"');
        return undefined;
      },
      section: 'Sorting'
    }),

    /**
     * Specifies a custom order by which to sort the dynamic hierarchical facet values.
     *
     * Custom-ordered values won't necessarily retrieve values from the index.
     *
     * **Example:**
     * ```html
     * <div
     *   class="CoveoDynamicHierarchicalFacet"
     *   data-field="@countries"
     *   data-title="Countries"
     *   data-tab="All"
     *   data-clear-label="All Countries"
     *   data-delimiting-character="|"
     *   data-custom-sort="America, Asia|Japan, America|Mexico, America|Canada, Europe|Germany, Europe|France, Oceania"
     * ></div>
     * ```
     */
    customSort: ComponentOptions.buildStringOption({ section: 'Sorting' }),

    /**
     * If a custom sort is defined, this specifies the delimiter that separates paths from each other.
     *
     * *Example:**
     * ```html
     * <div
     *   class="CoveoDynamicHierarchicalFacet"
     *   data-field="@countries"
     *   data-title="Countries"
     *   data-tab="All"
     *   data-clear-label="All Countries"
     *   data-delimiting-character="|"
     *   data-custom-sort="America...Asia|Japan...America|Mexico...America|Canada...Europe|Germany...Europe|France...Oceania"
     *   data-custom-sort-delimiting-character="..."
     * ></div>
     * ```
     */
    customSortDelimitingCharacter: ComponentOptions.buildStringOption({
      section: 'Sorting',
      depend: 'customSort',
      postProcessing: (value, options: IDynamicHierarchicalFacetOptions) =>
        Utils.isNullOrUndefined(value) ? (options.delimitingCharacter === ',' ? '|' : ',') : value
    }),

    /**
     * The label to display to clear the facet when a value is selected.
     *
     * Default value is the localized string for `AllCategories`.
     *
     * @examples Everything
     */
    clearLabel: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('AllCategories'),
      section: 'CommonOptions'
    }),

    /**
     * The base path shared by all values to display in the hierarchical facet.
     *
     * If you set this option, the specified base path will always be active on the facet.
     *
     * This implies that:
     * - The end user will not have to manually select the specified base path values.
     * - Values that do not have the specified base path will not be displayed in the facet.
     *
     * @examples electronics, electronics\,laptops
     *
     * @availablesince [April 2020 Release (v2.8864)](https://docs.coveo.com/en/3231/)
     */
    basePath: ComponentOptions.buildListOption<string>({ defaultValue: [] }),
    ...ResponsiveFacetOptions
  };

  private listenToQueryStateChange = true;
  private search: DynamicHierarchicalFacetSearch;

  public options: IDynamicHierarchicalFacetOptions;
  public dynamicHierarchicalFacetQueryController: DynamicHierarchicalFacetQueryController;
  public dependsOnManager: DependsOnManager;
  public isCollapsed: boolean;
  public header: DynamicFacetHeader;
  public values: IDynamicHierarchicalFacetValues;
  public moreValuesAvailable = false;
  public position: number;
  public dynamicFacetManager: DynamicFacetManager;
  public isDynamicFacet = true;

  constructor(public element: HTMLElement, options: IDynamicHierarchicalFacetOptions, bindings?: IComponentBindings) {
    super(element, 'DynamicHierarchicalFacet', bindings);
    this.options = ComponentOptions.initComponentOptions(element, DynamicHierarchicalFacet, options);

    this.dynamicHierarchicalFacetQueryController = new DynamicHierarchicalFacetQueryController(this);
    this.isCollapsed = this.options.enableCollapse && this.options.collapsedByDefault;
    this.verifyCollapsingConfiguration();
    this.values = new DynamicHierarchicalFacetValues(this);

    ResponsiveFacets.init(this.root, this, this.options);
    this.initDependsOnManager();
    this.initBreadCrumbEvents();
    this.initQueryEvents();
    this.initQueryStateEvents();
  }

  public get fieldName() {
    return this.options.field.slice(1);
  }

  public get facetType() {
    return FacetType.hierarchical;
  }

  public isCurrentlyDisplayed() {
    return $$(this.element).isVisible();
  }

  public get hasActiveValues() {
    return this.values.hasSelectedValue;
  }

  private initQueryEvents() {
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (data: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(data));
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data.results));
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.ensureDom());
    this.bind.onRootElement(QueryEvents.queryError, () => this.onNoValues());
  }

  private initBreadCrumbEvents() {
    if (this.options.includeInBreadcrumb) {
      this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) =>
        this.handlePopulateBreadcrumb(args)
      );
      this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.reset());
    }
  }

  private get queryStateAttribute() {
    return QueryStateModel.getFacetId(this.options.id);
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    // If there is a DynamicFacetManager, it will take care of adding the facet's state
    if (this.dynamicFacetManager) {
      return;
    }

    Assert.exists(data);
    Assert.exists(data.queryBuilder);
    this.putStateIntoQueryBuilder(data.queryBuilder);
    this.putStateIntoAnalytics();
  }

  private verifyCollapsingConfiguration() {
    if (this.options.collapsedByDefault && !this.options.enableCollapse) {
      this.logger.warn('Setting "collapseByDefault" to "true" has no effect when "enableCollapse" is set to "false"');
    }
  }

  public putStateIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);
    this.dynamicHierarchicalFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
  }

  public putStateIntoAnalytics() {
    const pendingEvent = this.usageAnalytics.getPendingSearchEvent();
    pendingEvent && pendingEvent.addFacetState(this.analyticsFacetState);
  }

  public scrollToTop() {
    if (this.options.enableScrollToTop) {
      ResultListUtils.scrollToTop(this.root);
    }
  }

  private updateAppearance() {
    this.header.toggleCollapse(this.isCollapsed);
    this.toggleSearchDisplay();
    $$(this.element).toggleClass('coveo-dynamic-hierarchical-facet-collapsed', this.isCollapsed);
    $$(this.element).toggleClass('coveo-hidden', !this.values.allFacetValues.length);
  }

  private toggleSearchDisplay() {
    if (this.options.enableFacetSearch === false) {
      return;
    }

    return $$(this.search.element).toggleClass('coveo-hidden', this.isCollapsed);
  }

  private handleQuerySuccess(results: IQueryResults) {
    // If there is a DynamicFacetManager, it will take care of handling the results
    if (this.dynamicFacetManager) {
      return;
    }

    if (Utils.isNullOrUndefined(results.facets)) {
      return this.notImplementedError();
    }

    this.handleQueryResults(results);
  }

  public handleQueryResults(results: IQueryResults) {
    const index = findIndex(results.facets, { facetId: this.options.id });
    const facetResponse = index !== -1 ? results.facets[index] : null;

    this.position = facetResponse ? index + 1 : undefined;
    facetResponse ? this.onNewValues(facetResponse) : this.onNoValues();

    this.header.hideLoading();
    this.updateQueryStateModel(this.values.selectedPath);
    this.values.render();
    this.updateAppearance();
  }

  private onNewValues(facetResponse: IFacetResponse) {
    this.moreValuesAvailable = facetResponse.moreValuesAvailable;
    this.values.createFromResponse(facetResponse);
    if (this.options.customSort) {
      const order = this.options.customSort
        .split(this.options.customSortDelimitingCharacter)
        .map(value => value.trim().split(this.options.delimitingCharacter));
      this.values.reorderValues(order);
    }
  }

  private onNoValues() {
    this.moreValuesAvailable = false;
    this.values.resetValues();
  }

  private updateQueryStateModel(path: string[]) {
    this.listenToQueryStateChange = false;
    this.queryStateModel.set(this.queryStateAttribute, path);
    this.listenToQueryStateChange = true;
  }

  private beforeSendingQuery() {
    this.header.showLoading();
  }

  public triggerNewQuery(beforeExecuteQuery?: () => void) {
    this.beforeSendingQuery();
    const options: IQueryOptions = {
      ...(beforeExecuteQuery ? { beforeExecuteQuery } : { ignoreWarningSearchEvent: true }),
      closeModalBox: !ResponsiveComponentsUtils.isSmallFacetActivated($$(this.root))
    };
    this.queryController.executeQuery(options);
  }

  public async triggerNewIsolatedQuery(beforeExecuteQuery?: () => void) {
    this.beforeSendingQuery();
    beforeExecuteQuery && beforeExecuteQuery();

    try {
      const results = await this.dynamicHierarchicalFacetQueryController.getQueryResults();
      this.handleQueryResults(results);
    } catch (e) {
      this.header.hideLoading();
    }
  }

  /**
   * Requests additional values.
   *
   * See the [`enableMoreLess`]{@link DynamicHierarchicalFacet.options.enableMoreLess} option.
   *
   * Automatically triggers an isolated query.
   * @param additionalNumberOfValues The number of additional values to request. Minimum value is 1. Defaults to the [numberOfValues]{@link DynamicHierarchicalFacet.options.numberOfValues} option value.
   */
  public showMoreValues(additionalNumberOfValues = this.options.numberOfValues) {
    this.ensureDom();
    this.logger.info('Show more values');
    this.dynamicHierarchicalFacetQueryController.increaseNumberOfValuesToRequest(additionalNumberOfValues);
    this.triggerNewIsolatedQuery(() => this.logAnalyticsFacetShowMoreLess(analyticsActionCauseList.dynamicFacetShowMore));
  }

  /**
   * Reduces the number of displayed facet values down to [numberOfValues]{@link DynamicFacet.options.numberOfValues}.
   *
   * See the [`enableMoreLess`]{@link DynamicHierarchicalFacet.options.enableMoreLess} option.
   *
   * Automatically triggers an isolated query.
   */
  public showLessValues() {
    this.ensureDom();
    this.logger.info('Show less values');
    this.dynamicHierarchicalFacetQueryController.resetNumberOfValuesToRequest();
    this.triggerNewIsolatedQuery(() => this.logAnalyticsFacetShowMoreLess(analyticsActionCauseList.dynamicFacetShowLess));
  }

  /**
   * Select a path in the hierarchy.
   *
   * Does **not** trigger a query automatically.
   * Does **not** update the visual of the facet until a query is performed.
   *
   * @param path The values representing the path.
   */
  public selectPath(path: string[]) {
    Assert.exists(path);
    Assert.isLargerThan(0, path.length);
    this.ensureDom();
    this.updateQueryStateModel(path);
    this.values.selectPath(path);
    this.logger.info('Toggle select facet value at path', path);
  }

  private clear() {
    this.reset();
    this.scrollToTop();
    this.triggerNewQuery(() => this.logAnalyticsEvent(analyticsActionCauseList.dynamicFacetClearAll));
  }

  /**
   * Deselects the path in the facet.
   *
   * Does **not** trigger a query automatically.
   * Does **not** update the visual of the facet until a query is performed.
   */
  public reset() {
    this.ensureDom();

    if (!this.values.hasSelectedValue) {
      return;
    }

    this.enablePreventAutoSelectionFlag();
    this.logger.info('Deselect facet value');
    this.values.clearPath();
    this.updateQueryStateModel([]);
  }

  /**
   * Collapses or expands the facet depending on it's current state.
   */
  public toggleCollapse() {
    this.isCollapsed ? this.expand() : this.collapse();
  }

  /**
   * Expands the facet, displaying all of its currently fetched values.
   */
  public expand() {
    if (!this.options.enableCollapse) {
      return this.logger.warn(`Calling expand() won't do anything on a facet that has the option "enableCollapse" set to "false"`);
    }
    if (!this.isCollapsed) {
      return;
    }
    this.ensureDom();
    this.logger.info('Expand facet values');
    this.isCollapsed = false;
    this.updateAppearance();
  }

  /**
   * For this method to work, the component has to be the child of a [DynamicFacetManager]{@link DynamicFacetManager} component.
   *
   * Sets a flag indicating whether the facets should be returned in their current order.
   *
   * Setting the flag to `true` helps ensuring that the facets do not move around while the end-user is interacting with them.
   *
   * The flag is automatically set back to `false` after a query is built.
   */
  public enableFreezeFacetOrderFlag() {
    this.dynamicHierarchicalFacetQueryController.enableFreezeFacetOrderFlag();
  }

  public enablePreventAutoSelectionFlag() {
    this.dynamicHierarchicalFacetQueryController.enablePreventAutoSelectionFlag();
  }

  /**
   * Collapses the facet, hiding values.
   */
  public collapse() {
    if (!this.options.enableCollapse) {
      return this.logger.warn(`Calling collapse() won't do anything on a facet that has the option "enableCollapse" set to "false"`);
    }
    if (this.isCollapsed) {
      return;
    }
    this.ensureDom();
    this.logger.info('Collapse facet values');
    this.isCollapsed = true;
    this.updateAppearance();
  }

  public createDom() {
    this.createAndAppendContent();
    this.updateAppearance();
  }

  /**
   *
   * @param value The string to find a caption for.
   * Returns the caption for a value or the value itself if no caption is available.
   */
  public getCaption(value: string) {
    const valueCaptions = this.options.valueCaption;
    const caption = valueCaptions[value];
    return caption ? caption : value;
  }

  public logAnalyticsEvent(actionCause: IAnalyticsActionCause) {
    this.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(actionCause, this.analyticsFacetMeta);
  }

  private get analyticsFacetValue() {
    return this.values.selectedPath.join(this.options.delimitingCharacter);
  }

  public get analyticsFacetState(): IAnalyticsFacetState[] {
    if (!this.values.hasSelectedValue) {
      return [];
    }

    return [
      {
        field: this.options.field.toString(),
        id: this.options.id,
        title: this.options.title,
        facetType: this.facetType,
        facetPosition: this.position,
        value: this.analyticsFacetValue,
        displayValue: this.analyticsFacetValue,
        state: FacetValueState.selected,
        valuePosition: 1
      }
    ];
  }

  public get analyticsFacetMeta(): IAnalyticsFacetMeta {
    return {
      facetField: this.options.field.toString(),
      facetId: this.options.id,
      facetTitle: this.options.title,
      facetValue: this.analyticsFacetValue
    };
  }

  private createAndAppendContent() {
    this.createAndAppendHeader();
    this.createAndAppendSearch();
    this.createAndAppendValues();
  }

  private createAndAppendHeader() {
    this.header = new DynamicFacetHeader({
      id: this.options.id,
      title: this.options.title,
      enableCollapse: this.options.enableCollapse,
      clear: () => this.clear(),
      toggleCollapse: () => this.toggleCollapse(),
      expand: () => this.expand(),
      collapse: () => this.collapse()
    });
    this.element.appendChild(this.header.element);
  }

  private createAndAppendSearch() {
    if (this.options.enableFacetSearch === false) {
      return;
    }

    this.search = new DynamicHierarchicalFacetSearch(this);
    this.element.appendChild(this.search.element);
  }

  private createAndAppendValues() {
    this.element.appendChild(this.values.render());
  }

  private pathIsValidForSelection(path: any): path is string[] {
    return !Utils.isNullOrUndefined(path) && isArray(path);
  }

  private handleQueryStateChanged(data: IAttributesChangedEventArg) {
    if (!this.listenToQueryStateChange) {
      return;
    }

    const queryStatePath = data.attributes[this.queryStateAttribute];

    if (!this.pathIsValidForSelection(queryStatePath)) {
      return;
    }

    if (Utils.arrayEqual(queryStatePath, this.values.selectedPath)) {
      return;
    }

    queryStatePath.length ? this.selectPath(queryStatePath) : this.reset();
  }

  private initQueryStateEvents() {
    this.queryStateModel.registerNewAttribute(this.queryStateAttribute, []);
    this.bind.onQueryState<IAttributesChangedEventArg>(MODEL_EVENTS.CHANGE, undefined, data => this.handleQueryStateChanged(data));
  }

  private initDependsOnManager() {
    const facetInfo: IDependentFacet = {
      reset: () => this.reset(),
      ref: this
    };

    this.dependsOnManager = new DependsOnManager(facetInfo);
  }

  private notImplementedError() {
    this.logger.error('DynamicHierarchicalFacets are not supported by your current search endpoint. Disabling this component.');
    this.disable();
    this.updateAppearance();
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    Assert.exists(args);

    if (!this.values.hasSelectedValue) {
      return;
    }

    const breadcrumbs = new DynamicHierarchicalFacetBreadcrumb(this);
    args.breadcrumbs.push({ element: breadcrumbs.element });
  }

  private logAnalyticsFacetShowMoreLess(cause: IAnalyticsActionCause) {
    this.usageAnalytics.logCustomEvent<IAnalyticsFacetMeta>(cause, this.analyticsFacetMeta, this.element);
  }
}

Initialization.registerAutoCreateComponent(DynamicHierarchicalFacet);
DynamicHierarchicalFacet.doExport();
