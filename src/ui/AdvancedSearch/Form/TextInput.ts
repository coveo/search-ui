import { $$ } from '../../../utils/Dom';
import { KEYBOARD } from '../../../utils/KeyboardUtils';

/**
 * This class will create a text input meant to be used inside the {@link AdvancedSearch} component.
 *
 * It can be, more specifically, used for external code using the {@link AdvancedSearchEvents.buildingAdvancedSearch}
 */
export class TextInput {

  private element: HTMLElement;
  private lastQueryText: string = '';

  /**
   * Create a new text input.
   * @param onChange will be called every time the text input change it's value. `this` will be the `TextInput` instance.
   * @param name
   */
  constructor(public onChange: () => void = () => { }, public name?: string) {
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
    (<HTMLInputElement>$$(this.element).find('input')).value = value;
  }

  /**
   * Reset the text input
   */
  public reset() {
    (<HTMLInputElement>$$(this.element).find('input')).value = '';
  }

  /**
   * Return the element on which the dropdown is bound.
   * @returns {HTMLElement}
   */
  public build() {
    return this.element;
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

  private getInput(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }


  private triggerChange() {
    if (this.lastQueryText != this.getInput().value) {
      this.onChange();
      this.lastQueryText = this.getInput().value;
    }
  }
}
