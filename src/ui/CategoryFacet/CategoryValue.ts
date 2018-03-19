import { Dom, $$ } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';
import { IQueryResults } from '../../rest/QueryResults';

export interface CategoryValueParent {
  hideChildrenExceptOne: (categoryValue: CategoryValue) => void;
  renderChildren: () => Promise<void | IQueryResults>;
  getPath: (partialPath?: string[]) => string[];
  isActive: boolean;
}

export type CategoryJsonValues = { [key: string]: string[] };

export class CategoryValue implements CategoryValueParent {
  private element: Dom;
  private collapseArrow: Dom;
  public isActive = false;
  private arrowOnClick: (e: Event) => void;
  private captionOnClick: (e: Event) => void;

  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(
    private parentElement: Dom,
    private value: string,
    private count: number,
    private parent: CategoryValueParent,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryFacet: CategoryFacet
  ) {
    this.element = this.categoryFacetTemplates.buildListElement({ value: this.value, count: this.count });
    this.collapseArrow = this.categoryFacetTemplates.buildCollapseArrow();
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(this.element, categoryFacetTemplates, this, this.categoryFacet);
    this.arrowOnClick = () => this.closeChildMenu();
    this.captionOnClick = () => (this.isActive ? this.closeChildMenu() : this.renderChildren());
    this.getCaption().on('click', this.captionOnClick);
  }

  public render() {
    this.parentElement.append(this.element.el);
  }

  public hideSiblings() {
    this.parent.hideChildrenExceptOne(this);
  }

  public hideChildrenExceptOne(except: CategoryValue) {
    this.categoryChildrenValueRenderer.clearChildrenExceptOne(except);
  }

  public showSiblings() {
    return this.parent.renderChildren();
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

  public async renderChildren() {
    this.parent.isActive = false;
    this.isActive = true;
    return this.categoryFacet.queryController.executeQuery().then(() => {
      this.showCollapseArrow();
      this.hideSiblings();
    });
  }

  private closeChildMenu() {
    this.isActive = false;
    this.showSiblings().then(() => {
      this.categoryChildrenValueRenderer.clearChildren();
      this.hideCollapseArrow();
    });
  }

  private showCollapseArrow() {
    if (!this.collapseArrow.el.parentElement) {
      this.collapseArrow.on('click', this.arrowOnClick);
      const label = this.element.find('label');
      $$(label).prepend(this.collapseArrow.el);
    }
  }
  private hideCollapseArrow() {
    if (this.collapseArrow.el.parentElement) {
      this.collapseArrow.off('click', this.arrowOnClick);
      this.collapseArrow.detach();
    }
  }
}
