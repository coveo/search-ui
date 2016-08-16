import {DateInput} from './DateInput';
import {DatePicker} from '../Form/DatePicker';
import {l} from '../../../strings/Strings';
import {$$} from '../../../utils/Dom';

export class BetweenDateInput extends DateInput {

  public firstDatePicker: DatePicker = new DatePicker();
  public secondDatePicker: DatePicker = new DatePicker();

  constructor() {
    super(l('Between'));
  }

  public build(): HTMLElement {
    super.build();
    let container = $$('fieldset', { className: 'coveo-advanced-search-date-input' });
    (<HTMLFieldSetElement>container.el).disabled = true;

    container.append(this.firstDatePicker.getElement());

    let and = $$('div', { className: 'coveo-advanced-search-and' });
    and.text(l('And').toLowerCase());
    container.append(and.el);

    container.append(this.secondDatePicker.getElement());

    this.element.appendChild(container.el);
    return this.element;
  }

  public getValue(): string {
    return this.isSelected() ? '(@date>=' + this.firstDatePicker.getValue() + ')(@date<=' + this.secondDatePicker.getValue() + ')' : '';
  }
}
