import { IFormWidgets } from './FormWidgets';
import { Dom, $$ } from '../../utils/Dom';
import * as _ from 'underscore';

import 'styling/vapor/_FormGroup';

export class FormGroup {
  private element: Dom;

  constructor(contents: IFormWidgets[], label: string) {
    this.element = $$('fieldset', { className: 'coveo-form-group' }, $$('span', { className: 'coveo-form-group-label' }, label));
    _.each(contents, (content: IFormWidgets) => {
      this.element.append(content.build());
    });
  }

  public build(): HTMLElement {
    return this.element.el;
  }
}
