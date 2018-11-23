import { IFormWidget } from './FormWidgets';
import { Dom, $$ } from '../../utils/Dom';
import * as _ from 'underscore';

import 'styling/vapor/_FormGroup';
import { exportGlobally } from '../../GlobalExports';

/**
 * A simple `fieldset` HTMLElement containing multiple form widgets.
 */
export class FormGroup {
  private element: Dom;
  public labelElement: Dom;

  static doExport() {
    exportGlobally({
      FormGroup: FormGroup
    });
  }

  /**
   * Creates a new `FormGroup`.
   * @param contents The form widgets to include in the form group.
   * @param label The label to display for the form group.
   */
  constructor(contents: IFormWidget[], label: string) {
    this.labelElement = $$('span', { className: 'coveo-form-group-label' });
    this.labelElement.text(label);
    this.element = $$('fieldset', { className: 'coveo-form-group' }, this.labelElement);
    _.each(contents, (content: IFormWidget) => {
      this.element.append(content.build());
    });
  }

  /**
   * Gets the element on which the form group is bound.
   * @returns {HTMLElement} The form group element.
   */
  public build(): HTMLElement {
    return this.element.el;
  }
}
