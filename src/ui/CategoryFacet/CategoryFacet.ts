import { Component } from '../Base/Component';
import { l } from '../../strings/Strings';
import { IFieldOption, ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$, Dom } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValueRoot } from './CategoryValueRoot';
import { CategoryFacetQueryController } from '../../controllers/CategoryFacetQueryController';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { QueryStateModel } from '../../models/QueryStateModel';
import 'styling/_CategoryFacet';
import { IAttributesChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { Utils } from '../../utils/Utils';
import { CategoryValue, CategoryValueParent } from './CategoryValue';
import { pluck, reduce, find, first, last, contains, isArray } from 'underscore';
import { Assert } from '../../misc/Assert';
import { QueryEvents, IBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { CategoryFacetSearch } from './CategoryFacetSearch';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import { ICategoryFacetResult } from '../../rest/CategoryFacetResult';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { CategoryFacetBreadcrumb } from './CategoryFacetBreadcrumb';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { ISearchEndpoint } from '../../rest/SearchEndpointInterface';
import { IAnalyticsCategoryFacetMeta, analyticsActionCauseList, IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { CategoryFacetDebug } from './CategoryFacetDebug';
import { QueryBuilder } from '../Base/QueryBuilder';
import { IAutoLayoutAdjustableInsideFacetColumn } from '../SearchInterface/FacetColumnAutoLayoutAdjustment';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { ResponsiveFacetOptions } from '../ResponsiveComponents/ResponsiveFacetOptions';

export interface ICategoryFacetOptions extends IResponsiveComponentOptions {
  field: IFieldOption;
  title?: string;
  numberOfResultsInFacetSearch?: number;
  id?: string;
  enableFacetSearch?: boolean;
  facetSearchDelay?: number;
  numberOfValues?: number;
  injectionDepth?: number;
  enableMoreLess?: boolean;
  pageSize?: number;
  delimitingCharacter?: string;
  debug?: boolean;
  basePath?: string[];
  maximumDepth?: number;
}

export type CategoryValueDescriptor = {
  value: string;
  count: number;
  path: string[];
};

// /**
//  * The _CategoryFacet_ component is a facet that renders values in a hierarchical fashion. It determines the filter to apply depending on the
//  * current selected path of values.
//  *
//  * The path is a sequence of values that leads to a specific value in the hierarchy.
//  * It is an array listing all the parents of a file (e.g., `['c', 'folder1']` for the `c:\folder1\text1.txt` file).
//  *
//  * This facet requires a field with a special format to work correctly.
//  *
//  * **Example:**
//  *
//  * You have the following files indexed on a file system:
//  *
//  * ```
//  * c:\
//  *   folder1\
//  *     text1.txt
//  *   folder2\
//  *     folder3\
//  *       text2.txt
//  * ```
//  *
//  * The `text1.txt` item would have a field with the following value:
//  * `c; c|folder1;`
//  *
//  * The `text2.txt` item would have a field with the following value:
//  * `c; c|folder2; c|folder2|folder3;`
//  *
//  * By default, the `|` character determines the hierarchy (`folder3` inside `folder2` inside `c`).
//  *
//  * Since both items contain the `c` value, selecting it value in the facet would return both items.
//  *
//  * Selecting the `folder3` value in the facet would only return the `text2.txt` item.
//  *
//  * To help you verify if your fields are setup correctly, see the {@link CategoryFacet.options.debug} option
//  * and the {@link CategoryFacet.debugValue} method.
//  */
export class CategoryFacet extends Component implements IAutoLayoutAdjustableInsideFacetColumn {
  static doExport = () => {
    exportGlobally({
      CategoryFacet
    });
  };

  static ID = 'CategoryFacet';

  static options: ICategoryFacetOptions = {
    field: ComponentOptions.buildFieldOption({ required: true }),
    title: ComponentOptions.buildLocalizedStringOption({
      defaultValue: l('NoTitle')
    }),
    /**
     * Specifies the maximum number of field values to display by default in the facet before the user
     * clicks the arrow to show more.
     *
     * See also the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess} option.
     */
    numberOfValues: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0, section: 'CommonOptions' }),
    /**
     * Specifies whether to display a search box at the bottom of the facet for searching among the available facet
     * [`field`]{@link CategoryFacet.options.field} values.
     *
     * See also the [`facetSearchDelay`]{@link CategoryFacet.options.facetSearchDelay}, and
     * [`numberOfValuesInFacetSearch`]{@link CategoryFacet.options.numberOfValuesInFacetSearch} options.
     *
     *
     * Default value is `true`.
     */
    enableFacetSearch: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies a unique identifier for the facet. Among other things, this identifier serves the purpose of saving
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
     * Specifies the *injection depth* to use.
     *
     * The injection depth determines how many results to scan in the index to ensure that the category facet lists all potential
     * facet values. Increasing this value enhances the accuracy of the listed values at the cost of performance.
     *
     * Default value is `1000`. Minimum value is `0`.
     * @notSupportedIn salesforcefree
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
     * Specifies whether to enable the **More** and **Less** buttons in the Facet.
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
     * The character that specifies the hierarhical dependency.
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
     * Specifies whether field format debugging is activated.
     * This options logs messages in the console for any potential encountered issues.
     * This option can have negative effects on performance, and should only be activated when debugging.
     */
    debug: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    ...ResponsiveFacetOptions
  };

  public categoryFacetQueryController: CategoryFacetQueryController;
  public listenToQueryStateChange = true;
  public categoryFacetSearch: CategoryFacetSearch;
  public activeCategoryValue: CategoryValue | undefined;
  public positionInQuery: number;
  public static MAXIMUM_NUMBER_OF_VALUES_BEFORE_TRUNCATING = 15;
  public static NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING = 10;

  private categoryValueRoot: CategoryValueRoot;
  private categoryFacetTemplates: CategoryFacetTemplates;
  private facetHeader: Dom;
  private waitElement: Dom;
  private currentPage: number;
  private moreLessContainer: Dom;
  private moreValuesToFetch: boolean = true;
  private numberOfChildValuesCurrentlyDisplayed = 0;
  private numberOfValues: number;

  public static WAIT_ELEMENT_CLASS = 'coveo-category-facet-header-wait-animation';

  constructor(public element: HTMLElement, public options: ICategoryFacetOptions, bindings?: IComponentBindings) {
    super(element, 'CategoryFacet', bindings);
    this.options = ComponentOptions.initComponentOptions(element, CategoryFacet, options);

    this.categoryFacetQueryController = new CategoryFacetQueryController(this);
    this.categoryFacetTemplates = new CategoryFacetTemplates();
    this.categoryValueRoot = new CategoryValueRoot($$(this.element), this.categoryFacetTemplates, this);
    this.categoryValueRoot.path = this.activePath;
    this.currentPage = 0;
    this.numberOfValues = this.options.numberOfValues;

    if (this.options.enableFacetSearch) {
      this.categoryFacetSearch = new CategoryFacetSearch(this);
    }

    if (this.options.debug) {
      new CategoryFacetDebug(this);
    }

    ResponsiveFacets.init(this.root, this, this.options);

    this.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, args => this.handleBuildingQuery(args));
    this.bind.onRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, args => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.addFading());
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, () => this.removeFading());
    this.bind.onRootElement<IPopulateBreadcrumbEventArgs>(BreadcrumbEvents.populateBreadcrumb, args => this.handlePopulateBreadCrumb(args));
    this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.handleClearBreadcrumb());
    this.buildFacetHeader();
    this.initQueryStateEvents();
  }

  public isCurrentlyDisplayed() {
    return this.hasValues;
  }

  public get activePath() {
    return this.queryStateModel.get(this.queryStateAttribute) || this.options.basePath;
  }

  public set activePath(newPath: string[]) {
    this.listenToQueryStateChange = false;
    this.queryStateModel.set(this.queryStateAttribute, newPath);
    this.listenToQueryStateChange = true;
  }

  public get queryStateAttribute() {
    return QueryStateModel.getFacetId(this.options.id);
  }

  public handleBuildingQuery(args: IBuildingQueryEventArgs) {
    this.positionInQuery = this.categoryFacetQueryController.putCategoryFacetInQueryBuilder(
      args.queryBuilder,
      this.activePath,
      this.numberOfValues + 1
    );
  }

  private handleNoResults() {
    if (this.isPristine()) {
      this.hide();
      return;
    }

    if (this.hasValues) {
      this.show();
      return;
    }
    this.activePath = this.options.basePath;
    this.hide();
  }

  public handleQuerySuccess(args: IQuerySuccessEventArgs) {
    if (Utils.isNullOrUndefined(args.results.categoryFacets)) {
      this.notImplementedError();
      return;
    }

    if (Utils.isNullOrUndefined(args.results.categoryFacets[this.positionInQuery])) {
      this.handleNoResults();
      return;
    }

    const numberOfRequestedValues = args.query.categoryFacets[this.positionInQuery].maximumNumberOfValues;
    const categoryFacetResult = args.results.categoryFacets[this.positionInQuery];
    this.moreValuesToFetch = numberOfRequestedValues == categoryFacetResult.values.length;
    this.clear();

    if (categoryFacetResult.notImplemented) {
      this.notImplementedError();
      return;
    }

    if (categoryFacetResult.values.length == 0 && categoryFacetResult.parentValues.length == 0) {
      this.handleNoResults();
      return;
    }

    this.renderValues(categoryFacetResult, numberOfRequestedValues);
    if (this.options.enableFacetSearch) {
      const facetSearch = this.categoryFacetSearch.build();
      $$(facetSearch).insertAfter(this.categoryValueRoot.listRoot.el);
    }

    if (this.options.enableMoreLess) {
      this.renderMoreLess();
    }

    if (!this.isPristine()) {
      $$(this.element).addClass('coveo-category-facet-non-empty-path');
    }
  }

  /**
   * Changes the active path.
   *
   */
  public changeActivePath(path: string[]) {
    this.activePath = path;
  }

  public async executeQuery() {
    this.showWaitingAnimation();
    try {
      await this.queryController.executeQuery();
    } finally {
      this.hideWaitAnimation();
    }
  }

  /**
   * Reloads the facet with the same path.
   */
  public reload() {
    this.changeActivePath(this.activePath);
    this.logAnalyticsEvent(analyticsActionCauseList.categoryFacetReload);
    this.executeQuery();
  }

  /**
   * Returns all the visible parent values.
   * @returns simple object with three fields: `value`, `count` and `path`.
   */
  public getVisibleParentValues(): CategoryValueDescriptor[] {
    return this.getVisibleParentCategoryValues().map(categoryValue => categoryValue.getDescriptor());
  }

  private getVisibleParentCategoryValues() {
    if (this.categoryValueRoot.children.length == 0 || this.categoryValueRoot.children[0].children.length == 0) {
      return [];
    }
    let currentParentvalue = this.categoryValueRoot.children[0];
    const parentValues = [currentParentvalue];
    while (currentParentvalue.children.length != 0 && !Utils.arrayEqual(currentParentvalue.path, this.activePath)) {
      currentParentvalue = currentParentvalue.children[0];
      parentValues.push(currentParentvalue);
    }
    return parentValues;
  }

  /**
   * Shows more values according to {@link CategoryFacet.options.pageSize}.
   *
   * See the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess}, and
   * [`numberOfValues`]{@link CategoryFacet.options.numberOfValues} options.
   */
  public showMore() {
    if (this.moreValuesToFetch) {
      this.currentPage++;
      this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
      this.reload();
    }
  }

  /**
   * Shows less values, up to the original number of values.
   *
   * See the [`enableMoreLess`]{@link CategoryFacet.options.enableMoreLess}, and
   * [`numberOfValues`]{@link CategoryFacet.options.numberOfValues} options.
   */
  public showLess() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
      this.reload();
    }
  }

  /**
   * Returns the values at the bottom of the hierarchy. These are the values that are not yet applied to the query.
   * @returns simple object with three fields: `value`, `count` and `path`.
   */
  public getAvailableValues() {
    if (!this.activeCategoryValue) {
      return [];
    }
    return this.activeCategoryValue.children.map(categoryValue => {
      return {
        value: categoryValue.categoryValueDescriptor.value,
        count: categoryValue.categoryValueDescriptor.count,
        path: categoryValue.path
      };
    });
  }

  /**
   * Selects a value from the currently available values.
   * If the given value to select is not in the available values, it will throw an error.
   */
  public selectValue(value: string) {
    Assert.check(
      contains(pluck(this.getAvailableValues(), 'value'), value),
      'Failed while trying to select a value that is not available.'
    );
    const newPath = this.activePath.slice(0);
    newPath.push(value);
    this.changeActivePath(newPath);
    this.logAnalyticsEvent(analyticsActionCauseList.categoryFacetSelect);
    this.executeQuery();
  }

  /**
   * Deselects the last value in the hierarchy that is applied to the query. When at the top of the hierarchy, this method does nothing.
   */
  public deselectCurrentValue() {
    if (this.activePath.length == 0) {
      return;
    }

    const newPath = this.activePath.slice(0);
    newPath.pop();
    this.changeActivePath(newPath);
    this.logAnalyticsEvent(analyticsActionCauseList.categoryFacetSelect);
    this.executeQuery();
  }

  /**
   * Reset the facet to its initial state.
   */
  public reset() {
    this.changeActivePath(this.options.basePath);
    this.logAnalyticsEvent(analyticsActionCauseList.categoryFacetClear);
    this.executeQuery();
  }

  public disable() {
    super.disable();
    this.hide();
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
   * This method goes through any value that contains the value parameter, and verifies if there are missing parents.
   * Issues are then logged in the console.
   * If you do not want to specify a value, you can simply enable {@link CategoryFacet.option.debug} and do an empty query.
   */
  public async debugValue(value: string) {
    const queryBuilder = new QueryBuilder();
    this.categoryFacetQueryController.addDebugGroupBy(queryBuilder, value);
    const queryResults = await this.queryController.getEndpoint().search(queryBuilder.build());
    CategoryFacetDebug.analyzeResults(queryResults.groupByResults[0], this.options.delimitingCharacter);
  }

  public showWaitingAnimation() {
    if (this.waitElement.el.style.visibility == 'hidden') {
      this.waitElement.el.style.visibility = 'visible';
    }
  }

  public hideWaitAnimation() {
    if (this.waitElement.el.style.visibility == 'visible') {
      this.waitElement.el.style.visibility = 'hidden';
    }
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

  get children(): CategoryValue[] {
    return this.categoryValueRoot.children;
  }

  private renderValues(categoryFacetResult: ICategoryFacetResult, numberOfRequestedValues: number) {
    this.show();
    let sortedParentValues = this.sortParentValues(categoryFacetResult.parentValues);
    let currentParentValue: CategoryValueParent = this.categoryValueRoot;
    let needToTruncate = false;
    let pathOfLastTruncatedParentValue: string[];

    const numberOfItemsInFirstSlice = Math.floor(CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING / 2);
    const numberOfItemsInSecondSlice = Math.ceil(CategoryFacet.NUMBER_OF_VALUES_TO_KEEP_AFTER_TRUNCATING / 2);

    sortedParentValues = this.hideBasePathInParentValues(sortedParentValues);

    if (this.shouldTruncate(sortedParentValues)) {
      pathOfLastTruncatedParentValue = this.findPathOfLastTruncatedParentValue(sortedParentValues, numberOfItemsInSecondSlice);
      needToTruncate = true;
      sortedParentValues = first(sortedParentValues, numberOfItemsInFirstSlice).concat(
        last(sortedParentValues, numberOfItemsInSecondSlice)
      );
    }

    if (!this.isPristine()) {
      this.addAllCategoriesButton();
    }

    for (let i = 0; i < sortedParentValues.length; i++) {
      currentParentValue = currentParentValue.renderAsParent(sortedParentValues[i]);

      // We do not want to make the "last" parent selectable, as clicking it would be a noop (re-selecting the same filter)
      const isLastParent = i == sortedParentValues.length - 1;
      if (!isLastParent) {
        (currentParentValue as CategoryValue).makeSelectable().showCollapseArrow();
      }

      if (needToTruncate) {
        if (i == numberOfItemsInFirstSlice - 1) {
          this.addEllipsis();
        }

        if (i == numberOfItemsInFirstSlice) {
          currentParentValue.path = [...pathOfLastTruncatedParentValue, sortedParentValues[i].value];
        }
      }
    }

    const childrenValuesToRender = this.moreValuesToFetch
      ? categoryFacetResult.values.slice(0, numberOfRequestedValues - 1)
      : categoryFacetResult.values.slice(0, numberOfRequestedValues);

    this.numberOfChildValuesCurrentlyDisplayed = childrenValuesToRender.length;

    currentParentValue.renderChildren(childrenValuesToRender);
    this.activeCategoryValue = currentParentValue as CategoryValue;
  }

  private hideBasePathInParentValues(parentValues: ICategoryFacetValue[]) {
    if (Utils.arrayEqual(first(this.activePath, this.options.basePath.length), this.options.basePath)) {
      parentValues = last(parentValues, parentValues.length - this.options.basePath.length);
    }
    return parentValues;
  }

  private shouldTruncate(parentValues: ICategoryFacetValue[]) {
    return parentValues.length > CategoryFacet.MAXIMUM_NUMBER_OF_VALUES_BEFORE_TRUNCATING;
  }

  private addEllipsis() {
    this.categoryValueRoot.listRoot.append(this.categoryFacetTemplates.buildEllipsis().el);
  }

  private findPathOfLastTruncatedParentValue(sortedParentValues: ICategoryFacetValue[], numberOfItemsInSecondSlice: number) {
    const indexOfLastTruncatedParentValue = sortedParentValues.length - numberOfItemsInSecondSlice - 1;
    return reduce(first(sortedParentValues, indexOfLastTruncatedParentValue + 1), (path, parentValue) => [...path, parentValue.value], []);
  }

  private addAllCategoriesButton() {
    const allCategories = this.categoryFacetTemplates.buildAllCategoriesButton();
    allCategories.on('click', () => this.reset());
    this.categoryValueRoot.listRoot.append(allCategories.el);
  }

  private isPristine() {
    return Utils.arrayEqual(this.activePath, this.options.basePath);
  }

  private buildFacetHeader() {
    this.waitElement = $$('div', { className: CategoryFacet.WAIT_ELEMENT_CLASS }, SVGIcons.icons.loading);
    SVGDom.addClassToSVGInContainer(this.waitElement.el, 'coveo-category-facet-header-wait-animation-svg');
    this.waitElement.el.style.visibility = 'hidden';

    const titleSection = $$('div', { className: 'coveo-category-facet-title' }, this.options.title);
    this.facetHeader = $$('div', { className: 'coveo-category-facet-header' }, titleSection);
    $$(this.element).prepend(this.facetHeader.el);
    this.facetHeader.append(this.waitElement.el);

    const clearIcon = $$(
      'div',
      { title: l('Clear', this.options.title), className: 'coveo-category-facet-header-eraser coveo-facet-header-eraser' },
      SVGIcons.icons.mainClear
    );
    SVGDom.addClassToSVGInContainer(clearIcon.el, 'coveo-facet-header-eraser-svg');
    clearIcon.on('click', () => {
      this.logAnalyticsEvent(analyticsActionCauseList.categoryFacetClear);
      this.reset();
    });
    this.facetHeader.append(clearIcon.el);
  }

  private handleQueryStateChanged(data: IAttributesChangedEventArg) {
    if (this.listenToQueryStateChange) {
      let path = data.attributes[this.queryStateAttribute];
      if (!Utils.isNullOrUndefined(path) && isArray(path) && path.length != 0) {
        this.activePath = path;
      }
    }
  }

  private initQueryStateEvents() {
    this.queryStateModel.registerNewAttribute(this.queryStateAttribute, this.options.basePath);
    this.bind.onQueryState<IAttributesChangedEventArg>(MODEL_EVENTS.CHANGE, undefined, data => this.handleQueryStateChanged(data));
  }

  private addFading() {
    $$(this.element).addClass('coveo-category-facet-values-fade');
  }

  private removeFading() {
    $$(this.element).removeClass('coveo-category-facet-values-fade');
  }

  private notImplementedError() {
    const errorMessage = 'Category Facets are not supported by your current search endpoint. Disabling this component.';
    this.logger.error(errorMessage);
    this.disable();
  }

  private sortParentValues(parentValues: ICategoryFacetValue[]) {
    if (this.activePath.length != parentValues.length) {
      this.logger.warn('Inconsistent CategoryFacet results: Number of parent values results does not equal length of active path');
      return parentValues;
    }

    const sortedParentvalues: ICategoryFacetValue[] = [];
    for (const pathElement of this.activePath) {
      const currentParentValue = find(parentValues, parentValue => parentValue.value.toLowerCase() == pathElement.toLowerCase());
      if (!currentParentValue) {
        this.logger.warn('Inconsistent CategoryFacet results: path not consistent with parent values results');
        return parentValues;
      }
      sortedParentvalues.push(currentParentValue);
    }
    return sortedParentvalues;
  }

  private renderMoreLess() {
    this.moreLessContainer = $$('div', { className: 'coveo-category-facet-more-less-container' });
    $$(this.element).append(this.moreLessContainer.el);

    if (this.numberOfChildValuesCurrentlyDisplayed > this.options.numberOfValues) {
      this.moreLessContainer.append(this.buildLessButton());
    }

    if (this.moreValuesToFetch) {
      this.moreLessContainer.append(this.buildMoreButton());
    }
  }

  private clear() {
    this.categoryValueRoot.clear();
    if (this.options.enableFacetSearch) {
      this.categoryFacetSearch.clear();
    }
    this.moreLessContainer && this.moreLessContainer.detach();
    $$(this.element).removeClass('coveo-category-facet-non-empty-path');
  }

  private buildMoreButton() {
    const svgContainer = $$('span', { className: 'coveo-facet-more-icon' }, SVGIcons.icons.arrowDown).el;
    SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-more-icon-svg');
    const more = $$('div', { className: 'coveo-category-facet-more', tabindex: 0 }, svgContainer);

    const showMoreHandler = () => this.showMore();
    more.on('click', () => this.showMore());
    more.on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, showMoreHandler));

    return more.el;
  }

  private buildLessButton() {
    const svgContainer = $$('span', { className: 'coveo-facet-less-icon' }, SVGIcons.icons.arrowUp).el;
    SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-less-icon-svg');
    const less = $$('div', { className: 'coveo-category-facet-less', tabIndex: 0 }, svgContainer);

    const showLessHandler = () => this.showLess();
    less.on('click', showLessHandler);
    less.on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, showLessHandler));

    return less.el;
  }

  private handlePopulateBreadCrumb(args: IPopulateBreadcrumbEventArgs) {
    const lastParentValue = this.getVisibleParentValues().pop();
    if (!this.isPristine() && lastParentValue) {
      const resetFacet = () => {
        this.logAnalyticsEvent(analyticsActionCauseList.breadcrumbFacet);
        this.reset();
      };

      const categoryFacetBreadcrumbBuilder = new CategoryFacetBreadcrumb(this.options.title, resetFacet, lastParentValue);
      args.breadcrumbs.push({ element: categoryFacetBreadcrumbBuilder.build() });
    }
  }

  private handleClearBreadcrumb() {
    this.changeActivePath(this.options.basePath);
  }

  private get hasValues(): boolean {
    return this.getAvailableValues().length > 0;
  }
}

Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();
