import { IFormWidget } from './FormWidgets';
import { Dom, $$ } from '../../utils/Dom';
import * as _ from 'underscore';

import 'styling/vapor/_FormGroup';
import { exportGlobally } from '../../GlobalExports';

/**
 * A simple `fieldset` HTMLElement, containing multiple form widgets
 */
export class FormGroup {
  private element: Dom;

  static doExport() {
    exportGlobally({
      'FormGroup': FormGroup
    });
  }

  /**
   * Create a new FormGroup which is a simple `fieldset` HTMLElement, containing multiple form widgets
   * @param contents
   * @param label
   */
  constructor(contents: IFormWidget[], label: string) {
    this.element = $$('fieldset', { className: 'coveo-form-group' }, $$('span', { className: 'coveo-form-group-label' }, label));
    _.each(contents, (content: IFormWidget) => {
      this.element.append(content.build());
    });
  }

  /**
   * Return the element on which the fieldset is bound
   * @returns {HTMLElement}
   */
  public build(): HTMLElement {
    return this.element.el;
  }
}
