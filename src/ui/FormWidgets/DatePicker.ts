import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
declare function require(name: string);
import { $$ } from '../../utils/Dom';
import { DateUtils } from '../../utils/DateUtils';
import { exportGlobally } from '../../GlobalExports';
let Pikaday = require('pikaday');


/**
 * A date picker with standard styling.
 */
export class DatePicker implements IFormWidget, IFormWidgetSettable {

  private element: HTMLInputElement;
  private picker: Pikaday;
  public name: string;
  private wasReset = false;

  static doExport = () => {
    exportGlobally({
      'DatePicker': DatePicker
    });
  }

  /**
   * Create a new datepicker
   * @param onChange called when a new date is selected, with the date picker instance as the argument
   */
  constructor(public onChange: (datePicker: DatePicker) => void = () => {
  }) {
    this.buildContent();
  }

  /**
   * Reset the date picker
   */
  public reset() {
    this.picker.setDate(undefined);
    this.wasReset = true;
  }

  /**
   * Return the element on which the date picker is bound.
   * @returns {HTMLInputElement}
   */
  public getElement(): HTMLInputElement {
    return this.element;
  }

  /**
   * Get the current value for the date picker.
   * @returns {string}
   */
  public getValue(): string {
    if (this.wasReset) {
      return '';
    }
    let date = this.picker.getDate();
    return date ? DateUtils.dateForQuery(this.picker.getDate()) : '';
  }

  /**
   * Set the current value for the date picker.
   * @param date
   */
  public setValue(date: Date) {
    this.picker.setDate(date);
    this.wasReset = false;
    this.onChange(this);
  }

  /**
   * Return the element on which the date picker is bound.
   * @returns {HTMLInputElement}
   */
  public build(): HTMLInputElement {
    return this.element;
  }

  private buildContent() {
    this.element = <HTMLInputElement>$$('input', { className: 'coveo-button' }).el;
    this.element.readOnly = true;
    this.picker = new Pikaday({
      field: this.element,
      onSelect: this.onChange
    });
  }
}
