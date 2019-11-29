import 'styling/DynamicFacet/_DynamicFacet';
import { Component } from '../Base/Component';
import { l } from '../../strings/Strings';
import { IFieldOption, ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import { CategoryFacetQueryController } from '../../controllers/DynamicCategoryFacetQueryController';
import { QueryStateModel } from '../../models/QueryStateModel';
import { IAttributesChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { Utils } from '../../utils/Utils';
import { isArray, findIndex } from 'underscore';
import { Assert } from '../../misc/Assert';
import { QueryEvents, IQuerySuccessEventArgs, IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { CategoryFacetBreadcrumb } from './CategoryFacetBreadcrumb';
import { ISearchEndpoint } from '../../rest/SearchEndpointInterface';
import {
  IAnalyticsCategoryFacetMeta,
  analyticsActionCauseList,
  IAnalyticsActionCause,
  IAnalyticsFacetMeta
} from '../Analytics/AnalyticsActionListMeta';
import { QueryBuilder } from '../Base/QueryBuilder';
import { IAutoLayoutAdjustableInsideFacetColumn } from '../SearchInterface/FacetColumnAutoLayoutAdjustment';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { ResponsiveFacetOptions } from '../ResponsiveComponents/ResponsiveFacetOptions';
import { DynamicFacetHeader } from '../DynamicFacet/DynamicFacetHeader/DynamicFacetHeader';
import { IStringMap } from '../../rest/GenericParam';
import { DependsOnManager, IDependentFacet } from '../../utils/DependsOnManager';
import { ResultListUtils } from '../../utils/ResultListUtils';
import { FacetType } from '../../rest/Facet/FacetRequest';
import { CategoryFacetValues } from './CategoryFacetValues/CategoryFacetValues';
import { IFacetResponse } from '../../rest/Facet/FacetResponse';
import { IQueryOptions } from '../../controllers/QueryController';
import { IQueryResults } from '../../rest/QueryResults';
import { CategoryFacetValue } from './CategoryFacetValues/CategoryFacetValue';

export interface ICategoryFacetOptions extends IResponsiveComponentOptions {
  id?: string;
  field: IFieldOption;
  title?: string;
  enableCollapse?: boolean;
  collapsedByDefault?: boolean;
  enableScrollToTop?: boolean;
  enableFacetSearch?: boolean;
  facetSearchDelay?: number;
  numberOfResultsInFacetSearch?: number;
  numberOfValues?: number;
  injectionDepth?: number;
  enableMoreLess?: boolean;
  pageSize?: number;
  delimitingCharacter?: string;
  debug?: boolean;
  basePath?: string[];
  maximumDepth?: number;
  valueCaption?: IStringMap<string>;
  dependsOn?: string;
  includeInBreadcrumb?: boolean;
}

export type CategoryValueDescriptor = {
  value: string;
  count: number;
  path: string[];
};

/**
 * The `CategoryFacet` component is a facet that renders values in a hierarchical fashion. It determines the filter to apply depending on the
 * current selected path of values.
 *
 * The path is a sequence of values that leads to a specific value in the hierarchy.
 * It is an array listing all the parents of a file (e.g., `['c', 'folder1']` for the `c:\folder1\text1.txt` file).
 *
 * This facet requires a [`field`]{@link CategoryFacet.options.field} with a special format to work correctly (see [Using the Category Facet Component](https://docs.coveo.com/en/2667)).
 *
 * @notSupportedIn salesforcefree
 */
export class CategoryFacet extends Component implements IAutoLayoutAdjustableInsideFacetColumn {
  static doExport = () => {
    exportGlobally({
      CategoryFacet
    });
  };

  static ID = 'CategoryFacet';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: ICategoryFacetOptions = {
    /**
     * A unique identifier for the facet. Among other things, this identifier serves the purpose of saving
     * the facet state in the URL hash.
     *
     * If you have two facets with the same field on the same page, you should specify an `id` value for at least one of
     * those two facets. This `id` must be unique among the facets.
     *
     * Default value is the [`field`]{@link CategoryFacet.options.field} option value.
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value, options: ICategoryFacetOptions) => value || (options.field as string)
    }),

    /**
     * The index field whose values the facet should use. The field values should have the form:
     * `the; the|path; the|path|to; the|path|to|given; the|path|to|given|item;`
     * where the delimiting character is `|`. This default delimiting character can be changed using the [delimitingCharacter]{@link CategoryFacet.options.delimitingCharacter} option.
     *
     * To help you verify whether your fields are setup correctly, see the {@link CategoryFacet.options.debug} option
     * and the {@link CategoryFacet.debugValue} method.
     *
     * See [Using the Category Facet Component](https://docs.coveo.com/en/2667).
     */
    field: ComponentOptions.buildFieldOption({ required: true }),

    /**
     * The title to display at the top of the facet.
     *
     * Default value is the localized string for `NoTitle`.
     */
    title: ComponentOptions.buildLocalizedStringOption({
      defaultValue: l('NoTitle')
    }),

    /**
     * The maximum number of field values to display by default in the facet before the user
     * clicks the arrow to show more.
     *
     * See also the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess} option.
     */
    numberOfValues: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0, section: 'CommonOptions' }),

    /**
    * Whether to allow the end-user to expand and collapse this facet.
    */
    enableCollapse: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'Filtering' }),

    /**
     * Whether this facet should be collapsed by default.
     *
     * See also the [`enableCollapse`]{@link CategoryFacet.options.enableCollapse}
     * option.
     */
    collapsedByDefault: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering', depend: 'enableCollapse' }),

    /**
     * Whether to scroll back to the top of the page whenever the end-user interacts with a facet.
     */
    enableScrollToTop: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * Whether to notify the [Breadcrumb]{@link Breadcrumb} component when toggling values in the facet.
     */
    includeInBreadcrumb: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'CommonOptions' }),

    /**
     * Whether to display a search box at the bottom of the facet for searching among the available facet
     * [`field`]{@link CategoryFacet.options.field} values.
     *
     * See also the [`facetSearchDelay`]{@link CategoryFacet.options.facetSearchDelay}, and
     * [`numberOfResultsInFacetSearch`]{@link CategoryFacet.options.numberOfResultsInFacetSearch} options.
     * 
     */
    enableFacetSearch: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * The *injection depth* to use.
     *
     * The injection depth determines how many results to scan in the index to ensure that the category facet lists all potential
     * facet values. Increasing this value enhances the accuracy of the listed values at the cost of performance.
     *
     * Default value is `1000`. Minimum value is `0`.
     */
    injectionDepth: ComponentOptions.buildNumberOption({ defaultValue: 1000, min: 0 }),

    /**
     * If the [`enableFacetSearch`]{@link CategoryFacet.options.enableFacetSearch} option is `true`, specifies the number of
     * values to display in the facet search results popup.
     *
     * Default value is `15`. Minimum value is `1`.
     */
    numberOfResultsInFacetSearch: ComponentOptions.buildNumberOption({ defaultValue: 15, min: 1 }),

    /**
     * If the [`enableFacetSearch`]{@link CategoryFacet.options.enableFacetSearch} option is `true`, specifies the delay (in
     * milliseconds) before sending a search request to the server when the user starts typing in the category facet search box.
     *
     * Specifying a smaller value makes results appear faster. However, chances of having to cancel many requests
     * sent to the server increase as the user keeps on typing new characters.
     *
     * Default value is `100`. Minimum value is `0`.
     */
    facetSearchDelay: ComponentOptions.buildNumberOption({ defaultValue: 100, min: 0 }),

    /**
     * Whether to enable the **More** and **Less** buttons in the Facet.
     *
     * See also the [`pageSize`]{@link CategoryFacet.options.pageSize} option.
     *
     * Default value is `true`.
     */
    enableMoreLess: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * If the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess} option is `true`, specifies the number of
     * additional results to fetch when clicking the **More** button.
     *
     * Default value is `10`. Minimum value is `1`.
     */
    pageSize: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableMoreLess' }),

    /**
     * The character that specifies the hierarchical dependency.
     *
     * **Example:**
     *
     * If your field has the following values:
     *
     * `@field: c; c>folder2; c>folder2>folder3;`
     *
     * The delimiting character is `>`.
     *
     * Default value is `|`.
     */
    delimitingCharacter: ComponentOptions.buildStringOption({ defaultValue: '|' }),

    /**
     * The path to use as the path prefix for every query.
     *
     * **Example:**
     *
     * You have the following files indexed on a file system:
     * ```
     * c:\
     *    folder1\
     *      text1.txt
     *    folder2\
     *      folder3\
     *        text2.txt
     * ```
     * Setting the `basePath` to `c` would display `folder1` and `folder2` in the `CategoryFacet`, but omit `c`.
     *
     * This options accepts an array of values. To specify a "deeper" starting path in your tree, you need to use comma-separated values.
     *
     * For example, setting `data-base-path="c,folder1"` on the component markup would display `folder3` in the `CategoryFacet`, but omit `c` and `folder1`.
     *
     */
    basePath: ComponentOptions.buildListOption<string>({ defaultValue: [] }),

    /**
     * The maximum number of levels to traverse in the hierarchy.
     * This option does not count the length of the base path. The depth depends on what is shown in the interface.
     *
     * Default value is `Number.MAX_VALUE`.
     */
    maximumDepth: ComponentOptions.buildNumberOption({ min: 1, defaultValue: Number.MAX_VALUE }),

    /**
     * Whether to activate field format debugging.
     * This options logs messages in the console for any potential encountered issues.
     * This option can have negative effects on performance, and should only be activated when debugging.
     */
    debug: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies a JSON object describing a mapping of facet values to their desired captions. See
     * [Normalizing Facet Value Captions](https://developers.coveo.com/x/jBsvAg).
     *
     * **Note:**
     * If this option is specified, the facet search box will be unavailable.
     *
     * **Examples:**
     *
     * You can set the option in the ['init']{@link init} call:
     * ```javascript
     * var myValueCaptions = {
     *   "txt" : "Text files",
     *   "html" : "Web page",
     *   [ ... ]
     * };
     *
     * Coveo.init(document.querySelector("#search"), {
     *   Facet : {
     *     valueCaption : myValueCaptions
     *   }
     * });
     * ```
     *
     * Or before the `init` call, using the ['options']{@link options} top-level function:
     * ```javascript
     * Coveo.options(document.querySelector("#search"), {
     *   Facet : {
     *     valueCaption : myValueCaptions
     *   }
     * });
     * ```
     *
     * Or directly in the markup:
     * ```html
     * <!-- Ensure that the double quotes are properly handled in data-value-caption. -->
     * <div class='CoveoCategoryFacet' data-field='@myotherfield' data-value-caption='{"txt":"Text files","html":"Web page"}'></div>
     * ```
     */
    valueCaption: ComponentOptions.buildJsonOption<IStringMap<string>>({ defaultValue: {} }),

    /**
     * The id of another facet in which at least one value must be selected in order
     * for the dependent category facet to be visible.
     *
     * **Default:** `undefined` and the category facet does not depend on any other facet to be displayed.
     */
    dependsOn: ComponentOptions.buildStringOption(),
    ...ResponsiveFacetOptions
  };

  public categoryFacetQueryController: CategoryFacetQueryController;
  public listenToQueryStateChange = true;
  public positionInQuery: number;
  public dependsOnManager: DependsOnManager;
  public isCollapsed: boolean;
  public header: DynamicFacetHeader;
  public values: CategoryFacetValues;
  public moreValuesAvailable = false;
  public position: Number = null;

  // TODO: add truncating
  public static MAXIMUM_NUMBER_OF_VALUES_BEFORE_TRUNCATING = 15;
  public static NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING = 10;

  constructor(public element: HTMLElement, public options: ICategoryFacetOptions, bindings?: IComponentBindings) {
    super(element, 'CategoryFacet', bindings);
    this.options = ComponentOptions.initComponentOptions(element, CategoryFacet, options);

    this.categoryFacetQueryController = new CategoryFacetQueryController(this);
    this.isCollapsed = this.options.enableCollapse && this.options.collapsedByDefault;;
    this.values = new CategoryFacetValues(this);

    this.tryToInitFacetSearch();

    if (this.options.debug) {
      // TODO: reimplement debug functionality
    }

    ResponsiveFacets.init(this.root, this, this.options);
    this.initDependsOnManager();
    this.initBreadCrumbEvents();
    this.initQueryEvents();
    this.buildFacetHeader();
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

  private initQueryEvents() {
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (data: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(data));
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data.results));
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.ensureDom());
  }

  private initBreadCrumbEvents() {
    if (this.options.includeInBreadcrumb) {
      this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) =>
        this.handlePopulateBreadcrumb(args)
      );
      this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.clear());
    }
  }

  public get activePath(): string[] {
    return this.queryStateModel.get(this.queryStateAttribute) || this.options.basePath;
  }

  public get queryStateAttribute() {
    return QueryStateModel.getFacetId(this.options.id);
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);
    this.putStateIntoQueryBuilder(data.queryBuilder);
  }

  public putStateIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);
    this.categoryFacetQueryController.putFacetIntoQueryBuilder(queryBuilder);
  }

  public scrollToTop() {
    if (this.options.enableScrollToTop) {
      ResultListUtils.scrollToTop(this.root);
    }
  }

  private tryToInitFacetSearch() {
    // TODO: add new facet search
    return this.logDisabledFacetSearchWarning();
  }

  private logDisabledFacetSearchWarning() {
    if (!this.options.enableFacetSearch) {
      return;
    }

    const valueCaptionAttributeName = this.getOptionAttributeName('valueCaption');
    const enableFacetSearchAttributeName = this.getOptionAttributeName('enableFacetSearch');
    const field = this.options.field;

    this.logger.warn(`The search box is disabled on the ${field} CategoryFacet. To hide this warning,
    either remove the ${valueCaptionAttributeName} option or set the ${enableFacetSearchAttributeName} option to "false".`);
  }

  private getOptionAttributeName(optionName: keyof ICategoryFacetOptions) {
    return ComponentOptions.attrNameFromName(optionName);
  }

  private get isCategoryEmpty() {
    return !this.values.allFacetValues.length;
  }

  private updateAppearance() {
    this.header.toggleCollapse(this.isCollapsed);
    $$(this.element).toggleClass('coveo-dynamic-category-facet-collapsed', this.isCollapsed);
    this.show();
    this.dependsOnManager.updateVisibilityBasedOnDependsOn();
    this.isCategoryEmpty && this.hide();
  }

  private handleQuerySuccess(results: IQueryResults) {
    this.header.hideLoading();

    if (Utils.isNullOrUndefined(results.facets)) {
      return this.notImplementedError();
    }

    const index = findIndex(results.facets, { facetId: this.options.id });
    const response = index !== -1 ? results.facets[index] : null;
    this.position = index + 1;

    response ? this.onQueryResponse(response) : this.onNoAdditionalValues();
    this.values.render();
    this.changeActivePath(this.values.selectedPath);
    this.updateAppearance();
  }

  private onQueryResponse(response?: IFacetResponse) {
    this.moreValuesAvailable = response.moreValuesAvailable;
    this.values.createFromResponse(response);
  }

  private onNoAdditionalValues() {
    this.moreValuesAvailable = false;
    this.values.clear();
  }

  /**
   * Changes the active path.
   * 
   * @param path The array of values that represents the path.
   */
  public changeActivePath(path: string[]) {
    this.listenToQueryStateChange = false;
    this.queryStateModel.set(this.queryStateAttribute, path);
    this.listenToQueryStateChange = true;
  }

  private beforeSendingQuery() {
    this.header.showLoading();
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
      const results = await this.categoryFacetQueryController.getQueryResults();
      this.handleQuerySuccess(results);
    } catch (e) {
      this.header.hideLoading();
    }
  }

  /**
   * Reloads the facet with the same path.
   */
  public reload() {
    this.triggerNewQuery(() => this.logAnalyticsEvent(analyticsActionCauseList.categoryFacetReload));
  }

  /**
   * Returns all the visible parent values.
   * @returns simple object with three fields: `value`, `count` and `path`.
   * @deprecated
   */
  public getVisibleParentValues() {
    return this.mapCategoryValuesToCategoryValueDescriptor(this.values.visibleParentValues);
  }

  /**
  * Returns the values at the bottom of the hierarchy. These are the values that are not yet applied to the query.
  * @returns simple object with three fields: `value`, `count` and `path`.
  * @deprecated
  */
  public getAvailableValues() {
    return this.mapCategoryValuesToCategoryValueDescriptor(this.values.availableValues);
  }

  private mapCategoryValuesToCategoryValueDescriptor(values: CategoryFacetValue[]): CategoryValueDescriptor[] {
    return values.map(facetValue => ({
      value: facetValue.value,
      count: facetValue.numberOfResults,
      path: facetValue.path
    }));
  }

  /**
   * Requests additional values.
   * 
   * See the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess} option.
   *
   * Automatically triggers an isolated query.
   * @param additionalNumberOfValues The number of additional values to request. Minimum value is 1. Defaults to the [pageSize]{@link DynamicFacet.options.pageSize} option value.
   */
  public showMore(additionalNumberOfValues = this.options.pageSize) {
    this.ensureDom();
    this.logger.info('Show more values');
    this.categoryFacetQueryController.increaseNumberOfValuesToRequest(additionalNumberOfValues);
    this.triggerNewIsolatedQuery(() => this.logAnalyticsFacetShowMoreLess(analyticsActionCauseList.facetShowMore));
  }

  /**
   * Reduces the number of displayed facet values down to [numberOfValues]{@link DynamicFacet.options.numberOfValues}.
   *
   * See the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess} option.
   * 
   * Automatically triggers an isolated query.
   */
  public showLess() {
    this.ensureDom();
    this.logger.info('Show less values');
    this.categoryFacetQueryController.resetNumberOfValuesToRequest();
    this.triggerNewIsolatedQuery(() => this.logAnalyticsFacetShowMoreLess(analyticsActionCauseList.facetShowLess));
  }

  /**
   * Selects a value from the currently available values.
   * 
   * Does **not** trigger a query automatically.
   * Does **not** update the visual of the facet until a query is performed.
   * 
   * @param path The value to select.
   * 
   * @deprecated
   */
  public selectValue(value: string) {
    this.selectPath([...this.values.selectedPath, value]);
  }

  /**
   * Deselects the last value in the hierarchy that is applied to the query. When at the top of the hierarchy, this method does nothing.
   
   * Does **not** trigger a query automatically.
   * Does **not** update the visual of the facet until a query is performed.
   * 
   * @deprecated
   */
  public deselectCurrentValue() {
    if (!this.values.hasSelectedValue) {
      return this.logger.warn('No current value to deselect');
    }

    const pathToSelect = this.values.selectedPath.slice(0, -1);
    pathToSelect.length  ? this.selectPath(pathToSelect) : this.clear();
  }

  /**
   * Select a path in the hierarchy.
   * 
   * Does **not** trigger a query automatically.
   * Does **not** update the visual of the facet until a query is performed.
   * 
   * @param path The array of values that represents the path.
   */
  public selectPath(path: string[]) {
    Assert.exists(path);
    Assert.isLargerThan(0, path.length);
    this.ensureDom();
    this.changeActivePath(path);
    this.values.selectPath(path);
    this.logger.info('Toggle select facet value at path', path);
  }

  /**
   * Resets the facet to its initial state.
   * 
   * Automatically triggers a query.
   */
  public reset() {
    this.ensureDom();
    this.clear();
    this.scrollToTop();
    this.triggerNewQuery(() => this.logAnalyticsEvent(analyticsActionCauseList.categoryFacetClear));
  }

  public clear() {
    if (!this.values.hasSelectedValue) {
      return;
    }

    this.logger.info('Clear facet');
    this.values.clear();
    this.changeActivePath([]);
  }

  /**
   * Hides the component.
   */
  public hide() {
    $$(this.element).addClass('coveo-hidden');
  }

  /**
   * Shows the component.
   */
  public show() {
    $$(this.element).removeClass('coveo-hidden');
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
    Assert.exists(this.categoryFacetQueryController);
    this.categoryFacetQueryController.enableFreezeFacetOrderFlag();
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
    this.element.appendChild(this.values.render());
    this.updateAppearance();
  }

  /**
   * Goes through any value that contains the value parameter, and verifies whether there are missing parents.
   * Issues are then logged in the console.
   * If you do not want to specify a value, you can simply enable {@link CategoryFacet.options.debug} and do an empty query.
   */
  public async debugValue(value: string) {
    // TODO: add debug functionality
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

  public logAnalyticsEvent(eventName: IAnalyticsActionCause, path = this.activePath) {
    this.usageAnalytics.logSearchEvent<IAnalyticsCategoryFacetMeta>(eventName, {
      categoryFacetId: this.options.id,
      categoryFacetField: this.options.field.toString(),
      categoryFacetPath: path,
      categoryFacetTitle: this.options.title
    });
  }

  public getEndpoint(): ISearchEndpoint {
    return this.queryController.getEndpoint();
  }

  private buildFacetHeader() {
    this.header = new DynamicFacetHeader({
      title: this.options.title,
      enableCollapse: this.options.enableCollapse,
      clear: () => this.reset(),
      toggleCollapse: () => this.toggleCollapse(),
      expand: () => this.expand(),
      collapse: () => this.collapse(),
    });
    $$(this.element).prepend(this.header.element);
  }

  private pathIsValidForSelection(path: any): path is string[] {
    return !Utils.isNullOrUndefined(path) && isArray(path);
  }

  private handleQueryStateChanged(data: IAttributesChangedEventArg) {
    if (!this.listenToQueryStateChange) {
      return;
    }

    const path = data.attributes[this.queryStateAttribute];
    if (this.pathIsValidForSelection(path)) {
      // TODO: JSUI-2709 add analytics
      path.length ? this.selectPath(path) : this.clear();
    }
  }

  private initQueryStateEvents() {
    this.queryStateModel.registerNewAttribute(this.queryStateAttribute, this.options.basePath);
    this.bind.onQueryState<IAttributesChangedEventArg>(MODEL_EVENTS.CHANGE, undefined, data => this.handleQueryStateChanged(data));
    this.dependsOnManager.listenToParentIfDependentFacet();
  }

  private initDependsOnManager() {
    const facetInfo: IDependentFacet = {
      reset: () => this.dependsOnReset(),
      toggleDependentFacet: dependentFacet => this.toggleDependentFacet(dependentFacet),
      element: this.element,
      root: this.root,
      dependsOn: this.options.dependsOn,
      id: this.options.id,
      queryStateModel: this.queryStateModel,
      bind: this.bind
    };
    this.dependsOnManager = new DependsOnManager(facetInfo);
  }

  private dependsOnReset() {
    this.clear();
    this.updateAppearance();
  }

  private toggleDependentFacet(dependentFacet: Component) {
    this.values.hasSelectedValue ? dependentFacet.enable() : dependentFacet.disable();
  }

  private notImplementedError() {
    const errorMessage = 'Category Facets are not supported by your current search endpoint. Disabling this component.';
    this.logger.error(errorMessage);
    this.disable();
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    Assert.exists(args);

    if (!this.values.hasSelectedValue) {
      return;
    }

    const breadcrumbs = new CategoryFacetBreadcrumb(this);
    args.breadcrumbs.push({ element: breadcrumbs.element });
  }

  private logAnalyticsFacetShowMoreLess(cause: IAnalyticsActionCause) {
    this.usageAnalytics.logCustomEvent<IAnalyticsFacetMeta>(
      cause,
      {
        facetId: this.options.id,
        facetField: this.options.field.toString(),
        facetTitle: this.options.title
      },
      this.element
    );
  }
}

Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();
