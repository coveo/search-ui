import { $$, Dom } from '../utils/Dom';
import { MagicBoxInstance } from './MagicBox';
import { l } from '../strings/Strings';
import { AccessibleButton } from '../utils/AccessibleButton';

export class MagicBoxClear {
  public element: Dom;

  constructor(magicBox: MagicBoxInstance) {
    this.element = $$('div', {
      className: 'magic-box-clear'
    });
    const clearIcon = $$('div', {
      className: 'magic-box-icon'
    });
    this.element.append(clearIcon.el);

    this.element.insertAfter($$(magicBox.element).find('input'));

    new AccessibleButton()
      .withElement(this.element)
      .withLabel(l('Clear'))
      .withSelectAction(() => magicBox.clear())
      .build();
  }
}
