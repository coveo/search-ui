import {$$} from '../../utils/Dom';

export class NumericSpinner {

  private element: HTMLElement;

  constructor(private min: number = 0, private max?: number){
    this.build();
    this.bindEvents();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getValue(): number {
    return this.getSpinnerInput().value ? parseInt(this.getSpinnerInput().value): this.min;
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

  private build(){
    let numericSpinner = $$('div', { className: 'coveo-numeric-spinner'});
    let numberInput = $$('input', { className: 'coveo-advanced-search-number-input', type: 'text'});
    let addOn = $$('span', {className: 'coveo-add-on'});
    addOn.el.innerHTML = `<div id="SpinnerUp">
                              <i class="coveo-sprites-arrow-up"></i>
                          </div>
                          <div id="SpinnerDown">
                              <i class="coveo-sprites-arrow-down"></i>
                          </div>`;
    numericSpinner.append(numberInput.el);
    numericSpinner.append(addOn.el);
    this.element = numericSpinner.el;
  }

  private bindEvents() {
    let up = $$(this.element).find('#SpinnerUp');
    $$(up).on('click', ()=>{
      this.setValue(this.getValue() + 1)
    })

    let down = $$(this.element).find('#SpinnerDown');
    $$(down).on('click', ()=>{
      this.setValue(this.getValue() - 1);
    })
  }

  private getSpinnerInput(): HTMLInputElement {
    return (<HTMLInputElement>$$(this.element).find('.coveo-advanced-search-number-input'));
  }

}
