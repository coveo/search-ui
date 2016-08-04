import {$$} from '../../../utils/Dom';
import {DateUtils} from '../../../utils/DateUtils';
import {Pikaday} from '../../../ExternalModulesShim';

export class DatePicker {

  private element: HTMLInputElement;
  private picker: Pikaday;

  constructor() {
    this.build();
  }

  public getElement(): HTMLInputElement {
    return this.element;
  }

  public getValue(): string {
    return DateUtils.dateForQuery(this.picker.getDate());
  }

  public setValue(date: Date) {
    this.picker.setDate(date);
  }

  private build() {
    this.element = <HTMLInputElement>$$('input', { className: 'coveo-button' }).el;
    this.element.readOnly = true;
    this.picker = new Pikaday({ field: this.element });
    this.setValue(new Date());
    return this.element;
  }
}
