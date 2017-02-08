import { DateInput } from './DateInput';
import { l } from '../../../strings/Strings';
import { $$ } from '../../../utils/Dom';
import { AdvancedSearchEvents } from '../../../events/AdvancedSearchEvents';

export class AnytimeDateInput extends DateInput {
  constructor() {
    super(l('Anytime'));
  }

  public build(): HTMLElement {
    super.build();
    let radio = this.getRadio();
    radio.checked = true;
    $$(radio).on('change', () => {
      $$(this.element).trigger(AdvancedSearchEvents.executeAdvancedSearch);
    });
    return this.element;
  }

}
