import {ComponentOptions} from '../Base/ComponentOptions';
import {IAdvancedSearchInput} from './AdvancedSearchInput';
import {QueryBuilder} from '../Base/QueryBuilder';
import {l} from '../../strings/Strings';
import {Dropdown} from './Dropdown';
import {NumericSpinner} from './NumericSpinner';
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
      queryBuilder.advancedExpression.add(this.getValue());
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

  private dropDown: Dropdown;
  private spinner: NumericSpinner;

  constructor() {
    super('AdvancedSearchInTheLast');
  }

  public build(): HTMLElement {
    super.build();
    let input = $$('fieldset', {className: 'coveo-advanced-search-date-input'});
    (<HTMLFieldSetElement>input.el).disabled = true;
    
    this.spinner = new NumericSpinner();
    input.append(this.spinner.getElement());
    
    this.dropDown = new Dropdown(['days', 'months'], 'coveo-advanced-search-in-the-last-select')
    input.append(this.dropDown.getElement());

    this.element.appendChild(input.el);
    return this.element;
  }

  public getValue(): string {
    let currentDate = new Date();
    let time = this.spinner.getValue();
    let size = this.dropDown.getValue().toLowerCase();

    let date = new Date();
    if (size == 'months') {
      date.setMonth(currentDate.getMonth() - time);
    } else {
      date.setDate(currentDate.getDate() - time);
    }

    return this.isSelected() ? '@date>=' + this.dateToString(date) : '';
  }

}

export class BetweenDateInput extends DateInput {

  private firstDay: Dropdown;
  private firstMonth: Dropdown;
  private firstYear: Dropdown;

  private secondDay: Dropdown;
  private secondMonth: Dropdown;
  private secondYear: Dropdown;

  constructor() {
    super('AdvancedSearchBetween');
  }

  public build(): HTMLElement {
    super.build();
    let input = $$('fieldset', {className: 'coveo-advanced-search-date-input'});
    (<HTMLFieldSetElement>input.el).disabled = true;
    this.firstDay = new Dropdown(this.createIntegerList(31), 'coveo-advanced-search-select-day')
    this.firstMonth = new Dropdown(this.createIntegerList(12), 'coveo-advanced-search-select-month')
    this.firstYear = new Dropdown(this.createYearList(), 'coveo-advanced-search-select-year')
    input.append(this.firstDay.getElement());
    input.append(this.firstMonth.getElement());
    input.append(this.firstYear.getElement());

    let and = $$('div', { className: 'coveo-advanced-search-and' });
    and.text(l('And').toLowerCase());
    input.append(and.el);

    this.secondDay = new Dropdown(this.createIntegerList(31), 'coveo-advanced-search-select-day')
    this.secondMonth = new Dropdown(this.createIntegerList(12), 'coveo-advanced-search-select-month')
    this.secondYear = new Dropdown(this.createYearList(), 'coveo-advanced-search-select-year')
    input.append(this.secondDay.getElement());
    input.append(this.secondMonth.getElement());
    input.append(this.secondYear.getElement());
    this.element.appendChild(input.el);
    return this.element;
  }

  private createIntegerList(end: number, start?: number): string[] {
    let options: string[] = [];
    for (let i = 1; i <= end; i++) {
      options.push(i.toString());
    }
    return options;
  }

  private createYearList(): string[] {
    let currentYear = new Date().getFullYear();
    let options: string[] = [];
    for (let i = 1990; i <= currentYear; i++) {
      options.push(i.toString());
    }
    return options;
  }

  public getValue(): string {
    let firstDate = this.getDate(this.firstDay, this.firstMonth, this.firstYear);
    let secondDate = this.getDate(this.secondDay, this.secondMonth, this.secondYear);
    return this.isSelected() ? '(@date>=' + this.dateToString(firstDate) + ')(@date<=' + this.dateToString(secondDate) + ')' : '';
  }

  private getDate(day: Dropdown, month: Dropdown, year: Dropdown): Date {
    let date = new Date();
    date.setDate(parseInt(day.getValue()));
    date.setMonth(parseInt(month.getValue()) - 1);
    date.setFullYear(parseInt(year.getValue()));
    return date;
  }
}