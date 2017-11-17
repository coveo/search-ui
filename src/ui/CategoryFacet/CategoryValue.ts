import { Dom, $$ } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryJsonValues } from './CategoryFacet';

export class CategoryValue {
  private children: CategoryValue[] = [];
  private listOfChildValues: Dom;
  private rendered = false;
  private listElement: Dom;

  constructor(
    private element: Dom,
    private value: string,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private parent: CategoryValue = null
  ) {
    this.listElement = this.categoryFacetTemplates.buildListElement(this.value);
  }

  public render() {
    if (!this.rendered) {
      this.rendered = true;
      this.element.append(this.listElement.el);

      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      this.getCaption().on('click', async e => {
        console.log('eeee');
        const { values } = await fetch('http://localhost:8085/api', {
          headers,
          method: 'POST',
          body: JSON.stringify({ path: this.getPath() })
        }).then<CategoryJsonValues>(response => response.json());
        this.renderChildren(values);
      });
    }
  }

  public renderChildren(values: string[]) {
    if (values.length != 0) {
      if (!this.listOfChildValues) {
        this.listOfChildValues = this.categoryFacetTemplates.buildListRoot();
        this.listElement.append(this.listOfChildValues.el);
      }
      values.forEach(value => {
        const categoryValue = new CategoryValue(this.listOfChildValues, value, this.categoryFacetTemplates, this);
        categoryValue.render();
        this.children.push(categoryValue);
      });
    }
  }

  public getCaption() {
    return $$(this.listElement.find('.coveo-category-facet-value-caption'));
  }
  public getParent() {
    return this.parent;
  }

  public getValue() {
    return this.value;
  }

  public getPath() {
    const path: string[] = [this.value];
    let currentCategoryValue: CategoryValue = this.parent;
    while (currentCategoryValue) {
      path.push(currentCategoryValue.getValue());
      currentCategoryValue = currentCategoryValue.getParent();
    }
    return path.reverse();
  }
}
