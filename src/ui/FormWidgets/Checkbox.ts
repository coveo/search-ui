import 'styling/vapor/_Checkbox';
import { exportGlobally } from '../../GlobalExports';
import { $$ } from '../../utils/Dom';
import { IFormWidgetSelectable, IFormWidgetWithLabel } from './FormWidgets';

/**
 * A checkbox widget with standard styling.
 */
export class Checkbox implements IFormWidgetWithLabel, IFormWidgetSelectable {
  protected element: HTMLElement;
  protected checkbox: HTMLInputElement;
  private button: HTMLElement;
  private ignoreNextChange = false;

  static doExport = () => {
    exportGlobally({
      Checkbox: Checkbox
    });
  };

  /**
   * Creates a new `Checkbox`.
   * @param onChange The function to call when the checkbox state changes. This function takes the current `Checkbox`
   * instance as an argument.
   * @param label The label to display next to the checkbox.
   */
  constructor(
    public onChange: (checkbox: Checkbox) => void = (checkbox: Checkbox) => {},
    public label: string,
    public ariaLabel?: string,
    public labelSuffix?: string
  ) {
    this.buildContent();
  }

  /**
   * Toggles the checkbox state.
   */
  public toggle() {
    this.checkbox.checked = !this.isSelected();
    $$(this.checkbox).trigger('change');
  }

  /**
   * Gets the element on which the checkbox is bound.
   * @returns {HTMLElement} The checkbox element.
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Gets the element on which the checkbox is bound.
   * @returns {HTMLElement} The checkbox element.
   */
  public build(): HTMLElement {
    return this.element;
  }

  /**
   * Gets the checkbox [`label`]{@link Checkbox.label} value.
   * @returns {string} The checkbox label value.
   */
  public getValue() {
    return this.label;
  }

  /**
   * Resets the checkbox.
   */
  public reset() {
    const currentlyChecked = this.isSelected();
    this.checkbox.checked = false;
    if (currentlyChecked) {
      $$(this.checkbox).trigger('change');
    }
  }

  /**
   * Select the checkbox
   * @param triggerChange will trigger change even if specified and not already selected
   */
  public select(triggerChange = true) {
    const currentlyChecked = this.isSelected();
    this.checkbox.checked = true;
    if (!currentlyChecked) {
      this.ignoreNextChange = !triggerChange;
      $$(this.checkbox).trigger('change');
    }
  }

  /**
   * Indicates whether the checkbox is checked.
   * @returns {boolean} `true` if the checkbox is checked, `false` otherwise.
   */
  public isSelected() {
    return this.checkbox.checked;
  }

  /**
   * Gets the element on which the checkbox [`label`]{@link Checkbox.label} is bound.
   * @returns {HTMLElement} The `label` element.
   */
  public getLabel() {
    return this.element;
  }

  private buildContent() {
    const label = $$('label', {
      className: 'coveo-checkbox-label'
    });

    this.checkbox = <HTMLInputElement>$$('input', {
      type: 'checkbox',
      className: 'coveo-checkbox',
      value: this.label,
      ariaLabel: this.ariaLabel || this.label,
      ariaHidden: true
    }).el;
    this.button = $$('button', {
      type: 'button',
      role: 'checkbox',
      className: 'coveo-checkbox-button',
      ariaLabel: this.ariaLabel || this.label,
      ariaChecked: this.isSelected().toString()
    }).el;
    const labelSpan = $$('span', { className: 'coveo-checkbox-span-label' });
    labelSpan.text(this.label);

    const labelSuffixSpan = $$('span', { className: 'coveo-checkbox-span-label-suffix' });
    labelSuffixSpan.text(this.labelSuffix);

    label.append(this.checkbox);
    label.append(this.button);
    label.append(labelSpan.el);
    this.labelSuffix && label.append(labelSuffixSpan.el);

    $$(this.button).on('click', (e: Event) => {
      e.preventDefault();
      this.toggle();
    });

    $$(this.checkbox).on('change', () => {
      this.updateAccessibilityAttributes();
      if (!this.ignoreNextChange) {
        this.onChange(this);
      } else {
        this.ignoreNextChange = false;
      }
    });
    this.element = label.el;
  }

  private updateAccessibilityAttributes() {
    this.button.setAttribute('aria-checked', this.isSelected().toString());
  }
}
