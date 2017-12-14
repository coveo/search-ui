import { Component } from '../Base/Component';
import { IFieldOption, ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Dom, $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_CategoryFacet';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValueRoot } from './CategoryValueRoot';

export interface CategoryFacetOptions {
  field: IFieldOption;
}

export class CategoryFacet extends Component {
  static doExport = () => {
    exportGlobally({
      CategoryFacet
    });
  };

  static ID = 'CategoryFacet';

  private listRoot: Dom;
  private categoryValueRoot: CategoryValueRoot;
  private categoryFacetTemplates: CategoryFacetTemplates;

  constructor(public element: HTMLElement, public options: CategoryFacetOptions, bindings?: IComponentBindings) {
    super(element, 'CategoryFacet', bindings);
    this.options = ComponentOptions.initComponentOptions(element, CategoryFacet, options);

    this.categoryFacetTemplates = new CategoryFacetTemplates();
    this.categoryValueRoot = new CategoryValueRoot($$(this.element), this.categoryFacetTemplates);

    this.renderValues(this.listRoot);
  }

  public getChildren() {
    return this.categoryValueRoot.getChildren();
  }

  private renderValues(valuesList: Dom, path: string[] = []) {
    this.categoryValueRoot.categoryChildrenValueRenderer.renderChildren();
  }
}

Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();
