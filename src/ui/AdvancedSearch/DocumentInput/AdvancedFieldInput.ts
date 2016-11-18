import {Dropdown} from '../Form/Dropdown';
import {TextInput} from '../Form/TextInput';
import {$$} from '../../../utils/Dom';
import {DocumentInput} from './DocumentInput';

export class AdvancedFieldInput extends DocumentInput {

  protected element: HTMLElement;
  public mode: Dropdown;
  public input: TextInput;

  constructor(public inputName: string, public fieldName: string) {
    super(inputName);
  }

  public reset() {
    this.mode.reset();
    this.input.reset();
  }

  public build(): HTMLElement {
    let fieldInput = $$(super.build());
    this.mode = new Dropdown(this.onChange.bind(this), ['Contains', 'DoesNotContain', 'Matches']);
    fieldInput.append(this.mode.getElement());
    this.input = new TextInput(this.onChange.bind(this), '');
    fieldInput.append(this.input.getElement());
    this.element = fieldInput.el;
    return this.element;
  }

  public getValue(): string {
    let inputValue = this.input.getValue();
    if (inputValue) {
      switch (this.mode.getValue()) {
        case 'Contains':
          return this.fieldName + '=' + inputValue;
        case 'DoesNotContain':
          return this.fieldName + '<>' + inputValue;
        default:
          return this.fieldName + '==\"' + inputValue + '\"';
      }
    }
    return '';
  }

}
