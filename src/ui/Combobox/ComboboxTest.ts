import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { Combobox } from '../Combobox/Combobox';
// import { l } from '../../strings/Strings';
// import { FacetSearchController } from '../../controllers/FacetSearchController';
// import { IFacetSearchResponse } from '../../rest/Facet/FacetSearchResponse';
// import { DynamicFacetValue } from '../DynamicFacet/DynamicFacetValues/DynamicFacetValue';
// import { FacetValueState } from '../../rest/Facet/FacetValueState';
// import { DynamicFacetSearchValueRenderer } from './DynamicFacetSearchValueRenderer';
import { IComboboxValue } from '../Combobox/ComboboxValues';
import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { $$ } from '../../utils/Dom';

export class ComboboxTest {
  public element: HTMLElement;
  private combobox: Combobox;

  constructor(private facet: DynamicFacet) {
    this.combobox = new Combobox({
      label: 'Nice label',
      searchInterface: this.facet.searchInterface,
      requestValues: this.getValues.bind(this),
      createValuesFromResponse: this.createValuesFromResponse.bind(this),
      onSelectValue: () => {}
    });

    this.element = this.combobox.element;
  }

  private createValuesFromResponse(response: string[]): IComboboxValue[] {
    return response.map(value => ({
      value,
      element: $$('span', {}, value).el
    }));
  }

  private getValues() {
    return ['this is a test', 'another value', 'a third value', 'keep on testing'];
  }
}
