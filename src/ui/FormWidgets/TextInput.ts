import { $$ } from '../../utils/Dom';
import { KEYBOARD } from '../../utils/KeyboardUtils';
import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
import { exportGlobally } from '../../GlobalExports';

/**
 * This class will create a text input with standard styling.
 */
export class TextInput implements IFormWidget, IFormWidgetSettable {

  private element: HTMLElement;
  private lastQueryText: string = '';

  static doExport() {
    exportGlobally({
      'TextInput': TextInput
    });
  }

  /**
   * Create a new text input.
   * @param onChange will be called every time the text input change it's value, witht the `TextInput` instance as an argument.
   * @param name
   */
  constructor(public onChange: (textInput: TextInput) => void = (textInput: TextInput) => {
  }, public name?: string) {
    this.buildContent();
  }

  /**
   * Return the element on which the dropdown is bound.
   * @returns {HTMLElement}
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Get the currently entered value in the text input.
   * @returns {string}
   */
  public getValue(): string {
    return (<HTMLInputElement>$$(this.element).find('input')).value;
  }

  /**
   * Set the value in the text input.
   * @param value
   */
  public setValue(value: string) {
    const currentValue = this.getValue();
    (<HTMLInputElement>$$(this.element).find('input')).value = value;
    if (currentValue != value) {
      this.onChange(this);
    }
  }

  /**
   * Reset the text input
   */
  public reset() {
    const currentValue = this.getValue();
    (<HTMLInputElement>$$(this.element).find('input')).value = '';
    if (currentValue != '') {
      this.onChange(this);
    }

  }

  /**
   * Return the element on which the dropdown is bound.
   * @returns {HTMLElement}
   */
  public build() {
    return this.element;
  }

  /**
   * Return the input element
   * @returns {HTMLElement}
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
