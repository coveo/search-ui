import { Dom, $$ } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryJsonValues } from './CategoryFacet';

export interface CategoryValueParent {
  clearChildrenExceptOne: (except: CategoryValue) => void;
  renderChildren: () => void;
  getPath: (partialPath: string[]) => string[];
}

export class CategoryValue implements CategoryValueParent {
  private children: CategoryValue[] = [];
  private listOfChildValues: Dom;
  private element: Dom;
  private collapseArrow: Dom;

  constructor(
    private parentElement: Dom,
    private value: string,
    private parent: CategoryValueParent,
    private categoryFacetTemplates: CategoryFacetTemplates
  ) {
    this.element = this.categoryFacetTemplates.buildListElement(this.value);
    this.collapseArrow = this.categoryFacetTemplates.buildCollapseArrow();
  }

  public render() {
    this.parentElement.append(this.element.el);

    this.getCaption().on('click', async e => {
      this.openChildMenu();
    });
  }

  public async renderChildren() {
    if (this.listOfChildValues && this.children.length == this.listOfChildValues.findAll('.coveo-category-facet-value').length) {
      return;
    }

    if (!this.listOfChildValues) {
      this.listOfChildValues = this.categoryFacetTemplates.buildListRoot();
    }

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const { values } = await fetch('http://localhost:8085/api', {
      headers,
      method: 'POST',
      body: JSON.stringify({ path: this.getPath() })
    })
      .then<CategoryJsonValues>(response => response.json())
      .catch(e => {
        console.log(e);
        return { values: [] } as CategoryJsonValues;
      });

    this.clearChildren();
    this.element.append(this.listOfChildValues.el);

    this.addChildren(values);
    this.children.forEach(categoryValue => {
      categoryValue.render();
    });
  }

  private addChildren(values: string[]) {
    values.forEach(value => {
      this.children.push(new CategoryValue(this.listOfChildValues, value, this, this.categoryFacetTemplates));
    });
  }

  public hideSiblings() {
    this.parent.clearChildrenExceptOne(this);
  }

  public showSiblings() {
    this.parent.renderChildren();
  }

  public clearChildren() {
    this.children = [];
    this.listOfChildValues && this.listOfChildValues.remove();
  }

  public clearChildrenExceptOne(except: CategoryValue) {
    this.children.forEach(categoryValue => {
      if (except !== categoryValue) {
        categoryValue.clear();
      }
    });
  }

  public clear() {
    this.element.remove();
  }

  public getPath(partialPath: string[] = []) {
    partialPath.unshift(this.value);
    return this.parent.getPath(partialPath);
  }

  public getCaption() {
    return $$(this.element.find('.coveo-category-facet-value-caption'));
  }

  public getParent() {
    return this.parent;
  }

  public getValue() {
    return this.value;
  }

  private openChildMenu() {
    this.renderChildren();
    this.showCollapseArrow();
    this.hideSiblings();
  }

  private closeChildMenu() {
    this.clearChildren();
    this.hideCollapseArrow();
    this.showSiblings();
  }

  private showCollapseArrow() {
    if (!this.collapseArrow.el.parentElement) {
      const label = this.element.find('label');
      this.collapseArrow.insertBefore(label);

      this.collapseArrow.on('click', e => {
        this.closeChildMenu();
      });
    }
  }

  private hideCollapseArrow() {
    this.collapseArrow.remove();
  }
}
