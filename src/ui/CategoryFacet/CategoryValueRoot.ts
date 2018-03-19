import { CategoryValueParent, CategoryValue } from './CategoryValue';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { Dom } from '../../utils/Dom';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';

export class CategoryValueRoot implements CategoryValueParent {
  public isActive = true;
  private children: CategoryValue[] = [];
  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(element: Dom, categoryFacetTemplates: CategoryFacetTemplates, private categoryFacet: CategoryFacet) {
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(element, categoryFacetTemplates, this, categoryFacet);
  }

  public renderChildren() {
    return this.categoryFacet.queryController.executeQuery();
  }

  public hideChildrenExceptOne(categoryValue: CategoryValue) {
    this.categoryChildrenValueRenderer.clearChildrenExceptOne(categoryValue);
  }

  public getPath(partialPath: string[] = []) {
    return partialPath;
  }

  public getChildren() {
    return this.children;
  }
}
