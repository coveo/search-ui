import { TextInput, ITextInputOptions } from '../FormWidgets/TextInput';
import { l } from '../../strings/Strings';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { $$ } from '../../utils/Dom';
import { DynamicFacetSearch } from './DynamicFacetSearch';
import { KEYBOARD } from '../../utils/KeyboardUtils';

export class DynamicFacetSearchInput {
  public element: HTMLElement;
  private textInput: TextInput;
  private inputElement: HTMLElement;
  private inputOptions: ITextInputOptions = {
    usePlaceholder: true,
    className: 'coveo-dynamic-facet-search-input',
    triggerOnChangeAsYouType: true,
    ariaLabel: l('SearchFacetResults', this.facet.options.title)
  };

  constructor(private facet: DynamicFacet, private search: DynamicFacetSearch) {
    this.create();
    this.element = this.textInput.getElement();
    this.inputElement = $$(this.element).find('input');
    this.addEventListeners();
    this.addAccessibilityAttributes();
  }

  private create() {
    this.textInput = new TextInput(
      (inputInstance: TextInput) => this.search.onInputChange(inputInstance.getValue()),
      l('Search'),
      this.inputOptions
    );
  }

  private addEventListeners() {
    $$(this.inputElement).on('blur', this.search.onInputBlur.bind(this.search));
    $$(this.inputElement).on('keyup', this.handleKeyboardEvent.bind(this));
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

  private handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.which) {
      case KEYBOARD.ESCAPE:
        this.search.clear();
        break;
      case KEYBOARD.DOWN_ARROW:
        this.search.moveActiveValueDown();
        break;
      case KEYBOARD.UP_ARROW:
        // this.facetSearch.facetSearchElement.moveActiveValueUp();
        break;
    }
  }
}
