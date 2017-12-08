import { Dom, $$ } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryJsonValues } from './CategoryFacet';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface CategoryValueParent {
  hideChildren: (filterOut?: CategoryValue) => void;
  renderChildren: () => void;
  getPath: (partialPath: string[]) => string[];
}

export class CategoryValue implements CategoryValueParent {
  private children: CategoryValue[] = [];
  private listOfChildValues: Dom;
  private listElement: Dom;
  private childrenMenuOpen = false;

  constructor(
    private element: Dom,
    private value: string,
    private parent: CategoryValueParent,
    private categoryFacetTemplates: CategoryFacetTemplates
  ) {
    this.listElement = this.categoryFacetTemplates.buildListElement(this.value);
  }

  public render() {
    this.element.append(this.listElement.el);

    this.getCaption().on('click', async e => {
      this.openChildMenu();
    });
  }

  public async renderChildren() {
    if (!this.childrenMenuOpen) {
      this.children = [];
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      const { values } = await fetch('http://localhost:8085/api', {
        headers,
        method: 'POST',
        body: JSON.stringify({ path: this.getPath() })
      }).then<CategoryJsonValues>(response => response.json());

      this.listOfChildValues = this.categoryFacetTemplates.buildListRoot();
      this.listElement.append(this.listOfChildValues.el);

      this.addChildren(values);
      this.children.forEach(categoryValue => {
        categoryValue.render();
      });
    }
    this.show();
  }

  public addChildren(values: string | string[]) {
    if (typeof values === 'string') {
      values = [values];
    }
    values.forEach(value => {
      this.children.push(new CategoryValue(this.listOfChildValues, value, this.parent, this.categoryFacetTemplates));
    });
  }

  public hideSiblings() {
    this.parent.hideChildren(this);
  }

  public showSiblings() {
    this.parent.renderChildren();
  }

  public hideChildren(filterOut?: CategoryValue) {
    for (const categoryValue of this.children) {
      if (filterOut && filterOut.getValue() == categoryValue.getValue()) {
        continue;
      }
      categoryValue.hide();
    }
  }

  public getPath(partialPath: string[] = []) {
    partialPath.unshift(this.value);
    return this.parent.getPath(partialPath);
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

  public show() {
    this.listElement.show();
  }

  public hide() {
    this.listElement.hide();
    this.hideChildren();
  }

  private openChildMenu() {
    if (!this.childrenMenuOpen) {
      this.childrenMenuOpen = true;
      this.children;
      this.renderChildren();
      this.showCollapseArrow();
    }
  }

  public closeChildMenu() {
    if (this.childrenMenuOpen) {
      this.childrenMenuOpen = false;
      this.hideChildren();
      this.hideCollapseArrow();
      this.showSiblings();
    }
  }

  private showCollapseArrow() {
    const label = this.listElement.find('label');
    const collapseArrow = $$('span', { className: 'coveo-category-facet-collapse-children' }, SVGIcons.icons.arrowDown);
    SVGDom.addClassToSVGInContainer(collapseArrow.el, 'coveo-category-facet-collapse-children-svg');
    collapseArrow.insertBefore(label);

    collapseArrow.on('click', e => {
      this.closeChildMenu();
    });
  }

  private hideCollapseArrow() {
    const arrow = this.listElement.find('.coveo-category-facet-collapse-children');
    if (arrow) {
      $$(arrow).hide();
    }
  }
}
