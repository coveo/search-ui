import { $$ } from '../../utils/Dom';
import { KEYBOARD } from '../../utils/KeyboardUtils';
import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
import { exportGlobally } from '../../GlobalExports';

/**
 * A text input widget with standard styling.
 */
export class TextInput implements IFormWidget, IFormWidgetSettable {
  private element: HTMLElement;
  private lastQueryText: string = '';

  static doExport() {
    exportGlobally({
      TextInput: TextInput
    });
  }

  /**
   * Creates a new `TextInput`.
   * @param onChange The function to call when the value entered in the text input changes. This function takes the
   * current `TextInput` instance as an argument.
   * @param name The text to display in the text input label.
   */
  constructor(public onChange: (textInput: TextInput) => void = (textInput: TextInput) => {}, public name?: string) {
    this.buildContent();
  }

  /**
   * Gets the element on which the text input is bound.
   * @returns {HTMLElement} The text input element.
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Gets the value currently entered in the text input.
   * @returns {string} The text input current value.
   */
  public getValue(): string {
    return (<HTMLInputElement>$$(this.element).find('input')).value;
  }

  /**
   * Sets the value in the text input.
   * @param value The value to set the text input to.
   */
  public setValue(value: string) {
    const currentValue = this.getValue();
    (<HTMLInputElement>$$(this.element).find('input')).value = value;
    if (currentValue != value) {
      this.onChange(this);
    }
  }

  /**
   * Resets the text input.
   */
  public reset() {
    const currentValue = this.getValue();
    (<HTMLInputElement>$$(this.element).find('input')).value = '';
    if (currentValue != '') {
      this.onChange(this);
    }
  }

  /**
   * Gets the element on which the text input is bound.
   * @returns {HTMLElement} The text input element.
   */
  public build() {
    return this.element;
  }

  /**
   * Gets the `input` element (the text input itself).
   * @returns {HTMLElement} The `input` element.
   */
  public getInput(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }

  private buildContent() {
    let container = $$('div', { className: 'coveo-input' });
    let input = $$('input', { type: 'text' });
    input.on(['keydown', 'blur'], (e: Event) => {
      if (e.type == 'blur' || (<KeyboardEvent>e).keyCode == KEYBOARD.ENTER) {
        this.triggerChange();
      }
    });
    (<HTMLInputElement>input.el).required = true;
    container.append(input.el);
    if (this.name) {
      let label = $$('label');
      label.text(this.name);
      container.append(label.el);
    }
    this.element = container.el;
  }

  private triggerChange() {
    if (this.lastQueryText != this.getInput().value) {
      this.onChange(this);
      this.lastQueryText = this.getInput().value;
    }
  }
}
