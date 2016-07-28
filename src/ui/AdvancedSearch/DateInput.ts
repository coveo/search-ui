import {ComponentOptions} from '../Base/ComponentOptions';
import {IAdvancedSearchInput} from './AdvancedSearchInput';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';

export class DateInput implements IAdvancedSearchInput {

  protected element: HTMLElement

  constructor(public sectionName: string) {
  }

  public build(): HTMLElement {
    let sectionClassName = 'coveo-advanced-search-input-section coveo' + ComponentOptions.camelCaseToHyphen(this.sectionName).toLowerCase();
    let date = $$('div', { className: sectionClassName });
    let checkbox = $$('input', { type: 'radio', name: 'coveo-advanced-search-date' })
    let label = $$('div', { className: 'coveo-advanced-search-label' })
    label.text(l(this.sectionName + 'Label'));

    checkbox.on('change', () => {
      this.desactivateAllInputs();
      this.activateSelectedInput();
    })

    date.append(checkbox.el);
    date.append(label.el);
    this.element = date.el;
    return this.element;
  }

  public isSelected(): boolean {
    return this.getRadio().checked;
  }

  public getValue(): string {
    return '';
  }

  public shouldUpdateQueryState(): boolean {
    return false;
  }

  public shouldUpdateOnBuildingQuery(): boolean {
    return true;
  }

  protected getRadio(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }

  private desactivateAllInputs() {
    let selectElements = $$(this.element.parentElement).findAll('.coveo-advanced-search-select');
    let inputElements = $$(this.element.parentElement).findAll('.coveo-advanced-search-number-input');
    let elements = _.union(selectElements, inputElements);
    _.each(elements, (element) => {
      (<HTMLInputElement>element).disabled = true;
    })
  }

  private activateSelectedInput() {
    let selectElements = $$(this.element).findAll('.coveo-advanced-search-select');
    let inputElements = $$(this.element).findAll('.coveo-advanced-search-number-input');
    let elements = _.union(selectElements, inputElements);
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
    let numberInput = $$('input', { className: 'coveo-advanced-search-number-input' });
    (<HTMLInputElement>numberInput.el).disabled = true;
    let select = $$('select', { className: 'coveo-advanced-search-select' });
    (<HTMLInputElement>select.el).disabled = true;
    let daysOption = $$('option', { value: 'days', selected: 'selected' });
    daysOption.text(l('AdvancedSearchDays'))
    let monthOption = $$('option', { value: 'months' })
    monthOption.text(l('AdvancedSearchMonths'))
    select.append(daysOption.el);
    select.append(monthOption.el);
    this.element.appendChild(numberInput.el);
    this.element.appendChild(select.el);
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

    return this.isSelected() ? '@date>=' + this.dateToString(date): '';
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
    this.element.appendChild(this.buildDaySelect(this.FIRST_DATE_CLASS));
    this.element.appendChild(this.buildMonthSelect(this.FIRST_DATE_CLASS));
    this.element.appendChild(this.buildYearSelect(this.FIRST_DATE_CLASS));
    
    let and = $$('div', { className: 'coveo-advanced-search-and' });
    and.text(l('And').toLowerCase());
    this.element.appendChild(and.el);

    this.element.appendChild(this.buildDaySelect(this.SECOND_DATE_CLASS));
    this.element.appendChild(this.buildMonthSelect(this.SECOND_DATE_CLASS));
    this.element.appendChild(this.buildYearSelect(this.SECOND_DATE_CLASS));
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
