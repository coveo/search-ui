import { Dropdown } from '../../FormWidgets/Dropdown';
import { TextInput } from '../../FormWidgets/TextInput';
import { $$ } from '../../../utils/Dom';
import { DocumentInput } from './DocumentInput';
import { QueryBuilder } from '../../Base/QueryBuilder';

export class AdvancedFieldInput extends DocumentInput {
  protected element: HTMLElement;
  public mode: Dropdown;
  public input: TextInput;

  constructor(public inputName: string, public fieldName: string, public root: HTMLElement) {
    super(inputName, root);
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
    let builder = new QueryBuilder();
    if (inputValue) {
      switch (this.mode.getValue()) {
        case 'Contains':
          builder.advancedExpression.addFieldExpression(this.fieldName, '=', [inputValue]);
          return builder.build().aq;

        case 'DoesNotContain':
          builder.advancedExpression.addFieldExpression(this.fieldName, '<>', [inputValue]);
          return builder.build().aq;
        default:
          builder.advancedExpression.addFieldExpression(this.fieldName, '==', [inputValue]);
          return builder.build().aq;
      }
    }
    return '';
  }
}
