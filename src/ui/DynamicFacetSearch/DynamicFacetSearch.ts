import { Combobox } from '../Combobox/Combobox';
import { l } from '../../strings/Strings';
import { FacetSearchController } from '../../controllers/FacetSearchController';
import { IFacetSearchResponse } from '../../rest/Facet/FacetSearchResponse';
import { DynamicFacetValue } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { FacetValueState } from '../../rest/Facet/FacetValueState';
import { DynamicFacetSearchValueRenderer } from './DynamicFacetSearchValueRenderer';
import { IComboboxValue } from '../Combobox/ComboboxValues';
import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { IDynamicFacet } from '../DynamicFacet/IDynamicFacet';
import { FacetUtils } from '../Facet/FacetUtils';
import { $$ } from '../../utils/Dom';

export class DynamicFacetSearch {
  public element: HTMLElement;
  private facetSearchController: FacetSearchController;
  private combobox: Combobox;

  constructor(private facet: IDynamicFacet) {
    this.facetSearchController = new FacetSearchController(this.facet);

    this.combobox = new Combobox({
      label: l('SearchFacetResults', this.facet.options.title),
      searchInterface: this.facet.searchInterface,
      requestValues: terms => this.facetSearch(terms),
      requestMoreValues: () => this.facetSearchController.fetchMore(),
      createValuesFromResponse: (response: IFacetSearchResponse) => this.createValuesFromResponse(response),
      onSelectValue: this.onSelectValue,
      placeholderText: l('Search'),
      wrapperClassName: 'coveo-dynamic-facet-search',
      clearOnBlur: true,
      maxDropdownHeight: () => $$(this.facet.element).find('.coveo-dynamic-facet-values').clientHeight
    });

    this.element = this.combobox.element;
  }

  private async facetSearch(terms: string) {
    return this.facetSearchController.search(terms);
  }

  private getDisplayValue(value: string) {
    return FacetUtils.getDisplayValueFromValueCaption(value, this.facet.options.field as string, this.facet.options.valueCaption);
  }

  private createValuesFromResponse(response: IFacetSearchResponse): IComboboxValue[] {
    return response.values.map((value, index) => {
      const facetValue = new DynamicFacetValue(
        {
          value: value.rawValue,
          // TODO: remove when https://coveord.atlassian.net/browse/SEARCHAPI-4958 is fixed
          displayValue: this.getDisplayValue(value.displayValue),
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
