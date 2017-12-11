import { CategoryValueParent, CategoryValue } from './CategoryValue';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { Dom } from '../../utils/Dom';
import { CategoryJsonValues } from './CategoryFacet';

export class CategoryValueRoot implements CategoryValueParent {
  private children: CategoryValue[] = [];

  constructor(private listRoot: Dom, private categoryFacetTemplates: CategoryFacetTemplates) {}

  public clearChildrenExceptOne(except: CategoryValue) {
    for (const categoryValue of this.children) {
      if (except && except.getValue() == categoryValue.getValue()) {
        continue;
      }
      categoryValue.clear();
    }
  }

  public async renderChildren() {
    this.listRoot.empty();
    const { values } = await fetch('http://localhost:8085/api', { method: 'POST' }).then<CategoryJsonValues>(response => response.json());
    this.children = values.map<CategoryValue>(value => {
      const categoryValue = new CategoryValue(this.listRoot, value, this, this.categoryFacetTemplates);
      categoryValue.render();
      return categoryValue;
    });
  }

  public getPath(partialPath: string[]) {
    return partialPath;
  }

  public getChildren() {
    return this.children;
  }
}
