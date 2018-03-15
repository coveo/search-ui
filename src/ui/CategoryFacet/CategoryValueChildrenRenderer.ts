import { Dom } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValue, CategoryValueParent } from './CategoryValue';
import { CategoryFacet } from './CategoryFacet';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';

export class CategoryChildrenValueRenderer {
  private children: CategoryValue[] = [];
  private listOfChildValues: Dom | undefined;

  constructor(
    private element: Dom,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryValue: CategoryValueParent,
    private categoryFacet: CategoryFacet
  ) {}

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

  public async renderChildren(values?: ICategoryFacetValue[]) {
    if (!values) {
      this.categoryFacet.showWaitingAnimation();
      values = await this.categoryFacet.categoryFacetQueryController.getValues(this.categoryValue.getPath());
    }

    if (!this.listOfChildValues) {
      this.listOfChildValues = this.categoryFacetTemplates.buildListRoot();
    }

    this.clearChildren();
    this.element.append(this.listOfChildValues.el);

    values.forEach(value => {
      const categoryValue = new CategoryValue(
        this.listOfChildValues,
        value.value,
        value.numberOfResults,
        this.categoryValue,
        this.categoryFacetTemplates,
        this.categoryFacet
      );
      categoryValue.render();
      this.element.addClass('coveo-active-category-facet-parent');
      this.children.push(categoryValue);
    });
    this.categoryFacet.hideWaitAnimation();
  }
}
