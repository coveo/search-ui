import { TextInput, ITextInputOptions } from '../FormWidgets/TextInput';
import { $$ } from '../../utils/Dom';
import { KEYBOARD } from '../../utils/KeyboardUtils';
import { Utils } from '../../utils/Utils';
import { IComboboxAccessibilityAttributes, ICombobox } from './ICombobox';

export class ComboboxInput {
  public element: HTMLElement;
  private textInput: TextInput;
  private inputElement: HTMLElement;
  private inputOptions: ITextInputOptions = {
    usePlaceholder: true,
    className: 'coveo-combobox-input',
    triggerOnChangeAsYouType: true,
    isRequired: false,
    icon: 'search'
  };

  constructor(private combobox: ICombobox) {
    this.create();
    this.element = this.textInput.getElement();
    this.inputElement = $$(this.element).find('input');
    this.addEventListeners();
    this.addAccessibilityAttributes();
  }

  private create() {
    this.textInput = new TextInput(
      (inputInstance: TextInput) => this.combobox.onInputChange(inputInstance.getValue()),
      this.combobox.options.placeholderText,
      this.inputOptions
    );
  }

  private addEventListeners() {
    if (!this.combobox.options.clearOnBlur) {
      $$(this.inputElement).on('focus', () => this.combobox.onInputChange(this.textInput.getValue()));
    }
    $$(this.combobox.element).on('focusout', (e: FocusEvent) => this.handleFocusOut(e));
    $$(this.combobox.element).on('keydown', (e: KeyboardEvent) => this.handleKeyboardDirection(e));
    $$(this.combobox.element).on('keyup', (e: KeyboardEvent) => this.handleKeyboardEnterEscape(e));
  }

  private addAccessibilityAttributes() {
    const listboxId = `${this.combobox.id}-listbox`;
    this.inputElement.setAttribute('role', 'combobox');
    this.inputElement.setAttribute('aria-owns', listboxId);
    this.inputElement.setAttribute('aria-haspopup', 'listbox');
    this.inputElement.setAttribute('aria-autocomplete', 'list');
    this.inputElement.setAttribute('id', `${this.combobox.id}-input`);
    this.inputElement.setAttribute('aria-label', this.combobox.options.label);

    this.updateAccessibilityAttributes({
      activeDescendant: '',
      expanded: false
    });
  }

  public updateAccessibilityAttributes(attributes: IComboboxAccessibilityAttributes) {
    this.inputElement.setAttribute('aria-expanded', attributes.expanded ? 'true' : 'false');
    Utils.isEmptyString(attributes.activeDescendant)
      ? this.inputElement.removeAttribute('aria-activedescendant')
      : this.inputElement.setAttribute('aria-activedescendant', attributes.activeDescendant);
  }

  public clearInput() {
    this.textInput.reset();
  }

  private handleFocusOut(event: FocusEvent) {
    const newTarget = event.relatedTarget as HTMLElement;
    const isFocusedOnInput = this.combobox.element.contains(newTarget);
    if (isFocusedOnInput) {
      return;
    }
    this.combobox.onInputBlur();
  }

  private handleKeyboardDirection(event: KeyboardEvent) {
    switch (event.which) {
      case KEYBOARD.DOWN_ARROW:
        event.preventDefault();
        this.combobox.values.moveActiveValueDown();
        break;
      case KEYBOARD.UP_ARROW:
        event.preventDefault();
        this.combobox.values.moveActiveValueUp();
        break;
      case KEYBOARD.HOME:
        event.preventDefault();
        this.combobox.values.moveActiveValueToTop();
        break;
      case KEYBOARD.END:
        event.preventDefault();
        this.combobox.values.moveActiveValueToBottom();
        break;
    }
  }

  private handleKeyboardEnterEscape(event: KeyboardEvent) {
    switch (event.which) {
      case KEYBOARD.ENTER:
        this.combobox.values.selectActiveValue();
        break;
      case KEYBOARD.ESCAPE:
        if (Utils.isNonEmptyString(this.textInput.getValue())) {
          event.stopPropagation();
        }
        this.combobox.clearAll();
        break;
    }
  }
}
