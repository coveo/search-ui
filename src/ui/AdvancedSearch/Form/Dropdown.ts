import {$$, Dom} from '../../../utils/Dom';
import {l} from '../../../strings/Strings';

export class Dropdown {

  private element: HTMLElement;

  constructor(protected listOfValues: string[], private id: string, private getDisplayValue: (string) => string = l) {
    this.build();
    this.bindEvents();
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

  protected build() {
    let dropdown = $$('div', { className: 'coveo-dropdown', id: this.id });
    let button = $$('button', { className: 'coveo-button coveo-dropdown-toggle', type: 'button' });
    button.setAttribute('data-toggle', 'coveo-dropdown');
    let selected = $$('span', { className: 'coveo-dropdown-selected-value' });
    selected.setAttribute('value', this.listOfValues[0]);
    selected.text(this.getDisplayValue(this.listOfValues[0]));
    button.append(selected.el);
    button.append($$('span', { className: 'coveo-dropdown-toggle-arrow' }).el);
    dropdown.append(button.el);
    dropdown.append(this.buildDropdownMenu(selected));
    this.element = dropdown.el;
  }

  private buildDropdownMenu(selected: Dom): HTMLElement {
    let dropdownMenu = $$('ul', { className: 'coveo-dropdown-menu' });
    let selectedIcon = $$('span', { className: 'coveo-selected-icon coveo-sprites-facet-search-checkbox-hook-active' });
    _.each(this.listOfValues, (value: string, index: number) => {
      let option = $$('li');
      let content = $$('span');
      content.text(this.getDisplayValue(value));
      if (index == 0) {
        content.prepend(selectedIcon.el);
      }
      option.on('click', () => {
        selectedIcon.detach();
        content.prepend(selectedIcon.el);
        selected.setAttribute('value', value);
        selected.text(this.getDisplayValue(value));
        this.close();
      })

      option.append(content.el);
      dropdownMenu.append(option.el);
    })
    return dropdownMenu.el;
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
