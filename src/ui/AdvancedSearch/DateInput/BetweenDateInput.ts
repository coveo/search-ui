import { DateInput } from './DateInput';
import { DatePicker } from '../Form/DatePicker';
import { l } from '../../../strings/Strings';
import { $$ } from '../../../utils/Dom';

export class BetweenDateInput extends DateInput {

  public firstDatePicker: DatePicker = new DatePicker(this.onChange.bind(this));
  public secondDatePicker: DatePicker = new DatePicker(this.onChange.bind(this));

  constructor() {
    super(l('Between'));
  }

  public reset() {
    this.firstDatePicker.reset();
    this.secondDatePicker.reset();
  }

  public build(): HTMLElement {
    super.build();
    let container = $$('fieldset', { className: 'coveo-advanced-search-date-input' });
    (<HTMLFieldSetElement>container.el).disabled = true;

    container.append(this.firstDatePicker.getElement());
    container.append(this.buildAnd());
    container.append(this.secondDatePicker.getElement());

    this.element.appendChild(container.el);
    return this.element;
  }

  public getValue(): string {
    let firstDate = this.firstDatePicker.getValue();
    let secondDate = this.secondDatePicker.getValue();
    let query = '';
    if (firstDate) {
      query += `(@date>=${firstDate})`;
    }
    if (secondDate) {
      query += `(@date<=${secondDate})`;
    }
    return this.isSelected() ? query : '';
  }

  private buildAnd(): HTMLElement {
    let and = $$('div', { className: 'coveo-advanced-search-and' });
    and.text(l('And').toLowerCase());
    return and.el;
  }
}
