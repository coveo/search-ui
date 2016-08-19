import {$$} from '../../../utils/Dom';
import {KEYBOARD} from '../../../utils/KeyboardUtils';

export class TextInput {

  private element: HTMLElement;
  private lastQueryText: string = "";

  constructor(private label?: string, private onChange: () => void = () => { }) {
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

  private getInput(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }

  private build() {
    let container = $$('div', { className: 'coveo-input' });
    let input = $$('input', { type: 'text' });
    input.on(['keydown', 'blur'], (e: Event) => {
      if (e.type == 'blur' || (<KeyboardEvent>e).keyCode == KEYBOARD.ENTER) {
        this.triggerChange();
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

  private triggerChange() {
    if (this.lastQueryText != this.getInput().value) {
      this.onChange();
      this.lastQueryText = this.getInput().value;
    }
  }
}
