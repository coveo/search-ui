import { DateInput } from './DateInput';
import { l } from '../../../strings/Strings';
import { $$ } from '../../../utils/Dom';
import { AdvancedSearchEvents } from '../../../events/AdvancedSearchEvents';

export class AnytimeDateInput extends DateInput {
  constructor(public root: HTMLElement) {
    super(l('Anytime'), root);
  }

  public getValue() {
    return null;
  }

  public build(): HTMLElement {
    super.build();
    let radio = this.getRadio();
    radio.checked = true;
    $$(radio).on('change', () => {
      if (this.root) {
        $$(this.root).trigger(AdvancedSearchEvents.executeAdvancedSearch);
      } else {
        $$(this.element).trigger(AdvancedSearchEvents.executeAdvancedSearch);
      }
    });
    return this.element;
  }
}
