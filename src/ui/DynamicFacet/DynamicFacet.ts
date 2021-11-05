import 'styling/DynamicFacet/_DynamicFacet';
import { IDynamicFacet, IDynamicFacetOptions } from './IDynamicFacet';
import { difference, findIndex } from 'underscore';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
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
import { IStringMap } from '../../rest/GenericParam';
import { isFacetSortCriteria, FacetSortCriteria } from '../../rest/Facet/FacetSortCriteria';
import { l } from '../../strings/Strings';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { IAnalyticsActionCause, analyticsActionCauseList, IAnalyticsFacetMeta } from '../Analytics/AnalyticsActionListMeta';
import { IAnalyticsFacetState } from '../Analytics/IAnalyticsFacetState';
import { IQueryOptions } from '../../controllers/QueryController';
import { DynamicFacetManager } from '../DynamicFacetManager/DynamicFacetManager';
import { QueryBuilder } from '../Base/QueryBuilder';
import { DynamicFacetSearch } from '../DynamicFacetSearch/DynamicFacetSearch';
import { ResultListUtils } from '../../utils/ResultListUtils';
import { IQueryResults } from '../../rest/QueryResults';
import { FacetType } from '../../rest/Facet/FacetRequest';
import { DependsOnManager, IDependentFacet, IDependentFacetCondition } from '../../utils/DependsOnManager';
import { DynamicFacetValueCreator } from './DynamicFacetValues/DynamicFacetValueCreator';
import { Logger } from '../../misc/Logger';
import { FacetUtils } from '../Facet/FacetUtils';

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
 * @availablesince [May 2019 Release (v2.6063)](https://docs.coveo.com/en/2909/)
 */
export class DynamicFacet extends Component implements IDynamicFacet {
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
     * Defaults to the [`field`]{@link DynamicFacet.options.field} option value.
     *
     * @examples author-facet
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value = '', options: IDynamicFacetOptions) => {
        const maxCharLength = 60;
        const sanitizedValue = value.replace(/[^A-Za-z0-9-_@]+/g, '');
        if (Utils.isNonEmptyString(sanitizedValue)) {
          return sanitizedValue.slice(0, maxCharLength - 1);
        }

        return options.field.slice(0, maxCharLength - 1);
      },
      section: 'CommonOptions'
    }),

    /**
     * The title to display for this facet.
     *
     * Defaults to the localized string for `NoTitle`.
     *
     * @examples Author
     */
    title: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('NoTitle'),
      section: 'CommonOptions',
      priority: 10
    }),

    /**
     * The name of the field on which to base this facet.
     *
     * Must be prefixed by `@`, and must reference an existing field whose
     * **Facet** option is enabled.
     *
     * @externaldocs [Add or Edit Fields](https://docs.coveo.com/en/1982/)
     * @examples @author
     */
    field: ComponentOptions.buildFieldOption({ required: true, section: 'CommonOptions' }),

    /**
     * The sort criterion to use for this facet.
     *
     * See [`FacetSortCriteria`]{@link FacetSortCriteria} for the list and
     * description of allowed values.
     *
     * By default, the following behavior applies:
     *
     * - If the requested [`numberOfValues`]{@link DynamicFacet.options.numberOfValues}
     * is greater than or equal to the currently displayed number of values,
     * the [`alphanumeric`]{@link FacetSortCriteria.alphanumeric} criterion is
     * used.
     * - If the requested `numberOfValues` is less than the currently displayed
     * number of values and the facet is not currently expanded, the [`score`]{@link FacetSortCriteria.score}
     * criterion is used.
     * - Otherwise, the `alphanumeric` criterion is used.
     *
     * @examples score
     */
    sortCriteria: <FacetSortCriteria>ComponentOptions.buildStringOption({
      postProcessing: value => {
        if (!value) {
          return undefined;
        }

        if (isFacetSortCriteria(value)) {
          return value;
        }

        new Logger(value).warn('sortCriteria is not of the the allowed values: "score", "alphanumeric", "occurrences"');
        return undefined;
      },
      section: 'Sorting'
    }),

    /**
     * Specifies a custom order by which to sort the dynamic facet values.
     *
     * Custom-ordered values won't necessarily retrieve values from the index.
     *
     * **Example:**
     *
     * You could use this option to specify a logical order for support tickets, such as:
     * ```html
     * <div class="CoveoDynamicFacet" data-field="@ticketstatus" data-title="Ticket Status" data-tab="All" data-custom-sort="New,Opened,Feedback,Resolved"></div>
     * ```
     *
     * **Note:**
     * > The [`DynamicFacetRange`]{@link DynamicFacetRange} component does not support this option.
     */
    customSort: ComponentOptions.buildListOption<string>({ section: 'Sorting' }),

    /**
     * The number of values to request for this facet.
     *
     * Also determines the default maximum number of additional values to request each time this facet is expanded,
     * and the maximum number of values to display when this facet is collapsed (see the [`enableCollapse`]{@link DynamicFacet.options.enableCollapse} option).
     */
    numberOfValues: ComponentOptions.buildNumberOption({ min: 0, defaultValue: 8, section: 'CommonOptions' }),

    /**
     * Whether to allow the end-user to expand and collapse this facet.
     */
    enableCollapse: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * Whether to scroll back to the top of the page whenever the end-user interacts with the facet.
     */
    enableScrollToTop: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * Whether to enable the **Show more** and **Show less** buttons in the facet.
     *
     * **Note:** The [`DynamicFacetRange`]{@link DynamicFacetRange} component does not support this option.
     */
    enableMoreLess: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * Whether to allow the end-user to search the facet values.
     *
     * **Note:** The [`DynamicFacetRange`]{@link DynamicFacetRange} component does not support this option.
     *
     * By default, the following behavior applies:
     *
     * - Enabled when more facet values are available.
     * - Disabled when all available facet values are already displayed.
     */
    enableFacetSearch: ComponentOptions.buildBooleanOption({ section: 'Filtering' }),

    /**
     * Whether to prepend facet search queries with a wildcard.
     *
     * **Note:** The [`DynamicFacetRange`]{@link DynamicFacetRange} component does not support this option.
     */
    useLeadingWildcardInFacetSearch: ComponentOptions.buildBooleanOption({
      defaultValue: true,
      section: 'Filtering',
      depend: 'enableFacetSearch'
    }),

    /**
     * Whether this facet should be collapsed by default.
     */
    collapsedByDefault: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'CommonOptions', depend: 'enableCollapse' }),

    /**
     * Whether to notify the [`Breadcrumb`]{@link Breadcrumb} component when toggling values in the facet.
     *
     * See also the [`numberOfValuesInBreadcrumb`]{@link DynamicFacet.options.numberOfValuesInBreadcrumb} option.
     */
    includeInBreadcrumb: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * The maximum number of selected values the [`Breadcrumb`]{@link Breadcrumb} component can display before outputting a **N more...** link for the facet.
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
     * **Note:** The [`DynamicFacetRange`]{@link DynamicFacetRange} component does not support this option.
     *
     * @externaldocs [Normalizing Facet Value Captions](https://docs.coveo.com/368/).
     * @examples { "smith_alice": "Alice Smith"\, "jones_bob_r": "Bob R. Jones" }
     */
    valueCaption: ComponentOptions.buildJsonOption<IStringMap<string>>({ defaultValue: {} }),

    /**
     * The [`id`]{@link DynamicFacet.options.id} of another facet in which at least one value must be selected in order for the dependent facet to be visible.
     *
     * By default, the facet does not depend on any other facet to be displayed.
     *
     * @examples document-type-facet
     *
     * @availablesince [December 2019 Release (v2.7610)](https://docs.coveo.com/en/3142/)
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
     *
     * @availablesince [April 2020 Release (v2.8864)](https://docs.coveo.com/en/3231/)
     */
    dependsOnCondition: ComponentOptions.buildCustomOption<IDependentFacetCondition>(
      () => {
        return null;
      },
      { depend: 'dependsOn', section: 'CommonOptions' }
    ),

    /**
     * The number of items to scan for facet values.
     *
     * Setting this option to a higher value may enhance the accuracy of facet value counts at the cost of slower query performance.
     *
     * @availablesince [January 2020 Release (v2.7968)](https://docs.coveo.com/en/3163/)
     */
    injectionDepth: ComponentOptions.buildNumberOption({ defaultValue: 1000, min: 0 }),

    /**
     * Whether to exclude folded result parents when estimating result counts for facet values.
     *
     * **Note:** The target folding field must be a facet field with the **Use cache for nested queries** options enabled (see [Add or Edit a Field](https://docs.coveo.com/en/1982)).
     *
     * See also the [`Folding`]{@link Folding} and [`FoldingForThread`]{@link FoldingForThread} components.
     *
     * **Default:** `false` if folded results are requested; `true` otherwise.
     *
     * @availablesince [March 2020 Release (v2.8521)](https://docs.coveo.com/en/3203/)
     */
    filterFacetCount: ComponentOptions.buildBooleanOption({ section: 'Filtering' })
  };

  private includedAttributeId: string;
  private listenToQueryStateChange = true;
  private search: DynamicFacetSearch;
  public header: DynamicFacetHeader;

  public options: IDynamicFacetOptions;
  public dynamicFacetManager: DynamicFacetManager;
  public dependsOnManager: DependsOnManager;
  public dynamicFacetQueryController: DynamicFacetQueryController;
  public values: DynamicFacetValues;
  public position: number;
  public moreValuesAvailable = false;
  public isCollapsed: boolean;
  public isDynamicFacet = true;
  public isFieldValueCompatible = true;

  /**
   * Creates a new `DynamicFacet` instance.
   *
   * @param element The element from which to instantiate the component.
   * @param options The component options.
   * @param bindings The component bindings. Automatically resolved by default.
   */
  constructor(
    public element: HTMLElement,
    options?: IDynamicFacetOptions,
    bindings?: IComponentBindings,
    classId: string = DynamicFacet.ID
  ) {
    super(element, classId, bindings);
    this.options = ComponentOptions.initComponentOptions(element, DynamicFacet, options);

    this.initDynamicFacetQueryController();
    this.initDependsOnManager();
    this.initQueryEvents();
    this.initQueryStateEvents();
    this.initBreadCrumbEvents();
    this.initComponentStateEvents();
    this.initValues();
    this.verifyCollapsingConfiguration();
    this.isCollapsed = this.options.enableCollapse && this.options.collapsedByDefault;

    ResponsiveDynamicFacets.init(this.root, this, this.options);
  }

  public get fieldName() {
    return this.options.field.slice(1);
  }

  public get facetType() {
    return FacetType.specific;
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
    this.updateQueryStateModel();
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
   * Determines whether the specified value is selected in the facet.
   * @param value The name of the facet value to verify.
   */
  public hasSelectedValue(value: string) {
    return this.values.hasSelectedValue(value);
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
    this.updateQueryStateModel();
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
    const facetValue = this.values.get(value);
    facetValue.toggleSelect();
    this.logger.info('Toggle select facet value', facetValue);
    this.updateQueryStateModel();
  }

  /**
   * Returns the configured caption for a desired facet value.
   *
   * @param value The string facet value whose caption the method should return.
   */
  public getCaptionForStringValue(value: string) {
    return FacetUtils.getDisplayValueFromValueCaption(value, this.options.field as string, this.options.valueCaption);
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
    if (this.values.hasActiveValues) {
      this.logger.info('Deselect all values');
      this.values.clearAll();
      this.values.render();
    }
    this.enablePreventAutoSelectionFlag();
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
    this.dynamicFacetQueryController.enableFreezeFacetOrderFlag();
  }

  public enablePreventAutoSelectionFlag() {
    this.dynamicFacetQueryController.enablePreventAutoSelectionFlag();
  }

  public scrollToTop() {
    if (this.options.enableScrollToTop) {
      ResultListUtils.scrollToTop(this.root);
    }
  }

  public get analyticsFacetState(): IAnalyticsFacetState[] {
    return this.values.activeValues.map(facetValue => facetValue.analyticsFacetState);
  }

  public get basicAnalyticsFacetState(): IAnalyticsFacetState {
    return {
      field: this.options.field.toString(),
      id: this.options.id,
      title: this.options.title,
      facetType: this.facetType,
      facetPosition: this.position
    };
  }

  public get basicAnalyticsFacetMeta(): IAnalyticsFacetMeta {
    return {
      facetField: this.options.field.toString(),
      facetId: this.options.id,
      facetTitle: this.options.title
    };
  }

  public logAnalyticsEvent(actionCause: IAnalyticsActionCause, facetMeta: IAnalyticsFacetMeta) {
    this.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(actionCause, facetMeta);
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
    return $$(this.element).isVisible();
  }

  public get hasActiveValues() {
    return this.values.hasActiveValues;
  }

  private initQueryEvents() {
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.ensureDom());
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (data: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(data));
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data.results));
    this.bind.onRootElement(QueryEvents.queryError, () => this.onNoValues());
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

  protected initValues() {
    this.values = new DynamicFacetValues(this, DynamicFacetValueCreator);
  }

  private initComponentStateEvents() {
    const componentStateId = QueryStateModel.getFacetId(this.options.id);
    this.componentStateModel.registerComponent(componentStateId, this);
  }

  protected initDynamicFacetQueryController() {
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
    this.updateQueryStateModel();
    this.values.render();
    this.updateAppearance();
  }

  private onNewValues(facetResponse: IFacetResponse) {
    this.moreValuesAvailable = facetResponse.moreValuesAvailable;
    this.values.createFromResponse(facetResponse);
    if (this.options.customSort) {
      this.values.reorderValues(this.options.customSort);
    }
  }

  private onNoValues() {
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
    const validQuerySelectedValues = querySelectedValues.filter(value => this.values.get(value));

    const valuesToSelect = difference(validQuerySelectedValues, currentSelectedValues);
    const valuesToDeselect = difference(currentSelectedValues, validQuerySelectedValues);

    if (Utils.isNonEmptyArray(valuesToSelect)) {
      this.selectMultipleValues(valuesToSelect);
    }

    if (Utils.isNonEmptyArray(valuesToDeselect)) {
      this.deselectMultipleValues(valuesToDeselect);
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

  private initDependsOnManager() {
    const facetInfo: IDependentFacet = {
      reset: () => this.reset(),
      ref: this
    };

    this.dependsOnManager = new DependsOnManager(facetInfo);
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
    this.header = new DynamicFacetHeader({
      id: this.options.id,
      title: this.options.title,
      enableCollapse: this.options.enableCollapse,
      clear: () => this.clear(),
      toggleCollapse: () => this.toggleCollapse(),
      collapse: () => this.collapse(),
      expand: () => this.expand()
    });
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

  private updateQueryStateModel() {
    this.listenToQueryStateChange = false;
    this.queryStateModel.set(this.includedAttributeId, this.values.selectedValues);
    this.listenToQueryStateChange = true;
  }

  private updateAppearance() {
    this.header.toggleClear(this.values.hasSelectedValues);
    this.header.toggleCollapse(this.isCollapsed);
    this.toggleSearchDisplay();
    $$(this.element).toggleClass('coveo-dynamic-facet-collapsed', this.isCollapsed);
    $$(this.element).toggleClass('coveo-active', this.values.hasSelectedValues);
    $$(this.element).toggleClass('coveo-hidden', !this.values.hasDisplayedValues);
  }

  private toggleSearchDisplay() {
    if (this.options.enableFacetSearch === false) {
      return;
    }

    if (this.isCollapsed) {
      return $$(this.search.element).toggleClass('coveo-hidden', true);
    }

    $$(this.search.element).toggleClass('coveo-hidden', !this.options.enableFacetSearch && !this.moreValuesAvailable);
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
      const results = await this.dynamicFacetQueryController.getQueryResults();
      this.handleQueryResults(results);
    } catch (e) {
      this.header.hideLoading();
    }
  }

  private beforeSendingQuery() {
    this.header.showLoading();
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
    this.usageAnalytics.logCustomEvent<IAnalyticsFacetMeta>(cause, this.basicAnalyticsFacetMeta, this.element);
  }

  private clear() {
    this.reset();
    this.enableFreezeFacetOrderFlag();
    this.scrollToTop();
    this.triggerNewQuery(() => this.logClearAllToAnalytics());
  }

  private logClearAllToAnalytics() {
    this.logAnalyticsEvent(analyticsActionCauseList.dynamicFacetClearAll, this.basicAnalyticsFacetMeta);
  }
}

Initialization.registerAutoCreateComponent(DynamicFacet);
DynamicFacet.doExport();
