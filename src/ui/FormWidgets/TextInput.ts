import { exportGlobally } from '../../GlobalExports';
import { SVGIcons } from '../../utils/SVGIcons';
import { $$, Dom } from '../../utils/Dom';
import { KEYBOARD } from '../../utils/KeyboardUtils';
import { IFormWidget, IFormWidgetSettable } from './FormWidgets';
import { SVGDom } from '../../utils/SVGDom';

export interface ITextInputOptions {
  /**
   * Whether to add a placeholder to the `TextInput` rather than a label.
   *
   * **Default:** `false`
   */
  usePlaceholder?: boolean;
  /**
   * The class name to add to the `TextInput`'s HTML element.
   *
   * **Default:** `coveo-input`
   */
  className?: string;
  /**
   * Whether to trigger the `TextInput`'s `onChange` function on every key press
   * rather than when the enter key is pressed or the input is blurred.
   *
   * **Default:** `false`
   */
  triggerOnChangeAsYouType?: boolean;
  /**
   * Whether to set the required attribute to `true` or `false`.
   *
   * **Default:** `true`
   */
  isRequired?: boolean;
  /**
   * A custom aria-label attribute to add to the `TextInput`'s HTML element.
   */
  ariaLabel?: string;
  /**
   * The name or svg source of an icon to display inside the input at its beginning.
   *
   * **Default:** `null`
   */
  prefixingIcon?: string;
}

const defaultOptions: ITextInputOptions = {
  usePlaceholder: false,
  className: 'coveo-input',
  triggerOnChangeAsYouType: false,
  isRequired: true,
  prefixingIcon: null
};

/**
 * A text input widget with standard styling.
 */
export class TextInput implements IFormWidget, IFormWidgetSettable {
  private element: HTMLElement;
  private input: Dom;
  private icon: Dom;
  private lastQueryText: string = '';

  static doExport() {
    exportGlobally({
      TextInput: TextInput
    });
  }

  /**
   * Creates a new `TextInput`.
   * @param onChange The function to call when the value entered in the text input changes. This function takes the
   * current `TextInput` instance as an argument.
   * @param name The text to display in the text input label or placeholder.
   */
  constructor(
    public onChange: (textInput: TextInput) => void = (textInput: TextInput) => {},
    public name?: string,
    private options?: ITextInputOptions
  ) {
    this.options = {
      ...defaultOptions,
      ...this.options
    };

    this.buildContent();
    this.buildIcon();
  }

  /**
   * Gets the element on which the text input is bound.
   * @returns {HTMLElement} The text input element.
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Gets the value currently entered in the text input.
   * @returns {string} The text input current value.
   */
  public getValue(): string {
    return (<HTMLInputElement>$$(this.element).find('input')).value;
  }

  /**
   * Sets the value in the text input.
   * @param value The value to set the text input to.
   */
  public setValue(value: string) {
    const currentValue = this.getValue();
    (<HTMLInputElement>$$(this.element).find('input')).value = value;
    if (currentValue != value) {
      this.onChange(this);
    }
    this.lastQueryText = this.getInput().value;
  }

  /**
   * Resets the text input.
   */
  public reset() {
    const currentValue = this.getValue();
    (<HTMLInputElement>$$(this.element).find('input')).value = '';
    if (currentValue != '') {
      this.onChange(this);
    }
    this.lastQueryText = this.getInput().value;
  }

  /**
   * Gets the element on which the text input is bound.
   * @returns {HTMLElement} The text input element.
   */
  public build() {
    return this.element;
  }

  /**
   * Gets the `input` element (the text input itself).
   * @returns {HTMLElement} The `input` element.
   */
  public getInput(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }

  private buildContent() {
    this.element = $$('div', { className: this.options.className }).el;
    this.input = $$('input', { type: 'text' });

    this.options.isRequired && this.input.setAttribute('required', 'true');
    this.options.ariaLabel && this.input.setAttribute('aria-label', this.options.ariaLabel);

    this.addEventListeners();

    this.element.appendChild(this.input.el);
    this.name && this.createLabelOrPlaceholder();
  }

  private buildIcon() {
    if (!this.options.prefixingIcon) {
      return;
    }
    const iconClassName = `${this.options.className}-icon`;
    this.icon = $$('span', { className: iconClassName });
    this.icon.setHtml(SVGIcons.icons[this.options.prefixingIcon] || this.options.prefixingIcon);
    SVGDom.addClassToSVGInContainer(this.icon.el, `${iconClassName}-svg`);
    $$(this.element).prepend(this.icon.el);
  }

  private addEventListeners() {
    this.options.triggerOnChangeAsYouType ? this.addOnTypeEventListener() : this.addOnChangeEventListener();
  }

  private addOnChangeEventListener() {
    this.input.on(['keydown', 'blur'], (e: Event) => {
      if (e.type == 'blur' || (<KeyboardEvent>e).keyCode == KEYBOARD.ENTER) {
        this.triggerChange();
      }
    });
  }

  private addOnTypeEventListener() {
    this.input.on(['keyup'], () => {
      this.triggerChange();
    });
  }

  private createLabelOrPlaceholder() {
    if (this.options.usePlaceholder) {
      return this.input.setAttribute('placeholder', this.name);
    }

    const label = $$('label');
    label.text(this.name);
    this.element.appendChild(label.el);
  }

  private triggerChange() {
    if (this.lastQueryText != this.getInput().value) {
      this.onChange(this);
      this.lastQueryText = this.getInput().value;
    }
  }
}
