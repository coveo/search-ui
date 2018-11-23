import { DateInput } from './DateInput';
import { DatePicker } from '../../FormWidgets/DatePicker';
import { l } from '../../../strings/Strings';
import { $$ } from '../../../utils/Dom';
import { DateUtils } from '../../../utils/DateUtils';
import { TimeSpan } from '../../../utils/TimeSpanUtils';

export class BetweenDateInput extends DateInput {
  public firstDatePicker: DatePicker = new DatePicker(this.onChange.bind(this));
  public secondDatePicker: DatePicker = new DatePicker(this.onChange.bind(this));

  constructor(public root: HTMLElement) {
    super(l('Between'), root);
  }

  public reset() {
    this.firstDatePicker.reset();
    this.secondDatePicker.reset();
  }

  public build(): HTMLElement {
    super.build();
    const container = $$('fieldset', { className: 'coveo-advanced-search-date-input' });
    (<HTMLFieldSetElement>container.el).disabled = true;

    container.append(this.firstDatePicker.getElement());
    container.append(this.buildAnd());
    container.append(this.secondDatePicker.getElement());

    this.element.appendChild(container.el);
    return this.element;
  }

  public getValue(): string {
    const firstDate = this.firstDatePicker.getDateValue();
    const secondDate = this.secondDatePicker.getDateValue();
    const firstDateAsString = this.firstDatePicker.getValue();
    const secondDateAsString = this.secondDatePicker.getValue();

    let query = '';

    if (this.isSelected()) {
      if (firstDate && secondDate) {
        const timespan = TimeSpan.fromDates(
          DateUtils.convertFromJsonDateIfNeeded(firstDate),
          DateUtils.convertFromJsonDateIfNeeded(secondDateAsString)
        );
        if (timespan.getMilliseconds() < 0) {
          throw l('QueryExceptionInvalidDate');
        }
      }
      if (firstDateAsString) {
        query += `(@date>=${firstDateAsString})`;
      }
      if (secondDateAsString) {
        query += `(@date<=${secondDateAsString})`;
      }
    }
    return query;
  }

  private buildAnd(): HTMLElement {
    const and = $$('div', { className: 'coveo-advanced-search-and' });
    and.text(l('And').toLowerCase());
    return and.el;
  }
}
