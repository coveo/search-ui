import { $$ } from '../../utils/Dom';
import { IFormWidgetWithLabel, IFormWidgetSelectable } from './FormWidgets';
import 'styling/vapor/_Radio';
import { exportGlobally } from '../../GlobalExports';

/**
 * A radio button widget with standard styling.
 */
export class RadioButton implements IFormWidgetWithLabel, IFormWidgetSelectable {
  protected element: HTMLElement;

  static doExport() {
    exportGlobally({
      RadioButton: RadioButton
    });
  }

  /**
   * Creates a new `RadioButton`.
   * @param onChange The function to call when the radio button value changes. This function takes the current
   * `RadioButton` instance as an argument.
   * @param label The label to display next to the radio button.
   * @param name The value to set the `input` HTMLElement `name` attribute to.
   */
  constructor(public onChange: (radioButton: RadioButton) => void = (radioButton: RadioButton) => {}, public label: string, public name) {
    this.buildContent();
  }

  /**
   * Resets the radio button.
   */
  public reset() {
    const currentlySelected = this.isSelected();
    this.getRadio().checked = false;
    if (currentlySelected) {
      this.onChange(this);
    }
  }

  /**
   * Select the radio button
   * @param triggerChange will trigger change event if specified and the radio button is not already selected
   */
  public select(triggerChange = true) {
    const currentlySelected = this.isSelected();
    this.getRadio().checked = true;
    if (!currentlySelected && triggerChange) {
      this.onChange(this);
    }
  }

  /**
   * Gets the element on which the radio button is bound.
   * @returns {HTMLElement} The radio button element.
   */
  public build(): HTMLElement {
    return this.element;
  }

  /**
   * Gets the element on which the radio button is bound.
   * @returns {HTMLElement} The radio button element.
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  public getValue(): string {
    return this.label;
  }

  /**
   * Indicates whether the radio button is selected.
   * @returns {boolean} `true` if the radio button is selected, `false` otherwise.
   */
  public isSelected(): boolean {
    return this.getRadio().checked;
  }

  /**
   * Gets the `input` element (the radio button itself).
   * @returns {HTMLInputElement} The `input` element.
   */
  public getRadio(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }

  /**
   * Gets the radio button [`label`]{@link RadioButton.label} element.
   * @returns {HTMLLabelElement} The `label` element.
   */
  public getLabel(): HTMLLabelElement {
    return <HTMLLabelElement>$$(this.element).find('label');
  }

  private buildContent() {
    const radioOption = $$('div', { className: 'coveo-radio' });
    const radioInput = $$('input', { type: 'radio', name: this.name, id: this.label });
    const labelInput = $$('label', { className: 'coveo-radio-input-label', for: this.label });
    labelInput.text(this.label);
    radioInput.on('change', () => {
      this.onChange(this);
    });

    radioOption.append(radioInput.el);
    radioOption.append(labelInput.el);
    this.element = radioOption.el;
  }
}
