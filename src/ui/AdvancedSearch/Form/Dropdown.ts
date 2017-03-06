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
  private selected: Dom;
  private selectedIcon: Dom;
  private options: HTMLElement[] = [];

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
   * Open the dropdown.
   */
  public open() {
    $$(this.element).addClass('coveo-open');
  }

  /**
   * Close the dropdown.
   */
  public close() {
    $$(this.element).removeClass('coveo-open');
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
    return $$(this.element).find('.coveo-dropdown-selected-value').getAttribute('data-value');
  }

  /**
   * Select a value from it's 0 based index in the {@link Dropdown.listOfValues}.
   * @param index
   */
  public select(index: number, executeOnChange = true) {
    this.selectOption(this.options[index], executeOnChange);
  }

  /**
   * Return the element on which the dropdown is bound.
   * @returns {HTMLElement}
   */
  public build() {
    return this.element;
  }

  private buildContent() {
    let dropdown = $$('div', { className: 'coveo-dropdown' });
    let button = $$('button', { className: 'coveo-button coveo-dropdown-toggle', type: 'button' });
    button.setAttribute('data-toggle', 'coveo-dropdown');
    this.selected = $$('span', { className: 'coveo-dropdown-selected-value' });
    button.append(this.selected.el);
    button.append($$('span', { className: 'coveo-dropdown-toggle-arrow' }).el);
    dropdown.append(button.el);
    dropdown.append(this.buildDropdownMenu());
    this.element = dropdown.el;
  }

  public selectValue(value: string) {
    _.each(this.options, (option) => {
      if ($$(option).getAttribute('data-value') == value) {
        this.selectOption(option);
      }
    });
  }

  private selectOption(option: HTMLElement, executeOnChange = true) {
    this.selectedIcon.detach();
    let content = $$(option).find('span');
    $$(content).prepend(this.selectedIcon.el);
    let value = $$(option).getAttribute('data-value');
    this.selected.setAttribute('data-value', value);
    this.selected.text(this.getDisplayValue(value));
    this.close();
    if (executeOnChange) {
      this.onChange();
    }
  }


  private buildDropdownMenu(): HTMLElement {
    let dropdownMenu = $$('ul', { className: 'coveo-dropdown-menu' });
    this.selectedIcon = $$('span', { className: 'coveo-selected-icon coveo-sprites-facet-search-checkbox-hook-active' });
    _.each(this.listOfValues, (value: string) => {
      dropdownMenu.append(this.buildOption(value));
    });
    return dropdownMenu.el;
  }

  private buildOption(value: string): HTMLElement {
    let option = $$('li');
    option.setAttribute('data-value', value);
    let content = $$('span');
    content.text(this.getDisplayValue(value));
    option.append(content.el);
    option.on('click', () => {
      this.selectOption(option.el);
    });
    this.options.push(option.el);
    return option.el;
  }

  private bindEvents() {
    let button = $$(this.element).find('button');

    $$(this.element).on('mouseleave', (e: MouseEvent) => {
      setTimeout(() => {
        let target;
        // There is a slight difference between jQuery target/currentTarget
        // and standard DOM events. Add a special check to cover both cases.
        if (e.currentTarget) {
          target = e.currentTarget;
        } else {
          target = e.target;
        }
        if (target == this.element && $$(this.element).hasClass('coveo-open')) {
          this.close();
        }
      }, 300);
    });
    $$(button).on('click', () => {
      if ($$(this.element).hasClass('coveo-open')) {
        this.close();
      } else {
        this.open();
      }
    });
  }
}
