import { $$, Dom } from '../../../utils/Dom';
import { CategoryFacet } from '../CategoryFacet';
import { CategoryFacetValue } from './CategoryFacetValue';
import { SVGIcons } from '../../../utils/SVGIcons';
import { SVGDom } from '../../../utils/SVGDom';

export class CategoryFacetValueRenderer {
  private button: Dom;

  constructor(private facetValue: CategoryFacetValue, private facet: CategoryFacet) { }

  public render() {
    this.button = $$('button', {
      className: 'coveo-dynamic-category-facet-value',
      ariaLabel: this.facetValue.selectAriaLabel
    });
    const label = $$('span', { className: 'coveo-dynamic-category-facet-value-label' });
    label.text(this.facetValue.displayValue);
    this.button.append(label.el);
    this.button.append($$('span', { className: 'coveo-dynamic-category-facet-value-count' }, `(${this.facetValue.formattedCount})`).el);

    this.button.toggleClass('coveo-selected', this.facetValue.isSelected);
    this.button.toggleClass('coveo-with-space', this.shouldHaveMargin);
    this.facetValue.isSelected && this.button.setAttribute('disabled', 'true');
    this.shouldHaveArrow && this.prependArrow();

    this.button.on('click', () => this.selectAction());
    return $$('li', { dataValue: this.facetValue.value }, this.button).el;
  }

  private prependArrow() {
    const arrowIcon = $$('div', { className: 'coveo-dynamic-category-facet-value-arrow' }, SVGIcons.icons.arrowLeft);
    SVGDom.addClassToSVGInContainer(arrowIcon.el, 'coveo-dynamic-category-facet-value-arrow-svg');
    this.button.prepend(arrowIcon.el);
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
