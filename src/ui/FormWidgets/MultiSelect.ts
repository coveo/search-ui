import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import { l } from '../../strings/Strings';
import 'styling/vapor/_MultiSelect';

/**
 * A select with multiple possible selection, with standard styling
 */
export class MultiSelect implements IFormWidget, IFormWidgetSettable {
  private element: HTMLSelectElement;

  /**
   * Create a new MultiSelect
   * @param onChange Called when the selection changes, with the `MultiSelect` instance as a callback
   * @param options
   * @param label
   */
  constructor(public onChange: (multiSelect: MultiSelect) => void = (multiSelect: MultiSelect) => {
  }, public options: string[], public label: string) {
    this.buildContent();
  }

  /**
   * Return the HTMLElement bound to the multi select
   * @returns {HTMLSelectElement}
   */
  public build(): HTMLElement {
    return this.element;
  }

  /**
   * Return the HTMLElement bound to the multi select
   * @returns {HTMLSelectElement}
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Get the array of values currently selected in the MultiSelect
   * @returns {string[]}
   */
  public getValue(): string[] {
    return _.chain(<any>this.element.options)
      .toArray()
      .filter((opt: HTMLOptionElement) => opt.selected)
      .map((selected: HTMLOptionElement) => selected.value)
      .value();
  }

  /**
   * Set the currently selected values
   * @param values
   */
  public setValue(values: string[]) {
    const split = _.partition(_.toArray(this.element.options), (opt: HTMLOptionElement) => _.contains(values, opt.value));

    _.each(split[0], (toSelect: HTMLOptionElement) => toSelect.selected = true);
    _.each(split[1], (toUnSelect: HTMLOptionElement) => toUnSelect.selected = false);

    $$(this.element).trigger('change');
  }

  /**
   * Reset the currently selected values
   */
  public reset() {
    this.element.selectedIndex = -1;
    $$(this.element).trigger('change');
  }

  private buildContent() {
    this.element = <HTMLSelectElement>$$('select', {
      className: 'mdc-multi-select mdl-list',
      multiple: '',
      size: this.options.length.toString()
    }).el;
    const optgroup = $$('optgroup', {
      className: 'mdc-list-group',
      label: this.label
    });
    const options = _.map(this.options, (opt) => {
      return $$('option', { value: opt, className: 'mdc-list-item' }, l(opt));
    });
    _.each(options, (opt) => optgroup.append(opt.el));
    this.element.appendChild(optgroup.el);
    $$(this.element).on('change', () => this.onChange(this));
  }
}
