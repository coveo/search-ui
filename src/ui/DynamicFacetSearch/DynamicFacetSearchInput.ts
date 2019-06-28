import 'styling/DynamicFacetSearch/_DynamicFacetSearch';
import { TextInput, ITextInputOptions } from '../FormWidgets/TextInput';
import { l } from '../../strings/Strings';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';

export class DynamicFacetSearchInput {
  public element: HTMLElement;
  private input: TextInput;

  constructor(facet: DynamicFacet, private onChange: (value: string) => void) {
    const inputOptions: ITextInputOptions = {
      usePlaceholder: true,
      className: 'coveo-dynamic-facet-search-input',
      triggerOnChangeAsYouType: true,
      ariaLabel: l('SearchFacetResults', facet.options.title)
    };

    this.input = new TextInput((inputInstance: TextInput) => this.onChange(inputInstance.getValue()), l('Search'), inputOptions);
    this.element = this.input.getElement();
  }
}
