import { $$ } from '../../utils/Dom';
import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
import { exportGlobally } from '../../GlobalExports';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

/**
 * A numeric spinner widget with standard styling.
 */
export class NumericSpinner implements IFormWidget, IFormWidgetSettable {
  private element: HTMLElement;
  public name: string;

  public static doExport() {
    exportGlobally({
      NumericSpinner: NumericSpinner
    });
  }

  /**
   * Creates a new `NumericSpinner`.
   * @param onChange The function to call when the numeric spinner value changes. This function takes the current
   * `NumericSpinner` instance as an argument.
   * @param min The minimum possible value of the numeric spinner.
   * @param max The maximum possible value of the numeric spinner.
   */
  constructor(
    public onChange: (numericSpinner: NumericSpinner) => void = (numericSpinner: NumericSpinner) => {},
    public min: number = 0,
    public max?: number
  ) {
    this.buildContent();
    this.bindEvents();
  }

  /**
   * Resets the numeric spinner.
   */
  public reset() {
    this.getSpinnerInput().value = '';
    this.onChange(this);
  }

  /**
   * Gets the element on which the numeric spinner is bound.
   * @returns {HTMLInputElement} The numeric spinner element.
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Gets the numeric spinner currently selected value (as a string).
   * @returns {string} The numeric spinner value.
   */
  public getValue(): string {
    return this.getSpinnerInput().value;
  }

  /**
   * Gets the numeric spinner currently selected value (as an integer).
   * @returns {number} The numeric spinner value.
   */
  public getIntValue(): number {
    return this.getSpinnerInput().value ? parseInt(this.getSpinnerInput().value, 10) : this.min;
  }

  /**
   * Gets the numeric spinner currently selected value (as a float).
   * @returns {number} The numeric spinner value.
   */
  public getFloatValue(): number {
    return this.getSpinnerInput().value ? parseFloat(this.getSpinnerInput().value) : this.min;
  }

  /**
   * Sets the numeric spinner value.
   *
   * @param value The value to set the numeric spinner to. If `value` is greater than [`max`]{@link NumericSpinner.max},
   * this method sets the numeric spinner to its maximum value instead. Likewise, if value is lesser than
   * [`min`]{@link NumericSpinner.min}, the method sets the numeric spinner to its minimum value.
   */
  public setValue(value: number) {
    if (this.max && value > this.max) {
      value = this.max;
    }
    if (value < this.min) {
      value = this.min;
    }
    this.getSpinnerInput().value = value.toString();
    this.onChange(this);
  }

  /**
   * Gets the element on which the numeric spinner is bound.
   * @returns {HTMLInputElement} The numeric spinner element.
   */
  public build() {
    return this.element;
  }

  private buildContent() {
    let numericSpinner = $$('div', { className: 'coveo-numeric-spinner' });
    let numberInput = $$('input', { className: 'coveo-number-input', type: 'text' });
    let addOn = $$('span', { className: 'coveo-add-on' });
    const arrowUp = $$('div', { className: 'coveo-spinner-up' }, SVGIcons.icons.arrowUp);
    SVGDom.addClassToSVGInContainer(arrowUp.el, 'coveo-spinner-up-svg');
    const arrowDown = $$('div', { className: 'coveo-spinner-down' }, SVGIcons.icons.arrowDown);
    SVGDom.addClassToSVGInContainer(arrowDown.el, 'coveo-spinner-down-svg');
    addOn.append(arrowUp.el);
    addOn.append(arrowDown.el);
    numericSpinner.append(numberInput.el);
    numericSpinner.append(addOn.el);
    this.element = numericSpinner.el;
  }

  private bindEvents() {
    let up = $$(this.element).find('.coveo-spinner-up');
    $$(up).on('click', () => {
      this.setValue(this.getFloatValue() + 1);
    });

    let down = $$(this.element).find('.coveo-spinner-down');
    $$(down).on('click', () => {
      this.setValue(this.getFloatValue() - 1);
    });

    let numberInput = <HTMLInputElement>$$(this.element).find('input');
    $$(numberInput).on('input', () => {
      if (numberInput.value.match(/[0-9]*/)) {
        this.onChange(this);
      }
    });
  }

  private getSpinnerInput(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('.coveo-number-input');
  }
}
