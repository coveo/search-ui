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
    const input = $$('fieldset', { className: 'coveo-advanced-search-date-input' });
    (<HTMLFieldSetElement>input.el).disabled = true;

    this.spinner = new NumericSpinner(this.onChange.bind(this), undefined, undefined, l('InTheLast'));
    input.append(this.spinner.getElement());

    this.dropdown = new Dropdown(this.onChange.bind(this), ['Days', 'Months'], undefined, l('InTheLast'));
    this.dropdown.setId('coveo-advanced-search-in-the-last-select');
    input.append(this.dropdown.getElement());

    this.element.appendChild(input.el);

    $$(this.getRadio()).on('change', this.onChange.bind(this));
    return this.element;
  }

  public getValue(): string {
    const currentDate = new Date();
    const time = this.spinner.getIntValue();
    const size = this.dropdown.getValue().toLowerCase();

    const date = new Date();
    if (size == 'months') {
      date.setMonth(currentDate.getMonth() - time);
    } else {
      date.setDate(currentDate.getDate() - time);
    }

    return this.isSelected() && time ? '@date>=' + DateUtils.dateForQuery(date) : '';
  }
}
