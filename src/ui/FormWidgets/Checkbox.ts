import { IFormWidgetWithLabel, IFormWidgetSelectable } from './FormWidgets';
import { $$ } from '../../utils/Dom';
import 'styling/vapor/_Checkbox';

export class Checkbox implements IFormWidgetWithLabel, IFormWidgetSelectable {
  protected element: HTMLElement;
  protected checkbox: HTMLInputElement;

  /**
   * Create a new checkbox, with standard styling.
   * @param onChange Called when the checkbox value changes, with the checkbox instance as a parameter
   * @param label
   */
  constructor(public onChange: (checkbox: Checkbox) => void = (checkBox: Checkbox) => {
  }, public label: string) {
    this.buildContent();
  }

  /**
   * Return the HTMLElement bound to the checkbox
   * @returns {HTMLElement}
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Return the HTMLElement bound to the checkbox
   * @returns {HTMLElement}
   */
  public build(): HTMLElement {
    return this.element;
  }

  /**
   * Return the label value of the checkbox
   * @returns {string}
   */
  public getValue() {
    return this.label;
  }

  /**
   * Unselect the checkbox
   */
  public reset() {
    this.checkbox.checked = false;
    $$(this.checkbox).trigger('change');
  }

  /**
   * Select the checkbox
   */
  public select() {
    this.checkbox.checked = true;
    $$(this.checkbox).trigger('change');
  }

  /**
   * Return true if the checkbox is selected
   * @returns {boolean}
   */
  public isSelected() {
    return this.checkbox.checked;
  }

  /**
   * Return the HTMLElement bound to the label
   * @returns {HTMLElement}
   */
  public getLabel() {
    return this.element;
  }

  private buildContent() {
    const label = $$('label', {
      className: 'coveo-checkbox-label'
    });

    this.checkbox = <HTMLInputElement>$$('input', {
      type: 'checkbox',
      className: 'coveo-checkbox',
      value: this.label
    }).el;
    const button = $$('button', { type: 'button', className: 'coveo-checkbox-button' });
    const labelSpan = $$('span', { className: 'coveo-checkbox-span-label' }, this.label);

    label.append(this.checkbox);
    label.append(button.el);
    label.append(labelSpan.el);

    button.on('click', () => {
      this.checkbox.checked = !this.isSelected();
      $$(this.checkbox).trigger('change');
    });

    $$(this.checkbox).on('change', () => {
      this.onChange(this);
    });
    this.element = label.el;
  }
}
