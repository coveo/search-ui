import { TextInput, ITextInputOptions } from '../FormWidgets/TextInput';
import { l } from '../../strings/Strings';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { $$ } from '../../utils/Dom';
import { DynamicFacetSearch } from './DynamicFacetSearch';

export class DynamicFacetSearchInput {
  public element: HTMLElement;
  private textInput: TextInput;
  private inputElement: HTMLElement;
  private inputOptions = {
    usePlaceholder: true,
    className: 'coveo-dynamic-facet-search-input',
    triggerOnChangeAsYouType: true,
    ariaLabel: l('SearchFacetResults', this.facet.options.title)
  };

  constructor(private facet: DynamicFacet, private search: DynamicFacetSearch) {
    this.create();
    this.element = this.textInput.getElement();
    this.inputElement = $$(this.element).find('input');
    this.addAccessibilityAttributes();
  }

  private create() {
    this.textInput = new TextInput(
      (inputInstance: TextInput) => this.search.onInputChange(inputInstance.getValue()),
      l('Search'),
      this.inputOptions
    );
  }

  private addAccessibilityAttributes() {
    const listboxId = `${this.search.id}-listbox`;
    this.element.setAttribute('role', 'combobox');
    this.element.setAttribute('aria-owns', listboxId);
    this.element.setAttribute('aria-aria-haspopup', 'listbox');
    this.toggleExpanded(false);

    this.inputElement.setAttribute('aria-autocomplete', 'list');
    this.inputElement.setAttribute('aria-controls', listboxId);
    this.updateActiveDescendant();
  }

  public toggleExpanded(expanded: boolean) {
    this.element.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  public updateActiveDescendant(descendantId = '') {
    this.inputElement.setAttribute('aria-activedescendant', descendantId);
  }

  public reset() {
    this.textInput.reset();
    this.updateActiveDescendant();
  }
}
