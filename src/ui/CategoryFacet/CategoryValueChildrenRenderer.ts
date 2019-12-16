import { Dom } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValue, CategoryValueParent } from './CategoryValue';
import { CategoryFacet } from './CategoryFacet';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { each } from 'underscore';

export class CategoryChildrenValueRenderer {
  public children: CategoryValue[] = [];

  constructor(
    private element: Dom,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryValue: CategoryValueParent,
    private categoryFacet: CategoryFacet
  ) {}

  public clearChildren() {
    this.element.removeClass('coveo-active-category-facet-parent');
    this.children.forEach(child => {
      child.clear();
    });
    this.children = [];
  }

  public renderChildren(values: ICategoryFacetValue[]) {
    each(values, value => {
      this.renderValue(value, true).makeSelectable();
    });
  }

  public renderAsParent(value: ICategoryFacetValue) {
    const categoryValue = this.renderValue(value, false);
    return categoryValue;
  }

  private renderValue(value: ICategoryFacetValue, isChild: boolean) {
    const path = this.categoryValue.path.concat([value.value]);
    const categoryValueDescriptor = {
      value: value.value,
      count: value.numberOfResults,
      path
    };
    const categoryValue = new CategoryValue(
      this.categoryValue.listRoot,
      categoryValueDescriptor,
      this.categoryFacetTemplates,
      this.categoryFacet
    );
    categoryValue.render(isChild);
    this.children.push(categoryValue);
    return categoryValue;
  }
}
