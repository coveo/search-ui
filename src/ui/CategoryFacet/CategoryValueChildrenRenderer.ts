import { Dom } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValue, CategoryJsonValues, CategoryValueParent } from './CategoryValue';

export class CategoryChildrenValueRenderer {
  private children = [];
  private listOfChildValues: Dom;

  constructor(
    private element: Dom,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryValueParent: CategoryValueParent,
    private searchInterfaceRoot: Dom
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
  }

  public clearChildren() {
    this.children.forEach(child => {
      child.clear();
    });
    this.children = [];
  }

  public async renderChildren() {
    if (!this.listOfChildValues) {
      this.listOfChildValues = this.categoryFacetTemplates.buildListRoot();
    }

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const { values } = await fetch('http://localhost:8085/api', {
      headers,
      method: 'POST',
      body: JSON.stringify({ path: this.categoryValueParent.getPath() })
    })
      .then<CategoryJsonValues>(response => response.json())
      .catch(e => {
        console.log(e);
        return { values: [] } as CategoryJsonValues;
      });

    this.clearChildren();
    this.element.append(this.listOfChildValues.el);

    values.forEach(value => {
      const categoryValue = new CategoryValue(this.listOfChildValues, value, this.categoryValueParent, this.categoryFacetTemplates);
      categoryValue.render();
      this.children.push(categoryValue);
    });
  }
}
