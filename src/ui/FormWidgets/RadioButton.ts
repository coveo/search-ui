import { $$ } from '../../utils/Dom';
import { IFormWidgetsWithLabel, IFormWidgetsSelectable } from './FormWidgets';
import 'styling/vapor/_Radio';

/**
 * This class will create a radio button meant to be used inside the {@link AdvancedSearch} component.
 *
 * It can be, more specifically, used for external code using the {@link AdvancedSearchEvents.buildingAdvancedSearch}
 */
export class RadioButton implements IFormWidgetsWithLabel, IFormWidgetsSelectable {

  protected element: HTMLElement;

  /**
   * Create a new Radio button.
   * @param onChange will be called every time the radio button change it's value. `this` will be the `RadioButton` instance.
   * @param label The label for the choice.
   */
  constructor(public onChange: (radioButton: RadioButton) => void = (radioButton: RadioButton) => {
  }, public label: string, public name) {
    this.buildContent();
  }

  /**
   * Reset the radio button
   */
  public reset() {
    this.getRadio().checked = false;
  }

  /**
   * Select the radio button;
   */
  public select() {
    this.getRadio().checked = true;
  }

  /**
   * Return the element on which the dropdown is bound.
   * @returns {HTMLElement}
   */
  public build(): HTMLElement {
    return this.element;
  }

  /**
   * Return the element on which the dropdown is bound.
   * @returns {HTMLElement}
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  public getValue(): string {
    return this.label;
  }

  /**
   * Return true if the radio button is selected.
   * @returns {boolean}
   */
  public isSelected(): boolean {
    return this.getRadio().checked;
  }

  /**
   * Get the input element (the radio button itself).
   * @returns {HTMLInputElement}
   */
  public getRadio(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }

  /**
   * Get the label element.
   * @returns {HTMLLabelElement}
   */
  public getLabel(): HTMLLabelElement {
    return <HTMLLabelElement>$$(this.element).find('label');
  }

  private buildContent() {
    const radioOption = $$('div', {className: 'coveo-radio'});
    const radioInput = $$('input', {type: 'radio', name: this.name, id: this.label});
    const labelInput = $$('label', {className: 'coveo-radio-input-label', 'for': this.label});
    labelInput.text(this.label);
    radioInput.on('change', () => {
      this.onChange(this);
    });

    radioOption.append(radioInput.el);
    radioOption.append(labelInput.el);
    this.element = radioOption.el;
  }
}
