import {$$, Dom} from '../../../utils/Dom';
import {l} from '../../../strings/Strings';
import {AdvancedSearchEvents} from '../../../events/AdvancedSearchEvents';

export class Dropdown {

  private element: HTMLElement;
  private selected: Dom;
  private selectedIcon: Dom;
  private options: HTMLElement[] = [];

  constructor(protected listOfValues: string[], private onChange: () => void = () => { }, private getDisplayValue: (string) => string = l) {
    this.build();
    this.select(0);
    this.bindEvents();
  }

  public setId(id: string) {
    $$(this.element).setAttribute('id', id);
  }

  public open() {
    $$(this.element).addClass('coveo-open');
  }

  public close() {
    $$(this.element).removeClass('coveo-open');
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getValue(): string {
    return $$(this.element).find('.coveo-dropdown-selected-value').getAttribute('value');
  }

  public select(index: number) {
    this.selectOption(this.options[index]);
  }

  public selectValue(value: string) {
    _.each(this.options, (option) => {
      if ($$(option).getAttribute('value') == value) {
        this.selectOption(option);
      }
    })
  }

  private selectOption(option: HTMLElement) {
    this.selectedIcon.detach();
    let content = $$(option).find('span');
    $$(content).prepend(this.selectedIcon.el);
    let value = $$(option).getAttribute('value');
    this.selected.setAttribute('value', value);
    this.selected.text(this.getDisplayValue(value));
    this.close();
    this.onChange();
  }

  protected build() {
    let dropdown = $$('div', { className: 'coveo-dropdown' });
    let button = $$('button', { className: 'coveo-button coveo-dropdown-toggle', type: 'button' });
    button.setAttribute('data-toggle', 'coveo-dropdown');
    this.selected = $$('span', { className: 'coveo-dropdown-selected-value' });
    button.append(this.selected.el);
    button.append($$('span', { className: 'coveo-dropdown-toggle-arrow' }).el);
    dropdown.append(button.el);
    dropdown.append(this.buildDropdownMenu(this.selected));
    this.element = dropdown.el;
  }

  private buildDropdownMenu(selected: Dom): HTMLElement {
    let dropdownMenu = $$('ul', { className: 'coveo-dropdown-menu' });
    this.selectedIcon = $$('span', { className: 'coveo-selected-icon coveo-sprites-facet-search-checkbox-hook-active' });
    _.each(this.listOfValues, (value: string) => {
      dropdownMenu.append(this.buildOption(value));
    })
    return dropdownMenu.el;
  }

  private buildOption(value: string): HTMLElement {
    let option = $$('li');
    option.setAttribute('value', value);
    let content = $$('span');
    content.text(this.getDisplayValue(value));
    option.append(content.el);
    option.on('click', () => {
      this.selectOption(option.el);
    })
    this.options.push(option.el);
    return option.el;
  }

  private bindEvents() {
    let button = $$(this.element).find('button');
    $$(button).on('click', () => {
      if ($$(this.element).hasClass('coveo-open')) {
        this.close();
      } else {
        this.open();
      }
    })
  }
}
