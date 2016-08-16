import {$$} from '../../../utils/Dom';

export class NumericSpinner {

  private element: HTMLElement;

  constructor(public min: number = 0, public max?: number) {
    this.build();
    this.bindEvents();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getIntValue(): number {
    return this.getSpinnerInput().value ? parseInt(this.getSpinnerInput().value, 10) : this.min;
  }

  public getFloatValue(): number {
    return this.getSpinnerInput().value ? parseFloat(this.getSpinnerInput().value) : this.min;
  }

  public setValue(value: number) {
    if (this.max && value > this.max) {
      value = this.max;
    }
    if (value < this.min) {
      value = this.min;
    }
    this.getSpinnerInput().value = value.toString();
  }

  private build() {
    let numericSpinner = $$('div', { className: 'coveo-numeric-spinner' });
    let numberInput = $$('input', { className: 'coveo-advanced-search-number-input', type: 'text' });
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
      this.setValue(this.getIntValue() + 1)
    })

    let down = $$(this.element).find('.coveo-spinner-down');
    $$(down).on('click', () => {
      this.setValue(this.getIntValue() - 1);
    })
  }

  private getSpinnerInput(): HTMLInputElement {
    return (<HTMLInputElement>$$(this.element).find('.coveo-advanced-search-number-input'));
  }

}
