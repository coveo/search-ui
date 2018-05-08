import { Dom, $$ } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';

export interface CategoryValueParent {
  path: string[];
  categoryChildrenValueRenderer: CategoryChildrenValueRenderer;
  renderAsParent(categoryFacetValue: ICategoryFacetValue): CategoryValue;
  renderChildren(categoryFacetValues: ICategoryFacetValue[]): void;
}

export class CategoryValue implements CategoryValueParent {
  private collapseArrow: Dom;
  private labelOnClick: (e: Event) => void;
  private label: Dom;

  public element: Dom;
  public isActive = false;
  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(
    private parentElement: Dom,
    public value: string,
    public count: number,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryFacet: CategoryFacet,
    public path: string[]
  ) {
    this.element = this.categoryFacetTemplates.buildListElement({ value: this.value, count: this.count });
    this.label = $$(this.element.find('.coveo-category-facet-value-label'));
    this.collapseArrow = this.categoryFacetTemplates.buildCollapseArrow();
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(this.element, categoryFacetTemplates, this, this.categoryFacet);
    this.labelOnClick = () => this.categoryFacet.changeActivePath(this.path);
    this.label.one('click', this.labelOnClick);
  }

  public render() {
    this.parentElement.append(this.element.el);
  }

  public clear() {
    this.element.detach();
    this.categoryChildrenValueRenderer.clearChildren();
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

  public showCollapseArrow() {
    if (!this.collapseArrow.el.parentElement) {
      const label = this.element.find('label');
      $$(label).prepend(this.collapseArrow.el);
    }
  }
}
