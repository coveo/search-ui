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
import { contains, isArray } from 'underscore';
import { Assert } from '../../misc/Assert';
import { QueryEvents, IBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { CategoryFacetSearch } from './CategoryFacetSearch';
import { each, find } from 'underscore';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';

export interface CategoryFacetOptions {
  field: IFieldOption;
  title?: string;
  numberOfResultsInFacetSearch: number;
  id: string;
  enableFacetSearch: boolean;
  facetSearchDelay: number;
  numberOfValues: number;
  injectionDepth: number;
  enableMoreLess: boolean;
  pageSize: number;
}

/**
 * This component allows to render hierarchical facet values. It determines the filter to apply depending on the current path of values that
 * are selected. The path is a a combination of values that follow each other in a hierarchy.
 * TODO: Add examples. Explain what a path is.
 */
export class CategoryFacet extends Component {
  static doExport = () => {
    exportGlobally({
      CategoryFacet
    });
  };

  static ID = 'CategoryFacet';

  static options: CategoryFacetOptions = {
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
    enableFacetSearch: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    id: ComponentOptions.buildStringOption({
      postProcessing: (value, options: CategoryFacetOptions) => value || (options.field as string)
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
    pageSize: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableMoreLess' })
  };

  public categoryFacetQueryController: CategoryFacetQueryController;
  public listenToQueryStateChange = true;
  public queryStateAttribute: string;
  public categoryValueRootModule = CategoryValueRoot;
  public categoryFacetSearch: CategoryFacetSearch;
  public activeCategoryValue: CategoryValue | undefined;
  public activePath: string[] = [];

  private categoryValueRoot: CategoryValueRoot;
  private categoryFacetTemplates: CategoryFacetTemplates;
  private facetHeader: Dom;
  private waitElement: Dom;
  private positionInQuery: number;
  private currentPage: number;
  private moreLessContainer: Dom;
  private moreValuesToFetch: boolean = true;
  private numberOfValues: number;

  constructor(public element: HTMLElement, public options: CategoryFacetOptions, bindings?: IComponentBindings) {
    super(element, 'CategoryFacet', bindings);
    this.options = ComponentOptions.initComponentOptions(element, CategoryFacet, options);

    this.categoryFacetQueryController = new CategoryFacetQueryController(this);
    this.categoryFacetTemplates = new CategoryFacetTemplates();
    this.categoryValueRoot = new this.categoryValueRootModule($$(this.element), this.categoryFacetTemplates, this);
    this.currentPage = 0;
    this.numberOfValues = this.options.numberOfValues;

    if (this.options.enableFacetSearch) {
      this.categoryFacetSearch = new CategoryFacetSearch(this);
    }

    this.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, args => this.handleBuildingQuery(args));
    this.bind.onRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, args => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.addFading());
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, () => this.removeFading());
    this.buildFacetHeader();
    this.initQueryStateEvents();
  }

  public handleBuildingQuery(args: IBuildingQueryEventArgs) {
    this.positionInQuery = this.categoryFacetQueryController.putCategoryFacetInQueryBuilder(
      args.queryBuilder,
      this.activePath,
      this.numberOfValues + 1
    );
  }

  public handleQuerySuccess(args: IQuerySuccessEventArgs) {
    const numberOfRequestedValues = args.query.categoryFacets[this.positionInQuery].maximumNumberOfValues;
    const categoryFacetResult = args.results.categoryFacets[this.positionInQuery];
    this.moreValuesToFetch = numberOfRequestedValues == categoryFacetResult.values.length;

    if (categoryFacetResult.notImplemented) {
      this.notImplementedError();
    } else if (categoryFacetResult.values.length != 0) {
      this.clear();
      this.show();

      const sortedParentValues = this.sortParentValues(categoryFacetResult.parentValues);
      let currentParentValue: CategoryValueParent = this.categoryValueRoot;
      each(sortedParentValues, categoryFacetParentValue => {
        currentParentValue = currentParentValue.renderAsParent(categoryFacetParentValue);
      });
      const childrenValuesToRender = categoryFacetResult.values.slice(0, numberOfRequestedValues - 1);
      currentParentValue.renderChildren(childrenValuesToRender);
      this.activeCategoryValue = currentParentValue as CategoryValue;
    } else if (categoryFacetResult.parentValues.length != 0) {
      this.clear();
      const sortedParentValues = this.sortParentValues(categoryFacetResult.parentValues);
      let currentParentValue: CategoryValueParent = this.categoryValueRoot;
      each(sortedParentValues, categoryFacetParentValue => {
        currentParentValue = currentParentValue.renderAsParent(categoryFacetParentValue);
      });
      currentParentValue.renderChildren([]);
      this.activeCategoryValue = currentParentValue as CategoryValue;
    } else {
      this.hide();
    }

    if (this.options.enableFacetSearch) {
      const facetSearch = this.categoryFacetSearch.build();
      $$(facetSearch).insertAfter(this.categoryValueRoot.categoryChildrenValueRenderer.getListOfChildValues().el);
    }

    if (this.options.enableMoreLess) {
      this.renderMoreLess();
    }
  }
  /**
   * Changes the active path and triggers a new query.
   */
  public changeActivePath(path: string[]) {
    this.listenToQueryStateChange = false;
    this.queryStateModel.set(this.queryStateAttribute, path);
    this.listenToQueryStateChange = true;

    this.activePath = path;

    this.showWaitingAnimation();
    this.queryController.executeQuery().then(() => {
      this.hideWaitAnimation();
    });
  }

  /**
   * Reloads the facet with the same path.
   */
  public reload() {
    this.changeActivePath(this.activePath);
  }

  /**
   * Returns all the visible parent values. The last visible child values are available on the `children` field of the last CategoryValue
   * in the returned list.
   *
   */
  public getVisibleParentCategoryValues() {
    if (this.categoryValueRoot.children.length == 0 || this.categoryValueRoot.children[0].children.length == 0) {
      return [];
    }
    let currentParentvalue = this.categoryValueRoot.children[0];
    const parentValues: CategoryValue[] = [currentParentvalue];
    while (currentParentvalue.children.length != 0) {
      currentParentvalue = currentParentvalue.children[0];
      parentValues.push(currentParentvalue);
    }
    return parentValues;
  }

  public showMore() {
    if (this.moreValuesToFetch) {
      this.currentPage++;
      this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
      this.reload();
    }
  }

  public showLess() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
      this.reload();
    }
  }

  /**
   * Returns the values at the bottom of the hierarchy. These are the values that are not yet applied to the query.
   */
  public getAvailableValues() {
    return this.activeCategoryValue.children;
  }

  /**
   * Selects a value from the currently available values.
   * If the given value to select is not in the available values, it will throw an error.
   */
  public selectValue(value: string) {
    Assert.check(
      contains(this.getAvailableValues().map(categoryValue => categoryValue.value), value),
      'Failed while trying to select a value that is not available.'
    );
    const newPath = this.activePath.slice(0);
    newPath.push(value);
    this.changeActivePath(newPath);
  }

  /**
   * Deselect the last value in the hierarchy that is applied to the query. Does nothing if we are at the top of the hierarchy.
   */
  public deselectCurrentValue() {
    if (this.activePath.length == 0) {
      return;
    }

    const newPath = this.activePath.slice(0);
    newPath.pop();
    this.changeActivePath(newPath);
  }

  public disable() {
    super.disable();
    $$(this.element).addClass('coveo-hidden');
  }

  public hide() {
    $$(this.element).addClass('coveo-hidden');
  }

  public show() {
    $$(this.element).removeClass('coveo-hidden');
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

  get children(): CategoryValue[] {
    return this.categoryValueRoot.children;
  }

  private buildFacetHeader() {
    this.waitElement = $$('div', { className: 'coveo-category-facet-header-wait-animation' }, SVGIcons.icons.loading);
    SVGDom.addClassToSVGInContainer(this.waitElement.el, 'coveo-category-facet-header-wait-animation-svg');
    this.waitElement.el.style.visibility = 'hidden';

    const titleSection = $$('div', { className: 'coveo-category-facet-title' }, this.options.title);
    this.facetHeader = $$('div', { className: 'coveo-category-facet-header' }, titleSection);
    $$(this.element).prepend(this.facetHeader.el);
    this.facetHeader.append(this.waitElement.el);
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
    this.queryStateAttribute = QueryStateModel.getCategoryFacetId(this.options.id);
    this.queryStateModel.registerNewAttribute(QueryStateModel.getCategoryFacetId(this.options.id), []);
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

    const sortedParentvalues = [];
    for (const pathElement of this.activePath) {
      const currentParentValue = find(parentValues, parentValue => parentValue.value == pathElement);
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

    if (this.currentPage != 0) {
      this.moreLessContainer.append(this.buildLessButton());
    }

    if (this.moreValuesToFetch) {
      this.moreLessContainer.append(this.buildMoreButton());
    }
  }

  private clear() {
    this.categoryValueRoot.clear();
    this.categoryFacetSearch.clear();
    this.moreLessContainer && this.moreLessContainer.detach();
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
}

Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();
