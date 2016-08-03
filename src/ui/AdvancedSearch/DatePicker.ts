import {$$} from '../../utils/Dom';
import {DateUtils} from '../../utils/DateUtils';
import {Pikaday} from '../../ExternalModulesShim';

export class DatePicker {

  private element: HTMLElement;
  private picker: Pikaday;

  constructor() {
    this.build();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getValue(): string {
    return DateUtils.dateForQuery(this.picker.getDate());
  }

  private build() {
    this.element = $$('input').el;
    this.picker = new Pikaday({ field: this.element });
    return this.element;
  }
}
