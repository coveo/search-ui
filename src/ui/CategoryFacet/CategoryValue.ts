import { Dom, $$ } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';

export interface CategoryValueParent {
  listRoot: Dom;
  path: string[];
  categoryChildrenValueRenderer: CategoryChildrenValueRenderer;
  renderAsParent(categoryFacetValue: ICategoryFacetValue): CategoryValue;
  renderChildren(categoryFacetValues: ICategoryFacetValue[]): void;
}

export class CategoryValue implements CategoryValueParent {
  private collapseArrow: Dom;
  private label: Dom;

  public element: Dom;
  public isActive = false;
  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(
    public listRoot: Dom,
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
    this.label.one('click', () => this.onLabelClick());
  }

  public render(isChild: boolean) {
    if (this.passededMaximumDepth()) {
      this.element.addClass('coveo-category-facet-last-value');
    }

    if (isChild) {
      this.element.addClass('coveo-category-facet-child-value');
    } else {
      this.element.addClass('coveo-category-facet-parent-value');
    }

    this.listRoot.append(this.element.el);
  }

  public getDescriptor() {
    return {
      value: this.value,
      count: this.count,
      path: this.path
    };
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

  private onLabelClick() {
    if (!this.passededMaximumDepth()) {
      this.categoryFacet.logAnalyticsEvent(analyticsActionCauseList.categoryFacetSelect);
      this.categoryFacet.changeActivePath(this.path);
    }
  }

  private passededMaximumDepth() {
    return this.path.length - this.categoryFacet.options.basePath.length >= this.categoryFacet.options.maximumDepth;
  }
}
