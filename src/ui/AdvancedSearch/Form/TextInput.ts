import {$$} from '../../../utils/Dom';

export class TextInput {

  private element: HTMLElement;

  constructor(private label?: string, private onChange: () => void = () => {}) {
    this.build();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getValue(): string {
    return (<HTMLInputElement>$$(this.element).find('input')).value;
  }

  public setValue(value: string) {
    (<HTMLInputElement>$$(this.element).find('input')).value = value;
  }

  private build() {
    let container = $$('div', { className: 'coveo-input' });
    let input = $$('input', { type: 'text' });
    input.on(['keydown', 'blur'], (e: Event)=>{
      if (e instanceof KeyboardEvent && e.keyCode == 13 || e.type == 'blur') {
        this.onChange();
      }
    });
    (<HTMLInputElement>input.el).required = true;
    container.append(input.el);
    if (this.label) {
      let label = $$('label');
      label.text(this.label);
      container.append(label.el);
    }
    this.element = container.el;
    return this.element;
  }
}
