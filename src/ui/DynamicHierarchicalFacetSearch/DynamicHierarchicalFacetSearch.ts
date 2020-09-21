import { IDynamicHierarchicalFacet } from '../DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { HierarchicalFacetSearchController } from '../../controllers/HierarchicalFacetSearchController';
import { Combobox } from '../Combobox/Combobox';
import { l } from '../../strings/Strings';
import { IFacetSearchResponse } from '../../rest/Facet/FacetSearchResponse';
import { IComboboxValue } from '../Combobox/ICombobox';
import { DynamicHierarchicalFacetSearchValue } from './DynamicHierarchicalFacetSearchValue';
import { DynamicHierarchicalFacetSearchValueRenderer } from './DynamicHierarchicalFacetSearchValueRenderer';
import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import 'styling/DynamicHierarchicalFacetSearch/_DynamicHierarchicalFacetSearch';
import { $$ } from '../../utils/Dom';

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
      ariaLive: this.facet.searchInterface.ariaLive,
      requestValues: terms => this.hierarchicalFacetSearchController.search(terms),
      createValuesFromResponse: (response: IFacetSearchResponse) => this.createValuesFromResponse(response),
      onSelectValue: this.onSelectValue,
      placeholderText: l('Search'),
      wrapperClassName: 'coveo-dynamic-facet-search',
      clearOnBlur: true,
      scrollable: {
        requestMoreValues: () => this.hierarchicalFacetSearchController.fetchMoreResults(),
        areMoreValuesAvailable: () => this.hierarchicalFacetSearchController.moreValuesAvailable,
        maxDropdownHeight: () => $$(this.facet.element).find('.coveo-dynamic-hierarchical-facet-values').clientHeight
      }
    });

    return this.combobox.element;
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
      this.highlightCurrentQueryInSearchResults(facetValue.renderedElement);
      return {
        value: facetValue,
        element: facetValue.renderedElement
      };
    });
  }

  private onSelectValue({ value }: IComboboxValue) {
    (<DynamicHierarchicalFacetSearchValueRenderer>value.renderer).selectAction();
  }

  private highlightCurrentQueryInSearchResults(searchResult: HTMLElement) {
    let regex = new RegExp('(' + this.combobox.element.querySelector('input').value + ')', 'ig');
    let result = $$(searchResult).find('.coveo-dynamic-hierarchical-facet-search-value-label');
    result.innerHTML = $$(result)
      .text()
      .replace(regex, '<span class="coveo-highlight">$1</span>');
  }
}
