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
import { CategoryValue } from './CategoryValue';
import { contains, isArray } from 'underscore';
import { Assert } from '../../misc/Assert';
import { QueryEvents } from '../../events/QueryEvents';
import { CategoryFacetSearch } from './CategoryFacetSearch';

export interface CategoryFacetOptions {
  field: IFieldOption;
  title?: string;
  id: string;
  enableFacetSearch: boolean;
}

/**
 * This component allows to render hierarchical facet values. It determines the filter to apply depending on the current path of values that
 * are selected. The path is a a combination of values that follow each other in a hierarchy.
 * TODO: Add examples. Explain what a path is.
 */
export class CategoryFacet extends Component {
  public categoryFacetQueryController: CategoryFacetQueryController;
  public listenToQueryStateChange = true;

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
    enableFacetSearch: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    id: ComponentOptions.buildStringOption({ postProcessing: (value, options: CategoryFacetOptions) => value || (options.field as string) })
  };

  private categoryValueRoot: CategoryValueRoot;
  private categoryFacetTemplates: CategoryFacetTemplates;
  private facetHeader: Dom;
  private waitElement: Dom;
  public queryStateAttribute: string;

  public categoryValueRootModule = CategoryValueRoot;

  constructor(public element: HTMLElement, public options: CategoryFacetOptions, bindings?: IComponentBindings) {
    super(element, 'CategoryFacet', bindings);
    this.options = ComponentOptions.initComponentOptions(element, CategoryFacet, options);

    this.categoryFacetQueryController = new CategoryFacetQueryController(this);
    this.categoryFacetTemplates = new CategoryFacetTemplates();
    this.categoryValueRoot = new this.categoryValueRootModule($$(this.element), this.categoryFacetTemplates, this);

    if (this.options.enableFacetSearch) {
      new CategoryFacetSearch(this);
    }

    this.bind.onRootElement(QueryEvents.duringQuery, () => this.addFading());
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, () => this.removeFading());
    this.buildFacetHeader();
    this.initQueryStateEvents();
  }

  /**
   * Changes the active path and triggers a new query.
   */
  public changeActivePath(path: string[]) {
    this.listenToQueryStateChange = false;
    this.queryStateModel.set(this.queryStateAttribute, path);
    this.listenToQueryStateChange = true;

    this.categoryValueRoot.activePath = path;

    this.showWaitingAnimation();
    this.queryController.executeQuery().then(() => {
      this.hideWaitAnimation();
    });
  }

  /**
   * Returns the active path
   */
  public getActivePath() {
    this.categoryValueRoot.activePath;
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

  /**
   * Returns the values at the bottom of the hierarchy. These are the values that are not yet applied to the query.
   */
  public getAvailableValues() {
    return this.categoryValueRoot.activeCategoryValue.children;
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
    const newPath = this.categoryValueRoot.activePath.slice(0);
    newPath.push(value);
    this.changeActivePath(newPath);
  }

  /**
   * Deselect the last value in the hierarchy that is applied to the query. Does nothing if we are at the top of the hierarchy.
   */
  public deselectCurrentValue() {
    if (this.categoryValueRoot.activePath.length == 0) {
      return;
    }

    const newPath = this.categoryValueRoot.activePath.slice(0);
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
        this.categoryValueRoot.activePath = path;
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
}

Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();
