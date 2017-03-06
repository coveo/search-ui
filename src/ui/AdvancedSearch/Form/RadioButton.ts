import { $$ } from '../../../utils/Dom';

/**
 * This class will create a radio button meant to be used inside the {@link AdvancedSearch} component.
 *
 * It can be, more specifically, used for external code using the {@link AdvancedSearchEvents.buildingAdvancedSearch}
 */
export class RadioButton {

  protected element: HTMLElement;

  /**
   * Create a new Radio button.
   * @param onChange will be called every time the radio button change it's value. `this` will be the `RadioButton` instance.
   * @param label The label for the choice.
   */
  constructor(public onChange: () => void = () => {
  }, public label: string) {
    this.buildContent();
  }

  /**
   * Reset the radio button
   */
  public reset() {
    (<HTMLInputElement>this.element).checked = false;
  }

  /**
   * Return the element on which the dropdown is bound.
   * @returns {HTMLElement}
   */
  public build(): HTMLElement {
    return this.element;
  }

  /**
   * Return the element on which the dropdown is bound.
   * @returns {HTMLElement}
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  public getValue(): string {
    return '';
  }

  /**
   * Return true if the radio button is selected.
   * @returns {boolean}
   */
  public isSelected(): boolean {
    return this.getRadio().checked;
  }

  /**
   * Get the input element (the radio button itself).
   * @returns {HTMLInputElement}
   */
  public getRadio(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }

  /**
   * Get the label element.
   * @returns {HTMLLabelElement}
   */
  public getLabel(): HTMLLabelElement {
    return <HTMLLabelElement>$$(this.element).find('label');
  }

  private buildContent() {
    let section = $$('div', { className: 'coveo-advanced-search-radio-section' });
    let radioOption = $$('div', { className: 'coveo-radio' });
    let radioInput = $$('input', { type: 'radio', name: 'coveo-advanced-search-radio-input', id: this.label });
    let labelInput = $$('label', { className: 'coveo-advanced-search-radio-input-label', 'for': this.label });
    labelInput.text(this.label);
    radioInput.on('change', () => {
      this.onChange();
    });

    radioOption.append(radioInput.el);
    radioOption.append(labelInput.el);
    section.append(radioOption.el);
    this.element = section.el;
  }

}
