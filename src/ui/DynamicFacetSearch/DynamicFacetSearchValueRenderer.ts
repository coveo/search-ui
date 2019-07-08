import { $$, Dom } from '../../utils/Dom';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { DynamicFacetValue, ValueRenderer } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { DynamicFacetValueCheckbox } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValueCheckbox';

export class DynamicFacetSearchValueRenderer implements ValueRenderer {
  private dom: Dom;
  private valueCheckbox: DynamicFacetValueCheckbox;

  constructor(private facetValue: DynamicFacetValue, private facet: DynamicFacet) {}

  public render() {
    this.dom = $$('div', {
      role: 'option',
      className: 'coveo-dynamic-facet-value',
      dataValue: this.facetValue.value
    });

    this.renderCheckbox();
    return this.dom.el;
  }

  private renderCheckbox() {
    this.valueCheckbox = new DynamicFacetValueCheckbox(this.facetValue);
    $$(this.valueCheckbox.element)
      .find('button')
      .setAttribute('tabindex', '-1');

    this.dom.append(this.valueCheckbox.element);
  }

  public selectAction() {
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.triggerNewQuery(() => this.facetValue.logSelectActionToAnalytics());
  }
}
