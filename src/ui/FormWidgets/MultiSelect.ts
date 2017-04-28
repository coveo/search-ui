import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import { l } from '../../strings/Strings';
import 'styling/vapor/_MultiSelect';
import { Utils } from '../../utils/Utils';
import { exportGlobally } from '../../GlobalExports';

/**
 * A select with multiple possible selection, with standard styling
 */
export class MultiSelect implements IFormWidget, IFormWidgetSettable {
  private element: HTMLSelectElement;

  static doExport() {
    exportGlobally({
      'MultiSelect': MultiSelect
    });
  }

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
   * Get the array of values that are not currently selected in the MultiSelect
   * @returns {string[]}
   */
  public getUnselectedValues(): string[] {
    return _.chain(<any>this.element.options)
      .toArray()
      .filter((opt: HTMLOptionElement) => !opt.selected)
      .map((selected: HTMLOptionElement) => selected.value)
      .value();
  }

  /**
   * Set the currently selected values
   * @param values
   */
  public setValue(values: string[]) {
    const currentlySelected = this.getValue();

    const currentStateSplit = _.partition(_.toArray(this.element.options), (opt: HTMLOptionElement) => _.contains(currentlySelected, opt.value));
    const newStateToApplySplit = _.partition(_.toArray(this.element.options), (opt: HTMLOptionElement) => _.contains(values, opt.value));

    _.each(newStateToApplySplit[0], (toSelect: HTMLOptionElement) => toSelect.selected = true);
    _.each(newStateToApplySplit[1], (toUnSelect: HTMLOptionElement) => toUnSelect.selected = false);

    let hasChanged = false;
    if (!Utils.arrayEqual(currentStateSplit[0], newStateToApplySplit[0], false)) {
      hasChanged = true;
    }
    if (!Utils.arrayEqual(currentStateSplit[1], newStateToApplySplit[1], false)) {
      hasChanged = true;
    }

    if (hasChanged) {
      $$(this.element).trigger('change');
    }
  }

  /**
   * Reset the currently selected values
   */
  public reset() {
    const currentlySelected = this.getValue();
    this.element.selectedIndex = -1;
    if (!Utils.isEmptyArray(currentlySelected)) {
      $$(this.element).trigger('change');
    }
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
