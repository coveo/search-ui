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
  private keyboardActiveValue?: DynamicFacetValue;

  constructor(private facet: DynamicFacet, private search: DynamicFacetSearch) {
    this.element = $$('ul', {
      id: `${this.search.id}-listbox`,
      role: 'listbox',
      className: 'coveo-dynamic-facet-search-values',
      ariaLabelledby: `${this.search.id}-label`
    }).el;
    $$(this.element).hide();
  }

  public renderFromResponse(response: IFacetSearchResponse) {
    this.clearValues();
    this.mapResponseToValues(response);
    this.render();
    this.updateAccessibilityAttributes();
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
    const noValuesFoundElement = $$(
      'li',
      {
        className: 'coveo-dynamic-facet-search-value-not-found'
      },
      label
    ).el;

    this.element.appendChild(noValuesFoundElement);
    this.search.updateAriaLive(label);
  }

  private addEventListeners() {
    this.facetValues.forEach(facetValue => {
      $$(facetValue.renderedElement).on('mouseenter', this.setMouseActiveValue.bind(this, facetValue));
      $$(facetValue.renderedElement).on('mouseleave', this.resetMouseActiveValue.bind(this));
    });
  }

  public clearValues() {
    this.resetMouseActiveValue();
    this.resetKeyboardActiveValue();
    $$(this.element).empty();
    $$(this.element).hide();
    this.facetValues = [];
    this.updateAccessibilityAttributes();
  }

  private hasValues() {
    return !!this.facetValues.length;
  }

  public isMouseOnValue() {
    return !!this.mouseActiveValue;
  }

  private setMouseActiveValue(facetValue: DynamicFacetValue) {
    this.mouseActiveValue = facetValue;
  }

  private resetMouseActiveValue() {
    this.mouseActiveValue = null;
  }

  private setKeyboardActiveValue(facetValue: DynamicFacetValue) {
    this.keyboardActiveValue = facetValue;
    this.activateFocusOnValue(this.keyboardActiveValue);
  }

  private resetKeyboardActiveValue() {
    if (!this.keyboardActiveValue) {
      return;
    }

    this.deactivateFocusOnValue(this.keyboardActiveValue);
    this.keyboardActiveValue = null;
  }

  private activateFocusOnValue(facetValue: DynamicFacetValue) {
    const valueDom = $$(facetValue.renderedElement);
    valueDom.addClass('coveo-focused');
    valueDom.setAttribute('aria-selected', 'true');
  }

  private deactivateFocusOnValue(facetValue: DynamicFacetValue) {
    const valueDom = $$(facetValue.renderedElement);
    valueDom.removeClass('coveo-focused');
    valueDom.setAttribute('aria-selected', 'false');
  }

  public moveActiveValueDown() {
    if (!this.facetValues.length) {
      return;
    }

    const nextActiveValue = this.nextOrFirstValue;
    this.resetKeyboardActiveValue();
    this.setKeyboardActiveValue(nextActiveValue);
    this.updateAccessibilityAttributes();
  }

  public moveActiveValueUp() {
    if (!this.facetValues.length) {
      return;
    }

    const previousActiveValue = this.previousOrLastValue;
    this.resetKeyboardActiveValue();
    this.setKeyboardActiveValue(previousActiveValue);
    this.updateAccessibilityAttributes();
  }

  private get nextOrFirstValue() {
    if (!this.keyboardActiveValue) {
      return this.facetValues[0];
    }

    const nextValueIndex = this.facetValues.indexOf(this.keyboardActiveValue) + 1;
    return nextValueIndex < this.facetValues.length ? this.facetValues[nextValueIndex] : this.facetValues[0];
  }

  private get previousOrLastValue() {
    const lastValueIndex = this.facetValues.length - 1;
    if (!this.keyboardActiveValue) {
      return this.facetValues[lastValueIndex];
    }

    const previousValueIndex = this.facetValues.indexOf(this.keyboardActiveValue) - 1;
    return previousValueIndex >= 0 ? this.facetValues[previousValueIndex] : this.facetValues[lastValueIndex];
  }

  private updateAccessibilityAttributes() {
    const activeDescendant = this.keyboardActiveValue ? this.keyboardActiveValue.renderedElement.getAttribute('id') : '';

    this.search.updateAccessibilityAttributes({
      activeDescendant,
      expanded: this.hasValues()
    });
  }
}
