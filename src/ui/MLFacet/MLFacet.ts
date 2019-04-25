import 'styling/MLFacet/_MLFacet';
import { difference, findWhere } from 'underscore';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { ResponsiveFacetOptions } from '../ResponsiveComponents/ResponsiveFacetOptions';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import { MLFacetBreadcrumbs } from './MLFacetBreadcrumbs';
import { MLFacetHeader } from './MLFacetHeader/MLFacetHeader';
import { MLFacetValues } from './MLFacetValues/MLFacetValues';
import { QueryEvents, IQuerySuccessEventArgs, IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { QueryStateModel } from '../../models/QueryStateModel';
import { MLFacetQueryController } from '../../controllers/MLFacetQueryController';
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

export interface IMLFacetOptions extends IResponsiveComponentOptions {
  id?: string;
  title?: string;
  field?: IFieldOption;
  sortCriteria?: string;
  numberOfValues?: number;
  enableCollapse?: boolean;
  collapsedByDefault?: boolean;
  includeInBreadcrumb?: boolean;
  numberOfValuesInBreadcrumb?: number;
  valueCaption?: any;
}

/**
 * Renders a facet in the search interface.
 */
export class MLFacet extends Component {
  static ID = 'MLFacet';
  static doExport = () => exportGlobally({ MLFacet });

  /**
   * The options for the MLFacet
   * @componentOptions
   */
  static options: IMLFacetOptions = {
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
     * **Default:** The [`field`]{@link MLFacet.options.field} option value.
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value = '', options: IMLFacetOptions) => {
        const maxCharLength = 60;
        const sanitizedValue = value.replace(/[^A-Za-z0-9-_]+/g, '');
        if (Utils.isNonEmptyString(sanitizedValue)) {
          return sanitizedValue.slice(0, maxCharLength - 1);
        }

        return options.field.slice(1, maxCharLength);
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
     * - If the requested [`numberOfValues`]{@link MLFacet.options.numberOfValues}
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
     * and the maximum number of values to display when this facet is collapsed (see [enableCollapse]{@link MLFacet.options.enableCollapse}).
     *
     * **Default:** `8`
     */
    numberOfValues: ComponentOptions.buildNumberOption({ min: 0, defaultValue: 8, section: 'CommonOptions' }),

    /**
     * Whether to allow the end-user to expand and collapse this facet.
     *
     * **Default:** `false`
     */
    enableCollapse: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }),

    /**
     * Whether this facet should be collapsed by default.
     *
     * See also the [`enableCollapse`]{@link MLFacet.options.enableCollapse}
     * option.
     *
     * **Default:** `false`
     */
    collapsedByDefault: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }),

    /**
     * Whether to notify the [Breadcrumb]{@link Breadcrumb} component when toggling values in the facet.
     *
     * See also the [numberOfValuesInBreadcrumb]{@link MLFacet.options.numberOfValuesInBreadcrumb} option.
     *
     * **Default:** `true`
     */
    includeInBreadcrumb: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * The maximum number of selected values the [`Breadcrumb`]{@link Breadcrumb} component can display before outputting a **N more...** link for the facet.
     *
     * **Note:** This option only has a meaning when the [`includeInBreadcrumb`]{@link MLFacet.options.includeInBreadcrumb} option is set to `true`.
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
     */
    valueCaption: ComponentOptions.buildJsonOption<IStringMap<string>>()
  };

  private mLFacetQueryController: MLFacetQueryController;
  private includedAttributeId: string;
  private listenToQueryStateChange = true;
  private header: MLFacetHeader;
  private isCollapsed: boolean;
  public values: MLFacetValues;

  /**
   * Creates a new `MLFacet` instance.
   *
   * @param element The element from which to instantiate the component.
   * @param options The component options.
   * @param bindings The component bindings. Automatically resolved by default.
   */
  constructor(public element: HTMLElement, public options?: IMLFacetOptions, bindings?: IComponentBindings) {
    super(element, MLFacet.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, MLFacet, options);

    this.initMLFacetQueryController();
    this.initQueryEvents();
    this.initQueryStateEvents();
    this.initBreadCrumbEvents();

    this.values = new MLFacetValues(this);
    this.isCollapsed = this.options.enableCollapse && this.options.collapsedByDefault;

    ResponsiveFacets.init(this.root, this, this.options);
  }

  public get fieldName() {
    return this.options.field.slice(1);
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
    values.forEach(value => {
      this.logger.info('Selecting facet value', this.values.get(value).select());
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
    values.forEach(value => {
      this.logger.info('Deselecting facet value', this.values.get(value).deselect());
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
  public toggleSelectValue(value: string): void {
    Assert.exists(value);
    this.ensureDom();
    this.logger.info('Toggle select facet value', this.values.get(value).toggleSelect());
    this.handleFacetValuesChanged();
  }

  /**
   * Requests additional values.
   *
   * Automatically triggers a query.
   * @param additionalNumberOfValues The number of additional values to request. Minimum value is 1. Defaults to the [numberOfValues]{@link MLFacet.options.numberOfValues} option value.
   */
  public showMoreValues(additionalNumberOfValues = this.options.numberOfValues): void {
    this.ensureDom();
    this.logger.info('Show more values');
    this.mLFacetQueryController.increaseNumberOfValuesToRequest(additionalNumberOfValues);
    this.triggerNewQuery();
  }

  /**
   * Reduces the number of displayed facet values down to [numberOfValues]{@link MLFacet.options.numberOfValues}.
   *
   * Automatically triggers a query.
   */
  public showLessValues(): void {
    this.ensureDom();
    this.logger.info('Show less values');
    this.mLFacetQueryController.resetNumberOfValuesToRequest();
    this.triggerNewQuery();
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
    this.ensureDom();
    this.logger.info('Expand facet values');
    this.isCollapsed = false;
    this.updateAppearance();
  }

  /**
   * Collapses the facet, displaying only its currently selected values.
   */
  public collapse() {
    this.ensureDom();
    this.logger.info('Collapse facet values');
    this.isCollapsed = true;
    this.updateAppearance();
  }

  /**
   * Sets a flag indicating whether the facet values should be returned in their current order.
   *
   * Setting the flag to true helps ensuring that the values do not move around while the end-user is interacting with them.
   *
   * The flag is automatically set back to false after a query is built.
   */
  public enableFreezeCurrentValuesFlag() {
    Assert.exists(this.mLFacetQueryController);
    this.mLFacetQueryController.enableFreezeCurrentValuesFlag();
  }

  private initQueryEvents() {
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.ensureDom());
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (data: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(data));
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
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

  private initMLFacetQueryController() {
    this.mLFacetQueryController = new MLFacetQueryController(this);
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);
    const queryBuilder = data.queryBuilder;
    this.mLFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    if (Utils.isNullOrUndefined(data.results.facets)) {
      return this.notImplementedError();
    }

    const response = findWhere(data.results.facets, { facetId: this.options.id });

    this.onQueryResponse(response);
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
    const valuesToDeselect = difference(currentSelectedValues, querySelectedValues);
    if (Utils.isNonEmptyArray(valuesToDeselect)) {
      this.deselectMultipleValues(valuesToDeselect);
    }
    if (!Utils.arrayEqual(currentSelectedValues, querySelectedValues, false)) {
      this.selectMultipleValues(querySelectedValues);
    }
  };

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    Assert.exists(args);

    if (!this.values.hasActiveValues) {
      return;
    }

    const breadcrumbs = new MLFacetBreadcrumbs(this);
    args.breadcrumbs.push({ element: breadcrumbs.element });
  }

  public createDom() {
    this.createContent();
    this.updateAppearance();
  }

  private createContent() {
    this.header = this.createHeader();
    this.element.appendChild(this.header.element);
    this.element.appendChild(this.values.render());
  }

  private createHeader() {
    return new MLFacetHeader(this);
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
    $$(this.element).toggleClass('coveo-ml-facet-collapsed', this.isCollapsed);
    $$(this.element).toggleClass('coveo-active', this.values.hasSelectedValues);
    $$(this.element).toggleClass('coveo-hidden', this.values.isEmpty);
  }

  public triggerNewQuery() {
    this.beforeSendingQuery();
    this.queryController.executeQuery();
  }

  private beforeSendingQuery() {
    this.header.showLoading();
    this.updateAppearance();
  }

  private onQueryResponse(response?: IFacetResponse) {
    this.header.hideLoading();
    response ? this.values.createFromResponse(response) : this.values.resetValues();
    this.values.render();
    this.updateAppearance();
  }

  private notImplementedError() {
    this.logger.error('MLFacets are not supported by your current search endpoint. Disabling this component.');
    this.disable();
    this.updateAppearance();
  }
}

Initialization.registerAutoCreateComponent(MLFacet);
MLFacet.doExport();
