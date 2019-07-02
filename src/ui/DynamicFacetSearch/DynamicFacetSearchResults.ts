import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';
import { IFacetSearchResponse } from '../../rest/Facet/FacetSearchResponse';
import { DynamicFacetValue } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { FacetValueState } from '../../rest/Facet/FacetValueState';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';

export class DynamicFacetSearchResults {
  public element: HTMLElement;
  private facetValues: DynamicFacetValue[];

  constructor(private facet: DynamicFacet, private searchId: string) {
    this.element = $$('ul', {
      id: `${this.searchId}-listbox`,
      role: 'listbox',
      className: 'coveo-dynamic-facet-search-results'
    }).el;
    $$(this.element).hide();
  }

  public createFromResponse(response: IFacetSearchResponse) {
    this.facetValues = response.values.map(
      (facetValue, index) =>
        new DynamicFacetValue(
          {
            value: facetValue.rawValue,
            displayValue: facetValue.displayValue,
            numberOfResults: facetValue.count,
            state: FacetValueState.idle,
            position: index + 1
          },
          this.facet
        )
    );
  }

  public render() {
    this.empty();
    if (!this.facetValues.length) {
      return;
    }

    const fragment = document.createDocumentFragment();
    this.facetValues.forEach(facetValue => {
      fragment.appendChild(facetValue.render());
    });

    this.element.appendChild(fragment);
    $$(this.element).show();
  }

  public empty() {
    $$(this.element).empty();
    $$(this.element).hide();
  }
}
