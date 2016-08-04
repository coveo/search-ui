import {DateInput} from './DateInput';
import {DatePicker} from '../Form/DatePicker';
import {l} from '../../../strings/Strings';
import {$$} from '../../../utils/Dom';

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
