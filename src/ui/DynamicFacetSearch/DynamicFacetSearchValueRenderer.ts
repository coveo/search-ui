import { $$, Dom } from '../../utils/Dom';
import { DynamicFacetValue } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { DynamicFacetValueCheckbox } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValueCheckbox';
import { IDynamicFacet, IValueRenderer } from '../DynamicFacet/IDynamicFacet';

export class DynamicFacetSearchValueRenderer implements IValueRenderer {
  private dom: Dom;
  private valueCheckbox: DynamicFacetValueCheckbox;

  constructor(private facetValue: DynamicFacetValue, private facet: IDynamicFacet) {}

  public render() {
    this.dom = $$('div', {
      className: 'coveo-dynamic-facet-value',
      dataValue: this.facetValue.value
    });

    this.renderCheckbox();
    return this.dom.el;
  }

  private renderCheckbox() {
    this.valueCheckbox = new DynamicFacetValueCheckbox(this.facetValue);
    $$(this.valueCheckbox.element).find('button').setAttribute('tabindex', '-1');

    this.dom.append(this.valueCheckbox.element);
  }

  public selectAction() {
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.toggleSelectValue(this.facetValue.value);
    this.facetValue.select();
    this.facet.scrollToTop();
    this.facet.triggerNewQuery(() => this.facetValue.logSelectActionToAnalytics());
  }
}
