import { IFormWidgetsWithLabel, IFormWidgetsSelectable } from './FormWidgets';
import { $$ } from '../../utils/Dom';
import 'styling/vapor/_Checkbox';

export class Checkbox implements IFormWidgetsWithLabel, IFormWidgetsSelectable {
  protected element: HTMLElement;
  protected checkbox: HTMLInputElement;

  constructor(public onChange: (checkbox: Checkbox) => void = (checkBox: Checkbox) => {
  }, public label: string) {
    this.buildContent();
  }

  /*constructor(private checkboxElementToBuild: IPreferencePanelInputToBuild[], public name: string) {
   super(checkboxElementToBuild, name, 'checkbox');
   }*/

  public build(): HTMLElement {
    return this.element;

    /* var icons = $$(build).findAll('.coveo-input-icon');
     _.each(icons, (icon: HTMLElement) => {
     var input = <HTMLInputElement>$$(icon.parentElement).find('input');
     $$(input).on('change', () => {
     var checked = input.checked;
     $$(icon).toggleClass('coveo-selected', checked);
     });

     $$(icon).on('click', () => {
     input.checked = !input.checked;
     $$(input).trigger('change');
     });
     });
     return build;*/
  }

  public getValue() {
    return this.label;
  }

  public reset() {
    this.checkbox.checked = false;
  }

  public select() {
    this.checkbox.checked = true;
  }

  public isSelected() {
    return this.checkbox.checked;
  }

  public getLabel() {
    return this.element;
  }

  private buildContent() {
    const label = $$('label', {
      className: 'coveo-checkbox-label'
    });

    this.checkbox = <HTMLInputElement>$$('input', { type: 'checkbox', className: 'coveo-checkbox', id: this.label }).el;
    const button = $$('button', { type: 'button', className: 'coveo-checkbox-button' });
    const labelSpan = $$('span', { className: 'coveo-checkbox-span-label' }, this.label);

    label.append(this.checkbox);
    label.append(button.el);
    label.append(labelSpan.el);

    button.on('click', () => {
      this.checkbox.checked = !this.isSelected();
      $$(this.checkbox).trigger('change');
    });

    $$(this.checkbox).on('change', () => {
      this.onChange(this);
    });
    this.element = label.el;
  }
}
