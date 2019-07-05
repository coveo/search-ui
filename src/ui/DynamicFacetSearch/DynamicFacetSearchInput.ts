import { TextInput, ITextInputOptions } from '../FormWidgets/TextInput';
import { l } from '../../strings/Strings';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';
import { $$ } from '../../utils/Dom';
import { DynamicFacetSearch } from './DynamicFacetSearch';
import { KEYBOARD } from '../../utils/KeyboardUtils';

export interface IAccessibilityAttributes {
  activeDescendant: string;
  expanded: boolean;
}

export class DynamicFacetSearchInput {
  public element: HTMLElement;
  private textInput: TextInput;
  private inputElement: HTMLElement;
  private inputOptions: ITextInputOptions = {
    usePlaceholder: true,
    className: 'coveo-dynamic-facet-search-input',
    triggerOnChangeAsYouType: true
  };

  constructor(private search: DynamicFacetSearch) {
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

    this.inputElement.setAttribute('id', `${this.search.id}-input`);
    this.inputElement.setAttribute('aria-autocomplete', 'list');
    this.inputElement.setAttribute('aria-controls', listboxId);

    this.updateAccessibilityAttributes({
      activeDescendant: '',
      expanded: false
    });
  }

  public updateAccessibilityAttributes(attributes: IAccessibilityAttributes) {
    this.element.setAttribute('aria-expanded', attributes.expanded ? 'true' : 'false');
    this.inputElement.setAttribute('aria-activedescendant', attributes.activeDescendant);
  }

  public clearInput() {
    this.textInput.reset();
  }

  private handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.which) {
      case KEYBOARD.ESCAPE:
        this.search.clearAll();
        break;
      case KEYBOARD.DOWN_ARROW:
        this.search.values.moveActiveValueDown();
        break;
      case KEYBOARD.UP_ARROW:
        this.search.values.moveActiveValueUp();
        break;
    }
  }
}
