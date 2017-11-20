import { Component } from '../Base/Component';
import { IFieldOption, ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$, Dom } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import _ = require('underscore');
import 'styling/_CategoryFacet';
import { CategoryValue } from './CategoryValue';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';

export interface CategoryFacetOptions {
  field: IFieldOption;
}

export type CategoryJsonValues = { [key: string]: string[] };

export class CategoryFacet extends Component {
  static doExport = () => {
    exportGlobally({
      CategoryFacet
    });
  };

  static ID = 'CategoryFacet';

  private listRoot: Dom;
  private rootCategoryValues: CategoryValue[] = [];
  private categoryFacetTemplates: CategoryFacetTemplates;

  constructor(public element: HTMLElement, public options: CategoryFacetOptions, bindings?: IComponentBindings) {
    super(element, 'CategoryFacet', bindings);
    this.options = ComponentOptions.initComponentOptions(element, CategoryFacet, options);

    this.categoryFacetTemplates = new CategoryFacetTemplates();

    this.listRoot = this.categoryFacetTemplates.buildListRoot();
    this.element.appendChild(this.listRoot.el);
    this.renderValues(this.listRoot);
  }

  private async renderValues(valuesList: Dom, path: string[] = []) {
    const { values } = await fetch('http://localhost:8085/api', { method: 'POST' }).then<CategoryJsonValues>(response => response.json());
    _.each(values, value => {
      const categoryValue = new CategoryValue(this.listRoot, value, this.categoryFacetTemplates);
      this.rootCategoryValues.push(categoryValue);
      categoryValue.render();
    });
  }

  private onClickHandler(event: Event) {
    const value = $$($$(<EventTarget & HTMLElement>event.target).find('.coveo-category-facet-value-caption')).text();
    const categoryValuesToHide = _.filter(this.rootCategoryValues, categoryValue => categoryValue.getValue() != value);
    _;
  }
}

Initialization.registerAutoCreateComponent(CategoryFacet);
CategoryFacet.doExport();
