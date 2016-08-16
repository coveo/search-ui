import {DateInput} from './DateInput';
import {l} from '../../../strings/Strings';

export class AnytimeDateInput extends DateInput {
  constructor() {
    super(l('Anytime'));
  }

  public build(): HTMLElement {
    super.build();
    this.getRadio().checked = true;
    return this.element;
  }

}
