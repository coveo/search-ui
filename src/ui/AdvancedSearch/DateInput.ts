import {ComponentOptions} from '../Base/ComponentOptions';
import {IAdvancedSearchInput} from './AdvancedSearchInput';
import {QueryBuilder} from '../Base/QueryBuilder';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';

export class DateInput implements IAdvancedSearchInput {

  protected element: HTMLElement

  constructor(public inputName: string) {
  }

  public build(): HTMLElement {
    let date = $$('div', { className: 'coveo-advanced-search-date-input-section' });
    let radioOption = $$('div', { className: 'coveo-radio' })
    let radio = $$('input', { type: 'radio', name: 'coveo-advanced-search-date', id: this.inputName })
    let label = $$('label', { className: 'coveo-advanced-search-label', for: this.inputName })
    label.text(l(this.inputName + 'Label'));

    radio.on('change', () => {
      this.desactivateAllInputs();
      this.activateSelectedInput();
    })

    radioOption.append(radio.el);
    radioOption.append(label.el);
    date.append(radioOption.el);
    this.element = date.el;
    return this.element;
  }

  public getValue(): string {
    return '';
  }

  public isSelected(): boolean {
    return this.getRadio().checked;
  }

  public updateQuery(queryBuilder: QueryBuilder) {
    let value = this.getValue();
    if (value) {
      queryBuilder.expression.add(this.getValue());
    }
  }

  protected getRadio(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }

  private desactivateAllInputs() {
    let elements = $$(this.element.parentElement).findAll('fieldset');
    _.each(elements, (element) => {
      (<HTMLInputElement>element).disabled = true;
    })
  }

  private activateSelectedInput() {
    let elements = $$(this.element).findAll('fieldset');
    _.each(elements, (element) => {
      (<HTMLInputElement>element).disabled = false;
    });
  }

  protected dateToString(date: Date): string {
    return date.getFullYear() + '/' + this.padNumber((date.getMonth() + 1).toString()) + '/' + this.padNumber(date.getDate().toString());
  }

  private padNumber(num: string): string {
    while (num.length < 2) {
      num = '0' + num;
    }
    return num;
  }

}

export class AnytimeDateInput extends DateInput {
  constructor() {
    super('AdvancedSearchAnytime');
  }

  public build(): HTMLElement {
    super.build();
    this.getRadio().checked = true;
    return this.element;
  }

}

export class InTheLastDateInput extends DateInput {
  constructor() {
    super('AdvancedSearchInTheLast');
  }

  public build(): HTMLElement {
    super.build();
    let input = $$('fieldset', {className: 'coveo-advanced-search-date-input'});
    (<HTMLFieldSetElement>input.el).disabled = true;
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
    let select = $$('select', { className: 'coveo-advanced-search-select' });
    let daysOption = $$('option', { value: 'days', selected: 'selected' });
    daysOption.text(l('AdvancedSearchDays'))
    let monthOption = $$('option', { value: 'months' })
    monthOption.text(l('AdvancedSearchMonths'))
    select.append(daysOption.el);
    select.append(monthOption.el);
    input.append(numericSpinner.el);
    input.append(select.el);
    this.element.appendChild(input.el);

    this.bindSpinner();
    return this.element;
  }

  public getValue(): string {
    let currentDate = new Date();
    let time = parseInt((<HTMLInputElement>$$(this.element).find('.coveo-advanced-search-number-input')).value)
    let size = (<HTMLSelectElement>$$(this.element).find('.coveo-advanced-search-select')).value

    let date = new Date();
    if (size == 'months') {
      date.setMonth(currentDate.getMonth() - time);
    } else {
      date.setDate(currentDate.getDate() - time);
    }

    return this.isSelected() ? '@date>=' + this.dateToString(date) : '';
  }

  private bindSpinner() {
    let input = this.getSpinnerInput();

    let up = $$(this.element).find('#SpinnerUp');
    $$(up).on('click', ()=>{
      input.value = (this.getSpinnerInputValue() + 1).toString();
    })

    let down = $$(this.element).find('#SpinnerDown');
    $$(down).on('click', ()=>{
      input.value = (this.getSpinnerInputValue() - 1).toString();
    })
  }

  private getSpinnerInput(): HTMLInputElement {
    return (<HTMLInputElement>$$(this.element).find('.coveo-advanced-search-number-input'));
  }

  private getSpinnerInputValue(): number {
    let input = this.getSpinnerInput();
    let value = parseInt(input.value);
    return value ? value : 0;
  }

}

export class BetweenDateInput extends DateInput {

  private FIRST_DATE_CLASS: string = 'coveo-date-picker-first';
  private SECOND_DATE_CLASS: string = 'coveo-date-picker-second';

  constructor() {
    super('AdvancedSearchBetween');
  }

  public build(): HTMLElement {
    super.build();
    let input = $$('fieldset', {className: 'coveo-advanced-search-date-input'});
    (<HTMLFieldSetElement>input.el).disabled = true;
    input.append(this.buildDaySelect(this.FIRST_DATE_CLASS));
    input.append(this.buildMonthSelect(this.FIRST_DATE_CLASS));
    input.append(this.buildYearSelect(this.FIRST_DATE_CLASS));

    let and = $$('div', { className: 'coveo-advanced-search-and' });
    and.text(l('And').toLowerCase());
    input.append(and.el);

    input.append(this.buildDaySelect(this.SECOND_DATE_CLASS));
    input.append(this.buildMonthSelect(this.SECOND_DATE_CLASS));
    input.append(this.buildYearSelect(this.SECOND_DATE_CLASS));
    this.element.appendChild(input.el);
    return this.element;
  }

  private buildDaySelect(className: string): HTMLElement {
    let select = $$('select', { className: 'coveo-advanced-search-select coveo-advanced-search-select-day ' + className });
    for (let i = 1; i <= 31; i++) {
      let option = $$('option', { value: i });
      option.text(i.toString());
      select.append(option.el);
    }
    (<HTMLInputElement>select.el).disabled = true;
    return select.el;
  }

  private buildMonthSelect(className: string): HTMLElement {
    let select = $$('select', { className: 'coveo-advanced-search-select coveo-advanced-search-select-month ' + className });
    for (let i = 1; i <= 12; i++) {
      let option = $$('option', { value: i });
      option.text(i.toString());
      select.append(option.el);
    }
    (<HTMLInputElement>select.el).disabled = true;
    return select.el;
  }

  private buildYearSelect(className: string): HTMLElement {
    let select = $$('select', { className: 'coveo-advanced-search-select coveo-advanced-search-select-year ' + className });
    let currentYear = new Date().getFullYear();
    for (let i = 1990; i <= currentYear; i++) {
      let option = $$('option', { value: i });
      option.text(i.toString());
      select.append(option.el);
    }
    (<HTMLInputElement>select.el).disabled = true;
    return select.el;
  }

  public getValue(): string {
    let firstDate = this.getDate(this.FIRST_DATE_CLASS);
    let secondDate = this.getDate(this.SECOND_DATE_CLASS);
    return this.isSelected() ? '(@date>=' + this.dateToString(firstDate) + ')(@date<=' + this.dateToString(secondDate) + ')' : '';
  }

  private getDate(className: string): Date {
    let day = (<HTMLSelectElement>$$(this.element).find('.coveo-advanced-search-select-day.' + className)).value
    let month = (<HTMLSelectElement>$$(this.element).find('.coveo-advanced-search-select-month.' + className)).value
    let year = (<HTMLSelectElement>$$(this.element).find('.coveo-advanced-search-select-year.' + className)).value
    let date = new Date();
    date.setDate(parseInt(day));
    date.setMonth(parseInt(month) - 1);
    date.setFullYear(parseInt(year));
    return date;
  }
}
