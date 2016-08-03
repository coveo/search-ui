import {ComponentOptions} from '../Base/ComponentOptions';
import {IAdvancedSearchInput} from './AdvancedSearchInput';
import {QueryBuilder} from '../Base/QueryBuilder';
import {l} from '../../strings/Strings';
import {Dropdown} from './Dropdown';
import {NumericSpinner} from './NumericSpinner';
import {$$} from '../../utils/Dom';
import {DateUtils} from '../../utils/DateUtils';
import {DatePicker} from './DatePicker';

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
    let input = $$('fieldset', { className: 'coveo-advanced-search-date-input' });
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

    return this.isSelected() ? '@date>=' + DateUtils.dateForQuery(date) : '';
  }

}

export class BetweenDateInput extends DateInput {

  private firstDatePicker: DatePicker;
  private secondDatePicker: DatePicker;

  constructor() {
    super('AdvancedSearchBetween');
  }

  public build(): HTMLElement {
    super.build();
    let container = $$('fieldset', { className: 'coveo-advanced-search-date-input' });
    (<HTMLFieldSetElement>container.el).disabled = true;

    this.firstDatePicker = new DatePicker();
    container.append(this.firstDatePicker.getElement());

    let and = $$('div', { className: 'coveo-advanced-search-and' });
    and.text(l('And').toLowerCase());
    container.append(and.el);

    this.secondDatePicker = new DatePicker();
    container.append(this.secondDatePicker.getElement());

    this.element.appendChild(container.el);
    return this.element;
  }

  public getValue(): string {
    return this.isSelected() ? '(@date>=' + this.firstDatePicker.getValue() + ')(@date<=' + this.secondDatePicker.getValue() + ')' : '';
  }
}
