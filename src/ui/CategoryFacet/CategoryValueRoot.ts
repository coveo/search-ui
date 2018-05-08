import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { Dom } from '../../utils/Dom';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { CategoryValueParent, CategoryValue } from './CategoryValue';

export class CategoryValueRoot implements CategoryValueParent {
  public path = [];
  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(element: Dom, categoryFacetTemplates: CategoryFacetTemplates, categoryFacet: CategoryFacet) {
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(element, categoryFacetTemplates, this, categoryFacet);
  }

  public renderChildren(values: ICategoryFacetValue[]) {
    this.categoryChildrenValueRenderer.renderChildren(values);
  }

  public renderAsParent(value: ICategoryFacetValue): CategoryValue {
    return this.categoryChildrenValueRenderer.renderAsParent(value);
  }

  public get children(): CategoryValue[] {
    return this.categoryChildrenValueRenderer.children;
  }

  public clear() {
    this.categoryChildrenValueRenderer.getListOfChildValues().detach();
    this.categoryChildrenValueRenderer.clearChildren();
  }
}
