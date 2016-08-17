declare function require(name: string);
import {$$} from '../../../utils/Dom';
import {DateUtils} from '../../../utils/DateUtils';
let Pikaday = require('pikaday');

export class DatePicker {

  private element: HTMLInputElement;
  private picker: Pikaday;

  constructor(private onChange: () => void = ()=>{}) {
    this.build();
  }

  public getElement(): HTMLInputElement {
    return this.element;
  }

  public getValue(): string {
    let date = this.picker.getDate();
    return date ? DateUtils.dateForQuery(this.picker.getDate()): '';
  }

  public setValue(date: Date) {
    this.picker.setDate(date);
  }

  private build() {
    this.element = <HTMLInputElement>$$('input', { className: 'coveo-button' }).el;
    this.element.readOnly = true;
    this.picker = new Pikaday({
      field: this.element,
      onSelect: this.onChange
    });
    return this.element;
  }
}
