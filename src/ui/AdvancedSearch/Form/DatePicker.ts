declare function require(name: string);
import { $$ } from '../../../utils/Dom';
import { DateUtils } from '../../../utils/DateUtils';
let Pikaday = require('pikaday');


/**
 * This class will create a date picker meant to be used inside the {@link AdvancedSearch} component.
 *
 * It can be, more specifically, used for external code using the {@link AdvancedSearchEvents.buildingAdvancedSearch}
 */
export class DatePicker {

  private element: HTMLInputElement;
  private picker: Pikaday;
  public name: string;
  private wasReset = false;

  /**
   * Create a new date picker.
   * @param onChange will be called every time the date picker change it's value. `this` will be the `DatePicker` instance.
   */
  constructor(public onChange: () => void = () => { }) {
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
