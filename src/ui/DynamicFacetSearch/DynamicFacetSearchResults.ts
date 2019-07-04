import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';
import { IFacetSearchResponse } from '../../rest/Facet/FacetSearchResponse';
import { DynamicFacetValue } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { FacetValueState } from '../../rest/Facet/FacetValueState';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { DynamicFacetSearch } from './DynamicFacetSearch';
import { l } from '../../strings/Strings';
import { DynamicFacetSearchValueRenderer } from './DynamicFacetSearchValueRenderer';

export class DynamicFacetSearchResults {
  public element: HTMLElement;
  private facetValues: DynamicFacetValue[];

  constructor(private facet: DynamicFacet, private search: DynamicFacetSearch) {
    this.element = $$('ul', {
      id: `${this.search.id}-listbox`,
      role: 'listbox',
      className: 'coveo-dynamic-facet-search-results'
    }).el;
    $$(this.element).hide();
  }

  public createFromResponse(response: IFacetSearchResponse) {
    this.facetValues = response.values.map((resultValue, index) => {
      const facetValue = new DynamicFacetValue(
        {
          value: resultValue.rawValue,
          displayValue: resultValue.displayValue,
          numberOfResults: resultValue.count,
          state: FacetValueState.idle,
          position: index + 1
        },
        this.facet,
        DynamicFacetSearchValueRenderer
      );

      return facetValue;
    });
  }

  public render() {
    this.empty();
    if (!this.hasValues()) {
      return this.renderNoValuesFound();
    }

    this.renderValues();
  }

  private renderValues() {
    const fragment = document.createDocumentFragment();
    this.facetValues.forEach(facetValue => {
      fragment.appendChild(facetValue.render());
    });

    this.element.appendChild(fragment);
    $$(this.element).show();
  }

  private renderNoValuesFound() {
    const label = l('NoValuesFound');
    const noValuesFoundElement = $$('li', { className: 'coveo-dynamic-facet-search-result-not-found' }, label).el;

    this.element.appendChild(noValuesFoundElement);
    $$(this.element).show();
  }

  public empty() {
    $$(this.element).empty();
    $$(this.element).hide();
  }

  public hasValues() {
    return !!this.facetValues.length;
  }
}
