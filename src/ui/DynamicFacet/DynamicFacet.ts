import 'styling/DynamicFacet/_DynamicFacet';
import { difference, findIndex } from 'underscore';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { ResponsiveFacetOptions } from '../ResponsiveComponents/ResponsiveFacetOptions';
import { ResponsiveDynamicFacets } from '../ResponsiveComponents/ResponsiveDynamicFacets';
import { DynamicFacetBreadcrumbs } from './DynamicFacetBreadcrumbs';
import { DynamicFacetHeader } from './DynamicFacetHeader/DynamicFacetHeader';
import { DynamicFacetValues } from './DynamicFacetValues/DynamicFacetValues';
import { QueryEvents, IQuerySuccessEventArgs, IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { QueryStateModel } from '../../models/QueryStateModel';
import { DynamicFacetQueryController } from '../../controllers/DynamicFacetQueryController';
import { Utils } from '../../utils/Utils';
import { MODEL_EVENTS, IAttributesChangedEventArg } from '../../models/Model';
import { Assert } from '../../misc/Assert';
import { IFacetResponse } from '../../rest/Facet/FacetResponse';
import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { IStringMap } from '../../rest/GenericParam';
import { isFacetSortCriteria } from '../../rest/Facet/FacetSortCriteria';
import { l } from '../../strings/Strings';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { IAnalyticsActionCause, IAnalyticsDynamicFacetMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { IQueryOptions } from '../../controllers/QueryController';
import { DynamicFacetManager } from '../DynamicFacetManager/DynamicFacetManager';
import { QueryBuilder } from '../Base/QueryBuilder';
import { IAutoLayoutAdjustableInsideFacetColumn } from '../SearchInterface/FacetColumnAutoLayoutAdjustment';
import { DynamicFacetSearch } from '../DynamicFacetSearch/DynamicFacetSearch';
import { ResultListUtils } from '../../utils/ResultListUtils';
import { IQueryResults } from '../../rest/QueryResults';
import { FacetType } from '../../rest/Facet/FacetRequest';

export interface IDynamicFacetOptions extends IResponsiveComponentOptions {
  id?: string;
  title?: string;
  field?: IFieldOption;
  sortCriteria?: string;
  numberOfValues?: number;
  enableCollapse?: boolean;
  enableScrollToTop?: boolean;
  enableMoreLess?: boolean;
  enableFacetSearch?: boolean;
  useLeadingWildcardInFacetSearch?: boolean;
  collapsedByDefault?: boolean;
  includeInBreadcrumb?: boolean;
  numberOfValuesInBreadcrumb?: number;
  valueCaption?: any;
}

/**
 * The `DynamicFacet` component displays a *facet* of the results for the current query. A facet is a list of values for a
 * certain field occurring in the results, ordered using a configurable criteria (e.g., number of occurrences).
 *
 * The list of values is obtained using an array of [`FacetRequest`]{@link IFacetRequest} operations performed at the same time
 * as the main query.
 *
 * The `DynamicFacet` component allows the end-user to drill down inside a result set by restricting the result to certain
 * field values.
 *
 * This facet is more easy to use than the original [`Facet`]{@link Facet} component. It implements additional Coveo Machine Learning (Coveo ML) features
 * such as dynamic navigation experience (DNE).
 *
 * @notSupportedIn salesforcefree
 */
export class DynamicFacet extends Component implements IAutoLayoutAdjustableInsideFacetColumn {
  static ID = 'DynamicFacet';
  static doExport = () => exportGlobally({ DynamicFacet });

  /**
   * The options for the DynamicFacet
   * @componentOptions
   */
  static options: IDynamicFacetOptions = {
    ...ResponsiveFacetOptions,

    /**
     * The unique identifier for this facet.
     *
     * Among other things, this is used to record and read the facet
     * state in the URL fragment identifier (see the
     * [`enableHistory`]{@link SearchInterface.options.enableHistory} `SearchInterface`
     * option).
     *
     * **Tip:** When several facets in a given search interface are based on
     * the same field, ensure that each of those facets has a distinct `id`.
     *
     * If specified, must contain between 1 and 60 characters.
     * Only alphanumeric (A-Za-z0-9), underscore (_), and hyphen (-) characters are kept; other characters are automatically removed.
     *
     * **Default:** The [`field`]{@link DynamicFacet.options.field} option value.
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value = '', options: IDynamicFacetOptions) => {
        const maxCharLength = 60;
        const sanitizedValue = value.replace(/[^A-Za-z0-9-_@]+/g, '');
        if (Utils.isNonEmptyString(sanitizedValue)) {
          return sanitizedValue.slice(0, maxCharLength - 1);
        }

        return options.field.slice(0, maxCharLength - 1);
      }
    }),

    /**
     * The title to display for this facet.
     *
     * **Default:** The localized string for `NoTitle`.
     */
    title: ComponentOptions.buildLocalizedStringOption({
      defaultValue: l('NoTitle'),
      section: 'CommonOptions',
      priority: 10
    }),

    /**
     * The name of the field on which to base this facet.
     *
     * Must be prefixed by `@`, and must reference an existing field whose
     * **Facet** option is enabled (see
     * [Add or Edit Fields](https://docs.coveo.com/en/1982/)).
     *
     * **Required:** Specifying a value for this option is required for the
     * component to work.
     */
    field: ComponentOptions.buildFieldOption({ required: true, section: 'CommonOptions' }),

    /**
     * The sort criterion to use for this facet.
     *
     * See [`FacetSortCriteria`]{@link FacetSortCriteria} for the list and
     * description of allowed values.
     *
     * **Default:** `undefined`, and the following behavior applies:
     * - If the requested [`numberOfValues`]{@link DynamicFacet.options.numberOfValues}
     * is greater than or equal to the currently displayed number of values,
     * the [`alphanumeric`]{@link FacetSortCriteria.alphanumeric} criterion is
     * used.
     * - If the requested `numberOfValues` is less than the currently displayed
     * number of values and the facet is not currently expanded, the [`score`]{@link FacetSortCriteria.score}
     * criterion is used.
     * - Otherwise, the `alphanumeric` criterion is used.
     */
    sortCriteria: ComponentOptions.buildStringOption({
      postProcessing: value => (isFacetSortCriteria(value) ? value : undefined),
      section: 'Sorting'
    }),

    /**
     * The number of values to request for this facet.
     *
     * Also determines the default maximum number of additional values to request each time this facet is expanded,
     * and the maximum number of values to display when this facet is collapsed (see [enableCollapse]{@link DynamicFacet.options.enableCollapse}).
     *
     * **Default:** `8`
     */
    numberOfValues: ComponentOptions.buildNumberOption({ min: 0, defaultValue: 8, section: 'CommonOptions' }),

    /**
     * Whether to allow the end-user to expand and collapse this facet.
     *
     * **Default:** `true`
     */
    enableCollapse: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'Filtering' }),

    /**
     * Whether to scroll back to the top of the page whenever the end-user interacts with a facet.
     *
     * **Default:** `true`
     */
    enableScrollToTop: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * Whether to enable the **Show more** and **Show less** buttons in the facet.
     *
     * **Note:**
     * > The [`DynamicRangeFacet`]{@link DynamicRangeFacet} component does not support this option.
     *
     * **Default:** `true`
     */
    enableMoreLess: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * Whether to allow the end-user to search the facet values.
     *
     * **Note:**
     * > The [`DynamicRangeFacet`]{@link DynamicRangeFacet} component does not support this option.
     *
     * **Default:** `undefined`, and the following behavior applies:
     * - Will be enabled when more facet values are available from the server.
     * - Will be disabled when all facet values are already available.
     */
    enableFacetSearch: ComponentOptions.buildBooleanOption({ section: 'Filtering' }),

    /**
     * Whether to prepend facet search queries with a wildcard.
     * See also the [enableFacetSearch]{@link DynamicFacet.options.enableFacetSearch} option.
     *
     * **Note:**
     * > The [`DynamicRangeFacet`]{@link DynamicRangeFacet} component does not support this option.
     *
     * **Default:** `true`
     */
    useLeadingWildcardInFacetSearch: ComponentOptions.buildBooleanOption({
      defaultValue: true,
      section: 'Filtering',
      depend: 'enableFacetSearch'
    }),

    /**
     * Whether this facet should be collapsed by default.
     *
     * See also the [`enableCollapse`]{@link DynamicFacet.options.enableCollapse}
     * option.
     *
     * **Default:** `false`
     */
    collapsedByDefault: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering', depend: 'enableCollapse' }),

    /**
     * Whether to notify the [Breadcrumb]{@link Breadcrumb} component when toggling values in the facet.
     *
     * See also the [numberOfValuesInBreadcrumb]{@link DynamicFacet.options.numberOfValuesInBreadcrumb} option.
     *
     * **Default:** `true`
     */
    includeInBreadcrumb: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * The maximum number of selected values the [`Breadcrumb`]{@link Breadcrumb} component can display before outputting a **N more...** link for the facet.
     *
     * **Note:** This option only has a meaning when the [`includeInBreadcrumb`]{@link DynamicFacet.options.includeInBreadcrumb} option is set to `true`.
     *
     * **Minimum:** `0`
     * **Default:** `5` (desktop), or `3` (mobile)
     */
    numberOfValuesInBreadcrumb: ComponentOptions.buildNumberOption({
      defaultFunction: () => (DeviceUtils.isMobileDevice() ? 3 : 5),
      min: 0,
      depend: 'includeInBreadcrumb',
      section: 'CommonOptions'
    }),

    /**
     * A mapping of facet values to their desired captions.
     *
     * See [Normalizing Facet Value Captions](https://developers.coveo.com/x/jBsvAg).
     *
     * **Note:**
     * > The [`DynamicRangeFacet`]{@link DynamicRangeFacet} component does not support this option.
     */
    valueCaption: ComponentOptions.buildJsonOption<IStringMap<string>>()
  };

  private includedAttributeId: string;
  private listenToQueryStateChange = true;
  private header: DynamicFacetHeader;

  public dynamicFacetManager: DynamicFacetManager;
  public dynamicFacetQueryController: DynamicFacetQueryController;
  public values: DynamicFacetValues;
  private search: DynamicFacetSearch;
  public position: number = null;
  public moreValuesAvailable = false;
  public isCollapsed: boolean;

  /**
   * Creates a new `DynamicFacet` instance.
   *
   * @param element The element from which to instantiate the component.
   * @param options The component options.
   * @param bindings The component bindings. Automatically resolved by default.
   */
  constructor(
    public element: HTMLElement,
    public options?: IDynamicFacetOptions,
    bindings?: IComponentBindings,
    classId: string = DynamicFacet.ID
  ) {
    super(element, classId, bindings);
    this.options = ComponentOptions.initComponentOptions(element, DynamicFacet, options);

    this.initDynamicFacetQueryController();
    this.initQueryEvents();
    this.initQueryStateEvents();
    this.initBreadCrumbEvents();
    this.initComponentStateEvents();

    this.values = new DynamicFacetValues(this);

    this.verifyCollapsingConfiguration();
    this.isCollapsed = this.options.enableCollapse && this.options.collapsedByDefault;

    ResponsiveDynamicFacets.init(this.root, this, this.options);
  }

  public get fieldName() {
    return this.options.field.slice(1);
  }

  public get facetType() {
    return FacetType.Specific;
  }

  /**
   * Selects a single value in this facet.
   *
   * Does **not** trigger a query automatically.
   * Does **not** update the visual of the facet until a query is performed.
   *
   * @param value The name of the facet value to select.
   */
  public selectValue(value: string) {
    Assert.exists(value);
    this.selectMultipleValues([value]);
  }

  /**
   * Selects multiple values in this facet.
   *
   * Does **not** trigger a query automatically.
   * Does **not** update the visual of the facet until a query is performed.
   *
   * @param values The names of the facet values to select.
   */
  public selectMultipleValues(values: string[]) {
    Assert.exists(values);
    this.ensureDom();
    this.logger.info('Selecting facet value(s)', values);
    values.forEach(value => {
      this.values.get(value).select();
    });
    this.handleFacetValuesChanged();
  }

  /**
   * Deselects a single value in this facet.
   *
   * Does **not** trigger a query automatically.
   * Does **not** update the visual of the facet until a query is performed.
   *
   * @param values The name of the facet value to deselect.
   */
  public deselectValue(value: string) {
    Assert.exists(value);
    this.deselectMultipleValues([value]);
  }

  /**
   * Deselects multiple values in this facet.
   *
   * Does **not** trigger a query automatically.
   * Does **not** update the visual of the facet until a query is performed.
   *
   * @param values The names of the facet values to deselect.
   */
  public deselectMultipleValues(values: string[]) {
    Assert.exists(values);
    this.ensureDom();
    this.logger.info('Deselecting facet value(s)', values);
    values.forEach(value => {
      this.values.get(value).deselect();
    });
    this.handleFacetValuesChanged();
  }

  /**
   * Toggles the selection state of a single value in this facet.
   *
   * Does **not** trigger a query automatically.
   *
   * @param values The name of the facet value to toggle.
   */
  public toggleSelectValue(value: string) {
    Assert.exists(value);
    this.ensureDom();
    this.logger.info('Toggle select facet value', this.values.get(value).toggleSelect());
    this.handleFacetValuesChanged();
  }

  /**
   * Requests additional values.
   *
   * Automatically triggers an isolated query.
   * @param additionalNumberOfValues The number of additional values to request. Minimum value is 1. Defaults to the [numberOfValues]{@link DynamicFacet.options.numberOfValues} option value.
   */
  public showMoreValues(additionalNumberOfValues = this.options.numberOfValues) {
    this.ensureDom();
    this.logger.info('Show more values');
    this.dynamicFacetQueryController.increaseNumberOfValuesToRequest(additionalNumberOfValues);
    this.triggerNewIsolatedQuery(() => this.logAnalyticsFacetShowMoreLess(analyticsActionCauseList.dynamicFacetShowMore));
  }

  /**
   * Reduces the number of displayed facet values down to [numberOfValues]{@link DynamicFacet.options.numberOfValues}.
   *
   * Automatically triggers an isolated query.
   */
  public showLessValues() {
    this.ensureDom();
    this.logger.info('Show less values');
    this.dynamicFacetQueryController.resetNumberOfValuesToRequest();
    this.triggerNewIsolatedQuery(() => this.logAnalyticsFacetShowMoreLess(analyticsActionCauseList.dynamicFacetShowLess));
  }

  /**
   * Deselects all values in this facet.
   *
   * Does **not** trigger a query automatically.
   * Updates the visual of the facet.
   *
   */
  public reset() {
    this.ensureDom();
    if (!this.values.hasActiveValues) {
      return;
    }
    this.logger.info('Deselect all values');
    this.values.clearAll();
    this.values.render();
    this.updateAppearance();
    this.updateQueryStateModel();
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
   * Collapses the facet, displaying only its currently selected values.
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

  /**
   * Sets a flag indicating whether the facet values should be returned in their current order.
   *
   * Setting the flag to `true` helps ensuring that the values do not move around while the end-user is interacting with them.
   *
   * The flag is automatically set back to `false` after a query is built.
   */
  public enableFreezeCurrentValuesFlag() {
    Assert.exists(this.dynamicFacetQueryController);
    this.dynamicFacetQueryController.enableFreezeCurrentValuesFlag();
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
    Assert.exists(this.dynamicFacetQueryController);
    this.dynamicFacetQueryController.enableFreezeFacetOrderFlag();
  }

  public scrollToTop() {
    if (this.options.enableScrollToTop) {
      ResultListUtils.scrollToTop(this.root);
    }
  }

  // Complete facet analytics meta
  public get analyticsFacetState(): IAnalyticsDynamicFacetMeta[] {
    return this.values.activeFacetValues.map(facetValue => facetValue.analyticsMeta);
  }

  // Facet specific analytics meta
  public get basicAnalyticsFacetState(): IAnalyticsDynamicFacetMeta {
    return {
      field: this.options.field.toString(),
      id: this.options.id,
      title: this.options.title,
      facetType: this.facetType,
      facetPosition: this.position
    };
  }

  public logAnalyticsEvent(actionCause: IAnalyticsActionCause, facetMeta: IAnalyticsDynamicFacetMeta) {
    this.usageAnalytics.logSearchEvent<IAnalyticsDynamicFacetMeta>(actionCause, facetMeta);
  }

  public putStateIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);
    this.dynamicFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
  }

  public putStateIntoAnalytics() {
    const pendingEvent = this.usageAnalytics.getPendingSearchEvent();
    pendingEvent && pendingEvent.addFacetState(this.analyticsFacetState);
  }

  public isCurrentlyDisplayed() {
    if (!$$(this.element).isVisible()) {
      return false;
    }

    if ($$(this.element).hasClass('coveo-hidden')) {
      return false;
    }

    return true;
  }

  private initQueryEvents() {
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.ensureDom());
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (data: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(data));
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data.results));
    this.bind.onRootElement(QueryEvents.queryError, () => this.onQueryResponse());
  }

  private initQueryStateEvents() {
    this.includedAttributeId = QueryStateModel.getFacetId(this.options.id);
    this.queryStateModel.registerNewAttribute(this.includedAttributeId, []);
    this.bind.onQueryState(MODEL_EVENTS.CHANGE, undefined, this.handleQueryStateChanged);
  }

  protected initBreadCrumbEvents() {
    if (this.options.includeInBreadcrumb) {
      this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) =>
        this.handlePopulateBreadcrumb(args)
      );
      this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.reset());
    }
  }

  private initComponentStateEvents() {
    const componentStateId = QueryStateModel.getFacetId(this.options.id);
    this.componentStateModel.registerComponent(componentStateId, this);
  }

  private initDynamicFacetQueryController() {
    this.dynamicFacetQueryController = new DynamicFacetQueryController(this);
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

  private handleQuerySuccess(results: IQueryResults) {
    if (Utils.isNullOrUndefined(results.facets)) {
      return this.notImplementedError();
    }

    const index = findIndex(results.facets, { facetId: this.options.id });
    const response = index !== -1 ? results.facets[index] : null;
    this.position = index + 1;

    this.onQueryResponse(response);
    this.header.hideLoading();
    this.values.render();
    this.updateAppearance();
  }

  private onQueryResponse(response?: IFacetResponse) {
    if (response) {
      this.moreValuesAvailable = response.moreValuesAvailable;
      return this.values.createFromResponse(response);
    }

    this.moreValuesAvailable = false;
    this.values.resetValues();
  }

  private handleQueryStateChanged(data: IAttributesChangedEventArg) {
    if (!this.listenToQueryStateChange) {
      return;
    }

    const querySelectedValues: string[] = data.attributes[this.includedAttributeId];
    if (!querySelectedValues) {
      return;
    }

    this.handleQueryStateChangedIncluded(querySelectedValues);
  }

  private handleQueryStateChangedIncluded = (querySelectedValues: string[]) => {
    const currentSelectedValues = this.values.selectedValues;
    const valuesToSelect = difference(querySelectedValues, currentSelectedValues);
    const valuesToDeselect = difference(currentSelectedValues, querySelectedValues);

    if (Utils.isNonEmptyArray(valuesToSelect)) {
      this.selectMultipleValues(valuesToSelect);
      // Only one search event is sent, pick first facet value
      this.logAnalyticsEvent(analyticsActionCauseList.dynamicFacetSelect, this.values.get(valuesToSelect[0]).analyticsMeta);
    }

    if (Utils.isNonEmptyArray(valuesToDeselect)) {
      this.deselectMultipleValues(valuesToDeselect);
      // Only one search event is sent, pick first facet value
      this.logAnalyticsEvent(analyticsActionCauseList.dynamicFacetDeselect, this.values.get(valuesToDeselect[0]).analyticsMeta);
    }
  };

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    Assert.exists(args);

    if (!this.values.hasActiveValues) {
      return;
    }

    const breadcrumbs = new DynamicFacetBreadcrumbs(this);
    args.breadcrumbs.push({ element: breadcrumbs.element });
  }

  public createDom() {
    this.createAndAppendContent();
    this.updateAppearance();
  }

  private createAndAppendContent() {
    this.createAndAppendHeader();
    this.createAndAppendSearch();
    this.createAndAppendValues();
  }

  private createAndAppendHeader() {
    this.header = new DynamicFacetHeader(this);
    this.element.appendChild(this.header.element);
  }

  private createAndAppendSearch() {
    if (this.options.enableFacetSearch === false) {
      return;
    }

    this.search = new DynamicFacetSearch(this);
    this.element.appendChild(this.search.element);
  }

  private createAndAppendValues() {
    this.element.appendChild(this.values.render());
  }

  private handleFacetValuesChanged() {
    this.updateQueryStateModel();
  }

  private updateQueryStateModel() {
    this.listenToQueryStateChange = false;
    this.updateIncludedQueryStateModel();
    this.listenToQueryStateChange = true;
  }

  private updateIncludedQueryStateModel() {
    this.queryStateModel.set(this.includedAttributeId, this.values.selectedValues);
  }

  private updateAppearance() {
    this.header.toggleClear(this.values.hasSelectedValues);
    this.header.toggleCollapse(this.isCollapsed);
    this.toggleSearchDisplay();
    $$(this.element).toggleClass('coveo-dynamic-facet-collapsed', this.isCollapsed);
    $$(this.element).toggleClass('coveo-active', this.values.hasSelectedValues);
    $$(this.element).toggleClass('coveo-hidden', this.values.isEmpty);
  }

  private toggleSearchDisplay() {
    if (this.options.enableFacetSearch === false) {
      return;
    }

    if (Utils.isUndefined(this.options.enableFacetSearch)) {
      $$(this.search.element).toggle(this.moreValuesAvailable);
    }

    if (this.isCollapsed) {
      $$(this.search.element).toggle(false);
    }
  }

  public triggerNewQuery(beforeExecuteQuery?: () => void) {
    this.beforeSendingQuery();

    const options: IQueryOptions = beforeExecuteQuery ? { beforeExecuteQuery } : { ignoreWarningSearchEvent: true };

    this.queryController.executeQuery(options);
  }

  public async triggerNewIsolatedQuery(beforeExecuteQuery?: () => void) {
    this.beforeSendingQuery();
    beforeExecuteQuery && beforeExecuteQuery();

    try {
      const results = await this.dynamicFacetQueryController.executeIsolatedQuery();
      this.handleQuerySuccess(results);
    } catch (e) {
      this.header.hideLoading();
    }
  }

  private beforeSendingQuery() {
    this.header.showLoading();
    this.updateAppearance();
  }

  private notImplementedError() {
    this.logger.error('DynamicFacets are not supported by your current search endpoint. Disabling this component.');
    this.disable();
    this.updateAppearance();
  }

  private verifyCollapsingConfiguration() {
    if (this.options.collapsedByDefault && !this.options.enableCollapse) {
      this.logger.warn('The "collapsedByDefault" option is "true" while the "enableCollapse" is "false"');
    }
  }

  private logAnalyticsFacetShowMoreLess(cause: IAnalyticsActionCause) {
    this.usageAnalytics.logCustomEvent<IAnalyticsDynamicFacetMeta>(cause, this.basicAnalyticsFacetState, this.element);
  }
}

Initialization.registerAutoCreateComponent(DynamicFacet);
DynamicFacet.doExport();
