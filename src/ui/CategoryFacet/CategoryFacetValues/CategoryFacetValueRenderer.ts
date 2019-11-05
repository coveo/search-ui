import { $$, Dom } from '../../../utils/Dom';
import { CategoryFacet } from '../CategoryFacet';
import { CategoryFacetValue, ValueRenderer } from './CategoryFacetValue';

export class CategoryFacetValueRenderer implements ValueRenderer {
  private dom: Dom;

  constructor(private facetValue: CategoryFacetValue, private facet: CategoryFacet) { }

  public render() {
    this.dom = $$('li', {
      className: 'coveo-dynamic-category-facet-value',
      dataValue: this.facetValue.value
    }, `${this.facetValue.displayValue} (${this.facetValue.numberOfResults})`);

    this.dom.on('click', () => this.selectAction());
    this.toggleSelectedClass();
    return this.dom.el;
  }

  private toggleSelectedClass() {
    this.dom.toggleClass('coveo-selected', this.facetValue.isSelected);
  }

  private selectAction() {
    this.facet.toggleSelectPath(this.facetValue.path);
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.scrollToTop();
    this.toggleSelectedClass();
    this.facet.triggerNewQuery(() => this.facetValue.logSelectActionToAnalytics());
  }
}
