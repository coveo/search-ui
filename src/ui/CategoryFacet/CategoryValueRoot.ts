import { CategoryValueParent, CategoryValue } from './CategoryValue';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { Dom } from '../../utils/Dom';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';

export class CategoryValueRoot implements CategoryValueParent {
  private children: CategoryValue[] = [];
  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(element: Dom, categoryFacetTemplates: CategoryFacetTemplates, private categoryFacet: CategoryFacet) {
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(element, categoryFacetTemplates, this, categoryFacet);
    this.categoryFacet.categoryFacetQueryController.getValues([], true).then(values => {
      this.categoryChildrenValueRenderer.renderChildren(values);
    });
  }

  public renderChildren() {
    this.categoryChildrenValueRenderer.renderChildren();
  }

  public getPath(partialPath: string[] = []) {
    return partialPath;
  }

  public getChildren() {
    return this.children;
  }
}
