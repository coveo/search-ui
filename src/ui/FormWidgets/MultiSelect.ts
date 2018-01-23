import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import { l } from '../../strings/Strings';
import 'styling/vapor/_MultiSelect';
import { Utils } from '../../utils/Utils';
import { exportGlobally } from '../../GlobalExports';

/**
 * A multi select widget with standard styling.
 */
export class MultiSelect implements IFormWidget, IFormWidgetSettable {
  private element: HTMLSelectElement;

  static doExport() {
    exportGlobally({
      MultiSelect: MultiSelect
    });
  }

  /**
   * Creates a new `MultiSelect`.
   * @param onChange The function to call when the widget selected values change. This function takes the current
   * `MultiSelect` instance as an argument.
   * @param options The values which can be selected with the multi select.
   * @param label The label to display for the multi select.
   */
  constructor(
    public onChange: (multiSelect: MultiSelect) => void = (multiSelect: MultiSelect) => {},
    public options: string[],
    public label: string
  ) {
    this.buildContent();
  }

  /**
   * Gets the element on which the multi select is bound.
   * @returns {HTMLSelectElement} The multi select element.
   */
  public build(): HTMLElement {
    return this.element;
  }

  /**
   * Gets the element on which the multi select is bound.
   * @returns {HTMLSelectElement} The multi select element.
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Gets the currently selected values.
   * @returns {string[]} The array of selected multi select values.
   */
  public getValue(): string[] {
    return _.chain(<any>this.element.options)
      .toArray()
      .filter((opt: HTMLOptionElement) => opt.selected)
      .map((selected: HTMLOptionElement) => selected.value)
      .value();
  }

  /**
   * Gets the currently un-selected values.
   * @returns {string[]} The array of un-selected multi select values.
   */
  public getUnselectedValues(): string[] {
    return _.chain(<any>this.element.options)
      .toArray()
      .filter((opt: HTMLOptionElement) => !opt.selected)
      .map((selected: HTMLOptionElement) => selected.value)
      .value();
  }

  /**
   * Sets the currently selected values.
   * @param values The values to select.
   */
  public setValue(values: string[]) {
    const currentlySelected = this.getValue();

    const currentStateSplit = _.partition(_.toArray(this.element.options), (opt: HTMLOptionElement) =>
      _.contains(currentlySelected, opt.value)
    );
    const newStateToApplySplit = _.partition(_.toArray(this.element.options), (opt: HTMLOptionElement) => _.contains(values, opt.value));

    _.each(newStateToApplySplit[0], (toSelect: HTMLOptionElement) => (toSelect.selected = true));
    _.each(newStateToApplySplit[1], (toUnSelect: HTMLOptionElement) => (toUnSelect.selected = false));

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
   * Resets the multi select.
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
    const options = _.map(this.options, opt => {
      return $$('option', { value: opt, className: 'mdc-list-item' }, l(opt));
    });
    _.each(options, opt => optgroup.append(opt.el));
    this.element.appendChild(optgroup.el);
    $$(this.element).on('change', () => this.onChange(this));
  }
}
