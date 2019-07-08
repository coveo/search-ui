import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { Combobox } from '../Combobox/Combobox';
import { l } from '../../strings/Strings';
import { FacetSearchController } from '../../controllers/FacetSearchController';
import { IFacetSearchResponse } from '../../rest/Facet/FacetSearchResponse';
import { DynamicFacetValue } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { FacetValueState } from '../../rest/Facet/FacetValueState';
import { DynamicFacetSearchValueRenderer } from './DynamicFacetSearchValueRenderer';
import { IComboboxValue } from '../Combobox/ComboboxValues';
import 'styling/DynamicFacetSearch/_DynamicFacetSearch';

export class DynamicFacetSearch {
  public element: HTMLElement;
  private facetSearchController: FacetSearchController;
  private combobox: Combobox;

  constructor(private facet: DynamicFacet) {
    this.facetSearchController = new FacetSearchController(this.facet);

    this.combobox = new Combobox({
      label: l('SearchFacetResults', this.facet.options.title),
      searchInterface: this.facet.searchInterface,
      requestValues: this.facetSearch.bind(this),
      createValuesFromResponse: this.createValuesFromResponse.bind(this),
      onSelectValue: this.onSelectValue,
      placeholderText: l('Search'),
      wrapperClassName: 'coveo-dynamic-facet-search'
    });

    this.element = this.combobox.element;
  }

  public clearAll() {
    this.combobox.clearAll();
  }

  private async facetSearch(terms: string) {
    return await this.facetSearchController.search(terms);
  }

  private createValuesFromResponse(response: IFacetSearchResponse): IComboboxValue[] {
    return response.values.map((value, index) => {
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

      return {
        value: facetValue,
        element: facetValue.renderedElement
      };
    });
  }

  private onSelectValue({ value }: IComboboxValue) {
    (<DynamicFacetSearchValueRenderer>value.renderer).selectAction();
  }
}
