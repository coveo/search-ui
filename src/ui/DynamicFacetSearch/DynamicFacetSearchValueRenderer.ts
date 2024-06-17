import { $$, Dom } from '../../utils/Dom';
import { DynamicFacetValue } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { DynamicFacetValueCheckbox } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValueCheckbox';
import { IDynamicFacet, IValueRenderer } from '../DynamicFacet/IDynamicFacet';

export class DynamicFacetSearchValueRenderer implements IValueRenderer {
  private dom: Dom;
  private valueCheckbox: DynamicFacetValueCheckbox;

  constructor(private facetValue: DynamicFacetValue, private facet: IDynamicFacet) {}

  public render() {
    this.valueCheckbox = new DynamicFacetValueCheckbox(this.facetValue);

    const button = $$(this.valueCheckbox.element).find('button');
    button.setAttribute('tabindex', '-1');
    button.setAttribute('inert', 'true');

    const label = $$(this.valueCheckbox.element);
    label.addClass('coveo-dynamic-facet-value');
    label.setAttribute('aria-label', button.getAttribute('aria-label'));
    this.dom = $$(this.valueCheckbox.element);
    return this.dom.el;
  }

  public selectAction() {
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.toggleSelectValue(this.facetValue.value);
    this.facetValue.select();
    this.facet.scrollToTop();
    this.facet.triggerNewQuery(() => this.facetValue.logSelectActionToAnalytics());
  }
}
