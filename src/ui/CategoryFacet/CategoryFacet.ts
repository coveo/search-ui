import { Component } from '../Base/Component';
import { IFieldOption, ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValueRoot } from './CategoryValueRoot';
import { CategoryValue } from './CategoryValue';
import { CategoryFacetQueryController } from '../../controllers/CategoryFacetQueryController';
import 'styling/_CategoryFacet';

export interface CategoryFacetOptions {
  field: IFieldOption;
}

export class CategoryFacet extends Component {
  public categoryFacetQueryController: CategoryFacetQueryController;

  static doExport = () => {
    exportGlobally({
      CategoryFacet
    });
  };

  static ID = 'CategoryFacet';

  static options: CategoryFacetOptions = {
    field: ComponentOptions.buildFieldOption({ required: true })
  };

  private categoryValueRoot: CategoryValueRoot;
  private categoryFacetTemplates: CategoryFacetTemplates;

  public categoryValueRootModule = CategoryValueRoot;

  constructor(public element: HTMLElement, public options: CategoryFacetOptions, bindings?: IComponentBindings) {
    super(element, 'CategoryFacet', bindings);
    this.options = ComponentOptions.initComponentOptions(element, CategoryFacet, options);

    this.categoryFacetQueryController = new CategoryFacetQueryController(this);
    this.categoryFacetTemplates = new CategoryFacetTemplates();
    this.categoryValueRoot = new this.categoryValueRootModule($$(this.element), this.categoryFacetTemplates, this);
  }

  public getChildren(): CategoryValue[] {
    return this.categoryValueRoot.getChildren();
  }

  public disable() {
    super.disable();
    $$(this.element).addClass('coveo-disabled');
  }
}

Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();
