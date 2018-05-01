import { Dom, $$ } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';

export interface CategoryValueParent {
  hideChildrenExceptOne: (categoryValue: CategoryValue) => void;
  renderChildren: (values: ICategoryFacetValue[]) => void;
  renderAsParent: (value: ICategoryFacetValue) => CategoryValue;
  getPath: (partialPath?: string[]) => string[];
  categoryChildrenValueRenderer: CategoryChildrenValueRenderer;
}

export class CategoryValue implements CategoryValueParent {
  public element: Dom;
  private collapseArrow: Dom;
  private labelOnClick: (e: Event) => void;
  private label: Dom;

  public isActive = false;
  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(
    private parentElement: Dom,
    public value: string,
    private count: number,
    public parent: CategoryValueParent,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryFacet: CategoryFacet
  ) {
    this.element = this.categoryFacetTemplates.buildListElement({ value: this.value, count: this.count });
    this.label = $$(this.element.find('.coveo-category-facet-value-label'));
    this.collapseArrow = this.categoryFacetTemplates.buildCollapseArrow();
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(this.element, categoryFacetTemplates, this, this.categoryFacet);
    this.labelOnClick = () => (this.isActive ? this.closeChildMenu() : this.categoryFacet.changeActivePath(this.getPath()));
    this.label.one('click', this.labelOnClick);
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
    this.categoryFacet.changeActivePath(this.parent.getPath());
  }

  public clear() {
    this.element.detach();
    this.categoryChildrenValueRenderer.clearChildren();
  }

  public getPath(partialPath: string[] = []) {
    partialPath.unshift(this.value);
    return this.parent.getPath(partialPath);
  }

  public renderChildren(values: ICategoryFacetValue[]) {
    this.isActive = true;
    this.element.addClass('coveo-active-category-facet-parent');
    this.categoryChildrenValueRenderer.renderChildren(values);
  }

  public renderAsParent(value: ICategoryFacetValue) {
    return this.categoryChildrenValueRenderer.renderAsParent(value);
  }

  get children() {
    return this.categoryChildrenValueRenderer.children;
  }
  private closeChildMenu() {
    this.isActive = false;
    this.showSiblings();
  }

  public showCollapseArrow() {
    if (!this.collapseArrow.el.parentElement) {
      const label = this.element.find('label');
      $$(label).prepend(this.collapseArrow.el);
    }
  }
}
