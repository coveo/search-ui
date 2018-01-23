import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
declare function require(name: string);
import { $$ } from '../../utils/Dom';
import { DateUtils } from '../../utils/DateUtils';
import { exportGlobally } from '../../GlobalExports';
import { l } from '../../strings/Strings';
const Globalize = require('globalize');
const Pikaday = require('pikaday');

/**
 * A date picker widget with standard styling.
 */
export class DatePicker implements IFormWidget, IFormWidgetSettable {
  private element: HTMLInputElement;
  private picker: Pikaday;
  public name: string;
  private wasReset = true;

  static doExport = () => {
    exportGlobally({
      DatePicker: DatePicker
    });
  };

  /**
   * Creates a new `DatePicker`.
   * @param onChange The function to call when a new value is selected in the date picker. This function takes the
   * current `DatePicker` instance as an argument.
   */
  constructor(public onChange: (datePicker: DatePicker) => void = () => {}) {
    this.buildContent();
  }

  /**
   * Resets the date picker.
   */
  public reset() {
    this.picker.setDate(undefined);
    this.wasReset = true;
    this.onChange(this);
  }

  /**
   * Gets the element on which the date picker is bound.
   * @returns {HTMLInputElement} The date picker element.
   */
  public getElement(): HTMLInputElement {
    return this.element;
  }

  /**
   * Gets the currently selected value in the date picker.
   * @returns {string} A textual representation of the currently selected value (`YYYY-MM-DD` format).
   */
  public getValue(): string {
    if (this.wasReset) {
      return '';
    }
    let date = this.picker.getDate();
    return date ? DateUtils.dateForQuery(this.picker.getDate()) : '';
  }

  /**
   * Get the currently selected value in the date picker, as a Date object
   * @returns {Date} A Date object for the current value, or null if the date picker was reset or a date has not been selected initially.
   */
  public getDateValue(): Date {
    if (this.wasReset) {
      return null;
    }
    return this.picker.getDate();
  }

  /**
   * Sets the date picker value.
   * @param date The value to set the date picker to. Must be a
   * [Date](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date) object.
   */
  public setValue(date: Date) {
    this.picker.setDate(date);
    this.wasReset = false;
  }

  /**
   * Gets the element on which the date picker is bound.
   * @returns {HTMLInputElement} The date picker element.
   */
  public build(): HTMLInputElement {
    return this.element;
  }

  private buildContent() {
    this.element = <HTMLInputElement>$$('input', { className: 'coveo-button' }).el;
    this.element.readOnly = true;
    this.picker = new Pikaday({
      field: this.element,
      onSelect: () => {
        this.wasReset = false;
        this.onChange.call(this, this);
      },
      i18n: {
        previousMonth: l('PreviousMonth'),
        nextMonth: l('NextMonth'),
        months: Globalize.culture().calendar.months.names,
        weekdays: Globalize.culture().calendar.days.names,
        weekdaysShort: Globalize.culture().calendar.days.namesAbbr
      }
    });
  }
}
