import {DateInput} from './DateInput';
import {$$} from '../../../utils/Dom';
import {Dropdown} from '../Form/Dropdown';
import {NumericSpinner} from '../Form/NumericSpinner';
import {DateUtils} from '../../../utils/DateUtils';

export class InTheLastDateInput extends DateInput {

  public dropdown: Dropdown;
  public spinner: NumericSpinner;

  constructor() {
    super('AdvancedSearchInTheLast');
  }

  public build(): HTMLElement {
    super.build();
    let input = $$('fieldset', { className: 'coveo-advanced-search-date-input' });
    (<HTMLFieldSetElement>input.el).disabled = true;

    this.spinner = new NumericSpinner();
    input.append(this.spinner.getElement());

    this.dropdown = new Dropdown(['days', 'months'], 'coveo-advanced-search-in-the-last-select')
    input.append(this.dropdown.getElement());

    this.element.appendChild(input.el);
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

    return this.isSelected() ? '@date>=' + DateUtils.dateForQuery(date) : '';
  }

}
