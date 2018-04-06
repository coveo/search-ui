import { Component } from '../Base/Component';
import { l } from '../../strings/Strings';
import { IFieldOption, ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$, Dom } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValueRoot } from './CategoryValueRoot';
import { CategoryValue } from './CategoryValue';
import { CategoryFacetQueryController } from '../../controllers/CategoryFacetQueryController';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { QueryStateModel } from '../../models/QueryStateModel';
import 'styling/_CategoryFacet';
import { IAttributesChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { Utils } from '../../utils/Utils';
import _ = require('underscore');

export interface CategoryFacetOptions {
  field: IFieldOption;
  title?: string;
  id: string;
}

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
    this.buildFacetHeader();
    this.initQueryStateEvents();
  }

  public getChildren(): CategoryValue[] {
    return this.categoryValueRoot.getChildren();
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
      if (!Utils.isNullOrUndefined(path) && _.isArray(path) && path.length != 0) {
        this.rebuild(path.slice(0));
      }
    }
  }

  private rebuild(path: string[]) {
    this.categoryValueRoot.buildFromPath(path);
  }

  private initQueryStateEvents() {
    this.queryStateAttribute = QueryStateModel.getCategoryFacetId(this.options.id);
    this.queryStateModel.registerNewAttribute(QueryStateModel.getCategoryFacetId(this.options.id), []);
    this.bind.onQueryState<IAttributesChangedEventArg>(MODEL_EVENTS.CHANGE, undefined, data => this.handleQueryStateChanged(data));
  }
}

Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();
