import { $$, Dom } from '../../utils/Dom';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { DynamicFacetValue, ValueRenderer } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { DynamicFacetValueCheckbox } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValueCheckbox';

export class DynamicFacetSearchValueRenderer implements ValueRenderer {
  private dom: Dom;
  private valueCheckbox: DynamicFacetValueCheckbox;
  public id: string;

  constructor(private facetValue: DynamicFacetValue, private facet: DynamicFacet) {}

  public render() {
    this.id = `coveo-dynamic-facet-search-value-${this.facetValue.position}`;
    this.dom = $$('li', {
      id: this.id,
      className: 'coveo-dynamic-facet-value coveo-dynamic-facet-selectable',
      dataValue: this.facetValue.value
    });

    this.toggleSelectedClass();
    this.renderCheckbox();
    this.addMouseEnterAndOutEventListeners();

    return this.dom.el;
  }

  private toggleSelectedClass() {
    this.dom.toggleClass('coveo-selected', this.facetValue.isSelected);
  }

  private renderCheckbox() {
    this.valueCheckbox = new DynamicFacetValueCheckbox(this.facetValue, this.selectAction.bind(this));
    $$(this.valueCheckbox.element)
      .find('button')
      .setAttribute('tabindex', '-1');

    this.dom.append(this.valueCheckbox.element);
  }

  private addMouseEnterAndOutEventListeners() {
    $$(this.dom.el).on('mouseenter', () => this.activateFocus());
    $$(this.dom.el).on('mouseleave', () => this.deactivateFocus());
  }

  public activateFocus() {
    this.dom.addClass('coveo-focused');
    this.dom.setAttribute('aria-selected', 'true');
    this.facet.search.updateActiveValue(this.id, this.facetValue);
  }

  public deactivateFocus() {
    this.dom.removeClass('coveo-focused');
    this.dom.setAttribute('aria-selected', 'false');
    this.facet.search.updateActiveValue();
  }

  public selectAction() {
    this.facet.pinFacetPosition();
    this.facet.toggleSelectValue(this.facetValue.value);
    this.toggleSelectedClass();
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.search.clear();
    this.facet.triggerNewQuery(() => this.facetValue.logSelectActionToAnalytics());
  }
}
