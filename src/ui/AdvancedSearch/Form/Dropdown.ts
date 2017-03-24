import { $$, Dom } from '../../../utils/Dom';
import { l } from '../../../strings/Strings';
import _ = require('underscore');

/**
 * This class will create a dropdown meant to be used inside the {@link AdvancedSearch} component.
 *
 * It can be, more specifically, used for external code using the {@link AdvancedSearchEvents.buildingAdvancedSearch}
 */
export class Dropdown {

  private element: HTMLElement;
  private selectElement: HTMLSelectElement;
  private optionsElement: HTMLOptionElement[] = [];

  /**
   * Create a new dropdown.
   * @param onChange will be called every time the dropdown change it's value. `this` will be the `Dropdown` instance.
   * @param listOfValues will be the list of selectable values in the dropdown
   * @param getDisplayValue An optional function that allow to modify the display value vs the actual value from the `listOfValues`
   * @param label A label/title to display for this dropdown
   */
  constructor(public onChange: () => void = () => {
  }, protected listOfValues: string[], private getDisplayValue: (string) => string = l, private label?: string) {
    this.buildContent();
    this.select(0, false);
    this.bindEvents();
  }

  /**
   * Reset the dropdown
   */
  public reset() {
    this.select(0, false);
  }

  public setId(id: string) {
    $$(this.element).setAttribute('id', id);
  }

  /**
   * Return the element on which the dropdown is bound.
   * @returns {HTMLElement}
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Get the currently selected value in the dropdown.
   * @returns {string}
   */
  public getValue(): string {
    return this.selectElement.value;
  }

  /**
   * Select a value from it's 0 based index in the {@link Dropdown.listOfValues}.
   * @param index
   */
  public select(index: number, executeOnChange = true) {
    this.selectOption(this.optionsElement[index], executeOnChange);
  }

  /**
   * Return the element on which the dropdown is bound.
   * @returns {HTMLElement}
   */
  public build() {
    return this.element;
  }

  private buildContent() {
    this.selectElement = <HTMLSelectElement>$$('select', { className: 'coveo-dropdown' }).el;
    let selectOptions = this.buildOptions();
    _.each(selectOptions, (opt) => {
      $$(this.selectElement).append(opt);
    });
    this.element = this.selectElement;
  }

  public selectValue(value: string) {
    _.each(this.optionsElement, (option) => {
      if ($$(option).getAttribute('data-value') == value) {
        this.selectOption(option);
      }
    });
  }

  private selectOption(option: HTMLOptionElement, executeOnChange = true) {
    this.selectElement.value = option.value;
    if (executeOnChange) {
      this.onChange();
    }
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
    $$(this.selectElement).on('change', () => this.onChange());
  }
}
