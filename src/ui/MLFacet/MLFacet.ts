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
import { MLFacetHeader } from './MLFacetHeader/MLFacetHeader';
import { MLFacetValues } from './MLFacetValues/MLFacetValues';
import { QueryEvents, IQuerySuccessEventArgs, IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { QueryStateModel } from '../../models/QueryStateModel';
import { MLFacetQueryController } from '../../controllers/MLFacetQueryController';
import { Utils } from '../../utils/Utils';
import { MODEL_EVENTS, IAttributesChangedEventArg } from '../../models/Model';
import { Assert } from '../../misc/Assert';
import { IFacetResponseValue } from '../../rest/Facet/FacetResponse';
import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { IStringMap } from '../../rest/GenericParam';
import { isFacetSortCriteria } from '../../rest/Facet/FacetSortCriteria';
import { l } from '../../strings/Strings';

export interface IMLFacetOptions extends IResponsiveComponentOptions {
  id?: string;
  title?: string;
  field?: IFieldOption;
  sortCriteria?: string;
  numberOfValues?: number;
  enableCollapse?: boolean;
  collapsedByDefault?: boolean;
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
     * **Default:** The [`field`]{@link MLFacet.options.field} option value.
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value, options: IMLFacetOptions) => value || (options.field as string)
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
     * The maximum number of values to request for this facet.
     *
     * **Minimum:** `0`
     *
     * **Default:** `undefined`, and the default Search API value (`8`)
     * is used.
     */
    numberOfValues: ComponentOptions.buildNumberOption({ min: 0, section: 'CommonOptions' }),

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
     * Default value is `false`
     */
    collapsedByDefault: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }),

    /**
     * A mapping of facet values to their desired captions.
     *
     * See [Normalizing Facet Value Captions](https://developers.coveo.com/x/jBsvAg).
     *
     */
    valueCaption: ComponentOptions.buildJsonOption<IStringMap<string>>()
  };

  public mLFacetQueryController: MLFacetQueryController;
  private includedAttributeId: string;
  private listenToQueryStateChange = true;
  private header: MLFacetHeader;
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

    this.values = new MLFacetValues(this);

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
   * Deselects all values in this facet.
   *
   * Does not trigger a query automatically.
   * Updates the visual of the facet.
   *
   */
  public reset() {
    this.ensureDom();
    this.values.clearAll();
    this.values.render();
    this.updateAppearance();
    this.updateQueryStateModel();
  }

  private initQueryEvents() {
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.ensureDom());
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (data: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(data));
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
    this.bind.onRootElement(QueryEvents.queryError, () => this.onQueryResponse([]));
  }

  private initQueryStateEvents() {
    this.includedAttributeId = QueryStateModel.getFacetId(this.options.id);
    this.queryStateModel.registerNewAttribute(this.includedAttributeId, []);
    this.bind.onQueryState(MODEL_EVENTS.CHANGE, undefined, this.handleQueryStateChanged);
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

    const facetResponse = findWhere(data.results.facets, { field: this.fieldName });

    if (!facetResponse) {
      this.fieldDoesNotExistError();
    }

    this.onQueryResponse(facetResponse.values);
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
    this.header.toggleClear(this.values.hasSelectedValues());
    $$(this.element).toggleClass('coveo-active', this.values.hasSelectedValues());
    $$(this.element).toggleClass('coveo-hidden', this.values.isEmpty());
  }

  public triggerNewQuery() {
    this.beforeSendingQuery();
    this.queryController.executeQuery();
  }

  private beforeSendingQuery() {
    this.header.showLoading();
    this.updateAppearance();
  }

  private onQueryResponse(values: IFacetResponseValue[]) {
    this.header.hideLoading();
    this.values.createFromResults(values);
    this.values.render();
    this.updateAppearance();
  }

  private notImplementedError() {
    this.logger.error('MLFacets are not supported by your current search endpoint. Disabling this component.');
    this.disable();
  }

  private fieldDoesNotExistError() {
    this.logger.error(`There are no facet results for the field ${this.options.field}. Disabling this component.`);
    this.disable();
  }
}

Initialization.registerAutoCreateComponent(MLFacet);
MLFacet.doExport();
