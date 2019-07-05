import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';
import { IFacetSearchResponse } from '../../rest/Facet/FacetSearchResponse';
import { DynamicFacetValue } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { FacetValueState } from '../../rest/Facet/FacetValueState';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { DynamicFacetSearch } from './DynamicFacetSearch';
import { l } from '../../strings/Strings';
import { DynamicFacetSearchValueRenderer } from './DynamicFacetSearchValueRenderer';

export class DynamicFacetSearchValues {
  public element: HTMLElement;
  private facetValues: DynamicFacetValue[] = [];
  private mouseActiveValue?: DynamicFacetValue;
  // private keyboardActiveValue?: DynamicFacetValue;

  constructor(private facet: DynamicFacet, private search: DynamicFacetSearch) {
    this.element = $$('ul', {
      id: `${this.search.id}-listbox`,
      role: 'listbox',
      className: 'coveo-dynamic-facet-search-values'
    }).el;
    $$(this.element).hide();
  }

  public renderFromResponse(response: IFacetSearchResponse) {
    this.empty();
    this.mapResponseToValues(response);
    this.render();
  }

  private mapResponseToValues(response: IFacetSearchResponse) {
    this.facetValues = response.values.map((value, index) => {
      const facetValue = new DynamicFacetValue(
        {
          value: value.rawValue,
          displayValue: value.displayValue,
          numberOfResults: value.count,
          state: FacetValueState.idle,
          position: index + 1
        },
        this.facet,
        DynamicFacetSearchValueRenderer
      );

      return facetValue;
    });
  }

  private render() {
    $$(this.element).show();

    if (!this.hasValues()) {
      return this.renderNoValuesFound();
    }

    this.renderValues();
    this.addEventListeners();
  }

  private renderValues() {
    const fragment = document.createDocumentFragment();
    this.facetValues.forEach(facetValue => {
      fragment.appendChild(facetValue.renderedElement);
    });

    this.element.appendChild(fragment);
  }

  private renderNoValuesFound() {
    const label = l('NoValuesFound');
    const noValuesFoundElement = $$('li', { className: 'coveo-dynamic-facet-search-value-not-found' }, label).el;

    this.element.appendChild(noValuesFoundElement);
  }

  private addEventListeners() {
    this.facetValues.forEach(facetValue => {
      $$(facetValue.renderedElement).on('mouseenter', this.activateMouseFocusOnElement.bind(this, facetValue));
      $$(facetValue.renderedElement).on('mouseleave', this.resetMouseFocus.bind(this));
    });
  }

  private activateMouseFocusOnElement(facetValue: DynamicFacetValue) {
    this.mouseActiveValue = facetValue;

    const valueDom = $$(this.mouseActiveValue.renderedElement);
    valueDom.addClass('coveo-focused');
    valueDom.setAttribute('aria-selected', 'true');

    this.search.updateActiveDescendant(valueDom.getAttribute('id'));
  }

  private resetMouseFocus() {
    if (!this.mouseActiveValue) {
      return;
    }

    const valueDom = $$(this.mouseActiveValue.renderedElement);
    valueDom.addClass('coveo-focused');
    valueDom.setAttribute('aria-selected', 'true');

    this.search.updateActiveDescendant();
    this.mouseActiveValue = null;
  }

  // // public updateActiveValue(facetValue?: DynamicFacetValue) {
  // //   this.activeValue = facetValue;
  // // }

  // // public moveActiveValueDown() {
  // //   if (!this.facetValues.length) {
  // //     return;
  // //   }

  // //   const nextValue = this.nextOrFirstValue;
  // //   this.activeValue && this.getRendererForValue(this.activeValue).deactivateFocus();
  // //   this.getRendererForValue(nextValue).activateFocus();
  // // }

  // // private get nextOrFirstValue() {
  // //   if (!this.activeValue) {
  // //     return this.facetValues[0];
  // //   }

  // //   const nextValueIndex = this.facetValues.indexOf(this.activeValue) + 1;
  // //   return nextValueIndex < this.facetValues.length ? this.facetValues[nextValueIndex] : this.facetValues[0];
  // // }

  // private getRendererForValue(facetValue: DynamicFacetValue) {
  //   return <DynamicFacetSearchValueRenderer>facetValue.renderer;
  // }

  public empty() {
    this.resetMouseFocus();
    $$(this.element).empty();
    $$(this.element).hide();
    this.facetValues = [];
  }

  public hasValues() {
    return !!this.facetValues.length;
  }

  public isMouseOnValue() {
    return !!this.mouseActiveValue;
  }
}
