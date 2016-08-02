import {$$} from '../../utils/Dom';

export class Dropdown {

  private element: HTMLElement

  constructor(private listOfValues: string[], private id: string, noValue: boolean = false){
    if (noValue) {
      this.listOfValues.splice(0, 0, '');
    }
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
    return $$(this.element).find('.coveo-dropdown-selected-value').innerText;
  }

  private build() {
    let dropdown = $$('div', {className: 'coveo-dropdown', id: this.id});
    let button = $$('button', {className: 'coveo-button coveo-dropdown-toggle', type:'button'});
    button.setAttribute('data-toggle', 'coveo-dropdown');
    let selected = $$('span', {className: 'coveo-dropdown-selected-value'});
    selected.text(this.listOfValues[0]);
    button.append(selected.el);
    button.append($$('span', {className: 'coveo-dropdown-toggle-arrow'}).el);
    dropdown.append(button.el);
    let dropdownMenu = $$('ul', {className: 'coveo-dropdown-menu'});
    _.each(this.listOfValues, (value: string)=>{
      let option = $$('li');
      let content = $$('span');
      content.text(value);
      option.on('click', ()=>{
        selected.text(value);
        this.close();
      })

      option.append(content.el);
      dropdownMenu.append(option.el);
    })
    dropdown.append(dropdownMenu.el);
    this.element = dropdown.el;
  }

  private bindEvents() {
    let button = $$(this.element).find('button');
    $$(button).on('click', ()=>{
      if ($$(this.element).hasClass('coveo-open')) {
        this.close();
      } else {
        this.open();
      }
    })
  }
}