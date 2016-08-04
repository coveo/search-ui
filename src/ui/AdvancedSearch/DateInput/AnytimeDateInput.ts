import {DateInput} from './DateInput';

export class AnytimeDateInput extends DateInput {
  constructor() {
    super('AdvancedSearchAnytime');
  }

  public build(): HTMLElement {
    super.build();
    this.getRadio().checked = true;
    return this.element;
  }

}
