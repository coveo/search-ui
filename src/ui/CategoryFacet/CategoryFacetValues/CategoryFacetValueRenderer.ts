import { $$, Dom } from '../../../utils/Dom';
import { CategoryFacet } from '../CategoryFacet';
import { CategoryFacetValue } from './CategoryFacetValue';
import { SVGIcons } from '../../../utils/SVGIcons';
import { SVGDom } from '../../../utils/SVGDom';

export class CategoryFacetValueRenderer {
  private dom: Dom;

  constructor(private facetValue: CategoryFacetValue, private facet: CategoryFacet) { }

  public render() {
    this.dom = $$('li', {
      className: 'coveo-dynamic-category-facet-value',
      dataValue: this.facetValue.value
    });
    this.dom.append($$('span', { className: 'coveo-dynamic-category-facet-value-label' }, this.facetValue.displayValue).el);
    this.dom.append($$('span', { className: 'coveo-dynamic-category-facet-value-count' }, `(${this.facetValue.formattedCount})`).el);

    this.dom.toggleClass('coveo-selected', this.facetValue.isSelected);
    this.dom.toggleClass('coveo-with-space', this.shouldHaveMargin);
    this.shouldHaveArrow && this.prependArrow();
    
    this.dom.on('click', () => this.selectAction());
    return this.dom.el;
  }

  private prependArrow() {
    const arrowIcon = $$('div', { className: 'coveo-dynamic-category-facet-value-arrow' }, SVGIcons.icons.arrowLeft);
    SVGDom.addClassToSVGInContainer(arrowIcon.el, 'coveo-dynamic-category-facet-value-arrow-svg');
    this.dom.prepend(arrowIcon.el);
  }

  private get shouldHaveMargin() {
    return this.facetValue.path.length > 1 && !this.facetValue.children.length;
  }

  private get shouldHaveArrow() {
    return !this.facetValue.isSelected && !!this.facetValue.children.length;
  }

  private selectAction() {
    this.facet.selectPath(this.facetValue.path);
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.scrollToTop();
    this.facet.triggerNewQuery(() => this.facetValue.logSelectActionToAnalytics());
  }
}
