import { DateInput } from './DateInput';
import { $$ } from '../../../utils/Dom';
import { l } from '../../../strings/Strings';
import { Dropdown } from '../../FormWidgets/Dropdown';
import { NumericSpinner } from '../../FormWidgets/NumericSpinner';
import { DateUtils } from '../../../utils/DateUtils';

export class InTheLastDateInput extends DateInput {
  public dropdown: Dropdown;
  public spinner: NumericSpinner;

  constructor(public root: HTMLElement) {
    super(l('InTheLast'), root);
  }

  public reset() {
    this.dropdown.reset();
    this.spinner.reset();
  }

  public build(): HTMLElement {
    super.build();
    let input = $$('fieldset', { className: 'coveo-advanced-search-date-input' });
    (<HTMLFieldSetElement>input.el).disabled = true;

    this.spinner = new NumericSpinner(this.onChange.bind(this));
    input.append(this.spinner.getElement());

    this.dropdown = new Dropdown(this.onChange.bind(this), ['Days', 'Months']);
    this.dropdown.setId('coveo-advanced-search-in-the-last-select');
    input.append(this.dropdown.getElement());

    this.element.appendChild(input.el);

    $$(this.getRadio()).on('change', this.onChange.bind(this));
    return this.element;
  }

  public getValue(): string {
    let currentDate = new Date();
    let time = this.spinner.getIntValue();
    let size = this.dropdown.getValue().toLowerCase();

    let date = new Date();
    if (size == 'months') {
      date.setMonth(currentDate.getMonth() - time);
    } else {
      date.setDate(currentDate.getDate() - time);
    }

    return this.isSelected() && time ? '@date>=' + DateUtils.dateForQuery(date) : '';
  }
}
