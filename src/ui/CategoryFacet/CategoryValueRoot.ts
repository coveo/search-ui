import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { Dom } from '../../utils/Dom';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { CategoryValueParent, CategoryValue } from './CategoryValue';

export class CategoryValueRoot implements CategoryValueParent {
  public path = [];
  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;
  public listRoot: Dom;

  constructor(private element: Dom, categoryFacetTemplates: CategoryFacetTemplates, categoryFacet: CategoryFacet) {
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(element, categoryFacetTemplates, this, categoryFacet);
    this.listRoot = categoryFacetTemplates.buildListRoot();
    this.appendListRoot();
  }

  public renderChildren(values: ICategoryFacetValue[]) {
    this.appendListRoot();
    this.categoryChildrenValueRenderer.renderChildren(values);
  }

  public renderAsParent(value: ICategoryFacetValue): CategoryValue {
    this.appendListRoot();
    return this.categoryChildrenValueRenderer.renderAsParent(value);
  }

  public get children(): CategoryValue[] {
    return this.categoryChildrenValueRenderer.children;
  }

  public clear() {
    this.listRoot.detach();
    this.listRoot.empty();
    this.categoryChildrenValueRenderer.clearChildren();
  }

  private appendListRoot() {
    this.element.append(this.listRoot.el);
  }
}
