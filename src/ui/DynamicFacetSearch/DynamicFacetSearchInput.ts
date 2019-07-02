import { TextInput, ITextInputOptions } from '../FormWidgets/TextInput';
import { l } from '../../strings/Strings';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { $$ } from '../../utils/Dom';

export class DynamicFacetSearchInput {
  public element: HTMLElement;
  private textInput: TextInput;
  private inputElement: HTMLElement;

  constructor(private facet: DynamicFacet, private onChange: (value: string) => void, private searchId: string) {
    this.create();
    this.addAccessibilityAttributes();
  }

  private create() {
    const inputOptions: ITextInputOptions = {
      usePlaceholder: true,
      className: 'coveo-dynamic-facet-search-input',
      triggerOnChangeAsYouType: true,
      ariaLabel: l('SearchFacetResults', this.facet.options.title)
    };

    this.textInput = new TextInput((inputInstance: TextInput) => this.onChange(inputInstance.getValue()), l('Search'), inputOptions);
    this.element = this.textInput.getElement();
    this.inputElement = $$(this.element).find('input');
  }

  private addAccessibilityAttributes() {
    const listboxId = `${this.searchId}-listbox`;
    this.element.setAttribute('role', 'combobox');
    this.element.setAttribute('aria-expanded', 'false');
    this.element.setAttribute('aria-owns', listboxId);
    this.element.setAttribute('aria-aria-haspopup', 'listbox');

    this.inputElement.setAttribute('aria-autocomplete', 'list');
    this.inputElement.setAttribute('aria-controls', listboxId);
    this.activeDescendant = '';
  }

  public set activeDescendant(descendantId: string) {
    this.inputElement.setAttribute('aria-activedescendant', descendantId);
  }
}
