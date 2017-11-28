import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import * as _ from 'underscore';
import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
import { exportGlobally } from '../../GlobalExports';

/**
 * A dropdown widget with standard styling.
 */
export class Dropdown implements IFormWidget, IFormWidgetSettable {
  private element: HTMLElement;
  private selectElement: HTMLSelectElement;
  private optionsElement: HTMLOptionElement[] = [];

  static doExport() {
    exportGlobally({
      Dropdown: Dropdown
    });
  }

  /**
   * Creates a new `Dropdown`.
   * @param onChange The function to call when the dropdown selected value changes. This function takes the current
   * `Dropdown` instance as an argument.
   * @param listOfValues The selectable values to display in the dropdown.
   * @param getDisplayValue An optional function to modify the display values, rather than using the values as they
   * appear in the `listOfValues`.
   * @param label The label to display for the dropdown.
   */
  constructor(
    public onChange: (dropdown: Dropdown) => void = (dropdown: Dropdown) => {},
    protected listOfValues: string[],
    private getDisplayValue: (string) => string = l
  ) {
    this.buildContent();
    this.select(0, false);
    this.bindEvents();
  }

  /**
   * Resets the dropdown.
   */
  public reset() {
    this.select(0, false);
  }

  public setId(id: string) {
    $$(this.element).setAttribute('id', id);
  }

  /**
   * Gets the element on which the dropdown is bound.
   * @returns {HTMLElement} The dropdown element.
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Gets the currently selected dropdown value.
   * @returns {string} The currently selected dropdown value.
   */
  public getValue(): string {
    return this.selectElement.value;
  }

  /**
   * Selects a value from the dropdown [`listofValues`]{@link Dropdown.listOfValues}.
   * @param index The 0-based index position of the value to select in the `listOfValues`.
   * @param executeOnChange Indicates whether to execute the [`onChange`]{@link Dropdown.onChange} function when this
   * method changes the dropdown selection.
   */
  public select(index: number, executeOnChange = true) {
    this.selectOption(this.optionsElement[index], executeOnChange);
  }

  /**
   * Gets the element on which the dropdown is bound.
   * @returns {HTMLElement} The dropdown element.
   */
  public build() {
    return this.element;
  }

  /**
   * Sets the dropdown value.
   * @param value The value to set the dropdown to.
   */
  public setValue(value: string) {
    _.each(this.optionsElement, option => {
      if ($$(option).getAttribute('data-value') == value) {
        this.selectOption(option);
      }
    });
  }

  private selectOption(option: HTMLOptionElement, executeOnChange = true) {
    this.selectElement.value = option.value;
    if (executeOnChange) {
      this.onChange(this);
    }
  }

  private buildContent() {
    this.selectElement = <HTMLSelectElement>$$('select', { className: 'coveo-dropdown' }).el;
    let selectOptions = this.buildOptions();
    _.each(selectOptions, opt => {
      $$(this.selectElement).append(opt);
    });
    this.element = this.selectElement;
  }

  private buildOptions(): HTMLElement[] {
    let ret: HTMLElement[] = [];
    _.each(this.listOfValues, (value: string) => {
      ret.push(this.buildOption(value));
    });
    return ret;
  }

  private buildOption(value: string): HTMLElement {
    let option = $$('option');
    option.setAttribute('data-value', value);
    option.setAttribute('value', value);
    option.text(this.getDisplayValue(value));
    this.optionsElement.push(<HTMLOptionElement>option.el);
    return option.el;
  }

  private bindEvents() {
    $$(this.selectElement).on('change', () => this.onChange(this));
  }
}
