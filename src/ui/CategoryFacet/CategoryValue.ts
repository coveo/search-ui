import { Dom, $$ } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet, CategoryValueDescriptor } from './CategoryFacet';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { l } from '../../strings/Strings';

export interface CategoryValueParent {
  listRoot: Dom;
  path: string[];
  categoryChildrenValueRenderer: CategoryChildrenValueRenderer;
  renderAsParent(categoryFacetValue: ICategoryFacetValue): CategoryValue;
  renderChildren(categoryFacetValues: ICategoryFacetValue[]): void;
}

export class CategoryValue implements CategoryValueParent {
  private collapseArrow: Dom;

  public path: string[];
  public element: Dom;
  public isActive = false;
  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(
    public listRoot: Dom,
    public categoryValueDescriptor: CategoryValueDescriptor,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryFacet: CategoryFacet
  ) {
    this.element = this.categoryFacetTemplates.buildListElement({
      value: this.captionedValueDescriptorValue,
      count: this.categoryValueDescriptor.count
    });
    this.collapseArrow = this.categoryFacetTemplates.buildCollapseArrow();
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(this.element, categoryFacetTemplates, this, this.categoryFacet);
    this.path = this.categoryValueDescriptor.path;
  }

  public render(isChild: boolean) {
    if (this.pastMaximumDepth()) {
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
      value: this.categoryValueDescriptor.value,
      count: this.categoryValueDescriptor.count,
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

  public get children() {
    return this.categoryChildrenValueRenderer.children;
  }

  public makeSelectable() {
    const element = $$(this.element.find('.coveo-category-facet-value-label'));
    element.addClass('coveo-selectable');

    const countLabel = l('ResultCount', this.categoryValueDescriptor.count.toString());
    const label = l('SelectValueWithResultCount', this.captionedValueDescriptorValue, countLabel);

    new AccessibleButton()
      .withElement(element)
      .withSelectAction(() => this.onSelect())
      .withLabel(label)
      .build();

    return this;
  }

  public showCollapseArrow() {
    if (!this.collapseArrow.el.parentElement) {
      const label = this.element.find('label');
      $$(label).prepend(this.collapseArrow.el);
    }

    return this;
  }

  private get captionedValueDescriptorValue() {
    const value = this.categoryValueDescriptor.value;
    return this.categoryFacet.getCaption(value);
  }

  private onSelect() {
    if (!this.pastMaximumDepth()) {
      this.categoryFacet.logAnalyticsEvent(analyticsActionCauseList.categoryFacetSelect, this.path);
      this.categoryFacet.scrollToTop();
      this.categoryFacet.changeActivePath(this.path);
      this.categoryFacet.executeQuery();
    }
  }

  private pastMaximumDepth() {
    return this.path.length - this.categoryFacet.options.basePath.length >= this.categoryFacet.options.maximumDepth;
  }
}
