import { $$ } from '../../utils/Dom';
import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
import { exportGlobally } from '../../GlobalExports';

/**
 * This class will create a numeric spinner with standard styling
 */
export class NumericSpinner implements IFormWidget, IFormWidgetSettable {

  private element: HTMLElement;
  public name: string;

  public static doExport() {
    exportGlobally({
      'NumericSpinner': NumericSpinner
    });
  }

  /**
   * Create a new numeric spinner.
   *
   * @param onChange will be called every time the numeric spinner change it's value. The numeric spinner instance will be passed to the function.
   * @param min will be the minimum value selectable by the spinner
   * @param max will be the maximum value selectable by the spinner
   */
  constructor(public onChange: (numericSpinner: NumericSpinner) => void = (numericSpinner: NumericSpinner) => {
  }, public min: number = 0, public max?: number) {
    this.buildContent();
    this.bindEvents();
  }

  /**
   * Reset the spinner
   */
  public reset() {
    this.getSpinnerInput().value = '';
    this.onChange(this);
  }

  /**
   * Return the element on which the spinner is bound.
   * @returns {HTMLInputElement}
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Return the current selected value in the spinner.
   * @returns {string}
   */
  public getValue(): string {
    return this.getSpinnerInput().value;
  }

  /**
   * Return the current selected value in the spinner, as an int.
   * @returns {number}
   */
  public getIntValue(): number {
    return this.getSpinnerInput().value ? parseInt(this.getSpinnerInput().value, 10) : this.min;
  }

  /**
   * Return the current selected value in the spinner, as a float.
   * @returns {number}
   */
  public getFloatValue(): number {
    return this.getSpinnerInput().value ? parseFloat(this.getSpinnerInput().value) : this.min;
  }

  /**
   * Set the value in the spinner.
   *
   * @param value
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
   * Return the element on which the spinner is bound.
   */
  public build() {
    return this.element;
  }

  private buildContent() {
    let numericSpinner = $$('div', { className: 'coveo-numeric-spinner' });
    let numberInput = $$('input', { className: 'coveo-number-input', type: 'text' });
    let addOn = $$('span', { className: 'coveo-add-on' });
    addOn.el.innerHTML = `<div class="coveo-spinner-up">
                              <i class="coveo-sprites-arrow-up"></i>
                          </div>
                          <div class="coveo-spinner-down">
                              <i class="coveo-sprites-arrow-down"></i>
                          </div>`;
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
    return (<HTMLInputElement>$$(this.element).find('.coveo-number-input'));
  }
}
