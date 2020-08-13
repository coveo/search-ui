import { IDynamicHierarchicalFacet } from '../DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { HierarchicalFacetSearchController } from '../../controllers/HierarchicalFacetSearchController';
import { Combobox } from '../Combobox/Combobox';
import { l } from '../../strings/Strings';
import { IFacetSearchResponse } from '../../rest/Facet/FacetSearchResponse';
import { IComboboxValue } from '../Combobox/ComboboxValues';
import { DynamicHierarchicalFacetSearchValue } from './DynamicHierarchicalFacetSearchValue';
import { DynamicHierarchicalFacetSearchValueRenderer } from './DynamicHierarchicalFacetSearchValueRenderer';
import 'styling/DynamicHierarchicalFacetSearch/_DynamicHierarchicalFacetSearch';

export class DynamicHierarchicalFacetSearch {
  public element: HTMLElement;
  private combobox: Combobox;
  private hierarchicalFacetSearchController: HierarchicalFacetSearchController;

  constructor(private facet: IDynamicHierarchicalFacet) {
    this.hierarchicalFacetSearchController = new HierarchicalFacetSearchController(facet);

    this.element = this.build();
  }

  private build(): HTMLElement {
    this.combobox = new Combobox({
      label: l('SearchFacetResults', this.facet.options.title),
      searchInterface: this.facet.searchInterface,
      requestValues: terms => this.facetSearch(terms),
      createValuesFromResponse: (response: IFacetSearchResponse) => this.createValuesFromResponse(response),
      onSelectValue: this.onSelectValue,
      placeholderText: l('Search'),
      wrapperClassName: 'coveo-dynamic-facet-search',
      clearOnBlur: true
    });

    return this.combobox.element;
  }

  private async facetSearch(terms: string) {
    return this.hierarchicalFacetSearchController.search(terms);
  }

  private getDisplayValue(value: string) {
    return this.facet.options.valueCaption[value] || value;
  }

  private createValuesFromResponse(response: IFacetSearchResponse): IComboboxValue[] {
    return response.values.map(value => {
      const facetValue = new DynamicHierarchicalFacetSearchValue(
        {
          fullPath: [...value.path, value.rawValue],
          // TODO: remove when https://coveord.atlassian.net/browse/SEARCHAPI-4958 is fixed
          displayValue: this.getDisplayValue(value.displayValue),
          numberOfResults: value.count
        },
        this.facet
      );

      return {
        value: facetValue,
        element: facetValue.renderedElement
      };
    });
  }

  private onSelectValue({ value }: IComboboxValue) {
    (<DynamicHierarchicalFacetSearchValueRenderer>value.renderer).selectAction();
  }
}
