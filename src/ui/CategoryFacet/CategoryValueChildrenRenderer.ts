import { Dom } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValue, CategoryValueParent } from './CategoryValue';
import { CategoryFacet } from './CategoryFacet';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { Utils } from '../../utils/Utils';
import { each } from 'underscore';

export class CategoryChildrenValueRenderer {
  private children: CategoryValue[] = [];
  private listOfChildValues: Dom;

  constructor(
    private element: Dom,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryValue: CategoryValueParent,
    private categoryFacet: CategoryFacet
  ) {}

  public getChildren() {
    return this.children;
  }

  public clearChildrenExceptOne(except: CategoryValue) {
    const newChildren = [];
    this.children.forEach(categoryValue => {
      if (except !== categoryValue) {
        categoryValue.clear();
      } else {
        newChildren.push(categoryValue);
      }
    });
    this.children = newChildren;
    this.element.removeClass('coveo-active-category-facet-parent');
  }

  public clearChildren() {
    this.element.removeClass('coveo-active-category-facet-parent');
    this.children.forEach(child => {
      child.clear();
    });
    this.children = [];
  }

  public renderChildren(values: ICategoryFacetValue[]) {
    each(values, value => this.renderValue(value));
    this.element.addClass('coveo-active-category-facet-parent');
    this.categoryFacet.hideWaitAnimation();
  }

  public renderAsParent(value: ICategoryFacetValue) {
    const categoryValue = this.renderValue(value);
    categoryValue.showCollapseArrow();
    return categoryValue;
  }

  private renderValue(value: ICategoryFacetValue) {
    const listOfChildValues = this.getListOfChildValues();
    this.element.append(listOfChildValues.el);
    const categoryValue = new CategoryValue(
      listOfChildValues,
      value.value,
      value.numberOfResults,
      this.categoryValue,
      this.categoryFacetTemplates,
      this.categoryFacet
    );
    categoryValue.render();
    this.children.push(categoryValue);
    return categoryValue;
  }

  public getListOfChildValues() {
    if (Utils.isNullOrUndefined(this.listOfChildValues)) {
      this.listOfChildValues = this.categoryFacetTemplates.buildListRoot();
    }
    return this.listOfChildValues;
  }
}
