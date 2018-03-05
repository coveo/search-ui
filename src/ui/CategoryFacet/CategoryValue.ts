import { Dom, $$ } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';

export interface CategoryValueParent {
  categoryChildrenValueRenderer: CategoryChildrenValueRenderer;
  getPath: (partialPath?: string[]) => string[];
}

export type CategoryJsonValues = { [key: string]: string[] };

export class CategoryValue implements CategoryValueParent {
  private element: Dom;
  private collapseArrow: Dom;
  private arrowOnClick: (e: Event) => void;
  private captionOnClick: (e: Event) => void;

  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(
    private parentElement: Dom,
    private value: string,
    private parent: CategoryValueParent,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryFacet: CategoryFacet
  ) {
    this.element = this.categoryFacetTemplates.buildListElement(this.value);
    this.collapseArrow = this.categoryFacetTemplates.buildCollapseArrow();
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(this.element, categoryFacetTemplates, this, this.categoryFacet);

    this.arrowOnClick = () => this.closeChildMenu();
    this.captionOnClick = () => this.openChildMenu();
    this.getCaption().on('click', this.captionOnClick);
  }

  public render() {
    this.parentElement.append(this.element.el);
  }

  public hideSiblings() {
    this.parent.categoryChildrenValueRenderer.clearChildrenExceptOne(this);
  }

  public showSiblings() {
    // this.parent.categoryChildrenValueRenderer.renderChildren();
  }

  public clear() {
    this.getCaption().off('click', this.captionOnClick);
    this.element.detach();
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

  private async openChildMenu() {
    const values = await this.categoryFacet.categoryFacetQueryController.getValues(this.getPath());
    this.categoryChildrenValueRenderer.renderChildren(values);
    this.showCollapseArrow();
    this.hideSiblings();
  }

  private closeChildMenu() {
    this.categoryChildrenValueRenderer.clearChildren();
    this.hideCollapseArrow();
    this.showSiblings();
  }

  private showCollapseArrow() {
    if (!this.collapseArrow.el.parentElement) {
      this.collapseArrow.on('click', this.arrowOnClick);
      const label = this.element.find('label');
      this.collapseArrow.insertBefore(label);
    }
  }
  private hideCollapseArrow() {
    if (this.collapseArrow.el.parentElement) {
      this.collapseArrow.off('click', this.arrowOnClick);
      this.collapseArrow.detach();
    }
  }
}
